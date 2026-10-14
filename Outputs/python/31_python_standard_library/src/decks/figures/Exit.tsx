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
 * EXIT: WHICH INPUT CRASHES IT? Spec card X1, two presses, 2:30.
 *
 * The story line, big_orders.py with line numbers, the question, four
 * inputs and the timer. No output before the second press (its must_not).
 * Press 2: the right option marks and EVERY option shows what it prints and
 * its why line. All four inputs were run on CPython 3.12.3.
 */
const X1 = SPEC.X1
type Opt = { input: string; prints: string; why: string }
const OPTS: Opt[] = X1.data.options
const RIGHT = 'ABCD'.indexOf(X1.data.right)
const SRC: string = X1.code[0].src

/** A printed line longer than the option's width is drawn as two lines, broken at the space nearest its middle: one block per line, so no text node wraps (align-check). */
function twoLines(s: string): string[] {
  if (s.length <= 34) return [s]
  const mid = Math.floor(s.length / 2)
  let cut = s.lastIndexOf(' ', mid)
  if (cut < 10) cut = s.indexOf(' ', mid)
  return cut > 0 ? [s.slice(0, cut), s.slice(cut + 1)] : [s]
}

export function ExitPlan() {
  const beat = useBeats(2)
  const shown = beat >= 2
  const [pick, setPick] = useState(-1)
  return (
    <>
      <div className="flex items-stretch gap-3">
        <Group pad={10} className="w-[500px] shrink-0" active={beat === 1}>
          <CodePane code={SRC} fontSize={CODE_FS} rows={11} highlight={9} />
        </Group>
        <Group pad={10} className="flex min-w-0 flex-1 flex-col gap-3" active={shown}>
          <div className="flex items-start justify-between gap-4">
            <p className="text-[17px] font-semibold leading-snug" style={{ color: colors.body }}>
              <Lines lines={sentences(X1.show[0])} />
            </p>
            <Countdown seconds={X1.timer} />
          </div>
          <Ask size={21}>{X1.show[1]}</Ask>
          <Vote
            options={OPTS.map((o) => o.input)}
            right={RIGHT}
            shown={shown}
            pick={pick}
            setPick={setPick}
            cols={2}
            size={15}
            dense
            nowrap
            details={OPTS.map((o, i) => (
              <span key={i} className="block text-[13px]">
                {twoLines(o.prints).map((l, j) => (
                  <span key={j} className="block whitespace-nowrap font-mono text-[12.5px] font-bold leading-snug" style={{ color: /Error/.test(o.prints) ? colors.danger : '#137A3A' }}>
                    {l}
                  </span>
                ))}
                <Lines lines={sentences(o.why)} />
              </span>
            ))}
          />
        </Group>
      </div>
      {shown && pick === RIGHT && <Confetti seed={30} />}
      <StepControls at={beat} total={2} />
    </>
  )
}
