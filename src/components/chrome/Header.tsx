'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMode } from '@/lib/mode'
import { ModeSwitcher } from './ModeSwitcher'
import { profile } from '@/data/profile'
import { track } from '@/lib/analytics'
import { CV_FOR_MODE } from '@/data/types'
import { cvFile } from '@/lib/select'

/**
 * Persistent navigation.
 *
 * The visitor is never more than one click from home, another path, the CV,
 * GitHub, LinkedIn or contact — including in the middle of a case study. Minimal
 * by design: one row, no mega-menu, nothing that competes with the content.
 */

const LINKS = [
  { href: '/work/', label: 'Work' },
  { href: '/about/', label: 'About' },
  { href: '/cv/', label: 'CV' },
  { href: '/contact/', label: 'Contact' },
] as const

/** The probe, reduced to a mark: needle, band, trace. */
function ProbeMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 34 20" className={className} aria-hidden="true" focusable="false">
      <path d="M7 2.5 L11 2.5 L11 11 L9 14 L7 11 Z" fill="currentColor" opacity="0.75" />
      <rect x="7" y="6" width="4" height="2.2" fill="rgb(var(--accent))" />
      <path d="M9 14 L9 17" stroke="rgb(var(--accent))" strokeWidth="1.2" />
      <path
        d="M9 17.5 L15 17.5 L17 14 L19 21 L21 17.5 L33 17.5"
        fill="none"
        stroke="rgb(var(--accent))"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Header() {
  const pathname = usePathname()
  const { mode } = useMode()
  const isLanding = pathname === '/'

  return (
    <header
      className="sticky top-0 z-50 border-b border-hairline/70 bg-surface/85 backdrop-blur-sm"
      data-lofi-hide="false"
    >
      <div className="shell flex h-14 items-center gap-4">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 text-content"
          aria-label="Ayomide Abilewa — home"
        >
          <ProbeMark className="h-5 w-8 text-content-muted transition-colors group-hover:text-content" />
          <span className="hidden text-caption font-medium tracking-tight sm:inline">
            Ayomide Abilewa
          </span>
        </Link>

        <nav aria-label="Main" className="ml-auto flex items-center gap-1">
          {LINKS.map((link) => {
            const active = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-control px-2.5 py-1.5 text-caption transition-colors ${
                  active
                    ? 'text-accent'
                    : 'text-content-muted hover:text-content'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Direct CV download, always one click away, matched to the active path. */}
          <a
            href={cvFile(CV_FOR_MODE[mode], 'pdf')}
            download
            onClick={() =>
              track({
                name: 'cv_downloaded',
                variant: CV_FOR_MODE[mode],
                format: 'pdf',
                mode,
              })
            }
            className="hidden rounded-control border border-hairline px-2.5 py-1.5 font-mono text-micro uppercase tracking-[0.12em] text-content-muted transition-colors hover:border-accent hover:text-accent md:inline-block"
          >
            CV ↓
          </a>
          <a
            href={profile.identity.links.github.href}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => track({ name: 'external_link', target: 'github', mode })}
            className="rounded-control p-1.5 text-content-muted transition-colors hover:text-content"
            aria-label="GitHub profile (opens in a new tab)"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-2.92-.88-2.92-2.9 0-.65.23-1.18.61-1.6-.06-.15-.27-.77.06-1.6 0 0 .5-.16 1.64.61a5.6 5.6 0 0 1 1.49-.2c.51 0 1.02.07 1.49.2 1.14-.77 1.64-.61 1.64-.61.33.83.12 1.45.06 1.6.38.42.61.95.61 1.6 0 2.03-1.15 2.7-2.93 2.9.3.26.56.76.56 1.54 0 1.11-.01 2.01-.01 2.28 0 .21.15.46.55.38A7.99 7.99 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
          </a>
          <ModeSwitcher compact={isLanding} />
        </div>
      </div>
    </header>
  )
}
