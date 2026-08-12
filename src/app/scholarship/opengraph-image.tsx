import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/lib/og'

export const dynamic = 'force-static'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Ayomide Abilewa: teaching, leadership and the people the work reaches'

export default function Image() {
  return ogCard({
    tone: 'scholarship',
    eyebrow: 'Scholarship',
    title: 'Whatever I get access to becomes a lesson plan',
    subtitle:
      'Teaching electronics since 2023 alongside the degree. A robotics lab, a plant rotation, a circuit bench: each one turned into a course.',
  })
}
