import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { MARK_COLORS, type MarkTone } from './Code'

/**
 * THE ONE PICTURE OF THE IMPORT CARDS (spec note 5), beside the underlines
 * `Code.tsx` draws:
 *
 *   HowTable  "How you import decides how you call": one row per way, the
 *             import line on the left and the call on the right. It grows by
 *             one row on each of C3, C6, C7 and C8, and rows already added
 *             stay (the card after C3 opens with row 1 on screen).
 *   MathBox   the module as a closed box with its tools inside (sqrt,
 *             factorial, pi, floor); a tool lifts out of it on its own
 *             (`from math import factorial`), and may carry a new label
 *             (`as fact`). The dot opens the lid (`open`): C5's "the dot
 *             after math opens a small box with factorial and pi inside".
 *   NameTags  which name reaches what: a tag over the module box, a tag over a
 *             value (Kiran's 78). A tag that moves slides to its new owner;
 *             a name that reaches nothing is drawn red with no arrow (C6).
 *
 * Every colour is a token; the underline colours are `Code.tsx`'s own, so the
 * tag that says `math` is the same blue as the underline under `math`.
 */
const EASE = [0.22, 1, 0.36, 1] as const

export const HOW_ROWS: [string, string][] = [
  ['import math', 'math.factorial(5)'],
  ['import math as m', 'm.factorial(5)'],
  ['from math import factorial', 'factorial(5)'],
  ['from math import factorial as fact', 'fact(5)'],
]

