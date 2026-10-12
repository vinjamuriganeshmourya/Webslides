import { type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'

/**
 * THE ONE PICTURE OF THE FIRST HALF OF PF 30 (spec note 5).
 *
 *   Sheet   a dictionary, drawn as Divya's Google Sheet from the hook: one row
 *           per key, the name on the left, the amount on the right, in the
 *           order the rows were added. The same component wears Anna's canteen
 *           board (the recap) and a hostel room card (C8) as `look`s.
 *   Tag     a variable: a name tag with an arrow to a sheet.
 *   Board   tags over sheets. Two tags can point at one sheet. A line that
 *           gives a sheet a second name adds a tag and an arrow, never a
 *           sheet; `copy()` adds a sheet. A tag that is re-pointed slides to
 *           its new sheet (G1 round 4); the sheet it left stays where it is.
 *
 * WHY TAGS ABOVE, NOT BESIDE. Session 20 drew tags to the left of its rows
 * with curved arrows; two sheets side by side would put the far tag's arrow
 * across the near sheet (content rule 42). A tag above its sheet has a short
 * straight arrow that crosses nothing, and two tags on one sheet sit side by
 * side above it, both heads visible.
 *
 * ARROWS (content rules 45, 46): a 3px shaft with a butt end, then a separate
 * 9px head whose base centre is the shaft's last point, on one axis. The
 * shaft draws itself in and the head appears once the shaft has reached it.
 *
 * The sheet's own colours (its green, its grid) stay inside the sheet
 * (content rule 37); everything around it is a token. Explanatory-tier
 * timing (generate-slides 4b); nothing moves during an instant jump.
 */

export type Row = [string, string | number]
export type RowTone = 'plain' | 'hot' | 'new' | 'now' | 'miss'
export type SheetLook = 'sheet' | 'board' | 'card'

const SZ = {
  md: { row: 26, font: 14, title: 12, head: 28, col: 18, numW: 24, w: 210 },
  sm: { row: 20, font: 12, title: 11, head: 22, col: 14, numW: 20, w: 176 },
} as const
export type SheetSize = keyof typeof SZ
export const SHEET = SZ

const EASE = [0.22, 1, 0.36, 1] as const
const MOVE = { duration: 0.72, ease: EASE }
/* the drawn app's own colours, inside the sheet only (content rule 37) */
const GREEN = '#188038'
const GRID = '#DADCE0'
const HEADBG = '#F1F3F4'
const SELECT = 'rgba(26,115,232,0.18)'
const BOARD = '#2F3B4A'

/** How tall a sheet of `rows` rows is, so a board can place tags and lanes before it renders. */
export function sheetHeight(rows: number, size: SheetSize = 'md', look: SheetLook = 'sheet', header = true) {
  const s = SZ[size]
  return s.head + (look === 'sheet' ? s.col : 0) + ((header ? 1 : 0) + Math.max(rows, 1)) * s.row + 2
}

/** The top of data row `i` inside a sheet, from the sheet's own top edge. */
export function rowTop(i: number, size: SheetSize = 'md', look: SheetLook = 'sheet', header = true) {
  const s = SZ[size]
  return s.head + (look === 'sheet' ? s.col : 0) + ((header ? 1 : 0) + i) * s.row + 1
}

/** The green document glyph of the sheets app. */
function SheetGlyph({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
      <path d="M3 1h7l3 3v11H3z" fill={GREEN} />
      <path d="M5 7h6v1.4H5zM5 9.6h6V11H5zM5 12.2h6v1.4H5z" fill="#FFFFFF" />
    </svg>
  )
}

function Line({
  n,
  s,
  a,
  b,
  head = false,
  tone = 'plain',
  selected = false,
  dimB = false,
  isSheet,
}: {
  n?: number
  s: (typeof SZ)[SheetSize]
  a: string
  b: string
  head?: boolean
  tone?: RowTone
  selected?: boolean
  dimB?: boolean
  isSheet: boolean
}) {
  const instant = useInstant()
  const rowBg = selected ? SELECT : tone === 'new' ? colors.surface2 : head ? HEADBG : colors.white
  const nameBg = tone === 'now' ? colors.surface2 : 'transparent'
  const amtBg = tone === 'hot' ? '#FFF4EC' : 'transparent'
  const ink = tone === 'miss' ? colors.muted : colors.ink
  const tr = instant ? 'none' : `background-color 420ms ${'cubic-bezier(0.22,1,0.36,1)'}, color 420ms`
  return (
    <div className="flex" style={{ height: s.row, background: rowBg, borderBottom: `1px solid ${GRID}`, fontSize: s.font, transition: tr }}>
      {isSheet && (
        <span className="grid shrink-0 place-items-center" style={{ width: s.numW, background: HEADBG, borderRight: `1px solid ${GRID}`, fontSize: s.font - 4, color: colors.body }}>
          {n}
        </span>
      )}
      <span className="flex min-w-0 flex-1 items-center whitespace-nowrap px-1.5 font-semibold" style={{ borderRight: `1px solid ${GRID}`, background: nameBg, color: head ? colors.body : ink, boxShadow: tone === 'now' ? `inset 0 0 0 2px ${colors.brand}` : 'none', transition: tr }}>
        {a}
      </span>
      <span className="flex min-w-0 flex-1 items-center whitespace-nowrap px-1.5 font-semibold" style={{ background: amtBg, color: head ? colors.body : dimB ? colors.muted : tone === 'hot' ? colors.accentDark : ink, boxShadow: tone === 'hot' ? `inset 0 0 0 2px ${colors.accent}` : 'none', transition: tr }}>
        {b}
      </span>
    </div>
  )
}

export function Sheet({
  title,
  rows,
  size = 'md',
  look = 'sheet',
  cols = ['Name', 'Paid'],
  tones = {},
  grey = false,
  selected = false,
  dimAmounts = false,
  width,
  share = false,
  lit = false,
  stagger = false,
  className = '',
}: {
  title?: string
  rows: Row[]
  size?: SheetSize
  look?: SheetLook
  /** the first row's two column names; `null` draws no first row (a room card has none) */
  cols?: [string, string] | null
  tones?: Record<string, RowTone>
  /** no name points at it any more: dashed and faded, and it stays so */
  grey?: boolean
  /** every row selected, the moment before Delete (H1, C3) */
  selected?: boolean
  /** the amounts greyed while a search walks the names only (C3) */
  dimAmounts?: boolean
  width?: number
  share?: boolean
  /** a brand ring: the sheet the room is looking at */
  lit?: boolean
  /** rows that mount arrive one after another (a copy drawn row by row) */
  stagger?: boolean
  className?: string
}) {
  const s = SZ[size]
  const instant = useInstant()
  const isSheet = look === 'sheet'
  const barBg = look === 'board' ? BOARD : look === 'card' ? colors.brandDark : colors.white
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-lg bg-white ${className}`}
      style={{
        width: width ?? s.w,
        boxShadow: lit ? `0 0 0 3px ${colors.brand}, 0 10px 24px -14px ${colors.brand}aa` : `0 0 0 1px ${GRID}, 0 6px 16px -10px rgba(16,32,58,0.35)`,
        opacity: grey ? 0.5 : 1,
        transition: instant ? 'none' : 'box-shadow 480ms cubic-bezier(0.22,1,0.36,1), opacity 480ms',
      }}
    >
      <div className="flex items-center gap-1.5 px-2" style={{ height: s.head, background: barBg, borderBottom: `1px solid ${GRID}` }}>
        {isSheet && <SheetGlyph size={s.font} />}
        <span className="whitespace-nowrap font-semibold" style={{ fontSize: s.title, color: isSheet ? colors.ink : colors.white }}>
          {title ?? ''}
        </span>
        {share && (
          <span className="ml-auto rounded-full px-2 py-[1px] font-bold" style={{ fontSize: s.title - 2, background: '#C2E7FF', color: '#001D35' }}>
            Share
          </span>
        )}
      </div>
      {isSheet && (
        <div className="flex" style={{ height: s.col, background: HEADBG, borderBottom: `1px solid ${GRID}`, fontSize: s.font - 4, color: colors.body }}>
          <span className="shrink-0" style={{ width: s.numW, borderRight: `1px solid ${GRID}` }} />
          <span className="grid flex-1 place-items-center" style={{ borderRight: `1px solid ${GRID}` }}>
            A
          </span>
          <span className="grid flex-1 place-items-center">B</span>
        </div>
      )}
      {cols && <Line n={isSheet ? 1 : undefined} s={s} a={cols[0]} b={cols[1]} head isSheet={isSheet} />}
      <AnimatePresence initial={false}>
        {rows.map(([name, amount], i) => (
          <motion.div
            key={`r-${name}`}
            layout={instant ? false : 'position'}
            className="overflow-hidden"
            initial={instant ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: s.row, transition: { duration: instant ? 0 : 0.42, ease: EASE, delay: instant ? 0 : stagger ? i * 0.22 : 0 } }}
            exit={{ opacity: 0, height: 0, transition: { duration: instant ? 0 : 0.18 } }}
          >
            <Line n={isSheet ? i + (cols ? 2 : 1) : undefined} s={s} a={name} b={String(amount)} tone={tones[name] ?? 'plain'} selected={selected} dimB={dimAmounts} isSheet={isSheet} />
          </motion.div>
        ))}
      </AnimatePresence>
      {rows.length === 0 && (
        <div className="flex" style={{ height: s.row, fontSize: s.font - 2 }}>
          {isSheet && <span className="shrink-0" style={{ width: s.numW, background: HEADBG, borderRight: `1px solid ${GRID}`, fontSize: s.font - 4, color: colors.body, display: 'grid', placeItems: 'center' }}>{cols ? 2 : 1}</span>}
          <span className="flex-1" style={{ borderRight: `1px solid ${GRID}` }} />
          <span className="flex-1" />
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------- tags */

export function Tag({ name, tone = 'plain', size = 'md' }: { name: string; tone?: 'plain' | 'grey' | 'person'; size?: SheetSize }) {
  const s = SZ[size]
  return (
    <span
      className="grid place-items-center whitespace-nowrap rounded-lg px-2.5 font-mono font-bold"
      style={{
        height: TAG_H - 4,
        fontSize: s.font,
        background: tone === 'grey' ? colors.surface : tone === 'person' ? colors.white : colors.brandDark,
        color: tone === 'grey' ? colors.muted : tone === 'person' ? colors.brandDark : colors.white,
        border: `2px ${tone === 'grey' ? 'dashed' : 'solid'} ${tone === 'grey' ? colors.muted : colors.brandDark}`,
      }}
    >
      {name}
    </span>
  )
}

export const TAG_H = 30
export const ARROW_LEN = 30
const HEAD = 9

/** A straight arrow down: the shaft draws itself, then the head appears at its base (rule 46). */
function DownArrow({ fresh }: { fresh: boolean }) {
  const instant = useInstant()
  const shaft = ARROW_LEN - HEAD - 1
  return (
    <svg width="12" height={ARROW_LEN} viewBox={`0 0 12 ${ARROW_LEN}`} aria-hidden className="block overflow-visible">
      <motion.line x1="6" y1="0" x2="6" y2={shaft} stroke={colors.accent} strokeWidth="3" strokeLinecap="butt" initial={fresh && !instant ? { pathLength: 0 } : { pathLength: 1 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease: EASE }} />
      <motion.polygon points={`1.5,${shaft} 10.5,${shaft} 6,${shaft + HEAD}`} fill={colors.accent} initial={fresh && !instant ? { opacity: 0 } : { opacity: 1 }} animate={{ opacity: 1 }} transition={{ duration: 0.16, delay: fresh && !instant ? 0.42 : 0 }} />
    </svg>
  )
}

/* ------------------------------------------------------------------ board */

export interface SheetSpec {
  id: string
  title?: string
  rows: Row[]
  look?: SheetLook
  cols?: [string, string] | null
  tones?: Record<string, RowTone>
  grey?: boolean
  selected?: boolean
  dimAmounts?: boolean
  share?: boolean
  lit?: boolean
  stagger?: boolean
  width?: number
  /** the loop's dot, on data row `i` (drawn in the lane left of the sheet) */
  dot?: number | null
  /** a search word walking the name column: on data row `at` (C3's `800 in trip`) */
  search?: { text: string; at: number } | null
}

export interface TagSpec {
  name: string
  /** the sheet it points at; `null` draws nothing (the name does not exist yet) */
  to: string | null
  tone?: 'plain' | 'grey' | 'person'
}

function tagWidth(name: string, size: SheetSize) {
  return Math.round(name.length * SZ[size].font * 0.62) + 24
}

/**
 * Tags over sheets. Sheets sit left to right, `gap` apart; the tags that
 * point at a sheet spread above its centre; each arrow is straight down.
 * `minRows` fixes the board's height so a row that vanishes moves nothing
 * else on the card. `lane` reserves a strip left of every sheet for the
 * loop's dot and the search word (E1, C3).
 */
export function Board({
  sheets,
  tags,
  size = 'md',
  gap = 40,
  minRows = 0,
  lane = false,
  className = '',
}: {
  sheets: SheetSpec[]
  tags: TagSpec[]
  size?: SheetSize
  gap?: number
  minRows?: number
  lane?: boolean
  className?: string
}) {
  const s = SZ[size]
  const instant = useInstant()
  const laneW = lane ? (sheets.some((sh) => sh.search) ? 44 : 26) : 0
  const xs: number[] = []
  let x = 0
  for (const sh of sheets) {
    xs.push(x)
    x += laneW + (sh.width ?? s.w) + gap
  }
  const width = Math.max(0, x - gap)
  const top = TAG_H + ARROW_LEN
  const tallest = Math.max(minRows, ...sheets.map((sh) => sh.rows.length))
  const height = top + sheetHeight(tallest, size, sheets[0]?.look ?? 'sheet', sheets[0]?.cols !== null)
  const groups = new Map<string, TagSpec[]>()
  for (const t of tags) if (t.to) groups.set(t.to, [...(groups.get(t.to) ?? []), t])
  const placed = tags
    .filter((t) => t.to && sheets.some((sh) => sh.id === t.to))
    .map((t) => {
      const si = sheets.findIndex((sh) => sh.id === t.to)
      const g = groups.get(t.to!)!
      const k = g.indexOf(t)
      const n = g.length
      const sw = sheets[si].width ?? s.w
      const cx = xs[si] + laneW + sw / 2 + (k - (n - 1) / 2) * Math.min(104, sw * 0.5)
      return { t, cx, w: tagWidth(t.name, size) }
    })
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width, height }}>
      {sheets.map((sh, i) => {
        const look = sh.look ?? 'sheet'
        const header = sh.cols !== null
        return (
          <motion.div key={`s-${sh.id}`} className="absolute" style={{ left: xs[i] + laneW, top }} initial={instant ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.52, ease: EASE }}>
            <Sheet title={sh.title} rows={sh.rows} size={size} look={look} cols={sh.cols === undefined ? ['Name', 'Paid'] : sh.cols} tones={sh.tones} grey={sh.grey} selected={sh.selected} dimAmounts={sh.dimAmounts} share={sh.share} lit={sh.lit} stagger={sh.stagger} width={sh.width} />
            {/* the lane: the dot on the row the loop is at, the search word on the row it checks */}
            {lane && sh.dot !== null && sh.dot !== undefined && sh.dot < sh.rows.length && (
              <motion.span aria-hidden className="absolute block rounded-full" style={{ width: 12, height: 12, background: colors.brand, left: -laneW + (laneW - 12) / 2 }} initial={instant ? false : { opacity: 0, top: rowTop(sh.dot, size, look, header) + (s.row - 12) / 2 }} animate={{ opacity: 1, top: rowTop(sh.dot, size, look, header) + (s.row - 12) / 2 }} transition={instant ? { duration: 0 } : { duration: 0.52, ease: EASE }} />
            )}
            {lane && sh.search && (
              <motion.span className="absolute grid place-items-center whitespace-nowrap rounded-md bg-white font-mono font-bold" style={{ left: -laneW + 2, width: laneW - 6, height: s.row - 4, fontSize: s.font - 3, color: colors.brandDark, boxShadow: `inset 0 0 0 1.5px ${colors.brand}` }} initial={instant ? false : { opacity: 0, top: rowTop(sh.search.at, size, look, header) + 2 }} animate={{ opacity: 1, top: rowTop(sh.search.at, size, look, header) + 2 }} transition={instant ? { duration: 0 } : { duration: 0.42, ease: EASE }}>
                {sh.search.text}
              </motion.span>
            )}
          </motion.div>
        )
      })}
      <AnimatePresence initial={false}>
        {placed.map(({ t, cx, w }) => (
          <motion.div key={`t-${t.name}`} className="absolute left-0 top-0" style={{ width: w }} initial={instant ? false : { x: cx - w / 2, y: -8, opacity: 0 }} animate={{ x: cx - w / 2, y: 0, opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} transition={instant ? { duration: 0 } : { x: MOVE, y: { duration: 0.42, ease: EASE }, opacity: { duration: 0.42, ease: EASE } }}>
            <div className="flex flex-col items-center">
              <Tag name={t.name} tone={t.tone} size={size} />
              <div style={{ height: 4 }} />
              <DownArrow fresh />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/** A short line of plain words under a board, the rule said once. */
export function Under({ children }: { children: ReactNode }) {
  return (
    <p className="text-[15px] font-semibold leading-snug" style={{ color: colors.body }}>
      {children}
    </p>
  )
}
