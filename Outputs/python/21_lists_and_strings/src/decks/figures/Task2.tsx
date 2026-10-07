import { colors } from '@/design/tokens'
import { Countdown, useBeats } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { ListBoxes, OutPanel, Steps, TaskPill, sentences, type BoxState } from './pieces'
import { CodePane, StepCaption } from './trace'
import { SPEC } from './spec'

/**
 * WORKSHEET TASK 2: RAVI'S LAST THREE DAYS. Spec card T2, four presses, 6:00.
 *
 * Press 1: the story, the input line, steps.py with line numbers, the steps of
 * the task and the timer; nothing about any output until the timer has ended
 * (its must line). Press 2: the five day counts as boxes with both position
 * rows, `steps[-3:]` lights the last three, `15100`. Press 3: change 1, the
 * slice becomes `steps[-2:]`, `12100`. Press 4: change 2, `steps[-3:-1]`, the
 * box 5100 greys, `10000`: the stop is never taken. The program and its input
 * are the spec's; the three totals were run on CPython (plan, outputs table).
 */
const T2 = SPEC.T2
const PROG = T2.code[0]
const INPUT: string = PROG.input
const DAYS = INPUT.split(',')
const RUNS = [
  { slice: '[-3:]', lit: [2, 3, 4], grey: [] as number[], output: PROG.output as string },
  { slice: '[-2:]', lit: [3, 4], grey: [] as number[], output: '12100' },
  { slice: '[-3:-1]', lit: [2, 3], grey: [4], output: '10000' },
]
const srcWith = (slice: string) => (PROG.src as string).replace('steps[-3:]', `steps${slice}`)

const TASK_STEPS = ['Predict what it prints', 'Type it, run it with the input', 'Change the slice to steps[-2:], run it', 'Change it to steps[-3:-1], run it']

export function Task2() {
  const beat = useBeats(4)
  const run = beat >= 2 ? RUNS[beat - 2] : null
  const states: Record<number, BoxState> = {}
  run?.lit.forEach((i) => (states[i] = 'hit'))
  run?.grey.forEach((i) => (states[i] = 'grey'))
  const caption = beat === 2 ? 'steps[-3:] takes -3 to the end.' : beat === 3 ? 'Change 1: steps[-2:], the last two days.' : beat === 4 ? 'Change 2: steps[-3:-1]. The stop is never taken.' : null
  return (
    <>
      <div className="flex items-start gap-8">
        <div className="flex w-[500px] shrink-0 flex-col gap-3">
          <p className="text-[18px] font-semibold leading-snug" style={{ color: colors.body }}>
            <Lines lines={[...sentences(T2.show[1]), ...sentences(T2.show[2])]} />
          </p>
          <span className="self-start rounded-md px-3 py-1 font-mono text-[16px] font-bold" style={{ background: `${colors.brand}14`, color: colors.brandDark, boxShadow: `inset 0 0 0 1.5px ${colors.brand}55` }}>
            {T2.show[3]}
          </span>
          <CodePane code={srcWith(run ? run.slice : '[-3:]')} highlight={run ? 3 : undefined} fontSize={15} rows={5} />
          <StepCaption text={caption} tone={beat === 4 ? 'rule' : 'step'} size={17} minH={48} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-2.5">
              <TaskPill>{T2.show[0]}</TaskPill>
              <Steps size={16} items={TASK_STEPS} />
            </div>
            <Countdown seconds={T2.timer} />
          </div>
          <div style={{ opacity: run ? 1 : 0.35 }}>
            <ListBoxes items={DAYS} size="sm" quote lane={false} rowLabels neg={DAYS.map(() => true)} states={states} />
          </div>
          <OutPanel lines={run ? [{ text: run.output }] : []} minRows={1} fontSize={18} />
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}
