import { motion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { T } from '@/ui/figureTiming'
import { Rise, FadeIn, drawAnim, useFigureAnim, at } from './figureMotion'
import { ServerGlyph } from './CloudPicture'

/**
 * MachineCard — the same server box, with three facts pinned to three places
 * on it.
 *
 * WHAT IT ARGUES
 *   The bullets beside it say three things about an instance. The card pins
 *   each one to a PLACE on the box: the address at the top right, the lamp on
 *   the left edge, the keyhole at the bottom. Because it is the very box the
 *   room met on slide 10, they learn that "instance" is the name for the thing
 *   they have been looking at, not a fourth new thing.
 *
 * HOW IT MOVES
 *   Box `T.enter`. Tags arrive in the order given, one `T.stagger` apart, so
 *   the deck author matches them to bullet order. Each leader traces over
 *   `T.drawStep`, then its label fades up `T.label`.
 */

export type MachineTag = 'address' | 'power' | 'key'

const W = 440
const H = 280
const BOX = { x: 100, y: 14, w: 160, h: 220 }
const LAMP = { cx: BOX.x, cy: BOX.y + 110, r: 9 }
const HOLE = { cx: BOX.x + BOX.w / 2 + 30, cy: BOX.y + 158, r: 12 }
const RIGHT = { x: BOX.x + BOX.w + 18, w: W - (BOX.x + BOX.w + 18) }
const LEFT = { x: 0, w: BOX.x - 18 }

export function MachineCard({
  address = '13.235.67.89',
  tags = ['address', 'power', 'key'],
  label = 'instance',
  className = '',
}: {
  address?: string
  tags?: MachineTag[]
  label?: string
  className?: string
}) {
  const a = useFigureAnim()
  const order = (t: MachineTag) => tags.indexOf(t)
  const tTag = (t: MachineTag) => at(1 + order(t))
  const tLabel = (t: MachineTag) => tTag(t) + T.drawStep

  const leaders: Record<MachineTag, string> = {
    address: `M${BOX.x + BOX.w - 12} ${BOX.y + 15} H${RIGHT.x - 4}`,
    power: `M${LAMP.cx - LAMP.r - 2} ${LAMP.cy} H${LEFT.x + LEFT.w + 4}`,
    key: `M${HOLE.cx + HOLE.r + 2} ${HOLE.cy} H${RIGHT.x - 4}`,
  }

  return (
    <div className={`relative mx-auto ${className}`} style={{ width: W, height: H }}>
      <Rise a={a} x={BOX.x} y={BOX.y} w={BOX.w} delay={at(0)}>
        <ServerGlyph title="EC2 instance" sub="rented, always on" h={BOX.h} light="on" />
      </Rise>
      <Rise a={a} x={BOX.x - 20} y={BOX.y + BOX.h + 10} w={BOX.w + 40} delay={at(0) + T.stagger} className="text-center">
        <span className="font-heading text-body font-bold leading-6 text-ink">{label}</span>
      </Rise>

      <svg className="absolute inset-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden>
        {tags.map((t) => (
          <motion.path key={t} d={leaders[t]} fill="none" stroke={colors.brand} strokeWidth={2} strokeLinecap="round" {...drawAnim(a, tTag(t), T.drawStep)} />
        ))}
      </svg>

      {tags.includes('power') && (
        <FadeIn a={a} delay={tTag('power')} className="absolute rounded-full bg-white" style={{ left: LAMP.cx - LAMP.r - 2, top: LAMP.cy - LAMP.r - 2, width: (LAMP.r + 2) * 2, height: (LAMP.r + 2) * 2, padding: 2, border: `2px solid ${colors.ink}` }}>
          <div className="size-full rounded-full" style={{ background: colors.brand, boxShadow: `0 0 0 4px ${colors.brand}22` }} />
        </FadeIn>
      )}
      {tags.includes('key') && (
        <FadeIn a={a} delay={tTag('key')} className="absolute" style={{ left: HOLE.cx - HOLE.r - 3, top: HOLE.cy - HOLE.r - 3 }}>
          <Keyhole r={HOLE.r} />
        </FadeIn>
      )}

      {/* labels, each at its own x, clear of the box */}
      {tags.includes('address') && (
        <Rise a={a} x={RIGHT.x} y={BOX.y - 2} w={RIGHT.w} delay={tLabel('address')} duration={T.label} dx={-6} dy={0}>
          <div className="inline-block rounded-lg bg-white px-2 font-mono text-[15px] font-semibold leading-7 tabular-nums text-ink shadow-card-soft" style={{ border: `1px solid ${colors.brand}` }}>{address}</div>
          <div className="mt-1 text-[15px] font-semibold leading-5" style={{ color: colors.brand }}>public address</div>
        </Rise>
      )}
      {tags.includes('power') && (
        <Rise a={a} x={LEFT.x} y={LAMP.cy - 22} w={LEFT.w} delay={tLabel('power')} duration={T.label} dx={6} dy={0} className="text-right">
          <div className="text-[15px] font-semibold leading-5 text-ink">on until you stop it</div>
        </Rise>
      )}
      {tags.includes('key') && (
        <Rise a={a} x={RIGHT.x} y={HOLE.cy - 20} w={RIGHT.w} delay={tLabel('key')} duration={T.label} dx={-6} dy={0}>
          <div className="text-[15px] font-semibold leading-5 text-ink">you log in</div>
          <div className="text-[15px] font-semibold leading-5 text-ink">with a key, over SSH</div>
        </Rise>
      )}
    </div>
  )
}

function Keyhole({ r }: { r: number }) {
  const s = (r + 3) * 2
  const c = s / 2
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" aria-hidden>
      <circle cx={c} cy={c} r={r} fill={colors.white} stroke={colors.ink} strokeWidth={2.5} />
      <circle cx={c} cy={c - 3} r={3} fill={colors.ink} />
      <path d={`M${c - 2.2} ${c - 1} l-1.2 7 h6.8 l-1.2 -7 z`} fill={colors.ink} />
    </svg>
  )
}
