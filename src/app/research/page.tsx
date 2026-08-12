import type { Metadata } from 'next'
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

export const metadata: Metadata = {
  title: 'Research — measurement and detection under non-ideal conditions',
  description: DESCRIPTION,
  alternates: { canonical: '/research/' },
  openGraph: {
    title: 'Ayomide Abilewa — Research',
    description: DESCRIPTION,
    url: '/research/',
  },
  twitter: {
    title: 'Ayomide Abilewa — Research',
    description: DESCRIPTION,
  },
}

export default function ResearchRoute() {
  return <ResearchPath />
}
