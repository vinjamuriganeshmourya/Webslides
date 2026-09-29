import { AnimatePresence, motion } from 'framer-motion'
import { useInstant } from '@/motion/instant'
import { useStepControls } from '@/motion/Stepper'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'

/**
 * WHAT `total` HAS BEEN, NOT JUST WHAT IT IS.
 *
 * WHY IT EXISTS. A variable box shows one value, and the whole claim of an
 * accumulator is that the value it holds now was built out of the values it held
 * before. The reference draws the run as a chain, `0 -> 1 -> 4 -> 9 -> 16`, with
 * every superseded value struck through, so the room can see four additions in
 * one glance instead of holding four frames in its head. Dropping it left the
 * frame unable to say where 16 came from.
 *
 * IT CLAIMS NO STEPS. Like `PiggyMeter`, it reads the DECK's step, so it cannot
 * drift from the trace beside it, and it honours `allRevealed` so the contact
 * sheet shows the finished chain rather than an empty row.
 *
 * DOM, never SVG (content rule 17). Colours from tokens.
 */
export function TotalChain({
  label,
  /** The value `total` holds after each step of the trace, as displayed. */
  values,
  className = '',
}: {
  label: string
  values: string[]
  className?: string
}) {
  const instant = useInstant()
  const { step, allRevealed } = useStepControls()
  const shown = allRevealed ? values.length : Math.min(step, values.length)

  /* The chain is the values that actually CHANGED, in order. A skipped day
     leaves `total` alone, and a repeated number in the chain would say an
     addition happened when none did. */
  const chain: string[] = []
  for (let i = 0; i < shown; i += 1) {
    if (chain[chain.length - 1] !== values[i]) chain.push(values[i])
  }

  return (
    <div className={`flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 ${className}`}>
      <span
        className="font-heading text-body-sm font-bold uppercase tracking-wider"
        style={{ color: colors.muted }}
      >
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <AnimatePresence initial={false}>
          {chain.map((v, i) => {
            const live = i === chain.length - 1
            return (
              <motion.span
                key={`${i}-${v}`}
                className="flex items-center gap-2"
                initial={instant ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: T.label, ease: c4(E.out) }}
              >
                {i > 0 && (
                  <span className="font-body text-[18px] leading-none" style={{ color: colors.muted }}>
                    {'→'}
                  </span>
                )}
                <span
                  className="inline-flex min-w-[52px] items-center justify-center rounded-card border px-3 py-1 font-mono text-[20px] font-bold leading-none"
                  style={{
                    borderColor: live ? colors.brand : colors.line,
                    background: live ? colors.surface2 : colors.white,
                    color: live ? colors.brandDark : colors.muted,
                    textDecoration: live ? 'none' : 'line-through',
                  }}
                >
                  {v}
                </span>
              </motion.span>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
