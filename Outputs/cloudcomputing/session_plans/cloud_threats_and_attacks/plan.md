# Cloud Threats & Attacks · slide-wise plan

STATUS: signed off by the user, 2026-11-16 (plan as written; the Session 13 visual standard recorded as generate-slides correction 17 / cloud course R14, icons in the engine as `@/engine/icons3d`)

- **Session:** cloud computing session 16. Deck project at
  `/home/nxtwave/Desktop/webslides/Outputdecks/cloudcomputing/cloud_threats_and_attacks/` (the whole project outside the
  repo, rule of 2026-11-13; this plan stays here). Built with `deck-engine/`
  (`node deck.mjs build|check|perf /home/nxtwave/Desktop/webslides/Outputdecks/cloudcomputing/cloud_threats_and_attacks`).
  Dev port 5284 (builder forks 5331-5338). Listed in `Outputdecks/cloudcomputing/course.json` (the existing
  `Cloud Threats & Attacks` row gets its folder) when built; nothing committed or pushed there unless asked.
- **Series match:** Session 13 (`iam_fundamentals`) **as corrected on 2026-11-16**, not as first built: `deck.json` +
  `custom/*.tsx` merged in `custom/index.tsx` (stubs first) + `images/`.
- **Source:** `Reference ppt's/Session 16 _ Cloud Threats & Attacks.pdf` (17 pages), extracted to `tr.txt` beside this
  plan. **TR numbering as printed:** two slides are both labelled "Slide 3" (the DoS vs DDoS table, then Volumetric
  Mechanics), and there is no Slide 7 or Slide 15. No content is missing, only the numbers. Below, the second "Slide 3"
  is **TR 3b**; every other TR slide keeps its printed number.
- **The TR's two pictures** (page 2-3, under TR 1: a DoS diagram, Attacker → Target Server → User A / User B blocked, and
  a DDoS diagram, Bot 1-5 → Target Server → User A / User B blocked) are flat green boxes at 778 px. They are **redrawn**
  in the deck's style on T01-B with the same parts and the same words, not pasted in.
- **No screenshots** in the TR and no console cue that needs one (TR 6 says "AWS console sketch", drawn as an
  architecture flow of official marks).
- **Official marks (rule 54), each in the white tile.** In `slide-kit/assets/aws/` already: Shield, WAF (and WAF rule),
  GuardDuty, API Gateway, CloudTrail, Trusted Advisor, IAM, IAM Access Analyzer, S3 (bucket, object), EC2. **To add from
  the official AWS Architecture Icons package:** CloudFront (and its edge location resource), Secrets Manager, Security
  Hub, Config, Elastic Container Registry (ECR), Bedrock. EC2 security group is drawn with the official VPC security
  group resource mark if the package carries it.

## The Session 13 visual standard, built in from the first draft (your word, 2026-11-16)

You asked that this deck and every further one carry the improved icon and card style of Session 13's correction round
and not repeat its first build's padding and plain-visual mistakes. What that round changed, and how this deck has it
from the start:

