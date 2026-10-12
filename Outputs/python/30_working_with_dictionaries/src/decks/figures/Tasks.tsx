import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { Countdown, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Focus, Group, Lines } from './common'
import { sentences, CODE_FS } from './pieces'
import { CodePane } from './trace'
import { Board, type Row, type RowTone, type SheetSpec, type TagSpec } from './sheet'
import { SPEC } from './spec'

/**
 * THE TWO WORKSHEET TASKS: T1 (six presses, 5:00) and T2 (six presses, 5:00).
 *
 * Both keep to the spec's must lines: no result shows until the timer has
 * ended (the instructor presses on after it), one step's result per press.
 * Every program and output is the spec's, run on CPython 3.12.3.
 */
type Prog = { file: string; src: string; output: string }

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
function Result({ label, lines, on, extra, below }: { label: string; lines: ReactNode[]; on: boolean; extra?: ReactNode; below?: ReactNode }) {
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
        {extra && (
          <span className="ml-auto self-center" style={{ opacity: on ? 1 : 0, transition: tween }}>
            {extra}
          </span>
        )}
      </div>
      {below && (
        <div className="pl-[70px]" style={{ opacity: on ? 1 : 0, transition: tween }}>
          {below}
        </div>
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

/* ------------------------------------------------------------------ T1 */

const T1 = SPEC.T1
const T1P: Prog[] = T1.code
const LINE2 = T1P[1].src.split('\n')[1] /* backup = trip.copy() */
const TRIP: Row[] = [
  ['Teja', 1500],
  ['Ravi', 800],
  ['Kiran', 0],
]
const TITLE = 'Ooty trip money'
const COPY_TITLE = `Copy of ${TITLE}`

/**
 * T1. Presses 1 to 3: backup.py, the three steps lighting one at a time, the
 * timer, the sheet with its tag. Presses 4 to 6, after the timer: step 1's
 * `500 / 3` (backup was the same sheet: two tags, one sheet, Kiran 500);
 * step 2's line 2 and `0 / 3` (a second sheet keeps the 0); step 3's `0 / 3`
 * with the KeyError it would be without the copy (trip empty, backup full).
 */
export function Task1() {
  const beat = useBeats(6)
  const showing = beat - 3 /* 1, 2, 3 once results start */
  const prog = showing >= 3 ? T1P[2] : showing >= 2 ? T1P[1] : T1P[0]
  const s1: Row[] = showing >= 3 ? [] : TRIP.map(([n, a]) => [n, n === 'Kiran' && showing >= 1 ? 500 : a])
  const sheets: SheetSpec[] = [{ id: 'S1', title: TITLE, rows: s1, tones: showing === 1 ? { Kiran: 'hot' as RowTone } : {} }, ...(showing >= 2 ? [{ id: 'S2', title: COPY_TITLE, rows: TRIP, stagger: true } as SheetSpec] : [])]
  const tags: TagSpec[] = [{ name: 'trip', to: 'S1' }, ...(showing === 1 ? [{ name: 'backup', to: 'S1' } as TagSpec] : showing >= 2 ? [{ name: 'backup', to: 'S2' } as TagSpec] : [])]
  return (
    <>
      <div className="flex items-stretch gap-3">
        <Group pad={10} className="flex w-[560px] shrink-0 flex-col gap-2" active={showing >= 1}>
          <Focus on={showing === 2}>
            <CodePane code={prog.src} fontSize={CODE_FS} rows={6} highlight={showing === 2 ? 2 : showing === 3 ? 4 : undefined} />
          </Focus>
          <Result label="Step 1" lines={T1P[0].output.split('\n')} on={showing >= 1} />
          <Result
            label="Step 2"
            lines={T1P[1].output.split('\n')}
            on={showing >= 2}
            extra={
              <span className="whitespace-pre font-mono text-[13px] font-semibold" style={{ color: colors.brandDark }}>
                {LINE2}
              </span>
            }
          />
          <Result
            label="Step 3"
            lines={T1P[2].output.split('\n')}
            on={showing >= 3}
            extra={
              <span className="flex flex-col items-end font-mono text-[12px] font-semibold leading-[15px]">
                <span style={{ color: colors.muted }}>with backup = trip</span>
                <span style={{ color: colors.danger }}>KeyError: 'Kiran'</span>
              </span>
            }
          />
        </Group>
        <Group pad={10} className="flex min-w-0 flex-1 flex-col gap-2" active={beat <= 3}>
          <WorksheetBox label={T1.show[0]} seconds={T1.timer} />
          <p className="text-[15px] font-semibold leading-snug" style={{ color: colors.body }}>
            <Lines lines={sentences(T1.show[1])} />
          </p>
          <ol className="flex flex-col gap-1">
            {[2, 3, 4].map((s, i) => (
              <TaskStep key={s} n={i + 1} text={T1.show[s]} lit={beat >= i + 1} />
            ))}
          </ol>
          <div className="flex flex-1 items-center justify-center pt-1">
            <Board size="sm" gap={30} sheets={sheets} tags={tags} minRows={3} />
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
const CALL_SHEET = T2P[1].src.split('\n').slice(-2) /* the sheet line and the ** call */
const NO_STARS = 'TypeError: trip_total() takes 0 positional arguments but 1 was given'

/**
 * T2. Presses 1 to 3: trip_total.py, the three steps, the timer; step 2
 * shows the sheet line to type. Presses 4 to 6: `2300 1`; the ** call and
 * `2300 2`, with the TypeError it would be without the stars; `0 0`.
 */
export function Task2() {
  const beat = useBeats(6)
  const showing = beat - 3
  const prog = showing >= 3 ? T2P[2] : showing >= 2 ? T2P[1] : T2P[0]
  return (
    <>
      <div className="flex items-stretch gap-3">
        <Group pad={10} className="flex w-[660px] shrink-0 flex-col gap-2" active={showing >= 1}>
          <Focus on={showing === 2}>
            <CodePane code={prog.src} fontSize={CODE_FS} rows={11} highlight={showing === 2 ? 11 : showing === 3 ? 10 : undefined} />
          </Focus>
        </Group>
        <Group pad={10} className="flex min-w-0 flex-1 flex-col gap-2" active={beat <= 3}>
          <WorksheetBox label={T2.show[0]} seconds={T2.timer} />
          <p className="text-[15px] font-semibold leading-snug" style={{ color: colors.body }}>
            <Lines lines={sentences(T2.show[1])} />
          </p>
          <ol className="flex flex-col gap-1">
            {[2, 3, 4].map((s, i) => (
              <TaskStep key={s} n={i + 1} text={T2.show[s]} lit={beat >= i + 1} />
            ))}
          </ol>
          <div className="flex min-h-[26px] items-center" style={{ opacity: beat >= 2 ? 1 : 0, transition: 'opacity 480ms cubic-bezier(0.22,1,0.36,1)' }}>
            <span className="whitespace-pre rounded-lg bg-white px-2.5 py-1 font-mono text-[12.5px] font-semibold" style={{ color: colors.ink, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
              {CALL_SHEET[0]}
            </span>
          </div>
          <Result label="Step 1" lines={[T2P[0].output]} on={showing >= 1} />
          <Result
            label="Step 2"
            lines={[T2P[1].output]}
            on={showing >= 2}
            extra={
              <span className="whitespace-pre font-mono text-[13px] font-semibold" style={{ color: colors.brandDark }}>
                {CALL_SHEET[1]}
              </span>
            }
            below={
              <span className="block font-mono text-[12px] font-semibold leading-[15px]" style={{ color: colors.danger, whiteSpace: 'pre-wrap' }}>
                <span style={{ color: colors.muted }}>without the stars: </span>
                {NO_STARS}
              </span>
            }
          />
          <Result label="Step 3" lines={[T2P[2].output]} on={showing >= 3} />
        </Group>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}
