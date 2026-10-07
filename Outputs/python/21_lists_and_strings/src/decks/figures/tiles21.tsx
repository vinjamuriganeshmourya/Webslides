import { useEffect, useRef, useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useTween } from '@/ui'
import { useInstant } from '@/motion/instant'

/**
 * THE FIRST HALF'S ONE PICTURE (spec note 3): a string is a row of letter
 * tiles, and `split()` cuts it where the separator sits. The cut tile
 * vanishes; every piece drops into a list box, an empty piece too, drawn as
 * an empty box holding `''`. Used on C2 to C7, E1, T1, G1, the hook's last
 * press and the takeaways.
 *
 *   Tiles      the string, one tile per character. A space is a grey dot,
 *              `\n` and `\t` are ONE tile each (C3's must line). A knife can
 *              sit in its own lane above the row, never on a tile (rule 42).
 *   PieceRow   the list `split()` gives, one box per piece, in brackets. A new
 *              box drops in; an empty piece is a real box with `''`. Glue
 *              tiles (join's string) can drop into every gap between two
 *              boxes, never before the first or after the last (C6's must).
 *   usePhase   movement inside ONE press (the spec allows it: "movement inside
 *              one press is fine; a press that plays by itself is not"). It
 *              plays only when the press was reached by one step forward;
 *              arriving any other way (a jump, Replay, going back) shows the
 *              end state at once.
 *
 * Every colour is a token (content rule 37); every timing is the explanatory
 * tier (generate-slides 4b). Session-local.
 */

/* ------------------------------------------------------------------ phase */

/**
 * How far the movement of press `at` has got: 0 before it starts, `delays.length`
 * when it is over. `delays` are the waits before each phase, in ms.
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

/* ------------------------------------------------------------------ tiles */

/**
 *   plain   waiting
 *   sep     a separator, lit (C6's every a, the comma the knife is over)
 *   cut     cut away: it vanished, only a faint dashed outline keeps its place
 *   used    already in a box: the part of the string that has been cut off
 *   glue    joined back in by join(): brand tint
 *   lit     a character the card points at (T1's leading space)
 */
export type TileState = 'plain' | 'sep' | 'cut' | 'used' | 'glue' | 'lit'

const TS = {
  lg: { w: 46, h: 56, font: 28, gap: 6, lane: 34 },
  md: { w: 38, h: 46, font: 23, gap: 5, lane: 32 },
  sm: { w: 29, h: 38, font: 19, gap: 3, lane: 30 },
  xs: { w: 17, h: 24, font: 13, gap: 2, lane: 0 },
} as const
export type TileSize = keyof typeof TS

/** What a character looks like on a tile: a space is a grey dot, a new line and a tab their escape. */
export function tileGlyph(c: string) {
  if (c === ' ') return '·'
  if (c === '\n') return '\\n'
  if (c === '\t') return '\\t'
  return c
}

const HOUSE = 'cubic-bezier(0.22, 1, 0.36, 1)'

function tileLook(st: TileState, space: boolean) {
  switch (st) {
    case 'sep':
      return { bg: `${colors.accent}1F`, ring: colors.accent, ink: colors.accentDark, thick: true }
    case 'cut':
      return { bg: 'transparent', ring: colors.line, ink: 'transparent', dash: true, fade: 0.7 }
    case 'used':
      return { bg: colors.surface, ring: colors.line, ink: colors.muted, fade: 0.55 }
    case 'glue':
      return { bg: colors.surface2, ring: colors.brand, ink: colors.brandDark, thick: true }
    case 'lit':
      return { bg: `${colors.accent}1F`, ring: colors.accent, ink: colors.accentDark, thick: true }
    default:
      return { bg: colors.white, ring: colors.line, ink: space ? colors.muted : colors.ink }
  }
}

