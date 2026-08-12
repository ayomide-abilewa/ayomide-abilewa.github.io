import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/lib/og'

export const dynamic = 'force-static'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Ayomide Abilewa: systems built, and the failure modes they survive'

export default function Image() {
  return ogCard({
    tone: 'engineering',
    eyebrow: 'Engineering',
    title: 'Systems, and what breaks them',
    subtitle:
      'Embedded nodes, computer vision and control loops. Every project here is documented by the failure mode it was built to survive.',
  })
}
