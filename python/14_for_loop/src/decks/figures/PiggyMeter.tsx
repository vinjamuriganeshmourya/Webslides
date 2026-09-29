import { AnimatePresence, motion } from 'framer-motion'
import { useInstant } from '@/motion/instant'
import { useStepControls } from '@/motion/Stepper'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'
import { PiggyJar } from './PiggyBank'

/**
 * THE BANK, BESIDE THE TRACE.
 *
 * The trace card proves the program is correct; this is what makes it about
 * Riya. The reference draws the piggy bank filling right next to the variable
 * boxes, and the rebuild kept the boxes and dropped the bank, which turns a
 * story back into an exercise. `total` is the only number on this frame the
 * room actually cares about, and it is the one that was drawn as a rectangle
 * with a number in it.
 *
 * It reads the DECK's step rather than owning one, so it cannot drift from the
 * trace beside it: step `k` shows `totals[k - 1]`, exactly what the trace's own
 * step `k` is showing. No extra build steps are claimed.
 *
 * The bank is `PiggyJar`, the same component the story card draws, so the two
 * frames show one object rather than two near misses of it.
 */
export function PiggyMeter({
  totals,
  coins,
  row = false,
  className = '',
}: {
  /** The bank's contents after each step, as displayed: '₹0', '₹1', … */
  totals: string[]
  /** The coin that went in on that step, or undefined on a skipped day. */
  coins?: (string | undefined)[]
  /**
   * Jar and total side by side instead of stacked. A frame that puts the bank
   * in a column under the output panel has the width to spare and not the
   * height: stacked, the bank alone cost this slide 210px and pushed the
   * controls under the player's own.
   */
  row?: boolean
  className?: string
}) {
  const instant = useInstant()
  const { step, allRevealed } = useStepControls()
  /* Under `?all` the deck's step never moves, so reading `step` alone put the
     bank at zero beside a trace showing sixteen, on every contact sheet and
     every QA capture. It cannot claim steps of its own to find out -- that
     would double the slide's step count -- so it asks whether everything is
     revealed and lands on the last value. */
  const shown = allRevealed ? totals.length : step
  const i = Math.max(0, Math.min(shown, totals.length) - 1)
  const total = shown > 0 ? totals[i] : totals[0]
  const coin = shown > 0 && !allRevealed ? coins?.[i] : undefined

  return (
    <div className={`flex ${row ? 'items-center justify-center gap-3' : 'flex-col items-center'} ${className}`}>
      <div className="relative">
        <PiggyJar happy={Boolean(coin) || step === 0} width={row ? 92 : 132} />
        {/* The coin only exists on a day money went in. On a skipped day there
            is nothing to draw, which is the point of the skipped day. */}
        <AnimatePresence>
          {coin && (
            <motion.span
              key={`${i}-${coin}`}
              className="absolute left-1/2 top-[-6px] grid h-8 w-8 place-items-center rounded-full font-heading text-[14px] font-bold"
              style={{ background: colors.warning, color: colors.ink }}
              initial={instant ? false : { opacity: 0, y: -22, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: T.travel, ease: c4(E.out) }}
            >
              {coin}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {/* In `row` mode the label is the card's own header, one line, the same
          shape the story card uses. Beside the number it wrapped to three. */}
      <div
        className={
          row
            ? 'overflow-hidden rounded-card border border-line bg-white shadow-card-soft'
            : 'mt-1 flex flex-col items-center'
        }
      >
        {row && (
          <div className="border-b border-line bg-surface px-4 py-1 text-center">
            <span className="font-heading text-body-sm font-bold leading-none" style={{ color: colors.body }}>
              In the piggy bank
            </span>
          </div>
        )}
      <div className={row ? 'grid h-[46px] place-items-center' : 'rounded-card border border-line bg-white px-5 py-1.5 shadow-card-soft'}>
        <motion.span
          key={total}
          className="font-mono text-[26px] font-bold leading-none"
          style={{ color: colors.brandDark }}
          initial={instant ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: T.label, ease: c4(E.out) }}
        >
          {total}
        </motion.span>
      </div>
      {!row && (
        <span
          className="mt-1 font-heading text-body-sm font-bold uppercase tracking-wider"
          style={{ color: colors.muted }}
        >
          in the piggy bank
        </span>
      )}
      </div>
    </div>
  )
}
