import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Focus } from './common'
import { Confetti } from './motion'
import { ListBoxes, OutPanel, Show, Swap, Fresh, CODE_FS, OUT_FS, type OutLine } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { DeckLine, TwoCols, usePick } from './DictCards'
import { CallStrip, ParamBoxes, parseCall, useChips, type BoxSpec } from './boxes'
import { Sheet } from './sheet'
import { SPEC } from './spec'

/**
 * C4 TO C8: *friends PACKS A TUPLE, * OPENS A LIST, **paid PACKS A
 * DICTIONARY, paid IS A REAL DICTIONARY, ** OPENS A DICTIONARY.
 *
 * Every card is the program with its output on the left, and on the right the
 * call as a strip of chips over the parameter boxes (`boxes.tsx`): each
 * argument flies from its chip into its box on the press that runs the
 * call. Every output box starts empty and fills on the press after the room
 * has said or voted its answer. Every program and output is the spec's, run
 * on CPython 3.12.3.
 */
type Prog = { file: string; src: string; output: string }
const lines = (s: string): OutLine[] => s.split('\n').map((t) => ({ text: t, tone: /^[A-Z]\w*Error/.test(t) ? 'error' : 'plain' }))
/** A value as Python prints it (`'Teja'`) back to the chip as the call wrote it (`"Teja"`). */
const asWritten = (t: string) => t.replace(/^'(.*)'$/, '"$1"')

/* ===================================================================== C4 */

const C4 = SPEC.C4
const SHOW: Prog = C4.code[0]
const MAX: Prog = C4.code[1]
const SHOW_OUT = SHOW.output.split('\n')
const CALL3 = parseCall(SHOW.src.split('\n')[3])
const CALL1 = parseCall(SHOW.src.split('\n')[4])

/**
 * C4. Press 1: the deck's line and max.py. Press 2: show.py, the box
 * `*friends` as `()`, the vote. Press 3: the three names fly one by one into
 * the tuple box, which grows; the output. Press 4: `('Sai',)` with its
 * comma and `()`; the deck's line about packing.
 */
