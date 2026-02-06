import Link from 'next/link'

export function AdsFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-6 pb-20 md:pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm text-gray-500">
          <span>&copy; {new Date().getFullYear()} HomebaseFlights</span>
          <span className="hidden sm:inline">·</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-gray-700 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-gray-700 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
