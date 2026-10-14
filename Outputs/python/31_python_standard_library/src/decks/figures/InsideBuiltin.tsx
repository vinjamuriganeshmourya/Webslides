import { useState } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Focus, Group } from './common'
import { Confetti } from './motion'
import { Fresh, CODE_FS, type OutLine } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { OutRow, RoundHead, WhyLines, schedule } from './game'
import { SPEC } from './spec'

/**
 * GAME G2 · INSIDE THE BUILT-IN. Thirty presses: four rounds of the ask,
 * one spend per press, the print step, the verdict.
 *
 *   - Ravi's payment app spends this week as five tiles, in the app's look:
 *     a round badge with the merchant's initial, the name, the amount.
 *   - The program and the vote on top; under them the tiles with a pointer
 *     in its own lane above the row (rule 42), the keeping box beside the
 *     row from the first step, the caption, the output as one labelled row
 *     and the verdict's why lines.
 *   - Nothing in a round moves until the press after the room has answered;
 *     the spends row never changes (its must lines). Round 1 is filter,
 *     round 2 map with the same is_big; round 4 is the edge, a quiet week.
 * Every program ran on CPython 3.12.3 and matches the spec.
 */
const G2 = SPEC.G2
type Step = { caption: string; item: string | null; keeping: string }
type Round = { ask: string; program: string; output: string; options: string[]; answer: string; because: string; why: Record<string, string>; steps: Step[] }
const ROUNDS: Round[] = G2.data.rounds
const SCHEDULE = schedule(ROUNDS, false)
const TOP_H = 228
const BOTTOM_H = 182
/* the payment app's own colours, inside the tiles only (content rule 37) */
const BADGE = ['#1A73E8', '#E37400', '#188038', '#9334E6', '#D93025']

/** One spend as a payment tile: the badge, the name, the amount. */
function PayTile({ name, amount, i, now, seen }: { name: string; amount: string; i: number; now: boolean; seen: boolean }) {
  const tween = useTween(420)
  return (
    <div className="flex h-[48px] w-[86px] flex-col items-center justify-center gap-0 rounded-lg bg-white" style={{ boxShadow: `inset 0 0 0 ${now ? 2.5 : 1.5}px ${now ? colors.brand : colors.line}`, opacity: seen || now ? 1 : 0.75, transition: tween }}>
      <span className="grid h-[16px] w-[16px] place-items-center rounded-full text-[9px] font-bold text-white" style={{ background: BADGE[i % BADGE.length] }}>
        {name[0]}
      </span>
      <span className="whitespace-nowrap text-[10px] font-semibold leading-[12px]" style={{ color: colors.body }}>
        {name}
      </span>
      <span className="font-mono text-[12px] font-bold leading-[13px]" style={{ color: colors.ink }}>
        ₹{amount}
      </span>
    </div>
  )
}

/** The row of spends with the pointer above the item being looked at, and the keeping box beside it. */
function Spends({ round, at, keeping, label }: { round: Round; at: number | null; keeping: string; label: string }) {
  const instant = useInstant()
  const items = round.steps.filter((s) => s.item).map((s) => s.item!.split(' '))
  const TILE = 86
  const GAP = 8
  const x = at === null ? null : at * (TILE + GAP) + TILE / 2
  return (
    <div className="flex items-end gap-4">
      <div className="relative" style={{ paddingTop: 16 }}>
        {x !== null && (
          <div aria-hidden className="absolute flex flex-col items-center" style={{ left: x - 13, top: 0, width: 26, transition: instant ? 'none' : 'left 480ms cubic-bezier(0.22,1,0.36,1)' }}>
            <svg width="26" height="16" viewBox="0 0 26 16" aria-hidden>
              <path d="M13 1 v6" stroke={colors.brandDark} strokeWidth="3" strokeLinecap="round" />
              <path d="M4 7 L13 15 L22 7 Z" fill={colors.brandDark} />
            </svg>
          </div>
        )}
        <div className="flex" style={{ gap: GAP }}>
          {items.map(([name, amount], i) => (
            <PayTile key={name} name={name} amount={amount} i={i} now={at === i} seen={at !== null && i < at} />
          ))}
        </div>
      </div>
      <div className="flex h-[48px] flex-col justify-center gap-0 rounded-lg px-3" style={{ minWidth: 130, background: colors.surface2, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
        <span className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
          {label}
        </span>
        <span key={keeping} className="sm-bump whitespace-nowrap font-mono text-[14px] font-bold" style={{ color: colors.brandDark }}>
          {keeping}
        </span>
      </div>
    </div>
  )
}

export function InsideBuiltin() {
  const beat = useBeats(SCHEDULE.length)
  const b = SCHEDULE[beat - 1]
  const r = b.kind === 'intro' ? 0 : b.r
  const round = ROUNDS[r]
  const [picks, setPicks] = useState<number[]>(ROUNDS.map(() => -1))
  const pick = picks[r]
  const setPick = (p: number) => setPicks((ps) => ps.map((v, j) => (j === r ? p : v)))
  const stepIx = b.kind === 'step' ? b.s : b.kind === 'verdict' ? round.steps.length - 1 : -1
  const step = stepIx >= 0 ? round.steps[stepIx] : null
  const shown = b.kind === 'verdict'
  const right = round.options.indexOf(round.answer)
  const items = round.steps.filter((s) => s.item).length
  const at = step && step.item ? stepIx : null
  const printed = !!step && !step.item
  const out: OutLine[] = printed || shown ? [{ text: round.output }] : []
  const keeping = step ? step.keeping : /reduce/.test(round.program) ? '' : '[]'
  const label = /reduce/.test(round.program) ? 'so far' : 'keeping'
  const caption = b.kind === 'step' ? step!.caption : shown ? round.because : null
  const bodyLine = round.program.split('\n').length
  const codeAt = step ? (printed ? bodyLine : 2) : null
  return (
    <>
      <div className="flex flex-col gap-2.5">
        <Group pad={10} className="flex items-stretch gap-4" style={{ height: TOP_H }} active={b.kind === 'ask'}>
          <div className="w-[480px] shrink-0">
            <Focus on={b.kind === 'ask'}>
              <CodePane code={round.program} fontSize={CODE_FS} rows={7} dense at={codeAt} />
            </Focus>
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
            <RoundHead r={r} n={ROUNDS.length} ask={round.ask} askSize={16} />
            <Vote key={`v${r}`} options={round.options} right={right} shown={shown} pick={pick} setPick={setPick} cols={2} size={12.5} gap={6} nowrap dense />
          </div>
        </Group>
        <Group pad={8} className="flex flex-col gap-1.5" style={{ height: BOTTOM_H }} active={b.kind === 'step'}>
          <div className="flex items-end justify-between gap-3">
            <Fresh k={`r${r}`}>
              <Spends round={round} at={at} keeping={keeping} label={label} />
            </Fresh>
            <span className="pb-1 text-[11px] font-semibold" style={{ color: colors.muted }}>
              {items} spends · the list never changes
            </span>
          </div>
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <StepCaption text={caption} tone={shown ? 'rule' : 'step'} size={13.5} h={34} />
            </div>
            <div className="w-[330px] shrink-0">
              <OutRow lines={out} />
            </div>
          </div>
          <WhyLines on={shown} cols={3} dense rows={round.options.filter((o) => o !== round.answer).map((o) => ({ opt: o, why: round.why[o] ?? '' }))} />
        </Group>
      </div>
      {shown && pick === right && <Confetti seed={50 + r} />}
      <StepControls at={beat} total={SCHEDULE.length} />
    </>
  )
}
