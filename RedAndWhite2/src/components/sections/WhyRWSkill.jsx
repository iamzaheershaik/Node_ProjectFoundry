import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Award, BookOpen, CreditCard } from 'lucide-react'
import Card from '../ui/Card'

const features = [
  {
    icon: Award,
    title: 'Recognized Certification',
    description: 'Earn certificates from institutes approved by NSDC & Skill India, recognized by top employers nationwide.',
    color: '#18181b', // base-900 instead of maroon for cleaner look
  },
  {
    icon: BookOpen,
    title: 'Industry Curriculum',
    description: 'Designed with insights from leading IT minds, mirroring top tech institutions like IITs and NITs.',
    color: '#18181b',
  },
  {
    icon: CreditCard,
    title: 'Zero Cost EMI',
    description: 'Gain industry-ready skills at fair prices, multiple flexible payment options, and absolutely zero hidden charges.',
    color: '#18181b',
  },
]

export default function WhyRWSkill() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-py bg-base-000">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20 md:mb-24"
        >
          <h2 className="text-fluid-h2 font-bold font-[family-name:var(--font-display)] text-text-primary tracking-tighter mb-4">
            Quality without compromise.
          </h2>
          <p className="text-xl text-text-secondary font-light max-w-2xl mx-auto">
            We deliver IIT-level education quality with modern tech-stack curriculums at affordable fees.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card className="p-8 md:p-10 h-full hover:-translate-y-2 transition-transform duration-500 bg-base-050 border-none shadow-none hover:shadow-xl hover:bg-surface">
                   <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-white border border-border-subtle shadow-sm">
                      <Icon className="w-6 h-6 text-base-950" />
                   </div>
                   <h3 className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-primary tracking-tight mb-4">
                     {feature.title}
                   </h3>
                   <p className="text-text-secondary leading-relaxed">
                     {feature.description}
                   </p>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
