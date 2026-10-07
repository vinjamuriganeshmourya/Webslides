import { useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Confetti } from './motion'
import { Ask, ListBoxes, OutPanel, Show, sentences, type BoxState } from './pieces'
import { Lines } from './common'
import { CodePane, StepCaption, Vote } from './trace'
import { usePhase } from './tiles21'
import { SPEC } from './spec'

/**
 * THE SECOND HALF'S ONE PICTURE (spec note 4): a row of boxes with TWO
 * position rows under it, 0 1 2 3 4 and -5 -4 -3 -2 -1, and a cursor in its
 * own lane above that moves along it. Cards C9, C10, C11, C12 and C14. Both
 * rows stay under the boxes for the whole card wherever the spec says so
 * (C9 from press 3, C10, C11, C14). Every program and output is the spec's;
 * every walk is one press, or one movement inside a press where the spec
 * asks for one (C11's press 2, C12's press 4, C14's press 4).
 */

const ALL = (n: number) => Array.from({ length: n }, () => true)
/** A negative index's own box: -1 is the last. */
const pos = (neg: number, n: number) => n + neg

/** The program on the left, what it printed under it. */
function Left({ code, at, out, width = 470, children }: { code: string; at: number | null; out: string | null; width?: number; children?: ReactNode }) {
  return (
    <div className="flex shrink-0 flex-col gap-3" style={{ width }}>
      <CodePane code={code} at={at} fontSize={18} rows={3} />
      <OutPanel lines={out ? [{ text: out }] : []} minRows={1} fontSize={20} />
      {children}
    </div>
  )
}

/** The result a slice builds, box by box: `list_b` and its row. */
function ResultRow({ name, items, joined = false, empty = '[ ]' }: { name: string; items: string[]; joined?: boolean; empty?: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-[86px] shrink-0 text-[16px] font-semibold" style={{ color: colors.muted }}>
        {name}
      </span>
      <ListBoxes items={items} size="md" positions={false} lane={false} states={Object.fromEntries(items.map((_, i) => [i, 'hit' as BoxState]))} empty={empty} joined={joined} />
    </div>
  )
}

/* ------------------------------------------------------------------- C9 */

const C9 = SPEC.C9
type P = { item: number; index: number; neg: number }
const C9_ITEMS = (C9.data.positions as P[]).map((p) => String(p.item))

