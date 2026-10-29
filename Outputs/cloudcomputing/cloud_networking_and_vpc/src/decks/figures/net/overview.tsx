import type { CSSProperties, ReactNode } from 'react'
import { DoorClosed, DoorOpen } from 'lucide-react'
import { colors } from '@/design/tokens'
import { useInstant } from '@/motion/instant'
import { Arrow, At, Fade, Label, Traveller, useCycle } from '../scene'
import { TILE_SKIN } from '../card'
import { ClayInstitution, Icon3D } from '../d3/kit'
import { AN_W, IsoAnalogy, PointsFigure } from '../iso/frames'
import { Boundary, G, Gateway, LockBadge, Logo, NET, NoMark, Resource, RouteChip, SubnetBox } from './frames'

/**
 * SECTION 1 · CLOUD NETWORKING OVERVIEW (T01-1 to T02-3). The deployment
 * boundary (`Boundary`, the dashed line the whole deck reuses for a VPC), the
 * school analogy, the pieces inside the boundary, the one VPC drawing built a
 * block at a time at `G`'s numbers, and the two planes.
 *
 * Each figure runs ONE loop whose motion is the card's press sequence, and
 * holds its most complete state on harness URLs (the `still` argument):
 *   T01-1   the resource, the line, the blocked arrow, the allowed arrows, the four labels
 *   T01-AN  the pairs light in turn on one clock: gates and entry rules beside how
 *           traffic reaches cloud resources; corridors and rooms beside which resources
 *   T02-1   the slots, then the AWS logo and the console chip, then the control plane
 *           over the shared hardware
 *   T02-2   the VPC box, the subnets, the gateway with its route tables, the locks,
 *           each lit for its beat
 *   T02-3   the two layers, the two labels, the four blocks small inside the control plane
 */

const EASE = 'cubic-bezier(0.22,1,0.36,1)'
const FIG_W = 634
const FIG_H = 380

/* ------------------------------------------------------------------ shared drawings */

/** A row of empty dashed slots inside a boundary (T02-1, and T02-2's empty stage). */
function Slots({ x, y, w, h, n = 4, gap = 14, on = true }: { x: number; y: number; w: number; h: number; n?: number; gap?: number; on?: boolean }) {
  const slotW = (w - gap * (n - 1)) / n
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <At key={i} x={x + i * (slotW + gap)} y={y}>
          <Fade on={on} lift={6} delay={i * 60}>
            <div className="rounded-[14px]" style={{ width: slotW, height: h, border: `2px dashed ${colors.line}`, background: 'rgba(255,255,255,0.4)' }} />
          </Fade>
        </At>
      ))}
    </>
  )
}

/** The control plane: a solid-rimmed box in the gateway tone; its label is placed by the card (it lands on its own press on T02-3). */
function PlaneBox({ w, h, children }: { w: number; h: number; children?: ReactNode }) {
  return (
    <Boundary w={w} h={h} solid tone={NET.gateway} fill={TILE_SKIN.background as string} radius={16} style={{ boxShadow: TILE_SKIN.boxShadow }}>
      {children}
    </Boundary>
  )
}

/** The row of shared hardware: a tile with server stacks across it; the label and the chip are the card's. */
function HardwareRow({ w, h, racks = 3, rackW = 36, rackX, gap = 8, children, style }: { w: number; h: number; racks?: number; rackW?: number; rackX: number; gap?: number; children?: ReactNode; style?: CSSProperties }) {
  return (
    <div className="relative rounded-[16px]" style={{ width: w, height: h, ...TILE_SKIN, ...style }}>
      {Array.from({ length: racks }, (_, i) => (
        <At key={i} x={rackX + i * (rackW + gap)} y={h / 2} cy>
          <Icon3D name="server-stack" w={rackW} h={rackW + 4} shadow={false} />
        </At>
      ))}
      {children}
    </div>
  )
}

