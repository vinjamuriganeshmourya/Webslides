import { useState } from 'react'
import { colors } from '@/design/tokens'
import { CodeBlock, useBeats, type CodeLineState } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { Confetti } from './motion'
import { Memory, pictureOf, type MNode, type SpecStep, type StepLayout } from './memory'
import { Ask, sentences } from './pieces'
import { StepCaption, Vote } from './trace'
import { SPEC } from './spec'

/**
 * GAME G1: FREEZE FRAME ON THE SHARED ROAD TRIP. Thirteen presses.
 *
 * One program for every round, with a pause marker on the line the round
 * stops on. Each round: the question and three options, nothing running
 * (the asked variable's tag is drawn dashed with no arrow, so its box is not
 * shown while the question is open: its must_not); then one line per press
 * from where the last round froze, the tags and the song row updating, the
 * spec's caption for each; then the verdict: the answer marks, the caption
 * says why it is right, and every wrong option shows its own why line.
 *
 * road_trip and kiran are two tags with arrows into ONE row; first is a tag
 * with an arrow to one song. In round 3, when line 5 changes position 0,
 * first's arrow does not move (its must lines): first points at its own
 * object, the song it got on line 3, which the row no longer holds.
 *
 * A click or keys 1 to 3 mark the room's pick; the press works with or
 * without a mark. Confetti when the marked pick was right. Every round,
 * option, step, caption and why line is the spec's data.
 */
const G1 = SPEC.G1
const SRC: string = G1.code[0].src
type Round = { ask: string; stop: string; var: string; options: string[]; answer: string; because: string; why: Record<string, string>; steps: SpecStep[] }
const ROUNDS: Round[] = G1.data.rounds

type Beat = { r: number; kind: 'ask' | 'step' | 'verdict'; step?: SpecStep }
const SCHEDULE: Beat[] = ROUNDS.flatMap((round, r) => [
  { r, kind: 'ask' as const },
  ...round.steps.map((s) => ({ r, kind: 'step' as const, step: s })),
  { r, kind: 'verdict' as const },
])

/** The step the program has reached at schedule index i: it carries on across rounds. */
function reached(i: number): { step: SpecStep | null; prev: SpecStep | null } {
  const done = SCHEDULE.slice(0, i + 1).filter((b) => b.kind === 'step').map((b) => b.step!)
  const isStep = SCHEDULE[i].kind === 'step'
  return { step: done[done.length - 1] ?? null, prev: isStep ? (done[done.length - 2] ?? null) : null }
}

const LAY: StepLayout = {
  rows: { L1: { x: 140, y: 24 } },
  tags: { road_trip: { x: 0, y: 2 }, kiran: { x: 0, y: 50 } },
  size: 'xs',
  boxW: 110,
}

function PauseChip({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-[15px] font-bold" style={{ background: '#FFF4EC', color: colors.accentDark }}>
      <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden>
        <rect x="1" y="1" width="3.5" height="12" rx="1" fill={colors.accentDark} />
        <rect x="7.5" y="1" width="3.5" height="12" rx="1" fill={colors.accentDark} />
      </svg>
      {text}
    </span>
  )
}

export function FreezeFrame() {
  const beat = useBeats(SCHEDULE.length)
  const i = beat - 1
  const b = SCHEDULE[i]
  const round = ROUNDS[b.r]
  const { step, prev } = reached(i)
  const stopLine = round.steps[round.steps.length - 1].line
  const [picks, setPicks] = useState<number[]>(ROUNDS.map(() => -1))
  const pick = picks[b.r]
  const setPick = (p: number) => setPicks((ps) => ps.map((v, j) => (j === b.r ? p : v)))
  const shown = b.kind === 'verdict'
  const asking = b.kind === 'ask'

  /* the picture: tags and the shared row from the spec's step, plus first's own song */
  const pic = pictureOf(step, prev, LAY)
  const first = step?.vars?.first
  const hideAsked = asking ? round.var : null
  const nodes: MNode[] = [...pic.nodes]
  const tags = pic.tags.map((t) => (t.name === hideAsked ? { ...t, masked: true } : t))
  if (first) {
    nodes.push({ id: 'first-song', kind: 'obj', text: first, x: 140, y: 88, size: 'xs', fade: hideAsked === 'first' ? 0 : 1 })
    tags.push({ name: 'first', x: 0, y: 91, to: 'first-song', masked: hideAsked === 'first' })
  }

  const lines: Record<number, CodeLineState> = { [stopLine]: 'warn' }
  if (step && !asking) {
    for (let l = 1; l < step.line; l++) lines[l] = 'ran'
    lines[step.line] = 'now'
  } else if (step) {
    for (let l = 1; l <= step.line; l++) lines[l] = 'ran'
    lines[stopLine] = 'warn'
  }

  const caption = b.kind === 'step' ? b.step!.caption : shown ? round.because : null
  const ri = round.options.indexOf(round.answer)
  return (
    <>
      <div className="flex items-start gap-7">
        <div className="flex w-[470px] shrink-0 flex-col gap-2.5">
          <div className="flex items-center gap-3">
            <span className="font-heading text-[17px] font-bold" style={{ color: colors.brandDark }}>
              Round {b.r + 1} of {ROUNDS.length}
            </span>
            <PauseChip text={round.stop} />
          </div>
          <CodeBlock code={SRC} filename="Python" chip={false} fontSize={14} rows={7} lines={lines} />
          <Memory width={470} height={122} nodes={nodes} tags={tags} size="xs" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <Ask size={20}>
            <Lines lines={sentences(round.ask)} />
          </Ask>
          <Vote
            key={b.r}
            options={round.options}
            right={ri}
            shown={shown}
            pick={pick}
            setPick={setPick}
            cols={1}
            size={14}
            dense
            details={round.options.map((o) => (o === round.answer ? undefined : <Lines lines={sentences(round.why[o] ?? '')} />))}
          />
          <StepCaption line={b.kind === 'step' ? b.step!.line : null} text={caption} tone={shown ? 'rule' : 'step'} size={15} minH={84} />
        </div>
      </div>
      {shown && pick === ri && <Confetti seed={40 + b.r} />}
      <StepControls at={beat} total={SCHEDULE.length} />
    </>
  )
}
