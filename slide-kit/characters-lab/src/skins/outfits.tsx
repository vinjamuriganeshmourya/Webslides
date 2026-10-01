/* Clothes and accessories. Static SVG fragments the renderer places inside
 * the groups that move; nothing here animates.
 *
 * Body space is the 400x600 viewBox: shoulders at y=262, torso 250..400,
 * hips at (200, 400), the legs from y=392 to the shoes at 575, ground 580.
 * Tops are drawn at the male shoulder width (half 68, cloth to +-72 so the
 * upper arm sits on fabric) and fitToShoulders squeezes them to the body.
 * Head-local pieces (glasses, beard, flower) have their origin at the skull
 * centre, chin at y=66.
 *
 * Every piece is a small component so it can call useId: two actors on one
 * page with the same gradient id would share one paint. The lamp is upper
 * left, the same lamp as the rest of the rig: a light-to-shade gradient on
 * each large form, an occlusion ramp where the form turns under, and a rim
 * light down the lit edge, as on Riya's kurta in the for-loop deck. */
import { useId, type ReactNode } from 'react'
import type { Palette } from './types'
import type { BottomStyle, CharacterConfig, TopStyle } from './config'

/* ---------- shared light ---------- */

function useIds() {
  const u = useId().replace(/:/g, '')
  return (n: string) => `${n}-${u}`
}

/** Light upper left to shade lower right. */
function Lit({ id, light, mid, shade }: { id: string; light: string; mid: string; shade: string }) {
  return (
    <linearGradient id={id} x1="0.15" y1="0" x2="0.85" y2="1">
      <stop offset="0%" stopColor={light} />
      <stop offset="45%" stopColor={mid} />
      <stop offset="100%" stopColor={shade} />
    </linearGradient>
  )
}

/** Darkens the edges of a form where it turns away from the lamp. Laid over
    the gradient; it is what stops cloth reading as a flat sticker. */
function Occlusion({ id, strength = 0.34 }: { id: string; strength?: number }) {
  return (
    <radialGradient id={id} cx="0.5" cy="0.25" r="0.85">
      <stop offset="55%" stopColor="#141A2A" stopOpacity="0" />
      <stop offset="100%" stopColor="#141A2A" stopOpacity={strength} />
    </radialGradient>
  )
}

function Rim({ d, color, width = 3 }: { d: string; color: string; width?: number }) {
  return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" opacity="0.7" />
}

/* ---------- tops ---------- */

/* One torso silhouette for every top, in a translate(200 0) frame: the
   shoulder slopes from the neck (y 256) to the tip (y 272 at x 72), the
   chest is widest near y 300, the waist narrows at y 346, then the cloth
   drops to the hem. Tops differ in where the hem is, how much it flares,
   and what sits on the cloth. */
function torso({ hem, hemHalf = 60, waist = 54, neck = 'C-8 258 8 258 22 256' }: { hem: number; hemHalf?: number; waist?: number; neck?: string }) {
  return [
    `M-22 256 C-42 257 -64 261 -72 272`,
    `C-68 300 -58 322 -${waist} 346`,
    `C-${waist} 372 -${waist + 2} ${hem - 12} -${hemHalf} ${hem}`,
    `L${hemHalf} ${hem}`,
    `C${waist + 2} ${hem - 12} ${waist} 372 ${waist} 346`,
    `C58 322 68 300 72 272`,
    `C64 261 42 257 22 256`,
    neck,
    'Z',
  ].join(' ')
}

/* the lit edge of the torso, left side */
const TORSO_RIM = 'M-66 276 C-64 300 -58 322 -55 348'

function Cloth({ d, p, g, occlusion = 0.34 }: { d: string; p: Palette; g: (n: string) => string; occlusion?: number }) {
  return (
    <>
      <defs>
        <Lit id={g('cloth')} light={p.topLight} mid={p.top} shade={p.topShade} />
        <Occlusion id={g('occ')} strength={occlusion} />
      </defs>
      <path d={d} fill={`url(#${g('cloth')})`} />
      <path d={d} fill={`url(#${g('occ')})`} />
    </>
  )
}

function Button({ y, p }: { y: number; p: Palette }) {
  return <circle cx="0" cy={y} r="2.6" fill={p.topLight} stroke={p.topShade} strokeWidth="0.8" />
}

