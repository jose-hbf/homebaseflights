import { FlightDeal } from '@/types/flights'
import { getPriceThreshold, getTripDuration } from '@/utils/flightFilters'

/**
 * Destination tiers based on traveler appeal
 * Tier 1 = Dream destinations, Tier 4 = Niche
 */
const DESTINATION_TIERS: Record<string, number> = {
  // Tier 1: Dream destinations (most appealing)
  'Japan': 1,
  'Italy': 1,
  'France': 1,
  'Greece': 1,
  'Spain': 1,
  'Thailand': 1,
  'Bali': 1,
  'Indonesia': 1,
  'Maldives': 1,
  'Australia': 1,
  'New Zealand': 1,
  'Iceland': 1,
  'Portugal': 1,
  'United Kingdom': 1,

  // Tier 2: Very popular
  'Netherlands': 2,
  'Germany': 2,
  'Switzerland': 2,
  'Austria': 2,
  'Ireland': 2,
  'Croatia': 2,
  'Vietnam': 2,
  'South Korea': 2,
  'Singapore': 2,
  'Peru': 2,
  'Costa Rica': 2,
  'Morocco': 2,
  'Czech Republic': 2,

  // Tier 3: Solid destinations
  'Mexico': 3,
  'Canada': 3,
  'Colombia': 3,
  'Brazil': 3,
  'Argentina': 3,
  'Chile': 3,
  'Belgium': 3,
  'Denmark': 3,
  'Sweden': 3,
  'Norway': 3,
  'Poland': 3,
  'Hungary': 3,
  'Philippines': 3,
  'Malaysia': 3,
  'India': 3,
  'United Arab Emirates': 3,
  'Israel': 3,
  'Turkey': 3,
  'Egypt': 3,
  'South Africa': 3,

  // Tier 4: Niche (default)
}

/**
 * Get destination tier (1-4, lower is better)
 */
export function getDestinationTier(country: string): number {
  return DESTINATION_TIERS[country] || 4
}

/**
 * Seasonality data - which months are peak for each destination
 * Returns a score modifier based on travel dates
 */
const PEAK_SEASONS: Record<string, number[]> = {
  // Cherry blossom / fall foliage
  'Japan': [3, 4, 10, 11],
  // Summer in Europe
  'France': [5, 6, 7, 8, 9],
  'Italy': [4, 5, 6, 9, 10],
  'Spain': [4, 5, 6, 9, 10],
  'Greece': [5, 6, 7, 8, 9],
  'Portugal': [4, 5, 6, 9, 10],
  'Croatia': [5, 6, 7, 8, 9],
  // Christmas markets
  'Germany': [6, 7, 8, 12],
  'Austria': [6, 7, 8, 12],
  'Switzerland': [6, 7, 8, 12],
  // Northern lights / winter
  'Iceland': [9, 10, 11, 12, 1, 2, 3, 6, 7, 8],
  // Dry season in SE Asia
  'Thailand': [11, 12, 1, 2, 3],
  'Vietnam': [11, 12, 1, 2, 3, 4],
  'Indonesia': [4, 5, 6, 7, 8, 9, 10],
  // Australia summer
  'Australia': [12, 1, 2],
  'New Zealand': [12, 1, 2],
  // Winter escape to Caribbean/Mexico
  'Mexico': [11, 12, 1, 2, 3, 4],
  // Peru dry season
  'Peru': [5, 6, 7, 8, 9],
}

/**
 * Check if travel dates fall in peak season for destination
 */
export function isInPeakSeason(country: string, departureDate: string): boolean {
  const peakMonths = PEAK_SEASONS[country]
  if (!peakMonths) return false
  
  const month = new Date(departureDate).getMonth() + 1 // 1-12
  return peakMonths.includes(month)
}

/**
 * Hard filters to eliminate non-deals before scoring
 */
export interface HardFilterResult {
  pass: boolean
  reason?: string
}

export function applyHardFilters(deal: FlightDeal): HardFilterResult {
  const threshold = getPriceThreshold(deal.country)
  
  // Must be below regional price threshold
  if (deal.price >= threshold) {
    return { pass: false, reason: `Price $${deal.price} >= threshold $${threshold}` }
  }
  
  // Reject excessively long flights (> 30 hours one way)
  if (deal.durationMinutes > 1800) {
    return { pass: false, reason: `Duration ${deal.durationMinutes}min too long` }
  }
  
  // Calculate trip length
  const tripDays = getTripDuration(deal.departureDate, deal.returnDate)
  
  // Reject very short trips (< 3 days)
  if (tripDays < 3) {
    return { pass: false, reason: `Trip too short: ${tripDays} days` }
  }
  
  // Reject very long trips (> 21 days) - usually error data
  if (tripDays > 21) {
    return { pass: false, reason: `Trip too long: ${tripDays} days` }
  }
  
  // Reject deals in the past
  const departureTimestamp = new Date(deal.departureDate).getTime()
  if (departureTimestamp < Date.now()) {
    return { pass: false, reason: 'Departure date in the past' }
  }
  
  return { pass: true }
}

