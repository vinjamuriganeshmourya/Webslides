import { useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Focus, Group, Lines } from './common'
import { Confetti } from './motion'
import { Ask, OutPanel, Swap, sentences, CODE_FS, OUT_FS } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { Venn, pair, type ChipTone, type Shade } from './venn'
import { ListBox } from './OpCards'
import { SPEC } from './spec'

/**
 * GAME G1 · LIGHT THE REGIONS. Twenty-two presses: the intro, then four
 * rounds (the ask, one press per region and one for the print, the verdict;
 * round 4 has one step, the error).
 *
 *   - The program and the vote on top; the two circles under them, with
 *     every person as a chip in one of three regions.
 *   - Nothing moves until the press after the vote. The regions light (kept)
 *     or grey (dropped) in the same order every round, only the first, both,
 *     only the second, and stay so to the end of the round. The count shows
 *     only on the print press; the lit chips are the count.
 *   - Round 4, | with a list, stops on its own line with a TypeError: no
 *     region lights, nothing prints. The list is drawn as a list, square
 *     brackets and `a list` under it, never as a circle (the view fixes
 *     change spec, 2026-10-09). The same spec dropped the step badge, which
 *     showed our data's field names (only left, both, print) to the room,
 *     and made round 2's left circle the set before the operator, dance.
 *   - The verdict marks the right option and gives a line for every wrong one.
 * Both circles keep every chip the whole round. Every program, step and why
 * line is the spec's, run on CPython 3.12.3.
 */
const G1 = SPEC.G1
type Step = { caption: string; region: string; kept: boolean | null; items: string[]; printed: string }
type Round = { ask: string; program: string; left: string[]; right: string[]; output: string; options: string[]; answer: string; because: string; why: Record<string, string>; steps: Step[] }
const ROUNDS: Round[] = G1.data.rounds

export type Beat = { kind: 'intro' } | { kind: 'ask' | 'verdict'; r: number } | { kind: 'step'; r: number; s: number }
export function schedule(rounds: { steps: unknown[] }[]): Beat[] {
  return [{ kind: 'intro' }, ...rounds.flatMap((rd, r): Beat[] => [{ kind: 'ask', r }, ...rd.steps.map((_, s): Beat => ({ kind: 'step', r, s })), { kind: 'verdict', r }])]
}
const SCHEDULE = schedule(ROUNDS)

/** `cse = {...}` lines and the operator line: which name is on each side, for the labels. */
function sides(program: string): { left: string; right: string; opLine: number } {
  const lines = program.split('\n')
  const opLine = lines.findIndex((l) => /^result = /.test(l))
  const m = lines[opLine].match(/^result = (\w+) (.) (.+)$/)!
  return { left: m[1], right: /^\w+$/.test(m[3]) ? m[3] : m[3], opLine: opLine + 1 }
}

/**
 * The frame both games share: the program and the vote on top, the picture
 * with its caption, output and verdict under them (generate-slides 2b: one
 * cluster, one container; the part the room works on lights).
 */
export function RoundFrame({
  intro,
  head,
  code,
  rows,
  at,
  stop,
  vote,
  asking,
  running,
  picture,
  caption,
  badge,
  rule,
  out,
  verdict,
  wideOut = false,
}: {
  /** an error line needs the whole width; the why lines then go under it */
  wideOut?: boolean
  intro: string | null
  head: ReactNode
  code: string
  rows: number
  at?: number | null
  stop?: boolean
  vote: ReactNode
  asking: boolean
  running: boolean
  picture: ReactNode
  caption: string | null
  badge?: string | null
  rule?: boolean
  out: { text: string; tone?: 'plain' | 'error' }[]
  verdict?: ReactNode
}) {
  if (intro !== null)
    return (
      <Group pad={28} className="flex min-h-[300px] flex-col items-start justify-center gap-4">
        <Ask size={32}>{intro}</Ask>
      </Group>
    )
  return (
    <div className="flex flex-col gap-2.5">
      <Group pad={10} className="flex items-stretch gap-4" active={asking}>
        <div className="w-[730px] shrink-0">
          <Focus on={asking}>
            <CodePane code={code} fontSize={CODE_FS} rows={rows} at={at ?? null} stop={stop} />
          </Focus>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2.5">
          {head}
          {vote}
        </div>
      </Group>
      <Group pad={8} className="flex items-center gap-4" active={running}>
        {picture}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <StepCaption badge={badge} text={caption} tone={rule ? 'rule' : 'step'} size={16} minH={50} />
          <div className="flex items-start gap-3">
            <OutPanel lines={out} minRows={1} fontSize={OUT_FS} className={wideOut ? 'min-w-0 flex-1' : 'w-[200px] shrink-0'} />
            {!wideOut && <div className="min-w-0 flex-1">{verdict}</div>}
          </div>
          {wideOut && verdict}
        </div>
      </Group>
    </div>
  )
}

