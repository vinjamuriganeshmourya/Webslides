import { useState } from 'react'
import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Group, Lines } from './common'
import { Confetti } from './motion'
import { Ask, Fresh, sentences } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { CellRow, cellsOf, type Cell } from './cells'
import { Cover, YT } from './Music'
import { CODE_FS } from './Methods'
import { HEADPHONES, HEADSET, Idling, TEJA } from './Cast'
import { SPEC } from './spec'

/**
 * THE TWO GAMES. Every round, step, caption, option and why line is the
 * spec's data; every program was run on CPython 3.12.3.
 *
 *   G1  The DJ's desk (the office worker): 1 + 4 x (ask, 4 steps, verdict)
 *   G2  Does Ram see it? (change or move):  1 + 4 x (ask, 3 steps, verdict)
 *
 * Nothing in a round moves until the press after the room has answered; a
 * vote takes keys 1 to 4 or a click and never gates the press; the verdict
 * gives the right answer's because line and a why line under every wrong
 * option; confetti when the marked pick was right.
 */

type Beat<R> = { kind: 'intro' } | { kind: 'ask' | 'verdict'; r: number; round: R } | { kind: 'step'; r: number; s: number; round: R }

function schedule<R extends { steps: unknown[] }>(rounds: R[]): Beat<R>[] {
  return [
    { kind: 'intro' },
    ...rounds.flatMap((round, r) => [
      { kind: 'ask' as const, r, round },
      ...round.steps.map((_, s) => ({ kind: 'step' as const, r, s, round })),
      { kind: 'verdict' as const, r, round },
    ]),
  ]
}

function RoundHead({ r, n, ask }: { r: number; n: number; ask: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="shrink-0 whitespace-nowrap font-heading text-[17px] font-bold" style={{ color: colors.brandDark }}>
        Round {r + 1} of {n}
      </span>
      <Ask size={20}>{ask}</Ask>
    </div>
  )
}

/* ================================================================== G1 */

type G1Step = { caption: string; carrying: string | null; slots: { queue: string[] }; outbox: string[] }
type G1Round = { ask: string; program: string; inbox: string[]; options: string[]; answer: string; because: string; why: Record<string, string>; steps: G1Step[] }

const show = (q: string[]) => `[${q.map((s) => `'${s}'`).join(', ')}]`

/** The DJ: Teja at the party table with headphones on, holding the request he is adding. */
function DJ({ carrying }: { carrying: string | null }) {
  const instant = useInstant()
  return (
    <div className="flex flex-col items-center gap-0.5" style={{ width: 110 }}>
      {/* Teja, the DJ, from the character lab (G4): his idle layer keeps him breathing and blinking, the headphones ride his head (user, 2026-10-08, slide 12) */}
      <Idling cfg={TEJA} crop={HEADSET} scale={0.33} seed={5} head={HEADPHONES} />
      <motion.span
        key={carrying ?? 'none'}
        className="whitespace-nowrap rounded-lg px-2 font-mono text-[13px] font-bold leading-[20px]"
        style={{ background: colors.white, color: colors.ink, boxShadow: `inset 0 0 0 2px ${colors.accent}, 0 6px 12px -6px rgba(16,32,58,0.35)` }}
        initial={instant || !carrying ? false : { opacity: 0, x: -90 }}
        animate={{ opacity: carrying ? 1 : 0, x: 0 }}
        transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
      >
        {carrying ?? ' '}
      </motion.span>
    </div>
  )
}

