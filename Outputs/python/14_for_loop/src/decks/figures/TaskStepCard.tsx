import type { ReactNode } from 'react'
import { CodeBlock, Callout } from '@/ui'
import { TaskCard } from './TaskCard'
import { Timer } from './Timer'

/**
 * ONE STEP OF WORKSHEET TASK 2 — code on the left, the task on the right, the
 * rule of the room across the bottom.
 *
 * WHAT WAS MISSING. The first cut was a lead sentence over a code panel floating
 * in an otherwise empty well: no instruction telling the room WHICH line to
 * change, no highlight on that line, no clock, and the bottom strip
 * ("Write first, run second. A guess after the run is not a guess.") reaching
 * only speaker notes. That strip is the one thing on the frame that stops the
 * room running before predicting, which is the whole point of task 2.
 *
 * THE HIGHLIGHT IS THE INSTRUCTION. Steps 2 and 3 change line 1 and nothing
 * else, so line 1 is lit in the panel and the sentence beside it says the same
 * thing in words. Step 1 types the whole program, so nothing is lit.
 */
export function TaskStepCard({
  py,
  code,
  highlightLine,
  lines,
  seconds,
  ruleTitle,
  rule,
  ruleKind = 'note',
}: {
  py: string
  code: string
  /** The one line this step edits. Left out on the step that types it all. */
  highlightLine?: number
  lines: ReactNode[]
  seconds: number
  ruleTitle: string
  rule: ReactNode
  ruleKind?: 'note' | 'warning'
}) {
  return (
    <div className="flex w-full flex-col gap-7">
      <div className="grid w-full grid-cols-[1fr_1fr] items-center gap-10">
        <CodeBlock
          className="w-full"
          filename={py}
          code={code}
          highlight={highlightLine ? [highlightLine] : []}
        />
        <TaskCard lines={lines}>
          <Timer seconds={seconds} className="self-start" />
        </TaskCard>
      </div>
      {/* Not a build step: the rule of the room applies from the moment the
          frame arrives, not after a click. */}
      <Callout kind={ruleKind} title={ruleTitle} asStep={false}>
        {rule}
      </Callout>
    </div>
  )
}
