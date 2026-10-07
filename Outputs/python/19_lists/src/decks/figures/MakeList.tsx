import { colors } from '@/design/tokens'
import { CodeBlock, useBeats } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { ListBoxes, OutPanel, Show } from './pieces'

/**
 * MAKING A LIST. Spec card C2, from deck slides 14 and 15.
 *
 * The code with line 2 marked, and line 2 drawn big with its brackets and
 * commas picked out. The output arrives one line per press, only after the
 * room has said `a` or `2`: `<class 'list'>`, then `[5, 'Six', 2, 8.2]` with
 * the 2 marked, because it was `a`.
 */
export const LIST_A = ['5', "'Six'", '2', '8.2']
const CODE = 'a = 2\nlist_a = [5, "Six", a, 8.2]\nprint(type(list_a))\nprint(list_a)'

/** Line 2, big, with `[`, `]` and every `,` in the accent tone. */
function Marked({ text }: { text: string }) {
  return (
    <span className="font-mono text-[26px] font-bold" style={{ color: colors.ink, whiteSpace: 'pre' }}>
      {[...text].map((ch, i) =>
        ch === '[' || ch === ']' || ch === ',' ? (
          <span key={i} className="rounded-[4px] px-[2px]" style={{ color: colors.accentDark, background: '#FFF4EC' }}>
            {ch}
          </span>
        ) : (
          <span key={i}>{ch}</span>
        ),
      )}
    </span>
  )
}

export function MakeList() {
  const beat = useBeats(3)
  const lines = [{ text: "<class 'list'>" }, { text: "[5, 'Six', 2, 8.2]" }].slice(0, Math.max(0, beat - 1))
  return (
    <>
      <div className="flex items-start gap-10">
        <div className="flex w-[560px] shrink-0 flex-col gap-4">
          <CodeBlock code={CODE} filename="Python" chip={false} fontSize={18} rows={4} lines={{ 2: 'mark' }} />
          <div className="rounded-2xl bg-white px-5 py-3" style={{ boxShadow: `inset 0 0 0 2px ${colors.line}` }}>
            <Marked text='list_a = [5, "Six", a, 8.2]' />
          </div>
          <p className="text-[20px] leading-snug" style={{ color: colors.body }}>
            <Lines lines={['Square brackets around it', 'A comma between items']} />
          </p>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <OutPanel lines={lines} minRows={2} fontSize={20} />
          <Show on={beat >= 3} className="flex flex-col gap-2">
            <ListBoxes items={LIST_A} size="md" width={96} states={{ 2: 'mark' }} labels={['', '', 'it was a', '']} lane={false} />
            <p className="text-[17px] font-semibold" style={{ color: colors.body }}>
              Python stores the value of a, not the letter
            </p>
          </Show>
        </div>
      </div>
      <StepControls at={beat} total={3} />
    </>
  )
}
