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
import { LaunchForm } from './figures/LaunchForm'
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
import { ShellPanel } from './figures/ShellPanel'
import { TwoDoors } from './figures/TwoDoors'
import {
  ACCOUNT_KICKER, AMI_ID, AMI_NAME, ANYWHERE_CIDR, AWS_MARK, C1, C2, C3, C4, COURSE,
  CREDIT_INR, CREDIT_USD, DISK_SIZE, DISK_TYPE,
  EC2_AMI_ROW, EC2_CONNECT_BUTTON, EC2_CONNECT_TABS, EC2_CONNECT_USERNAME,
  EC2_DETAIL_DNS, EC2_DETAIL_PRIVATE, EC2_DETAIL_PUBLIC, EC2_KEY_CREATE,
  EC2_KEY_NAME_FIELD, EC2_KEY_PEM, EC2_KEY_SELECTED, EC2_LAUNCH_BUTTON,
  EC2_MENU_INSTANCES, EC2_MENU_STOP, EC2_MENU_TERMINATE, EC2_NAME_FIELD,
  EC2_NET_PUBLIC_IP, EC2_NET_SUBNET, EC2_NET_VPC, EC2_REFUSED, EC2_REGION,
  EC2_RESTART_PRIVATE, EC2_RESTART_ROW_IP, EC2_ROW_ID, EC2_ROW_NO_ADDRESS,
  EC2_ROW_PUBLIC_IP, EC2_ROW_STATE, EC2_SG_NAME, EC2_SG_RULE_APP, EC2_SG_RULE_SSH,
  EC2_SSH_COMMAND, EC2_SSH_DNS, EC2_SSH_TAB, EC2_STOP_BUTTON, EC2_STOP_WARNING,
  EC2_SUCCESS, EC2_TYPE_BOX, EC2_UBUNTU_TILE,
  EC2_ADD_RULE, EC2_NEW_RULE, EC2_SAVE_RULES, EC2_RULES_COUNT, EC2_RULES_TABLE,
  EC2_WELCOME, EC2_ENS5, EC2_BROWSER_IPS, EC2_BROWSER_CMDS,
  BILL_DATA_UNAVAILABLE, BILL_FREE_PANEL, BILL_NAME_EMAIL, BILL_TEMPLATE, BILL_ZERO_SPEND,
  CONNECT_CIDR, GLOBAL_SENTENCE, PUBLIC_IP_FINAL,
  EC2_ROOT_DEVICE, EC2_STORAGE_TAB, EC2_STOPPED_PRIVATE, EC2_STOPPED_PUBLIC,
  HOME_REGION, HOME_SEARCH, HOSTNAME, INSTANCE_ID, INSTANCE_NAME, INSTANCE_PRICE,
  INSTANCE_TYPE, KEY_FILE, KEY_NAME, MarkRow, MY_IP_CIDR,
  PORT_APP, PORT_DB, PORT_SSH, PRIVATE_IP, PUBLIC_DNS, PUBLIC_IP, PUBLIC_IP_RESTARTED,
  REGION_CODE, REGION_NAME, Scaled, SEARCH_BOX, SEARCH_EC2_ROW, SEARCH_SERVICES_TAB,
  SESSION, SETUP_COMPLETE_BUTTON, SETUP_UPGRADE_BUTTON, SG_NAME, SIGNIN_EMAIL,
  SIGNIN_ROOT_USER, SSH_USER, SUBNET_ID, VPC_CIDR, VPC_ID, ZONE, ZONES,
} from './deckShared'

