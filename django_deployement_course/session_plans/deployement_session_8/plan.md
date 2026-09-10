<!-- cSpell:ignore nxttrendz deployement NxtWave colour behaviour dockerignore Makefile Vite ravi Jenkinsfile freestyle SCM ngrok emandate NPCI UPI OTP -->
# Deployment · Session 8: "Setting Up Jenkins for Docker Builds"

**STATUS: BUILT 2026-09-10.** Signed off and generated. 58 slides at
`django_deployement_course/deployement_session_8/`, branch
`deck/setting-up-jenkins-for-docker-builds`.

| Harness | Result |
|---|---|
| `qa.mjs` | 2 slides, Welcome and Thank you, both `NO LOGO`. The expected baseline exactly |
| `align-check.mjs` | 0 of 58 |
| `video-safe.mjs` | 1 of 58, and it is a kit defect rather than content. See "Known defect" below |
| `build:html` | clean, `dist-single/deployment-session-8.html`, 3.63 MB |

### Known defect, not fixed here

Slide 12's `CommandSyntaxSlide` intrudes 177px into the instructor rectangle.
`SyntaxBreakdown.tsx` sizes its panel `mx-auto w-full max-w-[900px]`, a fixed
centred 900px block landing at x=190 to 1090 while the rectangle starts at 913.
It is content independent: shortening the specimen from 44 characters to
`-v HOST:CONTAINER` moved it zero pixels. Session 6 uses the same component.
Fixing it means changing the kit, which reaches every deck, so it is recorded
here rather than patched for one slide.

### Five slides carry no capture yet

Planned as `Shot`, shipped without one, each with a comment in the deck at the
point it matters. Slides 29 and 39 need a running Jenkins (tasks.md phase 3a);
35 and 36 need a live tunnel and repository (phase 3b); 53 and 54 are the
deliberate D3 limit, because a real AWS sign up shows a real name, address and
payment instrument.

### One slide still blocked

Slide 42 ships a `DataTable` where this plan asks for `SwapRows`, which is
committed on `kit/lit-surfaces` and absent from main. Swap it when that
branch merges.

---

**All five §7 decisions answered.**

| | Decision | Signed off as |
|---|---|---|
| **D1** | The webhook | **A, the ngrok tunnel.** Changed from the drafted recommendation of B, because the cost B was recommended over no longer exists: see §3 |
| **D2** | AWS block placement | **Closing block only.** No divider, no agenda row |
| **D3** | AWS captures | **Prose plus two captures**, at screens carrying nothing personal |
| **D4** | The Docker socket risk | **One callout, slide 16** |
| **D5** | Session 9's headline | **Deferred** to when session 9 is planned |

Branch `deck/setting-up-jenkins-for-docker-builds`, cut from `origin/main` in a
separate worktree because the shared tree carried 32 locally modified files that
also differ from main, across sessions 5, 6 and 7.

| | |
|---|---|
| `SESSION_NAME` | `Setting Up Jenkins for Docker Builds` (kicker on every content slide, never "Session 8") |
| `COURSE` | `React + Django Integration · Deployment` |
| Source | `/home/nxtwave/docker_jenkins_aws/08_setting_up_jenkins_for_docker_builds.md`, 452 lines, read in full |
| Also read | `09_...jenkins.md` §4 (the webhook) and `10_deploying_docker_on_aws_ec2.md` §2 (AWS), because this session now borrows from both |
| Project | `django_deployement_course/deployement_session_8/` (to scaffold from `slide-kit/slide-template`) |
| Deck file | `src/decks/jenkinsDockerDeck.tsx` |
| Slide count | **58**, signed off |
| `devPort` | `5219` (5211 to 5218 and 5220 to 5234 are taken) |
| `htmlName` | `deployment-session-8` |
| `NEXT_UP` | `Automating Docker Builds and Deployments with Jenkins` |

---

## 1. What you asked for, and where it sits against the TR

Asked for on 2026-09-09:

