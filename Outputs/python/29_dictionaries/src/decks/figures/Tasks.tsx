import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { Countdown, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Focus, Group, Lines } from './common'
import { Fresh, OutPanel, Show, sentences, CODE_FS } from './pieces'
import { CodePane } from './trace'
import { SPEC } from './spec'

/**
 * THE TWO WORKSHEET TASKS: T1 (six presses, 6:00) and T2 (six presses, 5:00).
 *
 * Both keep to the spec's must lines: no result shows until the timer has
 * ended (the instructor presses on after it), one step's result per press.
 * Every program and output is the spec's, run on CPython 3.12.3. The pieces
 * (`TaskStep`, `Result`, `SmallTimer`, `Input`) are session 28's.
 */
type Prog = { file: string; src: string; output: string; input?: string }

/**
 * One step of a task brief: its first sentence is the instruction, the ones
 * after it (`Predict`, `Run`) are action chips on the same line, so no line
 * ends on a full stop (content rule 36).
 */
function TaskStep({ n, text, lit, input, dense = false }: { n: number; text: string; lit: boolean; /** the step's input, as a mono chip at the end of the line (T2) */ input?: string; /** T2: 6px above and below instead of 8, so three rows and the five-line terminal share the column */ dense?: boolean }) {
  const tween = useTween(420)
  const [first, ...acts] = sentences(text)
  return (
    <li
      className={`flex gap-3 rounded-xl px-3 ${dense ? 'py-1.5' : 'py-2'}`}
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
        <span className="text-[16px] font-semibold leading-snug" style={{ color: colors.ink }}>
          {first}
        </span>
        {acts.map((a, i) => (
          <span key={i} className="whitespace-nowrap rounded-md px-2 py-0.5 text-[14px] font-bold" style={{ background: colors.surface2, color: colors.brandDark }}>
            {a}
          </span>
        ))}
        {input !== undefined && (
          <span className="ml-auto flex items-center gap-1.5">
            <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
              input
            </span>
            <span className="whitespace-nowrap rounded-md bg-white px-2 py-0.5 font-mono text-[14px] font-semibold" style={{ color: colors.ink, boxShadow: `inset 0 0 0 1.5px ${lit ? colors.brand : colors.line}` }}>
              {input}
            </span>
          </span>
        )}
      </span>
    </li>
  )
}

/** A result row: which step it is, and what that step's run printed, one element per line. */
function Result({ label, lines, on, error = false }: { label: string; lines: ReactNode[]; on: boolean; error?: boolean }) {
  const tween = useTween(480)
  const tone = error ? colors.danger : colors.success
  return (
    <div
      className="flex items-start gap-3 rounded-xl px-3 py-1.5"
      style={{
        background: on ? colors.white : 'transparent',
        boxShadow: on ? `inset 0 0 0 1.5px ${tone}` : `inset 0 0 0 2px ${colors.line}`,
        transition: tween,
      }}
    >
      <span className="mt-0.5 w-[58px] shrink-0 text-[13px] font-bold uppercase tracking-wider" style={{ color: on ? tone : colors.muted }}>
        {label}
      </span>
      <span className="flex min-w-0 flex-col" style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(6px)', transition: tween }}>
        {lines.map((l, i) => (
          <span key={i} className="whitespace-pre font-mono text-[14px] font-semibold leading-[20px]" style={{ color: error ? colors.danger : colors.ink }}>
            {l}
          </span>
        ))}
      </span>
    </div>
  )
}

/** The kit's class timer, drawn at 70% so it sits inside the worksheet box. */
function SmallTimer({ seconds }: { seconds: number }) {
  return (
    <span className="relative block shrink-0" style={{ width: 124, height: 42 }}>
      <span className="absolute right-0 top-0 flex origin-top-right" style={{ transform: 'scale(0.7)' }}>
        <Countdown seconds={seconds} />
      </span>
    </span>
  )
}

/** The worksheet box: its label on the left, the timer, smaller, on its right (user, 2026-10-08). */
function Worksheet({ label, seconds }: { label: string; seconds: number }) {
  return (
    <div className="flex h-[48px] items-center justify-between gap-3 rounded-xl px-3" style={{ background: '#FFF4EC', boxShadow: `inset 0 0 0 1.5px ${colors.accent}55` }}>
      <span className="whitespace-nowrap text-[16px] font-bold uppercase tracking-wider" style={{ color: colors.accentDark }}>
        {label}
      </span>
      <SmallTimer seconds={seconds} />
    </div>
  )
}

