<!-- cSpell:ignore nxttrendz deployement NxtWave colour Mumbai Hyderabad ap-south AMI CIDR gp3 vCPU authtoken -->
# Session 9 flow review: hands-on against concept explanation

**Read-only review, 2026-09-16.** No deck file was edited to produce it.

**Numbering.** Every slide number below is the **current deck, 73 slides**, read
from `deployement_session_9/src/decks/awsIntroDeck.tsx` at md5
`efcacb9a…5ed68844af`, after the hands-on launch walk-through landed and concept 3
was renamed `Launching an Instance`.

The deck changed once while this review was being written: it was read at 74
slides and re-read at 73, because `c4-credits-page` was cut. That cut is one of
the ones proposed below, so the proposal is unaffected; every number here is the
73-slide deck, and `deck.config.json` agrees. If the deck moves again, re-map by slide **id**: every row in §0
and §8 carries one.

Instruction under review, user, 2026-09-16: *"Add a flow reviewer of hands-on
versus concept explanation and refine the flow to provide the best learning
experience and clarity to the student wherever possible."* Audience: absolute
beginners, many reading English as a second language, live, 75 to 90 minutes.

---

## 0. The current deck, numbered

| # | id | Section | Room does |
|---|---|---|---|
| 1 | `brand` | Opening | watch |
| 2 | `session-name` | Opening | watch |
| 3 | `where-we-left-off` | Opening | watch |
| 4 | `account-first` | Before We Start | **acts** (opens console) |
| 5 | `create-account` | Before We Start | **acts** |
| 6 | `choose-free-plan` | Before We Start | **acts** |
| 7 | `sign-in` | Before We Start | **acts** |
| 8 | `not-finished` | Before We Start | **acts** (troubleshoot) |
| 9 | `check-credits` | Before We Start | **acts** |
| 10 | `agenda` | Opening | watch |
| 11 | `one-question` | Opening | **answers** |
| 12 | `c1-divider` | C1 | watch |
| 13 | `c1-what-cloud-gives` | C1 | watch |
| 14 | `c1-dc-question` | C1 | **answers** |
| 15 | `c1-dc-what` | C1 | watch |
| 16 | `c1-dc-inside` | C1 | watch |
| 17 | `c1-data-centre` | C1 | watch |
| 18 | `c1-why-not-own` | C1 | watch |
| 19 | `c1-laptop-not-server` | C1 | watch |
| 20 | `c1-what-server-is` | C1 | watch |
| 21 | `c1-buy-or-rent` | C1 | watch |
| 22 | `c1-pay-for-use` | C1 | watch |
| 23 | `c1-who-rents` | C1 | watch |
| 24 | `c1-recap` | C1 | watch |
| 25 | `c2-divider` | C2 | watch |
| 26 | `c2-what-you-know` | C2 | **answers** |
| 27 | `c2-not-the-app` | C2 | watch |
| 28 | `c2-what-aws-is` | C2 | watch |
| 29 | `c2-market-share` | C2 | watch |
| 30 | `c2-240-services` | C2 | watch |
| 31 | `c2-console` | C2 | **acts** |
| 32 | `c2-find-ec2` | C2 | **acts** |
| 33 | `c2-ec2-rents` | C2 | watch |
| 34 | `c2-instance` | C2 | watch |
| 35 | `c2-six-decisions` | C2 | watch |
| 36 | `c2-recap` | C2 | watch |
| 37 | `c3-divider` | C3 | watch |
| 38 | `c3-what-region-is` | C3 | watch |
| 39 | `c3-pick-nearest` | C3 | **acts** (sets Region) |
| 40 | `c3-availability-zones` | C3 | watch |
| 41 | `c3-launch-instance` | C3 | **acts** |
| 42 | `c3-name-and-tags` | C3 | **acts** |
| 43 | `c3-os-image` | C3 | **acts** |
| 44 | `c3-ami` | C3 | watch |
| 45 | `c3-instance-type` | C3 | **acts** |
| 46 | `c3-t3-sizes` | C3 | watch |
| 47 | `c3-key-pair` | C3 | **acts** |
| 48 | `c3-vpc` | C3 | watch |
| 49 | `c3-default-vpc` | C3 | **acts** (reads the field) |
| 50 | `c3-subnets` | C3 | watch |
| 51 | `c3-three-subnets` | C3 | **acts** |
| 52 | `c3-public-ip` | C3 | **acts** |
| 53 | `c3-security-group` | C3 | **acts** |
| 54 | `c3-door-list` | C3 | watch |
| 55 | `c3-storage` | C3 | **acts** |
| 56 | `c3-summary-launch` | C3 | **acts** (clicks Launch) |
| 57 | `c3-instance-running` | C3 | **acts** (reads the row) |
| 58 | `c3-two-addresses` | C3 | watch |
| 59 | `c3-stop-or-terminate` | C3 | watch |
| 60 | `c3-recap` | C3 | watch |
| 61 | `c4-divider` | C4 | watch |
| 62 | `c4-free-plan` | C4 | watch |
| 63 | `c4-what-costs` | C4 | watch |
| 64 | `c4-what-is-free` | C4 | watch |
| 65 | `c4-billing-page` | C4 | **acts** |
| 66 | `c4-budget-alert` | C4 | **acts** (creates the budget) |
| 67 | `c4-never-upgrade` | C4 | watch |
| 68 | `c4-recap` | C4 | watch |
| 69 | `key-takeaways` | Closing | watch |
| 70 | `practice` | Closing | **acts** |
| 71 | `what-comes-next` | Closing | watch |
| 72 | `feedback` | Closing | **acts** |
| 73 | `thank-you` | Closing | watch |

