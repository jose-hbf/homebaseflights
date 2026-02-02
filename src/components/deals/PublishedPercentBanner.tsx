interface PublishedPercentBannerProps {
  totalDealsFound: number
  totalDealsPublished: number
  cityName?: string
  period?: string
}

export function PublishedPercentBanner({
  totalDealsFound,
  totalDealsPublished,
  cityName,
  period = 'this month',
}: PublishedPercentBannerProps) {
  const publishedPercent = totalDealsFound > 0 
    ? Math.round((totalDealsPublished / totalDealsFound) * 100)
    : 0
  
  const unpublishedCount = totalDealsFound - totalDealsPublished

  return (
    <div className="bg-surface-alt border border-border rounded-xl p-5">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
          <span className="text-lg">📊</span>
        </div>
        <div>
          <p className="text-text-primary font-medium">
            We only publish <span className="text-success font-semibold">{publishedPercent || '~10'}%</span> of the deals we find
          </p>
          <p className="text-text-secondary text-sm mt-1">
            {cityName ? (
              <>
                Subscribers from {cityName} have received{' '}
                <span className="font-medium">{totalDealsFound} alerts</span> {period}.
                {unpublishedCount > 0 && (
                  <> Here you see only <span className="font-medium">{totalDealsPublished}</span>.</>
                )}
              </>
            ) : (
              <>
                We've found <span className="font-medium">{totalDealsFound} deals</span> {period}.
                {unpublishedCount > 0 && (
                  <> Only <span className="font-medium">{totalDealsPublished}</span> are shown here.</>
                )}
              </>
            )}
          </p>
          <p className="text-primary text-sm font-medium mt-2">
            Want to see the other {unpublishedCount > 0 ? unpublishedCount : '90%'}? →
          </p>
        </div>
      </div>
    </div>
  )
}
