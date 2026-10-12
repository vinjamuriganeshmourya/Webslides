import { useLayoutEffect, useRef } from 'react'
import { Arc, CornerLogo, Stage } from '@/ui/shared'
import { colors, fonts } from '@/design/tokens'

export interface AgendaOrbitItem {
  title: string
  sub?: string
}

export interface AgendaOrbitSlideProps {
  /** The session's name, the small line above the word in the mark. */
  kicker: string
  /** The large word in the mark. `Agenda`, always. */
  title?: string
  items: AgendaOrbitItem[]
}

/**
 * AGENDA, ORBIT MARK — the Python course's agenda slide, as it ships in
 * `Outputs/python/27_sets` (`src/decks/figures/Agenda.tsx`), set on THIS
 * deck's agenda ground (`slidestraining/agendaslides/Agenda_layer4 copy.png`:
 * the paper wash, the two rings, the corner mark and the bottom bar, the same
 * ground `AgendaSlide` draws). Added 2026-10-12 on the user's word, as a
 * slide of its own; `AgendaSlide` is untouched.
 *
 * WHAT IS KEPT. The whole figure: the navy mark with its orbit ring, the one
 * Bézier sweep the numbers sit on, the points centred on the mark, the
 * speaker-box cap on the text, the session name that fits itself into the
 * mark. Every number is the 27 Sets file's, verbatim, on that file's
 * 1280x720 canvas; the figure is drawn in a 1280x720 box scaled x1.5 onto
 * this deck's 1920x1080 stage, so the port is the original, not a re-measure.
 *
 * WHAT CHANGES. (1) The ground, which is the point. The kit's own top-right
 * blue blur behind the curve is dropped with it: this ground has its wash.
 * (2) Static (rule 3 of this folder): the line is drawn, the points are
 * there; nothing enters. (3) The faces are this folder's (rule 2): Sora
 * SemiBold where the kit sets Poppins ExtraBold/Bold (the word in the mark,
 * the titles, the numerals), DM Sans where it sets Inter. Weights, sizes and
 * colours are the kit's.
 */

/* ---- the 27 Sets figure, verbatim ----------------------------------- */

/** The kit's 1280x720 canvas, scaled onto this deck's 1920x1080 stage. */
const KIT_W = 1280
const KIT_H = 720
const SCALE = 1.5

/* The curve: one cubic Bézier, in from the top left, bulging right, out at the bottom. */
const P0 = { x: 398, y: 4 }
const P1 = { x: 545, y: 170 }
const P2 = { x: 548, y: 505 }
const P3 = { x: 424, y: 706 }

/** The mark's centre and its orbit ring: the band the points are centred on. */
const MARK_CX = 292
const MARK_CY = 366
const MARK_D = 268
const RING_D = 338
const BAND_H = 338
/** The least two neighbouring points may be apart, centre to centre. */
const GAP_MIN = 96
/** The furthest a point's centre may go: 30px of block each side stays on the canvas and above the footer bar. */
const Y_MIN = 60
const Y_MAX = 672
/** The speaker box's left edge and bottom edge (content rule 32). */
const VIDEO_LEFT = 913
const VIDEO_BOTTOM = 220
/** Below the box by less than this, a point's text is capped short of it. */
const VIDEO_REACH = 100
/** The padded frame's right edge (content rule 32) and the gutter kept to the box. */
const RIGHT_EDGE = 1216
const GUTTER = 24
/** The text starts this far right of the badge's centre. */
const TEXT_DX = 42
/** The badge: 36px, `#DCE7FB` carrying the navy numeral. */
const BADGE = 36
const BADGE_FILL = '#DCE7FB'
/** The kit's paragraph grey (`body` in its Tailwind theme), for the sub lines. */
const SUB_INK = '#4A5B6B'

/** The y of every point's centre: evenly gapped, the group centred on `MARK_CY`. */
function pointYs(n: number): number[] {
  if (n <= 1) return [MARK_CY]
  let gap = Math.max(BAND_H / n, GAP_MIN)
  const room = Y_MAX - Y_MIN
  if ((n - 1) * gap > room) gap = room / (n - 1)
  const first = MARK_CY - ((n - 1) * gap) / 2
  return Array.from({ length: n }, (_, i) => first + i * gap)
}

const bezier = (t: number) => {
  const u = 1 - t
  const a = u * u * u
  const b = 3 * u * u * t
  const c = 3 * u * t * t
  const d = t * t * t
  return {
    x: a * P0.x + b * P1.x + c * P2.x + d * P3.x,
    y: a * P0.y + b * P1.y + c * P2.y + d * P3.y,
  }
}

/** The x on the curve at a given y, found by sampling: the curve is monotonic in y. */
function xAt(y: number) {
  let best = bezier(0)
  let bestDy = Math.abs(best.y - y)
  for (let t = 0; t <= 1; t += 0.002) {
    const p = bezier(t)
    const dy = Math.abs(p.y - y)
    if (dy < bestDy) {
      best = p
      bestDy = dy
    }
  }
  return best.x
}

const CURVE_D = `M${P0.x} ${P0.y} C${P1.x} ${P1.y} ${P2.x} ${P2.y} ${P3.x} ${P3.y}`

/** The kicker's sizes, in px: the kit's `text-body-sm` down to the smallest that reads from a seat. */
const KICKER_MAX = 16
const KICKER_MIN = 11
/** At most this many lines of session name above the word. */
const KICKER_LINES = 2
/** `leading-snug`, which the kicker keeps at every size. */
const KICKER_LEADING = 1.375

