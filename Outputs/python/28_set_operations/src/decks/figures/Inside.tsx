import { useLayoutEffect, useRef, useState } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Confetti } from './motion'
import { Ask, Swap } from './pieces'
import { Vote } from './trace'
import { HOUSE, Venn, type ChipTone } from './venn'
import { RoundFrame, WhyLines, schedule } from './Regions'
import { SPEC } from './spec'

/**
 * GAME G2 · INSIDE, AROUND OR APART? Twenty-seven presses: the intro, then
 * five rounds (the ask, one press per person checked, the print, the
 * verdict).
 *
 * The picture is the machine: the set whose people are checked on the left,
 * the other set on the right, apart. Each step, the person being checked
 * lights and travels to the other circle: found, they land on their own chip
 * there; not found, they bounce off its rim and come back red. Checking
 * stops at the first person who decides the answer (the spec's steps already
 * stop there). The answer appears on the object, as a True or False tag
 * between the circles, before the console shows it. Every program, step and
 * why line is the spec's, run on CPython 3.12.3.
 */
const G2 = SPEC.G2
type State = { checking: string | null; inside: boolean | null; checked: string[]; printed?: string }
type Step = { caption: string; state: State }
type Round = { ask: string; program: string; options: string[]; answer: string; because: string; why: Record<string, string>; steps: Step[] }
const ROUNDS: Round[] = G2.data.rounds
const SCHEDULE = schedule(ROUNDS)

/** `{"Anu", "Harsha"}` as its names. */
const namesOf = (lit: string) => [...lit.matchAll(/"([^"]*)"/g)].map((m) => m[1])

/**
 * What a round compares: the sets named on its lines, and the call on the
 * print line. issubset and isdisjoint check the set before the dot against
 * the one in the brackets; issuperset checks the brackets against the set
 * before the dot.
 */
function machine(program: string) {
  const sets: Record<string, string[]> = {}
  for (const l of program.split('\n')) {
    const m = l.match(/^(\w+) = (\{.*\})$/)
    if (m) sets[m[1]] = namesOf(m[2])
  }
  const call = program.match(/print\((\w+)\.(\w+)\((.*)\)\)/)!
  const [, before, method, arg] = call
  const a = { code: before, items: sets[before] }
  const b = /^\w+$/.test(arg) ? { code: arg, items: sets[arg] } : { code: 'in the brackets', items: namesOf(arg) }
  return method === 'issuperset' ? { checked: b, other: a, method } : { checked: a, other: b, method }
}

const VW = 340
const VH = 214
const SMALL = 74
const BIG = 90

