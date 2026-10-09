import { createContext, type PointerEvent as RPointerEvent, useCallback, useContext, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { CONTROLS_BOTTOM } from './autoplay'

/**
 * USER-MOVABLE CONTENT (PF 25, user, 2026-10-08).
 *
 * The instructor can drag a code block, a box (output, note, cells, options),
 * or a code block together with its box, anywhere on the slide, and put
 * everything back with one press of Reset layout.
 *
 *   MoveScope   one per slide (`Panel` mounts it from the card id). Holds the
 *               offsets of every movable on the slide, keeps them in
 *               sessionStorage under the card id (so a slide keeps its layout
 *               for the session, across navigation and reloads, and never
 *               leaks into another slide), and draws Reset layout while
 *               anything on the slide has moved.
 *   Movable     a wrapper with a drag handle. It REPLACES a container div the
 *               layout already had (same className and style), so an unmoved
 *               slide renders exactly as it did without this feature: the
 *               handle is absolutely placed and transparent until the block
 *               is hovered, and no transform is set while the offset is 0.
 *               Movables nest: a group handle moves the code and its box
 *               together; each child handle moves just that child.
 *
 * THE DRAG
 *   - Pointer events on the handle only (mouse, pen, touch), with pointer
 *     capture. Text selection and a code block's own scroll are untouched,
 *     because nothing outside the handle listens.
 *   - The stage is scaled to the screen (`SlideStage`: CSS zoom, or a scale
 *     transform as the fallback). Pointer deltas are in screen pixels, so
 *     they are divided by the stage's scale (its on-screen width over 1280)
 *     and the block follows the pointer exactly at any size.
 *   - The block's own rect is clamped inside the stage's rect, so it can
 *     never be dragged off the slide.
 *   - While dragging, the block is raised (z-index 60) and lifted with a
 *     shadow; once dropped a moved block stays above its unmoved neighbours
 *     (z-index 30) so it is never hidden under what it was dropped on.
 *   - The handle is a <button>, so the deck's swipe navigation stands down on
 *     it (`gestures.ts` ignores a gesture that starts on a control) and a
 *     drag never changes the slide.
 *
 * EXPORT AND PRINT use the default layout: `@media print` drops every offset,
 * and the export host (`src/export/slideModule.tsx`, which renders without the
 * player) never mounts a scope with stored offsets: `exportMode()` below.
 */

type Offset = { x: number; y: number }
type Offsets = Record<string, Offset>

interface Scope {
  id: string
  get: (key: string) => Offset
  set: (key: string, o: Offset) => void
  /** bumps on Reset, so every Movable drops its live offset */
  epoch: number
}

const MoveCtx = createContext<Scope | null>(null)

const STORE = 'pf25-layout:'

/** The export host (`src/export/slideModule.tsx`) drives slides itself and hands them a reveal store; no stored layout applies there. */
function exportMode() {
  return typeof globalThis !== 'undefined' && '__slideRevealStore' in globalThis
}

function load(id: string): Offsets {
  try {
    const raw = window.sessionStorage.getItem(STORE + id)
    return raw ? (JSON.parse(raw) as Offsets) : {}
  } catch {
    return {}
  }
}

function save(id: string, offsets: Offsets) {
  try {
    const keys = Object.keys(offsets).filter((k) => offsets[k].x !== 0 || offsets[k].y !== 0)
    if (keys.length === 0) window.sessionStorage.removeItem(STORE + id)
    else window.sessionStorage.setItem(STORE + id, JSON.stringify(Object.fromEntries(keys.map((k) => [k, offsets[k]]))))
  } catch {
    /* storage blocked: the layout still works, it just does not survive a reload */
  }
}

const PRINT_CSS = `
[data-move-handle] { opacity: 0; transition: opacity 200ms; }
[data-movable]:hover > [data-move-handle], [data-move-handle]:focus-visible, [data-move-handle][data-on] { opacity: 1; }
/* a touch screen has no hover: the handles stay faintly visible there */
@media (hover: none) { [data-move-handle] { opacity: 0.6; } }
@media print { [data-movable] { transform: none !important; } [data-move-handle], [data-move-reset] { display: none !important; } }`

export function MoveScope({ id, children }: { id: string; children: ReactNode }) {
  const [offsets, setOffsets] = useState<Offsets>(() => (exportMode() ? {} : load(id)))
  const [epoch, setEpoch] = useState(0)
  useEffect(() => {
    if (document.querySelector('style[data-move-print]')) return
    const s = document.createElement('style')
    s.setAttribute('data-move-print', '')
    s.textContent = PRINT_CSS
    document.head.appendChild(s)
  }, [])
  const set = useCallback(
    (key: string, o: Offset) =>
      setOffsets((prev) => {
        const next = { ...prev, [key]: o }
        save(id, next)
        return next
      }),
    [id],
  )
  const get = useCallback((key: string) => offsets[key] ?? { x: 0, y: 0 }, [offsets])
  const moved = Object.values(offsets).some((o) => o.x !== 0 || o.y !== 0)
  const reset = () => {
    save(id, {})
    setOffsets({})
    setEpoch((e) => e + 1)
  }
  const value = useMemo(() => ({ id, get, set, epoch }), [id, get, set, epoch])
  /* A slide frame never scrolls. Its section is overflow-hidden, which still
     lets the browser scroll it (focus fix-up when Reset unmounts, a text
     selection dragged past the edge): put it straight back. Seen on the drag
     check at 1280x720, where Reset left the frame scrolled by 318px. */
  const marker = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const sec = marker.current?.closest('section')
    if (!sec) return
    const pin = () => {
      if (sec.scrollTop || sec.scrollLeft) sec.scrollTo(0, 0)
    }
    sec.addEventListener('scroll', pin)
    return () => sec.removeEventListener('scroll', pin)
  }, [])
  return (
    <MoveCtx.Provider value={value}>
      <span ref={marker} hidden />
      {children}
      {moved && <ResetLayout onReset={reset} />}
    </MoveCtx.Provider>
  )
}

