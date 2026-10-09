import { useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Focus, Group, Lines } from './common'
import { Confetti } from './motion'
import { Appear, Ask, OutPanel, sentences, type OutLine } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { usePhase } from './tiles21'
import { CellRow, Shape, cellsOf, type Cell, type CellState } from './cells'
import { SPEC } from './spec'

/**
 * THE CONCEPT CARDS, ONE METHOD ON SCREEN AT A TIME (each card's play line):
 * C2 append, C3 extend, C4 insert, C5 pop, E1 remove (watched), C6 clear,
 * C7 index, C8 count, C9 sort, C10 sort or sorted.
 *
 * ONE LAYOUT FOR ALL OF THEM, so code, output and cells sit in the same place
 * and at the same size on every card (the S23/S24 audit: code sizes drifted
 * card to card, 14.5 to 15.5px, and outputs moved around):
 *
 *   left, 582px    the program (CODE_FS) over its output (OUT_FS), one group
 *   right, 540px   the question and any vote, the cells, the caption, and
 *                  the method's shape, which arrives LAST, after the run
 *
 * Every program, output, option, caption and step is the spec's
 * (`spec.ts`); all were run on CPython 3.12.3 (plan, outputs section). The
 * output fills only on the press after the room has said or voted it.
 */

/* one size per role, deck-wide (the S23/S24 audit: 9.6 to 20px card to card). 15 is the size at which every spec line fits its column unclipped. */
export const CODE_FS = 15
export const OUT_FS = 16
export const CELL_FS = 13
const LEFT = 582
const RIGHT = 510
/* each column is one cluster in a Group (PF 24's rule G3): 8px and 10px of padding round the same inner widths */
const LEFT_PAD = 8
const RIGHT_PAD = 10

type Prog = { file: string; src: string; output: string }
const outLines = (text: string, ran: boolean): OutLine[] =>
  ran ? text.split('\n').map((t) => ({ text: t, tone: t.includes('Error') ? ('error' as const) : ('plain' as const) })) : []

/** The program and its output. */
export function Run({
  src,
  at,
  stop = false,
  out,
  rows,
  outRows,
  title,
  width = LEFT,
  inline = false,
}: {
  /** the output beside the code instead of under it (C8's two missing-value programs) */
  inline?: boolean
  src: string
  at?: number | null
  stop?: boolean
  out: OutLine[]
  rows?: number
  outRows?: number
  title?: string
  width?: number
}) {
  return (
    <div className={inline ? 'flex items-start gap-4' : 'flex flex-col gap-2.5'} style={{ width }}>
      <div className={inline ? 'shrink-0' : ''} style={inline ? { width: LEFT } : undefined}>
        <CodePane code={src} at={at} stop={stop} fontSize={CODE_FS} rows={rows} />
      </div>
      <div className={inline ? 'min-w-0 flex-1' : ''}>
        <OutPanel title={title} lines={out} minRows={outRows ?? 1} fontSize={OUT_FS} />
      </div>
    </div>
  )
}

/**
 * The two-column frame every concept card shares. Each column is ONE cluster
 * and sits in one `Group` (PF 24's rule G3, carried over 2026-10-08): the
 * program with its output on the left; the question, the vote, the cells and
 * the method's shape on the right.
 */
export function Frame({ left, right, end }: { left: ReactNode; right: ReactNode; end?: ReactNode }) {
  return (
    <>
      <div className="flex items-start gap-[22px]">
        <Group pad={LEFT_PAD} className="flex shrink-0 flex-col gap-3" style={{ width: LEFT + 2 * LEFT_PAD }}>
          {left}
        </Group>
        <Group pad={RIGHT_PAD} className="flex min-w-0 flex-col gap-3" style={{ width: RIGHT + 2 * RIGHT_PAD }}>
          {right}
        </Group>
      </div>
      {end}
    </>
  )
}

function Cells(rest: Parameters<typeof CellRow>[0]) {
  return (
    <div className="self-start">
      <CellRow font={CELL_FS} quote={false} {...rest} />
    </div>
  )
}