---

## 1. Just in time against front-loaded, concept by concept

One row per term the deck teaches. "Gap" is the distance in slides from the
frame that explains a term to the first frame that makes the learner act on it.

| Term | Explained | First used in anger | Gap | Verdict |
|---|---|---|---|---|
| Data Centre | 15, 16 | 38 (a Region is a city with Data Centres) | 22 | **Needs to come first.** It is the picture the whole deck grows from. Keep in C1 |
| Server | 20 | 33, 41 | 13 | Needs to come first. Keep |
| Pay for use | 22 | 63 (What Costs Money) | 41 | Acceptable **only because the `Meter` figure returns**. Without the meter this is far too wide. See §1a |
| AWS | 28 | 31 | 3 | Good |
| EC2 | 33 | 41 | 8 | Good |
| Instance | 34 | 56 | 22 | Acceptable: the word is used continuously in between |
| Region | 38 | 39 (sets it) | 1 | **Model case.** This is what the rest should look like |
| Availability Zone | 40 | 51 (picks the subnet whose AZ it is) | 11 | **The one remaining front-load inside C3.** See §1b |
| AMI | 43, 44 | 43 (picks Ubuntu) | 0, but inverted | Field first, concept second. See §2 |
| Instance type | 45, 46 | 45 | 0, but inverted | Same inversion |
| Key pair | 47 | 47 | 0 | Good |
| VPC | 48, 49 | 49 | 0 | Good, and in the right order (concept then field) |
| Subnet | 50, 51 | 51 | 0 | Good |
| Security Group | 53, 54 | 53 | 0, but inverted | Same inversion |
| Public and private address | 52 (enable), 58 (what they are) | 52 | 6, inverted | The learner enables a public address six slides before the deck says what one is |
| Disk | 55 | 55, again at 64 | 0 | Good. The billed-while-stopped line is on both frames, which is right |
| Billing, what it costs | 62 to 64 | **the meter started at 56** | 7 after the spend begins | **The biggest just-in-time fault in the deck.** See §1c |

### 1a. Pay for use, 41 slides from its consequence

Slide 22 teaches the meter. Slide 63 is where the meter is a bill. In between the
room launches a billable computer (56). The `Meter` figure family is doing real
work holding this together, and it is why the gap is survivable. The cheap
repair is one clause on 63: *"the same meter you watched at Pay for Use"*, so the
callback is on the slide and not only in the instructor's head.

### 1b. Availability Zone at 40 is the last front-load in concept 3

Concept 3's whole design is "each field's concept is taught at the field that
uses it". Availability Zone is the exception: it is taught at 40 and first
*used* at 51, where the subnet list shows `ap-south-1a`, `1b`, `1c`.

Moving it to sit immediately before `c3-three-subnets` would be perfectly
consistent with the concept's own rule. **I recommend against it**, and the
reason should be recorded so it is not re-litigated: slide 39 tells the room to
pick the nearest *city*, and a room that has not been told a Region is three
buildings will ask "is one city one computer?" at exactly that moment. The
Region and the zone are one idea with two rungs, and `PlaceLadder` already draws
them as one. Cheaper fix: one callback line on `c3-three-subnets`, *"one subnet
for each of the three buildings from Availability Zones"*.

### 1c. The money arrives after the spending starts

The room clicks Launch instance on slide 56 and creates the zero-spend budget on
slide 66. Eleven slides, roughly fourteen minutes, of a running meter before the
alarm is set, and the learner is told what an instance costs per hour only at 63.

For this audience that ordering is backwards in the one place where being
backwards frightens people. A beginner who has heard "cloud bill" stories spends
concept 3 worrying instead of learning. **Move the budget alert into the account
block**, where the room is already signed in and already looking at its USD 100
of credit on slide 9. Nothing is running yet, so the budget is created in the
calmest part of the session, and every later slide can say "you already have the
alarm on".

