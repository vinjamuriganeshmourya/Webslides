import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { BigLine, ListBoxes, OutPanel, type BoxState } from './pieces'
import { CodePane, StepCaption } from './trace'
import { SPEC } from './spec'

/**
 * WALK LEFT: THE NEGATIVE STEP. Spec card E2, the animated explainer,
 * fifteen presses: three runs, each asked, walked one cursor move per press,
 * then its output.
 *
 * The list as boxes with its index row, the expression big at the top, an
 * empty result row. Each press: the cursor lands where the spec's step says,
 * the box it takes drops into the result row, the spec's caption says what
 * happened. A box the cursor never takes greys out and stays grey until the
 * run ends; the cursor never moves right (its must lines). The stop is
 * outlined and not taken. Run 3 ends on an empty result row drawn as [] and no
 * error. It runs these three programs only, in order: no code box to edit, no
 * picker (its must_not). Every list, step, caption, grey list and output is
 * the spec's data, each run on CPython (plan, outputs table).
 */
const E2 = SPEC.E2
type Step = { at: number; take: number | null; result: number[]; caption: string }
type Run = { list: number[]; expr: string; src: string; output: string; steps: Step[]; grey: number[] }
const RUNS: Run[] = E2.data.runs

type Beat = { r: number; kind: 'ask' | 'walk' | 'out'; k: number }
const SCHEDULE: Beat[] = RUNS.flatMap((run, r) => [
  { r, kind: 'ask' as const, k: -1 },
  ...run.steps.map((_, k) => ({ r, kind: 'walk' as const, k })),
  { r, kind: 'out' as const, k: run.steps.length - 1 },
])
export const E2_PRESSES = SCHEDULE.length /* 15 */

/** start, stop and step, read from the expression the spec gives: list_a[8:1:-2]. */
function parts(expr: string) {
  const [start, stop, step] = expr.slice(expr.indexOf('[') + 1, -1).split(':').map(Number)
  return { start, stop, step }
}

function boxStates(run: Run, b: Beat): Record<number, BoxState> {
  const st: Record<number, BoxState> = {}
  if (b.kind === 'ask') return st
  const { stop } = parts(run.expr)
  const step = run.steps[b.k]
  const taken = new Set(run.steps.slice(0, b.k + 1).filter((s) => s.take !== null).map((s) => s.at))
  run.list.forEach((_, i) => {
    if (taken.has(i)) st[i] = 'hit'
  })
  if (b.kind === 'out') {
    run.grey.forEach((i) => (st[i] = 'grey'))
    return st
  }
  /* everything right of the cursor that was not taken has been skipped */
  run.list.forEach((_, i) => {
    if (i > step.at && !taken.has(i)) st[i] = 'grey'
  })
  if (step.take !== null) st[step.at] = 'now'
  else st[step.at] = step.at === stop ? 'wall' : 'grey'
  return st
}

export function WalkLeft() {
  const beat = useBeats(SCHEDULE.length)
  const b = SCHEDULE[beat - 1]
  const run = RUNS[b.r]
  const step = b.k >= 0 ? run.steps[b.k] : null
  const out = b.kind === 'out'
  const result = step ? step.result.map(String) : []
  const caption = b.kind === 'ask' ? E2.show[3] : b.kind === 'walk' ? step!.caption : b.r === RUNS.length - 1 ? E2.show[4] : null
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-6">
          <div className="flex w-[400px] shrink-0 items-center gap-4">
            <span className="shrink-0 whitespace-nowrap font-heading text-[18px] font-bold" style={{ color: colors.brandDark }}>
              {E2.show[b.r]}
            </span>
            <BigLine k={run.expr} size={32}>
              {run.expr}
            </BigLine>
          </div>
          <div className="min-w-0 flex-1">
            <StepCaption badge={b.kind === 'walk' ? `move ${b.k + 1}` : null} text={caption ?? (out ? `It gives ${run.output}.` : null)} tone={out ? 'rule' : 'step'} size={18} minH={62} />
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="w-[86px] shrink-0 pt-[30px] text-[16px] font-semibold" style={{ color: colors.muted }}>
            list_a
          </span>
          <ListBoxes key={b.r} items={run.list.map(String)} size="md" cursor={step ? step.at : null} states={boxStates(run, b)} />
        </div>
        <div className="flex items-start gap-7">
          <div className="w-[470px] shrink-0">
            <CodePane code={run.src} at={out ? 3 : b.kind === 'walk' ? 2 : null} fontSize={15} rows={3} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex items-center gap-4">
              <span className="w-[60px] shrink-0 text-[16px] font-semibold" style={{ color: colors.muted }}>
                list_b
              </span>
              <ListBoxes items={result} size="md" positions={false} lane={false} states={Object.fromEntries(result.map((_, i) => [i, 'hit' as BoxState]))} empty="[]" />
            </div>
            <OutPanel lines={out ? [{ text: run.output }] : []} minRows={1} fontSize={18} />
          </div>
        </div>
      </div>
      <StepControls at={beat} total={SCHEDULE.length} />
    </>
  )
}