> "We need to setup webhook url and create the job and make run, and at the end
> we must create the AWS account, only account creation. AWS requires a
> verification before activation, it would take a day. Also gather the details
> that need to be provided. Student would be setting up the auto pay and after
> activation student must cancel, we should not make student pay bill on the
> services that we would be teaching. This is only for learning purpose, not for
> realtime usage."

| Your ask | Where it lives today | What that means here |
|---|---|---|
| Set up the webhook URL | TR **9** §4, not TR 8. TR 8's own closing line hands the webhook to the next session | Pulled forward. See §3, which is the one place this plan cannot give you what you asked for without a choice |
| Create the job and make it run | TR 8 §5, "First Docker Build from Jenkins" | Already the TR's climax. Kept as the concept the session builds to |
| Create the AWS account, account only | TR **10** §2, which assumes the account exists | Pulled forward two sessions, and §4 says why that is the right call rather than a convenience |
| The details to gather | Nowhere in the course | New. §4.2 is the list, checked against AWS's own docs today |
| Auto pay, then cancel after activation | Nowhere in the course | New. §4.3, and it comes with one caveat I am not willing to leave out |

**What the TR contributes and this plan keeps whole:** the Docker socket (§2), the
credentials store (§3), connecting Jenkins to the repository (§4), the first real
Docker build (§5), and the five named errors (§6). Nothing in TR 8 is dropped.

---

## 2. Concept map

Four concepts, one divider each. The AWS block is deliberately the fifth thing
and deliberately NOT a concept: see §4.4.

| # | Concept (agenda wording, verbatim in the takeaways) | TR sections | Ends on |
|---|---|---|---|
| 1 | Giving Jenkins the Docker Command | 8 §1, §2 | Jenkins can run `docker build`, and nothing is stored yet |
| 2 | Secrets Jenkins Can Use Safely | 8 §3 | Two credentials exist and neither is in a file |
| 3 | Pointing Jenkins at Your Code | 8 §4, 9 §4 | The repository is wired, and the trigger question is open |
| 4 | The First Build from Jenkins | 8 §5, §6 | A real image built by a machine, and a red build read to the bottom |
| Closing block | Before We Meet Again: your AWS account | 10 §2 | An account that will be active by the time it is needed |

---

## 3. The webhook, and the thing I cannot plan around

**This is decision D1 and it is the important one.**

You asked for the webhook URL to be set up. The course's own TR 9 §4 already
records why that is not straightforward, in its own words:

> "GitHub's servers must be able to REACH the Payload URL, and `localhost:8080`
> is only reachable from your own machine. A Jenkins on your laptop cannot
> receive GitHub webhooks directly. This is not a flaw in your setup, it is the
> reason real Jenkins servers run on machines with public addresses."

Session 7 shipped the same fact twice, on `c3-wizard-instance-config` and in the
notes of `c4-freestyle-vs-pipeline`. So the room has already been told. The
Payload URL itself is not the hard part, it is one field:

```
http://<your-jenkins-address>:8080/github-webhook/
```

The hard part is that on a laptop there is no `<your-jenkins-address>`. Three
honest ways to run this session:

| | Option | The room leaves with | Cost |
|---|---|---|---|
| **A** | A tunnel, `ngrok http 8080`, and the tunnel's public URL as the Payload URL | A webhook that genuinely fires on `git push`, in the room | An ngrok account **per student**, and a fourth tool |
| **B** | Configure the webhook, watch GitHub's delivery FAIL, then switch on Poll SCM | Automation that works, plus the reachability lesson proved by GitHub's own red error | The webhook does not fire today. It becomes real when Jenkins moves to EC2 |
| **C** | Skip the webhook entirely, Poll SCM only | Automation that works | Your ask is not delivered, and the word webhook stays abstract for another session |

**Signed off: A**, and the reason the draft recommended B against it no longer
holds. Checked against ngrok's own docs on 2026-09-10, not from memory:

| | ngrok Free plan, today |
|---|---|
| Cost | $0 |
| Domain | One auto-assigned **dev domain** |
| Stability | "a stable, auto-assigned hostname". It **persists across restarts** |
| Limits | 20k HTTP/S requests, 1GB transfer, 3 online endpoints |
| Interstitial | A browser warning page, which "should not impact users serving APIs or accessing ngrok endpoints programmatically" |

