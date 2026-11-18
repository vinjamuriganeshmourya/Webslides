/* The shoulder joint, shared by the arm (Arm.tsx) and the torso (Body.tsx).
 *
 * Added 2026-11-17, after the true-3D character (slide-kit/assets/char3d): the
 * arm used to turn on a fixed pin over a torso whose shoulder never changed, so
 * a raised arm sat ON TOP of a shoulder that stayed put and read as stuck on.
 * The 3D rig gets a natural shoulder from its collarbone and its helper bones;
 * in 2D the same two effects are:
 *
 *  - the girdle: as the arm rises past the horizontal, the joint rises and draws
 *    in toward the neck, as the collarbone lifts the real shoulder;
 *  - the web: the torso's own side runs on up the arm's outer edge through a
 *    soft armpit, swelling just past the shoulder's resting bulge, so the bulge
 *    under a raised arm becomes part of a smooth line from waist to elbow.
 *
 * The web is drawn by the TORSO, inside its filter group, so in the clay look the
 * torso and the web are one form with one rim; the arm is drawn on top of it as
 * before. Everything here is 0 at rest: an arm that hangs looks exactly as it did.
 * Joint angles are never changed: the elbow and the hand land where they did. */

export const GIRDLE = { up: 7, in: 2.5 } // px the joint rises and draws in at the top of a raise
const WEB = { side: [-8, 33] as const, reach: 38, round: 15 } // the torso's side under the joint (joint frame), how far up the arm the armpit reaches, how far out its curve swells
const ARM_HALF = 15 // half the upper arm's width

const RAD = Math.PI / 180
const sstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const f = (n: number) => Math.round(n * 100) / 100

/** How far the girdle has risen, 0 (arm below the horizontal) to 1 (arm straight up). */
export const girdleLift = (shoulder: number) => sstep(50, 165, shoulder)

/** The joint in the arm's own frame (the left arm; the right is mirrored about x=200): x, y. */
export function shoulderJoint(shoulderHalf: number, shoulderY: number, shoulder: number): [number, number] {
  const lift = girdleLift(shoulder)
  return [200 - (shoulderHalf - 6) + lift * GIRDLE.in, shoulderY - lift * GIRDLE.up]
}

/** The upper arm's round end, in the shoulder's ROTATED frame (the bone runs down +y to the
    elbow). At rest it sits `down` px along the bone, so it meets the shoulder slope as a
    deltoid. As the arm swings out toward the horizontal it sinks into the shoulder instead of
    swinging out with the bone, so the top of the arm runs on from the slope of the shoulder
    rather than rising above it in a knob; past the horizontal it comes up to the joint with the
    girdle, where the torso's own copy of the arm takes over. */
export function armRoot(shoulder: number, down: number): [number, number] {
  const r = shoulder * RAD
  const bone: [number, number] = [0, down] // along the bone
  const sunk: [number, number] = [Math.sin(r) * 10, Math.cos(r) * 10] // 10 px straight down the body, seen in the rotated frame
  const s = sstep(10, 55, shoulder), k = 1 - girdleLift(shoulder)
  return [(bone[0] * (1 - s) + sunk[0] * s) * k, (bone[1] * (1 - s) + sunk[1] * s) * k]
}

/** The armpit web, in the joint's unrotated frame (+x toward the body), or '' at rest. */
export function webPath(shoulder: number): string {
  const lift = girdleLift(shoulder)
  if (lift < 0.01) return ''
  const d = [-Math.sin(shoulder * RAD), Math.cos(shoulder * RAD)]
  const out = [Math.cos(shoulder * RAD), Math.sin(shoulder * RAD)] // the arm's outer (under) side
  const k = (x: number, y: number) => `${f(x * lift)} ${f(y * lift)}`
  const [tx, ty] = WEB.side
  return [
    `M${k(tx, ty)}`,
    `Q${k(out[0] * WEB.round, out[1] * WEB.round)} ${k(d[0] * WEB.reach + out[0] * ARM_HALF, d[1] * WEB.reach + out[1] * ARM_HALF)}`,
    `L${k(d[0] * WEB.reach, d[1] * WEB.reach)}`,
    'L0 0',
    `L${k(tx + 20, ty)}`,
    'Z',
  ].join(' ')
}
