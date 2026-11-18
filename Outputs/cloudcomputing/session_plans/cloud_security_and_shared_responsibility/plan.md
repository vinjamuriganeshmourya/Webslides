# Cloud Security & Shared Responsibility · slide-wise plan

STATUS: signed off by the user, 2026-11-11 ("Signed off, build"; Q1 TR 15 screens drawn; Q2 circles on a cloud, the Visual Guidance)

- **Session:** cloud computing session 12, `Outputs/cloudcomputing/cloud_security_and_shared_responsibility/`, built with
  `deck-engine/` (`node deck.mjs build|check ../Outputs/cloudcomputing/cloud_security_and_shared_responsibility`).
  Dev port 5282 (builder forks 5311-5316; 5291-5296 are in use by another session in this checkout).
- **Series match:** Session 11 as built after its correction round 1 (`cloud_provider_comparison`), Session 10 after
  round 1, Session 9 after round 4: `deck.json` + `custom/*.tsx` merged in `custom/index.tsx` (stubs first) + `images/`.
- **Source (content):** `Reference ppt's/12. Cloud Security & Shared Responsibility.pdf` (14 pages), extracted to
  `tr.txt` beside this plan. TR slide N is "TR N", numbered 1-21 with no gaps. The TR carries **one picture**: a stock
  "CIA Triad" triangle on page 2 (it misspells "Availabilty"), and **no screenshots**.
- **Official marks (rule 54), each in the white tile.** From the AWS Architecture Icons package (07/31/2026, already
  downloaded for Session 11) into `slide-kit/assets/aws/`:
  - present: IAM, S3, RDS, EC2, EC2 Auto Scaling, Elastic Load Balancing, CloudWatch, VPC, S3 bucket, EBS volume
  - to add (service): Key Management Service, CloudTrail, AWS WAF, AWS Shield, Amazon GuardDuty, AWS Trusted Advisor,
    AWS Well-Architected Tool, AWS Systems Manager, Amazon Inspector, Amazon Connect, AWS Certificate Manager (TLS)
  - to add (resource): IAM Access Analyzer, IAM MFA Token, IAM Permissions, KMS-encrypted data, Systems Manager Patch
    Manager, Trusted Advisor Security Checklist, VPC Network Access Control List, WAF Rule

## Sessions 9, 10, 11 inputs built in from the first draft (standing corrections 1-16, course R1-R13)

| Earlier review said | Built into Session 12 as |
|---|---|
| Overlapping icons, people and objects; text on borders | Every figure on a fixed grid with measured gaps; equal padding on all four sides of every inner card, inner padding = parent's; no wrapper card round a card pair; check-deck overlap/overflow 0; every slide screenshot read at step 0, mid-build and held |
| Isometric clay analogy rooms, modelled primitive people | All three analogies are **real-time 3D scenes** on `@/engine/three-stage` (one shared renderer, perspective camera, real light and shadow); people are **Character Lab characters** via `castSprite`, each an individual with role clothing (guard cap and uniform, airport security vest, gate agent, pilot) and expressions synced to the action |
| Heads through roofs, people overlapping, purposeless props | Enclosures checked against the people in them (lift car, guard booth, cockpit), one body-width between people, every prop has a job in the TR analogy |
| Soft 3D at 4K | Canvases at real device pixels, re-measured on resize / fullscreen; sprites rendered at their on-screen height |
| Rest beats between loops, frozen visuals | Analogy loops 3-9 s, restart within 0.3 s, seamless, 60 fps in headed Chrome; every technical visual and icon carries a quiet micro-animation after its build |
| Chips, number badges, connector labels, sentences inside visuals | Icon-first visuals, one single-word Title Case tag under each untagged icon (R13); no chips, badges or line labels; analogy cards text-free |
| Static table icons; highlighted table rows | Table icons float (engine `cvx-ticon`); no row highlight; the only column ring is the one TR 13 asks for (`Actual Duty`) |
| Highlights parked on the last item | Sequential orange highlights loop first → last → first; held frames show nothing highlighted |
| A table repeated by the next visual; a visual repeating the previous slide | TR 5's table goes INTO the boundary diagram the TR asks for (one picture, not a table then a picture); no two consecutive slides share a picture (TR 8-10 stacks change state as the TR asks, each a different split) |
| Two-sentence leads + four points overflowing the points layout (Session 11 T01) | Planned up front: every TR slide with a two-sentence lead and four or five bullets is a `lead` layout whose figure holds one card per TR bullet with the bullet text inside (standing correction 14), so nothing is split mid-thought |
| Crooked arrows | Arrows computed from the boxes' constants, straight, heads on their target |
| Red in the TR's visual guidance ("red flag", "circled in red") | Template orange (R4 / content rule 51): one meaning per slide, the highlight |
| A capture cropped | No captures in this TR; if you supply any (question 1), shown whole at their own aspect ratio, identifiers blurred |

