import type { Project, ProjectImage } from '@/data/types'
import { Photo } from '@/components/media/Photo'

/**
 * Evidence beyond the write-up: photographs for any project, plus fixed slots
 * for a physical build. A slot with no asset says so in words. There is no
 * placeholder image, because a grey box captioned "wiring" reads as a claim.
 */

function Figure({ image }: { image: ProjectImage }) {
  return (
    <figure>
      <Photo id={image.asset} sizes="(min-width: 1024px) 38rem, 100vw" />
      {image.caption && (
        <figcaption className="mt-3 border-t border-hairline pt-2.5 text-caption text-content-muted text-pretty">
          {image.caption}
        </figcaption>
      )}
    </figure>
  )
}

export function hasEvidence(project: Project): boolean {
  return Boolean(project.hardware || project.images?.length || project.evidence)
}

export function CaseEvidence({ project }: { project: Project }) {
  const images = project.images ?? []
  const e = project.evidence ?? {}
  const captures = e.captures ?? []

  const slots = project.hardware
    ? [
        { label: 'Photographs', published: images.length > 0 },
        { label: 'Wiring diagram', published: Boolean(e.wiring) },
        { label: 'Scope or serial captures', published: captures.length > 0 },
        { label: 'Video', published: Boolean(e.video) },
      ]
    : []

  const figures = [...images, ...(e.wiring ? [e.wiring] : []), ...captures]

  return (
    <>
      {slots.length > 0 && (
        <dl className="max-w-[34rem] border-t border-hairline">
          {slots.map((slot) => (
            <div
              key={slot.label}
              className="grid grid-cols-[1fr_auto] gap-x-4 border-b border-hairline py-2.5"
            >
              <dt className="text-caption text-content">{slot.label}</dt>
              <dd
                className={`font-mono text-micro uppercase tracking-[0.12em] ${
                  slot.published ? 'text-accent' : 'text-content-faint'
                }`}
              >
                {slot.published ? 'Below' : 'Not published yet'}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {figures.length > 0 && (
        <div className={`grid gap-x-10 gap-y-10 lg:grid-cols-2 ${slots.length > 0 ? 'mt-10' : ''}`}>
          {figures.map((image) => (
            <Figure key={image.asset} image={image} />
          ))}
        </div>
      )}

      {e.video && (
        <a
          href={e.video.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex min-h-11 items-center gap-2 text-caption font-medium text-accent"
        >
          {e.video.label}
          <span aria-hidden="true">→</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
    </>
  )
}