/**
 * DEPLOYMENT SESSION 9 — "Introduction to AWS", plan rev2
 *
 * Plan: `../../session_plans/deployement_session_9/plan.md`, signed off
 * 2026-09-15, revised 2026-09-16 (plan §revision 3). Figures:
 * `illustrations.md` beside it. 93 slides.
 *
 * THE SESSION LAUNCHES AN EC2 INSTANCE. The user reversed plan decision D1
 * ("nothing is launched") on 2026-09-16: "Also include hands-on on creation of
 * EC2 in the process. Explain each concept instead of explaining randomly."
 *
 * So concept 3 is no longer "Regions and Networks", a tour of console pages.
 * It is `Launching an Instance`, and its spine is the launch form itself, one
 * field per slide, with each field's concept taught at the field that uses it:
 * Region and Availability Zone before the form is opened, then the AMI at
 * Application and OS Images, the sizes at Instance type, the key pair at Key
 * pair (login), the VPC, subnet, public IP and Security Group inside Network
 * settings, the disk at Configure storage, then Summary, the running instance,
 * its two addresses, and Stop versus Terminate. Concept 2 ends by NAMING those
 * six sections and opening none of them (hard rule 4): the `LaunchForm` panel.
 *
 * SIX THINGS AN EDIT HERE IS MOST LIKELY TO BREAK
 *
 *   1. Plan §2, beginner rule 1 and 2. One new word per slide, and its acronym
 *      is expanded once, in the lead, on the slide that owns it. AWS on What
 *      AWS Is, EC2 on EC2 Rents a Computer, AMI on Application and OS Image,
 *      VPC on VPC. Moving a slide between concepts moves the expansion with it.
 *
 *   2. Rule 29. A title is the topic. A lead states the fact and never ends in
 *      a remark about it. Every title below is the plan's title, verbatim.
 *
 *   3. Rule 30. Every console walk-through carries a real capture, and as of
 *      2026-09-16 EVERY ONE OF THEM IS REAL. The account was activated, the
 *      whole launch was performed on it, and the deck runs on the uncropped
 *      captures in `public/shots/`: `ec2-01` to `ec2-24`, `bill-01`,
 *      `bill-02`, `aws-signin-root` and `aws-global-infrastructure`. The
 *      `PendingShot` stand-in has been deleted from `deckShared.tsx`; there is
 *      nothing to reach for if a screen is missing, which is the point.
 *
 *      Every name, port and address on those captures is declared once in
 *      `deckShared.tsx` and read from there by every slide and every figure,
 *      so the deck cannot drift from the screenshots. The two IP addresses are
 *      what AWS assigned on the day, and every slide that prints one says AWS
 *      assigns it and a student's own will differ.
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
        { status: 'error', text: 'Nothing runs the images yet', detail: 'They sit on Docker Hub. Today we launch the computer that will run them' },
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
        { text: 'One t3.micro instance runs for part of the session. It costs a few cents, taken from your credit', icon: 'shield' },
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
        <AnnotatedShot
          src="/shots/aws-signin-root.png"
          alt="The AWS Sign In page: a User type chooser with Root user selected and IAM user below it, an empty Email address field, and the Next button"
          highlights={[
            { ...SIGNIN_ROOT_USER, step: 1, label: 'Root user', labelAt: 'left' },
            { ...SIGNIN_EMAIL, step: 2, label: 'Your email', labelAt: 'left' },
          ]}
          spotlight
          inset="auto"
          frameWidth={840}
          mark={AWS_MARK}
          caption="signin.aws.amazon.com → User type → Root user → your email → Next"
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: `Real capture, taken with the email field empty. Root user is the account owner, the one the room created; IAM user is for teams and is not used in this course. After Next comes the password, then the console home. Then say: Console → top right. It should read ${REGION_NAME}. If it does not, the first slides of concept 3 fix it.`,
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
    notes: `These two panels are the only places the Free plan credit is shown: Billing → Credits lists redeemable credits and reads USD 0.00 on a Free plan account, so this deck does not send the room there. Two places show the same number, so nobody has to hunt. The days remaining count down from 182 whether or not anything runs. ${CREDIT_USD} is about ${CREDIT_INR}.`,
  },
  {
    id: 'account-budget-alert', section: ACCOUNT_KICKER, label: 'A budget alert',
    element: (
      <ContentSlide kicker={ACCOUNT_KICKER} title="A Budget Alert" lead="Nothing is running yet, so set the alarm first. It emails you at the first cent" lesson={SESSION}>
        <div className="grid grid-cols-[1fr] items-center gap-10">
          <AnnotatedShot
            src="/shots/bill-02-zero-spend-template.png"
            alt="The Create budget page with Use a template (simplified) selected, the Zero spend budget template chosen, and the Budget name and Email recipients fields below it"
            highlights={[
              { ...BILL_TEMPLATE, step: 1, label: 'Use a template', labelAt: 'right' },
              { ...BILL_ZERO_SPEND, step: 2, label: 'Zero spend budget', labelAt: 'right' },
              { ...BILL_NAME_EMAIL, step: 3, label: 'Name and email', labelAt: 'right', badgeAt: 'bottom-left' },
            ]}
            spotlight
              frameWidth={760}
            mark={AWS_MARK}
            caption="Billing and Cost Management → Budgets → Create budget. 1 template, 2 Zero spend, 3 your email"
            className="mx-auto w-fit"
          />
        </div>
      </ContentSlide>
    ),
    notes: 'A budget does not stop spending: it emails you. USD 0.01 is the point, because it means the first cent rather than the first large bill. Do this together, before anything can run. It is the first thing the room creates, and the meter with the bell is on the Billing recap.',
  },
  {
    id: 'agenda', section: 'Opening', label: 'Agenda',
    element: (
      <AgendaSlide kicker={SESSION} title="Agenda" lesson={SESSION} items={[
        { title: C1, sub: 'What the cloud is, and why your laptop cannot do the job' },
        { title: C2, sub: 'What Amazon rents out, and the service that rents a computer' },
        { title: C3, sub: 'The six answers the launch form asks for, and the instance it creates' },
        { title: C4, sub: 'Where the money goes, and how to make sure it is zero' },
      ]} />
    ),
  },
  {
    id: 'one-question', section: 'Opening', label: 'One question',
    element: <QuestionSlide kicker="A question first" question="If a website is not running on your laptop, where is it running?" lesson={SESSION} />,
    notes: 'Take three answers. "A server", "the cloud", "Google" are all fine. The next concept turns the answers into words the room can use.',
  },

  /* ═══ CONCEPT 1 · Cloud Basics (divider + 9) ════════════════════════ */
  { id: 'c1-divider', section: C1, label: '01', element: <SectionBreakerSlide index={1} title={C1} lesson={SESSION} /> },
  {
    id: 'c1-what-cloud-gives', section: C1, label: 'What the cloud gives you',
    element: (
      <ContentSlide kicker={C1} title="What the Cloud Gives You" lead="The cloud gives you a computer that is always on. It is a real computer in a building full of computers. You reach it over the internet, and you pay for the hours you use" lesson={SESSION}>
        <CloudPicture state={0} />
      </ContentSlide>
    ),
    notes: 'Answers the question on the last slide. Point at the three parts of the picture as you say the three sentences: you, the line, the building. The words Data Centre and server are not used yet: both are taught in the next few slides, and this lead used to borrow them.',
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
      <ContentSlide kicker={C1} title="A Data Centre" lead="AWS has data centres in different parts of the world. 124 Availability Zones in 39 Regions" lesson={SESSION}>
        <AnnotatedShot
          src="/shots/aws-global-infrastructure.png"
          alt="The AWS Global Infrastructure page: the sentence about 124 Availability Zones within 39 Geographic Regions, the region tabs with Asia Pacific selected, and a globe with a dot on each Region"
          highlights={[{ ...GLOBAL_SENTENCE, step: 1, label: 'AWS counting its own', labelAt: 'below' }]}
          spotlight
          frameWidth={840}
          mark={AWS_MARK}
          caption="aws.amazon.com/about-aws/global-infrastructure, read 16 September 2026. Every dot on the globe is a Region"
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: 'The drawing on the last two slides was the idea; this page is AWS counting the real buildings. Read the sentence aloud, then point at the globe: every dot is a Region, and the room picks one of those dots in concept 3. The numbers move, so re-read the page if this deck is regenerated.',
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

  /* ═══ CONCEPT 2 · AWS and EC2 (divider + 11) ════════════════════════ */
  { id: 'c2-divider', section: C2, label: '02', element: <SectionBreakerSlide index={2} title={C2} lesson={SESSION} /> },
  {
    id: 'c2-what-you-know', section: C2, label: 'What you know',
    element: <QuestionSlide kicker="Before we define it" question="What do you already know about AWS?" lesson={SESSION} />,
    notes: 'Take two or three answers aloud. Most rooms say Amazon, shopping, delivery. That answer is the setup for the next slide: they are not wrong, they have only used one door.',
  },
  {
    id: 'c2-not-the-app', section: C2, label: 'Not the app',
    element: (
      <ContentSlide kicker={C2} title="Not the App" lead="The Amazon e-commerce app and AWS are one company with two doors. You have used one of them" lesson={SESSION}>
        <div className="grid grid-cols-[460px_1fr] items-center gap-10">
          <TwoDoors doors={[{ sign: 'amazon.in', mark: '/assets/companies/amazon.png', step: 'app' }, { sign: 'AWS', mark: '/assets/tech/aws.png', step: 'server' }]} />
          <div>
            <DataTable compact columns={[{ label: '' }, { label: 'amazon.in' }, { label: 'AWS' }]} rows={[
              ['What it is', 'The e-commerce app you shop on', 'Amazon Web Services'],
              ['What it sells', 'Things, delivered to your door', 'Computers, rented by the hour'],
              ['Who buys', 'You', 'Companies that run websites'],
              ['Since', 'The part you have used', '2006'],
            ]} />
            <p className="mt-3 text-body-sm text-body">
              In 2025 AWS was about 18 percent of Amazon's sales and about 57 percent of its operating profit.{' '}
              {/* A source printed on a slide carries its link, so the exported HTML is clickable (user, 2026-09-16). */}
              <a
                href="https://ir.aboutamazon.com/news-release/news-release-details/2026/Amazon-com-Announces-Fourth-Quarter-Results/default.aspx"
                target="_blank"
                rel="noreferrer"
                className="text-brand underline underline-offset-2"
              >
                Source: Amazon Q4 2025 results release
              </a>
            </p>
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
    notes: 'On an account that is not yet active this opens the Complete your account setup page from the account block. On an active account it opens the EC2 dashboard, which is where the next concept starts.',
  },
  {
    id: 'c2-ec2-rents', section: C2, label: 'EC2 rents a computer',
    element: (
      <ContentSlide kicker={C2} title="EC2 Rents a Computer" lead="EC2 (Elastic Compute Cloud) is an AWS service that provides virtual computers (servers) in the cloud. These servers run in AWS data centres and can run applications such as your backend and frontend containers" lesson={SESSION}>
        <CloudPicture state={2} />
      </ContentSlide>
    ),
    notes: 'One new word: EC2, expanded once here. The building draws itself around the server, then the layers inside: Docker Engine and the two containers. Elastic means it can change size.',
  },
  {
    id: 'c2-instance', section: C2, label: 'Instance',
    element: (
      <ContentSlide kicker={C2} title="Instance" lead="An instance is a computer that you rent from AWS. EC2 instance = a rented computer in the cloud" lesson={SESSION} points={[
        { text: 'It has a public IP address so the internet can reach it', icon: 'globe' },
        { text: 'It keeps running until you stop it', icon: 'bolt' },
        { text: 'You can connect to it from your laptop using SSH and a key file', icon: 'key' },
      ]}>
        <MachineCard />
      </ContentSlide>
    ),
    notes: 'One new word: instance. It is the same box the room met on What a Server Is. Three facts pinned to three places on it, in bullet order.',
  },
  {
    id: 'c2-six-decisions', section: C2, label: 'Six decisions',
    element: (
      <ContentSlide kicker={C2} title="Six Decisions" lead="EC2 → Instances → Launch instance opens one form. The form asks for six things" lesson={SESSION}>
        <LaunchForm />
      </ContentSlide>
    ),
    notes: 'Read the six rows aloud in order and stop there. Rule 4: this slide names what is coming, it does not open it. Each row is a slide in the next concept, in this order.',
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

  /* ═══ CONCEPT 3 · Launching an Instance (divider + 41) ═════════════ */
  { id: 'c3-divider', section: C3, label: '03', element: <SectionBreakerSlide index={3} title={C3} lesson={SESSION} /> },
  {
    id: 'c3-which-city', section: C3, label: 'Which city',
    element: <QuestionSlide kicker="A question first" question="Your computer has to be created in one city. Which city should it be?" lesson={SESSION} />,
    notes: 'Take two or three answers. Mumbai, Hyderabad, America and "does it matter" are all useful. The next slide answers it, and the answer is the first thing the launch form depends on.',
  },
  {
    id: 'c3-what-region-is', section: C3, label: 'What a Region is',
    element: (
      <ContentSlide kicker={C3} title="What a Region Is" lead="A Region is a city with AWS Data Centres in it. The instance is created in the Region shown at the top right of the console" lesson={SESSION} points={[
        { text: 'Everything you create lives in one Region. An instance in Mumbai is not visible from Singapore', icon: 'globe' },
        { text: 'The console shows one Region at a time. Its name is at the top right', icon: 'eye' },
        { text: 'Set the Region before you open the launch form', icon: 'target' },
      ]}>
        <PlaceLadder state="region" />
      </ContentSlide>
    ),
    notes: 'One new word: Region. The ladder names two more words that are coming, a building and a floor, so when they arrive they land on a rung that already exists.',
  },
  {
    id: 'c3-pick-nearest', section: C3, label: 'Pick the nearest',
    element: (
      <ContentSlide kicker={C3} title="Pick the Nearest" lead={`Every dot is a Region. Mumbai, ${REGION_CODE}, is the nearest to us. Nearer means faster for your users`} lesson={SESSION}>
        <Scaled w={1100} h={410} scale={0.78}>
          <RegionMap state="world" />
        </Scaled>
      </ContentSlide>
    ),
    notes: `Hyderabad, ap-south-2, is the second Indian Region. Check the top right of your own console now: it must read ${REGION_NAME}. The next capture shows where that name sits.`,
  },
  {
    id: 'c3-availability-zones', section: C3, label: 'Availability Zones',
    element: (
      <ContentSlide kicker={C3} title="Availability Zones" lead="One Region is three separate buildings in one city. If one loses power the others do not. The instance sits in one of them" lesson={SESSION}>
        <div className="grid grid-cols-[800px_1fr] items-center gap-6">
          <Scaled w={1100} h={410} scale={0.72}>
            <RegionMap state="zones" />
          </Scaled>
          <PlaceLadder state="zone" size="sm" />
        </div>
      </ContentSlide>
    ),
    notes: `One new phrase: Availability Zone. AWS's own sentence: a Region is a city and an Availability Zone is a building in it. Mumbai has ${ZONES.join(', ')}. The form does not ask you to choose one, and ours landed in ${ZONE}.`,
  },
  {
    id: 'c3-region-is-for', section: C3, label: 'Who the Region is for',
    element: (
      <ContentSlide
        kicker={C3}
        title="Who the Region Is For"
        lead="The Region decides where the computer sits. It does not decide who can reach it"
        lesson={SESSION}
        points={[
          { text: 'Your app sits on the public internet. Anyone, anywhere, can open it', icon: 'globe' },
          { text: 'Distance costs time. A request from Mumbai arrives quickly. The same request from London travels much further', icon: 'info' },
          { text: 'So pick the Region nearest the people who use the app, not the one nearest you', icon: 'target' },
        ]}
      >
        <Scaled w={1100} h={410} scale={0.42}>
          <RegionMap state="world" />
        </Scaled>
      </ContentSlide>
    ),
    notes: 'Two questions the room always asks here, and this slide exists for both. A Mumbai Region does not mean only India can use the app: the address is public. And the Region is chosen for the users, not for the developer. No millisecond figures on the slide because none have been measured; say near is faster and leave it there. The next session puts a fixed address and then a domain name in front of this.',
  },
  {
    id: 'c3-launch-instance', section: C3, label: 'Launch instance',
    element: (
      <ContentSlide kicker={C3} title="Launch Instance" lead="EC2 → Instances → Launch instances opens the form. The list is empty until it is filled in" lesson={SESSION}>
        <AnnotatedShot
          src="/shots/ec2-01-instances-empty.png"
          alt="The EC2 Instances page with no instances, the left menu with Instances selected, the Region name Asia Pacific (Mumbai) at the top right and the orange Launch instances button"
          highlights={[
            { ...EC2_MENU_INSTANCES, step: 1, label: 'Instances', labelAt: 'right' },
            { ...EC2_REGION, step: 2, label: 'The Region', labelAt: 'left' },
            { ...EC2_LAUNCH_BUTTON, step: 3, label: 'Launch instances', labelAt: 'below', badgeAt: 'bottom-left' },
          ]}
          spotlight
          frameWidth={840}
          mark={AWS_MARK}
          caption={`EC2 → Instances. 1 the left menu, 2 the Region, which must read ${REGION_NAME}, 3 Launch instances`}
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: 'Real capture from the launch this deck records. Check the Region at the top right before clicking, and say so aloud: the instance is created in the Region that name shows.',
  },
  {
    id: 'c3-name-and-tags', section: C3, label: 'Name and tags',
    element: (
      <ContentSlide kicker={C3} title="Name and Tags" lead={`Field 1 is the name. Type ${INSTANCE_NAME}. It is a label for you, and nothing depends on it`} lesson={SESSION}>
        <AnnotatedShot
          src="/shots/ec2-02-name.png"
          alt="The Launch an instance form, Name and tags section, with nxttrendz-server typed into the Name field, and the Summary panel on the right"
          highlights={[{ ...EC2_NAME_FIELD, step: 1, label: 'Type the name', labelAt: 'below' }]}
          spotlight
          frameWidth={840}
          mark={AWS_MARK}
          caption={`EC2 → Instances → Launch instances → Name and tags. Type ${INSTANCE_NAME}`}
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: 'The name can be changed later, and two instances may share one name. The Summary panel on the right is the running total of the six answers; it is read back before the click.',
  },
  {
    id: 'c3-ami', section: C3, label: 'AMI',
    element: (
      <ContentSlide kicker={C3} title="AMI" lead="An AMI is an Amazon Machine Image, the template the computer boots from. A Docker image is to a container what an AMI is to an instance" lesson={SESSION}>
        <AnalogyMap leftLabel="Docker, which you know" rightLabel="AWS" rows={[
          { from: 'A Docker image', to: 'An AMI' },
          { from: 'A container started from it', to: 'An instance started from it' },
          { from: 'One image, many containers', to: 'One AMI, many instances' },
          { from: 'python:3.12 is an image', to: `${AMI_NAME} is our AMI` },
        ]} />
        <div className="mt-6 flex items-center justify-center gap-12 text-body-sm text-body">
          <MarkRow src="/assets/tech/docker.png" alt="Docker" size={32}>Docker image</MarkRow>
          <MarkRow src="/assets/tech/linux.png" alt="Linux" size={32}>{AMI_NAME}, a Linux AMI</MarkRow>
        </div>
      </ContentSlide>
    ),
    notes: 'One new word: AMI, expanded once here, on the slide before the field that asks for it. The room already owns the left column.',
  },
  {
    id: 'c3-os-image', section: C3, label: 'Application and OS image',
    element: (
      <ContentSlide kicker={C3} title="Application and OS Image" lead={`Field 2 asks for the AMI. Click Ubuntu, and the box below reads ${AMI_NAME}`} lesson={SESSION}>
        <AnnotatedShot
          src="/shots/ec2-03-ami-ubuntu.png"
          alt="The Application and OS Images section with the Ubuntu tile selected and the Amazon Machine Image box reading Ubuntu Server 26.04 LTS, Free tier eligible, with its AMI id and the username ubuntu below"
          highlights={[
            { ...EC2_UBUNTU_TILE, step: 1, label: 'Ubuntu', labelAt: 'left' },
            { ...EC2_AMI_ROW, step: 2, label: 'Free tier eligible', labelAt: 'below' },
          ]}
          spotlight
          frameWidth={840}
          mark={AWS_MARK}
          caption={`EC2 → Instances → Launch instances → Application and OS Images. ${AMI_NAME}, ${AMI_ID}`}
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: `Ubuntu is picked because it is the Linux the course already uses and it is Free tier eligible. Two things on this screen come back later: the AMI id ${AMI_ID}, and the username ${SSH_USER}, which is who you log in as over SSH.`,
  },
  {
    id: 'c3-t3-sizes', section: C3, label: 'The t3 sizes',
    element: (
      <ContentSlide kicker={C3} title="The t3 Sizes" lead={`For this course, ${INSTANCE_TYPE} is enough because the application does not need a large amount of CPU or memory`} lesson={SESSION}>
        <DataTable compact columns={[{ label: 'Instance Type' }, { label: 'vCPU' }, { label: 'Memory (RAM)' }, { label: 'For This Course' }]} rows={[
          [<code key="a">{INSTANCE_TYPE}</code>, '2', '1 GiB', 'Yes'],
          [<code key="b">t3.small</code>, '2', '2 GiB', 'More than needed'],
          [<code key="c">t3.medium</code>, '2', '4 GiB', 'More than needed'],
        ]} highlight={[0]} />
        <CardGrid cols={3} className="mt-5">
          <Card title="Instance type"><p className="text-body-sm">The size of the virtual computer you are renting</p></Card>
          <Card title="vCPU"><p className="text-body-sm">How much CPU processing power the instance has</p></Card>
          <Card title="Memory (RAM)"><p className="text-body-sm">Temporary working space for running applications</p></Card>
        </CardGrid>
      </ContentSlide>
    ),
    notes: `One new phrase: instance type. AWS writes GiB. ${INSTANCE_TYPE} costs ${INSTANCE_PRICE} in Mumbai, and a bigger size costs more and does nothing extra for two small containers.`,
  },
  {
    id: 'c3-instance-type', section: C3, label: 'Instance type',
    element: (
      <ContentSlide kicker={C3} title="Instance Type" lead={`Field 3 asks for the instance type. Pick ${INSTANCE_TYPE}`} lesson={SESSION}>
        <AnnotatedShot
          src="/shots/ec2-04-instance-type.png"
          alt="The Instance type section with t3.micro selected, showing family t3, 2 vCPU, 1 GiB memory and the On-Demand Linux base pricing of 0.0112 USD per hour"
          highlights={[{ ...EC2_TYPE_BOX, step: 1, label: `${INSTANCE_TYPE}, ${INSTANCE_PRICE}`, labelAt: 'below' }]}
          spotlight
          frameWidth={840}
          mark={AWS_MARK}
          caption={`EC2 → Instances → Launch instances → Instance type. ${INSTANCE_TYPE}, 2 vCPU, 1 GiB, ${INSTANCE_PRICE}`}
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: 'The price on this screen is the one the Billing concept picks up at the end of the session. Read it aloud: about one cent an hour.',
  },
  {
    id: 'c3-key-pair', section: C3, label: 'Key pair',
    element: (
      <ContentSlide kicker={C3} title="Key Pair" lead={`Field 4 is the key pair, the file that logs you in instead of a password. ${KEY_FILE} downloads once, and it cannot be downloaded again`} lesson={SESSION}>
        <LockAndKey state="apart" chip="downloads once" />
      </ContentSlide>
    ),
    notes: `One new phrase: key pair. The key is a file on your laptop, the lock is on the instance. Say it plainly: ${KEY_FILE} lands in your Downloads folder the moment you click Create key pair, AWS keeps no copy, and a lost file means a new instance.`,
  },
  {
    id: 'c3-create-key-pair', section: C3, label: 'Create key pair',
    element: (
      <ContentSlide kicker={C3} title="Create Key Pair" lead={`Name it ${KEY_NAME}, keep RSA and .pem, then Create key pair`} lesson={SESSION}>
        <AnnotatedShot
          src="/shots/ec2-05-create-key-pair.png"
          alt="The Create key pair dialog with nxttrendz-key typed in Key pair name, RSA selected, the .pem private key file format selected, and the Create key pair button"
          highlights={[
            { ...EC2_KEY_NAME_FIELD, step: 1, label: 'Type the name', labelAt: 'left' },
            { ...EC2_KEY_PEM, step: 2, label: '.pem', labelAt: 'left' },
            { ...EC2_KEY_CREATE, step: 3, label: 'Create key pair', labelAt: 'below' },
          ]}
          spotlight
          frameWidth={840}
          mark={AWS_MARK}
          caption={`EC2 → Instances → Launch instances → Key pair (login) → Create new key pair. ${KEY_FILE} downloads as you click`}
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: '.ppk is for PuTTY, which this course does not use. The yellow box on the dialog says it in AWS\'s own words: store the private key somewhere you will find it again.',
  },
  {
    id: 'c3-key-pair-selected', section: C3, label: 'Key pair selected',
    element: (
      <ContentSlide kicker={C3} title="Key Pair Selected" lead={`The form now shows ${KEY_NAME} in Key pair name. The file is on your laptop`} lesson={SESSION}>
        <AnnotatedShot
          src="/shots/ec2-06-key-pair-selected.png"
          alt="The Key pair (login) section of the launch form with nxttrendz-key chosen in the Key pair name list"
          highlights={[{ ...EC2_KEY_SELECTED, step: 1, label: KEY_NAME, labelAt: 'below' }]}
          spotlight
          frameWidth={840}
          mark={AWS_MARK}
          caption={`EC2 → Instances → Launch instances → Key pair (login). ${KEY_NAME} is selected`}
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: `Check the Downloads folder on your own laptop for ${KEY_FILE} before moving on. If it is not there, the key pair was not created, and this field will be empty.`,
  },
  {
    id: 'c3-vpc', section: C3, label: 'VPC',
    element: (
      <ContentSlide kicker={C3} title="VPC" lead="Field 5 is Network settings, and its first line is the VPC, a Virtual Private Cloud. It is your own private network inside AWS, and every account gets one" lesson={SESSION}>
        <CloudPicture state={3} />
      </ContentSlide>
    ),
    notes: 'One new word: VPC, expanded once here. The room knows this shape: it is what Compose gave your containers, a private network only they were on.',
  },
  {
    id: 'c3-default-vpc', section: C3, label: 'The default VPC',
    element: (
      <ContentSlide kicker={C3} title="The Default VPC" lead={`Your one VPC is already selected. Its address range is ${VPC_CIDR}`} lesson={SESSION}>
        <AnnotatedShot
          src="/shots/ec2-07-network-settings.png"
          alt="The Network settings section of the launch form, showing the Network vpc-0292256715a0e0ab2, the Subnet on No preference, Auto-assign public IP Enable, and the Firewall section below"
          highlights={[{ ...EC2_NET_VPC, step: 1, label: 'Your VPC', labelAt: 'right' }]}
          spotlight
          frameWidth={840}
          mark={AWS_MARK}
          caption={`EC2 → Instances → Launch instances → Network settings. Network is ${VPC_ID}, the one your account was given`}
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: `Read the range in plain words: in ${VPC_CIDR} the first two numbers are fixed and the last two can be anything, which is 256 times 256 addresses. Nothing is typed here; the field is already filled in.`,
  },
  {
    id: 'c3-subnets', section: C3, label: 'Subnets',
    element: (
      <ContentSlide kicker={C3} title="Subnets" lead="A subnet is a small network inside a VPC where EC2 instances run. The instance has a private IP inside it and can also have a public IP" lesson={SESSION}>
        <p className="mb-2 pl-8 font-mono text-body-sm text-ink-muted">VPC → Subnet → EC2 → Private IP + Public IP</p>
        <CloudPicture state={4} />
      </ContentSlide>
    ),
    notes: 'One new word: subnet. The VPC splits into three subnets, one per building. A public subnet can be reached from the internet, a private one cannot. Ours is public.',
  },
  {
    id: 'c3-three-subnets', section: C3, label: 'No preference',
    element: (
      <ContentSlide kicker={C3} title="No Preference" lead={`Leave the Subnet on No preference. AWS picks one, and ours landed in ${ZONE}`} lesson={SESSION}>
        <div className="grid grid-cols-[1fr_280px] items-center gap-8">
          <AnnotatedShot
            src="/shots/ec2-07-network-settings.png"
            alt="The Network settings section with the Subnet line reading No preference, default subnet in any availability zone"
            highlights={[{ ...EC2_NET_SUBNET, step: 1, label: 'No preference', labelAt: 'right' }]}
            spotlight
              frameWidth={760}
            mark={AWS_MARK}
            caption={`EC2 → Instances → Launch instances → Network settings → Subnet. AWS chose ${SUBNET_ID}, in ${ZONE}`}
            className="mx-auto w-fit"
          />
          <PlaceLadder state="subnet" size="sm" />
        </div>
      </ContentSlide>
    ),
    notes: `This is what a student actually does: the field is left alone. The subnet AWS chose, ${SUBNET_ID}, is read off the instance page later, and its Availability Zone is ${ZONE}. The ladder completes the chain: city, building, floor.`,
  },
  {
    id: 'c3-public-ip', section: C3, label: 'Public IP',
    element: (
      <ContentSlide kicker={C3} title="Public IP" lead="The next line is Auto-assign public IP, and it already reads Enable" lesson={SESSION}>
        <AnnotatedShot
          src="/shots/ec2-07-network-settings.png"
          alt="The Network settings section with Auto-assign public IP set to Enable"
          highlights={[{ ...EC2_NET_PUBLIC_IP, step: 1, label: 'Enable', labelAt: 'right' }]}
          spotlight
          frameWidth={840}
          mark={AWS_MARK}
          caption="EC2 → Instances → Launch instances → Network settings → Auto-assign public IP. Enable"
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: 'Enable gives the instance a public address at launch. Disable leaves it reachable only from inside the VPC. The address itself is read off the instance list in a few slides.',
  },
  {
    id: 'c3-door-list', section: C3, label: 'The door list',
    element: (
      <ContentSlide kicker={C3} title="The Door List" lead={`A Security Group sits in front of the instance and lists which ports may be reached, and by whom. Every port is closed unless it is listed, so port ${PORT_DB} is shut`} lesson={SESSION}>
        <CloudPicture state={5} />
      </ContentSlide>
    ),
    notes: `One new phrase: Security Group. Port ${PORT_SSH} for you over SSH, port ${PORT_APP} for your users, and port ${PORT_DB} listed nowhere, so a database on the instance cannot be reached from outside. The next slide is where the room creates it.`,
  },
  {
    id: 'c3-door-list-read', section: C3, label: 'Reading the door list',
    element: (
      <ContentNoteSlide kicker={C3} title="Reading the Door List" lead="Internet → Security Group → EC2. The Security Group checks the port before a connection reaches the instance" lesson={SESSION} points={[
        { text: `Port ${PORT_SSH} → You → You can connect using SSH`, icon: 'key' },
        { text: `Port ${PORT_APP} → Everyone → Anyone on the internet can access your application on port ${PORT_APP}`, icon: 'globe' },
        { text: `Port ${PORT_DB} → Not listed → Nobody from outside can connect through port ${PORT_DB}`, icon: 'cross' },
      ]} note={{ kind: 'info', title: 'The check', body: 'If the port is allowed, the connection reaches the EC2. If it is not allowed, the connection is blocked.' }} />
    ),
  },
  {
    id: 'c3-security-group', section: C3, label: 'Security Group',
    element: (
      <ContentSlide kicker={C3} title="Security Group" lead={`Create a Security Group and name it ${SG_NAME}. It needs two rules`} lesson={SESSION}>
        <AnnotatedShot
          src="/shots/ec2-08-security-group.png"
          alt="The Firewall section with the security group name nxttrendz-sg, rule 1 ssh on port 22 with source type My IP and the address 49.200.108.250/32, and rule 2 Custom TCP on port 8000 with source Anywhere 0.0.0.0/0"
          highlights={[
            { ...EC2_SG_NAME, step: 1, label: SG_NAME, labelAt: 'right' },
            { ...EC2_SG_RULE_SSH, step: 2, label: `SSH ${PORT_SSH}, My IP`, labelAt: 'right' },
            { ...EC2_SG_RULE_APP, step: 3, label: `TCP ${PORT_APP}, Anywhere`, labelAt: 'right' },
          ]}
          spotlight
          frameWidth={840}
          mark={AWS_MARK}
          caption={`EC2 → Instances → Launch instances → Network settings → Firewall. ${SG_NAME}, two rules`}
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: `My IP fills in your own address, ${MY_IP_CIDR} on the day this was captured, so only your laptop can reach port ${PORT_SSH}. Anywhere, ${ANYWHERE_CIDR}, is every address on the internet, which is what a website needs. Nothing is added for port ${PORT_DB}.`,
  },
  {
    id: 'c3-storage', section: C3, label: 'Configure storage',
    element: (
      <ContentSlide kicker={C3} title="Configure Storage" lead={`Field 6 is the disk. The default ${DISK_SIZE} of ${DISK_TYPE} is enough for this course`} lesson={SESSION}>
        <div className="flex flex-col items-center gap-2">
          <AnnotatedShot
            src="/shots/ec2-24-storage-tab.png"
            alt="The instance's Storage tab, showing Root device name /dev/sda1, Root device type EBS, EBS optimization Enabled, and the Block devices section below"
            highlights={[
              { ...EC2_STORAGE_TAB, step: 1, label: 'Storage', labelAt: 'above' },
              { ...EC2_ROOT_DEVICE, step: 2, label: 'The disk itself', labelAt: 'below' },
            ]}
            spotlight
            frameWidth={700}
            mark={AWS_MARK}
            caption={`EC2 → Instances → ${INSTANCE_ID} → Storage. It holds Ubuntu, Docker and your two images`}
            className="mx-auto w-fit"
          />
          <Chip tone="accent">EBS is its own thing, attached to the instance, and it is billed even while the instance is stopped</Chip>
        </div>
      </ContentSlide>
    ),
    notes: `The Summary panel on the launch form reads "1 volume(s) - ${DISK_SIZE}", and this Storage tab is the same disk after launch. EBS stands for Elastic Block Store, and the word that matters is separate: the disk is its own thing, attached to the instance, which is why it keeps being billed while the instance is stopped.`,
  },
  {
    id: 'c3-summary-launch', section: C3, label: 'Summary and launch',
    element: (
      <ContentSlide kicker={C3} title="Summary and Launch" lead="The Summary panel lists the six answers. Read it, then click Launch instance" lesson={SESSION} points={[
        { text: `1 Name ${INSTANCE_NAME}, 2 Image ${AMI_NAME}`, icon: 'check' },
        { text: `3 Type ${INSTANCE_TYPE}, 4 Key pair ${KEY_NAME}`, icon: 'check' },
        { text: `5 Network ${SG_NAME}, 6 Disk ${DISK_SIZE} ${DISK_TYPE}`, icon: 'check' },
      ]}>
        <AnnotatedShot
          src="/shots/ec2-09-launch-success.png"
          alt="The green Success banner reading Successfully initiated launch of instance i-06031b2ad99f0b796, with the Next Steps panel below it"
          highlights={[{ ...EC2_SUCCESS, step: 1, label: 'The instance ID', labelAt: 'below' }]}
          spotlight
          frameWidth={760}
          mark={AWS_MARK}
          caption={`After Launch instance: Success, and the instance ID ${INSTANCE_ID}`}
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: 'Number of instances is 1 on every capture of the Summary panel. The green banner is the whole result of the six answers: one instance, starting now.',
  },
  {
    id: 'c3-instance-running', section: C3, label: 'Instance running',
    element: (
      <ContentSlide kicker={C3} title="Instance Running" lead="The instance appears in the list. Instance state reads Running, and AWS has given it an address" lesson={SESSION}>
        <AnnotatedShot
          src="/shots/ec2-10-instance-running.png"
          alt="The Instances list with one row: nxttrendz-server, instance id i-06031b2ad99f0b796, Instance state Running, type t3.micro, Availability Zone ap-south-1b and Public IPv4 address 15.207.88.14"
          highlights={[
            { ...EC2_ROW_ID, step: 1, label: 'Instance ID', labelAt: 'below' },
            { ...EC2_ROW_STATE, step: 2, label: 'Running', labelAt: 'below' },
            { ...EC2_ROW_PUBLIC_IP, step: 3, label: 'Public IPv4', labelAt: 'below' },
          ]}
          spotlight
          frameWidth={840}
          mark={AWS_MARK}
          caption={`EC2 → Instances. 1 ${INSTANCE_ID}, 2 Running, 3 ${PUBLIC_IP}. AWS assigns both, so yours will differ`}
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: `Instance state goes Pending, then Running, in about a minute. Status check reads Initializing for a minute more. The Availability Zone column on this row reads ${ZONE}, which is the subnet AWS chose.`,
  },
  {
    id: 'c3-instance-details', section: C3, label: 'The instance page',
    element: (
      <ContentSlide kicker={C3} title="The Instance Page" lead="Clicking the instance ID opens its own page. Both addresses are on it" lesson={SESSION}>
        <AnnotatedShot
          src="/shots/ec2-11-instance-details.png"
          alt="The instance summary page showing Public IPv4 address 15.207.88.14, Private IPv4 address 172.31.7.32, the Public DNS name, the VPC id, the subnet id and the AMI id"
          highlights={[
            { ...EC2_DETAIL_PUBLIC, step: 1, label: 'Public IPv4', labelAt: 'below' },
            { ...EC2_DETAIL_PRIVATE, step: 2, label: 'Private IPv4', labelAt: 'right' },
            { ...EC2_DETAIL_DNS, step: 3, label: 'Public DNS', labelAt: 'below' },
          ]}
          spotlight
          frameWidth={840}
          mark={AWS_MARK}
          caption={`EC2 → Instances → ${INSTANCE_ID}. 1 ${PUBLIC_IP}, 2 ${PRIVATE_IP}, 3 the Public DNS name`}
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: `This one page carries everything the form decided: the VPC ${VPC_ID}, the subnet ${SUBNET_ID}, the AMI ${AMI_ID} and both addresses. AWS assigns the addresses and the instance ID, so a student's page shows different numbers.`,
  },
  {
    id: 'c3-two-addresses', section: C3, label: 'Two addresses',
    element: (
      <ContentSlide kicker={C3} title="Two Addresses" lead="One address for the internet, one for inside the VPC. The numbers below are from this launch, and AWS assigns yours" lesson={SESSION}>
        <DataTable columns={[{ label: '' }, { label: 'Public IPv4' }, { label: 'Private IPv4' }]} rows={[
          ['On this instance', <code key="a">{PUBLIC_IP}</code>, <code key="b">{PRIVATE_IP}</code>],
          ['Who uses it', 'Your users, and you over SSH', 'Other instances in the same VPC'],
          ['Where it works', 'From anywhere on the internet', 'Only inside the VPC'],
          ['When it changes', 'Every time the instance is stopped and started', 'Never, while the instance exists'],
          ['On this instance so far', `${PUBLIC_IP}, ${PUBLIC_IP_RESTARTED}, ${PUBLIC_IP_FINAL}`, `${PRIVATE_IP}, all three times`],
        ]} />
      </ContentSlide>
    ),
    notes: 'Both addresses are on the page the room is looking at. The last row is proved at the end of this concept, when the instance is stopped and started and the public address changes.',
  },
  {
    id: 'c3-connect-two-ways', section: C3, label: 'Connect, two ways',
    element: (
      <ContentSlide kicker={C3} title="Connect, Two Ways" lead={`Connect opens two tabs: the browser, or an SSH client on your laptop`} lesson={SESSION}>
        <AnnotatedShot
          src="/shots/ec2-16-connect-page.png"
          alt="The Connect to Linux instance page, with the In web browser tab selected, EC2 Instance Connect chosen, the public IPv4 address 13.203.216.68 and the Username field reading ubuntu"
          highlights={[
            { ...EC2_CONNECT_TABS, step: 1, label: 'Two tabs', labelAt: 'below' },
            { ...EC2_CONNECT_USERNAME, step: 2, label: `Username ${SSH_USER}`, labelAt: 'right' },
            { ...EC2_CONNECT_BUTTON, step: 3, label: 'Connect', labelAt: 'left' },
          ]}
          spotlight
          frameWidth={840}
          mark={AWS_MARK}
          caption={`EC2 → Instances → ${INSTANCE_ID} → Connect. 1 the two tabs, 2 the username ${SSH_USER}, 3 Connect`}
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: 'This page also prints the VPC, the subnet and the security group of the instance, all three from the form. The browser tab is tried first on the next slides, and it is refused, which is the door list doing its job.',
  },
  {
    id: 'c3-ssh-client-tab', section: C3, label: 'The SSH client tab',
    element: (
      <ContentSlide kicker={C3} title="The SSH Client Tab" lead="The second tab prints the exact command for your laptop, with the Public DNS name in it" lesson={SESSION}>
        <AnnotatedShot
          src="/shots/ec2-17-ssh-client-public-dns.png"
          alt="The In SSH client tab, showing the key pair name nxttrendz-key, the Public DNS ec2-13-203-216-68.ap-south-1.compute.amazonaws.com, the username ubuntu, and the chmod and ssh commands"
          highlights={[
            { ...EC2_SSH_TAB, step: 1, label: 'In SSH client', labelAt: 'below' },
            { ...EC2_SSH_DNS, step: 2, label: 'Public DNS', labelAt: 'below' },
            { ...EC2_SSH_COMMAND, step: 3, label: 'The command', labelAt: 'right' },
          ]}
          spotlight
          frameWidth={840}
          mark={AWS_MARK}
          caption={`EC2 → Instances → ${INSTANCE_ID} → Connect → In SSH client. The Public DNS is the readable form of ${PUBLIC_IP_RESTARTED}`}
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: `Read the Public DNS name out loud slowly: ec2, then the public address with dots turned into dashes, then the Region. It is the same address written so a person can read it. It changes with the address.`,
  },
  {
    id: 'c3-ssh-command', section: C3, label: 'The SSH command',
    element: (
      <ContentSlide kicker={C3} title="The SSH Command" lead="Two commands on your own laptop, in the folder holding the key file. The first protects the file, the second logs in" lesson={SESSION}>
        <ShellPanel
          title={`your laptop  ~/Downloads`}
          prompt="$"
          lines={[
            { text: `chmod 400 "${KEY_FILE}"` },
            { text: `ssh -i "${KEY_FILE}" ${SSH_USER}@${PUBLIC_DNS}` },
          ]}
          caption={`Copied from EC2 → Instances → ${INSTANCE_ID} → Connect → In SSH client`}
          className="mx-auto w-full max-w-[1000px]"
        />
      </ContentSlide>
    ),
    notes: `These are AWS's own two lines, from the SSH client tab. chmod 400 makes the key readable only by you, and ssh refuses to use a key anyone else can read. On Windows, chmod does not exist in PowerShell: run these in Git Bash or WSL, or set the file permissions from the file's Properties. The ${SSH_USER}@ part is the username from the AMI, and the rest is the Public DNS name.`,
  },
  {
    id: 'c3-connect-refused', section: C3, label: 'Connect is refused',
    element: (
      <ContentSlide kicker={C3} title="Connect Is Refused" lead="The browser Connect fails. AWS runs that terminal on its own machines, not on your laptop" lesson={SESSION}>
        <AnnotatedShot
          src="/shots/ec2-18-instance-connect-refused.png"
          alt="A red banner across the top of the console reading Failed to connect to your instance, error establishing SSH connection to your instance, try again later"
          highlights={[{ ...EC2_REFUSED, step: 1, label: 'The door list held', labelAt: 'below' }]}
          spotlight
          frameWidth={840}
          mark={AWS_MARK}
          caption={`EC2 → Instances → ${INSTANCE_ID} → Connect → In web browser → Connect. Refused, because rule 1 says ${MY_IP_CIDR}`}
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: `Nothing is broken. Go back to the Security Group slide and read rule 1 again: port ${PORT_SSH} from ${MY_IP_CIDR}, which is this laptop. The browser terminal arrives from an AWS address instead, so the rule does not match it and the door stays shut. The next slide opens one more door, for that address range only.`,
  },
  {
    id: 'c3-add-one-rule', section: C3, label: 'Add one rule',
    element: (
      <ContentSlide kicker={C3} title="Add One Rule" lead={`Add a second SSH rule whose Source is ${CONNECT_CIDR}`} lesson={SESSION}>
        <AnnotatedShot
          src="/shots/ec2-19-add-connect-rule.png"
          alt="The Edit inbound rules page with three rows: SSH port 22 from 49.200.108.250/32, Custom TCP 8000 from 0.0.0.0/0, and a new SSH row with source 13.233.177.0/29 and the description EC2 Instance Connect, Mumbai"
          highlights={[
            { ...EC2_ADD_RULE, step: 1, label: 'Add rule', labelAt: 'below' },
            { ...EC2_NEW_RULE, step: 2 },
            { ...EC2_SAVE_RULES, step: 3, label: 'Save rules', labelAt: 'below', badgeAt: 'bottom-left' },
          ]}
          spotlight
          frameWidth={840}
          mark={AWS_MARK}
          caption={`EC2 → Security Groups → ${SG_NAME} → Edit inbound rules. 1 Add rule, 2 the new rule, 3 Save`}
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: `Type the description too: EC2 Instance Connect, Mumbai, so the rule explains itself in six months. Every Region has its own range for this service, and AWS publishes all of them as a file at ip-ranges.amazonaws.com. ${CONNECT_CIDR} is the Mumbai one, checked on 2026-09-16, and it is eight addresses, not the whole internet.`,
  },
  {
    id: 'c3-three-doors', section: C3, label: 'Three doors now',
    element: (
      <ContentSlide kicker={C3} title="Three Doors Now" lead={`${SG_NAME} now lists three inbound rules: port ${PORT_SSH} for you, port ${PORT_SSH} for the browser, port ${PORT_APP} for your users`} lesson={SESSION}>
        <AnnotatedShot
          src="/shots/ec2-20-three-inbound-rules.png"
          alt="The security group nxttrendz-sg with three inbound rules: SSH port 22 from 49.200.108.250/32, SSH port 22 from 13.233.177.0/29 described as EC2 Instance Connect, and Custom TCP port 8000 from 0.0.0.0/0"
          highlights={[
            { ...EC2_RULES_COUNT, step: 1, label: 'Inbound rules (3)', labelAt: 'right' },
            { ...EC2_RULES_TABLE, step: 2, label: 'you, the browser, your users', labelAt: 'below' },
          ]}
          spotlight
          frameWidth={840}
          mark={AWS_MARK}
          caption={`EC2 → Security Groups → ${SG_NAME} → Inbound rules. Three rules, and nothing else is open`}
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: `Read the three rows as three doors: one for you over SSH, one for the browser terminal, one for your users on port ${PORT_APP}. Port ${PORT_DB} is on no row, so a database on this instance cannot be reached from outside. Inbound rules count on this page reads 3.`,
  },
  {
    id: 'c3-browser-terminal', section: C3, label: 'Connected in the browser',
    element: (
      <ContentSlide kicker={C3} title="Connected in the Browser" lead="The same Connect button now opens a working terminal, inside the browser tab" lesson={SESSION}>
        <AnnotatedShot
          src="/shots/ec2-21-browser-terminal.png"
          alt="The EC2 Instance Connect browser terminal showing Welcome to Ubuntu 26.04 LTS on GNU Linux 7.0.0-1006-aws x86_64, the system information with IPv4 address for ens5 172.31.7.32, and the prompt ubuntu@ip-172-31-7-32"
          highlights={[
            { ...EC2_WELCOME, step: 1, label: 'Ubuntu 26.04 LTS', labelAt: 'below' },
            { ...EC2_ENS5, step: 2, label: 'the private address', labelAt: 'right' },
            { ...EC2_BROWSER_IPS, step: 3, label: 'both addresses', labelAt: 'above' },
          ]}
          spotlight
          frameWidth={840}
          mark={AWS_MARK}
          caption={`EC2 → Instances → ${INSTANCE_ID} → Connect → In web browser. Public ${PUBLIC_IP_FINAL}, private ${PRIVATE_IP}`}
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: `The welcome line is the AMI from field 2, now running. The bar at the bottom prints both addresses: the public one is ${PUBLIC_IP_FINAL} by now, because the instance has been stopped and started twice, and the private one has never moved.`,
  },
  {
    id: 'c3-browser-commands', section: C3, label: 'Three answers',
    element: (
      <ContentSlide kicker={C3} title="Three Answers" lead="Three commands in that terminal. The machine's own name is its private address" lesson={SESSION}>
        <AnnotatedShot
          src="/shots/ec2-22-browser-terminal-commands.png"
          alt="The browser terminal after running hostname, whoami and uptime -p, printing ip-172-31-7-32, ubuntu and up 1 minute"
          highlights={[{ ...EC2_BROWSER_CMDS, step: 1, label: 'hostname · whoami · uptime', labelAt: 'right' }]}
          spotlight
          frameWidth={840}
          mark={AWS_MARK}
          caption={`hostname prints ${HOSTNAME}, whoami prints ${SSH_USER}, uptime -p prints up 1 minute`}
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: `Say the link out loud: ${HOSTNAME} is ${PRIVATE_IP} with the dots turned into dashes. That is the private address from Two Addresses, and it is the name the machine calls itself. whoami prints ${SSH_USER}, the username that came with the AMI.`,
  },
  {
    id: 'c3-inside-instance', section: C3, label: 'Inside the instance',
    element: (
      <ContentSlide kicker={C3} title="Inside the Instance" lead="Four more commands, and the computer from field 3 answers for itself" lesson={SESSION}>
        <ShellPanel
          title={`${SSH_USER}@${HOSTNAME}: ~`}
          prompt={`${SSH_USER}@${HOSTNAME}:~$`}
          fontSize={15}
          lines={[
            { text: 'uname -srm' },
            { text: 'Linux 7.0.0-1006-aws x86_64', kind: 'out' },
            { text: 'uptime -p' },
            { text: 'up 2 minutes', kind: 'out' },
            { text: 'df -h /' },
            { text: '/dev/root       6.7G  2.1G  4.6G  31% /', kind: 'out' },
            { text: 'free -h' },
            { text: 'Mem:           908Mi       312Mi', kind: 'out' },
          ]}
          caption={`The same session on ${INSTANCE_NAME}, a few commands later`}
          className="mx-auto w-full max-w-[900px]"
        />
      </ContentSlide>
    ),
    notes: `Read the four answers against the launch form: Linux on an aws kernel is the AMI, ${DISK_SIZE} of disk with 4.6G free is field 6, and under 1 GiB of memory is ${INSTANCE_TYPE}. Nothing here was typed into the deck by hand; it is the session transcript.`,
  },
  {
    id: 'c3-stop-instance', section: C3, label: 'Stop the instance',
    element: (
      <ContentSlide kicker={C3} title="Stop the Instance" lead="Instance state is the menu that turns the computer off. Stop instance, never Terminate" lesson={SESSION}>
        <AnnotatedShot
          src="/shots/ec2-12-instance-state-menu.png"
          alt="The Instance state menu open on the instance page, listing Stop instance, Start instance, Reboot instance, Hibernate instance and Terminate (delete) instance"
          highlights={[
            { ...EC2_MENU_STOP, step: 1, label: 'Stop instance', labelAt: 'left' },
            { ...EC2_MENU_TERMINATE, step: 2, label: 'Not this one', labelAt: 'left' },
          ]}
          spotlight
          frameWidth={840}
          mark={AWS_MARK}
          caption={`EC2 → Instances → ${INSTANCE_ID} → Instance state. 1 Stop instance. 2 Terminate deletes it`}
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: 'Start instance is greyed out because the instance is already running. The same menu starts it again next session.',
  },
  {
    id: 'c3-stop-dialog', section: C3, label: 'The Stop dialog',
    element: (
      <ContentSlide kicker={C3} title="The Stop Dialog" lead="AWS says it in the dialog: the hourly charge stops, the disk keeps being billed" lesson={SESSION}>
        <AnnotatedShot
          src="/shots/ec2-13-stop-dialog.png"
          alt="The Stop instance dialog, with the instance id and Result Can stop, a yellow box saying you will be billed for associated resources such as EBS volumes, and the Stop button"
          highlights={[
            { ...EC2_STOP_WARNING, step: 1, label: 'The disk is still billed', labelAt: 'below' },
            { ...EC2_STOP_BUTTON, step: 2, label: 'Stop', labelAt: 'right' },
          ]}
          spotlight
          frameWidth={840}
          mark={AWS_MARK}
          caption={`EC2 → Instances → ${INSTANCE_ID} → Instance state → Stop instance. Read box 1 before clicking 2`}
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: 'AWS\'s own words: after you stop the instance you are no longer charged usage, but you are still billed for EBS volumes. EBS is the disk. That sentence is the Billing concept in one line.',
  },
  {
    id: 'c3-stop-or-terminate', section: C3, label: 'Stop or terminate',
    element: (
      <ContentSlide kicker={C3} title="Stop or Terminate" lead="Stop turns the computer off and keeps the disk. Terminate deletes the instance and the disk with it" lesson={SESSION}>
        <DataTable columns={[{ label: '' }, { label: 'Stop' }, { label: 'Terminate' }]} rows={[
          ['The computer', 'Off, and can be started again', 'Gone'],
          ['The disk', 'Kept, and still billed', 'Deleted with the instance'],
          ['The hourly charge', 'Stops', 'Stops'],
          ['Your files on it', 'Still there when you start it', 'Gone'],
          ['The public address', 'A new one on the next start', 'Gone'],
        ]} highlight={[1]} />
      </ContentSlide>
    ),
    notes: 'Stop today. The next session starts the same instance and installs Docker on it, so terminating means doing this whole concept again.',
  },
  {
    id: 'c3-instance-stopped', section: C3, label: 'Instance stopped',
    element: (
      <ContentSlide kicker={C3} title="Instance Stopped" lead="Instance state reads Stopped, and the public address columns are empty" lesson={SESSION}>
        <AnnotatedShot
          src="/shots/ec2-14-instance-stopped.png"
          alt="The Instances list with nxttrendz-server in state Stopped, and dashes in the Public IPv4 DNS and Public IPv4 address columns"
          highlights={[
            { ...EC2_ROW_STATE, step: 1, label: 'Stopped', labelAt: 'below' },
            { ...EC2_ROW_NO_ADDRESS, step: 2, label: 'No public address', labelAt: 'below' },
          ]}
          spotlight
          frameWidth={840}
          mark={AWS_MARK}
          caption="EC2 → Instances, after Stop. 1 Stopped, 2 the public address columns are empty"
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: `The instance ID, the disk and the private address are all still there. Only the public address is gone, because a stopped instance does not need one and AWS gives it to somebody else.`,
  },
  {
    id: 'c3-no-public-address', section: C3, label: 'No public address',
    element: (
      <ContentSlide kicker={C3} title="No Public Address" lead="On the stopped page the public address is a dash. The private one is still there" lesson={SESSION}>
        <AnnotatedShot
          src="/shots/ec2-23-stopped-no-public-ip.png"
          alt="The stopped instance's summary page: Public IPv4 address is a dash, Public DNS is a dash, Instance state Stopped, and Private IPv4 addresses still 172.31.7.32"
          highlights={[
            { ...EC2_STOPPED_PUBLIC, step: 1, label: 'Taken back', labelAt: 'below' },
            { ...EC2_STOPPED_PRIVATE, step: 2, label: 'Still yours', labelAt: 'below' },
          ]}
          spotlight
          frameWidth={840}
          mark={AWS_MARK}
          caption={`EC2 → Instances → ${INSTANCE_ID}, stopped. 1 no public address and no Public DNS, 2 ${PRIVATE_IP}, unchanged`}
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: `Compare this page with the same page while it was running: the only lines that changed are the public ones. Stopping does not pause the address, it hands it back, which is exactly why a Start gives a new one. The instance ID, the disk, the VPC, the subnet and ${PRIVATE_IP} are all still here.`,
  },
  {
    id: 'c3-address-changed', section: C3, label: 'The address changed',
    element: (
      <ContentSlide kicker={C3} title="The Address Changed" lead="Started again, it came back with a different public address. The private one never moved" lesson={SESSION}>
        <AnnotatedShot
          src="/shots/ec2-15-restarted-new-ip.png"
          alt="The Instances list after starting the instance again: state Running with the new public address 13.203.216.68, and the details panel below showing the private address still 172.31.7.32"
          highlights={[
            { ...EC2_RESTART_ROW_IP, step: 1, label: 'A new public address', labelAt: 'below' },
            { ...EC2_RESTART_PRIVATE, step: 2, label: 'The same private one', labelAt: 'below' },
          ]}
          spotlight
          frameWidth={840}
          mark={AWS_MARK}
          caption={`EC2 → Instances, after Start. 1 ${PUBLIC_IP_RESTARTED}, 2 ${PRIVATE_IP}, unchanged`}
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: `This is the last row of the Two Addresses table, proved twice: ${PUBLIC_IP}, ${PUBLIC_IP_RESTARTED}, ${PUBLIC_IP_FINAL}, all on one instance, while ${PRIVATE_IP} stayed. Every Stop and Start hands out a new public address, so a link you gave somebody stops working. The next session pins one with an Elastic IP, which is also why an idle Elastic IP appears in Billing.`,
  },
  {
    id: 'c3-recap', section: C3, label: 'Launching in one line',
    element: (
      <IllustratedRecap kicker={C3} title="Launching in One Line" lesson={SESSION} lines={[
        { text: 'The instance is created in one Region, in one Availability Zone', figure: <LadderAll /> },
        { text: 'The form asks for a name, an image, a size, a key pair, a network and a disk', figure: <VpcFrame /> },
        { text: 'It is Running, with a public address that changes and a private one that does not', figure: <TwoAddresses /> },
      ]} />
    ),
  },

  /* ═══ CONCEPT 4 · Billing (divider + 7) ═════════════════════════════ */
  { id: 'c4-divider', section: C4, label: '04', element: <SectionBreakerSlide index={4} title={C4} lesson={SESSION} /> },
  {
    id: 'c4-what-cost', section: C4, label: 'What has it cost',
    element: <QuestionSlide kicker="A question first" question="Your instance has been running for twenty minutes. What has it cost so far?" lesson={SESSION} />,
    notes: 'Take answers before the number. A t3.micro in Mumbai is USD 0.0112 an hour, so twenty minutes is under half a cent, and it comes out of the credit, not the card. The next three slides are why that is true.',
  },
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
      <ContentSlide kicker={C4} title="What Costs Money" lead="Four meters run on AWS. The instance you launched is the first of them. Mumbai prices, checked 15 September 2026" lesson={SESSION}>
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
    notes: 'This is why the session ends with Stop, and a check of the disk, not with closing the tab. The meter beside the list is the one from Pay for Use with its light off and its digits still ticking.',
  },
  {
    id: 'c4-billing-page', section: C4, label: 'The Billing page',
    element: (
      <ContentSlide kicker={C4} title="The Billing Page" lead="The Billing page says it in one line: a Free plan account does not get charged" lesson={SESSION}>
        <AnnotatedShot
          src="/shots/bill-01-billing-home.png"
          alt="The Billing and Cost Management home with a blue panel reading Your free plan account does not get charged, and a Cost summary whose four figures read Data unavailable"
          highlights={[
            { ...BILL_FREE_PANEL, step: 1, label: 'Does not get charged', labelAt: 'below' },
            { ...BILL_DATA_UNAVAILABLE, step: 2, label: 'Not an error', labelAt: 'right', badgeAt: 'bottom-left' },
          ]}
          spotlight
          frameWidth={840}
          mark={AWS_MARK}
          caption="Account menu → Billing and Cost Management. 2 takes up to 24 hours to appear"
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: 'Say the Data unavailable line out loud before anyone panics: AWS takes up to 24 hours after the first visit to prepare cost data on a new account, and the banner at the top of the page says so. Nothing is broken and nothing has been charged. The blue panel is the fact that matters: a Free plan account is not billed.',
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
    id: 'stop-your-instance', section: 'Closing', label: 'Stop your instance',
    element: (
      <ContentSlide kicker="Closing" title="Stop Your Instance" lead="Before you close the laptop, check your instance reads Stopped. Stop keeps the disk and its meter, and the next session starts it again" lesson={SESSION}>
        <div className="grid grid-cols-[1fr_360px] items-center gap-10">
          <DataTable compact columns={[{ label: 'Before you leave' }, { label: 'Where' }]} rows={[
            ['Instance state reads Stopped', 'EC2 → Instances'],
            [`${KEY_FILE} is saved somewhere you will find it`, 'Your laptop'],
            ['The zero spend budget is listed', 'Billing → Budgets'],
          ]} />
          <Meter state="idleBilled" unit="per GB per month" label="the disk of a stopped instance" size="md" />
        </div>
      </ContentSlide>
    ),
    notes: 'Do this in the room, together. Nobody terminates: the next session starts this same instance, logs in with the same key file and installs Docker on it.',
  },
  {
    id: 'key-takeaways', section: 'Closing', label: 'Key takeaways',
    element: <KeyTakeawaysSlide title={SESSION} lesson={SESSION} points={[C1, C2, C3, C4]} />,
    notes: 'Rule 20: the four agenda names, word for word, in a different UI than the agenda.',
  },
  {
    id: 'practice', section: 'Closing', label: 'Practice',
    element: (
      <PracticeSlide lesson={SESSION} title="Launch, then stop" prompt="Five steps on your own console. The last one is the one that matters." tasks={[
        `Console → top right → ${REGION_NAME}`,
        'EC2 → Instances → Launch instance, with the six answers from this session',
        'EC2 → Instances, and read the public IPv4 address and the instance ID',
        'Billing → Budgets → Create budget → Zero spend budget',
        'Send one screenshot of your stopped instance in the group, and start it again next session',
      ]} />
    ),
  },
  {
    id: 'what-comes-next', section: 'Closing', label: 'What comes next',
    element: (
      <ContentSlide kicker="What Comes Next" title="What Comes Next" lead="The instance is running in Mumbai. The next session logs in to it over SSH, installs Docker and runs your two images on it" lesson={SESSION}>
        <CloudPicture state={2} revealFrom={6} />
      </ContentSlide>
    ),
    notes: 'The same drawing as EC2 Rents a Computer, held still. Next session: log in to the instance with the .pem file over SSH, install Docker, pull the two images and open the site on the public address.',
  },
  {
    id: 'feedback', section: 'Closing', label: 'Feedback',
    element: <FeedbackSlide lesson={SESSION} title="How did this session land?" prompt="Two minutes of feedback helps us make the next session sharper." />,
  },
  { id: 'thank-you', section: 'Closing', label: 'Thank you', element: <ThankYouSlide lesson={SESSION} /> },
]
