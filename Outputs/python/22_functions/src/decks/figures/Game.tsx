import { useEffect, useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls, useVoteKeys } from './controls'
import { Lines } from './common'
import { Confetti, Glow } from './motion'
import { Ask, sentences } from './pieces'
import { StepCaption } from './trace'
import { CallCode, traceOf, type Step } from './call'
import { SPEC } from './spec'

/**
 * GAME G1: THE PARTY SCREEN MACHINE. Spec card G1, 35 presses over five
 * rounds (predict-then-run).
 *
 * The object is the party TV at Teja's party: each printed line lands on it
 * as Python prints it. Beside it the round's program with the marker on the
 * line Python is running; on a call the marker jumps up into cheer's block and
 * back, drawn as the session's one picture (`call.tsx`). Each round: the
 * question and its options, nothing running (press 1); one step per press
 * with the data's caption; the verdict, the answer lit on the TV itself, its
 * reason, and a line under every other option.
 *
 * An option IS a TV screen: its lines one under the other (must line). An
 * error shows on a screen as its name, NameError; the caption gives the full
 * message. Keys 1 to 4 or a click mark the room's pick; the right arrow works
 * with or without one. Nothing moves on a timer.
 */
const G1 = SPEC.G1
type Round = { ask: string; program: string; options: string[]; answer: string; because: string; why: Record<string, string>; steps: { caption: string; state: { line: number | null; where: string; screen: string[] } }[] }
const ROUNDS: Round[] = G1.data.rounds
const PRESSES: number[] = ROUNDS.map((r) => r.steps.length + 2)
const TOTAL = PRESSES.reduce((a, b) => a + b, 0) /* 35, the spec's press_count */

/** beat (1-based) -> round and the press inside it (0 ask, 1..n a step, n+1 the verdict) */
function locate(beat: number) {
  let left = beat - 1
  for (let r = 0; r < ROUNDS.length; r++) {
    if (left < PRESSES[r]) return { r, k: left }
    left -= PRESSES[r]
  }
  return { r: ROUNDS.length - 1, k: PRESSES[ROUNDS.length - 1] - 1 }
}

const isErr = (t: string) => /^\w*Error/.test(t)
const errName = (t: string) => (isErr(t) ? t.split(':')[0] : t)

/* ------------------------------------------------------------------ TV */

/** Bunting over the TV: small flags in the template's colours. */
function Bunting({ width }: { width: number }) {
  const n = Math.floor(width / 34)
  const fills = [colors.accent, colors.brand, colors.teal, colors.warning]
  return (
    <svg width={width} height={26} viewBox={`0 0 ${width} 26`} aria-hidden className="block">
      <path d={`M 0 4 Q ${width / 2} 16 ${width} 4`} fill="none" stroke={colors.muted} strokeWidth={1.5} />
      {Array.from({ length: n }, (_, i) => {
        const x = 14 + i * ((width - 28) / (n - 1))
        const t = x / width
        const y = 4 + 12 * 4 * t * (1 - t) * 0.92
        return <path key={i} d={`M ${x - 9} ${y} L ${x + 9} ${y} L ${x} ${y + 16} Z`} fill={fills[i % 4]} />
      })}
    </svg>
  )
}

/** One balloon on a string. */
function Balloon({ color, h = 92 }: { color: string; h?: number }) {
  return (
    <svg width={40} height={h} viewBox={`0 0 40 ${h}`} aria-hidden>
      <ellipse cx={20} cy={22} rx={17} ry={21} fill={color} />
      <ellipse cx={13} cy={14} rx={4} ry={6} fill="#FFFFFF" opacity={0.45} />
      <path d={`M 17 43 L 23 43 L 20 48 Z`} fill={color} />
      <path d={`M 20 48 Q 14 ${48 + (h - 48) / 2} 20 ${h}`} fill="none" stroke={colors.muted} strokeWidth={1.2} />
    </svg>
  )
}

/** The party TV: a bezel, a dark screen with the printed lines, a stand. */
export function PartyTV({ lines, w = 400, h = 196, lit = false, red = -1, label = 'Party screen', nothing = false }: { lines: string[]; w?: number; h?: number; lit?: boolean; red?: number; label?: string; nothing?: boolean }) {
  const tween = useTween(420)
  return (
    <div className="flex flex-col items-center" style={{ width: w }}>
      <Glow on={lit} color={colors.success}>
        <div className="rounded-[18px] p-[10px]" style={{ background: colors.ink, boxShadow: '0 14px 28px -14px rgba(11,26,43,0.55)', width: w }}>
          <div
            className="relative overflow-hidden rounded-[10px] px-5 py-3"
            style={{ height: h - 20, background: `radial-gradient(120% 90% at 20% 0%, ${colors.night3} 0%, ${colors.night} 70%)`, boxShadow: lit ? `inset 0 0 0 3px ${colors.success}` : 'inset 0 0 0 1px rgba(255,255,255,0.06)', transition: tween }}
          >
            <span className="absolute right-3 top-2 text-[11px] font-bold uppercase tracking-wider text-white/35">{label}</span>
            {lines.length === 0 && nothing && <span className="sm-bump block pt-1 font-mono text-[18px] italic text-white/40">(nothing)</span>}
            {lines.map((t, i) => (
              <div key={`${i}-${t}`} className="sm-bump whitespace-pre font-mono text-[19px] font-semibold leading-[27px]" style={{ color: isErr(t) || i === red ? '#FF8A8A' : colors.white }}>
                {t}
              </div>
            ))}
          </div>
        </div>
      </Glow>
      <div style={{ width: 18, height: 14, background: colors.ink }} />
      <div className="rounded-pill" style={{ width: 120, height: 8, background: colors.ink }} />
    </div>
  )
}

