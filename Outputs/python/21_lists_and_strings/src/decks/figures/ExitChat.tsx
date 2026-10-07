import { useState } from 'react'
import { colors } from '@/design/tokens'
import { Countdown, useBeats } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { Confetti } from './motion'
import { Ask, ListBoxes, sentences } from './pieces'
import { CodePane, Vote } from './trace'
import { SPEC } from './spec'

/**
 * EXIT: THE EMPTY CHAT SLICE. Spec card X1, two presses, 2:30.
 *
 * The story line, chat.py with line 2's brackets as a blank, the five
 * messages as boxes with ONLY the index row 0 to 4 (its must line: the room
 * works out the negative positions), the question, four options and the
 * timer. No output before the second press (its must_not). Press 2: the right
 * option marks and EVERY option shows what it prints and its why line, from
 * the spec's data, because each wrong option is a real misconception. All
 * four were run on CPython (plan, outputs table).
 */
const X1 = SPEC.X1
type Opt = { line2: string; prints: string; why: string }
const OPTS: Opt[] = X1.data.options
const RIGHT = 'ABCD'.indexOf(X1.data.right)
const SRC: string = X1.code[0].src
/* the messages, read from the program's own line 1 */
const MSGS = [...SRC.split('\n')[0].matchAll(/'([^']*)'/g)].map((m) => m[1])
/* an option is the expression in print( ): msgs[1:4] */
const expr = (line2: string) => line2.replace(/^print\((.*)\)$/, '$1')

export function ExitChat() {
  const beat = useBeats(2)
  const shown = beat >= 2
  const [pick, setPick] = useState(-1)
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-8">
          <div className="flex w-[500px] shrink-0 flex-col gap-3">
            <p className="text-[19px] font-semibold leading-snug" style={{ color: colors.body }}>
              <Lines lines={sentences(X1.show[0])} />
            </p>
            <CodePane code={SRC} fontSize={14} rows={2} highlight={2} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <Ask size={22}>{X1.show[1]}</Ask>
            <div className="flex items-end justify-between gap-6">
              <ListBoxes items={MSGS} size="xs" quote lane={false} />
              <Countdown seconds={X1.timer} />
            </div>
          </div>
        </div>
        <Vote
          options={OPTS.map((o) => expr(o.line2))}
          right={RIGHT}
          shown={shown}
          pick={pick}
          setPick={setPick}
          cols={2}
          size={17}
          dense
          details={OPTS.map((o, i) => (
            <span key={i} className="block">
              <span className="block whitespace-nowrap font-mono text-[14px] font-bold leading-snug" style={{ color: i === RIGHT ? colors.success : colors.ink }}>
                {o.prints}
              </span>
              <Lines lines={sentences(o.why)} />
            </span>
          ))}
        />
      </div>
      {shown && pick === RIGHT && <Confetti seed={28} />}
      <StepControls at={beat} total={2} />
    </>
  )
}
