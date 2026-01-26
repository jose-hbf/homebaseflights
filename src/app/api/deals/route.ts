import { NextResponse } from 'next/server'
import { getSupportedAirports } from '@/lib/serpapi'
import { AIRPORT_INFO, SupportedAirport } from '@/types/flights'

export async function GET() {
  const airports = getSupportedAirports()

  // Group by city
  const byCity: Record<string, typeof AIRPORT_INFO[SupportedAirport][]> = {}

  for (const code of airports) {
    const info = AIRPORT_INFO[code as SupportedAirport]
    if (!byCity[info.city]) {
      byCity[info.city] = []
    }
    byCity[info.city].push(info)
  }

  return NextResponse.json({
    total: airports.length,
    airports: airports.map(code => AIRPORT_INFO[code as SupportedAirport]),
    byCity,
    usage: {
      endpoint: '/api/deals/[airport]',
      example: '/api/deals/JFK',
      queryParams: {
        maxPrice: 'Maximum price in USD (default: 200)',
        directOnly: 'Only show direct flights (default: false)',
        limit: 'Maximum number of deals (default: 10)',
      },
      exampleWithParams: '/api/deals/JFK?maxPrice=150&directOnly=true&limit=5',
    },
  })
}
