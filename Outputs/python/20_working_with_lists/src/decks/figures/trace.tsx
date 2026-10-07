import { useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { CodeBlock, useBeats, type CodeLineState } from '@/ui'
import { StepControls, useVoteKeys } from './controls'
import { Lines } from './common'
import { Confetti } from './motion'
import { Memory, pictureOf, type MNode, type MRef, type MTag, type SpecStep, type StepLayout } from './memory'
import { Ask, Option, OutPanel, Show, sentences } from './pieces'

/**
 * THE PIECES EVERY "WALK A PROGRAM" CARD OF PF 20 IS BUILT FROM.
 *
 * The spec walks nine programs one line per press (C10, C11, C12, E1's two
 * runs, T2's two, G1, T3). Each press runs one line: the line lights in the
 * code, the picture updates, the caption from the spec's data says what just
 * happened, and a print adds its line to the output, only on the print press
 * (T2's must line). These are those four parts, and `TraceCard`, the whole
 * card for the common shape: a vote, the walk, an optional closing line.
 */

/** The code with the line that just ran lit and the lines before it marked as run. */
export function CodePane({ code, at, mark, fontSize = 15, rows, gap, stop = false }: { code: string; at?: number | null; mark?: number[]; fontSize?: number; rows?: number; gap?: number; /** the line Python stopped on: the error tint */ stop?: boolean }) {
  const lines: Record<number, CodeLineState> = {}
  mark?.forEach((l) => (lines[l] = 'mark'))
  if (at) {
    for (let l = 1; l < at; l++) lines[l] = 'ran'
    lines[at] = stop ? 'error' : 'now'
  }
  if (gap) lines[gap] = lines[gap] ?? 'dead'
  return <CodeBlock code={code} filename="Python" chip={false} fontSize={fontSize} rows={rows ?? code.split('\n').length} lines={lines} />
}

/**
 * What the press just did: the line number in a small mono badge and the
 * spec's caption beside it, one sentence per line (content rule 36). Empty, it
 * keeps its height, so nothing under it moves when the walk starts.
 */
export function StepCaption({ line, text, minH = 58, tone = 'step', size = 18 }: { line?: number | null; text?: string | null; minH?: number; tone?: 'step' | 'rule'; size?: number }) {
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
      {has && line ? (
        <span className="mt-0.5 shrink-0 rounded-md px-2 py-0.5 font-mono text-[15px] font-bold" style={{ background: colors.brandDark, color: colors.white }}>
          line {line}
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
 * fades the rest; confetti if the marked pick was right.
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
}) {
  useVoteKeys(options.length, setPick, !shown)
  return (
    <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {options.map((o, i) => (
        <Option key={i} letter={'ABCD'[i]} picked={pick === i} right={i === right} shown={shown} onPick={() => setPick(i)} size={size} dense={dense} detail={details?.[i]}>
          {o}
        </Option>
      ))}
    </div>
  )
}

/** Output lines printed by the steps up to and including `k`. */
export function printedBy(steps: SpecStep[], k: number) {
  return steps.slice(0, Math.max(0, k + 1)).flatMap((s) => (s.printed ?? []).map((t) => ({ text: t })))
}

export interface Picture {
  nodes: MNode[]
  tags?: MTag[]
  refs?: MRef[]
}

/**
 * A predict-then-walk card. Press 1 asks (the vote); one press per step of
 * the spec's trace; then, if `closing` is given, one press for the closing
 * line. The answer marks on the press whose print settles it (`revealStep`,
 * 0-based), never before.
 */
export function TraceCard({
  code,
  steps,
  lay,
  canvas,
  ask,
  options,
  right,
  revealStep,
  closing,
  picture,
  fontSize = 15,
  seed = 1,
}: {
  code: string
  steps: SpecStep[]
  lay: StepLayout
  canvas: { w: number; h: number }
  ask: string
  options: string[]
  right: number
  revealStep: number
  closing?: string
  /** a card that draws more than tags and rows (C12's cubes) gives its own picture */
  picture?: (k: number, step: SpecStep | null, prev: SpecStep | null) => Picture
  fontSize?: number
  seed?: number
}) {
  const total = 1 + steps.length + (closing ? 1 : 0)
  const beat = useBeats(total)
  const k = Math.min(beat - 2, steps.length - 1) /* -1 = the question */
  const step = k >= 0 ? steps[k] : null
  const prev = k >= 1 ? steps[k - 1] : null
  const pic: Picture = picture ? picture(k, step, prev) : pictureOf(step, prev, lay)
  const shown = k >= revealStep
  const [pick, setPick] = useState(-1)
  const closingOn = !!closing && beat === total
  return (
    <>
      <div className="flex items-start gap-7">
        <div className="flex w-[470px] shrink-0 flex-col gap-3">
          <CodePane code={code} at={step?.line ?? null} fontSize={fontSize} />
          <OutPanel lines={printedBy(steps, k)} minRows={2} fontSize={fontSize} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Ask size={22}>{ask}</Ask>
          <div className="w-[440px]">
            <Vote options={options} right={right} shown={shown} pick={pick} setPick={setPick} />
          </div>
          <Memory width={canvas.w} height={canvas.h} nodes={pic.nodes} tags={pic.tags} refs={pic.refs} size={lay.size} />
          <StepCaption line={closingOn ? null : step?.line} text={closingOn ? closing : step?.caption} tone={closingOn ? 'rule' : 'step'} />
        </div>
      </div>
      {shown && pick === right && <Confetti seed={seed} />}
      <StepControls at={beat} total={total} />
    </>
  )
}

export { Show }
