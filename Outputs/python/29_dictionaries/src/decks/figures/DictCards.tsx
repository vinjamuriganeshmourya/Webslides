import { useLayoutEffect, useRef, useState } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Focus, Group } from './common'
import { Ask, Fresh, OutPanel, Swap, CODE_FS, OUT_FS } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { useStepPhase } from './phase'
import { Confetti } from './motion'
import { Board, TagArrow, menuRows, type BoardRefs, type Row, type RowTone } from './board'
import { BoardCard, DeckLine } from './frame'
import { flyFrom } from './rows'
import { SPEC } from './spec'

/**
 * WHAT A DICTIONARY IS: C1 (the board is a dictionary), C2 (writing the
 * board in Python), C3 ({} is a dictionary), C4 (one key, one value).
 * Every program and output is the spec's, run on CPython 3.12.3.
 */
const MENU: Row[] = menuRows(SPEC)

/* ------------------------------------------------------------------ C1 */

const C1 = SPEC.C1

/** Deck slide 16's picture: key_1 to value_1, key_2 to value_2, and dots. */
function DeckPicture() {
  return (
    <div className="flex flex-col gap-2.5 rounded-xl px-4 py-3" style={{ background: colors.white, boxShadow: `inset 0 0 0 2px ${colors.warning}` }}>
      {[1, 2].map((n) => (
        <div key={n} className="flex items-center">
          <span className="grid place-items-center rounded-md px-3 font-mono text-[15px] font-bold" style={{ height: 34, background: colors.brandDark, color: colors.white }}>
            key_{n}
          </span>
          <TagArrow w={40} draw={false} />
          <span className="grid place-items-center rounded-md px-3 font-mono text-[15px] font-bold" style={{ height: 34, background: colors.white, color: colors.brandDark, boxShadow: `inset 0 0 0 2px ${colors.brand}` }}>
            value_{n}
          </span>
        </div>
      ))}
      <div className="flex items-center font-mono text-[18px] font-bold leading-none" style={{ color: colors.brandDark }}>
        <span className="grid place-items-center" style={{ width: 72 }}>⋮</span>
        <span style={{ width: 40 }} />
        <span className="grid place-items-center" style={{ width: 88 }}>⋮</span>
      </div>
    </div>
  )
}

/**
 * C1, three presses: the five rows from the hook as tags and cards, deck
 * slide 16's picture beside them, and the question. Press 2 labels the two
 * columns key and value. Press 3 boxes the tea row as one item.
 */
