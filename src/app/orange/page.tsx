import { HeaderOrange } from '@/components/orange/HeaderOrange'
import { Footer } from '@/components/Footer'
import { AirportSelectorOrange } from '@/components/orange/AirportSelectorOrange'
import { DealCardOrange } from '@/components/orange/DealCardOrange'
import { HowItWorksOrange } from '@/components/orange/HowItWorksOrange'
import { GuaranteeOrange } from '@/components/orange/GuaranteeOrange'
import { FAQ } from '@/components/FAQ'
import { TestimonialOrange } from '@/components/orange/TestimonialOrange'
import { EmailCaptureOrange } from '@/components/orange/EmailCaptureOrange'
import { ButtonOrange } from '@/components/orange/ButtonOrange'
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

export default function HomeOrange() {
  const featuredDeals = getFeaturedDeals()

  return (
    <>
      <HeaderOrange />

      <main className="pt-16">
        {/* Hero Section - Orange Theme */}
        <section className="relative pt-10 pb-20 md:pt-12 md:pb-28 overflow-hidden bg-orange-50">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm uppercase tracking-widest text-text-secondary mb-6">
                Flight deals delivered to your inbox
              </p>
              <h1 className="heading-display text-4xl md:text-6xl lg:text-7xl text-text-primary mb-8 text-balance">
                Cheap flights from your airport.{' '}
                <span className="text-orange-500 italic">Save up to 90%.</span>
              </h1>
              <p className="text-lg md:text-xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed">
                We find mistake fares, flash sales, and incredible deals from
                your home airport and send them straight to your inbox.
              </p>

              <div className="max-w-lg mx-auto mb-16">
                <p className="text-sm text-text-muted mb-4">
                  Select your home airport to see deals
                </p>
                <AirportSelectorOrange />
              </div>

              {/* Featured Deal Preview - Stacked Cards with Hover Expand */}
              <div className="max-w-6xl mx-auto">
                <p className="text-xs uppercase tracking-widest text-text-muted mb-2">Example deals from today</p>
                <div className="relative h-[300px] group cursor-pointer">
                  {/* Hover hint - above cards with arrow */}
                  <p className="text-xs text-text-secondary mb-4 group-hover:opacity-0 transition-opacity flex items-center justify-center gap-1">
                    Hover to see more deals
                    <svg className="w-3 h-3 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </p>
                  {/* Card 5 - Peeks left */}
                  <div className="absolute left-1/2 w-[220px] transform translate-x-[calc(-50%-45px)] rotate-[6deg] translate-y-5 opacity-50 scale-[0.92] transition-all duration-500 ease-out group-hover:opacity-100 group-hover:rotate-[-4deg] group-hover:scale-100 group-hover:translate-y-0 group-hover:translate-x-[calc(-50%-380px)]">
                    <DealCardOrange deal={featuredDeals[4] || featuredDeals[0]} showOrigin />
                  </div>
                  {/* Card 4 - Peeks right */}
                  <div className="absolute left-1/2 w-[220px] transform translate-x-[calc(-50%+40px)] rotate-[-5deg] translate-y-4 opacity-55 scale-[0.93] transition-all duration-500 ease-out group-hover:opacity-100 group-hover:rotate-[3deg] group-hover:scale-100 group-hover:translate-y-0 group-hover:translate-x-[calc(-50%-190px)]">
                    <DealCardOrange deal={featuredDeals[3] || featuredDeals[1]} showOrigin />
                  </div>
                  {/* Card 3 - Peeks left */}
                  <div className="absolute left-1/2 w-[220px] transform translate-x-[calc(-50%-30px)] rotate-[4deg] translate-y-3 opacity-65 scale-[0.95] transition-all duration-500 ease-out group-hover:opacity-100 group-hover:rotate-[-2deg] group-hover:scale-100 group-hover:translate-y-0 group-hover:translate-x-[-50%]">
                    <DealCardOrange deal={featuredDeals[2]} showOrigin />
                  </div>
                  {/* Card 2 - Peeks right */}
                  <div className="absolute left-1/2 w-[220px] transform translate-x-[calc(-50%+25px)] rotate-[-3deg] translate-y-2 opacity-80 scale-[0.97] transition-all duration-500 ease-out group-hover:opacity-100 group-hover:rotate-[2deg] group-hover:scale-100 group-hover:translate-y-0 group-hover:translate-x-[calc(-50%+190px)]">
                    <DealCardOrange deal={featuredDeals[1]} showOrigin />
                  </div>
                  {/* Card 1 - Top center */}
                  <div className="absolute left-1/2 w-[220px] transform translate-x-[-50%] rotate-[1deg] shadow-2xl transition-all duration-500 ease-out group-hover:rotate-[-3deg] group-hover:translate-x-[calc(-50%+380px)] group-hover:shadow-lg">
                    <DealCardOrange deal={featuredDeals[0]} showOrigin />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-8 bg-white border-b border-border-subtle">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="font-serif text-2xl md:text-3xl font-semibold text-orange-600 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-text-muted text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <div id="how-it-works">
          <HowItWorksOrange />
        </div>

        {/* Social Proof */}
        <section className="py-24 bg-gradient-to-b from-white to-surface">
          <div className="container mx-auto px-4">
            {/* Testimonials */}
            <div className="text-center mb-16">
              <h2 className="heading-display text-3xl md:text-5xl text-text-primary mb-4">
                Loved by travelers <span className="text-orange-500 font-serif italic">everywhere</span>
              </h2>
              <p className="text-lg text-text-secondary">
                Join thousands who are saving big on every trip
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {testimonials.map(testimonial => (
                <TestimonialOrange key={testimonial.name} {...testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* Sample Deals */}
        <section id="deals" className="py-24 bg-orange-50">
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
                <DealCardOrange key={deal.id} deal={deal} showOrigin />
              ))}
            </div>

            <div className="text-center mt-16">
              <p className="text-text-secondary mb-4">
                Want deals like these from your airport?
              </p>
              <div className="max-w-md mx-auto">
                <AirportSelectorOrange placeholder="Find deals from your airport" />
              </div>
            </div>
          </div>
        </section>

        {/* Guarantee */}
        <div id="guarantee">
          <GuaranteeOrange />
        </div>

        {/* Final CTA */}
        <section className="py-24 bg-gradient-to-t from-orange-100/50 via-white to-surface">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="heading-display text-3xl md:text-5xl text-text-primary mb-6">
                Ready to start <span className="text-orange-500 font-serif italic">saving?</span>
              </h2>
              <p className="text-lg text-text-secondary mb-10 leading-relaxed">
                Join 50,000+ travelers who never overpay for flights. Get
                exclusive deals from your home airport.
              </p>
              <EmailCaptureOrange className="max-w-md mx-auto" />
              <p className="text-sm text-text-muted mt-6">
                Free to try. No credit card required. Unsubscribe anytime.
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
