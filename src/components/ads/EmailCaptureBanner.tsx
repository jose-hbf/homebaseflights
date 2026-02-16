'use client'

import { useEffect, useState, useCallback } from 'react'

interface EmailCaptureBannerProps {
  citySlug: string
  cityName: string
}

/**
 * Slide-in email capture banner
 * Appears after:
 * - User clicks 2+ deal cards, OR
 * - User scrolls past the deals section
 *
 * Uses requestIdleCallback for deferred initialization (performance)
 */
export function EmailCaptureBanner({ citySlug, cityName }: EmailCaptureBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const showBanner = useCallback(() => {
    if (!isDismissed && !isSuccess) {
      setIsVisible(true)
    }
  }, [isDismissed, isSuccess])

  useEffect(() => {
    // Check if already dismissed in this session
    if (sessionStorage.getItem('banner_dismissed') === 'true') {
      setIsDismissed(true)
      return
    }

    // Check if already subscribed
    if (localStorage.getItem('subscribed') === 'true') {
      setIsDismissed(true)
      return
    }

    let dealClickCount = 0

    const initBanner = () => {
      // Track deal card clicks
      const dealCards = document.querySelectorAll('.ads-deal-card-expandable')
      dealCards.forEach((card) => {
        card.addEventListener('click', () => {
          dealClickCount++
          if (dealClickCount >= 2) {
            showBanner()
          }
        })
      })

      // Track scroll past deals section
      const dealsSection = document.querySelector('[data-deals-section]')
      if (dealsSection) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              // Show banner when deals section is scrolled out of view (user scrolled past it)
              if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
                showBanner()
                observer.disconnect()
              }
            })
          },
          { threshold: 0, rootMargin: '-100px 0px 0px 0px' }
        )
        observer.observe(dealsSection)
      }
    }

    // Defer initialization until browser is idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(initBanner, { timeout: 5000 })
    } else {
      setTimeout(initBanner, 1000)
    }
  }, [showBanner])

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
    sessionStorage.setItem('banner_dismissed', 'true')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setError('Please enter your email')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email')
      return
    }

    setIsSubmitting(true)

    try {
      // Load meta pixel for tracking
      const metaPixel = await import('@/lib/meta-pixel-events')
      metaPixel.trackLead({ email: trimmedEmail, city: citySlug })

      // Submit to API
      const response = await fetch('/api/ads-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          citySlug,
          cityName,
          plan: 'free',
          source: 'banner',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to sign up')
      }

      // Mark as subscribed
      localStorage.setItem('subscribed', 'true')
      setIsSuccess(true)

      // Redirect after a moment
      setTimeout(() => {
        window.location.href = `/signup/success?city=${citySlug}`
      }, 1500)
    } catch {
      setError('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (isDismissed || !isVisible) {
    return null
  }

  return (
    <div className="ads-email-banner">
      <button
        className="ads-email-banner-close"
        onClick={handleDismiss}
        aria-label="Dismiss"
      >
        ×
      </button>

      {isSuccess ? (
        <div className="ads-email-banner-success">
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>✓</span>
          You&apos;re in! Check your inbox.
        </div>
      ) : (
        <>
          <p className="ads-email-banner-headline">
            These deals expire soon. Get the next ones free.
          </p>

          <form onSubmit={handleSubmit} className="ads-email-banner-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="ads-email-banner-input"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className="ads-email-banner-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : "Get this week's deals free"}
            </button>
          </form>

          {error && <p className="ads-email-banner-error">{error}</p>}

          <p className="ads-email-banner-note">
            Free weekly alerts from JFK, Newark &amp; LaGuardia. Unsubscribe anytime.
          </p>
        </>
      )}
    </div>
  )
}
