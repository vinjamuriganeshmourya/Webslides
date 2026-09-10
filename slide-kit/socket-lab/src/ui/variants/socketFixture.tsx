import { colors } from '@/design/tokens'

/**
 * CANDIDATES FOR SESSION 8's TWO NEW FIGURES.
 *
 * Content rule 14: a new figure is a lab with candidates, not a first guess.
 * Content rule 27: the representation gets researched before it is drawn.
 * Content rule 17: somebody looks at the picture, because the three harnesses
 * measure DOM rectangles and an `<svg>` is one rectangle to all of them.
 *
 * WHY TWO FIGURES AND NOT THE ONE THE PLAN NAMED
 *
 * Plan §6 identified one gap, `SocketBridge` for slide 9, and was written while
 * D1 was still B. D1 signed off as **A**, the ngrok tunnel, which puts a
 * public address forwarding into a laptop on slide 33 and nothing in the
 * registry draws that either. So this lab asks two questions, not one.
 *
 * WHAT WAS CHECKED FIRST, AND REJECTED, so nobody redoes the search:
 *
 *   `MachineBoundary`  draws a request dying at the localhost boundary. That is
 *                      exactly slide 32 and it is used there as-is. It is the
 *                      PROBLEM picture, so it cannot also be the tunnel that
 *                      solves it.
 *   `BoundaryBridge`   spans two machines with a hub lifted between them. The
 *                      socket has no hub: the daemon is one of the two ends.
 *   `SpineFlow`        a sequence of stations. Client and daemon are not a
 *                      sequence, they are two parties either side of one wire.
 *   `LayerStack`       stacks layers on one machine. The socket's whole point is
 *                      that it crosses out of the container.
 */

const W = 1100
const H = 400

/* ── shared parts ─────────────────────────────────────────────────────── */

function Boundary({
  x, y, w, h, label, dashed = true, tone = colors.muted,
}: { x: number; y: number; w: number; h: number; label: string; dashed?: boolean; tone?: string }) {
  return (
    <g>
      <rect
        x={x} y={y} width={w} height={h} rx={14}
        fill="none" stroke={tone} strokeWidth={2}
        strokeDasharray={dashed ? '8 8' : undefined}
      />
      <text x={x + 14} y={y - 10} fill={tone} fontSize={17} fontWeight={600}>{label}</text>
    </g>
  )
}

function Box({
  x, y, w = 200, h = 74, title, sub, tone = colors.brand, solid = false,
}: { x: number; y: number; w?: number; h?: number; title: string; sub?: string; tone?: string; solid?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12}
        fill={solid ? tone : colors.white} stroke={tone} strokeWidth={2} />
      <text x={x + w / 2} y={y + (sub ? 30 : 43)} textAnchor="middle"
        fill={solid ? colors.white : colors.ink} fontSize={19} fontWeight={700}>{title}</text>
      {sub && (
        <text x={x + w / 2} y={y + 52} textAnchor="middle"
          fill={solid ? colors.white : colors.body} fontSize={15}>{sub}</text>
      )}
    </g>
  )
}

/**
 * `labelAt` and `labelDy` exist because round 1 of this lab centred every label
 * on its arrow's midpoint, which is exactly where the socket box and the laptop
 * boundary sit. Three of the four candidates shipped an overprinted label and
 * all three passed typecheck. Place labels clear of what the arrow crosses.
 */
function Arrow({
  x1, y1, x2, y2, tone = colors.brand, dashed = false, label, labelAt, labelDy = -12, id,
}: { x1: number; y1: number; x2: number; y2: number; tone?: string; dashed?: boolean; label?: string; labelAt?: number; labelDy?: number; id: string }) {
  return (
    <g>
      <defs>
        <marker id={`ah-${id}`} viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={tone} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={tone} strokeWidth={2.5}
        strokeDasharray={dashed ? '7 7' : undefined} markerEnd={`url(#ah-${id})`} />
      {label && (
        <text x={labelAt ?? (x1 + x2) / 2} y={Math.min(y1, y2) + labelDy} textAnchor="middle"
          fill={tone} fontSize={16} fontWeight={600}>{label}</text>
      )}
    </g>
  )
}

function Stage({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-hidden>
      {children}
    </svg>
  )
}

/* ── SLIDE 9 · candidate A: client and daemon, the general lesson ─────── */

export const SOCKET_A_CAPTION =
  'The docker command does not build anything. It asks the daemon to do it'

