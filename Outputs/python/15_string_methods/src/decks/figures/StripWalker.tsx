import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { CodeBlock, PanelButton, TraceCaption, TraceKey, VarTrail, type CodeLineState } from '@/ui'
import { OutputPanel } from '@/ui/CodeOutput'
import { useInstant } from '@/motion/instant'
import { Boxes, glyph, type BoxState } from './common'
import { Glow, Press } from './motion'

/**
 * WHERE DOES STRIP STOP? PF 15 slide 18, walked one character at a time.
 *
 * The room picks the set on line 2, writes down what line 3 prints, and only
 * then presses Play or One step. The walk is COMPUTED from the chosen set, by
 * the reference's own rule, so a second walk with another set is not a lie:
 *
 *   eat from the left while the character is in the set, then stop;
 *   eat from the right while the character is in the set, then stop;
 *   any character of the set still in the middle was never reached, and stays.
 *
 * That last beat is the finding: with strip("-i") the "-" between a and v is IN
 * the set and survives, because strip only ever looks at the two ends.
 *
 * Every result is Python's own: "--Ra-vi--".strip() -> "--Ra-vi--",
 * strip("-") -> "Ra-vi", strip("-i") -> "Ra-v", strip("-iR") -> "a-v".
 *
 * Local state, like the kit's `StringWalker`: played, not presented. The box
 * being read carries the brand halo, the output panel lights when line 3 hands
 * the result over, and every button answers the press (`./motion`).
 */
const SRC = '--Ra-vi--'

type Step = { line: number; idx?: number; eat?: boolean; stop?: boolean; never?: number[]; out?: string; cap: ReactNode }

const q = (c: string) => `"${c}"`

function build(set: string | null): Step[] {
  const inSet = (c: string) => (set === null ? ' \t\n' : set).includes(c)
  const n = SRC.length
  const p: Step[] = [{ line: 1, cap: <><b>Line 1.</b> name holds these {n} characters.</> }]
  let i = 0
  let j = n - 1
  while (i <= j && inSet(SRC[i])) {
    p.push({ line: 2, idx: i, eat: true, cap: <><b>Left end.</b> {q(SRC[i])} is in the set, so it comes off.</> })
    i++
  }
  if (i <= j)
    p.push({ line: 2, idx: i, stop: true, cap: <><b>Left end stops.</b> {q(SRC[i])} is not in the set, so strip stops here and never looks further in.</> })
  while (j >= i && inSet(SRC[j])) {
    p.push({ line: 2, idx: j, eat: true, cap: <><b>Right end.</b> {q(SRC[j])} is in the set, so it comes off.</> })
    j--
  }
  if (j >= i) p.push({ line: 2, idx: j, stop: true, cap: <><b>Right end stops.</b> {q(SRC[j])} is not in the set, so strip stops here too.</> })
  const never: number[] = []
  for (let k = i; k <= j; k++) if (inSet(SRC[k])) never.push(k)
  if (never.length)
    p.push({
      line: 2,
      never,
      cap: (
        <>
          <b>The middle.</b> There is a {q(SRC[never[0]])} at index {never[0]}, and it IS in the set. strip never reached it, so it stays.
        </>
      ),
    })
  p.push({ line: 3, out: SRC.slice(i, j + 1), cap: <><b>Line 3.</b> Line 2 stored the new string back into name. Without that equals sign nothing would have changed.</> })
  return p
}

const PICKS: { label: string; set: string | null }[] = [
  { label: 'strip()', set: null },
  { label: 'strip("-")', set: '-' },
  { label: 'strip("-i")', set: '-i' },
  { label: 'strip("-iR")', set: '-iR' },
]