export function WhatDict() {
  const beat = useBeats(3)
  return (
    <>
      <div className="flex items-stretch gap-3" style={{ height: 431 }}>
        <Group pad={10} className="flex w-[560px] shrink-0 flex-col gap-2" active={beat >= 2}>
          <div className="flex min-h-0 flex-1 items-start pt-4">
            <Board rows={MENU} size="lg" labels={beat >= 2} boxed={beat >= 3 ? 'tea' : undefined} style={{ paddingRight: 14 + 64 }} />
          </div>
          <StepCaption text={beat === 1 ? null : C1.show[3]} size={16} minH={56} />
        </Group>
        <Group pad={14} className="flex min-w-0 flex-1 flex-col gap-4">
          <Ask size={22}>{C1.show[4]}</Ask>
          <DeckPicture />
          <DeckLine text={C1.show[2]} on={beat >= 3} size={17} />
        </Group>
      </div>
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ------------------------------------------------------------------ C2 */

const C2 = SPEC.C2
const MENU3: Row[] = MENU.slice(0, 3)
const PROG2 = C2.code[0]
const LINE_FS = 22
/* The line's box: room for the Key and Value pointers above (15px label and a 22px arrow) and the Item bracket below
   (14px bracket and a 15px label). Trimmed from 42 / 50 / 36 so the output group under it holds menu.py and its
   two-line output inside its own padding (fix pass, 2026-10-12). */
const LINE_PT = 38
const LINE_H = 46
const LINE_PB = 30

/** One token of the line being written: a name tag's text, a price, a colon, a comma. */
function Token({ text, kind, from, fly, delay = 0 }: { text: string; kind: 'key' | 'value' | 'punct'; from?: HTMLElement | null; fly: boolean; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const instant = useInstant()
  useLayoutEffect(() => {
    if (instant) return
    if (fly && from) flyFrom(ref.current, from, 820, delay, 0.5)
    else ref.current?.animate([{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'backwards' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const color = kind === 'key' ? '#0E9285' : kind === 'value' ? colors.accentDark : colors.body
  return (
    <span ref={ref} className="inline-block whitespace-pre font-mono font-bold" style={{ fontSize: LINE_FS, color, lineHeight: 1.3 }}>
      {text}
    </span>
  )
}

/** A label with an arrow pointing down at a token (deck slide 18: Key, Value); `Item` is a bracket under the pair. */
function Pointer({ label, x, w, below = false, on }: { label: string; x: number; w: number; below?: boolean; on: boolean }) {
  const tween = useTween(480)
  return (
    <div className="absolute flex flex-col items-center" style={{ left: x, width: w, top: below ? LINE_PT + LINE_H : 0, opacity: on ? 1 : 0, transition: tween }}>
      {!below && (
        <>
          <span className="font-heading text-[15px] font-bold leading-none" style={{ color: colors.accentDark }}>{label}</span>
          <svg width="14" height="22" viewBox="0 0 14 22" aria-hidden>
            <path d="M7 1 V12" stroke={colors.warning} strokeWidth="2.5" strokeLinecap="butt" />
            <path d="M2.5 12 L7 20 L11.5 12 Z" fill={colors.warning} />
          </svg>
        </>
      )}
      {below && (
        <>
          <svg width={w} height="14" viewBox={`0 0 ${w} 14`} aria-hidden>
            <path d={`M2 1 V10 H${w - 2} V1`} stroke={colors.warning} strokeWidth="2.5" fill="none" />
            <circle cx="2" cy="2" r="2.5" fill={colors.warning} />
            <circle cx={w - 2} cy="2" r="2.5" fill={colors.warning} />
          </svg>
          <span className="font-heading text-[15px] font-bold leading-none" style={{ color: colors.accentDark }}>{label}</span>
        </>
      )}
    </div>
  )
}

/**
 * C2, six presses: three board rows and `menu = { }`. One pair per press
 * (2 to 4): the tag flies in as "tea", a colon, its card flies in as 12,
 * then a comma; Key, Value and Item point at the first pair. Press 5 shows
 * menu.py with its two print lines and an empty output; press 6 fills it.
 */
export function CreateDict() {
  const beat = useBeats(6)
  const refs = useRef<BoardRefs>({ tags: {}, cards: {}, rows: {} })
  const pairs = Math.min(Math.max(beat - 1, 0), 3)
  const lineRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ key: [number, number]; value: [number, number]; item: [number, number] } | null>(null)
  useLayoutEffect(() => {
    /* the pointers live in the padded wrapper round the line (so they are inside their box, box-overflow-check), measured against it */
    const host = lineRef.current?.parentElement as HTMLElement | null
    if (!host || pairs < 1) return
    const k = host.querySelector<HTMLElement>('[data-tok="key-0"]')
    const v = host.querySelector<HTMLElement>('[data-tok="value-0"]')
    if (!k || !v) return
    const h = host.getBoundingClientRect()
    const sc = host.offsetWidth ? h.width / host.offsetWidth : 1
    const kr = k.getBoundingClientRect()
    const vr = v.getBoundingClientRect()
    setPos({ key: [(kr.left - h.left) / sc, kr.width / sc], value: [(vr.left - h.left) / sc, vr.width / sc], item: [(kr.left - h.left) / sc, (vr.right - kr.left) / sc] })
  }, [pairs])
  const tones: Record<string, RowTone> = {}
  if (beat >= 2 && beat <= 4) tones[MENU3[beat - 2].key] = 'lit'
  const out = beat >= 6 ? PROG2.output.split('\n').map((t: string) => ({ text: t })) : []
  return (
    <>
      <div className="flex items-stretch gap-3" style={{ height: 431 }}>
        <Group pad={10} className="flex w-[380px] shrink-0 flex-col gap-2" active={beat >= 2 && beat <= 4}>
          <div className="flex min-h-0 flex-1 items-start pt-4">
            <Board rows={MENU3} tones={tones} size="lg" refs={refs} />
          </div>
          <StepCaption text={beat >= 5 ? C2.show[3] : null} size={16} minH={56} />
        </Group>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Group pad={10} className="flex flex-col gap-2" active={beat <= 4}>
            <div className="relative px-2" style={{ paddingTop: LINE_PT, paddingBottom: LINE_PB }}>
              {pos && (
                <>
                  <Pointer label={C2.show[0]} x={pos.key[0]} w={pos.key[1]} on={pairs >= 1} />
                  <Pointer label={C2.show[1]} x={pos.value[0]} w={pos.value[1]} on={pairs >= 1} />
                  <Pointer label={C2.show[2]} x={pos.item[0]} w={pos.item[1]} below on={pairs >= 1} />
                </>
              )}
              <div ref={lineRef} className="relative flex items-baseline rounded-xl bg-white px-4 py-2" style={{ boxShadow: `inset 0 0 0 2px ${colors.line}`, minHeight: LINE_H }}>
                <span className="whitespace-pre font-mono font-bold" style={{ fontSize: LINE_FS, color: colors.ink, lineHeight: 1.3 }}>menu = {'{'}</span>
                {MENU3.slice(0, pairs).map((r, i) => (
                  <span key={r.key} className="inline-flex items-baseline">
                    {i > 0 && <Token text=", " kind="punct" fly={false} delay={0} />}
                    <span data-tok={`key-${i}`} className="inline-block">
                      <Token text={`"${r.key}"`} kind="key" from={refs.current.tags[r.key]} fly={beat === i + 2} delay={0} />
                    </span>
                    <Token text=": " kind="punct" fly={false} delay={beat === i + 2 ? 700 : 0} />
                    <span data-tok={`value-${i}`} className="inline-block">
                      <Token text={String(r.value)} kind="value" from={refs.current.cards[r.key]} fly={beat === i + 2} delay={beat === i + 2 ? 800 : 0} />
                    </span>
                  </span>
                ))}
                <span className="whitespace-pre font-mono font-bold" style={{ fontSize: LINE_FS, color: colors.ink, lineHeight: 1.3 }}>{'}'}</span>
              </div>
            </div>
          </Group>
          {beat >= 5 && (
            <Group pad={10} className="flex min-h-0 flex-1 flex-col gap-2" active>
              <Fresh k="menu.py">
                <CodePane code={PROG2.src} fontSize={CODE_FS} rows={3} />
              </Fresh>
              <OutPanel lines={out} minRows={2} fontSize={OUT_FS} />
            </Group>
          )}
        </div>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}

/* ------------------------------------------------------------------ C3 */

const C3 = SPEC.C3
const [EMPTY, EMPTY_DICT, PAIR_OR_NOT] = C3.code as { file: string; src: string; output: string }[]

/** A program with its own output under it. */
function Mini({ prog, on, w = 340, rows = 2 }: { prog: { src: string; output: string }; on: boolean; w?: number; rows?: number }) {
  return (
    <div className="flex flex-col gap-2" style={{ width: w }}>
      <CodePane code={prog.src} fontSize={CODE_FS} rows={rows} />
      <OutPanel lines={on ? [{ text: prog.output }] : []} minRows={1} fontSize={OUT_FS} />
    </div>
  )
}

/**
 * C3, three presses: an empty board, empty.py and the vote (set or dict).
 * Press 2 fills <class 'dict'> and brings dict() beside it. Press 3 is the
 * comparison: {"tea", 12} with no colon is a set.
 */
export function EmptyDict() {
  const beat = useBeats(3)
  const [pick, setPick] = useState(-1)
  const shown = beat >= 2
  const right = C3.show.indexOf("<class 'dict'>") - 1
  const caption = beat === 1 ? C3.show[0] : beat === 2 ? C3.show[3] : C3.show[4]
  return (
    <>
      <div className="flex items-stretch gap-3" style={{ height: 431 }}>
        <div className="flex w-[730px] shrink-0 flex-col gap-2.5">
          <Group pad={10} className="flex flex-col gap-2.5" active={beat === 1}>
            <Swap k={beat >= 3 ? 'pair' : 'empty'}>
              {beat >= 3 ? (
                <div className="flex items-start gap-3">
                  <Mini prog={PAIR_OR_NOT} on rows={1} w={400} />
                  <div className="flex min-w-0 flex-1 flex-col gap-2 pt-1">
                    <span className="whitespace-pre rounded-lg px-3 py-1.5 font-mono text-[16px] font-bold" style={{ background: colors.white, color: colors.ink, boxShadow: `inset 0 0 0 2px ${colors.line}` }}>
                      {'{"tea"'}<span style={{ color: colors.brand, background: colors.surface2, borderRadius: 4 }}>:</span>{' 12}'}<span className="ml-3 font-sans text-[14px] font-semibold" style={{ color: colors.brandDark }}>a pair, so a dictionary</span>
                    </span>
                    <span className="whitespace-pre rounded-lg px-3 py-1.5 font-mono text-[16px] font-bold" style={{ background: colors.white, color: colors.ink, boxShadow: `inset 0 0 0 2px ${colors.line}` }}>
                      {'{"tea"'}<span style={{ color: colors.danger, background: '#FDECEC', borderRadius: 4 }}>,</span>{' 12}'}<span className="ml-3 font-sans text-[14px] font-semibold" style={{ color: colors.danger }}>no colon, so a set</span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <Focus on={beat === 1}>
                    <Mini prog={EMPTY} on={shown} />
                  </Focus>
                  {beat >= 2 && (
                    <Fresh k="dict()">
                      <Mini prog={EMPTY_DICT} on />
                    </Fresh>
                  )}
                </div>
              )}
            </Swap>
            {beat <= 2 && <Vote options={[C3.show[1], C3.show[2]]} right={right} shown={shown} pick={pick} setPick={setPick} cols={2} size={18} nowrap dense />}
          </Group>
          <div className="flex min-h-0 flex-1 flex-col" style={{ opacity: beat >= 2 ? 1 : 0, transition: 'opacity 480ms cubic-bezier(0.22,1,0.36,1)' }}>
            <Group pad={10} className="flex min-h-0 flex-1 flex-col justify-center">
              <DeckLine text={C3.show[3]} on={beat >= 2} size={17} />
            </Group>
          </div>
        </div>
        <Group pad={10} className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex min-h-0 flex-1 items-start pt-4">
            <Board rows={[]} size="lg" name="box" minRows={3} empty="nothing on the board" style={{ width: 290 }} />
          </div>
          <StepCaption text={caption} size={16} minH={56} />
        </Group>
      </div>
      {shown && pick === right && <Confetti seed={13} />}
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ------------------------------------------------------------------ C4 */

const C4 = SPEC.C4
const [TEA_TWICE, SAME_PRICE] = C4.code as { file: string; src: string; output: string }[]
const OPTS4: string[] = C4.show.slice(1, 5)
const RIGHT4 = OPTS4.indexOf(TEA_TWICE.output.split('\n')[0])

/**
 * C4, three presses: tea_twice.py and four options. Press 2 builds the
 * board inside the press: tea 12, samosa 15, then the second tea's 14 is
 * stuck over the 12 in tea's own row, and the output fills. Press 3 is
 * same_price.py: coffee and samosa both 15, and the deck's line.
 */
export function KeysOnce() {
  const beat = useBeats(3)
  const [pick, setPick] = useState(-1)
  const shown = beat >= 2
  const build = useStepPhase(beat, [250, 650, 900])
  let rows: Row[] = []
  let stuck: string[] = []
  const tones: Record<string, RowTone> = {}
  if (beat === 2) {
    rows = build >= 2 ? [{ key: 'tea', value: build >= 3 ? 14 : 12 }, { key: 'samosa', value: 15 }] : build >= 1 ? [{ key: 'tea', value: 12 }] : []
    if (build >= 3) stuck = ['tea']
  } else if (beat === 3) {
    rows = MENU.slice(0, 3)
    tones.coffee = 'lit'
    tones.samosa = 'lit'
  }
  const prog = beat === 3 ? SAME_PRICE : TEA_TWICE
  const out = beat === 2 ? TEA_TWICE.output.split('\n').map((t: string) => ({ text: t })) : beat === 3 ? [{ text: SAME_PRICE.output }] : []
  return (
    <>
      <BoardCard
        code={prog.src}
        codeKey={prog.file}
        rows={3}
        asking={beat === 1}
        ask={beat === 1 ? C4.show[0] : undefined}
        vote={beat <= 2 ? <Vote options={OPTS4} right={RIGHT4} shown={shown} pick={pick} setPick={setPick} template="1.45fr 1fr" size={15} nowrap dense /> : undefined}
        out={out}
        outMinRows={2}
        note={beat === 3 ? <DeckLine text={C4.show[6]} /> : undefined}
        board={<Board rows={rows} stuck={stuck} tones={tones} size="lg" name="menu" minRows={3} empty="nothing on the board yet" style={{ width: 290 }} />}
        boardActive={beat >= 2}
        caption={beat === 1 ? C4.show[0] : beat === 2 ? C4.show[5] : C4.show[6]}
      />
      {shown && pick === RIGHT4 && <Confetti seed={14} />}
      <StepControls at={beat} total={3} />
    </>
  )
}