The draft's stated cost for A was that "the URL changes on every ngrok restart,
so it is wrong again next session". That was true of the old random-subdomain
behaviour and is **no longer true**: a free account keeps one stable dev domain,
so the Payload URL entered in this session still resolves in sessions 9 and 10.
The interstitial does not reach GitHub's POST; `ngrok-skip-browser-warning`
exists if it ever does.

**The cost that remains, and it is per-student:** every learner needs their own
ngrok account, their own authtoken and their own dev domain. In a room of 30
that is 30 signups mid-session. Budget a slide for it and expect it to be the
slowest beat in concept 3.

**What A changes in the slide list:** slides 34 and 35 are no longer "GitHub
could not reach you" and "Poll SCM today". They become the tunnel, and a
delivery that succeeds. See §5, concept 3.

---

## 4. The AWS account

### 4.1 Why account creation belongs in this session and nothing else does

Because activation is not instant and the course cannot wait for it.

- AWS's own guidance is that an account "can activate in minutes, but it can take
  up to 24 hours", and since the 2026 verification change, **non-card payment
  methods take 48 to 72 hours**.
- The account is first NEEDED in session 10, "Deploying Docker on AWS EC2".
- Signing up in session 8 puts two sessions of slack between the click and the
  need. Signing up in session 10 means a room that cannot do session 10.

So this is a **prerequisite errand, not a topic**. The session teaches Jenkins and
Docker; the last block sets a clock running.

### 4.2 The details a student must have ready

Checked against AWS's own sign-up prerequisites today, not from memory. Put this
on a slide as a table so nobody is hunting mid-signup.

| # | What AWS asks for | The part that trips people |
|---|---|---|
| 1 | **Email address** | It becomes the **root user sign-in name** and the account recovery address. A personal address they will still have in two years, not a college one that expires |
| 2 | **AWS account name** | Just a label, changeable later. Not the sign-in |
| 3 | **Root password** | 8 to 128 characters, and at least **three of four** types: uppercase, lowercase, digits, symbols |
| 4 | **Account type** | **Personal**, not Business |
| 5 | **Full name, phone number, country, full address, postal code** | Since the 2026 verification change these must **match the payment instrument's own records**. A mismatch is the commonest cause of a stuck account |
| 6 | **Payment method: card or UPI ID** | India can now use a **UPI ID** to sign up, not only a card. AWS requires one even for a Free Tier account |
| 7 | **Phone verification** | An SMS or voice code, so the phone must be reachable in the room |
| 8 | **Support plan** | Choose **Basic**, which is free. Developer and Business are paid and are preselected traps for the hurried |

**A small verification charge may appear** on the instrument and is reversed by
AWS. Say so before it happens, or somebody will think they have been billed for
the course.

### 4.3 Auto pay, and cancelling it after activation

What you asked for, with the mechanism named correctly. In India, automatic
recurring payment is an **e-mandate**, an RBI and NPCI facility, and AWS supports
it on cards and on **UPI AutoPay**. It is enabled from the AWS console, Billing
Dashboard, Payments page, by ticking the e-mandate box during a payment, and the
bank then takes over with its own multi-factor step. AWS currently automates bills
**up to ₹15,000 each**.

Cancelling it, which is the half you want the room to actually do:

1. Open the **bank or UPI app**, not the AWS console.
2. Find the list of **active e-mandates** or **AutoPay** mandates.
3. Find **Amazon Web Services** and choose **Cancel**.
4. Expect an OTP or a second authentication step from the bank.

**And now the caveat I am not willing to leave out of a plan, because leaving it
out would teach a false sense of safety.** Cancelling the mandate stops AWS
collecting money automatically. It does **not** stop charges from being incurred.
A student who leaves a large instance running still owes the bill; they simply get
an unpaid invoice and a suspended account instead of a silent debit. So the slide
that says "cancel the mandate" has to sit beside the three things that actually
keep the cost at zero:

