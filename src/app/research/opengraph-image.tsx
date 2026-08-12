import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/lib/og'

export const dynamic = 'force-static'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Ayomide Abilewa: measurement and detection under non-ideal conditions'

export default function Image() {
  return ogCard({
    tone: 'research',
    eyebrow: 'Research',
    title: 'Measurement under non-ideal conditions',
    subtitle:
      'Cascaded detection, RGB and edge-enhanced ensembles, multispectral acquisition, and control on real hardware rather than in simulation.',
  })
}
