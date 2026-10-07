<!-- cSpell:ignore nxttrendz deployement NxtWave colour Mumbai Hyderabad ap-south-1 AZs t3.micro AMI -->
# Deployment · Session 9: "Introduction to AWS"

**STATUS: AWAITING SIGN-OFF, drafted 2026-09-15.**

## 0. What this session is, in one line

Vocabulary before hands. The learner leaves knowing what the cloud is, what
AWS is, what an EC2 instance, a VPC, a subnet and a Region are, and where the
money goes. Nothing is launched. The next session launches the first instance.

Instruction, 2026-09-15: *"we must focus on only explaining what is AWS, EC2,
VPC, Subnets, Regions and Billing and all. We must start from explaining cloud
basics in at most 10 slides."*

## 1. Inputs

| | |
|---|---|
| TR | `/home/nxtwave/docker_jenkins_aws/10_deploying_docker_on_aws_ec2.md` §1, §2 (the why, AWS, EC2, rental terms) and `11_aws_ec2_security_and_networking.md` §4 (public and private IP, VPC), §2.2 only as far as "a door list exists" |
| Not from a TR | Regions and Availability Zones, subnets, the Billing console, Budgets. Read off the AWS docs and the Free Tier FAQ on 2026-09-15 (plan §4.2b of session 8 has the Free plan facts) |
| Audience | Absolute beginners, English as a second language for many. Hard rules 26 and 29: plain literal English, titles of 2 to 3 words, leads that state the fact |
| Carries forward | Session 8's closing block already made everyone create an AWS account on the Free plan. This session opens that console for the first time |
| Session app | `django_deployement_course/deployement_session_9/`, `devPort` 5220 (5219 is session 8), `htmlName` `deployment-session-9` |
| Figure lab | `slide-kit/cloud-lab/`, `devPort` 5236, for `CloudPicture` and `RegionMap` before a deck slide is written (hard rule 17) |

## 2. Concept map (four concepts, one divider each)

| # | Concept name (agenda) | TR sections mapped here |
|---|---|---|
| 1 | `Cloud Basics` | TR 10 §1.2, §1.3 (why a laptop cannot be the server, renting), plus what "cloud" and "pay for use" mean. **At most 10 slides, on instruction** |
| 2 | `AWS and EC2` | TR 10 §2.1, §2.2, §2.3 (what AWS is, EC2, instance, instance type, AMI, key pair named only) |
| 3 | `Regions and Networks` | TR 10 §2.3 Region row; TR 11 §4.1 (public and private IP, VPC); subnets and Availability Zones from the AWS docs |
| 4 | `Billing` | Session 8 plan §4.2b (the Free plan), TR 10 §2.3 Free Tier warning, TR 11 §4.3 note (Elastic IP costs when idle), Billing console and Budgets from the AWS docs |

Rule 20: Key Takeaways restates exactly these four names.

## 3. Decisions to confirm at sign-off

| # | Decision | Recommendation | Why |
|---|---|---|---|
| D1 | Hands on the keyboard? | **No launching.** Learners open their own console and *find* things: the Region selector, EC2, VPC, Billing. Nothing is created | The user's brief is "only explaining". Creating an instance belongs to the next session, where it gets its own screenshots and the key pair |
| D2 | Security Groups | **One slide, named as "the door list", no rules written** | TR 11 spends a whole session on it. Here the learner only needs to know a firewall exists and where it sits in the picture |
| D3 | Quiz frames | **None.** Instruction 2026-09-15: "No Quiz Slides" | Second deck in a row with this instruction. Proposed at sign-off: record it as a course rule so it is not asked again |
| D4 | Screenshots of the console | **Every console slide is a real capture** from the user's own AWS account, cropped so the 12-digit account ID never shows | Hard rule 30. The console cannot be captured signed out, so the user captures or the extension does with the user signed in |
| D5 | Regions example | **Mumbai, `ap-south-1`**, with Hyderabad `ap-south-2` as the second Indian region | Nearest to the room; the next session launches there |
| D6 | Costs shown in | **USD, as the console shows them**, with one rupee figure where it helps (the Free plan credit is about ₹8,500) | Mixing currencies on a slide confuses; the console is in dollars |

## 4. Slide-wise plan

Fixed frame first, then the four concepts. `CAPTURE` marks a real screenshot
to take before generation (stage 3). Every title is 2 to 3 words. Every lead is
a plain statement.

### Opening (5)

| # | Title | Type | Content |
|---|---|---|---|
| 1 | Brand | `BrandSlide` | NxtWave mark only |
| 2 | Welcome | `WelcomeSlide` | Introduction to AWS |
| 3 | Where We Left Off | `StatusList` | Pipeline pushes two images on every push (green). An AWS account exists on the Free plan (green). Nothing runs the images yet (red) |
| 4 | Agenda | `AgendaSlide` | Cloud Basics · AWS and EC2 · Regions and Networks · Billing |
| 5 | One Question | `QuestionSlide` | "Where does a website live?" Answer is the next concept |

