import { useRef, useState } from 'react'
import { Focus, Group } from './common'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Confetti } from './motion'
import { Appear, Ask, Fresh, Note, OutPanel, type OutLine, CODE_FS, OUT_FS } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { useStepPhase } from './phase'
import { CountBar, NameBox, Row, py } from './rows'
import { SPEC } from './spec'

/**
 * UNPACKING: C15 (one name per value) and E1 (Python counts before it
 * unpacks). The name boxes are one component, `NameBox`, here and on G2, C16
 * and C17 (C15's play line). The order row stays as it was the whole card:
 * after unpacking, Maggi, 2 and 60 are still in it (the keeps lines).
 *
 * Every program, output and walk step is the spec's, run on CPython 3.12.3.
 */
type Prog = { file: string; src: string; output: string }
const outOf = (out: string): OutLine[] => out.split('\n').map((t) => ({ text: t, tone: /^[A-Z]\w*Error/.test(t) ? 'error' : 'plain' }))

/** A small program with its output on one strip under it (C15's last press). */
function SmallProg({ prog }: { prog: Prog }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <CodePane code={prog.src} fontSize={CODE_FS} rows={3} />
      <div className="flex items-center gap-3 rounded-xl border border-line bg-white px-3 py-1.5">
        <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.success }}>
          Output
        </span>
        <span className="sm-bump font-mono text-[17px] font-semibold" style={{ color: colors.ink }}>
          {prog.output}
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ C15 */

const C15 = SPEC.C15
const P15: Prog[] = C15.code
const ORDER: (string | number)[] = SPEC.E1.data.values
const C15_NAMES = ['item', 'qty', 'price']

/**
 * C15, four presses: unpack.py, the order as cells and three empty name
 * boxes; Maggi, 2 and 60 fly into their boxes, left to right, in one
 * movement, and the output fills; the deck's two lines; the list and string
 * versions with their outputs, and the rule.
 */
