'use client'

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

interface TrackEventParams {
  currency?: string
  value?: number
  city?: string
}

interface TrackStartTrialParams extends TrackEventParams {
  email?: string
}

function sendToCapiEndpoint(
  eventName: string,
  eventId: string,
  customData?: Record<string, unknown>,
  email?: string
): void {
  const payload = JSON.stringify({
    eventName,
    eventId,
    eventSourceUrl: window.location.href,
    email,
    customData,
  })

  // Use sendBeacon for reliability during page navigation
  // Falls back to fetch if sendBeacon is not available
  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' })
    navigator.sendBeacon('/api/meta-events', blob)
  } else {
    fetch('/api/meta-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true, // Allows request to outlive the page
    }).catch((error) => {
      console.error('[Meta Pixel Events] Failed to send to CAPI:', error)
    })
  }
}

/**
 * Track InitiateCheckout event
 * Called when user clicks "Try Free for 14 Days" button
 */
export function trackInitiateCheckout({
  currency = 'USD',
  value = 59.0,
  city = '',
}: TrackEventParams = {}): void {
  const eventId = crypto.randomUUID()

  const customData: Record<string, unknown> = {
    currency,
    value,
  }

  if (city) {
    customData.city = city
  }

  // Fire browser pixel event
  if (typeof window !== 'undefined' && window.fbq) {
    console.log('[Meta Pixel] Firing InitiateCheckout', { customData, eventId })
    window.fbq('track', 'InitiateCheckout', customData, { eventID: eventId })
  } else {
    console.warn('[Meta Pixel] fbq not available, will retry')
    // Retry after a short delay in case fbq is still loading
    setTimeout(() => {
      if (window.fbq) {
        console.log('[Meta Pixel] Firing InitiateCheckout (delayed)', { customData, eventId })
        window.fbq('track', 'InitiateCheckout', customData, { eventID: eventId })
      } else {
        console.error('[Meta Pixel] fbq still not available after retry')
      }
    }, 100)
  }

  // Send to CAPI endpoint for server-side tracking
  sendToCapiEndpoint('InitiateCheckout', eventId, customData)
}

/**
 * Track StartTrial event
 * Called when user successfully completes trial registration
 */
export function trackStartTrial({
  email = '',
  currency = 'USD',
  value = 0,
  city = '',
}: TrackStartTrialParams = {}): void {
  const eventId = crypto.randomUUID()

  const customData: Record<string, unknown> = {
    currency,
    value,
  }

  if (city) {
    customData.city = city
  }

  // Fire browser pixel event
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'StartTrial', customData, { eventID: eventId })
  }

  // Send to CAPI endpoint for server-side tracking (includes email for better matching)
  sendToCapiEndpoint('StartTrial', eventId, customData, email)
}

/**
 * Track Lead event
 * Called when user signs up for the newsletter/free tier
 */
export function trackLead({
  email = '',
  city = '',
}: { email?: string; city?: string } = {}): void {
  const eventId = crypto.randomUUID()

  const customData: Record<string, unknown> = {}

  if (city) {
    customData.city = city
  }

  // Fire browser pixel event
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', customData, { eventID: eventId })
  }

  // Send to CAPI endpoint
  sendToCapiEndpoint('Lead', eventId, customData, email)
}

/**
 * Get Meta cookies (_fbc and _fbp) for storing with user registration
 */
export function getMetaCookies(): { fbc: string | null; fbp: string | null } {
  if (typeof document === 'undefined') {
    return { fbc: null, fbp: null }
  }

  const cookies = document.cookie.split(';').reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    },
    {} as Record<string, string>
  )

  return {
    fbc: cookies['_fbc'] || null,
    fbp: cookies['_fbp'] || null,
  }
}
