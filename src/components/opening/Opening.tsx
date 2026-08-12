'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useMode } from '@/lib/mode'
import { track } from '@/lib/analytics'

type Phase = 'swinging' | 'landed' | 'gripping' | 'pulling' | 'opening' | 'done'

function WebSlinger() {
  return (
    <div className="web-slinger" aria-hidden="true">
      <svg className="web-line web-line-one" viewBox="0 0 360 410" preserveAspectRatio="none">
        <path d="M354 0 Q205 65 180 292" />
      </svg>
      <svg className="web-line web-line-two" viewBox="0 0 360 410" preserveAspectRatio="none">
        <path d="M8 0 Q155 62 180 292" />
      </svg>
      <svg className="web-hero" viewBox="0 0 180 230" role="img" aria-label="A masked web-slinging hero">
        <defs>
          <linearGradient id="heroRed" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#ff3d3d" />
            <stop offset=".52" stopColor="#d51429" />
            <stop offset="1" stopColor="#790817" />
          </linearGradient>
          <linearGradient id="heroBlue" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#1976e9" />
            <stop offset=".55" stopColor="#074aa7" />
            <stop offset="1" stopColor="#031e55" />
          </linearGradient>
          <filter id="suitShadow"><feDropShadow dx="0" dy="7" stdDeviation="5" floodOpacity=".55" /></filter>
          <pattern id="webMesh" width="11" height="11" patternUnits="userSpaceOnUse">
            <path d="M5.5 0v11M0 5.5h11M1.7 1.7l7.6 7.6M9.3 1.7 1.7 9.3" stroke="#390912" strokeWidth=".55" opacity=".8" />
          </pattern>
        </defs>
        <g className="hero-body" filter="url(#suitShadow)">
          <g className="limb arm-left"><path d="M61 78 Q38 83 23 111 Q15 125 7 113" fill="none" stroke="url(#heroRed)" strokeWidth="17" strokeLinecap="round" /><path d="M8 114 2 104M8 114 18 110M8 114 12 126" stroke="#ff4048" strokeWidth="5" strokeLinecap="round" /></g>
          <g className="limb arm-right"><path d="M119 78 Q141 79 151 52 Q157 34 166 15" fill="none" stroke="url(#heroRed)" strokeWidth="17" strokeLinecap="round" /><path d="M166 16 174 6M166 16 158 5M166 16 178 19" stroke="#ff4048" strokeWidth="5" strokeLinecap="round" /></g>
          <path className="torso-blue" d="M61 72 Q90 56 119 72 L126 139 Q90 157 54 139Z" fill="url(#heroBlue)" stroke="#020b20" strokeWidth="3" />
          <path className="torso-red" d="M65 68 Q90 57 115 68 L120 112 103 131 90 119 77 131 59 111Z" fill="url(#heroRed)" stroke="#4a0711" strokeWidth="2.5" />
          <path d="M90 81c-5 8-12 10-18 11 7 2 12 6 18 15 6-9 11-13 18-15-6-1-13-3-18-11Z" fill="#10060a" />
          <path d="M90 88v24M79 94l-8 9M101 94l8 9M81 104l-9 11M99 104l9 11" stroke="#10060a" strokeWidth="2.5" strokeLinecap="round" />
          <g className="limb leg-left"><path d="M70 137 Q54 167 38 191 Q29 204 17 218" fill="none" stroke="url(#heroBlue)" strokeWidth="21" strokeLinecap="round" /><path d="M38 191 17 218" stroke="url(#heroRed)" strokeWidth="18" strokeLinecap="round" /></g>
          <g className="limb leg-right"><path d="M109 137 Q129 164 140 190 Q149 208 163 217" fill="none" stroke="url(#heroBlue)" strokeWidth="21" strokeLinecap="round" /><path d="M140 190 163 217" stroke="url(#heroRed)" strokeWidth="18" strokeLinecap="round" /></g>
          <g className="hero-head"><ellipse cx="90" cy="42" rx="27" ry="34" fill="url(#heroRed)" stroke="#480813" strokeWidth="3" /><ellipse cx="90" cy="42" rx="26" ry="33" fill="url(#webMesh)" /><path d="M68 29Q79 27 85 39 77 51 67 50 63 39 68 29ZM112 29Q101 27 95 39 103 51 113 50 117 39 112 29Z" fill="#eefaff" stroke="#090b11" strokeWidth="3" /></g>
        </g>
      </svg>
      <span className="curtain-rope rope-left" />
      <span className="curtain-rope rope-right" />
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
      window.setTimeout(() => setPhase('landed'), 4000),
      window.setTimeout(() => setPhase('gripping'), 4700),
      window.setTimeout(() => setPhase('pulling'), 5350),
      window.setTimeout(() => {
        setPhase('opening')
        reveal()
      }, 6100),
      window.setTimeout(finish, 7500),
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
    <div className={`hero-intro phase-${phase} ${opening ? 'is-opening' : ''}`} role="dialog" aria-label="Animated site introduction">
      <div className="intro-sky" aria-hidden="true">
        <div className="city city-back" />
        <div className="city city-front" />
        <div className="speed-lines" />
      </div>

      <div className="stage-curtain curtain-left" aria-hidden="true"><span /></div>
      <div className="stage-curtain curtain-right" aria-hidden="true"><span /></div>
      <div className="curtain-valance" aria-hidden="true" />
      <div className="stage-floor" aria-hidden="true" />
      <div className="landing-impact" aria-hidden="true"><i /><i /><i /><i /></div>

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
