'use client'

import { profile } from '@/data/profile'
import { CV_FOR_MODE } from '@/data/types'
import { useDeclareMode } from '@/lib/mode'
import { track } from '@/lib/analytics'
import {
  certificationsForVariant,
  cvFile,
  experienceForMode,
  projectBySlug,
  projectsForMode,
  skillsForVariant,
} from '@/lib/select'
import { Section } from '@/components/section/Section'
import { PathHero } from '@/components/chrome/PathHero'
import { CtaRow } from '@/components/section/Cta'
import { ProjectList } from '@/components/work/ProjectRow'
import { LeadProject } from '@/components/work/LeadProject'
import { InterestGraph } from '@/components/research/InterestGraph'
import { LensScene } from '@/components/scenes/LensScene'
import {
  CertificationList,
  EducationList,
  ExperienceList,
  SkillGrid,
} from '@/components/section/Blocks'

const MODE = 'research' as const
const VARIANT = CV_FOR_MODE[MODE]

/**
 * Research path.
 *
 * Presented as a paper: numbered sections, serif headings (set by the mode
 * theme), method before results, and every stated interest wired to work that
 * already exists. An undergraduate claiming a research interest has to show the
 * evidence, which is exactly what the interest graph is for.
 *
 * The hero scene is a specimen under a lens rather than the engineering bench —
 * different subject, and the motion reads at the pace of someone reading rather
 * than someone taking a measurement.
 */
export function ResearchPath() {
  useDeclareMode(MODE)

  const lead = projectBySlug('pipe-anomaly-detection')
  const projects = projectsForMode(MODE).filter((p) => p.slug !== lead?.slug)
  const experience = experienceForMode(MODE)

  return (
    <>
      <PathHero
        mode={MODE}
        eyebrow="Measurement and detection under non-ideal conditions"
        heading="Most measurements are easy in the ideal case. I am interested in what happens after that."
        lede="Undergraduate work on detection when lighting, surface condition and viewing angle change mid-run; on turning raw sensor output into a calibrated measurement; and on closed-loop control where the actuator changes the quantity being measured."
        detail="B.Sc. Electronic and Electrical Engineering at Obafemi Awolowo University, expected 2027. Current work spans a two-stage cascaded detector that fuses RGB and edge-enhanced models, a multi-sensor multispectral acquisition node, and control-systems practice on Quanser robotics hardware in MATLAB and Simulink."
        actions={[
          { label: 'Research interests', href: '#interests', weight: 'primary' },
          {
            label: 'Academic CV',
            href: cvFile(VARIANT, 'pdf'),
            download: true,
            onSelect: () =>
              track({ name: 'cv_downloaded', variant: VARIANT, format: 'pdf', mode: MODE }),
          },
          { label: 'Contact', href: '/contact/' },
        ]}
      >
        <LensScene />
      </PathHero>

      <Section
        id="interests"
        number="01"
        eyebrow="Research interests"
        heading="Five questions, each with work behind it"
        lede="An interest with nothing behind it is just an assertion. Select one and you will see what I mean by it and which projects it came out of."
      >
        <InterestGraph interests={profile.researchInterests} />
      </Section>

      {lead && (
        <Section
          id="lead"
          number="02"
          eyebrow="Current investigation"
          heading="Two-stage cascaded detection for pipe anomalies"
          lede="Method first, then what has come out of it so far. This one is unfinished and written that way: no repository yet, and no final figure I am willing to quote."
        >
          <LeadProject project={lead} mode={MODE} lens="method" limit={5} />
        </Section>
      )}

      <Section
        id="work"
        number="03"
        eyebrow="Related work"
        heading="Instrumentation, acquisition and control"
        lede="Ordered by how close each one sits to the questions above."
      >
        <ProjectList projects={projects} mode={MODE} />
      </Section>

      <Section
        id="experience"
        number="04"
        eyebrow="Laboratory and field experience"
        heading="Control theory applied to hardware that answers back"
        lede="Quanser platforms gave me the closed loops; the Chevron rotation gave me the industrial signal standards those loops are built on."
      >
        <ExperienceList items={experience} variant={VARIANT} />
      </Section>

      <Section
        id="education"
        number="05"
        eyebrow="Education"
        heading="Academic background and relevant coursework"
      >
        <EducationList items={profile.education} variant={VARIANT} showCoursework />
      </Section>

      <Section
        id="methods"
        number="06"
        eyebrow="Methods and tooling"
        heading="What the work is done with"
        lede="Stated at the level I hold it. Overstating this is the fastest way to waste an interview."
      >
        <SkillGrid groups={skillsForVariant(VARIANT)} />
        <div className="mt-14">
          <h3 className="eyebrow mb-4">Training and certifications</h3>
          <CertificationList items={certificationsForVariant(VARIANT)} />
        </div>
      </Section>

      <Section
        id="next"
        number="07"
        eyebrow="Collaboration"
        heading="Open to research internships, lab placements and graduate supervision"
        lede="If any of the questions above overlap with your group's work, the fastest route is email — a note on what you are working on is enough."
      >
        <CtaRow
          label="Research next steps"
          actions={[
            { label: 'Get in touch', href: '/contact/', weight: 'primary' },
            {
              label: 'Download academic CV (PDF)',
              href: cvFile(VARIANT, 'pdf'),
              download: true,
              onSelect: () =>
                track({ name: 'cv_downloaded', variant: VARIANT, format: 'pdf', mode: MODE }),
            },
            { label: 'All projects', href: '/work/' },
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
