import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { T } from '@/ui/figureTiming'
import { FadeG, FadeIn, Rise, at, drawAnim, useFigureAnim } from './figureMotion'

/**
 * DataCentreView — a cut-away data centre, drawn once, read twice.
 *
 * Added on instruction (user, 2026-09-16): "from slide 14 we must explain what
 * a data centre is, with illustration". The word is in the news; the room has
 * heard it without knowing what is inside. So the figure is the building with
 * its front wall removed:
 *
 *   state "building"  the hall, its roof, and three rows of racks, with one
 *                     label: "thousands of computers, always on". The four
 *                     supports around it are drawn in `colors.muted`, present
 *                     but not yet named.
 *   state "parts"     the same drawing; the four supports light up one at a
 *                     time in `colors.brand` with a label each: two power lines
 *                     and a backup generator, cooling on the roof, many internet
 *                     lines, guards at the door.
 *
 * Every rack is the same shape as `ServerGlyph` (a name strip with a light,
 * slots at the foot), so the room recognises "a computer" from slide 13. Left
 * to right is still "from the internet to your computer", except that here the
 * internet enters from the right: the building is the subject and sits in the
 * middle, the way `CloudPicture` state 2 draws it.
 *
 * 1100 x 400, colours from tokens, timings from `figureTiming`, `useInstant`
 * honoured through `useFigureAnim`. Session-local.
 */

export type DataCentreViewState = 'building' | 'parts'

const W = 1100
const H = 400
const HALL = { x: 262, y: 64, w: 576, h: 316 }
const ROOF_H = 16
const RACK = { w: 44, h: 68, gap: 46, rows: [104, 192, 280] as const, cols: 6, x0: 302 }
const DOOR = { x: HALL.x + 8, y: HALL.y + HALL.h - 62, w: 34, h: 62 }
const COOLER = [{ x: 420, y: 22 }, { x: 620, y: 22 }] as const
const GEN = { x: 108, y: 292, w: 104, h: 56 }
const POLE = { x: 122, top: 96, bottom: 176 }
const NET = { x1: HALL.x + HALL.w, x2: 972, y: 200 }
const CLOUD = { cx: 1024, cy: 200 }

