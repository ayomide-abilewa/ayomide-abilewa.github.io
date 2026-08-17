import type { Metadata } from 'next'
import { ContactPage } from '@/components/contact/ContactPage'

/**
 * Contact route.
 *
 * Deliberately no form. A static export has nowhere to POST to, so a form would
 * mean routing someone's message through a third party — and the alternative,
 * a plain email address, is faster for the sender anyway.
 */

const DESCRIPTION =
  'Get in touch with Ayomide Abilewa — electronic and electrical engineering student at Obafemi Awolowo University, working on embedded systems, computer vision and instrumentation. Email, GitHub and LinkedIn.'

export const metadata: Metadata = {
  title: 'Contact — email, GitHub, LinkedIn',
  description: DESCRIPTION,
  alternates: { canonical: '/contact/' },
  /* No `images` key — ./opengraph-image.tsx fills og:image and twitter:image.
     See the note in app/layout.tsx: a hand-written /og/*.png path here overrode
     the generated card with a file that has never existed. */
  openGraph: {
    title: 'Contact Ayomide Abilewa',
    description: DESCRIPTION,
    url: '/contact/',
  },
  twitter: {
    title: 'Contact Ayomide Abilewa',
    description: DESCRIPTION,
  },
}

export default function ContactRoute() {
  return <ContactPage />
}
