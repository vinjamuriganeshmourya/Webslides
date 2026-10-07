import { useState } from 'react'
import { colors } from '@/design/tokens'
import { Countdown, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { Confetti, Glow } from './motion'
import { Ask, Show, TaskPill, sentences } from './pieces'
import { StepCaption, Vote } from './trace'
import { CallCode, IoBox, usePhase } from './call'
import { SPEC } from './spec'

/**
 * THE WORKSHEET, RECAP, EXIT AND TAKEAWAY CARDS OF PF 22: S-RECAP, T1, T2,
 * X1, K1. Every program, output, step and line is the spec's; every output
 * was run on CPython 3.12.3 (`scripts/run-spec-programs.py`).
 */

/** The numbered brief of a task, revealed one step per press. Each step keeps rule 36. */
function Brief({ items, shown, size = 18 }: { items: string[]; shown: number; size?: number }) {
  const tween = useTween(480)
  return (
    <ol className="flex flex-col gap-2">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2.5 leading-snug" style={{ fontSize: size, color: colors.body, opacity: i < shown ? 1 : 0, transform: i < shown ? 'none' : 'translateY(6px)', transition: tween }}>
          <b className="w-5 shrink-0" style={{ color: colors.ink }}>
            {i + 1}.
          </b>
          <span className="font-semibold">
            <Lines lines={sentences(t)} />
          </span>
        </li>
      ))}
    </ol>
  )
}

/* ================================================================== S-RECAP */

const R = SPEC['S-RECAP']
const [WRONG, FIXED] = R.code as { src: string; output: string; input: string }[]

/**
 * RECAP: FIND THE LINE. Spec card S-RECAP, three presses. Press 1: the story,
 * the program (deck slide 9), the input, what it prints beside what we
 * wanted, the question (both outputs on screen from press 1, its must line).
 * Press 2: line 7 lights as the culprit, the why line. Press 3: line 7
 * becomes the fix and the output changes to the wanted one.
 */
