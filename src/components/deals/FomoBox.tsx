interface FomoBoxProps {
  sentAt: string
  hoursActive?: number
  cityName: string
}

export function FomoBox({ sentAt, hoursActive, cityName }: FomoBoxProps) {
  const sentDate = new Date(sentAt)
  const formattedDate = sentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const formattedTime = sentDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <div className="bg-accent-warm border border-accent-peach rounded-xl p-5">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold text-text-primary mb-1">
            Subscribers knew first
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            This alert was sent on <span className="font-medium">{formattedDate}</span> at{' '}
            <span className="font-medium">{formattedTime}</span>.
            {hoursActive && (
              <>
                {' '}The deal was available for approximately{' '}
                <span className="font-medium">{hoursActive} hours</span>.
              </>
            )}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-accent-peach">
        <p className="text-text-secondary text-sm">
          <span className="font-medium text-primary">Missed it?</span> Homebase Flights subscribers
          from {cityName} get these deals delivered to their inbox in real-time.
        </p>
      </div>
    </div>
  )
}