Concept 4 loses nothing by this: it still owns the Free plan, what costs money,
what is free, the zero bill, and Never Upgrade. It gains a better closing line
for its recap, because the budget is a thing the room did rather than a thing it
is about to do.

---

## 2. Why before how

Concept 3 answers "why am I clicking this" well in five places and badly in four.
The good pattern is slide 52:

> `Public IP` — *"The next line is Auto-assign public IP. Set it to Enable, or
> the internet cannot reach the instance"*

Reason and click on the same line, reason first. That is the shape.

**Flagged: the click comes before the reason.**

| Slide | The line as it stands | What is missing |
|---|---|---|
| 43 `Application and OS Image` | *"Pick Ubuntu Server 24.04 LTS"* | Why Ubuntu, and not one of the other tabs. The reason is real and one clause long: it is the Linux the next session's Docker install assumes. The AMI analogy that makes the field make sense is the slide **after** |
| 45 `Instance Type` | *"Field 3 is the instance type, the size of the computer. Pick t3.micro"* | Why the smallest. The answer is on slide **46**, the slide after the click, and in the notes |
| 53 `Security Group` | *"Create one, name it nxttrendz-sg, and open port 22 for yourself and port 8000 for your users"* | Better than it was: the two ports now carry who they are for. What a Security Group **is**, and the rule that everything else is shut, are still on slide **54**, after the click. Swapping the pair fixes it |
| 42 `Name and Tags` | *"It is a label for you, and nothing depends on it"* | Nothing missing. The problem is the opposite: this slide teaches nothing and costs 75 seconds. See §8, it folds into `Launch Instance` |

The repair is a reorder, not new content: **put the concept slide before its
field slide in all three pairs**, matching the one pair that already reads that
way (`VPC` 48 then `The Default VPC` 49). After the swap, every section of the
launch form reads *why, then where to click*, and the room learns the rhythm by
the third field instead of never.

---

## 3. Cognitive load

### More than one new word on a slide

- **13 `What the Cloud Gives You`.** The lead is *"The cloud gives you a computer
  to run your server on. It is a real computer in a Data Centre."* It uses
  **Data Centre**, which is taught two slides later at 15, and **server**, which
  is taught seven slides later at 20. The first content slide of the session
  defines the cloud in terms of two words the room has not been given. This is
  the clearest breach of plan §2 beginner rules 1 and 2 in the deck.
  Plainer, and it teaches nothing out of order:
  > *"The cloud gives you a computer that is always on. It sits in a building
  > full of computers, you reach it over the internet, and you pay for the hours
  > you use."*
- **34 `Instance`.** Three bullets carry **public address**, **key file** and
  **SSH**. `SSH` is never expanded anywhere in the deck (it recurs on 53, 58 and
  72). Plan §2 beginner rule 2 says every acronym is expanded once on the slide
  that owns it. Fix on the bullet:
  > *"You log in from your laptop with a key file, using SSH, which is Secure
  > Shell"*
- **63 `What Costs Money`.** Four cards, and with them **Elastic IP**, **gp3**,
  **GB per month** and **data leaving AWS**. Two of the four are things a Free
  plan learner will not meet today. Hard rule 4 applies: name a later problem,
  do not open it. Keep the two meters that are running right now (the instance,
  its disk) and name the other two in one line.

### Two ideas on one slide

- **18 `Why Not Your Own System`** carries two weighed reasons, each with its own
  `OwnVsRented` vignette and its own 35-word paragraph. Hard rule 5 is explicit:
  a numbered series the learner weighs individually gets one slide each. This is
  the textbook case for a split. It is ranked low below only because the two
  cards do build on click, so the room does meet them one at a time.
- **27 `Not the App`** carries the two-doors argument **and** the 18 percent of
  sales / 57 percent of profit figure with its source link. The second is a
  size claim, and the deck has a slide for size claims two frames later
  (29 `The Market Share`). Move the sentence and its link there.

### Three or more consecutive slides with no picture, no question, no pause

Measured against what the deck **renders today**, not against what it will render
when the captures land, because today is when it is reviewed:

- **41 to 57 is seventeen slides carrying twelve `PendingShot` frames.** A dashed
  yellow box is not a picture. For as long as the AWS account is unactivated,
  the hands-on spine of this deck presents as the longest pictureless run in it.
  This is already known and recorded, but it belongs in a flow review because it
  is a flow problem, not only an asset problem: if the captures cannot be taken
  before the session runs, concept 3 must be delivered as a live screen share
  and the deck used as the script.
- **Concept 3 contains no question slide at all, across 24 slides.** So does
  concept 4, across 9. Plan §2 beginner rule 3 ("question, then answer") is
  honoured in C1 (slides 11, 14) and C2 (26) and dropped in the two concepts
  that are longest and most feared. That is backwards.
