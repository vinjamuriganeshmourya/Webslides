import { colors } from '@/design/tokens'
import { CodeBlock, TraceCaption, useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { BeatFade, Lines } from './common'
import { ResultBox } from './pieces'

/**
 * BREAK OUTSIDE A LOOP. PF 17 slide 10, four beats: predict; which lines are
 * inside the loop and which is not, labelled ON the lines (course rule R5c
 * item 6); the error; the same with continue.
 *
 * The labels are chips inside the code panel, placed on the kit panel's own
 * row grid (title bar 45px, padding 16px, a 17px row is round(17 x 1.55) =
 * 26px), the way session 16 drew its Block chips: the kit's `labels` prop
 * draws leader lines outside the box, which read as stray lines.
 *
 * Both errors are real (CPython 3.12.3): `SyntaxError: 'break' outside loop`
 * and `SyntaxError: 'continue' not properly in loop`. Nothing prints first.
 */
const A = 'for i in range(10):\n    print(i)\nbreak\nprint("End")'
const B = 'for i in range(10):\n    print(i)\ncontinue\nprint("End")'

const FONT = 17
const ROW_H = Math.round(FONT * 1.55)
const BAR = 45
const PAD = 16
const CHIP_H = 22

function Chip({ line, text, bg, on }: { line: number; text: string; bg: string; on: boolean }) {
  const tween = useTween(360)
  return (
    <span
      className="pointer-events-none absolute right-3 inline-flex items-center rounded-pill px-2.5 font-body text-[13.5px] font-bold text-white"
      style={{ top: BAR + PAD + (line - 1) * ROW_H + ROW_H / 2 - CHIP_H / 2, height: CHIP_H, background: bg, opacity: on ? 1 : 0, transform: on ? 'scale(1)' : 'scale(0.7)', transition: tween }}
    >
      {text}
    </span>
  )
}

const CAPTIONS: string[][] = [
  [],
  ['Line 3 starts at the left edge', 'So break is not inside the loop'],
  ['Python checks the whole file before line 1 runs', 'It finds the mistake and runs nothing', 'Not even 0'],
  ['continue is the same', 'break and continue work only inside a loop'],
]

export function OutsideLoop() {
  const beat = useBeats(4)
  const tween = useTween(420)
  const marked = beat >= 2
  return (
    <>
      <div className="flex items-start gap-7">
        <div className="flex w-[620px] shrink-0 flex-col gap-4">
          <div className="relative">
            <CodeBlock code={A} filename="Python" chip={false} fontSize={FONT} rows={4} lines={marked ? { 1: 'ran', 2: 'ran', 3: 'error' } : undefined} />
            <Chip line={1} text="inside the loop" bg={colors.brand} on={marked} />
            <Chip line={2} text="inside the loop" bg={colors.brand} on={marked} />
            <Chip line={3} text="outside the loop" bg={colors.danger} on={marked} />
          </div>
          <div className="relative" style={{ opacity: beat >= 4 ? 1 : 0.4, transition: tween }}>
            <CodeBlock code={B} filename="Python" chip={false} fontSize={FONT} rows={4} lines={beat >= 4 ? { 3: 'error' } : undefined} />
            <Chip line={3} text="outside the loop" bg={colors.danger} on={beat >= 4} />
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3 pt-1">
          <p className="text-[22px] leading-snug [&_code]:rounded [&_code]:bg-surface-2 [&_code]:px-1.5 [&_code]:font-mono [&_code]:text-[20px] [&_code]:font-bold" style={{ color: colors.body }}>
            <Lines
              lines={[
                <>
                  Line 3 is <code style={{ color: colors.danger }}>break</code>
                </>,
                'What will this print?',
              ]}
            />
          </p>
          {/* 16px: the longer error is 44 characters and must sit on one line in the 502px column */}
          <ResultBox label="With break, it prints" value="SyntaxError: 'break' outside loop" on={beat >= 3} tone="bad" size={16} />
          <ResultBox label="With continue, it prints" value="SyntaxError: 'continue' not properly in loop" on={beat >= 4} tone="bad" size={16} />
          {beat >= 2 && (
            <BeatFade beatKey={beat}>
              <TraceCaption>
                <Lines lines={CAPTIONS[beat - 1]} />
              </TraceCaption>
            </BeatFade>
          )}
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}
