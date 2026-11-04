'use client'

import { motion, useInView } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode, type ElementType } from 'react'
import { useMode } from '@/lib/mode'
import { usePrefersReducedMotion, riseVariants, staggerVariants } from '@/lib/motion'

/**
 * Scroll-reveal primitives. Animation supports the story of each page.
 *
 * Every reveal on the site goes through these two components, so the motion
 * language changes with the visitor mode automatically and reduced-motion is
 * handled in exactly one place. `once: true` means content never re-animates
 * when scrolling back up, which is what makes long pages readable.
 */

type RevealProps = {
  children: ReactNode
  as?: ElementType
  className?: string
  /** Extra delay in seconds, for hand-tuned sequences. */
  delay?: number
}

/**
 * Whether this element should wait offscreen and animate in when reached.
 *
 * Decided after mount and only for elements wholly below the fold, so the
 * exported HTML and the first paint are always the finished page.
 */
function useDeferredEntrance<T extends Element>(margin: string) {
  const ref = useRef<T>(null)
  const { lofi } = useMode()
  const reduced = usePrefersReducedMotion()
  const [deferred, setDeferred] = useState(false)
  const inView = useInView(ref, { once: true, margin: margin as `${number}px` })

  useEffect(() => {
    // Read the query here too: on the first pass `reduced` is still its pre-mount false.
    const still = reduced || lofi || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (still) return setDeferred(false)
    if (ref.current && ref.current.getBoundingClientRect().top > window.innerHeight) setDeferred(true)
  }, [reduced, lofi])

  return { ref, reduced: reduced || lofi, state: deferred && !inView ? 'hidden' : 'visible' }
}

export function Reveal({ children, as = 'div', className, delay = 0 }: RevealProps) {
  const { mode } = useMode()
  const { ref, reduced, state } = useDeferredEntrance<HTMLDivElement>('-10% 0px -10% 0px')
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={false}
      animate={state}
      variants={riseVariants(mode, reduced)}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </MotionTag>
  )
}

/** Container that staggers its Reveal children. */
export function RevealGroup({
  children,
  as = 'div',
  className,
}: Omit<RevealProps, 'delay'>) {
  const { mode } = useMode()
  const { ref, reduced, state } = useDeferredEntrance<HTMLDivElement>('-8% 0px -8% 0px')
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={false}
      animate={state}
      variants={staggerVariants(mode, reduced)}
    >
      {children}
    </MotionTag>
  )
}

/** A child of RevealGroup. Inherits the parent's stagger. */
export function RevealItem({ children, as = 'div', className }: Omit<RevealProps, 'delay'>) {
  const { mode } = useMode()
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div

  return (
    <MotionTag className={className} variants={riseVariants(mode, false)}>
      {children}
    </MotionTag>
  )
}
