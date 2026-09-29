<!-- cSpell:ignore nxttrendz deployement NxtWave colour Mumbai Hyderabad ap-south-1 ap-south-2 AZs t3.micro AMI Synergy CIDR -->
# Deployment · Session 9: "Introduction to AWS"

**STATUS: SIGNED OFF 2026-09-15, revision 2.** Decisions at sign-off: D1 yes,
nothing launched, the zero-spend budget is the one thing created. D7 the
`ShareBar` figure. D8 all four recaps kept. Length: 53 is fine and **no cap,
elaborate wherever it helps the room**. Captures: Claude drives the Chrome
extension with the user signed in. D6 print the rupee figure too. Quiz frames:
none in this session either, recorded here and in the session `CLAUDE.md`, not
as a course rule.

Revision 2 rewrites the flow for absolute beginners. What changed from revision
1 is listed in §9 so you do not have to diff two long documents. Revision 1 is
kept beside this file as `plan.rev1.md`.

## 0. What this session is, in one line

Vocabulary before hands. The learner leaves knowing what the cloud is, what
AWS is, what an EC2 instance, a VPC, a subnet and a Region are, and where the
money goes. Nothing is launched. The next session launches the first instance.

Instruction, 2026-09-15: *"we must focus on only explaining what is AWS, EC2,
VPC, Subnets, Regions and Billing and all. We must start from explaining cloud
basics in at most 10 slides."*

Instruction, 2026-09-15 (second): open Cloud Basics by asking what the cloud
gives you, then why your own machine cannot do the job (it does not scale, it
fails). Open AWS by asking the room what they already know, correct the
"Amazon is a shop" answer, show AWS's share of the world market, and state the
total number of AWS services after cloud basics are done.

## 1. Inputs

| | |
|---|---|
| TR | `/home/nxtwave/docker_jenkins_aws/10_deploying_docker_on_aws_ec2.md` §1, §2 (the why, AWS, EC2, rental terms) and `11_aws_ec2_security_and_networking.md` §4 (public and private IP, VPC), §2.2 only as far as "a door list exists" |
| Not from a TR | Regions and Availability Zones, subnets, the Billing console, Budgets, the market-share figures, the service count. Read off the AWS docs, the Free Tier FAQ and Synergy Research's Q2 2026 tracker on 2026-09-15 (plan §4.2b of session 8 has the Free plan facts) |
| Audience | Absolute beginners, English as a second language for many. Hard rules 26 and 29: plain literal English, titles of 2 to 3 words, leads that state the fact. §2 below adds five beginner rules specific to this deck |
| Carries forward | Session 8's closing block already made everyone create an AWS account on the Free plan. This session opens that console for the first time |
| Session app | `django_deployement_course/deployement_session_9/`, `devPort` 5220 (5219 is session 8), `htmlName` `deployment-session-9` |
| Figure lab | `slide-kit/cloud-lab/`, `devPort` 5236, for `CloudPicture`, `RegionMap` and `ShareBar` before a deck slide is written (hard rule 17) |

## 2. The five beginner rules for this deck

These sit on top of the hard rules and are what revision 2 is mostly about.
Anyone generating a slide in this deck checks against them.

1. **One new word per slide.** A slide introduces at most one term the room has
   not heard. Region, Availability Zone, VPC, subnet, Security Group, instance,
   AMI and key pair therefore get a slide each. No slide teaches two nouns.
2. **Every acronym is expanded once, in the lead, on the slide that owns it.**
   AWS is Amazon Web Services. EC2 is Elastic Compute Cloud. VPC is Virtual
   Private Cloud. AMI is Amazon Machine Image. After that the short form is
   used everywhere, including in speech.
3. **Question, then answer.** Each concept opens with a question the room can
   attempt, and the next slide answers it. A learner who has guessed remembers
   the answer; one who was told does not.
4. **Every concept closes with one line per idea.** Four recap slides, one at
   the end of each concept. They are not the Key Takeaways slide; they are the
   concept's own summary, in the same words the divider used.
5. **Anchor every new idea to something the room already owns.** Docker image
   to AMI. Electricity meter to cloud bill. A city, a building, a floor for
   Region, Availability Zone and subnet. Compose's network for the VPC.

## 3. Concept map (four concepts, one divider each)

| # | Concept name (agenda) | TR sections mapped here |
|---|---|---|
| 1 | `Cloud Basics` | TR 10 §1.2, §1.3 (why a laptop cannot be the server, renting), plus what "cloud" and "pay for use" mean. **At most 10 slides, on instruction** |
| 2 | `AWS and EC2` | TR 10 §2.1, §2.2, §2.3 (what AWS is, EC2, instance, instance type, AMI, key pair named only), plus market share and the service count |
| 3 | `Regions and Networks` | TR 10 §2.3 Region row; TR 11 §4.1 (public and private IP, VPC); subnets and Availability Zones from the AWS docs |
| 4 | `Billing` | Session 8 plan §4.2b (the Free plan), TR 10 §2.3 Free Tier warning, TR 11 §4.3 note (Elastic IP costs when idle), Billing console and Budgets from the AWS docs |

Rule 20: Key Takeaways restates exactly these four names.

## 4. Decisions to confirm at sign-off

