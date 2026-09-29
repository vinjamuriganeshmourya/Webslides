import type { ReactNode } from 'react'
import { Card, Chip, Callout } from '@/ui'
import { colors } from '@/design/tokens'
import { TaskCard } from './TaskCard'
import { Timer } from './Timer'

/**
 * A CODING CHALLENGE, in the reference's own shape: the problem on the left,
 * what to do with it on the right.
 *
 * WHY IT WAS REBUILT. The first cut put the challenge on a three-bullet list
 * whose sub-lines were CROSS-WIRED: `Input 7, output 16` carried the odd/even
 * rule and `Input 4, output 4` carried "Run it with 7 first". A learner reading
 * the second example was told to run the first, and the rule that decides every
 * answer was filed under a worked example. The second run the instructor
 * collects answers on ("then run it with 10") was not on the frame at all.
 *
 * THE RULE IS PART OF THE PROBLEM, not a note beside an example: it is the line
 * that turns "the total money Riya saves" into something a program can compute,
 * so it sits under the statement, in the problem card.
 *
 * THE EXAMPLES ARE PLAIN. An input and its output, nothing else. Anything else
 * written on an example card gets read as being about that example.
 */

export interface Example {
  input: string
  output: string
}

export function ChallengeCard({
  title,
  statement,
  rule,
  examples,
  lead,
  runs,
  seconds,
  hint,
}: {
  title: string
  statement: ReactNode
  /** The sentence that makes the problem decidable. */
  rule: ReactNode
  examples: Example[]
  /** The sentence over the numbered runs. */
  lead: ReactNode
  /** What to run, in order. Both of them: the room reports the second. */
  runs: ReactNode[]
  seconds: number
  hint: ReactNode
}) {
  return (
    <div className="grid w-full grid-cols-[1fr_1fr] items-center gap-10">
      <Card>
        <Chip>Problem</Chip>
        <h3 className="mt-3 font-heading text-[26px] font-extrabold leading-tight" style={{ color: colors.ink }}>
          {title}
        </h3>
        <p className="mt-2 text-body leading-relaxed" style={{ color: colors.body }}>
          {statement}
        </p>
        <p className="mt-2 text-body leading-relaxed" style={{ color: colors.body }}>
          {rule}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {examples.map((e) => (
            <div key={e.input} className="rounded-card border border-line bg-surface px-4 py-3">
              <Row name="Input" value={e.input} />
              <Row name="Output" value={e.output} />
            </div>
          ))}
        </div>
      </Card>

      <TaskCard lines={[lead]}>
        <TaskCard lines={runs} ordered className="-mt-2" />
        <Timer seconds={seconds} className="self-start" />
        <Callout kind="tip" title="Hint" asStep={false}>
          {hint}
        </Callout>
      </TaskCard>
    </div>
  )
}

function Row({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span
        className="w-[84px] shrink-0 font-heading text-[16px] font-bold uppercase tracking-wide"
        style={{ color: colors.muted }}
      >
        {name}
      </span>
      <span className="font-mono text-[22px] font-bold leading-snug" style={{ color: colors.ink }}>
        {value}
      </span>
    </div>
  )
}
