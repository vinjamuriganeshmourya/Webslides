import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { CodeBlock, Countdown, TraceCaption, TracePanel, VarTrail, useBeats, type TraceBeat } from '@/ui'
import { StepControls } from './controls'
import { OutputPanel } from '@/ui/CodeOutput'
import { Boxes, glyph, type BoxState } from './common'

/**
 * THE THREE WORKSHEET TASKS the room does in the playground. PF 15 slides 12,
 * 21 and 25, matching the student handout's tasks 2, 3 and 4 (task 1 is the
 * slice machine's first three levels, and the machine says so).
 *
 * Every one carries the reference's timer (`Countdown`: nothing starts until
 * the instructor presses play) and its instruction to write before running.
 * Every code panel says `Python` (content rule 31).
 */

/**
 * Right-hand instruction column: a lead sentence, the list, then the timer.
 *
 * `numbered` lists carry their number as the marker, in a hanging column, and
 * no dot: a dot AND a number is two markers for one item (review, 2026-10-01,
 * slide 12). `after` sits beside the timer rather than under it, so the column
 * stays short enough to clear the Next and Replay buttons (slide 21).
 */
function Brief({
  lead,
  items,
  seconds,
  after,
  numbered = false,
}: {
  lead: ReactNode
  items: ReactNode[]
  seconds: number
  after?: ReactNode
  numbered?: boolean
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4 [&_b]:font-bold [&_b]:text-ink">
      <p className="text-[20px] leading-snug" style={{ color: colors.body }}>{lead}</p>
      <ol className="flex flex-col gap-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-3 text-[18px] leading-snug" style={{ color: colors.body }}>
            {numbered ? (
              <b className="w-5 shrink-0">{i + 1}.</b>
            ) : (
              <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: colors.brand }} />
            )}
            <span>{it}</span>
          </li>
        ))}
      </ol>
      <div className="flex items-center gap-5">
        <Countdown seconds={seconds} />
        {after}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ task 2 */

const T2 = 'code = "a1b2c3d4"\nprint(code[1:8:2])'

export function TypeItTask() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-10">
        <div className="flex w-[520px] shrink-0 flex-col gap-4">
          <CodeBlock code={T2} filename="Python" chip={false} fontSize={21} lines={{ 2: 'mark' }} />
          <Boxes chars={[...'a1b2c3d4']} size="sm" />
          <p className="text-[18px]" style={{ color: colors.muted }}>Worksheet tab and the playground only. Nothing else open.</p>
        </div>
        <Brief
          lead={
            <>
              Type it, run it, then make <b>two changes</b>. Write what you expect <b>before</b> each run.
            </>
          }
          numbered
          items={[
            <>Type it as it is and run it.</>,
            <>
              I want the letters instead of the digits. <b>Change one number</b> on line 2. Write what it will print, then run.
            </>,
            <>
              Now try <code className="font-mono">code[1:8:-2]</code>. Write what you think happens, then run.
            </>,
          ]}
          seconds={240}
        />
      </div>
      <TraceCaption tone="warn">
        <b>Write first, run second.</b> A prediction you make after the run is not a prediction.
      </TraceCaption>
    </div>
  )
}

/* ------------------------------------------------------------------ task 3 */

const T3 = 'pin = "  0912  "\npin = pin.strip()\npin = pin.strip("0")\nif pin.isdigit():\n    print(pin[0:4:2])\nelse:\n    print("no")'
const PIN = [...'  0912  ']

/** pin's boxes, what pin has held, and what has printed, at one moment of the run. */
function PinState({ gone, hit = [], held, out }: { gone: number[]; hit?: number[]; held: string[]; out: string }) {
  const states: Record<number, BoxState> = {}
  gone.forEach((i) => (states[i] = 'gone'))
  hit.forEach((i) => (states[i] = 'hit'))
  return (
    <>
      <Boxes chars={PIN} size="sm" indices={false} states={states} />
      <VarTrail name="pin" values={held.map((h) => [...h].map(glyph).join(''))} />
      <OutputPanel output={out} fontSize={20} height={104} />
    </>
  )
}

const H1 = ['  0912  ']
const H2 = [...H1, '0912']
const H3 = [...H2, '912']

