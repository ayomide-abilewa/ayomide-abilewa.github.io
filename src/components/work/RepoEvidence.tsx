'use client'

import { profile } from '@/data/profile'
import { useMode } from '@/lib/mode'
import { track } from '@/lib/analytics'
import { RevealGroup, RevealItem } from '@/components/motion/Reveal'

/**
 * GitHub as supporting evidence, not a contribution dashboard.
 *
 * Commit graphs and star counts say nothing useful about a student who has been
 * building coursework hardware and interning. What is worth showing is which
 * claims on this site you can go and read the source of — so this lists exactly
 * the projects with public code, and says plainly that the rest do not have any.
 *
 * Derived from `profile.projects`, so it cannot drift: a project gains a row here
 * the moment it gains a `repo`.
 */

export function RepoEvidence() {
  const { mode } = useMode()
  const withCode = profile.projects.filter((p) => p.repo)
  const withoutCode = profile.projects.filter((p) => !p.repo)

  return (
    <div>
      <RevealGroup as="ul" className="border-t border-hairline">
        {withCode.map((project) => (
          <RevealItem as="li" key={project.slug} className="border-b border-hairline">
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                track({ name: 'external_link', target: 'repo', slug: project.slug, mode })
              }
              className="group grid gap-x-8 gap-y-2 py-6 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]"
            >
              <span className="min-w-0">
                <span className="block font-mono text-caption text-content transition-colors group-hover:text-accent">
                  {project.repo?.replace('https://github.com/', '')}
                  <span className="sr-only"> (opens in a new tab)</span>
                </span>
                <span className="mt-1 block font-mono text-micro text-content-faint">
                  {project.technologies.slice(0, 3).join(' · ')}
                </span>
              </span>
              <span className="block max-w-measure text-body text-content-muted text-pretty">
                {project.name} — {project.tagline}
              </span>
            </a>
          </RevealItem>
        ))}
      </RevealGroup>

      {withoutCode.length > 0 && (
        <p className="mt-6 max-w-measure text-caption text-content-muted text-pretty">
          The remaining {withoutCode.length} projects are hardware and coursework builds without
          public repositories — {withoutCode.map((p) => p.name).join(', ')}. They are documented
          here from their real specifications, wiring and results rather than linked to code that
          does not exist.
        </p>
      )}

      <a
        href={profile.identity.links.github.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track({ name: 'external_link', target: 'github', mode })}
        className="mt-6 inline-flex items-center gap-2 text-caption font-medium text-accent"
      >
        {profile.identity.links.github.cvText}
        <span aria-hidden="true">→</span>
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </div>
  )
}
