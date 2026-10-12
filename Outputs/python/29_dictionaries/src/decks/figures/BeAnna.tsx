import { useState } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Focus, Group } from './common'
import { Confetti } from './motion'
import { Fresh, Swap, CODE_FS } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { Board, toRows, type Row, type RowTone } from './board'
import { Intro, RoundHead, WhyLines, schedule } from './frame'
import { HALF, Posed } from './Cast'
import { ANNA } from './people'
import { SPEC } from './spec'

/**
 * GAME G2 · BE ANNA. Forty-two presses: the intro, then three rounds (the
 * ask, one press per line that runs, the verdict).
 *
 *   - The program and the vote on the left; Anna's board on the right, the
 *     row being read lit, and Anna herself beside it: she reads a row, says
 *     the check out loud, claps or waves only when a print line says so.
 *     A line that never runs never lights, and in round 3 nothing happens
 *     at all: Anna stands still, and that is right.
 *   - Each press lights the line that ran and shows its caption, `Line n`.
 *   - The verdict marks the right option and gives a line for every wrong one.
 * Every program, step and why line is the spec's, run on CPython 3.12.3.
 */
const G2 = SPEC.G2
type Step = { caption: string; line: number; does: string }
type Round = { ask: string; program: string; options: string[]; answer: string; because: string; why: Record<string, string>; steps: Step[] }
const ROUNDS: Round[] = G2.data.rounds
const SCHEDULE = schedule(ROUNDS)
/** every round reads the same board */
const BOARD: Row[] = toRows([['tea', 12], ['coffee', 15], ['samosa', 15], ['maggi', 30]])

/** Which row Anna is reading at step `s` of round `r`: each "Reads the next row" moves down one. */
function rowAt(round: Round, s: number): number | null {
  let row = -1
  let reading: number | null = null
  for (let i = 0; i <= s; i++) {
    const st = round.steps[i]
    if (st.line === 2 && /^Reads/.test(st.does)) row++
    if (st.line === 2 && /^No more/.test(st.does)) reading = null
    else if (st.line >= 2) reading = row
    else reading = null
  }
  return reading !== null && reading >= 0 && reading < BOARD.length ? reading : null
}

/** What Anna does on this step: the lab gesture, and her face. */
function acting(step: Step | null): { gesture?: string; expression: string; at: number } {
  if (!step) return { expression: 'happy', at: 0.2 }
  if (/^Claps/.test(step.does)) return { gesture: 'clap', expression: 'happy', at: 1.3 }
  if (/^Waves/.test(step.does)) return { gesture: 'wave', expression: 'happy', at: 1.4 }
  if (/^Says/.test(step.does)) return { gesture: 'chinThink', expression: 'neutral', at: 1.0 }
  if (/^Reads/.test(step.does)) return { gesture: 'point', expression: 'neutral', at: 1.1 }
  if (/^Looks/.test(step.does)) return { gesture: 'pointAtScreen', expression: 'happy', at: 1.2 }
  return { expression: 'neutral', at: 0.2 }
}

export function BeAnna() {
  const beat = useBeats(SCHEDULE.length)
  const b = SCHEDULE[beat - 1]
  const r = b.kind === 'intro' ? 0 : b.r
  const round = ROUNDS[r]
  const [picks, setPicks] = useState<number[]>(ROUNDS.map(() => -1))
  const pick = picks[r]
  const setPick = (p: number) => setPicks((ps) => ps.map((v, j) => (j === r ? p : v)))
  const step = b.kind === 'step' ? round.steps[b.s] : null
  const reading = b.kind === 'step' ? rowAt(round, b.s) : null
  const tones: Record<string, RowTone> = {}
  if (reading !== null) tones[BOARD[reading].key] = 'lit'
  const right = round.options.indexOf(round.answer)
  const shown = b.kind === 'verdict'
  const act = acting(step)
  const caption = step ? step.does : shown ? round.because : null
  return (
    <>
      {b.kind === 'intro' ? (
        <Intro text={G2.data.intro} />
      ) : (
        <div className="flex items-stretch gap-3" style={{ height: 431 }}>
          <div className="flex w-[730px] shrink-0 flex-col gap-2.5">
            <Group pad={10} active={b.kind === 'ask'}>
              <Focus on={b.kind === 'ask'}>
                <Fresh k={r}>
                  <CodePane code={round.program} fontSize={CODE_FS} rows={4} at={step ? step.line : null} />
                </Fresh>
              </Focus>
            </Group>
            <Group pad={10} className="flex min-h-0 flex-1 flex-col gap-2.5">
              <RoundHead n={r + 1} of={ROUNDS.length} ask={round.ask} />
              <Vote key={`v${r}`} options={round.options} right={right} shown={shown} pick={pick} setPick={setPick} cols={3} size={18} nowrap dense />
              <WhyLines on={shown} rows={round.options.filter((o) => o !== round.answer).map((o) => ({ opt: o, why: round.why[o] ?? '' }))} />
            </Group>
          </div>
          <Group pad={10} className="flex min-w-0 flex-1 flex-col gap-2" active={b.kind === 'step'}>
            <div className="flex min-h-0 flex-1 items-start gap-3 pt-4">
              <Swap k={r}>
                <Board rows={BOARD} tones={tones} size="lg" name="menu" />
              </Swap>
              <div className="flex flex-col items-center gap-1 self-end">
                <Posed key={`${r}-${b.kind === 'step' ? b.s : b.kind}`} cfg={ANNA} crop={HALF} scale={0.4} apron gesture={act.gesture} expression={act.expression} at={act.at} seed={9} />
                <span className="font-heading text-[13px] font-bold" style={{ color: colors.body }}>Anna</span>
              </div>
            </div>
            <StepCaption badge={step ? `Line ${step.line}` : null} text={caption} tone={shown ? 'rule' : 'step'} size={16} minH={62} />
          </Group>
        </div>
      )}
      {shown && pick === right && <Confetti seed={60 + r} />}
      <StepControls at={beat} total={SCHEDULE.length} />
    </>
  )
}
