import { FlightDeal } from '@/types/flights'
import { City } from '@/data/cities'
import { callClaude, parseClaudeJSON, CURATION_MODEL } from './anthropic'
import { preFilterDeals, getScoreBreakdown } from './dealScoring'
import { getPriceThreshold, formatDuration, getTripDuration } from '@/utils/flightFilters'

/**
 * AI curation tier
 */
export type CurationTier = 'exceptional' | 'good' | 'notable'

/**
 * Result from AI curation for a single deal
 */
export interface CuratedDealResult {
  dealIndex: number
  tier: CurationTier
  description: string
}

/**
 * Full AI curation response
 */
export interface CurationResponse {
  selectedDeals: CuratedDealResult[]
  reasoning: string
}

/**
 * System prompt for deal curation
 */
const CURATION_SYSTEM_PROMPT = `You are the deal curator for Homebase Flights, a flight deal alert service. 
Your subscribers trust you to only send deals worth their attention. You must be selective but not silent.

Your job is to:
1. Identify truly EXCEPTIONAL deals (rare, must-book-now urgency)
2. Pick GOOD deals for daily digest (solid value, worth knowing)
3. Include NOTABLE deals as fallback (best available if nothing else qualifies)

Remember: Subscribers expect to hear from us regularly. An "okay" deal is better than silence.
Always aim to return at least 2-3 deals unless the data is truly garbage.`

/**
 * Build user message for curation request
 */
function buildCurationMessage(
  city: City,
  deals: Array<FlightDeal & { score: number }>
): string {
  const today = new Date()
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  
  // Format deals for AI
  const dealsText = deals.map((deal, index) => {
    const threshold = getPriceThreshold(deal.country)
    const discount = Math.round((1 - deal.price / threshold) * 100)
    const tripDays = getTripDuration(deal.departureDate, deal.returnDate)
    const breakdown = getScoreBreakdown(deal)
    
    return `${index + 1}. ${deal.departureAirport || city.primaryAirport} → ${deal.destination} (${deal.destinationCode})
   Country: ${deal.country}
   Price: $${deal.price} RT (${discount}% below typical $${threshold})
   Dates: ${deal.departureDate} to ${deal.returnDate} (${tripDays} days)
   Flight: ${deal.airline} | ${deal.stops === 0 ? 'Nonstop' : `${deal.stops} stop${deal.stops > 1 ? 's' : ''}`} | ${formatDuration(deal.durationMinutes)}
   Pre-score: ${deal.score}/100`
  }).join('\n\n')

  return `## City: ${city.name} (${city.primaryAirport})
## Region: ${city.region}
## Today: ${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}

## Top ${deals.length} Pre-Filtered Deals:

${dealsText}

---

## Instructions:
Select 2-5 deals to share with subscribers. For each selected deal, provide:

1. **tier**: 
   - "exceptional" = Rare price + popular destination + good timing. Instant alert worthy. (0-2 max)
   - "good" = Solid deal for daily digest. (2-3 typical)
   - "notable" = Best available if nothing else qualifies. Fallback option. (0-2)

2. **description**: One compelling sentence. Be specific and conversational.
   GOOD: "Tokyo during cherry blossom season for less than a domestic flight—nonstop on ANA."
   BAD: "Amazing deal to Tokyo! Book now!"

## Guidelines:
- A $400 nonstop to Paris in June > $350 to Paris with 2 stops in February
- Consider seasonality: cheap flights during peak season are MORE valuable
- Nonstop on good airline > budget carrier with long layovers
- If nothing is exceptional, still pick 2-3 good/notable deals
- We'd rather send something than nothing

## Response (JSON only):
{
  "selected_deals": [
    {
      "deal_index": 1,
      "tier": "exceptional",
      "description": "Your one-sentence description."
    }
  ],
  "reasoning": "2-3 sentences explaining your selections."
}`
}

/**
 * Validate and parse AI response
 */
