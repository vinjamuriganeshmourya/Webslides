import { useEffect, useState } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Confetti, Glow } from './motion'
import { Ask } from './pieces'
import { StepCaption, Vote } from './trace'
import { CallCode, type Frame } from './call'
import { GATE, HOME, MapsPhone, type MapsState } from './Maps'
import { PHONE_LIFT } from './Phone'
import { SPEC } from './spec'

/**
 * GAME G1: THE APP IS BROKEN. Spec card G1, eighteen presses over three rounds
 * (7 + 7 + 4).
 *
 * The app is the hook's own phone (`Maps.tsx`), "exactly like the hook's
 * app". Each round: the app shows the wrong thing, circled, the question and
 * its line-number options, nothing running (press 1); then one step per press,
 * the marker on the line Python runs and the data's caption, with the app
 * starting empty and its boxes filling only on the print steps (its must
 * line); on a call the marker jumps into the def and the call line waits, as
 * session 22 drew it. The verdict: the right option, its reason, a line under
 * every other option, the line fixed in the code and the app showing the right
 * trip (`game_def.how`). Keys 1 to 4 or a click mark the room's pick; the right
 * arrow works with or without one. Nothing moves on a timer.
 */
const G1 = SPEC.G1
type GStep = { caption: string; line: number; app: string }
type Round = { ask: string; program: string; fix: string; options: string[]; answer: string; because: string; why: Record<string, string>; steps: GStep[] }
const ROUNDS: Round[] = G1.data.rounds
const PRESSES: number[] = ROUNDS.map((r) => r.steps.length + 2)
const TOTAL = PRESSES.reduce((a, b) => a + b, 0) /* 18, the spec's press_count */

/** beat (1-based) -> round and the press inside it (0 ask, 1..n a step, n+1 the verdict) */
function locate(beat: number) {
  let left = beat - 1
  for (let r = 0; r < ROUNDS.length; r++) {
    if (left < PRESSES[r]) return { r, k: left }
    left -= PRESSES[r]
  }
  return { r: ROUNDS.length - 1, k: PRESSES[ROUNDS.length - 1] - 1 }
}

/** The app as a step's data says it: `Start: X · End: Y`, `(empty)` for an empty box, or `crashed: <error>`. */
function appOf(app: string): MapsState {
  if (app.startsWith('crashed: ')) return { start: null, end: null, crash: app.slice('crashed: '.length) }
  const m = /Start: (.*) · End: (.*)/.exec(app)
  const v = (t: string | undefined) => (!t || t === '(empty)' ? null : t)
  return { start: v(m?.[1]), end: v(m?.[2]) }
}

/** The program with the fixed line in place of the line it fixes. */
function fixedOf(r: Round) {
  const head = (l: string) => l.split('(')[0]
  return r.program
    .split('\n')
    .map((l) => (head(l) === head(r.fix) ? r.fix : l))
    .join('\n')
}

const fixedLine = (r: Round) => r.program.split('\n').findIndex((l) => l.split('(')[0] === r.fix.split('(')[0]) + 1

export function AppBroken() {
  const beat = useBeats(TOTAL)
  const { r, k } = locate(beat)
  const round = ROUNDS[r]
  const n = round.steps.length
  const verdict = k === n + 1
  const step = k >= 1 && k <= n ? round.steps[k - 1] : null
  const lines = round.program.split('\n')
  const callLine = lines.findIndex((l) => l.startsWith('directions(')) + 1
  const inside = !!step && step.line < callLine && step.line <= 3
  const crash = !!step && step.app.startsWith('crashed')
  const frame: Frame | null = step && !crash ? { at: step.line, waiting: inside ? callLine : null, jumpIn: inside ? { from: callLine, to: 1 } : null, jumpBack: null, inCall: inside, step: null } : null
  const wrong: MapsState = ROUNDS[r].steps.some((s) => s.app.startsWith('crashed'))
    ? appOf(ROUNDS[r].steps.find((s) => s.app.startsWith('crashed'))!.app)
    : { start: HOME, end: GATE, circled: true }
  const app: MapsState = verdict ? { start: GATE, end: HOME } : step ? appOf(step.app) : wrong
  const right = round.options.indexOf(round.answer)
  const [pick, setPick] = useState(-1)
  useEffect(() => setPick(-1), [r])
  const rows = Math.max(...ROUNDS.map((x) => x.program.split('\n').length))
  const caption = verdict ? round.because : step ? step.caption : null
  return (
    <>
      <div className="flex items-start gap-6">
        <div className="flex shrink-0 flex-col gap-3" style={{ width: 486 }}>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 whitespace-nowrap rounded-md px-3 py-1 text-[15px] font-bold uppercase tracking-wider" style={{ background: '#FFF4EC', color: colors.accentDark }}>
              Round {r + 1} of {ROUNDS.length}
            </span>
            <Ask size={19}>{round.ask}</Ask>
          </div>
          <CallCode key={`${r}-${verdict}`} code={verdict ? fixedOf(round) : round.program} fs={15} rows={rows} frame={frame} error={crash ? step!.line : null} mark={verdict ? [fixedLine(round)] : []} />
          <StepCaption badge={verdict || !step ? null : `line ${step.line}`} text={caption} tone={verdict ? 'rule' : 'step'} size={17} minH={52} />
        </div>
        <div className="shrink-0" style={{ marginTop: -PHONE_LIFT }}>
          <Glow on={verdict} color={colors.success}>
            <MapsPhone s={app} width={214} height={440} time="5:30" />
          </Glow>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2.5 pt-1">
          <Vote
            key={r}
            options={round.options}
            right={right}
            shown={verdict}
            pick={pick}
            setPick={setPick}
            cols={1}
            size={19}
            mono={false}
            details={round.options.map((o) => round.why[o] ?? null)}
          />
        </div>
      </div>
      {verdict && pick === right && <Confetti seed={14 + r} />}
      <StepControls at={beat} total={TOTAL} />
    </>
  )
}

export const G1_PRESSES = PRESSES.join(' + ')
