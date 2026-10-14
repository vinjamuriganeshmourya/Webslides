import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Focus, Lines } from './common'
import { Confetti } from './motion'
import { Appear, BigLine, Note, OutPanel, Show, Swap, sentences, CODE_FS, OUT_FS, type OutLine } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import type { Mark } from './Code'
import { OutRow } from './game'
import { CalcPhone } from './Calculator'
import { HowTable, MathBox, NameTags, ValueBox } from './imports'
import { Face } from './people'
import { CodeCard, DeckLine, Label, TwoCols, lines, usePick, type Prog } from './cards'
import { SPEC } from './spec'

/**
 * C3, C5, C6, C7, C8: IMPORT, THE DOT, AS AND FROM.
 *
 * Every card is two groups side by side (generate-slides 2b): the program
 * with its output on the left; the caption, the picture and the table on the
 * right. The picture is the one every import card shares (spec note 5): the
 * name line 1 brings in is underlined in a colour, the name the next line
 * uses is underlined too; the same name in the same colour runs, a different
 * name turns red and the program stops there (`Code.tsx` marks). The table
 * "How you import decides how you call" grows by one row on C3, C6, C7 and
 * C8, and rows already added are on screen from the card's first press.
 * Every output box starts empty and fills only after the room has said or
 * voted its answer (the cards' must lines). Every program ran on CPython
 * 3.12.3; the NameError lines are the spec's.
 */
const H = 400
const A = (text: string, nth?: number): Mark => ({ text, tone: 'a', nth })
const C = (text: string, nth?: number): Mark => ({ text, tone: 'c', nth })
const BAD = (text: string, nth?: number): Mark => ({ text, tone: 'bad', nth })

/* ===================================================================== C3 */

const C3 = SPEC.C3
const SQRT_NO: Prog = C3.code[0]
const SQRT_ON: Prog = C3.code[1]

/**
 * C3. Press 1: the deck's line and the code card `import module_name`.
 * Press 2: sqrt.py with no import, the output empty, "What happens?", the
 * vote. Press 3: math has no partner above it and turns red; NameError.
 * Press 4: `import math` slides in above, both math names underlined in one
 * colour, 7.0, and the table gets its first row.
 */
export function ImportOn() {
  const beat = useBeats(4)
  const { pick, setPick } = usePick()
  const right = 1
  const code = beat >= 4 ? SQRT_ON.src : SQRT_NO.src
  const out: OutLine[] = beat >= 4 ? lines(SQRT_ON.output) : beat >= 3 ? lines(SQRT_NO.output) : []
  const marks: Record<number, Mark[]> | undefined = beat >= 4 ? { 1: [A('math')], 3: [A('math')] } : beat === 3 ? { 1: [BAD('math')] } : undefined
  const caption = beat >= 4 ? C3.show[0] : beat >= 2 ? C3.show[2] : null
  return (
    <>
      <TwoCols
        height={H}
        asking={beat === 1 || beat === 2}
        drawing={beat >= 3}
        left={
          <Swap k={beat === 1 ? 'intro' : 'code'}>
            {beat === 1 ? (
              <div className="flex min-h-[300px] flex-col items-start justify-center gap-6 pl-2">
                <DeckLine size={18}>{C3.show[0]}</DeckLine>
                <CodeCard lines={[C3.show[1]]} size={24} className="ml-2" />
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Focus on={beat === 2}>
                  <CodePane code={code} fontSize={CODE_FS} rows={3} at={beat === 3 ? 1 : undefined} stop={beat === 3} marks={marks} highlight={beat >= 4 ? 1 : undefined} />
                </Focus>
                <OutPanel lines={out} minRows={1} fontSize={OUT_FS} />
                <Show on={beat >= 2}>
                  <Vote options={['7.0', 'NameError']} right={right} shown={beat >= 3} pick={pick} setPick={setPick} cols={2} size={15} nowrap dense />
                </Show>
              </div>
            )}
          </Swap>
        }
        right={
          <>
            <StepCaption text={caption} tone={beat >= 4 ? 'rule' : 'step'} size={16} minH={46} />
            <div className="flex items-center justify-center" style={{ height: 150 }}>
              <CalcPhone stage={false} landscape zoom={0.56} lit={beat >= 4} display={beat >= 4 ? ['√49 = 7'] : ['0']} glow={beat >= 4 ? ['√'] : []} />
            </div>
            <HowTable rows={beat >= 4 ? 1 : 0} lit={beat >= 4 ? 0 : undefined} />
          </>
        }
      />
      {beat >= 3 && pick === right && <Confetti seed={31} />}
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ===================================================================== C5 */

const C5 = SPEC.C5
const PHOTO: Prog = C5.code[0]
const PI: Prog = C5.code[1]
const CH = 18 /* a mono character at 30px */

/** A straight vertical arrow that draws itself: a 2.5px line into a 9px head on the same axis (rules 45, 46). */
function VArrow({ x, y0, y1, up, delay = 0 }: { x: number; y0: number; y1: number; up: boolean; delay?: number }) {
  const instant = useInstant()
  const tip = up ? y1 : y1
  const base = up ? y1 + 9 : y1 - 9
  return (
    <g>
      <motion.line x1={x} y1={y0} x2={x} y2={base} stroke={colors.success} strokeWidth="2.5" initial={instant ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: instant ? 0 : 0.6, delay: instant ? 0 : delay, ease: 'easeInOut' }} />
      <motion.path d={`M${x - 4.5} ${base} L${x + 4.5} ${base} L${x} ${tip} Z`} fill={colors.success} initial={instant ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: instant ? 0 : 0.2, delay: instant ? 0 : delay + 0.55 }} />
    </g>
  )
}

