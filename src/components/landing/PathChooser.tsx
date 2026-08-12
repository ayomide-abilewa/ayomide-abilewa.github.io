'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { useMode } from '@/lib/mode'
import { usePrefersReducedMotion } from '@/lib/motion'
import { track } from '@/lib/analytics'
import type { VisitorMode } from '@/data/types'

/**
 * Path selection.
 *
 * The four options are the four channels the opening signal splits into. The
 * left rail draws that split literally — one line in, four out — so the metaphor
 * is visible without being written down anywhere. Labels stay plain: a
 * scholarship reviewer should not have to decode a metaphor to find their door.
 */

type Channel = {
  mode: VisitorMode
  href: string
  label: string
  audience: string
  promise: string
}

const CHANNELS: Channel[] = [
  {
    mode: 'engineering',
    href: '/engineering/',
    label: 'Engineering',
    audience: 'Recruiters · engineers · collaborators',
    promise: 'What I have built, how it is put together, and the decisions I would defend.',
  },
  {
    mode: 'research',
    href: '/research/',
    label: 'Research',
    audience: 'Labs · professors · graduate programmes',
    promise: 'What I am investigating, the methods behind it, and the coursework underneath.',
  },
  {
    mode: 'scholarship',
    href: '/scholarship/',
    label: 'Scholarship',
    audience: 'Committees · fellowships · sponsors',
    promise: 'How I got here, what I teach, and who it is for.',
  },
  {
    mode: 'everything',
    href: '/everything/',
    label: 'Everything',
    audience: 'No particular agenda',
    promise: 'All of it, in the order it actually happened.',
  },
]

/** One line in, four out. Stretched vertically to match the card grid. */
function ChannelRail({ active }: { active: number | null }) {
  const targets = [50, 150, 250, 350]
  return (
    <svg
      viewBox="0 0 72 400"
      preserveAspectRatio="none"
      className="hidden h-full w-16 shrink-0 lg:block"
      fill="none"
      aria-hidden="true"
      data-decorative="true"
    >
      {/* Incoming signal */}
      <path d="M0 200 H26" stroke="rgb(var(--accent))" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      {targets.map((y, i) => (
        <path
          key={y}
          d={`M26 200 C 48 200, 50 ${y}, 72 ${y}`}
          stroke={active === i ? 'rgb(var(--accent))' : 'rgb(var(--hairline))'}
          strokeWidth={active === i ? 1.6 : 1.2}
          vectorEffect="non-scaling-stroke"
          className="transition-[stroke] duration-200"
        />
      ))}
      <circle cx="26" cy="200" r="2.5" fill="rgb(var(--accent))" />
    </svg>
  )
}

export function PathChooser() {
  const { setMode } = useMode()
  const router = useRouter()
  const reduced = usePrefersReducedMotion()
  const [hovered, setHovered] = useState<number | null>(null)

  function choose(channel: Channel) {
    setMode(channel.mode, 'selection')
    track({ name: 'path_selected', mode: channel.mode, source: 'selection' })
    router.push(channel.href)
  }

  return (
    <section className="shell pb-section" id="choose" aria-labelledby="choose-heading">
      <div className="mb-9 max-w-measure">
        <p className="eyebrow mb-3">Four channels, one signal</p>
        <h2 id="choose-heading" className="text-h2 font-medium tracking-tight text-balance">
          What brings you here?
        </h2>
        <p className="mt-3 text-body text-content-muted text-pretty">
          The work is the same either way. What changes is the order, the emphasis, and which CV you
          get handed. You can switch at any point, and nothing is hidden behind the choice.
        </p>
      </div>

      <div className="flex items-stretch gap-0">
        <ChannelRail active={hovered} />

        <ul className="grid flex-1 grid-rows-4 border-t border-hairline">
          {CHANNELS.map((channel, i) => (
            <li key={channel.mode} className="border-b border-hairline">
              <motion.button
                type="button"
                onClick={() => choose(channel)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                whileHover={reduced ? undefined : { x: 6 }}
                transition={{ duration: 0.22, ease: [0.2, 0.9, 0.1, 1] }}
                className="group flex w-full items-baseline gap-x-5 gap-y-1 px-1 py-5 text-left sm:px-4"
              >
                <span className="w-7 shrink-0 font-mono text-micro text-content-faint">
                  0{i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                    <span className="text-h3 font-medium tracking-tight text-content transition-colors group-hover:text-accent">
                      {channel.label}
                    </span>
                    <span className="font-mono text-micro uppercase tracking-[0.1em] text-content-faint">
                      {channel.audience}
                    </span>
                  </span>
                  <span className="mt-1.5 block max-w-[54ch] text-caption leading-relaxed text-content-muted">
                    {channel.promise}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="shrink-0 self-center text-content-faint transition-[color,transform] duration-200 group-hover:translate-x-1 group-hover:text-accent"
                >
                  →
                </span>
              </motion.button>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-7 text-caption text-content-faint">
        Rather not choose?{' '}
        <Link
          href="/everything/"
          onClick={() => setMode('everything', 'selection')}
          className="text-content-muted underline decoration-hairline underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
        >
          Go straight to everything
        </Link>
        .
      </p>
    </section>
  )
}
