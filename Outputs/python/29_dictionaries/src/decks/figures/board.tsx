import { useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useTween } from '@/ui'
import { useInstant } from '@/motion/instant'

/**
 * THE ONE PICTURE OF PF 29 "DICTIONARIES" (spec note 5): Anna's canteen board.
 *
 * A dictionary is drawn as the board from the hook: a framed board, one row
 * per key, the NAME TAG on the left (the deck's `key_1` tag, dark blue), an
 * arrow, and its PRICE CARD on the right (the deck's `value_1` box), in the
 * order the rows were added. No row ever shows a number.
 *
 *   sticker   a changed value is a new card stuck over the old one, in the
 *             same row (the old one is gone: never struck through beside it)
 *   new row   a new key is written at the bottom; rows never reorder
 *   wipe      a deleted row is wiped, tag and card together, and the rows
 *             under it close up
 *   lift      a lookup lights the tag and lifts a COPY of its card; the row
 *             keeps its price
 *   search    a word walks down the TAG column only, in its own lane to the
 *             left of the tags (rule 42: never over a box); past the last
 *             tag it reports no tag, with an alarm ([ ]) or quietly (get)
 *   marker    the hook's form: the same rows as marker handwriting, which
 *             cross-fade into tags and cards when `marker` turns off
 *
 * Every colour is a token (rule 37); every timing is the explanatory tier.
 * Transform and opacity only, except the wipe's clip. Session-local.
 */

const HOUSE = [0.22, 1, 0.36, 1] as const
const HOUSE_CSS = 'cubic-bezier(0.22, 1, 0.36, 1)'

export type Row = { key: string; value: string | number }
export type RowTone = 'plain' | 'lit' | 'grey' | 'new'

export const SZ = {
  lg: { h: 40, tagFs: 16, cardFs: 17, tagW: 120, cardW: 68, arrow: 40, gap: 9, pad: 14 },
  md: { h: 36, tagFs: 15, cardFs: 16, tagW: 108, cardW: 60, arrow: 36, gap: 8, pad: 12 },
  sm: { h: 28, tagFs: 13, cardFs: 14, tagW: 92, cardW: 50, arrow: 30, gap: 5, pad: 10 },
} as const
export type BoardSize = keyof typeof SZ

export type Search = {
  /** the word being looked for, as the code wrote it */
  label: string
  /** the row the finger is beside (0-based); `rows.length` is past the last tag */
  at: number
  /** the finger has stopped on this row: its tag matched */
  found?: boolean
  /** past the last tag: the alarm ([ ] and del stop the program) or the quiet return (get) */
  miss?: 'alarm' | 'quiet'
}

export type BoardRefs = { tags: Record<string, HTMLElement | null>; cards: Record<string, HTMLElement | null>; rows: Record<string, HTMLElement | null> }

/** The marker's blue: the brand's dark blue, which is the template's (rule 37). */
const MARKER = colors.brandDark

/** A short arrow with a filled 9px head, path-drawn once when it mounts (rules 45, 46). */
export function TagArrow({ w, draw = true, dim = false, delay = 0 }: { w: number; draw?: boolean; dim?: boolean; delay?: number }) {
  const instant = useInstant()
  const len = w - 12
  return (
    <svg width={w} height="16" viewBox={`0 0 ${w} 16`} aria-hidden className="shrink-0" style={{ opacity: dim ? 0.35 : 1, transition: `opacity 420ms ${HOUSE_CSS}` }}>
      <path d={`M2 8 H${len}`} stroke={colors.brand} strokeWidth="2.5" strokeLinecap="butt" fill="none" pathLength={1} strokeDasharray="1" style={{ strokeDashoffset: draw && !instant ? 1 : 0, animation: draw && !instant ? `pf29-draw 620ms ${HOUSE_CSS} ${delay}ms forwards` : 'none' }} />
      <path d={`M${len} 3.5 L${len + 9} 8 L${len} 12.5 Z`} fill={colors.brand} style={{ opacity: draw && !instant ? 0 : 1, animation: draw && !instant ? `pf29-fade 200ms linear ${delay + 480}ms forwards` : 'none' }} />
    </svg>
  )
}

