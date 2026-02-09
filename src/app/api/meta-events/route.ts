import { NextRequest, NextResponse } from 'next/server'
import { sendMetaEvent } from '@/lib/meta-capi'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventName, eventId, eventSourceUrl, email, customData } = body

    console.log('[Meta Events API] Received event:', { eventName, eventId, eventSourceUrl })

    if (!eventName || !eventId || !eventSourceUrl) {
      console.error('[Meta Events API] Missing required fields:', { eventName, eventId, eventSourceUrl })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Extract user data from request headers
    const forwardedFor = request.headers.get('x-forwarded-for')
    const clientIpAddress = forwardedFor?.split(',')[0]?.trim() || '0.0.0.0'
    const clientUserAgent = request.headers.get('user-agent') || ''

    // Extract Meta cookies from the request
    const cookies = request.cookies
    const fbc = cookies.get('_fbc')?.value
    const fbp = cookies.get('_fbp')?.value

    console.log('[Meta Events API] User data:', { clientIpAddress: clientIpAddress.substring(0, 10) + '...', fbc: !!fbc, fbp: !!fbp })

    // Send event to Meta CAPI - MUST await to ensure it completes before serverless function ends
    const result = await sendMetaEvent({
      eventName,
      eventId,
      eventSourceUrl,
      userData: {
        clientIpAddress,
        clientUserAgent,
        email,
        fbc,
        fbp,
      },
      customData,
    })

    console.log('[Meta Events API] CAPI result:', result)

    return NextResponse.json({ success: result.success, error: result.error })
  } catch (error) {
    console.error('[Meta Events API] Error processing request:', error)
    return NextResponse.json({ success: false, error: String(error) })
  }
}
