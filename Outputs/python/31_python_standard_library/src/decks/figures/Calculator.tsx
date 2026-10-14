import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { LiveClock } from './Phone'

/**
 * RAVI'S PHONE CALCULATOR (spec note 2, the world of the first half).
 *
 * Drawn to the detail that makes it read as the real app (course rule R5b):
 * the dark keypad, round keys, the grey function row, the operators and `=`
 * in the accent tone, the display at the top with its big right-aligned
 * digits, the status bar with the live clock. Held upright it has AC, the
 * numbers, + - x / and =. TURNED SIDEWAYS the twelve scientific keys appear
 * on the left and every basic key stays (its must line: "turning the phone
 * adds keys and takes none away").
 *
 * The phone turns on its press and never by itself (spec rule 1): the frame
 * rotates a quarter turn about its centre on the house curve (700ms, the
 * explanatory tier), and the two layouts cross-fade inside it as a real phone
 * re-lays its screen. An instant landing shows the end state.
 *
 * The app's own colours stay inside the phone (content rule 37): the keypad
 * near-black, the function row grey, the accent keys the template's accent.
 */
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
/* the handset: 180 x 371 is 1 : 2.06 (generate-slides 2b, item 13) */
export const CALC = { w: 180, h: 371, bezel: 8 } as const
const INNER_W = CALC.w - CALC.bezel * 2 /* 164 */
const INNER_H = CALC.h - CALC.bezel * 2 /* 355 */
/* the app's own colours, inside the phone only */
const KEY_DARK = '#333333'
const KEY_GREY = '#A5A5A5'
const SCREEN = '#000000'

export const SCI_KEYS = ['√', 'π', 'x!', 'sin', 'cos', 'tan', 'log', 'ln', 'e', 'x²', 'xʸ', '( )']
const BASIC: { k: string; kind: 'grey' | 'dark' | 'accent'; wide?: boolean }[][] = [
  [{ k: 'AC', kind: 'grey' }, { k: '±', kind: 'grey' }, { k: '%', kind: 'grey' }, { k: '÷', kind: 'accent' }],
  [{ k: '7', kind: 'dark' }, { k: '8', kind: 'dark' }, { k: '9', kind: 'dark' }, { k: '×', kind: 'accent' }],
  [{ k: '4', kind: 'dark' }, { k: '5', kind: 'dark' }, { k: '6', kind: 'dark' }, { k: '−', kind: 'accent' }],
  [{ k: '1', kind: 'dark' }, { k: '2', kind: 'dark' }, { k: '3', kind: 'dark' }, { k: '+', kind: 'accent' }],
  [{ k: '0', kind: 'dark', wide: true }, { k: '.', kind: 'dark' }, { k: '=', kind: 'accent' }],
]

function Key({ k, kind, size, font, wide = false, glow = false, round = true }: { k: string; kind: 'grey' | 'dark' | 'accent' | 'sci'; size: number; font: number; wide?: boolean; glow?: boolean; round?: boolean }) {
  const bg = kind === 'accent' ? colors.accent : kind === 'grey' ? KEY_GREY : kind === 'sci' ? '#1F1F1F' : KEY_DARK
  const ink = kind === 'grey' ? '#000000' : '#FFFFFF'
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center font-semibold"
      style={{
        width: wide ? size * 2 + 6 : size,
        height: size,
        borderRadius: round ? size / 2 : 6,
        background: bg,
        color: ink,
        fontSize: font,
        lineHeight: 1,
        boxShadow: glow ? `0 0 0 2px ${colors.warning}, 0 0 14px ${colors.warning}` : 'none',
        transition: `box-shadow 480ms ${EASE}`,
      }}
    >
      {k}
    </span>
  )
}

/** The display: one or two right-aligned lines. */
function Display({ lines, height, font, tight = false }: { lines: string[]; height: number; font: number; /** the sideways display: two lines at line-height 1, so both sit inside its 36px */ tight?: boolean }) {
  return (
    <div className="flex flex-col items-end justify-end px-3 pb-1" style={{ height }}>
      {lines.map((l, i) => (
        <span key={`${i}-${l}`} className={`sm-bump whitespace-nowrap font-mono font-medium text-white ${tight ? 'leading-none' : 'leading-tight'}`} style={{ fontSize: i === lines.length - 1 ? font : font * 0.68, opacity: i === lines.length - 1 ? 1 : 0.8 }}>
          {l}
        </span>
      ))}
    </div>
  )
}

