import { useDispatch } from 'react-redux'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Play } from 'lucide-react'
import { openEnrollModal } from '../../features/ui/uiSlice'
import Button from '../ui/Button'

export default function Hero() {
  const dispatch = useDispatch()

  return (
    <section className="relative overflow-hidden bg-background min-h-[90vh] flex items-center pt-32 pb-20">
      {/* Premium Apple-style Mesh Background */}
      <div className="absolute inset-0 z-0 bg-mesh-light mix-blend-multiply opacity-70" />
      
      {/* Smooth glowing orb center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full blur-[120px] z-0 opacity-80" />

      <div className="section-container relative z-10 flex flex-col items-center justify-center text-center pb-20">
        
        {/* Subtle Next.js style pill badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 bg-white/50 border border-black/5 rounded-full px-4 py-1.5 mb-8 shadow-sm backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-maroon" />
          <span className="text-sm font-medium text-text-secondary">
            Gujarat's Premier IT Institute — Since 2008
          </span>
        </motion.div>

        {/* Fluid Mega Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-fluid-h1 font-bold font-[family-name:var(--font-display)] text-text-primary tracking-tighter max-w-5xl mx-auto mb-6"
        >
          Master the skills that shape the{' '}
          <span className="text-gradient-premium">future.</span>
        </motion.h1>

        {/* Minimalist Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed font-light"
        >
          No theory without practice. Dive deep into IT, Design, and AI with industry-led curriculum and 100% job assistance.
        </motion.p>

        {/* High-Contrast Interactive Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            variant="primary"
            onClick={() => dispatch(openEnrollModal())}
            className="group rounded-full px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            Start Learning
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Link to="/courses">
            <Button 
              variant="outline" 
              size="lg"
              className="rounded-full px-8 py-4 bg-white/50 backdrop-blur-md border border-black/10 hover:bg-white hover:border-black/20 transition-all duration-300"
            >
              Explore Programs
            </Button>
          </Link>
        </motion.div>

        {/* AI-Generated Hero Illustration */}
        <motion.div 
          className="mt-20 relative w-full max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
           <div className="w-full h-32 bg-gradient-to-t from-background to-transparent absolute bottom-0 left-0 z-20 pointer-events-none" />
           <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/30">
             <img
               src="/images/hero-illustration.png"
               alt="Futuristic education technology illustration"
               className="w-full h-auto object-cover"
             />
           </div>
           
           {/* Floating Stats Chips */}
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 1.0, duration: 0.8 }}
             className="absolute -left-4 lg:-left-8 top-1/4 glass rounded-2xl px-5 py-4 shadow-xl hidden md:flex items-center gap-3 animate-float-slow"
           >
             <div className="w-10 h-10 bg-maroon/10 rounded-xl flex items-center justify-center">
               <Play className="w-5 h-5 text-maroon fill-maroon" />
             </div>
             <div className="text-left">
               <p className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-primary tracking-tight">44,200+</p>
               <p className="text-xs text-text-muted font-medium uppercase tracking-widest">Students</p>
             </div>
           </motion.div>

           <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 1.2, duration: 0.8 }}
             className="absolute -right-4 lg:-right-8 top-1/2 glass rounded-2xl px-5 py-4 shadow-xl hidden md:flex items-center gap-3 animate-float"
           >
             <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
               <Sparkles className="w-5 h-5 text-gold-dark" />
             </div>
             <div className="text-left">
               <p className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-primary tracking-tight">1,650+</p>
               <p className="text-xs text-text-muted font-medium uppercase tracking-widest">Hiring Partners</p>
             </div>
           </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
