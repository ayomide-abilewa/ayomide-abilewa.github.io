import type { Metadata } from 'next'
import { socialMetadata } from '@/lib/meta'
import { EngineeringPath } from '@/components/paths/EngineeringPath'

/**
 * Engineering path route.
 *
 * The path component is a client component (it declares the active mode and runs
 * scroll reveals), so the route file stays a server component and owns metadata.
 * Description and OG copy are written for this audience specifically — a shared
 * link to /engineering should preview as an engineering page, not as the site index.
 */

const DESCRIPTION =
  'Embedded systems, computer vision and instrumentation work by Ayomide Abilewa: ESP32 and Arduino builds, a convention booth built to survive venue wifi, face-recognition attendance, a cascaded anomaly detector, and 4–20 mA control-loop practice on Chevron Nigeria’s electrical and instrumentation team.'

export const metadata: Metadata = {
  title: 'Engineering — systems built for the conditions that break them',
  description: DESCRIPTION,
  alternates: { canonical: '/engineering/' },
  ...socialMetadata({ title: 'Ayomide Abilewa — Engineering', description: DESCRIPTION, path: '/engineering/', card: 'engineering' }),
}

export default function EngineeringRoute() {
  return <EngineeringPath />
}
