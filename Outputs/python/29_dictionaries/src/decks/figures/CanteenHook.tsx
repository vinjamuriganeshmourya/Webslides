import { AnimatePresence, motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Group } from './common'
import { Appear, Fresh, OutPanel, Swap, CODE_FS, OUT_FS } from './pieces'
import { CodePane, StepCaption } from './trace'
import { useStepPhase } from './phase'
import { Board, toRows, type Row, type RowTone } from './board'
import { HALF, Idling, TEJA } from './Cast'
import { ANNA } from './people'
import { SPEC } from './spec'

/**
 * H1 · MAGGI FOR 20. Six presses, and neither the session's name nor the
 * words dictionary, key or value anywhere on the card (its must_not lines).
 *
 * The canteen at 5 pm: Anna behind the counter in his apron, his whiteboard
 * in marker (one line per item, no numbers), Teja at the counter. Press 2
 * lights tea and then maggi, name first, price next, and dims the rest.
 * Press 3 brings Teja's billing program beside the scene: the names list
 * and the prices list as two rows in step, each name above its price, and
 * the bill, 42. Press 4 wipes the puff line off the board and adds one line
 * to the program. Press 5 is the moment: puff leaves the names row only,
 * maggi slides one place left and now sits over 20, the prices row does not
 * move, and the bill says 32. Press 6 is the turn: the two rows zip into one
 * column of name tags joined to price cards, and puff's tag and card leave
 * together. Both programs are the spec's, run on CPython 3.12.3.
 */
const H1 = SPEC.H1
const BOARD: Row[] = toRows(H1.data.board)
const NAMES: string[] = BOARD.map((r) => r.key)
const PRICES: number[] = BOARD.map((r) => Number(r.value))
const ORDER: string[] = H1.data.order
const GONE: string = H1.data.gone
const BILL = H1.code[0]
const NO_PUFF = H1.code[1]
const HOUSE = [0.22, 1, 0.36, 1] as const
/* The left box's two fixed heights (fix pass, 2026-10-12): the caption box holds its tallest caption (press 4's three
   lines at 16px) on every press, and the scene above it is what is left of the 431px card, so neither moves when the
   caption changes. The board (5 rows, 301px) and its clearance over the counter fit the scene exactly. */
const CAP_H = 86
const SCENE_H = 431 - 20 - 8 - CAP_H

/**
 * The two lists, in step: `names` above `prices`, one cell above the other,
 * the position under each. A name that leaves the names row fades out and
 * the names after it slide one place left; the prices row never moves.
 */
export type CellTone = 'plain' | 'hit' | 'mark' | 'bad' | 'ghost'
const CELL_W = 84
const CELL_H = 42
export type ListSize = { w: number; h: number; fs: number; tagW: number }
const look = (t: CellTone) =>
  t === 'hit' ? { bg: '#E9F8EF', ring: colors.success, thick: true, dash: false } : t === 'mark' ? { bg: '#FFF4EC', ring: colors.accent, thick: true, dash: false } : t === 'bad' ? { bg: '#FDECEC', ring: colors.danger, thick: true, dash: false } : t === 'ghost' ? { bg: 'transparent', ring: colors.danger, thick: false, dash: true } : { bg: colors.white, ring: colors.line, thick: false, dash: false }

/** One list cell. A top-level component, so AnimatePresence can track it between renders (a component made inside its parent remounts on every render and never finishes an exit). */
function Cell({ text, tone, sz, fresh = false }: { text: string; tone: CellTone; sz: ListSize; fresh?: boolean }) {
  const instant = useInstant()
  const tween = useTween(420)
  const L = look(tone)
  return (
    <motion.div layout={instant ? false : 'position'} className="flex flex-col items-center" style={{ width: sz.w }} initial={fresh && !instant ? { opacity: 0, y: 12 } : false} animate={{ opacity: 1, y: 0, transition: { duration: instant ? 0 : 0.5, ease: HOUSE } }} exit={{ opacity: 0, y: -18, transition: { duration: instant ? 0 : 0.5, ease: HOUSE } }} transition={{ layout: { duration: instant ? 0 : 0.7, ease: HOUSE } }}>
      <span className="grid place-items-center rounded-xl font-mono font-semibold" style={{ width: sz.w - (sz.w < 70 ? 5 : 8), height: sz.h, fontSize: sz.fs, background: L.bg, color: tone === 'ghost' ? colors.danger : colors.ink, border: `${L.thick ? 3 : 2}px ${L.dash ? 'dashed' : 'solid'} ${L.ring}`, transition: tween, whiteSpace: 'nowrap' }}>
        {text}
      </span>
    </motion.div>
  )
}

