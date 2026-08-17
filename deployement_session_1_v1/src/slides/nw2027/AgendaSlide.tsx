import type { ReactNode } from 'react'
import { InstructorTile, Slide2027 } from '@/ui/nw2027/Frame'
import { NW_SLIDE_HEIGHT, NW_SLIDE_WIDTH, nwColors, nwType } from '@/design/nw2027'

/**
 * Agenda geometry, measured off the Figma frame "Slide 16:9 - Agenda_V6".
 *
 * Items sit on a circular arc that bulges to the right; the arc's centre is
 * off-canvas to the left, level with the dark "Agenda" disc.
 */
const ARC = { cx: 172, cy: 552, r: 650 }
const DISC = { cx: 402, cy: 552, r: 164 }
/**
 * Half-spread of the item fan, in degrees.
 *
 * 34° is the value measured off the Figma frame, which shows six items. Decks
 * with more than six concepts need a wider fan or the labels collide, so the
 * spread opens to 44° past that point. Six or fewer still renders exactly as
 * the design file does — the extension is additive, not a redesign.
 * (Deployment session 1 has eight concepts; signed off 2026-08-11.)
 */
const ARC_SPREAD_BASE = 34
const ARC_SPREAD_WIDE = 44
const spreadFor = (n: number) => (n > 6 ? ARC_SPREAD_WIDE : ARC_SPREAD_BASE)

export interface AgendaItem {
  label: ReactNode
}

/**
 * The agenda slide: a dark brand disc naming the session, and the numbered
 * agenda items fanned along a hairline arc.
 *
 * Note: the segmented progress bar has one division per agenda item, so
 * `progress.total` should match `items.length` (this was raised as feedback
 * on the Figma file — comment #11 on the Final page).
 */
export function AgendaSlide2027({
  kicker,
  title = 'Agenda',
  items,
  instructor,
  progress,
}: {
  kicker?: ReactNode
  title?: ReactNode
  items: (AgendaItem | string)[]
  instructor?: string
  progress?: { total: number; current: number }
}) {
  const list = items.map((i) => (typeof i === 'string' ? { label: i } : i))
  const n = list.length

  /** Angle for item `i`, spread evenly across the fan and centred on 0°. */
  const angleFor = (i: number) => {
    if (n === 1) return 0
    const spread = spreadFor(n)
    return (-spread + (2 * spread * i) / (n - 1)) * (Math.PI / 180)
  }

  return (
    <Slide2027 variant="light" progress={progress ?? { total: n, current: 1 }}>
      <svg
        className="pointer-events-none absolute inset-0"
        width={NW_SLIDE_WIDTH}
        height={NW_SLIDE_HEIGHT}
        viewBox={`0 0 ${NW_SLIDE_WIDTH} ${NW_SLIDE_HEIGHT}`}
        fill="none"
        aria-hidden
      >
        {/* The arc the items sit on */}
        <circle cx={ARC.cx} cy={ARC.cy} r={ARC.r} stroke="rgba(45,99,251,0.22)" strokeWidth={2} />
        {/* Concentric rings echoing the disc */}
        <circle cx={DISC.cx} cy={DISC.cy} r={DISC.r + 47} stroke="rgba(45,99,251,0.20)" strokeWidth={2} />
        <circle cx={DISC.cx} cy={DISC.cy} r={DISC.r + 118} stroke="rgba(45,99,251,0.12)" strokeWidth={2} />
      </svg>

      {/* The dark disc naming the session */}
      <div
        className="absolute grid place-items-center text-center"
        style={{
          left: DISC.cx - DISC.r,
          top: DISC.cy - DISC.r,
          width: DISC.r * 2,
          height: DISC.r * 2,
          borderRadius: '50%',
          background: nwColors.primaryDarkBlue,
          // 40px padding leaves 248px of inner width, which "Agenda" at
          // Heading-S (72px Sora) overruns by a few px — the descender-free
          // word reads as touching the disc edge. 26 gives it room without
          // changing the disc geometry measured off the Figma frame.
          padding: 26,
        }}
      >
        <div>
          {kicker && (
            <div style={{ ...nwType('subHeadXs'), color: nwColors.white, opacity: 0.9 }}>{kicker}</div>
          )}
          <div style={{ ...nwType('headingS'), color: nwColors.white, marginTop: 6 }}>{title}</div>
        </div>
      </div>

      {/* Numbered items fanned along the arc */}
      {list.map((item, i) => {
        const a = angleFor(i)
        const x = ARC.cx + ARC.r * Math.cos(a)
        const y = ARC.cy + ARC.r * Math.sin(a)
        return (
          <div
            key={i}
            className="absolute flex items-center"
            style={{ left: x, top: y, transform: 'translateY(-50%)', gap: 28 }}
          >
            <span
              className="grid shrink-0 place-items-center"
              style={{
                ...nwType('subHeadXs'),
                width: 56,
                height: 56,
                marginLeft: -28,
                borderRadius: '50%',
                color: nwColors.primaryDarkBlue,
                background: '#D7E3FF',
                border: `2px solid rgba(45,99,251,0.35)`,
              }}
            >
              {i + 1}
            </span>
            <span style={{ ...nwType('subHeadL'), color: nwColors.primaryBlue, whiteSpace: 'nowrap' }}>
              {item.label}
            </span>
          </div>
        )
      })}

      {instructor !== undefined && <InstructorTile src={instructor || undefined} />}
    </Slide2027>
  )
}
