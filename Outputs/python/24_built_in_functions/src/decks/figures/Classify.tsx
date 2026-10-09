import { useState } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { AnimatePresence, motion } from 'framer-motion'
import { StepControls } from './controls'
import { Group, Lines } from './common'
import { BLANK } from './Code'
import { Confetti } from './motion'
import { Ask, sentences } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { usePhase } from './tiles21'
import { AutoHeight } from './ScreenTime'
import { SPEC } from './spec'

/**
 * GAME G1: DOES RAVI'S NOTEBOOK CHANGE? Tap to classify, nineteen presses:
 * the intro, then six rounds of ask, sort and verdict.
 *
 *   - write_unit.py is on screen the whole game with line 2 blank; each case
 *     drops into line 2 when it is sorted (its must lines), and the caption
 *     says what print(ravi) prints with that line 2.
 *   - Every case is on screen from press 1, waiting to be sorted.
 *   - Two bins, `It changes` and `It stays the same`, named as the spec names them
 *     and drawn as Ravi's notebook and a xerox (its play line).
 *   - Nothing in a round moves until the press after the room has answered.
 *     On the sort press the case goes into the bin the room voted for (keys
 *     1 and 2 or a click mark it): it snaps home if right; if wrong it lands
 *     there, shakes and bounces out to the right bin. With no mark it goes
 *     straight home. The movement inside that one press plays only when the
 *     press is reached forward; left redraws the step still.
 *   - The verdict says why the answer is right and gives the wrong option its
 *     own line. Confetti when the marked pick was right.
 *
 * Every case, caption, answer and why line is the spec's data; all six line 2s
 * were run on CPython (plan, outputs section).
 */
const G1 = SPEC.G1
type Round = { ask: string; case: string; options: string[]; answer: string; because: string; why: Record<string, string>; steps: { caption: string; bin: string }[] }
const ROUNDS: Round[] = G1.data.rounds
const BINS: string[] = G1.data.setup.bins
const CASES: string[] = G1.data.setup.cases
const SRC: string = G1.code[0].src

