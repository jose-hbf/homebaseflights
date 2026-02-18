'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

// Stripe checkout URLs
const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/4gM7sNgMyejzapagigaR201'

function UpgradeRedirect() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const email = searchParams.get('email')
    const utmSource = searchParams.get('utm_source')
    const utmMedium = searchParams.get('utm_medium')
    const utmCampaign = searchParams.get('utm_campaign')
    const utmContent = searchParams.get('utm_content')
    const discount = searchParams.get('discount')

    // Build Stripe URL with all parameters
    const stripeUrl = new URL(STRIPE_CHECKOUT_URL)

    if (email) {
      stripeUrl.searchParams.set('prefilled_email', email)
    }
    if (utmSource) {
      stripeUrl.searchParams.set('utm_source', utmSource)
    }
    if (utmMedium) {
      stripeUrl.searchParams.set('utm_medium', utmMedium)
    }
    if (utmCampaign) {
      stripeUrl.searchParams.set('utm_campaign', utmCampaign)
    }
    if (utmContent) {
      stripeUrl.searchParams.set('utm_content', utmContent)
    }
    if (discount) {
      stripeUrl.searchParams.set('discount', discount)
    }

    // Redirect to Stripe
    window.location.href = stripeUrl.toString()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 mb-4">
          <svg className="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <p className="text-gray-600">Redirecting to checkout...</p>
      </div>
    </div>
  )
}

export default function UpgradePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4">
              <svg className="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <p className="text-gray-600">Redirecting to checkout...</p>
          </div>
        </div>
      }
    >
      <UpgradeRedirect />
    </Suspense>
  )
}
