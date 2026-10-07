import { motion } from 'framer-motion'
import { useInstant } from '@/motion/instant'
import { useStepControls } from '@/motion/Stepper'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'

/**
 * THE NARRATION, ON THE FRAME, ONE BEAT PER PRESS.
 *
 * WHY IT EXISTS. The reference decks carry the instructor's sentence for each
 * beat on the slide itself: `Line 6  It prints 16. That is Riya's money after 7
 * days.` This deck joined those sentences into one `notes:` string, so the room
 * watched variable boxes change with nothing on screen telling it what had just
 * happened. A trace that cannot be read without the instructor's voice is a
 * trace a recording cannot teach from.
 *
 * THE LABEL IS INLINE WITH THE SENTENCE, as the reference sets it, not stacked
 * above it. Two lines of chrome under a trace that already fills the frame is
 * height this slide does not have, and the label is an address (`Line 6`, `Day
 * 3`) rather than a heading.
 *
 * IT CLAIMS NO STEPS OF ITS OWN. It reads the DECK's step, exactly as
 * `PiggyMeter` and `DayStrip` do, so the sentence and the figure it narrates
 * cannot drift, and adding it never changes a slide's step count.
 *
 * `allRevealed` is honoured: under `?all` the deck's step never moves, so
 * reading `step` alone would leave every contact sheet showing beat zero beside
 * a figure showing its last.
 */
export interface CaptionBeat {
  /** The reference's own beat name: `Line 3`, `Day 2`, `The pair`. */
  label: string
  text: string
}

export function StepCaption({
  beats,
  className = '',
}: {
  beats: CaptionBeat[]
  className?: string
}) {
  const instant = useInstant()
  const { step, allRevealed } = useStepControls()
  const shown = allRevealed ? beats.length : step
  const i = Math.min(shown, beats.length) - 1
  const beat = i >= 0 ? beats[i] : undefined

  return (
    <div
      className={`flex min-h-[38px] items-center rounded-card border-l-4 bg-surface px-5 py-1.5 ${className}`}
      style={{ borderColor: colors.brand }}
    >
      {beat && (
        <motion.p
          key={i}
          className="text-body leading-snug"
          initial={instant ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: T.enter, ease: c4(E.out) }}
        >
          <span className="font-heading font-bold" style={{ color: colors.brandDark }}>
            {beat.label}
          </span>{' '}
          <span style={{ color: colors.ink }}>{beat.text}</span>
        </motion.p>
      )}
    </div>
  )
}
