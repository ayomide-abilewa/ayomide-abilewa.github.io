'use client'

import Link from 'next/link'
import { useMemo, type ReactNode } from 'react'
import { profile } from '@/data/profile'
import { CV_FOR_MODE, type Project, type VisitorMode } from '@/data/types'
import { useMode, MODE_LABELS } from '@/lib/mode'
import { track } from '@/lib/analytics'
import {
  certificationsForVariant,
  cvFile,
  experienceForMode,
  indexOrderForMode,
  leadershipForMode,
} from '@/lib/select'
import { Section } from '@/components/section/Section'
import { CtaRow } from '@/components/section/Cta'
import { SettledTrace, TraceDivider } from '@/components/brand/SettledTrace'
import { Reveal } from '@/components/motion/Reveal'
import { PhotoFigure } from '@/components/media/Photo'
import {
  CertificationList,
  EducationList,
  ExperienceList,
  LeadershipList,
  Timeline,
} from '@/components/section/Blocks'

/**
 * The story behind the work.
 *
 * Not a fifth path: it reads the active lens to decide what to lead with, but it
 * never sets it. Two things adapt — the closing paragraph of the narrative, and
 * the order the sections appear in. The narrative itself, the timeline, the
 * experience and the teaching are the same on every reading, because they are
 * the same five years.
 *
 * The lessons section is generated from each project's `learned` field rather
 * than written here, so a claim about how he works can only exist if a project
 * already backs it.
 *
 * Voice: first person throughout. It is his own story on his own site — third
 * person about yourself reads like a press release, and the one thing this page
 * cannot afford to sound like is generated text.
 */

type Block = 'thread' | 'journey' | 'lessons' | 'experience' | 'teaching' | 'education'

/**
 * What each audience should meet first. A recruiter wants the working method
 * before the biography; a committee wants the sequence of the last five years;
 * a lab wants the academic footing. Same blocks, re-sequenced.
 */
const ORDER: Record<VisitorMode, Block[]> = {
  engineering: ['thread', 'lessons', 'experience', 'journey', 'education', 'teaching'],
  research: ['thread', 'education', 'lessons', 'experience', 'journey', 'teaching'],
  scholarship: ['thread', 'journey', 'teaching', 'experience', 'education', 'lessons'],
  everything: ['thread', 'journey', 'experience', 'teaching', 'lessons', 'education'],
}

const INTRO: Record<VisitorMode, { heading: string; lede: string }> = {
  engineering: {
    heading:
      'Every project I have built starts with the same question: what is going to go wrong with this in the field?',
    lede: 'Six builds between 2023 and now, every one of them measuring something physical. This is the order they happened in, and what each one handed to the next.',
  },
  research: {
    heading:
      'My interest is narrow and it has not really changed: what happens to a measurement once conditions stop cooperating.',
    lede: 'Electronic and electrical engineering at Obafemi Awolowo University, expected 2027. The question got specific with the pipe work: a wet surface reflects nothing like a dry one, and colour alone cannot recover what is lost.',
  },
  scholarship: {
    heading:
      'I started teaching electronics in 2023, the same year I built my first working system. Neither one has stopped since.',
    lede: 'University from 2021. Teaching and a first build in 2023. A robotics lab in 2024. An oil and gas rotation in 2026. A curriculum for secondary school students running underneath all of it.',
  },
  everything: {
    heading:
      'One person, five years, and a habit of turning whatever I have just learned into something someone else can use.',
    lede: 'Electronic and electrical engineering at Obafemi Awolowo University, expected 2027. Embedded systems, instrumentation and computer vision, currently interning on Chevron Nigeria’s electrical and instrumentation team. Teaching the same material to students who have never seen a circuit before.',
  },
}

/**
 * The audience-specific close to the narrative. The two paragraphs above it are
 * identical everywhere; this one says why the thread matters to whoever is
 * reading, without adding a fact that the rest of the site does not carry.
 */
const THREAD_CLOSE: Record<VisitorMode, string> = {
  engineering:
    'The clearest example is aniwe. A blocked venue network, a hall too loud for voice detection and a five-minute setup window each produced a specific piece of the architecture. Open its decisions section and every row names the failure it was built against.',
  research:
    'The question came out of the builds, one at a time. Detection precision holds under one imaging condition and collapses under another, and the interesting work is in that gap. The pipe anomaly detector is my current attempt at it: two models given genuinely different views of the same frame, then reconciled.',
  scholarship:
    'One pattern is worth a committee’s attention: access turns into curriculum. A robotics lab became an orientation presentation on the Quanser Aero 2. A term of circuit work became Circuit Zero to Hero, for students with no background at all. Six sessions of embedded systems and entrepreneurship became SPAW, now in its third cohort, and I rewrite the lesson plans each time from whatever went wrong in the last one.',
  everything:
    'The two halves feed each other. Designing a system against the specific ways it can fail turns out to be the clearest way to explain it to someone who is learning, and having to teach something is what exposes the parts I only thought I understood.',
}

