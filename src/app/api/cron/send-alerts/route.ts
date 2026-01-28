import { NextRequest, NextResponse } from 'next/server'
import { sendAllAlerts, sendAlertsForAirport } from '@/lib/dealAlerts'

const CRON_SECRET = process.env.CRON_SECRET

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Optional: send to specific airport only
  const searchParams = request.nextUrl.searchParams
  const airport = searchParams.get('airport')

  const startTime = Date.now()
  console.log('[Cron] Starting send-alerts job')

  try {
    let result

    if (airport) {
      // Send to specific airport
      const stats = await sendAlertsForAirport(airport.toUpperCase())
      result = {
        airports: [{ code: airport.toUpperCase(), ...stats }],
        totals: stats,
      }
    } else {
      // Send to all airports
      result = await sendAllAlerts()
    }

    const duration = Date.now() - startTime
    console.log(
      `[Cron] send-alerts completed in ${duration}ms:`,
      `${result.totals.sent} sent, ${result.totals.failed} failed, ${result.totals.skipped} skipped`
    )

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      durationMs: duration,
      ...result,
    })
  } catch (error) {
    console.error('[Cron] send-alerts error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}
