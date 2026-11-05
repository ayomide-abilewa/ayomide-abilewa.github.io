import type { VisitorMode } from '@/data/types'
import { cap, facts } from '@/lib/facts'

/**
 * The four doors on the landing page. Built here, on the server, and handed to
 * PathChooser as props, so the counts in the copy come from profile.ts without
 * shipping profile.ts to the landing page's client bundle.
 */

export type Channel = {
  mode: VisitorMode
  href: string
  label: string
  audience: string
  promise: string
}

export const CHANNELS: Channel[] = [
  {
    mode: 'engineering',
    href: '/engineering/',
    label: 'Engineering',
    audience: 'Recruiters · engineers · collaborators',
    promise: 'Architecture, source code, and the failure each decision exists to survive.',
  },
  {
    mode: 'research',
    href: '/research/',
    label: 'Research',
    audience: 'Labs · professors · graduate programmes',
    promise: `${cap(facts.interests)} questions, the method behind the current one, and the coursework underneath.`,
  },
  {
    mode: 'scholarship',
    href: '/scholarship/',
    label: 'Scholarship',
    audience: 'Committees · fellowships · sponsors',
    promise: `${cap(facts.yearsAtUniversity)} years in order, the classes I teach, and who each build was for.`,
  },
  {
    mode: 'everything',
    href: '/everything/',
    label: 'Everything',
    audience: 'No particular agenda',
    promise: `One pass through all of it, ${facts.universityStart} to now.`,
  },
]