export function DataCentreView({ state, className = '' }: { state: DataCentreViewState; className?: string }) {
  const a = useFigureAnim()
  const parts = state === 'parts'
  const tone = parts ? colors.brand : colors.muted
  const dim = parts ? 1 : 0.45

  /* The story's clock. The hall lands, the racks fill row by row, then the
     computers label; in the parts state the four supports follow, two
     staggers apart each, in the order the lead names them. */
  const tHall = at(0)
  const tRow = (r: number) => at(1) + r * T.stagger
  const tLabel = at(4)
  const tPart = (i: number) => (parts ? at(5) + i * T.stagger * 2 : at(1))

  return (
    <div className={`relative mx-auto ${className}`} style={{ width: W, height: H }}>
      <svg className="absolute inset-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden>
        {/* ── the hall ─────────────────────────────────────────────── */}
        <FadeG a={a} delay={tHall}>
          <rect x={HALL.x + 8} y={HALL.y + 10} width={HALL.w} height={HALL.h} rx={14} fill={colors.brand} opacity={0.1} />
          <rect x={HALL.x} y={HALL.y} width={HALL.w} height={HALL.h} rx={14} fill={colors.white} stroke={colors.ink} strokeWidth={2} />
          <rect x={HALL.x} y={HALL.y} width={HALL.w} height={ROOF_H} rx={6} fill={colors.ink} />
          {/* floor lines between the rows */}
          {RACK.rows.slice(1).map((y) => (
            <line key={y} x1={HALL.x + 16} y1={y - 12} x2={HALL.x + HALL.w - 16} y2={y - 12} stroke={colors.line} strokeWidth={1.5} />
          ))}
          {/* the door, guard side */}
          <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} rx={4} fill={colors.surface2} stroke={colors.ink} strokeWidth={2} />
          <circle cx={DOOR.x + DOOR.w - 9} cy={DOOR.y + DOOR.h / 2} r={2.5} fill={colors.ink} />
        </FadeG>

        {/* ── the racks, row by row ─────────────────────────────────── */}
        {RACK.rows.map((y, r) => (
          <FadeG key={y} a={a} delay={tRow(r)}>
            {Array.from({ length: RACK.cols }, (_, c) => (
              <Rack key={c} x={RACK.x0 + c * (RACK.w + RACK.gap)} y={y} />
            ))}
          </FadeG>
        ))}

        {/* ── power: two lines from a pole, and a generator ─────────── */}
        <FadeG a={a} delay={tPart(0)} to={dim}>
          <line x1={POLE.x} y1={POLE.top} x2={POLE.x} y2={POLE.bottom + 100} stroke={tone} strokeWidth={3} strokeLinecap="round" />
          <line x1={POLE.x - 22} y1={POLE.top + 10} x2={POLE.x + 22} y2={POLE.top + 10} stroke={tone} strokeWidth={3} strokeLinecap="round" />
          <motion.path d={`M${POLE.x + 20} ${POLE.top + 10} C ${POLE.x + 80} ${POLE.top + 30}, ${HALL.x - 60} ${POLE.top + 30}, ${HALL.x} ${POLE.top + 40}`} fill="none" stroke={tone} strokeWidth={2.5} strokeLinecap="round" {...drawAnim(a, tPart(0), T.drawStep)} />
          <motion.path d={`M${POLE.x + 20} ${POLE.top + 26} C ${POLE.x + 80} ${POLE.top + 48}, ${HALL.x - 60} ${POLE.top + 48}, ${HALL.x} ${POLE.top + 58}`} fill="none" stroke={tone} strokeWidth={2.5} strokeLinecap="round" {...drawAnim(a, tPart(0) + 0.1, T.drawStep)} />
          <rect x={GEN.x} y={GEN.y} width={GEN.w} height={GEN.h} rx={8} fill={colors.white} stroke={tone} strokeWidth={2.5} />
          <path d={`M${GEN.x + 50} ${GEN.y + 12} l-9 18 h12 l-9 18`} fill="none" stroke={tone} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          <motion.line x1={GEN.x + GEN.w} y1={GEN.y + GEN.h / 2} x2={HALL.x} y2={GEN.y + GEN.h / 2} stroke={tone} strokeWidth={2.5} strokeDasharray="6 5" {...drawAnim(a, tPart(0) + 0.2, T.drawStep)} />
        </FadeG>

        {/* ── cooling on the roof ───────────────────────────────────── */}
        <FadeG a={a} delay={tPart(1)} to={dim}>
          {COOLER.map((c) => (
            <g key={c.x}>
              <rect x={c.x} y={c.y} width={64} height={42} rx={6} fill={colors.white} stroke={tone} strokeWidth={2.5} />
              <Fan cx={c.x + 20} cy={c.y + 21} tone={tone} />
              <Fan cx={c.x + 44} cy={c.y + 21} tone={tone} />
            </g>
          ))}
        </FadeG>

        {/* ── the internet, many lines in ───────────────────────────── */}
        <FadeG a={a} delay={tPart(2)} to={dim}>
          {[-14, 0, 14].map((dy, i) => (
            <motion.line key={dy} x1={NET.x2} y1={NET.y + dy} x2={NET.x1} y2={NET.y + dy} stroke={tone} strokeWidth={3} strokeLinecap="round" {...drawAnim(a, tPart(2) + i * 0.08, T.drawStep)} />
          ))}
          <path d={cloudPath(CLOUD.cx, CLOUD.cy, 54, 30)} fill={colors.white} stroke={tone} strokeWidth={2.5} />
        </FadeG>

        {/* ── the guard at the door ─────────────────────────────────── */}
        <FadeG a={a} delay={tPart(3)} to={dim}>
          <Guard x={DOOR.x - 48} y={DOOR.y + 8} tone={tone} />
        </FadeG>
      </svg>

      {/* ── labels, DOM so they wrap and measure ─────────────────────── */}
      <Rise a={a} x={HALL.x + 140} y={HALL.y + HALL.h - 34} w={HALL.w - 280} delay={tLabel}>
        <Pill text="thousands of computers, always on" solid />
      </Rise>

      {parts && (
        <>
          <FadeIn a={a} delay={tPart(0) + T.drawStep} className="absolute text-center" style={{ left: 18, top: 10, width: 190 }}>
            <Label title="power" body="two power lines, and a generator if both fail" />
          </FadeIn>
          <FadeIn a={a} delay={tPart(1) + T.enter} className="absolute" style={{ left: 500, top: 14, width: 100 }}>
            <Pill text="cooling" />
          </FadeIn>
          <FadeIn a={a} delay={tPart(2) + T.drawStep} className="absolute text-center" style={{ left: 940, top: 250, width: 160 }}>
            <Label title="the internet" body="many lines in, so one cut does not matter" />
          </FadeIn>
          <FadeIn a={a} delay={tPart(3) + T.enter} className="absolute text-center" style={{ left: 40, top: 356, width: 200 }}>
            <Label title="guards" body="a badge to get in, day and night" />
          </FadeIn>
        </>
      )}
    </div>
  )
}

