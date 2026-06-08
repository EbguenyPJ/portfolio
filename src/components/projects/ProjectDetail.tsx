'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Project, ArchNode, ArchEdge, ArchScope, ArchNodeType } from '@/data/projects'

// ─── Animation presets ────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
}
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
}
const inView = { once: true, margin: '-60px' }

// ─── Auto-fading image carousel ──────────────────────────────────────────────
function FadeCarousel({ images, interval = 4000, aspectRatio = '16/7', borderRadius = '12px 12px 0 0', gradient = true }: {
  images: string[]; interval?: number; aspectRatio?: string; borderRadius?: string; gradient?: boolean;
}) {
  const [index, setIndex] = React.useState(0)
  const [resetKey, setResetKey] = React.useState(0)

  React.useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % images.length), interval)
    return () => clearInterval(timer)
  }, [images.length, interval, resetKey])

  const goTo = (i: number) => {
    setIndex(i)
    setResetKey((k) => k + 1)
  }

  return (
    <div style={{ position: 'relative', aspectRatio, borderRadius, overflow: 'hidden', border: '1px solid var(--border)' }}>
      {images.map((src, i) => (
        <Image
          key={src + i}
          src={src}
          alt={`Slide ${i + 1}`}
          fill
          style={{
            objectFit:  'cover',
            opacity:    i === index ? 1 : 0,
            transition: 'opacity 1.2s ease',
            position:   'absolute',
            inset:      0,
          }}
        />
      ))}
      {gradient && (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 55%, var(--bg) 100%)', pointerEvents: 'none' }} />
      )}
      {/* Dot indicators */}
      {images.length > 1 && (
        <div style={{ position: 'absolute', bottom: gradient ? 20 : 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 2 }}>
          {images.map((_, i) => (
            <div
              key={i}
              onClick={() => goTo(i)}
              style={{
                padding:    '8px 0',
                cursor:     'pointer',
                display:    'flex',
                alignItems: 'center',
              }}
            >
              <div style={{
                width:        i === index ? 24 : 8,
                height:       8,
                borderRadius: 4,
                background:   i === index ? 'var(--accent-green)' : 'rgba(242,240,236,0.2)',
                transition:   'all 0.4s ease',
              }} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function ProjectDetail({ project }: { project: Project }) {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <HeroSection    project={project} />
      <SummarySection project={project} />
      <ChallengeSection project={project} />
      <ArchSection    project={project} />
      <FeaturesSection project={project} />
      <CodeSection    project={project} />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 0 — HERO
// ═══════════════════════════════════════════════════════════════════════════════
function HeroSection({ project }: { project: Project }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55 }}
      className="relative pt-40 pb-0 overflow-hidden"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      {/* Back link */}
      <div className="px-8 md:px-24 mb-14">
        <Link href="/projects">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="inline-flex items-center gap-2"
            style={{
              fontFamily:    'var(--font-space-grotesk)',
              fontSize:      '0.72rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color:         'rgba(242,240,236,0.35)',
              cursor:        'pointer',
              transition:    'color 0.2s',
              padding:       '8px 0',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-green)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(242,240,236,0.35)')}
          >
            <span style={{ fontFamily: '"SF Mono", "Fira Code", monospace' }}>←</span> All projects
          </motion.span>
        </Link>
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-8 md:px-24"
      >
        {/* Index */}
        <motion.p variants={fadeUp} style={{
          fontFamily: 'var(--font-syne)', fontSize: '0.68rem',
          letterSpacing: '0.32em', color: 'var(--accent-green)',
          textTransform: 'uppercase', marginBottom: '1.25rem',
        }}>
          Case Study · {project.index}
        </motion.p>

        {/* Title */}
        <motion.h1 variants={fadeUp} style={{
          fontFamily:    'var(--font-syne)',
          fontSize:      'clamp(2.6rem, 6vw, 6.5rem)',
          fontWeight:    800,
          lineHeight:    1.0,
          letterSpacing: '-0.03em',
          color:         'var(--fg)',
          maxWidth:      '14ch',
          marginBottom:  '1.75rem',
        }}>
          {project.title}
        </motion.h1>

        {/* Tagline — shown only in carousel, omitted here to avoid redundancy */}
      </motion.div>

      {/* Hero image — auto-fading carousel or single image */}
      {(project.heroImages && project.heroImages.length > 0) ? (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8, ease: EASE }}
          className="mx-8 md:mx-24 mt-4"
        >
          <FadeCarousel images={project.heroImages} interval={4500} aspectRatio="3/2" borderRadius="12px 12px 0 0" gradient />
        </motion.div>
      ) : project.heroImage ? (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8, ease: EASE }}
          className="relative mx-8 md:mx-24 mt-4"
          style={{ borderRadius: '12px 12px 0 0', overflow: 'hidden', border: '1px solid var(--border)', borderBottom: 'none', aspectRatio: '3/2' }}
        >
          <Image src={project.heroImage} alt={project.title} fill style={{ objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 55%, var(--bg) 100%)' }} />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8, ease: EASE }}
          className="mx-8 md:mx-24 mt-4"
          style={{ borderRadius: '12px 12px 0 0', border: '1px solid var(--border)', borderBottom: 'none', aspectRatio: '3/2', background: 'rgba(242,240,236,0.015)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(242,240,236,0.12)' }}>
            Project Screenshot · 1600 × 700
          </span>
        </motion.div>
      )}
    </motion.section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1 — EXECUTIVE SUMMARY  (description + metadata sidebar)
// ═══════════════════════════════════════════════════════════════════════════════
function SummarySection({ project }: { project: Project }) {
  const meta = [
    { label: 'Role',     value: project.role },
    { label: 'Year',     value: project.year },
    { label: 'Industry', value: project.industry },
  ]

  return (
    <motion.section
      variants={stagger} initial="hidden" whileInView="show" viewport={inView}
      className="px-8 md:px-24 py-20"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <SectionLabel index="01">Executive Summary</SectionLabel>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-16 mt-10">

        {/* Left — summary (distinct from tagline to avoid repetition) */}
        <motion.p variants={fadeUp} style={{
          fontFamily: 'var(--font-space-grotesk)',
          fontSize:   'clamp(1.05rem, 1.5vw, 1.3rem)',
          fontWeight: 300,
          color:      'rgba(242,240,236,0.7)',
          lineHeight: 1.85,
        }}>
          {project.summary}
        </motion.p>

        {/* Right — sidebar metadata */}
        <motion.aside variants={fadeUp}>
          {/* Meta rows */}
          <div style={{
            border:       '1px solid var(--border)',
            borderRadius: 10,
            overflow:     'hidden',
          }}>
            {meta.map(({ label, value }) => (
              <div key={label} style={{
                padding:      '14px 20px',
                borderBottom: '1px solid var(--border)',
                display:      'flex',
                flexDirection:'column',
                gap:          4,
              }}>
                <span style={{
                  fontFamily:    'var(--font-space-grotesk)',
                  fontSize:      '0.6rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color:         'rgba(242,240,236,0.3)',
                }}>
                  {label}
                </span>
                <span style={{
                  fontFamily: 'var(--font-syne)',
                  fontSize:   '0.9rem',
                  fontWeight: 600,
                  color:      'var(--fg)',
                }}>
                  {value || '—'}
                </span>
              </div>
            ))}

            {/* Stack */}
            <div style={{ padding: '14px 20px' }}>
              <span style={{
                fontFamily:    'var(--font-space-grotesk)',
                fontSize:      '0.6rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color:         'rgba(242,240,236,0.3)',
                display:       'block',
                marginBottom:  10,
              }}>
                Stack
              </span>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span key={tech} style={{
                    fontFamily:    'var(--font-space-grotesk)',
                    fontSize:      '0.65rem',
                    fontWeight:    500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color:         'rgba(242,240,236,0.7)',
                    border:        '1px solid var(--border)',
                    borderRadius:  999,
                    padding:       '3px 10px',
                    transition:    'color 0.2s, border-color 0.2s',
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
          </div>
        </motion.aside>
      </div>
    </motion.section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2 — THE CHALLENGE
// ═══════════════════════════════════════════════════════════════════════════════
function ChallengeSection({ project }: { project: Project }) {
  return (
    <motion.section
      variants={stagger} initial="hidden" whileInView="show" viewport={inView}
      className="px-8 md:px-24 py-20"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <SectionLabel index="02">The Challenge</SectionLabel>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-20 mt-10 items-start">
        {/* Decorative quotation mark */}
        <motion.span variants={fadeUp} style={{
          fontFamily: 'var(--font-syne)',
          fontSize:   'clamp(5rem, 10vw, 9rem)',
          fontWeight: 800,
          lineHeight: 0.8,
          color:      'rgba(110,255,42,0.12)',
          userSelect: 'none',
          display:    'block',
          marginTop:  '0.25rem',
        }}>
          "
        </motion.span>

        <motion.p variants={fadeUp} style={{
          fontFamily: 'var(--font-space-grotesk)',
          fontSize:   'clamp(1.1rem, 1.6vw, 1.45rem)',
          fontWeight: 300,
          color:      'rgba(242,240,236,0.75)',
          lineHeight: 1.85,
          maxWidth:   '72ch',
        }}>
          {project.problem}
        </motion.p>
      </div>
    </motion.section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3 — ARCHITECTURE  (PRIORIDAD ALTA)
// ═══════════════════════════════════════════════════════════════════════════════
function ArchSection({ project }: { project: Project }) {
  return (
    <motion.section
      variants={stagger} initial="hidden" whileInView="show" viewport={inView}
      className="px-8 md:px-24 py-20"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <SectionLabel index="03">Architecture</SectionLabel>

      {/* Prose explanation */}
      <motion.p variants={fadeUp} style={{
        fontFamily:  'var(--font-space-grotesk)',
        fontSize:    'clamp(1.05rem, 1.45vw, 1.25rem)',
        fontWeight:  300,
        color:       'rgba(242,240,236,0.7)',
        lineHeight:  1.85,
        maxWidth:    '72ch',
        marginTop:   '2rem',
        marginBottom:'3.5rem',
      }}>
        {project.architecture}
      </motion.p>

      {/* Diagram */}
      <motion.div variants={fadeUp}>
        <ArchDiagram nodes={project.archNodes} edges={project.archEdges} scopes={project.archScopes} />
      </motion.div>
    </motion.section>
  )
}

// ─── Architecture diagram ──────────────────────────────────────────────────────
const NODE_COLORS: Record<ArchNodeType, { fill: string; stroke: string; text: string }> = {
  client:   { fill: 'rgba(242,240,236,0.04)', stroke: 'rgba(242,240,236,0.25)', text: 'rgba(242,240,236,0.8)' },
  gateway:  { fill: 'rgba(110,255,42,0.06)',  stroke: 'rgba(110,255,42,0.5)',   text: '#6EFF2A' },
  service:  { fill: 'rgba(110,255,42,0.04)',  stroke: 'rgba(110,255,42,0.3)',   text: 'rgba(242,240,236,0.8)' },
  db:       { fill: 'rgba(240,168,200,0.06)', stroke: 'rgba(240,168,200,0.4)',  text: '#F0A8C8' },
  cache:    { fill: 'rgba(240,168,200,0.04)', stroke: 'rgba(240,168,200,0.25)', text: 'rgba(242,240,236,0.8)' },
  queue:    { fill: 'rgba(110,255,42,0.04)',  stroke: 'rgba(110,255,42,0.25)',  text: 'rgba(242,240,236,0.8)' },
  external: { fill: 'rgba(242,240,236,0.02)', stroke: 'rgba(242,240,236,0.12)', text: 'rgba(242,240,236,0.4)' },
}

function ArchDiagram({ nodes, edges, scopes }: { nodes?: ArchNode[]; edges?: ArchEdge[]; scopes?: ArchScope[] }) {
  // ── Placeholder when no data ───────────────────────────────────────────────
  if (!nodes || nodes.length === 0) {
    return (
      <div style={{
        border:        '1px dashed rgba(242,240,236,0.1)',
        borderRadius:  12,
        padding:       '4rem 2rem',
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           12,
        background:    'rgba(242,240,236,0.01)',
      }}>
        {/* Static placeholder diagram */}
        <svg viewBox="0 0 640 180" style={{ width: '100%', maxWidth: 640 }}>
          {/* Placeholder nodes */}
          {[
            { x: 60,  label: 'Client',   color: 'rgba(242,240,236,0.08)' },
            { x: 200, label: 'Gateway',  color: 'rgba(110,255,42,0.08)' },
            { x: 340, label: 'Service',  color: 'rgba(110,255,42,0.06)' },
            { x: 480, label: 'Database', color: 'rgba(240,168,200,0.08)' },
          ].map(({ x, label, color }, i, arr) => (
            <g key={label}>
              {i < arr.length - 1 && (
                <line
                  x1={x + 52} y1={90} x2={arr[i+1].x - 52} y2={90}
                  stroke="rgba(242,240,236,0.07)" strokeWidth={1} strokeDasharray="4 4"
                />
              )}
              <rect x={x - 52} y={66} width={104} height={48} rx={8}
                fill={color} stroke="rgba(242,240,236,0.07)" strokeWidth={1} />
              <text x={x} y={95} textAnchor="middle"
                style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 10,
                  fill: 'rgba(242,240,236,0.2)', letterSpacing: '0.05em' }}>
                {label}
              </text>
            </g>
          ))}
        </svg>
        <span style={{
          fontFamily:    'var(--font-space-grotesk)',
          fontSize:      '0.65rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color:         'rgba(242,240,236,0.12)',
        }}>
          Architecture diagram · Define archNodes + archEdges in projects.ts
        </span>
      </div>
    )
  }

  // ── Real diagram (explicit position layout) ─────────────────────────────
  const NODE_W  = 126
  const NODE_H  = 52
  const COL_GAP = 46
  const ROW_GAP = 62
  const PAD_X   = 44
  const PAD_Y   = 40

  // Derive grid dimensions from explicit col/row or fallback to auto
  const maxCol = nodes.reduce((m, n, i) => Math.max(m, n.col ?? (i % 3)), 0)
  const maxRow = nodes.reduce((m, n, i) => Math.max(m, n.row ?? Math.floor(i / 3)), 0)
  const COLS   = maxCol + 1
  const ROWS   = maxRow + 1
  const SVG_W  = PAD_X * 2 + COLS * NODE_W + (COLS - 1) * COL_GAP
  const SVG_H  = PAD_Y * 2 + ROWS * NODE_H + (ROWS - 1) * ROW_GAP

  // Assign positions — explicit col/row or auto-grid fallback
  const pos: Record<string, { x: number; y: number }> = {}
  nodes.forEach((n, i) => {
    const col = n.col ?? (i % 3)
    const row = n.row ?? Math.floor(i / 3)
    pos[n.id] = {
      x: PAD_X + col * (NODE_W + COL_GAP) + NODE_W / 2,
      y: PAD_Y + row * (NODE_H + ROW_GAP) + NODE_H / 2,
    }
  })

  // Helper: point where a line from `center` toward `target` exits the node rect
  const edgePoint = (center: { x: number; y: number }, target: { x: number; y: number }) => {
    const hw = NODE_W / 2 + 3, hh = NODE_H / 2 + 3
    const dx = target.x - center.x, dy = target.y - center.y
    if (dx === 0 && dy === 0) return { x: center.x, y: center.y }
    const tx = dx !== 0 ? hw / Math.abs(dx) : Infinity
    const ty = dy !== 0 ? hh / Math.abs(dy) : Infinity
    const t  = Math.min(tx, ty)
    return { x: center.x + dx * t, y: center.y + dy * t }
  }

  return (
    <div style={{
      border:       '1px solid var(--border)',
      borderRadius: 12,
      overflow:     'hidden',
      background:   'rgba(242,240,236,0.015)',
    }}>
      {/* Legend */}
      <div style={{
        padding:     '12px 20px',
        borderBottom:'1px solid var(--border)',
        display:     'flex',
        gap:         20,
        flexWrap:    'wrap',
      }}>
        {(['gateway','service','db','cache','external'] as ArchNodeType[]).map((t) => (
          <span key={t} style={{
            display:       'flex',
            alignItems:    'center',
            gap:           6,
            fontFamily:    'var(--font-space-grotesk)',
            fontSize:      '0.6rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color:         'rgba(242,240,236,0.3)',
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: 2,
              background: NODE_COLORS[t].stroke,
              display: 'inline-block',
            }} />
            {t}
          </span>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ width: '100%', display: 'block', padding: '12px 0' }}
      >
        {/* Arrow markers */}
        <defs>
          <marker id="arrowSolid" viewBox="0 0 10 8" refX="9" refY="4"
            markerWidth="7" markerHeight="6" orient="auto">
            <path d="M 0 0.5 L 9 4 L 0 7.5 z" fill="rgba(110,255,42,0.5)" />
          </marker>
          <marker id="arrowDashed" viewBox="0 0 10 8" refX="9" refY="4"
            markerWidth="7" markerHeight="6" orient="auto">
            <path d="M 0 0.5 L 9 4 L 0 7.5 z" fill="rgba(242,240,236,0.35)" />
          </marker>
          {/* Reverse markers for bidirectional arrows (markerStart) */}
          <marker id="arrowSolidRev" viewBox="0 0 10 8" refX="1" refY="4"
            markerWidth="8" markerHeight="7" orient="auto">
            <path d="M 10 0 L 1 4 L 10 8 z" fill="rgba(110,255,42,0.5)" />
          </marker>
          <marker id="arrowDashedRev" viewBox="0 0 10 8" refX="1" refY="4"
            markerWidth="8" markerHeight="7" orient="auto">
            <path d="M 10 0 L 1 4 L 10 8 z" fill="rgba(242,240,236,0.35)" />
          </marker>
        </defs>

        {/* Scope boxes — rendered behind edges and nodes */}
        {(scopes ?? []).map((scope, i) => {
          const scopePositions = scope.nodeIds.map(id => pos[id]).filter(Boolean)
          if (scopePositions.length === 0) return null
          const minX = Math.min(...scopePositions.map(p => p.x)) - NODE_W / 2 - 16
          const minY = Math.min(...scopePositions.map(p => p.y)) - NODE_H / 2 - 28
          const maxX = Math.max(...scopePositions.map(p => p.x)) + NODE_W / 2 + 16
          const maxY = Math.max(...scopePositions.map(p => p.y)) + NODE_H / 2 + 16
          return (
            <g key={`scope-${i}`}>
              <rect x={minX} y={minY} width={maxX - minX} height={maxY - minY}
                rx={10} fill="rgba(110,255,42,0.015)" stroke="rgba(110,255,42,0.12)"
                strokeWidth={1} strokeDasharray="4 3" />
              <text x={minX + 10} y={minY + 12}
                style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 7,
                  fill: 'rgba(110,255,42,0.3)', letterSpacing: '0.16em',
                  textTransform: 'uppercase' as const }}>
                {scope.label}
              </text>
            </g>
          )
        })}

        {/* Edges — curved paths with arrowhead markers */}
        {(edges ?? []).map((e, i) => {
          const a = pos[e.from], b = pos[e.to]
          if (!a || !b) return null

          // Start/end at rectangle border, not center
          const s  = edgePoint(a, b)
          const en = edgePoint(b, a)
          const dx = en.x - s.x, dy = en.y - s.y
          const isHoriz = Math.abs(dy) < 12
          const isVert  = Math.abs(dx) < 12

          // SVG path — straight for axis-aligned, bezier for diagonals
          let d: string
          if (isHoriz || isVert) {
            d = `M ${s.x} ${s.y} L ${en.x} ${en.y}`
          } else {
            d = `M ${s.x} ${s.y} C ${s.x} ${s.y + dy * 0.55}, ${en.x} ${en.y - dy * 0.55}, ${en.x} ${en.y}`
          }

          const mx = (s.x + en.x) / 2
          const my = (s.y + en.y) / 2
          const strokeColor = e.dashed ? 'rgba(242,240,236,0.18)' : 'rgba(110,255,42,0.25)'
          const markerId    = e.dashed ? 'arrowDashed' : 'arrowSolid'
          const markerRevId = e.dashed ? 'arrowDashedRev' : 'arrowSolidRev'

          return (
            <g key={i}>
              <path d={d} fill="none"
                stroke={strokeColor} strokeWidth={1.5}
                strokeDasharray={e.dashed ? '6 4' : undefined}
                markerEnd={`url(#${markerId})`}
                markerStart={e.bidir ? `url(#${markerRevId})` : undefined}
              />
              {e.label && (
                <g>
                  {/* Opaque background behind label */}
                  <rect
                    x={mx - e.label.length * 2.6 - 5}
                    y={my - 7}
                    width={e.label.length * 5.2 + 10}
                    height={14} rx={3}
                    fill="rgba(12,12,12,0.92)"
                  />
                  <text x={mx} y={my + 3} textAnchor="middle"
                    style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 8,
                      fill: 'rgba(242,240,236,0.35)', letterSpacing: '0.06em' }}>
                    {e.label}
                  </text>
                </g>
              )}
            </g>
          )
        })}

        {/* Nodes */}
        {nodes.map((n) => {
          const { x, y } = pos[n.id]
          const c = NODE_COLORS[n.type]
          return (
            <g key={n.id}>
              <rect
                x={x - NODE_W / 2} y={y - NODE_H / 2}
                width={NODE_W} height={NODE_H} rx={8}
                fill={c.fill} stroke={c.stroke} strokeWidth={1}
              />
              <text x={x} y={n.sublabel ? y - 5 : y + 4} textAnchor="middle"
                style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 10,
                  fill: c.text, fontWeight: 600, letterSpacing: '0.04em' }}>
                {n.label}
              </text>
              {n.sublabel && (
                <text x={x} y={y + 10} textAnchor="middle"
                  style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 8,
                    fill: 'rgba(242,240,236,0.3)', letterSpacing: '0.08em' }}>
                  {n.sublabel}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4 — KEY FEATURES  (split-view alternating)
// ═══════════════════════════════════════════════════════════════════════════════
function FeaturesSection({ project }: { project: Project }) {
  return (
    <motion.section
      variants={stagger} initial="hidden" whileInView="show" viewport={inView}
      className="px-8 md:px-24 py-20"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <SectionLabel index="04">Key Features</SectionLabel>

      <div className="mt-14 space-y-24">
        {project.features.map((feat, i) => (
          <FeatureRow key={i} feature={feat} index={i} />
        ))}
      </div>
    </motion.section>
  )
}

// ─── Flip card for portrait image pairs ─────────────────────────────────────
function FlipCard({ front, back, label, alt }: { front: string; back: string; label: string; alt: string }) {
  const [flipped, setFlipped] = React.useState(false)

  return (
    <div
      onClick={() => setFlipped((f) => !f)}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, cursor: 'pointer' }}
    >
      {/* Card */}
      <div style={{
        width:       280,
        aspectRatio: '9/19',
        perspective: 1200,
      }}>
        <div style={{
          position:        'relative',
          width:           '100%',
          height:          '100%',
          transformStyle:  'preserve-3d',
          transition:      'transform 0.7s cubic-bezier(0.4, 0.0, 0.2, 1)',
          transform:       flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}>
          {/* Front */}
          <div style={{
            position:        'absolute',
            inset:           0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}>
            <Image src={front} alt={`${alt} — ${label} front`} width={280} height={590} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          {/* Back */}
          <div style={{
            position:        'absolute',
            inset:           0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform:       'rotateY(180deg)',
          }}>
            <Image src={back} alt={`${alt} — ${label} back`} width={280} height={590} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        </div>
      </div>
      {/* Label + hint */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <span style={{
          fontFamily:    'var(--font-space-grotesk)',
          fontSize:      '0.56rem',
          letterSpacing: '0.1em',
          color:         'rgba(242,240,236,0.2)',
        }}>
          tap to flip
        </span>
        <span style={{
          fontFamily:    'var(--font-space-grotesk)',
          fontSize:      '0.72rem',
          fontWeight:    600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color:         'var(--accent-green)',
        }}>
          {label}
        </span>
      </div>
    </div>
  )
}

function FeatureRow({ feature, index }: { feature: { title: string; description: string; image?: string; images?: string[]; tag?: string; layout?: 'landscape' | 'portrait' }; index: number }) {
  const isEven = index % 2 === 0
  const isPortrait = feature.layout === 'portrait'
  const hasCarousel = feature.images && feature.images.length > 1
  const hasSingleImage = feature.image || (feature.images && feature.images.length === 1)
  const singleSrc = feature.image || feature.images?.[0]

  const textBlock = (
    <div style={{ direction: 'ltr' }}>
      {feature.tag && (
        <span style={{
          fontFamily:    'var(--font-space-grotesk)',
          fontSize:      '0.62rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color:         'var(--accent-green)',
          display:       'block',
          marginBottom:  '0.75rem',
        }}>
          {feature.tag}
        </span>
      )}
      <h3 style={{
        fontFamily:    'var(--font-syne)',
        fontSize:      'clamp(1.4rem, 2.5vw, 2.2rem)',
        fontWeight:    700,
        letterSpacing: '-0.02em',
        color:         'var(--fg)',
        marginBottom:  '1rem',
        lineHeight:    1.15,
      }}>
        {feature.title}
      </h3>
      <p style={{
        fontFamily: 'var(--font-space-grotesk)',
        fontSize:   'clamp(0.95rem, 1.2vw, 1.1rem)',
        fontWeight: 300,
        color:      'rgba(242,240,236,0.6)',
        lineHeight: 1.8,
      }}>
        {feature.description}
      </p>
    </div>
  )

  if (isPortrait && hasCarousel) {
    const pairs: [string, string][] = []
    for (let p = 0; p < feature.images!.length; p += 2) {
      pairs.push([feature.images![p], feature.images![p + 1] ?? feature.images![p]])
    }

    return (
      <motion.div variants={fadeUp}>
        <div style={{ marginBottom: '2.5rem' }}>{textBlock}</div>
        <div style={{
          display:        'flex',
          justifyContent: 'center',
          gap:            40,
          flexWrap:       'wrap',
        }}>
          {pairs.map(([front, back], i) => (
            <FlipCard key={i} front={front} back={back} label={i === 0 ? 'B2B' : 'B2C'} alt={feature.title} />
          ))}
        </div>
      </motion.div>
    )
  }

  const aspectRatio = isPortrait ? '9/16' : '5/4'

  return (
    <motion.div
      variants={fadeUp}
      className={`grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center ${!isEven ? 'md:[direction:rtl]' : ''}`}
    >
      {textBlock}

      {/* Image / carousel / placeholder */}
      <div style={{ direction: 'ltr' }}>
        {hasCarousel ? (
          <FadeCarousel images={feature.images!} interval={3500} aspectRatio={aspectRatio} borderRadius="10px" gradient={false} />
        ) : hasSingleImage ? (
          <div style={{
            borderRadius: 10,
            overflow:     'hidden',
            border:       '1px solid var(--border)',
            aspectRatio,
            position:     'relative',
          }}>
            <Image src={singleSrc!} alt={feature.title} fill style={{ objectFit: 'cover' }} />
          </div>
        ) : (
          <div style={{
            border:        '1px dashed rgba(242,240,236,0.1)',
            borderRadius:  10,
            aspectRatio:   '4/3',
            display:       'flex',
            flexDirection: 'column',
            alignItems:    'center',
            justifyContent:'center',
            gap:           8,
            background:    'rgba(242,240,236,0.01)',
          }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="2" width="28" height="28" rx="4"
                stroke="rgba(242,240,236,0.1)" strokeWidth="1" />
              <circle cx="11" cy="12" r="3"
                stroke="rgba(242,240,236,0.1)" strokeWidth="1" />
              <path d="M2 22 L10 16 L17 21 L22 17 L30 22"
                stroke="rgba(242,240,236,0.1)" strokeWidth="1" strokeLinejoin="round" />
            </svg>
            <span style={{
              fontFamily:    'var(--font-space-grotesk)',
              fontSize:      '0.62rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color:         'rgba(242,240,236,0.1)',
            }}>
              Feature Screenshot
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 5 — CODE
// ═══════════════════════════════════════════════════════════════════════════════
function CodeSection({ project }: { project: Project }) {
  const [activeTab, setActiveTab] = React.useState(0)
  const tabs = project.codeTabs
  const active = tabs[activeTab]

  return (
    <motion.section
      variants={stagger} initial="hidden" whileInView="show" viewport={inView}
      className="px-8 md:px-24 py-20"
    >
      <SectionLabel index="05">Implementation</SectionLabel>

      <motion.div variants={fadeUp} className="mt-10">
        <CodeBlock
          code={active.code}
          language={active.language ?? 'typescript'}
          caption={active.caption}
          tabs={tabs.map((t) => t.filename)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </motion.div>
    </motion.section>
  )
}

function CodeBlock({ code, language, caption, tabs, activeTab, onTabChange }: {
  code: string; language: string; caption?: string;
  tabs?: string[]; activeTab?: number; onTabChange?: (i: number) => void;
}) {
  const lines = code.split('\n')
  return (
    <div>
      <div style={{
        background:   '#0C0C0C',
        border:       '1px solid var(--border)',
        borderRadius: 12,
        overflow:     'hidden',
      }}>
        {/* Top bar — traffic lights + file tabs */}
        <div style={{
          padding:      '0',
          borderBottom: '1px solid var(--border)',
          display:      'flex',
          alignItems:   'stretch',
          background:   '#0F0F0F',
        }}>
          {/* Traffic lights */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 18px', flexShrink: 0 }}>
            {['#FF5F57', '#FFBD2E', '#27C93F'].map((c) => (
              <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />
            ))}
          </div>

          {/* File tabs */}
          {tabs && tabs.length > 1 ? (
            <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, overflow: 'auto' }}>
              {tabs.map((filename, i) => (
                <button
                  key={filename}
                  onClick={() => onTabChange?.(i)}
                  style={{
                    fontFamily:    'var(--font-space-grotesk)',
                    fontSize:      '0.65rem',
                    letterSpacing: '0.06em',
                    color:         i === activeTab ? 'var(--accent-green)' : 'rgba(242,240,236,0.25)',
                    background:    i === activeTab ? 'rgba(110,255,42,0.04)' : 'transparent',
                    border:        'none',
                    borderRight:   '1px solid var(--border)',
                    padding:       '10px 16px',
                    cursor:        'pointer',
                    transition:    'color 0.2s, background 0.2s',
                    whiteSpace:    'nowrap',
                  }}
                >
                  {filename}
                </button>
              ))}
            </div>
          ) : (
            <span style={{
              fontFamily:    'var(--font-space-grotesk)',
              fontSize:      '0.65rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color:         'rgba(242,240,236,0.2)',
              marginLeft:    12,
              padding:       '10px 0',
            }}>
              {language}
            </span>
          )}
        </div>

        {/* Code lines */}
        <pre style={{ margin: 0, padding: '1.5rem 1.75rem', overflowX: 'auto' }}>
          <code>
            {lines.map((line, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.75rem', minHeight: '1.5em' }}>
                <span style={{
                  fontFamily:  'monospace',
                  fontSize:    '0.72rem',
                  color:       'rgba(242,240,236,0.12)',
                  userSelect:  'none',
                  minWidth:    '1.8ch',
                  textAlign:   'right',
                  paddingTop:  '0.05em',
                }}>
                  {i + 1}
                </span>
                <span
                  style={{ fontFamily: 'monospace', fontSize: '0.875rem', lineHeight: 1.7, whiteSpace: 'pre' }}
                  dangerouslySetInnerHTML={{ __html: tokenizeLine(line) }}
                />
              </div>
            ))}
          </code>
        </pre>
      </div>

      {caption && (
        <p style={{
          fontFamily:    'var(--font-space-grotesk)',
          fontSize:      '0.72rem',
          letterSpacing: '0.06em',
          color:         'rgba(242,240,236,0.3)',
          marginTop:     '1rem',
          textAlign:     'center',
        }}>
          {caption}
        </p>
      )}
    </div>
  )
}

// ─── Token-level syntax highlighter (TS / JS / Go / Python) ───────────────────
function tokenizeLine(line: string): string {
  // Color palette
  const C = {
    keyword:    '#C792EA',  // purple  — const, async, return, class …
    decorator:  '#6EFF2A',  // green   — @Injectable, @Module …
    string:     '#C3E88D',  // lime    — "…", '…', `…`
    comment:    'rgba(242,240,236,0.25)',
    number:     '#F78C6C',  // orange  — 42, 3.14
    type:       '#FFCB6B',  // yellow  — : string, <T>
    builtin:    '#89DDFF',  // sky     — true, false, null, undefined
    plain:      '#CDD3DE',  // default
    operator:   'rgba(242,240,236,0.45)',
  }

  // Full-line comment
  if (/^\s*(\/\/|#)/.test(line)) {
    return `<span style="color:${C.comment}">${esc(line)}</span>`
  }

  // Tokenize character by character with regex passes
  const tokens: { text: string; color: string }[] = []
  let i = 0
  const src = line

  while (i < src.length) {
    // Decorator @Foo
    if (src[i] === '@') {
      const m = src.slice(i).match(/^@[A-Za-z_]\w*/)
      if (m) { tokens.push({ text: m[0], color: C.decorator }); i += m[0].length; continue }
    }
    // String " ' `
    if (src[i] === '"' || src[i] === "'" || src[i] === '`') {
      const q = src[i]
      let j = i + 1
      while (j < src.length && src[j] !== q) { if (src[j] === '\\') j++; j++ }
      const str = src.slice(i, j + 1)
      tokens.push({ text: str, color: C.string }); i = j + 1; continue
    }
    // Number
    if (/[0-9]/.test(src[i]) && (i === 0 || /[\s,(:=+\-*/<>[\]{}]/.test(src[i - 1]))) {
      const m = src.slice(i).match(/^[0-9]+(\.[0-9]+)?/)
      if (m) { tokens.push({ text: m[0], color: C.number }); i += m[0].length; continue }
    }
    // Word (keyword / builtin / type / identifier)
    if (/[A-Za-z_$]/.test(src[i])) {
      const m = src.slice(i).match(/^[A-Za-z_$][\w$]*/)!
      const w = m[0]
      const KEYWORDS = new Set(['const','let','var','function','async','await','return',
        'class','extends','implements','interface','type','enum','import','export',
        'from','default','new','this','super','if','else','for','while','do','try',
        'catch','finally','throw','in','of','instanceof','typeof','void','delete',
        'static','public','private','protected','readonly','abstract','override',
        'namespace','module','declare','as','is','keyof','infer','never'])
      const BUILTINS = new Set(['true','false','null','undefined','Promise','Array',
        'Object','string','number','boolean','any','unknown','never'])
      if (KEYWORDS.has(w))  tokens.push({ text: w, color: C.keyword })
      else if (BUILTINS.has(w)) tokens.push({ text: w, color: C.builtin })
      else tokens.push({ text: w, color: C.plain })
      i += w.length; continue
    }
    // Operators
    if (/[=><!+\-*/%&|^~?:,;.[\]{}()]/.test(src[i])) {
      tokens.push({ text: src[i], color: C.operator })
    } else {
      tokens.push({ text: src[i], color: C.plain })
    }
    i++
  }

  return tokens.map(t => `<span style="color:${t.color}">${esc(t.text)}</span>`).join('')
}

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED — Section label
// ═══════════════════════════════════════════════════════════════════════════════
function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <span style={{
        fontFamily:    'var(--font-space-grotesk)',
        fontSize:      '0.62rem',
        letterSpacing: '0.2em',
        color:         'var(--accent-green)',
        textTransform: 'uppercase',
      }}>
        {index}
      </span>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      <span style={{
        fontFamily:    'var(--font-syne)',
        fontSize:      '0.68rem',
        letterSpacing: '0.25em',
        color:         'rgba(242,240,236,0.9)',
        textTransform: 'uppercase',
      }}>
        {children}
      </span>
    </div>
  )
}
