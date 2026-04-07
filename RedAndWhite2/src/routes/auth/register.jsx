import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Phone } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { useRegisterWithEmailMutation } from '../../features/auth/authApi'
import { setUser } from '../../features/auth/authSlice'
import PageWrapper from '../../components/layout/PageWrapper'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone number required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [registerWithEmail, { isLoading }] = useRegisterWithEmailMutation()

  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data) => {
    const result = await registerWithEmail(data)
    if (result.data) {
      dispatch(setUser(result.data))
      navigate({ to: '/dashboard' })
    } else if (result.error) {
      setError('root', { message: result.error.message })
    }
  }

  return (
    <PageWrapper>
      <div className="min-h-[80vh] flex items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl border border-cream-dark shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-primary mb-2">
                Create Account
              </h1>
              <p className="text-sm text-text-muted">Start your learning journey with RW Skill</p>
            </div>

            {errors.root && (
              <div className="bg-error/10 border border-error/20 text-error text-sm rounded-xl p-3 mb-6">
                {errors.root.message}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Full Name" icon={User} placeholder="Your name" error={errors.name?.message} {...register('name')} />
              <Input label="Email" icon={Mail} type="email" placeholder="your@email.com" error={errors.email?.message} {...register('email')} />
              <Input label="Phone" icon={Phone} type="tel" placeholder="+91 00000 00000" error={errors.phone?.message} {...register('phone')} />
              <Input label="Password" icon={Lock} type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
              <Input label="Confirm Password" icon={Lock} type="password" placeholder="••••••••" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
              <Button type="submit" loading={isLoading} className="w-full">Create Account</Button>
            </form>

            <p className="text-sm text-center text-text-muted mt-6">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-maroon font-semibold hover:underline">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  )
}

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
})
