import { useId, type CSSProperties } from 'react'
import { tracePath, traceRulePath } from '@/lib/trace'

/**
 * The settled trace, drawn as SVG.
 *
 * Used as the name underline on the landing page and as a section divider
 * elsewhere. It draws itself left to right with a CSS stroke-dashoffset
 * animation (`.trace-draw` in globals.css), so it needs no JavaScript and the
 * exported HTML already holds the finished line for reduced motion and lofi.
 */

export function SettledTrace({
  className = '',
  width = 720,
  height = 64,
  animate = true,
  delay = 0,
  strokeWidth = 2,
  afterIntro = false,
}: {
  className?: string
  width?: number
  height?: number
  animate?: boolean
  delay?: number
  strokeWidth?: number
  /** Wait for the landing-page opening sequence before drawing. */
  afterIntro?: boolean
}) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      data-decorative="true"
    >
      <path
        d={tracePath(width, height)}
        pathLength={1}
        className={animate ? `trace-draw${afterIntro ? ' trace-after-intro' : ''}` : undefined}
        style={delay ? ({ '--trace-delay': `${delay}s` } as CSSProperties) : undefined}
        stroke="rgb(var(--accent))"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/**
 * Thin divider version — a rule that happens to be a step response.
 *
 * `draw-in` gives it a scroll-driven clip reveal that costs no JavaScript and no
 * listener; where the timeline is unsupported it is simply a finished rule. See
 * globals.css.
 */
export function TraceDivider({ className = '' }: { className?: string }) {
  const id = useId()
  const width = 640
  const height = 18
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`draw-in h-4 w-full ${className}`}
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      data-decorative="true"
    >
      <defs>
        <linearGradient id={`fade-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="rgb(var(--accent))" stopOpacity="0.85" />
          <stop offset="0.7" stopColor="rgb(var(--hairline))" stopOpacity="1" />
          <stop offset="1" stopColor="rgb(var(--hairline))" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d={traceRulePath(width, height)}
        stroke={`url(#fade-${id})`}
        strokeWidth={1.4}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
