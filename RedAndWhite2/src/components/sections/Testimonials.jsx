import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { TESTIMONIALS } from '../../constants/testimonials'
import Card from '../ui/Card'

function TestimonialCard({ testimonial }) {
  return (
    <Card className="flex-shrink-0 w-[340px] md:w-[400px] p-8 md:p-10 border-border-subtle bg-base-000 flex flex-col justify-between h-[320px]">
      <div>
        <div className="flex items-center gap-1 mb-6">
          {Array.from({ length: testimonial.rating }).map((_, j) => (
            <Star key={j} className="w-4 h-4 text-base-950 fill-base-950" />
          ))}
        </div>
        <p className="text-lg md:text-xl text-text-primary font-light leading-relaxed mb-6 line-clamp-4">
          "{testimonial.text}"
        </p>
      </div>
      <div className="flex items-center gap-4 border-t border-border-subtle pt-6">
        <img
          src={testimonial.avatarUrl}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover grayscale border border-base-200"
          loading="lazy"
        />
        <div>
          <p className="font-bold text-base-950 font-[family-name:var(--font-display)] tracking-tight">
            {testimonial.name}
          </p>
          <p className="text-sm text-text-muted">{testimonial.role}</p>
        </div>
      </div>
    </Card>
  )
}

export default function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Triple the testimonials for seamless infinite scroll
  const multiplied = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS]

  return (
    <section ref={ref} className="section-py bg-base-100 overflow-hidden">
      <div className="section-container mb-16 md:mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row items-end justify-between gap-6"
        >
          <div className="max-w-2xl">
            <h2 className="text-fluid-h2 font-bold font-[family-name:var(--font-display)] text-text-primary tracking-tighter mb-4">
              44,200+ careers launched.
            </h2>
            <p className="text-xl text-text-secondary font-light">
              Don't just take our word for it. Hear from those who took the leap.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Marquee Row */}
      <div className="flex gap-6 sm:gap-8 overflow-hidden mask-edges px-4">
         <div className="flex gap-6 sm:gap-8 w-max animate-marquee pb-8">
            {multiplied.map((t, i) => (
            <TestimonialCard key={`${t.id}-${i}`} testimonial={t} />
            ))}
         </div>
      </div>
    </section>
  )
}