## Text policy (binding, same as Sessions 9-11)

1. Kicker = the TR `Heading`, title = the TR `Subheading`, in the TR's own case. The TR `Content` paragraph is the
   `lead`; bullets are points (or the text inside a one-card-per-bullet figure); tables are tables; TR 15's closing
   sentence is the slide's note line.
2. Allowed edits are punctuation, letter case and layout only: an em dash pair becomes parentheses (TR 7 lead, TR 20
   lead), a single em dash becomes a colon (TR 11 lead, TR 1 and TR 4 analogies in notes); no mark ends a line
   (rule 36); figure labels capitalise every word (rule 56); first letter of a line capitalised (R8.4); product names
   keep their own form (`S3`, `RDS`, `KMS`, `TLS`). Double spaces in TR 13 and TR 20 cells collapsed. Every word stays.
3. Too long → split at the TR's sentence or clause boundary into a second frame with the same kicker and title.
4. Speaker Notes → `notes`, verbatim. Visual Guidance → the figure spec. Analogy → its own analogy slide, the TR
   sentence in `notes`.
5. Figure tags use only TR words and product names. No invented numbers, no invented incidents or company names.
6. Recap, agenda and takeaways carry the five titles only (R5); breakers the title only. Sub-lines in `notes`.

## Deck (39 frames)

Opening
| id | layout | content |
|---|---|---|
| S-WELCOME | brand | |
| S-TITLE | title | Cloud Security & Shared Responsibility (R9) |
| S-RECAP | recap | previous: Cloud Provider Comparison; its five titles (Major Cloud Providers, Service Equivalents Across Providers, Machine Learning Service Comparison, Cloud Providers Walkthrough, Choosing a Provider); presenter illustration (R6) |
| S-AGENDA | agenda | Security Goals · Shared Responsibility Model · Responsibility by Service Model · Common Misunderstandings · Defense in Depth |

Section 1 · Security Goals
| id | layout | TR | content and figure |
|---|---|---|---|
| D1 | breaker 1 | | |
| T01 | points | 1 | lead; 3 points; figure (Visual Guidance, see question 2): three overlapping circles `Confidentiality`, `Integrity`, `Availability`, each with its icon (lock, fingerprint/check seal, power), centred on a glossy cloud icon labelled `Shared Infrastructure` with small tenant blocks inside; point N lights circle N, then the three circles breathe in turn, looping |
| T01-AN | analogy | 1 | **housing society**, 3D: a cutaway apartment block at dusk: a resident unlocks her flat door with a key while a stranger's try is refused (locked door); a sealed power meter on the corridor wall, its seal tag intact and the dial turning (tamper-proof meter); the mains flicker off and a backup generator in the yard starts, the lift keeps moving between floors (backup generator) ↔ concept, 3D: a cloud data hall: a vault-door rack that opens only for a badge-holding identity (lock access), a data block with a seal that flashes when a block is altered (detect tampering), two zones where one rack goes dark and the work moves to the other zone without stopping (keep running through failure) |
| T02 | table | 2 | lead; Goal / Cloud Mechanism / Where It Lives (AWS), 3 rows; a goal icon per row; in the third column each named service carries its official mark beside its name (KMS, S3; S3, CloudTrail; RDS, EC2 Auto Scaling, Elastic Load Balancing) (engine addition: icons inside a cell) |
| T03 | points | 3 | lead; 3 points; figure: one cloud outline holding a bucket (S3 bucket mark), a server rack and a key; an orange warning icon points at each in turn as its point lights, a single-word tag under each (`Public Bucket`, `Noisy Neighbour`, `Leaked Credential`: TR words); after the build the bucket's lid lifts and files drift out toward an internet globe, the rack's load bar spikes, the key fans thin lines to several resource icons, each a quiet loop |

