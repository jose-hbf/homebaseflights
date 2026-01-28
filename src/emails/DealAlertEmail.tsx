import { FlightDeal } from '@/types/flights'
import { formatDuration, getDealQuality, getDealDiscount } from '@/utils/flightFilters'

interface DealAlertEmailProps {
  deals: FlightDeal[]
  airportCode: string
  airportName: string
  subscriberEmail: string
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function getQualityBadge(quality: string): { bg: string; text: string; label: string } {
  switch (quality) {
    case 'incredible':
      return { bg: '#dc2626', text: '#ffffff', label: '🔥 INCREDIBLE' }
    case 'great':
      return { bg: '#16a34a', text: '#ffffff', label: '⭐ GREAT DEAL' }
    case 'good':
      return { bg: '#2563eb', text: '#ffffff', label: 'Good Deal' }
    default:
      return { bg: '#6b7280', text: '#ffffff', label: 'Deal' }
  }
}

export function renderDealAlertEmail({
  deals,
  airportCode,
  airportName,
  subscriberEmail,
}: DealAlertEmailProps): string {
  const dealCards = deals.map((deal) => {
    const quality = getDealQuality(deal)
    const discount = getDealDiscount(deal)
    const badge = getQualityBadge(quality)
    const tripDays = Math.ceil(
      (new Date(deal.returnDate).getTime() - new Date(deal.departureDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )

    return `
      <div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; margin-bottom: 16px;">
        <!-- Deal Header -->
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 20px; color: white;">
          <div style="display: inline-block; background-color: ${badge.bg}; color: ${badge.text}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 12px;">
            ${badge.label}${discount > 0 ? ` • ${discount}% OFF` : ''}
          </div>
          <h2 style="margin: 0; font-size: 24px; font-weight: bold;">
            ${airportCode} → ${deal.destination}
          </h2>
          <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">
            ${deal.country}
          </p>
        </div>

        <!-- Deal Details -->
        <div style="padding: 20px; background-color: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div>
              <p style="margin: 0; font-size: 36px; font-weight: bold; color: #16a34a;">
                $${deal.price}
              </p>
              <p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">
                Round trip
              </p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; font-size: 14px; color: #374151;">
                <strong>${deal.airline}</strong>
              </p>
              <p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">
                ${deal.stops === 0 ? '✈️ Nonstop' : `${deal.stops} stop${deal.stops > 1 ? 's' : ''}`}
                • ${formatDuration(deal.durationMinutes)}
              </p>
            </div>
          </div>

          <!-- Dates -->
          <div style="background-color: #f9fafb; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px;">
            <p style="margin: 0; font-size: 14px; color: #374151;">
              📅 <strong>${formatDate(deal.departureDate)}</strong> → <strong>${formatDate(deal.returnDate)}</strong>
              <span style="color: #6b7280;"> (${tripDays} days)</span>
            </p>
          </div>

          <!-- Book Button -->
          <a href="${deal.bookingLink}"
             style="display: block; background-color: #2563eb; color: white; text-align: center; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
            Book This Deal →
          </a>
        </div>
      </div>
    `
  }).join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Flight Deals from ${airportName}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f3f4f6;">

  <!-- Header -->
  <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #7c3aed 100%); padding: 32px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: normal;">
      ✈️ <strong>Homebase</strong><em>Flights</em>
    </h1>
    <p style="color: rgba(255,255,255,0.9); margin: 12px 0 0 0; font-size: 16px;">
      ${deals.length} new deal${deals.length > 1 ? 's' : ''} from ${airportName}
    </p>
  </div>

  <!-- Main Content -->
  <div style="padding: 24px; background-color: #f3f4f6;">

    <!-- Intro -->
    <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 24px 0;">
      We found ${deals.length > 1 ? 'some great deals' : 'a great deal'} from <strong>${airportName} (${airportCode})</strong>.
      Book soon — these prices won't last long!
    </p>

    <!-- Deal Cards -->
    ${dealCards}

    <!-- Tips Section -->
    <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin-top: 24px;">
      <p style="margin: 0; font-size: 14px; color: #92400e;">
        <strong>💡 Pro tip:</strong> These are the best prices we found. Prices can change quickly,
        so book soon if you're interested. Always book directly with the airline when possible.
      </p>
    </div>
  </div>

  <!-- Footer -->
  <div style="padding: 24px; background-color: #1f2937; text-align: center;">
    <p style="margin: 0 0 8px 0; font-size: 14px; color: #9ca3af;">
      You're receiving this because you signed up for deal alerts from ${airportCode}.
    </p>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #9ca3af;">
      <a href="https://homebaseflights.com/unsubscribe?email=${encodeURIComponent(subscriberEmail)}"
         style="color: #60a5fa;">Unsubscribe</a>
      &nbsp;•&nbsp;
      <a href="https://homebaseflights.com/preferences?email=${encodeURIComponent(subscriberEmail)}"
         style="color: #60a5fa;">Manage Preferences</a>
    </p>
    <p style="margin: 0; font-size: 12px; color: #6b7280;">
      © ${new Date().getFullYear()} Homebase Flights
    </p>
  </div>
</body>
</html>
  `.trim()
}
