import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats } from '@/ui'
import { StepControls } from './controls'
import { Focus, Group, Lines } from './common'
import { Confetti, Glow } from './motion'
import { Ask, OutPanel, sentences, CODE_FS, OUT_FS, type OutLine } from './pieces'
import { CodePane, StepCaption, Vote } from './trace'
import { Board, type Row, type RowTone, type SheetSpec, type TagSpec } from './sheet'
import { SPEC } from './spec'

/**
 * GAME G1 · CHANGE OR MOVE? Twenty-one presses: the intro, then four rounds
 * of the ask, one press per line and the verdict.
 *
 *   - The program and the vote on top; the tags and sheets under them.
 *   - Nothing moves until the press after the vote. When a line changes the
 *     sheet in place, the sheet changes where it stands and no tag moves.
 *     When a line makes a new sheet, the new sheet is drawn new and the old
 *     one stays, for as long as a name points at it.
 *   - Round 3: clear() through a second name, both tags on one empty sheet.
 *     Round 4: `trip = {}` draws a new empty sheet and moves only trip's tag;
 *     backup keeps the full sheet.
 *   - The verdict prints backup, marks the right option and gives a line for
 *     every wrong one.
 * Every program, step, caption and why line is the spec's, run on CPython
 * 3.12.3.
 */
const G1 = SPEC.G1
type Dict = Record<string, number>
type Step = { caption: string; line: number; a: Dict; b: Dict | null; same: boolean }
type Round = { ask: string; program: string; output: string; options: string[]; answer: string; because: string; why: Record<string, string>; steps: Step[] }
const ROUNDS: Round[] = G1.data.rounds

export type Beat = { kind: 'intro' } | { kind: 'ask' | 'verdict'; r: number } | { kind: 'step'; r: number; s: number }
export function schedule(rounds: { steps: unknown[] }[], intro: boolean): Beat[] {
  return [...(intro ? [{ kind: 'intro' } as Beat] : []), ...rounds.flatMap((rd, r): Beat[] => [{ kind: 'ask', r }, ...rd.steps.map((_, s): Beat => ({ kind: 'step', r, s })), { kind: 'verdict', r }])]
}
const SCHEDULE = schedule(ROUNDS, true)

/**
 * The frame both games share: the program and the vote on top, the picture
 * with its caption, output and verdict under them (generate-slides 2b: one
 * cluster, one container; the part the room works on lights).
 */
export function GameFrame({
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
  pictureW,
  caption,
  rule,
  out,
  verdict,
  wideOut = false,
  compactOut = false,
  codeW = 420,
  topH,
  bottomH,
  captionH = 44,
}: {
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
  /** the picture's column, fixed so a sheet that arrives moves nothing beside it */
  pictureW: number
  caption: string | null
  rule?: boolean
  out: OutLine[]
  verdict?: ReactNode
  /** an error line needs the whole width; the why lines then go under it */
  wideOut?: boolean
  /** the output as one labelled line instead of the panel (G2: a five-line program over it leaves no room) */
  compactOut?: boolean
  codeW?: number
  /** explicit heights, chosen for the card's tallest press (user, 2026-10-12: a box never grows with its content) */
  topH?: number
  bottomH?: number
  captionH?: number
}) {
  if (intro !== null)
    return (
      <Group pad={28} className="flex min-h-[300px] flex-col items-start justify-center gap-4">
        <Ask size={32}>{intro}</Ask>
      </Group>
    )
  return (
    <div className="flex flex-col gap-2.5">
      <Group pad={10} className="flex items-stretch gap-4" style={{ height: topH }} active={asking}>
        <div className="shrink-0" style={{ width: codeW }}>
          <Focus on={asking}>
            <CodePane code={code} fontSize={CODE_FS} rows={rows} at={at ?? null} stop={stop} />
          </Focus>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2.5">
          {head}
          {vote}
        </div>
      </Group>
      <Group pad={8} className="flex items-start gap-4" style={{ height: bottomH }} active={running}>
        <div className="flex shrink-0 items-center justify-center" style={{ width: pictureW }}>
          {picture}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <StepCaption text={caption} tone={rule ? 'rule' : 'step'} size={16} minH={captionH} />
          {compactOut ? (
            <OutRow lines={out} />
          ) : (
            <div className="flex items-start gap-3">
              <OutPanel lines={out} minRows={1} fontSize={OUT_FS} className={wideOut ? 'min-w-0 flex-1' : 'w-[250px] shrink-0'} />
              {!wideOut && <div className="min-w-0 flex-1">{verdict}</div>}
            </div>
          )}
          {(wideOut || compactOut) && verdict}
        </div>
      </Group>
    </div>
  )
}

