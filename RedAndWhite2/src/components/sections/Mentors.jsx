import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MENTORS } from '../../constants/mentors'

export default function Mentors() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-py bg-base-050">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-20"
        >
          <h2 className="text-fluid-h2 font-bold font-[family-name:var(--font-display)] text-text-primary tracking-tighter mb-4">
            Learn from the masters.
          </h2>
          <p className="text-xl text-text-secondary font-light max-w-2xl">
            Our faculty consists of industry veterans from top tech companies and design studios.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
          {MENTORS.map((mentor, i) => (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col items-center text-center cursor-default"
            >
              <div className="relative mb-6 overflow-hidden rounded-[2rem] bg-base-100 aspect-[3/4] w-full border border-border-subtle shadow-sm">
                <img
                  src={mentor.avatarUrl}
                  alt={mentor.name}
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Subject Badge overlays on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]" />
                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out text-white">
                  <span className="inline-block bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/30">
                    {mentor.subject}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold font-[family-name:var(--font-display)] tracking-tight text-text-primary">
                {mentor.name}
              </h3>
              <p className="text-sm font-medium text-text-muted mt-1 uppercase tracking-widest">{mentor.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
