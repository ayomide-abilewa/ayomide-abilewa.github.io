import { ImageResponse } from 'next/og'
import { tracePath } from '@/lib/trace'

/**
 * Social cards.
 *
 * Generated at build time by `next build` through Next's `opengraph-image`
 * convention, not by a separate script. That choice matters: a script that has to
 * be run before every build is a script somebody eventually forgets, and a missing
 * OG image is worse than none at all because the tag still points at a 404. This
 * way the cards cannot fall out of step with the data, and there is exactly one
 * command to run.
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

/** Builds one card. Every `opengraph-image.tsx` in the app is a call to this. */
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