const CSS = `
@keyframes pf29-draw { to { stroke-dashoffset: 0; } }
@keyframes pf29-fade { to { opacity: 1; } }
@keyframes pf29-alarm { 0%, 100% { box-shadow: 0 0 0 0 ${colors.danger}00; } 30% { box-shadow: 0 0 0 6px ${colors.danger}55; } 60% { box-shadow: 0 0 0 0 ${colors.danger}00; } 80% { box-shadow: 0 0 0 6px ${colors.danger}55; } }
.pf29-alarm { animation: pf29-alarm 1100ms ease-out 1; }
@media (prefers-reduced-motion: reduce) { .pf29-alarm { animation: none; } }
`
if (typeof document !== 'undefined' && !document.querySelector('style[data-pf29-board]')) {
  const el = document.createElement('style')
  el.dataset.pf29Board = ''
  el.textContent = CSS
  document.head.appendChild(el)
}

/** The name tag: the deck's `key_1`, a dark blue tag with the name in mono. */
function Tag({ text, tone, size, refEl, quote }: { text: string; tone: RowTone; size: BoardSize; refEl?: (el: HTMLElement | null) => void; quote: boolean }) {
  const s = SZ[size]
  const tween = useTween(420)
  const lit = tone === 'lit'
  return (
    <span
      ref={refEl}
      className="grid shrink-0 place-items-center rounded-lg font-mono font-bold"
      style={{
        width: s.tagW,
        height: s.h,
        fontSize: s.tagFs,
        background: lit ? colors.brand : tone === 'new' ? colors.brandDark : colors.brandDark,
        color: colors.white,
        boxShadow: lit ? `0 0 0 4px ${colors.brand}33, 0 8px 18px -10px ${colors.brand}` : `0 0 0 0 ${colors.brand}00`,
        opacity: tone === 'grey' ? 0.38 : 1,
        transition: tween,
        whiteSpace: 'nowrap',
      }}
    >
      {quote ? `"${text}"` : text}
    </span>
  )
}

/**
 * The price card: the deck's `value_1` box. A changed value is a NEW card
 * stuck over the old one (the sticker), which fades out underneath.
 */
