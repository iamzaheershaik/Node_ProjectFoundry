import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { Clock, BarChart3, MapPin, ChevronDown, ChevronUp, ArrowLeft, ArrowRight, FileDown } from 'lucide-react'
import jsPDF from 'jspdf'
import { useGetCourseByIdQuery } from '../../features/courses/coursesApi'
import { openEnrollModal } from '../../features/ui/uiSlice'
import { COURSES } from '../../constants/courseData'
import PageWrapper from '../../components/layout/PageWrapper'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'

function CourseDetailPage() {
  const { courseId } = Route.useParams()
  const dispatch = useDispatch()
  const { data: course, isLoading } = useGetCourseByIdQuery(courseId)
  const [openAccordion, setOpenAccordion] = useState(0)

  const related = COURSES.filter(c => c.category === course?.category && c.id !== courseId).slice(0, 3)

  const handleDownloadBrochure = async () => {
    if (!course) return;
    
    // We will show a quick processing state if needed, but it's fast enough
    const doc = new jsPDF()
    let yPos = 25

    // ── Header/Branding ──
    try {
      // Async load local logo payload to embed in PDF
      const response = await fetch('/images/rw-logo.png')
      const blob = await response.blob()
      const base64data = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(blob)
      })
      if (base64data) {
        doc.addImage(base64data, 'PNG', 20, 15, 12, 12)
      }
    } catch (e) {
      console.warn("Could not load logo for PDF", e)
    }

    doc.setFontSize(24)
    doc.setTextColor(143, 5, 0) // Maroon brand color
    doc.text("RW Skill Education", 35, 25)
    
    doc.setFontSize(10)
    doc.setTextColor(120, 120, 120)
    doc.text("Industry-Focused Training Programs", 35, 30)
    
    doc.setLineWidth(0.5)
    doc.setDrawColor(220, 220, 220)
    doc.line(20, 35, 190, 35)
    
    yPos = 50

    // ── Course Title ──
    doc.setFontSize(18)
    doc.setTextColor(30, 30, 30)
    const titleLines = doc.splitTextToSize(`Course Program: ${course.title}`, 170)
    doc.text(titleLines, 20, yPos)
    yPos += titleLines.length * 8 + 5
    
    // ── Course Details Grid ──
    doc.setFontSize(12)
    doc.setTextColor(50, 50, 50)
    doc.text(`Duration: ${course.duration || 'N/A'}`, 20, yPos)
    doc.text(`Difficulty Level: ${course.level || 'Beginner Friendly'}`, 100, yPos)
    yPos += 10
    
    doc.setLineWidth(0.2)
    doc.line(20, yPos, 190, yPos)
    yPos += 15

    // ── Course Overview ──
    doc.setFontSize(14)
    doc.setTextColor(143, 5, 0)
    doc.text("Program Overview", 20, yPos)
    yPos += 8
    
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    const descriptionText = course.description || "Comprehensive hands-on training module designed to provide practical exposure and real-world skills suitable for immediate industry placements."
    const splitDesc = doc.splitTextToSize(descriptionText, 170)
    doc.text(splitDesc, 20, yPos)
    yPos += splitDesc.length * 6 + 10
    
    // ── Curriculum ──
    if (course.curriculum && course.curriculum.length > 0) {
      doc.setFontSize(14)
      doc.setTextColor(143, 5, 0)
      doc.text("Detailed Curriculum", 20, yPos)
      yPos += 10

      course.curriculum.forEach((module, idx) => {
        // Page break logic
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
        
        doc.setFontSize(12)
        doc.setTextColor(30, 30, 30)
        doc.text(`Module ${idx + 1}: ${module.title}`, 20, yPos)
        yPos += 7

        doc.setFontSize(10)
        doc.setTextColor(80, 80, 80)
        module.topics.forEach((topic) => {
          if (yPos > 280) {
            doc.addPage()
            yPos = 20
          }
          doc.text(`• ${topic}`, 25, yPos)
          yPos += 6
        })
        yPos += 4
      })
    }
    
    // ── Footer ──
    if (yPos > 260) doc.addPage() // Force new page if footer overflows
    doc.setFontSize(10)
    doc.setTextColor(150, 150, 150)
    doc.text("For enrollment details, contact us at info@rwskill.edu.in or visit rwskill.edu.in", 20, 280)
    
    // Download File
    doc.save(`${course.title.replace(/\s+/g, '_')}_Brochure.pdf`)
  }

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="section-container py-20">
          <Skeleton className="h-80 w-full rounded-2xl mb-8" />
          <Skeleton className="h-10 w-2/3 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-40 w-full" />
        </div>
      </PageWrapper>
    )
  }

  if (!course) {
    return (
      <PageWrapper>
        <div className="section-container py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
          <Link to="/courses">
            <Button variant="ghost">← Back to Courses</Button>
          </Link>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="relative h-80 md:h-96 overflow-hidden">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="section-container">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> All Courses
            </Link>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="gold">{course.category.replace('-', ' ')}</Badge>
              <Badge variant="default">{course.level}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-[family-name:var(--font-display)]">
              {course.title}
            </h1>
          </div>
        </div>
      </section>

      <div className="section-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Overview */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] mb-4">
                About This Course
              </h2>
              <p className="text-text-secondary leading-relaxed">{course.description}</p>
              <div className="flex flex-wrap gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-maroon" />
                  <span className="text-sm"><strong>Duration:</strong> {course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-gold-dark" />
                  <span className="text-sm"><strong>Level:</strong> {course.level}</span>
                </div>
              </div>
            </div>

            {/* Curriculum Accordion */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] mb-6">
                Curriculum
              </h2>
              <div className="space-y-3">
                {course.curriculum?.map((module, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-cream-dark overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenAccordion(openAccordion === i ? -1 : i)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-cream-dark/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-maroon/10 text-maroon flex items-center justify-center text-sm font-bold">
                          {i + 1}
                        </span>
                        <span className="font-semibold font-[family-name:var(--font-display)]">
                          {module.title}
                        </span>
                      </div>
                      {openAccordion === i ? (
                        <ChevronUp className="w-5 h-5 text-text-muted" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-text-muted" />
                      )}
                    </button>
                    <motion.div
                      initial={false}
                      animate={{ height: openAccordion === i ? 'auto' : 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5">
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {module.topics?.map((topic) => (
                            <li key={topic} className="flex items-center gap-2 text-sm text-text-secondary">
                              <div className="w-1.5 h-1.5 bg-maroon rounded-full flex-shrink-0" />
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Courses */}
            {related.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] mb-6">
                  Related Courses
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {related.map((rc) => (
                    <Link
                      key={rc.id}
                      to="/courses/$courseId"
                      params={{ courseId: rc.id }}
                      className="group bg-white rounded-xl border border-cream-dark p-4 hover:shadow-md transition-all hover:-translate-y-1"
                    >
                      <img src={rc.imageUrl} alt={rc.title} className="w-full h-28 object-cover rounded-lg mb-3" loading="lazy" />
                      <h4 className="text-sm font-bold group-hover:text-maroon transition-colors">{rc.title}</h4>
                      <p className="text-xs text-text-muted mt-1">{rc.duration}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / Sticky CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border border-cream-dark shadow-lg p-6">
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-40 object-cover rounded-xl mb-5"
              />
              <h3 className="text-xl font-bold font-[family-name:var(--font-display)] mb-2">
                {course.title}
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Clock className="w-4 h-4 text-maroon" /> {course.duration}
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <BarChart3 className="w-4 h-4 text-gold-dark" /> {course.level}
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <MapPin className="w-4 h-4 text-teal" /> {course.cities?.length || 1} Locations
                </div>
              </div>
              <Button
                variant="secondary"
                size="lg"
                className="w-full mb-3"
                onClick={() => dispatch(openEnrollModal({ id: course.id, title: course.title }))}
              >
                Enroll Now
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="md" className="w-full relative group overflow-hidden border-cream hover:bg-base-050" onClick={handleDownloadBrochure}>
                <div className="absolute inset-0 w-1/4 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-[150%] skew-x-[-30deg] group-hover:animate-shine" />
                <FileDown className="w-4 h-4 mr-2 text-text-secondary group-hover:text-maroon transition-colors" />
                Download Brochure
              </Button>
              <p className="text-xs text-text-muted text-center mt-4">
                No entrance exams • No-cost EMI available
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export const Route = createFileRoute('/courses/$courseId')({
  component: CourseDetailPage,
})
