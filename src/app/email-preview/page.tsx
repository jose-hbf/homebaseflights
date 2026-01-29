'use client'

import { useState } from 'react'
import { renderInstantAlertEmail } from '@/emails/InstantAlertEmail'
import { renderDigestEmail } from '@/emails/DigestEmail'
import { renderWelcomeEmail } from '@/emails/WelcomeEmail'

// Sample data for previews
const sampleInstantDeal = {
  destination: 'Tokyo',
  destinationCode: 'NRT',
  country: 'Japan',
  price: 487,
  departureDate: '2026-03-15',
  returnDate: '2026-03-25',
  airline: 'ANA',
  stops: 0,
  durationMinutes: 840,
  bookingLink: 'https://google.com/flights',
}

const sampleDigestDeals = [
  {
    destination: 'Paris',
    destinationCode: 'CDG',
    country: 'France',
    price: 389,
    departureDate: '2026-04-10',
    returnDate: '2026-04-18',
    airline: 'Air France',
    stops: 0,
    durationMinutes: 480,
    bookingLink: 'https://google.com/flights',
    aiDescription: 'Spring in Paris at an unbeatable price. Direct flights on Air France with excellent timing for cherry blossoms.',
    tier: 'exceptional' as const,
    departureAirport: 'JFK',
  },
  {
    destination: 'Barcelona',
    destinationCode: 'BCN',
    country: 'Spain',
    price: 445,
    departureDate: '2026-05-01',
    returnDate: '2026-05-10',
    airline: 'TAP Portugal',
    stops: 1,
    durationMinutes: 600,
    bookingLink: 'https://google.com/flights',
    aiDescription: 'Great value to Barcelona with just one quick stop. Perfect weather in May and prices well below average.',
    tier: 'good' as const,
    departureAirport: 'JFK',
  },
  {
    destination: 'London',
    destinationCode: 'LHR',
    country: 'United Kingdom',
    price: 512,
    departureDate: '2026-04-20',
    returnDate: '2026-04-28',
    airline: 'British Airways',
    stops: 0,
    durationMinutes: 420,
    bookingLink: 'https://google.com/flights',
    aiDescription: 'Solid nonstop option to London. Good for a quick getaway or business trip.',
    tier: 'notable' as const,
    departureAirport: 'JFK',
  },
]

type EmailType = 'instant' | 'digest' | 'welcome'

export default function EmailPreviewPage() {
  const [activeEmail, setActiveEmail] = useState<EmailType>('instant')

  const getEmailHtml = () => {
    switch (activeEmail) {
      case 'instant':
        return renderInstantAlertEmail({
          deal: sampleInstantDeal,
          aiDescription: 'Incredible nonstop fare to Tokyo on ANA. This is 60% below typical prices for this route. Perfect for cherry blossom season!',
          cityName: 'New York',
          departureAirport: 'JFK',
          subscriberEmail: 'test@example.com',
        })
      case 'digest':
        return renderDigestEmail({
          deals: sampleDigestDeals,
          cityName: 'New York',
          subscriberEmail: 'test@example.com',
        })
      case 'welcome':
        return renderWelcomeEmail({
          cityName: 'New York',
        })
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Email Preview</h1>
          
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveEmail('instant')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeEmail === 'instant'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔥 Instant Alert
            </button>
            <button
              onClick={() => setActiveEmail('digest')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeEmail === 'digest'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📬 Daily Digest
            </button>
            <button
              onClick={() => setActiveEmail('welcome')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeEmail === 'welcome'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              👋 Welcome
            </button>
          </div>
        </div>
      </div>

      {/* Email Description */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="bg-white rounded-lg p-4 mb-4 border">
          {activeEmail === 'instant' && (
            <div>
              <h2 className="font-semibold text-gray-900">Instant Alert Email</h2>
              <p className="text-sm text-gray-600 mt-1">
                Sent immediately when an <strong>exceptional</strong> deal is found (50%+ savings, premium destinations).
                These are rare and require quick action.
              </p>
            </div>
          )}
          {activeEmail === 'digest' && (
            <div>
              <h2 className="font-semibold text-gray-900">Daily Digest Email</h2>
              <p className="text-sm text-gray-600 mt-1">
                Sent daily at 8am ET with <strong>good</strong> and <strong>notable</strong> deals.
                Contains multiple curated deals with AI descriptions.
              </p>
            </div>
          )}
          {activeEmail === 'welcome' && (
            <div>
              <h2 className="font-semibold text-gray-900">Welcome Email</h2>
              <p className="text-sm text-gray-600 mt-1">
                Sent when a user starts their free trial. Sets expectations and provides tips.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Email Preview */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Email Header Bar */}
          <div className="bg-gray-800 text-white px-4 py-3 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-sm text-gray-300">
              {activeEmail === 'instant' && '🔥 Exceptional Deal: JFK → Tokyo'}
              {activeEmail === 'digest' && '✈️ Daily Deals from New York'}
              {activeEmail === 'welcome' && '👋 Welcome to Homebase Flights!'}
            </span>
          </div>
          
          {/* Email Content */}
          <iframe
            srcDoc={getEmailHtml()}
            className="w-full border-0"
            style={{ height: '800px' }}
            title="Email Preview"
          />
        </div>
      </div>
    </div>
  )
}
