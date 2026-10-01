/* A procedural hand: palm, four two-segment fingers and a thumb, drawn from
 * seven numbers so any two poses blend by lerping the numbers. There is no
 * drawing per pose; a fist and an open hand are the same code at different
 * curls.
 *
 * Local frame: wrist at (0,0), fingers extend toward +y, thumb on +x. The
 * renderer rotates and mirrors this group, so nothing here knows which arm
 * it is on or which way is up.
 *
 * The curl is modelled in three dimensions and projected, not faked in two.
 * A finger curls around its knuckle axis; `palm` says where that axis points.
 * Side-on (palm 0) the finger folds across the picture plane and we see the
 * whole arc. Facing the viewer (palm 1) it folds toward us, so it only
 * shortens, and past 90 deg the fingertip comes back down over the palm. One
 * formula covers both and everything in between, which is what keeps a
 * blend from "point" to "open" looking like a hand opening rather than two
 * drawings cross-fading. */
import { useId } from 'react'
import type { HandPose } from '@/actions/handPoses'
import type { Palette } from '@/skins/types'

type Pt = { x: number; y: number }

/* Knuckle positions and lengths, index to pinky. The middle knuckle sits
   highest, the pinky lowest and shortest: a flat row reads as a glove. */
const FINGERS = [
  { x: 9, y: 25, len: 18, r: 3.5 },
  { x: 3, y: 26, len: 20, r: 3.6 },
  { x: -3, y: 25, len: 18.5, r: 3.4 },
  { x: -9, y: 23, len: 15, r: 3.1 },
]
const PROXIMAL = 0.55 // share of the finger length before the middle joint
const CURL_PROXIMAL = 55 // deg at full curl
const CURL_DISTAL = 70 // deg further at full curl
const FAN = 14 // deg, outermost fingers at full spread
const THUMB = { baseY: 7, meta: 10, tip: 7.5, r: 3.6 }

