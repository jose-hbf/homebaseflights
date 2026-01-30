import { MetadataRoute } from 'next'
import { cities } from '@/data/cities'
import { getAllPosts, getAllCategories } from '@/lib/posts'

// Toggle this to true when blog is ready with real content
const BLOG_ENABLED = true

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://homebaseflights.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Dynamic city pages
  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${baseUrl}/cheap-flights-from-${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Blog pages - only include when blog is enabled
  let blogPages: MetadataRoute.Sitemap = []
  let categoryPages: MetadataRoute.Sitemap = []

  if (BLOG_ENABLED) {
    const posts = getAllPosts()
    const categories = getAllCategories()

    blogPages = [
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      ...posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.lastUpdated || post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
    ]

    categoryPages = categories.map((category) => ({
      url: `${baseUrl}/blog/category/${category}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  }

  return [...staticPages, ...cityPages, ...blogPages, ...categoryPages]
}
