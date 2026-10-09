import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useTween } from '@/ui'
import { AnimatePresence, motion } from 'framer-motion'
import { useInstant } from '@/motion/instant'
import { Memory, tagW, SIZES, type MNode, type MTag, type MSize } from './memory'

/**
 * THE ONE PICTURE OF PF 24'S FIRST HALF (spec note 5).
 *
 *   "A variable is a name tag with an arrow to a list. Two arrows can point at
 *    one list. A list that no arrow points at vanishes at once: no grey ghost.
 *    A function's default list sits beside its def, from the press the def
 *    runs, and stays there. A call opens the function's own area beside its
 *    block. Its names (list_x) live there and vanish when the call ends. The
 *    lists they point at sit in one shared place, outside both areas."
 *
 * Drawn on session 20's `memory.tsx` (tags, rows, arrows that morph when a
 * name is re-pointed). Two areas on the left, `Outside add_unit` and `Inside
 * add_unit` (the call's, drawn only while the call runs, in session 22's
 * accent look), and one shared column on the right, `Lists`. When the spec's
 * step lists `defaults`, the column carries the def's own shelf, `add_unit's
 * default`, and the default list sits on it.
 *
 * Every frame is read from a spec step (`names`, `lists`, `defaults`, `where`),
 * never retyped. A list with no arrow on it is not in the step's `lists`, so
 * it unmounts at once: no exit animation, no ghost. Everything is placed by
 * coordinates, so an arrow is right by construction.
 */

export interface ScopeStep {
  caption: string
  line: number
  event: 'line' | 'end'
  where: string
  names: Record<string, string>
  lists: Record<string, (number | string)[]>
  defaults: string[]
  printed: string[]
}

const LOCAL = / \(inside ([a-z_]+)\)$/

/** `list_x (inside add_unit)` → `list_x`, local */
function nameOf(k: string) {
  const m = k.match(LOCAL)
  return m ? { name: k.replace(LOCAL, ''), local: true } : { name: k, local: false }
}

export const SCOPE = { width: 640, height: 232 } as const

const AREA_W = 214
const AREA_H = 104
const CALL_Y = 124
const COL_X = 262
const ROW_X = 300

