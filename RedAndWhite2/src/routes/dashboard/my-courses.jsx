import { createFileRoute } from '@tanstack/react-router'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Calendar, MapPin } from 'lucide-react'
import { selectUser } from '../../features/auth/authSlice'
import { useGetMyEnrollmentsQuery } from '../../features/enrollments/enrollmentsApi'
import PageWrapper from '../../components/layout/PageWrapper'
import Badge from '../../components/ui/Badge'

function MyCoursesPage() {
  const user = useSelector(selectUser)
  const { data: enrollments = [], isLoading } = useGetMyEnrollmentsQuery(user?.uid, { skip: !user?.uid })

  return (
    <PageWrapper>
      <div className="section-container py-12">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-display)] mb-8">My Courses</h1>
        {isLoading ? (
          <p className="text-text-muted">Loading your courses...</p>
        ) : enrollments.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-muted mb-2">No enrollments yet.</p>
            <p className="text-sm text-text-muted">Browse our courses and enroll to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map((enrollment, i) => (
              <motion.div
                key={enrollment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-cream-dark p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold font-[family-name:var(--font-display)]">{enrollment.courseTitle}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-text-muted">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{enrollment.city}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Enrolled</span>
                  </div>
                </div>
                <Badge variant={enrollment.status === 'active' ? 'maroon' : enrollment.status === 'pending' ? 'gold' : 'default'}>
                  {enrollment.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}

export const Route = createFileRoute('/dashboard/my-courses')({
  component: MyCoursesPage,
})
