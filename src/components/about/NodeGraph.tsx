'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface Node {
  id: string
  label: string
  cluster: 'infra' | 'db' | 'backend'
  x: number
  y: number
  z: number
}

const nodes: Node[] = [
  // Backend Core — center cluster
  { id: 'nestjs',     label: 'NestJS',         cluster: 'backend', x: 0,    y: 0.5,  z: 0    },
  { id: 'typescript', label: 'TypeScript',     cluster: 'backend', x: 1.8,  y: 2.5,  z: 0.4  },
  { id: 'typeorm',    label: 'TypeORM',        cluster: 'backend', x: -1.8, y: -1.5, z: 0.3  },
  { id: 'bullmq',    label: 'BullMQ',         cluster: 'backend', x: 2.2,  y: -1.8, z: -0.5 },
  { id: 'socketio',  label: 'Socket.io',      cluster: 'backend', x: -0.5, y: 3.2,  z: 0.2  },
  { id: 'gemini',    label: 'Gemini AI',      cluster: 'backend', x: 0.8,  y: -3.2, z: -0.3 },

  // Data — upper-right cluster
  { id: 'postgres',   label: 'PostgreSQL',    cluster: 'db',      x: 5.5,  y: 2.8,  z: 0    },
  { id: 'redis',      label: 'Redis',         cluster: 'db',      x: 7,    y: 1,    z: 0.5  },
  { id: 's3',         label: 'AWS S3',        cluster: 'db',      x: 6.5,  y: -1.2, z: -0.3 },
  { id: 'dexie',      label: 'Dexie.js',      cluster: 'db',      x: 4.2,  y: 0.2,  z: 0.8  },

  // Frontend & Infra — left cluster
  { id: 'nextjs',     label: 'Next.js 14',    cluster: 'infra',   x: -5.5, y: 1.5,  z: 0    },
  { id: 'react',      label: 'React Native',  cluster: 'infra',   x: -6.8, y: 3.5,  z: 0.3  },
  { id: 'docker',     label: 'Docker',        cluster: 'infra',   x: -4.5, y: -2.5, z: -0.4 },
  { id: 'turborepo',  label: 'Turborepo',     cluster: 'infra',   x: -7,   y: -0.8, z: 0.5  },
  { id: 'stripe',     label: 'Stripe',        cluster: 'infra',   x: -5,   y: 3.8,  z: -0.3 },
]

// Architecturally correct edges
const edges: [string, string][] = [
  // NestJS is the hub — connects to all backend services
  ['nestjs', 'typescript'], ['nestjs', 'typeorm'],  ['nestjs', 'bullmq'],
  ['nestjs', 'socketio'],   ['nestjs', 'gemini'],
  // NestJS → Data layer
  ['nestjs', 'postgres'],   ['nestjs', 'redis'],
  ['typeorm', 'postgres'],  ['bullmq', 'redis'],
  // Turborepo orchestrates all apps
  ['turborepo', 'nestjs'],  ['turborepo', 'nextjs'], ['turborepo', 'react'],
  // Frontend connections
  ['nextjs', 'stripe'],     ['nextjs', 'dexie'],     ['react', 'stripe'],
  // Stripe webhooks & subscription logic live in the backend
  ['nestjs', 'stripe'],
  // Docker containerizes backend + data
  ['docker', 'nestjs'],     ['docker', 'postgres'],  ['docker', 'redis'],
  // S3 for storage
  ['nestjs', 's3'],
]

// Build adjacency map for hover focus
const adjacencyMap: Record<string, Set<string>> = {}
nodes.forEach((n) => { adjacencyMap[n.id] = new Set() })
edges.forEach(([a, b]) => { adjacencyMap[a]?.add(b); adjacencyMap[b]?.add(a) })

const clusterColors: Record<string, string> = {
  backend: '#6EFF2A',
  db:      '#F0A8C8',
  infra:   '#5B8EFF',
}

const clusterLabels: Record<string, string> = {
  backend: 'Core / Backend',
  db:      'Data & Storage',
  infra:   'Frontend & Infra',
}

interface LabelData {
  id: string; x: number; y: number; label: string; cluster: string
}

interface EdgeScreen {
  x1: number; y1: number; x2: number; y2: number; fromId: string; toId: string
}

