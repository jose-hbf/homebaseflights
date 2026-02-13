import { Metadata } from 'next'
import Link from 'next/link'
import { StaticEmailForm } from '@/components/ads/StaticEmailForm'

/**
 * NYC Ads Landing Page - MAXIMUM LCP OPTIMIZATION
 *
 * This page uses a separate root layout that:
 * - Has NO Google Fonts (uses system fonts)
 * - Has NO Tailwind CSS
 * - Has ALL CSS inlined
 * - Defers ALL JavaScript
 *
 * Target: LCP < 1.5s
 */

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
      {/* Header */}
      <header className="ads-header">
        <div className="ads-header-inner">
          <Link href="/">
            <svg className="ads-logo" viewBox="0 0 180 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="20" fontFamily="Georgia, serif" fontSize="17" fontWeight="600" fill="#111827">
                Homebase Flights
              </text>
            </svg>
          </Link>
        </div>
      </header>

      <main className="ads-main">
        {/* HERO - LCP Element */}
        <section className="ads-hero">
          <div className="ads-container">
            <p className="ads-preheader">DEALS FROM JFK, EWR &amp; LAGUARDIA</p>

            {/* LCP Element - highest priority */}
            <h1 className="ads-h1" style={{ contentVisibility: 'auto' }}>
              NYC → Paris $273. Dublin $207. Barcelona $293.
            </h1>

            <p className="ads-subtitle">
              We find cheap flights from YOUR airport. Not someone else&apos;s.
              Get deals like these in your inbox every week.
            </p>

            <p className="ads-social-proof">Trusted by travelers from NYC</p>

            <StaticEmailForm
              cityName="New York"
              citySlug="new-york"
              buttonText="Try Free for 14 Days"
              formId="email-form"
            />

            <p className="ads-note">Cancel anytime. Takes 30 seconds. No spam, ever.</p>

            <div className="ads-trust">
              <span>🔒 Secure checkout</span>
              <span>⭐ 4.8/5 rating</span>
              <span>💳 Cancel anytime</span>
              <span>🛡️ Money-back guarantee</span>
            </div>
          </div>
        </section>

        {/* Deals - Below fold, defer rendering */}
        <section className="ads-section ads-section-white" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}>
          <div className="ads-section-inner">
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
                    <span className="ads-deal-price-current">${deal.price}</span>
                    <span className="ads-deal-price-original">${deal.originalPrice}</span>
                  </div>
                  <div className="ads-deal-details">
                    <p>{deal.dates}</p>
                    <p>{deal.airline} · {deal.stops}</p>
                  </div>
                  <div className="ads-deal-savings">
                    -{deal.discount}% · Save ${deal.originalPrice - deal.price}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center" style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '2rem' }}>
              New deals found every week. Try free to never miss one.
            </p>

            <div className="text-center" style={{ marginTop: '2rem' }}>
              <a href="#email-form" className="ads-button" style={{ display: 'inline-block' }}>
                Try Free for 14 Days
              </a>
            </div>
          </div>
        </section>

        {/* Testimonials - Below fold */}
        <section className="ads-section ads-section-white" style={{ borderTop: '1px solid #f3f4f6', contentVisibility: 'auto', containIntrinsicSize: '0 600px' }}>
          <div className="ads-section-inner">
            <h2 className="ads-h1" style={{ marginBottom: '2.5rem' }}>
              What our members are saying
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: '64rem', margin: '0 auto' }}>
              {testimonials.map((t, i) => (
                <div key={i} className="ads-testimonial">
                  <div className="ads-stars">★★★★★</div>
                  <p style={{ color: '#374151', marginBottom: '1rem', lineHeight: '1.6' }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    — {t.author}, {t.location}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center" style={{ marginTop: '2.5rem' }}>
              <a href="#email-form" className="ads-button" style={{ display: 'inline-block' }}>
                Try Free for 14 Days
              </a>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="ads-section ads-section-gray">
          <div className="ads-section-inner" style={{ maxWidth: '64rem' }}>
            <h2 className="ads-h1" style={{ marginBottom: '2.5rem' }}>How it works</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', maxWidth: '48rem', margin: '0 auto' }}>
              <div className="text-center">
                <div style={{ width: '3.5rem', height: '3.5rem', background: 'rgba(255,107,53,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem' }}>📍</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>You pick your airport</h3>
                <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>We only send deals from JFK, EWR &amp; LaGuardia. No noise from other cities.</p>
              </div>
              <div className="text-center">
                <div style={{ width: '3.5rem', height: '3.5rem', background: 'rgba(255,107,53,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem' }}>🔍</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>We find the deals</h3>
                <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>Our system scans prices 24/7 and catches drops the moment they happen.</p>
              </div>
              <div className="text-center">
                <div style={{ width: '3.5rem', height: '3.5rem', background: 'rgba(255,107,53,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem' }}>✈️</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>You book and save</h3>
                <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>Book directly with the airline. Average savings: $420 per trip.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Guarantee */}
        <section className="ads-section ads-section-warm">
          <div className="ads-section-inner text-center" style={{ maxWidth: '42rem' }}>
            <h2 className="ads-h1" style={{ marginBottom: '1rem' }}>
              Don&apos;t save 3× your subscription? Get your money back.
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
              If you don&apos;t save at least $177 on flights in your first year, we&apos;ll refund your $59 membership. No questions asked.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', fontSize: '0.875rem' }}>
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

        {/* Final CTA */}
        <section id="final-cta" className="ads-section ads-section-white" style={{ paddingTop: '4rem', paddingBottom: '5rem' }}>
          <div className="ads-section-inner text-center" style={{ maxWidth: '42rem' }}>
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

      {/* Footer */}
      <footer className="ads-footer">
        <p>© {new Date().getFullYear()} Homebase Flights. All rights reserved.</p>
        <div style={{ marginTop: '0.5rem' }}>
          <Link href="/privacy" style={{ marginRight: '1rem' }}>Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </footer>
    </>
  )
}
