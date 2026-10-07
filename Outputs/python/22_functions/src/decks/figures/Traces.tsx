import { useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Confetti } from './motion'
import { Ask, Show, sentences } from './pieces'
import { StepCaption, Vote } from './trace'
import { Areas, CallCode, IoBox, traceOf, usePhase, type Frame, type Step } from './call'
import { DefShapeLine } from './Shapes'
import { SPEC } from './spec'

/**
 * THE TRACE CARDS OF PF 22: E1, C8, C9, C11, C12.
 *
 * Every one is the session's one picture (`call.tsx`): the program with its
 * marker and jump arrows on the left, the step's caption under it; on the
 * right the input and output, the two areas (`Inside greet` only while the
 * call runs), and the vote. Every step, caption, box and screen line is the
 * spec's `data.steps`, read, never retyped. One move per press (spec rule 1),
 * except C8, whose two presses each play one whole call "as one move".
 *
 * Commit, then reveal (spec rule 2): a vote's right option and the output
 * only show on the presses after the room has answered.
 */

const optionText = (o: string) => o.replace(/ \/ /g, '\n')
const rightOf = (answer: string) => 'ABCD'.indexOf(answer.trim()[0])

/** The shared body: code and caption left, I/O, areas and vote right. */
function TraceBody({
  code,
  fs,
  frame,
  prev,
  input,
  out,
  outRows,
  nothing,
  caption,
  badge,
  rule,
  vote,
  codeExtras,
  grey,
  error,
  exit,
  route,
  backFrom,
  extraMain,
  labels,
  codeW = 520,
  gap = 24,
}: {
  code: string
  fs: number
  frame: Frame | null
  prev: Frame | null
  input: string[]
  out: string[]
  outRows: number
  nothing?: boolean
  caption: string | null
  badge?: string | null
  rule?: boolean
  vote?: ReactNode
  codeExtras?: ReactNode
  grey?: number[]
  error?: number | null
  exit?: number | null
  route?: Parameters<typeof CallCode>[0]['route']
  backFrom?: string | null
  extraMain?: Record<string, string>
  labels?: Record<number, string>
  codeW?: number
  /** room between the code and the right column: C12's exit arrow lives in it */
  gap?: number
}) {
  const s: Step | null = frame?.step ?? null
  const ps: Step | null = prev?.step ?? null
  const main = { ...(s?.main ?? {}), ...(extraMain ?? {}) }
  return (
    <div className="flex items-start" style={{ gap }}>
      <div className="flex shrink-0 flex-col gap-3" style={{ width: codeW + 46 }}>
        <CallCode code={code} fs={fs} frame={frame} grey={grey} error={error} exit={exit} route={route} labels={labels} />
        {codeExtras}
        <StepCaption badge={badge} text={caption} tone={rule ? 'rule' : 'step'} size={18} minH={52} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start gap-3">
          <IoBox title="Input" tone="in" lines={input} rows={Math.max(1, input.length)} fs={16} width={150} />
          <div className="min-w-0 flex-1">
            <IoBox title="Output" lines={out} rows={outRows} fs={16} nothing={nothing} />
          </div>
        </div>
        <Areas fn="greet" main={main} local={s?.local ?? {}} inCall={!!frame?.inCall} prevMain={ps?.main ?? {}} prevLocal={ps?.local ?? {}} backFrom={backFrom} width="100%" dir="row" callH={86} mainH={86} />
        {vote}
      </div>
    </div>
  )
}

/** The press-1 vote of a trace card: clickable, keys 1 to n, revealed on `shown`. */
function useVote() {
  const [pick, setPick] = useState(-1)
  return { pick, setPick }
}

/* ================================================================== E1 */

const E1 = SPEC.E1
const E1_SRC: string = E1.code[0].src
const E1_STEPS: Step[] = E1.data.steps
const E1_FRAMES = traceOf(E1_STEPS, E1_SRC)
const E1_ORDER: number[] = E1.data.order

/**
 * FOLLOW THE CALL. Spec card E1, nine presses: the vote; seven moves, one per
 * press, captions from the data; the whole route drawn, with the order of
 * lines `1, 4, 5, 1, 2, 5, 6` and the rule.
 */
