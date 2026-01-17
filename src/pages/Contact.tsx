import { useState, ChangeEvent, FormEvent } from 'react'
import { Mail, Globe2, Send, MessageSquare, User } from 'lucide-react'
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
      const API_URL = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://timestamper-backend-o44d.onrender.com')
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
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Advanced Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Main gradient orbs with animations */}
        <div className="absolute -top-10 -left-10 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/30 via-cyan-500/20 to-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-40 -right-16 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/25 via-teal-500/15 to-emerald-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        
        {/* Floating particles */}
        <div className="absolute top-32 left-1/4 w-2 h-2 bg-blue-400/40 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-emerald-400/40 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-1/2 w-2 h-2 bg-purple-400/40 rounded-full animate-ping" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header Section with Enhanced Styling */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          {/* <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-purple-500/10 border border-white/10 backdrop-blur-xl text-xs uppercase tracking-[0.25em] text-slate-300 font-semibold mb-4 shadow-lg">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            We're here to help
          </div> */}
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Have questions or need support? Drop us a message and we'll get back to you soon.
          </p>
        </div>

        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Main Form Card with Advanced Styling */}
          <div className="relative group">
            {/* Glow effect behind card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500 animate-pulse" style={{ animationDuration: '3s' }} />
            
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-2xl p-6 shadow-2xl transition-all duration-500 hover:shadow-blue-500/20 hover:border-blue-500/30">
              {/* Top accent line */}
              <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
              
              <div className="space-y-4">
                {/* Header with icon */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl blur-md opacity-50" />
                    <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center transform transition-all duration-300 hover:scale-110">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Let us know how we can help</p>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Send a Message</h2>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-400" /> Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 h-12 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 hover:border-slate-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-emerald-400" /> Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 h-12 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 hover:border-slate-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-purple-400" /> Your Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us what's on your mind..."
                      rows={4}
                      required
                      className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:border-slate-500 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500 hover:from-blue-600 hover:via-emerald-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" />
                        Send Message
                      </span>
                    )}
                  </Button>
                </form>
                
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50" />
              </div>
            </div>
          </div>

          {/* Sidebar - Contact Info */}
          <div className="relative group">
            {/* Glow effect behind card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500 animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
            
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-2xl p-6 shadow-2xl flex flex-col gap-4 transition-all duration-500 hover:shadow-emerald-500/20 hover:border-emerald-500/30">
              {/* Top accent line */}
              <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
              
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-2">Other Ways to Reach Us</h2>
                <p className="text-slate-400">Prefer email or need to visit the site? We're responsive on both.</p>
              </div>

              <div className="space-y-4">
                {/* Email Card */}
                <a
                  href="mailto:ayus.universal@gmail.com"
                  className="group/card relative block"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-0 group-hover/card:opacity-100 blur transition-all duration-300" />
                  <div className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-800/50 backdrop-blur-xl px-5 py-4 transition-all duration-300 group-hover/card:border-blue-400/50 group-hover/card:transform group-hover/card:scale-105 group-hover/card:shadow-lg group-hover/card:shadow-blue-500/20">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 group-hover/card:scale-110 transition-transform duration-300">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 mb-0.5">Email Us</p>
                      <p className="font-semibold text-white">ayus.universal@gmail.com</p>
                    </div>
                  </div>
                </a>

                {/* Website Card */}
                <a
                  href="https://timestamper.site"
                  target="_blank"
                  rel="noreferrer"
                  className="group/card relative block"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-0 group-hover/card:opacity-100 blur transition-all duration-300" />
                  <div className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-800/50 backdrop-blur-xl px-5 py-4 transition-all duration-300 group-hover/card:border-emerald-400/50 group-hover/card:transform group-hover/card:scale-105 group-hover/card:shadow-lg group-hover/card:shadow-emerald-500/20">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 group-hover/card:scale-110 transition-transform duration-300">
                      <Globe2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 mb-0.5">Visit Website</p>
                      <p className="font-semibold text-white">www.timestamper.site</p>
                    </div>
                  </div>
                </a>
              </div>

              {/* Response Time Card */}
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-20 blur" />
                <div className="relative rounded-2xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-xl px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">⏱️</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Response Time</p>
                      <p className="font-semibold text-white">Under 24 hours</p>
                      <p className="text-xs text-slate-500">on business days</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