function Shirt({ p }: { p: Palette }) {
  const g = useIds()
  const d = torso({ hem: 402 })
  return (
    <g transform="translate(200 0)">
      <Cloth d={d} p={p} g={g} />
      {/* placket: a strip a shade lighter with the buttons down its centre */}
      <path d="M-7 262 L-7 402 L7 402 L7 262 Z" fill={p.topLight} opacity="0.18" />
      <path d="M-7 262 L-7 402" stroke={p.topShade} strokeWidth="1.2" opacity="0.5" />
      {[290, 318, 346, 374].map((y) => (
        <Button key={y} y={y} p={p} />
      ))}
      {/* chest pocket, stitched not filled */}
      <path d="M-46 298 L-20 298 L-20 326 L-46 326 Z" fill="none" stroke={p.topShade} strokeWidth="1.2" opacity="0.5" />
      {/* a fold where the cloth gathers into the belt */}
      <path d="M-30 380 Q-26 392 -24 402" fill="none" stroke={p.topShade} strokeWidth="1.2" opacity="0.35" />
      <Rim d={TORSO_RIM} color={p.topLight} />
    </g>
  )
}

function Polo({ p }: { p: Palette }) {
  const g = useIds()
  const d = torso({ hem: 404, waist: 56 })
  return (
    <g transform="translate(200 0)">
      <Cloth d={d} p={p} g={g} />
      {/* a short placket, two buttons, the top one open */}
      <path d="M-6 262 L-6 304 L6 304 L6 262 Z" fill={p.topShade} opacity="0.25" />
      <Button y={284} p={p} />
      <Button y={298} p={p} />
      <Rim d={TORSO_RIM} color={p.topLight} />
    </g>
  )
}

function TShirt({ p }: { p: Palette }) {
  const g = useIds()
  const d = torso({ hem: 406, waist: 58, hemHalf: 62 })
  return (
    <g transform="translate(200 0)">
      <Cloth d={d} p={p} g={g} />
      {/* ribbed crew neck, a band in the shade colour */}
      <path d="M-24 256 C-14 266 14 266 24 256" fill="none" stroke={p.topShade} strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      <path d="M-24 256 C-14 266 14 266 24 256" fill="none" stroke={p.topLight} strokeWidth="1.2" opacity="0.5" />
      {/* the cloth hangs loose: a soft fold from the chest to the hem */}
      <path d="M-40 330 Q-36 370 -38 404" fill="none" stroke={p.topShade} strokeWidth="1.4" opacity="0.3" />
      <path d="M30 350 Q34 380 32 404" fill="none" stroke={p.topShade} strokeWidth="1.2" opacity="0.25" />
      <Rim d={TORSO_RIM} color={p.topLight} />
    </g>
  )
}

/* Riya's kurta from the for-loop deck: the V, the placket down the front,
   a long hem over the hips. The straight hem with a side slit is what says
   kurta rather than tunic. */
function Kurta({ p }: { p: Palette }) {
  const g = useIds()
  const d = torso({ hem: 452, hemHalf: 66, waist: 56, neck: 'L16 258 L0 294 L-16 258' })
  return (
    <g transform="translate(200 0)">
      <Cloth d={d} p={p} g={g} occlusion={0.4} />
      {/* the inner facing of the V, pale */}
      <path d="M-15 259 L0 292 L15 259 Z" fill={p.topLight} opacity="0.9" />
      <path d="M-15 259 L0 292 L15 259" fill="none" stroke={p.topShade} strokeWidth="1.2" opacity="0.45" />
      {/* placket from the V to the hem, and a side slit */}
      <path d="M0 292 L0 452" stroke={p.topShade} strokeWidth="2" opacity="0.45" />
      <path d="M-62 424 L-63 452" stroke={p.topShade} strokeWidth="2" opacity="0.5" />
      <path d="M62 424 L63 452" stroke={p.topShade} strokeWidth="2" opacity="0.5" />
      {/* a hem band, slightly lighter, as on the reference */}
      <path d="M-66 446 L66 446" stroke={p.topLight} strokeWidth="1.4" opacity="0.35" />
      <Rim d="M-66 278 C-62 300 -57 330 -56 352 C-56 390 -60 420 -62 448" color={p.topLight} />
    </g>
  )
}

