import { useState } from 'react'
import { colors } from '@/design/tokens'
import { CodeBlock, Countdown, type CodeLineState, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { Confetti } from './motion'
import { Ask, TaskPill, sentences } from './pieces'
import { StepCaption, Vote } from './trace'
import { IoBox } from './call'
import { SPEC } from './spec'

/**
 * THE WORKSHEET, EXIT AND TAKEAWAY CARDS OF PF 23: T1, T2, X1, K1. Every
 * program, output, step and line is the spec's; every output was run on
 * CPython 3.12.3 (`scripts/run-spec-programs.py`).
 */

const isErr = (t: string) => /^\w*Error/.test(t)

/** The numbered brief of a task, revealed one step per press. Each step keeps rule 36. */
function Brief({ items, shown, size = 18 }: { items: React.ReactNode[]; shown: number; size?: number }) {
  const tween = useTween(480)
  return (
    <ol className="flex flex-col gap-1.5">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2.5 leading-[1.3]" style={{ fontSize: size, color: colors.body, opacity: i < shown ? 1 : 0, transform: i < shown ? 'none' : 'translateY(6px)', transition: tween }}>
          <b className="w-5 shrink-0" style={{ color: colors.ink }}>
            {i + 1}.
          </b>
          <span className="font-semibold">{typeof t === 'string' ? <Lines lines={sentences(t)} /> : t}</span>
        </li>
      ))}
    </ol>
  )
}

/* ================================================================== T1 */

const T1 = SPEC.T1
const TRIP = T1.code[0] as { src: string; output: string }
const TRIP_OUT: string[] = TRIP.output.split('\n')
const FIX: string = /Fixed line 7: (.*)\.$/.exec(T1.answer)![1]

/** A small route card, the maps app's own shape: the line that ran, a start circle, a pin, what it printed. */
function RouteCard({ line, text, fixed = false }: { line: number; text: string; fixed?: boolean }) {
  const err = isErr(text)
  return (
    <div
      key={text}
      className="sm-bump flex items-center gap-3 rounded-xl bg-white px-3 py-2"
      style={{ boxShadow: `inset 0 0 0 ${fixed ? 2.5 : 1.5}px ${err ? colors.danger : fixed ? colors.success : colors.line}, 0 4px 10px -6px rgba(16,32,58,0.18)`, background: err ? '#FDECEC' : colors.white }}
    >
      <span className="shrink-0 rounded-md px-2 py-0.5 font-mono text-[14px] font-bold" style={{ background: colors.brandDark, color: colors.white }}>
        line {line}
      </span>
      {!err && (
        <svg width="14" height="30" viewBox="0 0 14 30" aria-hidden className="shrink-0">
          <circle cx="7" cy="6" r="4.5" fill={colors.white} stroke={colors.ink} strokeWidth="2.2" />
          <path d="M7 12v6" stroke={colors.muted} strokeWidth="2" strokeDasharray="2 2.5" />
          <path d="M7 29s5-5.4 5-9.1A5 5 0 0 0 2 19.9C2 23.6 7 29 7 29z" fill={colors.danger} />
        </svg>
      )}
      <span className="min-w-0 font-mono font-semibold leading-snug" style={{ fontSize: err ? 14 : 18, color: err ? colors.danger : colors.ink }}>
        {text}
      </span>
    </div>
  )
}

/**
 * TASK 1: THE TRIP PROGRAM. Spec card T1, six presses, 5:00. 1: the story,
 * trip.py, the steps and the timer; no result (its must_not). 2 to 5: one call
 * line per press lights and its result appears; the three printed lines come
 * before the error, as Python shows them. 6: the fix: line 7 by name, and its
 * result is now the right trip.
 */
