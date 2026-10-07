import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { CodeBlock, TraceCaption, useBeats, useTween, type CodeLineState } from '@/ui'
import { StepControls } from './controls'
import { OutputPanel } from '@/ui/CodeOutput'
import { Ask, BeatFade, Definition } from './common'
import { Glow } from './motion'

/**
 * ONE STRING METHOD, TAUGHT IN BEATS. PF 15 slides 15, 17, 23, 24 and 26.
 *
 * The reference builds all five the same way, and so does this:
 *
 *   the program on the left, what it printed on the right (empty until the press)
 *   under it, the method's own figure: what it looked at, character by character
 *   then the blue question, or once it has a name, the definition band
 *   and at the foot, the one-line prompt for the room
 *
 * Predict first, name second (content rule 23): the output and the definition
 * never arrive on the beat that asks the question. The code box is the same size
 * on all five (`rows={3}`), so moving from one method to the next changes the
 * code and nothing else.
 *
 * Every output below is a real run on CPython 3.12.3.
 */
export interface MethodBeat {
  code: string
  lines: Record<number, CodeLineState>
  out: string
  figure: ReactNode
  ask?: ReactNode
  /** The definition: [signature, sentence]. Once shown it stays. */
  def?: [ReactNode, ReactNode]
  hint: ReactNode
}

export function MethodCard({ beats }: { beats: MethodBeat[] }) {
  const at = useBeats(beats.length)
  const b = beats[at - 1]
  const tween = useTween(420)
  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-stretch gap-6">
          <div className="w-[600px] shrink-0">
            <CodeBlock code={b.code} filename="Python" chip={false} fontSize={20} rows={3} lines={b.lines} />
          </div>
          {/* The output is the code's own result, so it is set at the code's size
              and stretches to the code panel's height: one row, two halves. */}
          <div className="min-w-0 flex-1" style={{ transition: tween }}>
            {/* the press that runs the program lights the panel that received its output */}
            <Glow on={b.out !== ''} className="h-full">
              <OutputPanel output={b.out} fontSize={20} className="h-full" />
            </Glow>
          </div>
        </div>
        {/* The figure supports the code; it sits a step below it in size. */}
        <div className="flex min-h-[58px] items-center">{b.figure}</div>
        {b.def ? (
          <Definition sig={b.def[0]}>{b.def[1]}</Definition>
        ) : b.ask ? (
          <Ask size={22}>{b.ask}</Ask>
        ) : null}
        <BeatFade beatKey={at}>
          <TraceCaption>{b.hint}</TraceCaption>
        </BeatFade>
      </div>
      <StepControls at={at} total={beats.length} />
    </>
  )
}

/* ------------------------------------------------------------------ figures */

/** A row of character tiles with an optional tick or cross under each. */
export function Tiles({
  chars,
  look = 'plain',
  marks,
  gone = [],
}: {
  chars: string[]
  look?: 'plain' | 'ok' | 'hit' | ((i: number) => 'plain' | 'ok' | 'bad' | 'hit')
  marks?: ('✓' | '✗' | undefined)[]
  gone?: number[]
}) {
  const tween = useTween(420)
  return (
    <div className="flex items-start gap-2">
      {chars.map((c, i) => {
        const l = typeof look === 'function' ? look(i) : look
        const isGone = gone.includes(i)
        const ring = l === 'ok' ? colors.success : l === 'bad' ? colors.danger : l === 'hit' ? colors.brandDark : colors.line
        const bg = l === 'ok' ? '#E9F8EF' : l === 'bad' ? '#FDECEC' : l === 'hit' ? colors.surface2 : colors.white
        return (
          <div key={i} className="flex flex-col items-center" style={{ transition: tween, opacity: isGone ? 0 : 1, width: isGone ? 0 : 44, marginRight: isGone ? -8 : 0 }}>
            <span
              className="grid h-[48px] w-[44px] place-items-center rounded-xl font-mono text-[23px] font-semibold"
              style={{ background: bg, border: `2px solid ${ring}`, color: c === ' ' ? colors.muted : l === 'bad' ? colors.danger : colors.ink, transition: tween }}
            >
              {c === ' ' ? '·' : c}
            </span>
            {marks && (
              <span className="h-[18px] text-[16px] font-bold leading-[18px]" style={{ color: marks[i] === '✗' ? colors.danger : colors.success }}>
                {marks[i] ?? ''}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

/** Word chips for replace: each `teh` shows `the` once it has been swapped. */
export function WordSwap({ words, swapped }: { words: string[]; swapped: boolean }) {
  const tween = useTween(420)
  return (
    <div className="flex items-center gap-3">
      {words.map((w, i) => {
        const wrong = w === 'teh'
        const fixed = wrong && swapped
        return (
          <span
            key={i}
            className="rounded-xl px-4 py-1.5 font-mono text-[23px] font-semibold"
            style={{
              transition: tween,
              background: fixed ? '#E9F8EF' : wrong ? '#FDECEC' : colors.white,
              color: fixed ? '#137A3A' : wrong ? colors.danger : colors.ink,
              boxShadow: `inset 0 0 0 2px ${fixed ? colors.success : wrong ? colors.danger : colors.line}`,
            }}
          >
            {fixed ? 'the' : w}
          </span>
        )
      })}
    </div>
  )
}

/** startswith: the front of the string boxed, the rest greyed, and what it compares. */
export function FrontCheck({ front, rest, same }: { front: string; rest: string; same: boolean }) {
  const tween = useTween(420)
  return (
    <div className="flex items-center gap-8">
      <p className="font-mono text-[24px] font-semibold">
        <span className="rounded-xl px-3 py-1" style={{ background: '#E9F8EF', color: '#137A3A', boxShadow: `inset 0 0 0 2px ${colors.success}` }}>
          {front}
        </span>
        <span className="ml-1" style={{ color: colors.muted }}>{rest}</span>
      </p>
      <p className="flex items-center gap-3 text-[18px] font-semibold" style={{ color: colors.muted }}>
        it compares
        <span className="font-mono text-[22px] font-bold" style={{ color: '#137A3A' }}>"{front}"</span>
        <span
          className="rounded-pill px-3 py-1 text-[16px] font-bold uppercase tracking-wider"
          style={{ background: '#E3F6EA', color: '#137A3A', opacity: same ? 1 : 0, transition: tween }}
        >
          same
        </span>
      </p>
    </div>
  )
}