/** Deck slide 11's picture: `math.factorial(5)`, an arrow down to "Module name", an arrow up to "Variable / Function defined in the module". */
function SyntaxPicture() {
  const W = 540
  const line = 'math.factorial(5)'
  const textW = line.length * CH
  const x0 = (W - textW) / 2
  const mathX = x0 + 2 * CH
  const factX = x0 + (5 + 4.5) * CH
  return (
    <div className="relative" style={{ width: W, height: 300 }}>
      <div className="absolute left-0 right-0 flex flex-col items-center" style={{ top: 18 }}>
        <span className="text-center text-[17px] font-semibold leading-snug" style={{ color: colors.body }}>
          <Lines lines={[C5.show[1]]} />
        </span>
      </div>
      <div className="absolute flex justify-center" style={{ left: 0, right: 0, top: 128 }}>
        <BigLine size={30}>{line}</BigLine>
      </div>
      <div className="absolute flex flex-col items-center" style={{ left: mathX - 60, width: 120, top: 246 }}>
        <span className="text-[17px] font-semibold leading-snug" style={{ color: colors.body }}>
          {C5.show[0]}
        </span>
      </div>
      <svg className="pointer-events-none absolute inset-0" width={W} height={300} aria-hidden>
        <VArrow x={factX} y0={118} y1={62} up delay={0.3} />
        <VArrow x={mathX} y0={186} y1={240} up={false} delay={0.8} />
      </svg>
    </div>
  )
}

/**
 * C5. Press 1: the syntax picture. Press 2: photo.py, the output empty, the
 * question. Press 3: 120, then pi; the dot opens the math box with factorial
 * and pi lit inside. Press 4: pi.py, TypeError, "math.pi is a value. No
 * brackets."
 */
