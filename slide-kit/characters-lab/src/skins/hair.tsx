/* The hair catalogue. Every style is a few clusters of paths in head-local
 * space: skull centre at the origin, rx 60 ry 66, crown at y=-66, chin at
 * y=66, ears at (+-60, 2). Light comes from the upper left, as everywhere in
 * the rig, so each mass carries a gradient across it, a sheen stroke along
 * the lit crown and a shade pool where the hair turns away from the lamp.
 * Strand lines run the way the hair was combed. One flat blob reads as a
 * helmet at any size; the clusters and the strands are what make it read as
 * hair, at 120 px on a slide and at 1080 px in a reel.
 *
 * hairBack is drawn behind the skull, hairFront over the forehead. The
 * renderer wraps the front in a cast-shadow filter, so these just draw the
 * shapes. A braid or a ponytail hangs below the chin (y > 66) over the
 * viewer's right shoulder and still lives inside the head group, so it turns
 * with the head; long hair falls behind both shoulders as hairBack. */
import { useId, type ReactNode } from 'react'
import type { HairStyle } from '@/skins/config'
import type { Palette } from '@/skins/types'

export function hairBack(style: HairStyle, p: Palette): ReactNode | null {
  const draw = BACK[style]
  return draw ? <Lit p={p}>{draw}</Lit> : null
}

export function hairFront(style: HairStyle, p: Palette): ReactNode | null {
  const draw = FRONT[style]
  return draw ? <Lit p={p}>{draw}</Lit> : null
}

/* One gradient per piece, lit from the upper left. The id comes from useId
 * because two actors share a page and a duplicate id makes the second one
 * inherit the first one's paint. Every path in the piece fills with it; a
 * small lobe (a braid segment, a curl) gets its own full light-to-dark run,
 * which is exactly what makes it read as a separate volume. */
type Draw = (p: Palette, fill: string) => ReactNode

function Lit({ p, children }: { p: Palette; children: Draw }) {
  const id = 'hair' + useId().replace(/:/g, '')
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor={p.hairLight} />
          <stop offset="42%" stopColor={p.hair} />
          <stop offset="100%" stopColor={p.hairShade} />
        </linearGradient>
      </defs>
      {children(p, `url(#${id})`)}
    </>
  )
}

/* The three marks every style is built from. */
const sheen = (p: Palette, d: string, w = 4, o = 0.5) => (
  <path d={d} fill="none" stroke={p.hairLight} strokeWidth={w} strokeLinecap="round" opacity={o} />
)
const shade = (p: Palette, d: string, o = 0.45) => <path d={d} fill={p.hairShade} opacity={o} />
/* Strand lines, all in one path, so a style with twelve of them is one node. */
const strands = (p: Palette, ds: string[], w = 1.6, o = 0.4) => (
  <path d={ds.join(' ')} fill="none" stroke={p.hairShade} strokeWidth={w} strokeLinecap="round" opacity={o} />
)
/* Baby hairs at the temple, in the hair colour: the one thing that stops a
 * pulled-back style from reading as a painted cap. */
const wisps = (p: Palette, ds: string[]) => (
  <path d={ds.join(' ')} fill="none" stroke={p.hair} strokeWidth={1.4} strokeLinecap="round" opacity={0.75} />
)

/* The cap: the silhouette behind the skull that every short style shares,
 * about 10 px proud of the skull at the crown and the sides so a rim of hair
 * shows past the face. Only that rim is ever visible. */
const CAP = 'M-62 16 C-74 -22 -64 -66 -30 -82 C-12 -90 14 -90 32 -82 C66 -66 76 -22 62 16 Z'
const CAP_SHEEN = 'M-52 -40 C-44 -66 -20 -84 10 -86'
const CAP_SHADE = 'M34 -82 C66 -66 76 -22 62 16 L56 16 C66 -24 58 -58 30 -74 Z'

/* The shade that falls on the right of every front piece: the side of the
 * head turned away from the lamp. */
const RIGHT_SHADE = 'M30 -75 C58 -62 66 -26 58 12 L50 12 C56 -24 50 -52 26 -68 Z'