- 57, 58, 59, 60 is four slides of table, table, table, recap after the launch.
  The room has just done something; this is where attention drops. The recap at
  60 carries figures, so the run is three, at the edge.

---

## 4. Doing against watching

Marked in §0. The shape of the session today:

```
slides  1 ── 3   watch          ~3 min
        4 ── 9   ACT            ~9 min   account, sign in, credits
       10 ──30   watch         ~27 min   agenda, all of C1, most of C2
       31 ──32   ACT            ~3 min   console, find EC2
       33 ──38   watch          ~8 min
       39 ──57   ACT           ~28 min   the launch, with 40/44/46/48/50/54 as watch beats
       58 ──64   watch          ~9 min
       65 ──66   ACT            ~3 min   billing page, budget
       67 ──69   watch          ~4 min
       70        ACT            ~2 min   practice
```

**The finding: slides 10 to 30 is a 21-slide, roughly 27-minute stretch in which
the room touches nothing.** It starts about nine minutes in and ends about
thirty-six minutes in. The brief says a beginner session should not have a
20-minute watch stretch, and this is the only place the deck has one. Everything
after slide 39 is well spaced; the acting in concept 3 is broken up by six
concept beats, which is the right rhythm.

Two moves close it, and neither needs new content:

1. **The budget alert (67) moves into the account block**, after `check-credits`.
   The room acts at about minute 11 instead of minute 9, and, more importantly,
   §1c is fixed at the same time.
2. **`The Console` (31) and `Find EC2` (32) move up to sit immediately after
   `What AWS Is` (28)**, before the market share and the 240 services. "Here is
   what AWS is, now open yours" is a better handoff than "here is what AWS is,
   here is how big it is, here are 240 services, now open yours", and it puts a
   keyboard beat at about minute 33 instead of 38. The one cost is the caption on
   32, *"this is how you reach any of the 240"*, which becomes a forward
   reference; reword it to *"this is how you reach any AWS service"* and let
   slide 30 call back to it.

With those two moves, plus the C1 trims in §8, the longest watch run falls to
about 17 minutes.

---

## 5. Checkpoints

Four `IllustratedRecap` frames, at 24, 36, 60 and 68. There are deliberately no
quiz frames in this deck (session decision, recorded in the session `CLAUDE.md`),
so these four plus the question slides are the only places a lost learner can
rejoin.

| Checkpoint | Sits after | Verdict |
|---|---|---|
| 24 `Cloud in One Line` | 12 slides | Right place, right size |
| 36 `AWS in One Line` | 11 slides | Right place. It also lands immediately after `Six Decisions`, which is the best possible handoff into C3 |
| 60 `Launching in One Line` | **23 slides** | Too late to be the only one. A learner lost at slide 45 has nothing to rejoin for fifteen slides |
| 68 `Billing in One Line` | 7 slides | Right |

**What is missing is a mid-concept-3 checkpoint, and the deck already has the
slide for it.** `Summary and Launch` (56) shows the console's own Summary panel,
which lists exactly the six answers `Six Decisions` (35) promised. The instructor
note already says to read the panel against the six rows. Put that on the slide
instead of in the note and 56 becomes a genuine checkpoint: every learner, lost
or not, can see whether their six answers match before they click the orange
button. That is a copy change, not a new slide.

**Second gap: no checkpoint carries a question.** Adding one question slide at
the head of C3 and one at the head of C4 gives the room two more places to
re-engage, and restores beginner rule 3 to the two concepts that dropped it:

- C3, before `What a Region Is`: *"Your computer will sit in one city. Which
  city, and why does it matter?"*
- C4, before `The Free Plan`: *"Your instance has been running for a few minutes.
  How much has it cost so far?"* The answer on the next frame, roughly a tenth of
  a cent, is the single most calming fact in the session.

---

## 6. The arc

**Does it answer the question it opens with?** Yes. Slide 11 asks *"Where does a
website live when it is not on your laptop?"* and slide 13 answers it in its
lead. Clean.

**Do the concepts hand off?**

- C1 → C2: *"Three companies rent computers this way. This course uses AWS"* (23)
  straight into the AWS divider. Clean.
- C2 → C3: `Six Decisions` (35) names the six sections of the form and opens
  none of them, exactly per hard rule 4. **One seam:** the room is told the form
  asks six things, and then the next three slides are about the Region, which is
  not one of the six and is set before the form opens. A beginner counts.
  One line on 35 repairs it: *"One thing is decided before the form opens: the
  Region."* That names it without opening it, so rule 4 still holds.
- C3 → C4: `Stop or Terminate` (59) already says the disk is kept and still
  billed, which is exactly the thread `What Is Free` (64) picks up. Clean, and
  the best handoff in the deck.

