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
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 pb-12 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          {/* <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 backdrop-blur-xl text-xs uppercase tracking-[0.25em] text-slate-300 font-semibold mb-6 shadow-lg">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            Flexible Pricing
          </div> */}
          <h1 className="text-5xl sm:text-6xl font-bold mb-4">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Plan
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Select a plan that fits your needs and start creating perfect timestamps
          </p>
        </div>

        {/* Promo Code Section - Compact Design */}
        <div className="flex justify-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative group max-w-lg w-full">
            {/* Compact promo code input */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl hover:border-emerald-500/30 transition-all duration-300">
              <Ticket className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <Input
                type="text"
                placeholder="Have a promo code?"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 h-8 bg-transparent border-none text-white placeholder:text-slate-500 focus:ring-0 focus:outline-none px-2 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && validatePromoCode()}
              />
              <Button
                onClick={validatePromoCode}
                disabled={validatingPromo || !promoCode.trim()}
                size="sm"
                className="h-8 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {validatingPromo ? 'Checking...' : 'Apply'}
              </Button>
            </div>
            
            {/* Success message */}
            {discountPercent > 0 && (
              <div className="absolute -bottom-7 left-0 right-0 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 backdrop-blur-xl">
                  <p className="text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    {discountPercent}% discount applied
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {!user && (
          <div className="relative group mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-all duration-500" />
            <div className="relative rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-yellow-500/10 backdrop-blur-xl p-6 text-center">
              <p className="text-slate-300 mb-4 text-lg">
                🔐 Please sign in to select a plan
              </p>
              <button
                onClick={() => navigate('/login?plan=true')}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
              >
                Sign In Now →
              </button>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan, index) => {
            const isUserPlan = user && (user.plan || 'Free') === plan.name;
            
            return (
              <div
                key={plan.name}
                className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute -inset-1 bg-gradient-to-r rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500 ${
                  isUserPlan
                    ? 'from-blue-500 via-purple-500 to-pink-500'
                    : 'from-blue-500/50 via-purple-500/50 to-pink-500/50'
                }`} />
                
                <div
                  className={`relative rounded-3xl border backdrop-blur-2xl p-8 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 ${
                    isUserPlan
                      ? 'border-blue-500/50 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-pink-500/20 shadow-xl shadow-blue-500/20 scale-[1.02]'
                      : 'border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 hover:border-blue-500/30'
                  }`}
                >
                <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
                
                {/* YOUR PLAN Badge - Shows on user's current plan */}
                {user && (user.plan || 'Free') === plan.name && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="relative group/badge">
                      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-md opacity-60 animate-pulse" />
                      <div className="relative px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full shadow-xl flex items-center gap-2">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        YOUR PLAN
                      </div>
                    </div>
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <span className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {plan.price === 0 ? '₹0' : `₹${getDiscountedPrice(plan.price).toFixed(0)}`}
                  </span>
                  <span className="text-slate-400 text-sm">/month</span>
                </div>
                {discountPercent > 0 && plan.price > 0 && (
                  <p className="text-sm text-slate-400 line-through mb-4">₹{plan.price}</p>
                )}
                <p className="text-slate-400 mb-6 text-sm">{plan.description}</p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-slate-300">
                    <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm">{plan.description}</span>
                  </li>
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan.name, plan.price)}
                  disabled={!user && loading}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                    plan.name === 'Pro'
                      ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105'
                      : 'border-2 border-slate-600 text-slate-300 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-pink-500/10 hover:border-blue-500/50'
                  }`}
                >
                  {plan.name === 'Free' ? 'Start Free' : `Choose ${plan.name}`} →
                </button>
                
                <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50" />
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}