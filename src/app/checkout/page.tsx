'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FadeIn } from '@/components/FadeIn'

// Simple email validation
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const cityName = searchParams.get('city') || ''
  const citySlug = searchParams.get('slug') || ''

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const validateEmail = (value: string): boolean => {
    if (!value) {
      setEmailError('Email is required')
      return false
    }
    if (!isValidEmail(value)) {
      setEmailError('Please enter a valid email address')
      return false
    }
    setEmailError('')
    return true
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (emailError) {
      validateEmail(value)
    }
  }

  const handleEmailBlur = () => {
    if (email) {
      validateEmail(email)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')

    if (!validateEmail(email)) return

    setIsLoading(true)

    try {
      // TODO: Replace with actual Stripe Checkout
      // 1. Create Stripe checkout session
      // 2. Redirect to Stripe
      // 3. On success webhook, create subscriber + send welcome email

      // For now: simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Create subscriber in database
      const subscriberRes = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, citySlug, cityName }),
      })

      if (!subscriberRes.ok) {
        const error = await subscriberRes.json()
        throw new Error(error.error || 'Failed to create subscription')
      }

      // Send welcome email
      await fetch('/api/send-welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, cityName }),
      })

      router.push(`/checkout/success?email=${encodeURIComponent(email)}&city=${encodeURIComponent(cityName)}`)
    } catch (error) {
      console.error('Checkout error:', error)
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <FadeIn>
        <div className="text-center mb-8">
          {citySlug && (
            <Link
              href={`/cheap-flights-from-${citySlug}`}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-4"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to {cityName || 'deals'}
            </Link>
          )}
          <h1 className="heading-display text-3xl md:text-4xl text-text-primary mb-3">
            Start your free trial
          </h1>
          <p className="text-text-secondary">
            {cityName
              ? `Get flight deals from ${cityName} delivered to your inbox.`
              : 'Get flight deals delivered to your inbox.'
            }
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Pricing info */}
          <div className="text-center mb-8 pb-8 border-b border-gray-100">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              7-day free trial
            </div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-serif font-semibold text-text-primary">$59</span>
              <span className="text-text-secondary">/year</span>
            </div>
            <p className="text-sm text-text-muted mt-2">
              After trial ends. Cancel anytime.
            </p>
          </div>

          {/* Benefits */}
          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-text-secondary">2-3 deals per week from {cityName || 'your airport'}</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-text-secondary">Save $500+ on average per trip</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-text-secondary">Mistake fares & flash sales</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-text-secondary">Full refund if you don't save</span>
            </li>
          </ul>

          {/* Email form */}
          <form onSubmit={handleSubmit}>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              placeholder="you@example.com"
              aria-invalid={!!emailError}
              aria-describedby={emailError ? 'email-error' : undefined}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-shadow ${
                emailError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {emailError && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                {emailError}
              </p>
            )}

            {submitError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}

            <div className="mt-4"></div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Redirecting to payment...
                </>
              ) : (
                'Start free trial'
              )}
            </button>
          </form>

          <p className="text-xs text-text-muted text-center mt-4">
            You won't be charged until your trial ends.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={200}>
        <p className="text-center text-sm text-text-muted mt-6">
          Questions? Email us at{' '}
          <a href="mailto:hello@homebaseflights.com" className="text-blue-600 hover:underline">
            hello@homebaseflights.com
          </a>
        </p>
      </FadeIn>
    </div>
  )
}

function CheckoutLoading() {
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto mb-3 animate-pulse"></div>
        <div className="h-5 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="h-40 bg-gray-100 rounded animate-pulse"></div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-16 min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <Suspense fallback={<CheckoutLoading />}>
            <CheckoutContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
