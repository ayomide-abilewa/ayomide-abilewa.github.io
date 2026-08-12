import type { CvVariant, VisitorMode } from '@/data/types'

/**
 * Analytics seam.
 *
 * There is deliberately no analytics provider wired in. This module defines the
 * event vocabulary and a single dispatch point, so a privacy-respecting
 * provider (Plausible, Umami, or a self-hosted endpoint) can be added later by
 * editing only the `send` function below.
 *
 * What is intentionally NOT collected: no cookies, no device fingerprint, no IP
 * storage, no cross-site identifiers, no session replay, no PII. Every event is
 * a bare counter — enough to know which paths and projects get attention, and
 * nothing that identifies who was looking.
 */

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

/** Swap this one function to enable a provider. */
function send(event: AnalyticsEvent): void {
  if (process.env.NODE_ENV === 'development') {
    // Visible during development so the event vocabulary stays honest.
    // eslint-disable-next-line no-console
    console.debug('[analytics]', event)
  }
  // Intentionally no network call. To enable, for example:
  //   window.plausible?.(event.name, { props: { ...event } })
}

export function track(event: AnalyticsEvent): void {
  try {
    send(event)
  } catch {
    // Analytics must never break the page.
  }
}
