import { ImageResponse } from 'next/og'
import { getPublishedDealBySlug } from '@/lib/deals/publisher'
import { getCityBySlug } from '@/data/cities'

export const runtime = 'edge'
export const alt = 'Flight Deal - Homebase Flights'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = params

  // Check if it's a city page
  const city = getCityBySlug(slug)
  if (city) {
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #FFF4F0 0%, #FFE5DC 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <div
              style={{
                fontSize: 32,
                color: '#6B6B6B',
                textTransform: 'uppercase',
                letterSpacing: 4,
              }}
            >
              Flight Deals From
            </div>
            <div
              style={{
                fontSize: 72,
                fontWeight: 700,
                color: '#1F2937',
              }}
            >
              {city.name}
            </div>
            <div
              style={{
                fontSize: 24,
                color: '#6B6B6B',
                marginTop: 20,
              }}
            >
              Browse expired deals • Subscribe for real-time alerts
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              fontSize: 20,
              color: '#8E8E8E',
            }}
          >
            homebaseflights.com
          </div>
        </div>
      ),
      { ...size }
    )
  }

  // It's a deal page
  const deal = await getPublishedDealBySlug(slug)
  
  if (!deal) {
    // Default fallback
    return new ImageResponse(
      (
        <div
          style={{
            background: '#1F2937',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div style={{ color: 'white', fontSize: 48 }}>
            Homebase Flights
          </div>
        </div>
      ),
      { ...size }
    )
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 60,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Expired Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.8)',
              padding: '8px 16px',
              borderRadius: 20,
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            ⏰ EXPIRED DEAL
          </div>
        </div>

        {/* Route */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 64, fontWeight: 700, color: 'white' }}>
            {deal.originCity}
          </div>
          <div style={{ fontSize: 48, color: 'rgba(255,255,255,0.5)' }}>→</div>
          <div style={{ fontSize: 64, fontWeight: 700, color: 'white' }}>
            {deal.destinationCity}
          </div>
        </div>

        {/* Price */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 20,
            marginBottom: 30,
          }}
        >
          <div style={{ fontSize: 96, fontWeight: 700, color: '#5A8F6B' }}>
            ${deal.price}
          </div>
          <div
            style={{
              fontSize: 36,
              color: 'rgba(255,255,255,0.5)',
              textDecoration: 'line-through',
            }}
          >
            ${deal.originalPrice}
          </div>
          <div
            style={{
              background: '#5A8F6B',
              color: 'white',
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            {deal.savingsPercent}% OFF
          </div>
        </div>

        {/* Details */}
        <div
          style={{
            display: 'flex',
            gap: 30,
            color: 'rgba(255,255,255,0.7)',
            fontSize: 24,
          }}
        >
          <div>{deal.airline}</div>
          <div>•</div>
          <div>{deal.stops === 0 ? 'Nonstop' : `${deal.stops} stop${deal.stops > 1 ? 's' : ''}`}</div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 60,
            right: 60,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 20 }}>
            homebaseflights.com
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18 }}>
            Subscribe to catch the next deal
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
