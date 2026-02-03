import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { DealArchiveCard, CtaSubscribe, PublishedPercentBanner } from '@/components/deals'
import { getPublishedDeals, getDealArchiveStats, getCitiesWithDeals } from '@/lib/deals/publisher'
import { toDealCardData } from '@/types/deals'

export const metadata: Metadata = {
  title: 'Flight Deals Archive — Recent Deals We Sent',
  description: 'Browse expired flight deals we\'ve sent to subscribers. See the savings you could get with Homebase Flights alerts.',
  openGraph: {
    title: 'Flight Deals Archive — Recent Deals We Sent',
    description: 'A sample of the deals we send to subscribers. These are expired - subscribe to catch the next ones.',
  },
}

export const revalidate = 3600 // Revalidate every hour

export default async function DealsArchivePage() {
  const [{ deals, total }, stats, citiesWithDeals] = await Promise.all([
    getPublishedDeals({ limit: 12 }),
    getDealArchiveStats(),
    getCitiesWithDeals(),
  ])

  const dealCards = deals.map(toDealCardData)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-surface">
        {/* Hero Section */}
        <section className="bg-accent-warm py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-text-primary mb-4">
              Deals Archive
            </h1>
            <p className="text-text-secondary text-lg md:text-xl max-w-2xl">
              A sample of the flight deals we've sent to our subscribers.
              These deals have expired — subscribe to catch the next ones.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center">
                <div className="font-serif text-4xl md:text-5xl font-semibold text-primary">
                  {stats.totalDealsFound || '500+'}
                </div>
                <div className="text-text-muted text-sm mt-1">Deals found</div>
              </div>
              <div className="text-center">
                <div className="font-serif text-4xl md:text-5xl font-semibold text-success">
                  ~10%
                </div>
                <div className="text-text-muted text-sm mt-1">Published here</div>
              </div>
              <div className="text-center">
                <div className="font-serif text-4xl md:text-5xl font-semibold text-primary">
                  {stats.averageSavingsPercent || 45}%
                </div>
                <div className="text-text-muted text-sm mt-1">Avg. savings</div>
              </div>
              <div className="text-center">
                <div className="font-serif text-4xl md:text-5xl font-semibold text-primary">
                  {citiesWithDeals.length || 15}
                </div>
                <div className="text-text-muted text-sm mt-1">Cities covered</div>
              </div>
            </div>
          </div>
        </section>

        {/* FOMO Banner */}
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <PublishedPercentBanner
              totalDealsFound={stats.totalDealsFound || 500}
              totalDealsPublished={stats.totalDealsPublished || 50}
              period="this month"
            />
          </div>
        </section>

        {/* City Selector */}
        {citiesWithDeals.length > 0 && (
          <section className="py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <h2 className="font-serif text-2xl font-semibold text-text-primary mb-6">
                Browse by city
              </h2>
              <div className="flex flex-wrap gap-3">
                {citiesWithDeals.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/deals/${city.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-full hover:border-primary hover:bg-accent-warm transition-colors"
                  >
                    <span className="text-text-primary font-medium">{city.name}</span>
                    <span className="text-text-muted text-sm">({city.dealCount})</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Deals Grid */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="font-serif text-2xl font-semibold text-text-primary mb-6">
              Latest expired deals
            </h2>

            {dealCards.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {dealCards.map((deal) => (
                  <DealArchiveCard key={deal.slug} deal={deal} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-border rounded-xl p-8 text-center">
                <p className="text-text-secondary">
                  No deals published yet. Check back soon!
                </p>
              </div>
            )}

            {total > 12 && (
              <div className="mt-8 text-center">
                <p className="text-text-muted text-sm">
                  Showing 12 of {total} deals
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-surface-alt">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <CtaSubscribe
              cityName="your city"
              citySlug="new-york"
              variant="prominent"
              title="These deals are expired"
              subtitle="The next ones could be yours. Get alerts from your home airport delivered in real-time."
            />
          </div>
        </section>

        {/* Final text */}
        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-text-secondary">
              The deals shown here represent only a fraction of what our subscribers receive.
              Most deals are time-sensitive and never make it to this archive.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
