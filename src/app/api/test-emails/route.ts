import { NextResponse } from 'next/server'
import { getResend, FROM_EMAIL } from '@/lib/resend'
import { renderWelcomeEmail } from '@/emails/WelcomeEmail'
import { renderInstantAlertEmail } from '@/emails/InstantAlertEmail'
import { renderDigestEmail } from '@/emails/DigestEmail'

// Sample data for testing
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
  bookingLink: 'https://www.google.com/travel/flights',
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
    bookingLink: 'https://www.google.com/travel/flights',
    aiDescription: 'Spring in Paris at an unbeatable price. Direct flights with excellent timing.',
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
    bookingLink: 'https://www.google.com/travel/flights',
    aiDescription: 'Great value to Barcelona with one quick stop. Perfect weather in May.',
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
    bookingLink: 'https://www.google.com/travel/flights',
    aiDescription: 'Solid nonstop option to London. Good for a quick getaway.',
    tier: 'notable' as const,
    departureAirport: 'JFK',
  },
]

export async function POST(request: Request) {
  try {
    const { email, type } = await request.json()

    if (!email || !type) {
      return NextResponse.json(
        { error: 'Missing email or type' },
        { status: 400 }
      )
    }

    const resend = getResend()
    let result

    switch (type) {
      case 'welcome':
        result = await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: 'Welcome to Homebase Flights',
          html: renderWelcomeEmail({ cityName: 'New York' }),
        })
        break

      case 'instant':
        result = await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: `JFK → Tokyo $487 — Exceptional Deal`,
          html: renderInstantAlertEmail({
            deal: sampleInstantDeal,
            aiDescription: 'Incredible nonstop fare to Tokyo on ANA. This is 60% below typical prices for this route. Perfect timing for cherry blossom season.',
            cityName: 'New York',
            departureAirport: 'JFK',
            subscriberEmail: email,
          }),
        })
        break

      case 'digest':
        result = await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: `3 deals from New York — Starting at $389`,
          html: renderDigestEmail({
            deals: sampleDigestDeals,
            cityName: 'New York',
            subscriberEmail: email,
          }),
        })
        break

      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        )
    }

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: result.data?.id })
  } catch (error) {
    console.error('Error sending test email:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
