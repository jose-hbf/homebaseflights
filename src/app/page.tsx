import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AirportSelector } from '@/components/AirportSelector'
import { DealCard } from '@/components/DealCard'
import { HowItWorks } from '@/components/HowItWorks'
import { Guarantee } from '@/components/Guarantee'
import { FAQ } from '@/components/FAQ'
import { Testimonial } from '@/components/Testimonial'
import { PopularAirports } from '@/components/PopularAirports'
import { FadeIn } from '@/components/FadeIn'
import { getFeaturedDeals } from '@/data/deals'

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

const stats = [
  { value: '$500+', label: 'Average savings per trip' },
  { value: '50,000+', label: 'Happy members' },
  { value: '15+', label: 'Deals sent weekly' },
  { value: '90%', label: 'Off normal prices' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Cheap Flights from Your Airport',
  description: 'Weekly flight deals from your home airport',
  brand: {
    '@type': 'Brand',
    name: 'Homebase Flights',
  },
  offers: {
    '@type': 'Offer',
    price: '59',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
}

export default function Home() {
  const featuredDeals = getFeaturedDeals()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main id="main-content" className="pt-16">
        {/* Hero Section */}
        <section className="relative pt-10 pb-20 md:pt-12 md:pb-28 overflow-hidden bg-gradient-to-b from-blue-700 via-blue-500 to-sky-300">
          {/* Cloud decorations at bottom */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Bottom left clouds */}
            <div className="absolute -left-20 bottom-40 md:bottom-32 w-80 h-40 bg-white/90 rounded-full blur-2xl"></div>
            <div className="absolute left-20 bottom-32 md:bottom-24 w-64 h-32 bg-white/95 rounded-full blur-xl"></div>
            <div className="absolute left-48 bottom-44 md:bottom-36 w-48 h-28 bg-white/85 rounded-full blur-xl"></div>

            {/* Bottom center clouds */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-28 md:bottom-20 w-96 h-36 bg-white rounded-full blur-2xl"></div>
            <div className="absolute left-1/3 bottom-36 md:bottom-28 w-72 h-32 bg-white/90 rounded-full blur-xl"></div>
            <div className="absolute left-2/3 bottom-32 md:bottom-24 w-64 h-28 bg-white/95 rounded-full blur-xl"></div>

            {/* Bottom right clouds */}
            <div className="absolute -right-20 bottom-40 md:bottom-32 w-80 h-40 bg-white/90 rounded-full blur-2xl"></div>
            <div className="absolute right-20 bottom-34 md:bottom-26 w-64 h-32 bg-white/95 rounded-full blur-xl"></div>
            <div className="absolute right-48 bottom-48 md:bottom-40 w-52 h-28 bg-white/85 rounded-full blur-xl"></div>

            {/* Extra fluffy layer */}
            <div className="absolute bottom-0 left-0 right-0 h-28 md:h-20 bg-white"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <FadeIn delay={0}>
                <p className="text-sm uppercase tracking-widest text-white/80 mb-6">
                  Flight deals delivered to your inbox
                </p>
              </FadeIn>
              <FadeIn delay={100}>
                <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl text-white mb-8 drop-shadow-sm">
                  Cheap flights from your airport.{' '}
                  <span className="text-yellow-200 italic">Save up to 90%.</span>
                </h1>
              </FadeIn>
              <FadeIn delay={200}>
                <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
                  We find mistake fares, flash sales, and incredible deals from
                  your home airport and send them straight to your inbox.
                </p>
              </FadeIn>

              <FadeIn delay={300} className="relative z-20">
                <div id="airport-selector" className="max-w-lg mx-auto mb-16">
                  <p className="text-sm text-white/70 mb-4">
                    Select your home airport to see deals
                  </p>
                  <AirportSelector />
                </div>
              </FadeIn>

              {/* Featured Deal Preview */}
              <FadeIn delay={400} className="relative z-10">
                <div className="max-w-6xl mx-auto">
                  <p className="text-xs uppercase tracking-widest text-white/70 mb-4">Example deals from today</p>

                  {/* Mobile layout - horizontal scroll */}
                  <div className="flex md:hidden gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4">
                    {featuredDeals.slice(0, 5).map((deal, index) => (
                      <div key={index} className="flex-shrink-0 w-[220px] snap-center">
                        <DealCard deal={deal} showOrigin />
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
                    {/* Card 5 - Peeks left */}
                    <div className="absolute left-1/2 w-[220px] transform translate-x-[calc(-50%-45px)] rotate-[6deg] translate-y-5 opacity-50 scale-[0.92] transition-all duration-500 ease-out group-hover:opacity-100 group-hover:rotate-[-4deg] group-hover:scale-100 group-hover:translate-y-0 group-hover:translate-x-[calc(-50%-380px)]">
                      <DealCard deal={featuredDeals[4] || featuredDeals[0]} showOrigin />
                    </div>
                    {/* Card 4 - Peeks right */}
                    <div className="absolute left-1/2 w-[220px] transform translate-x-[calc(-50%+40px)] rotate-[-5deg] translate-y-4 opacity-55 scale-[0.93] transition-all duration-500 ease-out group-hover:opacity-100 group-hover:rotate-[3deg] group-hover:scale-100 group-hover:translate-y-0 group-hover:translate-x-[calc(-50%-190px)]">
                      <DealCard deal={featuredDeals[3] || featuredDeals[1]} showOrigin />
                    </div>
                    {/* Card 3 - Peeks left */}
                    <div className="absolute left-1/2 w-[220px] transform translate-x-[calc(-50%-30px)] rotate-[4deg] translate-y-3 opacity-65 scale-[0.95] transition-all duration-500 ease-out group-hover:opacity-100 group-hover:rotate-[-2deg] group-hover:scale-100 group-hover:translate-y-0 group-hover:translate-x-[-50%]">
                      <DealCard deal={featuredDeals[2]} showOrigin />
                    </div>
                    {/* Card 2 - Peeks right */}
                    <div className="absolute left-1/2 w-[220px] transform translate-x-[calc(-50%+25px)] rotate-[-3deg] translate-y-2 opacity-80 scale-[0.97] transition-all duration-500 ease-out group-hover:opacity-100 group-hover:rotate-[2deg] group-hover:scale-100 group-hover:translate-y-0 group-hover:translate-x-[calc(-50%+190px)]">
                      <DealCard deal={featuredDeals[1]} showOrigin />
                    </div>
                    {/* Card 1 - Top center */}
                    <div className="absolute left-1/2 w-[220px] transform translate-x-[-50%] rotate-[1deg] shadow-2xl transition-all duration-500 ease-out group-hover:rotate-[-3deg] group-hover:translate-x-[calc(-50%+380px)] group-hover:shadow-lg">
                      <DealCard deal={featuredDeals[0]} showOrigin />
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-8 bg-white border-b border-border-subtle">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <FadeIn key={stat.label} delay={500 + index * 100}>
                  <div className="text-center">
                    <div className="font-serif text-2xl md:text-3xl font-semibold text-primary mb-1">
                      {stat.value}
                    </div>
                    <div className="text-text-muted text-xs">{stat.label}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Airports */}
        <PopularAirports />

        {/* How It Works */}
        <div id="how-it-works">
          <HowItWorks />
        </div>

        {/* Social Proof */}
        <section className="py-24 bg-gradient-to-b from-white to-surface">
          <div className="container mx-auto px-4">
            {/* Testimonials */}
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

        {/* Sample Deals */}
        <section id="deals" className="py-24 bg-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-sm uppercase tracking-widest text-text-secondary mb-4">
                Real deals, real savings
              </p>
              <h2 className="heading-display text-3xl md:text-5xl text-text-primary mb-4">
                Recent deals our members received
              </h2>
              <p className="text-lg text-text-secondary max-w-xl mx-auto">
                These are real deals we&apos;ve sent to members in the past week
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {featuredDeals.map(deal => (
                <DealCard key={deal.id} deal={deal} showOrigin />
              ))}
            </div>

            <div className="text-center mt-16">
              <p className="text-text-secondary mb-4">
                Want deals like these from your airport?
              </p>
              <div className="max-w-md mx-auto">
                <AirportSelector placeholder="Find deals from your airport" />
              </div>
            </div>
          </div>
        </section>

        {/* Guarantee */}
        <div id="guarantee">
          <Guarantee />
        </div>

        {/* Final CTA */}
        <section className="py-24 bg-gradient-to-t from-accent/20 via-white to-surface">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="heading-display text-3xl md:text-5xl text-text-primary mb-6">
                Ready to start <span className="heading-accent">saving?</span>
              </h2>
              <p className="text-lg text-text-secondary mb-10 leading-relaxed">
                Join 50,000+ travelers who never overpay for flights. Select your home airport to get started.
              </p>
              <div className="max-w-lg mx-auto">
                <AirportSelector placeholder="Where do you fly from?" />
              </div>
              <p className="text-sm text-text-muted mt-6">
                7-day free trial. No credit card required.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQ />
      </main>

      <Footer />
    </>
  )
}
