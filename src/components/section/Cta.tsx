'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * Calls to action.
 *
 * The set of actions differs per path — a recruiter wants the repositories and a
 * technical CV, a scholarship reviewer wants the journey and a contact route.
 * Pages declare their actions as data; this file decides how an action looks.
 *
 * Three weights only. A page with four primary buttons has no primary button.
 */

export type Action = {
  label: string
  href: string
  weight?: 'primary' | 'secondary' | 'quiet'
  /** Opens in a new tab and gets an external indicator. */
  external?: boolean
  /** Triggers a file download rather than navigation. */
  download?: boolean
  /** Short clarifier shown beneath the label on primary actions. */
  hint?: string
  onSelect?: () => void
}

const WEIGHT: Record<NonNullable<Action['weight']>, string> = {
  primary:
    'border border-accent bg-accent text-surface hover:bg-accent-strong hover:border-accent-strong',
  secondary:
    'border border-hairline text-content hover:border-accent hover:text-accent',
  quiet:
    'border border-transparent text-content-muted underline decoration-hairline underline-offset-4 hover:text-accent hover:decoration-accent',
}

/*
 * `btn-live` carries the hover lift and the click press. It is transform-only, so
 * it composes with all three weights above rather than competing with their
 * colours. See globals.css.
 */
const BASE =
  'btn-live inline-flex items-center gap-2 rounded-control px-4 py-2.5 text-caption font-medium'

function ExternalMark() {
  return (
    <svg
      aria-hidden="true"
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      className="shrink-0 opacity-70"
    >
      <path d="M3 9 L9 3 M9 3 H4.5 M9 3 V7.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

export function ActionButton({ action }: { action: Action }) {
  const weight = action.weight ?? 'secondary'
  const className = `${BASE} ${WEIGHT[weight]}`
  const body: ReactNode = (
    <>
      <span>{action.label}</span>
      {action.external && <ExternalMark />}
    </>
  )

  if (action.external || action.download) {
    return (
      <a
        href={action.href}
        onClick={action.onSelect}
        className={className}
        {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...(action.download ? { download: '' } : {})}
      >
        {body}
        {action.external && <span className="sr-only">(opens in a new tab)</span>}
      </a>
    )
  }

  return (
    <Link href={action.href} onClick={action.onSelect} className={className}>
      {body}
    </Link>
  )
}

export function CtaRow({
  actions,
  className = '',
  label,
}: {
  actions: Action[]
  className?: string
  /** Accessible name for the group, since these are the page's exits. */
  label?: string
}) {
  return (
    <nav aria-label={label ?? 'Next steps'} className={`flex flex-wrap gap-3 ${className}`}>
      {actions.map((action) => (
        <ActionButton key={`${action.label}-${action.href}`} action={action} />
      ))}
    </nav>
  )
}
