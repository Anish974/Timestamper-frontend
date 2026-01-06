export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Refund & Cancellation Policy</h1>
        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-sm text-gray-600">Last updated: January 2026</p>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Overview</h2>
            <p>At TimeStamper (operated by AYUS UNIVERSAL), we are committed to customer satisfaction. This Refund & Cancellation Policy outlines the terms and conditions for refunds and subscription cancellations. Please read this policy carefully before making a purchase.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Refund Policy</h2>
            <p>We offer refunds under specific circumstances to ensure fairness to both our customers and our business operations.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Refund Eligibility</h3>
            <p>You may be eligible for a full or partial refund if:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Within 7 days of purchase:</strong> You can request a refund within 7 days of your initial subscription purchase</li>
              <li><strong>Technical issues:</strong> The service is experiencing persistent technical problems that prevent you from using it</li>
              <li><strong>Service not as described:</strong> The service significantly differs from what was advertised</li>
              <li><strong>Duplicate charge:</strong> You were accidentally charged multiple times</li>
              <li><strong>Unauthorized charge:</strong> A charge was made without your authorization</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Refund Ineligibility</h3>
            <p>Refunds will NOT be provided in the following cases:</p>
            <ul className="list-disc pl-6 space-y-2">
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
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. How to Request a Refund</h2>
            <p>To request a refund, please follow these steps:</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Step 1: Contact Support</h3>
            <p>Send an email to <strong>support@timestamper.site</strong> with the following information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your registered email address</li>
              <li>Order/Transaction ID (found in your payment confirmation email)</li>
              <li>Razorpay Payment ID (if available)</li>
              <li>Subscription plan name (Pro, Business, or Unlimited)</li>
              <li>Purchase date</li>
              <li>Detailed reason for refund request</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Step 2: Review Process</h3>
            <p>Our team will review your request within 2-3 business days. We may contact you for additional information or clarification.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Step 3: Refund Processing</h3>
            <p>If your refund is approved:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You will receive an email confirmation</li>
              <li>The refund will be processed within 5-10 business days</li>
              <li>The amount will be credited back to your original payment method (credit card, debit card, UPI, etc.)</li>
              <li>Bank processing may take an additional 5-7 business days</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Refund Amounts</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Full refund:</strong> If requested within 7 days and minimal service usage</li>
              <li><strong>Partial refund:</strong> Prorated based on usage if significant quota was consumed</li>
              <li><strong>No refund:</strong> After 7 days or if terms are violated</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Subscription Cancellation Policy</h2>
            <p>You can cancel your subscription at any time. Here's what you need to know:</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">4.1 How to Cancel</h3>
            <p>To cancel your subscription:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Log in to your TimeStamper account</li>
              <li>Go to Account Settings or Dashboard</li>
              <li>Navigate to Subscription Management</li>
              <li>Click "Cancel Subscription"</li>
              <li>Confirm your cancellation</li>
            </ul>
            <p className="mt-4">Alternatively, you can email us at support@timestamper.site to request cancellation.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">4.2 What Happens After Cancellation</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Immediate effect:</strong> Your subscription will not renew at the end of the current billing period</li>
              <li><strong>Continued access:</strong> You can continue using paid features until the end of your current billing cycle</li>
              <li><strong>No refund for remaining time:</strong> Cancellation does not trigger a refund for unused time in the current period</li>
              <li><strong>Automatic downgrade:</strong> After the billing period ends, your account will automatically downgrade to the Free plan</li>
              <li><strong>Data retention:</strong> Your timestamp projects and data will be retained for 30 days after downgrade</li>
              <li><strong>Reactivation:</strong> You can reactivate your subscription anytime from the pricing page</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">4.3 Important Notes</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cancel at least 24 hours before your renewal date to avoid the next charge</li>
              <li>Razorpay does not automatically cancel subscriptions - you must cancel through our platform</li>
              <li>Once cancelled, you will receive a confirmation email</li>
              <li>You can re-subscribe at any time without penalty</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Failed Payments</h2>
            <p>If a subscription payment fails:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>We will attempt to charge your payment method up to 3 times over 7 days</li>
              <li>You will receive email notifications about the failed payment</li>
              <li>If payment continues to fail, your subscription will be automatically cancelled</li>
              <li>You can update your payment method in account settings</li>
              <li>Your account will downgrade to the Free plan if payment is not resolved</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Promo Codes and Discounts</h2>
            <p>Special terms apply to promotional purchases:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Subscriptions purchased with promo codes are generally non-refundable</li>
              <li>Discounted plans may have different refund eligibility</li>
              <li>Promo codes cannot be combined with refunds or exchanges</li>
              <li>If a 100% discount code was used, the plan may be free but still subject to cancellation policies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Disputes and Chargebacks</h2>
            <p>If you have an issue with a charge, please contact us before initiating a chargeback:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>We are committed to resolving payment disputes fairly and quickly</li>
              <li>Chargebacks without prior contact may result in account suspension</li>
              <li>Initiating a chargeback waives your right to a refund through our process</li>
              <li>We will provide transaction documentation if requested by your bank</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes to This Policy</h2>
            <p>We may update this Refund & Cancellation Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. Continued use of the service after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Information</h2>
            <p>For any questions, concerns, or requests regarding refunds or cancellations, please contact us:</p>
            <ul className="list-none space-y-2 mt-4">
              <li><strong>Email:</strong> support@timestamper.site</li>
              <li><strong>Company:</strong> AYUS UNIVERSAL</li>
              <li><strong>Website:</strong> timestamper.site</li>
              <li><strong>Response Time:</strong> Within 2-3 business days</li>
            </ul>
            <p className="mt-4">We are here to help and will do our best to resolve any issues you may have with your subscription.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
