/* The user's directive: the motion must not be mechanical. These hold the
   life layer to its contract without looking at a picture. */
import { describe, expect, it } from 'vitest'
import { ACTIONS, EXPRESSIONS } from '@/actions'
import { composeAt, poseAt, type Timeline } from '@/rig/compose'
import { CHANNEL_NAMES, type Channel } from '@/rig/channels'
import type { Action } from '@/rig/track'

const base = (seed = 3, extra: Partial<Timeline> = {}): Timeline => ({ seed, idle: {}, ...extra })

const ANGLES: Channel[] = ['shoulderL', 'shoulderR', 'elbowL', 'elbowR', 'wristL', 'wristR', 'headTilt', 'lean']

describe('life layer', () => {
  it('is still deterministic, forwards, backwards and on a fresh timeline', () => {
    const a = base(5, { gesture: { action: ACTIONS.wave, start: 0.3 } })
    const p1 = poseAt(a, 1.1)
    const p2 = poseAt(a, 2.0)
    const p3 = poseAt(a, 1.1) // a seek backwards restarts the springs
    expect(p3).toEqual(p1)
    const b = base(5, { gesture: { action: ACTIONS.wave, start: 0.3 } })
    expect(poseAt(b, 2.0)).toEqual(p2)
  })

  it('adds no pops: per-frame change at 60 fps stays under the raw caps', () => {
    for (const name of ['wave', 'nod', 'shake', 'shrug', 'jumpJoy', 'clap', 'point']) {
      const tl = base(2, { gesture: { action: ACTIONS[name], start: 0.2 } })
      let prev = poseAt(tl, 0)
      for (let i = 1; i <= 60 * (ACTIONS[name].duration + 0.8); i++) {
        const cur = poseAt(tl, i / 60)
        for (const ch of CHANNEL_NAMES) {
          if (/^blink/.test(ch)) continue
          const d = Math.abs(cur[ch] - prev[ch])
          const cap = ANGLES.includes(ch) ? 13 : ch === 'bodyY' ? 14 : /^(bodyX|headY|twist)$/.test(ch) ? 6 : /^(headTurn|headNod)$/.test(ch) ? 0.16 : /^look/.test(ch) ? 0.3 : /^(mouth|pucker|smile)/.test(ch) ? 0.2 : /^(f[LR]\d|t[LR]|spread|palm)/.test(ch) ? 0.15 : 0.3
          expect(d, `${name}.${ch} jumps ${d.toFixed(3)} at ${(i / 60).toFixed(2)}`).toBeLessThanOrEqual(cap)
        }
        prev = cur
      }
    }
  })

  it('a held pose still moves', () => {
    /* an expression and no gesture: the keyframes are flat, life is not */
    const tl = base(7, { expression: { action: EXPRESSIONS.happy, start: 0 }, idle: { breath: false, blink: false, saccades: false, sway: false } })
    let moved = 0
    let prev = poseAt(tl, 3)
    for (let i = 1; i <= 60; i++) {
      const cur = poseAt(tl, 3 + i / 60)
      moved += Math.abs(cur.shoulderR - prev.shoulderR) + Math.abs(cur.headTilt - prev.headTilt) + Math.abs(cur.bodyX - prev.bodyX)
      prev = cur
    }
    expect(moved).toBeGreaterThanOrEqual(0.3)
  })

  it('a stopped arm overshoots a little and settles within 300 ms', () => {
    /* a step: the shoulder goes from rest to 60 and holds */
    const step: Action = { name: 'step', duration: 3, blendIn: 0, blendOut: 0, tracks: { shoulderR: [[0, 8], [0.25, 60, 'out'], [3, 60]] } }
    const tl = base(1, { gesture: { action: step, start: 0 }, idle: { breath: false, blink: false, saccades: false, sway: false }, life: { drift: 0, balance: 0 } })
    let peak = 0
    for (let i = 0; i <= 120; i++) peak = Math.max(peak, poseAt(tl, i / 240).shoulderR)
    expect(peak).toBeGreaterThan(60.3)
    expect(peak).toBeLessThan(62.5)
    const late = poseAt(tl, 0.25 + 0.3).shoulderR
    expect(Math.abs(late - 60)).toBeLessThan(0.6)
  })

  it('the hand trails the elbow trails the shoulder', () => {
    const step: Action = { name: 'reach', duration: 2, blendIn: 0, blendOut: 0, tracks: { shoulderR: [[0, 8], [0.3, 70, 'inOut'], [2, 70]], elbowR: [[0, 6], [0.3, -60, 'inOut'], [2, -60]], fR1: [[0, 0.25], [0.3, 0, 'inOut'], [2, 0]] } }
    const tl = base(1, { gesture: { action: step, start: 0 }, idle: { breath: false, blink: false, saccades: false, sway: false }, life: { drift: 0, balance: 0 } })
    const half = (ch: Channel, from: number, to: number) => {
      for (let i = 0; i <= 240; i++) {
        const v = poseAt(tl, i / 240)[ch]
        if ((v - from) / (to - from) >= 0.5) return i / 240
      }
      return 1
    }
    const tS = half('shoulderR', 8, 70), tE = half('elbowR', 6, -60), tF = half('fR1', 0.25, 0)
    expect(tS).toBeLessThan(tE)
    expect(tE).toBeLessThan(tF)
  })

  it('hair swings after a head turn and settles', () => {
    const tl = base(1, { gesture: { action: ACTIONS.turnLeft, start: 0.1 }, idle: { breath: false, blink: false, saccades: false, sway: false } })
    let peak = 0
    for (let i = 0; i <= 120; i++) peak = Math.max(peak, Math.abs(poseAt(tl, i / 60).hairSway))
    expect(peak).toBeGreaterThan(0.03)
    expect(Math.abs(poseAt(tl, 6).hairSway)).toBeLessThan(0.01)
  })

  it('life: 0 is the bare keyframes', () => {
    const tl = base(4, { gesture: { action: ACTIONS.wave, start: 0 }, life: 0 })
    expect(poseAt(tl, 0.7)).toEqual(composeAt(tl, 0.7))
  })

  it('two plays of the same gesture differ', async () => {
    /* through prepare's seeded wobble: the hook is React, so test the pieces it uses */
    const { retime, scaleAction } = await import('@/rig/track')
    const { defaultPose } = await import('@/rig/channels')
    const a = scaleAction(retime(ACTIONS.wave, 1 / 1.03), 1.04, defaultPose())
    const b = scaleAction(retime(ACTIONS.wave, 1 / 0.98), 0.95, defaultPose())
    expect(a.duration).not.toBeCloseTo(b.duration, 3)
  })
})
