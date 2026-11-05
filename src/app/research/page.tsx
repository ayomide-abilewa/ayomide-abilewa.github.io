import type { Metadata, Viewport } from 'next'
import { socialMetadata } from '@/lib/meta'
import { THEME_COLOR } from '@/lib/theme'
import { ResearchPath } from '@/components/paths/ResearchPath'

/**
 * Research path route.
 *
 * Metadata is written for supervisors and lab leads: the questions and the methods,
 * not the tooling. Kept honest about level — undergraduate work, in progress where
 * it is in progress.
 */

const DESCRIPTION =
  'Undergraduate research by Ayomide Abilewa on detection and measurement under non-ideal conditions: a two-stage cascaded detector fusing RGB and edge-enhanced models, multi-sensor multispectral acquisition, and closed-loop control on Quanser robotics hardware.'

export const viewport: Viewport = { themeColor: THEME_COLOR.research }

export const metadata: Metadata = {
  title: 'Research — measurement and detection under non-ideal conditions',
  description: DESCRIPTION,
  alternates: { canonical: '/research/' },
  ...socialMetadata({ title: 'Ayomide Abilewa — Research', description: DESCRIPTION, path: '/research/', card: 'research' }),
}

export default function ResearchRoute() {
  return <ResearchPath />
}