| # | Decision | Recommendation | Why |
|---|---|---|---|
| D1 | Hands on the keyboard? | **No launching.** Learners open their own console and *find* things: the Region selector, EC2, VPC, Billing. The only thing they create is a zero-spend budget | The user's brief is "only explaining". Creating an instance belongs to the next session, where it gets its own screenshots and the key pair |
| D2 | Security Groups | **One slide, named as "the door list", no rules written** | TR 11 spends a whole session on it. Here the learner only needs to know a firewall exists and where it sits in the picture |
| D3 | Quiz frames | **None.** Instruction 2026-09-15: "No Quiz Slides" | Second deck in a row with this instruction. Proposed at sign-off: record it as a course rule so it is not asked again |
| D4 | Screenshots of the console | **Every console slide is a real capture** from the user's own AWS account, cropped so the 12-digit account ID never shows | Hard rule 30. The console cannot be captured signed out, so the user captures or the extension does with the user signed in |
| D5 | Regions example | **Mumbai, `ap-south-1`**, with Hyderabad `ap-south-2` as the second Indian region | Nearest to the room; the next session launches there |
| D6 | Costs shown in | **USD, as the console shows them**, with one rupee figure where it helps (the Free plan credit is about ₹9,590 at 95.9 rupees to the dollar, 2026-09-15) | Mixing currencies on a slide confuses; the console is in dollars |
| D7 | Market share on slide 20 | **A small `ShareBar` figure**, three named bars plus a grey "everyone else" bar, built session-local in `cloud-lab`, not added to the kit | Four numbers would normally be a table by §7.6, but this is the one case where bars say what a table cannot: AWS is bigger than the next two put together. Fallback if you would rather build nothing: a `DataTable` with a share column |
| D8 | Per-concept recap slides | **Four, one per concept**, beginner rule 4 | Adds four frames. They are the cheapest slides in the deck to present, roughly twenty seconds each, and they are where a lost learner rejoins |

## 5. Slide-wise plan

Fixed frame first, then the four concepts. `CAPTURE` marks a real screenshot
to take before generation (stage 3). Every title is 2 to 3 words. Every lead is
a plain statement.

### Opening (10). Slides 3a to 3e are the account block added on instruction; final numbering is fixed at generation

| # | Title | Type | Content |
|---|---|---|---|
| 1 | Brand | `BrandSlide` | NxtWave mark only |
| 2 | Welcome | `WelcomeSlide` | Introduction to AWS |
| 3 | Where We Left Off | `StatusList` | Pipeline pushes two images on every push (green). An AWS account exists on the Free plan (green). Nothing runs the images yet (red) |
| 3a | Your Account First | `ContentNoteSlide`, kicker `Before We Start` | Instruction 2026-09-15: the session opens by finishing the account. Three points: everyone needs a signed-in console today; the Free plan gives USD 100 of credit; nothing in this session costs money |
| 3b | Create the Account | `Shot` (reuse session 8 `aws-signup.png`) + `StepList` | portal.aws.amazon.com/billing/signup: email, name, verify, password, contact details, card for identity, phone code. Anyone not done finishes now; the others move to 3d |
| 3c | Choose Free Plan | `Shot` (reuse session 8 `aws-free-vs-paid-plan.png`) | Free plan, not Paid. The only choice in the sign-up that matters for money |
| 3d | Sign In | `Shot` **CAPTURE** | signin.aws.amazon.com, Root user, email. Then the console home in Asia Pacific (Mumbai). Caption names the Region at the top right |
| 3e | Check Your Credits | `Shot` x2 (**captured**: `aws-free-plan-status.png`, `aws-cost-and-usage-credits.png`) | Click your account name at the top right. Free plan status: Credits remaining USD 100.00, Days remaining 182. The same figure sits in the Cost and usage widget on the console home. Everyone confirms they see USD 100 before the session goes on |
| 4 | Agenda | `AgendaSlide` | Cloud Basics · AWS and EC2 · Regions and Networks · Billing |
| 5 | One Question | `QuestionSlide` | "Where does a website live when it is not on your laptop?" Answer is the next concept |

### Concept 1 · Cloud Basics (divider + 9 = 10, the cap)

| # | Title | Type | Content |
|---|---|---|---|
| 6 | 01 divider | `SectionBreakerSlide` | Cloud Basics |
| 7 | What the Cloud Gives You | `ContentNoteSlide` | Answers slide 5. Lead: the cloud gives you a computer to run your server on. Three points: it is a real computer in someone else's building; you reach it over the internet; you pay for the hours you use |
| 8 | Why Not Your Own System | `CardGrid` (2 cards) | Asked as a question, answered in two cards. **It does not scale**: your laptop has the RAM it has; ten users is fine, ten thousand is not, and you cannot add nine more laptops in a minute. A rented computer changes size in minutes. **It fails**: a power cut, wifi dropping, the lid closing, a Windows update, carrying it to class. Each one takes your site down. A data centre has backup power, a spare network and someone awake at 3 a.m. |
| 9 | A Laptop Is Not a Server | `DataTable` | The four remaining rows from TR 10 §1.2: always on, reachable from outside, stable address, not being edited. Left column what a service needs, right column what a laptop does. Slide 8 gave the two big reasons; this finishes the list |
| 10 | What a Server Is | `CloudPicture` state 1 (**build**, §7) | One computer, always on, with a public address. Your app inside, the internet outside. A small laptop beside it, greyed, with no arrow reaching it |
| 11 | Buying or Renting | `DataTable` | Buy a machine: pay upfront, find a room, cool it, fix it. Rent one: pay per hour, turn it off when done. Rule 5 not needed, both columns short |
| 12 | A Data Centre | `Shot` (**asset**, §7.5) | What the building looks like. One picture, one sentence: thousands of computers, cooled, guarded, always on. This is the visual proof of the "it fails" card on slide 8 |
| 13 | Pay for Use | `AnalogyMap` | Electricity meter to cloud bill: you do not buy the power station, you pay per unit, the meter runs only while the light is on |
| 14 | Who Rents Them Out | `CardGrid` (3 cards) | AWS, Microsoft Azure, Google Cloud. One line each. AWS is the one this course uses. No size claim here; the numbers arrive on slide 20 |
| 15 | Cloud in One Line | `RecapSlide` | Three lines: your own machine cannot grow and cannot stay up; a server is an always-on computer with a public address; the cloud rents you one by the hour |

### Concept 2 · AWS and EC2 (divider + 13)

