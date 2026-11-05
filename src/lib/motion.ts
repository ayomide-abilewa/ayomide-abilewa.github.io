'use client'

import { useEffect, useState } from 'react'

/**
 * Motion helpers. The animations themselves are CSS (see globals.css); this
 * file holds the opening's timing and the hooks that read motion preferences.
 */

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

/**
 * OPENING SEQUENCE TIMING, in milliseconds. The single source of truth.
 *
 * <Opening> hands these to CSS as custom properties, so the phase timers and the
 * stylesheet transitions cannot drift apart. The underline's 1s wait for the
 * sweep (`.trace-after-intro`) is sweep + hold, rounded.
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
 * A media query, false until mounted.
 *
 * The build has no window, so the first browser render has to agree with it;
 * the real value arrives in an effect. Callers must treat false as "render the
 * finished, static state", never as "hide and animate".
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const list = window.matchMedia(query)
    setMatches(list.matches)
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches)
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }, [query])
  return matches
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery(REDUCED_QUERY)
}

/** True on touch-primary devices, where the desktop motion set is replaced. */
export function useIsTouch(): boolean {
  return useMediaQuery('(hover: none) and (pointer: coarse)')
}

/** False on the build and the first browser render, true after. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}
