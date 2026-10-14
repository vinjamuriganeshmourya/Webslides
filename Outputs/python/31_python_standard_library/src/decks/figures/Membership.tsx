import { useLayoutEffect, useRef } from 'react'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Lines, Focus, Group } from './common'
import { Ask, Fresh, OutPanel, sentences, CODE_FS, OUT_FS, CODE_REF_FS } from './pieces'
import { CodePane } from './trace'
import { useStepPhase } from './phase'
import { Row, type CellState } from './rows'
import { SPEC } from './spec'

/**
 * C13: IN AND NOT IN. Five presses over four programs (the menu tuple, the
 * same with not in, the cart list, Teja's UPI id).
 *
 * The picture: the sequence as a row (locked tuple, handled list, a string's
 * letters as plain cells) and a finger in its own lane above it (rule 42),
 * which checks the cells one by one, left to right, and stops at a match or
 * at the end. On the string it checks three letters side by side, so y, b
 * and l light together (its must line). Nothing moves out of its cell: in and
 * not in only read. On each run press the check plays, the output fills,
 * then the next program appears with its output empty, as the spec's presses
 * say. Every program and output is the spec's, run on CPython.
 */
const C13 = SPEC.C13
type Prog = { file: string; src: string; output: string }
const PROGS: Prog[] = C13.code

type Seq = { name: string; kind: 'tuple' | 'list' | 'plain'; cells: string[]; shown: string[]; value: string; window: number }
/** What each program checks, read from its own lines. */
function parse(p: Prog): Seq {
  const [l1, l2] = p.src.split('\n')
  const name = l1.split(' = ')[0]
  const rhs = l1.split(' = ')[1]
  const value = l2.match(/"([^"]+)"/)![1]
  if (rhs.startsWith('"')) {
    const s = rhs.slice(1, -1)
    return { name, kind: 'plain', cells: [...s], shown: [...s], value, window: value.length }
  }
  const items = [...rhs.matchAll(/"([^"]+)"/g)].map((m) => m[1])
  return { name, kind: rhs.startsWith('(') ? 'tuple' : 'list', cells: items, shown: items.map((t) => `'${t}'`), value, window: 1 }
}
const SEQS = PROGS.map(parse)

/** Where the finger stops, cell by cell: positions checked in order until a match, or all of them. */
function walk(s: Seq): { at: number[]; found: number } {
  const at: number[] = []
  for (let i = 0; i + s.window <= s.cells.length; i++) {
    at.push(i)
    if (s.cells.slice(i, i + s.window).join('') === s.value) return { at, found: i }
  }
  return { at, found: -1 }
}
const WALKS = SEQS.map(walk)

const CELL = { tuple: 112, list: 112, plain: 52 } as const
const GAP = 6

function Finger({ x, on }: { x: number; on: boolean }) {
  const tween = useTween(420)
  return (
    <svg width="28" height="30" viewBox="0 0 28 30" aria-hidden className="absolute top-0" style={{ left: x - 14, opacity: on ? 1 : 0, transition: tween }}>
      <path d="M14 2 V18" stroke={colors.accentDark} strokeWidth="4" strokeLinecap="round" />
      <path d="M5 16 L14 28 L23 16 Z" fill={colors.accentDark} />
    </svg>
  )
}

/** The sequence and the finger. `step` is how far the check has got (0: not started). */
function Check({ k, step }: { k: number; step: number }) {
  const s = SEQS[k]
  const w = WALKS[k]
  const cw = CELL[s.kind]
  const pos = step >= 1 ? w.at[Math.min(step, w.at.length) - 1] : -1
  const done = step > w.at.length
  const states: Record<number, CellState> = {}
  w.at.slice(0, Math.min(step, w.at.length)).forEach((p) => {
    if (p !== pos || done) for (let j = 0; j < s.window; j++) if (states[p + j] === undefined) states[p + j] = 'miss'
  })
  if (pos >= 0 && (!done || pos === w.found)) for (let j = 0; j < s.window; j++) states[pos + j] = pos === w.found ? 'hit' : 'check'
  const x = pos >= 0 ? pos * (cw + GAP) + (s.window * cw + (s.window - 1) * GAP) / 2 : 0
  const handle = s.kind === 'list' ? 8 : 0
  return (
    <div className="flex items-start gap-3">
      <span className="shrink-0 rounded-lg px-3 font-mono text-[17px] font-bold leading-[52px]" style={{ marginTop: 32 + handle, background: colors.brandDark, color: colors.white }}>
        {s.name}
      </span>
      <div className="relative pt-[32px]">
        <Finger x={x} on={pos >= 0 && !done} />
        <Row items={s.shown} kind={s.kind} size="md" cellW={cw} states={states} />
      </div>
    </div>
  )
}