/** A box's corner label, placed where `Boundary` puts its own, so a card can fade it in on its press. */
function CornerLabel({ x, y, on = true, tone = 'brand', children }: { x: number; y: number; on?: boolean; tone?: 'brand' | 'dark' | 'plain'; children: ReactNode }) {
  return (
    <At x={x + 12} y={y - 13}>
      <Fade on={on} lift={6}>
        <Label size={14} strong tone={tone} raised>
          {children}
        </Label>
      </Fade>
    </At>
  )
}

/* ===== T01-1 · The deployment boundary */

const T011_POINTS = [
  'This connectivity layer, called cloud networking, is the deployment boundary: the line deciding whether a launched resource is reachable at all',
  'An instance with no route, gateway or security rule is deployed but entirely unreachable',
  'The deployment boundary decides what traffic reaches a resource and what traffic it can send out',
  'Isolation, addressing, routing and security rules in this session all exist to control this one boundary',
]

/* the boundary and the resource, on the 634 x 380 stage; every arrow end is computed from these */
const B1 = { x: 150, y: 88, w: 340, h: 230 }
const B1_R = B1.x + B1.w
const B1_B = B1.y + B1.h
const R1 = { cx: B1.x + B1.w / 2, top: 158, s: 60 }
const R1_CY = R1.top + R1.s / 2
const NO = 24

function BoundaryScene() {
  /* the press order: the resource alone, the line, the blocked arrow, the allowed arrows, the four labels; held complete */
  const k = useCycle(5, 2400, 4)
  const chips: { t: string; x: number; y: number }[] = [
    { t: 'isolation', x: B1.x + B1.w * 0.76, y: B1.y },
    { t: 'addressing', x: B1_R, y: B1.y + B1.h * 0.76 },
    { t: 'routing', x: B1.x + B1.w / 2, y: B1_B },
    { t: 'security', x: B1.x, y: B1.y + B1.h * 0.76 },
  ]
  return (
    <>
      <At x={B1.x} y={B1.y}>
        <Fade on={k >= 1} lift={0}>
          <Boundary w={B1.w} h={B1.h} label="deployment boundary" />
        </Fade>
      </At>
      <At x={R1.cx} y={R1.top} cx>
        <Resource size={R1.s} label="instance" />
      </At>
      {/* blocked: from outside, stopped dead at the line */}
      <Arrow x1={40} y1={133} x2={B1.x - NO / 2 - 2} y2={133} on={k >= 2} tone={NET.blocked} />
      <At x={B1.x} y={133} cx cy>
        <NoMark size={NO} on={k >= 2} />
      </At>
      {/* allowed: across the line into the resource, and out of it across the line */}
      <Arrow x1={40} y1={R1_CY} x2={R1.cx - R1.s / 2} y2={R1_CY} on={k >= 3} tone={NET.public} />
      <Arrow x1={R1.cx + R1.s / 2} y1={R1_CY} x2={FIG_W - 34} y2={R1_CY} on={k >= 3} tone={NET.public} delay={200} />
      {/* the four labels on the line, together: the session map */}
      {chips.map((c) => (
        <At key={c.t} x={c.x} y={c.y} cx cy>
          <Fade on={k >= 4} lift={6}>
            <Label size={14} strong tone="solid" raised>
              {c.t}
            </Label>
          </Fade>
        </At>
      ))}
    </>
  )
}

export function Boundary1({ lesson }: { lesson: string }) {
  return (
    <PointsFigure
      id="T01-1"
      kicker="Deployment Boundary"
      title="Why Networking Matters"
      lead="Every cloud resource needs connectivity rules deciding what it can reach and what can reach it"
      lesson={lesson}
      points={T011_POINTS}
      figure={<BoundaryScene />}
    />
  )
}

/* ===== T01-AN · Analogy: A school's gates and corridors */

const AN_H = 390