/* ------------------------------------------------------------------ options */

function ScreenOption({ letter, text, picked, right, shown, why, onPick }: { letter: string; text: string; picked: boolean; right: boolean; shown: boolean; why?: string; onPick: () => void }) {
  const instant = useInstant()
  const tween = useTween(420)
  const isRight = shown && right
  const wrongPick = shown && picked && !right
  const ring = isRight ? colors.success : wrongPick ? colors.danger : picked ? colors.brand : colors.line
  const lines = text === '(nothing)' ? [] : text.split('\n')
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <button
        type="button"
        disabled={shown}
        aria-pressed={picked}
        onClick={() => !shown && onPick()}
        onKeyDown={(e) => e.key !== 'Enter' && e.key !== ' ' && e.currentTarget.blur()}
        className="sm-tap relative flex flex-col items-stretch rounded-xl p-1.5 text-left"
        style={{ background: isRight ? '#E9F8EF' : wrongPick ? '#FDECEC' : picked ? colors.surface2 : colors.white, boxShadow: `inset 0 0 0 ${isRight || picked ? 3 : 2}px ${ring}`, opacity: shown && !right ? 0.72 : 1, transition: instant ? 'none' : tween }}
      >
        <span className="mb-1 ml-1 font-mono text-[14px] font-bold" style={{ color: isRight ? colors.success : picked ? colors.brand : colors.muted }}>
          {letter}
        </span>
        <span className="block h-[80px] rounded-md px-2.5 py-1" style={{ background: colors.night }}>
          {lines.length === 0 && <span className="block font-mono text-[14px] italic leading-[19px] text-white/45">(nothing)</span>}
          {lines.map((l, i) => (
            <span key={i} className="block whitespace-pre font-mono text-[14px] font-semibold leading-[18px]" style={{ color: isErr(l) ? '#FF8A8A' : colors.white }}>
              {errName(l)}
            </span>
          ))}
        </span>
      </button>
      <span className="text-[14px] font-semibold leading-[18px]" style={{ color: colors.body, opacity: shown && why ? 1 : 0, transition: tween }}>
        {why ? <Lines lines={sentences(why)} /> : null}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ the machine */

export function PartyMachine() {
  const beat = useBeats(TOTAL)
  const { r, k } = locate(beat)
  const round = ROUNDS[r]
  const n = round.steps.length
  const verdict = k === n + 1
  const steps: Step[] = round.steps.map((s) => ({ line: s.state.line, where: s.state.where, caption: s.caption, screen: s.state.screen }))
  const frames = traceOf(steps, round.program)
  const si = k >= 1 ? Math.min(k - 1, n - 1) : -1
  const frame = si >= 0 ? frames[si] : null
  const screen = frame?.step?.screen ?? []
  const errLine = screen.some(isErr) ? frame?.at ?? null : null
  const right = round.options.indexOf(round.answer)
  const [pick, setPick] = useState(-1)
  useEffect(() => setPick(-1), [r])
  useVoteKeys(round.options.length, setPick, !verdict)
  const rows = Math.max(...ROUNDS.map((x) => x.program.split('\n').length))
  const caption = verdict ? round.because : frame ? frame.step!.caption : null
  const ending = frame && frame.at === null
  return (
    <>
      <div className="flex items-start gap-7">
        <div className="flex shrink-0 flex-col gap-3" style={{ width: 486 }}>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 whitespace-nowrap rounded-md px-3 py-1 text-[15px] font-bold uppercase tracking-wider" style={{ background: '#FFF4EC', color: colors.accentDark }}>
              Round {r + 1} of {ROUNDS.length}
            </span>
            <Ask size={20}>{round.ask}</Ask>
          </div>
          <CallCode code={round.program} fs={15} rows={rows} frame={errLine ? { ...frame!, at: null } : ending ? null : frame} error={errLine} />
          <StepCaption badge={verdict || !frame?.at ? null : `line ${frame.at}`} text={caption} tone={verdict ? 'rule' : 'step'} size={17} minH={52} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-center gap-3">
          <div className="flex w-full items-end justify-center gap-3">
            <Balloon color={colors.accent} h={80} />
            <div className="flex flex-col items-center">
              <Bunting width={380} />
              <PartyTV lines={screen.map(errName)} lit={verdict} w={400} h={150} nothing={verdict && screen.length === 0} />
            </div>
            <Balloon color={colors.brand} h={96} />
          </div>
          <div className="flex w-full gap-2.5">
            {round.options.map((o, i) => (
              <ScreenOption key={`${r}-${i}`} letter={'ABCD'[i]} text={o} picked={pick === i} right={i === right} shown={verdict} why={round.why[o]} onPick={() => setPick(i)} />
            ))}
          </div>
        </div>
      </div>
      {verdict && pick === right && <Confetti seed={14 + r} />}
      <StepControls at={beat} total={TOTAL} />
    </>
  )
}

/** For the deck file's notes: the per-round press counts, read from the data. */
export const G1_PRESSES: ReactNode = PRESSES.join(' + ')
