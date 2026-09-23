<!-- cSpell:ignore nxttrendz deployement NxtWave colour Mumbai Hyderabad ap-south-1 ap-south-2 AZs t3.micro AMI CIDR pem ByteByteGo freeCodeCamp -->
# Session 9 · Illustration plan

Companion to `plan.md` (signed off 2026-09-15, revision 2). The plan's §7
already specifies three figures that are being built now: `CloudPicture`
(5 states), `RegionMap` (2 states) and `ShareBar`. **This document does not
redesign those.** It covers every other content slide, and it proposes a small
number of figure families that share one visual language with them, so the
room learns one drawing style once and spends its attention on the concept.

The user's instruction this document answers: *"I want more illustration
driven teaching, research on what and how."*

Rules this document is written against: hard rules 6 (text and visual arrive
together), 8 (a figure depicts the slide's own concept), 11 (captures are
cropped, one highlight at most), 17 (every custom figure is screenshotted and
looked at), 26 and 29 (plain English, titles of two or three words), 30 (every
process is a real screenshot); plan §2 beginner rules, above all rule 5,
**anchor every new idea to something the room already owns**.

---

## 1. The one decision behind everything below

A beginner room does not need more pictures. It needs **fewer kinds** of
picture, each one drawn in the same way every time it comes back. So the
proposals group into five families, and each family is one component with a
`state` prop, exactly the way `CloudPicture` is:

| Family | Anchor the room owns | Slides it carries | Why it is a family and not one-offs |
|---|---|---|---|
| **Meter** | the electricity meter on the wall at home | 13, 42, 43, 46, 48 | Billing is the concept the room fears most. One meter, seen five times in five states, makes "pay for use" a picture they can replay in their head when the Free plan slide arrives |
| **PlaceLadder** | a city, a building in it, a floor in the building | 31, 33, 36, 39 | The Region, Availability Zone and subnet chain is the hardest vocabulary in the deck. A three-rung ladder that lights one rung per slide, in the corner, tells the room where they are in the chain without re-reading `RegionMap` |
| **OwnVsRented** | your laptop at home against a computer in someone else's building | 7 (as `CloudPicture` state 0), 8 | Concept 1 is one argument made three times: your machine cannot do it, a rented one can. Draw the same laptop each time |
| **OneOfMany** | a stamp and its prints; a size chart on a T-shirt rack; two hundred switches on a wall with four turned on | 21, 26, 27 | Three slides in Concept 2 argue "one of a set". They share glyph size, stroke and rhythm, but each keeps its own shape because they argue different things (count, scale, copies) |
| **LockAndKey** | a key file and the lock it fits | 28, and next session when the key pair is made | One picture, two halves, that the next deck completes |

Two more single figures that do not belong to a family and are still worth
drawing: `TwoDoors` (slide 18, one building with two doors) and the small
`MachineCard` (slide 25), which borrows `CloudPicture`'s server glyph so the
instance on slide 25 is visibly the same box the room met on slide 10.

Everything else stays as the plan has it: tables, status lists, real captures,
or plain text. §3 says which and why, slide by slide.

### Shared visual language (applies to every family)

Read from `tokens.ts`, and from what the in-progress figures are already
committed to, so nothing here drifts from `CloudPicture`:

- **Stroke 2 px minimum at the 1280 canvas, 2.5 px for the line the argument
  depends on.** At the back of a room a 1 px hairline vanishes.
- **Labels 15 px minimum inside an SVG, 17 px preferred; captions under a
  figure 18 px.** Nothing in this deck is read closer than four metres.
- **One accent per figure.** `colors.brand` for the thing being taught,
  `colors.ink` and `colors.body` for everything that is context, `colors.muted`
  at 55 percent opacity for the thing that does not work (the laptop with no
  arrow, the meter that is off). `colors.danger` appears only when something
  costs money it should not, and `colors.success` only for a checkmark.
- **Boxes are white with a coloured 2 px border and 12 px radius**, matching
  `SocketBridge`, `TunnelPath` and `MachineBoundary`. No fills except the
  `12`-alpha tint `AnalogyMap` uses on its right column.
- **Every label carries an explicit x**, never "centred on the arrow"
  (`SocketBridge` header, hard rule 17). Labels get their own clear space.