/** A tag inside an analogy picture, in the TR's words; solid while its pair is the one lit. */
function Tag({ children, lit, style }: { children: ReactNode; lit: boolean; style?: CSSProperties }) {
  return (
    <Label size={14} strong tone={lit ? 'solid' : 'plain'} raised style={style}>
      {children}
    </Label>
  )
}

/** The pairs light in turn on one clock both scenes read: the gate pair, then the corridor pair, then a hold with none lit. */
function useAnalogyPair() {
  return useCycle(3, 2400, 2)
}

/* the school: the wall with its gate (row A), the corridor with its room doors (row B) */
const WALL_X = 110
const WALL = { top: 62, bottom: 192, gapTop: 122, gapBottom: 158 }
const ROW_A = (WALL.gapTop + WALL.gapBottom) / 2
const SCHOOL = { x: 290, y: 56, w: 150 }
const CORRIDOR = { x: 60, y: 300, w: 380, h: 40 }
const DOORS = [170, 270, 370]
const DOOR = { y: 252, s: 40 }

function Post({ x, y }: { x: number; y: number }) {
  return (
    <At x={x} y={y} cx cy>
      <span aria-hidden className="block rounded-[4px]" style={{ width: 14, height: 14, background: colors.brandDark, boxShadow: `0 0 0 2.5px ${colors.white}, 0 6px 12px -6px rgba(16,32,58,0.6)` }} />
    </At>
  )
}

function SchoolScene() {
  const k = useAnalogyPair()
  const a = k === 0
  const b = k === 1
  const wall = (top: number, bottom: number) => <span aria-hidden className="absolute rounded-full" style={{ left: WALL_X - 2.5, top, width: 5, height: bottom - top, background: colors.brandDeep }} />
  return (
    <>
      {/* row A: the wall, its gate opening, the entry rule on the gate, the way in */}
      {wall(WALL.top, WALL.gapTop - 8)}
      {wall(WALL.gapBottom + 8, WALL.bottom)}
      <Post x={WALL_X} y={WALL.gapTop - 8} />
      <Post x={WALL_X} y={WALL.gapBottom + 8} />
      <At x={WALL_X} y={WALL.top - 14} cx cy>
        <Tag lit={a}>entry rules</Tag>
      </At>
      <At x={WALL_X} y={WALL.bottom + 14} cx cy>
        <Tag lit={a}>gates</Tag>
      </At>
      <At x={SCHOOL.x} y={SCHOOL.y}>
        <ClayInstitution w={SCHOOL.w} />
      </At>
      <Arrow x1={24} y1={ROW_A} x2={SCHOOL.x + 14} y2={ROW_A} tone={a ? colors.brand : colors.muted} />
      <At x={(WALL_X + SCHOOL.x) / 2} y={ROW_A + 28} cx cy>
        <Tag lit={a}>who can enter</Tag>
      </At>
      {/* row B: the corridor, the room doors on it, where the corridor leads */}
      <At x={DOORS[1]} y={DOOR.y - 22} cx cy>
        <Tag lit={b}>which rooms they can access</Tag>
      </At>
      {DOORS.map((x, i) => (
        <At key={x} x={x} y={DOOR.y + DOOR.s / 2} cx cy>
          <span className="relative block" style={{ width: DOOR.s, height: DOOR.s, color: i === 2 ? colors.muted : colors.brandDark }}>
            {i === 2 ? <DoorClosed size={DOOR.s} strokeWidth={1.8} /> : <DoorOpen size={DOOR.s} strokeWidth={1.8} />}
            {i === 2 && (
              <span className="absolute" style={{ right: -10, top: -8 }}>
                <NoMark size={18} />
              </span>
            )}
          </span>
        </At>
      ))}
      <At x={CORRIDOR.x} y={CORRIDOR.y}>
        <div className="relative rounded-[12px]" style={{ width: CORRIDOR.w, height: CORRIDOR.h, ...TILE_SKIN }}>
          <At x={10} y={CORRIDOR.h / 2} cy>
            <Tag lit={b}>corridors</Tag>
          </At>
        </div>
      </At>
      <Traveller path={[[CORRIDOR.x + 112, CORRIDOR.y + CORRIDOR.h / 2], [CORRIDOR.x + CORRIDOR.w - 20, CORRIDOR.y + CORRIDOR.h / 2]]} run={b} k={k} tone={colors.brand} size={14} dur={2.0} />
      <At x={DOORS[1] + 60} y={CORRIDOR.y + CORRIDOR.h + 18} cx cy>
        <Tag lit={b}>where they can go</Tag>
      </At>
    </>
  )
}