/** The person being checked, travelling from their chip to the other circle, or to its rim and back. */
function Traveller({ name, from, to, found, k, rim }: { name: string; from: HTMLElement | null; to: HTMLElement | null; found: boolean; k: string; rim: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const box = useRef<HTMLDivElement>(null)
  const instant = useInstant()
  useLayoutEffect(() => {
    const el = ref.current
    const host = box.current?.offsetParent as HTMLElement | null
    if (!el || !from || !host || instant) return
    const hr = host.getBoundingClientRect()
    const scale = host.offsetWidth ? hr.width / host.offsetWidth : 1
    const at = (e: HTMLElement) => {
      const r = e.getBoundingClientRect()
      return { x: (r.left - hr.left) / scale, y: (r.top - hr.top) / scale }
    }
    const s = at(from)
    const t = to ? at(to) : { x: rim, y: s.y }
    const frames = found
      ? [{ transform: `translate(${s.x}px, ${s.y}px)`, opacity: 1 }, { transform: `translate(${t.x}px, ${t.y}px)`, opacity: 1 }, { transform: `translate(${t.x}px, ${t.y}px)`, opacity: 0 }]
      : [{ transform: `translate(${s.x}px, ${s.y}px)`, opacity: 1 }, { transform: `translate(${t.x}px, ${t.y}px)`, opacity: 1, offset: 0.55 }, { transform: `translate(${t.x - 14}px, ${t.y}px)`, opacity: 1, offset: 0.68 }, { transform: `translate(${s.x}px, ${s.y}px)`, opacity: 0 }]
    el.animate(frames, { duration: found ? 1300 : 1500, easing: HOUSE, fill: 'forwards' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k])
  return (
    <div ref={box} className="pointer-events-none absolute left-0 top-0 z-10">
      <span ref={ref} className="absolute left-0 top-0 grid h-[23px] place-items-center whitespace-nowrap rounded-full px-2.5 text-[12px] font-semibold" style={{ opacity: 0, background: '#EAF1FF', color: colors.brandDark, boxShadow: `inset 0 0 0 2px ${colors.brand}` }}>
        {name}
      </span>
    </div>
  )
}

export function Inside() {
  const beat = useBeats(SCHEDULE.length)
  const b = SCHEDULE[beat - 1]
  const r = b.kind === 'intro' ? 0 : b.r
  const round = ROUNDS[r]
  const [picks, setPicks] = useState<number[]>(ROUNDS.map(() => -1))
  const pick = picks[r]
  const setPick = (p: number) => setPicks((ps) => ps.map((v, j) => (j === r ? p : v)))
  const refs = useRef<Record<string, HTMLElement | null>>({})
  const refsR = useRef<Record<string, HTMLElement | null>>({})
  const m = machine(round.program)
  /* the circle with more people is the bigger one */
  const lBig = m.checked.items.length > m.other.items.length
  const L = { cx: (lBig ? BIG : SMALL) + 4, cy: 116, r: lBig ? BIG : SMALL }
  const R = { cx: VW - (lBig ? SMALL : BIG) - 4, cy: 116, r: lBig ? SMALL : BIG }
  const step = b.kind === 'step' ? round.steps[b.s] : b.kind === 'verdict' ? round.steps[round.steps.length - 1] : null
  const st = step?.state
  const disjoint = m.method === 'isdisjoint'
  /* a check that decides: inside is good for a subset, bad for disjoint */
  const tones: Record<string, ChipTone> = {}
  for (const n of st?.checked ?? []) {
    const isIn = m.other.items.includes(n)
    tones[n] = isIn !== disjoint ? 'ok' : 'bad'
  }
  if (st?.checking) tones[st.checking] = 'lit'
  const toneR: Record<string, ChipTone> = {}
  for (const n of st?.checked ?? []) if (m.other.items.includes(n)) toneR[n] = disjoint ? 'bad' : 'ok'
  const printed = st?.printed ?? ''
  const right = round.options.indexOf(round.answer)
  const shown = b.kind === 'verdict'
  const caption = b.kind === 'step' ? step!.caption : shown ? round.because : null
  const moving = b.kind === 'step' && st?.checking ? st.checking : null
  /* the right circle draws its own copies of shared names; tones by side */
  const allTones = { ...tones }
  return (
    <>
      <RoundFrame
        intro={b.kind === 'intro' ? G2.data.intro : null}
        head={
          <div className="flex flex-col gap-1">
            <span className="font-heading text-[16px] font-bold" style={{ color: colors.brandDark }}>
              Round {r + 1} of {ROUNDS.length}
            </span>
            <Ask size={19}>{round.ask}</Ask>
          </div>
        }
        code={round.program}
        rows={3}
        asking={b.kind === 'ask'}
        running={b.kind === 'step'}
        vote={<Vote key={`v${r}`} options={round.options} right={right} shown={shown} pick={pick} setPick={setPick} cols={2} size={18} nowrap dense />}
        picture={
          <Swap k={r}>
            <div className="relative" style={{ width: VW, height: VH }}>
              <Venn W={VW} H={VH} L={L} R={R} left={{ code: m.checked.code, items: m.checked.items }} right={{ code: m.other.code, items: m.other.items }} tones={allTones} toneR={toneR} fs={12} refs={refs} refsR={refsR} />
              {moving && <Traveller k={`${r}-${b.kind === 'step' ? b.s : ''}`} rim={R.cx - R.r - 26} name={moving} from={refs.current[moving]} to={refsR.current[moving] ?? null} found={!!st?.inside} />}
              {printed && (
                <span key={`t${r}`} className="sm-bump absolute bottom-0 left-1/2 -translate-x-1/2 rounded-lg px-3 py-0.5 font-mono text-[18px] font-bold" style={{ background: printed === 'True' ? '#E9F8EF' : '#FDECEC', color: printed === 'True' ? '#137A3A' : colors.danger, boxShadow: `inset 0 0 0 2px ${printed === 'True' ? colors.success : colors.danger}` }}>
                  {printed}
                </span>
              )}
            </div>
          </Swap>
        }
        badge={b.kind === 'step' ? `step ${b.s + 1}` : null}
        caption={caption}
        rule={shown}
        out={printed ? [{ text: printed }] : []}
        verdict={<WhyLines on={shown} rows={round.options.filter((o) => o !== round.answer).map((o) => ({ opt: o, why: round.why[o] ?? '' }))} />}
      />
      {shown && pick === right && <Confetti seed={60 + r} />}
      <StepControls at={beat} total={SCHEDULE.length} />
    </>
  )
}
