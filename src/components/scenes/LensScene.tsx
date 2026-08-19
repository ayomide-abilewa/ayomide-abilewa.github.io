'use client'

import { motion } from 'motion/react'
import { SceneFrame, useSceneTier } from './SceneFrame'

/**
 * RESEARCH SCENE — the specimen under the lens.
 *
 * A researcher looks down a lens at a length of pipe. Two passes sweep across it:
 * the plain RGB pass, which finds the obvious defect and misses the faint one, and
 * the edge-enhanced pass, which catches what the first pass lost. The two boxes
 * then merge into one — which is literally what the fusion step in my pipe
 * anomaly work does.
 *
 * Motion grammar is deliberately different from the engineering scene: no snap, no
 * contact flash. Passes cross-fade at the pace of someone reading, because that is
 * the register of the research path.
 */

const W = 420
const H = 280

export function LensScene() {
  const tier = useSceneTier()
  const still = tier === 'still'
  const simple = tier === 'simple'

  const ease = [0.4, 0, 0.2, 1] as const

  const fade = (delay: number) => ({
    initial: still ? false : ({ opacity: 0 } as const),
    animate: still ? undefined : ({ opacity: 1 } as const),
    transition: still
      ? { duration: 0 }
      : simple
        ? { duration: 0.45, ease }
        : { duration: 0.7, delay, ease },
  })

  /**
   * On the simple tier both detections are simply present. On the full tier the
   * second box arrives after the first, because the point of the scene is that one
   * pass was not enough.
   */
  const box = (delay: number) =>
    still
      ? { initial: false as const, animate: undefined, transition: { duration: 0 } }
      : simple
        ? {
            initial: { opacity: 0 } as const,
            animate: { opacity: 1 } as const,
            transition: { duration: 0.45, ease },
          }
        : {
            initial: { opacity: 0, scale: 0.94 } as const,
            animate: { opacity: 1, scale: 1 } as const,
            transition: { duration: 0.55, delay, ease },
          }

  return (
    <SceneFrame
      viewBox={`0 0 ${W} ${H}`}
      label="A researcher looks through a lens at a section of pipe. Two detection passes sweep across it, one on the plain image and one on the edge-enhanced image, and their results merge into a single box."
      caption={
        <>
          Two passes over the same frame. The plain pass finds the obvious defect; the edge-enhanced
          pass finds the faint one it missed. Fusing them is the method — a single model would have
          had to choose which of the two to be good at.
        </>
      }
    >
      {/* Paper rule, not a graticule. This register is a page, not a screen. */}
      <g stroke="rgb(var(--hairline))" strokeWidth="1" strokeOpacity="0.85">
        <line x1="16" y1="44" x2={W - 16} y2="44" />
        <line x1="16" y1={H - 40} x2={W - 16} y2={H - 40} />
      </g>
      <text
        x="16"
        y="34"
        fill="rgb(var(--content-faint))"
        fontSize="10"
        fontFamily="var(--font-plex-mono), monospace"
        letterSpacing="1.4"
      >
        FIG. 1 — TWO-STAGE CASCADE
      </text>

      {/* --- The specimen: a length of pipe, seen from the side --- */}
      <motion.g {...fade(0)}>
        <rect
          x="150"
          y="118"
          width="250"
          height="64"
          rx="4"
          fill="rgb(var(--surface-raised))"
          stroke="rgb(var(--content-muted))"
          strokeWidth="1.5"
        />
        {/* Weld seams, so it reads as pipe rather than a bar. */}
        <g stroke="rgb(var(--hairline))" strokeWidth="1.2">
          <line x1="150" y1="134" x2="400" y2="134" />
          <line x1="150" y1="166" x2="400" y2="166" />
          <line x1="228" y1="118" x2="228" y2="182" />
          <line x1="320" y1="118" x2="320" y2="182" />
        </g>
        {/* The obvious defect, and the faint one. Different contrast on purpose. */}
        <path
          d="M258 142 C 266 138, 274 150, 282 146 C 288 143, 292 152, 286 156 C 278 161, 262 158, 258 150 Z"
          fill="rgb(var(--content))"
          fillOpacity="0.5"
        />
        <path
          d="M348 158 C 356 154, 366 160, 372 156"
          stroke="rgb(var(--content))"
          strokeOpacity="0.22"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </motion.g>

      {/*
        Pass 1 — the plain image. A sweep line crosses the specimen; on the full
        tier it travels, on the simple tier it does not appear at all, because a
        3-second sweep on a phone is just something in the way.
      */}
      {!still && !simple && (
        <motion.line
          x1="150"
          y1="112"
          x2="150"
          y2="188"
          stroke="rgb(var(--accent))"
          strokeWidth="1.6"
          initial={{ x1: 150, x2: 150, opacity: 0 }}
          animate={{ x1: [150, 400], x2: [150, 400], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.1, delay: 0.35, ease: 'linear' }}
        />
      )}

      {/* Detection from pass 1: catches the obvious defect. */}
      <motion.g {...box(1.2)} style={{ originX: '272px', originY: '148px' }}>
        <rect
          x="250"
          y="132"
          width="44"
          height="32"
          rx="1"
          stroke="rgb(var(--accent))"
          strokeWidth="1.6"
        />
        <text
          x="250"
          y="128"
          fill="rgb(var(--accent))"
          fontSize="9"
          fontFamily="var(--font-plex-mono), monospace"
        >
          rgb
        </text>
      </motion.g>

      {/*
        Pass 2 — edge-enhanced. Dashed, in the annotation colour, so the two passes
        are distinguishable without relying on colour alone.
      */}
      {!still && !simple && (
        <motion.line
          x1="150"
          y1="112"
          x2="150"
          y2="188"
          stroke="rgb(var(--accent-alt))"
          strokeWidth="1.6"
          strokeDasharray="4 4"
          initial={{ x1: 150, x2: 150, opacity: 0 }}
          animate={{ x1: [150, 400], x2: [150, 400], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.1, delay: 1.5, ease: 'linear' }}
        />
      )}

      {/* Detection from pass 2: catches the faint one the first pass lost. */}
      <motion.g {...box(2.4)} style={{ originX: '360px', originY: '158px' }}>
        <rect
          x="340"
          y="146"
          width="42"
          height="26"
          rx="1"
          stroke="rgb(var(--accent-alt))"
          strokeWidth="1.6"
          strokeDasharray="3 3"
        />
        <text
          x="340"
          y="142"
          fill="rgb(var(--accent-alt))"
          fontSize="9"
          fontFamily="var(--font-plex-mono), monospace"
        >
          edge
        </text>
      </motion.g>

      {/* Fusion: one box around both findings. The conclusion of the figure. */}
      <motion.rect
        x="242"
        y="124"
        width="148"
        height="52"
        rx="2"
        stroke="rgb(var(--accent))"
        strokeWidth="1.4"
        strokeOpacity="0.55"
        initial={still ? false : { opacity: 0 }}
        animate={still ? undefined : { opacity: 1 }}
        transition={
          still
            ? { duration: 0 }
            : simple
              ? { duration: 0.45, delay: 0.3, ease }
              : { duration: 0.6, delay: 3, ease }
        }
      />

      {/* --- The researcher, left: head bent to a lens on a stand --- */}
      <motion.g {...fade(0.1)}>
        {/* Stand column and base. */}
        <path
          d="M118 250 H 62 M 90 250 V 172"
          stroke="rgb(var(--content-muted))"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* Lens barrel, tilted toward the specimen. */}
        <g transform="rotate(24 90 150)">
          <rect
            x="80"
            y="112"
            width="20"
            height="52"
            rx="3"
            fill="rgb(var(--surface-raised))"
            stroke="rgb(var(--content-muted))"
            strokeWidth="1.5"
          />
          <ellipse
            cx="90"
            cy="166"
            rx="12"
            ry="4.5"
            fill="rgb(var(--accent-alt))"
            fillOpacity="0.2"
            stroke="rgb(var(--content-muted))"
            strokeWidth="1.3"
          />
        </g>
        {/* Head, bent over the eyepiece. */}
        <path
          d="M46 96 C 46 78, 60 68, 74 70 C 88 72, 94 84, 92 98 C 90 112, 78 120, 64 118 C 52 116, 46 108, 46 96 Z"
          fill="rgb(var(--surface-raised))"
          stroke="rgb(var(--hairline))"
          strokeWidth="1.5"
        />
        {/* Shoulders. */}
        <path
          d="M14 250 C 18 206, 38 186, 68 182 L 86 214 L 20 250 Z"
          fill="rgb(var(--surface-raised))"
          stroke="rgb(var(--hairline))"
          strokeWidth="1.5"
        />
        {/* Eye at the eyepiece, and the pencil hand — a researcher takes notes. */}
        <circle cx="76" cy="98" r="2.4" fill="rgb(var(--content-muted))" />
        <path
          d="M60 196 C 78 194, 96 200, 110 212"
          stroke="rgb(var(--surface-raised))"
          strokeWidth="13"
          strokeLinecap="round"
        />
        <path
          d="M60 196 C 78 194, 96 200, 110 212"
          stroke="rgb(var(--hairline))"
          strokeWidth="1.3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M108 210 L 126 226"
          stroke="rgb(var(--accent-alt))"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </motion.g>

      {/* The written note. Appears once the fused box exists — the finding recorded. */}
      <motion.g
        initial={still ? false : { opacity: 0 }}
        animate={still ? undefined : { opacity: 1 }}
        transition={
          still
            ? { duration: 0 }
            : simple
              ? { duration: 0.45, delay: 0.45, ease }
              : { duration: 0.7, delay: 3.35, ease }
        }
      >
        <g stroke="rgb(var(--content-faint))" strokeWidth="1.4" strokeLinecap="round">
          <line x1="132" y1="234" x2="182" y2="234" />
          <line x1="132" y1="242" x2="168" y2="242" />
        </g>
      </motion.g>
    </SceneFrame>
  )
}
