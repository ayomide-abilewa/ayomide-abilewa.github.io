import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from '@/lib/og'

export const dynamic = 'force-static'

/** Default social card, used by `/` and inherited anywhere without its own. */
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Ayomide Abilewa: embedded systems and instrumentation'

export default function Image() {
  return ogCard({
    tone: 'engineering',
    eyebrow: 'Embedded systems · Instrumentation',
    title: 'Ayomide Abilewa',
    subtitle:
      'I build sensing and detection systems designed for the conditions that break them: poor light, no network, unreliable input.',
  })
}