export default function NodeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [labels, setLabels] = useState<LabelData[]>([])
  const [edgeScreens, setEdgeScreens] = useState<EdgeScreen[]>([])
  const stateRef = useRef({
    rotX: 0, rotY: 0, velX: 0, velY: 0,
    isDown: false, lastX: 0, lastY: 0,
    mouseX: 0, mouseY: 0, hovered: null as string | null,
    time: 0, zoom: 1,
  })

  // Check if a node is connected to the hovered node
  const isConnected = useCallback((nodeId: string) => {
    if (!hovered) return true
    if (nodeId === hovered) return true
    return adjacencyMap[hovered]?.has(nodeId) ?? false
  }, [hovered])

  const isEdgeConnected = useCallback((fromId: string, toId: string) => {
    if (!hovered) return true
    return fromId === hovered || toId === hovered
  }, [hovered])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = container.clientWidth
    let h = container.clientHeight
    const dpr = Math.min(window.devicePixelRatio, 2)
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    ctx.scale(dpr, dpr)

    const S = stateRef.current

    const baseFov = 16
    const project = (x: number, y: number, z: number) => {
      let rx = x, ry = y, rz = z
      const cosY = Math.cos(S.rotY), sinY = Math.sin(S.rotY)
      const tx = rx * cosY - rz * sinY
      rz = rx * sinY + rz * cosY
      rx = tx
      const cosX = Math.cos(S.rotX), sinX = Math.sin(S.rotX)
      const ty = ry * cosX - rz * sinX
      rz = ry * sinX + rz * cosX
      ry = ty
      const fov = baseFov / S.zoom
      const scale = fov / (fov + rz)
      const spread = (w / 18) * S.zoom
      return {
        sx: w / 2 + rx * scale * spread,
        sy: h / 2 - ry * scale * spread,
        depth: rz,
        scale,
      }
    }

    // Hit test
    const hitTest = (mx: number, my: number): string | null => {
      let closest: string | null = null
      let closestDist = 40
      for (const node of nodes) {
        const p = project(node.x, node.y, node.z)
        const dx = mx - p.sx
        const dy = my - p.sy
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < closestDist) {
          closestDist = dist
          closest = node.id
        }
      }
      return closest
    }

    // Mouse handlers
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      S.mouseX = e.clientX - rect.left
      S.mouseY = e.clientY - rect.top
      if (!S.isDown) {
        const hit = hitTest(S.mouseX, S.mouseY)
        if (hit !== S.hovered) {
          S.hovered = hit
          setHovered(hit)
        }
      }
    }
    const onPointerDown = (e: PointerEvent) => {
      S.isDown = true; S.lastX = e.clientX; S.lastY = e.clientY
    }
    const onPointerUp = () => { S.isDown = false }
    const onPointerMove = (e: PointerEvent) => {
      if (!S.isDown) return
      S.velX = (e.clientX - S.lastX) * 0.004
      S.velY = (e.clientY - S.lastY) * 0.004
      S.lastX = e.clientX; S.lastY = e.clientY
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.05 : 0.05
      S.zoom = Math.max(0.5, Math.min(2.5, S.zoom + delta))
    }

    container.addEventListener('mousemove', onMouseMove)
    container.addEventListener('pointerdown', onPointerDown)
    container.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointermove', onPointerMove)

    // Animation loop
    let animId: number
    const loop = () => {
      animId = requestAnimationFrame(loop)
      S.time += 0.012

      // Auto-rotate + drag
      if (!S.isDown) {
        S.velX *= 0.95
        S.velY *= 0.95
        S.rotY += 0.002
      }
      S.rotX += S.velY
      S.rotY += S.velX
      S.rotX = Math.max(-0.5, Math.min(0.5, S.rotX))

      ctx.clearRect(0, 0, w, h)

      const hovId = S.hovered

      // Project all nodes
      const projected = nodes.map((n) => ({
        ...n,
        ...project(n.x, n.y, n.z),
      }))

      // Draw edges
      const newEdgeScreens: EdgeScreen[] = []
      edges.forEach(([aId, bId], edgeIdx) => {
        const a = projected.find((p) => p.id === aId)
        const b = projected.find((p) => p.id === bId)
        if (!a || !b) return

        const connected = !hovId || aId === hovId || bId === hovId
        const alpha = connected ? 0.25 : 0.04

        ctx.beginPath()
        ctx.moveTo(a.sx, a.sy)
        ctx.lineTo(b.sx, b.sy)
        ctx.strokeStyle = `rgba(242,240,236,${alpha})`
        ctx.lineWidth = connected && hovId ? 1.5 : 0.8
        ctx.stroke()

        // Ambient pulse particles — always visible, brighter on hover
        const isActive = connected && hovId
        const particleCount = isActive ? 2 : 1
        const speed = isActive ? 0.8 : 0.35
        const nodeA = nodes.find(n => n.id === aId)!
        const color = clusterColors[nodeA.cluster]

        for (let i = 0; i < particleCount; i++) {
          const t = ((S.time * speed + edgeIdx * 0.4 + i * 0.5) % 1)
          const px = a.sx + (b.sx - a.sx) * t
          const py = a.sy + (b.sy - a.sy) * t

          const dotR = isActive ? 2 : 1.2
          const glowR = isActive ? 10 : 5

          ctx.beginPath()
          ctx.arc(px, py, dotR, 0, Math.PI * 2)
          ctx.fillStyle = color + (isActive ? 'CC' : '60')
          ctx.fill()

          const grad = ctx.createRadialGradient(px, py, 0, px, py, glowR)
          grad.addColorStop(0, color + (isActive ? '50' : '20'))
          grad.addColorStop(1, color + '00')
          ctx.beginPath()
          ctx.arc(px, py, glowR, 0, Math.PI * 2)
          ctx.fillStyle = grad
          ctx.fill()
        }

        newEdgeScreens.push({ x1: a.sx, y1: a.sy, x2: b.sx, y2: b.sy, fromId: aId, toId: bId })
      })
      setEdgeScreens(newEdgeScreens)

      // Draw nodes (sorted by depth for correct overlap)
      const sorted = [...projected].sort((a, b) => b.depth - a.depth)
      sorted.forEach((p) => {
        const color = clusterColors[p.cluster]
        const isHov = p.id === hovId
        const connected = !hovId || p.id === hovId || (adjacencyMap[hovId]?.has(p.id) ?? false)
        const alpha = connected ? 1 : 0.12
        const radius = (isHov ? 7 : 5) * p.scale

        // Outer glow
        if (connected) {
          const glowRadius = radius * (isHov ? 4.5 : 2.5)
          const grad = ctx.createRadialGradient(p.sx, p.sy, radius * 0.5, p.sx, p.sy, glowRadius)
          grad.addColorStop(0, color + (isHov ? '40' : '18'))
          grad.addColorStop(1, color + '00')
          ctx.beginPath()
          ctx.arc(p.sx, p.sy, glowRadius, 0, Math.PI * 2)
          ctx.fillStyle = grad
          ctx.fill()
        }

        // Ring (flat design)
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, radius, 0, Math.PI * 2)
        ctx.strokeStyle = color + (connected ? 'CC' : '30')
        ctx.lineWidth = isHov ? 2.5 : 1.5
        ctx.stroke()

        // Inner dot
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, radius * 0.35, 0, Math.PI * 2)
        ctx.fillStyle = color + (connected ? 'AA' : '20')
        ctx.fill()
      })

      // Update labels
      const newLabels: LabelData[] = sorted.map((p) => ({
        id: p.id,
        label: p.label,
        cluster: p.cluster,
        x: p.sx,
        y: p.sy,
      }))
      setLabels(newLabels)

      container.style.cursor = hovId ? 'pointer' : S.isDown ? 'grabbing' : 'grab'
    }
    loop()

    const onResize = () => {
      w = container.clientWidth
      h = container.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('pointerdown', onPointerDown)
      container.removeEventListener('wheel', onWheel)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* DOM Labels — always white for readability */}
      {labels.map((l) => {
        const connected = isConnected(l.id)
        const isHov = hovered === l.id
        return (
          <div
            key={l.id}
            style={{
              position: 'absolute',
              left: l.x,
              top: l.y,
              transform: 'translate(-50%, 14px)',
              pointerEvents: 'none',
              transition: 'opacity 0.25s',
              opacity: connected ? (isHov ? 1 : 0.7) : 0.08,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: isHov ? '0.78rem' : '0.68rem',
                fontWeight: isHov ? 600 : 400,
                color: 'rgba(242,240,236,0.85)',
                textShadow: '0 0 16px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,0.8)',
                whiteSpace: 'nowrap',
                transition: 'font-size 0.2s, opacity 0.2s',
              }}
            >
              {l.label}
            </span>
          </div>
        )
      })}

      {/* Hint */}
      <span
        className="absolute top-4 right-5"
        style={{ fontFamily: 'var(--font-syne)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,240,236,0.38)', pointerEvents: 'none' }}
      >
        Drag to explore · Scroll to zoom
      </span>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-2">
        {Object.entries(clusterLabels).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2">
            <div style={{ width: 8, height: 8, borderRadius: 999, background: clusterColors[key], boxShadow: `0 0 6px ${clusterColors[key]}50` }} />
            <span style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(242,240,236,0.4)' }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
