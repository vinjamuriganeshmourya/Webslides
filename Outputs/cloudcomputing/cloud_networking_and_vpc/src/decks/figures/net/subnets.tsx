import { Fragment, type CSSProperties, type ReactNode } from 'react'
import { Unlink } from 'lucide-react'
import { colors } from '@/design/tokens'
import { DataTable } from '@/ui'
import { useInstant } from '@/motion/instant'
import { Arrow, At, BOX_W, Card, Fade, Label, Stage, useCycle } from '../scene'
import { TILE_SKIN } from '../card'
import { PointsFigure } from '../iso/frames'
import { Boundary, Gateway, LockBadge, Mono, NET, Resource, SubnetBox } from './frames'

/**
 * SECTION 3 · SUBNETS & IP ADDRESSING (T07-1 to T11-1). Every box is this
 * session's own piece (`Boundary`, `SubnetBox`, `Gateway`, `LockBadge`,
 * `Resource` from `./frames`); every label is a word the card already has.
 *
 * Each figure runs ONE loop whose motion is the card's press sequence:
 *   T07-1   the TR image's two slices (with the image's CIDRs), then one slice widens, the four
 *           subnets split into Public and Private with the gateway lines, the zone headers group them
 *   T08-1   the /24 grid is labelled, its five reserved squares shade, the 251 usable fill, the /28
 *           grid lands beside it, the lock sits on the /24 label
 *   T09-1   one subnet box lands per table row, in the rows' order
 *   T09-2   the finished split, then its counts
 *   T10-1   the public subnet gains its upward line to the internet gateway
 *   T11-1   the region's two zones, their subnet pairs, the zone and CIDR labels, the broken link
 * On harness URLs every loop holds its most complete state.
 */

const EASE = 'cubic-bezier(0.22,1,0.36,1)'

/** A CIDR, a zone name or a count as a chip: monospace, ligatures off (content rule 40). */
function Cidr({ children, tone = 'plain', size = 14, raised = false, strong = false, style }: { children: ReactNode; tone?: 'plain' | 'brand' | 'solid' | 'good' | 'muted' | 'dark'; size?: number; raised?: boolean; strong?: boolean; style?: CSSProperties }) {
  return (
    <Label mono size={size} tone={tone} raised={raised} strong={strong} style={{ fontVariantLigatures: 'none', ...style }}>
      {children}
    </Label>
  )
}

/** The point on a disc's rim that a line from (x1, y1) to its centre crosses: an arrow ends on the edge, never inside. */
function onRim(x1: number, y1: number, c: { cx: number; cy: number; r: number }) {
  const dx = c.cx - x1
  const dy = c.cy - y1
  const l = Math.hypot(dx, dy) || 1
  return { x2: c.cx - (dx / l) * c.r, y2: c.cy - (dy / l) * c.r }
}

/* ===== T07-1 · Subnets: size, type, zone */

const T07_POINTS: ReactNode[] = [
  'A larger slice kept for a subnet means fewer subnets can be carved from the same VPC block',
  'Public subnets have a route to an internet gateway; private subnets do not',
  'Every subnet is created inside exactly one availability zone, a physically separate data centre',
  'Subnet type and size together decide how many resources a zone can host and how exposed they are',
]

/* the PointsFigure stage, 634 x 350 (a three-line lead above it), 16px clear on every side; the VPC block's inner row is 508 wide plus the 14 gap */
const S7_H = 350
const S7 = {
  reg: { x: 16, y: 30, w: 602, h: 304 },
  vpc: { x: 40, y: 100, w: 554, h: 210 },
  igw: { cx: 317, cy: 100, r: 22 },
  headY: 132,
  rowTop: 164,
  rowH: 58,
  rowGap: 8,
  innerX: 56,
  innerW: 522,
  colGap: 14,
  /** the image's two /25 slices, equal; then one slice widened (press 1) */
  equal: 254,
  wide: 305,
}

/**
 * T07-1's loop (5 states): the TR image (one /24 block, two /25 slices), one
 * slice widened and the numbers gone, the split into Public and Private with
 * the internet gateway's lines, the Availability Zone headers, a hold on the
 * complete picture. The four-subnet state carries no numbers (must_not).
 */
