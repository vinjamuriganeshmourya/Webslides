import { useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { Confetti } from './motion'
import { Ask, BigLine, Note, OutPanel, Show, sentences } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { PieceRow, Tiles, splitStates, type TileState } from './tiles21'
import { SPEC } from './spec'

/**
 * THE SPLIT CARDS: C2, C3, C4 and the split machine E1.
 *
 * One picture on all four (spec note 3): the string as letter tiles, the cut
 * tiles vanish, the pieces drop into list boxes. Code, strings, outputs and
 * E1's cuts and captions are the spec's data (`spec.ts`), every output run on
 * CPython (plan, outputs table).
 */

/** The string a program's first line assigns, read from the spec's own source. */
export function literal(src: string): string {
  const first = src.split('\n')[0]
  const m = first.match(/=\s*"(.*)"\s*$/)
  if (!m) return ''
  return m[1].replace(/\\n/g, '\n').replace(/\\t/g, '\t')
}

/** The list a printed list of strings stands for: ['1', '', '3'] → 1, '', 3. */
export function piecesOf(printed: string): string[] {
  return [...printed.matchAll(/'([^']*)'/g)].map((m) => m[1])
}

/** The left column every split card shares: the program, then what it printed. */
function ProgramColumn({ code, at, gap, out, children, width = 470 }: { code: string; at?: number | null; gap?: number; out: string | null; children?: ReactNode; width?: number }) {
  return (
    <div className="flex shrink-0 flex-col gap-3" style={{ width }}>
      <CodePane code={code} at={at} gap={gap} fontSize={18} rows={3} />
      <OutPanel lines={out ? [{ text: out }] : []} minRows={1} fontSize={19} />
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------- C2 */

const C2 = SPEC.C2

export function SplitBasic() {
  const beat = useBeats(3)
  const ran = beat >= 2
  const str = literal(C2.code[0].src)
  return (
    <>
      <div className="flex items-start gap-9">
        <ProgramColumn code={C2.code[0].src} at={ran ? 2 : null} out={ran ? C2.code[0].output : null} />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Ask size={24}>{sentences(C2.show[0])[0]}</Ask>
          <Tiles chars={[...str]} size="lg" states={ran ? splitStates(str, null) : {}} lane={false} />
          <PieceRow pieces={ran ? piecesOf(C2.code[0].output) : []} stagger={160} />
          <Show on={beat >= 3} className="flex flex-col items-start gap-3">
            <BigLine size={40}>str_var.split()</BigLine>
            <Note size={19} lines={sentences(C2.show[1])} />
          </Show>
        </div>
      </div>
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ------------------------------------------------------------------- C3 */

const C3 = SPEC.C3

export function SplitSpaces() {
  const beat = useBeats(4)
  const [pick, setPick] = useState(-1)
  const second = beat >= 3
  const prog = C3.code[second ? 1 : 0]
  const ran = beat === 2 || beat === 4
  const str = literal(prog.src)
  const caption = beat <= 2 ? C3.show[0] : beat === 3 ? C3.show[1] : C3.show[2]
  return (
    <>
      <div className="flex items-start gap-9">
        <ProgramColumn code={prog.src} at={ran ? 2 : null} out={ran ? prog.output : null}>
          <div className="flex flex-col gap-2" style={{ opacity: second ? 0.55 : 1 }}>
            <Vote
              options={[C3.code[0].output, <span className="font-body">a list with empty pieces in it</span>]}
              right={0}
              shown={beat >= 2}
              pick={pick}
              setPick={setPick}
              cols={1}
              size={17}
              dense
            />
          </div>
        </ProgramColumn>
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Ask size={24} className="min-h-[64px]">
            <Lines lines={sentences(caption)} />
          </Ask>
          <Tiles key={str} chars={[...str]} size="lg" states={ran ? splitStates(str, null) : {}} lane={false} />
          <PieceRow key={`p${second}`} pieces={ran ? piecesOf(prog.output) : []} stagger={160} />
        </div>
      </div>
      {beat >= 2 && pick === 0 && <Confetti seed={9} />}
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ------------------------------------------------------------------- C4 */

const C4 = SPEC.C4
const C4_SRC: string = C4.code[0].src
const C4_LINE2 = C4_SRC.split('\n')[1]
const C4_BLANK = C4_SRC.split('\n')
  .map((l, i) => (i === 1 ? '' : l))
  .join('\n')

export function SplitComma() {
  const beat = useBeats(2)
  const ran = beat >= 2
  const str = literal(C4_SRC)
  return (
    <>
      <div className="flex items-start gap-9">
        <ProgramColumn code={ran ? C4_SRC : C4_BLANK} at={ran ? 2 : null} gap={ran ? undefined : 2} out={ran ? C4.code[0].output : null} />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="min-h-[66px]">
            <Show on={ran}>
              <BigLine size={34}>{C4_LINE2}</BigLine>
            </Show>
          </div>
          <Tiles chars={[...str]} size="lg" states={ran ? splitStates(str, ',') : {}} lane={false} />
          <PieceRow pieces={ran ? piecesOf(C4.code[0].output) : []} stagger={160} />
          <Note size={19} lines={sentences(ran ? C4.show[1] : C4.show[0])} />
        </div>
      </div>
      <StepControls at={beat} total={2} />
    </>
  )
}

/* ------------------------------------------------------------------- E1 */

const E1 = SPEC.E1
type Cut = { cut_at: number | null; piece: string; pieces: string[]; caption: string }
type Run = { string: string; sep: string; src: string; output: string; steps: Cut[]; empties: number; default: string }
const RUNS: Run[] = E1.data.runs
/* the vote's options per run: 4 items, or what the run really gives */
const OPTIONS = [
  ['4 items', '6 items'],
  ['4 items', '8 items'],
]

type Beat = { r: number; kind: 'ask' | 'cut' | 'out'; k: number }
const SCHEDULE: Beat[] = RUNS.flatMap((run, r) => [
  { r, kind: 'ask' as const, k: -1 },
  ...run.steps.map((_, k) => ({ r, kind: 'cut' as const, k })),
  { r, kind: 'out' as const, k: run.steps.length - 1 },
])
export const E1_PRESSES = SCHEDULE.length /* 18 */

function machineTiles(run: Run, k: number): Record<number, TileState> {
  const st: Record<number, TileState> = {}
  const done = run.steps.slice(0, k + 1)
  const cuts = done.map((s) => s.cut_at).filter((c): c is number => c !== null)
  const reached = done.some((s) => s.cut_at === null) ? run.string.length : (cuts[cuts.length - 1] ?? -1)
  for (let i = 0; i < run.string.length; i++) {
    if (cuts.includes(i)) st[i] = 'cut'
    else if (i < reached) st[i] = 'used'
  }
  return st
}

export function SplitMachine() {
  const beat = useBeats(SCHEDULE.length)
  const b = SCHEDULE[beat - 1]
  const run = RUNS[b.r]
  const [picks, setPicks] = useState<number[]>([-1, -1])
  const pick = picks[b.r]
  const setPick = (p: number) => setPicks((ps) => ps.map((v, j) => (j === b.r ? p : v)))
  const step = b.k >= 0 ? run.steps[b.k] : null
  const out = b.kind === 'out'
  const knife = out ? null : step ? (step.cut_at ?? run.string.length) : 0
  const pieces = step ? step.pieces : []
  const empties = out ? pieces.map((p, i) => (p === '' ? i : -1)).filter((i) => i >= 0) : []
  const caption = out ? E1.show[3 + b.r] : (step?.caption ?? null)
  const badge = b.kind === 'cut' ? (step!.cut_at === null ? 'end' : `cut ${b.k + 1}`) : null
  return (
    <>
      <div className="flex items-start gap-8">
        <div className="flex w-[440px] shrink-0 flex-col gap-3">
          <span className="font-heading text-[18px] font-bold" style={{ color: colors.brandDark }}>
            {E1.show[b.r]}
          </span>
          <CodePane code={run.src} at={out ? 3 : b.kind === 'cut' ? 2 : null} fontSize={16} rows={3} />
          <Ask size={20}>{E1.show[2]}</Ask>
          <Vote key={b.r} options={OPTIONS[b.r]} right={1} shown={out} pick={pick} setPick={setPick} size={18} mono={false} />
          <OutPanel lines={out ? [{ text: run.output }] : []} minRows={1} fontSize={17} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Tiles key={b.r} chars={[...run.string]} size="lg" knife={knife} states={machineTiles(run, b.k)} />
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              {b.r === 1 && (
                <span className="w-[150px] shrink-0 font-mono text-[16px] font-bold" style={{ color: colors.brandDark }}>
                  split(" ")
                </span>
              )}
              <PieceRow key={b.r} pieces={pieces} lit={empties} size={b.r === 1 ? 'sm' : 'md'} />
            </div>
            {b.r === 1 && (
              <Show on={out} className="flex items-center gap-3">
                <span className="w-[150px] shrink-0 font-mono text-[16px] font-bold" style={{ color: colors.brandDark }}>split()</span>
                <PieceRow pieces={piecesOf(run.default)} size="sm" />
              </Show>
            )}
          </div>
          <StepCaption badge={badge} text={caption} tone={out ? 'rule' : 'step'} size={18} />
        </div>
      </div>
      {out && pick === 1 && <Confetti seed={11 + b.r} />}
      <StepControls at={beat} total={SCHEDULE.length} />
    </>
  )
}