/**
 * Reset layout: shown only while something on this slide has moved, so the
 * default slide carries nothing extra. It sits at the foot of the slide on the
 * left, on the step controls' line and clear of them, the player's bar and
 * the logo.
 */
function ResetLayout({ onReset }: { onReset: () => void }) {
  return (
    <button
      type="button"
      data-move-reset=""
      onClick={onReset}
      onMouseDown={(e) => e.preventDefault()}
      onKeyDown={(e) => e.key !== 'Enter' && e.key !== ' ' && e.currentTarget.blur()}
      aria-label="Reset layout"
      title="Put every moved box back where it was"
      className="absolute z-[70] inline-flex h-[34px] items-center gap-1.5 rounded-pill px-3.5 font-body text-[14px] font-semibold leading-none"
      style={{ right: 712, bottom: CONTROLS_BOTTOM, background: colors.white, color: colors.brandDark, boxShadow: `inset 0 0 0 1.5px ${colors.brand}, 0 6px 16px -8px rgba(0,37,75,0.35)` }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v5h5" />
      </svg>
      Reset layout
    </button>
  )
}

/** The grip: six dots, the universal "drag me" mark. */
function Grip() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" aria-hidden>
      {[0, 1, 2].map((r) => [0, 1].map((c) => <circle key={`${r}${c}`} cx={2.5 + c * 5} cy={3 + r * 5} r="1.5" fill="currentColor" />))}
    </svg>
  )
}

/**
 * A block the instructor can drag by its handle.
 *
 * `id` is unique on the slide. `group` draws the handle in the accent colour
 * and labels it, so the room can tell "move this pair" from "move this box".
 * `handle` places the grip: outside the block's top-left corner by default,
 * where it covers nothing.
 */
