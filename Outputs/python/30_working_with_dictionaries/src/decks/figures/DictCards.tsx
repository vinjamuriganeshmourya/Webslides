import { useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Definition, Focus, Group, Lines } from './common'
import { Confetti } from './motion'
import { Appear, ListBoxes, OutPanel, Show, Swap, sentences, CODE_FS, OUT_FS, type OutLine } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { useStepPhase } from './phase'
import { Board, type Row, type RowTone, type SheetSpec, type TagSpec } from './sheet'
import { SPEC } from './spec'

/**
 * C1 TO C3: TWO NAMES ON ONE SHEET, A COPY, AND clear / len / in.
 *
 * Every card is two groups side by side (generate-slides 2b, one cluster,
 * one container): the program with its output on the left; the picture (tags
 * over Divya's sheet), its caption and the vote on the right. Every output
 * box starts empty and fills on the press after the room has answered (the
 * cards' must lines). Every program and output is the spec's, run on
 * CPython 3.12.3.
 */
type Prog = { file: string; src: string; output: string }
const TITLE = 'Ooty trip money'
const COPY_TITLE = `Copy of ${TITLE}`
const TRIP: Row[] = [
  ['Teja', 1500],
  ['Ravi', 800],
  ['Kiran', 0],
]
const lines = (s: string): OutLine[] => s.split('\n').map((t) => ({ text: t, tone: /^[A-Z]\w*Error/.test(t) ? 'error' : 'plain' }))

/** The deck's own sentence, in the rule's band. */
export function DeckLine({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl px-3.5 py-2 text-[15px] font-semibold leading-snug" style={{ background: colors.surface2, color: colors.ink, boxShadow: `inset 4px 0 0 ${colors.brandDark}` }}>
      {typeof children === 'string' ? <Lines lines={sentences(children)} /> : children}
    </p>
  )
}

/** A vote held per card: the pick, and its setter, kept across the card's presses. */
export function usePick() {
  const [pick, setPick] = useState(-1)
  return { pick, setPick }
}

/** The two groups every concept card is made of. */
export function TwoCols({ left, right, leftW = 560, height, asking, drawing }: { left: ReactNode; right: ReactNode; leftW?: number; /** one explicit height for both groups, chosen for the card's tallest press (user, 2026-10-12: a box never grows with its content) */ height?: number; asking: boolean; drawing: boolean }) {
  return (
    <div className="flex items-stretch gap-3">
      <Group pad={10} className="flex shrink-0 flex-col gap-2.5" style={{ width: leftW, height }} active={asking}>
        {left}
      </Group>
      <Group pad={10} className="flex min-w-0 flex-1 flex-col gap-2.5" style={{ height }} active={drawing}>
        {right}
      </Group>
    </div>
  )
}

/* ===================================================================== C1 */

const C1 = SPEC.C1
const LINK: Prog = C1.code[0]
const IDS: Prog = C1.code[1]
const IDN: string[] = C1.data.id_example
const LINK_OUT = LINK.output.split('\n')

/** A small code chip: a program shown for reference beside the one being asked. */
function MiniCode({ src }: { src: string }) {
  const ls = src.split('\n')
  return (
    <span className="flex gap-4 rounded-lg px-3 py-1 font-mono text-[10.5px] leading-[14px]" style={{ background: colors.night2, color: colors.white }}>
      {[ls.slice(0, 2), ls.slice(2)].map((c, i) => (
        <span key={i} className="flex flex-col">
          {c.map((l, j) => (
            <span key={j} className="block whitespace-pre">
              {l || ' '}
            </span>
          ))}
        </span>
      ))}
    </span>
  )
}

/**
 * C1. Press 1: the deck's line about today's two methods, and the trip sheet
 * with its tag. Press 2: link.py (line 5 waiting), the caption, the vote.
 * Press 3: a second tag `ravi` to the same sheet, Ravi's cell becomes 1000 on
 * that one sheet, the output fills. Press 4: `True`, ids.py beside it with
 * the spec's two equal numbers, "Same id. Same sheet."
 */
