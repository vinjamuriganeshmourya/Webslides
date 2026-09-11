<!-- cSpell:ignore nxttrendz deployement NxtWave colour behaviour dockerignore Makefile Vite ravi Jenkinsfile freestyle SCM ngrok emandate NPCI UPI OTP -->
# Deployment · Session 8: "Setting Up Jenkins for Docker Builds"

**STATUS: DRAFT, NOT SIGNED OFF.** Five decisions in §7 need your answer before a
slide is written. Two of them change what the session can honestly promise.

| | |
|---|---|
| `SESSION_NAME` | `Setting Up Jenkins for Docker Builds` (kicker on every content slide, never "Session 8") |
| `COURSE` | `React + Django Integration · Deployment` |
| Source | `/home/nxtwave/docker_jenkins_aws/08_setting_up_jenkins_for_docker_builds.md`, 452 lines, read in full |
| Also read | `09_...jenkins.md` §4 (the webhook) and `10_deploying_docker_on_aws_ec2.md` §2 (AWS), because this session now borrows from both |
| Project | `django_deployement_course/deployement_session_8/` (to scaffold from `slide-kit/slide-template`) |
| Deck file | `src/decks/jenkinsDockerDeck.tsx` |
| Slide count | **56 proposed** |
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
| **A** | A tunnel, `ngrok http 8080`, and the tunnel's public URL as the Payload URL | A webhook that genuinely fires on `git push`, in the room | A third-party account and a fourth tool. The URL changes on every ngrok restart, so it is wrong again next session |
| **B** | Configure the webhook, watch GitHub's delivery FAIL, then switch on Poll SCM | Automation that works, plus the reachability lesson proved by GitHub's own red error | The webhook does not fire today. It becomes real when Jenkins moves to EC2 |
| **C** | Skip the webhook entirely, Poll SCM only | Automation that works | Your ask is not delivered, and the word webhook stays abstract for another session |

**Recommended: B.** It delivers the thing you asked for, the Payload URL is
entered and saved, and the failed delivery is the best teaching moment available:
GitHub prints the reason itself, so the room learns why a server needs a public
address from evidence rather than from a bullet. It also needs no new tool, and it
sets up session 10 with a real motivation instead of a promise.

**If you want the webhook actually firing in the room, say A** and I will plan
the ngrok beat properly, including the fact that the URL dies on restart.

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

56 slides. Front frame 5, four concepts 41, closing block 10.

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

### Concept 3, Pointing Jenkins at Your Code, 10

| # | Slide | Type |
|---|---|---|
| 26 | Divider | `SectionBreakerSlide` |
| 27 | Public repository, nothing to do | `ContentSlide` |
| 28 | Private repository, the same pattern as Docker Hub | `ContentSlide` + `Shot` |
| 29 | Point the job at the repository | `ContentSlide` + `Shot` |
| 30 | The repository contract: what Jenkins expects to find | `FileTree` |
| 31 | What starts a run, revisited | `DataTable`, the session 7 table with the webhook row lit |
| 32 | The Payload URL, field by field | `CommandSyntaxSlide` |
| 33 | Add the webhook on GitHub | `ContentSlide` + `Shot` |
| 34 | GitHub could not reach you, and here is its own error | `ContentSlide` + `Shot` of the failed delivery |
| 35 | So: Poll SCM today, webhook when the server is public | `ContentNoteSlide` |

Slides 32 to 35 are option **B** from §3. Option A replaces 34 and 35 with the
tunnel and a delivery that succeeds.

### Concept 4, The First Build from Jenkins, 11

| # | Slide | Type |
|---|---|---|
| 36 | Divider | `SectionBreakerSlide` |
| 37 | The build step, three lines | `ContentSlide` + `CodeBlock` |
| 38 | Build Now, and what to watch | `ContentSlide` + `Shot` |
| 39 | Reading the console, top to bottom | `ContentSlide` + `Shot`, browser chrome |
| 40 | The image exists, and the host can see it | `ContentSlide` + `Terminal`, `docker images` |
| 41 | What a machine just did that you used to do | `SwapRows` |
| 42 | Error 1, `docker: not found` | `StatusPointsSlide` |
| 43 | Error 2, permission denied on the socket | `StatusPointsSlide` |
| 44 | Error 3, repository not found | `StatusPointsSlide` |
| 45 | Errors 4 and 5, daemon and build context | `StatusPointsSlide` |
| 46 | The diagnostic ladder | `ProceduralStepsSlide` |

### Closing block, 10

| # | Slide | Type |
|---|---|---|
| 47 | Quiz Time! | `QuizTimeSlide` |
| 48 | Key takeaways, the four agenda strings verbatim | `KeyTakeawaysSlide` |
| 49 | Before we meet again | `SectionBreakerSlide`, own kicker, not a concept divider |
| 50 | Why now: activation takes up to a day | `ContentNoteSlide` |
| 51 | Have these eight things ready | `DataTable`, §4.2 |
| 52 | The sign-up, screen by screen | `ContentSlide` + `Shot`, browser chrome |
| 53 | Choose Basic support, and what the paid ones are | `ContentSlide` + `Shot` |
| 54 | Auto pay, and cancelling it | `ProceduralStepsSlide`, §4.3 steps 1 to 4 |
| 55 | Four things that keep it at zero | `DataTable`, §4.3 |
| 56 | Next session, then Thank you | `SectionBreakerSlide` + `ThankYouSlide` |

Slide 56 is two frames; the count above says 56 because the thank you frame is
the 57th and every deck has one. Corrected at scaffold time.

---

## 6. What this session needs that the kit does not have

One candidate, and it is a real one.

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
chrome, which session 7 added and which slides 33, 34, 39, 52 and 53 all want.

---

## 7. Decisions, and my recommendation on each

| | Decision | Options | Recommended |
|---|---|---|---|
| **D1** | The webhook | A tunnel, B configure and watch it fail then Poll SCM, C skip | **B**. It delivers the Payload URL you asked for and proves the reachability lesson with GitHub's own error, with no new tool |
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
