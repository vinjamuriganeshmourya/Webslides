import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { Focus, Group, Lines } from './common'
import { Ask, Fresh, OutPanel, sentences, type OutLine, CODE_FS, OUT_FS } from './pieces'
import { CodePane, StepCaption } from './trace'

/**
 * THE FRAME EVERY BOARD CARD OF PF 29 SHARES (generate-slides 2b: one
 * cluster, one container; the part the room works on lights).
 *
 *   left, 730px   the program (wide enough for the 71-character full menu
 *                 line at CODE_FS 15) with its question and vote in one
 *                 group; the output and the deck's sentence in a second
 *   right         Anna's board in its own group, the step caption under it
 *
 * Both columns keep one height on every press (user, 2026-10-08, slides 3
 * and 23 of session 28), so nothing ever reaches Next or Autoplay: the body
 * box is y 221 to 652 and Next sits at 661.
 */
export const CARD_H = 431
export const CODE_W = 730

export function BoardCard({
  code,
  codeKey,
  rows,
  at,
  stop,
  highlight,
  mark,
  asking = false,
  ask,
  vote,
  out,
  outTitle = 'Output',
  outMinRows = 1,
  outEmpty,
  note,
  board,
  boardActive = false,
  boardExtra,
  caption,
  badge,
  captionTone = 'step',
  captionMinH = 56,
  after,
  codeW = CODE_W,
}: {
  code: string
  /** a changed program eases in (`Fresh`) */
  codeKey?: string | number
  rows?: number
  at?: number | null
  stop?: boolean
  highlight?: number
  mark?: number[]
  asking?: boolean
  ask?: ReactNode
  vote?: ReactNode
  out: OutLine[]
  outTitle?: string
  outMinRows?: number
  outEmpty?: ReactNode
  /** the deck's own sentence or the rule, under the output */
  note?: ReactNode
  board: ReactNode
  boardActive?: boolean
  /** something beside the board in its group (a total box, Anna) */
  boardExtra?: ReactNode
  caption?: string | null
  badge?: string | null
  captionTone?: 'step' | 'rule'
  captionMinH?: number
  /** a block under the output group (why lines) */
  after?: ReactNode
  codeW?: number
}) {
  return (
    <div className="flex items-stretch gap-3" style={{ height: CARD_H }}>
      <div className="flex shrink-0 flex-col gap-2.5" style={{ width: codeW }}>
        <Group pad={10} active={asking} className="flex flex-col gap-2.5">
          <Focus on={asking}>
            <Fresh k={codeKey ?? code}>
              <CodePane code={code} fontSize={CODE_FS} rows={rows ?? code.split('\n').length} at={at ?? null} stop={stop} highlight={highlight} mark={mark} />
            </Fresh>
          </Focus>
          {ask && (typeof ask === 'string' ? <Ask size={19}>{ask}</Ask> : ask)}
          {vote}
        </Group>
        <Group pad={10} className="flex min-h-0 flex-1 flex-col gap-2">
          <OutPanel title={outTitle} lines={out} minRows={outMinRows} fontSize={OUT_FS} empty={outEmpty} />
          {note}
        </Group>
        {after}
      </div>
      <Group pad={10} className="flex min-w-0 flex-1 flex-col gap-2" active={boardActive}>
        <div className="flex min-h-0 flex-1 items-start gap-3 pt-4">
          {board}
          {boardExtra}
        </div>
        <StepCaption badge={badge} text={caption ?? null} tone={captionTone} size={16} minH={captionMinH} />
      </Group>
    </div>
  )
}

/** The deck's own sentence under an output, in the rule tone, one sentence per line (rule 36). */
export function DeckLine({ text, on = true, size = 16 }: { text: string | string[]; on?: boolean; size?: number }) {
  const lines = (Array.isArray(text) ? text : [text]).flatMap(sentences)
  return (
    <div className="rounded-xl px-4 py-2 font-semibold leading-snug" style={{ fontSize: size, background: colors.surface2, color: colors.ink, boxShadow: `inset 4px 0 0 ${colors.brandDark}`, opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(6px)', transition: 'opacity 480ms cubic-bezier(0.22,1,0.36,1), transform 480ms cubic-bezier(0.22,1,0.36,1)' }}>
      <Lines lines={lines} />
    </div>
  )
}

/** The verdict's lines for the wrong options: the option, and why it is not (from session 28's Regions). */
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

/** `Round n of m` over the round's question. */
export function RoundHead({ n, of, ask }: { n: number; of: number; ask: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-heading text-[16px] font-bold" style={{ color: colors.brandDark }}>
        Round {n} of {of}
      </span>
      <Ask size={19}>{ask}</Ask>
    </div>
  )
}

/** The schedule both games share: the intro, then per round the ask, one press per step, the verdict. */
export type Beat = { kind: 'intro' } | { kind: 'ask' | 'verdict'; r: number } | { kind: 'step'; r: number; s: number }
export function schedule(rounds: { steps: unknown[] }[]): Beat[] {
  return [{ kind: 'intro' }, ...rounds.flatMap((rd, r): Beat[] => [{ kind: 'ask', r }, ...rd.steps.map((_, s): Beat => ({ kind: 'step', r, s })), { kind: 'verdict', r }])]
}

/** The intro card of a game: one line, large, in its own group. */
export function Intro({ text }: { text: string }) {
  return (
    <Group pad={28} className="flex min-h-[300px] flex-col items-start justify-center gap-4">
      <Ask size={32}>{text}</Ask>
    </Group>
  )
}

export { OUT_FS }
