import { useState } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls, useVoteKeys } from './controls'
import { Lines, Group } from './common'
import { Confetti } from './motion'
import { Ask, Swap, sentences } from './pieces'
import { StepCaption } from './trace'
import { SPEC } from './spec'

/**
 * GAME G1: FIND THE IMPOSTOR. Nineteen presses: the intro, then three rounds
 * of six (the ask, one press per token run, the verdict).
 *
 *   - Four order tokens on the Sri Sai Canteen counter, A to D, each with its
 *     whole program from the ask press; only the outputs wait (must line).
 *   - A click on a token, or keys 1 to 4, marks the room's pick; the right
 *     arrow works with or without one. No tick, no highlight on the right
 *     token before the runs (must_not).
 *   - Each step press runs one token and fills its output, with the spec's
 *     caption. The verdict flips the impostor to its red back, gives the
 *     `because` line, and puts the why line under every other token.
 *
 * Every program, output, caption and why line is the spec's data, run on
 * CPython 3.12.3.
 */
const G1 = SPEC.G1
type Step = { caption: string; program: string; output: string }
type Round = { ask: string; programs: Record<string, string>; outputs: Record<string, string>; options: string[]; answer: string; because: string; why: Record<string, string>; steps: Step[] }
const ROUNDS: Round[] = G1.data.rounds

type Beat = { kind: 'intro' } | { kind: 'ask' | 'verdict'; r: number } | { kind: 'step'; r: number; s: number }
const SCHEDULE: Beat[] = [{ kind: 'intro' }, ...ROUNDS.flatMap((rd, r): Beat[] => [{ kind: 'ask', r }, ...rd.steps.map((_, s): Beat => ({ kind: 'step', r, s })), { kind: 'verdict', r }])]

/** The counter's order token: the program on the front, the red back for the impostor. */
function Token({
  letter,
  program,
  output,
  ran,
  picked,
  flipped,
  why,
  onPick,
  canPick,
  shown,
  running,
  deal,
}: {
  /** this press runs this token: it lifts off the counter and its rim lights */
  running: boolean
  /** its place in the deal, when a round's tokens are laid on the counter */
  deal: number
  letter: string
  program: string | null
  output: string
  ran: boolean
  picked: boolean
  flipped: boolean
  why: string | null
  onPick: () => void
  canPick: boolean
  shown: boolean
}) {
  const instant = useInstant()
  const tween = useTween(420)
  const face = 'absolute inset-0 rounded-card [backface-visibility:hidden]'
  return (
    /* a new round deals its four tokens onto the counter, left to right (G2: the tokens are order tokens) */
    <motion.div
      className="flex min-w-0 flex-col gap-2"
      initial={instant ? false : { opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: running ? -8 : 0 }}
      transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1], delay: instant ? 0 : running ? 0 : deal * 0.13 }}
    >
      <button
        type="button"
        disabled={!canPick}
        aria-pressed={picked}
        onClick={onPick}
        onKeyDown={(e) => e.key !== 'Enter' && e.key !== ' ' && e.currentTarget.blur()}
        className="sm-tap relative h-[188px] w-full text-left [perspective:1000px]"
      >
        <div className="relative h-full w-full [transform-style:preserve-3d]" style={{ transform: flipped ? 'rotateY(180deg)' : 'none', transition: instant ? 'none' : 'transform 760ms cubic-bezier(0.22, 1, 0.36, 1)' }}>
          {/* the front: the token's letter, its program, its output once run */}
          <div
            className={`${face} flex flex-col gap-2 px-3.5 py-3`}
            style={{
              background: '#FFFBF3',
              boxShadow: running
                ? `inset 0 0 0 3px ${colors.accent}, 0 18px 28px -16px rgba(16,32,58,0.55)`
                : `inset 0 0 0 ${picked ? 3 : 2}px ${picked ? colors.brand : '#E7D9C4'}, 0 10px 20px -16px rgba(16,32,58,0.5)`,
              opacity: shown && !flipped ? 0.62 : 1,
              transition: tween,
            }}
          >
            <span className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full font-heading text-[17px] font-bold" style={{ background: picked ? colors.brand : colors.brandDark, color: colors.white }}>
                {letter}
              </span>
              <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: '#8A6A3E' }}>
                Token
              </span>
            </span>
            <div className="min-h-[52px] rounded-lg px-2.5 py-1.5 font-mono text-[14px] leading-[21px]" style={{ background: colors.night2, color: colors.white }}>
              {(program ?? '').split('\n').map((l, i) => (
                <div key={i} className="whitespace-pre">
                  {l || ' '}
                </div>
              ))}
            </div>
            <span
              className="mt-auto flex h-[38px] items-center overflow-hidden rounded-lg px-2.5 font-mono text-[17px] font-bold"
              style={{ background: ran ? '#E9F8EF' : 'transparent', border: `2px ${ran ? 'solid' : 'dashed'} ${ran ? colors.success : colors.line}`, color: colors.ink, transition: tween }}
            >
              {/* what it printed rises into the slot as the token runs */}
              {ran && (
                <motion.span initial={instant || !running ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}>
                  {output}
                </motion.span>
              )}
            </span>
          </div>
          {/* the back: red, the impostor and what it printed */}
          <div className={`${face} flex flex-col items-center justify-center gap-2`} style={{ transform: 'rotateY(180deg)', background: colors.danger }}>
            <span className="font-heading text-[44px] font-extrabold leading-none text-white">{letter}</span>
            <span className="rounded-lg bg-white px-3 py-1 font-mono text-[18px] font-bold" style={{ color: colors.danger }}>
              {output}
            </span>
          </div>
        </div>
      </button>
      <span className="min-h-[44px] text-[14.5px] font-semibold leading-snug" style={{ color: colors.body, opacity: why ? 1 : 0, transform: why ? 'none' : 'translateY(6px)', transition: tween }}>
        {why && <Lines lines={sentences(why)} />}
      </span>
    </motion.div>
  )
}

