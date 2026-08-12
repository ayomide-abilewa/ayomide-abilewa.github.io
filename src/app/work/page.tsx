import type { Metadata } from 'next'
import { WorkIndex } from '@/components/work/WorkIndex'

/**
 * Project index route.
 *
 * Not a fifth path — it reads the active lens to order itself but never sets it,
 * so arriving here from /research and going back leaves the visitor where they were.
 */

const DESCRIPTION =
  'Six engineering projects by Ayomide Abilewa, each written up as a case study: problem, approach, architecture, engineering decisions and results. Embedded systems, computer vision, instrumentation and control.'

export const metadata: Metadata = {
  title: 'Projects',
  description: DESCRIPTION,
  alternates: { canonical: '/work/' },
  openGraph: {
    title: 'Projects — Ayomide Abilewa',
    description: DESCRIPTION,
    url: '/work/',
  },
  twitter: {
    title: 'Projects — Ayomide Abilewa',
    description: DESCRIPTION,
  },
}

export default function WorkRoute() {
  return <WorkIndex />
}
