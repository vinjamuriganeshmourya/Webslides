import { Fragment, type ReactNode } from 'react'
import { Check } from 'lucide-react'
import { colors } from '@/design/tokens'
import { DataTable } from '@/ui'
import { useInstant } from '@/motion/instant'
import { At, BOX_W, Card, Label, Num, Stage, useCycle } from '../scene'
import { FIG_W, GAP, POINTS_W, Points, lead } from '../iso/frames'
import { Boundary, Crop, Gateway, LockBadge, Logo, Mono, NET, NoteBox, Resource, RouteChip, ShotCard, SubnetBox, litRing, type Rect } from './frames'

/**
 * SECTION 6 · THE LAB (T24-1 to T29-1). The practical's overview as a step
 * strip, the six TR screenshots cropped to the point (never redrawn), the route
 * table comparison as the kit table, and the two filtering layers drawn with
 * this session's pieces (no screenshot exists for that step).
 *
 * Each figure runs ONE loop whose motion is the card's press sequence:
 *   T24-1   the glyphs of steps 1 to 3 light in turn, then a hold
 *   T24-2   the glyphs of steps 4 to 6 light in turn, then a hold
 *   T29-1   the security group ring turns solid, then the network ACL ring, then a hold
 * The screenshot cards have no loop: the orange rings breathe (`Crop`).
 * On harness URLs every loop holds its most complete state.
 */

const EASE = 'cubic-bezier(0.22,1,0.36,1)'
const B = ({ children }: { children: ReactNode }) => <b className="font-heading font-semibold">{children}</b>

/* ------------------------------------------------------------------ the step strip (T24) */

const STEP_W = 960
const STEP_H = 108
const STEP_N = 6
const STEP_X = (i: number) => 80 + i * 160 // the centre of step i (0-based)
const GLYPH_Y = 36
const BADGE_Y = 80

/** The six glyphs over the badges: a VPC, two subnets, an Internet Gateway, a route table, a security control, a check. */
const STEP_GLYPHS: ReactNode[] = [
  <Boundary w={46} h={32} radius={9} />,
  <div className="flex gap-1">
    <SubnetBox w={22} h={30} kind="public" />
    <SubnetBox w={22} h={30} kind="private" />
  </div>,
  <Gateway kind="igw" size={34} />,
  <RouteChip />,
  <LockBadge size={30} />,
  <span className="grid place-items-center rounded-full" style={{ width: 30, height: 30, background: NET.public, color: colors.white, boxShadow: `0 0 0 3px ${colors.white}, 0 8px 16px -8px rgba(16,32,58,0.6)` }} aria-hidden>
    <Check size={16} strokeWidth={3} />
  </span>,
]

/**
 * The numbered step strip, 1 to 6, the card's steps lit (`lit`, 1-based,
 * inclusive) and the rest quiet; `cur` rings the step the loop is on (-1: none).
 */
function StepStrip({ lit, cur }: { lit: [number, number]; cur: number }) {
  const instant = useInstant()
  const ease = instant ? 'none' : `all 420ms ${EASE}`
  return (
    <Stage w={STEP_W} h={STEP_H} active={false}>
      {/* the thin line through the badges, lit across the card's steps */}
      <span aria-hidden className="absolute rounded-full" style={{ left: STEP_X(0), top: BADGE_Y - 1.5, width: STEP_X(STEP_N - 1) - STEP_X(0), height: 3, background: colors.line }} />
      <span aria-hidden className="absolute rounded-full" style={{ left: STEP_X(lit[0] - 1), top: BADGE_Y - 1.5, width: STEP_X(lit[1] - 1) - STEP_X(lit[0] - 1), height: 3, background: colors.brand }} />
      {STEP_GLYPHS.map((g, i) => {
        const on = i + 1 >= lit[0] && i + 1 <= lit[1]
        const now = cur === i
        return (
          <Fragment key={i}>
            <At x={STEP_X(i)} y={GLYPH_Y} cx cy>
              <div style={{ opacity: on ? 1 : 0.4, transform: now ? 'scale(1.12)' : 'none', transition: ease }}>{g}</div>
            </At>
            <At x={STEP_X(i)} y={BADGE_Y} cx cy>
              <span className="inline-grid rounded-full" style={{ boxShadow: litRing(now), transition: ease }}>
                <Num n={i + 1} on={on} size={32} />
              </span>
            </At>
          </Fragment>
        )
      })}
    </Stage>
  )
}

/* ===== T24-1 · The lab, steps 1 to 3 */