/** The knife: a blade pointing down at the tile it is about to cut. */
function Knife() {
  return (
    <svg width="22" height="28" viewBox="0 0 22 28" aria-hidden>
      <rect x="7" y="1" width="8" height="10" rx="2.5" fill={colors.brandDeep} />
      <path d="M5 12 H17 L11 27 Z" fill={colors.muted} stroke={colors.body} strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

export function Tiles({
  chars,
  states = {},
  size = 'md',
  knife = null,
  lane = true,
  drop = false,
  className = '',
}: {
  chars: string[]
  states?: Record<number, TileState>
  size?: TileSize
  /** The tile the knife is over; `chars.length` is just past the end. `null` hides it. */
  knife?: number | null
  /** Reserve the knife's lane even when no knife is shown, so the row never moves. */
  lane?: boolean
  /** The tiles drop in one by one, left to right, on mount (the hook's last press). */
  drop?: boolean
  className?: string
}) {
  const s = TS[size]
  const instant = useInstant()
  const tween = useTween(420)
  const laneH = lane ? s.lane : 0
  const xOf = (i: number) => i * (s.w + s.gap) + s.w / 2
  const [on, setOn] = useState(!drop || instant)
  useEffect(() => {
    if (!drop || instant) return
    const t = window.setTimeout(() => setOn(true), 30)
    return () => window.clearTimeout(t)
  }, [drop, instant])
  return (
    <div className={`relative ${className}`} style={{ paddingTop: laneH, width: chars.length * (s.w + s.gap) - s.gap }}>
      {knife !== null && lane && (
        <div aria-hidden className="absolute" style={{ left: xOf(Math.min(knife, chars.length)) - 11, top: 0, transition: instant ? 'none' : `left 520ms ${HOUSE}` }}>
          <Knife />
        </div>
      )}
      <div className="flex" style={{ gap: s.gap }}>
        {chars.map((c, i) => {
          const st = states[i] ?? 'plain'
          const L = tileLook(st, c === ' ')
          const esc = c === '\n' || c === '\t'
          return (
            <span
              key={i}
              className="grid shrink-0 place-items-center rounded-md font-mono font-semibold"
              style={{
                width: s.w,
                height: s.h,
                fontSize: esc ? s.font * 0.62 : s.font,
                background: L.bg,
                color: L.ink,
                border: `${L.thick ? 2.5 : 1.5}px ${L.dash ? 'dashed' : 'solid'} ${L.ring}`,
                opacity: on ? (L.fade ?? 1) : 0,
                transform: on ? 'none' : 'translateY(-10px)',
                transition: instant ? 'none' : `${tween}, opacity 420ms ${HOUSE} ${drop ? i * 40 : 0}ms, transform 420ms ${HOUSE} ${drop ? i * 40 : 0}ms`,
              }}
            >
              {tileGlyph(c)}
            </span>
          )
        })}
      </div>
    </div>
  )
}

/** Width a row of `n` tiles takes. */
export function tilesWidth(n: number, size: TileSize = 'md') {
  const s = TS[size]
  return n * (s.w + s.gap) - s.gap
}

/* ------------------------------------------------------------------ split */

/** The cut positions `split(sep)` makes in `str`, left to right (spec E1's `cut_at`). */
export function cutsOf(str: string, sep: string | null): number[][] {
  /* each cut is the run of positions it removes: one for a separator, a run for whitespace */
  const out: number[][] = []
  if (sep === null) {
    let i = 0
    while (i < str.length) {
      if (/\s/.test(str[i])) {
        const run: number[] = []
        while (i < str.length && /\s/.test(str[i])) run.push(i++)
        out.push(run)
      } else i++
    }
    return out
  }
  let from = 0
  for (;;) {
    const at = str.indexOf(sep, from)
    if (at < 0) break
    out.push(Array.from({ length: sep.length }, (_, k) => at + k))
    from = at + sep.length
  }
  return out
}

/** Tile states once a whole `split` has run: every cut tile gone, the rest in boxes. */
export function splitStates(str: string, sep: string | null): Record<number, TileState> {
  const st: Record<number, TileState> = {}
  const cut = new Set(cutsOf(str, sep).flat())
  for (let i = 0; i < str.length; i++) st[i] = cut.has(i) ? 'cut' : 'used'
  return st
}

/** Every position of `sep` in `str` lit (C6's every a). */
export function sepStates(str: string, sep: string): Record<number, TileState> {
  const st: Record<number, TileState> = {}
  cutsOf(str, sep)
    .flat()
    .forEach((i) => (st[i] = 'sep'))
  return st
}

/* -------------------------------------------------------------- piece row */

const PS = {
  md: { h: 50, font: 20, pad: 14, minW: 50, gap: 8, br: 30 },
  sm: { h: 42, font: 17, pad: 12, minW: 42, gap: 6, br: 26 },
  xs: { h: 26, font: 12.5, pad: 7, minW: 26, gap: 3, br: 16 },
} as const
export type PieceSize = keyof typeof PS

/** A piece as Python prints it in a list, with a space drawn as a grey dot. */
function PieceText({ text, litSpaces }: { text: string; litSpaces?: boolean }) {
  return (
    <>
      <span style={{ color: colors.muted }}>'</span>
      {[...text].map((c, i) =>
        c === ' ' ? (
          <span key={i} className="rounded-sm" style={{ color: litSpaces ? colors.accentDark : colors.muted, background: litSpaces ? `${colors.accent}33` : 'transparent' }}>
            ·
          </span>
        ) : (
          <span key={i}>{c}</span>
        ),
      )}
      <span style={{ color: colors.muted }}>'</span>
    </>
  )
}

/** One box that drops in from above the first time it mounts. */
function Drop({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const instant = useInstant()
  const [on, setOn] = useState(instant)
  useEffect(() => {
    if (instant) return
    const t = window.setTimeout(() => setOn(true), 20 + delay)
    return () => window.clearTimeout(t)
  }, [instant, delay])
  return (
    <span className="inline-flex shrink-0" style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(-16px)', transition: instant ? 'none' : `opacity 480ms ${HOUSE}, transform 520ms ${HOUSE}` }}>
      {children}
    </span>
  )
}

export function PieceRow({
  pieces,
  size = 'md',
  lit = [],
  litSpaces = false,
  bad = [],
  glue,
  glueOn = false,
  stagger = 0,
  brackets = true,
  plain = false,
  className = '',
}: {
  pieces: string[]
  size?: PieceSize
  /** boxes lit: the empty pieces at the end of a run */
  lit?: number[]
  /** the spaces inside a piece lit (T1's ' idli') */
  litSpaces?: boolean
  /** boxes that refuse: C7's item 0 */
  bad?: number[]
  /** join's string, dropped into each gap */
  glue?: string
  glueOn?: boolean
  /** ms between boxes, when several land in one press */
  stagger?: number
  brackets?: boolean
  /** items are not strings (C7's numbers): no quotes */
  plain?: boolean
  className?: string
}) {
  const s = PS[size]
  const tween = useTween(420)
  return (
    <div className={`flex items-center ${className}`} style={{ gap: s.gap, minHeight: s.h }}>
      {brackets && (
        <span className="font-mono font-semibold" style={{ fontSize: s.br, color: colors.muted }}>
          [
        </span>
      )}
      {pieces.map((p, i) => {
        const isLit = lit.includes(i)
        const isBad = bad.includes(i)
        return (
          <span key={i} className="inline-flex items-center" style={{ gap: s.gap }}>
            {glue !== undefined && i > 0 && glueOn && (
              <Drop delay={(i - 1) * 260}>
                <span
                  className="grid place-items-center rounded-md px-1.5 font-mono font-bold"
                  style={{ height: s.h - 8, minWidth: s.h - 14, fontSize: s.font, background: colors.surface2, color: colors.brandDark, boxShadow: `inset 0 0 0 2.5px ${colors.brand}` }}
                >
                  {glue.replace(/ /g, '·')}
                </span>
              </Drop>
            )}
            <Drop delay={i * stagger}>
              <span
                className={`grid place-items-center whitespace-pre rounded-lg font-mono font-semibold ${isBad ? 'sm-shake' : ''}`}
                style={{
                  height: s.h,
                  minWidth: s.minW,
                  padding: `0 ${s.pad}px`,
                  fontSize: s.font,
                  color: isBad ? colors.danger : colors.ink,
                  background: isBad ? `${colors.danger}14` : isLit ? `${colors.accent}1F` : colors.white,
                  boxShadow: `inset 0 0 0 ${isLit || isBad ? 3 : 2}px ${isBad ? colors.danger : isLit ? colors.accent : colors.brandDark}`,
                  transition: tween,
                }}
              >
                <span className="whitespace-pre">{plain ? p : <PieceText text={p} litSpaces={litSpaces} />}</span>
              </span>
            </Drop>
          </span>
        )
      })}
      {brackets && (
        <span className="font-mono font-semibold" style={{ fontSize: s.br, color: colors.muted }}>
          ]
        </span>
      )}
    </div>
  )
}

/* ------------------------------------------------------------- one-shot CSS */

const CSS = `
.sm-shake { animation: sm-shake 620ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both; }
@keyframes sm-shake {
  10%, 90% { transform: translate3d(-2px, 0, 0); }
  20%, 80% { transform: translate3d(4px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
  40%, 60% { transform: translate3d(6px, 0, 0); }
}
`
if (typeof document !== 'undefined' && !document.querySelector('style[data-sm-shake]')) {
  const el = document.createElement('style')
  el.dataset.smShake = ''
  el.textContent = CSS
  document.head.appendChild(el)
}
