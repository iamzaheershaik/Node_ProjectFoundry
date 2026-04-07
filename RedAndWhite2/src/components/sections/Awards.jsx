import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { AWARDS } from '../../constants/testimonials'

export default function Awards() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-py bg-base-950 text-white relative overflow-hidden">
      {/* Subtle modern dark mesh overlay */}
      <div className="absolute inset-0 bg-mesh-dark mix-blend-screen opacity-50" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20 md:mb-24"
        >
          <h2 className="text-fluid-h2 font-bold font-[family-name:var(--font-display)] tracking-tighter mb-6">
            Excellence & Recognition.
          </h2>
          <p className="text-xl text-white/60 font-light max-w-2xl mx-auto">
            Consistently ranked among India's top skill training institutes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {AWARDS.map((award, i) => (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="glass-dark rounded-[2rem] p-10 hover:border-white/20 transition-all duration-500 ease-out"
            >
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-8 border border-white/10">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold font-[family-name:var(--font-display)] tracking-tight mb-4">
                {award.title}
              </h3>
              <p className="text-base text-white/60 leading-relaxed font-light">
                {award.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