/** The bins' pictures: Ravi's blue notebook (it changes), a grey xerox (it stays the same). Their own colours. */
function BinIcon({ xerox }: { xerox: boolean }) {
  return xerox ? (
    <svg width="24" height="28" viewBox="0 0 24 28" aria-hidden className="shrink-0">
      <rect x="5" y="4" width="17" height="22" rx="2" fill="#FAFAFA" stroke="#C3C7CE" strokeWidth="1.5" />
      <rect x="2" y="1.5" width="17" height="22" rx="2" fill="#FAFAFA" stroke="#9AA0A8" strokeWidth="1.5" />
      <path d="M5.5 9 H15.5 M5.5 13 H15.5 M5.5 17 H12" stroke="#9AA0A8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ) : (
    <svg width="24" height="28" viewBox="0 0 24 28" aria-hidden className="shrink-0">
      <rect x="2" y="1.5" width="20" height="25" rx="3" fill="#FFFEF8" stroke="#163B7C" strokeWidth="1.5" />
      <rect x="2" y="1.5" width="20" height="7" rx="2" fill="#1F4FA3" />
      <path d="M6 13 H18 M6 17 H18 M6 21 H14" stroke="#1C3F94" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

type Beat = { kind: 'intro' } | { kind: 'ask' | 'sort' | 'verdict'; r: number }
const EASE = [0.22, 1, 0.36, 1] as const
const SCHEDULE: Beat[] = [{ kind: 'intro' }, ...ROUNDS.flatMap((_, r) => [{ kind: 'ask' as const, r }, { kind: 'sort' as const, r }, { kind: 'verdict' as const, r }])]

function Chip({ text, state }: { text: string; state: 'wait' | 'now' | 'gone' | 'binned' | 'bounced' }) {
  const tween = useTween(420)
  const gone = state === 'gone'
  return (
    <span
      className="inline-block whitespace-nowrap rounded-lg px-2.5 py-1 font-mono text-[14px] font-semibold leading-tight"
      style={{
        background: gone ? 'transparent' : state === 'now' ? colors.surface2 : colors.white,
        color: gone ? 'transparent' : colors.ink,
        boxShadow: `inset 0 0 0 ${state === 'now' ? 3 : 2}px ${gone ? colors.line : state === 'now' ? colors.brand : state === 'bounced' ? colors.accent : colors.line}`,
        border: gone ? `1.5px dashed ${colors.line}` : '1.5px solid transparent',
        transition: tween,
      }}
    >
      {text}
    </span>
  )
}

export function Classify() {
  const beat = useBeats(SCHEDULE.length)
  const instant = useInstant()
  const b = SCHEDULE[beat - 1]
  const [picks, setPicks] = useState<number[]>(ROUNDS.map(() => -1))
  const r = b.kind === 'intro' ? -1 : b.r
  const round = r >= 0 ? ROUNDS[r] : null
  const pick = r >= 0 ? picks[r] : -1
  const setPick = (p: number) => r >= 0 && setPicks((ps) => ps.map((v, j) => (j === r ? p : v)))
  /* the sort press: 0 the case sits in the voted bin, 1 it is home */
  const ph = usePhase(beat, beat, [900])
  const sortingNow = b.kind === 'sort'
  const right = round ? round.options.indexOf(round.answer) : -1
  const wrongVote = round && pick >= 0 && pick !== right
  /** where each case is: the pool, or a bin (and whether it bounced) */
  const sortedUpTo = b.kind === 'intro' ? -1 : b.kind === 'ask' ? r - 1 : r
  const binOf = (i: number) => {
    const rd = ROUNDS[i]
    if (i === r && sortingNow && wrongVote && ph === 0) return 1 - right
    return rd.options.indexOf(rd.steps[0].bin)
  }
  const bounced = (i: number) => {
    const rd = ROUNDS[i]
    const p = picks[i]
    return p >= 0 && p !== rd.options.indexOf(rd.answer) && !(i === r && sortingNow && ph === 0)
  }
  const ranLine2 = b.kind === 'sort' || b.kind === 'verdict'
  const code = SRC.replace(BLANK, ranLine2 && round ? round.case : BLANK)
  const shown = b.kind === 'verdict'
  /* a case that bounces says its caption once it is home */
  const caption = b.kind === 'intro' ? G1.data.intro : b.kind === 'sort' ? (wrongVote && ph === 0 ? null : round!.steps[0].caption) : b.kind === 'verdict' ? round!.because : null
  return (
    <>
      {/* two groups (rule G3): the program with its six cases, and the round being played */}
      <div className="flex items-start gap-7">
        <Group pad={10} className="flex w-[440px] shrink-0 flex-col gap-3">
          <CodePane code={code} mark={[2]} fontSize={15.5} rows={6} />
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
              Six line 2s
            </span>
            <div className="flex flex-wrap gap-1.5">
              {CASES.map((c, i) => (
                <Chip key={c} text={c} state={i <= sortedUpTo ? 'gone' : i === r ? 'now' : 'wait'} />
              ))}
            </div>
          </div>
        </Group>
        <Group pad={10} className="flex min-w-0 flex-1 flex-col gap-2.5">
          {/* A new round's header and options fade out, then the next fade up, on the house curve (rule G1) */}
          {/* the height follows the round's options, so the bins below glide rather than jump when a verdict's why lines go */}
          <AutoHeight>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={r}
              className="flex flex-col gap-2.5"
              initial={instant ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: round ? 1 : 0, y: 0, transition: { duration: 0.46, ease: EASE } }}
              exit={{ opacity: 0, y: -8, transition: { duration: instant ? 0 : 0.26, ease: EASE } }}
              style={{ pointerEvents: round ? undefined : 'none' }}
            >
              <div className="flex items-center gap-3">
                <span className="shrink-0 whitespace-nowrap font-heading text-[17px] font-bold leading-snug" style={{ color: colors.brandDark }}>
                  Round {r + 1} of {ROUNDS.length}
                </span>
                <Ask size={20}>{round?.ask ?? ' '}</Ask>
              </div>
              <Vote options={round?.options ?? BINS} right={right} shown={shown} pick={pick} setPick={setPick} cols={2} size={17} dense mono={false} nowrap details={round?.options.map((o) => (o === round.answer ? undefined : <Lines lines={sentences(round.why[o] ?? '')} />))} />
            </motion.div>
          </AnimatePresence>
          </AutoHeight>
          <div className="grid grid-cols-2 gap-2.5">
            {BINS.map((bin, k) => (
              <div key={bin} className="flex min-h-[150px] flex-col gap-1.5 rounded-card px-3 py-2" style={{ background: colors.surface, boxShadow: `inset 0 0 0 2px ${colors.line}` }}>
                <span className="flex items-center gap-2 text-[14px] font-bold uppercase tracking-wider" style={{ color: k === 0 ? colors.accentDark : colors.brandDark }}>
                  <BinIcon xerox={k === 1} />
                  {bin}
                </span>
                {ROUNDS.map((rd, i) =>
                  i <= sortedUpTo && binOf(i) === k ? (
                    <motion.span
                      key={`${i}-${binOf(i)}`}
                      className="self-start"
                      initial={instant || i < r ? false : { opacity: 0, y: -14 }}
                      animate={i === r && sortingNow && wrongVote && ph === 0 && !instant ? { opacity: 1, y: 0, x: [0, -8, 8, -6, 6, 0] } : { opacity: 1, y: 0, x: 0 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], x: { duration: 0.6, delay: 0.35 } }}
                    >
                      <Chip text={rd.case} state={bounced(i) ? 'bounced' : 'binned'} />
                    </motion.span>
                  ) : null,
                )}
              </div>
            ))}
          </div>
          <StepCaption text={caption} tone={shown || b.kind === 'intro' ? 'rule' : 'step'} size={16} minH={54} />
        </Group>
      </div>
      {shown && pick === right && <Confetti seed={50 + r} />}
      <StepControls at={beat} total={SCHEDULE.length} />
    </>
  )
}
