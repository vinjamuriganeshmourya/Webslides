import { describe, expect, it } from 'vitest'
import { EXPRESSIONS } from '@/actions'
import { sampleAction } from '@/rig/track'

/* A perfectly symmetric face reads as a mask. Every expression but neutral
   carries a small difference between the two sides. */
describe('expressions are asymmetric', () => {
  for (const [name, action] of Object.entries(EXPRESSIONS)) {
    if (name === 'neutral') continue
    it(name, () => {
      const p = sampleAction(action, 0.5)
      const browDiff = Math.abs((p.browL ?? 0) - (p.browR ?? 0))
      const innerDiff = Math.abs((p.browInnerL ?? 0) - (p.browInnerR ?? 0))
      const mouthX = Math.abs(p.mouthX ?? 0)
      expect(Math.max(browDiff, innerDiff, mouthX), `${name} is symmetric`).toBeGreaterThanOrEqual(0.02)
    })
  }
})