export function SameSheet() {
  const beat = useBeats(4)
  const { pick, setPick } = usePick()
  const out: OutLine[] = beat >= 4 ? lines(LINK.output) : beat >= 3 ? [{ text: LINK_OUT[0] }] : []
  const rows: Row[] = TRIP.map(([n, a]) => [n, n === 'Ravi' && beat >= 3 ? 1000 : a])
  const tones: Record<string, RowTone> = beat === 3 ? { Ravi: 'hot' } : {}
  const tags: TagSpec[] = [{ name: 'trip', to: 'S1' }, ...(beat >= 3 ? [{ name: 'ravi', to: 'S1' } as TagSpec] : [])]
  const caption = beat === 2 ? C1.show[1] : beat >= 4 ? C1.show[4] : null
  const right = 1
  return (
    <>
      <TwoCols
        leftW={590}
        asking={beat === 2}
        drawing={beat === 1 || beat === 3}
        left={
          <Swap k={beat === 1 ? 'intro' : 'code'}>
            {beat === 1 ? (
              <div className="flex min-h-[200px] flex-col justify-center gap-4">
                <DeckLine>{C1.show[0]}</DeckLine>
                <div className="flex gap-3">
                  {['copy()', 'clear()'].map((m) => (
                    <span key={m} className="rounded-xl bg-white px-4 py-2 font-mono text-[22px] font-bold" style={{ color: colors.brandDark, boxShadow: `inset 0 0 0 2px ${colors.line}` }}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Focus on={beat === 2}>
                  <CodePane code={LINK.src} fontSize={CODE_FS} rows={5} at={beat === 3 ? 3 : beat >= 4 ? 5 : undefined} gap={beat < 4 ? 5 : undefined} />
                </Focus>
                <OutPanel lines={out} minRows={2} fontSize={OUT_FS} />
                {beat >= 4 && (
                  <Appear className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                      <MiniCode src={IDS.src} />
                      <span className="flex flex-col rounded-lg px-2.5 py-0.5 font-mono text-[10.5px] font-bold leading-[14px]" style={{ color: '#137A3A', background: '#E9F8EF', boxShadow: `inset 0 0 0 1.5px ${colors.success}` }}>
                        {IDN.map((n, i) => (
                          <span key={i}>{n}</span>
                        ))}
                      </span>
                    </div>
                    <p className="text-[12px] font-semibold leading-[14px]" style={{ color: colors.muted }}>
                      <Lines lines={sentences(C1.show[5])} />
                    </p>
                  </Appear>
                )}
              </div>
            )}
          </Swap>
        }
        right={
          <>
            <StepCaption text={caption} size={16} minH={46} />
            <Board sheets={[{ id: 'S1', title: TITLE, rows, tones }]} tags={tags} minRows={3} />
            <Show on={beat >= 2}>
              <Vote options={[C1.show[2], C1.show[3]]} right={right} shown={beat >= 3} pick={pick} setPick={setPick} cols={1} size={15} nowrap dense />
            </Show>
          </>
        }
      />
      {beat >= 3 && pick === right && <Confetti seed={31} />}
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ===================================================================== C2 */

const C2 = SPEC.C2
const MK: Prog = C2.code[0]
const BUS: Prog = C2.code[1]

/**
 * C2. Press 1: make_a_copy.py, `dict.copy()` and its sentence, the sheet with
 * its tag. Press 2: a second sheet drawn row by row, `kiran` points at it,
 * Kiran's cell becomes 2000 on the copy only. Press 3: the three output
 * lines, "Different id. Different sheets." Press 4: bus.py and two list rows:
 * a list has copy() too.
 */
export function MakeACopy() {
  const beat = useBeats(4)
  const onList = beat >= 4
  const code = onList ? BUS.src : MK.src
  const out: OutLine[] = onList ? lines(BUS.output) : beat >= 3 ? lines(MK.output) : []
  const copyRows: Row[] = TRIP.map(([n, a]) => [n, n === 'Kiran' ? 2000 : a])
  const sheets: SheetSpec[] = [{ id: 'S1', title: TITLE, rows: TRIP }, ...(beat >= 2 ? [{ id: 'S2', title: COPY_TITLE, rows: copyRows, tones: beat === 2 ? { Kiran: 'hot' as RowTone } : {}, stagger: true }] : [])]
  const tags: TagSpec[] = [{ name: 'trip', to: 'S1' }, ...(beat >= 2 ? [{ name: 'kiran', to: 'S2' } as TagSpec] : [])]
  const caption = onList ? C2.show[4] : beat >= 3 ? C2.show[3] : C2.show[2]
  return (
    <>
      <TwoCols
        asking={beat === 1}
        drawing={beat >= 2}
        left={
          <>
            <Focus on={beat === 1}>
              <CodePane code={code} fontSize={CODE_FS} rows={6} at={onList ? 5 : beat === 2 ? 3 : beat === 3 ? 6 : undefined} />
            </Focus>
            <OutPanel lines={out} minRows={3} fontSize={OUT_FS} />
          </>
        }
        right={
          <>
            <Definition sig={C2.show[0]}>
              <Lines lines={sentences(C2.show[1])} />
            </Definition>
            <StepCaption text={caption} size={16} minH={46} />
            <div className="flex flex-1 items-center">
              <Swap k={onList ? 'list' : 'sheets'}>
                {onList ? (
                  <div className="flex flex-col gap-5 py-2">
                    <ListBoxes name="bus" items={['Teja', 'Ravi']} quote size="md" positions={false} lane={false} />
                    <ListBoxes name="seats" items={['Teja', 'Ravi', 'Kiran']} quote size="md" positions={false} lane={false} states={{ 2: 'new' }} />
                  </div>
                ) : (
                  <Board sheets={sheets} tags={tags} minRows={3} />
                )}
              </Swap>
            </div>
          </>
        }
      />
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ===================================================================== C3 */

const C3 = SPEC.C3
const CK: Prog = C3.code[0]
const CK_OUT = CK.output.split('\n')

/**
 * C3. Press 1: check.py with lines 2 to 4 lit, the deck's three words. Press
 * 2: `3`; `800` walks the name column only (the amounts dim) and finds no
 * row, `False`; `True`. Press 3: lines 5 to 7, the vote for line 6. Press 4:
 * every row is wiped (select all, Delete) and the empty sheet stays with its
 * tag; `{}` and `0`.
 */
export function CheckIt() {
  const beat = useBeats(4)
  const { pick, setPick } = usePick()
  const walk = useStepPhase(beat, [450, 450, 450, 450])
  const wipe = useStepPhase(beat, [700])
  const searching = beat === 2 && walk < 3
  const at = Math.min(walk, 2)
  const tones: Record<string, RowTone> = {}
  if (beat === 2) TRIP.forEach(([n], i) => (tones[n] = i < walk ? 'miss' : i === walk ? 'now' : 'plain'))
  const wiped = beat === 4 && wipe >= 1
  const rows: Row[] = wiped ? [] : TRIP
  const out: OutLine[] = beat >= 4 ? lines(CK.output) : beat >= 2 ? CK_OUT.slice(0, 3).map((t) => ({ text: t })) : []
  const caption = beat === 2 ? C3.show[3] : beat >= 4 ? C3.show[7] : null
  const right = 0
  return (
    <>
      <TwoCols
        leftW={600}
        height={348}
        asking={beat === 1 || beat === 3}
        drawing={beat === 2 || beat === 4}
        left={
          <>
            <Focus on={beat === 1 || beat === 3}>
              <CodePane code={CK.src} fontSize={CODE_FS} rows={7} mark={beat <= 2 ? [2, 3, 4] : [5, 6, 7]} at={beat === 4 ? 5 : undefined} />
            </Focus>
            <Show on={beat >= 3}>
              <Vote options={[C3.show[4], C3.show[5], C3.show[6]]} right={right} shown={beat >= 4} pick={pick} setPick={setPick} template="82px 136px 1fr" size={13} nowrap dense />
            </Show>
          </>
        }
        right={
          <>
            <div className="flex items-center gap-2.5">
              {[C3.show[0], C3.show[1]].map((w) => (
                <span key={w} className="rounded-lg bg-white px-3 py-1 font-mono text-[16px] font-bold" style={{ color: colors.brandDark, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
                  {w}
                </span>
              ))}
              <span className="rounded-lg bg-white px-3 py-1 text-[15px] font-bold" style={{ color: colors.brandDark, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
                {C3.show[2]}
              </span>
            </div>
            <StepCaption text={caption} size={16} minH={64} />
            <div className="flex items-start gap-4">
              <Board lane sheets={[{ id: 'S1', title: TITLE, rows, tones, dimAmounts: searching, selected: beat === 4 && wipe < 1, search: searching ? { text: '800', at } : null }]} tags={[{ name: 'trip', to: 'S1' }]} minRows={3} />
              <OutPanel lines={out} minRows={5} fontSize={OUT_FS} className="min-w-0 flex-1" />
            </div>
          </>
        }
      />
      {beat >= 4 && pick === right && <Confetti seed={33} />}
      <StepControls at={beat} total={4} />
    </>
  )
}
