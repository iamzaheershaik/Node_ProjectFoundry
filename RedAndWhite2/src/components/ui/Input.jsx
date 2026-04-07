import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const Input = forwardRef(function Input(
  { label, error, icon: Icon, className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-text-secondary font-[family-name:var(--font-display)]">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-xl border border-cream-dark bg-white text-text-primary',
            'placeholder:text-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-maroon/30 focus:border-maroon',
            'transition-all duration-200',
            Icon && 'pl-11',
            error && 'border-error focus:ring-error/30',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  )
})

export default Input
