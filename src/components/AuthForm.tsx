import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validatePassword = (password: string) => {
  return password.length >= 6
}

export default function AuthForm() {
  const { signIn, signUp, loading, initialLoading, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const fromPlan = new URLSearchParams(location.search).get('plan')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (!email || !password || (mode === 'signup' && !name)) {
      setLocalError('Please fill in all fields')
      return
    }

    if (!emailRegex.test(email)) {
      setLocalError('Please enter a valid email address')
      return
    }

    if (mode === 'signup' && !validatePassword(password)) {
      setLocalError('Password must be at least 6 characters')
      return
    }

    let ok = false
    if (mode === 'signup') {
      ok = await signUp(email, password, name)
    } else {
      ok = await signIn(email, password)
    }

    if (!ok) {
      if (error) {
        toast.error(error)
      } else {
        toast.error('Authentication failed')
      }
      return
    }

    toast.success(mode === 'signup' ? 'Account created!' : 'Logged in!')

    if (fromPlan) {
      navigate('/pricing', { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }

  return (
    <div className="relative group">
      {/* Glow effect behind card */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-500 animate-pulse" style={{ animationDuration: '3s' }} />
      
      {/* Main card with advanced glassmorphism */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border border-slate-700/50 backdrop-blur-2xl shadow-2xl p-8 transition-all duration-500 hover:shadow-blue-500/20 hover:border-blue-500/30">
        {/* Top accent line */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
        
        {/* Logo/Icon section */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-50" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-0.5 transform transition-all duration-500 hover:scale-110 hover:rotate-3 shadow-lg">
              <div className="w-full h-full bg-slate-900 rounded-2xl p-2 flex items-center justify-center">
                <img 
                  src="/TimeStamper Logo.png" 
                  alt="TimeStamper Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Title with gradient */}
        <h2 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          {mode === 'signin' ? 'Welcome Back' : 'Join TimeStamper'}
        </h2>
        <p className="text-slate-400 text-sm mb-8 text-center">
          {mode === 'signin' ? 'Sign in to continue your journey' : 'Create an account to get started'}
        </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {mode === 'signup' && (
          <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
            <Label htmlFor="name" className="text-slate-300 font-medium flex items-center gap-2">
              <span className="text-blue-400">👤</span> Name
            </Label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading || initialLoading}
              className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 h-12 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 hover:border-slate-500"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-300 font-medium flex items-center gap-2">
            <span className="text-purple-400">📧</span> Email
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || initialLoading}
            className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 h-12 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:border-slate-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-300 font-medium flex items-center gap-2">
            <span className="text-pink-400">🔒</span> Password
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || initialLoading}
            className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 h-12 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300 hover:border-slate-500"
          />
          {mode === 'signup' && (
            <p className="text-xs text-slate-500 mt-1">Minimum 6 characters required</p>
          )}
        </div>

        {(localError || error) && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2">
              <span className="text-red-400">⚠️</span>
              <p className="text-sm text-red-400 flex-1">
                {localError || error}
              </p>
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-12 mt-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
          disabled={loading || initialLoading}
        >
          {loading || initialLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              {mode === 'signin' ? '🚀 Sign In' : '✨ Create Account'}
            </span>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-slate-900/90 px-2 text-slate-500">or</span>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="text-center text-sm">
        {mode === 'signin' ? (
          <p className="text-slate-400">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('signup')}
              className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-semibold hover:from-blue-300 hover:to-purple-300 transition-all duration-300 transform hover:scale-105 inline-block"
            >
              Sign up now →
            </button>
          </p>
        ) : (
          <p className="text-slate-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('signin')}
              className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-semibold hover:from-blue-300 hover:to-purple-300 transition-all duration-300 transform hover:scale-105 inline-block"
            >
              Sign in →
            </button>
          </p>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50" />
      </div>
    </div>
  )
}
