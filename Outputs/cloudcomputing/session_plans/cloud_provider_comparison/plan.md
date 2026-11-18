# Cloud Provider Comparison · slide-wise plan

STATUS: signed off by the user, 2026-11-11 ("Signed off, build"; Q1 Cloud Providers Walkthrough; Q2 "grab it yourself", then (the console was signed out) "Skip, keep the drawn page": T18 is the drawn wizard; Q3 "if tr doc mentions then only keep it": the TR names no mid-deck quiz, so only the closing quiz)

- **Session:** cloud computing session 11, `Outputs/cloudcomputing/cloud_provider_comparison/`, built with `deck-engine/`
  (`node deck.mjs build|check ../Outputs/cloudcomputing/cloud_provider_comparison`). Dev port 5281.
- **Series match:** Session 10's as-built state after correction round 1 (`serverless_computing`) and Session 9's round 4
  (`elastic_compute_instances`): `deck.json` + `custom/*.tsx` merged in `custom/index.tsx` (stubs first) + `images/`.
- **Source (content):** `Reference ppt's/11. Cloud Provider Comparison.pdf` (14 pages), extracted to `tr.txt` beside this
  plan. TR slide N is "TR N". The TR numbering skips 4, 12 and 20 (no text missing). The TR carries **no screenshots**.
- **Official marks (rule 54), each in the white tile:**
  - AWS, from the AWS Architecture Icons package into `slide-kit/assets/aws/`: EC2, S3, RDS, DynamoDB, VPC, Elastic Load
    Balancing (present), SageMaker AI, Rekognition, Comprehend, Polly, Transcribe, CloudShell (fetched).
  - Azure, from Microsoft's official Azure Public Service Icons package into `slide-kit/assets/azure/` (new folder):
    Azure logo, Virtual Machines, Storage Accounts / Blob, Azure SQL Database, Cosmos DB, Virtual Networks, Load
    Balancers, Azure Machine Learning, Computer Vision, Language, Speech, Cloud Shell.
  - Google Cloud, from Google's official Google Cloud icons package into `slide-kit/assets/gcp/` (new folder): Google
    Cloud logo, Compute Engine, Cloud Storage, Cloud SQL, Firestore, VPC network, Cloud Load Balancing, Vertex AI,
    Vision AI, Natural Language AI, Speech-to-Text, Text-to-Speech, Cloud Shell.
  - IBM Cloud and Oracle Cloud Infrastructure: the vendors' official logos (Oracle mark already in
    `slide-kit/assets/companies/oracle.png`; IBM fetched from IBM's own brand page or the Wikimedia copy of it).

## Session 9 and 10 inputs built in from the first draft (standing corrections 1-16, course R1-R13)

Everything the user corrected on Sessions 9 and 10, so none of it comes back:

