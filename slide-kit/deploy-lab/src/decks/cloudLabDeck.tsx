import type { DeckMeta, SlideDef } from '@/deck/types'
import { BrandSlide, ContentSlide } from '@/slides'
import { CloudPicture } from '@/ui/CloudPicture'
import { RegionMap } from '@/ui/RegionMap'
import { ShareBar } from '@/ui/ShareBar'
import { Meter } from '@/ui/Meter'
import { PlaceLadder } from '@/ui/PlaceLadder'
import { ServiceField } from '@/ui/ServiceField'
import { SizeChart } from '@/ui/SizeChart'
import { LockAndKey } from '@/ui/LockAndKey'
import { OwnVsRented } from '@/ui/OwnVsRented'
import { TwoDoors } from '@/ui/TwoDoors'
import { MachineCard } from '@/ui/MachineCard'
import { Card, CardGrid } from '@/ui/content'

/**
 * CLOUD FIGURES — a lab, not a session.
 *
 * Deployment session 9 (Introduction to AWS) needs three pictures the kit does
 * not have. Hard rule 17 is why they are judged here instead of in the deck:
 * the three harnesses measure DOM rectangles, so a figure whose labels sit on
 * top of one another passes every sweep. Eight content slides are a cheaper
 * place to look than a 53-slide deck.
 *
 * One slide per figure state, each inside the real `ContentSlide` frame with
 * the title and lead the plan gives that slide, so the figure is judged at the
 * size and position it will actually have:
 *
 *   2 to 6   `CloudPicture` states 1 to 5   plan slides 10, 24, 34, 36, 38
 *   7 and 8  `RegionMap` world and zones     plan slides 32, 33
 *   9        `ShareBar`                      plan slide 20
 *   10 to 14 `Meter` running, stopped, idleBilled, alert, and four `sm` in cards
 *                                            plan slides 13, 48, 43, 46, 42
 *   15 to 18 `PlaceLadder` region, zone, subnet, all   plan slides 31, 33, 36, 39
 *   19       `CloudPicture` state 0          plan slide 7
 *   20       `ServiceField`                  plan slide 21
 *   21       `SizeChart`                     plan slide 26
 *   22, 23   `LockAndKey` apart, fitted      plan slide 28, and session 10
 *   24       `OwnVsRented` both, in cards    plan slide 8
 *   25       `TwoDoors`                      plan slide 18
 *   26       `MachineCard`                   plan slide 25
 *
 * Figures the plan puts in a right column (`points` beside `children`) are
 * shown that way here, so they are judged at the width they will have.
 *
 * Every `CloudPicture` slide passes `revealFrom={1}` so the WHOLE picture
 * builds on each slide here. In the session deck the default applies: only the
 * layer that is new on that slide animates and the rest holds still.
 */

export const cloudLabMeta: DeckMeta = {
  title: 'Cloud Figure Designs',
  course: 'slide-kit lab',
  lesson: 'Cloud Figure Designs',
  presenter: 'NxtWave',
}

const LESSON = 'Cloud Figure Designs'

