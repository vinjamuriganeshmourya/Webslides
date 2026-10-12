import { useState } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { sentences } from './pieces'
import { OpIcon } from './venn'
import { SPEC } from './spec'

/**
 * KEY TAKEAWAYS: TODAY, IN SIX EXAMPLES. Spec card K1, seven presses (six
 * until the view fixes of 2026-10-09: example 6's result then stayed at ?
 * once Next went grey, so a seventh press now fills it like the other five).
 *
 * Six real programs from today, each with what it prints and the rule it
 * shows: examples, not a concept map. All six rows are there from press 1,
 * empty and numbered (its must line). Each press fills one slot's heading and
 * code; its result waits for the room. Once the room has said it, a click on
 * the result fills it with its sentence; the next press fills it too, so a
 * clicker alone never leaves one empty behind. Each slot carries the two
 * circles from the hook, small, with the parts its operation keeps (the
 * card's play line); the error example's circles stay empty. Code and results
 * are the spec's, run on CPython 3.12.3.
 */
const K1 = SPEC.K1
type Ex = { file: string; src: string; output: string }
const EXAMPLES: Ex[] = K1.code
const HEADS: string[] = (K1.show as string[]).filter((_, i) => i % 2 === 0)
const SENTENCES: string[] = (K1.show as string[]).filter((_, i) => i % 2 === 1)
const ICONS = ['|', '&', '-', '^', 'sub', 'none'] as const

/** The result: until it fills, a dashed slot that asks the room. */
function Result({ text, on, onReveal }: { text: string; on: boolean; onReveal: () => void }) {
  const tween = useTween(480)
  return (
    <button
      type="button"
      disabled={on}
      onClick={onReveal}
      onKeyDown={(e) => e.key !== 'Enter' && e.key !== ' ' && e.currentTarget.blur()}
      className="grid min-w-[40px] self-start rounded-md px-2 py-0.5 text-left font-mono text-[13px] font-bold leading-[18px]"
      style={{ background: on ? `${colors.success}1A` : 'transparent', color: colors.ink, boxShadow: on ? `inset 0 0 0 1.5px ${colors.success}` : 'none', outline: on ? 'none' : `1.5px dashed ${colors.line}`, outlineOffset: -1.5, transition: tween, cursor: on ? 'default' : 'pointer' }}
    >
      <div className="col-start-1 row-start-1 whitespace-pre" style={{ opacity: on ? 1 : 0, transition: tween, color: /Error/.test(text) ? colors.danger : colors.ink }}>
        {text}
      </div>
      {!on && (
        <span className="col-start-1 row-start-1 self-center whitespace-nowrap font-sans text-[13px] font-semibold italic" style={{ color: colors.muted }}>
          ?
        </span>
      )}
    </button>
  )
}

/** One example as a row: its number, heading and rule sentence; its picture; its code and what it prints. */
function Slot({ n, ex, filled, said, onReveal }: { n: number; ex: Ex; filled: boolean; said: boolean; onReveal: () => void }) {
  const tween = useTween(480)
  return (
    <div
      className="flex h-[64px] items-center gap-4 rounded-card px-3"
      style={{
        background: filled ? colors.white : 'transparent',
        boxShadow: filled ? `inset 0 0 0 1.5px ${colors.line}, 0 6px 14px -8px rgba(16,32,58,0.16)` : `inset 0 0 0 2px ${colors.line}`,
        transition: tween,
      }}
    >
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[14px] font-bold" style={{ background: filled ? colors.brandDark : colors.surface2, color: filled ? colors.white : colors.muted, transition: tween }}>
        {n + 1}
      </span>
      <div className="flex w-[352px] shrink-0 flex-col" style={{ opacity: filled ? 1 : 0, transition: tween }}>
        <span className="whitespace-nowrap font-heading text-[15px] font-bold leading-[20px]" style={{ color: colors.ink }}>
          {HEADS[n]}
        </span>
        <span className="text-[13px] font-semibold leading-[17px]" style={{ color: colors.body, opacity: said ? 1 : 0, transition: tween }}>
          <Lines lines={sentences(SENTENCES[n])} />
        </span>
      </div>
      <span className="shrink-0" style={{ opacity: said ? 1 : 0, transition: tween }}>
        <OpIcon op={ICONS[n]} size={50} on={ICONS[n] !== 'none'} />
      </span>
      {filled && (
        <div className="sm-bump flex min-w-0 flex-1 flex-col gap-1">
          <span className="self-start whitespace-pre rounded-md px-2.5 py-0.5 font-mono text-[13px] leading-[19px]" style={{ background: colors.night2, color: colors.white }}>
            {ex.src}
          </span>
          <Result text={ex.output} on={said} onReveal={onReveal} />
        </div>
      )}
    </div>
  )
}

export function Takeaways() {
  const beat = useBeats(7)
  const [revealed, setRevealed] = useState<boolean[]>(EXAMPLES.map(() => false))
  return (
    <>
      <div className="flex flex-col gap-1.5">
        {EXAMPLES.map((ex, i) => (
          <Slot key={ex.file} n={i} ex={ex} filled={beat >= i + 1} said={beat > i + 1 || revealed[i]} onReveal={() => setRevealed((r) => r.map((v, j) => (j === i ? true : v)))} />
        ))}
      </div>
      <StepControls at={beat} total={7} />
    </>
  )
}