/** The program's input, as typed: one line of mono with its label. */
function Input({ label, text, lit = false }: { label: string; text: string; lit?: boolean }) {
  const tween = useTween(420)
  return (
    <div className="flex items-center gap-3">
      <span className="w-[112px] shrink-0 whitespace-nowrap text-[13px] font-bold uppercase tracking-wider" style={{ color: lit ? colors.brand : colors.muted, transition: tween }}>
        {label}
      </span>
      <span className="whitespace-nowrap rounded-lg bg-white px-3 py-1 font-mono text-[15px] font-semibold" style={{ color: colors.ink, boxShadow: `inset 0 0 0 ${lit ? 2 : 1.5}px ${lit ? colors.brand : colors.line}`, transition: tween }}>
        {text}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ T1 */

const T1 = SPEC.T1
const T1P: Prog[] = T1.code

/**
 * T1. Presses 1 to 3: bill.py, the input, the three steps lighting one at a
 * time, and the timer; presses 2 and 3 add their inputs. Presses 4 to 6,
 * after the timer: step 1's 59; step 2's KeyError with line 5 red; step 3's
 * new if line above it, line 6 indented under it, and 27.
 */
export function Task1() {
  const beat = useBeats(6)
  const showing = beat - 3 /* 1, 2, 3 once results start */
  const prog = showing >= 3 ? T1P[2] : T1P[0]
  return (
    <>
      <div className="flex items-stretch gap-3" style={{ height: 431 }}>
        <Group pad={10} className="flex w-[730px] shrink-0 flex-col gap-2" active={showing >= 1}>
          <Focus on={showing === 3}>
            <Fresh k={prog.file}>
              <CodePane code={prog.src} fontSize={CODE_FS} rows={7} at={showing === 2 ? 5 : undefined} stop={showing === 2} highlight={showing === 3 ? 5 : undefined} />
            </Fresh>
          </Focus>
          <Result label="Step 1" lines={T1P[0].output.split('\n')} on={showing >= 1} />
          <Result label="Step 2" lines={T1P[1].output.split('\n')} on={showing >= 2} error />
          <Result label="Step 3" lines={T1P[2].output.split('\n')} on={showing >= 3} />
        </Group>
        <Group pad={10} className="flex min-w-0 flex-1 flex-col gap-2.5" active={beat <= 3}>
          <Worksheet label={T1.show[0]} seconds={T1.timer} />
          <ol className="flex flex-col gap-1.5">
            {[1, 2, 3].map((s, i) => (
              <TaskStep key={s} n={i + 1} text={T1.show[s]} lit={beat >= i + 1} />
            ))}
          </ol>
          <div className="flex flex-col gap-1.5">
            <Input label="Input" text={T1.data.input} lit={beat === 1 || showing === 1} />
            <Show on={beat >= 2}>
              <Input label="Step 2 input" text={T1.data.input_b} lit={beat === 2 || showing === 2} />
            </Show>
            <Show on={beat >= 3}>
              <Input label="Step 3 input" text={T1.data.input_c} lit={beat === 3 || showing === 3} />
            </Show>
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
/* The right column's two fixed heights (2026-10-12): the worksheet group holds
   its tallest state (press 5: three lit rows, step 2's chips on two lines) on
   every press, and the terminal group is what is left of the 431px card, so
   the terminal never moves and never runs past the group's foot (it did, by
   8px, when the rows grew under it). The terminal is also held to the group
   by `maxH`. */
const T2_TOP = 222
const T2_BOTTOM = 431 - T2_TOP - 10

/**
 * T2. Presses 1 to 3: budget.py, the input 15, the steps lighting one at a
 * time, and the timer; presses 2 and 3 add their inputs. Presses 4 to 6,
 * after the timer: step 1's 3; step 2's line 4 in its new form with the four
 * names and 4; step 3's 0, no name printed. The terminal holds five lines,
 * so this one card's output type is 15 (the plan's layout note).
 */
export function Task2() {
  const beat = useBeats(6)
  const showing = beat - 3
  const prog = showing >= 2 ? T2P[1] : T2P[0]
  const cur = showing >= 1 ? T2P[showing - 1] : null
  const out = cur ? cur.output.split('\n').map((t) => ({ text: t })) : []
  const inputs = [T2.data.input, T2.data.input_b, T2.data.input_c]
  return (
    <>
      <div className="flex items-stretch gap-3" style={{ height: 431 }}>
        <Group pad={10} className="flex w-[730px] shrink-0 flex-col gap-2.5" active={showing >= 1}>
          <p className="text-[17px] font-semibold leading-snug" style={{ color: colors.body }}>
            <Lines lines={sentences(T2.show[1])} />
          </p>
          <Focus on={showing === 2}>
            <Fresh k={prog.file}>
              <CodePane code={prog.src} fontSize={CODE_FS} rows={8} highlight={showing === 2 ? 4 : undefined} />
            </Fresh>
          </Focus>
        </Group>
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <Group pad={8} className="flex shrink-0 flex-col gap-1.5" active={beat <= 3} style={{ height: T2_TOP }}>
            <Worksheet label={T2.show[0]} seconds={T2.timer} />
            <ol className="flex flex-col gap-1">
              {[2, 3, 4].map((s, i) => (
                <TaskStep key={s} n={i + 1} text={T2.show[s]} lit={beat >= i + 1} input={beat >= i + 1 ? inputs[i] : undefined} dense />
              ))}
            </ol>
          </Group>
          <Group pad={10} className="flex shrink-0 flex-col" active={showing >= 1} style={{ height: T2_BOTTOM }}>
            {/* five lines on step 2, so this one terminal's type is 15 (the plan's layout note) */}
            <OutPanel title={cur ? `Terminal · step ${showing}` : 'Terminal'} lines={out} minRows={5} fontSize={15} maxH={T2_BOTTOM - 20} />
          </Group>
        </div>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}
