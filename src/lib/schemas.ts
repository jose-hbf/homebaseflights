import { Post, FAQ, PostCategory, categoryLabels, categoryDescriptions } from '@/types/blog'

const siteUrl = 'https://homebaseflights.com'

export function generateArticleSchema(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.image,
    author: {
      '@type': 'Organization',
      name: 'Homebase Flights',
      url: `${siteUrl}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Homebase Flights',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo-header.svg`,
      },
    },
    datePublished: post.date,
    dateModified: post.lastUpdated || post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}`,
    },
    articleSection: categoryLabels[post.category],
    wordCount: post.content.split(/\s+/).length,
  }
}

export function generateFAQSchema(faqs: FAQ[]) {
  if (!faqs || faqs.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function generateCategorySchema(category: PostCategory, posts: Post[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: categoryLabels[category],
    description: categoryDescriptions[category],
    url: `${siteUrl}/blog/category/${category}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteUrl}/blog/${post.slug}`,
        name: post.title,
      })),
    },
  }
}

export function generateBlogListSchema(posts: Post[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Homebase Flights Blog',
    description: 'Tips and tricks to save big when traveling',
    url: `${siteUrl}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'Homebase Flights',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    blogPost: posts.slice(0, 10).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${post.slug}`,
      datePublished: post.date,
      author: {
        '@type': 'Person',
        name: post.author,
      },
    })),
  }
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Homebase Flights',
    url: siteUrl,
    logo: `${siteUrl}/logo-header.svg`,
    description: 'Flight deal alert service that sends cheap flights only from your home airport. $59/year with 3× savings guarantee.',
    foundingDate: '2025',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@homebaseflights.com',
      contactType: 'customer service',
    },
  }
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Homebase Flights',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/blog?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}
