import { useState } from 'react'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Group, Lines } from './common'
import { motion } from 'framer-motion'
import { useInstant } from '@/motion/instant'
import { Confetti } from './motion'
import { Ask, OutPanel, sentences } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { Scope, SCOPE, type ScopeStep } from './scope'
import { SPEC } from './spec'

/**
 * THE FIRST HALF'S THREE WALKS: C1, C2 and E1.
 *
 * Each is the spec's own program, its vote, then one spec step per press
 * (`data.steps`: the line that runs, where it runs, which names point at which
 * lists, the defaults, what is printed), then the card's rule. The picture is
 * `scope.tsx`; the code lights the step's line; the output box keeps every
 * printed line (E1's must line: "they are the finding"). No output shows
 * before the vote (each card's must_not). A click or keys 1 to n mark the
 * room's pick and never gate the press; confetti when the pick was right.
 */

function useWalk(card: string, before: number) {
  const C = SPEC[card]
  const steps: ScopeStep[] = C.data.steps
  const total: number = C.press_count
  const beat = useBeats(total)
  const k = beat - before - 1 /* the step on screen, -1 before the walk */
  const step = k >= 0 ? steps[Math.min(k, steps.length - 1)] : null
  const prev = k >= 1 ? steps[k - 1] : null
  return { C, steps, total, beat, k, step, prev, done: beat === total }
}

function choices(show: string[], from: number, n: number) {
  return show.slice(from, from + n).map((s) => s.replace(/^[A-D]\s+/, ''))
}

/* ------------------------------------------------------------------ C1 */

/**
 * C1, nine presses. Press 1: deck slide 9's picture, ravi and list_x on one
 * list Unit 1 | Unit 2, with `Both names point at the same list.` Press 2: the vote,
 * the picture empty. Presses 3 to 8: the six steps. Press 9: the rule.
 */
export function PassList() {
  const { C, steps, total, beat, k, step, prev, done } = useWalk('C1', 2)
  const [pick, setPick] = useState(-1)
  const opts = choices(C.show, 2, 2)
  const right = opts.indexOf(C.answer)
  /* press 1 is the call's own picture: step 3 of the walk, both names on Unit 1 | Unit 2 */
  const pic = beat === 1 ? steps[2] : step
  const printed = step?.printed ?? []
  const shown = printed.length > 0
  const caption = beat === 1 ? C.show[0] : done ? C.show[4] : step?.caption ?? null
  return (
    <WalkLayout
      code={C.code[0].src}
      at={beat === 1 ? null : step && step.event === 'line' ? step.line : null}
      mark={beat === 1 ? [1, 5] : undefined}
      printed={printed}
      outRows={1}
      ask={beat >= 2 ? C.show[1] : null}
      vote={<Vote options={opts} right={right} shown={shown} pick={pick} setPick={setPick} cols={1} size={15} dense nowrap />}
      picture={<Scope step={pic} prev={beat === 1 ? null : prev} />}
      caption={caption}
      badge={beat === 1 || done ? null : k >= 0 ? `step ${k + 1}` : null}
      rule={beat === 1 || done}
      confetti={shown && pick === right ? 41 : null}
      beat={beat}
      total={total}
    />
  )
}

/* ------------------------------------------------------------------ C2 */

/** C2, eight presses: the vote with line 2 lit, the six steps, the rule. */
export function NewList() {
  const { C, total, beat, k, step, prev, done } = useWalk('C2', 1)
  const [pick, setPick] = useState(-1)
  const opts = choices(C.show, 1, 2)
  const right = opts.indexOf(C.answer)
  const printed = step?.printed ?? []
  const shown = printed.length > 0
  return (
    <WalkLayout
      code={C.code[0].src}
      at={step && step.event === 'line' ? step.line : null}
      mark={beat === 1 ? [2] : undefined}
      printed={printed}
      outRows={1}
      ask={C.show[0]}
      vote={<Vote options={opts} right={right} shown={shown} pick={pick} setPick={setPick} cols={1} size={15} dense nowrap />}
      picture={<Scope step={step} prev={prev} />}
      caption={done ? C.show[3] : step?.caption ?? null}
      badge={done ? null : k >= 0 ? `step ${k + 1}` : null}
      rule={done}
      confetti={shown && pick === right ? 42 : null}
      beat={beat}
      total={total}
    />
  )
}

/* ------------------------------------------------------------------ E1 */

/**
 * E1, fifteen presses. Press 1: the program, the empty output, an empty
 * picture and the vote A to D. Presses 2 to 14: the thirteen steps; the
 * default list appears on the def press, on the def's shelf, and never
 * leaves. Press 15: the shelf is ringed, with the rule.
 */
