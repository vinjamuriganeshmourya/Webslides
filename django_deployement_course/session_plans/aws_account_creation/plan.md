<!-- cSpell:ignore deployement NxtWave colour Hyderabad AutoPay UPI KYC TOTP FIDO2 signin devPort -->
# AWS Account Creation — a standalone module

**STATUS: SIGNED OFF 2026-09-28.** Instruction: "start ppt". D4 settled (MFA shown,
skipped). D2 resolved by blurring the five PII captures in place. D1, D3, D6, D7, D8,
D9 taken at the recommendation. D10 remains open: the budget-created capture does not
exist, so concept 4 closes on its recap until that screenshot is taken.

The original gate text: no slide is generated until this file
says SIGNED OFF. Decisions to settle are in §7.

## 0. What this module is, in one line

A learner with no AWS account arrives, and leaves with an activated account,
a console they can sign in to, and an alarm that emails them at the first cent
of spend.

It is a **module, not a session**: it teaches one procedure end to end and
nothing else. Any course that needs its learners to have an AWS account plays
this module before its own first AWS session. Deployment session 9 currently
carries an eight-slide version of this inside its opening block; if this module
ships, those eight slides come out of session 9 and session 9 opens on
`Where We Left Off` instead (§8).

## 1. Inputs

| | |
|---|---|
| Captures | 23 real screens, all taken on the user's own account on 2026-09-15 and 2026-09-16. Full inventory, with what each proves and what must be redacted, in §4 |
| Carried from | `deployement_session_9/src/decks/awsIntroDeck.tsx`, the account block (slides `account-first` to `account-budget-alert`) and its `notes`. The wording there has already been through a review pass and is reused where it fits |
| Not from a TR | This module has no TR. The procedure is what the captures show, in the order they were taken. Nothing in it is written from memory of the AWS docs |
| Audience | Absolute beginners, in India, many reading English as a second language. Most have never entered card details on a foreign site and most have never heard the words *root user* |
| Module app | `django_deployement_course/aws_account_creation/`, `devPort` **5221** (5220 is session 9, 5219 is session 8), `htmlName` `aws-account-creation` |
| Deck file | `src/decks/awsAccountDeck.tsx` |

## 2. The beginner rules this module runs on

Carried from session 9 plan §2, because the audience is the same.

1. **One new word per slide.** Root user, IAM user, MFA, PAN, credits and
   budget each get a slide. No slide teaches two nouns.
2. **Every acronym is expanded once, in the lead, on the slide that owns it.**
   AWS is Amazon Web Services. IAM is Identity and Access Management. MFA is
   multi-factor authentication. PAN is Permanent Account Number. UPI is Unified
   Payments Interface.
3. **Question, then answer.** Each concept opens with a question the room can
   attempt.
4. **Every concept closes with one line per idea**, in the words its divider used.
5. **Anchor every new idea to something the room already owns.** The UPI mandate
   on their phone. The OTP they already type a dozen times a week. The PAN card
   in their wallet.

Plus one rule this module needs and session 9 did not:

6. **Money is stated before it is spent.** Every screen that asks for a payment
   detail is preceded by a slide that says, in rupees, what leaves the account
   and when it comes back. A beginner who is surprised by a charge stops
   following the module.

## 3. Concept map — four concepts, one divider each

| # | Concept (agenda) | Framework | Why that framework | Slides |
|---|---|---|---|---|
| 1 | `Before You Sign Up` | **4MAT** | A definition concept. What an AWS account *is*, and what the root user is, with nothing to run yet. A *Why* slide sits before the *What* slide | 7 |
| 2 | `The Sign-Up Form` | **Merrill** | A skill the learner performs on their own laptop, not one they watch. The Application movement is the room filling in the form | 15 |
| 3 | `Opening the Console` | **Merrill** | Same: the learner signs in themselves, and the close is their own console home on screen | 7 |
| 4 | `Watching the Money` | **STAR** | A mechanism with a Result that is run: the budget is created and the confirmation is on screen (D10) | 8 |

