import { useEffect, useMemo, type ReactNode } from 'react'
import { useInstant } from '@/motion/instant'
import { Character } from './cast/rig/Character'
import { useCharacter } from './cast/rig/useCharacter'
import { buildSkin, PRESETS, type CharacterConfig } from './cast/skins/config'
import type { Action, Key } from './cast/rig/track'

/**
 * THE CAST OF PF 22, from the Character Lab (`slide-kit/characters-lab`,
 * vendored unchanged in `./cast`). User, 2026-10-07: slides 4 and 20 use the
 * lab's human characters as the base, adapted to each scene by pose,
 * expression, gesture and props, in the lab's art style, proportions and
 * colours.
 *
 *   Rahul   the lab's Arjun preset, unchanged (a friend at the party, the
 *           customer at the bakery)
 *   Riya    the lab's Riya preset, unchanged (a friend at the party)
 *   Teja    a lab config: the birthday friend, in the room and on the call's
 *           small self tile
 *   Amma    a lab config: on the video call
 *   Baker   a lab config, with two props the lab does not have: a chef's cap
 *           (head frame, so it moves with the head) and an apron (body frame)
 *
 * `Posed` draws one of them holding ONE frame of a lab gesture: on mount the
 * gesture plays from its start up to `at` seconds and stops there (movement
 * inside the press that mounted it); during an instant jump it is simply at
 * `at`. Nothing moves after that, so no frame changes on a timer (spec rule
 * 1). Key a `Posed` by its pose so a new pose plays from the start.
 *
 * `crop` is a window on the lab's 400 x 600 canvas (ground y 580, hips y 360,
 * head centre y 120), so a half-body figure is cut cleanly at the waist.
 */

export const TEJA: CharacterConfig = {
  name: 'Teja',
  gender: 'male',
  art: 'soft',
  shading: 'flat',
  skinTone: 'wheatish',
  hair: { style: 'curly', color: 'black' },
  face: { jaw: 'oval', brows: 'medium', eyes: 'oval', mouth: 'full' },
  outfit: { top: 'tshirt', topColor: '#12B5A8', bottom: 'jeans', bottomColor: '#1B2238' },
  accessories: {},
  build: { height: 0.98, shoulders: 0.98 },
}

export const AMMA: CharacterConfig = {
  name: 'Amma',
  gender: 'female',
  art: 'line',
  shading: 'flat',
  skinTone: 'wheatish',
  hair: { style: 'bun', color: 'darkBrown' },
  face: { jaw: 'round', brows: 'medium', eyes: 'dot', mouth: 'line' },
  outfit: { top: 'kurta', topColor: '#B24A7A', bottom: 'salwar', bottomColor: '#5B2A45' },
  accessories: { bindi: true, earrings: true },
  build: { height: 0.97, shoulders: 1 },
}

export const BAKER: CharacterConfig = {
  name: 'Baker',
  gender: 'male',
  art: 'soft',
  shading: 'flat',
  skinTone: 'medium',
  hair: { style: 'short', color: 'black' },
  face: { jaw: 'square', brows: 'thick', eyes: 'oval', mouth: 'full' },
  outfit: { top: 'tshirt', topColor: '#FFFFFF', bottom: 'trousers', bottomColor: '#1B2238' },
  accessories: { beard: 'short' },
  build: { height: 1, shoulders: 1.04 },
}

export const RAHUL = PRESETS.arjun
export const RIYA = PRESETS.riya

/** The baker's cap, head-local (skull centre at 0,0, rx 50 ry 56). */
const CAP = (
  <g data-part="cap">
    <path d="M -44 -50 C -70 -60 -66 -112 -34 -104 C -30 -134 30 -134 34 -104 C 66 -112 70 -60 44 -50 Z" fill="#FFFFFF" stroke="#D8E3F5" strokeWidth={3} />
    <path d="M -46 -58 H 46 V -40 C 20 -46 -20 -46 -46 -40 Z" fill="#F5F8FF" stroke="#D8E3F5" strokeWidth={3} />
  </g>
)

/** The baker's apron, body space (shoulders y 205, hips y 360). */
const APRON = (
  <g data-part="apron">
    <path d="M 170 236 H 230 V 270 C 246 276 250 300 248 330 L 246 420 H 154 L 152 330 C 150 300 154 276 170 270 Z" fill="#FFF4EC" stroke="#FF8A3D" strokeWidth={3} />
    <path d="M 170 236 C 168 220 160 212 152 208 M 230 236 C 232 220 240 212 248 208" stroke="#FF8A3D" strokeWidth={3} fill="none" />
    <rect x={178} y={318} width={44} height={30} rx={6} fill="none" stroke="#FF8A3D" strokeWidth={2.5} />
  </g>
)

export type Crop = { x0: number; y0: number; x1: number; y1: number }
/** Half body: head to just under the hips. */
export const HALF: Crop = { x0: 90, y0: 30, x1: 310, y1: 392 }

