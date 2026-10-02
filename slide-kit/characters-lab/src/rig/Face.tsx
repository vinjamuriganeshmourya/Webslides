/* The face: eyes, brows, nose, mouth, cheeks and ears, plus the physics that
 * ties them together. A smile lifts the cheeks and narrows the eyes, a turned
 * head slides the features more than the skull, an open smiling mouth shows
 * teeth. Actions do not have to know any of that, which is why one wave looks
 * right on both characters.
 *
 * Everything here is head-local: the origin is the head centre, and the skull,
 * hair and ear placement are composed around it in Character. */
import { useId, type JSX } from 'react'
import type { Pose } from '@/rig/channels'
import type { Palette } from '@/skins/types'
import { clamp, shade } from '@/rig/Body'

/* ---------- derived physiology ---------- */

export type FacePhysiology = {
  smileUp: number
  squint: number
  /** Head pitch, with a bow folded in: the head drops as the torso does. */
  nod: number
  turn: number
  /** The transform the features ride on; `faceExtras` in a skin share it. */
  faceXf: string
  mouth: MouthGeom
  teethVis: number
}

/** Facts about faces, not choices an action makes. */
export function facePhysiology(pose: Pose): FacePhysiology {
  const smileUp = Math.max(0, pose.smile)
  const squint = clamp(pose.squint + smileUp * 0.3, 0, 1)
  const nod = clamp(pose.headNod + pose.bow * 0.6, -1, 1)
  const turn = pose.headTurn
  const mouth = mouthGeom(pose)
  const teethVis = Math.max(pose.teeth, clamp((pose.mouthOpen - 0.12) / 0.1, 0, 1) * clamp((pose.smile - 0.2) / 0.15, 0, 1))
  /* Features ride the front of the skull, so they travel further than the
     skull does when the head yaws; the nose, nearest the viewer, furthest. */
  const faceXf = `translate(${turn * 16} ${nod * 9 + 12}) scale(1 ${1 - Math.abs(nod) * 0.04}) translate(0 -12)`
  return { smileUp, squint, nod, turn, faceXf, mouth, teethVis }
}

/* ---------- the features ---------- */

export function Face({ pose, phys, p }: { pose: Pose; phys: FacePhysiology; p: Palette }): JSX.Element {
  const { smileUp, squint, nod, turn, faceXf, mouth, teethVis } = phys
  return (
    <>
      <g transform={faceXf}>
        {/* Cheek apples ride up with a smile; blush is a channel on top of a resting tint. */}
        {[-1, 1].map((s) => (
          <ellipse key={s} cx={s * 31} cy={22 - smileUp * 3} rx="9.5" ry="6.5" fill={p.blush} opacity={0.14 + pose.cheeks * 0.55} />
        ))}
        {[-1, 1].map((s) => (
          <path
            key={s}
            d={`M${s * 8} 20 Q${s * 19} 30 ${s * (mouth.hw + 2)} ${36 + mouth.cy}`}
            fill="none"
            stroke={p.skinShade}
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity={clamp((pose.smile - 0.45) / 0.3, 0, 1) * 0.4}
          />
        ))}
        <Eye side="L" blink={pose.blinkL} squint={squint} lookX={pose.lookX} lookY={pose.lookY} pupil={pose.pupil} turn={turn} p={p} />
        <Eye side="R" blink={pose.blinkR} squint={squint} lookX={pose.lookX} lookY={pose.lookY} pupil={pose.pupil} turn={turn} p={p} />
        <Brow side="L" raise={pose.browL} inner={pose.browInnerL} color={p.brow} />
        <Brow side="R" raise={pose.browR} inner={pose.browInnerR} color={p.brow} />
        <g transform={`translate(${pose.mouthX * 5 + pose.jawX * 4} 38)`}>
          <Mouth m={mouth} pucker={pose.pucker} teeth={teethVis} tongue={pose.tongue} p={p} />
        </g>
      </g>
      <g transform={`translate(${turn * 20} ${nod * 9})`}>
        <Nose p={p} />
      </g>
    </>
  )
}

export function Ear({ x, flip, fill, p }: { x: number; flip: 1 | -1; fill: string; p: Palette }) {
  return (
    <g transform={`translate(${x} 2) scale(${flip} 1)`}>
      <ellipse rx="8.5" ry="12.5" fill={fill} stroke={p.skinShade} strokeWidth="1" strokeOpacity="0.5" />
      {/* the fold of the ear, bulging toward the face */}
      <path d="M1 -6 C-4 -4 -4 4 0 7" fill="none" stroke={p.skinShade} strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
    </g>
  )
}