/** The output as one row: the label, then what printed, in a chip that lights when a line lands (rule 43: its own bounds). */
function OutRow({ lines }: { lines: OutLine[] }) {
  const has = lines.length > 0
  const err = lines.some((l) => l.tone === 'error')
  /* a long error line never clips and never wraps: the chip's type steps down until it fits its row (the output panel's own rule) */
  const chip = useRef<HTMLSpanElement>(null)
  const [fit, setFit] = useState(15)
  const sig = lines.map((l) => l.text).join('|')
  useLayoutEffect(() => {
    const el = chip.current
    if (!el || !el.parentElement) return
    const avail = el.parentElement.parentElement!.clientWidth - 130
    const need = el.scrollWidth * (15 / fit)
    setFit(need > avail && need > 0 ? Math.max(11, Math.floor((15 * avail) / need * 10) / 10) : 15)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig])
  return (
    <div className="flex h-[34px] items-center gap-3">
      <span className="flex shrink-0 items-center gap-2 font-heading text-[14px] font-bold uppercase tracking-wider" style={{ color: colors.body }}>
        <span className="inline-block h-3 w-3 rounded-full" style={{ background: colors.success }} />
        Output
      </span>
      <Glow on={has} pulse={lines.map((l) => l.text).join('|')} color={err ? colors.danger : colors.success} style={{ minWidth: 120 }}>
        <span ref={chip} className="flex h-[32px] min-w-[120px] items-center whitespace-pre rounded-lg bg-white px-3 font-mono font-semibold" style={{ fontSize: fit, color: err ? colors.danger : colors.ink, boxShadow: `inset 0 0 0 1.5px ${has ? (err ? colors.danger : colors.success) : colors.line}` }}>
          {lines.map((l) => l.text).join('  ') || ' '}
        </span>
      </Glow>
    </div>
  )
}

/** The verdict's lines for the wrong options: the option, and why it is not. */
export function WhyLines({ on, rows, cols = 1 }: { on: boolean; rows: { opt: string; why: string }[]; cols?: number }) {
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(6px)', transition: 'opacity 480ms cubic-bezier(0.22,1,0.36,1), transform 480ms cubic-bezier(0.22,1,0.36,1)' }}>
      {rows.map((r) => (
        <div key={r.opt} className="flex flex-col items-start gap-0.5 rounded-lg bg-white px-3 py-1" style={{ boxShadow: `inset 0 0 0 1px ${colors.line}` }}>
          <span className="shrink-0 whitespace-nowrap font-mono text-[12.5px] font-bold leading-[18px]" style={{ color: colors.danger }}>
            {r.opt}
          </span>
          <span className="text-[13px] font-semibold leading-[18px]" style={{ color: colors.body }}>
            <Lines lines={sentences(r.why)} />
          </span>
        </div>
      ))}
    </div>
  )
}

export function RoundHead({ r, n, ask }: { r: number; n: number; ask: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-heading text-[16px] font-bold" style={{ color: colors.brandDark }}>
        Round {r + 1} of {n}
      </span>
      <Ask size={19}>{ask}</Ask>
    </div>
  )
}

const TITLE = 'Ooty trip money'
const COPY_TITLE = `Copy of ${TITLE}`
const NEW_TITLE = 'Untitled spreadsheet'
const rowsOf = (d: Dict): Row[] => Object.entries(d)

/**
 * The picture after `upTo` steps of a round: which tag points at which sheet,
 * and what each sheet holds. The first sheet is Divya's; a second sheet
 * appears when a line makes one (copy(), or `trip = {}`), and whichever name
 * that line assigned owns it.
 */