const T24_LEAD = 'This practical builds a small custom network in the AWS VPC console and shows that a subnet is public because of its route table, not its name'

export function LabSteps1({ lesson }: { lesson: string }) {
  /* steps 1 to 3 light in turn, then a hold with none ringed */
  const k = useCycle(4, 2400, 3)
  const cur = k < 3 ? k : -1
  return (
    <Card id="T24-1" kicker="Lab Overview" title="What We Will Do" lead={T24_LEAD} lesson={lesson}>
      <div className="flex items-center" style={{ width: BOX_W, gap: GAP }}>
        <StepStrip lit={[1, 3]} cur={cur} />
        <div className="flex items-center" style={{ width: BOX_W - STEP_W - GAP, height: STEP_H }}>
          <Logo name="aws" caption="AWS" h={30} />
        </div>
      </div>
      <div className="mt-3">
        <Points
          width={BOX_W}
          items={[
            <>
              Create a VPC (<Mono>10.0.0.0/16</Mono>) in the <Mono>Mumbai Region</Mono>
            </>,
            <>
              Create a public subnet (<Mono>10.0.1.0/24</Mono>) and a private subnet (<Mono>10.0.2.0/24</Mono>)
            </>,
            'Create an Internet Gateway and attach it to the VPC',
          ]}
        />
      </div>
    </Card>
  )
}

/* ===== T24-2 · The lab, steps 4 to 6 */

