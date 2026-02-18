'use client'

import Link from 'next/link'

interface BlogPost {
  slug: string
  title: string
  description: string
  category: string
}

// Static list of blog posts for city pages (avoids server/client hydration issues)
// These are the most relevant posts for travelers looking for cheap flights
const relevantPosts: BlogPost[] = [
  {
    slug: 'best-time-to-book-flights',
    title: 'When to Book Flights: Real Data',
    description: 'The Tuesday myth is wrong. See the actual best booking windows for domestic and international flights.',
    category: 'timing',
  },
  {
    slug: 'how-to-find-cheap-flights',
    title: 'How to Find Cheap Flights: 2026 Guide',
    description: 'Proven strategies to find cheap flights. The complete guide to saving on airfare.',
    category: 'how-to',
  },
  {
    slug: 'google-flights-tips',
    title: 'Google Flights Tips & Tricks',
    description: 'Hidden features most travelers miss. Flexible dates, price tracking, and more.',
    category: 'tools',
  },
]

interface RelatedBlogPostsProps {
  cityName: string
  className?: string
}

export function RelatedBlogPosts({ cityName, className = '' }: RelatedBlogPostsProps) {
  return (
    <section className={`py-12 bg-surface ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-sm uppercase tracking-widest text-text-muted mb-2">
              Travel Tips
            </p>
            <h3 className="font-serif text-2xl md:text-3xl font-semibold text-text-primary">
              Save More on Flights from {cityName}
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {relevantPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block p-6 bg-white rounded-xl border border-border-subtle hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full mb-3">
                  {post.category}
                </span>
                <h4 className="font-serif text-lg font-semibold text-text-primary group-hover:text-primary transition-colors mb-2 line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-sm text-text-secondary line-clamp-2">
                  {post.description}
                </p>
                <span className="inline-flex items-center text-sm text-primary font-medium mt-3 group-hover:gap-2 transition-all">
                  Read more
                  <svg
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
