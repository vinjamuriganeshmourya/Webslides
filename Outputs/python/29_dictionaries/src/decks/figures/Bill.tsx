import { useLayoutEffect, useRef } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Board, menuRows, type BoardRefs, type Row, type RowTone } from './board'
import { BoardCard } from './frame'
import { flyFrom } from './rows'
import { useStepPhase } from './phase'
import { SPEC } from './spec'

/**
 * E1 · RAVI'S BILL. Six presses: bill.py with its line numbers, the full
 * board, a total box at 0, and the order, tea samosa tea. One word per
 * press (2 to 4), in the order of data.walk: the word lights on line 4, on
 * line 5 its tag lights on the board and a copy of its price flies into the
 * total box, which shows the new total. Tea lights twice: it is looked up
 * again each time. Press 5 fills the output, 39, and greys the rows nobody
 * ordered, which stay grey. Press 6 is the rule. No row moves and no price
 * changes. The program is the spec's, run on CPython 3.12.3.
 */
const E1 = SPEC.E1
const BILL = E1.code[0] as { file: string; src: string; output: string; input: string }
const MENU: Row[] = menuRows(SPEC)
type Walk = { pass: number; item: string; price: number; total: number; lit_rows: string[]; grey_rows: string[]; caption: string }
const WALK: Walk[] = E1.data.walk
const ORDER: string[] = E1.data.input.split(' ')
const GREY_AT_END: string[] = E1.data.grey_at_end

/** The order, as typed: each word a chip; the one being looked up lights. */
function OrderLine({ lit }: { lit: number | null }) {
  const tween = useTween(420)
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
        Input
      </span>
      <span className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
        {ORDER.map((w, i) => (
          <span key={i} className="rounded-md px-2 py-0.5 font-mono text-[15px] font-semibold" style={{ color: lit === i ? colors.brandDark : colors.ink, background: lit === i ? colors.surface2 : 'transparent', boxShadow: lit === i ? `inset 0 0 0 1.5px ${colors.brand}` : 'none', transition: tween }}>
            {w}
          </span>
        ))}
      </span>
    </div>
  )
}

/** The total box: the running total, and the price that just flew in. */
function TotalBox({ value, flyer, from }: { value: number; flyer: number | null; from: HTMLElement | null }) {
  const instant = useInstant()
  const tween = useTween(420)
  const ref = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    if (flyer === null || instant) return
    flyFrom(ref.current, from, 520, 0, 0.6)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyer, from])
  return (
    <div className="flex flex-col items-center gap-1.5 self-start rounded-xl bg-white px-4 pb-3 pt-2" style={{ width: 118, boxShadow: `inset 0 0 0 2px ${colors.line}` }}>
      <span className="font-mono text-[14px] font-bold" style={{ color: colors.brandDark }}>
        total
      </span>
      <span className="relative grid h-[44px] w-full place-items-center rounded-lg font-mono text-[24px] font-bold" style={{ background: colors.surface2, color: colors.ink, transition: tween }}>
        <span key={value} className="sm-bump">{value}</span>
        {flyer !== null && (
          <span ref={ref} className="absolute grid h-[36px] w-[56px] place-items-center rounded-lg font-mono text-[17px] font-bold" style={{ background: '#E9F8EF', color: colors.ink, boxShadow: `0 0 0 2.5px ${colors.success}` }}>
            {flyer}
          </span>
        )}
      </span>
    </div>
  )
}

export function Bill() {
  const beat = useBeats(6)
  const refs = useRef<BoardRefs>({ tags: {}, cards: {}, rows: {} })
  const k = beat - 2 /* which pass is walking */
  const pass = k >= 0 && k < WALK.length ? WALK[k] : null
  /* the word lights on line 4; then the tag on line 5; then its price flies into the total */
  const phase = useStepPhase(beat, [250, 650, 560])
  const tones: Record<string, RowTone> = {}
  const litSoFar = pass ? (phase >= 2 ? pass.lit_rows : WALK[k - 1]?.lit_rows ?? []) : beat >= 5 ? WALK[WALK.length - 1].lit_rows : []
  for (const key of litSoFar) tones[key] = 'lit'
  if (beat >= 5) for (const key of GREY_AT_END) tones[key] = 'grey'
  const total = pass ? (phase >= 3 ? pass.total : WALK[k - 1]?.total ?? 0) : beat >= 5 ? WALK[WALK.length - 1].total : 0
  const at = pass ? (phase >= 2 ? 5 : 4) : null
  const out = beat >= 5 ? [{ text: BILL.output }] : []
  return (
    <>
      <BoardCard
        code={BILL.src}
        rows={6}
        at={at}
        asking={beat === 1}
        ask={<OrderLine lit={pass && phase >= 1 ? k : null} />}
        out={out}
        board={<Board rows={MENU} tones={tones} size="lg" name="menu" refs={refs} />}
        boardExtra={<TotalBox value={total} flyer={pass && phase === 2 ? pass.price : null} from={pass ? refs.current.cards[pass.item] : null} />}
        boardActive={beat >= 2 && beat <= 4}
        caption={beat === 1 ? E1.show[1] : pass ? pass.caption : beat === 5 ? E1.show[2] : E1.show[3]}
        badge={pass ? `pass ${pass.pass}` : null}
        captionTone={beat >= 5 ? 'rule' : 'step'}
      />
      <StepControls at={beat} total={6} />
    </>
  )
}
