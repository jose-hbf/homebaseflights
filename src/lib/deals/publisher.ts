import { supabaseAdmin } from '@/lib/supabase'
import {
  generateDealSlug,
  generateMetaTitle,
  generateMetaDescription,
  DEFAULT_PUBLISHING_CONFIG,
  type PublishingConfig,
  type PublishedDeal,
  transformDbToPublishedDeal,
} from '@/types/deals'
import { AIRPORT_INFO, type SupportedAirport } from '@/types/flights'
import { getCityBySlug } from '@/data/cities'

/**
 * Get published deals with optional filters
 */
export async function getPublishedDeals(options?: {
  citySlug?: string
  limit?: number
  offset?: number
}): Promise<{ deals: PublishedDeal[]; total: number }> {
  let query = supabaseAdmin
    .from('published_deals')
    .select('*', { count: 'exact' })
    .order('published_at', { ascending: false })

  if (options?.citySlug) {
    query = query.eq('origin_city_slug', options.citySlug)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, count, error } = await query

  if (error) {
    console.error('Error fetching published deals:', error)
    return { deals: [], total: 0 }
  }

  return {
    deals: (data || []).map(transformDbToPublishedDeal),
    total: count || 0,
  }
}

/**
 * Get a single published deal by slug
 */
export async function getPublishedDealBySlug(slug: string): Promise<PublishedDeal | null> {
  const { data, error } = await supabaseAdmin
    .from('published_deals')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    return null
  }

  return transformDbToPublishedDeal(data)
}

/**
 * Get deal archive stats for FOMO display
 */
export async function getDealArchiveStats(citySlug?: string): Promise<{
  totalDealsFound: number
  totalDealsPublished: number
  averageSavingsPercent: number
}> {
  // For now, calculate from actual data
  // In production, you'd use the deal_archive_stats table

  // Total deals found (curated)
  let curatedQuery = supabaseAdmin
    .from('curated_deals')
    .select('*', { count: 'exact', head: true })
  
  if (citySlug) {
    curatedQuery = curatedQuery.eq('city_slug', citySlug)
  }
  
  const { count: totalFound } = await curatedQuery

  // Total published
  let publishedQuery = supabaseAdmin
    .from('published_deals')
    .select('*', { count: 'exact', head: true })
  
  if (citySlug) {
    publishedQuery = publishedQuery.eq('origin_city_slug', citySlug)
  }
  
  const { count: totalPublished } = await publishedQuery

  // Average savings
  let avgQuery = supabaseAdmin
    .from('published_deals')
    .select('savings_percent')
  
  if (citySlug) {
    avgQuery = avgQuery.eq('origin_city_slug', citySlug)
  }
  
  const { data: savingsData } = await avgQuery.limit(100)
  
  const avgSavings = savingsData && savingsData.length > 0
    ? Math.round(savingsData.reduce((acc, d) => acc + d.savings_percent, 0) / savingsData.length)
    : 45 // Default estimate

  return {
    totalDealsFound: totalFound || 0,
    totalDealsPublished: totalPublished || 0,
    averageSavingsPercent: avgSavings,
  }
}

/**
 * Mark expired deals and publish eligible ones
 * Run this daily via cron
 */
