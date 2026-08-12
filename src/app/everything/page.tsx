import type { Metadata } from 'next'
import { EverythingPath } from '@/components/paths/EverythingPath'

/**
 * Everything path route.
 *
 * This is also the bypass target for anyone who does not want to be asked what
 * brings them here, so its metadata is the closest to the site default — the
 * whole picture, in one pass, in the order it happened.
 */

const DESCRIPTION =
  'Everything in one pass: the engineering, the research questions underneath it, and the teaching that came out of both. Ayomide Abilewa — electrical and electronics engineering at Obafemi Awolowo University, expected 2027.'

export const metadata: Metadata = {
  title: 'Everything — one person, read three different ways',
  description: DESCRIPTION,
  alternates: { canonical: '/everything/' },
  openGraph: {
    title: 'Ayomide Abilewa — Everything',
    description: DESCRIPTION,
    url: '/everything/',
  },
  twitter: {
    title: 'Ayomide Abilewa — Everything',
    description: DESCRIPTION,
  },
}

export default function EverythingRoute() {
  return <EverythingPath />
}
