'use client'

import { profile } from '@/data/profile'
import { CV_FOR_MODE } from '@/data/types'
import { useDeclareMode } from '@/lib/mode'
import { track } from '@/lib/analytics'
import {
  certificationsForVariant,
  cvFile,
  experienceForMode,
  projectsForMode,
  skillsForVariant,
} from '@/lib/select'
import { Section } from '@/components/section/Section'
import { PathHero } from '@/components/chrome/PathHero'
import { CtaRow } from '@/components/section/Cta'
import { ProjectList } from '@/components/work/ProjectRow'
import { LeadProject } from '@/components/work/LeadProject'
import { RepoEvidence } from '@/components/work/RepoEvidence'
import { BenchScene } from '@/components/scenes/BenchScene'
import {
  CertificationList,
  EducationList,
  ExperienceList,
  SkillGrid,
} from '@/components/section/Blocks'

const MODE = 'engineering' as const
const VARIANT = CV_FOR_MODE[MODE]

/**
 * Engineering path.
 *
 * Ordered the way an engineer reads: the strongest artifact first, opened on its
 * reasoning rather than its feature list, then the rest of the systems, then the
 * hardware and industrial practice behind them, then the source code so every
 * claim above is checkable.
 */
export function EngineeringPath() {
  useDeclareMode(MODE)

  const projects = projectsForMode(MODE)
  const [lead, ...rest] = projects
  const experience = experienceForMode(MODE)

  return (
    <>
      <PathHero
        mode={MODE}
        eyebrow="Systems, hardware and the failure modes behind them"
        heading="I build systems that measure the physical world, then design them for the moment conditions stop cooperating."
        lede="Embedded nodes, computer-vision pipelines and control loops — mostly built for rooms and sites where the lighting is uneven, the network is unreliable and the sensor reading means nothing until it has been calibrated."
        detail="Currently rotating through the electrical and instrumentation team at Chevron Nigeria, working with the 4–20 mA loops and pneumatic standards that solve the same measurement problems at industrial scale."
        actions={[
          { label: 'See the systems', href: '#systems', weight: 'primary' },
          {
            label: 'Technical CV',
            href: cvFile(VARIANT, 'pdf'),
            download: true,
            onSelect: () =>
              track({ name: 'cv_downloaded', variant: VARIANT, format: 'pdf', mode: MODE }),
          },
          {
            label: 'GitHub',
            href: profile.identity.links.github.href,
            external: true,
            onSelect: () => track({ name: 'external_link', target: 'github', mode: MODE }),
          },
        ]}
      >
        <div className="space-y-8">
          <BenchScene />

          <dl className="grid-field-fine rounded-panel border border-hairline bg-surface-sunken/40 p-6">
            {[
              { k: 'Discipline', v: 'Electronic and Electrical Engineering, OAU' },
              { k: 'Currently', v: 'E&I intern, Chevron Nigeria' },
              { k: 'Works in', v: 'Python · C/C++ · MATLAB · Verilog' },
              { k: 'Builds on', v: 'ESP32 · Arduino · STM32 · Raspberry Pi · FPGA' },
              { k: 'Buses', v: 'I2C · SPI · UART' },
            ].map((row) => (
              <div
                key={row.k}
                className="grid grid-cols-[7rem_1fr] gap-x-4 border-b border-hairline py-2.5 last:border-b-0 last:pb-0 first:pt-0"
              >
                <dt className="eyebrow pt-0.5">{row.k}</dt>
                <dd className="text-caption text-content-muted">{row.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </PathHero>

      {lead && (
        <Section
          id="lead"
          eyebrow="How I work"
          heading="Every feature in this repository exists because of a specific way the evening could have gone wrong."
          lede="Find the failure first, then build the thing that survives it. The venue ISP blocked files.pythonhosted.org, so every sound effect is synthesised in the browser and the last text-to-speech tier is the browser too. Nothing this booth needs arrives over the network."
        >
          <LeadProject project={lead} mode={MODE} lens="decisions" limit={4} />
        </Section>
      )}

      <Section
        id="systems"
        eyebrow="Systems built"
        heading="Sensing, detection and control"
        lede="Ordered by how much of the engineering is mine and how well documented it is. Each one opens into a full case study."
      >
        <ProjectList projects={rest.length > 0 ? rest : projects} mode={MODE} />
      </Section>

      <Section
        id="stack"
        eyebrow="Stack"
        heading="Nothing on this list is aspirational"
        lede="Everything here is something I have used on something that ran. Where I am still at fundamentals, the list says fundamentals."
      >
        <SkillGrid groups={skillsForVariant(VARIANT)} />
      </Section>

      <Section
        id="experience"
        eyebrow="Industrial practice"
        heading="The same measurement problems, at plant scale"
        lede="A hobby sensor node and an oil and gas control loop ask the same engineering question with very different consequences if you get it wrong. The internship is where I am learning the second version."
      >
        <ExperienceList items={experience} variant={VARIANT} />
      </Section>

      <Section
        id="source"
        eyebrow="Evidence"
        heading="Read the source"
        lede="The projects here whose code you can open and check line by line. The hardware builds have no repository, and each one says so on its own page."
      >
        <RepoEvidence />
      </Section>

      <Section
        id="background"
        eyebrow="Background"
        heading="Education and training"
      >
        <EducationList items={profile.education} variant={VARIANT} showCoursework={false} />
        <div className="mt-12">
          <h3 className="eyebrow mb-4">Training and certifications</h3>
          <CertificationList items={certificationsForVariant(VARIANT)} />
        </div>
      </Section>

      <Section
        id="next"
        eyebrow="Next"
        heading="If you are hiring, start with the CV"
        lede="If you are building something similar, start with the case studies. Either way, email reaches me faster than anything else here."
      >
        <CtaRow
          label="Engineering next steps"
          actions={[
            { label: 'All projects', href: '/work/', weight: 'primary' },
            {
              label: 'Download technical CV (PDF)',
              href: cvFile(VARIANT, 'pdf'),
              download: true,
              onSelect: () =>
                track({ name: 'cv_downloaded', variant: VARIANT, format: 'pdf', mode: MODE }),
            },
            { label: 'Get in touch', href: '/contact/' },
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
