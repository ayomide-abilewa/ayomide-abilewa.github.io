'use client'

import Link from 'next/link'
import type { Project, ProjectStatus, VisitorMode } from '@/data/types'
import { framingFor } from '@/lib/select'
import { track } from '@/lib/analytics'
import { RevealGroup, RevealItem } from '@/components/motion/Reveal'

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

const STATUS_LABEL: Record<ProjectStatus, string> = {
  shipped: 'Shipped',
  complete: 'Complete',
  ongoing: 'Ongoing',
  'in-progress': 'In progress',
}

export function StatusPill({ status, note }: { status: ProjectStatus; note?: string }) {
  const live = status === 'in-progress' || status === 'ongoing'
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-micro uppercase tracking-[0.12em] text-content-faint">
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${live ? 'bg-accent' : 'bg-content-faint'}`}
      />
      {STATUS_LABEL[status]}
      {note && <span className="sr-only">. {note}</span>}
    </span>
  )
}

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
            <span className="font-mono text-micro text-content-faint">{project.period}</span>
          </span>

          <span className="mt-2 block max-w-measure text-body text-content-muted text-pretty">
            {framingFor(project, mode)}
          </span>

          <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <StatusPill status={project.status} note={project.statusNote} />
            <span aria-hidden="true" className="h-3 w-px bg-hairline" />
            <span className="font-mono text-micro text-content-faint">
              {project.technologies.slice(0, 5).join(' · ')}
            </span>
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