function Hoodie({ p }: { p: Palette }) {
  const g = useIds()
  const d = torso({ hem: 410, waist: 60, hemHalf: 62 })
  return (
    <g transform="translate(200 0)">
      {/* the hood hangs behind the neck; the head and neck draw over it */}
      <path d="M-40 268 C-42 244 -22 232 0 232 C22 232 42 244 40 268 Z" fill={p.topShade} />
      <path d="M-34 266 C-34 250 -18 242 0 242 C18 242 34 250 34 266 Z" fill={p.top} opacity="0.6" />
      <Cloth d={d} p={p} g={g} occlusion={0.38} />
      {/* the hood's opening at the neckline, and two drawstrings */}
      <path d="M-26 256 C-18 272 18 272 26 256" fill="none" stroke={p.topShade} strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      <path d="M-9 270 C-11 290 -12 302 -10 316" fill="none" stroke={p.topLight} strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      <path d="M9 270 C11 288 12 300 11 310" fill="none" stroke={p.topLight} strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      <circle cx="-10" cy="318" r="2" fill={p.topShade} />
      <circle cx="11" cy="312" r="2" fill={p.topShade} />
      {/* kangaroo pocket: a slanted opening each side, the pocket a shade deeper */}
      <path d="M-44 352 L44 352 L46 400 L-46 400 Z" fill={p.topShade} opacity="0.22" />
      <path d="M-44 352 L-36 392" stroke={p.topShade} strokeWidth="2" opacity="0.6" strokeLinecap="round" />
      <path d="M44 352 L36 392" stroke={p.topShade} strokeWidth="2" opacity="0.6" strokeLinecap="round" />
      {/* ribbed hem */}
      <path d="M-62 400 L62 400 L62 410 L-62 410 Z" fill={p.topShade} opacity="0.3" />
      {[-48, -32, -16, 0, 16, 32, 48].map((x) => (
        <path key={x} d={`M${x} 401 L${x} 409`} stroke={p.topLight} strokeWidth="1" opacity="0.25" />
      ))}
      <Rim d={TORSO_RIM} color={p.topLight} />
    </g>
  )
}

function Blouse({ p }: { p: Palette }) {
  const g = useIds()
  /* fitted: a narrower waist, a scoop neckline that shows the collarbone */
  const d = torso({ hem: 400, waist: 48, hemHalf: 58, neck: 'C14 268 6 280 0 282 C-6 280 -14 268 -22 256' })
  return (
    <g transform="translate(200 0)">
      <Cloth d={d} p={p} g={g} occlusion={0.3} />
      <path d="M-22 256 C-14 268 -6 280 0 282 C6 280 14 268 22 256" fill="none" stroke={p.topShade} strokeWidth="1.6" opacity="0.5" />
      {/* darts at the waist, so the cloth reads as cut to the body */}
      <path d="M-26 326 Q-24 348 -26 372" fill="none" stroke={p.topShade} strokeWidth="1.2" opacity="0.35" />
      <path d="M26 326 Q24 348 26 372" fill="none" stroke={p.topShade} strokeWidth="1.2" opacity="0.35" />
      <Rim d="M-66 276 C-62 300 -52 322 -49 348" color={p.topLight} />
    </g>
  )
}

export function top(style: TopStyle, p: Palette): ReactNode {
  switch (style) {
    case 'shirt':
      return <Shirt p={p} />
    case 'polo':
      return <Polo p={p} />
    case 'tshirt':
      return <TShirt p={p} />
    case 'kurta':
      return <Kurta p={p} />
    case 'hoodie':
      return <Hoodie p={p} />
    case 'blouse':
      return <Blouse p={p} />
  }
}

/** Tops are drawn for male shoulders (half 68); squeeze about the spine for
    anyone narrower. Only x scales, so hems and necklines stay where they are. */
export function fitToShoulders(node: ReactNode, shoulderHalf: number): ReactNode {
  const sx = shoulderHalf / 68
  if (Math.abs(sx - 1) < 0.001) return node
  return <g transform={`translate(200 0) scale(${sx.toFixed(3)} 1) translate(-200 0)`}>{node}</g>
}

/* ---------- legs ---------- */

/* Leg outlines take a side sign so the left and right legs are the same
   shape and each gets its own gradient, lit on its own left: both legs face
   the same lamp, so a mirrored copy would be lit from the wrong side. */
type Side = 1 | -1

const SHOE_Y = 562

/* a full-length trouser leg: flat waist at 392, the outer edge down to the
   ankle, the inner edge back up to the crotch */
