import type { MetadataRoute } from 'next'
import { allProjectSlugs } from '@/lib/select'

/**
 * sitemap.xml, generated at build time.
 *
 * Slugs come from `allProjectSlugs()` — the same function that drives
 * `generateStaticParams` for the case studies — so a project added to profile.ts
 * appears here without anybody remembering to update a second list.
 *
 * Priorities reflect how this site is actually meant to be entered: the four
 * visitor paths are the real front doors, so they rank with the landing page
 * rather than below it. Trailing slashes match `trailingSlash: true` in
 * next.config.ts; without them every URL here would redirect once before
 * resolving.
 */

const SITE = 'https://ayomide-abilewa.github.io'

/** Same reason as robots.ts: `output: 'export'` needs this stated explicitly. */
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${SITE}${path}`,
    changeFrequency: 'monthly',
    priority,
  })

  return [
    entry('/', 1),
    // The four front doors.
    entry('/engineering/', 0.9),
    entry('/research/', 0.9),
    entry('/scholarship/', 0.9),
    entry('/everything/', 0.9),
    // Shared surfaces.
    entry('/work/', 0.8),
    entry('/cv/', 0.7),
    entry('/about/', 0.6),
    entry('/contact/', 0.5),
    // One shareable URL per case study, per prompt §17.
    ...allProjectSlugs().map((slug) => entry(`/work/${slug}/`, 0.7)),
  ]
}