export function TwoRows() {
  const beat = useBeats(3)
  const neg = beat === 1 ? null : beat === 2 ? C9_ITEMS.map(() => false) : ALL(C9_ITEMS.length)
  return (
    <>
      <div className="flex flex-col items-center gap-6 pt-4">
        <p className="font-mono text-[30px] font-bold" style={{ color: colors.brandDark }}>
          [{C9_ITEMS.join(', ')}]
        </p>
        <div className="min-h-[170px]">
          <ListBoxes items={C9_ITEMS} size="lg" lane={false} rowLabels neg={neg} negStagger />
        </div>
        <Ask size={26} className="text-center">
          <Lines lines={sentences(C9.show[beat - 1])} />
        </Ask>
      </div>
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ------------------------------------------------------------------ C10 */

const C10 = SPEC.C10
const C10_ITEMS = ['5', '4', '3', '2', '1']

export function ReadEnd() {
  const beat = useBeats(4)
  const [pick, setPick] = useState(-1)
  const second = beat >= 3
  const prog = C10.code[second ? 1 : 0]
  const at = beat === 2 ? -1 : beat === 4 ? -4 : null
  const ran = at !== null
  const states: Record<number, BoxState> = at !== null ? { [pos(at, 5)]: 'hit' } : {}
  const caption = beat === 2 ? C10.show[1] : beat === 4 ? 'Find -4 on the bottom row, then read the box above it.' : C10.show[0]
  return (
    <>
      <div className="flex items-start gap-9">
        <Left code={prog.src} at={ran ? 3 : null} out={ran ? prog.output : null} />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <StepCaption text={caption} tone={ran ? 'rule' : 'step'} size={20} minH={56} />
          <ListBoxes items={C10_ITEMS} size="lg" rowLabels neg={ALL(5)} cursor={at !== null ? pos(at, 5) : null} cursorLabel={at !== null ? String(at) : ''} states={states} />
          <Show on={second} className="w-[360px]">
            <Vote options={['4', '2']} right={0} shown={beat >= 4} pick={pick} setPick={setPick} size={20} />
          </Show>
        </div>
      </div>
      {beat >= 4 && pick === 0 && <Confetti seed={21} />}
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ------------------------------------------------------------------ C11 */

const C11 = SPEC.C11

export function SliceEnd() {
  const beat = useBeats(2)
  const [pick, setPick] = useState(-1)
  const phase = usePhase(beat, 2, [900, 900])
  const run = beat >= 2
  /* the walk: -3 takes 3, -2 takes 2, -1 is the stop and is not taken */
  const at = run ? [-3, -2, -1][phase] : null
  const got = run ? ['3', '2'].slice(0, Math.min(phase + 1, 2)) : []
  const states: Record<number, BoxState> = {}
  if (run) {
    if (phase >= 0) states[2] = 'hit'
    if (phase >= 1) states[3] = 'hit'
    if (phase >= 2) states[4] = 'grey'
    if (at !== null && phase < 2) states[pos(at, 5)] = 'now'
  }
  const done = run && phase >= 2
  return (
    <>
      <div className="flex items-start gap-9">
        <Left code={C11.code[0].src} at={done ? 3 : run ? 2 : null} out={done ? C11.code[0].output : null}>
          <Show on={done}>
            <StepCaption text={C11.show[1]} tone="rule" size={19} minH={48} />
          </Show>
        </Left>
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Ask size={22}>{C11.show[0]}</Ask>
          <div className="w-[420px]">
            <Vote options={['[3, 2]', '[3, 2, 1]']} right={0} shown={run} pick={pick} setPick={setPick} size={19} />
          </div>
          <ListBoxes items={C10_ITEMS} size="lg" rowLabels neg={ALL(5)} cursor={at !== null ? pos(at, 5) : null} cursorLabel={at !== null ? String(at) : ''} states={states} />
          <ResultRow name="list_b" items={got} />
        </div>
      </div>
      {run && pick === 0 && <Confetti seed={22} />}
      <StepControls at={beat} total={2} />
    </>
  )
}

/* ------------------------------------------------------------------ C12 */

const C12 = SPEC.C12

export function Reverse() {
  const beat = useBeats(4)
  const walk = usePhase(beat, 4, [650, 650, 650, 650, 650])
  const second = beat >= 3
  const prog = C12.code[second ? 1 : 0]
  /* press 2: the whole list in order; press 4: the walk from the last box, one box per phase */
  const taken = beat === 2 ? C10_ITEMS : beat === 4 ? ['1', '2', '3', '4', '5'].slice(0, Math.min(walk + 1, 5)) : []
  const cursor = beat === 4 && walk < 5 ? 4 - walk : null
  const states: Record<number, BoxState> = {}
  if (beat === 2) C10_ITEMS.forEach((_, i) => (states[i] = 'hit'))
  if (beat === 4) for (let i = 4; i >= 4 - Math.min(walk, 4); i--) states[i] = i === cursor ? 'now' : 'hit'
  const done = beat === 2 || (beat === 4 && walk >= 5)
  const caption = beat === 2 ? C12.show[1] : beat === 4 && done ? C12.show[2] : C12.show[0]
  return (
    <>
      <div className="flex items-start gap-9">
        <Left code={prog.src} at={done ? 3 : beat === 4 ? 2 : null} out={done ? prog.output : null} />
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <StepCaption text={caption} tone={done ? 'rule' : 'step'} size={20} minH={56} />
          <div className="flex items-start gap-4">
            <span className="w-[86px] shrink-0 pt-[44px] text-[16px] font-semibold" style={{ color: colors.muted }}>
              list_a
            </span>
            <ListBoxes items={C10_ITEMS} size="lg" cursor={cursor} cursorLabel="" states={states} />
          </div>
          <ResultRow name="list_b" items={taken} />
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ------------------------------------------------------------------ C14 */

const C14 = SPEC.C14
const WORD = [...'Program']

export function StringEnd() {
  const beat = useBeats(4)
  const walk = usePhase(beat, 4, [450, 450, 450, 450, 450, 450, 450])
  const second = beat >= 3
  const prog = C14.code[second ? 1 : 0]
  const n = WORD.length
  let cursor: number | null = null
  let got: string[] = []
  const states: Record<number, BoxState> = {}
  if (beat === 2) {
    cursor = n - 1
    states[n - 1] = 'hit'
  }
  if (beat === 4) {
    const k = Math.min(walk, n - 1)
    cursor = walk < n ? n - 1 - k : null
    for (let i = n - 1; i >= n - 1 - k; i--) states[i] = i === cursor ? 'now' : 'hit'
    got = WORD.slice(n - 1 - k).reverse()
  }
  const done = beat === 2 || (beat === 4 && walk >= n)
  return (
    <>
      <div className="flex items-start gap-9">
        <Left code={prog.src} at={done ? 3 : beat === 4 ? 2 : null} out={done ? prog.output : null} width={440} />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <StepCaption text={beat === 4 && done ? C14.show[1] : beat === 2 ? 'The cursor lands on -1: the last letter.' : C14.show[0]} tone={done ? 'rule' : 'step'} size={20} minH={56} />
          <ListBoxes items={WORD} size="lg" rowLabels neg={ALL(n)} cursor={cursor} cursorLabel={cursor !== null ? String(cursor - n) : ''} states={states} />
          {second && <ResultRow name="string_2" items={got} joined empty={'""'} />}
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}