export function Movable({
  id,
  group = false,
  className = '',
  style,
  handle,
  children,
}: {
  id: string
  group?: boolean
  className?: string
  style?: CSSProperties
  /** where the grip sits; a group's grip defaults to the top centre, clear of its children's top-left grips */
  handle?: 'tl' | 'tr' | 'bl' | 'tc'
  children: ReactNode
}) {
  const scope = useContext(MoveCtx)
  const ref = useRef<HTMLDivElement>(null)
  const stored = scope?.get(id) ?? { x: 0, y: 0 }
  const [live, setLive] = useState<Offset | null>(null)
  const drag = useRef<{ pid: number; sx: number; sy: number; ox: number; oy: number; rect: DOMRect; stage: DOMRect; scale: number } | null>(null)
  useEffect(() => setLive(null), [scope?.epoch])
  const off = live ?? stored
  const moved = off.x !== 0 || off.y !== 0
  const dragging = live !== null

  if (!scope) return <div className={className} style={style}>{children}</div>

  const onDown = (e: RPointerEvent<HTMLButtonElement>) => {
    const el = ref.current
    const stageEl = el?.closest('[data-slide-stage], .slide-stage') as HTMLElement | null
    if (!el || !stageEl) return
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    const stage = stageEl.getBoundingClientRect()
    const scale = stage.width / (stageEl.offsetWidth || 1280) || 1
    drag.current = { pid: e.pointerId, sx: e.clientX, sy: e.clientY, ox: off.x, oy: off.y, rect: el.getBoundingClientRect(), stage, scale }
    setLive({ x: off.x, y: off.y })
  }
  const onMove = (e: RPointerEvent<HTMLButtonElement>) => {
    const d = drag.current
    if (!d || d.pid !== e.pointerId) return
    e.preventDefault()
    e.stopPropagation()
    /* screen-space delta, clamped so the block's rect stays inside the stage's */
    let dx = e.clientX - d.sx
    let dy = e.clientY - d.sy
    dx = Math.min(Math.max(dx, d.stage.left - d.rect.left), d.stage.right - d.rect.right)
    dy = Math.min(Math.max(dy, d.stage.top - d.rect.top), d.stage.bottom - d.rect.bottom)
    setLive({ x: Math.round(d.ox + dx / d.scale), y: Math.round(d.oy + dy / d.scale) })
  }
  const onUp = (e: RPointerEvent<HTMLButtonElement>) => {
    const d = drag.current
    if (!d || d.pid !== e.pointerId) return
    e.stopPropagation()
    drag.current = null
    if (live) scope.set(id, live)
    setLive(null)
  }

  const where = handle ?? (group ? 'tc' : 'tl')
  const pos: CSSProperties =
    where === 'tr' ? { top: -13, right: -13 } : where === 'bl' ? { bottom: -13, left: -13 } : where === 'tc' ? { top: -13, left: '50%', transform: 'translateX(-50%)' } : { top: -13, left: -13 }
  return (
    <div
      ref={ref}
      data-movable={id}
      className={className}
      style={{
        ...style,
        position: style?.position ?? 'relative',
        transform: moved || dragging ? `translate(${off.x}px, ${off.y}px)` : style?.transform,
        zIndex: dragging ? 60 : moved ? 30 : style?.zIndex,
        boxShadow: dragging ? '0 22px 40px -18px rgba(0,37,75,0.45)' : style?.boxShadow,
        borderRadius: dragging ? 14 : style?.borderRadius,
        transition: dragging ? 'none' : style?.transition,
      }}
    >
      {children}
      <button
        type="button"
        data-move-handle=""
        data-on={dragging || moved ? '' : undefined}
        aria-label={group ? 'Drag to move the code and its box together' : 'Drag to move this box'}
        title={group ? 'Move together' : 'Move'}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onKeyDown={(e) => e.key !== 'Enter' && e.key !== ' ' && e.currentTarget.blur()}
        className="absolute grid place-items-center rounded-full"
        style={{
          ...pos,
          width: group ? 'auto' : 26,
          height: 26,
          padding: group ? '0 9px 0 8px' : 0,
          gap: 5,
          gridAutoFlow: 'column',
          zIndex: 5,
          cursor: dragging ? 'grabbing' : 'grab',
          touchAction: 'none',
          userSelect: 'none',
          background: group ? colors.accent : colors.brandDark,
          color: colors.white,
          boxShadow: '0 4px 10px -4px rgba(0,37,75,0.5)',
        }}
      >
        <Grip />
        {group && <span className="whitespace-nowrap text-[11px] font-bold uppercase tracking-wider">Both</span>}
      </button>
    </div>
  )
}
