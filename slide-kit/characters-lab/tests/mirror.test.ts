import { describe, expect, it } from 'vitest'
import { ACTIONS } from '@/actions'
import { both, mirror, retime, scaleAction } from '@/rig/track'
import { defaultPose } from '@/rig/channels'
import { sampleAction } from '@/rig/track'

describe('runtime options on an action', () => {
  it('mirror moves the wave to the other arm and flips the tilt', () => {
    const w = ACTIONS.wave
    expect(w.tracks.elbowR, 'wave is right-handed').toBeTruthy()
    const m = mirror(w)
    expect(m.tracks.elbowL).toEqual(w.tracks.elbowR)
    expect(m.tracks.elbowR).toBeUndefined()
    if (w.tracks.headTilt) {
      const a = sampleAction(w, 0.6).headTilt!
      const b = sampleAction(m, 0.6).headTilt!
      expect(b).toBeCloseTo(-a, 6)
    }
  })
  it('both puts the gesture on both arms', () => {
    const b = both(ACTIONS.wave)
    expect(b.tracks.elbowL).toBeTruthy()
    expect(b.tracks.elbowR).toBeTruthy()
  })
  it('retime scales duration and keys together', () => {
    const slow = retime(ACTIONS.nod, 2)
    expect(slow.duration).toBeCloseTo(ACTIONS.nod.duration * 2)
    expect(sampleAction(slow, 0.8).headNod).toBeCloseTo(sampleAction(ACTIONS.nod, 0.4).headNod!, 6)
  })
  it('amplitude scales the departure from rest', () => {
    const rest = defaultPose()
    const half = scaleAction(ACTIONS.wave, 0.5, rest)
    const t = ACTIONS.wave.duration * 0.5
    const full = sampleAction(ACTIONS.wave, t).shoulderR! - rest.shoulderR
    const h = sampleAction(half, t).shoulderR! - rest.shoulderR
    expect(h).toBeCloseTo(full / 2, 6)
  })
})
