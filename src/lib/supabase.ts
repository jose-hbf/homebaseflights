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

/**
 * Save flight deals to Supabase
 * Uses upsert to handle duplicates
 */
export async function saveFlightDeals(
  departureAirport: string,
  deals: FlightDeal[]
): Promise<{ inserted: number; errors: number }> {
  let inserted = 0
  let errors = 0

  // Convert to DB format
  const dbDeals = deals.map((deal) => ({
    departure_airport: departureAirport,
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
      .select()

    if (error) {
      console.error('Error saving deals batch:', error)
      errors += batch.length
    } else {
      inserted += data?.length || 0
    }
  }

  return { inserted, errors }
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
