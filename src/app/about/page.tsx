import type { Metadata } from 'next'
import { socialMetadata } from '@/lib/meta'
import { facts, startYear } from '@/lib/facts'
import { AboutStory } from '@/components/about/AboutStory'

/**
 * About route.
 *
 * Not a fifth path — like /work it reads the active lens to decide what to lead
 * with, but never sets it. Metadata is written for a general reader, since this
 * is the URL most likely to be shared without a path attached.
 *
 * The description stays in the third person while the page itself is first
 * person: a search snippet is a label written about the page, not me talking.
 */

const DESCRIPTION =
  `The ${facts.yearsAtUniversity} years behind the work: Obafemi Awolowo University from ${facts.universityStart}, teaching electronics from ${facts.teachingSince}, the ACE Quanser robotics lab in ${startYear('quanser')}, and Chevron Nigeria’s electrical and instrumentation team in ${startYear('chevron')} — and what each of the ${facts.projects} builds taught along the way.`

export const metadata: Metadata = {
  title: 'About — the thread through the work',
  description: DESCRIPTION,
  alternates: { canonical: '/about/' },
  ...socialMetadata({ title: 'About Ayomide Abilewa', description: DESCRIPTION, path: '/about/', card: 'about' }),
}

export default function AboutRoute() {
  return <AboutStory />
}
