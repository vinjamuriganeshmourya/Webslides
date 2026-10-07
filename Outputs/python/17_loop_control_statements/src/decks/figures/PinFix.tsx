import { colors } from '@/design/tokens'
import { CodeBlock, Countdown, TraceCaption, useBeats, useTween, type CodeLineState } from '@/ui'
import { StepControls } from './controls'
import { BeatFade, Lines } from './common'
import { Glow } from './motion'
import { Kw, PlanBox, ResultBox, TaskPill } from './pieces'
import { TryCard } from './PinStory'

/**
 * FIX IT WITH WHAT YOU KNOW. PF 17 slide 5, four clicks (feedback of
 * 2026-10-06, change 2). The room fixes the PIN bug with what it already
 * has. Both fixes work, and each costs something: fix A is three new lines
 * and a loop test with two conditions, fix B keeps the loop running and
 * going through a try that does nothing. That is move 4 of
 * `pedagogy-to-components`, the cost of the long way, and the last click is
 * move 11: the plan in indented plain English, with the one arrow that is
 * today's idea. The word `break` is not on this frame.
 *
 * One code panel, whose program changes with the click: the bug, fix A,
 * fix B, the bug again under the plan (each plan line maps to one line of
 * the loop the app has, and the arrow leaves from the line the code is
 * missing). What a fix added is chipped ON the lines (course rule R5c item
 * 6). Both fixes are real runs (CPython 3.12.3): for 1111, 4821 each prints
 * `Incorrect PIN`, `Payment successful` and nothing more.
 */
const BUG = 'correct_pin = "4821"\nfor attempt in range(3):\n    pin = input()\n    if pin == correct_pin:\n        print("Payment successful")\n    else:\n        print("Incorrect PIN")'
const FIX_A = 'correct_pin = "4821"\nattempt = 0\npin = ""\nwhile attempt < 3 and pin != correct_pin:\n    pin = input()\n    attempt = attempt + 1\n    if pin == correct_pin:\n        print("Payment successful")\n    else:\n        print("Incorrect PIN")'
const FIX_B = 'correct_pin = "4821"\npaid = False\nfor attempt in range(3):\n    if paid == False:\n        pin = input()\n        if pin == correct_pin:\n            print("Payment successful")\n            paid = True\n        else:\n            print("Incorrect PIN")'

interface View {
  label: string
  code: string
  lines?: Record<number, CodeLineState>
  chips?: { line: number; text: string }[]
}

const VIEWS: View[] = [
  { label: 'What the app runs', code: BUG },
  {
    label: 'Fix A · a while loop with two conditions',
    code: FIX_A,
    lines: { 2: 'mark', 3: 'mark', 4: 'mark', 6: 'mark' },
    chips: [
      { line: 2, text: 'added' },
      { line: 3, text: 'added' },
      { line: 4, text: 'two conditions' },
      { line: 6, text: 'added' },
    ],
  },
  {
    label: 'Fix B · a paid variable',
    code: FIX_B,
    lines: { 2: 'mark', 4: 'mark', 8: 'mark' },
    chips: [
      { line: 2, text: 'added' },
      { line: 4, text: 'added' },
      { line: 8, text: 'added' },
    ],
  },
  { label: 'What the app runs', code: BUG, lines: { 5: 'mark' } },
]

const FONT = 16
const ROW_H = Math.round(FONT * 1.55)
const BAR = 45
const PAD = 16
const CHIP_H = 22
const ROWS = 10
const PRINTS = 'Incorrect PIN\nPayment successful'

function Chip({ line, text, on }: { line: number; text: string; on: boolean }) {
  const tween = useTween(360)
  return (
    <span
      className="pointer-events-none absolute right-3 inline-flex items-center rounded-pill px-2.5 font-body text-[13.5px] font-bold text-white"
      style={{ top: BAR + PAD + (line - 1) * ROW_H + ROW_H / 2 - CHIP_H / 2, height: CHIP_H, background: colors.brand, opacity: on ? 1 : 0, transform: on ? 'scale(1)' : 'scale(0.7)', transition: tween }}
    >
      {text}
    </span>
  )
}

export function PinFix() {
  const beat = useBeats(4)
  const view = VIEWS[beat - 1]
  return (
    <>
      <div className="flex items-start gap-8">
        <div className="flex w-[600px] shrink-0 flex-col gap-1.5">
          <span className="h-[22px] text-[16px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
            {view.label}
          </span>
          <div className="relative">
            <CodeBlock code={view.code} filename="Python" chip={false} fontSize={FONT} rows={ROWS} lines={view.lines} />
            {view.chips?.map((c) => (
              <Chip key={`${beat}-${c.line}`} line={c.line} text={c.text} on />
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {beat === 1 && (
            <BeatFade beatKey="brief" className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <TaskPill>Fix it</TaskPill>
                <Countdown seconds={120} />
              </div>
              <p className="text-[22px] font-semibold leading-snug" style={{ color: colors.ink }}>
                <Lines lines={['Fix it with what you know', 'Pairs, on paper']} />
              </p>
            </BeatFade>
          )}
          {(beat === 2 || beat === 3) && (
            <BeatFade beatKey={beat} className="flex flex-col gap-3">
              <Glow on color={colors.success}>
                <ResultBox label="It prints" value={PRINTS} on tone="good" size={19} height={92} />
              </Glow>
              {beat === 3 && (
                <div className="grid grid-cols-3 gap-2.5" style={{ width: 410 }}>
                  <TryCard title="Try 1" text="wrong PIN" color={colors.danger} icon="✕" />
                  <TryCard title="Try 2" text="paid" color={colors.success} icon="✓" />
                  <TryCard title="Try 3" text="does nothing" color={colors.muted} dashed faded />
                </div>
              )}
              <TraceCaption>
                <Lines lines={beat === 2 ? ['It works', 'Three new lines, and the test has two conditions'] : ['It works', 'Try 3 still runs, and does nothing']} />
              </TraceCaption>
            </BeatFade>
          )}
          {beat === 4 && (
            <BeatFade beatKey="plan" className="flex flex-col gap-4">
              <p className="text-[21px] font-bold leading-snug" style={{ color: colors.brandDark }}>One line that says leave now, right here</p>
              <PlanBox
                lines={[
                  { kind: 'head', indent: 0, text: <><Kw>every try</Kw>, up to 3:</> },
                  { kind: 'chip', indent: 1, text: 'ask for the UPI PIN' },
                  { kind: 'test', indent: 1, text: <><Kw>if</Kw> the PIN is right:</> },
                  { kind: 'go', indent: 2, text: 'pay, then leave straight away' },
                  { kind: 'chip', indent: 0, text: 'show the receipt' },
                ]}
                arrow={{ kind: 'leave', label: 'leave now' }}
              />
            </BeatFade>
          )}
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}
