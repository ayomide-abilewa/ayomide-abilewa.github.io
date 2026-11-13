'use client'

import { useEffect } from 'react'

/**
 * Cursor spotlight for `.spot`, `.panel-live` and `.row-live` panels: one listener for the page, writing the
 * pointer position into the hovered panel's --mx/--my. Cards (`.spot`, `.panel-live`) also get --rx/--ry, so
 * they lean toward the pointer; both the glow and the tilt are CSS.
 */
const MAX_TILT = 7

export function Spotlight() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let tilted: HTMLElement | null = null
    const settle = () => {
      tilted?.style.removeProperty('--rx')
      tilted?.style.removeProperty('--ry')
      tilted = null
    }
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>('.spot, .panel-live, .row-live')
      if (el !== tilted) settle()
      if (!el) return
      const r = el.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      el.style.setProperty('--mx', `${x}px`)
      el.style.setProperty('--my', `${y}px`)
      if (still || el.classList.contains('row-live')) return
      el.style.setProperty('--ry', `${((x / r.width - 0.5) * MAX_TILT * 2).toFixed(2)}deg`)
      el.style.setProperty('--rx', `${((0.5 - y / r.height) * MAX_TILT * 2).toFixed(2)}deg`)
      tilted = el
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    return () => document.removeEventListener('pointermove', onMove)
      settle()
  }, [])
  return null
}