/** The growing table. `rows` is how many rows are on screen; `lit` the row that just arrived. */
export function HowTable({ rows, lit, title = 'How you import decides how you call', size = 13 }: { rows: number; lit?: number; title?: string; size?: number }) {
  const instant = useInstant()
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
        {title}
      </span>
      <div className="overflow-hidden rounded-xl bg-white" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
        <div className="grid grid-cols-[1.55fr_1fr] text-[11px] font-bold uppercase tracking-wider" style={{ color: colors.muted, background: colors.surface2 }}>
          <span className="px-3 py-1">Line 1</span>
          <span className="px-3 py-1" style={{ boxShadow: `inset 1.5px 0 0 ${colors.line}` }}>
            Line 2
          </span>
        </div>
        {HOW_ROWS.map(([imp, call], i) => {
          const on = i < rows
          const hot = lit === i
          return (
            <motion.div
              key={imp}
              className="grid grid-cols-[1.55fr_1fr] overflow-hidden font-mono font-semibold"
              style={{ fontSize: size, color: colors.ink, background: hot ? colors.surface2 : colors.white, boxShadow: `inset 0 1px 0 ${colors.line}`, display: on ? undefined : 'none', transition: instant ? 'none' : `background-color 480ms cubic-bezier(0.22,1,0.36,1)` }}
              initial={false}
              animate={{ height: on ? 28 : 0, opacity: on ? 1 : 0 }}
              transition={{ duration: instant ? 0 : 0.48, ease: EASE }}
            >
              <span className="flex items-center whitespace-nowrap px-3">{imp}</span>
              <span className="flex items-center whitespace-nowrap px-3" style={{ boxShadow: `inset 1.5px 0 0 ${colors.line}`, color: colors.brandDark }}>
                {call}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- math box */

export const MATH_TOOLS = ['sqrt', 'factorial', 'pi', 'floor', 'ceil', 'gcd']

/**
 * The module box. `lifted` names a tool drawn above the box, out of it, with
 * `as` its new label; `open` lifts the lid and lights `lit` tools inside;
 * `dim` fades the whole box (the name that reached it is gone).
 */
export function MathBox({
  name = 'math',
  lifted,
  as,
  open = false,
  lit = [],
  dim = false,
  tone = 'a',
  width = 230,
  lane = true,
}: {
  name?: string
  lifted?: string | null
  as?: string | null
  open?: boolean
  lit?: string[]
  dim?: boolean
  /** the colour of the box's name, the underline tone of the name that reaches it */
  tone?: MarkTone
  width?: number
  /** the lane above the box a lifted tool rises into; off where no tool ever lifts (C6) */
  lane?: boolean
}) {
  const instant = useInstant()
  const tween = useTween(480)
  const ink = MARK_COLORS[tone]
  return (
    <div className="relative flex flex-col items-center" style={{ width, opacity: dim ? 0.35 : 1, transition: tween }}>
      {/* the lifted tool, above the box, in a lane of its own */}
      <div className="relative flex w-full items-end justify-center" style={{ height: lane ? 46 : 0 }}>
        {lifted && (
          <motion.span
            key={`${lifted}-${as ?? ''}`}
            className="relative inline-flex h-[34px] items-center gap-2 whitespace-nowrap rounded-lg bg-white px-3 font-mono text-[15px] font-bold"
            style={{ color: colors.brandDark, boxShadow: `inset 0 0 0 2px ${colors.brand}, 0 8px 18px -12px rgba(16,32,58,0.4)` }}
            initial={instant ? false : { opacity: 0, y: 44 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {as ? (
              <>
                <span className="line-through" style={{ color: colors.muted, textDecorationThickness: 2 }}>
                  {lifted}
                </span>
                <span>{as}</span>
              </>
            ) : (
              lifted
            )}
          </motion.span>
        )}
      </div>
      {/* the lid */}
      <div className="relative w-full" style={{ height: 14 }}>
        <motion.div
          className="absolute inset-x-0 bottom-0 rounded-t-lg"
          style={{ height: 14, background: colors.night3, transformOrigin: '50% 100%' }}
          initial={false}
          animate={{ rotateX: open ? 70 : 0, y: open ? -4 : 0 }}
          transition={{ duration: instant ? 0 : 0.52, ease: EASE }}
        />
      </div>
      {/* the box */}
      <div className="flex w-full flex-col gap-1.5 rounded-b-xl px-3 pb-3 pt-2" style={{ background: colors.night2, boxShadow: `inset 0 0 0 1.5px ${colors.night3}` }}>
        <span className="font-mono text-[15px] font-bold" style={{ color: ink }}>
          {name}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {MATH_TOOLS.map((t) => {
            const gone = t === lifted
            const on = lit.includes(t)
            return (
              <span
                key={t}
                className="inline-flex h-[24px] items-center rounded-md px-2 font-mono text-[12px] font-semibold"
                style={{
                  color: gone ? 'transparent' : on ? colors.ink : colors.white,
                  background: gone ? 'transparent' : on ? colors.warning : 'rgba(255,255,255,0.1)',
                  boxShadow: gone ? `inset 0 0 0 1.5px rgba(255,255,255,0.35)` : 'none',
                  outline: gone ? '1.5px dashed rgba(255,255,255,0.4)' : 'none',
                  outlineOffset: -1.5,
                  transition: tween,
                }}
              >
                {t}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- name tags */

export interface Owner {
  id: string
  /** what the name reaches: drawn by the caller */
  node: React.ReactNode
  width: number
}
export interface NameTag {
  name: string
  /** the owner's id, or null for a name that reaches nothing (drawn red, no arrow) */
  to: string | null
  tone: MarkTone
}

/**
 * Name tags over their owners, side by side. The tag column sits above each
 * owner; a tag that changes owner slides across (framer `layout`). The arrow
 * is a straight vertical line into a 9px head (rules 45, 46), from the tag's
 * foot to the owner's top edge, in the gap between them (rule 42).
 */
export function NameTags({ owners, tags, gap = 36 }: { owners: Owner[]; tags: NameTag[]; gap?: number }) {
  const instant = useInstant()
  const LANE = 58
  return (
    <div className="flex items-start" style={{ gap }}>
      {owners.map((o) => {
        const mine = tags.filter((t) => t.to === o.id)
        return (
          <div key={o.id} className="flex flex-col items-center" style={{ width: o.width }}>
            <div className="relative flex w-full items-start justify-center gap-2" style={{ height: LANE }}>
              {mine.map((t) => (
                <motion.div key={t.name} layout layoutId={`tag-${t.name}`} className="flex flex-col items-center" transition={{ duration: instant ? 0 : 0.6, ease: EASE }}>
                  <span className="inline-flex h-[26px] items-center rounded-md px-2.5 font-mono text-[14px] font-bold text-white" style={{ background: colors.night2, boxShadow: `inset 0 -3px 0 ${MARK_COLORS[t.tone]}` }}>
                    {t.name}
                  </span>
                  <svg width="12" height={LANE - 26} viewBox={`0 0 12 ${LANE - 26}`} aria-hidden>
                    <line x1="6" y1="0" x2="6" y2={LANE - 26 - 9} stroke={MARK_COLORS[t.tone]} strokeWidth="2.5" />
                    <path d={`M1.5 ${LANE - 26 - 9} L10.5 ${LANE - 26 - 9} L6 ${LANE - 26} Z`} fill={MARK_COLORS[t.tone]} />
                  </svg>
                </motion.div>
              ))}
            </div>
            {o.node}
          </div>
        )
      })}
      {/* names that reach nothing */}
      {tags.filter((t) => t.to === null).map((t) => (
        <motion.div key={t.name} layout layoutId={`tag-${t.name}`} className="flex flex-col items-center" style={{ height: LANE }} transition={{ duration: instant ? 0 : 0.6, ease: EASE }}>
          <span className="inline-flex h-[26px] items-center rounded-md px-2.5 font-mono text-[14px] font-bold text-white" style={{ background: colors.danger }}>
            {t.name}
          </span>
          <span className="mt-1 text-[11px] font-semibold" style={{ color: colors.danger }}>
            not there
          </span>
        </motion.div>
      ))}
    </div>
  )
}

/** A value box, the thing a name may reach: `78`. */
export function ValueBox({ value, width = 90 }: { value: string; width?: number }) {
  return (
    <div className="grid h-[52px] place-items-center rounded-xl bg-white font-mono text-[22px] font-bold" style={{ width, color: colors.ink, boxShadow: `inset 0 0 0 2px ${colors.line}` }}>
      {value}
    </div>
  )
}
