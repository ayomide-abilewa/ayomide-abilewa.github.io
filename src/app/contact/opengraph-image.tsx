import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/lib/og'

export const dynamic = 'force-static'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Get in touch with Ayomide Abilewa'

export default function Image() {
  return ogCard({
    tone: 'engineering',
    eyebrow: 'Contact',
    title: 'Tell me what you are building',
    subtitle:
      'Open to engineering roles, research collaborations, scholarship conversations and teaching. Email and phone, no forms.',
  })
}