Section 2 · Shared Responsibility Model
| id | layout | TR | content and figure |
|---|---|---|---|
| D2 | breaker 2 | | |
| T04 | points | 4 | lead (two sentences on two lines); 3 points; figure: two columns divided by a vertical boundary line, left `Provider` (data-centre building, server rack, hypervisor chip icons), right `Customer` (data, settings gear, user-key icons); point 1 lights the left column, point 2 the right, point 3 slides the boundary line up and down once to show it can move, then it rests; if the lead pushes the points past the player bar, split at the sentence (T04 / T04-B) |
| T04-AN | analogy | 4 | **gated housing society**, 3D: a gated compound with walls and a gate; a guard in uniform and cap at the main gate checks and lifts the barrier for a car; inside, a resident locks his own flat door and turns the dial of his own safe ↔ concept, 3D: a provider data centre with a perimeter fence and a guard at its door (security OF the cloud), inside it the customer's own account space where a customer locks a bucket and a key vault (security IN the cloud) |
| T05 | lead | 5 | lead (three sentences); figure: the T04 boundary diagram again, now with the TR table INSIDE it: left column `Security OF the Cloud` with its four rows (Physical data-centre security and hardware / Global network and host infrastructure / Hypervisor and virtualization layer / Infrastructure-level availability and durability), right column `Security IN the Cloud` with its four (Guest operating-system patching, where applicable / Security-group and firewall rule configuration / Identity and access management (IAM) policies / Customer data encryption and classification), each row an icon + the TR words; rows pair across the line and light top to bottom, then a soft pulse walks the pairs, looping; a small AWS mark at the top of the line (the AWS Shared Responsibility Model page) |
| T05-B | points | 5 | the three TR bullets; figure: a row of service icons (EC2, RDS, S3) each with its own boundary line at a different height (split checked per service); an `ISO 27001` certificate badge laid over the provider half only; an open S3 bucket on the customer half with an orange warning; lit per point |
| T06 | points | 6 | lead (two sentences on two lines); 3 points; figure (Visual Guidance): one large public storage bucket (S3 bucket mark) with its lid open and an orange flag planted beside it, the TR caption as a tag under it (`Customer-Side Gap, Not A Provider Failure`); point 1 opens a port icon and the bucket's lock, point 2 shows a provider SLA card covering only the infrastructure base under the bucket, point 3 a checklist ticking; split at the sentence if the lead overflows |

Section 3 · Responsibility by Service Model
| id | layout | TR | content and figure |
|---|---|---|---|
| D3 | breaker 3 | | |
| T07 | points | 7 | lead; 4 points; figure: four rows (OS Patching, Network Rules, Encryption Keys, Access Setup: each an icon and tag) by three columns IaaS / PaaS / SaaS; each cell a tile shaded customer (blue) or provider (grey); point N fills row N left to right; a legend `Customer` / `Provider` under the grid |
| T08 | points | 8 | lead; 4 points; figure: a layered stack (Hardware, Hypervisor, Guest OS, Runtime, Application, Data & Access) with the provider zone (grey) from the hypervisor down and the customer zone (blue) from the OS up, the EC2 mark beside the stack; each point lights its layer icon in the customer zone (patch, security group shield, EBS key, user key) |
| T09 | points | 9 | lead; 4 points; figure: the same stack with the provider zone rising to cover the Guest OS and Runtime (the zone edge slides up as the slide opens), the RDS mark beside it; point 1 lights the OS and runtime patch icons inside the provider zone, points 2-3 the customer layers, point 4 the RDS mark |
| T10 | points | 10 | lead; 4 points; figure: the same stack with the provider zone covering almost all of it, the customer zone a thin `Data & Access` band at the top, the Amazon Connect mark beside it; lit per point (provider block, data classification, user access with MFA, the Connect mark) |
| T11 | table | 11 | lead; Security Duty / IaaS / PaaS / SaaS, 4 rows; each cell tinted by owner with the same blue (Customer) / grey (Provider) as the stacks, `Shared` cells half and half (engine addition: cell tint); no row highlight |