export function Syntax() {
  const beat = useBeats(4)
  const prog = beat >= 4 ? PI : PHOTO
  const out: OutLine[] = beat >= 4 ? lines(PI.output) : beat >= 3 ? lines(PHOTO.output) : []
  const marks: Record<number, Mark[]> = beat >= 4 ? { 1: [A('math')], 3: [A('math')] } : { 1: [A('math')], 3: [A('math')], 4: [A('math')] }
  const caption = beat >= 4 ? C5.show[5] : beat >= 2 ? C5.show[2] : null
  return (
    <>
      <TwoCols
        height={H}
        asking={beat === 1 || beat === 2}
        drawing={beat >= 3}
        left={
          <Swap k={beat === 1 ? 'picture' : 'code'}>
            {beat === 1 ? (
              <div className="flex justify-center">
                <SyntaxPicture />
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Focus on={beat === 2}>
                  <CodePane code={prog.src} fontSize={CODE_FS} rows={4} marks={marks} at={beat >= 4 ? 3 : undefined} stop={beat >= 4} />
                </Focus>
                <OutPanel lines={out} minRows={2} fontSize={OUT_FS} />
              </div>
            )}
          </Swap>
        }
        right={
          <>
            <StepCaption text={caption} size={16} minH={64} />
            <div className="flex flex-1 items-center justify-center">
              <MathBox open={beat >= 3} lit={beat >= 3 ? ['factorial', 'pi'] : []} />
            </div>
            <Show on={beat === 1}>
              <Note lines={[C5.show[0], C5.show[1]]} size={14} />
            </Show>
          </>
        }
      />
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ===================================================================== C6 */

const C6 = SPEC.C6
const MARKS: Prog = C6.code[0]
const MARKS_FIXED: Prog = C6.code[1]
const OLD_NAME: Prog = C6.code[2]

/** Kiran's marks: his face, and the value the name math holds. */
function MarksCard({ value }: { value: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <ValueBox value={value} width={110} />
      <span className="flex items-center gap-1.5">
        <Face name="Kiran" size={20} />
        <Label>Kiran's marks</Label>
      </span>
    </div>
  )
}

/**
 * C6. Press 1: marks.py, Kiran's marks in a variable called math, "What
 * happens?" Press 2: line 3 runs, the name math now holds 78 and the module
 * is gone from it; AttributeError. Press 3: marks_fixed.py, the deck's line,
 * 120 / 78, the table's second row. Press 4: old_name.py, NameError, "After
 * as m, use m."
 */
export function AsCard() {
  const beat = useBeats(4)
  const prog = beat >= 4 ? OLD_NAME : beat >= 3 ? MARKS_FIXED : MARKS
  const out: OutLine[] = beat === 2 ? lines(MARKS.output) : beat === 3 ? lines(MARKS_FIXED.output) : beat >= 4 ? lines(OLD_NAME.output) : []
  const marks: Record<number, Mark[]> = beat === 1 ? { 1: [A('math')] } : beat === 2 ? { 1: [A('math')], 3: [C('math')], 4: [BAD('math')] } : beat === 3 ? { 1: [A('m')], 3: [C('math')], 4: [A('m')], 5: [C('math')] } : { 1: [A('m')], 3: [BAD('math')] }
  const at = beat === 2 ? 4 : beat === 4 ? 3 : undefined
  const caption = beat <= 2 ? `${C6.show[0]} ${C6.show[1]}` : beat === 3 ? C6.show[2] : C6.show[4]
  const tags = beat === 1 ? [{ name: 'math', to: 'mod', tone: 'a' as const }] : beat === 2 ? [{ name: 'math', to: 'val', tone: 'c' as const }] : beat === 3 ? [{ name: 'm', to: 'mod', tone: 'a' as const }, { name: 'math', to: 'val', tone: 'c' as const }] : [{ name: 'm', to: 'mod', tone: 'a' as const }, { name: 'math', to: null, tone: 'bad' as const }]
  return (
    <>
      <TwoCols
        height={H}
        asking={beat === 1}
        drawing={beat >= 2}
        left={
          <>
            <Focus on={beat === 1}>
              <CodePane code={prog.src} fontSize={CODE_FS} rows={5} marks={marks} at={at} stop={at !== undefined} highlight={beat === 3 ? 1 : undefined} />
            </Focus>
            <OutPanel lines={out} minRows={2} fontSize={OUT_FS} />
          </>
        }
        right={
          <>
            <StepCaption text={caption} tone={beat === 3 ? 'rule' : 'step'} size={16} minH={64} />
            <div className="flex flex-1 items-start justify-center pt-1">
              <NameTags
                owners={[
                  { id: 'mod', width: 236, node: <MathBox width={236} dim={beat === 2} lane={false} /> },
                  { id: 'val', width: 110, node: <MarksCard value={beat >= 2 ? '78' : '?'} /> },
                ]}
                tags={tags}
                gap={36}
              />
            </div>
            <HowTable rows={beat >= 3 ? 2 : 1} lit={beat === 3 ? 1 : undefined} />
          </>
        }
      />
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ===================================================================== C7 */

const C7 = SPEC.C7
const ONE_TOOL: Prog = C7.code[0]
const ONE_TOOL_DOT: Prog = C7.code[1]

/**
 * C7. Press 1: the deck's line, one_tool.py, the output empty. Press 2:
 * factorial lifts out of the math box on its own, 120, the table's third
 * row. Press 3: one_tool_dot.py, "Now try math.factorial(5).", the vote.
 * Press 4: math turns red, NameError.
 */
export function FromCard() {
  const beat = useBeats(4)
  const { pick, setPick } = usePick()
  const right = 1
  const prog = beat >= 3 ? ONE_TOOL_DOT : ONE_TOOL
  const out: OutLine[] = beat === 2 ? lines(ONE_TOOL.output) : beat >= 4 ? lines(ONE_TOOL_DOT.output) : []
  const marks: Record<number, Mark[]> = beat <= 2 ? { 1: [A('factorial')], 3: [A('factorial')] } : beat === 3 ? { 1: [A('factorial')] } : { 1: [A('factorial')], 3: [BAD('math')] }
  const caption = beat >= 3 ? C7.show[1] : C7.show[0]
  return (
    <>
      <TwoCols
        height={H}
        asking={beat === 1 || beat === 3}
        drawing={beat === 2 || beat === 4}
        left={
          <>
            <Focus on={beat === 1 || beat === 3}>
              <CodePane code={prog.src} fontSize={CODE_FS} rows={3} marks={marks} at={beat >= 4 ? 3 : undefined} stop={beat >= 4} />
            </Focus>
            <OutPanel lines={out} minRows={1} fontSize={OUT_FS} />
            <Show on={beat >= 3}>
              <Vote options={['120', 'NameError']} right={right} shown={beat >= 4} pick={pick} setPick={setPick} cols={2} size={15} nowrap dense />
            </Show>
          </>
        }
        right={
          <>
            <StepCaption text={caption} tone={beat < 3 ? 'rule' : 'step'} size={16} minH={46} />
            <div className="flex flex-1 items-start justify-center">
              <MathBox lifted={beat >= 2 ? 'factorial' : null} />
            </div>
            <HowTable rows={beat >= 2 ? 3 : 2} lit={beat === 2 ? 2 : undefined} />
          </>
        }
      />
      {beat >= 4 && pick === right && <Confetti seed={37} />}
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ===================================================================== C8 */

const C8 = SPEC.C8
const SHORT: Prog = C8.code[0]
const SHORT_OLD: Prog = C8.code[1]

/**
 * C8. Press 1: the deck's line, short_name.py, the output empty. Press 2:
 * factorial lifts out and its label changes to fact; 120; under it
 * short_name_old.py asks for factorial and stops with NameError. Press 3:
 * the table is complete, four rows, with its title as the caption.
 */
export function FromAsCard() {
  const beat = useBeats(3)
  const caption = beat >= 3 ? C8.show[1] : C8.show[0]
  return (
    <>
      <TwoCols
        height={H}
        asking={beat === 1}
        drawing={beat >= 2}
        left={
          <>
            <Focus on={beat === 1}>
              <CodePane code={SHORT.src} fontSize={CODE_FS} rows={3} marks={{ 1: [C('factorial'), A('fact')], 3: [A('fact')] }} />
            </Focus>
            <OutRow lines={beat >= 2 ? lines(SHORT.output) : []} />
            <div style={{ minHeight: 180 }}>
              {beat >= 2 && (
                <Appear className="flex flex-col gap-2.5">
                  <CodePane code={SHORT_OLD.src} fontSize={CODE_FS} rows={3} marks={{ 1: [C('factorial'), A('fact')], 3: [BAD('factorial')] }} at={3} stop />
                  <OutRow lines={lines(SHORT_OLD.output)} />
                </Appear>
              )}
            </div>
          </>
        }
        right={
          <>
            <StepCaption text={caption} tone="rule" size={16} minH={46} />
            <div className="flex flex-1 items-start justify-center">
              <MathBox lifted={beat >= 2 ? 'factorial' : null} as={beat >= 2 ? 'fact' : null} />
            </div>
            <HowTable rows={beat >= 3 ? 4 : 3} lit={beat >= 3 ? 3 : undefined} />
          </>
        }
      />
      <StepControls at={beat} total={3} />
    </>
  )
}

/* a sentence kept for the cards' notes */
export const IMPORT_NOTE = sentences
