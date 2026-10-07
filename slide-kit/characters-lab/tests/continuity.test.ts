import { describe, expect, it } from 'vitest'
import { ACTIONS, EXPRESSIONS } from '@/actions'
import type { Channel } from '@/rig/channels'
import { sample, series, ANGLES, BLINKS, SNAP_OK } from './helpers'

/* Per-frame caps at 60 fps. A sharp point peaks near 780 deg/s at the
   shoulder, which is 13 deg a frame; a mouth closes in 50 ms, 0.2 a
   frame; a saccade is the fastest thing a body does and gets 0.3; a blink
   closing in 90 ms spreads over five frames, so 0.5 is already generous. */
function cap(ch: Channel): number {
  if (BLINKS.includes(ch)) return 0.5
  if (ANGLES.includes(ch)) return 13
  /* a jump leaves the ground at about 850 px/s in this viewBox, 14 a frame */
  if (ch === 'bodyY') return 14
  if (ch === 'bodyX') return 6
  if (ch === 'headY' || ch === 'twist') return 3
  if (ch === 'headTurn' || ch === 'headNod') return 0.16
  if (ch === 'lookX' || ch === 'lookY') return 0.3
  if (ch === 'kneeL' || ch === 'kneeR') return 0.25
  if (ch === 'breathe') return 0.2
  if (ch.startsWith('mouth') || ch === 'pucker' || ch === 'smile') return 0.2
  if (ch.startsWith('f') || ch.startsWith('t') || ch.startsWith('spread') || ch.startsWith('palm')) return 0.15
  return 0.12
}

describe('nothing pops: per-frame change stays under the cap', () => {
  const all = { ...ACTIONS, ...EXPRESSIONS }
  for (const [name, action] of Object.entries(all)) {
    it(name, () => {
      const table = sample(action, 60, action.loop ? action.duration : 0)
      for (const ch of Object.keys(action.tracks) as Channel[]) {
        if (SNAP_OK.includes(ch)) continue
        const v = series(table, ch)
        let worst = 0, at = 0
        for (let i = 1; i < v.length; i++) {
          const d = Math.abs(v[i] - v[i - 1])
          if (d > worst) { worst = d; at = table.t[i] }
        }
        expect(worst, `${name}.${ch} jumps ${worst.toFixed(3)} at t=${at.toFixed(3)}`).toBeLessThanOrEqual(cap(ch))
      }
    })
  }
})
