import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  FeedbackSlide,
  NextSessionSlide,
  SectionBreakerSlide,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'
import { ClassroomQuiz } from '@/ui/foundations/ClassroomQuiz'
import { Takeaways } from './figures/closing'
import { installSpecKeys } from '@/ui/foundations/keys'
import { AUTOPLAY_ON_BY_DEFAULT } from '@/ui/foundations/autoplay'
import { ART_CSS } from './figures/art'
import { SCENE_CSS, STILL } from './figures/scene'
import { WhyCloud, NistReader, NistTree, OwnershipSplit, ArchitectureWalk, Drivers } from './figures/basics'
import { EraWalk, MainframeScene, HypervisorScene, GridScene, Milestones, EraTable } from './figures/history'
import { TraitRing, SelfService, DeviceRing, TenantRack } from './figures/traits1'
import { ControlBoard, ElasticChart, TwoLanes, MeterBank } from './figures/traits2'
import { TradeoffScale, CapexOpex, GrowthSpeed, LockIn, Overruns, RegionMap, PairScales } from './figures/benefits'
import {
  ApartmentAnalogy,
  ReadingRoomAnalogy,
  PlotAnalogy,
  TruckAnalogy,
  AtmAnalogy,
  MessAnalogy,
  BandAnalogy,
  MeterAnalogy,
  TaxiAnalogy,
  CupboardAnalogy,
  RoamingAnalogy,
} from './figures/analogy'

/**
 * CLOUD COMPUTING · "Cloud Computing Fundamentals"
 *
 * Built from `Outputs/cloudcomputing/session_plans/cloud_computing_fundamentals/plan.md`
 * (signed off on the user's word, 2026-10-14). The source is the reference
 * deck `Reference ppt's/cloud-computing-fundamentals 1.html`, used for its
 * CONTENT only: every title, kicker, lead, bullet, table cell, label, caption
 * and analogy claim on these slides is the reference's own string; the
 * speaker notes are its TR speaker notes and TR analogy lines.
 *
 * THE DESIGN is the plan's, not the reference's: one cast of character-lab
 * people (`figures/people.tsx`), drawn scenes (`figures/art.tsx`), every
 * concept a stepped scene with Next and Autoplay, and live controls the room
 * can use (sliders, switches, buttons) that never change slide.
 *
 * EIGHT "CONTINUED" PAIRS ARE ONE SLIDE EACH (plan decision 2): their second
 * frame's bullets and table arrive as later beats of the first.
 */

export const cloudMeta: DeckMeta = {
  title: 'Cloud Computing Fundamentals',
  course: 'Cloud Computing',
  lesson: 'Cloud Computing Fundamentals',
  presenter: 'NxtWave Instructor',
  player: { autoHideControls: true },
}

const SESSION = 'Cloud Computing Fundamentals'

/** The TR's own agenda, all five items, split at the colon it writes (content rule 20: the takeaways repeat these strings). */
const AGENDA = [
  { title: 'Cloud Computing Basics', sub: 'Definition & the NIST view; on-premise IT vs cloud; drivers: cost, scale & speed' },
  { title: 'History & Evolution', sub: 'Mainframes & time-sharing; client-server & virtualization; grid & utility computing; the public cloud era' },
  { title: 'Essential Characteristics - I', sub: 'On-demand self-service; broad network access; resource pooling & multi-tenancy' },
  { title: 'Essential Characteristics - II', sub: 'Rapid elasticity vs scalability; measured service & pay-per-use metering' },
  { title: 'Benefits & Challenges', sub: 'Cost model shift, elasticity, global reach & speed to market; vendor lock-in, cost overruns, latency & data residency' },
]

/* the keyframes the drawn objects use, and the range control's thumb; harness URLs hold every loop still */
if (typeof document !== 'undefined' && !document.getElementById('cc-css')) {
  const el = document.createElement('style')
  el.id = 'cc-css'
  el.textContent = ART_CSS + SCENE_CSS
  document.head.appendChild(el)
  if (STILL) document.documentElement.classList.add('cc-still')
}
installSpecKeys()

const say = (s: string) => `TR speaker notes: ${s}`
const analogy = (s: string) => `TR analogy: ${s}`