### Concept 1 · Cloud Basics (divider + 9 = 10, the cap)

| # | Title | Type | Content |
|---|---|---|---|
| 6 | 01 divider | `SectionBreakerSlide` | Cloud Basics |
| 7 | A Laptop Is Not a Server | `DataTable` | Four rows from TR 10 §1.2: always on, reachable, stable address, not being edited. Left column what a service needs, right column what a laptop does |
| 8 | What a Server Is | `CloudPicture` state 1 (**build**, §6) | One computer, always on, with a public address. Your app inside, the internet outside |
| 9 | Buying or Renting | `DataTable` | Buy a machine: pay upfront, find a room, cool it, fix it. Rent one: pay per hour, turn it off when done. Rule 5 not needed, both columns short |
| 10 | The Cloud | `ContentNoteSlide` | "The cloud is other people's computers that you rent over the internet." Three points: they sit in a data centre, you reach them through a browser or a terminal, you pay for the time you use |
| 11 | A Data Centre | `Shot` (**asset**: a public AWS data-centre photo or the AWS "Global Infrastructure" page) | What the building looks like. One picture, one sentence: thousands of computers, cooled, guarded, always on |
| 12 | Pay for Use | `AnalogyMap` | Electricity meter to cloud bill: you do not buy the power station, you pay per unit, the meter runs only while the light is on |
| 13 | Who Rents Them Out | `CardGrid` (3 cards) | AWS, Microsoft Azure, Google Cloud. One line each. AWS is the largest, and the one this course uses |
| 14 | What You Can Rent | `CardGrid` (4 cards) | A computer, a disk, a database, a network. This course needs the first one and touches the last |
| 15 | Cloud in One Line | `RecapSlide` | Three lines: a server is an always-on computer with a public address; the cloud rents you one; you pay for the hours you use |

### Concept 2 · AWS and EC2 (divider + 8)

| # | Title | Type | Content |
|---|---|---|---|
| 16 | 02 divider | `SectionBreakerSlide` | AWS and EC2 |
| 17 | What AWS Is | `ContentNoteSlide` | Amazon's cloud. Hundreds of services. This course uses one, EC2. Note: roughly 3 in 10 cloud servers worldwide are AWS, so it is the name in job listings |
| 18 | The Console | `Shot` **CAPTURE** | console.aws.amazon.com home after sign in. Highlight the search box and the Region name at the top right. Account ID cropped out |
| 19 | Find EC2 | `Shot` **CAPTURE** | The search box with "EC2" typed and the result. Caption: this is how you reach any service |
| 20 | EC2 Rents a Computer | `LayerStack` | Amazon data centre, physical server, EC2 instance (yours), Docker Engine, your containers. TR 10 §2.2, drawn |
| 21 | Instance | `ContentNoteSlide` | AWS's word for one rented computer. It has a public IP, it is always on until you stop it, you log in over SSH. Three points |
| 22 | Instance Type | `DataTable` | t3.micro: 2 vCPU, 1 GB. t3.small: 2 vCPU, 2 GB. t3.medium: 2 vCPU, 4 GB. Column "fits this course": yes, more than needed, more than needed. **CAPTURE** the EC2 instance types page if it reads clearly, else the table |
| 23 | AMI | `AnalogyMap` | Docker image to container, AMI to instance. The template the computer boots from. Ubuntu Server 24.04 is ours |
| 24 | Key Pair | `ContentNoteSlide` | One sentence only: the file that lets you in instead of a password. Made when the instance is launched, next session |

### Concept 3 · Regions and Networks (divider + 8)

| # | Title | Type | Content |
|---|---|---|---|
| 25 | 03 divider | `SectionBreakerSlide` | Regions and Networks |
| 26 | Regions | `RegionMap` (**build**, §6) + `Shot` **CAPTURE** | The Region selector opened at the top right of the console. Highlight Asia Pacific (Mumbai) ap-south-1 |
| 27 | Pick the Nearest | `ContentNoteSlide` | A Region is a city with AWS data centres. Nearer means faster for your users. Prices differ a little. Everything you create lives in one Region and the console shows one Region at a time |
| 28 | Availability Zones | `RegionMap` zoomed state (**build**, §6) | ap-south-1a, 1b, 1c. Three separate buildings in one city. If one loses power the others do not. You will use one |
| 29 | VPC | `CloudPicture` state 3 (**build**, §6) | Your own private network inside AWS. Every account gets one by default. Instances inside talk to each other privately. TR 11 §4.1's compose-network comparison, drawn |
| 30 | The Default VPC | `Shot` **CAPTURE** | VPC console, Your VPCs, the one default VPC with its CIDR 172.31.0.0/16. Caption reads the address range in plain words: about 65,000 private addresses reserved for you |
| 31 | Subnets | `Shot` **CAPTURE** + caption | VPC console, Subnets: three default subnets, one per Availability Zone. A subnet is a slice of the VPC placed in one building. Public subnet: reachable from the internet. Private: not |
| 32 | Two Addresses | `DataTable` | TR 11 §4.1 table: public IPv4 13.235.67.89 for users and SSH; private IPv4 172.31.8.142 for AWS-internal traffic |
| 33 | The Door List | `CloudPicture` state 5 + note | A Security Group sits in front of the instance and lists which ports may be reached, by whom. Closed unless listed. The whole of a later session; today only its place in the picture |