function Idx({ n, sz, bad = false }: { n: number; sz: ListSize; bad?: boolean }) {
  return (
    <span className="grid place-items-center font-mono leading-none" style={{ width: sz.w, fontSize: sz.fs - 1, color: bad ? colors.danger : colors.muted, fontWeight: bad ? 700 : 500 }}>
      {n}
    </span>
  )
}

function NameTag({ t, sz }: { t: string; sz: ListSize }) {
  return (
    <span className="grid shrink-0 place-items-center rounded-lg px-2 font-mono font-bold" style={{ width: sz.tagW, height: sz.h, fontSize: sz.fs - 1, background: colors.brandDark, color: colors.white }}>
      {t}
    </span>
  )
}

export const LIST_LG: ListSize = { w: CELL_W, h: CELL_H, fs: 15, tagW: 72 }
export const LIST_SM: ListSize = { w: 56, h: 34, fs: 10, tagW: 44 }

/**
 * The two lists, in step: `names` above `prices`, one cell above the other,
 * the position under each. A name that leaves the names row fades out and
 * the names after it slide one place left; the prices row never moves.
 */
export function TwoLists({ names, prices, nameTones, priceTones, sz = LIST_LG, fresh = [], ghosts = 0, badIdx = [] }: { names: string[]; prices: number[]; nameTones: Record<string, CellTone>; priceTones: Record<number, CellTone>; sz?: ListSize; /** names that just joined the row (they rise in) */ fresh?: string[]; /** dashed red places past the prices' end (H2: a name with no price under it) */ ghosts?: number; /** positions whose number is red (past the end) */ badIdx?: number[] }) {
  const count = Math.max(names.length, prices.length + ghosts)
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center" style={{ gap: sz.w < 70 ? 6 : 12 }}>
        <NameTag t="names" sz={sz} />
        <div className="flex">
          <AnimatePresence initial={false}>
            {names.map((n) => (
              <Cell key={`n-${n}`} text={`"${n}"`} tone={nameTones[n] ?? 'plain'} sz={sz} fresh={fresh.includes(n)} />
            ))}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex items-center" style={{ gap: sz.w < 70 ? 6 : 12 }}>
        <span style={{ width: sz.tagW }} />
        <div className="flex">
          {Array.from({ length: count }, (_, i) => (
            <Idx key={i} n={i} sz={sz} bad={badIdx.includes(i)} />
          ))}
        </div>
      </div>
      <div className="flex items-center" style={{ gap: sz.w < 70 ? 6 : 12 }}>
        <NameTag t="prices" sz={sz} />
        <div className="flex">
          {prices.map((p, i) => (
            <Cell key={`p-${i}`} text={String(p)} tone={priceTones[i] ?? 'plain'} sz={sz} />
          ))}
          {Array.from({ length: ghosts }, (_, i) => (
            <Cell key={`g-${i}`} text="?" tone="ghost" sz={sz} fresh />
          ))}
        </div>
      </div>
    </div>
  )
}

