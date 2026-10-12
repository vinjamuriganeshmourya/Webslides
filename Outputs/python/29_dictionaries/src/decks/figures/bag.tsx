import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { Face, isPerson } from './people'
import { Lock, flyFrom } from './rows'
import { DrawBox } from './pieces'

/**
 * THE ONE PICTURE OF PF 27 "SETS" (spec note 5): a set is a round bag of
 * chips, the way deck slide 16 draws it. No numbers under the chips, no first
 * and no last. A list or a tuple stays session 26's row of cells
 * (`rows.tsx`).
 *
 *   Chip    one item: a person (a lab face and the name), a letter, a number,
 *           a tuple (with its lock) or a list (with its handles).
 *   Bag     the ring and the chips in it. A chip's place is fixed for the card
 *           by its position in `universe`, so nothing inside moves when
 *           another chip joins, bounces or leaves (the cards' keeps lines).
 *           `drift` moves every chip to a new place on purpose (C1).
 *
 * The four movements, each one press (spec, E1 / C8 / G2 must lines):
 *
 *   join     a chip new to `items` walks in from the door at the bag's left
 *            (or flies in from `origin(label)`, the sheet row in H1)
 *   bounce   `visitor` with mode `bounce`: it walks up to the rim, bounces
 *            off and waits outside, grey, tagged `already in`; its twin
 *            inside lights
 *   leave    a chip gone from `items` walks down out of the bag and fades
 *   check    `finger`: a magnifier visits the chips one by one and stops on
 *            the one it finds, or on none
 *
 * Each plays only when `moving` (the press was reached going forward); any
 * other arrival shows the end state still (spec: "Left goes back one step
 * and redraws it still"). Colours are tokens (rule 37); timings are the
 * explanatory tier (generate-slides 4b).
 */

const HOUSE = [0.22, 1, 0.36, 1] as const

export type ChipState = 'plain' | 'lit' | 'check' | 'grey' | 'bad' | 'new'
export type ChipKind = 'name' | 'letter' | 'num' | 'tuple' | 'list' | 'word'

export function chipKind(label: string): ChipKind {
  if (label.startsWith('(')) return 'tuple'
  if (label.startsWith('[')) return 'list'
  if (/^-?\d+$/.test(label)) return 'num'
  if (label.length === 1) return 'letter'
  return isPerson(label) ? 'name' : 'word'
}

/** The Close Friends star: a green disc with a white star (the app's own colour, rule 37's drawn-screen allowance). */
export const STAR_GREEN = '#1FB65A'
export function Star({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-label="Close Friend" role="img">
      <circle cx="10" cy="10" r="10" fill={STAR_GREEN} />
      <path d="M10 4.2l1.7 3.6 3.9.5-2.9 2.7.8 3.9L10 13l-3.5 1.9.8-3.9-2.9-2.7 3.9-.5z" fill="#FFFFFF" />
    </svg>
  )
}

const LOOK: Record<ChipState, { bg: string; ring: string; ink: string; w: number; fade?: number }> = {
  plain: { bg: colors.white, ring: colors.line, ink: colors.ink, w: 1.5 },
  lit: { bg: colors.surface2, ring: colors.brand, ink: colors.brandDark, w: 3 },
  new: { bg: '#E9F8EF', ring: colors.success, ink: colors.ink, w: 3 },
  check: { bg: '#FFF4EC', ring: colors.accent, ink: colors.ink, w: 3 },
  grey: { bg: colors.surface, ring: colors.line, ink: colors.muted, w: 1.5, fade: 0.5 },
  bad: { bg: '#FDECEC', ring: colors.danger, ink: colors.danger, w: 3 },
}

const SZ = {
  md: { h: 42, face: 30, font: 17, mono: 16, pad: 12 },
  sm: { h: 36, face: 26, font: 15, mono: 14, pad: 10 },
} as const
export type ChipSize = keyof typeof SZ

