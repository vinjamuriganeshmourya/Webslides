# Elastic Compute Instances · slide-wise plan

STATUS: signed off by the user, 2026-11-10 ("Signed off, build"; R5 and the dash rule applied and flagged)

- **Session:** cloud computing session 9, `Outputs/cloudcomputing/elastic_compute_instances/`, built with
  `deck-engine/` (`node deck.mjs build|check ../Outputs/cloudcomputing/elastic_compute_instances`). Dev port 5279.
- **Series match:** same structure, layouts, lab frames (`L_Shot`, `L_Steps`), analogy rooms, motion tokens and file
  organisation as Session 6 (`load_balancing_and_cdn`) and Session 7 (`block_file_and_object_storage`):
  `deck.json` + `custom/{a,b,c,e,f,g}.tsx` merged in `custom/index.tsx` + `images/` + `captures/`.
- **Source (content):** `Reference ppt's/9. Elastic Compute Instances.pdf` (22 pages), extracted to `tr.txt` beside
  this plan. TR slide N is "TR N" below. The TR numbering skips 10, 17 and 23; no text is missing. The mid-deck quiz
  takes the TR 10 gap (as Session 7 placed its quiz after section 2).
- **TR pictures (4, not screenshots):** TR 1 (monitor + server rack illustration, no text), TR 5 (family tiles:
  Standard or General Instances T2 M4, High CPU Instances C5 C4 C3, High Memory Instances X1 R4 R3, Instances with
  GPU F1 P2 G2), TR 19 (AMI lifecycle: create, EBS snapshot (or template if instance store backed), Register, AMI #1,
  Launch, Instance, Copy, AMI #2, Deregister), TR 24 (Auto-Scaling: Application Clients (end users), Internet, Load
  balancer, Scale up, Scale out, Servers, Replicated Servers Available if needed, Data center). They are redrawn in
  the deck's style with every label they carry, so their words are on the slides too.
- **Screenshots (5):** TR 28 instances list, TR 29 terminal, TR 30 editor folder, TR 31 Beanstalk environment,
  TR 32 Version 2 page. Extracted unchanged to `captures/`, served from a 2x Lanczos + light unsharp copy in
  `images/` (course R4) with identifiers blurred in the PNG (rule 53: instance ID, private IP host names, environment
  ID, environment domain / URL hash). Originals also in `Outputs/cloudcomputing/workflow/captures/session9-originals-2026-11-10/`.
- **Official marks (rule 54):** EC2, EC2 Instance, AMI, Auto Scaling, Elastic Beanstalk, EBS Volume, Key Pair /
  Compute Optimizer / CloudWatch where drawn, from the AWS package in `slide-kit/assets/aws/`; Linux / Python /
  NVIDIA only if the package or `slide-kit/assets/tech/` has them, otherwise a neutral glyph (flagged).

## Text policy (binding, same as Sessions 6 and 7)

1. Kicker = the TR `Heading`, title = the TR `Subheading`. The TR `Content` paragraph is the `lead` (one sentence
   per line); bullets are points / steps; tables are tables; captions are the screenshot explanation boxes.
2. Allowed edits are punctuation, letter case and layout only, under the standing rules: ` — ` becomes `: `
   (content rule 1, no em dash); no mark ends a line (rule 36); chips, tags and figure labels capitalise every word
   (rule 56); first letter of a line capitalised (R8.4). Every word stays.
3. Too long → split at the TR's sentence or clause boundary; a slide with too much becomes two frames with the same
   kicker and title.
4. Speaker Notes → `notes`, verbatim. Visual Guidance → the figure spec (its labels drawn). Analogy → its own analogy
   slide (R3: kicker, title, two scenes, few numbered tags pairing each real-life part with its technical term); the
   full TR analogy sentence in `notes`.
5. Figure labels use only TR words (this slide, its guidance, its notes, the TR pictures, the lab captures). No
   invented numbers, prices or addresses.
