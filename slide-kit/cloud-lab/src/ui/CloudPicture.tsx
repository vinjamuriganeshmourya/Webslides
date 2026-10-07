import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { T, E, c4 } from './figureTiming'

/**
 * CloudPicture — one illustration that grows through a deck.
 *
 * WHAT IT ARGUES
 *   A learner who meets a new diagram on every slide re-learns the drawing each
 *   time. This is ONE picture with a `state` prop, 1 to 5. Every element keeps
 *   its position, size and colour in every state it appears in, so on the last
 *   slide the room reads the whole of AWS networking in a picture they have
 *   known since the first.
 *
 *     0  a computer in someone else's building, reached over the internet
 *     1  a server has an address the Internet can reach, a laptop does not
 *     2  the rented computer is the same computer, in someone else's building
 *     3  your instances share a private network nobody else is on
 *     4  a subnet is a slice of the VPC in one building; two addresses
 *     5  the Security Group is the door list on the way in
 *
 * HOW IT MOVES, AND WHY
 *   Explanatory tier (`figureTiming.ts`): entrances 520ms, 130ms apart, lines
 *   trace at 860ms, the house ease-out. The motion tells the slide's sentence:
 *
 *     state 0  the laptop arrives, the building traces itself, the computer
 *              inside lands, then one solid line travels from the laptop to
 *              the computer and its light comes on. No addresses, no cloud.
 *              The building and the line are state 0's own: state 1 puts the
 *              Internet cloud where the line began, and the building returns
 *              in state 2 at the very same rectangle.
 *     state 1  two requests leave the Internet together. One travels to the
 *              server, lands, and the server's status light comes on. The other
 *              heads for the laptop and dies at a small cross; the laptop dims.
 *     state 2  the building draws itself around the server that was already
 *              there, then the layers inside settle one by one.
 *     state 3  the private network traces around the instance, a second
 *              instance arrives, the private link joins them.
 *     state 4  the three subnet floors fade in under the frame, then the two
 *              addresses.
 *     state 5  the gate arrives on the arrow, the arrow re-routes through it.
 *
 *   An element records the state it first appears in (`since`). On a slide
 *   showing state N, everything earlier mounts still at its final position and
 *   only the new layer animates. `revealFrom={1}` builds the whole picture.
 *   Nothing scales from 0; transforms and opacity only; `useInstant()` mounts
 *   everything at rest; reduced motion keeps the fades and the line draws and
 *   drops the travel.
 *
 * ONE COLOUR PER KIND OF LINE
 *   The public path is solid brand blue with an arrowhead. The private link
 *   between the two instances is teal. The VPC frame is dashed brandDeep, the
 *   data centre frame is dotted body grey, and the door list is accent orange.
 *   Five kinds of line, five looks, so no two can be confused where they meet.
 *   The public arrow enters the gate at its left edge and leaves from its right.
 *
 * WHY LABELS ARE DOM AND ONLY LINES ARE SVG
 *   Hard rule 17. The harnesses measure DOM rectangles and an `<svg>` is one
 *   rectangle to all three. Every label and card is a positioned element with an
 *   explicit width; the `<svg>` carries the cloud, arrows, frame strokes and the
 *   laptop glyph. Framer writes `transform` inline, so nothing here centres
 *   itself with a translate class: every block has an explicit `left`, `top`
 *   and `width`. Move a box, then look at all five renders.
 */

export type CloudPictureState = 0 | 1 | 2 | 3 | 4 | 5

const W = 1150
const H = 410

/* ── fixed geometry, shared by every state ──────────────────────────── */

/** The server, later the instance. Column 1 of the VPC, so it is narrow. */
const INST = { x: 520, y: 96, w: 170, h: 224 }
/** The second instance, column 2. */
const INST2 = { x: 745, y: 150, w: 160, h: 120 }
/** The VPC frame; three equal subnet columns in state 4. */
const VPC = { x: 500, y: 60, w: 630, h: 316 }
const COL_W = VPC.w / 3
/** The data centre. */
const DC = { x: 458, y: 8, w: 686, h: 396 }
/** The Internet cloud. */
const CLOUD = { cx: 135, cy: 200, rx: 105, ry: 62 }
const ARROW_Y = 208
/** The Security Group, on the arrow, just outside the VPC. Its name sits under it,
    because above it the public address label is already there. */
