import { ImageResponse } from 'next/og'
import { tracePath } from '@/lib/trace'
import { allProjectSlugs, projectBySlug, projectPeriod } from '@/lib/select'

/**
 * Social cards.
 *
 * Rendered at build time by the route handler in app/og/[card], which exports
 * each card as /og/<name>.png. Next's `opengraph-image` convention was used
 * before, but it exports files with no extension and GitHub Pages serves those
 * as application/octet-stream, which LinkedIn and X refuse to render.
 *
 * The brand carries on geometry rather than type. The graticule and the settling
 * trace are drawn as an inline SVG data URI, so the recognisable part of the card
 * needs no font at all — which also sidesteps the usual failure where a build
 * machine lacks the typeface and silently renders a card in something else. Text
 * is kept to a few lines at sizes that read on a phone-sized preview, and the
 * hierarchy is carried by size, colour and letterspacing rather than by weight,
 * since the bundled fallback face cannot be relied on for a true bold.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const
export const OG_CONTENT_TYPE = 'image/png'

/** Which path's palette a card wears. Mirrors the mode tokens in globals.css. */
export type OgTone = 'engineering' | 'research' | 'scholarship' | 'everything'

type Palette = {
  surface: string
  content: string
  muted: string
  faint: string
  accent: string
  accentAlt: string
  grid: string
}

/**
 * The same three-colour mixes the site uses, resolved to hex.
 *
 * Duplicated from globals.css deliberately: Satori cannot read CSS custom
 * properties, and the alternative — parsing the stylesheet at build time — would
 * be far more fragile than five lines of hex per mode.
 */
const PALETTES: Record<OgTone, Palette> = {
  engineering: {
    surface: '#070B0D',
    content: '#F5F1EA',
    muted: '#97A9AF',
    faint: '#6E858D',
    accent: '#E09A2E',
    accentAlt: '#4E96A6',
    grid: '#16232A',
  },
  research: {
    surface: '#FBF9F5',
    content: '#0D1417',
    muted: '#35474F',
    faint: '#5C7178',
    accent: '#2E7488',
    accentAlt: '#A8762E',
    grid: '#DFD9CE',
  },
  scholarship: {
    surface: '#F5F1EA',
    content: '#171310',
    muted: '#4A3E35',
    faint: '#7A6857',
    accent: '#A84E28',
    accentAlt: '#5C6B3C',
    grid: '#DDD3C2',
  },
  everything: {
    surface: '#070B0D',
    content: '#F5F1EA',
    muted: '#97A9AF',
    faint: '#6E858D',
    accent: '#E09A2E',
    accentAlt: '#4E96A6',
    grid: '#16232A',
  },
}

/**
 * Graticule, reference line and settling trace, as one SVG data URI.
 *
 * `tracePath` is the same pure function the site and the favicon use, so the curve
 * on a shared link is the identical response, not a redrawn approximation.
 */
function graphic(p: Palette, w: number, h: number): string {
  const verticals: string[] = []
  for (let x = 0; x <= w; x += 48) {
    verticals.push(`M ${x} 0 L ${x} ${h}`)
  }
  const horizontals: string[] = []
  for (let y = 0; y <= h; y += 40) {
    horizontals.push(`M 0 ${y} L ${w} ${y}`)
  }

  // Matches tracePath's own settled value, so the dashed reference sits exactly
  // where the curve comes to rest instead of near it.
  const settleY = (h * 0.5).toFixed(2)

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`,
    `<path d="${verticals.join(' ')} ${horizontals.join(' ')}" stroke="${p.grid}" stroke-width="1" fill="none"/>`,
    `<path d="M 0 ${settleY} L ${w} ${settleY}" stroke="${p.accentAlt}" stroke-width="2" stroke-dasharray="10 8" fill="none" opacity="0.75"/>`,
    `<path d="${tracePath(w, h)}" stroke="${p.accent}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    `</svg>`,
  ].join('')

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export type OgCard = {
  tone: OgTone
  /** Small uppercase label. Says what kind of page this is. */
  eyebrow: string
  /** The headline. Kept short enough to hold at 60px on two lines. */
  title: string
  /** One supporting line. Truncated by the layout rather than by ellipsis. */
  subtitle: string
}

const GRAPHIC_WIDTH = 1056
const GRAPHIC_HEIGHT = 168

/** Builds one card. */
export function ogCard({ tone, eyebrow, title, subtitle }: OgCard): ImageResponse {
  const p = PALETTES[tone]

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          backgroundColor: p.surface,
          padding: '64px 72px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 21,
              letterSpacing: 5,
              color: p.accent,
            }}
          >
            {eyebrow.toUpperCase()}
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: 22,
              fontSize: 62,
              lineHeight: 1.08,
              letterSpacing: -1.5,
              color: p.content,
              maxWidth: 940,
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: 24,
              fontSize: 27,
              lineHeight: 1.42,
              color: p.muted,
              maxWidth: 900,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders
            this to a raster at build time; next/image has no role here. */}
        <img
          src={graphic(p, GRAPHIC_WIDTH, GRAPHIC_HEIGHT)}
          width={GRAPHIC_WIDTH}
          height={GRAPHIC_HEIGHT}
          alt=""
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 21,
            letterSpacing: 1,
            color: p.faint,
          }}
        >
          <div style={{ display: 'flex' }}>ayomide-abilewa.github.io</div>
          <div style={{ display: 'flex' }}>Ayomide Abilewa</div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  )
}

