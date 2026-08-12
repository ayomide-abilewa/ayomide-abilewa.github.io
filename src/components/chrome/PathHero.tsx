'use client'

import type { ReactNode } from 'react'
import type { VisitorMode } from '@/data/types'
import { MODE_LABELS } from '@/lib/mode'
import { CtaRow, type Action } from '@/components/section/Cta'
import { SettledTrace } from '@/components/brand/SettledTrace'
import { Reveal } from '@/components/motion/Reveal'

/**
 * The header block at the top of each path route.
 *
 * It states plainly which lens the visitor is looking through, so the
 * reorganisation is never mysterious. Same component in all four
 * paths — the register comes from the theme and the copy, not from four layouts.
 */

export function PathHero({
  mode,
  eyebrow,
  heading,
  lede,
  detail,
  actions,
  children,
}: {
  mode: VisitorMode
  eyebrow: string
  heading: string
  lede: string
  /** Second paragraph. Optional, because not every path needs one. */
  detail?: string
  actions: Action[]
  /** Path-specific visual, rendered beside the copy on wide screens. */
  children?: ReactNode
}) {
  return (
    <header className="shell border-b border-hairline pb-section pt-14 sm:pt-20">
      <div
        className={
          children
            ? 'grid items-start gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]'
            : ''
        }
      >
        <Reveal>
          <p className="eyebrow flex items-center gap-2.5">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>
              Viewing as {MODE_LABELS[mode]} — {eyebrow}
            </span>
          </p>

          <h1 className="mt-5 max-w-[38ch] text-h1 font-medium tracking-tight text-balance">
            {heading}
          </h1>

          <div className="mt-2 h-6 w-full max-w-[22rem]">
            <SettledTrace className="h-full w-full" delay={0.1} strokeWidth={1.6} />
          </div>

          <p className="mt-6 max-w-measure text-lead leading-snug text-content text-pretty">
            {lede}
          </p>

          {detail && (
            <p className="mt-4 max-w-measure text-body text-content-muted text-pretty">{detail}</p>
          )}

          <CtaRow actions={actions} className="mt-9" label="Where to go from here" />
        </Reveal>

        {children && <Reveal delay={0.12}>{children}</Reveal>}
      </div>
    </header>
  )
}
