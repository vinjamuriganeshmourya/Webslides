import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Focus, Group } from './common'
import { Confetti } from './motion'
import { OutPanel, Show, Swap, CODE_FS, OUT_FS, type OutLine } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { useStepPhase } from './phase'
import { OutRow } from './game'
import { LiveClock, Phone } from './Phone'
import { Face } from './people'
import { Dice } from './Breakers'
import { CodeCard, DeckLine, lines, usePick, type Prog } from './cards'
import { SPEC } from './spec'

/**
 * C10 AND C11: THE RANDOM MODULE, ON TEJA'S LUDO BOARD.
 *
 * The board is drawn as the game the room plays (course rule R5b): the four
 * coloured homes, the cross of squares, a lab face in each home with its
 * name, the dice under the board. The board's own colours stay inside the
 * phone (content rule 37); no product name, no logo (rule 12). Phone at
 * 1 : 2.06 with the live clock (2b). The board and the four players never
 * change; only the dice does (C10's keeps line).
 *
 * C10 is eight presses, the spec's five with press 4's three runs as three
 * presses and press 5's vote and its True as two (every output waits for a
 * press, the 2026-10-09 view fixes). C11 is five, the spec's three the same
 * way. Random outputs are the spec's sample runs; the caption says every run
 * differs.
 */
const EASE = [0.22, 1, 0.36, 1] as const
const PW = 170
const PH = 350 /* 1 : 2.06 */
/* the board's own colours, inside the phone only (content rule 37) */
const HOME = { Teja: '#E53935', Ravi: '#43A047', Kiran: '#FDD835', Divya: '#1E88E5' } as const
const BOARD_BG = '#FFF8E1'
const PLAYERS = ['Teja', 'Ravi', 'Kiran', 'Divya'] as const
type Player = (typeof PLAYERS)[number]

function Home({ name, lit, corner }: { name: Player; lit: boolean; corner: 'tl' | 'tr' | 'bl' | 'br' }) {
  const tween = useTween(300)
  const pos = corner === 'tl' ? { left: 6, top: 6 } : corner === 'tr' ? { right: 6, top: 6 } : corner === 'bl' ? { left: 6, bottom: 6 } : { right: 6, bottom: 6 }
  return (
    <div className="absolute flex flex-col items-center justify-center gap-0.5 rounded-lg" style={{ ...pos, width: 58, height: 58, background: HOME[name], boxShadow: lit ? `0 0 0 3px ${colors.white}, 0 0 0 5px ${colors.ink}` : 'none', transform: lit ? 'scale(1.08)' : 'none', transition: tween }}>
      <Face name={name} size={26} ring={colors.white} />
      <span className="text-[9px] font-bold leading-none text-white" style={{ textShadow: '0 1px 1px rgba(0,0,0,0.4)' }}>
        {name}
      </span>
    </div>
  )
}

