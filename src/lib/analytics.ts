/**
 * Plausible Analytics Helper
 * 
 * Track custom events with optional properties.
 * Events must be configured as Goals in Plausible dashboard.
 * 
 * Dashboard: https://plausible.io/homebaseflights.com
 */

// Extend Window interface for Plausible
declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean> }
    ) => void
  }
}

/**
 * Track a custom event in Plausible
 */
export function trackEvent(
  eventName: string,
  props?: Record<string, string | number | boolean>
) {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(eventName, { props })
  }
}

/**
 * Pre-defined events for type safety
 */
export const Analytics = {
  /**
   * Track when user submits email for signup
   */
  signup: (props: { city?: string; source: string }) => {
    trackEvent('Signup', props)
  },

  /**
   * Track when user is redirected to Stripe checkout
   */
  checkoutStart: (props: { city?: string; email_domain?: string }) => {
    trackEvent('Checkout_Start', props)
  },

  /**
   * Track when user selects an airport/city
   */
  airportSelected: (props: { city: string; airport?: string; source: string }) => {
    trackEvent('Airport_Selected', props)
  },

  /**
   * Track CTA button clicks
   */
  ctaClick: (props: { location: string; variant?: string }) => {
    trackEvent('CTA_Click', props)
  },

  /**
   * Track outbound link clicks (e.g., to booking sites)
   */
  outboundClick: (props: { url: string; destination?: string }) => {
    trackEvent('Outbound_Click', props)
  },

  /**
   * Track FAQ expansion (engagement)
   */
  faqExpand: (props: { question: string }) => {
    trackEvent('FAQ_Expand', props)
  },

  /**
   * Track free signup completion (success page reached)
   */
  freeSignupComplete: () => {
    trackEvent('Free_Signup_Complete')
  },
}

/**
 * Get email domain for analytics (privacy-friendly)
 * e.g., "user@gmail.com" -> "gmail.com"
 */
export function getEmailDomain(email: string): string {
  const parts = email.split('@')
  return parts[1] || 'unknown'
}

/**
 * Get source/page for attribution
 */
export function getPageSource(): string {
  if (typeof window === 'undefined') return 'unknown'
  
  const path = window.location.pathname
  
  if (path === '/') return 'homepage'
  if (path.startsWith('/cheap-flights-from-')) {
    return `city_${path.replace('/cheap-flights-from-', '')}`
  }
  if (path.startsWith('/blog')) return 'blog'
  if (path === '/about') return 'about'
  if (path === '/faq') return 'faq'
  
  return path.replace(/\//g, '_').slice(1) || 'homepage'
}
