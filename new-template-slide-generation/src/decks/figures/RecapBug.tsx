import { useState } from 'react'
import { colors } from '@/design/tokens'
import { CodeBlock, useBeats } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { Confetti } from './motion'
import { Ask, OutPanel, sentences } from './pieces'
import { StepCaption, Vote } from './trace'
import { SPEC } from './spec'

/**
 * RECAP BUG: WHICH LINE IS TO BLAME? Spec card S-RECAP, format "bug".
 *
 * The wrong output and the wanted output are both on screen from press 1, so
 * the room compares them (its must line). The room votes on a line number by
 * hands; the four lines are buttons too (a click or keys 1 to 4 mark the
 * room's pick, and the press never waits for one). Press 2 lights line 3 as
 * the culprit and shows the why line; press 3 slides the fix into line 3 and
 * the output under it changes. Both programs and outputs are the spec's.
 */
const D = SPEC['S-RECAP'].data
const WRONG_SRC = SPEC['S-RECAP'].code[0].src as string
const FIXED_SRC = SPEC['S-RECAP'].code[1].src as string

export function RecapBug() {
  const beat = useBeats(3)
  const [pick, setPick] = useState(-1)
  const culprit = beat >= 2
  const fixed = beat >= 3
  return (
    <>
      <div className="flex items-start gap-8">
        <div className="flex w-[560px] shrink-0 flex-col gap-3">
          <p className="text-[19px] font-semibold leading-snug" style={{ color: colors.body }}>
            <Lines lines={sentences('We want Tiger and Fox to stay together, as one item inside animals.')} />
          </p>
          <CodeBlock
            code={fixed ? FIXED_SRC : WRONG_SRC}
            filename="Python"
            chip={false}
            fontSize={20}
            rows={4}
            lines={fixed ? { 3: 'now' } : culprit ? { 3: 'error' } : {}}
          />
          <StepCaption text={culprit ? D.why : null} tone="rule" size={17} minH={78} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-[17px] font-bold" style={{ color: colors.body }}>It prints:</span>
            <OutPanel key={fixed ? 'fixed' : 'wrong'} lines={[{ text: fixed ? D.right : D.wrong }]} fontSize={19} />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[17px] font-bold" style={{ color: colors.body }}>We wanted:</span>
            <OutPanel title="Expected output" tone="exp" lines={[{ text: D.right }]} fontSize={19} />
          </div>
          <Ask size={22} className="mt-1">Which line is to blame?</Ask>
          <Vote options={['Line 1', 'Line 2', 'Line 3', 'Line 4']} right={D.culprit - 1} shown={culprit} pick={pick} setPick={setPick} size={17} dense />
        </div>
      </div>
      {culprit && pick === D.culprit - 1 && <Confetti seed={3} />}
      <StepControls at={beat} total={3} />
    </>
  )
}
