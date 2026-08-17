import { profile } from '../src/data/profile'
import type { CvVariant } from '../src/data/types'
import {
  CV_SECTION_ORDER,
  CV_SECTION_TITLES,
  CV_SHOWS_COURSEWORK,
  CV_STEM,
  certificationsForVariant,
  cvBulletsFor,
  experienceForVariant,
  leadershipForVariant,
  projectsForVariant,
  skillsForVariant,
  type CvSection,
} from '../src/lib/select'

/**
 * The CV as plain data, one step before rendering.
 *
 * Both generators — the PDF and the Word file — consume this and nothing else.
 * That is deliberate: the two documents have to say the same thing, and the only
 * way to guarantee it is to give them a single spine and let them differ purely
 * in typesetting. A bug in one cannot produce a document that disagrees with the
 * other, and neither can silently fall behind `profile.ts`.
 *
 * Everything here is text. No graphics, no columns, no text inside images —
 * that is what makes both outputs ATS-parseable. An applicant
 * tracking system reads a linear stream of strings, so a linear stream of
 * strings is exactly what this builds.
 *
 * What this file does *not* do is print everything it knows. Bullets come through
 * `cvBulletsFor`, which caps each entry at the strongest few; leadership and
 * projects come through their own per-variant limits. That restraint is the
 * difference between a document somebody edited and a report somebody ran: an
 * uncapped generator produces five bullets under every single role, which is a
 * shape no experienced hand ever sets, and which pushed the full CV to three pages.
 * The website carries the complete set instead, where there is room for it.
 */

/** One line of a document: a heading, a paragraph, an entry head, or a bullet. */
export type Line =
  | { kind: 'section'; text: string }
  | { kind: 'paragraph'; text: string }
  /**
   * Role/degree/project line. `meta` sits on the right, tab-aligned.
   *
   * `standalone` marks an entry that nothing hangs off — a certification, where the
   * whole fact is on the one line. It changes two things in the renderers: the gap
   * above it tightens, because a run of dated one-liners should read as a list
   * rather than as five orphaned headings; and it drops "keep with next", which
   * exists to stop a role being separated from its bullets. Five consecutive
   * keep-with-next paragraphs is how Word ends up shunting a whole block onto the
   * following page and leaving a hole behind it.
   */
  | { kind: 'entry'; title: string; subtitle?: string; meta?: string; standalone?: true }
  /** Secondary line under an entry — location, repo, coursework. */
  | { kind: 'detail'; text: string }
  | { kind: 'bullet'; text: string }
  /**
   * A skill group. Label and items stay separate rather than pre-joined into one
   * string, because both renderers need to do two things a plain paragraph cannot:
   * set the label apart from the list it introduces, and hang a wrapped line under
   * it. A continuation landing flush at the left margin sits in the same column as
   * the labels themselves, so "Weighted Boxes Fusion, OpenCV" reads as a seventh
   * skill group with a missing label instead of as the tail of the sixth.
   *
   * The indent is a small fixed hanging indent, not a label column: the labels run
   * from "Tools" to "Instrumentation and Control", and a column wide enough for the
   * longest would spend a third of the measure on white space for the shortest.
   */
  | { kind: 'skills'; label: string; items: string }

export type CvDocument = {
  variant: CvVariant
  /** Filename stem, shared by both formats. */
  stem: string
  /** Document-properties label. Never printed on the page itself. */
  label: string
  name: string
  title: string
  /** Contact line, already assembled: location · email · phone. */
  contact: string
  /** Links line, plain text — ATS parsers handle bare URLs better than markup. */
  links: string
  lines: Line[]
}

/** For PDF/Word document properties, so a downloaded file identifies itself. */
const LABEL: Record<CvVariant, string> = {
  technical: 'Technical CV',
  research: 'Academic CV',
  scholarship: 'Scholarship CV',
  general: 'Curriculum Vitae',
}

/**
 * A date range, en dash and no spaces: "2021–2027", "2025–Present".
 *
 * Not an em dash. A pair of em dashes bracketing an aside is the most recognisable
 * fingerprint of generated writing, and once a reader has noticed one they start
 * finding them everywhere — including in a date column, where the correct mark has
 * always been an en dash anyway.
 */
function dates(start: string, end: string): string {
  return start === end ? start : `${start}–${end}`
}

