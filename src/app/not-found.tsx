import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <>
      <Header />

      <main className="pt-16 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="text-6xl font-bold text-gray-200 mb-4">404</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. Let&apos;s get
              you back to finding cheap flights.
            </p>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
