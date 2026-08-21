import { motion } from 'framer-motion'
import { SlideBase, SlideHeader, BulletList, Illustration } from '@/ui'
import type { RecapSlideProps } from './types'

/**
 * RECAP — a warm, quick-to-scan reminder of the previous session.
 * Success-toned checklist on the left (splits into two columns when long),
 * friendly mascot on the right.
 */
export function RecapSlide({
  kicker = 'Recap',
  title = 'Before we begin…',
  points,
  lesson,
}: RecapSlideProps) {
  const twoCols = points.length > 4
  const mid = Math.ceil(points.length / 2)
  const columns = twoCols ? [points.slice(0, mid), points.slice(mid)] : [points]

  return (
    <SlideBase variant="light" lesson={lesson}>
      <div className="grid h-full grid-cols-[1.3fr_1fr] items-center gap-10">
        {/* left — recap checklist */}
        <div className="flex flex-col justify-center">
          <SlideHeader kicker={kicker} title={title} tone="success" />
          <div className={`mt-8 grid gap-x-10 gap-y-0 ${twoCols ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {columns.map((group, i) => (
              <BulletList key={i} items={group} marker="check" tone="success" />
            ))}
          </div>
        </div>

        {/* right — mascot */}
        <motion.div
          className="relative grid h-full place-items-center"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="absolute h-64 w-64 rounded-full bg-success/15 blur-2xl" />
          <Illustration name="recap" className="relative h-[78%] w-auto" />
        </motion.div>
      </div>
    </SlideBase>
  )
}
