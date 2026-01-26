import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonOrangeProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const ButtonOrange = forwardRef<HTMLButtonElement, ButtonOrangeProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2',
          variant === 'primary' &&
            'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500 shadow-sm hover:shadow-md',
          variant === 'secondary' &&
            'bg-surface-dark text-white hover:bg-surface-muted focus:ring-surface-dark',
          variant === 'outline' &&
            'border border-border text-text-primary hover:border-orange-500 hover:text-orange-500 focus:ring-orange-500 bg-transparent',
          size === 'sm' && 'px-5 py-2 text-sm',
          size === 'md' && 'px-7 py-3 text-base',
          size === 'lg' && 'px-9 py-4 text-lg',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

ButtonOrange.displayName = 'ButtonOrange'

export { ButtonOrange }