Section 4 · Common Misunderstandings
| id | layout | TR | content and figure |
|---|---|---|---|
| D4 | breaker 4 | | |
| T12 | points | 12 | lead; 4 points; figure (Visual Guidance, drawn icon-first): a provider building on the left and a customer at a laptop on the right, a straight arrow from each toward the middle where the two arrows stop short of each other at an open gap (an unlocked padlock in the gap); above each side a thought icon (left: a ticked settings gear, right: a ticked shield) carries what each side assumes; tags `Provider`, `Customer`, `Gap`; the gap pulses softly after the build |
| T13 | table | 13 | lead; Misconception / Actual Duty / Resulting Risk, 4 rows; the `Actual Duty` column ringed in orange, as the TR asks (`ringCol`); a row icon per misconception (bucket, database, OS, user-key) |
| T14 | lead | 14 | lead; figure: six step cards left to right, the TR step text inside each (one card per TR item) with an icon (bucket, error, toggle, policy, crawler bug, root cause); step 3 (`S3 Block Public Access is switched off ...`) ringed in orange as the turning point (stays ringed); the cards build in order, then a dot travels the chain, looping; if six cards are too narrow at 16 px, a 3 + 3 snake still reading left to right |
| T15 | points | 15 | lead; 3 points; note line: the TR's closing sentence (`A single tool catching one misconfiguration is not enough; durable protection needs several independent controls across network, identity, data, application and monitoring layers`); figure: the two screens side by side, the Trusted Advisor security checks list and an IAM Access Analyzer finding, each tagged with what it scans for (`Public Buckets`, `Open Security Groups`, `External Access`); the Well-Architected Tool mark under them for point 3 (see question 1); if the note pushes the points past the player bar, the note becomes T15-B's lead with a layered-controls figure |

Section 5 · Defense in Depth
| id | layout | TR | content and figure |
|---|---|---|---|
| D5 | breaker 5 | | |
| T16 | lead | 16 | lead (two sentences); figure: left, five concentric rings like fort walls, `Network`, `Identity`, `Data`, `Application`, `Monitoring` from outside in, a resource at the centre; right, the five TR bullets as five rows (ring-coloured icon + the bullet text), one card per TR item; row N lights with ring N, then the ring highlight loops outside in |
| T16-AN | analogy | 16 | **airport**, 3D: a terminal: a passenger with a bag goes through the entrance security check (an officer at a scanner arch), shows a boarding pass at the gate (a gate agent scans it), the cockpit door stays locked with the pilot inside, CCTV cameras turn slowly across the terminal ↔ concept, 3D: a request packet passes a firewall gate (network), an identity badge check (identity), a locked data vault (data) inside an application block with a shield (application), monitoring cameras over the whole hall; the analogy's checks pair with the concept's layers position for position |
| T17 | lead | 17 | lead (two sentences); figure (Visual Guidance): an incoming request travelling left to right through WAF and Shield (official marks), then Security Groups and NACLs (NACL resource mark), then an IAM check with MFA (IAM and MFA token marks), into the resource; the five TR bullets sit inside their stage cards (WAF bullet, Shield bullet, SG/NACL bullet, IAM bullet, MFA bullet), one card per TR item; a flood of grey dots is stopped at Shield, one malformed request at WAF, a clean request passes all the way, looping |
| T18 | lead | 18 | lead (two sentences); figure (Visual Guidance): a data packet flows through a KMS lock (KMS mark) and a TLS tunnel (Certificate Manager mark) into an application box holding a validation check, a patch icon (Patch Manager mark) and a secure-code icon; the five TR bullets inside their cards (at rest, in transit, input validation, patch management, secure coding), grouped `Data` and `Application` |
| T19 | lead | 19 | lead (two sentences); figure (Visual Guidance): CloudTrail logs feeding GuardDuty, CloudWatch metrics feeding an alarm, both alert arrows pointing to an incident-response icon; the four TR bullets inside their cards (CloudTrail, CloudWatch, GuardDuty, alerts → incident response); log lines scroll in CloudTrail, the metric line rises past a threshold and the alarm rings, looping |
| T20 | table | 20 | lead; Layer / Stops / Protects / AWS Example, 5 rows, a layer icon per row; in the AWS Example column each service carries its official mark beside its name (WAF, Shield, Security Groups; IAM, MFA; KMS, TLS; Systems Manager Patch Manager, Inspector; CloudTrail, CloudWatch, GuardDuty); if five rows run behind the player bar, rows 1-3 / 4-5 under the same header (T20 / T20-B) |
| T21 | points | 21 | lead (two sentences); 3 points; figure (Visual Guidance): the five-ring fort from T16 again, the identity ring lit in orange; point 1 dims one ring while the other four stay lit (independent layers), point 2 tags the outer rings `Prevention` and the monitoring ring `Detection`, point 3 shows a stolen key aimed at the identity ring; split at the sentence if the lead overflows |

