import { createClient } from '@supabase/supabase-js'
import { FlightDeal } from '@/types/flights'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Service role client for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// ============================================
// IMPROVED DEAL SAVING WITH RETRY & RATE LIMITING
// ============================================

interface SaveDealsResult {
  inserted: number
  updated: number
  errors: number
  dealIds: string[]
  errorDetails: Array<{
    deal: any
    error: string
  }>
}

/**
 * Delay helper for rate limiting
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Retry with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  baseDelay = 500
): Promise<T | null> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error: any) {
      console.log(`Attempt ${i + 1} failed: ${error.message}`)

      if (i === retries - 1) {
        throw error
      }

      const waitTime = baseDelay * Math.pow(2, i) // 500ms, 1s, 2s
      console.log(`Waiting ${waitTime}ms before retry...`)
      await delay(waitTime)
    }
  }
  return null
}

/**
 * Generate unique key for a deal
 */
function generateDealKey(deal: any): string {
  // Create a unique identifier using critical fields
  return `${deal.departure_airport}-${deal.destination_code}-${deal.departure_date}-${deal.price}`
}

/**
 * Improved save flight deals with retry logic and rate limiting
 */
export async function saveFlightDealsImproved(
  departureAirport: string,
  citySlug: string,
  deals: FlightDeal[]
): Promise<SaveDealsResult> {
  const result: SaveDealsResult = {
    inserted: 0,
    updated: 0,
    errors: 0,
    dealIds: [],
    errorDetails: []
  }

  console.log(`[SaveDeals] Starting to save ${deals.length} deals for ${citySlug}`)

  // Convert to DB format with unique key
  const dbDeals = deals.map((deal) => ({
    departure_airport: deal.departureAirport || departureAirport,
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
    deal_key: generateDealKey({
      departure_airport: deal.departureAirport || departureAirport,
      destination_code: deal.destinationCode,
      departure_date: deal.departureDate,
      price: deal.price
    })
  }))

  // Process in smaller batches with rate limiting
  const BATCH_SIZE = 10 // Smaller batches for better success rate
  const RATE_LIMIT_DELAY = 200 // 200ms between batches

  for (let i = 0; i < dbDeals.length; i += BATCH_SIZE) {
    const batch = dbDeals.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(dbDeals.length / BATCH_SIZE)

    console.log(`[SaveDeals] Processing batch ${batchNum}/${totalBatches} (${batch.length} deals)`)

    // Try to save this batch with retry logic
    const savedBatch = await retryWithBackoff(async () => {
      const { data, error } = await supabaseAdmin
        .from('flight_deals')
        .upsert(batch, {
          onConflict: 'deal_key', // Use simpler unique constraint
          ignoreDuplicates: false, // Update if exists
        })
        .select('id, deal_key')

      if (error) {
        // Log detailed error for debugging
        console.error(`[SaveDeals] Batch ${batchNum} error:`, {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })

        // Try individual inserts if batch fails
        if (error.code === '23505' || error.message?.includes('duplicate')) {
          console.log(`[SaveDeals] Batch has duplicates, trying individual upserts...`)
          return await saveIndividualDeals(batch, result)
        }

        throw error
      }

      return data
    })

    if (savedBatch) {
      const savedCount = Array.isArray(savedBatch) ? savedBatch.length : 0
      result.inserted += savedCount

      if (Array.isArray(savedBatch)) {
        result.dealIds.push(...savedBatch.map(d => d.id))
      }

      console.log(`[SaveDeals] Batch ${batchNum} saved: ${savedCount} deals`)
    } else {
      result.errors += batch.length
      batch.forEach(deal => {
        result.errorDetails.push({
          deal: `${deal.destination} $${deal.price}`,
          error: 'Batch save failed after retries'
        })
      })
    }

    // Rate limiting delay (except for last batch)
    if (i + BATCH_SIZE < dbDeals.length) {
      await delay(RATE_LIMIT_DELAY)
    }
  }

  // Log final results
  console.log(`[SaveDeals] Completed for ${citySlug}:`, {
    total: deals.length,
    saved: result.inserted,
    updated: result.updated,
    errors: result.errors,
    successRate: `${Math.round((result.inserted / deals.length) * 100)}%`
  })

  if (result.errorDetails.length > 0) {
    console.log(`[SaveDeals] Error details (first 5):`, result.errorDetails.slice(0, 5))
  }

  return result
}

/**
 * Save deals individually when batch fails
 */
