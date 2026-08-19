'use client'

import Link from 'next/link'
import { profile } from '@/data/profile'
import { useMode } from '@/lib/mode'
import { track } from '@/lib/analytics'

/**
 * The privacy line has to stay true in both builds. With no analytics domain set
 * nothing third-party ships at all; with one set, Plausible is loaded — cookieless
 * and with no personal data or fingerprint, but it would make "no trackers" a lie.
 * Inlined at build time, so only the accurate branch reaches the bundle.
 */
const PRIVACY_LINE = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
  ? 'No cookies. No personal data.'
  : 'No cookies. No trackers.'

export function Footer() {
  const { mode, lofi, toggleLofi } = useMode()
  const { identity } = profile

  return (
    <footer className="mt-auto border-t border-hairline/70 bg-surface-sunken/40">
      <div className="shell py-10">
        <div className="trace-rule mb-8" />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="eyebrow mb-2.5">Contact</p>
            <a
              href={`mailto:${identity.email}`}
              onClick={() => track({ name: 'external_link', target: 'email', mode })}
              className="block text-caption text-content transition-colors hover:text-accent"
            >
              {identity.email}
            </a>
            <p className="mt-1 text-caption text-content-faint">{identity.location}</p>
          </div>

          <div>
            <p className="eyebrow mb-2.5">Elsewhere</p>
            <a
              href={identity.links.github.href}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => track({ name: 'external_link', target: 'github', mode })}
              className="block text-caption text-content-muted transition-colors hover:text-accent"
            >
              GitHub
            </a>
            <a
              href={identity.links.linkedin.href}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => track({ name: 'external_link', target: 'linkedin', mode })}
              className="mt-1 block text-caption text-content-muted transition-colors hover:text-accent"
            >
              LinkedIn
            </a>
          </div>

          <div>
            <p className="eyebrow mb-2.5">Paths</p>
            {([
              ['/engineering/', 'Engineering'],
              ['/research/', 'Research'],
              ['/scholarship/', 'Scholarship'],
              ['/everything/', 'Everything'],
            ] as const).map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="mt-1 block text-caption text-content-muted transition-colors first:mt-0 hover:text-accent"
              >
                {label}
              </Link>
            ))}
          </div>

          <div>
            <p className="eyebrow mb-2.5">Display</p>
            <button
              type="button"
              onClick={toggleLofi}
              aria-pressed={lofi}
              className="text-left text-caption text-content-muted transition-colors hover:text-accent"
            >
              {lofi ? 'Restore full fidelity' : 'Low fidelity mode'}
            </button>
            <p className="mt-1.5 max-w-[24ch] text-micro leading-relaxed text-content-faint">
              Or type <span className="font-mono text-content-muted">lofi</span> anywhere. Same
              content, no motion, no imagery.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-baseline justify-between gap-3 border-t border-hairline/60 pt-5">
          <p className="text-micro text-content-faint">
            © {identity.name}. Designed and built by me, in Next.js, deployed on GitHub Pages.
          </p>
          <p className="font-mono text-micro tracking-[0.1em] text-content-faint">
            {PRIVACY_LINE}
          </p>
        </div>
      </div>
    </footer>
  )
}