**Does the closing set up the next session?** Yes. `What Comes Next` (72) names
SSH, Docker and the two images, and reuses `CloudPicture` state 2 so the next
deck can open on the same drawing.

**One arc problem the review must name.** The session's most consequential
action, stopping the instance so it does not bill overnight, is explained at
slide 59 and then never done as a step. It appears as item 5 of the `Practice`
slide (71), homework rather than something the room does together. If a room of
beginners leaves a t3.micro running, the deck's promise that nothing costs money
becomes false. **Add one slide before Key Takeaways: `Stop Your Instance`**, the
same `Instance state → Stop instance` capture, with the whole room doing it at
once. It reuses a pending capture that is already on the list, so it costs one
frame and no new asset.

---

## 7. Wording that blocks understanding

Only lines where the wording gets in the way. Copy that is already plain is left
alone.

| Slide | As it stands | Plainer |
|---|---|---|
| 13 | *"The cloud gives you a computer to run your server on. It is a real computer in a Data Centre."* | *"The cloud gives you a computer that is always on. It sits in a building full of computers."* Neither "server" nor "Data Centre" is taught yet |
| 29 | *"Close to three in ten cloud servers in the world are rented from AWS. That is why it is the name in job listings"* | Keep the first sentence. The second is a remark about the fact, which hard rule 29 sends to `notes` |
| 34 | *"You log in with a key file, over SSH, from your laptop"* | *"You log in from your laptop with a key file, using SSH, which is Secure Shell"* |
| 49 | *"Its address range is 172.31.0.0/16, about 65,000 private addresses reserved for you"* | Add the clause that is currently only in the notes: *"The first two numbers are fixed and the last two can be anything. That is about 65,000 private addresses kept for you."* `/16` means nothing to a beginner |
| 63 | *"Four meters run on AWS."* | *"The same meter you watched at Pay for Use runs on AWS too."* The word "meter" is figurative until the callback is made on the slide |
| 43 | *"Pick Ubuntu Server 24.04 LTS"* | *"Pick Ubuntu Server 24.04 LTS. It is the Linux the next session installs Docker on"* |
| 45 | *"Field 3 is the instance type, the size of the computer. Pick t3.micro"* | *"Field 3 is the size of the computer. Pick t3.micro: two small containers need nothing bigger"* |
| 56 | *"The Summary panel on the right lists the six answers. Number of instances is 1. Click Launch instance"* | *"The Summary panel lists your six answers. Check them against the six from Six Decisions, then click Launch instance"* |

Everything else reads plainly. `Not Finished Yet`, `Stop or Terminate`,
`Never Upgrade`, `What Is Free` and all four recaps are good beginner English and
should not be touched.

---

## 8. The proposal: target running order

70 slides. Numbers in the left column are the **proposed** order; the "was"
column gives the current number from §0.

**Legend for "changed":** `kept` · `moved` · `merged` · `split` · `added` ·
`cut` · `copy` (same slide, new wording).

### Opening

| # | was | Title | Concept | Learner does | Changed, and why |
|---|---|---|---|---|---|
| 1 | 1 | Brand | | watch | kept |
| 2 | 2 | Welcome | | watch | kept |
| 3 | 3 | Where We Left Off | | watch | kept |
| 4 | 4 | Your Account First | Before We Start | opens the console | kept |
| 5 | 5+6 | Create the Account | Before We Start | signs up if needed | **merged.** Step 4 of `create-account` already says "choose Free plan". The separate `choose-free-plan` frame repeats it with its own capture. Highlight the Free plan row inside slide 5 instead |
| 6 | 8 | Not Finished Yet | Before We Start | troubleshoots | **moved** up one. It is the blocker most of the room will hit, so it belongs beside the sign-up, not after the sign-in |
| 7 | 9 | Check Your Credits | Before We Start | reads USD 100 | kept |
| 8 | 66 | A Budget Alert | Before We Start | **creates the budget** | **moved** from concept 4. The alarm goes on the meter before anything can run, in the calmest part of the session. Fixes §1c and §4 at once. Lead needs one new clause: *"Nothing is running yet. Set the alarm first"* |
| 9 | 10 | Agenda | | watch | kept |
| 10 | 11 | One Question | | answers | kept |

Cut from the opening: **7 `Sign In`** (a pending capture of a login form that a
room which signed up last session does not need; its three steps fold into the
`Your Account First` note).

### Concept 1 · Cloud Basics — back to the plan's own 10-slide cap

