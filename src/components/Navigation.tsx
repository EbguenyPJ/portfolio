'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'

const links = [
  { href: '/',         label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/about',    label: 'About' },
  { href: '/contact',  label: 'Contact' },
]

export default function Navigation() {
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const lastScrollY = useRef(0)
  const [visible, setVisible] = useState(true)
  const [hasScrolled, setHasScrolled] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setHasScrolled(latest > 20)

    if (latest < 20) {
      setVisible(true)
      lastScrollY.current = latest
      return
    }

    const diff = latest - lastScrollY.current
    if (diff < -3) setVisible(true)
    else if (diff > 5) setVisible(false)
    lastScrollY.current = latest
  })

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (e.clientY < 60) setVisible(true)
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backdropFilter: hasScrolled ? 'blur(12px) saturate(1.4)' : 'none',
        WebkitBackdropFilter: hasScrolled ? 'blur(12px) saturate(1.4)' : 'none',
        background: hasScrolled ? 'rgba(8, 8, 8, 0.7)' : 'transparent',
        borderBottom: hasScrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition: 'background 0.4s ease, border-bottom 0.4s ease, backdrop-filter 0.4s ease',
      }}
    >
      <nav
        className="flex items-center justify-between"
        style={{ padding: '1.1rem 2rem', maxWidth: 1400, margin: '0 auto' }}
      >
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-syne)',
            fontSize: '0.9rem',
            fontWeight: 800,
            letterSpacing: '0.18em',
            color: 'var(--fg)',
            textDecoration: 'none',
          }}
        >
          EPJ
        </Link>

        <ul className="flex items-center gap-7">
          {links.map(({ href, label }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  style={{
                    fontFamily: 'var(--font-space-grotesk)',
                    fontSize: '0.8rem',
                    fontWeight: 400,
                    letterSpacing: '0.06em',
                    color: isActive ? 'var(--fg)' : 'rgba(242,240,236,0.5)',
                    textDecoration: 'none',
                    transition: 'color 0.25s ease',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = '#EAEAEA' }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'rgba(242,240,236,0.5)' }}
                >
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      style={{
                        position: 'absolute',
                        bottom: -6,
                        left: 0,
                        right: 0,
                        height: 1,
                        background: 'var(--accent-green)',
                        borderRadius: 1,
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            )
          })}

        </ul>
      </nav>
    </motion.header>
  )
}
