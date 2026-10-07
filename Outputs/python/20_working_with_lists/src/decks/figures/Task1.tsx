import { Countdown, useBeats } from '@/ui'
import { StepControls } from './controls'
import { Memory, type MNode, type MTag } from './memory'
import { OutPanel, Steps, TaskPill, sentences } from './pieces'
import { CodePane, StepCaption } from './trace'
import { SPEC } from './spec'

/**
 * WORKSHEET TASK 1: CHANGE ONE ITEM. Spec card T1, three presses, 3:00.
 *
 * Press 1: the program, the steps, the timer, and list_a as four boxes with
 * positions 0 to 3. Nothing about the output shows until the room has run it
 * (its must_not). Press 2: line 3 runs, the box at position 3 changes from 5
 * to 4 in place and the others do not move; the terminal shows both prints.
 * Press 3: the instructor's own mistake, the same move on a word. The H box
 * refuses: it shakes and stays H. The terminal shows `Hello` and then the
 * error exactly as Python prints it, because line 2 ran before Python stopped
 * at line 3 (its must lines).
 */
const T1 = SPEC.T1
const CHANGE = T1.code[0]
const WORD = T1.code[1]

export function Task1() {
  const beat = useBeats(3)
  const word = beat >= 3
  const out = word
    ? (WORD.output as string).split('\n').map((t: string, i: number) => ({ text: t, tone: i === 1 ? ('error' as const) : ('plain' as const) }))
    : beat >= 2
      ? (CHANGE.output as string).split('\n').map((t: string) => ({ text: t }))
      : []
  const nodes: MNode[] = word
    ? [{ id: 'W', kind: 'row', x: 150, y: 10, items: ['H', 'e', 'l', 'l', 'o'], positions: true, size: 'lg', boxW: 58, bad: [0], shake: 0 }]
    : [{ id: 'L', kind: 'row', x: 150, y: 10, items: beat >= 2 ? ['1', '2', '3', '4'] : ['1', '2', '3', '5'], positions: true, size: 'lg', boxW: 64, hot: beat >= 2 ? [3] : [] }]
  const tags: MTag[] = [word ? { name: 'word', x: 0, y: 19, to: 'W' } : { name: 'list_a', x: 0, y: 19, to: 'L' }]
  return (
    <>
      <div className="flex items-start gap-8">
        <div className="flex w-[540px] shrink-0 flex-col gap-3">
          <CodePane code={word ? WORD.src : CHANGE.src} at={beat === 1 ? null : 3} stop={word} fontSize={19} rows={4} />
          <OutPanel title="Terminal" lines={out} minRows={2} fontSize={14.5} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-2.5">
              <TaskPill>Worksheet · Task 1</TaskPill>
              <Steps size={18} items={sentences('Type it. Predict line 4. Run.')} />
            </div>
            <Countdown seconds={T1.timer} />
          </div>
          <Memory width={570} height={96} nodes={nodes} tags={tags} size="lg" />
          <StepCaption
            line={beat === 1 ? null : 3}
            text={beat === 2 ? 'list_a[3] = 4 puts 4 at position 3.' : word ? 'A list can change. A string cannot.' : null}
            tone={word ? 'rule' : 'step'}
          />
        </div>
      </div>
      <StepControls at={beat} total={3} />
    </>
  )
}