/* the concept: T01-1's boundary, smaller, on the 470 x 390 stage; row A is the way in, row B the resources inside */
const BN = { x: 150, y: 44, w: 300, h: 326 }
const CR1 = { cx: 400, top: 104, s: 56 }
const CR2 = { cx: 250, top: 264, s: 48 }
const CR3 = { cx: 400, top: 264, s: 48 }
const CROW_A = CR1.top + CR1.s / 2

function CloudScene() {
  const k = useAnalogyPair()
  const a = k === 0
  const b = k === 1
  const r1b = CR1.top + CR1.s
  return (
    <>
      <At x={BN.x} y={BN.y}>
        <Boundary w={BN.w} h={BN.h} label="cloud networking" />
      </At>
      {/* row A: traffic crosses the line into a resource */}
      <At x={BN.x + 14} y={72}>
        <Tag lit={a}>how traffic reaches cloud resources</Tag>
      </At>
      <At x={CR1.cx} y={CR1.top} cx>
        <Resource size={CR1.s} />
      </At>
      <Arrow x1={24} y1={CROW_A} x2={CR1.cx - CR1.s / 2} y2={CROW_A} tone={a ? colors.brand : colors.muted} />
      {/* row B: from there it reaches one resource and is stopped before another */}
      <At x={CR2.cx} y={CR2.top} cx>
        <Resource size={CR2.s} />
      </At>
      <At x={CR3.cx} y={CR3.top} cx>
        <Resource size={CR3.s} />
      </At>
      <Arrow x1={CR1.cx - 14} y1={r1b} x2={CR2.cx + 12} y2={CR2.top} tone={b ? colors.brand : colors.muted} />
      <Arrow x1={CR3.cx} y1={r1b} x2={CR3.cx} y2={CR3.top - 34} tone={b ? NET.blocked : colors.muted} />
      <At x={CR3.cx} y={CR3.top - 21} cx cy>
        <NoMark size={NO} />
      </At>
      <At x={BN.x + BN.w / 2} y={CR2.top + CR2.s + 26} cx cy>
        <Tag lit={b}>which resources it can access</Tag>
      </At>
    </>
  )
}

/**
 * The analogy rule (course R3, the user: "analogies represented exactly"):
 * `IsoAnalogy` `bare`, the familiar picture left, the concept picture right,
 * every clause of the TR's sentence a tag inside the picture it describes,
 * matched pairs at the same height, one clock for both.
 */
export function SchoolAnalogy({ lesson }: { lesson: string }) {
  void AN_W
  return (
    <IsoAnalogy
      id="T01-AN"
      kicker="Deployment Boundary"
      title="A school's gates, corridors and entry rules"
      lesson={lesson}
      bare
      h={AN_H}
      everyday={{ label: "A school's gates, corridors and entry rules", scene: <SchoolScene /> }}
      cloud={{ label: 'Cloud networking controls traffic to resources', scene: <CloudScene /> }}
    />
  )
}

/* ===== T02-1 · Pieces, configured in software */

const T021_LEAD = 'The deployment boundary is built from a small set of pieces that together control where traffic starts, stops and crosses isolation lines'
const T021_POINTS = [
  'On AWS (Amazon Web Services), all of them are configured from the VPC (Virtual Private Cloud) console',
  'All of it runs on software-defined networking (SDN): the model where a control plane makes routing and security decisions in software, then pushes them onto hardware shared across many customers, so creating a VPC is an API call, not a cabling job',
]

