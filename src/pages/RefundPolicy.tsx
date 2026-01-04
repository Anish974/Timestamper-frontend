export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Refund & Cancellation Policy</h1>
        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-sm text-gray-600">Last updated: January 2026</p>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Refund Policy</h2>
            <p>At Timestamper, we want you to be completely satisfied with your purchase. If you're not satisfied, please reach out to us within 7 days of your purchase.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Refund Eligibility</h2>
            <p>You may be eligible for a refund if:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You request it within 7 days of purchase</li>
              <li>You have not already used the majority of the subscription benefits</li>
              <li>The refund request is made for legitimate reasons</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Refund Process</h2>
            <p>To request a refund, please contact us at support@timestamper.site with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your account email address</li>
              <li>Order/Transaction ID</li>
              <li>Reason for refund</li>
            </ul>
            <p>We will process refunds within 5-10 business days. The refund will be credited back to your original payment method.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Cancellation Policy</h2>
            <p>If you have an active subscription, you can cancel it at any time from your account settings. Cancellation will take effect at the end of your current billing period.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Subscription Cancellation</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You will not be charged for the next billing cycle</li>
              <li>You may continue using your subscription until the end of the current billing period</li>
              <li>Your data will be retained for 30 days after cancellation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Non-Refundable Items</h2>
            <p>The following items are non-refundable:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Subscriptions active for more than 7 days</li>
              <li>Free tier accounts</li>
              <li>Promotional or discounted purchases</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Us</h2>
            <p>For any refund or cancellation requests, please contact us at support@timestamper.site</p>
          </section>
        </div>
      </div>
    </div>
  )
}