export const cloudDeck: SlideDef[] = [
  /* ── OPENING ─────────────────────────────────────────────────────────── */
  { id: 'brand', section: 'Opening', label: 'Brand', transition: 'fade', element: <BrandSlide greeting="Welcome!" lesson={SESSION} />, notes: 'The opening mark.' },
  { id: 'welcome', section: 'Opening', label: 'Welcome', transition: 'zoom', element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} />, notes: 'The session name.' },
  { id: 'agenda', section: 'Opening', label: 'Agenda', element: <AgendaSlide kicker={SESSION} title="Agenda" lesson={SESSION} items={AGENDA} />, notes: "The TR's own agenda, all five items. These exact strings come back on the Key Takeaways frame." },

  /* ── 1 · CLOUD COMPUTING BASICS ──────────────────────────────────────── */
  { id: 's1', section: AGENDA[0].title, label: 'Section divider', transition: 'zoom', element: <SectionBreakerSlide index={1} title={AGENDA[0].title} subtitle={AGENDA[0].sub} lesson={SESSION} /> },
  { id: 'why-emerged', section: AGENDA[0].title, label: 'Why cloud emerged', element: <WhyCloud lesson={SESSION} />, notes: `${say('Set up the capacity-planning problem before naming cloud computing as the fix. Interviewers often open this topic by asking what problem cloud computing actually solves.')} Drag Demand: Ravi's six servers sit idle when it is low and run short when it is high; Meera's cloud follows it.` },
  { id: 'nist', section: AGENDA[0].title, label: 'NIST formal view', element: <NistReader lesson={SESSION} />, notes: say('Name NIST SP 800-145 as the source so the definition is quoted correctly. This exact definition is a frequent interview question, so state it precisely.') },
  { id: 'nist-branches', section: AGENDA[0].title, label: 'NIST: three branches', element: <NistTree lesson={SESSION} />, notes: 'Only the characteristics are opened in this session; the service and deployment models are the next session, so name them and move on.' },
  { id: 'nist-analogy', section: AGENDA[0].title, label: 'Analogy: a furnished apartment', element: <ApartmentAnalogy lesson={SESSION} />, notes: analogy('Renting a furnished apartment instead of constructing a house gives instant living space without owning bricks or cement, just as cloud computing gives access to configurable computing resources on demand without owning the underlying infrastructure.') },
  { id: 'onprem-vs-cloud', section: AGENDA[0].title, label: 'On-premise vs cloud', element: <OwnershipSplit lesson={SESSION} />, notes: say('Stress the CapEx-to-OpEx shift as the single biggest contrast for interviews. Ask learners to map each row to a real purchase decision they know.') },
  { id: 'architecture', section: AGENDA[0].title, label: 'Cloud computing architecture', element: <ArchitectureWalk lesson={SESSION} />, notes: 'Walk the numbers: 1 is the front end, 9 is the internet between the halves, and 2 to 6 are the back-end layers with management and security running down both sides. Nothing on it is opened here; these layers are what the rest of the course builds on.' },
  { id: 'drivers', section: AGENDA[0].title, label: 'Adoption drivers', element: <Drivers lesson={SESSION} />, notes: say('Tie each driver to a concrete AWS tool so the point feels practical, not abstract. Interviewers often ask learners to justify a cloud migration using exactly these three drivers.') },

  /* ── 2 · HISTORY & EVOLUTION ─────────────────────────────────────────── */
  { id: 's2', section: AGENDA[1].title, label: 'Section divider', transition: 'zoom', element: <SectionBreakerSlide index={2} title={AGENDA[1].title} subtitle={AGENDA[1].sub} lesson={SESSION} /> },
  { id: 'four-eras', section: AGENDA[1].title, label: 'Four eras of computing', element: <EraWalk lesson={SESSION} />, notes: say("Frame this as the roadmap for the section before going era by era. Exam angle: each era is often asked as 'what did X contribute to cloud computing'.") },
  { id: 'mainframes', section: AGENDA[1].title, label: 'Mainframes and time-sharing', element: <MainframeScene lesson={SESSION} />, notes: say('Time-sharing is the first appearance of the resource-multiplexing idea cloud scales up massively. Exam angle: contrast queued batch jobs against interactive time-sharing.') },
  { id: 'mainframes-analogy', section: AGENDA[1].title, label: 'Analogy: a library reading room', element: <ReadingRoomAnalogy lesson={SESSION} />, notes: `${analogy('A library reading room with one shared encyclopedia set, where each reader gets a scheduled turn at the desk, just as time-sharing gave every terminal user a scheduled turn on one mainframe.')} The reason to share was never fairness: the machine was too expensive to leave idle.` },
  { id: 'virtualization', section: AGENDA[1].title, label: 'Client-server and virtualization', element: <HypervisorScene lesson={SESSION} />, notes: say('Virtualization is the direct technical ancestor of cloud multi-tenancy taught later in this session. Interview angle: explain how a hypervisor isolates VMs sharing one host.') },
  { id: 'virtualization-analogy', section: AGENDA[1].title, label: 'Analogy: a subdivided plot', element: <PlotAnalogy lesson={SESSION} />, notes: `${analogy("One large plot subdivided into separate, locked apartments by a building's structure, just as a hypervisor partitions one physical server into isolated virtual machines, each unaware of its neighbours.")} The structure does the dividing, and a tenant cannot undo it from inside their own flat.` },
  { id: 'grid-utility', section: AGENDA[1].title, label: 'Grid and utility computing', element: <GridScene lesson={SESSION} />, notes: say('Grid pioneered pooling distributed compute; utility pioneered pay-per-use billing, both feeding directly into cloud. Interview angle: distinguish grid (pooled computation) from cloud (pooled plus on-demand self-service).') },
  { id: 'grid-analogy', section: AGENDA[1].title, label: 'Analogy: a shared truck fleet', element: <TruckAnalogy lesson={SESSION} />, notes: `${analogy("Several small businesses sharing one shipping company's trucks, pooling partial loads and paying only for the weight each one ships, just as grid computing pools spare processing power and utility computing bills only for capacity consumed.")} The fleet is grid computing; paying by weight is utility computing.` },
  { id: 'public-cloud', section: AGENDA[1].title, label: 'Public cloud emerges', element: <Milestones lesson={SESSION} />, notes: say("AWS's 2006 launch is the commonly cited start of the modern public cloud industry. Exam angle: know that S3 preceded EC2 within that same year.") },
  { id: 'evolution-table', section: AGENDA[1].title, label: 'Evolution at a glance', element: <EraTable lesson={SESSION} />, notes: say('This table is a frequent interview question on cloud history. Ask learners to match each precursor model to the cloud characteristic it most resembles.') },
  { id: 'quiz-mid', section: AGENDA[1].title, label: 'Quiz time', transition: 'zoom', element: <ClassroomQuiz lesson={SESSION} />, notes: 'Open the quiz on the portal, everyone answers alone, then go through the answers together. Everything from here on assumes the room can already read mainframe, time-sharing, hypervisor and grid.' },

  /* ── 3 · ESSENTIAL CHARACTERISTICS - I ───────────────────────────────── */
  { id: 's3', section: AGENDA[2].title, label: 'Section divider', transition: 'zoom', element: <SectionBreakerSlide index={3} title={AGENDA[2].title} subtitle={AGENDA[2].sub} lesson={SESSION} /> },
  { id: 'five-traits', section: AGENDA[2].title, label: 'Five NIST traits', element: <TraitRing lesson={SESSION} />, notes: `${say('The five traits together form the complete NIST definition of cloud computing.')} Press any trait on the ring to replay its picture.` },
  { id: 'self-service', section: AGENDA[2].title, label: 'On-demand self-service', element: <SelfService lesson={SESSION} />, notes: `${say('Contrast this with traditional data-centre provisioning, which needed weeks of approval tickets.')} Press Launch Instance, or switch to CLI or API: the same request, no person in between.` },
  { id: 'self-service-analogy', section: AGENDA[2].title, label: 'Analogy: an ATM', element: <AtmAnalogy lesson={SESSION} />, notes: `${analogy('An ATM lets a customer withdraw cash any time, without a bank clerk approving each transaction, just as on-demand self-service lets a customer provision cloud resources instantly without provider staff involvement.')} What makes it self-service is the approval step that is not there.` },
  { id: 'network-access', section: AGENDA[2].title, label: 'Broad network access', element: <DeviceRing lesson={SESSION} />, notes: `${say('This leans on already-known HTTP and client-server concepts, now applied to cloud access. A private, LAN-only application lacks this same universal reachability.')} Press a device to send its request.` },
  { id: 'pooling', section: AGENDA[2].title, label: 'Pooling and multi-tenancy', element: <TenantRack lesson={SESSION} />, notes: say('Emphasise that hypervisor-enforced isolation is what keeps tenant data separate on shared hardware.') },
  { id: 'pooling-analogy', section: AGENDA[2].title, label: 'Analogy: a hostel mess kitchen', element: <MessAnalogy lesson={SESSION} />, notes: `${analogy('A hostel mess kitchen serves many students from one shared stock of vessels, portioning food on demand instead of giving each student a dedicated stove, exactly as resource pooling shares infrastructure dynamically across tenants.')} Pooling is defined by what is NOT dedicated.` },

  /* ── 4 · ESSENTIAL CHARACTERISTICS - II ──────────────────────────────── */
  { id: 's4', section: AGENDA[3].title, label: 'Section divider', transition: 'zoom', element: <SectionBreakerSlide index={4} title={AGENDA[3].title} subtitle={AGENDA[3].sub} lesson={SESSION} /> },
  { id: 'three-overview', section: AGENDA[3].title, label: 'Three characteristics overview', element: <ControlBoard lesson={SESSION} />, notes: say("Distinguish elasticity's automatic, reversible scaling from scalability's broader capacity question before tracing a live example.") },
  { id: 'elasticity', section: AGENDA[3].title, label: 'Rapid elasticity', element: <ElasticChart lesson={SESSION} />, notes: `${say('Elasticity is automatic and reversible, unlike a one-time capacity upgrade.')} Drag Time along the spike: the alarm rings above the red line and the instance count follows.` },
  { id: 'elasticity-analogy', section: AGENDA[3].title, label: 'Analogy: a rubber band', element: <BandAnalogy lesson={SESSION} />, notes: `${analogy('A rubber band stretches under load and springs back once released, just as auto-scaled capacity expands during a spike and contracts once demand fades.')} A band that stretched and stayed stretched would not be elastic.` },
  { id: 'elasticity-scalability', section: AGENDA[3].title, label: 'Elasticity vs scalability', element: <TwoLanes lesson={SESSION} />, notes: say('Trace the same flash-sale scenario for both terms so the contrast stays concrete. The trigger and timescale columns are the quick answer.') },
  { id: 'measured-service', section: AGENDA[3].title, label: 'Measured service', element: <MeterBank lesson={SESSION} />, notes: `${say('Metering makes elastic scaling financially viable, since every added instance bills only while running.')} Switch a metric off and its dial stops.` },
  { id: 'measured-analogy', section: AGENDA[3].title, label: 'Analogy: an electricity meter', element: <MeterAnalogy lesson={SESSION} />, notes: `${analogy('A household electricity meter records exactly how many units are consumed, and the bill reflects only that usage, just as cloud providers meter every compute-second and byte served, billing only for actual use.')} Zero use costs zero.` },

  /* ── 5 · BENEFITS & CHALLENGES ───────────────────────────────────────── */
  { id: 's5', section: AGENDA[4].title, label: 'Section divider', transition: 'zoom', element: <SectionBreakerSlide index={5} title={AGENDA[4].title} subtitle={AGENDA[4].sub} lesson={SESSION} /> },
  { id: 'tradeoffs', section: AGENDA[4].title, label: 'Cloud trade-offs map', element: <TradeoffScale lesson={SESSION} />, notes: say('Present benefits and challenges as one connected map rather than two separate lists. Interviewers often ask candidates to name both sides of a cloud trade-off in the same answer.') },
  { id: 'capex-opex', section: AGENDA[4].title, label: 'Cost model shift', element: <CapexOpex lesson={SESSION} />, notes: `${say('The shift is financial, not technical: the underlying compute still runs somewhere.')} Switch Reserved Instances on to see the lower rate.` },
  { id: 'capex-analogy', section: AGENDA[4].title, label: 'Analogy: renting a taxi', element: <TaxiAnalogy lesson={SESSION} />, notes: `${analogy('Renting a taxi for occasional trips avoids buying and maintaining a car that sits idle most days, exactly as OpEx cloud billing avoids owning hardware capacity that sits unused.')} The taxi is more expensive per kilometre, which is why Reserved Instances exist.` },
  { id: 'growth-speed', section: AGENDA[4].title, label: 'Growth and speed benefits', element: <GrowthSpeed lesson={SESSION} />, notes: say('Tie the benefit back to the underlying elasticity mechanism rather than the marketing phrase alone.') },
  { id: 'lock-in', section: AGENDA[4].title, label: 'Vendor lock-in', element: <LockIn lesson={SESSION} />, notes: `${say('Lock-in is a design-time risk that compounds with every proprietary service adopted, not a one-time migration cost.')} Press Move the application before and after the mitigation step.` },
  { id: 'lock-in-analogy', section: AGENDA[4].title, label: 'Analogy: fitted cupboards', element: <CupboardAnalogy lesson={SESSION} />, notes: analogy("A rented apartment fitted with the landlord's custom cupboards works only in that apartment, just as an application built entirely on one cloud's proprietary APIs runs only on that cloud.") },
  { id: 'cost-overruns', section: AGENDA[4].title, label: 'Cost overruns', element: <Overruns lesson={SESSION} />, notes: `${say('Stress that cost overruns are an operational discipline problem, not a pricing flaw.')} On the last step, stop the forgotten server and watch the bill flatten.` },
  { id: 'overruns-analogy', section: AGENDA[4].title, label: 'Analogy: roaming left on', element: <RoamingAnalogy lesson={SESSION} />, notes: analogy('Leaving international roaming switched on during travel racks up charges unnoticed until the bill arrives, just as unmonitored cloud resources keep billing until the invoice reveals the overrun.') },
  { id: 'latency-residency', section: AGENDA[4].title, label: 'Latency and residency', element: <RegionMap lesson={SESSION} />, notes: `${say('Distinguish latency as a performance concern from data residency as a legal constraint.')} Send a request to each Region and compare the trip.` },
  { id: 'benefit-risk', section: AGENDA[4].title, label: 'Benefit risk pairing', element: <PairScales lesson={SESSION} />, notes: `${say('Ask which risk applies to which benefit, since exam and interview questions often pair them directly. This pairing is the practical takeaway before any cloud migration decision.')} The beams start level: press a pan to tip it for your own case.` },

  /* ── CLOSING ─────────────────────────────────────────────────────────── */
  { id: 'quiz-close', section: 'Closing', label: 'Quiz time', transition: 'zoom', element: <ClassroomQuiz lesson={SESSION} />, notes: 'The last chance to find out whether the room believes the takeaways, while the session is still in the room.' },
  { id: 'takeaways', section: 'Closing', label: 'Key takeaways', element: <Takeaways lesson={SESSION} items={AGENDA} />, notes: "The TR's Key Takeaways list, which is its agenda word for word." },
  { id: 'next-session', section: 'Closing', label: 'Next session', transition: 'zoom', element: <NextSessionSlide title="Deployment & Service Models" lesson={SESSION} />, notes: "The TR's own upcoming-session line." },
  { id: 'feedback', section: 'Closing', label: 'Feedback', transition: 'fade', element: <FeedbackSlide lesson={SESSION} />, notes: 'Leave it on screen while the room fills the form. Read the link out rather than assuming everyone can see it.' },
  { id: 'thank-you', section: 'Closing', label: 'Thank you', transition: 'zoom', element: <ThankYouSlide title="Thank You" lesson={SESSION} /> },
  { id: 'all-the-best', section: 'Closing', label: 'All the Best', transition: 'zoom', element: <ThankYouSlide title="All the Best" lesson={SESSION} /> },
]

/**
 * WHICH SLIDES OPEN WITH AUTOPLAY ON (plan decision 11; SLIDE_WORKFLOW Stage 5:
 * a deck's own list, never copied). The kit's `AUTOPLAY_ON_BY_DEFAULT` ships
 * holding Python 31's slide numbers; it is a Set, so this deck replaces its
 * contents with its own: the eleven analogy scenes, found by id so a moved
 * slide keeps its setting. Every slide with a live control opens step-wise.
 */
const AUTOPLAY_IDS = ['nist-analogy', 'mainframes-analogy', 'virtualization-analogy', 'grid-analogy', 'self-service-analogy', 'pooling-analogy', 'elasticity-analogy', 'measured-analogy', 'capex-analogy', 'lock-in-analogy', 'overruns-analogy']
AUTOPLAY_ON_BY_DEFAULT.clear()
cloudDeck.forEach((s, i) => {
  if (AUTOPLAY_IDS.includes(s.id)) AUTOPLAY_ON_BY_DEFAULT.add(i + 1)
})
