import { profile } from '@/data/profile'
import { formatRange } from '@/lib/dates'
import { cvFile, latestRole } from '@/lib/select'
import { degree, facts } from '@/lib/facts'
import { Photo } from '@/components/media/Photo'
import { ActionButton } from '@/components/section/Cta'
import { ScopeCanvas } from './ScopeCanvas'
import { LagosClock } from './LagosClock'

/**
 * Landing hero: an oscilloscope face.
 *
 * The copy is server-rendered and readable before any script runs. The trace
 * behind it is one canvas island (ScopeCanvas) that the visitor can probe with
 * the pointer; the HUD around the edges is the scope's readout. Everything
 * printed here is traceable to profile.ts.
 */

const latest = latestRole()

const FACTS = [
  `${degree.degree} ${degree.field} · ${degree.institution} · ${facts.graduation}`,
  ...(latest
    ? [
        `${latest.role.shortRole} · ${latest.role.shortOrganisation} · ${formatRange(latest.role.start, latest.role.end)}`,
      ]
    : []),
]

/** Letters of a word as staggered spans; the h1 carries the readable name. */
function Letters({ word, offset }: { word: string; offset: number }) {
  return (
    <span aria-hidden="true" className="block">
      {word.split('').map((ch, i) => (
        <span
          key={i}
          className="hero-letter inline-block"
          style={{ animationDelay: `${(offset + i) * 38}ms` }}
        >
          {ch}
        </span>
      ))}
    </span>
  )
}

export function LandingHero() {
  const [first = '', ...rest] = profile.identity.name.split(' ')
  const last = rest.join(' ')

  return (
    <section
      className="scope-face relative isolate flex min-h-[100svh] flex-col overflow-hidden"
      aria-labelledby="hero-name"
    >
      <ScopeCanvas />

      {/* Top readout */}
      <div className="shell relative flex items-center justify-between pt-6 font-mono text-micro uppercase tracking-[0.14em] text-content-faint">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="live-dot h-1.5 w-1.5 rounded-full bg-accent" />
          CH1 · 2.00 V/div
        </span>
        <span className="hidden sm:inline">Timebase 5 ms/div · Trig auto</span>
      </div>

      <div className="shell relative grid flex-1 items-center gap-x-16 gap-y-10 pb-32 pt-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:pb-24">
        <div>
          <p className="eyebrow">Instrumentation · Embedded systems · Computer vision</p>

          <h1
            id="hero-name"
            aria-label={profile.identity.name}
            className="hero-name mt-5 font-medium leading-[0.86] tracking-[-0.045em]"
          >
            <Letters word={first} offset={0} />
            <span className="hero-outline block pl-[0.6em]">
              <Letters word={last} offset={first.length} />
            </span>
          </h1>

          <p className="hero-fade mt-8 max-w-[38rem] text-lead leading-snug text-content text-pretty">
            I build systems that measure the physical world, and I design them to keep working when
            conditions are far from ideal.
          </p>

          <ul className="hero-fade mt-6 space-y-1 font-mono text-micro leading-relaxed text-content-faint">
            {FACTS.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>

          <nav aria-label="Start here" className="hero-fade mt-8 flex flex-wrap gap-3">
            <ActionButton action={{ label: 'See the work', href: '#work', weight: 'primary' }} />
            <ActionButton action={{ label: 'Download CV', href: cvFile('general', 'pdf'), download: true }} />
            <ActionButton action={{ label: 'Get in touch', href: '/contact/', weight: 'quiet' }} />
          </nav>
        </div>

        {/* Portrait as a scope inset, desktop only. Lazy, so phones never fetch it. */}
        <figure className="scope-inset hero-fade relative hidden lg:block">
          <div className="relative overflow-hidden">
            <Photo id="portrait" sizes="17rem" rounded={false} className="hero-photo" />
          </div>
          <figcaption className="mt-3 flex justify-between font-mono text-micro uppercase tracking-[0.12em] text-content-faint">
            <span>Ref · Lagos</span>
            <span>2026</span>
          </figcaption>
        </figure>
      </div>

      {/* Bottom readout */}
      <div className="shell relative flex flex-wrap items-end justify-between gap-3 pb-6 font-mono text-micro uppercase tracking-[0.14em] text-content-faint">
        <span className="probe-readout hidden md:inline" aria-hidden="true">
          Probe&nbsp; t = <span id="scope-x" className="text-accent">00.0</span> ms&nbsp; v ={' '}
          <span id="scope-y" className="text-accent">0.00</span> V
        </span>
        <span className="probe-hint hidden md:inline">Move your cursor along the trace. It is live.</span>
        <span className="md:hidden">Tap the trace</span>
        <span>
          Lagos <LagosClock /> WAT
        </span>
      </div>
    </section>
  )
}
