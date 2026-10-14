import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Focus, Lines } from './common'
import { Appear, ListBoxes, Note, OutPanel, Swap, sentences, CODE_FS, OUT_FS, type BoxState, type OutLine } from './pieces'
import { CodePane, StepCaption } from './trace'
import { useStepPhase } from './phase'
import { CodeCard, DeckLine, TwoCols, lines, type Prog } from './cards'
import { SPEC } from './spec'

/**
 * C13 AND C14: MAP, AND THE LINE FOR EVERY CODING QUESTION.
 *
 * C13 (five presses): the definition and `map(function, sequence)`; the
 * cart's prices came in as text, a row of three strings over an empty row;
 * each price goes through int and drops into the new row, one at a time, the
 * text row staying lit (its keeps line); with_packing on real numbers; then
 * map(int(), ...) stops with TypeError: give map the name, not a call. The
 * map object is said only in words (its must line).
 *
 * C14 (seven presses): read_prices.py with the typed line on screen the
 * whole card; the one line read from the inside out, one piece per press,
 * each piece's result staying as the next bracket wraps it; the output; then
 * without map they are still text.
 */
const H = 400

/* ==================================================================== C13 */

const C13 = SPEC.C13
const PRICES: Prog = C13.code[0]
const PACKING: Prog = C13.code[1]
const CALLED: Prog = C13.code[2]
const TEXT = ['250', '90', '40']
const NUMS = ['250', '90', '40']
const PACKED = ['260', '100', '50']

/** A small down arrow between the two rows: the rule, `int` or `with_packing`, rides on it. Drawn in the gap, never on a box (rule 42). */
function Through({ label }: { label: string }) {
  const instant = useInstant()
  return (
    <div className="flex items-center gap-2 pl-[70px]">
      <svg width="14" height="30" viewBox="0 0 14 30" aria-hidden>
        <motion.line x1="7" y1="2" x2="7" y2="19" stroke={colors.brandDark} strokeWidth="2.5" initial={instant ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: instant ? 0 : 0.5, ease: 'easeInOut' }} />
        <path d="M2.5 19 L11.5 19 L7 28 Z" fill={colors.brandDark} />
      </svg>
      <span className="rounded-md px-2 py-0.5 font-mono text-[13px] font-bold" style={{ background: colors.surface2, color: colors.brandDark }}>
        {label}
      </span>
    </div>
  )
}

export function MapCard() {
  const beat = useBeats(5)
  const drop = useStepPhase(beat, [520, 520, 520])
  const landed = beat === 3 ? drop : beat >= 4 ? 3 : 0
  const packing = beat === 4
  const prog = beat >= 5 ? CALLED : packing ? PACKING : PRICES
  const out: OutLine[] = beat >= 5 ? lines(CALLED.output) : packing ? lines(PACKING.output) : beat >= 3 ? lines(PRICES.output) : []
  const caption = beat === 1 ? null : beat === 2 || beat === 3 ? C13.show[2] : beat === 4 ? null : C13.show[5]
  const top = packing ? NUMS : TEXT
  const newItems = packing ? PACKED : NUMS
  const states: Record<number, BoxState> = {}
  if (beat === 3 && landed > 0) states[landed - 1] = 'new'
  const rule = packing ? 'with_packing' : 'int'
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
                <DeckLine size={18}>{C13.show[0]}</DeckLine>
                <CodeCard lines={[C13.show[1]]} size={24} className="ml-2" />
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Focus on={beat === 2}>
                  <CodePane code={prog.src} fontSize={CODE_FS} rows={5} at={beat >= 5 ? 2 : undefined} stop={beat >= 5} highlight={beat === 3 || beat === 4 ? 2 + (packing ? 3 : 0) : undefined} />
                </Focus>
                <OutPanel lines={out} minRows={2} fontSize={OUT_FS} />
              </div>
            )}
          </Swap>
        }
        right={
          <>
            <StepCaption text={caption} size={16} minH={46} />
            <div className="flex flex-1 flex-col justify-center gap-2 pl-1" style={{ opacity: beat >= 2 ? 1 : 0, transition: 'opacity 480ms cubic-bezier(0.22,1,0.36,1)' }}>
              <ListBoxes name="prices" items={top} quote={!packing} size="md" positions={false} lane={false} />
              <Through label={rule} />
              <ListBoxes name={packing ? 'new list' : 'numbers'} items={newItems.slice(0, landed)} ghosts={3 - landed} size="md" positions={false} lane={false} states={states} width={packing ? 62 : 70} />
            </div>
            <div style={{ minHeight: 60 }}>
              {beat >= 5 && (
                <Appear>
                  <Note lines={[C13.show[7]]} size={13} />
                </Appear>
              )}
            </div>
          </>
        }
      />
      <StepControls at={beat} total={5} />
    </>
  )
}