| Protection | What it does |
|---|---|
| Stay inside the **Free Tier** | One micro instance, 750 hours a month, twelve months. TR 10 §2.3 already carries this |
| Set a **zero-spend budget alert** | An email the moment the forecast leaves ₹0. This is the one that catches mistakes while they are cheap |
| **Stop** the instance when finished | TR 10 §2.3's habit "from day one". A stopped instance bills nothing for compute |
| Cancel the **e-mandate** | Stops the automatic debit, so nothing leaves the account without a decision |

Framed that way the four are one lesson: **you are renting, and you are
responsible for switching it off.** That is a better lesson than "cancel the
mandate and relax", and it is also true.

### 4.4 What this block must never become

- **Not a concept.** It gets no divider and no agenda row, because the agenda is
  what the session teaches and this is homework with a deadline. It sits after the
  takeaways, in the closing block, under its own kicker.
- **Nobody's card details are collected by anyone.** The student signs up on their
  own device with their own instrument. No trainer, no chat, no shared sheet. Put
  that sentence on the slide, not just in the notes.
- **Say the purpose out loud: this account exists to learn on.** Your words, and
  they belong on the slide: "this is only for learning purposes, not for real time
  usage."
- **No promise of zero.** The course can say "this course costs ₹0 if you stay
  inside the Free Tier", which is TR 10's own claim and is fair. It cannot say
  "you will not be charged", because that depends on what the student does next.

---

## 5. Slide-wise plan

**58 slides.** Front frame 5, four concepts 42, closing block 11.

Two corrections to the draft's arithmetic, both applied here:
- Option A adds one slide to concept 3, which was 10 and is now 11.
- The draft counted 56 while admitting the thank-you frame made it 57. It is its own slide and is numbered as one below.

### Front frame, 5

| # | Slide | Type |
|---|---|---|
| 1 | Brand | `BrandSlide` |
| 2 | Session name | `WelcomeSlide` |
| 3 | Where we left off: a green build that only echoes | `ContentNoteSlide`, recap of session 7's `hello-jenkins` |
| 4 | Agenda, four items | `AgendaSlide` |
| 5 | Initial setup: Jenkins up, repo pushed, images built | `ContentSlide` + `Terminal` |

### Concept 1, Giving Jenkins the Docker Command, 11

Opens on the gap, per PEDAGOGY §2: the build they ran cannot build an image.

| # | Slide | Type |
|---|---|---|
| 6 | Divider | `SectionBreakerSlide` |
| 7 | The job that cannot do the job | `ContentSlide` + `Terminal` showing `docker: not found` |
| 8 | Why: the container has no Docker client | `ContentSlide` |
| 9 | How a docker command actually works, client and daemon | new figure, see §6 |
| 10 | The daemon is on your machine, not in the container | `LoneHost` |
| 11 | Share the socket, what that means | `ContentSlide` |
| 12 | The new `docker run`, flag by flag | `CommandSyntaxSlide` |
| 13 | Install the client inside the container | `ContentSlide` + `Terminal` |
| 14 | Install the Docker plugin | `ContentSlide` + `Shot` |
| 15 | Prove it: `docker version` from a Jenkins job | `ContentSlide` + `Shot` of the console |
| 16 | What we just handed over, and the risk | `ContentNoteSlide`, the socket is root access |

### Concept 2, Secrets Jenkins Can Use Safely, 9

| # | Slide | Type |
|---|---|---|
| 17 | Divider | `SectionBreakerSlide` |
| 18 | The wrong way first: the password in the shell step | `ContentSlide` + `Terminal`, and the console printing it |
| 19 | Why that is worse than it looks | `ContentNoteSlide` |
| 20 | The credentials store | `ContentSlide` + `Shot` |
| 21 | Add the Docker Hub credential | `ContentSlide` + `Shot` |
| 22 | Add the `SECRET_KEY` credential | `ContentSlide` + `Shot` |
| 23 | How a job uses one without printing it | `ContentSlide` + `Terminal` showing `****` |
| 24 | Kinds of credential, and which to pick | `DataTable` |
| 25 | Quiz Time! | `QuizTimeSlide`, no subtitle (content rule 28) |

