import { useState } from 'react'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Confetti } from './motion'
import { Fresh, type OutLine } from './pieces'
import { Vote } from './trace'
import { GameFrame, RoundHead, WhyLines, schedule } from './ChangeOrMove'
import { CallStrip, ParamBoxes, dictRows, parseCall, tupleItems, useChips, type BoxSpec } from './boxes'
import { SPEC } from './spec'

/**
 * GAME G2 · WHERE DOES IT LAND? Twenty-three presses: four rounds of the
 * ask, one press per argument, the body's press where it runs, the verdict.
 *
 *   - The def, its body and the call on the left; the vote beside them. Under
 *     them the call as chips over the parameter boxes in the def's order: a
 *     plain box per named parameter, `()` for *name, `{}` for **name.
 *   - One press per argument, left to right as the call is written: the chip
 *     flies to its box and leaves a dashed place. A value with no name fills
 *     the next empty named box, then joins the tuple; a name=value lands by
 *     its name, never by its place. `**dict` opens first, on its own press.
 *   - An argument with nowhere to go shakes in the danger tone and Python
 *     stops: the body never runs, the error line is the whole terminal.
 *   - Round 3 is the deck's Daily Challenge; round 4 is the edge.
 * Every program, step, caption and why line is the spec's, run on CPython
 * 3.12.3.
 */
const G2 = SPEC.G2
type Step = { caption: string; arg: string | null; to: string | null; boxes: Record<string, string | null>; printed: string }
type Round = { ask: string; program: string; output: string; params: [string, string][]; steps: Step[]; options: string[]; answer: string; why: Record<string, string>; because: string }
const ROUNDS: Round[] = G2.data.rounds
const SCHEDULE = schedule(ROUNDS, false)

const asWritten = (t: string) => t.replace(/^'(.*)'$/, '"$1"')

/** The boxes after `done` steps, from the step's own `boxes` strings. */
function boxesAt(round: Round, done: number, stopped: boolean): BoxSpec[] {
  const st = done > 0 ? round.steps[done - 1] : null
  return round.params.map(([name, kind]) => {
    const v = st?.boxes[name] ?? null
    const lit = st?.to === name
    if (kind === '*args') return { name, kind: 'tuple', items: v ? tupleItems(v) : [], tone: lit ? 'lit' : 'plain' }
    if (kind === '**kwargs') return { name, kind: 'dict', rows: v ? dictRows(v) : [], tone: lit ? 'lit' : 'plain' }
    return { name, kind: 'named', value: v, tone: lit ? 'lit' : stopped && v === null ? 'stop' : 'plain' }
  })
}

/** The pieces a `*list` or `**dict` opened into: the arguments of the steps after it, until the body's press. */
function openedPieces(round: Round, k: number): string[] {
  const out: string[] = []
  for (let i = k + 1; i < round.steps.length; i++) {
    const a = round.steps[i].arg
    if (!a) break
    out.push(a)
  }
  return out
}

export function Lands() {
  const beat = useBeats(SCHEDULE.length)
  const b = SCHEDULE[beat - 1]
  const r = b.kind === 'intro' ? 0 : b.r
  const round = ROUNDS[r]
  const [picks, setPicks] = useState<number[]>(ROUNDS.map(() => -1))
  const pick = picks[r]
  const setPick = (p: number) => setPicks((ps) => ps.map((v, j) => (j === r ? p : v)))
  const chips = useChips()
  const done = b.kind === 'step' ? b.s + 1 : b.kind === 'verdict' ? round.steps.length : 0
  const ran = round.steps.slice(0, done)
  const call = parseCall(round.program)
  const opened: Record<string, string[]> = {}
  const used: string[] = []
  let bad: string | null = null
  ran.forEach((st, k) => {
    if (!st.arg) return
    if (st.to) used.push(st.arg)
    else if (st.printed) bad = st.arg
    else opened[st.arg] = openedPieces(round, k)
  })
  const last = ran[ran.length - 1]
  const printed = last?.printed ?? ''
  const err = /Error/.test(printed)
  const stopped = !!bad
  const shown = b.kind === 'verdict'
  const out: OutLine[] = printed ? [{ text: printed, tone: err ? 'error' : 'plain' }] : []
  const right = round.options.indexOf(round.answer)
  const caption = b.kind === 'step' ? round.steps[b.s].caption : shown ? round.because : null
  const bodyLine = round.program.split('\n').findIndex((l) => /^\s+print/.test(l)) + 1
  const at = stopped ? round.program.split('\n').length : last && !last.arg ? bodyLine : null
  const picture = (
    <Fresh k={`r${r}`} className="flex w-full flex-col items-start gap-3">
      <CallStrip fn={call.fn} args={call.args} used={used} opened={opened} bad={bad} chipRef={chips.set} />
      <ParamBoxes boxes={boxesAt(round, done, stopped)} from={(t) => chips.get(asWritten(t)) ?? chips.get(Object.values(opened).flat().find((p) => p.endsWith(`=${asWritten(t)}`)) ?? '')} keyText={(t) => (t.includes(':') ? t.replace(':', '=') : t)} />
    </Fresh>
  )
  return (
    <>
      <GameFrame
        intro={null}
        head={<RoundHead r={r} n={ROUNDS.length} ask={round.ask} />}
        code={round.program}
        rows={5}
        topH={213}
        bottomH={194}
        captionH={64}
        at={at}
        stop={stopped}
        asking={b.kind === 'ask'}
        running={b.kind === 'step'}
        vote={<Vote key={`v${r}`} options={round.options} right={right} shown={shown} pick={pick} setPick={setPick} cols={1} size={15} nowrap dense />}
        picture={picture}
        pictureW={460}
        caption={caption}
        rule={shown}
        out={out}
        verdict={<WhyLines on={shown} cols={2} rows={round.options.filter((o) => o !== round.answer).map((o) => ({ opt: o, why: round.why[o] ?? '' }))} />}
        compactOut
        codeW={560}
      />
      {shown && pick === right && <Confetti seed={50 + r} />}
      <StepControls at={beat} total={SCHEDULE.length} />
    </>
  )
}
