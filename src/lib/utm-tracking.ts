'use client'

const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
const UTM_STORAGE_KEY = 'hbf_utm_params'

export interface UTMParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
}

/**
 * Capture UTM parameters from the current URL and store them in sessionStorage
 * Call this on page load in ads landing pages
 */
export function captureUTMParams(): UTMParams {
  if (typeof window === 'undefined') {
    return {}
  }

  const searchParams = new URLSearchParams(window.location.search)
  const utmParams: UTMParams = {}

  UTM_PARAMS.forEach((param) => {
    const value = searchParams.get(param)
    if (value) {
      utmParams[param] = value
    }
  })

  // Only store if we have at least one UTM param
  if (Object.keys(utmParams).length > 0) {
    try {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmParams))
    } catch (error) {
      console.error('[UTM Tracking] Failed to store UTM params:', error)
    }
  }

  return utmParams
}

/**
 * Retrieve stored UTM parameters from sessionStorage
 */
export function getStoredUTMParams(): UTMParams {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as UTMParams
    }
  } catch (error) {
    console.error('[UTM Tracking] Failed to retrieve UTM params:', error)
  }

  return {}
}

/**
 * Clear stored UTM parameters (call after successful conversion)
 */
export function clearUTMParams(): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    sessionStorage.removeItem(UTM_STORAGE_KEY)
  } catch (error) {
    console.error('[UTM Tracking] Failed to clear UTM params:', error)
  }
}

/**
 * Format UTM params for Stripe metadata
 * Stripe metadata values must be strings and max 500 chars
 */
export function formatUTMForStripe(utmParams: UTMParams): Record<string, string> {
  const metadata: Record<string, string> = {}

  Object.entries(utmParams).forEach(([key, value]) => {
    if (value) {
      metadata[key] = String(value).slice(0, 500)
    }
  })

  return metadata
}
