import { FlightDeal, FlightFilterOptions } from '@/types/flights'

/**
 * Default filter options
 */
const DEFAULT_OPTIONS: Required<FlightFilterOptions> = {
  maxPrice: 200,
  directOnly: false,
  limit: 10,
  minDuration: 0,
  maxDuration: Infinity,
  excludeCountries: [],
  includeCountries: [],
}

/**
 * Filter and sort flight deals based on options
 *
 * @param deals - Array of flight deals to filter
 * @param options - Filter options
 * @returns Filtered and sorted deals
 */
export function filterDeals(
  deals: FlightDeal[],
  options: FlightFilterOptions = {}
): FlightDeal[] {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  let filtered = deals.filter((deal) => {
    // Price filter
    if (deal.price > opts.maxPrice) {
      return false
    }

    // Direct only filter
    if (opts.directOnly && deal.stops > 0) {
      return false
    }

    // Duration filters
    if (deal.durationMinutes < opts.minDuration) {
      return false
    }
    if (deal.durationMinutes > opts.maxDuration) {
      return false
    }

    // Country exclusion
    if (opts.excludeCountries.length > 0) {
      const lowerCountry = deal.country.toLowerCase()
      if (opts.excludeCountries.some(c => c.toLowerCase() === lowerCountry)) {
        return false
      }
    }

    // Country inclusion (if specified, only include these)
    if (opts.includeCountries.length > 0) {
      const lowerCountry = deal.country.toLowerCase()
      if (!opts.includeCountries.some(c => c.toLowerCase() === lowerCountry)) {
        return false
      }
    }

    return true
  })

  // Sort by price ascending
  filtered.sort((a, b) => a.price - b.price)

  // Limit results
  if (opts.limit > 0) {
    filtered = filtered.slice(0, opts.limit)
  }

  return filtered
}

/**
 * Get the cheapest deal from a list
 */
export function getCheapestDeal(deals: FlightDeal[]): FlightDeal | null {
  if (deals.length === 0) return null
  return deals.reduce((min, deal) => deal.price < min.price ? deal : min)
}

/**
 * Get deals grouped by country
 */
export function groupDealsByCountry(deals: FlightDeal[]): Record<string, FlightDeal[]> {
  return deals.reduce((acc, deal) => {
    if (!acc[deal.country]) {
      acc[deal.country] = []
    }
    acc[deal.country].push(deal)
    return acc
  }, {} as Record<string, FlightDeal[]>)
}

/**
 * Get deals grouped by airline
 */
export function groupDealsByAirline(deals: FlightDeal[]): Record<string, FlightDeal[]> {
  return deals.reduce((acc, deal) => {
    if (!acc[deal.airline]) {
      acc[deal.airline] = []
    }
    acc[deal.airline].push(deal)
    return acc
  }, {} as Record<string, FlightDeal[]>)
}

/**
 * Get unique destinations from deals
 */
export function getUniqueDestinations(deals: FlightDeal[]): string[] {
  return [...new Set(deals.map(d => d.destination))]
}

/**
 * Format duration in minutes to human readable string
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) {
    return `${mins}m`
  }
  if (mins === 0) {
    return `${hours}h`
  }
  return `${hours}h ${mins}m`
}

/**
 * Format date string to human readable format
 */
export function formatFlightDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Calculate trip duration in days
 */
export function getTripDuration(departureDate: string, returnDate: string): number {
  const start = new Date(departureDate)
  const end = new Date(returnDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Price thresholds by region/country for determining deal quality
 * These represent "good deal" thresholds - prices below these are considered good
 */
const PRICE_THRESHOLDS: Record<string, number> = {
  // Domestic US
  'United States': 150,

  // North America
  'Canada': 200,
  'Mexico': 250,

  // Caribbean & Central America
  'Puerto Rico': 200,
  'Dominican Republic': 300,
  'Jamaica': 350,
  'Bahamas': 300,
  'Cuba': 350,
  'Costa Rica': 350,
  'Panama': 350,
  'Guatemala': 300,
  'Belize': 350,

  // South America
  'Colombia': 350,
  'Peru': 450,
  'Brazil': 500,
  'Argentina': 550,
  'Chile': 550,
  'Ecuador': 400,

  // Europe
  'United Kingdom': 400,
  'France': 400,
  'Spain': 400,
  'Italy': 400,
  'Germany': 400,
  'Portugal': 400,
  'Netherlands': 400,
  'Ireland': 400,
  'Greece': 450,
  'Iceland': 350,

  // Asia
  'Japan': 600,
  'South Korea': 600,
  'China': 550,
  'Thailand': 550,
  'Vietnam': 550,
  'Philippines': 550,
  'Singapore': 600,
  'Hong Kong': 600,
  'Taiwan': 600,
  'Indonesia': 600,
  'India': 550,

  // Middle East
  'United Arab Emirates': 550,
  'Israel': 500,
  'Turkey': 450,
  'Qatar': 550,

  // Oceania
  'Australia': 700,
  'New Zealand': 750,
  'Fiji': 650,

  // Africa
  'Morocco': 450,
  'South Africa': 650,
  'Egypt': 500,
}

// Default threshold for countries not in the list
const DEFAULT_THRESHOLD = 400

/**
 * Get the price threshold for a specific country
 */
export function getPriceThreshold(country: string): number {
  return PRICE_THRESHOLDS[country] || DEFAULT_THRESHOLD
}

/**
 * Check if a deal is considered "good" based on destination region
 */
export function isDealGood(deal: FlightDeal): boolean {
  const threshold = getPriceThreshold(deal.country)
  return deal.price < threshold
}

/**
 * Check if a deal is a "great deal" (significantly below threshold)
 */
export function isDealGreat(deal: FlightDeal): boolean {
  const threshold = getPriceThreshold(deal.country)
  // Great = more than 40% below threshold
  return deal.price < threshold * 0.6
}

/**
 * Check if a deal is "incredible" (way below threshold)
 */
export function isDealIncredible(deal: FlightDeal): boolean {
  const threshold = getPriceThreshold(deal.country)
  // Incredible = more than 60% below threshold
  return deal.price < threshold * 0.4
}

/**
 * Get deal quality label based on destination region
 */
export type DealQuality = 'incredible' | 'great' | 'good' | 'normal'

export function getDealQuality(deal: FlightDeal): DealQuality {
  const threshold = getPriceThreshold(deal.country)
  const ratio = deal.price / threshold

  if (ratio < 0.4) return 'incredible'  // < 40% of threshold
  if (ratio < 0.6) return 'great'       // < 60% of threshold
  if (ratio < 1.0) return 'good'        // < 100% of threshold
  return 'normal'
}

/**
 * Get discount percentage compared to threshold
 */
export function getDealDiscount(deal: FlightDeal): number {
  const threshold = getPriceThreshold(deal.country)
  if (deal.price >= threshold) return 0
  return Math.round((1 - deal.price / threshold) * 100)
}

/**
 * Filter only good deals (below regional threshold)
 */
export function filterGoodDeals(deals: FlightDeal[]): FlightDeal[] {
  return deals.filter(isDealGood)
}

/**
 * Sort deals by quality (best deals first)
 */
export function sortByDealQuality(deals: FlightDeal[]): FlightDeal[] {
  return [...deals].sort((a, b) => {
    const ratioA = a.price / getPriceThreshold(a.country)
    const ratioB = b.price / getPriceThreshold(b.country)
    return ratioA - ratioB
  })
}
