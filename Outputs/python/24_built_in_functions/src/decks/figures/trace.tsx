import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import type { CodeLineState } from '@/ui'
import { useInstant } from '@/motion/instant'
import { Code } from './Code'
import { useVoteKeys } from './controls'
import { Lines } from './common'
import { Option, sentences } from './pieces'

/**
 * THE PIECES EVERY "PREDICT, THEN RUN" CARD OF PF 21 IS BUILT FROM.
 *
 * Carried from session 20 (`CodePane`, `StepCaption`, `Vote`), without its
 * names-and-arrows engine: this session draws strings as tiles and lists as
 * boxes with two position rows (`tiles21.tsx`, `rows.tsx`).
 */

/** The code with the line that just ran lit and the lines before it marked as run. */
export function CodePane({
  code,
  at,
  mark,
  fontSize = 15,
  rows,
  gap,
  gaps,
  stop = false,
  highlight,
}: {
  code: string
  at?: number | null
  mark?: number[]
  fontSize?: number
  rows?: number
  /** a line shown as a gap: dimmed */
  gap?: number
  /** several gap lines (T2's lines 6 to 8, waiting to be written) */
  gaps?: number[]
  /** the line Python stopped on: the error tint */
  stop?: boolean
  /** a line lit without the run before it: the line the card is about */
  highlight?: number
}) {
  const lines: Record<number, CodeLineState> = {}
  mark?.forEach((l) => (lines[l] = 'mark'))
  if (at) {
    for (let l = 1; l < at; l++) lines[l] = 'ran'
    lines[at] = stop ? 'error' : 'now'
  }
  if (highlight) lines[highlight] = 'mark'
  if (gap) lines[gap] = lines[gap] ?? 'dead'
  gaps?.forEach((g) => (lines[g] = lines[g] ?? 'dead'))
  return <Code code={code} fontSize={fontSize} rows={rows ?? code.split('\n').length} lines={lines} />
}

/**
 * What the press just did: the spec's caption, one sentence per line
 * (content rule 36), with an optional small badge (`line 2`, `cut 3`). Empty,
 * it keeps its height, so nothing under it moves when the walk starts.
 */
export function StepCaption({
  badge,
  text,
  minH = 58,
  tone = 'step',
  size = 18,
}: {
  badge?: string | null
  text?: string | null
  minH?: number
  tone?: 'step' | 'rule'
  size?: number
}) {
  const instant = useInstant()
  const has = !!text
  const rule = tone === 'rule'
  /* Vertically centred in its box (rule G2); the box's tint and the text move
     on the house curve, and a new caption fades out the old one before it
     rises in (rule G1): no line is ever swapped in place. */
  return (
    <div
      className="flex items-center rounded-xl px-4 py-2.5"
      style={{
        minHeight: minH,
        background: has ? (rule ? colors.surface2 : colors.white) : 'rgba(255,255,255,0)',
        boxShadow: has ? (rule ? `inset 4px 0 0 ${colors.brandDark}` : `inset 0 0 0 1px ${colors.line}`) : `inset 0 0 0 0 ${colors.line}00`,
        transition: instant ? 'none' : `background-color 420ms ${HOUSE}, box-shadow 420ms ${HOUSE}`,
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {has && (
          <motion.div
            key={`${badge ?? ''}|${text}`}
            className="flex min-w-0 items-center gap-3"
            initial={instant ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.42, ease: EASE } }}
            exit={{ opacity: 0, y: -6, transition: { duration: instant ? 0 : 0.2, ease: EASE } }}
          >
            {badge ? (
              <span className="shrink-0 whitespace-nowrap rounded-md px-2 py-0.5 font-mono text-[15px] font-bold leading-tight" style={{ background: colors.brandDark, color: colors.white }}>
                {badge}
              </span>
            ) : null}
            <span className="min-w-0 font-semibold leading-snug" style={{ fontSize: size, color: colors.ink }}>
              <Lines lines={sentences(text!)} />
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const HOUSE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const EASE = [0.22, 1, 0.36, 1] as const

/**
 * A vote: the room's options as buttons (a click or keys 1 to n mark the
 * pick; the press never waits for one). `shown` marks the right one and
 * fades the rest.
 */
export function Vote({
  options,
  right,
  shown,
  pick,
  setPick,
  details,
  cols = options.length,
  size = 18,
  dense = false,
  mono = true,
  template,
  nowrap = false,
}: {
  /** grid columns, when the options are not one width (E1: short left, long right) */
  template?: string
  /** every option on one line (rule G2) */
  nowrap?: boolean
  options: ReactNode[]
  right: number
  shown: boolean
  pick: number
  setPick: (i: number) => void
  details?: ReactNode[]
  cols?: number
  size?: number
  dense?: boolean
  mono?: boolean
}) {
  useVoteKeys(options.length, setPick, !shown)
  return (
    <div className="grid gap-2.5" style={{ gridTemplateColumns: template ?? `repeat(${cols}, minmax(0, 1fr))` }}>
      {options.map((o, i) => (
        <Option key={i} letter={'ABCD'[i]} picked={pick === i} right={i === right} shown={shown} onPick={() => setPick(i)} size={size} dense={dense} mono={mono} nowrap={nowrap} detail={details?.[i]}>
          {o}
        </Option>
      ))}
    </div>
  )
}
