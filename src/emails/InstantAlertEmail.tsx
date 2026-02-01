import { getManageSubscriptionUrl } from '@/lib/unsubscribe'

interface InstantAlertEmailProps {
  deal: {
    destination: string
    destinationCode: string
    country: string
    price: number
    departureDate: string
    returnDate: string
    airline: string
    stops: number
    durationMinutes: number
    bookingLink: string
    savingsPercent?: number
  }
  aiDescription: string
  cityName: string
  departureAirport: string
  subscriberEmail: string
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export function renderInstantAlertEmail({
  deal,
  aiDescription,
  cityName,
  departureAirport,
  subscriberEmail,
}: InstantAlertEmailProps): string {
  const tripDays = Math.ceil(
    (new Date(deal.returnDate).getTime() - new Date(deal.departureDate).getTime()) /
      (1000 * 60 * 60 * 24)
  )

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${deal.destination} $${deal.price} roundtrip</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff;">

  <!-- Header with Logo -->
  <div style="padding: 24px 24px 20px 24px; border-bottom: 1px solid #e5e7eb;">
    <img src="https://homebaseflights.com/logo-header.svg" alt="Homebase Flights" width="160" height="27" style="display: block;" />
  </div>

  <!-- Deal Card -->
  <div style="padding: 24px;">
    
    <!-- Destination -->
    <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 600; color: #111827;">
      ${deal.destination}, ${deal.country}
    </h1>
    
    <!-- Price + Savings -->
    <p style="margin: 0 0 16px 0; font-size: 32px; font-weight: 700; color: #111827;">
      $${deal.price} <span style="font-size: 16px; font-weight: 400; color: #6b7280;">roundtrip</span>
      ${deal.savingsPercent && deal.savingsPercent > 0 ? `<span style="display: inline-block; background-color: #dcfce7; color: #166534; font-size: 14px; font-weight: 600; padding: 4px 10px; border-radius: 4px; margin-left: 12px; vertical-align: middle;">${deal.savingsPercent}% off</span>` : ''}
    </p>
    
    <!-- AI Description -->
    <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      ${aiDescription}
    </p>

    <!-- Flight details -->
    <div style="padding: 16px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 13px; color: #6b7280;">
        ${departureAirport} → ${deal.destinationCode} · ${deal.stops === 0 ? 'Nonstop' : `${deal.stops} stop${deal.stops > 1 ? 's' : ''}`} · ${deal.airline}<br>
        ${formatDate(deal.departureDate)} – ${formatDate(deal.returnDate)} · ${tripDays} days · ${formatDuration(deal.durationMinutes)} flight
      </p>
    </div>

    <!-- CTA Button -->
    <a href="${deal.bookingLink}"
       style="display: block; background-color: #2563EB; color: white; text-align: center; padding: 16px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 16px;">
      Check this deal
    </a>

    <!-- Note -->
    <p style="margin: 16px 0 0 0; font-size: 12px; color: #9ca3af; text-align: center;">
      Prices may change. Book soon for best availability.
    </p>
  </div>

  <!-- Footer -->
  <div style="padding: 24px; border-top: 1px solid #e5e7eb;">
    <p style="margin: 0 0 8px 0; font-size: 12px; color: #9ca3af;">
      You're receiving this because you subscribed to deals from ${cityName}.
    </p>
    <p style="margin: 0; font-size: 12px;">
      <a href="${getManageSubscriptionUrl(subscriberEmail)}"
         style="color: #2563EB;">Manage subscription</a>
    </p>
  </div>
</body>
</html>
  `.trim()
}
