'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import dynamic from 'next/dynamic'

const EcaillesScene = dynamic(() => import('@/components/EcaillesScene'), { ssr: false })

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])
  const heroScale   = useTransform(scrollYProgress, [0, 0.4], [1, 0.95])

  return (
    <div ref={containerRef} style={{ background: 'var(--bg)' }}>

      {/* ── Hero Section ──────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden">

        {/* Écailles background */}
        <EcaillesScene className="absolute inset-0 w-full h-full" colorTexture="color2" />

        {/* Overlay UI */}
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 flex flex-col justify-end pb-20 px-8 md:px-16 pointer-events-none"
        >
          {/* Main title — mix-blend-mode: difference */}
          <div style={{ mixBlendMode: 'difference' }}>
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'var(--font-syne)',
                fontSize: 'clamp(3.5rem, 9vw, 11rem)',
                fontWeight: 800,
                lineHeight: 0.9,
                letterSpacing: '-0.03em',
                color: 'white',
              }}
            >
              Ebgueny
              <br />
              PJ
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: 'clamp(0.9rem, 1.8vw, 1.4rem)',
                fontWeight: 300,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'white',
                marginTop: '1.5rem',
              }}
            >
              Architecting the <span style={{ color: '#f0a8c8' }}>unseen</span>.
            </motion.p>

            {/* Tech stack pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-2 mt-5"
            >
              {['NestJS', 'Next.js', 'Turborepo', 'PostgreSQL', 'Agentic AI'].map((tech) => (
                <span key={tech} style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  fontSize: '0.6rem',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 999,
                  padding: '3px 10px',
                  backdropFilter: 'blur(4px)',
                  transition: 'color 0.2s, border-color 0.2s',
                  pointerEvents: 'auto' as const,
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FFFFFF'
                    e.currentTarget.style.borderColor = '#666'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                  }}
                >
                  {tech}
                </span>
              ))}
            </motion.div>

            {/* Role subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: 'clamp(0.75rem, 1.1vw, 0.9rem)',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.45)',
                marginTop: '1.25rem',
                lineHeight: 1.7,
                maxWidth: '48ch',
              }}
            >
              Full Stack Engineer — Multi-Tenant architectures, Offline-First systems, and Agentic AI orchestration for scalable ecosystems.
            </motion.p>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 right-8 md:right-16 flex items-center gap-3 pointer-events-auto"
            style={{ mixBlendMode: 'difference' }}
          >
            <span style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '0.7rem', letterSpacing: '0.2em', color: 'white', textTransform: 'uppercase' }}>
              Scroll
            </span>
            <motion.div
              animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              style={{ width: 1, height: 32, background: 'var(--accent-green)', transformOrigin: 'top' }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Manifesto Section ────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center justify-center px-8 md:px-24"
        style={{ background: 'var(--bg)' }}
      >
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              style={{
                fontFamily: 'var(--font-syne)',
                fontSize: 'clamp(0.65rem, 1vw, 0.8rem)',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'var(--accent-green)',
                marginBottom: '2.5rem',
              }}
            >
              Philosophy
            </p>

            <h2
              style={{
                fontFamily: 'var(--font-syne)',
                fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                color: 'var(--fg)',
                marginBottom: '2rem',
              }}
            >
              The frontend is the vehicle.
              <br />
              <span style={{ color: 'var(--accent-rose)' }}>The backend is the destination.</span>
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: 'clamp(1rem, 1.4vw, 1.2rem)',
                fontWeight: 300,
                lineHeight: 1.8,
                color: 'rgba(242,240,236,0.6)',
                maxWidth: '60ch',
                marginBottom: '3.5rem',
              }}
            >
              I architect digital ecosystems that abstract real-world complexity. 
              True scale isn&apos;t just about handling raw traffic; it&apos;s about building resilient, 
              offline-capable infrastructures that empower businesses to operate without friction.
              The visual craft is proof that the engineering standard extends to every layer of the stack.
            </p>

            <Link href="/projects">
              <motion.div
                whileHover={{ x: 8 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center gap-4 group"
              >
                <span
                  style={{
                    fontFamily: 'var(--font-syne)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--fg)',
                  }}
                >
                  View Projects
                </span>
                <span
                  style={{
                    display: 'inline-block',
                    width: 48,
                    height: 1,
                    background: 'var(--accent-green)',
                    transition: 'transform 0.3s ease',
                    transformOrigin: 'left',
                  }}
                  className="group-hover:scale-x-150"
                />
              </motion.div>
            </Link>
          </motion.div>

          {/* Architectural Pillars */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-4"
            style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}
          >
            {[
              {
                value: '100%',
                subtitle: 'Data Isolation',
                label: 'Database-Per-Tenant Architecture',
                desc: 'Master and tenant databases with runtime dependency injection based on subdomain resolution. Every tenant\'s financial and inventory data is hermetically isolated via dedicated PostgreSQL instances managed through a pooled DataSource Map.',
              },
              {
                value: 'Zero-Downtime',
                subtitle: 'POS',
                label: 'Offline-First & Sync Queues',
                desc: 'Point of Sale built on Next.js + Dexie.js (IndexedDB) capable of processing sales without connectivity. A robust sync-queue reconciles transactions, cash register sessions, and inventory automatically when the connection is restored.',
              },
              {
                value: 'Event-Driven',
                subtitle: 'Core',
                label: 'Background Workers & Queues',
                desc: 'Heavy processes decoupled via BullMQ workers: async report generation (PDF/Excel) uploaded to S3, automated Stripe billing, and multichannel notifications (WhatsApp via Meta Cloud API + Email) processed in background without blocking the event loop.',
              },
            ].map(({ value, subtitle, label, desc }) => (
              <div key={value} style={{
                display: 'flex', flexDirection: 'column', gap: 10,
                padding: '1.25rem 0',
                borderBottom: '1px solid var(--border)',
              }}>
                {/* Title — stacked vertically for clean wrapping */}
                <div style={{ lineHeight: 1.1 }}>
                  <span style={{
                    fontFamily: 'var(--font-syne)',
                    fontSize: 'clamp(1.4rem, 2.4vw, 1.9rem)',
                    fontWeight: 800,
                    color: 'var(--fg)',
                  }}>
                    {value}
                  </span>
                  {' '}
                  <span style={{
                    fontFamily: 'var(--font-syne)',
                    fontSize: 'clamp(1.4rem, 2.4vw, 1.9rem)',
                    fontWeight: 800,
                    color: 'var(--fg)',
                  }}>
                    {subtitle}
                  </span>
                </div>
                <span style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.12em',
                  color: 'var(--accent-green)',
                  textTransform: 'uppercase',
                }}>
                  {label}
                </span>
                <p style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  fontSize: '0.84rem',
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: 'rgba(242,240,236,0.45)',
                  marginTop: 2,
                }}>
                  {desc}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Ecosystem Section ───────────────────────────────── */}
      <section
        className="px-8 md:px-24 py-20"
        style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mx-auto"
        >
          <p style={{
            fontFamily: 'var(--font-syne)',
            fontSize: 'clamp(0.65rem, 1vw, 0.8rem)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--accent-green)',
            marginBottom: '1.5rem',
          }}>
            Flagship Project: Nivo
          </p>

          <h2 style={{
            fontFamily: 'var(--font-syne)',
            fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: 'var(--fg)',
            marginBottom: '1.25rem',
          }}>
            One Monorepo. Shared Truth.
          </h2>

          <p style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)',
            fontWeight: 300,
            lineHeight: 1.75,
            color: 'rgba(242,240,236,0.5)',
            maxWidth: '62ch',
            marginBottom: '2.5rem',
          }}>
            The architecture behind the metrics above. To scale without friction, Nivo is designed as a modular ecosystem: five frontend applications and a NestJS backend sharing types, database schemas, and UI through unified packages — all orchestrated in a single Turborepo.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Apps */}
            <div>
              <span style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: '0.62rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(242,240,236,0.35)',
                display: 'block',
                marginBottom: '1rem',
              }}>
                Apps
              </span>
              <div className="flex flex-col gap-3">
                {[
                  { name: 'API',        tech: 'NestJS',       desc: '190+ source files · 120+ endpoints' },
                  { name: 'POS Admin',  tech: 'Next.js 14',   desc: 'Offline-first with Dexie.js' },
                  { name: 'Storefront', tech: 'Next.js 14',   desc: 'SSR e-commerce · Stripe Elements' },
                  { name: 'Mobile B2B', tech: 'Expo Router',  desc: 'Barcode scanner · delivery tracking' },
                  { name: 'Mobile B2C', tech: 'Expo Router',  desc: 'Stripe SDK · loyalty · click & collect' },
                ].map(({ name, tech, desc }) => (
                  <div key={name} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 16px',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    transition: 'background 0.2s',
                    cursor: 'default',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(242,240,236,0.03)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <span style={{ fontFamily: 'var(--font-syne)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--fg)', minWidth: '6.5rem' }}>
                      {name}
                    </span>
                    <span style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '0.7rem', color: 'var(--accent-green)', letterSpacing: '0.08em', minWidth: '5.5rem' }}>
                      {tech}
                    </span>
                    <span style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '0.72rem', color: 'rgba(242,240,236,0.4)', fontWeight: 300 }}>
                      {desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Packages */}
            <div>
              <span style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: '0.62rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(242,240,236,0.35)',
                display: 'block',
                marginBottom: '1rem',
              }}>
                Shared Packages
              </span>
              <div className="flex flex-col gap-3">
                {[
                  { name: '@nivo/database', desc: '86 TypeORM entities · master + tenant schemas' },
                  { name: '@nivo/types',    desc: 'Unified DTOs · shared interfaces across all apps' },
                  { name: '@nivo/ui',       desc: 'Shadcn/ui component library · Tailwind config' },
                  { name: '@nivo/eslint',   desc: 'Shared ESLint rules for consistent code standards' },
                ].map(({ name, desc }) => (
                  <div key={name} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 16px',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    transition: 'background 0.2s',
                    cursor: 'default',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(242,240,236,0.03)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <span style={{ fontFamily: 'var(--font-syne)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-rose)', minWidth: '8rem' }}>
                      {name}
                    </span>
                    <span style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '0.72rem', color: 'rgba(242,240,236,0.4)', fontWeight: 300 }}>
                      {desc}
                    </span>
                  </div>
                ))}
              </div>

              <p style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: '0.78rem',
                fontWeight: 300,
                lineHeight: 1.7,
                color: 'rgba(242,240,236,0.4)',
                marginTop: '1.5rem',
              }}>
                Orchestrated with Turborepo for parallel CI/CD pipelines and remote build caching.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
