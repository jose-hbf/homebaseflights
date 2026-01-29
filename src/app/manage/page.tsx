'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ManageSubscriptionPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'error' | 'invalid'>('loading')

  useEffect(() => {
    const email = searchParams.get('email')
    const token = searchParams.get('t')

    if (!email || !token) {
      setStatus('invalid')
      return
    }

    // Get portal URL and redirect
    fetch('/api/portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token }),
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json()
          setStatus('redirecting')
          // Redirect to Stripe Customer Portal
          window.location.href = data.url
        } else {
          setStatus('error')
        }
      })
      .catch(() => {
        setStatus('error')
      })
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {(status === 'loading' || status === 'redirecting') && (
          <>
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900">
              {status === 'loading' ? 'Loading...' : 'Redirecting to Stripe...'}
            </h1>
            <p className="text-gray-500 mt-2">
              You'll be able to manage or cancel your subscription there.
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              We couldn't load your subscription portal. Please try again or contact us at{' '}
              <a href="mailto:support@homebaseflights.com" className="text-blue-600">
                support@homebaseflights.com
              </a>
            </p>
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Return to Homebase Flights
            </Link>
          </>
        )}

        {status === 'invalid' && (
          <>
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Invalid link</h1>
            <p className="text-gray-600 mb-6">
              This link appears to be invalid. If you need help managing your subscription, 
              please contact us at{' '}
              <a href="mailto:support@homebaseflights.com" className="text-blue-600">
                support@homebaseflights.com
              </a>
            </p>
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Return to Homebase Flights
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
