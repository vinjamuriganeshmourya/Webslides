import { useEffect, useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useDeck } from '@/deck/DeckContext'
import { StepControls } from './controls'
import { BeatCaption } from './common'
import { BigLine, ListBoxes, Show, type BoxState } from './pieces'
import { SONGS } from './Task1'

/**
 * FOLLOW THE SLICE. Spec card E1, the animated explainer.
 *
 * The six Road Trip songs with positions 0 to 5, three sliders (start, stop,
 * step), the expression built from them big at the top, and an empty result
 * row. Four runs, set by the presses; inside a run one cursor move per press:
 * a taken song drops into the result row, a skipped song greys out and stays
 * grey, the stop box is a wall the cursor bumps and does not take, past the
 * last box the slice just ends with no error. The last press lists all four
 * results.
 *
 * THE EVENTS ARE DERIVED, NEVER TYPED. `walk()` runs the slice the way Python
 * does, so the sliders may be live for the instructor between runs (the
 * spec's room-to-play line) and every run still follows the data: the four
 * spec runs come out of the same function and were checked against CPython
 * (plan, outputs table). It runs these four slices on this list only: no code
 * box, no other list (the spec's must-not line).
 */
const N = SONGS.length
const RUNS = [
  { start: 1, stop: 4, step: 1 },
  { start: 2, stop: 2, step: 1 },
  { start: 0, stop: 6, step: 2 },
  { start: 4, stop: 10, step: 1 },
]

type Ev = { i: number; do: 'take' | 'wall' | 'end'; got: string[] }

export function walk(start: number, stop: number, step: number): Ev[] {
  const evs: Ev[] = []
  const got: string[] = []
  let i = start
  for (let guard = 0; guard < 20; guard++) {
    if (i >= stop && stop <= N) {
      evs.push({ i, do: 'wall', got: [...got] })
      break
    }
    if (i >= N) {
      evs.push({ i, do: 'end', got: [...got] })
      break
    }
    got.push(SONGS[i])
    evs.push({ i, do: 'take', got: [...got] })
    i += step
  }
  return evs
}

export const expr = (r: { start: number; stop: number; step: number }) => `road_trip[${r.start}:${r.stop}${r.step !== 1 ? `:${r.step}` : ''}]`
export const result = (got: string[]) => (got.length ? `[${got.map((g) => `'${g}'`).join(', ')}]` : '[]')

/* beat → phase */
type Phase = { kind: 'intro' } | { kind: 'set'; run: number } | { kind: 'ev'; run: number; k: number } | { kind: 'all' }
const MAP: Phase[] = [{ kind: 'intro' }]
RUNS.forEach((r, ri) => {
  MAP.push({ kind: 'set', run: ri })
  walk(r.start, r.stop, r.step).forEach((_, k) => MAP.push({ kind: 'ev', run: ri, k }))
})
MAP.push({ kind: 'all' })
export const WALKER_BEATS = MAP.length /* 18 */

function caption(ev: Ev, step: number): ReactNode[] {
  if (ev.do === 'take') return step > 1 ? [`Position ${ev.i}: take ${SONGS[ev.i]}`, `Jump ${step}`] : [`Position ${ev.i}: take ${SONGS[ev.i]}`]
  if (ev.do === 'wall') return [`Position ${ev.i} is the stop`, 'Python stops before it']
  return [`Position ${ev.i} is past the last song`, 'The slice just ends', 'No error']
}

function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <label className="flex items-center gap-3">
      <span className="w-[44px] text-[16px] font-bold" style={{ color: colors.body }}>
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        /* the deck's arrow keys stay the deck's: the slider is a mouse control */
        onKeyDown={(e) => e.currentTarget.blur()}
        className="w-[210px]"
        style={{ accentColor: colors.brand }}
      />
      <span className="w-[28px] text-right font-mono text-[18px] font-bold" style={{ color: colors.brandDark }}>
        {value}
      </span>
    </label>
  )
}

