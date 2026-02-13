'use client'

import { useEffect } from 'react'

/**
 * Deferred form hydration - loads AFTER first paint
 * Enhances static forms with:
 * - Client-side validation
 * - Analytics tracking (Meta Pixel, Plausible)
 * - Instant redirect without page reload
 */

// Lazy-loaded analytics modules
let analyticsModule: typeof import('@/lib/analytics') | null = null
let metaPixelModule: typeof import('@/lib/meta-pixel-events') | null = null

async function loadAnalytics() {
  if (!analyticsModule) {
    analyticsModule = await import('@/lib/analytics')
  }
  return analyticsModule
}

async function loadMetaPixel() {
  if (!metaPixelModule) {
    metaPixelModule = await import('@/lib/meta-pixel-events')
  }
  return metaPixelModule
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
      const forms = document.querySelectorAll<HTMLFormElement>('form.ads-form')

      forms.forEach(form => {
        const citySlug = form.dataset.citySlug || ''
        const cityName = form.dataset.cityName || ''
        const stripeUrl = form.dataset.stripeUrl || ''
        const emailInput = form.querySelector<HTMLInputElement>('input[type="email"]')
        const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]')
        const errorEl = form.querySelector<HTMLParagraphElement>('.ads-error')

        if (!emailInput || !submitButton) return

        // Add focus/hover styles via JS (non-critical)
        emailInput.addEventListener('focus', () => {
          emailInput.style.borderColor = '#FF6B35'
          emailInput.style.outline = 'none'
          emailInput.style.boxShadow = '0 0 0 4px rgba(255, 107, 53, 0.2)'
        })
        emailInput.addEventListener('blur', () => {
          emailInput.style.borderColor = '#e5e7eb'
          emailInput.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        })

        submitButton.addEventListener('mouseenter', () => {
          submitButton.style.backgroundColor = '#e55a2b'
          submitButton.style.boxShadow = '0 10px 25px -5px rgba(255, 107, 53, 0.4)'
        })
        submitButton.addEventListener('mouseleave', () => {
          submitButton.style.backgroundColor = '#FF6B35'
          submitButton.style.boxShadow = '0 10px 15px -3px rgba(255, 107, 53, 0.3)'
        })

        // Override form submission with enhanced behavior
        form.addEventListener('submit', async e => {
          e.preventDefault()

          const email = emailInput.value.trim()

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
            // Load analytics in parallel
            const [analytics, metaPixel] = await Promise.all([
              loadAnalytics(),
              loadMetaPixel(),
            ])

            // Get Meta cookies for attribution
            const metaCookies = metaPixel.getMetaCookies()

            // Track InitiateCheckout
            const isLondon = citySlug === 'london'
            metaPixel.trackInitiateCheckout({
              currency: isLondon ? 'GBP' : 'USD',
              value: isLondon ? 47.0 : 59.0,
              city: citySlug,
            })

            // Track Plausible events
            analytics.Analytics.checkoutStart({
              city: cityName || citySlug,
              email_domain: analytics.getEmailDomain(email),
            })

            analytics.Analytics.signup({
              city: cityName || citySlug,
              source: analytics.getPageSource(),
            })

            // Save subscriber (fire and forget)
            fetch('/api/subscribers', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email,
                citySlug,
                cityName,
                source: 'meta_ads',
                utmParams: getUtmParams(),
                metaFbc: metaCookies.fbc,
                metaFbp: metaCookies.fbp,
              }),
              keepalive: true,
            }).catch(() => {})

            // Save to localStorage for success page
            localStorage.setItem('checkout_email', email)
            if (citySlug) localStorage.setItem('checkout_city_slug', citySlug)
            if (cityName) localStorage.setItem('checkout_city_name', cityName)
            if (metaCookies.fbc) localStorage.setItem('checkout_meta_fbc', metaCookies.fbc)
            if (metaCookies.fbp) localStorage.setItem('checkout_meta_fbp', metaCookies.fbp)

            // Build checkout URL
            const checkoutUrl = new URL(stripeUrl)
            checkoutUrl.searchParams.set('prefilled_email', email)

            // Delay slightly to ensure pixel fires
            setTimeout(() => {
              window.location.href = checkoutUrl.toString()
            }, 300)
          } catch {
            // Fallback: submit form normally
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
