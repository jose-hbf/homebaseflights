import { createClient } from '@supabase/supabase-js'
import { FlightDeal } from '@/types/flights'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Service role client for server-side operations (cron, API routes)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Public client for client-side operations (uses anon key)
export function createPublicClient() {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(supabaseUrl, anonKey)
}

// Legacy function for backwards compatibility
export function getSupabase() {
  return createPublicClient()
}

// ============================================
// SUBSCRIBER TYPES (for subscribers API)
// ============================================

export interface SubscriberInsert {
  email: string
  city_slug: string | null
  city_name: string | null
  status: 'trial' | 'active' | 'cancelled' | 'expired'
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  trial_ends_at: string
}

// ============================================
// FLIGHT DEALS OPERATIONS
// ============================================

export interface DbFlightDeal {
  id: string
  departure_airport: string
  city_slug: string
  destination: string
  destination_code: string
  country: string
  price: number
  departure_date: string
  return_date: string
  airline: string
  airline_code: string
  duration_minutes: number
  stops: number
  booking_link: string
  thumbnail: string | null
  fetched_at: string
  created_at: string
}

export interface DbCuratedDeal {
  id: string
  deal_id: string
  city_slug: string
  ai_tier: 'exceptional' | 'good' | 'notable'
  ai_description: string
  ai_model: string
  ai_reasoning: string | null
  instant_alert_sent: boolean
  instant_alert_sent_at: string | null
  digest_sent: boolean
  digest_sent_at: string | null
  curated_at: string
}

export interface DbSubscriber {
  id: string
  email: string
  home_city: string
  max_price: number
  direct_only: boolean
  status: 'trial' | 'active' | 'cancelled' | 'expired'
  email_frequency: 'instant' | 'daily'
  last_email_sent_at: string | null
  last_digest_sent_at: string | null
  created_at: string
}

/**
 * Save flight deals to Supabase
 * Uses upsert to handle duplicates
 */
export async function saveFlightDeals(
  departureAirport: string,
  citySlug: string,
  deals: FlightDeal[]
): Promise<{ inserted: number; errors: number; dealIds: string[] }> {
  let inserted = 0
  let errors = 0
  const dealIds: string[] = []

  // Convert to DB format
  const dbDeals = deals.map((deal) => ({
    departure_airport: departureAirport,
    city_slug: citySlug,
    destination: deal.destination,
    destination_code: deal.destinationCode,
    country: deal.country,
    price: deal.price,
    departure_date: deal.departureDate,
    return_date: deal.returnDate,
    airline: deal.airline,
    airline_code: deal.airlineCode,
    duration_minutes: deal.durationMinutes,
    stops: deal.stops,
    booking_link: deal.bookingLink,
    thumbnail: deal.thumbnail || null,
    fetched_at: new Date().toISOString(),
  }))

  // Upsert in batches of 50
  const batchSize = 50
  for (let i = 0; i < dbDeals.length; i += batchSize) {
    const batch = dbDeals.slice(i, i + batchSize)

    const { error, data } = await supabaseAdmin
      .from('flight_deals')
      .upsert(batch, {
        onConflict: 'departure_airport,destination_code,departure_date,return_date,airline_code',
        ignoreDuplicates: false,
      })
      .select('id')

    if (error) {
      console.error('Error saving deals batch:', error)
      errors += batch.length
    } else {
      inserted += data?.length || 0
      dealIds.push(...(data?.map(d => d.id) || []))
    }
  }

  return { inserted, errors, dealIds }
}

/**
 * Get deals for a specific airport from Supabase
 */
export async function getDealsFromDb(
  departureAirport: string,
  options: {
    maxPrice?: number
    directOnly?: boolean
    limit?: number
  } = {}
): Promise<FlightDeal[]> {
  const { maxPrice = 500, directOnly = false, limit = 20 } = options

  let query = supabaseAdmin
    .from('flight_deals')
    .select('*')
    .eq('departure_airport', departureAirport)
    .lte('price', maxPrice)
    .gte('departure_date', new Date().toISOString().split('T')[0])
    .order('price', { ascending: true })
    .limit(limit)

  if (directOnly) {
    query = query.eq('stops', 0)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching deals:', error)
    return []
  }

  // Convert to FlightDeal format
  return (data as DbFlightDeal[]).map((d) => ({
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
  }))
}

