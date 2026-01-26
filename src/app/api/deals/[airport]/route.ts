import { NextRequest, NextResponse } from 'next/server'
import { getFlightDeals, isAirportSupported, getSupportedAirports } from '@/lib/serpapi'
import { filterDeals } from '@/utils/flightFilters'

interface RouteParams {
  params: Promise<{ airport: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { airport } = await params
  const airportCode = airport.toUpperCase()

  // Validate airport
  if (!isAirportSupported(airportCode)) {
    return NextResponse.json(
      {
        error: 'Unsupported airport code',
        message: `Airport "${airportCode}" is not supported`,
        supportedAirports: getSupportedAirports(),
      },
      { status: 400 }
    )
  }

  // Parse query parameters for filtering
  const searchParams = request.nextUrl.searchParams
  const maxPrice = searchParams.get('maxPrice')
  const directOnly = searchParams.get('directOnly')
  const limit = searchParams.get('limit')

  try {
    // Fetch deals from SerpApi
    const allDeals = await getFlightDeals(airportCode)

    // Apply filters
    const filteredDeals = filterDeals(allDeals, {
      maxPrice: maxPrice ? parseInt(maxPrice, 10) : 200,
      directOnly: directOnly === 'true',
      limit: limit ? parseInt(limit, 10) : 10,
    })

    return NextResponse.json({
      airport: airportCode,
      totalDeals: allDeals.length,
      filteredDeals: filteredDeals.length,
      filters: {
        maxPrice: maxPrice ? parseInt(maxPrice, 10) : 200,
        directOnly: directOnly === 'true',
        limit: limit ? parseInt(limit, 10) : 10,
      },
      deals: filteredDeals,
    })
  } catch (error) {
    console.error('Error fetching deals:', error)

    const message = error instanceof Error ? error.message : 'Failed to fetch deals'

    // Check for specific error types
    if (message.includes('SERPAPI_API_KEY')) {
      return NextResponse.json(
        { error: 'Configuration error', message: 'API key not configured' },
        { status: 500 }
      )
    }

    if (message.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Rate limited', message: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: 'Internal error', message },
      { status: 500 }
    )
  }
}
