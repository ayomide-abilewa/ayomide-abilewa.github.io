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

/* ------------------------------------------------------------------------- *
 * Acquisition — the opening sequence's geometry.
 * ------------------------------------------------------------------------- */

/**
 * Deterministic per-sample noise in [-1, 1].
 *
 * A hash rather than a PRNG so sample *i* always gets the same offset: the
 * region behind the sweep has to be perfectly still. Seeded randomness would
 * re-roll every frame and make the settled part of the trace crawl.
 */
function sampleNoise(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453
  return (x - Math.floor(x)) * 2 - 1
}

/** The y value of the settled curve at normalised x position `u` (0–1). */
export function traceYAt(
  width: number,
  height: number,
  u: number,
  options: TraceOptions = {},
): number {
  const { zeta, omega, lead } = { ...DEFAULTS, ...options }
  const baseY = height * 0.94
  const span = height * 0.5 - baseY
  if (u <= lead) return baseY
  const p = (u - lead) / (1 - lead)
  return baseY + span * stepResponse(p, zeta, omega)
}

/**
 * The trace as it is being acquired, swept left to right.
 *
 * This is the opening sequence: an instrument sweeping across a reading that is
 * noisy at the beam and settled behind it. `sweep` is 0 at the left edge and 1 at
 * the right, and only the portion already swept is emitted, so the path grows
 * rather than being revealed by a mask.
 *
 * Two things decay the noise, and both matter:
 *   - distance behind the beam, so each sample locks in shortly after acquisition
 *   - global progress, so the last samples are already clean when they arrive
 *
 * At `sweep = 1` both terms are zero and the output is byte-identical to
 * `tracePath(width, height)`. That equality is the whole point: the opening
 * resolves into the exact curve that becomes the name underline, the section
 * dividers and the favicon, so the sequence hands off to the brand rather than
 * being wiped away by it.
 */
export function acquisitionPath(
  width: number,
  height: number,
  sweep: number,
  options: TraceOptions = {},
): string {
  const opts = { ...DEFAULTS, ...options }
  const { samples } = opts
  const progress = Math.min(Math.max(sweep, 0), 1)
  const settling = 1 - progress
  const amplitude = height * 0.17 * settling

  const points: string[] = []
  for (let i = 0; i <= samples; i++) {
    const u = i / samples
    if (u > progress) break
    const y = traceYAt(width, height, u, opts)
    // Only a narrow window behind the beam is still unstable.
    const jitter = amplitude * Math.exp(-(progress - u) * 22) * sampleNoise(i)
    const command = points.length === 0 ? 'M' : 'L'
    points.push(`${command} ${(u * width).toFixed(2)} ${(y + jitter).toFixed(2)}`)
  }

  // Below one point there is no line to draw; start flat at the baseline.
  if (points.length === 0) return `M 0 ${(height * 0.94).toFixed(2)}`
  return points.join(' ')
}
