/* The renderer: a Pose and a Skin in, one lit SVG person out.
 *
 * Nothing here animates. Every number that moves comes in through `pose`, and
 * every colour and shape that makes the person a particular person comes in
 * through `skin`. What this file owns is the geometry of the rig (CONTRACTS.md,
 * "Rig geometry") and the physics of a face: a smile lifts the cheeks and
 * narrows the eyes, a turned head slides the features more than the skull, a
 * fringe throws a shadow on the forehead. Actions do not have to know any of
 * that, which is why one wave looks right on both characters.
 *
 * Space: viewBox 0 0 400 600, ground y=580, hips (200,400), shoulders y=262,
 * head centre (200,170). The head group's local origin is the head centre.
 * An arm's local frame hangs +y down the arm with +x toward the body; the
 * right arm is the left one mirrored about x=200. */
import { useId, type JSX, type ReactNode } from 'react'
import type { Pose } from '@/rig/channels'
import type { Palette, Skin } from '@/skins/types'
import { Hand } from '@/rig/Hand'
import { handPoseOf } from '@/actions/handPoses'
import { SoftLight, CastShadow, LAMP } from '@/rig/lighting'

const HIP = 400
const SHOULDER_Y = 262
const TORSO_H = HIP - SHOULDER_Y

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/** Mix a hex colour toward white (k>0) or black (k<0). Non-hex input passes through. */
function shade(hex: string, k: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex)
  if (!m) return hex
  const n = parseInt(m[1], 16)
  const ch = (shift: number) => {
    const c = (n >> shift) & 255
    const t = k < 0 ? 0 : 255
    return Math.round(c + (t - c) * Math.abs(k))
  }
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, '0')}`
}

export function Character({ pose, skin, width = 400, className }: { pose: Pose; skin: Skin; width?: number; className?: string }): JSX.Element {
  /* Two actors share a page, so every id is unique to this instance. */
  const u = useId().replace(/:/g, '')
  const id = (n: string) => `ch-${n}-${u}`
  const url = (n: string) => `url(#${id(n)})`
  const p = skin.palette
  const sh = skin.shoulderHalf

  /* Derived physiology: these are facts about faces, not choices an action makes. */
  const smileUp = Math.max(0, pose.smile)
  const squint = clamp(pose.squint + smileUp * 0.3, 0, 1)
  const nod = clamp(pose.headNod + pose.bow * 0.6, -1, 1)
  const turn = pose.headTurn
  const b = pose.breathe
  const lift = Math.max(0, -pose.bodyY)
  const groundScale = clamp(1 - lift / 140, 0.45, 1)
  const mouth = mouthGeom(pose)
  const teethVis = Math.max(pose.teeth, clamp((pose.mouthOpen - 0.12) / 0.1, 0, 1) * clamp((pose.smile - 0.2) / 0.15, 0, 1))

  const torso = torsoPath(sh)
  /* Features ride the front of the skull, so they travel further than the
     skull does when the head yaws; the nose, nearest the viewer, furthest. */
  const faceXf = `translate(${turn * 16} ${nod * 9 + 12}) scale(1 ${1 - Math.abs(nod) * 0.04}) translate(0 -12)`

  const arm = (side: 'L' | 'R') => (
    <g key={side} data-part={`arm-${side}`} filter={url('armDrop')} transform={side === 'R' ? 'translate(400 0) scale(-1 1)' : undefined}>
      <Arm side={side} pose={pose} skin={skin} pivotX={200 - sh} skinFill={url('armSkin' + side)} sleeveFill={url('sleeve' + side)} />
    </g>
  )

  return (
    <svg viewBox="0 0 400 600" width={width} height={width * 1.5} className={className} role="img" aria-label={skin.label}>
      <defs>
        <radialGradient id={id('face')} cx="0.38" cy="0.32" r="0.75">
          <stop offset="0%" stopColor={p.skinLight} />
          <stop offset="55%" stopColor={p.skin} />
          <stop offset="100%" stopColor={p.skinShade} />
        </radialGradient>
        <linearGradient id={id('skin')} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={p.skinLight} />
          <stop offset="100%" stopColor={p.skinShade} />
        </linearGradient>
        <linearGradient id={id('neck')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shade(p.skinShade, -0.12)} />
          <stop offset="100%" stopColor={p.skin} />
        </linearGradient>
        <linearGradient id={id('top')} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor={p.topLight} />
          <stop offset="45%" stopColor={p.top} />
          <stop offset="100%" stopColor={p.topShade} />
        </linearGradient>
        {/* Arm paint is defined in the arm's own frame, so the right arm, which
            is mirrored, gets the stops swapped to keep its lit edge toward the lamp. */}
        {(['L', 'R'] as const).map((side) => {
          const [x1, x2] = side === 'L' ? [-12, 12] : [12, -12]
          return (
            <g key={side}>
              <linearGradient id={id('armSkin' + side)} gradientUnits="userSpaceOnUse" x1={x1} y1="0" x2={x2} y2="0">
                <stop offset="0%" stopColor={p.skinLight} />
                <stop offset="100%" stopColor={p.skinShade} />
              </linearGradient>
              <linearGradient id={id('sleeve' + side)} gradientUnits="userSpaceOnUse" x1={x1} y1="0" x2={x2} y2="0">
                <stop offset="0%" stopColor={shade(p.sleeve, 0.18)} />
                <stop offset="100%" stopColor={shade(p.sleeve, -0.3)} />
              </linearGradient>
            </g>
          )
        })}
        <radialGradient id={id('occ')} cx="0.5" cy="0.2" r="0.85">
          <stop offset="55%" stopColor={shade(p.topShade, -0.5)} stopOpacity="0" />
          <stop offset="100%" stopColor={shade(p.topShade, -0.5)} stopOpacity="0.4" />
        </radialGradient>
        <radialGradient id={id('ground')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#1E3A5F" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#1E3A5F" stopOpacity="0" />
        </radialGradient>
        {/* The skull is lit in head-local space, so the lamp is restated relative
            to the head centre; otherwise it sits a hand's width from the forehead. */}
        <SoftLight id={id('lit')} light={{ x: LAMP.x - 200, y: LAMP.y - 170, z: LAMP.z }} />
        <SoftLight id={id('litBig')} blur={12} />
        <CastShadow id={id('drop')} dy={4} blur={3.5} opacity={0.34} />
        <CastShadow id={id('armDrop')} dy={6} blur={6} opacity={0.22} />
        <clipPath id={id('legL')}>
          <rect x="0" y="0" width="200" height="600" />
        </clipPath>
        <clipPath id={id('legR')}>
          <rect x="200" y="0" width="200" height="600" />
        </clipPath>
      </defs>

      {/* Contact shadow. It shrinks and fades as the figure leaves the ground. */}
      <ellipse
        cx={200 + pose.bodyX + pose.stance * 3}
        cy={580}
        rx={78 * groundScale * pose.bodyScale * skin.buildScale}
        ry={10 * groundScale}
        fill={url('ground')}
        opacity={groundScale}
      />

      <g transform={`translate(${200 + pose.bodyX} ${580 + pose.bodyY}) scale(${pose.bodyScale * skin.buildScale}) translate(-200 -580)`}>
        <g transform={`translate(${pose.stance * 1.5} 0)`}>
          <Legs legs={skin.legs} kneeL={pose.kneeL} kneeR={pose.kneeR} clipL={url('legL')} clipR={url('legR')} />
        </g>

        {/* Everything above the hips leans and shifts weight together. */}
        <g transform={`rotate(${pose.lean} 200 ${HIP}) translate(${pose.stance * 3} 0)`}>
          {/* The chest swells about the hips with each breath; a bow folds the torso down. */}
          <g transform={`translate(200 ${HIP}) scale(${1 + b * 0.015} ${(1 + b * 0.015) * (1 - (pose.bow * 26) / TORSO_H)}) translate(-200 ${-HIP})`}>
            <g filter={url('litBig')}>
              <path d={torso} fill={url('top')} />
              {skin.top}
            </g>
            {/* Occlusion where the cloth turns away, and a rim of light down the lamp-side edge. */}
            <path d={torso} fill={url('occ')} />
            <path
              d={`M${200 - sh - 9} 276 C${200 - sh - 15} 310 ${200 - sh + 2} 350 ${200 - sh + 2} 398`}
              fill="none"
              stroke={shade(p.topLight, 0.45)}
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.55"
            />
          </g>

          {/* Shoulders: the neck, head and arms rise with the breath and drop with a bow. */}
          <g transform={`translate(${pose.twist} ${-b * 2 + pose.bow * 26})`}>
            <rect x="184" y="222" width="32" height="44" rx="14" fill={url('neck')} />
            {/* The chin's shadow lands ON THE NECK and follows the head. It is
                what makes the head sit on the body instead of beside it. */}
            <path
              transform={`translate(0 ${pose.headY + nod * 5})`}
              d="M184 236 q16 9 32 0 v13 q-16 6 -32 0 z"
              fill={shade(p.skinShade, -0.3)}
              opacity="0.5"
            />

            <g data-part="head" transform={`translate(200 252) rotate(${pose.headTilt}) scale(${skin.headScale.x} ${skin.headScale.y}) translate(0 ${-82 + pose.headY + nod * 5})`}>
              <g transform={`translate(${turn * -3} 0)`}>{skin.hairBack}</g>
              {/* Ears sit behind the skull so the one on the near side of a turn
                  slides out of sight, as a real ear does. */}
              <g transform={`translate(${turn * 4} 0)`}>
                <Ear x={-60 + (turn < 0 ? -turn * 14 : turn * 2)} flip={-1} fill={url('skin')} p={p} />
                <Ear x={60 - (turn > 0 ? turn * 14 : -turn * 2)} flip={1} fill={url('skin')} p={p} />
              </g>
              <g filter={url('lit')} transform={`translate(${turn * 4} 0) scale(${1 - Math.abs(turn) * 0.05} 1)`}>
                <path d={skin.head} fill={url('face')} />
              </g>

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

              {skin.hairFront && (
                <g filter={url('drop')} transform={`translate(${turn * 10} ${nod * 5})`}>
                  {skin.hairFront}
                </g>
              )}
              {skin.faceExtras && <g transform={faceXf}>{skin.faceExtras}</g>}
            </g>

            {skin.neckExtras}
            {arm('L')}
            {arm('R')}
          </g>
        </g>
      </g>
    </svg>
  )
}

/* ---------- body ---------- */

function torsoPath(sh: number): string {
  const l = 200 - sh
  const r = 200 + sh
  return `M174 248 C156 250 ${l - 6} 254 ${l - 12} 270 C${l - 18} 300 ${l + 4} 352 ${l + 4} 406 L${r - 4} 406 C${r - 4} 352 ${r + 18} 300 ${r + 12} 270 C${r + 6} 254 244 250 226 248 Z`
}

/** The skin draws both legs as one node; a knee bend shortens its half about the hip. */
function Legs({ legs, kneeL, kneeR, clipL, clipR }: { legs: ReactNode; kneeL: number; kneeR: number; clipL: string; clipR: string }) {
  const bend = (k: number) => `translate(200 ${HIP}) scale(1 ${1 - k * 0.06}) translate(-200 ${-HIP})`
  /* Same bend both sides: draw once, no seam down the middle. */
  if (Math.abs(kneeL - kneeR) < 0.004) return <g transform={bend(kneeL)}>{legs}</g>
  return (
    <>
      <g clipPath={clipL}>
        <g transform={bend(kneeL)}>{legs}</g>
      </g>
      <g clipPath={clipR}>
        <g transform={bend(kneeR)}>{legs}</g>
      </g>
    </>
  )
}

function Arm({ side, pose, skin, pivotX, skinFill, sleeveFill }: { side: 'L' | 'R'; pose: Pose; skin: Skin; pivotX: number; skinFill: string; sleeveFill: string }) {
  const shoulder = pose[`shoulder${side}`]
  const elbow = pose[`elbow${side}`]
  const wrist = pose[`wrist${side}`]
  const long = skin.sleeve === 'long'
  const p = skin.palette
  const cap = { fill: 'none', strokeLinecap: 'round' as const }
  const upper = long ? sleeveFill : skinFill
  return (
    <g transform={`translate(${pivotX} ${SHOULDER_Y}) rotate(${shoulder})`}>
      <line x1="0" y1="0" x2="0" y2="92" stroke={upper} strokeWidth="24" {...cap} />
      {!long && (
        <>
          {/* A short sleeve is a wider capsule over the top of the arm, with its hem shading the skin below. */}
          <line x1="0" y1="-2" x2="0" y2="38" stroke={sleeveFill} strokeWidth="27" {...cap} />
          <path d="M-13 41 Q0 47 13 41" fill="none" stroke={shade(p.skinShade, -0.25)} strokeWidth="2.5" opacity="0.3" />
        </>
      )}
      <g transform={`translate(0 92) rotate(${-elbow})`}>
        <line x1="0" y1="0" x2="0" y2="84" stroke={upper} strokeWidth="21" {...cap} />
        {/* The inside of the elbow creases as the joint closes. */}
        <ellipse cx="6" cy="0" rx="3.5" ry="6" fill={shade(long ? p.topShade : p.skinShade, -0.3)} opacity={clamp(elbow / 120, 0, 1) * 0.14} />
        {long && <path d="M-10 74 Q0 78 10 74" fill="none" stroke={p.topShade} strokeWidth="2" opacity="0.55" />}
        {/* The watch sits on the character's left wrist (screen right), between the cuff and the palm. */}
        {skin.watch && side === 'R' && (
          <g transform="translate(0 79.5)">
            <rect x="-11" y="-3.2" width="22" height="6.4" rx="2.4" fill="#2A2E3A" />
            <circle r="5" fill="#DDE2EA" stroke="#2A2E3A" strokeWidth="1.6" />
            <circle r="0.9" fill="#2A2E3A" />
          </g>
        )}
        <g transform={`translate(0 84) rotate(${-wrist})`}>
          <Hand pose={handPoseOf(pose, side)} palette={p} />
        </g>
      </g>
    </g>
  )
}

/* ---------- head ---------- */

function Ear({ x, flip, fill, p }: { x: number; flip: 1 | -1; fill: string; p: Palette }) {
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
