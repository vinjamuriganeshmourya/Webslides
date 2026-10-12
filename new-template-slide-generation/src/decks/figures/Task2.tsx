import { colors } from '@/design/tokens'
import { Countdown, useBeats } from '@/ui'
import { StepControls } from './controls'
import { Memory, pictureOf, type SpecStep, type StepLayout } from './memory'
import { OutPanel, Show, Steps, TaskPill, sentences } from './pieces'
import { CodePane, StepCaption, printedBy } from './trace'
import { SPEC } from './spec'

/**
 * WORKSHEET TASK 2: PREDICT, THEN RUN. Spec card T2, eleven presses, 4:00.
 *
 * Press 1: programs A and B side by side with line 2 marked in both (the only
 * difference), the steps and the timer. Nothing about the output shows until
 * the timer has ended and the instructor presses (its must line). Presses 2
 * to 6 walk A one line per press from `data.A`; presses 7 to 11 walk B from
 * `data.B`. A print adds its line only on its own press. In B, line 3 changes
 * the box at position 3 in the ONE row both tags point at; A's picture keeps
 * its two rows while B runs, so the two endings sit side by side.
 */
const T2 = SPEC.T2
const A: SpecStep[] = T2.data.A
const B: SpecStep[] = T2.data.B

const LAY_A: StepLayout = {
  rows: { L1: { x: 142, y: 2 }, L2: { x: 142, y: 70 } },
  tags: { list_a: { x: 0, y: 7 }, list_b: { x: 0, y: 75 } },
  size: 'sm',
}
const LAY_B: StepLayout = {
  rows: { L1: { x: 142, y: 36 } },
  tags: { list_a: { x: 0, y: 2 }, list_b: { x: 0, y: 80 } },
  size: 'sm',
}

function Program({ label, src, steps, k, lay, setup, active }: { label: string; src: string; steps: SpecStep[]; k: number; lay: StepLayout; setup: boolean; /** this program is the one being walked now */ active: boolean }) {
  const step = k >= 0 ? steps[Math.min(k, steps.length - 1)] : null
  const prev = k >= 1 ? steps[k - 1] : null
  const pic = pictureOf(step, prev, lay)
  const live = active && k >= 0 && k < steps.length
  return (
    <div className="flex w-[555px] shrink-0 flex-col gap-2.5">
      <span className="font-heading text-[18px] font-bold" style={{ color: live ? colors.brandDark : colors.body }}>
        {label}
      </span>
      <CodePane code={src} at={step && live ? step.line : null} mark={setup ? [2] : []} fontSize={14} rows={5} />
      {!setup && (
        <>
          <StepCaption line={live ? step?.line : null} text={live ? step?.caption : null} size={15} minH={50} />
          <div className="flex items-start gap-3">
            <Memory width={300} height={122} nodes={pic.nodes} tags={pic.tags} size="sm" />
            <OutPanel lines={printedBy(steps, k)} minRows={2} fontSize={14} className="flex-1" />
          </div>
        </>
      )}
    </div>
  )
}

export function Task2() {
  const beat = useBeats(11)
  const setup = beat === 1
  const kA = beat >= 2 ? Math.min(beat - 2, 4) : -1
  const kB = beat >= 7 ? beat - 7 : -1
  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-10">
          <Program label="A" src={T2.code[0].src} steps={A} k={kA} lay={LAY_A} setup={setup} active={beat <= 6} />
          <Program label="B" src={T2.code[1].src} steps={B} k={kB} lay={LAY_B} setup={setup} active={beat >= 7} />
        </div>
        <Show on={setup} className={setup ? '' : 'hidden'}>
          <div className="flex items-start gap-10">
            <div className="flex w-[555px] shrink-0 flex-col gap-2.5">
              <TaskPill>Worksheet · Task 2</TaskPill>
              <Steps size={18} items={[...sentences('Type what lines 4 and 5 print, for A and for B.'), ...sentences('Then run both and compare.')]} />
            </div>
            <Countdown seconds={T2.timer} />
          </div>
        </Show>
      </div>
      <StepControls at={beat} total={11} />
    </>
  )
}
