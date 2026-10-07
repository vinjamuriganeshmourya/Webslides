import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { Memory, type MNode, type MRef, type MTag } from './memory'
import { sentences } from './pieces'
import { SPEC } from './spec'

/**
 * KEY TAKEAWAYS: TODAY, IN SIX EXAMPLES. Spec card K1, six presses.
 *
 * Six real programs from the session, each with what it prints and the rule
 * it shows: examples, not a concept map (its must line). All six slots are
 * there from press 1, empty, numbered; each press fills one with its heading,
 * its code, a small tags-and-rows picture, its result and its sentence. Code
 * and results are the spec's (each run on CPython; plan, outputs table).
 * Two names on one list are two tags with arrows into ONE row.
 */
const K1 = SPEC.K1
type Ex = { file: string; src: string; output: string }
const EXAMPLES: Ex[] = K1.code
/* the spec's `show` pairs each heading with its sentence: heading, sentence, heading, … */
const SENTENCES: string[] = (K1.show as string[]).filter((_, i) => i % 2 === 1)

const RX = 95
const BW = 28
const row = (id: string, y: number, items: (string | { ref: string })[], hot: number[] = []): MNode => ({ id, kind: 'row', x: RX, y, items, size: 'xs', boxW: BW, hot })
const tag = (name: string, y: number, to: string): MTag => ({ name, x: 0, y, to })

/* The picture after each example's last line: one shared row, or two rows. */
const PICTURES: { nodes: MNode[]; tags: MTag[]; refs?: MRef[] }[] = [
  { nodes: [row('L1', 26, ['1', '2'])], tags: [tag('list_a', 0, 'L1'), tag('list_b', 54, 'L1')] },
  { nodes: [row('L1', 26, ['9', '2'], [0])], tags: [tag('list_a', 0, 'L1'), tag('list_b', 54, 'L1')] },
  { nodes: [row('L2', 0, ['6', '7']), row('L1', 50, ['1', '2'])], tags: [tag('list_a', 3, 'L2'), tag('list_b', 53, 'L1')] },
  { nodes: [row('L2', 0, ['1', '2', '6']), row('L1', 50, ['1', '2'])], tags: [tag('list_a', 3, 'L2'), tag('list_b', 53, 'L1')] },
  { nodes: [row('L1', 26, ['1', '2', '6'])], tags: [tag('list_a', 0, 'L1'), tag('list_b', 54, 'L1')] },
  { nodes: [row('L1', 0, ['1', '4'], [1]), row('L2', 50, ['3', { ref: 'L1' }])], tags: [tag('list_a', 3, 'L1'), tag('list_b', 53, 'L2')], refs: [{ from: 'L2', slot: 1, to: 'L1' }] },
]

function MiniCode({ src }: { src: string }) {
  return (
    <div className="relative w-[226px] shrink-0 rounded-lg px-3 pb-2 pt-4" style={{ background: colors.night2 }}>
      <span className="absolute right-2 top-1 text-[11px] font-semibold" style={{ color: colors.muted }}>
        Python
      </span>
      {/* one element per line, so a line is measured as a line, never as one wrapped token */}
      <div className="font-mono text-[11.5px] leading-[16px]" style={{ color: colors.white }}>
        {src.split('\n').map((l, i) => (
          <div key={i} className="whitespace-pre">
            {l}
          </div>
        ))}
      </div>
    </div>
  )
}

function Slot({ n, ex, filled }: { n: number; ex: Ex; filled: boolean }) {
  const tween = useTween(480)
  const pic = PICTURES[n]
  return (
    <div
      className="relative flex h-[128px] flex-col gap-1.5 rounded-card px-3 py-2"
      style={{
        background: filled ? colors.white : 'transparent',
        boxShadow: filled ? `inset 0 0 0 1.5px ${colors.line}, 0 6px 14px -8px rgba(16,32,58,0.16)` : `inset 0 0 0 2px ${colors.line}`,
        border: filled ? 'none' : `0px`,
        transition: tween,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[13px] font-bold" style={{ background: filled ? colors.brandDark : colors.surface2, color: filled ? colors.white : colors.muted }}>
          {n + 1}
        </span>
        <span className="font-heading text-[16px] font-bold leading-none" style={{ color: colors.ink, opacity: filled ? 1 : 0, transition: tween }}>
          {ex.file}
        </span>
      </div>
      <div className="flex items-start gap-3" style={{ opacity: filled ? 1 : 0, transform: filled ? 'none' : 'translateY(6px)', transition: tween }}>
        {filled && (
          <>
            <MiniCode src={ex.src} />
            <Memory width={176} height={84} nodes={pic.nodes} tags={pic.tags} refs={pic.refs} size="xs" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="self-start rounded-md px-2 py-0.5 font-mono text-[14px] font-bold" style={{ background: `${colors.success}1A`, color: colors.ink, boxShadow: `inset 0 0 0 1.5px ${colors.success}` }}>
                {ex.output}
              </span>
              <span className="text-[14px] font-semibold leading-snug" style={{ color: colors.body }}>
                <Lines lines={sentences(SENTENCES[n])} />
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function Takeaways() {
  const beat = useBeats(6)
  return (
    <>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
        {EXAMPLES.map((ex, i) => (
          <Slot key={ex.file} n={i} ex={ex} filled={beat >= i + 1} />
        ))}
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}
