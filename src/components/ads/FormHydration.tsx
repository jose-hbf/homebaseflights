'use client'

import { useEffect } from 'react'

/**
 * Deferred form hydration - loads AFTER first paint
 * Enhances static forms with:
 * - Client-side validation
 * - Analytics tracking (Meta Pixel Lead event, Plausible)
 * - Instant redirect to success page
 * - Pre-checkout modal for trial signups
 */

// Declare fbq on window
declare global {
  interface Window {
    fbq?: (
      action: string,
      eventName: string,
      data?: Record<string, unknown>,
      options?: { eventID: string }
    ) => void
  }
}

// Lazy-loaded analytics module (Plausible only - Meta Pixel called directly)
let analyticsModule: typeof import('@/lib/analytics') | null = null

async function loadAnalytics() {
  if (!analyticsModule) {
    analyticsModule = await import('@/lib/analytics')
  }
  return analyticsModule
}

/**
 * Fire Lead event directly via fbq (no lazy loading)
 * This ensures the event fires immediately when the user submits
 */
function fireLeadEvent(email: string, city: string): string {
  const eventId = crypto.randomUUID()

  console.log('[Meta Lead] Firing Lead event', { email, city, eventId })

  // Fire browser pixel event IMMEDIATELY
  if (typeof window !== 'undefined' && window.fbq) {
    console.log('[Meta Lead] fbq is available, calling fbq("track", "Lead")')
    window.fbq('track', 'Lead', { city }, { eventID: eventId })
  } else {
    console.warn('[Meta Lead] fbq is NOT available on window')
  }

  // Also send to CAPI via sendBeacon (doesn't block)
  const payload = JSON.stringify({
    eventName: 'Lead',
    eventId,
    eventSourceUrl: window.location.href,
    email,
    customData: { city },
  })

  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' })
    navigator.sendBeacon('/api/meta-events', blob)
    console.log('[Meta Lead] Sent to CAPI via sendBeacon')
  }

  return eventId
}

/**
 * Fire InitiateCheckout event for trial signups
 */
function fireInitiateCheckoutEvent(email: string, city: string): string {
  const eventId = crypto.randomUUID()
  const value = 59.0 // $59/year

  console.log('[Meta InitiateCheckout] Firing InitiateCheckout event', { email, city, value, eventId })

  // Fire browser pixel event
  if (typeof window !== 'undefined' && window.fbq) {
    console.log('[Meta InitiateCheckout] fbq is available, calling fbq("track", "InitiateCheckout")')
    window.fbq('track', 'InitiateCheckout', { currency: 'USD', value, city }, { eventID: eventId })
  } else {
    console.warn('[Meta InitiateCheckout] fbq is NOT available on window')
  }

  // Also send to CAPI via sendBeacon
  const payload = JSON.stringify({
    eventName: 'InitiateCheckout',
    eventId,
    eventSourceUrl: window.location.href,
    email,
    customData: { currency: 'USD', value, city },
  })

  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' })
    navigator.sendBeacon('/api/meta-events', blob)
    console.log('[Meta InitiateCheckout] Sent to CAPI via sendBeacon')
  }

  return eventId
}

function getUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const utms: Record<string, string> = {}
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
  utmKeys.forEach(key => {
    const value = params.get(key)
    if (value) utms[key] = value
  })
  return utms
}