function SubnetsScene() {
  const k = useCycle(5, 2400, 4)
  const instant = useInstant()
  const move = instant ? 'none' : `left 520ms ${EASE}, width 520ms ${EASE}`
  const wide = k >= 1
  const split = k >= 2
  const zones = k >= 3
  const wA = wide ? S7.wide : S7.equal
  const wB = S7.innerW - S7.colGap - wA
  const cols = [
    { x: S7.innerX, w: wA, cidr: '10.0.0.0/25' },
    { x: S7.innerX + wA + S7.colGap, w: wB, cidr: '10.0.0.128/25' },
  ]
  const fullH = S7.rowH * 2 + S7.rowGap
  /* the gateway lines: from each Public box's top edge (the inner part, clear of the zone header) to the disc's rim */
  const lines = cols.map((c, i) => {
    const x1 = i === 0 ? c.x + c.w * 0.78 : c.x + c.w * 0.22
    return { x1, y1: S7.rowTop, ...onRim(x1, S7.rowTop, S7.igw) }
  })
  return (
    <>
      <At x={S7.reg.x} y={S7.reg.y}>
        <Boundary w={S7.reg.w} h={S7.reg.h} label="Region" />
      </At>
      <At x={S7.vpc.x} y={S7.vpc.y}>
        <Boundary w={S7.vpc.w} h={S7.vpc.h} label="VPC" solid />
      </At>
      {/* the image's own CIDR on the VPC, on its bottom edge: only while the block is the image's two slices */}
      <At x={S7.vpc.x + S7.vpc.w / 2} y={S7.vpc.y + S7.vpc.h} cx cy>
        <Fade on={!wide} lift={0}>
          <Cidr tone="brand" raised strong>
            10.0.0.0/24
          </Cidr>
        </Fade>
      </At>
      {/* the internet gateway on the VPC's top edge */}
      <At x={S7.igw.cx} y={S7.igw.cy - 42} cx cy>
        <Fade on={split}>
          <Label size={14} strong raised>
            Internet gateway
          </Label>
        </Fade>
      </At>
      <At x={S7.igw.cx} y={S7.igw.cy} cx cy>
        <Fade on={split} lift={0}>
          <Gateway kind="igw" size={S7.igw.r * 2} />
        </Fade>
      </At>
      {cols.map((c, i) => (
        <Fragment key={i}>
          {/* the zone header over its column: at the outer corner, so the gateway line has the inner lane */}
          <At x={i === 0 ? c.x : c.x + c.w} y={S7.headY} style={{ transition: move, transform: i === 1 ? 'translateX(-100%)' : undefined }}>
            <Fade on={zones}>
              <Label size={14} strong tone="brand">
                Availability Zone
              </Label>
            </Fade>
          </At>
          {/* the image's slice: one box the full height, its CIDR at its foot */}
          <At x={c.x} y={S7.rowTop} style={{ transition: move }}>
            <Fade on={!split} lift={0}>
              <SubnetBox w={c.w} h={fullH} style={{ transition: instant ? 'none' : `width 520ms ${EASE}` }}>
                <At x={c.w / 2} y={fullH - 24} cx cy style={{ transition: move }}>
                  <Fade on={!wide} lift={0}>
                    <Cidr>{c.cidr}</Cidr>
                  </Fade>
                </At>
              </SubnetBox>
            </Fade>
          </At>
          {/* the split: Public on the top row, Private on the bottom, the width the slice kept */}
          <At x={c.x} y={S7.rowTop} style={{ transition: move }}>
            <Fade on={split} lift={0}>
              <SubnetBox w={c.w} h={S7.rowH} kind="public" label="Public" />
            </Fade>
          </At>
          <At x={c.x} y={S7.rowTop + S7.rowH + S7.rowGap} style={{ transition: move }}>
            <Fade on={split} lift={0}>
              <SubnetBox w={c.w} h={S7.rowH} kind="private" label="Private" />
            </Fade>
          </At>
        </Fragment>
      ))}
      {/* the gateway lines, only on the two Public subnets (must) */}
      {lines.map((l, i) => (
        <Arrow key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} on={split} tone={NET.public} delay={i * 120} />
      ))}
    </>
  )
}

