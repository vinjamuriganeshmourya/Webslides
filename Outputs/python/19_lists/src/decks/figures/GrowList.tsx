import { colors } from '@/design/tokens'
import { CodeBlock, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { BeatCaption, Lines } from './common'
import { Ask, ListBoxes, OutPanel, Show } from './pieces'

/**
 * ADDING ITEMS TO A LIST. Spec card C8, from deck slides 21 and 23, walked
 * one step per press.
 *
 * list_a starts as an empty row. Press 1 asks what line 5 prints; then the
 * six steps of the data, one per press: the line runs, i takes its value, a
 * new box joins the END of list_a and the old boxes do not move. The two
 * print lines show [] first and the full list last.
 */
const CODE = 'list_a = []\nprint(list_a)\nfor i in range(1, 4):\n    list_a += [i]\nprint(list_a)'

const STEPS: { line: number; i?: number; list: string[]; prints?: string; caption: string[] }[] = [
  { line: 1, list: [], caption: ['Line 1: list_a starts empty'] },
  { line: 2, list: [], prints: '[]', caption: ['Line 2 prints []'] },
  { line: 4, i: 1, list: ['1'], caption: ['i is 1', 'list_a += [1] puts 1 at the end'] },
  { line: 4, i: 2, list: ['1', '2'], caption: ['i is 2', 'list_a += [2] puts 2 at the end'] },
  { line: 4, i: 3, list: ['1', '2', '3'], caption: ['i is 3', 'list_a += [3] puts 3 at the end'] },
  { line: 5, list: ['1', '2', '3'], prints: '[1, 2, 3]', caption: ['Line 5 prints [1, 2, 3]'] },
]

export function GrowList() {
  const beat = useBeats(7)
  const tween = useTween(420)
  const k = beat - 2 /* -1 = the question */
  const st = k >= 0 ? STEPS[k] : null
  const list = st ? st.list : []
  const printed = STEPS.slice(0, k + 1).filter((s) => s.prints).map((s) => ({ text: s.prints as string }))
  const hasI = st?.i !== undefined
  return (
    <>
      <div className="flex items-start gap-10">
        <div className="flex w-[440px] shrink-0 flex-col gap-4">
          <CodeBlock code={CODE} filename="Python" chip={false} fontSize={18} rows={5} lines={st ? { [st.line]: 'now' } : {}} loop={[3, 4]} />
          <div className="min-h-[72px]">
            {st ? (
              <BeatCaption n={k + 1} lines={st.caption} size={17} />
            ) : (
              <>
                <p className="text-[19px] font-semibold" style={{ color: colors.ink }}>
                  <Lines lines={['[] is an empty list']} />
                </p>
                <Ask size={20} className="mt-1">
                  What does line 5 print?
                </Ask>
              </>
            )}
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <div className="flex items-start gap-5">
            <div
              className="grid h-[54px] w-[110px] shrink-0 place-items-center rounded-xl bg-white font-mono text-[20px] font-bold"
              style={{ color: colors.brandDark, boxShadow: `inset 0 0 0 2px ${hasI ? colors.brand : colors.line}`, opacity: hasI ? 1 : 0.5, transition: tween }}
            >
              i = {hasI ? st?.i : '?'}
            </div>
            <ListBoxes items={list} size="md" width={72} name="list_a" states={hasI ? { [list.length - 1]: 'new' } : {}} empty="empty" lane={false} />
          </div>
          <OutPanel lines={printed} minRows={2} fontSize={20} width={300} />
          <Show on={beat >= 7}>
            <p className="text-[17px] font-semibold" style={{ color: colors.body }}>
              A new box joins the end, and the old boxes do not move
            </p>
          </Show>
        </div>
      </div>
      <StepControls at={beat} total={7} />
    </>
  )
}
