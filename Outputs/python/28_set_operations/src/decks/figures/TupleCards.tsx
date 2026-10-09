import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Lines, Focus, Group } from './common'
import { Confetti } from './motion'
import { Ask, BigLine, DrawBox, Note, OutPanel, Show, Swap, sentences, type OutLine, CODE_FS, OUT_FS } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { useStepPhase } from './phase'
import { Row, flyFrom, py, type CellState } from './rows'
import { Bins, CodeChip } from './Recap'
import { SPEC } from './spec'

/**
 * THE TUPLE BLOCK: C6 (what a tuple is), C7 (creating one), C8 (one item
 * needs a comma), C9 (read it, never change it), C10 (operations) and C11
 * (converting to a tuple).
 *
 * The picture is the session's one picture (`rows.tsx`): a row of cells with
 * the index under each, a lock on a tuple, handles on a list. Every program
 * and output is the spec's, run on CPython 3.12.3; every output box fills
 * only on the press after the room has said or voted it.
 */
type Prog = { file: string; src: string; output: string }
const outOf = (p: Prog, n = Infinity): OutLine[] =>
  p.output
    .split('\n')
    .slice(0, n)
    .map((t) => ({ text: t, tone: /^[A-Z]\w*Error/.test(t) ? 'error' : 'plain' }))

/** A sentence beside a row, the row's own label (`List: you can change it.`). */
function RowNote({ children, on = true }: { children: ReactNode; on?: boolean }) {
  return (
    <Show on={on}>
      <p className="font-heading text-[21px] font-bold leading-snug" style={{ color: colors.ink }}>
        {children}
      </p>
    </Show>
  )
}

/* ------------------------------------------------------------------ C6 */

const C6 = SPEC.C6
const QUEUE: string[] = SPEC.H1.data.queue
const [SHOP, , AT] = SPEC.H1.data.record as [string, number, string]
/* C6 shows the corrected payment, 50, in Python's own double quotes (its first press) */
const PAYMENT = [`"${SHOP}"`, '50', `"${AT}"`]

/**
 * C6, three presses: Teja's payment as a row with 0, 1, 2 under it and
 * `Holds an ordered sequence of items`; beside it last class's queue as a
 * list row with handles, and the payment gets its lock; then the deck's word.
 */
