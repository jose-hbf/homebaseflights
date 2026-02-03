import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getPostsByCategory, getAllCategories } from '@/lib/posts'
import { generateCategorySchema } from '@/lib/schemas'
import { PostCategory, categoryLabels, categoryDescriptions, categoryMetaTitles, categoryMetaDescriptions } from '@/types/blog'

interface PageProps {
  params: Promise<{ category: string }>
}

const validCategories: PostCategory[] = ['how-to', 'timing', 'concepts', 'tools', 'destinations']

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params

  if (!validCategories.includes(category as PostCategory)) {
    return { title: 'Category Not Found' }
  }

  const cat = category as PostCategory
  const siteUrl = 'https://homebaseflights.com'

  return {
    title: categoryMetaTitles[cat],
    description: categoryMetaDescriptions[cat],
    openGraph: {
      title: categoryMetaTitles[cat],
      description: categoryMetaDescriptions[cat],
      url: `${siteUrl}/blog/category/${category}`,
    },
    alternates: {
      canonical: `${siteUrl}/blog/category/${category}`,
    },
  }
}

export async function generateStaticParams() {
  return validCategories.map((category) => ({
    category,
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

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params

  if (!validCategories.includes(category as PostCategory)) {
    notFound()
  }

  const cat = category as PostCategory
  const posts = getPostsByCategory(cat)
  const categorySchema = generateCategorySchema(cat, posts)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
      />
      <Header />
      <main id="main-content" className="pt-16 min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-text-muted">
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>/</li>
              <li className="text-text-primary">{categoryLabels[cat]}</li>
            </ol>
          </nav>

          {/* Title */}
          <div className="mb-12">
            <h1 className="heading-display text-4xl md:text-5xl text-text-primary mb-4">
              {categoryLabels[cat]}
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl">
              {categoryDescriptions[cat]}
            </p>
          </div>

          {/* Category Navigation */}
          <div className="flex flex-wrap gap-2 mb-12">
            <Link
              href="/blog"
              className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-text-secondary hover:bg-gray-200 transition-colors"
            >
              All
            </Link>
            {validCategories.map((c) => (
              <Link
                key={c}
                href={`/blog/category/${c}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  c === cat
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                }`}
              >
                {categoryLabels[c]}
              </Link>
            ))}
          </div>

          {/* Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
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
                    <h2 className="font-serif text-xl font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
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
          ) : (
            <div className="text-center py-12">
              <p className="text-text-secondary">No posts in this category yet.</p>
              <Link href="/blog" className="text-primary hover:underline mt-4 inline-block">
                ← Back to all posts
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
