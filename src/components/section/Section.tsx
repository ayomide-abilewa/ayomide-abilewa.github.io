'use client'

import type { ReactNode } from 'react'
import { Reveal } from '@/components/motion/Reveal'

/**
 * Section shell.
 *
 * Every content block on every path route goes through this, so heading levels,
 * spacing, eyebrow treatment and scroll-reveal behaviour are decided once. The
 * `number` slot exists because the research path presents itself as a numbered
 * paper — the same component, a different register, not a second component.
 */

export function Section({
  id,
  eyebrow,
  number,
  heading,
  lede,
  register,
  children,
  className = '',
}: {
  id: string
  eyebrow?: string
  /** Rendered as a section number. Used by the research path. */
  number?: string
  heading: string
  lede?: string
  /** Retunes the theme for this section only — used by /everything. */
  register?: 'engineering' | 'research' | 'scholarship'
  children: ReactNode
  className?: string
}) {
  const headingId = `${id}-heading`
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      data-register={register}
      data-section={id}
      className={
        register
          ? `bg-surface py-section text-content transition-colors duration-700 ${className}`
          : `py-section ${className}`
      }
    >
      <div className="shell">
        <Reveal className="max-w-measure">
          {(eyebrow || number) && (
            <p className="eyebrow mb-3 flex items-baseline gap-2.5">
              {number && <span className="text-accent">{number}</span>}
              {eyebrow && <span>{eyebrow}</span>}
            </p>
          )}
          <h2 id={headingId} className="text-h2 font-medium tracking-tight text-balance">
            {heading}
          </h2>
          {lede && <p className="mt-4 text-body-lg text-content-muted text-pretty">{lede}</p>}
        </Reveal>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  )
}

/** Subheading inside a section, one level down. */
export function SubHeading({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h3 id={id} className="text-h4 font-medium tracking-tight text-content">
      {children}
    </h3>
  )
}

/** A labelled block of prose or list content inside a case study. */
export function Field({
  label,
  children,
  className = '',
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <h3 className="eyebrow mb-3">{label}</h3>
      {children}
    </div>
  )
}

/**
 * Bulleted list with a trace tick instead of a disc. Used everywhere a list of
 * findings, challenges or results appears.
 */
export function TickList({
  items,
  className = '',
}: {
  items: readonly string[]
  className?: string
}) {
  return (
    <ul className={`space-y-2.5 ${className}`}>
      {items.map((item) => (
        <li key={item} className="relative pl-5 text-body text-content-muted text-pretty">
          <span
            aria-hidden="true"
            className="absolute left-0 top-[0.7em] h-px w-2.5 bg-accent"
          />
          {item}
        </li>
      ))}
    </ul>
  )
}