export function SubnetsOverview({ lesson }: { lesson: string }) {
  return (
    <PointsFigure
      id="T07-1"
      kicker="Subnets Overview"
      title="CIDR Type Zone"
      lead="A virtual private cloud's address block is split into subnets, smaller ranges sized using CIDR (Classless Inter-Domain Routing) notation, so that different resources can sit in different zones with different internet access rules"
      lesson={lesson}
      points={T07_POINTS}
      pointSize={17}
      figH={S7_H}
      figure={<SubnetsScene />}
    />
  )
}

/* ===== T08-1 · The reserved address cost */

const T08_POINTS: ReactNode[] = [
  'The bigger the number, the smaller the subnet, and every subnet pays a fixed address tax before any host gets an IP',
  'AWS reserves five addresses per subnet for network, router, DNS, future use, and broadcast functions',
  <>
    A <Mono>/24</Mono> subnet provides 256 addresses but only 251 remain usable after these reservations
  </>,
  /* the two /28 lines are ONE point (must): two lines in one rail item */
  <>
    <span className="block">
      A <Mono>/28</Mono> is the smallest subnet AWS allows
    </span>
    <span className="block">It has 16 addresses but only 11 usable, so it saves VPC space but can run out of IPs quickly</span>
  </>,
  "A subnet's CIDR range cannot change after creation, so plan for extra space from the start",
]

const CELL = 12
const CELL_GAP = 2
const GRID_PAD = 8
/** AWS reserves the first four addresses of a subnet and the last: the squares that shade. */
const reservedOf = (n: number) => new Set([0, 1, 2, 3, n - 1])

/**
 * A subnet's address block as `side` x `side` small squares in a frame (the TR
 * guidance). The frame is the grid outline; the five reserved squares shade
 * when `shaded`, the usable ones fill when `filled`. Each square is a DOM span.
 */
