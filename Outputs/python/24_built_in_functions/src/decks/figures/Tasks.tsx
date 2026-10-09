import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { Countdown, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Group, Lines } from './common'
import { BLANK } from './Code'
import { OutPanel, TaskPill, sentences } from './pieces'
import { CodePane, StepCaption } from './trace'
import { SPEC } from './spec'

/**
 * THE TWO WORKSHEET TASKS: T1 (six presses, 6:00) and T2 (six presses, 7:00).
 *
 * Both cards keep to the spec's must lines: no result shows until the timer
 * has ended (the instructor presses on after it), and the reveal is one
 * result per press. Every program, input and output is the spec's own, run
 * on CPython 3.12.3 (plan, outputs section).
 */

/* ------------------------------------------------------------------ parts */

/**
 * One step of a task brief. The step's first sentence is its instruction;
 * the sentences after it (`Predict`, `Run`) are actions, drawn as chips, so
 * every sentence keeps its own line or chip and no line ends on a full stop
 * (content rule 36).
 */
function TaskStep({ n, text, lit }: { n: number; text: string; lit: boolean }) {
  const tween = useTween(420)
  const [first, ...acts] = sentences(text)
  return (
    <li
      className="flex items-start gap-3 rounded-xl px-3 py-2"
      style={{
        background: lit ? colors.white : 'rgba(255,255,255,0)',
        boxShadow: lit ? `inset 0 0 0 1.5px ${colors.line}, 0 6px 14px -10px rgba(16,32,58,0.2)` : 'none',
        opacity: lit ? 1 : 0.4,
        transition: tween,
      }}
    >
      <span className="mt-px grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[13px] font-bold leading-none" style={{ background: lit ? colors.brandDark : colors.surface2, color: lit ? colors.white : colors.muted, transition: tween }}>
        {n}
      </span>
      <span className="flex min-w-0 flex-col gap-1.5">
        <span className="text-[17px] font-semibold leading-[26px]" style={{ color: colors.ink }}>
          {first}
        </span>
        {acts.length > 0 && (
          <span className="flex flex-wrap gap-1.5">
            {acts.map((a, i) => (
              <span key={i} className="inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-[14px] font-bold leading-[20px]" style={{ background: colors.surface2, color: colors.brandDark }}>
                {a}
              </span>
            ))}
          </span>
        )}
      </span>
    </li>
  )
}

