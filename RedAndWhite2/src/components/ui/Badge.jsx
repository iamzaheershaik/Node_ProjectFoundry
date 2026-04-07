import { cn } from '../../lib/utils'

export default function Badge({ children, variant = 'default', className }) {
  const variants = {
    // Vercel-style high contrast badge
    default: "bg-base-100 text-base-900 border border-base-200",
    maroon: "bg-maroon-light/10 text-maroon border border-maroon/20",
    gold: "bg-gold/10 text-gold-dark border border-gold/20",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  }

  return (
    <span 
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-[family-name:var(--font-mono)] transition-colors",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
