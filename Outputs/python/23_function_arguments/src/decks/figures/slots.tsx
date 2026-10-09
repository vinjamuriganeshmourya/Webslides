import { useLayoutEffect, useRef, type ReactNode, type RefObject } from 'react'
import { colors } from '@/design/tokens'
import { useTween } from '@/ui'
import { useInstant } from '@/motion/instant'

/**
 * THE ONE PICTURE OF PF 23 (spec note 5).
 *
 *   "An argument is drawn as a slot in the def's header. A value travels from
 *    the call into its slot. Sent by name, the value carries its label (arg_1=)
 *    and lands on the slot with that label. Sent by position, it carries its
 *    number (1st, 2nd) and lands on the slot in that place."
 *
 *   SlotHeader  `def greet(` [slot] `, ` [slot] `):`. Each slot is a box with the
 *               argument's name over it. Empty, it is dashed; filled, it holds
 *               the value as a chip wearing its tag; missing (the call left it
 *               empty), it is red. A default the def holds shows faintly until
 *               the call uses it. When the order of the arguments changes (C8),
 *               each slot slides to its new place.
 *   ValueChip   the value and its tag: `arg_1=` (by name, orange, dashed, the
 *               deck's own labels), `1st` / `2nd` (by position, blue), `default`
 *               (grey). It FLIES: it starts on its own word in the call line
 *               (`tokenRect`) and travels up into the slot, once, when the press
 *               that sends it is reached going forward.
 *   tokenRect   the on-screen box of one word in one line of a `CodeBlock`.
 *
 * Every colour is a token (content rule 37). Movement at the explanatory tier
 * (generate-slides 4b): 860ms for a value's flight. Nothing moves during an
 * instant jump.
 */

export type By = 'name' | 'position' | 'default'

/** Where a flight starts: a box on screen, read when the chip mounts. */
export type FlySource = () => DOMRect | null

export interface Fill {
  value: string
  by: By
  /** 1-based place of a positional value */
  n?: number
  /** fly in from here when the chip mounts */
  from?: FlySource | null
  /** delay before the flight starts, ms (a second value in the same press) */
  delay?: number
}

const ORD = ['1st', '2nd', '3rd']
const HOUSE = 'cubic-bezier(0.22, 1, 0.36, 1)'

/* ------------------------------------------------------------------ geometry */

/**
 * The on-screen box of `token` in line `line` of the first `CodeBlock` under
 * `host`. The highlighter splits a line into several spans, so the token is
 * found across text nodes (session 22's `TokenRing`).
 */
export function tokenRect(host: HTMLElement | null, line: number, token: string): DOMRect | null {
  if (!host) return null
  const row = host.querySelectorAll('code > span')[line - 1] as HTMLElement | undefined
  if (!row) return null
  const walker = document.createTreeWalker(row.lastElementChild ?? row, NodeFilter.SHOW_TEXT)
  const nodes: { n: Text; from: number }[] = []
  let all = ''
  for (let t = walker.nextNode(); t; t = walker.nextNode()) {
    nodes.push({ n: t as Text, from: all.length })
    all += t.textContent ?? ''
  }
  const at = all.indexOf(token)
  if (at < 0 || !nodes.length) return null
  const locate = (i: number) => {
    const hit = [...nodes].reverse().find((x) => x.from <= i) ?? nodes[0]
    return { node: hit.n, off: i - hit.from }
  }
  const a = locate(at)
  const z = locate(at + token.length - 1)
  const r = document.createRange()
  r.setStart(a.node, a.off)
  r.setEnd(z.node, z.off + 1)
  return r.getBoundingClientRect()
}

/** A source for `Fill.from`: a word in a line of the code under `host`. */
export const fromToken = (host: RefObject<HTMLElement | null>, line: number, token: string): FlySource => () => tokenRect(host.current, line, token)

/** A source for `Fill.from`: any element's box. */
export const fromEl = (el: RefObject<HTMLElement | null>): FlySource => () => el.current?.getBoundingClientRect() ?? null

