import type { MediaAsset } from '@/data/media'
import { asset } from '@/data/media'

/**
 * Photograph rendering.
 *
 * A plain <picture> rather than next/image: static export turns Next's optimizer
 * off, so next/image would emit the original file with no srcset at all. The
 * build-time sharp pipeline already produces the widths, so this just points at
 * them — AVIF first, WebP second, JPEG as the floor.
 *
 * `width`/`height` are always set so the browser reserves the right box before
 * the bytes arrive; nothing on this site shifts while images load.
 */

function sources(a: MediaAsset, ext: 'avif' | 'webp') {
  return a.widths.map((w) => `/media/${a.out}-${w}.${ext} ${w}w`).join(', ')
}

export function Photo({
  id,
  sizes = '(min-width: 1024px) 40rem, 100vw',
  className = '',
  priority = false,
  rounded = true,
}: {
  id: string
  sizes?: string
  className?: string
  /** Skip lazy loading. Use only for an image above the fold. */
  priority?: boolean
  rounded?: boolean
}) {
  const a = asset(id)
  if (!a) return null

  const widest = a.widths[a.widths.length - 1] ?? 1000
  const height = Math.round(widest / a.aspect)

  return (
    <picture>
      <source type="image/avif" srcSet={sources(a, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={sources(a, 'webp')} sizes={sizes} />
      <img
        src={`/media/${a.out}-${widest}.jpg`}
        srcSet={a.widths.map((w) => `/media/${a.out}-${w}.jpg ${w}w`).join(', ')}
        sizes={sizes}
        width={widest}
        height={height}
        alt={a.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        {...(priority ? { fetchPriority: 'high' as const } : {})}
        className={`h-auto w-full ${rounded ? 'rounded-panel' : ''} ${className}`}
      />
    </picture>
  )
}

/** Photograph with its caption, for the scholarship path and /about. */
export function PhotoFigure({
  id,
  sizes,
  className = '',
  priority = false,
}: {
  id: string
  sizes?: string
  className?: string
  priority?: boolean
}) {
  const a = asset(id)
  if (!a) return null

  return (
    <figure className={className}>
      <Photo id={id} sizes={sizes} priority={priority} />
      {a.caption && (
        <figcaption className="mt-3 border-t border-hairline pt-2.5 text-caption text-content-muted text-pretty">
          {a.caption}
        </figcaption>
      )}
    </figure>
  )
}
