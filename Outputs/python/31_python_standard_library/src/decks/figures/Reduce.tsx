import { AnimatePresence, motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Focus, Lines } from './common'
import { Appear, ListBoxes, Note, OutPanel, Swap, sentences, CODE_FS, OUT_FS, type OutLine } from './pieces'
import { CodePane, StepCaption } from './trace'
import { useStepPhase } from './phase'
import { OutRow } from './game'
import { CodeCard, DeckLine, TwoCols, lines, type Prog } from './cards'
import { SPEC } from './spec'

/**
 * C16: REDUCE, MANY INTO ONE. Seven presses.
 *
 * Press 1: reduce lives in functools; the two code cards. Press 2: total.py
 * and Ravi's cart amounts, the list as written beside a copy that will
 * merge (its keeps line). Presses 3 and 4: one join per press, the first
 * two boxes merge into one with their sum, then that box merges with the
 * next; joined boxes merge, no grey copies are left behind (its must line).
 * Press 5: 710, and sum(amounts) gives 710 too. Press 6: a rule sum cannot
 * do: three dice, multiply, 216, the joins as movement inside the press.
 * Press 7: one item gives itself back, no items stops with TypeError, and
 * the small print: forget the import and it stops with NameError.
 * Every program ran on CPython 3.12.3.
 */
const EASE = [0.22, 1, 0.36, 1] as const
const C16 = SPEC.C16
const P: Prog[] = C16.code /* total, dice_ways, one_item, no_items, no_import */
type Join = { a: number; b: number; makes: number }
const JOINS: Join[] = C16.data.joins
const AMOUNTS = [500, 90, 120]
const DICE = [6, 6, 6]
const DICE_JOINS: Join[] = [
  { a: 6, b: 6, makes: 36 },
  { a: 36, b: 6, makes: 216 },
]

/** The boxes after `joined` joins: the first `joined` pairs merged, left to right. */
function boxesAfter(values: number[], joins: Join[], joined: number): { key: string; value: number; fresh: boolean }[] {
  const out = values.map((v, i) => ({ key: `v${i}`, value: v, fresh: false }))
  for (let k = 0; k < joined; k++) {
    const j = joins[k]
    out.splice(0, 2, { key: `m${k}`, value: j.makes, fresh: k === joined - 1 })
  }
  return out
}

/** The merging copy: boxes in a row; a join replaces the first two with one box, and the rest close up. */
function Joins({ values, joins, joined, op }: { values: number[]; joins: Join[]; joined: number; op: string }) {
  const instant = useInstant()
  const boxes = boxesAfter(values, joins, joined)
  return (
    <div className="flex h-[60px] items-center gap-2">
      <span className="mr-1 w-[70px] shrink-0 font-mono text-[13px] font-semibold" style={{ color: colors.body }}>
        {op}
      </span>
      <AnimatePresence initial={false} mode="popLayout">
        {boxes.map((b, i) => (
          <motion.span
            key={b.key}
            layout={!instant}
            className="grid h-[50px] min-w-[64px] place-items-center rounded-xl px-3 font-mono text-[20px] font-bold"
            style={{ background: b.fresh ? '#E9F8EF' : colors.white, color: b.fresh ? '#137A3A' : colors.ink, boxShadow: `inset 0 0 0 ${b.fresh ? 2.5 : 2}px ${b.fresh ? colors.success : colors.line}` }}
            initial={instant ? false : { opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, x: i === 0 ? 30 : -30, transition: { duration: instant ? 0 : 0.42, ease: EASE } }}
            transition={{ duration: instant ? 0 : 0.6, ease: EASE }}
          >
            {b.value}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function ReduceCard() {
  const beat = useBeats(7)
  const dicePhase = useStepPhase(beat, [700, 700])
  const onDice = beat === 6
  const edge = beat >= 7
  const joined = beat === 3 ? 1 : beat === 4 || beat === 5 ? 2 : onDice ? dicePhase : 0
  const prog = onDice ? P[1] : P[0]
  const out: OutLine[] = beat >= 5 && beat <= 5 ? lines(P[0].output) : onDice ? lines(P[1].output) : []
  const caption = beat === 1 ? null : beat <= 5 ? C16.show[3] : onDice ? `${C16.show[5]} ${C16.show[6]}` : C16.show[7]
  const values = onDice ? DICE : AMOUNTS
  const joins = onDice ? DICE_JOINS : JOINS
  return (
    <>
      <TwoCols
        height={400}
        leftW={720}
        asking={beat === 1 || beat === 2}
        drawing={beat >= 3}
        left={
          <Swap k={beat === 1 ? 'intro' : edge ? 'edge' : 'code'}>
            {beat === 1 ? (
              <div className="flex min-h-[300px] flex-col items-start justify-center gap-6 pl-2">
                <DeckLine size={18}>{C16.show[0]}</DeckLine>
                <CodeCard lines={[C16.show[1], C16.show[2]]} size={22} className="ml-2" />
              </div>
            ) : edge ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-3">
                  {[P[2], P[3]].map((p) => (
                    <div key={p.file} className="min-w-0 flex-1">
                      <CodePane code={p.src} fontSize={CODE_FS} rows={6} dense at={6} stop={/Error/.test(p.output)} />
                    </div>
                  ))}
                </div>
                {[P[2], P[3]].map((p) => (
                  <OutRow key={`o-${p.file}`} lines={lines(p.output)} label={p.file.replace('.py', '')} />
                ))}
                <Appear delay={400}>
                  <p className="flex flex-wrap items-center gap-x-2 text-[13px] font-semibold" style={{ color: colors.muted }}>
                    <span>Forget line 1, the import, and it stops with</span>
                    <span className="whitespace-nowrap font-mono text-[12.5px] font-bold" style={{ color: colors.danger }}>
                      {P[4].output}
                    </span>
                  </p>
                </Appear>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Focus on={beat === 2}>
                  <CodePane code={prog.src} fontSize={CODE_FS} rows={7} at={beat >= 3 && beat <= 4 ? 7 : undefined} highlight={beat === 5 || onDice ? 7 : undefined} />
                </Focus>
                <OutPanel lines={out} minRows={1} fontSize={OUT_FS} />
              </div>
            )}
          </Swap>
        }
        right={
          <>
            <StepCaption text={caption} size={16} minH={64} />
            <div className="flex flex-1 flex-col justify-center gap-3" style={{ opacity: beat >= 2 && !edge ? 1 : 0, transition: 'opacity 480ms cubic-bezier(0.22,1,0.36,1)' }}>
              <ListBoxes name={onDice ? 'dice' : 'amounts'} items={values.map(String)} size="md" positions={false} lane={false} />
              <Joins values={values} joins={joins} joined={joined} op={onDice ? 'multiply' : 'add'} />
            </div>
            <div style={{ minHeight: 44 }}>
              {beat === 5 && (
                <Appear>
                  <Note lines={[C16.show[4]]} size={14} />
                </Appear>
              )}
              {edge && (
                <Appear>
                  <p className="text-[14px] font-semibold" style={{ color: colors.body }}>
                    <Lines lines={sentences('One item gives itself back. No items: nothing to start with')} />
                  </p>
                </Appear>
              )}
            </div>
          </>
        }
      />
      <StepControls at={beat} total={7} />
    </>
  )
}
