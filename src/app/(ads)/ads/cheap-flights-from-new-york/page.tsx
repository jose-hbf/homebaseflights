import { Metadata } from 'next'
import Link from 'next/link'
import { StaticEmailForm } from '@/components/ads/StaticEmailForm'
import { InteractiveEmailForm } from '@/components/ads/InteractiveEmailForm'
import { EmailCaptureBanner } from '@/components/ads/EmailCaptureBanner'
import { StickyMobileCTA } from '@/components/ads/StickyMobileCTA'

/**
 * NYC Ads Landing Page - FREEMIUM MODEL
 *
 * This page uses a separate root layout that:
 * - Has NO Google Fonts (uses system fonts)
 * - Has NO Tailwind CSS
 * - Has ALL CSS inlined
 * - Defers ALL JavaScript
 *
 * Target: LCP < 1s
 */

export const metadata: Metadata = {
  title: 'Cheap Flights from New York — Try Free for 14 Days',
  description: 'Get ALL flight deals from JFK, EWR & LaGuardia. Paris $273, Dublin $207, Barcelona $293. Free 14-day trial, then $59/year.',
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
          <Link href="/" className="ads-logo-link">
            <svg className="ads-logo-icon" viewBox="0 0 43 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.8389 0C33.8759 0 42.8232 7.97765 42.8232 17.8184C42.8232 17.9885 42.8207 18.1581 42.8154 18.3271H42.8232V39.5059H42.7666C41.9693 48.7282 32.9092 56 21.8506 56C21.741 56 21.6316 55.9975 21.5225 55.9961C21.4126 55.9975 21.3026 56 21.1924 56C10.018 56 0.863318 48.7282 0.0576172 39.5059H0V18.3271H0.00878906C0.00329639 18.1581 1.92069e-06 17.9885 0 17.8184C0 7.97765 9.24267 0 20.6436 0C21.0174 6.38904e-06 21.3889 0.00844656 21.7578 0.0253906C22.1157 0.0083734 22.4762 5.56123e-06 22.8389 0ZM13.4375 21.8037C11.2189 21.098 9.24927 21.152 7.83691 21.3799C7.13102 21.4938 6.57217 21.6493 6.20508 21.7705C6.1274 21.7962 6.05951 21.8229 6 21.8447V37.4629H6.04199C6.62502 44.8079 13.2516 50.5994 21.3408 50.5996C21.4206 50.5996 21.5006 50.5968 21.5801 50.5957C21.6593 50.5968 21.7389 50.5996 21.8184 50.5996C29.8238 50.5995 36.382 44.8079 36.959 37.4629H37V32.25C36.9348 32.1784 36.8719 32.1037 36.8145 32.0234L36.6787 31.8125C36.68 31.8147 36.681 31.8174 36.6816 31.8184C36.6811 31.8176 36.6796 31.816 36.6787 31.8145C36.6726 31.8043 36.6583 31.7801 36.6357 31.7451C36.5899 31.6739 36.5107 31.5542 36.3965 31.3994C36.1669 31.0884 35.8002 30.6384 35.29 30.1377C34.2689 29.1356 32.6922 27.9529 30.4736 27.2471C28.2554 26.5415 26.2863 26.5954 24.874 26.8232C24.1682 26.9371 23.6093 27.0937 23.2422 27.2148C23.1835 27.2342 23.1304 27.2552 23.082 27.2725C23.0692 27.28 23.0569 27.2895 23.0439 27.2969C22.5917 27.5537 22.0934 27.654 21.6113 27.6152C20.7133 27.5744 19.868 27.0511 19.46 26.1807C19.4302 26.1171 19.4049 26.052 19.3809 25.9873C19.3737 25.9775 19.3668 25.9661 19.3594 25.9561C19.1298 25.6451 18.7639 25.1949 18.2539 24.6943C17.2328 23.6922 15.6561 22.5096 13.4375 21.8037ZM22.5332 6C22.2708 6.00001 22.01 6.00697 21.751 6.02051C21.4837 6.007 21.2142 6 20.9434 6C14.0196 6.00018 8.1964 10.472 6.5 16.54C6.67337 16.5061 6.85347 16.4735 7.04004 16.4434C9.04671 16.1195 11.8322 16.0463 14.9531 17.0391C18.0741 18.032 20.3051 19.7012 21.7559 21.125C22.1281 21.4904 22.4507 21.8415 22.7256 22.1631C23.126 22.063 23.5788 21.9671 24.0771 21.8867C26.0838 21.5629 28.8694 21.4906 31.9902 22.4834C34.0305 23.1326 35.6897 24.0716 37 25.041V20.5967H36.9941C36.998 20.4618 37 20.3262 37 20.1904C36.9998 12.3532 30.5229 6 22.5332 6Z" fill="#2563EB"/>
            </svg>
            <span className="ads-logo-text">Homebase Flights</span>
          </Link>
        </div>
      </header>

      <main className="ads-main">
        {/* HERO with Deals */}
        <section className="ads-hero" data-deals-section>
          <div className="ads-container">
            <p className="ads-preheader">DEALS FROM JFK, EWR &amp; LAGUARDIA</p>

            {/* LCP Element - highest priority */}
            <h1 className="ads-h1" style={{ contentVisibility: 'auto' }}>
              Cheap flights from New York. Every week.
            </h1>

            <p className="ads-subtitle">
              We find cheap flights from YOUR airport. Not someone else&apos;s.
            </p>

            {/* Social proof - early */}
            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem', marginTop: '0.75rem', marginBottom: '1.5rem' }}>
              <span style={{ color: '#f59e0b' }}>★★★★★</span> Trusted by 50+ travelers from NYC
            </p>

            {/* Savings counter */}
            <p style={{ textAlign: 'center', fontSize: '1.125rem', color: '#374151', marginBottom: '2rem' }}>
              NYC travelers saved <span style={{ color: '#FF6B35', fontWeight: 700 }}>$12,400+</span> on flights this month
            </p>

            {/* Deal Cards Grid - Right in the hero */}
            <div className="ads-deals-grid" style={{ maxWidth: '64rem', margin: '0 auto' }}>
              {deals.map((deal) => (
                <label key={deal.destination} className="ads-deal-card-clickable" htmlFor={`modal-${deal.destination.toLowerCase()}`}>
                  <div className="ads-deal-destination">{deal.destination}</div>
                  <div className="ads-deal-country">{deal.country}</div>
                  <div className="ads-deal-price">
                    <span className="ads-deal-price-current">${deal.price}</span>
                    <span className="ads-deal-price-original">${deal.originalPrice}</span>
                  </div>
                  <div className="ads-deal-savings">
                    Save ${deal.originalPrice - deal.price}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* CSS-only Modals for each deal */}
        {deals.map((deal) => (
          <div key={`modal-${deal.destination}`} className="ads-modal-wrapper">
            <input type="checkbox" id={`modal-${deal.destination.toLowerCase()}`} className="ads-modal-toggle" />
            <div className="ads-modal-overlay">
              <label className="ads-modal-close-area" htmlFor={`modal-${deal.destination.toLowerCase()}`} />
              <div className="ads-modal">
                <label className="ads-modal-close" htmlFor={`modal-${deal.destination.toLowerCase()}`}>×</label>
                <div className="ads-modal-content">
                  <div className="ads-modal-header">
                    <p className="ads-modal-route">NYC → {deal.destination}</p>
                    <p className="ads-modal-country">{deal.country}</p>
                  </div>
                  <div className="ads-modal-price-section">
                    <span className="ads-modal-price">${deal.price}</span>
                    <span className="ads-modal-price-original">${deal.originalPrice}</span>
                  </div>
                  <div className="ads-modal-savings">
                    Save ${deal.originalPrice - deal.price} ({deal.discount}% off)
                  </div>
                  <div className="ads-modal-details">
                    <div className="ads-modal-detail-row">
                      <span className="ads-modal-detail-label">Travel dates</span>
                      <span className="ads-modal-detail-value">{deal.dates}</span>
                    </div>
                    <div className="ads-modal-detail-row">
                      <span className="ads-modal-detail-label">Airline</span>
                      <span className="ads-modal-detail-value">{deal.airline}</span>
                    </div>
                    <div className="ads-modal-detail-row">
                      <span className="ads-modal-detail-label">Stops</span>
                      <span className="ads-modal-detail-value">{deal.stops}</span>
                    </div>
                  </div>
                  <p className="ads-modal-note">
                    Deals like this appear 2-3 times per month from NYC airports.
                  </p>
                </div>
                <div className="ads-modal-footer">
                  <p className="ads-modal-footer-text">Get ALL deals from NYC. Every week.</p>
                  <form action="/api/ads-signup" method="POST" className="ads-modal-form" data-city-slug="new-york" data-city-name="New York">
                    <input type="hidden" name="citySlug" value="new-york" />
                    <input type="hidden" name="cityName" value="New York" />
                    <input type="hidden" name="plan" value="trial" />
                    <div className="ads-modal-form-row">
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="Enter your email"
                        autoComplete="email"
                        className="ads-modal-input"
                      />
                      <button type="submit" className="ads-modal-submit">
                        Start Free 14-Day Trial
                      </button>
                    </div>
                  </form>
                  <p style={{ color: '#6b7280', fontSize: '0.7rem', marginTop: '0.5rem', textAlign: 'center' }}>
                    Cancel anytime. $59/year after trial. Money-back guarantee.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Email Capture Section - Always visible below deals */}
        <section id="email-form" className="ads-section ads-section-white" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
          <div className="ads-section-inner text-center" style={{ maxWidth: '32rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 600, color: '#111827', marginBottom: '1.5rem' }}>
              Get ALL deals from NYC. Every week.
            </h2>
            <InteractiveEmailForm
              cityName="New York"
              citySlug="new-york"
              formId="email-form-main"
              defaultPlan="trial"
            />
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
                Get Free Deals
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

        {/* Why it's free */}
        <section className="ads-section ads-section-warm">
          <div className="ads-section-inner text-center" style={{ maxWidth: '42rem' }}>
            <h2 className="ads-h1" style={{ marginBottom: '1rem' }}>
              Average savings: $420 per flight
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
              Free members get 2 of our best deals each week. That&apos;s often enough to find your next trip.
              Want every deal? Upgrade to Pro anytime.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', fontSize: '0.875rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#374151' }}>
                <span style={{ color: '#22c55e' }}>✓</span> Free forever
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#374151' }}>
                <span style={{ color: '#22c55e' }}>✓</span> No credit card required
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#374151' }}>
                <span style={{ color: '#22c55e' }}>✓</span> Unsubscribe anytime
              </span>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section id="final-cta" className="ads-section ads-section-white" style={{ paddingTop: '4rem', paddingBottom: '5rem' }}>
          <div className="ads-section-inner text-center" style={{ maxWidth: '42rem' }}>
            <h2 className="ads-h1" style={{ marginBottom: '0.5rem' }}>
              Stop overpaying for flights from New York.
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '2rem' }}>
              Get ALL deals from NYC. Every week.
            </p>

            <InteractiveEmailForm
              cityName="New York"
              citySlug="new-york"
              formId="email-form-bottom"
              defaultPlan="trial"
            />
          </div>
        </section>
      </main>

      {/* Email Capture Banner - Client Component */}
      <EmailCaptureBanner citySlug="new-york" cityName="NYC" />

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA />

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