/* the two layers and the boundary between them, on the 634 x 380 stage */
const P = {
  plane: { x: 24, y: 24, w: 470, h: 50 },
  bound: { x: 24, y: 100, w: 350, h: 176 },
  hw: { x: 24, y: 300, w: 470, h: 60 },
  lane: 440,
  logo: 562,
}

function PiecesScene() {
  /* the press order: the slots, the logo and the console chip, the control plane over the hardware; held complete */
  const k = useCycle(3, 2400, 2)
  const instant = useInstant()
  const ease = instant ? 'none' : `opacity 480ms ${EASE}`
  return (
    <>
      {/* the boundary with its four empty slots */}
      <At x={P.bound.x} y={P.bound.y}>
        <Boundary w={P.bound.w} h={P.bound.h} label="deployment boundary" />
      </At>
      <Slots x={P.bound.x + 22} y={P.bound.y + 30} w={P.bound.w - 44} h={P.bound.h - 56} />
      {/* the provider and its console */}
      <At x={P.logo} y={128} cx>
        <Fade on={k >= 1} lift={8}>
          <Logo name="aws" h={30} caption="AWS" />
        </Fade>
      </At>
      <At x={P.logo} y={198} cx>
        <Fade on={k >= 1} lift={8} delay={120}>
          <Label size={14} strong raised>
            VPC console
          </Label>
        </Fade>
      </At>
      {/* the control plane above, the shared hardware below, one arrow down */}
      <At x={P.plane.x} y={P.plane.y}>
        <Fade on={k >= 2} lift={8}>
          <PlaneBox w={P.plane.w} h={P.plane.h} />
        </Fade>
      </At>
      <CornerLabel x={P.plane.x} y={P.plane.y} on={k >= 2} tone="dark">
        control plane
      </CornerLabel>
      <At x={P.plane.x + P.plane.w + 18} y={P.plane.y + P.plane.h / 2} cy>
        <Fade on={k >= 2} lift={8} delay={120}>
          <Label size={14} strong raised>
            API call
          </Label>
        </Fade>
      </At>
      <Arrow x1={P.lane} y1={P.plane.y + P.plane.h} x2={P.lane} y2={P.hw.y} on={k >= 2} delay={240} />
      <At x={P.hw.x} y={P.hw.y}>
        <div style={{ opacity: k >= 2 ? 1 : 0, transition: ease }}>
          <HardwareRow w={P.hw.w} h={P.hw.h} rackW={32} rackX={108}>
            <At x={12} y={P.hw.h / 2} cy>
              <Label size={14} strong tone="brand">
                hardware
              </Label>
            </At>
            <At x={P.hw.w - 12} y={P.hw.h / 2} cy style={{ transform: 'translate(-100%, -50%)' }}>
              <Label size={14} strong>
                shared across many customers
              </Label>
            </At>
          </HardwareRow>
        </div>
      </At>
    </>
  )
}

export function Pieces({ lesson }: { lesson: string }) {
  return <PointsFigure id="T02-1" kicker="Core Building Blocks" title="The Network Map" lead={T021_LEAD} lesson={lesson} points={T021_POINTS} figure={<PiecesScene />} />
}

/* ===== T02-2 · The four building blocks */

const T022_POINTS = [
  'The isolated network container groups all resources that should share one private address space',
  'Subnets subdivide that container into smaller address ranges placed in specific availability zones',
  'Gateways and route tables decide which subnets can reach the internet or other private networks',
  'Security groups and network access control lists filter traffic allowed in and out of each resource',
]

/** Where a ray from a disc's centre leaves it, towards (tx, ty). */
function discEdge(cx: number, cy: number, r: number, tx: number, ty: number): [number, number] {
  const a = Math.atan2(ty - cy, tx - cx)
  return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]
}

