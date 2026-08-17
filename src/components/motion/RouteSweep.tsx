'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useMode } from '@/lib/mode'
import { usePrefersReducedMotion } from '@/lib/motion'

/**
 * Route change signal.
 *
 * A 2px sweep along the top edge of the viewport, in the current mode's accent —
 * the same "a reading came in" vocabulary as the opening, at the scale of a
 * status light rather than an event.
 *
 * It replaces a full-screen card that ran for 1.45s on every single navigation,
 * announcing the name of the page you had just clicked through to and covering
 * the content that had already finished rendering behind it. Three problems with
 * that, all of which this fixes:
 *
 *   - It was the slowest part of the site, and it was pure overhead. Nothing was
 *     loading; the export is static and the page was ready.
 *   - It duplicated the h1 you were about to read.
 *   - It stood between the visitor and the content, and a second click during
 *     the wipe hit an overlay.
 *
 * Same job — confirming the click landed — at 520ms, over nothing, and
 * pointer-transparent. The App Router's own route announcer already handles the
 * screen-reader side, so this stays decorative.
 */
export function RouteSweep() {
  const pathname = usePathname()
  const reduced = usePrefersReducedMotion()
  const { lofi } = useMode()
  const first = useRef(true)
  const [run, setRun] = useState(0)

  useEffect(() => {
    // Landing on a page is not a transition; only leaving one is.
    if (first.current) {
      first.current = false
      return
    }
    if (reduced || lofi) return
    setRun((n) => n + 1)
  }, [pathname, reduced, lofi])

  if (run === 0) return null

  // The key restarts the CSS animation when a navigation lands mid-sweep.
  return <div key={run} className="route-sweep" aria-hidden="true" />
}
