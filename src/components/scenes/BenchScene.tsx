'use client'

import { motion } from 'motion/react'
import { SceneFrame, useSceneTier } from './SceneFrame'

/**
 * ENGINEERING SCENE — the bench.
 *
 * Someone in safety glasses leans over a board, probe in hand. The probe touches
 * a test point, the scope beside them wakes, and the trace on it overshoots and
 * settles: a real second-order step response, the same curve as the site's
 * underline and the same behaviour as the loops he tunes at Chevron.
 *
 * The glasses are the point. That is what the work looks like — not a hooded
 * figure at a terminal. The reflection in the lens is the trace, so the person
 * and the measurement are the same image.
 *
 * Costs one inline SVG. No sprite sheet, no character rig, no 3D.
 */

const W = 420
const H = 280

/** Step response y(t) for the scope trace, in the panel's own coordinates. */
function tracePoints(): string {
  const x0 = 214
  const x1 = 396
  const baseY = 118
  const top = 74
  const zeta = 0.24
  const omega = 22
  const pts: string[] = []
  for (let i = 0; i <= 90; i++) {
    const p = i / 90
    const t = p * 1.0
    const wd = omega * Math.sqrt(1 - zeta * zeta)
    const phi = Math.acos(zeta)
    const y =
      t <= 0
        ? 0
        : 1 - (Math.exp(-zeta * omega * t) / Math.sqrt(1 - zeta * zeta)) * Math.sin(wd * t + phi)
    pts.push(`${(x0 + (x1 - x0) * p).toFixed(1)} ${(baseY + (top - baseY) * y).toFixed(1)}`)
  }
  return `M ${x0} ${baseY} L ${(x0 + 8).toFixed(1)} ${baseY} L ` + pts.join(' L ')
}

const TRACE = tracePoints()

