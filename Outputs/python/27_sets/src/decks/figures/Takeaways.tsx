import { useState } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { sentences } from './pieces'
import { SPEC } from './spec'

/**
 * KEY TAKEAWAYS: TODAY, IN SIX EXAMPLES. Spec card K1, seven presses (six
 * until the view fixes of 2026-10-09: tile 6's result then stayed at ? once
 * Next went grey, so a seventh press now fills it like the other five).
 *
 * Six real programs from today, each with what it prints and the rule it
 * shows: examples, not a concept map. All six slots are there from press 1,
 * empty and numbered (its must line). Each press fills one slot's heading and
 * code; its result waits for the room. Once the room has said it, a click on
 * the result fills it with its sentence; the next press fills it too, so a
 * clicker alone never leaves one empty behind. Code and results are the
 * spec's, run on CPython 3.12.3.
 */
const K1 = SPEC.K1
type Ex = { file: string; src: string; output: string }
const EXAMPLES: Ex[] = K1.code
/* `show` pairs each heading with its sentence */
const SENTENCES: string[] = (K1.show as string[]).filter((_, i) => i % 2 === 1)


function MiniCode({ src }: { src: string }) {
  return (
    <div className="relative shrink-0 rounded-lg px-3 pb-1.5 pt-4" style={{ background: colors.night2 }}>
      <span className="absolute right-2 top-0.5 text-[10.5px] font-semibold" style={{ color: colors.muted }}>
        Python
      </span>
      {/* one element per line, so a line is measured as a line */}
      <div className="font-mono text-[12.5px] leading-[15px]" style={{ color: colors.white }}>
        {src.split('\n').map((l, i) => (
          <div key={i} className="whitespace-pre">
            {l || ' '}
          </div>
        ))}
      </div>
    </div>
  )
}

/** The result: one element per printed line; until it fills, a dashed slot that asks the room. */
function Result({ text, on, onReveal, canReveal }: { text: string; on: boolean; onReveal: () => void; canReveal: boolean }) {
  const tween = useTween(480)
  return (
    <button
      type="button"
      disabled={on || !canReveal}
      onClick={onReveal}
      onKeyDown={(e) => e.key !== 'Enter' && e.key !== ' ' && e.currentTarget.blur()}
      className="grid self-start rounded-md px-2 py-0.5 text-left font-mono text-[12px] font-bold leading-[17px]"
      style={{ background: on ? `${colors.success}1A` : 'transparent', color: colors.ink, boxShadow: on ? `inset 0 0 0 1.5px ${colors.success}` : 'none', outline: on ? 'none' : `1.5px dashed ${colors.line}`, outlineOffset: -1.5, transition: tween, cursor: !on && canReveal ? 'pointer' : 'default' }}
    >
      <div className="col-start-1 row-start-1" style={{ opacity: on ? 1 : 0, transition: tween }}>
        {text.split('\n').map((l, i) => (
          <div key={i} className="whitespace-pre" style={{ color: /Error/.test(l) ? colors.danger : colors.ink }}>
            {l}
          </div>
        ))}
      </div>
      {!on && (
        <span className="col-start-1 row-start-1 self-center whitespace-nowrap font-sans text-[13px] font-semibold italic" style={{ color: colors.muted }}>
          {canReveal ? '?' : ' '}
        </span>
      )}
    </button>
  )
}

function Slot({ n, ex, filled, said, onReveal }: { n: number; ex: Ex; filled: boolean; said: boolean; onReveal: () => void }) {
  const tween = useTween(480)
  return (
    <div
      className="relative flex h-full flex-col gap-1.5 rounded-card px-3 py-2"
      style={{
        background: filled ? colors.white : 'transparent',
        boxShadow: filled ? `inset 0 0 0 1.5px ${colors.line}, 0 6px 14px -8px rgba(16,32,58,0.16)` : `inset 0 0 0 2px ${colors.line}`,
        transition: tween,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[13px] font-bold" style={{ background: filled ? colors.brandDark : colors.surface2, color: filled ? colors.white : colors.muted }}>
          {n + 1}
        </span>
        <span className="whitespace-nowrap font-heading text-[16px] font-bold leading-none" style={{ color: colors.ink, opacity: filled ? 1 : 0, transition: tween }}>
          {ex.file}
        </span>
      </div>
      {filled && (
        <div className="sm-bump flex min-h-0 flex-1 flex-col gap-1.5">
          <MiniCode src={ex.src} />
          <Result text={ex.output} on={said} onReveal={onReveal} canReveal />
          <span className="text-[13px] font-semibold leading-[16px]" style={{ color: colors.body, opacity: said ? 1 : 0, transition: tween }}>
            <Lines lines={sentences(SENTENCES[n])} />
          </span>
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
      {/* unequal outer columns, so the middle one is not read as a centred block (rule 38); the first is widest for example 1's one long line */}
      <div className="grid gap-x-3 gap-y-2.5" style={{ gridTemplateColumns: '384px 318px 352px', gridTemplateRows: '200px 200px' }}>
        {EXAMPLES.map((ex, i) => (
          <Slot
            key={ex.file}
            n={i}
            ex={ex}
            filled={beat >= i + 1}
            said={beat > i + 1 || revealed[i]}
            onReveal={() => setRevealed((r) => r.map((v, j) => (j === i ? true : v)))}
          />
        ))}
      </div>
      <StepControls at={beat} total={7} />
    </>
  )
}
