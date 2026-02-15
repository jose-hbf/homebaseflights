'use client'

import { useEffect } from 'react'

/**
 * Client component for success page tracking
 *
 * Note: For FREE signups, the main conversion event is "Lead" which fires
 * on form submission (in FormHydration). We don't fire StartTrial here
 * because that's reserved for when a free user upgrades to paid.
 *
 * This component just handles cleanup and any non-Meta tracking.
 */
export function SuccessPageTracker() {
  useEffect(() => {
    const handleSuccessPage = async () => {
      try {
        // Track Plausible goal completion if analytics loaded
        const analytics = await import('@/lib/analytics')
        analytics.Analytics.freeSignupComplete()

        // Clean up localStorage from signup flow
        localStorage.removeItem('signup_email')
        localStorage.removeItem('signup_city_slug')
        localStorage.removeItem('signup_city_name')
      } catch (error) {
        console.error('Failed to track conversion:', error)
      }
    }

    // Defer tracking until idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => handleSuccessPage(), { timeout: 2000 })
    } else {
      setTimeout(handleSuccessPage, 500)
    }
  }, [])

  return null
}
