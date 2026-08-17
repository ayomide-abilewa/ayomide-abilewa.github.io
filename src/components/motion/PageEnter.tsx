'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

/**
 * The page arrives.
 *
 * Keying a wrapper on the pathname is the whole mechanism: React tears down the
 * old subtree and mounts a new one, the CSS animation on `.page-enter` starts from
 * the beginning, and the content rises 14px into place while <RouteSweep /> runs
 * along the top edge. Two signals, one gesture, 520ms, nothing covered.
 *
 * Why not `motion`: this needs to run on the first frame of a new route for every
 * page on the site, including the ones that are otherwise entirely static and ship
 * no client JavaScript of their own. A keyframe on a class costs one composited
 * layer for half a second and cannot arrive late; a motion component would have to
 * hydrate before it could animate, which on the slowest connection is exactly when
 * the transition would be most conspicuous by its absence.
 *
 * Reduced motion needs no branch here. The blanket rule in globals.css clamps the
 * duration, and because the keyframe is `fill-mode: both` the clamped animation
 * settles on its end state — opacity 1, no transform — which is the correct
 * resolved appearance rather than a hidden page.
 */
export function PageEnter({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  )
}