6. Recap, agenda and takeaways carry the five titles only (course R5, which holds "even when a request says use the
   text verbatim"); section breakers carry the title only (lesson 4). The sub-lines go in the recap, agenda and
   takeaways frames' `notes`, verbatim. Flagged in the report.
7. Typo fixes, flagged: TR 2 Visual Guidance "RRequest" drawn as "Request".

## Deck (66 frames)

Opening
| id | layout | content |
|---|---|---|
| S-WELCOME | brand | |
| S-TITLE | title | Elastic Compute Instances (R9) |
| S-RECAP | recap | previous: Storage Tiering, Backup & DR; its five titles |
| S-AGENDA | agenda | the five titles |

Section 1 · Compute in the Cloud
| id | layout | TR | content and figure |
|---|---|---|---|
| D1 | breaker 1 | | |
| T01 | points | 1 | lead: the two Content sentences; 4 points; figure: a physical host box (server rack, TR 1 picture) with a Hypervisor layer, VMs on it, one highlighted VM labelled Instance carrying vCPU, Memory, Network, Storage icons; lit per point: the bundle, an `Instance ID` tag, the four lifecycle state chips Pending → Running → Stopped → Terminated, the isolated boundary around one workload |
| T01-AN | analogy | 1 | home on the utility grid: power lines into a house, a meter that turns only while an appliance is switched on ↔ EC2 instance drawing compute capacity on demand, its billing meter running only while the instance is Running. Tags: Utility Grid ↔ Compute Capacity, Used On Demand, Billed Only For The Time It Is Consumed ↔ Charges Only While It Is Running |
| T02 | lead | 2 | lead: the Content sentence; figure: left-to-right flow Request → Scheduler → Hypervisor Boot → Running → Status Check, arrows between each stage, a request dot riding it once |
| T02-B | points | 2 | 5 points; figure: the same flow, each stage lit with its point (request names image / instance type / network settings, scheduler picks a host with free capacity, boot from the image, running then status checks), and the EC2 console + `RunInstances` API as the trigger for point 5 |
| T03 | points | 3 | lead; 4 points; figure: an EC2 console Launch Instance button mockup beside the lifecycle bar Pending → Running → Stopped → Terminated; a billing meter starting at Running, capacity returning to the shared pool at Terminated, Stopped with compute off and storage still billed, provisioning with no fee |
| T04 | table | 4 | lead; Workload / Instance / vCPU / Memory / Why, 2 rows |
| T04-B | lead | 4 | lead: the t3 / c5 sentence; figure: side-by-side cards t3.micro labelled Web App and c5.large labelled Batch Job, each with its vCPU and memory values; a burst-and-credits line on t3, a flat full line on c5 |

Section 2 · Instance Families
| id | layout | TR | content and figure |
|---|---|---|---|
| D2 | breaker 2 | | |
| T05 | points | 5 | lead; 5 points; figure: five labelled boxes in a row General Purpose, Compute, Memory, Storage, GPU/Accelerator, each with its icon (scale, chip, RAM stick, disk, GPU), lit per point |
| T05-B | lead | 5 | figure only: the TR picture redrawn: four columns Standard Or General Instances (T2, M4), High CPU Instances (C5, C4, C3), High Memory Instances (X1, R4, R3), Instances With GPU (F1, P2, G2) as chip tiles |
| T06 | points | 6 | lead; 2 points; figure: a balance scale, vCPU on one pan and Memory on the other, level, labelled M & T Families (react-spring settle) |
| T06-AN | analogy | 6 | family sedan on an everyday trip, parked between a sports car (the fastest) and a big-boot van (the biggest boot) ↔ general-purpose instance between the CPU-maximised and memory-maximised extremes. Tags: Family Sedan ↔ General-Purpose Instance, Balanced For Most Everyday Trips ↔ Balances CPU And Memory |
| T07 | points | 7 | lead; 4 points; figure: the same scale, tilted heavily toward the vCPU side, labelled C-Family |
| T08 | table | 8 | lead; Family / Optimized For / AWS Example / Typical Workload, 2 rows |
| T09 | points | 9 | lead; 3 points (the AWS examples bullet split at its list boundary into two lines, both lit at step 2: it took four lines); figure: a CPU chip icon next to a larger GPU chip made of many small grid cells, labelled P, G, Trn and Inf families; the TR note "Refer to the reading material for instance family selection" in a note box under the figure |
| T09-AN | analogy | 9 | exam hall: many invigilators at the desks checking answer sheets at once, and one teacher at a front desk checking a stack one by one ↔ a GPU's many cores each processing a block of data at once, and a CPU working through the blocks one by one. Tags: Hundreds Of Invigilators At Once ↔ Thousands Of GPU Cores In Parallel, One Teacher One By One ↔ CPU Working Sequentially |
| S-QUIZ1 | quiz | (10) | mid-deck quiz frame |

Section 3 · Sizing & Selection
| id | layout | TR | content and figure |
|---|---|---|---|
| D3 | breaker 3 | | |
| T11 | points | 11 | lead; 4 points; figure: four-quadrant diagram, vCPU, Memory, Network, Storage around a central instance box (EC2 instance mark), one quadrant lit per point |
| T12 | points | 12 | lead; 4 points; figure: bar chart comparing vCPU count and memory size for two instance sizes side by side: m6i.xlarge (4 vCPU, 16 GiB, TR 12) and c5.large (2 vCPU, 4 GB, TR 4), plus a T-family credit meter for point 4 |
| T12-AN | analogy | 12 | a shop counter: workers serving at a counter, a short counter crowded when workers are added, a longer counter where more workers have room ↔ vCPUs and memory on an instance. Tags: One Worker At A Counter ↔ vCPU, Counter Space ↔ Memory, More Workers Need More Counter Space ↔ More vCPUs Need More Memory |
| T13 | points | 13 | lead; 4 points; figure: instance box with two labelled arrows: Network Bandwidth (Gbps) to the internet, EBS Throughput (MB/s) to a disk (EBS volume mark), a burst bump on the network arrow, an IOPS counter on the disk |
| T14 | points | 14 | lead; 4 points; figure: a gauge with three zones Under-Provisioned, Right-Sized, Over-Provisioned, its needle settling (react-spring) into Right-Sized; Compute Optimizer reading CloudWatch metrics; stop → change type → restart loop for point 4 |
| T15 | points | 15 | lead; 4 points; figure: two GPU cards, g5.xlarge NVIDIA A10G 24 GB VRAM and g4dn.xlarge NVIDIA T4 16 GB VRAM, a model-size bar that fits the first and overflows the second (Out Of Memory) |
| T15-AN | analogy | 15 | a carpentry workshop: a strong worker at a fixed-size workbench, a job (a long table top) bigger than the bench hanging off it ↔ a fast GPU whose VRAM is smaller than the model, which cannot load. Tags: Workbench Of Fixed Size ↔ VRAM, Job Bigger Than The Bench ↔ Model Exceeding VRAM, However Strong The Worker ↔ Regardless Of GPU Speed |
| T16 | table | 16 | lead; Workload / Need / Instance Chosen / Why, 2 rows |
| T16-B | lead | 16 | figure only: two cards side by side: m6i.xlarge specs for the Web Application (4 vCPU, 16 GiB, Moderate Network) ticked; the inference job: g4dn.xlarge 16 GB VRAM crossed (insufficient), g5.xlarge 24 GB VRAM ticked for the 18 GB model |

Section 4 · Images & Provisioning
| id | layout | TR | content and figure |
|---|---|---|---|
| D4 | breaker 4 | | |
| T18 | points | 18 | lead; 4 points; figure: three labelled boxes Machine Image, User Data, Key Pair feeding one Instance Launch box |
| T19 | lead | 19 | lead: the three Content sentences; figure: one AMI box branching into identical instance boxes, each labelled Same OS, Same Software |
| T19-B | lead | 19 | figure only: the TR picture redrawn: Create → EBS Snapshot (Or Template If Instance Store Backed) → Register → AMI #1 → Launch → Instance, AMI #1 → Copy → AMI #2, AMI #1 → Deregister |
| T19-C | points | 19 | 4 points; figure: Provider, Custom, Marketplace image sources into the AMI, the AMI tied to one region and copied to a second region |
| T19-AN | analogy | 19 | a kitchen: a recipe card on the counter with every ingredient pre-measured in bowls, the same dish turned out identical each time ↔ one AMI and the identical instances launched from it. Tags: Recipe Card ↔ Machine Image, Every Ingredient Pre-Measured ↔ OS And Software, Nothing Improvised ↔ Exact Same State |
| T20 | points | 20 | lead; 3 points; figure: timeline Launch → First Boot → User Data Script Runs → Application Ready; a greyed second Reboot box with Script Skipped |
| T21 | points | 21 | lead; 4 points; figure: two padlocks, Public Key on the instance, Private Key on the user's laptop (boy with laptop, rule 58), a matching arrow between them; a crossed password field; a lost key |
| T21-AN | analogy | 21 | a locker room: a renter with the only key opening a locker, the facility desk holding only the lock pattern card, no copy of the key ↔ the instance holding the public key, the owner's laptop holding the private key. Tags: Locker Lock ↔ Public Key, Renter's Key ↔ Private Key, Only The Lock Pattern ↔ Instance Holds Only The Public Key |
| T22 | table | 22 | lead; Step / Input Used / Determines, 4 rows |
| T22-B | lead | 22 | figure only: flow arrow left to right across the four rows (Choose Template, Attach Credential, Supply Script) ending in a green Instance Ready box |

Section 5 · Scaling
| id | layout | TR | content and figure |
|---|---|---|---|
| D5 | breaker 5 | | |
| T24 | lead | 24 | lead; figure: the TR picture redrawn: Application Clients (End Users) → Internet → Load Balancer → Scale Up / Scale Out → Servers, Replicated Servers Available If Needed, inside the Data Center |
| T24-B | points | 24 | 4 points; figure: ASG box pulling from a Launch Template, spawning instances between Min and Max markers, a scaling policy arrow, a health-check loop replacing an unhealthy instance, two Availability Zones |
| T25 | lead | 25 | lead: the two Content sentences; figure: a launch template box (AMI, instance type, key pair, security group) with version tags v1, v2, v3 and an arrow from the default version into a newly launched instance |
| T25-B | points | 25 | 4 points; figure: the version stack, the ASG pointer moving between Default, Latest and a fixed number, rolling back to a prior version, the older Launch Configuration greyed |
| T25-AN | analogy | 25 | a housing site: a builder with the standard house plan, a row of houses with the same layout and door locks ↔ a launch template and identical instances (same AMI, instance type, security group). Tags: Standard House Plan ↔ Launch Template, Same Layout ↔ Same AMI And Instance Type, Same Door Locks ↔ Same Security Group |
| T26 | points | 26 | lead; 4 points; figure: horizontal bar from Min to Max capacity with a Desired marker sliding inside it; grace-period and cooldown timers; new capacity billed while it runs |
| T26-B | table | 26 | Policy Type / Trigger / Example, 3 rows, each row with its small icon (target, stairs, calendar) |

Practical · Launching an EC2 Instance and Deploying a Flask App on Elastic Beanstalk
| id | layout | TR | content and figure |
|---|---|---|---|
| D-LAB | breaker lab | | Practical Hands-On · Launching an EC2 Instance and Deploying a Flask App on Elastic Beanstalk |
| P01 | lead | 27 | lead (two lines at the clause boundary); figure: the two builds: an EC2 instance we manage, and Elastic Beanstalk managing its own instances, auto scaling group and launch template |
| P01-B | custom `L_Steps` | 27 | the 7 numbered steps as the zig-zag timeline |
| P02 | custom `L_Shot` | 28 | lead; instances list capture + caption "s9-ec2-vm-demo in Running state with 3/3 status checks passed"; rings on Instance State and Status Check |
| P02-B | points | 28 | 3 points; figure: AMI Amazon Linux 2023 → t3.micro instance, key pair s9-ec2-key, security group s9-ec2-sg letting SSH (Port 22) in from My IP only |
| P03 | custom `L_Shot` | 29 | lead; terminal capture + caption |
| P04 | custom `L_Shot` | 30 | lead; editor folder capture + caption |
| P05 | custom `L_Shot` | 31 | lead (two sentences); Beanstalk environment capture + caption "S9-paas-demo-env with Health Ok"; rings on Health Ok and the success banner |
| P06 | custom `L_Shot` | 32 | lead; Version 2 page capture + caption |
| P06-B | custom `L_Steps` | 32 | the 3 bullets (verify, clean up, then delete) as a timeline |

Closing
| id | layout | content |
|---|---|---|
| S-QUIZ | quiz | the last quiz frame |
| S-TAKEAWAYS | takeaways | five titles |
| S-NEXT | next | Serverless Computing |
| S-THANKS / S-BEST | thanks | Thank You · All the Best |

## Coverage check (every TR item → slide)

| TR | item | slide(s) |
|---|---|---|
| Recap | 5 titles (sub-lines in source, R5) | S-RECAP |
| Agenda | 5 titles | S-AGENDA, D1-D5 |
| 1 | Content; 4 bullets; picture; guidance; notes | T01 |
| 1 | Analogy (utility grid) | T01-AN |
| 2 | Content; guidance | T02 |
| 2 | 5 bullets; notes | T02-B (notes on both) |
| 3 | Content; 4 bullets; guidance; notes | T03 |
| 4 | Content; table; notes | T04 |
| 4 | t3 / c5 sentence; guidance | T04-B |
| 5 | Content; 5 bullets; guidance; notes | T05 |
| 5 | TR picture (family tiles) | T05-B |
| 6 | Content; 2 bullets; guidance; notes | T06 |
| 6 | Analogy (family sedan) | T06-AN |
| 7 | Content; 4 bullets; guidance; notes | T07 |
| 8 | Content; table; notes | T08 |
| 9 | Content; 3 bullets; Note; guidance; notes | T09 |
| 9 | Analogy (exam hall) | T09-AN |
| 11 | Content; 4 bullets; guidance; notes | T11 |
| 12 | Content; 4 bullets; guidance; notes | T12 |
| 12 | Analogy (workers at a counter) | T12-AN |
| 13 | Content; 4 bullets; guidance; notes | T13 |
| 14 | Content; 4 bullets; guidance; notes | T14 |
| 15 | Content; 4 bullets; guidance; notes | T15 |
| 15 | Analogy (workbench) | T15-AN |
| 16 | Content; table; notes | T16 |
| 16 | guidance (two cards) | T16-B |
| 18 | Content; 4 bullets; guidance; notes | T18 |
| 19 | Content; guidance | T19 |
| 19 | TR picture (AMI lifecycle) | T19-B |
| 19 | 4 bullets; notes | T19-C |
| 19 | Analogy (recipe card) | T19-AN |
| 20 | Content; 3 bullets; guidance; notes | T20 |
| 21 | Content; 4 bullets; guidance; notes | T21 |
| 21 | Analogy (locker) | T21-AN |
| 22 | Content; table; notes | T22 |
| 22 | guidance (flow to Instance Ready) | T22-B |
| 24 | Content; TR picture (Auto-Scaling) | T24 |
| 24 | 4 bullets; guidance; notes | T24-B |
| 25 | Content; guidance | T25 |
| 25 | 4 bullets; notes | T25-B |
| 25 | Analogy (house plan) | T25-AN |
| 26 | Content; 4 bullets; guidance | T26 |
| 26 | table; notes | T26-B |
| 27 | Content | P01 |
| 27 | 7 numbered steps | P01-B |
| 28 | Content; capture + caption | P02 |
| 28 | 3 bullets | P02-B |
| 29 | Content; capture + caption | P03 |
| 30 | Content; capture + caption | P04 |
| 31 | Content (two sentences); capture + caption | P05 |
| 32 | Content; capture + caption | P06 |
| 32 | 3 bullets | P06-B |
| Key Takeaways | 5 titles | S-TAKEAWAYS |
| Upcoming Session | Serverless Computing | S-NEXT |
| Closing | Thank You · All the Best | S-THANKS, S-BEST |

## Narrative and pedagogy

The TR's order is the deck's order. Section 1 defines the unit (the instance) and how one comes to exist
(provisioning, billing from Running), and closes on two workloads that need different instances: the need that
section 2's families answer. Section 2 maps the families, then takes each resource balance in turn on the same scale
picture (level → tilted) and ends on GPUs, whose memory limit is held for section 3. Section 3 names the four sizing
axes, takes vCPU / memory and network / storage, then right-sizing, then VRAM as the hard ceiling, and closes on the
worked case that uses every term already introduced. Section 4 names the three launch inputs, takes each, and
chains them into the launch sequence, which section 5's ASG and launch template repeat automatically. The practical
uses only names the theory introduced (AMI, instance type, key pair, security group, ASG, launch template).

Analogies (8): each is a furnished isometric room or place in Session 7's analogy style (one camera, Character Lab
3D people, real props, the AWS marks on white tiles on the concept side), with numbered tag pairs (real-life part ↔
technical term) and one-shot step motion on the shared `MOTION` tokens; the TR sentence in `notes`.

