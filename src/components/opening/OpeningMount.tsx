'use client'

import dynamic from 'next/dynamic'

/**
 * Mounts the opening sequence as its own chunk.
 *
 * The opening sequence is the only part of the landing page that costs real
 * JavaScript, and it is worthless to a visitor who has already seen it this
 * session or who asked for reduced motion. Splitting it out means the hero, the
 * path chooser and all of their text ship and render without waiting for it.
 *
 * `ssr: false` is correct here rather than lazy: there is nothing to
 * server-render — <Opening> returns null until it has read the browser's
 * pre-paint decision.
 */
const Opening = dynamic(() => import('./Opening').then((m) => m.Opening), {
  ssr: false,
})

export function OpeningMount() {
  return <Opening />
}