export function RecapBug() {
  const beat = useBeats(3)
  const fixed = beat >= 3
  const prog = fixed ? FIXED : WRONG
  return (
    <>
      <div className="flex items-start gap-7">
        <div className="flex shrink-0 flex-col gap-3" style={{ width: 560 }}>
          <CallCode code={prog.src} fs={16} error={beat === 2 ? R.data.culprit : null} mark={fixed ? [R.data.culprit] : []} />
          <Ask size={24}>{R.show[4]}</Ask>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <p className="text-[19px] font-semibold leading-snug" style={{ color: colors.body }}>
            <Lines lines={sentences(R.show[0])} />
          </p>
          <IoBox title={R.show[1].replace(/:$/, '')} tone="in" lines={R.data.input} rows={2} fs={17} width={200} />
          <div className="flex gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="text-[16px] font-bold" style={{ color: colors.body }}>
                {R.show[2]}
              </span>
              <Glow on={fixed} color={colors.success}>
                <IoBox title="Output" lines={prog.output.split('\n')} rows={3} fs={17} />
              </Glow>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="text-[16px] font-bold" style={{ color: colors.body }}>
                {R.show[3]}
              </span>
              <IoBox title="Output" lines={R.data.right.split('\n')} rows={3} fs={17} />
            </div>
          </div>
          <Show on={beat >= 2}>
            <StepCaption badge={beat >= 2 ? `line ${R.data.culprit}` : null} text={beat >= 2 ? R.data.why : null} tone="rule" size={17} minH={52} />
          </Show>
        </div>
      </div>
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ================================================================== T1 */

const T1 = SPEC.T1
const [PARTY, , MOVED] = T1.code as { src: string; output: string }[]

/**
 * TASK 1: THE PARTY SCREEN. Spec card T1, four presses, 5:00. Press 1: the
 * story, party.py, the first step and the timer; no output (its must_not).
 * Press 2: step 2. Press 3: step 3, framed as the instructor's own notes.
 * Press 4: the moved program, line 2 where Python stopped, and the terminal
 * as Python prints it: `Cake time!`, then the NameError.
 */
export function Task1() {
  const beat = useBeats(4)
  const moved = beat >= 4
  return (
    <>
      <div className="flex items-start gap-8">
        <div className="flex shrink-0 flex-col gap-3" style={{ width: 540 }}>
          <p className="text-[19px] font-semibold leading-snug" style={{ color: colors.body }}>
            <Lines lines={sentences(T1.show[1])} />
          </p>
          <CallCode key={moved ? 'moved' : 'party'} code={moved ? MOVED.src : PARTY.src} fs={15} rows={8} error={moved ? 2 : null} />
          <StepCaption text={moved ? T1.show[5] : null} size={18} minH={52} tone="rule" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-3">
              <TaskPill>{T1.show[0]}</TaskPill>
              <Brief items={[T1.show[2], T1.show[3], T1.show[4]]} shown={beat >= 3 ? 3 : beat} size={17} />
            </div>
            <Countdown seconds={T1.timer} />
          </div>
          <IoBox title="Terminal" lines={moved ? MOVED.output.split('\n') : []} rows={2} fs={16} />
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ================================================================== T2 */

const T2 = SPEC.T2
const [GAP, DONE] = T2.code as { src: string; output?: string; input?: string }[]
const AT7 = DONE.src.replace('letters * 5', 'letters * 7')

/** One bakery bill: the words on the cake, the letter count, the cost handed back. */
function Bill({ n, text, letters, cost, step, changed }: { n: number; text: string; letters: number; cost: string; step: number; changed: boolean }) {
  const tween = useTween(480)
  const row = (on: boolean) => ({ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(6px)', transition: tween })
  return (
    <Glow on={step >= 3} pulse={changed ? 'x' : 'y'} color={colors.success} className="flex-1">
      <div className="flex flex-col gap-1 rounded-card bg-white px-4 py-2.5" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}, 0 6px 14px -8px rgba(16,32,58,0.16)`, minHeight: 122 }}>
        <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.accentDark }}>
          Cake {n}
        </span>
        <span className="font-mono text-[17px] font-semibold" style={{ color: colors.ink, ...row(step >= 1) }}>
          '{text}'
        </span>
        <span className="font-mono text-[16px]" style={{ color: colors.body, ...row(step >= 2) }}>
          letters = {letters}
        </span>
        <span className="font-mono text-[18px] font-bold" style={{ color: changed ? colors.success : colors.brandDark, ...row(step >= 3) }}>
          cost_{n} = {cost}
        </span>
      </div>
    </Glow>
  )
}

/**
 * TASK 2: THE ICING BILL. Spec card T2, five presses, 6:00. Press 1: the
 * story, icing.py with line 6 a gap, the steps and the timer; nothing filled
 * (its must line). Press 2: line 6 fills, lines 11 to 13 appear for cake 2.
 * Press 3: cake 1 as one move (the text goes in, 17 letters, 85 comes back to
 * cost_1 and prints). Press 4: cake 2 the same, 7 and 35. Press 5: the
 * question; line 6 lights, 5 becomes 7, both outputs change to 119 and 49.
 */
export function Task2() {
  const beat = useBeats(5)
  const p3 = usePhase(beat, 3, [600, 1000, 1000])
  const p4 = usePhase(beat, 4, [600, 1000, 1000])
  const p5 = usePhase(beat, 5, [3200, 1100])
  const d = T2.data
  const seven = beat >= 5 && p5 >= 2
  const src = beat === 1 ? GAP.src : seven ? AT7 : DONE.src
  const c1 = beat >= 4 ? 3 : beat === 3 ? p3 : 0
  const c2 = beat >= 5 ? 3 : beat === 4 ? p4 : 0
  const outs = seven ? d.outputs_at_7 : d.outputs
  const printed = [c1 >= 3 ? outs[0] : null, c2 >= 3 ? outs[1] : null].filter(Boolean) as string[]
  const runLine = beat === 3 ? (p3 >= 3 ? 10 : p3 >= 2 ? 6 : 9) : beat === 4 ? (p4 >= 3 ? 13 : p4 >= 2 ? 6 : 12) : null
  return (
    <>
      <div className="flex items-start gap-7">
        <div className="flex shrink-0 flex-col gap-3" style={{ width: 520 }}>
          <CallCode key={src} code={src} fs={15} rows={13} grey={beat === 1 ? [6] : []} mark={beat >= 5 && p5 >= 1 ? [6] : beat === 2 ? [6, 11, 12, 13] : []} frame={runLine ? { at: runLine, waiting: null, jumpIn: null, jumpBack: null, inCall: false, step: null } : null} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-center justify-between gap-5">
            <TaskPill>{T2.show[0]}</TaskPill>
            <Countdown seconds={T2.timer} />
          </div>
          <div className="flex items-start gap-5">
            <p className="min-w-0 flex-1 text-[17px] font-semibold leading-snug" style={{ color: colors.body }}>
              <Lines lines={sentences(T2.show[1])} />
            </p>
            <div className="w-[190px] shrink-0">
              <Brief items={[T2.show[2]]} shown={1} size={17} />
            </div>
          </div>
          <div className="flex gap-3">
            <Bill n={1} text={d.inputs[0]} letters={d.letters[0]} cost={outs[0]} step={c1} changed={seven} />
            <Bill n={2} text={d.inputs[1]} letters={d.letters[1]} cost={outs[1]} step={c2} changed={seven} />
          </div>
          <div className="flex items-start gap-3">
            <IoBox title="Output" lines={printed} rows={2} fs={16} width={150} />
            <div className="min-w-0 flex-1">
              <StepCaption key={`${beat}-${seven}`} text={beat === 5 ? (seven ? T2.show[4] : T2.show[3]) : null} tone={seven ? 'rule' : 'step'} size={17} minH={52} />
            </div>
          </div>
        </div>
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}

/* ================================================================== X1 */

const X1 = SPEC.X1
type Opt = { line8: string; shows: string; why: string }
const OPTS: Opt[] = X1.data.options
const X1_RIGHT = 'ABCD'.indexOf(X1.data.right)

/**
 * EXIT: THE EMPTY PARTY SCREEN. Spec card X1, two presses, 2:30. Press 1:
 * the story, wish.py with line 8 as a gap, the question, three options and
 * the timer; no output (its must_not). Press 2: the right option marks and
 * EVERY option shows what the screen shows with it, and its why line.
 */
export function ExitWish() {
  const beat = useBeats(2)
  const shown = beat >= 2
  const [pick, setPick] = useState(-1)
  return (
    <>
      <div className="flex items-start gap-7">
        <div className="flex shrink-0 flex-col gap-3" style={{ width: 520 }}>
          <p className="text-[19px] font-semibold leading-snug" style={{ color: colors.body }}>
            <Lines lines={sentences(X1.show[0])} />
          </p>
          <CallCode code={X1.code[0].src} fs={17} grey={[8]} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-6">
            <Ask size={22}>{X1.show[1]}</Ask>
            <Countdown seconds={X1.timer} />
          </div>
          <Vote
            options={OPTS.map((o) => o.line8)}
            right={X1_RIGHT}
            shown={shown}
            pick={pick}
            setPick={setPick}
            cols={1}
            size={18}
            dense
            details={OPTS.map((o, i) => (
              <span key={i} className="block">
                <span className="block whitespace-nowrap font-mono text-[15px] font-bold leading-snug" style={{ color: o.shows.startsWith('NameError') ? colors.danger : i === X1_RIGHT ? colors.success : colors.ink }}>
                  {o.shows}
                </span>
                <Lines lines={sentences(o.why)} />
              </span>
            ))}
          />
        </div>
      </div>
      {shown && pick === X1_RIGHT && <Confetti seed={25} />}
      <StepControls at={beat} total={2} />
    </>
  )
}

/* ================================================================== K1 */

const K1 = SPEC.K1
type Ex = { file: string; src: string; output: string; input: string }
const EXAMPLES: Ex[] = K1.code
/* the spec's `show` pairs each heading with its sentence: heading, sentence, heading, … */
const SENT: string[] = (K1.show as string[]).filter((_, i) => i % 2 === 1)

function MiniCode({ src }: { src: string }) {
  return (
    <div className="relative w-[200px] shrink-0 rounded-lg px-2.5 pb-1.5 pt-3.5" style={{ background: colors.night2 }}>
      <span className="absolute right-2 top-0.5 text-[10px] font-semibold" style={{ color: colors.muted }}>
        Python
      </span>
      <div className="font-mono text-[10.5px] leading-[14px]" style={{ color: colors.white }}>
        {src.split('\n').map((l, i) => (
          <div key={i} className="whitespace-pre">
            {l || ' '}
          </div>
        ))}
      </div>
    </div>
  )
}

function Slot({ n, ex, filled }: { n: number; ex: Ex; filled: boolean }) {
  const tween = useTween(480)
  const err = ex.output.startsWith('NameError')
  return (
    <div
      className="relative flex h-[200px] flex-col gap-1.5 rounded-card px-3 py-2"
      style={{
        background: filled ? colors.white : 'transparent',
        boxShadow: filled ? `inset 0 0 0 1.5px ${colors.line}, 0 6px 14px -8px rgba(16,32,58,0.16)` : `inset 0 0 0 2px ${colors.line}`,
        transition: tween,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[13px] font-bold" style={{ background: filled ? colors.brandDark : colors.surface2, color: filled ? colors.white : colors.muted }}>
          {n + 1}
        </span>
        <span className="font-heading text-[16px] font-bold leading-none" style={{ color: colors.ink, opacity: filled ? 1 : 0, transition: tween }}>
          {ex.file}
        </span>
      </div>
      {filled && (
        <div className="sm-bump flex flex-col gap-1.5">
          <div className="flex items-start gap-2.5">
            <MiniCode src={ex.src} />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
                Input
              </span>
              <span className="font-mono text-[13px] font-semibold" style={{ color: colors.ink }}>
                {ex.input}
              </span>
              <span className="mt-1 text-[11px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
                Output
              </span>
              <span
                className={`whitespace-pre-wrap rounded-md px-2 py-0.5 font-mono font-bold ${err ? 'text-[11px] leading-[14px]' : 'text-[12.5px] leading-[17px]'}`}
                style={{ background: err ? '#FDECEC' : `${colors.success}1A`, color: err ? colors.danger : ex.output === '(nothing)' ? colors.muted : colors.ink, boxShadow: `inset 0 0 0 1.5px ${err ? colors.danger : colors.success}` }}
              >
                {ex.output}
              </span>
            </div>
          </div>
          <span className="text-[13px] font-semibold leading-[17px]" style={{ color: colors.body }}>
            <Lines lines={sentences(SENT[n])} />
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * KEY TAKEAWAYS: TODAY, IN SIX EXAMPLES. Spec card K1, six presses. All six
 * slots are there from press 1 (its must line); each press fills one with
 * its heading, code, input, result and sentence. Examples, not a concept map.
 */
export function Takeaways() {
  const beat = useBeats(6)
  return (
    <>
      {/* left-aligned and 32px short of the zone's right edge, so the grid is one left block (content rule 38) */}
      <div className="grid grid-cols-3 gap-x-3 gap-y-2.5" style={{ width: 'calc(100% - 32px)' }}>
        {EXAMPLES.map((ex, i) => (
          <Slot key={ex.file} n={i} ex={ex} filled={beat >= i + 1} />
        ))}
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}
