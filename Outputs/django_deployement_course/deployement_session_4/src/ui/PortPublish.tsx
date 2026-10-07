import { motion } from 'framer-motion'
import { colors, easing } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { SurfaceDefs, surface, TopHighlight } from '@/ui/svgDepth'

/**
 * `ports: "8000:8000"` — the door on your laptop wired to the door inside the
 * container.
 *
 * Last session ended on a locked door: from outside Docker a container is "not
 * possible to reach until the service opens a port". This figure is the key, and
 * it has exactly one job: make the two numbers in `"8000:8000"` land as TWO
 * DIFFERENT PLACES. The room reads that string as one thing repeated; the whole
 * confusion of the session starts there.
 *
 * So the two sides are drawn as two labelled zones with a real boundary between
 * them, the ports are doors cut into that boundary, and the request travels
 * left to right through both. Nothing else is on the figure: no browser chrome,
 * no service names, no network. The container-to-container view is
 * `ComposeNetwork`'s job, and mixing them is what makes learners think a
 * published port and a service name are alternatives for the same journey.
 */

const HOST = { x: 8, y: 40, w: 250, h: 150 }
const CONT = { x: 372, y: 40, w: 250, h: 150 }
const DOOR = { w: 26, h: 54 }

function Door({
  x,
  y,
  label,
  side,
  delay,
  instant,
}: {
  x: number
  y: number
  label: string
  side: 'host' | 'container'
  delay: number
  instant: boolean
}) {
  const paint = side === 'host' ? colors.brand : colors.teal
  /*
    The door is cut INTO the wall, so it straddles the zone border by design.
    Its label must not: centred under the door, "8000" rendered with the border
    line running straight through the digits. Each label therefore sits 34 to
    its own side, inside the zone whose port it names.
  */
  const labelDx = side === 'host' ? -34 : 34
  return (
    <motion.g
      initial={instant ? false : { opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ transformOrigin: `${x + DOOR.w / 2}px ${y + DOOR.h / 2}px` }}
      transition={{ duration: 0.45, delay: instant ? 0 : delay, ease: easing.soft }}
    >
      {/* A door is a physical thing, so it gets the surface treatment too
          (STYLE_GUIDE section 9): a ramp instead of a flat white fill, a shadow
          tinted with its own paint, and a white lip along its top edge. Flat
          white against a lit zone made the doors read as holes cut in the
          picture rather than as doors set into a wall. */}
      <rect
        x={x}
        y={y}
        width={DOOR.w}
        height={DOOR.h}
        rx={5}
        {...surface(side === 'host' ? 'brand' : 'teal')}
        strokeWidth={2.5}
      />
      <TopHighlight x={x} y={y} width={DOOR.w} rx={5} opacity={0.75} />
      {/* The handle. It keeps its solid paint: it is the one part of the door
          that is meant to catch the light rather than carry it. */}
      <circle cx={x + DOOR.w - 7} cy={y + DOOR.h / 2} r={2.6} fill={paint} />
      {/*
        BELOW the door, not above it.

        Above, the label sat at the same height as each zone's title and
        straddled the zone border, so "8000" collided with the box edge on the
        host side and crowded "The container" on the other. Both zones are
        empty below the door, so the label goes there and touches nothing.
      */}
      <text
        x={x + DOOR.w / 2 + labelDx}
        y={y + DOOR.h + 22}
        textAnchor="middle"
        fontSize={15}
        fontWeight={800}
        fontFamily="ui-monospace, monospace"
        fill={paint}
      >
        {label}
      </text>
    </motion.g>
  )
}

function Zone({
  box,
  title,
  sub,
  paint,
  delay,
  instant,
}: {
  box: typeof HOST
  title: string
  sub: string
  paint: string
  delay: number
  instant: boolean
}) {
  return (
    <motion.g
      initial={instant ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: instant ? 0 : delay, ease: easing.soft }}
    >
      {/* `fill={colors.surface}` was one flat tint on both zones, so the figure
          was two outlines on a slide rather than two places with a boundary
          between them. The tone comes from the zone's own paint so the shadow is
          tinted with it, which is what keeps the blue half and the teal half
          telling each other apart at the back of a room. */}
      <rect
        x={box.x}
        y={box.y}
        width={box.w}
        height={box.h}
        rx={14}
        {...surface(paint === colors.brand ? 'brand' : 'teal')}
      />
      <TopHighlight x={box.x} y={box.y} width={box.w} rx={14} />
      <text x={box.x + 18} y={box.y + 32} fontSize={16} fontWeight={800} fill={colors.ink}>
        {title}
      </text>
      <text x={box.x + 18} y={box.y + 54} fontSize={13} fontWeight={600} fill={colors.muted}>
        {sub}
      </text>
    </motion.g>
  )
}

export function PortPublish({ className = '' }: { className?: string }) {
  const instant = useInstant()

  return (
    <div className={className}>
      <svg viewBox="0 0 630 236" className="w-full" role="img" aria-label="A host port wired to a container port">
        <SurfaceDefs />
        <Zone box={HOST} title="Your laptop" sub="the host machine" paint={colors.brand} delay={0} instant={instant} />
        <Zone
          box={CONT}
          title="The container"
          sub="where Django listens"
          paint={colors.teal}
          delay={0.12}
          instant={instant}
        />

        {/* The wire between the two doors. It is drawn, not faded, so the eye
            follows it in the direction the request actually travels. */}
        <motion.line
          x1={HOST.x + HOST.w}
          y1={115}
          x2={CONT.x}
          y2={115}
          stroke={colors.line}
          strokeWidth={3}
          initial={instant ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.55, delay: instant ? 0 : 0.34, ease: easing.soft }}
        />

        <Door
          x={HOST.x + HOST.w - DOOR.w / 2}
          y={88}
          label="8000"
          side="host"
          delay={0.26}
          instant={instant}
        />
        <Door x={CONT.x - DOOR.w / 2} y={88} label="8000" side="container" delay={0.32} instant={instant} />

        {/* The request itself: one pulse, left to right, so direction is not
            ambiguous. It runs once rather than looping — a looping arrow reads
            as "continuous traffic", which is a different claim. */}
        <motion.circle
          r={7}
          fill={colors.accent}
          initial={instant ? false : { cx: HOST.x + 40, cy: 115, opacity: 0 }}
          animate={{ cx: [HOST.x + 40, CONT.x + 60], cy: 115, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.5, delay: instant ? 0 : 0.7, ease: easing.swift }}
        />

        <motion.g
          initial={instant ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: instant ? 0 : 0.9 }}
        >
          <text
            x={315}
            y={214}
            textAnchor="middle"
            fontSize={17}
            fontWeight={800}
            fontFamily="ui-monospace, monospace"
            fill={colors.ink}
          >
            "8000:8000"
          </text>
          <text x={205} y={214} textAnchor="end" fontSize={12.5} fontWeight={700} fill={colors.brand}>
            host side
          </text>
          <text x={425} y={214} textAnchor="start" fontSize={12.5} fontWeight={700} fill={colors.tealDark}>
            container side
          </text>
        </motion.g>
      </svg>
    </div>
  )
}