function trouserLeg(s: Side, ankle = 29) {
  return `M0 392 L${s * 34} 392 C${s * 37} 450 ${s * 31} 510 ${s * ankle} ${SHOE_Y + 2} L${s * 7} ${SHOE_Y + 2} C${s * 6} 520 ${s * 3} 470 0 418 Z`
}

/* bare lower leg, from under a skirt or shorts to the shoe */
function bareLeg(s: Side, from: number) {
  return `M${s * 31} ${from} C${s * 30} 500 ${s * 27} 530 ${s * 26} ${SHOE_Y + 2} L${s * 8} ${SHOE_Y + 2} C${s * 8} 530 ${s * 7} 500 ${s * 9} ${from} Z`
}

function Shoe({ s, p }: { s: Side; p: Palette }) {
  /* toe points outward a little; sole a darker line so the shoe sits on the
     ground instead of floating on it */
  return (
    <g>
      <path d={`M${s * 5} ${SHOE_Y} L${s * 30} ${SHOE_Y} C${s * 40} ${SHOE_Y + 1} ${s * 44} ${SHOE_Y + 10} ${s * 40} ${SHOE_Y + 15} L${s * 5} ${SHOE_Y + 15} Z`} fill={p.shoe} />
      <path d={`M${s * 7} ${SHOE_Y + 2} L${s * 30} ${SHOE_Y + 2}`} stroke="#FFFFFF" strokeWidth="1.2" opacity="0.18" strokeLinecap="round" />
      <path d={`M${s * 5} ${SHOE_Y + 15} L${s * 40} ${SHOE_Y + 15}`} stroke="#000000" strokeWidth="1.5" opacity="0.35" />
    </g>
  )
}

function LegDefs({ g, p }: { g: (n: string) => string; p: Palette }) {
  return (
    <defs>
      <Lit id={g('cloth')} light={lighten(p.bottom, 0.08)} mid={p.bottom} shade={p.bottomShade} />
      <Lit id={g('skin')} light={p.skinLight} mid={p.skin} shade={p.skinShade} />
      <Occlusion id={g('occ')} strength={0.3} />
    </defs>
  )
}

/* a cheap lighten for the cloth highlight; the palette carries no bottomLight */
function lighten(hex: string, by: number) {
  const n = parseInt(hex.slice(1), 16)
  const ch = (v: number) => Math.round(Math.min(255, v + 255 * by)).toString(16).padStart(2, '0')
  return `#${ch((n >> 16) & 255)}${ch((n >> 8) & 255)}${ch(n & 255)}`
}

function Trousers({ p, jeans = false }: { p: Palette; jeans?: boolean }) {
  const g = useIds()
  const sides: Side[] = [-1, 1]
  return (
    <g transform="translate(200 0)">
      <LegDefs g={g} p={p} />
      {sides.map((s) => (
        <g key={s}>
          <Shoe s={s} p={p} />
          <path d={trouserLeg(s)} fill={`url(#${g('cloth')})`} />
          <path d={trouserLeg(s)} fill={`url(#${g('occ')})`} />
          {jeans ? (
            <>
              {/* the outer seam, a pale double stitch, and a cuff at the hem */}
              <path d={`M${s * 33} 404 C${s * 36} 450 ${s * 30} 510 ${s * 28} 556`} fill="none" stroke="#E8D9A8" strokeWidth="1.4" opacity="0.55" />
              <path d={`M${s * 30} 402 C${s * 26} 408 ${s * 18} 414 ${s * 10} 416`} fill="none" stroke="#E8D9A8" strokeWidth="1.2" opacity="0.5" />
              <path d={`M${s * 29} 552 L${s * 7} 552`} stroke={p.bottomShade} strokeWidth="1.5" opacity="0.6" />
            </>
          ) : (
            /* a pressed crease down the front of each leg */
            <path d={`M${s * 20} 410 C${s * 21} 460 ${s * 18} 520 ${s * 18} 558`} fill="none" stroke={p.bottomShade} strokeWidth="1.3" opacity="0.5" />
          )}
        </g>
      ))}
      {/* waistband across the pelvis, and a belt line on trousers */}
      <path d="M-34 392 L34 392 L34 400 L-34 400 Z" fill={p.bottomShade} opacity="0.55" />
      {jeans && <path d="M0 396 L0 420" stroke={p.bottomShade} strokeWidth="1.5" opacity="0.5" />}
    </g>
  )
}

