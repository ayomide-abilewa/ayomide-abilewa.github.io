'use client'

import { useEffect, useRef } from 'react'

/**
 * A wireframe 3D scene behind an inner-page header.
 *
 * Two layers on one canvas: a rolling terrain floor along the bottom (every
 * page) and, where the header has room, a slowly turning object on the right
 * that leans toward the pointer. No library: points are rotated and projected
 * by hand and the edges stroked in a few alpha buckets, so a frame is a handful
 * of draw calls. The loop stops off screen and when the tab is hidden; under
 * reduced motion or lofi one still frame is drawn.
 */

export type SceneShape = 'globe' | 'torus' | 'helix' | 'lattice' | 'stack' | 'chip' | 'rings' | 'none'

type V3 = [number, number, number]
type Geometry = { pts: V3[]; edges: [number, number][]; dots?: boolean }

const TAU = Math.PI * 2

function ring(n: number, f: (t: number) => V3, pts: V3[], edges: [number, number][], closed = true) {
  const start = pts.length
  for (let i = 0; i < n; i++) pts.push(f((i / n) * TAU))
  for (let i = 0; i < n - (closed ? 0 : 1); i++) edges.push([start + i, start + ((i + 1) % n)])
}

function build(shape: SceneShape): Geometry {
  const pts: V3[] = []
  const edges: [number, number][] = []
  switch (shape) {
    case 'globe': {
      for (let k = 1; k < 9; k++) {
        const phi = (k / 9) * Math.PI
        const r = Math.sin(phi)
        const y = Math.cos(phi)
        ring(56, (t) => [r * Math.cos(t), y, r * Math.sin(t)], pts, edges)
      }
      for (let k = 0; k < 12; k++) {
        const th = (k / 12) * Math.PI
        ring(56, (t) => [Math.sin(t) * Math.cos(th), Math.cos(t), Math.sin(t) * Math.sin(th)], pts, edges)
      }
      return { pts, edges }
    }
    case 'torus': {
      const U = 40
      const V = 16
      for (let i = 0; i < U; i++)
        for (let j = 0; j < V; j++) {
          const u = (i / U) * TAU
          const v = (j / V) * TAU
          const r = 1 + 0.4 * Math.cos(v)
          pts.push([r * Math.cos(u), 0.4 * Math.sin(v), r * Math.sin(u)])
          const id = i * V + j
          edges.push([id, i * V + ((j + 1) % V)])
          edges.push([id, ((i + 1) % U) * V + j])
        }
      return { pts, edges }
    }
    case 'helix': {
      const n = 90
      for (let s = 0; s < 2; s++)
        for (let i = 0; i < n; i++) {
          const t = (i / n) * TAU * 2.5 + s * Math.PI
          pts.push([0.55 * Math.cos(t), (i / n) * 2.4 - 1.2, 0.55 * Math.sin(t)])
          if (i) edges.push([s * n + i - 1, s * n + i])
        }
      for (let i = 0; i < n; i += 5) edges.push([i, n + i])
      return { pts, edges, dots: true }
    }
    case 'lattice': {
      const g = 4
      const id = (x: number, y: number, z: number) => (x * g + y) * g + z
      for (let x = 0; x < g; x++)
        for (let y = 0; y < g; y++)
          for (let z = 0; z < g; z++) {
            const c = (k: number) => (k / (g - 1)) * 1.6 - 0.8
            pts.push([c(x), c(y), c(z)])
            if (x < g - 1) edges.push([id(x, y, z), id(x + 1, y, z)])
            if (y < g - 1) edges.push([id(x, y, z), id(x, y + 1, z)])
            if (z < g - 1) edges.push([id(x, y, z), id(x, y, z + 1)])
          }
      return { pts, edges, dots: true }
    }
    case 'stack': {
      for (let k = 0; k < 6; k++) {
        const y = k * 0.22 - 0.55
        const o = k * 0.06
        const s = pts.length
        pts.push([-0.7 + o, y, -0.95 + o], [0.7 + o, y, -0.95 + o], [0.7 + o, y, 0.95 + o], [-0.7 + o, y, 0.95 + o])
        edges.push([s, s + 1], [s + 1, s + 2], [s + 2, s + 3], [s + 3, s])
        // Lines of text on the top sheet.
        if (k === 5)
          for (let l = 0; l < 7; l++) {
            const z = -0.7 + l * 0.22
            const len = l % 3 === 2 ? 0.6 : 1.05
            const a = pts.length
            pts.push([-0.5 + o, y, z + o], [-0.5 + o + len, y, z + o])
            edges.push([a, a + 1])
          }
      }
      return { pts, edges }
    }
    case 'chip': {
      const body = 0.75
      const h = 0.14
      const s = pts.length
      for (const y of [-h, h]) pts.push([-body, y, -body], [body, y, -body], [body, y, body], [-body, y, body])
      for (let i = 0; i < 4; i++) {
        edges.push([s + i, s + ((i + 1) % 4)], [s + 4 + i, s + 4 + ((i + 1) % 4)], [s + i, s + 4 + i])
      }
      // Pins on all four sides, bent down to the board.
      const pins = 8
      for (let side = 0; side < 4; side++)
        for (let p = 0; p < pins; p++) {
          const a = ((p + 0.5) / pins) * 1.3 - 0.65
          const tip = (d: number, y: number): V3 =>
            side === 0 ? [a, y, -d] : side === 1 ? [d, y, a] : side === 2 ? [-a, y, d] : [-d, y, -a]
          const b = pts.length
          pts.push(tip(body, 0), tip(body + 0.2, 0), tip(body + 0.28, -0.3))
          edges.push([b, b + 1], [b + 1, b + 2])
        }
      // Die outline and pin-one mark.
      const d = pts.length
      pts.push([-0.35, h, -0.35], [0.35, h, -0.35], [0.35, h, 0.35], [-0.35, h, 0.35])
      edges.push([d, d + 1], [d + 1, d + 2], [d + 2, d + 3], [d + 3, d])
      ring(16, (t) => [-0.55 + 0.07 * Math.cos(t), h, -0.55 + 0.07 * Math.sin(t)], pts, edges)
      return { pts, edges }
    }
    case 'rings': {
      for (let k = 0; k < 7; k++) {
        const r = 0.25 + k * 0.17
        const tilt = k * 0.45
        ring(64, (t) => [r * Math.cos(t), r * Math.sin(t) * Math.sin(tilt), r * Math.sin(t) * Math.cos(tilt)], pts, edges)
      }
      return { pts, edges }
    }
    default:
      return { pts, edges }
  }
}

