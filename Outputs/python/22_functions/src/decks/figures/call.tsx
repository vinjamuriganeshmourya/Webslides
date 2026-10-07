import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { colors, easing } from '@/design/tokens'
import { CodeBlock, type CodeLineState } from '@/ui'
import { useInstant } from '@/motion/instant'

/**
 * THE ONE PICTURE OF PF 22 (spec note 5).
 *
 *   "A call is drawn as a jump: an arrow from the call line up to the def
 *    header, and on the way back an arrow from the block to the call line. The
 *    call line stays marked while the block runs: it is waiting. A call opens
 *    the function's own area beside its block. Boxes made in the call (the
 *    argument, msg) live there, and vanish the moment the call ends. No grey
 *    ghost is left behind."
 *
 *   CallCode   the program (the kit's `CodeBlock`) with the line running now,
 *              the call line in the waiting tint, and the two jump arrows in a
 *              gutter on the code's LEFT, outside the box, so an arrow never
 *              crosses a line of code (content rule 42). The original deck draws
 *              its orange dashed arrows on the same side (slides 24 to 28).
 *   Areas      the program's own boxes (`name`) and, while a call runs, the
 *              function's area with the boxes the call made. When the call ends
 *              the area and its boxes leave together; nothing stays behind.
 *   IoBox      the input and the output, as the deck's two panels.
 *   usePhase   movement inside one press (C8, T2), played only when the press
 *              was reached going forward.
 *   traceOf    reads a spec `steps` list into what each press draws: the line,
 *              the waiting call line, which arrow, the boxes, the screen.
 *
 * Every colour is a token (content rule 37). Arrow heads are 9px in absolute
 * units and every connector's last stretch runs straight along its head's axis
 * (content rules 45, 46).
 */

/* ------------------------------------------------------------------ steps */

/** One step of a spec trace (E1, C8, C9, C11, C12; G1's `state`). */
export interface Step {
  line: number | null
  where: string
  kind?: string
  caption: string
  screen: string[]
  main?: Record<string, string>
  local?: Record<string, string>
}

/** What the code and the areas draw for one step. */
export interface Frame {
  at: number | null
  /** the call line, waiting while the block runs (and lit again on the way back) */
  waiting: number | null
  /** the call that is running: the jump-in arrow is drawn from it to the header */
  jumpIn: { from: number; to: number } | null
  /** the way back: from the block's last line down to the call line */
  jumpBack: { from: number; to: number } | null
  inCall: boolean
  step: Step | null
}

/** The `def` line a call jumps to: the first line that starts with `def `. */
export function defLine(src: string) {
  return src.split('\n').findIndex((l) => l.startsWith('def ')) + 1
}

/**
 * Each step's frame. A step whose `where` is not `main` is inside a call; the
 * call line is the last `main` line before it. The step that comes back to
 * `main` from a call draws the way back from the line before it.
 */
export function traceOf(steps: Step[], src: string): Frame[] {
  const header = defLine(src)
  let call: number | null = null
  return steps.map((s, i) => {
    const prev = steps[i - 1]
    const inCall = s.where !== 'main'
    if (!inCall && prev && prev.where === 'main') call = s.line
    if (!inCall && !prev) call = s.line
    const back = !inCall && prev && prev.where !== 'main' ? { from: prev.line ?? header, to: s.line ?? header } : null
    return {
      at: s.line,
      waiting: inCall ? call : null,
      jumpIn: inCall && call ? { from: call, to: header } : null,
      jumpBack: back,
      inCall,
      step: s,
    }
  })
}

/* ------------------------------------------------------------------ code */

const BAR = 45 /* CodeBlock's title bar */
const PAD = 16 /* its code area's top padding */
export const GUTTER = 46
const HEAD = 9

/** The kit's CodeBlock row height for a font size, so an arrow lands on the row's centre. */
export const rowOf = (fs: number) => Math.round(fs * 1.55)
export const yOf = (n: number, fs: number) => BAR + PAD + (n - 1) * rowOf(fs) + rowOf(fs) / 2

/**
 * One jump arrow in the gutter: out of the code box's left edge at `from`,
 * along a lane, and back into the edge at `to`, head pointing right into the
 * box. `dy` keeps the two arrows' horizontal stretches apart on a shared line.
 */
