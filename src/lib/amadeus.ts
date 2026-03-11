/**
 * Amadeus API integration for flight deals
 * Replacement for SerpApi with better international coverage
 */

import { FlightDeal } from '@/types/flights'

const AMADEUS_AUTH_URL = 'https://test.api.amadeus.com/v1/security/oauth2/token'
const AMADEUS_BASE_URL = 'https://test.api.amadeus.com'

// Cache for access token
let cachedToken: string | null = null
let tokenExpiry: Date | null = null

/**
 * Get OAuth2 access token from Amadeus
 * Caches token until expiry
 */
async function getAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && tokenExpiry && tokenExpiry > new Date()) {
    return cachedToken
  }

  const apiKey = process.env.AMADEUS_API_KEY
  const apiSecret = process.env.AMADEUS_API_SECRET

  if (!apiKey || !apiSecret) {
    throw new Error('Amadeus API credentials not set in environment variables')
  }

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: apiKey,
    client_secret: apiSecret
  })

  try {
    const response = await fetch(AMADEUS_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Amadeus auth failed: ${error}`)
    }

    const data = await response.json()

    // Cache the token (Amadeus tokens expire in 30 minutes)
    cachedToken = data.access_token
    tokenExpiry = new Date(Date.now() + 25 * 60 * 1000) // Refresh 5 minutes before expiry

    console.log('[Amadeus] Authentication successful, token cached')
    return data.access_token
  } catch (error) {
    console.error('[Amadeus] Authentication error:', error)
    throw error
  }
}

/**
 * Transform Amadeus destination to our FlightDeal format
 */
function transformAmadeusToFlightDeal(
  destination: any,
  departureAirport: string
): FlightDeal | null {
  try {
    // Skip if no price information
    if (!destination.price || !destination.price.total) {
      return null
    }

    // Parse the destination IATA code from the destination field
    const destinationCode = destination.destination || 'UNK'

    // Get destination name and country from the data
    // Amadeus provides limited metadata, so we'll enhance this with a mapping
    const { name, country } = getDestinationInfo(destinationCode)

    // Generate future dates if not provided
    const today = new Date()
    const futureDate = new Date(today.setMonth(today.getMonth() + 3))
    const returnDate = new Date(futureDate)
    returnDate.setDate(returnDate.getDate() + 7)

    return {
      destination: name,
      destinationCode: destinationCode,
      country: country,
      price: parseFloat(destination.price.total),
      departureDate: destination.departureDate || futureDate.toISOString().split('T')[0],
      returnDate: destination.returnDate || returnDate.toISOString().split('T')[0],
      airline: 'Multiple', // Amadeus doesn't provide airline in this endpoint
      airlineCode: 'MX',
      durationMinutes: 0, // Not provided by this endpoint
      stops: -1, // Unknown
      bookingLink: generateBookingLink(
        departureAirport,
        destinationCode,
        destination.departureDate || futureDate.toISOString().split('T')[0],
        destination.returnDate || returnDate.toISOString().split('T')[0]
      ),
      thumbnail: undefined,
      departureAirport: departureAirport
    }
  } catch (error) {
    console.error('[Amadeus] Error transforming destination:', error)
    return null
  }
}

/**
 * Generate Google Flights booking link
 */
function generateBookingLink(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate: string
): string {
  const query = `Flights from ${origin} to ${destination} on ${departureDate} through ${returnDate}`
  return `https://www.google.com/travel/flights?hl=en&q=${encodeURIComponent(query)}`
}

/**
 * Get destination name and country from IATA code
 * This is a simplified mapping - in production, use a complete IATA database
 */
function getDestinationInfo(iataCode: string): { name: string; country: string } {
  const destinations: Record<string, { name: string; country: string }> = {
    // Europe
    'LON': { name: 'London', country: 'United Kingdom' },
    'LHR': { name: 'London', country: 'United Kingdom' },
    'LGW': { name: 'London', country: 'United Kingdom' },
    'PAR': { name: 'Paris', country: 'France' },
    'CDG': { name: 'Paris', country: 'France' },
    'ORY': { name: 'Paris', country: 'France' },
    'ROM': { name: 'Rome', country: 'Italy' },
    'FCO': { name: 'Rome', country: 'Italy' },
    'MAD': { name: 'Madrid', country: 'Spain' },
    'BCN': { name: 'Barcelona', country: 'Spain' },
    'AMS': { name: 'Amsterdam', country: 'Netherlands' },
    'FRA': { name: 'Frankfurt', country: 'Germany' },
    'MUC': { name: 'Munich', country: 'Germany' },
    'BER': { name: 'Berlin', country: 'Germany' },
    'VIE': { name: 'Vienna', country: 'Austria' },
    'ZRH': { name: 'Zurich', country: 'Switzerland' },
    'LIS': { name: 'Lisbon', country: 'Portugal' },
    'OPO': { name: 'Porto', country: 'Portugal' },
    'ATH': { name: 'Athens', country: 'Greece' },
    'DUB': { name: 'Dublin', country: 'Ireland' },
    'CPH': { name: 'Copenhagen', country: 'Denmark' },
    'STO': { name: 'Stockholm', country: 'Sweden' },
    'ARN': { name: 'Stockholm', country: 'Sweden' },
    'OSL': { name: 'Oslo', country: 'Norway' },
    'HEL': { name: 'Helsinki', country: 'Finland' },
    'PRG': { name: 'Prague', country: 'Czech Republic' },
    'BUD': { name: 'Budapest', country: 'Hungary' },
    'WAW': { name: 'Warsaw', country: 'Poland' },

    // Asia
    'TYO': { name: 'Tokyo', country: 'Japan' },
    'NRT': { name: 'Tokyo', country: 'Japan' },
    'HND': { name: 'Tokyo', country: 'Japan' },
    'BKK': { name: 'Bangkok', country: 'Thailand' },
    'SIN': { name: 'Singapore', country: 'Singapore' },
    'HKG': { name: 'Hong Kong', country: 'China' },
    'SEL': { name: 'Seoul', country: 'South Korea' },
    'ICN': { name: 'Seoul', country: 'South Korea' },
    'PEK': { name: 'Beijing', country: 'China' },
    'SHA': { name: 'Shanghai', country: 'China' },
    'PVG': { name: 'Shanghai', country: 'China' },
    'DEL': { name: 'Delhi', country: 'India' },
    'BOM': { name: 'Mumbai', country: 'India' },
    'DXB': { name: 'Dubai', country: 'United Arab Emirates' },
    'DOH': { name: 'Doha', country: 'Qatar' },
    'TLV': { name: 'Tel Aviv', country: 'Israel' },
    'TPE': { name: 'Taipei', country: 'Taiwan' },
    'MNL': { name: 'Manila', country: 'Philippines' },
    'KUL': { name: 'Kuala Lumpur', country: 'Malaysia' },
    'DPS': { name: 'Bali', country: 'Indonesia' },
    'CGK': { name: 'Jakarta', country: 'Indonesia' },

    // South America
    'GRU': { name: 'São Paulo', country: 'Brazil' },
    'GIG': { name: 'Rio de Janeiro', country: 'Brazil' },
    'EZE': { name: 'Buenos Aires', country: 'Argentina' },
    'SCL': { name: 'Santiago', country: 'Chile' },
    'LIM': { name: 'Lima', country: 'Peru' },
    'BOG': { name: 'Bogotá', country: 'Colombia' },
    'UIO': { name: 'Quito', country: 'Ecuador' },
    'CCS': { name: 'Caracas', country: 'Venezuela' },
    'MVD': { name: 'Montevideo', country: 'Uruguay' },

    // North & Central America
    'MEX': { name: 'Mexico City', country: 'Mexico' },
    'CUN': { name: 'Cancun', country: 'Mexico' },
    'SJD': { name: 'San José del Cabo', country: 'Mexico' },
    'PVR': { name: 'Puerto Vallarta', country: 'Mexico' },
    'GDL': { name: 'Guadalajara', country: 'Mexico' },
    'YYZ': { name: 'Toronto', country: 'Canada' },
    'YUL': { name: 'Montreal', country: 'Canada' },
    'YVR': { name: 'Vancouver', country: 'Canada' },
    'YYC': { name: 'Calgary', country: 'Canada' },
    'GUA': { name: 'Guatemala City', country: 'Guatemala' },
    'PTY': { name: 'Panama City', country: 'Panama' },
    'SJO': { name: 'San José', country: 'Costa Rica' },

    // Caribbean
    'HAV': { name: 'Havana', country: 'Cuba' },
    'SDQ': { name: 'Santo Domingo', country: 'Dominican Republic' },
    'SJU': { name: 'San Juan', country: 'Puerto Rico' },
    'MBJ': { name: 'Montego Bay', country: 'Jamaica' },
    'NAS': { name: 'Nassau', country: 'Bahamas' },
    'BGI': { name: 'Bridgetown', country: 'Barbados' },
    'POS': { name: 'Port of Spain', country: 'Trinidad and Tobago' },
    'AUA': { name: 'Aruba', country: 'Aruba' },
    'CUR': { name: 'Willemstad', country: 'Curaçao' },

    // Africa
    'JNB': { name: 'Johannesburg', country: 'South Africa' },
    'CPT': { name: 'Cape Town', country: 'South Africa' },
    'CAI': { name: 'Cairo', country: 'Egypt' },
    'CMN': { name: 'Casablanca', country: 'Morocco' },
    'NBO': { name: 'Nairobi', country: 'Kenya' },
    'ACC': { name: 'Accra', country: 'Ghana' },
    'LOS': { name: 'Lagos', country: 'Nigeria' },
    'ADD': { name: 'Addis Ababa', country: 'Ethiopia' },

    // Oceania
    'SYD': { name: 'Sydney', country: 'Australia' },
    'MEL': { name: 'Melbourne', country: 'Australia' },
    'BNE': { name: 'Brisbane', country: 'Australia' },
    'PER': { name: 'Perth', country: 'Australia' },
    'AKL': { name: 'Auckland', country: 'New Zealand' },
    'CHC': { name: 'Christchurch', country: 'New Zealand' },
    'WLG': { name: 'Wellington', country: 'New Zealand' },
  }

  return destinations[iataCode] || { name: iataCode, country: 'Unknown' }
}

/**
 * Fetch flight deals from Amadeus for a given departure airport
 * Replacement for getFlightDeals from serpapi.ts
 *
 * @param airportCode - IATA airport code (e.g., 'JFK')
 * @returns Array of flight deals
 */
export async function getFlightDeals(airportCode: string): Promise<FlightDeal[]> {
  try {
    console.log(`[Amadeus] Fetching deals from ${airportCode}...`)

    // Get access token
    const token = await getAccessToken()

    // Use Flight Inspiration Search endpoint
    const params = new URLSearchParams({
      origin: airportCode,
      maxPrice: '900',
      currency: 'USD',
      oneWay: 'false',
      nonStop: 'false',
      viewBy: 'DESTINATION'
    })

    const url = `${AMADEUS_BASE_URL}/v1/shopping/flight-destinations?${params.toString()}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()

      // If Flight Inspiration fails, try fallback approach
      if (response.status === 500 || response.status === 404) {
        console.log(`[Amadeus] Flight Inspiration failed, using fallback...`)
        return await getFlightDealsFallback(airportCode, token)
      }

      throw new Error(`Amadeus API error: ${JSON.stringify(error.errors || error)}`)
    }

    const data = await response.json()

    if (!data.data || data.data.length === 0) {
      console.log(`[Amadeus] No deals found from ${airportCode}`)
      return []
    }

    // Transform Amadeus data to our FlightDeal format
    const deals = data.data
      .map((dest: any) => transformAmadeusToFlightDeal(dest, airportCode))
      .filter((deal): deal is FlightDeal => deal !== null)

    console.log(`[Amadeus] Found ${deals.length} deals from ${airportCode}`)

    return deals
  } catch (error) {
    console.error(`[Amadeus] Error fetching deals from ${airportCode}:`, error)
    throw error
  }
}

/**
 * Fallback approach: Query specific popular destinations
 * Used when Flight Inspiration Search fails
 */
async function getFlightDealsFallback(
  airportCode: string,
  token: string
): Promise<FlightDeal[]> {
  console.log(`[Amadeus] Using fallback approach for ${airportCode}`)

  // Key international destinations to check
  const destinations = [
    // Europe
    'LON', 'PAR', 'ROM', 'MAD', 'BCN', 'AMS', 'FRA', 'LIS', 'ATH', 'DUB',
    // Asia
    'TYO', 'BKK', 'SIN', 'HKG', 'DXB', 'DEL',
    // Americas
    'MEX', 'CUN', 'GRU', 'EZE', 'LIM', 'BOG',
    // Africa & Oceania
    'CAI', 'CPT', 'SYD'
  ]

  const deals: FlightDeal[] = []
  const futureDate = new Date()
  futureDate.setMonth(futureDate.getMonth() + 3)
  const departureDate = futureDate.toISOString().split('T')[0]

  // Query each destination (limit to avoid rate limits)
  for (const dest of destinations.slice(0, 15)) {
    try {
      const params = new URLSearchParams({
        originLocationCode: airportCode,
        destinationLocationCode: dest,
        departureDate: departureDate,
        adults: '1',
        max: '1',
        currencyCode: 'USD'
      })

      const url = `${AMADEUS_BASE_URL}/v2/shopping/flight-offers?${params.toString()}`

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.data && data.data.length > 0) {
          const offer = data.data[0]
          const price = parseFloat(offer.price.total)

          // Only include if under $900
          if (price <= 900) {
            const destInfo = getDestinationInfo(dest)
            deals.push({
              destination: destInfo.name,
              destinationCode: dest,
              country: destInfo.country,
              price: price,
              departureDate: departureDate,
              returnDate: departureDate, // Will be updated
              airline: offer.validatingAirlineCodes?.[0] || 'Multiple',
              airlineCode: offer.validatingAirlineCodes?.[0] || 'MX',
              durationMinutes: calculateDuration(offer),
              stops: countStops(offer),
              bookingLink: generateBookingLink(airportCode, dest, departureDate, departureDate),
              thumbnail: undefined,
              departureAirport: airportCode
            })
          }
        }
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200))
    } catch (error) {
      console.error(`[Amadeus] Error fetching ${airportCode}-${dest}:`, error)
    }
  }

  console.log(`[Amadeus] Fallback found ${deals.length} deals from ${airportCode}`)
  return deals
}

/**
 * Calculate total duration from flight offer
 */
function calculateDuration(offer: any): number {
  try {
    if (offer.itineraries && offer.itineraries[0]) {
      const duration = offer.itineraries[0].duration
      // Parse ISO 8601 duration (e.g., PT14H30M)
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
      if (match) {
        const hours = parseInt(match[1] || '0')
        const minutes = parseInt(match[2] || '0')
        return hours * 60 + minutes
      }
    }
  } catch (error) {
    console.error('[Amadeus] Error calculating duration:', error)
  }
  return 0
}

/**
 * Count stops from flight offer
 */
function countStops(offer: any): number {
  try {
    if (offer.itineraries && offer.itineraries[0]) {
      return offer.itineraries[0].segments.length - 1
    }
  } catch (error) {
    console.error('[Amadeus] Error counting stops:', error)
  }
  return -1
}

/**
 * Test function to verify Amadeus is working
 */
export async function testAmadeusConnection(): Promise<boolean> {
  try {
    const token = await getAccessToken()
    return !!token
  } catch (error) {
    console.error('[Amadeus] Connection test failed:', error)
    return false
  }
}