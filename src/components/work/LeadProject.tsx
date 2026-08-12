'use client'

import Link from 'next/link'
import type { Project, VisitorMode } from '@/data/types'
import { track } from '@/lib/analytics'
import { Reveal } from '@/components/motion/Reveal'
import { Field, TickList } from '@/components/section/Section'
import { StatusPill } from '@/components/work/ProjectRow'
import { DecisionList } from '@/components/work/DecisionList'
import { ArchitectureDiagram } from '@/components/work/ArchitectureDiagram'

/**
 * The lead project on a path route, opened through that path's lens.
 *
 * `decisions` shows the engineering reasoning: each choice paired with the
 * failure mode that forced it. `method` shows the research reasoning: the
 * approach as a numbered method, then what came out of it. Same project object,
 * same facts — the difference is which question the page is answering.
 *
 * The full case study is one link away, so this is an opening argument rather
 * than a duplicate of /work/[slug].
 */

export function LeadProject({
  project,
  mode,
  lens,
  limit = 4,
  showArchitecture = true,
}: {
  project: Project
  mode: VisitorMode
  lens: 'decisions' | 'method'
  /** How many reasoning items to show before deferring to the case study. */
  limit?: number
  showArchitecture?: boolean
}) {
  const open = () => track({ name: 'project_opened', slug: project.slug, mode })
  const decisions = project.decisions.slice(0, limit)
  const remaining = project.decisions.length - decisions.length

  return (
    <article>
      <Reveal className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5">
          <h3 className="text-h2 font-medium tracking-tight text-content">{project.name}</h3>
          <span className="font-mono text-micro text-content-faint">{project.period}</span>
          <StatusPill status={project.status} note={project.statusNote} />
        </div>

        <p className="mt-4 max-w-measure text-lead leading-snug text-content text-pretty">
          {project.tagline}
        </p>

        <Field label="The problem" className="mt-9 max-w-measure">
          <p className="text-body text-content-muted text-pretty">{project.problem}</p>
        </Field>

        {lens === 'decisions' ? (
          <Field label="Engineering decisions" className="mt-9">
            <DecisionList items={decisions} remaining={remaining} />
          </Field>
        ) : (
          <>
            <Field label="Method" className="mt-9 max-w-measure">
              <ol className="space-y-3">
                {project.approach.slice(0, limit).map((step, i) => (
                  <li key={step} className="grid grid-cols-[2rem_1fr] gap-x-1">
                    <span className="pt-0.5 font-mono text-micro text-accent">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-body text-content-muted text-pretty">{step}</span>
                  </li>
                ))}
              </ol>
            </Field>
            {project.results.length > 0 && (
              <Field label="What came out of it" className="mt-9 max-w-measure">
                <TickList items={project.results.slice(0, 3)} />
              </Field>
            )}
          </>
        )}

        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href={`/work/${project.slug}/`}
            onClick={open}
            className="group inline-flex items-center gap-2 text-caption font-medium text-accent"
          >
            Read the full case study
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                track({ name: 'external_link', target: 'repo', slug: project.slug, mode })
              }
              className="text-caption text-content-muted underline decoration-hairline underline-offset-4 hover:text-accent hover:decoration-accent"
            >
              Source on GitHub
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
      </Reveal>

      {showArchitecture && project.architecture && (
        <Reveal delay={0.1} className="mt-12">
          <ArchitectureDiagram architecture={project.architecture} />
        </Reveal>
      )}
    </article>
  )
}
