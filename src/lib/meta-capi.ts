import crypto from 'crypto'

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
const ACCESS_TOKEN = process.env.META_CONVERSIONS_API_TOKEN
const API_VERSION = 'v21.0'

interface UserData {
  clientIpAddress: string
  clientUserAgent: string
  email?: string
  fbc?: string
  fbp?: string
}

interface CustomData {
  currency?: string
  value?: number
  city?: string
  [key: string]: string | number | undefined
}

interface SendMetaEventParams {
  eventName: string
  eventId: string
  eventSourceUrl: string
  userData: UserData
  customData?: CustomData
}

function hashSHA256(value: string): string {
  return crypto
    .createHash('sha256')
    .update(value.toLowerCase().trim())
    .digest('hex')
}

function buildUserData(userData: UserData): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  if (userData.clientIpAddress) {
    result.client_ip_address = userData.clientIpAddress
  }

  if (userData.clientUserAgent) {
    result.client_user_agent = userData.clientUserAgent
  }

  if (userData.email) {
    result.em = [hashSHA256(userData.email)]
  }

  if (userData.fbc) {
    result.fbc = userData.fbc
  }

  if (userData.fbp) {
    result.fbp = userData.fbp
  }

  return result
}

function buildCustomData(customData?: CustomData): Record<string, unknown> | undefined {
  if (!customData) return undefined

  const result: Record<string, unknown> = {}

  Object.entries(customData).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      result[key] = value
    }
  })

  return Object.keys(result).length > 0 ? result : undefined
}

export async function sendMetaEvent({
  eventName,
  eventId,
  eventSourceUrl,
  userData,
  customData,
}: SendMetaEventParams): Promise<{ success: boolean; error?: string }> {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.warn('[Meta CAPI] Missing PIXEL_ID or ACCESS_TOKEN')
    return { success: false, error: 'Missing configuration' }
  }

  const eventTime = Math.floor(Date.now() / 1000)

  const eventData: Record<string, unknown> = {
    event_name: eventName,
    event_time: eventTime,
    event_id: eventId,
    action_source: 'website',
    event_source_url: eventSourceUrl,
    user_data: buildUserData(userData),
  }

  const builtCustomData = buildCustomData(customData)
  if (builtCustomData) {
    eventData.custom_data = builtCustomData
  }

  const payload = {
    data: [eventData],
    access_token: ACCESS_TOKEN,
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('[Meta CAPI] Error response:', errorData)
      return { success: false, error: `HTTP ${response.status}` }
    }

    const result = await response.json()
    console.log('[Meta CAPI] Event sent successfully:', eventName, result)
    return { success: true }
  } catch (error) {
    console.error('[Meta CAPI] Failed to send event:', error)
    return { success: false, error: String(error) }
  }
}

// Server-side only function for Purchase events (called from Stripe webhook)
export async function trackPurchaseServer({
  email,
  currency = 'USD',
  value,
  city,
  eventSourceUrl,
  clientIpAddress,
  clientUserAgent,
  fbc,
  fbp,
}: {
  email: string
  currency?: string
  value: number
  city?: string
  eventSourceUrl: string
  clientIpAddress: string
  clientUserAgent: string
  fbc?: string
  fbp?: string
}): Promise<{ success: boolean; error?: string }> {
  const eventId = crypto.randomUUID()

  return sendMetaEvent({
    eventName: 'Purchase',
    eventId,
    eventSourceUrl,
    userData: {
      clientIpAddress,
      clientUserAgent,
      email,
      fbc,
      fbp,
    },
    customData: {
      currency,
      value,
      city,
    },
  })
}