const IGW_R = 23
/* the drawing's own width inside the stage, centred: the VPC box spans G.vpc, nothing sits to its right on this card */
const DX = Math.round((FIG_W - G.vpc.w) / 2 - G.vpc.x)

/**
 * THE ONE VPC DRAWING, built a block per beat: the same pieces at the same
 * numbers as `VpcScene` (`G`), each wrapped so it eases in on its press and is
 * lit for that beat; every later card draws it with `VpcScene` and lights a part.
 */
function BlocksScene() {
  /* 0 the empty boundary with its slots; 1 the VPC box; 2 the subnets; 3 the gateway, its route tables and arrows; 4 the locks; 5 everything, nothing lit (held) */
  const k = useCycle(6, 2400, 5)
  const [ax, ay] = discEdge(G.igw.cx, G.igw.cy, IGW_R, G.pri.x + G.pri.w / 2, G.pri.y)
  return (
    <div className="absolute" style={{ left: DX, top: 0, width: G.W, height: G.H }}>
      <At x={G.vpc.x} y={G.vpc.y}>
        <Boundary w={G.vpc.w} h={G.vpc.h} lit={k === 1} />
      </At>
      <CornerLabel x={G.vpc.x} y={G.vpc.y} on={k >= 1}>
        VPC
      </CornerLabel>
      <Slots x={G.vpc.x + 22} y={G.pub.y} w={G.vpc.w - 44} h={G.pub.h} on={k === 0} />
      {/* the subnets */}
      <At x={G.pub.x} y={G.pub.y}>
        <Fade on={k >= 2} lift={8}>
          <SubnetBox w={G.pub.w} h={G.pub.h} kind="public" label="Public subnet" lit={k === 2} />
        </Fade>
      </At>
      <At x={G.pri.x} y={G.pri.y}>
        <Fade on={k >= 2} lift={8} delay={120}>
          <SubnetBox w={G.pri.w} h={G.pri.h} kind="private" label="Private subnet" lit={k === 2} />
        </Fade>
      </At>
      {/* the gateway on the VPC edge, its arrows to the subnets, the route tables */}
      <At x={G.igw.cx} y={G.igw.cy} cx cy>
        <Fade on={k >= 3} lift={8}>
          <Gateway kind="igw" lit={k === 3} />
        </Fade>
      </At>
      <At x={G.igw.cx} y={G.igw.cy - 42} cx cy>
        <Fade on={k >= 3} lift={6}>
          <Label size={14} strong tone={k === 3 ? 'solid' : 'plain'} raised>
            gateway
          </Label>
        </Fade>
      </At>
      <Arrow x1={G.igw.cx} y1={G.igw.cy + IGW_R} x2={G.igw.cx} y2={G.pub.y - 2} on={k >= 3} delay={200} tone={k === 3 ? NET.lit : colors.brand} />
      <Arrow x1={ax} y1={ay} x2={G.pri.x + G.pri.w / 2} y2={G.pri.y - 2} on={k >= 3} delay={300} tone={k === 3 ? NET.lit : colors.brand} />
      <At x={G.rtPub.x} y={G.rtPub.y} w={G.rtPub.w}>
        <Fade on={k >= 3} lift={6} delay={200}>
          <div className="grid place-items-center" style={{ height: G.rtPub.h }}>
            <RouteChip lit={k === 3} />
          </div>
        </Fade>
      </At>
      <At x={G.rtPri.x} y={G.rtPri.y} w={G.rtPri.w}>
        <Fade on={k >= 3} lift={6} delay={300}>
          <div className="grid place-items-center" style={{ height: G.rtPri.h }}>
            <RouteChip lit={k === 3} />
          </div>
        </Fade>
      </At>
      {/* the locks on each subnet */}
      <At x={G.lockPub.cx} y={G.lockPub.cy} cx cy>
        <Fade on={k >= 4} lift={6}>
          <LockBadge lit={k === 4} />
        </Fade>
      </At>
      <At x={G.lockPri.cx} y={G.lockPri.cy} cx cy>
        <Fade on={k >= 4} lift={6} delay={120}>
          <LockBadge lit={k === 4} />
        </Fade>
      </At>
    </div>
  )
}

