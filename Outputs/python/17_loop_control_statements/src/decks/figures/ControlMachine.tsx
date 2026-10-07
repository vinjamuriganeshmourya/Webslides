import { useEffect, useRef, useState } from 'react'
import { colors, motionSpeed } from '@/design/tokens'
import { CodeBlock, useBeats } from '@/ui'
import { OutputPanel } from '@/ui/CodeOutput'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Confetti, Glow } from './motion'
import { HOUSE } from './pieces'

/**
 * BREAK OR CONTINUE: WHAT PRINTS? PF 17 slide 15, six levels, VOTE THEN RUN.
 *
 * Move 6 of `pedagogy-to-components`, strictly two beats per level: the vote
 * beat shows the program, the question and the four options and nothing
 * else; the run beat prints the output a line at a time, then the options
 * turn right and wrong with the reasons under the wrong ones.
 *
 * ON THE REFERENCE THE OPTIONS ARE STATIC TEXT and the room votes by hand;
 * `Next` runs with or without a pick. Here they are clickable so the vote is
 * locked in and the confetti has something to fire on, and `Next` is still
 * not gated (session 16, plan decision 5). The pick is local state; the
 * beats are the deck's build steps.
 *
 * Every output is a real run (CPython 3.12.3): the plan's output table.
 * Level 2 is a SyntaxError and prints nothing; level 5 prints 0 and never
 * stops, which is shown as the reference shows it.
 */
export interface Level {
  n: number
  name: string
  code: string
  errorLine?: number
  question: string
  /** An option is one line, or deliberate lines (an answer too long for the card, broken where the reference breaks it). */
  options: (string | string[])[]
  right: number
  output: string[]
  error?: boolean
  still?: string
  reasons: { opt: string; text: string }[]
}

const LETTERS = ['A', 'B', 'C', 'D']

