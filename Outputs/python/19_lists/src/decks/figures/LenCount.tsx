import { colors } from '@/design/tokens'
import { CodeBlock, useBeats } from '@/ui'
import { StepControls } from './controls'
import { Ask, ListBoxes, OutPanel, Show } from './pieces'
import { LIST_A } from './MakeList'
import { NestedBoxes } from './NestedList'

/**
 * HOW MANY ITEMS? Spec card C4, from deck slide 17. Two programs side by side.
 *
 * `len(list_a)`: the room says a number, the output lands and the four boxes
 * count up 1, 2, 3, 4. Then `len(list_b)` from C3: the output is 2, and the
 * drawing shows why, the inner list counts as one item.
 */
const CODE_A = 'a = 2\nlist_a = [5, "Six", a, 8.2]\nprint(len(list_a))'
const CODE_B = 'a = 2\nlist_a = [5, "Six", a, 8.2]\nlist_b = [1, list_a]\nprint(len(list_b))'

export function LenCount() {
  const beat = useBeats(4)
  return (
    <>
      <div className="grid grid-cols-2 gap-10">
        <div className="flex flex-col gap-4">
          <CodeBlock code={CODE_A} filename="Python" chip={false} fontSize={17} rows={4} />
          <Ask size={20}>What does len(list_a) give?</Ask>
          <div className="flex items-start gap-6">
            <OutPanel lines={beat >= 2 ? [{ text: '4' }] : []} minRows={1} fontSize={22} width={150} />
            <ListBoxes items={LIST_A} size="sm" width={64} labels={['1', '2', '3', '4']} posOn={beat >= 2} posStagger lane={false} />
          </div>
        </div>
        <Show on={beat >= 3} className="flex flex-col gap-4">
          <CodeBlock code={CODE_B} filename="Python" chip={false} fontSize={17} rows={4} />
          <Ask size={20}>And len(list_b)?</Ask>
          <div className="flex items-start gap-6">
            <OutPanel lines={beat >= 4 ? [{ text: '2' }] : []} minRows={1} fontSize={22} width={150} />
            <Show on={beat >= 4} className="flex flex-col gap-1.5">
              <NestedBoxes size="sm" labels={['1', '2']} />
              <p className="text-[16px] font-semibold" style={{ color: colors.body }}>
                The list inside counts as one item
              </p>
            </Show>
          </div>
        </Show>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}
