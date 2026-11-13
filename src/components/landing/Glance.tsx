import Link from 'next/link'
import { profile } from '@/data/profile'
import { formatRange } from '@/lib/dates'
import { degree, facts } from '@/lib/facts'
import { latestRole } from '@/lib/select'

/**
 * At a glance: the CV's headline facts as a bento grid. Every number is counted
 * from profile.ts, never typed.
 */

const latest = latestRole()
const building = profile.projects.find((p) => p.status === 'in-progress')
const repos = profile.projects.filter((p) => p.repo).length

function Tile({
  className = '',
  label,
  children,
}: {
  className?: string
  label: string
  children: React.ReactNode
}) {
  return (
    <li className={`spot panel-live relative flex flex-col justify-between overflow-hidden border border-hairline bg-surface-raised/60 p-6 ${className}`}>
      <p className="eyebrow">{label}</p>
      <div className="mt-8">{children}</div>
    </li>
  )
}

export function Glance() {
  return (
    <section className="shell py-section" aria-labelledby="glance-heading">
      <div className="mb-9 max-w-measure">
        <p className="eyebrow mb-3">At a glance</p>
        <h2 id="glance-heading" className="text-h2 font-medium tracking-tight text-balance">
          The short version
        </h2>
      </div>

      <ul className="grid auto-rows-[minmax(11rem,auto)] gap-4 md:grid-cols-4">
        {latest && (
          <Tile label={latest.label} className="md:col-span-2 md:row-span-2">
            <p className="text-h1 font-medium tracking-tight text-content text-balance">
              {latest.role.shortRole}
            </p>
            <p className="mt-3 text-body-lg text-content-muted">
              {latest.role.organisation} · {formatRange(latest.role.start, latest.role.end)}
            </p>
            <p className="mt-6 max-w-[34rem] text-body text-content-muted text-pretty">{latest.role.summary}</p>
          </Tile>
        )}

        <Tile label="Builds">
          <p className="stat-num text-accent">{profile.projects.length}</p>
          <p className="mt-2 text-caption text-content-muted">
            projects since {facts.firstBuild}, {repos} with public source
          </p>
        </Tile>

        <Tile label="Teaching since">
          <p className="stat-num text-accent">{facts.teachingSince}</p>
          <p className="mt-2 text-caption text-content-muted">circuits and microcontrollers, from zero</p>
        </Tile>

        <Tile label="Degree">
          <p className="text-h3 font-medium tracking-tight text-content">
            {degree.degree} {degree.field}
          </p>
          <p className="mt-2 text-caption text-content-muted">
            {degree.institution} · {facts.graduation}
          </p>
        </Tile>

        {building && (
          <Tile label="Building now">
            <Link
              href={`/work/${building.slug}/`}
              prefetch={false}
              className="text-h3 font-medium tracking-tight text-content transition-colors after:absolute after:inset-0 hover:text-accent"
            >
              {building.name}
            </Link>
            <p className="mt-2 text-caption text-content-muted">In progress</p>
          </Tile>
        )}
      </ul>
    </section>
  )
}
