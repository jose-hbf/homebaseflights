import { getManageSubscriptionUrl } from '@/lib/unsubscribe'

interface FreeNurtureEmail5Props {
  subscriberEmail: string
}

// Discounted price link - $49 instead of $59
const DISCOUNT_URL = 'https://buy.stripe.com/4gM7sNgMyejzapagigaR201'

function getDiscountUrl(email: string, emailNumber: number): string {
  const url = new URL(DISCOUNT_URL)
  url.searchParams.set('prefilled_email', email)
  url.searchParams.set('utm_source', 'email')
  url.searchParams.set('utm_medium', 'nurturing')
  url.searchParams.set('utm_campaign', 'free_to_pro')
  url.searchParams.set('utm_content', `email_${emailNumber}`)
  url.searchParams.set('discount', 'FREEUSER10')
  return url.toString()
}

/**
 * Email 5 — Day 14: Limited-time discount ($49 instead of $59)
 * Creates urgency with exclusive offer
 */
export function renderFreeNurtureEmail5({
  subscriberEmail,
}: FreeNurtureEmail5Props): string {
  const discountUrl = getDiscountUrl(subscriberEmail, 5)

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$10 off for free members (this week only)</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff;">

  <!-- Header with Logo -->
  <div style="padding: 24px 24px 20px 24px; border-bottom: 1px solid #e5e7eb;">
    <img src="https://homebaseflights.com/logo-header.svg" alt="Homebase Flights" width="160" height="27" style="display: block;" />
  </div>

  <!-- Main Content -->
  <div style="padding: 32px 24px;">

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      You've been a free member for 2 weeks now.
    </p>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      In that time, we've found <strong>16 deals from New York</strong>. You saw 4 of them.
    </p>

    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
      I want to offer you something we don't usually do:
    </p>

    <!-- Discount Box -->
    <div style="padding: 24px; background-color: #ecfdf5; border-radius: 8px; margin-bottom: 24px; border: 2px solid #10b981; text-align: center;">
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #065f46; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
        Free Member Exclusive
      </p>
      <p style="margin: 0 0 8px 0; font-size: 32px; font-weight: 700; color: #047857;">
        $49/year
      </p>
      <p style="margin: 0 0 16px 0; font-size: 16px; color: #6b7280;">
        <span style="text-decoration: line-through;">$59</span> — Save $10
      </p>
      <p style="margin: 0; font-size: 14px; color: #065f46;">
        Offer valid this week only
      </p>
    </div>

    <!-- What you get -->
    <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #374151; font-weight: 600;">
      What you unlock:
    </p>

    <div style="margin-bottom: 24px;">
      <p style="margin: 0 0 8px 0; font-size: 15px; color: #374151;">
        ✓ <strong>Every deal</strong> from JFK, Newark & LaGuardia
      </p>
      <p style="margin: 0 0 8px 0; font-size: 15px; color: #374151;">
        ✓ Deals sent <strong>instantly</strong> (not weekly)
      </p>
      <p style="margin: 0 0 8px 0; font-size: 15px; color: #374151;">
        ✓ <strong>Mistake fares & flash sales</strong> (Pro exclusive)
      </p>
      <p style="margin: 0; font-size: 15px; color: #374151;">
        ✓ <strong>Money-back guarantee</strong> — full refund if you don't save $177 in year 1
      </p>
    </div>

    <!-- CTA -->
    <div style="text-align: center; margin-bottom: 24px;">
      <a href="${discountUrl}" style="display: inline-block; padding: 14px 28px; background-color: #10b981; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 9999px;">
        Claim $49 Rate →
      </a>
    </div>

    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #6b7280; text-align: center;">
      This $10 discount expires in 7 days.
    </p>

    <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #374151;">
      — Homebase Flights
    </p>

  </div>

  <!-- Footer -->
  <div style="padding: 24px; border-top: 1px solid #e5e7eb; background-color: #f9fafb;">
    <p style="margin: 0 0 8px 0; font-size: 12px; color: #9ca3af;">
      Questions? Reply to this email — we read every message.
    </p>
    <p style="margin: 0; font-size: 12px;">
      <a href="${getManageSubscriptionUrl(subscriberEmail)}" style="color: #6b7280;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>
  `.trim()
}

export const freeNurtureEmail5Subject = '$10 off for free members (this week only)'
