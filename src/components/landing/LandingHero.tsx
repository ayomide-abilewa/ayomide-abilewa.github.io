import { profile } from '@/data/profile'
import { formatRange } from '@/lib/dates'
import { latestRole } from '@/lib/select'
import { degree, facts } from '@/lib/facts'
import { SettledTrace } from '@/components/brand/SettledTrace'

/**
 * Landing hero.
 *
 * A server component: there is no state and no handler left in here, so none of
 * this text costs the visitor any JavaScript. Only the underline is a client
 * component, and only because it draws itself.
 *
 * Visible from the first paint. The opening sequence plays behind this copy and
 * never holds it back.
 *
 * The underline below the name is the same curve the opening settles into, drawn
 * from the same function. That is the entire handoff: no shared element, no
 * layout animation, just the same shape arriving where it belongs.
 *
 * Copy rule: every claim below is traceable to the CV or a repository. No
 * adjectives standing in for evidence.
 */

const latest = latestRole()

const FACTS = [
  `${degree.degree} ${degree.field} · ${degree.institution} · ${facts.graduation}`,
  ...(latest
    ? [
        `${latest.role.shortRole} · ${latest.role.shortOrganisation} · ${formatRange(latest.role.start, latest.role.end)}`,
      ]
    : []),
  'Lagos, Nigeria',
]

export function LandingHero() {
  return (
    <section className="shell relative flex min-h-[86svh] flex-col justify-center pb-14 pt-16 sm:pt-20">
      <div className="max-w-[46rem]">
        <p className="eyebrow">
          Instrumentation · Embedded systems · Computer vision
        </p>

        <h1
          className="mt-5 text-display font-medium leading-[0.95] tracking-tight"
        >
          {profile.identity.name}
        </h1>

        {/* The settled trace, doubling as the underline: the same curve the opening
            settles into. `afterIntro` holds the draw until the sweep finishes. */}
        <div
          className="mt-1 h-9 w-full max-w-[34rem] sm:h-11"
        >
          <SettledTrace className="h-full w-full" delay={0.34} strokeWidth={2} afterIntro />
        </div>

        <p
          className="mt-7 max-w-measure text-lead leading-snug text-content text-pretty"
        >
          I build systems that measure the physical world, and I design them for the moment the
          conditions stop cooperating.
        </p>

        <p
          className="mt-5 max-w-measure text-body text-content-muted text-pretty"
        >
          Uneven lighting. A network link that is not there. A sensor whose reading means nothing
          until it has been calibrated. Most of what I have built has a fallback path in it, because
          most of what I have built had to run somewhere imperfect.
        </p>

        <ul
          className="mt-9 space-y-1.5 border-l border-hairline pl-4"
        >
          {FACTS.map((fact) => (
            <li key={fact} className="font-mono text-micro leading-relaxed text-content-faint">
              {fact}
            </li>
          ))}
        </ul>
      </div>

      {/* Scroll cue. A sampling dot travelling down a measurement line — the
          same visual language, doing an actual navigational job.

          An anchor rather than a button with scrollIntoView: the smooth scroll is
          already CSS on <html>, which means it is switched off automatically under
          prefers-reduced-motion. The JS version overrode that and animated the
          scroll anyway — one of those bugs that only ever bites the people the
          setting exists for. It also now works with no JavaScript at all. */}
      <a
        href="#choose"
        className="group mt-14 flex min-h-11 items-center gap-3 self-start text-left"
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
      </a>
    </section>
  )
}