- **Motion at the explanatory tier only**, the numbers from `figureTiming.ts`:
  `T.enter` 520 ms for a box or tile arriving, `T.stagger` 130 ms between
  items, `T.draw` 860 ms for a connector tracing itself, `T.label` 340 ms for a
  caption fading up after its line has landed, `T.accent` 600 ms for the one
  emphasis beat a figure is allowed, `T.lead` 120 ms before anything starts.
  Entrances ease out on `easing.soft`, never ease in. Nothing enters from
  `scale(0)` (Emil's rule; start from 0.9 and opacity 0). Only `transform` and
  `opacity` animate.
- **Text and figure arrive together** (hard rule 6). Every figure below is
  wrapped in `RevealGroup` and `Reveal`, never `Step`; the bullets beside it
  are `BulletList immediate`. The one exception the style guide allows is when
  the items ARE the content (slide 21's four service cards), where a `Step`
  build is a teaching beat and no text is waiting on it.
- **Instructor rectangle**: x 913 to 1280, y 0 to 220 stays empty. On a
  `ContentSlide` with `points` and `children`, the figure is the right column
  (about 440 px wide) and `ContentSlide` already pads it down with
  `visualGuard` when there is no lead. On slides with a lead, the header ends
  near y 216, so the figure top edge is at y 230 at the earliest. Every pixel
  budget below assumes this.

---

## 2. What the well-known beginner explainers do

Read on 2026-09-15. Four sources, chosen because each is the one a learner
googling "what is cloud computing" will meet.

| Source | How it explains the same ideas | Visual conventions |
|---|---|---|
| **AWS, "What is cloud computing"** ([aws.amazon.com/what-is-cloud-computing](https://aws.amazon.com/what-is-cloud-computing/)) | "On-demand delivery of IT resources over the Internet with pay-as-you-go pricing." Benefits in four boxes: agility, elasticity, cost savings, global reach. "Trade fixed expenses for variable expenses, and only pay for IT as you consume it." | No diagram at all on the page. Four equal text tiles. The utility comparison is made in words |
| **AWS Cloud Practitioner Essentials** (course, as described in learner notes at [Medium](https://abishekn01.medium.com/aws-cloud-practitioner-essentials-part-3-5b8b89593a24), [Medium](https://medium.com/@akashbenki2001/cloud-for-beginners-aws-cloud-practitioner-essentials-course-part-4-62f6f4dfb4a7) and [GitHub](https://github.com/danielmapar/AWSCloudPractitionerEssentials)) | One running analogy for the whole course, a **coffee shop**: EC2 instances are the employees, instance types are the roles (cashier, barista), the load balancer is the host at the door. **"Think of a Region as a city and Availability Zones as separate buildings within that city."** | Flat cartoon of one shop, redrawn with one more element per module. Nested boxes for Region, AZ and VPC, with orange for AWS service icons |
| **freeCodeCamp, "Beginner's guide to cloud computing with AWS"** ([freecodecamp.org](https://www.freecodecamp.org/news/beginners-guide-to-cloud-computing-with-aws/)) | Several unrelated analogies in one article: a bakery you rent equipment from, pizza (from scratch, rented kitchen, delivery), renting a house (shared responsibility), a theme park (Regions are entrances, AZs are sections). | Two diagrams, both stacked-box hierarchies (service models; shared responsibility). Otherwise text |
| **ByteByteGo, "Typical AWS network architecture in one diagram"** ([bytebytego.com](https://bytebytego.com/guides/typical-aws-network-architecture-in-one-diagram/)) and **InformationWeek, the cloud and the electric generator** ([informationweek.com](https://www.informationweek.com/data-management/the-cloud-electric-generator-analogy)) | ByteByteGo: one dense diagram, Region containing AZs containing VPC containing public and private subnets, an Internet Gateway on the edge. InformationWeek: in the 1890s every factory ran its own generator; the grid made that pointless, and the cloud is the grid | ByteByteGo: one big nested drawing, many labels, AWS's own orange service icons, thin lines. Meant to be read on a screen at arm's length |

### Conventions to adopt

1. **One analogy carried through the whole concept, not one per slide.** The
   Cloud Practitioner course's coffee shop works because it is redrawn, not
   replaced. `CloudPicture` already does this for the network; the `Meter`
   and `PlaceLadder` families do it for billing and for places.
2. **Region is a city, an Availability Zone is a building.** This is AWS's own
   sentence. Use it word for word; the room will meet it again in every AWS
   course they ever take.
3. **Nesting drawn as boxes inside boxes**, outer to inner: Region, VPC,
   subnet, instance. Every source does this and `CloudPicture` states 2 to 4
   already do. `PlaceLadder` keeps the same outer-to-inner order top to bottom.
4. **The utility meter for pay-as-you-go.** AWS says it in words; the
   InformationWeek piece makes it a history. We draw it, because a meter with
   digits that stop when the light goes off is the one image that also
   explains slide 43 (the disk of a stopped instance is still billed).
5. **Left to right is "from the internet to your computer".** ByteByteGo,
   `SocketBridge`, `TunnelPath` and `CloudPicture` all agree. Do not flip it.

### Conventions to avoid on a projector

1. **AWS Architecture Icons.** The orange squares are designed for a screen at
   40 cm. At the back of a room they are identical orange squares. A word in
   17 px beats an icon with a word under it in 11 px.
2. **One big everything diagram** (the ByteByteGo style). It is a reference
   card, not a teaching frame. Our rule is one new layer per slide.
3. **Hairlines and colour-only distinctions.** Public versus private subnet
   told apart by pale green versus pale blue fails on a washed-out projector.
   Use line style and a written word as well (a solid frame and the word
   "public"; a dashed frame and the word "private").
4. **Several analogies for one idea** (freeCodeCamp's bakery, pizza, house and
   theme park). Each one costs the room a re-mapping. One anchor per concept.
5. **Isometric or 3D stock art of servers with glowing lights.** It decorates
   and argues nothing, and hard rule 8 forbids it.

---

## 3. Slide by slide

Fixed-frame slides (1 Brand, 2 Welcome, 4 Agenda, 6/16/30/40 dividers, 52
Feedback, 53 Thank You) are skipped. Slides owned by the three in-progress
figures (10, 20, 24 in part, 32, 33 in part, 34, 36 in part, 38) are listed in
one line so the sequence reads whole, and are not redesigned here.

Column key: **Idea** is the one thing the slide teaches. **Drawing** is the
proposal. **Argument** is what the drawing says that the sentence cannot.
**Entry** is the on-entry motion, in step with the text. **Source** is reuse,
extend, or new.

### Opening

| # | Title | Idea | Drawing | Argument | Entry | Source |
|---|---|---|---|---|---|---|
| 3 | Where We Left Off | Two things are done, one is not: nothing runs the images yet | **Text only**, `StatusList` (two green rows, one red). A drawing here would only decorate a status list, which is already the honest form for rows with verdicts | | `StatusList` staggers on entry | Reuse `StatusList` |
| 5 | One Question | "Where does a website live when it is not on your laptop?" | **Text only**, `QuestionSlide`. Hard rule 16: the question and nothing else | | | Reuse `QuestionSlide` |

### Concept 1 · Cloud Basics

| # | Title | Idea | Drawing | Argument | Entry | Source |
|---|---|---|---|---|---|---|
| 7 | What the Cloud Gives You | The cloud gives you a computer in someone else's building, reached over the internet, paid by the hour | **`CloudPicture` state 0** (a new state before state 1, see §4.3). Right column, 440 x 300. Left: a small laptop with a person glyph, labelled "you". Right: one plain building outline with a single computer box inside, labelled "a computer in someone else's building". One solid line from laptop to computer, labelled "the internet". No addresses yet, no greyed laptop, no cloud outline. The three bullets sit left | The bullets say "real computer", "over the internet", "someone else's building". The drawing shows that the computer is **not where you are**, which is the whole idea, and it plants the building the room will see grow for 30 slides | Laptop at `T.lead`, building at +130 ms, computer inside at +260 ms, then the line draws over `T.draw` 860 ms as the second bullet ("you reach it over the internet") lands. Label fades `T.label` after the line | **Extend** `CloudPicture` with state 0 |
| 8 | Why Not Your Own System | Two reasons: it does not scale, it fails | **`OwnVsRented` vignettes inside the two cards**, one per card, 300 x 130 each above the card text. Card 1 (`state="scale"`): a laptop, ten small person dots arriving and fitting under it; then a second row of dots keeps coming and spills past the laptop's edge in `colors.muted`. Card 2 (`state="fails"`): the same laptop, and around it three plain glyphs in order: a plug pulled from a socket, a lid closing (the screen tilting to a flat line), a wifi mark with a slash. The laptop's screen goes from `colors.brand` to `colors.muted` as the third glyph lands | The card says "ten thousand is not". The drawing makes the room **watch** the dots overflow, and watch the screen go dark. A beginner who has never run a server believes a picture of the lid closing faster than a sentence about uptime | Cards arrive as the grid's `Step` build (the two cards are the content, so a click each is a teaching beat). Inside each card: laptop `T.enter`; dots at 60 ms each (a fast run, deliberately faster than `T.stagger`, so the overflow feels like a crowd) capped at 1.3 s total; in card 2 the three glyphs at `T.stagger` 130 ms each and the screen dims over `T.accent` 600 ms | **New** `OwnVsRented`, 2 states |
| 9 | A Laptop Is Not a Server | Four more things a service needs that a laptop does not do | **Text only**, `DataTable`. Plan §7.6 keeps this a table, and it is right: four short comparisons, a drawing would restate the rows | | Table staggers | Reuse `DataTable` |
| 10 | What a Server Is | A server has an address the internet can reach; a laptop does not | `CloudPicture` state 1 (in progress, §7.1) | | | In progress |
| 11 | Buying or Renting | Buy: pay upfront and keep it; rent: pay per hour and hand it back | **Text only**, `DataTable`, with one small addition: the rent column's header carries the `Meter` glyph at 28 px, still, unlit, as a 'preview' of slide 13. No other drawing | The glyph is a promise, not an argument: it tells the room the meter on the next slide is about this column | None beyond the table's own stagger | Reuse `DataTable`; `Meter` glyph as an inline icon |
| 12 | A Data Centre | The building is real: thousands of computers, cooled, guarded, always on | **Photograph or the AWS Global Infrastructure page, as a `Shot`**, per plan §7.5. Full width, 1100 x 380, one caption line. No drawing: this slide is the evidence for slide 8's "it fails" card and a drawing would weaken the evidence | | `Shot` fades in `T.enter`; caption `T.label` | Reuse `Shot` |
| 13 | Pay for Use | You do not buy the power station; the meter runs only while the light is on | **`Meter` state `running`**, left column 420 x 330, beside `AnalogyMap` on the right (three rows, electricity to cloud). The meter: a rounded box with a five-digit readout, a small round lamp above it lit `colors.brand`, and a short cable running down to a bulb glyph at the bottom. Below the readout in 17 px: "runs while the light is on". Kicker above the meter: "at home". Beside the `AnalogyMap` right column header: "on AWS" | The rows map words. The meter **moves**: its last digit ticks while the bulb is lit, and that ticking is the whole meaning of "pay for use". A room that has watched a meter tick does not ask "so do I pay when it is off" on slide 43; they already know | Meter box `T.enter`; lamp lights at +130 ms; bulb glyph +260 ms; then the readout begins ticking one digit every 900 ms, on a loop, for as long as the slide is up (the one continuous motion allowed, at the pace of a real meter, quiet enough to talk over). `AnalogyMap` rows stagger in parallel on the right | **New** `Meter`, first of 4 states; reuse `AnalogyMap` |
| 14 | Who Rents Them Out | Three companies rent computers this way; this course uses AWS | **Text with logos**, `CardGrid` of 3, each card carrying its company mark from `slide-kit/assets/companies/` and one line. The AWS card gets a `colors.brand` border and the chip "this course". No drawing: three equal cards is the honest form for "three of equal weight", and the size claim is deliberately withheld until slide 20 | | Cards stagger `T.stagger` | Reuse `CardGrid` |
| 15 | Cloud in One Line | Three lines the divider promised | **Text only**, `RecapSlide` (checklist plus mascot, kit-owned) | | Kit default | Reuse `RecapSlide` |

### Concept 2 · AWS and EC2

| # | Title | Idea | Drawing | Argument | Entry | Source |
|---|---|---|---|---|---|---|
| 17 | What You Know | "What do you already know about AWS?" | **Text only**, `QuestionSlide` | | | Reuse |
| 18 | Not the Shop | Amazon the shop and AWS are one company with two doors | **`TwoDoors`**, left column 460 x 300, beside the two-column `DataTable` on the right. One building outline, roof line across the top labelled "Amazon" in 19 px. Two doors on the ground floor, 90 px wide each, 120 px apart. Left door: the Amazon smile mark above it, sign "amazon.in", a shopping bag glyph on the step. Right door: the AWS mark above it, sign "AWS", the same server box glyph `CloudPicture` uses on the step. Under the building, one line, 18 px: "One company. Two doors." | The table lists differences. The drawing insists on the **sameness**: one roof. A room that just said "Amazon is a shop" needs to see that they were not wrong, they had only ever used one door | Building `T.enter`; left door and its sign at +130 ms (the door they know); right door at +260 ms; the two marks fade `T.label` after their doors; the caption last. The table staggers alongside | **New** `TwoDoors`, 1 state |
| 19 | What AWS Is | Amazon's cloud rents computers, disks, databases and networks by the hour, from many countries | **Text only** plus the AWS mark (`tech/aws.png`, to be added to the library first, plan §7.5). `ContentNoteSlide`. The four rentable things are named again with cards on slide 21, and two consecutive "many things" figures would read as one figure twice (style guide §8) | | Kit default | Reuse `ContentNoteSlide` |
| 20 | The Market Share | About one in four cloud servers in the world is AWS | `ShareBar` (in progress, §7.3) | | | In progress |
| 21 | Over 200 Services | AWS has more than 200 services; this course needs one | **`ServiceField`**, full width 1100 x 300 above the four cards, or the right column if the cards need the width. A grid of 200 small squares, 20 across by 10 down, 14 px each with a 6 px gap (394 x 194), in `colors.line`. Four squares lit `colors.brand`, spread across the grid, each with a leader line to a 17 px label outside the grid: EC2, S3, RDS, VPC. The EC2 square is the only one with a 2.5 px border and the chip "this course" | The cards give four names. The field shows the **count**, and shows how small four is against it, which is the sentence "you do not need 200" made visible. Rooms find 200 frightening until they see they need one square | The 200 squares fill in a wipe from top left, `T.draw` 860 ms total (not 200 staggers). Then the four lit squares pop one at a time at `T.stagger`, each leader line drawing `T.drawStep` 600 ms with its label fading `T.label` after. The four cards below are the content and may build on click per the style guide's "give the set a build" | **New** `ServiceField`, 1 state (`highlight` prop takes the four names and which one is "this course") |
| 22 | The Console | This is what you see after sign in; the search box and the Region name are the two things to find | **Real capture**, `Shot`, 1100 x 400, one highlight box around the search box (rule 11: one box only; the Region name gets the caption instead). Account ID cropped | | `Shot` `T.enter` | Reuse `Shot` |
| 23 | Find EC2 | Type the name in the search box and you reach any of the 200 | **Real capture**, `Shot`, the dropdown result, cropped to search box plus result, no highlight (the crop is the point). Small inline `ServiceField` at 200 x 100 in the caption row, with only EC2 lit, tying back to slide 21 | The mini field says "this is one of the 200 squares", so the search box is understood as the way into the grid, not as a random UI element | `Shot` first; mini field fades `T.label` after | Reuse `Shot`; `ServiceField` at small size |
| 24 | EC2 Rents a Computer | Elastic Compute Cloud: the rented computer is the same computer, in someone else's building | `CloudPicture` state 2 (in progress) plus `LayerStack` with `stepped={false}`, layers top-first: your containers, Docker Engine, EC2 instance (yours, `ships`), physical server, Amazon data centre Mumbai. Decide at render time which of the two carries the slide (plan §7.4) | | `LayerStack` entrance in parallel with the text | Reuse `LayerStack`; `CloudPicture` in progress |
| 25 | Instance | One rented computer: public IP, always on until you stop it, you log in over SSH | **`MachineCard`**, right column 420 x 280. The **same server box glyph `CloudPicture` draws**, at 180 x 220, centred. Three tags with 2 px leader lines to three points on the box: top right, a chip in mono "13.235.67.89" labelled "public address"; left edge, a small round lamp lit `colors.brand` labelled "on until you stop it"; bottom, a keyhole glyph labelled "you log in with a key". One word under the box in 19 px: "instance" | The three bullets are three facts. The card pins each fact to a **place on the box**, and because it is the same box as slide 10 and 24, the room learns that "instance" is the name for the thing they have been looking at, not a fourth new thing | Box `T.enter`; tags at `T.stagger` in the order the bullets land: address, lamp, keyhole. Each leader draws `T.drawStep` then its label fades `T.label` | **New** `MachineCard`, 1 state. Depends on `CloudPicture` exporting its server glyph (§4.3 asks for this) |
| 26 | Instance Type | Same two vCPU; memory 1, 2, 4 GB; the smallest fits this course | **`SizeChart`**, left column 460 x 300, beside the `DataTable` (or the capture, if it reads). Three boxes on one baseline, like sizes on a rack: S, M, L. Each is 110 px wide (same width, because vCPU is the same) and 60, 120, 240 px tall (height doubles with RAM). Inside each, mono label `t3.micro`, `t3.small`, `t3.medium` and under it `1 GB`, `2 GB`, `4 GB`. Two small chip glyphs at the foot of every box, identical, labelled once "2 vCPU each". The S box carries a `colors.brand` border and the chip "this course" | The table gives numbers. The chart shows the **shape of the choice**: equal width, doubling height, and the smallest one marked. The T-shirt reading (same cut, bigger size) is one the whole room owns | Boxes rise from the baseline (`scaleY` from 0.9 with `transform-origin: bottom`, never from 0) at `T.stagger`, small to large. The "2 vCPU each" label fades `T.label` last, because it is the fact that makes the width equal | **New** `SizeChart`, 1 state (`sizes` prop, three rows) |
| 27 | AMI | Amazon Machine Image: the template the computer boots from, as a Docker image is to a container | **Two `FanOut` figures stacked**, right column 460 x 330, 150 px each with a `LayerGap`-style arrow between the two labelled "same idea". Top: source "Docker image" (Docker mark), three copies labelled "container". Bottom: source "AMI, Ubuntu Server 24.04" (Linux or Ubuntu mark, plan §7.5), three copies labelled "instance". `AnalogyMap` rows sit left with the words | `FanOut` was promoted for exactly this: one source, many copies (the stamp and its prints). Drawing both fans in the same shape makes the analogy **visible as a shape** before the words are read | Both fans use `FanOut`'s own entrance; the bottom fan starts 260 ms after the top so the eye reads top then bottom; `AnalogyMap` rows stagger in parallel | **Reuse** `FanOut` twice; reuse `AnalogyMap` |
| 28 | Key Pair | The file that lets you in instead of a password; made when the instance is launched, next session | **`LockAndKey` state `apart`**, right column 440 x 240. Left half: the small laptop from `CloudPicture`, with a file card on it in mono `my-key.pem` and a key glyph on the card. Right half: the `MachineCard` box, smaller, with the keyhole from slide 25. A dotted line from key to keyhole, not yet joined, and one chip on the line: "next session" | One sentence on the slide, so the drawing carries the rest: the key is a **file on your laptop**, the lock is **on the instance**, and they are not joined yet. The room leaves knowing what the next session hands them | Laptop and box `T.enter` together; file card at +130 ms; key glyph +260 ms; dotted line draws `T.draw`; chip fades `T.label`. The `fitted` state, where the key slides into the keyhole over `T.travel` 780 ms, is reserved for the next deck | **New** `LockAndKey`, 2 states (`apart` now, `fitted` for session 10) |
| 29 | AWS in One Line | Three lines | **Text only**, `RecapSlide` | | | Reuse |

### Concept 3 · Regions and Networks

| # | Title | Idea | Drawing | Argument | Entry | Source |
|---|---|---|---|---|---|---|
| 31 | What a Region Is | A Region is a city with AWS data centres in it | **`PlaceLadder` state `region`**, right column 400 x 260. Three rungs top to bottom, each a 380 x 68 row: a city skyline glyph, "Region · a city"; a building glyph, "Availability Zone · a building in it"; a floor-plan glyph (a rectangle with one lit stripe), "Subnet · a floor in the building". Only the top rung is drawn in `colors.brand`; the two below are `colors.muted` outlines with their labels in `colors.muted`, present but not yet taught (they are named, not opened, and the ladder is a "where are we" figure, so the roadmap exception in hard rule 4 applies) | The bullets define a Region. The ladder shows the room that **two more words are coming and how they nest**, so when "Availability Zone" arrives on slide 33 it lands on a rung that already exists instead of on a blank | Rungs arrive top to bottom at `T.stagger`; the top rung then gets the one `T.accent` beat (border thickens to 2.5 px, label to `colors.ink`). Bullets stagger in parallel | **New** `PlaceLadder`, 4 states (`region`, `zone`, `subnet`, `all`) |
| 32 | Pick the Nearest | Mumbai is the nearest Region; nearer is faster | `RegionMap` state `world` plus the real Region selector capture (in progress) | | | In progress |
| 33 | Availability Zones | Three separate buildings in one city; if one loses power the others do not | `RegionMap` state `zones` (in progress). **Add `PlaceLadder` state `zone`** as a 300 x 200 aside under the map's caption, second rung lit, so the map's three buildings and the ladder's word agree | The ladder tells the room the map has moved one rung down the chain | Ladder arrives after the map's own entrance, second rung `T.accent` | In progress plus **reuse** `PlaceLadder` |
| 34 | VPC | Virtual Private Cloud: your own private network inside AWS | `CloudPicture` state 3 (in progress) | | | In progress |
| 35 | The Default VPC | The console already made you one, with about 65,000 private addresses | **Real capture**, `Shot`, Your VPCs, one highlight on the CIDR cell `172.31.0.0/16`. Caption in plain words. **No drawing**: the CIDR arithmetic is a sentence in the caption ("the last two numbers can be anything, that is 256 times 256 addresses"), and drawing a 65,000-cell grid would be a `ServiceField` again with a different count, which style guide §8 forbids on a second slide | | `Shot` `T.enter` | Reuse `Shot` |
| 36 | Subnets | A subnet is a slice of the VPC placed in one building | Real capture plus `CloudPicture` state 4 (in progress). **Add `PlaceLadder` state `subnet`**, third rung lit, 300 x 200, wherever the render leaves room (likely under the capture) | The ladder completes the chain the room has climbed since slide 31 | Third rung `T.accent` after the capture lands | In progress plus **reuse** `PlaceLadder` |
| 37 | Two Addresses | Public address for users and SSH; private address for AWS-internal traffic | **Text only**, `DataTable`. `CloudPicture` state 4 on the previous slide already wrote both addresses on the instance, so this table is the readout of a picture the room just saw. A drawing here would repeat state 4 | | Table staggers | Reuse `DataTable` |
| 38 | The Door List | A Security Group sits in front of the instance and lists which ports may be reached | `CloudPicture` state 5 (in progress) plus `Illustration name="ports-doors"` as a small aside (plan §7.4) | | | In progress; reuse `Illustration` |
| 39 | Networks in One Line | Three lines | `RecapSlide`. **Add `PlaceLadder` state `all`** at 320 x 220 in place of, or beside, the mascot if `RecapSlide` allows a slot; otherwise keep the kit default and skip it | All three rungs lit is the concept's summary as a shape | Rungs light top to bottom at `T.stagger` | Reuse `RecapSlide`; **reuse** `PlaceLadder` if a slot exists |

### Concept 4 · Billing

| # | Title | Idea | Drawing | Argument | Entry | Source |
|---|---|---|---|---|---|---|
| 41 | The Free Plan | USD 100 credit, no charge unless you click Upgrade, card kept for identity only | **Text plus one `StatTile`**: value "USD 100", label "about ₹8,500 of credit, on sign-up" (D6), right column, beside the `DataTable`. No drawing beyond the tile: the facts are a table, and the one number worth making large is the credit | The tile makes the credit the largest thing on the slide, which is the fact a nervous room needs first | `StatTile` `T.enter` in parallel with the table | Reuse `DataTable`, `StatTile` |
| 42 | What Costs Money | Four meters run: a running instance per hour, a disk per GB per month, an unattached Elastic IP per hour, data leaving per GB | **Four `Meter` figures, state `running`, small**, one inside each of the four cards, 200 x 120 above the card text. Each meter's unit label is the card's unit: "per hour", "per GB per month", "per hour while idle", "per GB out". The Elastic IP meter has its bulb **off** but its digits still ticking, in `colors.danger` (state `idleBilled`): the one meter that charges with the light off. The price from the Mumbai list sits under each as the card's one number | The cards say four things cost money. Four ticking meters say **they are all the same kind of thing**, and the one with the light off and digits moving is the trap slide 43 names. A room that saw one meter on slide 13 reads four in a glance | Cards build on click (the four items are the content). Inside each card the meter follows the slide 13 order at half scale: box, lamp, bulb, then tick. The `idleBilled` meter's first tick is the card's `T.accent` beat | **Reuse** `Meter`; adds state `idleBilled` |
| 43 | What Is Free | A stopped instance's CPU, data coming in, the VPC and its parts are free; the disk of a stopped instance is not | **`StatusList`** (three green rows, one red) with **one `Meter` state `idleBilled`** as the right-column aside, 320 x 240, labelled "the disk of a stopped instance". Its bulb is off, its digits tick. Caption: "Stopped is not deleted. The disk stays, and so does its meter" | The list states it. The meter with the light off and digits moving is the one image that makes "why does a stopped instance cost money" stop being a question. It is why next session ends with Stop and a check of the disk | `StatusList` staggers; meter `T.enter` in parallel; its tick begins as the red row lands | **Reuse** `Meter` state `idleBilled`; reuse `StatusList` |
| 44 | The Billing Page | Your bill is zero and the credit is there | **Real capture**, `Shot`, one highlight on the USD 0.00 total (the bill with a zero on it, as a real screen, per rule 30, never a drawing). Account ID cropped | | `Shot` `T.enter` | Reuse `Shot` |
| 45 | Free Plan Credits | The USD 100 is on the Credits page | **Real capture**, `Shot`, cropped to the credits table, no highlight | | | Reuse `Shot` |
| 46 | A Budget Alert | Three steps make AWS email you before anything surprises you | **Real capture** of Create budget with the Zero spend template, left, 640 x 380; `StepList` of three steps right. **`Meter` state `alert`** as a 220 x 160 glyph above the third step: the meter with a small bell above the lamp, and a thin threshold line across the readout at zero; when the digits would pass the line, the bell tilts once. Label: "emails you at the first cent" | The steps tell you what to click. The bell on the meter tells you **what the thing you are making does**, in the same picture as slide 13 | Capture `T.enter`; steps stagger; the bell glyph arrives with step 3 and gives one tilt over `T.accent` 600 ms, then stays still | **Reuse** `Meter`; adds state `alert`; reuse `Shot`, `StepList` |
| 47 | Never Upgrade | The only click that can cost money is Upgrade to Paid plan | **Real capture**, `Shot`, cropped tight to the Upgrade button and its label, 520 x 200, with a `Callout` beside it: "Do not press it during this course". Not a drawing of a button: the room must recognise the real one when they see it | | `Shot` `T.enter`; `Callout asStep={false}` | Reuse `Shot`, `Callout` |
| 48 | Billing in One Line | Three lines | `RecapSlide`. If the kit slot from slide 39 exists, **`Meter` state `stopped`** (bulb off, digits still, `colors.muted`) at 300 x 220 in the mascot position: the last picture of Concept 4 is a meter at rest | The quiet meter is the concept's summary as a shape: no light, no ticking, nothing to pay | `T.enter` only, no tick | **Reuse** `Meter`; adds state `stopped` |

### Closing

| # | Title | Idea | Drawing | Argument | Entry | Source |
|---|---|---|---|---|---|---|
| 49 | Key Takeaways | The four agenda names, verbatim | Kit `KeyTakeawaysSlide` | | | Reuse |
| 50 | Practice | Open the console, set Mumbai, open EC2, VPC, Billing, create the zero-spend budget | Kit `PracticeSlide` (the notepad, per `Illustration.tsx`) | | | Reuse |
| 51 | What Comes Next | Next session launches the first instance in Mumbai and runs the two images on it | **`CloudPicture` state 2** again, unchanged, with the two containers as the only `colors.brand` elements and a chip "next session" on the instance. Nothing new is drawn: the room sees the picture they already know and the part that will come alive | Continuity: the next deck opens on this exact drawing | Kit entrance | **Reuse** `CloudPicture` state 2 |

---

## 4. The components

Each one is a single React component in the same shape as `CloudPicture`: an
SVG or a small DOM tree, a `state` prop, colours from `tokens.ts`, timings from
`figureTiming.ts`, `useInstant()` honoured so a Ctrl+arrow jump mounts the
final frame. Prototyped in `slide-kit/cloud-lab` (devPort 5236) beside the
three in-progress figures, screenshotted in every state, looked at (rule 17),
then promoted only if the user approves (rule 14).

### 4.1 `Meter` (new, kit candidate)

The electricity meter, drawn once, seen five times.

```
props: {
  state: 'running' | 'stopped' | 'idleBilled' | 'alert'
  unit?: string          // "per hour", "per GB per month"
  label?: string         // one line under the readout
  reading?: string       // starting digits, default "00000"
  size?: 'lg' | 'md' | 'sm'   // 420x330, 320x240, 200x120
  tick?: boolean         // default true for running and idleBilled
}
```

Layout, `lg` (420 x 330): a rounded box 260 x 150 centred at the top, with a
five-cell readout 200 x 56 inside (mono, 28 px, `colors.ink` on
`colors.surface2`); a 22 px round lamp on the box's top edge; a 2.5 px cable
from the box's bottom edge down 90 px to a bulb glyph 44 px tall; the unit in
17 px to the right of the readout; the label in 18 px under the bulb.

States: `running` lamp and bulb in `colors.brand`, last cell ticks every
900 ms. `stopped` lamp and bulb `colors.muted`, no tick. `idleBilled` lamp
and bulb `colors.muted`, readout border `colors.danger`, last cell ticks in
`colors.danger`. `alert` as `running` plus a bell glyph 26 px above the lamp
and a 2 px threshold line across the readout; the bell tilts 15 degrees once
over `T.accent`.

The tick is the only looping motion in the deck. It is slow, it moves one
digit, and it is quiet enough to talk over. It stops under `useInstant()`.

### 4.2 `PlaceLadder` (new, kit candidate)

Three rungs: city, building, floor.

```
props: {
  state: 'region' | 'zone' | 'subnet' | 'all'
  size?: 'md' | 'sm'     // 400x260, 300x200
}
```

Layout, `md`: three rows of 380 x 68 with 14 px gaps. Each row: a 48 px glyph
at the left (skyline: three rectangles of different heights; building: one
tall rectangle with a 3 x 4 window grid; floor: a wide rectangle with one
horizontal stripe lit), then two labels: the AWS word in 19 px bold
(`Region`, `Availability Zone`, `Subnet`) and the anchor in 17 px
(`a city`, `a building in it`, `a floor in the building`). Lit rows use
`colors.brand` border and `colors.ink` text; unlit rows `colors.muted`
outlines and text at 55 percent. In `all`, every row is lit and a 2 px
bracket down the left edge joins them.

The rows are named from the first slide (31) even though two are unlit. The
figure's job is "where are we", which is the roadmap exception in hard rule
4, and the words are the ones AWS itself uses, so nothing is being opened
early.

### 4.3 `CloudPicture` state 0 and a shared server glyph (extend, in progress)

Two requests to the agent building `CloudPicture`, not a redesign:

1. **A state 0** before state 1: laptop labelled "you" at the left, one
   building outline at the right with a single computer box inside, one solid
   line between them labelled "the internet". No addresses, no cloud outline,
   no greyed laptop. State 1 then adds the address, the cloud outline, and
   greys the laptop, so slides 7 and 10 are two frames of one drawing.
2. **Export the server box glyph and the laptop glyph** as small components
   (for example `ServerGlyph` and `LaptopGlyph` from the same file), so
   `MachineCard`, `LockAndKey` and `TwoDoors` draw the identical box. The
   room should never see two different drawings of "a computer".

If the other agent would rather not add state 0, slide 7 falls back to text
only with the AWS mark, and the first drawing arrives on slide 10 as the plan
already says. Nothing else in this document changes.

### 4.4 `OwnVsRented` (new, session-local first)

Two vignettes for the two cards on slide 8.

```
props: { state: 'scale' | 'fails'; width?: number }   // 300x130 default
```

`scale`: `LaptopGlyph` at the left, 80 px wide. A row of ten 8 px person
dots arrives under it in `colors.brand`, fitting inside its footprint. A
second row of twenty dots arrives faster and runs past the right edge of the
laptop in `colors.muted`, with a 15 px label "10,000" at the end of the row.
`fails`: the same laptop centred, three glyphs around it (plug pulled, lid
closing, wifi with a slash) at `T.stagger`; the screen's `colors.brand` fill
dims to `colors.muted` over `T.accent` as the third glyph lands.

Session-local until a second deck needs it. Concept 1 of this deck is the
only place in the course that argues "your laptop cannot".

### 4.5 `ServiceField` (new, session-local first)

```
props: {
  count?: number                     // 200
  cols?: number                      // 20
  lit: { name: string; note?: string }[]   // EC2 "this course", S3, RDS, VPC
  size?: 'lg' | 'sm'                 // 394x194 grid + labels, or 200x100
}
```

Squares 14 px with 6 px gaps in `colors.line`; lit squares `colors.brand`
with a 2 px leader to a 17 px label outside the grid on alternating sides so
no two labels share a row. The `note` square gets a 2.5 px border and a chip.
Fill wipes over `T.draw`; lit squares then pop at `T.stagger`. `sm` size
draws only the grid and lights the squares with no labels (slide 23).

### 4.6 `SizeChart` (new, kit candidate)

```
props: {
  sizes: { name: string; ram: string; height: number }[]  // three rows
  same?: string          // "2 vCPU each"
  pick?: number          // index of "this course"
}
```

Boxes 110 px wide on one baseline at y 260, heights from the `height` prop
(60, 120, 240), 40 px apart, mono name 17 px and RAM 19 px bold inside, two
identical 16 px chip glyphs at every foot, the `same` label centred under the
baseline in 17 px, the picked box with a `colors.brand` border and a chip.
Boxes rise with `scaleY` from 0.9, `transform-origin: bottom`, at `T.stagger`.

Kit candidate because every "which size" table in the course (instance types
now, disk sizes later, RDS classes if the course goes there) is this shape.

### 4.7 `LockAndKey` (new, kit candidate)

```
props: { state: 'apart' | 'fitted'; keyName?: string; chip?: string }
```

440 x 240. `LaptopGlyph` at left with a 90 x 110 file card, mono `keyName`
(default `my-key.pem`) and a 28 px key glyph. `ServerGlyph` at right with a
keyhole. `apart`: a 2 px dotted line from key to keyhole, a chip at its
midpoint (given its own x). `fitted`: the key travels along the line over
`T.travel` 780 ms and the keyhole's ring turns `colors.success`. Session 9
uses `apart`; session 10 uses `fitted` the moment the key pair is downloaded,
which is what earns it a place in the kit.

### 4.8 `TwoDoors` (new, session-local)

```
props: {
  roof: string                              // "Amazon"
  doors: [{ sign: string; mark: string; step: 'bag' | 'server' }, { ... }]
  caption?: string
}
```

460 x 300. Roof line at y 40 with the `roof` label; walls down to a baseline
at y 260; two door arches 90 px wide with 120 px between them; each with its
`mark` (PNG, 44 px) above the arch and its `sign` in 19 px on the arch; a
shopping bag glyph or `ServerGlyph` at 40 px on the step. Building
`T.enter`, left door +130 ms, right door +260 ms, marks `T.label`, caption
last. One state. Used once in the course, so it stays in the session app
unless a later deck needs "one company, two products".

### 4.9 `MachineCard` (new, session-local, depends on 4.3)

```
props: { address?: string; tags?: ('address' | 'power' | 'key')[]; label?: string }
```

420 x 280. `ServerGlyph` at 180 x 220 centred; up to three leader lines
(`T.drawStep` each) to a mono chip, a lamp and a keyhole, with 17 px labels
at explicit x positions clear of the box; `label` in 19 px under the box.
Tags arrive in the order given, at `T.stagger`, so the deck author can match
them to bullet order.

---

## 5. Build list, ordered by teaching value

What "teaching value" means here: how many slides the component carries, how
hard the idea is without it, and whether a later session reuses it.

| Order | Component | Slides | States to build | Where it lives | Why this position |
|---|---|---|---|---|---|
| 1 | **`Meter`** | 13, 42, 43, 46, 48 (and 11 as an icon) | 4: `running`, `stopped`, `idleBilled`, `alert` | Kit | Billing is the concept the room fears; the meter carries the whole of Concept 4 and the pay-for-use idea in Concept 1. The stopped-disk trap on 43 is only convincing as a picture |
| 2 | **`PlaceLadder`** | 31, 33, 36, 39 | 4: `region`, `zone`, `subnet`, `all` | Kit | The three hardest nouns in the deck, nested. Cheap to draw, and it rides beside `RegionMap` and `CloudPicture` without competing |
| 3 | **`CloudPicture` state 0 and glyph exports** | 7, and every figure that draws a computer | 1 new state, 2 small exports | Kit (in progress) | A request to the other agent. Highest leverage per line of code: one frame makes slides 7 and 10 a sequence, and the shared glyph is what makes 25, 28 and 18 read as one deck |
| 4 | **`ServiceField`** | 21, 23 | 1 (plus `sm` size) | Session-local | "More than 200" is a number nobody can picture. The field makes it a wall of switches with four turned on |
| 5 | **`SizeChart`** | 26 | 1 | Kit | The first time the room chooses an instance type; a later session chooses disk sizes with the same figure |
| 6 | **`LockAndKey`** | 28 (session 10 completes it) | 2: `apart`, `fitted` | Kit | One sentence on the slide, so the drawing does the teaching, and the next deck pays it off |
| 7 | **`OwnVsRented`** | 8 | 2: `scale`, `fails` | Session-local | Concept 1's two big reasons, drawn so the room watches the overflow and the screen going dark |
| 8 | **`TwoDoors`** | 18 | 1 | Session-local | Corrects the "Amazon is a shop" answer as a shape. Used once |
| 9 | **`MachineCard`** | 25 | 1 | Session-local | Useful, but only after 4.3 lands; if the glyph export is late, slide 25 stays text and nothing else breaks |

### Kit figures reused, no build

| Figure | Slides | How |
|---|---|---|
| `FanOut` twice | 27 | Docker image to containers above, AMI to instances below. The stamp and its prints |
| `AnalogyMap` | 13, 27 | The word mapping, beside the `Meter` and the `FanOut`s |
| `LayerStack stepped={false}` | 24 | The data centre to containers stack, if the render prefers it over `CloudPicture` state 2 |
| `StatusList` | 3, 43 | Rows with verdicts |
| `StepList` | 46 | The three budget steps |
| `StatTile` | 41 | USD 100 large |
| `DataTable` | 9, 11, 18, 26, 37, 41 | Plan §7.6 |
| `Shot` | 12, 22, 23, 35, 44, 45, 46, 47 | Real captures, cropped, one highlight at most |
| `Illustration name="ports-doors"` | 38 | Plan §7.4 |
| `RecapSlide`, `KeyTakeawaysSlide`, `PracticeSlide`, `QuestionSlide` | 5, 15, 17, 29, 39, 48, 49, 50 | Kit defaults |
| `CloudPicture` state 2 | 51 | Unchanged, with a "next session" chip |

### Cost in states, total

Nine components, **17 states** to draw and screenshot: Meter 4, PlaceLadder
4, CloudPicture +1, ServiceField 1, SizeChart 1, LockAndKey 2, OwnVsRented 2,
TwoDoors 1, MachineCard 1. Of the eighteen figure slides in the deck that are
not real captures, twelve now carry a drawing that argues something, and the
other six are tables or lists on purpose (§3 says why for each).

If time allows only the top three, the deck still changes character: the
meter, the ladder and the state 0 frame are the three pictures a lost learner
can use to find their way back in.

---

## 6. Slides that stay text on purpose

For the record, so nobody adds a decoration later:

| # | Why text |
|---|---|
| 3, 5, 17 | Status list and questions; hard rule 16 |
| 9, 11, 37, 41 | Two- or three-column comparisons of short facts; plan §7.6. A drawing would restate the rows |
| 14 | Three companies of equal weight, and the size claim is withheld until slide 20 |
| 19 | The four rentable things are drawn on slide 21; two "many things" figures in a row read as one figure twice |
| 35 | The CIDR arithmetic is one sentence, and a 65,000-cell grid would be `ServiceField` again |
| 47 | The real Upgrade button must be recognisable; a drawing of a button teaches the wrong picture |
| 15, 29, 39, 48 | Recaps, kit default, with the optional `PlaceLadder` and `Meter` slot if `RecapSlide` offers one |
