import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import Button from '../ui/Button'

export default function TrustLegacy() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-py bg-base-050 overflow-hidden">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Image & Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={isInView ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl relative aspect-[4/5] lg:aspect-square">
              <img
                src="/images/campus-interior.png"
                alt="RW Skill Campus"
                className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
            </div>
            
            {/* Premium Floating glass badge */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute -bottom-8 -right-8 lg:-bottom-12 lg:-right-12 glass rounded-3xl p-6 md:p-8 shadow-2xl animate-float-slow"
            >
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-5xl lg:text-7xl font-bold font-[family-name:var(--font-display)] text-base-950 tracking-tighter mix-blend-multiply">18<span className="text-maroon">+</span></p>
                <p className="text-sm lg:text-base font-medium text-text-secondary mt-1 tracking-tight">Years of Trust</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-fluid-h2 font-bold font-[family-name:var(--font-display)] text-text-primary tracking-tighter mb-8 leading-[1.05]">
              A legacy of absolute trust.
            </h2>
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-10 font-light">
              Since 2008, Red & White Skill Education has been the premier choice for students in Gujarat building strong futures in IT, design, animation, and business.
            </p>

            <ul className="space-y-5 mb-12">
              {[
                'One of India\'s most trusted career institutes',
                '44,200+ trained students and 1,500+ hiring partners',
                'Career-focused, skill-based training delivering real results'
              ].map((point, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  className="flex items-start gap-4"
                >
                  <div className="w-6 h-6 rounded-full bg-maroon/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-maroon" />
                  </div>
                  <span className="text-base-800 font-medium">{point}</span>
                </motion.li>
              ))}
            </ul>

            <Link to="/about">
              <Button variant="outline" size="lg" className="rounded-full group">
                Read Our Story
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
