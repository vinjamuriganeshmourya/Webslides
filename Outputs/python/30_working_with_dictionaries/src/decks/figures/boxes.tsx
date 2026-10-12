import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { flyFrom } from './rows'

/**
 * THE ONE PICTURE OF THE SECOND HALF OF PF 30 (spec note 6).
 *
 * A function's parameters are boxes: a plain box for each named parameter, a
 * tuple box for `*name` (round brackets), a dictionary box for `**name`
 * (curly brackets, and it grows into a small copy of Divya's sheet, one row
 * per name=value). The tuple and dictionary boxes start as `()` and `{}`.
 * Each argument of a call is a chip in the CALL STRIP; when it lands, its
 * value mounts inside its box and travels there from the chip (`flyFrom`,
 * session 26's), and the chip leaves a dashed place behind.
 *
 * Values inside a box read exactly as Python prints them (`'Teja'`, `1500`),
 * the chips read as the call was written (`"Teja"`, `Teja=1500`).
 *
 * WHY BOXES AND A STRIP. The claim on every card is "this argument lands
 * here"; a before-and-after of the boxes alone hides the movement, and the
 * movement is the lesson (G2's one line). Session 26's `NameBox` drew the
 * named box this way; the tuple and dictionary boxes are its two new shapes.
 */

const EASE = [0.22, 1, 0.36, 1] as const
const HOUSE = 'cubic-bezier(0.22, 1, 0.36, 1)'

export type BoxKind = 'named' | 'tuple' | 'dict'
export type BoxTone = 'plain' | 'hot' | 'stop' | 'lit'
export interface BoxSpec {
  name: string
  kind: BoxKind
  /** named: the value in the box, `null` while empty */
  value?: string | null
  /** tuple: its items, as Python prints them */
  items?: string[]
  /** dict: its rows, key (unquoted) and value as Python prints it */
  rows?: [string, string][]
  tone?: BoxTone
}

/* ------------------------------------------------------------ python text */

/** Split a Python literal's inside at its top-level commas: `'a', ('b', 1)` is two parts. */
export function splitTop(s: string): string[] {
  const out: string[] = []
  let depth = 0
  let q: string | null = null
  let cur = ''
  for (const ch of s) {
    if (q) {
      cur += ch
      if (ch === q) q = null
      continue
    }
    if (ch === '"' || ch === "'") {
      q = ch
      cur += ch
    } else if ('([{'.includes(ch)) {
      depth++
      cur += ch
    } else if (')]}'.includes(ch)) {
      depth--
      cur += ch
    } else if (ch === ',' && depth === 0) {
      out.push(cur.trim())
      cur = ''
    } else cur += ch
  }
  if (cur.trim()) out.push(cur.trim())
  return out
}

/** `('Teja', 'Ravi')` as items; `('Sai',)` is one item; `()` none. */
export function tupleItems(s: string): string[] {
  const inner = s.trim().replace(/^\(/, '').replace(/\)$/, '')
  return splitTop(inner)
}

/** `{'age': '15'}` as rows, the key without its quotes. */
export function dictRows(s: string): [string, string][] {
  const inner = s.trim().replace(/^\{/, '').replace(/\}$/, '')
  return splitTop(inner).map((pair) => {
    const i = pair.indexOf(':')
    return [pair.slice(0, i).trim().replace(/^'|'$/g, ''), pair.slice(i + 1).trim()]
  })
}

/** `name=value` or `**data`: the key before `=`, for the dictionary box. */
export function keyOf(arg: string): string {
  const i = arg.indexOf('=')
  return i < 0 ? arg : arg.slice(0, i)
}

/** The call on a program's last line: its name and its arguments as written. */
export function parseCall(program: string): { fn: string; args: string[] } {
  const last = program.trimEnd().split('\n').pop() ?? ''
  const m = last.match(/^(\w+)\((.*)\)$/)
  if (!m) return { fn: last, args: [] }
  return { fn: m[1], args: splitTop(m[2]) }
}

/* ----------------------------------------------------------------- items */

