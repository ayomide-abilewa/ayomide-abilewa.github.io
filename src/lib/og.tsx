import { readFileSync } from 'node:fs'
import path from 'node:path'
import { ImageResponse } from 'next/og'
import { tracePath } from '@/lib/trace'
import { allProjectSlugs, projectBySlug, projectPeriod } from '@/lib/select'
import { cap, facts } from '@/lib/facts'

/**
 * Social cards.
 *
 * Rendered at build time by the route handler in app/og/[card], which exports
 * each card as /og/<name>.png. Next's `opengraph-image` convention was used
 * before, but it exports files with no extension and GitHub Pages serves those
 * as application/octet-stream, which LinkedIn and X refuse to render.
 *
 * The graticule and the settling trace are drawn as an inline SVG data URI. Type
 * is IBM Plex, the site's own face, read from WOFF files committed beside this
 * module (Satori cannot read WOFF2 or system fonts), so a build machine without
 * the font still renders the same card. Mono for the eyebrow and footer, sans for
 * the headline and the supporting line, as on the site.
 */

const FONT_DIR = path.join(process.cwd(), 'src/lib/og-fonts')
const font = (file: string) => readFileSync(path.join(FONT_DIR, file))

const FONTS = [
  { name: 'Plex Sans', data: font('ibm-plex-sans-latin-400-normal.woff'), weight: 400, style: 'normal' },
  { name: 'Plex Sans', data: font('ibm-plex-sans-latin-500-normal.woff'), weight: 500, style: 'normal' },
  { name: 'Plex Mono', data: font('ibm-plex-mono-latin-400-normal.woff'), weight: 400, style: 'normal' },
] as const

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
 * The mode tokens from globals.css, resolved to hex. `grid` is the hairline mixed
 * halfway into the surface, so the graticule stays behind the type.
 *
 * Duplicated deliberately: Satori cannot read CSS custom properties, and parsing
 * the stylesheet at build time would be more fragile than six lines per mode.
 * Change these whenever the tokens change.
 */
const PALETTES: Record<OgTone, Palette> = {
  engineering: {
    surface: '#0C1E29',
    content: '#F7F5EF',
    muted: '#9ABAC5',
    faint: '#84A6B3',
    accent: '#FBB33A',
    accentAlt: '#62D6E8',
    grid: '#1A3542',
  },
  research: {
    surface: '#F6F9FB',
    content: '#0D171E',
    muted: '#384F5C',
    faint: '#586D7A',
    accent: '#096480',
    accentAlt: '#AA620A',
    grid: '#E0E7EC',
  },
  scholarship: {
    surface: '#F9F1E1',
    content: '#21170F',
    muted: '#594330',
    faint: '#765E46',
    accent: '#B23E12',
    accentAlt: '#5E7628',
    grid: '#EEE0C8',
  },
  everything: {
    surface: '#0C1E29',
    content: '#F7F5EF',
    muted: '#9ABAC5',
    faint: '#84A6B3',
    accent: '#FBB33A',
    accentAlt: '#62D6E8',
    grid: '#1A3542',
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
          fontFamily: 'Plex Sans',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontFamily: 'Plex Mono',
              fontSize: 21,
              letterSpacing: 4,
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
              fontWeight: 500,
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
            fontFamily: 'Plex Mono',
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
    { ...OG_SIZE, fonts: [...FONTS] },
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
      `Teaching electronics since ${facts.teachingSince} alongside the degree. A robotics lab, a plant rotation, a circuit bench: each one turned into a course.`,
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
    title: `${cap(facts.projects)} builds, documented properly`,
    subtitle:
      'Problem, approach, architecture, the decisions and what forced them, results, and what each one changed about how I build.',
    alt: `Ayomide Abilewa: ${facts.projects} projects, documented as case studies`,
  },
  about: {
    tone: 'scholarship',
    eyebrow: 'About',
    title: 'A fire alarm, and everything after it',
    subtitle:
      `${cap(facts.projects)} builds, in order, and what each one taught. The first one taught me that an alarm nobody hears is not finished.`,
    alt: `Ayomide Abilewa: the story behind the ${facts.projects} builds`,
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
    title: `${cap(facts.cvs)} versions of the same facts`,
    subtitle:
      'Technical, research, scholarship and full. Ordered and cut for who is reading. PDF and editable Word.',
    alt: `Ayomide Abilewa: ${facts.cvs} CV versions in PDF and editable Word`,
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
