'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ContactTerminal from './ContactTerminal'
import ContactComfort from './ContactComfort'
import { getContactEmail } from '@/app/contact/actions'

type Mode = 'terminal' | 'comfort'

export default function ContactForm() {
  const [mode, setMode] = useState<Mode>('comfort')
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    const addr = await getContactEmail()
    if (!addr) return
    await navigator.clipboard.writeText(addr)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ overflow: 'hidden', borderRadius: 12 }}>
      {/* Shared title bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        background: 'rgba(242,240,236,0.06)',
        borderBottom: '1px solid rgba(242,240,236,0.06)',
        gap: 8,
      }}>
        {/* Traffic lights */}
        <div style={{ display: 'flex', gap: 7 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FFBD2E' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840' }} />
        </div>

        {/* Center label */}
        <span style={{
          flex: 1,
          textAlign: 'center',
          fontFamily: '"SF Mono", "Fira Code", monospace',
          fontSize: '0.7rem',
          color: 'rgba(242,240,236,0.3)',
          letterSpacing: '0.05em',
        }}>
          {mode === 'terminal' ? 'ebgueny@portfolio — zsh — 80×24' : 'contact — form'}
        </span>

        {/* Mode toggle */}
        <div style={{
          display: 'flex',
          gap: 2,
          background: 'rgba(242,240,236,0.04)',
          borderRadius: 6,
          padding: 2,
        }}>
          <button
            onClick={() => setMode('terminal')}
            title="Switch to Terminal Mode"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 22, borderRadius: 4,
              background: mode === 'terminal' ? 'rgba(242,240,236,0.08)' : 'transparent',
              border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              color: mode === 'terminal' ? 'var(--accent-green)' : 'rgba(242,240,236,0.2)',
            }}
            onMouseEnter={(e) => { if (mode !== 'terminal') e.currentTarget.style.color = 'var(--accent-green)' }}
            onMouseLeave={(e) => { if (mode !== 'terminal') e.currentTarget.style.color = 'rgba(242,240,236,0.2)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
          </button>
          <button
            onClick={() => setMode('comfort')}
            title="Switch to Form Mode"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 22, borderRadius: 4,
              background: mode === 'comfort' ? 'rgba(242,240,236,0.08)' : 'transparent',
              border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              color: mode === 'comfort' ? 'var(--accent-green)' : 'rgba(242,240,236,0.2)',
            }}
            onMouseEnter={(e) => { if (mode !== 'comfort') e.currentTarget.style.color = 'var(--accent-green)' }}
            onMouseLeave={(e) => { if (mode !== 'comfort') e.currentTarget.style.color = 'rgba(242,240,236,0.2)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="5" rx="1" />
              <rect x="3" y="11" width="18" height="5" rx="1" />
              <rect x="3" y="19" width="8" height="2" rx="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content area — 3D flip transition */}
      <div style={{ perspective: 1200, position: 'relative' }}>
        <AnimatePresence mode="wait">
          {mode === 'terminal' ? (
            <motion.div
              key="terminal"
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
            >
              <ContactTerminal />
            </motion.div>
          ) : (
            <motion.div
              key="comfort"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
            >
              <div style={{ background: 'rgba(0,0,0,0.3)', minHeight: 380 }}>
                <ContactComfort />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Shared footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        background: 'rgba(242,240,236,0.03)',
        borderTop: '1px solid rgba(242,240,236,0.06)',
      }}>
        <span style={{
          fontFamily: '"SF Mono", "Fira Code", monospace',
          fontSize: '0.65rem',
          color: 'rgba(242,240,236,0.2)',
          letterSpacing: '0.05em',
        }}>
          {mode === 'terminal' ? 'zsh • utf-8' : 'secure • encrypted'}
        </span>

        <button
          onClick={copyEmail}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: '"SF Mono", "Fira Code", monospace',
            fontSize: '0.65rem',
            color: copied ? 'var(--accent-green)' : 'rgba(242,240,236,0.2)',
            transition: 'color 0.2s',
            padding: '2px 0',
          }}
        >
          {copied ? '✓ copied' : 'cp email ↗'}
        </button>
      </div>
    </div>
  )
}
