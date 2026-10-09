import { colors } from '@/design/tokens'
import { Countdown, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Lines, Focus, Group } from './common'
import { OutPanel, Show, TaskPill, sentences, CODE_FS, OUT_FS } from './pieces'
import { CodePane } from './trace'
import { Chip, Star } from './bag'
import { SPEC } from './spec'

/**
 * THE TWO WORKSHEET TASKS: T1 (six presses, 6:00) and T2 (seven presses, 6:00).
 *
 * Both keep to the spec's must lines: the line from my notes is framed as the
 * instructor's own notes, not a test; no result shows until the timer has
 * ended (the instructor presses on after it); one step's result per press.
 * Every program and output is the spec's, run on CPython 3.12.3 (T2's
 * NameError keeps the spec's wording; 3.12 adds a "Did you mean" hint).
 */
type Prog = { file: string; src: string; output: string }

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

/** The program's input, as typed: each name a small chip, lit where a press points at it. */
function InputLine({ text, lit = [], label = 'Input' }: { text: string; lit?: number[]; label?: string }) {
  const tween = useTween(420)
  const parts = text.split(',')
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-1.5" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
      <span className="shrink-0 text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.brand }}>
        {label}
      </span>
      <span className="whitespace-nowrap font-mono text-[15px] font-semibold" style={{ color: colors.ink }}>
        {parts.map((p, i) => (
          <span key={`${text}-${i}`}>
            <span className="rounded" style={{ background: lit.includes(i) ? '#FFE3CC' : 'transparent', boxShadow: lit.includes(i) ? `inset 0 -2px 0 ${colors.accent}` : 'none', transition: tween }}>
              {p}
            </span>
            {i < parts.length - 1 ? ',' : ''}
          </span>
        ))}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ T1 */

const T1 = SPEC.T1
const T1P: Prog[] = T1.code
const INPUT_B: string = T1.data.input_b
/* Sneha and sneha: one person, two strings */
const SNEHA_LIT = INPUT_B.split(',').flatMap((n, i) => (n.toLowerCase() === 'sneha' ? [i] : []))

/**
 * T1. Presses 1 to 3: the story line, story_stats.py, its input, the three
 * steps lighting one at a time, the 6 minute timer. Presses 4 to 6, after the
 * timer (no result before it, must line): step 1's terminal 7 / 3; step 2's
 * line 6 and 4; step 3's new log, 4 / 3 / 1, Sneha and sneha lit.
 */
export function Task1() {
  const beat = useBeats(6)
  const showing = beat - 3
  const prog = showing >= 2 ? T1P[1] : T1P[0]
  return (
    <>
      <div className="flex items-stretch gap-8">
        <Group className="flex w-[520px] shrink-0 flex-col gap-2.5" active={showing >= 1}>
          <CodePane code={prog.src} fontSize={CODE_FS} rows={6} mark={showing === 2 ? [6] : undefined} />
          <InputLine text={showing >= 3 ? INPUT_B : T1.data.input} lit={showing >= 3 ? SNEHA_LIT : []} />
          <OutPanel title="Terminal" lines={(showing >= 1 ? T1P[Math.min(showing, 3) - 1].output.split('\n') : []).map((t) => ({ text: t }))} minRows={3} fontSize={OUT_FS} />
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
            {[2, 3, 4].map((s, i) => (
              <TaskStep key={`t1-${s}`} n={i + 1} text={T1.show[s]} lit={showing >= 1 ? showing === i + 1 : beat >= i + 1} />
            ))}
          </ol>
        </Group>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}

/* ------------------------------------------------------------------ T2 */

const T2 = SPEC.T2
const T2P: Prog[] = T2.code
const T2_INPUT: string = T2.data.input
const CLOSE: string[] = T2.data.close
const BLANK_LINE = '    ' + '_'.repeat(21)
const OPEN = T2P[0].src.split('\n').map((l, i) => (i === 5 ? BLANK_LINE : l)).join('\n')
const OPENS = T2_INPUT.split(',')
const KIRAN_OPENS = OPENS.flatMap((n, i) => (n === 'Kiran' ? [i] : []))

/**
 * T2. Press 1: the question and the input. Press 2: not_close.py with line 6
 * dashed, the steps and the 6 minute timer. Press 3: my notes' step (framed
 * as the instructor's own notes, not a test). Press 4: the Kiran step.
 * Presses 5 to 7, after the timer: line 6 and 2 (Kiran and Vamsi); my notes'
 * version prints 3, Kiran's two opens light; `close.add("Kiran")` and 1.
 * Beside the code: who opened it, and the Close Friends with their stars.
 */
export function Task2() {
  const beat = useBeats(7)
  const r = beat - 4 /* 1, 2, 3 once results start */
  const prog = r >= 3 ? T2P[2] : r === 2 ? T2P[1] : T2P[0]
  const code = beat <= 4 ? OPEN : prog.src
  const close = r >= 3 ? [...CLOSE, 'Kiran'] : CLOSE
  const outside = r >= 1 ? [...new Set(OPENS)].filter((n) => !close.includes(n)) : []
  return (
    <>
      <div className="flex items-stretch gap-8">
        <Group className="flex w-[500px] shrink-0 flex-col gap-2.5" active={r >= 1}>
          <Show on={beat >= 2}>
            <Focus on={r === 1}>
              <CodePane code={code} fontSize={CODE_FS} rows={9} gap={beat <= 4 ? 6 : undefined} mark={r === 1 ? [6] : r === 2 ? [5] : r === 3 ? [2] : undefined} />
            </Focus>
          </Show>
          <OutPanel title="Terminal" lines={r >= 1 ? [{ text: prog.output }] : []} fontSize={OUT_FS} />
        </Group>
        <Group className="flex min-w-0 flex-1 flex-col gap-3" active={beat >= 2 && beat <= 4}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <TaskPill>{T2.show[0]}</TaskPill>
              <p className="text-[18px] font-semibold leading-snug" style={{ color: colors.ink }}>
                <Lines lines={sentences(T2.show[1])} />
              </p>
            </div>
            <Show on={beat >= 2}>
              <Countdown seconds={T2.timer} />
            </Show>
          </div>
          <InputLine text={T2_INPUT} lit={r === 2 ? KIRAN_OPENS : []} />
          {/* Close Friends, with their stars; the viewers outside them light once line 6 runs */}
          <div className="flex flex-wrap items-center gap-2.5 rounded-xl bg-white px-3 py-2" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
            <span className="flex shrink-0 items-center gap-1.5 text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.success }}>
              <Star size={15} />
              close
            </span>
            {close.map((n) => (
              <Chip key={`cf-${n}`} label={n} size="sm" star state={n === 'Kiran' ? 'new' : 'plain'} />
            ))}
            {outside.length > 0 && (
              <span className="ml-auto flex items-center gap-2">
                <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
                  not close
                </span>
                {outside.map((n) => (
                  <Chip key={`out-${n}`} label={n} size="sm" state="check" />
                ))}
              </span>
            )}
          </div>
          <Show on={beat >= 2}>
            <ol className="flex flex-col gap-1.5">
              <TaskStep n={1} text={T2.show[2]} lit />
              <TaskStep n={2} text={T2.show[3]} lit={beat >= 3} />
              <TaskStep n={3} text={T2.show[4]} lit={beat >= 4} />
            </ol>
          </Show>
        </Group>
      </div>
      <StepControls at={beat} total={7} />
    </>
  )
}

