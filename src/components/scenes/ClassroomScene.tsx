'use client'

import { motion } from 'motion/react'
import { SceneFrame, useSceneTier } from './SceneFrame'

/**
 * SCHOLARSHIP SCENE — the classroom.
 *
 * Someone stands at a board and draws a circuit: battery, resistor, LED. As the
 * last wire closes the loop the LED lights, and four students sitting in front of
 * the board light up a beat later, one after another.
 *
 * That order is the whole idea, and it is why this scene exists rather than a
 * recoloured version of the engineering one: the circuit closing is not the point;
 * the students understanding it is. SPAW 3.0 is six sessions of exactly this.
 *
 * Motion is the gentlest of the three — a settle with slight overshoot, the same
 * easing the scholarship path uses everywhere.
 */

const W = 420
const H = 280

const SETTLE = [0.16, 1.08, 0.3, 1] as const

/** Four students, spaced along the front row. */
const SEATS = [
  { x: 74, delay: 2.5 },
  { x: 146, delay: 2.68 },
  { x: 218, delay: 2.86 },
  { x: 290, delay: 3.04 },
]

export function ClassroomScene() {
  const tier = useSceneTier()
  const still = tier === 'still'
  const simple = tier === 'simple'

  const fade = (delay: number) => ({
    initial: still ? false : ({ opacity: 0 } as const),
    animate: still ? undefined : ({ opacity: 1 } as const),
    transition: still
      ? { duration: 0 }
      : simple
        ? { duration: 0.45, ease: SETTLE }
        : { duration: 0.6, delay, ease: SETTLE },
  })

  /** Chalk stroke drawn left to right; instant on the still tier. */
  const chalk = (delay: number, duration = 0.5) => ({
    initial: still ? false : ({ pathLength: 0, opacity: 0 } as const),
    animate: still ? undefined : ({ pathLength: 1, opacity: 1 } as const),
    transition: still
      ? { duration: 0 }
      : simple
        ? { pathLength: { duration: 0.5, ease: 'easeOut' as const }, opacity: { duration: 0.15 } }
        : {
            pathLength: { duration, delay, ease: [0.4, 0, 0.2, 1] as const },
            opacity: { duration: 0.12, delay },
          },
  })

  // On the simple tier the lamp and the students light together, quickly.
  const litDelay = simple ? 0.55 : 2.15

  return (
    <SceneFrame
      viewBox={`0 0 ${W} ${H}`}
      label="A teacher at a board draws a circuit — battery, resistor and lamp. The lamp lights when the loop closes, and four students seated in front of the board light up one after another."
      caption={
        <>
          The lamp is not the end of the lesson. Six sessions of SPAW 3.0 exist because the circuit
          working and the room understanding why are two different events, and the second one is the
          harder build.
        </>
      }
    >
      {/* --- The board --- */}
      <motion.g {...fade(0)}>
        <rect
          x="96"
          y="26"
          width="300"
          height="140"
          rx="3"
          fill="rgb(var(--surface-sunken))"
          stroke="rgb(var(--accent-alt))"
          strokeOpacity="0.55"
          strokeWidth="2"
        />
      </motion.g>

      {/* --- The circuit, drawn stroke by stroke in the order a person draws it --- */}
      <g
        stroke="rgb(var(--content))"
        strokeOpacity="0.72"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      >
        {/* Battery: long plate, short plate. */}
        <motion.path d="M150 108 V 76" {...chalk(0.3, 0.25)} />
        <motion.path d="M164 100 V 84" {...chalk(0.5, 0.2)} />
        {/* Top wire from battery to the resistor. */}
        <motion.path d="M150 76 V 56 H 232" {...chalk(0.68, 0.4)} />
        {/* Resistor, zig-zag. */}
        <motion.path
          d="M232 56 L 240 46 L 250 66 L 260 46 L 270 66 L 278 56 H 300"
          {...chalk(1.02, 0.5)}
        />
        {/* Down the right side to the lamp. */}
        <motion.path d="M300 56 V 92" {...chalk(1.5, 0.25)} />
        {/* Return wire closing the loop — the last stroke, so it earns the light. */}
        <motion.path d="M300 128 V 148 H 157 V 108" {...chalk(1.78, 0.42)} />
      </g>

      {/* Lamp on the board: circle with a cross, the standard symbol. */}
      <motion.g {...chalk(1.62, 0.34)}>
        <circle
          cx="300"
          cy="110"
          r="18"
          stroke="rgb(var(--content))"
          strokeOpacity="0.72"
          strokeWidth="2"
        />
        <path
          d="M288 98 L 312 122 M 312 98 L 288 122"
          stroke="rgb(var(--content))"
          strokeOpacity="0.72"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </motion.g>

      {/* The lamp lights. One filled disc plus two short rays — no glow, no blur. */}
      <motion.g
        initial={still ? false : { opacity: 0 }}
        animate={still ? undefined : { opacity: 1 }}
        transition={still ? { duration: 0 } : { duration: 0.34, delay: litDelay, ease: SETTLE }}
      >
        <circle cx="300" cy="110" r="18" fill="rgb(var(--accent))" fillOpacity="0.22" />
        <circle cx="300" cy="110" r="5" fill="rgb(var(--accent))" />
        <g stroke="rgb(var(--accent))" strokeWidth="2" strokeLinecap="round">
          <line x1="300" y1="82" x2="300" y2="74" />
          <line x1="324" y1="110" x2="332" y2="110" />
          <line x1="300" y1="138" x2="300" y2="146" />
        </g>
      </motion.g>

      {/* --- The teacher, at the right edge of the board, arm raised to it --- */}
      <motion.g {...fade(0.12)}>
        {/* Head. */}
        <path
          d="M356 96 C 356 80, 368 71, 381 73 C 394 75, 399 86, 397 99 C 395 112, 384 119, 371 117 C 360 115, 356 108, 356 96 Z"
          fill="rgb(var(--surface-raised))"
          stroke="rgb(var(--hairline))"
          strokeWidth="1.5"
        />
        {/* Body. */}
        <path
          d="M404 250 C 402 200, 392 178, 370 172 L 350 214 L 396 250 Z"
          fill="rgb(var(--surface-raised))"
          stroke="rgb(var(--hairline))"
          strokeWidth="1.5"
        />
        {/* Chalk arm, reaching to where the last wire was drawn. */}
        <path
          d="M366 186 C 344 174, 324 156, 312 140"
          stroke="rgb(var(--surface-raised))"
          strokeWidth="13"
          strokeLinecap="round"
        />
        <path
          d="M366 186 C 344 174, 324 156, 312 140"
          stroke="rgb(var(--hairline))"
          strokeWidth="1.3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M314 142 L 304 132"
          stroke="rgb(var(--content))"
          strokeOpacity="0.8"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </motion.g>

      {/* --- The front row. Each student lights after the lamp, not with it. --- */}
      {SEATS.map((seat, i) => (
        <g key={seat.x}>
          <motion.g
            initial={still ? false : { opacity: 0, y: 8 }}
            animate={still ? undefined : { opacity: 1, y: 0 }}
            transition={
              still
                ? { duration: 0 }
                : simple
                  ? { duration: 0.4, delay: 0.06 * i, ease: SETTLE }
                  : { duration: 0.5, delay: 0.2 + 0.08 * i, ease: SETTLE }
            }
          >
            {/* Head. */}
            <circle
              cx={seat.x}
              cy="212"
              r="13"
              fill="rgb(var(--surface-raised))"
              stroke="rgb(var(--hairline))"
              strokeWidth="1.4"
            />
            {/* Shoulders, cut off by the bottom of the frame like a real front row. */}
            <path
              d={`M${seat.x - 26} 262 C ${seat.x - 24} 240, ${seat.x - 12} 228, ${seat.x} 228 C ${seat.x + 12} 228, ${seat.x + 24} 240, ${seat.x + 26} 262 Z`}
              fill="rgb(var(--surface-raised))"
              stroke="rgb(var(--hairline))"
              strokeWidth="1.4"
            />
          </motion.g>

          {/*
            The understanding. A small filled mark above each head, in the accent —
            same colour as the lamp, because it is the same event arriving second.
          */}
          <motion.g
            initial={still ? false : { opacity: 0, scale: 0.4 }}
            animate={still ? undefined : { opacity: 1, scale: 1 }}
            transition={
              still
                ? { duration: 0 }
                : simple
                  ? { duration: 0.34, delay: 0.62 + 0.07 * i, ease: SETTLE }
                  : { duration: 0.42, delay: seat.delay, ease: SETTLE }
            }
            style={{ originX: `${seat.x}px`, originY: '188px' }}
          >
            <circle cx={seat.x} cy="188" r="4" fill="rgb(var(--accent))" />
            <g stroke="rgb(var(--accent))" strokeWidth="1.5" strokeLinecap="round">
              <line x1={seat.x} y1="178" x2={seat.x} y2="174" />
              <line x1={seat.x + 8} y1="182" x2={seat.x + 11} y2="179" />
              <line x1={seat.x - 8} y1="182" x2={seat.x - 11} y2="179" />
            </g>
          </motion.g>
        </g>
      ))}
    </SceneFrame>
  )
}
