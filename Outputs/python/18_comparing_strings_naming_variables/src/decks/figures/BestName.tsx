import { useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Speaker } from './Characters'
import { Confetti } from './motion'
import { Lines } from './common'

/**
 * PICK THE BEST NAME. PF 18 slide 23.
 *
 * Four names for the sum of even numbers. Beat 1 the vote, beat 2 every name
 * is `allowed` with what is wrong with it, beat 3 the one that says what is
 * inside. The reference's A to D are static; here they are clickable so the
 * vote is locked in, and the confetti fires if the room picked C (plan
 * decision 6). `Next` is not gated.
 */
const OPTIONS = [
  { name: 'sum', note: 'Sum of what? It does not say' },
  { name: 'sumofevenums', note: 'Hard to read. What is evenums?' },
  { name: 'sum_of_even_numbers', note: 'Clear, and in snake case' },
  { name: 'sumofevennumbers', note: 'The words run together' },
]
const BEST = 2
const HOUSE = 'cubic-bezier(0.22, 1, 0.36, 1)'

const ANU: Record<number, ReactNode> = { 1: <>Which one should I use? Vote first</> }
const PC: Record<number, ReactNode> = {
  2: <>All four follow my rules<br />I accept them all</>,
  3: <>But only one tells you <b>what is inside</b></>,
}

export function BestName() {
  const beat = useBeats(3)
  const instant = useInstant()
  const tween = useTween(420)
  const [pick, setPick] = useState(-1)
  const told = beat >= 2
  const best = beat >= 3
  return (
    <>
      <div className="flex flex-col gap-3">
        <p className="text-[21px] font-semibold" style={{ color: colors.ink }}>
          Anu wants to store the <span style={{ color: colors.brandDark }}>sum of even numbers</span>. Which name is best?
        </p>
        <div className="flex flex-col gap-2.5">
          {OPTIONS.map((o, i) => {
            const picked = i === pick
            const win = best && i === BEST
            const lose = best && i !== BEST
            return (
              <button
                key={o.name}
                type="button"
                disabled={told}
                aria-pressed={picked}
                onKeyDown={(e) => e.key !== 'Enter' && e.key !== ' ' && e.currentTarget.blur()}
                onClick={() => !told && setPick(i)}
                className="sm-tap grid h-[56px] grid-cols-[32px_1fr_auto_300px] items-center gap-4 rounded-xl bg-white px-4 text-left"
                style={{
                  background: win ? '#E9F8EF' : picked && !best ? colors.surface2 : colors.white,
                  boxShadow: `inset 0 0 0 ${picked || win ? 3 : 1.5}px ${win ? colors.success : picked ? colors.brand : colors.line}`,
                  opacity: lose ? 0.55 : 1,
                  transition: instant ? 'none' : `box-shadow 360ms ${HOUSE}, background-color 360ms ${HOUSE}, opacity 360ms ${HOUSE}, transform 160ms ${HOUSE}`,
                }}
              >
                <span className="grid h-8 w-8 place-items-center rounded-full font-mono text-[16px] font-bold" style={{ background: picked ? colors.brand : colors.surface2, color: picked ? colors.white : colors.brandDark, transition: tween }}>
                  {'ABCD'[i]}
                </span>
                <span className="font-mono text-[22px] font-bold" style={{ color: colors.ink }}>{o.name}</span>
                <span className="flex items-center gap-2 text-[16px] font-bold" style={{ color: '#137A3A', opacity: told ? 1 : 0, transition: tween }}>
                  allowed
                  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden style={{ opacity: win ? 1 : 0, transition: tween }}>
                    <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.2 1.3-6.6L2.5 9.4l6.6-.8z" fill={colors.accent} />
                  </svg>
                </span>
                <span className="text-right text-[16px] font-semibold leading-tight" style={{ color: win ? '#137A3A' : colors.body, opacity: told ? 1 : 0, transition: tween }}><Lines lines={o.note.split('. ')} /></span>
              </button>
            )
          })}
        </div>
        <div className="flex items-start justify-between">
          <Speaker who="anu" say={ANU[beat]} beatKey={beat} height={112} bubbleWidth={250} size={17} />
          <Speaker who="computer" look="3d" say={PC[beat]} beatKey={beat} height={104} bubbleWidth={260} size={17} />
        </div>
      </div>
      {best && pick === BEST && <Confetti seed={23} />}
      <StepControls at={beat} total={3} />
    </>
  )
}