export async function processExpiredDeals(
  config: PublishingConfig = DEFAULT_PUBLISHING_CONFIG
): Promise<{
  markedExpired: number
  published: number
  errors: string[]
}> {
  const errors: string[] = []
  let markedExpired = 0
  let published = 0

  try {
    // 1. Mark deals as expired if travel date has passed
    const today = new Date().toISOString().split('T')[0]
    
    const { data: expiredDeals, error: expireError } = await supabaseAdmin
      .from('curated_deals')
      .update({ 
        status: 'expired', 
        expired_at: new Date().toISOString() 
      })
      .eq('status', 'active')
      .lt('flight_deals.departure_date', today)
      .select(`
        id,
        deal_id,
        city_slug,
        ai_tier,
        ai_description,
        curated_at,
        instant_alert_sent_at,
        flight_deals (
          id,
          departure_airport,
          city_slug,
          destination,
          destination_code,
          country,
          price,
          departure_date,
          return_date,
          airline,
          airline_code,
          duration_minutes,
          stops,
          fetched_at
        )
      `)

    if (expireError) {
      errors.push(`Error marking expired: ${expireError.message}`)
    } else {
      markedExpired = expiredDeals?.length || 0
    }

    // 2. Find deals expired >48h ago, not yet published
    const publishCutoff = new Date()
    publishCutoff.setHours(publishCutoff.getHours() - config.delayHours)

    const { data: readyToPublish, error: readyError } = await supabaseAdmin
      .from('curated_deals')
      .select(`
        id,
        deal_id,
        city_slug,
        ai_tier,
        ai_description,
        curated_at,
        instant_alert_sent_at,
        expired_at,
        flight_deals (
          id,
          departure_airport,
          city_slug,
          destination,
          destination_code,
          country,
          price,
          departure_date,
          return_date,
          airline,
          airline_code,
          duration_minutes,
          stops,
          fetched_at
        )
      `)
      .eq('status', 'expired')
      .lt('expired_at', publishCutoff.toISOString())
      .order('ai_tier', { ascending: true }) // exceptional first

    if (readyError) {
      errors.push(`Error fetching ready to publish: ${readyError.message}`)
      return { markedExpired, published, errors }
    }

    if (!readyToPublish || readyToPublish.length === 0) {
      return { markedExpired, published, errors }
    }

    // 3. Select top deals to publish based on config
    const toPublishCount = Math.max(
      config.minDealsPerCityPerWeek,
      Math.ceil(readyToPublish.length * (config.publishPercentage / 100))
    )

    const dealsToPublish = readyToPublish.slice(0, toPublishCount)

    // 4. Publish each deal
    for (const curatedDeal of dealsToPublish) {
      try {
        const flight = curatedDeal.flight_deals as any
        if (!flight) continue

        const city = getCityBySlug(curatedDeal.city_slug)
        const airportInfo = AIRPORT_INFO[flight.departure_airport as SupportedAirport]
        
        const price = flight.price
        const originalPrice = price * 2 // Estimated
        const savingsPercent = 50 // 50% since we're using price * 2

        const slug = generateDealSlug(
          curatedDeal.city_slug,
          flight.destination,
          price,
          'USD',
          flight.departure_date
        )

        // Check if already published
        const { data: existing } = await supabaseAdmin
          .from('published_deals')
          .select('id')
          .eq('slug', slug)
          .single()

        if (existing) {
          continue // Already published
        }

        // Calculate hours active
        const detectedAt = new Date(flight.fetched_at)
        const expiredAt = new Date(curatedDeal.expired_at)
        const hoursActive = Math.round((expiredAt.getTime() - detectedAt.getTime()) / (1000 * 60 * 60))

        // Create destination slug
        const destinationSlug = flight.destination
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')

        const publishedDeal = {
          curated_deal_id: curatedDeal.id,
          origin_city: city?.name || airportInfo?.city || 'Unknown',
          origin_city_slug: curatedDeal.city_slug,
          origin_airport_code: flight.departure_airport,
          origin_country: airportInfo?.country || 'Unknown',
          destination_city: flight.destination,
          destination_city_slug: destinationSlug,
          destination_airport_code: flight.destination_code,
          destination_country: flight.country,
          price,
          currency: 'USD',
          original_price: originalPrice,
          savings_percent: savingsPercent,
          airline: flight.airline,
          airline_code: flight.airline_code,
          stops: flight.stops,
          duration_minutes: flight.duration_minutes,
          travel_date_start: flight.departure_date,
          travel_date_end: flight.return_date,
          detected_at: flight.fetched_at,
          sent_to_subscribers_at: curatedDeal.instant_alert_sent_at,
          expired_at: curatedDeal.expired_at,
          slug,
          ai_description: curatedDeal.ai_description,
          hours_active: hoursActive > 0 ? hoursActive : null,
        }

        // Generate meta tags
        const tempDeal = transformDbToPublishedDeal({
          ...publishedDeal,
          id: '',
          published_at: new Date().toISOString(),
        })
        
        const metaTitle = generateMetaTitle(tempDeal)
        const metaDescription = generateMetaDescription(tempDeal)

        const { error: insertError } = await supabaseAdmin
          .from('published_deals')
          .insert({
            ...publishedDeal,
            meta_title: metaTitle,
            meta_description: metaDescription,
          })

        if (insertError) {
          errors.push(`Error publishing deal ${slug}: ${insertError.message}`)
        } else {
          // Mark as published
          await supabaseAdmin
            .from('curated_deals')
            .update({ 
              status: 'published',
              published_at: new Date().toISOString(),
            })
            .eq('id', curatedDeal.id)
          
          published++
        }
      } catch (e) {
        errors.push(`Error processing deal: ${e}`)
      }
    }

  } catch (e) {
    errors.push(`Unexpected error: ${e}`)
  }

  return { markedExpired, published, errors }
}

/**
 * Get cities with published deals for navigation
 */
export async function getCitiesWithDeals(): Promise<Array<{
  slug: string
  name: string
  dealCount: number
}>> {
  const { data, error } = await supabaseAdmin
    .from('published_deals')
    .select('origin_city_slug, origin_city')

  if (error || !data) {
    return []
  }

  // Count deals per city
  const cityCounts = data.reduce((acc, deal) => {
    const slug = deal.origin_city_slug
    if (!acc[slug]) {
      acc[slug] = { slug, name: deal.origin_city, count: 0 }
    }
    acc[slug].count++
    return acc
  }, {} as Record<string, { slug: string; name: string; count: number }>)

  return Object.values(cityCounts)
    .sort((a, b) => b.count - a.count)
    .map((c) => ({ slug: c.slug, name: c.name, dealCount: c.count }))
}
