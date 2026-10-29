import type { CSSProperties, ReactNode } from 'react'
import { Check, DoorOpen, MapPin } from 'lucide-react'
import { colors } from '@/design/tokens'
import { DataTable } from '@/ui'
import { useInstant } from '@/motion/instant'
import { Arrow, At, BOX_W, Card, Fade, Label, REDUCED, STILL, Traveller, useCycle } from '../scene'
import { TILE_SKIN } from '../card'
import { ClayHouse, Icon3D, LAB } from '../d3/kit'
import { IsoAnalogy, PointsFigure, lead } from '../iso/frames'
import { Boundary, Logo, Mono, NET, Resource, RouteChip, SubnetBox, VpcScene, litRing } from './frames'

/**
 * SECTION 2 · VIRTUAL PRIVATE CLOUD (T03-1 to T06-1). Every string is the
 * card's; every figure label is a word the card already has.
 *
 * Each figure runs ONE loop whose motion is the card's press sequence, and
 * holds its most complete state on harness URLs (`STILL`, reduced motion, a
 * picker thumbnail):
 *   T03-1   one tenant of the shared network becomes a dashed VPC, then a server
 *           and a database sit inside it on one line
 *   T03-2   the deck's VPC drawing gains one part per point: subnets, route
 *           tables, gateways, locks
 *   T03-AN  the gated society and the VPC light their matched pairs together
 *           on one clock: own gate / addressed, internal roads / routed,
 *           boundary wall / walled-off section
 *   T04-1   the AWS region's two slots become the default and the custom VPC,
 *           then the custom one gains its CIDR and the production mark
 *   T05-1   the kit table (it builds itself a row at a time, every column at once)
 *   T06-1   the VPC splits into subnets, sits on the shared switches, is named
 *           three ways, and its subnets are grouped under two Availability Zones
 */

const EASE = 'cubic-bezier(0.22,1,0.36,1)'

/** A harness URL, reduced motion or a picker thumbnail: the loop holds its most complete frame and nothing is lit as current. */
function useHeld() {
  const instant = useInstant()
  return STILL || REDUCED || instant
}

/** An unlabelled tenant shape: a plain raised tile. */
function Tile({ w, h, style }: { w: number; h: number; style?: CSSProperties }) {
  return <div className="rounded-[14px]" style={{ width: w, height: h, ...TILE_SKIN, ...style }} aria-hidden />
}

/** A plain horizontal line between two pieces (the local line of the VPC drawing, reused). */
function Line({ x, y, len, lit = false, tone = NET.boundary, thick = 3 }: { x: number; y: number; len: number; lit?: boolean; tone?: string; thick?: number }) {
  const instant = useInstant()
  return <span aria-hidden className="absolute rounded-full" style={{ left: x, top: y - thick / 2, width: len, height: thick, background: lit ? NET.lit : tone, transition: instant ? 'none' : `background 420ms ${EASE}` }} />
}