function Card({ value, tone, size, stuck, dim, refEl }: { value: string | number; tone: RowTone; size: BoardSize; stuck: boolean; dim: boolean; refEl?: (el: HTMLElement | null) => void }) {
  const s = SZ[size]
  const instant = useInstant()
  const tween = useTween(420)
  const lit = tone === 'lit'
  return (
    <span ref={refEl} className="relative block shrink-0" style={{ width: s.cardW, height: s.h, opacity: tone === 'grey' ? 0.38 : dim ? 0.35 : 1, transition: tween }}>
      <AnimatePresence initial={false}>
        <motion.span
          key={String(value)}
          className="absolute inset-0 grid place-items-center rounded-lg font-mono font-bold"
          style={{
            fontSize: s.cardFs,
            background: stuck ? '#FFF4EC' : lit ? colors.surface2 : colors.white,
            color: colors.ink,
            boxShadow: `inset 0 0 0 ${lit || stuck ? 2.5 : 2}px ${stuck ? colors.accent : colors.brand}${lit ? `, 0 0 0 4px ${colors.brand}33` : ''}`,
            transition: `background-color 420ms ${HOUSE_CSS}, box-shadow 420ms ${HOUSE_CSS}`,
          }}
          initial={instant ? false : { opacity: 0, y: -16, rotate: -9, scale: 1.08 }}
          animate={{ opacity: 1, y: 0, rotate: stuck ? -2.5 : 0, scale: 1, transition: { duration: instant ? 0 : 0.62, ease: HOUSE } }}
          exit={{ opacity: 0, transition: { duration: instant ? 0 : 0.45, ease: HOUSE, delay: instant ? 0 : 0.35 } }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/** A marker line on the whiteboard: the hook's form of a row, `Tea 12`, before anyone names its parts. */
function MarkerLine({ k, value, tone, size, tilt, nameOnly }: { k: string; value: string | number; tone: RowTone; size: BoardSize; tilt: number; nameOnly: boolean }) {
  const s = SZ[size]
  const tween = useTween(420)
  const lit = tone === 'lit'
  const litValue = lit && !nameOnly
  const cap = k.charAt(0).toUpperCase() + k.slice(1)
  return (
    <span className="flex items-center font-heading font-bold" style={{ height: s.h, fontSize: s.tagFs + 6, color: lit ? colors.brand : MARKER, letterSpacing: '0.02em', transform: `rotate(${tilt}deg)`, opacity: tone === 'grey' ? 0.38 : 1, transition: tween }}>
      <span style={{ width: s.tagW + s.arrow - 8, display: 'inline-block', lineHeight: 1, textShadow: lit ? `0 0 14px ${colors.brand}66` : 'none', transition: tween }}>{cap}</span>
      <span style={{ display: 'inline-block', lineHeight: 1, color: litValue ? colors.brand : MARKER, textShadow: litValue ? `0 0 14px ${colors.brand}66` : 'none', transition: tween }}>{value}</span>
    </span>
  )
}

/** The search finger: the word being looked for, pointing at a tag from the lane on the left. */
function Finger({ search, size, lane, rowTop }: { search: Search; size: BoardSize; lane: number; rowTop: (i: number) => number }) {
  const s = SZ[size]
  const tween = useTween(460)
  const past = search.miss !== undefined
  const tone = search.found ? colors.success : past ? (search.miss === 'alarm' ? colors.danger : colors.muted) : colors.brandDark
  const bg = search.found ? '#E9F8EF' : past ? (search.miss === 'alarm' ? '#FDECEC' : colors.surface) : colors.white
  return (
    <div className={`absolute flex items-center gap-1 ${search.miss === 'alarm' ? 'pf29-alarm' : ''}`} style={{ left: 0, width: lane - 4, top: rowTop(Math.min(search.at, Number.MAX_SAFE_INTEGER)), height: s.h, transition: tween, justifyContent: 'flex-end', borderRadius: 10 }}>
      <span className="flex flex-col items-center whitespace-nowrap rounded-md px-2 font-mono font-bold" style={{ fontSize: s.tagFs - 1, lineHeight: past ? '15px' : `${s.h - 10}px`, color: tone, background: bg, boxShadow: `inset 0 0 0 2px ${tone}`, transition: tween, paddingTop: past ? 2 : 0, paddingBottom: past ? 2 : 0 }}>
        {past && <span className="font-body text-[10.5px] font-bold uppercase tracking-wider">no tag</span>}
        <span>{search.label}</span>
      </span>
      <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden className="shrink-0">
        <path d="M1 1 L11 7 L1 13 Z" fill={tone} style={{ transition: `fill 420ms ${HOUSE_CSS}` }} />
      </svg>
    </div>
  )
}

export function Board({
  rows,
  tones = {},
  size = 'md',
  name,
  title,
  labels = false,
  boxed,
  lift,
  stuck = [],
  dimCards = false,
  search,
  lane,
  marker = false,
  nameOnly = [],
  quote = false,
  refs,
  empty,
  minRows,
  className = '',
  style,
}: {
  rows: Row[]
  tones?: Record<string, RowTone>
  size?: BoardSize
  /** the dictionary's name, a small mono tag at the board's top (`menu`) */
  name?: string
  /** the hook's board title, in marker (`Anna's Canteen`) */
  title?: string
  /** `key` and `value` over the two columns (C1) */
  labels?: boolean
  /** the row boxed as one item, with the word beside it (C1) */
  boxed?: string
  /** the key whose card lifts out as a copy (a lookup): the copy comes out to the LEFT of the tag, into the lane, where the question went in; pass `lane` with it */
  lift?: string | null
  /** keys whose card is a sticker just stuck over an old price */
  stuck?: string[]
  /** the price column dim: `in` looks at the names only (C7) */
  dimCards?: boolean
  search?: Search | null
  /** reserve the search lane (px) on the left, so the board does not move when a search starts */
  lane?: number
  /** the hook's marker handwriting instead of tags and cards */
  marker?: boolean
  /** lit rows whose name is lit but whose price is not yet (the hook's press 2: name first, then its price) */
  nameOnly?: string[]
  /** tags in quotes, as the code writes them */
  quote?: boolean
  refs?: RefObject<BoardRefs>
  /** words on an empty board */
  empty?: string
  /** keep the board at least this many rows tall, so it never grows between presses */
  minRows?: number
  className?: string
  style?: CSSProperties
}) {
  const s = SZ[size]
  const instant = useInstant()
  const tween = useTween(420)
  const laneW = lane ?? 0
  const n = Math.max(rows.length, minRows ?? 0, 1)
  const bodyH = n * s.h + (n - 1) * s.gap
  const wasMarker = useRef(marker)
  const zipped = wasMarker.current && !marker
  useEffect(() => {
    wasMarker.current = marker
  }, [marker])
  return (
    <div
      className={`relative rounded-2xl ${className}`}
      style={{
        padding: s.pad,
        paddingLeft: s.pad + laneW,
        background: colors.white,
        boxShadow: `inset 0 0 0 3px ${colors.line}, 0 12px 26px -18px rgba(16,32,58,0.35)`,
        ...style,
      }}
    >
      {name && (
        <span className="absolute -top-3 left-3 rounded-md px-2 py-0.5 font-mono text-[13px] font-bold leading-none" style={{ background: colors.brandDark, color: colors.white }}>
          {name}
        </span>
      )}
      {title && (
        <div className="flex items-center font-heading font-bold" style={{ height: 24, fontSize: 17, color: MARKER, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {title}
        </div>
      )}
      {labels && (
        <div className="flex items-start font-body text-[12px] font-bold uppercase tracking-wider" style={{ height: 30, color: colors.brand }}>
          <span className="sm-bump" style={{ width: s.tagW, textAlign: 'center' }}>key</span>
          <span style={{ width: s.arrow }} />
          <span className="sm-bump" style={{ width: s.cardW, textAlign: 'center' }}>value</span>
        </div>
      )}
      <div className="relative" style={{ minHeight: bodyH, transition: tween }}>
        {rows.length === 0 && empty && (
          <span className="absolute inset-0 grid place-items-center rounded-xl font-heading text-[16px] font-semibold" style={{ color: colors.muted, border: `2px dashed ${colors.line}` }}>
            {empty}
          </span>
        )}
        <AnimatePresence initial={false}>
          {rows.map((r, i) => {
            const tone = tones[r.key] ?? 'plain'
            const isNew = tone === 'new'
            return (
              <motion.div
                key={r.key}
                layout={instant ? false : 'position'}
                ref={(el) => {
                  if (refs?.current) refs.current.rows[r.key] = el
                }}
                className="relative flex items-center"
                style={{ height: s.h, marginBottom: i < rows.length - 1 ? s.gap : 0, minWidth: s.tagW + s.arrow + s.cardW }}
                initial={instant || !isNew ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0, transition: { duration: instant ? 0 : 0.6, ease: HOUSE } }}
                exit={{ opacity: 0, clipPath: 'inset(0 0 0 100%)', transition: { duration: instant ? 0 : 0.7, ease: HOUSE } }}
                transition={{ layout: { duration: instant ? 0 : 0.55, ease: HOUSE } }}
              >
                {boxed === r.key && (
                  <svg aria-hidden className="pointer-events-none absolute" style={{ left: -8, top: -7, width: s.tagW + s.arrow + s.cardW + 16, height: s.h + 14, overflow: 'visible' }}>
                    <rect x="1.5" y="1.5" width={s.tagW + s.arrow + s.cardW + 13} height={s.h + 11} rx="10" fill="none" stroke={colors.accent} strokeWidth="3" strokeDasharray="1" pathLength={1} style={{ strokeDashoffset: instant ? 0 : 1, animation: instant ? 'none' : `pf29-draw 860ms ${HOUSE_CSS} forwards` }} />
                  </svg>
                )}
                <AnimatePresence mode="sync" initial={false}>
                  {marker ? (
                    <motion.div key="marker" className="absolute inset-0 flex items-center" initial={false} exit={{ opacity: 0, transition: { duration: instant ? 0 : 0.5 } }}>
                      <MarkerLine k={r.key} value={r.value} tone={tone} size={size} tilt={((i * 7) % 3) - 1} nameOnly={nameOnly.includes(r.key)} />
                    </motion.div>
                  ) : (
                    <motion.div key="tags" className="flex items-center" initial={instant || !zipped ? false : { opacity: 0 }} animate={{ opacity: 1, transition: { duration: instant ? 0 : 0.6, delay: instant ? 0 : 0.25 + i * 0.1 } }}>
                      <Tag text={r.key} tone={tone} size={size} quote={quote} refEl={(el) => refs?.current && (refs.current.tags[r.key] = el)} />
                      <TagArrow w={s.arrow} draw={!instant} dim={dimCards} delay={zipped ? 350 + i * 100 : 0} />
                      <Card value={r.value} tone={tone} size={size} stuck={stuck.includes(r.key)} dim={dimCards} refEl={(el) => refs?.current && (refs.current.cards[r.key] = el)} />
                      {lift === r.key && (
                        <motion.span
                          aria-hidden
                          className="pointer-events-none absolute grid place-items-center rounded-lg font-mono font-bold"
                          style={{ left: s.tagW + s.arrow, top: 0, width: s.cardW, height: s.h, fontSize: s.cardFs, background: '#E9F8EF', color: colors.ink, boxShadow: `inset 0 0 0 2.5px ${colors.success}, 0 14px 24px -12px rgba(16,32,58,0.5)`, zIndex: 3 }}
                          initial={instant ? false : { x: 0, y: 0, scale: 1, opacity: 0.6 }}
                          animate={{ x: -(s.tagW + s.arrow + s.cardW + 14), y: 0, scale: 1.06, opacity: 1, transition: { duration: instant ? 0 : 0.55, ease: HOUSE } }}
                        >
                          {r.value}
                        </motion.span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                {boxed === r.key && (
                  <span className="sm-bump absolute whitespace-nowrap font-body text-[13px] font-bold uppercase tracking-wider" style={{ left: s.tagW + s.arrow + s.cardW + 18, color: colors.accentDark }}>
                    item
                  </span>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
        {search && laneW > 0 && (
          <div className="absolute" style={{ left: -laneW, top: 0, width: laneW, height: bodyH + s.h + s.gap }}>
            <Finger search={search} size={size} lane={laneW} rowTop={(i) => Math.min(i, rows.length) * (s.h + s.gap)} />
          </div>
        )}
      </div>
      {/* the marker tray at the board's foot */}
      <span aria-hidden className="mx-auto mt-2 block h-[5px] w-[42%] rounded-full" style={{ background: colors.line }} />
    </div>
  )
}

/** `[["tea", 12], ...]` from the spec as rows. */
export const toRows = (pairs: [string, number | string][]): Row[] => pairs.map(([key, value]) => ({ key, value }))

/** The canteen's full board, from the hook's data: tea 12, coffee 15, samosa 15, puff 20, maggi 30. */
export function menuRows(spec: Record<string, any>): Row[] {
  return toRows(spec.H1.data.board)
}

/** A small marker-written card beside the counter (H2's under-15 card, C13's notebook page). */
export function NoteCard({ title, lines, width = 200, children }: { title: string; lines?: string[]; width?: number; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl px-3.5 py-2.5" style={{ width, background: '#FFF9EC', boxShadow: `inset 0 0 0 2px ${colors.warning}66, 0 10px 22px -16px rgba(16,32,58,0.4)`, transform: 'rotate(-1.5deg)' }}>
      <span className="font-heading text-[14px] font-bold uppercase tracking-wider" style={{ color: colors.accentDark }}>
        {title}
      </span>
      {lines?.map((l, i) => (
        <span key={i} className="font-heading text-[17px] font-semibold" style={{ color: MARKER }}>
          {l}
        </span>
      ))}
      {children}
    </div>
  )
}
