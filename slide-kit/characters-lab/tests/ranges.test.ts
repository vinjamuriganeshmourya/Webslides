import { describe, expect, it } from 'vitest'
import { ACTIONS, EXPRESSIONS } from '@/actions'
import type { Channel } from '@/rig/channels'
import { sample, series, ANGLES, PIXELS, SIGNED, UNIT } from './helpers'

/* Shoulder goes negative when the arm crosses the body (a facepalm), the
   pupil dilates past 1 on a surprise, and a sigh drops the chest below rest. */
const LIMITS: Partial<Record<Channel, [number, number]>> = {
  shoulderL: [-45, 190], shoulderR: [-45, 190],
  /* a wave folds the forearm up beside the head, which is a negative elbow */
  elbowL: [-150, 165], elbowR: [-150, 165],
  wristL: [-90, 90], wristR: [-90, 90],
  headTilt: [-30, 30], lean: [-25, 25],
  bodyY: [-80, 10], bodyX: [-30, 30], headY: [-20, 20], twist: [-30, 30],
  bodyScale: [0.9, 1.1], pupil: [0.5, 1.6], breathe: [-0.3, 1],
}

function limits(ch: Channel): [number, number] {
  if (LIMITS[ch]) return LIMITS[ch]!
  if (SIGNED.includes(ch)) return [-1, 1]
  if (ANGLES.includes(ch) || PIXELS.includes(ch)) return [-180, 180]
  if (UNIT.includes(ch)) return [0, 1]
  return [-Infinity, Infinity]
}

describe('every channel stays in its range', () => {
  const all = { ...ACTIONS, ...EXPRESSIONS }
  for (const [name, action] of Object.entries(all)) {
    it(name, () => {
      const table = sample(action, 240 / action.duration > 60 ? 60 : 60)
      for (const ch of Object.keys(action.tracks) as Channel[]) {
        const [lo, hi] = limits(ch)
        const v = series(table, ch)
        const min = Math.min(...v), max = Math.max(...v)
        expect(min, `${name}.${ch} min`).toBeGreaterThanOrEqual(lo - 1e-6)
        expect(max, `${name}.${ch} max`).toBeLessThanOrEqual(hi + 1e-6)
      }
    })
  }
})