export const cloudLabDeck: SlideDef[] = [
  {
    id: 'brand',
    label: 'Brand',
    section: 'Opening',
    element: <BrandSlide greeting="Welcome" lesson={LESSON} />,
    notes: 'The brand frame the kit opens every deck with. Not a candidate.',
  },
  {
    id: 'cloud-1',
    label: '1 · What a Server Is',
    section: 'CloudPicture',
    notes: 'Plan slide 10. Two requests leave the Internet: one lands on the server and its light comes on, the other dies at a cross before the laptop.',
    element: (
      <ContentSlide kicker="Cloud Basics" title="What a Server Is" lead="A server is a computer that is always on and has an address the Internet can reach. Your laptop does not" lesson={LESSON}>
        <CloudPicture state={1} revealFrom={1} />
      </ContentSlide>
    ),
  },
  {
    id: 'cloud-2',
    label: '2 · EC2 Rents a Computer',
    section: 'CloudPicture',
    notes: 'Plan slide 24. The building draws itself around the server, then the layers inside: Docker Engine and the two containers.',
    element: (
      <ContentSlide kicker="AWS and EC2" title="EC2 Rents a Computer" lead="Elastic Compute Cloud. The same server, in an Amazon building, running your two containers" lesson={LESSON}>
        <CloudPicture state={2} revealFrom={1} />
      </ContentSlide>
    ),
  },
  {
    id: 'cloud-3',
    label: '3 · VPC',
    section: 'CloudPicture',
    notes: 'Plan slide 34. The private network traces around the instance and a second instance joins it.',
    element: (
      <ContentSlide kicker="Regions and Networks" title="VPC" lead="Virtual Private Cloud. Your own private network inside AWS. Your instances talk to each other on it and nobody else is on it" lesson={LESSON}>
        <CloudPicture state={3} revealFrom={1} />
      </ContentSlide>
    ),
  },
  {
    id: 'cloud-4',
    label: '4 · Subnets',
    section: 'CloudPicture',
    notes: 'Plan slide 36. The VPC splits into three subnets, one per building. The instance shows both of its addresses.',
    element: (
      <ContentSlide kicker="Regions and Networks" title="Subnets" lead="A subnet is a slice of the VPC placed in one building. The instance has a private address inside and a public address outside" lesson={LESSON}>
        <CloudPicture state={4} revealFrom={1} />
      </ContentSlide>
    ),
  },
  {
    id: 'cloud-5',
    label: '5 · The Door List',
    section: 'CloudPicture',
    notes: 'Plan slide 38. A Security Group sits on the way in and lists which ports may be reached, and by whom.',
    element: (
      <ContentSlide kicker="Regions and Networks" title="The Door List" lead="A Security Group sits in front of the instance and lists which ports may be reached, and by whom. Closed unless listed" lesson={LESSON}>
        <CloudPicture state={5} revealFrom={1} />
      </ContentSlide>
    ),
  },
  {
    id: 'region-world',
    label: '6 · Pick the Nearest',
    section: 'RegionMap',
    notes: 'Plan slide 32. In the deck this sits beside the real Region selector capture, so it will be narrower there.',
    element: (
      <ContentSlide kicker="Regions and Networks" title="Pick the Nearest" lead="Every dot is a Region, a city with AWS data centres in it. Mumbai is the nearest to us" lesson={LESSON}>
        <RegionMap state="world" />
      </ContentSlide>
    ),
  },
  {
    id: 'region-zones',
    label: '7 · Availability Zones',
    section: 'RegionMap',
    notes: 'Plan slide 33. Mumbai opened into three separate buildings.',
    element: (
      <ContentSlide kicker="Regions and Networks" title="Availability Zones" lead="One Region is three separate buildings in one city. If one loses power the others do not" lesson={LESSON}>
        <RegionMap state="zones" />
      </ContentSlide>
    ),
  },
  {
    id: 'share',
    label: '8 · The Market Share',
    section: 'ShareBar',
    notes: 'Plan slide 20. Numbers come from props and are re-read on the day the deck is generated.',
    element: (
      <ContentSlide kicker="AWS and EC2" title="The Market Share" lead="About one in four cloud servers in the world is AWS. That is why it is the name in job listings" lesson={LESSON}>
        <ShareBar />
      </ContentSlide>
    ),
  },
  /* ── Meter ─────────────────────────────────────────────────────────── */
  {
    id: 'meter-running',
    label: '10 · Pay for Use',
    section: 'Meter',
    notes: 'Plan slide 13. The meter at home: the lamp lights, the bulb comes on, and the last digit ticks every 900ms for as long as the slide is up.',
    element: (
      <ContentSlide kicker="Cloud Basics" title="Pay for Use" lesson={LESSON}
        points={['You do not buy the power station', 'You pay per unit', 'The meter runs only while the light is on']}>
        <Meter state="running" unit="per unit" label="runs while the light is on" />
      </ContentSlide>
    ),
  },
  {
    id: 'meter-stopped',
    label: '11 · Billing in One Line',
    section: 'Meter',
    notes: 'Plan slide 48. The last picture of Concept 4: a meter at rest. No light, no ticking, nothing to pay.',
    element: (
      <ContentSlide kicker="Billing" title="Billing in One Line" lead="A stopped meter. No light, no ticking, nothing to pay" lesson={LESSON}>
        <Meter state="stopped" unit="per hour" label="nothing running, nothing to pay" size="md" />
      </ContentSlide>
    ),
  },
  {
    id: 'meter-idle',
    label: '12 · What Is Free',
    section: 'Meter',
    notes: 'Plan slide 43. The trap: the bulb is off and the digits still tick, in red. The disk of a stopped instance.',
    element: (
      <ContentSlide kicker="Billing" title="What Is Free" lesson={LESSON}
        points={['A stopped instance uses no CPU. Free', 'Data coming in. Free', 'The VPC, subnets and security groups. Free', 'The disk of a stopped instance. Still billed']}>
        <Meter state="idleBilled" unit="per GB per month" label="the disk of a stopped instance" size="md" />
      </ContentSlide>
    ),
  },
  {
    id: 'meter-alert',
    label: '13 · A Budget Alert',
    section: 'Meter',
    notes: 'Plan slide 46. The meter with a bell above the lamp and a red line across the readout at zero. The bell tilts once as the first digit passes it.',
    element: (
      <ContentSlide kicker="Billing" title="A Budget Alert" lead="A zero spend budget emails you at the first cent" lesson={LESSON}>
        <Meter state="alert" unit="per hour" label="emails you at the first cent" size="md" />
      </ContentSlide>
    ),
  },
  {
    id: 'meter-cards',
    label: '14 · What Costs Money',
    section: 'Meter',
    notes: 'Plan slide 42. Four small meters, one per card. The Elastic IP meter has its bulb off and its digits ticking in red: the one that charges with the light off.',
    element: (
      <ContentSlide kicker="Billing" title="What Costs Money" lead="Four meters run. Mumbai prices, checked 15 September 2026" lesson={LESSON}>
        <CardGrid cols={4}>
          <Card title="A running instance"><Meter state="running" unit="per hour" size="sm" /><p className="mt-2 text-body-sm">USD 0.0112 per hour, t3.micro</p></Card>
          <Card title="A disk"><Meter state="running" unit="per GB per month" size="sm" /><p className="mt-2 text-body-sm">USD 0.0912 per GB per month</p></Card>
          <Card title="An idle Elastic IP"><Meter state="idleBilled" unit="per hour while idle" size="sm" /><p className="mt-2 text-body-sm">USD 0.005 per hour, not attached</p></Card>
          <Card title="Data leaving AWS"><Meter state="running" unit="per GB out" size="sm" /><p className="mt-2 text-body-sm">USD 0.1093 per GB after 100 GB</p></Card>
        </CardGrid>
      </ContentSlide>
    ),
  },

  /* ── PlaceLadder ───────────────────────────────────────────────────── */
  {
    id: 'ladder-region',
    label: '15 · What a Region Is',
    section: 'PlaceLadder',
    notes: 'Plan slide 31. The top rung lit; the two below named but not yet taught. The anchor for the whole concept: a city, a building, a floor.',
    element: (
      <ContentSlide kicker="Regions and Networks" title="What a Region Is" lesson={LESSON}
        points={['A Region is a city with AWS data centres in it', 'Everything you create lives in one Region', 'The console shows one Region at a time']}>
        <PlaceLadder state="region" />
      </ContentSlide>
    ),
  },
  {
    id: 'ladder-zone',
    label: '16 · Availability Zones',
    section: 'PlaceLadder',
    notes: 'Plan slide 33, as the aside under the RegionMap caption. Second rung lit, the first kept in ink.',
    element: (
      <ContentSlide kicker="Regions and Networks" title="Availability Zones" lead="One Region is three separate buildings in one city. If one loses power the others do not" lesson={LESSON}>
        <PlaceLadder state="zone" size="sm" />
      </ContentSlide>
    ),
  },
  {
    id: 'ladder-subnet',
    label: '17 · Subnets',
    section: 'PlaceLadder',
    notes: 'Plan slide 36, as the aside under the capture. Third rung lit. The chain the room has climbed since slide 31 is complete.',
    element: (
      <ContentSlide kicker="Regions and Networks" title="Subnets" lead="A subnet is a slice of the VPC placed in one building" lesson={LESSON}>
        <PlaceLadder state="subnet" size="sm" />
      </ContentSlide>
    ),
  },
  {
    id: 'ladder-all',
    label: '18 · Networks in One Line',
    section: 'PlaceLadder',
    notes: 'Plan slide 39. Every rung lit and a bracket joining them: the concept summary as a shape.',
    element: (
      <ContentSlide kicker="Regions and Networks" title="Networks in One Line" lead="A Region is a city. A zone is a building in it. A subnet is a floor in the building" lesson={LESSON}>
        <PlaceLadder state="all" />
      </ContentSlide>
    ),
  },

  /* ── CloudPicture state 0 ──────────────────────────────────────────── */
  {
    id: 'cloud-0',
    label: '19 · What the Cloud Gives You',
    section: 'CloudPicture',
    notes: 'Plan slide 7. The frame before state 1: you, one line, a computer in someone else\'s building. No addresses, no cloud outline yet.',
    element: (
      <ContentSlide kicker="Cloud Basics" title="What the Cloud Gives You" lead="The cloud gives you a computer to run your server on" lesson={LESSON}>
        <CloudPicture state={0} />
      </ContentSlide>
    ),
  },

  /* ── ServiceField ──────────────────────────────────────────────────── */
  {
    id: 'service-field',
    label: '20 · Over 240 Services',
    section: 'ServiceField',
    notes: 'Plan slide 21. 240 squares fill in one wipe; four light up with their names; EC2 carries the chip. The four cards sit under this in the deck.',
    element: (
      <ContentSlide kicker="AWS and EC2" title="Over 240 Services" lead="AWS has more than 240 services. This course uses one, EC2, and looks at a second, VPC" lesson={LESSON}>
        <ServiceField count={240} cols={24} lit={[{ name: 'EC2', note: 'this course' }, { name: 'S3' }, { name: 'RDS' }, { name: 'VPC' }]} />
      </ContentSlide>
    ),
  },

  /* ── SizeChart ─────────────────────────────────────────────────────── */
  {
    id: 'size-chart',
    label: '21 · Instance Type',
    section: 'SizeChart',
    notes: 'Plan slide 26. Same width, doubling height. The smallest is marked. Beside the DataTable in the deck.',
    element: (
      <ContentSlide kicker="AWS and EC2" title="Instance Type" lesson={LESSON}
        points={['Every t3 size has two vCPU', 'Memory doubles: 1, 2, 4 GB', 't3.micro fits this course']}>
        <SizeChart sizes={[{ name: 't3.micro', ram: '1 GB', height: 56 }, { name: 't3.small', ram: '2 GB', height: 112 }, { name: 't3.medium', ram: '4 GB', height: 224 }]} />
      </ContentSlide>
    ),
  },

  /* ── LockAndKey ────────────────────────────────────────────────────── */
  {
    id: 'lock-apart',
    label: '22 · Key Pair',
    section: 'LockAndKey',
    notes: 'Plan slide 28. The key is a file on your laptop, the lock is on the instance, and they are not joined yet.',
    element: (
      <ContentSlide kicker="AWS and EC2" title="Key Pair" lead="The file that lets you in instead of a password. Made when the instance is launched, next session" lesson={LESSON}>
        <LockAndKey state="apart" />
      </ContentSlide>
    ),
  },
  {
    id: 'lock-fitted',
    label: '23 · Key Pair, fitted',
    section: 'LockAndKey',
    notes: 'Session 10, the moment the key pair is downloaded. The key travels along the line and the keyhole ring turns green.',
    element: (
      <ContentSlide kicker="AWS and EC2" title="Key Pair" lead="The key file on your laptop fits the lock on the instance" lesson={LESSON}>
        <LockAndKey state="fitted" />
      </ContentSlide>
    ),
  },

  /* ── OwnVsRented ───────────────────────────────────────────────────── */
  {
    id: 'own-vs-rented',
    label: '24 · Why Not Your Own System',
    section: 'OwnVsRented',
    notes: 'Plan slide 8. Two cards, a scene in each: the dots overflow the laptop; the screen goes dark as the third glyph lands.',
    element: (
      <ContentSlide kicker="Cloud Basics" title="Why Not Your Own System" lead="Two reasons your laptop cannot be the server" lesson={LESSON}>
        <CardGrid cols={2}>
          <Card title="It does not scale">
            <OwnVsRented state="scale" />
            <p className="mt-3 text-body-sm">Your laptop has the RAM it has. Ten users is fine, ten thousand is not</p>
          </Card>
          <Card title="It fails">
            <OwnVsRented state="fails" />
            <p className="mt-3 text-body-sm">A power cut, the lid closing, wifi dropping. Each one takes your site down</p>
          </Card>
        </CardGrid>
      </ContentSlide>
    ),
  },

  /* ── TwoDoors ──────────────────────────────────────────────────────── */
  {
    id: 'two-doors',
    label: '25 · Not the Shop',
    section: 'TwoDoors',
    notes: 'Plan slide 18. One roof, two doors. The door they know arrives first. Beside the two-column DataTable in the deck.',
    element: (
      <ContentSlide kicker="AWS and EC2" title="Not the Shop" lesson={LESSON}
        points={['amazon.in sells things. It is a shop', 'AWS rents computers to other companies', 'Both are one company, Amazon']}>
        <TwoDoors doors={[{ sign: 'amazon.in', mark: '/assets/companies/amazon.png', step: 'bag' }, { sign: 'AWS', mark: '/assets/tech/aws.png', step: 'server' }]} />
      </ContentSlide>
    ),
  },

  /* ── MachineCard ───────────────────────────────────────────────────── */
  {
    id: 'machine-card',
    label: '26 · Instance',
    section: 'MachineCard',
    notes: 'Plan slide 25. The same server box, with three facts pinned to three places on it, in bullet order.',
    element: (
      <ContentSlide kicker="AWS and EC2" title="Instance" lesson={LESSON}
        points={['It has a public address', 'It is on until you stop it', 'You log in with a key, over SSH']}>
        <MachineCard />
      </ContentSlide>
    ),
  },
]
