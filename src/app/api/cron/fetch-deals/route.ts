import { NextRequest, NextResponse } from 'next/server'
import { getFlightDeals } from '@/lib/serpapi'
import { saveFlightDeals, cleanOldDeals } from '@/lib/supabase'
import { SUPPORTED_AIRPORTS } from '@/types/flights'

// Vercel Cron job protection
const CRON_SECRET = process.env.CRON_SECRET

export async function GET(request: NextRequest) {
  // Verify cron secret (optional but recommended)
  const authHeader = request.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  console.log('[Cron] Starting fetch-deals job')

  const results: {
    airport: string
    totalDeals: number
    inserted: number
    errors: number
  }[] = []

  let totalInserted = 0
  let totalErrors = 0

  // Process airports in batches to avoid rate limiting
  const batchSize = 5
  const airports = [...SUPPORTED_AIRPORTS]

  for (let i = 0; i < airports.length; i += batchSize) {
    const batch = airports.slice(i, i + batchSize)

    // Process batch in parallel
    const batchResults = await Promise.allSettled(
      batch.map(async (airport) => {
        try {
          // Fetch from SerpApi
          const deals = await getFlightDeals(airport)

          if (deals.length === 0) {
            return { airport, totalDeals: 0, inserted: 0, errors: 0 }
          }

          // Save to Supabase
          const { inserted, errors } = await saveFlightDeals(airport, deals)

          return { airport, totalDeals: deals.length, inserted, errors }
        } catch (error) {
          console.error(`[Cron] Error processing ${airport}:`, error)
          return { airport, totalDeals: 0, inserted: 0, errors: 1 }
        }
      })
    )

    // Collect results
    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.push(result.value)
        totalInserted += result.value.inserted
        totalErrors += result.value.errors
      }
    }

    // Delay between batches to respect SerpApi rate limits
    if (i + batchSize < airports.length) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

  // Clean old deals
  const cleanedDeals = await cleanOldDeals()

  const duration = Date.now() - startTime
  console.log(`[Cron] Job completed in ${duration}ms: ${totalInserted} deals inserted, ${totalErrors} errors, ${cleanedDeals} old deals cleaned`)

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    durationMs: duration,
    summary: {
      airportsProcessed: results.length,
      totalDealsFound: results.reduce((sum, r) => sum + r.totalDeals, 0),
      totalInserted,
      totalErrors,
      oldDealsCleaned: cleanedDeals,
    },
    details: results,
  })
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}
