import { allProjectSlugs, projectBySlug } from '@/lib/select'
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/lib/og'

export const dynamic = 'force-static'

/**
 * Per-project social card.
 *
 * The point of a shareable project URL is that pasting it somewhere
 * shows that project, not the site in general, so each slug gets its own card
 * carrying its own name and tagline.
 *
 * `generateStaticParams` is repeated here rather than inherited: an image route in
 * a dynamic segment enumerates its own params, and without this the export would
 * emit the HTML for six case studies and the card for none of them.
 *
 * `alt` is one string for all six rather than per-project, which would mean
 * `generateImageMetadata` and an id-suffixed route for a line of text most
 * platforms never surface. Not worth the extra machinery.
 */

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Case study by Ayomide Abilewa'

export function generateStaticParams(): { slug: string }[] {
  return allProjectSlugs().map((slug) => ({ slug }))
}

type Props = { params: Promise<{ slug: string }> }

export default async function Image({ params }: Props) {
  const { slug } = await params
  const project = projectBySlug(slug)

  // Unreachable in the export, since params come from generateStaticParams. The
  // lookup is nullable though, so this falls back rather than throwing mid-build.
  if (!project) {
    return ogCard({
      tone: 'engineering',
      eyebrow: 'Case study',
      title: 'Ayomide Abilewa',
      subtitle: 'Embedded systems, instrumentation and computer vision.',
    })
  }

  return ogCard({
    tone: 'engineering',
    eyebrow: `Case study · ${project.period}`,
    title: project.name,
    subtitle: project.tagline,
  })
}