const BACK: Record<HairStyle, Draw | null> = {
  short: cap,
  sidePart: cap,
  quiff: (p, fill) => (
    <>
      {/* the cap rises at the front so the roll has something behind it */}
      <path d="M-62 16 C-74 -22 -64 -66 -30 -82 C-8 -96 22 -100 40 -86 C68 -66 76 -22 62 16 Z" fill={fill} />
      {sheen(p, CAP_SHEEN)}
      {shade(p, CAP_SHADE)}
    </>
  ),
  curly: curlyBack,
  buzz: null,
  braid: braidBack,
  ponytail: ponytailBack,
  bob: bobBack,
  long: longBack,
  bun: bunBack,
  wavy: wavyBack,
}

const FRONT: Record<HairStyle, Draw | null> = {
  short: shortFront,
  sidePart: sidePartFront,
  quiff: quiffFront,
  curly: curlyFront,
  buzz: buzzFront,
  braid: braidFront,
  ponytail: ponytailFront,
  bob: bobFront,
  long: longFront,
  bun: bunFront,
  wavy: wavyFront,
}

function cap(p: Palette, fill: string) {
  return (
    <>
      <path d={CAP} fill={fill} />
      {sheen(p, CAP_SHEEN)}
      {shade(p, CAP_SHADE)}
    </>
  )
}

/* ---- short styles, read as male by default ---------------------------- */

/* Short: the hairline sits 20 px above the brows and the mass is combed up
 * and back from it. The hairline's centre is off by 4 px on purpose. */
function shortFront(p: Palette, fill: string) {
  return (
    <>
      <path
        d="M-58 14 C-68 -22 -58 -62 -28 -76 C-10 -83 12 -83 30 -75 C60 -62 68 -22 58 14 L50 14 C50 -4 52 -22 46 -36 C40 -44 24 -48 4 -48 C-18 -48 -38 -44 -46 -34 C-52 -22 -50 -4 -50 14 Z"
        fill={fill}
      />
      {strands(p, [
        'M-30 -46 C-24 -56 -16 -64 -6 -68',
        'M-6 -50 C-2 -60 6 -68 18 -72',
        'M20 -46 C26 -56 36 -62 46 -62',
        'M-44 -30 C-42 -44 -36 -56 -26 -64',
        'M34 -40 C42 -50 50 -52 56 -48',
      ])}
      {sheen(p, 'M-40 -54 C-26 -70 0 -78 24 -72')}
      {shade(p, RIGHT_SHADE)}
    </>
  )
}

/* Side part: parted left of centre (from the viewer), the larger side swept
 * right across the forehead and dipping lowest at the right temple. */
function sidePartFront(p: Palette, fill: string) {
  return (
    <>
      <path
        d="M-58 14 C-68 -22 -58 -62 -28 -76 C-10 -83 12 -83 30 -75 C60 -62 68 -22 58 14 L50 14 C52 -6 50 -24 40 -32 C26 -40 2 -44 -16 -44 C-34 -42 -46 -36 -48 -24 C-50 -10 -50 2 -50 14 Z"
        fill={fill}
      />
      {/* the dark pocket just right of the part, where the sweep lifts off the scalp */}
      {shade(p, 'M-16 -44 C-8 -56 2 -64 14 -66 C4 -58 -6 -50 -10 -42 Z', 0.5)}
      {strands(p, [
        'M-10 -60 C6 -62 24 -56 36 -42',
        'M-8 -72 C14 -74 36 -66 48 -50',
        'M-4 -50 C10 -52 22 -46 30 -38',
        'M-24 -58 C-34 -54 -42 -46 -46 -36',
        'M-30 -70 C-40 -62 -46 -52 -50 -40',
      ])}
      {/* the parting itself */}
      {strands(p, ['M-16 -44 C-20 -56 -22 -66 -18 -76'], 2.2, 0.55)}
      {sheen(p, 'M-6 -70 C14 -74 36 -66 50 -52')}
      {shade(p, RIGHT_SHADE)}
    </>
  )
}

/* Quiff: the front is lifted into a roll that peaks 30 px above the crown
 * and falls back toward the right; the pocket under the roll is in shadow. */
