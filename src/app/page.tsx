import type { Metadata } from 'next'
import { OpeningMount } from '@/components/opening/OpeningMount'
import { LandingHero } from '@/components/landing/LandingHero'
import { PathChooser } from '@/components/landing/PathChooser'

/**
 * Landing page.
 *
 * Order matters: the hero and the chooser are server-rendered, so the text a
 * crawler or a reader needs is in the HTML. The opening sequence is bolted on
 * top afterwards from its own chunk, and can be skipped from the first frame.
 */

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default function LandingPage() {
  return (
    <>
      <OpeningMount />
      <LandingHero />
      <PathChooser />
    </>
  )
}
