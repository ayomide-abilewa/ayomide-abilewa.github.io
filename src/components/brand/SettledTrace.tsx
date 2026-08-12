'use client'

import { motion } from 'motion/react'
import { useId } from 'react'
import { tracePath, traceRulePath } from '@/lib/trace'
import { usePrefersReducedMotion } from '@/lib/motion'

/**
 * The settled trace, drawn as SVG.
 *
 * Used as the name underline on the landing page and as a section divider
 * elsewhere. When motion is allowed it draws itself left to right via
 * stroke-dashoffset — GPU-cheap, no layout, no JS per frame.
 */

export function SettledTrace({
  className = '',
  width = 720,
  height = 64,
  animate = true,
  delay = 0,
  strokeWidth = 2,
}: {
  className?: string
  width?: number
  height?: number
  animate?: boolean
  delay?: number
  strokeWidth?: number
}) {
  const reduced = usePrefersReducedMotion()
  const d = tracePath(width, height)
  const shouldAnimate = animate && !reduced

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
      <motion.path
        d={d}
        stroke="rgb(var(--accent))"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={shouldAnimate ? { pathLength: 0, opacity: 0 } : false}
        animate={shouldAnimate ? { pathLength: 1, opacity: 1 } : undefined}
        transition={
          shouldAnimate
            ? { pathLength: { duration: 1.15, ease: [0.4, 0, 0.2, 1], delay }, opacity: { duration: 0.2, delay } }
            : undefined
        }
      />
    </svg>
  )
}

/** Thin divider version — a rule that happens to be a step response. */
export function TraceDivider({ className = '' }: { className?: string }) {
  const id = useId()
  const width = 640
  const height = 18
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`h-4 w-full ${className}`}
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
