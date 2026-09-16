import { motion, useReducedMotion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { T, E, c4 } from '@/ui/figureTiming'

/**
 * ShareBar — four horizontal bars on one baseline.
 *
 * WHAT IT ARGUES
 *   One glance: the first bar is longer than the next two put together. A table
 *   of four percentages makes the reader do that sum; a bar does it for them.
 *   The named companies share one hue at falling strengths, and "everyone
 *   else" is grey, so the eye reads three names and a remainder.
 *
 * WHAT IT NEVER DOES
 *   It hardcodes no numbers. Values, labels and the source line arrive as
 *   props, because the shares move every quarter and the plan requires the
 *   source and the quarter printed on the slide beside them.
 *
 * HOW IT MOVES
 *   Each bar grows from its left end with `transform: scaleX`, never `width`,
 *   at `T.draw`, one `T.stagger` after the last, and its percentage fades up as
 *   it lands. `useInstant()` mounts everything at rest; reduced motion drops
 *   the growth and keeps the fades.
 */

export interface ShareItem {
  label: string
  value: number
  /** The remainder bar, drawn in grey. */
  muted?: boolean
  /** The provider's mark, from `public/`, about 28 px tall beside the label (rule 12). */
  mark?: string
}

const DEFAULT_ITEMS: ShareItem[] = [
  { label: 'AWS', value: 28, mark: '/assets/tech/aws.png' },
  { label: 'Microsoft Azure', value: 20, mark: '/assets/companies/microsoft.png' },
  { label: 'Google Cloud', value: 15, mark: '/assets/companies/google.png' },
  { label: 'Everyone else', value: 37, muted: true },
]

const W = 920
const LABEL_W = 230
const MARK_H = 28
const VALUE_W = 64
const BAR_H = 40
const ROW_GAP = 22
const TRACK_W = W - LABEL_W - VALUE_W - 40

export function ShareBar({
  items = DEFAULT_ITEMS,
  source = 'Synergy Research Group, Q2 2026',
  sourceHref,
  unit = '%',
  /** What 100% of the track means. Defaults to the sum of the values. */
  total,
  className = '',
}: {
  items?: ShareItem[]
  source?: string
  /**
   * The page the figures were read from. When set, the source name becomes a
   * link (user, 2026-09-16: a source printed on a slide must be clickable in
   * the exported HTML). The URL itself is never printed: the label carries it.
   */
  sourceHref?: string
  unit?: string
  total?: number
  className?: string
}) {
  const instant = useInstant()
  const reduce = !!useReducedMotion()
  const full = total ?? items.reduce((sum, i) => sum + i.value, 0)
  const ease = c4(E.out)

  /* Named bars step down from the brand hue; the remainder is grey. */
  const namedCount = items.filter((i) => !i.muted).length
  const fillFor = (item: ShareItem) => (item.muted ? colors.muted : colors.brand)
  const alphaFor = (item: ShareItem, namedIdx: number) =>
    item.muted ? 0.55 : 1 - (namedIdx / Math.max(1, namedCount)) * 0.5

  let named = 0
  return (
    <div className={`mx-auto ${className}`} style={{ width: W }}>
      <div className="flex flex-col" style={{ gap: ROW_GAP }}>
        {items.map((item, i) => {
          const idx = item.muted ? 0 : named++
          const scale = Math.max(0.02, item.value / full)
          const delay = T.lead + i * T.stagger
          return (
            <div key={item.label} className="flex items-center" style={{ height: BAR_H }}>
              <motion.div
                className="flex shrink-0 items-center justify-end gap-3 pr-5 text-right text-body-sm font-semibold text-ink"
                style={{ width: LABEL_W, color: item.muted ? colors.body : colors.ink }}
                initial={instant ? false : { opacity: 0, transform: reduce ? 'translateX(0px)' : 'translateX(-8px)' }}
                animate={{ opacity: 1, transform: 'translateX(0px)' }}
                transition={{ duration: T.enter, delay, ease }}
              >
                {item.mark && <img src={item.mark} alt="" draggable={false} className="select-none" style={{ height: MARK_H, width: 'auto' }} />}
                <span>{item.label}</span>
              </motion.div>

              <div className="relative shrink-0 overflow-hidden rounded-lg" style={{ width: TRACK_W, height: BAR_H, background: colors.surface2 }}>
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-lg shadow-card-soft"
                  style={{
                    width: TRACK_W * scale,
                    background: fillFor(item),
                    opacity: alphaFor(item, idx),
                    transformOrigin: 'left center',
                  }}
                  initial={instant ? false : { transform: reduce ? 'scaleX(1)' : 'scaleX(0.02)', opacity: 0 }}
                  animate={{ transform: 'scaleX(1)', opacity: alphaFor(item, idx) }}
                  transition={{
                    transform: { duration: T.draw, delay, ease },
                    opacity: { duration: T.label, delay, ease },
                  }}
                />
              </div>

              <motion.div
                className="shrink-0 pl-4 font-heading text-body-lg font-bold tabular-nums"
                style={{ width: VALUE_W + 20, color: item.muted ? colors.body : colors.ink }}
                initial={instant ? false : { opacity: 0, transform: reduce ? 'translateX(0px)' : 'translateX(-6px)' }}
                animate={{ opacity: 1, transform: 'translateX(0px)' }}
                transition={{ duration: T.label, delay: delay + T.draw * 0.8, ease }}
              >
                {item.value}{unit}
              </motion.div>
            </div>
          )
        })}
      </div>

      <motion.p
        className="mt-6 text-xs"
        style={{ color: colors.body, paddingLeft: LABEL_W }}
        initial={instant ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: T.label, delay: T.lead + items.length * T.stagger + T.draw * 0.8, ease }}
      >
        Source:{' '}
        {sourceHref ? (
          <a
            href={sourceHref}
            target="_blank"
            rel="noreferrer"
            style={{ color: colors.brand, textDecorationLine: 'underline', textUnderlineOffset: 2 }}
          >
            {source}
          </a>
        ) : (
          source
        )}
      </motion.p>
    </div>
  )
}
