/* One arm: shoulder, elbow and wrist as nested rotations, the sleeve over it,
 * the watch, and the Hand at the end of the chain.
 *
 * An arm's local frame hangs +y down the arm with +x toward the body; the
 * right arm is the left one mirrored about x=200, which is why the right arm's
 * gradients (defined in Character) have their stops swapped. */
import type { JSX } from 'react'
import type { Pose } from '@/rig/channels'
import type { Skin } from '@/skins/types'
import { Hand } from '@/rig/Hand'
import { handPoseOf } from '@/actions/handPoses'
import { SHOULDER_Y, clamp, shade, type Url } from '@/rig/Body'

export function Arm({ side, pose, skin, url }: { side: 'L' | 'R'; pose: Pose; skin: Skin; url: Url }): JSX.Element {
  const shoulder = pose[`shoulder${side}`]
  const elbow = pose[`elbow${side}`]
  const wrist = pose[`wrist${side}`]
  const long = skin.sleeve === 'long'
  const p = skin.palette
  const pivotX = 200 - skin.shoulderHalf
  const skinFill = url('armSkin' + side)
  const sleeveFill = url('sleeve' + side)
  const cap = { fill: 'none', strokeLinecap: 'round' as const }
  const upper = long ? sleeveFill : skinFill
  return (
    <g data-part={`arm-${side}`} filter={url('armDrop')} transform={side === 'R' ? 'translate(400 0) scale(-1 1)' : undefined}>
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
    </g>
  )
}