| # | Title | Type | Content |
|---|---|---|---|
| 16 | 02 divider | `SectionBreakerSlide` | AWS and EC2 |
| 17 | What You Know | `QuestionSlide` | "Let us see what AWS is. What do you already know about it?" Take two or three answers aloud. Most rooms say Amazon, shopping, delivery. That answer is the setup for slide 18 |
| 18 | Not the Shop | `DataTable` | Two columns, same company. *amazon.in*: you buy things, it is a shop, it is the part you have used. *AWS*: Amazon Web Services, it rents computers to other companies, started 2006, it is the part that runs other people's websites. Closing line: AWS was about 18 percent of Amazon's sales in 2025 but about 57 percent of its operating profit |
| 19 | What AWS Is | `ContentNoteSlide` | Amazon's cloud. It rents computers, disks, databases and networks by the hour, from data centres in many countries. This course uses one of its services, EC2 |
| 20 | The Market Share | `ShareBar` (**build**, §7.3) | Where the world's cloud servers are rented from. Synergy Research, Q2 2026: AWS 28 percent, Microsoft Azure 20 percent, Google Cloud 15 percent, the three together 63 percent. Lead: about one in four cloud servers in the world is AWS. That is why it is the name in job listings. Source and quarter printed on the slide |
| 21 | Over 240 Services | `CardGrid` (4 cards) | AWS has more than 240 services (aws.amazon.com wording, checked 2026-09-15; older pages say 200). Four cards with their real names: EC2 for computers, S3 for files, RDS for databases, VPC for networks. Closing line: you do not need 240. This course uses one, EC2, and looks at a second, VPC |
| 22 | The Console | `Shot` **CAPTURE** | console.aws.amazon.com home after sign in. Highlight the search box and the Region name at the top right. Account ID cropped out |
| 23 | Find EC2 | `Shot` **CAPTURE** | The search box with "EC2" typed and the result. Caption ties back to slide 21: this is how you reach any of the 240 |
| 24 | EC2 Rents a Computer | `LayerStack` + `CloudPicture` state 2 | Elastic Compute Cloud. Amazon data centre, physical server, EC2 instance (yours), Docker Engine, your containers. TR 10 §2.2, drawn |
| 25 | Instance | `ContentNoteSlide` | AWS's word for one rented computer. It has a public IP, it is always on until you stop it, you log in over SSH. Three points |
| 26 | Instance Type | `DataTable` | t3.micro: 2 vCPU, 1 GiB. t3.small: 2 vCPU, 2 GiB. t3.medium: 2 vCPU, 4 GiB (AWS writes GiB). Column "fits this course": yes, more than needed, more than needed. **CAPTURE** the EC2 instance types page if it reads clearly, else the table |
| 27 | AMI | `AnalogyMap` | Amazon Machine Image. Docker image is to container what AMI is to instance. The template the computer boots from. Ubuntu Server 24.04 is ours |
| 28 | Key Pair | `ContentNoteSlide` | One sentence only: the file that lets you in instead of a password. Made when the instance is launched, next session |
| 29 | AWS in One Line | `RecapSlide` | Three lines: AWS is Amazon's cloud, the largest in the world; EC2 is the service that rents you one computer; one rented computer is called an instance |

### Concept 3 · Regions and Networks (divider + 9)

| # | Title | Type | Content |
|---|---|---|---|
| 30 | 03 divider | `SectionBreakerSlide` | Regions and Networks |
| 31 | What a Region Is | `ContentNoteSlide` | A Region is a city with AWS data centres in it. Three points: everything you create lives in one Region; the console shows one Region at a time; prices differ a little between them. Anchor for the whole concept: a city, then a building, then a floor |
| 32 | Pick the Nearest | `RegionMap` (**build**, §7.2) + `Shot` **CAPTURE** | World outline with Regions as dots, zoomed to India: Mumbai `ap-south-1`, Hyderabad `ap-south-2`. Beside it, the real Region selector opened at the top right of the console with Asia Pacific (Mumbai) highlighted. Nearer means faster for your users |
| 33 | Availability Zones | `RegionMap` zones state | `ap-south-1a`, `1b`, `1c`. Three separate buildings in one city. If one loses power the others do not. You will use one |
| 34 | VPC | `CloudPicture` state 3 | Virtual Private Cloud. Your own private network inside AWS. Every account gets one by default. Instances inside talk to each other privately. TR 11 §4.1's compose-network comparison, made in words |
| 35 | The Default VPC | `Shot` **CAPTURE** | VPC console, Your VPCs, the one default VPC with its CIDR `172.31.0.0/16`. Caption reads the range in plain words: about 65,000 private addresses reserved for you |
| 36 | Subnets | `Shot` **CAPTURE** + `CloudPicture` state 4 | VPC console, Subnets: three default subnets, one per Availability Zone. A subnet is a slice of the VPC placed in one building. Public subnet: reachable from the internet. Private: not |
| 37 | Two Addresses | `DataTable` | TR 11 §4.1 table: public IPv4 `13.235.67.89` for users and SSH; private IPv4 `172.31.8.142` for AWS-internal traffic |
| 38 | The Door List | `CloudPicture` state 5 + note | A Security Group sits in front of the instance and lists which ports may be reached, by whom. Closed unless listed. The whole of a later session; today only its place in the picture |
| 39 | Networks in One Line | `RecapSlide` | Three lines: a Region is a city and a zone is a building in it; a VPC is your own private network and a subnet is a slice of it in one building; an instance has a private address inside and a public one outside |

### Concept 4 · Billing (divider + 8)

