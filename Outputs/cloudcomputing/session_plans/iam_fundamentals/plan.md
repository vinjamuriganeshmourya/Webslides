# IAM Fundamentals · slide-wise plan

STATUS: signed off by the user, 2026-11-13 (answers to the four sign-off questions: Q1 consoles drawn; Q2 closing quiz only, no mid-deck quiz, no feedback card; Q3 all seven analogies; Q4 `e.g.` kept verbatim)

- **Session:** cloud computing session 13, deck project at
  `/home/nxtwave/Desktop/webslides/Outputdecks/cloudcomputing/iam_fundamentals/` (placement rule of 2026-11-13: the
  whole project outside the repo; this plan stays here). Built with `deck-engine/`
  (`node deck.mjs build|check|perf /home/nxtwave/Desktop/webslides/Outputdecks/cloudcomputing/iam_fundamentals`).
  Dev port 5283 (builder forks 5321-5327). Added to `Outputdecks/cloudcomputing/course.json` when built.
- **Series match:** Session 12 as built and reviewed (`cloud_security_and_shared_responsibility`), Sessions 9-11 after
  their correction rounds: `deck.json` + `custom/*.tsx` merged in `custom/index.tsx` (stubs first) + `images/`.
- **Source (content):** `Reference ppt's/13. IAM_Fundamentals.pdf` (17 pages), extracted to `tr.txt` beside this plan.
  TR slide N is "TR N", numbered 1-24 with no gaps. The TR carries **no pictures and no screenshots**; three slides ask
  for console screens (TR 4, 9, 22, see question 1).
