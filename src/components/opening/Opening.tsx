'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useMode } from '@/lib/mode'
import { track } from '@/lib/analytics'

type Phase = 'swinging' | 'landed' | 'opening' | 'done'

function WebSlinger() {
  return (
    <div className="web-slinger" aria-hidden="true">
      <svg className="web-line" viewBox="0 0 220 320" preserveAspectRatio="none">
        <path d="M216 2 C 150 30, 110 102, 101 226" />
      </svg>
      <svg className="web-hero" viewBox="0 0 120 170" role="img" aria-label="A masked web-slinging hero">
        <defs>
          <linearGradient id="heroRed" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#ff4b45" />
            <stop offset="1" stopColor="#9d101d" />
          </linearGradient>
          <linearGradient id="heroBlue" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#246bd2" />
            <stop offset="1" stopColor="#09275f" />
          </linearGradient>
        </defs>
        <g className="hero-body">
          <ellipse cx="61" cy="30" rx="19" ry="24" fill="url(#heroRed)" stroke="#16070b" strokeWidth="3" />
          <path d="M47 21 58 27 48 33M75 21 64 27 74 33" fill="#f4fbff" stroke="#16070b" strokeWidth="2" />
          <path d="M43 52 Q61 43 79 52 L84 96 Q62 108 38 96Z" fill="url(#heroRed)" stroke="#16070b" strokeWidth="3" />
          <path d="M49 59 Q61 75 74 59M61 48V99M42 69H80M43 84H80" fill="none" stroke="#42101a" strokeWidth="1.5" opacity=".8" />
          <path d="M39 58 15 80 4 63M80 58 101 35 111 9" fill="none" stroke="url(#heroRed)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M42 94 27 128 15 158M78 94 91 126 108 148" fill="none" stroke="url(#heroBlue)" strokeWidth="15" strokeLinecap="round" />
          <path d="M4 63 1 53M4 63 13 57M111 9 117 2M111 9 104 2" fill="none" stroke="#ff4b45" strokeWidth="4" strokeLinecap="round" />
          <path d="M42 94 Q60 105 78 94 L74 116 Q59 122 46 114Z" fill="url(#heroBlue)" />
        </g>
      </svg>
    </div>
  )
}

export function Opening({ onReveal }: { onReveal?: () => void }) {
  const { markIntroSeen, mode, lofi } = useMode()
  const [active, setActive] = useState(false)
  const [phase, setPhase] = useState<Phase>('swinging')
  const skipRef = useRef<HTMLButtonElement>(null)
  const timers = useRef<number[]>([])
  const revealed = useRef(false)

  const reveal = useCallback(() => {
    if (revealed.current) return
    revealed.current = true
    document.documentElement.removeAttribute('data-intro')
    onReveal?.()
  }, [onReveal])

  const finish = useCallback(() => {
    timers.current.forEach(window.clearTimeout)
    reveal()
    setPhase('done')
    setActive(false)
    markIntroSeen()
  }, [markIntroSeen, reveal])

  const skip = useCallback(() => {
    track({ name: 'intro_skipped', mode })
    finish()
  }, [finish, mode])

  useEffect(() => {
    const wanted = document.documentElement.dataset.intro === 'on'
    const systemReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!wanted || systemReduced || lofi) {
      document.documentElement.removeAttribute('data-intro')
      setPhase('done')
      return
    }
    setActive(true)
    skipRef.current?.focus()
    timers.current = [
      window.setTimeout(() => setPhase('landed'), 3150),
      window.setTimeout(() => {
        setPhase('opening')
        reveal()
      }, 3650),
      window.setTimeout(finish, 4900),
    ]
    return () => timers.current.forEach(window.clearTimeout)
    // The intro decision is intentionally made once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (active && lofi) finish()
  }, [active, lofi, finish])

  useEffect(() => {
    if (!active) return
    const prior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') skip()
    }
    window.addEventListener('keydown', key)
    return () => {
      document.body.style.overflow = prior
      window.removeEventListener('keydown', key)
    }
  }, [active, skip])

  if (!active || phase === 'done') return null
  const opening = phase === 'opening'

  return (
    <div className={`hero-intro ${opening ? 'is-opening' : ''} ${phase === 'landed' ? 'is-landed' : ''}`} role="dialog" aria-label="Animated site introduction">
      <div className="intro-sky" aria-hidden="true">
        <div className="city city-back" />
        <div className="city city-front" />
        <div className="speed-lines" />
      </div>

      <div className="stage-curtain curtain-left" aria-hidden="true"><span /></div>
      <div className="stage-curtain curtain-right" aria-hidden="true"><span /></div>
      <div className="curtain-valance" aria-hidden="true" />

      <WebSlinger />

      <div className="intro-title" aria-hidden="true">
        <span>Hold tight.</span>
        <strong>The work is about to drop.</strong>
      </div>

      <button ref={skipRef} type="button" onClick={skip} className="intro-skip">
        Skip intro <span aria-hidden="true">Esc</span>
      </button>
    </div>
  )
}
