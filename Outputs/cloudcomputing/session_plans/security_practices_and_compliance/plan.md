# Security Practices & Compliance · slide-wise plan

STATUS: signed off by the user, 2026-11-20 ("just build the deck after planning, don't wait for me"); the open points
below were settled with the defaults named in "Decisions taken without a reply"

- **Session:** cloud computing session 17. Deck project at
  `/home/nxtwave/Desktop/webslides/Outputdecks/cloudcomputing/security_practices_and_compliance/` (the whole project
  outside the repo, rule of 2026-11-13; this plan stays here). Built with `deck-engine/`
  (`node deck.mjs build|check|perf /home/nxtwave/Desktop/webslides/Outputdecks/cloudcomputing/security_practices_and_compliance`).
  Dev port 5287 (builder forks 5360-5367). The `Security Practices & Compliance` row of
  `Outputdecks/cloudcomputing/course.json` gets its folder when built; nothing committed or pushed there unless asked.
- **Series match:** Sessions 14, 15 and 16 as corrected (`iam_roles_and_least_privilege`,
  `encryption_and_key_management`, `cloud_threats_and_attacks`): `deck.json` + `custom/*.tsx` merged in
  `custom/index.tsx` (stubs first) + `images/`. Same opening and closing frames, same breaker, same points / table /
  analogy / screenshot layouts, same glossy 3D icons (`@/engine/icons3d`) on white plinth tiles (`@/engine/figkit`),
  orthogonal `Wire`s, flow dots, `useHot` walks, at least 20 px equal padding.
- **Source:** `Reference ppt's/17. Security Practices & Compliance.pdf` (19 pages), extracted to `tr.txt` beside this
  plan; its 7 captures to `tr_images/img-000..006.png`. **TR numbering as printed:** slides 1-6, 8-11, 13-27; there is
  no Slide 7 or 12 (each gap at a section boundary, numbering only). TR N below is the TR's own number.
- **Practical in the same deck:** the TR carries its practical (TR 22-27, `Securing and Auditing an S3 Bucket`) and
  `course.json` lists no separate practical for this session, so it is the deck's lab section (lab breaker, as the
  Session 14 / Load-Balanced Web Tier practicals).
- **Official marks (rule 54), each in the white tile.** Already in `slide-kit/assets/aws/`: Elastic Load Balancing,
  ALB, EC2 (instance), RDS (instance), S3 (bucket, object), VPC, WAF (and rule), IAM (role), KMS, CloudTrail,
  CloudWatch (logs), Config, Inspector, ECR (image), Lambda (function), GuardDuty, Security Hub, Secrets Manager,
  Systems Manager, Users, Client, Server. **Added today from the official 07312026 package** (downloaded from
  aws.amazon.com/architecture/icons): AWS Artifact, Amazon EventBridge (and Rule), Amazon SNS (and Topic), CloudWatch
  Alarm, Systems Manager Parameter Store, VPC Flow Logs.

## Built in from the first draft (what came back on Sessions 13-16)

Generate-slides standing corrections 1-17 and cloud course R1-R14 all hold. The table in the Session 15 plan holds
unchanged: 3D icons (`i3d:` refs everywhere), plinth tiles, >= 20 px equal padding, orthogonal wires from box
constants, the named thing drawn (no word boxes), one-word Title Case tags under untagged icons, splits planned up
front, text-free real-time 3D analogies with Character Lab people via `castSprite`, no highlighted rows unless the TR
asks, orange never red, compositor-only loops, `perf` 0 FAIL, Firefox PASS. Points beside a figure take two lines at
most (correction 4): a longer TR bullet is split at its own clause boundary into points sharing one `at`.

## Text policy (binding, same as Sessions 14-16)