/* ==================================================================== C14 */

const C14 = SPEC.C14
const READ: Prog = C14.code[0]
const READ_TEXT: Prog = C14.code[1]
type Piece = { piece: string; gives: string }
const BUILD: Piece[] = C14.data.build

/** One piece of the line and what it gives; the map object is said in words, never as code (C13's must line). */
function PieceRow({ p, n, on, lit }: { p: Piece; n: number; on: boolean; lit: boolean }) {
  const tween = useTween(480)
  const words = /map object/.test(p.gives)
  return (
    <div className="flex h-[52px] items-center gap-3 rounded-xl px-3" style={{ background: lit ? colors.surface2 : on ? colors.white : 'transparent', boxShadow: on ? `inset 0 0 0 ${lit ? 2.5 : 1.5}px ${lit ? colors.brand : colors.line}` : `inset 0 0 0 1.5px ${colors.line}44`, opacity: on ? 1 : 0.5, transition: tween }}>
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[12px] font-bold" style={{ background: on ? colors.brandDark : colors.surface2, color: on ? colors.white : colors.muted, transition: tween }}>
        {n}
      </span>
      <span className="whitespace-nowrap font-mono text-[14px] font-bold" style={{ color: on ? colors.brandDark : colors.muted }}>
        {p.piece}
      </span>
      <span className="ml-auto flex items-center gap-2" style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(6px)', transition: tween }}>
        <span className="text-[12px] font-bold" style={{ color: colors.muted }}>
          gives
        </span>
        {words ? (
          <span className="whitespace-nowrap text-[13.5px] font-semibold italic" style={{ color: colors.body }}>
            a map object, not a list yet
          </span>
        ) : (
          <span className="whitespace-nowrap rounded-md px-2 py-0.5 font-mono text-[13px] font-bold" style={{ background: '#E9F8EF', color: '#137A3A' }}>
            {p.gives}
          </span>
        )}
      </span>
    </div>
  )
}

export function InputLine() {
  const beat = useBeats(7)
  const built = beat >= 6 ? 4 : Math.max(0, beat - 1)
  const prog = beat >= 7 ? READ_TEXT : READ
  const out: OutLine[] = beat >= 7 ? lines(READ_TEXT.output) : beat >= 6 ? lines(READ.output) : []
  const caption = beat >= 7 ? C14.show[5] : C14.show[0]
  return (
    <>
      <TwoCols
        height={H}
        asking={beat === 1 || beat === 6}
        drawing={beat >= 2 && beat <= 5}
        left={
          <>
            <Focus on={beat === 1}>
              <CodePane code={prog.src} fontSize={CODE_FS} rows={3} highlight={1} at={beat >= 7 ? 2 : undefined} stop={beat >= 7} />
            </Focus>
            <OutPanel title="Input" tone="in" lines={[{ text: READ.input ?? '' }]} minRows={1} fontSize={OUT_FS} />
            <OutPanel lines={out} minRows={2} fontSize={OUT_FS} />
          </>
        }
        right={
          <>
            <StepCaption text={caption} tone="rule" size={16} minH={46} />
            <div className="flex flex-col gap-2">
              {BUILD.map((p, i) => (
                <PieceRow key={p.piece} p={p} n={i + 1} on={i < built} lit={beat >= 2 && beat <= 5 && i === built - 1} />
              ))}
            </div>
            <p className="text-[13px] font-semibold" style={{ color: colors.muted }}>
              <Lines lines={sentences('Read it from the inside out: the inner piece first, then the next bracket wraps it')} />
            </p>
          </>
        }
      />
      <StepControls at={beat} total={7} />
    </>
  )
}
