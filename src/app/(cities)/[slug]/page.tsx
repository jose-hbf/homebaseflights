import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { DealCard } from '@/components/DealCard'
import { EmailCapture } from '@/components/EmailCapture'
import { Testimonial } from '@/components/Testimonial'
import { Guarantee } from '@/components/Guarantee'
import { HowItWorks } from '@/components/HowItWorks'
import { FAQ } from '@/components/FAQ'
import { RelatedCities } from '@/components/RelatedCities'
import { RelatedBlogPosts } from '@/components/RelatedBlogPosts'
import { FadeIn } from '@/components/FadeIn'
import { cities, getCityBySlug } from '@/data/cities'
import { getDealsForCity } from '@/data/deals'
import { getYesterdayFormatted } from '@/lib/utils'

export const dynamicParams = false

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams?.slug
  if (!slug) {
    return { title: 'City Not Found - HomebaseFlights' }
  }
  const city = getCityBySlug(slug)

  if (!city) {
    return {
      title: 'City Not Found - HomebaseFlights',
    }
  }

  const siteUrl = 'https://homebaseflights.com'

  return {
    title: `Cheap Flights from ${city.name}`,
    description: `Get weekly cheap flight deals from ${city.name} (${city.airports.join(', ')}). Save up to 90% on flights. $59/year with money-back guarantee.`,
    openGraph: {
      title: `Cheap Flights from ${city.name} | Homebase Flights`,
      description: `Get weekly cheap flight deals from ${city.name}. Save up to 90% on flights from ${city.airports.join(', ')}.`,
      url: `${siteUrl}/cheap-flights-from-${city.slug}`,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `Cheap flights from ${city.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Cheap Flights from ${city.name} | Homebase Flights`,
      description: `Get weekly cheap flight deals from ${city.name}. Save up to 90% on flights.`,
    },
    alternates: {
      canonical: `${siteUrl}/cheap-flights-from-${city.slug}`,
    },
  }
}

export async function generateStaticParams() {
  return cities.map(city => ({
    slug: city.slug,
  }))
}

