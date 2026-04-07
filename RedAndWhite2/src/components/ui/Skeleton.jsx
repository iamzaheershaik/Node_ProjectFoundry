import { cn } from '../../lib/utils'

export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={cn('animate-shimmer rounded-xl', className)}
      {...props}
    />
  )
}

export function CourseCardSkeleton() {
  return (
    <div className="rounded-2xl border border-cream-dark bg-white overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 mt-4">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function TestimonialSkeleton() {
  return (
    <div className="rounded-2xl border border-cream-dark bg-white p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  )
}
