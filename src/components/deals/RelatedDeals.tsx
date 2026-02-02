import { DealArchiveCard } from './DealArchiveCard'
import type { DealCardData } from '@/types/deals'

interface RelatedDealsProps {
  deals: DealCardData[]
  title?: string
  cityName?: string
  currentDealSlug?: string
}

export function RelatedDeals({
  deals,
  title,
  cityName,
  currentDealSlug,
}: RelatedDealsProps) {
  // Filter out current deal if provided
  const filteredDeals = currentDealSlug
    ? deals.filter((d) => d.slug !== currentDealSlug)
    : deals

  if (filteredDeals.length === 0) {
    return null
  }

  const displayTitle = title || (cityName
    ? `Other deals we've found from ${cityName}`
    : 'More expired deals')

  return (
    <section>
      <h2 className="font-serif text-2xl font-semibold text-text-primary mb-6">
        {displayTitle}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDeals.slice(0, 6).map((deal) => (
          <DealArchiveCard key={deal.slug} deal={deal} showOrigin={false} />
        ))}
      </div>
    </section>
  )
}
