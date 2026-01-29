export function formatPrice(price: number): string {
  return `$${price.toLocaleString()}`
}

export function formatSavings(savings: number): string {
  return `$${savings.toLocaleString()}`
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Returns yesterday's date formatted as "January 28, 2026"
 * This makes the site appear always fresh/active
 */
export function getYesterdayFormatted(): string {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  
  return yesterday.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}