function quiffFront(p: Palette, fill: string) {
  return (
    <>
      <path
        d="M-58 14 C-68 -22 -62 -62 -42 -80 C-30 -98 -4 -106 16 -98 C30 -92 38 -82 40 -74 C58 -60 66 -22 58 14 L50 14 C52 -6 50 -24 44 -36 C30 -46 6 -50 -14 -50 C-32 -48 -44 -40 -48 -28 C-50 -12 -50 2 -50 14 Z"
        fill={fill}
      />
      {shade(p, 'M-44 -62 C-34 -82 -16 -94 4 -96 C-12 -88 -28 -74 -36 -56 Z', 0.5)}
      {strands(p, [
        'M-36 -54 C-28 -70 -20 -84 -8 -94',
        'M-16 -56 C-10 -74 0 -88 14 -94',
        'M6 -56 C12 -70 22 -80 34 -82',
        'M24 -50 C34 -60 44 -64 52 -58',
        'M-46 -36 C-44 -52 -38 -66 -28 -78',
      ])}
      {sheen(p, 'M-32 -72 C-22 -92 -2 -100 18 -94', 4.5)}
      {shade(p, 'M38 -76 C58 -60 66 -26 58 12 L50 12 C56 -24 52 -54 34 -70 Z')}
    </>
  )
}

/* Curly: a cap with curls sitting on it, each curl its own lit volume with a
 * crescent of sheen on its upper left. The hairline is where the lowest row
 * of curls lands, not a drawn line. */
function curl(fill: string, p: Palette, cx: number, cy: number, r: number, key: string) {
  return (
    <g key={key}>
      <circle cx={cx} cy={cy} r={r} fill={fill} />
      <path
        d={`M${cx - r * 0.55} ${cy - r * 0.3} A${r * 0.6} ${r * 0.6} 0 0 1 ${cx + r * 0.05} ${cy - r * 0.62}`}
        fill="none"
        stroke={p.hairLight}
        strokeWidth={r * 0.22}
        strokeLinecap="round"
        opacity={0.5}
      />
      <path
        d={`M${cx + r * 0.2} ${cy + r * 0.75} A${r * 0.8} ${r * 0.8} 0 0 0 ${cx + r * 0.78} ${cy + r * 0.15}`}
        fill="none"
        stroke={p.hairShade}
        strokeWidth={r * 0.3}
        strokeLinecap="round"
        opacity={0.5}
      />
    </g>
  )
}

const CURLS_BACK: [number, number, number][] = [
  [-68, -2, 15], [-64, -32, 16], [-48, -60, 15], [-24, -80, 15], [4, -88, 16],
  [32, -80, 15], [54, -58, 15], [66, -30, 16], [68, 2, 15],
]
const CURLS_FRONT: [number, number, number][] = [
  [-50, -14, 10], [-42, -36, 11], [-24, -46, 11], [-2, -50, 11], [20, -47, 11], [38, -38, 10], [50, -22, 9],
  [-36, -66, 12], [-10, -76, 12], [16, -74, 12], [38, -62, 11],
]

function curlyBack(p: Palette, fill: string) {
  return (
    <>
      <path d="M-66 20 C-80 -20 -70 -70 -30 -86 C-10 -94 14 -94 34 -86 C76 -70 82 -20 66 20 Z" fill={fill} />
      {CURLS_BACK.map(([x, y, r], i) => curl(fill, p, x, y, r, `b${i}`))}
      {shade(p, 'M40 -80 C70 -62 80 -20 70 18 L58 16 C70 -22 62 -56 36 -74 Z', 0.35)}
    </>
  )
}

function curlyFront(p: Palette, fill: string) {
  return (
    <>
      <path
        d="M-56 12 C-66 -24 -56 -64 -26 -78 C-8 -86 12 -86 30 -78 C60 -64 66 -24 56 12 L50 12 C50 -6 50 -24 44 -38 C32 -50 8 -56 -4 -56 C-22 -56 -40 -50 -46 -36 C-50 -24 -50 -6 -50 12 Z"
        fill={fill}
      />
      {CURLS_FRONT.map(([x, y, r], i) => curl(fill, p, x, y, r, `f${i}`))}
      {shade(p, RIGHT_SHADE, 0.35)}
    </>
  )
}

/* Buzz: hair so short the scalp shows through, so the cap is translucent and
 * matte, the sheen is broad and faint, and dashed arcs give it the grain of
 * stubble at reel size. No back piece: nothing stands proud of the skull. */
