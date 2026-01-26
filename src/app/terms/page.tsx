import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Terms of Service | Homebase Flights',
  description: 'Terms of Service for Homebase Flights - Rules and guidelines for using our service.',
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-16 min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto prose prose-gray">
            <h1 className="heading-display text-4xl text-text-primary mb-8">
              Terms of Service
            </h1>

            <p className="text-text-muted text-sm mb-8">
              Last updated: January 2026
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-text-primary mb-4">
                1. Agreement to Terms
              </h2>
              <p className="text-text-secondary mb-4">
                By accessing or using Homebase Flights ("Service"), you agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do not use our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-text-primary mb-4">
                2. Description of Service
              </h2>
              <p className="text-text-secondary mb-4">
                Homebase Flights is a subscription service that sends flight deal alerts via email.
                We find and curate cheap flight deals from your selected departure airport and
                deliver them directly to your inbox.
              </p>
              <p className="text-text-secondary mb-4">
                <strong>Important:</strong> We are not a travel agency. We do not sell flights.
                All bookings are made directly with airlines or third-party booking sites. We are
                not responsible for any issues with bookings made through external sites.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-text-primary mb-4">
                3. Subscription and Payment
              </h2>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Pricing
              </h3>
              <p className="text-text-secondary mb-4">
                The current subscription price is $59 per year. Prices may change, but any changes
                will not affect your current subscription period.
              </p>

              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Free Trial
              </h3>
              <p className="text-text-secondary mb-4">
                New subscribers receive a 7-day free trial. You will not be charged during the
                trial period. If you cancel before the trial ends, you will not be charged.
              </p>

              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Billing
              </h3>
              <p className="text-text-secondary mb-4">
                Subscriptions are billed annually. Your subscription will automatically renew
                unless you cancel before the renewal date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-text-primary mb-4">
                4. Money-Back Guarantee
              </h2>
              <p className="text-text-secondary mb-4">
                If you don't find a single flight deal you love within your first year of
                membership, contact us for a full refund. No questions asked. This guarantee
                applies to your first year of subscription only.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-text-primary mb-4">
                5. Cancellation
              </h2>
              <p className="text-text-secondary mb-4">
                You may cancel your subscription at any time. Upon cancellation:
              </p>
              <ul className="list-disc pl-6 text-text-secondary mb-4">
                <li>You will continue to receive deals until the end of your current billing period</li>
                <li>No partial refunds are provided for unused time</li>
                <li>You can resubscribe at any time</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-text-primary mb-4">
                6. Acceptable Use
              </h2>
              <p className="text-text-secondary mb-4">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 text-text-secondary mb-4">
                <li>Share your subscription or forward deal emails to non-subscribers commercially</li>
                <li>Use automated systems to access the Service</li>
                <li>Attempt to interfere with the Service's operation</li>
                <li>Use the Service for any unlawful purpose</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-text-primary mb-4">
                7. Deal Accuracy
              </h2>
              <p className="text-text-secondary mb-4">
                We strive to provide accurate flight deal information, but:
              </p>
              <ul className="list-disc pl-6 text-text-secondary mb-4">
                <li>Prices may change or expire quickly</li>
                <li>Availability is not guaranteed</li>
                <li>Airlines may have additional fees not included in the listed price</li>
                <li>We are not responsible for errors in pricing or availability</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-text-primary mb-4">
                8. Limitation of Liability
              </h2>
              <p className="text-text-secondary mb-4">
                To the maximum extent permitted by law, Homebase Flights shall not be liable for
                any indirect, incidental, special, consequential, or punitive damages, including
                but not limited to loss of profits, data, or other intangible losses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-text-primary mb-4">
                9. Changes to Terms
              </h2>
              <p className="text-text-secondary mb-4">
                We reserve the right to modify these Terms at any time. We will notify subscribers
                of significant changes via email. Continued use of the Service after changes
                constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-serif font-semibold text-text-primary mb-4">
                10. Contact
              </h2>
              <p className="text-text-secondary mb-4">
                For questions about these Terms, contact us at:
              </p>
              <p className="text-text-secondary">
                <a href="mailto:hello@homebaseflights.com" className="text-blue-600 hover:underline">
                  hello@homebaseflights.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
