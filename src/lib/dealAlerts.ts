/**
 * @deprecated This module is deprecated. Use the new city-based alert system instead:
 * - For fetching & curating: /api/cron/fetch-deals (handles AI curation + instant alerts)
 * - For daily digest: /api/cron/send-digest
 * - For database operations: src/lib/supabase.ts (new functions)
 * 
 * This file is kept for backward compatibility during migration.
 */

import { Resend } from 'resend'
import { supabaseAdmin } from './supabase'
import { FlightDeal, AIRPORT_INFO, SupportedAirport } from '@/types/flights'
import { isDealGood, sortByDealQuality } from '@/utils/flightFilters'
import { renderDealAlertEmail } from '@/emails/DealAlertEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

// Email sender - use verified domain in production
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
const FROM_NAME = 'Homebase Flights'

/**
 * @deprecated Use city-based subscriptions instead
 */
interface Subscriber {
  id: string
  email: string
  home_airport: string
  max_price: number
  direct_only: boolean
  status: 'trial' | 'active' | 'cancelled' | 'expired'
}

interface SendAlertResult {
  subscriberId: string
  email: string
  dealsCount: number
  success: boolean
  error?: string
}

/**
 * Get active subscribers for a specific airport
 */
export async function getActiveSubscribers(airportCode: string): Promise<Subscriber[]> {
  const { data, error } = await supabaseAdmin
    .from('subscribers')
    .select('id, email, home_airport, max_price, direct_only, status')
    .eq('home_airport', airportCode.toUpperCase())
    .in('status', ['trial', 'active'])

  if (error) {
    console.error('Error fetching subscribers:', error)
    return []
  }

  return data || []
}

/**
 * Get good deals for an airport that haven't been sent to a subscriber yet
 */
export async function getUnsentDealsForSubscriber(
  subscriberId: string,
  airportCode: string,
  maxPrice: number,
  directOnly: boolean
): Promise<FlightDeal[]> {
  // Get all current good deals for this airport
  let query = supabaseAdmin
    .from('flight_deals')
    .select('*')
    .eq('departure_airport', airportCode.toUpperCase())
    .lte('price', maxPrice)
    .gte('departure_date', new Date().toISOString().split('T')[0])

  if (directOnly) {
    query = query.eq('stops', 0)
  }

  const { data: deals, error: dealsError } = await query

  if (dealsError || !deals) {
    console.error('Error fetching deals:', dealsError)
    return []
  }

  // Get deal IDs that were already sent to this subscriber
  const { data: sentAlerts } = await supabaseAdmin
    .from('deal_alerts')
    .select('deal_id')
    .eq('subscriber_id', subscriberId)

  const sentDealIds = new Set(sentAlerts?.map(a => a.deal_id) || [])

  // Filter out already sent deals and convert to FlightDeal format
  const unsentDeals: FlightDeal[] = deals
    .filter(d => !sentDealIds.has(d.id))
    .map(d => ({
      destination: d.destination,
      destinationCode: d.destination_code,
      country: d.country,
      price: d.price,
      departureDate: d.departure_date,
      returnDate: d.return_date,
      airline: d.airline,
      airlineCode: d.airline_code,
      durationMinutes: d.duration_minutes,
      stops: d.stops,
      bookingLink: d.booking_link,
      thumbnail: d.thumbnail || undefined,
      _dbId: d.id, // Keep track of DB id for marking as sent
    } as FlightDeal & { _dbId: string }))

  // Filter to only good deals and sort by quality
  const goodDeals = unsentDeals.filter(isDealGood)
  return sortByDealQuality(goodDeals)
}

/**
 * Mark deals as sent to a subscriber
 */