### Concept 4 · Billing (divider + 8)

| # | Title | Type | Content |
|---|---|---|---|
| 34 | 04 divider | `SectionBreakerSlide` | Billing |
| 35 | The Free Plan | `DataTable` | USD 100 credit on sign-up, up to 200. No charge unless you click Upgrade. Card kept for identity only. Account closes at 6 months. From session 8 plan §4.2b |
| 36 | What Costs Money | `CardGrid` (4 cards) | A running instance, per hour. A disk, per GB per month. An Elastic IP that is not attached. Data leaving AWS, per GB. Each with one number from the Mumbai price list, read on the day |
| 37 | What Is Free | `StatusList` | Stopped instance's CPU (green). Data coming in (green). The VPC, subnets and security groups (green). The disk of a stopped instance (red, still billed) |
| 38 | The Billing Page | `Shot` **CAPTURE** | Billing and Cost Management home showing credits and a zero bill. Account ID cropped |
| 39 | Free Plan Credits | `Shot` **CAPTURE** | The Credits page showing the USD 100 |
| 40 | A Budget Alert | `Shot` **CAPTURE** + `StepList` | Budgets, Create budget, Zero spend budget template, an email. Three steps. This one the learner does today |
| 41 | Stop When Done | `Terminal`? No: `ContentNoteSlide` | Instance state, Stop, when you finish for the day. Terminate deletes it. Reboot keeps the address, Stop and Start changes it (TR 11 §4.2) |
| 42 | Never Upgrade | `Callout` on `ContentSlide` | The only click that can cost money is Upgrade to Paid plan. It is one deliberate button. Do not press it during this course |

### Closing (5)

| # | Title | Type | Content |
|---|---|---|---|
| 43 | Key Takeaways | `KeyTakeawaysSlide` | Cloud Basics · AWS and EC2 · Regions and Networks · Billing, one outcome line each, in a different UI than the agenda |
| 44 | Practice | `PracticeSlide` | Open your console. Set the Region to Mumbai. Open EC2, then VPC, then Billing. Create the zero-spend budget. Send one screenshot of the budget |
| 45 | What Comes Next | `ContentNoteSlide` | Next session launches the first instance in Mumbai and runs the two images on it |
| 46 | Feedback | `FeedbackSlide` | |
| 47 | Thank You | `ThankYouSlide` | |

**47 slides.** Concept 1 is exactly 10 including its divider. No quiz frame, on instruction.

## 5. Captures to take before generation (stage 3)

All from the user's AWS account, signed in, Region set to Mumbai, at 2x or
browser zoom 150 percent so crops stay sharp. Account ID and email cropped out
of every one.

| Slide | Page | What must be visible |
|---|---|---|
| 18 | Console home | search box, Region name top right |
| 19 | Search "EC2" | the dropdown result |
| 22 | EC2, Instance Types, filter t3 | t3.micro row with vCPU and memory |
| 26 | Region selector open | Asia Pacific (Mumbai) ap-south-1 |
| 30 | VPC, Your VPCs | default VPC, CIDR 172.31.0.0/16 |
| 31 | VPC, Subnets | three subnets with their Availability Zones |
| 38 | Billing home | zero bill, credits line |
| 39 | Billing, Credits | USD 100 remaining |
| 40 | Budgets, Create budget | Zero spend budget template |

Slide 11 needs a photo or page, not a console capture: the AWS Global
Infrastructure page at aws.amazon.com/about-aws/global-infrastructure is
public and can be captured at 2x with the DevTools browser.

## 6. Illustrations: where they go and why

This is a new domain for the kit. Every figure in it so far draws Docker,
Compose or Jenkins, and hard rule 8 says a figure must depict the slide's own
concept, so most of them cannot be reused here. The rule for this deck:

**One picture grows through the deck.** A learner who sees a new diagram on
every slide has to re-learn the drawing each time. Instead, one figure,
`CloudPicture`, appears on slide 8 as the simplest possible drawing and gains
one layer per concept, in the same place, in the same colours, so on slide 33
the room reads the whole of AWS networking in a drawing they have known since
slide 8. `continuity.ts` keeps the shared parts still between neighbouring
slides. Rule 6: each new layer reveals in step with the line of text that names
it.

