export type PostCategory = 'how-to' | 'timing' | 'concepts' | 'tools' | 'destinations'

export interface PostFrontmatter {
  title: string
  description: string
  date: string
  lastUpdated?: string
  category: PostCategory
  author: string
  image: string
  imageAlt?: string
  featured?: boolean
  keywords?: string[]
  faqs?: FAQ[]
}

export interface FAQ {
  question: string
  answer: string
}

export interface Post extends PostFrontmatter {
  slug: string
  content: string
  readingTime: string
  headings: Heading[]
}

export interface Heading {
  id: string
  text: string
  level: number
}

export const categoryLabels: Record<PostCategory, string> = {
  'how-to': 'How-To Guides',
  'timing': 'When to Book',
  'concepts': 'Flight Concepts',
  'tools': 'Tools & Resources',
  'destinations': 'Destinations',
}

export const categoryDescriptions: Record<PostCategory, string> = {
  'how-to': 'Step-by-step guides to help you find and book cheap flights.',
  'timing': 'Learn the best times to book flights for maximum savings.',
  'concepts': 'Understand mistake fares, error fares, and other flight deal concepts.',
  'tools': 'Discover the best tools and resources for finding cheap flights.',
  'destinations': 'Budget-friendly destinations and travel inspiration.',
}
