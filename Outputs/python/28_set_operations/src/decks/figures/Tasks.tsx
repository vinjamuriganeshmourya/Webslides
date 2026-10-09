import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { Countdown, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Focus, Group, Lines } from './common'
import { OutPanel, Show, sentences, CODE_FS, OUT_FS } from './pieces'
import { CodePane } from './trace'
import { CSE } from './venn'
import { SPEC } from './spec'

/**
 * THE TWO WORKSHEET TASKS: T1 (six presses, 6:00) and T2 (six presses, 6:00).
 *
 * Both keep to the spec's must lines: no result shows until the timer has
 * ended (the instructor presses on after it), one step's result per press,
 * and T2's step 3 is framed as the instructor's own notes, not a test. Every
 * program and output is the spec's, run on CPython 3.12.3.
 */
type Prog = { file: string; src: string; output: string; input?: string }

/**
 * One step of a task brief: its first sentence is the instruction, the ones
 * after it (`Predict`, `Run`) are action chips on the same line, so no line
 * ends on a full stop (content rule 36).
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
        <span className="text-[16px] font-semibold leading-snug" style={{ color: colors.ink }}>
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
function Result({ label, lines, on, extra }: { label: string; lines: ReactNode[]; on: boolean; extra?: ReactNode }) {
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
      <span className="flex min-w-0 flex-col" style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(6px)', transition: tween }}>
        {lines.map((l, i) => (
          <span key={i} className="whitespace-pre font-mono text-[14px] font-semibold leading-[20px]" style={{ color: colors.ink }}>
            {l}
          </span>
        ))}
      </span>
      {extra && (
        <span className="ml-auto self-center" style={{ opacity: on ? 1 : 0, transition: tween }}>
          {extra}
        </span>
      )}
    </div>
  )
}

/**
 * The kit's class timer, drawn at 70% so it sits inside the worksheet box.
 * The wrapper holds the scaled size, so nothing around it lays out against
 * the full-size timer.
 */
function SmallTimer({ seconds }: { seconds: number }) {
  return (
    <span className="relative block shrink-0" style={{ width: 124, height: 42 }}>
      <span className="absolute right-0 top-0 flex origin-top-right" style={{ transform: 'scale(0.7)' }}>
        <Countdown seconds={seconds} />
      </span>
    </span>
  )
}