/** The board: four homes, the cross of squares between them, the centre. */
function Board({ lit }: { lit: Player | null }) {
  return (
    <div className="relative shrink-0 rounded-xl" style={{ width: 150, height: 150, background: BOARD_BG, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
      {/* the cross */}
      <div aria-hidden className="absolute left-1/2 top-1 bottom-1 -translate-x-1/2" style={{ width: 24, backgroundImage: `repeating-linear-gradient(180deg, ${colors.white} 0 11px, ${colors.line} 11px 12px)`, boxShadow: `inset 0 0 0 1px ${colors.line}` }} />
      <div aria-hidden className="absolute top-1/2 left-1 right-1 -translate-y-1/2" style={{ height: 24, backgroundImage: `repeating-linear-gradient(90deg, ${colors.white} 0 11px, ${colors.line} 11px 12px)`, boxShadow: `inset 0 0 0 1px ${colors.line}` }} />
      <div aria-hidden className="absolute left-1/2 top-1/2 h-[30px] w-[30px] -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-sm" style={{ background: `conic-gradient(${HOME.Teja} 0 25%, ${HOME.Ravi} 25% 50%, ${HOME.Kiran} 50% 75%, ${HOME.Divya} 75%)` }} />
      <Home name="Teja" lit={lit === 'Teja'} corner="tl" />
      <Home name="Ravi" lit={lit === 'Ravi'} corner="tr" />
      <Home name="Divya" lit={lit === 'Divya'} corner="bl" />
      <Home name="Kiran" lit={lit === 'Kiran'} corner="br" />
    </div>
  )
}

/** The dice under the board; `roll` rolls it in (a full turn settling on `value`); `glow` lights it; `shown` false draws the empty slot. */
function DiceSlot({ value, roll, glow, shown }: { value: number; roll: number; glow: boolean; shown: boolean }) {
  const instant = useInstant()
  return (
    <div className="relative flex h-[64px] w-full items-center justify-center">
      {shown ? (
        <motion.div key={`roll-${roll}`} initial={instant || roll === 0 ? false : { rotate: -360, scale: 0.6, y: -40 }} animate={{ rotate: 0, scale: 1, y: 0 }} transition={{ duration: instant ? 0 : 0.7, ease: EASE }}>
          <Dice value={value} size={54} ink={colors.ink} glow={glow} />
        </motion.div>
      ) : (
        <span aria-hidden className="block h-[54px] w-[54px] rounded-xl" style={{ border: `2px dashed ${colors.line}` }} />
      )}
    </div>
  )
}

function GameHeader() {
  return (
    <div className="flex items-center justify-between px-3 pb-2">
      <span className="text-[11px] font-bold text-white">Teja's turn</span>
      <span className="flex -space-x-1.5">
        {PLAYERS.map((p) => (
          <Face key={p} name={p} size={16} ring={colors.white} />
        ))}
      </span>
    </div>
  )
}

/** Ludo on Teja's phone: the board with the four players, the dice under it. */
export function LudoPhone({ dice, roll = 0, glow = false, diceShown = true, lit = null }: { dice: number; roll?: number; glow?: boolean; diceShown?: boolean; lit?: Player | null }) {
  return (
    <Phone width={PW} height={PH} island={null} time={<LiveClock />} top={{ bg: HOME.Teja, light: true, header: <GameHeader /> }}>
      <div className="flex h-full w-full flex-col items-center gap-2 pt-3" style={{ background: '#2A1B12' }}>
        <Board lit={lit} />
        <DiceSlot value={dice} roll={roll} glow={glow} shown={diceShown} />
      </div>
    </Phone>
  )
}

/** randint's range, both ends lit: 1 and 6. */
function RangeStrip() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="mr-1 font-mono text-[13px] font-semibold" style={{ color: colors.body }}>
        randint(1, 6)
      </span>
      {[1, 2, 3, 4, 5, 6].map((n) => {
        const end = n === 1 || n === 6
        return (
          <span key={n} className="grid h-[28px] w-[28px] place-items-center rounded-md font-mono text-[14px] font-bold" style={{ background: end ? colors.brandDark : colors.white, color: end ? colors.white : colors.ink, boxShadow: `inset 0 0 0 1.5px ${end ? colors.brandDark : colors.line}` }}>
            {n}
          </span>
        )
      })}
      <span className="ml-1 text-[12.5px] font-semibold" style={{ color: colors.body }}>
        both ends in
      </span>
    </div>
  )
}

/* ==================================================================== C10 */

const C10 = SPEC.C10
const FIXED: Prog = C10.code[0]
const RAND: Prog = C10.code[1]
const THIRTY: Prog = C10.code[2]
const RUNS: string[] = C10.data.sample_runs

