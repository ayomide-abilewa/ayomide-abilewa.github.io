'use client'

import { useEffect, useState } from 'react'
import { CV_FOR_MODE, CV_VARIANTS, type CvVariant } from '@/data/types'
import { profile } from '@/data/profile'
import { useMode, MODE_LABELS } from '@/lib/mode'
import { track } from '@/lib/analytics'
import {
  CV_DESCRIPTIONS,
  CV_SECTION_SHORT,
  cvFile,
  cvShape,
  type CvSection,
} from '@/lib/select'
import { Section } from '@/components/section/Section'
import { CtaRow } from '@/components/section/Cta'
import { SettledTrace } from '@/components/brand/SettledTrace'
import { Reveal } from '@/components/motion/Reveal'
import { CvPreview } from '@/components/cv/CvPreview'

/**
 * The CV page.
 *
 * Four documents from one data source. The tab strip picks a variant and the
 * preview below is built by walking that variant's real section order and
 * pulling its tagged bullets — the same two functions the generator uses — so
 * the page cannot claim a structure the file does not have.
 *
 * The comparison table exists because "tailored" is a claim, and a claim about
 * four downloadable files should be checkable in the browser. Every number in it
 * is counted from the selection functions, not typed in.
 *
 * What deliberately does not happen: no variant gets a fact the others are
 * denied. Selection and ordering differ; the underlying statements are the same
 * verified set.
 */

/** The one line that explains why four files exist rather than one. */
const WHY =
  'Same verified facts in all four. What changes is which of them lead, which section comes first, how much detail each carries, and how long the document runs.'

