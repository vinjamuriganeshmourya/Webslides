import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { T } from '@/ui/figureTiming'
import { Rise, FadeIn, drawAnim, useFigureAnim, at } from './figureMotion'
import { ServerGlyph } from './CloudPicture'

/**
 * TwoDoors — one building, one roof, two doors.
 *
 * WHAT IT ARGUES
 *   The table beside it lists the differences between the shop and AWS. The
 *   drawing insists on the SAMENESS: one roof with one name on it. The room
 *   that just said "Amazon is a shop" was not wrong; they had only ever used
 *   one of the two doors.
 *
 * HOW IT MOVES
 *   The walls trace over `T.draw` and the roof lands with the name. The left
 *   door arrives one beat later (the door they know), the right door one more.
 *   Each mark fades up `T.label` after its door; the caption lands last.
 *   The step under the right door is `ServerGlyph`, the same box as everywhere.
 */

export interface Door {
  sign: string
  /** Path to the mark shown above the door, from `public/`. */
  mark: string
  step: 'bag' | 'server'
}

const W = 460
const H = 300
const WALL = { x: 30, y: 40, w: 400, h: 220 }
const DOOR = { w: 110, h: 118, gap: 100 }
const DOOR_Y = WALL.y + WALL.h - DOOR.h

export function TwoDoors({
  roof = 'Amazon',
  doors,
  caption = 'One company. Two doors',
  className = '',
}: {
  roof?: string
  doors: [Door, Door]
  caption?: string
  className?: string
}) {
  const a = useFigureAnim()
  const x0 = WALL.x + (WALL.w - (DOOR.w * 2 + DOOR.gap)) / 2
  const doorX = (i: number) => x0 + i * (DOOR.w + DOOR.gap)
  const tDoor = (i: number) => at(1 + i)
  const tCaption = tDoor(1) + T.enter + T.label

  return (
    <div className={`relative mx-auto ${className}`} style={{ width: W, height: H }}>
      <svg className="absolute inset-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden>
        {/* walls: a soft white ground, then the outline traced */}
        <motion.rect x={WALL.x} y={WALL.y} width={WALL.w} height={WALL.h} rx={12} fill={colors.white} fillOpacity={0.6}
          initial={a.instant ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: T.enter, delay: at(0) }} />
        <motion.rect x={WALL.x} y={WALL.y} width={WALL.w} height={WALL.h} rx={12} fill="none" stroke={colors.ink} strokeWidth={2} {...drawAnim(a, at(0))} />
        {/* the ground line */}
        <motion.line x1={WALL.x - 14} y1={WALL.y + WALL.h} x2={WALL.x + WALL.w + 14} y2={WALL.y + WALL.h} stroke={colors.ink} strokeWidth={2.5} strokeLinecap="round" {...drawAnim(a, at(0), T.drawStep)} />
      </svg>

      {/* the roof line with the one name on it */}
      <Rise a={a} x={WALL.x + 40} y={WALL.y - 16} w={WALL.w - 80} delay={at(0) + T.stagger} dy={-8}>
        <div className="flex h-8 items-center justify-center rounded-lg font-heading text-body font-bold text-white shadow-card-soft" style={{ background: colors.ink }}>
          {roof}
        </div>
      </Rise>

      {doors.map((d, i) => (
        <Rise key={d.sign} a={a} x={doorX(i) - 15} y={DOOR_Y - 60} w={DOOR.w + 30} delay={tDoor(i)}>
          {/* the mark above the arch */}
          <FadeIn a={a} delay={tDoor(i) + T.enter} className="mx-auto flex h-11 items-center justify-center">
            <img src={d.mark} alt="" draggable={false} className="max-h-11 max-w-[110px] object-contain" />
          </FadeIn>
          {/* the door: an arch with the sign on it and a step below */}
          <div className="relative mx-auto mt-2 overflow-hidden rounded-t-[55px] bg-white shadow-card" style={{ width: DOOR.w, height: DOOR.h, border: `2px solid ${colors.brand}`, borderBottom: 'none' }}>
            <div className="absolute inset-x-0 top-9 text-center font-heading text-[17px] font-bold leading-6" style={{ color: colors.brand }}>{d.sign}</div>
            <div className="absolute inset-x-0 bottom-0 flex h-[52px] items-end justify-center pb-1.5" style={{ background: colors.surface2 }}>
              {d.step === 'bag' ? <Bag /> : <ServerGlyph title="" sub="" h={42} light="on" className="w-[66px] !rounded-lg" />}
            </div>
          </div>
        </Rise>
      ))}

      <Rise a={a} x={0} y={WALL.y + WALL.h + 14} w={W} delay={tCaption} duration={T.label} className="text-center">
        <span className="text-[18px] font-semibold leading-6 text-ink">{caption}</span>
      </Rise>
    </div>
  )
}

/** A shopping bag, 40px. */
function Bag() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill={colors.white} stroke={colors.ink} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 8h14l-1 12H6L5 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" fill="none" />
    </svg>
  )
}
