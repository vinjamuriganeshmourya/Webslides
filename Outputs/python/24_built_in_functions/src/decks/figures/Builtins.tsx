import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Focus, Group, Lines } from './common'
import { Confetti } from './motion'
import { Ask, ListBoxes, OutPanel, Show, sentences } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { ScreenBars } from './ScreenTime'
import { Phone } from './Phone'
import { usePhase } from './tiles21'
import { SPEC } from './spec'

/**
 * THE SECOND HALF'S FOUR CONCEPT CARDS: C3 (what a built-in is), C4 (min and
 * max), C5 (sum) and C6 (sorted).
 *
 * Every program and output is the spec's, run on CPython; the Unicode numbers
 * on C4 are computed from the letters (`codePointAt`), never typed. Each
 * output shows only on the press after the room has said or voted it (each
 * card's must line). Votes take a click or keys 1 to n and never gate the
 * press; confetti when the marked pick was right.
 */

type Prog = { file: string; src: string; output: string }

/** The shape of a call, in mono, with its sentence: the deck's `min(sequence)` frame. */
function DefBand({ sigs, text, extra }: { sigs: ReactNode[]; text: string; extra?: ReactNode }) {
  return (
    <div className="flex items-start gap-6 rounded-card px-5 py-2.5" style={{ background: colors.surface2, boxShadow: `inset 4px 0 0 ${colors.brandDark}` }}>
      <div className="flex shrink-0 flex-col gap-0.5">
        {sigs.map((s, i) => (
          <span key={i} className="whitespace-nowrap font-mono text-[22px] font-bold leading-snug" style={{ color: colors.brandDark }}>
            {s}
          </span>
        ))}
      </div>
      <span className="min-w-0 self-center text-[18px] font-semibold leading-snug" style={{ color: colors.body }}>
        <Lines lines={sentences(text)} />
      </span>
      {extra}
    </div>
  )
}

/**
 * One program and its output, the output empty until `ran`, in one group
 * (rule G3) with anything that belongs to the run under them (the walk).
 * `focus` rings the code panel: the program the room is being asked about.
 */
function ProgBox({ prog, ran, fontSize = 15, error = false, focus, children }: { prog: Prog; ran: boolean; fontSize?: number; error?: boolean; focus?: boolean; children?: ReactNode }) {
  const code = <CodePane code={prog.src} fontSize={fontSize} />
  return (
    <Group pad={10} className="flex min-w-0 flex-col gap-2.5">
      {focus === undefined ? code : <Focus on={focus}>{code}</Focus>}
      <OutPanel lines={ran ? prog.output.split('\n').map((t) => ({ text: t, tone: error ? ('error' as const) : 'plain' })) : []} minRows={prog.output.split('\n').length} fontSize={fontSize} />
      {children}
    </Group>
  )
}

/* ------------------------------------------------------------------ the walk */

/** The values a program hands its built-in: the list literal, or the separate values inside the call. */
const valuesOf = (src: string) => (src.match(/\[([^\]]*)\]/) ?? src.match(/\(([\d, ]+)\)/))![1].split(', ').map(Number)

type WalkKind = 'min' | 'max' | 'sum'
const KEEP_LABEL: Record<WalkKind, string> = { min: 'Smallest so far', max: 'Largest so far', sum: 'Total so far' }
const keepAfter = (kind: WalkKind, vs: number[]) => (kind === 'sum' ? vs.reduce((a, b) => a + b, 0) : kind === 'min' ? Math.min(...vs) : Math.max(...vs))

/**
 * C4 and C5's motion line: on the press the output fills, a pointer walks the
 * values left to right and a small box keeps the smallest, the largest or the
 * running total so far; the output fills once the walk ends. Played only when
 * the press is reached forward; otherwise it lands done. The values stay
 * exactly as written (the cards' keeps lines).
 */
function useWalk(beat: number, at: number, n: number) {
  const phase = usePhase(beat, at, [140, ...Array(n).fill(620)])
  /* phase 1..n: the pointer on value phase-1; n+1: the walk is over */
  return { at: phase >= 1 && phase <= n ? phase - 1 : -1, done: phase > n, seen: Math.min(phase, n) }
}

