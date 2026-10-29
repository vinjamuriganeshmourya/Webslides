import type React from 'react'
import type { DeckMeta, SlideDef } from '@/deck/types'
import type { SectionBreakerProps } from '@/slides/types'
import { AgendaSlide, BrandSlide, NextSessionSlide, SectionBreakerSlide, ThankYouSlide } from '@/slides'
import { FeedbackSlide } from '@/slides/FeedbackSlide'
import { ClassroomQuiz } from '@/ui/foundations/ClassroomQuiz'
import { Takeaways } from './figures/closing'
import { installSpecKeys } from '@/ui/foundations/keys'
import { revealEveryStep } from '@/motion/Stepper'
import { installEntrances } from './figures/entrance'
import { MOTION_CSS } from './figures/motion'
import { SCENE_CSS, STILL } from './figures/scene'
import { ART_CSS, mountClayDefs } from './figures/art'
import { NET_CSS } from './figures/net/frames'
import { Boundary1, SchoolAnalogy, Pieces, FourBlocks, Planes } from './figures/net/overview'
import { WhatIsVpc, FourParts, SocietyAnalogy, DefaultCustom, Providers, VpcToSubnets } from './figures/net/vpc'
import { SubnetsOverview, CidrSizing, WorkedSplit, SplitTotals, PublicPrivate, ZonePlacement } from './figures/net/subnets'
import { FourPieces, RouteTables, PostalAnalogy, InternetGateway, NatGateway, TicketAnalogy, Peering, SiteToSiteVpn, PhoneLineAnalogy, RoutingCompared, RoutingNotPermission } from './figures/net/routing'
import { TwoFilters, DoorCheckpointAnalogy, SecurityGroup, SecurityGroupStacking, NetworkAcl, AclWholeSubnet, GroupsVsAcls, LeastPrivilege } from './figures/net/security'
import { LabSteps1, LabSteps2, VpcCreated, PublicSubnetCreated, PrivateSubnetCreated, IgwAttached, RouteTablesTable, PublicRtCreated, PrivateRtCreated, ExploreSecurity } from './figures/net/lab'

/**
 * CLOUD COMPUTING · "Cloud Networking & VPC" (session 5)
 *
 * Built from `Outputs/cloudcomputing/session_plans/cloud_networking_and_vpc/plan.md`
 * (signed off on the user's word, 2026-10-29). The source is the session 5 spec
 * and TR in `Outputs/cloud_computing/session_plans/session_5/`: every string on
 * a slide is the spec's (the TR's words; a spaced dash turned into a colon or a
 * comma, the full stop at a line's end dropped). One slide per spec card, in the
 * TR's order, the slide id is the card id (`Card` stamps it as `data-spec`).
 *
 * THE DESIGN is sessions 2 to 4's: `Card`, the points rail beside a raised
 * stage, library renders and clay objects, one self-running loop per figure
 * held still on harness URLs. No builds (`revealEveryStep`): every element
 * enters in reading order (`figures/entrance.ts`), which is how the spec's
 * press order reaches the screen. Section files: `figures/net/`.
 */

export const SESSION = 'Cloud Networking & VPC'

export const netMeta: DeckMeta = {
  title: SESSION,
  course: 'Cloud Computing',
  lesson: SESSION,
  presenter: 'NxtWave Instructor',
  /* every move a transition, picker thumbnails, and the step/slide switch hidden (course skill R1) */
  player: { autoHideControls: true, smooth: true, thumbnails: true, hideModeSwitch: true },
}

/** A TR agenda line, `1. Cloud Networking Overview: The network as …`, as the kit's title and sub. The number is the slide's own badge. */
const line = (s: string) => {
  const body = s.replace(/^\d+\.\s*/, '')
  const i = body.indexOf(': ')
  return { title: body.slice(0, i), sub: body.slice(i + 2) }
}

/** S-AGENDA, the TR's five agenda lines. The breakers, the takeaways and the section bar use the titles (course rule R5). */
export const AGENDA = [
  '1. Cloud Networking Overview: The network as the deployment boundary; core building blocks',
  '2. Virtual Private Cloud (VPC): Logically isolated networks; VPC concepts across providers',
  '3. Subnets & IP Addressing: CIDR notation & subnet sizing; public vs private subnets; availability-zone placement',
  '4. Routing & Gateways: Route tables; internet gateway; NAT gateway; VPC peering & private connectivity',
  '5. Network Security Controls: Security groups (stateful) vs network ACLs (stateless); least-privilege network design',
].map(line)

