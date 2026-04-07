import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useSelector } from 'react-redux'
import { selectIsEnrollModalOpen } from '../features/ui/uiSlice'
import { closeEnrollModal } from '../features/ui/uiSlice'
import { useDispatch } from 'react-redux'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import EnrollForm from '../components/forms/EnrollForm'

function RootComponent() {
  const isEnrollOpen = useSelector(selectIsEnrollModalOpen)
  const dispatch = useDispatch()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <EnrollForm isOpen={isEnrollOpen} onClose={() => dispatch(closeEnrollModal())} />
    </div>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