export function LabSteps2({ lesson }: { lesson: string }) {
  /* steps 4 to 6 light in turn, then a hold with none ringed */
  const k = useCycle(4, 2400, 3)
  const cur = k < 3 ? 3 + k : -1
  return (
    <Card id="T24-2" kicker="Lab Overview" title="What We Will Do" lesson={lesson}>
      <div className="flex items-center" style={{ width: BOX_W, gap: GAP }}>
        <StepStrip lit={[4, 6]} cur={cur} />
      </div>
      <div className="mt-3">
        <Points
          width={BOX_W}
          items={[
            'Create a public route table (default route to the Internet Gateway) and a private route table (local route only, no route to the internet), and associate each with its subnet',
            'Create a security group and inspect the network ACL',
            'Verify the VPC, subnets, Internet Gateway and route tables in the console',
          ]}
        />
      </div>
      <div className="mt-3">
        <NoteBox>
          <span className="block">
            <B>Important Note:</B> No EC2 instance, NAT Gateway or load balancer is launched, so only the network configuration is verified, not live connectivity
          </span>
          <span className="block">The resources created here should not be deleted, as they will be used in future sessions</span>
        </NoteBox>
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------ a screenshot across the body */

/**
 * A screenshot card with no text column (T26-2, T28-2, T28-3): the crop across
 * the whole body, so the console text stays readable from the back of a room,
 * its caption under it, and the Important Note as a callout under that.
 */
function WideShot({ id, kicker, title, lesson, name, crop, highlight, caption, alt, note, maxH = 300 }: {
  id: string; kicker: string; title: string; lesson: string; name: string; crop: Rect; highlight: Rect | Rect[]; caption: ReactNode; alt: string; note?: ReactNode; maxH?: number
}) {
  return (
    <Card id={id} kicker={kicker} title={title} lesson={lesson}>
      <div className="flex flex-col gap-3" style={{ width: BOX_W }}>
        <Crop name={name} crop={crop} highlight={highlight} maxW={BOX_W} maxH={maxH} alt={alt} />
        <p className="text-[17px] font-semibold leading-snug" style={{ color: colors.ink }}>
          {caption}
        </p>
        {note && <NoteBox>{note}</NoteBox>}
      </div>
    </Card>
  )
}

/* ===== T25-1 · The VPC, created */

export function VpcCreated({ lesson }: { lesson: string }) {
  return (
    <ShotCard
      id="T25-1"
      kicker="VPC Created"
      title="Address Range Confirmed"
      lesson={lesson}
      lead={
        <>
          The VPC <Mono>s5-cloud-network-vpc</Mono> is created first, with CIDR <Mono>10.0.0.0/16</Mono>
        </>
      }
      lines={['Every subnet, gateway and route table that follows must belong to it']}
      caption={
        <>
          <Mono>s5-cloud-network-vpc</Mono>: state Available, IPv4 CIDR <Mono>10.0.0.0/16</Mono>
        </>
      }
      name="slide-25-1"
      crop={[0, 0, 1140, 390]}
      highlight={[
        [405, 205, 120, 32],
        [780, 345, 110, 32],
      ]}
      colW={380}
    />
  )
}

/* ===== T26-1 · The public subnet, created */

export function PublicSubnetCreated({ lesson }: { lesson: string }) {
  return (
    <ShotCard
      id="T26-1"
      kicker="Subnets Created"
      title="Public And Private"
      lesson={lesson}
      lead={
        <>
          Two non-overlapping subnets are created in <Mono>ap-south-1a</Mono>
        </>
      }
      side={<NoteBox w={380}>Until a route to the Internet Gateway is added, both subnets are private, whatever their names say</NoteBox>}
      caption={
        <>
          <Mono>s5-public-subnet</Mono> (<Mono>10.0.1.0/24</Mono>) created and Available
        </>
      }
      name="slide-26-1"
      crop={[0, 0, 945, 292]}
      highlight={[
        [70, 255, 160, 32],
        [762, 255, 115, 32],
      ]}
      colW={380}
    />
  )
}

/* ===== T26-2 · The private subnet, created */

export function PrivateSubnetCreated({ lesson }: { lesson: string }) {
  return (
    <WideShot
      id="T26-2"
      kicker="Subnets Created"
      title="Public And Private"
      lesson={lesson}
      name="slide-26-2"
      crop={[0, 72, 950, 290]}
      highlight={[
        [78, 322, 165, 32],
        [768, 322, 115, 32],
      ]}
      caption={
        <>
          <Mono>s5-private-subnet</Mono> (<Mono>10.0.2.0/24</Mono>) created and Available
        </>
      }
      alt="s5-private-subnet (10.0.2.0/24) created and Available"
    />
  )
}

/* ===== T27-1 · The gateway, attached */

export function IgwAttached({ lesson }: { lesson: string }) {
  return (
    <ShotCard
      id="T27-1"
      kicker="Internet Gateway"
      title="Created And Attached"
      lesson={lesson}
      lead={
        <>
          The Internet Gateway <Mono>s5-igw</Mono> is created and attached to the VPC
        </>
      }
      side={<NoteBox w={380}>Attaching it does not make any subnet public; a route table must point to it</NoteBox>}
      caption={
        <>
          <Mono>s5-igw</Mono> in Attached state, linked to <Mono>s5-cloud-network-vpc</Mono>
        </>
      }
      name="slide-27-1"
      crop={[0, 0, 1140, 260]}
      highlight={[
        [405, 192, 115, 32],
        [780, 192, 300, 56],
      ]}
      colW={380}
    />
  )
}

/* ===== T28-1 · Two route tables, one difference */

const RT_COLUMNS = [{ label: 'Route Table' }, { label: 'Destination' }, { label: 'Target' }, { label: 'Associated Subnet' }]

const RT_ROWS: [string, string, string, string][] = [
  ['s5-public-rt', '10.0.0.0/16', 'local', 's5-public-subnet'],
  ['s5-public-rt', '0.0.0.0/0', 's5-igw', 's5-public-subnet'],
  ['s5-private-rt', '10.0.0.0/16', 'local', 's5-private-subnet'],
]

export function RouteTablesTable({ lesson }: { lesson: string }) {
  return (
    <Card id="T28-1" kicker="Route Tables" title="Public Versus Private" lead={lead(['One route table is created for each subnet', 'The only difference is the default route to the Internet Gateway'])} lesson={lesson}>
      <div style={{ width: BOX_W }}>
        <DataTable
          compact
          highlight={[2]}
          columns={RT_COLUMNS}
          rows={RT_ROWS.map(([rt, dst, tgt, sub]) => [
            <B key="rt">
              <Mono>{rt}</Mono>
            </B>,
            <Mono key="dst">{dst}</Mono>,
            <Mono key="tgt">{tgt}</Mono>,
            <Mono key="sub">{sub}</Mono>,
          ])}
        />
      </div>
    </Card>
  )
}

/* ===== T28-2 · Creating the public route table */

export function PublicRtCreated({ lesson }: { lesson: string }) {
  return (
    <WideShot
      id="T28-2"
      kicker="Route Tables"
      title="Public Versus Private"
      lesson={lesson}
      name="slide-28-1"
      crop={[0, 100, 1256, 350]}
      highlight={[45, 366, 1205, 36]}
      caption={
        <>
          Creating <Mono>s5-public-rt</Mono>
        </>
      }
      alt="Creating s5-public-rt"
    />
  )
}

/* ===== T28-3 · Creating the private route table */

export function PrivateRtCreated({ lesson }: { lesson: string }) {
  return (
    <WideShot
      id="T28-3"
      kicker="Route Tables"
      title="Public Versus Private"
      lesson={lesson}
      name="slide-28-2"
      crop={[0, 0, 1226, 356]}
      highlight={[20, 272, 1200, 36]}
      maxH={270}
      caption={
        <>
          Creating <Mono>s5-private-rt</Mono>
        </>
      }
      alt="Creating s5-private-rt"
      note={
        <>
          <B>Important Note:</B> Select <Mono>s5-cloud-network-vpc</Mono> in the VPC drop-down, not the default VPC
        </>
      }
    />
  )
}

/* ===== T29-1 · Security group and network ACL */

/* the two-ring drawing (T19-1's), on a 634 x 310 stage: the network ACL ring on the subnet's boundary, the security group ring tight round the resource */
const SEC_H = 310
const ACL = { x: 133, y: 24, w: 368, h: 266 }
const SUB = { x: 153, y: 68, w: 328, h: 204 }
const RES = { cx: 317, cy: 142, size: 56 }
const SG = { x: 237, y: 102, w: 160, h: 150 }

/** A dashed ring that turns solid: faint (dashed, line grey) until `solid`, ringed in the template orange while `now`. */
function Ring({ x, y, w, h, solid, now, radius = 18 }: { x: number; y: number; w: number; h: number; solid: boolean; now: boolean; radius?: number }) {
  const instant = useInstant()
  return (
    <span
      aria-hidden
      className="absolute"
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: radius,
        border: `2.5px ${solid ? 'solid' : 'dashed'} ${solid ? NET.lock : colors.line}`,
        boxShadow: litRing(now),
        transition: instant ? 'none' : `border-color 420ms ${EASE}, box-shadow 420ms ${EASE}`,
      }}
    />
  )
}