/** S-RECAP, the TR's recap of Containers vs Virtual Machines. */
const PREVIOUS = [
  '1. Container Fundamentals: Process-level isolation; Linux namespaces & control groups (cgroups); union filesystem & layered images',
  '2. Docker Architecture: Client, daemon, images, containers & registries; image vs container; layers & build caching',
  '3. Containers vs VMs: Boot time, memory footprint, image size & density; isolation strength & security trade-offs',
  '4. Choosing Between Them: Container use cases; VM use cases; decision criteria',
  '5. Tooling & Registries: VirtualBox, KVM, Hyper-V & VMware; Docker, Podman & containerd; public vs private registries; tagging strategy',
].map(line)

/* the keyframes the scene helpers use; harness URLs hold every loop still */
if (typeof document !== 'undefined' && !document.getElementById('cc-css')) {
  const el = document.createElement('style')
  el.id = 'cc-css'
  /* table heads read as the spec writes them (`Subnet CIDR`, `Typical Cost Driver`), not in the kit's capitals: the source text exactly */
  el.textContent = ART_CSS + SCENE_CSS + MOTION_CSS + NET_CSS + `[data-spec] .grid.items-end > .uppercase.tracking-wider { text-transform: none; letter-spacing: 0.01em }`
  document.head.appendChild(el)
  if (STILL) document.documentElement.classList.add('cc-still')
  if (document.body) mountClayDefs()
  else document.addEventListener('DOMContentLoaded', mountClayDefs)
}
installSpecKeys()
revealEveryStep()
installEntrances()

const S = AGENDA.map((a) => a.title)
const breaker = (i: number): SlideDef => ({ id: `D${i + 1}`, section: S[i], label: 'Section divider', transition: 'zoom', element: <SectionBreakerSlide index={i + 1} title={S[i]} lesson={SESSION} /> })
/**
 * D-LAB (plan decision 7): the practical's divider, the same frame as the five
 * section breakers, rendered through this wrapper so `Deck` does not count it
 * as a sixth section-bar segment (the bar is one segment per agenda point; the
 * lab belongs to section 5, where the TR puts it).
 */
const LabBreaker = (p: SectionBreakerProps) => <SectionBreakerSlide {...p} />
const slide = (id: string, section: string, label: string, El: (p: { lesson: string }) => React.ReactElement): SlideDef => ({ id, section, label, element: <El lesson={SESSION} /> })

