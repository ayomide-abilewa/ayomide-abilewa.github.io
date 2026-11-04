import type { Metadata } from 'next'
import { socialMetadata } from '@/lib/meta'
import { CvLibrary } from '@/components/cv/CvLibrary'

/**
 * CV route.
 *
 * The header already ships a one-click download of the CV matching the active
 * path, so this page is the richer thing: all four versions, what genuinely
 * differs between them, a faithful preview, and both formats for each.
 */

const DESCRIPTION =
  'Four CV versions for Ayomide Abilewa: technical, research, scholarship and full. Same facts in each, ordered and cut for who is reading. ATS-friendly PDF and editable Word.'

export const metadata: Metadata = {
  title: 'CV — four versions',
  description: DESCRIPTION,
  alternates: { canonical: '/cv/' },
  ...socialMetadata({ title: 'Ayomide Abilewa — CV', description: DESCRIPTION, path: '/cv/', card: 'cv' }),
}

export default function CvRoute() {
  return <CvLibrary />
}
