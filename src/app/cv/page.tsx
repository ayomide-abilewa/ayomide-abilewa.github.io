import type { Metadata } from 'next'
import { CvLibrary } from '@/components/cv/CvLibrary'

/**
 * CV route.
 *
 * The header already ships a one-click download of the CV matching the active
 * path, so this page is the richer thing: all four versions, what genuinely
 * differs between them, a faithful preview, and both formats for each.
 */

const DESCRIPTION =
  'Four tailored CV versions for Ayomide Abilewa: technical, research, scholarship and full. Each is generated from one data source in ATS-friendly PDF and editable Word format, with the same verified facts in a different section order, selection and length.'

export const metadata: Metadata = {
  title: 'CV — four versions, one source',
  description: DESCRIPTION,
  alternates: { canonical: '/cv/' },
  openGraph: {
    title: 'Ayomide Abilewa — CV',
    description: DESCRIPTION,
    url: '/cv/',
    images: [
      {
        url: '/og/cv.png',
        width: 1200,
        height: 630,
        alt: 'Ayomide Abilewa — four tailored CV versions in PDF and Word',
      },
    ],
  },
  twitter: {
    title: 'Ayomide Abilewa — CV',
    description: DESCRIPTION,
    images: ['/og/cv.png'],
  },
}

export default function CvRoute() {
  return <CvLibrary />
}