async function saveIndividualDeals(
  batch: any[],
  result: SaveDealsResult
): Promise<any[]> {
  const saved = []

  for (const deal of batch) {
    try {
      const { data, error } = await supabaseAdmin
        .from('flight_deals')
        .upsert(deal, {
          onConflict: 'deal_key',
          ignoreDuplicates: false
        })
        .select('id, deal_key')
        .single()

      if (error) {
        result.errors++
        result.errorDetails.push({
          deal: `${deal.destination} $${deal.price}`,
          error: error.message
        })
      } else if (data) {
        saved.push(data)
        result.inserted++
      }

      // Small delay between individual inserts
      await delay(50)
    } catch (error: any) {
      result.errors++
      result.errorDetails.push({
        deal: `${deal.destination} $${deal.price}`,
        error: error.message || 'Unknown error'
      })
    }
  }

  return saved
}

// ============================================
// NYC-SPECIFIC INTERNATIONAL FILTERS
// ============================================

export interface NYCFilterConfig {
  maxPriceEurope: number
  maxPriceAsia: number
  maxPriceLatam: number
  maxPriceCaribbean: number
  maxPriceDefault: number
  minFlightHours: number
  internationalOnly: boolean
  minDiscountPercent: number
}

const NYC_FILTER_DEFAULTS: NYCFilterConfig = {
  maxPriceEurope: 900,      // Increased from 800
  maxPriceAsia: 1100,       // Increased from 900
  maxPriceLatam: 600,       // Increased from 500
  maxPriceCaribbean: 600,   // Increased from 400
  maxPriceDefault: 700,     // New default for other international
  minFlightHours: 3,
  internationalOnly: true,
  minDiscountPercent: 20    // Reduced from 30%
}

// High-value international destinations that should always be included
const HIGH_VALUE_INTERNATIONAL = new Set([
  'Cancun', 'Cancún', 'Mexico City', 'Ciudad de México',
  'San José del Cabo', 'Cabo San Lucas', 'Puerto Vallarta',
  'Havana', 'La Habana', 'Santo Domingo', 'San Juan',
  'Punta Cana', 'Montego Bay', 'Nassau', 'Aruba',
  'Cartagena', 'Bogotá', 'Lima', 'Buenos Aires',
  'São Paulo', 'Rio de Janeiro', 'Santiago'
])

export interface FilterStats {
  totalDeals: number
  passedDomestic: number
  failedDomestic: number
  passedDistance: number
  failedDistance: number
  passedPrice: number
  failedPrice: number
  passedDiscount: number
  failedDiscount: number
  finalPassed: number
}

/**
 * Filter deals specifically for NYC with international focus
 * Now returns both filtered deals and detailed stats
 */
export function filterNYCDeals(
  deals: FlightDeal[],
  config: Partial<NYCFilterConfig> = {}
): { deals: FlightDeal[], stats: FilterStats } {
  const settings = { ...NYC_FILTER_DEFAULTS, ...config }

  const stats: FilterStats = {
    totalDeals: deals.length,
    passedDomestic: 0,
    failedDomestic: 0,
    passedDistance: 0,
    failedDistance: 0,
    passedPrice: 0,
    failedPrice: 0,
    passedDiscount: 0,
    failedDiscount: 0,
    finalPassed: 0
  }

  const filteredDeals = deals.filter(deal => {
    // FILTER 1: Skip domestic US destinations if international only
    // BUT include US territories as international (Puerto Rico, USVI)
    if (settings.internationalOnly) {
      const isUSTerritory = ['San Juan', 'Charlotte Amalie', 'Ponce'].includes(deal.destination)
      const isHighValueDest = HIGH_VALUE_INTERNATIONAL.has(deal.destination)

      if (deal.country === 'United States' && !isUSTerritory) {
        stats.failedDomestic++
        return false
      }

      // Always include high-value international destinations
      if (isHighValueDest) {
        stats.passedDomestic++
        // Continue to other filters
      } else if (deal.country !== 'United States' || isUSTerritory) {
        stats.passedDomestic++
      }
    }

    // FILTER 2: Check minimum flight duration (3 hours = 180 minutes)
    // But be more lenient for Caribbean/Mexico destinations
    const minMinutes = settings.minFlightHours * 60
    const isNearbyInternational = ['Mexico', 'Dominican Republic', 'Jamaica', 'Bahamas', 'Puerto Rico'].includes(deal.country)
    const adjustedMinMinutes = isNearbyInternational ? 150 : minMinutes // 2.5 hours for nearby international

    if (deal.durationMinutes < adjustedMinMinutes) {
      stats.failedDistance++
      return false
    }
    stats.passedDistance++

    // FILTER 3: Apply price limits based on region
    const regionPriceLimits: Record<string, number> = {
      'Europe': settings.maxPriceEurope,
      'Asia': settings.maxPriceAsia,
      'South America': settings.maxPriceLatam,
      'Central America': settings.maxPriceLatam,
      'Mexico': settings.maxPriceLatam,
      'Caribbean': settings.maxPriceCaribbean,
      'Africa': settings.maxPriceDefault,
      'Middle East': settings.maxPriceDefault,
      'Oceania': settings.maxPriceAsia
    }

    // Determine region from country
    const region = getRegionFromCountry(deal.country)
    const maxPrice = regionPriceLimits[region] || settings.maxPriceDefault

    if (deal.price > maxPrice) {
      stats.failedPrice++
      console.log(`  ❌ Price filter: ${deal.destination} $${deal.price} > $${maxPrice} (${region})`)
      return false
    }
    stats.passedPrice++

    // FILTER 4: Discount threshold (optional - only if we have historical price data)
    // For now, we'll skip this filter since we don't have historical data
    // In production, you'd compare against average historical prices
    stats.passedDiscount++ // Auto-pass for now

    stats.finalPassed++
    return true
  })

  return {
    deals: filteredDeals,
    stats
  }
}

