import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import {
  getFreeSubscribersForNurtureEmails,
  recordFreeNurtureEmailSent,
  hasSubscriberUpgraded,
} from '@/lib/supabase'
import {
  renderFreeNurtureEmail1,
  renderFreeNurtureEmail2,
  renderFreeNurtureEmail3,
  renderFreeNurtureEmail4,
  renderFreeNurtureEmail5,
  renderFreeNurtureEmail6,
  renderFreeNurtureEmail7,
  freeNurtureEmail1Subject,
  freeNurtureEmail2Subject,
  freeNurtureEmail3Subject,
  freeNurtureEmail4Subject,
  freeNurtureEmail5Subject,
  freeNurtureEmail6Subject,
  freeNurtureEmail7Subject,
} from '@/emails/free-nurture'
import { getCityBySlug } from '@/data/cities'

// Free nurture email schedule: email number -> days since signup
// Email 1 is normally sent immediately on signup, but if it failed we retry here
const FREE_NURTURE_SCHEDULE: Record<number, number> = {
  1: 0,   // Email 1 on Day 0: Welcome email (retry if signup failed to send)
  2: 3,   // Email 2 on Day 3: How we find deals
  3: 7,   // Email 3 on Day 7: Weekly recap + FOMO
  4: 10,  // Email 4 on Day 10: The math behind $59/year
  5: 14,  // Email 5 on Day 14: $49 discount offer
  6: 21,  // Email 6 on Day 21: Offer expires tomorrow
  7: 30,  // Email 7 on Day 30: Monthly recap (recurring)
}

const FREE_NURTURE_SUBJECTS: Record<number, string> = {
  1: freeNurtureEmail1Subject,
  2: freeNurtureEmail2Subject,
  3: freeNurtureEmail3Subject,
  4: freeNurtureEmail4Subject,
  5: freeNurtureEmail5Subject,
  6: freeNurtureEmail6Subject,
  7: freeNurtureEmail7Subject,
}

// Vercel Cron job protection
const CRON_SECRET = process.env.CRON_SECRET

// Resend client
const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Homebase Flights <deals@homebaseflights.com>'

interface NurtureResult {
  emailNumber: number
  sent: number
  failed: number
  skipped: number
}

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  console.log('[FreeNurture] Starting free user nurture email job')

  const results: NurtureResult[] = []
  const emailsSentByNumber: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 }
  let totalSkippedUpgraded = 0

  try {
    const freeSubscribers = await getFreeSubscribersForNurtureEmails()
    console.log(`[FreeNurture] Found ${freeSubscribers.length} free subscribers`)

    for (const subscriber of freeSubscribers) {
      // Check if subscriber has upgraded to paid (stop nurturing)
      const hasUpgraded = await hasSubscriberUpgraded(subscriber.id)
      if (hasUpgraded) {
        totalSkippedUpgraded++
        continue
      }

      const alreadySent = subscriber.free_nurture_emails_sent || []
      const daysSinceSignup = subscriber.days_since_signup

      // Check which email should be sent based on days since signup
      for (const [emailNumStr, targetDay] of Object.entries(FREE_NURTURE_SCHEDULE)) {
        const emailNum = parseInt(emailNumStr)

        // Skip if already sent this email
        if (alreadySent.includes(emailNum)) continue

        // For Email 7 (monthly recap), check if it's been 30+ days since last Email 7
        // or if they've never received it and are 30+ days in
        if (emailNum === 7) {
          const lastEmail7Index = alreadySent.filter(n => n === 7).length
          const daysSinceLastMonthlyEmail = daysSinceSignup - (30 + lastEmail7Index * 30)

          // Only send monthly email every 30 days
          if (daysSinceLastMonthlyEmail < 0) continue
        } else {
          // For non-recurring emails, check if it's time
          if (daysSinceSignup < targetDay) continue

          // Make sure we haven't already sent a later email (to avoid sending out of order)
          const laterEmailsSent = alreadySent.filter(n => n > emailNum && n < 7)
          if (laterEmailsSent.length > 0) continue
        }

        try {
          let html: string
          switch (emailNum) {
            case 1: {
              // Welcome email retry - get city name from home_city slug
              const city = getCityBySlug(subscriber.home_city || 'new-york')
              const cityName = city?.name || 'New York'
              html = renderFreeNurtureEmail1({
                subscriberEmail: subscriber.email,
                cityName,
              })
              console.log(`[FreeNurture] Retrying welcome email for ${subscriber.email} (signup failed to send)`)
              break
            }
            case 2:
              html = renderFreeNurtureEmail2({ subscriberEmail: subscriber.email })
              break
            case 3:
              html = renderFreeNurtureEmail3({ subscriberEmail: subscriber.email })
              break
            case 4:
              html = renderFreeNurtureEmail4({ subscriberEmail: subscriber.email })
              break
            case 5:
              html = renderFreeNurtureEmail5({ subscriberEmail: subscriber.email })
              break
            case 6:
              html = renderFreeNurtureEmail6({ subscriberEmail: subscriber.email })
              break
            case 7:
              html = renderFreeNurtureEmail7({ subscriberEmail: subscriber.email })
              break
            default:
              continue
          }

          const { error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: subscriber.email,
            subject: FREE_NURTURE_SUBJECTS[emailNum],
            html,
          })

          if (!error) {
            await recordFreeNurtureEmailSent(subscriber.id, emailNum)
            emailsSentByNumber[emailNum]++
            console.log(`[FreeNurture] Sent Email ${emailNum} to ${subscriber.email} (Day ${daysSinceSignup})`)
          } else {
            console.error(`[FreeNurture] Failed to send Email ${emailNum} to ${subscriber.email}:`, error)
          }

          // Only send one nurture email per subscriber per cron run
          break
        } catch (emailError) {
          console.error(`[FreeNurture] Error sending Email ${emailNum} to ${subscriber.email}:`, emailError)
        }
      }

      // Small delay between subscribers to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 50))
    }

    // Compile results
    for (const [emailNum, count] of Object.entries(emailsSentByNumber)) {
      results.push({
        emailNumber: parseInt(emailNum),
        sent: count,
        failed: 0, // We don't track individual failures currently
        skipped: 0,
      })
    }

    const totalSent = Object.values(emailsSentByNumber).reduce((a, b) => a + b, 0)
    console.log(`[FreeNurture] Total sent: ${totalSent}`, emailsSentByNumber)

  } catch (error) {
    console.error('[FreeNurture] Error:', error)
    return NextResponse.json({
      success: false,
      error: String(error),
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }

  const duration = Date.now() - startTime
  const summary = {
    totalEmailsSent: Object.values(emailsSentByNumber).reduce((a, b) => a + b, 0),
    emailsByNumber: emailsSentByNumber,
    skippedUpgraded: totalSkippedUpgraded,
    durationMs: duration,
  }

  console.log(`[FreeNurture] Job completed in ${duration}ms:`, summary)

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    summary,
    results,
  })
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}
