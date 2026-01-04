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
    <div className="rounded-xl bg-slate-900/80 border border-slate-700/60 shadow-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-1 text-center">
        {mode === 'signin' ? 'Welcome back' : 'Create your account'}
      </h2>
      <p className="text-slate-400 text-sm mb-6 text-center">
        Sign in to continue using TimeStamper
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div className="space-y-1">
            <Label htmlFor="name" className="text-slate-200">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading || initialLoading}
            />
          </div>
        )}

        <div className="space-y-1">
          <Label htmlFor="email" className="text-slate-200">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || initialLoading}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password" className="text-slate-200">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || initialLoading}
          />
        </div>

        {(localError || error) && (
          <p className="text-sm text-red-400">
            {localError || error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full mt-2"
          disabled={loading || initialLoading}
        >
          {loading || initialLoading
            ? 'Please wait...'
            : mode === 'signin'
            ? 'Sign In'
            : 'Sign Up'}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm text-slate-400">
        {mode === 'signin' ? (
          <>
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('signup')}
              className="text-blue-400 hover:underline"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('signin')}
              className="text-blue-400 hover:underline"
            >
              Sign in
            </button>
          </>
        )}
      </div>
    </div>
  )
}
