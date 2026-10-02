/* The user's directive: mind the finger position and movement. */
import { describe, expect, it } from 'vitest'
import { ACTIONS } from '@/actions'
import { HAND_POSES, handKeys, handPoseOf, type HandPose } from '@/actions/handPoses'
import type { Channel } from '@/rig/channels'
import { defaultPose } from '@/rig/channels'
import { sampleKeys } from '@/rig/track'
import { sample, series } from './helpers'

const FINGERS: (keyof HandPose)[] = ['f1', 'f2', 'f3', 'f4', 'thumb', 'spread', 'palm']

function usesHand(name: string, side: 'L' | 'R'): boolean {
  return Object.keys(ACTIONS[name].tracks).some((c) => c === `f${side}1`)
}

/* The longest stretch where no finger channel moves is the hold. */
function holdTime(name: string, side: 'L' | 'R'): number {
  const table = sample(ACTIONS[name], 60)
  const chans = [`f${side}1`, `f${side}2`, `f${side}3`, `f${side}4`, `t${side}`] as Channel[]
  let best = 0, bestAt = 0, run = 0
  for (let i = 1; i < table.t.length; i++) {
    const still = chans.every((c) => Math.abs((table.rows[i][c] ?? 0) - (table.rows[i - 1][c] ?? 0)) < 0.003)
    run = still ? run + 1 : 0
    if (run > best) { best = run; bestAt = table.t[i] - (run / 60) / 2 }
  }
  return bestAt
}

function distance(a: HandPose, b: HandPose): number {
  return Math.max(...FINGERS.map((f) => Math.abs(a[f] - b[f])))
}

describe('finger position: a named shape at every hold', () => {
  for (const name of Object.keys(ACTIONS)) {
    for (const side of ['L', 'R'] as const) {
      if (!usesHand(name, side)) continue
      it(`${name} ${side}`, () => {
        const t = holdTime(name, side)
        const row = { ...defaultPose(), ...sample(ACTIONS[name], 60).rows[Math.round(t * 60)] }
        const hand = handPoseOf(row, side)
        const nearest = Object.entries(HAND_POSES).map(([n, p]) => [n, distance(hand, p)] as const).sort((a, b) => a[1] - b[1])[0]
        expect(nearest[1], `${name} ${side} at ${t.toFixed(2)} s is ${JSON.stringify(hand)}, nearest ${nearest[0]}`).toBeLessThanOrEqual(0.12)
      })
    }
  }
})

describe('finger movement', () => {
  it('no finger moves more than 0.1 a frame, no palm more than 0.08', () => {
    for (const [name, action] of Object.entries(ACTIONS)) {
      const table = sample(action, 60)
      for (const ch of Object.keys(action.tracks) as Channel[]) {
        const isFinger = /^(f[LR]\d|t[LR])$/.test(ch)
        const isPalm = /^(palm|spread)/.test(ch)
        if (!isFinger && !isPalm) continue
        const v = series(table, ch)
        for (let i = 1; i < v.length; i++) {
          expect(Math.abs(v[i] - v[i - 1]), `${name}.${ch} at ${table.t[i].toFixed(3)}`).toBeLessThanOrEqual(isFinger ? 0.1 : 0.08)
        }
      }
    }
  })
  it('a closing hand curls pinky first, an opening hand releases index first', () => {
    const close = handKeys('R', HAND_POSES.fist, 1, 'out', HAND_POSES.open)
    const arrive = (tracks: ReturnType<typeof handKeys>, ch: Channel) => tracks[ch]![tracks[ch]!.length - 1][0]
    expect(arrive(close, 'fR4')).toBeLessThan(arrive(close, 'fR3'))
    expect(arrive(close, 'fR3')).toBeLessThan(arrive(close, 'fR2'))
    expect(arrive(close, 'fR2')).toBeLessThan(arrive(close, 'fR1'))
    const open = handKeys('R', HAND_POSES.open, 1, 'out', HAND_POSES.fist)
    expect(arrive(open, 'fR1')).toBeLessThan(arrive(open, 'fR2'))
    expect(arrive(open, 'fR4')).toBeGreaterThan(arrive(open, 'fR3'))
    /* the thumb settles after the fingers */
    expect(arrive(close, 'tR')).toBeGreaterThan(arrive(close, 'fR1'))
  })
  it('curling takes 120 to 200 ms', () => {
    const tracks = handKeys('R', HAND_POSES.fist, 1, 'out', HAND_POSES.open)
    const keys = tracks.fR2!
    const t0 = keys[0][0], t1 = keys[keys.length - 1][0]
    const dur = t1 - t0
    expect(dur).toBeGreaterThanOrEqual(0.12)
    expect(dur).toBeLessThanOrEqual(0.2)
    expect(sampleKeys(keys, t0)).toBe(HAND_POSES.open.f2)
  })
  it('a thumb never pokes out of a fist', () => {
    for (const name of ['fistPump', 'thumbsUp', 'thumbsDown']) {
      const action = ACTIONS[name]
      if (!action) continue
      const t = holdTime(name, 'R')
      const row = { ...defaultPose(), ...sample(action, 60).rows[Math.round(t * 60)] }
      const hand = handPoseOf(row, 'R')
      const fist = hand.f1 > 0.8 && hand.f2 > 0.8 && hand.f3 > 0.8 && hand.f4 > 0.8
      expect(fist, `${name}: fingers are not fully curled at the hold`).toBe(true)
      if (name === 'fistPump') expect(hand.thumb, 'fistPump: the thumb lies across the fingers').toBeGreaterThanOrEqual(0.8)
      else expect(hand.thumb, `${name}: the thumb is out`).toBeLessThanOrEqual(0.1)
    }
  })
})
