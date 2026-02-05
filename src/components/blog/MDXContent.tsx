import { BlogCTA } from './BlogCTA'

interface MDXContentProps {
  content: string
}

function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Parse a markdown table row into cells
function parseTableRow(row: string): string[] {
  return row
    .split('|')
    .map(cell => cell.trim())
    .filter((_, i, arr) => i > 0 && i < arr.length - 1 || (arr[0] === '' && i > 0) || (arr[arr.length - 1] === '' && i < arr.length - 1))
    .filter(cell => cell !== '')
}

// Check if a line is a table separator (e.g., |---|---|)
function isTableSeparator(line: string): boolean {
  return /^\|?[\s\-:|]+\|?$/.test(line) && line.includes('-')
}

export function MDXContent({ content }: MDXContentProps) {
  const lines = content.split('\n')
  const elements: JSX.Element[] = []
  let listItems: string[] = []
  let listType: 'ul' | 'ol' | null = null
  let key = 0
  let i = 0

  const flushList = () => {
    if (listItems.length > 0 && listType) {
      const ListTag = listType
      elements.push(
        <ListTag key={key++} className={listType === 'ul' ? 'list-disc pl-6 mb-4 space-y-2' : 'list-decimal pl-6 mb-4 space-y-2'}>
          {listItems.map((item, idx) => (
            <li key={idx} className="text-text-secondary">
              {renderInlineMarkdown(item)}
            </li>
          ))}
        </ListTag>
      )
      listItems = []
      listType = null
    }
  }

  const renderInlineMarkdown = (text: string): React.ReactNode => {
    // Handle bold text, links, and percentage savings
    const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\(-\d+%\))/g)
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-semibold text-text-primary">{part.slice(2, -2)}</strong>
      }
      // Handle links [text](url)
      const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/)
      if (linkMatch) {
        return <a key={idx} href={linkMatch[2]} className="text-[#2563eb] font-medium hover:underline underline-offset-2">{linkMatch[1]}</a>
      }
      // Handle percentage savings (-XX%)
      const percentMatch = part.match(/\(-(\d+)%\)/)
      if (percentMatch) {
        return <span key={idx} className="text-green-600 font-semibold ml-1">-{percentMatch[1]}%</span>
      }
      return part
    })
  }

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      flushList()
      i++
      continue
    }

    // Check for CTA with selector (:::cta-selector)
    if (trimmed === ':::cta-selector') {
      flushList()
      // Skip until closing :::
      i++
      while (i < lines.length && lines[i].trim() !== ':::') {
        i++
      }
      i++ // Skip closing :::
      
      elements.push(<BlogCTA key={key++} variant="compact" />)
      continue
    }

    // Check for CTA block (:::cta ... :::)
    if (trimmed === ':::cta') {
      flushList()
      
      // Collect CTA content until :::
      const ctaLines: string[] = []
      i++
      while (i < lines.length && lines[i].trim() !== ':::') {
        ctaLines.push(lines[i].trim())
        i++
      }
      i++ // Skip closing :::

      // Parse CTA content
      const ctaText = ctaLines.filter(l => l && !l.startsWith('['))
      const ctaLink = ctaLines.find(l => l.startsWith('['))
      
      // Extract link text and href
      let linkText = 'Start Free Trial →'
      let linkHref = '/'
      if (ctaLink) {
        const linkMatch = ctaLink.match(/\[([^\]]+)\]\(([^)]+)\)/)
        if (linkMatch) {
          linkText = linkMatch[1]
          linkHref = linkMatch[2]
        }
      }

      elements.push(
        <div key={key++} className="my-8 bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 md:p-8 text-center text-white shadow-xl">
          {ctaText.map((line, idx) => (
            <p key={idx} className={idx === 0 ? "text-2xl md:text-3xl font-bold mb-2" : "text-lg opacity-90 mb-4"}>
              {line}
            </p>
          ))}
          <a 
            href={linkHref}
            className="inline-block bg-white text-primary font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
          >
            {linkText}
          </a>
        </div>
      )
      continue
    }

    // Check for blockquote (alert card style)
    if (trimmed.startsWith('> ') || trimmed === '>') {
      flushList()
      
      // Collect all blockquote lines
      const blockquoteLines: string[] = []
      while (i < lines.length) {
        const currentLine = lines[i].trim()
        if (currentLine.startsWith('> ')) {
          blockquoteLines.push(currentLine.slice(2))
          i++
        } else if (currentLine === '>') {
          blockquoteLines.push('')
          i++
        } else {
          break
        }
      }

      // Parse the blockquote content
      const content = blockquoteLines.join('\n')
      const isAlertStyle = content.includes('Subject:') || content.includes('→') || content.includes('$')

      if (isAlertStyle) {
        // Render as email alert card
        elements.push(
          <div key={key++} className="my-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 space-y-2">
                {blockquoteLines.filter(line => line.trim()).map((line, idx) => {
                  const isSubject = line.startsWith('**Subject:**') || line.startsWith('Subject:')
                  const isPrice = line.includes('Deal price:') || line.includes('Your savings:') || (line.startsWith('**') && line.includes('$'))
                  const isCTA = line.includes('[Book') || line.includes('[Start') || line.includes('[Get')
                  
                  if (isSubject) {
                    return (
                      <div key={idx} className="font-semibold text-text-primary text-lg">
                        {renderInlineMarkdown(line.replace('**Subject:**', '').replace('Subject:', '').trim())}
                      </div>
                    )
                  }
                  if (isPrice) {
                    return (
                      <div key={idx} className="font-semibold text-green-600 text-lg">
                        {renderInlineMarkdown(line)}
                      </div>
                    )
                  }
                  if (isCTA) {
                    return (
                      <div key={idx} className="pt-2">
                        <span className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                          {line.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\[|\]/g, '')}
                        </span>
                      </div>
                    )
                  }
                  return (
                    <div key={idx} className="text-text-secondary text-sm">
                      {renderInlineMarkdown(line)}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      } else {
        // Regular blockquote
        elements.push(
          <blockquote key={key++} className="my-6 pl-4 border-l-4 border-blue-300 text-text-secondary italic">
            {blockquoteLines.map((line, idx) => (
              <p key={idx} className="mb-2">{renderInlineMarkdown(line)}</p>
            ))}
          </blockquote>
        )
      }
      continue
    }

    // Check for table (starts with |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushList()
      
      // Collect all table rows
      const tableRows: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableRows.push(lines[i].trim())
        i++
      }

      if (tableRows.length >= 2) {
        const headerRow = parseTableRow(tableRows[0])
        const bodyRows = tableRows.slice(2).filter(row => !isTableSeparator(row)).map(parseTableRow)

        elements.push(
          <div key={key++} className="overflow-x-auto my-6">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {headerRow.map((cell, idx) => (
                    <th key={idx} className="px-4 py-3 text-left font-semibold text-text-primary border-b-2 border-gray-200">
                      {renderInlineMarkdown(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-gray-50">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-4 py-3 text-text-secondary border-b border-gray-100">
                        {renderInlineMarkdown(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
      continue
    }

    // Headings
    if (trimmed.startsWith('## ')) {
      flushList()
      const text = trimmed.replace('## ', '')
      const id = generateId(text)
      elements.push(
        <h2 key={key++} id={id} className="font-serif text-2xl font-semibold text-text-primary mt-10 mb-4 scroll-mt-24">
          {text}
        </h2>
      )
      i++
      continue
    }

    if (trimmed.startsWith('### ')) {
      flushList()
      const text = trimmed.replace('### ', '')
      const id = generateId(text)
      elements.push(
        <h3 key={key++} id={id} className="font-serif text-xl font-semibold text-text-primary mt-8 mb-3 scroll-mt-24">
          {text}
        </h3>
      )
      i++
      continue
    }

    // Skip h1 (already shown as title)
    if (trimmed.startsWith('# ')) {
      i++
      continue
    }

    // Image ![alt](url)
    const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (imageMatch) {
      flushList()
      const alt = imageMatch[1]
      const src = imageMatch[2]
      elements.push(
        <figure key={key++} className="my-8">
          <img
            src={src}
            alt={alt}
            className="w-full rounded-xl shadow-md"
            loading="lazy"
          />
          {alt && (
            <figcaption className="mt-3 text-center text-sm text-text-secondary italic">
              {alt}
            </figcaption>
          )}
        </figure>
      )
      i++
      continue
    }

    // Unordered list
    if (trimmed.startsWith('- ')) {
      if (listType !== 'ul') {
        flushList()
        listType = 'ul'
      }
      listItems.push(trimmed.replace('- ', ''))
      i++
      continue
    }

    // Ordered list
    if (/^\d+\.\s/.test(trimmed)) {
      if (listType !== 'ol') {
        flushList()
        listType = 'ol'
      }
      listItems.push(trimmed.replace(/^\d+\.\s/, ''))
      i++
      continue
    }

    // Regular paragraph
    flushList()
    elements.push(
      <p key={key++} className="text-text-secondary mb-4 leading-relaxed">
        {renderInlineMarkdown(trimmed)}
      </p>
    )
    i++
  }

  flushList()

  return <div className="prose-custom">{elements}</div>
}
