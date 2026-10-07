import { useState } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { Confetti } from './motion'
import { Ask, sentences } from './pieces'
import { StepCaption, Vote } from './trace'
import { CodeBlock } from '@/ui'
import { SPEC } from './spec'

/**
 * GAME G1: MAKE IT PRINT THIS, CUT AND GLUE. Eighteen presses: three rounds
 * of the question, four tries and the verdict.
 *
 * The target output, big; the program with one blank; four values for the
 * blank. Nothing runs until the press after the room has voted (its must
 * line). Then each press tries one option, in the order A, B, C, D, the right
 * one included: the blank fills (the option `nothing` fills it with nothing,
 * so the call reads `split()`, its must line), the output it prints is drawn
 * under the target the same way, and the row says Hit or Miss. Every try
 * stays on screen. The verdict marks the answer, says why it is right, and
 * gives every wrong option its own line. Every template, option, output,
 * caption and why line is the spec's data; all twelve tries were run on
 * CPython (plan, outputs table).
 *
 * A click or keys 1 to 4 mark the room's pick; the press works with or
 * without a mark. Confetti when the marked pick was right.
 */
const G1 = SPEC.G1
type Try = { caption: string; fill: string; output: string; match: boolean }
type Round = { ask: string; template: string; target: string; options: string[]; answer: string; because: string; why: Record<string, string>; steps: Try[] }
const ROUNDS: Round[] = G1.data.rounds

type Beat = { r: number; kind: 'ask' | 'try' | 'verdict'; k: number }
const SCHEDULE: Beat[] = ROUNDS.flatMap((round, r) => [
  { r, kind: 'ask' as const, k: -1 },
  ...round.steps.map((_, k) => ({ r, kind: 'try' as const, k })),
  { r, kind: 'verdict' as const, k: round.steps.length - 1 },
])
export const G1_PRESSES = SCHEDULE.length /* 18 */

const fillOf = (o: string) => (o === 'nothing' ? '' : o)

/** The program with its blank: `____` while open, the option being tried once it runs. */
function filled(template: string, fill: string | null) {
  return fill === null ? template : template.replace('____', fillOf(fill))
}

function Verdict({ hit }: { hit: boolean }) {
  return (
    <span
      className="shrink-0 rounded-md px-2 py-0.5 text-[14px] font-bold uppercase tracking-wider"
      style={hit ? { background: `${colors.success}1F`, color: colors.success } : { background: `${colors.danger}14`, color: colors.danger }}
    >
      {hit ? 'Hit' : 'Miss'}
    </span>
  )
}

export function MakeItPrint() {
  const beat = useBeats(SCHEDULE.length)
  const tween = useTween(420)
  const b = SCHEDULE[beat - 1]
  const round = ROUNDS[b.r]
  const [picks, setPicks] = useState<number[]>(ROUNDS.map(() => -1))
  const pick = picks[b.r]
  const setPick = (p: number) => setPicks((ps) => ps.map((v, j) => (j === b.r ? p : v)))
  const shown = b.kind === 'verdict'
  const tried = b.kind === 'ask' ? [] : round.steps.slice(0, b.k + 1)
  const now = b.kind === 'try' ? round.steps[b.k] : null
  const right = round.options.indexOf(round.answer)
  const code = filled(round.template, now ? now.fill : shown ? round.answer : null)
  const caption = now ? now.caption : shown ? round.because : null
  return (
    <>
      <div className="flex items-start gap-7">
        <div className="flex w-[560px] shrink-0 flex-col gap-3">
          <div className="flex items-baseline gap-3">
            <span className="shrink-0 whitespace-nowrap font-heading text-[17px] font-bold" style={{ color: colors.brandDark }}>
              Round {b.r + 1} of {ROUNDS.length}
            </span>
            <span className="text-[14px] font-semibold leading-snug" style={{ color: colors.body }}>
              {sentences(G1.data.setup.goal)[0]}
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-card px-3 py-2" style={{ background: `${colors.accent}14`, boxShadow: `inset 0 0 0 2px ${colors.accent}` }}>
            <span className="w-[85px] shrink-0 text-[14px] font-bold uppercase tracking-wider" style={{ color: colors.accentDark }}>
              Target
            </span>
            <span className="whitespace-pre font-mono text-[21px] font-bold" style={{ color: colors.ink }}>
              {round.target}
            </span>
          </div>
          <CodeBlock key={code} code={code} filename="Python" chip={false} fontSize={16} rows={2} lines={now || shown ? { 2: 'now' } : { 2: 'mark' }} />
          <div className="flex min-h-[124px] flex-col gap-1">
            {tried.map((t, i) => (
              <div key={`${b.r}-${i}`} className="sm-bump flex h-[28px] items-center gap-3 rounded-lg px-3" style={{ background: i === b.k && !shown ? colors.white : 'transparent', boxShadow: i === b.k && !shown ? `inset 0 0 0 1.5px ${colors.line}` : 'none', transition: tween }}>
                <span className="w-[16px] shrink-0 font-mono text-[15px] font-bold" style={{ color: colors.muted }}>
                  {'ABCD'[i]}
                </span>
                <span className="w-[56px] shrink-0 text-[14px] font-semibold uppercase tracking-wider" style={{ color: colors.muted }}>
                  prints
                </span>
                <span className="min-w-0 flex-1 whitespace-pre font-mono text-[19px] font-bold" style={{ color: t.match ? colors.success : colors.ink }}>
                  {t.output}
                </span>
                <Verdict hit={t.match} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <Ask size={21}>
            <Lines lines={sentences(round.ask)} />
          </Ask>
          <Vote
            key={b.r}
            options={round.options}
            right={right}
            shown={shown}
            pick={pick}
            setPick={setPick}
            cols={1}
            size={17}
            dense
            details={round.options.map((o) => (o === round.answer ? undefined : <Lines lines={sentences(round.why[o] ?? '')} />))}
          />
          <StepCaption text={caption} tone={shown ? 'rule' : 'step'} size={16} minH={52} />
        </div>
      </div>
      {shown && pick === right && <Confetti seed={30 + b.r} />}
      <StepControls at={beat} total={SCHEDULE.length} />
    </>
  )
}