Key Takeaways restates these four names verbatim (rule 20).

**The invariant, checked per concept** (each opens on a felt need, closes on
something observable):

| # | Opens on | Closes on |
|---|---|---|
| 1 | You cannot rent a computer without an account, and you have none | You can say what the root user is, and what the six months give you |
| 2 | The form asks for a card, and nobody told you why | The account setup spinner, on your own screen |
| 3 | The account exists and you still cannot see anything | Your console home, in your Region, with your credit showing |
| 4 | Nothing is running and the credit still counts down | The zero-spend budget exists and has emailed nobody yet |

## 4. Capture inventory — what we have, and what has to be fixed first

23 screens. Every one is real. **Six of them carry personal data and cannot
ship as they are.** The remediation column is the work that has to happen
before generation, not after.

### 4a. Ready to use

| # | File | Screen it proves | Concept |
|---|---|---|---|
| 1 | `11-10-58` | IAM user sign in, with `Create a new AWS account` | 2 |
| 2 | `11-17-47` | **Choose your account plan**, Free (6 months) vs Paid, inside the sign-up | 2 |
| 3 | `11-18-56` | Contact Information, step 2 of 5, empty form | 2 |
| 4 | `11-24-49` | Confirm your identity, the 4-digit verify code | 2 |
| 5 | `11-25-02` | `Setting up your AWS account`, the spinner | 2 |
| 6 | `11-30-41` | **Keep your account secure**: MFA required in 35 days, three MFA kinds | 3 |
| 7 | `aws-signup.png` | The first sign-up screen: email and account name | 2 |
| 8 | `aws-complete-account-setup.png` | `Complete your account setup`, the not-yet-active state | 3 |
| 9 | `aws-console-home.png` | Console home | 3 |
| 10 | `aws-free-plan-status.png` | Free plan status: USD 100, 182 days (already cropped) | 4 |
| 11 | `aws-cost-and-usage-credits.png` | Cost and usage widget, the same two figures | 4 |
| 12 | `bill-01-billing-home.png` | Billing and Cost Management home | 4 |
| 13 | `bill-02-zero-spend-template.png` | Create budget, Zero spend template | 4 |
| 14 | `aws-free-vs-paid-plan.png` | The public Free Tier compare-plans table | — (see D3) |
| 24 | `Image from Gboard Clipboard.jpeg` | **The UPI AutoPay mandate on the phone**: `Autopay initiated on AWS India up to ₹15000`, and `Up to ₹15000 will be deducted ... as and when requested by the merchant` | 2 |

### 4b. Must be redacted before they can be used

