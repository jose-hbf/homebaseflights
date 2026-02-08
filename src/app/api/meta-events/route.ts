import { NextRequest, NextResponse } from 'next/server'
import { sendMetaEvent } from '@/lib/meta-capi'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventName, eventId, eventSourceUrl, email, customData } = body

    if (!eventName || !eventId || !eventSourceUrl) {
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

    // Send event to Meta CAPI (fire and forget - don't await in production)
    sendMetaEvent({
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
    }).catch((error) => {
      console.error('[Meta Events API] Failed to send event:', error)
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Meta Events API] Error processing request:', error)
    return NextResponse.json({ success: true }) // Still return 200 to not break UX
  }
}
