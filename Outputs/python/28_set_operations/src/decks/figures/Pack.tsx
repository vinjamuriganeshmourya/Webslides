import { useEffect, useRef, useState, type RefObject } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Lines, Focus, Group } from './common'
import { Confetti } from './motion'
import { Ask, Note, OutPanel, Show, Swap, sentences, type OutLine, CODE_FS, OUT_FS } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { useStepPhase } from './phase'
import { NameBox, Row } from './rows'
import { SPEC } from './spec'

/**
 * PACKING: C16 (commas make a tuple, brackets or not) and C17 (return packs,
 * the left side unpacks). The same row and name boxes as C15, E1 and G2.
 * Packing copies nothing away and changes no value: the same values sit in
 * the row (the keeps lines). Every program and output is the spec's, run on
 * CPython 3.12.3.
 */
type Prog = { file: string; src: string; output: string }
const outOf = (out: string, n = Infinity): OutLine[] =>
  out
    .split('\n')
    .slice(0, n)
    .map((t) => ({ text: t }))
const HOUSE = 'cubic-bezier(0.22, 1, 0.36, 1)'

/** The right side of a packing line: the values with their commas, loose until they slide together into one locked row. */
function Loose({ values, packed }: { values: string[]; packed: boolean }) {
  const instant = useInstant()
  return (
    <div className="flex items-center" style={{ gap: packed ? 6 : 26, transition: instant ? 'none' : `gap 700ms ${HOUSE}` }}>
      {values.map((v, i) => (
        <span key={i} className="flex items-center">
          <span className="grid h-[52px] min-w-[64px] place-items-center rounded-xl bg-white px-3 font-mono text-[19px] font-semibold" style={{ color: colors.ink, boxShadow: `inset 0 0 0 2px ${colors.line}` }}>
            {v}
          </span>
          {i < values.length - 1 && (
            <span className="font-mono text-[26px] font-bold" style={{ color: colors.accentDark, width: packed ? 0 : 16, opacity: packed ? 0 : 1, overflow: 'hidden', transition: instant ? 'none' : `opacity 500ms ${HOUSE}, width 700ms ${HOUSE}` }}>
              ,
            </span>
          )}
        </span>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ C16 */

const C16 = SPEC.C16
const P16: Prog[] = C16.code
const C16_CHOICES: string[] = C16.show.slice(1, 3)
const rhsValues = (line: string) => line.split(' = ')[1].split(', ')
const PACK_VALUES = rhsValues(P16[0].src.split('\n')[0]).map((v) => v.replace(/"/g, "'"))
const BOTH_VALUES = rhsValues(P16[1].src.split('\n')[0]).map((v) => v.replace(/"/g, "'"))
const BOTH_NAMES = P16[1].src.split('\n')[0].split(' = ')[0].split(', ')

/**
 * C16, four presses: pack.py with no brackets, vote; the values slide
 * together into one locked row that goes into order, the output fills and
 * `() brackets are optional`; pack_unpack.py with three empty boxes; then
 * two movements: the values pack into a row, then the row unpacks into item,
 * qty and price.
 */
export function Packing() {
  const beat = useBeats(4)
  const [pick, setPick] = useState(-1)
  const second = beat >= 3
  const prog = second ? P16[1] : P16[0]
  /* press 2: pack, then the output; press 4: pack, then unpack one by one, then the output */
  const phase = useStepPhase(beat, beat === 4 ? [300, 900, 320, 320, 600] : [300, 900])
  const packed = beat === 2 ? phase >= 1 : beat === 4 ? phase >= 1 : false
  const rowOn = (beat === 2 && phase >= 2) || (beat === 4 && phase >= 1)
  const into = beat === 4 ? Math.max(0, Math.min(phase - 1, 3)) : 0
  const ran = (beat === 2 && phase >= 2) || (beat === 4 && phase >= 5)
  const right = C16_CHOICES.indexOf(P16[0].output.split('\n')[0])
  const cells = useRef<(HTMLSpanElement | null)[]>([])
  const values = second ? BOTH_VALUES : PACK_VALUES
  return (
    <>
      <div className="flex items-stretch gap-8">
        <Group className="flex w-[470px] shrink-0 flex-col gap-3">
          <Ask size={22}>{C16.show[0]}</Ask>
          <Focus on={beat === 1 || beat === 3}>
            <CodePane code={prog.src} fontSize={CODE_FS} rows={4} highlight={1} />
          </Focus>
          <OutPanel lines={ran ? outOf(prog.output) : []} minRows={3} fontSize={OUT_FS} />
        </Group>
        <Group className="flex min-w-0 flex-1 flex-col gap-5" active={beat === 1 || beat === 3}>
          {<Vote options={C16_CHOICES} right={right} shown={beat >= 2} pick={pick} setPick={setPick} cols={2} size={19} />}
          <div className="flex min-h-[80px] items-center gap-4">
            <Swap k={rowOn ? `row-${prog.file}` : `loose-${prog.file}`}>
            {!rowOn ? (
              <Loose values={values} packed={packed} />
            ) : (
              <div className="sm-bump flex items-start">
                <Row items={values} kind="tuple" size="md" cellRefs={cells} name={second ? undefined : 'order'} />
              </div>
            )}
            </Swap>
          </div>
          {second && (
            <div className="flex gap-3">
              {BOTH_NAMES.map((n, i) => (
                <NameBox key={n} name={n} width={120} value={into > i ? BOTH_VALUES[i] : null} from={cells.current[i]} />
              ))}
            </div>
          )}
          {beat === 2 && <Note size={19} on={ran} lines={sentences(C16.show[3])} />}
          {beat === 4 && <StepCaption text={ran ? C16.show[4] : null} tone="rule" size={19} minH={52} />}
        </Group>
      </div>
      {beat >= 2 && beat < 3 && pick === right && <Confetti seed={91} />}
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ------------------------------------------------------------------ C17 */

const C17 = SPEC.C17
const P17: Prog[] = C17.code
const C17_CHOICES: string[] = C17.show.slice(2, 5)
const RESULT = P17[0].output.replace(/[()]/g, '').split(', ') /* 16, 2 */
const RETURN_LINE = P17[0].src.split('\n').findIndex((l) => l.trim().startsWith('return')) + 1
const CALL_LINE = P17[0].src.split('\n').findIndex((l) => l.includes('split_bill(50')) + 1

/**
 * The packed row in a lane beside the code, travelling from the return line
 * down to the call line (its must line), placed on the code's own rows.
 */
function Travel({ codeRef, at, values, on }: { codeRef: RefObject<HTMLDivElement | null>; at: number; values: string[]; on: boolean }) {
  const instant = useInstant()
  const [ys, setYs] = useState<Record<number, number>>({})
  /* a passive effect: the parent's ref is attached only after a child's layout effects have run */
  useEffect(() => {
    const rows = codeRef.current?.querySelectorAll('code > span')
    if (!rows) return
    const base = codeRef.current!.getBoundingClientRect().top
    const k = codeRef.current!.offsetHeight ? codeRef.current!.getBoundingClientRect().height / codeRef.current!.offsetHeight : 1
    const out: Record<number, number> = {}
    rows.forEach((r, i) => {
      const b = (r as HTMLElement).getBoundingClientRect()
      out[i + 1] = (b.top - base + b.height / 2) / k
    })
    setYs(out)
  }, [codeRef])
  const y = ys[at] ?? 0
  return (
    <div className="pointer-events-none absolute left-full top-0 ml-3" style={{ transform: `translateY(${y - 22}px)`, opacity: on ? 1 : 0, transition: instant ? 'none' : `transform 1000ms ${HOUSE}, opacity 400ms ${HOUSE}` }}>
      <Row items={values} kind="tuple" size="sm" indices={false} />
    </div>
  )
}

/**
 * C17, four presses: split_bill with result = ..., vote 16, (16, 2), an
 * error; 16 and 2 leave the function packed in one row, which travels from
 * the return line to the call line, and the output fills; line 6 becomes
 * `each, left = ...` with two empty boxes; the row comes out again and
 * unpacks into each and left. The bill and the function's lines never change.
 */
export function ReturnTwo() {
  const beat = useBeats(4)
  const [pick, setPick] = useState(-1)
  const second = beat >= 3
  const prog = second ? P17[1] : P17[0]
  const phase = useStepPhase(beat, beat === 4 ? [200, 1100, 360, 360, 500] : [200, 1100, 400])
  const run = beat === 2 || beat === 4
  const rowAt = run && phase >= 2 ? CALL_LINE : RETURN_LINE
  const rowOn = run && phase >= 1
  const into = beat === 4 ? Math.max(0, Math.min(phase - 2, 2)) : 0
  const ran = (beat === 2 && phase >= 3) || (beat === 4 && phase >= 5)
  const right = C17_CHOICES.indexOf(P17[0].output)
  const code = useRef<HTMLDivElement | null>(null)
  const names = P17[1].src.split('\n')[CALL_LINE - 1].split(' = ')[0].split(', ')
  return (
    <>
      <div className="flex items-stretch gap-[132px]">
        <Group className="flex w-[480px] shrink-0 flex-col gap-3">
          <p className="font-heading text-[19px] font-bold" style={{ color: colors.ink }}>
            <Lines lines={sentences(C17.show[0])} />
          </p>
          <div ref={code} className="relative">
            <CodePane code={prog.src} fontSize={CODE_FS} rows={8} highlight={beat === 3 || beat === 4 ? CALL_LINE : undefined} mark={run ? [RETURN_LINE] : undefined} />
            <Travel codeRef={code} at={rowAt} values={RESULT} on={rowOn} />
          </div>
        </Group>
        <Group className="flex min-w-0 flex-1 flex-col gap-4" active={beat === 1 || beat === 3}>
          <Ask size={22}>{C17.show[1]}</Ask>
          <Vote options={C17_CHOICES} right={right} shown={beat >= 2} pick={pick} setPick={setPick} cols={3} size={19} />
          <Show on={beat >= 3} className="flex gap-3">
            {names.map((n, i) => (
              <NameBox key={n} name={n} width={120} value={into > i ? RESULT[i] : null} />
            ))}
          </Show>
          <OutPanel lines={ran ? outOf(prog.output) : []} minRows={2} fontSize={OUT_FS} />
          <StepCaption text={beat === 4 && ran ? C17.show[5] : null} tone="rule" size={19} minH={52} />
        </Group>
      </div>
      {beat === 2 && pick === right && <Confetti seed={92} />}
      <StepControls at={beat} total={4} />
    </>
  )
}