function Jump({ from, to, fs, lane, color, dyFrom = 0, dyTo = 0, label }: { from: number; to: number; fs: number; lane: number; color: string; dyFrom?: number; dyTo?: number; label?: string }) {
  const instant = useInstant()
  const y1 = yOf(from, fs) + dyFrom
  const y2 = yOf(to, fs) + dyTo
  const edge = GUTTER - 2
  const tip = edge
  const shaftEnd = tip - HEAD
  const d = `M ${edge} ${y1} H ${lane} V ${y2} H ${shaftEnd}`
  const len = Math.abs(edge - lane) * 2 + Math.abs(y2 - y1)
  return (
    <g>
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeDasharray="6 5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={instant ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.52, ease: easing.soft }}
      />
      <motion.path
        d={`M ${tip} ${y2} L ${shaftEnd} ${y2 - HEAD / 2 - 0.5} L ${shaftEnd} ${y2 + HEAD / 2 + 0.5} Z`}
        fill={color}
        initial={instant ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.52, delay: instant ? 0 : Math.min(0.4, len / 900), ease: easing.soft }}
      />
      {label && (
        <text x={lane - 6} y={(y1 + y2) / 2} fill={color} fontSize={12} fontWeight={700} textAnchor="end" dominantBaseline="middle" fontFamily="Inter, system-ui, sans-serif">
          {label}
        </text>
      )}
    </g>
  )
}

/**
 * The program, its line marker and the jump arrows.
 *
 * `route` keeps both arrows drawn at once (E1's last press: "the whole route
 * stays drawn"). `exit` draws the red arrow out of the function on `return`
 * (C12, from deck slide 43), on the box's RIGHT edge, pointing away from it.
 */
export function CallCode({
  code,
  fs = 17,
  rows,
  frame,
  grey = [],
  error,
  mark = [],
  exit,
  labels,
  width,
  route,
}: {
  code: string
  fs?: number
  rows?: number
  frame?: Frame | null
  grey?: number[]
  error?: number | null
  mark?: number[]
  exit?: number | null
  labels?: Record<number, string>
  width?: number
  route?: { in: { from: number; to: number }; back: { from: number; to: number } } | null
}) {
  const lines: Record<number, CodeLineState> = {}
  mark.forEach((l) => (lines[l] = 'mark'))
  if (frame?.waiting) lines[frame.waiting] = 'warn'
  if (frame?.at) lines[frame.at] = 'now'
  grey.forEach((l) => (lines[l] = 'dead'))
  if (error) lines[error] = 'error'
  const n = code.split('\n').length
  const h = BAR + PAD * 2 + (rows ?? n) * rowOf(fs)
  const jin = route?.in ?? frame?.jumpIn ?? null
  const jback = route?.back ?? frame?.jumpBack ?? null
  return (
    <div className="relative shrink-0" style={{ paddingLeft: GUTTER, width }}>
      <svg className="pointer-events-none absolute left-0 top-0 overflow-visible" width={GUTTER} height={h} aria-hidden>
        {jin && <Jump key={`in-${jin.from}-${jin.to}`} from={jin.from} to={jin.to} fs={fs} lane={10} color={colors.accent} dyFrom={-4} />}
        {jback && <Jump key={`back-${jback.from}-${jback.to}`} from={jback.from} to={jback.to} fs={fs} lane={26} color={colors.success} dyTo={4} />}
      </svg>
      <CodeBlock code={code} filename="Python" chip={false} fontSize={fs} rows={rows ?? n} lines={lines} labels={labels} />
      {exit ? <ExitArrow line={exit} fs={fs} /> : null}
    </div>
  )
}

