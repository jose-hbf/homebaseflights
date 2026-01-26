import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-full transition-all',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variant === 'primary' &&
            'bg-primary text-white hover:bg-primary-dark focus-visible:ring-primary shadow-sm hover:shadow-md',
          variant === 'secondary' &&
            'bg-surface-dark text-white hover:bg-surface-muted focus-visible:ring-surface-dark',
          variant === 'outline' &&
            'border border-border text-text-primary hover:border-primary hover:text-primary focus-visible:ring-primary bg-transparent',
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

Button.displayName = 'Button'

export { Button }
