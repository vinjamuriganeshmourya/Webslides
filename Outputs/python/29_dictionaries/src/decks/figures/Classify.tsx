import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Group, Lines } from './common'
import { Confetti } from './motion'
import { Ask, BigLine, sentences } from './pieces'
import { StepCaption, Vote } from './trace'
import { useForward } from './phase'
import { flyFrom } from './rows'
import { SPEC } from './spec'

/**
 * GAME G1: A SET, SOMETHING ELSE, OR AN ERROR? Spec card G1, twenty-two
 * presses: the intro, then seven rounds of three (the ask, one step, the
 * verdict). Format "tap to classify".
 *
 *   - Every case is on screen from press 1, waiting in the tray (must line);
 *     the three bins under them. Nothing in a round moves until the press
 *     after the room has answered (must line).
 *   - The ask lifts the round's case out of the tray and puts it on the left
 *     with the question and the three bins as options (keys 1 to 3, or a
 *     click, mark the room's choice; the right arrow works either way).
 *   - The step taps the case into its bin, with what type() said or the error
 *     as the caption (its badge says `run` on an error round: Python never
 *     gets to type() there). If the room's marked bin was another, that bin
 *     shakes and the case lands where it belongs. A filed case leaves no
 *     empty slot in the tray: the tray closes up (the view fixes change
 *     spec, 2026-10-09).
 *   - The verdict marks the right bin and gives the why line under every
 *     other option.
 *
 * Every case, caption and why line is the spec's data, run as
 * `x = <case>; print(type(x))` on CPython 3.12.3.
 */
const G1 = SPEC.G1
type Round = { ask: string; case: string; options: string[]; answer: string; because: string; why: Record<string, string>; steps: { caption: string; bin: string }[] }
const ROUNDS: Round[] = G1.data.rounds
const BINS: string[] = G1.data.setup.bins
const CASES: string[] = G1.data.setup.cases

type Beat = { kind: 'intro' } | { kind: 'ask' | 'step' | 'verdict'; r: number }
const SCHEDULE: Beat[] = [{ kind: 'intro' }, ...ROUNDS.flatMap((_, r): Beat[] => [{ kind: 'ask', r }, { kind: 'step', r }, { kind: 'verdict', r }])]

function CaseChip({ children, ghost = false, lift = false, refEl }: { children: ReactNode; ghost?: boolean; lift?: boolean; refEl?: (el: HTMLSpanElement | null) => void }) {
  const tween = useTween(420)
  return (
    <span
      ref={refEl}
      className="inline-flex h-[36px] items-center whitespace-nowrap rounded-lg px-3 font-mono text-[15px] font-semibold"
      style={{
        background: ghost ? 'transparent' : lift ? colors.surface2 : colors.white,
        color: ghost ? 'transparent' : colors.brandDark,
        boxShadow: ghost ? `inset 0 0 0 1.5px ${colors.line}` : `inset 0 0 0 ${lift ? 2.5 : 1.5}px ${lift ? colors.brand : colors.line}, 0 4px 10px -8px rgba(16,32,58,0.35)`,
        outline: ghost ? `1.5px dashed ${colors.line}` : 'none',
        outlineOffset: -1.5,
        transform: lift ? 'translateY(-4px)' : 'none',
        transition: tween,
      }}
    >
      {children}
    </span>
  )
}

/** A case that has just been tapped into its bin: it flies in from the tray. */
function Filed({ text, from, fly }: { text: string; from: HTMLElement | null; fly: boolean }) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const instant = useInstant()
  useLayoutEffect(() => {
    if (fly && !instant) flyFrom(ref.current, from, 900)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <CaseChip refEl={(el) => { ref.current = el }}>{text}</CaseChip>
}

/** One bin. A wrong pick's bin shakes once when the case lands elsewhere. */
function Bin({ name, items, lit, shake }: { name: string; items: { text: string; from: HTMLElement | null; fly: boolean }[]; lit: boolean; shake: boolean }) {
  const tween = useTween(420)
  const instant = useInstant()
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!shake || instant) return
    ref.current?.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(7px)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(0)' }], { duration: 560, delay: 300, easing: 'ease-out' })
  }, [shake, instant])
  return (
    <div
      ref={ref}
      className="flex min-h-[58px] items-center gap-3 rounded-card px-3 py-2"
      style={{ background: lit ? '#E9F8EF' : colors.surface2, boxShadow: `inset 0 0 0 ${lit ? 3 : 2}px ${lit ? colors.success : shake ? colors.danger : colors.line}`, transition: tween }}
    >
      <span className="w-[150px] shrink-0 whitespace-nowrap font-heading text-[17px] font-bold" style={{ color: colors.brandDark }}>
        {name}
      </span>
      <span className="flex min-w-0 flex-1 flex-wrap gap-2">
        {items.map((it) => (
          <Filed key={`filed-${it.text}`} text={it.text} from={it.from} fly={it.fly} />
        ))}
      </span>
    </div>
  )
}

