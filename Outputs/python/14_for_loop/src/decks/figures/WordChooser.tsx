import { motion } from 'framer-motion'
import { useInstant } from '@/motion/instant'
import { useStepControls } from '@/motion/Stepper'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'

/**
 * THE WORD THE ROOM PICKS, before the string is split.
 *
 * WHY THIS EXISTS. The reference's string walk is a MACHINE: the room chooses
 * `"Python"`, `"Go"` or `""`, commits to how many characters that is, and only
 * then presses. Our first build hard-coded `"Python"` and drove the whole card
 * from the deck's build steps, which turns a machine into a slideshow: there is
 * nothing to get wrong, so there is nothing to be right about.
 *
 * `""` IS THE POINT, and it is why three words and not one. Six characters and
 * two characters both behave the way the room expects; the empty string is the
 * case that decides whether they have understood "once for each item" or have
 * just learned "it repeats". `slide-content-rules` rule 5 and
 * `pedagogy-to-components` Part IV: the empty case is taught, not mentioned.
 *
 * CHANGING THE WORD RESETS THE WALK. The reference does the same on its range
 * dial, and the reason is the same: the room must predict before EVERY reveal,
 * not only the first. A chooser that left the previous run on screen would let
 * the second and third words be watched rather than predicted.
 */
export function WordChooser({
  words,
  value,
  onChange,
  className = '',
}: {
  /** The literal as it is written in the program: `"Python"`, `"Go"`, `""`. */
  words: { literal: string; label: string }[]
  value: string
  onChange: (literal: string) => void
  className?: string
}) {
  const instant = useInstant()
  const { toStart } = useStepControls()

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="font-heading text-body-sm font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
        word
      </span>
      {words.map((w) => {
        const on = w.literal === value
        return (
          <motion.button
            key={w.literal}
            type="button"
            onClick={() => {
              if (w.literal === value) return
              onChange(w.literal)
              /* Back to before the split, so the next word is predicted too.
                 `toStart`, not `replay`: replay remounts the slide and this
                 card's chosen word lives in its own state. */
              toStart()
            }}
            className="rounded-pill border-2 px-4 py-1.5 font-mono text-body-sm font-bold"
            style={{
              borderColor: on ? colors.brand : colors.line,
              background: on ? colors.brand : colors.white,
              color: on ? colors.white : colors.body,
            }}
            animate={instant ? {} : { scale: on ? 1 : 0.98 }}
            transition={{ duration: T.label, ease: c4(E.out) }}
          >
            {w.label}
          </motion.button>
        )
      })}
    </div>
  )
}
