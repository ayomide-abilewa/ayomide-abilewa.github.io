'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { VisitorMode } from '@/data/types'
import { track } from './analytics'

/**
 * Visitor mode state.
 *
 * The chosen path is remembered for the session — sessionStorage, not
 * localStorage, so it expires when the tab closes and nothing persists on the
 * visitor's machine beyond their visit.
 *
 * The mode is applied as a single class on <html>. Themed values are CSS custom
 * properties, so a switch retunes the whole document without re-rendering leaves.
 */

const STORAGE_KEY = 'aa.mode'
const LOFI_SEQUENCE = 'lofi'

type ModeContextValue = {
  mode: VisitorMode
  /** True until the visitor has actually chosen a path. */
  unset: boolean
  setMode: (mode: VisitorMode, source?: 'selection' | 'switcher' | 'route') => void
  lofi: boolean
  toggleLofi: () => void
  /** Set once the opening sequence has played, so it does not replay on return. */
  introSeen: boolean
  markIntroSeen: () => void
}

const ModeContext = createContext<ModeContextValue | null>(null)

const MODE_CLASSES: Record<VisitorMode, string> = {
  engineering: 'mode-engineering',
  research: 'mode-research',
  scholarship: 'mode-scholarship',
  everything: 'mode-everything',
}

export const MODE_LABELS: Record<VisitorMode, string> = {
  engineering: 'Engineering',
  research: 'Research',
  scholarship: 'Scholarship',
  everything: 'Everything',
}

function isVisitorMode(value: unknown): value is VisitorMode {
  return (
    value === 'engineering' ||
    value === 'research' ||
    value === 'scholarship' ||
    value === 'everything'
  )
}

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<VisitorMode>('everything')
  const [unset, setUnset] = useState(true)
  const [lofi, setLofi] = useState(false)
  const [introSeen, setIntroSeen] = useState(false)
  const [announcement, setAnnouncement] = useState('')

  // Restore session choice before first paint of themed content where possible.
  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY)
      if (isVisitorMode(stored)) {
        setModeState(stored)
        setUnset(false)
      }
      if (window.sessionStorage.getItem('aa.intro') === 'seen') setIntroSeen(true)
    } catch {
      // Private browsing or storage disabled — mode simply stays per-page.
    }
  }, [])

  // Apply the mode class to <html>.
  useEffect(() => {
    const root = document.documentElement
    Object.values(MODE_CLASSES).forEach((cls) => root.classList.remove(cls))
    root.classList.add(MODE_CLASSES[mode])
    root.dataset.mode = mode
  }, [mode])

  useEffect(() => {
    document.documentElement.classList.toggle('lofi', lofi)
  }, [lofi])

  const setMode = useCallback(
    (next: VisitorMode, source: 'selection' | 'switcher' | 'route' = 'switcher') => {
      setModeState((current) => {
        if (current === next && !unset) return current
        try {
          window.sessionStorage.setItem(STORAGE_KEY, next)
        } catch {
          /* no-op */
        }
        if (source !== 'route') {
          track({ name: 'path_selected', mode: next, source })
          setAnnouncement(`Now viewing as ${MODE_LABELS[next]}. Content reordered for this audience.`)
        }
        return next
      })
      setUnset(false)
    },
    [unset],
  )

  const markIntroSeen = useCallback(() => {
    setIntroSeen(true)
    try {
      window.sessionStorage.setItem('aa.intro', 'seen')
    } catch {
      /* no-op */
    }
  }, [])

  const toggleLofi = useCallback(() => {
    setLofi((v) => {
      const next = !v
      setAnnouncement(
        next
          ? 'Low fidelity mode on. Animation and imagery reduced.'
          : 'Low fidelity mode off.',
      )
      return next
    })
  }, [])

  // Easter egg: type "lofi" anywhere to drop the site to its own fallback tier.
  const buffer = useRef('')
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return
      }
      if (event.key.length !== 1) return
      buffer.current = (buffer.current + event.key.toLowerCase()).slice(-LOFI_SEQUENCE.length)
      if (buffer.current === LOFI_SEQUENCE) {
        buffer.current = ''
        toggleLofi()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleLofi])

  const value = useMemo(
    () => ({ mode, unset, setMode, lofi, toggleLofi, introSeen, markIntroSeen }),
    [mode, unset, setMode, lofi, toggleLofi, introSeen, markIntroSeen],
  )

  return (
    <ModeContext.Provider value={value}>
      {children}
      {/* Mode changes are announced rather than silently reflowing the page. */}
      <div aria-live="polite" role="status" className="sr-only">
        {announcement}
      </div>
    </ModeContext.Provider>
  )
}

export function useMode(): ModeContextValue {
  const ctx = useContext(ModeContext)
  if (!ctx) throw new Error('useMode must be used inside ModeProvider')
  return ctx
}

/**
 * Declares the mode a path route represents. Landing on /research directly —
 * from a shared link, say — should set the session mode to research.
 */
export function useDeclareMode(mode: VisitorMode) {
  const { setMode } = useMode()
  useEffect(() => {
    setMode(mode, 'route')
  }, [mode, setMode])
}