function buzzFront(p: Palette, fill: string) {
  return (
    <>
      <path
        d="M-56 10 C-64 -24 -56 -58 -26 -70 C-8 -76 10 -76 26 -70 C58 -58 66 -24 56 10 L50 10 C50 -8 50 -24 44 -36 C32 -46 8 -50 -2 -50 C-20 -50 -36 -46 -44 -36 C-50 -24 -50 -8 -50 10 Z"
        fill={fill}
        opacity={0.86}
      />
      <path
        d="M-44 -24 C-36 -46 -12 -60 12 -60 M-34 -10 C-30 -38 -8 -54 20 -52 M-50 2 C-48 -28 -26 -50 4 -52 M-22 -62 C0 -70 26 -66 44 -48 M-14 -44 C4 -50 24 -44 36 -30 M-46 -40 C-34 -58 -10 -70 14 -70 M8 -42 C22 -44 36 -34 46 -18"
        fill="none"
        stroke={p.hairShade}
        strokeWidth={1.1}
        strokeDasharray="0.8 2.4"
        strokeLinecap="round"
        opacity={0.3}
      />
      {sheen(p, 'M-34 -52 C-20 -66 2 -72 22 -66', 6, 0.3)}
      {shade(p, 'M26 -70 C56 -58 64 -24 56 8 L50 8 C54 -24 48 -50 22 -64 Z', 0.4)}
    </>
  )
}

/* ---- long styles, read as female by default --------------------------- */

/* The volume behind the head that every long style starts from: a dome
 * proud of the crown that falls straight past the ears to just below the
 * chin, where the neck and shoulders hide it. Riya's reference drew this. */
const DOME = 'M-64 20 C-78 -24 -66 -72 -30 -86 C-10 -94 14 -94 34 -86 C72 -72 80 -24 66 20'
const DOME_SHEEN = 'M-54 -40 C-46 -66 -22 -84 8 -88'

/* Braid: Riya's. The hair gathers behind the right ear and the braid hangs
 * over the viewer's right shoulder, between the neck and the arm, down to
 * the chest. Each segment is two lobes, one from each side, so the plait
 * reads as interlocking strands and not a rope. */
function braidBack(p: Palette, fill: string) {
  const lobes: ReactNode[] = []
  for (let i = 0; i < 7; i++) {
    const y = 72 + i * 18
    const cx = 43 + i * 0.5
    const w = 23 - i * 1.2
    lobes.push(
      <g key={i}>
        <path d={`M${cx} ${y} C${cx - w * 0.8} ${y + 4} ${cx - w * 0.8} ${y + 18} ${cx} ${y + 22} C${cx - w * 0.15} ${y + 16} ${cx - w * 0.15} ${y + 6} ${cx} ${y} Z`} fill={fill} stroke={p.hairShade} strokeWidth={0.8} strokeOpacity={0.5} />
        <path d={`M${cx} ${y + 9} C${cx + w * 0.8} ${y + 13} ${cx + w * 0.8} ${y + 27} ${cx} ${y + 31} C${cx + w * 0.15} ${y + 25} ${cx + w * 0.15} ${y + 15} ${cx} ${y + 9} Z`} fill={fill} stroke={p.hairShade} strokeWidth={0.8} strokeOpacity={0.5} />
        <path d={`M${cx - w * 0.5} ${y + 7} Q${cx - w * 0.3} ${y + 2} ${cx - w * 0.1} ${y + 3}`} fill="none" stroke={p.hairLight} strokeWidth={2.4} strokeLinecap="round" opacity={0.5} />
        <path d={`M${cx + w * 0.15} ${y + 13} Q${cx + w * 0.35} ${y + 10} ${cx + w * 0.5} ${y + 14}`} fill="none" stroke={p.hairLight} strokeWidth={2} strokeLinecap="round" opacity={0.35} />
      </g>,
    )
  }
  return (
    <>
      <path d={`${DOME} C68 44 66 64 64 80 L-62 80 C-66 64 -66 44 -64 20 Z`} fill={fill} />
      {strands(p, ['M-66 -10 C-70 20 -68 50 -64 78', 'M66 -8 C70 20 68 50 64 78', 'M-58 -46 C-66 -20 -66 10 -62 40'])}
      {sheen(p, DOME_SHEEN)}
      {shade(p, 'M36 -84 C72 -70 80 -24 66 20 C68 44 66 64 64 80 L54 80 C58 50 60 20 54 -10 C50 -40 48 -62 30 -76 Z', 0.4)}
      {/* the gather: hair pulled from behind the ear toward the braid */}
      <path d="M26 38 C42 40 54 54 54 72 L34 78 C32 60 30 48 22 42 Z" fill={fill} />
      {strands(p, ['M32 42 C42 50 48 60 48 72', 'M40 44 C48 54 52 62 52 74'], 1.4, 0.45)}
      {/* the braid proper, over the shoulder; the first lobe laps the gather */}
      <path d="M31 70 C37 66 49 66 55 70 L55 78 C49 74 37 74 31 78 Z" fill={fill} />
      {lobes}
      {/* the tie and the tassel below it */}
      <ellipse cx="46.5" cy="201" rx="7.5" ry="3.6" fill={p.hairShade} />
      <path d="M40.5 203 C37.5 212 38.5 222 44.5 230 C46.5 222 48.5 216 46.5 208 C48.5 216 51.5 222 54.5 227 C55.5 218 53.5 210 51.5 203 Z" fill={fill} />
      {strands(p, ['M43.5 206 C42.5 214 43.5 220 45.5 226', 'M49.5 206 C50.5 214 51.5 218 53.5 224'], 1.2, 0.5)}
      {sheen(p, 'M41.5 199 Q44.5 197 48.5 198', 2.2, 0.55)}
    </>
  )
}

