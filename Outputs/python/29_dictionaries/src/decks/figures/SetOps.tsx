import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Focus, Group } from './common'
import { Ask, Fresh, OutPanel, Swap, CODE_FS, OUT_FS } from './pieces'
import { CodePane } from './trace'
import { useForward, useStepPhase } from './phase'
import { Bag, Star, STAR_GREEN, type ChipState } from './bag'
import { SPEC } from './spec'

/**
 * OPERATIONS ON SETS. Spec card C12, five presses.
 *
 *   1  deck slide 31's four operations, each with its green arrow, beside the
 *      Close Friends bag: "Say it before I press."
 *   2  len lights: the chips are counted one by one; 3
 *   3  Membership lights: a finger checks the chips for Kiran and finds none;
 *      False (he was added on C8's program, not this one: the trap)
 *   4  Iterating lights: "How many lines does the loop print?"; each chip
 *      lights once, one per printed line, in the run's own order
 *   5  clear() lights: every chip leaves at once; set()
 *
 * The bag's three chips stay through len, in and the loop; only clear empties
 * it (keeps line). The loop's question is the number of lines, never their
 * order (must line). Every program and output is the spec's.
 */
const C12 = SPEC.C12
type Prog = { file: string; src: string; output: string }
const [LEN, IN, FOR, CLEAR]: Prog[] = C12.code
const CLOSE: string[] = C12.data.close
/* deck slide 31's order on the left; the presses take them len, in, loop, clear */
const OPS = C12.show.slice(0, 4) as string[]
const PRESS_OP = [-1, 1, 3, 2, 0]
const PROG_AT = [null, LEN, IN, FOR, CLEAR]
const LOOP_ORDER = FOR.output.split('\n').map((l) => l.replace('Star for ', ''))

/** One of deck slide 31's operations, its green arrow drawn as it lights. */
function Op({ text, lit, done }: { text: string; lit: boolean; done: boolean }) {
  const instant = useInstant()
  const tween = useTween(420)
  return (
    <div className="flex items-center gap-4 rounded-xl px-3 py-1.5" style={{ background: lit ? colors.white : 'rgba(255,255,255,0)', boxShadow: lit ? `inset 0 0 0 2px ${colors.success}` : `inset 0 0 0 1px ${colors.line}`, transition: tween }}>
      <svg width="54" height="18" viewBox="0 0 54 18" aria-hidden>
        {/* the line ends at the centre of the head's base: no gap, no overlap (content rules 45, 46) */}
        <path d="M2 9 H43" fill="none" stroke={colors.success} strokeWidth="3" strokeLinecap="butt" pathLength={1} strokeDasharray="1" style={{ strokeDashoffset: lit || done ? 0 : 1, opacity: lit || done ? 1 : 0.25, transition: instant ? 'none' : 'stroke-dashoffset 860ms cubic-bezier(0.65,0,0.35,1)' }} />
        <path d="M43 4.5 L52 9 L43 13.5 Z" fill={colors.success} style={{ opacity: lit || done ? 1 : 0.25, transition: instant ? 'none' : 'opacity 200ms ease-out 700ms' }} />
      </svg>
      <span className="font-mono text-[20px] font-bold" style={{ color: lit ? colors.ink : colors.body }}>
        {text}
      </span>
    </div>
  )
}

export function SetOps() {
  const beat = useBeats(5)
  const fwd = useForward(beat)
  const prog = PROG_AT[beat - 1]
  /* inside a press: three beats of counting, checking or looping */
  const phase = useStepPhase(beat, [700, 800, 800, 800])
  const states: Record<string, ChipState> = {}
  if (beat === 2) CLOSE.slice(0, Math.min(phase, 3)).forEach((n) => (states[n] = 'lit'))
  if (beat === 4) {
    const k = Math.min(phase, 3)
    LOOP_ORDER.slice(0, k).forEach((n, i) => (states[n] = i === k - 1 && phase < 4 ? 'check' : 'lit'))
  }
  const done = phase >= 4
  /* the output is on screen from the press (the view fixes change spec, 2026-10-09: no output on a timer); the chips light in turn as the movement inside it */
  const out = !prog ? [] : prog.output.split('\n')
  const caption = beat === 1 ? C12.show[4] : beat === 4 ? C12.show[5] : null
  return (
    <>
      <div className="flex items-stretch gap-8">
        <Group className="flex w-[470px] shrink-0 flex-col gap-3" active={beat === 1}>
          <div className="min-h-[34px]">
            <Swap k={caption ?? 'none'}>{caption && <Ask size={21}>{caption}</Ask>}</Swap>
          </div>
          <div className="flex flex-col gap-2">
            {OPS.map((o, i) => (
              <Op key={`op-${i}`} text={o} lit={PRESS_OP[beat - 1] === i} done={PRESS_OP.slice(1, beat - 1).includes(i)} />
            ))}
          </div>
          {prog && (
            <Fresh k={prog.file}>
              <Focus on={!done}>
                <CodePane code={prog.src} fontSize={CODE_FS} rows={3} />
              </Focus>
            </Fresh>
          )}
        </Group>
        <Group className="flex min-w-0 flex-1 flex-col gap-3" active={beat >= 2}>
          <span className="inline-flex items-center gap-2 self-start rounded-full bg-white px-3 py-1 text-[15px] font-bold" style={{ color: colors.ink, boxShadow: `inset 0 0 0 1.5px ${STAR_GREEN}` }}>
            <Star size={18} />
            Close Friends
          </span>
          <Bag items={beat === 5 && phase >= 1 ? [] : CLOSE} universe={CLOSE} door={false} w={400} h={200} name="close" stars states={states} moving={fwd} stagger={0} finger={beat === 3 ? { path: CLOSE, found: null } : null} />
          <OutPanel lines={out.map((t) => ({ text: t }))} minRows={3} fontSize={OUT_FS} />
        </Group>
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}