| # | was | Title | Concept | Learner does | Changed, and why |
|---|---|---|---|---|---|
| 11 | 12 | 01 divider | C1 | watch | kept |
| 12 | 13 | What the Cloud Gives You | C1 | watch | **copy.** New lead per §7: no "Data Centre", no "server", neither is taught yet |
| 13 | 14 | Data Centres, a question | C1 | answers | kept |
| 14 | 15+17 | What a Data Centre Is | C1 | watch | **merged.** `A Data Centre` (17) is a pending photograph of the same idea two slides after the drawing. Put the real photograph on this slide, beside the drawing, and the evidence lands with the claim |
| 15 | 16 | Inside a Data Centre | C1 | watch | kept |
| 16 | 18 | Why Not Your Own System | C1 | watch | kept as one slide. **See the optional split in §9** |
| 17 | 20 | What a Server Is | C1 | watch | **merged.** Absorbs the two rows of `A Laptop Is Not a Server` that are not already in slide 16: reachable from outside, one address that never changes. They are the definition of a server, so they belong on the slide that defines one |
| 18 | 22 | Pay for Use | C1 | watch | **moved** up one, and **copy**: it now follows the server definition directly. Absorbs the one-line buy-against-rent contrast from `Buying or Renting` |
| 19 | 23 | Who Rents Them Out | C1 | watch | kept |
| 20 | 24 | Cloud in One Line | C1 | checkpoint | kept |

Cut from C1: **19 `A Laptop Is Not a Server`** (folded into 17) and
**21 `Buying or Renting`** (its unique content is one row: you pay up front and
keep it, against you pay per hour and stop). This brings concept 1 to 10 slides
including its divider, which is the cap the signed-off plan §3 set and the
current deck overran by three.

### Concept 2 · AWS and EC2

| # | was | Title | Concept | Learner does | Changed, and why |
|---|---|---|---|---|---|
| 21 | 25 | 02 divider | C2 | watch | kept |
| 22 | 26 | What You Know | C2 | answers | kept |
| 23 | 27 | Not the App | C2 | watch | **copy.** The 18 percent / 57 percent sentence and its source link move to `The Market Share`, where size claims live |
| 24 | 28 | What AWS Is | C2 | watch | kept |
| 25 | 31 | The Console | C2 | **opens the console** | **moved** up three. Puts a keyboard beat at about minute 33 and shortens the long watch run (§4) |
| 26 | 32 | Find EC2 | C2 | **searches** | **moved** with it. Caption reworded: *"this is how you reach any AWS service"*, since the 240 now come after |
| 27 | 29 | The Market Share | C2 | watch | **moved** down two, and gains the Amazon profit sentence from 23 |
| 28 | 30 | Over 240 Services | C2 | watch | **copy.** Gains the callback: *"you reached EC2 through the search box; that is how you reach any of them"* |
| 29 | 33 | EC2 Rents a Computer | C2 | watch | kept |
| 30 | 34 | Instance | C2 | watch | **copy.** SSH expanded once, per §3 |
| 31 | 35 | Six Decisions | C2 | watch | **copy.** One line added: *"One thing is decided before the form opens: the Region"*, repairing the C2 → C3 seam (§6) without opening it |
| 32 | 36 | AWS in One Line | C2 | checkpoint | kept |

### Concept 3 · Launching an Instance — same spine, why before how

| # | was | Title | Concept | Learner does | Changed, and why |
|---|---|---|---|---|---|
| 33 | 37 | 03 divider | C3 | watch | kept |
| 34 | — | Which City? | C3 | answers | **added.** A `QuestionSlide` restoring beginner rule 3 to the longest concept, and the re-entry point after the longest watch run |
| 35 | 38 | What a Region Is | C3 | watch | kept, and it now answers 34 |
| 36 | 39 | Pick the Nearest | C3 | **sets the Region** | kept |
| 37 | 40 | Availability Zones | C3 | watch | kept here, deliberately. §1b records why, and the callback line moves to `Subnets` |
| 38 | 41+42 | Launch Instance | C3 | **opens the form, types the name** | **merged.** `Name and Tags` is a field that teaches nothing ("nothing depends on it") and costs a frame and a capture. The name is typed as step 4 of opening the form |
| 39 | 44 | AMI | C3 | watch | **moved** before its field. Why, then where to click (§2) |
| 40 | 43 | Application and OS Image | C3 | **picks Ubuntu** | **moved** after the concept, and **copy**: the lead says why Ubuntu |
| 41 | 46 | The t3 Sizes | C3 | watch | **moved** before its field, same reason |
| 42 | 45 | Instance Type | C3 | **picks t3.micro** | **moved** after, and **copy**: the lead says why the smallest |
| 43 | 47 | Key Pair | C3 | **creates the key, downloads the .pem** | kept. Already why-then-how in one lead |
| 44 | 48 | VPC | C3 | watch | kept. This pair was already in the right order |
| 45 | 49 | The Default VPC | C3 | reads the field | **copy.** The plain reading of `/16` moves from the notes onto the slide (§7) |
| 46 | 50 | Subnets | C3 | watch | **copy.** Gains the callback to Availability Zones (§1b) |
| 47 | 51 | Three Subnets | C3 | **picks a subnet** | kept |
| 48 | 52 | Public IP | C3 | **sets Enable** | kept. This is the model slide for §2 |
| 49 | 54 | The Door List | C3 | watch | **moved** before its field |
| 50 | 53 | Security Group | C3 | **ticks Allow SSH** | **moved** after the concept, and **copy**: the lead says why SSH has to be let in |
| 51 | 55 | Configure Storage | C3 | **leaves 8 GiB** | kept |
| 52 | 56 | Summary and Launch | C3 | **clicks Launch**, checkpoint | **copy.** The note "read the panel against the six rows" goes onto the slide, making this the mid-concept checkpoint C3 lacks (§5) |
| 53 | 57 | Instance Running | C3 | **reads the row** | kept |
| 54 | 58 | Two Addresses | C3 | watch | kept |
| 55 | 59 | Stop or Terminate | C3 | watch | kept as the explanation. The doing moves to slide 65 |
| 56 | 60 | Launching in One Line | C3 | checkpoint | kept |

