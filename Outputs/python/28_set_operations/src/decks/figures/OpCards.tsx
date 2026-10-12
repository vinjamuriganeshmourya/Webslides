import { useRef, useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Focus, Group } from './common'
import { Confetti } from './motion'
import { OutPanel, Show, Swap, CODE_FS, OUT_FS, type OutLine } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { CRICKET, CSE, DrawArrow, OpIcon, Pool, Venn, pair, type ChipTone, type PoolItem, type Shade } from './venn'
import { SPEC } from './spec'

/**
 * C1 TO C6: THE FOUR OPERATIONS ON TEJA'S TWO GROUPS.
 *
 * Every card is the same two parts (generate-slides 2b, one cluster, one
 * container): the program with its output and vote on top, and the picture
 * under it, the two circles and the NEW circle the operation builds. Copies
 * fly out of the chips; cse and cricket keep all 8 and 7 the whole card (the
 * cards' keeps lines). Every program and output is the spec's, run on
 * CPython 3.12.3.
 */
type Prog = { file: string; src: string; output: string }
const isErr = (t: string) => /^[A-Z]\w*Error/.test(t)
const outLines = (s: string): OutLine[] => s.split('\n').map((t) => ({ text: t, tone: isErr(t) ? 'error' : 'plain' }))

const CSE_SIDE = { code: 'cse', items: CSE }
const CRI_SIDE = { code: 'cricket', items: CRICKET }

/* the picture row's geometry: two circles of radius 86, 88 apart, labels above */
const VW = 272
const VH = 202
const G = pair(VW, VH, 86, 88, 14)
const FS = 12
/* slides 8 and 10: the same circles, the picture 2px shorter, so the card ends 20px above the controls */
const SAFE_H = 200
const GS = pair(VW, SAFE_H, 86, 88, 14)

/** The definition the original deck gives: one sentence, the rule's band. */
export function DeckLine({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <Show on={on}>
      <p className="rounded-xl px-3.5 py-2 text-[15px] font-semibold leading-snug" style={{ background: colors.surface2, color: colors.ink, boxShadow: `inset 4px 0 0 ${colors.brandDark}` }}>
        {children}
      </p>
    </Show>
  )
}

/**
 * The shape every operation card shares, two groups (generate-slides 2b):
 * the program with the question and the vote; then the picture, with the
 * output and the original deck's sentence beside the new circle it built.
 * `asking` rings the program and lights the top group; `drawing` lights the
 * picture group.
 */
export function OpFrame({
  code,
  rows,
  at,
  stop,
  ask,
  out,
  vote,
  asking,
  drawing,
  picture,
  line,
  side = 320,
  safe = false,
}: {
  /** fixed heights that end 20px clear of Next and Autoplay on every step (user, 2026-10-08, slides 8 and 10) */
  safe?: boolean
  code: string
  rows: number
  at?: number | null
  stop?: boolean
  ask: string | null
  out: OutLine[]
  vote?: ReactNode
  asking: boolean
  drawing: boolean
  picture: ReactNode
  line?: ReactNode
  side?: number
}) {
  return (
    <div className={`flex flex-col ${safe ? 'gap-2' : 'gap-2.5'}`}>
      <Group pad={safe ? 6 : 10} className="flex items-stretch gap-4" active={asking} style={safe ? { height: 199 } : undefined}>
        <div className="w-[730px] shrink-0">
          <Focus on={asking}>
            <CodePane code={code} fontSize={CODE_FS} rows={rows} at={at ?? null} stop={stop} />
          </Focus>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2.5">
          <StepCaption text={ask} size={18} minH={50} />
          {vote}
        </div>
      </Group>
      <Group pad={safe ? 6 : 8} className="flex items-center gap-4" active={drawing} style={safe ? { height: 212 } : undefined}>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-4">{picture}</div>
        <div className="flex shrink-0 flex-col gap-2" style={{ width: side, transition: "width 520ms cubic-bezier(0.22,1,0.36,1)" }}>
          <OutPanel lines={out} minRows={2} fontSize={OUT_FS} />
          {line}
        </div>
      </Group>
    </div>
  )
}

