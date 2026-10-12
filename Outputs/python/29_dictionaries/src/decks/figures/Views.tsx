import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Confetti } from './motion'
import { Swap } from './pieces'
import { Vote } from './trace'
import { useStepPhase } from './phase'
import { Board, TagArrow, menuRows, type BoardRefs, type Row, type RowTone } from './board'
import { BoardCard, DeckLine } from './frame'
import { flyFrom } from './rows'
import { Face } from './people'
import { SPEC } from './spec'

/**
 * THE VIEWS: C10 (keys, values, items), C11 (loop over the board), C12 (a
 * window, not a photo). The strips are copies: the board keeps both columns
 * the whole card. Every program and output is the spec's, run on CPython
 * 3.12.3.
 */
const MENU3: Row[] = menuRows(SPEC).slice(0, 3)

/** A small copy of a tag or a card that flies in from its place on the board. */
function Copy({ kind, text, from, delay = 0, children }: { kind: 'tag' | 'card' | 'pair'; text?: string; from: HTMLElement | null; delay?: number; children?: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  const instant = useInstant()
  useLayoutEffect(() => {
    if (!instant) flyFrom(ref.current, from, 820, delay, 0.5)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const look =
    kind === 'tag'
      ? { background: colors.brandDark, color: colors.white, boxShadow: 'none' }
      : kind === 'card'
        ? { background: colors.white, color: colors.ink, boxShadow: `inset 0 0 0 2px ${colors.brand}` }
        : { background: colors.surface2, color: colors.ink, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }
  return (
    <span ref={ref} className="inline-flex h-[30px] items-center gap-1 whitespace-nowrap rounded-md px-2 font-mono font-bold" style={{ ...look, fontSize: kind === 'pair' ? 12 : 13 }}>
      {text ?? children}
    </span>
  )
}

/** One view, peeled off the board: its name, and the copies in a strip. */
function Strip({ label, on, children }: { label: string; on: boolean; children: ReactNode }) {
  const tween = useTween(420)
  return (
    <div className="flex h-[38px] items-center gap-2.5 rounded-lg px-2" style={{ background: on ? colors.white : 'transparent', boxShadow: on ? `inset 0 0 0 1.5px ${colors.line}` : `inset 0 0 0 1.5px ${colors.line}66`, transition: tween }}>
      <span className="w-[58px] shrink-0 font-mono text-[12.5px] font-bold" style={{ color: on ? colors.brandDark : colors.muted, transition: tween }}>
        {label}
      </span>
      <span className="flex items-center gap-1.5">{on ? children : null}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ C10 */

const C10 = SPEC.C10
const [VIEWS, KEYS_LIST] = C10.code as { file: string; src: string; output: string }[]
const OUT10: string[] = VIEWS.output.split('\n')
const OPTS10: string[] = [C10.show[3], C10.show[4]]
const RIGHT10 = OPTS10.indexOf(OUT10[1])

/**
 * C10, five presses: the three-row board, views.py with three empty output
 * lines, and the vote for line 3. Press 2 peels the tag column off as a
 * strip: keys(). Press 3 the card column: values(), both 15s. Press 4 lifts
 * each row whole as a pair in round brackets: items(). Press 5 is
 * keys_list.py: list() makes a normal list of the names.
 */
export function ThreeViews() {
  const beat = useBeats(5)
  const [pick, setPick] = useState(-1)
  const shown = beat >= 3
  const refs = useRef<BoardRefs>({ tags: {}, cards: {}, rows: {} })
  const filled = Math.min(Math.max(beat - 1, 0), 3)
  const out = OUT10.slice(0, filled).map((t) => ({ text: t }))
  const captionOf = (b: number) => (b === 2 ? C10.show[0] : b === 3 ? `${C10.show[1]} ${C10.show[5]}` : b === 4 ? C10.show[2] : null)
  return (
    <>
      <BoardCard
        code={VIEWS.src}
        rows={4}
        at={beat >= 2 && beat <= 4 ? beat : null}
        asking={beat === 1}
        vote={
          <Swap k={beat === 5 ? 'list' : 'vote'}>
            {beat === 5 ? (
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
                  {KEYS_LIST.file}
                </span>
                {/* the two chips at 14px: at 15 the printed list ran 7px past the 690px group (box-overflow group rule, 2026-10-12) */}
                <span className="whitespace-pre rounded-lg px-3 py-1 font-mono text-[14px] font-semibold" style={{ background: colors.night2, color: colors.white }}>
                  {KEYS_LIST.src.split('\n')[1]}
                </span>
                <span className="font-heading text-[16px] font-bold" style={{ color: colors.muted }}>
                  prints
                </span>
                <span className="whitespace-pre rounded-md px-2.5 py-0.5 font-mono text-[14px] font-bold" style={{ background: '#E9F8EF', color: colors.ink, boxShadow: `inset 0 0 0 1.5px ${colors.success}` }}>
                  {KEYS_LIST.output}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="shrink-0 whitespace-nowrap rounded-md px-2 py-0.5 font-mono text-[14px] font-bold" style={{ background: colors.brandDark, color: colors.white }}>
                  line 3
                </span>
                <div className="min-w-0 flex-1">
                  <Vote options={OPTS10} right={RIGHT10} shown={shown} pick={pick} setPick={setPick} cols={2} size={14} nowrap dense />
                </div>
              </div>
            )}
          </Swap>
        }
        out={out}
        outMinRows={3}
        board={
          <div className="flex flex-col gap-2">
            <Board rows={MENU3} size="lg" name="menu" refs={refs} />
            <div className="flex flex-col gap-1.5">
              <Strip label="keys()" on={beat >= 2}>
                {MENU3.map((r, i) => (
                  <Copy key={r.key} kind="tag" text={`'${r.key}'`} from={refs.current.tags[r.key]} delay={i * 140} />
                ))}
              </Strip>
              <Strip label="values()" on={beat >= 3}>
                {MENU3.map((r, i) => (
                  <Copy key={r.key} kind="card" text={String(r.value)} from={refs.current.cards[r.key]} delay={i * 140} />
                ))}
              </Strip>
              <Strip label="items()" on={beat >= 4}>
                {MENU3.map((r, i) => (
                  <Copy key={r.key} kind="pair" from={refs.current.rows[r.key]} delay={i * 140}>
                    ('{r.key}', {r.value})
                  </Copy>
                ))}
              </Strip>
            </div>
          </div>
        }
        boardActive={beat >= 2 && beat <= 4}
        caption={captionOf(beat)}
        captionTone="rule"
        captionMinH={44}
        codeW={690}
      />
      {shown && pick === RIGHT10 && <Confetti seed={26} />}
      <StepControls at={beat} total={5} />
    </>
  )
}

/* ------------------------------------------------------------------ C11 */

const C11 = SPEC.C11
const [EACH_ROW, EACH_NAME] = C11.code as { file: string; src: string; output: string }[]
const LINES11: string[] = EACH_ROW.output.split('\n')

/** A name over a box; the value flies in from `from` when it arrives. */
function NameBox({ name, value, from, k }: { name: string; value: string | null; from: HTMLElement | null; k: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const instant = useInstant()
  useLayoutEffect(() => {
    if (value !== null && !instant) flyFrom(ref.current, from, 760, 120, 0.5)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k])
  const has = value !== null
  return (
    <div className="flex flex-col items-center gap-1" style={{ width: 150 }}>
      <span className="font-mono text-[15px] font-bold leading-none" style={{ color: colors.brandDark }}>
        {name}
      </span>
      <span className="grid h-[40px] w-full place-items-center rounded-xl font-mono text-[17px] font-semibold" style={{ background: has ? '#E9F8EF' : 'transparent', border: `${has ? 3 : 2}px ${has ? 'solid' : 'dashed'} ${has ? colors.success : colors.line}`, transition: 'border-color 420ms, background-color 420ms', whiteSpace: 'pre' }}>
        <span ref={ref} className="inline-block" style={{ color: colors.ink }}>
          {value ?? ''}
        </span>
      </span>
    </div>
  )
}

/**
 * C11, five presses: each_row.py with an empty output. Presses 2 to 4, one
 * row per pass, top to bottom: the row lifts, splits into name and price,
 * and its line prints; the row goes back after its pass. Press 5 is the
 * deck's line and each_name.py: over keys() the loop gets only the names.
 */
export function LoopRows() {
  const beat = useBeats(5)
  const refs = useRef<BoardRefs>({ tags: {}, cards: {}, rows: {} })
  const k = beat - 2
  const row = k >= 0 && k < 3 ? MENU3[k] : null
  const phase = useStepPhase(beat, [250, 700])
  const tones: Record<string, RowTone> = {}
  if (row) tones[row.key] = 'lit'
  const prog = beat >= 5 ? EACH_NAME : EACH_ROW
  const out = beat >= 5 ? EACH_NAME.output.split('\n').map((t) => ({ text: t })) : LINES11.slice(0, Math.min(Math.max(beat - 1, 0), 3)).map((t) => ({ text: t }))
  const name = row && phase >= 1 ? `'${row.key}'` : null
  const price = row && phase >= 2 ? String(row.value) : null
  return (
    <>
      <BoardCard
        code={prog.src}
        codeKey={prog.file}
        rows={3}
        at={row ? 2 : null}
        asking={beat === 1}
        ask={beat === 1 ? C11.show[0] : undefined}
        out={out}
        outTitle={beat >= 5 ? `Output · ${EACH_NAME.file}` : 'Output'}
        outMinRows={3}
        note={beat >= 5 ? <DeckLine text={C11.show[1]} /> : undefined}
        board={
          <div className="flex flex-col gap-3">
            <Board rows={MENU3} tones={tones} size="lg" name="menu" refs={refs} lift={row && phase >= 1 ? row.key : null} lane={90} />
            <div className="flex items-end gap-3">
              <NameBox name="name" value={name} from={row ? refs.current.tags[row.key] : null} k={`n${beat}`} />
              <span className="pb-3 font-mono text-[18px] font-bold" style={{ color: colors.muted }}>,</span>
              <NameBox name="price" value={price} from={row ? refs.current.cards[row.key] : null} k={`p${beat}`} />
            </div>
          </div>
        }
        boardActive={!!row}
        caption={beat === 1 ? C11.show[0] : row ? `pass ${k + 1}: ${LINES11[k]}` : C11.show[2]}
        badge={row ? `line 2` : null}
        captionTone={beat >= 5 ? 'rule' : 'step'}
      />
      <StepControls at={beat} total={5} />
    </>
  )
}

/* ------------------------------------------------------------------ C12 */

const C12 = SPEC.C12
const WINDOW_PHOTO = C12.code[0] as { file: string; src: string; output: string }
const START12: Row[] = [{ key: 'tea', value: 12 }, { key: 'samosa', value: 15 }]

/** A framed look at the board: the canteen window (live) or Ravi's phone photo (fixed). */
function Frame({ kind, who, rows, lit }: { kind: 'window' | 'photo'; who: string; rows: Row[]; lit: boolean }) {
  const tween = useTween(420)
  const window = kind === 'window'
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex flex-col items-center gap-1">
        <Face name={who} size={36} />
        <span className="font-heading text-[12px] font-bold" style={{ color: colors.body }}>{who}</span>
      </div>
      <div className="relative rounded-xl p-2" style={{ background: window ? colors.surface2 : '#15191F', boxShadow: window ? `inset 0 0 0 3px ${colors.brand}${lit ? '' : '66'}` : `0 8px 18px -10px rgba(0,0,0,0.6)`, transition: tween }}>
        {window && <span aria-hidden className="pointer-events-none absolute inset-x-1/2 top-2 bottom-2 w-[2px]" style={{ background: `${colors.brand}55` }} />}
        <div className="flex flex-col gap-1 rounded-lg px-2 py-1.5" style={{ background: colors.white, boxShadow: window ? 'none' : `inset 0 0 0 1px ${colors.line}` }}>
          {rows.map((r) => (
            <div key={r.key} className="flex items-center">
              <span className="grid w-[64px] place-items-center rounded-md font-mono text-[11.5px] font-bold" style={{ height: 22, background: colors.brandDark, color: colors.white }}>{r.key}</span>
              <TagArrow w={22} draw={false} />
              <span className="grid w-[30px] place-items-center rounded-md font-mono text-[11.5px] font-bold" style={{ height: 22, background: colors.white, color: colors.ink, boxShadow: `inset 0 0 0 1.5px ${colors.brand}` }}>{r.value}</span>
            </div>
          ))}
        </div>
        <span className="mt-1 block text-center font-mono text-[12px] font-bold" style={{ color: window ? colors.brandDark : colors.white }}>
          {kind}
        </span>
      </div>
    </div>
  )
}

/**
 * C12, four presses: the real board, Teja at the canteen window (view) and
 * Ravi's phone photo of it (photo); window_photo.py. Press 2: Anna writes
 * bun at the bottom of the real board. Press 3: the window shows bun, the
 * photo does not, and the output fills. Press 4 is the deck's line.
 */
export function WindowPhoto() {
  const beat = useBeats(4)
  const rows: Row[] = beat >= 2 ? [...START12, { key: 'bun', value: 10 }] : START12
  const tones: Record<string, RowTone> = beat === 2 ? { bun: 'new' } : {}
  const out = beat >= 3 ? WINDOW_PHOTO.output.split('\n').map((t) => ({ text: t })) : []
  return (
    <>
      <BoardCard
        code={WINDOW_PHOTO.src}
        rows={6}
        at={beat === 2 ? 4 : beat === 3 ? 6 : null}
        mark={beat === 1 ? [2, 3] : undefined}
        asking={beat === 1 || beat === 2}
        out={out}
        outMinRows={2}
        note={beat >= 4 ? <DeckLine text={C12.show[3]} /> : undefined}
        board={
          <div className="flex items-start gap-3">
            <Board rows={rows} tones={tones} size="sm" name="menu" minRows={3} />
            <div className="flex flex-col gap-2.5">
              <Frame kind="window" who="Teja" rows={beat >= 3 ? rows : START12} lit={beat >= 3} />
              <Frame kind="photo" who="Ravi" rows={START12} lit={false} />
            </div>
          </div>
        }
        boardActive={beat >= 2}
        caption={beat === 1 ? C12.show[0] : beat === 2 ? C12.show[1] : beat === 3 ? C12.show[2] : C12.show[3]}
        captionTone={beat >= 3 ? 'rule' : 'step'}
      />
      <StepControls at={beat} total={4} />
    </>
  )
}

