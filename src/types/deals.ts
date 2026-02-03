// Types for the Deal Archive feature

export interface PublishedDeal {
  id: string
  curatedDealId?: string
  
  // Origin
  originCity: string
  originCitySlug: string
  originAirportCode: string
  originCountry: string
  
  // Destination
  destinationCity: string
  destinationCitySlug: string
  destinationAirportCode: string
  destinationCountry: string
  
  // Pricing
  price: number
  currency: string
  originalPrice: number
  savingsPercent: number
  
  // Flight details
  airline: string
  airlineCode?: string
  stops: number
  durationMinutes?: number
  
  // Travel dates
  travelDateStart: string
  travelDateEnd: string
  
  // Lifecycle
  detectedAt: string
  sentToSubscribersAt?: string
  expiredAt: string
  publishedAt: string
  
  // SEO
  slug: string
  metaTitle?: string
  metaDescription?: string
  
  // Content
  aiDescription?: string
  dealHighlights?: string[]
  
  // FOMO stats
  hoursActive?: number
}

export interface DealArchiveStats {
  citySlug?: string
  period: 'daily' | 'weekly' | 'monthly' | 'all_time'
  
  totalDealsFound: number
  totalDealsPublished: number
  totalDealsSent: number
  
  averageSavingsPercent: number
  totalSavingsAmount: number
  
  totalSubscribers?: number
  
  periodStart?: string
  periodEnd?: string
}

// For displaying in the archive
export interface DealCardData {
  slug: string
  originCity: string
  originCitySlug: string
  originAirportCode: string
  destinationCity: string
  destinationAirportCode: string
  destinationCountry: string
  price: number
  currency: string
  savingsPercent: number
  airline: string
  stops: number
  travelDateStart: string
  travelDateEnd: string
  publishedAt: string
  aiDescription?: string
}

// Publishing configuration
export interface PublishingConfig {
  delayHours: number          // Hours after expiration before publishing (default: 48)
  publishPercentage: number   // % of deals to publish (default: 10)
  minDealsPerCityPerWeek: number // Minimum deals to publish per city per week
  priorityBy: 'savingsPercent' | 'price' | 'random'
}

export const DEFAULT_PUBLISHING_CONFIG: PublishingConfig = {
  delayHours: 48,
  publishPercentage: 10,
  minDealsPerCityPerWeek: 1,
  priorityBy: 'savingsPercent',
}

// Helper to generate deal slug
export function generateDealSlug(
  originCitySlug: string,
  destinationCity: string,
  price: number,
  currency: string,
  travelDateStart: string
): string {
  const destinationSlug = destinationCity
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  
  const date = new Date(travelDateStart)
  const month = date.toLocaleString('en-US', { month: 'long' }).toLowerCase()
  const year = date.getFullYear()
  
  return `${originCitySlug}-to-${destinationSlug}-${price}-${currency.toLowerCase()}-${month}-${year}`
}

// Helper to generate meta title (max 60 chars)
export function generateMetaTitle(deal: PublishedDeal): string {
  const route = `${deal.originCity} → ${deal.destinationCity}`
  const price = `$${deal.price}`
  return `Flights ${route} for ${price}`.slice(0, 60)
}

// Helper to generate meta description (max 155 chars)
export function generateMetaDescription(deal: PublishedDeal): string {
  return `Expired deal: Flights from ${deal.originCity} to ${deal.destinationCity} for $${deal.price} (${deal.savingsPercent}% savings). Subscribe to catch the next one.`.slice(0, 155)
}

// Transform database row to PublishedDeal
export function transformDbToPublishedDeal(row: any): PublishedDeal {
  return {
    id: row.id,
    curatedDealId: row.curated_deal_id,
    originCity: row.origin_city,
    originCitySlug: row.origin_city_slug,
    originAirportCode: row.origin_airport_code,
    originCountry: row.origin_country,
    destinationCity: row.destination_city,
    destinationCitySlug: row.destination_city_slug,
    destinationAirportCode: row.destination_airport_code,
    destinationCountry: row.destination_country,
    price: row.price,
    currency: row.currency || 'USD',
    originalPrice: row.original_price,
    savingsPercent: row.savings_percent,
    airline: row.airline,
    airlineCode: row.airline_code,
    stops: row.stops,
    durationMinutes: row.duration_minutes,
    travelDateStart: row.travel_date_start,
    travelDateEnd: row.travel_date_end,
    detectedAt: row.detected_at,
    sentToSubscribersAt: row.sent_to_subscribers_at,
    expiredAt: row.expired_at,
    publishedAt: row.published_at,
    slug: row.slug,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    aiDescription: row.ai_description,
    dealHighlights: row.deal_highlights,
    hoursActive: row.hours_active,
  }
}

// Transform PublishedDeal to DealCardData
export function toDealCardData(deal: PublishedDeal): DealCardData {
  return {
    slug: deal.slug,
    originCity: deal.originCity,
    originCitySlug: deal.originCitySlug,
    originAirportCode: deal.originAirportCode,
    destinationCity: deal.destinationCity,
    destinationAirportCode: deal.destinationAirportCode,
    destinationCountry: deal.destinationCountry,
    price: deal.price,
    currency: deal.currency,
    savingsPercent: deal.savingsPercent,
    airline: deal.airline,
    stops: deal.stops,
    travelDateStart: deal.travelDateStart,
    travelDateEnd: deal.travelDateEnd,
    publishedAt: deal.publishedAt,
    aiDescription: deal.aiDescription,
  }
}