export function StripWalker() {
  const instant = useInstant()
  const [pick, setPick] = useState(2)
  const [at, setAt] = useState(0)
  const [playing, setPlaying] = useState(false)
  const set = PICKS[pick].set
  const plan = useMemo(() => build(set), [set])
  const timer = useRef<number | null>(null)
  const stop = () => {
    if (timer.current) window.clearInterval(timer.current)
    timer.current = null
    setPlaying(false)
  }
  useEffect(() => stop, [])
  useEffect(() => {
    if (playing && at >= plan.length) stop()
  }, [playing, at, plan.length])

  const reset = (k: number) => {
    stop()
    setPick(k)
    setAt(0)
  }
  const one = () => setAt((a) => Math.min(a + 1, plan.length))
  const play = () => {
    if (timer.current) return stop()
    if (at >= plan.length) setAt(0)
    setPlaying(true)
    timer.current = window.setInterval(() => setAt((a) => Math.min(a + 1, plan.length)), instant ? 120 : 1100)
  }

  /* everything on screen is derived from `at` */
  const states: Record<number, BoxState> = {}
  const marks: Record<number, ReactNode> = {}
  const ran = new Set<number>()
  const hist = [SRC]
  let out = ''
  let now = 0
  let cur: number | undefined
  for (let k = 0; k < at; k++) {
    const s = plan[k]
    ran.add(s.line)
    now = s.line
    if (s.eat && s.idx !== undefined) {
      states[s.idx] = 'gone'
      cur = s.idx
    }
    if (s.stop && s.idx !== undefined) {
      states[s.idx] = 'stop'
      marks[s.idx] = 'stop'
      cur = s.idx
    }
    if (s.never)
      s.never.forEach((x) => {
        states[x] = 'skip'
        marks[x] = <span style={{ color: colors.danger }}>never</span>
      })
    if (s.out !== undefined) {
      hist.push(s.out)
      out = s.out
      cur = undefined
    }
  }
  if (cur !== undefined && states[cur] === 'gone') states[cur] = 'hit'
  const lines: Record<number, CodeLineState> = {}
  for (let l = 1; l <= 3; l++) {
    if (at > 0 && l === now) lines[l] = 'now'
    else if (ran.has(l)) lines[l] = 'ran'
  }
  const arg = set === null ? '' : `"${set}"`
  const code = `name = "${SRC}"\nname = name.strip(${arg})\nprint(name)`
  const caption: ReactNode =
    at > 0 ? plan[at - 1].cap : <><b>Write down what line 3 prints.</b> Then we walk it one character at a time.</>

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-8">
        <div className="flex w-[590px] shrink-0 flex-col gap-3">
          <CodeBlock code={code} filename="Python" chip={false} fontSize={21} rows={3} lines={lines} />
          <div className="flex items-center gap-2">
            <span className="mr-1 whitespace-nowrap font-mono text-[16px]" style={{ color: colors.muted }}>line 2</span>
            {PICKS.map((p, k) => (
              <button
                key={p.label}
                type="button"
                aria-pressed={k === pick}
                onKeyDown={(e) => e.key !== 'Enter' && e.key !== ' ' && e.currentTarget.blur()}
                onClick={() => reset(k)}
                className="sm-tap whitespace-nowrap rounded-pill px-3.5 py-1.5 font-mono text-[16px] font-semibold"
                style={{
                  transition: instant
                    ? 'none'
                    : 'background-color 240ms cubic-bezier(0.22, 1, 0.36, 1), color 240ms cubic-bezier(0.22, 1, 0.36, 1), transform 160ms cubic-bezier(0.22, 1, 0.36, 1)',
                  ...(k === pick
                    ? { background: colors.brandDark, color: colors.white }
                    : { background: colors.white, color: colors.body, boxShadow: `inset 0 0 0 1px ${colors.line}` }),
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
          <TraceKey
            items={[
              { swatch: 'ran', label: 'already run' },
              { swatch: 'now', label: 'running now' },
              { swatch: 'dead', label: 'in the set, never reached' },
            ]}
          />
          <div className="flex items-center gap-2">
            <Press>
              <PanelButton onClick={play} disabled={at >= plan.length}>{playing ? 'Pause' : 'Play'}</PanelButton>
            </Press>
            <Press>
              <PanelButton onClick={one} disabled={at >= plan.length}>One step</PanelButton>
            </Press>
            <Press>
              <PanelButton ghost onClick={() => reset(pick)}>Reset</PanelButton>
            </Press>
            <span className="ml-auto text-[16px] tabular-nums" style={{ color: colors.muted }}>
              {at} / {plan.length} steps
            </span>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Boxes chars={[...SRC]} size="sm" indices states={states} marks={marks} focus={cur} />
          <VarTrail name="name" values={hist.map((h) => [...h].map(glyph).join('') || '""')} />
          <Glow on={out !== ''}>
            <OutputPanel output={out} fontSize={22} height={100} />
          </Glow>
        </div>
      </div>
      <TraceCaption>{caption}</TraceCaption>
    </div>
  )
}
