import { useState } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Confetti } from './motion'
import { Memory, pictureOf, usePhase, type MNode, type MTag, type SpecStep, type StepLayout } from './memory'
import { Ask, BigLine, OutPanel } from './pieces'
import { CodePane, StepCaption, Vote, printedBy } from './trace'
import { SPEC } from './spec'

/**
 * EXPLAINER E1: FOLLOW THE ARROWS, + AND +=. Thirteen presses.
 *
 * Run 1 (`list_a = list_a + [6, 7]`) and run 2 (`list_a += [6, 7]`), these two
 * programs only, no free code box (its must_not). Each run: the program with
 * line 3 the biggest text, memory empty, and the vote "Say what list b prints
 * before the press"; then one line per press from the spec's steps.
 *
 * Line 3 is one press with its movement inside it (the spec allows movement
 * inside one press, never a press that plays by itself):
 *
 *   run 1   a short-lived row 6 7 appears; then a NEW joined row 1 2 6 7
 *           builds itself from copies of the two (the boxes fly in from where
 *           their values sit); then list_a's arrow lifts onto it and the 6 7
 *           row greys out.
 *   run 2   the short-lived row 6 7 appears right above the end of the row
 *           both names share; its boxes drop INTO that row, which grows; the
 *           6 7 row greys out.
 *
 * list_b's tag and arrow never move in either run: in run 1 its boxes stay
 * 1 2, in run 2 they grow, and that contrast is the finding. A row with no
 * name greys and stays grey until the run ends. The last press puts both end
 * pictures side by side under their two lines.
 */
const E1 = SPEC.E1
type Run = { key: string; line3: string; src: string; steps: SpecStep[]; output: string }
const RUNS: Run[] = E1.data.runs
const RIGHT = [0, 1] /* list b prints [1, 2] after +, [1, 2, 6, 7] after += */
const OPTIONS = ['[1, 2]', '[1, 2, 6, 7]']

const BW = 48
const X0 = 230
const TOP = 14
const BOT = 128
const LAY: StepLayout = {
  rows: { L1: { x: X0, y: BOT }, L2: { x: X0, y: TOP } },
  tags: { list_a: { x: 0, y: TOP + 7 }, list_b: { x: 0, y: BOT + 7 } },
  size: 'md',
  boxW: BW,
}
const bx = (i: number) => X0 + i * (BW - 2)

/** The picture of run `r` after step `k`, at phase `ph` of line 3. */
function runPicture(r: number, k: number, ph: number) {
  const steps = RUNS[r].steps
  if (k < 0) return { nodes: [] as MNode[], tags: [] as MTag[] }
  const step = steps[k]
  const prev = k >= 1 ? steps[k - 1] : null
  if (k < 2) return pictureOf(step, prev, LAY)
  const last = k > 2 ? 2 : ph
  if (r === 0) {
    /* + : temp row to the right of L1, the new row on the top line */
    const T: MNode = { id: 'T', kind: 'row', x: bx(2) + 58, y: BOT, items: ['6', '7'], size: 'md', boxW: BW, grey: last >= 2 }
    const L1: MNode = { id: 'L1', kind: 'row', x: X0, y: BOT, items: ['1', '2'], size: 'md', boxW: BW }
    const nodes: MNode[] = [L1, T]
    if (last >= 1)
      nodes.push({
        id: 'L2',
        kind: 'row',
        x: X0,
        y: TOP,
        items: ['1', '2', '6', '7'],
        size: 'md',
        boxW: BW,
        fresh: k === 2 ? [0, 1, 2, 3] : [],
        from: { 0: { x: bx(0), y: BOT }, 1: { x: bx(1), y: BOT, delay: 0.08 }, 2: { x: T.x, y: BOT, delay: 0.16 }, 3: { x: T.x + BW - 2, y: BOT, delay: 0.24 } },
      })
    const tags: MTag[] = [
      { name: 'list_a', ...LAY.tags.list_a, to: last >= 2 ? 'L2' : 'L1' },
      { name: 'list_b', ...LAY.tags.list_b, to: 'L1' },
    ]
    return { nodes, tags }
  }
  /* += : temp row right above where the shared row will grow */
  const T: MNode = { id: 'T', kind: 'row', x: bx(2), y: TOP, items: ['6', '7'], size: 'md', boxW: BW, grey: last >= 2 }
  const grown = last >= 1
  const L1: MNode = {
    id: 'L1',
    kind: 'row',
    x: X0,
    y: BOT,
    items: grown ? ['1', '2', '6', '7'] : ['1', '2'],
    size: 'md',
    boxW: BW,
    fresh: grown && k === 2 ? [2, 3] : [],
    from: { 2: { x: bx(2), y: TOP }, 3: { x: bx(3), y: TOP, delay: 0.1 } },
  }
  const tags: MTag[] = [
    { name: 'list_a', ...LAY.tags.list_a, to: 'L1' },
    { name: 'list_b', ...LAY.tags.list_b, to: 'L1' },
  ]
  return { nodes: [L1, T], tags }
}

