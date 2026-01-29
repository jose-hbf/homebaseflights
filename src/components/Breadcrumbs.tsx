import Link from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-sm ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1">
        {/* Home is always first */}
        <li className="flex items-center">
          <Link
            href="/"
            className="text-text-muted hover:text-primary transition-colors"
          >
            Home
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <svg
              className="w-4 h-4 text-text-muted mx-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            {item.href ? (
              <Link
                href={item.href}
                className="text-text-muted hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-text-primary font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/**
 * Generate breadcrumb schema for JSON-LD
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  const siteUrl = 'https://homebaseflights.com'
  
  const listItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: siteUrl,
    },
    ...items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 2,
      name: item.label,
      ...(item.href ? { item: `${siteUrl}${item.href}` } : {}),
    })),
  ]

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: listItems,
  }
}