function WalkStrip({ values, kind, at, seen }: { values: number[]; kind: WalkKind; at: number; seen: number }) {
  const tween = useTween(300)
  const keep = seen > 0 ? keepAfter(kind, values.slice(0, seen)) : null
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {values.map((v, i) => (
          <span
            key={i}
            className="grid h-[32px] min-w-[40px] place-items-center rounded-md px-1.5 font-mono text-[15px] font-bold"
            style={{
              background: colors.white,
              color: colors.ink,
              boxShadow: i === at ? `inset 0 0 0 3px ${colors.accent}` : `inset 0 0 0 1.5px ${colors.line}`,
              transform: i === at ? 'translateY(-3px)' : 'none',
              transition: tween,
            }}
          >
            {v}
          </span>
        ))}
      </div>
      <span className="flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-1" style={{ background: colors.surface2, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
        <span className="whitespace-nowrap text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
          {KEEP_LABEL[kind]}
        </span>
        <span key={keep ?? 'none'} className="sm-bump min-w-[34px] text-center font-mono text-[17px] font-bold" style={{ color: colors.accentDark }}>
          {keep ?? ' '}
        </span>
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ C3 */

const C3 = SPEC.C3
const KNOWN: string[] = C3.show.slice(1, 5)
const NEW: string[] = C3.show.slice(9, 13)

function FnChip({ name, delay, on }: { name: string; delay: number; on: boolean }) {
  const instant = useInstant()
  return (
    <motion.div className="flex items-center gap-3" initial={false} animate={{ opacity: on ? 1 : 0, x: on ? 0 : -12 }} transition={{ duration: instant ? 0 : 0.52, delay: instant || !on ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}>
      <svg width="34" height="14" viewBox="0 0 34 14" aria-hidden className="shrink-0">
        <path d="M2 7 H24" stroke={colors.success} strokeWidth="2.75" strokeLinecap="round" />
        <path d="M23 2.5 L31 7 L23 11.5 Z" fill={colors.success} />
      </svg>
      <span className="rounded-lg bg-white px-4 py-1.5 font-mono text-[24px] font-bold" style={{ color: colors.brandDark, boxShadow: `inset 0 0 0 2px ${colors.line}` }}>
        {name}
      </span>
    </motion.div>
  )
}

/** The new phone's own home screen colours, not brand tokens. */
const HOME = { wall: '#DCE8F7', ink: '#1F2328' }

/** One app that came with the phone: its icon tile and its name. */
function AppIcon({ name, bg, children }: { name: string; bg: string; children: ReactNode }) {
  return (
    <span className="flex w-[62px] flex-col items-center gap-1">
      <span className="grid h-[48px] w-[48px] place-items-center rounded-[13px]" style={{ background: bg, boxShadow: '0 4px 10px -6px rgba(16,32,58,0.45)' }}>
        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden>
          {children}
        </svg>
      </span>
      <span className="text-[11px] font-semibold" style={{ color: HOME.ink }}>
        {name}
      </span>
    </span>
  )
}

/** C3's analogy: a new phone's home screen with Calculator, Clock and Camera already on it. */
function NewPhone() {
  return (
    <Phone width={200} height={300} island={null} top={{ bg: HOME.wall, light: false, header: null }}>
      <div className="flex h-full flex-wrap content-start gap-x-1 gap-y-4 px-2.5 pt-4" style={{ background: HOME.wall }}>
        <AppIcon name="Calculator" bg="#3C4048">
          <rect x="5" y="4" width="18" height="20" rx="3" fill="none" stroke="#FFFFFF" strokeWidth="2" />
          <path d="M9 10 H19 M9 15 H11 M14 15 H15 M18 15 H19 M9 19 H11 M14 19 H15 M18 19 H19" stroke="#FF9F0A" strokeWidth="2" strokeLinecap="round" />
        </AppIcon>
        <AppIcon name="Clock" bg="#FFFFFF">
          <circle cx="14" cy="14" r="10" fill="none" stroke="#1F2328" strokeWidth="2" />
          <path d="M14 8 V14 L18 17" stroke="#1F2328" strokeWidth="2" strokeLinecap="round" fill="none" />
        </AppIcon>
        <AppIcon name="Camera" bg="#8E96A3">
          <rect x="4" y="9" width="20" height="14" rx="3" fill="#FFFFFF" />
          <rect x="10" y="6" width="8" height="4" rx="1.5" fill="#FFFFFF" />
          <circle cx="14" cy="16" r="4" fill="#8E96A3" />
        </AppIcon>
      </div>
    </Phone>
  )
}

/**
 * C3, three presses: the four functions the room already calls; the label
 * `Built-in functions` joins them, with a new phone's home screen beside them
 * and `Like the apps that come with a new phone.`; four new ones arrive.
 */
export function BuiltInList() {
  const beat = useBeats(3)
  const tween = useTween(480)
  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-5 rounded-card px-5 py-2.5" style={{ background: beat >= 2 ? colors.surface2 : 'transparent', boxShadow: beat >= 2 ? `inset 4px 0 0 ${colors.brandDark}` : 'none', opacity: beat >= 2 ? 1 : 0, transition: tween }}>
          <span className="font-heading text-[30px] font-bold" style={{ color: colors.brandDark }}>
            {C3.show[5]}
          </span>
          <span className="text-[19px] font-semibold leading-snug" style={{ color: colors.body }}>
            <Lines lines={sentences(C3.show[6])} />
          </span>
        </div>
        <div className="flex items-start gap-14">
          <div className="flex w-[300px] flex-col gap-3">
            <Ask size={22}>
              <Lines lines={sentences(C3.show[0])} />
            </Ask>
            {KNOWN.map((f, i) => (
              <FnChip key={f} name={f} delay={i * 0.13} on />
            ))}
          </div>
          <div className="flex w-[300px] flex-col gap-3">
            <Show on={beat >= 3}>
              <Ask size={22}>
                <Lines lines={sentences(C3.show[8])} />
              </Ask>
            </Show>
            {NEW.map((f, i) => (
              <FnChip key={f} name={f} delay={0.2 + i * 0.13} on={beat >= 3} />
            ))}
          </div>
          <Show on={beat >= 2} className="flex w-[240px] flex-col gap-3">
            <NewPhone />
            <p className="font-heading text-[19px] font-bold leading-snug" style={{ color: colors.ink }}>
              <Lines lines={sentences(C3.show[7])} />
            </p>
          </Show>
        </div>
      </div>
      <StepControls at={beat} total={3} />
    </>
  )
}

/* ------------------------------------------------------------------ C4 */

const C4 = SPEC.C4
const P4: Prog[] = C4.code
const quoted = (src: string) => [...src.matchAll(/"([^"]+)"/g)].map((m) => m[1])

/** The first letters of two strings and their Unicode numbers, from the letters themselves. */
function FirstLetters({ words }: { words: string[] }) {
  return (
    <div className="flex flex-col gap-2 rounded-card bg-white px-4 py-3" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
      <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
        First letters
      </span>
      {words.map((w) => (
        <span key={w} className="flex items-center gap-3 font-mono text-[20px] font-semibold" style={{ color: colors.ink }}>
          <span className="grid h-9 w-9 place-items-center rounded-lg font-bold" style={{ background: '#FFF4EC', boxShadow: `inset 0 0 0 2px ${colors.accent}` }}>
            {w[0]}
          </span>
          <span style={{ color: colors.body }}>{w.slice(1)}</span>
          <span className="ml-auto pl-6 font-bold" style={{ color: colors.accentDark }}>
            {w.codePointAt(0)}
          </span>
        </span>
      ))}
    </div>
  )
}

/** A program, its output, and under them the walk of its values (C4, C5). */
function WalkProg({ prog, kind, beat, at, focus, fontSize }: { prog: Prog; kind: WalkKind; beat: number; at: number; focus?: boolean; fontSize?: number }) {
  const values = valuesOf(prog.src)
  const w = useWalk(beat, at, values.length)
  return (
    <ProgBox prog={prog} ran={beat >= at && w.done} focus={focus} fontSize={fontSize}>
      <WalkStrip values={values} kind={kind} at={beat >= at ? w.at : -1} seen={beat >= at ? w.seen : 0} />
    </ProgBox>
  )
}

const EASE = [0.22, 1, 0.36, 1] as const
/* C4's columns: a program, the week's wider program, the options, the gaps */
const COL_A = 360
const COL_B = 528
const COL_V = 300
const GAP = 24
/* one code size for the card, a step under the deck's 15 so the week's program and its walk clear Next */
const C4_FS = 14

/** The explanation panel: the rule sentence, and on the string turns the first letters' numbers. */
function Explain({ words, text }: { words?: string[]; text: string }) {
  return (
    <Group className="flex flex-col gap-3">
      {words && <FirstLetters words={words} />}
      <StepCaption text={text} tone="rule" size={18} minH={50} />
    </Group>
  )
}

/** Comes in from the right and leaves to the right, on the house curve (rule G1). */
function FromRight({ show, width, children }: { show: boolean; width: number; children: ReactNode }) {
  const instant = useInstant()
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          key="explain"
          className="absolute right-0 top-0"
          style={{ width }}
          initial={instant ? false : { opacity: 0, x: 90 }}
          animate={{ opacity: 1, x: 0, transition: { duration: 0.66, ease: EASE, delay: instant ? 0 : 0.12 } }}
          exit={{ opacity: 0, x: 90, transition: { duration: instant ? 0 : 0.46, ease: EASE } }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * C4, ten presses, in four questions: min of three of Ravi's days as separate
 * values, then of his whole week as one list (presses 2 to 4); min of two
 * strings (vote, 5 and 6); min of two names (vote, 7 and 8); then max of
 * separate values and of the week, side by side (9 and 10). On each numeric
 * program the pointer walks the values and the box keeps the smallest (or
 * largest) so far before the output fills (its motion line).
 *
 * One layout for all four (user review, 2026-10-08, slide 15):
 *   - the question sits ABOVE the programs, in the same place every time, so
 *     it is read first;
 *   - the program being asked is ringed (`Focus`), on the house curve;
 *   - on the two string turns the program and its options are one unit,
 *     centred; when the answer is shown the unit slides left and the
 *     explanation (the first letters' numbers and the rule) comes in from
 *     the right; going back reverses both;
 *   - max's rule comes in from the right the same way.
 * A turn changes by fading the old one out and the new one up.
 */
export function MinMax() {
  const beat = useBeats(10)
  const instant = useInstant()
  const [picks, setPicks] = useState([-1, -1])
  const part = beat <= 1 ? 0 : beat <= 4 ? 1 : beat <= 6 ? 2 : beat <= 8 ? 3 : 4
  const vote = part === 2 || part === 3 ? part - 2 : -1
  const prog = vote >= 0 ? P4[vote === 0 ? 2 : 3] : null
  const words = prog ? quoted(prog.src) : []
  const voteShown = (part === 2 && beat >= 6) || (part === 3 && beat >= 8)
  const rightIdx = prog ? words.indexOf(prog.output) : -1
  const pick = vote >= 0 ? picks[vote] : -1
  const setPick = (p: number) => setPicks((ps) => ps.map((v, j) => (j === vote ? p : v)))
  /* the room's width, read once: the unit's centred offset is computed from it */
  const ref = useRef<HTMLDivElement>(null)
  const [W, setW] = useState(1150)
  useLayoutEffect(() => {
    if (ref.current) setW(ref.current.offsetWidth)
  }, [])
  const unitW = COL_A + GAP + COL_V
  const centre = Math.max(0, (W - unitW) / 2)
  const turn = {
    initial: instant ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
    exit: { opacity: 0, y: -8, transition: { duration: instant ? 0 : 0.26, ease: EASE } },
    className: 'absolute inset-x-0 top-0',
  }
  return (
    <>
      <div ref={ref} className="flex flex-col gap-2.5">
        <DefBand sigs={[C4.show[0], C4.show[1]]} text={C4.show[2]} />
        {/* the question, above the programs, the same place on every turn */}
        <div style={{ opacity: part > 0 ? 1 : 0, transition: instant ? 'none' : 'opacity 420ms cubic-bezier(0.22, 1, 0.36, 1)' }}>
          <Ask size={21}>{C4.show[3]}</Ask>
        </div>
        <div className="relative h-[292px]">
          <AnimatePresence mode="wait" initial={false}>
            {part === 1 && (
              <motion.div key="t1" {...turn}>
                <div className="flex items-start" style={{ gap: GAP }}>
                  <div className="shrink-0" style={{ width: COL_A }}>
                    <WalkProg key="min-values" prog={P4[0]} kind="min" beat={beat} at={3} focus={beat <= 3} fontSize={C4_FS} />
                  </div>
                  <AnimatePresence initial={false}>
                    {beat >= 3 && (
                      <motion.div key="min-list" className="shrink-0" style={{ width: COL_B }} initial={instant ? false : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0, transition: { duration: 0.56, ease: EASE } }} exit={{ opacity: 0, x: 24, transition: { duration: instant ? 0 : 0.3, ease: EASE } }}>
                        <WalkProg prog={P4[1]} kind="min" beat={beat} at={4} focus={beat === 4} fontSize={C4_FS} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
            {prog && (
              <motion.div key={`t${part}`} {...turn}>
                {/* the program and its options: one unit, centred until the answer shows */}
                <motion.div className="flex items-start" style={{ gap: GAP, width: unitW }} initial={false} animate={{ x: voteShown ? 0 : centre }} transition={{ duration: instant ? 0 : 0.7, ease: EASE }}>
                  <div className="shrink-0" style={{ width: COL_A }}>
                    <ProgBox prog={prog} ran={voteShown} focus={!voteShown} fontSize={C4_FS} />
                  </div>
                  <div className="shrink-0" style={{ width: COL_V }}>
                    <Vote options={words} right={rightIdx} shown={voteShown} pick={pick} setPick={setPick} cols={1} size={19} nowrap />
                  </div>
                </motion.div>
                <FromRight show={voteShown} width={W - unitW - GAP}>
                  <Explain words={words} text={vote === 0 ? C4.show[4] : C4.show[5]} />
                </FromRight>
              </motion.div>
            )}
            {part === 4 && (
              <motion.div key="t4" {...turn}>
                <div className="flex items-start" style={{ gap: GAP }}>
                  <div className="shrink-0" style={{ width: COL_A }}>
                    <WalkProg key="max-values" prog={P4[4]} kind="max" beat={beat} at={10} focus fontSize={C4_FS} />
                  </div>
                  <div className="shrink-0" style={{ width: COL_B }}>
                    <WalkProg key="max-list" prog={P4[5]} kind="max" beat={beat} at={10} focus fontSize={C4_FS} />
                  </div>
                </div>
                <FromRight show={beat === 10} width={W - COL_A - COL_B - 2 * GAP}>
                  <Explain text={C4.show[6]} />
                </FromRight>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {voteShown && pick === rightIdx && <Confetti seed={60 + vote} />}
      <StepControls at={beat} total={10} />
    </>
  )
}

/* ------------------------------------------------------------------ C5 */

const C5 = SPEC.C5
const P5: Prog[] = C5.code
/* the spec's three choices, in its order (C5 press 1) */
const SUM_CHOICES = ['295', '3', '140']
const SUM_VALUES = valuesOf(P5[0].src)

/**
 * C5, five presses: the form of sum and its list example, three of Ravi's
 * days (vote 295, 3, 140); the running total adds each day, then the output
 * fills; sum(95, 140, 60) asked; its TypeError, word for word; then Ravi's
 * week: max, min and sum of his minutes, with the screen time bars back.
 */
export function SumCard() {
  const beat = useBeats(5)
  const [pick, setPick] = useState(-1)
  const w = useWalk(beat, 2, SUM_VALUES.length)
  const ran = beat >= 2 && w.done
  const week = beat === 5
  const caption = beat === 1 || beat === 3 ? C5.show[2] : beat === 4 ? C5.show[3] : null
  return (
    <>
      <div className="flex flex-col gap-3.5">
        <DefBand sigs={[C5.show[0]]} text={C5.show[1]} />
        <div className="flex items-start gap-7">
          <div className="flex w-[560px] shrink-0 flex-col gap-3">
            {week ? (
              <ProgBox key="week" prog={P5[2]} ran />
            ) : (
              <ProgBox prog={P5[0]} ran={ran}>
                <WalkStrip values={SUM_VALUES} kind="sum" at={beat >= 2 ? w.at : -1} seen={beat >= 2 ? w.seen : 0} />
              </ProgBox>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            {week ? (
              <div className="flex flex-col gap-2">
                <span className="font-heading text-[20px] font-bold" style={{ color: colors.brandDark }}>
                  {C5.show[4]}
                </span>
                <ScreenBars found width={300} height={190} />
              </div>
            ) : (
              <>
                <Vote options={SUM_CHOICES} right={SUM_CHOICES.indexOf(P5[0].output)} shown={ran} pick={pick} setPick={setPick} cols={3} size={19} dense />
                <Show on={beat >= 3}>
                  <ProgBox prog={P5[1]} ran={beat >= 4} error />
                </Show>
                <StepCaption text={caption} tone={beat === 4 ? 'rule' : 'step'} size={17} minH={50} />
              </>
            )}
          </div>
        </div>
      </div>
      {ran && beat < 5 && pick === 0 && <Confetti seed={70} />}
      <StepControls at={beat} total={5} />
    </>
  )
}

/* ------------------------------------------------------------------ C6 */

const C6 = SPEC.C6
const P6: Prog[] = C6.code
const MINUTES_ROW: string[] = P6[0].src.split('\n')[0].replace(/^.*\[(.*)\].*$/, '$1').split(', ')
const asList = (s: string) => s.replace(/^\[(.*)\]$/, '$1').split(', ')

/** The new row's names, as the programs name them: the list sorted reads, and the one it gives. */
const OLD_NAME = P6[0].src.split(' = ')[0]
const NEW_NAME = P6[0].src.split('\n')[1].split(' = ')[0]

/**
 * C6, five presses: the form of sorted and sorted.py with Ravi's first four
 * days (vote: what does print(minutes) show?); a new row builds beside
 * minutes, smallest first, then both outputs, minutes unchanged; the form
 * with reverse=False labelled `Default value`; sorted_reverse.py asked; the
 * new row fills from the biggest, then its output. minutes keeps its own
 * order on screen the whole card (its keeps line).
 */
export function SortedCard() {
  const beat = useBeats(5)
  const [pick, setPick] = useState(-1)
  const rev = beat >= 4
  const prog = rev ? P6[1] : P6[0]
  /* the new row builds one box per phase on the press its output fills */
  const n = MINUTES_ROW.length
  const build2 = usePhase(beat, 2, [140, ...Array(n).fill(520)])
  const build5 = usePhase(beat, 5, [140, ...Array(n).fill(520)])
  const built = beat === 2 ? Math.min(build2, n) : beat === 5 ? Math.min(build5, n) : n
  const ran = ((beat === 2 || beat === 3) && (beat === 3 || build2 > n)) || (beat === 5 && build5 > n)
  const opts = [C6.show[3], C6.show[4]]
  const outLines = P6[0].output.split('\n')
  const newList = (rev ? (beat === 5 ? asList(P6[1].output) : null) : beat >= 2 ? asList(outLines[0]) : null)?.slice(0, built) ?? null
  const caption = beat === 1 ? C6.show[2] : beat === 2 || beat === 3 ? C6.show[5] : beat === 4 ? C6.show[7] : C6.show[8]
  return (
    <>
      <div className="flex items-start gap-7">
        <div className="flex w-[470px] shrink-0 flex-col gap-3">
          <ProgBox key={prog.file} prog={prog} ran={ran} />
          {!rev && <Vote options={opts} right={opts.indexOf(outLines[1])} shown={ran || beat === 3} pick={pick} setPick={setPick} cols={1} size={18} dense />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3.5">
          <DefBand
            sigs={[
              beat >= 3 ? (
                <>
                  sorted(sequence, <span style={{ color: colors.accentDark }}>reverse=False</span>)
                </>
              ) : (
                C6.show[0]
              ),
            ]}
            text={C6.show[1]}
          />
          <Show on={beat >= 3} className="-mt-1.5 flex items-center gap-2 pl-[262px]">
            <svg width="14" height="22" viewBox="0 0 14 22" aria-hidden>
              <path d="M7 20 V8" stroke={colors.accentDark} strokeWidth="2.5" strokeLinecap="round" />
              <path d="M2.5 9 L7 2 L11.5 9 Z" fill={colors.accentDark} />
            </svg>
            <span className="text-[15px] font-bold" style={{ color: colors.accentDark }}>
              {C6.show[6]}
            </span>
          </Show>
          <div className="flex flex-col gap-3">
            <ListBoxes items={MINUTES_ROW} name={OLD_NAME} size="sm" lane={false} positions={false} />
            {newList && newList.length > 0 ? <ListBoxes key={rev ? 'rev' : 'up'} items={newList} name={NEW_NAME} size="sm" lane={false} positions={false} states={Object.fromEntries(newList.map((_, i) => [i, 'new']))} /> : <div className="h-[44px]" />}
          </div>
          <StepCaption text={caption} tone={[2, 3, 5].includes(beat) ? 'rule' : 'step'} size={18} minH={50} />
        </div>
      </div>
      {ran && pick === opts.indexOf(outLines[1]) && beat < 4 && <Confetti seed={80} />}
      <StepControls at={beat} total={5} />
    </>
  )
}
