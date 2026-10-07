import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { Glow } from './motion'
import { Ask, sentences } from './pieces'
import { CodePane } from './trace'
import { SPEC } from './spec'

/**
 * RECAP: ONE LINE 3 AT A TIME. Spec card S-RECAP, seven presses.
 *
 * The program with line numbers and line 3 as a blank, and three empty dashed
 * output boxes, all there from press 1 (its must line). Each pair of presses
 * fills one line 3 (the code becomes that program, line 3 lit) and then its
 * box: the output and the why line under it. A box keeps its answer once
 * shown. Every program and output is the spec's data, run on CPython.
 */
const R = SPEC['S-RECAP']
type Item = { line3: string; src: string; prints: string; why: string }
const ITEMS: Item[] = R.data.items
/* the program with line 3 left blank: the first item's lines 1, 2 and 4 */
const BLANK = ITEMS[0].src
  .split('\n')
  .map((l, i) => (i === 2 ? '' : l))
  .join('\n')

function OutBox({ n, item, asked, shown }: { n: number; item: Item; asked: boolean; shown: boolean }) {
  const tween = useTween(420)
  return (
    <Glow on={shown} color={colors.success}>
      <div
        className="flex min-h-[100px] flex-col gap-1.5 rounded-card px-4 py-2.5"
        style={{
          background: shown ? colors.white : 'transparent',
          boxShadow: shown ? `inset 0 0 0 1.5px ${colors.line}, 0 6px 14px -8px rgba(16,32,58,0.16)` : 'none',
          border: shown ? '2px solid transparent' : `2px dashed ${colors.line}`,
          transition: tween,
        }}
      >
        <div className="flex items-center gap-3">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[13px] font-bold" style={{ background: asked ? colors.brandDark : colors.surface2, color: asked ? colors.white : colors.muted, transition: tween }}>
            {n}
          </span>
          <span className="font-mono text-[16px] font-semibold" style={{ color: colors.body, opacity: asked ? 1 : 0, transition: tween }}>
            line 3: {item.line3}
          </span>
        </div>
        <div className="flex items-start gap-4" style={{ opacity: shown ? 1 : 0, transform: shown ? 'none' : 'translateY(6px)', transition: tween }}>
          <span className="shrink-0 rounded-md px-3 py-1 font-mono text-[20px] font-bold" style={{ background: `${colors.success}14`, color: colors.ink, boxShadow: `inset 0 0 0 1.5px ${colors.success}` }}>
            {item.prints}
          </span>
          <span className="text-[16px] font-semibold leading-snug" style={{ color: colors.body }}>
            <Lines lines={sentences(item.why)} />
          </span>
        </div>
      </div>
    </Glow>
  )
}

export function RecapLine3() {
  const beat = useBeats(7)
  /* beats 2, 4, 6 ask item 0, 1, 2; beats 3, 5, 7 show it */
  const asking = beat >= 2 ? Math.floor((beat - 2) / 2) : -1
  const answered = Math.floor((beat - 1) / 2) /* items 0..answered-1 shown */
  const cur = asking >= 0 ? ITEMS[asking] : null
  return (
    <>
      <div className="flex items-start gap-8">
        <div className="flex w-[470px] shrink-0 flex-col gap-4">
          <CodePane code={cur ? cur.src : BLANK} highlight={cur ? 3 : undefined} gap={cur ? undefined : 3} fontSize={19} rows={4} />
          <Ask size={24}>
            <Lines lines={sentences(R.show[0])} />
          </Ask>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {ITEMS.map((it, i) => (
            <OutBox key={i} n={i + 1} item={it} asked={asking >= i} shown={answered > i} />
          ))}
        </div>
      </div>
      <StepControls at={beat} total={7} />
    </>
  )
}