/* Riya's fringe from the reference, scaled to this skull: a curtain that
 * clears the brows by 25 px at the centre and falls to the ears at the
 * sides, with the sheen along its top where the lamp catches the curve. */
function braidFront(p: Palette, fill: string) {
  return (
    <>
      <path
        d="M-57 -8 C-60 -60 -30 -84 0 -84 C34 -84 64 -60 60 -5 C50 -36 30 -50 2 -50 C-26 -50 -46 -36 -57 -8 Z"
        fill={fill}
      />
      {strands(p, [
        'M-40 -36 C-30 -50 -14 -58 4 -60',
        'M24 -52 C36 -46 46 -36 52 -22',
        'M-10 -52 C-2 -57 12 -57 22 -55',
        'M-50 -22 C-44 -42 -30 -60 -8 -68',
      ])}
      {sheen(p, 'M-41 -49 C-24 -68 5 -74 30 -65', 4.5)}
      {shade(p, 'M34 -82 C58 -70 64 -40 60 -5 L52 -8 C54 -36 50 -60 28 -74 Z')}
    </>
  )
}

/* Ponytail: the tail leaves the back of the head on the right, swings out
 * past the jaw and falls over the shoulder, splitting into tips at the end.
 * It sits inside the arm's line so a hanging arm does not cover it. */
function ponytailBack(p: Palette, fill: string) {
  return (
    <>
      <path d={CAP} fill={fill} />
      {sheen(p, CAP_SHEEN)}
      {shade(p, CAP_SHADE)}
      <path
        d="M8 -2 C28 8 46 22 52 46 C60 90 58 140 54 190 L50 212 L44 196 L40 208 L36 192 C32 140 34 96 28 56 C24 32 18 14 6 2 Z"
        fill={fill}
      />
      {strands(p, [
        'M26 10 C40 36 46 80 44 150 C44 170 44 184 42 196',
        'M38 20 C52 50 54 110 48 180',
        'M18 14 C30 40 36 90 36 150',
      ])}
      {sheen(p, 'M24 2 C36 12 46 32 50 54', 3.5)}
      {shade(p, 'M28 56 C32 100 32 150 36 192 L42 194 C40 150 40 100 36 58 Z', 0.4)}
    </>
  )
}

/* Pulled back tight: every strand runs from the hairline toward the tie,
 * the sheen follows that pull, and baby hairs escape at the temples. */
function ponytailFront(p: Palette, fill: string) {
  return (
    <>
      <path
        d="M-56 10 C-66 -22 -58 -62 -28 -76 C-10 -83 12 -83 30 -75 C60 -62 66 -22 56 10 L50 10 C50 -8 50 -22 44 -34 C34 -44 10 -48 -4 -48 C-20 -48 -38 -44 -44 -34 C-50 -22 -50 -8 -50 10 Z"
        fill={fill}
      />
      {strands(p, [
        'M-40 -40 C-24 -60 0 -74 26 -78',
        'M-20 -46 C-6 -62 14 -72 34 -74',
        'M0 -48 C10 -60 24 -68 40 -70',
        'M20 -46 C30 -56 40 -62 50 -62',
        'M-46 -24 C-38 -48 -22 -66 -4 -76',
      ])}
      {sheen(p, 'M-30 -56 C-14 -72 10 -80 32 -76')}
      {wisps(p, ['M-50 -6 q-5 6 -3 13', 'M-46 -14 q-6 4 -6 10', 'M49 -4 q5 6 3 13'])}
      {shade(p, RIGHT_SHADE)}
    </>
  )
}

