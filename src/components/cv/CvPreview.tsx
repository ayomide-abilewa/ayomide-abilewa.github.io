'use client'

import type { ReactNode } from 'react'
import type { CvVariant } from '@/data/types'
import { profile } from '@/data/profile'
import {
  CV_SECTION_ORDER,
  CV_SECTION_TITLES,
  CV_SHOWS_COURSEWORK,
  certificationsForVariant,
  cvBulletsFor,
  experienceForVariant,
  leadershipForVariant,
  projectsForVariant,
  skillsForVariant,
  type CvSection,
} from '@/lib/select'

/**
 * On-screen rendering of a generated CV.
 *
 * The point of this component is fidelity: it walks `CV_SECTION_ORDER` and pulls
 * bullets through `cvBulletsFor`, exactly as `scripts/build-cvs.tsx` does. What you
 * read here is what the PDF and the DOCX contain, in the same order, so the
 * preview cannot quietly disagree with the file you download. That includes the
 * cuts — the documents print the strongest three bullets per entry rather than every
 * bullet tagged for the variant, and so does this. The complete set is on /about
 * and the project pages, which have the room a two-page document does not.
 *
 * That extends to the typesetting, and the register changed: the documents are now
 * set in the traditional academic manner — serif throughout, the name centred in
 * caps, Title Case section headings over a rule *beneath* them, the organisation on
 * its own italic indented line under the role, dates in a right-hand column at the
 * same size as the title they sit beside, and no accent colour anywhere. This
 * mirrors all of it. The earlier version of both put a hairline above a small
 * letterspaced accent-coloured label and appended the organisation to the role with
 * a middot; that setting is what every résumé builder ships as its default, and it
 * was the single loudest reason the download read as generated.
 *
 * Two deliberate differences from the documents. Links render as their plain
 * `cvText`, because that is what an ATS parser sees in the generated files and
 * showing markup here would flatter them. And there is no tagline under the name,
 * because the documents no longer print one — a role line between the name and the
 * contact details is a web convention, not a CV one.
 *
 * It is a single column with no graphics for the same reason the documents are:
 * everything an automated parser needs is text in reading order.
 */

/** Indent for everything subordinate to an entry head — the PDF's `INDENT`. */
const INDENT = 'pl-3.5'

function SectionTitle({ children }: { children: string }) {
  return (
    <h3 className="mb-2.5 border-b border-content/60 pb-1 text-caption font-semibold text-content">
      {children}
    </h3>
  )
}

/**
 * Role line and the date opposite it, the standard CV entry head.
 *
 * The date is set at the same size as the title rather than reduced and
 * monospaced, which is not only how the documents set it but *why*: two runs of
 * different sizes in one flex row land on different baselines, and a page of dates
 * each sitting a point and a half above its own title is one of those flaws nobody
 * can name and everybody registers.
 */
function EntryHead({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-0.5">
      <p className="min-w-0 text-caption font-semibold text-content">{title}</p>
      {meta && <p className="shrink-0 text-caption text-content-muted">{meta}</p>}
    </div>
  )
}

/** Organisation, institution or toolchain: its own line, italic, indented. */
function Org({ children }: { children: string }) {
  return <p className={`${INDENT} text-caption italic text-content-muted`}>{children}</p>
}

/** Repo, coursework, or a one-line summary. A step down from the bullets. */
function Detail({ children }: { children: ReactNode }) {
  return <p className={`mt-1 ${INDENT} text-micro leading-relaxed text-content-faint`}>{children}</p>
}

function Bullets({ items }: { items: string[] }) {
  if (items.length === 0) return null
  return (
    <ul className={`mt-1 ${INDENT} space-y-1`}>
      {items.map((item) => (
        <li key={item} className="relative pl-4 text-caption leading-relaxed text-content-muted">
          <span aria-hidden="true" className="absolute left-0 top-0 text-content">
            •
          </span>
          {item}
        </li>
      ))}
    </ul>
  )
}

