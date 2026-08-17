import { motion } from 'framer-motion'
import { SlideBase, SlideHeader, BulletList, Illustration } from '@/ui'
import type { KeyTakeawaysSlideProps } from './types'

/**
 * KEY TAKEAWAYS — closing recap. Star-marked accent bullets on the left,
 * Nova having an idea on the right over a soft brand glow.
 */
export function KeyTakeawaysSlide({
  kicker = 'Key Takeaways',
  title = 'Key takeaways',
  lead,
  points,
  lesson,
}: KeyTakeawaysSlideProps) {
  return (
    <SlideBase variant="light" lesson={lesson}>
      <div className="grid h-full grid-cols-[1.3fr_1fr] items-center gap-12">
        {/* left — the takeaways; header pinned top-left, list centered below */}
        <div className="flex h-full flex-col">
          <SlideHeader kicker={kicker} title={title} lead={lead} tone="accent" />
          <div className="flex min-h-0 flex-1 flex-col justify-center">
            <BulletList items={points} marker="star" tone="accent" />
          </div>
        </div>

        {/* right — mascot with soft glow */}
        <motion.div
          className="relative grid h-full place-items-end justify-items-center"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="absolute h-64 w-64 rounded-full bg-brand-500/10 blur-2xl" />
          <Illustration name="nova-idea" className="relative h-[60%] w-auto" />
        </motion.div>
      </div>
    </SlideBase>
  )
}