export function TripTask() {
  const beat = useBeats(6)
  const fixed = beat >= 6
  const src = fixed ? TRIP.src.split('\n').map((l, i) => (i === 6 ? FIX : l)).join('\n') : TRIP.src
  const lit = beat >= 2 && beat <= 5 ? beat + 4 : fixed ? 7 : null
  const shownN = fixed ? 4 : Math.max(0, beat - 1)
  return (
    <>
      <div className="flex items-start gap-8">
        <div className="flex shrink-0 flex-col gap-3" style={{ width: 500 }}>
          <p className="text-[20px] font-semibold leading-snug" style={{ color: colors.body }}>
            {sentences(T1.show[1])[0]}
          </p>
          <CodeBlock key={src} code={src} filename="Python" chip={false} fontSize={17} rows={9} lines={lit ? { [lit]: lit === 9 ? 'error' : fixed ? 'mark' : 'now' } : {}} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-3">
              <TaskPill>{T1.show[0]}</TaskPill>
              {fixed ? <StepCaption text={T1.show[3]} tone="rule" size={18} minH={52} /> : <Brief items={sentences(T1.show[2])} shown={3} size={18} />}
            </div>
            <Countdown seconds={T1.timer} />
          </div>
          <div className="flex flex-col gap-2">
            {TRIP_OUT.slice(0, shownN).map((t, i) => (
              <RouteCard key={`${i}-${fixed && i === 1}`} line={6 + i} text={fixed && i === 1 ? TRIP_OUT[2] : t} fixed={fixed && i === 1} />
            ))}
          </div>
        </div>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}

/* ================================================================== T2 */

const T2 = SPEC.T2
const [FARES, FARES_DEF, FARES_NOTES] = T2.code as { src: string; output: string }[]
const MY_LINE: string = FARES_NOTES.src.split('\n')[1]

/**
 * TASK 2: RAPIDO FARES. Spec card T2, six presses, 6:00. 1: the story,
 * fares.py, step 1 and the timer; no output (its must_not). 2: step 2, the
 * default. 3: step 3, framed as the instructor's own notes, with the line.
 * 4: fares.py runs. 5: fares_default.py: the same output, less typing. 6: my
 * notes: the terminal shows ONLY the SyntaxError (its must line), and why.
 */
export function FareTask() {
  const beat = useBeats(6)
  const prog = beat >= 6 ? FARES_NOTES : beat === 5 ? FARES_DEF : FARES
  const lines: Record<number, CodeLineState> = beat >= 6 ? { 2: 'error' as const } : beat === 5 ? { 2: 'mark' as const, 5: 'mark' as const, 6: 'mark' as const } : {}
  const outLines = beat >= 4 ? prog.output.split('\n') : []
  return (
    <>
      <div className="flex items-start gap-8">
        <div className="flex shrink-0 flex-col gap-3" style={{ width: 500 }}>
          <CodeBlock key={prog.src} code={prog.src} filename="Python" chip={false} fontSize={17} rows={7} lines={lines} />
          <IoBox key={beat >= 6 ? 'err' : beat >= 4 ? 'run' : 'none'} title="Terminal" lines={outLines} rows={4} fs={16} wrap />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-6">
            <TaskPill>{T2.show[0]}</TaskPill>
            <Countdown seconds={T2.timer} />
          </div>
          {beat >= 6 ? (
            <StepCaption text={T2.show[5]} tone="rule" size={19} minH={56} />
          ) : (
            <p className="text-[19px] font-semibold leading-snug" style={{ color: colors.body }}>
              {sentences(T2.show[1])[0]}
            </p>
          )}
          <Brief
            items={[
              T2.show[2],
              T2.show[3],
              <span key="3" className="flex flex-col gap-1">
                <Lines lines={sentences(T2.show[4])} />
                <span className="self-start rounded-lg px-3 py-0.5 font-mono text-[17px] font-bold" style={{ background: colors.night2, color: colors.white }}>
                  {MY_LINE}
                </span>
              </span>,
            ]}
            shown={Math.min(3, beat)}
            size={17}
          />
        </div>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}

/* ================================================================== X1 */

const X1 = SPEC.X1
type Opt = { call: string; shows: string; why: string }
const OPTS: Opt[] = X1.data.options
const X1_RIGHT = 'ABCD'.indexOf(X1.data.right)

/**
 * EXIT: THE RIGHT TRIP. Spec card X1, two presses, 2:30. 1: the story,
 * trip_default.py, the question, four options and the timer; no output (its
 * must_not). 2: the right option marks and EVERY option shows what it prints
 * and its why line.
 */
export function RightTrip() {
  const beat = useBeats(2)
  const shown = beat >= 2
  const [pick, setPick] = useState(-1)
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-8">
          <div className="shrink-0" style={{ width: 500 }}>
            <CodeBlock code={X1.code[0].src.replace(/\n$/, '')} filename="Python" chip={false} fontSize={18} rows={2} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-start justify-between gap-6">
              <p className="text-[20px] font-semibold leading-snug" style={{ color: colors.body }}>
                <Lines lines={sentences(X1.show[0])} />
              </p>
              <Countdown seconds={X1.timer} />
            </div>
            <Ask size={24}>{X1.show[1]}</Ask>
          </div>
        </div>
        <div style={{ width: 'calc(100% - 32px)' }}>
          <Vote
            options={OPTS.map((o) => o.call)}
            right={X1_RIGHT}
            shown={shown}
            pick={pick}
            setPick={setPick}
            cols={2}
            size={18}
            dense
            details={OPTS.map((o, i) => (
              <span key={i} className="block">
                <span className="block font-mono text-[15px] font-bold leading-snug" style={{ color: isErr(o.shows) ? colors.danger : i === X1_RIGHT ? colors.success : colors.ink }}>
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
    <div className="relative w-[212px] shrink-0 rounded-lg px-2 pb-1.5 pt-[15px]" style={{ background: colors.night2 }}>
      <span className="absolute right-2 top-0.5 text-[10px] font-semibold" style={{ color: colors.muted }}>
        Python
      </span>
      <div className="font-mono text-[9.6px] leading-[12.5px]" style={{ color: colors.white }}>
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
  const err = isErr(ex.output)
  return (
    <div
      className="relative flex h-[201px] flex-col gap-1 rounded-card px-2.5 py-1.5"
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
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
                Input
              </span>
              <span className="whitespace-pre font-mono text-[11.5px] font-semibold leading-[14px]" style={{ color: colors.ink }}>
                {ex.input}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
                Output
              </span>
              <span
                className={`whitespace-pre-wrap break-words rounded-md px-2 py-0.5 font-mono font-bold ${err ? 'text-[9.5px] leading-[12px]' : 'text-[11.5px] leading-[15px]'}`}
                style={{ background: err ? '#FDECEC' : `${colors.success}1A`, color: err ? colors.danger : colors.ink, boxShadow: `inset 0 0 0 1.5px ${err ? colors.danger : colors.success}` }}
              >
                {ex.output}
              </span>
            </div>
          </div>
          <span className="text-[12.5px] font-semibold leading-[15px]" style={{ color: colors.ink }}>
            <Lines lines={sentences(SENT[n])} />
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * KEY TAKEAWAYS: TODAY, IN SIX EXAMPLES. Spec card K1, six presses. All six
 * slots are there from press 1, empty (its must line); each press fills one
 * with its heading, code, input, result and sentence. Examples, not a concept
 * map.
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
