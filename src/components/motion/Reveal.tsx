'use client'

import { motion } from 'motion/react'
import type { ReactNode, ElementType } from 'react'
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

export function Reveal({ children, as = 'div', className, delay = 0 }: RevealProps) {
  const { mode } = useMode()
  const reduced = usePrefersReducedMotion()
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
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
  const reduced = usePrefersReducedMotion()
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-8% 0px -8% 0px' }}
      variants={staggerVariants(mode, reduced)}
    >
      {children}
    </MotionTag>
  )
}

/** A child of RevealGroup. Inherits the parent's stagger. */
export function RevealItem({ children, as = 'div', className }: Omit<RevealProps, 'delay'>) {
  const { mode } = useMode()
  const reduced = usePrefersReducedMotion()
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div

  return (
    <MotionTag className={className} variants={riseVariants(mode, reduced)}>
      {children}
    </MotionTag>
  )
}