export function FollowCall() {
  const beat = useBeats(9)
  const { pick, setPick } = useVote()
  const i = beat >= 2 ? Math.min(beat - 2, E1_STEPS.length - 1) : -1
  const frame = i >= 0 ? E1_FRAMES[i] : null
  const prev = i >= 1 ? E1_FRAMES[i - 1] : null
  const end = beat === 9
  const right = rightOf(E1.answer)
  return (
    <>
      <TraceBody
        code={E1_SRC}
        fs={19}
        frame={end ? { ...E1_FRAMES[6], at: null } : frame}
        prev={prev}
        input={[E1.code[0].input]}
        out={frame?.step?.screen ?? []}
        outRows={2}
        caption={end ? sentences(E1.show[1]).join(' ') : frame ? frame.step!.caption : E1.show[0]}
        badge={end ? null : frame?.at ? `line ${frame.at}` : null}
        rule={end}
        route={end ? { in: { from: 5, to: 1 }, back: { from: 2, to: 5 } } : null}
        codeExtras={
          <Show on={end} className="flex items-center gap-2">
            <span className="text-[16px] font-semibold" style={{ color: colors.body }}>
              Lines ran
            </span>
            {E1_ORDER.map((n, k) => (
              <span key={k} className="grid h-8 w-8 place-items-center rounded-lg font-mono text-[17px] font-bold" style={{ background: k === 3 || k === 4 ? '#FFF4EC' : colors.surface2, color: k === 3 || k === 4 ? colors.accentDark : colors.brandDark, boxShadow: `inset 0 0 0 1.5px ${k === 3 || k === 4 ? colors.accent : colors.line}` }}>
                {n}
              </span>
            ))}
          </Show>
        }
        vote={<Vote options={E1.vote.map(optionText)} right={right} shown={end} pick={pick} setPick={setPick} size={17} />}
      />
      {end && pick === right && <Confetti seed={11} />}
      <StepControls at={beat} total={9} />
    </>
  )
}

/* ================================================================== C8 */

const C8 = SPEC.C8
const C8_ONE: string = C8.code[0].src
const C8_TWO: string = C8.code[1].src
const C8_STEPS: Step[] = C8.data.steps
const C8_FRAMES = traceOf(C8_STEPS, C8_TWO)
const MOVE = [900, 1000, 1000, 1000, 1000]

/**
 * HELLO TEJA, THEN HELLO RAHUL. Spec card C8, three presses. Press 1: the
 * program and its input, the question. Press 2: the call runs as one move
 * (the spec's steps 2 to 6 played inside the press): `word` holding 'Teja'
 * appears in greet's area, `msg` beside it, the output fills, both vanish.
 * Press 3: lines 7 and 8 appear with the input Rahul, and the second call
 * runs the same way.
 */