function RunCode({ r, k, big = 25 }: { r: number; k: number; big?: number }) {
  const run = RUNS[r]
  return (
    <>
      <div className="flex items-center gap-4">
        <span className="shrink-0 whitespace-nowrap font-heading text-[18px] font-bold" style={{ color: colors.brandDark }}>
          Run {r + 1}
        </span>
        <BigLine size={big} k={r}>
          {run.line3}
        </BigLine>
      </div>
      <CodePane code={run.src} at={k >= 0 ? run.steps[k].line : null} fontSize={15} rows={5} />
    </>
  )
}

export function PlusWalk() {
  const beat = useBeats(13)
  /* 1 ask · 2..6 run 1 · 7 ask · 8..12 run 2 · 13 both */
  const both = beat === 13
  const r = beat <= 6 ? 0 : 1
  const k = both ? 4 : r === 0 ? beat - 2 : beat - 8
  const ph = usePhase(beat, 3, 1000)
  const [picks, setPicks] = useState([-1, -1])
  const setPick = (p: number) => setPicks((ps) => ps.map((v, j) => (j === r ? p : v)))
  const shown = k >= 4
  const step = k >= 0 ? RUNS[r].steps[k] : null

  if (both) {
    const ends = ['+ builds a new list.', '+= grows the same list.']
    return (
      <>
        <div className="flex items-start gap-10">
          {RUNS.map((run, i) => {
            const pic = runPicture(i, 4, 2)
            return (
              <div key={run.key} className="flex w-[555px] shrink-0 flex-col gap-2.5">
                <div className="flex items-center gap-4">
                  <span className="font-heading text-[18px] font-bold" style={{ color: colors.brandDark }}>
                    Run {i + 1}
                  </span>
                  <BigLine size={22}>{run.line3}</BigLine>
                </div>
                <Memory width={555} height={178} nodes={pic.nodes} tags={pic.tags} size="md" />
                <StepCaption text={ends[i]} tone="rule" minH={46} />
                <OutPanel lines={run.output.split('\n').map((t) => ({ text: t }))} minRows={2} fontSize={15} />
              </div>
            )
          })}
        </div>
        <StepControls at={beat} total={13} />
      </>
    )
  }

  const pic = runPicture(r, k, ph)
  return (
    <>
      <div className="flex items-start gap-7">
        <div className="flex w-[480px] shrink-0 flex-col gap-3">
          <RunCode r={r} k={k} />
          <OutPanel lines={printedBy(RUNS[r].steps, k)} minRows={2} fontSize={15} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Ask size={22}>Say what list b prints before the press.</Ask>
          <div className="w-[440px]">
            <Vote key={r} options={OPTIONS} right={RIGHT[r]} shown={shown} pick={picks[r]} setPick={setPick} />
          </div>
          <Memory width={640} height={184} nodes={pic.nodes} tags={pic.tags} size="md" />
          <StepCaption line={step?.line} text={step?.caption} />
        </div>
      </div>
      {shown && picks[r] === RIGHT[r] && <Confetti seed={50 + r} />}
      <StepControls at={beat} total={13} />
    </>
  )
}
