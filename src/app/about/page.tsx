'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const NodeGraph = dynamic(() => import('@/components/about/NodeGraph'), { ssr: false })

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Header */}
      <section className="pt-40 pb-16 px-8 md:px-24" style={{ borderBottom: '1px solid var(--border)' }}>
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          className="max-w-4xl"
        >
          <motion.p variants={fadeUp} style={{ fontFamily: 'var(--font-syne)', fontSize: '0.7rem', letterSpacing: '0.3em', color: 'var(--accent-green)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            About
          </motion.p>
          <motion.h1 variants={fadeUp} style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(2.5rem, 6vw, 6rem)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.03em', color: 'var(--fg)', marginBottom: '1.5rem' }}>
            Engineering <span style={{ color: 'var(--accent-rose)' }}>Profile</span>
          </motion.h1>
          <motion.p variants={fadeUp} style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', fontWeight: 300, color: 'rgba(242,240,236,0.55)', maxWidth: '62ch', lineHeight: 1.8 }}>
            With over a decade of technical evolution, from building monolithic systems and traditional ERPs to designing modern Cloud architectures, I specialize in the intersection between deep business logic and emerging technologies. My current focus combines agentic AI orchestration, offline-first systems, and multi-tenant B2B architectures, transforming complex enterprise requirements into scalable and resilient ecosystems.
          </motion.p>

          {/* Quick Stats */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-x-8 gap-y-3 mt-8">
            {[
              '10+ Years Experience',
              'Puebla, MX (CST)',
              'B2B SaaS',
              'Full-Stack & Architect',
            ].map((stat) => (
              <span
                key={stat}
                style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  color: '#EAEAEA',
                  borderLeft: '2px solid var(--accent-green)',
                  paddingLeft: 10,
                }}
              >
                {stat}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Node Graph */}
      <section className="px-8 md:px-24 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: '60vh', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', position: 'relative' }}
        >
          <NodeGraph />
        </motion.div>
      </section>

      {/* Principles & Focus */}
      <section className="px-8 md:px-24 py-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p style={{ fontFamily: 'var(--font-syne)', fontSize: '0.7rem', letterSpacing: '0.25em', color: 'var(--accent-green)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              Architecture Principles
            </p>
            <ul style={{ listStyle: 'none', padding: 0 }} className="space-y-6">
              {[
                { title: 'Zero-Trust Data Isolation', desc: 'In multi-tenant systems, a single leaked row is a business-ending event. Tenant boundaries must be enforced at the infrastructure level, not the application level.' },
                { title: 'Graceful Degradation', desc: 'Resilience is not optional. Mission-critical applications must maintain offline operations and reconcile state asynchronously without blocking the end user.' },
                { title: 'Structural Efficiency', desc: 'Minimize data redundancy through intelligent relational models and cascading computation engines — a single source of truth over thousands of duplicated rows.' },
                { title: 'AI with Safety Boundaries', desc: 'Agentic automation requires deterministic orchestration. Human-in-the-Loop is not a limitation — it is an architectural guarantee in enterprise environments.' },
              ].map(({ title, desc }) => (
                <li key={title}>
                  <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--fg)', margin: 0, marginBottom: 4 }}>
                    {title}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '0.9rem', fontWeight: 300, color: 'rgba(242,240,236,0.55)', lineHeight: 1.65, margin: 0 }}>
                    {desc}
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p style={{ fontFamily: 'var(--font-syne)', fontSize: '0.7rem', letterSpacing: '0.25em', color: 'var(--accent-rose)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              Current Focus
            </p>
            <ul style={{ listStyle: 'none', padding: 0 }} className="space-y-4">
              {[
                'Multi-tenant architectures (Database-per-tenant)',
                'Agentic AI engineering & LLM function calling',
                'Monorepo ecosystem design & CI/CD pipelines',
                'Offline-first systems with async reconciliation',
                'Technical leadership — aligning system architecture with business strategy to drive scalable SaaS growth',
              ].map((focus) => (
                <li key={focus} className="flex items-start gap-3">
                  <span style={{ color: 'var(--accent-rose)', marginTop: 2 }}>—</span>
                  <span style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '1rem', fontWeight: 300, color: 'rgba(242,240,236,0.7)', lineHeight: 1.6 }}>{focus}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid — ATS-readable tech stack */}
      <section className="px-8 md:px-24 py-16" style={{ borderTop: '1px solid var(--border)' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="max-w-5xl mx-auto"
        >
          <p style={{ fontFamily: 'var(--font-syne)', fontSize: '0.7rem', letterSpacing: '0.25em', color: 'var(--accent-green)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            Technical Toolbox
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { category: 'Languages', items: ['TypeScript', 'JavaScript', 'Java', 'PHP', 'Python', 'C'] },
              { category: 'Backend', items: ['NestJS', 'Node.js', 'Express', 'Laravel', 'TypeORM', 'Prisma'] },
              { category: 'Frontend', items: ['Next.js', 'React', 'React Native', 'Angular', 'Tailwind CSS', 'Framer Motion'] },
              { category: 'Data', items: ['PostgreSQL', 'Redis', 'MongoDB', 'MySQL', 'Dexie.js', 'BullMQ'] },
              { category: 'Cloud & Infra', items: ['Docker', 'AWS S3', 'Fedora Linux', 'Nginx', 'GitHub Actions', 'Turborepo'] },
              { category: 'AI & APIs', items: ['Gemini AI', 'Function Calling', 'Stripe', 'WhatsApp Cloud API', 'Socket.io', 'Swagger'] },
              { category: 'Patterns', items: ['Multi-Tenant', 'Offline-First', 'Event-Driven', 'CQRS', 'Repository Pattern', 'DDD'] },
              { category: 'Dev Tooling', items: ['Swagger / OpenAPI', 'ESLint / Prettier', 'Webpack', 'Vite', 'Puppeteer', 'Postman'] },
            ].map(({ category, items }) => (
              <div key={category} style={{
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '16px',
              }}>
                <span style={{
                  fontFamily: 'var(--font-syne)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(242,240,236,0.35)',
                  display: 'block',
                  marginBottom: 10,
                }}>
                  {category}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((item) => (
                    <span key={item} style={{
                      fontFamily: 'var(--font-space-grotesk)',
                      fontSize: '0.7rem',
                      fontWeight: 400,
                      color: 'rgba(242,240,236,0.65)',
                      background: 'rgba(242,240,236,0.04)',
                      border: '1px solid rgba(242,240,236,0.08)',
                      borderRadius: 6,
                      padding: '3px 8px',
                      transition: 'color 0.2s, border-color 0.2s, background 0.2s',
                      cursor: 'default',
                    }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--accent-green)'
                        e.currentTarget.style.borderColor = 'rgba(110,255,42,0.25)'
                        e.currentTarget.style.background = 'rgba(110,255,42,0.06)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'rgba(242,240,236,0.65)'
                        e.currentTarget.style.borderColor = 'rgba(242,240,236,0.08)'
                        e.currentTarget.style.background = 'rgba(242,240,236,0.04)'
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="px-8 md:px-24 py-24" style={{ borderTop: '1px solid var(--border)' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--fg)', marginBottom: '1rem' }}>
            Let&apos;s build something <span style={{ color: 'var(--accent-rose)' }}>together</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '1rem', fontWeight: 300, color: 'rgba(242,240,236,0.5)', marginBottom: '2.5rem', maxWidth: '48ch', marginLeft: 'auto', marginRight: 'auto' }}>
            Open to building AI-native B2B SaaS, deploying Agentic & RAG architectures, and technical co-founder opportunities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              style={{
                fontFamily: 'var(--font-syne)',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--accent-green)',
                background: 'transparent',
                border: '1px solid var(--accent-green)',
                padding: '14px 36px',
                borderRadius: 8,
                textDecoration: 'none',
                transition: 'background 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(110,255,42,0.08)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(110,255,42,0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Contact Me
            </Link>
            <a
              href="/cv-ebgueny.pdf"
              download
              style={{
                fontFamily: 'var(--font-syne)',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(242,240,236,0.6)',
                border: '1px solid var(--border)',
                padding: '14px 36px',
                borderRadius: 8,
                textDecoration: 'none',
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--fg)'
                e.currentTarget.style.color = '#fff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'rgba(242,240,236,0.6)'
              }}
            >
              Download CV
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
