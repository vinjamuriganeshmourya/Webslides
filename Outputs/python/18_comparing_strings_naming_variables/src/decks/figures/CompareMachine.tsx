import { useEffect, useState } from 'react'
import { colors } from '@/design/tokens'
import { CodeBlock, useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Confetti } from './motion'
import { WordCompare, walk, type Op } from './compare'

/**
 * THE COMPARISON MACHINE: TRUE OR FALSE? PF 18 slide 15, worksheet task 2.
 *
 * Six levels. Each opens on a vote beat (the program, `True` / `False`) and
 * then walks one pair per press, so a level with three pairs takes four
 * presses: 2 + 2 + 4 + 2 + 2 + 4 is the reference's 16 beats. The `most say`
 * sentence appears once the walk starts, under the chips.
 *
 * ON THE REFERENCE THE CHIPS ARE STATIC TEXT and the room taps the worksheet.
 * Here they are clickable so the vote is locked in and the confetti can fire
 * when the room was right; `Next` is not gated on a pick (plan decision 6).
 */
interface Level {
  a: string
  b: string
  op: Op
  most: string
}

const LEVELS: Level[] = [
  { a: 'a', b: 'A', op: '>', most: 'Most say False: A comes first in the alphabet, so it must be bigger' },
  { a: 'Zebra', b: 'apple', op: '<', most: 'Z is the last letter, so most say False' },
  { a: 'BAT', b: 'BALL', op: '>', most: 'BALL has more letters, so most say False' },
  { a: '98', b: '123', op: '<=', most: '98 is less than 123, so most say True' },
  { a: 'ravi', b: 'Ravi', op: '==', most: 'It is the same name, so most say True' },
  { a: '98', b: '984', op: '<', most: 'Nothing is different, so most say False' },
]

/* beat → level index and the step of its walk (0 = the vote) */
const MAP: { li: number; step: number }[] = []
LEVELS.forEach((L, li) => {
  const n = walk(L.a, L.b, L.op).steps.length
  for (let s = 0; s <= n; s++) MAP.push({ li, step: s })
})
export const MACHINE_BEATS = MAP.length

const HOUSE = 'cubic-bezier(0.22, 1, 0.36, 1)'

export function CompareMachine() {
  const beat = useBeats(MACHINE_BEATS)
  const instant = useInstant()
  const tween = useTween(360)
  const { li, step } = MAP[Math.min(beat, MACHINE_BEATS) - 1]
  const L = LEVELS[li]
  const { steps, verdict } = walk(L.a, L.b, L.op)
  const running = step > 0
  const done = step >= steps.length
  const [pick, setPick] = useState<boolean | null>(null)
  useEffect(() => setPick(null), [li])
  const celebrate = done && pick === verdict
  return (
    <>
      <div className="flex items-start gap-10">
        <div className="flex w-[400px] shrink-0 flex-col gap-3">
          <span className="text-[16px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
            Level {li + 1} of 6
          </span>
          <CodeBlock code={`print("${L.a}" ${L.op} "${L.b}")`} filename="Python" chip={false} fontSize={18} rows={1} />
          <p className="text-[20px] leading-snug" style={{ color: colors.body }}>True or False? Tap it on your worksheet first</p>
          <div className="grid grid-cols-2 gap-3">
            {[true, false].map((v) => {
              const picked = pick === v
              const right = done && v === verdict
              const wrongPick = done && picked && v !== verdict
              return (
                <button
                  key={`${li}-${v}`}
                  type="button"
                  disabled={running}
                  aria-pressed={picked}
                  onKeyDown={(e) => e.key !== 'Enter' && e.key !== ' ' && e.currentTarget.blur()}
                  onClick={() => !running && setPick(v)}
                  className="sm-tap grid h-[50px] place-items-center rounded-xl font-mono text-[20px] font-bold"
                  style={{
                    background: right ? '#E9F8EF' : wrongPick ? '#FDECEC' : picked ? colors.surface2 : colors.white,
                    color: right ? '#137A3A' : wrongPick ? colors.danger : colors.ink,
                    boxShadow: `inset 0 0 0 ${picked || right ? 3 : 2}px ${right ? colors.success : wrongPick ? colors.danger : picked ? colors.brand : colors.line}`,
                    opacity: done && !right ? 0.55 : 1,
                    transition: instant ? 'none' : `box-shadow 360ms ${HOUSE}, background-color 360ms ${HOUSE}, opacity 360ms ${HOUSE}, transform 160ms ${HOUSE}`,
                  }}
                >
                  {v ? 'True' : 'False'}
                </button>
              )
            })}
          </div>
          <p className="rounded-xl px-4 py-2.5 text-[16px] font-semibold leading-snug" style={{ background: colors.surface2, color: colors.ink, boxShadow: `inset 4px 0 0 ${colors.brandDark}`, opacity: running ? 1 : 0, transition: tween }}>
            {L.most}
          </p>
        </div>
        <WordCompare key={li} a={L.a} b={L.b} op={L.op} at={step} size="md" className="min-w-0 flex-1" />
      </div>
      {celebrate && <Confetti seed={li + 31} />}
      <StepControls at={beat} total={MACHINE_BEATS} />
    </>
  )
}
