'use client'

import type { Decision } from '@/data/types'

/**
 * Engineering decisions, rendered as choice ← forcing reason.
 *
 * Two columns rather than a bulleted list, because the pairing *is* the content:
 * the left side is what was built, the right side is the failure mode that made it
 * the only sensible option. A single-column list loses that relationship, and a
 * table adds furniture for two fields.
 *
 * The reason column is prefixed "Because: " for screen readers, where the visual
 * pairing is unavailable.
 */

export function DecisionList({
  items,
  remaining = 0,
  className = '',
}: {
  items: Decision[]
  /** Decisions withheld from this view, deferred to the full case study. */
  remaining?: number
  className?: string
}) {
  return (
    <div className={className}>
      <ol className="border-t border-hairline">
        {items.map((decision) => (
          <li
            key={decision.choice}
            className="grid gap-x-8 gap-y-1.5 border-b border-hairline py-4 md:grid-cols-2"
          >
            <p className="text-body text-content text-pretty">{decision.choice}</p>
            <p className="relative pl-5 text-caption text-content-muted text-pretty md:pl-6">
              <span
                aria-hidden="true"
                className="absolute left-0 top-[0.65em] h-px w-3 bg-accent md:w-3.5"
              />
              <span className="sr-only">Because: </span>
              {decision.because}
            </p>
          </li>
        ))}
      </ol>
      {remaining > 0 && (
        <p className="mt-3 font-mono text-micro text-content-faint">
          {remaining} more in the full case study.
        </p>
      )}
    </div>
  )
}