export function PacksTuple() {
  const beat = useBeats(4)
  const { pick, setPick } = usePick()
  const chips = useChips()
  const onShow = beat >= 2
  const out: OutLine[] = beat === 1 ? [{ text: MAX.output }] : beat === 3 ? [{ text: SHOW_OUT[0] }] : beat >= 4 ? lines(SHOW.output) : []
  const call = beat >= 4 ? CALL1 : CALL3
  const items = beat === 3 ? SHOW_OUT[0].replace(/^\(|\)$/g, '').split(', ') : beat >= 4 ? ["'Sai'"] : []
  const used = items.map(asWritten)
  const boxes: BoxSpec[] = [{ name: 'friends', kind: 'tuple', items, tone: beat === 3 || beat === 4 ? 'lit' : 'plain' }]
  const right = 0
  return (
    <>
      <TwoCols
        asking={beat === 2}
        drawing={beat === 3 || beat === 4}
        left={
          <>
            <Focus on={beat === 2}>
              <CodePane code={onShow ? SHOW.src : MAX.src} fontSize={CODE_FS} rows={6} at={beat === 3 ? 4 : beat >= 4 ? 6 : undefined} />
            </Focus>
            <OutPanel lines={out} minRows={3} fontSize={OUT_FS} />
          </>
        }
        right={
          <>
            <Swap k={beat >= 4 ? 'packed' : 'any'}>
              <DeckLine>{beat >= 4 ? C4.show[5] : C4.show[0]}</DeckLine>
            </Swap>
            <StepCaption text={beat >= 2 && beat < 4 ? C4.show[1] : null} size={16} minH={46} />
            <Show on={onShow}>
              <Fresh k={beat >= 4 ? 'one' : 'three'} className="flex flex-col gap-3">
                <CallStrip fn={call.fn} args={call.args} used={used} chipRef={chips.set} />
                <ParamBoxes boxes={boxes} from={(t) => chips.get(asWritten(t))} />
              </Fresh>
            </Show>
            <Show on={onShow}>
              <Vote options={[C4.show[2], C4.show[3], C4.show[4]]} right={right} shown={beat >= 3} pick={pick} setPick={setPick} cols={1} size={15} nowrap dense />
            </Show>
          </>
        }
      />
      {beat >= 3 && pick === right && <Confetti seed={34} />}
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ===================================================================== C5 */

const C5 = SPEC.C5
const TB: Prog = C5.code[0]
const NS: Prog = C5.code[1]
const TABLE = ['Teja', 'Ravi', 'Kiran']
const LIST_LIT = `['Teja', 'Ravi', 'Kiran']`

/**
 * C5. Press 1: table.py, the list `table`, the call `split(1200, *table)`
 * over the boxes `bill` and `*friends`. Press 2: the list bursts open into
 * three names that fly into the tuple box; the output. Press 3: the same
 * call without the star, the vote. Press 4: the whole list lands as one
 * item, brackets and all; len is 1, so the share is 1200.
 */
export function OpensList() {
  const beat = useBeats(4)
  const { pick, setPick } = usePick()
  const chips = useChips()
  const noStar = beat >= 3
  const prog = noStar ? NS : TB
  const call = parseCall(prog.src)
  const ran = beat === 2 || beat === 4
  const out: OutLine[] = ran ? lines(prog.output) : []
  const opened: Record<string, string[]> = beat === 2 ? { '*table': TABLE.map((n) => `"${n}"`) } : {}
  const used = beat === 2 ? ['1200', ...TABLE.map((n) => `"${n}"`)] : beat === 4 ? ['1200', 'table'] : []
  const boxes: BoxSpec[] = [
    { name: 'bill', kind: 'named', value: ran ? '1200' : null },
    { name: 'friends', kind: 'tuple', items: beat === 2 ? TABLE.map((n) => `'${n}'`) : beat === 4 ? [LIST_LIT] : [], tone: ran ? 'lit' : 'plain' },
  ]
  const caption = beat === 1 ? C5.show[0] : beat === 2 ? C5.show[4] : null
  const right = 1
  return (
    <>
      <TwoCols
        asking={beat === 1 || beat === 3}
        drawing={ran}
        left={
          <>
            <Focus on={beat === 1 || beat === 3}>
              <CodePane code={prog.src} fontSize={CODE_FS} rows={7} at={ran ? 7 : undefined} />
            </Focus>
            <OutPanel lines={out} minRows={3} fontSize={OUT_FS} />
          </>
        }
        right={
          <>
            <StepCaption text={caption} size={16} minH={46} />
            <div className="flex items-center gap-5">
              <ListBoxes name="table" items={TABLE} quote size="sm" positions={false} lane={false} />
            </div>
            <Fresh k={noStar ? 'nostar' : 'star'} className="flex flex-col gap-3">
              <CallStrip fn={call.fn} args={call.args} used={used} opened={opened} chipRef={chips.set} />
              <ParamBoxes boxes={boxes} from={(t) => chips.get(t === LIST_LIT ? 'table' : asWritten(t))} />
            </Fresh>
            <Show on={noStar}>
              <Vote options={[C5.show[1], C5.show[2], C5.show[3]]} right={right} shown={beat >= 4} pick={pick} setPick={setPick} cols={1} size={15} nowrap dense />
            </Show>
          </>
        }
      />
      {beat >= 4 && pick === right && <Confetti seed={35} />}
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ===================================================================== C6 */

const C6 = SPEC.C6
const MP: Prog = C6.code[0]
const MP_OUT = MP.output.split('\n')
const CALL_PAID = parseCall(MP.src.split('\n')[3])
const CALL_NONE = parseCall(MP.src.split('\n')[4])

/**
 * C6. Press 1: mark_paid.py, the deck's line, the box `**paid` as `{}`, the
 * vote. Press 2: Teja=1500 flies in and becomes a row, then Ravi=800; the box
 * looks like the trip sheet; the output. Press 3: no arguments, `{}`; the
 * deck's line about packing.
 */
export function PacksDict() {
  const beat = useBeats(3)
  const { pick, setPick } = usePick()
  const chips = useChips()
  const call = beat >= 3 ? CALL_NONE : CALL_PAID
  const rows: [string, string][] = beat === 2 ? CALL_PAID.args.map((a) => [a.split('=')[0], a.split('=')[1]]) : []
  const out: OutLine[] = beat === 2 ? [{ text: MP_OUT[0] }] : beat >= 3 ? lines(MP.output) : []
  const boxes: BoxSpec[] = [{ name: 'paid', kind: 'dict', rows, tone: beat >= 2 ? 'lit' : 'plain' }]
  const right = 0
  return (
    <>
      <TwoCols
        height={371}
        asking={beat === 1}
        drawing={beat >= 2}
        left={
          <>
            <Focus on={beat === 1}>
              <CodePane code={MP.src} fontSize={CODE_FS} rows={5} at={beat === 2 ? 4 : beat >= 3 ? 5 : undefined} />
            </Focus>
            <OutPanel lines={out} minRows={2} fontSize={OUT_FS} />
          </>
        }
        right={
          <>
            <Swap k={beat >= 3 ? 'packed' : 'any'}>
              <DeckLine>{beat >= 3 ? C6.show[5] : C6.show[0]}</DeckLine>
            </Swap>
            <StepCaption text={beat < 3 ? C6.show[1] : null} size={16} minH={46} />
            <Fresh k={beat >= 3 ? 'none' : 'two'} className="flex flex-col gap-3" style={{ height: 113 }}>
              <CallStrip fn={call.fn} args={call.args} used={beat === 2 ? CALL_PAID.args : []} chipRef={chips.set} />
              <ParamBoxes boxes={boxes} from={(t) => chips.get(t)} keyText={(t) => t.replace(':', '=')} />
            </Fresh>
            <Vote options={[C6.show[2], C6.show[3], C6.show[4]]} right={right} shown={beat >= 2} pick={pick} setPick={setPick} cols={1} size={15} nowrap dense />
          </>
        }
      />
      {beat >= 2 && pick === right && <Confetti seed={36} />}
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ===================================================================== C7 */

const C7 = SPEC.C7
const PL: Prog = C7.code[0]
const PL_OUT = PL.output.split('\n')
const PAID_ROWS: [string, string][] = [
  ['Teja', '1500'],
  ['Ravi', '800'],
]

/**
 * C7. Press 1: paid_loop.py and the deck's two lines; the dictionary box
 * from C6, full. Presses 2 and 3: one row per press lifts, splits into name
 * and amount, and its line prints. Press 4: `"Ravi" in paid`, True.
 */
export function RealDict() {
  const beat = useBeats(4)
  const k = beat - 2 /* the row on this press, 0 or 1 */
  const row = k >= 0 && k < 2 ? PAID_ROWS[k] : null
  const out: OutLine[] = beat >= 2 ? PL_OUT.slice(0, Math.min(beat - 1, 3)).map((t) => ({ text: t })) : []
  const boxes: BoxSpec[] = [
    { name: 'paid', kind: 'dict', rows: PAID_ROWS, tone: beat >= 2 ? 'lit' : 'plain' },
    { name: 'name', kind: 'named', value: row ? `'${row[0]}'` : beat >= 4 ? `'Ravi'` : null },
    { name: 'amount', kind: 'named', value: row ? row[1] : beat >= 4 ? '800' : null },
  ]
  return (
    <>
      <TwoCols
        asking={beat === 1}
        drawing={beat >= 2}
        left={
          <>
            <Focus on={beat === 1}>
              <CodePane code={PL.src} fontSize={CODE_FS} rows={6} at={beat === 2 || beat === 3 ? 3 : beat >= 4 ? 4 : undefined} mark={beat === 2 || beat === 3 ? [2] : undefined} />
            </Focus>
            <OutPanel lines={out} minRows={3} fontSize={OUT_FS} />
          </>
        }
        right={
          <>
            <DeckLine>{`${C7.show[0]} ${C7.show[1]}`}</DeckLine>
            <StepCaption text={beat === 1 ? C7.show[2] : beat >= 4 ? `"Ravi" in paid` : null} size={16} minH={46} />
            <div className="flex flex-1 items-center">
              <ParamBoxes boxes={boxes} gap={26} />
            </div>
          </>
        }
      />
      <StepControls at={beat} total={4} />
    </>
  )
}

/* ===================================================================== C8 */

const C8 = SPEC.C8
const RC: Prog = C8.code[0]
const RW: Prog = C8.code[1]
const PIECES_OK = ['name="Teja"', 'block="C"']
const PIECES_WRONG = ['student="Teja"', 'block="C"']

/**
 * C8. Press 1: room_card.py, the room card (a dictionary) and the boxes
 * `name` and `block`, empty. Press 2: `**data` opens into name="Teja" and
 * block="C"; each lands in the box with its name; `Teja C`. Press 3: the
 * key is student, not name; the vote. Press 4: student="Teja" finds no box
 * called student and stops; the box `name` stays empty, nothing prints,
 * TypeError.
 */
export function OpensDict() {
  const beat = useBeats(4)
  const { pick, setPick } = usePick()
  const chips = useChips()
  const wrong = beat >= 3
  const prog = wrong ? RW : RC
  const call = parseCall(prog.src)
  const ran = beat === 2 || beat === 4
  const pieces = wrong ? PIECES_WRONG : PIECES_OK
  const opened: Record<string, string[]> = ran ? { '**data': pieces } : {}
  const used = beat === 2 ? PIECES_OK : beat === 4 ? ['block="C"'] : []
  const out: OutLine[] = ran ? lines(prog.output) : []
  const boxes: BoxSpec[] = [
    { name: 'name', kind: 'named', value: beat === 2 ? "'Teja'" : null, tone: beat === 4 ? 'stop' : 'plain' },
    { name: 'block', kind: 'named', value: ran ? "'C'" : null },
  ]
  const cardRows: [string, string][] = wrong ? [['student', 'Teja'], ['block', 'C']] : [['name', 'Teja'], ['block', 'C']]
  const caption = beat === 1 ? C8.show[0] : beat === 2 ? C8.show[1] : beat === 3 ? C8.show[2] : C8.show[5]
  const right = 1
  return (
    <>
      <TwoCols
        asking={beat === 1 || beat === 3}
        drawing={ran}
        left={
          <>
            <Focus on={beat === 1 || beat === 3}>
              <CodePane code={prog.src} fontSize={CODE_FS} rows={5} at={ran ? 5 : undefined} stop={beat === 4} />
            </Focus>
            <OutPanel lines={out} minRows={1} fontSize={OUT_FS} />
          </>
        }
        right={
          <>
            <StepCaption text={caption} size={16} minH={46} />
            <div className="flex items-start gap-6">
              <Fresh k={wrong ? 'wrong' : 'ok'}>
                <Sheet title="Room card" look="card" cols={null} rows={cardRows} width={190} />
              </Fresh>
              <Fresh k={wrong ? 'wrong' : 'ok'} className="flex flex-col gap-3">
                <CallStrip fn={call.fn} args={call.args} used={used} opened={opened} bad={beat === 4 ? 'student="Teja"' : null} chipRef={chips.set} />
                <ParamBoxes boxes={boxes} from={(t) => chips.get(pieces.find((p) => p.endsWith(`=${asWritten(t)}`)) ?? '')} />
              </Fresh>
            </div>
            <Show on={wrong}>
              <Vote options={[C8.show[3], C8.show[4]]} right={right} shown={beat >= 4} pick={pick} setPick={setPick} cols={2} size={16} nowrap dense />
            </Show>
          </>
        }
      />
      {beat >= 4 && pick === right && <Confetti seed={38} />}
      <StepControls at={beat} total={4} />
    </>
  )
}

