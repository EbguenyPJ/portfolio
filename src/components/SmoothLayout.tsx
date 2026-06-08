'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

export default function SmoothLayout({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    lenisRef.current = lenis

    let animId: number
    const raf = (time: number) => {
      lenis.raf(time)
      animId = requestAnimationFrame(raf)
    }
    animId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(animId)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
