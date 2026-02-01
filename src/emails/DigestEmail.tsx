import { getManageSubscriptionUrl } from '@/lib/unsubscribe'

interface DigestDeal {
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
  aiDescription: string
  tier: 'exceptional' | 'good' | 'notable'
  departureAirport: string
}

interface DigestEmailProps {
  deals: DigestDeal[]
  cityName: string
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

function renderDealCard(deal: DigestDeal): string {
  const tripDays = Math.ceil(
    (new Date(deal.returnDate).getTime() - new Date(deal.departureDate).getTime()) /
      (1000 * 60 * 60 * 24)
  )

  return `
    <div style="padding: 20px 0; border-bottom: 1px solid #e5e7eb;">
      <!-- Destination + Price -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
        <tr>
          <td style="padding: 0;">
            <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">
              ${deal.destination}, ${deal.country}
            </h2>
          </td>
          <td style="padding: 0; text-align: right; vertical-align: top;">
            <span style="font-size: 20px; font-weight: 700; color: #111827;">
              $${deal.price}
            </span>
          </td>
        </tr>
      </table>
      
      <!-- Route + Flight info -->
      <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280;">
        ${deal.departureAirport} → ${deal.destinationCode} · ${deal.stops === 0 ? 'Nonstop' : `${deal.stops} stop`} · ${deal.airline}
      </p>
      
      <!-- Description -->
      <p style="margin: 0 0 8px 0; font-size: 15px; line-height: 1.5; color: #374151;">
        ${deal.aiDescription}
      </p>

      <!-- Dates -->
      <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280;">
        ${formatDate(deal.departureDate)} – ${formatDate(deal.returnDate)} · ${tripDays} days
      </p>
      
      <!-- Link -->
      <a href="${deal.bookingLink}" style="font-size: 14px; color: #2563EB; font-weight: 500; text-decoration: none;">
        Check this deal →
      </a>
    </div>
  `
}

export function renderDigestEmail({
  deals,
  cityName,
  subscriberEmail,
}: DigestEmailProps): string {
  const dealCards = deals.map(deal => renderDealCard(deal)).join('')
  const lowestPrice = Math.min(...deals.map(d => d.price))

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${deals.length} deals from ${cityName}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff;">

  <!-- Header with Logo -->
  <div style="padding: 24px 24px 20px 24px; border-bottom: 1px solid #e5e7eb;">
    <img src="https://homebaseflights.com/logo-header.svg" alt="Homebase Flights" width="160" height="27" style="display: block; margin-bottom: 16px;" />
    <h1 style="margin: 0; font-size: 22px; font-weight: 600; color: #111827;">
      ${deals.length} deals from ${cityName}
    </h1>
    <p style="margin: 8px 0 0 0; font-size: 14px; color: #6b7280;">
      Starting at $${lowestPrice} roundtrip
    </p>
  </div>

  <!-- Deals -->
  <div style="padding: 0 24px;">
    ${dealCards}
  </div>

  <!-- Footer -->
  <div style="padding: 24px;">
    <p style="margin: 0 0 8px 0; font-size: 12px; color: #9ca3af;">
      Prices may change. Book soon for best availability.
    </p>
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