function Shorts({ p }: { p: Palette }) {
  const g = useIds()
  const sides: Side[] = [-1, 1]
  const leg = (s: Side) => `M0 392 L${s * 34} 392 C${s * 37} 420 ${s * 36} 442 ${s * 35} 464 L${s * 6} 464 C${s * 5} 442 ${s * 3} 430 0 418 Z`
  return (
    <g transform="translate(200 0)">
      <LegDefs g={g} p={p} />
      {sides.map((s) => (
        <g key={s}>
          <Shoe s={s} p={p} />
          <path d={bareLeg(s, 456)} fill={`url(#${g('skin')})`} />
          {/* the knee, a touch of shade below the cap */}
          <ellipse cx={s * 19} cy="492" rx="7" ry="5" fill={p.skinShade} opacity="0.25" />
          <path d={leg(s)} fill={`url(#${g('cloth')})`} />
          <path d={leg(s)} fill={`url(#${g('occ')})`} />
          <path d={`M${s * 35} 458 L${s * 6} 458`} stroke={p.bottomShade} strokeWidth="1.5" opacity="0.5" />
        </g>
      ))}
      <path d="M-34 392 L34 392 L34 400 L-34 400 Z" fill={p.bottomShade} opacity="0.55" />
    </g>
  )
}

function Skirt({ p }: { p: Palette }) {
  const g = useIds()
  const sides: Side[] = [-1, 1]
  const d = 'M-36 392 L36 392 C40 430 54 470 64 500 C20 508 -20 508 -64 500 C-54 470 -40 430 -36 392 Z'
  return (
    <g transform="translate(200 0)">
      <LegDefs g={g} p={p} />
      {sides.map((s) => (
        <g key={s}>
          <Shoe s={s} p={p} />
          <path d={bareLeg(s, 488)} fill={`url(#${g('skin')})`} />
        </g>
      ))}
      {/* the skirt flares from the hip; three folds fan out with it */}
      <path d={d} fill={`url(#${g('cloth')})`} />
      <path d={d} fill={`url(#${g('occ')})`} />
      {[-22, 0, 22].map((x) => (
        <path key={x} d={`M${x} 400 Q${x * 1.4} 450 ${x * 2} 500`} fill="none" stroke={p.bottomShade} strokeWidth="1.3" opacity="0.35" />
      ))}
      <path d="M-36 392 L36 392 L36 400 L-36 400 Z" fill={p.bottomShade} opacity="0.5" />
      <Rim d="M-40 420 C-46 448 -54 476 -60 498" color={lighten(p.bottom, 0.14)} width={2.5} />
    </g>
  )
}

/* Riya's salwar: loose through the thigh, gathered into a cuff at the ankle */
function Salwar({ p }: { p: Palette }) {
  const g = useIds()
  const sides: Side[] = [-1, 1]
  const leg = (s: Side) =>
    `M0 392 L${s * 34} 392 C${s * 46} 440 ${s * 42} 500 ${s * 26} 548 L${s * 26} ${SHOE_Y + 2} L${s * 8} ${SHOE_Y + 2} L${s * 8} 548 C${s * 6} 500 ${s * 3} 450 0 418 Z`
  return (
    <g transform="translate(200 0)">
      <LegDefs g={g} p={p} />
      {sides.map((s) => (
        <g key={s}>
          <Shoe s={s} p={p} />
          <path d={leg(s)} fill={`url(#${g('cloth')})`} />
          <path d={leg(s)} fill={`url(#${g('occ')})`} />
          {/* the cuff, and the folds the gathering makes above it */}
          <path d={`M${s * 26} 548 L${s * 8} 548`} stroke={p.bottomShade} strokeWidth="2" opacity="0.6" />
          <path d={`M${s * 30} 470 Q${s * 24} 510 ${s * 20} 546`} fill="none" stroke={p.bottomShade} strokeWidth="1.3" opacity="0.4" />
          <path d={`M${s * 14} 500 Q${s * 13} 526 ${s * 12} 546`} fill="none" stroke={p.bottomShade} strokeWidth="1.1" opacity="0.3" />
        </g>
      ))}
    </g>
  )
}

export function legs(style: BottomStyle, p: Palette): ReactNode {
  switch (style) {
    case 'trousers':
      return <Trousers p={p} />
    case 'jeans':
      return <Trousers p={p} jeans />
    case 'shorts':
      return <Shorts p={p} />
    case 'skirt':
      return <Skirt p={p} />
    case 'salwar':
      return <Salwar p={p} />
  }
}

