import type { CSSProperties, ReactNode } from 'react'
import { DoorOpen, KeyRound, Lock, SearchCheck } from 'lucide-react'
import { colors } from '@/design/tokens'
import { DataTable } from '@/ui'
import { useInstant } from '@/motion/instant'
import { Arrow, At, BOX_W, Card, Fade, Label, REDUCED, STILL, Traveller, useCycle } from '../scene'
import { TILE_SKIN } from '../card'
import { IsoAnalogy, PointsFigure, lead } from '../iso/frames'
import { ClayInstitution, LAB } from '../d3/kit'
import { Boundary, Gateway, LockBadge, Mono, NET, NoMark, Resource, SubnetBox, litRing } from './frames'

/**
 * SECTION 5 · NETWORK SECURITY CONTROLS (T19-1 to T23-1). The two filters of
 * a VPC drawn with this session's pieces: a security group as a ring on the
 * instance, a network ACL as a bar on the subnet boundary. Every label is a
 * word the card already has; the rule-table values are the TR image's own.
 *
 * Each figure runs ONE loop whose motion is the card's press sequence:
 *   T19-1   two rings appear faint, the inner one becomes solid, the outer one, then both are lit
 *   T19-AN  the door pair and the checkpoint pair light in turn, on one clock both scenes read
 *   T20-1   a request reaches the interface through the group, the tables fill, every row lights
 *           at once, the reply passes back out marked automatic
 *   T20-2   the console chip, then a second group attaches to the same instance
 *   T21-1   a request and a reply are each checked at the ACL, the allow or deny words, the
 *           first matching row, the reply's own row
 *   T21-2   every instance of one subnet lights behind its one ACL, then the console chip
 *   T23-1   the funnel's mouth, then its two stages, then one label per point
 * On harness URLs every loop holds its most complete state.
 */

const EASE = 'cubic-bezier(0.22,1,0.36,1)'

/** Harness URLs, reduced motion and picker thumbnails hold every loop at its still frame: no packet rides, none rests on an arrow head. */
function useHeld() {
  const instant = useInstant()
  return STILL || REDUCED || instant
}

/* ------------------------------------------------------------------ local pieces */

/** A plain line between two stage points, no head (the attachment lines of the TR images). */
function Line({ x1, y1, x2, y2, tone = NET.boundary, width = 2.5, on = true, dashed = false }: { x1: number; y1: number; x2: number; y2: number; tone?: string; width?: number; on?: boolean; dashed?: boolean }) {
  const instant = useInstant()
  const minX = Math.floor(Math.min(x1, x2) - width)
  const minY = Math.floor(Math.min(y1, y2) - width)
  const maxX = Math.ceil(Math.max(x1, x2) + width)
  const maxY = Math.ceil(Math.max(y1, y2) + width)
  return (
    <svg aria-hidden className="pointer-events-none absolute" style={{ left: minX, top: minY, overflow: 'visible' }} width={maxX - minX} height={maxY - minY}>
      <path d={`M ${x1 - minX} ${y1 - minY} L ${x2 - minX} ${y2 - minY}`} stroke={tone} strokeWidth={width} strokeLinecap="round" fill="none" strokeDasharray={dashed ? '7 7' : undefined} style={{ opacity: on ? 1 : 0, transition: instant ? 'none' : `opacity 420ms ${EASE}, stroke 420ms ${EASE}` }} />
    </svg>
  )
}

type RuleRow = { cells: ReactNode[]; lit?: boolean; tone?: string }

/**
 * A rule table with three columns, 14px, the look of `MiniRouteTable`: the
 * heads on a tinted row, then each rule. `show` false keeps the rows' height
 * but hides their words (the empty table a card opens with); `litAll` lights
 * every row at once (no order mark); a row's own `lit` rings that row.
 */