export function Classify() {
  const beat = useBeats(SCHEDULE.length)
  const fwd = useForward(beat)
  const b = SCHEDULE[beat - 1]
  const r = b.kind === 'intro' ? -1 : b.r
  const round = r >= 0 ? ROUNDS[r] : null
  const [picks, setPicks] = useState<number[]>(ROUNDS.map(() => -1))
  const pick = r >= 0 ? picks[r] : -1
  const setPick = (p: number) => setPicks((ps) => ps.map((v, j) => (j === r ? p : v)))
  const tray = useRef<(HTMLSpanElement | null)[]>([])
  /* how many cases are in their bins: every earlier round, and this one from its step */
  const filed = r < 0 ? 0 : r + (b.kind === 'ask' ? 0 : 1)
  const shown = b.kind === 'verdict'
  const right = round ? round.options.indexOf(round.answer) : -1
  const landed = round && b.kind !== 'ask' ? BINS.indexOf(round.steps[0].bin) : -1
  const caption = b.kind === 'step' ? round!.steps[0].caption : shown ? round!.because : null
  return (
    <>
      <div className="flex items-stretch gap-8">
        <Group className="flex w-[430px] shrink-0 flex-col gap-2.5" active={b.kind === 'ask' ? true : undefined}>
          {round ? (
            <>
              <div className="flex items-baseline gap-3">
                <span className="whitespace-nowrap font-heading text-[17px] font-bold" style={{ color: colors.brandDark }}>
                  Round {r + 1} of {ROUNDS.length}
                </span>
                <Ask size={20}>{round.ask}</Ask>
              </div>
              <BigLine size={22} k={r}>
                {round.case}
              </BigLine>
              <Vote
                key={`g1-vote-${r}`}
                options={round.options}
                right={right}
                shown={shown}
                pick={pick}
                setPick={setPick}
                cols={1}
                size={17}
                dense
                mono={false}
                details={round.options.map((o) => (o === round.answer ? undefined : <span className="block text-[14px] leading-[18px]"><Lines lines={sentences(round.why[o] ?? '')} /></span>))}
              />
            </>
          ) : (
            <Ask size={28}>{G1.data.intro}</Ask>
          )}
        </Group>
        <Group className="flex min-w-0 flex-1 flex-col gap-3" active={b.kind === 'step' ? true : undefined}>
          <div className="flex min-h-[36px] flex-wrap gap-2.5">
            {CASES.map((c, i) => {
              /* this round's case stays in the tray, unseen, through its step press: it is where the flight starts */
              const flying = b.kind === 'step' && i === r
              if (i < filed && !flying) return null
              return (
                <motion.span key={`tray-${i}`} layout initial={false} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} style={{ opacity: flying ? 0 : 1 }}>
                  <CaseChip lift={i === r && b.kind === 'ask'} refEl={(el) => { tray.current[i] = el }}>
                    {c}
                  </CaseChip>
                </motion.span>
              )
            })}
          </div>
          <div className="flex flex-col gap-2.5">
            {BINS.map((name, k) => (
              <Bin
                key={`bin-${k}`}
                name={name}
                lit={landed === k && (b.kind === 'step' || shown)}
                shake={b.kind === 'step' && fwd && pick >= 0 && pick !== right && pick === k}
                items={ROUNDS.slice(0, filed)
                  .map((rd, i) => ({ rd, i }))
                  .filter(({ rd }) => BINS.indexOf(rd.steps[0].bin) === k)
                  .map(({ rd, i }) => ({ text: rd.case, from: tray.current[i] ?? null, fly: fwd && b.kind === 'step' && i === r }))}
              />
            ))}
          </div>
          <StepCaption badge={b.kind === 'step' ? (round!.answer === 'Error' ? 'run' : 'type()') : null} text={caption} tone={shown ? 'rule' : 'step'} size={17} minH={50} />
        </Group>
      </div>
      {shown && pick === right && <Confetti seed={160 + r} />}
      <StepControls at={beat} total={SCHEDULE.length} />
    </>
  )
}
