import { colors } from '@/design/tokens'
import { CodeBlock, Countdown, useBeats } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { Note, OutPanel, Show, Steps, TaskPill } from './pieces'

/**
 * WORKSHEET TASK 2: TYPE IT, CHANGE IT, RUN IT. Spec card T2.
 *
 * The gym plan, the program, a 4:00 timer. The output lands on press 2; then
 * the instructor's own mistake: line 3 without the brackets, and the terminal
 * shows the TypeError exactly as Python prints it, over the empty space where
 * the list used to print. Press 4 puts the brackets back. The change is the
 * instructor's mistake, not a trap (the spec's must line).
 */
const GOOD = 'pushups = []\nfor day in range(1, 6):\n    pushups += [day * 5]\nprint(pushups)'
const BAD = 'pushups = []\nfor day in range(1, 6):\n    pushups += day * 5\nprint(pushups)'

export function Task2() {
  const beat = useBeats(4)
  const broken = beat === 3
  return (
    <>
      <div className="flex items-start gap-10">
        <div className="flex w-[520px] shrink-0 flex-col gap-3">
          <TaskPill>Worksheet · Task 2</TaskPill>
          <p className="text-[19px] font-semibold leading-snug" style={{ color: colors.ink }}>
            Your gym plan: 5 push-ups on day 1, then 5 more every day
          </p>
          <Steps size={16} items={[<Lines lines={['Type the program', 'Predict, then run']} />, <Lines lines={['Now change line 3', 'Predict again, then run']} />]} />
          <Countdown seconds={240} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <CodeBlock code={broken ? BAD : GOOD} filename="Python" chip={false} fontSize={18} rows={4} lines={broken ? { 3: 'error' } : beat === 4 ? { 3: 'mark' } : {}} />
          <OutPanel
            title={broken ? 'Terminal' : 'Output'}
            lines={beat === 2 || beat === 4 ? [{ text: '[5, 10, 15, 20, 25]' }] : broken ? [{ text: '', tone: 'muted' }, { text: "TypeError: 'int' object is not iterable", tone: 'error' }] : []}
            minRows={2}
            fontSize={18}
            empty={broken ? undefined : beat === 1 ? 'nothing has run yet' : undefined}
          />
          <Show on={broken}>
            <Note lines={['Nothing printed at all', 'Python stopped at line 3']} size={17} />
          </Show>
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}
