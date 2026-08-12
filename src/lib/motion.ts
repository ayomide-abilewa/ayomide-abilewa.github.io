'use client'

import { useEffect, useState } from 'react'
import type { Transition, Variants } from 'motion/react'
import type { VisitorMode } from '@/data/types'

/**
 * Motion vocabulary.
 *
 * Each path gets its own easing and timing — the "interaction language" from
 * Each mode has its own timing while sharing one set of variant shapes, so components do not need
 * per-mode branches.
 */

export function usePrefersReducedMotion(): boolean {
  // Default to reduced until we know, so the first paint is never a big animation
  // for someone who asked not to have one.
  const [reduced, setReduced] = useState(true)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}

/** True on touch-primary devices, where the desktop motion set is replaced. */
export function useIsTouch(): boolean {
  const [touch, setTouch] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(hover: none) and (pointer: coarse)')
    setTouch(query.matches)
    const onChange = (event: MediaQueryListEvent) => setTouch(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return touch
}

/**
 * Per-mode transitions.
 *  engineering — mechanical: quick, decisive, hard stop.
 *  research    — even and unhurried, like turning a page.
 *  scholarship — a gentle settle with a touch of overshoot.
 */
export const MODE_TRANSITION: Record<VisitorMode, Transition> = {
  engineering: { duration: 0.34, ease: [0.2, 0.9, 0.1, 1] },
  research: { duration: 0.68, ease: [0.4, 0, 0.2, 1] },
  scholarship: { duration: 0.58, ease: [0.16, 1.08, 0.3, 1] },
  everything: { duration: 0.48, ease: [0.16, 1.08, 0.3, 1] },
}

/** Distance travelled on entrance, per mode. Research barely moves; it fades. */
export const MODE_RISE: Record<VisitorMode, number> = {
  engineering: 14,
  research: 8,
  scholarship: 24,
  everything: 16,
}

export function riseVariants(mode: VisitorMode, reduced: boolean): Variants {
  if (reduced) {
    return {
      hidden: { opacity: 1 },
      visible: { opacity: 1, transition: { duration: 0 } },
    }
  }
  const hiddenByMode: Record<VisitorMode, { opacity: number; y: number; x?: number; scale?: number; rotate?: number; filter?: string }> = {
    engineering: { opacity: 0, y: 8, x: -24, scale: 0.985 },
    research: { opacity: 0, y: 6, scale: 1.025, filter: 'blur(7px)' },
    scholarship: { opacity: 0, y: 30, rotate: -0.8, scale: 0.97 },
    everything: { opacity: 0, y: 18, scale: 0.94, rotate: 0.8 },
  }
  return {
    hidden: hiddenByMode[mode],
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      rotate: 0,
      filter: 'blur(0px)',
      transition: MODE_TRANSITION[mode],
    },
  }
}

/** Staggered container for lists of cards, rows and figures. */
export function staggerVariants(mode: VisitorMode, reduced: boolean): Variants {
  const step: Record<VisitorMode, number> = {
    engineering: 0.045,
    research: 0.09,
    scholarship: 0.075,
    everything: 0.06,
  }
  return {
    hidden: {},
    visible: {
      transition: reduced ? { staggerChildren: 0 } : { staggerChildren: step[mode] },
    },
  }
}

/** Standard scroll-reveal props. One import, consistent behaviour everywhere. */
export function revealProps(mode: VisitorMode, reduced: boolean) {
  return {
    initial: 'hidden' as const,
    whileInView: 'visible' as const,
    viewport: { once: true, margin: '-12% 0px -12% 0px' },
    variants: riseVariants(mode, reduced),
  }
}
