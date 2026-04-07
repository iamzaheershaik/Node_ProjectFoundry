import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  children, 
  ...props 
}, ref) => {
  
  const baseStyles = "inline-flex items-center justify-center font-medium font-[family-name:var(--font-display)] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none active:scale-95"
  
  const variants = {
    // Uber-premium black button (Vercel style)
    primary: "bg-base-950 text-white shadow-md hover:shadow-xl hover:bg-base-900 border border-base-800",
    // Clean secondary
    secondary: "bg-maroon text-white shadow-glow-maroon hover:bg-maroon-dark",
    // Outline style
    outline: "bg-transparent text-base-950 border border-base-300 hover:bg-base-100",
    // Ghost
    ghost: "bg-transparent text-text-secondary hover:text-base-950 hover:bg-base-100",
  }

  const sizes = {
    sm: "h-9 px-4 text-xs rounded-full",
    md: "h-11 px-6 text-sm rounded-full",
    lg: "h-14 px-8 text-base rounded-full",
    icon: "h-11 w-11 rounded-full",
  }

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : null}
      {children}
    </motion.button>
  )
})
Button.displayName = 'Button'

export default Button