export function SocketBridgeA() {
  return (
    <Stage>
      <Box x={70} y={150} w={230} title="docker CLI" sub="the command you type" />
      <Box x={800} y={150} w={230} title="Docker daemon" sub="does the actual work" tone={colors.brandDark} />
      <Arrow id="a1" x1={300} y1={172} x2={800} y2={172} label="build this image" labelAt={400} />
      <Arrow id="a2" x1={800} y1={212} x2={300} y2={212} tone={colors.muted} />
      <text x={700} y={245} textAnchor="middle" fill={colors.muted} fontSize={16}>
        progress, layer ids, errors
      </text>
      <rect x={508} y={120} width={84} height={130} rx={10} fill={colors.surface2} stroke={colors.brand} strokeWidth={2} />
      <text x={550} y={112} textAnchor="middle" fill={colors.brand} fontSize={16} fontWeight={700}>the socket</text>
      <text x={550} y={288} textAnchor="middle" fill={colors.body} fontSize={15}>/var/run/docker.sock</text>
      <text x={70} y={340} fill={colors.body} fontSize={17}>
        A thin client. Every instruction travels the wire.
      </text>
    </Stage>
  )
}

/* ── SLIDE 9 · candidate B: the same, but drawn inside the container ──── */

export const SOCKET_B_CAPTION =
  'Jenkins runs in a container. The daemon it talks to is on your machine'

export function SocketBridgeB() {
  return (
    <Stage>
      <Boundary x={40} y={70} w={470} h={250} label="Jenkins container" tone={colors.brand} />
      <Boundary x={560} y={70} w={500} h={250} label="Your machine, the host" tone={colors.ink} />
      <Box x={90} y={160} w={200} title="docker CLI" sub="installed inside" />
      <Box x={790} y={160} w={220} title="Docker daemon" sub="already running here" tone={colors.brandDark} />
      <Arrow id="b1" x1={290} y1={197} x2={790} y2={197} label="over the mounted socket" labelAt={393} labelDy={-18} />
      <rect x={496} y={140} width={128} height={112} rx={10} fill={colors.white} stroke={colors.accent} strokeWidth={2.5} />
      <text x={560} y={132} textAnchor="middle" fill={colors.accent} fontSize={16} fontWeight={700}>socket</text>
      <text x={560} y={205} textAnchor="middle" fill={colors.ink} fontSize={14}>docker.sock</text>
      <text x={40} y={360} fill={colors.body} fontSize={17}>
        The container never runs a daemon of its own. It borrows the host's.
      </text>
    </Stage>
  )
}

/* ── SLIDE 33 · candidate A: the tunnel, drawn as a straight path ─────── */

export const TUNNEL_A_CAPTION = 'A public address that forwards to your laptop'

export function TunnelPathA() {
  return (
    <Stage>
      <Box x={40} y={155} w={210} title="GitHub" sub="sends the webhook" tone={colors.ink} />
      <Box x={430} y={155} w={240} title="ngrok" sub="your dev domain" tone={colors.brand} solid />
      <Boundary x={830} y={90} w={230} h={210} label="Your laptop" tone={colors.ink} />
      <Box x={860} y={165} w={170} title="Jenkins" sub="localhost:8080" tone={colors.brandDark} />
      <Arrow id="t1" x1={250} y1={192} x2={430} y2={192} label="POST" />
      <Arrow id="t2" x1={670} y1={192} x2={860} y2={192} label="forwarded" labelAt={740} />
      <text x={40} y={350} fill={colors.body} fontSize={17}>
        GitHub never reaches your laptop directly. It reaches ngrok, which does.
      </text>
    </Stage>
  )
}

/* ── SLIDE 33 · candidate B: two phases, so WHY it works is visible ───── */

export const TUNNEL_B_CAPTION = 'Your laptop dials out first, and the reply rides back down that pipe'

export function TunnelPathB() {
  return (
    <Stage>
      <Box x={40} y={190} w={200} title="GitHub" sub="sends the webhook" tone={colors.ink} />
      <Box x={430} y={190} w={240} title="ngrok" sub="your dev domain" tone={colors.brand} solid />
      <Boundary x={830} y={120} w={230} h={210} label="Your laptop" tone={colors.ink} />
      <Box x={860} y={195} w={170} title="Jenkins" sub="localhost:8080" tone={colors.brandDark} />

      <text x={550} y={52} textAnchor="middle" fill={colors.accent} fontSize={17} fontWeight={700}>
        1. you run ngrok http 8080
      </text>
      <Arrow id="u1" x1={860} y1={95} x2={670} y2={95} tone={colors.accent} dashed
        label="the laptop opens the tunnel, outbound" labelAt={650} labelDy={-16} />

      <text x={340} y={300} textAnchor="middle" fill={colors.brand} fontSize={17} fontWeight={700}>
        2. the webhook fires
      </text>
      <Arrow id="u2" x1={240} y1={227} x2={430} y2={227} label="POST" />
      <Arrow id="u3" x1={670} y1={227} x2={860} y2={227} label="down the tunnel" labelAt={740} labelDy={-16} />

      <text x={40} y={378} fill={colors.body} fontSize={17}>
        No public address on your laptop. The pipe was opened from the inside.
      </text>
    </Stage>
  )
}
