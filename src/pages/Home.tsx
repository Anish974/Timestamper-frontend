import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Play, Clock, Sparkles, Zap, Music, Video, ArrowRight, Check } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        {/* Advanced Animated Background - Login style */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Main gradient orbs with advanced animations */}
          <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/30 via-cyan-500/20 to-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
          
          {/* Floating particles effect */}
          <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400/40 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute top-40 right-40 w-3 h-3 bg-pink-400/40 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-blue-400/40 rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }} />
          <div className="absolute bottom-20 right-1/4 w-3 h-3 bg-cyan-400/40 rounded-full animate-ping" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 border border-purple-500/20 rounded-full mb-8 backdrop-blur-xl shadow-lg animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Music className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-purple-300 font-semibold">Manual Timestamping Tool</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Create Perfect Timestamps
            </span>
            <br />
            <span className="text-white">
              For Your Content
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-8 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '100ms' }}>
            Professional timestamp creation tool for podcasts, music, videos, and more.
          </p>
          
          {/* AI Coming Soon Badge */}
          <div className="relative group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10 border border-cyan-500/30 rounded-full mb-12 backdrop-blur-xl shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '200ms' }}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-all duration-500" />
            <Sparkles className="relative w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="relative text-base text-cyan-300 font-semibold">AI-Powered Auto-Detection Coming Soon! 🚀</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '300ms' }}>
            <Link to="/timestamper">
              <Button className="h-14 px-8 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white text-lg font-semibold rounded-full shadow-lg shadow-purple-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 group">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/anime-editor">
              <Button variant="outline" className="h-14 px-8 border-2 border-slate-700 hover:border-purple-500 bg-slate-900/50 backdrop-blur-xl text-white text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:-translate-y-1 group">
                Try Anime Editor
                <Video className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '400ms' }}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-500" />
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  100%
                </div>
                <div className="text-slate-400">Manual Control</div>
              </div>
            </div>
            <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '500ms' }}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-500" />
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  Easy
                </div>
                <div className="text-slate-400">Simple Interface</div>
              </div>
            </div>
            <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '600ms' }}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-500" />
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border border-white/10 rounded-2xl p-6 hover:border-pink-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                <div className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  Fast
                </div>
                <div className="text-slate-400">Quick Export</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Features</span>
            </h2>
            <p className="text-xl text-slate-400">
              Everything you need to create perfect timestamps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 - Coming Soon */}
            <div className="relative group opacity-75 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-all duration-500" />
              <div className="relative h-full backdrop-blur-2xl bg-gradient-to-br from-slate-900/60 via-slate-800/60 to-slate-900/60 border border-white/10 rounded-2xl p-8">
                <div className="absolute top-4 right-4 px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-full">
                  <span className="text-xs font-bold text-cyan-400">Coming Soon</span>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500/50 to-pink-500/50 rounded-2xl flex items-center justify-center mb-6">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">AI Smart Detection</h3>
                <p className="text-slate-400 leading-relaxed">
                  AI-powered audio analysis will automatically detect beats, silences, and energy changes to create perfect timestamps.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700 h-full" style={{ animationDelay: '100ms' }}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-500" />
              <div className="relative h-full backdrop-blur-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border border-white/10 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Music className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Manual Timestamps</h3>
                <p className="text-slate-400 leading-relaxed">
                  Add, edit, and organize timestamps manually with our intuitive interface. Full control over every detail.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700 h-full" style={{ animationDelay: '200ms' }}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-500" />
              <div className="relative h-full backdrop-blur-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border border-white/10 rounded-2xl p-8 hover:border-pink-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-500/20">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Multiple Formats</h3>
                <p className="text-slate-400 leading-relaxed">
                  Export to YouTube, podcast chapters, SRT subtitles, or custom formats. Works with any platform.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700 h-full" style={{ animationDelay: '300ms' }}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-500" />
              <div className="relative h-full backdrop-blur-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border border-white/10 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Video className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Anime Video Editor</h3>
                <p className="text-slate-400 leading-relaxed">
                  Create anime music videos synced to your timestamps. Export timestamps from Timestamper and use them in Anime Editor for beat-perfect scene changes.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700 h-full" style={{ animationDelay: '400ms' }}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-500" />
              <div className="relative h-full backdrop-blur-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Custom Labels</h3>
                <p className="text-slate-400 leading-relaxed">
                  Add custom labels, descriptions, and metadata to your timestamps. Organize content your way.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700 h-full" style={{ animationDelay: '500ms' }}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-500" />
              <div className="relative h-full backdrop-blur-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border border-white/10 rounded-2xl p-8 hover:border-pink-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-500/20">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Instant Preview</h3>
                <p className="text-slate-400 leading-relaxed">
                  Real-time preview of your timestamps. Play, pause, and jump to any point instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-400">
              Two powerful tools working together
            </p>
          </div>

          {/* Timestamper Process */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              <span className="text-blue-400">Timestamper</span> - Create Perfect Timestamps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-10 left-0 right-0 h-1 -z-0">
                <div className="max-w-4xl mx-auto h-full bg-gradient-to-r from-blue-500/30 via-cyan-500/40 to-blue-500/30 rounded-full"></div>
              </div>

              <div className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/50 relative z-10 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-blue-500/70 cursor-pointer">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Upload Audio</h4>
                <p className="text-sm text-slate-400">
                  Upload your music file
                </p>
              </div>

              <div className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/50 relative z-10 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-cyan-500/70 cursor-pointer">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Add Timestamps</h4>
                <p className="text-sm text-slate-400">
                  Create timestamps manually
                </p>
                <p className="text-xs text-cyan-400 font-semibold mt-2">
                  Automatic: Coming Soon
                </p>
              </div>

              <div className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/50 relative z-10 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-blue-500/70 cursor-pointer">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Export JSON</h4>
                <p className="text-sm text-slate-400">
                  Download timestamps as JSON file
                </p>
              </div>
            </div>
          </div>

          {/* Anime Editor Process */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              <span className="text-pink-400">Anime Editor</span> - Create Synced Videos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              <div className="hidden md:block absolute top-10 left-0 right-0 h-1 -z-0">
                <div className="max-w-5xl mx-auto h-full bg-gradient-to-r from-pink-500/30 via-purple-500/40 to-pink-500/30 rounded-full"></div>
              </div>

              <div className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/50 relative z-10 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-pink-500/70 cursor-pointer">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Select Music</h4>
                <p className="text-sm text-slate-400">
                  Upload your music track
                </p>
              </div>

              <div className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/50 relative z-10 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-purple-500/70 cursor-pointer">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Choose Anime</h4>
                <p className="text-sm text-slate-400">
                  Select anime clips folder
                </p>
              </div>

              <div className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/50 relative z-10 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-pink-500/70 cursor-pointer">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Upload JSON</h4>
                <p className="text-sm text-slate-400">
                  Import timestamps from Timestamper
                </p>
              </div>

              <div className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/50 relative z-10 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-purple-500/70 cursor-pointer">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Create Video</h4>
                <p className="text-sm text-slate-400">
                  Generate synced anime music video
                </p>
              </div>
            </div>
          </div>

          {/* Integration Note */}
          <div className="mt-12 backdrop-blur-xl bg-gradient-to-r from-blue-900/30 to-pink-900/30 border border-blue-500/20 rounded-2xl p-6 text-center">
            <p className="text-slate-300 leading-relaxed">
              <span className="text-blue-400 font-semibold">Pro Tip:</span> Create timestamps in <span className="text-blue-400 font-semibold">Timestamper</span>, export as JSON, then upload to <span className="text-pink-400 font-semibold">Anime Editor</span> for perfectly synced scene changes at every timestamp!
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-500" />
            
            <div className="relative backdrop-blur-2xl bg-gradient-to-br from-purple-900/80 via-pink-900/60 to-purple-900/80 border border-purple-500/30 rounded-3xl p-12 overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-purple-500/10 blur-3xl" />
              
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                    Ready to Get Started?
                  </span>
                </h2>
                <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of creators who trust TimeStamper for their content
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                  <Link to="/timestamper">
                    <Button className="h-14 px-8 bg-white text-purple-600 hover:bg-slate-100 text-lg font-semibold rounded-full shadow-lg shadow-purple-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link to="/pricing">
                    <Button variant="outline" className="h-14 px-8 border-2 border-white/30 hover:border-white text-white bg-white/5 backdrop-blur-xl text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                      View Pricing
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span>Free forever plan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-50" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
