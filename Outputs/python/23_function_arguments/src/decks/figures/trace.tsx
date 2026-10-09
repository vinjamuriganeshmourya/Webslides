import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { CodeBlock, type CodeLineState } from '@/ui'
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
  return <CodeBlock code={code} filename="Python" chip={false} fontSize={fontSize} rows={rows ?? code.split('\n').length} lines={lines} />
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
  const has = !!text
  const rule = tone === 'rule'
  return (
    <div
      className="flex items-start gap-3 rounded-xl px-4 py-2.5"
      style={{
        minHeight: minH,
        background: has ? (rule ? colors.surface2 : colors.white) : 'transparent',
        boxShadow: has ? (rule ? `inset 4px 0 0 ${colors.brandDark}` : `inset 0 0 0 1px ${colors.line}`) : 'none',
        transition: 'background-color 360ms, box-shadow 360ms',
      }}
    >
      {has && badge ? (
        <span className="mt-0.5 shrink-0 whitespace-nowrap rounded-md px-2 py-0.5 font-mono text-[15px] font-bold" style={{ background: colors.brandDark, color: colors.white }}>
          {badge}
        </span>
      ) : null}
      {has && (
        <span key={text} className="sm-bump min-w-0 font-semibold leading-snug" style={{ fontSize: size, color: colors.ink }}>
          <Lines lines={sentences(text!)} />
        </span>
      )}
    </div>
  )
}

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
}: {
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
    <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {options.map((o, i) => (
        <Option key={i} letter={'ABCD'[i]} picked={pick === i} right={i === right} shown={shown} onPick={() => setPick(i)} size={size} dense={dense} mono={mono} detail={details?.[i]}>
          {o}
        </Option>
      ))}
    </div>
  )
}
