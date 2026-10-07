import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { CodeBlock, OutputPanel, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Speaker } from './Characters'
import { Glow } from './motion'
import { ArrowRight, FnBox, Tile } from './tiles'

/**
 * PRINTING A TO Z WITH A LOOP. PF 18 slide 11.
 *
 * The loop walks 65 to 90 and chr turns each number into its letter. Three
 * things move together on each press (content rule 6): the value in the
 * `unicode_value` trail, the tile through the `chr( )` box, and the line that
 * lands in the output. Five beats: the ask, 65, 66, 67, then all the way to 90.
 */
const CODE = 'for unicode_value in range(65, 91):\n    print(chr(unicode_value))'
const STEPS = [
  { n: 65, ch: 'A' },
  { n: 66, ch: 'B' },
  { n: 67, ch: 'C' },
  { n: 90, ch: 'Z' },
]

const PC: Record<number, ReactNode> = {
  1: <>Easy. I walk from <b>65</b> to <b>90</b><br />chr turns each into a letter</>,
  2: <><b>65</b> is A<br />Print it</>,
  3: <><b>66</b> is B<br />Print it</>,
  4: <><b>67</b> is C<br />Print it</>,
  5: <>... all the way to <b>90</b>: <b>Z</b><br />range stops before 91</>,
}

export function PrintLoop() {
  const beat = useBeats(5)
  const tween = useTween(420)
  const k = beat - 2 // the step on screen, -1 before the run
  const cur = k >= 0 ? STEPS[Math.min(k, 3)] : null
  const out = k < 0 ? ' ' : k < 3 ? STEPS.slice(0, k + 1).map((s) => s.ch).join('\n') : 'A\nB\nC\n...\nZ'
  return (
    <>
      <div className="flex items-start gap-8">
        <div className="flex w-[560px] shrink-0 flex-col gap-3">
          <CodeBlock code={CODE} filename="Python" chip={false} fontSize={17} rows={2} />
          {/* the trail: every value unicode_value has held, the spent ones struck */}
          <div className="rounded-2xl bg-white px-4 py-2.5" style={{ border: `1.5px solid ${colors.line}`, boxShadow: '0 6px 24px -10px rgba(0,37,75,0.16)' }}>
            <p className="font-mono text-[16px] font-bold" style={{ color: colors.body }}>unicode_value</p>
            <div className="flex h-[36px] items-center gap-5 font-mono text-[24px] font-bold">
              {STEPS.map((s, i) => {
                const seen = k >= i || (i === 3 && k >= 3)
                const spent = k > i && !(i === 3)
                return (
                  <span key={s.n} className="flex items-center gap-5">
                    {i === 3 && <span className="text-[18px]" style={{ color: colors.muted, opacity: k >= 3 ? 1 : 0, transition: tween }}>...</span>}
                    <span style={{ color: spent ? colors.danger : colors.brandDark, textDecoration: spent ? 'line-through' : 'none', opacity: seen ? 1 : 0, transition: tween }}>
                      {s.n}
                    </span>
                  </span>
                )
              })}
            </div>
          </div>
          <div className="flex items-start justify-between pt-1">
            <div className="flex items-center gap-3">
              <Tile size="md" ch={cur ? cur.n : ''} showCode={false} state={cur ? 'num' : 'empty'} />
              <ArrowRight width={36} />
              <FnBox name="chr" size={24} />
              <ArrowRight width={36} />
              <Tile size="md" ch={cur ? cur.ch : ''} showCode={false} state={cur ? 'plain' : 'empty'} />
            </div>
          </div>
          <Speaker who="anu" say={beat === 1 ? <>Can you print A to Z for me?</> : undefined} height={96} bubbleWidth={230} size={16} beatKey={beat} />
        </div>
        <Glow on={k >= 0} pulse={out} className="shrink-0">
          <OutputPanel output={out} fontSize={22} height={290} lineHeight={1.5} className="w-[200px]" />
        </Glow>
        <div className="flex min-w-0 flex-1 flex-col items-center gap-3 pt-2">
          <Speaker who="computer" look="3d" tail="over" say={PC[beat]} beatKey={beat} bubbleWidth={270} size={17} />
        </div>
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}