/** C12's red arrow: out of the return line, to the right, out of the function. */
function ExitArrow({ line, fs }: { line: number; fs: number }) {
  const instant = useInstant()
  const y = yOf(line, fs)
  return (
    <motion.div
      className="pointer-events-none absolute left-full flex items-center"
      style={{ top: y - 14, height: 28, paddingLeft: 10 }}
      initial={instant ? false : { opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.52, ease: easing.soft }}
    >
      <svg width="64" height="14" viewBox="0 0 64 14" aria-hidden>
        <path d="M 2 7 H 54" stroke={colors.danger} strokeWidth={3} strokeLinecap="round" />
        <path d="M 63 7 L 54 2.5 L 54 11.5 Z" fill={colors.danger} />
      </svg>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ boxes */

/** One named box: the name over it, the value in it in quotes, like the deck's `name` box. */
export function VarBox({ name, value, fresh = false, tone = 'main', fly = 0 }: { name: string; value: string; fresh?: boolean; tone?: 'main' | 'call' | 'back'; fly?: number }) {
  const instant = useInstant()
  const paint = tone === 'call' ? colors.accent : tone === 'back' ? colors.success : colors.brand
  return (
    <motion.div
      layout={false}
      className="flex flex-col items-start gap-1"
      initial={instant || !fresh ? false : { opacity: 0, y: fly || 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={instant ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.9, transition: { duration: 0.32, ease: easing.swift } }}
      transition={{ duration: fly ? 0.86 : 0.52, ease: easing.soft }}
    >
      <span className="font-mono text-[13px] font-bold leading-none" style={{ color: colors.body }}>
        {name}
      </span>
      <span
        className="whitespace-nowrap rounded-lg px-2.5 py-1 font-mono text-[15px] font-semibold leading-tight"
        style={{ background: `${paint}14`, color: colors.ink, boxShadow: `inset 0 0 0 2px ${paint}` }}
      >
        '{value}'
      </span>
    </motion.div>
  )
}

/**
 * The two areas. `Outside <fn>` is the program's own (always there, possibly
 * empty); `Inside <fn>` is the call's, drawn only while the call runs and
 * holding only what the call made. Both keep their size so nothing moves when
 * one fills or empties.
 */
export function Areas({
  fn,
  main,
  local,
  inCall,
  prevMain = {},
  prevLocal = {},
  backFrom,
  width = 300,
  callH = 92,
  mainH = 92,
  dir = 'col',
}: {
  fn: string
  main: Record<string, string>
  local: Record<string, string>
  inCall: boolean
  prevMain?: Record<string, string>
  prevLocal?: Record<string, string>
  /** the box in `main` that just received a returned value: it flies in from the call's area */
  backFrom?: string | null
  width?: number | string
  callH?: number
  mainH?: number
  dir?: 'col' | 'row'
}) {
  const instant = useInstant()
  const open = inCall || Object.keys(local).length > 0
  return (
    <div className={`flex ${dir === 'col' ? 'flex-col' : 'flex-row'} gap-2.5`} style={{ width }}>
      <div className="relative rounded-card" style={{ height: callH, flex: dir === 'row' ? 1 : undefined }}>
        <AnimatePresence>
          {open && (
            <motion.div
              key="call"
              className="absolute inset-0 rounded-card px-3 pb-2 pt-1.5"
              style={{ background: '#FFF4EC', boxShadow: `inset 0 0 0 2px ${colors.accent}` }}
              initial={instant ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={instant ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, transition: { duration: 0.36, ease: easing.swift } }}
              transition={{ duration: 0.52, ease: easing.soft }}
            >
              <span className="block text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.accentDark }}>
                Inside {fn}
              </span>
              <div className="mt-1.5 flex flex-wrap items-start gap-3">
                <AnimatePresence>
                  {Object.entries(local).map(([k, v]) => (
                    <VarBox key={k} name={k} value={v} tone="call" fresh={!(k in prevLocal)} />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="rounded-card px-3 pb-2 pt-1.5" style={{ height: mainH, flex: dir === 'row' ? 1 : undefined, background: colors.surface, boxShadow: `inset 0 0 0 2px ${colors.line}` }}>
        <span className="block text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.brandDark }}>
          Outside {fn}
        </span>
        <div className="mt-1.5 flex flex-wrap items-start gap-3">
          {Object.entries(main).map(([k, v]) => (
            <VarBox key={k} name={k} value={v} tone={k === backFrom ? 'back' : 'main'} fresh={!(k in prevMain)} fly={k === backFrom ? -(callH + 10) : 0} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ io */

/**
 * The deck's input and output panels. The output shows a line as the program
 * prints it; an error line is Python's own text in the danger tone. `nothing`
 * writes `(nothing)` in grey into an output that stayed empty (the spec's fix
 * for deck slide 45's empty black box).
 */
export function IoBox({
  title,
  lines,
  rows = 1,
  fs = 17,
  tone = 'out',
  nothing = false,
  width,
  errorName = false,
}: {
  title: string
  lines: string[]
  rows?: number
  fs?: number
  tone?: 'in' | 'out'
  nothing?: boolean
  width?: number | string
  /** show an error as its name only (G1's TV) */
  errorName?: boolean
}) {
  const paint = tone === 'in' ? colors.brand : colors.success
  const rowH = Math.round(fs * 1.55)
  const err = (t: string) => /^\w*Error/.test(t)
  return (
    <div className="overflow-hidden rounded-card border border-line bg-white" style={{ width, boxShadow: '0 1px 2px rgba(16,32,58,0.07), 0 6px 14px -6px rgba(16,32,58,0.13)' }}>
      <div className="flex items-center gap-2.5 border-b border-line px-4 py-1" style={{ background: `${paint}14` }}>
        <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: paint }} />
        <span className="font-heading text-[14px] font-bold uppercase tracking-wider" style={{ color: colors.body }}>
          {title}
        </span>
      </div>
      <div className="relative px-4 py-2" style={{ minHeight: rows * rowH + 16 }}>
        {lines.length === 0 && nothing && (
          <span className="sm-bump block font-mono italic" style={{ fontSize: fs, lineHeight: `${rowH}px`, color: colors.muted }}>
            (nothing)
          </span>
        )}
        {lines.map((t, i) => (
          <div key={`${i}-${t}`} className="sm-bump whitespace-pre font-mono" style={{ fontSize: fs, lineHeight: `${rowH}px`, color: err(t) ? colors.danger : colors.ink, fontWeight: err(t) ? 600 : 500 }}>
            {errorName && err(t) ? t.split(':')[0] : t}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ phase */

/**
 * How far the movement of press `at` has got: 0 before it starts,
 * `delays.length` when it is over. Plays only when press `at` was reached by
 * one step forward; any other arrival shows the end state at once.
 */
export function usePhase(beat: number, at: number, delays: number[]): number {
  const instant = useInstant()
  const prev = useRef<number | null>(null)
  const n = delays.length
  const [phase, setPhase] = useState(() => (beat >= at ? n : 0))
  useEffect(() => {
    const was = prev.current
    prev.current = beat
    if (beat < at) {
      setPhase(0)
      return
    }
    if (beat > at || instant || was !== at - 1) {
      setPhase(n)
      return
    }
    setPhase(0)
    const timers: number[] = []
    let t = 0
    delays.forEach((d, i) => {
      t += d
      timers.push(window.setTimeout(() => setPhase(i + 1), t))
    })
    return () => timers.forEach((x) => window.clearTimeout(x))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beat, at, instant])
  return phase
}

/* ------------------------------------------------------------------ token ring */

/**
 * A ring drawn round one word of a code line (H2's `friend`, C7's `word`),
 * found in the rendered code by text, so it sits on the word's own bounds
 * (content rule 43). The deck's stage is scaled, so the rect is divided by the
 * scale before it is used.
 */
export function TokenRing({
  host,
  line,
  token,
  on,
  label,
  color = colors.accent,
  side = 'right',
  lift = 0,
}: {
  host: React.RefObject<HTMLElement | null>
  line: number
  token: string
  on: boolean
  label?: ReactNode
  color?: string
  side?: 'right' | 'above'
  /** with `above`: how far over the ring the label sits, joined to it by a short line */
  lift?: number
}) {
  const [box, setBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null)
  const instant = useInstant()
  useLayoutEffect(() => {
    if (!on) return
    /* the host's ref is attached after this child's layout effect on first mount: retry */
    const find = () => {
      const root = host.current
      if (!root) return
      const row = root.querySelectorAll('code > span')[line - 1] as HTMLElement | undefined
      if (!row) return
      /* the highlighter splits a line into spans, so a token can cross text nodes */
      const walker = document.createTreeWalker(row.lastElementChild ?? row, NodeFilter.SHOW_TEXT)
      const nodes: { n: Text; from: number }[] = []
      let all = ''
      for (let t = walker.nextNode(); t; t = walker.nextNode()) {
        nodes.push({ n: t as Text, from: all.length })
        all += t.textContent ?? ''
      }
      const at = all.indexOf(token)
      if (at < 0) return
      const end = at + token.length
      const locate = (i: number) => {
        const hit = [...nodes].reverse().find((x) => x.from <= i) ?? nodes[0]
        return { node: hit.n, off: i - hit.from }
      }
      const a = locate(at)
      const z = locate(end - 1)
      const r = document.createRange()
      r.setStart(a.node, a.off)
      r.setEnd(z.node, z.off + 1)
      const scale = root.getBoundingClientRect().width / root.offsetWidth || 1
      const base = root.getBoundingClientRect()
      const b = r.getBoundingClientRect()
      setBox({ x: (b.left - base.left) / scale, y: (b.top - base.top) / scale, w: b.width / scale, h: b.height / scale })
    }
    find()
    const ids = [window.setTimeout(find, 30), window.setTimeout(find, 600)]
    return () => ids.forEach((id) => window.clearTimeout(id))
  }, [host, line, token, on])
  if (!on || !box) return null
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ left: box.x - 5, top: box.y - 3, width: box.w + 10, height: box.h + 6 }}
      initial={instant ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.52, ease: easing.soft }}
    >
      <span className="absolute inset-0 rounded-md" style={{ boxShadow: `0 0 0 2.5px ${color}` }} />
      {label && side === 'above' && lift > 0 && <span className="absolute left-1/2 w-[2px] -translate-x-1/2" style={{ bottom: '100%', height: lift, background: color }} />}
      {label && (
        <span
          className={`absolute whitespace-nowrap text-[17px] font-bold ${side === 'above' ? 'left-0' : 'left-full top-1/2 ml-3 -translate-y-1/2'}`}
          style={{ color, ...(side === 'above' ? { bottom: `calc(100% + ${lift + 4}px)` } : {}) }}
        >
          {label}
        </span>
      )}
    </motion.div>
  )
}