export const LEVELS: Level[] = [
  {
    n: 1,
    name: 'break in a while loop',
    code: 'i = 0\nwhile i < 10:\n    if i == 2:\n        break\n    print(i)\n    i = i + 1\nprint("End")',
    question: 'What does it print?',
    options: ['0 1 2 End', '0 1', '0 1 End', '0 1 2 3 4 5 6 7 8 9 End'],
    right: 2,
    output: ['0', '1', 'End'],
    reasons: [
      { opt: '0 1 2 End', text: 'break runs before print(i), so 2 is never printed' },
      { opt: '0 1', text: 'break leaves the loop, not the program. End is outside the loop, so it still runs' },
      { opt: '0 1 2 3 4 5 6 7 8 9 End', text: 'That is the loop with no break at all' },
    ],
  },
  {
    n: 2,
    name: 'break outside a loop',
    code: 'for i in range(10):\n    print(i)\nbreak\nprint("End")',
    errorLine: 3,
    question: 'What does it print?',
    options: ['0 1 2 3 4 5 6 7 8 9 End', '0 1 2 3 4 5 6 7 8 9', '0 End', 'Error. Nothing prints'],
    right: 3,
    output: ["SyntaxError: 'break' outside loop"],
    error: true,
    reasons: [
      { opt: '0 1 2 3 4 5 6 7 8 9 End', text: 'Line 3 is not inside the loop, so there is no loop for it to leave' },
      { opt: '0 1 2 3 4 5 6 7 8 9', text: 'It does not get that far. Python checks the whole file before line 1 runs' },
      { opt: '0 End', text: 'break is not inside the loop, so it cannot cut the loop short' },
    ],
  },
  {
    n: 3,
    name: 'continue',
    code: 'for a in range(3):\n    if a == 1:\n        continue\n    print(a)\nprint("End")',
    question: 'What does it print?',
    options: ['0 End', '0 2 End', '0 1 2 End', '2 End'],
    right: 1,
    output: ['0', '2', 'End'],
    reasons: [
      { opt: '0 End', text: 'That is what break would do. continue carries on with 2' },
      { opt: '0 1 2 End', text: 'continue skips print(a) when a is 1, so 1 is missing' },
      { opt: '2 End', text: 'Only a == 1 is skipped. 0 still prints' },
    ],
  },
  {
    n: 4,
    name: 'continue comes first',
    code: 'for a in range(3):\n    continue\n    print(a)\nprint("End")',
    question: 'What does it print?',
    options: ['0 1 2 End', 'nothing', 'Error. Nothing prints', 'End'],
    right: 3,
    output: ['End'],
    reasons: [
      { opt: '0 1 2 End', text: 'continue runs first on every pass, so print(a) is never reached' },
      { opt: 'nothing', text: 'The loop still ends after 3 passes, and then End prints' },
      { opt: 'Error. Nothing prints', text: 'continue is inside the loop, so this is fine. No error' },
    ],
  },
  {
    n: 5,
    name: 'continue before the update',
    code: 'i = 0\nwhile i < 3:\n    if i == 1:\n        continue\n    print(i)\n    i = i + 1',
    question: 'What does it print?',
    options: ['0 2', '0 1 2', '0, then it never stops', '0'],
    right: 2,
    output: ['0'],
    still: '… still running. It never stops.',
    reasons: [
      { opt: '0 2', text: 'continue jumps back before i = i + 1, so i stays 1 for ever' },
      { opt: '0 1 2', text: 'When i is 1, print(i) is skipped' },
      { opt: '0', text: 'It prints 0 and then does not stop. The condition keeps being True' },
    ],
  },
  {
    n: 6,
    name: 'continue in the inner loop',
    code: 'for a in range(2):\n    for b in range(3):\n        if b == 1:\n            continue\n        print(a, b)',
    question: 'What does it print?',
    options: ['0 0 / 1 0', '0 0 / 0 2 / 1 0 / 1 2', '0 0 / 0 2', ['0 0 / 0 1 / 0 2 /', '1 0 / 1 1 / 1 2']],
    right: 1,
    output: ['0 0', '0 2', '1 0', '1 2'],
    reasons: [
      { opt: '0 0 / 1 0', text: 'That is break. continue carries on with b = 2' },
      { opt: '0 0 / 0 2', text: 'continue only skips one pass of the inner loop. The outer loop still runs a = 1' },
      { opt: '0 0 / 0 1 / 0 2 / 1 0 / 1 1 / 1 2', text: 'That is the loop with no continue' },
    ],
  },
]

const CODE_ROWS = Math.max(...LEVELS.map((l) => l.code.split('\n').length))