const GATE = { x: 378, y: 158, w: 106, h: 98 }
/** The laptop, below the cloud. */
const LAPTOP = { x: 46, y: 322, w: 72 }
/** Where the failing request dies. */
const CROSS = { x: 118, y: 300 }
/** State 0 only: the one line from the laptop to the computer. */
const LINE0 = (() => {
  const x1 = LAPTOP.x + LAPTOP.w + 6
  const y1 = LAPTOP.y + 24
  const x2 = INST.x - 10
  const y2 = ARROW_Y
  return { x1, y1, x2, y2, angle: (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI }
})()

/* ── motion ─────────────────────────────────────────────────────────── */

type Anim = { instant: boolean; reduce: boolean; revealFrom: number }

const at = (k: number) => T.lead + k * T.stagger
const ease = c4(E.out)

function Block({
  since, state, a, x, y, w, delay, children, className = '', dim,
}: {
  since: number
  state: number
  a: Anim
  x: number
  y: number
  w: number
  delay: number
  children: ReactNode
  className?: string
  /** Final opacity below 1, reached after `dim.at` seconds. */
  dim?: { to: number; at: number }
}) {
  if (since > state) return null
  const animates = !a.instant && since >= a.revealFrom
  const rest = { opacity: dim?.to ?? 1, transform: 'translateY(0px) scale(1)' }
  if (!animates) {
    return (
      <div className={`absolute ${className}`} style={{ left: x, top: y, width: w, opacity: rest.opacity }}>
        {children}
      </div>
    )
  }
  const from = a.reduce ? 'translateY(0px) scale(1)' : 'translateY(10px) scale(0.97)'
  return (
    <motion.div
      className={`absolute ${className}`}
      style={{ left: x, top: y, width: w }}
      initial={{ opacity: 0, transform: from }}
      animate={dim ? { opacity: [0, 1, 1, dim.to], transform: rest.transform } : rest}
      transition={
        dim
          ? {
              opacity: { duration: dim.at + T.enter - delay, delay, times: [0, T.enter / (dim.at + T.enter - delay), (dim.at - delay) / (dim.at + T.enter - delay), 1], ease },
              transform: { duration: T.enter, delay, ease },
            }
          : { duration: T.enter, delay, ease }
      }
    >
      {children}
    </motion.div>
  )
}

/** A frame or connector tracing itself. */
function Draw({
  since, state, a, delay, children, duration = T.draw,
}: { since: number; state: number; a: Anim; delay: number; children: ReactNode; duration?: number }) {
  if (since > state) return null
  const animates = !a.instant && since >= a.revealFrom
  return (
    <motion.g
      initial={animates ? { pathLength: 0, opacity: 0 } : false}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{
        pathLength: { duration, delay, ease },
        opacity: { duration: 0.01, delay },
      }}
    >
      {children}
    </motion.g>
  )
}

/** A shape fading up in place. */
function Fade({
  since, state, a, delay, children, duration = T.enter, to = 1,
}: { since: number; state: number; a: Anim; delay: number; children: ReactNode; duration?: number; to?: number }) {
  if (since > state) return null
  const animates = !a.instant && since >= a.revealFrom
  return (
    <motion.g
      initial={animates ? { opacity: 0 } : false}
      animate={{ opacity: to }}
      transition={{ duration, delay, ease }}
    >
      {children}
    </motion.g>
  )
}

/** A ring that expands and fades once, where an arrow lands. */
function Ping({ since, state, a, x, y, delay, tone }: { since: number; state: number; a: Anim; x: number; y: number; delay: number; tone: string }) {
  if (since > state) return null
  const animates = !a.instant && since >= a.revealFrom
  if (!animates) return null
  return (
    <motion.circle
      cx={x}
      cy={y}
      fill="none"
      stroke={tone}
      strokeWidth={2}
      initial={{ r: 4, opacity: 0.8 }}
      animate={{ r: 16, opacity: 0 }}
      transition={{ duration: T.accent, delay, ease }}
    />
  )
}

/* ── small DOM parts ────────────────────────────────────────────────── */

function Pill({ text, tone, mono = false, solid = false }: { text: string; tone: string; mono?: boolean; solid?: boolean }) {
  return (
    <span
      className={`inline-block rounded-pill px-3 py-0.5 text-xs font-semibold leading-5 shadow-card-soft ${mono ? 'font-mono' : ''}`}
      style={solid ? { background: tone, color: colors.white } : { background: colors.white, color: tone, border: `1px solid ${tone}` }}
    >
      {text}
    </span>
  )
}

