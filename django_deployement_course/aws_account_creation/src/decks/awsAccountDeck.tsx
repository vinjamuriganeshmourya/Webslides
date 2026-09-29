import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  ContentNoteSlide,
  ContentSlide,
  KeyTakeawaysSlide,
  RecapSlide,
  SectionBreakerSlide,
  StatusPointsSlide,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'
import { Callout, Shot } from '@/ui'

/**
 * AWS ACCOUNT CREATION — a standalone module.
 *
 * Plan: `../../session_plans/aws_account_creation/plan.md`, signed off
 * 2026-09-28. Read it before editing a slide here; the slide numbers in plan §5
 * are the ids below, in order.
 *
 * THE RULES THIS DECK RUNS ON, beyond the workspace hard rules:
 *
 *   1. EVERY CAPTURE IS REAL, and every one was taken on the account this
 *      module was built from, on 2026-09-15 and 2026-09-16. There is no
 *      stand-in component to reach for, deliberately. One screen has no capture
 *      at all (`your-password`, plan D1) and that slide says so rather than
 *      inventing one.
 *
 *   2. FIVE CAPTURES ARE BLURRED, never retouched: the PAN number, date of
 *      birth, two names, two phone numbers and a street address. A blurred
 *      field still shows the room that a field is there. See plan §4b and
 *      `workflow/prep-shots.py`, which is the script that did it and is kept so
 *      the redaction can be re-run and audited.
 *
 *   3. MONEY IS STATED BEFORE IT IS SPENT (plan §2 rule 6). `why-a-card` sits
 *      before `card-or-upi`, and `up-to-not-now` sits immediately after the
 *      mandate screen, because a beginner who is surprised by a charge stops
 *      following the module.
 *
 *   4. MFA IS SHOWN AND SKIPPED, on instruction of 2026-09-28. The screen is on
 *      a slide because the room will meet it; the action taught is `Skip for
 *      now`. The 35-day deadline is stated because the screenshot states it.
 *
 *   5. IAM IS NAMED AND NEVER OPENED (hard rule 4). No access keys appear in
 *      this module, so the leaked-key incidents stay in the instructor notes of
 *      `left-running` and off every slide.
 *
 * ALSO: no spaced em dash (rule 1), titles are the topic in two or three words
 * and leads state the fact (rule 29), and Key Takeaways restates C1 to C4
 * verbatim (rule 20).
 */

export const awsAccountMeta: DeckMeta = {
  title: 'AWS Account Creation',
  course: 'NxtWave · Cloud',
  lesson: 'AWS Account Creation',
  presenter: 'NxtWave Instructor',
}

const SESSION = 'AWS Account Creation'

/** The four concept names. The agenda, the dividers and the takeaways all read from here. */
const C1 = 'Before You Sign Up'
const C2 = 'The Sign-Up Form'
const C3 = 'Opening the Console'
const C4 = 'Watching the Money'

/**
 * Every figure the room will see written once, so the deck cannot drift from
 * the screenshots. Each one is read off a capture in `public/shots/`.
 */
const CREDIT_ON_SIGNUP = 'up to $200'   // the in-signup plan card
const CREDIT_IN_CONSOLE = 'USD 100'     // the Free plan status panel
const CREDIT_INR = 'about ₹8,800'
const FREE_DAYS = '182 days'
const MANDATE_CAP = '₹15,000'
const MFA_DEADLINE = '35 days'

/** Sources printed on a slide carry their link, so the exported HTML is clickable. */
const DOC_PAYMENTS =
  'https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/edit-aispl-payment-method.html'

