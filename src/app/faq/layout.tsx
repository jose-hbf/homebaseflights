import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ - Cheap Flight Deals Questions Answered',
  description: 'Frequently asked questions about Homebase Flights. Learn about pricing, how deals work, booking process, and our money-back guarantee.',
  openGraph: {
    title: 'FAQ - Homebase Flights',
    description: 'Frequently asked questions about Homebase Flights. Learn about pricing, how deals work, and our money-back guarantee.',
  },
}

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