/**
 * Play a flight into `ref`'s element from `from`, once, on mount. The deck's
 * stage is scaled, so the distance is divided by the scale before it is used.
 */
export function useFly(ref: RefObject<HTMLElement | null>, from: FlySource | null | undefined, delay = 0, ms = 860) {
  const instant = useInstant()
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || !from || instant) return
    const a = from()
    if (!a) return
    const b = el.getBoundingClientRect()
    const scale = b.width / (el.offsetWidth || b.width) || 1
    const dx = (a.left + a.width / 2 - (b.left + b.width / 2)) / scale
    const dy = (a.top + a.height / 2 - (b.top + b.height / 2)) / scale
    el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(0.92)`, opacity: 0.35 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.92)`, opacity: 1, offset: 0.12 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: ms, delay, easing: HOUSE, fill: 'backwards' },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

/* ------------------------------------------------------------------ chip */

const TAG = {
  name: { ink: colors.accentDark, bg: '#FFF4EC', ring: colors.accent, dash: true },
  position: { ink: colors.white, bg: colors.brand, ring: colors.brand, dash: false },
  default: { ink: colors.body, bg: colors.surface2, ring: colors.muted, dash: false },
} as const

/** The tag a value wears: `arg_1=`, `1st`, `default`. */
export function TagPill({ by, text, size = 14 }: { by: By; text: string; size?: number }) {
  const t = TAG[by]
  return (
    <span
      className="whitespace-nowrap rounded-md px-1.5 font-mono font-bold leading-[1.45]"
      style={{ fontSize: size, color: t.ink, background: t.bg, boxShadow: `inset 0 0 0 1.5px ${t.ring}`, border: t.dash ? `1.5px dashed ${t.ring}` : undefined }}
    >
      {text}
    </span>
  )
}

export const tagText = (slot: string, f: Fill) => (f.by === 'name' ? `${slot}=` : f.by === 'position' ? ORD[(f.n ?? 1) - 1] : 'default')