export function CanteenHook() {
  const beat = useBeats(6)
  /* press 2: tea's name, then its price; then maggi's name, then its price */
  const light = useStepPhase(beat, [200, 600, 600, 600])
  /* press 5: puff leaves, then maggi lands on 20 and the bill fills */
  const slide = useStepPhase(beat, [300, 900])
  /* press 6: the rows zip into tags and cards, then puff's pair leaves together */
  const zip = useStepPhase(beat, [200, 600])

  /* the whiteboard: puff is wiped on press 4 */
  const boardRows = beat >= 4 ? BOARD.filter((r) => r.key !== GONE) : BOARD
  const tones: Record<string, RowTone> = {}
  const nameOnly: string[] = []
  if (beat === 2) {
    if (light >= 1) tones[ORDER[0]] = 'lit'
    if (light >= 3) tones[ORDER[1]] = 'lit'
    if (light === 1) nameOnly.push(ORDER[0])
    if (light === 3) nameOnly.push(ORDER[1])
    if (light >= 1) for (const r of BOARD) if (!ORDER.includes(r.key)) tones[r.key] = 'grey'
  }

  /* the lists: puff leaves names on press 5 (after a beat), the prices row never changes */
  const names = beat >= 5 && slide >= 1 ? NAMES.filter((n) => n !== GONE) : NAMES
  const nameTones: Record<string, CellTone> = {}
  const priceTones: Record<number, CellTone> = {}
  if (beat === 3) {
    for (const o of ORDER) {
      nameTones[o] = 'hit'
      priceTones[NAMES.indexOf(o)] = 'hit'
    }
  }
  if (beat === 5 && slide >= 2) {
    nameTones.tea = 'hit'
    priceTones[0] = 'hit'
    nameTones.maggi = 'mark'
    priceTones[names.indexOf('maggi')] = 'mark'
  }
  const prog = beat >= 4 ? NO_PUFF : BILL
  const out = beat === 3 || (beat === 5 && slide >= 2) || beat === 6 ? [{ text: beat >= 5 ? NO_PUFF.output : BILL.output }] : []
  const zipRows: Row[] = zip >= 2 ? BOARD.filter((r) => r.key !== GONE) : BOARD
  const caption = beat === 4 ? `${H1.show[3]} ${H1.show[4]}` : H1.show[beat === 5 ? 5 : beat === 6 ? 6 : beat - 1]
  return (
    <>
      <div className="flex items-stretch gap-3" style={{ height: 431 }}>
        {/* the canteen: Anna, the board, Teja, the counter */}
        <Group pad={10} className="flex shrink-0 flex-col gap-2" active={beat <= 2} style={{ width: beat >= 3 ? 470 : 1150, transition: 'width 600ms cubic-bezier(0.22,1,0.36,1)' }}>
          {/* 450px across from press 3: Anna, the board (its side padding 10 on this card, its marker rows are 182px in a 228px body) and Teja with 8px gaps all sit inside the group (box-overflow group rule, 2026-10-12) */}
          <div className="relative flex shrink-0 items-end gap-2 pb-3" style={{ height: SCENE_H }}>
            <div className="flex items-end" style={{ marginBottom: 8 }}>
              <Idling cfg={ANNA} crop={HALF} scale={0.44} seed={9} apron />
            </div>
            <Board rows={boardRows} tones={tones} nameOnly={nameOnly} size="lg" marker title="Anna's canteen" minRows={5} style={{ marginBottom: 4, paddingLeft: 10, paddingRight: 10 }} />
            <div className="flex items-end">
              <Idling cfg={TEJA} crop={HALF} scale={0.4} seed={4} />
            </div>
            {/* the counter */}
            <span aria-hidden className="absolute bottom-0 left-0 h-[12px] rounded-full" style={{ width: 440, background: colors.line }} />
          </div>
          <StepCaption text={caption} size={16} h={CAP_H} />
        </Group>
        {/* Teja's billing program, from press 3 */}
        {beat >= 3 && (
          <Appear className="flex min-w-0 flex-1 flex-col gap-2">
            <Group pad={8} active={beat === 4}>
              <Fresh k={prog.file}>
                <CodePane code={prog.src} fontSize={CODE_FS} rows={6} highlight={beat === 4 ? 3 : undefined} />
              </Fresh>
            </Group>
            <Group pad={10} className="flex min-h-0 flex-1 items-center gap-4" active={beat === 5 || beat === 6}>
              <div className="min-w-0 flex-1">
                <Swap k={beat === 6 ? 'zip' : 'lists'}>
                  {beat === 6 ? (
                    <Board rows={zipRows} size="sm" minRows={4} style={{ width: 'max-content' }} />
                  ) : (
                    <TwoLists names={names} prices={PRICES} nameTones={nameTones} priceTones={priceTones} />
                  )}
                </Swap>
              </div>
              <OutPanel lines={out} minRows={1} fontSize={OUT_FS} className="w-[150px] shrink-0" />
            </Group>
          </Appear>
        )}
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}
