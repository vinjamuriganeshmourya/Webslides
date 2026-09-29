import { VariableTrace, StepControls } from '@/ui'
import type { TraceStep } from '@/ui'
import { useClaimedSteps } from '@/motion/Stepper'
import { BeatCaption } from './BeatCaption'
import { TaskCard, Em, Mono } from './TaskCard'
import { Timer } from './Timer'

/**
 * WORKSHEET TASK 1 — the task, then the run, on one frame.
 *
 * THE BEATS ARE ON THE SLIDE, NOT IN THE NOTES. The reference names eleven
 * beats (`worksheet task 1`, `line 1`, `line 2`, `line 3, first pass`, ...) and
 * says a sentence under each one. The first cut of this deck joined all ten
 * sentences into a single `notes` string, so the room watched boxes change with
 * no narration anywhere on screen and the instructor carried the whole trace
 * from memory. `BeatCaption` puts the label and its sentence back under the
 * figure, one beat at a time.
 *
 * BEAT 1 IS THE TASK, and it is the beat the frame opens on: the room fills the
 * pass table by hand before anything here moves. `VariableTrace`'s `aside` holds
 * it in the columns the variables and the output will take over, so the code
 * panel does not jump when the run starts.
 *
 * ONE STEP BUDGET. This card claims all eleven; the trace inside it is driven by
 * `step` rather than claiming again, or the slide would count twenty one.
 */

export interface TraceBeat {
  label: string
  text: string
}

export function Task1Trace({
  code,
  steps,
  beats,
  py,
  seconds,
}: {
  code: string
  steps: TraceStep[]
  /** One per beat. The first is the task; the rest are the executed lines. */
  beats: TraceBeat[]
  py: string
  seconds: number
}) {
  const shown = useClaimedSteps(beats.length)
  const reached = shown.filter(Boolean).length
  const beat = reached > 0 ? beats[reached - 1] : undefined
  /* Beat 1 is the task, so beat k shows trace step k-1. */
  const traceStep = Math.max(0, reached - 1)
  const onTask = reached <= 1

  return (
    <div className="flex w-full flex-col">
      <VariableTrace
        code={code}
        steps={steps}
        location={py}
        step={traceStep}
        slots={['ch', 'n']}
        aside={
          onTask ? (
            <TaskCard
              lines={[
                <>
                  Open <Em>worksheet task 1</Em>.
                </>,
                <>Fill the pass table by hand before you run anything.</>,
                <>
                  Write what <Mono>ch</Mono> holds on each pass.
                </>,
                <>
                  Write what <Mono>n</Mono> is after line 4.
                </>,
                <>Write what line 5 prints.</>,
                <>
                  <Em>Do not run it yet.</Em>
                </>,
              ]}
            >
              <Timer seconds={seconds} className="self-start" />
            </TaskCard>
          ) : undefined
        }
      />
      <BeatCaption label={beat?.label} caption={beat?.text} step={reached} className="mt-4" />
      <StepControls className="mt-3 w-full justify-center" showCount mode="code" />
    </div>
  )
}