### Concept 3, Pointing Jenkins at Your Code, 11

| # | Slide | Type |
|---|---|---|
| 26 | Divider | `SectionBreakerSlide` |
| 27 | Public repository, nothing to do | `ContentSlide` |
| 28 | Private repository, the same pattern as Docker Hub | `ContentSlide` + `Shot` |
| 29 | Point the job at the repository | `ContentSlide` + `Shot` |
| 30 | The repository contract: what Jenkins expects to find | `FileTree` |
| 31 | What starts a run, revisited | `DataTable`, the session 7 table with the webhook row lit |
| 32 | Why GitHub cannot reach `localhost:8080` | `ContentSlide` + `LoneHost` |
| 33 | A tunnel, and the account each of you needs | `ContentSlide` + `Terminal`, `ngrok http 8080` |
| 34 | The Payload URL, field by field | `CommandSyntaxSlide` |
| 35 | Add the webhook on GitHub | `ContentSlide` + `Shot` |
| 36 | It fired. Read GitHub's own delivery record | `ContentSlide` + `Shot` of a **successful** delivery |

Slides 32 to 36 are option **A** from §3, signed off 2026-09-10.

**Slide 32 is not optional under A.** The reachability problem is the reason the
tunnel exists, and deleting it turns ngrok into a magic incantation. The order
is: the problem, then the tunnel that solves it, then the delivery that proves
it. Session 7 already told the room `localhost` is not reachable from outside,
so this is a callback, not a new lesson.

**Slide 33 is the slowest beat in the deck.** Every learner signs up, installs,
pastes an authtoken and reads their own dev domain off the terminal. Plan for it
taking longer than any other slide in the session.

### Concept 4, The First Build from Jenkins, 11

| # | Slide | Type |
|---|---|---|
| 37 | Divider | `SectionBreakerSlide` |
| 38 | The build step, three lines | `ContentSlide` + `CodeBlock` |
| 39 | Build Now, and what to watch | `ContentSlide` + `Shot` |
| 40 | Reading the console, top to bottom | `ContentSlide` + `Shot`, browser chrome |
| 41 | The image exists, and the host can see it | `ContentSlide` + `Terminal`, `docker images` |
| 42 | What a machine just did that you used to do | `SwapRows` |
| 43 | Error 1, `docker: not found` | `StatusPointsSlide` |
| 44 | Error 2, permission denied on the socket | `StatusPointsSlide` |
| 45 | Error 3, repository not found | `StatusPointsSlide` |
| 46 | Errors 4 and 5, daemon and build context | `StatusPointsSlide` |
| 47 | The diagnostic ladder | `ProceduralStepsSlide` |

### Closing block, 11

| # | Slide | Type |
|---|---|---|
| 48 | Quiz Time! | `QuizTimeSlide` |
| 49 | Key takeaways, the four agenda strings verbatim | `KeyTakeawaysSlide` |
| 50 | Before we meet again | `SectionBreakerSlide`, own kicker, not a concept divider |
| 51 | Why now: activation takes up to a day | `ContentNoteSlide` |
| 52 | Have these eight things ready | `DataTable`, §4.2 |
| 53 | The sign-up, screen by screen | `ContentSlide` + `Shot`, browser chrome |
| 54 | Choose Basic support, and what the paid ones are | `ContentSlide` + `Shot` |
| 55 | Auto pay, and cancelling it | `ProceduralStepsSlide`, §4.3 steps 1 to 4 |
| 56 | Four things that keep it at zero | `DataTable`, §4.3 |
| 57 | Next session | `SectionBreakerSlide` |
| 58 | Thank you | `ThankYouSlide` |

`slideCount` in `deck.config.json` is therefore **58**.

---

## 6. What this session needs that the kit does not have

**Resolved in `slide-kit/socket-lab` (devPort 5235) on 2026-09-10.** Two figures,
not one: the draft named only the socket, because it was written while D1 was B.
Option A puts a public address forwarding into a laptop on slide 33 and nothing
in the registry draws that either.

