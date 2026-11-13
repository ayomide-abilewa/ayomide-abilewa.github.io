import type { CvVariant } from './types'

/**
 * Image manifest.
 *
 * Photography on this site is limited and deliberate. Two constraints shape it:
 *
 * 1. **Confidentiality.** My internship photographs include control system
 *    cabinets, DCS and safety-system racks, switchgear and field equipment. None
 *    of that is published here. Only cohort and personal photographs are used —
 *    no identifiable equipment, racks or panels. If that changes with my
 *    supervisor's clearance, assets get added to this file and nowhere else.
 *
 * 2. **Honesty.** There is no stock photography and no generated imagery. Where a
 *    project has no photograph, it gets a diagram built from its real
 *    specification instead — see `architecture` in profile.ts.
 *
 * `scripts/build-images.ts` reads this file, resizes the camera originals from
 * ../Pictures and writes AVIF, WebP and JPEG at each listed width. Static export
 * disables Next's image optimizer, so the work happens at build time here.
 */

export type MediaAsset = {
  id: string
  /** Filename inside the Pictures folder beside the site directory. */
  source: string
  /** Output basename under public/media. */
  out: string
  /** Intrinsic aspect ratio of the *exported* image. */
  aspect: number
  /** Widths to emit, largest last. */
  widths: number[]
  alt: string
  caption?: string
  /**
   * Mirror the image horizontally on export. Used for uncorrected front-camera
   * photographs, where text and logos come out reversed — flipping restores the
   * scene as it actually was.
   */
  flip?: boolean
  /** Region of the (rotated) original to keep, in source pixels, before resizing. */
  crop?: { left: number; top: number; width: number; height: number }
  /** Which CV variants may use this image, if any. Currently none: all four CVs
   *  are text-only for ATS parsing. Kept so the rule is explicit. */
  cvUse?: CvVariant[]
}

export const media: MediaAsset[] = [
  {
    id: 'portrait',
    source: 'portrait-suit-2026-09.jpg',
    out: 'portrait',
    aspect: 3 / 4,
    widths: [400, 640, 900],
    crop: { left: 330, top: 420, width: 1200, height: 1600 },
    alt: 'Ayomide Abilewa in a navy suit and tie, hands in pockets, standing against a tiled wall.',
    caption: 'Lagos, September 2026.',
  },
  {
    id: 'cohort-group',
    source: 'cohort-ppe-2026.jpg',
    out: 'cohort-group',
    aspect: 4 / 3,
    widths: [640, 1000, 1440],
    alt: 'Seven Chevron Nigeria interns in navy coveralls, blue hard hats and safety glasses standing together in an office.',
    caption: 'Intern cohort in full PPE, 2026. People only; the site work is not shown.',
  },
  {
    id: 'cohort-line',
    source: 'interns-outside-2026-09.jpg',
    out: 'cohort-line',
    aspect: 16 / 9,
    widths: [640, 1000],
    crop: { left: 0, top: 30, width: 1080, height: 608 },
    alt: 'A large group of Chevron Nigeria interns in office wear standing outside an office building.',
    caption: 'Chevron Nigeria interns outside the office, September 2026.',
  },
]

export function asset(id: string): MediaAsset | undefined {
  return media.find((m) => m.id === id)
}
