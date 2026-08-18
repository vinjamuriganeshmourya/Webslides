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

        {/*
          right — mascot

          BOTTOM ALIGNED, AND SMALLER THAN IT LOOKS LIKE IT SHOULD BE.
          This column straddles x=913, which is the left edge of the reserved
          instructor-video rectangle (x 913..1280, y 0..220). Centred at h-[78%]
          the mascot's head reached y≈115 and `video-safe.mjs` reported it 372px
          into the reserved area. Pinning the figure to the floor and capping it
          at 66% puts its top at roughly y=243, clear of the rectangle with room
          to spare. Do not re-centre it: the mascot is the only element in the
          kit tall enough to reach up there, and the harness is the only thing
          that would notice.
        */}
        <motion.div
          className="relative grid h-full place-items-end justify-items-center"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="pointer-events-none absolute bottom-8 h-56 w-56 rounded-full bg-success/15 blur-2xl" />
          <Illustration name="recap" className="relative h-[66%] w-auto" />
        </motion.div>
      </div>
    </SlideBase>
  )
}