| Session 13 first build had | Built here from the first draft |
|---|---|
| Flat line icons (lucide) inside the technical visuals | **Glossy vector 3D icons** (Session 13's `icons3d.tsx`: `Ico3D` / `Tile3D`, lit top, extruded side, specular highlight, contact shadow), sharp at any zoom. New names this TR needs are drawn in the same family: bot, IoT camera, router, firewall, connection table, CPU gauge, pipe, database, package, container, pipeline, mask, radar, chat, model, vector, faucet, bill, meter, megaphone |
| Icons sitting bare on the stage | Every icon on a **white plinth tile** (white-to-pale-blue gradient, 1.5 px inset rim, soft drop shadow); official AWS marks on the same white tile |
| Cards touching their stage edge, text near borders | **Equal padding on all four sides, at least 20 design px** inside every stage and card; inner padding = parent's; no wrapper card round a card pair |
| Straight lines crossing boxes, heads off target | **Orthogonal connectors**: 90-degree elbows with soft corners, leaving the source edge and ending with the tip on the target edge, computed from the same constants as the boxes |
| Visuals that stop after the build | **Micro-animations on every icon** (bob, pulse, glint, tilt) and **flow dots on every wire**, looping without a rest; a lit-item highlight that walks first → last → first. All loops are `transform` / `opacity` on an HTML element or a root `svg` (low-end PC rule); everything held on `?still` |
| Plain boxes where the TR names a thing | The thing itself, drawn: a server, a bucket, a key, a chat window, a faucet; technically correct directions (requests in, replies out, amplified reply larger than the query) |

Sessions 9-13's standing corrections 1-16 and course rules R1-R13 also hold as before: real-time 3D analogies on
`@/engine/three-stage` with Character Lab people (`castSprite`), text-free analogy cards, one single-word Title Case tag
under each untagged icon, blue as the only text highlight, TR red as template orange (rule 51), table icons that float,
no table highlight unless the TR asks, `check` 0 FAIL 0 WARN, `perf` 0 FAIL, Firefox PASS.

## Text policy (binding, same as Session 13)

1. Kicker = the TR `Heading`, title = the TR `Subheading`, in the TR's own case (`DoS Vs DDoS`, `Malicious vs
   Accidental` kept as written). The TR `Content` paragraph is the `lead`; bullets are points (or the text inside a
   one-row-per-bullet figure); tables are tables; a TR closing sentence under a list or table is the slide's `note`.
2. Allowed edits are punctuation, letter case and layout only: a spaced em dash becomes a colon (TR 8, TR 13 leads; the
   TR 24 analogy in notes); the unbalanced quote in TR 13 (`'Everyone (public access)`) is closed; the stray `"` after
   TR 18's ECR bullet and the stray marks from the PDF are removed; `Analogy:A shop` spaced; no mark ends a line (rule
   36); figure tags capitalise every word (rule 56); product names and code keep their form (`"Principal": "*"`,
   `0.0.0.0/0`, `SYN`, `HTTP`, `UDP`, `DNS`, `NTP`). Every word stays.
3. Too long → split at the TR's own bullet boundary into a second frame with the same kicker and title (T01-B, T05-B,
   T17-B, T18-B, T19-B below).
4. Speaker Notes → `notes`, verbatim, on every frame of a split. Visual Guidance → the figure spec. Analogy → its own
   analogy slide, the TR sentence in `notes`.
