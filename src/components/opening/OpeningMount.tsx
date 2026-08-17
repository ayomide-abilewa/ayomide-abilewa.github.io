'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'

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

/**
 * Watchdog. The pre-paint script darkens the page on the promise that <Opening>
 * will take over and then release it. If that chunk never arrives — flaky
 * network, blocked asset — nobody should be left staring at a black rectangle.
 * This lives in the page bundle, not the dynamic chunk, so it survives exactly
 * the failure it exists to cover.
 *
 * 2.2s, comfortably past the 1.5s the sequence itself takes. If the chunk lands
 * after this has fired, <Opening> finds no `data-intro` and returns null: the
 * visitor loses the animation and keeps the page, which is the right way round.
 */
function useIntroWatchdog() {
  useEffect(() => {
    if (document.documentElement.dataset.intro !== 'on') return
    const timer = window.setTimeout(() => {
      document.documentElement.removeAttribute('data-intro')
    }, 2200)
    return () => window.clearTimeout(timer)
  }, [])
}

export function OpeningMount() {
  useIntroWatchdog()
  return <Opening />
}
