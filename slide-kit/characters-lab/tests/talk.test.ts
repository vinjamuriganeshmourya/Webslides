import { describe, expect, it } from 'vitest'
import { sayDuration, talkAction, visemesFor } from '@/actions/talk'
import { sample, series } from './helpers'

describe('lip sync', () => {
  it('"mom" opens and closes on the m', () => {
    const v = visemesFor('mom').filter((x) => x.shape !== 'rest')
    expect(v[0].shape).toBe('M')
    expect(v[v.length - 1].shape).toBe('M')
    expect(v.some((x) => x.shape === 'O')).toBe(true)
  })
  it('no viseme is shorter than 50 ms', () => {
    for (const v of visemesFor('The quick brown fox jumps over the lazy dog, twice!')) expect(v.dur).toBeGreaterThanOrEqual(0.05)
  })
  it('a 30-word line at 150 wpm runs 10..15 s', () => {
    const line = Array.from({ length: 30 }, (_, i) => ['learning', 'python', 'is', 'simple', 'when', 'you'][i % 6]).join(' ')
    const d = sayDuration(line, 150)
    expect(d).toBeGreaterThanOrEqual(10)
    expect(d).toBeLessThanOrEqual(15)
  })
  it('a question lifts the brows at the end', () => {
    const a = talkAction('Shall we start?')
    const table = sample(a, 120)
    const brow = series(table, 'browL')
    const tail = brow.filter((_, i) => table.t[i] >= a.duration * 0.6)
    expect(Math.max(...tail)).toBeGreaterThanOrEqual(0.25)
  })
  it('the jaw never passes fully open and never snaps', () => {
    const a = talkAction('Hello everyone, welcome to the session on loops.')
    const table = sample(a, 60)
    const open = series(table, 'mouthOpen')
    expect(Math.max(...open)).toBeLessThanOrEqual(1)
    /* a jaw closing from a wide A to an M in 50 ms is 0.25 a frame at 60 fps */
    for (let i = 1; i < open.length; i++) expect(Math.abs(open[i] - open[i - 1])).toBeLessThanOrEqual(0.3)
  })
  it('talk is its own group and ends at rest', () => {
    const a = talkAction('Hi.')
    expect(a.group).toBe('talk')
    const end = sample(a, 60).rows.at(-1)!
    expect(end.mouthOpen ?? 0).toBeLessThanOrEqual(0.05)
  })
})