Concept 3 goes from 24 slides to 24, then to **24 minus 1 (name and tags merged)
equals 23** with one question added: net **24 → 24**. It is the same length,
running in a better order, with one real checkpoint in the middle.

### Concept 4 · Billing

| # | was | Title | Concept | Learner does | Changed, and why |
|---|---|---|---|---|---|
| 57 | 61 | 04 divider | C4 | watch | kept |
| 58 | — | What Has It Cost? | C4 | answers | **added.** A `QuestionSlide` about the instance that has been running for twenty minutes. The answer, a fraction of a cent, is the most calming fact in the session, and it restores beginner rule 3 to C4 |
| 59 | 62 | The Free Plan | C4 | watch | kept, and it now answers 58 |
| 60 | 63 | What Costs Money | C4 | watch | **copy.** Two meters, not four: the instance and its disk, the two that are running right now. The idle Elastic IP and data out are named in one line and not opened (hard rule 4). Lead gains the callback to `Pay for Use` (§7) |
| 61 | 64 | What Is Free | C4 | watch | kept |
| 62 | 65 | The Billing Page | C4 | **opens Billing** | kept |
| 63 | 67 | Never Upgrade | C4 | watch | **moved** up one, now the last fact before the recap |
| 64 | 68 | Billing in One Line | C4 | checkpoint | **copy.** Line 3 changes tense: the budget alert is something the room made at slide 8, not something coming |

Already cut from C4 while this review was in progress: **`c4-credits-page`
(`Free Plan Credits`)**, a pending capture of the same USD 100 the room already
read on two panels at slide 7. `The Billing Page` keeps the credits line in
frame. The cut was proposed here independently and is the right one.

### Closing

| # | was | Title | Concept | Learner does | Changed, and why |
|---|---|---|---|---|---|
| 65 | — | Stop Your Instance | Closing | **stops the instance** | **added.** The session's most consequential action, done together rather than left as homework (§6). Reuses the `Instance state → Stop instance` capture already on the pending list |
| 66 | 69 | Key Takeaways | Closing | watch | kept. Still C1 to C4 verbatim, hard rule 20 |
| 67 | 70 | Practice | Closing | acts | **copy.** Item 5 becomes "start it again next session", since the stop now happens in the room |
| 68 | 71 | What Comes Next | Closing | watch | kept |
| 69 | 72 | Feedback | Closing | acts | kept |
| 70 | 73 | Thank You | Closing | watch | kept |

**Total: 70 slides**, down from 73. Agenda and Key Takeaways are untouched and
still carry C1 to C4 word for word; the four concepts, four dividers and four
recaps are all intact.

---

## 9. What each change costs

**Cheap: a reorder, no new words, no new asset.** Apply these first.

- Move `A Budget Alert` into the account block (one lead clause changes)
- Move `The Console` and `Find EC2` up before the market share (one caption edit)
- Swap the three concept-and-field pairs in C3 so why comes before how
- Move `Never Upgrade` up one, ahead of the C4 recap
- Move `Not Finished Yet` beside the sign-up

**Needs new copy, no new asset.** All of these are one line to a few lines.

- The slide 13 lead, rewritten so it stops using two untaught words
- SSH expanded once on `Instance`
- The three why-clauses: Ubuntu, t3.micro, allowing SSH
- The `/16` plain reading moved from notes onto `The Default VPC`
- The Region line on `Six Decisions`
- The checkpoint line on `Summary and Launch`
- The `Pay for Use` callback on `What Costs Money`, plus trimming it to two meters
- The Amazon profit sentence moved from `Not the App` to `The Market Share`
- Two new `QuestionSlide`s (C3 and C4). A question slide carries the question and
  nothing else, hard rule 16, so each is a handful of words
