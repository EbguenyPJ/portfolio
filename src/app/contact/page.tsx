'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import ContactForm from '@/components/contact/ContactForm'

const EcaillesScene = dynamic(() => import('@/components/EcaillesScene'), { ssr: false })

export default function ContactPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', position: 'relative' }}>

      {/* Écailles background — reduced opacity */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <EcaillesScene className="w-full h-full" colorTexture="color2" opacity={0.25} />
      </div>

      {/* Content */}
      <div className="relative z-10 pt-40 pb-24 px-8 md:px-24">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p style={{ fontFamily: 'var(--font-syne)', fontSize: '0.7rem', letterSpacing: '0.3em', color: 'var(--accent-green)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              Contact
            </p>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.03em', color: 'var(--fg)', marginBottom: '1rem' }}>
              Let&apos;s build
              <br />
              <span style={{ color: 'var(--accent-rose)' }}>something serious.</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '1rem', fontWeight: 300, color: 'rgba(242,240,236,0.5)', marginBottom: '3rem', lineHeight: 1.7 }}>
              Open to high-impact engineering roles, Agentic AI architecture consulting, and technical co-founder conversations.
              If you have a problem worth solving at scale, I&apos;d like to hear about it.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              border: '1px solid rgba(242,240,236,0.08)',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(242,240,236,0.03)',
            }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