/* Bob: the mass behind is wider than the head and curls under at the jaw.
 * The front is a blunt fringe plus two curtains that cover the ears and
 * turn in at the chin; the right curtain lives in the shade. */
function bobBack(p: Palette, fill: string) {
  return (
    <>
      <path
        d="M-70 0 C-80 -30 -66 -72 -30 -86 C-10 -94 14 -94 34 -86 C72 -72 84 -30 72 0 C78 30 76 60 66 78 C54 86 36 84 22 80 L-20 80 C-36 84 -54 86 -66 78 C-76 60 -78 30 -70 0 Z"
        fill={fill}
      />
      {strands(p, ['M-72 10 C-76 36 -74 58 -64 76', 'M72 10 C76 36 74 58 64 76'])}
      {sheen(p, DOME_SHEEN)}
      {shade(p, 'M36 -84 C74 -70 84 -30 72 0 C78 30 76 60 66 78 L56 76 C66 56 68 30 62 0 C58 -30 52 -62 32 -76 Z', 0.4)}
    </>
  )
}

function bobFront(p: Palette, fill: string) {
  return (
    <>
      {/* fringe, blunt, 14 px above the brows */}
      <path
        d="M-52 -10 C-58 -40 -44 -70 -14 -78 C6 -84 30 -80 44 -70 C58 -58 60 -36 54 -12 L50 -14 C52 -30 46 -40 36 -42 C14 -46 -16 -46 -36 -40 C-46 -36 -50 -26 -48 -12 Z"
        fill={fill}
      />
      {strands(p, [
        'M-20 -62 C-20 -54 -20 -48 -22 -43',
        'M6 -64 C6 -56 5 -50 5 -43',
        'M26 -60 C26 -54 25 -48 24 -43',
        'M-34 -56 C-36 -50 -38 -46 -40 -41',
      ], 1.4, 0.35)}
      {sheen(p, 'M-30 -62 C-10 -74 14 -74 36 -64')}
      {/* curtains over the ears */}
      <path d="M-50 -16 C-62 -4 -72 24 -70 50 C-68 66 -60 78 -48 82 C-42 76 -40 68 -42 60 C-46 40 -46 20 -46 -10 Z" fill={fill} />
      <path d="M50 -18 C62 -6 72 22 70 48 C68 66 60 78 48 82 C42 76 40 68 42 60 C46 40 46 20 46 -12 Z" fill={fill} />
      {strands(p, ['M-58 0 C-64 24 -64 50 -56 74', 'M58 -2 C64 22 64 48 56 72'], 1.6, 0.35)}
      {sheen(p, 'M-60 10 C-64 30 -62 50 -56 68', 3)}
      {shade(p, 'M50 -18 C62 -6 72 22 70 48 C68 66 60 78 48 82 C50 70 54 56 56 44 C58 20 56 0 50 -18 Z', 0.4)}
      {shade(p, 'M44 -70 C58 -58 60 -36 54 -12 L50 -14 C52 -30 50 -50 40 -62 Z', 0.4)}
    </>
  )
}

/* Long: falls behind both shoulders to the chest, ending in tips. Grooves
 * run its whole length; the right side is in shade. */
function longBack(p: Palette, fill: string) {
  return (
    <>
      <path
        d="M-64 -10 C-76 -40 -64 -74 -30 -86 C-10 -94 14 -94 34 -86 C70 -74 80 -40 66 -10 C74 40 84 110 86 170 C86 190 82 204 76 212 L66 200 L60 214 L52 198 L44 210 C30 206 -30 206 -44 210 L-52 198 L-60 214 L-66 200 L-76 212 C-82 204 -86 190 -86 170 C-84 110 -76 40 -64 -10 Z"
        fill={fill}
      />
      {strands(p, [
        'M-70 -20 C-80 50 -82 130 -78 200',
        'M-56 10 C-64 70 -66 140 -62 204',
        'M70 -16 C80 50 82 130 78 200',
        'M58 8 C66 70 68 140 64 204',
      ], 1.8, 0.4)}
      {sheen(p, DOME_SHEEN)}
      {sheen(p, 'M-72 20 C-78 60 -78 100 -74 140', 3, 0.4)}
      {shade(p, 'M66 -10 C74 40 84 110 86 170 L78 174 C78 120 70 50 60 -4 Z', 0.4)}
    </>
  )
}

