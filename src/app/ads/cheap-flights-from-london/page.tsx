import { Metadata } from 'next'
import { AdsHeader } from '@/components/ads/AdsHeader'
import { AdsFooter } from '@/components/ads/AdsFooter'
import { AdsEmailCapture } from '@/components/ads/AdsEmailCapture'
import { AdsDealCard } from '@/components/ads/AdsDealCard'
import { StickyCTA } from '@/components/ads/StickyCTA'

export const metadata: Metadata = {
  title: 'Cheap Flights from London — Try Free for 14 Days',
  description: 'Get flight deals from Heathrow, Gatwick, Stansted & Luton. New York £259, Bangkok £285, Dubai £277. Try free for 14 days.',
  robots: {
    index: false,
    follow: false,
  },
}

const deals = [
  {
    destination: 'New York',
    country: 'USA',
    discount: 62,
    price: 259,
    originalPrice: 680,
    dates: 'Mar - Jun 2026',
    airline: 'British Airways',
    stops: 'Nonstop',
  },
  {
    destination: 'Bangkok',
    country: 'Thailand',
    discount: 62,
    price: 285,
    originalPrice: 750,
    dates: 'Mar - May 2026',
    airline: 'Thai Airways',
    stops: 'Nonstop',
  },
  {
    destination: 'Dubai',
    country: 'UAE',
    discount: 56,
    price: 277,
    originalPrice: 630,
    dates: 'Mar - May 2026',
    airline: 'Emirates',
    stops: 'Nonstop',
  },
  {
    destination: 'Barcelona',
    country: 'Spain',
    discount: 76,
    price: 35,
    originalPrice: 145,
    dates: 'Mar - Jun 2026',
    airline: 'Vueling',
    stops: 'Nonstop',
  },
  {
    destination: 'Rome',
    country: 'Italy',
    discount: 77,
    price: 37,
    originalPrice: 160,
    dates: 'Feb - May 2026',
    airline: 'British Airways',
    stops: 'Nonstop',
  },
  {
    destination: 'Tokyo',
    country: 'Japan',
    discount: 60,
    price: 480,
    originalPrice: 1200,
    dates: 'Mar - May 2026',
    airline: 'ANA',
    stops: '1 stop',
  },
]

export default function LondonAdsPage() {
  return (
    <>
      <AdsHeader />
      <StickyCTA />

      <main className="pt-14">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              {/* Pre-header */}
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-4">
                Deals from Heathrow, Gatwick, Stansted & Luton
              </p>

              {/* H1 */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-6 leading-tight">
                London → New York £259. Bangkok £285. Dubai £277.
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
                We find cheap flights from YOUR airport. Not someone else&apos;s.
                <br className="hidden sm:block" />
                Get deals like these in your inbox every week.
              </p>

              {/* CTA */}
              <div className="max-w-lg mx-auto">
                <AdsEmailCapture
                  cityName="London"
                  citySlug="london"
                  buttonText="Try Free for 14 Days"
                />
                <p className="text-xs text-gray-500 mt-3">
                  Cancel anytime. Takes 30 seconds. Credit card required.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Deals Section */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-gray-900 text-center mb-8">
              This week&apos;s deals from London
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {deals.map((deal) => (
                <AdsDealCard key={deal.destination} {...deal} currency="£" />
              ))}
            </div>

            <p className="text-center text-gray-500 text-sm mt-8">
              New deals found every week. Try free to never miss one.
            </p>
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
                  We cover Heathrow, Gatwick, Stansted & Luton. Every deal departs from London.
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
                  Book directly with the airline. Average savings: £300 per trip.
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
                If you don&apos;t save at least £141 on flights in your first year, we&apos;ll refund your £47 membership. No questions asked.
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
                  £47/year = £3.92/month
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
                Stop overpaying for flights from London.
              </h2>

              <div className="max-w-lg mx-auto">
                <AdsEmailCapture
                  cityName="London"
                  citySlug="london"
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