/**
 * C10. Press 1: Teja's turn, the dice glowing, "Who decides the number?"
 * Press 2: dice.py, `dice = 4`, run twice: 4, 4. Press 3: the deck's line and
 * the code card `random.randint(min, max)`, both ends lit. Presses 4 to 6:
 * the random version, one sample run per press, the dice rolling to match.
 * Press 7: thirty_rolls.py, "30 rolls. Did a 6 ever come?", the vote. Press
 * 8: True.
 */
export function Dice10() {
  const beat = useBeats(8)
  const { pick, setPick } = usePick()
  const right = 0
  const runs = beat >= 4 && beat <= 6 ? beat - 3 : beat >= 7 ? 3 : 0
  const prog = beat >= 7 ? THIRTY : beat >= 4 ? RAND : FIXED
  const out: OutLine[] = beat === 2 ? [{ text: FIXED.output }, { text: FIXED.output }] : beat >= 4 && beat <= 6 ? RUNS.slice(0, runs).map((t) => ({ text: t })) : []
  const dice = beat === 1 ? 6 : beat <= 3 ? 4 : beat <= 6 ? Number(RUNS[runs - 1]) : 6
  const caption = beat === 1 ? C10.show[0] : beat === 2 ? C10.show[2] : beat === 3 ? null : beat <= 6 ? C10.show[5] : C10.show[6]
  return (
    <>
      <div className="flex items-stretch gap-3">
        <Group pad={10} className="flex w-[240px] shrink-0 items-center justify-center" style={{ height: 400 }} active={beat === 1 || (beat >= 4 && beat <= 6)}>
          <LudoPhone dice={dice} roll={beat >= 4 && beat <= 6 ? beat : beat === 2 ? 1 : 0} glow={beat === 1} diceShown />
        </Group>
        <Group pad={10} className="flex min-w-0 flex-1 flex-col gap-2.5" style={{ height: 400 }} active={beat >= 2 && beat !== 4 && beat !== 5 && beat !== 6}>
          <StepCaption text={caption} size={16} minH={46} />
          <Swap k={beat === 1 ? 'ask' : beat === 3 ? 'rule' : beat >= 7 ? 'thirty' : beat >= 4 ? 'rand' : 'fixed'}>
            {beat === 1 ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <span className="rounded-xl px-5 py-3 font-mono text-[22px] font-bold" style={{ color: colors.muted, border: `2px dashed ${colors.line}` }}>
                  dice = ?
                </span>
              </div>
            ) : beat === 3 ? (
              <div className="flex flex-col gap-4 pt-2">
                <DeckLine size={17}>{C10.show[3]}</DeckLine>
                <div className="flex items-center gap-6 pl-2 pt-2">
                  <CodeCard lines={[C10.show[4]]} size={22} />
                </div>
                <div className="pl-2 pt-1">
                  <RangeStrip />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Focus on={beat === 7}>
                  <CodePane code={prog.src} fontSize={CODE_FS} rows={prog.src.split('\n').length} at={beat === 2 ? 2 : beat >= 4 && beat <= 6 ? 4 : undefined} highlight={beat >= 7 ? 5 : undefined} />
                </Focus>
                {beat >= 7 ? (
                  <>
                    <Vote options={['True', 'False']} right={right} shown={beat >= 8} pick={pick} setPick={setPick} cols={2} size={15} nowrap dense />
                    <OutRow lines={beat >= 8 ? lines(THIRTY.output) : []} />
                  </>
                ) : (
                  <OutPanel lines={out} minRows={beat === 2 ? 2 : 3} fontSize={OUT_FS} empty={beat >= 4 ? 'your laptop gives other numbers' : undefined} />
                )}
              </div>
            )}
          </Swap>
        </Group>
      </div>
      {beat >= 8 && pick === right && <Confetti seed={44} />}
      <StepControls at={beat} total={8} />
    </>
  )
}

/* ==================================================================== C11 */

const C11 = SPEC.C11
const FIRST: Prog = C11.code[0]
const LETTER: Prog = C11.code[1]
const RUN2 = 'Divya' /* the second sample run of the spec's press 2 */
const HOPS: Player[] = ['Ravi', 'Kiran', 'Divya', 'Teja', 'Ravi', 'Kiran']

