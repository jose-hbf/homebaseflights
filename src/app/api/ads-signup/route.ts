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

    if (contentType.includes('application/json')) {
      // JSON request from JS-enhanced form or banner
      const body = await request.json()
      email = body.email
      citySlug = body.citySlug
      cityName = body.cityName
    } else {
      // Form POST (no-JS fallback)
      const formData = await request.formData()
      email = formData.get('email') as string
      citySlug = formData.get('citySlug') as string
      cityName = formData.get('cityName') as string
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

    console.log('[Ads Signup] Received:', { email: normalizedEmail, citySlug, cityName })

    // Save subscriber to database with plan: 'free', status: 'active'
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if subscriber already exists
    const { data: existing, error: selectError } = await supabase
      .from('subscribers')
      .select('id')
      .eq('email', normalizedEmail)
      .single()

    console.log('[Ads Signup] Existing subscriber check:', { existing, selectError: selectError?.message })

    let dbSuccess = false

    if (existing) {
      // Update existing subscriber to free plan
      const { data: updateData, error: updateError } = await supabase
        .from('subscribers')
        .update({
          plan: 'free',
          status: 'active',
          free_nurture_emails_sent: [1],
        })
        .eq('email', normalizedEmail)
        .select()

      console.log('[Ads Signup] Supabase update result:', { updateData, updateError: updateError?.message })

      if (updateError) {
        console.error('[Ads Signup] Supabase update error:', updateError)
      } else {
        dbSuccess = true
      }
    } else {
      // Insert new subscriber
      // Note: citySlug is like "new-york", we use it directly as home_city
      const { data: insertData, error: insertError } = await supabase
        .from('subscribers')
        .insert({
          email: normalizedEmail,
          home_city: citySlug || 'new-york',
          status: 'active',
          plan: 'free',
          free_nurture_emails_sent: [1],
          created_at: new Date().toISOString(),
        })
        .select()

      console.log('[Ads Signup] Supabase insert result:', { insertData, insertError: insertError?.message })

      if (insertError) {
        console.error('[Ads Signup] Supabase insert error:', insertError)
      } else {
        dbSuccess = true
      }
    }

    // Track Lead event via Meta CAPI (fire-and-forget)
    void sendLeadEventToCAPI(normalizedEmail, citySlug || 'new-york', eventId)

    // Only send welcome email if database operation succeeded
    if (dbSuccess) {
      console.log('[Ads Signup] DB success, sending welcome email to:', normalizedEmail)
      void sendWelcomeEmail(normalizedEmail, cityName || 'New York')
    } else {
      console.error('[Ads Signup] DB operation failed, skipping welcome email for:', normalizedEmail)
    }

    // Return response based on request type
    if (contentType.includes('application/json')) {
      return NextResponse.json({
        success: true,
        redirectUrl: `/signup/success?city=${citySlug || 'new-york'}`,
      })
    }

    // Redirect to success page (form POST)
    // Use 303 status to change POST to GET
    return NextResponse.redirect(
      new URL(`/signup/success?city=${citySlug || 'new-york'}`, request.url),
      { status: 303 }
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
    return NextResponse.redirect(
      new URL('/signup/success?city=new-york', request.url),
      { status: 303 }
    )
  }
}
