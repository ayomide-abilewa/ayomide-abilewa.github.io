'use client'

import Link from 'next/link'
import type { Project, VisitorMode } from '@/data/types'
import { framingFor, projectPeriod } from '@/lib/select'
import { track } from '@/lib/analytics'
import { RevealGroup, RevealItem } from '@/components/motion/Reveal'
import { EvidenceBadges, ProjectFacts } from '@/components/work/ProjectMeta'

/**
 * Project list row.
 *
 * Not a card. Cards force every project into the same rectangle and then compete
 * for attention with each other; a row list lets the ranking do its job — first
 * is first — and gives the framing sentence room to be a sentence.
 *
 * The framing line is per-path: the same project introduced by what that
 * audience came for. Content is identical, the door is different.
 */

export function ProjectRow({
  project,
  mode,
  index,
}: {
  project: Project
  mode: VisitorMode
  index: number
}) {
  return (
    /* `row-live` wipes an accent rule along the bottom edge on hover or focus;
       `row-index` and `row-arrow` are what move inside it. See globals.css. */
    <RevealItem as="li" className="row-live border-b border-hairline">
      <Link
        href={`/work/${project.slug}/`}
        onClick={() => track({ name: 'project_opened', slug: project.slug, mode })}
        className="group grid gap-x-6 gap-y-2 py-7 sm:grid-cols-[3rem_1fr_auto]"
      >
        <span className="row-index hidden pt-1 font-mono text-micro text-content-faint sm:block">
          {String(index + 1).padStart(2, '0')}
        </span>

        <span className="min-w-0">
          <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-h3 font-medium tracking-tight text-content transition-colors group-hover:text-accent">
              {project.name}
            </span>
            <span className="font-mono text-micro text-content-faint">{projectPeriod(project)}</span>
          </span>

          <span className="mt-2 block max-w-measure text-body text-content-muted text-pretty">
            {framingFor(project, mode)}
          </span>

          <span className="mt-3 block">
            <ProjectFacts project={project} stack={5} />
          </span>
          <span className="mt-3 block">
            <EvidenceBadges project={project} />
          </span>
        </span>

        <span
          aria-hidden="true"
          className="row-arrow hidden self-center text-content-faint transition-colors duration-200 group-hover:text-accent sm:block"
        >
          →
        </span>
      </Link>
    </RevealItem>
  )
}

export function ProjectList({
  projects,
  mode,
  className = '',
  startIndex = 0,
}: {
  projects: Project[]
  mode: VisitorMode
  className?: string
  /** Continues the numbering across two adjacent lists, as /work does. */
  startIndex?: number
}) {
  return (
    <RevealGroup as="ul" className={`border-t border-hairline ${className}`}>
      {projects.map((project, i) => (
        <ProjectRow key={project.slug} project={project} mode={mode} index={startIndex + i} />
      ))}
    </RevealGroup>
  )
}
