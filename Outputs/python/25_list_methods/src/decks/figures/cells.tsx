import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'

/**
 * THE ONE PICTURE FOR LISTS, ALL SESSION (spec note 4).
 *
 * A list is a row of cells with its index under each cell, from 0. When an
 * item comes in or goes out, the cells after it slide one place and their
 * index numbers change with them. A removed item vanishes: no grey ghost, no
 * strikethrough, the cells close the gap.
 *
 * Every cell is absolutely placed at `position x (width + gap)` and keyed by
 * its own identity, so a cell that changes position SLIDES there (the same
 * element moves, nothing is redrawn: the hook's keeps line), and its index
 * number is the position it now stands at. A `gap` entry is an empty place a
 * cell has just moved out of (C4's slide-along, one cell at a time, from the
 * end first). A cell that newly mounts drops in from above. A `vanish` cell
 * fades and shrinks where it stands; the next state leaves it out and the
 * cells after it slide left.
 *
 * Every colour is a token (content rule 37); the cursor lives in its own lane
 * above the cells and never enters one (rule 42). Explanatory-tier timing.
 */

export type CellState = 'plain' | 'new' | 'look' | 'match' | 'lit' | 'copy' | 'vanish' | 'sorted'

export type Cell =
  | { key: string; text: string; state?: CellState; inner?: string[] }
  | { key: string; gap: true }

/** Plain cells from a list of values, keyed by value and occurrence, so a repeated song keeps its own key. */
export function cellsOf(values: (string | number)[], states: Record<number, CellState> = {}, prefix = ''): Cell[] {
  const seen: Record<string, number> = {}
  return values.map((v, i) => {
    const t = String(v)
    seen[t] = (seen[t] ?? 0) + 1
    return { key: `${prefix}${t}#${seen[t]}`, text: t, state: states[i] }
  })
}

const LOOK: Record<CellState, { bg: string; ring: string; ink: string; thick?: boolean }> = {
  plain: { bg: colors.white, ring: colors.line, ink: colors.ink },
  new: { bg: colors.surface2, ring: colors.brand, ink: colors.brandDark, thick: true },
  look: { bg: colors.surface2, ring: colors.brand, ink: colors.brandDark, thick: true },
  match: { bg: '#E9F8EF', ring: colors.success, ink: colors.ink, thick: true },
  lit: { bg: '#FFF4EC', ring: colors.accent, ink: colors.ink, thick: true },
  copy: { bg: '#FFF4EC', ring: colors.accent, ink: colors.ink },
  vanish: { bg: colors.white, ring: colors.line, ink: colors.ink },
  sorted: { bg: '#E9F8EF', ring: colors.success, ink: colors.ink },
}

const KEYFRAMES = `
@keyframes pf25-cell-in { from { opacity: 0; transform: translateY(-26px); } to { opacity: 1; transform: none; } }
@keyframes pf25-fade { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
@keyframes pf25-wave { from { transform: scaleY(0.3); } to { transform: scaleY(1); } }
@keyframes pf25-wave-calm { from { transform: scaleY(0.25); } to { transform: scaleY(0.6); } }
@keyframes pf25-tick { 0% { transform: scale(1); } 40% { transform: scale(1.18); } 100% { transform: scale(1); } }
`
if (typeof document !== 'undefined' && !document.querySelector('style[data-pf25-cells]')) {
  const el = document.createElement('style')
  el.setAttribute('data-pf25-cells', '')
  el.textContent = KEYFRAMES
  document.head.appendChild(el)
}

const MONO = 0.6

/** The width every cell of a row takes: the longest text in `fit` decides, so the row is even and never resizes between steps. */
export function cellWidth(fit: string[], font: number, quote = true) {
  const longest = fit.reduce((m, t) => Math.max(m, t.length + (quote ? 2 : 0)), 0)
  return Math.max(Math.round(font * 2.9), Math.round(longest * font * MONO + font * 1.2))
}

const HOUSE = 'cubic-bezier(0.22, 1, 0.36, 1)'

/**
 * A list drawn as cells.
 *
 *   name     the tag at the left (`queue`, `ram`), the list's name
 *   cells    what is in it now, keyed (see `cellsOf`)
 *   fit      the values that decide the cell width (default: the cells)
 *   reserve  places to keep room for, so a growing row never pushes anything
 *   look     the place the cursor (remove's or index's finger) points at
 *   quote    draw strings with their quotes, as Python prints them
 *   empty    what an empty row says inside its brackets
 */