/** One item. As Python would write it inside a set: a string chip shows the name plainly (the face says it is a person), a letter in mono. */
export function Chip({ label, state = 'plain', size = 'md', star = false, lock = false, mark = false, className = '' }: { label: string; state?: ChipState; size?: ChipSize; star?: boolean; lock?: boolean; /** a square draws itself round the first letter (C4's R and r) */ mark?: boolean; className?: string }) {
  const instant = useInstant()
  const s = SZ[size]
  const k = chipKind(label)
  const L = LOOK[state]
  const round = k !== 'letter'
  return (
    <span
      data-chip={label}
      className={`relative inline-flex shrink-0 items-center whitespace-nowrap font-semibold ${round ? 'rounded-full' : 'rounded-xl'} ${className}`}
      style={{
        height: s.h,
        minWidth: s.h,
        justifyContent: 'center',
        gap: 7,
        paddingLeft: k === 'name' ? 5 : s.pad,
        paddingRight: s.pad,
        background: L.bg,
        color: L.ink,
        opacity: L.fade ?? 1,
        boxShadow: `inset 0 0 0 ${L.w}px ${L.ring}, 0 5px 12px -8px rgba(16,32,58,0.4)`,
        transition: instant ? 'none' : 'background-color 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms cubic-bezier(0.22,1,0.36,1), opacity 420ms cubic-bezier(0.22,1,0.36,1), color 420ms cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {k === 'list' && (
        <>
          <span aria-hidden className="absolute rounded-full" style={{ top: -7, left: '28%', width: 12, height: 12, background: colors.white, boxShadow: `inset 0 0 0 3px ${colors.brand}` }} />
          <span aria-hidden className="absolute rounded-full" style={{ top: -7, right: '28%', width: 12, height: 12, background: colors.white, boxShadow: `inset 0 0 0 3px ${colors.brand}` }} />
        </>
      )}
      {k === 'name' && <Face name={label} size={s.face} />}
      <span className={k === 'name' || k === 'word' ? '' : 'font-mono'} style={{ fontSize: k === 'name' || k === 'word' ? s.font : s.mono + (k === 'letter' ? 3 : 0), lineHeight: 1 }}>
        {mark ? (
          <>
            <span className="relative inline-block">
              {label[0]}
              <DrawBox on color={colors.accent} pad={3} delay={200} radius={4} />
            </span>
            {label.slice(1)}
          </>
        ) : (
          label
        )}
      </span>
      {k === 'tuple' && <Lock size={16} />}
      {star && (
        <span className="absolute" style={{ right: -5, top: -6 }}>
          <Star size={17} />
        </span>
      )}
      {lock && k !== 'tuple' && (
        <motion.span className="absolute" style={{ right: -9, top: -9 }} initial={instant ? false : { opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.42, ease: HOUSE }}>
          <span className="grid place-items-center rounded-full bg-white" style={{ width: 22, height: 22, boxShadow: `0 0 0 1.5px ${colors.line}` }}>
            <Lock size={14} />
          </span>
        </motion.span>
      )}
    </span>
  )
}

/* ------------------------------------------------------------------ bag */

/** Where the chips sit, as fractions of the bag's box, in the order they fill. Scattered, never a row. */
/* pulled in from the rim so every chip, its star included, sits inside the oval with clear space (user, 2026-10-09) */
const SLOTS: [number, number][] = [
  [0.31, 0.3],
  [0.68, 0.33],
  [0.5, 0.7],
  [0.23, 0.59],
  [0.76, 0.63],
  [0.48, 0.48],
  [0.31, 0.82],
  [0.65, 0.84],
]

export type Visitor = {
  label: string
  /** wait: standing at the door. bounce: walks up, bounces off, waits grey. stop: red, the program stopped on it. */
  mode: 'wait' | 'bounce' | 'stop'
  /** the tag under it: `already in` for a bounce by default */
  tag?: string
  /** where it comes from as it arrives at the door (a cell in a row) */
  from?: () => HTMLElement | null
}

