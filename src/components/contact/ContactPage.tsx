'use client'

import { CV_FOR_MODE, type VisitorMode } from '@/data/types'
import { profile } from '@/data/profile'
import { useMode, MODE_LABELS } from '@/lib/mode'
import { track } from '@/lib/analytics'
import { CV_DESCRIPTIONS, cvFile } from '@/lib/select'
import { Section, TickList } from '@/components/section/Section'
import { CtaRow, type Action } from '@/components/section/Cta'
import { SettledTrace } from '@/components/brand/SettledTrace'
import { Reveal } from '@/components/motion/Reveal'

/**
 * Contact. Calls to action change with visitor intent.
 *
 * First person throughout. A contact page written in the third person about its
 * own owner reads like a press release, and this is the one page where the
 * visitor is about to speak to an actual person.
 *
 * What changes per path: the opening line, the list of things worth writing
 * about, the pre-filled first message, and the order of the buttons. What does
 * not change: the three ways to reach him.
 *
 * No form. A static site has nowhere to POST to, so a form would mean routing
 * someone's message through a third-party service that stores it somewhere
 * neither of us controls. A plain address is faster to use and honest about
 * where the message goes.
 */

type Pitch = {
  eyebrow: string
  heading: string
  lede: string
  /** What he is actually available for, per audience. */
  open: string[]
  /** Pre-filled subject and body, so the first message is not a blank page. */
  subject: string
  body: string
  /** Realistic expectation, stated rather than promised. */
  note: string
}

const PITCH: Record<VisitorMode, Pitch> = {
  engineering: {
    eyebrow: 'Engineering roles, internships and builds',
    heading: 'If you have a system that has to keep working when conditions get worse, that is the conversation I want.',
    lede: 'Embedded work, computer vision, instrumentation. The part I enjoy is the failure modes, not the demo.',
    open: [
      'Engineering internships and placements — embedded systems, instrumentation, computer vision.',
      'Graduate roles from 2027, when I finish at OAU.',
      'Build collaborations, especially hardware that has to survive somewhere hot, dusty or offline.',
      'Technical questions about anything here. The code is public where it exists and the reasoning is in the case studies.',
    ],
    subject: 'Engineering — from your portfolio',
    body: 'Hi Ayomide,\n\nI came across your portfolio. I work on\n\nWhat I have in mind:\n\n',
    note: 'Email is fastest. I am a full-time student on an internship rotation, so a reply usually takes a day or two — if something is time-sensitive, say so in the subject line and call.',
  },
  research: {
    eyebrow: 'Research internships, labs and graduate supervision',
    heading: 'If detection under bad conditions overlaps with what your group works on, one paragraph is enough to start.',
    lede: 'Undergraduate work on measurement and detection when the imaging conditions will not cooperate, on calibration, and on closed-loop control running on real hardware rather than in simulation.',
    open: [
      'Research internships and summer placements in computer vision, instrumentation or control.',
      'Graduate programmes and supervision from 2027 onward.',
      'Collaboration on detection across varied imaging conditions. The pipe anomaly work is unfinished and I have not pretended otherwise anywhere on this site.',
      'Questions about method. The two-stage cascade and the RGB plus edge-enhanced fusion are both written up here in full.',
    ],
    subject: 'Research enquiry — from your portfolio',
    body: 'Hi Ayomide,\n\nI read your research page. My group works on\n\nWhat I am writing about:\n\n',
    note: 'Ask and I will send the current state of the pipe anomaly work, including the parts that have not been evaluated yet. I would rather show you an honest half-finished result than a tidy claim.',
  },
  scholarship: {
    eyebrow: 'Scholarships, fellowships and programmes',
    heading: 'Ask me anything a committee needs — including the things a CV has no room for.',
    lede: 'Electronic and electrical engineering at Obafemi Awolowo University, expected 2027, alongside an internship with Chevron Nigeria’s electrical and instrumentation team and a six-session course I teach to secondary school students.',
    open: [
      'Scholarship and fellowship applications, including anything that needs references, transcripts or verification.',
      'Programmes with a teaching or community component. SPAW is in its third cohort and I rewrite the lesson plans each time based on what went wrong in the last one.',
      'Speaking to students, or running a workshop for a group that has never touched a breadboard.',
      'Questions about funding needs, academic standing or documentation.',
    ],
    subject: 'Scholarship enquiry — from your portfolio',
    body: 'Hi Ayomide,\n\nI am writing about\n\nWhat we would need from you:\n\n',
    note: 'Transcripts, supporting documents and referee details are available on request. Every claim on this site traces back to the CV, a repository, or the internship itself — nothing here is decoration.',
  },
  everything: {
    eyebrow: 'Anything at all',
    heading: 'Email is the front door. There is nothing behind a form.',
    lede: 'Engineering work, research collaboration, scholarship enquiries, teaching, or a question about something you read here. Same address for all of it.',
    open: [
      'Engineering internships and placements now; graduate roles from 2027.',
      'Research collaboration in computer vision, instrumentation and control.',
      'Scholarship and fellowship applications, with documentation on request.',
      'Teaching, workshops, and talking to students.',
    ],
    subject: 'Hello — from your portfolio',
    body: 'Hi Ayomide,\n\nI found your portfolio while\n\nWhat I am writing about:\n\n',
    note: 'One address, read by one person. I am a full-time student on an internship rotation, so give it a day or two.',
  },
}

