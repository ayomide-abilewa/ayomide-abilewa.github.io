import type { CvVariant, VisitorMode } from '@/data/types'

/**
 * Analytics seam.
 *
 * One dispatch point, one event vocabulary, and a provider that only exists if
 * you ask for it. Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` at build time and the
 * layout adds Plausible's script and these events start counting. Leave it unset
 * — the default, and what the deployed build does today — and no third-party
 * script is in the HTML at all, so `window.plausible` is undefined, every call
 * below is an optional-call no-op, and nothing leaves the visitor's machine.
 *
 * Plausible rather than the obvious alternative because it needs no cookie
 * banner: no cookies, no device fingerprint, no IP storage, no cross-site
 * identifiers, no session replay, no PII. Every event here is a bare counter
 * with a handful of labels — enough to know which paths and projects get
 * attention, nothing that identifies who was looking. The `props` are read
 * straight off the event objects below, so what is sent is exactly what is
 * written down in this file and nothing more.
 */

declare global {
  interface Window {
    plausible?: {
      (name: string, options?: { props?: Record<string, string> }): void
      /** Queue the snippet in <head> fills before the script itself lands. */
      q?: unknown[]
    }
  }
}

export type AnalyticsEvent =
  | { name: 'path_selected'; mode: VisitorMode; source: 'selection' | 'switcher' }
  | { name: 'project_opened'; slug: string; mode: VisitorMode }
  | { name: 'cv_downloaded'; variant: CvVariant; format: 'pdf' | 'docx'; mode: VisitorMode }
  | { name: 'cv_previewed'; variant: CvVariant; mode: VisitorMode }
  | {
      name: 'external_link'
      target: 'github' | 'linkedin' | 'repo' | 'email' | 'phone'
      mode: VisitorMode
      /** Which repository, when target is 'repo'. A project slug, not a person. */
      slug?: string
    }
  | { name: 'section_viewed'; section: string; mode: VisitorMode }
  | { name: 'intro_skipped'; mode: VisitorMode }

function send(event: AnalyticsEvent): void {
  if (process.env.NODE_ENV === 'development') {
    // Visible during development so the event vocabulary stays honest, and so a
    // dev session never lands in the real numbers.
    // eslint-disable-next-line no-console
    console.debug('[analytics]', event)
    return
  }

  if (typeof window === 'undefined') return

  const { name, ...rest } = event
  const props: Record<string, string> = {}
  for (const [key, value] of Object.entries(rest)) {
    if (value !== undefined) props[key] = String(value)
  }

  // Undefined unless the layout has added the script, which only happens when
  // NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set at build time.
  window.plausible?.(name, { props })
}

export function track(event: AnalyticsEvent): void {
  try {
    send(event)
  } catch {
    // Analytics must never break the page.
  }
}