1. Kicker = the TR `Heading`, title = the TR `Subheading`, in the TR's own case (`ISO Vs SOC2`, `Notify, Not Just
   Store` kept). The TR `Content` paragraph is the `lead`; bullets are points; tables are tables.
2. Allowed edits are punctuation, letter case and layout only. Spaced em dashes: TR 10's second paragraph `logs —
   alarms` becomes `logs: alarms`; TR 16's paired dashes `regulators — applicable equally on AWS, Azure or GCP —
   demand` become commas. No mark ends a line (rule 36). Chip and figure tags capitalise every word (rule 56). Product
   names, code and values keep their form (`s3:GetObject`, `rds-db:connect`, `kms:Decrypt`, `/api/*`, `SSE-S3`,
   `SSE-KMS`, `aws:SecureTransport`, `s17-security-lab-unique123`, `ap-south-1`, `102.0 B`). British spelling stays.
3. Too long → split at the TR's own bullet boundary into a second frame with the same kicker and title; a single
   bullet over two lines splits at its own clause (`;`, `, but`), letter case only.
4. Speaker Notes → `notes`, verbatim, on every frame of a split. Visual Guidance → the figure spec. Analogy → its own
   analogy slide, the TR sentence in `notes`.
5. Figure tags use only TR words and product names. No invented numbers or names.
6. Recap, agenda and takeaways carry the five titles only (R5); breakers the title only; sub-lines in `notes`.
7. **One TR typo fixed:** TR 26's table cell `HTTPS-only bucket polic` reads `HTTPS-only bucket policy` (the row's own
   Expected result is `Deny statement present`, and TR 24 names the policy).

## Deck (68 frames)

Opening
| id | layout | content |
|---|---|---|
| S-WELCOME | brand | |
| S-TITLE | title | Security Practices & Compliance (R9) |
| S-RECAP | recap | previous: Cloud Threats & Attacks; Denial of Service · Data Breaches · Misconfiguration · Insider & Supply-Chain Threats · AI-Specific Threats; presenter illustration (R6) |
| S-AGENDA | agenda | Defense in Depth in Practice · Configuration Hygiene · Logging, Auditing & Detection · Secrets Management · Compliance Frameworks |

Section 1 · Defense in Depth in Practice
| id | layout | TR | content and figure |
|---|---|---|---|
| D1 | breaker 1 | | |
| T01 | points | 1 | lead; bullets 1-3; figure A_T01 (Visual Guidance): the three-tier deployment drawn left to right, `Load Balancer` (ELB mark) → `EC2` (instance mark) → `RDS` (instance mark) with `S3` (bucket mark) under EC2, inside a VPC frame; five layer markers beside their controls, each a plinth 3D icon with a one-word tag: Network (firewall icon on the subnet / security group edge), Identity (IAM role mark on EC2), Data (padlock on RDS and S3), Application (WAF mark in front of the load balancer), Monitoring (CloudTrail / eye on the side); point N lights layer N; loop: one request rides LB → EC2 → RDS |
| T01-B | points | 1 | same kicker and title; bullets 4-5; the same figure with layers 1-3 shown, point 4 lights Application, point 5 Monitoring |
| T02 | table | 2 | lead; Layer / Control on this deployment, 5 rows, row icons = T01's five layer icons in order; no highlight |
| T02-B | points | 2 | same kicker and title; lead = the TR's closing line `A stolen EC2 credential passes the identity check, but ...`; points: bullet 1; bullet 2 split at its `;` and `, but` into three points sharing one `at`; figure A_T02B (Visual Guidance): T01's deployment, the request path lights left to right, then an orange cross on the Identity layer (a stolen key at EC2), and the remaining layers hold: the scoped role reaches only one bucket (other resources fade behind a ban), S3 objects stay padlocked behind a `kms:Decrypt` key check, the snapshot padlock needs the KMS key |
| T02-C | points | 2 | same kicker, title and lead; bullet 3; the same figure at its end state, VPC Flow Logs and CloudTrail marks light and an eye flags the unusual access; loop: log lines add |

Section 2 · Configuration Hygiene
| id | layout | TR | content and figure |
|---|---|---|---|
| D2 | breaker 2 | | |
| T03 | points | 3 | lead; 4 points; figure A_T03 (Visual Guidance): a loop of four plinth cards on orthogonal wires, `Baseline` (shield + wrench) → `Defaults` (toggle) → `CSPM` (radar) → `Scanning` (scan), and a return wire to Baseline; point N lights card N; loop: a dot circulates the loop |
| T04 | points | 4 | lead (two sentences); bullets 1-2; figure A_T04 (Visual Guidance): a checklist board of four rows, `Ports Closed` (a server whose open ports shut), `Defaults Removed` (default account card crossed), `Golden Image` (an image disk chosen, EC2 AMI mark), `Public Blocked` (S3 bucket with a block shield); point 1 ticks row 1, point 2 ticks row 2 |
| T04-B | points | 4 | same kicker and title; bullets 3-4; the same board, rows 1-2 ticked, point 3 ticks row 3, point 4 ticks row 4; the four ticks then glow together as the hardened baseline |
| T04-AN | analogy | 4 | **setting up a new phone securely**, 3D: a young adult at a desk with a new phone in hand; the phone's screen walks password changed (a lock), an app permission toggled off, a security setting toggled on, then a tick ↔ concept, 3D: a server box being hardened: open ports shut, a default account tile removed, a safe-setting switch turned on, then a green shield (TR's own analogy; see decision 2) |
| T05 | points | 5 | lead (two sentences); bullets 1-2; figure A_T05 (Visual Guidance): a dashboard panel, baseline rules on the left (check rows), live resource list on the right (bucket, security group, instance rows); point 1 one resource's setting changes (a port opens, a bucket policy edits) and an orange flag rises on it; point 2 account tabs above the panel (several accounts, several services) feed the one dashboard |
| T05-B | points | 5 | same kicker and title; bullets 3-4; the same dashboard: point 3 the Security Hub mark on the panel header, findings gathered; point 4 the flagged rows re-sort by severity (High, Medium, Low bars); loop: the scan line sweeps the list |
| T05-AN | analogy | 5 | **car's regular service inspection**, 3D: a car on a service lift in a garage, a mechanic checking brakes, tyres and engine in turn, a calendar page turning between visits ↔ concept, 3D: a scanning ring passes over a row of cloud resources at regular intervals, one drifted item flagged and set right |
| T06 | points | 6 | lead; bullets 1-2; figure A_T06 (Visual Guidance): pipeline on orthogonal wires, `Commit` (code) → `Static Scan` (Inspector scanning an ECR image) → `Deploy` → `Runtime Scan` (Inspector over EC2 / Lambda) → `Config` (AWS Config continuous evaluation); point 1 lights the pre-deploy scan, point 2 the runtime scan |
| T06-B | points | 6 | same kicker and title; bullets 3-5; the same pipeline: point 3 Config lights with a history timeline; point 4 a clock and a bolt trigger the scans; point 5 a findings wire returns to the start, feeding the hardened baseline; loop: commits ride the pipeline |

Section 3 · Logging, Auditing & Detection
| id | layout | TR | content and figure |
|---|---|---|---|
| D3 | breaker 3 | | |
| T08 | points | 8 | lead; 4 points; figure B_T08 (Visual Guidance): four plinth cards left to right, `Audit Trail` (trail), `Retention` (hourglass), `Alerting` (megaphone / bell), `Threat Detection` (radar), with a log stream flowing into each stage; point N lights card N; loop: log lines flow |
| T09 | points | 9 | lead; 4 points; figure B_T09 (Visual Guidance): a timeline bar, a short `90 Days` Event History window on the left (CloudTrail mark), an orthogonal arrow to an S3 bucket tagged `Trail Storage` whose bar extends to `Years`; point 1 the 90-day window; point 2 events ride to the bucket; point 3 a lifecycle dial sets the retention end; point 4 a digest seal on the stored files, a tampered file turns orange |
| T10 | points | 10 | lead = paragraph 1; bullets 1-3; figure B_T10 (Visual Guidance): pipeline `Log Entry` (log) → `Metric Filter` (filter) → `CloudWatch Alarm` / `EventBridge Rule` (both marks, stacked) → `SNS` (topic mark) to email and chat icons; point 1 the filter catches a matching line; point 2 a counter ticks up; point 3 the counter reaches 5 in a 5-minute window and the alarm fires |
| T10-B | points | 10 | same kicker and title; lead = paragraph 2 (CloudTrail vs CloudWatch); bullets 4-5; the same pipeline with CloudTrail feeding the EventBridge rule and CloudWatch feeding the alarm; point 4 an API call goes straight to the rule; point 5 SNS delivers to email and chat; loop: alerts ride the chain |
| T11 | points | 11 | lead (two sentences); bullets 1-3; figure B_T11 (Visual Guidance): three log sources (`CloudTrail`, `Flow Logs`, `DNS Logs`) on orthogonal wires into the GuardDuty mark, a ranked findings list on the right; point 1 a baseline band of normal activity with one spike flagged; point 2 a credential finding; point 3 cryptomining (coin) and recon (radar) findings |
| T11-B | points | 11 | same kicker and title; bullets 4-5; the same figure: point 4 the findings list ranks itself by severity, raw log lines stay behind; point 5 an agentless badge (no server, no agent icon crossed); loop: log dots ride into GuardDuty |
| T11-AN | analogy | 11 | **bank's fraud system**, 3D: a bank counter and ATM; a stream of ordinary transactions passes a monitoring screen at an analyst's desk, then one unusual withdrawal at the ATM makes the screen flag it and the analyst look up ↔ concept, 3D: a stream of account-activity tiles passes a detection engine, one malicious tile is lifted out and flagged |
| S-QUIZ-1 | quiz | | mid-deck quiz before section 4 (Sessions 15 and 16 as corrected); questions from the TR's exam hooks of sections 1-3 in `notes` |

Section 4 · Secrets Management
| id | layout | TR | content and figure |
|---|---|---|---|
| D4 | breaker 4 | | |
| T13 | points | 13 | lead (two sentences); bullets 1-3; figure C_T13 (Visual Guidance) left half: a code window with a password string in it (blurred value) and an orange cross; point 1 a git history strip keeps the line after deletion; point 2 a container image's layers show the baked-in secret; point 3 a scanner finds the leaked key |
| T13-B | points | 13 | same kicker and title; bullets 4-5; the right half joins: the same application calling a locked secret-store vault (Secrets Manager mark) through an arrow tagged `IAM-Checked Request`; point 4 the value sits in the store, the code shows none; point 5 the app fetches at runtime; loop: requests ride the arrow |
| T13-AN | analogy | 13 | **bank locker key, not printed in the passbook**, 3D: a customer at a bank counter shows an ID; the officer brings the locker key from a guarded cabinet and hands it over; the customer's open passbook on the counter shows no key ↔ concept, 3D: an application tile asks a secret-store vault; an IAM check light passes and the credential is handed to the app at runtime |
| T14 | table | 14 | lead; Feature / Secrets Manager / Parameter Store, 4 rows, header marks (Secrets Manager, Parameter Store), row icons (refresh, lock, target, coin); no highlight |
| T14-B | points | 14 | same kicker and title; bullets 1-4; figure C_T14B (Visual Guidance): `Application` → arrow tagged `IAM Policy Check` → secret-store (Secrets Manager mark) with a KMS padlock beside it → return arrow tagged `Current Version`; point 1 the SDK call (no plaintext file, a file crossed); point 2 the IAM check gate; point 3 version tiles stack in the store; point 4 the prior version stays below for rollback |
| T15 | points | 15 | lead; bullets 1-2; figure C_T15 (Visual Guidance): a timeline, `Day 0` version A active, a rotation event triggers a Lambda (function mark), `Day N` version B active with version A greyed as previous; point 1 Lambda makes the new credential and updates the database; point 2 the store marks B current and A previous |
| T15-B | points | 15 | same kicker and title; bullet 3 split at its `;` and bullet 4 split at its `, but` (two points each, one `at` each); the same timeline: point 3 the application's next fetch gets B, a cached copy refreshes; point 4 a failed rotation: the store keeps A current while the database holds B, an orange warning until fixed |

Section 5 · Compliance Frameworks
| id | layout | TR | content and figure |
|---|---|---|---|
| D5 | breaker 5 | | |
| T16 | points | 16 | lead; bullets 1-3; figure D_T16 (Visual Guidance): five labelled plinth cards in a row, `ISO 27001` (certificate), `SOC 2` (report), `GDPR / HIPAA` (shield with document), `DPDP Act` (gavel), `Data Residency` (pin on a globe), elbow wires converging into one wide card `Shared Responsibility`; point 1 lights ISO 27001 and SOC 2; point 2 GDPR / HIPAA; point 3 DPDP Act |
| T16-B | points | 16 | same kicker and title; bullets 4-5; the same figure: point 4 Data Residency; point 5 the wires converge and the Shared Responsibility card lights (provider half, customer half) |
| T17 | points | 17 | lead (two sentences); 4 points; figure D_T17 (Visual Guidance): a certificate icon tagged `ISO 27001` beside a report icon tagged `SOC 2`, each with a small AWS Artifact download arrow beneath; point 1 an accredited body's seal stamps the certificate; point 2 the SOC 2 report shows `Type I` with one date marker; point 3 `Type II` with a period bar; point 4 the Artifact mark lights and both download |
| T17-AN | analogy | 17 | **restaurant hygiene certificate**, 3D: diners at a restaurant table glance at a framed hygiene certificate on the wall, the kitchen door stays shut, they order with confidence ↔ concept, 3D: a customer tile takes a certificate and a report from a vendor's cloud building without opening it |
| T18 | table | 18 | lead; Aspect / ISO 27001 / SOC 2, 4 rows, row icons (target, globe, certificate, refresh); **Output row highlighted** (the TR asks: `highlight the Output row`) |
| T19 | points | 19 | lead (three sentences); bullets 1-2; figure D_T19 (Visual Guidance): three flags (EU, India, US) on plinth cards, each pointing to a short clause list of icons; point 1 the EU card's rights (eye access, pencil correction, trash erasure, export portability); point 2 a `72 Hours` clock on the EU card |
| T19-B | points | 19 | same kicker and title; bullets 3-4, bullet 5 split at its `;` (two points, one `at`); the same figure: point 3 the India card's data fiduciary badge; point 4 a consent tick; point 5 the US card's health record with a signed BAA document and an eligible-service tick |
| T19-AN | analogy | 19 | **library rules**, 3D: a library desk where a member borrows and renews a book under a posted rules board, the librarian files the member's card into a locked drawer ↔ concept, 3D: personal-data tiles collected, used and stored under a rule shield, the private tile locked away |
| T20 | points | 20 | lead; 4 points; figure D_T20 (Visual Guidance): two region panels, `EU` and `India`, each a soft boundary with a data icon (database) inside; point 1 a transfer arrow out of the EU stops at the boundary; point 2 a padlock tagged `SCC` lets the arrow cross; point 3 the India boundary closes to one country gate; point 4 a security shield stays on both datasets (residency alongside controls). No map-line background (rule 59): the regions are plain shaped panels |
| T21 | points | 21 | lead; 4 points; figure D_T21 (Visual Guidance): a split panel, left `Provider Proves` (data centre building, server rack, certificate), right `Customer Proves` (configuration gear, padlock, policy document), an `Auditor` (person tile with a magnifier) between them; point 1 the provider side; point 2 the customer side; point 3 Artifact hands the reports to the auditor; point 4 the auditor's magnifier passes over logs, encryption and policies |

Practical · Securing and Auditing an S3 Bucket
| id | layout | TR | content and figure |
|---|---|---|---|
| D-LAB | breaker 6, lab | | kicker `Practical Hands-On`, title `Securing and Auditing an S3 Bucket` |
| P22 | lead | 22 | lead; figure E_P22: the seven TR steps as a numbered zig-zag timeline of plinth cards (correction 8), each with its 3D icon and the TR step text; each press lights the next step |
| P23 | table | 23 | lead; Setting / Value, 4 rows (`s17-security-lab-unique123`, `Mumbai (ap-south-1)`, `SSE-S3`, `Bucket owner enforced`), row icons (bucket, pin, lock, crown) |
| P23-B | screenshot | 23 | caption `Server-side encryption settings showing SSE-S3 active`; img-000; ring on the SSE-S3 line |
| P23-C | screenshot | 23 | caption `Upload succeeded for security-demo.txt (102.0 B)`; img-001; rings on the `Upload succeeded` banner and the `security-demo.txt` row |
| P24 | table | 24 | lead; Policy element / Meaning, 5 rows, code-styled elements |
| P24-B | screenshot | 24 | caption `Saved policy DenyInsecureTransport: Deny, Principal *, s3:*, aws:SecureTransport false`; img-002; rings on the Sid / Effect / Principal / Action lines and the `aws:SecureTransport` line |
| P25 | table | 25 | lead; Security check / Where to check / Secure configuration, 3 rows |
| P25-B | screenshot | 25 | caption `Object Ownership: Bucket owner enforced (ACLs disabled)`; img-003; ring on `Bucket owner enforced` and its ACLs line |
| P25-C | screenshot | 25 | caption `ACL panel: grantees are listed, but bucket owner enforced means no ACL permission applies`; img-004 with the Canonical ID blurred (rule 53); ring on the bucket-owner-enforced info banner |
| P25-D | screenshot | 25 | caption `Block all public access checked (all four settings on)`; img-005; ring on `Block all public access` |
| P26 | table | 26 | lead; Check / Expected result / Actual result, 5 rows (typo fixed, text policy 7) |
| P27 | table | 27 | lead; Service / Main purpose, 2 rows (CloudTrail, CloudWatch marks); note `This demo used the root user only for brevity; real work uses an IAM user with least privilege` |
| P27-B | screenshot | 27 | caption `CloudTrail CreateBucket event: event name, source, user, Region`; img-006 with Event ID and Request ID blurred (rule 53; the access key and IP are already blurred in the TR); rings on Event name, Event source, User name, AWS region; note `Also look for PutBucketPolicy, PutBucketEncryption and PutPublicAccessBlock events if recorded` |
| P27-C | lead | 27 | lead `Cleanup: delete security-demo.txt, then the bucket; leave every other bucket and CloudTrail resource untouched`; figure E_P27C: the object, then the bucket, fade into a trash tile in that order (numbered), other buckets and the CloudTrail mark stay with a keep tick |

Closing
| id | layout | content |
|---|---|---|
| S-QUIZ | quiz | the closing quiz frame; questions from sections 4-5 exam hooks in `notes` |
| S-TAKEAWAYS | takeaways | the five agenda titles |
| S-NEXT | next | Cloud-Native Application Design (the TR's `Upcoming Session`) |
| S-THANKS / S-BEST | thanks | Thank You · All the Best |

## Coverage check (every TR item → slide)

| TR | item | slide(s) |
|---|---|---|
| Recap / Agenda | 5 titles each (sub-lines in notes, R5) | S-RECAP, S-AGENDA, D1-D5 |
| 1 | Content; 5 bullets; guidance; notes | T01 / T01-B |
| 2 | Content; table; closing line; 3 bullets; guidance; notes | T02 / T02-B / T02-C |
| 3 | Content; 4 bullets; guidance; notes | T03 |
| 4 | Content; 4 bullets; analogy; guidance; notes | T04 / T04-B / T04-AN |
| 5 | Content; 4 bullets; analogy; guidance; notes | T05 / T05-B / T05-AN |
| 6 | Content; 5 bullets; guidance; notes | T06 / T06-B |
| 8 | Content; 4 bullets; guidance; notes | T08 |
| 9 | Content; 4 bullets; guidance; notes | T09 |
| 10 | Content (two paragraphs); 5 bullets; guidance; notes | T10 / T10-B |
| 11 | Content; 5 bullets; analogy; guidance; notes | T11 / T11-B / T11-AN |
| 13 | Content; 5 bullets; analogy; guidance; notes | T13 / T13-B / T13-AN |
| 14 | Content; table; 4 bullets; guidance; notes | T14 / T14-B |
| 15 | Content; 4 bullets; guidance; notes | T15 / T15-B |
| 16 | Content; 5 bullets; guidance; notes | T16 / T16-B |
| 17 | Content; 4 bullets; analogy; guidance; notes | T17 / T17-AN |
| 18 | Content; table (Output row highlighted); notes | T18 |
| 19 | Content; 5 bullets; analogy; guidance; notes | T19 / T19-B / T19-AN |
| 20 | Content; 4 bullets; guidance; notes | T20 |
| 21 | Content; 4 bullets; guidance; notes | T21 |
| 22 | Content; 7 steps | P22 |
| 23 | Content; table; 2 captures | P23 / P23-B / P23-C |
| 24 | Content; table; 1 capture | P24 / P24-B |
| 25 | Content; table; 3 captures | P25 / P25-B / P25-C / P25-D |
| 26 | Content; table | P26 |
| 27 | Content; table; 1 capture; two note lines; cleanup | P27 / P27-B / P27-C |
| Key Takeaways / Upcoming | 5 titles / Cloud-Native Application Design | S-TAKEAWAYS / S-NEXT |

## Narrative and pedagogy

The TR's order is the deck's order, building on Session 16's threats. Section 1 takes defense in depth from an idea to
one real deployment, then shows a stolen credential contained by the layers behind it. Section 2 keeps that
deployment safe over time: harden at launch (the new-phone picture), watch for drift (the car service), scan
automatically. Section 3 is the reacting half: trails, retention, alerts and managed detection (the bank's fraud
desk). Section 4 moves secrets out of code into a store (the locker key the passbook never prints) and rotates them.
Section 5 adds the audit-and-law layer on top: assurance standards (the hygiene certificate), privacy laws (the
library's rules), residency, and who proves what. The practical then applies hygiene, encryption, access and audit to
one S3 bucket end to end.

Every term arrives before it is used: security groups, IAM roles, KMS and CloudTrail are Sessions 13-16 terms;
secure defaults and Block Public Access (T03-T04) before the lab's Block Public Access checks; CloudTrail (T02) before
trails (T09); CSPM (T03) before T05; Security Hub named in T05 only; AWS Artifact named in T16-T17 before T21; SSE-S3 /
SSE-KMS from Session 15 before the lab.

Analogies (6), each two real-time 3D scenes with no text: new phone (T04), car service (T05), bank fraud desk (T11),
bank locker key (T13), restaurant hygiene certificate (T17), library rules (T19).

## Decisions taken without a reply (user: "don't wait for me")

1. **Practical kept in this deck** as its lab section (the TR has it, `course.json` has no separate practical row).
2. **TR 4 analogy:** the speaker notes say "Explain hardening using the house-locking picture", but the TR's Analogy
   line is the new phone. The analogy slide draws the phone (the TR's written analogy); the notes keep the TR's words.
3. **Mid-deck quiz** before section 4, as Sessions 15 and 16 were corrected to carry.
4. **TR 26 typo** `polic` → `policy` (text policy 7).
5. **Screenshots:** the TR's 7 captures used whole (uncropped, R12), 2x Lanczos + light unsharp (R4), Canonical ID,
   Event ID and Request ID blurred (rule 53), originals kept in `workflow/captures/security_practices_and_compliance/`.

## Build

All text into `deck.json` (generated once from `tr.txt` by a scratchpad script, then `deck.json` is the source) and a
`stubs.tsx` placeholder for every custom figure. New icon names go into the ENGINE module first. Technical figures on
`@/engine/icons3d` + `@/engine/figkit` (references: Sessions 14-16 `custom/a.tsx`-`d.tsx`). Forked builders on
private copies (`deck.mjs dev` on their own ports, never `build`), each owning one custom file: a (sections 1-2),
b (section 3), c (section 4), d (section 5), e (lab figures), h / i / j (the six 3D analogies, two each). Merge,
`build`, `check` 0 FAIL 0 WARN, `perf` 0 FAIL, Firefox PASS, every slide screenshotted from the built file at step 0,
mid-build and held, and read for padding, overlaps, overflow, arrow ends, crowding and plain spots before reporting.

## As built (2026-11-20)

68 frames, as planned. `/home/nxtwave/Desktop/webslides/Outputdecks/cloudcomputing/security_practices_and_compliance/dist-single/security-practices-and-compliance.html`
(11.30 MB, self-contained). `check` 0 FAIL 0 WARN; `perf` 0 FAIL, 1 WARN (slide 46's 3D arrival held one frame 267 ms
at x4 CPU, budget 250); pristine OK; Firefox 0 FAIL 0 WARN (12 3D canvases draw). Every slide screenshotted held from
the built file and read; builders shot their slides stepped.
- **Changes from the plan:** T19's third lead sentence (HIPAA) moved to T19-B's lead (T19's lead ran five lines);
  T05-B and T06 `pointsW` 640 so every point takes two lines; P22 `figH` 344, P27-C `figH` 300; P23 Region cell plain
  text. E_P22 shows order by wires, no step numbers (R10).
- **Built from a private engine copy** (scratchpad `s17/engine`, node_modules symlinked): Session 18 was building in
  the same engine at the same time, and `deck.mjs` writes the shared `deck-engine/deck.config.json` and `dist-single/`.
- **Custom files:** `a.tsx` (S1-2), `b.tsx` (S3), `c.tsx` (S4), `e.tsx` (lab), `d.tsx` (S5), `h.tsx` (phone, car),
  `i.tsx` (bank fraud desk, locker key), `j.tsx` (restaurant certificate, library). h/i/j each carry an inline copy of
  Session 16's clock.

## Review round 1 + split (user, 2026-11-20)

- Slides 6-7 (A_T01): the security-group ring widened left (x0 106 -> 80) so `Load Balancer` sits inside it; one
  component, so both slides match.
- Beards removed (accessory `beard: 'none'`, nothing else touched): slide 18 mechanic (h.tsx), slide 28 ATM customer
  (i.tsx, was stubble), slide 42 teal-shirt diner and glasses client (j.tsx). Slide 33's older customer keeps his.
- **Split as Session 5 (2026-11-17):** this deck keeps slides 1-48 plus the closing quiz, Key Takeaways, Next Session
  (now `Securing and Auditing an S3 Bucket`), Thank You, All the Best: 53 slides. The practical (D-LAB, P22-P27-C)
  moved unchanged to `Outputdecks/cloudcomputing/practical_hands_on_securing_and_auditing_an_s3_bucket/` (named after
  the lab breaker; `labDeck: true`; Welcome + lab + Thank You + All the Best, 18 slides; `e.tsx` and the lab captures
  moved with it). `course.json` row added after Security Practices & Compliance.
