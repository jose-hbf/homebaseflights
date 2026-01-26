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
 * Check if a deal is a "great deal" based on price thresholds
 */
export function isDealGreat(deal: FlightDeal): boolean {
  // Consider deals under $100 as "great"
  return deal.price < 100
}

/**
 * Get deal quality label
 */
export function getDealQuality(deal: FlightDeal): 'incredible' | 'great' | 'good' | 'normal' {
  if (deal.price < 50) return 'incredible'
  if (deal.price < 100) return 'great'
  if (deal.price < 150) return 'good'
  return 'normal'
}
