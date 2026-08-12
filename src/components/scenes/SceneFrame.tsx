'use client'

import type { ReactNode } from 'react'
import { useMode } from '@/lib/mode'
import { usePrefersReducedMotion, useIsTouch } from '@/lib/motion'

/**
 * Shared shell for the three path scenes.
 *
 * Each path gets its own scene rather than one scene recoloured — the engineering
 * page opens on a bench, the research page on a specimen under a lens, the
 * scholarship page on a board with people in front of it. Same reason the CVs are
 * four documents: the audience is different, so the picture should be too.
 *
 * Three tiers, decided here so the scenes themselves stay declarative:
 *   full    — the staged sequence
 *   simple  — touch devices: the scene arrives assembled, one soft fade, no
 *             multi-second choreography. Not a shrunk desktop animation; a
 *             different, shorter one, because a thumb scrolls faster than a
 *             mouse wheel and nobody waits 2s for an illustration on a phone.
 *   still   — prefers-reduced-motion and the lofi tier: the resolved frame.
 *
 * Every scene is a labelled <figure> with a caption, so it carries meaning for
 * someone who never sees it move — or never sees it at all.
 */

export type SceneTier = 'full' | 'simple' | 'still'

export function useSceneTier(): SceneTier {
  const reduced = usePrefersReducedMotion()
  const touch = useIsTouch()
  const { lofi } = useMode()
  if (reduced || lofi) return 'still'
  if (touch) return 'simple'
  return 'full'
}

export function SceneFrame({
  label,
  caption,
  viewBox,
  children,
  className = '',
}: {
  /** What the illustration shows, for screen readers. */
  label: string
  /** Visible caption. Carries the meaning when the picture cannot. */
  caption: ReactNode
  viewBox: string
  children: ReactNode
  className?: string
}) {
  return (
    <figure className={`min-w-0 ${className}`}>
      <div className="overflow-hidden rounded-panel border border-hairline bg-surface-sunken/40">
        <svg
          viewBox={viewBox}
          role="img"
          aria-label={label}
          className="block h-auto w-full"
          fill="none"
        >
          {children}
        </svg>
      </div>
      <figcaption className="mt-3 text-caption leading-relaxed text-content-muted text-pretty">
        {caption}
      </figcaption>
    </figure>
  )
}
