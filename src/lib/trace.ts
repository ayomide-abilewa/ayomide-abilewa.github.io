/**
 * The signature curve.
 *
 * A real underdamped second-order step response:
 *
 *   y(t) = 1 − e^(−ζωₙt)/√(1−ζ²) · sin(ω_d t + φ),   ω_d = ωₙ√(1−ζ²),  φ = acos(ζ)
 *
 * This is the site's one recurring graphic — the name underline, section
 * dividers, the favicon, the social image. It is not a decorative squiggle; it
 * is the response of the kind of control loop Ayomide works with, which is why
 * the same shape can carry the whole identity without being arbitrary.
 *
 * Pure and deterministic, so it can be used at build time (OG images, favicon)
 * and at runtime with identical output.
 */

export type TraceOptions = {
  /** Damping ratio. Lower overshoots more. 0.22–0.3 reads best. */
  zeta?: number
  /** Natural frequency, in radians per unit of the normalised x axis. */
  omega?: number
  /** Fraction of the width spent flat before the step. */
  lead?: number
  /** Samples across the settling region. */
  samples?: number
}

const DEFAULTS: Required<TraceOptions> = {
  zeta: 0.26,
  omega: 26,
  lead: 0.14,
  samples: 220,
}

/** Normalised response in [0, ~1.45]. y=0 before the step, settling to 1. */
export function stepResponse(t: number, zeta: number, omega: number): number {
  if (t <= 0) return 0
  const wd = omega * Math.sqrt(1 - zeta * zeta)
  const phi = Math.acos(zeta)
  return 1 - (Math.exp(-zeta * omega * t) / Math.sqrt(1 - zeta * zeta)) * Math.sin(wd * t + phi)
}

/**
 * SVG path for the curve, drawn left to right.
 *
 * The baseline sits at `height` and the settled value at `settleY`, so the
 * overshoot has room above it without clipping.
 */
export function tracePath(width: number, height: number, options: TraceOptions = {}): string {
  const { zeta, omega, lead, samples } = { ...DEFAULTS, ...options }
  const leadX = width * lead
  // Settled line sits low in the box; the overshoot peak reaches near the top.
  const baseY = height * 0.94
  const settleY = height * 0.5
  const span = settleY - baseY // negative: up is smaller y

  const points: string[] = [`M 0 ${baseY.toFixed(2)}`, `L ${leadX.toFixed(2)} ${baseY.toFixed(2)}`]

  for (let i = 1; i <= samples; i++) {
    const p = i / samples
    const x = leadX + (width - leadX) * p
    // Compress time so the visible span covers the settling transient.
    const y = baseY + span * stepResponse(p * 1.0, zeta, omega)
    points.push(`L ${x.toFixed(2)} ${y.toFixed(2)}`)
  }

  return points.join(' ')
}

/**
 * A short flat-then-settle variant for inline rules and dividers, where the
 * full transient would be too busy.
 */
export function traceRulePath(width: number, height: number): string {
  return tracePath(width, height, { zeta: 0.34, omega: 17, lead: 0.55, samples: 120 })
}
