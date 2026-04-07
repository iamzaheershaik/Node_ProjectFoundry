import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { useCreateEnrollmentMutation } from '../../features/enrollments/enrollmentsApi'
import { selectUser } from '../../features/auth/authSlice'
import { selectSelectedCity, closeEnrollModal, selectEnrollModalCourse } from '../../features/ui/uiSlice'
import { COURSES } from '../../constants/courseData'
import { CITIES } from '../../constants/cityList'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'
import { User, Mail, Phone, CheckCircle2 } from 'lucide-react'

const stepSchemas = [
  z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
  }),
  z.object({
    courseId: z.string().min(1, 'Please select a course'),
    city: z.string().min(1, 'Please select a city'),
  }),
]

export default function EnrollForm({ isOpen, onClose }) {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({})
  const user = useSelector(selectUser)
  const selectedCity = useSelector(selectSelectedCity)
  const enrollCourse = useSelector(selectEnrollModalCourse)
  const dispatch = useDispatch()
  const [createEnrollment, { isLoading, isSuccess }] = useCreateEnrollmentMutation()

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(stepSchemas[step] || z.object({})),
    defaultValues: {
      name: user?.displayName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      courseId: enrollCourse?.id || '',
      city: selectedCity || '',
    },
  })

  const onSubmitStep = async (data) => {
    const merged = { ...formData, ...data }
    setFormData(merged)

    if (step === 0) {
      setStep(1)
    } else if (step === 1) {
      setStep(2) // Confirmation
    }
  }

  const handleConfirm = async () => {
    const courseName = COURSES.find(c => c.id === formData.courseId)?.title || formData.courseId
    await createEnrollment({
      ...formData,
      userId: user?.uid || 'anonymous',
      courseTitle: courseName,
    })
  }

  const handleClose = () => {
    setStep(0)
    setFormData({})
    reset()
    onClose()
  }

  if (isSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Enrollment" size="md">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mb-6">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h3 className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-primary mb-3">
            Enrollment Submitted!
          </h3>
          <p className="text-text-muted mb-6">
            Our team will contact you within 24 hours to confirm your enrollment.
          </p>
          <Button onClick={handleClose} variant="primary">Close</Button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Enroll Now" size="md">
      {/* Step indicators */}
      <div className="flex items-center gap-3 mb-8">
        {['Personal Info', 'Course & City', 'Confirm'].map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              i <= step ? 'bg-maroon text-white' : 'bg-cream-dark text-text-muted'
            }`}>
              {i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${i <= step ? 'text-maroon' : 'text-text-muted'}`}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.form
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSubmit(onSubmitStep)}
            className="space-y-5"
          >
            <Input label="Full Name" icon={User} placeholder="Your name" error={errors.name?.message} {...register('name')} />
            <Input label="Email" icon={Mail} type="email" placeholder="your@email.com" error={errors.email?.message} {...register('email')} />
            <Input label="Phone" icon={Phone} type="tel" placeholder="+91 00000 00000" error={errors.phone?.message} {...register('phone')} />
            <Button type="submit" className="w-full">Next Step</Button>
          </motion.form>
        )}

        {step === 1 && (
          <motion.form
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSubmit(onSubmitStep)}
            className="space-y-5"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-secondary font-[family-name:var(--font-display)]">Select Course</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-maroon/30"
                {...register('courseId')}
              >
                <option value="">Choose a course...</option>
                {COURSES.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
              {errors.courseId && <p className="text-sm text-error">{errors.courseId.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-secondary font-[family-name:var(--font-display)]">Preferred Branch</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-maroon/30"
                {...register('city')}
              >
                {CITIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              {errors.city && <p className="text-sm text-error">{errors.city.message}</p>}
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={() => setStep(0)} className="flex-1">Back</Button>
              <Button type="submit" className="flex-1">Review</Button>
            </div>
          </motion.form>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div className="bg-cream-dark rounded-xl p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Name</span>
                <span className="font-medium">{formData.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Email</span>
                <span className="font-medium">{formData.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Phone</span>
                <span className="font-medium">{formData.phone}</span>
              </div>
              <hr className="border-cream" />
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Course</span>
                <span className="font-medium">{COURSES.find(c => c.id === formData.courseId)?.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Branch</span>
                <span className="font-medium">{formData.city}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep(1)} className="flex-1">Edit</Button>
              <Button onClick={handleConfirm} loading={isLoading} className="flex-1">Confirm Enrollment</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  )
}
