import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { useInstant } from '@/motion/instant'
import { StepControls } from './controls'
import { Group, Lines } from './common'
import { Ask, sentences } from './pieces'
import { StepCaption } from './trace'
import { flyFrom } from './rows'
import { SPEC } from './spec'

/**
 * RECAP: ERROR, OR RUNS FINE? Spec card S-RECAP, seven presses, format
 * "sort". Session 26's sort, on last class's sets.
 *
 * Teja's Close Friends line and six code chips in a tray; two bins under
 * them. Press 1 is the question (the room writes E or R for all six first).
 * Each press after it files one chip into its bin, flying from its place in
 * the tray; beside the line, the chip that ran, what Python said, and its why
 * line. An error chip carries its full error line into the bin (its must
 * line). Every chip was run on CPython 3.12.3.
 */
const R = SPEC['S-RECAP']
type ChipData = { line: string; bin: string; output: string; why: string }
const CHIPS: ChipData[] = R.data.chips
const BINS: string[] = R.data.bins

/** A code chip: mono, white, a hairline. `ghost` is the dashed place a chip left. */
function CodeChip({ children, ghost = false, refEl, small = false }: { children: ReactNode; ghost?: boolean; refEl?: (el: HTMLSpanElement | null) => void; small?: boolean }) {
  return (
    <span
      ref={refEl}
      className={`inline-flex h-[36px] items-center whitespace-nowrap rounded-lg px-3 font-mono ${small ? 'text-[14px]' : 'text-[15px]'} font-semibold`}
      style={{
        background: ghost ? 'transparent' : colors.white,
        color: ghost ? 'transparent' : colors.brandDark,
        boxShadow: ghost ? 'none' : `inset 0 0 0 1.5px ${colors.line}, 0 4px 10px -8px rgba(16,32,58,0.35)`,
        outline: ghost ? `1.5px dashed ${colors.line}` : 'none',
        outlineOffset: -1.5,
      }}
    >
      {children}
    </span>
  )
}

/** A chip that has just been filed: it flies in from where it was, its error line under it. */
function Filed({ c, from, fly }: { c: ChipData; from: HTMLElement | null; fly: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const instant = useInstant()
  useLayoutEffect(() => {
    if (fly && !instant) flyFrom(ref.current, from, 820)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div ref={ref} className="flex items-center gap-2.5">
      <CodeChip small>{c.line}</CodeChip>
      {c.output && (
        <span className="whitespace-nowrap font-mono text-[12.5px] font-semibold" style={{ color: colors.danger }}>
          {c.output}
        </span>
      )}
    </div>
  )
}

export function RecapSort() {
  const beat = useBeats(7)
  const filed = beat - 1 /* chips filed so far */
  const cur = filed >= 1 ? CHIPS[filed - 1] : null
  const tray = useRef<(HTMLSpanElement | null)[]>([])
  const tween = useTween(420)
  const err = !!cur?.output
  return (
    <>
      <div className="flex flex-col gap-2.5">
        {/* fixed sizes on every step (user, 2026-10-08, slide 3): the row and the bins never grow, and the card ends well clear of Next and Autoplay */}
        <div className="flex items-stretch gap-3" style={{ height: 226 }}>
          <Group className="flex w-[560px] shrink-0 flex-col gap-1.5" active={beat === 1}>
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[16px] font-semibold" style={{ color: colors.body }}>
                <Lines lines={sentences(R.show[0])} />
              </span>
              <Ask size={19}>{R.show[1]}</Ask>
            </div>
            <span className="self-start rounded-lg px-3 py-1.5 font-mono text-[16px] font-semibold" style={{ background: colors.night2, color: colors.white }}>
              {R.data.base}
            </span>
            <div className="flex h-[58px] shrink-0 flex-col items-start justify-center gap-1">
              {cur && (
                <>
                  <span key={cur.line} className="sm-bump whitespace-nowrap rounded-lg bg-white px-3 py-0.5 font-mono text-[17px] font-bold" style={{ color: colors.brandDark, boxShadow: `inset 0 0 0 2px ${colors.brand}` }}>
                    {cur.line}
                  </span>
                  <span key={`o-${cur.line}`} className="sm-bump whitespace-nowrap font-mono text-[14px] font-bold" style={{ color: err ? colors.danger : colors.success }}>
                    {err ? cur.output : 'no error'}
                  </span>
                </>
              )}
            </div>
            <div className="h-[64px] shrink-0">
              <StepCaption text={cur?.why ?? null} tone="rule" size={16} minH={64} />
            </div>
          </Group>
          {/* the tray: a chip that has been filed leaves a dashed place behind */}
          <Group className="grid min-w-0 flex-1 grid-cols-2 content-center gap-x-3 gap-y-2.5" active={beat > 1}>
            {CHIPS.map((c, i) => (
              <span key={c.line}>
                <CodeChip ghost={i < filed} refEl={(el) => (tray.current[i] = el)}>
                  {c.line}
                </CodeChip>
              </span>
            ))}
          </Group>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {BINS.map((b, k) => {
            const lit = cur ? BINS.indexOf(cur.bin) === k : false
            return (
              <div key={b} className="flex h-[172px] flex-col gap-2 rounded-card px-3 pb-3 pt-2" style={{ background: colors.surface2, boxShadow: `inset 0 0 0 ${lit ? 3 : 2}px ${lit ? (k === 0 ? colors.danger : colors.success) : colors.line}`, transition: tween }}>
                <span className="font-heading text-[17px] font-bold" style={{ color: k === 0 ? colors.danger : '#137A3A' }}>
                  {b}
                </span>
                {CHIPS.slice(0, filed).map((c, i) =>
                  BINS.indexOf(c.bin) === k ? <Filed key={c.line} c={c} from={tray.current[i]} fly={i === filed - 1} /> : null,
                )}
              </div>
            )
          })}
        </div>
      </div>
      <StepControls at={beat} total={7} />
    </>
  )
}
