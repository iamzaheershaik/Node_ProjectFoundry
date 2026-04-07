import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, useInView } from 'framer-motion'
import { CATEGORIES } from '../../constants/courseCategories'
import Card from '../ui/Card'

export default function CategoryStrip() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section ref={ref} className="section-py bg-base-050">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6"
        >
          <div>
            <p className="text-sm font-bold text-text-muted font-[family-name:var(--font-mono)] uppercase tracking-widest mb-3">
              Disciplines
            </p>
            <h2 className="text-fluid-h2 font-bold font-[family-name:var(--font-display)] text-text-primary tracking-tighter">
              Explore fields of study.
            </h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="col-span-1"
              >
                <Link
                  to="/courses"
                  search={{ category: cat.id }}
                  className="block h-full outline-none"
                >
                  <Card className="h-full p-6 hover:border-border-strong group flex flex-col items-center justify-center text-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-text-primary mb-1 text-sm">
                      {cat.name}
                    </h3>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