function pictureOf(steps: Step[], upTo: number): { sheets: SheetSpec[]; tags: TagSpec[] } {
  let s1: Row[] = []
  let s2: Row[] | null = null
  let owner: 'a' | 'b' | null = null
  let tags: TagSpec[] = []
  let prev1: Row[] | null = null
  let prev2: Row[] | null = null
  let arrived = false
  for (let k = 0; k <= upTo; k++) {
    const st = steps[k]
    prev1 = s1
    prev2 = s2
    arrived = false
    if (st.b === null) {
      s1 = rowsOf(st.a)
      tags = [{ name: 'trip', to: 'S1' }]
    } else if (st.same) {
      s1 = rowsOf(st.a)
      tags = [
        { name: 'trip', to: 'S1' },
        { name: 'backup', to: 'S1' },
      ]
    } else {
      if (!owner) {
        owner = k === 0 || steps[k - 1].b === null ? 'b' : 'a'
        arrived = true
      }
      s2 = rowsOf(owner === 'a' ? st.a : st.b)
      s1 = rowsOf(owner === 'a' ? st.b : st.a)
      tags = owner === 'a' ? [{ name: 'trip', to: 'S2' }, { name: 'backup', to: 'S1' }] : [{ name: 'trip', to: 'S1' }, { name: 'backup', to: 'S2' }]
    }
  }
  const hot = (now: Row[], before: Row[] | null): Record<string, RowTone> => {
    const t: Record<string, RowTone> = {}
    if (!before) return t
    for (const [n, a] of now) {
      const b = before.find(([m]) => m === n)
      if (b && b[1] !== a) t[n] = 'hot'
    }
    return t
  }
  const sheets: SheetSpec[] = [{ id: 'S1', title: TITLE, rows: s1, tones: hot(s1, prev1) }]
  if (s2) sheets.push({ id: 'S2', title: owner === 'b' ? COPY_TITLE : NEW_TITLE, rows: s2, tones: hot(s2, prev2), stagger: arrived })
  return { sheets, tags }
}

const PICTURE_W = 382

export function ChangeOrMove() {
  const beat = useBeats(SCHEDULE.length)
  const b = SCHEDULE[beat - 1]
  const r = b.kind === 'intro' ? 0 : b.r
  const round = ROUNDS[r]
  const [picks, setPicks] = useState<number[]>(ROUNDS.map(() => -1))
  const pick = picks[r]
  const setPick = (p: number) => setPicks((ps) => ps.map((v, j) => (j === r ? p : v)))
  const done = b.kind === 'step' ? b.s + 1 : b.kind === 'verdict' ? round.steps.length : 0
  const pic = done > 0 ? pictureOf(round.steps, done - 1) : { sheets: [] as SheetSpec[], tags: [] as TagSpec[] }
  const shown = b.kind === 'verdict'
  const right = round.options.indexOf(round.answer)
  const caption = b.kind === 'step' ? round.steps[b.s].caption : shown ? round.because : null
  const at = b.kind === 'step' ? round.steps[b.s].line : shown ? 4 : null
  return (
    <>
      <GameFrame
        intro={b.kind === 'intro' ? G1.data.intro : null}
        head={<RoundHead r={r} n={ROUNDS.length} ask={round.ask} />}
        code={round.program}
        rows={4}
        at={at}
        bottomH={202}
        captionH={64}
        asking={b.kind === 'ask'}
        running={b.kind === 'step'}
        vote={<Vote key={`v${r}`} options={round.options} right={right} shown={shown} pick={pick} setPick={setPick} template={round.options.length === 3 ? '0.7fr 2.6fr 1.2fr' : undefined} size={16} nowrap dense />}
        picture={done > 0 ? <Board key={`b${r}`} size="sm" gap={30} minRows={2} sheets={pic.sheets} tags={pic.tags} /> : <div style={{ height: 158 }} />}
        pictureW={PICTURE_W}
        caption={caption}
        rule={shown}
        out={shown ? [{ text: round.output }] : []}
        verdict={<WhyLines on={shown} rows={round.options.filter((o) => o !== round.answer).map((o) => ({ opt: o, why: round.why[o] ?? '' }))} />}
      />
      {shown && pick === right && <Confetti seed={40 + r} />}
      <StepControls at={beat} total={SCHEDULE.length} />
    </>
  )
}