/** A round glyph on an edge, the gateway's look, with any small icon (a gate, an address). */
function Disc({ icon, lit = false, size = 38 }: { icon: ReactNode; lit?: boolean; size?: number }) {
  const instant = useInstant()
  return (
    <span
      aria-hidden
      className="grid place-items-center rounded-full [&>svg]:h-[52%] [&>svg]:w-[52%]"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(180deg, ${colors.white} 0%, ${colors.surface2} 100%)`,
        color: lit ? NET.lit : NET.gateway,
        boxShadow: litRing(lit, `inset 0 0 0 2.5px ${lit ? NET.lit : NET.gateway}, 0 10px 20px -12px rgba(16,32,58,0.5)`),
        transition: instant ? 'none' : `box-shadow 420ms ${EASE}, color 420ms ${EASE}`,
      }}
    >
      {icon}
    </span>
  )
}

/** A chip pinned inside a box at its top-right corner (a box may carry its own label at its corner). */
function Corner({ children, right = 12, top = 12 }: { children: ReactNode; right?: number; top?: number }) {
  return (
    <div className="absolute" style={{ right, top }}>
      {children}
    </div>
  )
}

/* ===== T03-1 · What a VPC is */

const T031_LEAD = 'Public cloud infrastructure is shared by many customers, so each needs an isolated network'
const T031_POINTS = [
  'A VPC (Virtual Private Cloud) provides a logically isolated network with its own IP address range and traffic rules',
  'Resources such as servers and databases commonly use a VPC to communicate securely',
]

const S1_H = 340
/* the shared network box on the 634 x 340 stage, and its tenants inside it (relative to the box) */
const S1_BOX = { x: 18, y: 34, w: 598, h: 290 }
const S1_VPC = { x: 14, y: 40, w: 274, h: 232 }
const S1_TILE = { w: 134, h: 109 }
const S1_TILES: [number, number][] = [[302, 40], [450, 40], [302, 163], [450, 163]]
/* inside the VPC */
const S1_R = 60
const S1_SRV = { cx: 84, cy: 146 }
const S1_DB = { cx: 190, cy: 146 }

function SharedNetworkScene() {
  const held = useHeld()
  /* 0: the shared network and its tenants; 1: one tenant is a VPC; 2: a server and a database inside it; held complete */
  const k = useCycle(3, 2400, 2)
  const instant = useInstant()
  return (
    <At x={S1_BOX.x} y={S1_BOX.y}>
      <Boundary w={S1_BOX.w} h={S1_BOX.h} solid tone={LAB.lavDeep} label="Public cloud infrastructure" labelTone="dark">
        <Corner right={14}>
          <Label strong tone="brand">shared by many customers</Label>
        </Corner>
        {S1_TILES.map(([x, y], i) => (
          <At key={i} x={x} y={y}>
            <Tile w={S1_TILE.w} h={S1_TILE.h} />
          </At>
        ))}
        {/* the tenant shape that becomes the VPC */}
        <At x={S1_VPC.x} y={S1_VPC.y}>
          <div style={{ opacity: k >= 1 ? 0 : 1, transition: instant ? 'none' : `opacity 420ms ${EASE}` }}>
            <Tile w={S1_VPC.w} h={S1_VPC.h} />
          </div>
        </At>
        <At x={S1_VPC.x} y={S1_VPC.y}>
          <Fade on={k >= 1} lift={0}>
            <Boundary w={S1_VPC.w} h={S1_VPC.h} label="VPC" lit={!held && k === 1}>
              <Corner>
                <Label strong tone={!held && k === 1 ? 'solid' : 'brand'}>IP address range</Label>
              </Corner>
            </Boundary>
          </Fade>
        </At>
        <At x={S1_VPC.x} y={S1_VPC.y}>
          <Fade on={k >= 2}>
            <div className="relative" style={{ width: S1_VPC.w, height: S1_VPC.h }}>
              <Line x={S1_SRV.cx + S1_R / 2} y={S1_SRV.cy} len={S1_DB.cx - S1_SRV.cx - S1_R} lit={!held && k === 2} />
              <At x={S1_SRV.cx} y={S1_SRV.cy} cx cy>
                <Resource kind="server" size={S1_R} lit={!held && k === 2} />
              </At>
              <At x={S1_DB.cx} y={S1_DB.cy} cx cy>
                <Resource kind="database" size={S1_R} lit={!held && k === 2} />
              </At>
            </div>
          </Fade>
        </At>
      </Boundary>
    </At>
  )
}

export function WhatIsVpc({ lesson }: { lesson: string }) {
  return <PointsFigure id="T03-1" kicker="What Is A VPC" title="The Private Boundary" lead={T031_LEAD} lesson={lesson} points={T031_POINTS} figure={<SharedNetworkScene />} figH={S1_H} />
}

/* ===== T03-2 · Four parts of a VPC */

const T032_POINTS = [
  'Subnets divide the VPC into smaller address blocks for grouping resources',
  'Route tables decide where traffic leaving each subnet is sent next',
  'Gateways, such as an internet gateway or NAT gateway, connect the VPC to outside networks',
  'Security groups and network ACLs filter traffic allowed in or out of resources',
]

/* a part that arrives fades in on the house curve (opacity only: the parts carry their own centring transforms) */
const PARTS_CSS = `
@keyframes net-part-in { from { opacity: 0 } to { opacity: 1 } }
.net-parts > div > * { animation: net-part-in 480ms ${EASE} both }
.cc-still .net-parts > div > *, .deck-thumb .net-parts > div > * { animation: none }
@media (prefers-reduced-motion: reduce) { .net-parts > div > * { animation: none } }
`

function FourPartsScene() {
  const held = useHeld()
  /* 0: the VPC alone; 1: subnets; 2: route tables; 3: gateways; 4: locks; held complete */
  const k = useCycle(5, 2400, 4)
  const lit = (i: number) => !held && k === i
  return (
    <div className="net-parts absolute inset-0">
      <style>{PARTS_CSS}</style>
      <VpcScene
        label="VPC"
        subnets={k >= 1}
        routeTables={k >= 2}
        igw={k >= 3}
        nat={k >= 3}
        locks={k >= 4}
        lit={{ public: lit(1), private: lit(1), routeTables: lit(2), igw: lit(3), nat: lit(3), locks: lit(4) }}
      />
    </div>
  )
}

export function FourParts({ lesson }: { lesson: string }) {
  return <PointsFigure id="T03-2" kicker="What Is A VPC" title="The Private Boundary" lesson={lesson} points={T032_POINTS} figure={<FourPartsScene />} />
}

/* ===== T03-AN · Analogy: A gated society */

const AN_H = 390
/* both stages share one geometry: the outer box, the one walled plot, the two smaller plots (relative to the outer box) */
const AN_OUTER = { x: 18, y: 32, w: 434, h: 340 }
const AN_PLOT = { x: 14, y: 50, w: 246, h: 230 }
const AN_SMALL = [
  { x: 276, y: 56, w: 142, h: 96 },
  { x: 276, y: 180, w: 142, h: 96 },
]
/* inside the plot: the two homes (or the two resources), the road (or the line) between them, the tag under it */
const AN_L = { cx: 58, cy: 95 }
const AN_R = { cx: 188, cy: 95 }
const AN_TAG_Y = 150
const HOUSE_W = 76
const RES = 56
const DISC = 38

/** The pairs light together on one clock both scenes read: own gate / addressed, internal roads / routed, boundary wall / walled-off section, then none. */
function usePair() {
  const held = useHeld()
  const k = useCycle(4, 2400, 3)
  return held ? 3 : k
}

/** A two-lane road between the homes: the ground tone with a dashed centre line. */
function Road({ x, y, len, lit }: { x: number; y: number; len: number; lit: boolean }) {
  const instant = useInstant()
  return (
    <span aria-hidden className="absolute flex items-center rounded-[3px]" style={{ left: x, top: y - 5, width: len, height: 10, background: lit ? NET.lit : LAB.lavDeep, transition: instant ? 'none' : `background 420ms ${EASE}` }}>
      <span className="block w-full" style={{ height: 2, backgroundImage: `repeating-linear-gradient(90deg, ${colors.white} 0 6px, transparent 6px 12px)` }} />
    </span>
  )
}

function SocietyScene() {
  const k = usePair()
  return (
    <At x={AN_OUTER.x} y={AN_OUTER.y}>
      <Boundary w={AN_OUTER.w} h={AN_OUTER.h} solid tone={LAB.lavDeep} label="one bigger campus" labelTone="dark">
        <Corner right={14}>
          <Label strong tone="brand">gated residential society</Label>
        </Corner>
        {/* the other resident associations, each walled, each with its own gate */}
        {AN_SMALL.map((r, i) => (
          <At key={i} x={r.x} y={r.y}>
            <Boundary w={r.w} h={r.h} solid tone={colors.brandDark}>
              <At x={r.w / 2} y={r.h / 2 - 2} cx cy>
                <ClayHouse w={56} />
              </At>
              <At x={r.w / 2} y={r.h} cx cy>
                <Disc icon={<DoorOpen />} size={22} />
              </At>
            </Boundary>
          </At>
        ))}
        {/* the one resident association the tags describe */}
        <At x={AN_PLOT.x} y={AN_PLOT.y}>
          <Boundary w={AN_PLOT.w} h={AN_PLOT.h} solid tone={colors.brandDark} label="resident association" labelTone="plain" lit={k === 2}>
            <Corner right={10} top={10}>
              <Label strong tone={k === 2 ? 'solid' : 'plain'}>boundary wall</Label>
            </Corner>
            <At x={AN_L.cx} y={AN_L.cy} cx cy>
              <ClayHouse w={HOUSE_W} />
            </At>
            <At x={AN_R.cx} y={AN_R.cy} cx cy>
              <ClayHouse w={HOUSE_W} />
            </At>
            <Road x={AN_L.cx + HOUSE_W / 2} y={AN_L.cy} len={AN_R.cx - AN_L.cx - HOUSE_W} lit={k === 1} />
            <At x={AN_PLOT.w / 2} y={AN_TAG_Y} cx>
              <Label strong tone={k === 1 ? 'solid' : 'plain'} raised>internal roads</Label>
            </At>
            <At x={AN_PLOT.w / 2} y={AN_PLOT.h} cx cy>
              <Disc icon={<DoorOpen />} size={DISC} lit={k === 0} />
            </At>
          </Boundary>
        </At>
        <At x={AN_PLOT.x + AN_PLOT.w / 2} y={AN_PLOT.y + AN_PLOT.h + DISC / 2 + 6} cx>
          <Label strong tone={k === 0 ? 'solid' : 'plain'} raised>own gate</Label>
        </At>
      </Boundary>
    </At>
  )
}

function SharedSectionScene() {
  const k = usePair()
  return (
    <At x={AN_OUTER.x} y={AN_OUTER.y}>
      <Boundary w={AN_OUTER.w} h={AN_OUTER.h} solid tone={LAB.lavDeep} label="provider's shared network" labelTone="dark">
        {/* the other tenants, unnamed */}
        {AN_SMALL.map((r, i) => (
          <At key={i} x={r.x} y={r.y}>
            <Tile w={r.w} h={r.h} />
          </At>
        ))}
        {/* the customer's VPC */}
        <At x={AN_PLOT.x} y={AN_PLOT.y}>
          <Boundary w={AN_PLOT.w} h={AN_PLOT.h} label="VPC" lit={k === 2}>
            <Corner right={10} top={10}>
              <Label strong tone={k === 2 ? 'solid' : 'brand'}>walled-off section</Label>
            </Corner>
            <At x={AN_L.cx} y={AN_L.cy} cx cy>
              <Resource kind="server" size={RES} />
            </At>
            <At x={AN_R.cx} y={AN_R.cy} cx cy>
              <Resource kind="database" size={RES} />
            </At>
            <Line x={AN_L.cx + RES / 2} y={AN_L.cy} len={AN_R.cx - AN_L.cx - RES} lit={k === 1} />
            <At x={AN_PLOT.w / 2} y={AN_TAG_Y} cx>
              <Label strong tone={k === 1 ? 'solid' : 'brand'} raised>routed</Label>
            </At>
            <At x={AN_PLOT.w / 2} y={AN_PLOT.h} cx cy>
              <Disc icon={<MapPin />} size={DISC} lit={k === 0} />
            </At>
          </Boundary>
        </At>
        <At x={AN_PLOT.x + AN_PLOT.w / 2} y={AN_PLOT.y + AN_PLOT.h + DISC / 2 + 6} cx>
          <Label strong tone={k === 0 ? 'solid' : 'brand'} raised>addressed</Label>
        </At>
      </Boundary>
    </At>
  )
}

export function SocietyAnalogy({ lesson }: { lesson: string }) {
  return (
    <IsoAnalogy
      id="T03-AN"
      kicker="What Is A VPC"
      title="A gated society inside one campus"
      lesson={lesson}
      bare
      h={AN_H}
      everyday={{ label: 'A gated society inside one campus', scene: <SocietyScene /> }}
      cloud={{ label: "A VPC inside the provider's shared network", scene: <SharedSectionScene /> }}
    />
  )
}

/* ===== T04-1 · Default VPC or custom VPC */

const T041_LEAD = "Isolation is enforced entirely in software: a provider's switches carry traffic for every tenant, but each VPC's address space and routing stay mathematically separate from the next"
const T041_POINTS: ReactNode[] = [
  'AWS gives two starting points for building one',
  'A default VPC is created automatically in every AWS region, with one public subnet per Availability Zone ready to use',
  'A custom VPC is built from scratch, letting an engineer choose the address range, subnet layout and route tables deliberately',
  <>
    The VPC's own CIDR (Classless Inter-Domain Routing) block, for example <Mono>10.0.0.0/16</Mono>, sets the outer address range every subnet inside it must fit within
  </>,
  'Production workloads generally use a custom VPC, since the default one does not enforce least-privilege network design',
]

/* a three-line lead and five long points: a narrower rail text (15px) and a 340 stage keep the body above the safe bottom */
const S4_POINTS_W = 520
const S4_H = 340

/** One empty slot outlined inside the region (the VPC drawing's own empty-slot look). */
function Slot({ w, h, on }: { w: number; h: number; on: boolean }) {
  const instant = useInstant()
  return <div className="rounded-[18px]" style={{ width: w, height: h, border: `2px dashed ${colors.line}`, background: 'rgba(255,255,255,0.4)', opacity: on ? 1 : 0, transition: instant ? 'none' : `opacity 420ms ${EASE}` }} aria-hidden />
}

function RegionScene({ W, H }: { W: number; H: number }) {
  const held = useHeld()
  /* 0: the region; 1: two slots; 2: the default VPC; 3: the custom VPC; 4: its CIDR; 5: the production mark; held complete */
  const k = useCycle(6, 2400, 5)
  const R = { x: 18, y: 34, w: W - 36, h: H - 50 }
  const slotW = Math.floor((R.w - 48) / 2)
  const slotH = R.h - 58
  const slots = [
    { x: 16, y: 40 },
    { x: 16 + slotW + 16, y: 40 },
  ]
  /* the default VPC: one public subnet per Availability Zone, two zones stacked */
  const zoneW = slotW - 28
  const zoneH = Math.floor((slotH - 36 - 14 - 14) / 2)
  const zones = [36, 36 + zoneH + 14]
  const subH = Math.max(40, zoneH - 40)
  /* the custom VPC: two subnets side by side, a route table under each, the CIDR at the corner, the production mark at the foot */
  const cW = Math.floor((slotW - 28 - 14) / 2)
  const cH = Math.round(slotH * 0.31)
  const cY = 40
  const chipY = cY + cH + 22
  const prodY = slotH - 42
  const litL = !held && k === 2
  const litR = !held && k === 3
  return (
    <At x={R.x} y={R.y}>
      <Boundary
        w={R.w}
        h={R.h}
        solid
        label={
          <span className="inline-flex items-center gap-2">
            <Logo name="aws" h={16} />
            AWS region
          </span>
        }
      >
        {slots.map((s, i) => (
          <At key={i} x={s.x} y={s.y}>
            <Slot w={slotW} h={slotH} on={k >= 1 && k < 2 + i} />
          </At>
        ))}
        {/* the default VPC, left */}
        <At x={slots[0].x} y={slots[0].y}>
          <Fade on={k >= 2} lift={0}>
            <Boundary w={slotW} h={slotH} label="default" lit={litL}>
              {zones.map((zy, i) => (
                <At key={i} x={14} y={zy}>
                  <Boundary w={zoneW} h={zoneH} label="Availability Zone" labelTone="plain" radius={14}>
                    <At x={12} y={28}>
                      <SubnetBox w={zoneW - 24} h={subH} kind="public" label="public subnet" lit={litL} />
                    </At>
                  </Boundary>
                </At>
              ))}
            </Boundary>
          </Fade>
        </At>
        {/* the custom VPC, right */}
        <At x={slots[1].x} y={slots[1].y}>
          <Fade on={k >= 3} lift={0}>
            <Boundary w={slotW} h={slotH} label="custom" lit={litR}>
              {[0, 1].map((i) => (
                <div key={i}>
                  <At x={14 + i * (cW + 14)} y={cY}>
                    <SubnetBox w={cW} h={cH} label="subnet" lit={litR} />
                  </At>
                  <At x={14 + i * (cW + 14) + cW / 2} y={chipY} cx cy>
                    <RouteChip lit={litR} />
                  </At>
                </div>
              ))}
            </Boundary>
          </Fade>
        </At>
        <At x={slots[1].x + slotW - 12} y={slots[1].y + 12}>
          <Fade on={k >= 4} lift={6} style={{ transform: 'translateX(-100%)' }}>
            <Label mono strong tone={!held && k === 4 ? 'solid' : 'brand'} raised>
              10.0.0.0/16
            </Label>
          </Fade>
        </At>
        <At x={slots[1].x + slotW / 2} y={slots[1].y + prodY} cx>
          <Fade on={k >= 5} lift={6}>
            <Label strong tone="good" raised icon={<Check />} iconRound>
              production
            </Label>
          </Fade>
        </At>
      </Boundary>
    </At>
  )
}

export function DefaultCustom({ lesson }: { lesson: string }) {
  const W = BOX_W - S4_POINTS_W - 24
  return <PointsFigure id="T04-1" kicker="Default Vs Custom VPC" title="Isolation In Practice" lead={T041_LEAD} lesson={lesson} points={T041_POINTS} figure={<RegionScene W={W} H={S4_H} />} figH={S4_H} pointsW={S4_POINTS_W} pointSize={15} />
}

/* ===== T05-1 · Same idea, three names */

const T051_LEAD = 'Every major provider offers the same isolation model under a different name, so the mental model built for one cloud transfers directly to another'
const T051_ROWS: [string, string, string, string][] = [
  ['Isolated network', 'VPC (Virtual Private Cloud)', 'VNet (Virtual Network)', 'VPC Network'],
  ['Default on signup', 'One default VPC per region', 'No general-purpose VNet created automatically', 'One default VPC, global scope'],
  ['Cross-network link', 'VPC peering', 'VNet peering', 'VPC network peering'],
  ['Address range unit', 'CIDR block on the VPC', 'CIDR block on the VNet', 'Subnet-level CIDR only'],
]

/** A provider's column head: its logo beside its name (the logo supports the word, never replaces it). */
function Head({ name, children }: { name: 'aws' | 'azure' | 'gcp'; children: string }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Logo name={name} h={22} />
      {children}
    </span>
  )
}

export function Providers({ lesson }: { lesson: string }) {
  return (
    <Card id="T05-1" kicker="VPC Across Providers" title="Same Idea Renamed" lead={lead(T051_LEAD)} lesson={lesson}>
      <div style={{ width: BOX_W }}>
        <DataTable
          compact
          columns={[
            { label: 'Concept', weight: 0.82 },
            { label: <Head name="aws">AWS</Head>, weight: 1 },
            { label: <Head name="azure">Azure</Head>, weight: 1.12 },
            { label: <Head name="gcp">GCP</Head>, weight: 1 },
          ]}
          rows={T051_ROWS.map(([c, a, z, g]) => [<b key="c" className="font-heading font-semibold">{c}</b>, a, z, g])}
          highlight={[2]}
        />
      </div>
    </Card>
  )
}

/* ===== T06-1 · From one VPC to its subnets */

const T061_LEAD = 'A VPC provides an isolated network with its own address range'
const T061_POINTS = [
  'This range is divided into smaller subnets to organize and place resources',
  "Logical isolation separates each customer's traffic in software, even while sharing physical switches and cables",
  'The same boundary concept appears as AWS VPC, Azure VNet and GCP VPC Network with minor differences',
  'That one large CIDR block must now be split into smaller subnets placed across Availability Zones',
]

const S6_H = 350
/* the VPC box sits left of centre so the three names (the Google Cloud mark is 116px wide at 18px) fit beside it, 16px clear of the stage edge; box and names together are centred on the stage */
const S6_VPC = { x: 40, y: 26, w: 300, h: 74 }
const S6_SUB = { w: 108, h: 50, y: 164 }
const S6_SUB_X = [65, 187, 339, 461]
const S6_COL = [
  { x: 51, y: 142, w: 258, h: 112 },
  { x: 325, y: 142, w: 258, h: 112 },
]
const S6_ROUTER = { w: 56, y: 262, xs: [60, 518] }
const S6_CABLE_Y = 290
const S6_NAMES: { name: 'aws' | 'azure' | 'gcp'; text: string }[] = [
  { name: 'aws', text: 'AWS VPC' },
  { name: 'azure', text: 'Azure VNet' },
  { name: 'gcp', text: 'GCP VPC Network' },
]
const S6_NAME_X = 356
const S6_NAME_Y = [30, 56, 82]

function SplitScene() {
  const held = useHeld()
  /* 0: the VPC; 1: the split into subnets; 2: the shared switches and cables; 3: the three names; 4: the two Availability Zones; held complete */
  const k = useCycle(5, 2400, 4)
  const instant = useInstant()
  /* the split arrows leave the VPC's bottom edge at even stations and land on each subnet's top edge; once the zones are drawn they land on the zone's top edge above that subnet */
  const from = S6_SUB_X.map((_, i) => S6_VPC.x + (S6_VPC.w * (i + 1)) / 5)
  const to = S6_SUB_X.map((x) => x + S6_SUB.w / 2)
  const vpcBottom = S6_VPC.y + S6_VPC.h
  const laneY = S6_VPC.y + S6_VPC.h - 20
  return (
    <>
      {/* the VPC and its address range */}
      <At x={S6_VPC.x} y={S6_VPC.y}>
        <Boundary w={S6_VPC.w} h={S6_VPC.h} label="VPC">
          <Corner>
            <Label strong tone="brand">address range</Label>
          </Corner>
        </Boundary>
      </At>
      {/* its own traffic, inside its own boundary */}
      <Traveller path={[[S6_VPC.x + 18, laneY], [S6_VPC.x + S6_VPC.w - 18, laneY]]} run={k >= 2} k={k} tone={colors.brand} size={14} />
      {/* the three names beside the VPC box */}
      {S6_NAMES.map((n, i) => (
        <At key={n.name} x={S6_NAME_X} y={S6_NAME_Y[i]}>
          <Fade on={k >= 3} lift={6} delay={i * 90}>
            <span className="inline-flex items-center gap-2 whitespace-nowrap font-heading text-[15px] font-semibold leading-none" style={{ color: !held && k === 3 ? colors.brand : colors.ink, transition: instant ? 'none' : `color 420ms ${EASE}` }}>
              <span className="inline-flex shrink-0">
                <Logo name={n.name} h={18} />
              </span>
              {n.text}
            </span>
          </Fade>
        </At>
      ))}
      {/* the two Availability Zones */}
      {S6_COL.map((c, i) => (
        <At key={i} x={c.x} y={c.y}>
          <Fade on={k >= 4} lift={0}>
            <Boundary w={c.w} h={c.h} lit={!held && k === 4}>
              <div className="absolute" style={{ left: 12, bottom: 10 }}>
                <Label strong tone={!held && k === 4 ? 'solid' : 'brand'} raised>
                  Availability Zone
                </Label>
              </div>
            </Boundary>
          </Fade>
        </At>
      ))}
      {/* the split: the arrows and the subnets arrive together */}
      {S6_SUB_X.map((x, i) => (
        <div key={i}>
          <Arrow x1={from[i]} y1={vpcBottom} x2={to[i]} y2={S6_SUB.y} on={k >= 1 && k < 4} />
          <Arrow x1={from[i]} y1={vpcBottom} x2={to[i]} y2={S6_COL[0].y} on={k >= 4} />
          <At x={x} y={S6_SUB.y}>
            <Fade on={k >= 1} lift={8} delay={i * 80}>
              <SubnetBox w={S6_SUB.w} h={S6_SUB.h} label="subnet" lit={!held && k === 1} />
            </Fade>
          </At>
        </div>
      ))}
      {/* the shared switches and cables the VPC sits on */}
      <Fade on={k >= 2} lift={0}>
        <Line x={S6_ROUTER.xs[0] + S6_ROUTER.w} y={S6_CABLE_Y} len={S6_ROUTER.xs[1] - S6_ROUTER.xs[0] - S6_ROUTER.w} tone={LAB.lavDeep} thick={4} />
        {S6_ROUTER.xs.map((x) => (
          <At key={x} x={x} y={S6_ROUTER.y}>
            <Icon3D name="router" w={S6_ROUTER.w} />
          </At>
        ))}
        <At x={(S6_ROUTER.xs[0] + S6_ROUTER.xs[1] + S6_ROUTER.w) / 2} y={S6_CABLE_Y + 14} cx>
          <Label strong tone={!held && k === 2 ? 'solid' : 'plain'} raised>
            shared physical switches and cables
          </Label>
        </At>
      </Fade>
      {/* the other tenants' traffic rides the shared cable, apart from the VPC's own */}
      <Traveller path={[[S6_ROUTER.xs[0] + S6_ROUTER.w + 6, S6_CABLE_Y], [S6_ROUTER.xs[1] - 6, S6_CABLE_Y]]} run={k >= 2} k={`c${k}`} tone={colors.muted} size={11} />
    </>
  )
}

export function VpcToSubnets({ lesson }: { lesson: string }) {
  return <PointsFigure id="T06-1" kicker="From VPC To Subnets" title="What Comes Next" lead={T061_LEAD} lesson={lesson} points={T061_POINTS} figure={<SplitScene />} figH={S6_H} />
}
