'use client'

import { profile } from '@/data/profile'
import { CV_FOR_MODE } from '@/data/types'
import { useDeclareMode } from '@/lib/mode'
import { track } from '@/lib/analytics'
import {
  certificationsForVariant,
  cvFile,
  experienceForMode,
  leadershipForMode,
  projectsForMode,
  skillsForVariant,
} from '@/lib/select'
import { Section } from '@/components/section/Section'
import { PathHero } from '@/components/chrome/PathHero'
import { CtaRow } from '@/components/section/Cta'
import { ProjectList } from '@/components/work/ProjectRow'
import { RepoEvidence } from '@/components/work/RepoEvidence'
import { InterestGraph } from '@/components/research/InterestGraph'
import { PhotoFigure } from '@/components/media/Photo'
import { TraceDivider } from '@/components/brand/SettledTrace'
import {
  CertificationList,
  EducationList,
  ExperienceList,
  LeadershipList,
  SkillGrid,
  Timeline,
} from '@/components/section/Blocks'

const MODE = 'everything' as const
const VARIANT = CV_FOR_MODE[MODE]

/**
 * Everything path.
 *
 * Not a fourth design — a single scroll that passes through the other three. Each
 * section carries a `register`, which retunes the theme custom properties for that
 * block only, so the page physically moves from the instrument-panel world into
 * the paper world into the warm one and back.
 *
 * That is the whole thesis made literal: one person, different perspectives, one
 * connected digital world. The type scale and the grid never change, which is what
 * stops it reading as three websites stapled together.
 */
export function EverythingPath() {
  useDeclareMode(MODE)

  return (
    <>
      <PathHero
        mode={MODE}
        eyebrow="All of it, in one pass"
        heading="One person, read three different ways — engineering, research and the teaching that came out of both."
        lede="Electronic and electrical engineering at Obafemi Awolowo University, expected 2027. Embedded systems, computer vision and instrumentation, currently interning on Chevron Nigeria's electrical and instrumentation team."
        detail="Six builds, three years, five questions I keep coming back to, and a curriculum that came out of all of it."
        actions={[
          { label: 'Start the pass', href: '#build', weight: 'primary' },
          {
            label: 'Full CV',
            href: cvFile(VARIANT, 'pdf'),
            download: true,
            onSelect: () =>
              track({ name: 'cv_downloaded', variant: VARIANT, format: 'pdf', mode: MODE }),
          },
          { label: 'Contact', href: '/contact/' },
        ]}
      />

      {/* ---------------- ENGINEERING REGISTER ---------------- */}
      <Section
        id="build"
        register="engineering"
        eyebrow="One — what I build"
        heading="Systems that measure the physical world"
        lede="In order, from a 2023 fire alarm that rang a buzzer to a 2026 detector that gives two models different views of the same frame."
      >
        <ProjectList projects={projectsForMode(MODE)} mode={MODE} />
        <div className="mt-16">
          <h3 className="eyebrow mb-4">What it is built with</h3>
          <SkillGrid groups={skillsForVariant(VARIANT)} />
        </div>
        <div className="mt-16">
          <h3 className="eyebrow mb-4">Source you can read</h3>
          <RepoEvidence />
        </div>
      </Section>

      {/* ---------------- RESEARCH REGISTER ---------------- */}
      <Section
        id="questions"
        register="research"
        eyebrow="Two — what I am curious about"
        heading="The questions underneath the projects"
        lede="Five of them. Select one and it shows you the builds it came out of."
      >
        <InterestGraph interests={profile.researchInterests} />
        <div className="mt-16">
          <h3 className="eyebrow mb-4">Academic background</h3>
          <EducationList items={profile.education} variant={VARIANT} showCoursework />
        </div>
      </Section>

      {/* ---------------- SCHOLARSHIP REGISTER ---------------- */}
      <Section
        id="story"
        register="scholarship"
        eyebrow="Three — how I got here"
        heading="Five years, in the order they happened"
        lede="From a first-year student to a plant rotation, with a classroom running the whole way through."
      >
        <div className="grid gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
          <Timeline entries={profile.timeline} />
          <div className="space-y-10 lg:pt-1">
            <PhotoFigure id="portrait" sizes="(min-width: 1024px) 22rem, 60vw" />
            <PhotoFigure id="cohort-group" sizes="(min-width: 1024px) 22rem, 100vw" />
          </div>
        </div>

        <div className="mt-16">
          <h3 className="eyebrow mb-4">Teaching and leadership</h3>
          <LeadershipList items={leadershipForMode(MODE)} variant={VARIANT} />
        </div>
      </Section>

      {/* ---------------- BACK TO THE HOUSE REGISTER ---------------- */}
      <Section
        id="experience"
        eyebrow="Experience"
        heading="Where the work has happened"
      >
        <ExperienceList items={experienceForMode(MODE)} variant={VARIANT} />
        <div className="mt-16">
          <h3 className="eyebrow mb-4">Training and certifications</h3>
          <CertificationList items={certificationsForVariant(VARIANT)} />
        </div>
      </Section>

      <div className="shell">
        <TraceDivider />
      </div>

      <Section
        id="next"
        eyebrow="Next"
        heading="Pick a direction"
        lede="Six case studies, four CV versions, one email address."
      >
        <CtaRow
          label="Next steps"
          actions={[
            { label: 'All projects', href: '/work/', weight: 'primary' },
            {
              label: 'Download full CV (PDF)',
              href: cvFile(VARIANT, 'pdf'),
              download: true,
              onSelect: () =>
                track({ name: 'cv_downloaded', variant: VARIANT, format: 'pdf', mode: MODE }),
            },
            { label: 'All four CV versions', href: '/cv/' },
            { label: 'Get in touch', href: '/contact/' },
            {
              label: 'GitHub',
              href: profile.identity.links.github.href,
              external: true,
              weight: 'quiet',
              onSelect: () => track({ name: 'external_link', target: 'github', mode: MODE }),
            },
          ]}
        />
      </Section>
    </>
  )
}
