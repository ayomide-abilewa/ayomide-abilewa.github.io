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
  openGraph: {
    title: 'Contact Ayomide Abilewa',
    description: DESCRIPTION,
    url: '/contact/',
    images: [
      {
        url: '/og/contact.png',
        width: 1200,
        height: 630,
        alt: 'Contact Ayomide Abilewa — email, GitHub and LinkedIn',
      },
    ],
  },
  twitter: {
    title: 'Contact Ayomide Abilewa',
    description: DESCRIPTION,
    images: ['/og/contact.png'],
  },
}

export default function ContactRoute() {
  return <ContactPage />
}