export function FourBlocks({ lesson }: { lesson: string }) {
  return <PointsFigure id="T02-2" kicker="Core Building Blocks" title="The Network Map" lesson={lesson} points={T022_POINTS} figure={<BlocksScene />} />
}

/* ===== T02-3 · Control plane and data plane */

const T023_POINTS = [
  'SDN separates the control plane (deciding where traffic should go) from the data plane (hardware actually forwarding packets)',
  'This split is what makes every building block above configurable instead of physically wired',
]

const Q = {
  plane: { x: 40, y: 30, w: 554, h: 190 },
  hw: { x: 40, y: 262, w: 554, h: 80 },
  lane: FIG_W / 2,
}
/* the four blocks, small, in a row inside the control plane */
const MINI_Y = Q.plane.y + 58
const MINI_H = 104
const MINI_X = [Q.plane.x + 34, Q.plane.x + 170, Q.plane.x + 330, Q.plane.x + 456]

function PlanesScene() {
  /* the press order: the two layers, the two labels, the four blocks inside the control plane; held complete */
  const k = useCycle(3, 2400, 2)
  /* the packets' lane runs inside the hardware tile, so its points are the tile's own coordinates */
  const lane = (y: number): [number, number][] => [[24, y], [Q.hw.w - 24, y]]
  return (
    <>
      <At x={Q.plane.x} y={Q.plane.y}>
        <PlaneBox w={Q.plane.w} h={Q.plane.h} />
      </At>
      <CornerLabel x={Q.plane.x} y={Q.plane.y} on={k >= 1} tone="dark">
        control plane
      </CornerLabel>
      {/* the four building blocks of T02-2, small, where they are configured */}
      <At x={MINI_X[0]} y={MINI_Y}>
        <Fade on={k >= 2} lift={8}>
          <Boundary w={110} h={MINI_H} radius={12} />
        </Fade>
      </At>
      <At x={MINI_X[1]} y={MINI_Y}>
        <Fade on={k >= 2} lift={8} delay={100}>
          <div className="flex" style={{ gap: 10 }}>
            <SubnetBox w={52} h={MINI_H} kind="public" />
            <SubnetBox w={52} h={MINI_H} kind="private" />
          </div>
        </Fade>
      </At>
      <At x={MINI_X[2]} y={MINI_Y + MINI_H / 2} cy>
        <Fade on={k >= 2} lift={8} delay={200}>
          <Gateway kind="igw" size={56} />
        </Fade>
      </At>
      <At x={MINI_X[3]} y={MINI_Y + MINI_H / 2} cy>
        <Fade on={k >= 2} lift={8} delay={300}>
          <LockBadge size={48} />
        </Fade>
      </At>
      {/* software decides, hardware carries: one arrow down */}
      <Arrow x1={Q.lane} y1={Q.plane.y + Q.plane.h} x2={Q.lane} y2={Q.hw.y} />
      <At x={Q.hw.x} y={Q.hw.y}>
        <HardwareRow w={Q.hw.w} h={Q.hw.h} racks={5} rackW={40} gap={56} rackX={(Q.hw.w - (5 * 40 + 4 * 56)) / 2} style={{ height: Q.hw.h }}>
          <Traveller path={lane(Q.hw.h - 14)} run k={k} tone={colors.brand} size={12} dur={2.2} />
        </HardwareRow>
      </At>
      <CornerLabel x={Q.hw.x} y={Q.hw.y} on={k >= 1} tone="dark">
        data plane
      </CornerLabel>
    </>
  )
}

export function Planes({ lesson }: { lesson: string }) {
  return <PointsFigure id="T02-3" kicker="Core Building Blocks" title="The Network Map" lesson={lesson} points={T023_POINTS} figure={<PlanesScene />} figH={FIG_H} />
}
