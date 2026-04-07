import { useState, useEffect } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, MapPin, ChevronDown, LogOut, User } from 'lucide-react'
import { selectUser, selectIsAuthenticated, clearUser } from '../../features/auth/authSlice'
import { selectSelectedCity, setSelectedCity, selectIsMobileMenuOpen, toggleMobileMenu } from '../../features/ui/uiSlice'
import { auth } from '../../lib/firebase'
import { signOut } from 'firebase/auth'
import { CITIES } from '../../constants/cityList'
import { CATEGORIES } from '../../constants/courseCategories'
import Button from '../ui/Button'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [cityDropdown, setCityDropdown] = useState(false)
  
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const selectedCity = useSelector(selectSelectedCity)
  const isMobileMenuOpen = useSelector(selectIsMobileMenuOpen)
  const dispatch = useDispatch()
  const router = useRouterState()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobileMenuOpen) dispatch(toggleMobileMenu())
  }, [router.location.pathname, dispatch, isMobileMenuOpen])

  const handleLogout = async () => {
    await signOut(auth)
    dispatch(clearUser())
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 py-4 px-4 sm:px-6 md:px-8 pointer-events-none flex justify-center">
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`
            pointer-events-auto rounded-full transition-all duration-500 ease-out flex items-center justify-between
            ${scrolled ? 'w-full max-w-5xl glass-dark shadow-2xl py-3 px-6' : 'w-full max-w-7xl bg-transparent py-4 px-2'}
          `}
        >
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="https://www.rwskill.edu.in/wp-content/uploads/2025/11/rnw-logo.webp" 
              alt="RW" 
              className={`transition-all duration-300 object-contain ${scrolled ? 'h-8 w-auto' : 'h-10 w-auto'}`} 
            />
          </Link>

          {/* Center: Desktop Links (Hidden when scrolled severely to save space, or keep tight) */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/courses" className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${scrolled ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-text-secondary hover:text-text-primary hover:bg-base-100'}`}>
              Programs
            </Link>
            <Link to="/about" className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${scrolled ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-text-secondary hover:text-text-primary hover:bg-base-100'}`}>
              Story
            </Link>
            <Link to="/contact" className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${scrolled ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-text-secondary hover:text-text-primary hover:bg-base-100'}`}>
              Contact
            </Link>
            
            {/* City Selector */}
            <div className="relative ml-2">
              <button
                onClick={() => setCityDropdown(!cityDropdown)}
                onBlur={() => setTimeout(() => setCityDropdown(false), 200)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  scrolled ? 'border-white/20 text-white/90 hover:bg-white/10' : 'border-base-200 text-text-secondary hover:bg-base-100'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span className="max-w-[80px] truncate">{selectedCity}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${cityDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {cityDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 md:left-1/2 md:-translate-x-1/2 mt-2 w-64 max-h-[70vh] overflow-y-auto custom-scrollbar glass rounded-2xl p-2 shadow-xl border border-black/5"
                  >
                    {Object.entries(
                      CITIES.reduce((acc, city) => {
                        const [primary, branch] = city.name.split(' - ')
                        if (!acc[primary]) acc[primary] = []
                        acc[primary].push({ ...city, branchName: branch || 'Main Branch' })
                        return acc
                      }, {})
                    ).map(([cityName, branches]) => (
                      <div key={cityName} className="mb-1">
                        <div className="text-xs font-bold text-text-muted uppercase tracking-widest px-3 py-2">
                          {cityName}
                        </div>
                        <div className="space-y-0.5">
                          {branches.map(branch => (
                            <button
                              key={branch.id}
                              onClick={() => {
                                dispatch(setSelectedCity(branch.name))
                                setCityDropdown(false)
                              }}
                              className={`w-full text-left px-3 py-2 text-sm rounded-xl transition-colors truncate block ${
                                branch.name === selectedCity ? 'bg-base-950 text-white' : 'text-text-secondary hover:bg-base-100 hover:text-base-950'
                              }`}
                            >
                              {branch.branchName}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors border ${
                    scrolled ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-base-100 border-base-200 text-base-950 hover:bg-base-200'
                  }`}>
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                </Link>
                <button onClick={handleLogout} className={`p-2 rounded-full transition-colors ${scrolled ? 'text-white/50 hover:text-white hover:bg-white/10' : 'text-text-muted hover:text-error hover:bg-error/10'}`}>
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/auth/login" className={`text-sm font-medium transition-colors ${scrolled ? 'text-white/80 hover:text-white' : 'text-text-secondary hover:text-text-primary'}`}>
                  Log in
                </Link>
                <Link to="/auth/register">
                  <Button variant={scrolled ? 'outline' : 'primary'} size="sm" className={scrolled ? 'border-white/30 text-white hover:bg-white/10 backdrop-blur-md' : ''}>
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => dispatch(toggleMobileMenu())}
            className={`md:hidden p-2 -mr-2 rounded-full transition-colors ${scrolled ? 'text-white hover:bg-white/10' : 'text-text-primary hover:bg-base-100'}`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </motion.nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white/90 backdrop-blur-xl pt-24 pb-8 px-6 overflow-y-auto"
          >
            <div className="flex flex-col gap-6 max-w-md mx-auto">
              <Link to="/courses" className="text-3xl font-bold font-[family-name:var(--font-display)] tracking-tight">Programs</Link>
              <Link to="/about" className="text-3xl font-bold font-[family-name:var(--font-display)] tracking-tight">Story</Link>
              <Link to="/contact" className="text-3xl font-bold font-[family-name:var(--font-display)] tracking-tight">Contact</Link>
              
              <div className="h-px bg-base-200 my-4" />

              <div className="space-y-4">
                <p className="text-sm font-medium text-text-muted uppercase tracking-widest">Select Location</p>
                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(
                    CITIES.reduce((acc, city) => {
                      const [primary, branch] = city.name.split(' - ')
                      if (!acc[primary]) acc[primary] = []
                      acc[primary].push({ ...city, branchName: branch || 'Main' })
                      return acc
                    }, {})
                  ).map(([cityName, branches]) => (
                    <div key={cityName}>
                      <span className="text-xs font-semibold text-text-primary uppercase tracking-widest pl-1">{cityName}</span>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {branches.map(branch => (
                           <button
                            key={branch.id}
                            onClick={() => dispatch(setSelectedCity(branch.name))}
                            className={`text-left px-3 py-2 rounded-xl text-xs border truncate ${
                              branch.name === selectedCity ? 'bg-base-950 text-white border-base-950' : 'bg-transparent text-text-secondary border-base-200'
                            }`}
                          >
                            {branch.branchName}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-base-200 my-4" />

              {isAuthenticated ? (
                <div className="space-y-4">
                  <Link to="/dashboard">
                    <Button variant="outline" className="w-full justify-start gap-3">
                      <User className="w-5 h-5" /> Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-3 text-error hover:text-error hover:bg-error/10">
                    <LogOut className="w-5 h-5" /> Sign Out
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/auth/login"><Button variant="outline" className="w-full">Log In</Button></Link>
                  <Link to="/auth/register"><Button variant="primary" className="w-full">Sign Up</Button></Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
