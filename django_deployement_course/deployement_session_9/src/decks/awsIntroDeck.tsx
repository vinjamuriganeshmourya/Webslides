import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  ContentNoteSlide,
  ContentSlide,
  FeedbackSlide,
  KeyTakeawaysSlide,
  PracticeSlide,
  QuestionSlide,
  SectionBreakerSlide,
  StatusPointsSlide,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'
import {
  AnalogyMap,
  Card,
  CardGrid,
  Chip,
  DataTable,
  Shot,
  StatTile,
  StepList,
} from '@/ui'
import { AnalogyPairs } from './figures/AnalogyPairs'
import { AnnotatedShot } from './figures/AnnotatedShot'
import { CloudPicture } from './figures/CloudPicture'
import { DataCentreView } from './figures/DataCentreView'
import { IllustratedRecap } from './figures/IllustratedRecap'
import { LockAndKey } from './figures/LockAndKey'
import { MachineCard } from './figures/MachineCard'
import { Meter } from './figures/Meter'
import { OwnVsRented } from './figures/OwnVsRented'
import { PlaceLadder } from './figures/PlaceLadder'
import {
  AwsLargest, CreditCard, Ec2Box, InstanceBox, LadderAll, LaptopCrossed, MeterAlert, MeterRunning,
  PaidThings, ServerWithAddress, TwoAddresses, VpcFrame,
} from './figures/recapFigures'
import { RegionMap } from './figures/RegionMap'
import { ServiceField } from './figures/ServiceField'
import { ShareBar } from './figures/ShareBar'
import { SizeChart } from './figures/SizeChart'
import { TwoDoors } from './figures/TwoDoors'
import {
  ACCOUNT_KICKER, AWS_MARK, C1, C2, C3, C4, COURSE, CREDIT_INR, CREDIT_USD,
  HOME_REGION, HOME_SEARCH, MarkRow, PendingShot, Scaled,
  SEARCH_BOX, SEARCH_EC2_ROW, SEARCH_SERVICES_TAB, SESSION,
  SETUP_COMPLETE_BUTTON, SETUP_UPGRADE_BUTTON,
} from './deckShared'

/**
 * DEPLOYMENT SESSION 9 — "Introduction to AWS", plan rev2
 *
 * Plan: `../../session_plans/deployement_session_9/plan.md`, signed off
 * 2026-09-15. Figures: `illustrations.md` beside it. 63 slides: the plan's 53, a three-slide data-centre block after What the Cloud Gives You (user, 2026-09-16),
 * the five account slides 3a to 3e the plan adds "on instruction", one slide
 * for the "Complete your account setup" page the room will meet if the account
 * is not finished, and the Subnets console capture on a frame of its own
 * because `CloudPicture` state 4 fills the well it would have shared.
 *
 * Vocabulary before hands. Nothing is launched. The one thing created is a
 * zero-spend budget. The next session launches the first instance.
 *
 * SIX THINGS AN EDIT HERE IS MOST LIKELY TO BREAK
 *
 *   1. Plan §2, beginner rule 1 and 2. One new word per slide, and its acronym
 *      is expanded once, in the lead, on the slide that owns it. AWS on slide
 *      24, EC2 on slide 29, VPC on slide 40, AMI on slide 32.
 *
 *   2. Rule 29. A title is the topic. A lead states the fact and never ends in
 *      a remark about it. Every title below is the plan's title, verbatim.
 *
 *   3. Rule 30. Every console walk-through carries a real capture. The account
 *      is not yet activated, so nine captures render `PendingShot`, a dashed
 *      frame that cannot pass for finished, and each one is listed in that
 *      slide's `notes` as CAPTURE. The deck is not done while one shows.
 *
 *   4. Rule 11 as amended for this deck: a full-screen console capture is never
 *      cropped. It goes through `AnnotatedShot` with a spotlight, numbered
 *      boxes in click order (at most three) and `inset="auto"`, at 840 px.
 *
 *   5. Rule 6. Text and its figure arrive together. Every figure is wrapped by
 *      the slide type's own `Reveal`, bullets are `immediate`, and the only
 *      click builds are card grids where the cards ARE the content.
 *
 *   6. Rule 18 is overridden on instruction. No quiz frames in this deck.
 *
 * ALSO: no spaced em dash (rule 1), never the word "stranger" (rule 2), and
 * Key Takeaways restates C1 to C4 verbatim (rule 20).
 */

export const awsIntroMeta: DeckMeta = {
  title: SESSION,
  course: COURSE,
  lesson: SESSION,
  presenter: 'NxtWave Instructor',
}

const ACCOUNT_SHOWS = 'Console → account name (top right)'

