export default function TermsOfService() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-20 w-[400px] h-[400px] bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
        <div className="absolute bottom-20 -right-20 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-cyan-500/10 border border-white/10 backdrop-blur-xl text-xs uppercase tracking-[0.25em] text-slate-300 font-semibold mb-6 shadow-lg">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            Legal Agreement
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-400">Last updated: January 2026</p>
        </div>

        {/* Content Card */}
        <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-all duration-500" />
          
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl">
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
            
            <div className="prose prose-lg prose-invert max-w-none space-y-8">
              <p className="text-slate-300 leading-relaxed">Welcome to TimeStamper. These Terms of Service constitute a legally binding agreement between you and AYUS UNIVERSAL regarding your use of our audio timestamping service.</p>

              <section>
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text mb-4">1. Acceptance of Terms</h2>
                <p className="text-slate-300 leading-relaxed">By accessing or using TimeStamper, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-4">2. User Accounts</h2>
                <p className="text-slate-300 leading-relaxed">To access certain features of TimeStamper, you must register for an account. When you register, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-400">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Accept all responsibility for activity under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
                <p className="mt-4 text-slate-300 leading-relaxed">You are responsible for all activities that occur under your account. We reserve the right to suspend or terminate accounts that violate these terms.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text mb-4">3. Service Description</h2>
                <p className="text-slate-300 leading-relaxed">TimeStamper provides an audio timestamping service that allows users to upload audio files, create timestamps, and export them in various formats. The service includes:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-400">
                  <li>Audio file upload and processing</li>
                  <li>Waveform visualization</li>
                  <li>Manual timestamp creation and editing</li>
                  <li>Multiple export formats (TXT, SRT, VTT, JSON, etc.)</li>
                  <li>Keyboard shortcuts for efficient workflow</li>
                </ul>
                <p className="mt-4 text-slate-300 leading-relaxed">Service availability and features may vary based on your subscription plan.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text mb-4">4. Subscription Plans and Payment</h2>
                <p className="text-slate-300 leading-relaxed">TimeStamper offers multiple subscription tiers with different export limits:</p>
                <div className="grid gap-3 my-4">
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <p className="text-blue-400 font-semibold">Free Plan: <span className="text-slate-300">3 exports per month</span></p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <p className="text-blue-400 font-semibold">Pro Plan: <span className="text-slate-300">10 exports per month at ₹10</span></p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <p className="text-blue-400 font-semibold">Business Plan: <span className="text-slate-300">50 exports per month at ₹40</span></p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <p className="text-blue-400 font-semibold">Unlimited Plan: <span className="text-slate-300">Unlimited exports at ₹100</span></p>
                  </div>
                </div>
                <p className="mt-4 text-slate-300 leading-relaxed">All payments are processed securely through Razorpay. By making a purchase, you agree to provide accurate payment information and authorize us to charge your payment method for the selected plan.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text mb-4">5. User Conduct</h2>
                <p className="text-slate-300 leading-relaxed">You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-400">
                  <li>Use the service for any illegal or unauthorized purpose</li>
                  <li>Upload content that infringes on intellectual property rights</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the service</li>
                  <li>Share account credentials with others</li>
                  <li>Use automated tools to abuse the service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-4">6. Intellectual Property</h2>
                <p className="text-slate-300 leading-relaxed">The service and its original content, features, and functionality are owned by AYUS UNIVERSAL and are protected by international copyright, trademark, and other intellectual property laws.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text mb-4">7. Termination</h2>
                <p className="text-slate-300 leading-relaxed">We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the service will cease immediately.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text mb-4">8. Contact Information</h2>
                <p className="text-slate-300 leading-relaxed">For questions about these Terms of Service, please contact us:</p>
                <div className="mt-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <p className="text-emerald-400 font-semibold">Email: ayus.universal@gmail.com</p>
                  <p className="text-slate-400 text-sm mt-1">We aim to respond within 24 hours on business days</p>
                </div>
              </section>
            </div>
            
            <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
}