/**
 * Clean old deals from database
 */
export async function cleanOldDeals(): Promise<number> {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  // First count how many will be deleted
  const { count } = await supabaseAdmin
    .from('flight_deals')
    .select('*', { count: 'exact', head: true })
    .lt('fetched_at', sevenDaysAgo.toISOString())

  // Then delete them
  const { error } = await supabaseAdmin
    .from('flight_deals')
    .delete()
    .lt('fetched_at', sevenDaysAgo.toISOString())

  if (error) {
    console.error('Error cleaning old deals:', error)
    return 0
  }

  return count || 0
}

/**
 * Get deal stats
 */
export async function getDealStats(): Promise<{
  totalDeals: number
  airportsCovered: number
  cheapestDeal: number | null
  lastUpdated: string | null
}> {
  const { count: totalCount } = await supabaseAdmin
    .from('flight_deals')
    .select('*', { count: 'exact', head: true })

  const { data: airportsData } = await supabaseAdmin
    .from('flight_deals')
    .select('departure_airport')

  const { data: cheapestData } = await supabaseAdmin
    .from('flight_deals')
    .select('price')
    .order('price', { ascending: true })
    .limit(1)
    .single()

  const { data: latestData } = await supabaseAdmin
    .from('flight_deals')
    .select('fetched_at')
    .order('fetched_at', { ascending: false })
    .limit(1)
    .single()

  const uniqueAirports = new Set(airportsData?.map((d) => d.departure_airport) || [])

  return {
    totalDeals: totalCount || 0,
    airportsCovered: uniqueAirports.size,
    cheapestDeal: cheapestData?.price || null,
    lastUpdated: latestData?.fetched_at || null,
  }
}

// ============================================
// CITY & SUBSCRIBER OPERATIONS
// ============================================

/**
 * Get all cities that have active subscribers
 */
export async function getCitiesWithActiveSubscribers(): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from('subscribers')
    .select('home_city')
    .in('status', ['trial', 'active'])

  if (error) {
    console.error('Error fetching cities with subscribers:', error)
    return []
  }

  // Return unique city slugs
  return [...new Set(data?.map(d => d.home_city) || [])]
}

/**
 * Get active subscribers for a city
 */
export async function getActiveSubscribersForCity(citySlug: string): Promise<DbSubscriber[]> {
  const { data, error } = await supabaseAdmin
    .from('subscribers')
    .select('*')
    .eq('home_city', citySlug)
    .in('status', ['trial', 'active'])

  if (error) {
    console.error('Error fetching subscribers for city:', error)
    return []
  }

  return data || []
}

// ============================================
// CURATED DEALS OPERATIONS
// ============================================

/**
 * Save curated deals to database
 */
export async function saveCuratedDeals(
  citySlug: string,
  curatedDeals: Array<{
    dealId: string
    tier: 'exceptional' | 'good' | 'notable'
    description: string
    model: string
    reasoning?: string
  }>
): Promise<{ inserted: number; errors: number }> {
  let inserted = 0
  let errors = 0

  const dbCuratedDeals = curatedDeals.map(deal => ({
    deal_id: deal.dealId,
    city_slug: citySlug,
    ai_tier: deal.tier,
    ai_description: deal.description,
    ai_model: deal.model,
    ai_reasoning: deal.reasoning || null,
    curated_at: new Date().toISOString(),
  }))

  // Upsert to handle re-curation of same deals
  const { error, data } = await supabaseAdmin
    .from('curated_deals')
    .upsert(dbCuratedDeals, {
      onConflict: 'deal_id',
      ignoreDuplicates: false,
    })
    .select()

  if (error) {
    console.error('Error saving curated deals:', error)
    errors = dbCuratedDeals.length
  } else {
    inserted = data?.length || 0
  }

  return { inserted, errors }
}

/**
 * Get unsent exceptional deals for instant alerts
 */
