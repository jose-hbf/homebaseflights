/**
 * Ads pages layout - optimized for LCP performance
 * Analytics scripts are inherited from root layout with lazyOnload strategy
 */
export default function AdsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
