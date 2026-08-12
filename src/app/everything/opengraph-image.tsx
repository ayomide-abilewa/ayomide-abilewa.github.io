import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/lib/og'

export const dynamic = 'force-static'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Ayomide Abilewa: the full portfolio in one pass'

export default function Image() {
  return ogCard({
    tone: 'everything',
    eyebrow: 'Everything',
    title: 'One person, three perspectives',
    subtitle:
      'What I build, what I am curious about, and how I got here. The whole thing in one scroll, in the order it happened.',
  })
}
