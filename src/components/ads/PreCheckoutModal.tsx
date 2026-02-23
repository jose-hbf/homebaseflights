'use client'

import { useEffect, useState } from 'react'

interface PreCheckoutModalProps {
  email?: string
  cityName: string
  citySlug: string
  onContinue?: () => void
  onClose: () => void
}

export function PreCheckoutModal({ email: initialEmail = '', cityName, citySlug, onContinue, onClose }: PreCheckoutModalProps) {
  const [trialEndDate, setTrialEndDate] = useState('')
  const [email, setEmail] = useState(initialEmail)
  const [emailError, setEmailError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeBasedMessage, setTimeBasedMessage] = useState('')
  const [randomViewers, setRandomViewers] = useState(0)

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

    // Set time-based message
    const hour = new Date().getHours()
    if (hour >= 22 || hour < 5) {
      setTimeBasedMessage('🌙 Start tonight, get tomorrow\'s 6am deals')
    } else if (hour < 12) {
      setTimeBasedMessage('☀️ Start now, get this afternoon\'s deals')
    } else if (hour < 17) {
      setTimeBasedMessage('⚡ Start now, catch tonight\'s flash deals')
    } else {
      setTimeBasedMessage('🌆 Start this evening, wake up to deals')
    }

    // Random number between 31-47 for social proof
    setRandomViewers(Math.floor(Math.random() * 17) + 31)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      setEmailError('Please enter your email')
      return
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email')
      return
    }

    setEmailError('')
    setIsSubmitting(true)

    try {
      // Fire InitiateCheckout event (if fbq available)
      if (typeof window !== 'undefined' && (window as any).fbq) {
        const eventId = crypto.randomUUID()
        ;(window as any).fbq('track', 'InitiateCheckout', {
          currency: 'USD',
          value: 59,
          city: citySlug
        }, { eventID: eventId })
      }

      // Save email for Stripe success page
      localStorage.setItem('checkout_email', email)
      localStorage.setItem('checkout_city_slug', citySlug)
      localStorage.setItem('checkout_city_name', cityName)

      // Submit to API which will redirect to Stripe
      const response = await fetch('/api/ads-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          citySlug,
          cityName,
          plan: 'trial',
          source: 'meta_ads',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to start trial')
      }

      const data = await response.json()

      // Redirect to Stripe Checkout
      window.location.href = data.redirectUrl || data.checkoutUrl
    } catch (error) {
      console.error('Error starting trial:', error)
      setEmailError('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

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

            {/* Progress indicator */}
            <div className="precheckout-progress">
              <span className="precheckout-step-active">Step 1 of 2: Enter Email</span>
              <span className="precheckout-step-next">Step 2: Secure Payment</span>
            </div>

            {/* Urgency banner */}
            <div className="precheckout-urgency">
              <span className="precheckout-urgency-icon">⚡</span>
              <span>{randomViewers} people from {cityName} viewing this page now</span>
            </div>

            {/* Limited time offer */}
            <div className="precheckout-limited-offer">
              🎯 <strong>Limited time:</strong> Lock in $59/year price (regular $99)
            </div>

            {/* Combined benefits section - more concise */}
            <div className="precheckout-highlights">
              <div className="precheckout-highlight">
                <span className="precheckout-highlight-icon">✅</span>
                <span><strong>Free for 14 days</strong> - No payment today</span>
              </div>
              <div className="precheckout-highlight">
                <span className="precheckout-highlight-icon">🚫</span>
                <span>Cancel in 10 seconds before <strong>{trialEndDate}</strong></span>
              </div>
              <div className="precheckout-highlight">
                <span className="precheckout-highlight-icon">💰</span>
                <span>Then $59/year (saves you $420+ per flight)</span>
              </div>
              <div className="precheckout-highlight">
                <span className="precheckout-highlight-icon">💯</span>
                <span>100% refund if you don't save on first flight</span>
              </div>
            </div>

            {/* What's included with social proof */}
            <div className="precheckout-included">
              <div className="precheckout-included-title">Join 2,847+ NYC travelers who saved</div>
              <div className="precheckout-total-saved">
                $127,420 last month
              </div>
              <div className="precheckout-airports">
                📍 JFK • Newark • LaGuardia
              </div>
              <div className="precheckout-active-deals">
                🔥 5 deals expiring in next 48 hours
              </div>
            </div>

            {/* Time-based message */}
            <div className="precheckout-time-message">
              {timeBasedMessage}
            </div>

            {/* Enhanced social proof */}
            <div className="precheckout-proof">
              <div className="precheckout-stars">★★★★★</div>
              <p>"Saved $513 on Rome flight. Paid for itself 10x over!"</p>
              <cite>– Sarah M., Brooklyn (verified member)</cite>
            </div>

            {/* Mini FAQ */}
            <div className="precheckout-faq">
              <strong>What if I forget to cancel?</strong>
              <p>We'll email you 3 days before trial ends. Cancel with 1 click.</p>
            </div>
          </div>
        </div>

        {/* Sticky footer with email form and CTA */}
        <div className="precheckout-modal-footer">
          <form onSubmit={handleSubmit} className="precheckout-footer-form">
            <div className="precheckout-email-wrapper">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your best email for deal alerts"
                className="precheckout-email-input"
                required
                autoFocus
                disabled={isSubmitting}
              />
              <div className="precheckout-email-note">
                🔒 No spam, ever. Unsubscribe in 1 click.
              </div>
            </div>
            {emailError && (
              <div className="precheckout-error">{emailError}</div>
            )}
            <button
              type="submit"
              className="precheckout-continue"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Securing your trial...' : 'Start Trial - No Payment Today →'}
            </button>
          </form>
          <div className="precheckout-trust-badges">
            <div className="precheckout-security">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              256-bit SSL Encrypted
            </div>
            <div className="precheckout-stripe">
              Powered by <strong>Stripe</strong>
            </div>
            <div className="precheckout-guarantee">
              💯 Money-back guarantee
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}