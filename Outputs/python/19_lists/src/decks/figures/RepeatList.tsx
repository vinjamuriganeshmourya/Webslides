import { colors } from '@/design/tokens'
import { CodeBlock, useBeats } from '@/ui'
import { StepControls } from './controls'
import { Ask, ListBoxes, OutPanel, Show } from './pieces'

/**
 * REPEATING A LIST WITH *. Spec card C9, from deck slide 24.
 *
 * The room says what list_b will be (some will say [3, 6]); then the row
 * [1, 2] copies itself three times, joined: [1, 2, 1, 2, 1, 2]. Not times
 * each number: the whole list, three times.
 */
const CODE = 'list_a = [1, 2]\nlist_b = list_a * 3\nprint(list_b)'

export function RepeatList() {
  const beat = useBeats(2)
  const shown = beat >= 2
  return (
    <>
      <div className="flex items-start gap-10">
        <div className="flex w-[440px] shrink-0 flex-col gap-4">
          <CodeBlock code={CODE} filename="Python" chip={false} fontSize={18} rows={3} lines={{ 2: 'mark' }} />
          <Ask size={21}>What will list_b be?</Ask>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <ListBoxes items={['1', '2']} size="md" width={72} name="list_a" positions={false} lane={false} />
          <Show on={shown} className="flex flex-col gap-5">
            <ListBoxes
              items={['1', '2', '1', '2', '1', '2']}
              size="md"
              width={72}
              name="list_b"
              labels={['copy 1', '', 'copy 2', '', 'copy 3', '']}
              states={{ 2: 'new', 3: 'new', 4: 'new', 5: 'new' }}
              lane={false}
            />
            <OutPanel lines={shown ? [{ text: '[1, 2, 1, 2, 1, 2]' }] : []} fontSize={20} width={340} />
            <p className="text-[17px] font-semibold" style={{ color: colors.body }}>
              The whole list, three times
            </p>
          </Show>
        </div>
      </div>
      <StepControls at={beat} total={2} />
    </>
  )
}
