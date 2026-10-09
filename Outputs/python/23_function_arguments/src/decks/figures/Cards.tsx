import { useRef, useState, type ReactNode, type RefObject } from 'react'
import { colors } from '@/design/tokens'
import { CodeBlock, type CodeLineState, useBeats } from '@/ui'
import { StepControls } from './controls'
import { Confetti } from './motion'
import { Ask, Show } from './pieces'
import { StepCaption, Vote } from './trace'
import { Areas, CallCode, IoBox, traceOf, usePhase, type Step } from './call'
import { SlotHeader, TagPill, fillOf, fromToken, type By, type Fill } from './slots'
import { SPEC } from './spec'

/**
 * THE CONCEPT CARDS OF PF 23: C1 to C8, E1, E2.
 *
 * Every slot card is the session's one picture (`slots.tsx`): the def's header
 * with a slot per argument on top; under it the program, with the line the
 * card is about lit; beside it the input, the output and the question. A value
 * flies from its own word in the call line into its slot, wearing its label or
 * its number. Every program, output, step, caption and option is the spec's.
 *
 * Commit, then reveal (spec rule 2): an output and a vote's right option show
 * only on the press after the room has answered.
 */

const IN = (s: string) => s.split('\n')
const out = (s: string) => s.split('\n')


/** The program, with the lines the card is about in their states. `host` lets a value find its word. */
function Prog({ host, code, fs = 17, lines = {}, rows, width }: { host?: RefObject<HTMLDivElement | null>; code: string; fs?: number; lines?: Record<number, CodeLineState>; rows?: number; width?: number }) {
  return (
    <div ref={host} className="relative shrink-0" style={{ width }}>
      <CodeBlock code={code} filename="Python" chip={false} fontSize={fs} rows={rows ?? code.split('\n').length} lines={lines} />
    </div>
  )
}

/** The input and output, side by side. */
function Io({ input, lines, rows = 1, fs = 17, ring, wrap, nothing }: { input: string; lines: string[]; rows?: number; fs?: number; ring?: number[]; wrap?: boolean; nothing?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <IoBox title="Input" tone="in" lines={IN(input)} rows={2} fs={fs} width={170} />
      <div className="min-w-0 flex-1">
        <IoBox title="Output" lines={lines} rows={rows} fs={fs} ring={ring} wrap={wrap} nothing={nothing} />
      </div>
    </div>
  )
}

/** A card's body: the header on top, then the program left and the rest right. */
function SlotBody({ header, code, right, codeW = 520, gap = 28 }: { header: ReactNode; code: ReactNode; right: ReactNode; codeW?: number; gap?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {header}
      <div className="flex items-start" style={{ gap }}>
        <div className="shrink-0" style={{ width: codeW }}>
          {code}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">{right}</div>
      </div>
    </div>
  )
}

const PARAMS = ['arg_1', 'arg_2']

/* ================================================================== C1 */

const C1 = SPEC.C1

/**
 * MORE THAN ONE ARGUMENT. Spec card C1, three presses. 1: the shape, the
 * biggest text, with two empty slots, and its line. 2: greet_by_name.py, the
 * input, an empty output, the question. 3: one move: greeting travels with
 * its label arg_1= into arg_1, name with arg_2= into arg_2; the output fills.
 */
