interface MDXContentProps {
  content: string
}

function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function MDXContent({ content }: MDXContentProps) {
  const lines = content.split('\n')
  const elements: JSX.Element[] = []
  let listItems: string[] = []
  let listType: 'ul' | 'ol' | null = null
  let key = 0

  const flushList = () => {
    if (listItems.length > 0 && listType) {
      const ListTag = listType
      elements.push(
        <ListTag key={key++} className={listType === 'ul' ? 'list-disc pl-6 mb-4 space-y-2' : 'list-decimal pl-6 mb-4 space-y-2'}>
          {listItems.map((item, i) => (
            <li key={i} className="text-text-secondary">
              {renderInlineMarkdown(item)}
            </li>
          ))}
        </ListTag>
      )
      listItems = []
      listType = null
    }
  }

  const renderInlineMarkdown = (text: string) => {
    // Handle bold text
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-text-primary">{part.slice(2, -2)}</strong>
      }
      return part
    })
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed) {
      flushList()
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
      continue
    }

    // Skip h1 (already shown as title)
    if (trimmed.startsWith('# ')) {
      continue
    }

    // Unordered list
    if (trimmed.startsWith('- ')) {
      if (listType !== 'ul') {
        flushList()
        listType = 'ul'
      }
      listItems.push(trimmed.replace('- ', ''))
      continue
    }

    // Ordered list
    if (/^\d+\.\s/.test(trimmed)) {
      if (listType !== 'ol') {
        flushList()
        listType = 'ol'
      }
      listItems.push(trimmed.replace(/^\d+\.\s/, ''))
      continue
    }

    // Regular paragraph
    flushList()
    elements.push(
      <p key={key++} className="text-text-secondary mb-4 leading-relaxed">
        {renderInlineMarkdown(trimmed)}
      </p>
    )
  }

  flushList()

  return <div className="prose-custom">{elements}</div>
}
