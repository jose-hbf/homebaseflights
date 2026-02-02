import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import {
  DealArchiveCard,
  ExpiredBadge,
  FomoBox,
  CtaSubscribe,
  PublishedPercentBanner,
  RelatedDeals,
} from '@/components/deals'
import {
  getPublishedDeals,
  getPublishedDealBySlug,
  getDealArchiveStats,
} from '@/lib/deals/publisher'
import { getCityBySlug, cities } from '@/data/cities'
import { toDealCardData } from '@/types/deals'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Check if slug is a city slug
function isCitySlug(slug: string): boolean {
  return getCityBySlug(slug) !== undefined
}

// Generate static params for known cities
export async function generateStaticParams() {
  return cities.map((city) => ({ slug: city.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  // Check if it's a city page
  const city = getCityBySlug(slug)
  if (city) {
    return {
      title: `Flight Deals from ${city.name} | Homebase Flights`,
      description: `Browse expired flight deals from ${city.name}. See what our subscribers received and subscribe to catch the next deals.`,
      openGraph: {
        title: `Flight Deals from ${city.name}`,
        description: `Expired deals from ${city.name}. Subscribe to get the next ones in real-time.`,
      },
    }
  }

  // It's a deal page
  const deal = await getPublishedDealBySlug(slug)
  if (deal) {
    return {
      title: deal.metaTitle || `${deal.originCity} to ${deal.destinationCity} for $${deal.price}`,
      description: deal.metaDescription || `Expired deal: Flights from ${deal.originCity} to ${deal.destinationCity} for $${deal.price}.`,
      openGraph: {
        title: `${deal.originCity} → ${deal.destinationCity} for $${deal.price}`,
        description: `This deal has expired. ${deal.savingsPercent}% savings. Subscribe to catch the next one.`,
      },
    }
  }

  return {
    title: 'Deal Not Found | Homebase Flights',
  }
}

export default async function DealOrCityPage({ params }: PageProps) {
  const { slug } = await params

  // Check if it's a city page
  const city = getCityBySlug(slug)
  if (city) {
    return <CityDealsPage citySlug={slug} />
  }

  // It's a deal page
  const deal = await getPublishedDealBySlug(slug)
  if (!deal) {
    notFound()
  }

  return <IndividualDealPage dealSlug={slug} />
}

// City Archive Page Component
async function CityDealsPage({ citySlug }: { citySlug: string }) {
  const city = getCityBySlug(citySlug)
  if (!city) notFound()

  const [{ deals, total }, stats] = await Promise.all([
    getPublishedDeals({ citySlug, limit: 24 }),
    getDealArchiveStats(citySlug),
  ])

  const dealCards = deals.map(toDealCardData)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-surface">
        {/* Hero */}
        <section className="bg-accent-warm py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Breadcrumbs */}
            <nav className="text-sm text-text-muted mb-4">
              <Link href="/deals" className="hover:text-primary">
                Deals Archive
              </Link>
              <span className="mx-2">→</span>
              <span className="text-text-primary">{city.name}</span>
            </nav>

            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-text-primary mb-3">
              Flight deals from {city.name}
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl">
              Archive of deals we've sent to subscribers from {city.name}.
              These deals have expired — subscribe to catch the next ones.
            </p>
          </div>
        </section>

        {/* FOMO Banner */}
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <PublishedPercentBanner
              totalDealsFound={stats.totalDealsFound || 50}
              totalDealsPublished={stats.totalDealsPublished || 5}
              cityName={city.name}
              period="this month"
            />
          </div>
        </section>

        {/* Deals Grid */}
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {dealCards.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {dealCards.map((deal) => (
                  <DealArchiveCard key={deal.slug} deal={deal} showOrigin={false} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-border rounded-xl p-8 text-center">
                <p className="text-text-secondary mb-4">
                  No deals published from {city.name} yet.
                </p>
                <p className="text-text-muted text-sm">
                  Subscribe to be the first to know when we find deals from your city.
                </p>
              </div>
            )}

            {total > 24 && (
              <div className="mt-8 text-center">
                <p className="text-text-muted text-sm">
                  Showing 24 of {total} deals
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <CtaSubscribe
              cityName={city.name}
              citySlug={citySlug}
              variant="prominent"
              title={`Don't miss the next deal from ${city.name}`}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

// Individual Deal Page Component
async function IndividualDealPage({ dealSlug }: { dealSlug: string }) {
  const deal = await getPublishedDealBySlug(dealSlug)
  if (!deal) notFound()

  // Get related deals from same city
  const { deals: relatedDeals } = await getPublishedDeals({
    citySlug: deal.originCitySlug,
    limit: 7,
  })
  const relatedDealCards = relatedDeals.map(toDealCardData)

  // Format dates
  const travelStart = new Date(deal.travelDateStart).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
  const travelEnd = new Date(deal.travelDateEnd).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
  const travelDates = travelStart === travelEnd ? travelStart : `${travelStart} - ${travelEnd}`

  // Schema.org structured data
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Flight ${deal.originCity} to ${deal.destinationCity}`,
    description: deal.aiDescription || `Flight deal from ${deal.originCity} to ${deal.destinationCity}`,
    offers: {
      '@type': 'Offer',
      price: deal.price,
      priceCurrency: deal.currency,
      availability: 'https://schema.org/SoldOut',
      validFrom: deal.detectedAt,
      validThrough: deal.expiredAt,
    },
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-surface">
        {/* Schema markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />

        {/* Hero */}
        <section className="bg-accent-warm py-10 md:py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {/* Breadcrumbs */}
            <nav className="text-sm text-text-muted mb-4">
              <Link href="/deals" className="hover:text-primary">
                Deals Archive
              </Link>
              <span className="mx-2">→</span>
              <Link href={`/deals/${deal.originCitySlug}`} className="hover:text-primary">
                {deal.originCity}
              </Link>
              <span className="mx-2">→</span>
              <span className="text-text-primary">{deal.destinationCity}</span>
            </nav>

            {/* Expired Badge */}
            <div className="mb-4">
              <ExpiredBadge size="lg" />
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-text-primary mb-2">
              {deal.originCity} → {deal.destinationCity} for ${deal.price}
            </h1>
            <p className="text-text-muted">
              This deal is no longer available
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Deal Details - Left Column */}
              <div className="md:col-span-2 space-y-8">
                {/* FOMO Box */}
                {deal.sentToSubscribersAt && (
                  <FomoBox
                    sentAt={deal.sentToSubscribersAt}
                    hoursActive={deal.hoursActive}
                    cityName={deal.originCity}
                  />
                )}

                {/* Deal Info Card */}
                <div className="bg-white border border-border rounded-xl overflow-hidden">
                  <div className="p-6">
                    <h2 className="font-serif text-xl font-semibold text-text-primary mb-4">
                      Deal details
                    </h2>

                    <div className="space-y-4">
                      {/* Route */}
                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <span className="text-text-muted">Route</span>
                        <span className="text-text-primary font-medium">
                          {deal.originCity} ({deal.originAirportCode}) → {deal.destinationCity} ({deal.destinationAirportCode})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <span className="text-text-muted">Price found</span>
                        <div className="text-right">
                          <span className="text-2xl font-serif font-semibold text-text-primary">
                            ${deal.price}
                          </span>
                          <span className="text-text-muted line-through ml-2">
                            ${deal.originalPrice}
                          </span>
                        </div>
                      </div>

                      {/* Savings */}
                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <span className="text-text-muted">Savings</span>
                        <span className="bg-success/10 text-success font-medium px-3 py-1 rounded-full">
                          {deal.savingsPercent}% off (${deal.originalPrice - deal.price})
                        </span>
                      </div>

                      {/* Airline */}
                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <span className="text-text-muted">Airline</span>
                        <span className="text-text-primary">
                          {deal.airline}
                          {deal.stops === 0 ? ' · Nonstop' : ` · ${deal.stops} stop${deal.stops > 1 ? 's' : ''}`}
                        </span>
                      </div>

                      {/* Travel Dates */}
                      <div className="flex items-center justify-between py-3">
                        <span className="text-text-muted">Travel dates</span>
                        <span className="text-text-primary">{travelDates}</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Description */}
                  {deal.aiDescription && (
                    <div className="bg-surface-alt p-6 border-t border-border">
                      <p className="text-text-secondary italic">
                        "{deal.aiDescription}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA - Right Column */}
              <div className="md:col-span-1">
                <div className="sticky top-8">
                  <CtaSubscribe
                    cityName={deal.originCity}
                    citySlug={deal.originCitySlug}
                    title="Missed this deal?"
                    subtitle={`Get alerts from ${deal.originCity} delivered to your inbox.`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Deals */}
        {relatedDealCards.length > 1 && (
          <section className="py-12 bg-surface-alt">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <RelatedDeals
                deals={relatedDealCards}
                cityName={deal.originCity}
                currentDealSlug={dealSlug}
              />
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <CtaSubscribe
              cityName={deal.originCity}
              citySlug={deal.originCitySlug}
              variant="prominent"
              title="These deals are expired. The next ones could be yours."
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
