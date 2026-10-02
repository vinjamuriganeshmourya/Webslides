/* The body: the ground shadow, the legs, the torso and the neck, and the
 * transforms that make them one figure: breathing, lean, weight shift, bow.
 *
 * The head and the arms are not drawn here. They arrive as children and are
 * placed in the shoulder group, so they rise with each breath and drop with a
 * bow without knowing that either happened.
 *
 * Space: viewBox 0 0 400 600, ground y=580, hips (200,400), shoulders y=262. */
import type { JSX, ReactNode } from 'react'
import type { Pose } from '@/rig/channels'
import type { Skin } from '@/skins/types'

export const HIP = 400
export const SHOULDER_Y = 262
const TORSO_H = HIP - SHOULDER_Y

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/** Mix a hex colour toward white (k>0) or black (k<0). Non-hex input passes through. */
export function shade(hex: string, k: number): string {
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

/** Resolves a def name to `url(#…)` for this Character instance. */
export type Url = (n: string) => string

export function Body({ pose, skin, nod, url, children }: { pose: Pose; skin: Skin; nod: number; url: Url; children: ReactNode }): JSX.Element {
  const p = skin.palette
  const sh = skin.shoulderHalf
  const b = pose.breathe
  const lift = Math.max(0, -pose.bodyY)
  const groundScale = clamp(1 - lift / 140, 0.45, 1)
  const torso = torsoPath(sh)

  return (
    <>
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
            {children}
          </g>
        </g>
      </g>
    </>
  )
}

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
