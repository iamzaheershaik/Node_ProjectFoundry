import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLoginWithEmailMutation, useLoginWithGoogleMutation } from '../../features/auth/authApi'
import { setUser } from '../../features/auth/authSlice'
import PageWrapper from '../../components/layout/PageWrapper'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loginWithEmail, { isLoading }] = useLoginWithEmailMutation()
  const [loginWithGoogle, { isLoading: isGoogleLoading }] = useLoginWithGoogleMutation()

  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    const result = await loginWithEmail(data)
    if (result.data) {
      dispatch(setUser(result.data))
      navigate({ to: '/' })
    } else if (result.error) {
      setError('root', { message: result.error.message })
    }
  }

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle()
    if (result.data) {
      dispatch(setUser(result.data))
      // Redirect to home page as requested
      navigate({ to: '/' })
    } else if (result.error) {
      setError('root', { message: result.error.message || 'Google Login failed.' })
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
                Welcome Back
              </h1>
              <p className="text-sm text-text-muted">Sign in to your RW Skill account</p>
            </div>

            {errors.root && (
              <div className="bg-error/10 border border-error/20 text-error text-sm rounded-xl p-3 mb-6">
                {errors.root.message}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Email"
                icon={Mail}
                type="email"
                placeholder="your@email.com"
                error={errors.email?.message}
                {...register('email')}
              />
              <div className="relative">
                <Input
                  label="Password"
                  icon={Lock}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-text-muted hover:text-text-primary"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <Button type="submit" loading={isLoading} className="w-full">
                Sign In
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cream-dark" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-3 text-text-muted">or</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              loading={isGoogleLoading}
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </Button>

            <p className="text-sm text-center text-text-muted mt-6">
              Don't have an account?{' '}
              <Link to="/auth/register" className="text-maroon font-semibold hover:underline">
                Register
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  )
}

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})
