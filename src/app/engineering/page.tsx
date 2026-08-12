import type { Metadata } from 'next'
import { EngineeringPath } from '@/components/paths/EngineeringPath'

/**
 * Engineering path route.
 *
 * The path component is a client component (it declares the active mode and runs
 * scroll reveals), so the route file stays a server component and owns metadata.
 * Description and OG copy are written for this audience specifically — a shared
 * link to /engineering should preview as an engineering page, not as the site index.
 *
 * No `openGraph.images` here on purpose: `opengraph-image.tsx` in this folder
 * supplies it, and an explicit array would override the generated card and point at
 * a file that does not exist.
 */

const DESCRIPTION =
  'Embedded systems, computer vision and instrumentation work by Ayomide Abilewa: ESP32 and STM32 builds, a 214-test offline voice assistant, a cascaded anomaly detector, and 4–20 mA control-loop practice on Chevron Nigeria’s electrical and instrumentation team.'

export const metadata: Metadata = {
  title: 'Engineering — systems built for the conditions that break them',
  description: DESCRIPTION,
  alternates: { canonical: '/engineering/' },
  openGraph: {
    title: 'Ayomide Abilewa — Engineering',
    description: DESCRIPTION,
    url: '/engineering/',
  },
  twitter: {
    title: 'Ayomide Abilewa — Engineering',
    description: DESCRIPTION,
  },
}

export default function EngineeringRoute() {
  return <EngineeringPath />
}
