import type { Metadata, Viewport } from 'next'
import { socialMetadata } from '@/lib/meta'
import { THEME_COLOR } from '@/lib/theme'
import { facts } from '@/lib/facts'
import { ScholarshipPath } from '@/components/paths/ScholarshipPath'

/**
 * Scholarship path route.
 *
 * A committee reads the sequence and the teaching before the technology, so the
 * description leads with those. Wording stays supportable: dates, roles and what
 * they involved.
 */

const DESCRIPTION =
  `Ayomide Abilewa — electrical and electronics engineering at Obafemi Awolowo University, ${facts.graduation}. Interned on Chevron Nigeria’s electrical and instrumentation team. Leads a six-session embedded systems curriculum for secondary school students and instructs a practical electronics workshop for absolute beginners.`

export const viewport: Viewport = { themeColor: THEME_COLOR.scholarship }

export const metadata: Metadata = {
  title: 'Scholarship — journey, teaching and what the work is for',
  description: DESCRIPTION,
  alternates: { canonical: '/scholarship/' },
  ...socialMetadata({ title: 'Ayomide Abilewa — Scholarship & Fellowship', description: DESCRIPTION, path: '/scholarship/', card: 'scholarship' }),
}

export default function ScholarshipRoute() {
  return <ScholarshipPath />
}
