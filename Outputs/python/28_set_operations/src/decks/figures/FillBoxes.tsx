import { useRef, useState } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Lines, Group } from './common'
import { Confetti } from './motion'
import { Ask, Fresh, OutPanel, sentences, CODE_FS, OUT_FS } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { CountBar, NameBox, Row, py } from './rows'
import { SPEC } from './spec'

/**
 * GAME G2: FILL THE BOXES. Eighteen presses: the intro, then three rounds
 * (the ask, one press per step, the verdict).
 *
 *   - The program on the left with the vote under it; on the right the values
 *     as cells (a string's letters one per cell, so the count is visible) and
 *     the names as empty boxes.
 *   - The first step of every round is the count, on its own press, before
 *     any value moves. On a mismatch no box gets a value and none is filled
 *     and emptied; a missing value never becomes None (the must lines).
 *   - The verdict marks the right option and gives the why line under every
 *     other one; the caption is the spec's `because`.
 *
 * Every program, output, step and why line is the spec's, run on CPython.
 */
const G2 = SPEC.G2
type Step = { caption: string; boxes: Record<string, string | number | null>; printed: string }
type Round = { ask: string; program: string; output: string; options: string[]; answer: string; because: string; why: Record<string, string>; steps: Step[] }
const ROUNDS: Round[] = G2.data.rounds

type Beat = { kind: 'intro' } | { kind: 'ask' | 'verdict'; r: number } | { kind: 'step'; r: number; s: number }
const SCHEDULE: Beat[] = [{ kind: 'intro' }, ...ROUNDS.flatMap((rd, r): Beat[] => [{ kind: 'ask', r }, ...rd.steps.map((_, s): Beat => ({ kind: 'step', r, s })), { kind: 'verdict', r }])]

/** The values line 1 holds: a tuple's or a list's items, or a string's letters. */
function valuesOf(program: string): { name: string; kind: 'tuple' | 'list' | 'plain'; cells: string[] } {
  const [name, rhs] = program.split('\n')[0].split(' = ')
  if (rhs.startsWith('(') || rhs.startsWith('[')) {
    const items = rhs
      .slice(1, -1)
      .split(', ')
      .map((t) => t.trim())
    return { name, kind: rhs.startsWith('(') ? 'tuple' : 'list', cells: items }
  }
  return { name, kind: 'plain', cells: [...rhs.slice(1, -1)].map((c) => `'${c}'`) }
}

export function FillBoxes() {
  const beat = useBeats(SCHEDULE.length)
  const b = SCHEDULE[beat - 1]
  const r = b.kind === 'intro' ? 0 : b.r
  const round = ROUNDS[r]
  const [picks, setPicks] = useState<number[]>(ROUNDS.map(() => -1))
  const pick = picks[r]
  const setPick = (p: number) => setPicks((ps) => ps.map((v, j) => (j === r ? p : v)))
  const step = b.kind === 'step' ? round.steps[b.s] : b.kind === 'verdict' ? round.steps[round.steps.length - 1] : null
  const names = Object.keys(round.steps[0].boxes)
  const v = valuesOf(round.program)
  const counted = step !== null
  const shown = b.kind === 'verdict'
  const right = round.options.indexOf(round.answer)
  const printed = step?.printed ?? ''
  const stop = /Error/.test(printed)
  const caption = b.kind === 'step' ? step!.caption : shown ? round.because : null
  const cells = useRef<(HTMLSpanElement | null)[]>([])
  return (
    <>
      <div className="flex items-stretch gap-8">
        <Group pad={8} className="flex w-[510px] shrink-0 flex-col gap-2.5" active={b.kind === 'intro' ? undefined : b.kind === 'ask'}>
          {b.kind === 'intro' ? (
            <Ask size={28}>{G2.data.intro}</Ask>
          ) : (
            <>
              <div className="flex items-baseline gap-3">
                <span className="shrink-0 whitespace-nowrap font-heading text-[17px] font-bold" style={{ color: colors.brandDark }}>
                  Round {r + 1} of {ROUNDS.length}
                </span>
                <Ask size={20}>{round.ask}</Ask>
              </div>
              <CodePane code={round.program} fontSize={CODE_FS} rows={3} highlight={2} at={stop ? 2 : null} stop={stop} />
              <Vote
                key={`vote-${r}`}
                options={round.options}
                right={right}
                shown={shown}
                pick={pick}
                setPick={setPick}
                cols={1}
                size={16}
                dense
                details={round.options.map((o) => (o === round.answer ? undefined : <Lines lines={sentences(round.why[o] ?? '')} />))}
              />
            </>
          )}
        </Group>
        {b.kind !== 'intro' && (
          <Group pad={8} className="flex min-w-0 flex-1 flex-col gap-2.5" active={b.kind === 'step'}>
            <Fresh k={r} className="flex items-start">
              <Row items={v.cells} kind={v.kind} size="sm" fit cellRefs={cells} name={v.name} />
            </Fresh>
            <div className="min-h-[38px]">
              <CountBar values={v.cells.length} names={names.length} on={counted} />
            </div>
            <Fresh k={r} className="flex gap-3">
              {names.map((n, i) => {
                const val = step ? step.boxes[n] : null
                return <NameBox key={`${r}-${n}`} name={n} width={n === 'shop' ? 200 : 110} size="sm" value={val === null || val === undefined ? null : py(val)} from={cells.current[i]} tone={stop ? 'stop' : 'plain'} />
              })}
            </Fresh>
            <OutPanel lines={printed ? [{ text: printed, tone: stop ? 'error' : 'plain' }] : []} fontSize={OUT_FS} />
            <StepCaption badge={b.kind === 'step' ? `step ${b.s + 1}` : null} text={caption} tone={shown ? 'rule' : 'step'} size={17} minH={50} />
          </Group>
        )}
      </div>
      {shown && pick === right && <Confetti seed={70 + r} />}
      <StepControls at={beat} total={SCHEDULE.length} />
    </>
  )
}