Closing
| id | layout | content |
|---|---|---|
| S-QUIZ | quiz | the closing quiz frame only (the TR names no mid-deck quiz; Session 11 answer 3) |
| S-TAKEAWAYS | takeaways | the five agenda titles |
| S-NEXT | next | IAM Fundamentals |
| S-THANKS / S-BEST | thanks | Thank You · All the Best |

## Questions for sign-off

1. **TR 15 asks for the Trusted Advisor security checks screen and an IAM Access Analyzer finding**, but the TR has no
   screenshots. **Proposed:** draw both as clean console-style screens (as Session 11's T17/T18 were drawn), each with
   the TR's scan target as a tag. If you can send real captures (or sign in to the AWS console in Chrome for me),
   T15's figure shows them whole, identifiers blurred, rings only on what the TR names.
2. **TR 1's picture and its Visual Guidance disagree.** The page carries a stock triangle (green, numbered 01-03, with
   "Availabilty" misspelt); the Visual Guidance asks for three overlapping circles centred on a cloud icon.
   **Proposed:** the Visual Guidance (circles on a cloud), drawn in the deck's style, spelling correct.

## Coverage check (every TR item → slide)

| TR | item | slide(s) |
|---|---|---|
| Recap / Agenda | 5 titles (sub-lines in notes, R5) | S-RECAP, S-AGENDA, D1-D5 |
| 1 | Content; 3 bullets; analogy; guidance; notes | T01 / T01-AN |
| 2 | Content; table; guidance; notes | T02 |
| 3 | Content; 3 bullets; guidance; notes | T03 |
| 4 | Content; 3 bullets; analogy; guidance; notes | T04 / T04-AN |
| 5 | Content; table; 3 bullets; guidance; notes | T05 / T05-B |
| 6 | Content; 3 bullets; guidance; notes | T06 |
| 7 | Content; 4 bullets; guidance; notes | T07 |
| 8, 9, 10 | Content; 4 bullets each; guidance; notes | T08, T09, T10 |
| 11 | Content; table; guidance; notes | T11 |
| 12 | Content; 4 bullets; guidance; notes | T12 |
| 13 | Content; table; guidance (column highlight); notes | T13 |
| 14 | Content; 6 steps; guidance (step 3 ringed); notes | T14 |
| 15 | Content; 3 bullets; closing sentence; guidance; notes | T15 |
| 16 | Content; 5 bullets; analogy; guidance; notes | T16 / T16-AN |
| 17, 18, 19 | Content; 5 / 5 / 4 bullets; guidance; notes | T17, T18, T19 |
| 20 | Content; 5-row table; guidance; notes | T20 (/ T20-B) |
| 21 | Content; 3 bullets; guidance; notes | T21 |
| Key Takeaways / Upcoming | 5 titles / IAM Fundamentals | S-TAKEAWAYS / S-NEXT |

## Narrative and pedagogy

