import { flagshipProjects, projectPeriod } from '@/lib/select'
import { ProjectLink } from '@/components/landing/ProjectLink'
import { RevealGroup, RevealItem } from '@/components/motion/Reveal'
import { EvidenceBadges, ProjectFacts } from '@/components/work/ProjectMeta'

/**
 * Real work within one scroll of the landing page, whichever door a visitor
 * would have picked. Server-rendered; the only client code is the click count.
 *
 * Cards here and rows everywhere else: three side by side is a sample, not a
 * ranking, so they get equal rectangles. The trace rule along each top edge is
 * the same accent-to-hairline line the section dividers use.
 */
export function Flagships() {
  const projects = flagshipProjects()

  return (
    <section className="shell pb-section" id="work" aria-labelledby="work-heading">
      <div className="mb-9 max-w-measure">
        <p className="eyebrow mb-3">Start with the work</p>
        <h2 id="work-heading" className="text-h2 font-medium tracking-tight text-balance">
          Three projects to start with
        </h2>
        <p className="mt-3 text-body text-content-muted text-pretty">
          A software build I shipped, a group project I defended, and a hardware device. If you want
          more, the paths below go deeper.
        </p>
      </div>

      <RevealGroup as="ul" className="grid gap-5 lg:grid-cols-3">
        {projects.map((project, index) => (
          <RevealItem as="li" key={project.slug} className="flex">
            <ProjectLink
              slug={project.slug}
              className="spot group relative flex w-full flex-col border border-hairline bg-surface-raised p-5 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-accent/60 sm:p-6"
            >
              <span aria-hidden="true" className="trace-rule -mx-5 -mt-5 mb-5 block sm:-mx-6 sm:-mt-6 sm:mb-6" />
              <span className="flex items-baseline justify-between font-mono text-micro text-content-faint">
                <span>{projectPeriod(project)}</span>
                <span aria-hidden="true" className="card-index">{String(index + 1).padStart(2, '0')}</span>
              </span>
              <span className="mt-2 text-h3 font-medium tracking-tight text-content text-balance transition-colors group-hover:text-accent">
                {project.name}
              </span>
              <span className="mt-3 block flex-1 text-body text-content-muted text-pretty">
                {project.tagline}
              </span>
              <span className="mt-5 block">
                <ProjectFacts project={project} stack={3} />
              </span>
              <span className="mt-3 block">
                <EvidenceBadges project={project} />
              </span>
              <span className="mt-6 inline-flex min-h-11 items-center gap-2 text-caption font-medium text-accent">
                Read the case study
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </ProjectLink>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}
