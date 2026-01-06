// src/pages/Pricing.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Check, Ticket } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

declare global {
  interface Window {
    Razorpay: any
  }
}

const plans = [
  { name: 'Free', price: 0, description: '3 exports/month' },
  { name: 'Pro', price: 10, description: '10 exports/month' },
  { name: 'Business', price: 40, description: '50 exports/month' },
  { name: 'Unlimited', price: 100, description: 'Unlimited exports/month' },
]

export default function Pricing() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [promoCode, setPromoCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [validatingPromo, setValidatingPromo] = useState(false)

  // Razorpay script load
  useEffect(() => {
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    )
    if (!existing) {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  const validatePromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error('Enter a promo code')
      return
    }

    setValidatingPromo(true)
    try {
      const API_URL = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://timestamper-backend-o44d.onrender.com')
      const res = await fetch(`${API_URL}/api/promo/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode.toUpperCase() }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Invalid promo code')
      }

      setDiscountPercent(data.discount)
      toast.success(`${data.discount}% discount applied!`)
    } catch (error: any) {
      toast.error(error.message || 'Invalid promo code')
      setDiscountPercent(0)
    } finally {
      setValidatingPromo(false)
    }
  }

  const getDiscountedPrice = (originalPrice: number) => {
    if (originalPrice === 0) return 0
    return originalPrice - (originalPrice * discountPercent / 100)
  }

  const verifyPayment = async (orderId: string, paymentId: string, signature: string) => {
    try {
      const API_URL = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://timestamper-backend-o44d.onrender.com')
      const res = await fetch(`${API_URL}/api/razorpay/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          paymentId,
          signature,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      toast.success(`${data.plan} plan activated! 🎉`)
      navigate('/')
    } catch (e: any) {
      console.error('Payment verification error:', e)
      toast.error(e.message || 'Verification failed')
    }
  }

  const handleSelectPlan = async (planName: string, price: number) => {
    if (!user) {
      toast.error('Please login to select a plan')
      navigate('/login?plan=true')
      return
    }

    if (planName === 'Free') {
      toast.success('You are already on Free plan')
      return
    }

    // Calculate final price with discount
    const finalPrice = getDiscountedPrice(price)

    // If free or less than ₹1 (Razorpay minimum), directly activate plan
    if (finalPrice < 1) {
      try {
        const API_URL = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://timestamper-backend-o44d.onrender.com')
        const res = await fetch(`${API_URL}/api/activate-free-plan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            plan: planName,
            promoCode: promoCode.toUpperCase(),
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Failed to activate plan')
        }

        toast.success(`${planName} plan activated! 🎉`)
        navigate('/')
        return
      } catch (e: any) {
        console.error(e)
        toast.error(e.message || 'Failed to activate plan')
        return
      }
    }

    try {
      const API_URL = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://timestamper-backend-o44d.onrender.com')
      const res = await fetch(`${API_URL}/api/razorpay/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(finalPrice * 100),
          currency: 'INR',
          plan: planName,
          userId: user.id,
          promoCode: promoCode.toUpperCase() || null,
        }),
      })

      const data = await res.json()
      console.log('🔍 Create order response:', { status: res.status, data })

      if (!res.ok) {
        console.error('❌ Order creation failed:', data)
        throw new Error(data.error || 'Failed to create order')
      }

      // Backend se jo shape aa raha hai:
      // { orderId, key, amount, currency }
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'AYUS UNIVERSAL',         
        description: `${planName} plan`,
        order_id: data.orderId,
        prefill: {
          email: user.email,
        },
        handler: (response: any) => {
          verifyPayment(data.orderId, response.razorpay_payment_id, response.razorpay_signature)
        },
        theme: {
          color: '#4f46e5',
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (e: any) {
      console.error(e)
      toast.error(e.message || 'Payment failed, please try again')
    }
  }

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-slate-900">
  //       <div className="text-white text-xl">Loading...</div>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-12">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
              Plan
            </span>
          </h1>
          <p className="text-xl text-slate-400">
            Select a plan to start using TimeStamper
          </p>
        </div>

        {/* Promo Code Section */}
        <div className="mb-12 p-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Ticket className="w-5 h-5 text-emerald-400" />
            <Input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="max-w-xs bg-slate-900/60 border-emerald-500/50 text-white placeholder:text-slate-500"
              onKeyPress={(e) => e.key === 'Enter' && validatePromoCode()}
            />
            <Button
              onClick={validatePromoCode}
              disabled={validatingPromo}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg"
            >
              {validatingPromo ? 'Validating...' : 'Apply'}
            </Button>
          </div>
          {discountPercent > 0 && (
            <p className="text-center text-emerald-300 text-sm mt-3">✓ {discountPercent}% discount applied!</p>
          )}
        </div>

        {!user && (
          <div className="mb-12 p-6 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-center">
            <p className="text-slate-300 mb-4">
              Please sign in to select a plan
            </p>
            <button
              onClick={() => navigate('/login?plan=true')}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg transition-all"
            >
              Sign In Now →
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border backdrop-blur-xl p-8 transition-all ${
                plan.name === 'Pro'
                  ? 'border-blue-500 bg-gradient-to-b from-blue-500/20 to-slate-900/50 scale-105'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              {plan.name === 'Pro' && (
                <div className="mb-4 inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-pink-500 text-white text-xs font-bold rounded-full">
                  POPULAR
                </div>
              )}

              <h3 className="text-2xl font-bold text-white mb-2">
                {plan.name}
              </h3>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent mb-2">
                {plan.price === 0 ? '₹0' : `₹${getDiscountedPrice(plan.price).toFixed(0)}`}
              </div>
              {discountPercent > 0 && plan.price > 0 && (
                <p className="text-sm text-emerald-400 line-through mb-2">₹{plan.price}</p>
              )}
              <p className="text-slate-400 mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-slate-300">
                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  {plan.description}
                </li>
              </ul>

              <button
                onClick={() => handleSelectPlan(plan.name, plan.price)}
                disabled={!user && loading}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  plan.name === 'Pro'
                    ? 'bg-gradient-to-r from-blue-500 to-pink-500 text-white hover:shadow-lg hover:shadow-blue-500/50'
                    : 'border-2 border-slate-600 text-slate-300 hover:bg-slate-700/50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {plan.name === 'Free' ? 'Start Free' : `Choose ${plan.name}`} →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}