/* ── pieces ──────────────────────────────────────────────────────────── */

/** One rack: the `ServerGlyph` shape in SVG, a name strip with a light and slots at the foot. */
function Rack({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={RACK.w} height={RACK.h} rx={6} fill={colors.white} stroke={colors.line} strokeWidth={1.5} />
      <rect x={x} y={y} width={RACK.w} height={14} rx={6} fill={colors.surface2} />
      <circle cx={x + RACK.w - 8} cy={y + 7} r={2.5} fill={colors.success} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={x + 8} y={y + 40 + i * 8} width={RACK.w - 16} height={3.5} rx={1.75} fill={colors.line} opacity={1 - i * 0.25} />
      ))}
    </g>
  )
}

function Fan({ cx, cy, tone }: { cx: number; cy: number; tone: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={11} fill="none" stroke={tone} strokeWidth={2} />
      <path d={`M${cx} ${cy - 8} L${cx} ${cy + 8} M${cx - 8} ${cy} L${cx + 8} ${cy}`} stroke={tone} strokeWidth={2} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={2.5} fill={tone} />
    </g>
  )
}

/** A guard: a head, shoulders, and a badge on the chest. */
function Guard({ x, y, tone }: { x: number; y: number; tone: string }) {
  return (
    <g>
      <circle cx={x + 16} cy={y + 8} r={8} fill={colors.white} stroke={tone} strokeWidth={2.5} />
      <path d={`M${x} ${y + 44} v-10 a16 16 0 0 1 32 0 v10 z`} fill={colors.white} stroke={tone} strokeWidth={2.5} strokeLinejoin="round" />
      <rect x={x + 12} y={y + 26} width={8} height={10} rx={1.5} fill={tone} />
    </g>
  )
}

function Pill({ text, solid = false }: { text: string; solid?: boolean }) {
  return (
    <span
      className="inline-block rounded-full px-3 py-1 text-[15px] font-semibold leading-5"
      style={solid ? { background: colors.ink, color: colors.white } : { background: colors.white, color: colors.brand, border: `1.5px solid ${colors.brand}` }}
    >
      {text}
    </span>
  )
}

function Label({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <div className="font-heading text-[17px] font-bold leading-6" style={{ color: colors.brand }}>{title}</div>
      <div className="text-[14px] leading-[18px]" style={{ color: colors.body }}>{body}</div>
    </div>
  )
}

/** The cloud outline `CloudPicture` uses for the Internet, scaled to a small badge. */
function cloudPath(cx: number, cy: number, rx: number, ry: number) {
  const l = cx - rx
  const r = cx + rx
  const b = cy + ry * 0.7
  return [
    `M${l + rx * 0.35} ${b}`,
    `C${l - rx * 0.1} ${b}, ${l - rx * 0.1} ${cy - ry * 0.2}, ${l + rx * 0.4} ${cy - ry * 0.25}`,
    `C${l + rx * 0.45} ${cy - ry * 1.1}, ${cx + rx * 0.35} ${cy - ry * 1.15}, ${cx + rx * 0.5} ${cy - ry * 0.45}`,
    `C${r + rx * 0.1} ${cy - ry * 0.55}, ${r + rx * 0.15} ${b}, ${r - rx * 0.35} ${b}`,
    'Z',
  ].join(' ')
}