function Nose({ p }: { p: Palette }) {
  return (
    <g>
      {/* shadow down the lamp-away side of the bridge, a lit tip, two nostrils and the base */}
      <path d="M1 2 C5 8 7 14 5 19" fill="none" stroke={p.skinShade} strokeWidth="3" strokeLinecap="round" opacity="0.3" />
      <circle cx="-1.5" cy="13" r="2.2" fill={p.skinLight} opacity="0.5" />
      <path d="M-6 18 Q0 23 6 18" fill="none" stroke={p.skinShade} strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
      <ellipse cx="-4" cy="19.2" rx="1.6" ry="1" fill={p.skinShade} opacity="0.55" />
      <ellipse cx="4" cy="19.2" rx="1.6" ry="1" fill={p.skinShade} opacity="0.55" />
    </g>
  )
}

/* The eye shape, eye-local, centre (0,0): an almond, taller above the axis than below. */
const EYE = 'M-11 1 C-8 -16 8 -16 11 1 C8 11 -8 11 -11 1 Z'

function Eye({ side, blink, squint, lookX, lookY, pupil, turn, p }: { side: 'L' | 'R'; blink: number; squint: number; lookX: number; lookY: number; pupil: number; turn: number; p: Palette }) {
  const u = useId().replace(/:/g, '')
  const x = side === 'L' ? -24 : 24
  /* The eye on the far side of a turn foreshortens, the near one opens a touch. */
  const far = side === 'L' ? turn > 0 : turn < 0
  const sx = far ? 1 - Math.abs(turn) * 0.18 : 1 + Math.abs(turn) * 0.06
  /* Lids are the EYE curve with its control points pulled down: the upper lid
     from the top (-16 is open, 11 reaches the lower edge), the lower lid up. */
  const c = -16 + clamp(blink, 0, 1) * 27
  const c2 = 11 - clamp(squint, 0, 1) * 15
  const lash = shade(p.brow, -0.35)
  const ix = lookX * 5
  const iy = lookY * 4
  return (
    <g transform={`translate(${x} -4) scale(${sx} 1)`}>
      <clipPath id={`eye-${u}`}>
        <path d={EYE} />
      </clipPath>
      <linearGradient id={`socket-${u}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={p.skinShade} stopOpacity="0.45" />
        <stop offset="45%" stopColor={p.skinShade} stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`iris-${u}`} cx="0.5" cy="0.65" r="0.6">
        <stop offset="0%" stopColor={shade(p.iris, 0.35)} />
        <stop offset="65%" stopColor={p.iris} />
        <stop offset="100%" stopColor={shade(p.iris, -0.45)} />
      </radialGradient>
      <g clipPath={`url(#eye-${u})`}>
        <path d={EYE} fill="#FBF8F4" />
        {/* the upper lid's shadow across the white gives the socket depth */}
        <path d={EYE} fill={`url(#socket-${u})`} />
        <circle cx={ix} cy={iy} r="7.2" fill={`url(#iris-${u})`} stroke={shade(p.iris, -0.5)} strokeWidth="0.8" />
        <circle cx={ix} cy={iy} r={3.3 * pupil} fill="#120A08" />
        <circle cx={ix - 2.4} cy={iy - 2.6} r="2" fill="#FFFFFF" />
        <circle cx={ix + 2.2} cy={iy + 2.6} r="0.9" fill="#FFFFFF" opacity="0.55" />
        <path d={`M-13 26 H13 V1 C8 ${c2} -8 ${c2} -13 1 Z`} fill={p.skin} />
        <path d={`M-13 -26 H13 V1 C8 ${c} -8 ${c} -13 1 Z`} fill={shade(p.skin, -0.06)} />
      </g>
      {/* lower lid edge, the lash line (tapered, so it reads as hair not ink) and a soft crease */}
      <path d={`M-11 1 C-8 ${c2} 8 ${c2} 11 1`} fill="none" stroke={p.skinShade} strokeWidth="1" opacity={0.25 + squint * 0.4} />
      <path d={`M-11 1 C-8 ${c} 8 ${c} 11 1 C8 ${c + 2.4} -8 ${c + 2.4} -11 1 Z`} fill={lash} />
      <path d="M-9.5 -8 C-7 -22 7 -22 9.5 -8" transform={`translate(0 ${blink * 5})`} fill="none" stroke={p.skinShade} strokeWidth="1.4" strokeLinecap="round" opacity="0.28" />
    </g>
  )
}

/* Drawn as the viewer's right brow (inner end at x=11, tail at x=37); the left is its mirror. */
function Brow({ side, raise, inner, color }: { side: 'L' | 'R'; raise: number; inner: number; color: string }) {
  /* `inner` rotates about the tail so only the inner end lifts (sad) or drops (angry). */
  return (
    <g transform={`scale(${side === 'L' ? -1 : 1} 1) translate(0 ${-raise * 7}) rotate(${inner * 14} 37 -26)`}>
      <path d="M11 -21 C15 -27 26 -31 37 -27 C31 -25.5 24 -24.5 11 -16.5 Z" fill={color} stroke={color} strokeWidth="1" strokeLinejoin="round" opacity="0.92" />
    </g>
  )
}

/* ---------- mouth ---------- */

type MouthGeom = { hw: number; cy: number; uy: number; ly: number; d: string }

/** One closed path for the mouth opening. With the jaw shut the two edges
    coincide, so the same path is the bowed line of a closed mouth. */
function mouthGeom(pose: Pose): MouthGeom {
  const open = clamp(pose.mouthOpen + pose.pucker * 0.18 * (1 - pose.mouthOpen), 0, 1)
  const hw = (14 + pose.mouthWide * 12) * (1 - pose.pucker * 0.4)
  const cy = -pose.smile * 7
  const uy = pose.smile * 2 - open * 3
  const ly = pose.smile * 2 + open * 22
  const d = `M${-hw} ${cy} C${-hw * 0.5} ${uy} ${hw * 0.5} ${uy} ${hw} ${cy} C${hw * 0.5} ${ly} ${-hw * 0.5} ${ly} ${-hw} ${cy} Z`
  return { hw, cy, uy, ly, d }
}

function Mouth({ m, pucker, teeth, tongue, p }: { m: MouthGeom; pucker: number; teeth: number; tongue: number; p: Palette }) {
  const u = useId().replace(/:/g, '')
  const { hw, cy, uy, ly, d } = m
  const lipW = 2.5 + pucker * 2
  const band = 4.5 + pucker * 3
  const gap = ly - uy
  const teethH = Math.min(9, 2 + gap * 0.33) * teeth
  return (
    <g data-part="mouth">
      <clipPath id={`mouth-${u}`}>
        <path d={d} />
      </clipPath>
      {gap > 0.5 && (
        <g clipPath={`url(#mouth-${u})`}>
          <path d={d} fill={p.mouth} />
          {/* the tongue is the floor of the mouth; the channel lifts it */}
          <ellipse cx="0" cy={ly + 2 - tongue * 8} rx={hw * 0.55} ry="6" fill="#C9636E" />
          {teethH > 0.2 && (
            <>
              <rect x={-hw} y={uy - 2} width={hw * 2} height={teethH + 2} rx="1.5" fill="#F7F3EE" />
              {[-6, -2, 2, 6].map((tx) => (
                <line key={tx} x1={tx} y1={uy - 1} x2={tx} y2={uy + teethH} stroke={p.skinShade} strokeWidth="0.7" opacity="0.2" />
              ))}
            </>
          )}
        </g>
      )}
      {/* lower lip body with a highlight, then the lip line itself, then its shadow on the chin */}
      <path
        d={`M${-hw} ${cy} C${-hw * 0.5} ${ly} ${hw * 0.5} ${ly} ${hw} ${cy} C${hw * 0.55} ${ly + band} ${-hw * 0.55} ${ly + band} ${-hw} ${cy} Z`}
        fill={p.lip}
        opacity="0.55"
      />
      <path d={`M${-hw * 0.35} ${ly + band * 0.45} Q0 ${ly + band * 0.6} ${hw * 0.35} ${ly + band * 0.45}`} fill="none" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.28" />
      <path d={d} fill="none" stroke={p.lip} strokeWidth={lipW} strokeLinejoin="round" strokeLinecap="round" />
      <path d={`M${-hw * 0.6} ${ly + band + 1.5} Q0 ${ly + band + 4} ${hw * 0.6} ${ly + band + 1.5}`} fill="none" stroke={p.skinShade} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
    </g>
  )
}
