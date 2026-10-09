import { useState } from 'react'
import { colors } from '@/design/tokens'
import { Countdown, useBeats } from '@/ui'
import { StepControls } from './controls'
import { Lines, Group } from './common'
import { Confetti } from './motion'
import { Ask, sentences, CODE_FS } from './pieces'
import { CodePane, Vote } from './trace'
import { SPEC } from './spec'

/**
 * EXIT: WHICH ORDER PRINTS NOTHING? Spec card X1, two presses, 2:30.
 *
 * The story line, order.py with line 1 blank, the question, four options for
 * line 1 and the timer. No output before the second press (its must_not).
 * Press 2: the right option marks and EVERY option shows what it prints (or
 * its error, in the danger tone and allowed to wrap, so the longest one never
 * leaves its box) and its why line. All four were run on CPython 3.12.3.
 */
const X1 = SPEC.X1
type Opt = { line1: string; prints: string; why: string }
const OPTS: Opt[] = X1.data.options
const RIGHT = 'ABCD'.indexOf(X1.data.right)
const SRC: string = X1.code[0].src

export function ExitPlan() {
  const beat = useBeats(2)
  const shown = beat >= 2
  const [pick, setPick] = useState(-1)
  return (
    <>
      <div className="flex flex-col gap-2.5">
        <Group pad={10} className="flex items-start gap-8">
          <div className="w-[400px] shrink-0">
            <CodePane code={SRC} fontSize={CODE_FS} highlight={1} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex items-start justify-between gap-6">
              <p className="text-[19px] font-semibold leading-snug" style={{ color: colors.body }}>
                <Lines lines={sentences(X1.show[0])} />
              </p>
              <Countdown seconds={X1.timer} />
            </div>
            <Ask size={22}>{X1.show[1]}</Ask>
          </div>
        </Group>
        <Group pad={8}>
        <Vote
          options={OPTS.map((o) => o.line1)}
          right={RIGHT}
          shown={shown}
          pick={pick}
          setPick={setPick}
          cols={2}
          size={18}
          dense
          details={OPTS.map((o, i) => (
            <span key={i} className="block text-[14.5px]">
              <span className="block whitespace-nowrap font-mono text-[12.5px] font-bold leading-snug" style={{ color: o.prints ? (i === RIGHT ? colors.success : colors.danger) : colors.success, fontStyle: o.prints ? 'normal' : 'italic' }}>
                {o.prints || 'nothing printed'}
              </span>
              <Lines lines={sentences(o.why)} />
            </span>
          ))}
        />
        </Group>
      </div>
      {shown && pick === RIGHT && <Confetti seed={28} />}
      <StepControls at={beat} total={2} />
    </>
  )
}
