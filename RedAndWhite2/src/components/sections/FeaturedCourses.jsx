import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, useInView } from 'framer-motion'
import { Clock, BarChart3, ArrowRight } from 'lucide-react'
import { COURSES } from '../../constants/courseData'
import Badge from '../ui/Badge'
import Card from '../ui/Card'
import Button from '../ui/Button'

const featured = COURSES.filter((c) => c.featured)

export default function FeaturedCourses() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-py bg-base-000">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6"
        >
          <div>
            <h2 className="text-fluid-h2 font-bold font-[family-name:var(--font-display)] text-text-primary tracking-tighter">
              Featured Programs.
            </h2>
            <p className="text-text-secondary mt-4 max-w-lg text-lg">
              Industry-aligned curriculum built to land you the top jobs in tech.
            </p>
          </div>
          <Link to="/courses">
            <Button variant="outline" className="hidden md:inline-flex rounded-full">
              View All Programs
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <Link to="/courses/$courseId" params={{ courseId: course.id }} className="block group h-full outline-none">
                <Card className="h-full flex flex-col p-1.5 hover:border-border-strong group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-500">
                  {/* Image Container with precise inset radius */}
                  <div className="relative overflow-hidden h-64 rounded-2xl">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge variant="default" className="bg-white/80 backdrop-blur-md border-transparent text-black">
                        {course.category.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold font-[family-name:var(--font-display)] tracking-tight text-text-primary mb-3">
                      {course.title}
                    </h3>
                    <p className="text-sm text-text-secondary mb-6 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="mt-auto pt-6 border-t border-border-subtle flex items-center justify-between text-sm text-text-muted">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-text-primary" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <BarChart3 className="w-4 h-4 text-text-primary" />
                          {course.level}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-base-300 group-hover:text-base-950 transition-colors group-hover:translate-x-1" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
            <Link to="/courses">
                <Button variant="outline" className="rounded-full w-full">
                    View All Programs
                </Button>
            </Link>
        </div>
      </div>
    </section>
  )
}
