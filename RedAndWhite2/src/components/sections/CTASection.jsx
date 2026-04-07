import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { openEnrollModal } from '../../features/ui/uiSlice'
import Button from '../ui/Button'

export default function CTASection() {
  const dispatch = useDispatch()

  return (
    <section className="pt-32 pb-48 bg-base-950 relative overflow-hidden">
      {/* Absolute center large soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-maroon/20 rounded-full blur-[150px] z-0 pointer-events-none" />

      <div className="section-container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-fluid-h1 font-bold font-[family-name:var(--font-display)] text-white tracking-tighter mb-8 leading-[1.05] max-w-4xl mx-auto">
            Ready to shape <br className="hidden md:block"/> your future?
          </h2>
          <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-12 font-light">
            Join the 44,200+ top professionals who built their dream careers with RW Skill Education.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 hover:scale-105 transition-all duration-300"
              onClick={() => dispatch(openEnrollModal())}
            >
              Enroll Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/20 text-white hover:bg-white/10"
            >
              Download Course Brochure
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