export function TejaRahul() {
  const beat = useBeats(3)
  const p2 = usePhase(beat, 2, MOVE)
  const p3 = usePhase(beat, 3, MOVE.concat([1000]))
  /* press 2 plays steps 2..6; press 3 plays steps 7..12 */
  const idx = beat === 1 ? -1 : beat === 2 ? 1 + p2 : 6 + p3
  const frame = idx >= 0 ? C8_FRAMES[idx] : null
  const prev = idx >= 1 ? C8_FRAMES[idx - 1] : null
  const code = beat >= 3 ? C8_TWO : C8_ONE
  return (
    <>
      <TraceBody
        code={code}
        fs={19}
        frame={frame}
        prev={prev}
        input={beat >= 3 ? ['Teja', 'Rahul'] : ['Teja']}
        out={frame?.step?.screen ?? []}
        outRows={2}
        caption={beat === 1 ? C8.show[0] : frame!.step!.caption}
        badge={frame?.at ? `line ${frame.at}` : null}
        codeW={500}
        vote={
          <Show on={beat === 3}>
            <Ask size={22}>{C8.show[1]}</Ask>
          </Show>
        }
      />
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ================================================================== C9 */

const C9 = SPEC.C9
const C9_SRC: string = C9.code[0].src
const C9_STEPS: Step[] = C9.data.steps
const C9_FRAMES = traceOf(C9_STEPS, C9_SRC)

/**
 * MSG STAYS INSIDE. Spec card C9, nine presses: the vote; seven moves (msg
 * appears in greet's area on line 2, vanishes with word when the call ends,
 * line 6 finds no box: NameError); the rule.
 */
export function MsgInside() {
  const beat = useBeats(9)
  const { pick, setPick } = useVote()
  const i = beat >= 2 ? Math.min(beat - 2, C9_STEPS.length - 1) : -1
  const frame = i >= 0 ? C9_FRAMES[i] : null
  const prev = i >= 1 ? C9_FRAMES[i - 1] : null
  const end = beat === 9
  const err = frame?.step?.kind === 'error'
  const right = rightOf(C9.answer.startsWith('NameError') ? 'B' : 'A')
  return (
    <>
      <TraceBody
        code={C9_SRC}
        fs={19}
        frame={err ? { ...frame!, at: null } : frame}
        prev={prev}
        error={err ? 6 : null}
        input={[C9.code[0].input]}
        out={frame?.step?.screen ?? []}
        outRows={1}
        caption={end ? C9.show[1] : frame ? frame.step!.caption : C9.show[0]}
        badge={end ? null : frame?.at ? `line ${frame.at}` : null}
        rule={end}
        vote={<Vote options={C9.vote} right={right} shown={beat >= 8} pick={pick} setPick={setPick} size={17} />}
      />
      {beat >= 8 && pick === right && <Confetti seed={19} />}
      <StepControls at={beat} total={9} />
    </>
  )
}

/* ================================================================== C11 */

const C11 = SPEC.C11
const C11_SRC: string = C11.code[0].src
const C11_STEPS: Step[] = C11.data.steps
const C11_FRAMES = traceOf(C11_STEPS, C11_SRC)
const C11_LABELS: Record<number, string> = { 3: C11.show[2], 6: C11.show[3] }

/**
 * RETURN MSG. Spec card C11, ten presses. Press 1: the def shape with
 * `return value` as its last line, the biggest text, and its label. Press 2:
 * the program, line 3 labelled `Returning value`, line 6 `Storing the value
 * returned`. Presses 3 to 10: the eight moves; on the way back the value
 * leaves greet's area and lands in `greeting` (it flies down from the call's
 * area, the cake handed over), and word and msg vanish.
 */
export function ReturnMsg() {
  const beat = useBeats(10)
  const i = beat >= 3 ? beat - 3 : -1
  const frame = i >= 0 ? C11_FRAMES[i] : null
  const prev = i >= 1 ? C11_FRAMES[i - 1] : null
  const back = frame?.step?.kind === 'jump-back'
  return (
    <>
      {beat === 1 ? (
        <div className="flex flex-col items-start gap-5 pl-6 pt-4">
          <DefShapeLine args="args" ret label={sentences(C11.show[1])[0]} />
        </div>
      ) : (
        <TraceBody
          code={C11_SRC}
          fs={17}
          codeW={392}
          frame={frame}
          prev={prev}
          labels={beat === 2 ? C11_LABELS : undefined}
          input={[C11.code[0].input]}
          out={frame?.step?.screen ?? []}
          outRows={1}
          caption={frame ? frame.step!.caption : null}
          badge={frame?.at ? `line ${frame.at}` : null}
          backFrom={back ? 'greeting' : null}
        />
      )}
      <StepControls at={beat} total={10} />
    </>
  )
}

/* ================================================================== C12 */

const C12 = SPEC.C12
const C12_SRC: string = C12.code[0].src
const C12_STEPS: Step[] = C12.data.steps
const C12_FRAMES = traceOf(C12_STEPS, C12_SRC)

/**
 * A LINE AFTER RETURN. Spec card C12, nine presses: the vote; seven moves (on
 * line 3 a red arrow points out of the function, line 4 greys and stays
 * grey); the output stays empty with `(nothing)` and the two rule lines.
 * The way back's caption says `greeting = 'Hello Teja'`, so the box is drawn
 * from that step on, as on C11 (the spec's `main` leaves it out; flagged).
 */
export function AfterReturn() {
  const beat = useBeats(9)
  const { pick, setPick } = useVote()
  const i = beat >= 2 ? Math.min(beat - 2, C12_STEPS.length - 1) : -1
  const frame = i >= 0 ? C12_FRAMES[i] : null
  const prev = i >= 1 ? C12_FRAMES[i - 1] : null
  const returned = i >= 5
  const backNow = frame?.step?.kind === 'jump-back'
  const end = beat === 9
  const right = rightOf('B')
  return (
    <>
      <TraceBody
        code={C12_SRC}
        fs={18}
        codeW={420}
        gap={92}
        frame={end ? { ...C12_FRAMES[6], at: null } : frame}
        prev={prev}
        grey={returned ? [4] : []}
        exit={returned ? 3 : null}
        input={[C12.code[0].input]}
        out={[]}
        outRows={1}
        nothing={end}
        caption={end ? `${C12.show[2]} ${C12.show[3]}` : frame ? frame.step!.caption : C12.show[0]}
        badge={end ? null : frame?.at ? `line ${frame.at}` : null}
        rule={end}
        extraMain={i >= 6 ? { greeting: 'Hello Teja' } : undefined}
        backFrom={backNow ? 'greeting' : null}
        vote={<Vote options={C12.vote} right={right} shown={end} pick={pick} setPick={setPick} size={17} />}
      />
      {end && pick === right && <Confetti seed={22} />}
      <StepControls at={beat} total={9} />
    </>
  )
}