export const netDeck: SlideDef[] = [
  /* ── OPENING ─────────────────────────────────────────────────────────── */
  { id: 'S-WELCOME', section: 'Opening', label: 'Welcome', transition: 'fade', element: <BrandSlide greeting="Welcome!" lesson={SESSION} /> },
  { id: 'S-RECAP', section: 'Opening', label: 'Recap', element: <Takeaways id="S-RECAP" kicker="Recap" title="Containers vs Virtual Machines" lesson={SESSION} items={PREVIOUS.map(({ title }) => ({ title }))} art="/assets/takeaways/presenter.png" /> },
  { id: 'S-AGENDA', section: 'Opening', label: 'Agenda', element: <AgendaSlide kicker={SESSION} title="Agenda" lesson={SESSION} items={AGENDA.map(({ title }) => ({ title }))} /> },

  /* ── 1 · CLOUD NETWORKING OVERVIEW ───────────────────────────────────── */
  breaker(0),
  slide('T01-1', S[0], 'The deployment boundary', Boundary1),
  slide('T01-AN', S[0], "Analogy: A school's gates and corridors", SchoolAnalogy),
  slide('T02-1', S[0], 'Pieces, configured in software', Pieces),
  slide('T02-2', S[0], 'The four building blocks', FourBlocks),
  slide('T02-3', S[0], 'Control plane and data plane', Planes),

  /* ── 2 · VIRTUAL PRIVATE CLOUD (VPC) ─────────────────────────────────── */
  breaker(1),
  slide('T03-1', S[1], 'What a VPC is', WhatIsVpc),
  slide('T03-2', S[1], 'Four parts of a VPC', FourParts),
  slide('T03-AN', S[1], 'Analogy: A gated society', SocietyAnalogy),
  slide('T04-1', S[1], 'Default VPC or custom VPC', DefaultCustom),
  slide('T05-1', S[1], 'Same idea, three names', Providers),
  slide('T06-1', S[1], 'From one VPC to its subnets', VpcToSubnets),

  /* ── 3 · SUBNETS & IP ADDRESSING ─────────────────────────────────────── */
  breaker(2),
  slide('T07-1', S[2], 'Subnets: size, type, zone', SubnetsOverview),
  slide('T08-1', S[2], 'The reserved address cost', CidrSizing),
  slide('T09-1', S[2], 'The worked split, row by row', WorkedSplit),
  slide('T09-2', S[2], 'What the split adds up to', SplitTotals),
  slide('T10-1', S[2], 'Public or private, by route', PublicPrivate),
  slide('T11-1', S[2], 'Two zones keep it running', ZonePlacement),

  /* ── 4 · ROUTING & GATEWAYS ──────────────────────────────────────────── */
  breaker(3),
  slide('T13-1', S[3], 'The four connectivity pieces', FourPieces),
  slide('T14-1', S[3], 'A route table, entry by entry', RouteTables),
  slide('T14-AN', S[3], 'Analogy: A postal sorting hub', PostalAnalogy),
  slide('T15-1', S[3], 'The internet gateway', InternetGateway),
  slide('T16-1', S[3], 'The NAT gateway', NatGateway),
  slide('T16-AN', S[3], 'Analogy: A ticket counter', TicketAnalogy),
  slide('T17-1', S[3], 'VPC peering', Peering),
  slide('T17-2', S[3], 'Site-to-Site VPN', SiteToSiteVpn),
  slide('T17-AN', S[3], 'Analogy: A private telephone line', PhoneLineAnalogy),
  slide('T18-1', S[3], 'Four routing options compared', RoutingCompared),
  slide('T18-2', S[3], 'Routing is not permission', RoutingNotPermission),

  /* ── 5 · NETWORK SECURITY CONTROLS ───────────────────────────────────── */
  breaker(4),
  slide('T19-1', S[4], 'Two filters, two places', TwoFilters),
  slide('T19-AN', S[4], 'Analogy: A door and a checkpoint', DoorCheckpointAnalogy),
  slide('T20-1', S[4], 'How a security group filters', SecurityGroup),
  slide('T20-2', S[4], 'Where it is managed, and stacking', SecurityGroupStacking),
  slide('T21-1', S[4], 'How a network ACL filters', NetworkAcl),
  slide('T21-2', S[4], 'Whole subnet, VPC console', AclWholeSubnet),
  slide('T22-1', S[4], 'Groups and ACLs, side by side', GroupsVsAcls),
  slide('T23-1', S[4], 'Least privilege, both layers', LeastPrivilege),

  /* ── PRACTICAL HANDS-ON (inside section 5, where the TR puts it) ─────── */
  { id: 'D-LAB', section: S[4], label: 'Practical divider', transition: 'zoom', element: <LabBreaker kicker="Practical Hands-On" title="Building a Cloud Network with AWS VPC" lesson={SESSION} /> },
  slide('T24-1', S[4], 'The lab, steps 1 to 3', LabSteps1),
  slide('T24-2', S[4], 'The lab, steps 4 to 6', LabSteps2),
  slide('T25-1', S[4], 'The VPC, created', VpcCreated),
  slide('T26-1', S[4], 'The public subnet, created', PublicSubnetCreated),
  slide('T26-2', S[4], 'The private subnet, created', PrivateSubnetCreated),
  slide('T27-1', S[4], 'The gateway, attached', IgwAttached),
  slide('T28-1', S[4], 'Two route tables, one difference', RouteTablesTable),
  slide('T28-2', S[4], 'Creating the public route table', PublicRtCreated),
  slide('T28-3', S[4], 'Creating the private route table', PrivateRtCreated),
  slide('T29-1', S[4], 'Security group and network ACL', ExploreSecurity),

  /* ── CLOSING ─────────────────────────────────────────────────────────── */
  { id: 'S-QUIZ', section: 'Closing', label: 'Quiz Time', transition: 'zoom', element: <ClassroomQuiz lesson={SESSION} /> },
  { id: 'S-TAKEAWAYS', section: 'Closing', label: 'Key Takeaways', element: <Takeaways id="S-TAKEAWAYS" lesson={SESSION} items={AGENDA.map(({ title }) => ({ title }))} /> },
  { id: 'S-NEXT', section: 'Closing', label: 'Next session', transition: 'zoom', element: <NextSessionSlide title="Load Balancing & CDN" lesson={SESSION} /> },
  { id: 'feedback', section: 'Closing', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} /> },
  { id: 'S-THANKS', section: 'Closing', label: 'Thank You', transition: 'zoom', element: <ThankYouSlide title="Thank You" lesson={SESSION} /> },
  { id: 'S-BEST', section: 'Closing', label: 'All the Best', transition: 'zoom', element: <ThankYouSlide title="All the Best" lesson={SESSION} /> },
]
