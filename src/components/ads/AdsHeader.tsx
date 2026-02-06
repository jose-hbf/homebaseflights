import Link from 'next/link'
import Image from 'next/image'

export function AdsHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-14">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-header.svg"
              alt="Homebase Flights"
              width={160}
              height={28}
              priority
              className="h-6 w-auto"
            />
          </Link>
        </div>
      </div>
    </header>
  )
}
