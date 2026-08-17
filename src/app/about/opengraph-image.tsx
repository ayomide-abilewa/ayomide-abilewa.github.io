import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/lib/og'

export const dynamic = 'force-static'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Ayomide Abilewa: the story behind the six builds'

export default function Image() {
  return ogCard({
    tone: 'scholarship',
    eyebrow: 'About',
    title: 'A fire alarm, and everything after it',
    subtitle:
      'Six builds, in order, and what each one taught. The first one taught me that an alarm nobody hears is not finished.',
  })
}
