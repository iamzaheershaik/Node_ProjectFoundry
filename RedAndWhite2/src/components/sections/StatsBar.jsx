import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Award, Users, Building2, MapPin } from 'lucide-react'

const STATS = [
  { label: 'Years of Experience', endValue: 18, suffix: '+', icon: Award },
  { label: 'Trained Students', endValue: 44200, suffix: '+', icon: Users, format: true },
  { label: 'Hiring Partners', endValue: 1650, suffix: '+', icon: Building2, format: true },
  { label: 'Branches', endValue: 22, suffix: '+', icon: MapPin },
]

function AnimatedCounter({ endValue, suffix, format, isInView }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 2000
    const increment = endValue / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= endValue) {
        setCount(endValue)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, endValue])

  const display = format
    ? new Intl.NumberFormat('en-IN').format(count)
    : count.toString()

  return (
    <span>
      {display}{suffix}
    </span>
  )
}

export default function StatsBar() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="relative z-10 -mt-10 sm:-mt-20">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(5px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass border border-border-subtle rounded-[2rem] p-8 md:p-12 shadow-xl"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {STATS.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center group"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-base-100 rounded-2xl mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:bg-maroon-light/10">
                    <Icon className="w-6 h-6 text-base-900 group-hover:text-maroon transition-colors" />
                  </div>
                  <p className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-display)] text-text-primary tracking-tighter mb-2">
                    <AnimatedCounter
                      endValue={stat.endValue}
                      suffix={stat.suffix}
                      format={stat.format}
                      isInView={isInView}
                    />
                  </p>
                  <p className="text-sm text-text-muted font-medium uppercase tracking-widest">{stat.label}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
