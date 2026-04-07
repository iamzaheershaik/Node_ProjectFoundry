import { createFileRoute } from '@tanstack/react-router'
import PageWrapper from '../components/layout/PageWrapper'
import Hero from '../components/sections/Hero'
import StatsBar from '../components/sections/StatsBar'
import CategoryStrip from '../components/sections/CategoryStrip'
import WhyRWSkill from '../components/sections/WhyRWSkill'
import FeaturedCourses from '../components/sections/FeaturedCourses'
import TrustLegacy from '../components/sections/TrustLegacy'
import Mentors from '../components/sections/Mentors'
import Testimonials from '../components/sections/Testimonials'
import Awards from '../components/sections/Awards'
import CTASection from '../components/sections/CTASection'

function HomePage() {
  return (
    <PageWrapper>
      <Hero />
      <StatsBar />
      <CategoryStrip />
      <WhyRWSkill />
      <FeaturedCourses />
      <TrustLegacy />
      <Mentors />
      <Testimonials />
      <Awards />
      <CTASection />
    </PageWrapper>
  )
}

export const Route = createFileRoute('/')(
  {
    component: HomePage,
  }
)
