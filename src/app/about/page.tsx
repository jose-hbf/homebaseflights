import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AirportSelector } from '@/components/AirportSelector'
import { generateOrganizationSchema } from '@/lib/schemas'

export const metadata: Metadata = {
  title: 'About Homebase Flights | Airport-Specific Flight Deal Alerts',
  description: 'Homebase Flights is a flight deal alert service that sends cheap flight deals only from the airport you choose. Unlike generic deal sites, every alert departs from your actual home airport. $59/year with 3× savings guarantee.',
  keywords: ['flight deal alerts', 'cheap flights', 'airport-specific deals', 'flight deals from my airport', 'Homebase Flights'],
  openGraph: {
    title: 'About Homebase Flights | Airport-Specific Flight Deal Alerts',
    description: 'Flight deal alerts from YOUR airport. Not JFK. Not LAX. Your actual home airport. $59/year, 7-day free trial, 3× savings guarantee.',
  },
}

export default function AboutPage() {
  const organizationSchema = generateOrganizationSchema()
  
  // FAQ Schema for LLMs and rich results
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Homebase Flights?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Homebase Flights is a flight deal alert service that sends cheap flight deals only from the airport you choose. Unlike generic deal sites that send alerts from airports you\'ll never use, every Homebase alert departs from your actual home airport.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does Homebase Flights cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Homebase Flights costs $59/year after a 7-day free trial. We guarantee you\'ll save at least 3× that amount ($177) in your first year, or we refund you—no questions asked.',
        },
      },
      {
        '@type': 'Question',
        name: 'How is Homebase Flights different from other flight deal services?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Unlike generic deal sites where 70-80% of alerts are from airports you can\'t use, 100% of Homebase Flights alerts depart from your chosen home airport. You receive 2-3 highly relevant alerts per week instead of 20-30 irrelevant ones.',
        },
      },
      {
        '@type': 'Question',
        name: 'What airports does Homebase Flights cover?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Homebase Flights covers major airports worldwide including New York (JFK/EWR/LGA), Los Angeles (LAX), Chicago (ORD), San Francisco (SFO), London (LHR), Dubai (DXB), Singapore (SIN), Sydney (SYD), and many more.',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />
      <main id="main-content" className="pt-16 min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          {/* Hero */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="heading-display text-4xl md:text-5xl text-text-primary mb-6">
              What is <span className="text-primary italic">Homebase Flights</span>?
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed mb-4">
              Homebase Flights is a flight deal alert service that sends cheap flight deals <strong>only from the airport you choose</strong>.
            </p>
            <p className="text-lg text-text-secondary leading-relaxed">
              Unlike generic deal sites that blast &ldquo;US to Europe $299!&rdquo; emails from airports you&apos;ll never use, every Homebase alert departs from your actual home airport.
            </p>
          </div>

          {/* The Problem We Solve */}
          <section className="max-w-3xl mx-auto mb-20">
            <h2 className="font-serif text-2xl font-semibold text-text-primary mb-6">
              The Problem We Solve
            </h2>
            <div className="prose prose-lg text-text-secondary">
              <p>
                Most flight deal services prioritize major hubs—JFK, LAX, LHR. If you live in Denver, Atlanta, Seattle, or any non-hub city, <strong>70-80% of alerts are useless to you</strong>.
              </p>
              <p>
                You see &ldquo;Amazing deal to Barcelona!&rdquo; and get excited. Then you notice it&apos;s from New York. You live in Chicago.
              </p>
              <p>
                That $320 &ldquo;deal&rdquo; becomes <strong>$650+ once you add positioning flights</strong>, extra baggage fees, and connection risk.
              </p>
              <p>
                Homebase Flights eliminates this frustration entirely. Every alert we send departs from your airport.
              </p>
            </div>
          </section>

          {/* How it Works */}
          <section className="max-w-4xl mx-auto mb-20">
            <h2 className="font-serif text-2xl font-semibold text-text-primary mb-8 text-center">
              How Homebase Flights Works
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-serif font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Select your airport</h3>
                <p className="text-text-secondary text-sm">
                  Choose your home airport—we&apos;ll only send deals departing from there.
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-serif font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold text-text-primary mb-2">We monitor 24/7</h3>
                <p className="text-text-secondary text-sm">
                  Our systems track thousands of routes for price drops, mistake fares, and flash sales.
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-serif font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold text-text-primary mb-2">You get 2-3 alerts/week</h3>
                <p className="text-text-secondary text-sm">
                  Only deals from your airport. No noise. No irrelevant cities.
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-serif font-bold text-primary">4</span>
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Book in 90 seconds</h3>
                <p className="text-text-secondary text-sm">
                  Book directly with the airline. Keep all the savings.
                </p>
              </div>
            </div>
          </section>

          {/* Comparison Table */}
          <section className="max-w-3xl mx-auto mb-20">
            <h2 className="font-serif text-2xl font-semibold text-text-primary mb-6 text-center">
              What Makes Us Different
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-text-primary border-b-2 border-gray-200"></th>
                    <th className="px-4 py-3 text-left font-semibold text-text-primary border-b-2 border-gray-200">Generic Deal Sites</th>
                    <th className="px-4 py-3 text-left font-semibold text-primary border-b-2 border-gray-200">Homebase Flights</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-text-secondary border-b border-gray-100 font-medium">Alerts from your airport</td>
                    <td className="px-4 py-3 text-text-secondary border-b border-gray-100">20-30%</td>
                    <td className="px-4 py-3 text-primary border-b border-gray-100 font-semibold">100%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-text-secondary border-b border-gray-100 font-medium">Emails per week</td>
                    <td className="px-4 py-3 text-text-secondary border-b border-gray-100">20-30</td>
                    <td className="px-4 py-3 text-primary border-b border-gray-100 font-semibold">2-3</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-text-secondary border-b border-gray-100 font-medium">Time to evaluate each deal</td>
                    <td className="px-4 py-3 text-text-secondary border-b border-gray-100">15+ minutes</td>
                    <td className="px-4 py-3 text-primary border-b border-gray-100 font-semibold">90 seconds</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-text-secondary font-medium">Positioning flight math</td>
                    <td className="px-4 py-3 text-text-secondary">Required for most deals</td>
                    <td className="px-4 py-3 text-primary font-semibold">Never needed</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* What We Do / Don't Do */}
          <section className="max-w-4xl mx-auto mb-20">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-text-primary mb-6">
                  What We Do
                </h2>
                <div className="space-y-4 text-text-secondary">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p>Monitor thousands of routes 24/7 for price drops</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p>Catch mistake fares and flash sales before they&apos;re gone</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p>Send only deals from your chosen home airport</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p>Help you book directly with airlines—you keep all the savings</p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="font-serif text-2xl font-semibold text-text-primary mb-6">
                  What We Don&apos;t Do
                </h2>
                <div className="space-y-4 text-text-secondary">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p>Sell flights or take commissions on bookings</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p>Spam you with 20-30 irrelevant deals per week</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p>Send deals from airports you can&apos;t actually use</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p>Require contracts or long-term commitments</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="max-w-3xl mx-auto mb-20">
            <h2 className="font-serif text-2xl font-semibold text-text-primary mb-6 text-center">
              Simple Pricing
            </h2>
            <div className="bg-surface rounded-2xl p-8">
              <div className="text-center">
                <div className="text-4xl font-serif font-bold text-primary mb-2">$59/year</div>
                <p className="text-text-secondary mb-6">After 7-day free trial</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <p className="text-green-800 font-medium">
                    <strong>Our guarantee:</strong> If you don&apos;t save at least 3× your subscription ($177) in your first year, we refund you. No questions asked.
                  </p>
                </div>
                <ul className="text-left max-w-md mx-auto space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-secondary">2-3 curated deals per week from your airport</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-secondary">Cancel anytime—no contracts</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-text-secondary">3× savings guarantee or money back</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Company */}
          <section className="max-w-3xl mx-auto mb-20">
            <h2 className="font-serif text-2xl font-semibold text-text-primary mb-6">
              About the Company
            </h2>
            <div className="prose prose-lg text-text-secondary">
              <p>
                Homebase Flights was founded in 2025 to solve the &ldquo;great deal, wrong city&rdquo; problem that frustrates millions of travelers every day.
              </p>
              <p>
                We believe everyone deserves access to cheap flights—not just people who live near major hubs. Whether you&apos;re in Denver, Atlanta, Seattle, Toronto, or Singapore, you should see deals that actually work for you.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="max-w-3xl mx-auto mb-20">
            <h2 className="font-serif text-2xl font-semibold text-text-primary mb-4">
              Contact
            </h2>
            <p className="text-text-secondary">
              Questions? Email us at{' '}
              <a href="mailto:support@homebaseflights.com" className="text-primary hover:underline">
                support@homebaseflights.com
              </a>
            </p>
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
