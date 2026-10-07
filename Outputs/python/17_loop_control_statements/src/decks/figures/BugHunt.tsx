import { colors } from '@/design/tokens'
import { CodeBlock, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { ResultBox } from './pieces'

/**
 * RECAP OF NESTED LOOPS: ONE LINE IS WRONG. PF 17 slide 3, the reference's
 * "bug" recap format, three presses on `Show me`.
 *
 * The room writes the line number down first. Press 1 shows what the program
 * really prints; press 2 marks the line and says why; press 3 shows what it
 * should have printed. The answer is never on screen before the room has
 * committed (move 6 of `pedagogy-to-components`).
 *
 * Real runs (CPython 3.12.3): as written it prints an empty line, `1`, `21`;
 * with `seq_num = n - row_num` it prints `321`, `21`, `1`.
 */
const CODE = 'n = 3\nfor row_num in range(0, n):\n    row_output = ""\n    seq_num = row_num\n    while seq_num > 0:\n        row_output = row_output + str(seq_num)\n        seq_num = seq_num - 1\n    print(row_output)'

export function BugHunt() {
  const beat = useBeats(4)
  const tween = useTween(420)
  const why = beat >= 3
  return (
    <>
      <div className="flex items-start gap-7">
        <div className="w-[640px] shrink-0">
          <CodeBlock code={CODE} filename="Python" chip={false} fontSize={17} rows={8} lines={why ? { 4: 'error' } : undefined} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <ResultBox label="It prints" value="(empty) / 1 / 21" on={beat >= 2} tone="bad" height={92} />
          <ResultBox label="It should print" value="321 / 21 / 1" on={beat >= 4} tone="good" height={92} />
          <p
            className="text-[18px] leading-snug [&_code]:rounded [&_code]:bg-surface-2 [&_code]:px-1 [&_code]:font-mono [&_code]:text-[16px] [&_code]:font-semibold"
            style={{ color: colors.body, opacity: why ? 1 : 0, transform: why ? 'none' : 'translateY(6px)', transition: tween }}
          >
            <Lines
              lines={[
                <>
                  Line 4 starts each row at <code>row_num</code>, so the rows count up: 0, 1, 2
                </>,
                <>
                  It should start at <code>n - row_num</code>
                </>,
              ]}
            />
          </p>
        </div>
      </div>
      <StepControls at={beat} total={4} nextLabel="Show me" />
    </>
  )
}