const testimonials = [
  {
    quote:
      "I saved $800 on a round-trip flight to Tokyo. This service pays for itself on the first deal!",
    name: 'Sarah M.',
    location: 'New York, NY',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  },
  {
    quote:
      "Best travel investment I've made. Found a $300 flight to Paris that normally costs over $1,000.",
    name: 'Michael R.',
    location: 'Chicago, IL',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  {
    quote:
      "The deals are insane. I've taken 4 international trips this year that I never thought I could afford.",
    name: 'Jessica L.',
    location: 'Los Angeles, CA',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  },
]

export default async function CityPage({ params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams?.slug
  if (!slug) {
    notFound()
  }
  const city = getCityBySlug(slug)

  if (!city) {
    notFound()
  }

  const deals = getDealsForCity(city.airports)
  const airportCodes = city.airports.join(', ')

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Cheap Flights from ${city.name}`,
    description: `Weekly flight deals from ${city.name} airports. Save up to 90% on flights with our deal alerts.`,
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=630&fit=crop',
    brand: {
      '@type': 'Brand',
      name: 'Homebase Flights',
    },
    offers: {
      '@type': 'Offer',
      price: '59',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2026-12-31',
      url: `https://homebaseflights.com/cheap-flights-from-${city.slug}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Header cityName={city.name} citySlug={city.slug} />

      <main id="main-content" className="pt-16">
        {/* Hero Section */}
        <section className="relative pt-10 pb-32 md:pt-12 md:pb-40 overflow-hidden bg-gradient-to-b from-blue-700 via-blue-500 to-sky-300">
          {/* Cloud decorations at bottom */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Bottom left clouds */}
            <div className="absolute -left-20 bottom-24 md:bottom-16 w-80 h-40 bg-white/90 rounded-full blur-2xl"></div>
            <div className="absolute left-20 bottom-16 md:bottom-8 w-64 h-32 bg-white/95 rounded-full blur-xl"></div>
            <div className="absolute left-48 bottom-28 md:bottom-20 w-48 h-28 bg-white/85 rounded-full blur-xl"></div>

            {/* Bottom center clouds */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-12 md:bottom-4 w-96 h-36 bg-white rounded-full blur-2xl"></div>
            <div className="absolute left-1/3 bottom-20 md:bottom-12 w-72 h-32 bg-white/90 rounded-full blur-xl"></div>
            <div className="absolute left-2/3 bottom-16 md:bottom-8 w-64 h-28 bg-white/95 rounded-full blur-xl"></div>

            {/* Bottom right clouds */}
            <div className="absolute -right-20 bottom-24 md:bottom-16 w-80 h-40 bg-white/90 rounded-full blur-2xl"></div>
            <div className="absolute right-20 bottom-18 md:bottom-10 w-64 h-32 bg-white/95 rounded-full blur-xl"></div>
            <div className="absolute right-48 bottom-32 md:bottom-24 w-52 h-28 bg-white/85 rounded-full blur-xl"></div>

            {/* Extra fluffy layer */}
            <div className="absolute bottom-0 left-0 right-0 h-16 md:h-10 bg-white"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <FadeIn delay={0}>
                <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  Deals from {airportCodes}
                </div>
              </FadeIn>

              <FadeIn delay={100}>
                <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl text-white mb-6 drop-shadow-sm">
                  Cheap Flights from{' '}
                  <span className="text-yellow-200 italic">
                    {city.name}
                  </span>
                </h1>
              </FadeIn>

              <FadeIn delay={200}>
                <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                  We monitor deals 24/7 and notify you when prices drop from {city.name}.
                </p>
              </FadeIn>

              <FadeIn delay={300}>
                <EmailCapture
                  className="max-w-md mx-auto"
                  buttonText="Start your 7-day free trial"
                  cityName={city.name}
                  citySlug={city.slug}
                />
                <p className="text-white/70 text-sm mt-4">
                  Cancel anytime · No spam · Only real deals
                </p>
              </FadeIn>

              {/* Recent Deals Section - Stacked Cards with Hover Expand */}
              {deals.length > 0 && (
                <FadeIn delay={400} className="relative z-10 mt-16 md:mt-20">
                  <div id="deals" className="max-w-6xl mx-auto">
                    <p className="text-white/80 text-sm mb-4">
                      Updated {getYesterdayFormatted()} — Deals from {city.name} available now. Prices can change anytime.
                    </p>
                    {/* Mobile: horizontal scroll, Desktop: stacked with hover */}
                    {/* Mobile layout */}
                    <div className="flex md:hidden gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4">
                      {deals.slice(0, 3).map((deal, index) => (
                        <div key={index} className="flex-shrink-0 w-[220px] snap-center">
                          <DealCard deal={deal} />
                        </div>
                      ))}
                    </div>

                    {/* Desktop layout - stacked with hover */}
                    <div className="hidden md:block relative h-[300px] group cursor-pointer">
                      {/* Hover hint */}
                      <p className="text-xs text-white/80 mb-4 group-hover:opacity-0 transition-opacity flex items-center justify-center gap-1">
                        Hover to see more deals
                        <svg className="w-3 h-3 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </p>
                      {/* Card 3 - Peeks left */}
                      {deals[2] && (
                        <div className="absolute left-1/2 w-[220px] transform translate-x-[calc(-50%-30px)] rotate-[4deg] translate-y-3 opacity-65 scale-[0.95] transition-all duration-500 ease-out group-hover:opacity-100 group-hover:rotate-[-2deg] group-hover:scale-100 group-hover:translate-y-0 group-hover:translate-x-[calc(-50%-240px)]">
                          <DealCard deal={deals[2]} />
                        </div>
                      )}
                      {/* Card 2 - Peeks right */}
                      {deals[1] && (
                        <div className="absolute left-1/2 w-[220px] transform translate-x-[calc(-50%+25px)] rotate-[-3deg] translate-y-2 opacity-80 scale-[0.97] transition-all duration-500 ease-out group-hover:opacity-100 group-hover:rotate-[2deg] group-hover:scale-100 group-hover:translate-y-0 group-hover:translate-x-[-50%]">
                          <DealCard deal={deals[1]} />
                        </div>
                      )}
                      {/* Card 1 - Top center */}
                      <div className="absolute left-1/2 w-[220px] transform translate-x-[-50%] rotate-[1deg] shadow-2xl transition-all duration-500 ease-out group-hover:rotate-[-3deg] group-hover:translate-x-[calc(-50%+240px)] group-hover:shadow-lg">
                        <DealCard deal={deals[0]} />
                      </div>
                    </div>
                  </div>
                </FadeIn>
              )}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <div id="how-it-works">
          <HowItWorks />
        </div>

        {/* Testimonials */}
        <section className="py-24 bg-gradient-to-b from-white to-surface">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="heading-display text-3xl md:text-5xl text-text-primary mb-4">
                Loved by travelers <span className="heading-accent">everywhere</span>
              </h2>
              <p className="text-lg text-text-secondary">
                Join thousands who are saving big on every trip
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {testimonials.map(testimonial => (
                <Testimonial key={testimonial.name} {...testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* Recent Deals Section */}
        {deals.length > 0 && (
          <section id="sample-deals" className="py-24 bg-blue-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <p className="text-sm uppercase tracking-widest text-text-secondary mb-4">
                  Real examples
                </p>
                <h2 className="heading-display text-3xl md:text-4xl text-text-primary mb-4">
                  Recent deals our members from <span className="heading-accent">{city.name}</span> received
                </h2>
                <p className="text-text-secondary max-w-2xl mx-auto">
                  These are actual deals we sent to our {city.name} members. Deals like these go out every week.
                </p>
              </div>

              <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
                {deals.slice(0, 5).map((deal, index) => (
                  <FadeIn key={deal.id} delay={100 + index * 50}>
                    <DealCard deal={deal} />
                  </FadeIn>
                ))}
              </div>

              <div className="text-center mt-10">
                <p className="text-text-muted text-sm">
                  New deals added weekly. Join to never miss one.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Why Join */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-sm uppercase tracking-widest text-text-secondary mb-4">
                  Why choose us
                </p>
                <h2 className="heading-display text-3xl md:text-4xl text-text-primary mb-4">
                  Why Get Deals from <span className="heading-accent">{city.name}?</span>
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-text-primary mb-2">
                    Local to You
                  </h3>
                  <p className="text-text-secondary">
                    Every deal departs from {city.name} area airports. No
                    connecting flights to worry about.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-text-primary mb-2">
                    Massive Savings
                  </h3>
                  <p className="text-text-secondary">
                    Save 40-90% on flights. Our members save an average of $500+
                    per booking.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-text-primary mb-2">
                    Instant Alerts
                  </h3>
                  <p className="text-text-secondary">
                    Get notified the moment we find a great deal. Speed is key -
                    the best fares sell out fast.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Guarantee */}
        <div id="guarantee">
          <Guarantee />
        </div>

        {/* FAQ */}
        <FAQ />

        {/* Related Blog Posts - Internal Linking */}
        <RelatedBlogPosts cityName={city.name} />

        {/* Related Cities */}
        <RelatedCities currentSlug={city.slug} />

        {/* Final CTA */}
        <section className="py-24 bg-gradient-to-t from-accent/20 via-white to-surface">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="heading-display text-3xl md:text-5xl text-text-primary mb-6">
                Never Overpay for a Flight from <span className="heading-accent">{city.name}</span> Again
              </h2>
              <p className="text-lg text-text-secondary mb-10 leading-relaxed">
                Join thousands of travelers who save hundreds on every trip.
              </p>
              <EmailCapture
                className="max-w-md mx-auto"
                buttonText="Start your 7-day free trial"
                cityName={city.name}
                citySlug={city.slug}
                variant="light"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
