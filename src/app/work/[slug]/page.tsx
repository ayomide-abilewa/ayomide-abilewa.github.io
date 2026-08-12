import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { profile } from '@/data/profile'
import { allProjectSlugs, projectBySlug } from '@/lib/select'
import { CaseStudy } from '@/components/work/CaseStudy'

/**
 * Case study route — one shareable URL per project.
 *
 * Every slug is enumerated at build time, so the static export contains a real
 * HTML file per project and `dynamicParams` can be closed off entirely.
 */

export const dynamicParams = false

export function generateStaticParams(): { slug: string }[] {
  return allProjectSlugs().map((slug) => ({ slug }))
}

type RouteProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params
  const project = projectBySlug(slug)
  if (!project) return {}

  const url = `/work/${project.slug}/`
  return {
    title: project.name,
    description: project.tagline,
    keywords: [...project.technologies, ...project.domains],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: `${project.name} — Ayomide Abilewa`,
      description: project.tagline,
      url,
      images: [
        {
          url: `/og/work-${project.slug}.png`,
          width: 1200,
          height: 630,
          alt: `${project.name} — case study`,
        },
      ],
    },
    twitter: {
      title: `${project.name} — Ayomide Abilewa`,
      description: project.tagline,
      images: [`/og/work-${project.slug}.png`],
    },
  }
}

/** Per-project structured data. Facts only — same source as the page body. */
function projectJsonLd(slug: string) {
  const project = projectBySlug(slug)
  if (!project) return null
  return {
    '@context': 'https://schema.org',
    '@type': project.repo ? 'SoftwareSourceCode' : 'CreativeWork',
    name: project.name,
    description: project.tagline,
    url: `https://ayomide-abilewa.github.io/work/${project.slug}/`,
    author: { '@type': 'Person', name: profile.identity.name },
    keywords: [...project.technologies, ...project.domains].join(', '),
    ...(project.repo
      ? { codeRepository: project.repo, programmingLanguage: project.technologies[0] }
      : {}),
  }
}

export default async function ProjectRoute({ params }: RouteProps) {
  const { slug } = await params
  const project = projectBySlug(slug)
  if (!project) notFound()

  const jsonLd = projectJsonLd(slug)

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          // Build-time JSON from typed data — no user input involved.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <CaseStudy project={project} />
    </>
  )
}
