import { useState } from 'react'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Focus, Group } from './common'
import { Confetti } from './motion'
import { Fresh, OutPanel, Swap, CODE_FS, OUT_FS } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { useStepPhase } from './phase'
import { Board, toRows, type Row, type RowTone, type Search } from './board'
import { Intro, RoundHead, WhyLines, schedule } from './frame'
import { SPEC } from './spec'

/**
 * GAME G1 · LOOK IT UP. Twenty-two presses: the intro, then four rounds (the
 * ask, one press per line of the program, the verdict).
 *
 *   - The program and the vote on the left; Anna's board on the right.
 *   - Nothing moves until the press after the vote. Each press runs one
 *     line: a new row is written at the bottom, a new card covers the old
 *     one, a row is wiped, a tag lights and its card lifts, get comes back
 *     with None, or [ ] stops with a KeyError and nothing more runs. The
 *     terminal fills only on the print line's press.
 *   - A key appears on the board once; Tea and tea are two rows; rows never
 *     reorder; no row shows a number (the card's must lines).
 *   - The verdict marks the right option and gives a line for every wrong one.
 * Every program, step and why line is the spec's, run on CPython 3.12.3.
 */
const G1 = SPEC.G1
type Step = { caption: string; line: number; key: string | null; result: 'added' | 'replaced' | 'removed' | 'found' | 'None' | 'KeyError' | 'prints'; board: [string, number][]; printed: string }
type Round = { ask: string; program: string; start: [string, number][]; output: string; options: string[]; answer: string; because: string; why: Record<string, string>; steps: Step[] }
const ROUNDS: Round[] = G1.data.rounds
const SCHEDULE = schedule(ROUNDS)
const LANE = 118

export function LookItUp() {
  const beat = useBeats(SCHEDULE.length)
  const b = SCHEDULE[beat - 1]
  const r = b.kind === 'intro' ? 0 : b.r
  const round = ROUNDS[r]
  const [picks, setPicks] = useState<number[]>(ROUNDS.map(() => -1))
  const pick = picks[r]
  const setPick = (p: number) => setPicks((ps) => ps.map((v, j) => (j === r ? p : v)))
  const step = b.kind === 'step' ? round.steps[b.s] : b.kind === 'verdict' ? round.steps[round.steps.length - 1] : null
  const rows: Row[] = toRows(step ? step.board : round.start)
  /* a missing key: the finger walks the tags and comes back empty (get) or stops the program ([ ]) */
  const missing = b.kind === 'step' && (step!.result === 'None' || step!.result === 'KeyError')
  const walk = useStepPhase(beat, missing ? [300, ...rows.map(() => 420)] : [0])
  let search: Search | null = null
  if (step && (step.result === 'None' || step.result === 'KeyError') && b.kind === 'step') {
    const label = `"${step.key}"`
    if (walk > 0) search = walk - 1 >= rows.length ? { label, at: rows.length, miss: step.result === 'None' ? 'quiet' : 'alarm' } : { label, at: walk - 1 }
  }
  const tones: Record<string, RowTone> = {}
  if (step?.result === 'found' && step.key && b.kind === 'step') tones[step.key] = 'lit'
  if (step?.result === 'added' && step.key && b.kind === 'step') tones[step.key] = 'new'
  /* a replaced value stays a sticker for the rest of the round */
  const stuck = round.steps.slice(0, b.kind === 'step' ? b.s + 1 : b.kind === 'verdict' ? round.steps.length : 0).filter((s) => s.result === 'replaced' && s.key).map((s) => s.key as string)
  const printed = step?.printed ?? ''
  const err = /Error/.test(printed)
  const right = round.options.indexOf(round.answer)
  const shown = b.kind === 'verdict'
  const caption = b.kind === 'step' ? step!.caption : shown ? round.because : null
  return (
    <>
      {b.kind === 'intro' ? (
        <Intro text={G1.data.intro} />
      ) : (
        <div className="flex items-stretch gap-3" style={{ height: 431 }}>
          <div className="flex w-[730px] shrink-0 flex-col gap-2.5">
            <Group pad={10} className="flex flex-col gap-2.5" active={b.kind === 'ask'}>
              <Focus on={b.kind === 'ask'}>
                <Fresh k={r}>
                  <CodePane code={round.program} fontSize={CODE_FS} rows={4} at={b.kind === 'step' ? step!.line : null} stop={b.kind === 'step' && err} />
                </Fresh>
              </Focus>
              <RoundHead n={r + 1} of={ROUNDS.length} ask={round.ask} />
              <Vote key={`v${r}`} options={round.options} right={right} shown={shown} pick={pick} setPick={setPick} template={round.options.some((o) => o.length > 6) ? '1fr 1fr 1.6fr' : undefined} size={17} nowrap dense />
            </Group>
            <Group pad={10} className="flex min-h-0 flex-1 items-start gap-3">
              <OutPanel lines={printed ? [{ text: printed, tone: err ? 'error' : 'plain' }] : []} minRows={1} fontSize={OUT_FS} className={err ? 'w-[300px] shrink-0' : 'w-[220px] shrink-0'} />
              <div className="min-w-0 flex-1">
                <WhyLines on={shown} rows={round.options.filter((o) => o !== round.answer).map((o) => ({ opt: o, why: round.why[o] ?? '' }))} />
              </div>
            </Group>
          </div>
          <Group pad={10} className="flex min-w-0 flex-1 flex-col gap-2" active={b.kind === 'step'}>
            <div className="flex min-h-0 flex-1 items-start pt-4">
              <Swap k={r}>
                <Board rows={rows} tones={tones} stuck={stuck} size="lg" name="menu" minRows={4} lift={b.kind === 'step' && step!.result === 'found' && step!.key ? step!.key : null} search={search} lane={LANE} />
              </Swap>
            </div>
            <StepCaption badge={b.kind === 'step' ? `line ${step!.line}` : null} text={caption} tone={shown ? 'rule' : 'step'} size={16} minH={62} />
          </Group>
        </div>
      )}
      {shown && pick === right && <Confetti seed={40 + r} />}
      <StepControls at={beat} total={SCHEDULE.length} />
    </>
  )
}

