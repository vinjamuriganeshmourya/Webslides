import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { T } from './figureTiming'
import { Rise, drawAnim, useFigureAnim, at, ease, type FigureAnim } from './figureMotion'

/**
 * ServiceField — two hundred switches on a wall, four turned on.
 *
 * WHAT IT ARGUES
 *   "More than 200 services" is a number nobody can picture. A field of small
 *   squares makes it a count the eye can take in, and four lit squares with
 *   names show how small four is against it. The one square with a border and
 *   a chip is the one this course needs.
 *
 * HOW IT MOVES
 *   The grey squares fill in a wipe from the top left over `T.draw`: each
 *   square fades up on a delay set by its diagonal, so it reads as one sweep
 *   and not two hundred staggers. Then the lit squares pop one at a time at
 *   `T.stagger` (scale 0.9 to 1, opacity), each leader traces over
 *   `T.drawStep`, and its label fades up `T.label` after the line lands.
 *
 * SIZES
 *   `lg` is the grid plus labels on alternating sides. `sm` is the grid alone
 *   with the same squares lit and no labels, for a caption row.
 */

export interface LitService {
  name: string
  /** A chip beside the name, for the one square the course uses. */
  note?: string
}

const CELL = { lg: { s: 14, gap: 6 }, sm: { s: 6, gap: 2 } } as const
const LABEL_W = 150
const LABEL_GAP = 28
const LABEL_ROW = 46

export function ServiceField({
  count = 200,
  cols = 20,
  lit,
  size = 'lg',
  className = '',
}: {
  count?: number
  cols?: number
  lit: LitService[]
  size?: keyof typeof CELL
  className?: string
}) {
  const a = useFigureAnim()
  const { s, gap } = CELL[size]
  const rows = Math.ceil(count / cols)
  const gridW = cols * (s + gap) - gap
  const gridH = rows * (s + gap) - gap
  const withLabels = size === 'lg'
  const gridX = withLabels ? LABEL_W + LABEL_GAP : 0
  const W = withLabels ? gridW + 2 * (LABEL_W + LABEL_GAP) : gridW
  const H = withLabels ? Math.max(gridH, lit.length * LABEL_ROW) + 8 : gridH

  /* The lit squares, spread across the field so no two share a row. */
  const litIdx = lit.map((_, i) => {
    const row = Math.floor(((i + 0.5) / lit.length) * rows)
    const col = Math.floor(((i % 2 === 0 ? 0.3 : 0.7) + (i / lit.length) * 0.25) * cols)
    return row * cols + Math.min(cols - 1, col)
  })

  const tWipe = at(0)
  const tLit = (i: number) => tWipe + T.draw + i * T.stagger
  const cx = (idx: number) => gridX + (idx % cols) * (s + gap) + s / 2
  const cy = (idx: number) => Math.floor(idx / cols) * (s + gap) + s / 2

  return (
    <div className={`relative mx-auto ${className}`} style={{ width: W, height: H }}>
      {/* the field */}
      <div className="absolute grid" style={{ left: gridX, top: 0, gridTemplateColumns: `repeat(${cols}, ${s}px)`, gap }}>
        {Array.from({ length: count }, (_, i) => {
          const r = Math.floor(i / cols)
          const c = i % cols
          const delay = tWipe + ((r + c) / (rows + cols - 2)) * (T.draw - T.label)
          const on = litIdx.indexOf(i)
          return <Square key={i} s={s} a={a} delay={delay} lit={on >= 0 ? tLit(on) : undefined} strong={on >= 0 && !!lit[on].note} />
        })}
      </div>

      {withLabels && (
        <>
          <svg className="absolute inset-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden>
            {lit.map((item, i) => {
              const left = i % 2 === 0
              const x1 = cx(litIdx[i]) + (left ? -s / 2 - 2 : s / 2 + 2)
              const y1 = cy(litIdx[i])
              const x2 = left ? LABEL_W + 6 : W - LABEL_W - 6
              const y2 = 8 + i * LABEL_ROW + 16
              return (
                <motion.path
                  key={item.name}
                  d={`M${x1} ${y1} H${left ? x1 - 14 : x1 + 14} L${x2} ${y2}`}
                  fill="none"
                  stroke={colors.brand}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  {...drawAnim(a, tLit(i) + T.label, T.drawStep)}
                />
              )
            })}
          </svg>

          {lit.map((item, i) => {
            const left = i % 2 === 0
            return (
              <Rise key={item.name} a={a} x={left ? 0 : W - LABEL_W} y={8 + i * LABEL_ROW} w={LABEL_W} delay={tLit(i) + T.label + T.drawStep} duration={T.label} className={left ? 'text-right' : 'text-left'}>
                <div className={`flex items-center gap-2 ${left ? 'justify-end' : 'justify-start'}`}>
                  <span className="font-heading text-[17px] font-bold leading-6 text-ink">{item.name}</span>
                  {item.note && (
                    <span className="rounded-pill px-2 text-xs font-semibold leading-5 text-white" style={{ background: colors.brand }}>{item.note}</span>
                  )}
                </div>
              </Rise>
            )
          })}
        </>
      )}
    </div>
  )
}

function Square({ s, a, delay, lit, strong }: { s: number; a: FigureAnim; delay: number; lit?: number; strong: boolean }) {
  return (
    <motion.span
      className="relative block rounded-[3px]"
      style={{ width: s, height: s, background: colors.line }}
      initial={a.instant ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: T.label, delay, ease }}
    >
      {lit !== undefined && (
        <motion.span
          className="absolute rounded-[3px]"
          style={{ inset: strong ? -3 : 0, background: colors.brand, border: strong ? `2.5px solid ${colors.brandDark}` : 'none', boxShadow: `0 0 0 3px ${colors.brand}22` }}
          initial={a.instant ? false : { opacity: 0, transform: a.reduce ? 'scale(1)' : 'scale(0.9)' }}
          animate={{ opacity: 1, transform: 'scale(1)' }}
          transition={{ duration: T.label, delay: lit, ease }}
        />
      )}
    </motion.span>
  )
}
