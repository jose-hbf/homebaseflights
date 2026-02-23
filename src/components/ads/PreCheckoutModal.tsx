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

        {/* Scrollable content area */}
        <div className="precheckout-modal-scroll">
          <div className="precheckout-modal-content">
            <div className="precheckout-icon">
              ✈️
            </div>

            <h2 className="precheckout-title">
              Start Your 14-Day Free Trial
            </h2>

            <div className="precheckout-email">
              {email}
            </div>

            {/* Combined benefits section - more concise */}
            <div className="precheckout-highlights">
              <div className="precheckout-highlight">
                <span className="precheckout-highlight-icon">✅</span>
                <span><strong>Free for 14 days</strong> - No charge today</span>
              </div>
              <div className="precheckout-highlight">
                <span className="precheckout-highlight-icon">📅</span>
                <span>Cancel before <strong>{trialEndDate}</strong></span>
              </div>
              <div className="precheckout-highlight">
                <span className="precheckout-highlight-icon">💰</span>
                <span>Then $59/year (only $4.92/month)</span>
              </div>
              <div className="precheckout-highlight">
                <span className="precheckout-highlight-icon">🛡️</span>
                <span>30-day money-back guarantee</span>
              </div>
            </div>

            {/* What's included - simplified */}
            <div className="precheckout-included">
              <div className="precheckout-included-title">You'll get ALL flight deals from:</div>
              <div className="precheckout-airports">
                JFK • Newark • LaGuardia
              </div>
              <div className="precheckout-savings">
                Average savings: <strong>$420 per flight</strong>
              </div>
            </div>

            {/* Quick social proof */}
            <div className="precheckout-proof">
              <div className="precheckout-stars">★★★★★</div>
              <p>"Saved $287 on my Rome flight!" <span>– Sarah M.</span></p>
            </div>
          </div>
        </div>

        {/* Sticky footer with CTA */}
        <div className="precheckout-modal-footer">
          <button
            className="precheckout-continue"
            onClick={onContinue}
          >
            Continue to Secure Checkout →
          </button>
          <div className="precheckout-security">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Encrypted by Stripe
          </div>
        </div>
      </div>
    </div>
  )
}