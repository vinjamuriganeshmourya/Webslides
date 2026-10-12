import { useLayoutEffect, useRef, useState } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Confetti } from './motion'
import { Ask, Swap } from './pieces'
import { Vote } from './trace'
import { HOUSE, Venn, chipH, type ChipTone, type Circ } from './venn'
import { RoundFrame, WhyLines, schedule } from './Regions'
import { SPEC } from './spec'

/**
 * GAME G2 · INSIDE, AROUND OR APART? Twenty-seven presses: the intro, then
 * five rounds (the ask, one press per person checked, the print, the
 * verdict).
 *
 * THE PICTURE IS DRAWN AS THE CODE SAYS (the view fixes change spec,
 * 2026-10-09; before it every round drew two circles apart, the picture for
 * disjoint sets): one set inside the other when one holds the other (rounds
 * 1, 2 and 5), two circles overlapping with the shared people in the middle
 * when they share some (rounds 3 and 4, Harsha poking out of cse), apart only
 * when they share nobody. The person being checked lights and moves: found,
 * they are already in the other circle, so their chip pulses and turns green
 * (red for disjoint); not found, a copy flies to the other circle's rim,
 * bounces off and comes back, and the chip turns red. The answer shows on the
 * press itself, never on a timer; the movement is the emphasis. Checking
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

type SetSide = { code: string; items: string[] }

/**
 * What a round compares: the sets named on its lines, and the call on the
 * print line. issubset and isdisjoint check the set before the dot against
 * the one in the brackets; issuperset checks the brackets against the set
 * before the dot.
 */
