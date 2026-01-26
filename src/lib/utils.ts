export function formatPrice(price: number): string {
  return `$${price.toLocaleString()}`
}

export function formatSavings(savings: number): string {
  return `$${savings.toLocaleString()}`
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
