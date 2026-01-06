export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-sm text-gray-600">Last updated: January 2026</p>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>Timestamper ("we" or "us" or "our") operates the timestamper.site website (the "Site"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information Collection and Use</h2>
            <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Personal Data</h3>
            <p>When you create an account or use our services, we may collect personally identifiable information, including but not limited to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Email address:</strong> Required for account creation and communication</li>
              <li><strong>Name:</strong> Used for personalization and account management</li>
              <li><strong>Payment information:</strong> Processed securely through Razorpay for subscription payments</li>
              <li><strong>Profile information:</strong> Any additional information you choose to provide</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Usage Data</h3>
            <p>We automatically collect certain information when you visit, use, or navigate our service:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Device information:</strong> Browser type, operating system, device identifiers</li>
              <li><strong>Log data:</strong> IP address, access times, pages viewed, referring URLs</li>
              <li><strong>Service usage:</strong> Features used, exports generated, subscription plan</li>
              <li><strong>Audio metadata:</strong> File names, durations, and timestamp data (not the actual audio content)</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">2.3 Cookies and Tracking Technologies</h3>
            <p>We use cookies and similar tracking technologies to track activity on our service:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential cookies:</strong> Required for basic functionality and authentication</li>
              <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Analytics cookies:</strong> Help us understand how you use our service</li>
            </ul>
            <p className="mt-4">You can control cookies through your browser settings, though some features may not function properly if cookies are disabled.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">2.4 Audio File Handling</h2>
            <p>When you upload audio files to TimeStamper:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Files are temporarily stored for processing and creating timestamps</li>
              <li>We do not permanently store your audio files on our servers</li>
              <li>Files are automatically deleted after processing or session expiration</li>
              <li>We do not listen to, analyze, or use your audio content for any purpose other than providing the timestamping service</li>
              <li>Your timestamps and project data are stored securely in our database</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Data</h2>
            <p>TimeStamper uses the collected data for various purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Delivery:</strong> To provide, operate, and maintain our timestamping service</li>
              <li><strong>Account Management:</strong> To manage your account, subscriptions, and preferences</li>
              <li><strong>Customer Support:</strong> To respond to your inquiries and provide technical support</li>
              <li><strong>Service Improvement:</strong> To analyze usage patterns and improve our features</li>
              <li><strong>Communications:</strong> To send you service updates, security alerts, and support messages</li>
              <li><strong>Marketing:</strong> To send promotional emails (with your consent, and you can opt-out anytime)</li>
              <li><strong>Security:</strong> To detect, prevent, and address technical issues and fraud</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Sharing and Disclosure</h2>
            <p>We do not sell your personal data. We may share your information only in the following circumstances:</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Service Providers</h3>
            <p>We may share your data with third-party service providers who assist us in operating our service:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Supabase:</strong> Database and authentication services</li>
              <li><strong>Razorpay:</strong> Payment processing (they handle payment data directly)</li>
              <li><strong>Hosting providers:</strong> For service infrastructure</li>
            </ul>
            <p className="mt-4">These providers are bound by confidentiality agreements and may only use your data to perform services on our behalf.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Legal Requirements</h3>
            <p>We may disclose your data if required to do so by law or in response to valid requests by public authorities (e.g., court orders, government investigations).</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">4.3 Business Transfers</h3>
            <p>If AYUS UNIVERSAL is involved in a merger, acquisition, or asset sale, your personal data may be transferred. We will provide notice before your data is transferred and becomes subject to a different privacy policy.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Retention</h2>
            <p>We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account data:</strong> Retained while your account is active and for 30 days after deletion</li>
              <li><strong>Audio files:</strong> Deleted immediately after processing or session expiration</li>
              <li><strong>Timestamp projects:</strong> Retained while your account is active</li>
              <li><strong>Payment records:</strong> Retained for legal and accounting purposes (typically 7 years)</li>
              <li><strong>Usage logs:</strong> Retained for 90 days for security and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Data Security</h2>
            <p>The security of your data is important to us. We implement industry-standard security measures including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Encryption:</strong> Data is encrypted in transit using SSL/TLS and at rest</li>
              <li><strong>Authentication:</strong> Secure password hashing and authentication via Supabase</li>
              <li><strong>Access controls:</strong> Limited access to personal data on a need-to-know basis</li>
              <li><strong>Regular audits:</strong> Periodic security assessments and updates</li>
              <li><strong>Secure infrastructure:</strong> Hosted on reputable cloud providers with robust security</li>
            </ul>
            <p className="mt-4">However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Your Data Rights</h2>
            <p>You have certain rights regarding your personal data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data ("right to be forgotten")</li>
              <li><strong>Data portability:</strong> Request your data in a portable format</li>
              <li><strong>Objection:</strong> Object to processing of your data for certain purposes</li>
              <li><strong>Restriction:</strong> Request restriction of processing under certain circumstances</li>
              <li><strong>Withdraw consent:</strong> Withdraw consent for data processing at any time</li>
            </ul>
            <p className="mt-4">To exercise these rights, please contact us at support@timestamper.site. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Children's Privacy</h2>
            <p>Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal data, please contact us so we can delete it.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. International Data Transfers</h2>
            <p>Your information may be transferred to and maintained on servers located outside of your country. We ensure that appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Changes to This Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time to reflect changes in our practices or for legal, regulatory, or operational reasons. We will notify you of any material changes by:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Posting the new Privacy Policy on this page</li>
              <li>Updating the "Last updated" date at the top</li>
              <li>Sending you an email notification for significant changes</li>
            </ul>
            <p className="mt-4">We encourage you to review this Privacy Policy periodically. Your continued use of the service after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contact Us</h2>
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
            <ul className="list-none space-y-2 mt-4">
              <li><strong>Email:</strong> support@timestamper.site</li>
              <li><strong>Company:</strong> AYUS UNIVERSAL</li>
              <li><strong>Website:</strong> timestamper.site</li>
            </ul>
            <p className="mt-4">We will respond to your inquiry within 30 days.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
