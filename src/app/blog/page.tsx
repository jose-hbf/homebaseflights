import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getAllPosts, getFeaturedPost, getRecentPosts } from '@/lib/posts'
import { generateBlogListSchema } from '@/lib/schemas'
import { categoryLabels, PostCategory } from '@/types/blog'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Travel tips, flight deal strategies, and destination guides to help you travel more for less.',
  openGraph: {
    title: 'Blog | Homebase Flights',
    description: 'Travel tips, flight deal strategies, and destination guides to help you travel more for less.',
  },
}

const allCategories: PostCategory[] = ['how-to', 'timing', 'concepts', 'tools', 'destinations']

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogPage() {
  const allPosts = getAllPosts()
  const featuredPost = getFeaturedPost()
  const recentPosts = getRecentPosts(undefined, true)

  const jsonLd = generateBlogListSchema(allPosts)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main id="main-content" className="pt-16 min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="heading-display text-4xl md:text-5xl text-text-primary mb-4">
              Blog
            </h1>
            <p className="text-lg text-text-secondary mb-8">
              Tips and tricks to save big when traveling
            </p>
            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href="/blog"
                className="px-4 py-1.5 rounded-full text-sm font-medium bg-primary text-white transition-colors"
              >
                All
              </Link>
              {allCategories.map((cat) => (
                <Link
                  key={cat}
                  href={`/blog/category/${cat}`}
                  className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-text-secondary hover:bg-gray-200 transition-colors"
                >
                  {categoryLabels[cat]}
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <Link href={`/blog/${featuredPost.slug}`} className="block mb-16 group">
              <article className="relative overflow-hidden rounded-2xl bg-surface">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative aspect-[16/9] md:aspect-auto md:h-full min-h-[300px]">
                    <Image
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        Featured
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-text-secondary">
                        {categoryLabels[featuredPost.category]}
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl md:text-3xl font-semibold text-text-primary mb-4 group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-text-secondary mb-4 line-clamp-3">
                      {featuredPost.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-text-muted">
                      <span>{formatDate(featuredPost.date)}</span>
                      <span>•</span>
                      <span>{featuredPost.readingTime}</span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          )}

          {/* Posts Grid */}
          {recentPosts.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                  <article className="h-full">
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-text-secondary">
                        {categoryLabels[post.category]}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-text-muted mb-2">
                      <span>{formatDate(post.date)}</span>
                      <span>•</span>
                      <span>{post.readingTime}</span>
                    </div>
                    <p className="text-text-secondary text-sm line-clamp-2">
                      {post.description}
                    </p>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {allPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-secondary">No posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
