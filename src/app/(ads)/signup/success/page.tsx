import { Metadata } from 'next'
import Link from 'next/link'
import { SuccessPageTracker } from '@/components/ads/SuccessPageTracker'

export const metadata: Metadata = {
  title: 'You\'re In! - Homebase Flights',
  description: 'Welcome to Homebase Flights. Check your inbox for flight deals.',
  robots: {
    index: false,
    follow: false,
  },
}

const sampleDeals = [
  {
    destination: 'Paris',
    country: 'France',
    price: 273,
    originalPrice: 850,
    discount: 68,
    dates: 'Feb - Apr 2026',
    airline: 'Multiple Airlines',
    stops: 'Nonstop',
  },
  {
    destination: 'Dublin',
    country: 'Ireland',
    price: 207,
    originalPrice: 620,
    discount: 67,
    dates: 'Mar - Jun 2026',
    airline: 'Aer Lingus',
    stops: 'Nonstop',
  },
]

export default function SignupSuccessPage() {
  return (
    <>
      {/* Conversion Tracking */}
      <SuccessPageTracker />

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
        {/* Success Hero */}
        <section className="ads-hero" style={{ paddingTop: '4rem', paddingBottom: '3rem' }}>
          <div className="ads-container">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              ✈️
            </div>
            <h1 className="ads-h1" style={{ marginBottom: '1rem' }}>
              You&apos;re in! Check your inbox.
            </h1>
            <p className="ads-subtitle" style={{ marginBottom: '2rem' }}>
              We just sent you a welcome email with your first deals preview.
              You&apos;ll get 2 deals per week from NYC airports.
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#dcfce7',
              color: '#15803d',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}>
              <span>✓</span> Free weekly deals activated
            </div>
          </div>
        </section>

        {/* Sample Deals Preview */}
        <section className="ads-section ads-section-white" style={{ paddingTop: '2rem' }}>
          <div className="ads-section-inner" style={{ maxWidth: '42rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#111827',
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}>
              Here&apos;s a preview of recent deals
            </h2>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {sampleDeals.map((deal) => (
                <div key={deal.destination} className="ads-deal-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div className="ads-deal-destination">NYC → {deal.destination}</div>
                      <div className="ads-deal-country">{deal.country}</div>
                      <div className="ads-deal-details">
                        <p>{deal.dates}</p>
                        <p>{deal.airline} · {deal.stops}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="ads-deal-price">
                        <span className="ads-deal-price-current">${deal.price}</span>
                        <span className="ads-deal-price-original">${deal.originalPrice}</span>
                      </div>
                      <div className="ads-deal-savings">
                        Save ${deal.originalPrice - deal.price}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p style={{
              color: '#6b7280',
              fontSize: '0.875rem',
              marginTop: '1.5rem',
              textAlign: 'center',
            }}>
              Deals like these go straight to your inbox every week.
            </p>
          </div>
        </section>

        {/* Upgrade CTA */}
        <section className="ads-section ads-section-warm">
          <div className="ads-section-inner text-center" style={{ maxWidth: '42rem' }}>
            <h2 className="ads-h1" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
              Want ALL deals? Not just 2 per week?
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
              Pro members get every deal the moment it drops. Plus instant alerts for 50%+ off deals.
            </p>
            <a
              href="https://homebaseflights.com/pricing"
              className="ads-button"
              style={{ display: 'inline-block' }}
            >
              Upgrade to Pro → $59/year
            </a>
            <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '1rem' }}>
              That&apos;s just $4.92/month. One deal pays for the whole year.
            </p>
          </div>
        </section>

        {/* Tip Section */}
        <section className="ads-section ads-section-white">
          <div className="ads-section-inner text-center" style={{ maxWidth: '32rem' }}>
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f9fafb',
              borderRadius: '1rem',
              border: '1px solid #e5e7eb',
            }}>
              <p style={{
                fontWeight: 600,
                color: '#111827',
                marginBottom: '0.5rem',
                fontSize: '1rem',
              }}>
                📧 Don&apos;t miss your deals
              </p>
              <p style={{ color: '#4b5563', fontSize: '0.875rem', margin: 0 }}>
                Add <strong>deals@homebaseflights.com</strong> to your contacts
                so emails don&apos;t end up in spam or promotions.
              </p>
            </div>
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
