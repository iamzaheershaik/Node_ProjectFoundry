import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const Card = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn(
        "bg-surface rounded-3xl border border-border-subtle shadow-md overflow-hidden hover:shadow-xl transition-all duration-500",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
})
Card.displayName = 'Card'

export default Card
