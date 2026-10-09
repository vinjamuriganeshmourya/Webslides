import { useState } from 'react'
import { colors } from '@/design/tokens'
import { Countdown, useBeats } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { Confetti } from './motion'
import { Ask, sentences } from './pieces'
import { CodePane, Vote } from './trace'
import { SPEC } from './spec'

/**
 * EXIT: KEEP HIS LIST SAFE. Spec card X1, two presses, 2:30.
 *
 * The story lines, plan.py with line 2 blank, the question, four options for
 * line 2 and the timer. No output before the second press (its must_not).
 * Press 2: the right option marks and EVERY option shows what it prints and
 * its why line, from the spec's data, because each wrong option is a real
 * misconception from one half of the session. All four were run on CPython
 * (plan, outputs section).
 */
const X1 = SPEC.X1
type Opt = { line2: string; prints: string; why: string }
const OPTS: Opt[] = X1.data.options
const RIGHT = 'ABCD'.indexOf(X1.data.right)
const SRC: string = X1.code[0].src

export function ExitPlan() {
  const beat = useBeats(2)
  const shown = beat >= 2
  const [pick, setPick] = useState(-1)
  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-8">
          <p className="text-[19px] font-semibold leading-snug" style={{ color: colors.body }}>
            <Lines lines={[...sentences(X1.show[0]), ...sentences(X1.show[1])]} />
          </p>
          <Countdown seconds={X1.timer} />
        </div>
        <div className="flex items-start gap-7">
          <div className="w-[370px] shrink-0">
            <CodePane code={SRC} fontSize={15} highlight={2} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            <Ask size={21}>{X1.show[2]}</Ask>
            <Vote
              options={OPTS.map((o) => o.line2)}
              right={RIGHT}
              shown={shown}
              pick={pick}
              setPick={setPick}
              cols={2}
              size={17}
              dense
              details={OPTS.map((o, i) => (
                <span key={i} className="block text-[14.5px]">
                  <span className="block whitespace-nowrap font-mono text-[14px] font-bold leading-snug" style={{ color: i === RIGHT ? colors.success : colors.ink }}>
                    {o.prints}
                  </span>
                  <Lines lines={sentences(o.why)} />
                </span>
              ))}
            />
          </div>
        </div>
      </div>
      {shown && pick === RIGHT && <Confetti seed={28} />}
      <StepControls at={beat} total={2} />
    </>
  )
}
