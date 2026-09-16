import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { T } from '@/ui/figureTiming'
import { Rise, FadeIn, drawAnim, useFigureAnim, at } from './figureMotion'

/**
 * PlaceLadder — a city, a building in it, a floor in the building.
 *
 * WHAT IT ARGUES
 *   Region, Availability Zone and Subnet are the three hardest nouns in the
 *   deck, and they nest. Three rungs, outer to inner, top to bottom. One rung is
 *   lit per slide, so the figure says "you are here" in the chain without the
 *   room re-reading `RegionMap`.
 *
 *     region   top rung lit, the two below named but not yet taught
 *     zone     second rung lit, the first kept in ink (already taught)
 *     subnet   third rung lit, the two above in ink
 *     all      every rung lit and a bracket down the left joins them
 *
 *   The unlit rungs are named from the first slide. The figure's job is
 *   "where are we", the roadmap exception in hard rule 4, and the words are
 *   AWS's own.
 *
 * HOW IT MOVES
 *   Rungs arrive top to bottom at `T.stagger`. The lit rung then gets the one
 *   `T.accent` beat: a 2.5px brand ring fades up around it. In `all`, the
 *   bracket traces itself down the left over `T.draw`.
 */

export type PlaceLadderState = 'region' | 'zone' | 'subnet' | 'all'

const RUNGS = [
  { word: 'Region', anchor: 'a city' },
  { word: 'Availability Zone', anchor: 'a building in it' },
  { word: 'Subnet', anchor: 'a floor in the building' },
] as const

const MD = { w: 400, h: 260 }
const ROW = { x: 20, w: 380, h: 68, gap: 14 }
const SIZE = { md: 1, sm: 0.75 } as const

type RungLook = 'lit' | 'done' | 'todo'

function looks(state: PlaceLadderState): RungLook[] {
  if (state === 'all') return ['lit', 'lit', 'lit']
  const cur = { region: 0, zone: 1, subnet: 2 }[state]
  return RUNGS.map((_, i) => (i === cur ? 'lit' : i < cur ? 'done' : 'todo'))
}

export function PlaceLadder({ state, size = 'md', className = '' }: { state: PlaceLadderState; size?: keyof typeof SIZE; className?: string }) {
  const a = useFigureAnim()
  const k = SIZE[size]
  const look = looks(state)
  const tAccent = at(RUNGS.length) + T.enter
  const top = (i: number) => 8 + i * (ROW.h + ROW.gap)

  return (
    <div className={`relative mx-auto ${className}`} style={{ width: MD.w * k, height: MD.h * k }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: MD.w, height: MD.h, transform: `scale(${k})` }}>
        {state === 'all' && (
          <svg className="absolute inset-0" width={MD.w} height={MD.h} viewBox={`0 0 ${MD.w} ${MD.h}`} aria-hidden>
            <motion.path
              d={`M${ROW.x - 6} ${top(0) + ROW.h / 2} H${ROW.x - 12} V${top(2) + ROW.h / 2} H${ROW.x - 6}`}
              fill="none"
              stroke={colors.brand}
              strokeWidth={2}
              strokeLinecap="round"
              {...drawAnim(a, tAccent)}
            />
          </svg>
        )}

        {RUNGS.map((r, i) => {
          const l = look[i]
          const tone = l === 'lit' ? colors.brand : l === 'done' ? colors.ink : colors.muted
          const text = l === 'todo' ? colors.muted : colors.ink
          return (
            <Rise key={r.word} a={a} x={ROW.x} y={top(i)} w={ROW.w} delay={at(i)}>
              <div
                className="relative flex items-center gap-4 rounded-xl bg-white px-4 shadow-card-soft"
                style={{ height: ROW.h, border: `2px solid ${tone}`, opacity: l === 'todo' ? 0.55 : 1 }}
              >
                <Glyph kind={i} tone={tone} />
                <div className="min-w-0">
                  <div className="font-heading text-body font-bold leading-6" style={{ color: text }}>{r.word}</div>
                  <div className="text-[17px] leading-5" style={{ color: l === 'todo' ? colors.muted : colors.body }}>{r.anchor}</div>
                </div>
                {l === 'lit' && (
                  <FadeIn a={a} delay={tAccent} duration={T.accent} className="pointer-events-none absolute rounded-[14px]" style={{ inset: -4, border: `2.5px solid ${colors.brand}`, boxShadow: `0 0 0 5px ${colors.brand}18` }}>
                    {null}
                  </FadeIn>
                )}
              </div>
            </Rise>
          )
        })}
      </div>
    </div>
  )
}

/** 48px glyphs: a skyline, a building, a floor plan with one stripe lit. */
function Glyph({ kind, tone }: { kind: number; tone: string }) {
  const s = 48
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none" stroke={tone} strokeWidth={2} strokeLinejoin="round" className="shrink-0" aria-hidden>
      {kind === 0 && (
        <>
          <rect x="3" y="24" width="12" height="20" rx="1.5" />
          <rect x="18" y="10" width="13" height="34" rx="1.5" />
          <rect x="34" y="18" width="11" height="26" rx="1.5" />
          <path d="M22 16h5M22 22h5M22 28h5M22 34h5M7 30h4M7 36h4M37 24h5M37 30h5M37 36h5" strokeLinecap="round" />
          <path d="M1 44h46" strokeLinecap="round" />
        </>
      )}
      {kind === 1 && (
        <>
          <rect x="12" y="4" width="24" height="40" rx="2" />
          <path d="M9 44h30" strokeLinecap="round" />
          {[10, 18, 26, 34].map((y) => (
            <path key={y} d={`M17 ${y}h4M22 ${y}h4M27 ${y}h4`} strokeLinecap="round" />
          ))}
          <rect x="20" y="37" width="8" height="7" rx="1" fill={tone} />
        </>
      )}
      {kind === 2 && (
        <>
          <rect x="3" y="10" width="42" height="28" rx="2" />
          <path d="M3 19h42M3 29h42" />
          <rect x="5" y="21" width="38" height="6" fill={tone} stroke="none" />
        </>
      )}
    </svg>
  )
}
