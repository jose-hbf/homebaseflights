interface ExpiredBadgeProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ExpiredBadge({ className = '', size = 'md' }: ExpiredBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        bg-text-muted/10 text-text-muted
        font-medium rounded-full
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      EXPIRED
    </span>
  )
}
