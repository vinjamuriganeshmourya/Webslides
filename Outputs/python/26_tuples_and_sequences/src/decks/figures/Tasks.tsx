import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { Countdown, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Lines, Focus, Group } from './common'
import { OutPanel, Show, TaskPill, sentences, CODE_FS, OUT_FS } from './pieces'
import { CodePane, StepCaption } from './trace'
import { useStepPhase } from './phase'
import { Row } from './rows'
import { UPI } from './Upi'
import { SPEC } from './spec'

/**
 * THE TWO WORKSHEET TASKS: T1 (six presses, 6:00) and T2 (six presses, 7:00).
 *
 * Both keep to the spec's must lines: the line from my notes is framed as the
 * instructor's own notes, not a test; no result shows until the timer has
 * ended (the instructor presses on after it); one step's result per press.
 * Every program and output is the spec's, run on CPython 3.12.3 (T2's
 * NameError keeps the spec's wording; 3.12 adds a "Did you mean" hint).
 */
type Prog = { file: string; src: string; output: string }
const isErr = (t: string) => /^[A-Z]\w*Error/.test(t)

/**
 * One step of a task brief: its first sentence is the instruction, the ones
 * after it (`Predict`, `Run`) are action chips, so no line ends on a full
 * stop (content rule 36).
 */
function TaskStep({ n, text, lit }: { n: number; text: string; lit: boolean }) {
  const tween = useTween(420)
  const [first, ...acts] = sentences(text)
  return (
    <li
      className="flex gap-3 rounded-xl px-3 py-2"
      style={{
        background: lit ? colors.white : 'transparent',
        boxShadow: lit ? `inset 0 0 0 1.5px ${colors.line}, 0 6px 14px -10px rgba(16,32,58,0.2)` : 'none',
        opacity: lit ? 1 : 0.4,
        transition: tween,
      }}
    >
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[13px] font-bold" style={{ background: lit ? colors.brandDark : colors.surface2, color: lit ? colors.white : colors.muted, transition: tween }}>
        {n}
      </span>
      <span className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1">
        <span className="text-[17px] font-semibold leading-snug" style={{ color: colors.ink }}>
          {first}
        </span>
        {acts.map((a, i) => (
          <span key={i} className="whitespace-nowrap rounded-md px-2 py-0.5 text-[14px] font-bold" style={{ background: colors.surface2, color: colors.brandDark }}>
            {a}
          </span>
        ))}
      </span>
    </li>
  )
}

