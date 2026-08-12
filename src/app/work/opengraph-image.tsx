import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/lib/og'

export const dynamic = 'force-static'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Ayomide Abilewa: six projects, documented as case studies'

export default function Image() {
  return ogCard({
    tone: 'engineering',
    eyebrow: 'Projects',
    title: 'Six builds, documented properly',
    subtitle:
      'Problem, approach, architecture, the decisions and what forced them, results, and what each one changed about how I build.',
  })
}
