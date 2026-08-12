'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { profile } from '@/data/profile'
import { projectBySlug } from '@/lib/select'
import type { ResearchInterest } from '@/data/types'

/**
 * Research interest graph.
 *
 * The point is not that it looks like a network — it is that every interest is
 * wired to work that already exists. An interest with nothing on the right-hand
 * side would be an assertion; an interest with two projects behind it is a
 * claim you can check. `evidence` in profile.ts holds the project slugs and
 * experience ids, so the links cannot drift from the content.
 *
 * Selecting an interest dims the other edges. Keyboard users get the same
 * behaviour through focus, and the whole thing collapses to a plain nested list
 * below the lg breakpoint, where a two-column graph would be unreadable.
 */

type Endpoint = { id: string; label: string; href?: string }

function resolveEvidence(id: string): Endpoint {
  const project = projectBySlug(id)
  if (project) return { id, label: project.name, href: `/work/${project.slug}/` }

  const experience = profile.experience.find((e) => e.id === id)
  if (experience) return { id, label: experience.organisation }

  return { id, label: id }
}

function curve(from: { x: number; y: number }, to: { x: number; y: number }): string {
  const dx = Math.max(40, (to.x - from.x) * 0.55)
  return `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`
}

export function InterestGraph({ interests }: { interests: ResearchInterest[] }) {
  const [active, setActive] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const leftRefs = useRef(new Map<string, HTMLElement>())
  const rightRefs = useRef(new Map<string, HTMLElement>())
  const [edges, setEdges] = useState<{ key: string; d: string; interest: string }[]>([])
  const [box, setBox] = useState({ w: 0, h: 0 })

  /** Unique evidence endpoints, in the order interests first reference them. */
  const endpoints = useMemo(() => {
    const seen = new Map<string, Endpoint>()
    for (const interest of interests) {
      for (const id of interest.evidence) {
        if (!seen.has(id)) seen.set(id, resolveEvidence(id))
      }
    }
    return [...seen.values()]
  }, [interests])

  const measure = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const origin = container.getBoundingClientRect()
    if (origin.width === 0) return

    const next: { key: string; d: string; interest: string }[] = []
    for (const interest of interests) {
      const a = leftRefs.current.get(interest.id)
      if (!a) continue
      const ar = a.getBoundingClientRect()
      const from = {
        x: ar.right - origin.left,
        y: ar.top - origin.top + Math.min(ar.height / 2, 22),
      }
      for (const id of interest.evidence) {
        const b = rightRefs.current.get(id)
        if (!b) continue
        const br = b.getBoundingClientRect()
        const to = { x: br.left - origin.left, y: br.top - origin.top + br.height / 2 }
        next.push({ key: `${interest.id}-${id}`, d: curve(from, to), interest: interest.id })
      }
    }
    setBox({ w: origin.width, h: origin.height })
    setEdges(next)
  }, [interests])

  useEffect(() => {
    measure()
    const container = containerRef.current
    if (!container || typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure, { passive: true })
      return () => window.removeEventListener('resize', measure)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    document.fonts?.ready.then(measure).catch(() => {})
    return () => observer.disconnect()
  }, [measure])

  const selected = interests.find((i) => i.id === active)

  return (
    <>
      {/* --- Desktop: measured two-column graph --- */}
      <div ref={containerRef} className="relative hidden lg:block">
        {box.w > 0 && (
          <svg
            className="pointer-events-none absolute inset-0 z-0"
            viewBox={`0 0 ${box.w} ${box.h}`}
            width={box.w}
            height={box.h}
            fill="none"
            aria-hidden="true"
            data-decorative="true"
          >
            {edges.map((edge) => {
              const lit = active === null || active === edge.interest
              return (
                <path
                  key={edge.key}
                  d={edge.d}
                  stroke={lit ? 'rgb(var(--accent))' : 'rgb(var(--hairline))'}
                  strokeWidth={active === edge.interest ? 1.5 : 1}
                  strokeOpacity={lit ? (active ? 0.9 : 0.45) : 0.35}
                  className="transition-[stroke,stroke-opacity,stroke-width] duration-300"
                />
              )
            })}
          </svg>
        )}

        <div className="relative z-10 grid grid-cols-[minmax(0,1fr)_9rem_minmax(0,15rem)] items-start gap-y-3">
          <ul className="space-y-3">
            {interests.map((interest) => {
              const isActive = active === interest.id
              return (
                <li
                  key={interest.id}
                  ref={(el) => {
                    if (el) leftRefs.current.set(interest.id, el)
                    else leftRefs.current.delete(interest.id)
                  }}
                >
                  <button
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActive(isActive ? null : interest.id)}
                    onMouseEnter={() => setActive(interest.id)}
                    onFocus={() => setActive(interest.id)}
                    className={`w-full rounded-control border bg-surface px-4 py-3 text-left transition-colors duration-200 ${
                      isActive
                        ? 'border-accent text-content'
                        : 'border-hairline text-content-muted hover:border-content-faint'
                    }`}
                  >
                    <span className="block text-body font-medium text-content">
                      {interest.label}
                    </span>
                    <span className="mt-0.5 block font-mono text-micro text-content-faint">
                      {interest.evidence.length} piece
                      {interest.evidence.length === 1 ? '' : 's'} of work
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          {/* Spacer column: the graph lives here. */}
          <div aria-hidden="true" />

          <ul className="space-y-2.5 pt-1">
            {endpoints.map((endpoint) => {
              const lit =
                active === null ||
                interests.find((i) => i.id === active)?.evidence.includes(endpoint.id) === true
              const className = `block rounded-control border px-3 py-2 text-caption transition-colors duration-300 ${
                lit
                  ? 'border-hairline bg-surface text-content'
                  : 'border-transparent text-content-faint'
              }`
              return (
                <li
                  key={endpoint.id}
                  ref={(el) => {
                    if (el) rightRefs.current.set(endpoint.id, el)
                    else rightRefs.current.delete(endpoint.id)
                  }}
                >
                  {endpoint.href ? (
                    <Link href={endpoint.href} className={`${className} hover:border-accent`}>
                      {endpoint.label}
                    </Link>
                  ) : (
                    <span className={className}>{endpoint.label}</span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        {/* Description of the selected interest, held in a fixed slot so
            selecting one does not shift the graph above it. */}
        <div className="mt-8 min-h-[5.5rem] border-t border-hairline pt-5">
          {selected ? (
            <p className="max-w-measure text-body text-content-muted text-pretty">
              {selected.description}
            </p>
          ) : (
            <p className="max-w-measure text-body text-content-faint text-pretty">
              Select an interest to see what it means and which work it comes from.
            </p>
          )}
        </div>
      </div>

      {/* --- Below lg: the same information as a plain nested list --- */}
      <ol className="space-y-7 border-t border-hairline lg:hidden">
        {interests.map((interest) => (
          <li key={interest.id} className="border-b border-hairline pb-7">
            <h3 className="text-h4 font-medium tracking-tight text-content">{interest.label}</h3>
            <p className="mt-2 text-body text-content-muted text-pretty">{interest.description}</p>
            <p className="eyebrow mt-4 mb-2">Evidence</p>
            <ul className="flex flex-wrap gap-1.5">
              {interest.evidence.map((id) => {
                const endpoint = resolveEvidence(id)
                return (
                  <li key={id}>
                    {endpoint.href ? (
                      <Link
                        href={endpoint.href}
                        className="inline-block rounded-control border border-hairline px-2.5 py-1.5 font-mono text-micro text-content-muted"
                      >
                        {endpoint.label}
                      </Link>
                    ) : (
                      <span className="inline-block rounded-control border border-hairline px-2.5 py-1.5 font-mono text-micro text-content-muted">
                        {endpoint.label}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ol>
    </>
  )
}
