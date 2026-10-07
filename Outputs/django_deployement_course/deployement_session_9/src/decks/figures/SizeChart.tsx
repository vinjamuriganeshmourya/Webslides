import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { T } from '@/ui/figureTiming'
import { Rise, drawAnim, useFigureAnim, at, ease } from './figureMotion'

/**
 * SizeChart — sizes on a rack: same cut, bigger size.
 *
 * WHAT IT ARGUES
 *   A table of instance types gives numbers. Three boxes on one baseline give
 *   the SHAPE of the choice: the same width for every box, because the vCPU
 *   count is the same, and a height that doubles with the memory. The smallest
 *   box carries the brand border and the chip, because it is the one this
 *   course picks.
 *
 * HOW IT MOVES
 *   The baseline traces first. Boxes rise from it, small to large at
 *   `T.stagger`, with `scaleY` from 0.9 and `transform-origin: bottom`, never
 *   from 0. The chips under each foot fade with their box. The "same" label
 *   fades up last, because it is the fact that makes the widths equal.
 */

export interface SizeRow {
  name: string
  ram: string
  /** Box height in px. Height doubles with memory. */
  height: number
}

const W = 460
const H = 300
const BOX_W = 110
const GAP = 40
const BASE_Y = 236

export function SizeChart({
  sizes,
  same = '2 vCPU each',
  pick = 0,
  pickChip = 'this course',
  className = '',
}: {
  sizes: SizeRow[]
  same?: string
  pick?: number
  pickChip?: string
  className?: string
}) {
  const a = useFigureAnim()
  const total = sizes.length * BOX_W + (sizes.length - 1) * GAP
  const x0 = (W - total) / 2
  const tBase = at(0)
  const tBox = (i: number) => at(1 + i)
  const tSame = tBox(sizes.length) + T.enter

  return (
    <div className={`relative mx-auto ${className}`} style={{ width: W, height: H }}>
      <svg className="absolute inset-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden>
        <motion.line x1={x0 - 16} y1={BASE_Y} x2={x0 + total + 16} y2={BASE_Y} stroke={colors.ink} strokeWidth={2.5} strokeLinecap="round" {...drawAnim(a, tBase, T.drawStep)} />
      </svg>

      {sizes.map((row, i) => {
        const x = x0 + i * (BOX_W + GAP)
        const picked = i === pick
        const tone = picked ? colors.brand : colors.body
        return (
          <div key={row.name}>
            {/* the box rises from the baseline */}
            <motion.div
              className="absolute flex flex-col items-center justify-center rounded-xl bg-white shadow-card-soft"
              style={{ left: x, top: BASE_Y - row.height, width: BOX_W, height: row.height, border: `2px solid ${tone}`, transformOrigin: 'bottom center' }}
              initial={a.instant ? false : { opacity: 0, transform: a.reduce ? 'scaleY(1)' : 'scaleY(0.9)' }}
              animate={{ opacity: 1, transform: 'scaleY(1)' }}
              transition={{ duration: T.enter, delay: tBox(i), ease }}
            >
              <span className="font-mono text-[17px] font-semibold leading-5 text-ink">{row.name}</span>
              <span className="font-heading text-body font-bold leading-6" style={{ color: tone }}>{row.ram}</span>
            </motion.div>

            {picked && (
              <Rise a={a} x={x - 10} y={BASE_Y - row.height - 34} w={BOX_W + 20} delay={tBox(i) + T.stagger} className="text-center">
                <span className="inline-block rounded-pill px-3 text-xs font-semibold leading-5 text-white" style={{ background: colors.brand }}>{pickChip}</span>
              </Rise>
            )}

            {/* two identical chips at every foot */}
            <Rise a={a} x={x} y={BASE_Y + 8} w={BOX_W} delay={tBox(i)} className="flex justify-center gap-2">
              <Chip tone={tone} />
              <Chip tone={tone} />
            </Rise>
          </div>
        )
      })}

      <Rise a={a} x={0} y={BASE_Y + 40} w={W} delay={tSame} className="text-center">
        <span className="text-[17px] font-semibold leading-6" style={{ color: colors.body }}>{same}</span>
      </Rise>
    </div>
  )
}

/** A 16px processor chip: a square die with four pins a side. */
function Chip({ tone }: { tone: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={tone} strokeWidth={1.6} aria-hidden>
      <rect x="4" y="4" width="10" height="10" rx="1.5" />
      <rect x="7" y="7" width="4" height="4" fill={tone} stroke="none" />
      <path d="M6.5 1v3M11.5 1v3M6.5 14v3M11.5 14v3M1 6.5h3M1 11.5h3M14 6.5h3M14 11.5h3" strokeLinecap="round" />
    </svg>
  )
}
