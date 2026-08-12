'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useMode } from '@/lib/mode'
import { usePrefersReducedMotion } from '@/lib/motion'

const ROUTES = {
  engineering: ['Engineering', 'Systems coming online', 'circuit'],
  research: ['Research', 'Bringing the evidence into focus', 'lens'],
  scholarship: ['Scholarship', 'Turning access into a lesson', 'chalk'],
  everything: ['Everything', 'Connecting every part of the story', 'orbit'],
  work: ['Selected work', 'Opening the build notes', 'blueprint'],
  cv: ['Curriculum vitae', 'Assembling the right version', 'paper'],
  about: ['About', 'Rewinding to the first build', 'timeline'],
  contact: ['Contact', 'Opening a clear channel', 'signal'],
} as const

function ArrivalGlyph({ kind }: { kind: string }) {
  return (
    <svg viewBox="0 0 180 100" aria-hidden="true">
      {kind === 'circuit' && <><path d="M8 50h34l12-20 20 40 18-40 16 20h64" /><circle cx="8" cy="50" r="4" /><circle cx="172" cy="50" r="4" /></>}
      {kind === 'lens' && <><circle cx="78" cy="43" r="30" /><path d="m100 65 31 27M54 43h48M78 19v48" /><circle cx="78" cy="43" r="7" /></>}
      {kind === 'chalk' && <><path d="M12 73C45 17 80 88 113 34c18-29 39-15 56-2" /><path d="m145 21 25 11-22 15" /></>}
      {kind === 'orbit' && <><ellipse cx="90" cy="50" rx="76" ry="28" /><ellipse cx="90" cy="50" rx="76" ry="28" transform="rotate(55 90 50)" /><circle cx="90" cy="50" r="8" /></>}
      {kind === 'blueprint' && <><rect x="28" y="15" width="124" height="70" /><path d="M43 69 73 35l22 22 18-14 24 26M43 27h34M43 78h78" /></>}
      {kind === 'paper' && <><path d="M51 9h59l22 22v61H51zM110 9v22h22M66 49h51M66 62h51M66 75h35" /></>}
      {kind === 'timeline' && <><path d="M10 51h160" /><circle cx="35" cy="51" r="8" /><circle cx="90" cy="51" r="8" /><circle cx="145" cy="51" r="8" /></>}
      {kind === 'signal' && <><path d="M14 50h30l10-30 22 63 20-55 15 42 12-20h43" /><circle cx="166" cy="50" r="5" /></>}
    </svg>
  )
}

export function RouteArrival() {
  const pathname = usePathname()
  const reduced = usePrefersReducedMotion()
  const { lofi } = useMode()
  const first = useRef(true)
  const [visible, setVisible] = useState(false)
  const key = pathname.split('/').filter(Boolean)[0] as keyof typeof ROUTES | undefined
  const content = useMemo(() => (key ? ROUTES[key] : undefined), [key])

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (!content || reduced || lofi) return
    setVisible(true)
    const timer = window.setTimeout(() => setVisible(false), 1450)
    return () => window.clearTimeout(timer)
  }, [pathname, content, reduced, lofi])

  if (!visible || !content) return null
  return (
    <div className={`route-arrival route-${content[2]}`} aria-hidden="true">
      <div className="arrival-wipe" />
      <div className="arrival-content">
        <ArrivalGlyph kind={content[2]} />
        <p>{content[0]}</p>
        <span>{content[1]}</span>
      </div>
    </div>
  )
}
