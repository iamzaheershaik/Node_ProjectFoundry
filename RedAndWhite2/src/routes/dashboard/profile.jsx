import { createFileRoute } from '@tanstack/react-router'
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/auth/authSlice'
import PageWrapper from '../../components/layout/PageWrapper'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { User, Mail, Phone, MapPin } from 'lucide-react'

function ProfilePage() {
  const user = useSelector(selectUser)

  return (
    <PageWrapper>
      <div className="section-container py-12 max-w-2xl">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-display)] mb-8">Profile Settings</h1>
        <div className="bg-white rounded-2xl border border-cream-dark p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-maroon/10 rounded-full flex items-center justify-center">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-maroon" />
              )}
            </div>
            <div>
              <h2 className="font-bold font-[family-name:var(--font-display)]">{user?.displayName || 'Student'}</h2>
              <p className="text-sm text-text-muted">{user?.email}</p>
            </div>
          </div>

          <form className="space-y-5">
            <Input label="Full Name" icon={User} defaultValue={user?.displayName || ''} />
            <Input label="Email" icon={Mail} type="email" defaultValue={user?.email || ''} disabled />
            <Input label="Phone" icon={Phone} type="tel" defaultValue={user?.phone || ''} />
            <Input label="City" icon={MapPin} defaultValue={user?.city || ''} />
            <Button type="button" className="w-full">Update Profile</Button>
          </form>
        </div>
      </div>
    </PageWrapper>
  )
}

export const Route = createFileRoute('/dashboard/profile')({
  component: ProfilePage,
})
