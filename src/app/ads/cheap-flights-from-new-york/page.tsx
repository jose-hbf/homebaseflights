import { Metadata } from 'next'
import { AdsHeader } from '@/components/ads/AdsHeader'
import { AdsFooter } from '@/components/ads/AdsFooter'
import { AdsEmailCapture } from '@/components/ads/AdsEmailCapture'
import { AdsDealCard } from '@/components/ads/AdsDealCard'
import { StickyCTA } from '@/components/ads/StickyCTA'
import { ScrollToCTAButton } from '@/components/ads/ScrollToCTAButton'

export const metadata: Metadata = {
  title: 'Cheap Flights from New York — Try Free for 14 Days',
  description: 'Get flight deals from JFK, EWR & LaGuardia. Paris $273, Dublin $207, Barcelona $293. Try free for 14 days.',
  robots: {
    index: false,
    follow: false,
  },
}

const deals = [
  {
    destination: 'Paris',
    country: 'France',
    discount: 68,
    price: 273,
    originalPrice: 850,
    dates: 'Feb - Apr 2026',
    airline: 'Multiple Airlines',
    stops: 'Nonstop',
    urgencyLabel: 'Seen 2 hours ago',
  },
  {
    destination: 'Dublin',
    country: 'Ireland',
    discount: 67,
    price: 207,
    originalPrice: 620,
    dates: 'Mar - Jun 2026',
    airline: 'Aer Lingus',
    stops: 'Nonstop',
    urgencyLabel: 'Price verified today',
  },
  {
    destination: 'Barcelona',
    country: 'Spain',
    discount: 62,
    price: 293,
    originalPrice: 780,
    dates: 'Mar - May 2026',
    airline: 'TAP Portugal',
    stops: '1 stop',
    urgencyLabel: 'Expires soon',
  },
  {
    destination: 'Tokyo',
    country: 'Japan',
    discount: 64,
    price: 510,
    originalPrice: 1400,
    dates: 'Mar - May 2026',
    airline: 'ANA',
    stops: 'Nonstop',
    urgencyLabel: 'Seen 4 hours ago',
  },
  {
    destination: 'Lisbon',
    country: 'Portugal',
    discount: 57,
    price: 296,
    originalPrice: 690,
    dates: 'Mar - May 2026',
    airline: 'TAP Portugal',
    stops: 'Nonstop',
    urgencyLabel: 'Price verified today',
  },
  {
    destination: 'London',
    country: 'United Kingdom',
    discount: 58,
    price: 327,
    originalPrice: 780,
    dates: 'Mar - Jun 2026',
    airline: 'British Airways',
    stops: 'Nonstop',
    urgencyLabel: 'Seen 1 hour ago',
  },
]

const testimonials = [
  {
    quote: 'Found a $287 flight to Rome from JFK. Would have never seen it without Homebase Flights.',
    author: 'Sarah M.',
    location: 'Brooklyn',
  },
  {
    quote: 'I was skeptical but the first deal I got saved me $400. Easiest money I\'ve spent.',
    author: 'David K.',
    location: 'Manhattan',
  },
  {
    quote: 'Finally, a deal service that only sends flights from MY airport. Game changer.',
    author: 'Michelle T.',
    location: 'Jersey City',
  },
]

export default function NewYorkAdsPage() {
  return (
    <>
      <AdsHeader />
      <StickyCTA targetId="email-form" text="Start Free Trial →" />

      <main className="pt-16">
        {/* Hero Section */}
        <section id="hero" className="bg-gradient-to-b from-blue-50 to-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              {/* Pre-header */}
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-4">
                DEALS FROM JFK, EWR & LAGUARDIA
              </p>

              {/* H1 */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-6 leading-tight">
                NYC → Paris $273. Dublin $207. Barcelona $293.
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-gray-600 mb-4 max-w-xl mx-auto">
                We find cheap flights from YOUR airport. Not someone else&apos;s.
                <br className="hidden sm:block" />
                Get deals like these in your inbox every week.
              </p>

              {/* Social proof line */}
              <p className="text-sm text-gray-500 mb-8">
                Trusted by travelers from NYC
              </p>

              {/* CTA */}
              <div id="email-form" className="max-w-lg mx-auto">
                <AdsEmailCapture
                  cityName="New York"
                  citySlug="new-york"
                  buttonText="Try Free for 14 Days"
                />
                <p className="text-xs text-gray-500 mt-3">
                  Cancel anytime. Takes 30 seconds. No spam, ever.
                </p>

                {/* Trust badges */}
                <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <span>🔒</span> Secure checkout
                  </span>
                  <span className="flex items-center gap-1">
                    <span>⭐</span> 4.8/5 rating
                  </span>
                  <span className="flex items-center gap-1">
                    <span>💳</span> Cancel anytime
                  </span>
                  <span className="flex items-center gap-1">
                    <span>🛡️</span> Money-back guarantee
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Deals Section */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-gray-900 text-center mb-8">
              This week&apos;s deals from New York
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {deals.map((deal) => (
                <AdsDealCard key={deal.destination} {...deal} currency="$" />
              ))}
            </div>

            <p className="text-center text-gray-500 text-sm mt-8">
              New deals found every week. Try free to never miss one.
            </p>

            {/* Intermediate CTA */}
            <div className="text-center mt-8">
              <ScrollToCTAButton />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 md:py-16 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-gray-900 text-center mb-10">
              What our members are saying
            </h2>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
                >
                  {/* Stars */}
                  <div className="text-[#FF6B35] mb-3 text-lg">
                    ★★★★★
                  </div>
                  {/* Quote */}
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  {/* Author */}
                  <p className="text-sm text-gray-500">
                    — {testimonial.author}, {testimonial.location}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA after testimonials */}
            <div className="text-center mt-10">
              <ScrollToCTAButton />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-gray-900 text-center mb-10">
              How it works
            </h2>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-14 h-14 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-serif text-lg font-semibold text-gray-900 mb-2">
                  You pick your airport
                </h3>
                <p className="text-gray-600 text-sm">
                  We only send deals from JFK, EWR & LaGuardia. No noise from other cities.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-14 h-14 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-serif text-lg font-semibold text-gray-900 mb-2">
                  We find the deals
                </h3>
                <p className="text-gray-600 text-sm">
                  Our system scans prices 24/7 and catches drops the moment they happen.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-14 h-14 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <h3 className="font-serif text-lg font-semibold text-gray-900 mb-2">
                  You book and save
                </h3>
                <p className="text-gray-600 text-sm">
                  Book directly with the airline. Average savings: $420 per trip.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Guarantee Section */}
        <section className="py-12 md:py-16 bg-[#FFF8F5]">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
                Don&apos;t save 3× your subscription? Get your money back.
              </h2>
              <p className="text-gray-600 mb-6">
                If you don&apos;t save at least $177 on flights in your first year, we&apos;ll refund your $59 membership. No questions asked.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                <span className="flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Cancel anytime during trial
                </span>
                <span className="flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  No hidden fees, ever
                </span>
                <span className="flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  $59/year = $4.92/month
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section id="final-cta" className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-gray-900 mb-8">
                Stop overpaying for flights from New York.
              </h2>

              <div className="max-w-lg mx-auto">
                <AdsEmailCapture
                  cityName="New York"
                  citySlug="new-york"
                  buttonText="Start Your Free 14-Day Trial"
                />
                <p className="text-gray-500 text-sm mt-4">
                  You&apos;ll see your first deals within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <AdsFooter />
    </>
  )
}
