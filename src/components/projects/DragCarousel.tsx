'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import Link from 'next/link'
import type { Project } from '@/data/projects'

interface Props {
  projects: Project[]
}

export default function DragCarousel({ projects }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragX = useMotionValue(0)
  const dragVelocity = useMotionValue(0)
  const [magnetPos, setMagnetPos] = useState({ x: 0, y: 0 })
  const [magnetActive, setMagnetActive] = useState(false)
  const magnetRef = useRef<HTMLAnchorElement>(null)

  // Background color per project
  const bgColors = ['#0D0D0D', '#0A0A10', '#0D0A0A', '#0A0A12']

  // Magnetic button
  const onMagnetMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top  + rect.height / 2
    setMagnetPos({ x: (e.clientX - cx) * 0.35, y: (e.clientY - cy) * 0.35 })
  }, [])

  const onMagnetLeave = useCallback(() => {
    setMagnetPos({ x: 0, y: 0 })
    setMagnetActive(false)
  }, [])

  const goTo = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(projects.length - 1, idx))
      setCurrent(clamped)
    },
    [projects.length],
  )

  // Drag handlers
  const onDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      setIsDragging(false)
      if (info.offset.x < -60 || info.velocity.x < -400) goTo(current + 1)
      else if (info.offset.x > 60 || info.velocity.x > 400) goTo(current - 1)
      animate(dragX, 0, { duration: 0.4, ease: [0.22, 1, 0.36, 1] })
    },
    [current, goTo, dragX],
  )

  const onDrag = useCallback(
    (_: unknown, info: { offset: { x: number } }) => {
      dragVelocity.set(info.offset.x)
    },
    [dragVelocity],
  )

  const project = projects[current]

  // Shader distortion magnitude based on drag
  const distortion = useTransform(dragX, [-200, 0, 200], [1, 0, 1])

  // ── Empty state ────────────────────────────────────────────────────────────
  if (projects.length === 0) {
    return (
      <div className="relative w-full h-screen overflow-hidden select-none flex items-center justify-center"
        style={{ background: '#0D0D0D' }}>
        <div className="text-center" style={{ maxWidth: '40ch' }}>
          <p style={{
            fontFamily:    'var(--font-syne)',
            fontSize:      '0.68rem',
            letterSpacing: '0.3em',
            color:         'var(--accent-green)',
            textTransform: 'uppercase',
            marginBottom:  '1.25rem',
          }}>
            Coming Soon
          </p>
          <h2 style={{
            fontFamily:    'var(--font-syne)',
            fontSize:      'clamp(2rem,5vw,4rem)',
            fontWeight:    800,
            color:         'var(--fg)',
            letterSpacing: '-0.03em',
            lineHeight:    1.05,
            marginBottom:  '1.5rem',
          }}>
            Projects
          </h2>
          <p style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize:   '0.95rem',
            fontWeight: 300,
            color:      'rgba(242,240,236,0.35)',
            lineHeight: 1.7,
          }}>
            Case studies are being prepared.<br />Check back soon.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen overflow-hidden select-none" style={{ background: bgColors[current] }}>

      {/* Section header — portfolio framing */}
      <div className="absolute top-8 left-8 md:left-24 z-20 pointer-events-none">
        <span style={{
          fontFamily:    'var(--font-space-grotesk)',
          fontSize:      '0.6rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color:         'var(--accent-rose)',
        }}>
          Selected Work
        </span>
      </div>

      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(242,240,236,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(242,240,236,0.03) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Project number — giant background */}
      <motion.div
        key={current}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <span
          style={{
            fontFamily: 'var(--font-syne)',
            fontSize: 'clamp(20rem, 40vw, 50rem)',
            fontWeight: 800,
            lineHeight: 1,
            color: 'rgba(242,240,236,0.03)',
            userSelect: 'none',
          }}
        >
          {project.index}
        </span>
      </motion.div>

      {/* Draggable area */}
      <motion.div
        ref={containerRef}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragStart={() => setIsDragging(true)}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        style={{ x: dragX, cursor: isDragging ? 'grabbing' : 'grab' }}
        className="absolute inset-0 flex items-center"
      >
        {/* Content */}
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full px-8 md:px-24 pointer-events-none"
        >
          <div className="max-w-3xl">
            {/* Index */}
            <motion.p
              style={{
                fontFamily: 'var(--font-syne)',
                fontSize: '0.7rem',
                letterSpacing: '0.3em',
                color: 'var(--accent-green)',
                textTransform: 'uppercase',
                marginBottom: '1.5rem',
              }}
            >
              {project.index} / {String(projects.length).padStart(2, '0')}
            </motion.p>

            {/* Title */}
            <h2
              style={{
                fontFamily: 'var(--font-syne)',
                fontSize: 'clamp(2.5rem, 6vw, 6rem)',
                fontWeight: 800,
                lineHeight: 1.0,
                letterSpacing: '-0.03em',
                color: 'var(--fg)',
                marginBottom: '1.5rem',
              }}
            >
              {project.title}
            </h2>

            {/* Tagline */}
            <p
              style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)',
                fontWeight: 300,
                color: 'rgba(242,240,236,0.55)',
                marginBottom: '2rem',
                maxWidth: '55ch',
                lineHeight: 1.6,
              }}
            >
              {project.tagline}
            </p>

            {/* Stack pills */}
            <div className="flex flex-wrap gap-2 mb-10">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  style={{
                    fontFamily: 'var(--font-space-grotesk)',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(242,240,236,0.7)',
                    border: '1px solid var(--border)',
                    borderRadius: '999px',
                    padding: '4px 14px',
                    transition: 'color 0.2s, border-color 0.2s',
                    pointerEvents: 'auto',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FFFFFF'
                    e.currentTarget.style.borderColor = '#666'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(242,240,236,0.7)'
                    e.currentTarget.style.borderColor = 'var(--border)'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Magnetic CTA */}
      <div className="absolute bottom-16 left-8 md:left-24 pointer-events-auto z-20">
        <Link
          ref={magnetRef}
          href={`/projects/${project.slug}`}
          onMouseEnter={() => setMagnetActive(true)}
          onMouseMove={onMagnetMouseMove}
          onMouseLeave={onMagnetLeave}
        >
          <motion.div
            animate={{
              x: magnetActive ? magnetPos.x : 0,
              y: magnetActive ? magnetPos.y : 0,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 28px',
              background: 'transparent',
              color: 'var(--accent-green)',
              border: '1px solid var(--accent-green)',
              borderRadius: '999px',
              fontFamily: 'var(--font-syne)',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
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
            Explore Architecture
            <span style={{ fontSize: '1rem' }}>→</span>
          </motion.div>
        </Link>
      </div>

      {/* Navigation — arrows + dots */}
      <div className="absolute bottom-16 right-8 md:right-24 flex items-center gap-1 z-20">
        {/* Previous arrow */}
        <button
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          style={{
            width: 44, height: 44,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'none', border: 'none', cursor: current === 0 ? 'default' : 'pointer',
            fontFamily: '"SF Mono", "Fira Code", monospace',
            fontSize: '1rem',
            color: current === 0 ? 'rgba(242,240,236,0.1)' : '#555',
            transition: 'color 0.2s, background 0.2s',
            borderRadius: 6,
          }}
          onMouseEnter={(e) => {
            if (current !== 0) {
              e.currentTarget.style.color = 'var(--accent-green)'
              e.currentTarget.style.background = 'rgba(110,255,42,0.1)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = current === 0 ? 'rgba(242,240,236,0.1)' : '#555'
            e.currentTarget.style.background = 'none'
          }}
        >
          ‹
        </button>

        {/* Dots */}
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: 44, height: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              const dot = e.currentTarget.firstElementChild as HTMLElement
              if (i !== current && dot) dot.style.background = '#EAEAEA'
            }}
            onMouseLeave={(e) => {
              const dot = e.currentTarget.firstElementChild as HTMLElement
              if (i !== current && dot) dot.style.background = '#555'
            }}
          >
            <span style={{
              width: i === current ? 20 : 6,
              height: 6,
              borderRadius: 999,
              background: i === current ? 'var(--accent-green)' : '#555',
              display: 'block',
              transition: 'all 0.3s ease',
            }} />
          </button>
        ))}

        {/* Next arrow */}
        <button
          onClick={() => goTo(current + 1)}
          disabled={current === projects.length - 1}
          style={{
            width: 44, height: 44,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'none', border: 'none',
            cursor: current === projects.length - 1 ? 'default' : 'pointer',
            fontFamily: '"SF Mono", "Fira Code", monospace',
            fontSize: '1rem',
            color: current === projects.length - 1 ? 'rgba(242,240,236,0.1)' : '#555',
            transition: 'color 0.2s, background 0.2s',
            borderRadius: 6,
          }}
          onMouseEnter={(e) => {
            if (current !== projects.length - 1) {
              e.currentTarget.style.color = 'var(--accent-green)'
              e.currentTarget.style.background = 'rgba(110,255,42,0.1)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = current === projects.length - 1 ? 'rgba(242,240,236,0.1)' : '#555'
            e.currentTarget.style.background = 'none'
          }}
        >
          ›
        </button>
      </div>

      {/* Drag hint */}
      <div
        className="absolute top-1/2 right-8 -translate-y-1/2 pointer-events-none"
        style={{
          fontFamily: 'var(--font-space-grotesk)',
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          color: 'rgba(242,240,236,0.38)',
          textTransform: 'uppercase',
          writingMode: 'vertical-rl',
          transform: 'translateY(-50%) rotate(180deg)',
        }}
      >
        drag to explore
      </div>

      {/* Distortion visual feedback line */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          width: 1,
          background: 'linear-gradient(to bottom, transparent, var(--accent-green), transparent)',
          opacity: useTransform(distortion, [0, 1], [0, 0.4]),
          x: dragX,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
