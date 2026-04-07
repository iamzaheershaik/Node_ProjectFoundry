import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { BookOpen, User, TrendingUp, Calendar, ArrowRight, Settings, LayoutDashboard } from 'lucide-react'
import { selectUser, selectIsAuthenticated } from '../../features/auth/authSlice'
import { useGetMyEnrollmentsQuery } from '../../features/enrollments/enrollmentsApi'
import PageWrapper from '../../components/layout/PageWrapper'
import Button from '../../components/ui/Button'

function DashboardPage() {
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const navigate = useNavigate()
  const { data: enrollments = [], isLoading } = useGetMyEnrollmentsQuery(user?.uid, {
    skip: !user?.uid,
  })

  if (!isAuthenticated) {
    return (
      <PageWrapper>
        <div className="section-container pt-40 pb-20 text-center min-h-[70vh] flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-maroon/10 rounded-full flex items-center justify-center mb-6">
            <User className="w-10 h-10 text-maroon" />
          </div>
          <h2 className="text-4xl font-bold font-[family-name:var(--font-display)] mb-4">Please Login</h2>
          <p className="text-text-muted mb-8 max-w-md mx-auto">You need to be logged in to view your learning dashboard and track your progress.</p>
          <Link to="/auth/login"><Button size="lg" className="w-48">Login</Button></Link>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      {/* ── Premium Dashboard Header ── */}
      <section className="relative pt-32 pb-16 bg-base-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-mesh-dark mix-blend-screen opacity-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-maroon/50 to-transparent" />
        
        <div className="section-container relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Avatar / Profile Picture */}
          <div className="w-24 h-24 shrink-0 rounded-3xl z-10 p-1 bg-gradient-to-br from-gold to-maroon relative overflow-hidden shadow-2xl">
            <div className="w-full h-full bg-base-900 rounded-[1.35rem] flex items-center justify-center overflow-hidden relative">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-white/50" />
              )}
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center md:text-left flex-1"
          >
            <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
              <span className="bg-maroon/20 text-maroon-light border border-maroon/30 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Student Panel</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-display)] tracking-tight mb-2">
              Welcome back, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-200">
                {user?.displayName || 'Student'}
              </span>
            </h1>
            <p className="text-white/60">Here's your learning progress and upcoming tasks.</p>
          </motion.div>
        </div>
      </section>

      {/* ── Dashboard Content ── */}
      <div className="section-container py-12 -mt-8 relative z-20">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {[
            { icon: BookOpen, label: 'Enrolled Courses', value: enrollments.length, gradient: 'from-maroon to-red-600', color: 'text-maroon' },
            { icon: TrendingUp, label: 'In Progress', value: enrollments.filter(e => e.status === 'active').length, gradient: 'from-amber-400 to-amber-600', color: 'text-amber-500' },
            { icon: Calendar, label: 'Pending', value: enrollments.filter(e => e.status === 'pending').length, gradient: 'from-blue-400 to-blue-600', color: 'text-blue-500' },
            { icon: LayoutDashboard, label: 'Profile Complete', value: user?.phone ? '100%' : '60%', gradient: 'from-emerald-400 to-emerald-600', color: 'text-emerald-500' },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl border border-cream shrink-0 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/4 group-hover:scale-150 transition-transform duration-700`} />
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-cream shrink-0`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-4xl font-bold font-[family-name:var(--font-display)] tracking-tight text-base-950">{stat.value}</p>
                </div>
                <p className="text-sm font-semibold text-text-muted relative z-10 uppercase tracking-wide">{stat.label}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Quick Links / Actions */}
        <h2 className="text-xl md:text-2xl font-bold font-[family-name:var(--font-display)] mb-6 tracking-tight">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/dashboard/my-courses"
            className="group bg-base-050 rounded-3xl border border-cream overflow-hidden transition-all duration-500 hover:shadow-xl flex flex-col h-full relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-maroon to-red-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            <div className="p-8 pb-10 flex-1 relative z-10">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-cream flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <BookOpen className="w-6 h-6 text-maroon" />
              </div>
              <h3 className="text-2xl font-bold font-[family-name:var(--font-display)] tracking-tight mb-2 group-hover:text-maroon transition-colors">My Courses</h3>
              <p className="text-sm text-text-muted leading-relaxed">Access your active enrollments, resume learning, and track your certification progress.</p>
            </div>
            <div className="p-4 px-8 border-t border-cream bg-white/50 flex items-center justify-between text-sm font-semibold text-maroon">
              View all courses
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </Link>

          <Link
            to="/dashboard/profile"
            className="group bg-base-050 rounded-3xl border border-cream overflow-hidden transition-all duration-500 hover:shadow-xl flex flex-col h-full relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-amber-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            <div className="p-8 pb-10 flex-1 relative z-10">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-cream flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Settings className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-2xl font-bold font-[family-name:var(--font-display)] tracking-tight mb-2 group-hover:text-gold-dark transition-colors">Profile Settings</h3>
              <p className="text-sm text-text-muted leading-relaxed">Manage your personal information, update your phone number, and customize your experience.</p>
            </div>
            <div className="p-4 px-8 border-t border-cream bg-white/50 flex items-center justify-between text-sm font-semibold text-gold-dark">
              Account settings
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </Link>
        </div>
      </div>
    </PageWrapper>
  )
}

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})