/** The program's input, as typed: one line of mono with its label. `mark` lights some names in it. */
function Input({ label, text, mark = [], lit = false }: { label: string; text: string; mark?: string[]; lit?: boolean }) {
  const tween = useTween(420)
  const names = text.split(',')
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
        {label}
      </span>
      <span className="self-start whitespace-nowrap rounded-lg bg-white px-3 py-1.5 font-mono text-[16px] font-semibold" style={{ color: colors.ink, boxShadow: `inset 0 0 0 ${lit ? 2 : 1.5}px ${lit ? colors.brand : colors.line}`, transition: tween }}>
        {names.map((n, i) => (
          <span key={i}>
            <span className="rounded" style={{ background: mark.includes(n) ? '#FFE9A8' : 'transparent', boxShadow: mark.includes(n) ? `inset 0 -2px 0 ${colors.warning}` : 'none', transition: tween }}>
              {n}
            </span>
            {i < names.length - 1 ? ',' : ''}
          </span>
        ))}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ T1 */

const T1 = SPEC.T1
const T1P: Prog[] = T1.code
const LINE5 = T1P[1].src.split('\n')[4]
const OTHER = LINE5.replace('dance - cse', 'cse - dance')

/**
 * T1. Presses 1 to 3: the story, dance.py, the three steps lighting one at a
 * time, the input and the timer; press 3 adds the new input. Presses 4 to 6,
 * after the timer: step 1's 11 and 2; step 2's line 5 and its 3, with the
 * other order greyed beside it (6); step 3's 10, 2, 2 with Anu and anu lit.
 */
export function Task1() {
  const beat = useBeats(6)
  const showing = beat - 3 /* 1, 2, 3 once results start */
  const prog = showing >= 2 ? T1P[1] : T1P[0]
  return (
    <>
      <div className="flex items-stretch gap-3">
        <Group pad={10} className="flex w-[750px] shrink-0 flex-col gap-2" active={showing >= 1}>
          <CodePane code={prog.src} fontSize={CODE_FS} rows={5} highlight={showing === 2 ? 5 : undefined} />
          <Result label="Step 1" lines={T1P[0].output.split('\n')} on={showing >= 1} />
          <Result
            label="Step 2"
            lines={[LINE5, T1P[1].output.split('\n').pop()!]}
            on={showing >= 2}
            extra={
              <span className="flex flex-col items-end font-mono text-[13px] font-semibold leading-[19px]" style={{ color: colors.muted }}>
                <span className="whitespace-pre">{OTHER}</span>
                <span>6</span>
              </span>
            }
          />
          <Result label="Step 3" lines={T1P[2].output.split('\n')} on={showing >= 3} />
        </Group>
        <Group pad={10} className="flex min-w-0 flex-1 flex-col gap-2.5" active={beat <= 3}>
          {/* the worksheet box: its label on the left, the timer, smaller, on its right (user, 2026-10-08, slide 14) */}
          <div className="flex h-[48px] items-center justify-between gap-3 rounded-xl px-3" style={{ background: '#FFF4EC', boxShadow: `inset 0 0 0 1.5px ${colors.accent}55` }}>
            <span className="whitespace-nowrap text-[16px] font-bold uppercase tracking-wider" style={{ color: colors.accentDark }}>
              {T1.show[0]}
            </span>
            <SmallTimer seconds={T1.timer} />
          </div>
          <p className="text-[16px] font-semibold leading-snug" style={{ color: colors.body }}>
            <Lines lines={sentences(T1.show[1])} />
          </p>
          <ol className="flex flex-col gap-1.5">
            {[2, 3, 4].map((s, i) => (
              <TaskStep key={s} n={i + 1} text={T1.show[s]} lit={beat >= i + 1} />
            ))}
          </ol>
          <Input label="Input" text={T1.data.input} />
          <Show on={beat >= 3}>
            <Input label="New input" text={T1.data.input_b} mark={showing >= 3 ? ['Anu', 'anu'] : []} lit={beat === 3} />
          </Show>
        </Group>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}

/* ------------------------------------------------------------------ T2 */

const T2 = SPEC.T2
const T2P: Prog[] = T2.code
const BLANKED = T2P[0].src
  .split('\n')
  .map((l, i) => (i === 2 ? '________' : l))
  .join('\n')
const NOTES_LINE = T2P[2].src.split('\n')[2]
const POLL2: string[] = T2.data.input_b.split(',')

/**
 * T2. Press 1: stall.py with line 3 blank, the steps, the input and the
 * timer. Press 2: the second poll. Press 3: my notes' line 3, framed as the
 * instructor's own. Press 4: line 3 fills, Stall is OK, the volunteers sit
 * inside cse. Press 5: Ask 2 to swap, Harsha and Meena light outside cse.
 * Press 6: my notes' version, the two names in line 3 swapped, Ask 0 to swap.
 */
export function Task2() {
  const beat = useBeats(6)
  const code = beat <= 3 ? BLANKED : beat === 6 ? T2P[2].src : T2P[0].src
  const out = beat === 4 ? T2P[0].output : beat === 5 ? T2P[1].output : beat === 6 ? T2P[2].output : null
  /* press 5: the two names that are not in cse light red in the second poll */
  const outside: string[] = POLL2.filter((n: string) => !CSE.includes(n))
  return (
    <>
      {/* one fixed size on every press (user, 2026-10-08, slide 23): both groups 400 tall, ending well clear of Next and Autoplay */}
      <div className="flex items-stretch gap-3" style={{ height: 400 }}>
        <Group pad={10} className="flex w-[750px] shrink-0 flex-col gap-2.5" active={beat >= 4}>
          <Focus on={beat === 4 || beat === 6}>
            <CodePane code={code} fontSize={CODE_FS} rows={6} highlight={beat >= 4 ? 3 : undefined} />
          </Focus>
          <div className="flex items-center gap-4">
            <OutPanel title="Terminal" lines={out ? [{ text: out }] : []} minRows={1} fontSize={OUT_FS} className="min-w-0 flex-1" />
          </div>
            <Show on={beat >= 3}>
              <div className="flex flex-col gap-1 rounded-xl px-3 py-2" style={{ background: '#FFF4EC', boxShadow: `inset 4px 0 0 ${colors.accent}` }}>
                <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.accentDark }}>
                  My notes, line 3
                </span>
                <span className="whitespace-pre font-mono text-[15px] font-semibold" style={{ color: colors.ink }}>
                  {NOTES_LINE}
                </span>
              </div>
            </Show>
        </Group>
        <Group pad={10} className="flex min-w-0 flex-1 flex-col gap-2.5" active={beat <= 3}>
          {/* the worksheet box: its label on the left, the timer, smaller, on its right (user, 2026-10-08, slide 23, as slide 14) */}
          <div className="flex h-[48px] items-center justify-between gap-3 rounded-xl px-3" style={{ background: '#FFF4EC', boxShadow: `inset 0 0 0 1.5px ${colors.accent}55` }}>
            <span className="whitespace-nowrap text-[16px] font-bold uppercase tracking-wider" style={{ color: colors.accentDark }}>
              {T2.show[0]}
            </span>
            <SmallTimer seconds={T2.timer} />
          </div>
          <p className="text-[16px] font-semibold leading-snug" style={{ color: colors.body }}>
            <Lines lines={sentences(T2.show[1])} />
          </p>
          <ol className="flex flex-col gap-1.5">
            {[2, 3, 4].map((s, i) => (
              <TaskStep key={s} n={i + 1} text={T2.show[s]} lit={beat >= i + 1} />
            ))}
          </ol>
          <div className="flex flex-col gap-1.5">
            <InputLine label="Poll 1" text={T2.data.input} />
            <Show on={beat >= 2}>
              <InputLine label="Poll 2" text={T2.data.input_b} bad={beat === 5 ? outside : []} />
            </Show>
            <Show on={beat === 5}>
              <span className="ml-[64px] text-[14px] font-bold" style={{ color: colors.danger }}>
                {outside.join(' and ')}: not in cse
              </span>
            </Show>
          </div>
        </Group>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}

function InputLine({ label, text, bad = [] }: { label: string; text: string; bad?: string[] }) {
  const tween = useTween(420)
  const names = text.split(',')
  return (
    <div className="flex items-center gap-3">
      <span className="w-[52px] shrink-0 text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
        {label}
      </span>
      <span className="whitespace-nowrap rounded-lg bg-white px-3 py-1 font-mono text-[15px] font-semibold" style={{ color: colors.ink, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
        {names.map((n, i) => (
          <span key={i}>
            <span style={{ color: bad.includes(n) ? colors.danger : colors.ink, background: bad.includes(n) ? '#FDECEC' : 'transparent', borderRadius: 4, transition: tween }}>{n}</span>
            {i < names.length - 1 ? ',' : ''}
          </span>
        ))}
      </span>
    </div>
  )
}
