'use client'

import { useEffect, useRef } from 'react'
import { stepResponse } from '@/lib/trace'

/**
 * The live trace behind the home hero.
 *
 * A damped string, simulated: every sample is pulled toward its neighbours and
 * toward zero, and loses a little velocity each step. Left alone it sits flat
 * apart from a periodic test pulse. Bring the pointer near it and the samples
 * under the pointer are pulled toward it, like a probe tip on a wire; let go and
 * the line rings and settles, underdamped, the same way the underline does.
 *
 * Readouts are written straight into the HUD elements by id, so nothing here
 * re-renders React at 60 fps. The loop stops when the hero is off screen or the
 * tab is hidden. Under reduced motion or lofi it draws the settled step once and
 * never animates.
 */

const N = 220
const GHOSTS = 5

/** Indexed read that satisfies noUncheckedIndexedAccess; indices are always in range. */
const at = (a: Float32Array, i: number) => a[i] ?? 0

function rgbVar(el: Element, name: string): string {
  const v = getComputedStyle(el).getPropertyValue(name).trim()
  return v ? v.split(/\s+/).join(',') : '251,179,58'
}

export function ScopeCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const host = canvas.parentElement as HTMLElement

    const still =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('lofi')

    let w = 0
    let h = 0
    let dpr = 1
    let accent = rgbVar(canvas, '--accent')
    const y = new Float32Array(N)
    const v = new Float32Array(N)
    const ghosts: Float32Array[] = []
    const probe = { x: -1, y: 0, active: false }
    let raf = 0
    let running = false
    let visible = true
    let t = 0
    let nextPulse = 90

    const readX = document.getElementById('scope-x')
    const readY = document.getElementById('scope-y')

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = host.clientWidth
      h = host.clientHeight
      canvas!.width = Math.round(w * dpr)
      canvas!.height = Math.round(h * dpr)
      canvas!.style.width = `${w}px`
      canvas!.style.height = `${h}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    // The resting line runs through the band between the copy and the bottom readout.
    const baseY = () => h - 96
    const amp = () => Math.min(h * 0.14, 120)

    function path(src: Float32Array) {
      const b = baseY()
      const a = amp()
      ctx!.beginPath()
      for (let i = 0; i < N; i++) {
        const px = (i / (N - 1)) * w
        const py = b - at(src, i) * a
        if (i === 0) ctx!.moveTo(px, py)
        else ctx!.lineTo(px, py)
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h)
      ghosts.forEach((g, i) => {
        path(g)
        ctx!.strokeStyle = `rgba(${accent},${0.05 + i * 0.03})`
        ctx!.lineWidth = 1
        ctx!.stroke()
      })
      path(y)
      ctx!.strokeStyle = `rgba(${accent},0.18)`
      ctx!.lineWidth = 7
      ctx!.stroke()
      ctx!.strokeStyle = `rgba(${accent},0.95)`
      ctx!.lineWidth = 1.75
      ctx!.stroke()

      if (probe.active) {
        const i = Math.round((probe.x / w) * (N - 1))
        const px = (i / (N - 1)) * w
        const py = baseY() - at(y, Math.max(0, Math.min(N - 1, i))) * amp()
        ctx!.beginPath()
        ctx!.arc(px, py, 4, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${accent},1)`
        ctx!.fill()
        ctx!.beginPath()
        ctx!.arc(px, py, 11, 0, Math.PI * 2)
        ctx!.strokeStyle = `rgba(${accent},0.45)`
        ctx!.lineWidth = 1
        ctx!.stroke()
      }
    }

    function step() {
      t++
      // Periodic test pulse so the line is alive without anyone touching it.
      if (t >= nextPulse && !probe.active) {
        const c = 8 + Math.floor(Math.random() * 18)
        for (let k = -3; k <= 3; k++) v[c + k] = at(v, c + k) + 0.09 * (1 - Math.abs(k) / 4)
        nextPulse = t + 150 + Math.floor(Math.random() * 120)
      }

      for (let s = 0; s < 2; s++) {
        for (let i = 1; i < N - 1; i++) {
          const lap = at(y, i - 1) + at(y, i + 1) - 2 * at(y, i)
          v[i] = (at(v, i) + lap * 0.22 - at(y, i) * 0.004) * 0.988
        }
        if (probe.active) {
          const target = (baseY() - probe.y) / amp()
          const clamped = Math.max(-1.4, Math.min(1.4, target))
          const ci = (probe.x / w) * (N - 1)
          const r = 6
          for (let i = Math.max(1, Math.floor(ci - r * 2)); i < Math.min(N - 1, Math.ceil(ci + r * 2)); i++) {
            const g = Math.exp(-((i - ci) ** 2) / (2 * r * r))
            v[i] = at(v, i) + (clamped - at(y, i)) * 0.06 * g
          }
        }
        for (let i = 1; i < N - 1; i++) y[i] = at(y, i) + at(v, i)
      }

      if (t % 4 === 0) {
        ghosts.push(Float32Array.from(y))
        if (ghosts.length > GHOSTS) ghosts.shift()
      }

      if (readX && readY && probe.active) {
        readX.textContent = ((probe.x / w) * 50).toFixed(1).padStart(4, '0')
        const i = Math.max(0, Math.min(N - 1, Math.round((probe.x / w) * (N - 1))))
        readY.textContent = (at(y, i) * 2).toFixed(2)
      }

      draw()
      raf = requestAnimationFrame(step)
    }

    function start() {
      if (running || still || !visible || document.hidden) return
      running = true
      raf = requestAnimationFrame(step)
    }
    function stop() {
      running = false
      cancelAnimationFrame(raf)
    }

    function drawStill() {
      // The settled step, frozen: same curve as the underline.
      for (let i = 0; i < N; i++) {
        const p = i / (N - 1)
        y[i] = p < 0.12 ? 0 : stepResponse((p - 0.12) * 0.55, 0.26, 26) * 0.5
      }
      ghosts.length = 0
      draw()
    }

    function onMove(e: PointerEvent) {
      const r = canvas!.getBoundingClientRect()
      const x = e.clientX - r.left
      const yy = e.clientY - r.top
      const near = x >= 0 && x <= w && yy >= baseY() - amp() * 1.6 && yy <= Math.min(h, baseY() + amp() * 1.2)
      probe.active = near
      probe.x = x
      probe.y = yy
      host.dataset.probing = near ? 'true' : 'false'
    }
    function onLeave() {
      probe.active = false
      host.dataset.probing = 'false'
    }
    function onDown(e: PointerEvent) {
      const r = canvas!.getBoundingClientRect()
      const ci = Math.round(((e.clientX - r.left) / w) * (N - 1))
      for (let k = -5; k <= 5; k++) {
        const i = ci + k
        if (i > 0 && i < N - 1) v[i] = at(v, i) + 0.16 * (1 - Math.abs(k) / 6)
      }
    }

    size()
    if (still) drawStill()

    const ro = new ResizeObserver(() => {
      size()
      if (still) drawStill()
      else draw()
    })
    ro.observe(host)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true
      if (visible) start()
      else stop()
    })
    io.observe(host)

    const mo = new MutationObserver(() => {
      accent = rgbVar(canvas, '--accent')
      if (!running) {
        if (still) drawStill()
        else draw()
      }
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVis)
    if (!still) {
      host.addEventListener('pointermove', onMove)
      host.addEventListener('pointerleave', onLeave)
      host.addEventListener('pointerdown', onDown)
    }
    start()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
      host.removeEventListener('pointerdown', onDown)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className="scope-canvas pointer-events-none absolute inset-0" />
}