export const awsIntroDeck: SlideDef[] = [
  /* ═══ OPENING ═══════════════════════════════════════════════════════ */
  {
    id: 'brand', section: 'Opening', label: 'Brand',
    element: <BrandSlide greeting="Welcome" lesson={SESSION} />,
  },
  {
    id: 'session-name', section: 'Opening', label: 'Session name',
    element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} />,
  },
  {
    id: 'where-we-left-off', section: 'Opening', label: 'Where we left off',
    element: (
      <StatusPointsSlide kicker="Where We Left Off" title="Where We Left Off" lead="Two things are done. One is not" lesson={SESSION} items={[
        { status: 'success', text: 'The pipeline pushes two images on every push', detail: 'nxttrendz-backend and nxttrendz-frontend, on Docker Hub, tagged with the build number' },
        { status: 'success', text: 'An AWS account exists, on the Free plan', detail: 'Created at the end of the Jenkins sessions. Today we open it for the first time' },
        { status: 'error', text: 'Nothing runs the images yet', detail: 'They sit on Docker Hub. This session is about the computer that will run them' },
      ]} />
    ),
    notes: 'Say out loud: the last session ended with the AWS sign-up. Anyone who has not finished it will do so in the next four slides.',
  },

  /* ── The account block, plan 3a to 3e ─────────────────────────────── */
  {
    id: 'account-first', section: ACCOUNT_KICKER, label: 'Your account first',
    element: (
      <ContentNoteSlide kicker={ACCOUNT_KICKER} title="Your Account First" lead="Every screen after this one needs a signed-in AWS console" lesson={SESSION} points={[
        { text: 'Open your AWS console on your own laptop before the first concept starts', icon: 'devices' },
        { text: `The Free plan gives you ${CREDIT_USD} of credit, about ${CREDIT_INR}`, icon: 'check' },
        { text: 'Nothing in this session costs money. Nothing is created except one budget alert', icon: 'shield' },
      ]} note={{ kind: 'info', title: 'Not signed up yet?', body: 'The next three slides walk through it. Sign up on your own device with your own details. Nobody collects your card details.' }} />
    ),
    notes: 'Take two minutes here. Ask for a show of hands: who can see the console home right now? Those who cannot follow the next slides while the rest wait.',
  },
  {
    id: 'create-account', section: ACCOUNT_KICKER, label: 'Create the account',
    element: (
      <ContentSlide kicker={ACCOUNT_KICKER} title="Create the Account" lead="Four steps. Each screen asks for one thing" lesson={SESSION}>
        <div className="grid grid-cols-[1fr_1fr] items-center gap-10">
          <Shot
            src="/shots/aws-signup.png"
            alt="The AWS sign-up form with empty Root user email address and AWS account name fields, next to the offer of USD 100 in credits for up to 6 months"
            caption="portal.aws.amazon.com/billing/signup → first screen: your email and an account name"
            className="mx-auto max-w-[500px]"
          />
          <div className="mt-8">
          <StepList steps={[
            { title: 'Email → account name → email code', detail: 'The email becomes your login name' },
            { title: 'Password → contact details', detail: 'Personal, not Business. Match your bank records' },
            { title: 'Card or UPI → identity check', detail: 'For identity only. Up to USD 1 may be held and returned' },
            { title: 'Phone code → choose Free plan', detail: 'The only choice that matters for money' },
          ]} />
          </div>
        </div>
      </ContentSlide>
    ),
    notes: 'Anyone not done starts now. The others move on with the room; the sign-up runs in the background on their laptop. Activation can take minutes or up to 24 hours.',
  },
  {
    id: 'choose-free-plan', section: ACCOUNT_KICKER, label: 'Choose Free plan',
    element: (
      <ContentSlide kicker={ACCOUNT_KICKER} title="Choose Free Plan" lead="Sign-up asks you to choose Free plan or Paid plan. Choose Free plan" lesson={SESSION}>
        <Shot
          src="/shots/aws-free-vs-paid-plan.png"
          alt="The Compare the plans table on the AWS Free Tier page. Two columns, Free plan and Paid plan. The Free plan row Billed for the usage says no charges incurred unless you upgrade to a Paid plan"
          caption="aws.amazon.com/free → Compare the plans. The Free plan is never billed unless you click Upgrade"
          highlight={{ left: 33.9, top: 22.4, width: 32.2, height: 75.5 }}
          className="mx-auto mt-2 max-w-[600px]"
        />
      </ContentSlide>
    ),
    notes: 'Checked on 2026-09-15 on the Free Tier FAQ. The chooser sits after payment and phone verification in the real flow. This capture is the same two plans on the public Free Tier page.',
  },
  {
    id: 'sign-in', section: ACCOUNT_KICKER, label: 'Sign in',
    element: (
      <ContentSlide kicker={ACCOUNT_KICKER} title="Sign In" lead="Sign in as the Root user with the email you registered. The console home opens" lesson={SESSION}>
        <div className="grid grid-cols-[1fr_1fr] items-center gap-10">
          <PendingShot
            of="The AWS sign-in page, Root user selected"
            at="signin.aws.amazon.com → Root user → Next"
            shows="Two radio buttons, Root user and IAM user. Root user is the one you made. The email field below it"
          />
          <StepList steps={[
            { title: 'Open signin.aws.amazon.com', detail: 'Or the Sign in button on aws.amazon.com' },
            { title: 'Root user → your email → Next', detail: 'IAM user is for teams. Not today' },
            { title: 'Password → Sign in', detail: 'The console home opens. The Region name is at the top right' },
          ]} />
        </div>
      </ContentSlide>
    ),
    notes: 'CAPTURE pending: signin.aws.amazon.com with Root user selected and an empty email field. Personal fields empty, per rule 30. Then say: Console → top right. It should say Asia Pacific (Mumbai). If it does not, we fix it in the Regions concept.',
  },
  {
    id: 'not-finished', section: ACCOUNT_KICKER, label: 'Not finished yet',
    element: (
      <ContentSlide kicker={ACCOUNT_KICKER} title="Not Finished Yet" lead="If EC2 opens this page, the sign-up is not complete" lesson={SESSION}>
        <AnnotatedShot
          src="/shots/aws-complete-account-setup.png"
          alt="The Complete your account setup page: a three-item checklist about payment method, email requests and payment verification, a Complete your AWS registration button, and below it a Free account plan access limitations section with an Upgrade plan button"
          highlights={[{ ...SETUP_COMPLETE_BUTTON, step: 1, label: 'Click this one' }]}
          spotlight
          frameWidth={760}
          mark={AWS_MARK}
          caption="Console → EC2, before the account is active. 1 Complete your AWS registration. Do not click Upgrade plan"
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: 'This is a real capture from the account this deck was built on, taken before it was activated. AWS may hold up to USD 1 for 3 to 5 days to verify the card. It is returned. Full activation can take 24 hours.',
  },
  {
    id: 'check-credits', section: ACCOUNT_KICKER, label: 'Check your credits',
    element: (
      <ContentSlide kicker={ACCOUNT_KICKER} title="Check Your Credits" lead={`The console shows ${CREDIT_USD} of credit, in two places`} lesson={SESSION}>
        <div className="grid grid-cols-[1fr_1.3fr] items-center gap-10">
          <Shot
            src="/shots/aws-free-plan-status.png"
            alt="The Free plan status panel: Credits remaining $100.00 USD, Days remaining 182 days, and a note that free access ends on Mar 15, 2027 or when credits are used"
            caption={`${ACCOUNT_SHOWS} → Free plan status. ${CREDIT_USD}, 182 days`}
            className="mx-auto w-full max-w-[420px]"
          />
          <Shot
            src="/shots/aws-cost-and-usage-credits.png"
            alt="The Cost and usage widget on the console home: Credits remaining US$100.00 USD, Days remaining 182 days (Mar 15, 2027), and Current month, Forecast month end and Cost breakdown still loading"
            caption="Console home → Cost and usage widget. The same two figures"
            className="mx-auto w-full max-w-[560px]"
          />
        </div>
      </ContentSlide>
    ),
    notes: `Two places show the same number, so nobody has to hunt. The days remaining count down from 182 whether or not anything runs. ${CREDIT_USD} is about ${CREDIT_INR}.`,
  },
  {
    id: 'agenda', section: 'Opening', label: 'Agenda',
    element: (
      <AgendaSlide kicker={SESSION} title="Agenda" lesson={SESSION} items={[
        { title: C1, sub: 'What the cloud is, and why your laptop cannot do the job' },
        { title: C2, sub: 'What Amazon rents out, and the service that rents a computer' },
        { title: C3, sub: 'Where the computer lives, and the private network around it' },
        { title: C4, sub: 'Where the money goes, and how to make sure it is zero' },
      ]} />
    ),
  },
  {
    id: 'one-question', section: 'Opening', label: 'One question',
    element: <QuestionSlide kicker="A question first" question="Where does a website live when it is not on your laptop?" lesson={SESSION} />,
    notes: 'Take three answers. "A server", "the cloud", "Google" are all fine. The next concept turns the answers into words the room can use.',
  },

  /* ═══ CONCEPT 1 · Cloud Basics (divider + 9) ════════════════════════ */
  { id: 'c1-divider', section: C1, label: '01', element: <SectionBreakerSlide index={1} title={C1} lesson={SESSION} /> },
  {
    id: 'c1-what-cloud-gives', section: C1, label: 'What the cloud gives you',
    element: (
      <ContentSlide kicker={C1} title="What the Cloud Gives You" lead="The cloud gives you a computer to run your server on. It is a real computer in a Data Centre. You reach it over the internet, and you pay for the hours you use" lesson={SESSION}>
        <CloudPicture state={0} />
      </ContentSlide>
    ),
    notes: 'Answers the question on the last slide. Point at the three parts of the picture as you say the three sentences: you, the line, the building.',
  },
  {
    id: 'c1-dc-question', section: C1, label: 'Data centres, a question',
    element: <QuestionSlide kicker="A question first" question="The name Data Centre is in the news. What is inside one?" lesson={SESSION} />,
    notes: 'Ask why the room has heard the word: new data centres are announced across India every few months. Take two answers. Most say "computers" or "servers". The next slide shows the building.',
  },
  {
    id: 'c1-dc-what', section: C1, label: 'What a Data Centre is',
    element: (
      <ContentSlide kicker={C1} title="What a Data Centre Is" lead="A Data Centre is a building full of computers that run websites and apps for other people. The computer the cloud gives you is one of them" lesson={SESSION}>
        <DataCentreView state="building" />
      </ContentSlide>
    ),
    notes: 'One new word: data centre. Every small box is a computer like the one on the last slide, with its light on. The four things around the building are drawn faint on purpose; they are named on the next slide.',
  },
  {
    id: 'c1-dc-inside', section: C1, label: 'Inside a Data Centre',
    element: (
      <ContentSlide kicker={C1} title="Inside a Data Centre" lead="Four things keep the computers running when a home cannot: two power lines and a generator, cooling, many internet lines, and guards" lesson={SESSION}>
        <DataCentreView state="parts" />
      </ContentSlide>
    ),
    notes: 'Read the four in the order they light up: power, cooling, internet, guards. Each one is something a laptop at home does not have, which is the next slide.',
  },
  {
    id: 'c1-data-centre', section: C1, label: 'A Data Centre',
    element: (
      <ContentSlide kicker={C1} title="A Data Centre" lead="This is a real one. Thousands of computers, cooled, guarded, always on. The cloud rents you one of them" lesson={SESSION}>
        <PendingShot
          of="The AWS Global Infrastructure page, or a photograph of an AWS Data Centre"
          at="aws.amazon.com/about-aws/global-infrastructure"
          shows="The map of Regions and the count of Data Centres. If a photograph is chosen instead, it needs a free licence and attribution in workflow/assets-manifest.md"
        />
      </ContentSlide>
    ),
    notes: 'CAPTURE pending: the AWS Global Infrastructure page at 2x, or an approved photograph. The drawing on the last two slides was the idea; this is the real thing. It is also the proof for the "it fails" card two slides on.',
  },
  {
    id: 'c1-why-not-own', section: C1, label: 'Why not your own system',
    element: (
      <ContentSlide kicker={C1} title="Why Not Your Own System" lead="Your laptop is not that building. Why can it not be the computer that runs your website? Two reasons" lesson={SESSION}>
        <CardGrid cols={2}>
          <Card title="It does not scale">
            <OwnVsRented state="scale" />
            <p className="mt-3 text-body-sm">Your laptop has the RAM it has. Ten users is fine, ten thousand is not. You cannot add nine more laptops in a minute. A rented computer changes size in minutes</p>
          </Card>
          <Card title="It fails">
            <OwnVsRented state="fails" />
            <p className="mt-3 text-body-sm">A power cut, wifi dropping, the lid closing, a Windows update. Each one takes your site down. A Data Centre has backup power, a spare network and someone awake at 3 a.m.</p>
          </Card>
        </CardGrid>
      </ContentSlide>
    ),
    notes: 'Ask the question in the lead first and take answers. Then click the first card, then the second. Watch the room watch the dots overflow.',
  },
  {
    id: 'c1-laptop-not-server', section: C1, label: 'A laptop is not a server',
    element: (
      <ContentSlide kicker={C1} title="A Laptop Is Not a Server" lead="Four more things a website needs that a laptop does not give it" lesson={SESSION}>
        <DataTable columns={[{ label: 'A website needs' }, { label: 'Your laptop' }]} rows={[
          ['To be on all day and all night', 'Sleeps when the lid closes. Off when you go home'],
          ['To be reachable from outside', 'Behind the college or home wifi. Nobody outside can reach it'],
          ['One address that never changes', 'Gets a new address every time it joins a network'],
          ['Nobody editing the code while it runs', 'You edit the code on it all day'],
        ]} />
      </ContentSlide>
    ),
  },
  {
    id: 'c1-what-server-is', section: C1, label: 'What a server is',
    element: (
      <ContentSlide kicker={C1} title="What a Server Is" lead="A server is a computer that is always on and has an address the internet can reach. Your laptop does not have one" lesson={SESSION}>
        <CloudPicture state={1} />
      </ContentSlide>
    ),
    notes: 'One new word: server. Two requests leave the internet. One lands on the server and its light comes on. The other dies before the laptop.',
  },
  {
    id: 'c1-buy-or-rent', section: C1, label: 'Buying or renting',
    element: (
      <ContentSlide kicker={C1} title="Buying or Renting" lead="You can buy a server or rent one. The cloud is renting" lesson={SESSION}>
        <DataTable columns={[{ label: '' }, { label: 'Buy a machine' }, { label: 'Rent one' }]} rows={[
          ['You pay', 'A large sum up front', 'A small sum per hour'],
          ['You need', 'A room, cooling, a power line, a fast internet line', 'A laptop and a login'],
          ['When it breaks', 'You fix it', 'They fix it. You do not notice'],
          ['When you are done', 'You still own it', 'You turn it off and stop paying'],
        ]} highlight={[2]} />
      </ContentSlide>
    ),
  },
  {
    id: 'c1-pay-for-use', section: C1, label: 'Pay for use',
    element: (
      <ContentSlide kicker={C1} title="Pay for Use" lead="You pay for the cloud the way you pay for electricity at home. The meter runs only while something is on" lesson={SESSION}>
        <div className="grid grid-cols-[420px_1fr] items-center gap-8">
          <Meter state="running" unit="per unit" label="runs while the light is on" />
          <AnalogyPairs width={680} />
        </div>
      </ContentSlide>
    ),
    notes: 'One new phrase: pay for use. The last digit of the meter ticks while the bulb is lit. Let the room notice it before you say it. Then read the four pairs top to bottom: the room already owns the left column.',
  },
  {
    id: 'c1-who-rents', section: C1, label: 'Who rents them out',
    element: (
      <ContentSlide kicker={C1} title="Who Rents Them Out" lead="Three companies rent computers this way. This course uses AWS" lesson={SESSION}>
        <CardGrid cols={3}>
          <Card title={<MarkRow src="/assets/tech/aws.png" alt="AWS">AWS</MarkRow>}>
            <p className="text-body-sm">Amazon's cloud. The one this course uses</p>
            <Chip tone="brand" className="mt-3">this course</Chip>
          </Card>
          <Card title={<MarkRow src="/assets/companies/microsoft.png" alt="Microsoft">Microsoft Azure</MarkRow>}>
            <p className="text-body-sm">Microsoft's cloud. Common in large companies</p>
          </Card>
          <Card title={<MarkRow src="/assets/companies/google.png" alt="Google">Google Cloud</MarkRow>}>
            <p className="text-body-sm">Google's cloud. Common in data and machine learning work</p>
          </Card>
        </CardGrid>
      </ContentSlide>
    ),
    notes: 'No size claim here. The numbers come in the next concept, after the room has said what it thinks AWS is.',
  },
  {
    id: 'c1-recap', section: C1, label: 'Cloud in one line',
    element: (
      <IllustratedRecap kicker={C1} title="Cloud in One Line" lesson={SESSION} lines={[
        { text: 'Your own machine cannot grow and cannot stay up', figure: <LaptopCrossed /> },
        { text: 'A server is an always-on computer with a public address', figure: <ServerWithAddress /> },
        { text: 'The cloud rents you one by the hour', figure: <MeterRunning /> },
      ]} />
    ),
  },

  /* ═══ CONCEPT 2 · AWS and EC2 (divider + 13) ════════════════════════ */
  { id: 'c2-divider', section: C2, label: '02', element: <SectionBreakerSlide index={2} title={C2} lesson={SESSION} /> },
  {
    id: 'c2-what-you-know', section: C2, label: 'What you know',
    element: <QuestionSlide kicker="Before we define it" question="What do you already know about AWS?" lesson={SESSION} />,
    notes: 'Take two or three answers aloud. Most rooms say Amazon, shopping, delivery. That answer is the setup for the next slide: they are not wrong, they have only used one door.',
  },
  {
    id: 'c2-not-the-shop', section: C2, label: 'Not the shop',
    element: (
      <ContentSlide kicker={C2} title="Not the Shop" lead="Amazon the shop and AWS are one company with two doors. You have used one of them" lesson={SESSION}>
        <div className="grid grid-cols-[460px_1fr] items-center gap-10">
          <TwoDoors doors={[{ sign: 'amazon.in', mark: '/assets/companies/amazon.png', step: 'bag' }, { sign: 'AWS', mark: '/assets/tech/aws.png', step: 'server' }]} />
          <div>
            <DataTable compact columns={[{ label: '' }, { label: 'amazon.in' }, { label: 'AWS' }]} rows={[
              ['What it is', 'A shop', 'Amazon Web Services'],
              ['What it sells', 'Things, delivered to your door', 'Computers, rented by the hour'],
              ['Who buys', 'You', 'Companies that run websites'],
              ['Since', 'The part you have used', '2006'],
            ]} />
            <p className="mt-3 text-body-sm text-body">In 2025 AWS was about 18 percent of Amazon's sales and about 57 percent of its operating profit. Source: Amazon's 2025 annual report</p>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: 'Numbers verified against the plan §11 source list on 2026-09-15. Re-read Amazon\'s annual report segment results if the deck is regenerated later.',
  },
  {
    id: 'c2-what-aws-is', section: C2, label: 'What AWS is',
    element: (
      <ContentSlide kicker={C2} title="What AWS Is" lead="AWS is Amazon Web Services, Amazon's cloud. It rents computers, disks, databases and networks by the hour" lesson={SESSION} points={[
        { text: 'Data centres in many countries. You pick which one your computer is in', icon: 'globe' },
        { text: 'Everything is rented by the hour, and turned off when you are done', icon: 'bolt' },
        { text: 'This course uses one of its services, EC2, and looks at a second, VPC', icon: 'target' },
      ]}>
        <div className="flex flex-col items-center gap-4 rounded-card border border-line bg-white p-8 shadow-card-soft">
          <img src="/assets/tech/aws.png" alt="AWS" draggable={false} className="h-24 w-auto select-none" />
          <span className="font-heading text-xl font-bold text-ink">Amazon Web Services</span>
          <span className="text-body-sm text-body">Amazon's cloud, since 2006</span>
        </div>
      </ContentSlide>
    ),
    notes: 'One new word: AWS, expanded once here. From now on say AWS.',
  },
  {
    id: 'c2-market-share', section: C2, label: 'The market share',
    element: (
      <ContentSlide kicker={C2} title="The Market Share" lead="Close to three in ten cloud servers in the world are rented from AWS. That is why it is the name in job listings" lesson={SESSION}>
        <ShareBar />
      </ContentSlide>
    ),
    notes: 'Synergy Research Group, Q2 2026: AWS 28, Microsoft Azure 20, Google Cloud 15, the three together 63 percent of world cloud infrastructure. The bars say what a table cannot: AWS is bigger than the next two put together. Re-read the quarterly release if the deck is regenerated.',
  },
  {
    id: 'c2-240-services', section: C2, label: 'Over 240 services',
    element: (
      <ContentSlide kicker={C2} title="Over 240 Services" lead="AWS has more than 240 services. This course uses one, EC2, and looks at a second, VPC" lesson={SESSION}>
        <ServiceField count={240} cols={24} lit={[{ name: 'EC2', note: 'this course' }, { name: 'S3' }, { name: 'RDS' }, { name: 'VPC' }]} className="mb-5" />
        <CardGrid cols={4}>
          <Card title="EC2"><p className="text-body-sm">Rents you a computer</p></Card>
          <Card title="S3"><p className="text-body-sm">Stores files</p></Card>
          <Card title="RDS"><p className="text-body-sm">Runs a database for you</p></Card>
          <Card title="VPC"><p className="text-body-sm">Your private network</p></Card>
        </CardGrid>
      </ContentSlide>
    ),
    notes: 'aws.amazon.com says "over 240 fully featured services", checked 2026-09-15. Older pages say 200. The room does not need 240. Click each card as you name it.',
  },
  {
    id: 'c2-console', section: C2, label: 'The console',
    element: (
      <ContentSlide kicker={C2} title="The Console" lead="This is what you see after sign-in. Two things to find: the search box and the Region name" lesson={SESSION}>
        <AnnotatedShot
          src="/shots/aws-console-home.png"
          alt="The whole AWS Console home page: the search box in the top bar, the Region name Asia Pacific (Mumbai) at the top right, Recently visited with quick links to EC2, S3, CloudWatch and IAM, Welcome to AWS, and AWS Health"
          highlights={[
            { ...HOME_SEARCH, step: 1, label: 'Search box' },
            { ...HOME_REGION, step: 2, label: 'Region', labelAt: 'below' },
          ]}
          spotlight
          inset="auto"
          frameWidth={840}
          mark={AWS_MARK}
          caption="console.aws.amazon.com after sign-in. 1 the search box, 2 the Region name, Asia Pacific (Mumbai)"
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: 'Real capture from the account this deck was built on. The account name and ID at the very top right are that account\'s own; the plan asked for them to be cropped, and the no-crop rule for console captures won. Say: yours will show your name.',
  },
  {
    id: 'c2-find-ec2', section: C2, label: 'Find EC2',
    element: (
      <ContentSlide kicker={C2} title="Find EC2" lead="Console → search box → type EC2. The first result under Services is the one to click" lesson={SESSION}>
        <AnnotatedShot
          src="/shots/aws-search-ec2.png"
          alt="The AWS Console with EC2 typed in the search box and the results panel open: Services selected in the left list, and EC2, Virtual Servers in the Cloud, as the first result"
          highlights={[
            { ...SEARCH_BOX, step: 1, label: 'Type EC2' },
            { ...SEARCH_SERVICES_TAB, step: 2, label: 'Services', labelAt: 'left' },
            { ...SEARCH_EC2_ROW, step: 3, label: 'Click EC2', labelAt: 'below' },
          ]}
          spotlight
          inset="auto"
          frameWidth={820}
          mark={AWS_MARK}
          caption="Console → search box → EC2. 1 type EC2, 2 Services is the selected group, 3 click the EC2 row. This is how you reach any of the 240"
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: 'Do not click it yet on a not-yet-active account: it opens the Complete your account setup page from the account block. Everyone else sees the EC2 dashboard, which we look at in the next session.',
  },
  {
    id: 'c2-ec2-rents', section: C2, label: 'EC2 rents a computer',
    element: (
      <ContentSlide kicker={C2} title="EC2 Rents a Computer" lead="EC2 is Elastic Compute Cloud, the AWS service that rents you one computer. It is the same server as before, in an Amazon building, running your two containers" lesson={SESSION}>
        <CloudPicture state={2} />
      </ContentSlide>
    ),
    notes: 'One new word: EC2, expanded once here. The building draws itself around the server, then the layers inside: Docker Engine and the two containers. Elastic means it can change size.',
  },
  {
    id: 'c2-instance', section: C2, label: 'Instance',
    element: (
      <ContentSlide kicker={C2} title="Instance" lead="An instance is AWS's word for one rented computer" lesson={SESSION} points={[
        { text: 'It has a public address, so the internet can reach it', icon: 'globe' },
        { text: 'It is on until you stop it. It never sleeps', icon: 'bolt' },
        { text: 'You log in with a key file, over SSH, from your laptop', icon: 'key' },
      ]}>
        <MachineCard />
      </ContentSlide>
    ),
    notes: 'One new word: instance. It is the same box the room met on What a Server Is. Three facts pinned to three places on it, in bullet order.',
  },
  {
    id: 'c2-instance-type', section: C2, label: 'Instance type',
    element: (
      <ContentSlide kicker={C2} title="Instance Type" lead="The instance type is the size of the computer. Every t3 size has two vCPU. Memory doubles at each step" lesson={SESSION}>
        <div className="grid grid-cols-[460px_1fr] items-center gap-10">
          <SizeChart sizes={[{ name: 't3.micro', ram: '1 GiB', height: 56 }, { name: 't3.small', ram: '2 GiB', height: 112 }, { name: 't3.medium', ram: '4 GiB', height: 224 }]} />
          <DataTable compact columns={[{ label: 'Type' }, { label: 'vCPU' }, { label: 'Memory' }, { label: 'Fits this course' }]} rows={[
            [<code key="a">t3.micro</code>, '2', '1 GiB', 'Yes'],
            [<code key="b">t3.small</code>, '2', '2 GiB', 'More than needed'],
            [<code key="c">t3.medium</code>, '2', '4 GiB', 'More than needed'],
          ]} highlight={[0]} />
        </div>
      </ContentSlide>
    ),
    notes: 'One new phrase: instance type. AWS writes GiB. CAPTURE optional, plan slide 26: EC2 → Instance Types, filtered to t3, if the row reads clearly at 840 px. The table stands in until then.',
  },
  {
    id: 'c2-ami', section: C2, label: 'AMI',
    element: (
      <ContentSlide kicker={C2} title="AMI" lead="An AMI is an Amazon Machine Image, the template the computer boots from. A Docker image is to a container what an AMI is to an instance" lesson={SESSION}>
        <AnalogyMap leftLabel="Docker, which you know" rightLabel="AWS" rows={[
          { from: 'A Docker image', to: 'An AMI' },
          { from: 'A container started from it', to: 'An instance started from it' },
          { from: 'One image, many containers', to: 'One AMI, many instances' },
          { from: 'python:3.12 is an image', to: 'Ubuntu Server 24.04 is our AMI' },
        ]} />
        <div className="mt-6 flex items-center justify-center gap-12 text-body-sm text-body">
          <MarkRow src="/assets/tech/docker.png" alt="Docker" size={32}>Docker image</MarkRow>
          <MarkRow src="/assets/tech/linux.png" alt="Linux" size={32}>Ubuntu Server 24.04, a Linux AMI</MarkRow>
        </div>
      </ContentSlide>
    ),
    notes: 'One new word: AMI, expanded once here. The room already owns the left column. Next session picks Ubuntu Server 24.04 from the AMI list.',
  },
  {
    id: 'c2-key-pair', section: C2, label: 'Key pair',
    element: (
      <ContentSlide kicker={C2} title="Key Pair" lead="A key pair is the file that lets you into the instance instead of a password. It is made when the instance is launched, next session" lesson={SESSION}>
        <LockAndKey state="apart" />
      </ContentSlide>
    ),
    notes: 'One new phrase: key pair. One sentence on the slide, so the drawing carries the rest: the key is a file on your laptop, the lock is on the instance, and they are not joined yet.',
  },
  {
    id: 'c2-recap', section: C2, label: 'AWS in one line',
    element: (
      <IllustratedRecap kicker={C2} title="AWS in One Line" lesson={SESSION} lines={[
        { text: 'AWS is Amazon\'s cloud, the largest in the world', figure: <AwsLargest /> },
        { text: 'EC2 is the service that rents you one computer', figure: <Ec2Box /> },
        { text: 'One rented computer is called an instance', figure: <InstanceBox light="on" /> },
      ]} />
    ),
  },

  /* ═══ CONCEPT 3 · Regions and Networks (divider + 10) ══════════════ */
  { id: 'c3-divider', section: C3, label: '03', element: <SectionBreakerSlide index={3} title={C3} lesson={SESSION} /> },
  {
    id: 'c3-what-region-is', section: C3, label: 'What a Region is',
    element: (
      <ContentSlide kicker={C3} title="What a Region Is" lead="A Region is a city with AWS Data Centres in it" lesson={SESSION} points={[
        { text: 'Everything you create lives in one Region. An instance in Mumbai is not visible from Singapore', icon: 'globe' },
        { text: 'The console shows one Region at a time. Its name is at the top right', icon: 'eye' },
        { text: 'Prices differ a little between Regions', icon: 'info' },
      ]}>
        <PlaceLadder state="region" />
      </ContentSlide>
    ),
    notes: 'One new word: Region. The ladder names two more words that are coming, a building and a floor, so when they arrive they land on a rung that already exists.',
  },
  {
    id: 'c3-pick-nearest', section: C3, label: 'Pick the nearest',
    element: (
      <ContentSlide kicker={C3} title="Pick the Nearest" lead="Every dot is a Region. Mumbai, ap-south-1, is the nearest to us. Nearer means faster for your users" lesson={SESSION}>
        <div className="grid grid-cols-[770px_1fr] items-center gap-6">
          <Scaled w={1100} h={410} scale={0.7}>
            <RegionMap state="world" />
          </Scaled>
          <PendingShot
            of="The Region selector, opened"
            at="Console → top right → Region"
            shows="The list of Regions with Asia Pacific (Mumbai) ap-south-1 highlighted, and Asia Pacific (Hyderabad) ap-south-2 below it"
          />
        </div>
      </ContentSlide>
    ),
    notes: 'CAPTURE pending: Console → top right → Region selector, dropdown open, with Asia Pacific (Mumbai) ap-south-1 visible. Hyderabad, ap-south-2, is the second Indian Region. Everyone sets Mumbai now.',
  },
  {
    id: 'c3-availability-zones', section: C3, label: 'Availability Zones',
    element: (
      <ContentSlide kicker={C3} title="Availability Zones" lead="One Region is three separate buildings in one city. If one loses power the others do not. An instance sits in one of them" lesson={SESSION}>
        <div className="grid grid-cols-[800px_1fr] items-center gap-6">
          <Scaled w={1100} h={410} scale={0.72}>
            <RegionMap state="zones" />
          </Scaled>
          <PlaceLadder state="zone" size="sm" />
        </div>
      </ContentSlide>
    ),
    notes: 'One new phrase: Availability Zone. AWS\'s own sentence: a Region is a city and an Availability Zone is a building in it. Mumbai has ap-south-1a, 1b and 1c.',
  },
  {
    id: 'c3-vpc', section: C3, label: 'VPC',
    element: (
      <ContentSlide kicker={C3} title="VPC" lead="A VPC is a Virtual Private Cloud, your own private network inside AWS. Every account gets one. Your instances talk to each other on it and nobody else is on it" lesson={SESSION}>
        <CloudPicture state={3} />
      </ContentSlide>
    ),
    notes: 'One new word: VPC, expanded once here. The room knows this shape: it is what Compose gave your containers, a private network only they were on. The private network traces around the instance and a second instance joins it.',
  },
  {
    id: 'c3-default-vpc', section: C3, label: 'The default VPC',
    element: (
      <ContentSlide kicker={C3} title="The Default VPC" lead="The console already made you one VPC. Its address range is 172.31.0.0/16, about 65,000 private addresses reserved for you" lesson={SESSION}>
        <PendingShot
          of="The VPC console, Your VPCs, with the one default VPC"
          at="Console → search VPC → VPC → Your VPCs"
          shows={<>One row. Name empty, Default VPC <code>Yes</code>, IPv4 CIDR <code>172.31.0.0/16</code>. The highlight goes on the CIDR cell</>}
        />
      </ContentSlide>
    ),
    notes: 'CAPTURE pending: VPC → Your VPCs, the default VPC row, highlight on the CIDR cell 172.31.0.0/16. Read the range in plain words: the first two numbers are fixed, the last two can be anything, that is 256 times 256 addresses.',
  },
  {
    id: 'c3-subnets', section: C3, label: 'Subnets',
    element: (
      <ContentSlide kicker={C3} title="Subnets" lead="A subnet is a slice of the VPC placed in one building. The instance sits in one subnet, with a private address inside and a public address outside" lesson={SESSION}>
        <CloudPicture state={4} />
      </ContentSlide>
    ),
    notes: 'One new word: subnet. The VPC splits into three subnets, one per building. A public subnet can be reached from the internet, a private one cannot. Ours is public.',
  },
  {
    id: 'c3-subnets-console', section: C3, label: 'Subnets, in the console',
    element: (
      <ContentSlide kicker={C3} title="Subnets" lead="The console shows three default subnets, one for each Availability Zone" lesson={SESSION}>
        <div className="grid grid-cols-[1fr_300px] items-center gap-10">
          <PendingShot
            of="The VPC console, Subnets, with three default subnets"
            at="Console → VPC → Subnets"
            shows={<>Three rows, Availability Zone column reading <code>ap-south-1a</code>, <code>ap-south-1b</code>, <code>ap-south-1c</code>, each with its own IPv4 CIDR</>}
          />
          <PlaceLadder state="subnet" size="sm" />
        </div>
      </ContentSlide>
    ),
    notes: 'CAPTURE pending: VPC → Subnets, three default subnets with their Availability Zones. The ladder completes the chain the room has climbed since What a Region Is: city, building, floor.',
  },
  {
    id: 'c3-two-addresses', section: C3, label: 'Two addresses',
    element: (
      <ContentSlide kicker={C3} title="Two Addresses" lead="An instance has two addresses. One for the internet, one for inside the VPC" lesson={SESSION}>
        <DataTable columns={[{ label: '' }, { label: 'Public IPv4' }, { label: 'Private IPv4' }]} rows={[
          ['Example', <code key="a">13.235.67.89</code>, <code key="b">172.31.8.142</code>],
          ['Who uses it', 'Your users, and you over SSH', 'Other instances in the same VPC'],
          ['Where it works', 'From anywhere on the internet', 'Only inside the VPC'],
          ['When it changes', 'Every time the instance is stopped and started', 'Never, while the instance exists'],
        ]} />
      </ContentSlide>
    ),
    notes: 'The picture on the last two slides already wrote both addresses on the instance. This table is the readout. The public one changing on stop and start is why Elastic IPs exist, and why they cost money when idle, which comes in Billing.',
  },
  {
    id: 'c3-door-list', section: C3, label: 'The door list',
    element: (
      <ContentSlide kicker={C3} title="The Door List" lead="A Security Group sits in front of the instance and lists which ports may be reached, and by whom. Every port is closed unless it is listed" lesson={SESSION}>
        <CloudPicture state={5} />
      </ContentSlide>
    ),
    notes: 'One new phrase: Security Group. Port 22 for you, port 8000 for everyone. Writing the rules is a whole later session. Today only its place in the picture.',
  },
  {
    id: 'c3-recap', section: C3, label: 'Networks in one line',
    element: (
      <IllustratedRecap kicker={C3} title="Networks in One Line" lesson={SESSION} lines={[
        { text: 'A Region is a city, and an Availability Zone is a building in it', figure: <LadderAll /> },
        { text: 'A VPC is your own private network, and a subnet is a slice of it in one building', figure: <VpcFrame /> },
        { text: 'An instance has a private address inside and a public one outside', figure: <TwoAddresses /> },
      ]} />
    ),
  },

  /* ═══ CONCEPT 4 · Billing (divider + 8) ═════════════════════════════ */
  { id: 'c4-divider', section: C4, label: '04', element: <SectionBreakerSlide index={4} title={C4} lesson={SESSION} /> },
  {
    id: 'c4-free-plan', section: C4, label: 'The Free plan',
    element: (
      <ContentSlide kicker={C4} title="The Free Plan" lead={`The Free plan gives you ${CREDIT_USD} of credit and cannot charge your card`} lesson={SESSION}>
        <div className="grid grid-cols-[1.4fr_1fr] items-center gap-10">
          <DataTable compact columns={[{ label: 'The Free plan' }, { label: 'What it means for you' }]} rows={[
            [`${CREDIT_USD} credit on sign-up, up to USD 200`, 'More than this course uses'],
            ['No charge unless you click Upgrade', 'Your card is never billed on the Free plan'],
            ['Card kept for identity only', 'Up to USD 1 may be held and returned'],
            ['The account closes at 6 months', 'Finish the deploying sessions inside that'],
          ]} />
          <StatTile value={CREDIT_USD} label={`about ${CREDIT_INR} of credit, on sign-up`} />
        </div>
      </ContentSlide>
    ),
    notes: 'From session 8 plan §4.2b and aws.amazon.com/free, checked 2026-09-15. The rupee figure is at 95.9 to the dollar on that date.',
  },
  {
    id: 'c4-what-costs', section: C4, label: 'What costs money',
    element: (
      <ContentSlide kicker={C4} title="What Costs Money" lead="Four meters run on AWS. Mumbai prices, checked 15 September 2026" lesson={SESSION}>
        <CardGrid cols={4}>
          <Card title="A running instance"><Meter state="running" unit="per hour" size="sm" /><p className="mt-2 text-body-sm">USD 0.0112 per hour for a t3.micro</p></Card>
          <Card title="A disk"><Meter state="running" unit="per GB per month" size="sm" /><p className="mt-2 text-body-sm">USD 0.0912 per GB per month, gp3</p></Card>
          <Card title="An idle Elastic IP"><Meter state="idleBilled" unit="per hour while idle" size="sm" /><p className="mt-2 text-body-sm">USD 0.005 per hour when not attached, about USD 3.65 a month</p></Card>
          <Card title="Data leaving AWS"><Meter state="running" unit="per GB out" size="sm" /><p className="mt-2 text-body-sm">USD 0.1093 per GB after the first 100 GB a month, which is free</p></Card>
        </CardGrid>
      </ContentSlide>
    ),
    notes: 'One new phrase: Elastic IP, a public address you keep. The third meter has its bulb off and its digits still moving: it charges with the light off. Prices from the EC2 and EBS pricing pages, Region Asia Pacific (Mumbai).',
  },
  {
    id: 'c4-what-is-free', section: C4, label: 'What is free',
    element: (
      <StatusPointsSlide kicker={C4} title="What Is Free" lead="Most of what is named above costs nothing. One thing does" lesson={SESSION} items={[
        { status: 'success', text: 'A stopped instance uses no CPU', detail: 'Stopped means no hourly charge', label: 'Free' },
        { status: 'success', text: 'Data coming in', detail: 'Uploads to your instance are never billed', label: 'Free' },
        { status: 'success', text: 'The VPC, subnets and Security Groups', detail: 'The network itself has no price', label: 'Free' },
        { status: 'error', text: 'The disk of a stopped instance', detail: 'Stopped is not deleted. The disk stays, and so does its meter', label: 'Billed' },
      ]}>
        <Meter state="idleBilled" unit="per GB per month" label="the disk of a stopped instance" size="md" />
      </StatusPointsSlide>
    ),
    notes: 'This is why the next session ends with Stop, and a check of the disk, not with closing the tab. The meter beside the list is the one from Pay for Use with its light off and its digits still ticking.',
  },
  {
    id: 'c4-billing-page', section: C4, label: 'The Billing page',
    element: (
      <ContentSlide kicker={C4} title="The Billing Page" lead="Your bill is zero, and the credit is listed on the same page" lesson={SESSION}>
        <PendingShot
          of="Billing and Cost Management home, showing a zero bill and the credits line"
          at={`${ACCOUNT_SHOWS} → Billing and Cost Management`}
          shows="The month-to-date total reading USD 0.00 and the Free plan credits panel. The highlight goes on the USD 0.00 total"
        />
      </ContentSlide>
    ),
    notes: 'CAPTURE pending: Console → account name → Billing and Cost Management, home with USD 0.00 and the credits line. Rule 30: the bill with a zero on it, as a real screen, never a drawing.',
  },
  {
    id: 'c4-credits-page', section: C4, label: 'Free plan credits',
    element: (
      <ContentSlide kicker={C4} title="Free Plan Credits" lead={`The Credits page lists the ${CREDIT_USD} and the date it expires`} lesson={SESSION}>
        <PendingShot
          of="The Credits page in Billing"
          at="Billing and Cost Management → left menu → Credits"
          shows={`One row: the Free plan credit, amount remaining ${CREDIT_USD}, expiry date six months after sign-up`}
        />
      </ContentSlide>
    ),
    notes: 'CAPTURE pending: Billing → Credits, the row with USD 100.00 remaining. Cropped to the credits table, no highlight.',
  },
  {
    id: 'c4-budget-alert', section: C4, label: 'A budget alert',
    element: (
      <ContentSlide kicker={C4} title="A Budget Alert" lead="Three clicks make AWS email you at the first cent" lesson={SESSION}>
        <div className="grid grid-cols-[1.2fr_1fr] items-center gap-10">
          <PendingShot
            of="Create budget, with the Zero spend budget template selected"
            at="Billing and Cost Management → Budgets → Create budget"
            shows="Use a template (simplified) selected, Zero spend budget chosen, a budget name and an email recipient field"
          />
          <div>
            <StepList steps={[
              { title: 'Billing → Budgets → Create budget', detail: 'Leave Use a template selected' },
              { title: 'Use a template → Zero spend budget', detail: 'It alerts when spend passes USD 0.01' },
              { title: 'Email recipient → Create budget', detail: 'You will see the budget listed with USD 0.00 spent' },
            ]} />
          </div>
        </div>
      </ContentSlide>
    ),
    notes: 'CAPTURE pending: Billing and Cost Management → Budgets → Create budget with the Zero spend budget template selected. Do this together; it is the one thing the room creates today. The meter with the bell is on the Billing recap.',
  },
  {
    id: 'c4-never-upgrade', section: C4, label: 'Never upgrade',
    element: (
      <ContentSlide kicker={C4} title="Never Upgrade" lead="The only click that can cost money is Upgrade. Do not press it during this course" lesson={SESSION}>
        <AnnotatedShot
          src="/shots/aws-complete-account-setup.png"
          alt="The Complete your account setup page, whose bottom section, Free account plan access limitations, ends in an Upgrade plan button"
          highlights={[{ ...SETUP_UPGRADE_BUTTON, step: 1, label: 'Never this one', labelAt: 'right' }]}
          spotlight
          inset="auto"
          frameWidth={760}
          mark={AWS_MARK}
          caption="The Upgrade plan button on the account setup page. Under Billing → Free plan status it is called Upgrade to Paid plan. Leave both alone"
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: 'Real capture. The Billing page has the same button under the Free plan status panel, labelled Upgrade to Paid plan; capture it too when the account is active and prefer it here. Nothing else in the console can bill a Free plan account.',
  },
  {
    id: 'c4-recap', section: C4, label: 'Billing in one line',
    element: (
      <IllustratedRecap kicker={C4} title="Billing in One Line" lesson={SESSION} lines={[
        { text: `The Free plan gives you ${CREDIT_USD} and cannot charge your card`, figure: <CreditCard amount={CREDIT_USD} /> },
        { text: 'You pay for a running instance and its disk, not for the network', figure: <PaidThings /> },
        { text: 'A budget alert emails you before anything surprises you', figure: <MeterAlert /> },
      ]} />
    ),
  },

  /* ═══ CLOSING ═══════════════════════════════════════════════════════ */
  {
    id: 'key-takeaways', section: 'Closing', label: 'Key takeaways',
    element: <KeyTakeawaysSlide title={SESSION} lesson={SESSION} points={[C1, C2, C3, C4]} />,
    notes: 'Rule 20: the four agenda names, word for word, in a different UI than the agenda.',
  },
  {
    id: 'practice', section: 'Closing', label: 'Practice',
    element: (
      <PracticeSlide lesson={SESSION} title="Find your way around" prompt="Open your AWS console and find five things. Nothing is launched." tasks={[
        'Console → top right → Asia Pacific (Mumbai)',
        'Console → search box → EC2, then VPC, then Billing',
        'Billing and Cost Management → Credits, and the USD 0.00 bill',
        'Billing → Budgets → Create budget → Zero spend budget',
        'Send one screenshot of the budget in the group',
      ]} />
    ),
  },
  {
    id: 'what-comes-next', section: 'Closing', label: 'What comes next',
    element: (
      <ContentSlide kicker="What Comes Next" title="What Comes Next" lead="The next session launches the first instance in Mumbai and runs the two images on it. This is the picture that comes alive" lesson={SESSION}>
        <CloudPicture state={2} revealFrom={6} />
      </ContentSlide>
    ),
    notes: 'The same drawing as EC2 Rents a Computer, held still. Next session: launch a t3.micro from Ubuntu Server 24.04 in Mumbai, download the key pair, log in over SSH, install Docker, pull the two images.',
  },
  {
    id: 'feedback', section: 'Closing', label: 'Feedback',
    element: <FeedbackSlide lesson={SESSION} title="How did this session land?" prompt="Two minutes of feedback helps us make the next session sharper." />,
  },
  { id: 'thank-you', section: 'Closing', label: 'Thank you', element: <ThankYouSlide lesson={SESSION} /> },
]
