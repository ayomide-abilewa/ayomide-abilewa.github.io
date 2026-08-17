'use client'

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
 * cuts — the documents print the strongest few bullets per entry rather than every
 * bullet tagged for the variant, and so does this. The complete set is on /about
 * and the project pages, which have the room a two-page document does not.
 *
 * That extends to the typesetting. The documents put a rule above each section
 * label rather than a hairline beneath it, set the label small and letterspaced in
 * the accent, colour the role line, and mark bullets with a middot — and so does
 * this. The one thing that cannot carry across is the ink itself: the generated
 * files are set in a fixed teal chosen for paper, and this renders in whichever
 * accent the visitor's mode is using. Same decisions, translated.
 *
 * One deliberate difference from the documents: links are rendered as their plain
 * `cvText`, because that is what an ATS parser sees in the generated files, and
 * showing markup here would flatter them.
 *
 * It is a single column with no graphics for the same reason the documents are:
 * everything an automated parser needs is text in reading order.
 */

function SectionTitle({ children }: { children: string }) {
  return (
    <h3 className="mb-3 border-t border-accent/30 pt-2 font-mono text-micro uppercase tracking-[0.16em] text-accent">
      {children}
    </h3>
  )
}

function Bullets({ items }: { items: string[] }) {
  if (items.length === 0) return null
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map((item) => (
        <li key={item} className="relative pl-4 text-caption leading-relaxed text-content-muted">
          <span aria-hidden="true" className="absolute left-0 top-0 text-accent/70">
            •
          </span>
          {item}
        </li>
      ))}
    </ul>
  )
}

/**
 * Role line and the dates opposite it, the standard CV entry head.
 *
 * The separator and the date range are the same marks `scripts/cv-document.ts`
 * emits — a middot before the subtitle, an unspaced en dash between dates. That is
 * not pedantry: this page tells the visitor the preview is the file, so a preview
 * punctuated differently from the download quietly makes that a lie.
 */
function EntryHead({
  title,
  subtitle,
  meta,
}: {
  title: string
  subtitle?: string
  meta?: string
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-0.5">
      <p className="min-w-0 text-caption font-medium text-content">
        {title}
        {subtitle && <span className="font-normal text-content-muted"> · {subtitle}</span>}
      </p>
      {meta && <p className="font-mono text-micro text-content-faint">{meta}</p>}
    </div>
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
        <div className="space-y-4">
          {profile.education.map((education) => (
            <div key={`${education.institution}-${education.start}`}>
              <EntryHead
                title={`${education.degree} ${education.field}`}
                subtitle={education.institution}
                meta={`${education.start}–${education.end}${education.expected ? ' (expected)' : ''}`}
              />
              <p className="text-caption text-content-faint">{education.location}</p>
              <Bullets items={cvBulletsFor(education, variant)} />
              {CV_SHOWS_COURSEWORK[variant] && education.coursework.length > 0 && (
                <p className="mt-1.5 text-caption leading-relaxed text-content-muted">
                  <span className="text-content">Relevant coursework: </span>
                  {education.coursework.join(', ')}.
                </p>
              )}
            </div>
          ))}
        </div>
      )

    case 'skills':
      return (
        <dl className="space-y-1.5">
          {skillsForVariant(variant).map((group) => (
            <div key={group.label} className="sm:grid sm:grid-cols-[10rem_1fr] sm:gap-x-4">
              <dt className="text-caption font-medium text-content">{group.label}</dt>
              <dd className="text-caption leading-relaxed text-content-muted">
                {group.items.join(', ')}
              </dd>
            </div>
          ))}
        </dl>
      )

    case 'experience':
      return (
        <div className="space-y-4">
          {experienceForVariant(variant).map((item) => (
            <div key={item.id}>
              <EntryHead
                title={item.role}
                subtitle={item.organisation}
                meta={`${item.start}–${item.end}`}
              />
              <p className="text-caption text-content-faint">{item.location}</p>
              <Bullets items={cvBulletsFor(item, variant)} />
            </div>
          ))}
        </div>
      )

    case 'projects':
      return (
        <div className="space-y-4">
          {projectsForVariant(variant).map((project) => (
            <div key={project.slug}>
              <EntryHead
                title={project.name}
                subtitle={project.technologies.slice(0, 4).join(', ')}
                meta={project.period}
              />
              <Bullets items={cvBulletsFor(project, variant)} />
              {project.repo && (
                <p className="mt-1 font-mono text-micro text-content-faint">
                  {project.repo.replace('https://', '')}
                </p>
              )}
            </div>
          ))}
        </div>
      )

    case 'research-interests':
      return (
        <ul className="space-y-1.5">
          {profile.researchInterests.map((interest) => (
            <li key={interest.id} className="text-caption leading-relaxed text-content-muted">
              <span className="font-medium text-content">{interest.label}: </span>
              {interest.description}
            </li>
          ))}
        </ul>
      )

    case 'leadership':
      return (
        <div className="space-y-4">
          {leadershipForVariant(variant).map((item) => {
            const bullets = cvBulletsFor(item, variant)
            return (
              <div key={item.id}>
                <EntryHead
                  title={item.role}
                  subtitle={item.organisation}
                  meta={`${item.start}–${item.end}`}
                />
                {bullets.length > 0 ? (
                  <Bullets items={bullets} />
                ) : (
                  <p className="mt-1 text-caption leading-relaxed text-content-muted">
                    {item.summary}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )

    case 'certifications':
      // Entry heads, like every other dated thing in the document, so the year
      // lands in the column the reader is already scanning.
      return (
        <div className="space-y-2">
          {certificationsForVariant(variant).map((item) => (
            <EntryHead
              key={`${item.name}-${item.year}`}
              title={item.name}
              subtitle={item.issuer}
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
      className="rounded-panel border border-hairline bg-surface p-6 sm:p-9"
    >
      {/* Document head. Exactly the fields the generated files carry. */}
      <header className="border-b-2 border-accent/70 pb-4">
        <h2 className="text-h3 font-medium tracking-tight text-content">{identity.name}</h2>
        <p className="mt-1 text-caption text-accent text-pretty">{identity.title}</p>
        <p className="mt-2.5 font-mono text-micro leading-relaxed text-content-faint">
          {identity.location} · {identity.email} · {identity.phone}
          <br />
          {identity.links.linkedin.cvText} · {identity.links.github.cvText} ·{' '}
          {identity.links.site.cvText}
        </p>
      </header>

      <div className="mt-7 space-y-7">
        {CV_SECTION_ORDER[variant].map((section) => (
          <section key={section} aria-label={titles[section] ?? section}>
            <SectionTitle>{titles[section] ?? section}</SectionTitle>
            <Body variant={variant} section={section} />
          </section>
        ))}
      </div>

      <p className="mt-8 border-t border-hairline pt-3 text-micro leading-relaxed text-content-faint">
        This is the document, not a summary of it. The PDF and Word downloads carry the same text in
        the same order.
      </p>
    </article>
  )
}