function Body({ variant, section }: { variant: CvVariant; section: CvSection }) {
  switch (section) {
    case 'summary':
      return (
        <p className="text-caption leading-relaxed text-content-muted text-pretty">
          {profile.summaries[variant]}
        </p>
      )

    case 'education':
      return (
        <div className="space-y-3.5">
          {profile.education.map((education) => (
            <div key={`${education.institution}-${education.start}`}>
              <EntryHead
                title={`${education.degree} ${education.field}`}
                meta={`${education.start}–${education.end}${education.expected ? ' (expected)' : ''}`}
              />
              <Org>{`${education.institution}, ${education.location}`}</Org>
              <Bullets items={cvBulletsFor(education, variant)} />
              {CV_SHOWS_COURSEWORK[variant] && education.coursework.length > 0 && (
                <Detail>Relevant coursework: {education.coursework.join(', ')}.</Detail>
              )}
            </div>
          ))}
        </div>
      )

    case 'skills':
      // Hanging indent, matching the documents: the label starts at the margin and
      // a wrapped line clears it, so a continuation cannot read as a group whose
      // label went missing.
      return (
        <dl className="space-y-1">
          {skillsForVariant(variant).map((group) => (
            <div key={group.label} className="pl-3.5 -indent-3.5 text-caption leading-relaxed">
              <dt className="inline italic text-content-muted">{group.label}: </dt>
              <dd className="inline text-content-muted">{group.items.join(', ')}</dd>
            </div>
          ))}
        </dl>
      )

    case 'experience':
      return (
        <div className="space-y-3.5">
          {experienceForVariant(variant).map((item) => (
            <div key={item.id}>
              <EntryHead title={item.role} meta={`${item.start}–${item.end}`} />
              <Org>{`${item.organisation}, ${item.location}`}</Org>
              <Bullets items={cvBulletsFor(item, variant)} />
            </div>
          ))}
        </div>
      )

    case 'projects':
      return (
        <div className="space-y-3.5">
          {projectsForVariant(variant).map((project) => (
            <div key={project.slug}>
              <EntryHead title={project.name} meta={project.period} />
              <Org>{project.technologies.slice(0, 4).join(', ')}</Org>
              <Bullets items={cvBulletsFor(project, variant)} />
              {project.repo && <Detail>{project.repo.replace('https://', '')}</Detail>}
            </div>
          ))}
        </div>
      )

    case 'research-interests':
      // Bullets in the documents, so bullets here.
      return (
        <ul className="space-y-1">
          {profile.researchInterests.map((interest) => (
            <li
              key={interest.id}
              className="relative pl-4 text-caption leading-relaxed text-content-muted"
            >
              <span aria-hidden="true" className="absolute left-0 top-0 text-content">
                •
              </span>
              <span className="font-semibold text-content">{interest.label}: </span>
              {interest.description}
            </li>
          ))}
        </ul>
      )

    case 'leadership':
      return (
        <div className="space-y-3.5">
          {leadershipForVariant(variant).map((item) => {
            const bullets = cvBulletsFor(item, variant)
            return (
              <div key={item.id}>
                <EntryHead title={item.role} meta={`${item.start}–${item.end}`} />
                <Org>{item.organisation}</Org>
                {bullets.length > 0 ? (
                  <Bullets items={bullets} />
                ) : (
                  <Detail>{item.summary}</Detail>
                )}
              </div>
            )
          })}
        </div>
      )

    case 'certifications':
      // Entry heads, like every other dated thing in the document, so the year
      // lands in the column the reader is already scanning. The issuer rides on
      // the title rather than taking an italic line of its own — five three-line
      // stacks at the foot of the page is a section, not a list.
      return (
        <div className="space-y-1.5">
          {certificationsForVariant(variant).map((item) => (
            <EntryHead
              key={`${item.name}-${item.year}`}
              title={`${item.name}, ${item.issuer}`}
              meta={item.year}
            />
          ))}
        </div>
      )
  }
}

export function CvPreview({ variant }: { variant: CvVariant }) {
  const { identity } = profile
  const titles = CV_SECTION_TITLES[variant]

  return (
    <article
      aria-label={`Preview of the ${variant} CV`}
      className="rounded-panel border border-hairline bg-surface p-6 font-serif sm:p-9"
    >
      {/* Document head. Exactly the fields the generated files carry, in order. */}
      <header className="text-center">
        <h2 className="text-h3 font-semibold uppercase text-content">{identity.name}</h2>
        <p className="mt-2 text-micro leading-relaxed text-content-muted">
          {identity.location} · {identity.email} · {identity.phone}
          <br />
          {identity.links.linkedin.cvText} · {identity.links.github.cvText} ·{' '}
          {identity.links.site.cvText}
        </p>
      </header>

      <div className="mt-7 space-y-6">
        {CV_SECTION_ORDER[variant].map((section) => (
          <section key={section} aria-label={titles[section] ?? section}>
            <SectionTitle>{titles[section] ?? section}</SectionTitle>
            <Body variant={variant} section={section} />
          </section>
        ))}
      </div>

      <p className="mt-8 border-t border-hairline pt-3 font-sans text-micro leading-relaxed text-content-faint">
        This is the document, not a summary of it. The PDF and Word downloads carry the same text in
        the same order.
      </p>
    </article>
  )
}
