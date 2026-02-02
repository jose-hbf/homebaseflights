'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface CtaSubscribeProps {
  cityName: string
  citySlug: string
  variant?: 'default' | 'prominent'
  title?: string
  subtitle?: string
}

// Stripe Payment Link (same as EmailCapture)
const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/6oU8wRcwi8Zf40MgigaR200'

export function CtaSubscribe({
  cityName,
  citySlug,
  variant = 'default',
  title,
  subtitle,
}: CtaSubscribeProps) {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Pass email and city to Stripe checkout
      const checkoutUrl = `${STRIPE_CHECKOUT_URL}?prefilled_email=${encodeURIComponent(email)}&client_reference_id=${citySlug}`
      window.location.href = checkoutUrl
    }
  }

  const defaultTitle = `Don't miss the next deal from ${cityName}`
  const defaultSubtitle = `These deals are expired. Get the next ones delivered to your inbox in real-time.`

  if (variant === 'prominent') {
    return (
      <div className="bg-primary text-text-inverse rounded-2xl p-8 md:p-10">
        <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-3">
          {title || defaultTitle}
        </h2>
        <p className="text-text-inverse/80 mb-6 max-w-lg">
          {subtitle || defaultSubtitle}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-4 py-3 rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-warm"
          />
          <Button type="submit" variant="secondary" className="whitespace-nowrap">
            Start free trial
          </Button>
        </form>

        <p className="text-text-inverse/60 text-sm mt-4">
          7-day free trial · Cancel anytime · No spam
        </p>
      </div>
    )
  }

  // Default variant - simpler card
  return (
    <div className="bg-accent-warm border border-accent-peach rounded-xl p-6">
      <h3 className="font-serif text-xl font-semibold text-text-primary mb-2">
        {title || `Tired of seeing expired deals?`}
      </h3>
      <p className="text-text-secondary text-sm mb-4">
        {subtitle || `Subscribe to get alerts from ${cityName} the moment we find them.`}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <Button type="submit" size="sm">
          Get alerts
        </Button>
      </form>

      <p className="text-text-muted text-xs mt-3">
        Free 7-day trial · Only real deals
      </p>
    </div>
  )
}
