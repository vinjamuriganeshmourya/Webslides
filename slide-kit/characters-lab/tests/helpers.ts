/* Shared sampling for the tests: an action becomes a table of numbers at a
 * fixed rate, and the tests read the table. */
import { CHANNEL_NAMES, defaultPose, type Channel, type Pose } from '@/rig/channels'
import { sampleAction, type Action } from '@/rig/track'

export const REST = defaultPose()

/** Channel classes, so a test can pick the right tolerance. */
export const ANGLES: Channel[] = ['shoulderL', 'shoulderR', 'elbowL', 'elbowR', 'wristL', 'wristR', 'headTilt', 'lean']
export const PIXELS: Channel[] = ['bodyY', 'bodyX', 'headY', 'twist']
export const BLINKS: Channel[] = ['blinkL', 'blinkR']
export const SNAP_OK: Channel[] = ['teeth', 'tongue', 'pupil']
export const SIGNED: Channel[] = ['headTurn', 'headNod', 'lookX', 'lookY', 'browL', 'browR', 'browInnerL', 'browInnerR', 'smile', 'mouthX', 'jawX', 'stance']
export const UNIT: Channel[] = CHANNEL_NAMES.filter(
  (c) => !ANGLES.includes(c) && !PIXELS.includes(c) && !SIGNED.includes(c) && c !== 'bodyScale',
)

export type Table = { t: number[]; rows: Partial<Pose>[] }

/** Sample an action at `fps` from 0 to its duration plus `tail` seconds. */
export function sample(action: Action, fps = 60, tail = 0): Table {
  const end = action.duration + tail
  const n = Math.floor(end * fps) + 1
  const t: number[] = []
  const rows: Partial<Pose>[] = []
  for (let i = 0; i < n; i++) {
    t.push(i / fps)
    rows.push(sampleAction(action, i / fps))
  }
  return { t, rows }
}

export function series(table: Table, ch: Channel): number[] {
  return table.rows.map((r) => r[ch] ?? REST[ch])
}

/** Times of local extrema with at least `prominence` of swing on either side. */
export function extrema(t: number[], v: number[], prominence: number): number[] {
  const out: number[] = []
  for (let i = 1; i < v.length - 1; i++) {
    const isMax = v[i] > v[i - 1] && v[i] >= v[i + 1]
    const isMin = v[i] < v[i - 1] && v[i] <= v[i + 1]
    if (!isMax && !isMin) continue
    /* prominence: the swing to the nearest extremum on each side */
    let left = i, right = i
    while (left > 0 && Math.abs(v[left] - v[i]) < prominence) left--
    while (right < v.length - 1 && Math.abs(v[right] - v[i]) < prominence) right++
    if (Math.abs(v[left] - v[i]) >= prominence && Math.abs(v[right] - v[i]) >= prominence) out.push(t[i])
  }
  return out
}

/** Dominant frequency from the spacing of extrema: a two-nod yes has only
    three, so every one counts. */
export function frequency(t: number[], v: number[], prominence: number): number {
  const ex = extrema(t, v, prominence)
  if (ex.length < 3) return 0
  const gaps: number[] = []
  for (let i = 1; i < ex.length; i++) gaps.push(ex[i] - ex[i - 1])
  if (gaps.length === 0) return 0
  const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length
  return 1 / (2 * mean)
}

/** Time of peak absolute speed of a channel inside [from, to]. */
export function peakSpeedTime(table: Table, ch: Channel, from: number, to: number): number {
  const v = series(table, ch)
  let best = -1, at = from
  for (let i = 1; i < v.length; i++) {
    if (table.t[i] < from || table.t[i] > to) continue
    const s = Math.abs(v[i] - v[i - 1])
    if (s > best) { best = s; at = table.t[i] }
  }
  return at
}

export function has(action: Action, ch: Channel): boolean {
  return Boolean(action.tracks[ch] && action.tracks[ch]!.length)
}
