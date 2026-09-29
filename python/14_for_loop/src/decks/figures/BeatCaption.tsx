import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useInstant } from '@/motion/instant'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'

/** The sentence under a walk figure, one per beat. Shared by the three skins. */
export function BeatCaption({
  label,
  caption,
  step,
  className = '',
}: {
  label?: string
  caption?: ReactNode
  /** Changes when the beat changes, so the line re-enters. */
  step: number
  className?: string
}) {
  const instant = useInstant()
  return (
    <div className={`min-h-[74px] rounded-card border border-line bg-surface px-6 py-4 ${className}`}>
      {caption && (
        <motion.div
          key={step}
          initial={instant ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: T.enter, ease: c4(E.out) }}
        >
          {label && (
            <div
              className="mb-1 font-heading text-body-sm font-bold uppercase tracking-wider"
              style={{ color: colors.brand }}
            >
              {label}
            </div>
          )}
          <p className="text-body-lg font-medium leading-snug" style={{ color: colors.ink }}>
            {caption}
          </p>
        </motion.div>
      )}
    </div>
  )
}
