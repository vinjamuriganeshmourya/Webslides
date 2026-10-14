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
 * RECAP: DOES BACKUP CHANGE TOO? Spec card S-RECAP, six presses, format
 * "sort". Session 28's sort, on the dictionaries session's trip sheet.
 *
 * Divya's trip line, five code chips (two lines each) in a tray, two bins
 * under them. Press 1 is the question (the room writes C or S for all five
 * first). Each press after it files one chip into its bin, flying from its
 * place in the tray; beside the line, what print(backup) shows and the why
 * line. Every chip was run on CPython 3.12.3 and matches the spec.
 */
const R = SPEC['S-RECAP']
type ChipData = { lines: string; bin: string; print_backup: string; why: string }
const CHIPS: ChipData[] = R.data.chips
const BINS: string[] = R.data.bins

/** A two-line code chip: mono, white, a hairline. `ghost` is the dashed place a chip left. */
function CodeChip({ children, ghost = false, refEl, size = 13 }: { children: string; ghost?: boolean; refEl?: (el: HTMLSpanElement | null) => void; size?: number }) {
  const ls = children.split('\n')
  return (
    <span
      ref={refEl}
      className="inline-flex flex-col justify-center whitespace-nowrap rounded-lg px-2.5 font-mono font-semibold"
      style={{
        fontSize: size,
        lineHeight: `${size + 4}px`,
        height: size * 2 + 16,
        background: ghost ? 'transparent' : colors.white,
        color: ghost ? 'transparent' : colors.brandDark,
        boxShadow: ghost ? 'none' : `inset 0 0 0 1.5px ${colors.line}, 0 4px 10px -8px rgba(16,32,58,0.35)`,
        outline: ghost ? `1.5px dashed ${colors.line}` : 'none',
        outlineOffset: -1.5,
      }}
    >
      {ls.map((l, i) => (
        <span key={i} className="block">
          {l}
        </span>
      ))}
    </span>
  )
}

/** A chip that has just been filed: it flies in from where it was, what print(backup) showed beside it. */
function Filed({ c, from, fly }: { c: ChipData; from: HTMLElement | null; fly: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const instant = useInstant()
  useLayoutEffect(() => {
    if (fly && !instant) flyFrom(ref.current, from, 820)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div ref={ref} className="flex items-center gap-2.5">
      <CodeChip size={12}>{c.lines}</CodeChip>
      <span className="whitespace-nowrap font-mono text-[12px] font-semibold" style={{ color: colors.ink }}>
        {c.print_backup}
      </span>
    </div>
  )
}

function Printed({ children }: { children: ReactNode }) {
  return (
    <span className="whitespace-nowrap font-mono text-[13px] font-bold leading-[17px]" style={{ color: '#137A3A' }}>
      {children}
    </span>
  )
}

export function RecapSort() {
  const beat = useBeats(6)
  const filed = beat - 1 /* chips filed so far */
  const cur = filed >= 1 ? CHIPS[filed - 1] : null
  const tray = useRef<(HTMLSpanElement | null)[]>([])
  const tween = useTween(420)
  return (
    <>
      <div className="flex flex-col gap-2.5">
        {/* fixed sizes on every step (user, 2026-10-08): the row and the bins never grow, and the card ends well clear of Next */}
        <div className="flex items-stretch gap-3" style={{ height: 222 }}>
          <Group className="flex w-[560px] shrink-0 flex-col gap-1.5" active={beat === 1}>
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[15px] font-semibold" style={{ color: colors.body }}>
                <Lines lines={sentences(R.show[0])} />
              </span>
              <Ask size={19}>{R.show[2]}</Ask>
            </div>
            <span className="self-start rounded-lg px-3 py-1.5 font-mono text-[15px] font-semibold" style={{ background: colors.night2, color: colors.white }}>
              {R.data.base}
            </span>
            <div className="flex h-[48px] shrink-0 items-center gap-3">
              {cur && (
                <>
                  <span key={cur.lines} className="sm-bump whitespace-nowrap rounded-lg bg-white px-3 py-0.5 font-mono text-[13px] font-bold leading-[17px]" style={{ color: colors.brandDark, boxShadow: `inset 0 0 0 2px ${colors.brand}` }}>
                    {cur.lines.split('\n').map((l) => (
                      <span key={l} className="block">
                        {l}
                      </span>
                    ))}
                  </span>
                  <span key={`o-${cur.lines}`} className="sm-bump flex flex-col gap-0.5 text-[12px] font-semibold" style={{ color: colors.body }}>
                    <span className="font-mono">print(backup)</span>
                    <Printed>{cur.print_backup}</Printed>
                  </span>
                </>
              )}
            </div>
            <div className="h-[56px] shrink-0">
              <StepCaption text={cur?.why ?? null} tone="rule" size={15} minH={56} />
            </div>
          </Group>
          {/* the tray: a chip that has been filed leaves a dashed place behind */}
          <Group className="grid min-w-0 flex-1 grid-cols-2 content-center gap-x-3 gap-y-2" active={beat > 1}>
            {CHIPS.map((c, i) => (
              <span key={c.lines} className="flex items-center gap-2">
                <span className="w-4 shrink-0 text-right font-mono text-[12px] font-bold" style={{ color: colors.muted }}>
                  {i + 1}
                </span>
                <CodeChip ghost={i < filed} refEl={(el) => (tray.current[i] = el)}>
                  {c.lines}
                </CodeChip>
              </span>
            ))}
          </Group>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {BINS.map((b, k) => {
            const lit = cur ? BINS.indexOf(cur.bin) === k : false
            return (
              <div key={b} className="flex h-[176px] flex-col gap-1.5 rounded-card px-3 pb-2 pt-1.5" style={{ background: colors.surface2, boxShadow: `inset 0 0 0 ${lit ? 3 : 2}px ${lit ? (k === 0 ? colors.accent : colors.success) : colors.line}`, transition: tween }}>
                <span className="font-heading text-[16px] font-bold" style={{ color: k === 0 ? colors.accentDark : '#137A3A' }}>
                  {b}
                </span>
                {CHIPS.slice(0, filed).map((c, i) =>
                  BINS.indexOf(c.bin) === k ? <Filed key={c.lines} c={c} from={tray.current[i]} fly={i === filed - 1} /> : null,
                )}
              </div>
            )
          })}
        </div>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}