export function TwoArgs() {
  const beat = useBeats(3)
  const host = useRef<HTMLDivElement>(null)
  const k = C1.code[0]
  const p3 = usePhase(beat, 3, [1500])
  const fills: Record<string, Fill | null> =
    beat >= 3
      ? {
          arg_1: { value: 'Good Morning', by: 'name', from: fromToken(host, 6, 'arg_1=greeting') },
          arg_2: { value: 'Ram', by: 'name', from: fromToken(host, 6, 'arg_2=name'), delay: 450 },
        }
      : {}
  return (
    <>
      <SlotBody
        header={<SlotHeader fn={beat >= 2 ? 'greet' : 'function_name'} params={PARAMS} fills={fills} size={beat >= 2 ? 26 : 30} />}
        code={
          beat >= 2 ? (
            <Prog host={host} code={k.src} fs={20} lines={{ 6: 'now' }} />
          ) : (
            <StepCaption text={C1.show[1]} tone="rule" size={24} minH={64} />
          )
        }
        right={
          <Show on={beat >= 2} className="flex flex-col gap-3">
            <Io input={k.input} lines={beat >= 3 && p3 >= 1 ? out(k.output) : []} />
            {beat === 2 && <Ask size={26}>{C1.show[2]}</Ask>}
            {beat >= 3 && <StepCaption text={C1.show[3]} tone="rule" size={20} minH={56} />}
          </Show>
        }
      />
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ================================================================== C2 */

const C2 = SPEC.C2

/**
 * BY NAME, ANY ORDER. Spec card C2, two presses. 1: greet_both.py with line 7
 * lit, the vote Same or Different. 2: line 7's values travel by label into the
 * same slots; the output shows two equal lines, one under the other.
 */
export function AnyOrder() {
  const beat = useBeats(2)
  const host = useRef<HTMLDivElement>(null)
  const [pick, setPick] = useState(-1)
  const k = C2.code[0]
  const opts = [C2.show[1], C2.show[2]]
  const right = 0
  const p2 = usePhase(beat, 2, [1500])
  const fills: Record<string, Fill | null> =
    beat >= 2
      ? {
          arg_2: { value: 'Ram', by: 'name', from: fromToken(host, 7, 'arg_2=name') },
          arg_1: { value: 'Good Morning', by: 'name', from: fromToken(host, 7, 'arg_1=greeting'), delay: 450 },
        }
      : {}
  return (
    <>
      <SlotBody
        header={<SlotHeader params={PARAMS} fills={fills} />}
        code={<Prog host={host} code={k.src} fs={19} lines={{ 7: 'now' }} />}
        right={
          <>
            <Io input={k.input} lines={beat >= 2 && p2 >= 1 ? out(k.output) : []} rows={2} />
            <Ask size={24}>{C2.show[0]}</Ask>
            <Vote options={opts} right={right} shown={beat >= 2} pick={pick} setPick={setPick} size={20} mono={false} />
            {beat >= 2 && <StepCaption text={C2.show[3]} tone="rule" size={20} minH={52} />}
          </>
        }
      />
      {beat >= 2 && pick === right && <Confetti seed={7} />}
      <StepControls at={beat} total={2} />
    </>
  )
}

/* ================================================================== C3 */

const C3 = SPEC.C3

/**
 * NO NAMES: BY POSITION. Spec card C3, two presses. 1: greet_by_position.py,
 * line 6 lit, the question. 2: the two values take the tags 1st and 2nd and
 * travel in order to the 1st and 2nd slots; the output fills.
 */
export function ByPosition() {
  const beat = useBeats(2)
  const host = useRef<HTMLDivElement>(null)
  const k = C3.code[0]
  const p2 = usePhase(beat, 2, [1500])
  const fills: Record<string, Fill | null> =
    beat >= 2
      ? {
          arg_1: { value: 'Good Morning', by: 'position', n: 1, from: fromToken(host, 6, 'greeting') },
          arg_2: { value: 'Ram', by: 'position', n: 2, from: fromToken(host, 6, 'name'), delay: 450 },
        }
      : {}
  return (
    <>
      <SlotBody
        header={<SlotHeader params={PARAMS} fills={fills} />}
        code={<Prog host={host} code={k.src} fs={20} lines={{ 6: 'now' }} />}
        right={
          <>
            <Io input={k.input} lines={beat >= 2 && p2 >= 1 ? out(k.output) : []} />
            <StepCaption text={beat >= 2 ? C3.show[1] : C3.show[0]} tone={beat >= 2 ? 'rule' : 'step'} size={21} minH={60} />
          </>
        }
      />
      <StepControls at={beat} total={2} />
    </>
  )
}

/* ================================================================== C4 */

const C4 = SPEC.C4

/** An arrow pointing up at a call, with its label under it. 9px head, the shaft ends straight into it (rules 45, 46). */
function UpArrow({ on, label }: { on: boolean; label: string }) {
  return (
    <Show on={on} className="flex flex-col items-start gap-1 pl-10">
      <svg width="20" height="58" viewBox="0 0 20 58" aria-hidden>
        <path d="M 10 56 V 11" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" />
        <path d="M 10 2 L 5 11 L 15 11 Z" fill={colors.accent} />
      </svg>
      <span className="text-[26px] font-bold" style={{ color: colors.accentDark }}>
        {label}
      </span>
    </Show>
  )
}

/**
 * TWO NAMES FOR TWO WAYS. Spec card C4, three presses. 1: the header on top,
 * the two calls under it. 2: an arrow under the first call, Positional
 * arguments. 3: an arrow under the second, Keyword arguments.
 */
export function TwoWays() {
  const beat = useBeats(3)
  const call = (t: string) => (
    <span className="inline-block whitespace-nowrap rounded-2xl bg-white px-6 py-3 font-mono text-[26px] font-bold" style={{ color: colors.brandDark, boxShadow: `inset 0 0 0 2px ${colors.line}` }}>
      {t}
    </span>
  )
  return (
    <>
      <div className="flex flex-col gap-8">
        <SlotHeader params={PARAMS} />
        <div className="flex items-start gap-16">
          <div className="flex flex-col gap-3">
            {call(C4.show[0])}
            <UpArrow on={beat >= 2} label={C4.show[1]} />
          </div>
          <div className="flex flex-col gap-3">
            {call(C4.show[2])}
            <UpArrow on={beat >= 3} label={C4.show[3]} />
          </div>
        </div>
      </div>
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ================================================================== C5 */

const C5 = SPEC.C5

function SwapIcon() {
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full" style={{ background: colors.white, boxShadow: `inset 0 0 0 1.5px ${colors.line}, 0 2px 6px rgba(16,32,58,0.14)` }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.body} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M8 20V5M4 9l4-4 4 4" />
        <path d="M16 4v15M12 15l4 4 4-4" />
      </svg>
    </span>
  )
}

/**
 * SWAP THEM. Spec card C5, two presses. 1: greet_swap.py, line 6 lit, the
 * input, the question and its three options; no output (its must_not). 2: name
 * takes the 1st tag into arg_1, greeting the 2nd into arg_2; the output is the
 * other way round, with no error; the two lines, and the hook's swap button.
 */
export function SwapThem() {
  const beat = useBeats(2)
  const host = useRef<HTMLDivElement>(null)
  const [pick, setPick] = useState(-1)
  const k = C5.code[0]
  const right = C5.vote.indexOf(k.output)
  const p2 = usePhase(beat, 2, [1500])
  const fills: Record<string, Fill | null> =
    beat >= 2
      ? {
          arg_1: { value: 'Ram', by: 'position', n: 1, from: fromToken(host, 6, 'name') },
          arg_2: { value: 'Good Morning', by: 'position', n: 2, from: fromToken(host, 6, 'greeting'), delay: 450 },
        }
      : {}
  return (
    <>
      <SlotBody
        header={<SlotHeader params={PARAMS} fills={fills} size={22} boxW={260} />}
        code={<Prog host={host} code={k.src} fs={20} lines={{ 6: 'now' }} />}
        right={
          <>
            <Io input={k.input} lines={beat >= 2 && p2 >= 1 ? out(k.output) : []} />
            {beat === 1 && <Ask size={24}>{C5.show[0]}</Ask>}
            <Vote options={C5.vote} right={right} shown={beat >= 2} pick={pick} setPick={setPick} size={17} cols={1} dense />
            {beat >= 2 && (
              <div className="flex items-center gap-3">
                <SwapIcon />
                <div className="min-w-0 flex-1">
                  <StepCaption text={`${C5.show[4]} ${C5.show[5]}`} tone="rule" size={17} minH={50} />
                </div>
              </div>
            )}
          </>
        }
      />
      {beat >= 2 && pick === right && <Confetti seed={11} />}
      <StepControls at={beat} total={2} />
    </>
  )
}

/* ================================================================== E1 */

const E1 = SPEC.E1
type SlotStep = { kind: 'call' | 'fill' | 'print'; call?: string; var?: string | null; slot?: string; value?: string; by?: By; caption: string; printed?: string; slots: Record<string, string | null>; call_no: number; line: number }
const E1_STEPS: SlotStep[] = E1.data.steps
const E1_CALLS: string[] = E1.data.calls

/**
 * FILL THE SLOTS. Spec card E1, eighteen presses. 1: the program, the header
 * with two empty slots, the input, an empty output and the vote. 2 to 17: one
 * move per press from the data: a call line lights (the slots empty), a value
 * travels to its slot wearing its label or its number, line 2 prints and the
 * line lands in the output. 18: the four lines stay; the odd one is ringed.
 */
export function FillSlots() {
  const beat = useBeats(18)
  const host = useRef<HTMLDivElement>(null)
  const [pick, setPick] = useState(-1)
  const k = E1.code[0]
  const i = beat >= 2 ? Math.min(beat - 2, E1_STEPS.length - 1) : -1
  const st = i >= 0 ? E1_STEPS[i] : null
  const end = beat >= 18
  /* each slot's value and how it came, read back to the step that filled it in this call */
  const fills: Record<string, Fill | null> = {}
  const keys: Record<string, string> = {}
  if (st) {
    for (const p of PARAMS) {
      if (st.slots[p] == null) continue
      const j = E1_STEPS.findIndex((x, n) => n <= i && x.call_no === st.call_no && x.kind === 'fill' && x.slot === p)
      const f = E1_STEPS[j]
      fills[p] = fillOf({ var: f.var, slot: p, value: f.value!, by: f.by! }, E1_CALLS[st.call_no - 1], host, st.line)
      keys[p] = `${st.call_no}-${p}`
    }
  }
  const printed = E1_STEPS.slice(0, i + 1).filter((x) => x.kind === 'print').map((x) => x.printed!)
  const lines: Record<number, CodeLineState> = {}
  if (st) {
    if (st.kind === 'print') {
      lines[st.line] = 'warn'
      lines[2] = 'now'
    } else lines[st.line] = 'now'
  }
  const odd = E1.data.output.findIndex((o: string, n: number) => o !== E1.data.output[0] && n > 0)
  const right = 1
  return (
    <>
      <SlotBody
        header={<SlotHeader params={PARAMS} fills={fills} keys={keys} size={22} boxW={240} />}
        codeW={500}
        code={<Prog host={host} code={k.src} fs={15} lines={end ? {} : lines} />}
        right={
          <>
            <Io input={k.input} lines={end ? E1.data.output : printed} rows={4} fs={16} ring={end ? [odd] : []} />
            <StepCaption badge={end || !st ? null : `line ${st.kind === 'print' ? 2 : st.line}`} text={end ? E1.show[3] : st ? st.caption : E1.show[0]} tone={end ? 'rule' : 'step'} size={18} minH={56} />
            <Vote options={[E1.show[1], E1.show[2]]} right={right} shown={end} pick={pick} setPick={setPick} size={18} mono={false} />
          </>
        }
      />
      {end && pick === right && <Confetti seed={12} />}
      <StepControls at={beat} total={18} />
    </>
  )
}

/* ================================================================== C6 */

const C6 = SPEC.C6
const [ONE, NONE, ONLY2] = C6.code as { src: string; output: string; input: string }[]

/**
 * LEAVE ONE OUT. Spec card C6, five presses. 1: greet_one.py, line 6 lit, the
 * question. 2: greeting fills arg_1; arg_2 stays empty and turns red; the
 * TypeError names arg_2. 3: line 6 becomes greet(); both slots red. 4: line 6
 * becomes greet(arg_2=name), the question. 5: arg_2 fills, arg_1 turns red,
 * the TypeError names arg_1, and the rule.
 */
export function LeaveOneOut() {
  const beat = useBeats(5)
  const host = useRef<HTMLDivElement>(null)
  const prog = beat <= 2 ? ONE : beat === 3 ? NONE : ONLY2
  const shown = beat === 2 || beat === 3 || beat === 5
  const fills: Record<string, Fill | null> =
    beat === 2
      ? { arg_1: { value: 'Good Morning', by: 'position', n: 1, from: fromToken(host, 6, 'greeting') } }
      : beat === 5
        ? { arg_2: { value: 'Ram', by: 'name', from: fromToken(host, 6, 'arg_2=name') } }
        : {}
  const missing = beat === 2 ? ['arg_2'] : beat === 3 ? PARAMS : beat === 5 ? ['arg_1'] : []
  const caption = beat === 1 ? C6.show[0] : beat === 4 ? C6.show[2] : beat === 5 ? C6.show[1] : null
  return (
    <>
      <SlotBody
        header={<SlotHeader params={PARAMS} fills={fills} missing={missing} />}
        code={<Prog key={prog.src} host={host} code={prog.src} fs={20} lines={{ 6: shown ? 'error' : 'now' }} />}
        right={
          <>
            <Io input={prog.input} lines={shown ? out(prog.output) : []} rows={2} fs={16} wrap />
            <StepCaption text={caption} tone={beat === 5 ? 'rule' : 'step'} size={21} minH={56} />
          </>
        }
      />
      <StepControls at={beat} total={5} />
    </>
  )
}

/* ================================================================== C7 */

const C7 = SPEC.C7
const C7_CODE: string = C7.code[0].src
const C7_LINES = C7_CODE.split('\n')
const C7_STEPS: SlotStep[][] = C7.data.steps
const C7_DEFAULTS = { arg_1: 'Hi', arg_2: 'Ram' }

/**
 * DEFAULT VALUES, FOUR CALLS. Spec card C7, nine presses. 1: the header with
 * its two defaults, faint in the slots, the line and the label; the program
 * with line 6 still to come. Then each call twice: the call is asked (line 6
 * becomes it), then answered: the passed value lands in its slot, the default
 * fills the other with the tag `default`, and the output.
 */
export function FourCalls() {
  const beat = useBeats(9)
  const host = useRef<HTMLDivElement>(null)
  const c = beat >= 2 ? Math.floor((beat - 2) / 2) : -1
  const answered = beat >= 3 && (beat - 2) % 2 === 1
  const at = c >= 0 ? 3 + c * 2 : 99
  const p = usePhase(beat, at, [200, 1100, 1100])
  const phase = answered ? p : 0
  const call: string | null = c >= 0 ? C7.data.calls[c] : null
  const code = C7_LINES.map((l, n) => (n === 5 ? (call ?? '') : l)).join('\n')
  const steps = c >= 0 ? C7_STEPS[c] : []
  const fills: Record<string, Fill | null> = {}
  const keys: Record<string, string> = {}
  if (answered) {
    steps
      .filter((s) => s.kind === 'fill')
      .forEach((s, n) => {
        if (phase < n + 1) return
        fills[s.slot!] = fillOf({ var: s.var, slot: s.slot!, value: s.value!, by: s.by! }, call!, host, 6)
        keys[s.slot!] = `${c}-${s.slot}`
      })
  }
  const caption = answered
    ? steps
        .filter((s) => s.kind === 'fill')
        .slice(0, Math.max(1, Math.min(2, phase)))
        .map((s) => s.caption)
        .join(' ')
    : c >= 0
      ? C7.show[2]
      : C7.show[0]
  return (
    <>
      <SlotBody
        header={
          <div className="flex items-end gap-6">
            <SlotHeader params={PARAMS} fills={fills} keys={keys} defaults={C7_DEFAULTS} size={24} boxW={250} />
            <span className="mb-4">
              <TagPill by="default" text={C7.show[1]} size={18} />
            </span>
          </div>
        }
        code={<Prog key={call ?? 'none'} host={host} code={code} fs={20} rows={6} lines={c >= 0 ? { 6: 'now' } : { 6: 'dead' }} />}
        right={
          <>
            <Io input={C7.code[0].input} lines={answered && phase >= 3 ? [C7.data.outputs[c]] : []} />
            <StepCaption key={`${beat}`} text={caption} tone={c < 0 ? 'rule' : 'step'} size={19} minH={84} />
          </>
        }
      />
      <StepControls at={beat} total={9} />
    </>
  )
}

/* ================================================================== C8 */

const C8 = SPEC.C8
const [BAD, GOOD] = C8.code as { src: string; output: string; input: string }[]

/**
 * DEFAULTS GO LAST. Spec card C8, two presses. 1: order_bad.py, line 1 red,
 * arg_1="Hi" labelled Default argument and arg_2 Non-default argument; the
 * SyntaxError; the rule. 2: order_good.py: the two slots trade places, arg_2
 * first and arg_1="Hi" last; the call fills them; Hi Teja.
 */
export function DefaultsLast() {
  const beat = useBeats(2)
  const host = useRef<HTMLDivElement>(null)
  const good = beat >= 2
  const prog = good ? GOOD : BAD
  const p2 = usePhase(beat, 2, [900, 1100])
  const fills: Record<string, Fill | null> =
    good && p2 >= 1
      ? {
          arg_2: { value: 'Teja', by: 'name', from: fromToken(host, 6, 'arg_2=name') },
          arg_1: { value: 'Hi', by: 'default', delay: 450 },
        }
      : {}
  return (
    <>
      <SlotBody
        header={
          <SlotHeader
            params={good ? ['arg_2', 'arg_1'] : PARAMS}
            fills={fills}
            defaults={{ arg_1: 'Hi' }}
            under={{ arg_1: C8.show[0], arg_2: C8.show[1] }}
            missing={[]}
            size={24}
            boxW={250}
          />
        }
        code={<Prog key={prog.src} host={host} code={prog.src} fs={20} lines={good ? { 1: 'mark' } : { 1: 'error' }} />}
        right={
          <>
            <Io input={prog.input} lines={good ? (p2 >= 2 ? out(prog.output) : []) : out(prog.output)} rows={2} fs={16} wrap />
            <StepCaption key={beat} text={good ? C8.show[3] : C8.show[2]} tone="rule" size={20} minH={56} />
          </>
        }
      />
      <StepControls at={beat} total={2} />
    </>
  )
}

/* ================================================================== E2 */

const E2 = SPEC.E2
const [INC, INC_RET] = E2.code as { src: string; output: string; input: string }[]
const E2_STEPS: Step[] = E2.data.steps
const E2_FRAMES = traceOf(E2_STEPS, INC.src)

/**
 * SAME NAME, TWO BOXES. Spec card E2, ten presses. 1: increment.py, the input
 * 5, an empty output, the vote 5 or 6. 2 to 8: one move per press from the
 * data, session 22's call picture: the call opens increment's own area with
 * its own box a; a += 1 makes that box 6; the call ends and the box and its 6
 * vanish (no ghost, and no arrow from the inside box to the outside one: its
 * must_not); line 6 prints 5. 9: the outside box ringed, the two lines. 10:
 * increment_return.py, the 6 handed back and stored, it prints 6.
 */
export function TwoBoxes() {
  const beat = useBeats(10)
  const [pick, setPick] = useState(-1)
  const i = beat >= 2 ? Math.min(beat - 2, E2_STEPS.length - 1) : -1
  const ret = beat >= 10
  const ring = beat === 9
  const frame = ret ? null : i >= 0 ? E2_FRAMES[i] : null
  const prev = i >= 1 && !ret ? E2_FRAMES[i - 1] : null
  const s = frame?.step ?? null
  const main = ret ? { a: 6 } : (s?.main ?? {})
  const caption = ret ? E2.show[5] : ring ? `${E2.show[3]} ${E2.show[4]}` : s ? s.caption : E2.show[0]
  const outLines = ret ? [INC_RET.output] : (s?.screen ?? [])
  const right = 0
  return (
    <>
      <div className="flex items-start gap-6">
        <div className="flex shrink-0 flex-col gap-3" style={{ width: 520 }}>
          <CallCode key={ret ? 'ret' : 'inc'} code={ret ? INC_RET.src : INC.src} fs={19} rows={7} frame={ring ? null : frame} mark={ret ? [3, 6] : []} />
          <StepCaption badge={ret || ring || !frame?.at ? null : `line ${frame.at}`} text={caption} tone={ring || ret ? 'rule' : 'step'} size={18} minH={56} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-start gap-3">
            <IoBox title="Input" tone="in" lines={[INC.input]} rows={1} fs={17} width={150} />
            <div className="min-w-0 flex-1">
              <IoBox title="Output" lines={outLines.map(String)} rows={1} fs={17} ring={ring ? [0] : []} />
            </div>
          </div>
          <Areas
            fn="increment"
            main={main as unknown as Record<string, string>}
            local={(ret ? {} : (s?.local ?? {})) as Record<string, string>}
            inCall={!!frame?.inCall}
            prevMain={(prev?.step?.main ?? (ret ? { a: 5 } : {})) as Record<string, string>}
            prevLocal={(prev?.step?.local ?? {}) as Record<string, string>}
            backFrom={ret ? 'a' : null}
            ringMain={ring ? 'a' : undefined}
            width="100%"
            dir="row"
            callH={92}
            mainH={92}
          />
          <Vote options={[E2.show[1], E2.show[2]]} right={right} shown={beat >= 8} pick={pick} setPick={setPick} size={20} />
        </div>
      </div>
      {beat >= 8 && pick === right && <Confetti seed={21} />}
      <StepControls at={beat} total={10} />
    </>
  )
}