export function Posed({
  cfg,
  props: withProps = false,
  expression = 'happy',
  intensity = 1,
  gesture,
  side,
  amplitude,
  at = 1.2,
  scale,
  crop = HALF,
  flip = false,
  seed = 3,
  say,
  children,
}: {
  cfg: CharacterConfig
  /** the baker's cap and apron */
  props?: boolean
  expression?: string
  intensity?: number
  gesture?: string
  side?: 'L' | 'R'
  /** the lab's PlayOptions amplitude: a smaller reach keeps a hand inside the canvas */
  amplitude?: number
  /** the held frame, seconds into the gesture */
  at?: number
  /** px per lab unit */
  scale: number
  crop?: Crop
  flip?: boolean
  seed?: number
  /** words the mouth is saying in the held frame (singing, shouting) */
  say?: string
  /** drawn over the figure in the same cropped box (a held cake box) */
  children?: ReactNode
}) {
  const instant = useInstant()
  const key = JSON.stringify(cfg) + withProps
  const skin = useMemo(() => {
    const s = buildSkin(cfg)
    if (!withProps) return s
    return {
      ...s,
      hairFront: (
        <>
          {s.hairFront}
          {CAP}
        </>
      ),
      top: (
        <>
          {s.top}
          {APRON}
        </>
      ),
    }
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps
  const c = useCharacter({ clock: 'manual', seed })
  const { seek, setExpression, play, say: speak } = c
  useEffect(() => {
    seek(0)
    setExpression(expression, intensity)
    if (gesture) play(gesture, { side, amplitude, variation: 0 })
    if (say) speak(say)
    if (instant) {
      seek(at)
      return
    }
    /* play up to the held frame once, then stop there */
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const t = Math.min(at, (now - t0) / 1000)
      seek(t)
      if (t < at) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const w = (crop.x1 - crop.x0) * scale
  const h = (crop.y1 - crop.y0) * scale
  return (
    <div className="relative shrink-0 overflow-hidden" style={{ width: w, height: h, transform: flip ? 'scaleX(-1)' : undefined }}>
      <div className="absolute" style={{ left: -crop.x0 * scale, top: -crop.y0 * scale }}>
        <Character pose={c.pose} skin={skin} width={400 * scale} />
      </div>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ idling */


/**
 * A hand drift: the arms stay in the lab's rest pose (shoulder 8, elbow 6,
 * wrist 0) and wander a degree or two around it, on smooth in-out keys,
 * starting and ending at rest so the loop has no seam. Each side and each
 * person gets its own period and phase, so no two hands move together. The
 * elbow stays between 4 and 9 degrees: it only ever bends the way an elbow
 * bends, and never straightens past straight.
 */
function handDrift(seed: number): Action {
  const r = (n: number) => {
    const x = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453
    return x - Math.floor(x)
  }
  const D = 6 + r(1) * 2 /* one pass, 6 to 8 s */
  const wave = (rest: number, amp: number, phase: number): Key[] => {
    const a = amp * (0.7 + 0.3 * r(phase))
    const p = 0.2 + 0.15 * r(phase + 1)
    return [
      [0, rest],
      [D * p, rest + a, 'inOut'],
      [D * (p + 0.3), rest - a * 0.6, 'inOut'],
      [D * (p + 0.55), rest + a * 0.4, 'inOut'],
      [D, rest, 'inOut'],
    ]
  }
  return {
    name: 'handDrift',
    duration: D,
    loop: true,
    blendIn: 0.6,
    tracks: {
      shoulderL: wave(8, 1.6, 2),
      elbowL: wave(6, 2.2, 4),
      wristL: wave(0, 3, 6),
      shoulderR: wave(8, 1.6, 8),
      elbowR: wave(6, 2.2, 10),
      wristR: wave(0, 3, 12),
    },
  }
}

/**
 * One person holding ONE base pose (the lab's rest pose and one expression)
 * for as long as the slide is up, alive with the lab's own idle layer:
 * breathing, blinks, eye movement and a slow weight-shift sway, at a gentle
 * liveliness, plus the hand drift above. No gesture, no pose change; the
 * lab's life layer keeps every joint on its springs, so nothing jumps.
 * User, 2026-10-07, slide 4's birthday-scene characters only.
 */
export function Idling({ cfg, expression = 'happy', scale, crop = HALF, seed = 3 }: { cfg: CharacterConfig; expression?: string; scale: number; crop?: Crop; seed?: number }) {
  const skin = useMemo(() => buildSkin(cfg), [JSON.stringify(cfg)]) // eslint-disable-line react-hooks/exhaustive-deps
  const c = useCharacter({ id: `scene-${cfg.name}`, clock: 'auto', seed, idle: { breath: true, blink: true, saccades: true, sway: true, liveliness: 0.7 } })
  const { setExpression, play } = c
  useEffect(() => {
    setExpression(expression)
    play(handDrift(seed), { variation: 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const w = (crop.x1 - crop.x0) * scale
  const h = (crop.y1 - crop.y0) * scale
  return (
    <div className="relative shrink-0 overflow-hidden" style={{ width: w, height: h }}>
      <div className="absolute" style={{ left: -crop.x0 * scale, top: -crop.y0 * scale }}>
        <Character pose={c.pose} skin={skin} width={400 * scale} />
      </div>
    </div>
  )
}