const T3_BEATS: TraceBeat[] = [
  {
    caption: (
      <>
        <b>Worksheet task 3</b> Fill the table yourself first. Nothing here moves until hands are off keyboards.
      </>
    ),
    aside: (
      <Brief
        lead={
          <>
            Open <b>worksheet task 3</b>. Fill every row of the table by hand before you run anything.
          </>
        }
        items={[
          'One row per line of the program, in the order the machine runs them.',
          <>
            Write what <b>pin</b> holds after that line.
          </>,
          'Write what that line printed, if it printed anything.',
          'Leave a row empty if that line never runs.',
        ]}
        seconds={240}
        after={
          <p className="text-[16px] leading-snug" style={{ color: colors.muted }}>
            <b>Do not run it yet.</b> The playground is where you check, not where you start.
          </p>
        }
      />
    ),
  },
  {
    lines: { 1: 'now' },
    caption: (
      <>
        <b>Line 1</b> pin holds eight characters. The grey dots are the two spaces at each end.
      </>
    ),
    aside: <PinState gone={[]} held={H1} out="" />,
  },
  {
    lines: { 1: 'ran', 2: 'now' },
    caption: (
      <>
        <b>Line 2</b> strip with nothing in the brackets takes spaces off each end. On the left it stops at 0, on the right it stops at 2.
      </>
    ),
    aside: <PinState gone={[0, 1, 6, 7]} held={H2} out="" />,
  },
  {
    lines: { 1: 'ran', 2: 'ran', 3: 'now' },
    caption: (
      <>
        <b>Line 3</b> strip("0") takes the 0 off the left. On the right it meets 2, which is not a 0, so it stops there and looks no further.
      </>
    ),
    aside: <PinState gone={[0, 1, 2, 6, 7]} held={H3} out="" />,
  },
  {
    lines: { 1: 'ran', 2: 'ran', 3: 'ran', 4: 'now' },
    caption: (
      <>
        <b>Line 4</b> Everything left is a digit, so isdigit gives True and line 5 runs.
      </>
    ),
    aside: <PinState gone={[0, 1, 2, 6, 7]} held={H3} out="" />,
  },
  {
    lines: { 1: 'ran', 2: 'ran', 3: 'ran', 4: 'ran', 5: 'now' },
    caption: (
      <>
        <b>Line 5</b> The slice starts at 0 and jumps two, so it lands on the first and the third of what is left.
      </>
    ),
    aside: <PinState gone={[0, 1, 2, 6, 7]} hit={[3, 5]} held={H3} out="92" />,
  },
  {
    lines: { 1: 'ran', 2: 'ran', 3: 'ran', 4: 'ran', 5: 'ran', 6: 'dead', 7: 'dead' },
    caption: (
      <>
        <b>Lines 6 and 7</b> Neither of them ever ran. The else belongs to a question that was already answered yes, so it is skipped and it stays skipped.
      </>
    ),
    aside: <PinState gone={[0, 1, 2, 6, 7]} hit={[3, 5]} held={H3} out="92" />,
  },
]

export function TraceTask() {
  return <TracePanel code={T3} rows={7} beats={T3_BEATS} />
}

/* ------------------------------------------------------------------ task 4 */

const T4_GIVEN = 'url = "https://onthegomodel.com"\nis_secure = url.startswith("https://")\nprint(is_secure)'
const T4_ANSWER = 'email = "rahul123@gmail.com"\nis_gmail = email.endswith("@gmail.com")\nprint(is_gmail)'

export function WriteItTask() {
  const beat = useBeats(2)
  return (
    <>
      <div className="flex items-start gap-10 [&_b]:font-bold [&_b]:text-ink">
        <div className="flex w-[540px] shrink-0 flex-col gap-4">
          <CodeBlock code={T4_GIVEN} filename="Python" chip={false} fontSize={19} lines={{ 2: 'mark' }} />
          <p className="text-[18px]" style={{ color: colors.muted }}>
            That one is the card we have just done. It checks the <b>front</b> of the string.
          </p>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {beat === 1 ? (
            <>
              <p className="text-[20px] leading-snug" style={{ color: colors.body }}>
                An email id is a Gmail id when it <b>ends</b> with <code className="font-mono">@gmail.com</code>.
              </p>
              <p className="text-[20px] leading-snug" style={{ color: colors.body }}>
                <b>Worksheet task 4.</b> Write the three lines that check it, then type them in and run them.
              </p>
              <div className="flex flex-col gap-3 rounded-card px-5 py-4" style={{ border: `2px dashed ${colors.line}`, background: 'rgba(255,255,255,0.6)' }}>
                <span className="text-[18px] font-semibold" style={{ color: colors.muted }}>your three lines</span>
                {[78, 100, 60].map((w) => (
                  <span key={w} className="block h-3 rounded-full" style={{ width: `${w}%`, background: colors.surface2 }} />
                ))}
              </div>
              <Countdown seconds={120} />
            </>
          ) : (
            <>
              <CodeBlock code={T4_ANSWER} filename="Python" chip={false} fontSize={19} lines={{ 2: 'mark' }} />
              <p className="text-[20px] leading-snug" style={{ color: colors.body }}>
                One word changed. Both of them answer a question, so both hand back <b>True</b> or <b>False</b>.
              </p>
              <p className="text-[20px] leading-snug" style={{ color: colors.body }}>
                With <code className="font-mono">rahul123@gmail.com</code> it prints <b>True</b>. With a yahoo address it prints <b>False</b>.
              </p>
            </>
          )}
        </div>
      </div>
      <StepControls at={beat} total={2} />
    </>
  )
}
