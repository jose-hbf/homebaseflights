import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getResend, FROM_EMAIL } from '@/lib/resend'
import {
  renderFreeNurtureEmail1,
  freeNurtureEmail1Subject,
} from '@/emails/free-nurture'

/**
 * Server-side form handler for ads pages
 * Saves subscriber as free tier and redirects to success page
 *
 * Supports both:
 * - Form POST (no-JS fallback)
 * - JSON POST (JS-enhanced form)
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Meta CAPI for server-side Lead event tracking
async function sendLeadEventToCAPI(
  email: string,
  citySlug: string,
  eventId: string
): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
  const accessToken = process.env.META_CONVERSIONS_API_TOKEN

  if (!pixelId || !accessToken) {
    return
  }

  const eventTime = Math.floor(Date.now() / 1000)

  const payload = {
    data: [
      {
        event_name: 'Lead',
        event_time: eventTime,
        event_id: eventId,
        action_source: 'website',
        user_data: {
          em: [await hashEmail(email)],
        },
        custom_data: {
          city: citySlug,
        },
      },
    ],
  }

  try {
    await fetch(
      `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )
  } catch (error) {
    console.error('Failed to send Lead event to Meta CAPI:', error)
  }
}

async function hashEmail(email: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(email.toLowerCase().trim())
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function sendWelcomeEmail(email: string, cityName: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY not set. Skipping welcome email.')
    return
  }

  try {
    const resend = getResend()
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: freeNurtureEmail1Subject,
      html: renderFreeNurtureEmail1({
        subscriberEmail: email,
        cityName: cityName || 'New York',
      }),
    })
  } catch (error) {
    console.error('Failed to send welcome email:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Determine if this is a JSON request or form submission
    const contentType = request.headers.get('content-type') || ''
    let email: string
    let citySlug: string
    let cityName: string
    let source = 'meta_ads'

    if (contentType.includes('application/json')) {
      // JSON request from JS-enhanced form or banner
      const body = await request.json()
      email = body.email
      citySlug = body.citySlug
      cityName = body.cityName
      source = body.source || 'meta_ads'
    } else {
      // Form POST (no-JS fallback)
      const formData = await request.formData()
      email = formData.get('email') as string
      citySlug = formData.get('citySlug') as string
      cityName = formData.get('cityName') as string
      source = 'meta_ads_nojs'
    }

    if (!email) {
      if (contentType.includes('application/json')) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 })
      }
      return NextResponse.redirect(
        new URL('/ads/cheap-flights-from-new-york?error=missing', request.url)
      )
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      if (contentType.includes('application/json')) {
        return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
      }
      return NextResponse.redirect(
        new URL('/ads/cheap-flights-from-new-york?error=invalid', request.url)
      )
    }

    const normalizedEmail = email.toLowerCase().trim()
    const eventId = crypto.randomUUID()

    // Save subscriber to database with plan: 'free', status: 'active'
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if subscriber already exists
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id')
      .eq('email', normalizedEmail)
      .single()

    if (existing) {
      // Update existing subscriber to free plan
      const { error: updateError } = await supabase
        .from('subscribers')
        .update({
          plan: 'free',
          status: 'active',
          free_nurture_emails_sent: [1],
          source,
        })
        .eq('email', normalizedEmail)

      if (updateError) {
        console.error('Database update error:', updateError)
      }
    } else {
      // Insert new subscriber
      const { error: insertError } = await supabase
        .from('subscribers')
        .insert({
          email: normalizedEmail,
          home_airport: citySlug?.toUpperCase() || 'JFK',
          source,
          status: 'active',
          plan: 'free',
          free_nurture_emails_sent: [1],
          created_at: new Date().toISOString(),
        })

      if (insertError) {
        console.error('Database insert error:', insertError)
      }
    }

    // Track Lead event via Meta CAPI (fire-and-forget)
    void sendLeadEventToCAPI(normalizedEmail, citySlug || 'new-york', eventId)

    // Send welcome email (fire-and-forget)
    void sendWelcomeEmail(normalizedEmail, cityName || 'New York')

    // Return response based on request type
    if (contentType.includes('application/json')) {
      return NextResponse.json({
        success: true,
        redirectUrl: `/signup/success?city=${citySlug || 'new-york'}`,
      })
    }

    // Redirect to success page (form POST)
    return NextResponse.redirect(
      new URL(`/signup/success?city=${citySlug || 'new-york'}`, request.url)
    )
  } catch (error) {
    console.error('Error in ads-signup:', error)

    const contentType = request.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }

    // Fallback redirect to success page anyway (don't lose the lead)
    return NextResponse.redirect(new URL('/signup/success?city=new-york', request.url))
  }
}
