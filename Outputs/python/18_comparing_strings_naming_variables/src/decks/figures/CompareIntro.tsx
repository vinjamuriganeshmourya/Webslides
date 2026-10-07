import type { ReactNode } from 'react'
import { CodeBlock, useBeats } from '@/ui'
import { StepControls } from './controls'
import { Speaker } from './Characters'
import { BannerSlot } from './tiles'
import { WordCompare } from './compare'

/**
 * COMPARED CHARACTER BY CHARACTER. PF 18 slide 13.
 *
 * Three beats: the question (two words as letters), the numbers (the Computer
 * sees 66 65 68 and 66 65 84, not words), one pair at a time (a frame round
 * pair 1 and the arrow to the right). The walk itself is the next frame; this
 * one only shows HOW the Computer looks.
 */
const ANU: Record<number, ReactNode> = {
  1: <>Is BAD bigger than or equal to BAT?<br />How does it check?</>,
}
const PC: Record<number, ReactNode> = {
  2: <>I do not see words<br />I see numbers</>,
  3: <>I start at the <b>left</b><br />One pair at a time</>,
}

export function CompareIntro() {
  const beat = useBeats(3)
  return (
    <>
      <div className="flex items-start justify-between">
        <Speaker who="anu" tail="over" say={ANU[beat]} beatKey={beat} bubbleWidth={240} size={17} />
        <div className="flex flex-col items-center gap-3">
          <div className="w-[380px]">
            <CodeBlock code={'print("BAD" >= "BAT")'} filename="Python" chip={false} fontSize={18} rows={1} />
          </div>
          <WordCompare a="BAD" b="BAT" op=">=" at={0} numbers={beat >= 2} frame={beat >= 3} size="md" bare />
          <BannerSlot on={beat >= 3} className="w-[640px]" size={20}>
            Python compares strings character by character
          </BannerSlot>
        </div>
        <Speaker who="computer" look="3d" tail="over" say={PC[beat]} beatKey={beat} bubbleWidth={230} size={17} />
      </div>
      <StepControls at={beat} total={3} />
    </>
  )
}
