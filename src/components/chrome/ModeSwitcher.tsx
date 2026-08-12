'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MODE_LABELS, useMode } from '@/lib/mode'
import { VISITOR_MODES, type VisitorMode } from '@/data/types'

/**
 * "Viewing as" switcher.
 *
 * Switching does two things: it retunes the theme, and it navigates to that
 * path's home so the content genuinely reorganises. What it never does is take
 * the visitor to an unrelated site — the mode, the projects and the CV all
 * derive from the same data, reordered.
 */

const BLURBS: Record<VisitorMode, string> = {
  engineering: 'Systems built, stack, and the decisions behind them.',
  research: 'Interests, methods and the investigations behind them.',
  scholarship: 'The journey, teaching and community work.',
  everything: 'All of it, in order.',
}

const ROUTES: Record<VisitorMode, string> = {
  engineering: '/engineering/',
  research: '/research/',
  scholarship: '/scholarship/',
  everything: '/everything/',
}

export function ModeSwitcher({ compact = false }: { compact?: boolean }) {
  const { mode, unset, setMode } = useMode()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function choose(next: VisitorMode) {
    setMode(next, 'switcher')
    setOpen(false)
    router.push(ROUTES[next])
  }

  // On the landing page before a choice is made, the switcher would be noise.
  if (compact && unset) return null

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1.5 rounded-control border border-hairline px-2.5 py-1.5 text-caption text-content-muted transition-colors hover:border-accent hover:text-content"
      >
        <span className="hidden font-mono text-micro uppercase tracking-[0.12em] text-content-faint sm:inline">
          Viewing as
        </span>
        <span className="font-medium text-content">{MODE_LABELS[mode]}</span>
        <svg
          viewBox="0 0 10 6"
          className={`h-1.5 w-2.5 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+6px)] z-50 w-[19rem] rounded-panel border border-hairline bg-surface-raised p-1.5 shadow-2xl shadow-black/25"
          role="group"
          aria-label="Change visitor mode"
        >
          <p className="px-2.5 pb-1.5 pt-1 font-mono text-micro uppercase tracking-[0.14em] text-content-faint">
            Same work, reordered for
          </p>
          {VISITOR_MODES.map((option) => {
            const current = option === mode
            return (
              <button
                key={option}
                type="button"
                onClick={() => choose(option)}
                aria-current={current ? 'true' : undefined}
                className={`block w-full rounded-control px-2.5 py-2 text-left transition-colors ${
                  current ? 'bg-accent/10' : 'hover:bg-content/5'
                }`}
              >
                <span className="flex items-baseline gap-2">
                  <span
                    className={`text-caption font-medium ${current ? 'text-accent' : 'text-content'}`}
                  >
                    {MODE_LABELS[option]}
                  </span>
                  {current && (
                    <span className="font-mono text-micro uppercase tracking-[0.12em] text-accent">
                      current
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block text-caption leading-snug text-content-muted">
                  {BLURBS[option]}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
