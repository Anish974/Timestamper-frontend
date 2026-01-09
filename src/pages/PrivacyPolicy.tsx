export default function PrivacyPolicy() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-20 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
        <div className="absolute bottom-20 -right-20 w-[400px] h-[400px] bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 backdrop-blur-xl text-xs uppercase tracking-[0.25em] text-slate-300 font-semibold mb-6 shadow-lg">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            Legal Document
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-400">Last updated: January 2026</p>
        </div>

        {/* Content Card */}
        <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-all duration-500" />
          
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl">
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
            
            <div className="prose prose-lg prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-4">1. Introduction</h2>
                <p className="text-slate-300 leading-relaxed">Timestamper ("we" or "us" or "our") operates the timestamper.site website (the "Site"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-4">2. Information Collection and Use</h2>
                <p className="text-slate-300 leading-relaxed">We collect several different types of information for various purposes to provide and improve our Service to you.</p>
                
                <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-3">2.1 Personal Data</h3>
                <p className="text-slate-300 leading-relaxed">When you create an account or use our services, we may collect personally identifiable information, including but not limited to:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-400">
                  <li><strong className="text-slate-300">Email address:</strong> Required for account creation and communication</li>
                  <li><strong className="text-slate-300">Name:</strong> Used for personalization and account management</li>
                  <li><strong className="text-slate-300">Payment information:</strong> Processed securely through Razorpay for subscription payments</li>
                  <li><strong className="text-slate-300">Profile information:</strong> Any additional information you choose to provide</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-3">2.2 Usage Data</h3>
                <p className="text-slate-300 leading-relaxed">We automatically collect certain information when you visit, use, or navigate our service:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-400">
                  <li><strong className="text-slate-300">Device information:</strong> Browser type, operating system, device identifiers</li>
                  <li><strong className="text-slate-300">Log data:</strong> IP address, access times, pages viewed, referring URLs</li>
                  <li><strong className="text-slate-300">Service usage:</strong> Features used, exports generated, subscription plan</li>
                  <li><strong className="text-slate-300">Audio metadata:</strong> File names, durations, and timestamp data (not the actual audio content)</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-3">2.3 Cookies and Tracking Technologies</h3>
                <p className="text-slate-300 leading-relaxed">We use cookies and similar tracking technologies to track activity on our service:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-400">
                  <li><strong className="text-slate-300">Essential cookies:</strong> Required for basic functionality and authentication</li>
                  <li><strong className="text-slate-300">Preference cookies:</strong> Remember your settings and preferences</li>
                  <li><strong className="text-slate-300">Analytics cookies:</strong> Help us understand how you use our service</li>
                </ul>
                <p className="mt-4 text-slate-300 leading-relaxed">You can control cookies through your browser settings, though some features may not function properly if cookies are disabled.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text mb-4">2.4 Audio File Handling</h2>
                <p className="text-slate-300 leading-relaxed">When you upload audio files to TimeStamper:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-400">
                  <li>Files are temporarily stored for processing and creating timestamps</li>
                  <li>Audio content is NOT permanently stored on our servers</li>
                  <li>Files are automatically deleted after processing is complete</li>
                  <li>Only timestamp metadata is retained for export purposes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text mb-4">3. How We Use Your Information</h2>
                <p className="text-slate-300 leading-relaxed">We use the collected data for various purposes:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-400">
                  <li>To provide and maintain our Service</li>
                  <li>To notify you about changes to our Service</li>
                  <li>To provide customer support</li>
                  <li>To gather analysis or valuable information to improve our Service</li>
                  <li>To monitor usage of our Service</li>
                  <li>To detect, prevent and address technical issues</li>
                  <li>To process payments and manage subscriptions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text mb-4">4. Data Security</h2>
                <p className="text-slate-300 leading-relaxed">The security of your data is important to us. We implement appropriate technical and organizational measures including:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-400">
                  <li>Encryption of data in transit using SSL/TLS</li>
                  <li>Secure storage with access controls</li>
                  <li>Regular security audits and updates</li>
                  <li>Payment processing through PCI-compliant providers (Razorpay)</li>
                </ul>
                <p className="mt-4 text-slate-300 leading-relaxed">However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-4">5. Your Rights</h2>
                <p className="text-slate-300 leading-relaxed">You have certain rights regarding your personal data:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-400">
                  <li><strong className="text-slate-300">Access:</strong> Request a copy of your personal data</li>
                  <li><strong className="text-slate-300">Correction:</strong> Update inaccurate or incomplete information</li>
                  <li><strong className="text-slate-300">Deletion:</strong> Request deletion of your personal data</li>
                  <li><strong className="text-slate-300">Export:</strong> Receive your data in a portable format</li>
                  <li><strong className="text-slate-300">Opt-out:</strong> Unsubscribe from marketing communications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text mb-4">6. Contact Us</h2>
                <p className="text-slate-300 leading-relaxed">If you have any questions about this Privacy Policy, please contact us at:</p>
                <div className="mt-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <p className="text-blue-400 font-semibold">Email: ayus.universal@gmail.com</p>
                  <p className="text-slate-400 text-sm mt-1">We aim to respond within 24 hours on business days</p>
                </div>
              </section>
            </div>
            
            <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
}
