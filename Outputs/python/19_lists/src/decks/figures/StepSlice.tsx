import { colors } from '@/design/tokens'
import { CodeBlock, useBeats } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { Ask, ListBoxes, OutPanel, Show } from './pieces'

/**
 * SLICING WITH A STEP. Spec card C11, from deck slides 27 and 28: the walker,
 * in the room's head, on a new list. Start 0, stop before 5, jump 3: the
 * cursor hops 0, then 3, then hits 6 past the end.
 */
const CODE = 'list_a = ["R", "B", "G", "O", "W"]\nlist_b = list_a[0:5:3]\nprint(list_b)'
const ITEMS = ['R', 'B', 'G', 'O', 'W']

export function StepSlice() {
  const beat = useBeats(2)
  const shown = beat >= 2
  return (
    <>
      <div className="flex items-start gap-10">
        <div className="flex w-[480px] shrink-0 flex-col gap-4">
          <CodeBlock code={CODE} filename="Python" chip={false} fontSize={18} rows={3} lines={{ 2: 'mark' }} />
          <Ask size={21}>
            <Lines lines={['Start 0, stop before 5, jump 3', 'What does it give?']} />
          </Ask>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <ListBoxes
            items={ITEMS}
            size="lg"
            width={76}
            ghosts={2}
            states={shown ? { 0: 'hit', 1: 'grey', 2: 'grey', 3: 'hit', 4: 'grey' } : {}}
            cursor={shown ? 6 : null}
            cursorDown
          />
          <Show on={shown} className="flex flex-col gap-4">
            <p className="text-[18px] font-semibold" style={{ color: colors.body }}>
              Position 0, then 3, then 6: past the end
            </p>
            <OutPanel lines={shown ? [{ text: "['R', 'O']" }] : []} fontSize={20} width={260} />
          </Show>
        </div>
      </div>
      <StepControls at={beat} total={2} />
    </>
  )
}
