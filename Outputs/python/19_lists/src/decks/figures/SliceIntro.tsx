import { colors } from '@/design/tokens'
import { CodeBlock, useBeats } from '@/ui'
import { StepControls } from './controls'
import { BigLine, ListBoxes, Note, OutPanel, Show, type BoxState } from './pieces'
import { LIST_A } from './MakeList'

/**
 * TAKING PART OF A LIST. Spec card C10, from deck slides 25 and 26.
 *
 * One item first (list_a[0] gives 5), then a dashed frame round the first two
 * and the question: how do we ask for these two? The line is written only on
 * press 3, after the room has tried, as the biggest text on the card. The
 * output lands on press 4 with position 2 outlined as the wall: the stop, not
 * taken. Press 5 brings the deck's short form, [:2], as the same slice.
 */
const SLICE = 'list_a = [5, "Six", 2, 8.2]\nlist_b = list_a[0:2]\nprint(list_b)'
const SHORT = 'list_a = [5, "Six", 2, 8.2]\nlist_b = list_a[:2]\nprint(list_b)'

export function SliceIntro() {
  const beat = useBeats(5)
  const states: Record<number, BoxState> = beat >= 4 ? { 0: 'hit', 1: 'hit', 2: 'wall' } : beat === 1 ? { 0: 'hit' } : {}
  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex h-[64px] items-center gap-5">
          {beat >= 3 ? (
            <>
              <BigLine k={1} size={30}>
                list_b = list_a[0:2]
              </BigLine>
              <Show on={beat >= 5} lift={0}>
                <BigLine k={2} size={30}>
                  list_b = list_a[:2]
                </BigLine>
              </Show>
            </>
          ) : (
            <Note lines={beat === 1 ? ['list_a[0] gives one item: 5'] : ['How do we ask for these two?']} size={20} />
          )}
        </div>
        <div className="flex items-start gap-10">
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <ListBoxes items={LIST_A} size="lg" width={110} states={states} frame={beat >= 2 ? [0, 1] : undefined} lane={false} />
            <Show on={beat >= 3}>
              <Note lines={['Start at the first number', 'Stop before the second']} size={17} />
            </Show>
            <Show on={beat >= 5}>
              <Note lines={['No start number means start at 0']} size={17} />
            </Show>
          </div>
          <div className="flex w-[430px] shrink-0 flex-col gap-4">
            <Show on={beat >= 3} lift={0}>
              <CodeBlock code={beat >= 5 ? SHORT : SLICE} filename="Python" chip={false} fontSize={17} rows={3} lines={{ 2: 'mark' }} />
            </Show>
            <Show on={beat >= 4}>
              <OutPanel lines={beat >= 4 ? [{ text: "[5, 'Six']" }] : []} fontSize={20} />
            </Show>
            <Show on={beat >= 4}>
              <p className="text-[16px] font-semibold" style={{ color: colors.body }}>
                Position 2 is the stop, outlined and not taken
              </p>
            </Show>
          </div>
        </div>
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}