The TR's order is the deck's order. Section 1 restates the CIA goals for shared hardware (the housing society makes
the three goals physical before the AWS table names where each lives), then shows why sharing raises the stakes.
Section 2 draws one line between provider and customer (the gated society makes "of" and "in" concrete) and fills the
line with the TR's table, then shows what happens when the customer's half is ignored. Section 3 moves the same line
duty by duty and model by model (the stack changes state across three frames, then one table summarises). Section 4
turns the line into failure stories: the two directions of a wrong assumption, the four misconceptions, one bucket
incident step by step, and the tools that catch it. Section 5 stacks independent controls (the airport makes "passing
one check does not get you everywhere" physical), walks the five layers with their AWS services, maps them in one
table and closes on identity as the bridge to the next topic.

Analogies (3), each two real-time 3D scenes with no text: housing society (T01), gated society (T04), airport (T16).

## Build

All text into `deck.json` (generated once from `tr.txt` by a scratchpad script, then `deck.json` is the source) and a
`stubs.tsx` placeholder for every custom figure; then forked builders on private copies (`deck.mjs dev` on their own
ports, never `build`), each owning one custom file: section 1-2 figures, section 3-4 figures, section 5 figures, the
three 3D analogies split over two files. Engine additions (icons inside a table cell, owner tint on a table cell) made
once in `deck-engine` with a row in `RULES-REGISTER.md`. Merge, `build`, `check` 0 FAIL 0 WARN, every slide
screenshotted from the built file at step 0, mid-build and held, and read; 3D slides measured at 60 fps.

## As built (2026-11-11)

39 frames, as planned, with no split needed. `node deck.mjs check`: 0 FAIL, 0 WARN. Every slide was screenshotted
from the built file and read, both the held frame and a live frame.
- **Fit pass, made before the figures were drawn:** multi-sentence leads flow as one paragraph. Two lines of lead cost
  an extra line and pushed the lead-layout stages into the player bar. Lead-layout figures are figH 320. To keep every
  point within two lines, pointsW is 540 on T06, T09, T10; 600 on T21; 630 on T07, T12. T15's figH is 250, so its note
  clears the bar.
- **Changes from the plan:**
  - The T03 and T06 bucket is the official S3 bucket mark with files drifting out, not a drawn lid (rule 54).
  - T18 has rows instead of narrow cards, so every bullet takes two lines at most.
  - T21's `Identity` legend word is ink: orange only on the ring (rule 55).
  - T16-AN's terminal is re-laid as three separate stations, so no two people overlap.
- **Custom files:**
  - `a.tsx`: T01, T03, T04, T05, T05-B, T06.
  - `b.tsx` and `b-boy-laptop.png`: T07, the T08-T10 stack, T12, T14, T15.
  - `c.tsx`: T16-T19, T21.
  - `h.tsx`: 3D housing society, T01-AN.
  - `j.tsx`: 3D gated society, T04-AN.
  - `i.tsx`: 3D airport, T16-AN.
  - Builders measured all three 3D scenes at 60 fps headless with the Vulkan flags. They have not been measured in
    headed Chrome.
- **Engine addition:** a table cell can be `{text, icons, tone}` (FIG-37), used on T02, T11 and T20.

## Review round, 2026-11-13 (the user's list, original numbering)

- Before slide 22 (D4): a mid-deck quiz frame, `S-QUIZ-1`, the same `quiz` layout as the closing one. The frame carries
  no questions; eight questions on sections 1 to 3 are in its presenter notes. This overrides the S-QUIZ row above
  ("no mid-deck quiz").
- Slide 24 (T13): the orange ring on the `Actual Duty` column is removed (`ringCol` dropped); every row and column is
  styled alike. This overrides the T13 row and line 31 above.
- Slide 30 (T17): the lane reads Internet, Shield, WAF, SG / NACL, IAM, MFA; the third card's title is `SG / NACL`;
  the loop stops the flood at Shield first, then the malformed request at WAF.
- Feedback: `S-FEEDBACK` after the takeaways, the feedback title card (the engine's `FeedbackCard`, registered in
  `custom/index.tsx`), chosen by the user for this session. Closing run: Quiz, Takeaways, Feedback, Next Session,
  Thank You, All the Best. 41 slides.