/* Centre parted, just off centre, so the right side carries a little more
 * hair. Each side sweeps from the parting down past the ear to the jaw. */
function longFront(p: Palette, fill: string) {
  return (
    <>
      <path d="M2 -84 C-30 -84 -58 -64 -62 -30 C-66 10 -66 44 -58 78 C-50 82 -44 78 -42 70 C-44 40 -46 10 -44 -20 C-40 -40 -24 -56 2 -62 Z" fill={fill} />
      <path d="M2 -84 C34 -84 62 -64 64 -30 C68 10 66 44 58 78 C50 82 44 78 42 70 C44 40 46 10 44 -20 C40 -40 26 -58 2 -62 Z" fill={fill} />
      {strands(p, [
        'M-40 -56 C-52 -40 -56 -10 -54 30',
        'M-24 -66 C-40 -50 -48 -20 -48 20',
        'M24 -66 C40 -52 48 -22 48 24',
        'M40 -58 C52 -40 56 -8 54 36',
      ])}
      {/* the parting, where the scalp shows */}
      {strands(p, ['M2 -84 C0 -76 0 -70 2 -62'], 2, 0.6)}
      {sheen(p, 'M-36 -70 C-22 -78 -8 -80 -2 -80', 3.5)}
      {sheen(p, 'M8 -80 C24 -78 40 -68 50 -52')}
      {shade(p, 'M44 -20 C46 20 44 50 42 70 L50 74 C54 44 54 10 52 -24 Z', 0.4)}
    </>
  )
}

/* Bun: a coil sitting high behind the crown, a tight cap in front with every
 * strand pulled toward it, and wisps escaping at the temples. */
function bunBack(p: Palette, fill: string) {
  return (
    <>
      <circle cx="8" cy="-86" r="22" fill={fill} />
      {/* the coil, as a spiral of darker line, and the lit edge on its upper left */}
      <path d="M8 -86 m-15 0 a15 15 0 1 1 30 0 a11 11 0 1 1 -22 0 a6 6 0 1 1 12 0" fill="none" stroke={p.hairShade} strokeWidth={1.8} strokeLinecap="round" opacity={0.5} />
      {sheen(p, 'M-6 -96 A18 18 0 0 1 10 -104', 3, 0.5)}
      {shade(p, 'M16 -106 A22 22 0 0 1 22 -70 A17 17 0 0 1 16 -106 Z', 0.4)}
      <path d="M-60 14 C-70 -22 -60 -62 -28 -76 C-10 -84 12 -84 30 -76 C62 -62 70 -22 60 14 Z" fill={fill} />
      {sheen(p, 'M-50 -40 C-42 -62 -20 -78 6 -80')}
      {shade(p, 'M32 -76 C62 -62 70 -22 60 14 L54 14 C62 -24 56 -54 28 -70 Z')}
    </>
  )
}

function bunFront(p: Palette, fill: string) {
  return (
    <>
      <path
        d="M-56 10 C-66 -22 -58 -62 -28 -76 C-10 -83 12 -83 30 -75 C60 -62 66 -22 56 10 L50 10 C50 -8 50 -22 44 -34 C34 -44 10 -48 -4 -48 C-20 -48 -38 -44 -44 -34 C-50 -22 -50 -8 -50 10 Z"
        fill={fill}
      />
      {strands(p, [
        'M-40 -40 C-30 -60 -12 -74 6 -80',
        'M-12 -48 C-6 -62 0 -72 10 -78',
        'M12 -48 C14 -62 16 -72 16 -78',
        'M30 -42 C30 -58 26 -70 20 -78',
        'M46 -30 C44 -50 38 -64 28 -74',
        'M-46 -26 C-44 -46 -36 -62 -22 -74',
      ])}
      {/* a side parting, left of centre */}
      {strands(p, ['M-14 -48 C-18 -58 -20 -68 -16 -78'], 2.2, 0.55)}
      {sheen(p, 'M-30 -58 C-16 -72 0 -78 14 -78')}
      {wisps(p, ['M-50 -6 q-5 6 -3 13', 'M-47 -16 q-7 4 -7 11', 'M49 -4 q5 6 3 13', 'M46 -18 q6 4 7 11'])}
      {shade(p, RIGHT_SHADE)}
    </>
  )
}

