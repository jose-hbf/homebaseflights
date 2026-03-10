import React from 'react'

interface Deal {
  id: string
  destination: string
  destination_code: string
  country: string
  price: number
  departure_date: string
  return_date: string
  departure_airport?: string
  airline: string
  airline_code?: string
  tier?: string
  ai_description?: string
  region?: string
  bookingLink: string
  booking_link?: string
  deal_type?: string
  savings_percent?: number
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
  const calculateSavings = (price: number, savingsPercent?: number) => {
    const percent = savingsPercent || 40 // Use provided or default 40%
    const typicalPrice = price / (1 - percent / 100)
    return Math.round(typicalPrice - price)
  }

  // Get deal type badge
  const getDealBadge = (dealType?: string) => {
    switch (dealType) {
      case 'error_fare':
        return '⚡ ERROR FARE'
      case 'flash_sale':
        return '⏰ FLASH SALE'
      case 'exceptional':
        return '🔥 EXCEPTIONAL'
      case 'nonstop':
        return '✈️ NONSTOP'
      default:
        return null
    }
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
    <body style="margin: 0; padding: 0; font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #fdfcfb; line-height: 1.6;">
      <!-- Google Fonts -->
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
      </style>

      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">

        <!-- Header -->
        <div style="background-color: #2563eb; padding: 40px 30px; text-align: center; background-image: linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%); background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0px;">
          <img src="https://homebaseflights.com/logo-header.svg" alt="Homebase Flights" style="height: 28px; width: auto; margin-bottom: 16px;" />
          <h1 style="color: #ffffff; margin: 0 0 8px 0; font-family: 'Fraunces', serif; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
            Your deals from New York today
          </h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 0; font-size: 16px; font-weight: 400;">
            Trial Day ${trialDay} of 7 • ${daysLeft > 0 ? `${daysLeft} days left` : 'Last day!'}
          </p>
        </div>

        <!-- Welcome Message -->
        <div style="padding: 35px 30px; background-color: #fdfcfb;">
          <h2 style="color: #2d1b14; margin: 0 0 12px 0; font-family: 'Fraunces', serif; font-size: 22px; font-weight: 600; letter-spacing: -0.3px;">
            ${getHeaderMessage()}
          </h2>
          <p style="color: #6b4e42; margin: 0; font-size: 16px; line-height: 1.6;">
            We've found ${deals.length} amazing international deals from ${cityName} today.
            ${exceptionalDeals.length > 0 ? ` Including ${exceptionalDeals.length} exceptional ${exceptionalDeals.length === 1 ? 'deal' : 'deals'}!` : ''}
          </p>
        </div>

        <!-- Deals Section -->
        <div style="padding: 20px;">

          ${deals.map((deal, index) => `
            <div style="margin-bottom: 20px; ${index === deals.length - 1 ? '' : 'border-bottom: 1px solid #f1f0ef; padding-bottom: 20px;'}">
              <!-- Deal Card -->
              <div style="background-color: #ffffff; border: 1px solid #e8e5e1; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">

                <!-- Deal Content - Single Section -->
                <div style="padding: 20px; display: flex; align-items: center; justify-content: space-between;">

                  <!-- Left Side: Destination + Details -->
                  <div style="flex: 1; margin-right: 20px;">
                    <h3 style="color: #2d1b14; margin: 0 0 4px 0; font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; letter-spacing: -0.3px;">
                      ${deal.destination}, ${deal.country}
                    </h3>

                    <!-- Details in compact line -->
                    <div style="margin: 6px 0; font-size: 14px; color: #8b7355;">
                      <span style="color: #2563eb; font-weight: 600;">from ${deal.departure_airport || 'JFK'}</span>
                      <span style="margin: 0 8px; color: #d1d5db;">•</span>
                      <span>${formatDate(deal.departure_date)}</span>
                      <span style="margin: 0 8px; color: #d1d5db;">•</span>
                      <span>${deal.airline || deal.airline_code}</span>
                    </div>
                  </div>

                  <!-- Right Side: Price + Button -->
                  <div style="text-align: center; min-width: 140px;">
                    <div style="color: #2563eb; font-family: 'Fraunces', serif; font-size: 28px; font-weight: 700; line-height: 1; margin-bottom: 8px;">
                      $${deal.price}
                    </div>
                    <a href="${deal.booking_link || deal.bookingLink}" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600; display: inline-block; transition: background-color 0.2s; font-family: 'IBM Plex Sans', sans-serif;">
                      View Deal →
                    </a>
                  </div>

                </div>
              </div>
            </div>
          `).join('')}


        </div>

        <!-- Trial Status Bar -->
        <div style="padding: 20px; background: linear-gradient(135deg, #f5f3f0 0%, #f1ede7 100%); border-top: 1px solid #e8e5e1;">
          <div style="text-align: center; margin-bottom: 15px;">
            <h4 style="color: #2d1b14; margin: 0 0 6px 0; font-family: 'Fraunces', serif; font-size: 16px; font-weight: 600;">
              Trial Progress
            </h4>
            <p style="color: #8b7355; margin: 0; font-size: 13px;">
              Day ${trialDay} of 7 • ${daysLeft > 0 ? `${daysLeft} days left` : 'Last day!'}
            </p>
          </div>

          <div style="background-color: #e8e5e1; border-radius: 10px; height: 10px; overflow: hidden; margin-bottom: 15px;">
            <div style="background-color: #2563eb; height: 100%; width: ${(trialDay / 7) * 100}%; transition: width 0.3s; border-radius: 10px;"></div>
          </div>

          ${trialDay >= 5 ? `
            <p style="color: #2563eb; margin: 0 0 15px 0; font-size: 14px; text-align: center; font-weight: 600;">
              ⏰ Your trial ends ${trialDay === 7 ? 'today' : `in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}`}!
            </p>
            <div style="text-align: center;">
              <a href="https://homebaseflights.com/checkout?plan=monthly" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-size: 14px; font-weight: 600; display: inline-block; font-family: 'IBM Plex Sans', sans-serif;">
                Continue for $5.99/month →
              </a>
            </div>
          ` : ''}
        </div>

        <!-- Footer -->
        <div style="padding: 20px; background-color: #2d1b14; text-align: center;">
          <p style="color: rgba(255, 255, 255, 0.8); margin: 0 0 10px 0; font-size: 13px;">
            You're receiving this because you're in your free trial.
          </p>
          <p style="color: rgba(255, 255, 255, 0.6); margin: 0; font-size: 11px;">
            © ${new Date().getFullYear()} Homebase Flights •
            <a href="https://homebaseflights.com/unsubscribe?email=${encodeURIComponent(subscriberEmail)}" style="color: rgba(255, 255, 255, 0.6); text-decoration: underline;">
              Unsubscribe
            </a>
          </p>
        </div>

      </div>
    </body>
    </html>
  `
}