export function Scope({
  step,
  prev,
  fn = 'add_unit',
  ring = false,
  size = 'md',
}: {
  step: ScopeStep | null
  prev?: ScopeStep | null
  fn?: string
  /** E1's last press: the default list, ringed */
  ring?: boolean
  size?: MSize
}) {
  const tween = useTween(420)
  const instant = useInstant()
  const s = SIZES[size]
  const lists = step?.lists ?? {}
  const defaults = step?.defaults ?? []
  const shelf = defaults.length > 0
  const ids = Object.keys(lists)
  /* default lists sit on the shelf; the others fill the column from the top, or under the shelf */
  const yOf = (id: string) => {
    if (defaults.includes(id)) return 62
    const free = ids.filter((i) => !defaults.includes(i))
    const k = free.indexOf(id)
    if (shelf) return 168
    return k === 0 ? 46 : 168
  }
  const nodes: MNode[] = ids.map((id) => {
    const items = lists[id].map(String)
    const before = prev?.lists[id]
    const fresh = before ? items.map((_, i) => i).filter((i) => i >= before.length) : []
    return { id, kind: 'row', x: ROW_X, y: yOf(id), items, size, fresh }
  })
  const tags: MTag[] = Object.entries(step?.names ?? {}).map(([k, to]) => {
    const { name, local } = nameOf(k)
    const w = tagW(name, size)
    return { name, to, x: AREA_W - 14 - w, y: (local ? CALL_Y : 0) + 48 + (AREA_H - 48 - s.tagH) / 2 + 2 }
  })
  const inCall = step?.where === fn
  return (
    <div className="relative shrink-0" style={{ width: SCOPE.width, height: SCOPE.height }}>
      {/* the program's own area, always there */}
      <Area x={0} y={0} label={`Outside ${fn}`} tone="main" />
      {/* the call's area, only while the call runs */}
      <AnimatePresence initial={false}>{inCall && <Area key="call" x={0} y={CALL_Y} label={`Inside ${fn}`} tone="call" />}</AnimatePresence>
      {/* the one shared place the lists live in */}
      <div className="absolute rounded-card" style={{ left: COL_X, top: 0, width: SCOPE.width - COL_X, height: SCOPE.height - 4, boxShadow: `inset 0 0 0 1.5px ${colors.line}`, background: colors.white }}>
        <span className="absolute left-3.5 top-2 text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
          Lists
        </span>
      </div>
      <AnimatePresence initial={false}>
      {shelf && (
        <motion.div
          key="shelf"
          className="absolute rounded-xl"
          initial={instant ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.52, ease: EASE } }}
          exit={{ opacity: 0, transition: { duration: instant ? 0 : 0.32, ease: EASE } }}
          style={{
            left: COL_X + 14,
            top: 28,
            width: SCOPE.width - COL_X - 28,
            height: 98,
            background: ring ? '#E9F8EF' : '#FFF4EC',
            border: `${ring ? 3 : 2}px ${ring ? 'solid' : 'dashed'} ${ring ? colors.success : colors.accent}`,
            transition: tween,
          }}
        >
          <span className="absolute left-3 top-1.5 text-[13px] font-bold uppercase tracking-wider" style={{ color: ring ? colors.success : colors.accentDark, transition: tween }}>
            {fn}'s default
          </span>
        </motion.div>
      )}
      </AnimatePresence>
      <Memory width={SCOPE.width} height={SCOPE.height} nodes={nodes} tags={tags} size={size} className="absolute left-0 top-0" />
    </div>
  )
}

const EASE = [0.22, 1, 0.36, 1] as const

/** An area. The call's fades up when the call starts and fades out when it ends (rule G1), on the house curve. */
function Area({ x, y, label, tone }: { x: number; y: number; label: ReactNode; tone: 'main' | 'call' }) {
  const call = tone === 'call'
  const instant = useInstant()
  return (
    <motion.div
      className="absolute rounded-card"
      initial={call && !instant ? { opacity: 0, y: y + 10 } : false}
      animate={{ opacity: 1, y, transition: { duration: 0.52, ease: EASE } }}
      exit={{ opacity: 0, y: y + 6, transition: { duration: instant ? 0 : 0.32, ease: EASE } }}
      style={{
        left: x,
        top: 0,
        width: AREA_W,
        height: AREA_H,
        background: call ? '#FFF4EC' : colors.surface,
        boxShadow: `inset 0 0 0 2px ${call ? colors.accent : colors.line}`,
      }}
    >
      <span className="absolute left-3 top-2 text-[13px] font-bold uppercase tracking-wider" style={{ color: call ? colors.accentDark : colors.brandDark }}>
        {label}
      </span>
    </motion.div>
  )
}

/**
 * The small form for the takeaways (K1's play line: "the arrow picture from
 * C1 on the first three examples"): tags and rows only, no areas.
 */
export function MiniScope({ names, lists, width = 230, height = 74 }: { names: Record<string, string>; lists: Record<string, string[]>; width?: number; height?: number }) {
  const size: MSize = 'xs'
  const ids = Object.keys(lists)
  const nodes: MNode[] = ids.map((id, k) => ({ id, kind: 'row', x: 104, y: 4 + k * 38, items: lists[id], size }))
  const names_ = Object.entries(names)
  const tags: MTag[] = names_.map(([name, to], k) => ({ name, to, x: 74 - tagW(name, size), y: names_.length === 1 ? 4 + ids.indexOf(to) * 38 + 3 : 4 + k * 38 + 3 }))
  return <Memory width={width} height={height} nodes={nodes} tags={tags} size={size} />
}
