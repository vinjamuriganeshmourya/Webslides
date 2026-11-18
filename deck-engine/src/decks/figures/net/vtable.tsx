import { useEffect, useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { STILL, useBuild } from '../scene'

/**
 * THE TABLE, AS A VISUAL BUILD (user, 2026-11-03: "convert text-only tables into
 * visual builds with icons and micro-animations, keeping all table data
 * unchanged"; it applies to every table slide).
 *
 * The kit table's look (`DataTable`: the lit panel, the tinted header, the
 * banded rows) with three things added and nothing taken away:
 *
 *   header icons   a column names a side (a VM, a container, a tool); its icon
 *                  sits before the head, the head's words unchanged
 *   row icons      each row's subject drawn in a tile before its first cell, the
 *                  icon carrying a micro-animation that says what the row is
 *                  about (a gauge needle sweeps on a measure, a gear turns on a
 *                  process, a lock closes on isolation)
 *   the build      the header lands with the frame, then the rows arrive one at
 *                  a time, every column of a row together (the spec's "a row
 *                  reveals all its columns together"); the row that just arrived
 *                  is lit with an accent edge and a sheen that crosses it once.
 *                  Auto animation off, one row per press.
 *
 * Cells are passed in as they were: the words are the spec's.
 */

export type VCol = { label: ReactNode; icon?: ReactNode; weight?: number; /** the header icon is drawn bare: no white tile, no border (Session 11 review 2026-11-12: brand logos in a header, all styled alike) */ bare?: boolean }
export type VRow = { icon?: ReactNode; cells: ReactNode[]; /** per-cell owner tint (Session 12 TR 11): customer blue, provider grey, shared half and half */ tones?: (CellTone | undefined)[] }
export type CellTone = 'customer' | 'provider' | 'shared' | 'risk' | 'safe'
const TONE_BG: Record<CellTone, string> = {
  customer: 'linear-gradient(135deg, #E9F0FF 0%, #DCE7FF 100%)',
  provider: 'linear-gradient(135deg, #F2F4F7 0%, #E6E9EF 100%)',
  shared: 'linear-gradient(90deg, #E2EBFF 0%, #E2EBFF 50%, #E9ECF1 50%, #E9ECF1 100%)',
  /* Session 14 TR 17: risk = template orange tint (rule 51), safe = success green tint */
  risk: 'linear-gradient(135deg, #FFF3E8 0%, #FFE7D3 100%)',
  safe: 'linear-gradient(135deg, #ECFAF0 0%, #DDF4E5 100%)',
}
const TONE_RIM: Record<CellTone, string> = { customer: '#2F6BFF2e', provider: '#C9D0DB80', shared: '#C9D0DB80', risk: '#FF8A3D55', safe: '#16A34A40' }

const EASE = 'cubic-bezier(0.22,1,0.36,1)'

export function VisualTable({ columns, rows, compact = false, ms = 560, className = '', size = 16, shown: given, highlight = [], ringCol = [], logo = false, bigIcons = false }: { columns: VCol[]; rows: VRow[]; compact?: boolean; ms?: number; className?: string; size?: number; /** rows shown, when the slide drives the build itself (a figure beside the table follows the same press) */ shown?: number; /** rows (0-based) the card marks in the template's orange, whatever the build */ highlight?: number[]; /** columns (0-based) ringed in the template orange, as the TR asks (Session 11 TR 15) */ ringCol?: number[]; /** icons are brand logos: a larger white tile so the mark reads (Session 11) */ logo?: boolean; /** icons large and bare: no tile, no border, the mark itself 40 px in the header and 34 px in a row (Session 10 round 2) */ bigIcons?: boolean }) {
  const own = useBuild(given === undefined ? rows.length + 1 : 0, ms)
  const shown = given ?? own
  /*
    THE ARRIVING ROW IS LIT ONLY WHILE IT ARRIVES (user, 2026-11-04, 5.md global rule 3: "never highlight the last
    row automatically"): the tint, the orange bar and the sheen used to stay on whichever row came in last, so every
    finished table kept its last row marked. Now they clear ~1.1s after the row lands; only `highlight` rows stay.
  */
  const [fresh, setFresh] = useState(-1)
  useEffect(() => {
    if (STILL || shown <= 0) return setFresh(-1)
    setFresh(shown - 1)
    const t = window.setTimeout(() => setFresh(-1), 1100)
    return () => window.clearTimeout(t)
  }, [shown])
  const grid = columns.map((c) => `${c.weight ?? 1}fr`).join(' ')
  const pad = compact ? 'px-4 py-2' : 'px-4 py-3'
  const color = colors.brand
  return (
    <div
      className={`relative overflow-hidden rounded-card border border-line ${className}`}
      style={{
        background: 'radial-gradient(120% 90% at 10% 0%, #FFFFFF 0%, #FFFFFF 52%, #F6F9FE 100%)',
        boxShadow: [`0 10px 28px -16px ${color}66`, `0 2px 6px -4px ${colors.brandDeep}1f`, 'inset 0 1px 0 0 #FFFFFF'].join(', '),
      }}
    >
      <div
        className="grid items-center gap-x-2"
        style={{
          gridTemplateColumns: grid,
          background: ['radial-gradient(120% 140% at 12% 0%, #FFFFFFb3 0%, #FFFFFF00 64%)', `linear-gradient(135deg, ${color}0a 0%, ${color}14 100%)`].join(', '),
          boxShadow: `inset 0 -1px 0 0 ${color}29`,
        }}
      >
        {columns.map((c, i) => (
          <div key={i} className={`${pad} flex items-center gap-2 font-heading font-bold`} style={{ color, fontSize: size }}>
            {c.icon && (
              <span aria-hidden className={bigIcons ? 'grid h-[40px] w-[40px] shrink-0 place-items-center [&_svg]:!h-[32px] [&_svg]:!w-[32px] [&_img]:!h-[40px] [&_img]:!w-[40px] [&_img]:object-contain' : logo ? 'grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[9px] [&_svg]:h-[18px] [&_svg]:w-[18px] [&_img]:!h-[28px] [&_img]:!w-[28px] [&_img]:object-contain' : 'grid h-[28px] w-[28px] shrink-0 place-items-center rounded-[8px] [&_svg]:h-[16px] [&_svg]:w-[16px] [&_img]:h-[16px] [&_img]:w-[16px]'} style={bigIcons || c.bare ? undefined : { background: colors.white, boxShadow: `inset 0 0 0 1.5px ${color}40` }}>
                <span className={STILL ? 'grid place-items-center' : 'cvx-ticon grid place-items-center'} style={{ animationDelay: `${-i * 0.45}s` }}>{c.icon}</span>
              </span>
            )}
            <span>{c.label}</span>
          </div>
        ))}
      </div>
      <div className="block">
        {rows.map((row, r) => {
          const on = r < shown
          const isFresh = on && r === fresh
          return (
            <div
              key={r}
              className="relative grid items-center gap-x-2 overflow-hidden border-t border-line"
              style={{
                gridTemplateColumns: grid,
                background: highlight.includes(r) ? 'linear-gradient(135deg, #FFF4E6 0%, #FFE6CC 100%)' : isFresh ? `linear-gradient(135deg, ${color}0c 0%, ${color}1c 100%)` : r % 2 ? '#FBFDFF' : undefined,
                boxShadow: isFresh || highlight.includes(r) ? `inset 4px 0 0 0 ${colors.accent}` : undefined,
                opacity: on ? 1 : 0,
                transform: on ? 'none' : 'translateX(-18px)',
                transition: `opacity 300ms ${EASE}, transform 340ms ${EASE}, background 420ms ${EASE}, box-shadow 420ms ${EASE}`,
              }}
            >
              {/* the sheen: a soft band that crosses the row once as it arrives */}
              {isFresh && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 w-[30%] cvx-sheen"
                  style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0) 100%)' }}
                />
              )}
              {row.cells.map((cell, c) => {
                const tone = row.tones?.[c]
                return (
                <div key={c} className={`${pad} leading-snug ${c === 0 ? 'font-semibold' : ''}`} style={{ fontSize: size, color: c === 0 ? colors.ink : colors.body, ...(tone ? { background: TONE_BG[tone], boxShadow: `inset 0 0 0 1px ${tone === 'customer' ? colors.brand + '2e' : TONE_RIM[tone]}`, borderRadius: 6, margin: '5px 8px 5px 0', color: tone === 'customer' ? colors.brandDeep : colors.ink, fontWeight: 600 } : {}) }}>
                  {c === 0 && row.icon ? (
                    <span className="flex items-center gap-2.5">
                      <span aria-hidden className={bigIcons ? 'grid h-[36px] w-[36px] shrink-0 place-items-center [&_svg]:!h-[32px] [&_svg]:!w-[32px] [&_img]:!h-[36px] [&_img]:!w-[36px] [&_img]:object-contain' : logo ? 'grid h-[46px] w-[46px] shrink-0 place-items-center rounded-[10px] [&_svg]:h-[20px] [&_svg]:w-[20px] [&_img]:!h-[34px] [&_img]:!w-[34px] [&_img]:object-contain' : 'grid h-[32px] w-[32px] shrink-0 place-items-center rounded-[9px] [&_svg]:h-[18px] [&_svg]:w-[18px] [&_img]:h-[18px] [&_img]:w-[18px]'} style={bigIcons ? { color: colors.brand } : { background: logo ? colors.white : isFresh ? colors.brand : colors.surface2, color: logo ? colors.brand : isFresh ? colors.white : colors.brand, boxShadow: logo ? `inset 0 0 0 1.5px ${color}33, 0 4px 10px -6px ${colors.brandDeep}55` : undefined, transition: `all 420ms ${EASE}` }}>
                        <span className={STILL ? 'grid place-items-center' : 'cvx-ticon grid place-items-center'} style={{ animationDelay: `${-(columns.length + r) * 0.45}s` }}>{row.icon}</span>
                      </span>
                      <span className="min-w-0">{cell}</span>
                    </span>
                  ) : (
                    cell
                  )}
                </div>
                )
              })}
            </div>
          )
        })}
      </div>
      {ringCol.length > 0 && (
        <div aria-hidden className="pointer-events-none absolute inset-0 grid gap-x-2" style={{ gridTemplateColumns: grid }}>
          {columns.map((_, i) => (
            <span key={i} className="block rounded-[12px]" style={{ margin: 4, boxShadow: ringCol.includes(i) ? `inset 0 0 0 3px ${colors.accent}` : undefined }} />
          ))}
        </div>
      )}
    </div>
  )
}