export function Impostor() {
  const beat = useBeats(SCHEDULE.length)
  const b = SCHEDULE[beat - 1]
  const r = b.kind === 'intro' ? 0 : b.r
  const round = ROUNDS[r]
  const [picks, setPicks] = useState<number[]>(ROUNDS.map(() => -1))
  const pick = picks[r]
  const setPick = (p: number) => setPicks((ps) => ps.map((v, j) => (j === r ? p : v)))
  const shown = b.kind === 'verdict'
  const canPick = b.kind === 'ask' || b.kind === 'step'
  useVoteKeys(4, setPick, canPick)
  const ranUpTo = b.kind === 'step' ? b.s : b.kind === 'verdict' ? 3 : -1
  const right = round.options.indexOf(round.answer)
  const caption = b.kind === 'step' ? round.steps[b.s].caption : shown ? round.because : null
  return (
    <>
      <div className="flex flex-col gap-3.5">
        <div className="min-h-[34px]">
          <Swap k={b.kind === 'intro' ? 'intro' : r} className="flex items-baseline gap-4">
            {b.kind === 'intro' ? (
              <Ask size={26}>{G1.data.intro}</Ask>
            ) : (
              <>
                <span className="shrink-0 whitespace-nowrap font-heading text-[18px] font-bold" style={{ color: colors.brandDark }}>
                  Round {r + 1} of {ROUNDS.length}
                </span>
                <Ask size={22}>{round.ask}</Ask>
              </>
            )}
          </Swap>
        </div>
        {/* unequal outer columns, so no column reads as a centred block (rule 38) */}
        <Group className="grid gap-4" style={{ gridTemplateColumns: '267px 271px 269px 273px' }} active={b.kind === 'ask'}>
          {round.options.map((L, i) => {
            const run = round.steps.findIndex((s) => s.program === L)
            return (
              <Token
                key={`${b.kind === 'intro' ? 'intro' : r}-${L}`}
                running={b.kind === 'step' && round.steps[b.s].program === L}
                deal={i}
                letter={L}
                program={b.kind === 'intro' ? null : round.programs[L]}
                output={round.outputs[L]}
                ran={run >= 0 && run <= ranUpTo}
                picked={pick === i}
                flipped={shown && i === right}
                why={shown && i !== right ? round.why[L] : null}
                onPick={() => setPick(i)}
                canPick={canPick}
                shown={shown}
              />
            )
          })}
        </Group>
        <StepCaption badge={b.kind === 'step' ? `run ${round.steps[b.s].program}` : null} text={caption} tone={shown ? 'rule' : 'step'} size={18} minH={52} />
      </div>
      {shown && pick === right && <Confetti seed={50 + r} />}
      <StepControls at={beat} total={SCHEDULE.length} />
    </>
  )
}
