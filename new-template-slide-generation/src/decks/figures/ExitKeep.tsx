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
 * EXIT: KEEP KIRAN'S SONGS. Spec card X1, two presses, 2:30.
 *
 * The story line, the program with line numbers and line 3 as a gap (the
 * comment line, dimmed), the question, four options and the timer. No output
 * shows before the second press (its must_not). Press 2: the right option
 * marks and EVERY option shows what `print(kiran)` gives with it and its why
 * line, from the spec's data, because each wrong option is a real
 * misconception. All four results were run on CPython (plan, outputs table).
 */
const X1 = SPEC.X1
type Opt = { line3: string; prints: string; why: string }
const OPTS: Opt[] = X1.data.options
const RIGHT = 'ABCD'.indexOf(X1.data.right)

export function ExitKeep() {
  const beat = useBeats(2)
  const shown = beat >= 2
  const [pick, setPick] = useState(-1)
  return (
    <>
      <div className="flex items-start gap-7">
        <div className="flex w-[400px] shrink-0 flex-col gap-3">
          <p className="text-[19px] font-semibold leading-snug" style={{ color: colors.body }}>
            <Lines lines={sentences('Kiran wants his songs to stay as they are, before you add one.')} />
          </p>
          <CodePane code={X1.code[0].src} gap={3} fontSize={15} rows={5} />
          <Countdown seconds={X1.timer} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Ask size={21}>Which line 3 makes print(kiran) show ['Hukum', 'Kesariya']?</Ask>
          <Vote
            options={OPTS.map((o) => o.line3)}
            right={RIGHT}
            shown={shown}
            pick={pick}
            setPick={setPick}
            cols={2}
            size={17}
            details={OPTS.map((o, i) => (
              <span key={i} className="block">
                <span className="block whitespace-nowrap font-mono text-[13px] font-bold" style={{ color: i === RIGHT ? colors.success : colors.ink }}>
                  {o.prints}
                </span>
                <Lines lines={sentences(o.why)} />
              </span>
            ))}
          />
        </div>
      </div>
      {shown && pick === RIGHT && <Confetti seed={25} />}
      <StepControls at={beat} total={2} />
    </>
  )
}
