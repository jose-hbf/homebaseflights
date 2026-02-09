import Link from 'next/link'
import Image from 'next/image'

export function AdsHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-16">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-header.svg"
              alt="Homebase Flights"
              width={180}
              height={30}
              priority
              className="h-7 w-auto"
            />
          </Link>
        </div>
      </div>
    </header>
  )
}