### 6.1 `CloudPicture`, the figure that grows (build in the kit)

| State | Slide | What is added | The one sentence it argues |
|---|---|---|---|
| 1 | 8 | A box labelled "a server", one public address on it, the Internet as a cloud outline on the left, an arrow reaching the box. A small laptop, greyed, with no arrow reaching it | A server has an address the internet can reach. A laptop does not |
| 2 | 20 | The box gains an outer frame, "Amazon data centre, Mumbai", and inside it the layers: EC2 instance, Docker Engine, two containers | The rented computer is the same computer, in someone else's building |
| 3 | 29 | A dashed frame around the instance labelled VPC 172.31.0.0/16, a second instance beside it, a short private arrow between the two | Your instances share a private network nobody else is on |
| 4 | 31 and 32 | The VPC splits into three columns, ap-south-1a, 1b, 1c, each a subnet; the instance sits in one; its two addresses are written on it, public outside the frame, private inside | A subnet is a slice of the VPC in one building; the instance has an inside address and an outside one |
| 5 | 33 | A small gate on the arrow from the Internet to the instance, with two rows on it: 22 you, 8000 everyone | The Security Group is the door list on the way in |

Built as one component with a `state` prop (1 to 5), colours from
`tokens.ts`, entrances at the explanatory tier (520 ms, 130 ms stagger). It is
prototyped first in `slide-kit/cloud-lab` (devPort 5236), screenshotted in all
five states and looked at (hard rule 17), then moved into
`slide-kit/slide-template/src/ui/CloudPicture.tsx`, added to `sampleDeck.tsx`
and the registry, and raised as a PR. Sessions 10 and 11 reuse states 4 and 5
when they launch the instance and write the Security Group rules, which is
what earns it a place in the kit.

### 6.2 `RegionMap` (build in the kit)

Slides 26 to 28. A simplified world outline with AWS Regions as dots, then a
zoom to India with Mumbai and Hyderabad named, then Mumbai opened to show
three buildings, ap-south-1a, 1b, 1c. Two states, `world` and `zones`. It
argues the two things a list cannot: Regions are places, and a Region is more
than one building. Next to it on slide 26 sits the real console capture of the
Region selector, so the drawing and the screen agree.

### 6.3 Kit figures reused where they fit

| Slide | Figure | Why it fits this slide's concept |
|---|---|---|
| 12 Pay for Use | `AnalogyMap` | It exists to map a known idea onto a new one: electricity meter to cloud bill |
| 20 EC2 Rents a Computer | `LayerStack` | The layers from the data centre down to your containers are literally a stack. Used together with `CloudPicture` state 2, or instead of it if the slide gets crowded; decide when looking at the render |
| 23 AMI | `AnalogyMap` | Docker image to container, AMI to instance. The learner already owns the left half |
| 33 The Door List | `Illustration name="ports-doors"` as a small aside | Already in the kit for exactly the "ports are doors" idea |

`MachineBoundary` is **not** reused for slide 8 even though it draws a boundary:
its scope note says the failed request at localhost is its point, which is the
opposite of what slide 8 says. `ComposeNetwork` is not reused for the VPC:
it draws containers, and the comparison is made in words on slide 29 instead.

### 6.4 Photographs and logos

| Slide | Asset | Source and handling |
|---|---|---|
| 11 A Data Centre | one photograph of an AWS data centre, or the AWS Global Infrastructure page | Public page captured at 2x with the DevTools browser. If a photo is preferred, it needs a free licence, attribution in `workflow/assets-manifest.md`, and your approval before download (workflow stage 2 rule) |
| 13 Who Rents Them Out | `companies/amazon.png`, `companies/microsoft.png`, `companies/google.png` | Already in `slide-kit/assets/companies/`. **Missing: an AWS mark** for slides 16 to 18. Add `tech/aws.png` to `slide-kit/assets/tech/` first (hard rule 13), then copy into the session |
| 23 AMI | `tech/linux.png` | Exists. An Ubuntu mark would be nearer; add `tech/ubuntu.png` to the library if approved |
| Dividers | `SectionBreakerSlide` | One topic-specific illustration each: a cloud outline (1), a server rack (2), a map pin (3), a meter (4). Drawn as `signal-geometry` style abstract SVGs in the kit, not stock art |

### 6.5 Where a table beats a picture

Slides 7, 9, 22, 32 and 36 stay tables. Each is a comparison with two or three
columns of short facts; a drawing would only decorate them.

## 7. Open questions for the user

1. D1: agree that nothing is launched this session?
2. Is 47 slides the right length, or should concept 4 lose slides 41 and 42 (they repeat session 8's closing block in part)?
3. Who captures the console: you, sending screenshots as in session 8, or the extension with you signed in?
