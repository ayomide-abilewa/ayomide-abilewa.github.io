'use client'

import type { CSSProperties } from 'react'
import { profile } from '@/data/profile'
import { SettledTrace } from '@/components/brand/SettledTrace'

/**
 * Landing hero.
 *
 * This is the payoff of the opening: the curtain draws back and this content
 * drops in behind it. The drop is CSS-only, driven by the `data-intro` attribute
 * flip in <Opening> — see globals.css. Staggering happens through
 * `--drop-delay`, so a visitor who never sees the sequence (reduced motion,
 * second visit, low-fidelity tier) gets exactly this markup with no transform
 * and no wait.
 *
 * Copy rule: every claim below is traceable to the CV or a repository. No
 * adjectives standing in for evidence.
 */

const FACTS = [
  'B.Sc. Electrical & Electronics Engineering · Obafemi Awolowo University · expected 2027',
  'Electrical & Instrumentation intern · Chevron Nigeria',
  'Lagos, Nigeria',
]

function scrollToChooser() {
  const target = document.getElementById('choose')
  if (!target) return
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function LandingHero() {
  return (
    <section className="shell relative flex min-h-[86svh] flex-col justify-center pb-14 pt-16 sm:pt-20">
      <div className="max-w-[46rem]">
        <p className="eyebrow" data-drop style={{ '--drop-delay': '120ms' } as CSSProperties}>
          Instrumentation · Embedded systems · Computer vision
        </p>

        <h1
          className="mt-5 text-display font-medium leading-[0.95] tracking-tight"
          data-drop
          style={{ '--drop-delay': '200ms' } as CSSProperties}
        >
          {profile.identity.name}
        </h1>

        {/* The settled trace, doubling as the underline. Same curve as the
            opening sequence resolves into, and as the favicon. */}
        <div
          className="mt-1 h-9 w-full max-w-[34rem] sm:h-11"
          data-drop
          style={{ '--drop-delay': '300ms' } as CSSProperties}
        >
          <SettledTrace className="h-full w-full" delay={0.34} strokeWidth={2} />
        </div>

        <p
          className="mt-7 max-w-measure text-lead leading-snug text-content text-pretty"
          data-drop
          style={{ '--drop-delay': '400ms' } as CSSProperties}
        >
          I build systems that measure the physical world, and I design them for the moment the
          conditions stop cooperating.
        </p>

        <p
          className="mt-5 max-w-measure text-body text-content-muted text-pretty"
          data-drop
          style={{ '--drop-delay': '470ms' } as CSSProperties}
        >
          Uneven lighting. A network link that is not there. A sensor whose reading means nothing
          until it has been calibrated. Most of what I have built has a fallback path in it, because
          most of what I have built had to run somewhere imperfect.
        </p>

        <ul
          className="mt-9 space-y-1.5 border-l border-hairline pl-4"
          data-drop
          style={{ '--drop-delay': '560ms' } as CSSProperties}
        >
          {FACTS.map((fact) => (
            <li key={fact} className="font-mono text-micro leading-relaxed text-content-faint">
              {fact}
            </li>
          ))}
        </ul>
      </div>

      {/* Scroll cue. A sampling dot travelling down a measurement line — the
          same visual language, doing an actual navigational job. */}
      <button
        type="button"
        onClick={scrollToChooser}
        className="group mt-14 flex items-center gap-3 self-start text-left"
        data-drop
        style={{ '--drop-delay': '700ms' } as CSSProperties}
      >
        <span
          aria-hidden="true"
          className="relative block h-10 w-px overflow-hidden bg-hairline"
        >
          <span className="scroll-cue-dot absolute left-[-1.5px] top-0 block h-1.5 w-1 rounded-full bg-accent" />
        </span>
        <span className="font-mono text-micro uppercase tracking-[0.14em] text-content-faint transition-colors group-hover:text-accent">
          What brings you here?
        </span>
      </button>
    </section>
  )
}