function Status({ landscape }: { landscape: boolean }) {
  return (
    <div className="flex items-center justify-between px-3 text-[10px] font-semibold text-white" style={{ height: landscape ? 14 : 20, paddingLeft: landscape ? 14 : 12 }}>
      <span>
        <LiveClock />
      </span>
      <span className="flex items-center gap-[3px]">
        <svg width="11" height="8" viewBox="0 0 18 12" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={i * 4.5} y={9 - i * 3} width="3" height={3 + i * 3} rx="0.8" fill="#FFFFFF" />
          ))}
        </svg>
        <svg width="16" height="8" viewBox="0 0 26 12" aria-hidden>
          <rect x="0.8" y="0.8" width="21" height="10.4" rx="3" fill="none" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="1.4" />
          <rect x="2.6" y="2.6" width="15" height="6.8" rx="1.6" fill="#FFFFFF" />
        </svg>
      </span>
    </div>
  )
}

/** The upright layout: the display, then five rows of round keys. */
function Portrait({ display }: { display: string[] }) {
  const size = 34
  return (
    <div className="flex h-full w-full flex-col" style={{ background: SCREEN }}>
      <Status landscape={false} />
      <Display lines={display} height={118} font={44} />
      <div className="flex flex-col gap-[7px] px-[7px] pb-2">
        {BASIC.map((row, r) => (
          <div key={r} className="flex gap-[7px]">
            {row.map((k) => (
              <Key key={k.k} k={k.k} kind={k.kind} size={size} font={17} wide={k.wide} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * The sideways layout: the display across the top, then one grid of keys that
 * FILLS THE SCREEN (user, 2026-10-13: the keys were clustered in the centre
 * with empty space at the edges and under the scientific block). Seven equal
 * columns, three scientific on the left and the four basic ones on the right,
 * five rows of the same height in both blocks, one gap between the blocks and
 * equal margins at both edges, the way the real app lays its sideways keypad.
 * The spec's twelve scientific keys plus three the real app has (`x³`, `10ˣ`,
 * `1/x`) make the three columns by five rows; `0` is two cells wide.
 */
const SCI_15 = [...SCI_KEYS, 'x³', '10ˣ', '1/x']
const KEY_GAP = 4
const BLOCK_GAP = 8
const KEY_W = 44
const KEY_H = 18

function LKey({ k, kind, glow = false, wide = false }: { k: string; kind: 'grey' | 'dark' | 'accent' | 'sci'; glow?: boolean; wide?: boolean }) {
  const bg = kind === 'accent' ? colors.accent : kind === 'grey' ? KEY_GREY : kind === 'sci' ? '#1F1F1F' : KEY_DARK
  const ink = kind === 'grey' ? '#000000' : '#FFFFFF'
  return (
    <span
      className={`inline-flex h-full w-full items-center justify-center rounded-full font-semibold ${wide ? 'col-span-2' : ''}`}
      style={{ background: bg, color: ink, fontSize: kind === 'sci' ? 9.5 : 10.5, lineHeight: 1, boxShadow: glow ? `0 0 0 1.5px ${colors.warning}, 0 0 10px ${colors.warning}` : 'none', transition: `box-shadow 480ms ${EASE}` }}
    >
      {k}
    </span>
  )
}

function Landscape({ display, glow }: { display: string[]; glow: string[] }) {
  return (
    <div className="flex h-full w-full flex-col" style={{ background: SCREEN }}>
      <Status landscape />
      <Display lines={display} height={36} font={20} tight />
      {/* 7 columns of 44px: 3 + 4 with the block gap and the key gaps is 336 of the screen's 355, so 9.5px of margin each side; 5 rows of 18 with 4px gaps is 106, the height left under the display */}
      <div className="flex" style={{ gap: BLOCK_GAP, padding: `2px 9.5px 6px`, height: 114 }}>
        <div className="grid" style={{ width: 3 * KEY_W + 2 * KEY_GAP, gridTemplateColumns: `repeat(3, ${KEY_W}px)`, gridAutoRows: `${KEY_H}px`, gap: KEY_GAP }}>
          {SCI_15.map((k) => (
            <LKey key={k} k={k} kind="sci" glow={glow.includes(k)} />
          ))}
        </div>
        <div className="grid" style={{ width: 4 * KEY_W + 3 * KEY_GAP, gridTemplateColumns: `repeat(4, ${KEY_W}px)`, gridAutoRows: `${KEY_H}px`, gap: KEY_GAP }}>
          {BASIC.flat().map((k) => (
            <LKey key={k.k} k={k.k} kind={k.kind} wide={k.wide} />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * The phone on a square stage its own height wide, so it can turn in place.
 * `landscape` turns it; `display` is the display's lines; `glow` lights
 * scientific keys; `lit` rings the phone (the one that matches the code);
 * `zoom` scales the whole stage (CSS zoom, never a transform, so every
 * harness measures what the room sees).
 */
export function CalcPhone({
  landscape = false,
  display = ['0'],
  glow = [],
  lit = false,
  zoom = 1,
  stage = true,
}: {
  landscape?: boolean
  display?: string[]
  glow?: string[]
  lit?: boolean
  zoom?: number
  /** a square stage the phone turns on; off, the box is the phone's own orientation and nothing turns (the small calculators) */
  stage?: boolean
}) {
  const instant = useInstant()
  const turn = instant ? 'none' : `transform 700ms ${EASE}, box-shadow 480ms ${EASE}`
  const fade = instant ? 'none' : `opacity 420ms ${EASE}`
  /* the ring is drawn INSIDE the frame's edge (overlap-check rule 43 reads an outside ring with a transition as a glow wrapper around the screen) */
  const shadow = lit ? `inset 0 0 0 4px ${colors.brand}, 0 14px 30px -14px ${colors.brand}aa` : `inset 0 0 0 0 ${colors.brand}00, 0 14px 30px -18px rgba(16,32,58,0.5)`
  if (!stage) {
    const W = landscape ? CALC.h : CALC.w
    const H = landscape ? CALC.w : CALC.h
    return (
      <div className="relative shrink-0 rounded-[32px]" style={{ width: W, height: H, zoom, padding: CALC.bezel, background: '#15191F', boxShadow: shadow, transition: instant ? 'none' : `box-shadow 480ms ${EASE}` }}>
        <div className="relative h-full w-full overflow-hidden rounded-[25px]" style={{ background: SCREEN }}>
          {landscape ? <Landscape display={display} glow={glow} /> : <Portrait display={display} />}
        </div>
      </div>
    )
  }
  const W = CALC.h
  const H = CALC.h
  return (
    <div className="relative shrink-0" style={{ width: W, height: H, zoom }}>
      <div
        className="absolute rounded-[32px]"
        style={{
          left: (W - CALC.w) / 2,
          top: (H - CALC.h) / 2,
          width: CALC.w,
          height: CALC.h,
          padding: CALC.bezel,
          background: '#15191F',
          transform: landscape ? 'rotate(-90deg)' : 'none',
          transition: turn,
          boxShadow: shadow,
        }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[25px]" style={{ background: SCREEN }}>
          {/* the upright screen */}
          <div className="absolute inset-0" style={{ opacity: landscape ? 0 : 1, transition: fade, pointerEvents: 'none' }}>
            <Portrait display={display} />
          </div>
          {/* the sideways screen: laid out at 355 x 164 and turned back upright inside the turned frame */}
          <div
            className="absolute"
            style={{
              width: INNER_H,
              height: INNER_W,
              left: (INNER_W - INNER_H) / 2,
              top: (INNER_H - INNER_W) / 2,
              transform: 'rotate(90deg)',
              opacity: landscape ? 1 : 0,
              transition: fade,
              pointerEvents: 'none',
            }}
          >
            <Landscape display={display} glow={glow} />
          </div>
        </div>
      </div>
    </div>
  )
}

/** The two small calculators, upright and sideways, one of them lit. */
export function TwoCalcs({ lit, zoom = 0.44, display }: { lit: 'up' | 'side' | null; zoom?: number; display?: { up?: string[]; side?: string[] } }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <CalcPhone stage={false} lit={lit === 'up'} zoom={zoom} display={display?.up} />
      <CalcPhone stage={false} landscape lit={lit === 'side'} zoom={zoom} display={display?.side} />
    </div>
  )
}

/** Ravi's homework page: a lined notebook sheet with a red margin. */
export function Notebook({ lines, width = 212, height = 230, size = 13 }: { lines: ReactNode[]; width?: number; height?: number; size?: number }) {
  return (
    <div className="relative shrink-0 overflow-hidden rounded-md bg-white" style={{ width, height, boxShadow: `inset 0 0 0 1px ${colors.line}, 0 10px 24px -16px rgba(16,32,58,0.45)`, backgroundImage: `repeating-linear-gradient(180deg, transparent 0 25px, ${colors.line} 25px 26px)`, backgroundPosition: '0 14px' }}>
      <span aria-hidden className="absolute bottom-0 top-0" style={{ left: 26, width: 1.5, background: '#E8A0B4' }} />
      <div className="flex flex-col pl-[34px] pr-3 pt-[14px]" style={{ fontFamily: 'inherit' }}>
        {lines.map((l, i) => (
          <span key={i} className="block font-semibold" style={{ fontSize: size, height: 26, lineHeight: '26px', color: i === 0 ? colors.brandDark : colors.ink, whiteSpace: 'nowrap' }}>
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}