function Belt({ label, items, mono = false }: { label: string; items: string[]; mono?: boolean }) {
  return (
    <div className="flex w-full items-center gap-3">
      <span className="w-[92px] shrink-0 text-[12px] font-bold uppercase leading-tight tracking-wider" style={{ color: colors.muted }}>
        {label}
      </span>
      <div className="flex min-h-[34px] min-w-0 flex-1 items-center gap-1.5 rounded-xl px-2 py-0.5" style={{ background: colors.surface, boxShadow: `inset 0 -3px 0 ${colors.line}, inset 0 0 0 1.5px ${colors.line}` }}>
        {items.map((t, i) => (
          <span key={`${t}-${i}`} className={`sm-rise whitespace-nowrap rounded-md bg-white px-2 py-0.5 text-[14px] font-semibold ${mono ? 'font-mono' : ''}`} style={{ color: colors.ink, boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

export function DjDesk() {
  const G1 = SPEC.G1
  const rounds: G1Round[] = G1.data.rounds
  const S = schedule(rounds)
  const beat = useBeats(S.length)
  const b = S[beat - 1]
  const [picks, setPicks] = useState<number[]>(rounds.map(() => -1))
  const r = b.kind === 'intro' ? -1 : b.r
  const round = r >= 0 ? rounds[r] : null
  const pick = r >= 0 ? picks[r] : -1
  const setPick = (p: number) => r >= 0 && setPicks((ps) => ps.map((v, j) => (j === r ? p : v)))
  const right = round ? round.options.indexOf(round.answer) : -1
  const step = b.kind === 'step' ? round!.steps[b.s] : b.kind === 'verdict' ? round!.steps[round!.steps.length - 1] : null
  const prev = b.kind === 'step' && b.s > 0 ? round!.steps[b.s - 1] : null
  const queue = step ? step.slots.queue : []
  const taken = b.kind === 'step' ? b.s + 1 : b.kind === 'verdict' ? round!.inbox.length : 0
  const inbox = round ? round.inbox.slice(Math.min(taken, round.inbox.length)) : []
  const shown = b.kind === 'verdict'
  const caption = b.kind === 'intro' ? G1.data.intro : b.kind === 'step' ? step!.caption : b.kind === 'verdict' ? round!.because : null
  const cells: Cell[] = cellsOf(queue, step && step.carrying ? { [queue.indexOf(step.carrying)]: 'new' } : {})
  const fit = ['Chuttamalle', 'Peelings', 'Kissik']
  return (
    <>
      <div className="flex items-start gap-7">
        <Group pad={6} active={b.kind === 'step'} className="flex w-[572px] shrink-0 flex-col gap-2">
          <div>
            <CodePane code={(round ?? rounds[0]).program} fontSize={CODE_FS} rows={7} />
          </div>
          <div className="flex flex-col gap-1 rounded-card bg-white px-3 py-1.5" style={{ boxShadow: `inset 0 0 0 1.5px ${colors.line}` }}>
            <Belt label="Requests" items={inbox} />
            <div className="flex items-center gap-3">
              <DJ carrying={b.kind === 'step' ? step!.carrying : null} />
              <div className="flex min-w-0 flex-col gap-0.5">
                <CellRow name="queue" cells={cells} fit={fit} reserve={3} font={14} quote={false} lane={false} empty="[]" />
                {/* the slot's old value stays readable, crossed out (G1's must line) */}
                <span key={b.kind === 'step' ? `${r}-${b.s}` : 'none'} className="sm-bump h-[18px] font-mono text-[14px] leading-[18px]" style={{ color: colors.muted, textDecoration: 'line-through' }}>
                  {b.kind === 'step' ? (prev ? show(prev.slots.queue) : '[]') : ''}
                </span>
              </div>
            </div>
            <Belt label="print(queue)" items={step ? step.outbox : []} mono />
          </div>
        </Group>
        <Group pad={10} active={b.kind === 'ask'} className="flex min-w-0 flex-1 flex-col gap-3">
          <div style={{ opacity: round ? 1 : 0 }}>
            <RoundHead r={Math.max(r, 0)} n={rounds.length} ask={round?.ask ?? rounds[0].ask} />
          </div>
          <div style={{ opacity: round ? 1 : 0, pointerEvents: round ? undefined : 'none' }}>
            <Vote
              key={r}
              options={(round ?? rounds[0]).options}
              right={right}
              shown={shown}
              pick={pick}
              setPick={setPick}
              cols={1}
              size={14}
              dense
              details={round?.options.map((o) => (o === round.answer ? undefined : <Lines lines={sentences(round.why[o] ?? '')} />))}
            />
          </div>
          <div>
            <StepCaption badge={b.kind === 'step' ? `box ${b.s + 1}` : null} text={caption} tone={shown || b.kind === 'intro' ? 'rule' : 'step'} size={17} minH={54} />
          </div>
        </Group>
      </div>
      {shown && pick === right && <Confetti seed={60 + r} />}
      <StepControls at={beat} total={S.length} />
    </>
  )
}

/* ================================================================== G2 */

type G2Step = { caption: string; line: number; a: string[] | null; b: string[] | null; same: boolean }
type G2Round = { ask: string; program: string; output: string; options: string[]; answer: string; because: string; why: Record<string, string>; steps: G2Step[] }

/** A small phone showing the queue its name points at, in the music app's look. */
function MiniPhone({ name, songs }: { name: string; songs: string[] | null }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-[46px] shrink-0 rounded-lg py-1 text-center font-mono text-[15px] font-bold" style={{ background: colors.brandDark, color: colors.white }}>
        {name}
      </span>
      <div className="w-[138px] rounded-[18px] p-[5px]" style={{ background: '#15191F' }}>
        <div className="flex h-[122px] flex-col gap-1.5 rounded-[13px] px-2 pt-2" style={{ background: YT.bg }}>
          <span className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: YT.sub }}>
            Up next
          </span>
          <Fresh k={(songs ?? ['none']).join('|')} className="flex flex-col gap-1.5">
          {(songs ?? []).map((s) => (
            <span key={s} className="flex items-center gap-1.5">
              <Cover song={s} size={20} />
              <span className="whitespace-nowrap text-[12px] font-semibold" style={{ color: YT.ink }}>
                {s}
              </span>
            </span>
          ))}
          </Fresh>
          {songs && songs.length === 0 && (
            <span className="text-[12px] italic" style={{ color: YT.sub }}>
              Queue is empty
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * The names and the lists they point at. Object A is the party queue; a line
 * that makes a new list draws object B, new, under it, and only that name's
 * arrow moves. A line that changes the list changes A where it stands and no
 * arrow moves. A list no name points at fades and stays faded.
 */
function Pointers({ step, prevSame }: { step: G2Step | null; prevSame: boolean }) {
  const instant = useInstant()
  const PHONE_Y = { teja: 66, ram: 200 }
  /* the shared list sits between the two phones; a new list is drawn above it, beside teja, so no arrow crosses */
  const OBJ_Y = { A: 150, B: 50 }
  const X0 = 204
  const X1 = 262
  const a = step?.a ?? null
  const bv = step?.b ?? null
  /* where each name points: after a line that made a new list, teja points at B */
  const newList = step !== null && step.line === 3 && !step.same && prevSame
  const tejaTo = newList ? 'B' : 'A'
  const objA = newList ? bv : a
  const objB = newList ? a : null
  const ramOn = bv !== null
  const pointsA = tejaTo === 'A' || ramOn
  const arrow = (y0: number, y1: number, on: boolean, k: string) => (
    <motion.path
      key={k}
      initial={false}
      animate={{ d: `M${X0} ${y0} C ${X0 + 40} ${y0} ${X1 - 46} ${y1} ${X1 - 8} ${y1}`, opacity: on ? 1 : 0 }}
      transition={{ duration: instant ? 0 : 0.62, ease: [0.22, 1, 0.36, 1] }}
      fill="none"
      stroke={colors.brandDark}
      strokeWidth="2.5"
      markerEnd="url(#g2-head)"
    />
  )
  return (
    <div className="relative" style={{ width: 584, height: 266 }}>
      <svg width={584} height={266} className="absolute inset-0" aria-hidden>
        <defs>
          <marker id="g2-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill={colors.brandDark} />
          </marker>
        </defs>
        {arrow(PHONE_Y.teja, OBJ_Y[tejaTo], a !== null, 'teja')}
        {arrow(PHONE_Y.ram, OBJ_Y.A, ramOn, 'ram')}
      </svg>
      <div className="absolute left-0" style={{ top: PHONE_Y.teja - 66 }}>
        <MiniPhone name="teja" songs={a} />
      </div>
      <div className="absolute left-0" style={{ top: PHONE_Y.ram - 66, opacity: ramOn ? 1 : 0.35, transition: 'opacity 420ms' }}>
        <MiniPhone name="ram" songs={bv} />
      </div>
      <div className="absolute" style={{ left: X1, top: OBJ_Y.A - 20 }}>
        {objA !== null && <CellRow cells={cellsOf(objA, {}, 'A')} font={13} quote={false} lane={false} fit={['Chuttamalle', 'Peelings', 'Kissik']} reserve={3} dim={!pointsA} empty="[]" />}
      </div>
      <div className="absolute" style={{ left: X1, top: OBJ_Y.B - 20 }}>
        {objB !== null && (
          <div className="sm-rise">
            <CellRow cells={cellsOf(objB, {}, 'B')} font={13} quote={false} lane={false} fit={['Chuttamalle', 'Peelings', 'Kissik']} reserve={3} />
          </div>
        )}
      </div>
    </div>
  )
}

export function RamSees() {
  const G2 = SPEC.G2
  const rounds: G2Round[] = G2.data.rounds
  const S = schedule(rounds)
  const beat = useBeats(S.length)
  const b = S[beat - 1]
  const [picks, setPicks] = useState<number[]>(rounds.map(() => -1))
  const r = b.kind === 'intro' ? -1 : b.r
  const round = r >= 0 ? rounds[r] : null
  const pick = r >= 0 ? picks[r] : -1
  const setPick = (p: number) => r >= 0 && setPicks((ps) => ps.map((v, j) => (j === r ? p : v)))
  const right = round ? round.options.indexOf(round.answer) : -1
  const si = b.kind === 'step' ? b.s : b.kind === 'verdict' ? round!.steps.length - 1 : -1
  const step = round && si >= 0 ? round.steps[si] : null
  const prevSame = round && si >= 1 ? round.steps[si - 1].same : false
  const shown = b.kind === 'verdict'
  const caption = b.kind === 'intro' ? G2.data.intro : b.kind === 'step' ? step!.caption : b.kind === 'verdict' ? round!.because : null
  return (
    <>
      <div className="flex items-start gap-7">
        <Group pad={8} active={b.kind === 'ask'} className="flex w-[516px] shrink-0 flex-col gap-2.5">
          <div style={{ opacity: round ? 1 : 0 }}>
            <RoundHead r={Math.max(r, 0)} n={rounds.length} ask={round?.ask ?? rounds[0].ask} />
          </div>
          <div>
            <CodePane code={(round ?? rounds[0]).program} at={b.kind === 'step' ? step!.line : null} fontSize={CODE_FS} rows={4} />
          </div>
          <div style={{ opacity: round ? 1 : 0, pointerEvents: round ? undefined : 'none' }}>
            <Vote
              key={r}
              options={(round ?? rounds[0]).options}
              right={right}
              shown={shown}
              pick={pick}
              setPick={setPick}
              cols={1}
              size={15}
              dense
              details={round?.options.map((o) => (o === round.answer ? undefined : <Lines lines={sentences(round.why[o] ?? '')} />))}
            />
          </div>
        </Group>
        <Group pad={10} active={b.kind === 'step'} className="flex min-w-0 flex-1 flex-col gap-3">
          <div>
            <Pointers step={step} prevSame={prevSame} />
          </div>
          <div>
            <StepCaption badge={b.kind === 'step' ? `line ${step!.line}` : null} text={caption} tone={shown || b.kind === 'intro' ? 'rule' : 'step'} size={17} minH={54} />
          </div>
        </Group>
      </div>
      {shown && pick === right && <Confetti seed={80 + r} />}
      <StepControls at={beat} total={S.length} />
    </>
  )
}