/** A value, quoted as Python writes a string, wearing its tag in front of it: `arg_1=`'Good Morning'`, `1st` 'Ram'. */
export function ValueChip({ slot, fill, size = 22 }: { slot: string; fill: Fill; size?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useFly(ref, fill.from, fill.delay ?? 0)
  const t = TAG[fill.by]
  return (
    <span ref={ref} className="inline-flex items-center gap-1.5">
      <TagPill by={fill.by} text={tagText(slot, fill)} size={Math.round(size * 0.74)} />
      <span
        className="whitespace-nowrap rounded-lg px-2 py-0.5 font-mono font-semibold"
        style={{ fontSize: size, color: colors.ink, background: colors.white, boxShadow: `inset 0 0 0 2px ${t.ring}` }}
      >
        '{fill.value}'
      </span>
    </span>
  )
}

/* ------------------------------------------------------------------ header */

/**
 * The def's header with a slot for each argument.
 *
 * `fills[name]` is what sits in the slot now; `keys[name]` changes when a new
 * value arrives, so its chip mounts afresh and flies. `missing` slots are red.
 * `defaults[name]` is the value the def holds, shown faintly while the slot is
 * empty. `under[name]` is a label set under the slot (C8's "Default argument").
 */
export function SlotHeader({
  fn = 'greet',
  params,
  fills = {},
  keys = {},
  missing = [],
  defaults = {},
  under = {},
  size = 26,
  boxW = 290,
  ring = [],
}: {
  fn?: string
  params: string[]
  fills?: Record<string, Fill | null | undefined>
  keys?: Record<string, string | number>
  missing?: string[]
  defaults?: Record<string, string>
  under?: Record<string, ReactNode>
  size?: number
  boxW?: number
  /** slots ringed in the accent, to point at them (C8's labels) */
  ring?: string[]
}) {
  const tween = useTween(420)
  const instant = useInstant()
  const nameH = Math.round(size * 0.85)
  const boxH = Math.round(size * 2.2)
  const hasUnder = params.some((p) => under[p] !== undefined)
  /* FLIP: each slot slides from where it was when the order of the params changes */
  const refs = useRef(new Map<string, HTMLElement>())
  const last = useRef(new Map<string, DOMRect>())
  const order = params.join(',')
  useLayoutEffect(() => {
    refs.current.forEach((el, k) => {
      const now = el.getBoundingClientRect()
      const was = last.current.get(k)
      if (was && !instant && Math.abs(was.left - now.left) > 2) {
        const scale = now.width / (el.offsetWidth || now.width) || 1
        el.animate([{ transform: `translateX(${(was.left - now.left) / scale}px)` }, { transform: 'none' }], { duration: 860, easing: HOUSE })
      }
      last.current.set(k, now)
    })
  }, [order, instant])
  const text = (s: string, key: string) => (
    <span key={key} className="whitespace-pre font-mono font-bold" style={{ fontSize: size, color: colors.brandDark, lineHeight: `${boxH}px`, marginTop: nameH + 4 }}>
      {s}
    </span>
  )
  const pieces: ReactNode[] = [text(`def ${fn}(`, 'open')]
  params.forEach((p, i) => {
    if (i) pieces.push(text(', ', `sep${i}`))
    const f = fills[p]
    const miss = missing.includes(p)
    const ringed = ring.includes(p)
    const border = miss ? colors.danger : f ? (f.by === 'name' ? colors.accent : f.by === 'position' ? colors.brand : colors.muted) : colors.line
    pieces.push(
      <span
        key={p}
        ref={(el) => {
          if (el) refs.current.set(p, el)
          else refs.current.delete(p)
        }}
        className="inline-flex flex-col items-start"
      >
        <span className="font-mono font-bold leading-none" style={{ fontSize: Math.round(size * 0.72), color: miss ? colors.danger : colors.body, height: nameH, paddingTop: 2 }}>
          {defaults[p] !== undefined ? `${p}="${defaults[p]}"` : p}
        </span>
        <span
          className="relative mt-1 flex items-center justify-center rounded-xl"
          style={{
            width: boxW,
            height: boxH,
            background: miss ? '#FDECEC' : f ? colors.surface : 'transparent',
            border: `2.5px ${f || miss ? 'solid' : 'dashed'} ${border}`,
            boxShadow: ringed ? `0 0 0 4px ${colors.accent}55` : 'none',
            transition: tween,
          }}
        >
          {f ? (
            <ValueChip key={String(keys[p] ?? f.value)} slot={p} fill={f} size={Math.round(size * 0.8)} />
          ) : defaults[p] !== undefined ? (
            <span className="font-mono font-semibold" style={{ fontSize: Math.round(size * 0.8), color: colors.muted, opacity: 0.6 }}>
              '{defaults[p]}'
            </span>
          ) : miss ? (
            <span className="font-mono font-bold" style={{ fontSize: Math.round(size * 0.62), color: colors.danger }}>
              empty
            </span>
          ) : null}
        </span>
        {hasUnder && (
          <span className="mt-2 min-h-[24px] whitespace-nowrap text-[17px] font-bold leading-tight" style={{ color: colors.accentDark }}>
            {under[p] ?? ''}
          </span>
        )}
      </span>,
    )
  })
  pieces.push(text('):', 'close'))
  return <div className="flex flex-wrap items-start">{pieces}</div>
}

/** A slot's fill from a spec step (`{ var, slot, value, by }`) and the call line it came from. */
export function fillOf(step: { var?: string | null; slot: string; value: string; by: By }, call: string, host: RefObject<HTMLElement | null>, line: number, delay = 0): Fill {
  const args = call.slice(call.indexOf('(') + 1, call.lastIndexOf(')')).split(',').map((s) => s.trim()).filter(Boolean)
  const n = step.by === 'position' ? args.indexOf(step.var ?? '') + 1 : undefined
  const token = step.by === 'name' ? `${step.slot}=${step.var}` : (step.var ?? '')
  return { value: step.value, by: step.by, n: n || undefined, from: step.by === 'default' ? null : fromToken(host, line, token), delay }
}
