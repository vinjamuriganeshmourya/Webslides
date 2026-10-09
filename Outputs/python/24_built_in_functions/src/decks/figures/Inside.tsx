import { useState } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { Confetti } from './motion'
import { Ask, OutPanel, sentences } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { APP, DAYS } from './ScreenTime'
import { SPEC } from './spec'

/**
 * GAME G2: INSIDE THE BUILT-IN. Twenty-seven presses: four rounds, each its
 * ask, one press per step, then the verdict.
 *
 *   - The round's program and the vote on the left; its list drawn big on the
 *     right as Ravi's screen time bars (H2's colours and days, its must
 *     line), the keeping box and the output under them.
 *   - The ask press: nothing moves, no pointer, the keeping box empty. Keys 1
 *     to 4 or a click mark the room's choice; the right arrow works either way.
 *   - Each step press: the pointer moves to the step's `item` and the keeping
 *     box shows the step's `keeping`, both read from the data. The print step
 *     (`item` null) fills the output. sorted's keeping is a new row built
 *     beside the original, which never changes order or value.
 *   - The verdict: the right option marks, every wrong option shows its why
 *     line, and the caption is the spec's `because`. Confetti on a right mark.
 *   - Strings are drawn in quotes (round 4), so they are visibly not numbers.
 *
 * Every program, output, option, caption and kept value is the spec's data.
 */
const G2 = SPEC.G2
type Step = { caption: string; item: number | string | null; keeping: number | string | number[] }
type Round = { ask: string; program: string; output: string; options: string[]; answer: string; because: string; why: Record<string, string>; steps: Step[] }
const ROUNDS: Round[] = G2.data.rounds

type Beat = { kind: 'ask' | 'verdict'; r: number } | { kind: 'step'; r: number; s: number }
const SCHEDULE: Beat[] = ROUNDS.flatMap((rd, r) => [{ kind: 'ask' as const, r }, ...rd.steps.map((_, s) => ({ kind: 'step' as const, r, s })), { kind: 'verdict' as const, r }])

/** The list the round's built-in reads: from line 1, `minutes = [...]`. */
const itemsOf = (program: string): (number | string)[] => JSON.parse(program.split('\n')[0].split(' = ')[1])
const show = (v: number | string) => (typeof v === 'string' ? `'${v}'` : String(v))
const fnOf = (program: string) => (program.match(/\b(max|min|sum|sorted)\(/) ?? [])[1] ?? ''
const KEEP: Record<string, string> = { max: 'Biggest so far', min: 'Smallest so far', sum: 'Total so far', sorted: 'The new list' }

function Bars({ items, at }: { items: (number | string)[]; at: number }) {
  const tween = useTween(420)
  const nums = items.map(Number)
  const max = Math.max(...nums)
  const colW = 104
  const chartH = 150
  return (
    <div className="flex flex-col gap-1">
      {/* the pointer, in its own lane above the bars */}
      <div className="relative h-[22px]" style={{ width: colW * items.length }}>
        {at >= 0 && (
          <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden className="absolute top-0" style={{ left: at * colW + colW / 2 - 9, transition: tween }}>
            <path d="M9 19 V7" stroke={APP.ink} strokeWidth="2.6" strokeLinecap="round" />
            <path d="M3.5 12.5 L9 19 L14.5 12.5" fill="none" stroke={APP.ink} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div className="flex items-end" style={{ height: chartH }}>
        {items.map((v, i) => (
          <div key={i} className="flex flex-col items-center justify-end" style={{ width: colW, height: '100%' }}>
            <span className="mb-1 font-mono text-[16px] font-bold" style={{ color: i === at ? APP.top : APP.ink }}>
              {show(v)}
            </span>
            <span className="block rounded-t-md" style={{ width: 54, height: Math.round((nums[i] / max) * (chartH - 34)), background: i === at ? APP.top : APP.bar, transition: tween }} />
          </div>
        ))}
      </div>
      <div className="flex border-t pt-1" style={{ borderColor: APP.grid }}>
        {items.map((_, i) => (
          <span key={i} className="text-center text-[14px] font-semibold" style={{ width: colW, color: APP.soft }}>
            {DAYS[i]}
          </span>
        ))}
      </div>
    </div>
  )
}

function Keeping({ label, value }: { label: string; value: Step['keeping'] | null }) {
  return (
    <div className="flex min-h-[52px] items-center gap-3 rounded-card px-4 py-2" style={{ background: colors.surface2, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
      <span className="shrink-0 whitespace-nowrap text-[14px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
        {label}
      </span>
      {Array.isArray(value) ? (
        <span className="flex gap-1.5">
          {value.map((v, i) => (
            <span key={`${i}-${v}`} className="sm-bump grid h-[36px] min-w-[46px] place-items-center rounded-md bg-white px-1.5 font-mono text-[17px] font-bold" style={{ color: colors.ink, boxShadow: `inset 0 0 0 2px ${colors.brand}` }}>
              {v}
            </span>
          ))}
        </span>
      ) : (
        <span key={String(value)} className="sm-bump font-mono text-[22px] font-bold" style={{ color: colors.accentDark }}>
          {value === null ? ' ' : show(value)}
        </span>
      )}
    </div>
  )
}

export function InsideBuiltin() {
  const beat = useBeats(SCHEDULE.length)
  const b = SCHEDULE[beat - 1]
  const round = ROUNDS[b.r]
  const [picks, setPicks] = useState<number[]>(ROUNDS.map(() => -1))
  const pick = picks[b.r]
  const setPick = (p: number) => setPicks((ps) => ps.map((v, j) => (j === b.r ? p : v)))
  const items = itemsOf(round.program)
  const step = b.kind === 'step' ? round.steps[b.s] : b.kind === 'verdict' ? round.steps[round.steps.length - 1] : null
  const at = step && step.item !== null ? items.indexOf(step.item) : -1
  const printed = step && step.item === null
  const shown = b.kind === 'verdict'
  const right = round.options.indexOf(round.answer)
  const lastLine = round.program.split('\n').length
  const caption = b.kind === 'step' ? step!.caption : shown ? round.because : null
  return (
    <>
      <div className="flex items-start gap-7">
        <div className="flex w-[440px] shrink-0 flex-col gap-3">
          <CodePane code={round.program} mark={[lastLine]} fontSize={16} rows={3} />
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
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-baseline gap-3">
            <span className="shrink-0 whitespace-nowrap font-heading text-[17px] font-bold" style={{ color: colors.brandDark }}>
              Round {b.r + 1} of {ROUNDS.length}
            </span>
            <Ask size={20}>{round.ask}</Ask>
          </div>
          <Bars items={items} at={at} />
          <div className="flex items-stretch gap-3">
            <div className="min-w-0 flex-1">
              <Keeping label={KEEP[fnOf(round.program)]} value={step ? step.keeping : null} />
            </div>
            <div className="w-[250px] shrink-0">
              <OutPanel lines={printed ? [{ text: round.output }] : []} minRows={1} fontSize={17} />
            </div>
          </div>
          <StepCaption badge={b.kind === 'step' ? `step ${b.s + 1}` : null} text={caption} tone={shown ? 'rule' : 'step'} size={17} minH={54} />
        </div>
      </div>
      {shown && pick === right && <Confetti seed={90 + b.r} />}
      <StepControls at={beat} total={SCHEDULE.length} />
    </>
  )
}