async function markDealsAsSent(
  subscriberId: string,
  dealIds: string[]
): Promise<void> {
  const alerts = dealIds.map(dealId => ({
    subscriber_id: subscriberId,
    deal_id: dealId,
    sent_at: new Date().toISOString(),
  }))

  const { error } = await supabaseAdmin
    .from('deal_alerts')
    .upsert(alerts, { onConflict: 'subscriber_id,deal_id' })

  if (error) {
    console.error('Error marking deals as sent:', error)
  }
}

/**
 * Send deal alert email to a subscriber
 */
export async function sendDealAlert(
  subscriber: Subscriber,
  deals: (FlightDeal & { _dbId?: string })[]
): Promise<SendAlertResult> {
  const result: SendAlertResult = {
    subscriberId: subscriber.id,
    email: subscriber.email,
    dealsCount: deals.length,
    success: false,
  }

  if (deals.length === 0) {
    result.success = true
    return result
  }

  const airportInfo = AIRPORT_INFO[subscriber.home_airport as SupportedAirport]
  const airportName = airportInfo?.city || subscriber.home_airport

  try {
    // Render email
    const html = renderDealAlertEmail({
      deals,
      airportCode: subscriber.home_airport,
      airportName,
      subscriberEmail: subscriber.email,
    })

    // Send via Resend
    const { error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: subscriber.email,
      subject: `✈️ ${deals.length} New Deal${deals.length > 1 ? 's' : ''} from ${airportName} - From $${Math.min(...deals.map(d => d.price))}`,
      html,
    })

    if (error) {
      result.error = error.message
      return result
    }

    // Mark deals as sent
    const dealIds = deals
      .map(d => (d as FlightDeal & { _dbId?: string })._dbId)
      .filter((id): id is string => !!id)

    if (dealIds.length > 0) {
      await markDealsAsSent(subscriber.id, dealIds)
    }

    // Update last_email_sent_at
    await supabaseAdmin
      .from('subscribers')
      .update({ last_email_sent_at: new Date().toISOString() })
      .eq('id', subscriber.id)

    result.success = true
    return result
  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Unknown error'
    return result
  }
}

/**
 * Send alerts to all subscribers for a specific airport
 */
export async function sendAlertsForAirport(
  airportCode: string
): Promise<{ sent: number; failed: number; skipped: number }> {
  const stats = { sent: 0, failed: 0, skipped: 0 }

  const subscribers = await getActiveSubscribers(airportCode)

  for (const subscriber of subscribers) {
    // Get unsent good deals for this subscriber
    const deals = await getUnsentDealsForSubscriber(
      subscriber.id,
      airportCode,
      subscriber.max_price || 500,
      subscriber.direct_only || false
    )

    if (deals.length === 0) {
      stats.skipped++
      continue
    }

    // Limit to top 5 deals per email
    const topDeals = deals.slice(0, 5)

    const result = await sendDealAlert(subscriber, topDeals)

    if (result.success) {
      stats.sent++
    } else {
      console.error(`Failed to send to ${subscriber.email}:`, result.error)
      stats.failed++
    }

    // Small delay between emails to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  return stats
}

/**
 * Send alerts to all subscribers across all airports
 */
export async function sendAllAlerts(): Promise<{
  airports: { code: string; sent: number; failed: number; skipped: number }[]
  totals: { sent: number; failed: number; skipped: number }
}> {
  // Get unique airports from subscribers
  const { data: airportData } = await supabaseAdmin
    .from('subscribers')
    .select('home_airport')
    .in('status', ['trial', 'active'])

  const uniqueAirports = [...new Set(airportData?.map(d => d.home_airport) || [])]

  const results: { code: string; sent: number; failed: number; skipped: number }[] = []
  const totals = { sent: 0, failed: 0, skipped: 0 }

  for (const airport of uniqueAirports) {
    const stats = await sendAlertsForAirport(airport)
    results.push({ code: airport, ...stats })
    totals.sent += stats.sent
    totals.failed += stats.failed
    totals.skipped += stats.skipped

    // Delay between airports
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  return { airports: results, totals }
}