/**
 * Shrink the session name until it fits the mark: no more than `KICKER_LINES`
 * lines and no wider than its box. Measurement, not motion: `useLayoutEffect`
 * so the room never sees the unshrunk size, re-run when the webfont lands.
 * Measures in CSS px, which the x1.5 transform does not touch.
 */
function useFitText(text: unknown) {
  const ref = useRef<HTMLParagraphElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const fit = () => {
      let size = KICKER_MAX
      el.style.fontSize = `${size}px`
      el.style.overflowWrap = 'normal'
      const over = () =>
        el.scrollWidth > el.clientWidth + 1 ||
        el.scrollHeight > Math.ceil(size * KICKER_LEADING * KICKER_LINES) + 1
      while (size > KICKER_MIN && over()) {
        size -= 0.5
        el.style.fontSize = `${size}px`
      }
      if (over()) el.style.overflowWrap = 'anywhere'
    }
    fit()
    let width = el.clientWidth
    const ro = new ResizeObserver(() => {
      if (el.clientWidth === width) return
      width = el.clientWidth
      fit()
    })
    ro.observe(el)
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(fit).catch(() => {})
    }
    return () => ro.disconnect()
  }, [text])
  return ref
}

/* ---- the slide ------------------------------------------------------- */

export function AgendaOrbitSlide({ kicker, title = 'Agenda', items }: AgendaOrbitSlideProps) {
  const n = items.length
  const ys = pointYs(n)
  const kickerRef = useFitText(kicker)

  return (
    <Stage ground="paper" style={{ color: colors.black }}>
      {/* the ground's chrome, as `AgendaSlide` draws it: two rings, the mark, the bar */}
      <Arc
        cx={1159}
        cy={753}
        color={colors.deep}
        opacity={0.26}
        mask="linear-gradient(90deg, transparent 0%, transparent 52%, #000 72%)"
      />
      <Arc cx={2428} cy={36} color={colors.deep} opacity={0.27} />

      {/* the kit's canvas, scaled onto this stage */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: KIT_W,
          height: KIT_H,
          transform: `scale(${SCALE})`,
          transformOrigin: '0 0',
        }}
      >
        {/* the orbit mark */}
        <div style={{ position: 'absolute', left: MARK_CX, top: MARK_CY }}>
          <span
            aria-hidden
            style={{
              position: 'absolute',
              left: -RING_D / 2,
              top: -RING_D / 2,
              width: RING_D,
              height: RING_D,
              boxSizing: 'border-box',
              borderRadius: '50%',
              border: `1px solid ${colors.navy}1F`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: -MARK_D / 2,
              top: -MARK_D / 2,
              width: MARK_D,
              height: MARK_D,
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr)',
              placeItems: 'center',
              borderRadius: '50%',
              background: colors.navy,
              textAlign: 'center',
            }}
          >
            {/* the mark's width less 40px each side, whatever the text */}
            <div style={{ width: '100%', minWidth: 0, boxSizing: 'border-box', padding: '0 40px' }}>
              <p
                ref={kickerRef}
                style={{
                  margin: 0,
                  fontFamily: fonts.body,
                  fontWeight: 600,
                  fontSize: KICKER_MAX,
                  lineHeight: KICKER_LEADING,
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                {kicker}
              </p>
              <p
                style={{
                  margin: '4px 0 0',
                  fontFamily: fonts.title,
                  fontWeight: 600,
                  fontSize: 46,
                  lineHeight: 1,
                  color: colors.white,
                }}
              >
                {title}
              </p>
            </div>
          </div>
        </div>

        {/* the curve, in its own narrow band, clear of the speaker box */}
        <svg
          aria-hidden
          style={{ position: 'absolute', left: 360, top: 0, pointerEvents: 'none' }}
          width={240}
          height={710}
          viewBox="360 0 240 710"
        >
          <path d={CURVE_D} fill="none" stroke={colors.blue} strokeOpacity={0.45} strokeWidth={1.5} />
        </svg>

        {/* the points, on the curve */}
        {items.map((item, i) => {
          const y = ys[i]
          const x = xAt(y)
          const textLeft = x + TEXT_DX
          /* Short of the speaker box where the box is in reach, else the frame's edge. */
          const maxWidth = (y < VIDEO_BOTTOM + VIDEO_REACH ? VIDEO_LEFT - GUTTER : RIGHT_EDGE) - textLeft
          return (
            <div key={i}>
              <span
                style={{
                  position: 'absolute',
                  left: x - BADGE / 2,
                  top: y - BADGE / 2,
                  width: BADGE,
                  height: BADGE,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '50%',
                  background: BADGE_FILL,
                  color: colors.navy,
                  fontFamily: fonts.title,
                  fontWeight: 600,
                  fontSize: 16,
                  lineHeight: 1,
                }}
              >
                {i + 1}
              </span>
              <div
                style={{
                  position: 'absolute',
                  left: textLeft,
                  top: y,
                  maxWidth,
                  transform: 'translateY(-50%)',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontFamily: fonts.title,
                    fontWeight: 600,
                    fontSize: 27,
                    lineHeight: 1.25,
                    color: colors.blue,
                  }}
                >
                  {item.title}
                </p>
                {item.sub && (
                  <p
                    style={{
                      margin: '4px 0 0',
                      fontFamily: fonts.body,
                      fontWeight: 400,
                      fontSize: 16,
                      lineHeight: 1.55,
                      color: SUB_INK,
                    }}
                  >
                    {item.sub}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <CornerLogo />

      <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 12, background: colors.blue }} />
    </Stage>
  )
}