function sectionLines(variant: CvVariant, section: CvSection): Line[] {
  const lines: Line[] = []

  switch (section) {
    case 'summary':
      lines.push({ kind: 'paragraph', text: profile.summaries[variant] })
      break

    case 'education':
      for (const item of profile.education) {
        lines.push({
          kind: 'entry',
          title: `${item.degree} ${item.field}`,
          subtitle: item.institution,
          meta: `${dates(item.start, item.end)}${item.expected ? ' (expected)' : ''}`,
        })
        lines.push({ kind: 'detail', text: item.location })
        for (const text of cvBulletsFor(item, variant)) lines.push({ kind: 'bullet', text })
        if (CV_SHOWS_COURSEWORK[variant] && item.coursework.length > 0) {
          lines.push({
            kind: 'detail',
            text: `Relevant coursework: ${item.coursework.join(', ')}.`,
          })
        }
      }
      break

    case 'skills':
      // "Label: a, b, c" — one line per group. Keyword-dense and trivially parsed.
      for (const group of skillsForVariant(variant)) {
        lines.push({ kind: 'skills', label: group.label, items: group.items.join(', ') })
      }
      break

    case 'experience':
      for (const item of experienceForVariant(variant)) {
        lines.push({
          kind: 'entry',
          title: item.role,
          subtitle: item.organisation,
          meta: dates(item.start, item.end),
        })
        lines.push({ kind: 'detail', text: item.location })
        for (const text of cvBulletsFor(item, variant)) lines.push({ kind: 'bullet', text })
      }
      break

    case 'projects':
      for (const item of projectsForVariant(variant)) {
        lines.push({
          kind: 'entry',
          title: item.name,
          subtitle: item.technologies.slice(0, 4).join(', '),
          meta: item.period,
        })
        for (const text of cvBulletsFor(item, variant)) lines.push({ kind: 'bullet', text })
        // The repo is evidence, so it goes in. Absent where none exists — the
        // pipe anomaly work has no public repository and must not imply one.
        if (item.repo) {
          lines.push({ kind: 'detail', text: item.repo.replace('https://', '') })
        }
      }
      break

    case 'research-interests':
      // Colon, not a full stop. The descriptions are elaborations of the label,
      // not new sentences, and "Detection under degraded conditions. How to keep
      // precision steady..." reads as two fragments where one idea was intended.
      for (const interest of profile.researchInterests) {
        lines.push({ kind: 'bullet', text: `${interest.label}: ${interest.description}` })
      }
      break

    case 'leadership':
      for (const item of leadershipForVariant(variant)) {
        lines.push({
          kind: 'entry',
          title: item.role,
          subtitle: item.organisation,
          meta: dates(item.start, item.end),
        })
        const bullets = cvBulletsFor(item, variant)
        if (bullets.length > 0) {
          for (const text of bullets) lines.push({ kind: 'bullet', text })
        } else {
          lines.push({ kind: 'detail', text: item.summary })
        }
      }
      break

    case 'certifications':
      // Entries, not bullets. The year belongs in the same right-hand column the
      // reader has already been scanning for every degree and every role — a
      // certification list that abandons that column for "Name. Issuer, Year."
      // sentences is a different document glued onto the end of this one.
      for (const item of certificationsForVariant(variant)) {
        lines.push({
          kind: 'entry',
          title: item.name,
          subtitle: item.issuer,
          meta: item.year,
          standalone: true,
        })
      }
      break
  }

  return lines
}

/**
 * Assemble one variant.
 *
 * Section order, section titles, project count, bullet selection and whether
 * coursework appears all come from `src/lib/select.ts` — the same module the
 * website reads. That is what makes the four documents genuinely different
 * rather than four copies with different headings, and it is why the preview on
 * /cv cannot disagree with the file you download.
 */
export function buildDocument(variant: CvVariant): CvDocument {
  const { identity } = profile
  const titles = CV_SECTION_TITLES[variant]
  const lines: Line[] = []

  for (const section of CV_SECTION_ORDER[variant]) {
    const body = sectionLines(variant, section)
    if (body.length === 0) continue
    lines.push({ kind: 'section', text: titles[section] ?? section })
    lines.push(...body)
  }

  return {
    variant,
    stem: CV_STEM[variant],
    label: LABEL[variant],
    name: identity.name,
    title: identity.title,
    contact: [identity.location, identity.email, identity.phone].join('  ·  '),
    links: [identity.links.linkedin, identity.links.github, identity.links.site]
      .map((link) => link.cvText ?? link.href)
      .join('  ·  '),
    lines,
  }
}
