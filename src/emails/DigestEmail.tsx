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
    weekday: 'short',
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

function getTierBadge(tier: string): { bg: string; text: string; label: string } {
  switch (tier) {
    case 'exceptional':
      return { bg: '#dc2626', text: '#ffffff', label: '🔥 EXCEPTIONAL' }
    case 'good':
      return { bg: '#16a34a', text: '#ffffff', label: '✨ Great Deal' }
    case 'notable':
      return { bg: '#2563eb', text: '#ffffff', label: 'Worth Checking' }
    default:
      return { bg: '#6b7280', text: '#ffffff', label: 'Deal' }
  }
}

function renderDealCard(deal: DigestDeal, index: number): string {
  const badge = getTierBadge(deal.tier)
  const tripDays = Math.ceil(
    (new Date(deal.returnDate).getTime() - new Date(deal.departureDate).getTime()) /
      (1000 * 60 * 60 * 24)
  )

  return `
    <div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; margin-bottom: 20px; background-color: #ffffff;">
      <!-- Deal Header -->
      <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 16px 20px; color: white;">
        <div style="margin-bottom: 8px;">
          <span style="display: inline-block; background-color: ${badge.bg}; color: ${badge.text}; padding: 4px 10px; border-radius: 16px; font-size: 11px; font-weight: bold; text-transform: uppercase;">
            ${badge.label}
          </span>
        </div>
        <h3 style="margin: 0; font-size: 20px; font-weight: bold;">
          ${deal.departureAirport} → ${deal.destination}
        </h3>
        <p style="margin: 4px 0 0 0; opacity: 0.9; font-size: 13px;">
          ${deal.country}
        </p>
      </div>

      <!-- Deal Body -->
      <div style="padding: 16px 20px;">
        <!-- AI Description -->
        <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.5; color: #374151; font-style: italic; border-left: 3px solid #f59e0b; padding-left: 12px;">
          "${deal.aiDescription}"
        </p>

        <!-- Price and Details Row -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <p style="margin: 0; font-size: 28px; font-weight: bold; color: #16a34a;">
              $${deal.price}
            </p>
            <p style="margin: 2px 0 0 0; font-size: 12px; color: #6b7280;">
              Round trip
            </p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; font-size: 13px; color: #374151; font-weight: 600;">
              ${deal.airline}
            </p>
            <p style="margin: 2px 0 0 0; font-size: 12px; color: #6b7280;">
              ${deal.stops === 0 ? '✈️ Nonstop' : `${deal.stops} stop${deal.stops > 1 ? 's' : ''}`} • ${formatDuration(deal.durationMinutes)}
            </p>
          </div>
        </div>

        <!-- Dates -->
        <div style="background-color: #f9fafb; padding: 10px 14px; border-radius: 8px; margin-bottom: 16px;">
          <p style="margin: 0; font-size: 13px; color: #374151;">
            📅 <strong>${formatDate(deal.departureDate)}</strong> → <strong>${formatDate(deal.returnDate)}</strong>
            <span style="color: #6b7280;"> (${tripDays} days)</span>
          </p>
        </div>

        <!-- Book Button -->
        <a href="${deal.bookingLink}"
           style="display: block; background-color: #2563eb; color: white; text-align: center; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
          View Deal →
        </a>
      </div>
    </div>
  `
}

export function renderDigestEmail({
  deals,
  cityName,
  subscriberEmail,
}: DigestEmailProps): string {
  const dealCards = deals.map((deal, index) => renderDealCard(deal, index)).join('')
  
  const lowestPrice = Math.min(...deals.map(d => d.price))
  const destinations = deals.map(d => d.destination).slice(0, 3)
  const destinationPreview = destinations.join(', ') + (deals.length > 3 ? '...' : '')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daily Deals from ${cityName}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f3f4f6;">

  <!-- Header -->
  <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #7c3aed 100%); padding: 28px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 22px; font-weight: normal;">
      ✈️ <strong>Homebase</strong><em>Flights</em>
    </h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 15px;">
      Your daily deals from ${cityName}
    </p>
  </div>

  <!-- Summary Bar -->
  <div style="background-color: #ffffff; padding: 16px 24px; border-bottom: 1px solid #e5e7eb;">
    <p style="margin: 0; font-size: 14px; color: #374151;">
      <strong>${deals.length} deal${deals.length > 1 ? 's' : ''}</strong> today — 
      ${destinationPreview} — 
      from <strong style="color: #16a34a;">$${lowestPrice}</strong>
    </p>
  </div>

  <!-- Main Content -->
  <div style="padding: 24px; background-color: #f3f4f6;">

    <!-- Intro -->
    <p style="font-size: 15px; line-height: 1.6; color: #374151; margin: 0 0 24px 0;">
      Good morning! Here are today's best flight deals from ${cityName}. 
      These prices won't last long — book soon if you're interested.
    </p>

    <!-- Deal Cards -->
    ${dealCards}

    <!-- Tips Section -->
    <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 16px; margin-top: 8px;">
      <p style="margin: 0; font-size: 13px; color: #0369a1;">
        <strong>💡 Tip:</strong> Prices shown are the best we found at time of curation. 
        Final prices may vary. We recommend booking directly with the airline when possible.
      </p>
    </div>
  </div>

  <!-- Footer -->
  <div style="padding: 24px; background-color: #1f2937; text-align: center;">
    <p style="margin: 0 0 4px 0; font-size: 14px; color: white; font-weight: 600;">
      ✈️ Homebase Flights
    </p>
    <p style="margin: 0 0 16px 0; font-size: 12px; color: #9ca3af;">
      Cheap flights from YOUR airport
    </p>
    <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280;">
      You're receiving this daily digest because you subscribed to deal alerts from ${cityName}.
    </p>
    <p style="margin: 0; font-size: 12px; color: #6b7280;">
      <a href="https://homebaseflights.com/unsubscribe?email=${encodeURIComponent(subscriberEmail)}"
         style="color: #60a5fa;">Unsubscribe</a>
      &nbsp;•&nbsp;
      <a href="https://homebaseflights.com/preferences?email=${encodeURIComponent(subscriberEmail)}"
         style="color: #60a5fa;">Manage preferences</a>
    </p>
  </div>
</body>
</html>
  `.trim()
}