export function FormHydration() {
  useEffect(() => {
    // Defer hydration until after first paint using requestIdleCallback
    const hydrateForm = () => {
      // Select both regular forms and modal forms
      const forms = document.querySelectorAll<HTMLFormElement>('form.ads-form, form.ads-modal-form')

      forms.forEach(form => {
        const citySlug = form.dataset.citySlug || ''
        const cityName = form.dataset.cityName || ''
        const emailInput = form.querySelector<HTMLInputElement>('input[type="email"]')
        const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]')
        const errorEl = form.querySelector<HTMLParagraphElement>('.ads-error')

        if (!emailInput || !submitButton) return

        // Add focus/hover styles via JS (non-critical)
        emailInput.addEventListener('focus', () => {
          emailInput.style.borderColor = '#2563eb'
          emailInput.style.outline = 'none'
          emailInput.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.2)'
        })
        emailInput.addEventListener('blur', () => {
          emailInput.style.borderColor = '#e5e7eb'
          emailInput.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        })

        submitButton.addEventListener('mouseenter', () => {
          submitButton.style.backgroundColor = '#1d4ed8'
          submitButton.style.boxShadow = '0 10px 25px -5px rgba(37, 99, 235, 0.4)'
        })
        submitButton.addEventListener('mouseleave', () => {
          submitButton.style.backgroundColor = '#2563eb'
          submitButton.style.boxShadow = '0 10px 15px -3px rgba(37, 99, 235, 0.3)'
        })

        // Override form submission with enhanced behavior
        form.addEventListener('submit', async e => {
          e.preventDefault()

          const email = emailInput.value.trim()
          const planInput = form.querySelector<HTMLInputElement>('input[name="plan"]')
          const plan = planInput?.value || form.dataset.plan || 'free'

          // Validation
          if (!email) {
            if (errorEl) {
              errorEl.textContent = 'Please enter your email'
              errorEl.classList.remove('hidden')
            }
            return
          }

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(email)) {
            if (errorEl) {
              errorEl.textContent = 'Please enter a valid email'
              errorEl.classList.remove('hidden')
            }
            return
          }

          // Show loading state
          const originalText = submitButton.textContent
          submitButton.textContent = 'Loading...'
          submitButton.disabled = true
          emailInput.disabled = true

          try {
            // Fire appropriate Meta Pixel event based on plan
            if (plan === 'trial') {
              // For trial, fire InitiateCheckout event
              fireInitiateCheckoutEvent(email, citySlug)

              // Load Plausible for tracking
              loadAnalytics().then(analytics => {
                analytics.Analytics.checkoutStart({
                  city: cityName || citySlug,
                  email_domain: analytics.getEmailDomain(email),
                })
              }).catch(() => {})

              // Save email for Stripe success page
              localStorage.setItem('checkout_email', email)
              if (citySlug) localStorage.setItem('checkout_city_slug', citySlug)
              if (cityName) localStorage.setItem('checkout_city_name', cityName)

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
                  utmParams: getUtmParams(),
                }),
              })

              if (!response.ok) {
                throw new Error('Failed to start trial')
              }

              const data = await response.json()

              // Store Stripe URL for loading page
              sessionStorage.setItem('stripe_checkout_url', data.redirectUrl || data.checkoutUrl)

              // Redirect to loading page first
              setTimeout(() => {
                window.location.href = '/checkout/loading'
              }, 200)

            } else {
              // For free plan, fire Lead event
              fireLeadEvent(email, citySlug)

              // Load Plausible analytics
              loadAnalytics().then(analytics => {
                analytics.Analytics.signup({
                  city: cityName || citySlug,
                  source: analytics.getPageSource(),
                })
              }).catch(() => {})

              // Save to localStorage
              localStorage.setItem('subscribed', 'true')
              localStorage.setItem('signup_email', email)
              if (citySlug) localStorage.setItem('signup_city_slug', citySlug)
              if (cityName) localStorage.setItem('signup_city_name', cityName)

              // Submit to API
              const response = await fetch('/api/ads-signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email,
                  citySlug,
                  cityName,
                  plan: 'free',
                  source: 'meta_ads',
                  utmParams: getUtmParams(),
                }),
              })

              if (!response.ok) {
                throw new Error('Failed to sign up')
              }

              const data = await response.json()

              // Redirect to success page
              setTimeout(() => {
                window.location.href = data.redirectUrl || `/signup/success?city=${citySlug}`
              }, 200)
            }
          } catch {
            // Fallback: submit form normally (will still work via no-JS path)
            submitButton.textContent = originalText
            submitButton.disabled = false
            emailInput.disabled = false
            form.submit()
          }
        })
      })
    }

    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(hydrateForm, { timeout: 3000 })
    } else {
      setTimeout(hydrateForm, 100)
    }
  }, [])

  return null
}
