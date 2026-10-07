import { useEffect, useRef, useState } from 'react'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { colors, motionSpeed } from '@/design/tokens'
import { CodeBlock, Countdown, TraceCaption, useBeats, useTween } from '@/ui'
import { OutputPanel } from '@/ui/CodeOutput'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Confetti, Glow } from './motion'
import { HOUSE } from './pieces'

/**
 * RUNS OR CRASHES? PF 17 slide 27, six rounds, VOTE THEN RUN (feedback of
 * 2026-10-06, change 4). The pass section's game, in the break-or-continue
 * machine's frame, with one yes-or-no question instead of four options so a
 * round takes about thirty seconds and the whole room answers with thumbs.
 * Rounds 1 and 2 are the two pass frames the deck used to carry (the
 * half-written growth-stage program, then the same with `pass`); rounds 3
 * to 6 are the traps: a comment is not a block, `pass` works outside a loop,
 * `pass` has to be indented.
 *
 * Move 6 of `pedagogy-to-components`, strictly two clicks per round: the
 * vote click shows the code, the question and the two buttons and nothing
 * else; the run click prints the output or the error with the `if` line the
 * message names tinted, turns the right button solid, fills the round's slot
 * in the strip, and shows the one-line reason. The buttons are clickable so
 * the room's vote is locked in and the confetti has something to fire on;
 * `Next` is not gated (plan decision 5). The five-second timer is the kit's
 * `Countdown`: the instructor presses play (course rule R5c item 4).
 *
 * Every result is a real run (CPython 3.12.3, plan revision 1). No round
 * puts `pass` before `print(i)` inside a loop: that is worksheet task 3's
 * finding, and the game must not give it away.
 */
interface Round {
  code: string
  input?: string
  crashes: boolean
  /** The `if` line the error message names. */
  errorLine?: number
  output: string
  reason: string
}

const GROWTH = 'age = int(input())\noutput = ""\nif age >= 20:\nelif age > 12:\nelse:\nprint(output)'
const GROWTH_PASS = 'age = int(input())\noutput = ""\nif age >= 20:\n    pass\nelif age > 12:\n    pass\nelse:\n    pass\nprint(output)'
/* the real message, 79 characters, broken on three lines as slide 26 broke it */
const indentError = (n: number) => `IndentationError: expected an\nindented block after 'if'\nstatement on line ${n}`

export const ROUNDS: Round[] = [
  { code: GROWTH, crashes: true, errorLine: 3, output: indentError(3), reason: 'Every colon needs a block under it' },
  { code: GROWTH_PASS, input: '25', crashes: false, output: '', reason: 'pass fills the block and does nothing' },
  { code: 'marks = 72\nif marks >= 35:\n    # write this later\nprint("Checked")', crashes: true, errorLine: 2, output: indentError(2), reason: 'Python skips comments, so the block is still empty' },
  { code: 'for i in range(3):\n    pass\nprint("Done")', crashes: false, output: 'Done', reason: 'The loop runs 3 times and does nothing each time' },
  { code: 'pass\nprint("Hi")', crashes: false, output: 'Hi', reason: 'Unlike break and continue, pass works outside a loop' },
  { code: 'marks = 72\nif marks >= 35:\npass\nprint("Checked")', crashes: true, errorLine: 2, output: indentError(2), reason: 'pass has to be indented to be in the block' },
]

const CODE_ROWS = Math.max(...ROUNDS.map((r) => r.code.split('\n').length))
const ANSWERS = ['Runs', 'Crashes'] as const

