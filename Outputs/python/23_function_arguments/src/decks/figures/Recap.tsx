import { createRef, useRef, type RefObject } from 'react'
import { colors } from '@/design/tokens'
import { useBeats, useTween } from '@/ui'
import { StepControls } from './controls'
import { Lines } from './common'
import { Ask, sentences } from './pieces'
import { useFly, fromEl } from './slots'
import { SPEC } from './spec'

/**
 * RECAP SORT: PRINTS SOMETHING, OR NOTHING? Spec card S-RECAP, six presses.
 *
 * Press 1: the five chips in a tray, both bins empty, the question (its must
 * line: "All five chips and both bins are on screen from press 1"). Presses 2
 * to 6: one chip per press flies from the tray into its bin, and only then
 * shows what it prints and its line (must: "A chip's result shows only when
 * it lands"). A chip that has gone leaves its place in the tray dashed, so the
 * room sees how many are left. Chips are whole programs, kept readable.
 */
const R = SPEC['S-RECAP']
type Chip = { code: string; prints: string; bin: string; why: string }
const CHIPS: Chip[] = R.data.chips
const BINS: string[] = R.data.bins
const W = 200

function Code({ src }: { src: string }) {
  return (
    <div className="relative rounded-lg px-3 pb-2 pt-3.5" style={{ background: colors.night2, height: 112 }}>
      <span className="absolute right-2 top-0.5 text-[10px] font-semibold" style={{ color: colors.muted }}>
        Python
      </span>
      <div className="font-mono text-[13.5px] leading-[18px]" style={{ color: colors.white }}>
        {src.split('\n').map((l, i) => (
          <div key={i} className="whitespace-pre">
            {l || ' '}
          </div>
        ))}
      </div>
    </div>
  )
}

function ChipCard({ n, chip, from }: { n: number; chip: Chip; from?: RefObject<HTMLElement | null> }) {
  const ref = useRef<HTMLDivElement>(null)
  useFly(ref, from ? fromEl(from) : null)
  return (
    <div ref={ref} className="relative flex flex-col gap-1.5" style={{ width: W }}>
      <span className="absolute -left-2 -top-2 z-10 grid h-6 w-6 place-items-center rounded-full font-mono text-[13px] font-bold text-white" style={{ background: colors.brandDark }}>
        {n + 1}
      </span>
      <Code src={chip.code} />
    </div>
  )
}

export function SortRecap() {
  const beat = useBeats(6)
  const tween = useTween(480)
  const landed = (i: number) => beat >= i + 2
  const trayRefs = useRef(CHIPS.map(() => createRef<HTMLDivElement>()))
  return (
    <>
      {/* lifted 16px into the gap under the title (user, 2026-10-07), clear of the step buttons */}
      <div className="-mt-4 flex flex-col gap-3">
        <Ask size={24}>{R.show[1]}</Ask>
        {/* the tray */}
        <div className="flex gap-3.5">
          {CHIPS.map((c, i) => (
            <div key={i} ref={trayRefs.current[i]} className="relative rounded-xl" style={{ width: W, height: 112, boxShadow: landed(i) ? `inset 0 0 0 2px ${colors.line}` : 'none', border: landed(i) ? `2px dashed ${colors.line}` : '2px solid transparent', transition: tween }}>
              {!landed(i) ? (
                <ChipCard n={i} chip={c} />
              ) : (
                <span className="grid h-full place-items-center font-mono text-[22px] font-bold" style={{ color: colors.line }}>
                  {i + 1}
                </span>
              )}
            </div>
          ))}
        </div>
        {/* the two bins */}
        <div className="mt-1 flex gap-4">
          {BINS.map((b) => {
            const mine = CHIPS.map((c, i) => ({ c, i })).filter((x) => x.c.bin === b)
            const something = b === BINS[0]
            const paint = something ? colors.success : colors.muted
            return (
              <div key={b} className="flex flex-col gap-2 rounded-card px-3 pb-2 pt-2" style={{ background: something ? '#E9F8EF' : colors.surface, boxShadow: `inset 0 0 0 2px ${paint}`, width: mine.length * (W + 12) + 12 }}>
                <span className="flex items-center gap-2 text-[17px] font-bold" style={{ color: something ? '#137A3A' : colors.body }}>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: paint }} />
                  {b}
                </span>
                <div className="flex gap-3">
                  {mine.map(({ c, i }) => (
                    <div key={i} className="flex flex-col gap-1" style={{ width: W, minHeight: 112 + 22 + 58 }}>
                      {landed(i) && (
                        <>
                          <ChipCard n={i} chip={c} from={trayRefs.current[i]} />
                          <span className="sm-bump flex items-center gap-1.5 text-[14px] font-bold" style={{ color: colors.body, animationDelay: '700ms' }}>
                            prints
                            <span className="rounded-md px-1.5 font-mono" style={c.prints === '(nothing)' ? { color: colors.muted, fontStyle: 'italic' } : { color: colors.ink, background: colors.white, boxShadow: `inset 0 0 0 1.5px ${colors.success}` }}>
                              {c.prints}
                            </span>
                          </span>
                          <span className="sm-bump text-[14px] font-semibold leading-[18px]" style={{ color: colors.ink, animationDelay: '700ms' }}>
                            <Lines lines={sentences(c.why)} />
                          </span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <StepControls at={beat} total={6} />
    </>
  )
}
