'use client'

import { useEffect, useState } from 'react'

interface PreCheckoutModalProps {
  email: string
  cityName: string
  onContinue: () => void
  onClose: () => void
}

export function PreCheckoutModal({ email, cityName, onContinue, onClose }: PreCheckoutModalProps) {
  const [trialEndDate, setTrialEndDate] = useState('')

  useEffect(() => {
    // Calculate trial end date (14 days from now)
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 14)
    const formattedDate = endDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
    setTrialEndDate(formattedDate)
  }, [])

  return (
    <div className="precheckout-modal-overlay" onClick={onClose}>
      <div className="precheckout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="precheckout-modal-close" onClick={onClose}>
          ×
        </button>

        <div className="precheckout-modal-content">
          <div className="precheckout-icon">
            ✈️
          </div>

          <h2 className="precheckout-title">
            Start Your 14-Day Free Trial
          </h2>

          <div className="precheckout-subtitle">
            Join 50+ travelers saving $420 on average per flight from {cityName}
          </div>

          <div className="precheckout-email">
            {email}
          </div>

          {/* What's included section */}
          <div className="precheckout-section">
            <h3 className="precheckout-section-title">What you'll get instantly:</h3>
            <ul className="precheckout-features">
              <li>
                <span className="precheckout-feature-icon">📍</span>
                <div>
                  <strong>ALL deals from {cityName} airports</strong>
                  <span className="precheckout-feature-desc">JFK, EWR, LaGuardia - we monitor them all 24/7</span>
                </div>
              </li>
              <li>
                <span className="precheckout-feature-icon">💰</span>
                <div>
                  <strong>50-70% off regular prices</strong>
                  <span className="precheckout-feature-desc">Recent: Paris $273, Dublin $207, Tokyo $510</span>
                </div>
              </li>
              <li>
                <span className="precheckout-feature-icon">⚡</span>
                <div>
                  <strong>Instant alerts when prices drop</strong>
                  <span className="precheckout-feature-desc">Be first to book before deals expire</span>
                </div>
              </li>
              <li>
                <span className="precheckout-feature-icon">🎯</span>
                <div>
                  <strong>Only YOUR airports, no noise</strong>
                  <span className="precheckout-feature-desc">No deals from other cities cluttering your inbox</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Trial terms */}
          <div className="precheckout-terms">
            <div className="precheckout-terms-title">Your trial terms:</div>
            <ul className="precheckout-benefits">
              <li>
                <span className="precheckout-check">✓</span>
                <strong>Free for 14 days</strong> - No charge today
              </li>
              <li>
                <span className="precheckout-check">✓</span>
                Cancel anytime before <strong>{trialEndDate}</strong>
              </li>
              <li>
                <span className="precheckout-check">✓</span>
                Then just <strong>$59/year</strong> (that's $4.92/month)
              </li>
              <li>
                <span className="precheckout-check">✓</span>
                <strong>30-day money-back guarantee</strong> after trial
              </li>
            </ul>
          </div>

          {/* Social proof */}
          <div className="precheckout-testimonial">
            <div className="precheckout-stars">★★★★★</div>
            <p>"Found a $287 flight to Rome from JFK. Would have never seen it without Homebase Flights."</p>
            <cite>— Sarah M., Brooklyn</cite>
          </div>

          <div className="precheckout-guarantee">
            <strong>🛡️ Risk-free guarantee:</strong> If you don't save at least $100 on your first booked flight, we'll refund your entire year.
          </div>

          <button
            className="precheckout-continue"
            onClick={onContinue}
          >
            Start Free Trial →
          </button>

          <div className="precheckout-security">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            256-bit encrypted payment by Stripe
          </div>

          <div className="precheckout-cancel-note">
            Questions? Email us at help@homebaseflights.com
          </div>
        </div>
      </div>
    </div>
  )
}