export function PassGame({ beat }: { beat: number }) {
  const instant = useInstant()
  const tween = useTween(420)
  const li = Math.min(Math.ceil(beat / 2) - 1, ROUNDS.length - 1)
  const R = ROUNDS[li]
  const running = beat % 2 === 0
  const right = R.crashes ? 1 : 0
  const [pick, setPick] = useState(-1)
  const [shown, setShown] = useState(false)
  const [done, setDone] = useState(false)
  const timers = useRef<number[]>([])

  useEffect(() => {
    setPick(-1)
  }, [li])

  /* the run: the output lands, then the verdict */
  useEffect(() => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
    if (!running) {
      setShown(false)
      setDone(false)
      return
    }
    if (instant) {
      setShown(true)
      setDone(true)
      return
    }
    const T = Math.round((R.crashes ? 520 : 360) * motionSpeed)
    timers.current.push(window.setTimeout(() => setShown(true), T))
    timers.current.push(window.setTimeout(() => setDone(true), T + Math.round(480 * motionSpeed)))
    return () => timers.current.forEach((t) => window.clearTimeout(t))
  }, [running, li, instant, R.crashes])

  const celebrate = done && pick === right

  return (
    <div className="flex items-start gap-8">
      <div className="flex w-[540px] shrink-0 flex-col gap-2">
        <span className="text-[16px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
          Round {li + 1} of {ROUNDS.length}
        </span>
        <CodeBlock code={R.code} filename="Python" chip={false} fontSize={16} rows={CODE_ROWS} lines={R.errorLine && shown ? { [R.errorLine]: 'error' } : undefined} />
        {R.input && (
          <div className="mt-1 w-[160px]">
            <OutputPanel output={R.input} kind="input" fontSize={18} />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        {/* the round strip: where the room is, and what each round did */}
        <ol className="flex gap-2">
          {ROUNDS.map((r, k) => {
            const filled = k < li || (k === li && done)
            const now = k === li
            const tone = r.crashes ? colors.danger : colors.success
            return (
              <li
                key={k}
                className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-white text-[13px] font-bold"
                style={{
                  boxShadow: `inset 0 0 0 ${now ? 2 : 1}px ${now ? colors.brand : colors.line}`,
                  background: filled ? `${tone}14` : colors.white,
                  color: filled ? tone : now ? colors.brandDark : colors.muted,
                  transition: tween,
                }}
              >
                <span className="font-mono">{k + 1}</span>
                {filled && <span>{r.crashes ? 'Crashes' : 'Runs'}</span>}
              </li>
            )
          })}
        </ol>

        <div className="flex h-[52px] items-center justify-between gap-4">
          <p className="text-[21px] font-semibold leading-tight" style={{ color: colors.ink }}>Runs or crashes?</p>
          {!running && <Countdown key={li} seconds={5} />}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {ANSWERS.map((label, k) => {
            const Icon = k === 0 ? ThumbsUp : ThumbsDown
            const tone = k === 0 ? colors.success : colors.danger
            const picked = k === pick
            const isRight = done && k === right
            const isWrong = done && k !== right
            return (
              <button
                key={`${li}-${k}`}
                type="button"
                disabled={running}
                aria-pressed={picked}
                onKeyDown={(e) => e.key !== 'Enter' && e.key !== ' ' && e.currentTarget.blur()}
                onClick={() => !running && setPick(k)}
                className="sm-tap flex h-[64px] items-center justify-center gap-3 rounded-xl text-left"
                style={{
                  boxShadow: `inset 0 0 0 ${picked && !done ? 3 : 2}px ${isRight ? tone : picked && !done ? colors.brand : colors.line}`,
                  background: isRight ? tone : picked && !done ? colors.surface2 : colors.white,
                  color: isRight ? colors.white : colors.ink,
                  opacity: isWrong ? 0.45 : 1,
                  transition: instant ? 'none' : `box-shadow 360ms ${HOUSE}, background-color 360ms ${HOUSE}, color 360ms ${HOUSE}, opacity 360ms ${HOUSE}, transform 160ms ${HOUSE}`,
                }}
              >
                <Icon size={26} strokeWidth={2.2} style={{ color: isRight ? colors.white : tone, transition: instant ? 'none' : `color 360ms ${HOUSE}` }} aria-hidden />
                <span className="font-heading text-[22px] font-bold leading-none">{label}</span>
              </button>
            )
          })}
        </div>

        <Glow on={running && shown} color={R.crashes ? colors.danger : colors.success}>
          <OutputPanel output={shown ? R.output : ' '} kind={R.crashes && shown ? 'error' : 'result'} fontSize={16} lineHeight={1.4} height={128} />
        </Glow>

        {running && (
          <div style={{ opacity: done ? 1 : 0, transform: done ? 'none' : 'translateY(6px)', transition: instant ? 'none' : `all ${Math.round(420 * motionSpeed)}ms ${HOUSE}` }}>
            <TraceCaption>{R.reason}</TraceCaption>
          </div>
        )}
        {celebrate && <Confetti seed={li + 61} />}
      </div>
    </div>
  )
}

/** Slide 27: the game's beats are the slide's build steps, claimed once (as `ControlMachinePanel` does). */
export function PassGamePanel() {
  const at = useBeats(ROUNDS.length * 2)
  return (
    <>
      <PassGame beat={at} />
      <StepControls at={at} total={ROUNDS.length * 2} />
    </>
  )
}
