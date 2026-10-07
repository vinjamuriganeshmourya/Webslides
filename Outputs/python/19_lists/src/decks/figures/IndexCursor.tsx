import { colors } from '@/design/tokens'
import { CodeBlock, useBeats } from '@/ui'
import { StepControls } from './controls'
import { BigLine, ListBoxes, Note, OutPanel, Show } from './pieces'
import { LIST_A } from './MakeList'

/**
 * REACHING ONE ITEM. Spec card C5, from deck slide 18.
 *
 * The four boxes with positions 0 to 3 and a cursor above the row, on no box
 * yet. Then one `print` line per press, the biggest text on the card: the
 * cursor drops onto the position, the output shows the value. The cursor
 * points at the position number and the output shows the value, two different
 * things, both visible (the spec's must lines). `list_a[4]` is not shown here:
 * task 1 lets the room find that out.
 */
const CODE = 'a = 2\nlist_a = [5, "Six", a, 8.2]'
const ASKS = [
  { line: 'print(list_a[1])', pos: 1, out: 'Six' },
  { line: 'print(list_a[0])', pos: 0, out: '5' },
  { line: 'print(list_a[3])', pos: 3, out: '8.2' },
  { line: 'print(list_a[len(list_a) - 1])', pos: 3, out: '8.2' },
]

export function IndexCursor() {
  const beat = useBeats(5)
  const ask = beat >= 2 ? ASKS[Math.min(beat, 5) - 2] : null
  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex h-[64px] items-center">
          {ask ? (
            <BigLine k={beat} size={30}>
              {ask.line}
            </BigLine>
          ) : (
            <Note lines={['The second item is at position 1']} size={20} />
          )}
        </div>
        <div className="flex items-start gap-10">
          <div className="flex w-[400px] shrink-0 flex-col gap-4">
            <CodeBlock code={CODE} filename="Python" chip={false} fontSize={17} rows={2} />
            <div className="rounded-xl px-4 py-2.5" style={{ background: '#EAF3FF', boxShadow: `inset 4px 0 0 ${colors.brandDark}` }}>
              <p className="font-mono text-[22px] font-bold leading-tight" style={{ color: colors.brandDark }}>list_a[position]</p>
              <p className="mt-1 text-[16px] leading-snug" style={{ color: colors.body }}>the item at that position</p>
            </div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <ListBoxes
              items={LIST_A}
              size="lg"
              width={110}
              cursor={ask ? ask.pos : 0}
              cursorDown={Boolean(ask)}
              states={ask ? { [ask.pos]: 'now' } : {}}
            />
            <Show on={Boolean(ask)} lift={0}>
              <OutPanel lines={ask ? [{ text: ask.out }] : []} minRows={1} fontSize={22} width={260} />
            </Show>
            <Show on={beat >= 5}>
              <Note lines={['len(list_a) is 4, so len minus 1 is 3, the last position']} size={16} />
            </Show>
          </div>
        </div>
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}
