import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { Focus, Group, Lines } from './common'
import { Glow } from './motion'
import { Ask, OutPanel, sentences, CODE_FS, OUT_FS, type OutLine } from './pieces'
import { CodePane, StepCaption } from './trace'
import type { Mark } from './Code'

/**
 * THE FRAME BOTH GAMES SHARE (session 28's, carried through 30 as part of
 * `ChangeOrMove.tsx`; PF 31 keeps it in a file of its own so neither game
 * imports a leftover figure): the program and the vote on top, the picture
 * with its caption, output and verdict under them (generate-slides 2b: one
 * cluster, one container; the part the room works on lights).
 */
export type Beat = { kind: 'intro' } | { kind: 'ask' | 'verdict'; r: number } | { kind: 'step'; r: number; s: number }
export function schedule(rounds: { steps: unknown[] }[], intro: boolean): Beat[] {
  return [...(intro ? [{ kind: 'intro' } as Beat] : []), ...rounds.flatMap((rd, r): Beat[] => [{ kind: 'ask', r }, ...rd.steps.map((_, s): Beat => ({ kind: 'step', r, s })), { kind: 'verdict', r }])]
}

export function GameFrame({
  intro,
  head,
  code,
  rows,
  at,
  stop,
  marks,
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
  stack = false,
}: {
  intro: string | null
  head: ReactNode
  code: string
  rows: number
  at?: number | null
  stop?: boolean
  /** PF 31: underlined names in the program (the import cards' picture, G1) */
  marks?: Record<number, Mark[]>
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
  /** the picture over the caption and output, in one column (G1: the list of tries is wide) */
  stack?: boolean
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
            <CodePane code={code} fontSize={CODE_FS} rows={rows} at={at ?? null} stop={stop} marks={marks} />
          </Focus>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2.5">
          {head}
          {vote}
        </div>
      </Group>
      <Group pad={8} className={`flex ${stack ? 'flex-col' : 'items-start'} gap-${stack ? '2' : '4'}`} style={{ height: bottomH }} active={running}>
        <div className={`flex shrink-0 items-center ${stack ? 'w-full' : 'justify-center'}`} style={stack ? undefined : { width: pictureW }}>
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
export function OutRow({ lines, label = 'Output' }: { lines: OutLine[]; label?: string }) {
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
        {label}
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
export function WhyLines({ on, rows, cols = 1, dense = false }: { on: boolean; rows: { opt: string; why: string }[]; cols?: number; /** PF 31's G2: 12px lines, so three why lines sit under the spends */ dense?: boolean }) {
  return (
    /* three columns are unequal on purpose (PF 24, content rule 38): an equal middle column centres itself in the body box beside left-aligned blocks */
    <div className="grid gap-1" style={{ gridTemplateColumns: cols === 3 ? '1.07fr 1fr 0.93fr' : `repeat(${cols}, minmax(0, 1fr))`, opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(6px)', transition: 'opacity 480ms cubic-bezier(0.22,1,0.36,1), transform 480ms cubic-bezier(0.22,1,0.36,1)' }}>
      {rows.map((r) => (
        <div key={r.opt} className={`flex flex-col items-start gap-0 rounded-lg bg-white px-3 ${dense ? 'py-0.5' : 'py-1'}`} style={{ boxShadow: `inset 0 0 0 1px ${colors.line}` }}>
          <span className="shrink-0 whitespace-nowrap font-mono font-bold" style={{ color: colors.danger, fontSize: dense ? 12 : 12.5, lineHeight: dense ? '16px' : '18px' }}>
            {r.opt}
          </span>
          <span className="font-semibold" style={{ color: colors.body, fontSize: dense ? 12 : 13, lineHeight: dense ? '15px' : '18px' }}>
            <Lines lines={sentences(r.why)} />
          </span>
        </div>
      ))}
    </div>
  )
}

export function RoundHead({ r, n, ask, askSize = 19 }: { r: number; n: number; ask: string; askSize?: number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-heading text-[16px] font-bold" style={{ color: colors.brandDark }}>
        Round {r + 1} of {n}
      </span>
      <Ask size={askSize}>{ask}</Ask>
    </div>
  )
}