5. Figure tags use only TR words and product names. No invented numbers, incidents or company names. Where the TR's
   picture needs words it does not give (the hidden instruction in TR 21's chat), the text is drawn as grey text bars
   with the one hidden line lit orange, not invented sentences.
6. Recap, agenda and takeaways carry the five titles only (R5); breakers the title only.

## Deck (51 frames)

Opening
| id | layout | content |
|---|---|---|
| S-WELCOME | brand | |
| S-TITLE | title | Cloud Threats & Attacks (R9) |
| S-RECAP | recap | previous: Encryption & Key Management; Data States · Cryptography Essentials · Encryption in Transit · Encryption at Rest · Key Management; presenter illustration (R6) |
| S-AGENDA | agenda | Denial of Service · Data Breaches · Misconfiguration · Insider & Supply-Chain Threats · AI-Specific Threats |

Section 1 · Denial of Service
| id | layout | TR | content and figure |
|---|---|---|---|
| D1 | breaker 1 | | |
| T01 | points | 1 | lead; bullets 1-3; figure (Visual Guidance): a three-tier pyramid of extruded blocks, `Volumetric` at the base (pipe icon, tag `Bandwidth`, `L3 / L4`), `Protocol` in the middle (connection-table icon, `Connection State`, `L3 / L4`), `Application` at the top (CPU gauge icon, `Compute`, `L7`); point N lifts and lights tier N; after the build the light walks base → top, looping |
| T01-B | lead | 1 | lead: bullet 4 (`Distinguishing factor between DoS and DDoS: source count`); figure: the TR's two pictures redrawn side by side in two equal panels. Left `DoS`: one `Attacker` laptop, one straight elbow into the `Target Server`, which shakes and dims; `User A` and `User B` below, each with a `Blocked` cross. Right `DDoS`: `Bot 1` to `Bot 5` (compromised devices, each with a small alert badge) on elbows converging on the `Target Server`; the same two blocked users. Flow dots: one stream on the left, five on the right, looping |
| T02 | points | 2 | lead; 4 points; figure (Visual Guidance): `Attacker` → `C2 Server` (megaphone badge) → fan of bots (IoT camera, router, phone, laptop) → all converging on one `Target` server, orthogonal connectors throughout; point 1 the C2 pulses its order down the fan; point 2 a row of `Open Servers` appears between the bots and the target, each bot query carrying a mask (spoofed address); point 3 each reply leaves the open servers as a much larger dot (amplification); point 4 the bot row turns to IoT devices; loop: small dots in, large dots out |
| T02-AN | analogy | 2 | **building entrance**, 3D: one office entrance with a glass door and a waiting customer; phase 1 a single man keeps walking in and out of the doorway and the customer cannot pass; phase 2 a crowd of distinct people, steered by one organiser with a phone, packs the same entrance and the customer is pushed back ↔ concept, 3D: one laptop sending a stream of packets at a server rack (phase 1), then many devices (cameras, routers, laptops) flooding the same rack, its status light turning orange (phase 2); one loop covers both phases, restart within 0.3 s |
| T03 | table | 3 | lead; Aspect / DoS / DDoS, 5 rows, a 3D row icon each (map pin, wave, devices, block, search); **the `Source` row highlighted, as the TR asks** ("every other row follows from it"; rule 60 allows a highlight the content asks for) |
| T04 | points | 3b | lead; 4 points; figure (Visual Guidance): a traffic chart, `Gbps` on the y-axis, the incoming line climbing past a dashed `Link Capacity` line, the excess above it shaded orange (red in the TR, rule 51), feeding a pipe into an `Application` box that sits idle; point 1 UDP packets stream into the pipe; point 2 small `DNS` / `NTP` queries leave and oversized replies return; point 3 the pipe fills before the application box; point 4 a shield drops in **upstream** of the pipe; loop: the line keeps its last shape, the excess shading breathes, dots stream |
| T05 | points | 4 | lead (protocol and application sentence); bullets 1-2 (protocol); figure (Visual Guidance, left half): a firewall with a connection table of slots; point 1 `SYN` cards fill the slots and never complete, the table fills, a new user's card bounces off; point 2 an oversized packet hits a parser gear that cracks; loop: half-open cards blink in their slots |
| T05-B | points | 4 | same kicker and title; bullets 3-5 (application); figure (Visual Guidance, right half): a web server with a CPU gauge; point 3 a stream of page requests pegs the gauge; point 4 many thin, slow connections hold the server's sockets open (Slowloris); point 5 a traffic meter beside it reads in its normal band while the CPU stays pegged; loop: the gauge needle trembles at the top |
| T06 | table | 5 | lead; Mechanism / How It Works / Best Against, 3 rows, row icons (gauge gate, cleaning filter, globe of edge nodes) |
| T06-B | lead | 5 | same kicker and title, no new text; figure (Visual Guidance): incoming traffic enters on the left and splits on orthogonal elbows into a `Scrubbing` centre, `CDN Edge` nodes and a `Rate Limit` gate, each dropping orange (attack) dots and forwarding only blue (legitimate) dots to one `Origin` server; the three branches light in the table's order, then all run together, looping |
| T07 | points | 6 | lead; 4 points; figure (Visual Guidance): CloudFront edge locations ringing a globe, feeding Shield, then WAF, then the origin server (official marks on white tiles); point 1 Shield Standard's tile lights with an always-on pulse; point 2 three icons join it for Advanced (application layer, response team, cost protection); point 3 the WAF gate throttles a dense stream from one source down to a trickle; point 4 the edge ring absorbs a flood before the origin; loop: dots flow edge → Shield → WAF → origin |

Section 2 · Data Breaches
| id | layout | TR | content and figure |
|---|---|---|---|
| D2 | breaker 2 | | |
| T08 | points | 8 | lead; 3 points; figure (Visual Guidance): an `Attacker` branching on two elbows, `Credential` (key) and `API` (code brackets), both into a `Data Store` (database), a `Cost` tag (receipt) hanging below it; point N lights its path, point 3 drops the cost tag; loop: dots ride both paths |
| T09 | points | 9 | lead; 4 points; note: the TR's Secrets Manager / GuardDuty sentence; figure (Visual Guidance): a key travels `Code Repo` → `Attacker Laptop` → `Console Login`; point 1 the key sits in a code file; point 2 one key opens three locks; point 3 the MFA shield on the login is missing (dashed outline); point 4 forum, repository and log icons show the key; note: the Secrets Manager vault and the GuardDuty mark appear, the vault swallows the key and GuardDuty flags the login; loop: the key rides the path |
| T10 | points | 10 | lead; 4 points; note: the TR's API Gateway / WAF sentence; figure (Visual Guidance): `Client` → API Gateway (WAF shield on it) → backend database; point 1 the identity check at the gateway is open; point 2 the response comes back fatter than asked (extra field rows); point 3 a dense stream of automated requests; point 4 a malformed packet reaches the database; note: each gap closes, the gateway and WAF marks light; loop: requests through, responses back |
| T11 | table | 11 | lead; Cost Category / Driver, 4 rows, row icons (search, gavel, mail, users); note: the TR's closing sentence (Security Hub, CloudTrail) |
| T11-B | lead | 11 | same kicker and title, no new text; figure (Visual Guidance): bars of cost rising along `Time to Detect`, the four categories tagged along the bars; the Security Hub and CloudTrail marks sit at the short-detection end; bars grow left to right, then the early bars glint, looping |

Section 3 · Misconfiguration
| id | layout | TR | content and figure |
|---|---|---|---|
| D3 | breaker 3 | | |
| T12 | points | 12 | lead (two sentences); 3 points; figure (Visual Guidance): three plinth cards in a row, an open bucket (`Public Bucket`), a wide-open gate (`Open Rule`), a padlock with the factory key still in it (`Default Key`); point N lights card N; loop: the light walks 1 → 3 |
| T13 | points | 13 | lead; 4 points; figure (Visual Guidance): an S3 bucket with a policy document beside it showing `"Principal": "*"`; a globe on the left with an elbow straight into the bucket; point 1 the policy's line lights; point 2 two `Block Public Access` switches (bucket, account) flip off; point 3 objects list out and download to the globe with no key; point 4 a radar sweeps and finds the bucket, a clock beside it; if the four points pass the player bar, the figure narrows before any split |
| T13-AN | analogy | 13 | **shop door left unlocked**, 3D: a small shop after closing, the owner walks away, the front door stands unlocked; passers-by walk in and leave with products ↔ concept, 3D: an S3 bucket standing open on a plinth, people from around a globe reaching in and taking objects out |
| T14 | table | 14 | lead; Misconfiguration / Typical Mistake / Where Checked, 2 rows, row icons (open gate, factory key); **`0.0.0.0/0` and `left active` ringed in orange** (red in the TR, rule 51); note: the TR's AWS Config / Trusted Advisor sentence, with their two marks |

Section 4 · Insider & Supply-Chain Threats
| id | layout | TR | content and figure |
|---|---|---|---|
| D4 | breaker 4 | | |
| T16 | points | 16 | lead; 3 points; figure (Visual Guidance): `Insider`, `Supply Chain`, `Credential Theft` cards converging on orthogonal elbows into one central `Cloud Account`; point N lights card N; loop: dots ride all three in turn |
| T17 | points | 17 | lead; bullets 1-2; figure (Visual Guidance): a split card, left `Malicious` (a person with a deliberate arrow carrying data out), right `Accidental` (an open padlock left behind on a data store); point N lights side N; loop: the arrow carries data, the padlock swings |
| T17-B | points | 17 | same kicker and title; bullets 3-5; figure: both insiders' actions stream into a CloudTrail log (official mark), GuardDuty (official mark) reads the stream and flags the unusual entry; point 3 a perimeter wall is passed untouched, point 4 the log fills, point 5 GuardDuty raises its flag; loop: entries scroll, the flag pulses |
| T17-AN | analogy | 17 | **trusted employee with the stockroom key**, 3D: a shop owner hands the master key to an employee; phase 1 the employee carries stock out of the back door; phase 2 the employee closes for the night and leaves the shutter half open ↔ concept, 3D: an insider with an access badge; one path copies files out of the account, the other leaves a bucket open |
| T18 | points | 18 | lead; bullets 1-3 (threats); figure (Visual Guidance): `Registry` → `Build Pipeline` → `Container`, orthogonal; an orange flag at the registry step, `Tampered`; point 1 an update package with a bug rides into the build; point 2 a base image with the flag rides into the build; point 3 two lookalike packages, one picked by mistake; loop: parts ride the pipeline |
| T18-B | points | 18 | same kicker and title; bullets 4-5 (defences); figure: the same pipeline, the ECR mark scanning the image (scan line, alert on a known vulnerability) and a version pin locking one exact package; point N lights its defence; loop: the scan line sweeps |
| T19 | points | 19 | lead; bullets 1-3; figure (Visual Guidance): three plinth cards in a row, a fake login page, a public repo with a key, a stolen token ticket, each on an elbow into the `Account`; point N lights path N; loop: dots ride the three paths |
| T19-B | points | 19 | same kicker and title; bullets 4-5; note: the TR's closing sentence; figure: the Secrets Manager vault rotating a key (old key out, new key in) and IAM Access Analyzer flagging a broad permission; loop: the rotation turns, the flag pulses |

Section 5 · AI-Specific Threats
| id | layout | TR | content and figure |
|---|---|---|---|
| D5 | breaker 5 | | |
| T20 | points | 20 | lead; 4 points; figure (Visual Guidance): `Prompt` → `Model` → `Vector DB` → `Response`, orthogonal; point N drops a threat marker on its stage (injection on the prompt, disclosure on the response, embedding on the vector DB, consumption as a meter on the model); loop: a request rides the pipeline |
| T21 | lead | 21 | lead (two sentences); figure (Visual Guidance): left, a chat window with a pasted document whose text is grey bars, one bar lit orange with an alert icon (red in the TR, rule 51); right, three rows with the TR bullet text inside (direct: a person typing into the chat box; indirect: a document planted elsewhere; goal: system instructions overridden, hidden data out); row N lights its part |
| T21-AN | analogy | 21 | **hidden note in a document**, 3D: a manager hands an employee a task folder; inside it a hidden slip of paper; the employee reads it, turns away from the manager and hands confidential files to someone at the door ↔ concept, 3D: a chat assistant receives a document with a glowing hidden line; its output turns from the expected answer to a stream of files leaving |
| T22 | points | 22 | lead; 3 points; figure (Visual Guidance): a private document entering the model and an unrelated private snippet coming out in the response box; point 1 training pages enter and one snippet comes back; point 2 two user sessions, one's context crossing into the other's answer; point 3 the model fetches a locked document; loop: the snippet rises out of the response |
| T22-AN | analogy | 22 | **receptionist hands over the wrong file**, 3D: a reception desk with two visitors waiting and two file trays not kept apart; the receptionist hands visitor B the file from visitor A's tray; visitor B looks surprised ↔ concept, 3D: an AI assistant serving two users, a private card from user A's side landing in user B's answer |
| T23 | points | 23 | lead; 4 points; figure (Visual Guidance): documents → embeddings (rows of small bars) → `Vector DB`, an attacker elbow probing the database directly; point 1 a vector turns back into a document; point 2 a crafted document slips into the store; point 3 a query pulls a locked document out; point 4 the source files carry a lock and the vector DB does not; loop: the probe pulses |
| T24 | points | 24 | lead; 3 points; figure (Visual Guidance): a two-line chart, `API Calls` and `Cloud Bill`, both climbing; point 1 large prompts make the bill line jump; point 2 one request draws a very long output bar; point 3 a queue of other users waits behind the busy model; loop: the lines keep their shape, the newest point pulses |
| T24-AN | analogy | 24 | **tap left running**, 3D: a kitchen tap running into a sink, the water meter's counter turning and a bill on the counter growing ↔ concept, 3D: a stream of requests pouring into a GPU server, its billing meter climbing |
| T25 | points | 25 | lead; 4 points; figure (Visual Guidance): `Prompt` → Bedrock Guardrails (official mark) → `Model` → `Output Filter` → `Response` behind a `Rate Limit` gate, with the vector store and its identity policy beside the model; point N lights stage N in the TR's order (guardrails, output filter, vector store access, rate limit); loop: a prompt rides the whole flow |

Closing
| id | layout | content |
|---|---|---|
| S-QUIZ | quiz | the closing quiz frame only (Session 13's answer: no mid-deck quiz, no feedback card); questions and answers from the TR's exam hooks in `notes` |
| S-TAKEAWAYS | takeaways | the five agenda titles |
| S-NEXT | next | Security Practices & Compliance |
| S-THANKS / S-BEST | thanks | Thank You · All the Best |

## Coverage check (every TR item → slide)

| TR | item | slide(s) |
|---|---|---|
| Recap / Agenda | 5 titles each (sub-lines in notes, R5) | S-RECAP, S-AGENDA, D1-D5 |
| 1 | Content; 4 bullets; guidance; two pictures; notes | T01 / T01-B |
| 2 | Content; 4 bullets; analogy; guidance; notes | T02 / T02-AN |
| 3 | Content; table; guidance (Source row); notes | T03 |
| 3b | Content; 4 bullets; guidance; notes | T04 |
| 4 | Content; 5 bullets; guidance; notes | T05 / T05-B |
| 5 | Content; table; guidance; notes | T06 / T06-B |
| 6 | Content; 4 bullets; guidance; notes | T07 |
| 8 | Content; 3 bullets; guidance; notes | T08 |
| 9 | Content; 4 bullets; closing sentence; guidance; notes | T09 |
| 10 | Content; 4 bullets; closing sentence; guidance; notes | T10 |
| 11 | Content; table; closing sentence; guidance; notes | T11 / T11-B |
| 12 | Content; 3 bullets; guidance; notes | T12 |
| 13 | Content; 4 bullets; analogy; guidance; notes | T13 / T13-AN |
| 14 | Content; table; closing sentence; guidance; notes | T14 |
| 16 | Content; 3 bullets; guidance; notes | T16 |
| 17 | Content; 5 bullets; analogy; guidance; notes | T17 / T17-B / T17-AN |
| 18 | Content; 5 bullets; guidance; notes | T18 / T18-B |
| 19 | Content; 5 bullets; closing sentence; guidance; notes | T19 / T19-B |
| 20 | Content; 4 bullets; guidance; notes | T20 |
| 21 | Content; 3 bullets; analogy; guidance; notes | T21 / T21-AN |
| 22 | Content; 3 bullets; analogy; guidance; notes | T22 / T22-AN |
| 23 | Content; 4 bullets; guidance; notes | T23 |
| 24 | Content; 3 bullets; analogy; guidance; notes | T24 / T24-AN |
| 25 | Content; 4 bullets; guidance; notes | T25 |
| Key Takeaways / Upcoming | 5 titles / Security Practices & Compliance | S-TAKEAWAYS / S-NEXT |

## Narrative and pedagogy

The TR's order is the deck's order. Section 1 makes availability the target: the three layers on one pyramid, one
source against many, how a botnet multiplies one attacker (a crowded entrance), the comparison table, then each layer's
mechanics (bandwidth, connection state, compute) and the defence matched to each, ending on where AWS places them.
Section 2 turns from availability to data: the two entry paths and their cost, each path on its own (a leaked key's
journey, the API's four gaps), then the cost table and its growth with detection time. Section 3 shows that most of
those breaches are a setting left wrong: three mistakes, the public bucket (a shop door left unlocked), then the open
rule and the factory key. Section 4 moves the threat inside the trust boundary: insiders (the trusted employee), the
software supply chain, and stolen credentials. Section 5 applies the same thinking to AI applications: the pipeline map,
then each of its four risks (two with analogies: the hidden note, the wrong file, and the running tap), and the controls
placed around the model. Every term is introduced before it is used: `DDoS` and botnet (T01-T02) before the AWS
mitigations (T07); rate limiting (T06) before it returns on APIs (T10) and AI (T25); CloudTrail and GuardDuty named in
T09-T11 before insiders are detected with them (T17-B); the vector database on the pipeline map (T20) before its attacks
(T23).

Analogies (6), each two real-time 3D scenes with no text: crowded entrance (T02), shop door left unlocked (T13),
trusted employee (T17), hidden note (T21), wrong file (T22), tap left running (T24).

## Build

All text into `deck.json` (generated once from `tr.txt` by a scratchpad script, then `deck.json` is the source) and a
`stubs.tsx` placeholder for every custom figure. Session 13's `icons3d.tsx` is the icon module (new names added in the
same drawing style), and its `c2.tsx` vocabulary (plinth tiles, orthogonal connectors from box constants, `ride` flow
dots, `useHot` walking highlight) is the base of every technical figure. Forked builders on private copies
(`deck.mjs dev` on their own ports, never `build`), each owning one custom file: section 1 figures, section 2-3
figures, section 4-5 figures, and the six 3D analogies over three files. Merge, `build`, `check` 0 FAIL 0 WARN, `perf`
0 FAIL, Firefox PASS, every slide screenshotted from the built file at step 0, mid-build and held, and read for padding,
overlaps, arrow ends and plain spots before reporting.

## As built (2026-11-16)

51 frames, as planned. `/home/nxtwave/Desktop/webslides/Outputdecks/cloudcomputing/cloud_threats_and_attacks/dist-single/cloud-threats-and-attacks.html`
(6.73 MB, self-contained). `check` 0 FAIL 0 WARN; `perf` 0 FAIL, 4 WARN at x4 CPU (slide 11 one 350 ms frame, slide 28
one 300 ms frame, slide 29 idle 7% of a core, slide 42 drew 87 of 150 frames); pristine OK; Firefox 0 FAIL 0 WARN. 3D
analogies measured at 60 fps headless with the GPU flags by their builders. Every slide screenshotted held from the
built file and read.
- **Changes from the plan:** every point and table icon is an engine 3D icon (`i3d:` refs, new in the engine);
  R7 (points within two lines) split two TR points at their own clause boundary, sharing one build step: T07's Shield
  Advanced point (`... application-layer protection` / `24/7 response team support and DDoS cost protection`) and T13's
  root-cause point (`... (\`"Principal": "*"\`)` / `Or an ACL that grants read to 'Everyone (public access)'`, letter
  case only); pointsW 610 on T01, 600 on T05 and T13.
- **Not done:** the T14 note names AWS Config and Trusted Advisor, but the note line cannot carry their marks.
- **Tags not in the TR, for review** (builders' lists): S1 Requests, User, Parser, Web Server, Traffic, Origin, Defence,
  Link, Application, Open Servers, Response Team, Cost; S2-3 Attacker, Data Store, Repository, Console, Public, Reused,
  Client, Database, Exposure, Validation, Internet, Bucket, Account, Scanners, Open Rule; S4 Perimeter, Unusual, Data,
  Steals, Exposes, Image, Scan, Vulnerability, Pinning, Exact Version, Latest, Stores, Rotates, Permissions, Broad,
  Cloud Account; S5 Chat, Document, Training, Context, Retrieval, Output, Users, Vector DB.
- **Custom files:** `a.tsx` (S1), `b.tsx` (S2-3), `c.tsx` (S4), `d.tsx` (S5), `h.tsx` (3D entrance, shop door),
  `i.tsx` (3D stockroom key, hidden note), `j.tsx` (3D reception, running tap).
