'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Project, VisitorMode } from '@/data/types'
import { useMode } from '@/lib/mode'
import { track } from '@/lib/analytics'
import { framingFor, projectNeighbours } from '@/lib/select'
import { Reveal } from '@/components/motion/Reveal'
import { Section, Field, TickList } from '@/components/section/Section'
import { CtaRow } from '@/components/section/Cta'
import { StatusPill } from '@/components/work/ProjectRow'
import { DecisionList } from '@/components/work/DecisionList'
import { ArchitectureDiagram } from '@/components/work/ArchitectureDiagram'
import { SettledTrace } from '@/components/brand/SettledTrace'
import { Photo } from '@/components/media/Photo'

/**
 * Case study.
 *
 * One long document per project, in the order an engineer would actually ask the
 * questions: what was wrong, why bother, how it was approached, what it is made of,
 * what fought back, what was decided and why, what came out, what was learned.
 *
 * Two things adapt to the active lens without changing a single fact: the framing
 * sentence under the title, and the previous/next order at the foot of the page —
 * so "next project" agrees with the order /work just showed. Everything else is
 * identical on every path, because a case study that shifts its claims per audience
 * is not a case study.
 */

function MetaRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] gap-x-4 border-b border-hairline py-2.5">
      <dt className="eyebrow pt-px">{label}</dt>
      <dd className="text-caption text-content text-pretty">{children}</dd>
    </div>
  )
}

