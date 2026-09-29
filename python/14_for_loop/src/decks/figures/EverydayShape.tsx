import { motion } from 'framer-motion'
import { useInstant } from '@/motion/instant'
import { useClaimedSteps } from '@/motion/Stepper'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'

/**
 * THE EVERYDAY SHAPE, once the three machines have been seen.
 *
 * NOT `LoopShape`, which is the Python construct: `for … in …:` over an
 * indented body. This one has no syntax in it on purpose. It is the beat
 * BEFORE the syntax, where the shape is still in the room's own words.
 *
 * WHY IT IS ITS OWN FRAME. Slide 5 shows a register, a story feed and a
 * scanner, and the room can see they rhyme without being able to say what the
 * rhyme IS. This is the abstraction beat: the same loop with the product chrome
 * taken off, so what is left is the list, the one job, and the return.
 * `pedagogy-to-components` Part I question 4a — a rich picture buys motivation,
 * is spent once, and is put away before the mechanism is named.
 *
 * THE RED LINE IS THE POINT. "Nowhere does it say six" is the whole hook's
 * question answered: no count appears anywhere in the shape, so nothing in the
 * program had to know how many there were. It is the last beat, not the first,
 * because it only lands once the room has looked for a number and not found one.
 *
 * DOM for every label, SVG only for the two arrows, which carry no text
 * (content rule 17). Colours from tokens. Course rule R5c item 7: a construct is
 * drawn with its block, its arrow and its return.
 */

const BEATS = 5

export function EverydayShape({ items = 6, className = '' }: { items?: number; className?: string }) {
  const instant = useInstant()
  const shown = useClaimedSteps(BEATS)
  const at = shown.filter(Boolean).length
  const fade = (n: number) => ({
    initial: instant ? false : { opacity: 0, y: 8 },
    animate: { opacity: at >= n ? 1 : 0, y: 0 },
    transition: { duration: T.enter, ease: c4(E.out) },
  })

  return (
    <div className={`relative mx-auto flex w-[640px] flex-col items-center ${className}`}>
      {/* 1 — the list */}
      <motion.div
        className="rounded-card border px-5 py-3"
        style={{ borderColor: colors.line, background: colors.surface }}
        {...fade(1)}
      >
        <div className="mb-2 font-heading text-body-sm font-bold" style={{ color: colors.brandDark }}>
          the list
        </div>
        <div className="flex gap-2.5">
          {Array.from({ length: items }, (_, i) => (
            <span
              key={i}
              className="grid h-[42px] w-[42px] place-items-center rounded-lg border-2"
              style={{ borderColor: colors.brand, background: colors.white }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden fill={colors.brand}>
                <path d="M9 18V5l10-2v13" stroke={colors.brand} strokeWidth="2" fill="none" strokeLinecap="round" />
                <circle cx="6.5" cy="18" r="2.6" />
                <circle cx="16.5" cy="16" r="2.6" />
              </svg>
            </span>
          ))}
        </div>
      </motion.div>

      {/* 2 — down, into the job */}
      <motion.div className="flex items-center gap-3" {...fade(2)}>
        <svg width="20" height="46" viewBox="0 0 20 46" aria-hidden>
          <path d="M10 2 V34" stroke={colors.brandDark} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M4 30 L10 38 L16 30" fill="none" stroke={colors.brandDark} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-body-sm" style={{ color: colors.body }}>
          take the next one
        </span>
      </motion.div>

      {/* 3 — the one job */}
      <motion.div
        className="rounded-card border-2 px-12 py-4"
        style={{ borderColor: colors.brandDark, background: `${colors.brand}12` }}
        {...fade(3)}
      >
        <span className="font-heading text-[22px] font-bold" style={{ color: colors.brandDark }}>
          do one job
        </span>
      </motion.div>

      {/* 4 — and back for the next. The return is drawn AROUND the left, from
          under the job up to the list, because a loop that returns is the one
          thing a stack of boxes cannot say. A short arrow under the box reads
          as another step down, which is the opposite. */}
      <motion.div className="relative h-[54px] w-full" {...fade(4)}>
        <svg
          className="absolute left-0 top-0 h-full w-full overflow-visible"
          viewBox="0 0 640 54"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M320 0 V34 H150 V-196"
            fill="none"
            stroke={colors.brand}
            strokeWidth="2.5"
            strokeDasharray="7 6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <svg className="absolute left-[142px] top-[-200px]" width="18" height="14" viewBox="0 0 18 14" aria-hidden>
          <path d="M2 12 L9 2 L16 12" fill="none" stroke={colors.brand} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span
          className="absolute left-1/2 top-[36px] -translate-x-1/2 whitespace-nowrap text-body-sm"
          style={{ color: colors.body }}
        >
          when it ends, go back for the next one
        </span>
      </motion.div>

      {/* 5 — the answer to the hook's question */}
      <motion.p
        className="mt-3 font-heading text-[20px] font-bold"
        style={{ color: colors.danger }}
        {...fade(5)}
      >
        Nowhere does it say six.
      </motion.p>
    </div>
  )
}
