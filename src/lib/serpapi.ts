import {
  FlightDeal,
  SerpApiResponse,
  SerpApiDestination,
  SUPPORTED_AIRPORTS,
  SupportedAirport,
} from '@/types/flights'

const SERPAPI_BASE_URL = 'https://serpapi.com/search.json'

/**
 * Transform raw SerpApi destination to our FlightDeal format
 */
function transformDestination(dest: SerpApiDestination): FlightDeal | null {
  // Skip destinations without flight price
  if (dest.flight_price === undefined || dest.flight_price === null) {
    return null
  }

  return {
    destination: dest.name,
    destinationCode: dest.destination_airport.code,
    country: dest.country,
    price: dest.flight_price,
    departureDate: dest.start_date,
    returnDate: dest.end_date,
    airline: dest.airline,
    airlineCode: dest.airline_code,
    durationMinutes: dest.flight_duration,
    stops: dest.number_of_stops,
    bookingLink: dest.link,
    thumbnail: dest.thumbnail,
  }
}

/**
 * Fetch flight deals from SerpApi for a given departure airport
 *
 * @param airportCode - IATA airport code (e.g., 'JFK')
 * @returns Array of flight deals
 */
export async function getFlightDeals(airportCode: string): Promise<FlightDeal[]> {
  const apiKey = process.env.SERPAPI_API_KEY

  if (!apiKey) {
    throw new Error('SERPAPI_API_KEY environment variable is not set')
  }

  // Validate airport code
  const upperCode = airportCode.toUpperCase()
  if (!SUPPORTED_AIRPORTS.includes(upperCode as SupportedAirport)) {
    throw new Error(`Unsupported airport code: ${airportCode}. Supported: ${SUPPORTED_AIRPORTS.join(', ')}`)
  }

  const params = new URLSearchParams({
    engine: 'google_travel_explore',
    departure_id: upperCode,
    currency: 'USD',
    hl: 'en',
    gl: 'us',
    api_key: apiKey,
  })

  const url = `${SERPAPI_BASE_URL}?${params.toString()}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Cache for 1 hour - deals don't change that frequently
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      // Handle rate limiting
      if (response.status === 429) {
        throw new Error('SerpApi rate limit exceeded. Please try again later.')
      }
      throw new Error(`SerpApi request failed with status ${response.status}`)
    }

    const data: SerpApiResponse = await response.json()

    if (data.error) {
      throw new Error(`SerpApi error: ${data.error}`)
    }

    if (!data.destinations || data.destinations.length === 0) {
      return []
    }

    // Transform and filter out invalid destinations
    const deals = data.destinations
      .map(transformDestination)
      .filter((deal): deal is FlightDeal => deal !== null)

    return deals
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to fetch flight deals from SerpApi')
  }
}

/**
 * Fetch flight deals for multiple airports in parallel
 *
 * @param airportCodes - Array of IATA airport codes
 * @returns Map of airport code to deals
 */
export async function getFlightDealsForMultipleAirports(
  airportCodes: string[]
): Promise<Map<string, FlightDeal[]>> {
  const results = new Map<string, FlightDeal[]>()

  // Process in batches of 5 to avoid rate limiting
  const batchSize = 5
  for (let i = 0; i < airportCodes.length; i += batchSize) {
    const batch = airportCodes.slice(i, i + batchSize)

    const batchResults = await Promise.allSettled(
      batch.map(async (code) => ({
        code,
        deals: await getFlightDeals(code),
      }))
    )

    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.set(result.value.code, result.value.deals)
      } else {
        console.error(`Failed to fetch deals for airport:`, result.reason)
        results.set(batch[batchResults.indexOf(result)], [])
      }
    }

    // Add delay between batches to respect rate limits
    if (i + batchSize < airportCodes.length) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  return results
}

/**
 * Check if an airport is supported
 */
export function isAirportSupported(code: string): boolean {
  return SUPPORTED_AIRPORTS.includes(code.toUpperCase() as SupportedAirport)
}

/**
 * Get all supported airport codes
 */
export function getSupportedAirports(): readonly string[] {
  return SUPPORTED_AIRPORTS
}
