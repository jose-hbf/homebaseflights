import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { Post, PostFrontmatter, PostCategory, Heading } from '@/types/blog'

const postsDirectory = path.join(process.cwd(), 'content/posts')

function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const headings: Heading[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    headings.push({ id, text, level })
  }

  return headings
}

function getPostFiles(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.mdx'))
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(postsDirectory, `${slug}.mdx`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  const frontmatter = data as PostFrontmatter

  return {
    slug,
    content,
    readingTime: readingTime(content).text,
    headings: extractHeadings(content),
    ...frontmatter,
  }
}

export function getAllPosts(): Post[] {
  const files = getPostFiles()

  const posts = files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '')
      return getPostBySlug(slug)
    })
    .filter((post): post is Post => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

export function getPostsByCategory(category: PostCategory): Post[] {
  return getAllPosts().filter((post) => post.category === category)
}

export function getFeaturedPost(): Post | null {
  const posts = getAllPosts()
  return posts.find((post) => post.featured) || posts[0] || null
}

export function getRecentPosts(limit?: number, excludeFeatured = false): Post[] {
  let posts = getAllPosts()

  if (excludeFeatured) {
    const featured = getFeaturedPost()
    if (featured) {
      posts = posts.filter((post) => post.slug !== featured.slug)
    }
  }

  return limit ? posts.slice(0, limit) : posts
}

export function getAllCategories(): PostCategory[] {
  const posts = getAllPosts()
  const categories = new Set<PostCategory>()
  posts.forEach((post) => categories.add(post.category))
  return Array.from(categories)
}

export function getRelatedPosts(currentSlug: string, limit = 3): Post[] {
  const currentPost = getPostBySlug(currentSlug)
  if (!currentPost) return []

  return getAllPosts()
    .filter((post) => post.slug !== currentSlug && post.category === currentPost.category)
    .slice(0, limit)
}
