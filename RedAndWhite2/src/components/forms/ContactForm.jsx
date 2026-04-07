import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateInquiryMutation } from '../../features/enrollments/enrollmentsApi'
import { useSelector } from 'react-redux'
import { selectSelectedCity } from '../../features/ui/uiSlice'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { Mail, Phone, User, MessageSquare } from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  message: z.string().min(10, 'Please write at least 10 characters'),
})

export default function ContactForm() {
  const selectedCity = useSelector(selectSelectedCity)
  const [createInquiry, { isLoading, isSuccess }] = useCreateInquiryMutation()
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data) => {
    await createInquiry({ ...data, city: selectedCity })
    reset()
  }

  if (isSuccess) {
    return (
      <div className="bg-success/10 border border-success/20 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-bold text-success font-[family-name:var(--font-display)] mb-2">
          Message Sent!
        </h3>
        <p className="text-text-secondary text-sm">
          Our counsellors will get back to you within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Full Name"
        icon={User}
        placeholder="Enter your name"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Email Address"
        icon={Mail}
        type="email"
        placeholder="your@email.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Phone Number"
        icon={Phone}
        type="tel"
        placeholder="+91 00000 00000"
        error={errors.phone?.message}
        {...register('phone')}
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-secondary font-[family-name:var(--font-display)]">
          Message
        </label>
        <textarea
          rows={4}
          placeholder="Tell us what you're looking for..."
          className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-maroon/30 focus:border-maroon transition-all duration-200 resize-none"
          {...register('message')}
        />
        {errors.message && (
          <p className="text-sm text-error">{errors.message.message}</p>
        )}
      </div>
      <Button type="submit" variant="primary" size="lg" className="w-full" loading={isLoading}>
        Send Message
      </Button>
    </form>
  )
}
