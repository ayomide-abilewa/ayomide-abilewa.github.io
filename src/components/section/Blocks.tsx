'use client'

import type { ReactNode } from 'react'
import type {
  Certification,
  CvVariant,
  Education,
  Experience,
  LeadershipRole,
  SkillGroup,
  TimelineEntry,
} from '@/data/types'
import { bulletsFor } from '@/lib/select'
import { RevealGroup, RevealItem } from '@/components/motion/Reveal'
import { TickList } from '@/components/section/Section'

/**
 * Content blocks shared by the path routes.
 *
 * Bullet selection here uses the same `emphasis` tags as the CV generator, via
 * the CV variant that corresponds to the active path. That is what makes a mode
 * switch reorganise rather than redecorate: the website and the PDF are choosing
 * from the same tagged facts by the same rule.
 */

function Meta({ children }: { children: ReactNode }) {
  return <p className="font-mono text-micro text-content-faint">{children}</p>
}

function Chips({ items, label }: { items: readonly string[]; label: string }) {
  if (items.length === 0) return null
  return (
    <>
      <h4 className="sr-only">{label}</h4>
      <ul className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-control border border-hairline px-2 py-1 font-mono text-micro text-content-muted"
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  )
}

export function ExperienceList({
  items,
  variant,
  showSkills = true,
}: {
  items: Experience[]
  variant: CvVariant
  showSkills?: boolean
}) {
  return (
    <RevealGroup as="ol" className="border-t border-hairline">
      {items.map((item) => {
        const bullets = bulletsFor(item, variant)
        return (
          <RevealItem
            as="li"
            key={item.id}
            className="grid gap-x-10 gap-y-3 border-b border-hairline py-8 lg:grid-cols-[13rem_1fr]"
          >
            <div className="lg:pt-0.5">
              <Meta>
                {item.start} — {item.end}
              </Meta>
              {item.current && (
                <p className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-micro uppercase tracking-[0.12em] text-accent">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Current
                </p>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="text-h4 font-medium tracking-tight text-content">{item.role}</h3>
              <p className="mt-1 text-body text-content-muted">
                {item.organisation}
                {item.location && (
                  <span className="text-content-faint"> · {item.location}</span>
                )}
              </p>
              {bullets.length > 0 && <TickList items={bullets} className="mt-4" />}
              {showSkills && item.skills.length > 0 && (
                <div className="mt-5">
                  <Chips items={item.skills} label={`Skills applied at ${item.organisation}`} />
                </div>
              )}
            </div>
          </RevealItem>
        )
      })}
    </RevealGroup>
  )
}

export function LeadershipList({
  items,
  variant,
}: {
  items: LeadershipRole[]
  variant: CvVariant
}) {
  return (
    <RevealGroup as="ol" className="border-t border-hairline">
      {items.map((item) => {
        const bullets = bulletsFor(item, variant)
        return (
          <RevealItem
            as="li"
            key={item.id}
            className="grid gap-x-10 gap-y-3 border-b border-hairline py-7 lg:grid-cols-[13rem_1fr]"
          >
            <Meta>
              {item.start} — {item.end}
            </Meta>
            <div className="min-w-0">
              <h3 className="text-h4 font-medium tracking-tight text-content">{item.role}</h3>
              <p className="mt-1 text-body text-content-muted">{item.organisation}</p>
              {bullets.length > 0 ? (
                <TickList items={bullets} className="mt-3.5" />
              ) : (
                <p className="mt-3.5 text-body text-content-muted text-pretty">{item.summary}</p>
              )}
            </div>
          </RevealItem>
        )
      })}
    </RevealGroup>
  )
}

export function SkillGrid({ groups }: { groups: SkillGroup[] }) {
  return (
    <RevealGroup as="dl" className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <RevealItem key={group.label}>
          <dt className="eyebrow border-b border-hairline pb-2">{group.label}</dt>
          <dd className="mt-3">
            <ul className="space-y-1.5">
              {group.items.map((item) => (
                <li key={item} className="text-caption text-content-muted">
                  {item}
                </li>
              ))}
            </ul>
          </dd>
        </RevealItem>
      ))}
    </RevealGroup>
  )
}

export function CertificationList({ items }: { items: Certification[] }) {
  return (
    <RevealGroup as="ul" className="border-t border-hairline">
      {items.map((item) => (
        <RevealItem
          as="li"
          key={`${item.name}-${item.year}`}
          className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-hairline py-4"
        >
          <span className="min-w-0">
            <span className="block text-body text-content">{item.name}</span>
            <span className="block text-caption text-content-muted">{item.issuer}</span>
          </span>
          <span className="font-mono text-micro text-content-faint">{item.year}</span>
        </RevealItem>
      ))}
    </RevealGroup>
  )
}

export function EducationList({
  items,
  variant,
  showCoursework,
}: {
  items: Education[]
  variant: CvVariant
  showCoursework: boolean
}) {
  return (
    <RevealGroup as="ol" className="border-t border-hairline">
      {items.map((education) => {
        const notes = bulletsFor(education, variant)
        return (
          <RevealItem
            as="li"
            key={`${education.institution}-${education.start}`}
            className="grid gap-x-10 gap-y-4 border-b border-hairline py-7 lg:grid-cols-[13rem_1fr]"
          >
            <Meta>
              {education.start} — {education.end}
              {education.expected ? ' (expected)' : ''}
            </Meta>
            <div className="min-w-0">
              <h3 className="text-h4 font-medium tracking-tight text-content">
                {education.degree} {education.field}
              </h3>
              <p className="mt-1 text-body text-content-muted">
                {education.institution}
                <span className="text-content-faint"> · {education.location}</span>
              </p>
              {notes.length > 0 && <TickList items={notes} className="mt-4" />}
              {showCoursework && education.coursework.length > 0 && (
                <div className="mt-5">
                  <h4 className="eyebrow mb-2.5">Relevant coursework</h4>
                  <Chips items={education.coursework} label="Relevant coursework" />
                </div>
              )}
            </div>
          </RevealItem>
        )
      })}
    </RevealGroup>
  )
}

const TIMELINE_KIND: Record<TimelineEntry['kind'], string> = {
  education: 'Education',
  work: 'Work',
  project: 'Built',
  service: 'Teaching',
}

/**
 * Journey timeline. Years appear once, at the point they change, so the eye reads
 * a sequence rather than a repeated column of numbers.
 */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <RevealGroup as="ol" className="relative border-l border-hairline pl-6 sm:pl-8">
      {entries.map((entry, i) => {
        const previous = i > 0 ? entries[i - 1] : undefined
        const newYear = !previous || previous.year !== entry.year
        return (
          <RevealItem as="li" key={`${entry.year}-${entry.label}`} className="relative pb-8 last:pb-0">
            <span
              aria-hidden="true"
              className={`absolute top-[0.45rem] h-2 w-2 rounded-full -left-[28.5px] sm:-left-[36.5px] ${
                newYear ? 'bg-accent' : 'bg-hairline'
              }`}
            />
            <p className="flex items-baseline gap-3">
              <span
                className={`font-mono text-micro ${newYear ? 'text-accent' : 'text-content-faint'}`}
              >
                {entry.year}
              </span>
              <span className="eyebrow">{TIMELINE_KIND[entry.kind]}</span>
            </p>
            <h3 className="mt-1.5 text-h4 font-medium tracking-tight text-content">{entry.label}</h3>
            <p className="mt-1.5 max-w-measure text-body text-content-muted text-pretty">
              {entry.detail}
            </p>
          </RevealItem>
        )
      })}
    </RevealGroup>
  )
}
