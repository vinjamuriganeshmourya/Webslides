import { motion } from 'framer-motion'
import { SlideBase, ZonedFrame, BulletList, Illustration } from '@/ui'
import type { RecapSlideProps } from '@/slides/types'

/**
 * Session-local override of slide-template/src/slides/RecapSlide.tsx. Remove
 * when the kit PR lands.
 *
 * WHY. The kit's recap paints its header in the success tone, so slide 2 was
 * the one slide in the deck with a green gradient bar and a green kicker
 * beside the title (review, 2026-10-01). The header here takes the brand tone
 * every other content slide uses. Everything else is the kit's recap exactly:
 * the checklist with its green ticks, the narrowed body box, the mascot pinned
 * to the floor and capped at 66% so it stays clear of the instructor-video
 * rectangle.
 */
export function RecapBrand({ kicker = 'Recap', title = 'Before we begin…', points, immediate = false, lesson }: RecapSlideProps) {
  const twoCols = points.length > 4
  const mid = Math.ceil(points.length / 2)
  const columns = twoCols ? [points.slice(0, mid), points.slice(mid)] : [points]
  return (
    <SlideBase variant="light" lesson={lesson} padded={false}>
      <ZonedFrame kicker={kicker} title={title} tone="brand" bodyWidth={628}>
        <div className={`grid gap-x-10 gap-y-0 ${twoCols ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {columns.map((group, i) => (
            <BulletList key={i} items={group} marker="check" tone="success" immediate={immediate} />
          ))}
        </div>
      </ZonedFrame>
      <motion.div
        className="absolute grid place-items-end justify-items-center"
        style={{ left: 732, top: 48, width: 484, height: 608 }}
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <div className="pointer-events-none absolute bottom-8 h-56 w-56 rounded-full bg-success/15 blur-2xl" />
        <Illustration name="recap" className="relative h-[66%] w-auto" />
      </motion.div>
    </SlideBase>
  )
}
