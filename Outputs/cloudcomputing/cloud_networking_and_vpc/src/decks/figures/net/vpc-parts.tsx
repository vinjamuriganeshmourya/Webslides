import { Globe, LayoutGrid, ShieldCheck, Signpost } from 'lucide-react'
import type { ReactNode } from 'react'
import { Arrow, Fade, Label, useBuild } from '../scene'
import { LitFigure, Ripple } from './fx'
import { Gateway, LockBadge, NET, Resource, RouteChip, SubnetBox } from './frames'
import { Flow } from './vpc-society'
import { Frame, Refused, Status, useHeld } from './vpc-kit'

/**
 * T03-2 · FOUR PARTS OF A VPC (round 2, FS review 2026-11-04: "remove the excess
 * empty space, the private subnet holds only one icon; reduce the illustration
 * slightly; every point within two lines").
 *
 * The points column is wider (510) so the third point fits two lines; the
 * drawing is this section's own at 576 x 340 (the shared `BigVpc` is 634 wide and
 * cannot shrink without shrinking its labels under 14px). Each subnet now holds
 * two things: the public one its instance and the NAT gateway, the private one
 * its instance and a database. The VPC rim is a thin dashed line, the locks sit
 * inside their subnets' corners, the Internet Gateway label beside its disc.
 *
 * Build (`useBuild`, one press each with auto animation off): 0 the VPC alone;
 * 1 subnets; 2 route tables; 3 gateways (the IGW signals out, the private
 * subnet's traffic runs to the NAT); 4 locks (a packet is refused at the
 * private subnet's lock). The loops keep running once built.
 */

const T032_POINTS = [
  { icon: <LayoutGrid size={20} />, text: 'Subnets divide the VPC into smaller address blocks for grouping resources' },
  { icon: <Signpost size={20} />, text: 'Route tables decide where traffic leaving each subnet is sent next' },
  { icon: <Globe size={20} />, text: 'Gateways, such as an internet gateway or NAT gateway, connect the VPC to outside networks' },
  { icon: <ShieldCheck size={20} />, text: 'Security groups and network ACLs filter traffic allowed in or out of resources' },
]

const POINTS_W = 510
const W = 1110 - POINTS_W - 24
const H = 340
/* absolute geometry on the 576 x 340 stage */
const VPC = { x: 14, y: 52, w: W - 28, h: 276 }
const SUB_W = 236
const SUB_H = 166
const PUB = { x: 36, y: 100 }
const PRI = { x: W - 36 - SUB_W, y: 100 }
const ROW = PUB.y + 92 // the resources' centre line
const RES = 52
const IGW = { cx: PUB.x + 82, cy: VPC.y, r: 20 }
const NAT = { cx: PUB.x + 178, cy: ROW, r: 19 }
const PRI_SRV = { cx: PRI.x + 70, cy: ROW }
const PRI_DB = { cx: PRI.x + 170, cy: ROW }
const PUB_SRV = { cx: PUB.x + 64, cy: ROW }
const RT_Y = PUB.y + SUB_H + 31

function Part({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <div className="absolute" style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}>
      {children}
    </div>
  )
}

