import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error('Missing SUPABASE_URL');
  process.exit(1);
}
if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000'],
  credentials: true,
}));
app.use(bodyParser.json());

const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const LIMITS = {
  Free: 3,
  Pro: 10,
  Business: 50,
  Unlimited: null,
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', port: PORT });
});

app.get('/api/subscription/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const { data: sub, error } = await supabaseService
      .from('user_subscriptions')
      .select('plan, exports_used, exports_limit')
      .eq('user_id', userId)
      .single();

    if (error || !sub) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    return res.json({
      plan: sub.plan,
      exportsUsed: sub.exports_used,
      exportsLimit: sub.exports_limit,
      exportsRemaining: LIMITS[sub.plan] !== null ? LIMITS[sub.plan] - sub.exports_used : null,
    });
  } catch (err) {
    console.error('get subscription error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/razorpay/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', plan, userId } = req.body;
    if (!userId || !plan) {
      return res.status(400).json({ error: 'userId and plan are required' });
    }

    const options = {
      amount,
      currency,
      receipt: `order_rcptid_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    await supabaseService.from('payment_intents').insert({
      user_id: userId,
      plan,
      razorpay_order_id: order.id,
      status: 'created',
    });

    return res.json({
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error('create-order error:', err);
    return res.status(500).json({ error: 'Failed to create order' });
  }
});

app.post('/api/razorpay/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.warn('Invalid webhook signature');
      return res.status(400).send('Invalid signature');
    }

    const event = req.body.event;
    if (event !== 'payment.captured') {
      return res.status(200).send('Ignored');
    }

    const paymentEntity = req.body.payload.payment.entity;
    const orderId = paymentEntity.order_id;

    const { data: intent, error: intentError } = await supabaseService
      .from('payment_intents')
      .select('user_id, plan')
      .eq('razorpay_order_id', orderId)
      .single();

    if (intentError || !intent) {
      console.error('payment_intents lookup error:', intentError);
      return res.status(400).send('Intent not found');
    }

    const userId = intent.user_id;
    const plan = intent.plan;

    await supabaseService.from('user_subscriptions').upsert(
      {
        user_id: userId,
        plan,
        status: 'active',
        exports_used: 0,
        exports_limit: LIMITS[plan] ?? null,
      },
      { onConflict: 'user_id' },
    );

    await supabaseService
      .from('payment_intents')
      .update({
        status: 'success',
        razorpay_payment_id: paymentEntity.id,
      })
      .eq('razorpay_order_id', orderId);

    return res.status(200).send('OK');
  } catch (err) {
    console.error('webhook error:', err);
    return res.status(500).send('Server error');
  }
});

app.post('/api/export', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const { data: sub, error: subError } = await supabaseService
      .from('user_subscriptions')
      .select('plan, exports_used')
      .eq('user_id', userId)
      .single();

    if (subError || !sub) {
      return res.status(400).json({ error: 'Subscription not found' });
    }

    const max = LIMITS[sub.plan] ?? null;

    if (max !== null && sub.exports_used >= max) {
      return res.status(403).json({
        error: 'Export limit reached for your plan',
        plan: sub.plan,
        used: sub.exports_used,
        max,
      });
    }

    await supabaseService
      .from('user_subscriptions')
      .update({ exports_used: sub.exports_used + 1 })
      .eq('user_id', userId);

    await supabaseService.from('exports').insert({
      user_id: userId,
      format: 'csv',
    });

    return res.json({
      ok: true,
      plan: sub.plan,
      used: sub.exports_used + 1,
      max,
    });
  } catch (err) {
    console.error('/api/export error:', err);
    return res.status(500).json({ error: 'Server error during export' });
  }
});

app.post('/api/razorpay/verify-payment', async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const data = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(data)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const { data: intent, error: intentError } = await supabaseService
      .from('payment_intents')
      .select('user_id, plan')
      .eq('razorpay_order_id', orderId)
      .single();

    if (intentError || !intent) {
      return res.status(400).json({ error: 'Intent not found' });
    }

    const userId = intent.user_id;
    const plan = intent.plan;

    await supabaseService.from('user_subscriptions').upsert(
      {
        user_id: userId,
        plan,
        status: 'active',
        exports_used: 0,
        exports_limit: LIMITS[plan] ?? null,
      },
      { onConflict: 'user_id' },
    );

    return res.json({
      ok: true,
      plan,
      message: `Successfully upgraded to ${plan}!`,
    });
  } catch (err) {
    console.error('verify-payment error:', err);
    return res.status(500).json({ error: 'Verification failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Razorpay server running on http://localhost:${PORT}`);
});