/**
 * Compute a deal score (0-100) for ranking before AI curation
 * Higher score = better deal
 */
export function computeDealScore(deal: FlightDeal): number {
  const threshold = getPriceThreshold(deal.country)
  const priceRatio = deal.price / threshold
  
  let score = 50 // Base score
  
  // Price factor (40 points max) - lower ratio = better
  // priceRatio of 0.4 (60% off) = +40 points
  // priceRatio of 1.0 (at threshold) = +0 points
  const priceScore = Math.max(0, (1 - priceRatio) * 66.67) // Max 40 at 40% of threshold
  score += Math.min(40, priceScore)
  
  // Destination tier (15 points max)
  const tier = getDestinationTier(deal.country)
  const tierScore = (5 - tier) * 5 // Tier 1 = +20, Tier 4 = +5
  score += tierScore
  
  // Flight quality (10 points max)
  if (deal.stops === 0) {
    score += 10 // Nonstop bonus
  } else if (deal.stops === 1) {
    score += 5 // 1 stop is acceptable
  }
  // 2+ stops = no bonus
  
  // Trip length bonus (5 points max)
  const tripDays = getTripDuration(deal.departureDate, deal.returnDate)
  if (tripDays >= 7 && tripDays <= 14) {
    score += 5 // Sweet spot trip length
  } else if (tripDays >= 5 && tripDays <= 10) {
    score += 3
  }
  
  // Seasonality bonus (10 points)
  if (isInPeakSeason(deal.country, deal.departureDate)) {
    score += 10
  }
  
  return Math.round(Math.min(100, Math.max(0, score)))
}

/**
 * Pre-filter and score deals for AI curation
 * Returns top N deals sorted by score
 */
export function preFilterDeals(
  deals: FlightDeal[],
  options?: {
    maxDeals?: number
    minScore?: number
  }
): Array<FlightDeal & { score: number; filterReason?: string }> {
  const { maxDeals = 15, minScore = 55 } = options || {}
  
  const scoredDeals: Array<FlightDeal & { score: number; filterReason?: string }> = []
  
  for (const deal of deals) {
    // Apply hard filters first
    const filterResult = applyHardFilters(deal)
    
    if (!filterResult.pass) {
      // Skip deals that don't pass hard filters
      continue
    }
    
    // Compute score
    const score = computeDealScore(deal)
    
    // Only include if score meets minimum threshold
    if (score >= minScore) {
      scoredDeals.push({ ...deal, score })
    }
  }
  
  // Sort by score descending
  scoredDeals.sort((a, b) => b.score - a.score)
  
  // Return top N
  return scoredDeals.slice(0, maxDeals)
}

/**
 * Get score breakdown for debugging/logging
 */
export function getScoreBreakdown(deal: FlightDeal): {
  priceRatio: number
  priceScore: number
  destinationTier: number
  tierScore: number
  stopsScore: number
  tripLengthScore: number
  seasonalityScore: number
  totalScore: number
} {
  const threshold = getPriceThreshold(deal.country)
  const priceRatio = deal.price / threshold
  const priceScore = Math.min(40, Math.max(0, (1 - priceRatio) * 66.67))
  
  const destinationTier = getDestinationTier(deal.country)
  const tierScore = (5 - destinationTier) * 5
  
  const stopsScore = deal.stops === 0 ? 10 : deal.stops === 1 ? 5 : 0
  
  const tripDays = getTripDuration(deal.departureDate, deal.returnDate)
  const tripLengthScore = (tripDays >= 7 && tripDays <= 14) ? 5 : 
                          (tripDays >= 5 && tripDays <= 10) ? 3 : 0
  
  const seasonalityScore = isInPeakSeason(deal.country, deal.departureDate) ? 10 : 0
  
  const totalScore = 50 + priceScore + tierScore + stopsScore + tripLengthScore + seasonalityScore
  
  return {
    priceRatio: Math.round(priceRatio * 100) / 100,
    priceScore: Math.round(priceScore),
    destinationTier,
    tierScore,
    stopsScore,
    tripLengthScore,
    seasonalityScore,
    totalScore: Math.round(Math.min(100, totalScore)),
  }
}