export function CellRow({
  name,
  cells,
  fit,
  reserve,
  font = 15,
  look = null,
  lookLabel,
  lane = true,
  quote = true,
  indices = true,
  empty = '[ ]',
  dim = false,
  tail,
}: {
  name?: string
  cells: Cell[]
  fit?: string[]
  reserve?: number
  font?: number
  look?: number | null
  lookLabel?: ReactNode
  lane?: boolean
  quote?: boolean
  indices?: boolean
  empty?: string
  /** the whole row faded: a list no name points at any more (G2) */
  dim?: boolean
  tail?: ReactNode
}) {
  const instant = useInstant()
  const texts = cells.flatMap((c) => ('gap' in c ? [] : c.inner ? [`[${c.inner.map((t) => `'${t}'`).join(', ')}]`] : [c.text]))
  const w = cellWidth(fit ?? texts, font, quote)
  const gap = Math.round(font * 0.45)
  const h = Math.round(font * 2.9)
  const idx = Math.round(font * 0.95)
  const laneH = lane ? 30 : 0
  const n = Math.max(cells.length, reserve ?? 0)
  const rowW = n > 0 ? n * (w + gap) - gap : w
  const xOf = (i: number) => i * (w + gap)
  const shown = look !== null && look !== undefined && look >= 0
  return (
    <div className="flex items-start gap-3" style={{ opacity: dim ? 0.35 : 1, transition: instant ? 'none' : `opacity 520ms ${HOUSE}` }}>
      {name && (
        <span
          className="shrink-0 rounded-lg px-3 font-mono font-bold"
          style={{ marginTop: laneH, height: h, lineHeight: `${h}px`, fontSize: font + 1, background: colors.brandDark, color: colors.white }}
        >
          {name}
        </span>
      )}
      <div className="relative shrink-0" style={{ width: rowW, height: laneH + h + (indices ? idx + 8 : 0) }}>
        {cells.length === 0 && (
          <span
            className="absolute grid place-items-center rounded-xl font-mono font-semibold"
            style={{ left: 0, top: laneH, height: h, width: Math.max(w, 64), fontSize: font, color: colors.muted, border: `2px dashed ${colors.line}`, animation: instant ? 'none' : `pf25-fade 520ms ${HOUSE} both` }}
          >
            {empty}
          </span>
        )}
        {shown && (
          <div
            aria-hidden
            className="absolute flex flex-col items-center"
            style={{ left: xOf(look!) + w / 2 - 40, top: 0, width: 80, height: laneH, justifyContent: 'flex-end', transition: instant ? 'none' : `left 420ms ${HOUSE}`, zIndex: 2, animation: instant ? 'none' : `pf25-fade 420ms ${HOUSE} both` }}
          >
            {lookLabel && (
              <span className="mb-0.5 whitespace-nowrap text-[12px] font-bold uppercase leading-none tracking-wider" style={{ color: colors.brandDark }}>
                {lookLabel}
              </span>
            )}
            <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden>
              <path d="M2 2 L10 12 L18 2 Z" fill={colors.brandDark} />
            </svg>
          </div>
        )}
        {cells.map((c, i) => {
          if ('gap' in c) return null
          const st = c.state ?? 'plain'
          const L = LOOK[st]
          const gone = st === 'vanish'
          const label = c.inner ? null : quote && Number.isNaN(Number(c.text)) ? `'${c.text}'` : c.text
          return (
            <div
              key={c.key}
              className="absolute flex flex-col items-center"
              style={{ left: xOf(i), top: laneH, width: w, transition: instant ? 'none' : `left 520ms ${HOUSE}` }}
            >
              <span
                className="grid place-items-center rounded-xl font-mono font-semibold"
                style={{
                  width: w,
                  height: h,
                  fontSize: font,
                  background: L.bg,
                  color: L.ink,
                  border: `${L.thick ? 3 : 2}px solid ${L.ring}`,
                  opacity: gone ? 0 : 1,
                  transform: gone ? 'scale(0.82)' : 'none',
                  whiteSpace: 'nowrap',
                  animation: instant ? 'none' : `pf25-cell-in 520ms ${HOUSE} both`,
                  transition: instant ? 'none' : `background-color 360ms ${HOUSE}, border-color 360ms ${HOUSE}, opacity 420ms ${HOUSE}, transform 420ms ${HOUSE}`,
                }}
              >
                {c.inner ? (
                  <span className="flex items-center gap-1" style={{ fontSize: font - 2 }}>
                    {c.inner.map((t) => (
                      <span key={t} className="rounded-md px-1.5 py-0.5" style={{ background: colors.white, boxShadow: `inset 0 0 0 1.5px ${colors.accent}` }}>
                        '{t}'
                      </span>
                    ))}
                  </span>
                ) : (
                  label
                )}
              </span>
              {indices && (
                <span
                  key={i}
                  className="font-mono font-medium leading-none"
                  style={{ marginTop: 8, height: idx, fontSize: idx, color: colors.muted, opacity: gone ? 0 : 1, transition: instant ? 'none' : `opacity 420ms ${HOUSE}`, animation: instant ? 'none' : `pf25-cell-in 420ms ${HOUSE} both` }}
                >
                  {i}
                </span>
              )}
            </div>
          )
        })}
      </div>
      {tail && (
        <span className="shrink-0 whitespace-nowrap font-semibold" style={{ marginTop: laneH, height: h, lineHeight: `${h}px`, fontSize: font + 1, color: colors.body }}>
          {tail}
        </span>
      )}
    </div>
  )
}

/** The shape of a method and its sentence, the deck's `list.append(value)` frame. Arrives last, after the run. */
export function Shape({ sig, text, on }: { sig: string; text: ReactNode; on: boolean }) {
  return (
    <div
      className="flex flex-col gap-1 rounded-card px-5 py-2.5"
      style={{
        background: colors.surface2,
        boxShadow: `inset 4px 0 0 ${colors.brandDark}`,
        opacity: on ? 1 : 0,
        transform: on ? 'none' : 'translateY(8px)',
        transition: `opacity 480ms ${HOUSE}, transform 480ms ${HOUSE}`,
      }}
    >
      <span className="whitespace-nowrap font-mono text-[22px] font-bold leading-snug" style={{ color: colors.brandDark }}>
        {sig}
      </span>
      <span className="text-[17px] font-semibold leading-snug" style={{ color: colors.body }}>
        {text}
      </span>
    </div>
  )
}
