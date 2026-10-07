import { CodeBlock, useBeats } from '@/ui'
import { StepControls } from './controls'
import { Ask, ListBoxes, OutPanel, Show } from './pieces'

/**
 * MAKING A LIST WITH list(). Spec card C12, from deck slides 30 and 32.
 * list() takes anything you can loop over and makes a list of its items: a
 * string gives one letter per box, a range gives its numbers, and range
 * stops before 4.
 */
const FROM_STRING = 'color = "Red"\nlist_a = list(color)\nprint(list_a)'
const FROM_RANGE = 'list_a = list(range(4))\nprint(list_a)'

export function ListFrom() {
  const beat = useBeats(4)
  return (
    <>
      <div className="grid grid-cols-2 gap-10">
        <div className="flex flex-col gap-4">
          <CodeBlock code={FROM_STRING} filename="Python" chip={false} fontSize={17} rows={3} />
          <Ask size={20}>What does list("Red") give?</Ask>
          <Show on={beat >= 2} className="flex flex-col gap-4">
            <OutPanel lines={beat >= 2 ? [{ text: "['R', 'e', 'd']" }] : []} fontSize={20} width={260} />
            <ListBoxes items={['R', 'e', 'd']} size="md" width={64} quote lane={false} />
          </Show>
        </div>
        <Show on={beat >= 3} className="flex flex-col gap-4">
          <CodeBlock code={FROM_RANGE} filename="Python" chip={false} fontSize={17} rows={3} />
          <Ask size={20}>And list(range(4))?</Ask>
          <Show on={beat >= 4} className="flex flex-col gap-4">
            <OutPanel lines={beat >= 4 ? [{ text: '[0, 1, 2, 3]' }] : []} fontSize={20} width={260} />
            <ListBoxes items={['0', '1', '2', '3']} size="md" width={64} lane={false} />
          </Show>
        </Show>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}