function FourPartsScene({ k, held }: { k: number; held: boolean }) {
  const lit = (i: number) => !held && k === i
  const lockPub = { x: PUB.x + SUB_W - 22, y: PUB.y + 22 }
  const lockPri = { x: PRI.x + SUB_W - 22, y: PRI.y + 22 }
  return (
    <div className="absolute inset-0">
      {/* the VPC: a thin dashed rim, its label inside */}
      <div className="absolute" style={{ left: VPC.x, top: VPC.y }}>
        <Frame w={VPC.w} h={VPC.h} label="VPC" dashed style={{ borderRadius: 18 }} />
      </div>

      {/* 1 · the two subnets, two things in each */}
      <Fade on={k >= 1} lift={8} style={{ position: 'absolute', left: PUB.x, top: PUB.y }}>
        <SubnetBox w={SUB_W} h={SUB_H} kind="public" label="Public subnet" lit={lit(1)} />
      </Fade>
      <Fade on={k >= 1} lift={8} delay={120} style={{ position: 'absolute', left: PRI.x, top: PRI.y }}>
        <SubnetBox w={SUB_W} h={SUB_H} kind="private" label="Private subnet" lit={lit(1)} />
      </Fade>
      <Fade on={k >= 1} lift={6} delay={200}>
        <Part x={PUB_SRV.cx} y={PUB_SRV.cy}>
          <span className="relative block">
            <Resource kind="server" size={RES} lit={lit(1)} />
            <Status x={RES - 6} y={6} />
          </span>
        </Part>
        <Part x={PRI_SRV.cx} y={PRI_SRV.cy}>
          <span className="relative block">
            <Resource kind="server" size={RES} lit={lit(1)} />
            <Status x={RES - 6} y={6} delay={0.5} />
          </span>
        </Part>
        <Part x={PRI_DB.cx} y={PRI_DB.cy}>
          <span className="relative block">
            <Resource kind="database" size={RES} lit={lit(1)} />
            <Status x={RES - 6} y={6} delay={0.9} />
          </span>
        </Part>
        {/* the private subnet's two resources talk on the local line */}
        <span aria-hidden className="absolute rounded-full" style={{ left: PRI_SRV.cx + RES / 2 + 4, top: ROW - 1, width: PRI_DB.cx - PRI_SRV.cx - RES - 8, height: 2, background: NET.private }} />
        {k >= 1 && !held && <Flow x1={PRI_SRV.cx + RES / 2 + 6} y1={ROW} x2={PRI_DB.cx - RES / 2 - 6} y2={ROW} tone={NET.private} n={1} dur={1.6} size={9} />}
      </Fade>

      {/* 2 · a route table under each subnet */}
      {[PUB, PRI].map((b, i) => (
        <Fade key={i} on={k >= 2} lift={6} delay={i * 120}>
          <Part x={b.x + SUB_W / 2} y={RT_Y}>
            <RouteChip lit={lit(2)} />
          </Part>
        </Fade>
      ))}

      {/* 3 · the gateways: the internet gateway on the VPC's top edge, the NAT gateway inside the public subnet */}
      <Fade on={k >= 3} lift={6}>
        {k >= 3 && !held && <Ripple x={IGW.cx} y={IGW.cy} r={IGW.r + 4} tone={NET.public} on n={2} dur={2.4} />}
        <Part x={IGW.cx} y={IGW.cy}>
          <Gateway kind="igw" size={IGW.r * 2} lit={lit(3)} />
        </Part>
        <div className="absolute" style={{ left: IGW.cx + IGW.r + 10, top: IGW.cy - 34 }}>
          <Label size={14} strong tone={lit(3) ? 'solid' : 'plain'} raised>
            Internet Gateway
          </Label>
        </div>
        <div className="absolute" style={{ left: NAT.cx, top: NAT.cy - NAT.r, transform: 'translateX(-50%)' }}>
          <Gateway kind="nat" size={NAT.r * 2} lit={lit(3)} label="NAT Gateway" />
        </div>
      </Fade>
      <Arrow x1={IGW.cx} y1={IGW.cy + IGW.r + 1} x2={IGW.cx} y2={PUB.y - 1} both on={k >= 3} tone={lit(3) ? NET.lit : NET.public} width={2} />
      <Arrow x1={PRI_SRV.cx - RES / 2 - 2} y1={ROW} x2={NAT.cx + NAT.r + 1} y2={ROW} on={k >= 3} delay={160} tone={lit(3) ? NET.lit : NET.private} width={2} />
      {k >= 3 && !held && <Flow x1={PRI_SRV.cx - RES / 2 - 8} y1={ROW} x2={NAT.cx + NAT.r + 10} y2={ROW} tone={NET.private} n={2} dur={1.6} size={9} />}

      {/* 4 · a lock in each subnet's corner; a packet from outside is refused at the private one */}
      {[lockPub, lockPri].map((l, i) => (
        <Fade key={i} on={k >= 4} lift={4} delay={i * 120}>
          {k >= 4 && !held && <Ripple x={l.x} y={l.y} r={17} tone={NET.lock} on n={1} dur={2.2} />}
          <Part x={l.x} y={l.y}>
            <LockBadge size={26} lit={lit(4)} />
          </Part>
        </Fade>
      ))}
      {k >= 4 && !held && <Refused x={lockPri.x} y={16} dx={0} dy={lockPri.y - 16 - 22} xAt={[lockPri.x - 30, lockPri.y - 36]} />}
    </div>
  )
}

export function FourParts({ lesson }: { lesson: string }) {
  const held = useHeld()
  const k = useBuild(5, 1100)
  const lit = held ? -1 : k - 1
  return <LitFigure id="T03-2" kicker="What Is A VPC" title="The Private Boundary" lesson={lesson} points={T032_POINTS} lit={lit} figure={<FourPartsScene k={k} held={held} />} figH={H} pointsW={POINTS_W} />
}