| Session 9 / 10 review said | Built into Session 11 as |
|---|---|
| Overlapping icons, people and objects | Every figure laid out on a fixed grid with measured gaps; check-deck overlap/overflow 0; every slide screenshot read at step 0, mid-build and held |
| Text on borders, uneven padding, wrapper cards round card pairs | Equal padding on all four sides of every inner card, inner padding = parent's; no wrapper card unless it means something; visuals centred in their cards |
| Isometric clay analogy rooms | Every analogy is a **real-time 3D scene** on `@/engine/three-stage` (one shared WebGL renderer, perspective camera, real lighting and shadows); never isometric, never clay |
| Modelled primitive people | Character Lab characters via `castSprite`, each an individual, role clothing (doctor coat, stethoscope, shop staff, tailor's tape), facial expressions synced to the action, minimal joints for standing roles; `Boy with a laptop.png` where the rig has no seated pose |
| Heads through roofs, people overlapping, purposeless props | Enclosures checked against the people in them, one body-width between people, every prop has a job in the TR's analogy |
| Soft 3D at 4K | Canvases at real device pixels (stage zoom x DPR, re-measured on resize / fullscreen), sprites rendered at their on-screen height |
| Long rest between loops, frozen visuals | Every analogy loop 3-9 s, restarts within 0.3 s, seamless; every technical visual and icon carries a quiet micro-animation after its build |
| Chips, number badges, connector labels, sentences inside technical visuals | Icon-first visuals; one single-word Title Case tag under each icon (R13); no chips, badges or line labels |
| Analogy cards with text | Kicker, title, two 3D scenes; at most one small tag above a visual; the TR analogy sentence in `notes` |
| Static table icons; highlighted table rows | Table icons float (engine `cvx-ticon`); no row highlight except where the TR asks (TR 14 SageMaker row, TR 15 AWS column) |
| Highlights parked on the last item | Sequential orange highlights loop first → last → first forever; held frames show nothing highlighted |
| A table repeating the next visual; a visual repeating the previous slide | Where a figure shows the table's content, the table text goes into the figure (TR 21); no two consecutive slides share a picture |
| Points over two lines beside a figure | `pointsW` or a TR clause split; where a visual holds one card per TR item, the TR text goes inside the card |
| Crooked arrows | Arrows computed from the boxes' own constants, perfectly straight, heads on their target |

## Text policy (binding, same as Sessions 9 and 10)

1. Kicker = the TR `Heading`, title = the TR `Subheading`. The TR `Content` paragraph is the `lead` (one sentence per
   line); bullets are points; tables are tables; a TR `Note` is the slide's note line.
2. Allowed edits are punctuation, letter case and layout only: ` — ` becomes `: ` (no em dash); no mark ends a line
   (rule 36); figure labels capitalise every word (rule 56); first letter of a line capitalised (R8.4); product names
   keep their own form (`Cosmos DB`, `S3`, `VNet`). TR 13's double full stop is the only typo touched. Every word stays.
3. Too long → split at the TR's sentence or clause boundary; a slide with too much becomes two frames with the same
   kicker and title.
4. Speaker Notes → `notes`, verbatim. Visual Guidance → the figure spec. Analogy → its own analogy slide.
5. Figure labels use only TR words and product names. **No invented numbers**: market-share bars show order and the
   TR's own words (Largest, Second-Largest, Third-Largest), never percentages; no prices, no region counts.
6. Recap, agenda and takeaways carry the five titles only (R5); breakers the title only. Sub-lines in `notes`.

## Deck (41 frames)

Opening
| id | layout | content |
|---|---|---|
| S-WELCOME | brand | |
| S-TITLE | title | Cloud Provider Comparison (R9) |
| S-RECAP | recap | previous: Serverless Computing; its five titles (Serverless Basics, The Execution Model, Cold Starts & Warm Starts, Limits & Constraints, BaaS & Anti-Patterns) |
| S-AGENDA | agenda | Major Cloud Providers · Service Equivalents Across Providers · Machine Learning Service Comparison · Cloud Providers Walkthrough · Choosing a Provider (see question 1) |

Section 1 · Major Cloud Providers
| id | layout | TR | content and figure |
|---|---|---|---|
| D1 | breaker 1 | | |
| T01 | points | 1 | lead (2 sentences); 4 points; figure: five official logo tiles sized by market position, AWS largest, Azure and Google Cloud mid-sized, IBM Cloud and OCI smaller; point 1 lights the three hyperscaler tiles, 2 IBM, 3 OCI, 4 a size ruler running large → small under the row; tiles breathe gently after the build |
| T02 | table | 2 | lead; Provider / Market Position / Typical Use Case, 3 rows, each row's provider logo as its icon |
| T02-B | lead | 2 | figure only: horizontal bar chart of relative market-share ORDER, AWS, then Azure, then GCP: logo at the start of each bar, the TR's tags `Largest`, `Second-Largest`, `Third-Largest` at the bar ends; bars grow in turn, then a light sheen runs along them; no numbers |
| T03 | points | 3 | lead; 3 points; the TR note (`Five-provider comparison is covered in the post-session reading material`) as the note line; figure: two columns, generalist hyperscalers (AWS, Azure, Google Cloud) on the left over a wide fan of workload icons, specialist enterprise providers (IBM Cloud, OCI) on the right over a narrow beam to a mainframe / bank and a database / ERP icon; a straight arrow left → right narrowing as it goes (`Narrower Focus` is not drawn as text: the arrow tapers); point 2's GPU chip icon beside OCI |
| T03-AN | analogy | 3 | **general physician and cardiologist**, 3D: a clinic corridor; on the left a general physician (white coat, stethoscope) seeing a queue of patients with different everyday ailments (a cough, a bandaged arm, a fever); on the right a cardiologist with an ECG monitor tracing a heartbeat, seeing one patient holding his chest ↔ concept scene: three hyperscaler towers (AWS, Azure, Google Cloud marks) taking many kinds of workloads (web, mobile, data), and two specialist towers (IBM Cloud, OCI) each taking one enterprise workload (a bank mainframe, an Oracle database / ERP) |
| T05 | points | 5 | lead; 4 points; figure: the five-provider tiles from T01 fade back in (as the TR asks), a straight arrow to a generic Compute / Storage / Database icon set; point 1 lights the three, 2 the two, 3 the size difference, 4 the arrow and the icon set |

Section 2 · Service Equivalents Across Providers
| id | layout | TR | content and figure |
|---|---|---|---|
| D2 | breaker 2 | | |
| T06 | points | 6 | lead; 4 points; figure: four-row map, a row label icon (Compute, Storage, Database, Networking) then the official AWS, Azure and Google Cloud service icon for that row (EC2 / Virtual Machines / Compute Engine; S3 / Blob Storage / Cloud Storage; RDS / Azure SQL / Cloud SQL; VPC / VNet / VPC Network); provider logos head the three columns; each point lights its row |
| T07 | points | 7 | lead; 2 points; figure: one grey `Capability` box (a server icon) with three coloured straight arrows to three product-name tags `EC2`, `Virtual Machines`, `Compute Engine`, each tag with its provider's mark; a pulse rides each arrow in turn, looping |
| T07-AN | analogy | 7 | **three telecom shops, one recharge**, 3D: a street with three telecom kiosks in three colours (no real telecom brands), each with its own differently coloured plan board, and one customer with a phone walking along; at each kiosk the same recharge (data and calls) fills her phone the same way ↔ concept scene: three provider kiosks with the AWS, Azure and Google Cloud marks, each handing out the same virtual machine (a server block) |
| T08 | table | 8 | lead; Provider / Compute Service / Console Label, 3 rows, the provider logo per row and the service's official icon beside its name |
| T09 | table | 9 | lead; Provider / Object Storage Service / Console Label, 3 rows, the provider logo per row and a bucket icon |
| T10 | table | 10 | lead; Category / AWS / Azure / GCP, 2 rows (Relational (SQL), NoSQL (document/key-value)), a table icon on the SQL row and a document icon on the NoSQL row, provider logos on the column headers |
| T10-B | points | 10 | 3 points; figure: left a fixed table grid with a join line between two tables (SQL), right flexible document cards spreading across more and more nodes (NoSQL scaling out); point 3 lights a `Data` shape choosing between them |
| T11 | table | 11 | lead; Provider / Load Balancing Service / Virtual Network, 3 rows, one logo per row; the TR note (`Cross-cloud service equivalents are covered in the post-session reading material`) as the note line |

Section 3 · Machine Learning Service Comparison
| id | layout | TR | content and figure |
|---|---|---|---|
| D3 | breaker 3 | | |
| T13 | points | 13 | lead; 4 points; figure: two boxes side by side: `Pre-Built API` (input icon → model → output icon) and `ML Platform` (Data → Train → Tune → Deploy icons, straight arrows); the four points light notebook / GPU, experiment chart, endpoint, AutoML wand inside the platform box |
| T13-AN | analogy | 13 | **ready-made shirt and the tailor**, 3D: a shop with a rack of ready shirts where a customer takes one off the rack and holds it up (instant), and beside it a tailor measuring a customer with a tape, cutting fabric and stitching on a sewing machine until a fitted shirt is ready ↔ concept scene: a pre-built API box (an image goes in, a label comes out at once) beside an ML platform workbench (data blocks → training → tuning dial → a deployed model endpoint) |
| T14 | table | 14 | lead; Provider / Platform / Key Capability, 3 rows, one logo per row (SageMaker AI, Azure Machine Learning, Vertex AI marks); the AWS SageMaker row highlighted, as the TR asks |
| T15 | table | 15 | lead; Task / AWS / Azure / GCP, 3 rows (image, text, speech icons); the AWS column ringed, as the TR asks |
| T15-B | points | 15 | 3 points; figure: one task (an image icon) going to three provider endpoints with their service marks (same task, three names), a ready-trained model badge (no training data), a REST call arrow and a structured JSON response card; lit per point |
| T16 | points | 16 | lead; 3 points; figure: two-box decision flow: `Standard Task` → `Pre-Built API`, `Custom Data` → `Platform`, `AutoML` bridging the two inside the platform side |

Section 4 · Cloud Providers Walkthrough
| id | layout | TR | content and figure |
|---|---|---|---|
| D4 | breaker 4 | | |
| T17 | points | 17 | lead; 4 points; figure: three browser windows side by side, AWS EC2 console, Azure Portal, GCP Console, each a clean sketch in its console's colours with its official mark and the same `Create VM` action (Launch Instance / Create / Create Instance) ringed; point 4 slides a Cloud Shell terminal window up under the GCP window; the ring walks the three windows, looping |
| T18 | lead | 18 | lead; figure: the EC2 Launch Instance wizard drawn as a console page with its six sections stacked down the page (Name And Tags, AMI, Instance Type, Key Pair, Network And Security Group, Launch), each section holding its TR bullet text inside (one card per TR item); the sections light top to bottom, then loop; no number badges (R10) (see question 2) |
| T19 | table | 19 | lead; Decision / AWS Console / Azure Portal / GCP Console, 6 rows, provider logos on the column headers, one icon per decision row; if 6 rows do not fit at 18 px, split rows 1-3 / 4-6 into T19 / T19-B with the same header |

Section 5 · Choosing a Provider
| id | layout | TR | content and figure |
|---|---|---|---|
| D5 | breaker 5 | | |
| T21 | lead | 21 | lead; figure: the TR table drawn as the two-column split screen the TR asks for: left `Changes The Outcome` (Decision-changing) with an icon for each factor (Pricing Model, Region Footprint, Service Maturity, Team Skills), right `Just A Different Label` (Cosmetic Only) with Service Names, Console Menu Layout, Dashboard Arrangement; every table word kept (R13: the table becomes the visual, not a repeat of it) |
| T22 | lead | 22 | lead; figure: four pillars under one `Decision Factors` beam (Pricing, Regions, Maturity, Skills), each pillar with its icon cue and its TR bullet inside; the fifth bullet (`Checked in practice on the AWS Pricing Calculator and the AWS Regions page`) as a strip under the pillars with a calculator and a globe icon |
| T23 | points | 23 | lead; 3 points; figure: three console-style tiles (AWS, Azure, Google Cloud), the identical compute icon in each under three different labels `EC2`, `Virtual Machines`, `Compute Engine`; the tiles flip their labels in turn while the icon stays the same |
| T23-B | lead | 23 | lead: the TR's closing statement (`A provider choice is settled by pricing fit, region coverage, service maturity and team skill`; `Naming and layout build familiarity, but they are not criteria for choosing a provider`); figure: a filter: Pricing, Regions, Maturity and Skills icons pass through into a `Provider Choice` check, Naming and Layout icons are turned aside into `Familiarity` |

Closing
| id | layout | content |
|---|---|---|
| S-QUIZ | quiz | the closing quiz frame (see question 3) |
| S-TAKEAWAYS | takeaways | the five agenda titles |
| S-NEXT | next | Cloud Security & Shared Responsibility |
| S-THANKS / S-BEST | thanks | Thank You · All the Best |

## Questions for sign-off

1. **The TR's agenda line 4 is garbled**, and the three places that name section 4 disagree: the agenda reads "Cloud
   Providers A provider choice is settled by ... Walkthrough", the section header reads "Cloud Providers Walkthrough",
   the Key Takeaways read "Service Providers Walkthrough". Agenda and takeaways must match (content rule 20).
   **Proposed:** `Cloud Providers Walkthrough` everywhere (the section header's words); the stray sentence is TR 23's
   closing statement and is used there.
2. **TR 18 asks for a screen capture of the EC2 Launch Instance wizard, and TR 19 for a browser recording of Azure and
   GCP**, but the TR has no screenshots. **Proposed:** draw the wizard as a console-style page with the TR's six
   sections (T18) and the three consoles as sketches (T17); TR 19 stays the table. If you can send a real capture of
   the Launch Instance wizard, T18 becomes a `screenshot` frame with rings on the six sections instead.
3. **Quiz placement.** Session 10 put a second quiz at a TR numbering gap; Session 9's round 4 deleted its mid-deck quiz.
   **Proposed:** one quiz, at the close.

## Coverage check (every TR item → slide)

| TR | item | slide(s) |
|---|---|---|
| Recap / Agenda | 5 titles (sub-lines in notes, R5) | S-RECAP, S-AGENDA, D1-D5 |
| 1 | Content; 4 bullets; guidance; notes | T01 |
| 2 | Content; table; guidance (bar chart); notes | T02 / T02-B |
| 3 | Content; 3 bullets; note; guidance; notes / analogy | T03 / T03-AN |
| 5 | Content; 4 bullets; guidance; notes | T05 |
| 6 | Content; 4 bullets; guidance; notes | T06 |
| 7 | Content; 2 bullets; guidance; notes / analogy | T07 / T07-AN |
| 8, 9 | Content; table; guidance; notes | T08, T09 |
| 10 | Content; table; 3 bullets; guidance; notes | T10 / T10-B |
| 11 | Content; table; note; guidance; notes | T11 |
| 13 | Content; 4 bullets; guidance; notes / analogy | T13 / T13-AN |
| 14 | Content; table; guidance; notes | T14 |
| 15 | Content; table; 3 bullets; guidance; notes | T15 / T15-B |
| 16 | Content; 3 bullets; guidance; notes | T16 |
| 17 | Content; 4 bullets; guidance; notes | T17 |
| 18 | Content; 6 bullets; guidance; notes | T18 |
| 19 | Content; 6-row table; guidance; notes | T19 (/ T19-B) |
| 21 | Content; table; guidance; notes | T21 |
| 22 | Content; 5 bullets; guidance; notes | T22 |
| 23 | Content; 3 bullets; closing statement; guidance; notes | T23 / T23-B |
| Key Takeaways / Upcoming | 5 titles / Cloud Security & Shared Responsibility | S-TAKEAWAYS / S-NEXT |

## Narrative and pedagogy

The TR's order is the deck's order. Section 1 names the five providers and what each is chosen for (the room met AWS
in every session so far). Section 2 introduces the idea of a service equivalent with the telecom analogy before any
product table, then walks compute, storage, database and networking, one category per frame. Section 3 splits ML into
the two layers (a ready API, a platform to build your own) with the tailor analogy, then names both layers per
provider and closes on when to pick which. Section 4 performs one task (launch a VM) on the three consoles, AWS first as
the familiar reference. Section 5 turns everything into a filter: what changes cost or capability versus what only
changes the screen, and closes on the TR's own decision statement.

Analogies (3), each two real-time 3D scenes with no text: physician and cardiologist (T03), telecom recharge (T07),
ready-made shirt and tailor (T13). The TR sentence in `notes`.

## Build

I write all text into `deck.json` and a `stubs.tsx` placeholder for every custom figure, then fork builders on private
copies (`deck.mjs dev` on their own ports, never `build`), each owning one custom file: technical figures in files by
section, the three 3D analogies in one file, the console sketches in one. Merge, `build`, `check` 0 FAIL 0 WARN, every
slide screenshot from the built file at step 0, mid-build and held, and read; 3D slides measured at 60 fps.

## As built (2026-11-11)

43 frames (the plan's 41 plus two splits made at build time, both at TR boundaries, every word kept):
- **T01 → T01 + T01-B.** The two-sentence lead pushed the four points past the player bar. T01 is now the first sentence
  with a "what a cloud provider is" figure (`A_T01D`: Servers / Storage / Databases / Networking in the provider's cloud,
  an internet link to a user, a pay-as-you-go meter); T01-B carries the second sentence, the four points and the five
  sized logo tiles.
- **T19 → T19 + T19-B.** Six rows ran behind the player bar: rows 1-3 / 4-6 under the same header (the plan's fallback).
- T03's OCI point is split at its TR clause boundary (", and now ...") into two lines lit together (`at` 2 on both).
- Lead dash pairs became parentheses (TR 6 lead, TR 7 notes); single dashes became colons (TR 3, 7, 13 analogies in notes).

Custom files: `a.tsx` (section 1 + `A_T01D`), `b.tsx` (T06, T07, T10-B, T13), `c.tsx` (T15-B, T16, T21, T22, T23,
T23-B), `d.tsx` (T17 consoles, T18 wizard), `h.tsx` (3D: clinic T03, telecom kiosks T07), `j.tsx` (3D: shirt rack and
tailor T13), `stubs.tsx`.

Engine additions (deck-engine, reach every deck on its next build): `note` on points and table layouts; `ringCol` and
`logo` on tables; points sharing one `at` light together (fixes Session 10's T06 split too, on its next build).

New official assets in `slide-kit/assets/`: `azure/` (Azure Public Service Icons V21), `gcp/` (Google Cloud icons +
logo), AWS SageMaker AI, Rekognition, Comprehend, Polly, Transcribe, RDS, CloudShell, `companies/ibm-cloud.png`,
`ibm.svg`, `oracle.svg`.

## Correction round 1 (2026-11-11, user review)

- Slide 6 (T01): `A_T01D` rebuilt to fill the stage (figH 360): a new single-path cloud with animated server rack,
  storage bay, database stack and network switch; the Internet globe pulses softly (its rotation removed, slide 6 only:
  the user declined a global rule); three consumers; usage meter with coins and a bill.
- Slide 10 (T03): the TR note "Five-provider comparison is covered in the post-session reading material" removed on the
  user's word; figure height 300 → 340 to rebalance.
- Slide 11 (T03-AN): everyday card split into a mint general clinic (new physician) and a rose cardiology room (heart
  sign, ECG, beating heart model) behind a solid wall; concept card: hyperscaler hall beside a separate enterprise room
  (glass office wall, bank model, Oracle database stack, ERP tower), heartbeat monitor and blinking removed, slow light
  sweep and conduit data flow instead.
- Verified: check 0 FAIL 0 WARN; held-frame pixel diff against the previous build: only slides 6, 10, 11 changed.