function AddressGrid({ side, shaded, filled }: { side: number; shaded: boolean; filled: boolean }) {
  const instant = useInstant()
  const n = side * side
  const reserved = reservedOf(n)
  const inner = side * CELL + (side - 1) * CELL_GAP
  return (
    <div className="rounded-[10px]" style={{ width: inner + GRID_PAD * 2, height: inner + GRID_PAD * 2, padding: GRID_PAD, ...TILE_SKIN }}>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${side}, ${CELL}px)`, gap: CELL_GAP }}>
        {Array.from({ length: n }, (_, i) => {
          const r = reserved.has(i)
          const on = r ? shaded : filled
          return (
            <span
              key={i}
              aria-hidden
              className="block rounded-[2px]"
              style={{
                width: CELL,
                height: CELL,
                background: r ? NET.lit : colors.brand,
                opacity: on ? (r ? 1 : 0.8) : 0,
                transform: on ? 'scale(1)' : 'scale(0.4)',
                transition: instant ? 'none' : `opacity 420ms ${EASE} ${r ? 0 : i * 2.5}ms, transform 420ms ${EASE} ${r ? 0 : i * 2.5}ms`,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

/** A legend chip: a swatch in the square's colour, then the card's word. */
function Swatch({ color, children }: { color: string; children: ReactNode }) {
  return (
    <Label size={14} strong icon={<span className="block rounded-[3px]" style={{ width: 12, height: 12, background: color }} />}>
      {children}
    </Label>
  )
}

/* the stage is 590 x 380 (pointsW 496); the /24 frame is 238 square, the /28 frame 70 */
const S8 = {
  big: { x: 36, y: 54, side: 16 },
  small: { x: 326, y: 54, side: 4 },
  labelY: 22,
  legendX: 326,
}

/**
 * T08-1's loop (6 states): the empty grid outline with its label blank, the
 * /24 label, the five reserved squares shaded, the 251 usable filled, the /28
 * grid beside it, the lock on the /24 label.
 */
function SizingScene() {
  const k = useCycle(6, 2400, 5)
  const bigSize = S8.big.side * CELL + (S8.big.side - 1) * CELL_GAP + GRID_PAD * 2
  const smallSize = S8.small.side * CELL + (S8.small.side - 1) * CELL_GAP + GRID_PAD * 2
  return (
    <>
      {/* the /24 block */}
      <At x={S8.big.x} y={S8.labelY}>
        <Fade on={k >= 1}>
          <Cidr tone="brand" strong>
            /24
          </Cidr>
        </Fade>
      </At>
      {/* the lock sits on the /24 label (press 6) */}
      <At x={S8.big.x + 46} y={S8.labelY + 12} cy>
        <Fade on={k >= 5} lift={0}>
          <LockBadge size={26} />
        </Fade>
      </At>
      <At x={S8.big.x} y={S8.big.y}>
        <AddressGrid side={S8.big.side} shaded={k >= 2} filled={k >= 3} />
      </At>
      <At x={S8.big.x} y={S8.big.y + bigSize + 14}>
        <Fade on={k >= 3}>
          <div className="flex items-center gap-2">
            <Cidr>256 addresses</Cidr>
            <Cidr tone="brand" strong>
              251 usable
            </Cidr>
          </div>
        </Fade>
      </At>
      {/* the /28 block beside it, the same square size so its size reads */}
      <At x={S8.small.x} y={S8.labelY}>
        <Fade on={k >= 4}>
          <Cidr tone="brand" strong>
            /28
          </Cidr>
        </Fade>
      </At>
      <At x={S8.small.x} y={S8.small.y}>
        <Fade on={k >= 4} lift={0}>
          <AddressGrid side={S8.small.side} shaded={k >= 4} filled={k >= 4} />
        </Fade>
      </At>
      <At x={S8.small.x} y={S8.small.y + smallSize + 14}>
        <Fade on={k >= 4}>
          <div className="flex items-center gap-2">
            <Cidr>16 addresses</Cidr>
            <Cidr tone="brand" strong>
              11 usable
            </Cidr>
          </div>
        </Fade>
      </At>
      {/* the legend: what a shaded square and a filled square are */}
      <At x={S8.legendX} y={206}>
        <Fade on={k >= 2}>
          <Swatch color={NET.lit}>AWS-reserved</Swatch>
        </Fade>
      </At>
      <At x={S8.legendX} y={244}>
        <Fade on={k >= 3}>
          <Swatch color={colors.brand}>usable</Swatch>
        </Fade>
      </At>
    </>
  )
}

export function CidrSizing({ lesson }: { lesson: string }) {
  return (
    <PointsFigure
      id="T08-1"
      kicker="CIDR Subnet Sizing"
      title="Reserved Address Cost"
      lead="Sizing a subnet means choosing its prefix length, the /number in its CIDR (Classless Inter-Domain Routing) range"
      lesson={lesson}
      points={T08_POINTS}
      pointsW={496}
      pointSize={16}
      figH={380}
      figure={<SizingScene />}
    />
  )
}

/* ===== T09-1 · The worked split, row by row */

const SPLIT_ROWS = [
  { cidr: '10.0.1.0/24', zone: 'ap-south-1a', type: 'Public' },
  { cidr: '10.0.2.0/24', zone: 'ap-south-1a', type: 'Private' },
  { cidr: '10.0.3.0/24', zone: 'ap-south-1b', type: 'Public' },
  { cidr: '10.0.4.0/24', zone: 'ap-south-1b', type: 'Private' },
] as const

const ZONES = ['ap-south-1a', 'ap-south-1b'] as const

const TABLE9_W = 520
const STAGE9_W = BOX_W - TABLE9_W - 24
const STAGE9_H = 340

/* the split drawing on a 566 x 340 stage: the VPC box, two zone columns, public on top, private below */
const S9 = {
  vpc: { x: 24, y: 40, w: 518, h: 276 },
  headY: 60,
  colX: [44, 291],
  colW: 231,
  rowY: [96, 188],
  rowH: 80,
  totalY: 282,
}

/**
 * THE WORKED SPLIT, drawn once for T09-1 and T09-2: the VPC `10.0.0.0/16`
 * holding two zone columns, `ap-south-1a` and `ap-south-1b`, a Public subnet on
 * the top row and a Private one on the bottom, each labelled with its CIDR.
 * `shown` is how many subnet boxes have landed (in the table's row order);
 * `counts` adds T09-2's numbers, the sentence's and nothing else.
 */
function SplitScene({ shown, counts = false }: { shown: number; counts?: boolean }) {
  return (
    <>
      <At x={S9.vpc.x} y={S9.vpc.y}>
        <Boundary w={S9.vpc.w} h={S9.vpc.h} label={<span className="font-mono" style={{ fontVariantLigatures: 'none' }}>10.0.0.0/16</span>} />
      </At>
      {/* T09-2: the /16 block's size, on the VPC box */}
      <At x={S9.vpc.x + S9.vpc.w - 12} y={S9.vpc.y} style={{ transform: 'translate(-100%, -50%)' }}>
        <Fade on={counts} lift={0}>
          <Cidr tone="brand" strong raised>
            65,536
          </Cidr>
        </Fade>
      </At>
      {ZONES.map((z, i) => (
        <At key={z} x={S9.colX[i] + S9.colW / 2} y={S9.headY} cx>
          <Cidr tone="brand" strong>
            {z}
          </Cidr>
        </At>
      ))}
      {SPLIT_ROWS.map((r, i) => {
        const col = i < 2 ? 0 : 1
        const row = i % 2
        return (
          <At key={r.cidr} x={S9.colX[col]} y={S9.rowY[row]}>
            <Fade on={i < shown} lift={12}>
              <SubnetBox w={S9.colW} h={S9.rowH} kind={r.type === 'Public' ? 'public' : 'private'} label={r.type} cidr={r.cidr}>
                <At x={S9.colW - 8} y={S9.rowH - 8} style={{ transform: 'translate(-100%, -100%)' }}>
                  <Fade on={counts} lift={0}>
                    <Cidr size={14}>251 usable</Cidr>
                  </Fade>
                </At>
              </SubnetBox>
            </Fade>
          </At>
        )
      })}
      {/* T09-2: the four together */}
      <At x={S9.vpc.x + S9.vpc.w / 2} y={S9.totalY} cx>
        <Fade on={counts} lift={0}>
          <Cidr tone="brand" strong raised>
            1004 usable
          </Cidr>
        </Fade>
      </At>
    </>
  )
}

const SPLIT_COLUMNS = [
  { label: 'Subnet CIDR', weight: 1 },
  { label: 'Availability Zone', weight: 1.15 },
  { label: 'Type', weight: 0.7 },
]

function SplitTable() {
  return (
    <DataTable
      compact
      columns={SPLIT_COLUMNS}
      rows={SPLIT_ROWS.map((r) => [
        <b key="c" className="font-heading font-semibold">
          <Mono>{r.cidr}</Mono>
        </b>,
        <Mono key="z">{r.zone}</Mono>,
        r.type,
      ])}
    />
  )
}

/** T09-1's loop (5 states): no box, then one subnet box per row in the rows' order. */
function WorkedSplitScene() {
  const k = useCycle(5, 2400, 4)
  return <SplitScene shown={k} />
}

export function WorkedSplit({ lesson }: { lesson: string }) {
  return (
    <Card
      id="T09-1"
      kicker="Worked Subnet Split"
      title="Two Zones Four Subnets"
      lead={
        <>
          A VPC block of <Mono>10.0.0.0/16</Mono> is split into four <Mono>/24</Mono> subnets, pairing one public and one private subnet inside each of two availability zones for fault isolation
        </>
      }
      lesson={lesson}
    >
      <div className="flex items-center" style={{ width: BOX_W, gap: 24 }}>
        <div className="shrink-0" style={{ width: TABLE9_W }}>
          <SplitTable />
        </div>
        <Stage w={STAGE9_W} h={STAGE9_H} active={false}>
          <WorkedSplitScene />
        </Stage>
      </div>
    </Card>
  )
}

/* ===== T09-2 · What the split adds up to */

const T09_2_POINT: ReactNode = (
  <>
    Each <Mono>/24</Mono> subnet carries 251 usable addresses after AWS reservations, so the four subnets together offer 1004 usable addresses out of the 65,536 the <Mono>/16</Mono> block holds
  </>
)

/** T09-2's loop (2 states): the finished split, then its counts. */
function SplitTotalsScene() {
  const k = useCycle(2, 2400, 1)
  return <SplitScene shown={4} counts={k >= 1} />
}

export function SplitTotals({ lesson }: { lesson: string }) {
  return (
    <PointsFigure
      id="T09-2"
      kicker="Worked Subnet Split"
      title="Two Zones Four Subnets"
      lesson={lesson}
      points={[T09_2_POINT]}
      pointsW={TABLE9_W}
      figH={STAGE9_H}
      figure={<SplitTotalsScene />}
    />
  )
}

/* ===== T10-1 · Public or private, by route */

const PP_COLUMNS = [
  { label: 'Aspect', weight: 0.85 },
  { label: 'Public Subnet', weight: 1 },
  { label: 'Private Subnet', weight: 1.15 },
]

const PP_ROWS = [
  ['Internet-bound route', 'Points to an internet gateway', 'No direct internet gateway route'],
  ['Typical resources', 'Load balancers, bastion hosts', 'Databases, internal application servers'],
  ['Public IP exposure', 'Instances can hold a public IP', 'Instances cannot be reached directly from the internet'],
  ['Zone pairing', 'Mirrored in every AZ used', 'Mirrored in every AZ used'],
]

const TABLE10_W = 640
const STAGE10_W = BOX_W - TABLE10_W - 24
const STAGE10_H = 310

/* the side-by-side drawing on a 446 x 310 stage: the gateway on the VPC's top edge, the two subnets under it */
const S10 = {
  vpc: { x: 24, y: 80, w: 398, h: 210 },
  igw: { cx: 223, cy: 80, r: 22 },
  box: { y: 144, w: 170, h: 120, x: [44, 232] },
}

/** T10-1's loop (2 states): the public subnet without, then with, its upward line to the internet gateway. */
function PublicPrivateScene() {
  const k = useCycle(2, 2400, 1)
  const x1 = S10.box.x[0] + S10.box.w / 2
  const y1 = S10.box.y
  const end = onRim(x1, y1, S10.igw)
  return (
    <>
      <At x={S10.vpc.x} y={S10.vpc.y}>
        <Boundary w={S10.vpc.w} h={S10.vpc.h} label="VPC" />
      </At>
      <At x={S10.igw.cx} y={S10.igw.cy - 42} cx cy>
        <Label size={14} strong raised>
          Internet gateway
        </Label>
      </At>
      <At x={S10.igw.cx} y={S10.igw.cy} cx cy>
        <Gateway kind="igw" size={S10.igw.r * 2} />
      </At>
      <At x={S10.box.x[0]} y={S10.box.y}>
        <SubnetBox w={S10.box.w} h={S10.box.h} kind="public" label="Public Subnet">
          <At x={S10.box.w / 2} y={78} cx cy>
            <Resource size={44} />
          </At>
        </SubnetBox>
      </At>
      <At x={S10.box.x[1]} y={S10.box.y}>
        <SubnetBox w={S10.box.w} h={S10.box.h} kind="private" label="Private Subnet">
          <At x={S10.box.w / 2} y={78} cx cy>
            <Resource size={44} />
          </At>
        </SubnetBox>
      </At>
      {/* the public subnet's route: from its top edge up to the gateway's rim; the private one gains none */}
      <Arrow x1={x1} y1={y1} x2={end.x2} y2={end.y2} on={k >= 1} tone={NET.public} />
    </>
  )
}

export function PublicPrivate({ lesson }: { lesson: string }) {
  return (
    <Card id="T10-1" kicker="Public Vs Private" title="Classification By Route" lead="A subnet is labelled public or private by what its route table sends internet-bound traffic to, not by any setting on the subnet itself" lesson={lesson}>
      <div className="flex items-center" style={{ width: BOX_W, gap: 24 }}>
        <div className="shrink-0" style={{ width: TABLE10_W }}>
          <DataTable compact columns={PP_COLUMNS} rows={PP_ROWS.map((r) => [<b key="a" className="font-heading font-semibold">{r[0]}</b>, r[1], r[2]])} />
        </div>
        <Stage w={STAGE10_W} h={STAGE10_H} active={false}>
          <PublicPrivateScene />
        </Stage>
      </div>
    </Card>
  )
}

/* ===== T11-1 · Two zones keep it running */

const T11_POINTS: ReactNode[] = [
  'Production designs duplicate the public-private subnet pair in every zone that is used',
  "The VPC console's Subnets page lists each subnet's assigned availability zone and CIDR",
  'If one zone goes down, only the resources in that zone stop working, so a two-zone design keeps running on the other zone',
]

/* the map on the 634 x 350 stage (a three-line lead above it): the region, two zone boxes side by side, a subnet pair in each */
const S11_H = 350
const S11 = {
  reg: { x: 16, y: 30, w: 602, h: 304 },
  zone: { y: 66, w: 275, h: 248, x: [40, 319] },
  box: { dx: 16, w: 243, h: 92, dy: [34, 140] },
}

/** The zone that goes down in the loop's last state: the second one. */
const DOWN = 1

/**
 * T11-1's loop (4 states): the region with its two zones, the subnet pair in
 * each, the zone and CIDR labels as the console lists them, the broken link
 * over one zone (dimmed, never removed) while the other zone's pair stays lit.
 */
function ZonesScene() {
  const k = useCycle(4, 2400, 3)
  const pairs = k >= 1
  const labels = k >= 2
  const down = k >= 3
  return (
    <>
      <At x={S11.reg.x} y={S11.reg.y}>
        <Boundary w={S11.reg.w} h={S11.reg.h} label="Region" />
      </At>
      {ZONES.map((z, zi) => {
        const zx = S11.zone.x[zi]
        const failed = down && zi === DOWN
        const lit = down && zi !== DOWN
        return (
          <Fragment key={z}>
            <At x={zx} y={S11.zone.y}>
              <Boundary w={S11.zone.w} h={S11.zone.h} label="Availability Zone" dim={failed} labelTone={failed ? 'muted' : 'brand'}>
                {SPLIT_ROWS.filter((r) => r.zone === z).map((r, ri) => (
                  <At key={r.cidr} x={S11.box.dx} y={S11.box.dy[ri]}>
                    <Fade on={pairs} lift={12}>
                      <SubnetBox w={S11.box.w} h={S11.box.h} kind={r.type === 'Public' ? 'public' : 'private'} label={r.type} lit={lit}>
                        {/* the console's listing: the subnet's zone and CIDR */}
                        <At x={8} y={38}>
                          <Fade on={labels}>
                            <div className="flex flex-col items-start gap-1">
                              <Cidr>{r.zone}</Cidr>
                              <Cidr>{r.cidr}</Cidr>
                            </div>
                          </Fade>
                        </At>
                      </SubnetBox>
                    </Fade>
                  </At>
                ))}
              </Boundary>
            </At>
            {/* the broken link over the failed zone, on its top edge, clear of its label */}
            {zi === DOWN && (
              <At x={zx + S11.zone.w - 40} y={S11.zone.y} cx cy>
                <Fade on={down} lift={0}>
                  <span aria-hidden className="grid place-items-center rounded-full" style={{ width: 40, height: 40, background: colors.white, color: NET.blocked, boxShadow: `inset 0 0 0 2.5px ${NET.blocked}, 0 10px 20px -12px rgba(16,32,58,0.5)` }}>
                    <Unlink size={22} strokeWidth={2.4} />
                  </span>
                </Fade>
              </At>
            )}
          </Fragment>
        )
      })}
    </>
  )
}

export function ZonePlacement({ lesson }: { lesson: string }) {
  return (
    <PointsFigure
      id="T11-1"
      kicker="AZ Placement"
      title="High Availability Design"
      lead="Availability zones are physically separate locations within one region, each made up of one or more data centres, so spreading subnet pairs across them keeps an application reachable even if one zone loses power or network"
      lesson={lesson}
      points={T11_POINTS}
      figH={S11_H}
      figure={<ZonesScene />}
    />
  )
}