export const awsAccountDeck: SlideDef[] = [
  /* ═══ OPENING ═══════════════════════════════════════════════════════ */
  {
    id: 'brand', section: 'Opening', label: 'Brand',
    element: <BrandSlide greeting="Welcome" lesson={SESSION} />,
  },
  {
    id: 'module-name', section: 'Opening', label: 'Module name',
    element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} />,
  },
  {
    id: 'what-you-need', section: 'Opening', label: 'What you need',
    element: (
      <ContentNoteSlide
        kicker="Before We Start" title="What You Need" lesson={SESSION}
        lead="Five things, on your own device, before the first screen"
        points={[
          { text: 'An email address you can open right now', sub: 'A code is sent to it, and it becomes your login', icon: 'chat' },
          { text: 'A phone that can receive an SMS', icon: 'devices' },
          { text: 'A debit card, a credit card, or a UPI app', sub: 'For identity, not for payment', icon: 'shield' },
          { text: 'A PAN card, if you are signing up from India', sub: 'The name on it must match the name you enter', icon: 'file' },
        ]}
        note={{
          kind: 'info', title: 'About twenty minutes',
          body: 'Every detail goes into AWS on your own device, and nothing is collected by the room.',
        }}
      />
    ),
    notes: 'Take two minutes here and ask the room to put the five things on the desk. A learner who starts the form without a PAN card stops at step 4 and misses the rest of the module.',
  },
  {
    id: 'agenda', section: 'Opening', label: 'Agenda',
    element: (
      <AgendaSlide
        kicker={SESSION} title="Agenda" lesson={SESSION}
        items={[
          { title: C1, sub: 'What an account is, and who the root user is' },
          { title: C2, sub: 'Five steps, one screen at a time' },
          { title: C3, sub: 'Signing in for the first time' },
          { title: C4, sub: 'The credit, and an alarm on the first cent' },
        ]}
      />
    ),
  },

  /* ═══ C1 · BEFORE YOU SIGN UP ═══ 4MAT ══════════════════════════════ */
  {
    id: 'c1-divider', section: C1, label: 'Divider',
    element: <SectionBreakerSlide index={1} title={C1} lesson={SESSION} />,
  },
  {
    id: 'renting-a-computer', section: C1, label: 'Your own machine',
    element: (
      <ContentSlide
        kicker={C1} title="Your Own Machine" lesson={SESSION}
        lead="Today your app runs on the laptop in front of you"
        points={[
          { text: 'You start it, and it runs', sub: 'The app answers on localhost, and you can see it working', icon: 'play' },
          { text: 'You close the laptop, and it stops', sub: 'Nothing answers until you open it again', icon: 'cross' },
        ]}
      />
    ),
    notes: 'Why, movement 1 of 2. Stay on the routine they already have. Do not name AWS yet; the next slide is where the routine breaks.',
  },
  {
    id: 'what-that-costs', section: C1, label: 'What that costs',
    element: (
      <StatusPointsSlide
        kicker={C1} title="What That Costs" lesson={SESSION}
        lead="Three things your laptop cannot do for an application other people use"
        items={[
          { status: 'error', label: 'Cannot', text: 'It cannot stay on', detail: 'A server has to answer at 3am, on a day you are not at your desk' },
          { status: 'error', label: 'Cannot', text: 'It cannot be reached', detail: 'Your home network gives it no address the rest of the world can open' },
          { status: 'error', label: 'Cannot', text: 'It cannot grow', detail: 'One machine is one machine. Ten thousand people arriving does not add a second one' },
        ]}
      />
    ),
    notes: 'The break, and the load-bearing slide of this concept. Ask the room for a fourth cost before moving on. After this they can state the problem in their own words, which is the test the Why movement has to pass.',
  },
  {
    id: 'an-aws-account', section: C1, label: 'An AWS account',
    element: (
      <ContentNoteSlide
        kicker={C1} title="An AWS Account" lesson={SESSION}
        lead="AWS is Amazon Web Services. It rents computers that are always on, by the hour"
        points={[
          { text: 'The account is the login that owns what you rent', sub: 'Every machine, every disk, every address you create sits inside it', icon: 'key' },
          { text: 'The account is also the bill', sub: 'One account, one bill, whatever you ran that month', icon: 'info' },
        ]}
        note={{
          kind: 'info', title: 'Not the shopping app',
          body: 'Amazon Web Services and amazon.in are different products from the same company. An amazon.in login does not open an AWS account.',
          icon: <img src="/assets/tech/aws.png" alt="" draggable={false} className="h-5 w-5 object-contain" />,
        }}
      />
    ),
    notes: 'What, movement 2. The acronym is expanded here and nowhere else. The note exists because the first question in every room is whether their shopping login works.',
  },
  {
    id: 'the-root-user', section: C1, label: 'The root user',
    element: (
      <ContentSlide
        kicker={C1} title="The Root User" lesson={SESSION}
        lead="The email you sign up with becomes the root user, the owner of the account"
      >
        <div className="grid w-full max-w-[840px] grid-cols-[1.05fr_1fr] items-center gap-8">
          <div className="space-y-4">
            <Callout kind="note" title="Root user" asStep={false}>
              The account owner. It can do everything, including closing the account and changing who pays.
            </Callout>
            <Callout kind="note" title="IAM user" asStep={false}>
              A second kind of login, for people you later invite into your account. This module never creates one.
            </Callout>
          </div>
          <Shot
            src="/shots/console-02-signin-entry.png"
            alt="The AWS sign in panel, with fields for an account ID or alias, an IAM username and a password, a Sign in button, and below it the links Sign in using root user email and Create a new AWS account"
            caption="signin.aws.amazon.com. Both kinds of login start on this one page"
            className="mx-auto w-full max-w-[270px]"
          />
        </div>
      </ContentSlide>
    ),
    notes: 'One new word, and IAM is NAMED here and not opened (hard rule 4). If someone asks what IAM is for, say "adding other people to your account" and move on. It gets its own session later.',
  },
  {
    id: 'six-months-free', section: C1, label: 'Six months free',
    element: (
      <ContentNoteSlide
        kicker={C1} title="Six Months Free" lesson={SESSION}
        lead={`The Free plan gives you credit to spend, and ${FREE_DAYS} to spend it in`}
        points={[
          { text: `${CREDIT_IN_CONSOLE} lands the day the account opens`, sub: `${CREDIT_INR}, shown in your console`, icon: 'bolt' },
          { text: 'Another USD 100 can be earned', sub: 'By completing activities AWS lists, such as creating your first budget', icon: 'star' },
          { text: 'Nothing is billed while the plan is Free', sub: 'The account closes at the end unless you choose to upgrade', icon: 'shield-check' },
        ]}
        note={{
          kind: 'warning', title: 'Two numbers, and you will see both',
          body: `The sign-up screen says ${CREDIT_ON_SIGNUP} in credits, and your console says ${CREDIT_IN_CONSOLE} ten minutes later. The first figure counts the USD 100 you are given plus the USD 100 you can earn.`,
        }}
      />
    ),
    notes: 'What if, the close. The warning is here rather than later because the room meets the $200 figure on slide 16 and the $100 figure on slide 35, and a learner who is not warned concludes the deck is wrong.',
  },
  {
    id: 'c1-recap', section: C1, label: 'Recap',
    element: (
      <RecapSlide
        kicker={C1} title={C1} lesson={SESSION}
        points={[
          { text: 'Your laptop cannot stay on, be reached, or grow', sub: 'Which is why the app needs a computer somewhere else' },
          { text: 'An AWS account is the login that owns what you rent', sub: 'And the bill for it' },
          { text: 'The email you sign up with becomes the root user', sub: 'The owner of the account' },
          { text: `The Free plan is ${CREDIT_IN_CONSOLE} and ${FREE_DAYS}`, sub: 'With nothing billed unless you upgrade' },
        ]}
      />
    ),
  },

  /* ═══ C2 · THE SIGN-UP FORM ═══ Merrill ═════════════════════════════ */
  {
    id: 'c2-divider', section: C2, label: 'Divider',
    element: <SectionBreakerSlide index={2} title={C2} lesson={SESSION} />,
  },
  {
    id: 'where-to-start', section: C2, label: 'Where to start',
    element: (
      <ContentSlide
        kicker={C2} title="Where To Start" lesson={SESSION}
        lead="Open the sign-in page, then choose to create a new account"
      >
        <Shot
          src="/shots/console-02-signin-entry.png"
          alt="The AWS sign in panel. At the bottom, under the Sign in button, sits the link Create a new AWS account"
          caption="signin.aws.amazon.com, then Create a new AWS account, at the bottom of the panel"
          highlight={{ left: 6, top: 86, width: 88, height: 8 }}
          className="mx-auto w-full max-w-[300px]"
        />
      </ContentSlide>
    ),
    notes: 'Problem movement. The link is easy to miss because it sits under the button, so the box is here rather than a crop. AWS also reaches the same form from aws.amazon.com, and either route is fine.',
  },
  {
    id: 'your-email', section: C2, label: 'Your email',
    element: (
      <ContentSlide
        kicker={C2} title="Your Email" lesson={SESSION}
        lead="The first screen asks for two things, and the email becomes your login"
      >
        <div className="grid w-full max-w-[840px] grid-cols-[1.25fr_1fr] items-center gap-8">
          <Shot
            src="/shots/aws-signup.png"
            alt="The AWS sign-up form with empty Root user email address and AWS account name fields, beside an offer of USD 100 in credits for up to 6 months"
            caption="portal.aws.amazon.com/billing/signup. Your email, then a name for the account"
            className="mx-auto w-full max-w-[470px]"
          />
          <div className="space-y-4">
            <Callout kind="tip" title="Use an address you will keep" asStep={false}>
              Every password reset and every billing notice goes here. Avoid a college address that will expire.
            </Callout>
            <Callout kind="note" title="The account name is a label" asStep={false}>
              You choose it, and it can be changed later. It is not a username.
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: 'A code is emailed to verify the address before the form continues. If it has not arrived in two minutes, it is almost always in spam.',
  },
  {
    id: 'your-password', section: C2, label: 'Your password',
    element: (
      <ContentNoteSlide
        kicker={C2} title="Your Password" lesson={SESSION}
        lead="Step 1 of 5 sets the root user password, and this one is worth getting right"
        points={[
          { text: 'It is the key to the whole account', sub: 'Everything you rent, and the card behind it, sit inside this login', icon: 'lock' },
          { text: 'Use one you have not used anywhere else', sub: 'A password reused from another site is as safe as that other site was', icon: 'shield' },
          { text: 'Store it in a password manager, not a notebook', sub: 'You will need it again at the end of this module', icon: 'key' },
        ]}
        note={{
          kind: 'warning', title: 'This screen has no screenshot, on purpose',
          body: 'A capture of this screen would show a real password, so there is none. Type yours, and let nobody see the screen.',
        }}
      />
    ),
    notes: 'Plan D1. The only capture of this screen was taken with Show password ticked and is being destroyed rather than blurred, so the slide states the absence instead of faking it. Say the reason out loud: it is the lesson.',
  },
  {
    id: 'free-or-paid', section: C2, label: 'Free or paid',
    element: (
      <ContentSlide
        kicker={C2} title="Free Or Paid" lesson={SESSION}
        lead="Immediately after the password, AWS asks which plan the account will use"
      >
        <Shot
          src="/shots/signup-01-plan-chooser.png"
          alt="The Choose your account plan screen. Two cards side by side: Free for 6 months, for learning and prototypes, and Paid, for production workloads. Both offer up to $200 in credits; only the Paid card ticks scaling beyond credit thresholds and access to all services"
          caption="Sign up for AWS, Choose your account plan. Both cards carry credits, and only one can bill you"
          className="mx-auto w-full max-w-[430px]"
        />
      </ContentSlide>
    ),
    notes: 'This chooser moved. It used to sit after payment and phone verification and now sits at step 1, right after the password. Deployment session 9 still says otherwise on a slide, which plan §4c records.',
  },
  {
    id: 'choose-free-plan', section: C2, label: 'Choose Free plan',
    element: (
      <ContentSlide
        kicker={C2} title="Choose Free Plan" lesson={SESSION}
        lead="Choose the Free plan. It cannot bill you unless you later upgrade it yourself"
      >
        <div className="grid w-full max-w-[840px] grid-cols-[1.35fr_1fr] items-center gap-8">
          <Shot
            src="/shots/signup-01-plan-chooser.png"
            alt="The Choose your account plan screen, with the Free card and its Choose free plan button on the left"
            caption="Choose free plan, the left-hand button"
            highlight={{ left: 4, top: 31, width: 44, height: 62 }}
            className="mx-auto w-full max-w-[392px]"
          />
          <div className="space-y-4">
            <Callout kind="success" title="What Free gives you" asStep={false}>
              Credits to spend, and six months in which to spend them. That covers everything this course asks you to run.
            </Callout>
            <Callout kind="warning" title="What it does not give you" asStep={false}>
              Workloads that grow beyond the credits, and a few services the Free plan excludes. Neither applies while you are learning.
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: 'Application movement: the room clicks this one. The verdict carries its reason, which is the SCQA check even inside a Merrill concept. At the end of six months an unupgraded account closes on its own; it does not roll into a bill.',
  },
  {
    id: 'your-details', section: C2, label: 'Your details',
    element: (
      <ContentSlide
        kicker={C2} title="Your Details" lesson={SESSION}
        lead="Step 2 of 5 asks for your name, your phone number and your address"
      >
        <div className="grid w-full max-w-[840px] grid-cols-[1fr_1.1fr] items-center gap-8">
          <Shot
            src="/shots/signup-02-contact-empty.png"
            alt="The Contact Information form, step 2 of 5: Full Name, an optional Organization name, Country Code and Phone Number, Country or Region, two address lines, City, State and Postal Code, then a checkbox agreeing to the AWS Customer Agreement"
            caption="Sign up for AWS, Contact Information, step 2 of 5"
            className="mx-auto w-full max-w-[268px]"
          />
          <div className="space-y-4">
            <Callout kind="warning" title="Match your bank records" asStep={false}>
              The name and address here are checked against the card you enter on the next screen. A mismatch is the commonest reason a sign-up stalls.
            </Callout>
            <Callout kind="note" title="Leave Organization name empty" asStep={false}>
              You are signing up as a person, not a company.
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: 'Country or Region drives which payment methods appear on the next screen and whether the PAN step exists at all. Choosing India here is what produces the UPI option and the KYC step.',
  },
  {
    id: 'address-required', section: C2, label: 'An address is required',
    element: (
      <ContentSlide
        kicker={C2} title="The Address Field" lesson={SESSION}
        lead="Address line 1 is a search box, and typing into it is not enough"
      >
        <div className="grid w-full max-w-[840px] grid-cols-[1fr_1.1fr] items-center gap-8">
          <Shot
            src="/shots/signup-03-contact-error.png"
            alt="The same Contact Information form after a failed submit. Address line 1 is outlined in red with the message An address is required below it. The Full Name and Phone Number values are blurred"
            caption="The same form, after Agree and Continue. Address line 1 is outlined in red"
            className="mx-auto w-full max-w-[238px]"
          />
          <div className="space-y-4">
            <Callout kind="error" title="An address is required" asStep={false}>
              The field holds a magnifying glass, so it searches rather than accepts. Type the first line, wait, then select your address from the list it offers.
            </Callout>
            <Callout kind="tip" title="If nothing is suggested" asStep={false}>
              Enter the city and postal code first, then return to the street line.
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: 'The name and phone on this capture are blurred, not painted over. This slide exists because the error stops a beginner completely: the field looks filled and the form still refuses.',
  },
  {
    id: 'why-a-card', section: C2, label: 'Why a card',
    element: (
      <ContentNoteSlide
        kicker={C2} title="Why A Card" lesson={SESSION}
        lead="The next screen asks for a payment method, and it does so to verify your identity"
        points={[
          { text: 'USD 1 may be held, then returned', sub: 'AWS holds it for 3 to 5 days to verify the account and prevent fraud', icon: 'shield' },
          { text: 'A card is charged ₹2, and refunded', sub: 'Back on the card within 5 to 7 business days', icon: 'check' },
          { text: 'Nothing else is charged on the Free plan', sub: 'No bill exists until you choose to upgrade', icon: 'shield-check' },
        ]}
        note={{
          kind: 'info', title: 'Say this before the screen appears',
          body: 'Both amounts are AWS\'s own words, and both come back.',
        }}
      />
    ),
    notes: `Plan §2 rule 6: money is stated before it is spent. Source for the ₹2 and its refund window: ${DOC_PAYMENTS}. The USD 1 hold is printed on the billing screen itself, which the room sees on the next slide.`,
  },
  {
    id: 'card-or-upi', section: C2, label: 'Card or UPI',
    element: (
      <ContentSlide
        kicker={C2} title="Card Or UPI" lesson={SESSION}
        lead="Step 3 of 5 accepts either a UPI app or a card"
      >
        <div className="grid w-full max-w-[840px] grid-cols-[1fr_1.05fr] items-center gap-8">
          <Shot
            src="/shots/signup-04-billing-upi.png"
            alt="The Billing Information screen, step 3 of 5. Billing country India, then two payment method choices: UPI AutoPay, selected, and Credit or debit card. Below, UPI AutoPay information gives an automatic payment limit of ₹15,000, and a note that a ₹2 refundable transaction is required. The billing address is blurred"
            caption="Sign up for AWS, Billing Information, step 3 of 5"
            className="mx-auto w-full max-w-[228px]"
          />
          <div className="space-y-4">
            <Callout kind="note" title="UPI AutoPay" asStep={false}>
              Your UPI app approves a mandate. A QR code appears on the next page, and you scan it.
            </Callout>
            <Callout kind="note" title="Credit or debit card" asStep={false}>
              Visa, Mastercard, American Express and RuPay are accepted. The ₹2 check happens here.
            </Callout>
            <Callout kind="warning" title="Net banking cannot be used" asStep={false}>
              It can pay a bill by hand, but it cannot be used for an automatic payment.
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: `The left panel of this screen carries AWS's own wording on the USD 1 hold, which the previous slide already stated. Source for net banking: ${DOC_PAYMENTS}.`,
  },
  {
    id: 'the-mandate', section: C2, label: 'The mandate',
    element: (
      <ContentSlide
        kicker={C2} title="The Mandate" lesson={SESSION}
        lead={`Your UPI app confirms a mandate on AWS India for up to ${MANDATE_CAP}`}
      >
        <div className="grid w-full max-w-[840px] grid-cols-[1fr_1fr] items-center gap-8">
          {/* Two crops of one phone screen. The real screen puts 500px of empty
              space between the headline and the sentence, and closing that gap
              would be a composite rather than a capture, so each half is its own
              crop and neither is retouched. */}
          <div className="space-y-3">
            <Shot
              src="/shots/upi-01-mandate.png"
              alt="A UPI app confirmation reading Autopay initiated on AWS India up to ₹15000"
              className="mx-auto w-full max-w-[380px]"
            />
            <Shot
              src="/shots/upi-02-mandate-terms.png"
              alt="The note under it, reading Up to ₹15000 will be deducted from your bank account as and when requested by the merchant"
              caption="Your UPI app, after scanning the QR code"
              className="mx-auto w-full max-w-[380px]"
            />
          </div>
          <Callout kind="warning" title="What that sentence means" asStep={false}>
            <span className="font-semibold">Up to</span> ₹15,000 will be deducted <span className="font-semibold">as and when requested</span> by the merchant. Nothing is requested until a bill exists, and on the Free plan there is no bill. The next slide sets out what the mandate can and cannot do.
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes: 'This is the screen that frightens the room, which is why it gets a slide of its own instead of a line. Expect the question out loud: no, AWS has not taken ₹15,000. Let them ask it, then turn the page.',
  },
  {
    id: 'up-to-not-now', section: C2, label: 'Up to, not now',
    element: (
      <StatusPointsSlide
        kicker={C2} title="What The Mandate Does" lesson={SESSION}
        lead={`${MANDATE_CAP} is a ceiling on what AWS may ask for, not an amount it has taken`}
        items={[
          { status: 'success', label: 'Correct', text: 'Nothing is charged while there is no bill', detail: 'On the Free plan, credits cover the usage and no bill is raised' },
          { status: 'info', text: 'Your bank warns you 24 hours before any debit', detail: 'A pre-debit reminder arrives by SMS or email, from the bank and not from AWS' },
          { status: 'warning', label: 'Careful', text: `A bill above ${MANDATE_CAP} is never taken automatically`, detail: 'AWS asks you to pay that one by hand instead' },
          { status: 'success', label: 'Correct', text: 'You can cancel the mandate in two clicks', detail: 'Billing and Cost Management, then Payment preferences, then Disable AutoPay' },
        ]}
      />
    ),
    notes: `Every line here is quoted from AWS's billing documentation, read on 2026-09-28: ${DOC_PAYMENTS}. Two more facts if asked: manual payments are disabled for up to 96 hours while AWS attempts an automatic charge, and a failed charge is retried several times with an email each time. The mandate can also be cancelled from the bank's own e-mandate list, where it appears as Amazon Web Services.`,
  },
  {
    id: 'proving-who-you-are', section: C2, label: 'Proving who you are',
    element: (
      <ContentSlide
        kicker={C2} title="Proving Who You Are" lesson={SESSION}
        lead="Step 4 of 5 is an identity check. In India it asks for a PAN card"
      >
        <div className="grid w-full max-w-[840px] grid-cols-[1fr_1.1fr] items-center gap-8">
          <Shot
            src="/shots/signup-05-identity-pan.png"
            alt="The Confirm your identity screen, step 4 of 5. Primary purpose of account registration set to Academic, Ownership type set to Individual, India document type set to PAN card, then Date of birth, a Name choice, the Permanent Account Number field and an upload for the front of the PAN card. The date of birth, name and PAN number are blurred"
            caption="Confirm your identity, step 4 of 5"
            className="mx-auto w-full max-w-[190px]"
          />
          <div className="space-y-4">
            <Callout kind="tip" title="Academic and Individual" asStep={false}>
              Choose those two at the top. Any other pair asks for company documents you do not have. Upload a photo of the front of the card, under 5 MB.
            </Callout>
            <Callout kind="warning" title="The names must match" asStep={false}>
              The name on the PAN card and the name entered on step 2 have to be the same. This is what most stalled sign-ups turn out to be.
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: 'PAN is Permanent Account Number. The date of birth, name and PAN number on this capture are blurred. This step is specific to India: a sign-up from another country sees a different document, or none.',
  },
  {
    id: 'code-on-your-phone', section: C2, label: 'The code on your phone',
    element: (
      <ContentSlide
        kicker={C2} title="The Verification Code" lesson={SESSION}
        lead="AWS sends an SMS to the number you entered, and you type the four digits back"
      >
        <div className="grid w-full max-w-[840px] grid-cols-2 items-center gap-8">
          <Shot
            src="/shots/signup-08-phone-sms.png"
            alt="The Confirm your identity screen with a country code of India plus 91, a mobile phone number field with the number blurred, and a Send SMS step 4 of 5 button"
            caption="Your country code and number, then Send SMS"
            className="mx-auto w-full max-w-[270px]"
          />
          <Shot
            src="/shots/signup-06-verify-code.png"
            alt="The Verify code field holding a four digit code, with a Continue step 4 of 5 button, and a note that it can take up to 10 minutes to receive a verification code"
            caption="The four digits from the SMS, then Continue"
            className="mx-auto w-full max-w-[270px]"
          />
        </div>
      </ContentSlide>
    ),
    notes: 'The screen itself says a code can take up to 10 minutes. If it has not come by then, go back a page and ask for it again rather than waiting. The number on the left capture is blurred.',
  },
  {
    id: 'setting-up', section: C2, label: 'Setting up',
    element: (
      <ContentSlide
        kicker={C2} title="Setting Up" lesson={SESSION}
        lead="Step 5 of 5 completes on its own, and the account is created"
      >
        <div className="grid w-full max-w-[840px] grid-cols-[1fr_1fr] items-center gap-8">
          <Shot
            src="/shots/signup-07-setting-up.png"
            alt="A progress screen reading Setting up your AWS account, with the note Hang tight, this process takes around 10 seconds to complete"
            caption="The last screen of the sign-up. It moves on by itself"
            className="mx-auto w-full max-w-[380px]"
          />
          <div className="space-y-4">
            <Callout kind="success" title="Ten seconds to the console" asStep={false}>
              The screen says so itself, and it is accurate.
            </Callout>
            <Callout kind="warning" title="Up to 24 hours to full activation" asStep={false}>
              The console opens immediately, and some services stay closed until the card check clears. The next section opens on what that looks like.
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: 'Application movement and the close of the concept: the room watched their own account come into existence. Anyone still filling the form carries on while the rest move to the next section; activation runs in the background either way.',
  },

  /* ═══ C3 · OPENING THE CONSOLE ═══ Merrill ══════════════════════════ */
  {
    id: 'c3-divider', section: C3, label: 'Divider',
    element: <SectionBreakerSlide index={3} title={C3} lesson={SESSION} />,
  },
  {
    id: 'not-finished-yet', section: C3, label: 'Not finished yet',
    element: (
      <ContentSlide
        kicker={C3} title="Not Finished Yet" lesson={SESSION}
        lead="If a service opens this page instead, the account is not active yet"
      >
        <div className="grid w-full max-w-[840px] grid-cols-[1.3fr_1fr] items-center gap-8">
          <Shot
            src="/shots/aws-complete-account-setup.png"
            alt="The Complete your account setup page: a three item checklist about the payment method, email requests and payment verification, a Complete your AWS registration button, and below it a Free account plan access limitations section with an Upgrade plan button"
            caption="What a service shows before the account is active"
            className="mx-auto w-full max-w-[540px]"
          />
          <div className="space-y-4">
            <Callout kind="success" title="Click Complete your AWS registration" asStep={false}>
              It returns you to whatever the sign-up still requires.
            </Callout>
            <Callout kind="error" title="Never click Upgrade plan" asStep={false}>
              That button moves the account off the Free plan and onto one that can bill you.
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: 'Problem movement: the failure comes first, before the success. Activation can take up to 24 hours, and the card hold can take 3 to 5 days to clear. Nothing is wrong; it is waiting. The two buttons sit close together and the wrong one costs money, which is why they are a pair of callouts rather than a line.',
  },
  {
    id: 'skip-for-now', section: C3, label: 'Skip for now',
    element: (
      <ContentSlide
        kicker={C3} title="Keep It Secure" lesson={SESSION}
        lead="AWS offers to add a second login check. Choose Skip for now"
      >
        <div className="grid grid-cols-[1.15fr_1fr] items-center gap-10">
          <Shot
            src="/shots/console-01-mfa-skip.png"
            alt="The Keep your account secure page. A red warning reads Registering your MFA for root credentials will be required in 35 days. Below it an MFA device name field and three choices: Passkey or Security key, Authenticator app, and Hardware TOTP Token. At the bottom, a Skip for now button beside Next"
            caption="Keep your account secure. Skip for now is the button at the bottom"
            highlight={{ left: 58, top: 93, width: 26, height: 5 }}
            className="mx-auto w-full max-w-[282px]"
          />
          <div className="space-y-4">
            <Callout kind="note" title="MFA is multi-factor authentication" asStep={false}>
              A second check in addition to your password, usually a code from your phone. Nothing in this module requires it.
            </Callout>
            <Callout kind="warning" title={`AWS requires it within ${MFA_DEADLINE}`} asStep={false}>
              The screen states the deadline. After it passes, the console asks for MFA before it will open, and you can add it then from the account menu.
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: `Instruction of 2026-09-28: do not teach MFA setup, let the room skip it. The ${MFA_DEADLINE} deadline is on the screenshot, so the slide states it rather than letting it ambush them in a month. AWS enforces this on root users across all account types.`,
  },
  {
    id: 'root-or-iam', section: C3, label: 'Root or IAM',
    element: (
      <StatusPointsSlide
        kicker={C3} title="Root Or IAM" lesson={SESSION}
        lead="The sign-in page asks which kind of user you are, and today you are the root user"
        items={[
          { status: 'success', label: 'You', text: 'Root user, and this is you', detail: 'The account owner, signing in with the email the account was created with' },
          { status: 'info', label: 'Not you', text: 'IAM user, and this is not you', detail: 'A login created inside somebody else\'s account, for a team. You have not made one' },
        ]}
      />
    ),
    notes: 'IAM is Identity and Access Management. It is named and not opened (hard rule 4): creating IAM users belongs to a later session, and a beginner who makes one now locks themselves out of their own billing page.',
  },
  {
    id: 'sign-in', section: C3, label: 'Sign in',
    element: (
      <ContentSlide
        kicker={C3} title="Sign In" lesson={SESSION}
        lead="Choose Root user, give the email you registered, then your password"
      >
        <Shot
          src="/shots/aws-signin-root.png"
          alt="The AWS Sign In page: a User type chooser with Root user selected and IAM user below it, an empty Email address field, and the Next button"
          caption="signin.aws.amazon.com. Root user, your email, then Next"
          className="mx-auto w-full max-w-[600px]"
        />
      </ContentSlide>
    ),
    notes: 'The password comes on the screen after Next, which is why it is not in this capture. If the password is refused, use Forgot password rather than a second sign-up: a second account starts the whole form again and splits the credit.',
  },
  {
    id: 'your-console', section: C3, label: 'Your console',
    element: (
      <ContentSlide
        kicker={C3} title="Your Console" lesson={SESSION}
        lead="The console home opens, and this is the page everything else starts from"
      >
        <Shot
          src="/shots/aws-console-home.png"
          alt="The AWS Console home, showing a Recently visited panel, a Welcome to AWS panel, an AWS Health panel, and a Cost and usage panel"
          caption="Console home. The search box at the top opens any service by name"
          className="mx-auto w-full max-w-[620px]"
        />
      </ContentSlide>
    ),
    notes: 'The close of the concept, and the room should be looking at their own screen rather than this one. Ask for a show of hands. The name in the top right is the account name chosen on the first sign-up screen, and beside it sits the Region, which a later session covers.',
  },
  {
    id: 'c3-recap', section: C3, label: 'Recap',
    element: (
      <RecapSlide
        kicker={C3} title={C3} lesson={SESSION}
        points={[
          { text: 'A page asking you to complete setup means the account is still activating', sub: 'Complete your AWS registration, and never Upgrade plan' },
          { text: 'The second login check can wait', sub: `Skip for now, and add it within ${MFA_DEADLINE}` },
          { text: 'You sign in as the root user', sub: 'With the email the account was created with' },
          { text: 'The console home is where every service starts', sub: 'Found by name, in the search box at the top' },
        ]}
      />
    ),
  },

  /* ═══ C4 · WATCHING THE MONEY ═══ STAR ══════════════════════════════ */
  {
    id: 'c4-divider', section: C4, label: 'Divider',
    element: <SectionBreakerSlide index={4} title={C4} lesson={SESSION} />,
  },
  {
    id: 'the-meter-runs', section: C4, label: 'The meter runs',
    element: (
      <ContentSlide
        kicker={C4} title="Your Credit" lesson={SESSION}
        lead={`The console shows ${CREDIT_IN_CONSOLE} of credit, and ${FREE_DAYS} left`}
      >
        <div className="grid w-full max-w-[840px] grid-cols-[1fr_1fr] items-center gap-8">
          <Shot
            src="/shots/aws-free-plan-status.png"
            alt="The Free plan status panel: Credits remaining $100.00 USD, Days remaining 182 days, and a note that free access ends on Mar 15 2027 or when the credits are used"
            caption="Account menu, top right, then Free plan status"
            className="mx-auto w-full max-w-[400px]"
          />
          <Shot
            src="/shots/aws-cost-and-usage-credits.png"
            alt="The Cost and usage widget on the console home: Credits remaining US$100.00 USD and Days remaining 182 days, ending Mar 15 2027"
            caption="Console home, Cost and usage. The same two figures"
            className="mx-auto w-full max-w-[460px]"
          />
        </div>
      </ContentSlide>
    ),
    notes: `Situation, movement 1 of 2. Two panels show the same number so nobody has to hunt for it. ${CREDIT_IN_CONSOLE} is ${CREDIT_INR}. Billing then Credits is a different page that lists redeemable credits and reads USD 0.00 on a Free plan account, so do not send the room there.`,
  },
  {
    id: 'it-counts-down', section: C4, label: 'It counts down',
    element: (
      <StatusPointsSlide
        kicker={C4} title="It Counts Down" lesson={SESSION}
        lead="Two clocks run on the account, and only one of them waits for you"
        items={[
          { status: 'warning', label: 'Careful', text: `The ${FREE_DAYS} fall every day`, detail: 'Whether or not anything is running, and whether or not you sign in' },
          { status: 'info', text: `The ${CREDIT_IN_CONSOLE} falls only when something runs`, detail: 'An idle account spends nothing' },
          { status: 'error', label: 'Wrong', text: 'Neither one tells you it has started', detail: 'There is no message, and no email, until you ask for one' },
        ]}
      />
    ),
    notes: 'Situation, movement 2, and the break. The last row is the whole argument: the account is perfectly capable of spending money quietly. Delete this slide and the budget on slide 40 reads as a rule rather than an answer.',
  },
  {
    id: 'left-running', section: C4, label: 'Left running',
    element: (
      <StatusPointsSlide
        kicker={C4} title="Left Running" lesson={SESSION}
        lead="Three real bills, and nothing failed in any of them"
        items={[
          { status: 'error', label: 'Real bill', text: 'USD 200, after a laptop went for repair', detail: 'Machines, a database and a load balancer kept running for 10 days with nobody watching' },
          { status: 'error', label: 'Real bill', text: 'USD 39, after a test was forgotten', detail: 'A database left switched on after the experiment it was for had finished' },
          { status: 'warning', label: 'Careful', text: 'USD 18 a month, for one load balancer', detail: 'It was never part of the free usage, and it charges by the hour it exists' },
        ]}
      />
    ),
    notes: 'Real cases, researched 2026-09-28. Say the shape out loud: nothing broke, something was left running, and nobody was told. If a bill does arrive, open a support case under Account and Billing; that support is free on every plan, and AWS often grants a one-time courtesy credit to a learner who says what happened, confirms the resources are terminated and says a budget is now set. Never promise the room a refund. NOT ON A SLIDE, and only if asked: leaked access keys committed to a public repository are found by scanners in about four minutes and have produced bills from USD 6,000 to USD 89,000 overnight. That needs IAM and access keys, which this module never opens.',
  },
  {
    id: 'alarm-not-brake', section: C4, label: 'An alarm, not a brake',
    element: (
      <ContentNoteSlide
        kicker={C4} title="An Alarm" lesson={SESSION}
        lead="What is needed is something that tells you the moment the first cent is spent"
        points={[
          { text: 'A budget watches the account and emails you', sub: 'You choose the amount that triggers it', icon: 'bolt' },
          { text: 'Zero spend means it triggers at the first cent', sub: 'Not at the first large bill, which is far too late', icon: 'target' },
        ]}
        note={{
          kind: 'warning', title: 'A budget does not stop anything',
          body: 'It sends an email. Whatever is running keeps running until you go and stop it yourself, so the email is the signal to act rather than the fix.',
        }}
        noteFirst={false}
      />
    ),
    notes: 'Task movement, and it carries no clicks on purpose: the capability is named in plain words before the screens arrive. The distinction between an alarm and a brake is the one thing to make sure lands, because a learner who thinks the budget protects them stops watching.',
  },
  {
    id: 'billing-home', section: C4, label: 'Billing home',
    element: (
      <ContentSlide
        kicker={C4} title="Billing Home" lesson={SESSION}
        lead="Budgets live inside Billing and Cost Management, off the account menu"
      >
        <Shot
          src="/shots/bill-01-billing-home.png"
          alt="The Billing and Cost Management home page, with its navigation pane on the left listing Budgets among the billing pages"
          caption="Account menu, top right, then Billing and Cost Management, then Budgets"
          className="mx-auto w-full max-w-[620px]"
        />
      </ContentSlide>
    ),
    notes: 'Action, movement 1 of 2. The page is empty at this point, which is the honest starting state: nothing has been created yet. Do this together and wait for the room to arrive before the next slide.',
  },
  {
    id: 'zero-spend-budget', section: C4, label: 'Zero spend budget',
    element: (
      <ContentSlide
        kicker={C4} title="Zero Spend Budget" lesson={SESSION}
        lead="Create budget, then the Zero spend template, then your own email"
      >
        <div className="grid w-full max-w-[840px] grid-cols-[1.3fr_1fr] items-center gap-8">
          <Shot
            src="/shots/bill-02-zero-spend-template.png"
            alt="The Create budget page with Use a template, simplified, selected, the Zero spend budget template chosen beneath it, and Budget name and Email recipients fields below that"
            caption="Budgets, Create budget. Use a template, Zero spend budget, then name and email"
            className="mx-auto w-full max-w-[540px]"
          />
          <div className="space-y-4">
            <Callout kind="tip" title="Use a template" asStep={false}>
              Choose the simplified option. The custom one asks for figures you have no reason to decide yet.
            </Callout>
            <Callout kind="success" title="Your own email" asStep={false}>
              Use the address the account was created with.
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
    notes: 'Action, movement 2. The template sets the threshold to USD 0.01 for you, which is what makes it fire on the first cent rather than the first bill. CAPTURE STILL MISSING (plan D10): the confirmation screen after Create budget. Until it exists this concept closes on its recap instead of on something run, which is the one gap in the module.',
  },
  {
    id: 'c4-recap', section: C4, label: 'Recap',
    element: (
      <RecapSlide
        kicker={C4} title={C4} lesson={SESSION}
        points={[
          { text: `${CREDIT_IN_CONSOLE} and ${FREE_DAYS}, in two places in the console`, sub: 'Free plan status, and the Cost and usage panel' },
          { text: 'The days count down whether or not anything runs', sub: 'And nothing tells you when spending starts' },
          { text: 'Real bills come from things left running, not from things breaking', sub: 'USD 200 from ten unwatched days' },
          { text: 'A zero spend budget emails you at the first cent', sub: 'It warns you, and it does not stop anything' },
        ]}
      />
    ),
  },

  /* ═══ CLOSING ═══════════════════════════════════════════════════════ */
  {
    id: 'key-takeaways', section: 'Closing', label: 'Key takeaways',
    element: (
      <KeyTakeawaysSlide
        title="Key Takeaways" lesson={SESSION}
        points={[
          { text: C1, sub: 'An AWS account is the login that owns what you rent, and the root user is you' },
          { text: C2, sub: 'Five steps: password, plan, details, payment, identity. Choose the Free plan' },
          { text: C3, sub: 'Sign in as the root user, skip the second check for now, and land on the console home' },
          { text: C4, sub: `${CREDIT_IN_CONSOLE} for ${FREE_DAYS}, and a zero spend budget that emails you at the first cent` },
        ]}
      />
    ),
  },
  {
    id: 'thank-you', section: 'Closing', label: 'Thank you',
    element: <ThankYouSlide lesson={SESSION} />,
  },
]
