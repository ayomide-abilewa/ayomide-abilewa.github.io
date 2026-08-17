'use client'

import { useMemo } from 'react'
import { profile } from '@/data/profile'
import { CV_FOR_MODE } from '@/data/types'
import { useMode, MODE_LABELS } from '@/lib/mode'
import { track } from '@/lib/analytics'
import { cvFile, indexOrderForMode } from '@/lib/select'
import { Section } from '@/components/section/Section'
import { CtaRow } from '@/components/section/Cta'
import { ProjectList } from '@/components/work/ProjectRow'
import { SettledTrace } from '@/components/brand/SettledTrace'
import { Reveal } from '@/components/motion/Reveal'

/**
 * Project index.
 *
 * The complete list, ordered by the active lens rather than filtered by it — a
 * project that a path does not lead with still belongs in the index, it just does
 * not come first. That distinction is what stops mode switching from feeling like
 * work has been hidden.
 *
 * Projects with no rank in the current mode fall to a second list under a heading
 * that says why they are down there. Numbering runs continuously across both, so
 * the page reads as one ordered index rather than two competing ones.
 */

const REST_NOTE: Record<string, string> = {
  research:
    'Engineering builds with no method or evaluation to report, so they sit below the ones that have.',
  scholarship:
    'Solo engineering builds with no teaching or community dimension, so they sit below the rest here.',
}

export function WorkIndex() {
  const { mode, unset } = useMode()
  const { ranked, rest } = useMemo(() => indexOrderForMode(mode), [mode])
  const variant = CV_FOR_MODE[mode]

  const withCode = profile.projects.filter((p) => p.repo).length

  return (
    <>
      <header className="shell border-b border-hairline pb-section pt-14 sm:pt-20">
        <Reveal>
          <p className="eyebrow flex items-center gap-2.5">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>
              {profile.projects.length} projects
              {unset ? '' : ` — ordered for ${MODE_LABELS[mode]}`}
            </span>
          </p>

          <h1 className="mt-5 max-w-[38ch] text-h1 font-medium tracking-tight text-balance">
            Six systems, and the thing that nearly broke each one.
          </h1>

          <div className="mt-2 h-6 w-full max-w-[22rem]">
            <SettledTrace className="h-full w-full" delay={0.1} strokeWidth={1.6} />
          </div>

          <p className="mt-6 max-w-measure text-lead leading-snug text-content text-pretty">
            Six projects from 2023 to now: a fire alarm that sends an SMS, a closed-loop fan, a
            multispectral acquisition node, a face-recognition attendance system, a cascaded anomaly
            detector, and a convention booth built to survive bad venue wifi.
          </p>

          <p className="mt-4 max-w-measure text-body text-content-muted text-pretty">
            Each one opens as a case study: the problem, the approach, the architecture, the
            decisions and what came out of it. {withCode} of the {profile.projects.length} have
            public repositories. The rest are hardware and coursework builds, documented from their
            real specifications; where there is no code to link, the page says so.
          </p>

          <CtaRow
            className="mt-9"
            label="Where to go from here"
            actions={[
              { label: 'Start at the top', href: '#index', weight: 'primary' },
              {
                label: 'CV',
                href: cvFile(variant, 'pdf'),
                download: true,
                onSelect: () =>
                  track({ name: 'cv_downloaded', variant, format: 'pdf', mode }),
              },
              { label: 'Contact', href: '/contact/' },
            ]}
          />
        </Reveal>
      </header>

      <Section
        id="index"
        eyebrow="Index"
        heading={unset ? 'All six projects' : `Ordered for ${MODE_LABELS[mode]}`}
        lede="The one at the top is the one I would show you first."
      >
        <ProjectList projects={ranked} mode={mode} />

        {rest.length > 0 && (
          <div className="mt-16">
            <h3 className="eyebrow mb-3">Also built</h3>
            <p className="mb-5 max-w-measure text-body text-content-muted text-pretty">
              {REST_NOTE[mode] ??
                'Outside the current lens, but part of the same body of work.'}
            </p>
            <ProjectList projects={rest} mode="everything" startIndex={ranked.length} />
          </div>
        )}
      </Section>

      <Section
        id="next"
        eyebrow="Next"
        heading="Where to go from here"
        lede="The case studies have the detail. The CV has the summary."
      >
        <CtaRow
          label="Next steps"
          actions={[
            { label: 'Get in touch', href: '/contact/', weight: 'primary' },
            { label: 'All four CV versions', href: '/cv/' },
            { label: 'Read the story', href: '/about/' },
            {
              label: 'GitHub',
              href: profile.identity.links.github.href,
              external: true,
              weight: 'quiet',
              onSelect: () => track({ name: 'external_link', target: 'github', mode }),
            },
          ]}
        />
      </Section>
    </>
  )
}
