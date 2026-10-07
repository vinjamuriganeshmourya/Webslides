import { motion } from 'framer-motion'
import { SlideBase, SlideHeader, BulletList, Illustration } from '@/ui'
import { SlideLead } from '@/ui/SlideLead'
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
          <SlideHeader kicker={kicker} title={title} tone="nw" />
          {/*
            The point opens the left column's well, above the takeaways. The heading
            and the recap both live in this column and the mascot has the other, so
            this is the whole of the slide's text well.

            It sits OUTSIDE the centred block, directly under the heading, for the
            same reason as on `ContentSlide`: centred along with the takeaways it
            drifted down the canvas and read as the first takeaway rather than as
            the line introducing them.
          */}
          {lead && <SlideLead tone="nw">{lead}</SlideLead>}
          <div className="flex min-h-0 flex-1 flex-col justify-center">
            {/* IMMEDIATE, NOT CLICK-GATED. This frame carries no step controls
                and the deck's arrow keys move slides, so gated points could not
                be reached at all: the recap rendered as a heading over an empty
                column. It is also the case `BulletList` documents `immediate`
                for -- a list beside a supporting visual, which here is Nova. */}
            <BulletList immediate items={points} marker="star" tone="nw" />
          </div>
        </div>

        {/* right — mascot with soft glow */}
        <motion.div
          className="relative grid h-full place-items-end justify-items-center"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="absolute h-64 w-64 rounded-full bg-nw-blue/10 blur-2xl" />
          <Illustration name="nova-idea" className="relative h-[60%] w-auto" />
        </motion.div>
      </div>
    </SlideBase>
  )
}