export function CaseStudy({ project }: { project: Project }) {
  const { mode } = useMode()
  const { previous, next } = projectNeighbours(project.slug, mode)
  const framing = framingFor(project, mode)
  const showFraming = framing !== project.tagline

  return (
    <>
      <header className="shell border-b border-hairline pb-section pt-10 sm:pt-14">
        <Reveal>
          <Link
            href="/work/"
            className="group inline-flex items-center gap-2 font-mono text-micro uppercase tracking-[0.12em] text-content-faint transition-colors hover:text-accent"
          >
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:-translate-x-1"
            >
              ←
            </span>
            All projects
          </Link>

          <h1 className="mt-6 max-w-[34ch] text-h1 font-medium tracking-tight text-balance">
            {project.name}
          </h1>

          <div className="mt-2 h-6 w-full max-w-[20rem]">
            <SettledTrace className="h-full w-full" delay={0.1} strokeWidth={1.6} />
          </div>

          <p className="mt-6 max-w-measure text-lead leading-snug text-content text-pretty">
            {project.tagline}
          </p>

          {showFraming && (
            <p className="mt-4 max-w-measure border-l-2 border-accent pl-4 text-body text-content-muted text-pretty">
              {framing}
            </p>
          )}
        </Reveal>

        <Reveal delay={0.08}>
          <dl className="mt-10 max-w-[34rem] border-t border-hairline">
            <MetaRow label="Period">{project.period}</MetaRow>
            <MetaRow label="Status">
              <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <StatusPill status={project.status} />
                {project.statusNote && (
                  <span className="text-content-muted">{project.statusNote}</span>
                )}
              </span>
            </MetaRow>
            {project.team && <MetaRow label="Role">{project.team}</MetaRow>}
            <MetaRow label="Built with">{project.technologies.join(' · ')}</MetaRow>
            <MetaRow label="Domains">{project.domains.join(' · ')}</MetaRow>
            <MetaRow label="Source">
              {project.repo ? (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    track({ name: 'external_link', target: 'repo', slug: project.slug, mode })
                  }
                  className="underline decoration-hairline underline-offset-4 hover:text-accent hover:decoration-accent"
                >
                  {project.repo.replace('https://github.com/', '')}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <span className="text-content-muted">
                  No public repository. Documented here from its specification and results.
                </span>
              )}
            </MetaRow>
          </dl>
        </Reveal>
      </header>

      <Section id="problem" eyebrow="The problem" heading="What was actually wrong">
        <div className="grid gap-x-14 gap-y-9 lg:grid-cols-2">
          <Field label="Problem">
            <p className="text-body text-content-muted text-pretty">{project.problem}</p>
          </Field>
          <Field label="Why build it">
            <p className="text-body text-content-muted text-pretty">{project.why}</p>
          </Field>
        </div>
      </Section>

      <Section id="approach" eyebrow="Approach" heading="How I built it">
        <ol className="max-w-measure space-y-4">
          {project.approach.map((step, i) => (
            <li key={step} className="grid grid-cols-[2.5rem_1fr] gap-x-1">
              <span className="pt-0.5 font-mono text-micro text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-body text-content-muted text-pretty">{step}</span>
            </li>
          ))}
        </ol>
      </Section>

      {project.architecture && (
        <Section
          id="architecture"
          eyebrow="Architecture"
          heading="Hardware and software, block by block"
          lede="Stored as nodes and edges rather than as a picture, so the labels stay searchable and the diagram cannot drift out of step with the project it describes."
        >
          <ArchitectureDiagram architecture={project.architecture} />
        </Section>
      )}

      {project.images && project.images.length > 0 && (
        <Section id="images" eyebrow="In use" heading="What it looks like running">
          <div className="grid gap-x-10 gap-y-10 lg:grid-cols-2">
            {project.images.map((image) => (
              <figure key={image.asset}>
                <Photo id={image.asset} sizes="(min-width: 1024px) 38rem, 100vw" />
                {image.caption && (
                  <figcaption className="mt-3 border-t border-hairline pt-2.5 text-caption text-content-muted text-pretty">
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </Section>
      )}

      {project.decisions.length > 0 && (
        <Section
          id="decisions"
          eyebrow="Engineering decisions"
          heading="Every choice, and the thing that forced it"
          lede="Left column is what I built. Right column is the failure mode it exists to survive."
        >
          <DecisionList items={project.decisions} />
        </Section>
      )}

      {project.challenges.length > 0 && (
        <Section
          id="challenges"
          eyebrow="Challenges"
          heading="What fought back"
          className="pb-0"
        >
          <TickList items={project.challenges} className="max-w-measure" />
        </Section>
      )}

      {project.results.length > 0 && (
        <Section id="results" eyebrow="Results" heading="What came out of it">
          <TickList items={project.results} className="max-w-measure" />
        </Section>
      )}

      {project.learned.length > 0 && (
        <Section
          id="learned"
          eyebrow="What I learned"
          heading="What it changed about how I build"
        >
          <TickList items={project.learned} className="max-w-measure" />
        </Section>
      )}

      <Section
        id="next"
        eyebrow="Keep going"
        heading="Next in this order"
        lede="Ordered for the lens you are reading through — switch it in the header and this changes too."
      >
        <nav aria-label="Other projects" className="border-t border-hairline">
          {previous && <NeighbourLink project={previous} direction="previous" mode={mode} />}
          {next && <NeighbourLink project={next} direction="next" mode={mode} />}
        </nav>

        <CtaRow
          className="mt-10"
          label="Next steps"
          actions={[
            { label: 'All projects', href: '/work/', weight: 'primary' },
            ...(project.repo
              ? [
                  {
                    label: 'Source on GitHub',
                    href: project.repo,
                    external: true,
                    onSelect: () =>
                      track({ name: 'external_link', target: 'repo', slug: project.slug, mode }),
                  },
                ]
              : []),
            { label: 'Get in touch', href: '/contact/' },
          ]}
        />
      </Section>
    </>
  )
}

function NeighbourLink({
  project,
  direction,
  mode,
}: {
  project: Project
  direction: 'previous' | 'next'
  mode: VisitorMode
}) {
  return (
    <Link
      href={`/work/${project.slug}/`}
      onClick={() => track({ name: 'project_opened', slug: project.slug, mode })}
      className="group grid gap-x-6 gap-y-1 border-b border-hairline py-5 sm:grid-cols-[7.5rem_1fr]"
    >
      <span className="eyebrow pt-1">{direction === 'previous' ? 'Previous' : 'Next'}</span>
      <span className="min-w-0">
        <span className="text-h4 font-medium tracking-tight text-content transition-colors group-hover:text-accent">
          {project.name}
        </span>
        <span className="mt-1 block max-w-measure text-caption text-content-muted text-pretty">
          {project.tagline}
        </span>
      </span>
    </Link>
  )
}