export function DefaultList() {
  const { C, steps, total, beat, k, step, prev, done } = useWalk('E1', 1)
  const [pick, setPick] = useState(-1)
  const opts = choices(C.show, 1, 4)
  const right = 'ABCD'.indexOf((C.answer as string)[0])
  const printed = step?.printed ?? []
  const shown = printed.length === steps[steps.length - 1].printed.length
  return (
    <WalkLayout
      code={C.code[0].src}
      at={step && step.event === 'line' ? step.line : null}
      printed={printed}
      outRows={3}
      ask={C.show[0]}
      vote={<Vote options={opts} right={right} shown={shown} pick={pick} setPick={setPick} template="minmax(0, 1fr) minmax(0, 1.55fr)" size={14} dense nowrap />}
      picture={<Scope step={step} prev={prev} ring={done} />}
      caption={done ? C.show[5] : step?.caption ?? null}
      badge={done ? null : k >= 0 ? `step ${k + 1}` : null}
      rule={done}
      confetti={shown && pick === right ? 43 : null}
      beat={beat}
      total={total}
      voteRight
    />
  )
}

/* ------------------------------------------------------------------ layout */

const HOUSE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const EASE = [0.22, 1, 0.36, 1] as const

/** E1's picture scale (see WalkLayout) */
const E1_PIC = 0.75
/** C1 and C2's picture scale, inside the run's group */
const C_PIC = 0.92

function WalkLayout({
  code,
  at,
  mark,
  printed,
  outRows,
  ask,
  vote,
  picture,
  caption,
  badge,
  rule,
  confetti,
  beat,
  total,
  voteRight = false,
}: {
  code: string
  at: number | null
  mark?: number[]
  printed: string[]
  outRows: number
  ask: string | null
  vote: React.ReactNode
  picture: React.ReactNode
  caption: string | null
  badge: string | null
  rule: boolean
  confetti: number | null
  beat: number
  total: number
  /** E1: the four options sit over the picture, the output under the code */
  voteRight?: boolean
}) {
  const instant = useInstant()
  const pic = voteRight ? E1_PIC : C_PIC
  const askBlock = (
    <div className="flex flex-col gap-2" style={{ opacity: ask ? 1 : 0, transition: instant ? 'none' : `opacity 420ms ${HOUSE}` }}>
      <Ask size={20}>
        <Lines lines={sentences(ask ?? ' ')} />
      </Ask>
      {vote}
    </div>
  )
  /* C1 and C2 keep the vote under the code, so their output sits under the caption; E1's sits under the code */
  const output = <OutPanel lines={printed.map((t) => ({ text: t }))} minRows={outRows} fontSize={16} />
  /* The slide's entrance (rule G1): each column fades up on the house curve, the second a beat after the first. */
  const enter = (k: number) => ({
    initial: instant ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: EASE, delay: instant ? 0 : 0.18 + k * 0.14 },
  })
  return (
    <>
      <div className="flex items-start gap-7">
        {/* the program and what is asked about it: one group (rule G3) */}
        <motion.div {...enter(0)} className={`${voteRight ? 'w-[360px]' : 'w-[440px]'} shrink-0`}>
          <Group pad={10} className="flex flex-col gap-3">
            <CodePane code={code} at={at} mark={mark} fontSize={16} />
            {voteRight && output}
            {!voteRight && askBlock}
          </Group>
        </motion.div>
        <motion.div {...enter(1)} className={`flex min-w-0 flex-1 flex-col ${voteRight ? 'gap-2' : 'gap-3'}`}>
          {voteRight && askBlock}
          {/* the run: the picture, what the step did, what it printed (rule G3) */}
          <Group pad={voteRight ? 8 : 10} className="flex flex-col gap-2.5">
            {/* E1: the vote sits over the picture and a step caption runs to four lines, so the picture is drawn at E1_PIC and the caption one size down.
                C1 and C2: drawn at C_PIC inside the run's group, so a three-line step and the output stay clear of Next and Autoplay. */}
            <div className="shrink-0" style={{ width: SCOPE.width * pic, height: SCOPE.height * pic }}>
              <div className="origin-top-left" style={{ transform: `scale(${pic})`, width: SCOPE.width, height: SCOPE.height }}>
                {picture}
              </div>
            </div>
            <StepCaption badge={badge} text={caption} tone={rule ? 'rule' : 'step'} size={voteRight ? 15 : 17} minH={voteRight ? 46 : 54} />
            {!voteRight && output}
          </Group>
        </motion.div>
      </div>
      {confetti !== null && <Confetti seed={confetti} />}
      <StepControls at={beat} total={total} />
    </>
  )
}