function Address({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="text-center">
      <div className="text-[11px] font-semibold leading-4" style={{ color: tone }}>{label}</div>
      <div
        className="mt-0.5 rounded-lg bg-white px-2 py-0.5 font-mono text-xs font-semibold leading-5 tabular-nums text-ink shadow-card-soft"
        style={{ border: `1px solid ${tone}` }}
      >
        {value}
      </div>
    </div>
  )
}

/** Three drive slots, the honest detail that says "computer". */
function Slots({ tone = colors.line }: { tone?: string }) {
  return (
    <div className="flex flex-col gap-1">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-1.5 rounded-full" style={{ background: tone, opacity: 1 - i * 0.25 }} />
      ))}
    </div>
  )
}

/**
 * ServerGlyph — THE drawing of "a computer" in this deck. Exported so
 * `MachineCard`, `LockAndKey` and `TwoDoors` draw the identical box and the
 * room never sees two different servers. A name strip with a status light, a
 * one-line body, drive slots at the foot. `light` is the status dot: `'on'`,
 * `'off'`, or your own node when it has to animate.
 */
export function ServerGlyph({
  title = 'a server', sub = 'always on', h = 160, light = 'off', children, className = '',
}: { title?: string; sub?: string; h?: number; light?: 'on' | 'off' | ReactNode; children?: ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-white shadow-card ${className}`} style={{ height: h, border: `1px solid ${colors.line}` }}>
      <div className="flex h-[30px] items-center justify-between px-3" style={{ background: colors.surface2 }}>
        <span className="text-body-sm font-bold leading-none text-ink">{title}</span>
        <span className="relative block size-2.5 rounded-full" style={{ background: colors.line }}>
          {light === 'on' ? (
            <span className="absolute inset-0 rounded-full" style={{ background: colors.success, boxShadow: `0 0 0 3px ${colors.success}22` }} />
          ) : light === 'off' ? null : light}
        </span>
      </div>
      <div className="px-3 pt-1.5 text-[11px] leading-4" style={{ color: colors.body }}>{sub}</div>
      {children}
      <div className="absolute inset-x-3 bottom-3">
        <Slots />
      </div>
    </div>
  )
}

/** A server card whose light comes on when the request lands, only on the slide that plays it. */
function ServerCard({
  title, sub, h, since, lightDelay, a, children,
}: { title: string; sub: string; h: number; since: number; lightDelay: number; a: Anim; children?: ReactNode }) {
  const lightAnimates = !a.instant && since >= a.revealFrom
  return (
    <ServerGlyph
      title={title}
      sub={sub}
      h={h}
      light={
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ background: colors.success, boxShadow: `0 0 0 3px ${colors.success}22` }}
          initial={lightAnimates ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: T.label, delay: lightDelay, ease }}
        />
      }
    >
      {children}
    </ServerGlyph>
  )
}

/* ── the figure ─────────────────────────────────────────────────────── */

export function CloudPicture({
  state,
  revealFrom = state,
  className = '',
  publicAddress = '13.235.67.89',
  privateAddress = '172.31.8.142',
  vpcRange = '172.31.0.0/16',
  dataCentre = 'Amazon data centre, Mumbai',
  zones = ['ap-south-1a', 'ap-south-1b', 'ap-south-1c'],
  containers = ['backend', 'frontend'],
  doorList = [
    { port: '22', who: 'you' },
    { port: '8000', who: 'everyone' },
  ],
}: {
  state: CloudPictureState
  /** Elements from this state onward animate in; earlier ones mount still. */
  revealFrom?: number
  className?: string
  publicAddress?: string
  privateAddress?: string
  vpcRange?: string
  dataCentre?: string
  zones?: [string, string, string]
  containers?: [string, string]
  doorList?: { port: string; who: string }[]
}) {
  const instant = useInstant()
  const reduce = !!useReducedMotion()
  const a: Anim = { instant, reduce, revealFrom }
  const s = state

  /* The story's clock, in seconds, for the state-1 layer. */
  const tCloud = at(0)
  const tServer = at(1)
  const tArrow = at(2)
  const tLand = tArrow + T.draw
  const tLaptop = at(3)
  const tDie = tArrow + T.draw * 0.8
  const tDim = tDie + T.label
  /* State 0's clock: laptop, building, computer, then the line. */
  const tLine = at(3)

  /* The main arrow ends at the gate in state 5, otherwise at the server. */
  const arrowStart = CLOUD.cx + CLOUD.rx - 8
  const arrowEnd = (s >= 5 ? GATE.x - 3 : INST.x) - 10

  return (
    <div className={`relative mx-auto ${className}`} style={{ width: W, height: H }}>
      <svg
        className="absolute inset-0"
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="A server with a public address, reached from the Internet, growing into an EC2 instance inside a VPC"
      >
        {/* state 0: someone else's building, traced, and the one line from the laptop */}
        {s === 0 && (
          <>
            <Draw since={0} state={s} a={a} delay={at(1)}>
              <rect x={DC.x} y={DC.y} width={DC.w} height={DC.h} rx={22} fill={colors.white} fillOpacity={0.55} stroke={colors.body} strokeWidth={2} strokeDasharray="2 6" strokeLinecap="round" />
            </Draw>
            <Draw since={0} state={s} a={a} delay={tLine}>
              <line x1={LINE0.x1} y1={LINE0.y1} x2={LINE0.x2} y2={LINE0.y2} stroke={colors.brand} strokeWidth={3} strokeLinecap="round" />
            </Draw>
            <Fade since={0} state={s} a={a} delay={tLine + T.draw - T.label} duration={T.label}>
              <path d={`M${INST.x} ${ARROW_Y} l-12 -7 v14 z`} fill={colors.brand} transform={`rotate(${LINE0.angle} ${INST.x} ${ARROW_Y})`} />
            </Fade>
            <Ping since={0} state={s} a={a} x={INST.x} y={ARROW_Y} delay={tLine + T.draw} tone={colors.brand} />
            <Fade since={0} state={s} a={a} delay={at(0)}>
              <Laptop x={LAPTOP.x} y={LAPTOP.y} w={LAPTOP.w} />
            </Fade>
          </>
        )}

        {/* state 2: the building, filled then traced */}
        <Fade since={2} state={s} a={a} delay={at(0)}>
          <rect x={DC.x} y={DC.y} width={DC.w} height={DC.h} rx={22} fill={colors.white} opacity={0.55} />
        </Fade>
        <Draw since={2} state={s} a={a} delay={at(0)}>
          <rect x={DC.x} y={DC.y} width={DC.w} height={DC.h} rx={22} fill="none" stroke={colors.body} strokeWidth={2} strokeDasharray="2 6" strokeLinecap="round" />
        </Draw>

        {/* state 4: three subnet floors */}
        {[0, 1, 2].map((i) => (
          <Fade key={`col${i}`} since={4} state={s} a={a} delay={at(i)}>
            <rect x={VPC.x + i * COL_W + 5} y={VPC.y + 5} width={COL_W - 10} height={VPC.h - 10} rx={14} fill={colors.surface2} />
          </Fade>
        ))}

        {/* state 3: the private network */}
        <Draw since={3} state={s} a={a} delay={at(0)}>
          <rect x={VPC.x} y={VPC.y} width={VPC.w} height={VPC.h} rx={18} fill="none" stroke={colors.brandDeep} strokeWidth={2} strokeDasharray="9 7" />
        </Draw>

        {/* state 1: the Internet, two layered clouds for depth */}
        <Fade since={1} state={s} a={a} delay={tCloud}>
          <path d={cloudPath(CLOUD.cx + 8, CLOUD.cy + 8, CLOUD.rx, CLOUD.ry)} fill={colors.brand} opacity={0.14} />
          <path d={cloudPath(CLOUD.cx, CLOUD.cy, CLOUD.rx, CLOUD.ry)} fill={colors.white} stroke={colors.brand} strokeWidth={2} />
        </Fade>

        {/* state 1: the request that arrives */}
        <Draw since={1} state={s} a={a} delay={tArrow}>
          <line x1={arrowStart} y1={ARROW_Y} x2={arrowEnd} y2={ARROW_Y} stroke={colors.brand} strokeWidth={3} strokeLinecap="round" />
        </Draw>
        <Fade since={1} state={s} a={a} delay={tLand - T.label} duration={T.label}>
          <path d={`M${arrowEnd + 10} ${ARROW_Y} l-12 -7 v14 z`} fill={colors.brand} />
        </Fade>
        {s < 5 && <Ping since={1} state={s} a={a} x={arrowEnd + 10} y={ARROW_Y} delay={tLand} tone={colors.brand} />}

        {/* state 5: the same arrow, re-routed through the gate */}
        {s >= 5 && (
          <>
            <Draw since={5} state={s} a={a} delay={at(3)} duration={T.drawStep}>
              <line x1={GATE.x + GATE.w + 2} y1={ARROW_Y} x2={INST.x - 10} y2={ARROW_Y} stroke={colors.brand} strokeWidth={3} strokeLinecap="round" />
            </Draw>
            <Fade since={5} state={s} a={a} delay={at(3) + T.drawStep - T.label} duration={T.label}>
              <path d={`M${INST.x} ${ARROW_Y} l-12 -7 v14 z`} fill={colors.brand} />
            </Fade>
            <Ping since={5} state={s} a={a} x={INST.x} y={ARROW_Y} delay={at(3) + T.drawStep} tone={colors.brand} />
          </>
        )}

        {/* state 1: the request that dies on the way to the laptop */}
        <Draw since={1} state={s} a={a} delay={tArrow} duration={T.draw * 0.8}>
          <path
            d={`M${CLOUD.cx + 10} ${CLOUD.cy + CLOUD.ry * 0.55 + 2} C ${CLOUD.cx + 10} ${CLOUD.cy + 60}, ${CROSS.x + 6} ${CROSS.y - 40}, ${CROSS.x + 2} ${CROSS.y - 12}`}
            fill="none"
            stroke={colors.muted}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray="6 6"
          />
        </Draw>
        <Fade since={1} state={s} a={a} delay={tDie} duration={T.label}>
          <g stroke={colors.danger} strokeWidth={3} strokeLinecap="round">
            <path d={`M${CROSS.x - 6} ${CROSS.y - 6} l12 12`} />
            <path d={`M${CROSS.x + 6} ${CROSS.y - 6} l-12 12`} />
          </g>
        </Fade>

        {/* state 1: the laptop, which fades in whole and then dims */}
        <Fade since={1} state={s} a={a} delay={tLaptop}>
          <motion.g
            initial={!instant && revealFrom <= 1 ? { opacity: 1 } : false}
            animate={{ opacity: 0.5 }}
            transition={{ duration: T.enter, delay: tDim, ease }}
          >
            <Laptop x={LAPTOP.x} y={LAPTOP.y} w={LAPTOP.w} />
          </motion.g>
        </Fade>

        {/* state 3: the private link between the two instances */}
        <Draw since={3} state={s} a={a} delay={at(3)} duration={T.drawStep}>
          <line x1={INST.x + INST.w + 10} y1={ARROW_Y + 28} x2={INST2.x - 10} y2={ARROW_Y + 28} stroke={colors.tealDark} strokeWidth={3} strokeLinecap="round" />
        </Draw>
        <Fade since={3} state={s} a={a} delay={at(3) + T.drawStep - T.label} duration={T.label}>
          <path d={`M${INST.x + INST.w} ${ARROW_Y + 28} l12 -7 v14 z`} fill={colors.tealDark} />
          <path d={`M${INST2.x} ${ARROW_Y + 28} l-12 -7 v14 z`} fill={colors.tealDark} />
        </Fade>
      </svg>

      {/* ── DOM: cards and labels ─────────────────────────────────────── */}

      {/* state 0 */}
      {s === 0 && (
        <>
          <Block since={0} state={s} a={a} x={LAPTOP.x - 14} y={LAPTOP.y + LAPTOP.w * 0.62 + 16} w={LAPTOP.w + 28} delay={at(0) + T.stagger} className="text-center">
            <span className="text-body-sm font-bold text-ink">you</span>
          </Block>
          <Block since={0} state={s} a={a} x={210} y={222} w={140} delay={tLine + T.draw * 0.5} className="text-center">
            <span className="inline-block rounded bg-white px-2 text-body-sm font-semibold leading-6" style={{ color: colors.brand }}>the internet</span>
          </Block>
          <Block since={0} state={s} a={a} x={INST.x} y={INST.y} w={INST.w} delay={at(2)}>
            <ServerCard title="a computer" sub="always on" h={INST.h} since={0} lightDelay={tLine + T.draw} a={a} />
          </Block>
          <Block since={0} state={s} a={a} x={INST.x + 12} y={INST.y + 112} w={INST.w - 24} delay={at(2) + T.stagger} className="text-center">
            <span className="text-xs leading-4" style={{ color: colors.body }}>your app runs here</span>
          </Block>
          <Block since={0} state={s} a={a} x={DC.x + 18} y={DC.y - 12} w={260} delay={at(1) + T.stagger}>
            <Pill text="someone else's building" tone={colors.ink} solid />
          </Block>
        </>
      )}

      {/* state 1 */}
      <Block since={1} state={s} a={a} x={CLOUD.cx - 60} y={CLOUD.cy - 12} w={120} delay={tCloud + T.stagger} className="text-center">
        <span className="text-body-sm font-bold text-ink">the Internet</span>
      </Block>

      <Block since={1} state={s} a={a} x={250} y={ARROW_Y - 54} w={118} delay={tLand}>
        <Address label="public address" value={publicAddress} tone={colors.brand} />
      </Block>

      <Block since={1} state={s} a={a} x={INST.x} y={INST.y} w={INST.w} delay={tServer}>
        <ServerCard
          title={s >= 2 ? 'EC2 instance' : 'a server'}
          sub={s >= 2 ? 'rented, always on' : 'always on'}
          h={INST.h}
          since={1}
          lightDelay={tLand}
          a={a}
        />
      </Block>

      {s === 1 && (
        <Block since={1} state={s} a={a} x={INST.x + 12} y={INST.y + 112} w={INST.w - 24} delay={tServer + T.stagger} className="text-center">
          <span className="text-xs leading-4" style={{ color: colors.body }}>your app runs here</span>
        </Block>
      )}

      <Block since={1} state={s} a={a} x={LAPTOP.x + LAPTOP.w + 14} y={LAPTOP.y + 6} w={130} delay={tLaptop} dim={{ to: 0.6, at: tDim }}>
        <div className="text-body-sm font-bold leading-5 text-ink">your laptop</div>
        <div className="text-xs leading-4" style={{ color: colors.body }}>no public address</div>
      </Block>

      {/* state 2: the layers inside the instance */}
      <Block since={2} state={s} a={a} x={INST.x + 12} y={INST.y + 62} w={INST.w - 24} delay={at(2)}>
        <div className="rounded-md px-2 py-1 text-center text-[11px] font-semibold leading-4 text-white shadow-card-soft" style={{ background: colors.brandDark }}>
          Docker Engine
        </div>
      </Block>
      {containers.map((c, i) => (
        <Block
          key={c}
          since={2}
          state={s}
          a={a}
          x={INST.x + 12 + i * ((INST.w - 24) / 2 + 3)}
          y={INST.y + 92}
          w={(INST.w - 24) / 2 - 3}
          delay={at(3 + i)}
        >
          <div className="rounded-md px-1 py-1.5 text-center text-[11px] font-semibold leading-4 shadow-card-soft" style={{ background: colors.white, border: `1px solid ${colors.teal}`, color: colors.tealDark }}>
            {c}
            <div className="text-[10px] font-normal leading-3" style={{ color: colors.body }}>container</div>
          </div>
        </Block>
      ))}

      <Block since={2} state={s} a={a} x={DC.x + 18} y={DC.y - 12} w={240} delay={at(1)}>
        <Pill text={dataCentre} tone={colors.ink} solid />
      </Block>

      {/* state 3: the VPC label and the second instance */}
      <Block since={3} state={s} a={a} x={VPC.x + 18} y={VPC.y - 12} w={210} delay={at(1)}>
        <Pill text={`VPC  ${vpcRange}`} tone={colors.brandDeep} mono />
      </Block>

      <Block since={3} state={s} a={a} x={INST2.x} y={INST2.y} w={INST2.w} delay={at(2)}>
        <ServerCard title="instance 2" sub="also yours" h={INST2.h} since={3} lightDelay={at(2) + T.enter} a={a} />
      </Block>

      <Block since={3} state={s} a={a} x={INST.x + INST.w + 2} y={ARROW_Y + 40} w={INST2.x - INST.x - INST.w - 4} delay={at(3) + T.drawStep} className="text-center">
        <span className="inline-block rounded bg-white px-1.5 text-[11px] font-semibold leading-4" style={{ color: colors.tealDark }}>private</span>
      </Block>

      {/* state 4: subnet labels and the private address */}
      {zones.map((z, i) => (
        <Block key={z} since={4} state={s} a={a} x={VPC.x + i * COL_W + 12} y={VPC.y + VPC.h - 48} w={COL_W - 24} delay={at(i) + T.stagger} className="text-center">
          <div className="text-[11px] leading-4" style={{ color: colors.body }}>subnet in</div>
          <div className="font-mono text-xs font-semibold leading-4 text-ink">{z}</div>
        </Block>
      ))}

      <Block since={4} state={s} a={a} x={INST.x + 12} y={INST.y + INST.h - 82} w={INST.w - 24} delay={at(4)}>
        <Address label="private address" value={privateAddress} tone={colors.brandDark} />
      </Block>

      {/* state 5: the gate */}
      <Block since={5} state={s} a={a} x={GATE.x - 12} y={GATE.y + GATE.h + 6} w={GATE.w + 24} delay={at(0)} className="text-center">
        <span className="text-[11px] font-bold leading-4" style={{ color: colors.accentDark }}>Security Group</span>
      </Block>
      <Block since={5} state={s} a={a} x={GATE.x} y={GATE.y} w={GATE.w} delay={at(1)}>
        <div className="overflow-hidden rounded-xl bg-white shadow-card" style={{ height: GATE.h, border: `1px solid ${colors.accent}` }}>
          <div className="flex h-[26px] items-center justify-center gap-1.5 text-[11px] font-semibold leading-none text-white" style={{ background: colors.accent }}>
            <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden><rect x="0.5" y="0.5" width="9" height="11" rx="2" fill="none" stroke="currentColor" /><circle cx="7" cy="6" r="1" fill="currentColor" /></svg>
            the door list
          </div>
          <div className="flex flex-col gap-1 px-2.5 pt-2">
            {doorList.map((d) => (
              <div key={d.port} className="flex items-baseline justify-between text-[11px] leading-4">
                <span className="font-mono font-semibold tabular-nums" style={{ color: colors.accentDark }}>{d.port}</span>
                <span style={{ color: colors.body }}>{d.who}</span>
              </div>
            ))}
          </div>
        </div>
      </Block>
    </div>
  )
}

/* ── glyphs ─────────────────────────────────────────────────────────── */

/** A cloud silhouette: a flat base with four rounded lobes. */
function cloudPath(cx: number, cy: number, rx: number, ry: number) {
  const l = cx - rx
  const r = cx + rx
  const b = cy + ry * 0.55
  return [
    `M ${l + rx * 0.3} ${b}`,
    `A ${rx * 0.32} ${ry * 0.55} 0 0 1 ${l + rx * 0.22} ${cy - ry * 0.05}`,
    `A ${rx * 0.4} ${ry * 0.7} 0 0 1 ${cx - rx * 0.22} ${cy - ry * 0.7}`,
    `A ${rx * 0.5} ${ry * 0.9} 0 0 1 ${cx + rx * 0.42} ${cy - ry * 0.62}`,
    `A ${rx * 0.4} ${ry * 0.68} 0 0 1 ${r - rx * 0.1} ${cy + ry * 0.05}`,
    `A ${rx * 0.34} ${ry * 0.55} 0 0 1 ${r - rx * 0.3} ${b}`,
    'Z',
  ].join(' ')
}

/**
 * LaptopGlyph — the same laptop as a standalone `<svg>`, for figures that place
 * it in the DOM (`LockAndKey`, `OwnVsRented`). `screen` is the screen colour;
 * the default is the dim screen every state here draws.
 */
export function LaptopGlyph({ w, screen = colors.surface2, className = '' }: { w: number; screen?: string; className?: string }) {
  const h = Math.round(w * 0.62 + 10)
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className={className} aria-hidden>
      <Laptop x={0} y={0} w={w} screen={screen} />
    </svg>
  )
}

/** A laptop: a screen with a bezel and a base with a trackpad. */
function Laptop({ x, y, w, screen = colors.surface2 }: { x: number; y: number; w: number; screen?: string }) {
  const sh = w * 0.62
  return (
    <g>
      <rect x={x + 6} y={y} width={w - 12} height={sh} rx={5} fill={colors.ink} />
      <rect x={x + 10} y={y + 4} width={w - 20} height={sh - 10} rx={2} fill={screen} />
      <path d={`M${x} ${y + sh + 8} h${w} l-5 -8 h-${w - 10} z`} fill={colors.body} />
      <rect x={x + w / 2 - 8} y={y + sh + 2} width={16} height={3} rx={1.5} fill={colors.muted} />
    </g>
  )
}