function parseCurationResponse(response: string): CurationResponse {
  const parsed = parseClaudeJSON<{
    selected_deals?: Array<{
      deal_index: number
      tier: string
      description: string
    }>
    reasoning?: string
  }>(response)

  if (!parsed.selected_deals || !Array.isArray(parsed.selected_deals)) {
    throw new Error('Invalid response: missing selected_deals array')
  }

  const validTiers: CurationTier[] = ['exceptional', 'good', 'notable']
  
  const selectedDeals: CuratedDealResult[] = parsed.selected_deals.map((deal) => {
    if (typeof deal.deal_index !== 'number') {
      throw new Error('Invalid deal_index')
    }
    if (!validTiers.includes(deal.tier as CurationTier)) {
      throw new Error(`Invalid tier: ${deal.tier}`)
    }
    if (typeof deal.description !== 'string' || deal.description.length < 10) {
      throw new Error('Invalid or too short description')
    }

    return {
      dealIndex: deal.deal_index,
      tier: deal.tier as CurationTier,
      description: deal.description,
    }
  })

  return {
    selectedDeals,
    reasoning: parsed.reasoning || 'No reasoning provided',
  }
}

/**
 * Curate deals for a city using AI
 */
export async function curateDealsForCity(
  city: City,
  deals: FlightDeal[]
): Promise<{
  curatedDeals: Array<FlightDeal & { 
    score: number
    tier: CurationTier
    aiDescription: string 
  }>
  reasoning: string
  model: string
}> {
  // Pre-filter and score deals
  const preFiltered = preFilterDeals(deals, { maxDeals: 15, minScore: 50 })

  if (preFiltered.length === 0) {
    return {
      curatedDeals: [],
      reasoning: 'No deals passed pre-filtering (all below score threshold or filtered out)',
      model: CURATION_MODEL,
    }
  }

  // Build prompt
  const userMessage = buildCurationMessage(city, preFiltered)

  try {
    // Call Claude
    const response = await callClaude(CURATION_SYSTEM_PROMPT, userMessage, {
      maxTokens: 1024,
      temperature: 0.3,
    })

    // Parse response
    const curationResult = parseCurationResponse(response)

    // Map AI selections back to deals
    const curatedDeals = curationResult.selectedDeals
      .map((selection) => {
        // deal_index is 1-based in the prompt
        const deal = preFiltered[selection.dealIndex - 1]
        if (!deal) {
          console.warn(`Invalid deal_index ${selection.dealIndex} from AI`)
          return null
        }
        return {
          ...deal,
          tier: selection.tier,
          aiDescription: selection.description,
        }
      })
      .filter((d): d is NonNullable<typeof d> => d !== null)

    return {
      curatedDeals,
      reasoning: curationResult.reasoning,
      model: CURATION_MODEL,
    }
  } catch (error) {
    console.error(`AI curation failed for ${city.name}:`, error)
    
    // Fallback: return top 3 pre-filtered deals as "good" with generic descriptions
    const fallbackDeals = preFiltered.slice(0, 3).map((deal) => ({
      ...deal,
      tier: 'good' as CurationTier,
      aiDescription: `${deal.destination} for $${deal.price} round trip — ${deal.stops === 0 ? 'nonstop' : `${deal.stops} stop`} on ${deal.airline}.`,
    }))

    return {
      curatedDeals: fallbackDeals,
      reasoning: `AI curation failed, using fallback (top 3 by score). Error: ${error}`,
      model: 'fallback',
    }
  }
}

/**
 * Check if we should include notable deals (minimum presence rule)
 * Returns true if we need more deals to maintain subscriber engagement
 */
export function needsNotableDeals(
  curatedDeals: Array<{ tier: CurationTier }>,
  minDealsForDigest: number = 2
): boolean {
  const goodOrBetter = curatedDeals.filter(
    (d) => d.tier === 'exceptional' || d.tier === 'good'
  )
  return goodOrBetter.length < minDealsForDigest
}

/**
 * Get deals by tier
 */
export function getDealsByTier<T extends { tier: CurationTier }>(
  deals: T[],
  tier: CurationTier
): T[] {
  return deals.filter((d) => d.tier === tier)
}

/**
 * Get exceptional deals (for instant alerts)
 */
export function getExceptionalDeals<T extends { tier: CurationTier }>(deals: T[]): T[] {
  return getDealsByTier(deals, 'exceptional')
}

/**
 * Get digest-worthy deals (good + notable)
 */
export function getDigestDeals<T extends { tier: CurationTier }>(deals: T[]): T[] {
  return deals.filter((d) => d.tier === 'good' || d.tier === 'notable')
}
