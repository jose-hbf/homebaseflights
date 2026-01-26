'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FadeIn } from '@/components/FadeIn'
import { Button } from '@/components/ui/Button'

function SuccessContent() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [citySlug, setCitySlug] = useState('')
  const [cityName, setCityName] = useState('')

  useEffect(() => {
    // Try to get email from URL params first, then localStorage
    const urlEmail = searchParams.get('email') || searchParams.get('prefilled_email')
    const storedEmail = localStorage.getItem('checkout_email')
    const storedCitySlug = localStorage.getItem('checkout_city_slug')
    const storedCityName = localStorage.getItem('checkout_city_name')

    if (urlEmail) {
      setEmail(urlEmail)
    } else if (storedEmail) {
      setEmail(storedEmail)
      localStorage.removeItem('checkout_email')
    }

    if (storedCitySlug) {
      setCitySlug(storedCitySlug)
      localStorage.removeItem('checkout_city_slug')
    }

    if (storedCityName) {
      setCityName(storedCityName)
      localStorage.removeItem('checkout_city_name')
    }
  }, [searchParams])

  return (
    <div className="max-w-lg mx-auto text-center">
      <FadeIn>
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <h1 className="heading-display text-3xl md:text-4xl text-text-primary mb-4">
          Your trial is active
        </h1>
        <p className="text-lg text-text-secondary mb-8">
          You will start receiving deals in{' '}
          <span className="font-medium text-text-primary">{email || 'your inbox'}</span>
        </p>
      </FadeIn>

      <FadeIn delay={200}>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-amber-800">
              <span className="font-medium">Pro tip:</span> Add{' '}
              <span className="font-medium">deals@homebaseflights.com</span> to your contacts so our emails don't end up in spam.
            </p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={300}>
        <p className="text-text-secondary mb-8">
          Any questions? Send us an email at{' '}
          <a href="mailto:support@homebaseflights.com" className="text-blue-600 hover:underline font-medium">
            support@homebaseflights.com
          </a>
        </p>
      </FadeIn>

      <FadeIn delay={400}>
        <Link href={citySlug ? `/cheap-flights-from-${citySlug}` : '/'}>
          <Button size="md">
            {cityName ? `See more deals from ${cityName}` : 'Back to homepage'}
          </Button>
        </Link>
      </FadeIn>
    </div>
  )
}

function SuccessLoading() {
  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-8 animate-pulse"></div>
      <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
      <div className="h-5 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-16 min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <Suspense fallback={<SuccessLoading />}>
            <SuccessContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