function rgbVar(el: Element, name: string, fallback: string): string {
  const v = getComputedStyle(el).getPropertyValue(name).trim()
  return v ? v.split(/\s+/).join(',') : fallback
}

const COLS = 34
const ROWS = 16
const BUCKETS = 5

export function Scene3D({ shape = 'none' }: { shape?: SceneShape }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const still =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('lofi')

    const geo = build(shape)
    const radius = Math.max(1e-6, ...geo.pts.map(([x, y, z]) => Math.hypot(x, y, z)))
    geo.pts.forEach((p) => {
      p[0] /= radius
      p[1] /= radius
      p[2] /= radius
    })
    const proj = new Float32Array(geo.pts.length * 3)
    const buckets: number[][] = Array.from({ length: BUCKETS }, () => [])

    let w = 0
    let h = 0
    let accent = ''
    let alt = ''
    let t = 0
    let raf = 0
    let running = false
    let visible = true
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 }
    const ripple = { x: 0.5, z: 0.5, k: 0 }

    function colours() {
      accent = rgbVar(canvas!, '--accent', '251,179,58')
      alt = rgbVar(canvas!, '--accent-alt', '98,214,232')
    }

    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = canvas!.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas!.width = Math.round(w * dpr)
      canvas!.height = Math.round(h * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function terrain() {
      // A rolling wave field seen from a low camera: rows run across, columns run
      // to a vanishing point, and both sit in the lower part of the header.
      const horizon = h * 0.6
      const cx = w / 2
      const f = Math.max(w, 900) * 0.55
      const camH = 1
      const heightAt = (gx: number, gz: number) =>
        Math.sin(gx * 0.45 + t * 0.02) * 0.16 +
        Math.cos(gz * 0.6 - t * 0.016) * 0.14 +
        Math.sin((gx + gz) * 0.25 + t * 0.011) * 0.1 +
        ripple.k * Math.exp(-((gx / (COLS - 1) - ripple.x) ** 2 + (gz / (ROWS - 1) - ripple.z) ** 2) * 40) * Math.sin(t * 0.15)
      const P = (gx: number, gz: number): [number, number] => {
        const x = (gx / (COLS - 1) - 0.5) * 24
        const z = 2.4 + (1 - gz / (ROWS - 1)) * 20
        return [cx + (x * f) / z, horizon + ((camH - heightAt(gx, gz)) * f) / z]
      }
      for (let gz = 0; gz < ROWS; gz++) {
        const near = gz / (ROWS - 1)
        ctx!.strokeStyle = `rgba(${alt},${0.04 + near * near * 0.3})`
        ctx!.lineWidth = 0.6 + near * 0.8
        ctx!.beginPath()
        for (let gx = 0; gx < COLS; gx++) {
          const [px, py] = P(gx, gz)
          if (gx) ctx!.lineTo(px, py)
          else ctx!.moveTo(px, py)
        }
        ctx!.stroke()
      }
      ctx!.strokeStyle = `rgba(${alt},0.12)`
      ctx!.lineWidth = 0.7
      ctx!.beginPath()
      for (let gx = 0; gx < COLS; gx++) {
        for (let gz = 0; gz < ROWS; gz++) {
          const [px, py] = P(gx, gz)
          if (gz) ctx!.lineTo(px, py)
          else ctx!.moveTo(px, py)
        }
      }
      ctx!.stroke()
    }

    function object() {
      if (!geo.pts.length) return
      const wide = w >= 1024
      const cx = wide ? w / 2 + Math.min(w * 0.32, 500) : w * 0.82
      const cy = wide ? h * 0.42 : h * 0.2
      const scale = wide ? Math.min(h * 0.25, 175) : Math.min(w * 0.26, 120)
      const fade = wide ? 1 : 0.45
      const ay = t * 0.006 + tilt.x
      const ax = -0.42 + tilt.y
      const sy = Math.sin(ay)
      const cyw = Math.cos(ay)
      const sx = Math.sin(ax)
      const cxw = Math.cos(ax)
      const bob = Math.sin(t * 0.02) * 6

      geo.pts.forEach(([x, y, z], i) => {
        const x1 = x * cyw - z * sy
        const z1 = x * sy + z * cyw
        const y2 = y * cxw - z1 * sx
        const z2 = y * sx + z1 * cxw
        const p = 3.2 / (3.2 + z2)
        proj[i * 3] = cx + x1 * scale * p
        proj[i * 3 + 1] = cy + bob + y2 * scale * p
        proj[i * 3 + 2] = z2
      })

      buckets.forEach((b) => (b.length = 0))
      geo.edges.forEach(([a, b], i) => {
        const z = ((proj[a * 3 + 2] ?? 0) + (proj[b * 3 + 2] ?? 0)) / 2
        const k = Math.max(0, Math.min(BUCKETS - 1, Math.floor(((1 - z) / 2) * BUCKETS)))
        buckets[k]?.push(i)
      })

      buckets.forEach((list, k) => {
        if (!list.length) return
        const front = k / (BUCKETS - 1)
        ctx!.strokeStyle = `rgba(${front > 0.5 ? accent : alt},${(0.12 + front * 0.75) * fade})`
        ctx!.lineWidth = 0.8 + front * 0.9
        ctx!.beginPath()
        for (const i of list) {
          const [a, b] = geo.edges[i] ?? [0, 0]
          ctx!.moveTo(proj[a * 3] ?? 0, proj[a * 3 + 1] ?? 0)
          ctx!.lineTo(proj[b * 3] ?? 0, proj[b * 3 + 1] ?? 0)
        }
        ctx!.stroke()
      })

      if (geo.dots) {
        ctx!.fillStyle = `rgba(${accent},${0.9 * fade})`
        for (let i = 0; i < geo.pts.length; i++) {
          const z = proj[i * 3 + 2] ?? 0
          if (z > 0.2) continue
          ctx!.beginPath()
          ctx!.arc(proj[i * 3] ?? 0, proj[i * 3 + 1] ?? 0, 1.4 + (1 - z) * 0.9, 0, TAU)
          ctx!.fill()
        }
      }

      // Soft halo so the object reads as lit, not pasted on.
      const g = ctx!.createRadialGradient(cx, cy, 0, cx, cy, scale * 1.6)
      g.addColorStop(0, `rgba(${accent},${0.1 * fade})`)
      g.addColorStop(1, `rgba(${accent},0)`)
      ctx!.fillStyle = g
      ctx!.fillRect(cx - scale * 1.6, cy - scale * 1.6, scale * 3.2, scale * 3.2)
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h)
      terrain()
      object()
    }

    function frame() {
      t++
      tilt.x += (tilt.tx - tilt.x) * 0.05
      tilt.y += (tilt.ty - tilt.y) * 0.05
      ripple.k *= 0.985
      draw()
      raf = requestAnimationFrame(frame)
    }

    function start() {
      if (running || still || !visible || document.hidden) return
      running = true
      raf = requestAnimationFrame(frame)
    }
    function stop() {
      running = false
      cancelAnimationFrame(raf)
    }

    function onMove(e: PointerEvent) {
      const r = canvas!.getBoundingClientRect()
      const nx = (e.clientX - r.left) / r.width
      const ny = (e.clientY - r.top) / r.height
      tilt.tx = (nx - 0.5) * 0.9
      tilt.ty = (ny - 0.5) * 0.5
      if (ny > 0.55 && ny < 1) {
        ripple.x = nx
        ripple.z = (ny - 0.55) / 0.45
        ripple.k = Math.min(0.6, ripple.k + 0.04)
      }
    }

    colours()
    size()
    draw()

    const ro = new ResizeObserver(() => {
      size()
      draw()
    })
    ro.observe(canvas)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true
      if (visible) start()
      else stop()
    })
    io.observe(canvas)

    const mo = new MutationObserver(() => {
      colours()
      if (!running) draw()
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVis)
    if (!still) window.addEventListener('pointermove', onMove, { passive: true })
    start()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pointermove', onMove)
    }
  }, [shape])

  return <canvas ref={ref} aria-hidden="true" className="hero-3d" />
}