const DEG = Math.PI / 180
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const pt = (p: Pt) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`

/** Rotate a +y-pointing frame by `deg` toward +x. */
function rotate(v: Pt, deg: number): Pt {
  const s = Math.sin(deg * DEG)
  const c = Math.cos(deg * DEG)
  return { x: v.x * c + v.y * s, y: -v.x * s + v.y * c }
}

/** One finger segment of length `len` curled by `phi` deg about an axis that
    `palm` swings from the view normal (0, in-plane curl) to +x (1, curl toward
    the viewer), projected onto the picture plane. */
function segment(len: number, phi: number, palm: number): Pt {
  const axis = palm * 90 * DEG
  return { x: len * Math.sin(phi * DEG) * Math.cos(axis), y: len * Math.cos(phi * DEG) }
}

type FingerGeom = { k: Pt; p: Pt; t: Pt; r: number; curl: number }

function fingerGeom(i: number, curl: number, spread: number, palm: number, widthScale: number): FingerGeom {
  const f = FINGERS[i]
  const fan = ((1.5 - i) / 1.5) * FAN * spread
  const v1 = rotate(segment(f.len * PROXIMAL, curl * CURL_PROXIMAL, palm), fan)
  const v2 = rotate(segment(f.len * (1 - PROXIMAL), curl * (CURL_PROXIMAL + CURL_DISTAL), palm), fan)
  const k = { x: f.x * widthScale, y: f.y }
  const p = { x: k.x + v1.x, y: k.y + v1.y }
  return { k, p, t: { x: p.x + v2.x, y: p.y + v2.y }, r: f.r, curl }
}

/* The thumb sweeps in an arc across the palm: out to the side, then up along
   the index, then lying over the curled fingers. Its last joint flexes as it
   goes, so a tucked thumb hooks rather than lies like a stick. It roots on
   the palm's edge, so its round end reads as the thenar bulge, not as a
   sausage dropped on the palm. */
function thumbGeom(tuck: number, wristHalf: number) {
  const base = { x: wristHalf + 0.5, y: THUMB.baseY }
  const a0 = 65 - 95 * tuck
  const a1 = a0 - (5 + 60 * tuck)
  const m = { x: base.x + THUMB.meta * Math.sin(a0 * DEG), y: base.y + THUMB.meta * Math.cos(a0 * DEG) }
  const t = { x: m.x + THUMB.tip * Math.sin(a1 * DEG), y: m.y + THUMB.tip * Math.cos(a1 * DEG) }
  return { base, m, t }
}

/** A capsule chain: a shade band under a skin stroke. The band only shows
    where it pokes out past the fill, so it becomes the 1.2 px line that keeps
    two neighbouring fingers from merging into one shape. */
function Capsule({ points, r, fill, shade }: { points: string; r: number; fill: string; shade: string }) {
  const common = { fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <>
      <polyline points={points} stroke={shade} strokeOpacity={0.5} strokeWidth={r * 2 + 2.4} {...common} />
      <polyline points={points} stroke={fill} strokeWidth={r * 2} {...common} />
    </>
  )
}

/** The crease a bent joint makes: a short dark line across the segment
    that ends at the joint. Fades in past 0.6 curl so a relaxed hand is smooth. */
function Crease({ at, along, r, strength, color }: { at: Pt; along: Pt; r: number; strength: number; color: string }) {
  if (strength <= 0) return null
  const len = Math.hypot(along.x, along.y) || 1
  const n = { x: (along.y / len) * r * 0.75, y: (-along.x / len) * r * 0.75 }
  return (
    <line
      x1={at.x - n.x}
      y1={at.y - n.y}
      x2={at.x + n.x}
      y2={at.y + n.y}
      stroke={color}
      strokeOpacity={0.45 * strength}
      strokeWidth={1.3}
      strokeLinecap="round"
    />
  )
}

export function Hand({ pose, palette }: { pose: HandPose; palette: Palette }) {
  const gid = useId().replace(/[^a-zA-Z0-9_-]/g, '') + '-hand'
  const fill = `url(#${gid})`
  const palm = clamp01(pose.palm)
  const spread = clamp01(pose.spread)
  const tuck = clamp01(pose.thumb)
  const curls = [pose.f1, pose.f2, pose.f3, pose.f4].map(clamp01)
  const avgCurl = (curls[0] + curls[1] + curls[2] + curls[3]) / 4

  /* Side-on the hand is an edge, so the fingers stack closer and the palm
     narrows. Curled fingers thicken the palm: a fist is a block, not a plate. */
  const widthScale = (0.82 + 0.18 * palm) * (1 + 0.08 * avgCurl)
  const knuckleHalf = 12.5 * widthScale + 2.5 * avgCurl
  const wristHalf = 10 * (0.85 + 0.15 * palm) + 1.5 * avgCurl
  const fistShade = clamp01((avgCurl - 0.6) / 0.4)

  const fingers = curls.map((c, i) => fingerGeom(i, c, spread, palm, widthScale))
  const thumb = thumbGeom(tuck, wristHalf)
  const thumbOver = tuck > 0.5

  const palmPath = [
    `M ${-wristHalf},-3`,
    `C ${-wristHalf - 2},8 ${-knuckleHalf - 1.5},16 ${-knuckleHalf},24`,
    `C ${-knuckleHalf * 0.6},28.5 ${knuckleHalf * 0.6},28.5 ${knuckleHalf},25`,
    `C ${knuckleHalf + 1},16 ${wristHalf + 4},9 ${wristHalf},-3`,
    'Z',
  ].join(' ')
  /* Where the thumb's root meets the palm. Only the thumb-side edge gets a
     line: an outline all the way round would turn the palm into a sticker. */
  const thenarEdge = `M ${wristHalf},-1 C ${wristHalf + 3.2},7 ${knuckleHalf + 1.2},13 ${knuckleHalf + 0.4},18`

  const thumbNode = (
    <>
      <Capsule points={`${pt(thumb.base)} ${pt(thumb.m)} ${pt(thumb.t)}`} r={THUMB.r} fill={fill} shade={palette.skinShade} />
      <Crease
        at={thumb.m}
        along={{ x: thumb.m.x - thumb.base.x, y: thumb.m.y - thumb.base.y }}
        r={THUMB.r}
        strength={clamp01((tuck - 0.5) / 0.5)}
        color={palette.skinShade}
      />
    </>
  )

  return (
    <g>
      <defs>
        {/* One lamp, upper left, shared by palm, fingers and thumb so the hand
            reads as one form. User-space so a straight finger (zero-width
            bounding box) still gets painted. */}
        <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1={-14} y1={-4} x2={16} y2={46}>
          <stop offset="0" stopColor={palette.skinLight} />
          <stop offset="0.45" stopColor={palette.skin} />
          <stop offset="1" stopColor={palette.skinShade} />
        </linearGradient>
      </defs>

      {!thumbOver && thumbNode}

      <path d={palmPath} fill={fill} />
      {!thumbOver && (
        <path d={thenarEdge} fill="none" stroke={palette.skinShade} strokeOpacity={0.5} strokeWidth={1.2} strokeLinecap="round" />
      )}
      {/* The knuckle row darkens as the fingers close over it. */}
      <ellipse cx={0} cy={24} rx={knuckleHalf * 0.8} ry={3} fill={palette.skinShade} opacity={0.3 * fistShade * (0.4 + 0.6 * palm)} />

      {/* Pinky first so the index lands on top, as it does on a real hand
          seen from the thumb side. */}
      {[...fingers].reverse().map((f, j) => {
        const i = fingers.length - 1 - j
        const k = clamp01((f.curl - 0.6) / 0.4)
        return (
          <g key={i}>
            <Capsule points={`${pt(f.k)} ${pt(f.p)} ${pt(f.t)}`} r={f.r} fill={fill} shade={palette.skinShade} />
            <Crease at={f.p} along={{ x: f.p.x - f.k.x, y: f.p.y - f.k.y }} r={f.r} strength={k} color={palette.skinShade} />
            {/* A curled knuckle facing the lamp catches it. */}
            <circle cx={f.k.x - 0.8} cy={f.k.y - 0.6} r={1.3} fill={palette.skinLight} opacity={0.4 * k * palm} />
          </g>
        )
      })}

      {thumbOver && thumbNode}
    </g>
  )
}