/* Wavy: the mass behind falls to the chest with an S-curve down each edge
 * and grooves that follow it; the front is a side-swept fringe and two
 * waved locks over the ears. */
function wavyBack(p: Palette, fill: string) {
  return (
    <>
      <path
        d="M-64 -10 C-76 -40 -64 -74 -30 -86 C-10 -94 14 -94 34 -86 C70 -74 80 -40 66 -10 C76 20 66 50 76 80 C86 110 70 140 78 170 C80 184 74 196 66 198 C62 190 56 192 52 186 C46 190 42 182 36 178 L-36 178 C-42 182 -46 190 -52 186 C-56 192 -62 190 -66 198 C-74 196 -80 184 -78 170 C-70 140 -86 110 -76 80 C-66 50 -76 20 -64 -10 Z"
        fill={fill}
      />
      {strands(p, [
        'M-68 0 C-80 30 -62 60 -74 90 C-86 120 -66 150 -74 176',
        'M-54 14 C-64 40 -50 68 -60 96 C-70 124 -54 150 -60 176',
        'M68 0 C80 30 62 60 74 90 C86 120 66 150 74 176',
        'M54 14 C64 40 50 68 60 96 C70 124 54 150 60 176',
      ], 1.8, 0.45)}
      {sheen(p, DOME_SHEEN)}
      {sheen(p, 'M-70 30 C-78 50 -62 70 -70 90', 3, 0.4)}
      {shade(p, 'M66 -10 C76 20 66 50 76 80 C86 110 70 140 78 170 L68 172 C64 140 76 110 66 82 C58 54 66 20 58 -6 Z', 0.4)}
    </>
  )
}

function wavyFront(p: Palette, fill: string) {
  return (
    <>
      {/* fringe, parted left and swept right, its lower edge a wave */}
      <path
        d="M-54 -14 C-62 -40 -50 -68 -22 -78 C2 -86 30 -82 44 -70 C60 -58 62 -36 54 -16 L48 -18 C50 -28 46 -34 38 -36 C26 -42 10 -36 0 -40 C-10 -44 -16 -46 -22 -44 C-32 -42 -40 -36 -44 -26 C-46 -20 -48 -16 -48 -12 Z"
        fill={fill}
      />
      {strands(p, [
        'M-18 -62 C0 -68 20 -62 34 -46',
        'M-14 -72 C8 -76 30 -70 44 -56',
        'M-30 -56 C-40 -50 -44 -40 -46 -30',
      ])}
      {strands(p, ['M-22 -44 C-26 -56 -28 -66 -24 -76'], 2.2, 0.55)}
      {sheen(p, 'M-12 -72 C8 -76 30 -68 44 -54')}
      {/* waved locks over the ears, each with its own crest phase */}
      <path d="M-50 -18 C-60 0 -70 20 -64 44 C-60 60 -70 72 -60 84 C-52 86 -44 78 -44 66 C-46 44 -42 20 -46 -4 Z" fill={fill} />
      <path d="M50 -20 C60 -4 70 14 62 36 C56 54 70 66 62 84 C54 88 46 80 44 68 C44 48 40 22 46 -6 Z" fill={fill} />
      {strands(p, ['M-56 -4 C-64 14 -62 36 -60 54 C-58 66 -62 76 -58 82', 'M56 -6 C64 10 60 30 58 50 C56 64 62 74 58 82'], 1.6, 0.35)}
      {sheen(p, 'M-60 4 C-66 20 -64 36 -62 50', 3)}
      {shade(p, 'M50 -20 C60 -4 70 14 62 36 C56 54 70 66 62 84 C58 72 54 60 54 46 C56 24 54 0 50 -20 Z', 0.4)}
      {shade(p, 'M44 -70 C60 -58 62 -36 54 -16 L48 -18 C52 -36 50 -52 40 -62 Z', 0.4)}
    </>
  )
}
