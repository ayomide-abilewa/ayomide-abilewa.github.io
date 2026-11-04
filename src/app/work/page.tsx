import type { Metadata } from 'next'
import { socialMetadata } from '@/lib/meta'
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
  ...socialMetadata({ title: 'Projects — Ayomide Abilewa', description: DESCRIPTION, path: '/work/', card: 'work' }),
}

export default function WorkRoute() {
  return <WorkIndex />
}
