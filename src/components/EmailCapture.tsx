'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface EmailCaptureProps {
  buttonText?: string
  className?: string
  cityName?: string
  citySlug?: string
  airportCode?: string
  variant?: 'dark' | 'light'
}

const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/test_9B63cv4bX9Hk9aietHaEE00'

export function EmailCapture({
  buttonText = 'Start free trial',
  className = '',
  cityName,
  citySlug,
  airportCode,
  variant = 'dark',
}: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

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

    try {
      // Save subscriber to database
      await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          citySlug,
          cityName,
          airportCode,
        }),
      })

      // Save email and city to localStorage for success page
      localStorage.setItem('checkout_email', email.trim())
      if (citySlug) {
        localStorage.setItem('checkout_city_slug', citySlug)
      }
      if (cityName) {
        localStorage.setItem('checkout_city_name', cityName)
      }

      // Redirect to Stripe checkout with prefilled email
      const checkoutUrl = new URL(STRIPE_CHECKOUT_URL)
      checkoutUrl.searchParams.set('prefilled_email', email.trim())
      if (citySlug) {
        checkoutUrl.searchParams.set('client_reference_id', citySlug)
      }

      window.location.href = checkoutUrl.toString()
    } catch {
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  const inputStyles = variant === 'dark'
    ? 'border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 focus:border-white focus:bg-white/20 hover:border-white/50 hover:bg-white/15 hover:shadow-lg'
    : 'border-border bg-white text-text-primary placeholder:text-text-secondary shadow-lg shadow-primary/10 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:shadow-xl focus:shadow-primary/15 hover:border-primary/40 hover:shadow-xl'

  const errorStyles = variant === 'dark'
    ? 'text-red-200'
    : 'text-red-500'

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setError('')
          }}
          placeholder="Enter your email"
          className={`w-full pl-6 pr-40 py-4 border-2 rounded-full focus:outline-none transition-all ${inputStyles}`}
          disabled={isLoading}
        />
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="whitespace-nowrap"
          >
            {isLoading ? 'Loading...' : buttonText}
          </Button>
        </div>
      </div>
      {error && (
        <p className={`text-sm mt-2 text-center ${errorStyles}`}>{error}</p>
      )}
    </form>
  )
}