export function BenchScene() {
  const tier = useSceneTier()
  const still = tier === 'still'
  const simple = tier === 'simple'

  // Simple tier: everything arrives together on one short fade.
  const t = (full: number, delay = 0) =>
    still
      ? { duration: 0 }
      : simple
        ? { duration: 0.4, ease: [0.2, 0.9, 0.1, 1] as const }
        : { duration: full, delay, ease: [0.2, 0.9, 0.1, 1] as const }

  const fade = (delay: number) => ({
    initial: still ? false : ({ opacity: 0 } as const),
    animate: still ? undefined : ({ opacity: 1 } as const),
    transition: t(0.5, delay),
  })

  return (
    <SceneFrame
      viewBox={`0 0 ${W} ${H}`}
      label="An engineer in safety glasses holds a probe against a circuit board while an oscilloscope beside them shows a step response overshooting and settling."
      caption={
        <>
          The curve on the scope is a real second-order step response — overshoot, then settle. It is
          the same shape as the underline on this site, and the same behaviour as a control loop that
          has just been given a setpoint.
        </>
      }
    >
      {/* Graticule. Reference behind the signal, in the alt colour. */}
      <g stroke="rgb(var(--accent-alt))" strokeOpacity="0.16" strokeWidth="1">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={`v${i}`} x1={30 + i * 60} y1="16" x2={30 + i * 60} y2={H - 16} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <line key={`h${i}`} x1="16" y1={40 + i * 60} x2={W - 16} y2={40 + i * 60} />
        ))}
      </g>

      {/* --- Scope on the bench, right side --- */}
      <motion.g {...fade(0)}>
        <rect
          x="204"
          y="52"
          width="200"
          height="86"
          rx="3"
          fill="rgb(var(--surface))"
          stroke="rgb(var(--hairline))"
          strokeWidth="1.5"
        />
        <line
          x1="204"
          y1="118"
          x2="404"
          y2="118"
          stroke="rgb(var(--accent-alt))"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        {/* Bezel controls — two knobs, because that is what a scope has. */}
        <circle cx="216" cy="150" r="6" stroke="rgb(var(--hairline))" strokeWidth="1.5" />
        <circle cx="236" cy="150" r="4" stroke="rgb(var(--hairline))" strokeWidth="1.5" />
      </motion.g>

      {/* The trace itself. Drawn only after contact, because that is what triggers it. */}
      <motion.path
        d={TRACE}
        stroke="rgb(var(--accent))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={still ? false : { pathLength: 0, opacity: 0 }}
        animate={still ? undefined : { pathLength: 1, opacity: 1 }}
        transition={
          still
            ? { duration: 0 }
            : simple
              ? { pathLength: { duration: 0.7, ease: 'easeOut' }, opacity: { duration: 0.2 } }
              : {
                  pathLength: { duration: 0.9, delay: 1.15, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: 0.15, delay: 1.15 },
                }
        }
      />

      {/* --- Board on the bench, left of the scope --- */}
      <motion.g {...fade(0.08)}>
        <rect
          x="44"
          y="176"
          width="150"
          height="60"
          rx="2"
          fill="rgb(var(--surface))"
          stroke="rgb(var(--hairline))"
          strokeWidth="1.5"
        />
        {/* Traces and a chip. Reads as a board without pretending to be a real layout. */}
        <g stroke="rgb(var(--accent-alt))" strokeOpacity="0.5" strokeWidth="1.2">
          <path d="M56 226 H92 V204 H124" />
          <path d="M56 214 H74 V192 H124" />
          <path d="M150 192 H176 V226 H188" />
        </g>
        <rect
          x="122"
          y="186"
          width="28"
          height="22"
          rx="1"
          fill="rgb(var(--surface-sunken))"
          stroke="rgb(var(--hairline))"
          strokeWidth="1.2"
        />
        {/* The test point the probe is going for. */}
        <circle cx="112" cy="216" r="3" fill="rgb(var(--accent))" fillOpacity="0.9" />
      </motion.g>

      {/* --- The engineer. Head, glasses, shoulder, arm, probe. --- */}
      <motion.g {...fade(0.16)}>
        {/* Shoulder and torso, leaning in over the board. */}
        <path
          d="M18 268 C 22 226, 44 206, 76 200 L 96 236 L 24 268 Z"
          fill="rgb(var(--surface-raised))"
          stroke="rgb(var(--hairline))"
          strokeWidth="1.5"
        />
        {/* Head, tilted down toward the work. */}
        <path
          d="M60 176 C 60 158, 74 148, 88 150 C 102 152, 108 164, 106 178 C 104 192, 92 200, 78 198 C 66 196, 60 188, 60 176 Z"
          fill="rgb(var(--surface-raised))"
          stroke="rgb(var(--hairline))"
          strokeWidth="1.5"
        />
        {/* SAFETY GLASSES — the detail that makes it this job and not another one. */}
        <g>
          <path
            d="M62 170 L 106 164"
            stroke="rgb(var(--content-muted))"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M64 170 C 64 178, 70 182, 78 181 C 84 180, 86 174, 85 168 L 64 170 Z"
            fill="rgb(var(--accent-alt))"
            fillOpacity="0.22"
            stroke="rgb(var(--content-muted))"
            strokeWidth="1.4"
          />
          <path
            d="M90 167 C 90 175, 96 179, 102 177 C 107 175, 108 169, 107 164 L 90 167 Z"
            fill="rgb(var(--accent-alt))"
            fillOpacity="0.22"
            stroke="rgb(var(--content-muted))"
            strokeWidth="1.4"
          />
          {/* Bridge, and the temple arm going back past the ear. */}
          <path d="M85 168 L 90 167" stroke="rgb(var(--content-muted))" strokeWidth="1.4" />
          <path
            d="M62 171 L 54 176"
            stroke="rgb(var(--content-muted))"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          {/* The trace, reflected in the lens. Appears when the scope does. */}
          <motion.path
            d="M67 174 L 71 174 L 73 170 L 75 176 L 77 173 L 82 173"
            stroke="rgb(var(--accent))"
            strokeWidth="1.2"
            strokeLinecap="round"
            initial={still ? false : { opacity: 0 }}
            animate={still ? undefined : { opacity: 0.95 }}
            transition={t(0.4, 1.3)}
          />
        </g>
      </motion.g>

      {/*
        Arm and probe. On the full tier the wrist rotates down until the tip meets
        the test point — the contact is what starts the trace, so the timing of the
        two is not decorative.
      */}
      <motion.g
        style={{ originX: '150px', originY: '150px' }}
        initial={still ? false : { rotate: simple ? 0 : -14, opacity: 0 }}
        animate={still ? undefined : { rotate: 0, opacity: 1 }}
        transition={
          still
            ? { duration: 0 }
            : simple
              ? { duration: 0.4 }
              : { duration: 0.75, delay: 0.42, ease: [0.16, 1.08, 0.3, 1] }
        }
      >
        {/* Upper arm from the shoulder to the hand. */}
        <path
          d="M74 214 C 100 208, 124 200, 146 194"
          stroke="rgb(var(--surface-raised))"
          strokeWidth="15"
          strokeLinecap="round"
        />
        <path
          d="M74 214 C 100 208, 124 200, 146 194"
          stroke="rgb(var(--hairline))"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Probe body, angled down to the board. */}
        <g transform="rotate(38 150 192)">
          <rect
            x="144"
            y="176"
            width="12"
            height="34"
            rx="2.5"
            fill="rgb(var(--content-muted))"
            stroke="rgb(var(--hairline))"
            strokeWidth="1"
          />
          <rect x="144" y="185" width="12" height="5" fill="rgb(var(--accent))" />
          <path
            d="M150 210 L 150 222"
            stroke="rgb(var(--accent))"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>
        {/* Lead running off to the scope. */}
        <path
          d="M156 182 C 182 176, 196 152, 204 112"
          stroke="rgb(var(--content-faint))"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </motion.g>

      {/* Contact flash at the test point, timed to the start of the trace. */}
      {!still && (
        <motion.circle
          cx="112"
          cy="216"
          r="4"
          stroke="rgb(var(--accent-strong))"
          strokeWidth="1.6"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.5, 3.4, 4.2] }}
          transition={{
            duration: simple ? 0.5 : 0.6,
            delay: simple ? 0.25 : 1.1,
            ease: 'easeOut',
          }}
          style={{ originX: '112px', originY: '216px' }}
        />
      )}
    </SceneFrame>
  )
}