/** The sheen's one crossing, appended to the deck's CSS with the rest of `FX_CSS`. */
export const VTABLE_CSS = `
@keyframes cvx-sheen { 0% { transform: translateX(-110%); opacity: 0 } 20% { opacity: 1 } 100% { transform: translateX(380%); opacity: 0 } }
.cvx-sheen { animation: cvx-sheen 1.1s cubic-bezier(0.45,0,0.55,1) 1 both; }
.cc-still .cvx-sheen, .deck-thumb .cvx-sheen { display: none; }
@media (prefers-reduced-motion: reduce) { .cvx-sheen { display: none; } }
/* Session 10 correction 15 (FIG-35): every table icon floats and breathes, one effect for the whole table, offset per
   icon so they do not move in lockstep. 3.6 s, seamless (ends where it starts), held still on ?still / thumbnails. */
@keyframes cvx-ticon { 0%, 100% { transform: translateY(0) scale(1) } 50% { transform: translateY(-2.5px) scale(1.08) } }
.cvx-ticon { animation: cvx-ticon 3.6s cubic-bezier(0.45,0,0.55,1) infinite; will-change: transform; }
.cvx-ticon > svg, .cvx-ticon > img { display: block; }
.cc-still .cvx-ticon, .deck-thumb .cvx-ticon { animation: none; }
@media (prefers-reduced-motion: reduce) { .cvx-ticon { animation: none; } }
`
