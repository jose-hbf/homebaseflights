import React from 'react'

interface Deal {
  id: string
  destination: string
  destination_code: string
  country: string
  price: number
  departure_date: string
  return_date: string
  airline: string
  tier?: string
  ai_description?: string
  region?: string
  bookingLink: string
}

interface TrialDailyEmailProps {
  subscriberEmail: string
  cityName: string
  trialDay: number
  trialEndsAt: string
  deals: Deal[]
  groupedDeals?: Record<string, Deal[]>
  prioritizedRegions?: string[]
}

export function renderTrialDailyEmail({
  subscriberEmail,
  cityName,
  trialDay,
  trialEndsAt,
  deals,
}: TrialDailyEmailProps): string {
  const trialEndDate = new Date(trialEndsAt)
  const daysLeft = Math.max(0, 7 - trialDay)

  // Format date nicely
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Calculate savings
  const calculateSavings = (price: number) => {
    const typicalPrice = price * 1.6 // Assume we find 40% cheaper on average
    return Math.round(typicalPrice - price)
  }

  // Get header message based on trial day
  const getHeaderMessage = () => {
    switch (trialDay) {
      case 1:
        return '🎉 Welcome to your trial! Here are your first exclusive deals'
      case 2:
        return '✈️ Day 2: Fresh international deals just landed'
      case 3:
        return '🌍 Day 3: Exploring more destinations for you'
      case 4:
        return '🎯 Day 4: Mid-week deals perfect for planning'
      case 5:
        return '🔥 Day 5: Weekend flash deals available now'
      case 6:
        return '⚡ Day 6: Only 1 day left in your trial!'
      case 7:
        return '⏰ Last day: Don\'t miss these incredible deals'
      default:
        return '✈️ Your daily international flight deals'
    }
  }

  // Get CTA text based on trial day
  const getCtaText = () => {
    if (trialDay >= 6) {
      return 'Lock in membership before trial ends'
    }
    return 'View Deal'
  }

  // Group deals by tier for better presentation
  const exceptionalDeals = deals.filter(d => d.tier === 'exceptional')
  const goodDeals = deals.filter(d => d.tier === 'good')
  const otherDeals = deals.filter(d => !d.tier || d.tier === 'notable')

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Daily Flight Deals - Day ${trialDay}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">
            Homebase Flights
          </h1>
          <p style="color: #ffffff; margin: 0; font-size: 14px; opacity: 0.9;">
            Trial Day ${trialDay} of 7 • ${daysLeft > 0 ? `${daysLeft} days left` : 'Last day!'}
          </p>
        </div>

        <!-- Welcome Message -->
        <div style="padding: 25px 20px; border-bottom: 1px solid #e5e7eb;">
          <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 20px; font-weight: 600;">
            ${getHeaderMessage()}
          </h2>
          <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.6;">
            We've found ${deals.length} amazing international deals from ${cityName} today.
            ${exceptionalDeals.length > 0 ? `Including ${exceptionalDeals.length} exceptional ${exceptionalDeals.length === 1 ? 'deal' : 'deals'}!` : ''}
          </p>
        </div>

        <!-- Deals Section -->
        <div style="padding: 20px;">

          ${exceptionalDeals.length > 0 ? `
            <!-- Exceptional Deals -->
            <div style="margin-bottom: 25px;">
              <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 16px; font-weight: 600; display: flex; align-items: center;">
                🔥 Exceptional Deals
              </h3>
              ${exceptionalDeals.map(deal => `
                <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 15px; margin-bottom: 15px;">
                  <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                    <div>
                      <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 18px; font-weight: 600;">
                        ${deal.destination}
                      </h4>
                      <p style="color: #6b7280; margin: 0; font-size: 13px;">
                        ${deal.country} • ${formatDate(deal.departure_date)} - ${formatDate(deal.return_date)}
                      </p>
                    </div>
                    <div style="text-align: right;">
                      <div style="color: #dc2626; font-size: 24px; font-weight: 700;">
                        $${deal.price}
                      </div>
                      <div style="color: #059669; font-size: 12px; font-weight: 600;">
                        Save ~$${calculateSavings(deal.price)}
                      </div>
                    </div>
                  </div>
                  ${deal.ai_description ? `
                    <p style="color: #4b5563; margin: 10px 0; font-size: 13px; line-height: 1.5; font-style: italic;">
                      ${deal.ai_description}
                    </p>
                  ` : ''}
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
                    <span style="color: #6b7280; font-size: 12px;">
                      ${deal.airline} • ${deal.destination_code}
                    </span>
                    <a href="${deal.bookingLink}" style="background-color: #dc2626; color: #ffffff; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 600; display: inline-block;">
                      Book Now →
                    </a>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${goodDeals.length > 0 ? `
            <!-- Good Deals -->
            <div style="margin-bottom: 25px;">
              <h3 style="color: #059669; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
                ✨ Great Value Deals
              </h3>
              ${goodDeals.map(deal => `
                <div style="background-color: #f3f4f6; border-radius: 10px; padding: 15px; margin-bottom: 12px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="flex: 1;">
                      <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px; font-weight: 600;">
                        ${deal.destination}, ${deal.country}
                      </h4>
                      <p style="color: #6b7280; margin: 0; font-size: 12px;">
                        ${formatDate(deal.departure_date)} - ${formatDate(deal.return_date)} • ${deal.airline}
                      </p>
                    </div>
                    <div style="text-align: right;">
                      <div style="color: #1f2937; font-size: 20px; font-weight: 700;">
                        $${deal.price}
                      </div>
                      <a href="${deal.bookingLink}" style="color: #3b82f6; text-decoration: none; font-size: 13px; font-weight: 600;">
                        View Deal →
                      </a>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${otherDeals.length > 0 ? `
            <!-- Other Deals -->
            <div style="margin-bottom: 25px;">
              <h3 style="color: #6b7280; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
                More Destinations
              </h3>
              ${otherDeals.map(deal => `
                <div style="border-bottom: 1px solid #e5e7eb; padding: 12px 0;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <span style="color: #1f2937; font-size: 14px; font-weight: 500;">
                        ${deal.destination}
                      </span>
                      <span style="color: #9ca3af; font-size: 12px; margin-left: 8px;">
                        ${formatDate(deal.departure_date)}
                      </span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 15px;">
                      <span style="color: #1f2937; font-size: 16px; font-weight: 600;">
                        $${deal.price}
                      </span>
                      <a href="${deal.bookingLink}" style="color: #6b7280; text-decoration: none; font-size: 12px;">
                        View →
                      </a>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

        </div>

        <!-- Trial Status Bar -->
        <div style="padding: 20px; background-color: #fef3c7; border-top: 2px solid #f59e0b;">
          <div style="margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="color: #92400e; font-size: 12px; font-weight: 600;">
                Trial Progress
              </span>
              <span style="color: #92400e; font-size: 12px;">
                Day ${trialDay} of 7
              </span>
            </div>
            <div style="background-color: #fed7aa; border-radius: 10px; height: 8px; overflow: hidden;">
              <div style="background-color: #f59e0b; height: 100%; width: ${(trialDay / 7) * 100}%; transition: width 0.3s;"></div>
            </div>
          </div>

          ${trialDay >= 5 ? `
            <p style="color: #92400e; margin: 10px 0 15px 0; font-size: 14px; text-align: center; font-weight: 600;">
              ⏰ Your trial ends ${trialDay === 7 ? 'today' : `in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}`}!
            </p>
            <div style="text-align: center;">
              <a href="https://homebaseflights.com/checkout?plan=monthly" style="background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-size: 16px; font-weight: 600; display: inline-block;">
                Continue for $5.99/month →
              </a>
            </div>
          ` : ''}
        </div>

        <!-- Footer -->
        <div style="padding: 20px; background-color: #f3f4f6; text-align: center;">
          <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 12px;">
            You're receiving this because you're in your free trial.
          </p>
          <p style="color: #9ca3af; margin: 0; font-size: 11px;">
            © ${new Date().getFullYear()} Homebase Flights •
            <a href="https://homebaseflights.com/unsubscribe?email=${encodeURIComponent(subscriberEmail)}" style="color: #9ca3af;">
              Unsubscribe
            </a>
          </p>
        </div>

      </div>
    </body>
    </html>
  `
}