/** A result row: which step it is, and what that step's run printed. */
function Result({ label, lines, on, extra }: { label: string; lines: string[]; on: boolean; extra?: ReactNode }) {
  const tween = useTween(480)
  return (
    /* label, printed lines and pages on one centre line (rule G2) */
    <div
      className="flex min-h-[46px] items-center gap-2.5 rounded-xl px-3 py-1.5"
      style={{
        background: on ? colors.white : 'rgba(255,255,255,0)',
        boxShadow: on ? `inset 0 0 0 1.5px ${colors.success}` : `inset 0 0 0 2px ${colors.line}`,
        transition: tween,
      }}
    >
      <span className="w-[62px] shrink-0 text-[13px] font-bold uppercase leading-none tracking-wider" style={{ color: on ? colors.success : colors.muted, transition: tween }}>
        {label}
      </span>
      <span className="flex min-w-0 flex-1 flex-col justify-center" style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(6px)', transition: tween }}>
        {lines.map((l, i) => (
          <span key={i} className="whitespace-pre font-mono text-[13px] font-semibold leading-[20px]" style={{ color: colors.ink }}>
            {l}
          </span>
        ))}
      </span>
      {extra && <span className="flex shrink-0 items-center" style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(6px)', transition: tween }}>{extra}</span>}
    </div>
  )
}

/** The notebook's own colours, as on the hook (a ruled college notebook). */
const NB = { cover: '#1F4FA3', paper: '#FFFEF8', ink: '#1C3F94' }

/** Small notebook pages (T1's play line): one page per unit that ravi's list holds, its number in pen. */
function MiniPages({ units }: { units: string[] }) {
  return (
    <span className="flex items-center gap-1 rounded-lg px-1.5 py-1" style={{ background: '#FFFFFF', boxShadow: '0 0 0 1px #E3E7EE' }}>
      {units.map((u) => (
        <span key={u} className="grid h-[24px] w-[19px] place-items-center rounded-[3px] font-heading text-[12px] font-bold italic" style={{ background: NB.paper, color: NB.ink, boxShadow: `inset 0 3px 0 ${NB.cover}, 0 0 0 1px #C9D3E3` }}>
          {u.replace(/^Unit /, '')}
        </span>
      ))}
    </span>
  )
}

const namesIn = (out: string) => [...out.matchAll(/'([^']+)'/g)].map((m) => m[1])

/* ------------------------------------------------------------------ T1 */

const T1 = SPEC.T1
type Prog = { src: string; output: string; input?: string }
const T1P: Prog[] = T1.code

/**
 * T1. Presses 1 to 3: the story, write_unit.py, the three steps lighting one
 * at a time, the timer. Presses 4 to 6: each step's result, with the program
 * that printed it (line 2 changed, then line 3 added, marked).
 */
export function Task1() {
  const beat = useBeats(6)
  const showing = beat - 3 /* 1, 2, 3 once results start */
  const prog = showing >= 1 ? T1P[showing - 1] : T1P[0]
  const mark = showing === 2 ? [2] : showing === 3 ? [2, 3] : undefined
  return (
    <>
      {/* two groups (rule G3): the program with its three results, and the worksheet with its timer and steps */}
      <div className="flex items-stretch gap-8">
        {/* 556px: step 1's printed list and its four pages fit on one line beside the label (rule G2) */}
        <Group pad={10} className="flex w-[556px] shrink-0 flex-col gap-2.5">
          <CodePane code={prog.src} mark={mark} fontSize={15} rows={7} />
          <div className="flex flex-col gap-1.5">
            {T1P.map((p, i) => (
              <Result key={i} label={`Step ${i + 1}`} lines={p.output.split('\n')} on={showing >= i + 1} extra={<MiniPages units={namesIn(p.output.split('\n').pop()!)} />} />
            ))}
          </div>
        </Group>
        <Group className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-2.5">
              <TaskPill>{T1.show[0]}</TaskPill>
              <p className="text-[19px] font-semibold leading-snug" style={{ color: colors.body }}>
                <Lines lines={sentences(T1.show[1])} />
              </p>
            </div>
            <Countdown seconds={T1.timer} />
          </div>
          <ol className="flex flex-col gap-1.5">
            {[2, 3, 4].map((s, i) => (
              <TaskStep key={s} n={i + 1} text={T1.show[s]} lit={beat >= i + 1} />
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
/** plate.py with lines 6 to 8 as three fill-in blanks (rule G4), waiting to be written */
const OPEN = T2P[0].src
  .split('\n')
  .map((l, i) => (i >= 5 ? BLANK + BLANK : l))
  .join('\n')

/**
 * An Indian number plate (T2's play line): white, black letters, the blue
 * strip at its left. The plate's own colours, not brand tokens.
 */
function Plate({ value }: { value: string }) {
  return (
    <div className="flex h-[50px] shrink-0 items-stretch overflow-hidden rounded-lg" style={{ background: '#FFFFFF', boxShadow: '0 0 0 3px #1C1C1C, 0 8px 18px -10px rgba(0,0,0,0.45)' }}>
      <span className="flex w-[30px] flex-col items-center justify-end pb-1 text-[10px] font-bold" style={{ background: '#1A3D8F', color: '#FFFFFF' }}>
        IND
      </span>
      <span key={value} className="sm-bump grid place-items-center px-3 font-mono text-[22px] font-bold tracking-[0.1em]" style={{ color: '#111111' }}>
        {value}
      </span>
    </div>
  )
}

/**
 * T2. Press 1: the story, the plate, plate.py's first five lines with lines 6
 * to 8 blank, the steps and the timer, with `Lines 1 to 5 collect the digits.
 * Write lines 6 to 8.` Press 2: step 2 lights, framed as my notes. Press 3:
 * lines 6 to 8 fill in. Press 4: the run with TS09EA4521. Press 5: with
 * AP39CQ1234. Press 6: my notes' line 5 runs and the terminal shows only the
 * error (its must line), with the rule.
 */
export function Task2() {
  const beat = useBeats(6)
  const notes = beat === 6
  const prog = notes ? T2P[2] : beat === 5 ? T2P[1] : T2P[0]
  const code = beat <= 2 ? OPEN : prog.src
  const out = beat >= 4 ? prog.output.split('\n') : []
  const caption = notes ? T2.show[6] : T2.show[2]
  return (
    <>
      {/* two balanced groups (rule G3): the story and its program on the left; the worksheet, timer, steps and terminal on the right */}
      <div className="flex items-stretch gap-8">
        <Group pad={10} className="flex w-[520px] shrink-0 flex-col gap-2.5">
          <div className="flex items-center justify-between gap-4 pl-1">
            <p className="whitespace-nowrap text-[15px] font-semibold leading-snug" style={{ color: colors.body }}>
              <Lines lines={sentences(T2.show[1])} />
            </p>
            <Plate value={prog.input ?? ''} />
          </div>
          <CodePane
            code={code}
            mark={beat === 3 ? [6, 7, 8] : notes ? [5] : undefined}
            at={notes ? 6 : null}
            stop={notes}
            fontSize={14.5}
            rows={8}
          />
          <StepCaption text={caption} tone={notes ? 'rule' : 'step'} size={16} minH={46} />
        </Group>
        <Group className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <TaskPill>{T2.show[0]}</TaskPill>
            <Countdown seconds={T2.timer} />
          </div>
          <ol className="flex flex-col gap-1.5">
            <TaskStep n={1} text={`${T2.show[3]} ${T2.show[4]}`} lit />
            <TaskStep n={2} text={T2.show[5]} lit={beat >= 2} />
          </ol>
          <OutPanel title="Terminal" lines={out.map((t) => ({ text: t, tone: t.startsWith('TypeError') ? ('error' as const) : 'plain' }))} minRows={4} fontSize={14} className="mt-auto" />
        </Group>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}