| # | Title | Type | Content |
|---|---|---|---|
| 40 | 04 divider | `SectionBreakerSlide` | Billing |
| 41 | The Free Plan | `DataTable` | USD 100 credit on sign-up, up to 200. No charge unless you click Upgrade. Card kept for identity only. Account closes at 6 months. From session 8 plan §4.2b |
| 42 | What Costs Money | `CardGrid` (4 cards) | A running instance, per hour. A disk, per GB per month. An Elastic IP that is not attached. Data leaving AWS, per GB. Verified 2026-09-15 for Mumbai: t3.micro USD 0.0112 per hour; gp3 disk USD 0.0912 per GB-month; an idle public IPv4 (an unattached Elastic IP) USD 0.005 per hour, about USD 3.65 a month; data out to the internet USD 0.1093 per GB after the first 100 GB a month, which is free |
| 43 | What Is Free | `StatusList` | A stopped instance's CPU (green). Data coming in (green). The VPC, subnets and security groups (green). The disk of a stopped instance (red, still billed, which is why next session ends with Stop, not just closing the tab) |
| 44 | The Billing Page | `Shot` **CAPTURE** | Billing and Cost Management home showing credits and a zero bill. Account ID cropped |
| 45 | Free Plan Credits | `Shot` **CAPTURE** | The Credits page showing the USD 100 |
| 46 | A Budget Alert | `Shot` **CAPTURE** + `StepList` | Budgets, Create budget, Zero spend budget template, an email. Three steps. This one the learner does today |
| 47 | Never Upgrade | `Callout` on `ContentSlide` | The only click that can cost money is Upgrade to Paid plan. It is one deliberate button. Do not press it during this course |
| 48 | Billing in One Line | `RecapSlide` | Three lines: the Free plan gives you USD 100 and cannot charge your card; you pay for a running instance and its disk, not for the network; a budget alert emails you before anything surprises you |

### Closing (5)

| # | Title | Type | Content |
|---|---|---|---|
| 49 | Key Takeaways | `KeyTakeawaysSlide` | Cloud Basics · AWS and EC2 · Regions and Networks · Billing, one outcome line each, in a different UI than the agenda |
| 50 | Practice | `PracticeSlide` | Open your console. Set the Region to Mumbai. Open EC2, then VPC, then Billing. Create the zero-spend budget. Send one screenshot of the budget |
| 51 | What Comes Next | `ContentNoteSlide` | Next session launches the first instance in Mumbai and runs the two images on it |
| 52 | Feedback | `FeedbackSlide` | |
| 53 | Thank You | `ThankYouSlide` | |

**53 slides.** Concept 1 is exactly 10 including its divider. No quiz frame, on
instruction. Four recap slides, one per concept, per beginner rule 4.

## 6. Captures to take before generation (stage 3)

All from the user's AWS account, signed in, Region set to Mumbai, at 2x or
browser zoom 150 percent so crops stay sharp. Account ID and email cropped out
of every one.

| Slide | Page | What must be visible |
|---|---|---|
| 22 | Console home | search box, Region name top right |
| 23 | Search "EC2" | the dropdown result |
| 26 | EC2, Instance Types, filter t3 | t3.micro row with vCPU and memory |
| 32 | Region selector open | Asia Pacific (Mumbai) `ap-south-1` |
| 35 | VPC, Your VPCs | default VPC, CIDR `172.31.0.0/16` |
| 36 | VPC, Subnets | three subnets with their Availability Zones |
| 44 | Billing home | zero bill, credits line |
| 45 | Billing, Credits | USD 100 remaining |
| 46 | Budgets, Create budget | Zero spend budget template |

Slide 12 needs a photo or page, not a console capture: the AWS Global
Infrastructure page at aws.amazon.com/about-aws/global-infrastructure is
public and can be captured at 2x with the DevTools browser.

## 7. Illustrations: where they go and why

This is a new domain for the kit. Every figure in it so far draws Docker,
Compose or Jenkins, and hard rule 8 says a figure must depict the slide's own
concept, so most of them cannot be reused here. The rule for this deck:

**One picture grows through the deck.** A learner who sees a new diagram on
every slide has to re-learn the drawing each time. Instead, one figure,
`CloudPicture`, appears on slide 10 as the simplest possible drawing and gains
one layer per concept, in the same place, in the same colours, so on slide 38
the room reads the whole of AWS networking in a drawing they have known since
slide 10. `continuity.ts` keeps the shared parts still between neighbouring
slides. Rule 6: each new layer reveals in step with the line of text that names
it.

### 7.1 `CloudPicture`, the figure that grows (build in the kit)

| State | Slide | What is added | The one sentence it argues |
|---|---|---|---|
| 1 | 10 | A box labelled "a server", one public address on it, the Internet as a cloud outline on the left, an arrow reaching the box. A small laptop, greyed, with no arrow reaching it | A server has an address the internet can reach. A laptop does not |
| 2 | 24 | The box gains an outer frame, "Amazon data centre, Mumbai", and inside it the layers: EC2 instance, Docker Engine, two containers | The rented computer is the same computer, in someone else's building |
| 3 | 34 | A dashed frame around the instance labelled VPC `172.31.0.0/16`, a second instance beside it, a short private arrow between the two | Your instances share a private network nobody else is on |
| 4 | 36 and 37 | The VPC splits into three columns, `ap-south-1a`, `1b`, `1c`, each a subnet; the instance sits in one; its two addresses are written on it, public outside the frame, private inside | A subnet is a slice of the VPC in one building; the instance has an inside address and an outside one |
| 5 | 38 | A small gate on the arrow from the Internet to the instance, with two rows on it: 22 you, 8000 everyone | The Security Group is the door list on the way in |

Built as one component with a `state` prop (1 to 5), colours from `tokens.ts`,
entrances at the explanatory tier (520 ms, 130 ms stagger). Prototyped first in
`slide-kit/cloud-lab` (devPort 5236), screenshotted in all five states and
looked at (hard rule 17), then moved into
`slide-kit/slide-template/src/ui/CloudPicture.tsx`, added to `sampleDeck.tsx`
and the registry, and raised as a PR. Sessions 10 and 11 reuse states 4 and 5
when they launch the instance and write the Security Group rules, which is what
earns it a place in the kit.

### 7.2 `RegionMap` (build in the kit)

Slides 32 and 33. A simplified world outline with AWS Regions as dots, then a
zoom to India with Mumbai and Hyderabad named, then Mumbai opened to show three
buildings, `ap-south-1a`, `1b`, `1c`. Two states, `world` and `zones`. It argues
the two things a list cannot: Regions are places, and a Region is more than one
building. Next to it on slide 32 sits the real console capture of the Region
selector, so the drawing and the screen agree.