/** A vote held per card: the pick, and its setter, kept across the card's presses. */
export function usePick() {
  const [pick, setPick] = useState(-1)
  return { pick, setPick }
}

/* ===================================================================== C1 */

const C1 = SPEC.C1
const OPS: { op: '|' | '&' | '-' | '^'; name: string; shade: { l: Shade; both: Shade; r: Shade } }[] = [
  { op: '|', name: C1.show[3], shade: { l: 'lit', both: 'lit', r: 'lit' } },
  { op: '&', name: C1.show[4], shade: { l: 'none', both: 'lit', r: 'none' } },
  { op: '-', name: C1.show[5], shade: { l: 'lit', both: 'none', r: 'none' } },
  { op: '^', name: C1.show[6], shade: { l: 'lit', both: 'none', r: 'lit' } },
]

/**
 * C1. Press 1: the two circles from the hook, big, with the three places
 * labelled under them. Presses 2 to 5: the original deck's icon for one
 * operation lights, and the same parts of the big circles turn blue. The
 * chips never move on this card; no code, no counts (its must lines).
 */
export function ThreePlaces() {
  const beat = useBeats(5)
  const k = beat - 2 /* the operation lit, -1 before */
  const W = 560
  const H = 360
  const g = pair(W, H, 150, 168, 12)
  const placeX = [(g.L.cx - 150 + g.R.cx - 150) / 2, W / 2, (g.L.cx + 150 + g.R.cx + 150) / 2]
  const shade = k >= 0 ? OPS[k].shade : {}
  return (
    <>
      <div className="flex items-stretch gap-6">
        <Group pad={12} className="flex shrink-0 flex-col items-center" active={k >= 0}>
          <Venn W={W} H={H} L={g.L} R={g.R} left={{ ...CSE_SIDE }} right={{ ...CRI_SIDE }} shade={shade} fs={15} />
          {/* the three places, each under its own part of the picture */}
          <div className="relative h-[40px]" style={{ width: W }}>
            {[C1.show[0], C1.show[1], C1.show[2]].map((t, i) => (
              <span key={t} className="absolute top-1 whitespace-nowrap rounded-full px-3 py-1 text-[15px] font-bold" style={{ left: placeX[i], transform: 'translateX(-50%)', background: colors.white, color: colors.brandDark, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
                {t}
              </span>
            ))}
          </div>
        </Group>
        <Group pad={12} className="flex min-w-0 flex-1 flex-col gap-2.5" active={k >= 0 ? undefined : undefined}>
          {OPS.map((o, i) => (
            <div
              key={o.op}
              className="flex items-center gap-4 rounded-xl px-3 py-2"
              style={{
                background: i === k ? colors.white : 'transparent',
                boxShadow: i === k ? `inset 0 0 0 2px ${colors.brand}, 0 8px 18px -12px ${colors.brand}aa` : `inset 0 0 0 1.5px ${colors.line}`,
                opacity: k < 0 || i <= k ? 1 : 0.55,
                transition: 'background-color 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms cubic-bezier(0.22,1,0.36,1), opacity 420ms cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              <OpIcon op={o.op} size={58} on={i === k} />
              <span className="whitespace-nowrap font-heading text-[20px] font-bold" style={{ color: i === k ? colors.brandDark : colors.ink }}>
                {o.name}
              </span>
            </div>
          ))}
          <div className="mt-auto">
            <StepCaption text={k >= 0 ? C1.show[7] : null} tone="rule" size={18} minH={50} />
          </div>
        </Group>
      </div>
      <StepControls at={beat} total={5} />
    </>
  )
}

/* ===================================================================== C2 */

const C2 = SPEC.C2
const C2P: Prog[] = C2.code
const FEST = [...CSE, ...CRICKET.filter((n) => !CSE.includes(n))]

/**
 * C2. Press 1: union.py, the vote 15 / 12 / 3. Press 2: copies of every chip
 * fly into fest, the three from the middle land once, 12. Press 3:
 * union_keep.py, 8 7, and both circles light: still full.
 */
export function Union() {
  const beat = useBeats(3)
  const { pick, setPick } = usePick()
  const refs = useRef<Record<string, HTMLElement | null>>({})
  const prog = beat >= 3 ? C2P[1] : C2P[0]
  const shown = beat >= 2
  const items: PoolItem[] = shown ? FEST.map((n) => ({ name: n, from: refs.current[n] })) : []
  return (
    <>
      <OpFrame
        safe
        code={prog.src}
        rows={5}
        ask={beat === 3 ? C2.show[6] : C2.show[2]}
        out={shown ? outLines(prog.output) : []}
        asking={beat === 1}
        drawing={beat >= 2}
        vote={<Vote options={[C2.show[3], C2.show[4], C2.show[5]]} right={1} shown={shown} pick={pick} setPick={setPick} cols={3} size={18} nowrap dense />}
        picture={
          <>
            <Venn W={VW} H={SAFE_H} L={GS.L} R={GS.R} left={CSE_SIDE} right={CRI_SIDE} shade={beat >= 2 ? { l: 'lit', both: 'lit', r: 'lit' } : {}} refs={refs} outline={{ l: beat === 3, r: beat === 3 }} fs={FS} />
            <DrawArrow on={shown} />
            <Pool items={items} rx={118} ry={84} fs={FS} code="fest" label="Fest crew" lit={beat === 2} />
            </>
        }
        line={<DeckLine on={shown}>{C2.show[0]}</DeckLine>}
      />
      {shown && pick === 1 && <Confetti seed={8} />}
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ===================================================================== C3 */

const C3 = SPEC.C3
const C3P: Prog[] = C3.code
const DAY = ['Meena', 'Ravi']

/**
 * A list as Teja typed it: square brackets, quoted names, one box, `a list`
 * under it, never a circle (the view fixes change spec, 2026-10-09: a list is
 * not a set, so it is never drawn as one; G1's round 4 and C4's last press use
 * it too). `name` is the variable over it, if the list has one. `refs` gets
 * each item as `list:<item>`, for a copy to fly from. It can bounce.
 */
export function ListBox({ items, name, bounce = false, refs }: { items: string[]; name?: string; bounce?: boolean; refs?: React.MutableRefObject<Record<string, HTMLElement | null>> }) {
  const instant = useInstant()
  const ref = useRef<HTMLDivElement>(null)
  const was = useRef(bounce)
  if (bounce && !was.current && !instant) {
    /* the list runs at the operator and is pushed back (C3 press 4) */
    queueMicrotask(() => ref.current?.animate([{ transform: 'none' }, { transform: 'translateX(-46px)' }, { transform: 'translateX(10px)' }, { transform: 'translateX(-4px)' }, { transform: 'none' }], { duration: 900, easing: 'cubic-bezier(0.22,1,0.36,1)' }))
  }
  was.current = bounce
  return (
    <div ref={ref} className="flex flex-col items-center gap-1.5">
      {name && (
        <span className="font-mono text-[16px] font-bold" style={{ color: colors.accentDark }}>
          {name}
        </span>
      )}
      <div className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 font-mono text-[17px] font-semibold" style={{ boxShadow: `inset 0 0 0 2px ${bounce ? colors.danger : colors.line}`, color: colors.ink, transition: 'box-shadow 420ms cubic-bezier(0.22,1,0.36,1)' }}>
        <span style={{ color: colors.muted }}>[</span>
        {items.map((n, i) => (
          <span key={n} className="flex items-center">
            <span ref={(el) => { if (refs) refs.current[`list:${n}`] = el }}>"{n}"</span>
            {i < items.length - 1 && <span style={{ color: colors.muted }}>,</span>}
          </span>
        ))}
        <span style={{ color: colors.muted }}>]</span>
      </div>
      <span className="text-[14px] font-semibold" style={{ color: colors.body }}>
        a list
      </span>
    </div>
  )
}

/**
 * C3. Press 1: union_list.py, day a list. Press 2: its items walk into fest
 * through union(), Ravi lands on his own chip, 9, and the original deck's two
 * lines. Press 3: the same with |, the vote. Press 4: the list bounces off
 * the |, line 3 lights red, the TypeError. cse never changes.
 */
export function UnionList() {
  const beat = useBeats(4)
  const { pick, setPick } = usePick()
  const refs = useRef<Record<string, HTMLElement | null>>({})
  const pipe = beat >= 3
  const prog = beat === 4 ? C3P[1] : pipe ? C3P[1] : C3P[0]
  const walked = beat === 2
  const W = 180
  const one = { cx: W / 2, cy: VH / 2 + 14, r: 86 }
  const items: PoolItem[] = walked ? [...CSE.map((n) => ({ name: n, from: n === 'Ravi' ? refs.current['list:Ravi'] : refs.current[n] })), { name: 'Meena', from: refs.current['list:Meena'] }] : []
  return (
    <>
      <OpFrame
        code={prog.src}
        rows={4}
        at={beat === 4 ? 3 : null}
        stop={beat === 4}
        ask={beat === 4 ? C3.show[7] : pipe ? C3.show[3] : C3.show[0]}
        out={beat === 2 ? outLines(C3P[0].output) : beat === 4 ? outLines(C3P[1].output) : []}
        asking={beat === 1 || beat === 3}
        drawing={beat === 2 || beat === 4}
        vote={
          <Swap k={pipe ? 'vote' : 'line'}>
            {pipe ? (
              <Vote options={[C3.show[4], C3.show[5], C3.show[6]]} right={2} shown={beat >= 4} pick={pick} setPick={setPick} template="1fr 1fr 1.7fr" size={17} nowrap dense />
            ) : (
              <Show on={beat >= 2}>
                <div className="rounded-xl px-4 py-1.5" style={{ background: colors.surface2, boxShadow: `inset 4px 0 0 ${colors.brandDark}` }}>
                  <p className="font-mono text-[17px] font-bold leading-snug" style={{ color: colors.brandDark }}>
                    {C3.show[1]}
                  </p>
                  <p className="text-[15px] font-semibold leading-snug" style={{ color: colors.ink }}>
                    {C3.show[2]}
                  </p>
                </div>
              </Show>
            )}
          </Swap>
        }
        picture={
          <>
            <Venn W={W} H={VH} L={one} R={null} left={CSE_SIDE} refs={refs} fs={FS} />
            <span className="grid h-[46px] min-w-[86px] place-items-center rounded-xl bg-white px-2 font-mono text-[20px] font-bold" style={{ color: beat === 4 ? colors.danger : colors.brandDark, boxShadow: `inset 0 0 0 2px ${beat === 4 ? colors.danger : colors.line}`, transition: 'color 420ms, box-shadow 420ms' }}>
              <Swap k={pipe ? 'pipe' : 'union'}>{pipe ? '|' : '.union( )'}</Swap>
            </span>
            <ListBox items={DAY} name="day" bounce={beat === 4} refs={refs} />
            {!pipe && <DrawArrow on={walked} w={48} />}
            {!pipe && <Pool items={items} rx={100} ry={84} fs={FS} code="fest" lit={walked} />}
          </>
        }
        side={pipe ? 600 : 250}
      />
      {beat >= 4 && pick === 2 && <Confetti seed={9} />}
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ===================================================================== C4 */

const C4 = SPEC.C4
const C4P: Prog[] = C4.code
const BOTH = CSE.filter((n) => CRICKET.includes(n))
const PICK3 = ['Arjun', 'Anu', 'Meena']

/**
 * C4, four presses (three until the view fixes of 2026-10-09). Press 1:
 * both.py, the vote 12 / 3 / 0. Press 2: only the middle chips lift out into
 * a new circle, both; 3 and the set. Press 3: cse.intersection(a list): the
 * list drawn as a list, in square brackets, not as a circle; the 12 / 3 / 0
 * choices go (they belong to the first program); the output waits for the
 * room. Press 4: Anu lifts out of the list into result, {'Anu'}.
 */
const ONE_W = 180
const ONE_L = { cx: ONE_W / 2, cy: SAFE_H / 2 + 14, r: 86 }
export function Intersection() {
  const beat = useBeats(4)
  const { pick, setPick } = usePick()
  const refs = useRef<Record<string, HTMLElement | null>>({})
  const list = beat >= 3
  const prog = list ? C4P[1] : C4P[0]
  const out = beat === 2 ? outLines(C4P[0].output) : beat === 4 ? outLines(C4P[1].output) : []
  const pool: PoolItem[] = beat === 2 ? BOTH.map((n) => ({ name: n, from: refs.current[n] })) : beat === 4 ? [{ name: 'Anu', from: refs.current['list:Anu'] }] : []
  return (
    <>
      <OpFrame
        safe
        code={prog.src}
        rows={5}
        ask={list ? C4.show[7] : beat === 2 ? C4.show[6] : C4.show[2]}
        out={out}
        asking={beat === 1 || beat === 3}
        drawing={beat === 2 || beat === 4}
        vote={
          <Show on={!list}>
            <Vote options={[C4.show[3], C4.show[4], C4.show[5]]} right={1} shown={beat >= 2} pick={pick} setPick={setPick} cols={3} size={18} nowrap dense />
          </Show>
        }
        picture={
          list ? (
            <>
              <Venn W={ONE_W} H={SAFE_H} L={ONE_L} R={null} left={CSE_SIDE} refs={refs} fs={FS} tones={beat === 4 ? { Anu: 'lit' } : {}} />
              <ListBox items={PICK3} refs={refs} />
              <DrawArrow on={beat === 4} w={48} />
              <Pool items={pool} rx={86} ry={78} fs={FS} code="result" lit={beat === 4} />
            </>
          ) : (
            <>
              <Venn W={VW} H={SAFE_H} L={GS.L} R={GS.R} left={CSE_SIDE} right={CRI_SIDE} shade={beat === 2 ? { both: 'lit' } : {}} refs={refs} fs={FS} />
              <DrawArrow on={beat === 2} />
              <Pool items={pool} rx={86} ry={78} fs={FS} code="both" lit={beat === 2} />
            </>
          )
        }
        line={<DeckLine on={beat >= 2}>{C4.show[0]}</DeckLine>}
      />
      {beat >= 2 && pick === 1 && <Confetti seed={10} />}
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ===================================================================== C5 */

const C5 = SPEC.C5
const C5P: Prog[] = C5.code
const ONLY_CSE = CSE.filter((n) => !CRICKET.includes(n))
const ONLY_CRI = CRICKET.filter((n) => !CSE.includes(n))

/**
 * C5. Press 1: only_cse.py, say how many. Press 2: the middle greys in cse,
 * the outer part of cse lifts out, 5. Press 3: cricket - cse, the vote
 * 5 / 4 / 9. Press 4: this time the outer part of cricket lifts out, 4. The
 * order matters.
 */
export function Difference() {
  const beat = useBeats(4)
  const { pick, setPick } = usePick()
  const refs = useRef<Record<string, HTMLElement | null>>({})
  const swapped = beat >= 3
  const prog = swapped ? C5P[1] : C5P[0]
  const done = beat === 2 || beat === 4
  const shade: { l?: Shade; both?: Shade; r?: Shade } = beat === 2 ? { l: 'lit', both: 'grey' } : beat === 4 ? { r: 'lit', both: 'grey' } : {}
  const pool: PoolItem[] = beat === 2 ? ONLY_CSE.map((n) => ({ name: n, from: refs.current[n] })) : beat === 4 ? ONLY_CRI.map((n) => ({ name: n, from: refs.current[n] })) : []
  const tones: Record<string, ChipTone> = done ? Object.fromEntries(BOTH.map((n) => [n, 'grey' as ChipTone])) : {}
  return (
    <>
      <OpFrame
        code={prog.src}
        rows={4}
        ask={beat === 4 ? C5.show[7] : swapped ? C5.show[3] : C5.show[2]}
        out={done ? outLines(prog.output) : []}
        asking={beat === 1 || beat === 3}
        drawing={done}
        vote={
          <Show on={swapped}>
            <Vote options={[C5.show[4], C5.show[5], C5.show[6]]} right={1} shown={beat >= 4} pick={pick} setPick={setPick} cols={3} size={18} nowrap dense />
          </Show>
        }
        picture={
          <>
            <Venn W={VW} H={VH} L={G.L} R={G.R} left={CSE_SIDE} right={CRI_SIDE} shade={shade} tones={tones} refs={refs} fs={FS} />
            <DrawArrow on={pool.length > 0} />
            <Pool items={pool} rx={92} ry={80} fs={FS} code={swapped ? 'only_cricket' : 'only_cse'} lit={pool.length > 0} />
            </>
        }
        line={<DeckLine on={beat >= 2}>{C5.show[0]}</DeckLine>}
      />
      {beat >= 4 && pick === 1 && <Confetti seed={11} />}
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ===================================================================== C6 */

const C6 = SPEC.C6
const C6P: Prog[] = C6.code
const ONE_GROUP = [...ONLY_CSE, ...ONLY_CRI]

/**
 * C6, four presses (three until the view fixes of 2026-10-09). Press 1:
 * one_group.py, the vote 12 / 9 / 3. Press 2: the middle greys, both outer
 * parts lift out together into one circle, 9. Press 3: the method; its output
 * waits for the room. Press 4: 9.
 */
export function SymDiff() {
  const beat = useBeats(4)
  const { pick, setPick } = usePick()
  const refs = useRef<Record<string, HTMLElement | null>>({})
  const method = beat >= 3
  const prog = method ? C6P[1] : C6P[0]
  const out = beat === 2 || beat === 4 ? outLines(prog.output) : []
  return (
    <>
      <OpFrame
        code={prog.src}
        rows={4}
        ask={beat >= 2 ? C6.show[6] : C6.show[2]}
        out={out}
        asking={beat === 1 || beat === 3}
        drawing={beat === 2 || beat === 4}
        vote={<Vote options={[C6.show[3], C6.show[4], C6.show[5]]} right={1} shown={beat >= 2} pick={pick} setPick={setPick} cols={3} size={18} nowrap dense />}
        picture={
          <>
            <Venn W={VW} H={VH} L={G.L} R={G.R} left={CSE_SIDE} right={CRI_SIDE} shade={beat >= 2 ? { l: 'lit', both: 'grey', r: 'lit' } : {}} tones={beat >= 2 ? Object.fromEntries(BOTH.map((n) => [n, 'grey' as ChipTone])) : {}} refs={refs} fs={FS} />
            <DrawArrow on={beat >= 2} />
            <Pool items={beat >= 2 ? ONE_GROUP.map((n) => ({ name: n, from: refs.current[n] })) : []} rx={118} ry={86} fs={FS} code="one_group" lit={beat >= 2} />
            </>
        }
        line={<DeckLine on={beat >= 2}>{C6.show[0]}</DeckLine>}
      />
      {beat >= 2 && pick === 1 && <Confetti seed={12} />}
      <StepControls at={beat} total={4} />
    </>
  )
}
