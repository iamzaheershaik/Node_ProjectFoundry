import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { CheckCircle2, Users, Building2, Award, MapPin } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import { STATS } from '../constants/testimonials'

function AboutPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="bg-surface-dark py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-maroon/20 rounded-full blur-[100px]" />
        </div>
        <div className="section-container relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-display)] text-white mb-4">
            About <span className="text-gold">RW Skill Education</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Building India's future, one skill at a time. Since 2008, we've been transforming lives through quality education.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/images/campus-interior.png"
                  alt="RW Skill Campus"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-semibold text-maroon font-[family-name:var(--font-mono)] uppercase tracking-wider mb-3">Our Story</p>
              <h2 className="text-3xl font-bold font-[family-name:var(--font-display)] mb-6">
                From Surat to <span className="text-maroon">All of India</span>
              </h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>Red & White Skill Education is one of India's most trusted career institutes, helping students build strong futures in IT, design, animation, and business since 2008.</p>
                <p>With 44,200+ trained students, 1,500+ hiring partners, and 22+ branches, we've created a legacy of delivering results — not just promises.</p>
                <p>We believe in career-focused, skill-based training, and that's what we deliver, day after day.</p>
              </div>
              <ul className="mt-6 space-y-3">
                {['Government-Recognized Certification (NSDC & Skill India)', 'Industry-designed curriculum by IIT/IIIT mentors', 'No-cost EMI & affordable fees', '95%+ placement record'].map(p => (
                  <li key={p} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-maroon flex-shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-maroon text-white">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Award, value: '18+', label: 'Years' },
              { icon: Users, value: '44,200+', label: 'Students Trained' },
              { icon: Building2, value: '1,650+', label: 'Hiring Partners' },
              { icon: MapPin, value: '22+', label: 'Branches' },
            ].map((s) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <Icon className="w-8 h-8 text-gold mx-auto mb-3" />
                  <p className="text-3xl font-bold font-[family-name:var(--font-display)]">{s.value}</p>
                  <p className="text-white/70 text-sm mt-1">{s.label}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}

export const Route = createFileRoute('/about')({
  component: AboutPage,
})