/** The verdict's lines for the wrong options: the option, and why it is not. */
export function WhyLines({ on, rows, cols = 1 }: { on: boolean; rows: { opt: string; why: string }[]; cols?: number }) {
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(6px)', transition: 'opacity 480ms cubic-bezier(0.22,1,0.36,1), transform 480ms cubic-bezier(0.22,1,0.36,1)' }}>
      {rows.map((r) => (
        <div key={r.opt} className="flex items-start gap-2.5 rounded-lg bg-white px-3 py-1" style={{ boxShadow: `inset 0 0 0 1px ${colors.line}` }}>
          <span className="shrink-0 whitespace-nowrap font-mono text-[14px] font-bold leading-[20px]" style={{ color: colors.danger }}>
            {r.opt}
          </span>
          <span className="text-[14px] font-semibold leading-[20px]" style={{ color: colors.body }}>
            <Lines lines={sentences(r.why)} />
          </span>
        </div>
      ))}
    </div>
  )
}

const VW = 310
const VH = 214
const G = pair(VW, VH, 94, 120, 13)
const ONE = { cx: 98, cy: VH / 2 + 13, r: 94 }
/** `{...}` as its names. */
const namesOf = (lit: string) => [...lit.matchAll(/"([^"]*)"/g)].map((m) => m[1])
const REGION: Record<string, 'l' | 'both' | 'r'> = { 'only-left': 'l', both: 'both', 'only-right': 'r' }

export function Regions() {
  const beat = useBeats(SCHEDULE.length)
  const b = SCHEDULE[beat - 1]
  const r = b.kind === 'intro' ? 0 : b.r
  const round = ROUNDS[r]
  const [picks, setPicks] = useState<number[]>(ROUNDS.map(() => -1))
  const pick = picks[r]
  const setPick = (p: number) => setPicks((ps) => ps.map((v, j) => (j === r ? p : v)))
  const done = b.kind === 'step' ? b.s + 1 : b.kind === 'verdict' ? round.steps.length : 0 /* steps run so far */
  const ran = round.steps.slice(0, done)
  const shade: { l?: Shade; both?: Shade; r?: Shade } = {}
  const tones: Record<string, ChipTone> = {}
  for (const st of ran) {
    const k = REGION[st.region]
    if (!k) continue
    shade[k] = st.kept ? 'lit' : 'grey'
    for (const n of st.items) tones[n] = st.kept ? 'lit' : 'grey'
  }
  const printed = ran.length ? ran[ran.length - 1].printed : ''
  const err = /Error/.test(printed)
  const sd = sides(round.program)
  /* round 4: the right side is a list literal, drawn as a list beside the one circle */
  const listLit = round.program.match(/^result = \w+ . (\[.*\])$/m)?.[1] ?? null
  const right = round.options.indexOf(round.answer)
  const shown = b.kind === 'verdict'
  const caption = b.kind === 'step' ? round.steps[b.s].caption : shown ? round.because : null
  return (
    <>
      <RoundFrame
        intro={b.kind === 'intro' ? G1.data.intro : null}
        head={
          <div className="flex flex-col gap-1">
            <span className="font-heading text-[16px] font-bold" style={{ color: colors.brandDark }}>
              Round {r + 1} of {ROUNDS.length}
            </span>
            <Ask size={19}>{round.ask}</Ask>
          </div>
        }
        code={round.program}
        rows={4}
        at={err ? sd.opLine : null}
        stop={err}
        asking={b.kind === 'ask'}
        running={b.kind === 'step'}
        vote={<Vote key={`v${r}`} options={round.options} right={right} shown={shown} pick={pick} setPick={setPick} template={round.options.some((o) => o.length > 4) ? '1fr 1fr 1.7fr' : undefined} size={18} nowrap dense />}
        picture={
          <Swap k={r}>
            {listLit ? (
              <div className="flex items-center gap-4">
                <Venn W={200} H={VH} L={ONE} R={null} left={{ code: sd.left, items: round.left }} shade={shade} tones={tones} fs={12} />
                <ListBox items={namesOf(listLit)} bounce={err} />
              </div>
            ) : (
              <Venn W={VW} H={VH} L={G.L} R={G.R} left={{ code: sd.left, items: round.left }} right={{ code: sd.right, items: round.right }} shade={shade} tones={tones} fs={12} />
            )}
          </Swap>
        }
        caption={caption}
        rule={shown}
        out={printed ? [{ text: printed, tone: err ? 'error' : 'plain' }] : []}
        verdict={<WhyLines on={shown} cols={/Error/.test(round.output) ? 2 : 1} rows={round.options.filter((o) => o !== round.answer).map((o) => ({ opt: o, why: round.why[o] ?? '' }))} />}
        wideOut={/Error/.test(round.output)}
      />
      {shown && pick === right && <Confetti seed={40 + r} />}
      <StepControls at={beat} total={SCHEDULE.length} />
    </>
  )
}
