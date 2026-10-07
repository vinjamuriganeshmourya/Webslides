import { Fragment, useRef, type CSSProperties, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { CodeBlock, Countdown, TraceCaption, VarTrail, useBeats, type CodeLineState } from '@/ui'
import { OutputPanel } from '@/ui/CodeOutput'
import { Boxes, Lines, type BoxState } from './common'
import { StepControls } from './controls'
import { Glow } from './motion'
import { Brief } from './pieces'

/**
 * THE WALK: one line of a program per press. PF 17 slides 8, 9 and 11, the
 * reference's `data-walk` panel rebuilt once and fed three programs.
 *
 * Every press applies one EVENT: the line that ran lights (`now`), the lines
 * already run stay tinted (`ran`), a variable keeps every value it has held,
 * a range is drawn as cells (taken ones faded, the one on now ringed; after
 * a break the cell is marked `break` and every cell after it `never`), the
 * output grows, and one caption says what just happened. On the last event
 * a line the program never reached is drawn dead and stays dead. Nothing
 * moves until the instructor presses (course rule R5c item 4).
 *
 * The caption sits under the code it narrates (session 16, slide 7), which
 * gives the right column its full height for the cells and the output.
 *
 * Every event sequence is a real run (CPython 3.12.3): the plan's output table.
 */
export interface SeqState {
  items: string[]
  at: number
  call: string
  flag?: '' | 'broke' | 'done'
}

export interface StripDef {
  name: string
  call: string
}

export interface WalkEvent {
  l: number
  set?: [string, string]
  seq?: Record<string, SeqState>
  o?: string
  say: string[]
}

/**
 * A range row with a FIXED height whatever it holds (a sentence, cells, cells
 * with `break` and `never` under them), so the output panel under it never
 * moves between presses (session 16, review 2). Ten cells take the 'xs' size,
 * fewer take 'sm'; the row is the cell plus the mark line in either case.
 */
function RangeRow({ label, height, children }: { label: ReactNode; height: number; children: ReactNode }) {
  return (
    <div className="flex items-start gap-4" style={{ height }}>
      <span className="w-[150px] shrink-0 pt-2.5 font-mono text-[16px]" style={{ color: colors.body }}>{label}</span>
      <div className="flex items-start">{children}</div>
    </div>
  )
}

function Strip({ def, s }: { def: StripDef; s: SeqState | null }) {
  const size = (s?.items.length ?? 0) > 6 ? 'xs' : 'sm'
  const height = (size === 'xs' ? 42 : 52) + 26
  const label = (
    <>
      <b className="font-bold" style={{ color: colors.brandDark }}>{def.name}</b> in {s ? s.call : def.call}
    </>
  )
  const note = (text: string, strong = false) => (
    <RangeRow label={label} height={height}>
      <span className={`pt-2.5 text-[16px] ${strong ? 'font-semibold' : ''}`} style={{ color: colors.muted }}>{text}</span>
    </RangeRow>
  )
  if (!s) return note('not reached yet')
  if (!s.items.length) return note('empty, nothing to take')
  if (s.flag === 'done') return note('used up, the loop ends', true)
  const states: Record<number, BoxState> = {}
  const marks: Record<number, ReactNode> = {}
  s.items.forEach((_, j) => {
    if (j < s.at) states[j] = 'gone'
    else if (j === s.at) {
      states[j] = s.flag === 'broke' ? 'bad' : 'hit'
      if (s.flag === 'broke') marks[j] = 'break'
    } else if (s.flag === 'broke') {
      states[j] = 'never'
      marks[j] = <span style={{ color: colors.muted }}>never</span>
    }
  })
  return (
    <RangeRow label={label} height={height}>
      <Boxes chars={s.items} size={size} indices={false} states={states} marks={marks} />
    </RangeRow>
  )
}

/** The reference's key, compact enough to share a row with a value trail. */
function Legend() {
  const items: { label: string; style: CSSProperties }[] = [
    { label: 'ran', style: { background: colors.night2, boxShadow: 'inset 0 0 0 20px rgba(255,255,255,0.10)' } },
    { label: 'running now', style: { background: colors.night2, boxShadow: 'inset 0 0 0 20px rgba(11,95,255,0.55)' } },
    { label: 'never ran', style: { background: colors.night2, opacity: 0.3 } },
  ]
  return (
    <p className="flex shrink-0 items-center gap-x-3 text-[13.5px] font-semibold" style={{ color: colors.muted }}>
      {items.map((it) => (
        <span key={it.label} className="flex items-center gap-1.5">
          <span className="inline-block h-[13px] w-[13px] rounded" style={it.style} />
          {it.label}
        </span>
      ))}
    </p>
  )
}

export function Walk({
  code,
  rows,
  fontSize = 17,
  events,
  vars,
  strips = [],
  ask,
  preface,
  under,
  legend = false,
  outHeight,
  outFont = 17,
  outLineHeight = 1.4,
  leftWidth = 520,
  nextLabel = 'Next',
}: {
  code: string
  rows: number
  fontSize?: number
  events: WalkEvent[]
  vars: string[]
  strips?: StripDef[]
  /** The caption before the first press. */
  ask: ReactNode[]
  /** What the right column shows before the first press instead of the cells (a worksheet brief). */
  preface?: ReactNode
  /** Under the code, above the trails (the slider). */
  under?: ReactNode
  legend?: boolean
  outHeight: number
  outFont?: number
  outLineHeight?: number
  leftWidth?: number
  nextLabel?: string
}) {
  const total = events.length + 1
  const beat = useBeats(total)
  const k = Math.min(beat - 1, events.length)
  const done = events.slice(0, k)
  const now = k ? events[k - 1] : undefined

  const lines: Record<number, CodeLineState> = {}
  for (const e of done) lines[e.l] = 'ran'
  if (now) lines[now.l] = 'now'
  if (k === events.length && events.length) {
    const hit = new Set(events.map((e) => e.l))
    for (let n = 1; n <= code.split('\n').length; n++) if (!hit.has(n)) lines[n] = 'dead'
  }

  const printed = done.map((e) => e.o).filter((x): x is string => x !== undefined)
  const seqOf = (v: string): SeqState | null => {
    for (let i = k - 1; i >= 0; i--) {
      const s = events[i].seq?.[v]
      if (s) return s
    }
    return null
  }
  /* the glow fires once per line that lands, not on every press */
  const landed = useRef(0)
  landed.current = printed.length

  return (
    <>
      <div className="flex items-start gap-7">
        <div className="flex shrink-0 flex-col gap-3" style={{ width: leftWidth }}>
          <CodeBlock code={code} filename="Python" chip={false} fontSize={fontSize} rows={rows} lines={lines} />
          {under}
          {/* the trails share one row (two variables side by side), the key at its end */}
          <div className="flex min-h-[48px] items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-6">
              {vars.map((v) => (
                <VarTrail key={v} name={v} values={done.filter((e) => e.set?.[0] === v).map((e) => e.set![1])} />
              ))}
            </div>
            {legend && <Legend />}
          </div>
          {(now || !preface) && (
            <TraceCaption>
              <Lines lines={now ? now.say : ask} />
            </TraceCaption>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {!now && preface ? (
            preface
          ) : (
            <>
              {strips.map((d) => (
                <Strip key={d.name} def={d} s={seqOf(d.name)} />
              ))}
              <Glow on={!!now?.o} pulse={printed.length}>
                <OutputPanel output={printed.join('\n')} fontSize={outFont} lineHeight={outLineHeight} height={outHeight} />
              </Glow>
            </>
          )}
        </div>
      </div>
      <StepControls at={beat} total={total} nextLabel={nextLabel} />
    </>
  )
}

/* ------------------------------------------------------------ slide 8 */

/**
 * The slider's value lives OUTSIDE the component, so it survives the replay
 * the slider triggers: changing it re-computes the walk, and the clean way to
 * re-register a different number of build steps with the deck's stepper is to
 * remount the slide, which is exactly what the deck's own `R` does. The reference
 * resets its walk to state 1 on the same change.
 */
let breakAt = 2
const TEN = Array.from({ length: 10 }, (_, i) => String(i))

export function breakEvents(n: number): WalkEvent[] {
  const ev: WalkEvent[] = []
  for (let i = 0; i < 10; i++) {
    ev.push({ l: 1, set: ['i', String(i)], seq: { i: { items: TEN, at: i, call: 'range(10)', flag: '' } }, say: [`i takes ${i}`] })
    if (i === n) {
      ev.push({ l: 2, say: [`i == ${n} is True`] })
      ev.push({ l: 3, seq: { i: { items: TEN, at: i, call: 'range(10)', flag: 'broke' } }, say: ['break', 'Leave the loop right now'] })
      break
    }
    ev.push({ l: 2, say: [`i == ${n} is False, so its block is skipped`] })
    ev.push({ l: 4, o: String(i), say: [`It prints ${i}`] })
  }
  if (n >= 10) ev.push({ l: 1, seq: { i: { items: TEN, at: 10, call: 'range(10)', flag: 'done' } }, say: ['Nothing is left in the range, so the loop ends'] })
  ev.push({ l: 5, o: 'End', say: ['It prints End'] })
  return ev
}

function replaySlide() {
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r', bubbles: true, cancelable: true }))
}

export function BreakWalk() {
  const n = breakAt
  const code = `for i in range(10):\n    if i == ${n}:\n        break\n    print(i)\nprint("End")`
  return (
    <Walk
      code={code}
      rows={5}
      events={breakEvents(n)}
      vars={['i']}
      strips={[{ name: 'i', call: 'range(10)' }]}
      legend
      ask={['Before we press: what will this print?', 'Say it out loud']}
      /* holds the longest run, 0 to 9 and End, eleven lines at 16px x 1.3: the content must fit the box, not scroll inside it */
      outHeight={292}
      outFont={16}
      outLineHeight={1.3}
      under={
        <label className="flex items-center gap-4 rounded-card bg-white px-4 py-2 shadow-card-soft ring-1 ring-line">
          <span className="text-[16px] font-semibold" style={{ color: colors.body }}>break when i ==</span>
          <span className="w-6 font-mono text-[20px] font-bold" style={{ color: colors.brandDark }}>{n}</span>
          <input
            type="range"
            min={0}
            max={10}
            defaultValue={n}
            aria-label="break when i =="
            className="h-2 min-w-0 flex-1 cursor-pointer"
            style={{ accentColor: colors.brand }}
            onChange={(e) => {
              const v = Number(e.currentTarget.value)
              if (v === breakAt) return
              breakAt = v
              replaySlide()
            }}
          />
        </label>
      }
    />
  )
}

/* ------------------------------------------------------------ slide 9 */

export function FirstLineWalk() {
  return (
    <Walk
      code={'i = 0\nwhile i < 10:\n    break\n    print(i)\n    i = i + 1\nprint("End")'}
      rows={6}
      events={[
        { l: 1, set: ['i', '0'], say: ['i is now 0'] },
        { l: 2, say: ['i < 10 is True, so the body runs'] },
        { l: 3, say: ['break is the first line of the body', 'The loop ends here, before print(i) can run'] },
        { l: 6, o: 'End', say: ['It prints End', 'Lines 4 and 5 never ran, and i stays 0'] },
      ]}
      vars={['i']}
      ask={['break is the first line inside the loop', 'What will this print?']}
      outHeight={200}
    />
  )
}

/* ----------------------------------------------------------- slide 11 */

const TWO = ['0', '1']
const FOUR = ['0', '1', '2', '3']
const a = (at: number, flag: SeqState['flag'] = '') => ({ a: { items: TWO, at, call: 'range(2)', flag } })
const b = (at: number, flag: SeqState['flag'] = '') => ({ b: { items: FOUR, at, call: 'range(4)', flag } })

const INNER: WalkEvent[] = [
  { l: 1, set: ['a', '0'], seq: a(0), say: ['a takes 0'] },
  { l: 2, o: 'outer : 0', say: ['It prints outer : 0'] },
  { l: 3, set: ['b', '0'], seq: b(0), say: ['b takes 0'] },
  { l: 4, say: ['b == 1 is False, so its block is skipped'] },
  { l: 6, o: 'inner : 0', say: ['It prints inner : 0'] },
  { l: 3, set: ['b', '1'], seq: b(1), say: ['b takes 1'] },
  { l: 4, say: ['b == 1 is True'] },
  { l: 5, seq: b(1, 'broke'), say: ['break', 'Leave the loop right now'] },
  { l: 1, set: ['a', '1'], seq: a(1), say: ['a takes 1'] },
  { l: 2, o: 'outer : 1', say: ['It prints outer : 1'] },
  { l: 3, set: ['b', '0'], seq: b(0), say: ['b takes 0'] },
  { l: 4, say: ['b == 1 is False, so its block is skipped'] },
  { l: 6, o: 'inner : 0', say: ['It prints inner : 0'] },
  { l: 3, set: ['b', '1'], seq: b(1), say: ['b takes 1'] },
  { l: 4, say: ['b == 1 is True'] },
  { l: 5, seq: b(1, 'broke'), say: ['break', 'Leave the loop right now'] },
  { l: 1, seq: a(2, 'done'), say: ['Nothing is left in the range, so the loop ends'] },
]

/** The worksheet's empty table: one row for each time line 4 runs. */
function TraceTable() {
  const cols = ['row', 'a', 'b', 'break?', 'prints']
  return (
    <div className="grid gap-x-2 gap-y-1.5" style={{ gridTemplateColumns: '44px 1fr 1fr 1.2fr 1.4fr' }}>
      {cols.map((c) => (
        <span key={c} className="text-center text-[13px] font-bold" style={{ color: colors.body }}>{c}</span>
      ))}
      {Array.from({ length: 6 }, (_, r) => (
        <Fragment key={r}>
          <span className="grid h-[22px] place-items-center rounded-md text-[12.5px] font-bold" style={{ background: colors.surface2, color: colors.body }}>{r + 1}</span>
          {cols.slice(1).map((c) => (
            <span key={c} className="h-[22px] rounded-md bg-white" style={{ boxShadow: `inset 0 0 0 1px ${colors.line}` }} />
          ))}
        </Fragment>
      ))}
    </div>
  )
}

export function InnerBreakWalk() {
  return (
    <Walk
      code={'for a in range(2):\n    print("outer : " + str(a))\n    for b in range(4):\n        if b == 1:\n            break\n        print("inner : " + str(b))'}
      rows={6}
      events={INNER}
      vars={['a', 'b']}
      strips={[
        { name: 'a', call: 'range(2)' },
        { name: 'b', call: 'range(4)' },
      ]}
      ask={[]}
      outHeight={176}
      preface={
        <Brief
          tag="Worksheet · Task 1"
          size={16}
          aside={<Countdown seconds={300} />}
          lines={[
            <>
              Open <b>Task 1</b> on your worksheet
            </>,
            <>
              Fill one row <b>each time line 4 runs</b>: a, b, does the break run, and what line 6 prints
            </>,
            'Then type everything it prints, in order',
            <Lines lines={[<b key="a">Do not run it</b>, 'Keyboards off when the timer ends']} />,
          ]}
        >
          <TraceTable />
        </Brief>
      }
    />
  )
}
