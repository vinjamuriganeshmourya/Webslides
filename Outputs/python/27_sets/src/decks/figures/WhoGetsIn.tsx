import { useState } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Group, Lines } from './common'
import { Confetti } from './motion'
import { Ask, OutPanel, sentences, CODE_FS, OUT_FS } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { useForward, useStepPhase } from './phase'
import { Bag, Star, STAR_GREEN, type Visitor } from './bag'
import { SPEC } from './spec'

/**
 * GAME G2: WHO GETS IN? Spec card G2, twenty-seven presses: the intro, then
 * five rounds (the ask, one press per item at the door, the verdict).
 *
 *   - The program on the left with the vote under it; on the right Teja's
 *     Close Friends bag with the round's starting chips, in no order and with
 *     no numbers (must line).
 *   - Each step press runs one line on one item: it walks up and joins, or
 *     bounces off as already in (the bag does not change); a chip leaves; a
 *     finger finds a missing name and nothing happens (discard); clear()
 *     empties the bag; remove of a missing name stops the program with
 *     KeyError and nothing more prints. update with a string sends in one
 *     letter per press, each its own chip.
 *   - The count shows only on the print press, after the last item has
 *     walked (must_not). The verdict marks the right option and puts the why
 *     line under every other one.
 *
 * Every program, step, bag and output is the spec's data, run on CPython.
 */
const G2 = SPEC.G2
type Step = { caption: string; line: number; item: string | null; result: string; bag: string[]; printed: string }
type Round = { ask: string; program: string; start: string[]; output: string; options: string[]; answer: string; because: string; why: Record<string, string>; steps: Step[] }
const ROUNDS: Round[] = G2.data.rounds

type Beat = { kind: 'intro' } | { kind: 'ask' | 'verdict'; r: number } | { kind: 'step'; r: number; s: number }
const SCHEDULE: Beat[] = [{ kind: 'intro' }, ...ROUNDS.flatMap((rd, r): Beat[] => [{ kind: 'ask', r }, ...rd.steps.map((_, s): Beat => ({ kind: 'step', r, s })), { kind: 'verdict', r }])]

/** Every chip that is ever in this round's bag, in the order it first appears, so each keeps one place. */
function universeOf(rd: Round) {
  const all = [...rd.start]
  rd.steps.forEach((st) => st.bag.forEach((b) => !all.includes(b) && all.push(b)))
  return all
}

export function WhoGetsIn() {
  const beat = useBeats(SCHEDULE.length)
  const fwd = useForward(beat)
  const b = SCHEDULE[beat - 1]
  const r = b.kind === 'intro' ? 0 : b.r
  const round = ROUNDS[r]
  const [picks, setPicks] = useState<number[]>(ROUNDS.map(() => -1))
  const pick = picks[r]
  const setPick = (p: number) => setPicks((ps) => ps.map((v, j) => (j === r ? p : v)))
  /* one press, one move (user, 2026-10-08): an item enters at the door and
     moves straight to where it ends, into the bag or up to the rim (a repeat);
     a leaving chip walks straight out; the line's result shows as it lands */
  const phase = useStepPhase(beat, [900])
  const step = b.kind === 'step' ? round.steps[b.s] : null
  const last = round.steps[round.steps.length - 1]
  const before = b.kind === 'step' ? (b.s > 0 ? round.steps[b.s - 1].bag : round.start) : b.kind === 'verdict' ? last.bag : round.start
  const acted = !step || phase >= 1
  const items = step ? step.bag : before
  let visitor: Visitor | null = null
  let finger = null as { path: string[]; found: string | null } | null
  if (step && step.item) {
    if (step.result === 'already in') visitor = { label: step.item, mode: 'bounce' }
    else if (step.result === 'not there') {
      visitor = { label: step.item, mode: 'wait', tag: acted ? 'not in' : '' }
      finger = before.length ? { path: before, found: null } : null
    } else if (step.result === 'KeyError') visitor = { label: step.item, mode: acted ? 'stop' : 'wait', tag: acted ? 'KeyError' : '' }
  }
  const printed = step ? (acted ? step.printed : (b.kind === 'step' && b.s > 0 ? round.steps[b.s - 1].printed : '')) : b.kind === 'verdict' ? last.printed : ''
  const stop = /Error/.test(printed)
  const shown = b.kind === 'verdict'
  const right = round.options.indexOf(round.answer)
  const caption = step ? step.caption : shown ? round.because : null
  return (
    <>
      {/* one fixed height for every press, so the centred block never moves between presses */}
      <div className={`mx-auto flex h-[434px] w-[1064px] items-stretch gap-8 ${b.kind === 'intro' ? 'justify-center' : ''}`}>
        <Group pad={9} className={`flex ${b.kind === 'intro' ? 'w-[760px] justify-center' : 'w-[470px]'} shrink-0 flex-col gap-2`} active={b.kind === 'intro' ? undefined : b.kind === 'ask'}>
          {b.kind === 'intro' ? (
            <Ask size={28}>{G2.data.intro}</Ask>
          ) : (
            <>
              <div className="flex items-baseline gap-3">
                <span className="shrink-0 whitespace-nowrap font-heading text-[17px] font-bold" style={{ color: colors.brandDark }}>
                  Round {r + 1} of {ROUNDS.length}
                </span>
                <Ask size={19}>{round.ask}</Ask>
              </div>
              <div className="shrink-0">
              <CodePane code={round.program} fontSize={CODE_FS} rows={4} at={step ? step.line : null} stop={!!step && step.result === 'KeyError' && acted} gap={stop && round.program.split('\n').length > (step?.line ?? last.line) ? (step?.line ?? last.line) + 1 : undefined} />
              </div>
              <Vote
                key={`g2-vote-${r}`}
                options={round.options}
                right={right}
                shown={shown}
                pick={pick}
                setPick={setPick}
                cols={1}
                size={16}
                dense
                nowrap
                details={round.options.map((o) => (o === round.answer ? undefined : <span className="block text-[14px] leading-[18px]"><Lines lines={sentences(round.why[o] ?? '')} /></span>))}
              />
            </>
          )}
        </Group>
        {/* the pill and the bag are pinned at the top (user, 2026-10-09: the oval
            moved when the caption under it changed height); the boxes under
            it ease to any new place (layout animation) */}
        {b.kind !== 'intro' && (
          <Group className="flex min-w-0 flex-1 flex-col items-center gap-2.5 pt-4" active={b.kind === 'step'}>
            <span className="inline-flex items-center gap-2 self-center rounded-full bg-white px-3 py-1 text-[15px] font-bold" style={{ color: colors.ink, boxShadow: `inset 0 0 0 1.5px ${STAR_GREEN}` }}>
              <Star size={18} />
              Close Friends
            </span>
            <Bag key={`g2-bag-${r}`} items={items} universe={universeOf(round)} w={318} h={178} doorW={216} lane name="close" stars visitor={visitor} finger={finger} moving={fwd} />
            <motion.div layout="position" transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }} className="w-full">
              <OutPanel className="w-full" lines={printed ? [{ text: printed, tone: stop ? 'error' : 'plain' }] : []} fontSize={OUT_FS} />
            </motion.div>
            <motion.div layout="position" transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }} className="w-full">
            <StepCaption badge={step ? `line ${step.line}` : null} text={caption} tone={shown ? 'rule' : 'step'} size={16} minH={48} />
            </motion.div>
          </Group>
        )}
      </div>
      {shown && pick === right && <Confetti seed={270 + r} />}
      <StepControls at={beat} total={SCHEDULE.length} />
    </>
  )
}
