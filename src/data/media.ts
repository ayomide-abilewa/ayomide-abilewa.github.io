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
  /** Which CV variants may use this image, if any. Currently none: all four CVs
   *  are text-only for ATS parsing. Kept so the rule is explicit. */
  cvUse?: CvVariant[]
}

export const media: MediaAsset[] = [
  {
    id: 'portrait',
    source: 'IMG_20260624_062753.jpg',
    out: 'portrait',
    aspect: 3 / 4,
    widths: [400, 640, 900],
    flip: true,
    alt: 'Ayomide Abilewa in Chevron coveralls, carrying a backpack, in an office corridor before a shift.',
    caption: 'Lagos, June 2026 — start of a rotation day on the electrical and instrumentation team.',
  },
  {
    id: 'cohort-group',
    source: 'IMG-20260714-WA0217.jpg',
    out: 'cohort-group',
    aspect: 4 / 3,
    widths: [640, 1000, 1440],
    alt: 'Seven engineering interns in Chevron coveralls, hard hats and safety glasses standing together in an office.',
    caption:
      'The 2026 facilities engineering intern cohort. Everyone in this photograph is on the same programme; the site work behind it is not shown.',
  },
  {
    id: 'cohort-line',
    source: 'IMG-20260714-WA0209.jpg',
    out: 'cohort-line',
    aspect: 4 / 3,
    widths: [640, 1000, 1440],
    alt: 'The same intern cohort in full personal protective equipment, gathered before a plant walkthrough.',
    caption: 'Full PPE before a walkthrough — hard hat, safety glasses, gloves, steel toe caps.',
  },
]

export function asset(id: string): MediaAsset | undefined {
  return media.find((m) => m.id === id)
}