/* ---------- face extras, head-local ---------- */

const GOLD = '#D9A441'
const GOLD_SHADE = '#9C6F1E'

function Glasses({ kind, p }: { kind: 'round' | 'rect'; p: Palette }) {
  const g = useIds()
  const frame = p.hairShade
  /* lenses sit on the eyes at (+-24, -4); a faint glaze so they read as
     glass without hiding the eyes behind them */
  const lens = (x: number) =>
    kind === 'round' ? <circle cx={x} cy="-4" r="15.5" fill={`url(#${g('glass')})`} stroke={frame} strokeWidth="2" /> : <rect x={x - 17} y="-17" width="34" height="26" rx="5" fill={`url(#${g('glass')})`} stroke={frame} strokeWidth="2" />
  return (
    <g>
      <defs>
        <linearGradient id={g('glass')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
          <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      {lens(-24)}
      {lens(24)}
      {/* bridge, and the temples back to the ears */}
      <path d={kind === 'round' ? 'M-8.5 -6 Q0 -12 8.5 -6' : 'M-7 -8 Q0 -12 7 -8'} fill="none" stroke={frame} strokeWidth="2" />
      <path d={kind === 'round' ? 'M-39.5 -6 L-58 -2' : 'M-41 -8 L-58 -2'} stroke={frame} strokeWidth="2" strokeLinecap="round" />
      <path d={kind === 'round' ? 'M39.5 -6 L58 -2' : 'M41 -8 L58 -2'} stroke={frame} strokeWidth="2" strokeLinecap="round" />
    </g>
  )
}

/* Stubble is a tint over the lower face, strongest at the jaw and fading
   out before the cheekbone, as a day's growth really looks. */
function Stubble({ p }: { p: Palette }) {
  const g = useIds()
  return (
    <g>
      <defs>
        <linearGradient id={g('stub')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.hairShade} stopOpacity="0" />
          <stop offset="55%" stopColor={p.hairShade} stopOpacity="0.16" />
          <stop offset="100%" stopColor={p.hairShade} stopOpacity="0.24" />
        </linearGradient>
      </defs>
      <path d="M-56 10 C-50 40 -32 62 0 66 C32 62 50 40 56 10 C44 22 24 26 0 26 C-24 26 -44 22 -56 10 Z" fill={`url(#${g('stub')})`} />
      {/* clear a window for the mouth: lips show through stubble */}
      <ellipse cx="0" cy="40" rx="24" ry="10" fill={p.skin} opacity="0.12" />
    </g>
  )
}

/* A short beard: a shaped fill along the jaw with a moustache, the mouth
   left clear so an open mouth never fights it. */
function ShortBeard({ p }: { p: Palette }) {
  const g = useIds()
  return (
    <g>
      <defs>
        <Lit id={g('beard')} light={p.hairLight} mid={p.hair} shade={p.hairShade} />
      </defs>
      <path d="M-58 2 C-60 30 -40 62 0 72 C40 62 60 30 58 2 L46 10 C44 36 30 54 0 62 C-30 54 -44 36 -46 10 Z" fill={`url(#${g('beard')})`} />
      <path d="M-20 27 C-10 24 10 24 20 27 C12 33 -12 33 -20 27 Z" fill={`url(#${g('beard')})`} />
      {/* the edge softens into skin at the cheek */}
      <path d="M-46 10 C-44 36 -30 54 0 62 C30 54 44 36 46 10" fill="none" stroke={p.hairShade} strokeWidth="2" opacity="0.25" />
    </g>
  )
}

function Earrings() {
  /* small hoops on the lobes, the lobe being below the ear mark at (+-60, 2) */
  const hoop = (x: number) => (
    <g>
      <circle cx={x} cy="18" r="4" fill="none" stroke={GOLD} strokeWidth="2" />
      <circle cx={x} cy="25" r="2.4" fill={GOLD} stroke={GOLD_SHADE} strokeWidth="0.6" />
    </g>
  )
  return (
    <g>
      {hoop(-61)}
      {hoop(61)}
    </g>
  )
}

/* Riya's flower, tucked above the right ear over the fringe: five petals and
   a centre, so it reads as a flower at 120 px and not as a pink dot. */
function Flower() {
  const petals = [0, 72, 144, 216, 288]
  return (
    <g transform="translate(50 -44)">
      {petals.map((a) => (
        <ellipse key={a} cx="0" cy="-5.5" rx="4" ry="5.5" fill="#F25C8A" transform={`rotate(${a})`} />
      ))}
      {petals.map((a) => (
        <ellipse key={a} cx="-1" cy="-6" rx="1.6" ry="2.6" fill="#FFB3C9" opacity="0.7" transform={`rotate(${a - 12})`} />
      ))}
      <circle cx="0" cy="0" r="3" fill="#FFD36E" />
    </g>
  )
}

export function faceExtras(cfg: CharacterConfig, p: Palette): ReactNode | null {
  const a = cfg.accessories
  const parts: ReactNode[] = []
  if (a.beard === 'stubble') parts.push(<Stubble key="beard" p={p} />)
  if (a.beard === 'short') parts.push(<ShortBeard key="beard" p={p} />)
  if (a.glasses && a.glasses !== 'none') parts.push(<Glasses key="glasses" kind={a.glasses} p={p} />)
  /* between the brows, which sit at y -24 */
  if (a.bindi) parts.push(<circle key="bindi" cx="0" cy="-27" r="3.2" fill="#C0243A" />)
  if (a.earrings) parts.push(<Earrings key="earrings" />)
  if (a.flower) parts.push(<Flower key="flower" />)
  return parts.length ? <g>{parts}</g> : null
}

/* ---------- neck extras, body space ---------- */

function Collar({ p, short = false }: { p: Palette; short?: boolean }) {
  /* two wings from the neck base (200 +-22, 254); a polo's are softer and
     shorter than a shirt's points */
  const tip = short ? 276 : 284
  const wing = (s: Side) => `M${s * 22} 252 L${s * 36} ${tip} L${s * 3} ${tip - 14} L0 258 Z`
  return (
    <g transform="translate(200 0)">
      <path d="M-24 248 L24 248 L22 258 L-22 258 Z" fill={p.topShade} />
      <path d={wing(-1)} fill={p.topLight} stroke={p.topShade} strokeWidth="1" strokeLinejoin="round" />
      <path d={wing(1)} fill={p.top} stroke={p.topShade} strokeWidth="1" strokeLinejoin="round" />
    </g>
  )
}

function Necklace() {
  return (
    <g transform="translate(200 0)">
      <path d="M-26 262 C-18 288 18 288 26 262" fill="none" stroke={GOLD} strokeWidth="1.6" />
      <path d="M0 283 L-4 290 L0 297 L4 290 Z" fill={GOLD} stroke={GOLD_SHADE} strokeWidth="0.6" />
    </g>
  )
}

/* A dupatta over the left shoulder, across the chest to the right hip, with
   the tail falling behind the shoulder. A pale tint of the kurta, as it is
   usually worn, with a border and one fold so it hangs rather than sticks. */
function Dupatta({ p }: { p: Palette }) {
  const g = useIds()
  return (
    <g transform="translate(200 0)">
      <defs>
        <linearGradient id={g('dup')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor={p.topLight} />
        </linearGradient>
      </defs>
      <path d="M-62 300 C-66 282 -64 266 -56 258 L-34 262 C-30 296 -8 340 20 372 C32 386 44 396 50 404 L46 420 C20 404 -8 380 -26 350 C-40 328 -54 316 -62 300 Z" fill={`url(#${g('dup')})`} opacity="0.92" />
      <path d="M-34 262 C-30 296 -8 340 20 372 C32 386 44 396 50 404" fill="none" stroke={p.topShade} strokeWidth="1.4" opacity="0.4" />
      <path d="M-48 262 C-42 300 -16 346 12 382" fill="none" stroke={p.topShade} strokeWidth="1" opacity="0.25" />
    </g>
  )
}

export function neckExtras(cfg: CharacterConfig, p: Palette): ReactNode | null {
  const parts: ReactNode[] = []
  const t = cfg.outfit.top
  /* the dupatta goes under the collar and the necklace, so it is first */
  if (t === 'kurta' && cfg.gender === 'female') parts.push(<Dupatta key="dupatta" p={p} />)
  if (t === 'shirt') parts.push(<Collar key="collar" p={p} />)
  if (t === 'polo') parts.push(<Collar key="collar" p={p} short />)
  if (cfg.accessories.necklace) parts.push(<Necklace key="necklace" />)
  /* the watch is not here: it sits on the wrist and must move with the arm,
     so it belongs to the arm group in the renderer, not to a static layer */
  return parts.length ? <g>{parts}</g> : null
}