## Build

Parallel builders on private copies (Session 7's method: `deck.mjs dev` on own ports, never `build`), merged by
slide id: A sections 1-2 figures, B sections 3-5 figures, F the eight analogy pairs (split over two workers), E the
practical (captures, blur, `L_Shot` / `L_Steps` copied from Session 7). Then `build`, `check` 0 FAIL, every slide
screenshot (reload per slide) and read.

## As built (2026-11-10)

66 frames as planned. `custom/a.tsx` (sections 1-2), `b.tsx` (section 3), `c.tsx` (sections 4-5 + P01, P02-B),
`e.tsx` (lab frames copied from Session 7), `f.tsx` (analogies T01, T06, T09, T12), `g.tsx` (T15, T19, T21, T25),
`stubs.tsx` (placeholders, all overridden). `node deck.mjs check` 0 FAIL, 1 WARN (the TR's "=" in the chip
"Usually 2 vCPU = 1 Physical Core" on T11). deck.json is the source now (the scratchpad generator is gone).

## Round 4 (user, 2026-11-10): 64 slides

Original 22 (S-QUIZ1) and 32 (T16-B) deleted last; T16 is now a lead slide with the old slide 32 visual under its
text; slide 9 shows a presenter (Z_T02BPointer) instead of the duplicate stage list; slide 15 has a fifth card (Storage
Optimized I3, D2, H1) and "GPU & Accelerator"; slide 20's reading-material note removed; analogies 21, 25, 29, 39
replaced with the user's toll plaza, study table, suitcase and lock-and-key sentences (in the notes, verbatim); slide
43 (T24) redrawn Template → ASG → Instances with the Load Balancer in front; slide 51 (P01) two parallel flows; D-LAB
retitled "EC2 Launch and Flask Deployment on Beanstalk"; every screenshot served uncropped (P05 keeps only the TR's
Health Ok ring); one-word tags under untagged icons and looping orange highlights deck-wide (standing correction 16).
