/**
 * Dates in profile.ts are written "2024" or "Apr 2026". An entry with no `end`
 * is ongoing. Whether something is current, or a date still ahead, is decided
 * against AS_OF, the build date: next.config.ts inlines it into the server and
 * client bundles alike, so both render the same answer. The CV script runs
 * outside Next and falls back to the day it runs.
 */

export const AS_OF: string =
  process.env.NEXT_PUBLIC_BUILD_DATE ?? new Date().toISOString().slice(0, 10)

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

type Parsed = { year: number; month?: number }

function parse(value: string): Parsed {
  const match = /^(?:([A-Z][a-z]{2}) )?(\d{4})$/.exec(value.trim())
  if (!match) throw new Error(`Unrecognised date "${value}". Use "2024" or "Apr 2026".`)
  const month = match[1] === undefined ? undefined : MONTHS.indexOf(match[1])
  if (month === -1) throw new Error(`Unrecognised month in "${value}".`)
  return { year: Number(match[2]), month }
}

/** First and last day covered by a date, as yyyy-mm-dd, so "2024" spans the year. */
function bounds(value: string): { first: string; last: string } {
  const { year, month } = parse(value)
  if (month === undefined) return { first: `${year}-01-01`, last: `${year}-12-31` }
  const mm = String(month + 1).padStart(2, '0')
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  return { first: `${year}-${mm}-01`, last: `${year}-${mm}-${lastDay}` }
}

/** Ongoing: no end date, or one that has not passed yet. */
export function isCurrent(item: { start: string; end?: string }, asOf = AS_OF): boolean {
  return bounds(item.start).first <= asOf && (!item.end || bounds(item.end).last >= asOf)
}

/** Sortable form of an end date; ongoing sorts after any date. */
export function endKey(end: string | undefined): string {
  return end === undefined ? '9999-12-31' : bounds(end).last
}

/** True for a date still ahead, such as an expected graduation. */
export function isAhead(value: string, asOf = AS_OF): boolean {
  return bounds(value).first > asOf
}

/**
 * A date range for display.
 *
 * `compact` is the CV convention: en dash, no spaces, shared year written once
 * ("Feb–Mar 2026", "2023–Present"). `spaced` is what the site's experience
 * column has always shown ("Apr 2026 — Sep 2026").
 */
export function formatRange(
  start: string,
  end: string | undefined,
  style: 'compact' | 'spaced' = 'compact',
): string {
  const sep = style === 'compact' ? '–' : ' — '
  parse(start)
  if (end === undefined) return `${start}${sep}Present`
  if (end === start) return start
  if (style === 'compact') {
    const a = parse(start)
    const b = parse(end)
    if (a.year === b.year && a.month !== undefined && b.month !== undefined) {
      return `${MONTHS[a.month]}–${MONTHS[b.month]} ${a.year}`
    }
  }
  return `${start}${sep}${end}`
}