function machine(program: string): { checked: SetSide; other: SetSide; method: string } {
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

const VW = 380
const VH = 214
const CY = 116
const FS = 12

type Picture = { L: Circ; R: Circ; left: SetSide; right: SetSide; rightAt: 'top' | 'right'; otherSide: 'L' | 'R' }

/** A circle's radius for the people it holds. */
const radiusFor = (n: number) => (n >= 6 ? 96 : n >= 4 ? 90 : n === 3 ? 76 : 72)

/**
 * How the two sets are drawn, from the sets themselves: the bigger set is
 * always the left circle (the brand tone), and the other sits inside it,
 * overlaps it from the right, or stands apart.
 */
function picture(checked: SetSide, other: SetSide): Picture {
  const a = checked.items
  const b = other.items
  const holds = (x: string[], y: string[]) => y.every((n) => x.includes(n))
  const shared = a.filter((n) => b.includes(n))
  if (holds(b, a) || holds(a, b)) {
    /* one inside the other: the set that holds the other is the ring */
    const big = holds(b, a) ? other : checked
    const small = big === other ? checked : other
    return { L: { cx: 118, cy: CY, r: 96 }, R: { cx: 152, cy: CY, r: 60 }, left: big, right: small, rightAt: 'right', otherSide: big === other ? 'L' : 'R' }
  }
  if (shared.length) {
    /* overlapping, the shared people in the middle; the smaller set pokes out on the right */
    const big = a.length >= b.length ? checked : other
    const small = big === checked ? other : checked
    const rB = radiusFor(big.items.length)
    const rS = radiusFor(small.items.length)
    const lens = shared.length >= 2 ? 86 : 54
    const L: Circ = { cx: rB + 14, cy: CY, r: rB }
    const R: Circ = { cx: L.cx + rB + rS - lens, cy: CY, r: rS }
    return { L, R, left: big, right: small, rightAt: 'top', otherSide: big === other ? 'L' : 'R' }
  }
  /* nobody shared: apart */
  const rA = radiusFor(a.length)
  const rB = radiusFor(b.length)
  return { L: { cx: rA + 10, cy: CY, r: rA }, R: { cx: VW - rB - 10, cy: CY, r: rB }, left: checked, right: other, rightAt: 'top', otherSide: 'R' }
}

/**
 * The movement of a check. `pulse`: the person is already inside the other
 * circle, so their own chip swells once. `bounce`: a copy of the chip flies
 * from where it sits toward the other circle, stops at its rim, is pushed
 * back and fades where it started.
 */
function Mover({ name, from, kind, toward, k }: { name: string; from: HTMLElement | null; kind: 'pulse' | 'bounce'; toward: Circ; k: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const box = useRef<HTMLDivElement>(null)
  const instant = useInstant()
  useLayoutEffect(() => {
    if (!from || instant) return
    if (kind === 'pulse') {
      from.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.22)', offset: 0.45 }, { transform: 'scale(1)' }], { duration: 760, easing: HOUSE })
      return
    }
    const el = ref.current
    const host = box.current?.offsetParent as HTMLElement | null
    if (!el || !host) return
    const hr = host.getBoundingClientRect()
    const scale = host.offsetWidth ? hr.width / host.offsetWidth : 1
    const fr = from.getBoundingClientRect()
    const s = { x: (fr.left - hr.left) / scale, y: (fr.top - hr.top) / scale }
    const w = fr.width / scale
    const h = fr.height / scale
    const c = { x: s.x + w / 2, y: s.y + h / 2 }
    const dx = toward.cx - c.x
    const dy = toward.cy - c.y
    const dist = Math.hypot(dx, dy)
    const stop = dist - (toward.r + h / 2 + 6)
    if (stop <= 4) return
    const t = { x: s.x + (dx / dist) * stop, y: s.y + (dy / dist) * stop }
    const back = { x: t.x - (dx / dist) * 16, y: t.y - (dy / dist) * 16 }
    el.animate(
      [
        { transform: `translate(${s.x}px, ${s.y}px)`, opacity: 1 },
        { transform: `translate(${t.x}px, ${t.y}px)`, opacity: 1, offset: 0.55 },
        { transform: `translate(${back.x}px, ${back.y}px)`, opacity: 1, offset: 0.68 },
        { transform: `translate(${s.x}px, ${s.y}px)`, opacity: 0 },
      ],
      { duration: 1500, easing: HOUSE, fill: 'forwards' },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k])
  if (kind === 'pulse') return null
  return (
    <div ref={box} className="pointer-events-none absolute left-0 top-0 z-10">
      <span ref={ref} className="absolute left-0 top-0 grid place-items-center whitespace-nowrap rounded-full px-2.5 text-[12px] font-semibold" style={{ height: chipH(FS), opacity: 0, background: '#FDECEC', color: colors.danger, boxShadow: `inset 0 0 0 2px ${colors.danger}` }}>
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
  const m = machine(round.program)
  const pic = picture(m.checked, m.other)
  const step = b.kind === 'step' ? round.steps[b.s] : b.kind === 'verdict' ? round.steps[round.steps.length - 1] : null
  const st = step?.state
  const disjoint = m.method === 'isdisjoint'
  /* a check that decides: inside is good for a subset, bad for disjoint; the answer shows on the press */
  const tones: Record<string, ChipTone> = {}
  for (const n of st?.checked ?? []) {
    const isIn = m.other.items.includes(n)
    tones[n] = isIn !== disjoint ? 'ok' : 'bad'
  }
  const printed = st?.printed ?? ''
  const right = round.options.indexOf(round.answer)
  const shown = b.kind === 'verdict'
  const caption = b.kind === 'step' ? step!.caption : shown ? round.because : null
  const moving = b.kind === 'step' && st?.checking ? st.checking : null
  const other = pic.otherSide === 'L' ? pic.L : pic.R
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
              <Venn W={VW} H={VH} L={pic.L} R={pic.R} left={{ code: pic.left.code, items: pic.left.items }} right={{ code: pic.right.code, items: pic.right.items, at: pic.rightAt }} tones={tones} fs={FS} refs={refs} />
              {moving && <Mover k={`${r}-${b.kind === 'step' ? b.s : ''}`} name={moving} from={refs.current[moving]} kind={st?.inside ? 'pulse' : 'bounce'} toward={other} />}
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