### 7.3 `ShareBar` (build, session-local)

Slide 20 only. Four horizontal bars on one baseline: AWS 28, Azure 20, Google
Cloud 15, everyone else 37, the last in grey. Source line under it, small:
Synergy Research Group, Q2 2026. Prototyped in `cloud-lab` with the others but
**not** promoted to the kit, since no other session needs a share chart; it
ships inside the session app. The figure's job is one glance: AWS is larger
than the next two together. If D7 goes the other way, this becomes a
`DataTable` and nothing else in the plan changes.

The numbers move every quarter and sources disagree in the 28 to 31 percent
range depending on whether they count infrastructure only. One source, one
quarter, both printed on the slide; re-read on the day the deck is generated.

### 7.4 Kit figures reused where they fit

| Slide | Figure | Why it fits this slide's concept |
|---|---|---|
| 13 Pay for Use | `AnalogyMap` | It exists to map a known idea onto a new one: electricity meter to cloud bill |
| 24 EC2 Rents a Computer | `LayerStack` | The layers from the data centre down to your containers are literally a stack. Used together with `CloudPicture` state 2, or instead of it if the slide gets crowded; decide when looking at the render |
| 27 AMI | `AnalogyMap` | Docker image to container, AMI to instance. The learner already owns the left half |
| 38 The Door List | `Illustration name="ports-doors"` as a small aside | Already in the kit for exactly the "ports are doors" idea |

`MachineBoundary` is **not** reused for slide 10 even though it draws a
boundary: its scope note says the failed request at localhost is its point,
which is the opposite of what slide 10 says. `ComposeNetwork` is not reused for
the VPC: it draws containers, and the comparison is made in words on slide 34.

### 7.5 Photographs and logos

| Slide | Asset | Source and handling |
|---|---|---|
| 12 A Data Centre | one photograph of an AWS data centre, or the AWS Global Infrastructure page | Public page captured at 2x with the DevTools browser. If a photo is preferred, it needs a free licence, attribution in `workflow/assets-manifest.md`, and your approval before download (workflow stage 2 rule) |
| 14 Who Rents Them Out | `companies/amazon.png`, `companies/microsoft.png`, `companies/google.png` | Already in `slide-kit/assets/companies/`. **Missing: an AWS mark** for slides 16 to 22. Add `tech/aws.png` to `slide-kit/assets/tech/` first (hard rule 13), then copy into the session |
| 18 Not the Shop | the Amazon smile mark and the AWS mark, side by side | Same two files. The slide's whole point is that these are one company wearing two names |
| 20 The Market Share | the three company marks as bar labels | Reuses `companies/`, no new asset |
| 27 AMI | `tech/linux.png` | Exists. An Ubuntu mark would be nearer; add `tech/ubuntu.png` to the library if approved |
| Dividers | `SectionBreakerSlide` | One topic-specific illustration each: a cloud outline (1), a server rack (2), a map pin (3), a meter (4). Drawn as `signal-geometry` style abstract SVGs in the kit, not stock art |

### 7.6 Where a table beats a picture

Slides 9, 11, 18, 26, 37 and 41 stay tables. Each is a comparison with two or
three columns of short facts; a drawing would only decorate them. Slide 20 is
the deliberate exception, argued in §7.3.

## 8. Timing sketch

At roughly 75 seconds a slide for a beginner room, with slides 17 and 8 running
long because the room talks, and the four recaps running short:

| Block | Slides | Minutes |
|---|---|---|
| Opening | 5 | 5 |
| Cloud Basics | 10 | 14 |
| AWS and EC2 | 14 | 18 |
| Regions and Networks | 10 | 14 |
| Billing | 9 | 13, including the budget everyone creates |
| Closing | 5 | 6 |
| | **53** | **about 70 minutes** |

## 9. What changed from revision 1

| Change | Where |
|---|---|
| Concept 1 now opens with what the cloud gives you, then why your own machine cannot do it, in two cards: it does not scale, it fails | New slides 7 and 8 |
| Old "The Cloud" slide is gone as its own frame; its definition became the lead of slide 7, so it answers slide 5 instead of arriving four slides later | Removed |
| Old "What You Can Rent" is gone from Concept 1; the same four things get their real names on slide 21 | Merged into 21 |
| Concept 2 now opens by asking the room what AWS is, then correcting "it is a shop" | New slides 17 and 18 |
| AWS's world market share is now its own slide with a source, a quarter and a figure, instead of a note in passing | New slide 20 |
| The total service count, more than 200, is stated right after cloud basics are finished | New slide 21 |
| Concept 3 now defines a Region before showing the map and the selector, and merges the old map and capture slides into one | Slides 31 and 32 |
| Old "Stop When Done" is cut; one line about the disk of a stopped instance moved into What Is Free, and Stop itself belongs to the session that launches something | Slide 43 |
| Each concept now ends with a one-line recap | Slides 15, 29, 39, 48 |
| Every acronym is expanded once on the slide that owns it | Beginner rule 2 |
| 47 slides became 53 | Total |

## 10. Open questions for the user

1. D1: agree that nothing is launched this session, and that the zero-spend
   budget is the one thing the room creates?
2. D7: `ShareBar` as a small built figure, or a plain table?
3. D8: keep all four recap slides? They are what takes the deck from 49 to 53.
4. Is 53 slides and about 70 minutes the right size for this room?
5. Who captures the console: you, sending screenshots as in session 8, or the
   extension with you signed in?
6. The Free plan credit is USD 100, about ₹9,590. Confirm you want the rupee
   figure printed on slide 41 as well as the dollar one (D6).

## 11. Facts, verified 2026-09-15 by source (re-read again on the day if the deck is regenerated later)

Numbers that came from the 2026-09-15 draft and must be re-read from their
source before they are typed onto a slide. Each slide prints its source.

