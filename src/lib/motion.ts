'use client'

import { useEffect, useState } from 'react'
import type { Transition, Variants } from 'motion/react'
import type { VisitorMode } from '@/data/types'

/**
 * Motion vocabulary.
 *
 * Each mode has its own timing while sharing one set of variant shapes, so
 * components do not need per-mode branches.
 */

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

/**
 * OPENING SEQUENCE TIMING, in milliseconds. The single source of truth.
 *
 * It lives here rather than inside <Opening> because two places need it and only
 * one of them should pay for it: <Opening> is a dynamically-imported chunk, while
 * <SettledTrace> ships in the main bundle. Importing the numbers from the
 * component would drag the whole opening sequence into every page that draws a
 * trace. <Opening> also hands these to CSS as custom properties, so the phase
 * timers and the stylesheet transitions cannot drift apart.
 */
export const INTRO_TIMING = {
  /**
   * Beam crosses the field.
   *
   * The transient itself lands in the first 40% of this, because the curve's flat
   * lead is 14% of its width and the ringing decays fast — the rest is the beam
   * extending a settled line, which is exactly what a real instrument shows you
   * and is the part that says "and it stays there". Long enough to read as
   * stability, short enough not to be waiting.
   */
  sweep: 760,
  /** The settled reading, held long enough to register as a result. */
  hold: 240,
  /** Field lifts while the page content drops in underneath it. */
  handoff: 420,
  /**
   * Slack between the end of the fade and the unmount. The CSS transition only
   * starts on the frame after the attribute flip, so tearing the overlay out at
   * exactly `handoff` would clip the last few frames — of an ease-in, which is
   * where all the movement is.
   */
  tail: 80,
} as const

/**
 * When the page underneath is handed back, in seconds.
 *
 * The reveal happens as the field *starts* lifting, not after it finishes, so
 * content is already dropping in behind a field that is still fading out.
 */
export const INTRO_REVEAL_SECONDS = (INTRO_TIMING.sweep + INTRO_TIMING.hold) / 1000

/**
 * Delay to add to an entrance that must not start until the opening has handed
 * the page over.
 *
 * Without this, an animation that begins on mount runs its whole course behind
 * the opening field and is simply finished by the time anyone can see it — which
 * is exactly what happened to the name underline: a 1.15s draw starting at 0.34s
 * was over before the field had finished lifting at 1.42s.
 *
 * Read once, synchronously, on the first client render. `data-intro` is set by
 * the pre-paint script in <head> long before React exists, so it is already
 * correct here; and it is only ever set on `/`, so every other page gets 0 and
 * keeps its original timing. Same for a repeat visit or reduced motion, where
 * there is no opening to wait for and waiting would just look slow.
 */
export function useIntroOffset(enabled: boolean): number {
  const [offset] = useState(() => {
    if (!enabled || typeof document === 'undefined') return 0
    return document.documentElement.dataset.intro === 'on' ? INTRO_REVEAL_SECONDS : 0
  })
  return offset
}

/**
 * Resolved synchronously on the first client render, not in an effect.
 *
 * The effect version had a real bug. It returned `true` until mounted, which made
 * `riseVariants` hand back `hidden: { opacity: 1 }`; the effect then flipped it to
 * `false`, redefining `hidden` as `{ opacity: 0 }`. Anything still sitting in the
 * hidden state — including rows partly visible at the fold, which have not yet met
 * the viewport margin — animated *out* to invisible and only came back on scroll.
 * Content flickering off after load is worse than any animation it was protecting.
 *
 * Reading matchMedia in the initialiser means the value is already correct on the
 * render React hydrates with, so the variant definitions never change underneath a
 * component. The build-time value stays `true`, so the exported HTML is fully
 * visible for anyone whose JavaScript never arrives.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window === 'undefined' ? true : window.matchMedia(REDUCED_QUERY).matches,
  )

  useEffect(() => {
    const query = window.matchMedia(REDUCED_QUERY)
    setReduced(query.matches)
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}

/** True on touch-primary devices, where the desktop motion set is replaced. */
export function useIsTouch(): boolean {
  const [touch, setTouch] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(hover: none) and (pointer: coarse)').matches,
  )
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
  return {
    hidden: { opacity: 0, y: MODE_RISE[mode] },
    visible: {
      opacity: 1,
      y: 0,
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
