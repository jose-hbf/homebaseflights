import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { ExpiredBadge } from './ExpiredBadge'
import type { DealCardData } from '@/types/deals'

interface DealArchiveCardProps {
  deal: DealCardData
  showOrigin?: boolean
}

export function DealArchiveCard({ deal, showOrigin = true }: DealArchiveCardProps) {
  const travelMonth = new Date(deal.travelDateStart).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })

  return (
    <Link href={`/deals/${deal.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 h-full">
        <div className="p-5">
          {/* Header: Destination + Expired Badge */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-serif text-xl font-semibold text-text-primary">
                {deal.destinationCity}
              </h3>
              <p className="text-text-muted text-sm">{deal.destinationCountry}</p>
            </div>
            <ExpiredBadge size="sm" />
          </div>

          {/* Route */}
          {showOrigin && (
            <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
              <span className="font-mono text-xs bg-surface-alt px-1.5 py-0.5 rounded">
                {deal.originAirportCode}
              </span>
              <span className="text-text-muted">→</span>
              <span className="font-mono text-xs bg-surface-alt px-1.5 py-0.5 rounded">
                {deal.destinationAirportCode}
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-serif text-2xl font-semibold text-text-primary">
              ${deal.price}
            </span>
            {deal.savingsPercent > 0 && (
              <span className="bg-success/10 text-success text-xs font-medium px-2 py-0.5 rounded-full">
                {deal.savingsPercent}% off
              </span>
            )}
          </div>

          {/* Details */}
          <div className="space-y-1 text-sm text-text-secondary">
            <div className="flex items-center gap-1.5">
              <span className="text-text-muted">✈</span>
              <span>
                {deal.airline} · {deal.stops === 0 ? 'Nonstop' : `${deal.stops} stop${deal.stops > 1 ? 's' : ''}`}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-text-muted">📅</span>
              <span>{travelMonth}</span>
            </div>
          </div>

          {/* AI Description preview */}
          {deal.aiDescription && (
            <p className="mt-3 text-sm text-text-muted line-clamp-2">
              {deal.aiDescription}
            </p>
          )}
        </div>
      </Card>
    </Link>
  )
}
