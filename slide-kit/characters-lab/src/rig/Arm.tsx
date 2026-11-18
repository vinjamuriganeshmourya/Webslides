/* One arm: shoulder, elbow and wrist as nested rotations, the sleeve over it,
 * the watch, and the Hand at the end of the chain.
 *
 * An arm's local frame hangs +y down the arm with +x toward the body; the
 * right arm is the left one mirrored about x=200, which is why the right arm's
 * lit-mode gradients (defined in Character) have their stops swapped.
 *
 * Geometry from the reference: pivot 6 px inside the shoulder tip at y=205,
 * upper arm 95 and forearm 85 as chunky capsules, 30 and 26 wide. A long
 * sleeve covers both and ends in a cuff; a short sleeve is a cap with a
 * straight hem over a bare arm. Neither reference outlines the arm, so
 * 'line' art leaves it plain and puts its lines on the hand only.
 *
 * Joints (2026-11-17, after the true-3D character): the arm used to be two
 * straight capsules on a fixed pin, so a raised arm looked stuck on at the
 * shoulder corner and the elbow folded like a hinge. The joints now move the
 * way the 3D rig's helper bones make them move, drawn in 2D:
 *  - the shoulder girdle rises and draws in as the arm goes up (the collarbone
 *    lifts), so a raised arm grows out of a raised shoulder;
 *  - the bones stay straight and keep their thickness: the change is all at
 *    the joint, as the 3D rig's helper bones put it;
 *  - as the arm rises, the side of the torso runs on up the arm's outer edge
 *    through a soft armpit (the web, drawn by the torso: see shoulder.ts),
 *    which covers the shoulder's resting bulge; without it a raised arm sat on
 *    top of a shoulder that stayed put;
 *  - a short sleeve wraps the top of the arm from the joint and ends in a
 *    straight hem across it, instead of a stiff cap turning with the bone.
 * The joint ANGLES are untouched and the elbow and the wrist land exactly where
 * they did, so every action, hand position and contact (clap, facepalm, hands
 * on hips) is the same as before; only the drawing between the joints changed. */
import { useId, type JSX } from 'react'
import type { Pose } from '@/rig/channels'
import type { Skin } from '@/skins/types'
import { Hand } from '@/rig/Hand'
import { handPoseOf } from '@/actions/handPoses'
import { SHOULDER_Y, clamp, shade, type Url } from '@/rig/Body'
import { girdleLift, shoulderJoint, armRoot } from '@/rig/shoulder'

const UPPER = 95
const FORE = 85
const UPPER_W = 30
const FORE_W = 26
const SHOULDER_IN = 8
const CUFF_H = 11
const SHORT_SLEEVE = 40
const ROOT_FADE = [16, 46] // px down a raised upper arm over which the arm's copy fades in over the torso's

const CAP = { fill: 'none', strokeLinecap: 'round' as const }

const f = (n: number) => Math.round(n * 100) / 100

/** The upper arm (and a short sleeve's cap), in the shoulder's rotated frame. Drawn by the
    arm, and, once the arm rises past the horizontal, also by the torso (Body), inside the
    torso's own group: there torso, armpit and upper arm are one form with one soft rim, the
    way a raised arm grows out of the body. The arm's own copy then fades out over its first
    few centimetres (ROOT_FADE), so the joint shows the torso's seamless copy while the rest
    of the arm stays the arm's, in front of the head and hair as before. */
export function UpperArm({ shoulder, skin, url, side }: { shoulder: number; skin: Skin; url: Url; side: 'L' | 'R' }): JSX.Element {
  const long = skin.sleeve === 'long'
  const flat = skin.shading !== 'lit'
  const p = skin.palette
  const sleeveFill = flat ? p.sleeve : url('sleeve' + side)
  const upper = long ? sleeveFill : flat ? p.skin : url('armSkin' + side)
  /* The round end of the upper arm: where the arm's top meets the shoulder (shoulder.ts,
     armRoot). The bone runs from it to the elbow, which stays exactly where it was. */
  const [rx, ry] = armRoot(shoulder, SHOULDER_IN)
  const along = Math.atan2(UPPER - ry, -rx) / Math.PI * 180 - 90 // the bone's angle in this frame
  const rel = SHORT_SLEEVE - SHOULDER_IN // the hem, measured from the arm's round end
  return (
    <>
      <line x1={f(rx)} y1={f(ry)} x2="0" y2={UPPER} stroke={upper} strokeWidth={UPPER_W} {...CAP} />
      {!long && (
        /* A short sleeve: a cap that rounds over the shoulder (high enough to cover the arm's
           round end) and ends in a straight hem, a touch wider than the arm. The same shape as
           ever, carried by the arm's round end and turned along the bone. */
        <g transform={`translate(${f(rx)} ${f(ry)}) rotate(${f(along)})`}>
          <path d={`M-17 ${6 - SHOULDER_IN} C-17 ${-18 - SHOULDER_IN} 17 ${-18 - SHOULDER_IN} 17 ${6 - SHOULDER_IN} L17 ${rel} L-17 ${rel} Z`} fill={sleeveFill} />
          {/* the hem's flat shadow on the arm below it */}
          <rect x="-15" y={rel} width="30" height="4" fill={p.skinShade} opacity="0.5" />
        </g>
      )}
    </>
  )
}

