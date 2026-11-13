'use client'

import { useEffect } from 'react'

/**
 * Cursor spotlight for `.spot`, `.panel-live` and `.row-live` panels: one listener for the page, writing the
 * pointer position into the hovered panel's --mx/--my. The glow itself is CSS.
 */
export function Spotlight() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>('.spot, .panel-live, .row-live')
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    return () => document.removeEventListener('pointermove', onMove)
  }, [])
  return null
}
