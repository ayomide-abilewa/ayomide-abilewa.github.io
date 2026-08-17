import type { Metadata } from 'next'
import { AboutStory } from '@/components/about/AboutStory'

/**
 * About route.
 *
 * Not a fifth path — like /work it reads the active lens to decide what to lead
 * with, but never sets it. Metadata is written for a general reader, since this
 * is the URL most likely to be shared without a path attached.
 *
 * The description stays in the third person while the page itself is first
 * person: a search snippet is a label written about the page, not the person
 * talking. Inside the page, "he" would read as a press release.
 */

const DESCRIPTION =
  'The five years behind the work: Obafemi Awolowo University from 2021, teaching electronics from 2023, the ACE Quanser robotics lab in 2024, and Chevron Nigeria’s electrical and instrumentation team from 2025 — and what each of the six builds taught along the way.'

export const metadata: Metadata = {
  title: 'About — the thread through the work',
  description: DESCRIPTION,
  alternates: { canonical: '/about/' },
  /* No `images` key — ./opengraph-image.tsx fills og:image and twitter:image.
     See the note in app/layout.tsx: a hand-written /og/*.png path here overrode
     the generated card with a file that has never existed. */
  openGraph: {
    title: 'About Ayomide Abilewa',
    description: DESCRIPTION,
    url: '/about/',
  },
  twitter: {
    title: 'About Ayomide Abilewa',
    description: DESCRIPTION,
  },
}

export default function AboutRoute() {
  return <AboutStory />
}