- **Official marks (rule 54), each in the white tile.** In `slide-kit/assets/aws/` already: IAM, IAM Role, IAM MFA
  Token, IAM Permissions, IAM Access Analyzer, CloudTrail, CloudTrail logs (CloudWatch Logs resource), S3, S3 bucket,
  S3 object, Users, Client. To add from the official AWS Architecture Icons package (re-downloaded; the old copy is
  gone): IAM Long-Term Security Credential, IAM Temporary Security Credential, IAM Data Encryption Key if needed, and
  the AWS Security Token Service mark if the package carries one (else STS is shown by the Temporary Security
  Credential resource mark, which is AWS's own icon for it).

## Sessions 9-12 inputs built in from the first draft (standing corrections 1-16, course R1-R13)

| Earlier review said | Built into Session 13 as |
|---|---|
| Overlapping icons, people and objects; text on borders | Every figure on a fixed grid with measured gaps; equal padding on all four sides of every inner card, inner padding = parent's; no wrapper card round a card pair; check-deck overlap/overflow 0; every slide screenshot read at step 0, mid-build and held |
| Isometric clay analogy rooms, modelled primitive people | All seven analogies are **real-time 3D scenes** on `@/engine/three-stage` (one shared renderer, perspective camera, real light and shadow); people are **Character Lab characters** via the engine's `castSprite` (never a copied sprite), each an individual with role clothing (office owner in a blazer, invigilator, society guard in cap and uniform, ticket examiner, office guard with a clipboard, shopkeeper) and expressions synced to the action |
| Heads through roofs, people overlapping, purposeless props | Enclosures checked against the people in them (guard booth, lift car, train coach, ticket counter), one body-width between people, every prop has a job in the TR analogy |
| Soft 3D at 4K; low-end PCs | Canvases at real device pixels (`adaptive` sprites, re-measured on resize / fullscreen); loops on the compositor only (`transform` / `opacity` on an HTML element or root svg); `node deck.mjs perf` with no FAIL |
| Rest beats between loops, frozen visuals | Analogy loops 3-9 s, restart within 0.3 s, seamless, 60 fps; every technical visual and icon carries a quiet micro-animation after its build |
| Chips, number badges, connector labels, sentences inside visuals | Icon-first visuals, one single-word Title Case tag under each untagged icon (R13); no chips, badges or line labels; analogy cards text-free |
| Static table icons; highlighted table rows | Table icons float (engine `cvx-ticon`); no row highlight, no column ring (the TR asks for none) |
| Highlights parked on the last item | Sequential orange highlights loop first → last → first; held frames show nothing highlighted |
| A table repeated by the next visual; a visual repeating the previous slide | No two consecutive slides share a picture: where the TR says "carried over" (TR 11, TR 14) the picture changes state (a different part lit, a smaller copy beside a table) rather than repeating |
| Two-sentence leads + four points overflowing the points layout (Session 11 T01) | Planned up front: a TR slide with a two-sentence lead and four or five bullets is a `lead` layout whose figure holds one row per TR bullet with the bullet text inside (TR 1, 6, 7, 13); overfull TR slides are split at the TR's own boundaries (TR 4, 10, 11, 18, 23) |
| Crooked arrows | Arrows computed from the boxes' constants, straight, heads on their target |
| Red in the TR's visual guidance (TR 15 "colour the deny branch red", TR 19 "a red deny slice") | Template orange (R4 / content rule 51): one meaning per slide, the deny |
| TR 21 "underlined in three colours" | Content rule 49 (no underlines) and rule 55 (blue is the only text highlight) win: Principal, Action and Resource each sit in a soft blue box with a one-word Title Case tag under it, lit one after another |
| A capture cropped | No captures in this TR; if you supply any (question 1), shown whole at their own aspect ratio, identifiers blurred, rings only on what the TR names |

## Text policy (binding, same as Sessions 9-12)

1. Kicker = the TR `Heading`, title = the TR `Subheading`, in the TR's own case. The TR `Content` paragraph is the
   `lead`; bullets are points (or the text inside a one-row-per-bullet figure); tables are tables; a TR closing
   sentence under a table or list is the slide's `note` line.
2. Allowed edits are punctuation, letter case and layout only: a single em dash becomes a colon (TR 13, TR 20 leads;
   the analogies in notes); `e.g.` (TR 11, 13, 14) is kept verbatim on the user's word (Q4, 2026-11-13), overriding
   the Latin-abbreviation rule for this deck only; no mark ends a line (rule 36); figure labels capitalise every word (rule 56);
   first letter of a line capitalised (R8.4); product names and code keep their own form (`s3:GetObject`, `ARN`,
   `STS`, `MFA`, `aws:SourceIp`). Stray zero-width marks from the PDF removed. Every word stays.
3. Too long → split at the TR's sentence or clause boundary into a second frame with the same kicker and title.
4. Speaker Notes → `notes`, verbatim. Visual Guidance → the figure spec. Analogy → its own analogy slide, the TR
   sentence in `notes`.
5. Figure tags use only TR words and product names. No invented numbers, no invented incidents or company names; the
   account id `123456789012`, the IPs and the bucket names are the TR's own (AWS documentation values).
6. Recap, agenda and takeaways carry the five titles only (R5); breakers the title only. Sub-lines in `notes`.
7. Code (TR 10 policy JSON) in the engine code pane, ligatures off (rule 40), the TR's indentation, no blank lines
   between keys (the PDF's blank lines are extraction spacing).

## Deck (50 frames)

Opening
| id | layout | content |
|---|---|---|
| S-WELCOME | brand | |
| S-TITLE | title | IAM Fundamentals (R9) |
| S-RECAP | recap | previous: Cloud Security & Shared Responsibility; its five titles (Security Goals, Shared Responsibility Model, Responsibility by Service Model, Common Misunderstandings, Defense in Depth); presenter illustration (R6) |
| S-AGENDA | agenda | Identity in the Cloud · Authentication vs Authorization · Policy Structure · Policy Evaluation Logic · Reading a Denial |

Section 1 · Identity in the Cloud
| id | layout | TR | content and figure |
|---|---|---|---|
| D1 | breaker 1 | | |
| T01 | lead | 1 | lead (two sentences, one paragraph); figure (Visual Guidance): left, a hierarchy: the IAM mark at the head, a crowned key-holder `Root` at the top branching down by straight lines to user icons, the users clustered inside two group boxes (`Developers`, `Admins`, from TR 3's example only for the first; second tagged `Group`); right, four rows, one per TR bullet with the bullet text inside (IAM mark, root key, user, group icons); row N lights its part of the tree, then a soft pulse walks root → users → groups, looping |
| T02 | points | 2 | lead; 3 points; figure (Visual Guidance): one master key beside a locked cabinet, tag `Root Account`; point 1 an email envelope icon slides into a sign-in card (no username field); point 2 three root-only icons (account closure, credential reset, billing) light round the cabinet; point 3 the IAM MFA Token mark locks onto the key and the key slides into the cabinet; after the build the key glints, looping |
| T02-AN | analogy | 2 | **company owner's master key**, 3D: an office corridor with three doors and a control room; the owner (blazer, calm) opens each door with one master key, then places the key in a wall safe and spins the dial; a worker uses an ordinary card at one door only ↔ concept, 3D: an AWS account space where a glowing root key unlocks every resource (EC2 rack, S3 bucket, billing panel), then drops into a vault sealed with an MFA token while an IAM user card opens one resource only |
| T03 | points | 3 | lead; 3 points; figure (Visual Guidance): three IAM user icons boxed inside one `Developers` group with a shared permission label (IAM Permissions mark on the group's edge); point 1 the permission glows on all three; point 2 a fourth user slides into the box and the glow spreads to it at once; point 3 a user slides out and its glow goes out; after the build the shared glow breathes, looping |
| T04 | table | 4 | lead; Identity / Created When / Typical Use / Risk If Compromised, 3 rows, a row icon each (root key, user, group); note line: the TR's closing sentence (`Knowing who is asking is the first half of access control; the next step checks whether that identity is who it claims to be`) |
| T04-B | screenshot | 4 | the IAM console's left menu with `Users` and `Groups` (`User groups` in the real console) ringed in orange, as the TR cue asks; drawn console-style or a real capture (question 1); whole, at its own aspect ratio |

Section 2 · Authentication vs Authorization
| id | layout | TR | content and figure |
|---|---|---|---|
| D2 | breaker 2 | | |
| T05 | points | 5 | lead; 3 points; figure (Visual Guidance): a straight lane: `Credential` card → `Authentication` gate → `Authorization` gate → `Allowed` / `Denied` exits; point 1 the credential card shows three icons (password lock, key, token clock); point 2 the two gates show two different error marks; point 3 a second request to a protected resource (S3 bucket mark) passes both gates again; a request dot travels the lane, looping |
| T06 | lead | 6 | lead (two sentences, one paragraph); figure (Visual Guidance): left, a credential box (password / access key icons) feeding a gate `Authentication` with a tick and a cross exit; right, four rows with the TR bullet text inside (console with MFA token mark, access key pair, root vs IAM user, a stopped request); row N lights its part, then requests take the tick and the cross exit in turn, looping |
| T06-AN | analogy | 6 | **exam hall**, 3D: students queue at the hall door; the invigilator (lanyard, focused) compares a hall ticket and an ID card with each student's face, lets one in to a desk, stops one whose card does not match (shrug) ↔ concept, 3D: callers holding credential cards reach an authentication gate; a matching credential turns the gate light to a tick and passes, a wrong one is refused at the gate |
| T07 | lead | 7 | lead (two sentences, one paragraph); figure (Visual Guidance): left, the T06 gate small and already passed, then a second gate `Authorization` branching to `Allow` and `Deny`, a policy document beside it; right, four rows with the TR bullet text inside (sequence, attached policy, allowed here / denied there with read and delete icons on one S3 bucket, valid login with no policy); row N lights its part, then a verified request is allowed to read and denied to delete, looping |
| T07-AN | analogy | 7 | **housing society guard**, 3D: a society lobby with a guard booth and a lift; the guard (cap, uniform) has already let the visitor in, now reads the visitor pass and presses only the permitted floor in the lift panel; the visitor rides to that floor, the other floor buttons stay dark ↔ concept, 3D: a verified identity badge stands at an authorization gate; the gate reads the attached policy card and opens the path to one resource (S3 bucket) while the path to a second resource stays closed |
| T08 | table | 8 | lead; Credential / Used For / Lifetime, 3 rows with the Visual Guidance icons per row (a lock, a key, a clock); note line: the TR's Role definition (`Role: an identity with no password or keys of its own; whoever assumes it gets a temporary token`) with the IAM Role mark |
| T09 | points | 9 | lead; 4 points; note line: the TR's closing sentence (`Every decision made with these credentials is governed by policies`); figure (Visual Guidance): a console-style callout list of the IAM menu, `Users`, `Security Credentials`, `Account Settings`, each joined by a straight line to the credential it manages (password policy, MFA device with the MFA Token mark, access keys, STS token with the Temporary Security Credential mark); point N lights its line; if the note pushes the points past the player bar, the figure narrows (pointsW) before any split |

Section 3 · Policy Structure
| id | layout | TR | content and figure |
|---|---|---|---|
| D3 | breaker 3 | | |
| T10 | points | 10 | lead; 4 points; figure (Visual Guidance): a policy document box (IAM Permissions mark on its corner) that opens into four tagged parts `Effect`, `Action`, `Resource`, `Condition`; point N slides out part N (each with its icon: switch, play, target, filter); `Condition` drawn dashed (optional, from the notes); after the build the four parts breathe in turn, looping |
| T10-B | lead | 10 | no new lead (the T10 lead stays as kicker context: kicker and title repeat); figure: the TR's policy JSON in a code pane on the left; on the right three callouts with the TR's three field lines verbatim (`Version: the policy language version, written as 2012-10-17`, `Statement: holds one or more rules`, `Sid: an optional name for a statement`), each joined by a straight line to its key in the code; step N lights callout N and its code line; then `Effect`, `Action`, `Resource`, `Condition` lines tint in turn, looping |
| T10-AN | analogy | 10 | **train ticket**, 3D: a railway platform beside a coach; a ticket examiner (uniform, cap) checks a passenger's ticket against the train number board, the seat number on the coach and a date board, nods, the passenger boards and sits in that one seat ↔ concept, 3D: a request reaches a checkpoint that reads a policy card's four parts in turn (effect switch, action, resource, condition filter) and lets the request onto one resource only |
| T11 | table | 11 | lead; Field / Format / Example, 2 rows (Effect, Action), a row icon each; above the table the T10 four-part strip, small, with `Effect` and `Action` lit (the TR's carried-over highlight) |
| T11-B | points | 11 | the three TR bullets; figure: the Action field large: `s3:*` fanning straight lines to several S3 operation icons (point 1); one statement card listing several actions (point 2); an Effect switch with exactly two positions, `Allow` and `Deny` (point 3); quiet loop on the switch |
| T12 | points | 12 | lead; 4 points; figure (Visual Guidance): the TR's real ARN `arn:aws:s3:::finance-reports/jan.pdf` split at its colons into segments, each segment boxed and tagged (`Prefix`, `Partition`, `Service`, `Region`, `Account`, `Resource`), the two empty S3 fields shown as empty dashed boxes; point 1 splits the string, point 2 lights the resource segment, point 3 shows three condition icons (IP, clock, MFA token mark), point 4 a `*` in the resource segment fanning to several objects |
| T13 | lead | 13 | lead (two sentences, one paragraph); figure (Visual Guidance): two boxes side by side, left a user icon with a policy card attached, right an S3 bucket with a policy card attached carrying a `Principal` line, a straight arrow from a second AWS account into the bucket side only; under them five rows with the TR bullet text inside, left-side rows under the user box, right-side rows under the bucket box; row N lights its part, then the cross-account arrow carries a dot, looping |
| T13-AN | analogy | 13 | **office access**, 3D: an office floor; an employee taps an access card on a door reader and walks through (the card carries the permission); at a restricted room a guard checks a visitor against an approved list on a clipboard and lets her in ↔ concept, 3D: a user figure carries its policy card to a resource door that opens; a bucket holds its own policy list and admits a principal from outside whose name is on it |
| T14 | table | 14 | lead; Aspect / Identity-Based / Resource-Based, 4 rows; note line: the TR's closing sentence (`AWS evaluates applicable policies together to determine whether a request is allowed or denied`); beside the table, as the TR asks, a small copy of the T13 two-box diagram (user + policy, bucket + policy); if the table needs the full width, the small diagram sits above it |

Section 4 · Policy Evaluation Logic
| id | layout | TR | content and figure |
|---|---|---|---|
| D4 | breaker 4 | | |
| T15 | points | 15 | lead; 4 points (in the TR's order); note line: the TR's Policy Simulator sentence; figure (Visual Guidance): a top-to-bottom flowchart `Start` → `Default Deny` → `Explicit Deny?` → `Explicit Allow?` → `Final Decision`, the deny branch orange (red in the TR, rule 51); point 1 merges three policy cards into the Start box, points 2-4 light their boxes; a request dot runs the chart, looping |
| T16 | points | 16 | lead; 3 points; note line: the TR's console sentence (`This default state is visible in the AWS IAM console, where a new user with no attached policy cannot perform any action`); figure (Visual Guidance): a closed padlock; points 1 and 3 show requests bouncing off it; point 2 an `Allow` statement card slides beside it and the padlock opens; held: lock open with the card beside it |
| T16-AN | analogy | 16 | **phone app permissions**, 3D: a young woman at a café table holds a phone; an app tries the camera and the contacts, both shown blocked (icons on the screen, no words), a permission prompt rises, she taps allow for the camera only and the camera view opens; contacts stay locked ↔ concept, 3D: requests hit a closed padlock until an Allow statement card is matched to one of them; that one passes, the other stays blocked |
| T17 | points | 17 | lead; 4 points; figure (Visual Guidance): an `Allow` policy box and a `Deny` policy box, straight arrows converging into one `Denied` result box; point 1 a scan sweeps both boxes for deny first; point 2 more Allow boxes appear and still the result is Denied; point 3 an unrelated Allow cannot reach the result; point 4 a lock settles on a sensitive action icon; loop: the deny arrow pulses into the result |
| T18 | table | 18 | lead; Policy / Type / Statement, 2 rows (Policy A identity-based, Policy B resource-based), a row icon each (user, S3 bucket) |
| T18-B | lead | 18 | lead: the TR's trace sentence (`A request from IP 198.51.100.7 is evaluated: Policy A allows it, but the IP is outside Policy B's range, so the deny applies and the request is rejected`); figure (Visual Guidance): a request card with the IP feeding two policy cards, A ticks, B's condition `203.0.113.0/24` checks the IP and fails, the decision box reads `Access Denied`; steps follow the sentence's three clauses; loop: the request walks the trace |
| T19 | points | 19 | lead; 3 points; figure (Visual Guidance): overlapping policy circles merging into one allowed region with an orange deny slice cutting through it (red in the TR, rule 51); point 1 two identity circles add into one region; point 2 a cross-account request needs both the identity circle and the resource circle (their overlap lights); point 3 within one account either circle is enough (both light whole); the deny slice stays orange throughout |

Section 5 · Reading a Denial
| id | layout | TR | content and figure |
|---|---|---|---|
| D5 | breaker 5 | | |
| T20 | points | 20 | lead; 3 points; figure (Visual Guidance): three boxes `Error Message`, `Audit Log` (CloudTrail mark), `Policy Statement` with straight arrows converging on a magnifying glass tagged `Root Cause`; point N lights box N; loop: the glass scans across the three in turn |
| T21 | points | 21 | lead; 4 points; figure (Visual Guidance): the TR's sample denial message in a console error banner, its parts boxed in soft blue with one-word tags (`Principal`, `Action`, `Resource`, `Reason`), no underlines (rules 49, 55); point N lights part N; if the banner with the full sample is too tall beside four points, it goes full width under a shorter points column (`lead` layout with rows) |
| T21-AN | analogy | 21 | **failed UPI payment**, 3D: a shop counter; a customer scans the shopkeeper's QR code with a phone, the payment fails, the phone screen shows a failed-payment card with icons only (payer, amount, shop, warning) and the customer looks at it, worried; the shopkeeper waits ↔ concept, 3D: a request is refused at a resource and a denial card rises with four icons (principal, action, resource, reason) that light one by one |
| T22 | points | 22 | lead; 4 points; figure (Visual Guidance): a CloudTrail event entry, console-style, with `eventName`, `errorCode` (`AccessDenied`) and `userIdentity` ringed in orange, the CloudTrail mark in its header; point 1 rings the three fields, point 2 filters a list of events down to the AccessDenied ones, point 3 shows the `Event History` menu item, point 4 a 90-day calendar strip extending with a trail; drawn or a real capture (question 1) |
| T23 | lead | 23 | lead (the TR's long sentence); figure (Visual Guidance): a left-to-right flowchart `Error Message` → `CloudTrail Event` → `Policy Document` → `Sid DenyDeleteWithoutMFA` (the last box orange, the highlight the TR asks for); the four TR bullets inside the cards they describe (bullet 1 in Error Message, bullets 2 and 3 in Policy Document, bullet 4 in the Sid box); cards light in order, then a dot walks the chain, looping |
| T23-B | table | 23 | Evidence / What It Shows, 3 rows, a row icon each (error banner, CloudTrail mark, policy document); no lead (kicker and title repeat) |
| T24 | points | 24 | lead; 3 points; figure (Visual Guidance): a single straight arrow chain `Evidence Gathered` → `Statement Identified` → `Policy Corrected`; points 1-2 light the first two; point 3 the last box opens into three fix icons (`Add Allow`, `Remove Deny`, `Satisfy Condition`); loop: a dot walks the chain |

Closing
| id | layout | content |
|---|---|---|
| S-QUIZ | quiz | the closing quiz frame only (Q2: no mid-deck quiz, no feedback card) |
| S-TAKEAWAYS | takeaways | the five agenda titles |
| S-NEXT | next | IAM Roles & Least Privilege |
| S-THANKS / S-BEST | thanks | Thank You · All the Best |

## Questions for sign-off

1. **TR 4, 9 and 22 ask for console screens** (the IAM menu with Users and Groups; the IAM credential pages; a
   CloudTrail event entry), and the TR has no screenshots. **Proposed:** draw them as clean console-style screens, as
   Session 12's TR 15 was. If you can send real captures, or sign in to the AWS console in Chrome for me, they are
   shown whole, identifiers blurred, rings only on what the TR names.
2. **Session 12's review added a mid-deck quiz before section 4 and a feedback card after the takeaways.** Those were
   your choices for that session; no course rule says every deck carries them, and the retired-feedback rule says none
   unasked. **Proposed:** the same as Session 12 as reviewed (mid-deck quiz before D4, feedback card after the
   takeaways), since you asked for its structure; or the closing quiz only, no feedback card.
3. **Seven analogies, each a real-time 3D slide** (TR 2, 6, 7, 10, 13, 16, 21), more than any earlier session (Session
   12 had three). **Proposed:** all seven, as the TR asks. They are the largest build cost and the main load on slow PCs.
4. **`e.g.` in TR 11, 13 and 14** is a Latin abbreviation the content rules ban on a slide. **Proposed:** `such as`,
   the only word-level change to TR text in the deck.

## Coverage check (every TR item → slide)

| TR | item | slide(s) |
|---|---|---|
| Recap / Agenda | 5 titles (sub-lines in notes, R5) | S-RECAP, S-AGENDA, D1-D5 |
| 1 | Content; 4 bullets; guidance; notes | T01 |
| 2 | Content; 3 bullets; analogy; guidance; notes | T02 / T02-AN |
| 3 | Content; 3 bullets; guidance; notes | T03 |
| 4 | Content; table; closing sentence; screenshot cue; notes | T04 / T04-B |
| 5 | Content; 3 bullets; guidance; notes | T05 |
| 6 | Content; 4 bullets; analogy; guidance; notes | T06 / T06-AN |
| 7 | Content; 4 bullets; analogy; guidance; notes | T07 / T07-AN |
| 8 | Content; table; Role line; guidance; notes | T08 |
| 9 | Content; 4 bullets; closing sentence; guidance; notes | T09 |
| 10 | Content; 4 bullets; JSON; 3 field lines; analogy; guidance; notes | T10 / T10-B / T10-AN |
| 11 | Content; table; 3 bullets; guidance; notes | T11 / T11-B |
| 12 | Content; 4 bullets; guidance; notes | T12 |
| 13 | Content; 5 bullets; analogy; guidance; notes | T13 / T13-AN |
| 14 | Content; table; closing sentence; guidance; notes | T14 |
| 15 | Content; 4 bullets; Simulator sentence; guidance; notes | T15 |
| 16 | Content; 3 bullets; console sentence; analogy; guidance; notes | T16 / T16-AN |
| 17 | Content; 4 bullets; guidance; notes | T17 |
| 18 | Content; table; trace sentence; guidance; notes | T18 / T18-B |
| 19 | Content; 3 bullets; guidance; notes | T19 |
| 20 | Content; 3 bullets; guidance; notes | T20 |
| 21 | Content; 4 bullets; sample message; analogy; guidance; notes | T21 / T21-AN |
| 22 | Content; 4 bullets; guidance; notes | T22 |
| 23 | Content; 4 bullets; table; guidance; notes | T23 / T23-B |
| 24 | Content; 3 bullets; guidance; notes | T24 |
| Key Takeaways / Upcoming | 5 titles / IAM Roles & Least Privilege | S-TAKEAWAYS / S-NEXT |

## Narrative and pedagogy

The TR's order is the deck's order. Section 1 names the three identity layers (the master key makes root's power and
why it is locked away physical before users and groups take over daily work), then sets them side by side in a table
and on the real console. Section 2 splits every request into two gates: one lane first, then each gate on its own with
its own analogy (exam hall for identity, society guard for permission, the same pair of questions an interviewer
asks), then the credentials that carry the proof and where they are managed. Section 3 opens the policy document: its
four parts, the real JSON, the train ticket that states exactly what is allowed, then each pair of fields, then the two
places a policy attaches (office card vs visitor list) and a comparison. Section 4 runs the evaluation order: the map,
default deny (phone permissions), deny beats allow, one traced combined decision, the merge rule. Section 5 reads a real
denial: the three pieces of evidence, the message (failed UPI payment), the audit log, one full trace to a Sid, and the
fix. Every concept is introduced before it is used: Effect/Action/Resource/Condition (T10) before the evaluation order
(T15), `Sid` (T10-B) before the trace that ends on one (T23), CloudTrail named in T20 before its event entry (T22).

Analogies (7), each two real-time 3D scenes with no text: master key (T02), exam hall (T06), society guard (T07), train
ticket (T10), office access (T13), phone permissions (T16), failed UPI payment (T21). Session 9's exam hall
(`elastic_compute_instances/custom/i.tsx`) and Session 12's housing society (`h.tsx`, `j.tsx`) are the starting points
for T06-AN and T07-AN.

## Build

All text into `deck.json` (generated once from `tr.txt` by a scratchpad script, then `deck.json` is the source) and a
`stubs.tsx` placeholder for every custom figure; then forked builders on private copies (`deck.mjs dev` on their own
ports, never `build`), each owning one custom file: section 1-2 figures, section 3 figures, section 4-5 figures, and the
seven 3D analogies over four files. Merge, `build`, `check` 0 FAIL 0 WARN, `perf` 0 FAIL, every slide screenshotted
from the built file at step 0, mid-build and held, and read; 3D slides measured at 60 fps.

## As built (2026-11-13)

50 frames, as planned, no extra split. Built into
`/home/nxtwave/Desktop/webslides/Outputdecks/cloudcomputing/iam_fundamentals/dist-single/iam-fundamentals.html`
(6.68 MB, self-contained). `node deck.mjs check`: 0 FAIL, 0 WARN. `node deck.mjs perf`: 0 FAIL, 5 WARN (T07-AN and
T16-AN drew 95 / 99 of 150 frames after the press at 4x CPU, T16-AN one 400 ms frame; D3 and T13 idle at 11% of a core),
pristine OK, Firefox 0 FAIL. Every slide screenshotted held from the built file and read; a live walk of all 50 slides
logged no errors.
- **Fit changes from the plan:** pointsW 640 on T09 and T12, 590 on T02, T05, T16 and T19 (R7: points within two
  lines); lead-layout figures at figW 1080 (T01, T06, T07, T10-B, T13, T14; 1120+ overhung the 1110 px body); T14 figH
  340, T23 1100 x 300; T09 figH 250; next-session title size 62 (one line).
- T12 point 2: a file glyph instead of the official S3 object mark, which draws as a faint ring on the lit tile.
- T10-AN: the passenger does not walk aboard (the rig has no walk cycle); the coach door opens onto her lit seat.
- Tags not in the TR, for review: T01 second group box `Group`; `Confirmed`, `Failure`, `Verified`, `Policy`,
  `Bucket`, `Master Key`; T15 `Denied` outcome box (word from TR 17); T22's other event rows (GetObject, PutObject) and
  source IP 203.0.113.5 (from TR 23); T21 banner header `Access Denied`.
- **Custom files:** `a.tsx` (T01-T09), `b.tsx` (T10-T14), `c.tsx` (T15-T19), `d.tsx` (T20-T24), `h.tsx` (3D master
  key, exam hall), `i.tsx` (3D society guard, train ticket), `j.tsx` (3D office access, phone permissions), `k.tsx` (3D
  failed UPI payment). 3D scenes measured at 60 fps headless with the GPU flags by their builders (K), not yet in
  headed Chrome.
