import { useState, ChangeEvent, FormEvent } from 'react'
import { Mail, Globe2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

export default function Contact() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: 'Error',
        description: 'Please fill all fields',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      toast({
        title: 'Success',
        description: 'Thank you! We will get back to you soon.',
      })
      setFormData({ name: '', email: '', message: '' })
    } catch (error: any) {
      console.error(error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-500/15 blur-3xl" />
        <div className="absolute top-40 -right-16 w-80 h-80 bg-pink-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-[0.2em] text-slate-300">We’re here to help</p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-white">Contact Us</h1>
          <p className="mt-3 text-slate-300 max-w-2xl mx-auto">Have questions or need support? Drop us a message and we’ll get back to you soon.</p>
        </div>

        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-blue-500/10">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-slate-300">Let us know how we can help</p>
                <h2 className="text-2xl font-semibold text-white mt-1">Send a Message</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-slate-200">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-200">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                    className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-slate-200">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Share the details..."
                    rows={6}
                    required
                    className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-70"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-emerald-500/10 flex flex-col gap-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Other ways to reach us</h2>
              <p className="text-slate-300">Prefer email or need to visit the site? We’re responsive on both.</p>
            </div>

            <div className="space-y-4">
              <a
                href="mailto:ayus.universal@gmail.com"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 hover:border-blue-400/50 hover:text-white transition"
              >
                <Mail className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm text-slate-300">Email</p>
                  <p className="font-semibold">ayus.universal@gmail.com</p>
                </div>
              </a>

              <a
                href="https://timestamper.site"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 hover:border-emerald-400/50 hover:text-white transition"
              >
                <Globe2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-sm text-slate-300">Website</p>
                  <p className="font-semibold">www.timestamper.site</p>
                </div>
              </a>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200">
              <p className="text-sm text-slate-400">Response time</p>
              <p className="font-semibold">Under 24 hours on business days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