/** A result row: which step it is, and what that step's run printed, one element per line. */
function Result({ label, lines, on, extra }: { label: string; lines: string[]; on: boolean; extra?: ReactNode }) {
  const tween = useTween(480)
  return (
    <div
      className="flex items-start gap-3 rounded-xl px-3 py-1.5"
      style={{
        background: on ? colors.white : 'transparent',
        boxShadow: on ? `inset 0 0 0 1.5px ${colors.success}` : `inset 0 0 0 2px ${colors.line}`,
        transition: tween,
      }}
    >
      <span className="mt-0.5 w-[58px] shrink-0 text-[13px] font-bold uppercase tracking-wider" style={{ color: on ? colors.success : colors.muted }}>
        {label}
      </span>
      <span className="flex min-w-0 flex-1 flex-col" style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(6px)', transition: tween }}>
        {lines.map((l, i) => (
          <span key={i} className="whitespace-pre font-mono text-[13px] font-semibold leading-[19px]" style={{ color: isErr(l) ? colors.danger : colors.ink }}>
            {l}
          </span>
        ))}
        {extra}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ T1 */

const T1 = SPEC.T1
const T1P: Prog[] = T1.code
const FIXED_LINE5 = T1P[1].src.split('\n')[4]
const TIP_FIX = T1P[2].src.split('\n')[0].replace('(10)', '(10,)')

/**
 * T1. Presses 1 to 3: the story, payment.py, the three steps lighting one at
 * a time, the timer; line 5 is marked from the start as my notes' fix.
 * Presses 4 to 6, after the timer: step 1's terminal (line 5 red, line 6
 * grey, it never runs), step 2's new line 5 and its last output line, step
 * 3's `<class 'int'>` and the one-comma fix.
 */
export function Task1() {
  const beat = useBeats(6)
  const showing = beat - 3 /* 1, 2, 3 once results start */
  const fixed = showing >= 2
  const prog = fixed ? T1P[1] : T1P[0]
  return (
    <>
      <div className="flex items-stretch gap-8">
        <Group className="flex w-[600px] shrink-0 flex-col gap-2.5" active={showing >= 1}>
          <CodePane code={prog.src} fontSize={CODE_FS} rows={6} mark={showing === 1 ? undefined : [5]} at={showing === 1 ? 5 : null} stop={showing === 1} gap={showing === 1 ? 6 : undefined} />
          <Result label="Step 1" lines={T1P[0].output.split('\n')} on={showing >= 1} />
          <StepCaption text={showing === 1 ? T1.show[3] : null} tone="rule" size={17} minH={50} />
        </Group>
        <Group className="flex min-w-0 flex-1 flex-col gap-3" active={beat <= 3}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <TaskPill>{T1.show[0]}</TaskPill>
              <p className="text-[18px] font-semibold leading-snug" style={{ color: colors.body }}>
                <Lines lines={sentences(T1.show[1])} />
              </p>
            </div>
            <Countdown seconds={T1.timer} />
          </div>
          <ol className="flex flex-col gap-1.5">
            {[2, 4, 5].map((s, i) => (
              <TaskStep key={s} n={i + 1} text={T1.show[s]} lit={beat >= i + 1} />
            ))}
          </ol>
          <div className="flex flex-col gap-1.5">
            <Result label="Step 2" lines={[FIXED_LINE5, T1P[1].output.split('\n').pop()!]} on={showing >= 2} />
            <Result
              label="Step 3"
              lines={[T1P[2].output]}
              on={showing >= 3}
              extra={
                <span className="mt-0.5 self-start rounded-md px-2 font-mono text-[13px] font-bold leading-[20px]" style={{ background: '#E9F8EF', color: colors.ink, boxShadow: `inset 0 0 0 1.5px ${colors.success}` }}>
                  {TIP_FIX}
                </span>
              }
            />
          </div>
        </Group>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}

/* ------------------------------------------------------------------ T2 */

const T2 = SPEC.T2
const T2P: Prog[] = T2.code
const BLANK = '    ________'
const OPEN = T2P[0].src
  .split('\n')
  .map((l, i) => (i === 7 ? BLANK : i === 10 ? '________' : l))
  .join('\n')
const WEEK: number[] = T2.data.week
const WEEK_B: number[] = T2.data.week_b
const LIMIT: number = T2.data.limit

/** Teja's week as History rows, compact: one card per payment, the big ones marked. */
function WeekRows({ amounts }: { amounts: number[] }) {
  return (
    <div className="flex gap-2 rounded-xl p-2" style={{ background: UPI.topSoft }}>
      {amounts.map((a, i) => (
        <span key={`${amounts.length}-${i}`} className="sm-bump flex w-[74px] flex-col items-start rounded-lg bg-white px-2 py-1.5" style={{ boxShadow: `inset 0 0 0 ${a > LIMIT ? 2 : 1}px ${a > LIMIT ? UPI.top : UPI.line}` }}>
          <span className="text-[11px] font-semibold" style={{ color: UPI.soft }}>
            Paid
          </span>
          <span className="text-[16px] font-bold" style={{ color: UPI.ink }}>
            ₹{a}
          </span>
        </span>
      ))}
    </div>
  )
}

/**
 * T2. Press 1: the question and Teja's week as five History rows. Press 2:
 * week.py with lines 8 and 11 blank, the steps and the timer. Press 3: step
 * 2, framed as my notes. Press 4: the two lines fill. Press 5: the output,
 * then the second week's. Press 6: my notes' version: one name holds the
 * whole tuple, a row of two cells, and count was never made.
 */
export function Task2() {
  const beat = useBeats(6)
  const notes = beat === 6
  const phase = useStepPhase(beat, [200, 1800])
  const second = beat === 5 && phase >= 2
  const code = beat <= 3 ? OPEN : notes ? T2P[2].src : second ? T2P[1].src : T2P[0].src
  const out = beat === 5 ? [...T2P[0].output.split('\n'), ...(second ? T2P[1].output.split('\n') : [])] : notes ? T2P[2].output.split('\n') : []
  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-6">
          <p className="text-[19px] font-semibold leading-snug" style={{ color: colors.ink }}>
            <Lines lines={sentences(T2.show[1])} />
          </p>
          <TaskPill>{T2.show[0]}</TaskPill>
        </div>
        <div className="flex items-start gap-8">
          <div className="w-[470px] shrink-0">
            <Show on={beat >= 2}>
              <Focus on={beat === 4 || notes}>
              <CodePane code={code} fontSize={CODE_FS} rows={13} gaps={beat <= 3 ? [8, 11] : undefined} mark={beat === 4 ? [8, 11] : notes ? [11] : second ? [10] : undefined} />
              </Focus>
            </Show>
          </div>
          <Group className="flex min-w-0 flex-1 flex-col gap-3" active={beat === 2 || beat === 3}>
            <div className="flex items-center justify-between gap-4" style={{ minHeight: 60 }}>
              {notes ? (
                <div className="sm-bump flex items-start">
                  <Row items={T2P[2].output.split('\n')[0].replace(/^Spent \((.*)\)$/, '$1').split(', ')} kind="tuple" size="sm" name="spent" />
                </div>
              ) : (
                <WeekRows amounts={second ? WEEK_B : WEEK} />
              )}
              <Show on={beat >= 2}>
                <Countdown seconds={T2.timer} />
              </Show>
            </div>
            <Show on={beat >= 2}>
              <ol className="flex flex-col gap-1.5">
                <TaskStep n={1} text={T2.show[2]} lit />
                <TaskStep n={2} text={T2.show[3]} lit={beat >= 3} />
              </ol>
            </Show>
            <OutPanel title="Terminal" lines={out.map((t) => ({ text: t, tone: isErr(t) ? ('error' as const) : 'plain' }))} minRows={4} fontSize={OUT_FS} />
          </Group>
        </div>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}