type CardDef = OgCard & { alt: string }

const PAGE_CARDS = {
  home: {
    tone: 'engineering',
    eyebrow: 'Embedded systems · Instrumentation',
    title: 'Ayomide Abilewa',
    subtitle:
      'I build sensing and detection systems designed for the conditions that break them: poor light, no network, unreliable input.',
    alt: 'Ayomide Abilewa: embedded systems and instrumentation',
  },
  engineering: {
    tone: 'engineering',
    eyebrow: 'Engineering',
    title: 'Systems, and what breaks them',
    subtitle:
      'Embedded nodes, computer vision and control loops. Every project here is documented by the failure mode it was built to survive.',
    alt: 'Ayomide Abilewa: systems built, and the failure modes they survive',
  },
  research: {
    tone: 'research',
    eyebrow: 'Research',
    title: 'Measurement under non-ideal conditions',
    subtitle:
      'Cascaded detection, RGB and edge-enhanced ensembles, multispectral acquisition, and control on real hardware rather than in simulation.',
    alt: 'Ayomide Abilewa: measurement and detection under non-ideal conditions',
  },
  scholarship: {
    tone: 'scholarship',
    eyebrow: 'Scholarship',
    title: 'Whatever I get access to becomes a lesson plan',
    subtitle:
      'Teaching electronics since 2023 alongside the degree. A robotics lab, a plant rotation, a circuit bench: each one turned into a course.',
    alt: 'Ayomide Abilewa: teaching, leadership and the people the work reaches',
  },
  everything: {
    tone: 'everything',
    eyebrow: 'Everything',
    title: 'One person, three perspectives',
    subtitle:
      'What I build, what I am curious about, and how I got here. The whole thing in one scroll, in the order it happened.',
    alt: 'Ayomide Abilewa: the full portfolio in one pass',
  },
  work: {
    tone: 'engineering',
    eyebrow: 'Projects',
    title: 'Six builds, documented properly',
    subtitle:
      'Problem, approach, architecture, the decisions and what forced them, results, and what each one changed about how I build.',
    alt: 'Ayomide Abilewa: six projects, documented as case studies',
  },
  about: {
    tone: 'scholarship',
    eyebrow: 'About',
    title: 'A fire alarm, and everything after it',
    subtitle:
      'Six builds, in order, and what each one taught. The first one taught me that an alarm nobody hears is not finished.',
    alt: 'Ayomide Abilewa: the story behind the six builds',
  },
  contact: {
    tone: 'engineering',
    eyebrow: 'Contact',
    title: 'Tell me what you are building',
    subtitle:
      'Open to engineering roles, research collaborations, scholarship conversations and teaching. Email and phone, no forms.',
    alt: 'Get in touch with Ayomide Abilewa',
  },
  cv: {
    tone: 'research',
    eyebrow: 'CV',
    title: 'Four versions of the same facts',
    subtitle:
      'Technical, research, scholarship and full. Ordered and cut for who is reading. PDF and editable Word.',
    alt: 'Ayomide Abilewa: four CV versions in PDF and editable Word',
  },
} satisfies Record<string, CardDef>

export type PageCard = keyof typeof PAGE_CARDS

function projectCard(slug: string): CardDef | undefined {
  const project = projectBySlug(slug)
  if (!project) return undefined
  return {
    tone: 'engineering',
    eyebrow: `Case study · ${projectPeriod(project)}`,
    title: project.name,
    subtitle: project.tagline,
    alt: `${project.name}: case study by Ayomide Abilewa`,
  }
}

/** Every card the build exports, keyed by file name without extension. */
export function ogCardNames(): string[] {
  return [...Object.keys(PAGE_CARDS), ...allProjectSlugs().map((slug) => `work-${slug}`)]
}

export function ogCardFor(name: string): CardDef | undefined {
  if (name in PAGE_CARDS) return PAGE_CARDS[name as PageCard]
  return name.startsWith('work-') ? projectCard(name.slice('work-'.length)) : undefined
}

/** The og:image entry for a card, with the size and alt crawlers ask for. */
export function ogImage(name: string) {
  return {
    url: `/og/${name}.png`,
    width: OG_SIZE.width,
    height: OG_SIZE.height,
    type: OG_CONTENT_TYPE,
    alt: ogCardFor(name)?.alt ?? 'Ayomide Abilewa',
  }
}