export function WhatTuple() {
  const beat = useBeats(3)
  return (
    <>
      <div className="flex flex-col gap-7">
        <div className="rounded-card px-6 py-3" style={{ background: colors.surface2, boxShadow: `inset 4px 0 0 ${colors.brandDark}` }}>
          <span className="font-heading text-[28px] font-bold" style={{ color: colors.brandDark }}>
            {C6.show[0]}
          </span>
        </div>
        <div className="flex items-stretch gap-14">
          <Group className="flex w-[520px] shrink-0 flex-col gap-4">
            <span className="font-mono text-[17px] font-bold" style={{ color: colors.muted }}>
              payment
            </span>
            <Row items={PAYMENT} kind={beat >= 2 ? 'tuple' : 'plain'} size="lg" fit />
            <RowNote on={beat >= 2}>{sentences(C6.show[2])}</RowNote>
            <Show on={beat >= 3}>
              <span className="inline-block rounded-lg px-4 py-2 font-heading text-[22px] font-bold" style={{ background: '#FFF4EC', color: colors.accentDark }}>
                {sentences(C6.show[3])}
              </span>
            </Show>
          </Group>
          <Show on={beat >= 2} className="flex">
            <Group className="flex flex-1 flex-col gap-4">
            <span className="font-mono text-[17px] font-bold" style={{ color: colors.muted }}>
              queue
            </span>
            <Row items={QUEUE.map(py)} kind="list" size="md" />
            <RowNote>{sentences(C6.show[1])}</RowNote>
            </Group>
          </Show>
        </div>
      </div>
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ------------------------------------------------------------------ C7 */

const C7 = SPEC.C7
const P7: Prog = C7.code[0]

/** C7, three presses: create.py; both lines print, amount's cell shows 50; the rule. */
export function CreateTuple() {
  const beat = useBeats(3)
  const ran = beat >= 2
  return (
    <>
      <div className="flex items-stretch gap-10">
        <Group className="flex w-[540px] shrink-0 flex-col gap-3">
          <Ask size={22}>{C7.show[0]}</Ask>
          <Focus on={!ran}>
            <CodePane code={P7.src} fontSize={CODE_FS} />
          </Focus>
          <OutPanel lines={ran ? outOf(P7) : []} minRows={2} fontSize={OUT_FS} />
        </Group>
        <Group className="flex min-w-0 flex-1 flex-col gap-6">
          <span className="font-mono text-[17px] font-bold" style={{ color: colors.muted }}>
            payment
          </span>
          <Row items={[py(SHOP), ran ? '50' : 'amount', py(AT)]} kind="tuple" size="md" fit states={ran ? { 1: 'hit' } : { 1: 'check' }} />
          <Note on={beat >= 3} size={20} lines={sentences(C7.show[1])} />
        </Group>
      </div>
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ------------------------------------------------------------------ C8 */

const C8 = SPEC.C8
const P8: Prog[] = C8.code
const C8_CHOICES: string[] = C8.show.slice(1, 3)
const BLANK = '______________'

/** `amount = (50)` with a fixed place for the comma, so the brackets never move when it arrives; the comma ringed. */
function CommaLine({ comma }: { comma: boolean }) {
  return (
    <BigLine size={42} k={comma ? 'comma' : 'plain'}>
      amount = (50
      {/* the comma's place opens as it arrives; a square draws itself round it, as a pen would (G4) */}
      <span className="inline-block whitespace-nowrap align-bottom" style={{ width: comma ? '0.95em' : 0, transition: 'width 520ms cubic-bezier(0.22,1,0.36,1)' }}>
        {comma && (
          <span className="sm-bump relative mx-[0.16em] inline-block px-[0.1em] leading-[1.05]" style={{ color: colors.accentDark, animationDelay: '260ms' }}>
            ,
            <DrawBox on={comma} color={colors.accent} pad={4} delay={420} radius={4} />
          </span>
        )}
      </span>
      )
    </BigLine>
  )
}

/** amount drawn as a plain number (no lock, no row), or, once the comma is there, a locked row of one cell. */
function AmountPicture({ tuple }: { tuple: boolean }) {
  /* the plain 50 gives way to a locked row of one cell, a cross-fade in place (G1) */
  return (
    <Swap k={tuple ? 'row' : 'plain'}>
      {tuple ? (
        <Row items={['50']} kind="tuple" size="lg" />
      ) : (
        <span className="grid h-[62px] w-[78px] place-items-center rounded-full font-mono text-[24px] font-bold" style={{ background: colors.white, color: colors.ink, boxShadow: `inset 0 0 0 2px ${colors.line}` }}>
          50
        </span>
      )}
    </Swap>
  )
}

/**
 * C8, four presses: types.py with three empty output lines, vote tuple or
 * int for amount; the three types fill and line 2 lights with `amount = (50)
 * is an integer.`; one_item.py with line 1 blank; line 1 fills with the
 * comma ringed, the biggest text on the card, the 50 snaps into a locked row
 * of one cell, and the output fills.
 */
export function OneItem() {
  const beat = useBeats(4)
  const [pick, setPick] = useState(-1)
  const second = beat >= 3
  const prog = second ? P8[1] : P8[0]
  const code = beat === 3 ? prog.src.replace(/^[^\n]*/, BLANK) : prog.src
  const ran = beat === 2 || beat === 4
  const right = C8_CHOICES.indexOf('int')
  const caption = beat === 2 ? C8.show[3] : beat === 3 ? C8.show[4] : beat === 4 ? C8.show[5] : null
  return (
    <>
      <div className="flex items-stretch gap-8">
        <Group className="flex w-[460px] shrink-0 flex-col gap-3">
          <Focus on={!ran}>
            <CodePane code={code} fontSize={CODE_FS} rows={6} highlight={beat === 2 ? 2 : beat === 4 ? 1 : undefined} gap={beat === 3 ? 1 : undefined} />
          </Focus>
          <OutPanel lines={ran ? outOf(prog) : []} minRows={3} fontSize={OUT_FS} />
        </Group>
        <Group className="flex min-w-0 flex-1 flex-col gap-4" active={beat === 1 || beat === 3}>
          <Ask size={22}>{C8.show[0]}</Ask>
          <Vote options={C8_CHOICES} right={right} shown={beat >= 2} pick={pick} setPick={setPick} cols={2} size={20} />
          <div className="flex items-center gap-8" style={{ minHeight: 96 }}>
            {beat >= 2 && <CommaLine comma={beat >= 4} />}
            {beat >= 2 && <AmountPicture tuple={beat >= 4} />}
          </div>
          <StepCaption text={caption} tone={beat === 3 ? 'step' : 'rule'} size={20} minH={56} />
        </Group>
      </div>
      {beat === 2 && pick === right && <Confetti seed={81} />}
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ------------------------------------------------------------------ C9 */

const C9 = SPEC.C9
const P9: Prog[] = C9.code
const PRICES: number[] = C9.data.prices
/* the price board's items (C9 press 1); they label the cells and are not in the program */
const FOOD = ['Tea', 'Samosa', 'Maggi', 'Vada']
const CELL = 86
const NEW_PRICES = P9[3].output.replace(/[()]/g, '').split(', ')

/** The canteen's price board: the row of prices, the food over each cell. */
function Board({ items, states, shake, shakeKey, faded, tag, tagRef }: { items: string[]; states?: Record<number, CellState>; shake?: number; shakeKey?: number; faded?: boolean; tag: boolean; tagRef?: (el: HTMLSpanElement | null) => void }) {
  const tween = useTween(420)
  return (
    <div className="flex items-end gap-3" style={{ opacity: faded ? 0.38 : 1, transition: tween }}>
      <span className="w-[96px] shrink-0 pb-[22px]">
        {tag && (
          <span ref={tagRef} className="inline-block rounded-lg px-3 font-mono text-[18px] font-bold leading-[52px]" style={{ background: colors.brandDark, color: colors.white }}>
            prices
          </span>
        )}
      </span>
      <div className="flex flex-col gap-1">
        <div className="flex gap-[6px]">
          {FOOD.map((f) => (
            <span key={f} className="text-center text-[14px] font-semibold" style={{ width: CELL, color: colors.body }}>
              {f}
            </span>
          ))}
        </div>
        <Row items={items} kind="tuple" size="md" cellW={CELL} states={states} shake={shake} shakeKey={shakeKey} />
      </div>
    </div>
  )
}

/**
 * C9, six presses: read by index (cell 1 lights, 15); change item 3
 * (cell 2 shakes against the lock and stays 30, only the TypeError prints:
 * line 3 never runs); the recap's two bins, count and index slide into
 * `Gives back an answer` while append bounces off the lock; then the name
 * prices moves to a new row and the old row stays, faded, with its 30.
 */
export function ReadNever() {
  const beat = useBeats(6)
  const instant = useInstant()
  const prog = beat <= 2 ? P9[0] : beat <= 4 ? P9[1] : beat === 5 ? P9[2] : P9[3]
  const ran = beat === 2 || beat === 4 || beat === 5 || beat === 6
  /* a question stays on screen until the next one replaces it (review, 2026-10-08) */
  const ask = beat <= 2 ? C9.show[0] : C9.show[1]
  const caption = beat === 4 ? C9.show[2] : beat === 5 ? C9.show[3] : beat === 6 ? C9.show[4] : null
  const states: Record<number, CellState> = beat === 2 ? { 1: 'lit' } : beat === 4 ? { 2: 'bad' } : {}
  const oldTag = useRef<HTMLSpanElement | null>(null)
  const newTag = useRef<HTMLSpanElement | null>(null)
  const was = useRef(beat)
  useLayoutEffect(() => {
    if (beat === 6 && was.current === 5 && !instant) flyFrom(newTag.current, oldTag.current, 900)
    was.current = beat
  }, [beat, instant])
  const toolLines = P9[2].src.split('\n').slice(1).map((l) => l.replace(/^print\((.*)\)$/, '$1'))
  return (
    <>
      <div className="flex items-stretch gap-8">
        <Group className="flex w-[500px] shrink-0 flex-col gap-3">
          <Focus on={beat === 1 || beat === 3}>
            <CodePane code={prog.src} fontSize={CODE_FS} rows={4} highlight={beat === 3 || beat === 4 ? 2 : undefined} at={beat === 4 ? 2 : null} stop={beat === 4} />
          </Focus>
          <OutPanel lines={ran ? outOf(prog) : []} minRows={3} fontSize={OUT_FS} />
          <StepCaption text={caption} tone="rule" size={18} minH={52} />
        </Group>
        <Group className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="min-h-[30px]">
            <Swap k={ask}>
              <Ask size={22}>{ask}</Ask>
            </Swap>
          </div>
          <Board items={PRICES.map(String)} states={states} shake={2} shakeKey={beat === 4 ? 4 : undefined} faded={beat === 6} tag={beat < 6} tagRef={(el) => (oldTag.current = el)} />
          {beat === 5 && (
            <div className="flex flex-col gap-3">
              <span className="sm-bump inline-block self-start">
                <span className="inline-block" style={{ animation: instant ? undefined : 'c9-bounce 900ms cubic-bezier(0.22,1,0.36,1) 300ms both' }}>
                  <CodeChip tone="bounce">{toolLines[2]}</CodeChip>
                </span>
              </span>
              <Bins width={250} minH={120} lit={1} items={toolLines.slice(0, 2).map((t) => ({ text: t, bin: 1 }))} />
              <style>{'@keyframes c9-bounce { 0% { transform: translateY(0) } 35% { transform: translateY(-34px) } 60% { transform: translateY(6px) } 100% { transform: translateY(0) } }'}</style>
            </div>
          )}
          {beat === 6 && <Board items={NEW_PRICES} states={{ 2: 'new' }} tag tagRef={(el) => (newTag.current = el)} />}
        </Group>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}

/* ------------------------------------------------------------------ C10 */

const C10 = SPEC.C10
const P10: Prog[] = C10.code
const MENU: string[] = C10.data.menu
const OPS: string[] = C10.show.slice(0, 4)
/* the cells each operation takes, read from its program */
function takenBy(src: string, phase: number, n: number): Record<number, CellState> {
  const m = src.match(/\[(\d+):(\d+)(?::(\d+))?\]/)
  if (m) {
    const out: Record<number, CellState> = {}
    for (let i = +m[1]; i < +m[2]; i += +(m[3] ?? 1)) out[i] = 'hit'
    return out
  }
  if (/for /.test(src)) return phase >= 1 ? { [Math.min(phase, n) - 1]: 'lit' } : {}
  return Object.fromEntries(MENU.map((_, i) => [i, 'hit']))
}

function OpArrow({ label, lit, done }: { label: string; lit: boolean; done: boolean }) {
  const tween = useTween(420)
  const instant = useInstant()
  const c = lit ? colors.success : done ? `${colors.success}99` : colors.line
  return (
    <div className="flex items-center gap-4">
      {/* the deck's green arrow draws itself toward its operation when that one is asked (2b, item 10) */}
      <svg width="58" height="18" viewBox="0 0 58 18" aria-hidden>
        <path d="M3 9 H44" stroke={colors.line} strokeWidth="4" strokeLinecap="round" />
        <path
          d="M3 9 H44"
          stroke={lit || done ? c : colors.line}
          strokeWidth="4"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          style={{ strokeDashoffset: lit || done ? 0 : 1, transition: instant ? 'none' : 'stroke-dashoffset 640ms cubic-bezier(0.65,0,0.35,1), stroke 420ms' }}
        />
        <path d="M43 3 L54 9 L43 15 Z" fill={c} style={{ transition: instant ? 'none' : `fill 240ms ease-out ${lit ? 560 : 0}ms` }} />
      </svg>
      <span className="rounded-lg px-3 py-1 font-mono text-[22px] font-semibold" style={{ color: lit ? colors.ink : colors.brandDark, background: lit ? '#E9F8EF' : 'transparent', boxShadow: lit ? `inset 0 0 0 2px ${colors.success}` : 'none', transition: tween }}>
        {label}
      </span>
    </div>
  )
}

/**
 * C10, five presses: the menu as a locked row and the deck's four
 * operations with their arrows; each press lights one, its line shows under
 * the cells, and once the room has said it the output fills, the cells it
 * takes lighting with it (a loop walks them one by one).
 */
export function TupleOps() {
  const beat = useBeats(5)
  const op = beat - 2 /* -1 before the first */
  const prog = op >= 0 ? P10[op] : null
  const lines = prog ? prog.output.split('\n') : []
  /* the line shows at once; the room says it; the output fills after a beat, one line per beat */
  const phase = useStepPhase(beat, [1800, ...lines.slice(1).map(() => 520)])
  const shown = prog ? lines.slice(0, op === 1 ? phase : phase >= 1 ? lines.length : 0) : []
  const code = prog ? prog.src : P10[0].src.split('\n')[0]
  return (
    <>
      <div className="flex items-stretch gap-10">
        <Group className="flex w-[560px] shrink-0 flex-col gap-4">
          <Ask size={22}>{C10.show[4]}</Ask>
          <CodePane code={code} fontSize={CODE_FS} rows={3} mark={prog ? [2, 3].filter((l) => l <= code.split('\n').length) : undefined} />
          <Row items={MENU.map(py)} kind="tuple" size="sm" name="menu" states={prog && shown.length ? takenBy(prog.src, phase, MENU.length) : {}} />
        </Group>
        <Group className="flex min-w-0 flex-1 flex-col gap-3" active={op >= 0 && shown.length === 0}>
          {OPS.map((o, i) => (
            <OpArrow key={o} label={o} lit={i === op} done={i < op} />
          ))}
          <OutPanel key={op} lines={shown.map((t) => ({ text: t }))} minRows={4} fontSize={OUT_FS} />
        </Group>
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}

/* ------------------------------------------------------------------ C11 */

const C11 = SPEC.C11
const P11: Prog[] = C11.code
/* what each program hands tuple(): the string's letters, the range's numbers, the cart's items */
const SOURCES: { label: string; out: string; kind: 'plain' | 'list'; items: string[]; shown: string[] }[] = [
  { label: 'item', out: 'letters', kind: 'plain', items: ['T', 'e', 'a'], shown: ['T', 'e', 'a'] },
  { label: 'range(1, 5)', out: 'tokens', kind: 'plain', items: ['1', '2', '3', '4'], shown: ['1', '2', '3', '4'] },
  { label: 'cart', out: 'order', kind: 'list', items: ['Tea', 'Samosa'], shown: ["'Tea'", "'Samosa'"] },
]

/** The source row, and the new locked row its items fly into one at a time. */
function Convert({ k, arrived }: { k: number; arrived: number }) {
  const src = SOURCES[k]
  const from = useRef<(HTMLSpanElement | null)[]>([])
  const to = useRef<(HTMLSpanElement | null)[]>([])
  const instant = useInstant()
  const seen = useRef(arrived)
  useLayoutEffect(() => {
    if (arrived > seen.current && !instant) flyFrom(to.current[arrived - 1], from.current[arrived - 1], 700)
    seen.current = arrived
  }, [arrived, instant])
  const outItems = src.kind === 'plain' && k === 0 ? src.items.map((c) => `'${c}'`) : src.shown
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="w-[130px] shrink-0 text-right font-mono text-[17px] font-bold" style={{ color: colors.brandDark }}>
          {src.label}
        </span>
        <Row items={src.shown} kind={src.kind} size="md" cellRefs={from} />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-[130px] shrink-0 text-right font-mono text-[17px] font-bold" style={{ color: colors.brandDark }}>
          {src.out}
        </span>
        <Row items={outItems} kind="tuple" size="md" cellRefs={to} hidden={outItems.map((_, i) => i).filter((i) => i >= arrived)} states={Object.fromEntries(outItems.map((_, i) => [i, 'new']))} />
      </div>
    </div>
  )
}

/**
 * C11, four presses: the deck's `tuple(sequence)` with its sentence and
 * tuple_str.py, output empty; the letters of "Tea" fly one per cell into a
 * locked row; then the range of tokens; then the cart. The source stays as
 * it was every time: tuple() makes a new row.
 */
export function ToTuple() {
  const beat = useBeats(4)
  const k = beat <= 2 ? 0 : beat - 2
  const prog = P11[k]
  const n = SOURCES[k].items.length
  const phase = useStepPhase(beat, [300, ...Array(n - 1).fill(560)])
  const arrived = beat === 1 ? 0 : Math.min(phase, n)
  const ran = beat >= 2 && arrived >= n
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-6 rounded-card px-5 py-2.5" style={{ background: colors.surface2, boxShadow: `inset 4px 0 0 ${colors.brandDark}` }}>
          <span className="whitespace-nowrap font-mono text-[24px] font-bold" style={{ color: colors.brandDark }}>
            {C11.show[0]}
          </span>
          <span className="text-[19px] font-semibold" style={{ color: colors.body }}>
            <Lines lines={sentences(C11.show[1])} />
          </span>
        </div>
        <div className="flex items-stretch gap-8">
          <Group className="flex w-[460px] shrink-0 flex-col gap-3">
            <Ask size={22}>{C11.show[2]}</Ask>
            <Focus on={!ran}>
              <CodePane code={prog.src} fontSize={CODE_FS} rows={3} />
            </Focus>
            <OutPanel lines={ran ? outOf(prog) : []} fontSize={OUT_FS} />
          </Group>
          <Group className="flex min-w-0 flex-1 flex-col justify-center self-stretch">
            <Convert k={k} arrived={arrived} />
          </Group>
        </div>
      </div>
      <StepControls at={beat} total={4} />
    </>
  )
}