function RuleTable({ heads, rows, w, cols = '1.5fr 1fr 0.8fr', size = 14, title, show = true, litAll = false, lit = false }: {
  heads: ReactNode[]; rows: RuleRow[]; w: number; cols?: string; size?: number; title?: ReactNode; show?: boolean; litAll?: boolean; lit?: boolean
}) {
  const instant = useInstant()
  const ease = instant ? 'none' : `all 420ms ${EASE}`
  return (
    <div className="overflow-hidden rounded-[12px]" style={{ width: w, ...TILE_SKIN, boxShadow: litRing(lit, TILE_SKIN.boxShadow as string), transition: ease }}>
      {title !== undefined && (
        <div className="flex items-center px-3 font-heading font-semibold leading-tight" style={{ height: 26, fontSize: size, color: colors.white, background: NET.lock }}>
          {title}
        </div>
      )}
      <div className="grid" style={{ gridTemplateColumns: cols }}>
        {heads.map((h, i) => (
          <div key={i} className="flex items-center whitespace-nowrap px-3 font-heading font-semibold leading-tight" style={{ height: 30, fontSize: size, color: colors.brandDark, background: colors.surface2 }}>
            {h}
          </div>
        ))}
        {rows.map((r, i) => {
          const on = litAll || !!r.lit
          const tone = r.tone ?? NET.lit
          return (
            <div key={i} className="contents">
              {r.cells.map((c, j) => (
                <div
                  key={j}
                  className="flex items-center whitespace-nowrap px-3 leading-tight"
                  style={{ height: 30, fontSize: size, color: colors.ink, borderTop: `1px solid ${colors.line}`, background: on ? `${tone}26` : undefined, boxShadow: on && j === 0 ? `inset 3px 0 0 0 ${tone}` : undefined, opacity: show ? 1 : 0, transition: ease }}
                >
                  {c}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** The network interface: a small pill on an instance tile's right edge, in the lock tone. */
function Interface({ x, y, h = 44 }: { x: number; y: number; h?: number }) {
  return <At x={x} y={y}><span aria-hidden className="block rounded-full" style={{ width: 10, height: h, background: NET.lock, boxShadow: `0 0 0 2px ${colors.white}` }} /></At>
}

/** The network ACL as a bar on a subnet boundary: the lock tone, a padlock on it. */
function AclBar({ x, y, w = 16, h = 76, lit = false, icon = 12 }: { x: number; y: number; w?: number; h?: number; lit?: boolean; icon?: number }) {
  const instant = useInstant()
  return (
    <At x={x} y={y}>
      <span aria-hidden className="grid place-items-center rounded-[8px]" style={{ width: w, height: h, background: lit ? NET.lit : NET.lock, color: colors.white, boxShadow: `0 0 0 2px ${colors.white}, 0 8px 16px -8px rgba(16,32,58,0.6)`, transition: instant ? 'none' : `background 420ms ${EASE}` }}>
        <Lock style={{ width: icon, height: icon, strokeWidth: 2.6 }} />
      </span>
    </At>
  )
}

/* the TR image's rule rows (slide-20-1.png), the only values this section may use */
const SG1_IN: RuleRow[] = [
  { cells: [<Mono key="a">198.51.100.0/24</Mono>, 'TCP', <Mono key="p">22</Mono>] },
  { cells: ['Subnet A CIDR', 'All', 'All'] },
]
const SG1_OUT: RuleRow[] = [{ cells: [<Mono key="a">0.0.0.0/0</Mono>, 'All', 'All'] }]
const SG2_IN: RuleRow[] = [
  { cells: ['Subnet B CIDR', 'All', 'All'] },
  { cells: ['Subnet A CIDR', 'TCP', <Mono key="p">22</Mono>] },
]
const IN_HEADS = ['Source', 'Protocol', 'Port']
const OUT_HEADS = ['Destination', 'Protocol', 'Port']

/* ===== T19-1 · Two filters, two places */

const T19_POINTS = [
  'Two controls do this at different points in the network',
  "Security groups filter traffic at the individual instance's network interface",
  'Network ACLs (Access Control Lists) filter traffic at the subnet boundary',
  'Least-privilege design combines both controls so only the traffic a workload truly needs is allowed',
]

/* containment as boxes inside boxes: the VPC, one subnet, one instance; the rings around the instance and along the subnet boundary */
const T19 = {
  vpc: { x: 40, y: 44, w: 554, h: 300 },
  sub: { x: 72, y: 96, w: 256, h: 212 },
  inst: { cx: 200, cy: 212, size: 56 },
  inner: { x: 150, y: 162, w: 100, h: 100 },
  outer: { x: 58, y: 82, w: 284, h: 240 },
  other: { cx: 500, cy: 212, size: 40 },
} as const

function TwoFiltersScene() {
  /* press 1 draws the box; 2 outlines two faint rings; 3 the inner ring is solid; 4 the outer; 5 both lit */
  const k = useCycle(5, 2400, 4)
  const rings = k >= 1
  const innerSolid = k >= 2
  const outerSolid = k >= 3
  const both = k >= 4
  const lineX1 = T19.inst.cx + T19.inst.size / 2
  const lineX2 = T19.other.cx - T19.other.size / 2
  return (
    <>
      <At x={T19.vpc.x} y={T19.vpc.y}>
        <Boundary w={T19.vpc.w} h={T19.vpc.h} label="VPC" />
      </At>
      <At x={T19.sub.x} y={T19.sub.y}>
        <SubnetBox w={T19.sub.w} h={T19.sub.h} label="subnet" />
      </At>
      {/* the local route: every resource reaches every other */}
      <span aria-hidden className="absolute rounded-full" style={{ left: lineX1, top: T19.inst.cy - 1.5, width: lineX2 - lineX1, height: 3, background: NET.boundary }} />
      <At x={(T19.outer.x + T19.outer.w + lineX2) / 2} y={T19.inst.cy + 12} cx>
        <Label size={14} strong raised>
          local route
        </Label>
      </At>
      <At x={T19.other.cx} y={T19.other.cy} cx cy>
        <Resource size={T19.other.size} />
      </At>
      {/* the outer ring, along the subnet boundary */}
      <Fade on={rings} lift={0} className="absolute" style={{ left: T19.outer.x, top: T19.outer.y }}>
        <Boundary w={T19.outer.w} h={T19.outer.h} tone={outerSolid ? NET.lock : colors.muted} solid={outerSolid} fill={outerSolid ? `${NET.lock}0A` : 'transparent'} lit={both} />
      </Fade>
      {/* the inner ring, tight around the instance */}
      <Fade on={rings} lift={0} className="absolute" style={{ left: T19.inner.x, top: T19.inner.y }}>
        <Boundary w={T19.inner.w} h={T19.inner.h} tone={innerSolid ? NET.lock : colors.muted} solid={innerSolid} fill={innerSolid ? `${NET.lock}14` : 'transparent'} lit={both} radius={14} />
      </Fade>
      <At x={T19.inst.cx} y={T19.inst.cy} cx cy>
        <Resource size={T19.inst.size} lit={both} />
      </At>
      {/* the security group chip on the inner ring's top-right corner, the side the network interface (the local route's end) is on */}
      <Fade on={innerSolid} className="absolute" style={{ left: T19.inner.x + T19.inner.w, top: T19.inner.y - 12 }}>
        <div style={{ transform: 'translateX(-50%)' }}>
          <Label size={14} strong tone={both ? 'solid' : 'brand'} raised>
            security group
          </Label>
        </div>
      </Fade>
      {/* the network ACL chip on the outer ring's bottom edge, at the subnet boundary */}
      <Fade on={outerSolid} className="absolute" style={{ left: T19.outer.x + T19.outer.w / 2, top: T19.outer.y + T19.outer.h - 12 }}>
        <div style={{ transform: 'translateX(-50%)' }}>
          <Label size={14} strong tone={both ? 'solid' : 'brand'} raised>
            network ACL
          </Label>
        </div>
      </Fade>
    </>
  )
}

export function TwoFilters({ lesson }: { lesson: string }) {
  return (
    <PointsFigure
      id="T19-1"
      kicker="Network Security Layers"
      title="Two Control Types"
      lead="Inside a VPC, the local route makes every resource reachable from every other, so filters must decide which traffic is allowed"
      lesson={lesson}
      points={T19_POINTS}
      figure={<TwoFiltersScene />}
      pointSize={17}
    />
  )
}

/* ===== T19-AN · Analogy: A door and a checkpoint */

const AN_H = 400
/* the two pairs sit at the same heights on both stages: the door and the security group, the checkpoint and the ACL */
const AN = {
  doorIn: 84,
  doorOut: 118,
  gateIn: 288,
  gateOut: 314,
  right: 420,
} as const

/** The door pair lights, then the checkpoint pair, then a hold with neither lit; both scenes read this one clock. */
function useAnalogyPair() {
  return useCycle(3, 2400, 2)
}

function DoorCheckpointFamiliar() {
  const k = useAnalogyPair()
  const held = useHeld()
  const door = k === 0
  const gate = k === 1
  const hold = k === 2
  const doorTone = door || hold ? colors.brand : colors.muted
  const gateTone = gate || hold ? colors.brand : colors.muted
  const tag = (on: boolean): 'solid' | 'plain' => (on ? 'solid' : 'plain')
  return (
    <>
      {/* ---- the two-way door with its electronic access system */}
      <At x={24} y={24}>
        <Label size={14} strong tone={tag(door)}>
          two-way door
        </Label>
      </At>
      <At x={24} y={60}>
        <span className="grid place-items-center rounded-[16px]" style={{ width: 80, height: 80, ...TILE_SKIN, color: colors.brandDark }} aria-hidden>
          <DoorOpen size={46} strokeWidth={1.8} />
        </span>
      </At>
      {/* the card reader on the door's frame */}
      <At x={110} y={86}>
        <span className="grid place-items-center rounded-[5px]" style={{ width: 20, height: 30, background: LAB.navy, color: colors.white, boxShadow: `0 0 0 2px ${colors.white}` }} aria-hidden>
          <KeyRound size={11} strokeWidth={2.4} />
          <span className="absolute rounded-full" style={{ left: 7, top: 3, width: 6, height: 6, background: LAB.green, boxShadow: `0 0 6px ${LAB.green}` }} />
        </span>
      </At>
      <At x={24} y={156}>
        <Label size={14} strong tone={tag(door)}>
          electronic access system
        </Label>
      </At>
      <Arrow x1={AN.right} y1={AN.doorIn} x2={134} y2={AN.doorIn} tone={doorTone} />
      <Arrow x1={134} y1={AN.doorOut} x2={AN.right} y2={AN.doorOut} tone={doorTone} />
      <At x={277} y={AN.doorIn - 30} cx>
        <Label size={14} tone={tag(door)}>
          allowed connection is established
        </Label>
      </At>
      <At x={277} y={AN.doorOut + 8} cx>
        <Label size={14} tone={tag(door)}>
          response traffic can pass back automatically
        </Label>
      </At>
      {/* one dot goes in through the door and comes back out by itself */}
      <Traveller path={[[AN.right, AN.doorIn], [134, AN.doorIn], [134, AN.doorOut], [AN.right, AN.doorOut]]} run={door && !held} k={`door-${k}`} dur={2.2} />

      {/* ---- the security checkpoint at the entrance and exit of a campus */}
      <At x={24} y={204}>
        <Label size={14} strong tone={tag(gate)}>
          security checkpoint
        </Label>
      </At>
      <At x={190} y={204}>
        <Label size={14} strong tone={tag(gate)}>
          entrance and exit of a campus
        </Label>
      </At>
      <At x={24} y={248}>
        <ClayInstitution w={96} />
      </At>
      {/* the guard post and the barrier arm across both lanes */}
      <At x={124} y={226}>
        <span aria-hidden className="block rounded-[4px]" style={{ width: 52, height: 8, background: LAB.navy }} />
      </At>
      <At x={128} y={234}>
        <span aria-hidden className="relative block rounded-[6px]" style={{ width: 44, height: 32, background: LAB.lavender, boxShadow: `inset 0 0 0 2px ${LAB.navy}` }}>
          <span className="absolute rounded-[3px]" style={{ left: 8, top: 8, width: 28, height: 12, background: LAB.sky }} />
        </span>
      </At>
      <At x={146} y={268}>
        <span aria-hidden className="block rounded-[6px]" style={{ width: 12, height: 66, background: `repeating-linear-gradient(45deg, ${LAB.red} 0 8px, ${colors.white} 8px 16px)`, boxShadow: `inset 0 0 0 1.5px ${LAB.navy}` }} />
      </At>
      <Arrow x1={AN.right} y1={AN.gateIn} x2={162} y2={AN.gateIn} tone={gateTone} />
      <Arrow x1={162} y1={AN.gateOut} x2={AN.right} y2={AN.gateOut} tone={gateTone} />
      <At x={24} y={342}>
        <Label size={14} tone={tag(gate)}>
          each packet is checked against the rules independently
        </Label>
      </At>
      {/* two separate packets, one in each lane, each stopped at the barrier on its own */}
      <Traveller path={[[AN.right, AN.gateIn], [162, AN.gateIn]]} run={gate && !held} k={`in-${k}`} dur={1.6} />
      <Traveller path={[[162, AN.gateOut], [AN.right, AN.gateOut]]} run={gate && !held} k={`out-${k}`} dur={1.6} tone={colors.teal} />
    </>
  )
}

function DoorCheckpointConcept() {
  const k = useAnalogyPair()
  const held = useHeld()
  const sg = k === 0
  const acl = k === 1
  const hold = k === 2
  const sgTone = sg || hold ? colors.brand : colors.muted
  const aclTone = acl || hold ? colors.brand : colors.muted
  return (
    <>
      {/* ---- the security group: a ring on the instance; a request goes in, its reply comes back by itself */}
      <At x={24} y={44}>
        <Boundary w={104} h={104} solid tone={NET.lock} fill={`${NET.lock}14`} lit={sg} radius={16} label="security group" labelTone={sg ? 'solid' : 'brand'} />
      </At>
      <At x={76} y={96} cx cy>
        <Resource size={64} lit={sg} />
      </At>
      <Arrow x1={AN.right} y1={AN.doorIn} x2={131} y2={AN.doorIn} tone={sgTone} />
      <Arrow x1={131} y1={AN.doorOut} x2={AN.right} y2={AN.doorOut} tone={sgTone} />
      <Traveller path={[[AN.right, AN.doorIn], [131, AN.doorIn], [131, AN.doorOut], [AN.right, AN.doorOut]]} run={sg && !held} k={`sg-${k}`} dur={2.2} />

      {/* ---- the network ACL: a bar on the subnet boundary; each packet is checked on its own */}
      <At x={24} y={204}>
        <Label size={14} strong tone={acl ? 'solid' : 'brand'}>
          network ACL
        </Label>
      </At>
      <At x={24} y={240}>
        <SubnetBox w={110} h={110} lit={acl} />
      </At>
      <At x={79} y={295} cx cy>
        <Resource size={44} />
      </At>
      <AclBar x={126} y={263} lit={acl} />
      <Arrow x1={AN.right} y1={AN.gateIn} x2={144} y2={AN.gateIn} tone={aclTone} />
      <Arrow x1={144} y1={AN.gateOut} x2={AN.right} y2={AN.gateOut} tone={aclTone} />
      <Traveller path={[[AN.right, AN.gateIn], [144, AN.gateIn]]} run={acl && !held} k={`in-${k}`} dur={1.6} />
      <Traveller path={[[144, AN.gateOut], [AN.right, AN.gateOut]]} run={acl && !held} k={`out-${k}`} dur={1.6} tone={colors.teal} />
    </>
  )
}

export function DoorCheckpointAnalogy({ lesson }: { lesson: string }) {
  return (
    <IsoAnalogy
      id="T19-AN"
      kicker="Network Security Layers"
      title="A two-way access door, and a campus checkpoint"
      lesson={lesson}
      bare
      h={AN_H}
      everyday={{ label: 'A two-way access door, and a campus checkpoint', scene: <DoorCheckpointFamiliar /> }}
      cloud={{ label: 'A security group, and a network ACL', scene: <DoorCheckpointConcept /> }}
    />
  )
}

/* ===== T20-1 · How a security group filters */

const T20_POINTS = [
  'Being stateful, it automatically permits the return traffic of a connection it already allowed, without needing a matching reverse rule',
  'Only allow rules exist; inbound traffic is blocked unless a rule permits it, while a new group allows all outbound traffic by default',
  'All rules in a group are evaluated together, not checked in a fixed order',
  'Reply traffic for an already-permitted request is tracked and let through automatically',
]

/* the instance on the left, the group (its two tables) in the middle, the outside lane on the right */
const T20 = {
  inst: { x: 24, y: 93, size: 64 },
  group: { x: 200, y: 36, w: 300, h: 246 },
  table: { x: 214, w: 272, inY: 52, outY: 180 },
  laneIn: 110,
  laneOut: 140,
  edge: 606,
  /** the scene is 246 tall on a 380 stage: moved down so it sits centred */
  offY: 40,
} as const

function SecurityGroupScene() {
  /* press 1 the instance and the empty table; 2 the request arrow; 3 the rows; 4 every row at once; 5 the reply, automatic */
  const k = useCycle(5, 2400, 4)
  const held = useHeld()
  const request = k >= 1
  const filled = k >= 2
  const together = k >= 3
  const reply = k >= 4
  const ifaceX = T20.inst.x + T20.inst.size + 8
  return (
    <At x={0} y={T20.offY}>
      <At x={T20.inst.x} y={T20.inst.y}>
        <Resource size={T20.inst.size} />
      </At>
      <Interface x={T20.inst.x + T20.inst.size - 5} y={T20.inst.y + 10} />
      <At x={T20.inst.x} y={T20.inst.y + T20.inst.size + 10}>
        <Label size={14} strong raised>
          network interface
        </Label>
      </At>
      {/* the group: one box around both tables, attached to the interface */}
      <At x={T20.group.x} y={T20.group.y}>
        <Boundary w={T20.group.w} h={T20.group.h} solid tone={NET.lock} label="security group" />
      </At>
      <At x={T20.table.x} y={T20.table.inY}>
        <RuleTable title="inbound" heads={IN_HEADS} rows={SG1_IN} w={T20.table.w} show={filled} litAll={together} />
      </At>
      <Fade on={filled} className="absolute" style={{ left: T20.table.x, top: T20.table.outY }}>
        <RuleTable title="outbound" heads={OUT_HEADS} rows={SG1_OUT} w={T20.table.w} litAll={together} />
      </Fade>
      {/* the request: in from the outside, through the group, to the interface */}
      <Arrow x1={T20.edge} y1={T20.laneIn} x2={T20.group.x + T20.group.w + 2} y2={T20.laneIn} on={request} />
      <Arrow x1={T20.group.x - 2} y1={T20.laneIn} x2={ifaceX} y2={T20.laneIn} on={request} />
      <Traveller path={[[T20.edge, T20.laneIn], [T20.group.x + T20.group.w, T20.laneIn], [T20.group.x, T20.laneIn], [ifaceX, T20.laneIn]]} run={k === 1 && !held} k={`req-${k}`} dur={2.2} />
      {/* the reply: back out with no rule beside it */}
      <Arrow x1={ifaceX} y1={T20.laneOut} x2={T20.group.x - 2} y2={T20.laneOut} on={reply} tone={colors.teal} />
      <Arrow x1={T20.group.x + T20.group.w + 2} y1={T20.laneOut} x2={T20.edge} y2={T20.laneOut} on={reply} tone={colors.teal} />
      <Traveller path={[[ifaceX, T20.laneOut], [T20.group.x, T20.laneOut], [T20.group.x + T20.group.w, T20.laneOut], [T20.edge, T20.laneOut]]} run={k === 4 && !held} k={`rep-${k}`} dur={2.2} tone={colors.teal} />
      <Fade on={reply} className="absolute" style={{ left: T20.group.x + T20.group.w + 8, top: T20.laneOut + 12 }}>
        <Label size={14} strong tone="good" raised>
          automatic
        </Label>
      </Fade>
    </At>
  )
}

export function SecurityGroup({ lesson }: { lesson: string }) {
  return (
    <PointsFigure
      id="T20-1"
      kicker="Security Groups Explained"
      title="Stateful Instance Filter"
      lead="A security group attaches to an instance's network interface and acts as a virtual firewall for that instance"
      lesson={lesson}
      points={T20_POINTS}
      figure={<SecurityGroupScene />}
      pointSize={16}
    />
  )
}

/* ===== T20-2 · Where it is managed, and stacking */

const T20B_POINTS = [
  'Managed on the EC2 Security Groups console page, attached per instance or interface',
  'Multiple security groups can attach to one instance, and their allowed rules combine',
]

const T20B = {
  inst: { x: 24, y: 148, size: 64 },
  g1: { x: 230, y: 36, w: 340, h: 110 },
  g2: { x: 230, y: 190, w: 340, h: 110 },
  table: { x: 244, w: 312 },
} as const

function StackingScene() {
  /* press 1 the instance and its one group; 2 the console chip; 3 a second group attaches, its rows joining the first's */
  const k = useCycle(3, 2400, 2)
  const console = k >= 1
  const second = k >= 2
  const ifaceX = T20B.inst.x + T20B.inst.size + 8
  const ifaceY = T20B.inst.y + T20B.inst.size / 2
  return (
    <>
      <At x={T20B.inst.x} y={T20B.inst.y}>
        <Resource size={T20B.inst.size} />
      </At>
      <Interface x={T20B.inst.x + T20B.inst.size - 5} y={T20B.inst.y + 10} />
      {/* the attachment lines, from the interface to each group's edge */}
      <Line x1={ifaceX} y1={ifaceY - 10} x2={T20B.g1.x - 2} y2={T20B.g1.y + T20B.g1.h / 2} tone={NET.lock} />
      <Line x1={ifaceX} y1={ifaceY + 10} x2={T20B.g2.x - 2} y2={T20B.g2.y + T20B.g2.h / 2} tone={NET.lock} on={second} />
      <At x={T20B.g1.x} y={T20B.g1.y}>
        <Boundary w={T20B.g1.w} h={T20B.g1.h} solid tone={NET.lock} label="Security group 1" />
      </At>
      <At x={T20B.table.x} y={T20B.g1.y + 10}>
        <RuleTable heads={IN_HEADS} rows={SG1_IN} w={T20B.table.w} />
      </At>
      <Fade on={second} className="absolute" style={{ left: T20B.g2.x, top: T20B.g2.y }}>
        <Boundary w={T20B.g2.w} h={T20B.g2.h} solid tone={NET.lock} label="Security group 2" />
      </Fade>
      <Fade on={second} className="absolute" style={{ left: T20B.table.x, top: T20B.g2.y + 10 }}>
        <RuleTable heads={IN_HEADS} rows={SG2_IN} w={T20B.table.w} />
      </Fade>
      <Fade on={second} className="absolute" style={{ left: T20B.g2.x + T20B.g2.w / 2, top: T20B.g2.y + T20B.g2.h + 12 }}>
        <div style={{ transform: 'translateX(-50%)' }}>
          <Label size={14} strong tone="brand" raised>
            their allowed rules combine
          </Label>
        </div>
      </Fade>
      <Fade on={console} className="absolute" style={{ left: T20B.inst.x, top: 320 }}>
        <Label size={14} strong raised>
          EC2 Security Groups console page
        </Label>
      </Fade>
    </>
  )
}

export function SecurityGroupStacking({ lesson }: { lesson: string }) {
  return <PointsFigure id="T20-2" kicker="Security Groups Explained" title="Stateful Instance Filter" lesson={lesson} points={T20B_POINTS} figure={<StackingScene />} />
}

/* ===== T21-1 · How a network ACL filters */

const T21_POINTS = [
  'Being stateless, it must explicitly allow both a request and its reply, since it keeps no memory of the connection',
  'Support both allow and deny rules, so specific traffic can be blocked outright',
  'Rules are numbered and checked in order; the first matching rule decides the outcome',
  'Outbound reply traffic needs its own separate rule because no connection state is kept',
]

/* the router at the top, the ACL on the line, the subnet below; the rule list on the right */
const T21 = {
  router: { x: 97, y: 25, size: 46 },
  laneIn: 110,
  laneOut: 130,
  acl: { x: 100, y: 124, w: 40, h: 56 },
  sub: { x: 20, y: 250, w: 200, h: 108 },
  inst: { cx: 120, cy: 316, size: 46 },
  list: { x: 270, y: 140, w: 340 },
} as const

/** The allow or deny column, once the card has said both words exist: both, neither chosen (the TR gives no values). */
function AllowDeny({ on }: { on: boolean }) {
  return (
    <span className="inline-flex items-center gap-1" style={{ opacity: on ? 1 : 0, transition: `opacity 420ms ${EASE}` }}>
      <Label size={14} tone="good">
        allow
      </Label>
      <Label size={14} tone="bad">
        deny
      </Label>
    </span>
  )
}

function NetworkAclScene() {
  /* press 1 the shape; 2 a request and a reply each checked; 3 the allow or deny words; 4 the first matching row; 5 the reply's own row */
  const k = useCycle(5, 2400, 4)
  const held = useHeld()
  const packets = k >= 1
  const words = k >= 2
  const first = k >= 3
  const own = k >= 4
  const routerBottom = T21.router.y + T21.router.size + 2
  const aclTop = T21.acl.y - 2
  const aclBottom = T21.acl.y + T21.acl.h + 2
  const subTop = T21.sub.y - 2
  const rows: RuleRow[] = [
    { cells: ['1', <AllowDeny key="w" on={words} />, ' '], lit: first },
    { cells: ['2', <AllowDeny key="w" on={words} />, ' '] },
    { cells: ['3', <AllowDeny key="w" on={words} />, ' '], lit: own, tone: colors.teal },
  ]
  return (
    <>
      <At x={T21.router.x} y={T21.router.y}>
        <Gateway kind="router" label="Router" labelBelow={false} size={T21.router.size} />
      </At>
      {/* the request lane, down; the reply lane, up; each stops at the ACL and goes on */}
      <Arrow x1={T21.laneIn} y1={routerBottom} x2={T21.laneIn} y2={aclTop} />
      <Arrow x1={T21.laneIn} y1={aclBottom} x2={T21.laneIn} y2={subTop} />
      <Arrow x1={T21.laneOut} y1={subTop} x2={T21.laneOut} y2={aclBottom} tone={colors.teal} />
      <Arrow x1={T21.laneOut} y1={aclTop} x2={T21.laneOut} y2={routerBottom} tone={colors.teal} />
      <AclBar x={T21.acl.x} y={T21.acl.y} w={T21.acl.w} h={T21.acl.h} icon={18} lit={packets && k < 2} />
      <At x={T21.acl.x + T21.acl.w + 10} y={T21.acl.y + 16}>
        <Label size={14} strong tone="brand" raised>
          network ACL
        </Label>
      </At>
      <At x={24} y={196}>
        <Label size={14} strong raised>
          request
        </Label>
      </At>
      <At x={T21.laneOut + 16} y={196}>
        <Label size={14} strong raised>
          reply
        </Label>
      </At>
      <Traveller path={[[T21.laneIn, routerBottom], [T21.laneIn, aclTop], [T21.laneIn, aclBottom], [T21.laneIn, subTop]]} run={k === 1 && !held} k={`in-${k}`} dur={2.2} />
      <Traveller path={[[T21.laneOut, subTop], [T21.laneOut, aclBottom], [T21.laneOut, aclTop], [T21.laneOut, routerBottom]]} run={(k === 1 || k === 4) && !held} k={`out-${k}`} dur={2.2} tone={colors.teal} />
      <At x={T21.sub.x} y={T21.sub.y}>
        <SubnetBox w={T21.sub.w} h={T21.sub.h} label="subnet" />
      </At>
      <At x={T21.inst.cx} y={T21.inst.cy} cx cy>
        <Resource size={T21.inst.size} />
      </At>
      {/* the rule list: a shape with its heads, the rows marked by their order only */}
      <At x={T21.list.x} y={T21.list.y}>
        <RuleTable heads={['rule number', 'allow or deny', 'port']} rows={rows} w={T21.list.w} cols="1.2fr 1.5fr 0.55fr" />
      </At>
      <Fade on={first} className="absolute" style={{ left: T21.list.x, top: T21.list.y - 36 }}>
        <Label size={14} strong tone="brand" raised>
          first matching rule decides
        </Label>
      </Fade>
      <Fade on={own} className="absolute" style={{ left: T21.list.x, top: T21.list.y + 120 + 12 }}>
        <Label size={14} strong tone="brand" raised style={{ color: colors.tealDark, boxShadow: `inset 0 0 0 1.5px ${colors.teal}` }}>
          its own separate rule
        </Label>
      </Fade>
    </>
  )
}

export function NetworkAcl({ lesson }: { lesson: string }) {
  return (
    <PointsFigure
      id="T21-1"
      kicker="Network ACLs Explained"
      title="Stateless Subnet Filter"
      lead="A network ACL sits at the subnet boundary and inspects every packet entering or leaving it, independent of any earlier traffic"
      lesson={lesson}
      points={T21_POINTS}
      figure={<NetworkAclScene />}
      pointSize={16}
    />
  )
}

/* ===== T21-2 · Whole subnet, VPC console */

const T21B_POINTS = ['Applied to an entire subnet, so every instance inside shares the same rule set', "Managed on the VPC console's Network ACLs page, separate from security groups"]

/* the TR image's shape: the router at the top, two subnets below, each with its own ACL on the line into it */
const T21B = {
  router: { cx: 317, cy: 48, size: 46 },
  junctionY: 120,
  aclA: { cx: 250, cy: 265, size: 40 },
  aclB: { cx: 384, cy: 265, size: 40 },
  sub1: { x: 24, y: 190, w: 156, h: 140 },
  sub2: { x: 454, y: 190, w: 156, h: 140 },
  instY: 275,
  instXs: [32, 78, 124],
  instSize: 40,
} as const

function AclWholeSubnetScene() {
  /* press 1 the shape; 2 every instance of subnet 1 behind its one ACL; 3 the console chip */
  const k = useCycle(3, 2400, 2)
  const shared = k >= 1
  const console = k >= 2
  const r = T21B.router
  const routerBottom = r.cy + r.size / 2 + 2
  const aclR = T21B.aclA.size / 2
  return (
    <>
      <At x={r.cx - r.size / 2} y={r.cy - r.size / 2}>
        <Gateway kind="router" label="Router" labelBelow={false} size={r.size} />
      </At>
      <Line x1={r.cx} y1={routerBottom} x2={r.cx} y2={T21B.junctionY} />
      <Line x1={T21B.aclA.cx} y1={T21B.junctionY} x2={T21B.aclB.cx} y2={T21B.junctionY} />
      <Line x1={T21B.aclA.cx} y1={T21B.junctionY} x2={T21B.aclA.cx} y2={T21B.aclA.cy - aclR - 2} />
      <Line x1={T21B.aclB.cx} y1={T21B.junctionY} x2={T21B.aclB.cx} y2={T21B.aclB.cy - aclR - 2} />
      <At x={T21B.aclA.cx} y={T21B.aclA.cy} cx cy>
        <LockBadge size={T21B.aclA.size} lit={shared} />
      </At>
      <At x={T21B.aclB.cx} y={T21B.aclB.cy} cx cy>
        <LockBadge size={T21B.aclB.size} />
      </At>
      <At x={T21B.aclA.cx} y={T21B.aclA.cy + aclR + 8} cx>
        <Label size={14} strong tone={shared ? 'solid' : 'plain'} raised>
          Network ACL A
        </Label>
      </At>
      <At x={T21B.aclB.cx} y={T21B.aclB.cy + aclR + 8} cx>
        <Label size={14} strong raised>
          Network ACL B
        </Label>
      </At>
      <Arrow x1={T21B.aclA.cx - aclR - 2} y1={T21B.aclA.cy} x2={T21B.sub1.x + T21B.sub1.w + 2} y2={T21B.aclA.cy} both />
      <Arrow x1={T21B.aclB.cx + aclR + 2} y1={T21B.aclB.cy} x2={T21B.sub2.x - 2} y2={T21B.aclB.cy} both />
      <At x={T21B.sub1.x} y={T21B.sub1.y}>
        <SubnetBox w={T21B.sub1.w} h={T21B.sub1.h} label="Subnet 1" lit={shared} />
      </At>
      <At x={T21B.sub2.x} y={T21B.sub2.y}>
        <SubnetBox w={T21B.sub2.w} h={T21B.sub2.h} label="Subnet 2" />
      </At>
      {T21B.instXs.map((dx) => (
        <At key={`a${dx}`} x={T21B.sub1.x + dx} y={T21B.instY - T21B.instSize / 2}>
          <Resource size={T21B.instSize} lit={shared} />
        </At>
      ))}
      {T21B.instXs.map((dx) => (
        <At key={`b${dx}`} x={T21B.sub2.x + dx} y={T21B.instY - T21B.instSize / 2}>
          <Resource size={T21B.instSize} />
        </At>
      ))}
      <Fade on={shared} className="absolute" style={{ left: T21B.sub1.x + T21B.sub1.w / 2, top: T21B.sub1.y + T21B.sub1.h + 6 }}>
        <div style={{ transform: 'translateX(-50%)' }}>
          <Label size={14} strong tone="brand" raised>
            same rule set
          </Label>
        </div>
      </Fade>
      <Fade on={console} className="absolute" style={{ left: 24, top: 24 }}>
        <Label size={14} strong raised>
          VPC console's Network ACLs page
        </Label>
      </Fade>
    </>
  )
}

export function AclWholeSubnet({ lesson }: { lesson: string }) {
  return <PointsFigure id="T21-2" kicker="Network ACLs Explained" title="Stateless Subnet Filter" lesson={lesson} points={T21B_POINTS} figure={<AclWholeSubnetScene />} />
}

/* ===== T22-1 · Groups and ACLs, side by side */

const T22_ROWS: [string, string, string][] = [
  ['Scope', 'Instance / interface', 'Entire subnet'],
  ['State', 'Stateful, return traffic automatic', 'Stateless, needs rule each way'],
  ['Rule type', 'Allow only', 'Allow and deny'],
  ['Evaluation', 'All rules together', 'Numbered, first match wins'],
  ['Default', 'Inbound denied, all outbound allowed', 'Default ACL allows all; a new custom ACL denies all'],
]

export function GroupsVsAcls({ lesson }: { lesson: string }) {
  return (
    <Card
      id="T22-1"
      kicker="Groups Vs ACLs"
      title="Side By Side"
      lead={lead('Security groups and network ACLs operate at different layers, so a workload normally passes through both as a two-tier filter rather than relying on just one')}
      lesson={lesson}
    >
      <div style={{ width: BOX_W }}>
        <DataTable
          compact
          columns={[
            { label: 'Aspect', weight: 0.7 },
            { label: 'Security Group', weight: 1.25 },
            { label: 'Network ACL', weight: 1.45 },
          ]}
          rows={T22_ROWS.map(([a, b, c]) => [<b key="a" className="font-heading font-semibold">{a}</b>, b, c])}
          highlight={[2, 3]}
        />
      </div>
    </Card>
  )
}

/* ===== T23-1 · Least privilege, both layers */

const T23_POINTS = [
  'Security groups and network ACLs together implement this by narrowing both the instance-level and subnet-level entry points',
  'Open only the exact ports a workload needs, such as port 443 for a web tier',
  'Restrict allowed sources to specific IP ranges or security group IDs, not open to all',
  'Use a network ACL as a subnet-wide backstop to explicitly deny traffic a group might miss',
  'Review rules periodically, since an unused open port is a common cause of breaches',
]

/* the funnel: three trapezoids narrowing downward, centred on x 154; the labels on the right */
const T23 = {
  cx: 154,
  mouth: { y: 40, h: 60, top: 260, bot: 220 },
  sg: { y: 104, h: 80, top: 220, bot: 160 },
  acl: { y: 188, h: 70, top: 160, bot: 100 },
  chipX: 300,
} as const

/** One trapezoid of the funnel: a div clipped to the shape, its label chip centred on it. */
function Funnel({ y, h, top, bot, fill, on, label, tone }: { y: number; h: number; top: number; bot: number; fill: string; on: boolean; label: ReactNode; tone: 'brand' | 'plain' | 'lift' }) {
  const w = top
  const inset = (top - bot) / 2
  const style: CSSProperties = { width: w, height: h, background: fill, clipPath: `polygon(0 0, 100% 0, ${w - inset}px 100%, ${inset}px 100%)` }
  return (
    <Fade on={on} lift={-10} className="absolute" style={{ left: T23.cx - w / 2, top: y }}>
      <div aria-hidden style={style} />
      <div className="absolute inset-0 grid place-items-center">
        <Label size={14} strong tone={tone} raised>
          {label}
        </Label>
      </div>
    </Fade>
  )
}

/** Where the funnel's right edge is at a height, for the arrow that points a label at a stage. */
function edgeAt(s: { y: number; h: number; top: number; bot: number }, y: number) {
  const t = (y - s.y) / s.h
  return T23.cx + s.top / 2 - ((s.top - s.bot) / 2) * t
}

function LeastPrivilegeScene() {
  /* press 1 the mouth; 2 the two stages and the outlet; 3 port 443; 4 the sources; 5 explicit deny; 6 review */
  const k = useCycle(6, 2400, 5)
  const stages = k >= 1
  const port = k >= 2
  const sources = k >= 3
  const deny = k >= 4
  const review = k >= 5
  const sgPortY = T23.sg.y + 26
  const sgSrcY = T23.sg.y + 60
  const aclY = T23.acl.y + 36
  const outletTop = T23.acl.y + T23.acl.h
  return (
    <>
      <Funnel {...T23.mouth} fill={`${colors.brand}26`} on label="all traffic" tone="brand" />
      <Funnel {...T23.sg} fill={colors.brand} on={stages} label="security group rules" tone="plain" />
      <Funnel {...T23.acl} fill={colors.brandDark} on={stages} label="ACL rules" tone="plain" />
      <Arrow x1={T23.cx} y1={outletTop + 4} x2={T23.cx} y2={outletTop + 26} on={stages} />
      <Fade on={stages} className="absolute" style={{ left: T23.cx, top: outletTop + 30 }}>
        <div style={{ transform: 'translateX(-50%)' }}>
          <Label size={14} strong tone="good" raised>
            allowed traffic only
          </Label>
        </div>
      </Fade>
      {/* the security group stage: the exact port, the allowed sources */}
      <Fade on={port} className="absolute" style={{ left: T23.chipX, top: sgPortY - 12 }}>
        <Label size={14} strong raised>
          port <Mono>443</Mono>
        </Label>
      </Fade>
      <Arrow x1={T23.chipX - 4} y1={sgPortY} x2={edgeAt(T23.sg, sgPortY) + 3} y2={sgPortY} on={port} />
      <Fade on={sources} className="absolute" style={{ left: T23.chipX, top: sgSrcY - 12 }}>
        <Label size={14} strong raised>
          specific IP ranges or security group IDs
        </Label>
      </Fade>
      <Arrow x1={T23.chipX - 4} y1={sgSrcY} x2={edgeAt(T23.sg, sgSrcY) + 3} y2={sgSrcY} on={sources} />
      {/* the ACL stage: the explicit deny */}
      <Fade on={deny} className="absolute" style={{ left: T23.chipX, top: aclY - 12 }}>
        <span className="inline-flex items-center gap-2">
          <NoMark size={22} on={deny} />
          <Label size={14} strong tone="bad" raised>
            explicit deny
          </Label>
        </span>
      </Fade>
      <Arrow x1={T23.chipX - 4} y1={aclY} x2={edgeAt(T23.acl, aclY) + 3} y2={aclY} on={deny} tone={NET.blocked} />
      {/* beside the funnel: the review, one unused open port crossed out */}
      <Fade on={review} className="absolute" style={{ left: T23.chipX, top: outletTop + 30 }}>
        <span className="inline-flex items-center gap-2">
          <Label size={14} strong tone="brand" raised icon={<SearchCheck />}>
            review
          </Label>
          <Label size={14} tone="muted" raised style={{ textDecoration: 'line-through', textDecorationThickness: 2, textDecorationColor: NET.blocked }}>
            unused open port
          </Label>
          <NoMark size={20} on={review} />
        </span>
      </Fade>
    </>
  )
}

export function LeastPrivilege({ lesson }: { lesson: string }) {
  return (
    <PointsFigure
      id="T23-1"
      kicker="Least Privilege Design"
      title="Combining Both Layers"
      lead="Least-privilege design means granting a workload only the network access it genuinely needs, nothing wider"
      lesson={lesson}
      points={T23_POINTS}
      figure={<LeastPrivilegeScene />}
      pointSize={16}
    />
  )
}

