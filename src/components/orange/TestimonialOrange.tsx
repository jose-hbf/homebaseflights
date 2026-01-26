import { Card } from '@/components/ui/Card'

interface TestimonialOrangeProps {
  quote: string
  name: string
  location: string
  image?: string
}

export function TestimonialOrange({ quote, name, location, image }: TestimonialOrangeProps) {
  return (
    <Card className="p-6 bg-white">
      <div className="mb-4">
        <span className="font-serif text-4xl text-orange-500 leading-none">&ldquo;</span>
      </div>
      <blockquote className="text-text-primary mb-6 leading-relaxed">
        {quote}
      </blockquote>
      <div className="flex items-center gap-3 pt-4 border-t border-border-subtle">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-300 flex items-center justify-center">
            <span className="text-white font-serif font-semibold text-lg">
              {name.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <p className="font-medium text-text-primary">{name}</p>
          <p className="text-sm text-text-muted">{location}</p>
        </div>
      </div>
    </Card>
  )
}