- The three merges and three cuts, each of which is deleting a slide and adding
  one or two bullets to its neighbour

**Needs a new capture or figure.** Only one item, and it is already owed.

- `Stop Your Instance` reuses the `c3-stop-or-terminate` capture, which is
  already on the pending list. Nothing new is needed
- One pending capture **disappears** from the list (`sign-in`), and two more
  become optional (`choose-free-plan` folds into the sign-up capture,
  `c3-name-and-tags` folds into the Launch instance capture). The deck currently
  renders **seventeen** `PendingShot` frames; the proposal takes that to
  **fourteen**, without needing a single new screen

**Considered and not proposed:**

- Splitting `Why Not Your Own System` (18) into one slide per reason. It is the
  correct reading of hard rule 5 and it would help, but the two cards already
  build on click, so the room does meet them one at a time, and the split costs a
  frame in a deck that is already at the top of its time budget. Worth doing if
  the deck later loses four more slides
- Moving `Availability Zones` next to `Three Subnets`. §1b records why not
- Reordering the concepts so Billing comes before the launch. It would fix the
  money ordering more completely than moving one slide, but it breaks the
  agenda's promise order and forces the room to hear about a stopped instance's
  disk before it has an instance. Moving the budget alert alone gets most of the
  benefit for none of the cost

---

## 10. Ranked by how much a beginner gains

A partial application still helps if it is applied in this order.

1. **Create the budget alert before anything runs** (move 66 → after 9). Removes
   fourteen minutes of unmonitored spend, removes the fear that costs the room
   attention for the whole of concept 3, and puts a keyboard beat in the first
   quarter hour.
2. **Swap the three concept-and-field pairs in C3 so the reason comes before the
   click** (AMI before OS Image, t3 sizes before Instance Type, Door List before
   Security Group). Concept 3 is 24 of the 73 slides and it is where a beginner
   either follows or gives up. After the swap, every field reads the same way.
3. **Rewrite the slide 13 lead** so the first content slide of the session stops
   defining the cloud with two words it has not taught, and **expand SSH once**.
   These two lines are the deck's only breaches of its own beginner rules 1 and 2.
4. **Add a question slide at the head of C3 and of C4**, and make
   `Summary and Launch` an explicit check against `Six Decisions`. Three
   re-entry points in the 33 slides that currently have one, at slide 60.
5. **Add `Stop Your Instance` before Key Takeaways.** The room leaves with the
   meter off, which is the difference between "nothing in this session costs
   money" being true and being a hope.

Next after those: move the console tour earlier (§4), trim C1 back to its
ten-slide cap (§8), and cut `What Costs Money` from four meters to two.

---

## 11. Running time

At 75 seconds a slide, with hands-on and console slides at 100, question slides
at 90, dividers and recaps at 40, and the brand, welcome, feedback and thank-you
frames at 40.

| | Current, 73 | Proposed, 70 |
|---|---|---|
| Dividers and recaps | 8 × 40 = 5 min | 8 × 40 = 5 min |
| Question slides | 3 × 90 = 5 min | 5 × 90 = 8 min |
| Brand, welcome, feedback, thanks | 4 × 40 = 3 min | 4 × 40 = 3 min |
| Hands-on and console | 21 × 100 = 35 min | 22 × 100 = 37 min |
| Everything else | 37 × 75 = 46 min | 31 × 75 = 39 min |
| **Total** | **about 94 minutes** | **about 91 minutes** |

**The deck is over its slot either way.** 75 to 90 minutes is the brief; 73
slides do not fit it, and 70 only just reach the top of it with no slack for the
room talking, which this deck deliberately invites on five question slides.

The proposal's saving is small in minutes because it spends most of what it cuts
on two question slides and one hands-on frame, which is a deliberate trade: the
room gets three more places to re-engage in exchange for three minutes. The cuts
that actually buy time are the four in the list below.

If 80 minutes is the real target, cut four more, in this order, each of which
costs the least teaching:

1. `Inside a Data Centre` (proposed 15), its four parts folded into the
   "it fails" card
2. `The t3 Sizes` table half (proposed 41), keeping the `SizeChart` and dropping
   the `DataTable` that repeats it, then merging the frame into `Instance Type`
3. `Three Subnets` (proposed 47), merged into `Subnets`
4. `The Default VPC` (proposed 45), merged into `VPC`

That lands at 66 slides and about 85 minutes, which is the first honest fit.
Below that, the deck starts giving back the just-in-time structure that
revision 3 bought, and it should not.