| Slide | Figure | Chosen |
|---|---|---|
| 9, and reused on 10 and 11 | `SocketBridge` | **Candidate B**, both boundaries drawn from the start, so one picture serves three slides and the room never unlearns a drawing |
| 33 | `TunnelPath` | **Candidate B**, two phases: the laptop dials out, then the webhook rides back down the open pipe. This is the fact that makes it work without a public address, and it answers slide 32 directly |
| 32 | `MachineBoundary` | **Already in the kit, used unchanged.** It draws a request dying at the localhost boundary, which is exactly slide 32's claim |

**What the lab caught that no harness would have.** Both figures typechecked and
would have passed `qa`, `video-safe` and `align-check`, because an `<svg>` is one
rectangle to all three. Looking at the pictures found four overprinted labels and
one caption truncated mid-sentence. The root cause was structural: the shared
`Arrow` helper centred every label on its arrow's midpoint, which is exactly
where the socket box and the laptop boundary sit. Hard rule 17, again.

### The original draft text, kept for the record

**A client and daemon figure**, for slide 9. The claim is that `docker` on the
command line is a thin client that sends every instruction to a daemon somewhere
else, and that the socket is the wire between them. Nothing in the registry draws
one process talking to another across a boundary it does not own: `LoneHost` is
about not reaching a thing, `BoundaryBridge` needs a hub in the middle,
`SpineFlow` is a sequence.

Per content rule 27 the representation gets researched before it is drawn, and
per rule 14 a new figure is a lab with candidates. Both happen before slide 9 is
written, not during. Provisional name `SocketBridge`, lab `slide-kit/socket-lab`,
`devPort` 5235.

Everything else on the list above already exists, including `Shot`'s browser
chrome, which session 7 added and which slides 35, 36, 40, 53 and 54 all want.

---

## 7. Decisions, and my recommendation on each

| | Decision | Options | Recommended |
|---|---|---|---|
| **D1** | The webhook | A tunnel, B configure and watch it fail then Poll SCM, C skip | **A, signed off 2026-09-10.** ngrok Free now keeps a stable dev domain, so B's advantage over A is gone and the room gets a webhook that actually fires. §3 has the checked figures |
| **D2** | Does the AWS block get a concept divider and an agenda row | Yes, or closing block only | **Closing block only.** It is a prerequisite errand with a deadline, not something the session teaches |
| **D3** | Are the AWS sign-up screens captured live | Yes, real `Shot`s, or described in prose | **Prose plus two captures at most.** A real sign-up shows a real person's address and card. Captures stop at the screens with nothing personal on them |
| **D4** | The Docker socket risk | One callout, or its own two slides | **One callout, slide 16.** Sharing the socket is root access to the host, and a room that is never told deserves better. Two slides makes it the topic, which it is not |
| **D5** | Session 9's headline, now that the webhook moved | Leave TR 9 as written, or re-cut it | **Re-cut it when we plan it.** TR 9 opens on "a human must click Build Now" being replaced by a webhook. If session 8 already entered the Payload URL, session 9's opening beat is gone and its new one is the Jenkinsfile |

---

## 8. Knock-on effects, recorded before they surprise anyone

- **Session 7 says the webhook is session 9**, in `c4-freestyle-vs-pipeline`'s
  notes and on `c3-wizard-instance-config`. Session 7 is delivered and frozen, so
  neither changes; the reference is to the topic rather than to a number, and
  "session 9" appears only in notes, which content rule 2b exempts.
- **TR 9 loses its opening contrast** if D1 is A or B. See D5.
- **TR 10 gains a prerequisite it currently states as an assumption.** Its §2 can
  stop explaining what AWS is at sign-up depth and go straight to EC2, because
  the account will already exist.
- **The AWS Free Tier clock starts in session 8, not session 10.** Twelve months
  from account creation, so two sessions of the twelve are spent before the first
  instance launches. It costs nothing and is worth knowing.
