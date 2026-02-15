import * as React from 'react'

interface FreeWelcomeEmailProps {
  cityName?: string
}

const sampleDeals = [
  {
    destination: 'Paris',
    country: 'France',
    price: 273,
    originalPrice: 850,
    discount: 68,
    dates: 'Feb - Apr 2026',
    airline: 'Multiple Airlines',
    stops: 'Nonstop',
  },
  {
    destination: 'Dublin',
    country: 'Ireland',
    price: 207,
    originalPrice: 620,
    discount: 67,
    dates: 'Mar - Jun 2026',
    airline: 'Aer Lingus',
    stops: 'Nonstop',
  },
]

export function FreeWelcomeEmail({ cityName }: FreeWelcomeEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ padding: '24px 24px 20px 24px', borderBottom: '1px solid #e5e7eb' }}>
        <img src="https://homebaseflights.com/logo-header.svg" alt="Homebase Flights" width="160" height="27" style={{ display: 'block' }} />
      </div>

      <div style={{ padding: '24px' }}>
        <h1 style={{ margin: '0 0 16px 0', fontSize: '24px', fontWeight: 600, color: '#111827' }}>
          You&apos;re in! Here&apos;s what&apos;s flying from {cityName || 'your city'}
        </h1>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', margin: '0 0 24px 0' }}>
          As a free member, you&apos;ll get our 2 best deals each week. Here&apos;s a taste of what we find:
        </p>

        {/* Sample Deals */}
        {sampleDeals.map((deal) => (
          <div key={deal.destination} style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 600, color: '#111827' }}>
                  NYC → {deal.destination}
                </p>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>
                  {deal.country} · {deal.dates}
                </p>
                <p style={{ margin: 0, fontSize: '14px', color: '#4b5563' }}>
                  {deal.airline} · {deal.stops}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: 700, color: '#111827' }}>
                  ${deal.price}
                </p>
                <p style={{ margin: 0, fontSize: '14px', color: '#9ca3af', textDecoration: 'line-through' }}>
                  ${deal.originalPrice}
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', fontWeight: 600, color: '#15803d' }}>
                  Save ${deal.originalPrice - deal.price}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Upgrade CTA */}
        <div style={{ padding: '20px', backgroundColor: '#FFF8F5', borderRadius: '8px', margin: '24px 0', textAlign: 'center' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600, color: '#111827' }}>
            Want every deal the moment it drops?
          </p>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#4b5563' }}>
            Pro members get every deal, not just the top 2. Plus instant alerts.
          </p>
          <a
            href="https://homebaseflights.com/pricing"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#FF6B35',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              borderRadius: '9999px',
            }}
          >
            Upgrade to Pro → $59/year
          </a>
        </div>

        <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '24px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
            <strong style={{ color: '#374151' }}>Tip:</strong> Add deals@homebaseflights.com to your contacts
            so emails don&apos;t end up in spam.
          </p>
        </div>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151', margin: 0 }}>
          Happy travels,<br />
          Homebase Flights
        </p>
      </div>

      <div style={{ padding: '24px', borderTop: '1px solid #e5e7eb' }}>
        <p style={{ margin: 0, fontSize: '12px' }}>
          <a href="https://homebaseflights.com" style={{ color: '#2563EB' }}>homebaseflights.com</a>
        </p>
      </div>
    </div>
  )
}

export function renderFreeWelcomeEmail(props: FreeWelcomeEmailProps): string {
  const { cityName } = props

  const dealsHtml = sampleDeals.map((deal) => `
    <div style="padding: 16px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 12px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
        <tr>
          <td style="vertical-align: top;">
            <p style="margin: 0 0 4px 0; font-size: 18px; font-weight: 600; color: #111827;">
              NYC → ${deal.destination}
            </p>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">
              ${deal.country} · ${deal.dates}
            </p>
            <p style="margin: 0; font-size: 14px; color: #4b5563;">
              ${deal.airline} · ${deal.stops}
            </p>
          </td>
          <td style="text-align: right; vertical-align: top;">
            <p style="margin: 0 0 4px 0; font-size: 24px; font-weight: 700; color: #111827;">
              $${deal.price}
            </p>
            <p style="margin: 0; font-size: 14px; color: #9ca3af; text-decoration: line-through;">
              $${deal.originalPrice}
            </p>
            <p style="margin: 4px 0 0 0; font-size: 12px; font-weight: 600; color: #15803d;">
              Save $${deal.originalPrice - deal.price}
            </p>
          </td>
        </tr>
      </table>
    </div>
  `).join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff;">

  <!-- Header with Logo -->
  <div style="padding: 24px 24px 20px 24px; border-bottom: 1px solid #e5e7eb;">
    <img src="https://homebaseflights.com/logo-header.svg" alt="Homebase Flights" width="160" height="27" style="display: block;" />
  </div>

  <!-- Content -->
  <div style="padding: 24px;">
    <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #111827;">
      You're in! Here's what's flying from ${cityName || 'your city'}
    </h1>

    <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 24px 0;">
      As a free member, you'll get our 2 best deals each week. Here's a taste of what we find:
    </p>

    <!-- Sample Deals -->
    ${dealsHtml}

    <!-- Upgrade CTA -->
    <div style="padding: 20px; background-color: #FFF8F5; border-radius: 8px; margin: 24px 0; text-align: center;">
      <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #111827;">
        Want every deal the moment it drops?
      </p>
      <p style="margin: 0 0 16px 0; font-size: 14px; color: #4b5563;">
        Pro members get every deal, not just the top 2. Plus instant alerts.
      </p>
      <a href="https://homebaseflights.com/pricing" style="display: inline-block; padding: 12px 24px; background-color: #FF6B35; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 9999px;">
        Upgrade to Pro → $59/year
      </a>
    </div>

    <div style="padding: 16px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 14px; color: #6b7280;">
        <strong style="color: #374151;">Tip:</strong> Add deals@homebaseflights.com to your contacts
        so emails don't end up in spam.
      </p>
    </div>

    <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0;">
      Happy travels,<br>
      Homebase Flights
    </p>
  </div>

  <!-- Footer -->
  <div style="padding: 24px; border-top: 1px solid #e5e7eb;">
    <p style="margin: 0; font-size: 12px;">
      <a href="https://homebaseflights.com" style="color: #2563EB;">homebaseflights.com</a>
    </p>
  </div>
</body>
</html>
  `.trim()
}
