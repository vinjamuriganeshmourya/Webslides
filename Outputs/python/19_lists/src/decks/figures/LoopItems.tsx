import { colors } from '@/design/tokens'
import { CodeBlock, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Ask, ListBoxes, OutPanel } from './pieces'
import { LIST_A } from './MakeList'

/**
 * GOING THROUGH EVERY ITEM. Spec card C6, from deck slide 19.
 *
 * `for item in list_a` takes each item in order, one per pass. Press 1 asks
 * how many lines it will print; then one pass per press: the cursor moves to
 * the next box, `item` takes its value, the output adds one line.
 */
const CODE = 'a = 2\nlist_a = [5, "Six", a, 8.2]\nfor item in list_a:\n    print(item)'
const OUT = ['5', 'Six', '2', '8.2']

export function LoopItems() {
  const beat = useBeats(5)
  const tween = useTween(420)
  const pass = beat - 2 /* -1 before the first pass */
  const running = pass >= 0
  return (
    <>
      <div className="flex items-start gap-10">
        <div className="flex w-[480px] shrink-0 flex-col gap-4">
          <CodeBlock code={CODE} filename="Python" chip={false} fontSize={18} rows={4} lines={running ? { 3: 'now', 4: 'now' } : {}} loop={[3, 4]} />
          <Ask size={21}>How many lines will it print?</Ask>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <ListBoxes items={LIST_A} size="lg" width={100} cursor={running ? pass : 0} cursorDown={running} cursorLabel={running ? 'item' : ''} states={running ? { [pass]: 'now' } : {}} />
          <div className="flex items-start gap-6">
            <div
              className="flex h-[52px] items-center gap-2 rounded-xl bg-white px-4 font-mono text-[20px] font-bold"
              style={{ color: colors.brandDark, boxShadow: `inset 0 0 0 2px ${running ? colors.brand : colors.line}`, opacity: running ? 1 : 0.55, transition: tween, whiteSpace: 'nowrap' }}
            >
              item = <span style={{ color: colors.ink }}>{running ? LIST_A[pass] : '?'}</span>
            </div>
            <OutPanel lines={OUT.slice(0, Math.max(0, pass + 1)).map((t) => ({ text: t }))} minRows={4} fontSize={20} width={220} />
          </div>
        </div>
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}