export function Arm({ side, pose, skin, url }: { side: 'L' | 'R'; pose: Pose; skin: Skin; url: Url }): JSX.Element {
  const shoulder = pose[`shoulder${side}`]
  const elbow = pose[`elbow${side}`]
  const wrist = pose[`wrist${side}`]
  const long = skin.sleeve === 'long'
  const flat = skin.shading !== 'lit'
  const p = skin.palette
  const skinFill = flat ? p.skin : url('armSkin' + side)
  const sleeveFill = flat ? p.sleeve : url('sleeve' + side)
  const upper = long ? sleeveFill : skinFill
  const elbowCrease = clamp(elbow / 120, 0, 1) * 0.16
  const clay = skin.shading === 'clay'
  /* the shoulder girdle: up and in as the arm rises past the horizontal (shoulder.ts) */
  const lift = girdleLift(shoulder)
  const [jointX, jointY] = shoulderJoint(skin.shoulderHalf, SHOULDER_Y, shoulder)
  const fade = 'af' + useId().replace(/:/g, '')
  /* Clay: the arm drops a soft shadow on the chest and turns as one form.
     Both filters sit OUTSIDE the mirror, so the right arm is lit from the
     same lamp as the left rather than its mirror image. */
  return (
    <g data-part={`arm-${side}`} filter={clay ? url('clayDrop') : flat ? undefined : url('armDrop')}>
    <g filter={clay ? url('clayLimb') : undefined}>
    <g transform={side === 'R' ? 'translate(400 0) scale(-1 1)' : undefined}>
      <g transform={`translate(${f(jointX)} ${f(jointY)}) rotate(${shoulder})`}>
        {/* the arm's own upper arm; on a raised arm its root fades into the torso's copy (see UpperArm) */}
        {lift > 0.005 && (
          <defs>
            <linearGradient id={`${fade}g`} gradientUnits="userSpaceOnUse" x1="0" y1={ROOT_FADE[0]} x2="0" y2={ROOT_FADE[1]}>
              <stop offset="0" stopColor="#fff" stopOpacity={f(1 - lift)} />
              <stop offset="1" stopColor="#fff" stopOpacity="1" />
            </linearGradient>
            <mask id={fade} maskUnits="userSpaceOnUse" x="-60" y="-60" width="120" height={UPPER + 120}>
              <rect x="-60" y="-60" width="120" height={UPPER + 120} fill={`url(#${fade}g)`} />
            </mask>
          </defs>
        )}
        <g mask={lift > 0.005 ? `url(#${fade})` : undefined}>
          <UpperArm shoulder={shoulder} skin={skin} url={url} side={side} />
        </g>
        <g transform={`translate(0 ${UPPER}) rotate(${-elbow})`}>
          <line x1="0" y1="0" x2="0" y2={FORE} stroke={upper} strokeWidth={FORE_W} {...CAP} />
          {/* The inside of the elbow creases as the joint closes: one flat darker shape. */}
          <ellipse cx="6" cy="0" rx="3.5" ry="6" fill={long ? p.topShade : p.skinShade} opacity={elbowCrease} />
          {long && (
            /* The cuff: a band a little lighter than the sleeve with a seam
               line where the sleeve meets it, as on the reference shirt. */
            <g transform={`translate(0 ${FORE - CUFF_H + 1})`}>
              <rect x={-FORE_W / 2} y="0" width={FORE_W} height={CUFF_H} rx="1.5" fill={shade(p.sleeve, 0.3)} />
              <line x1={-FORE_W / 2 + 1} y1="0.6" x2={FORE_W / 2 - 1} y2="0.6" stroke={shade(p.sleeve, -0.18)} strokeWidth="1.2" strokeLinecap="round" />
            </g>
          )}
          {/* The watch sits on the character's left wrist (screen right), between the cuff and the palm. */}
          {skin.watch && side === 'R' && (
            <g transform={`translate(0 ${FORE - 5})`}>
              <rect x="-12" y="-3.2" width="24" height="6.4" rx="2.4" fill="#2A2E3A" />
              <circle r="5" fill="#DDE2EA" stroke="#2A2E3A" strokeWidth="1.6" />
              <circle r="0.9" fill="#2A2E3A" />
            </g>
          )}
          <g transform={`translate(0 ${FORE}) rotate(${-wrist})`}>
            <Hand pose={handPoseOf(pose, side)} palette={p} art={skin.art} outline={skin.outline} shading={skin.shading} />
          </g>
        </g>
      </g>
    </g>
    </g>
    </g>
  )
}
