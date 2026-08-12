import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/lib/og'

export const dynamic = 'force-static'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Ayomide Abilewa: four tailored CV versions in PDF and editable Word'

export default function Image() {
  return ogCard({
    tone: 'research',
    eyebrow: 'CV',
    title: 'Four versions, one source of truth',
    subtitle:
      'Technical, research, scholarship and full. Same verified facts, reordered and reselected for who is reading. PDF and editable Word.',
  })
}
