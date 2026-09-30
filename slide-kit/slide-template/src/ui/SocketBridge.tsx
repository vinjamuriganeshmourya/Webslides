import { colors } from '@/design/tokens'
import { ArrowHead } from './figures/ArrowHead'

/**
 * SocketBridge — one process asking another to do the work, across a boundary
 * it does not own.
 *
 * WHAT IT ARGUES
 *   `docker build` does not build anything. The `docker` command is a thin
 *   client; it hands every instruction to a daemon, and on a machine running
 *   Jenkins in a container those two live on opposite sides of the container
 *   wall. The socket is the hole in that wall. Draw both boundaries from the
 *   start, because a learner who first meets this as two plain boxes has to
 *   unlearn that picture two slides later.
 *
 * WHY IT IS NOT ONE OF THE FIGURES WE ALREADY HAD
 *   `BoundaryBridge` spans two machines with a hub lifted between them, and the
 *   socket has no hub: the daemon is one of the two ends. `SpineFlow` is a
 *   sequence of stations, and client and daemon are not a sequence, they are
 *   two parties either side of one wire. `LayerStack` stacks layers on one
 *   machine, and crossing out of the container is the whole point.
 *
 * CHOSEN IN `slide-kit/socket-lab` (devPort 5235), 2026-09-10, over a version
 * that drew only the general client and daemon with no boundaries.
 *
 * ONE THING TO KNOW BEFORE EDITING
 *   Labels are placed with an explicit x, not at each arrow's midpoint. Round 1
 *   centred them and the wire's label printed straight through the socket box.
 *   It typechecked, and `qa`, `video-safe` and `align-check` all passed it,
 *   because an `<svg>` is one rectangle to every harness. Hard rule 17: if you
 *   move a box here, look at the picture.
 */

const W = 1100
const H = 400

function Boundary({
  x, y, w, h, label, tone,
}: { x: number; y: number; w: number; h: number; label: string; tone: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14} fill="none" stroke={tone} strokeWidth={2} strokeDasharray="8 8" />
      <text x={x + 14} y={y - 10} fill={tone} fontSize={17} fontWeight={600}>{label}</text>
    </g>
  )
}

function Box({
  x, y, w, title, sub, tone,
}: { x: number; y: number; w: number; title: string; sub: string; tone: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={74} rx={12} fill={colors.white} stroke={tone} strokeWidth={2} />
      <text x={x + w / 2} y={y + 30} textAnchor="middle" fill={colors.ink} fontSize={19} fontWeight={700}>{title}</text>
      <text x={x + w / 2} y={y + 52} textAnchor="middle" fill={colors.body} fontSize={15}>{sub}</text>
    </g>
  )
}

export function SocketBridge({
  containerLabel = 'Jenkins container',
  hostLabel = 'Your machine, the host',
  wireLabel = 'over the mounted socket',
  footnote = "The container never runs a daemon of its own. It borrows the host's.",
}: {
  containerLabel?: string
  hostLabel?: string
  wireLabel?: string
  footnote?: string
}) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
      aria-label="The docker command inside a container, talking over a mounted socket to the Docker daemon on the host">

      <Boundary x={40} y={70} w={470} h={250} label={containerLabel} tone={colors.brand} />
      <Boundary x={560} y={70} w={500} h={250} label={hostLabel} tone={colors.ink} />

      <Box x={90} y={160} w={200} title="docker CLI" sub="installed inside" tone={colors.brand} />
      <Box x={790} y={160} w={220} title="Docker daemon" sub="already running here" tone={colors.brandDark} />

      <line x1={290} y1={197} x2={790} y2={197} stroke={colors.brand} strokeWidth={2.5} />
      <ArrowHead d="M 290 197 L 790 197" color={colors.brand} strokeWidth={2.5} size={7} refX={9} />
      {/* Placed left of the socket box, never at the arrow midpoint. See the header. */}
      <text x={393} y={179} textAnchor="middle" fill={colors.brand} fontSize={16} fontWeight={600}>{wireLabel}</text>

      <rect x={496} y={140} width={128} height={112} rx={10} fill={colors.white} stroke={colors.accent} strokeWidth={2.5} />
      <text x={560} y={126} textAnchor="middle" fill={colors.accent} fontSize={16} fontWeight={700}>socket</text>
      <text x={560} y={205} textAnchor="middle" fill={colors.ink} fontSize={14}>docker.sock</text>

      <text x={40} y={360} fill={colors.body} fontSize={17}>{footnote}</text>
    </svg>
  )
}
