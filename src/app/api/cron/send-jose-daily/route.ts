import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// Ultra-simple, bulletproof daily email for Jose
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)
const CRON_SECRET = process.env.CRON_SECRET

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  console.log('[Jose Daily] Starting Jose daily email job')

  try {
    // Step 1: Get ANY NYC deals from last 3 days (very generous)
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

    const { data: deals, error: dealsError } = await supabase
      .from('flight_deals')
      .select('*')
      .eq('city_slug', 'new-york')
      .gte('created_at', threeDaysAgo.toISOString())
      .order('price', { ascending: true })
      .limit(5)

    if (dealsError) {
      console.error('[Jose Daily] Error fetching deals:', dealsError)
      // FALLBACK: Still send email with message about checking manually
      return await sendFallbackEmail()
    }

    if (!deals || deals.length === 0) {
      console.log('[Jose Daily] No recent deals, trying older ones...')

      // FALLBACK: Get ANY deals from last week
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

      const { data: oldDeals } = await supabase
        .from('flight_deals')
        .select('*')
        .eq('city_slug', 'new-york')
        .gte('created_at', oneWeekAgo.toISOString())
        .order('price', { ascending: true })
        .limit(5)

      if (!oldDeals || oldDeals.length === 0) {
        return await sendFallbackEmail()
      }

      // Use old deals
      return await sendDealsEmail(oldDeals, true)
    }

    // Send normal email with fresh deals
    return await sendDealsEmail(deals, false)

  } catch (error) {
    console.error('[Jose Daily] Unexpected error:', error)
    return await sendFallbackEmail()
  }
}

async function sendDealsEmail(deals: any[], isOld: boolean) {
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const subject = isOld
    ? `🔄 NYC Flight Deals Update - ${dateStr}`
    : `✈️ Fresh NYC Deals - ${dateStr}`

  const ageNote = isOld
    ? '<p style="background: #fef3c7; padding: 12px; border-radius: 6px; margin-bottom: 20px;"><strong>Note:</strong> These are recent deals while we fetch fresh ones. New deals coming soon!</p>'
    : ''

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NYC Flight Deals - HomeBase Flights</title>
  <style>
    body { font-family: 'Fraunces', serif; background: #f8fafc; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: #2563eb; color: white; padding: 24px; text-align: center; }
    .logo { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
    .subtitle { opacity: 0.9; font-size: 16px; }
    .content { padding: 24px; }
    .deal { border: 2px solid #e2e8f0; border-radius: 8px; margin-bottom: 16px; overflow: hidden; }
    .deal-header { background: #f8fafc; padding: 16px; border-bottom: 1px solid #e2e8f0; }
    .destination { font-size: 20px; font-weight: 600; color: #1e293b; margin: 0; }
    .price { font-size: 28px; font-weight: 700; color: #2563eb; margin: 4px 0 0 0; }
    .deal-info { padding: 16px; }
    .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; color: #64748b; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">✈️ HomeBase Flights</div>
      <div class="subtitle">Your daily NYC flight deals</div>
    </div>

    <div class="content">
      <h2 style="color: #1e293b; margin-top: 0;">${subject.replace(/[^\w\s-]/g, '')}</h2>

      ${ageNote}

      ${deals.map(deal => `
      <div class="deal">
        <div class="deal-header">
          <h3 class="destination">${deal.destination || 'Mystery Destination'}</h3>
          <p class="price">$${deal.price || '???'}</p>
        </div>
        <div class="deal-info">
          <div class="info-row">
            <span>Departure:</span>
            <span>${deal.departure_date || 'Flexible dates'}</span>
          </div>
          <div class="info-row">
            <span>Return:</span>
            <span>${deal.return_date || 'Flexible return'}</span>
          </div>
          ${deal.booking_link ? `<a href="${deal.booking_link}" style="color: #2563eb; text-decoration: none; font-weight: 600;">Book Now →</a>` : '<span style="color: #64748b;">Search on Google Flights</span>'}
        </div>
      </div>
      `).join('')}
    </div>

    <div class="footer">
      <p>Happy travels! 🌍</p>
      <p style="font-size: 12px; margin-top: 16px;">
        Daily deals delivered automatically • No complex logic, just deals
      </p>
    </div>
  </div>
</body>
</html>`

  try {
    const result = await resend.emails.send({
      from: 'HomeBase Flights <deals@homebaseflights.com>',
      to: 'jose@homebaseflights.com',
      subject,
      html: emailHtml
    })

    if (result.error) {
      console.error('[Jose Daily] Email send error:', result.error)
      return NextResponse.json({
        success: false,
        error: 'Email failed',
        details: result.error,
        timestamp: new Date().toISOString(),
      }, { status: 500 })
    }

    console.log('[Jose Daily] Email sent successfully:', result.data?.id)

    return NextResponse.json({
      success: true,
      emailId: result.data?.id,
      dealsCount: deals.length,
      isOldDeals: isOld,
      timestamp: new Date().toISOString(),
      message: `Successfully sent ${deals.length} deals to jose@homebaseflights.com`
    })

  } catch (error) {
    console.error('[Jose Daily] Email error:', error)
    return NextResponse.json({
      success: false,
      error: 'Email exception',
      details: error,
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

async function sendFallbackEmail() {
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const subject = `🔧 NYC Deals System Update - ${dateStr}`

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>System Update - HomeBase Flights</title>
  <style>
    body { font-family: 'Fraunces', serif; background: #f8fafc; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: #dc2626; color: white; padding: 24px; text-align: center; }
    .logo { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
    .subtitle { opacity: 0.9; font-size: 16px; }
    .content { padding: 24px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">⚠️ HomeBase Flights</div>
      <div class="subtitle">System Status Update</div>
    </div>

    <div class="content">
      <h2 style="color: #1e293b;">Temporary Delay in NYC Deals</h2>
      <p>We're experiencing a temporary issue fetching fresh NYC deals.</p>
      <p><strong>What this means:</strong></p>
      <ul style="text-align: left; max-width: 400px; margin: 0 auto;">
        <li>The system is still running</li>
        <li>Fresh deals are being processed</li>
        <li>You'll receive deals tomorrow as normal</li>
      </ul>
      <p style="margin-top: 20px;">
        <strong>Manual check:</strong>
        <a href="https://homebaseflights.com" style="color: #2563eb;">Visit HomeBase Flights</a>
      </p>
    </div>
  </div>
</body>
</html>`

  try {
    await resend.emails.send({
      from: 'HomeBase Flights <deals@homebaseflights.com>',
      to: 'jose@homebaseflights.com',
      subject,
      html: emailHtml
    })

    return NextResponse.json({
      success: true,
      type: 'fallback',
      message: 'Sent fallback notification email',
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Even fallback failed',
      details: error,
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}