export type Finger = {
  /** chips visited, in order */
  path: string[]
  /** the chip it stops on, or null: it finds nothing and fades */
  found: string | null
}

const DOOR_W = 150

/** The magnifier that checks the chips: a ring and a handle, in the accent tone. */
function Glass() {
  return (
    <svg width="28" height="28" viewBox="0 0 38 38" aria-hidden style={{ filter: 'drop-shadow(0 4px 6px rgba(16,32,58,0.25))' }}>
      <circle cx="15" cy="15" r="11" fill="rgba(255,255,255,0.35)" stroke={colors.accentDark} strokeWidth="4" />
      <path d="M23.5 23.5 34 34" stroke={colors.accentDark} strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

/**
 * CHIP MOTION (user, 2026-10-08, on this deck's slides 4, 13, 19 and 20):
 * every chip makes ONE move, straight from where it starts to where it ends,
 * on one ease-out curve, animating transform and opacity only. No overshoot,
 * no bounce, no pause half way, no size or opacity jump at a handover.
 *
 * The flight runs on a node of its own (`fly`): it carries no transform of
 * its own, so `flyFrom` never replaces the chip's centring translate (that
 * replacement was the snap-back at the end of every flight).
 */
const EASE_OUT = [0.22, 1, 0.36, 1] as const

/** A chip in the bag. It owns its entrance: from `origin` if given, else from the door (or from above, with no door). */
function Placed({ label, base, at, door, drop, delay, moving, origin, state, star, lock, mark, size }: { label: string; base: [number, number]; at: [number, number]; door: [number, number]; drop: boolean; delay: number; moving: boolean; origin?: () => HTMLElement | null; state: ChipState; star: boolean; lock: boolean; mark: boolean; size: ChipSize }) {
  const instant = useInstant()
  const fly = useRef<HTMLDivElement>(null)
  const src = moving && !instant && origin ? origin() : null
  useLayoutEffect(() => {
    if (src) flyFrom(fly.current, src, 900, 0, 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const walk = moving && !instant && !src
  /* the chip is placed at its own slot (`base`); a drift moves it to `at` by transform */
  const off = { x: at[0] - base[0], y: at[1] - base[1] }
  return (
    <motion.div
      data-in-bag
      className="absolute"
      style={{ left: base[0], top: base[1] }}
      initial={walk ? (drop ? { x: off.x, y: off.y - 60, opacity: 0 } : { x: door[0] - base[0], y: door[1] - base[1], opacity: 0 }) : false}
      animate={{ x: off.x, y: off.y, opacity: 1, transition: { duration: instant ? 0 : 0.9, delay: walk ? delay : 0, ease: EASE_OUT } }}
      /* a chip that leaves walks straight down out of the bag and fades: a path that crosses no other chip (rule 47) */
      exit={moving && !instant ? { y: off.y + 46, opacity: 0, transition: { duration: 0.7, ease: EASE_OUT } } : { opacity: 0, transition: { duration: 0 } }}
    >
      <div className="-translate-x-1/2 -translate-y-1/2">
        <div ref={fly}>
          <Chip label={label} state={state} star={star} lock={lock} mark={mark} size={size} />
        </div>
      </div>
    </motion.div>
  )
}

/**
 * A chip outside the bag. `wait`: standing at the door. `bounce`: a repeat;
 * it makes one move from where it starts (its cell, its place in line, or
 * the door) up to just outside the rim and stops there, grey, tagged
 * `already in` (no there-and-back). `stop`: red, the program stopped on it.
 */
function AtDoor({ v, door, rim, waitAt, moving, size }: { v: Visitor; door: [number, number]; rim: number; /** where a waiting chip's right edge sits */ waitAt: number; moving: boolean; size: ChipSize }) {
  const instant = useInstant()
  const fly = useRef<HTMLDivElement>(null)
  const play = moving && !instant
  const bounce = v.mode === 'bounce'
  const stop = v.mode === 'stop'
  /* a chip outside the bag is anchored by its RIGHT edge, short of the rim, so
     however wide it is it never crosses the oval (user, 2026-10-09): waiting
     at the door 40px short of the rim (or where the dashed line starts), a
     repeat 16px short */
  const restX = bounce ? rim - 16 : waitAt
  const src = play && v.from ? v.from() : null
  useLayoutEffect(() => {
    if (src) flyFrom(fly.current, src, 900, 0, 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const tag = v.tag === '' ? undefined : (v.tag ?? (bounce ? 'already in' : undefined))
  return (
    <motion.div
      data-out-bag
      className="absolute"
      style={{ left: restX, top: door[1] }}
      initial={play && !src ? { opacity: 0, x: bounce ? -60 : -24 } : false}
      animate={{ opacity: 1, x: 0, transition: { duration: play ? 0.9 : 0, ease: EASE_OUT } }}
      exit={{ opacity: 0, transition: { duration: 0 } }}
    >
      <div className="-translate-x-full -translate-y-1/2">
        <div ref={fly} className="relative flex flex-col items-center">
          <Chip label={v.label} state={stop ? 'bad' : bounce ? 'grey' : 'plain'} size={size} />
          {tag && (
            <motion.span
              className="absolute top-[100%] mt-1.5 self-center whitespace-nowrap rounded-md px-2 py-0.5 text-[14px] font-bold"
              style={{ background: stop ? '#FDECEC' : colors.surface2, color: stop ? colors.danger : colors.muted }}
              initial={play ? { opacity: 0 } : false}
              animate={{ opacity: 1, transition: { duration: 0.4, delay: play ? 0.8 : 0, ease: EASE_OUT } }}
            >
              {tag}
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function Bag({
  items,
  universe,
  w = 400,
  h = 236,
  name,
  states = {},
  visitor = null,
  drift = 0,
  locks = false,
  stars = false,
  moving = false,
  origin,
  finger = null,
  door = true,
  kind = 'set',
  size = 'md',
  marks = [],
  stagger = 0.13,
  doorW = DOOR_W,
  lane = false,
  children,
}: {
  /** the dashed line from the door to the rim: only G2 draws it (user, 2026-10-09: removed on 11, 13, 19, 20, 21) */
  lane?: boolean
  /** the door zone's width */
  doorW?: number
  /** chips whose first letter is ringed */
  marks?: string[]
  /** the gap between chips that enter on the same press (seconds) */
  stagger?: number
  /** the items in the set now */
  items: string[]
  /** every item that is in the bag at any point on this card, in the order their places are given */
  universe?: string[]
  w?: number
  h?: number
  /** the variable's name, a tag at the bag's bottom-left corner, clear of every chip's place */
  name?: ReactNode
  states?: Record<string, ChipState>
  visitor?: Visitor | null
  drift?: number
  locks?: boolean
  stars?: boolean
  moving?: boolean
  origin?: (label: string) => HTMLElement | null
  finger?: Finger | null
  /** the door zone at the left, for visitors */
  door?: boolean
  /** a `dict` bag is drawn dashed and grey: not a set */
  kind?: 'set' | 'dict'
  size?: ChipSize
  /** drawn over the bag, in its box (C7's pointer) */
  children?: ReactNode
}) {
  const instant = useInstant()
  const all = universe ?? items
  const left = door ? doorW : 0
  const slotOf = (label: string, d: number): [number, number] => {
    const i = Math.max(0, all.indexOf(label))
    const [fx, fy] = SLOTS[(i + d * 3) % SLOTS.length]
    return [left + fx * w, fy * h]
  }
  const at = (label: string) => slotOf(label, drift)
  const doorAt: [number, number] = [doorW * 0.42, h / 2]
  const twin = visitor?.mode === 'bounce' && items.includes(visitor.label) ? visitor.label : null
  const dict = kind === 'dict'
  /* the finger's path: along the bag's top edge, stopping over each chip in turn (never on a chip: rule 42) */
  const fp = finger ? finger.path.map((l) => at(l)) : []
  const endAt: [number, number] | null = finger ? (finger.found ? at(finger.found) : [left + w * 0.5, h * 0.5]) : null
  return (
    <div data-bag className="relative shrink-0" style={{ width: left + w, height: h }}>
      <svg className="absolute" style={{ left, top: 0 }} width={w} height={h} aria-hidden>
        <ellipse
          data-bag-oval
          cx={w / 2}
          cy={h / 2}
          rx={w / 2 - 3}
          ry={h / 2 - 3}
          fill={dict ? 'rgba(241,245,249,0.6)' : 'rgba(232,240,255,0.62)'}
          stroke={dict ? colors.muted : colors.brand}
          strokeWidth={dict ? 2 : 3}
          strokeDasharray={dict ? '7 7' : undefined}
          style={{ transition: instant ? 'none' : 'stroke 420ms, fill 420ms' }}
        />
      </svg>
      {name !== undefined && (
        <span className="absolute whitespace-nowrap rounded-lg px-2.5 py-1 font-mono text-[15px] font-bold leading-none" style={{ left: left + 4, bottom: 2, background: dict ? colors.muted : colors.brandDark, color: colors.white, transition: instant ? 'none' : 'background-color 420ms' }}>
          {name}
        </span>
      )}
      {door && lane && (
        /* the door: a faint dashed lane from where a visitor waits up to the rim */
        <span aria-hidden className="absolute" style={{ left: doorW * 0.42 + 54, top: h / 2 - 1, width: Math.max(0, doorW - doorW * 0.42 - 50), height: 0, borderTop: `2px dashed ${colors.line}` }} />
      )}
      <AnimatePresence initial={false}>
        {items.map((l, n) => {
          return (
            <Placed
              key={`chip-${l}`}
              label={l}
              base={slotOf(l, 0)}
              at={at(l)}
              door={doorAt}
              drop={!door}
              delay={door ? 0 : n * stagger}
              moving={moving}
              origin={origin && origin(l) ? () => origin(l) : undefined}
              state={twin === l ? 'lit' : (states[l] ?? 'plain')}
              star={stars}
              lock={locks}
              mark={marks.includes(l)}
              size={size}
            />
          )
        })}
      </AnimatePresence>
      <AnimatePresence initial={false}>
        {visitor && <AtDoor key={`visitor-${visitor.label}-${visitor.mode === 'bounce' ? 'b' : 'x'}`} v={visitor} door={doorAt} rim={left + 10} waitAt={lane ? doorW * 0.42 + 48 : left - 30} moving={moving} size={size} />}
      </AnimatePresence>
      {finger && endAt && (
        <motion.div
          key={finger.path.join('|') + String(finger.found)}
          className="pointer-events-none absolute"
          style={{ left: 0, top: 0, zIndex: 3 }}
          initial={moving && !instant ? { x: (fp[0]?.[0] ?? endAt[0]) - 14, y: -6, opacity: 0 } : false}
          animate={
            moving && !instant
              ? {
                  x: [...fp.map((p) => p[0] - 14), endAt[0] - 14],
                  y: [...fp.map(() => -6), -6],
                  opacity: finger.found ? [1, ...fp.map(() => 1)] : [...fp.map(() => 1), 0],
                  transition: { duration: 0.62 * (fp.length + 1), ease: 'easeInOut' },
                }
              : { x: endAt[0] - 14, y: -6, opacity: finger.found ? 1 : 0 }
          }
        >
          <Glass />
        </motion.div>
      )}
      {children}
    </div>
  )
}

/** The bag's door zone width, for laying out a figure beside it. */
export const BAG_DOOR = DOOR_W

/** Where a chip sits in a bag (the same sum `Bag` makes), for something drawn over the bag (C7's pointer). */
export function bagSlot(i: number, w: number, h: number, door = true, drift = 0): [number, number] {
  const [fx, fy] = SLOTS[(i + drift * 3) % SLOTS.length]
  return [(door ? DOOR_W : 0) + fx * w, fy * h]
}
