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
} from '@/lib/select'
import { Section, TickList } from '@/components/section/Section'
import { PathHero } from '@/components/chrome/PathHero'
import { CtaRow } from '@/components/section/Cta'
import { ProjectList } from '@/components/work/ProjectRow'
import { PhotoFigure } from '@/components/media/Photo'
import { ClassroomScene } from '@/components/scenes/ClassroomScene'
import {
  CertificationList,
  EducationList,
  ExperienceList,
  LeadershipList,
  Timeline,
} from '@/components/section/Blocks'

const MODE = 'scholarship' as const
const VARIANT = CV_FOR_MODE[MODE]

/**
 * Scholarship path.
 *
 * A committee is not evaluating a repository. It is deciding whether funding this
 * person produces more than one qualified graduate — so this path leads with the
 * sequence of the last five years, then the teaching, then the work framed by who
 * it is for. The register is warmer and the type is larger, but the facts are the
 * same facts on every other path.
 *
 * The hero scene is a board, a circuit and a room: the lamp lighting is not the end
 * of the lesson, the students following it is. That distinction is what this whole
 * path is arguing, so it is the one animation that belongs here.
 */
export function ScholarshipPath() {
  useDeclareMode(MODE)

  const leadership = leadershipForMode(MODE)
  const experience = experienceForMode(MODE)
  const projects = projectsForMode(MODE)

  return (
    <>
      <PathHero
        mode={MODE}
        eyebrow="Journey, teaching and what the work is for"
        heading="I learn something, then I go and teach it to someone who has never seen it before."
        lede="Electrical and electronics engineering at Obafemi Awolowo University, expected 2027. Alongside an internship on Chevron Nigeria's electrical and instrumentation team, I lead a six-session embedded systems curriculum for secondary school students and instruct a practical electronics workshop for people with no prior background."
        detail="The pattern has held for three years. Whatever I get access to, whether a robotics lab, a plant rotation or a circuit bench, becomes a set of lesson plans within a term."
        actions={[
          { label: 'The journey', href: '#journey', weight: 'primary' },
          {
            label: 'Scholarship CV',
            href: cvFile(VARIANT, 'pdf'),
            download: true,
            onSelect: () =>
              track({ name: 'cv_downloaded', variant: VARIANT, format: 'pdf', mode: MODE }),
          },
          { label: 'Contact', href: '/contact/' },
        ]}
      >
        <div className="space-y-8">
          <PhotoFigure id="portrait" sizes="(min-width: 1024px) 24rem, 60vw" priority />
          <ClassroomScene />
        </div>
      </PathHero>

      <Section
        id="journey"
        eyebrow="Journey"
        heading="Five years, in the order they happened"
        lede="The teaching starts in 2023 and has not stopped since. That is the line I would look at first."
      >
        <Timeline entries={profile.timeline} />
      </Section>

      <Section
        id="teaching"
        eyebrow="Teaching and leadership"
        heading="What I do with what I learn"
        lede="Curriculum design, coordinating tutors, and workshops for people who have never held a multimeter. The bullets say more than the titles do."
      >
        <LeadershipList items={leadership} variant={VARIANT} />
      </Section>

      <Section
        id="cohort"
        eyebrow="This year"
        heading="Inside the internship"
        lede="I am not publishing the engineering photographs from this rotation. The control systems, switchgear and instrumentation in them belong to the client, not to me. What I can show you is the cohort I went through it with."
      >
        <div className="grid gap-x-10 gap-y-10 lg:grid-cols-2">
          <PhotoFigure id="cohort-group" sizes="(min-width: 1024px) 38rem, 100vw" />
          <PhotoFigure id="cohort-line" sizes="(min-width: 1024px) 38rem, 100vw" />
        </div>

        <div className="mt-14">
          <h3 className="eyebrow mb-4">What the rotation covered</h3>
          <ExperienceList items={experience} variant={VARIANT} showSkills={false} />
        </div>
      </Section>

      <Section
        id="work"
        eyebrow="Projects"
        heading="Built for someone in particular"
        lede="Each of these started with a person who had a problem — a lecturer losing teaching time to a paper register, a grower who needs light intensity and light colour measured as two separate things, a building whose alarm has nobody in it to hear it go off."
      >
        <ProjectList projects={projects} mode={MODE} />
      </Section>

      <Section
        id="education"
        eyebrow="Academic background"
        heading="Education and training"
      >
        <EducationList items={profile.education} variant={VARIANT} showCoursework />
        <div className="mt-12">
          <h3 className="eyebrow mb-4">Training and certifications</h3>
          <CertificationList items={certificationsForVariant(VARIANT)} />
        </div>
      </Section>

      <Section
        id="direction"
        eyebrow="Direction"
        heading="What is already in motion"
        lede="Commitments with dates on them. Ambitions are easy to write, and I would not fund one either."
      >
        <TickList
          className="max-w-measure"
          items={[
            'Finish the B.Sc. in Electronic and Electrical Engineering at OAU — expected 2027.',
            'Finish the pipe anomaly detection work: the two-stage cascaded detector is built and in progress, and the fused RGB and edge-enhanced stage still needs evaluating properly.',
            'Build the extended production version of the Smart Attendance System, which was invited after the prototype was defended at a final-year project review.',
            'Keep running SPAW: the third cohort of the six-session embedded systems curriculum, with the lesson plans and tutor guides rewritten each time from what went wrong in the last one.',
            'Go deeper into instrumentation and control — the Chevron rotation is the first time the loops from coursework have had consequences attached, and that is the direction the rest follows.',
          ]}
        />
      </Section>

      <Section
        id="next"
        eyebrow="Next"
        heading="For scholarship and fellowship committees"
        lede="The CV below is the version I wrote for review panels: academic background first, then leadership and community work. Anything in it you want to check has a page here with the detail behind it."
      >
        <CtaRow
          label="Scholarship next steps"
          actions={[
            {
              label: 'Download scholarship CV (PDF)',
              href: cvFile(VARIANT, 'pdf'),
              weight: 'primary',
              download: true,
              onSelect: () =>
                track({ name: 'cv_downloaded', variant: VARIANT, format: 'pdf', mode: MODE }),
            },
            { label: 'Get in touch', href: '/contact/' },
            { label: 'Read the full story', href: '/about/' },
            {
              label: 'LinkedIn',
              href: profile.identity.links.linkedin.href,
              external: true,
              weight: 'quiet',
              onSelect: () => track({ name: 'external_link', target: 'linkedin', mode: MODE }),
            },
          ]}
        />
      </Section>
    </>
  )
}
