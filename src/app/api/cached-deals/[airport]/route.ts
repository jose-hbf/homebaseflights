import { NextRequest, NextResponse } from 'next/server'
import { isAirportSupported, getSupportedAirports } from '@/lib/serpapi'
import { getDealsFromDb } from '@/lib/supabase'

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

  // Parse query parameters
  const searchParams = request.nextUrl.searchParams
  const maxPrice = searchParams.get('maxPrice')
  const directOnly = searchParams.get('directOnly')
  const limit = searchParams.get('limit')

  try {
    // Fetch deals from Supabase (cached data)
    const deals = await getDealsFromDb(airportCode, {
      maxPrice: maxPrice ? parseInt(maxPrice, 10) : 500,
      directOnly: directOnly === 'true',
      limit: limit ? parseInt(limit, 10) : 20,
    })

    return NextResponse.json({
      airport: airportCode,
      source: 'database',
      totalDeals: deals.length,
      filters: {
        maxPrice: maxPrice ? parseInt(maxPrice, 10) : 500,
        directOnly: directOnly === 'true',
        limit: limit ? parseInt(limit, 10) : 20,
      },
      deals,
    })
  } catch (error) {
    console.error('Error fetching cached deals:', error)

    return NextResponse.json(
      { error: 'Internal error', message: 'Failed to fetch cached deals' },
      { status: 500 }
    )
  }
}