function VariantTabs({
  active,
  onSelect,
  recommended,
}: {
  active: CvVariant
  onSelect: (variant: CvVariant) => void
  recommended: CvVariant
}) {
  return (
    <div
      role="tablist"
      aria-label="CV versions"
      className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4"
    >
      {CV_VARIANTS.map((variant) => {
        const selected = variant === active
        return (
          <button
            key={variant}
            type="button"
            role="tab"
            id={`cv-tab-${variant}`}
            aria-selected={selected}
            aria-controls={`cv-panel-${variant}`}
            onClick={() => onSelect(variant)}
            className={`rounded-panel border p-4 text-left transition-colors ${
              selected
                ? 'border-accent bg-surface-sunken/60'
                : 'border-hairline hover:border-accent/60'
            }`}
          >
            <span className="flex items-baseline justify-between gap-3">
              <span
                className={`text-caption font-medium ${selected ? 'text-accent' : 'text-content'}`}
              >
                {CV_DESCRIPTIONS[variant].title}
              </span>
              {variant === recommended && (
                <span className="font-mono text-micro uppercase tracking-[0.12em] text-content-faint">
                  Suggested
                </span>
              )}
            </span>
            <span className="mt-1.5 block text-caption leading-relaxed text-content-muted text-pretty">
              {CV_DESCRIPTIONS[variant].bestFor}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/**
 * Structural comparison. Section order is the interesting column — it is the
 * part of tailoring that a reader can verify at a glance.
 */
function ComparisonTable({ active }: { active: CvVariant }) {
  const shapes = CV_VARIANTS.map((variant) => ({ variant, shape: cvShape(variant) }))

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[46rem] border-collapse text-left">
        <caption className="sr-only">
          How the four CV versions differ in section order, length and content selection
        </caption>
        <thead>
          <tr className="border-b border-hairline">
            <th scope="col" className="eyebrow py-2.5 pr-4 font-normal">
              Version
            </th>
            <th scope="col" className="eyebrow py-2.5 pr-4 font-normal">
              Section order
            </th>
            <th scope="col" className="eyebrow py-2.5 pr-4 font-normal">
              Projects
            </th>
            <th scope="col" className="eyebrow py-2.5 pr-4 font-normal">
              Bullets
            </th>
            <th scope="col" className="eyebrow py-2.5 font-normal">
              Coursework
            </th>
          </tr>
        </thead>
        <tbody>
          {shapes.map(({ variant, shape }) => (
            <tr
              key={variant}
              className="border-b border-hairline align-top"
              {...(variant === active ? { 'data-active': 'true' } : {})}
            >
              <th scope="row" className="py-3.5 pr-4 text-caption font-medium text-content">
                {CV_DESCRIPTIONS[variant].title}
              </th>
              <td className="py-3.5 pr-4">
                <ol className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
                  {shape.sections.map((section: CvSection, i) => (
                    <li key={section} className="flex items-baseline gap-1.5">
                      <span
                        className={`text-caption ${i === 0 ? 'text-accent' : 'text-content-muted'}`}
                      >
                        {CV_SECTION_SHORT[section]}
                      </span>
                      {i < shape.sections.length - 1 && (
                        <span aria-hidden="true" className="text-content-faint">
                          ›
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </td>
              <td className="py-3.5 pr-4 font-mono text-micro text-content-muted">
                {shape.projects}
              </td>
              <td className="py-3.5 pr-4 font-mono text-micro text-content-muted">
                {shape.bullets}
              </td>
              <td className="py-3.5 font-mono text-micro text-content-muted">
                {shape.coursework ? 'Listed' : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function CvLibrary() {
  const { mode, unset } = useMode()
  const recommended = CV_FOR_MODE[mode]
  const [active, setActive] = useState<CvVariant>(recommended)

  /**
   * Follow the lens while the visitor has not overridden it. Once they pick a
   * version by hand, switching mode in the header stops yanking the panel out
   * from under them.
   */
  const [pinned, setPinned] = useState(false)
  useEffect(() => {
    if (!pinned) setActive(recommended)
  }, [recommended, pinned])

  useEffect(() => {
    track({ name: 'cv_previewed', variant: active, mode })
  }, [active, mode])

  function choose(variant: CvVariant) {
    setPinned(true)
    setActive(variant)
  }

  const shape = cvShape(active)
  const first = shape.sections[0]

  return (
    <>
      <header className="shell border-b border-hairline pb-section pt-14 sm:pt-20">
        <Reveal>
          <p className="eyebrow flex items-center gap-2.5">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>
              Four versions, one source
              {unset ? '' : ` — suggesting ${CV_DESCRIPTIONS[recommended].title} for ${MODE_LABELS[mode]}`}
            </span>
          </p>

          <h1 className="mt-5 max-w-[38ch] text-h1 font-medium tracking-tight text-balance">
            One CV would have to be four compromises. So there are four CVs.
          </h1>

          <div className="mt-2 h-6 w-full max-w-[22rem]">
            <SettledTrace className="h-full w-full" delay={0.1} strokeWidth={1.6} />
          </div>

          <p className="mt-6 max-w-measure text-lead leading-snug text-content text-pretty">
            {WHY}
          </p>

          <p className="mt-4 max-w-measure text-body text-content-muted text-pretty">
            Every version is generated from the same typed data file that builds this website, so a
            correction lands in all eight documents at once. All four are single-column, standard-font
            and text-only: selectable, searchable and parseable by an applicant tracking system, with
            no information trapped inside a graphic. The Word files are real editable text, not a
            picture of a PDF.
          </p>

          <CtaRow
            className="mt-9"
            label="Download"
            actions={[
              {
                label: `${CV_DESCRIPTIONS[recommended].title} (PDF)`,
                href: cvFile(recommended, 'pdf'),
                weight: 'primary',
                download: true,
                onSelect: () =>
                  track({ name: 'cv_downloaded', variant: recommended, format: 'pdf', mode }),
              },
              {
                label: 'Word (.docx)',
                href: cvFile(recommended, 'docx'),
                download: true,
                onSelect: () =>
                  track({ name: 'cv_downloaded', variant: recommended, format: 'docx', mode }),
              },
              { label: 'Compare all four', href: '#compare' },
            ]}
          />
        </Reveal>
      </header>

      <Section
        id="versions"
        eyebrow="Pick a version"
        heading="Which one you want depends on who you are"
        lede="Choosing here updates the preview and both download buttons."
      >
        <VariantTabs active={active} onSelect={choose} recommended={recommended} />

        <div
          role="tabpanel"
          id={`cv-panel-${active}`}
          aria-labelledby={`cv-tab-${active}`}
          className="mt-10"
        >
          <div className="mb-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
            <div className="min-w-0">
              <h3 className="text-h3 font-medium tracking-tight text-content">
                {CV_DESCRIPTIONS[active].title}
              </h3>
              <p className="mt-1.5 max-w-measure text-body text-content-muted text-pretty">
                {shape.projects} projects · {shape.experience} roles · {shape.leadership} leadership
                entries · {shape.skillGroups} skill groups · {shape.certifications} certifications
                {first ? ` · opens with ${CV_SECTION_SHORT[first].toLowerCase()}` : ''}
              </p>
            </div>

            <CtaRow
              label={`Download the ${CV_DESCRIPTIONS[active].title}`}
              actions={[
                {
                  label: 'PDF',
                  href: cvFile(active, 'pdf'),
                  weight: 'primary',
                  download: true,
                  onSelect: () =>
                    track({ name: 'cv_downloaded', variant: active, format: 'pdf', mode }),
                },
                {
                  label: 'Word (.docx)',
                  href: cvFile(active, 'docx'),
                  download: true,
                  onSelect: () =>
                    track({ name: 'cv_downloaded', variant: active, format: 'docx', mode }),
                },
              ]}
            />
          </div>

          <CvPreview variant={active} />
        </div>
      </Section>

      <Section
        id="compare"
        eyebrow="What differs"
        heading="The four versions, side by side"
        lede="Every number here is counted from the rules that generate the files. The first section of each is highlighted; that is the tailoring a reader notices first."
      >
        <ComparisonTable active={active} />

        <div className="mt-10 max-w-measure space-y-4 text-body text-content-muted text-pretty">
          <p>
            <span className="text-content">Where the difference comes from.</span> Every bullet in the
            data file is tagged with the versions it belongs to. The technical CV takes the bullet
            about 214 offline tests and the fallback chain; the scholarship CV takes the one about
            leading a build team for the first time. Both statements are true of the same project —
            they answer different questions about it.
          </p>
          <p>
            <span className="text-content">Where it does not.</span> No version gets a stronger
            phrasing of a claim than the others, and nothing is added to fill a section out. Where a
            project has no public repository the CV says so; where work is unfinished it is listed as
            in progress.
          </p>
        </div>
      </Section>

      <Section
        id="all"
        eyebrow="All eight files"
        heading="Every version, both formats"
        lede="PDF for sending and printing, Word for anyone who needs to paste sections into their own form."
      >
        <ul className="border-t border-hairline">
          {CV_VARIANTS.map((variant) => (
            <li
              key={variant}
              className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b border-hairline py-5"
            >
              <span className="min-w-0">
                <span className="block text-body font-medium text-content">
                  {CV_DESCRIPTIONS[variant].title}
                </span>
                <span className="mt-1 block max-w-measure text-caption text-content-muted text-pretty">
                  {CV_DESCRIPTIONS[variant].bestFor}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-4">
                {(['pdf', 'docx'] as const).map((format) => (
                  <a
                    key={format}
                    href={cvFile(variant, format)}
                    download
                    onClick={() => track({ name: 'cv_downloaded', variant, format, mode })}
                    className="font-mono text-micro uppercase tracking-[0.12em] text-content-muted transition-colors hover:text-accent"
                  >
                    {format === 'pdf' ? 'PDF ↓' : 'DOCX ↓'}
                  </a>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="next"
        eyebrow="Next"
        heading="A CV is a summary. The detail is on this site."
        lede="Every claim in all four appears somewhere on this site with the reasoning behind it. That is the part a two-page document cannot carry."
      >
        <CtaRow
          label="Next steps"
          actions={[
            { label: 'Read the case studies', href: '/work/', weight: 'primary' },
            { label: 'Get in touch', href: '/contact/' },
            { label: 'The story behind it', href: '/about/' },
            {
              label: 'LinkedIn',
              href: profile.identity.links.linkedin.href,
              external: true,
              weight: 'quiet',
              onSelect: () => track({ name: 'external_link', target: 'linkedin', mode }),
            },
          ]}
        />
      </Section>
    </>
  )
}
