'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useMode } from '@/lib/mode'
import { track } from '@/lib/analytics'
import { acquisitionPath } from '@/lib/trace'
import { INTRO_TIMING as TIMING } from '@/lib/motion'

/**
 * The opening: signal acquisition.
 *
 * An instrument sweeps across an unsettled reading. The trace is noisy at the
 * beam and locks in behind it, kicking, overshooting and ringing down into the
 * exact step response that becomes the name underline on the page below — same
 * curve, same maths, same file. The sequence resolves *into* the identity
 * instead of being cleared away to make room for it.
 *
 * Three deliberate constraints, all learned from the version this replaces:
 *
 *   1. It is short. 1.5s end to end, and the page is revealed at 1.0s — before the
 *      field has finished lifting, so the content is already dropping in behind
 *      it. Nobody is held at the door. The version this replaces ran 4.9s.
 *   2. Timings live in one object, in lib/motion, and are handed to CSS as custom
 *      properties. The JS phases, the stylesheet transitions and the entrances
 *      that have to wait for this sequence all read the same numbers.
 *   3. The only per-frame work is one `d` attribute and one `x` on a line —
 *      no layout properties, no filters, no backdrop-filter, and the loop stops
 *      dead once the sweep completes rather than looping forever.
 */

type Phase = 'sweep' | 'hold' | 'handoff' | 'done'

/** Trace coordinate space. Stretched to the viewport, so only the ratio matters. */
const VIEW = { w: 1000, h: 200 }

export function Opening({ onReveal }: { onReveal?: () => void }) {
  const { markIntroSeen, mode, lofi } = useMode()
  const [active, setActive] = useState(false)
  const [phase, setPhase] = useState<Phase>('sweep')
  const skipRef = useRef<HTMLButtonElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const beamRef = useRef<SVGGElement>(null)
  const timers = useRef<number[]>([])
  const revealed = useRef(false)

  const reveal = useCallback(() => {
    if (revealed.current) return
    revealed.current = true
    document.documentElement.removeAttribute('data-intro')
    onReveal?.()
  }, [onReveal])

  const finish = useCallback(() => {
    timers.current.forEach(window.clearTimeout)
    reveal()
    setPhase('done')
    setActive(false)
    markIntroSeen()
  }, [markIntroSeen, reveal])

  const skip = useCallback(() => {
    track({ name: 'intro_skipped', mode })
    finish()
  }, [finish, mode])

  useEffect(() => {
    const wanted = document.documentElement.dataset.intro === 'on'
    const systemReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!wanted || systemReduced || lofi) {
      document.documentElement.removeAttribute('data-intro')
      setPhase('done')
      return
    }
    setActive(true)
    skipRef.current?.focus()
    timers.current = [
      window.setTimeout(() => setPhase('hold'), TIMING.sweep),
      window.setTimeout(() => {
        // Content is revealed as the field starts lifting, not after.
        setPhase('handoff')
        reveal()
      }, TIMING.sweep + TIMING.hold),
      window.setTimeout(finish, TIMING.sweep + TIMING.hold + TIMING.handoff + TIMING.tail),
    ]
    return () => timers.current.forEach(window.clearTimeout)
    // The intro decision is intentionally made once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * The sweep.
   *
   * One rAF loop for 760ms, writing a single path attribute per frame — about 46
   * recomputes of the curve on a 60Hz display, then it cancels itself. React is
   * deliberately not involved: re-rendering per frame to move a line would cost
   * far more than the geometry it is drawing.
   */
  useEffect(() => {
    if (!active || phase !== 'sweep') return
    const path = pathRef.current
    if (!path) return

    let frame = 0
    const start = performance.now()

    const draw = (now: number) => {
      const t = Math.min((now - start) / TIMING.sweep, 1)
      path.setAttribute('d', acquisitionPath(VIEW.w, VIEW.h, t))
      beamRef.current?.setAttribute('transform', `translate(${(t * VIEW.w).toFixed(2)} 0)`)
      if (t < 1) frame = requestAnimationFrame(draw)
    }

    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [active, phase])

  /** Keep the settled trace on screen through the handoff. */
  useEffect(() => {
    if (!active || phase === 'sweep') return
    pathRef.current?.setAttribute('d', acquisitionPath(VIEW.w, VIEW.h, 1))
  }, [active, phase])

  useEffect(() => {
    if (active && lofi) finish()
  }, [active, lofi, finish])

  useEffect(() => {
    if (!active) return
    const prior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') skip()
    }
    window.addEventListener('keydown', key)
    return () => {
      document.body.style.overflow = prior
      window.removeEventListener('keydown', key)
    }
  }, [active, skip])

  if (!active || phase === 'done') return null

  const settled = phase !== 'sweep'
  const style = {
    '--sweep': `${TIMING.sweep}ms`,
    '--hold': `${TIMING.hold}ms`,
    '--handoff': `${TIMING.handoff}ms`,
  } as CSSProperties

  return (
    <div
      className="acquire"
      data-phase={phase}
      style={style}
      role="dialog"
      aria-modal="true"
      aria-label="Site introduction"
    >
      <div className="acquire-graticule" aria-hidden="true" />

      <div className="acquire-band" aria-hidden="true">
        <svg
          className="acquire-scope"
          viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Where the reading is heading. Drawn first, so the trace lands on it. */}
          <line
            className="acquire-target"
            x1="0"
            y1={VIEW.h * 0.5}
            x2={VIEW.w}
            y2={VIEW.h * 0.5}
            vectorEffect="non-scaling-stroke"
          />
          <path ref={pathRef} className="acquire-signal" vectorEffect="non-scaling-stroke" />
          {/* Vertical geometry only: a squashed viewBox cannot distort it. */}
          <g ref={beamRef} className="acquire-beam">
            <line x1="0" y1="0" x2="0" y2={VIEW.h} vectorEffect="non-scaling-stroke" />
          </g>
        </svg>

        <p className="acquire-readout">
          <span>Ch 1 · step response</span>
          <span className="acquire-state">{settled ? 'settled' : 'acquiring'}</span>
        </p>
      </div>

      <button ref={skipRef} type="button" onClick={skip} className="acquire-skip">
        Skip <span aria-hidden="true">Esc</span>
      </button>
    </div>
  )
}
