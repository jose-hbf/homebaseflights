'use client'

import { useState, useRef, useCallback } from 'react'

interface AdsEmailCaptureProps {
  buttonText?: string
  className?: string
  cityName?: string
  citySlug?: string
}

const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/4gM7sNgMyejzapagigaR201' // 14-day trial

// Lazy-loaded analytics modules - only imported on form submit
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

// Get UTM params without useEffect (read once on submit)
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

export function AdsEmailCapture({
  buttonText = 'Try Free for 14 Days',
  className = '',
  cityName,
  citySlug,
}: AdsEmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const utmParamsRef = useRef<Record<string, string> | null>(null)

  // Get UTM params lazily on first interaction
  const getUtms = useCallback(() => {
    if (utmParamsRef.current === null) {
      utmParamsRef.current = getUtmParams()
    }
    return utmParamsRef.current
  }, [])

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Please enter your email')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email')
      return
    }

    setIsLoading(true)

    // Load analytics modules in parallel (lazy load on first submit)
    const [analytics, metaPixel] = await Promise.all([
      loadAnalytics(),
      loadMetaPixel(),
    ])

    // Get Meta cookies for attribution
    const metaCookies = metaPixel.getMetaCookies()

    // Track InitiateCheckout IMMEDIATELY (Meta Pixel + CAPI)
    const isLondon = citySlug === 'london'
    metaPixel.trackInitiateCheckout({
      currency: isLondon ? 'GBP' : 'USD',
      value: isLondon ? 47.0 : 59.0,
      city: citySlug || '',
    })

    // Track checkout start (Plausible)
    analytics.Analytics.checkoutStart({
      city: cityName || citySlug,
      email_domain: analytics.getEmailDomain(email.trim()),
    })

    // Track signup event (Plausible)
    analytics.Analytics.signup({
      city: cityName || citySlug,
      source: analytics.getPageSource(),
    })

    // Get UTM params lazily
    const utmParams = getUtms()

    try {
      // Save subscriber to database (including Meta cookies for CAPI attribution)
      // Use keepalive to ensure request completes even if page navigates
      fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          citySlug,
          cityName,
          source: 'meta_ads',
          utmParams,
          metaFbc: metaCookies.fbc,
          metaFbp: metaCookies.fbp,
        }),
        keepalive: true,
      }).catch(() => {
        // Silently fail - don't block checkout
      })

      // Save email, city, and Meta cookies to localStorage for success page
      localStorage.setItem('checkout_email', email.trim())
      if (citySlug) {
        localStorage.setItem('checkout_city_slug', citySlug)
      }
      if (cityName) {
        localStorage.setItem('checkout_city_name', cityName)
      }
      if (metaCookies.fbc) {
        localStorage.setItem('checkout_meta_fbc', metaCookies.fbc)
      }
      if (metaCookies.fbp) {
        localStorage.setItem('checkout_meta_fbp', metaCookies.fbp)
      }

      // Build Stripe checkout URL with prefilled email and city
      const checkoutUrl = new URL(STRIPE_CHECKOUT_URL)
      checkoutUrl.searchParams.set('prefilled_email', email.trim())

      // Pass city as client_reference_id
      if (citySlug) {
        checkoutUrl.searchParams.set('client_reference_id', citySlug)
      }

      // Delay to ensure pixel beacon is sent before navigation
      setTimeout(() => {
        window.location.href = checkoutUrl.toString()
      }, 500)
    } catch {
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setError('')
          }}
          placeholder="Enter your email"
          className="flex-1 px-5 py-4 border-2 border-gray-200 rounded-full text-base
            focus:outline-none focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/20
            transition-all bg-white shadow-sm"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-4 bg-[#FF6B35] text-white font-semibold text-base rounded-full
            hover:bg-[#e55a2b] active:bg-[#d14f22] transition-all
            shadow-lg shadow-[#FF6B35]/30 hover:shadow-xl hover:shadow-[#FF6B35]/40
            disabled:opacity-50 disabled:cursor-not-allowed
            whitespace-nowrap"
        >
          {isLoading ? 'Loading...' : buttonText}
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
      )}
    </form>
  )
}
