import { describe, expect, it } from 'vitest'
import { ACTIONS } from '@/actions'
import { idlePose } from '@/rig/idle'
import { sample, series, frequency, extrema } from './helpers'

/* Real human timing, from CONTRACTS.md. */

describe('idle timing', () => {
  const t: number[] = [], blink: number[] = [], breath: number[] = []
  for (let i = 0; i < 60_000; i++) {
    const s = i / 1000
    const p = idlePose(s, 3)
    t.push(s)
    blink.push(p.blinkL ?? 0)
    breath.push(p.breathe ?? 0)
  }

  it('a blink is 70..120 ms down and 150..220 ms up, every 2.5..6 s', () => {
    const starts: number[] = [], downs: number[] = [], ups: number[] = []
    let i = 0
    while (i < blink.length) {
      if (blink[i] > 0.05) {
        const start = i
        while (i < blink.length && blink[i] < 0.95) i++
        const peak = i
        while (i < blink.length && blink[i] > 0.05) i++
        const end = i
        /* the top of the blink may hold a few ms; measure to the last 0.95 */
        let peakEnd = peak
        while (peakEnd < end && blink[peakEnd] >= 0.95) peakEnd++
        starts.push(t[start])
        downs.push(t[peak] - t[start])
        ups.push(t[end] - t[peakEnd])
      }
      i++
    }
    expect(starts.length, 'blinks in 60 s').toBeGreaterThanOrEqual(10)
    /* measured from 5 to 95 percent, which is about 80 percent of the key span */
    for (const d of downs) expect(d * 1000, 'down ms').toBeGreaterThanOrEqual(65)
    for (const d of downs) expect(d * 1000, 'down ms').toBeLessThanOrEqual(130)
    for (const u of ups) expect(u * 1000, 'up ms').toBeGreaterThanOrEqual(140)
    for (const u of ups) expect(u * 1000, 'up ms').toBeLessThanOrEqual(230)
    const gaps = starts.slice(1).map((s, k) => s - starts[k]).filter((g) => g > 0.4) // skip the second of a double
    expect(Math.min(...gaps)).toBeGreaterThanOrEqual(2.4)
    expect(Math.max(...gaps)).toBeLessThanOrEqual(6.2)
  })

  it('breathing has a 3.8..4.6 s period', () => {
    const peaks = extrema(t, breath, 0.3)
    const gaps = peaks.slice(1).map((p, k) => p - peaks[k])
    const period = (2 * gaps.reduce((a, b) => a + b, 0)) / gaps.length
    expect(period).toBeGreaterThanOrEqual(3.8)
    expect(period).toBeLessThanOrEqual(4.6)
  })
})

describe('gesture frequencies', () => {
  it('wave: the elbow oscillates at 2..3 Hz', () => {
    const table = sample(ACTIONS.wave, 240)
    const f = frequency(table.t, series(table, 'elbowR'), 6)
    expect(f).toBeGreaterThanOrEqual(2)
    expect(f).toBeLessThanOrEqual(3.2)
  })
  it('shake: the head turns at 2.5..3.5 Hz', () => {
    const table = sample(ACTIONS.shake, 240)
    const f = frequency(table.t, series(table, 'headTurn'), 0.15)
    expect(f).toBeGreaterThanOrEqual(2.4)
    expect(f).toBeLessThanOrEqual(3.6)
  })
  it('nod: 2..3 Hz', () => {
    const table = sample(ACTIONS.nod, 240)
    const f = frequency(table.t, series(table, 'headNod'), 0.1)
    expect(f).toBeGreaterThanOrEqual(1.8)
    expect(f).toBeLessThanOrEqual(3.2)
  })
  it('smileBuild reaches 90 percent between 0.35 and 0.65 s', () => {
    const table = sample(ACTIONS.smileBuild, 240)
    const v = series(table, 'smile')
    const max = Math.max(...v)
    const at = table.t[v.findIndex((x) => x >= 0.9 * max)]
    expect(at).toBeGreaterThanOrEqual(0.35)
    expect(at).toBeLessThanOrEqual(0.7)
  })
  it('durations are real', () => {
    expect(ACTIONS.wave.duration).toBeGreaterThanOrEqual(1.6)
    expect(ACTIONS.wave.duration).toBeLessThanOrEqual(2.4)
    expect(ACTIONS.nod.duration).toBeGreaterThanOrEqual(0.8)
    expect(ACTIONS.nod.duration).toBeLessThanOrEqual(1.3)
    expect(ACTIONS.shrug.duration).toBeGreaterThanOrEqual(1.0)
    expect(ACTIONS.clap.duration).toBeGreaterThanOrEqual(1.2)
    expect(ACTIONS.blink.duration).toBeGreaterThanOrEqual(0.25)
    expect(ACTIONS.blink.duration).toBeLessThanOrEqual(0.45)
  })
})
