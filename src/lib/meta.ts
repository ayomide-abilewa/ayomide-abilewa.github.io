import type { Metadata } from 'next'
import { ogImage } from '@/lib/og'

/**
 * Per-route social metadata.
 *
 * A route's `openGraph` and `twitter` objects replace the layout's rather than
 * merging with them, so every route goes through this to keep the image, the
 * card type and the site name on each one.
 */
export function socialMetadata({
  title,
  description,
  path,
  card,
  type = 'website',
}: {
  title: string
  description: string
  path: string
  /** Name of the card in lib/og.tsx. */
  card: string
  type?: 'website' | 'article'
}): Pick<Metadata, 'openGraph' | 'twitter'> {
  const image = ogImage(card)
  return {
    openGraph: {
      type,
      siteName: 'Ayomide Abilewa',
      locale: 'en_GB',
      title,
      description,
      url: path,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: image.url, alt: image.alt }],
    },
  }
}
