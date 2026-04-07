import { Link } from '@tanstack/react-router'
import { Phone, Mail, MapPin, ArrowUpRight, Heart, Send, Globe, MessageCircle, Video, Share2 } from 'lucide-react'
import Button from '../ui/Button'

export default function Footer() {
  return (
    <footer className="relative bg-base-950 text-white mt-10">
      {/* ── Background Elements ── */}
      <div className="absolute inset-0 bg-mesh-dark mix-blend-screen opacity-60 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {/* ── Floating CTA Strip ── */}
      <div className="section-container relative z-20">
        <div className="glass-dark border border-white/10 rounded-3xl p-8 md:p-12 -mt-24 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-maroon/30 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div>
              <p className="text-gold font-bold font-[family-name:var(--font-mono)] text-sm tracking-widest uppercase mb-2">Next Steps</p>
              <h3 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-display)] tracking-tight">
                Take the Leap — <span className="text-white/80">Enroll Today</span>
              </h3>
            </div>
            <Link to="/contact" className="shrink-0">
              <Button size="lg" className="bg-white text-base-950 hover:bg-gold hover:text-base-950 transition-colors duration-500 shadow-xl group">
                Get Started
                <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="section-container section-py relative z-10 pb-16 pt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Column 1: Brand & Newsletter (Spans 4) */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-6 group inline-flex block">
              <img src="https://www.rwskill.edu.in/wp-content/uploads/2025/11/rnw-logo.webp" alt="RW Skill" className="h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-110" />
            </Link>
            
            <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-sm">
              Industry-focused courses in IT, Design, Animation, AI, and Business. No entrance exams. Just skill-based training that leads to real jobs.
            </p>

            {/* Newsletter */}
            <div className="mb-8">
              <p className="text-sm font-semibold mb-3 text-white">Subscribe to our newsletter</p>
              <form className="relative max-w-sm">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-5 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                  required
                />
                <button type="submit" className="absolute right-2 top-1.5 bottom-1.5 w-9 h-9 bg-maroon rounded-full flex items-center justify-center text-white hover:bg-maroon-light transition-colors">
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
            
            {/* Social Icons */}
            <div className="flex gap-3">
              {[
                { icon: Globe, href: '#' },
                { icon: MessageCircle, href: '#' },
                { icon: Video, href: '#' },
                { icon: Share2, href: '#' },
              ].map((social, idx) => {
                const Icon = social.icon
                return (
                  <a key={idx} href={social.href} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300">
                    <Icon className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Column 2: Quick Links (Spans 2) */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="font-bold font-[family-name:var(--font-display)] mb-6 text-white text-lg tracking-tight">Company</h4>
            <ul className="space-y-4">
              {[
                { label: 'About Us', to: '/about' },
                { label: 'All Courses', to: '/courses' },
                { label: 'Contact', to: '/contact' },
                { label: 'Student Login', href: 'https://student.rwskill.in/' },
                { label: 'Career With Us', href: 'https://www.rwskill.edu.in/career/' },
              ].map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link to={link.to} className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-maroon/0 group-hover:bg-maroon transition-colors" /> {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-maroon/0 group-hover:bg-maroon transition-colors" /> {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Trending Courses (Spans 3) */}
          <div className="lg:col-span-3">
            <h4 className="font-bold font-[family-name:var(--font-display)] mb-6 text-white text-lg tracking-tight">Trending Programs</h4>
            <ul className="space-y-4">
              {[
                { label: 'Full Stack Development', id: 'full-stack-development' },
                { label: 'AI/ML & Data Science', id: 'ai-ml-data-science' },
                { label: 'UI/UX & Graphic Design', id: 'ui-ux-graphic-design' },
                { label: 'Digital Marketing', id: 'digital-marketing' },
                { label: 'Cyber Security', id: 'cyber-security' },
              ].map((course) => (
                <li key={course.id}>
                  <Link
                    to="/courses/$courseId"
                    params={{ courseId: course.id }}
                    className="text-sm text-white/50 hover:text-gold transition-colors block border-b border-white/5 pb-3 hover:pl-2 duration-300"
                  >
                    {course.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Locations (Spans 2) */}
          <div className="lg:col-span-2">
            <h4 className="font-bold font-[family-name:var(--font-display)] mb-6 text-white text-lg tracking-tight">Location</h4>
            <div className="space-y-5">
              <div className="group">
                <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2">Head Office</p>
                <div className="flex items-start gap-3 text-white/60">
                  <MapPin className="w-4 h-4 mt-0.5 text-maroon shrink-0" />
                  <p className="text-sm leading-relaxed group-hover:text-white transition-colors">
                    AK Road, Surat<br />
                    A5, Ground Floor, Saurashtra Soc.
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 pt-2">
                <a href="tel:+917878444333" className="flex items-center gap-3 text-sm text-white/60 hover:text-gold transition-colors">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white"><Phone className="w-3.5 h-3.5" /></div>
                  +91 7878 444 333
                </a>
                <a href="mailto:info@rwskill.edu.in" className="flex items-center gap-3 text-sm text-white/60 hover:text-gold transition-colors">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white"><Mail className="w-3.5 h-3.5" /></div>
                  info@rwskill.edu.in
                </a>
              </div>

              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-maroon hover:text-white transition-colors pt-4"
              >
                View 6 more locations
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/10 relative z-10 bg-black/20">
        <div className="section-container flex flex-col md:flex-row items-center justify-between gap-4 py-6">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} RW Skill Education. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
          <p className="text-sm text-white/40 flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-maroon fill-maroon" /> in India
          </p>
        </div>
      </div>
    </footer>
  )
}