function ShapeBox({ card, on, extra }: { card: any; on: boolean; extra?: string }) {
  const sigIdx = (card.show as string[]).findIndex((s) => /^list(_a)?\.\w+\(/.test(s))
  return (
    <div className="self-start">
      <Shape sig={card.show[sigIdx]} text={<Lines lines={[...sentences(card.show[sigIdx + 1]), ...(extra ? sentences(extra) : [])]} />} on={on} />
    </div>
  )
}

function Question({ text, children }: { text: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Ask size={22}>{text}</Ask>
      {children}
    </div>
  )
}

/** A vote's options as the spec lists them, with the room's pick; never gates the press. */
function useVote() {
  return useState(-1)
}

/* ================================================================== C2 append */

export function AppendCard() {
  const C = SPEC.C2
  const p: Prog = C.code[0]
  const beat = useBeats(4)
  const rows: string[][] = [['Naatu Naatu'], ...C.data.cells]
  const now = rows[Math.min(beat - 1, 2)]
  const states: Record<number, CellState> = beat === 2 ? { 1: 'new' } : beat === 3 ? { 2: 'new' } : {}
  return (
    <>
      <Frame
        left={<Run src={p.src} at={beat === 1 ? null : Math.min(beat, 4)} out={outLines(p.output, beat >= 3)} />}
        right={
          <>
            <Question text={C.show[0]} />
            <Cells name="queue" cells={cellsOf(now, states)} fit={rows[2]} reserve={3} />
            <ShapeBox card={C} on={beat >= 4} />
          </>
        }
      />
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ================================================================== C3 extend */

export function ExtendCard() {
  const C = SPEC.C3
  const p: Prog = C.code[0]
  const beat = useBeats(3)
  const ph = usePhase(beat, 2, [520, 900, 700])
  const ram = ['Chuttamalle', 'Peelings']
  const copied = beat < 2 ? 0 : Math.min(ph, 2)
  const queue = ['Naatu Naatu', 'Kissik', ...ram.slice(0, copied)]
  const fit = ['Naatu Naatu', 'Kissik', ...ram]
  const ran = beat > 2 || (beat === 2 && ph >= 3)
  return (
    <>
      <Frame
        left={<Run src={p.src} at={beat === 1 ? null : beat === 2 ? (ph >= 3 ? 5 : 3) : 5} out={outLines(p.output, ran)} outRows={2} />}
        right={
          <>
            <Question text={C.show[0]} />
            <div className="flex flex-col gap-1 self-start">
              <CellRow font={CELL_FS} quote={false} name="queue" cells={cellsOf(queue, Object.fromEntries(ram.map((_, i) => [2 + i, i < copied ? ('copy' as const) : ('plain' as const)])), 'q')} fit={fit} reserve={4} />
              <CellRow font={CELL_FS} quote={false} name="ram" cells={cellsOf(ram, beat >= 2 ? { 0: 'lit', 1: 'lit' } : {}, 'r')} fit={fit} reserve={2} />
            </div>
            <ShapeBox card={C} on={beat >= 3} />
          </>
        }
      />
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ================================================================== C4 insert */

const INSERT_1: Cell[][] = (() => {
  const N = { key: 'N', text: 'Naatu Naatu' }
  const K = { key: 'K', text: 'Kissik' }
  const P = { key: 'P', text: 'Peelings' }
  const C = { key: 'C', text: 'Chuttamalle', state: 'new' as const }
  const g = (k: string) => ({ key: k, gap: true as const })
  return [
    [N, K, P],
    [N, K, g('g'), P],
    [N, g('g'), K, P],
    [N, C, K, P],
  ]
})()
const INSERT_0: Cell[][] = (() => {
  const N = { key: 'N', text: 'Naatu Naatu' }
  const K = { key: 'K', text: 'Kissik' }
  const P = { key: 'P', text: 'Peelings' }
  const C = { key: 'C', text: 'Chuttamalle', state: 'new' as const }
  const g = (k: string) => ({ key: k, gap: true as const })
  return [
    [N, K, P],
    [N, K, g('g'), P],
    [N, g('g'), K, P],
    [g('g'), N, K, P],
    [C, N, K, P],
  ]
})()

export function InsertCard() {
  const C = SPEC.C4
  const [p1, p0]: Prog[] = C.code
  const beat = useBeats(5)
  const [pick, setPick] = useVote()
  const ph2 = usePhase(beat, 2, [480, 620, 620, 620])
  const ph5 = usePhase(beat, 5, [480, 620, 620, 620, 620])
  const second = beat >= 4
  const prog = second ? p0 : p1
  const frames = second ? INSERT_0 : INSERT_1
  const step = second ? (beat === 5 ? ph5 : 0) : beat >= 2 ? (beat === 2 ? ph2 : 4) : 0
  const cells = frames[Math.min(step, frames.length - 1)]
  const done = second ? beat === 5 && ph5 >= 5 : beat >= 2 && (beat > 2 || ph2 >= 4)
  const options: string[] = C.show.slice(1, 4)
  const right = options.indexOf(p1.output)
  return (
    <>
      <Frame
        left={<Run src={prog.src} at={beat === 1 || beat === 4 ? null : done ? 3 : 2} out={outLines(prog.output, done)} />}
        right={
          <>
            <Question text={C.show[0]}>
              {!second && <Vote options={options} right={right} shown={beat >= 2} pick={pick} setPick={setPick} cols={1} size={13.5} dense nowrap />}
            </Question>
            <Cells name="queue" cells={cells} fit={['Naatu Naatu', 'Chuttamalle', 'Kissik', 'Peelings']} reserve={4} />
            {second ? (
              <div className="self-start">
                <StepCaption tone="rule" text={beat === 5 && done ? C.show[6] : null} minH={46} />
              </div>
            ) : null}
            <ShapeBox card={C} on={beat >= 3} />
          </>
        }
      />
      {beat >= 2 && !second && pick === right && <Confetti seed={41} />}
      <StepControls at={beat} total={5} />
    </>
  )
}

/* ================================================================== C5 pop */

export function PopCard() {
  const C = SPEC.C5
  const p: Prog = C.code[0]
  const beat = useBeats(3)
  const ph = usePhase(beat, 2, [480, 520])
  const before = ['Naatu Naatu', 'Kissik', 'Peelings']
  const gone = beat === 2 && ph < 2
  const cells = beat === 1 ? cellsOf(before) : gone ? cellsOf(before, { 2: ph >= 1 ? 'vanish' : 'look' }) : cellsOf(before.slice(0, 2))
  const ran = beat >= 3 || (beat === 2 && ph >= 2)
  return (
    <>
      <Frame
        left={<Run src={p.src} at={beat === 1 ? null : ran ? 3 : 2} out={outLines(p.output, ran)} />}
        right={
          <>
            <Question text={C.show[0]} />
            <Cells name="queue" cells={cells} fit={before} reserve={3} />
            <ShapeBox card={C} on={beat >= 3} />
          </>
        }
      />
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ================================================================== E1 remove, watched */

type RStep = { line: number; cells: string[]; look: number | null; gone: number[]; printed: string[]; caption: string }

export function RemoveCard() {
  const C = SPEC.E1
  const [p, miss]: Prog[] = C.code
  const steps: RStep[] = C.data.steps
  const beat = useBeats(9)
  const [pick, setPick] = useVote()
  const options: string[] = C.show.slice(1, 4)
  const right = options.indexOf(p.output)
  /* press 2..6 are the spec's five steps; on the step that removes, the cell vanishes first, then the rest slide */
  const s = beat >= 2 && beat <= 6 ? steps[beat - 2] : beat > 6 ? steps[4] : null
  const prevStep = beat >= 3 && beat <= 6 ? steps[beat - 3] : null
  const phGone = usePhase(beat, 5, [520])
  const missPh = usePhase(beat, 9, [480, 620, 620, 520])
  const second = beat >= 8
  /* one identity per cell, so the second Peelings keeps its own and slides, while the first vanishes (its keeps line) */
  const keys0 = ['K', 'P1', 'N', 'P2']
  const goneAt = steps.findIndex((st) => st.gone.length > 0)
  const keyed = (st: RStep, idx: number, states: Record<number, CellState> = {}): Cell[] => {
    const keys = goneAt >= 0 && idx >= goneAt ? keys0.filter((_, i) => !steps[goneAt].gone.includes(i)) : keys0
    return st.cells.map((t, i) => ({ key: keys[i], text: t, state: states[i] }))
  }
  let cells: Cell[]
  let look: number | null = null
  let lookLabel: string | undefined
  if (second) {
    cells = cellsOf(['Kissik', 'Peelings'], beat === 9 && missPh >= 1 && missPh <= 2 ? { [missPh - 1]: 'look' } : {}, 'm')
    look = beat === 9 && missPh >= 1 && missPh <= 2 ? missPh - 1 : null
    lookLabel = 'remove'
  } else if (s && s.gone.length && phGone === 0 && prevStep) {
    cells = keyed(prevStep, beat - 3, Object.fromEntries(s.gone.map((g) => [g, 'vanish' as const])))
  } else {
    const st = s ?? steps[0]
    cells = keyed(st, s ? Math.min(beat - 2, 4) : 0, s && s.look !== null ? { [s.look]: s.cells[s.look] === 'Peelings' ? 'match' : 'look' } : {})
    look = s ? s.look : null
    lookLabel = 'remove'
  }
  const errOut = beat === 9 && missPh >= 4
  const out: OutLine[] = second ? outLines(miss.output, errOut) : s ? s.printed.map((t) => ({ text: t })) : []
  const caption = second ? null : beat >= 7 ? C.show[6] : s ? s.caption : null
  const at = second ? (beat === 9 ? 2 : null) : s ? s.line : null
  return (
    <>
      <Frame
        left={<Run src={second ? miss.src : p.src} at={at} stop={errOut} out={out} />}
        right={
          <>
            <Question text={second ? C.show[7] : C.show[0]}>
              {!second && <Vote options={options} right={right} shown={beat >= 2} pick={pick} setPick={setPick} cols={1} size={13.5} dense nowrap />}
            </Question>
            <Cells name="queue" cells={cells} look={look} lookLabel={lookLabel} fit={steps[0].cells} reserve={4} />
            <div className="self-stretch">
              <StepCaption badge={!second && s && beat <= 6 ? `line ${s.line}` : null} text={caption} tone={beat === 7 ? 'rule' : 'step'} size={16} minH={50} />
            </div>
            {/* E1 only: the shape mounts when it arrives (eased in) instead of holding its space through the five-step walk, so the walk's longest caption clears the controls */}
            {beat >= 7 && (
              <Appear>
                <ShapeBox card={C} on />
              </Appear>
            )}
          </>
        }
      />
      {beat >= 2 && !second && pick === right && <Confetti seed={57} />}
      <StepControls at={beat} total={9} />
    </>
  )
}

/* ================================================================== C6 clear */

export function ClearCard() {
  const C = SPEC.C6
  const p: Prog = C.code[0]
  const beat = useBeats(3)
  const ph = usePhase(beat, 2, [480, 560])
  const before = ['Naatu Naatu', 'Kissik', 'Peelings']
  const going = beat === 2 && ph < 2
  const cells = beat === 1 ? cellsOf(before) : going ? cellsOf(before, ph >= 1 ? { 0: 'vanish', 1: 'vanish', 2: 'vanish' } : {}) : []
  const ran = beat >= 3 || (beat === 2 && ph >= 2)
  return (
    <>
      <Frame
        left={<Run src={p.src} at={beat === 1 ? null : ran ? 3 : 2} out={outLines(p.output, ran)} />}
        right={
          <>
            <Question text={C.show[0]} />
            <Cells name="queue" cells={cells} fit={before} reserve={3} empty="[ ]" />
            <ShapeBox card={C} on={beat >= 3} extra={C.show[3]} />
          </>
        }
      />
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ================================================================== C7 index */

export function IndexCard() {
  const C = SPEC.C7
  const p: Prog = C.code[0]
  const beat = useBeats(3)
  const [pick, setPick] = useVote()
  const ph = usePhase(beat, 2, [420, 620, 520])
  const list = ['Kissik', 'Peelings', 'Naatu Naatu', 'Peelings']
  const look = beat === 2 ? (ph >= 1 ? Math.min(ph - 1, 1) : null) : beat > 2 ? 1 : null
  const found = beat > 2 || (beat === 2 && ph >= 2)
  const options: string[] = C.show.slice(1, 4)
  const right = options.indexOf(p.output)
  return (
    <>
      <Frame
        left={<Run src={p.src} at={beat === 1 ? null : found && (beat > 2 || ph >= 3) ? 3 : 2} out={outLines(p.output, beat > 2 || (beat === 2 && ph >= 3))} />}
        right={
          <>
            <Question text={C.show[0]}>
              <Vote options={options} right={right} shown={beat >= 2} pick={pick} setPick={setPick} cols={3} size={16} dense />
            </Question>
            <Cells name="queue" cells={cellsOf(list, look === null ? {} : { [look]: found && look === 1 ? 'match' : 'look' })} look={look} lookLabel="index" fit={list} reserve={4} />
            <ShapeBox card={C} on={beat >= 3} />
          </>
        }
      />
      {beat >= 2 && pick === right && <Confetti seed={71} />}
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ================================================================== C8 count */

export function CountCard() {
  const C = SPEC.C8
  const [p, cMiss, iMiss]: Prog[] = C.code
  const beat = useBeats(5)
  const ph = usePhase(beat, 2, [420, 620, 520])
  const list = ['Kissik', 'Peelings', 'Naatu Naatu', 'Peelings']
  const counted = beat === 2 ? Math.min(ph, 2) : beat > 2 ? 2 : 0
  const states: Record<number, CellState> = {}
  if (counted >= 1 && beat <= 3) states[1] = 'lit'
  if (counted >= 2 && beat <= 3) states[3] = 'lit'
  const ran = beat >= 3 || (beat === 2 && ph >= 3)
  const second = beat >= 4
  if (second)
    return (
      <>
        <Appear className="flex flex-col gap-3.5">
          {/* the question and the list it asks about, side by side, so both programs fit above the controls */}
          <div className="flex items-end justify-between gap-6">
            <Question text={C.show[4]} />
            <Cells name="queue" cells={cellsOf(list)} fit={list} reserve={4} lane={false} />
          </div>
          <Group pad={8}>
            <Run inline width={1134} src={cMiss.src} at={beat === 5 ? 2 : null} out={outLines(cMiss.output, beat === 5)} />
          </Group>
          <Group pad={8}>
            <Run inline width={1134} src={iMiss.src} at={beat === 5 ? 2 : null} stop={beat === 5} out={outLines(iMiss.output, beat === 5)} />
          </Group>
        </Appear>
        <StepControls at={beat} total={5} />
      </>
    )
  return (
    <>
      <Frame
        left={
          second ? (
            <>
              <Run src={cMiss.src} at={beat === 5 ? 2 : null} out={outLines(cMiss.output, beat === 5)} />
              <Run src={iMiss.src} at={beat === 5 ? 2 : null} stop={beat === 5} out={outLines(iMiss.output, beat === 5)} />
            </>
          ) : (
            <Run src={p.src} at={beat === 1 ? null : ran ? 3 : 2} out={outLines(p.output, ran)} />
          )
        }
        right={
          <>
            <Question text={second ? C.show[4] : C.show[0]} />
            <Cells
              name="queue"
              cells={cellsOf(list, states)}
              fit={list}
              reserve={4}
              tail={
                !second && counted > 0 ? (
                  <span key={counted} className="inline-block rounded-lg px-2.5 font-mono font-bold" style={{ background: '#FFF4EC', color: colors.accentDark, animation: 'pf25-tick 420ms both' }}>
                    {counted}
                  </span>
                ) : undefined
              }
            />
            <ShapeBox card={C} on={beat >= 3} extra={C.show[3]} />
          </>
        }
      />
      <StepControls at={beat} total={5} />
    </>
  )
}

/* ================================================================== C9 sort */

export function SortCard() {
  const C = SPEC.C9
  const p: Prog = C.code[0]
  const beat = useBeats(3)
  const ph = usePhase(beat, 2, [480, 700])
  const before = [40, 12, 75]
  const cells: Cell[] = [
    { key: '40', text: '40' },
    { key: '12', text: '12' },
    { key: '75', text: '75' },
  ]
  const swapped = beat > 2 || (beat === 2 && ph >= 1)
  const now = swapped ? [cells[1], cells[0], cells[2]].map((c) => ({ ...c, state: 'sorted' as const })) : cells
  const ran = beat > 2 || (beat === 2 && ph >= 2)
  return (
    <>
      <Frame
        left={<Run src={p.src} at={beat === 1 ? null : ran ? 3 : 2} out={outLines(p.output, ran)} />}
        right={
          <>
            <Question text={C.show[0]} />
            <Cells name="plays" cells={now as Cell[]} fit={before.map(String)} reserve={3} />
            <ShapeBox card={C} on={beat >= 3} />
          </>
        }
      />
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ================================================================== C10 sort or sorted */

export function SortOrSortedCard() {
  const C = SPEC.C10
  const [pSort, pSorted, pNone]: Prog[] = C.code
  const beat = useBeats(4)
  const [pick, setPick] = useVote()
  const options: string[] = C.show.slice(4, 7)
  const right = options.indexOf('None')
  const third = beat >= 3
  const HALF = 545
  return (
    <>
      {!third ? (
        <Appear key="first" className="flex flex-col gap-3">
        <Question text={C.show[0]} />
        <div className="flex items-start gap-[28px]">
          {[pSort, pSorted].map((pr, i) => (
            /* each program, its output and its label are one cluster (G3); the one being asked, sorted.py on press 1, wears the Focus ring (PF 24) */
            <Group key={pr.file} pad={8} className="flex flex-col gap-3" style={{ width: HALF + 16 }}>
              <Focus on={i === 1 && beat === 1}>
                <Run src={pr.src} at={i === 0 || beat >= 2 ? 3 : null} out={outLines(pr.output, i === 0 || beat >= 2)} width={HALF} />
              </Focus>
              <div className="self-start">
                <StepCaption tone="rule" text={beat >= 2 ? C.show[1 + i] : null} minH={46} />
              </div>
            </Group>
          ))}
        </div>
        </Appear>
      ) : (
        <Appear key="third">
        <Frame
          left={<Run src={pNone.src} at={beat === 4 ? 4 : null} out={outLines(pNone.output, beat === 4)} outRows={2} />}
          right={
            <>
              <Question text={C.show[3]}>
                <Vote options={options} right={right} shown={beat >= 4} pick={pick} setPick={setPick} cols={1} size={15} dense />
              </Question>
              <div className="flex flex-col gap-1 self-start">
                <CellRow font={CELL_FS} quote={false} name="plays" cells={cellsOf(beat === 4 ? [12, 40, 75] : [40, 12, 75], beat === 4 ? { 0: 'sorted', 1: 'sorted', 2: 'sorted' } : {})} reserve={3} />
                <div className="flex items-center gap-3" style={{ opacity: beat === 4 ? 1 : 0, transition: 'opacity 480ms' }}>
                  <span className="rounded-lg px-3 font-mono font-bold" style={{ height: 41, lineHeight: '41px', fontSize: CELL_FS + 1, background: colors.brandDark, color: colors.white }}>
                    new_plays
                  </span>
                  <span className="grid h-[41px] place-items-center rounded-xl px-4 font-mono font-semibold" style={{ fontSize: CELL_FS, color: colors.muted, border: `2px dashed ${colors.line}` }}>
                    None
                  </span>
                </div>
              </div>
              <div className="self-stretch">
                <StepCaption tone="rule" text={beat === 4 ? C.show[7] : null} minH={46} />
              </div>
            </>
          }
        />
        </Appear>
      )}
      {beat >= 4 && pick === right && <Confetti seed={93} />}
      <StepControls at={beat} total={4} />
    </>
  )
}
