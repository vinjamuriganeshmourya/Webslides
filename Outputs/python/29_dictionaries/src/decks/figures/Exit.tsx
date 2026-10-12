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
 * EXIT: WHICH LINE 2 PRINTS NOTHING? Spec card X1, two presses, 2:30.
 *
 * The story line, sign.py with line 2 blank (drawn as the fill-in slot),
 * the question, four options for the blank and the timer. No output before
 * the second press (its must_not). Press 2: the right option marks and EVERY
 * option shows what it prints (nothing printed, in italics, for the right
 * one) and its why line. All four were run on CPython 3.12.3.
 */
const X1 = SPEC.X1
type Opt = { line2: string; prints: string; why: string }
const OPTS: Opt[] = X1.data.options
const RIGHT = 'ABCD'.indexOf(X1.data.right)
const SRC: string = X1.code[0].src

export function ExitSign() {
  const beat = useBeats(2)
  const shown = beat >= 2
  const [pick, setPick] = useState(-1)
  return (
    <>
      <div className="flex items-stretch gap-3" style={{ height: 431 }}>
        <Group pad={10} className="flex w-[500px] shrink-0 flex-col gap-3">
          <CodePane code={SRC} fontSize={CODE_FS} highlight={2} />
          <p className="text-[17px] font-semibold leading-snug" style={{ color: colors.body }}>
            <Lines lines={sentences(X1.show[0])} />
          </p>
          <Ask size={20}>{X1.show[1]}</Ask>
          <Countdown seconds={X1.timer} />
        </Group>
        <Group pad={10} className="flex min-w-0 flex-1 flex-col justify-start" active={beat === 1}>
          <Vote
            options={OPTS.map((o) => o.line2)}
            right={RIGHT}
            shown={shown}
            pick={pick}
            setPick={setPick}
            cols={2}
            size={18}
            dense
            details={OPTS.map((o, i) => (
              <span key={i} className="block text-[14.5px]">
                <span className="block font-mono text-[12.5px] font-bold leading-snug" style={{ color: colors.success, fontStyle: o.prints ? 'normal' : 'italic' }}>
                  {(o.prints || 'nothing printed').split('\n').map((l, j) => (
                    <span key={j} className="block whitespace-pre">
                      {l}
                    </span>
                  ))}
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

/** Session 27's leftover deck file (`setsDeck.tsx`, kept unimported, as the user asked that nothing be deleted) imports this name. */
export { ExitSign as ExitTrending }
