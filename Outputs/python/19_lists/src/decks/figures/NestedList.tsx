import { colors } from '@/design/tokens'
import { CodeBlock, useBeats } from '@/ui'
import { StepControls } from './controls'
import { Ask, ListBoxes, Show } from './pieces'
import { LIST_A } from './MakeList'

/**
 * A LIST INSIDE A LIST. Spec card C3, from deck slide 16.
 *
 * The code, the question, then the output with the outer and the inner
 * brackets in two colours and the drawing: a box holding a smaller row. Nothing
 * here counts the items of list_b; C4 asks the room to predict that (the
 * spec's must-not line), so the inner row carries no positions.
 */
const CODE = 'a = 2\nlist_a = [5, "Six", a, 8.2]\nlist_b = [1, list_a]\nprint(list_b)'

/** The output with its two pairs of brackets coloured: outer in the brand's dark blue, inner in the accent. */
export function TwoBrackets({ size = 24 }: { size?: number }) {
  const outer: { color: string; background: string } = { color: colors.brandDark, background: colors.surface2 }
  const inner: { color: string; background: string } = { color: colors.accentDark, background: '#FFF4EC' }
  const B = ({ ch, tone }: { ch: string; tone: { color: string; background: string } }) => (
    <span className="rounded-[4px] px-[3px] font-bold" style={tone}>
      {ch}
    </span>
  )
  return (
    <span className="font-mono" style={{ fontSize: size, color: colors.ink, whiteSpace: 'pre' }}>
      <B ch="[" tone={outer} />1, <B ch="[" tone={inner} />5, 'Six', 2, 8.2<B ch="]" tone={inner} />
      <B ch="]" tone={outer} />
    </span>
  )
}

/** list_b drawn: the box `1`, then a box that holds all of list_a, small, inside it. */
export function NestedBoxes({ size = 'md', labels }: { size?: 'md' | 'sm'; labels?: string[] }) {
  const h = size === 'md' ? 54 : 44
  const inner = size === 'md' ? 'sm' : 'sm'
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <span className="grid place-items-center rounded-xl bg-white font-mono font-semibold" style={{ width: h + 10, height: h + 24, fontSize: size === 'md' ? 19 : 16, color: colors.ink, border: `2px solid ${colors.brandDark}` }}>
          1
        </span>
        {labels && <span className="mt-1.5 font-mono text-[16px] font-semibold" style={{ color: colors.body }}>{labels[0]}</span>}
      </div>
      <div className="flex flex-col items-center">
        <span className="grid place-items-center rounded-xl px-2.5" style={{ height: h + 24, border: `2px solid ${colors.brandDark}`, background: 'rgba(255,255,255,0.7)' }}>
          <ListBoxes items={LIST_A} size={inner} width={size === 'md' ? 64 : 56} positions={false} states={{ 0: 'mark', 1: 'mark', 2: 'mark', 3: 'mark' }} lane={false} />
        </span>
        {labels && <span className="mt-1.5 font-mono text-[16px] font-semibold" style={{ color: colors.body }}>{labels[1]}</span>}
      </div>
    </div>
  )
}

export function NestedList() {
  const beat = useBeats(2)
  return (
    <>
      <div className="flex items-start gap-10">
        <div className="flex w-[560px] shrink-0 flex-col gap-4">
          <CodeBlock code={CODE} filename="Python" chip={false} fontSize={18} rows={4} lines={{ 3: 'mark' }} />
          <Ask>What does print(list_b) show?</Ask>
        </div>
        <Show on={beat >= 2} className="flex min-w-0 flex-1 flex-col gap-5">
          <div className="overflow-hidden rounded-card border border-line bg-white" style={{ boxShadow: '0 1px 2px rgba(16,32,58,0.07), 0 6px 14px -6px rgba(16,32,58,0.13)' }}>
            <div className="flex items-center gap-2.5 border-b border-line px-4 py-1.5" style={{ background: `${colors.success}14` }}>
              <span className="inline-block h-3 w-3 rounded-full" style={{ background: colors.success }} />
              <span className="font-heading text-[16px] font-bold uppercase tracking-wider" style={{ color: colors.body }}>Output</span>
            </div>
            <div className="px-4 py-3">
              <TwoBrackets />
            </div>
          </div>
          <NestedBoxes />
          <p className="text-[17px] font-semibold" style={{ color: colors.body }}>
            The whole of list_a sits inside list_b
          </p>
        </Show>
      </div>
      <StepControls at={beat} total={2} />
    </>
  )
}