/**
 * Get region from country name
 */
function getRegionFromCountry(country: string): string {
  const regionMap: Record<string, string> = {
    // Europe
    'United Kingdom': 'Europe',
    'France': 'Europe',
    'Spain': 'Europe',
    'Italy': 'Europe',
    'Germany': 'Europe',
    'Netherlands': 'Europe',
    'Greece': 'Europe',
    'Portugal': 'Europe',
    'Switzerland': 'Europe',
    'Iceland': 'Europe',
    'Ireland': 'Europe',
    'Denmark': 'Europe',
    'Sweden': 'Europe',
    'Norway': 'Europe',
    'Austria': 'Europe',
    'Belgium': 'Europe',
    'Czech Republic': 'Europe',
    'Hungary': 'Europe',
    'Poland': 'Europe',
    'Croatia': 'Europe',
    'Turkey': 'Europe',

    // Asia
    'Japan': 'Asia',
    'China': 'Asia',
    'South Korea': 'Asia',
    'Thailand': 'Asia',
    'Singapore': 'Asia',
    'Indonesia': 'Asia',
    'Vietnam': 'Asia',
    'Philippines': 'Asia',
    'Malaysia': 'Asia',
    'India': 'Asia',
    'United Arab Emirates': 'Asia',
    'Israel': 'Asia',

    // Americas
    'Mexico': 'Mexico',
    'Brazil': 'South America',
    'Argentina': 'South America',
    'Peru': 'South America',
    'Colombia': 'South America',
    'Chile': 'South America',
    'Ecuador': 'South America',
    'Costa Rica': 'Central America',
    'Panama': 'Central America',
    'Guatemala': 'Central America',

    // Caribbean
    'Jamaica': 'Caribbean',
    'Bahamas': 'Caribbean',
    'Dominican Republic': 'Caribbean',
    'Puerto Rico': 'Caribbean',
    'Aruba': 'Caribbean',
    'Cuba': 'Caribbean',
    'Barbados': 'Caribbean',
    'Cayman Islands': 'Caribbean',
  }

  return regionMap[country] || 'Other'
}

// ============================================
// LOGGING & MONITORING
// ============================================

export interface DealSyncLog {
  city: string
  timestamp: string
  attempted: number
  saved: number
  failed: number
  errors: string[]
  duration_ms: number
}

/**
 * Log deal sync results to database
 */
export async function logDealSync(log: DealSyncLog): Promise<void> {
  try {
    await supabaseAdmin
      .from('deal_sync_logs')
      .insert({
        city: log.city,
        timestamp: log.timestamp,
        attempted: log.attempted,
        saved: log.saved,
        failed: log.failed,
        errors: log.errors,
        duration_ms: log.duration_ms
      })
  } catch (error) {
    console.error('[Logging] Failed to save sync log:', error)
  }
}

// Export specific items from original supabase.ts that we need
// Note: We re-export supabaseAdmin from this file, not the original
export {
  createPublicClient,
  getSupabase,
  getCitiesWithActiveSubscribers,
  getActiveSubscribersForCity,
  cleanOldDeals,
  getDealsFromDb,
  getDealStats,
  saveCuratedDeals,
  type DbFlightDeal,
  type DbCuratedDeal,
  type DbSubscriber,
  type SubscriberInsert
} from './supabase'