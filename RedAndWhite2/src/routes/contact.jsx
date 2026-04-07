import { createFileRoute } from '@tanstack/react-router'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { selectSelectedCity } from '../features/ui/uiSlice'
import { CITIES } from '../constants/cityList'
import PageWrapper from '../components/layout/PageWrapper'
import ContactForm from '../components/forms/ContactForm'

function ContactPage() {
  const selectedCity = useSelector(selectSelectedCity)
  const currentBranch = CITIES.find(c => c.name === selectedCity) || CITIES[0]

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="bg-surface-dark py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-gold/10 rounded-full blur-[100px]" />
        </div>
        <div className="section-container relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-display)] text-white mb-4">
            Get In <span className="text-gold">Touch</span>
          </h1>
          <p className="text-white/60 max-w-lg mx-auto">
            Book a free consultation with our career counsellors
          </p>
        </div>
      </section>

      <div className="section-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] mb-6">
              Send Us a Message
            </h2>
            <ContactForm />
          </motion.div>

          {/* Branch Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] mb-6">
              Visit Our Branch
            </h2>

            {/* Selected Branch */}
            <div className="bg-white rounded-2xl border border-cream-dark p-6 mb-6 shadow-sm">
              <h3 className="font-bold text-maroon font-[family-name:var(--font-display)] mb-4">
                {currentBranch.name}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-maroon flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-text-secondary">{currentBranch.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-maroon" />
                  <a href={`tel:${currentBranch.phone}`} className="text-sm text-text-secondary hover:text-maroon transition-colors">
                    {currentBranch.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-maroon" />
                  <a href="mailto:info@rwskill.edu.in" className="text-sm text-text-secondary hover:text-maroon transition-colors">
                    info@rwskill.edu.in
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-maroon" />
                  <p className="text-sm text-text-secondary">Mon - Sat: 9:00 AM - 7:00 PM</p>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="rounded-2xl overflow-hidden border border-cream-dark h-64">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720!2d${currentBranch.coordinates.lng}!3d${currentBranch.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDExJzQ1LjIiTiA3MsKwNDknNDkuMCJF!5e0!3m2!1sen!2sin!4v1`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Branch Location"
              />
            </div>

            {/* All Branches */}
            <h3 className="text-lg font-bold font-[family-name:var(--font-display)] mt-8 mb-4">All Branches</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CITIES.map((city) => (
                <div
                  key={city.id}
                  className={`p-3 rounded-xl text-sm border transition-colors cursor-default ${
                    city.name === selectedCity
                      ? 'border-maroon bg-maroon/5 text-maroon font-medium'
                      : 'border-cream-dark hover:border-maroon/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />
                    {city.name}
                  </div>
                  <p className="text-xs text-text-muted mt-1 ml-5.5">{city.phone}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  )
}

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})