export async function getUnsentExceptionalDeals(citySlug: string): Promise<Array<DbCuratedDeal & { deal: DbFlightDeal }>> {
  const { data, error } = await supabaseAdmin
    .from('curated_deals')
    .select(`
      *,
      deal:flight_deals(*)
    `)
    .eq('city_slug', citySlug)
    .eq('ai_tier', 'exceptional')
    .eq('instant_alert_sent', false)
    .order('curated_at', { ascending: false })

  if (error) {
    console.error('Error fetching unsent exceptional deals:', error)
    return []
  }

  return data || []
}

/**
 * Get unsent deals for daily digest
 */
export async function getUnsentDigestDeals(
  citySlug: string,
  options?: { limit?: number }
): Promise<Array<DbCuratedDeal & { deal: DbFlightDeal }>> {
  const { limit = 5 } = options || {}
  
  // Get deals curated in last 24 hours that haven't been sent in digest
  const twentyFourHoursAgo = new Date()
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

  const { data, error } = await supabaseAdmin
    .from('curated_deals')
    .select(`
      *,
      deal:flight_deals(*)
    `)
    .eq('city_slug', citySlug)
    .eq('digest_sent', false)
    .gte('curated_at', twentyFourHoursAgo.toISOString())
    .order('ai_tier', { ascending: true }) // exceptional first, then good, then notable
    .order('curated_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching unsent digest deals:', error)
    return []
  }

  return data || []
}

/**
 * Mark curated deals as sent (instant alert)
 */
export async function markDealsAsInstantSent(dealIds: string[]): Promise<void> {
  const { error } = await supabaseAdmin
    .from('curated_deals')
    .update({
      instant_alert_sent: true,
      instant_alert_sent_at: new Date().toISOString(),
    })
    .in('id', dealIds)

  if (error) {
    console.error('Error marking deals as instant sent:', error)
  }
}

/**
 * Mark curated deals as sent (digest)
 */
export async function markDealsAsDigestSent(dealIds: string[]): Promise<void> {
  const { error } = await supabaseAdmin
    .from('curated_deals')
    .update({
      digest_sent: true,
      digest_sent_at: new Date().toISOString(),
    })
    .in('id', dealIds)

  if (error) {
    console.error('Error marking deals as digest sent:', error)
  }
}

/**
 * Record that an alert was sent to a subscriber
 */
export async function recordAlertSent(
  subscriberId: string,
  curatedDealId: string,
  alertType: 'instant' | 'digest'
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('deal_alerts')
    .upsert({
      subscriber_id: subscriberId,
      curated_deal_id: curatedDealId,
      alert_type: alertType,
      sent_at: new Date().toISOString(),
    }, {
      onConflict: 'subscriber_id,curated_deal_id',
    })

  if (error) {
    console.error('Error recording alert sent:', error)
  }
}

/**
 * Check if a deal was already sent to a subscriber
 */
export async function wasAlertSentToSubscriber(
  subscriberId: string,
  curatedDealId: string
): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('deal_alerts')
    .select('id')
    .eq('subscriber_id', subscriberId)
    .eq('curated_deal_id', curatedDealId)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error checking if alert was sent:', error)
  }

  return !!data
}

/**
 * Update subscriber's last email timestamp
 */
export async function updateSubscriberEmailTimestamp(
  subscriberId: string,
  type: 'instant' | 'digest'
): Promise<void> {
  const updates: Record<string, string> = {
    last_email_sent_at: new Date().toISOString(),
  }
  
  if (type === 'digest') {
    updates.last_digest_sent_at = new Date().toISOString()
  }

  const { error } = await supabaseAdmin
    .from('subscribers')
    .update(updates)
    .eq('id', subscriberId)

  if (error) {
    console.error('Error updating subscriber timestamp:', error)
  }
}

/**
 * Get recent deals for a city (for display/debugging)
 */
export async function getRecentDealsForCity(
  citySlug: string,
  options?: { limit?: number; hoursAgo?: number }
): Promise<DbFlightDeal[]> {
  const { limit = 20, hoursAgo = 24 } = options || {}
  
  const since = new Date()
  since.setHours(since.getHours() - hoursAgo)

  const { data, error } = await supabaseAdmin
    .from('flight_deals')
    .select('*')
    .eq('city_slug', citySlug)
    .gte('fetched_at', since.toISOString())
    .gte('departure_date', new Date().toISOString().split('T')[0])
    .order('price', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent deals for city:', error)
    return []
  }

  return data || []
}
