'use client'

import { useEffect, useState } from 'react'

export default function CheckoutLoadingPage() {
  const [dots, setDots] = useState('')

  useEffect(() => {
    // Animate loading dots
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)

    // Get stored data
    const email = localStorage.getItem('checkout_email')
    const cityName = localStorage.getItem('checkout_city_name') || 'New York'
    const stripeUrl = sessionStorage.getItem('stripe_checkout_url')

    // Redirect to Stripe after 3.5 seconds (enough time to read)
    const redirectTimeout = setTimeout(() => {
      if (stripeUrl) {
        window.location.href = stripeUrl
      } else {
        // Fallback if no URL stored
        const citySlug = localStorage.getItem('checkout_city_slug') || 'new-york'
        window.location.href = `/ads/cheap-flights-from-${citySlug}`
      }
    }, 3500)

    return () => {
      clearInterval(interval)
      clearTimeout(redirectTimeout)
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '3rem 2rem',
        maxWidth: '440px',
        width: '100%',
        boxShadow: '0 20px 60px -10px rgba(0,0,0,0.15)',
        textAlign: 'center',
      }}>
        {/* Animated lock icon */}
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 1.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse 2s ease-in-out infinite',
        }}>
          <span style={{ fontSize: '2.5rem' }}>🔒</span>
        </div>

        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#1a202c',
          marginBottom: '0.75rem',
        }}>
          Securing your checkout with Stripe{dots}
        </h1>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          margin: '2rem 0',
        }}>
          {/* Status messages */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            justifyContent: 'center',
            color: '#059669',
            fontWeight: '500',
          }}>
            <span>✅</span>
            <span>Your email has been saved</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            justifyContent: 'center',
            color: '#6b7280',
          }}>
            <span style={{
              display: 'inline-block',
              animation: 'spin 1s linear infinite'
            }}>⏳</span>
            <span>Redirecting to secure payment...</span>
          </div>
        </div>

        {/* Trust badges */}
        <div style={{
          borderTop: '1px solid #e5e7eb',
          paddingTop: '1.5rem',
          marginTop: '2rem',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.5rem',
            marginBottom: '1rem',
            flexWrap: 'wrap',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: '#4b5563',
              fontSize: '0.875rem',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>256-bit SSL</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: '#4b5563',
              fontSize: '0.875rem',
            }}>
              <span>Powered by</span>
              <strong>Stripe</strong>
            </div>
          </div>

          <div style={{
            color: '#6b7280',
            fontSize: '0.75rem',
            marginTop: '0.75rem',
          }}>
            Free 7 days, then $5.99/month • Cancel anytime
          </div>
        </div>
      </div>

      {/* Extra trust message */}
      <div style={{
        marginTop: '2rem',
        textAlign: 'center',
        maxWidth: '400px',
      }}>
        <p style={{
          color: '#4b5563',
          fontSize: '0.875rem',
        }}>
          🔐 Your payment information is processed securely by Stripe.
          We never store credit card details.
        </p>
      </div>

      {/* Add CSS animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}