import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { Countdown, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Focus, Group, Lines } from './common'
import { sentences, CODE_FS } from './pieces'
import { CodePane } from './trace'
import { Notebook } from './Calculator'
import { type Prog } from './cards'
import { SPEC } from './spec'

/**
 * THE TWO WORKSHEET TASKS: T1 (six presses, 6:00) and T2 (four presses, 5:00).
 *
 * Both keep to the spec's must lines: no result shows until the timer has
 * ended (the instructor presses on after it), one program's result per press
 * on the reveal, and T1's fixed line 1 never before the timer. Every program
 * and output is the spec's, run on CPython 3.12.3.
 */

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
      className="flex gap-3 rounded-xl px-3 py-1.5"
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
        <span className="text-[15px] font-semibold leading-snug" style={{ color: colors.ink }}>
          {first}
        </span>
        {acts.map((a, i) => (
          <span key={i} className="whitespace-nowrap rounded-md px-2 py-0.5 text-[13px] font-bold" style={{ background: colors.surface2, color: colors.brandDark }}>
            {a}
          </span>
        ))}
      </span>
    </li>
  )
}

/** A result row: which step it is, and what that step's run printed, one element per line. */
function Result({ label, lines, on }: { label: string; lines: ReactNode[]; on: boolean }) {
  const tween = useTween(480)
  return (
    <div
      className="flex flex-col gap-0.5 rounded-xl px-3 py-1"
      style={{
        background: on ? colors.white : 'transparent',
        boxShadow: on ? `inset 0 0 0 1.5px ${colors.success}` : `inset 0 0 0 2px ${colors.line}`,
        transition: tween,
      }}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 w-[58px] shrink-0 text-[13px] font-bold uppercase tracking-wider" style={{ color: on ? colors.success : colors.muted }}>
          {label}
        </span>
        <span className="flex min-w-0 flex-col" style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(6px)', transition: tween }}>
          {lines.map((l, i) => (
            <span key={i} className="whitespace-pre font-mono text-[14px] font-semibold leading-[18px]" style={{ color: colors.ink }}>
              {l}
            </span>
          ))}
        </span>
      </div>
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

function WorksheetBox({ label, seconds }: { label: string; seconds: number }) {
  return (
    <div className="flex h-[44px] items-center justify-between gap-3 rounded-xl px-3" style={{ background: '#FFF4EC', boxShadow: `inset 0 0 0 1.5px ${colors.accent}55` }}>
      <span className="whitespace-nowrap text-[15px] font-bold uppercase tracking-wider" style={{ color: colors.accentDark }}>
        {label}
      </span>
      <SmallTimer seconds={seconds} />
    </div>
  )
}

/** The brief's action chips on one line: `Predict`, `Run`, `Fix line 1`. */
function Brief({ text }: { text: string }) {
  return (
    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
      {sentences(text).map((a) => (
        <span key={a} className="whitespace-nowrap rounded-md px-2 py-0.5 text-[13px] font-bold" style={{ background: colors.surface2, color: colors.brandDark }}>
          {a}
        </span>
      ))}
    </span>
  )
}

/* ------------------------------------------------------------------ T1 */

const T1 = SPEC.T1
type Q = { question: string; src: string }
const QS: Q[] = T1.data.programs
const RESULTS: string[] = T1.data.results
const FIXES: Record<string, string> = T1.data.fixes
const FIXED: Record<string, string> = { Q2: (T1.code as Prog[])[4].output, Q4: (T1.code as Prog[])[5].output }

/** One homework program: its question, its two lines, its result slot; on the fix press, line 1 replaced and the new result. */
function HomeworkCard({ q, result, shown, fix, fixedResult }: { q: Q; result: string; shown: boolean; fix: string | null; fixedResult: string | null }) {
  const tween = useTween(480)
  const key = q.question.slice(0, 2)
  const srcLines = q.src.split('\n')
  const err = /Error/.test(result)
  const showFix = fix !== null
  const printed = showFix ? fixedResult! : result
  const printedErr = showFix ? false : err
  return (
    <div className="flex flex-col gap-1.5 rounded-xl bg-white px-3 pb-2.5 pt-2" style={{ boxShadow: `inset 0 0 0 1.5px ${shown ? (printedErr ? colors.danger : colors.success) : colors.line}`, transition: tween }}>
      <span className="whitespace-nowrap text-[13.5px] font-bold leading-snug" style={{ color: colors.ink }}>
        {q.question}
      </span>
      <span className="flex flex-col rounded-lg px-2.5 py-1.5 font-mono text-[13px] leading-[19px]" style={{ background: colors.night2, color: colors.white }}>
        {srcLines.map((l, i) => {
          const replaced = i === 0 && showFix
          return (
            <span key={`${key}-${i}-${replaced ? 'fix' : 'src'}`} className={`block whitespace-pre ${replaced ? 'sm-bump' : ''}`} style={replaced ? { color: colors.warning, fontWeight: 700 } : undefined}>
              {replaced ? fix : l}
            </span>
          )
        })}
      </span>
      <span className="flex h-[22px] items-center gap-2">
        <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
          prints
        </span>
        <span className="whitespace-nowrap rounded-md px-2 font-mono text-[12.5px] font-bold leading-[22px]" style={{ color: shown ? (printedErr ? colors.danger : '#137A3A') : colors.muted, background: shown ? (printedErr ? '#FDECEC' : '#E9F8EF') : 'transparent', outline: shown ? 'none' : `1.5px dashed ${colors.line}`, outlineOffset: -1.5, transition: tween }}>
          {shown ? printed : '?'}
        </span>
      </span>
    </div>
  )
}

/**
 * T1. Press 1: the four programs with their questions, the brief, a 6:00
 * timer. Presses 2 to 5: one program's result per press, in order. Press 6:
 * the two fixes, Q2's line 1 and Q4's line 1, with what they print.
 */
export function Task1() {
  const beat = useBeats(6)
  const shown = beat - 1 /* results shown so far */
  const fixing = beat >= 6
  return (
    <>
      <div className="flex items-stretch gap-3">
        <Group pad={10} className="flex w-[334px] shrink-0 flex-col gap-2.5" style={{ height: 400 }} active={beat === 1}>
          <WorksheetBox label={T1.show[0]} seconds={T1.timer} />
          <p className="text-[15px] font-semibold leading-snug" style={{ color: colors.body }}>
            <Lines lines={sentences(T1.show[1])} />
          </p>
          <Brief text={T1.show[2]} />
          <div className="flex flex-1 items-center justify-center">
            <Notebook lines={['Maths homework', ...QS.map((q) => q.question)]} width={298} height={148} size={11.5} />
          </div>
        </Group>
        <Group pad={10} className="grid min-w-0 flex-1 grid-cols-2 gap-x-3 gap-y-2.5" style={{ height: 400 }} active={beat >= 2}>
          {QS.map((q, i) => {
            const key = q.question.slice(0, 2)
            return <HomeworkCard key={key} q={q} result={RESULTS[i]} shown={shown >= i + 1} fix={fixing && FIXES[key] ? FIXES[key] : null} fixedResult={fixing && FIXED[key] ? FIXED[key] : null} />
          })}
        </Group>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}

/* ------------------------------------------------------------------ T2 */

const T2 = SPEC.T2
const T2P: Prog[] = T2.code

/**
 * T2. Press 1: month.py with line numbers, the input line, step 1 lit, a
 * 5:00 timer. Press 2: step 2 lights (change line 4). Press 3: step 1's
 * terminal. Press 4: step 2's terminal, and line 4 becomes 100.
 */
export function Task2() {
  const beat = useBeats(4)
  const prog = beat >= 4 ? T2P[1] : T2P[0]
  return (
    <>
      <div className="flex items-stretch gap-3">
        <Group pad={10} className="flex w-[560px] shrink-0 flex-col gap-2" style={{ height: 400 }} active={beat >= 3}>
          <Focus on={beat === 2 || beat === 4}>
            <CodePane code={prog.src} fontSize={CODE_FS} rows={12} highlight={beat >= 2 ? 4 : undefined} />
          </Focus>
        </Group>
        <Group pad={10} className="flex min-w-0 flex-1 flex-col gap-2" style={{ height: 400 }} active={beat <= 2}>
          <WorksheetBox label={T2.show[0]} seconds={T2.timer} />
          <p className="text-[15px] font-semibold leading-snug" style={{ color: colors.body }}>
            <Lines lines={sentences(T2.show[1])} />
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: colors.brand }}>
              Input
            </span>
            <span className="whitespace-pre rounded-lg bg-white px-2.5 py-1 font-mono text-[14px] font-semibold" style={{ color: colors.ink, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
              {T2P[0].input}
            </span>
          </div>
          <ol className="flex flex-col gap-1">
            {[2, 3].map((s, i) => (
              <TaskStep key={s} n={i + 1} text={T2.show[s]} lit={beat >= i + 1} />
            ))}
          </ol>
          <Result label="Step 1" lines={T2P[0].output.split('\n')} on={beat >= 3} />
          <Result label="Step 2" lines={T2P[1].output.split('\n')} on={beat >= 4} />
        </Group>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}