| Slide | Claim | Source to re-read |
|---|---|---|
| 18 | AWS was about 18 percent of Amazon's 2025 sales and about 57 percent of its operating profit | Amazon's 2025 annual report, segment results |
| 20 | AWS 28, Azure 20, Google Cloud 15 percent of world cloud infrastructure, Q2 2026 | Synergy Research Group's quarterly release for Q2 2026 |
| 21 | more than 200 services | aws.amazon.com/what-is-aws |
| 26 | t3.micro 2 vCPU 1 GB, t3.small 2 vCPU 2 GB, t3.medium 2 vCPU 4 GB | EC2 instance types page, or the console capture |
| 41 | USD 100 credit, up to 200, no charge unless upgraded, closes at 6 months | aws.amazon.com/free and its FAQ, as recorded in session 8 plan §4.2b |
| 42 | the four Mumbai prices | EC2 and EBS pricing pages, Region Asia Pacific (Mumbai) |

---

## 12. Revision 3, 2026-09-16: the session launches an EC2 instance

**Scope change, given by the user after rev2 was signed off and generated:**

> "Also include hands-on on creation of EC2 in the process. Explain each
> concept instead of explaining randomly."

Two further corrections on the same day, folded into the same pass:

> "Take access through browser and take screenshot create and add parallel to
> the existing explanation in the flow of creation an EC2" — attempted. The
> account is still not activated: `ec2/home` redirects to
> `signup.aws.amazon.com/billing/signup/incomplete`, so every screen of the
> launch flow stays a `PendingShot` with its exact `at` path, and the captures
> are taken the day the account activates.

> Every source printed on a slide carries its link, so the exported HTML is
> clickable. The label is the anchor; the raw URL is never printed.

### D1 is reversed

| Decision | Rev2 | Revision 3 |
|---|---|---|
| D1 Hands on the keyboard? | **No launching.** The room only *finds* things | **The room launches one t3.micro instance and stops it before the session ends.** The zero-spend budget is still created |

