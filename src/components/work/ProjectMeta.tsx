import type { Project, ProjectStatus } from '@/data/types'
import { EVIDENCE_LABEL, evidenceFor } from '@/lib/select'

/**
 * The at-a-glance facts every project card and row shows. No hooks and no
 * 'use client', so the landing page can render these on the server while the
 * row lists keep using them on the client.
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

/** Status, my part in it where that is on record, and the first few technologies. */
export function ProjectFacts({ project, stack = 4 }: { project: Project; stack?: number }) {
  return (
    // No vertical dividers: when the line wraps they end up dangling at the edge.
    <span className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      <StatusPill status={project.status} note={project.statusNote} />
      {project.team && (
        <span className="font-mono text-micro text-content-muted">{project.team}</span>
      )}
      <span className="font-mono text-micro text-content-faint">
        {project.technologies.slice(0, stack).join(' · ')}
      </span>
    </span>
  )
}

/**
 * What a reader can check for themselves. A project with nothing public says so
 * rather than leaving a gap that reads like an oversight.
 */
export function EvidenceBadges({ project }: { project: Project }) {
  const kinds = evidenceFor(project)
  return (
    <span className="flex flex-wrap gap-1.5">
      <span className="sr-only">Evidence: </span>
      {kinds.length === 0 ? (
        <span className="badge text-content-faint">Write-up only</span>
      ) : (
        kinds.map((kind) => (
          <span key={kind} className="badge text-content-muted">
            {EVIDENCE_LABEL[kind]}
          </span>
        ))
      )}
    </span>
  )
}