/** Path-specific ordering of the exits. */
function actionsFor(mode: VisitorMode, mailto: string, onEmail: () => void): Action[] {
  const variant = CV_FOR_MODE[mode]
  const cv: Action = {
    label: `${CV_DESCRIPTIONS[variant].title} (PDF)`,
    href: cvFile(variant, 'pdf'),
    download: true,
  }
  const email: Action = {
    label: 'Write an email',
    href: mailto,
    weight: 'primary',
    hint: profile.identity.email,
    onSelect: onEmail,
  }

  switch (mode) {
    case 'engineering':
      return [email, cv, { label: 'Read the code', href: '/work/' }]
    case 'research':
      return [email, cv, { label: 'Research interests', href: '/research/#interests' }]
    case 'scholarship':
      return [email, cv, { label: 'The journey', href: '/about/#journey' }]
    default:
      return [email, cv, { label: 'All six projects', href: '/work/' }]
  }
}

/** Nigerian mobile numbers dial internationally as +234 with the leading 0 dropped. */
function telHref(local: string): string {
  return `tel:+234${local.replace(/\D/g, '').replace(/^0/, '')}`
}

export function ContactPage() {
  const { mode, unset } = useMode()
  const pitch = PITCH[mode]
  const { identity } = profile

  const mailto = `mailto:${identity.email}?subject=${encodeURIComponent(
    pitch.subject,
  )}&body=${encodeURIComponent(pitch.body)}`

  const onEmail = () => track({ name: 'external_link', target: 'email', mode })

  return (
    <>
      <header className="shell border-b border-hairline pb-section pt-14 sm:pt-20">
        <Reveal>
          <p className="eyebrow flex items-center gap-2.5">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>
              {pitch.eyebrow}
              {unset ? '' : ` — as ${MODE_LABELS[mode]}`}
            </span>
          </p>

          <h1 className="mt-5 max-w-[34ch] text-h1 font-medium tracking-tight text-balance">
            {pitch.heading}
          </h1>

          <div className="mt-2 h-6 w-full max-w-[22rem]">
            <SettledTrace className="h-full w-full" delay={0.1} strokeWidth={1.6} />
          </div>

          <p className="mt-6 max-w-measure text-lead leading-snug text-content text-pretty">
            {pitch.lede}
          </p>

          {/* Both routes in full and selectable, for anyone whose mail client is not wired up. */}
          <div className="mt-8 space-y-2">
            <p>
              <a
                href={mailto}
                onClick={onEmail}
                className="inline-block break-all font-mono text-h4 text-accent underline decoration-hairline underline-offset-[6px] transition-colors hover:decoration-accent"
              >
                {identity.email}
              </a>
            </p>
            <p>
              <a
                href={telHref(identity.phone)}
                onClick={() => track({ name: 'external_link', target: 'phone', mode })}
                className="inline-block font-mono text-body text-content transition-colors hover:text-accent"
              >
                {identity.phone}
              </a>
              <span className="ml-3 text-caption text-content-faint">
                Lagos time, GMT+1
              </span>
            </p>
          </div>
          <p className="mt-2 text-caption text-content-faint">{identity.location}</p>

          <CtaRow
            className="mt-9"
            label="How to get in touch"
            actions={actionsFor(mode, mailto, onEmail)}
          />
        </Reveal>
      </header>

      <Section
        id="open"
        eyebrow="Currently open to"
        heading="What is worth writing about"
        lede="Listed so nobody has to guess whether their message belongs here."
      >
        <TickList items={pitch.open} className="max-w-measure" />

        <p className="mt-9 max-w-measure border-l-2 border-accent pl-4 text-body text-content-muted text-pretty">
          {pitch.note}
        </p>
      </Section>

      <Section
        id="elsewhere"
        eyebrow="Every route"
        heading="Four ways in, all of them a person"
        lede="No form, no newsletter, no chat widget."
      >
        <ul className="border-t border-hairline">
          {[
            {
              key: 'email' as const,
              label: 'Email',
              value: identity.email,
              href: mailto,
              external: false,
              detail: 'Read directly. Best for anything with detail in it.',
            },
            {
              key: 'phone' as const,
              label: 'Phone',
              value: identity.phone,
              href: telHref(identity.phone),
              external: false,
              detail: 'Lagos, GMT+1. Fine for anything urgent; a text lands better during work hours.',
            },
            {
              key: 'github' as const,
              label: 'GitHub',
              value: identity.links.github.cvText ?? identity.links.github.href,
              href: identity.links.github.href,
              external: true,
              detail: 'Source for the projects that have any. The hardware builds do not, and I have said so on each one.',
            },
            {
              key: 'linkedin' as const,
              label: 'LinkedIn',
              value: identity.links.linkedin.cvText ?? identity.links.linkedin.href,
              href: identity.links.linkedin.href,
              external: true,
              detail: 'The same history in the shape recruiters expect to find it in.',
            },
          ].map((row) => (
            <li key={row.key} className="border-b border-hairline">
              <a
                href={row.href}
                onClick={() => track({ name: 'external_link', target: row.key, mode })}
                {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group grid gap-x-8 gap-y-1.5 py-6 lg:grid-cols-[7.5rem_minmax(0,18rem)_minmax(0,1fr)]"
              >
                <span className="eyebrow lg:pt-1">{row.label}</span>
                <span className="min-w-0 break-all font-mono text-caption text-content transition-colors group-hover:text-accent">
                  {row.value}
                  {row.external && <span className="sr-only"> (opens in a new tab)</span>}
                </span>
                <span className="max-w-measure text-caption text-content-muted text-pretty">
                  {row.detail}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="next"
        eyebrow="Before you write"
        heading="Or read the thing you were going to ask about"
        lede="Most questions are already answered in a case study, and the CV covers the summary in whichever version suits you."
      >
        <CtaRow
          label="Next steps"
          actions={[
            { label: 'All six projects', href: '/work/', weight: 'primary' },
            { label: 'All four CV versions', href: '/cv/' },
            { label: 'The story behind it', href: '/about/' },
          ]}
        />
      </Section>
    </>
  )
}