The reason rev2 gave for D1 ("creating an instance belongs to the next
session") no longer holds: the user wants the creation taught here, and the
next session starts from a running instance and logs in to it over SSH.

### Concept 3 is renamed and rebuilt

`Regions and Networks` becomes **`Launching an Instance`**. The agenda line,
the divider, the concept recap and Key Takeaways all read the `C3` constant in
`src/decks/deckShared.tsx`, so the rename lands once (hard rule 20: the agenda
and the takeaways carry the same four names, word for word).

Its spine is the launch form, one field per slide, and each field's concept is
explained at the field that uses it rather than in a tour of its own:

1. What a Region Is, then Pick the Nearest: the Region is set before the form
   is opened, because the instance is created in the Region at the top right
2. Availability Zones
3. Launch Instance: EC2 → Instances → Launch instance
4. Name and Tags
5. Application and OS Image, where the AMI is named and expanded
6. AMI: the Docker-image analogy, at the field
7. Instance Type, then The t3 Sizes, at the field
8. Key Pair, at the field, with the .pem file downloading once and never again
9. Network settings, field by field: VPC, The Default VPC, Subnets, Three
   Subnets, Public IP, Security Group, The Door List
10. Configure Storage: 8 GiB gp3, and the disk billed while stopped
11. Summary and Launch
12. Instance Running, then Two Addresses read off that row
13. Stop or Terminate

Concept 2 keeps what AWS is, the two doors, the market share, the 240
services, the console, finding EC2 and what an instance is, and **ends with one
overview slide, `Six Decisions`**, that names the six sections of the form and
opens none of them (hard rule 4). Instance type, AMI and Key pair moved out of
concept 2 into the field that uses them.

### Counts

| | Rev2 | Revision 3 |
|---|---|---|
| Concept 2 | divider + 13 | divider + 11 |
| Concept 3 | divider + 10 | divider + 23 |
| Deck | 63 | **74** |
| Pending captures | 8 | **19**, fourteen of them in concept 3 |

### Other slides that had to follow (hard rule 9)

- Agenda sub line for C3
- `Your Account First`: "nothing is created except one budget alert" becomes
  the honest line, one t3.micro for part of the session, a few cents of credit
- `Where We Left Off`: "today we launch the computer that will run them"
- `What Costs Money`: the first meter is the instance the room just launched
- `Practice`: `Launch, then stop`, ending with Instance state → Stop instance
- `What Comes Next`: the next session logs in over SSH and installs Docker
- `Not the Shop` becomes **`Not the App`**: amazon.in is the e-commerce app
  people use, not "a shop", and `TwoDoors` draws a phone on the left step

### New figure

`src/decks/figures/LaunchForm.tsx`: the six sections of the launch form as one
labelled panel, numbered in the order the form asks for them, each with one
plain line saying what it decides. It is never a mock screenshot: no AWS
chrome, no orange button, no field values. The real screens are the captures on
the slides that follow.

---

## 13. Capture checklist: the exact values that must be on screen

User, 2026-09-16, and it is strict: every name, port, address and Security
Group in the figures, tables, captions and pending-capture lines is the SAME
value the screenshot will show, and the walk-through is exactly the path a
student follows, with no shortcut a student would not take. The values are
declared once in `src/decks/deckShared.tsx` and every slide and figure reads
them from there. This table is the same set, for whoever takes the screenshots.

### The canonical values

| Value | What it is |
|---|---|
| Region | `Asia Pacific (Mumbai)`, `ap-south-1` |
| Availability Zone | `ap-south-1a` (siblings `ap-south-1b`, `ap-south-1c`) |
| Instance name, typed | `nxttrendz-server` |
| AMI, chosen | `Ubuntu Server 24.04 LTS` |
| Instance type, chosen | `t3.micro` |
| Key pair name, typed | `nxttrendz-key`, giving the file `nxttrendz-key.pem` |
| Security Group name, typed | `nxttrendz-sg` |
| VPC range | `172.31.0.0/16` |
| Disk | `8 GiB`, `gp3` |
| Ports | 22 open to My IP, 8000 open to Anywhere, **5432 never listed** |
| Public IPv4, private IPv4 | `13.235.67.89`, `172.31.8.142` are EXAMPLES. AWS assigns them. Replace both constants with the real values off the capture the moment the instance is launched |

### The Security Group rules to create

| Type | Port | Source | On the slide |
|---|---|---|---|
| SSH | 22 | My IP | Yes, ticked as Allow SSH traffic from |
| Custom TCP | 8000 | Anywhere | Yes, added as a second rule |
| PostgreSQL | 5432 | — | **Nothing is added.** It stays closed, and that is the point of The Door List (TR 11 §4) |

### The captures, in deck order

| Slide | `at` path | What must be on screen |
|---|---|---|
| A Data Centre | `aws.amazon.com/about-aws/global-infrastructure` | The map of Regions and the count of Data Centres |
| Pick the Nearest | `Console → top right → Region` | The Region list, `Asia Pacific (Mumbai) ap-south-1` selected, `Asia Pacific (Hyderabad) ap-south-2` below it |
| Launch Instance | `EC2 → Instances → Launch instance` | The empty instances table, the orange Launch instance button, `Asia Pacific (Mumbai)` at the top right |
| Name and Tags | `EC2 → Instances → Launch instance → Name and tags` | `nxttrendz-server` typed into Name |
| Application and OS Image | `EC2 → Instances → Launch instance → Application and OS Images (Amazon Machine Image)` | Ubuntu chosen, `Ubuntu Server 24.04 LTS`, Free tier eligible |
| Instance Type | `EC2 → Instances → Launch instance → Instance type` | `t3.micro`, its 2 vCPU, 1 GiB and hourly price |
| Key Pair | `EC2 → Instances → Launch instance → Key pair (login) → Create new key pair` | `nxttrendz-key` typed, RSA, `.pem` |
| The Default VPC | `EC2 → Instances → Launch instance → Network settings → Edit → VPC` | The default VPC and `172.31.0.0/16` |
| Three Subnets | `EC2 → Instances → Launch instance → Network settings → Edit → Subnet` | The three subnets `ap-south-1a`, `1b`, `1c`, with `ap-south-1a` chosen |
| Public IP | `EC2 → Instances → Launch instance → Network settings → Edit → Auto-assign public IP` | The dropdown reading `Enable` |
| Security Group | `EC2 → Instances → Launch instance → Network settings → Firewall (security groups)` | Create security group, `nxttrendz-sg` typed, SSH 22 from My IP, Custom TCP 8000 from Anywhere, nothing for 5432 |
| Configure Storage | `EC2 → Instances → Launch instance → Configure storage` | One root volume, `8 GiB`, `gp3` |
| Summary and Launch | `EC2 → Instances → Launch instance → Summary → Launch instance` | The six answers in the Summary panel, Number of instances 1, the Launch instance button |
| Instance Running | `EC2 → Instances` | One row: `nxttrendz-server`, Instance state `Running`, the public IPv4 address, the instance ID |
| Stop or Terminate | `EC2 → Instances → Instance state → Stop instance` | The Instance state menu open, with the instance selected |
| The Billing Page | `Console → account name (top right) → Billing and Cost Management` | The month-to-date total reading USD 0.00 and the Free plan credits panel |
| A Budget Alert | `Billing and Cost Management → Budgets → Create budget` | Use a template (simplified), Zero spend budget chosen, the name and email fields |

Two addresses and the instance ID are read off the Instance Running capture and
written back into `PUBLIC_IP` and `PRIVATE_IP` in `deckShared.tsx`, so the Two
Addresses table and the recap figures print the same numbers the screenshot
shows. Every slide that prints one already says AWS assigns it and a student's
own will differ.

**Billing → Credits is not captured.** On a Free plan account it lists
redeemable credits and reads USD 0.00: the Free plan credit is not a redeemable
credit. The Free plan credit is shown on the Free plan status panel and the
Cost and usage widget, both of which are already real captures on Check Your
Credits. The Free Plan Credits slide was dropped rather than made to promise a
page that does not show the number (user, 2026-09-16).

**Sign In is done.** `public/shots/aws-signin-root.png`, taken 2026-09-16 with
the Email address field empty, renders through `AnnotatedShot` with the Root
user option and the email field as highlights 1 and 2.

---

## 14. Flow review changes applied, 2026-09-16

From `flow-review.md` beside this file, the additive and ordering changes only.
Its merge and cut proposals were **not** applied: the user's standing
instruction for this deck is to elaborate, not to shrink.

1. **The budget alert moves into the account block**, straight after Check Your
   Credits, so the zero-spend alarm is set before anything can run. Its lead
   now reads as part of getting the account ready: *"Nothing is running yet, so
   set the alarm first."* Concept 4's recap still carries it.
2. **Concept 3 reads why, then where to click**, on all six sections: `AMI`
   before `Application and OS Image`, `The t3 Sizes` before `Instance Type`,
   and `The Door List` before `Security Group`. `VPC` before `The Default VPC`
   already read that way.
3. **Two rule breaches fixed.** `What the Cloud Gives You` defined the cloud
   with "Data Centre" and "server", both taught later; its lead now says "a
   building full of computers" and "always on". **SSH is expanded once**, on
   `Instance`, where it first appears: "using SSH, which is Secure Shell".
4. **A question slide opens concept 3 and concept 4**: `Which city should it
   be?` and `What has it cost so far?`, restoring beginner rule 3 to the two
   longest concepts. **Summary and Launch is now the checkpoint**: it lists the
   six answers in the order the form asked for them and sends the room back to
   Six Decisions before the click.
5. **Stop Your Instance** is added before Key Takeaways, so the session's most
   consequential action happens in the room rather than as homework. It reuses
   the `Instance state → Stop instance` capture.
6. **The Console and Find EC2 move ahead of The Market Share**, which puts a
   keyboard beat earlier and shortens the longest stretch where the room only
   watches.

Deck: **76 slides**, concept 3 is divider + 24.

---

## 15. The launch was done for real, 2026-09-16

The account activated and the whole walk-through was performed on it. Eighteen
uncropped captures, `ec2-01` to `ec2-18`, are in
`deployement_session_9/public/shots/` (originals in
`workflow/captures/session-9/`), and concept 3 now runs on them. The
`PendingShot` frames they replace are gone.

### The console corrected the plan, and the deck follows the console

| Planned | What the console did | Where it lands |
|---|---|---|
| AMI `Ubuntu Server 24.04 LTS` | The Quick Start list offers **`Ubuntu Server 26.04 LTS`**, `ami-01a00762f46d584a1`, username `ubuntu` | `AMI_NAME`, `AMI_ID`, `SSH_USER` |
| Subnet chosen in `ap-south-1a` | The Subnet field was left on **`No preference`**, and AWS placed the instance in **`ap-south-1b`** | `ZONE`, and the slide is now `No Preference` |
| SSH from `My IP`, app from Anywhere | Exactly that: `22` from `49.200.108.250/32`, Custom TCP `8000` from `0.0.0.0/0`, nothing for `5432` | `MY_IP_CIDR`, `ANYWHERE_CIDR` |

Everything else matches: `nxttrendz-server`, `nxttrendz-key` giving
`nxttrendz-key.pem`, `nxttrendz-sg`, `t3.micro` at USD 0.0112 an hour, `8 GiB`
`gp3`, VPC `172.31.0.0/16`.

What AWS assigned, now in `deckShared.tsx` and read by every slide and figure:
instance `i-06031b2ad99f0b796`, VPC `vpc-0292256715a0e0ab2`, subnet
`subnet-0b52b9ce32d8053c0`, security group `sg-03340990eb18a3456`, public
`15.207.88.14` at launch and `13.203.216.68` after a Stop and a Start, private
`172.31.7.32`, hostname `ip-172-31-7-32`, public DNS
`ec2-13-203-216-68.ap-south-1.compute.amazonaws.com`.

### Four teaching beats the walk-through produced

1. **Connect, Two Ways** and **The SSH Client Tab** (`ec2-16`, `ec2-17`): the
   Connect page's two tabs, the username that came with the AMI, and the Public
   DNS name as the readable form of the public address.
2. **The SSH Command**: AWS's own two lines, rendered as a terminal panel, not
   a screenshot. `chmod 400` then `ssh -i … ubuntu@<public DNS>`.
3. **Connect Refused** (`ec2-18`): the browser Connect fails because port 22 is
   open only to the learner's own address. The door list, working.
4. **Inside the Instance**: the real transcript, and the teaching point that the
   machine's own name IS its private address. Then **Instance Stopped** and
   **The Address Changed** (`ec2-14`, `ec2-15`): a Stop and Start hands out a
   new public address while the private one does not move, which is why the
   next session pins one with an Elastic IP.

### Counts

Deck **88 slides**, concept 3 is divider + 36. Four captures are still pending:
the Data Centre photograph, Configure storage, the Billing page and the budget
template.

### Two notes for whoever reviews the captures

- The account name and account ID are visible at the top right of every console
  capture, because this deck's rule is that a full-screen console capture is
  never cropped. No slide prints the account ID, but the pixels carry it. If it
  should not ship, the captures need retaking with that chip out of frame, not
  retouching (hard rule 11).
- `ec2-16` has a browser extension toast at the bottom of the frame. Worth
  retaking when convenient.

---

## 16. Remarks pass, 2026-09-28

Source: the "Intro to AWS" remarks doc, transcribed into
`workflow/reviews/deployement_session_9.review.md` with the doc-number to
slide-id mapping, because the doc was written against the 94-slide build of
16 September and half of it had already been applied on 25 September.

### Four slides added, deck goes 93 → 97

| New slide | Sits after | Why the remark asked for it |
|---|---|---|
| `c3-where-security-groups-live` | `c3-door-list-read` | A Security Group is a thing of its own in the console, under Network and Security, and it outlives any one instance. The room needs to have seen that page before it edits the rules after Connect is refused. Capture `ec2-25-security-groups-nav.png` |
| `c3-page-words` | `c3-instance-details` | The instance page names VPC, Public IPv4, Private IPv4 and Public DNS in one screen and the deck never said what those four words mean in one place |
| `c3-who-connects` | `c3-add-one-rule` | "Why did adding an address fix it." The browser Connect does not come from the learner's laptop; AWS's EC2 Instance Connect service makes the SSH connection, which is what the new Source range allows |
| `c3-elastic-ip` | `c3-address-changed` | The term Elastic IP was used on `c4-what-costs` without ever being defined. It is now defined where the need appears, one slide after the public address changes |

### Six slides reworded

- `c1-laptop-not-server`: the lead states the idea instead of counting rows, and
  two cards say what a laptop is for and what a server is for.
- `c3-door-list`: the definition lead was struck out by the remark. The slide now
  leads on the check itself, allowed port through, everything else blocked.
- `c3-door-list-read`: its note now carries the closed-by-default fact that the
  old `c3-door-list` lead used to carry, so nothing was lost.
- `c3-summary-launch`: the six answers are six points, one below another.
- `c3-browser-commands`: one sentence under the capture reading the three
  outputs back in plain words.
- `c3-inside-instance`: a three-word gloss beside each of the four commands, and
  a note that these are Linux commands because the instance runs Ubuntu. The
  learner's own laptop may be Windows; it only carries the browser tab.

### One thing left open

`ec2-25-security-groups-nav.png` comes from a different account than the other
captures: its rows read `nxttrendz-app-sg` and `vpc-09690abf9070a5eeb`, not the
deck's `nxttrendz-sg` and `vpc-0292256715a0e0ab2`. Neither highlight touches
those rows, but the pixels carry two names the deck never uses.