export function ControlMachine({ beat }: { beat: number }) {
  const instant = useInstant()
  const li = Math.min(Math.ceil(beat / 2) - 1, LEVELS.length - 1)
  const L = LEVELS[li]
  const running = beat % 2 === 0
  const [pick, setPick] = useState(-1)
  const [shown, setShown] = useState(0)
  const [done, setDone] = useState(false)
  const timers = useRef<number[]>([])
  const total = L.output.length

  useEffect(() => {
    setPick(-1)
  }, [li])

  /* the run: one printed line per beat of reading pace, then the verdict */
  useEffect(() => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
    if (!running) {
      setShown(0)
      setDone(false)
      return
    }
    if (instant) {
      setShown(total)
      setDone(true)
      return
    }
    const T = Math.round((L.error ? 520 : 360) * motionSpeed)
    for (let n = 1; n <= total; n++) timers.current.push(window.setTimeout(() => setShown(n), T * n))
    timers.current.push(window.setTimeout(() => setDone(true), T * total + Math.round(480 * motionSpeed)))
    return () => timers.current.forEach((t) => window.clearTimeout(t))
  }, [running, li, instant, total, L.error])

  const celebrate = done && pick === L.right
  const printed = L.output.slice(0, shown)

  return (
    <div className="flex items-start gap-8">
      <div className="flex w-[540px] shrink-0 flex-col gap-2">
        <span className="text-[16px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
          Level {L.n} of {LEVELS.length} · {L.name}
        </span>
        <CodeBlock code={L.code} filename="Python" chip={false} fontSize={16} rows={CODE_ROWS} lines={L.errorLine && running ? { [L.errorLine]: 'error' } : undefined} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <p className="text-[20px] leading-tight" style={{ color: colors.body }}>{L.question}</p>
        <div className="grid grid-cols-2 gap-2">
          {L.options.map((o, k) => {
            const isRight = done && k === L.right
            const isWrong = done && k !== L.right
            const picked = k === pick
            return (
              <button
                key={`${li}-${k}`}
                type="button"
                disabled={running}
                aria-pressed={picked}
                onKeyDown={(e) => e.key !== 'Enter' && e.key !== ' ' && e.currentTarget.blur()}
                onClick={() => !running && setPick(k)}
                className="sm-tap relative flex min-h-[40px] items-center gap-3 rounded-xl bg-white px-3 py-1 text-left"
                style={{
                  boxShadow: `inset 0 0 0 ${picked || isRight ? 3 : 2}px ${isRight ? colors.success : isWrong && picked ? colors.danger : picked ? colors.brand : colors.line}`,
                  background: isRight ? `${colors.success}14` : isWrong && picked ? `${colors.danger}14` : picked ? colors.surface2 : colors.white,
                  opacity: isWrong && !picked ? 0.5 : 1,
                  transition: instant ? 'none' : `box-shadow 360ms ${HOUSE}, background-color 360ms ${HOUSE}, opacity 360ms ${HOUSE}, transform 160ms ${HOUSE}`,
                }}
              >
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-md font-mono text-[16px] font-bold"
                  style={{ background: picked ? colors.brand : colors.surface2, color: picked ? colors.white : colors.body, transition: instant ? 'none' : `all 240ms ${HOUSE}` }}
                >
                  {LETTERS[k]}
                </span>
                <span className="font-mono text-[16px] font-semibold leading-[1.25]" style={{ color: colors.ink }}>
                  {Array.isArray(o) ? o.map((l, j) => <span key={j} className="block">{l}</span>) : o}
                </span>
              </button>
            )
          })}
        </div>
        <Glow on={running && shown > 0} pulse={shown} color={L.error ? colors.danger : colors.success}>
          <OutputPanel
            output={printed.join('\n') || ' '}
            kind={L.error && shown > 0 ? 'error' : 'result'}
            fontSize={16}
            lineHeight={1.25}
            height={142}
            after={
              L.still && done ? (
                <pre className="m-0 whitespace-pre font-mono text-[16px] font-bold" style={{ color: colors.accentDark, lineHeight: 1.25 }}>
                  {L.still}
                </pre>
              ) : undefined
            }
          />
        </Glow>
        {running && (
          <ul className="flex flex-col gap-0.5" style={{ opacity: done ? 1 : 0, transform: done ? 'none' : 'translateY(6px)', transition: instant ? 'none' : `all ${Math.round(420 * motionSpeed)}ms ${HOUSE}` }}>
            {L.reasons.map((r, i) => (
              <li key={i} className="flex gap-2 text-[16px] leading-[1.3]" style={{ color: colors.body }}>
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: colors.muted }} />
                <span>
                  <b className="font-mono font-bold text-ink">{r.opt}:</b> {r.text}
                </span>
              </li>
            ))}
          </ul>
        )}
        {celebrate && <Confetti seed={li + 31} />}
      </div>
    </div>
  )
}

/**
 * Slide 15: the machine's beats are the slide's build steps. ONE claimer: the
 * panel calls `useBeats` once and hands the beat to the machine and to the
 * controls (two calls would claim the steps twice and the deck would need
 * twenty-four presses).
 */
export function ControlMachinePanel() {
  const at = useBeats(LEVELS.length * 2)
  return (
    <>
      <ControlMachine beat={at} />
      <StepControls at={at} total={LEVELS.length * 2} />
    </>
  )
}