export function Membership() {
  const beat = useBeats(5)
  const k = beat <= 2 ? 0 : beat - 2
  const run = beat >= 2
  const m = WALKS[k].at.length
  /* the check, one cell per beat; then the output; then the next program */
  const phase = useStepPhase(beat, [500, ...Array(m - 1).fill(680), 760, 700, 600])
  const step = run ? Math.min(phase, m + 1) : 0
  const filled = run && phase >= m + 1
  const nextOn = run && k < PROGS.length - 1 && phase >= m + 2
  const prog = PROGS[k]
  /*
   * THE QUESTION CHANGES (review, 2026-10-08, slide 19). The program waiting
   * on the right is the next question: on the press that asks it, that same
   * card travels into the code box's place and grows to its size, and the
   * box's rim lights once, so the room sees the question change rather than
   * the code being swapped. Its output starts empty, as the spec says.
   */
  const instant = useInstant()
  const main = useRef<HTMLDivElement>(null)
  const next = useRef<HTMLDivElement>(null)
  const nextRect = useRef<DOMRect | null>(null)
  const lastK = useRef(k)
  useLayoutEffect(() => {
    const was = lastK.current
    lastK.current = k
    const el = main.current
    const from = nextRect.current
    if (!el || instant || k !== was + 1 || !from) return
    const to = el.getBoundingClientRect()
    const scale = el.offsetWidth ? to.width / el.offsetWidth : 1
    const dx = (from.left - to.left) / scale
    const dy = (from.top - to.top) / scale
    const s = from.width / to.width
    el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${s})`, transformOrigin: 'top left', boxShadow: `0 0 0 0 ${colors.brand}00` },
        { transform: 'none', transformOrigin: 'top left', boxShadow: `0 0 0 4px ${colors.brand}55`, offset: 0.75 },
        { transform: 'none', transformOrigin: 'top left', boxShadow: `0 0 0 0 ${colors.brand}00` },
      ],
      { duration: 1000, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    )
  }, [k, instant])
  /* remember where the waiting card is, for the next press */
  useLayoutEffect(() => {
    const r = next.current?.getBoundingClientRect()
    nextRect.current = r && r.width > 0 ? r : null
  })
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-6 rounded-card px-5 py-2.5" style={{ background: colors.surface2, boxShadow: `inset 4px 0 0 ${colors.brandDark}` }}>
          <span className="flex shrink-0 gap-2">
            {['in', 'not in'].map((t) => (
              <span key={t} className="rounded-lg bg-white px-3 py-1 font-mono text-[22px] font-bold" style={{ color: colors.brandDark, boxShadow: `inset 0 0 0 2px ${colors.line}` }}>
                {t}
              </span>
            ))}
          </span>
          <span className="text-[19px] font-semibold" style={{ color: colors.body }}>
            <Lines lines={sentences(C13.show[0])} />
          </span>
        </div>
        <div className="flex items-stretch gap-8">
          <Group className="flex w-[440px] shrink-0 flex-col gap-3">
            <Ask size={22}>{C13.show[1]}</Ask>
            <div ref={main} className="rounded-card">
              <Focus on={!filled}>
                <CodePane code={prog.src} fontSize={CODE_FS} rows={3} />
              </Focus>
            </div>
            <Fresh k={k}>
              <OutPanel lines={filled ? [{ text: prog.output }] : []} fontSize={OUT_FS} />
            </Fresh>
          </Group>
          {/* lit while the finger checks; on the last question the row is alone in it, so it stays a still container (rule 43) and the code's Focus carries the cue */}
          <Group className="flex min-w-0 flex-1 flex-col gap-4" active={k < PROGS.length - 1 ? run && !filled : undefined}>
            <Fresh k={k}>
              <Check k={k} step={step} />
            </Fresh>
            {k < PROGS.length - 1 && (
              <div
                className="flex w-[440px] flex-col gap-1.5"
                /* it fades in as the next question waits; it leaves at once, because on that press it has become the code box on the left */
                style={{ opacity: nextOn ? 1 : 0, transform: nextOn ? 'none' : 'translateY(8px)', transition: nextOn && !instant ? 'opacity 480ms cubic-bezier(0.22,1,0.36,1), transform 480ms cubic-bezier(0.22,1,0.36,1)' : 'none' }}
              >
                <div ref={next}>
                  <CodePane key={PROGS[k + 1].file} code={PROGS[k + 1].src} fontSize={CODE_REF_FS} rows={3} />
                </div>
                <div className="flex h-[38px] items-center gap-3 rounded-xl border border-line bg-white px-3">
                  <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.success }}>
                    Output
                  </span>
                </div>
              </div>
            )}
          </Group>
        </div>
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}
