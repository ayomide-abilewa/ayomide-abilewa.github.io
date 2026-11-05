'use client'

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { useMode } from '@/lib/mode'

/**
 * Scroll-reveal primitives.
 *
 * The exported HTML and the first paint are always the finished page. After
 * mount, an element that starts wholly below the fold is marked hidden and
 * rises in when it is reached; everything else is left alone. The transition
 * itself, its per-mode timing and the stagger live in globals.css.
 */

type RevealProps = {
  children: ReactNode
  as?: ElementType
  className?: string
  /** Extra delay in seconds, for hand-tuned sequences. */
  delay?: number
}

type RevealState = 'hidden' | 'shown' | undefined

function useDeferredEntrance(rootMargin: string) {
  const ref = useRef<HTMLElement>(null)
  const { lofi } = useMode()
  const [state, setState] = useState<RevealState>(undefined)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (lofi || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setState(undefined)
      return
    }
    if (el.getBoundingClientRect().top <= window.innerHeight) return

    setState('hidden')
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setState('shown')
          observer.disconnect()
        }
      },
      { rootMargin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [lofi, rootMargin])

  return { ref, state }
}

export function Reveal({ children, as: Tag = 'div', className, delay = 0 }: RevealProps) {
  const { ref, state } = useDeferredEntrance('-10% 0px -10% 0px')
  return (
    <Tag
      ref={ref}
      className={className}
      data-reveal={state}
      style={delay ? ({ '--reveal-delay': `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}

/** Container that staggers its RevealItem children. */
export function RevealGroup({ children, as: Tag = 'div', className }: Omit<RevealProps, 'delay'>) {
  const { ref, state } = useDeferredEntrance('-8% 0px -8% 0px')

  useEffect(() => {
    ref.current?.querySelectorAll<HTMLElement>(':scope > [data-reveal-item]').forEach((item, i) => {
      item.style.setProperty('--reveal-index', String(i))
    })
  }, [ref, children])

  return (
    <Tag ref={ref} className={className} data-reveal-group={state}>
      {children}
    </Tag>
  )
}

/** A child of RevealGroup. Inherits the parent's stagger. */
export function RevealItem({ children, as: Tag = 'div', className }: Omit<RevealProps, 'delay'>) {
  return (
    <Tag className={className} data-reveal-item="">
      {children}
    </Tag>
  )
}
