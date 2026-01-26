'use client'

import { Card } from '@/components/ui/Card'
import { Deal } from '@/data/deals'
import { formatPrice, formatSavings } from '@/lib/utils'

interface DealCardProps {
  deal: Deal
  showOrigin?: boolean
}

export function DealCard({ deal, showOrigin = false }: DealCardProps) {
  const savingsPercent = Math.round((deal.savings / deal.normalPrice) * 100)

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-serif text-xl font-semibold text-text-primary">
              {deal.destinationCity}
            </h3>
            <p className="text-text-muted text-sm">{deal.destinationCountry}</p>
          </div>
          <div className="text-right">
            <div className="bg-success/10 text-success text-xs font-medium px-2.5 py-1 rounded-full">
              -{savingsPercent}%
            </div>
          </div>
        </div>

        {showOrigin && (
          <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
            <span className="font-medium">{deal.origin}</span>
            <span className="text-text-muted">&rarr;</span>
            <span className="font-medium">{deal.destination}</span>
          </div>
        )}

        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-serif text-3xl font-semibold text-primary">
            {formatPrice(deal.price)}
          </span>
          <span className="text-text-muted line-through text-sm">
            {formatPrice(deal.normalPrice)}
          </span>
        </div>

        <div className="space-y-1.5 text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <span className="text-text-muted">{deal.dates}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>
              {deal.airline} · {deal.stops === 0 ? 'Nonstop' : `${deal.stops} stop${deal.stops > 1 ? 's' : ''}`}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border">
          <p className="text-success font-medium text-sm">
            Save {formatSavings(deal.savings)}
          </p>
        </div>
      </div>
    </Card>
  )
}
