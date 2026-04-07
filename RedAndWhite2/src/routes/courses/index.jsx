import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, BarChart3, Search, X, Filter, ChevronDown } from 'lucide-react'
import { useGetCoursesQuery } from '../../features/courses/coursesApi'
import { selectFilters, setFilter, resetFilters, setSearchQuery } from '../../features/courses/coursesSlice'
import { CATEGORIES } from '../../constants/courseCategories'
import { CITIES } from '../../constants/cityList'
import PageWrapper from '../../components/layout/PageWrapper'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { CourseCardSkeleton } from '../../components/ui/Skeleton'

function CoursesPage() {
  const dispatch = useDispatch()
  const filters = useSelector(selectFilters)
  const { data: courses = [], isLoading } = useGetCoursesQuery()
  
  const [expandedCity, setExpandedCity] = useState(null)

  const groupedCities = useMemo(() => {
    return CITIES.reduce((acc, city) => {
      const [primary, branch] = city.name.split(' - ')
      if (!acc[primary]) acc[primary] = []
      acc[primary].push({ ...city, branchName: branch || 'Main Branch' })
      return acc
    }, {})
  }, [])

  const filtered = courses.filter((course) => {
    if (filters.category !== 'all' && course.category !== filters.category) return false
    if (filters.level !== 'all' && course.level !== filters.level) return false
    if (filters.search && !course.title.toLowerCase().includes(filters.search.toLowerCase())) return false
    if (filters.city !== 'all' && !course.cities?.includes(filters.city)) return false
    return true
  })

  return (
    <PageWrapper>
      {/* Hero Banner */}
      <section className="bg-surface-dark py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-maroon/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gold/10 rounded-full blur-[100px]" />
        </div>
        <div className="section-container relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-display)] text-white mb-4">
            All <span className="text-gold">Courses</span>
          </h1>
          <p className="text-white/60 max-w-lg mx-auto mb-8">
            Industry-focused programs designed for students and working professionals
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search courses..."
              value={filters.search}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold/30 backdrop-blur-sm"
            />
          </div>
        </div>
      </section>

      <div className="section-container py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-cream-dark p-6 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold font-[family-name:var(--font-display)] flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filters
                </h3>
                {(filters.category !== 'all' || filters.level !== 'all') && (
                  <button
                    onClick={() => dispatch(resetFilters())}
                    className="text-xs text-maroon hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-text-secondary mb-3">Category</h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => dispatch(setFilter({ key: 'category', value: 'all' }))}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      filters.category === 'all' ? 'bg-maroon text-white' : 'hover:bg-cream-dark'
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => dispatch(setFilter({ key: 'category', value: cat.id }))}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        filters.category === cat.id ? 'bg-maroon text-white' : 'hover:bg-cream-dark'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level Filter */}
              <div>
                <h4 className="text-sm font-semibold text-text-secondary mb-3">Level</h4>
                <div className="space-y-1.5">
                  {['all', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                    <button
                      key={level}
                      onClick={() => dispatch(setFilter({ key: 'level', value: level }))}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        filters.level === level ? 'bg-maroon text-white' : 'hover:bg-cream-dark'
                      }`}
                    >
                      {level === 'all' ? 'All Levels' : level}
                    </button>
                  ))}
                </div>
              </div>
              {/* City & Branch Filter */}
              <div>
                <h4 className="text-sm font-semibold text-text-secondary mb-3">City & Branch</h4>
                <div className="space-y-1.5 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                  <button
                    onClick={() => {
                      dispatch(setFilter({ key: 'city', value: 'all' }))
                      setExpandedCity(null)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      filters.city === 'all' ? 'bg-maroon text-white' : 'hover:bg-cream-dark'
                    }`}
                  >
                    All Locations
                  </button>
                  
                  {Object.entries(groupedCities).map(([cityName, branches]) => (
                    <div key={cityName} className="space-y-1">
                      <button
                        onClick={() => setExpandedCity(expandedCity === cityName ? null : cityName)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors hover:bg-cream-dark ${
                          expandedCity === cityName ? 'bg-cream-dark font-semibold' : ''
                        }`}
                      >
                        {cityName}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedCity === cityName ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {expandedCity === cityName && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-3 border-l-2 border-maroon/20 ml-3 mt-1 space-y-1"
                          >
                            {branches.map((branch) => (
                              <button
                                key={branch.id}
                                onClick={() => dispatch(setFilter({ key: 'city', value: branch.id }))}
                                className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors truncate block ${
                                  filters.city === branch.id ? 'bg-maroon text-white font-medium' : 'text-text-secondary hover:bg-cream-dark hover:text-text-primary'
                                }`}
                              >
                                {branch.branchName}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Course Grid */}
          <div className="flex-1">
            <p className="text-sm text-text-muted mb-6">
              {isLoading ? 'Loading...' : `Showing ${filtered.length} courses`}
            </p>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-text-muted mb-4">No courses found matching your filters.</p>
                <Button variant="ghost" onClick={() => dispatch(resetFilters())}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to="/courses/$courseId"
                      params={{ courseId: course.id }}
                      className="group block"
                    >
                      <div className="bg-white rounded-2xl overflow-hidden border border-cream-dark shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                        <div className="relative overflow-hidden h-48">
                          <img
                            src={course.imageUrl}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-3 left-3">
                            <Badge variant="gold">{course.category.replace('-', ' ')}</Badge>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-text-primary font-[family-name:var(--font-display)] mb-2 group-hover:text-maroon transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-text-muted mb-4 line-clamp-2">{course.description}</p>
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                              <Clock className="w-3.5 h-3.5 text-maroon" />{course.duration}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                              <BarChart3 className="w-3.5 h-3.5 text-gold-dark" />{course.level}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export const Route = createFileRoute('/courses/')(
  {
    component: CoursesPage,
  }
)
