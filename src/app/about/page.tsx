import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AirportSelector } from '@/components/AirportSelector'
import { generateOrganizationSchema } from '@/lib/schemas'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Homebase Flights - the flight deal alert service that sends cheap flights from your home airport to your inbox.',
  openGraph: {
    title: 'About Homebase Flights',
    description: 'Learn about Homebase Flights - the flight deal alert service that sends cheap flights from your home airport to your inbox.',
  },
}

export default function AboutPage() {
  const organizationSchema = generateOrganizationSchema()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Header />
      <main id="main-content" className="pt-16 min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          {/* Hero */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="heading-display text-4xl md:text-5xl text-text-primary mb-6">
              What is <span className="text-primary italic">Homebase Flights</span>?
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              We find incredible flight deals from your home airport and send them straight to your inbox.
              Our members save an average of $500+ per trip.
            </p>
          </div>

          {/* How it Works */}
          <section className="max-w-4xl mx-auto mb-20">
            <h2 className="font-serif text-2xl font-semibold text-text-primary mb-8 text-center">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-serif font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Tell us your airport</h3>
                <p className="text-text-secondary text-sm">
                  Select your home airport(s) and we&apos;ll monitor deals departing from there.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-serif font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold text-text-primary mb-2">We find the deals</h3>
                <p className="text-text-secondary text-sm">
                  Our systems monitor millions of fares 24/7, catching mistake fares, flash sales, and price drops.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-serif font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold text-text-primary mb-2">You book &amp; save</h3>
                <p className="text-text-secondary text-sm">
                  Get notified instantly, book directly with the airline, and keep all the savings.
                </p>
              </div>
            </div>
          </section>

          {/* What We Do */}
          <section className="max-w-3xl mx-auto mb-20">
            <h2 className="font-serif text-2xl font-semibold text-text-primary mb-6">
              What We Do
            </h2>
            <div className="prose prose-lg text-text-secondary">
              <p>
                Flight prices are unpredictable. The same route can cost $300 one day and $900 the next.
                Airlines make pricing errors. Flash sales happen without warning. And the best deals
                disappear within hours.
              </p>
              <p>
                Homebase Flights solves this problem. We monitor millions of flight prices around the clock,
                identify exceptional deals from your home airport, and alert you before they&apos;re gone.
              </p>
              <p>
                We&apos;re not a booking site. We don&apos;t take a cut of your purchase. We simply find the deals
                and send them to you. You book directly with the airline and keep all the savings.
              </p>
            </div>
          </section>

          {/* What We Don't Do */}
          <section className="max-w-3xl mx-auto mb-20">
            <h2 className="font-serif text-2xl font-semibold text-text-primary mb-6">
              What We Don&apos;t Do
            </h2>
            <div className="space-y-4 text-text-secondary">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <p>We don&apos;t sell flights or take commissions on bookings</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <p>We don&apos;t spam you with mediocre deals—only exceptional ones</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <p>We don&apos;t require contracts or long-term commitments</p>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="max-w-3xl mx-auto mb-20">
            <h2 className="font-serif text-2xl font-semibold text-text-primary mb-6">
              Simple Pricing
            </h2>
            <div className="bg-surface rounded-2xl p-8">
              <div className="text-center">
                <div className="text-4xl font-serif font-bold text-primary mb-2">$59/year</div>
                <p className="text-text-secondary mb-6">After 7-day free trial</p>
                <ul className="text-left max-w-md mx-auto space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-secondary">15+ deals per week</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-secondary">Cancel anytime</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-secondary">Money-back guarantee</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="max-w-xl mx-auto text-center">
            <h2 className="font-serif text-2xl font-semibold text-text-primary mb-4">
              Ready to start saving?
            </h2>
            <p className="text-text-secondary mb-8">
              Select your home airport to see deals available today.
            </p>
            <AirportSelector />
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
