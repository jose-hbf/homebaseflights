import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { TableOfContents, BlogCTA, PostFAQ, MDXContent } from '@/components/blog'
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/posts'
import { generateArticleSchema, generateFAQSchema } from '@/lib/schemas'
import { categoryLabels } from '@/types/blog'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  const siteUrl = 'https://homebaseflights.com'

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.lastUpdated || post.date,
      authors: [post.author],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      url: `${siteUrl}/blog/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.image],
    },
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
  }
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(slug, 3)
  const articleSchema = generateArticleSchema(post)
  const faqSchema = post.faqs ? generateFAQSchema(post.faqs) : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <Header />
      <main id="main-content" className="pt-16 min-h-screen bg-white">
        <article className="container mx-auto px-4 py-12">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          {/* Header */}
          <header className="max-w-3xl mx-auto text-center mb-10">
            <Link
              href={`/blog/category/${post.category}`}
              className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-text-secondary hover:bg-gray-200 transition-colors mb-4"
            >
              {categoryLabels[post.category]}
            </Link>
            <h1 className="heading-display text-3xl md:text-4xl lg:text-5xl text-text-primary mb-6">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-text-muted">
              <span>{formatDate(post.date)}</span>
              <span>•</span>
              <span>{post.readingTime}</span>
              <span>•</span>
              <span>By {post.author}</span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative aspect-[21/9] max-w-5xl mx-auto rounded-2xl overflow-hidden mb-12">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content Layout */}
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[1fr_280px] gap-12">
              {/* Main Content */}
              <div className="min-w-0">
                <div className="max-w-3xl">
                  <MDXContent content={post.content} />

                  {/* Inline CTA */}
                  <BlogCTA variant="compact" />

                  {/* FAQ Section */}
                  {post.faqs && post.faqs.length > 0 && (
                    <PostFAQ faqs={post.faqs} />
                  )}

                  {/* Bottom CTA */}
                  <BlogCTA />

                  {/* Attribution */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-sm text-text-secondary italic">
                      Published by <strong className="text-text-primary not-italic">Homebase Flights</strong> — flight deal alerts from your home airport, not someone else&apos;s.{' '}
                      <Link href="/" className="text-primary hover:underline not-italic">
                        See deals from your city →
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="hidden lg:block">
                <div className="sticky top-24 space-y-8">
                  <TableOfContents headings={post.headings} />
                </div>
              </aside>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="max-w-5xl mx-auto mt-16 pt-12 border-t border-border">
              <h2 className="font-serif text-2xl font-semibold text-text-primary mb-8">
                Related Articles
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="group">
                    <article>
                      <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4">
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="font-serif text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
      <Footer />
    </>
  )
}
