'use client'

import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { useMode } from '@/lib/mode'
import { usePrefersReducedMotion } from '@/lib/motion'

function LessonIdea({ position, index, progress }: { position: number; index: number; progress: MotionValue<number> }) {
  const scale = useTransform(progress, [position / 100 - .08, position / 100], [.25, 1])
  return <motion.span className="lesson-idea" style={{ top: `${position}%`, scale }}><i /><b>{index + 1}</b></motion.span>
}

export function ScrollAtmosphere() {
  const { mode, lofi } = useMode()
  const reduced = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 75, damping: 24, mass: 0.35 })
  const dash = useTransform(progress, [0, 1], [1080, 0])
  const travel = useTransform(progress, [0, 1], ['8%', '92%'])
  const turn = useTransform(progress, [0, 1], [0, 540])
  const scan = useTransform(progress, [0, 1], ['4%', '94%'])

  if (reduced || lofi) return null

  return (
    <div className={`scroll-atmosphere atmosphere-${mode}`} aria-hidden="true">
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />

      {mode === 'engineering' && (
        <>
          <svg className="engineering-trace" viewBox="0 0 80 1080" preserveAspectRatio="none">
            <motion.path
              d="M40 0v105l-18 18 36 25-36 26 36 28-18 18v145l-24 17 48 31-48 30 48 32-24 19v145l-20 22 40 22-40 25 40 25-20 21v146"
              style={{ strokeDashoffset: dash }}
            />
          </svg>
          <motion.span className="signal-probe" style={{ top: travel }}><i /></motion.span>
        </>
      )}

      {mode === 'research' && (
        <>
          <motion.div className="research-scan" style={{ top: scan }} />
          <motion.div className="research-lens" style={{ top: travel, rotate: turn }}>
            <span /><i /><b />
          </motion.div>
        </>
      )}

      {mode === 'scholarship' && (
        <>
          <svg className="lesson-line" viewBox="0 0 100 1080" preserveAspectRatio="none">
            <motion.path d="M50 0C4 110 96 190 50 290S4 470 50 570s46 180 0 280S4 990 50 1080" style={{ strokeDashoffset: dash }} />
          </svg>
          {[18, 39, 61, 82].map((position, index) => (
            <LessonIdea key={position} position={position} index={index} progress={progress} />
          ))}
        </>
      )}

      {mode === 'everything' && (
        <motion.div className="story-orbit" style={{ top: travel, rotate: turn }}>
          <i /><i /><i /><span />
        </motion.div>
      )}
    </div>
  )
}
