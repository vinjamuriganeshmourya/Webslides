import { describe, expect, it } from 'vitest'
import { ACTIONS } from '@/actions'
import type { Channel } from '@/rig/channels'
import { sampleAction } from '@/rig/track'
import { REST, ANGLES, PIXELS } from './helpers'

/* The blend-out covers a small residue on a face channel (a smile left at
   0.3 fades in 250 ms), so the end is looser than the start. An arm left
   up is not a residue. */
function tolerance(ch: Channel, end: boolean): number {
  if (ANGLES.includes(ch)) return 4
  if (PIXELS.includes(ch)) return 2
  return end ? 0.25 : 0.1
}

describe('a one-shot starts from rest and returns to it', () => {
  for (const [name, action] of Object.entries(ACTIONS)) {
    if (action.loop) continue
    it(name, () => {
      const first = sampleAction(action, 0)
      const last = sampleAction(action, action.duration)
      for (const ch of Object.keys(action.tracks) as Channel[]) {
        expect(Math.abs(first[ch]! - REST[ch]), `${name}.${ch} starts at ${first[ch]} not ${REST[ch]}`).toBeLessThanOrEqual(tolerance(ch, false))
        expect(Math.abs(last[ch]! - REST[ch]), `${name}.${ch} ends at ${last[ch]} not ${REST[ch]}`).toBeLessThanOrEqual(tolerance(ch, true))
      }
    })
  }
})
