import { describe, expect, it } from 'vitest'
import { ACTIONS } from '@/actions'
import type { Channel } from '@/rig/channels'
import { sample, series, peakSpeedTime, REST, has } from './helpers'

/* A joint never moves alone: the shoulder leads, the elbow follows, the
   wrist last. Measured on the reach phase, the first 40 percent of the clip. */
describe('overlapping action', () => {
  /* presentRight is forearm-led by design, a hand lifting before the sweep */
  for (const name of ['wave', 'point', 'raiseHand']) {
    it(`${name}: shoulder peaks before elbow before wrist`, () => {
      const action = ACTIONS[name]
      expect(action, `${name} exists`).toBeTruthy()
      const table = sample(action, 240)
      const to = action.duration * 0.4
      const sh = peakSpeedTime(table, 'shoulderR', 0, to)
      const el = peakSpeedTime(table, 'elbowR', 0, to)
      expect(sh, 'shoulder before elbow').toBeLessThanOrEqual(el)
      if (has(action, 'wristR')) {
        const wr = peakSpeedTime(table, 'wristR', 0, to)
        expect(el, 'elbow before wrist').toBeLessThanOrEqual(wr)
      }
    })
  }
})

/* The wind-up: in the first 250 ms the driving channel moves a little the
   other way before it goes. */
describe('anticipation', () => {
  const cases: [string, Channel, number][] = [
    ['wave', 'elbowR', 1],
    ['point', 'shoulderR', 1],
    ['fistPump', 'shoulderR', 1],
    ['jumpJoy', 'bodyY', 2],
  ]
  for (const [name, ch, eps] of cases) {
    it(`${name}: ${ch} winds up first`, () => {
      const action = ACTIONS[name]
      expect(action, `${name} exists`).toBeTruthy()
      const table = sample(action, 240)
      const v = series(table, ch).map((x) => x - REST[ch])
      let peak = 0
      for (const x of v) if (Math.abs(x) > Math.abs(peak)) peak = x
      const main = Math.sign(peak)
      const early = v.filter((_, i) => table.t[i] <= 0.25)
      const windup = Math.min(...early.map((x) => x * main))
      expect(windup, `expected a move against the main direction in the first 250 ms`).toBeLessThanOrEqual(-eps)
    })
  }
})