/** A value that has just arrived in a box: it travels from `from()` on mount. */
function Arrive({ from, delay = 0, children, className = '' }: { from?: () => HTMLElement | null; delay?: number; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const instant = useInstant()
  useLayoutEffect(() => {
    if (instant) return
    const src = from?.()
    if (src) flyFrom(ref.current, src, 760, delay)
    else ref.current?.animate([{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'none' }], { duration: 480, delay, easing: HOUSE, fill: 'backwards' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  )
}

const FONT = 15
const BOX_H = 44

function toneLook(tone: BoxTone, filled: boolean) {
  if (tone === 'stop') return { bg: '#FDECEC', ring: colors.danger, dash: false }
  if (tone === 'hot') return { bg: '#FFF4EC', ring: colors.accent, dash: false }
  if (tone === 'lit') return { bg: colors.surface2, ring: colors.brand, dash: false }
  return filled ? { bg: '#E9F8EF', ring: colors.success, dash: false } : { bg: 'transparent', ring: colors.line, dash: true }
}

/**
 * One parameter box. `from(text)` gives the strip chip a value came from, by
 * the value's own text; items that mount together arrive `stagger` ms apart.
 */
export function ParamBox({ box, from, stagger = 240, keyText }: { box: BoxSpec; from?: (text: string) => HTMLElement | null; stagger?: number; keyText?: (text: string) => string }) {
  const instant = useInstant()
  const prefix = box.kind === 'tuple' ? '*' : box.kind === 'dict' ? '**' : ''
  const filled = box.kind === 'named' ? box.value != null : box.kind === 'tuple' ? (box.items?.length ?? 0) > 0 : (box.rows?.length ?? 0) > 0
  const L = toneLook(box.tone ?? 'plain', filled)
  /* which items were already there, so only the newcomers travel */
  const seen = useRef<Set<string>>(new Set())
  const current = box.kind === 'named' ? (box.value != null ? [box.value] : []) : box.kind === 'tuple' ? (box.items ?? []) : (box.rows ?? []).map(([k, v]) => `${k}:${v}`)
  const fresh = current.filter((t) => !seen.current.has(t))
  useLayoutEffect(() => {
    seen.current = new Set(current)
  })
  const delayOf = (t: string) => (fresh.includes(t) ? fresh.indexOf(t) * stagger : 0)
  const src = (t: string) => () => from?.(keyText ? keyText(t) : t) ?? null
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="whitespace-nowrap font-mono font-bold leading-none" style={{ fontSize: FONT, color: colors.brandDark }}>
        {prefix}
        {box.name}
      </span>
      <div
        className="flex items-center justify-center rounded-xl px-2.5 font-mono font-semibold"
        style={{
          minWidth: box.kind === 'named' ? 96 : 110,
          minHeight: BOX_H,
          fontSize: FONT,
          color: colors.ink,
          background: L.bg,
          border: `${filled ? 3 : 2}px ${L.dash ? 'dashed' : 'solid'} ${L.ring}`,
          transition: instant ? 'none' : `background-color 420ms ${HOUSE}, border-color 420ms ${HOUSE}`,
          whiteSpace: 'nowrap',
        }}
      >
        {box.kind === 'named' && (box.value != null ? <Arrive key={`v-${box.value}`} from={src(box.value)}>{box.value}</Arrive> : <span style={{ color: colors.muted }}>&nbsp;</span>)}
        {box.kind === 'tuple' && (
          <span className="flex items-center gap-1">
            <span style={{ color: colors.body }}>(</span>
            {(box.items ?? []).map((t, i) => (
              <span key={`i-${i}-${t}`} className="flex items-center">
                <Arrive from={src(t)} delay={delayOf(t)}>
                  <span className="rounded-md px-1.5 py-0.5" style={{ background: colors.white, boxShadow: `inset 0 0 0 1px ${colors.line}` }}>
                    {t}
                  </span>
                </Arrive>
                {(i < (box.items?.length ?? 0) - 1 || (box.items?.length ?? 0) === 1) && <span style={{ color: colors.body }}>,</span>}
              </span>
            ))}
            <span style={{ color: colors.body }}>)</span>
          </span>
        )}
        {box.kind === 'dict' && (
          <span className="flex items-center gap-1">
            <span style={{ color: colors.body }}>{'{'}</span>
            {(box.rows ?? []).length > 0 && (
              <span className="flex flex-col overflow-hidden rounded-md" style={{ boxShadow: `inset 0 0 0 1px ${colors.line}` }}>
                {(box.rows ?? []).map(([k, v]) => (
                  <Arrive key={`r-${k}`} from={src(`${k}:${v}`)} delay={delayOf(`${k}:${v}`)} className="w-full">
                    <span className="flex" style={{ fontSize: FONT - 2, lineHeight: '22px' }}>
                      <span className="px-2 font-semibold" style={{ background: colors.white, borderRight: `1px solid ${colors.line}`, borderBottom: `1px solid ${colors.line}`, color: colors.ink }}>
                        {k}
                      </span>
                      <span className="px-2" style={{ background: colors.white, borderBottom: `1px solid ${colors.line}`, color: colors.ink }}>
                        {v}
                      </span>
                    </span>
                  </Arrive>
                ))}
              </span>
            )}
            <span style={{ color: colors.body }}>{'}'}</span>
          </span>
        )}
      </div>
    </div>
  )
}

/** The boxes of one def, in the def's order. */
export function ParamBoxes({ boxes, from, stagger, keyText, gap = 18, className = '' }: { boxes: BoxSpec[]; from?: (text: string) => HTMLElement | null; stagger?: number; keyText?: (text: string) => string; gap?: number; className?: string }) {
  return (
    <div className={`flex items-start ${className}`} style={{ gap }}>
      {boxes.map((b) => (
        <ParamBox key={`b-${b.name}`} box={b} from={from} stagger={stagger} keyText={keyText} />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ strip */

/**
 * The call, as chips: `fn(` then one chip per argument. `used` chips have
 * landed (a dashed place stays, the width never changes); `opened` replaces
 * a `*list` or `**dict` chip with the pieces it opened into; `bad` is the
 * argument with nowhere to go (a red ring, one shake). `chipRef` hands back
 * each chip's element by its text, so a box can fly a value from it.
 */
export function CallStrip({
  fn,
  args,
  used = [],
  opened = {},
  bad,
  chipRef,
  size = FONT,
  className = '',
}: {
  fn: string
  args: string[]
  used?: string[]
  opened?: Record<string, string[]>
  bad?: string | null
  chipRef?: (text: string, el: HTMLSpanElement | null) => void
  size?: number
  className?: string
}) {
  const instant = useInstant()
  const chip = (text: string, ghost: boolean, isBad: boolean, burst = false) => (
    <motion.span
      key={`c-${text}`}
      ref={(el) => chipRef?.(text, el)}
      className="inline-flex items-center whitespace-nowrap rounded-lg px-2 font-mono font-semibold"
      style={{
        height: Math.round(size * 2),
        fontSize: size,
        background: ghost ? 'transparent' : isBad ? '#FDECEC' : colors.white,
        color: ghost ? 'transparent' : isBad ? colors.danger : colors.brandDark,
        boxShadow: ghost ? 'none' : `inset 0 0 0 ${isBad ? 2 : 1.5}px ${isBad ? colors.danger : colors.line}`,
        outline: ghost ? `1.5px dashed ${colors.line}` : 'none',
        outlineOffset: -1.5,
        transition: instant ? 'none' : `background-color 360ms ${HOUSE}, color 360ms ${HOUSE}, box-shadow 360ms ${HOUSE}`,
      }}
      initial={burst && !instant ? { opacity: 0, scale: 0.7 } : false}
      animate={isBad && !instant ? { x: [0, -8, 8, -6, 6, 0], opacity: 1, scale: 1 } : { x: 0, opacity: 1, scale: 1 }}
      transition={isBad ? { duration: 0.6, ease: 'easeInOut', delay: 0.2 } : { duration: 0.42, ease: EASE }}
    >
      {text}
    </motion.span>
  )
  return (
    <div className={`flex flex-wrap items-center gap-y-1 font-mono ${className}`} style={{ fontSize: size, color: colors.ink }}>
      <span className="font-semibold">{fn}(</span>
      {args.map((a, i) => {
        const pieces = opened[a]
        return (
          <span key={`a-${i}-${a}`} className="flex items-center">
            {pieces ? (
              <span className="flex items-center gap-1 rounded-lg px-1 py-0.5" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.brand}55` }}>
                {pieces.map((p, k) => (
                  <span key={`p-${p}`} className="flex items-center">
                    {chip(p, used.includes(p), bad === p, true)}
                    {k < pieces.length - 1 && <span className="px-0.5">,</span>}
                  </span>
                ))}
              </span>
            ) : (
              chip(a, used.includes(a), bad === a)
            )}
            {i < args.length - 1 && <span className="pr-1.5">,</span>}
          </span>
        )
      })}
      <span className="font-semibold">)</span>
    </div>
  )
}

/** A registry of strip chips by text: pass `set` to `CallStrip`, `get` to the boxes. */
export function useChips() {
  const map = useRef(new Map<string, HTMLSpanElement>())
  const set = (text: string, el: HTMLSpanElement | null) => {
    if (el) map.current.set(text, el)
    else map.current.delete(text)
  }
  const get = (text: string) => map.current.get(text) ?? null
  return { set, get }
}
