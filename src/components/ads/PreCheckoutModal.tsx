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
            ✅
          </div>

          <h2 className="precheckout-title">
            Your 14-day free trial
          </h2>

          <div className="precheckout-email">
            {email}
          </div>

          <ul className="precheckout-benefits">
            <li>
              <span className="precheckout-check">•</span>
              You won't be charged today
            </li>
            <li>
              <span className="precheckout-check">•</span>
              Cancel anytime before <strong>{trialEndDate}</strong>
            </li>
            <li>
              <span className="precheckout-check">•</span>
              After trial: <strong>$59/year</strong> ($4.92/month)
            </li>
            <li>
              <span className="precheckout-check">•</span>
              100% money-back guarantee
            </li>
          </ul>

          <div className="precheckout-note">
            Get ALL flight deals from {cityName} airports. Every week.
          </div>

          <button
            className="precheckout-continue"
            onClick={onContinue}
          >
            Continue to secure checkout →
          </button>

          <div className="precheckout-security">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Secure payment powered by Stripe
          </div>
        </div>
      </div>
    </div>
  )
}