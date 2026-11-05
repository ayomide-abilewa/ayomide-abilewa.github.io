import { profile } from '@/data/profile'
import { AS_OF, isAhead } from '@/lib/dates'
import { CV_STEM } from '@/lib/select'

/**
 * Facts the prose repeats: counts, years, the graduation line.
 *
 * Derived from profile.ts rather than typed into sentences, so adding a project
 * or crossing into a new year cannot leave "six builds" or "three years" behind
 * on a page nobody thought to reread. Time-relative counts move with AS_OF, and
 * the monthly rebuild keeps that current.
 */

const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']

function word(n: number): string {
  return WORDS[n] ?? String(n)
}

/** "six" → "Six", for the start of a sentence or a heading. */
export function cap(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

const yearOfDate = (value: string) => Number(value.slice(-4))
const asOfYear = Number(AS_OF.slice(0, 4))

/** Start year of a project (by slug), a role or a leadership entry (by id). */
export function startYear(key: string): string {
  const item =
    profile.projects.find((p) => p.slug === key) ??
    profile.experience.find((e) => e.id === key) ??
    profile.leadership.find((l) => l.id === key)
  if (!item) throw new Error(`No project, role or leadership entry "${key}".`)
  return String(yearOfDate(item.start))
}

export const degree = (() => {
  const first = profile.education[0]
  if (!first) throw new Error('profile.education needs the degree as its first entry.')
  return first
})()

const firstBuild = Math.min(...profile.projects.map((p) => yearOfDate(p.start)))
// The roles that count as teaching, for "teaching since".
const teachingSince = Math.min(...['astar', 'zth'].map((id) => Number(startYear(id))))

export const facts = {
  projects: word(profile.projects.length),
  interests: word(profile.researchInterests.length),
  cvs: word(Object.keys(CV_STEM).length),
  universityStart: degree.start,
  graduationYear: degree.end,
  /** "expected 2027" until the year arrives, then just the year. */
  graduation: isAhead(degree.end) ? `expected ${degree.end}` : degree.end,
  firstBuild: String(firstBuild),
  teachingSince: String(teachingSince),
  yearsAtUniversity: word(asOfYear - yearOfDate(degree.start)),
  yearsBuilding: word(asOfYear - firstBuild),
  yearsTeaching: word(asOfYear - teachingSince),
}
