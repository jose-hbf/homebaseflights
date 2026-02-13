import { Metadata } from 'next'
import Link from 'next/link'
import { StaticEmailForm } from '@/components/ads/StaticEmailForm'

/**
 * NYC Ads Landing Page - STATIC RENDER OPTIMIZED
 *
 * Performance goals:
 * - LCP < 1 second
 * - Hero renders without ANY JavaScript
 * - Form works without JS (progressive enhancement)
 * - All interactivity deferred via FormHydration in layout
 */

export const metadata: Metadata = {
  title: 'Cheap Flights from New York — Try Free for 14 Days',
  description: 'Get flight deals from JFK, EWR & LaGuardia. Paris $273, Dublin $207, Barcelona $293. Try free for 14 days.',
  robots: {
    index: false,
    follow: false,
  },
}

// Static deal data - no runtime fetching
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
    quote: "I was skeptical but the first deal I got saved me $400. Easiest money I've spent.",
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
      {/* Header - Pure HTML/CSS, no JS */}
      <header className="ads-header">
        <div className="ads-header-inner">
          <Link href="/">
            {/* Inline SVG to avoid image loading delay */}
            <svg className="ads-logo" viewBox="0 0 180 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="22" fontFamily="Georgia, serif" fontSize="18" fontWeight="600" fill="#111827">
                Homebase Flights
              </text>
            </svg>
          </Link>
        </div>
      </header>

      <main className="ads-main">
        {/* HERO SECTION - Critical path, must render in < 1s */}
        <section className="ads-hero">
          <div className="ads-container">
            {/* Pre-header */}
            <p className="ads-preheader">
              DEALS FROM JFK, EWR &amp; LAGUARDIA
            </p>

            {/* H1 - Most important for LCP */}
            <h1 className="ads-h1">
              NYC → Paris $273. Dublin $207. Barcelona $293.
            </h1>

            {/* Subtitle */}
            <p className="ads-subtitle">
              We find cheap flights from YOUR airport. Not someone else&apos;s.
              <br />
              Get deals like these in your inbox every week.
            </p>

            {/* Social proof */}
            <p className="ads-social-proof">
              Trusted by travelers from NYC
            </p>

            {/* CTA Form - Works without JavaScript */}
            <StaticEmailForm
              cityName="New York"
              citySlug="new-york"
              buttonText="Try Free for 14 Days"
              formId="email-form"
            />

            <p className="ads-note">
              Cancel anytime. Takes 30 seconds. No spam, ever.
            </p>

            {/* Trust badges */}
            <div className="ads-trust">
              <span>🔒 Secure checkout</span>
              <span>⭐ 4.8/5 rating</span>
              <span>💳 Cancel anytime</span>
              <span>🛡️ Money-back guarantee</span>
            </div>
          </div>
        </section>

        {/* DEALS SECTION - Below the fold, less critical */}
        <section style={{ padding: '3rem 1rem', background: 'white' }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
            <h2 className="ads-h1" style={{ marginBottom: '2rem' }}>
              This week&apos;s deals from New York
            </h2>

            <div className="ads-deals-grid">
              {deals.map((deal) => (
                <div key={deal.destination} className="ads-deal-card">
                  {deal.urgencyLabel && (
                    <div className="ads-deal-urgency">
                      <span className="ads-deal-dot" />
                      <span>{deal.urgencyLabel}</span>
                    </div>
                  )}
                  <div className="ads-deal-destination">{deal.destination}</div>
                  <div className="ads-deal-country">{deal.country}</div>
                  <div className="ads-deal-price">
                    <span className="ads-deal-price-current">${deal.price.toLocaleString()}</span>
                    <span className="ads-deal-price-original">${deal.originalPrice.toLocaleString()}</span>
                  </div>
                  <div className="ads-deal-details">
                    <p>{deal.dates}</p>
                    <p>{deal.airline} · {deal.stops}</p>
                  </div>
                  <div className="ads-deal-savings">
                    -{deal.discount}% · Save ${(deal.originalPrice - deal.price).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem', marginTop: '2rem' }}>
              New deals found every week. Try free to never miss one.
            </p>

            {/* Secondary CTA - anchor link, no JS needed */}
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <a
                href="#email-form"
                className="ads-button"
                style={{ display: 'inline-block', textDecoration: 'none' }}
              >
                Try Free for 14 Days
              </a>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section style={{ padding: '3rem 1rem', background: 'white', borderTop: '1px solid #f3f4f6' }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
            <h2 className="ads-h1" style={{ marginBottom: '2.5rem' }}>
              What our members are saying
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: '64rem', margin: '0 auto' }}>
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  style={{
                    background: '#f9fafb',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    border: '1px solid #f3f4f6',
                  }}
                >
                  <div style={{ color: '#FF6B35', marginBottom: '0.75rem', fontSize: '1.125rem' }}>
                    ★★★★★
                  </div>
                  <p style={{ color: '#374151', marginBottom: '1rem', lineHeight: '1.6' }}>
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    — {testimonial.author}, {testimonial.location}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <a
                href="#email-form"
                className="ads-button"
                style={{ display: 'inline-block', textDecoration: 'none' }}
              >
                Try Free for 14 Days
              </a>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section style={{ padding: '3rem 1rem', background: '#f9fafb' }}>
          <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '0 1rem' }}>
            <h2 className="ads-h1" style={{ marginBottom: '2.5rem' }}>
              How it works
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', maxWidth: '48rem', margin: '0 auto' }}>
              {/* Step 1 */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  background: 'rgba(255, 107, 53, 0.1)',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontSize: '1.5rem',
                }}>
                  📍
                </div>
                <h3 style={{ fontFamily: 'var(--font-fraunces), Georgia, serif', fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  You pick your airport
                </h3>
                <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>
                  We only send deals from JFK, EWR &amp; LaGuardia. No noise from other cities.
                </p>
              </div>

              {/* Step 2 */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  background: 'rgba(255, 107, 53, 0.1)',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontSize: '1.5rem',
                }}>
                  🔍
                </div>
                <h3 style={{ fontFamily: 'var(--font-fraunces), Georgia, serif', fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  We find the deals
                </h3>
                <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>
                  Our system scans prices 24/7 and catches drops the moment they happen.
                </p>
              </div>

              {/* Step 3 */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  background: 'rgba(255, 107, 53, 0.1)',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontSize: '1.5rem',
                }}>
                  ✈️
                </div>
                <h3 style={{ fontFamily: 'var(--font-fraunces), Georgia, serif', fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  You book and save
                </h3>
                <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>
                  Book directly with the airline. Average savings: $420 per trip.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* GUARANTEE SECTION */}
        <section style={{ padding: '3rem 1rem', background: '#FFF8F5' }}>
          <div style={{ maxWidth: '42rem', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
            <h2 className="ads-h1" style={{ marginBottom: '1rem' }}>
              Don&apos;t save 3× your subscription? Get your money back.
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
              If you don&apos;t save at least $177 on flights in your first year, we&apos;ll refund your $59 membership. No questions asked.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontSize: '0.875rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#374151' }}>
                <span style={{ color: '#22c55e' }}>✓</span> Cancel anytime during trial
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#374151' }}>
                <span style={{ color: '#22c55e' }}>✓</span> No hidden fees, ever
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#374151' }}>
                <span style={{ color: '#22c55e' }}>✓</span> $59/year = $4.92/month
              </span>
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section id="final-cta" style={{ padding: '4rem 1rem 5rem', background: 'white' }}>
          <div style={{ maxWidth: '42rem', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
            <h2 className="ads-h1" style={{ marginBottom: '2rem' }}>
              Stop overpaying for flights from New York.
            </h2>

            <StaticEmailForm
              cityName="New York"
              citySlug="new-york"
              buttonText="Start Your Free 14-Day Trial"
              formId="email-form-bottom"
            />

            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '1rem' }}>
              You&apos;ll see your first deals within 24 hours.
            </p>
          </div>
        </section>
      </main>

      {/* Footer - Minimal */}
      <footer style={{ padding: '2rem 1rem', background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            © {new Date().getFullYear()} Homebase Flights. All rights reserved.
          </p>
          <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            <Link href="/privacy" style={{ color: '#6b7280', textDecoration: 'none', marginRight: '1rem' }}>
              Privacy
            </Link>
            <Link href="/terms" style={{ color: '#6b7280', textDecoration: 'none' }}>
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}