/** The four letters of "Teja", one lit when a run picked it. */
function Letters({ lit }: { lit: string | null }) {
  const tween = useTween(420)
  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 font-mono text-[14px] font-semibold" style={{ color: colors.body }}>
        "Teja"
      </span>
      {['T', 'e', 'j', 'a'].map((c, i) => {
        const on = lit === c
        return (
          <span key={i} className="grid h-[34px] w-[34px] place-items-center rounded-lg font-mono text-[18px] font-bold" style={{ background: on ? '#E9F8EF' : colors.white, color: on ? '#137A3A' : colors.ink, boxShadow: `inset 0 0 0 ${on ? 2.5 : 1.5}px ${on ? colors.success : colors.line}`, transition: tween }}>
            {c}
          </span>
        )
      })}
    </div>
  )
}

/**
 * C11. Press 1: `random.choice(seq)` and its line. Press 2: first.py, "Who
 * plays first?", a run: the highlight hops between the four players and
 * stops on Teja. Press 3: a second run stops on Divya. Press 4: letter.py,
 * `choice on "Teja"`, the vote. Press 5: a sample run picks e.
 */
export function Choice11() {
  const beat = useBeats(5)
  const { pick, setPick } = usePick()
  const right = 1
  const hop = useStepPhase(beat, [220, 220, 220, 220, 220, 220])
  const running = (beat === 2 || beat === 3) && hop < HOPS.length
  const landed: Player = beat >= 3 ? RUN2 : 'Teja'
  const lit: Player | null = beat === 2 || beat === 3 ? (running ? HOPS[hop] : landed) : null
  const prog = beat >= 4 ? LETTER : FIRST
  const out: OutLine[] = beat === 2 ? [{ text: FIRST.output }] : beat === 3 ? [{ text: FIRST.output }, { text: RUN2 }] : []
  const caption = beat === 1 ? C11.show[1] : beat <= 3 ? C11.show[2] : C11.show[3]
  return (
    <>
      <div className="flex items-stretch gap-3">
        <Group pad={10} className="flex w-[240px] shrink-0 items-center justify-center" style={{ height: 400 }} active={beat === 2 || beat === 3}>
          <LudoPhone dice={6} diceShown={false} lit={lit} />
        </Group>
        <Group pad={10} className="flex min-w-0 flex-1 flex-col gap-2.5" style={{ height: 400 }} active={beat === 1 || beat >= 4}>
          <StepCaption text={caption} tone={beat === 1 ? 'rule' : 'step'} size={16} minH={46} />
          <Swap k={beat === 1 ? 'card' : beat >= 4 ? 'letter' : 'first'}>
            {beat === 1 ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <CodeCard lines={[C11.show[0]]} size={24} />
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Focus on={beat === 4}>
                  <CodePane code={prog.src} fontSize={CODE_FS} rows={prog.src.split('\n').length} at={beat <= 3 ? 4 : undefined} highlight={beat >= 4 ? 3 : undefined} />
                </Focus>
                {beat >= 4 ? (
                  <>
                    <Vote options={['Teja', 'a single letter']} right={right} shown={beat >= 5} pick={pick} setPick={setPick} cols={2} size={15} nowrap dense />
                    <Show on={beat >= 4}>
                      <Letters lit={beat >= 5 ? LETTER.output : null} />
                    </Show>
                    <OutRow lines={beat >= 5 ? lines(LETTER.output) : []} />
                  </>
                ) : (
                  <OutPanel lines={out} minRows={2} fontSize={OUT_FS} />
                )}
              </div>
            )}
          </Swap>
        </Group>
      </div>
      {beat >= 5 && pick === right && <Confetti seed={45} />}
      <StepControls at={beat} total={5} />
    </>
  )
}
