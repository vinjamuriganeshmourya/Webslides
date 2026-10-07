import { colors } from '@/design/tokens'
import { CodeBlock, Countdown, useBeats } from '@/ui'
import { StepControls } from './controls'
import { ListBoxes, OutPanel, Show, Steps, TaskPill } from './pieces'

/**
 * RAVI'S CANTEEN WEEK. Spec card P1, worksheet task 3: slices and a loop,
 * inside a real problem. The totals are not on screen until the second
 * press, and sum() is not mentioned (the spec's must and must-not lines).
 */
const SPEND = ['60', '45', '80', '30', '55', '140', '110']
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const SOLUTION =
  'spend = [60, 45, 80, 30, 55, 140, 110]\nweekdays = 0\nfor amount in spend[0:5]:\n    weekdays += amount\nweekend = 0\nfor amount in spend[5:7]:\n    weekend += amount\nprint("Weekdays:", weekdays)\nprint("Weekend:", weekend)'

export function CanteenWeek() {
  const beat = useBeats(2)
  const shown = beat >= 2
  return (
    <>
      <div className="flex items-start gap-10">
        <div className="flex w-[620px] shrink-0 flex-col gap-2">
          <div className="flex items-center gap-5">
            <TaskPill>Your turn · 5 minutes</TaskPill>
            <Countdown seconds={300} />
          </div>
          <p className="text-[17px] leading-snug" style={{ color: colors.ink }}>
            Ravi wrote down what he spent at the canteen each day this week, Monday to Sunday
          </p>
          <CodeBlock code="spend = [60, 45, 80, 30, 55, 140, 110]" filename="Python" chip={false} fontSize={17} rows={1} />
          <ListBoxes items={SPEND} size="sm" width={66} labels={DAYS} lane={false} />
          <Steps size={16} items={['Print how much he spent on weekdays (Monday to Friday), then on the weekend', 'Use a slice for each part and a loop to add it up', 'Type both totals on your worksheet']} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {shown ? (
            <Show on={shown} className="flex flex-col gap-3">
              <CodeBlock code={SOLUTION} filename="Python" chip={false} fontSize={13} rows={9} lines={{ 3: 'mark', 6: 'mark' }} />
              <OutPanel lines={[{ text: 'Weekdays: 270' }, { text: 'Weekend: 250' }]} fontSize={16} />
            </Show>
          ) : (
            <OutPanel title="Output format" tone="exp" lines={[{ text: 'Weekdays: ...' }, { text: 'Weekend: ...' }]} fontSize={18} />
          )}
        </div>
      </div>
      <StepControls at={beat} total={2} />
    </>
  )
}
