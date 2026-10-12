import { colors } from '@/design/tokens'
import { Countdown, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { Memory, pictureOf, type SpecStep, type StepLayout } from './memory'
import { OutPanel, Steps, TaskPill, sentences } from './pieces'
import { CodePane, StepCaption, printedBy } from './trace'
import { SPEC } from './spec'

/**
 * WORKSHEET TASK 3: ONE LIST OR TWO? Spec card T3, eight presses, 4:00.
 *
 * Press 1: the story line, the program with line numbers, the steps and the
 * timer, and no picture or output (its must_not). Presses 2 to 8 reveal one
 * line each from `data.steps`: tags, rows and arrows update, the caption is
 * the spec's, and the strip of four cells, "after line 2 … 5: one list or
 * two?", fills from `data.one_list` as the walk passes each line, so the room
 * checks its worksheet taps one by one.
 *
 * mine sits on the top line and kiran on the bottom with the row they share,
 * so on line 4, the turn, a new row arrives on the top line and only mine's
 * arrow moves; on line 5 only kiran's row changes (its must lines).
 */
const T3 = SPEC.T3
const STEPS: SpecStep[] = T3.data.steps
const ONE: Record<string, boolean> = T3.data.one_list

const LAY: StepLayout = {
  rows: { L1: { x: 104, y: 112 }, L2: { x: 104, y: 6 } },
  tags: { mine: { x: 0, y: 9 }, kiran: { x: 0, y: 115 } },
  size: 'xs',
  boxW: 116,
}

function OneOrTwo({ k }: { k: number }) {
  const tween = useTween(420)
  return (
    <div className="flex items-stretch gap-2">
      {Object.keys(ONE).map((line) => {
        const on = k >= Number(line) - 1
        const one = ONE[line]
        return (
          <div key={line} className="flex w-[150px] flex-col items-start rounded-xl px-3 py-1.5" style={{ background: on ? (one ? colors.surface2 : '#FFF4EC') : colors.white, boxShadow: `inset 0 0 0 ${on ? 2 : 1.5}px ${on ? (one ? colors.brand : colors.accent) : colors.line}`, transition: tween }}>
            <span className="text-[14px] font-semibold" style={{ color: colors.muted }}>
              After line {line}
            </span>
            <span className="font-heading text-[17px] font-bold" style={{ color: on ? (one ? colors.brandDark : colors.accentDark) : colors.line, transition: tween }}>
              {on ? (one ? 'One list' : 'Two lists') : '?'}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function Task3() {
  const beat = useBeats(8)
  const k = beat - 2
  const step = k >= 0 ? STEPS[k] : null
  const prev = k >= 1 ? STEPS[k - 1] : null
  const pic = pictureOf(step, prev, LAY)
  return (
    <>
      <div className="flex items-start gap-7">
        <div className="flex w-[440px] shrink-0 flex-col gap-3">
          <CodePane code={T3.code[0].src} at={step?.line ?? null} fontSize={14} rows={7} />
          <OutPanel lines={printedBy(STEPS, k)} minRows={2} fontSize={12.5} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <div className="flex items-start justify-between gap-6">
            <TaskPill>Worksheet · Task 3</TaskPill>
            <Countdown seconds={T3.timer} />
          </div>
          <div className="h-[156px]">
            {beat === 1 ? (
              <div className="flex flex-col gap-3">
                <p className="text-[19px] font-semibold leading-snug" style={{ color: colors.body }}>
                  <Lines lines={sentences('You share the Road Trip songs with Kiran. Then you both edit.')} />
                </p>
                <Steps size={18} items={[...sentences('After each line: one list or two?'), ...sentences('Then type what the two prints show.')]} />
              </div>
            ) : (
              <Memory width={680} height={156} nodes={pic.nodes} tags={pic.tags} size="xs" />
            )}
          </div>
          <OneOrTwo k={k} />
          <StepCaption line={step?.line} text={step?.caption} size={15} minH={52} />
        </div>
      </div>
      <StepControls at={beat} total={8} />
    </>
  )
}
