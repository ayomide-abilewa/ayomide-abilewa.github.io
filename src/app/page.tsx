import type { Metadata } from 'next'
import { OpeningMount } from '@/components/opening/OpeningMount'
import { LandingHero } from '@/components/landing/LandingHero'
import { Flagships } from '@/components/landing/Flagships'
import { PathChooser } from '@/components/landing/PathChooser'
import { CHANNELS } from '@/components/landing/channels'
import { facts } from '@/lib/facts'

/**
 * Landing page.
 *
 * Order matters: the hero, three flagship projects, then the chooser, so every
 * visitor meets real work before being asked anything. All three are
 * server-rendered, so the text a crawler or a reader needs is in the HTML. The opening sequence is bolted on
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
      <Flagships />
      <PathChooser channels={CHANNELS} projects={facts.projects} />
    </>
  )
}