function AtAGlance() {
  const chevron = profile.experience.find((e) => e.id === 'chevron')
  const degree = profile.education.find((e) => e.shortName === 'OAU')

  const rows: { label: string; value: ReactNode }[] = [
    { label: 'Based in', value: profile.identity.location },
    ...(chevron
      ? [
          {
            label: 'Currently',
            value: `${chevron.role.replace(' (SIWES)', '')}, ${chevron.organisation}`,
          },
        ]
      : []),
    ...(degree
      ? [
          {
            label: 'Studying',
            value: `${degree.degree} ${degree.field}, ${degree.institution} — expected ${degree.end}`,
          },
        ]
      : []),
    { label: 'Teaching', value: 'SPAW 3.0 (IEEE OAU), Circuit Zero to Hero, Astar Tutorials' },
  ]

  return (
    <dl className="border-t border-hairline">
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid gap-x-4 gap-y-0.5 border-b border-hairline py-3 sm:grid-cols-[6.5rem_1fr]"
        >
          <dt className="eyebrow pt-px">{row.label}</dt>
          <dd className="text-caption text-content text-pretty">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function AboutStory() {
  const { mode, unset } = useMode()
  const variant = CV_FOR_MODE[mode]
  const intro = INTRO[mode]

  /** Ordered by the active lens, same rule /work and the case studies use. */
  const lessons = useMemo<{ project: Project; lesson: string }[]>(() => {
    const { ranked, rest } = indexOrderForMode(mode)
    const rows: { project: Project; lesson: string }[] = []
    for (const project of [...ranked, ...rest]) {
      const lesson = project.learned[0]
      if (lesson) rows.push({ project, lesson })
    }
    return rows
  }, [mode])

  const blocks: Record<Block, ReactNode> = {
    thread: (
      <Section
        key="thread"
        id="thread"
        eyebrow="The thread"
        heading="It started with an alarm nobody could hear"
        lede="Six builds, three years, and one lesson that keeps arriving in a new disguise: a measurement is not finished until it reaches somebody who can act on it."
      >
        <div className="max-w-measure space-y-5 text-body-lg text-content-muted text-pretty">
          <p>
            The first thing I built, in 2023, was a fire alarm that detected flame and smoke and rang
            a buzzer. The lesson it taught me had nothing to do with sensors: a local alarm only helps
            somebody who is already in earshot, so the build was not finished until a GSM module could
            get the alert out of the building. Detection and notification turned out to be two
            different problems wearing one name.
          </p>
          <p>
            Everything since has had that shape. A fan that matches its speed to the temperature
            instead of switching on and off. Two sensors on one bus, calibrated, because light
            intensity and light colour are separate quantities and a grower needs them separately.
            Face recognition tested against real lecture-hall lighting rather than clean portraits. A
            detector that gives two models different views of the same frame, because wet and coated
            pipe surfaces lose information that colour alone cannot recover. A convention booth whose
            text-to-speech falls through three tiers so that the last one cannot fail.
          </p>
          <p>
            In 2026 this stopped being coursework. On Chevron Nigeria’s electrical and instrumentation
            team the same loops turned up with consequences attached — 4–20 mA current signalling,
            3–15 PSI pneumatics, I/P converters, hazardous area classification, P&amp;IDs to read
            before touching anything. Industrial instrumentation has been solving the problem I keep
            running into for decades, at a scale where getting it wrong is expensive.
          </p>
          <p className="border-l-2 border-accent pl-4 text-body text-content">
            {THREAD_CLOSE[mode]}
          </p>
        </div>
      </Section>
    ),

    journey: (
      <Section
        key="journey"
        id="journey"
        eyebrow="Journey"
        heading="Five years, in the order they happened"
        lede="The gap between learning something and teaching it is usually about a term."
      >
        <div className="grid gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
          <Timeline entries={profile.timeline} />
          <div className="space-y-10 lg:pt-1">
            <PhotoFigure id="portrait" sizes="(min-width: 1024px) 20rem, 60vw" />
            <PhotoFigure id="cohort-group" sizes="(min-width: 1024px) 20rem, 100vw" />
          </div>
        </div>
      </Section>
    ),

    lessons: (
      <Section
        key="lessons"
        id="lessons"
        eyebrow="How I work"
        heading="Six builds, six things I did not know before"
        lede="One line per project. Each links to the build that taught it."
      >
        <ol className="border-t border-hairline">
          {lessons.map(({ project, lesson }) => (
            <li
              key={project.slug}
              className="row-live grid gap-x-8 gap-y-2 border-b border-hairline py-5 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]"
            >
              <p className="lg:pt-0.5">
                <Link
                  href={`/work/${project.slug}/`}
                  onClick={() => track({ name: 'project_opened', slug: project.slug, mode })}
                  className="text-caption font-medium text-content transition-colors hover:text-accent"
                >
                  {project.name}
                  <span className="row-arrow ml-1.5 text-content-faint" aria-hidden="true">
                    →
                  </span>
                </Link>
                <span className="mt-0.5 block font-mono text-micro text-content-faint">
                  {project.period}
                </span>
              </p>
              <p className="max-w-measure text-body text-content-muted text-pretty">{lesson}</p>
            </li>
          ))}
        </ol>
      </Section>
    ),

    experience: (
      <Section
        key="experience"
        id="experience"
        eyebrow="Experience"
        heading="A facilities team, a robotics lab, and a tutorial room"
        lede="The Chevron rotation is where a control loop stopped being coursework and started having 3–15 PSI behind it."
      >
        <ExperienceList items={experienceForMode(mode)} variant={variant} />
      </Section>
    ),

    teaching: (
      <Section
        key="teaching"
        id="teaching"
        eyebrow="Teaching and leadership"
        heading="Whatever I get access to becomes a lesson plan"
        lede="Circuit Zero to Hero starts with students who have never held a multimeter. Read the bullets, not the titles."
      >
        <LeadershipList items={leadershipForMode(mode)} variant={variant} />
      </Section>
    ),

    education: (
      <Section
        key="education"
        id="education"
        eyebrow="Education and training"
        heading="Academic background"
      >
        <EducationList items={profile.education} variant={variant} showCoursework />
        <div className="mt-12">
          <h3 className="eyebrow mb-4">Training and certifications</h3>
          <CertificationList items={certificationsForVariant(variant)} />
        </div>
      </Section>
    ),
  }

  return (
    <>
      <header className="shell border-b border-hairline pb-section pt-14 sm:pt-20">
        <div className="grid items-start gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
          <Reveal>
            <p className="eyebrow flex items-center gap-2.5">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span>About{unset ? '' : ` — read for ${MODE_LABELS[mode]}`}</span>
            </p>

            <h1 className="mt-5 max-w-[38ch] text-h1 font-medium tracking-tight text-balance">
              {intro.heading}
            </h1>

            <div className="mt-2 h-6 w-full max-w-[22rem]">
              <SettledTrace className="h-full w-full" delay={0.1} strokeWidth={1.6} />
            </div>

            <p className="mt-6 max-w-measure text-lead leading-snug text-content text-pretty">
              {intro.lede}
            </p>

            <div className="mt-9 max-w-[34rem]">
              <AtAGlance />
            </div>

            <CtaRow
              className="mt-9"
              label="Where to go from here"
              actions={[
                { label: 'Start with the thread', href: '#thread', weight: 'primary' },
                {
                  label: `${MODE_LABELS[mode]} CV`,
                  href: cvFile(variant, 'pdf'),
                  download: true,
                  onSelect: () => track({ name: 'cv_downloaded', variant, format: 'pdf', mode }),
                },
                { label: 'Get in touch', href: '/contact/' },
              ]}
            />
          </Reveal>

          <Reveal delay={0.12}>
            <PhotoFigure id="portrait" sizes="(min-width: 1024px) 22rem, 60vw" priority />
          </Reveal>
        </div>
      </header>

      {ORDER[mode].map((block) => blocks[block])}

      <div className="shell">
        <TraceDivider />
      </div>

      <Section
        id="next"
        eyebrow="Next"
        heading="The detail is in the case studies"
        lede="Every claim above has a build behind it. The CV is the short version, in whichever shape suits you."
      >
        <CtaRow
          label="Next steps"
          actions={[
            { label: 'All six projects', href: '/work/', weight: 'primary' },
            { label: 'All four CV versions', href: '/cv/' },
            { label: 'Get in touch', href: '/contact/' },
            {
              label: 'LinkedIn',
              href: profile.identity.links.linkedin.href,
              external: true,
              weight: 'quiet',
              onSelect: () => track({ name: 'external_link', target: 'linkedin', mode }),
            },
          ]}
        />
      </Section>
    </>
  )
}