| # | File | What leaks | Remediation |
|---|---|---|---|
| 15 | `11-17-37` | **The root user password, in plaintext**, in both fields, `Show password` ticked | **Do not ship, in any form.** Rotate the password on the account, then delete the file. A re-capture with the fields empty replaces it |
| 16 | `11-24-13` | PAN number, date of birth, full name | Re-capture with the fields empty, or blur all three. The screen is too valuable to drop: it is the only India KYC capture we have |
| 17 | `11-18-47` | Full name, phone number | Blur both. Kept because it is the only capture of the `An address is required` validation error |
| 18 | `15-09-52` | Mobile phone number | Blur the number. Keep: it is the only SMS verification capture |
| 19 | `11-20-14` | Street address, city, postcode | Blur the three address lines under `Use contact address` |
| 20 | `15-10-36` | Account ID `1722-7758-4035` | Duplicate of #21; drop one of the two |
| 21 | `aws-free-plan-status-full.png` | Same Account ID, already in `public/shots/` | Crop out the Account ID row, or use the already-cropped #10 instead |
| 22 | `11-11-16` | `"Claude" started debugging this browser` banner | Crop the top 50 px. This is the source of the shipped `aws-signin-root.png` (#23), which is already cropped and clean |
| 23 | `aws-signin-root.png` | nothing | ready; listed here only to record its origin |
| 24 | `Image from Gboard Clipboard.jpeg` | a truncated UPI transaction ID, and the phone's own status bar | Crop to the card. Low risk, but the transaction ID is not teaching anything |

**Redaction is a blur or a crop, never a retouch.** Hard rule 11 and memory
item 8: never edit the text in a capture. A blurred field still shows the room
that a field is there and that something goes in it.

### 4c. What the captures changed about what we thought

Worth recording, because session 9 says otherwise on a slide today:

- **The plan chooser now sits at step 1**, immediately after the password, not
  after payment and phone verification. The timestamps prove it: password
  `11:17:37`, plan chooser `11:17:47`, contact information `11:18:47`.
  Session 9's `choose-free-plan` note is out of date and is corrected by D3.
- **The in-signup plan card says "up to $200 in credits"**, where the console
  afterwards shows USD 100. The difference is USD 100 granted plus USD 100
  earnable by completing activities, which the Contact Information screen
  states in its left panel. The module says both numbers and where each comes
  from. Session 9 only ever says USD 100.
- **India gets its own KYC step**: purpose of registration, ownership type, PAN
  card, date of birth and a PAN card upload. No existing deck covers it.
- **UPI AutoPay is offered before the card**, with a ₹15,000 automatic payment
  limit and a ₹2 refundable verification charge. Session 9 says "Card or UPI"
  in one line of a `StepList` and shows neither.
- **MFA is required within 35 days** of creating the account. No existing deck
  mentions MFA at all.

### 4d. How the money actually leaves the account

Read off the AWS documentation on 2026-09-28, not from memory. This is the
section the room will ask about out loud, because their phone has just told
them ₹15,000. Every figure below carries its source, and the slides that print
one link to it (session 9's rule: a source printed on a slide carries its link).

**The ₹15,000 is a ceiling, not an amount.** The UPI app says "up to ₹15000
will be deducted as and when requested by the merchant". Nothing is requested
until a bill exists, and on the Free plan no bill exists.

| Fact | The documentation's own words |
|---|---|
| The limit | "You can only use e-mandates for charges up to INR 15,000" |
| What happens above it | "You are required to make manual payments to bills that exceed INR 15,000" |
| When it charges | "Your future AWS bills up to INR 15,000 are automatically charged ... each month, starting with the next billing cycle" |
| **Warning before the charge** | "you receive a pre-debit reminder 24 hours prior to the charge through SMS or email from your bank" |
| While it charges | "Manual payments are temporarily disabled up to 96 hours while AWS attempts to charge your card automatically" |
| If it fails | "We will attempt to charge your card several times, and you will receive an email alert with each attempt" |
| The ₹2 | "you will be ... charged 2 Indian rupee (INR). This charge will be refunded back to your card within 5-7 business days" |
| The USD 1 | AWS's own sign-up screen, capture #19: "Our verification process holds USD $1 (or equivalent) for 3-5 days to verify your account and prevent fraud" |
| Cancelling it | Billing console → **Payment preferences** → **Disable AutoPay**. Or through the bank's own portal: find **Amazon Web Services** in the active e-mandate list and choose **Cancel** |
| UPI approval window | "You must approve the transaction within 10 minutes, or the request will expire" |
| Net banking | "You can't use net banking for automatic payments" |

Source: [Managing your payments in India](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/edit-aispl-payment-method.html),
AWS Billing user guide. Background on the feature:
[AWS India customers can now use UPI to sign-up and automate monthly payments](https://aws.amazon.com/about-aws/whats-new/2025/11/india-upi-sign-up-automate-monthly-payments/).

**The one sentence the module has to land:** the mandate gives AWS permission
to ask for up to ₹15,000, your bank warns you 24 hours before it ever takes
anything, and you can cancel the mandate from the console in two clicks.

### 4e. What goes wrong, in real numbers

Researched 2026-09-28. These exist so concept 4 opens on a felt need rather
than on a rule. **Only the first group goes on a slide**: it is what happens to
a learner on a Free plan account. The second group is instructor `notes` only,
because it needs IAM and access keys, which this module never opens (rule 4:
name a later problem, never open it).

#### On a slide: this is what happens to a learner

| What happened | Cost |
|---|---|
| A learner's laptop went for repair mid-project. EC2 instances, an RDS database and a load balancer kept running for 10 days, unwatched | **USD 200** |
| A learner forgot to stop the services they were testing, mostly RDS | **USD 39** |
| A load balancer, which the Free Tier never covered, left running for a month | **about USD 18 a month, on its own** |

The shape is the same every time, and it is the whole argument for the budget:
**nothing failed. Something was left running, and nobody was told.** A zero
spend budget is the thing that would have sent the email on day one instead of
day thirty.

**If it happens anyway** (instructor notes, and one line on the slide): open a
support case under **Account and Billing** in the AWS Support Center. Billing
support is free on every plan. AWS is not obliged to refund, and frequently
does grant a one-time courtesy credit to a student who says plainly what they
were learning, confirms the resources are now terminated, and says they have
since set a budget. Never promise the room a refund; say it is worth asking.

#### Instructor notes only: not on a slide

Leaked access keys committed to a public repository are found by automated
scanners in about 4 minutes, and the bills run from USD 6,000 to USD 89,000
overnight as the keys are used to launch GPU instances for crypto mining. This
is real and it is the reason the later sessions are strict about keys. **It
does not go on a slide in this module**, because this module never creates an
access key and never opens IAM. Naming a problem the room cannot yet act on
just frightens them.

Sources:
[AWS Free Tier bill shock](https://www.lastweekinaws.com/blog/an-aws-free-tier-bill-shock-your-next-steps/) ·
[a USD 200 Free Tier mistake](https://dev.to/arbythecoder/my-200-aws-mistake-how-i-learned-the-hard-way-that-free-tier-isnt-actually-free-ebg) ·
[unexpected charges and a refund](https://dev.to/duongminhhieu/my-experience-with-unexpected-aws-charges-and-how-i-got-a-refund-1n7b) ·
[AWS re:Post, waiving charges for a student account](https://repost.aws/questions/QUUFyjl-2zT5G2w2Sny2SjGQ/request-for-refund-due-to-unintentional-charges-student-account)

### 4f. MFA: shown, skipped, and dated

**Instruction, 2026-09-28: do not teach MFA setup. The learner clicks
`Skip for now`.** So the screen is on a slide, because they will see it and a
beginner who meets an undocumented screen stops, but the action taught is to
skip it. D4 is settled by this instruction and is recorded here rather than
left open.

One fact goes on the slide with it, because it is dated and it will bite:
**AWS requires MFA to be registered within 35 days of the first console
sign-in**, across all account types, or the console locks. The screenshot says
so itself, so the slide is not adding anything the room will not read. The
module says: skip it today, and it can be added later from the account menu.

Sources:
[AWS IAM now enforces MFA for root users across all account types](https://aws.amazon.com/about-aws/whats-new/2025/06/aws-iam-mfa-root-users-across-all-account-types/) ·
[Multi-factor authentication for the AWS account root user](https://docs.aws.amazon.com/IAM/latest/UserGuide/enable-mfa-for-root.html)

## 5. Slide-wise plan

35 content slides, 8 chrome, **43 total**.

### Opening (4)

| # | Slide | Type | Carries |
|---|---|---|---|
| 1 | Brand | `BrandSlide` | — |
| 2 | AWS Account Creation | `WelcomeSlide` | module name |
| 3 | What You Need Ready | `ContentNoteSlide` | email, phone, a card or UPI app, PAN card, 20 minutes. A note: nobody collects any of this, you enter it on your own device |
| 4 | Agenda | `AgendaSlide` | the four concept names, kicker is the module name |

### Concept 1 — `Before You Sign Up` (4MAT, 7)

| # | Slide | Movement | Type | Carries |
|---|---|---|---|---|
| 5 | Divider | — | `SectionBreakerSlide` | |
| 6 | Renting a Computer | Why | `ContentSlide` + `Illustration` | The routine: your laptop runs the app, and it is off when you close it |
| 7 | What That Costs | Why | `StatusPointsSlide` | It cannot stay on, it cannot be reached from outside, it cannot grow. The break |
| 8 | An AWS Account | What | `ContentSlide` | AWS is Amazon Web Services. An account is the login that owns everything you rent, and the bill |
| 9 | The Root User | How | `ContentSlide` + `Shot` #1 | The email you sign up with becomes the root user, the account owner. IAM user is named here and not opened (rule 4) |
| 10 | Six Months Free | What if | `ContentSlide` + `StatTile` | USD 100 on day one, up to USD 100 more by completing activities, 182 days. From #2 and #10 |
| 11 | Recap | — | `RecapSlide` | one line per idea above |

### Concept 2 — `The Sign-Up Form` (Merrill, 15)

Five steps, and AWS numbers them `step N of 5` on every button. The slides
follow that numbering exactly, so the room can always say which step they are on.

| # | Slide | Movement | Type | Carries |
|---|---|---|---|---|
| 12 | Divider | — | `SectionBreakerSlide` | |
| 13 | Where To Start | Problem | `ContentSlide` + `Shot` #1 | `signin.aws.amazon.com` → `Create a new AWS account` |
| 14 | Your Email | Demonstration | `ContentSlide` + `AnnotatedShot` #7 | Step 0: root user email, account name. The email becomes the login |
| 15 | Your Password | Demonstration | `ContentSlide` | **Step 1 of 5.** No capture (D1). Rules only: the room types it, nobody shows it |
| 16 | Free Plan or Paid | Demonstration | `ContentSlide` + `AnnotatedShot` #2 | The chooser, at step 1. Free: up to $200 in credits, account closes at 6 months unless upgraded. Paid: scales past the credit |
| 17 | Choose Free Plan | Application | `Callout` + `AnnotatedShot` #2 | The verdict with its reason: `Choose free plan`. Nothing is billed unless you click upgrade |
| 18 | Your Details | Demonstration | `ContentSlide` + `Shot` #3 | **Step 2 of 5.** Contact Information, empty. Personal, not Business. Name must match the bank records |
| 19 | An Address Is Required | Demonstration | `ContentSlide` + `AnnotatedShot` #17 | The validation error, and that the address field is a search box |
| 20 | Why A Card | Activation | `ContentNoteSlide` | Rule 6: the money slide comes *before* the money screen. USD 1 held 3 to 5 days, returned. ₹2 for a card, refunded in 5 to 7 business days. No bill on the Free plan |
| 21 | Card or UPI | Demonstration | `ContentSlide` + `AnnotatedShot` #19 | **Step 3 of 5.** Billing Information. UPI AutoPay, or a credit or debit card. Net banking cannot be used for automatic payments |
| 22 | The Mandate | Demonstration | `ContentSlide` + `Shot` #24 | The phone screen: `Autopay initiated on AWS India up to ₹15000`. This is the screen that frightens the room, so it gets its own slide |
| 23 | Up To, Not Now | Activation | `StatusPointsSlide` | §4d, the four facts that matter: ₹15,000 is a ceiling not a charge; nothing is charged with no bill; the bank warns 24 hours before any debit; Billing → Payment preferences → Disable AutoPay cancels it. Sources linked |
| 24 | Proving Who You Are | Demonstration | `ContentSlide` + `AnnotatedShot` #16 | **Step 4 of 5.** India only: purpose, ownership type, PAN card, date of birth, PAN upload. Name must match the PAN |
| 25 | The Code On Your Phone | Demonstration | `ContentSlide` + `Shot` #18, #4 | SMS to the number you gave, then the 4-digit verify code. Up to 10 minutes |
| 26 | Setting Up | Application | `ContentSlide` + `Shot` #5 | **Step 5 of 5.** The spinner. About 10 seconds to the screen, up to 24 hours to full activation |

Concept 2 has no `RecapSlide` of its own: slide 26 is the Application close and
the five steps are recapped on the Key Takeaways. If the user prefers the
per-concept recap of rule 4, it is one more slide (D9).

### Concept 3 — `Opening the Console` (Merrill, 7)

| # | Slide | Movement | Type | Carries |
|---|---|---|---|---|
| 27 | Divider | — | `SectionBreakerSlide` | |
| 28 | Not Finished Yet | Problem | `ContentSlide` + `AnnotatedShot` #8 | The failure first: EC2 opens `Complete your account setup`. Click `Complete your AWS registration`, never `Upgrade plan` |
| 29 | Skip For Now | Demonstration | `ContentSlide` + `AnnotatedShot` #6 | §4f. The screen appears, and the action is `Skip for now`. MFA is multi-factor authentication, it can be added later, and AWS requires it within 35 days of the first sign-in |
| 30 | Root or IAM | Demonstration | `ContentSlide` + `AnnotatedShot` #23 | Root user is the account owner. IAM is Identity and Access Management, a user inside the account, not used in this module |
| 31 | Sign In | Application | `ContentSlide` + `AnnotatedShot` #23 | Root user → your email → Next → password |
| 32 | Your Console | Application | `ContentSlide` + `Shot` #9 | Console home. Top right: the Region. This is the close: the room's own screen |
| 33 | Recap | — | `RecapSlide` | one line per idea |

### Concept 4 — `Watching the Money` (STAR, 8)

| # | Slide | Movement | Type | Carries |
|---|---|---|---|---|
| 34 | Divider | — | `SectionBreakerSlide` | |
| 35 | The Meter Runs | Situation | `ContentSlide` + `Shot` #10 | The routine: USD 100, 182 days, on the Free plan status panel |
| 36 | It Counts Down Anyway | Situation | `ContentSlide` + `Shot` #11 | The break: the 182 days fall whether or not anything runs. Two panels, one number |
| 37 | Left Running | Situation | `StatusPointsSlide` | §4e, the three real cases, in money. A laptop went for repair: USD 200. Services left on after testing: USD 39. A load balancer alone: about USD 18 a month. Nothing failed in any of them |
| 38 | An Alarm, Not A Brake | Task | `ContentNoteSlide` | Named in plain words: we need to be told at the first cent. A budget emails, it does not stop spending. Note: if a bill does arrive, a free Account and Billing support case is the thing to open |
| 39 | Billing Home | Action | `ContentSlide` + `AnnotatedShot` #12 | Account menu → Billing and Cost Management → Budgets |
| 40 | Zero Spend Budget | Action | `ContentSlide` + `AnnotatedShot` #13 | Use a template → Zero spend budget → name and email |
| 41 | Recap | — | `RecapSlide` | one line per idea |

**Concept 4 has no Result capture yet.** STAR closes on something run, and the
created-budget confirmation screen is not in the inventory. Either it is
captured before generation, or slide 41 is a `RecapSlide` standing in for a
Result, which is exactly the fake Result the pedagogy guidelines warn about.
This is D10, and it is the one gap in the module.

### Closing (2)

| # | Slide | Type |
|---|---|---|
| 42 | Key Takeaways | `KeyTakeawaysSlide`, the four concept names verbatim |
| 43 | Thank You | `ThankYouSlide` |

**Rule 25 check, nothing arrives assembled:** the console home (#32) is the
last screen of concept 3, never the first. The budget (#40) is built from the
empty Budgets page (#39) before it. The sign-up form is walked one screen per
slide, in AWS's own step order.

**Rule 24 check, the term ledger.** Each term is used only at or after the
slide that owns it:

| Term | Introduced on | Used after |
|---|---|---|
| AWS | 8 | everywhere |
| account | 8 | everywhere |
| root user | 9 | 14, 30, 31 |
| IAM user | 30 | nowhere else (named at 9, not opened) |
| credits | 10 | 16, 35, 36 |
| Free plan | 16 | 17, 28, 35 |
| UPI AutoPay | 21 | 22, 23 |
| e-mandate | 23 | — |
| PAN | 24 | — |
| MFA | 29 | — |
| Region | 32 | — |
| budget | 38 | 39, 40 |

**Rule 4 check, a later problem is named and never opened:** IAM at slide 9,
access keys nowhere. The crypto-mining incidents of §4e stay in the notes.

## 6. What this module does not cover

Said plainly so nobody expects it: no EC2, no VPC, no Regions beyond reading
the selector, no IAM users or roles, no cost breakdown by service, no closing
an account. Deployment session 9 picks up at the console home.

## 7. Decisions to confirm at sign-off

| # | Decision | Recommendation | Why |
|---|---|---|---|
| D1 | The password screen (#15) has no usable capture | **Ship the slide with no screenshot**, as rules and a `Callout` | Rule 30 wants a capture for every process, and this is the one place it must yield: the only capture of that screen shows a live password. A re-capture needs a fresh sign-up, which we cannot do on an existing account |
| D2 | Blur or re-capture for the five PII screens (#16 to #19, #21) | **Blur**, this week | A re-capture needs a second AWS sign-up with a second phone, email and PAN. Blur is honest, is what rule 11 allows, and costs an hour |
| D3 | Two plan comparisons exist: the in-signup chooser (#2) and the public compare-plans page (#14) | **Use the in-signup chooser, drop the public page** | It is the screen the learner is actually looking at, at the moment they must choose. The public page is a different page reached a different way, and putting it on the plan slide is the kind of near-miss that leaves a beginner hunting |
| D4 | Does the module teach MFA? | **Settled 2026-09-28: no.** The screen is shown, the action is `Skip for now`, and the 35-day deadline is stated as a fact | Your instruction. One slide (#29) instead of two, and no authenticator-app detour in a beginner module. §4f records it |
| D5 | Does session 9 lose its account block? | **Yes, once this ships** | Eight slides of session 9 duplicate concepts 2 to 4 here. Keeping both means two versions of the same procedure drifting apart. This is a separate change to session 9, on its own branch, after this module is signed off |
| D6 | Length | **42 slides** | The procedure is 23 real screens. Compressing it is what produced session 9's four-step `StepList`, which shows a beginner none of the screens they will actually see |
| D7 | Quiz frames | **None** | Sessions 8 and 9 both ran without them, on instruction. Recorded here per module, not as a course rule |
| D8 | The two credit figures, USD 100 and up to $200 | **Print both, and say where each comes from** | The room will see $200 on the signup card and $100 in the console ten minutes later. Not explaining that gap is how a learner concludes the module is wrong |
| D9 | Concept 2 has no recap of its own | **Leave it out** | Its Application close (#26) and the Key Takeaways already carry the five steps, and a fifteen-slide concept does not need a sixteenth. Rule 4 wants one; say the word and it is one more slide |
| D10 | Concept 4 has no Result capture | **Capture the created-budget confirmation before generation** | STAR closes on something run. Without that screen the concept ends on a recap pretending to be a Result, which the pedagogy guidelines name as the failure mode. It is one screenshot on an account that already has the budget |

## 8. Dependents to chase after generation

- `deck.config.json` — `slideCount` 42, `devPort` 5221, `htmlName`
- `src/export/revealSteps.ts` — regenerated, never hand-edited
- Session 9: D5, its account block and its `slideCount`
- `slide-kit/assets/` — the redacted captures land there first, then get copied
  into the module (hard rule 13)
- Session 9's `choose-free-plan` instructor note, which records the old
  position of the plan chooser (§4c)
- One capture still to take: the budget-created confirmation (D10)
- One capture to destroy, not redact: the password screen (§4b #15)
