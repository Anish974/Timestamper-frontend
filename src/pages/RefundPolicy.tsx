export default function RefundPolicy() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-20 w-[400px] h-[400px] bg-gradient-to-br from-pink-500/20 via-rose-500/10 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
        <div className="absolute bottom-20 -right-20 w-[400px] h-[400px] bg-gradient-to-br from-purple-500/20 via-indigo-500/10 to-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-white/10 backdrop-blur-xl text-xs uppercase tracking-[0.25em] text-slate-300 font-semibold mb-6 shadow-lg">
            <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></span>
            Policy Document
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Refund & Cancellation Policy
          </h1>
          <p className="text-sm text-slate-400">Last updated: January 2026</p>
        </div>

        {/* Content Card */}
        <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-all duration-500" />
          
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-2xl p-8 md:p-12 shadow-2xl">
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent" />
            
            <div className="prose prose-lg prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text mb-4">1. Overview</h2>
                <p className="text-slate-300 leading-relaxed">At TimeStamper (operated by AYUS UNIVERSAL), we are committed to customer satisfaction. This Refund & Cancellation Policy outlines the terms and conditions for refunds and subscription cancellations. Please read this policy carefully before making a purchase.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text mb-4">2. Refund Policy</h2>
                <p className="text-slate-300 leading-relaxed">We offer refunds under specific circumstances to ensure fairness to both our customers and our business operations.</p>
                
                <h3 className="text-xl font-semibold text-pink-300 mt-6 mb-3">2.1 Refund Eligibility</h3>
                <p className="text-slate-300 leading-relaxed">You may be eligible for a full or partial refund if:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-400">
                  <li><strong className="text-slate-300">Within 7 days of purchase:</strong> You can request a refund within 7 days of your initial subscription purchase</li>
                  <li><strong className="text-slate-300">Technical issues:</strong> The service is experiencing persistent technical problems that prevent you from using it</li>
                  <li><strong className="text-slate-300">Service not as described:</strong> The service significantly differs from what was advertised</li>
                  <li><strong className="text-slate-300">Duplicate charge:</strong> You were accidentally charged multiple times</li>
                  <li><strong className="text-slate-300">Unauthorized charge:</strong> A charge was made without your authorization</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-pink-300 mt-6 mb-3">2.2 Refund Ineligibility</h3>
                <p className="text-slate-300 leading-relaxed">Refunds will NOT be provided in the following cases:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-400">
                  <li>Refund requested after 7 days from the purchase date</li>
                  <li>You have already used a significant portion of your export quota (more than 50%)</li>
                  <li>Change of mind after extensively using the service</li>
                  <li>Violation of our Terms of Service resulting in account suspension</li>
                  <li>Promotional or discounted subscriptions purchased with promo codes</li>
                  <li>Free tier accounts (no payment made)</li>
                  <li>Failure to cancel before renewal (see cancellation policy below)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text mb-4">3. How to Request a Refund</h2>
                <p className="text-slate-300 leading-relaxed">To request a refund, please follow these steps:</p>
                
                <div className="mt-4 space-y-4">
                  <div className="p-4 rounded-xl bg-pink-500/5 border border-pink-500/20">
                    <h3 className="text-lg font-semibold text-pink-300 mb-2">Step 1: Contact Support</h3>
                    <p className="text-slate-400 text-sm">Send an email to <strong className="text-slate-300">support@timestamper.site</strong> with:</p>
                    <ul className="list-disc pl-6 space-y-1 text-slate-400 text-sm mt-2">
                      <li>Your registered email address</li>
                      <li>Order/Transaction ID</li>
                      <li>Razorpay Payment ID (if available)</li>
                      <li>Reason for refund request</li>
                      <li>Date of purchase</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">Step 2: Review Process</h3>
                    <p className="text-slate-400 text-sm">Our team will review your request within 2-3 business days and verify eligibility based on this policy.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                    <h3 className="text-lg font-semibold text-indigo-300 mb-2">Step 3: Processing</h3>
                    <p className="text-slate-400 text-sm">If approved, refunds will be processed within 7-10 business days to your original payment method.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text mb-4">4. Cancellation Policy</h2>
                <p className="text-slate-300 leading-relaxed">You can cancel your subscription at any time. Here's what happens:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-400">
                  <li><strong className="text-slate-300">Immediate Effect:</strong> Access to paid features continues until the end of your current billing period</li>
                  <li><strong className="text-slate-300">No Refunds:</strong> Cancellation does not entitle you to a refund for the current period</li>
                  <li><strong className="text-slate-300">Data Retention:</strong> Your account data remains accessible even after cancellation</li>
                  <li><strong className="text-slate-300">Auto-renewal:</strong> Cancellation prevents future automatic renewals</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-4">5. Processing Time</h2>
                <div className="grid gap-3 my-4">
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <p className="text-pink-400 font-semibold">Refund Review: <span className="text-slate-300">2-3 business days</span></p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <p className="text-purple-400 font-semibold">Refund Processing: <span className="text-slate-300">7-10 business days</span></p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <p className="text-indigo-400 font-semibold">Bank Credit: <span className="text-slate-300">Additional 3-5 business days</span></p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text mb-4">6. Contact Us</h2>
                <p className="text-slate-300 leading-relaxed">For refund or cancellation inquiries, contact us:</p>
                <div className="mt-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <p className="text-pink-400 font-semibold">Email: ayus.universal@gmail.com</p>
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
