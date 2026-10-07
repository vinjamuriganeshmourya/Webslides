import { colors } from '@/design/tokens'
import { CodeBlock, Countdown, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { OutputPanel } from '@/ui/CodeOutput'
import { Glow } from './motion'

/**
 * PREDICT, THEN RUN. PF 16 slide 17, worksheet task 2, four beats: predict,
 * program A, program B, the fixes. Two programs a line apart from the triangle
 * program, both on input 3; the room writes what each prints before the press.
 * A's missing row is drawn as a dashed hole, "the row you wanted", so the
 * mistake is a gap they can point at (the kit's `RunCompare` idea).
 *
 * The fix sits BESIDE each output rather than under it: the frame holds a
 * four-line lead, two six-line programs and two outputs, and a row more would
 * run under the controls (the first cut did, by 78px).
 *
 * Real runs (CPython 3.12.3): A prints `1 ` and `1 2 `; B prints `0 `,
 * `0 1 `, `0 1 2 `.
 */
const A = 'num = int(input())\nfor row_num in range(1, num):\n    row_out = ""\n    for seq_num in range(1, row_num + 1):\n        row_out = row_out + str(seq_num) + " "\n    print(row_out)'
const B = 'num = int(input())\nfor row_num in range(1, num + 1):\n    row_out = ""\n    for seq_num in range(row_num):\n        row_out = row_out + str(seq_num) + " "\n    print(row_out)'

function Side({ label, code, bad, out, shown, hole, fix, fixShown, tween }: { label: string; code: string; bad: number; out: string; shown: boolean; hole: boolean; fix: [string, string]; fixShown: boolean; tween: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="text-[16px] font-bold leading-tight" style={{ color: colors.brandDark }}>{label}</span>
      {/* 14px code and a fixed 112px output: with the timer row above the code
          (review, 2026-10-01) the column has 415px to the controls, and these
          two sizes are what fit it. */}
      <CodeBlock code={code} filename="Python" chip={false} fontSize={14} rows={6} lines={{ [bad]: 'warn' }} />
      <div className="flex items-start gap-3">
        <div className="w-[240px] shrink-0">
          <Glow on={shown}>
            <OutputPanel
              output={shown ? out : ' \n '}
              fontSize={14}
              lineHeight={1.2}
              height={112}
              after={
                hole && shown ? (
                  <div className="mt-1 rounded px-2 text-[12px] font-semibold leading-[18px]" style={{ border: `1.5px dashed ${colors.danger}`, color: colors.danger }}>
                    the row you wanted
                  </div>
                ) : undefined
              }
            />
          </Glow>
        </div>
        {/* beside the output: the fix, when it arrives */}
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <p className="text-[16px] leading-snug" style={{ color: colors.body, opacity: fixShown ? 1 : 0, transform: fixShown ? 'none' : 'translateY(6px)', transition: tween }}>
            <b className="text-ink">Fix: </b>
            <code className="rounded px-1 font-mono text-[15px] font-semibold" style={{ background: '#E9F8EF', color: '#137A3A' }}>{fix[0]}</code>
            <span className="block">{fix[1]}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export function TwoPrograms() {
  const beat = useBeats(4)
  const tween = useTween(420)
  return (
    <>
      <div className="flex flex-col gap-1">
        {/* the brief on the left, the timer on the right, above the code and
            right-aligned to the slide (review, 2026-10-01). "Worksheet task 2"
            is the slide's kicker now and is not repeated here. */}
        <div className="flex items-center justify-between gap-6">
          <p className="flex flex-wrap items-baseline gap-x-7 text-[17px] leading-snug" style={{ color: colors.body }}>
            <span>Both programs get input 3</span>
            <span>Type what each one prints first</span>
            <span>Then run them</span>
          </p>
          <Countdown seconds={240} />
        </div>
        <div className="flex items-start gap-5">
          <Side label="Program A" code={A} bad={2} out={'1 \n1 2 '} shown={beat >= 2} hole fix={['range(1, num + 1)', 'range stops before num']} fixShown={beat >= 4} tween={tween} />
          <Side label="Program B" code={B} bad={4} out={'0 \n0 1 \n0 1 2 '} shown={beat >= 3} hole={false} fix={['range(1, row_num + 1)', 'range with one number starts at 0']} fixShown={beat >= 4} tween={tween} />
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}