export function Unpacking() {
  const beat = useBeats(4)
  const cells = useRef<(HTMLSpanElement | null)[]>([])
  const phase = useStepPhase(beat, [250, 260, 260, 500])
  const into = beat === 2 ? Math.min(phase, 3) : beat >= 3 ? 3 : 0
  const ran = (beat === 2 && phase >= 4) || beat >= 3
  return (
    <>
      <div className="flex items-stretch gap-8">
        <Group className="flex w-[470px] shrink-0 flex-col gap-3">
          {beat < 4 ? (
            <>
              <Focus on={beat === 1}>
                <CodePane code={P15[0].src} fontSize={CODE_FS} rows={5} highlight={beat === 2 ? 2 : undefined} />
              </Focus>
              <OutPanel lines={ran ? outOf(P15[0].output) : []} minRows={3} fontSize={OUT_FS} />
            </>
          ) : (
            /* deck slide 38: the list and the string, each with what it prints */
            <Appear className="flex flex-col gap-3">
              <SmallProg prog={P15[1]} />
              <SmallProg prog={P15[2]} />
            </Appear>
          )}
        </Group>
        <Group className="flex min-w-0 flex-1 flex-col gap-4" active={beat === 2}>
          <Ask size={22}>{C15.show[2]}</Ask>
          {/* the tag is the row's own, so it sits on the cells' centre line, not the cells-and-indices block's (review, 2026-10-08) */}
          <div className="flex items-start">
            <Row items={ORDER.map(py)} kind="tuple" size="md" cellW={100} cellRefs={cells} name="order" />
          </div>
          <div className="flex gap-3 pl-[86px]">
            {C15_NAMES.map((n, i) => (
              <NameBox key={n} name={n} width={100} value={into > i ? py(ORDER[i]) : null} from={cells.current[i]} />
            ))}
          </div>
          <Note on={beat >= 3} size={17} lines={[C15.show[0], C15.show[1]]} />
          <StepCaption text={beat >= 4 ? C15.show[3] : null} tone="rule" size={18} minH={50} />
        </Group>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ------------------------------------------------------------------ E1 */

const E1 = SPEC.E1
type WalkStep = { caption: string; values?: number; names?: number; boxes: Record<string, string | number | null>; error?: string; printed?: string }
type Walk = { src: string; output: string; steps: WalkStep[] }
const WALKS: Record<string, Walk> = E1.data.walks
/* the order the slider visits: 2 (the start), then 4, then 3 (the spec's presses) */
const ORDER_N = [2, 4, 3]
type Beat = { n: number; s: number } /* s = -1: the slider has moved, nothing run yet */
const SCHEDULE: Beat[] = ORDER_N.flatMap((n) => [{ n, s: -1 }, ...WALKS[String(n)].steps.map((_, s) => ({ n, s }))])

/** The slider: only 2, 3 and 4 (its must_not), moved by the presses, never by a hand. */
function Slider({ n }: { n: number }) {
  const tween = useTween(560)
  const stops = [2, 3, 4]
  return (
    <div className="flex flex-col gap-2 rounded-card bg-white px-4 py-3" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
      <span className="text-[16px] font-bold" style={{ color: colors.ink }}>
        {E1.show[0]}
      </span>
      <div className="relative mx-3 h-[34px]">
        <span className="absolute inset-x-0 top-[15px] h-[4px] rounded-full" style={{ background: colors.line }} />
        {stops.map((s, i) => (
          <span key={s} className="absolute top-0 grid h-[34px] w-[34px] -translate-x-1/2 place-items-center rounded-full font-mono text-[16px] font-bold" style={{ left: `${i * 50}%`, background: s === n ? colors.brandDark : colors.white, color: s === n ? colors.white : colors.muted, boxShadow: `inset 0 0 0 2px ${s === n ? colors.brandDark : colors.line}`, transition: tween }}>
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * E1, twelve presses: the 2-name walk, the 4-name walk, then the 3-name walk.
 * Each walk opens with the slider's move and its program, boxes empty; then
 * one step per press from the spec's walk: the count first, on its own press,
 * before any value moves; on a mismatch Python stops and every box stays
 * empty (no value is placed and taken back); on a match one value per press
 * goes into its box, left to right, then the print.
 */
export function CountFirst() {
  const beat = useBeats(SCHEDULE.length)
  const b = SCHEDULE[beat - 1]
  const walk = WALKS[String(b.n)]
  const step = b.s >= 0 ? walk.steps[b.s] : null
  const names = Object.keys(walk.steps[0].boxes)
  const boxes = step ? step.boxes : Object.fromEntries(names.map((k) => [k, null]))
  const counted = b.s >= 0
  const stop = !!step?.error
  const out = step?.error ?? step?.printed ?? null
  const cells = useRef<(HTMLSpanElement | null)[]>([])
  const [pick, setPick] = useState(-1)
  const right = 'ABC'.indexOf(E1.data.right)
  const voted = beat >= 3
  const caption = step ? step.caption : b.n === 2 ? E1.show[1] : null
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-stretch gap-8">
          <Group className="flex w-[430px] shrink-0 flex-col gap-3">
            <Slider n={b.n} />
            <CodePane code={walk.src} fontSize={CODE_FS} rows={3} highlight={2} at={stop ? 2 : null} stop={stop} />
            <OutPanel lines={out ? outOf(out) : []} fontSize={OUT_FS} />
          </Group>
          <Group className="flex min-w-0 flex-1 flex-col gap-3.5" active={b.s >= 0}>
            {/* the tag is the row's own, so it sits on the cells' centre line, not the cells-and-indices block's (review, 2026-10-08) */}
          <div className="flex items-start">
            <Row items={(E1.data.values as (string | number)[]).map(py)} kind="tuple" size="md" cellW={100} cellRefs={cells} name="order" />
          </div>
            <div className="min-h-[38px]">
              <CountBar values={3} names={b.n} on={counted} />
            </div>
            <Fresh k={b.n} className="flex gap-3">
              {names.map((n, i) => (
                <NameBox key={`${b.n}-${n}`} name={n} width={112} value={boxes[n] === null || boxes[n] === undefined ? null : py(boxes[n])} from={cells.current[i]} tone={stop ? 'stop' : 'plain'} />
              ))}
            </Fresh>
            <StepCaption badge={step ? `step ${b.s + 1}` : null} text={caption} tone={stop ? 'rule' : 'step'} size={18} minH={52} />
          </Group>
        </div>
        <Group pad={8}>
          <Vote options={E1.data.options} right={right} shown={voted} pick={pick} setPick={setPick} cols={3} size={16} dense mono={false} template="340px 300px 1fr" />
        </Group>
      </div>
      {beat === 3 && pick === right && <Confetti seed={61} />}
      <StepControls at={beat} total={SCHEDULE.length} />
    </>
  )
}
