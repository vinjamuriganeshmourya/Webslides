/* The renderer: a Pose and a Skin in, one lit SVG person out.
 *
 * Nothing here animates. Every number that moves comes in through `pose`, and
 * every colour and shape that makes the person a particular person comes in
 * through `skin`. This file owns the paint (every gradient, filter and clip in
 * `defs`), the head group and its transforms, and the order the parts stack
 * in. The parts themselves live beside it: Body (ground to neck), Face (the
 * features and their physiology), Arm (one arm, mirrored for the right).
 *
 * Space: viewBox 0 0 400 600, ground y=580, hips (200,400), shoulders y=262,
 * head centre (200,170). The head group's local origin is the head centre.
 * An arm's local frame hangs +y down the arm with +x toward the body; the
 * right arm is the left one mirrored about x=200. */
import { useId, type JSX } from 'react'
import type { Pose } from '@/rig/channels'
import type { Skin } from '@/skins/types'
import { SoftLight, CastShadow, LAMP } from '@/rig/lighting'
import { Body, shade } from '@/rig/Body'
import { Face, Ear, facePhysiology } from '@/rig/Face'
import { Arm } from '@/rig/Arm'

export function Character({ pose, skin, width = 400, className }: { pose: Pose; skin: Skin; width?: number; className?: string }): JSX.Element {
  /* Two actors share a page, so every id is unique to this instance. */
  const u = useId().replace(/:/g, '')
  const id = (n: string) => `ch-${n}-${u}`
  const url = (n: string) => `url(#${id(n)})`
  const p = skin.palette

  const phys = facePhysiology(pose)
  const { nod, turn, faceXf } = phys

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

      <Body pose={pose} skin={skin} nod={nod} url={url}>
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

          <Face pose={pose} phys={phys} p={p} />

          {skin.hairFront && (
            <g filter={url('drop')} transform={`translate(${turn * 10} ${nod * 5})`}>
              {skin.hairFront}
            </g>
          )}
          {skin.faceExtras && <g transform={faceXf}>{skin.faceExtras}</g>}
        </g>

        {skin.neckExtras}
        <Arm side="L" pose={pose} skin={skin} url={url} />
        <Arm side="R" pose={pose} skin={skin} url={url} />
      </Body>
    </svg>
  )
}
