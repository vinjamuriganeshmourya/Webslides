import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { CodeBlock, Countdown, TraceCaption, useBeats, VarTrail, type CodeLineState } from '@/ui'
import { OutputPanel } from '@/ui/CodeOutput'
import { Boxes, Lines, type BoxState } from './common'
import { StepControls } from './controls'
import { Glow } from './motion'

/**
 * TRACE IT: THE INNER RANGE USES i. PF 16 slide 8, worksheet task 1, sixteen
 * beats, the button labelled `One step`.
 *
 * Beat 1 is the brief and a five-minute timer: the room fills the worksheet
 * table by hand first, keyboards off. From beat 2 one press runs one line:
 * the line lights, `i` and `j` keep every value they have held, the range
 * cells show which numbers are taken and which is on now, and the output grows.
 * Nothing moves until the instructor presses (course rule R5c item 4).
 *
 * NOTHING ON THE RIGHT MOVES BETWEEN PRESSES (review, 2026-10-01: "the output
 * box moves"). The two range rows have a fixed height and a fixed cell slot
 * whether `j` has one cell or three or none yet, so the output panel under
 * them stays where it is; and the panel is tall enough for all six lines the
 * program prints, so nothing is clipped at the end.
 *
 * Real run (CPython 3.12.3): `1 0`, `2 0`, `2 1`, `3 0`, `3 1`, `3 2`.
 */
const CODE = 'for i in range(1, 4):\n    for j in range(i):\n        print(i, j)'

interface Step {
  line: 1 | 2 | 3
  i: number
  j?: number
  cap: string[]
  out?: string
}

const STEPS: Step[] = [
  { line: 1, i: 1, cap: ['i is 1, so the inner range is range(1)'] },
  { line: 2, i: 1, j: 0, cap: ['j takes 0'] },
  { line: 3, i: 1, j: 0, cap: ['It prints'], out: '1 0' },
  { line: 1, i: 2, cap: ['i is 2, so the inner range is range(2)'] },
  { line: 2, i: 2, j: 0, cap: ['j starts again at 0'] },
  { line: 3, i: 2, j: 0, cap: ['It prints'], out: '2 0' },
  { line: 2, i: 2, j: 1, cap: ['j takes 1'] },
  { line: 3, i: 2, j: 1, cap: ['It prints'], out: '2 1' },
  { line: 1, i: 3, cap: ['i is 3, so the inner range is range(3)'] },
  { line: 2, i: 3, j: 0, cap: ['j starts again at 0'] },
  { line: 3, i: 3, j: 0, cap: ['It prints'], out: '3 0' },
  { line: 2, i: 3, j: 1, cap: ['j takes 1'] },
  { line: 3, i: 3, j: 1, cap: ['It prints'], out: '3 1' },
  { line: 2, i: 3, j: 2, cap: ['j takes 2'] },
  { line: 3, i: 3, j: 2, cap: ['It prints'], out: '3 2' },
]

const BRIEF = [
  'Open Task 1 on your worksheet',
  'Fill one row each time line 3 runs: the value of i, the value of j, and what it prints',
  'Then type how many times line 3 runs',
]

/* the output panel: six lines at 17px x 1.4, the header and the padding */
const OUT_FONT = 17
const OUT_LH = 1.4
const OUT_H = Math.ceil(6 * OUT_FONT * OUT_LH) + 61 + 4

/** A range row with a fixed height and a fixed slot for its cells, so the rows under it never move. */
function RangeRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex h-[52px] items-center gap-4">
      <span className="w-[160px] shrink-0 font-mono text-[16px]" style={{ color: colors.body }}>{label}</span>
      <div className="flex h-[52px] w-[170px] items-center">{children}</div>
    </div>
  )
}

export function NestedTrace() {
  const beat = useBeats(STEPS.length + 1)
  const k = beat - 1
  const done = STEPS.slice(0, k)
  const s = k ? STEPS[k - 1] : undefined

  const lines: Record<number, CodeLineState> = {}
  if (s) {
    for (const d of done) lines[d.line] = 'ran'
    lines[s.line] = 'now'
  }
  const iVals = [...new Set(done.map((d) => d.i))].map(String)
  const jVals = done.filter((d) => d.line === 2).map((d) => String(d.j))
  const printed = done.map((d) => d.out).filter((x): x is string => !!x)

  const iStates: Record<number, BoxState> = {}
  if (s) {
    for (let v = 1; v <= 3; v++) iStates[v - 1] = v < s.i ? 'gone' : v === s.i ? 'hit' : 'plain'
  }
  const jCells = s ? Array.from({ length: s.i }, (_, v) => String(v)) : []
  const jStates: Record<number, BoxState> = {}
  if (s && s.j !== undefined) for (let v = 0; v < s.i; v++) jStates[v] = v < s.j ? 'gone' : v === s.j ? 'hit' : 'plain'

  return (
    <>
      <div className="flex items-start gap-8">
        <div className="flex w-[520px] shrink-0 flex-col gap-4">
          <CodeBlock code={CODE} filename="Python" chip={false} fontSize={19} rows={3} lines={lines} />
          <div className="flex flex-col gap-2.5">
            <VarTrail name="i" values={iVals} empty="not set yet" />
            <VarTrail name="j" values={jVals} empty="not set yet" />
          </div>
        </div>
        {!s ? (
          <div className="flex min-w-0 flex-1 flex-col gap-3 [&_b]:font-bold [&_b]:text-ink">
            <span className="text-[16px] font-bold uppercase tracking-wider" style={{ color: colors.warning }}>Worksheet · Task 1</span>
            <ol className="flex flex-col gap-1.5">
              {BRIEF.map((t, i) => (
                <li key={i} className="flex gap-3 text-[18px] leading-snug" style={{ color: colors.body }}>
                  <b className="w-5 shrink-0">{i + 1}.</b>
                  <span>{t}</span>
                </li>
              ))}
              <li className="flex gap-3 text-[18px] leading-snug" style={{ color: colors.body }}>
                <b className="w-5 shrink-0">4.</b>
                <span>
                  <b>Do not run it</b>
                  <br />
                  Keyboards off when the timer ends
                </span>
              </li>
            </ol>
            <Countdown seconds={300} />
          </div>
        ) : (
          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            <div className="flex flex-col gap-2">
              <RangeRow label="i in range(1, 4)">
                <Boxes chars={['1', '2', '3']} size="sm" indices={false} states={iStates} />
              </RangeRow>
              <RangeRow label={`j in range(${s.j === undefined && k === 1 ? 'i' : s.i})`}>
                {s.j === undefined ? <span className="text-[16px]" style={{ color: colors.muted }}>not reached yet</span> : <Boxes chars={jCells} size="sm" indices={false} states={jStates} />}
              </RangeRow>
            </div>
            <Glow on={!!s.out} pulse={printed.length}>
              <OutputPanel output={printed.join('\n')} fontSize={OUT_FONT} lineHeight={OUT_LH} height={OUT_H} />
            </Glow>
            <TraceCaption>
              <Lines lines={s.cap} />
            </TraceCaption>
          </div>
        )}
      </div>
      <StepControls at={beat} total={STEPS.length + 1} nextLabel="One step" />
    </>
  )
}