function TwoRings({ k }: { k: number }) {
  const sg = k >= 1
  const acl = k >= 2
  return (
    <>
      {/* the network ACL ring on the subnet's boundary, its chip at its corner */}
      <Ring x={ACL.x} y={ACL.y} w={ACL.w} h={ACL.h} solid={acl} now={k === 2} radius={22} />
      <At x={ACL.x + 12} y={ACL.y + 10}>
        <Label size={14} strong tone={acl ? 'brand' : 'muted'} raised>
          network ACL
        </Label>
      </At>
      {/* the subnet */}
      <At x={SUB.x} y={SUB.y}>
        <SubnetBox w={SUB.w} h={SUB.h} label="subnet" />
      </At>
      {/* the security group ring, tight round the resource, its chips inside it */}
      <Ring x={SG.x} y={SG.y} w={SG.w} h={SG.h} solid={sg} now={k === 1} />
      <At x={RES.cx} y={RES.cy} cx cy>
        <Resource size={RES.size} />
      </At>
      <At x={RES.cx} y={RES.cy + 54} cx cy>
        <Label size={14} strong tone={sg ? 'brand' : 'muted'}>
          security group
        </Label>
      </At>
      <At x={RES.cx} y={RES.cy + 84} cx cy>
        <Label size={14} strong mono tone={sg ? 'brand' : 'muted'}>
          s5-demo-sg
        </Label>
      </At>
    </>
  )
}

export function ExploreSecurity({ lesson }: { lesson: string }) {
  /* the security group ring turns solid, then the network ACL ring, then a hold with both solid and none ringed */
  const k = useCycle(4, 2400, 3)
  return (
    <Card id="T29-1" kicker="Network Security" title="Security Group And Network ACL" lead="The last part of the practical looks at the two filtering layers of the VPC, without launching any resource" lesson={lesson}>
      <div className="flex items-start" style={{ width: BOX_W, gap: GAP }}>
        <div className="flex flex-col" style={{ width: POINTS_W, gap: 12 }}>
          <Points
            items={[
              <>
                <span className="block">
                  Security group: create <Mono>s5-demo-sg</Mono> in the VPC with no inbound rules, and inspect its rules
                </span>
                <span className="block">It is stateful and applies to resources</span>
              </>,
              <>
                <span className="block">Network ACL: inspect the inbound and outbound rules of the VPC's network ACL without changing them</span>
                <span className="block">It is stateless and applies to a whole subnet</span>
              </>,
            ]}
          />
          <NoteBox w={POINTS_W}>
            <span className="block">
              <B>Important Note:</B> In the VPC field, select <Mono>s5-cloud-network-vpc</Mono>
            </span>
            <span className="block">The default VPC is pre-selected</span>
          </NoteBox>
        </div>
        <Stage w={FIG_W} h={SEC_H} active={false}>
          <TwoRings k={k} />
        </Stage>
      </div>
    </Card>
  )
}
