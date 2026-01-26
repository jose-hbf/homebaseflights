import { AirportSelector } from '@/components/AirportSelector'

interface BlogCTAProps {
  variant?: 'default' | 'compact'
}

export function BlogCTA({ variant = 'default' }: BlogCTAProps) {
  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-6 my-8">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-serif text-xl font-semibold text-white mb-1">
              Get deals from your airport
            </h3>
            <p className="text-white/80 text-sm">
              $59/year · 7-day free trial · Cancel anytime
            </p>
          </div>
          <div className="w-full md:w-72">
            <AirportSelector placeholder="Your airport" className="text-sm" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 rounded-2xl p-8 md:p-12 my-12 text-center">
      <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white mb-4">
        Never miss a flight deal again
      </h2>
      <p className="text-white/90 mb-8 max-w-xl mx-auto">
        Get incredible flight deals from your home airport delivered to your inbox.
        Members save an average of $500+ per trip.
      </p>
      <div className="max-w-md mx-auto mb-6">
        <AirportSelector placeholder="Where do you fly from?" />
      </div>
      <p className="text-white/70 text-sm">
        $59/year after 7-day free trial · Cancel anytime · Money-back guarantee
      </p>
    </div>
  )
}