export function SliceWalker() {
  const beat = useBeats(WALKER_BEATS)
  const deck = useDeck()
  const tween = useTween(420)
  const phase = MAP[Math.min(beat, WALKER_BEATS) - 1]
  const run = phase.kind === 'set' || phase.kind === 'ev' ? phase.run : phase.kind === 'all' ? RUNS.length - 1 : 0
  /* the instructor may move a slider between runs; the run then restarts at its set press */
  const [over, setOver] = useState<Record<number, { start: number; stop: number; step: number }>>({})
  useEffect(() => setOver({}), [])
  const cur = over[run] ?? RUNS[run]
  const evs = walk(cur.start, cur.stop, cur.step)
  const k = phase.kind === 'ev' ? Math.min(phase.k, evs.length - 1) : phase.kind === 'all' ? evs.length - 1 : -1
  const ev = k >= 0 ? evs[k] : null
  const setBeat = MAP.findIndex((p) => p.kind === 'set' && p.run === run) + 1
  const change = (patch: Partial<typeof cur>) => {
    setOver((o) => ({ ...o, [run]: { ...cur, ...patch } }))
    for (let b = beat; b > setBeat; b--) deck.prev()
  }

  /* box states: taken, the cursor's box, grey for skipped and never reached */
  const states: Record<number, BoxState> = {}
  const ghost: Record<number, BoxState> = {}
  if (ev) {
    const taken = new Set<number>()
    evs.slice(0, k + 1).forEach((e) => e.do === 'take' && taken.add(e.i))
    for (let p = 0; p < N; p++) {
      if (taken.has(p)) states[p] = 'hit'
      else if (p < cur.start) states[p] = 'grey'
      else if (p < ev.i) states[p] = 'grey'
      else if (ev.do !== 'take') states[p] = 'grey'
    }
    if (ev.do === 'take') states[ev.i] = 'now'
    if (ev.do === 'wall' && ev.i < N) states[ev.i] = 'wall'
    if (ev.do === 'wall' && ev.i >= N) ghost[N] = 'wall'
  }
  const cursor = phase.kind === 'set' ? cur.start : ev ? Math.min(ev.i, N) : null
  const got = ev ? ev.got : []
  const doneRuns = RUNS.filter((_r, ri) => ri < run || (ri === run && ev && k === evs.length - 1) || phase.kind === 'all')

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex h-[64px] items-center gap-6">
          <BigLine k={expr(cur)} size={30}>
            {expr(cur)}
          </BigLine>
          <div className="w-[440px] shrink-0">
            {phase.kind === 'intro' && <BeatCaption n={1} lines={['Decide what it gives before the press']} size={17} />}
            {phase.kind === 'set' && <BeatCaption n={beat} lines={run === 2 ? ['The third number is the step', 'Jump 2 each time', 'Say it before the press'] : ['Say it before the press']} size={17} />}
            {ev && phase.kind === 'ev' && <BeatCaption n={beat} lines={caption(ev, cur.step)} size={17} />}
            {phase.kind === 'all' && <BeatCaption n={beat} lines={['Start equal to stop gives nothing', 'A slice can run past the end with no error']} size={17} />}
          </div>
        </div>
        <ListBoxes items={SONGS} size="md" width={128} ghosts={1} ghostStates={ghost} states={states} cursor={cursor} cursorDown={phase.kind !== 'set'} />
        <div className="flex items-start gap-8">
          <div className="flex w-[380px] shrink-0 flex-col gap-2 rounded-2xl bg-white px-5 pb-4 pt-3" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}, 0 6px 24px -10px rgba(0,37,75,0.16)` }}>
            <Slider label="start" value={cur.start} min={0} max={6} onChange={(v) => change({ start: v })} />
            <Slider label="stop" value={cur.stop} min={0} max={10} onChange={(v) => change({ stop: v })} />
            <Slider label="step" value={cur.step} min={1} max={3} onChange={(v) => change({ step: v })} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex items-center gap-4">
              <span className="text-[17px] font-semibold" style={{ color: colors.muted }}>
                you get
              </span>
              <div
                className="flex min-h-[48px] min-w-[200px] items-center rounded-2xl px-4 font-mono text-[18px] font-bold"
                style={{ color: colors.brandDark, background: got.length ? colors.surface2 : 'transparent', border: `2px ${got.length ? 'solid' : 'dashed'} ${got.length ? colors.brandDark : colors.line}`, transition: tween, whiteSpace: 'nowrap' }}
              >
                {ev ? result(got) : ''}
              </div>
            </div>
            <Show on={doneRuns.length > 0} lift={4} className="flex flex-col gap-1">
              {doneRuns.map((r) => {
                const e = walk(r.start, r.stop, r.step)
                return (
                  <p key={expr(r)} className="font-mono text-[16px]" style={{ color: colors.body }}>
                    <span className="font-bold" style={{ color: colors.brandDark }}>
                      {expr(r)}
                    </span>
                    <span className="mx-2 font-body">gives</span>
                    <span style={{ color: colors.ink }}>{result(e[e.length - 1].got)}</span>
                  </p>
                )
              })}
            </Show>
          </div>
        </div>
      </div>
      <StepControls at={beat} total={WALKER_BEATS} />
    </>
  )
}
