# IAM Roles & Least Privilege · slide-wise plan

STATUS: signed off by the user, 2026-11-17 ("proceed with plan don't wait"); questions 2-4 taken as proposed: P25-D shown with rings on the three Result cells, T17 columns tinted orange / green, console red `Denied` badges kept red

- **Session:** cloud computing session 14. Deck project at
  `/home/nxtwave/Desktop/webslides/Outputdecks/cloudcomputing/iam_roles_and_least_privilege/` (the whole project
  outside the repo, rule of 2026-11-13; this plan stays here). Built with `deck-engine/`
  (`node deck.mjs build|check|perf /home/nxtwave/Desktop/webslides/Outputdecks/cloudcomputing/iam_roles_and_least_privilege`).
  Dev port 5285 (builder forks 5341-5348). The `IAM & Least Privilege` row of `Outputdecks/cloudcomputing/course.json`
  gets its folder when built; nothing committed or pushed there unless asked.
- **Series match:** Session 16 (`cloud_threats_and_attacks`) as built, and Session 13 (`iam_fundamentals`) as corrected
  on 2026-11-16: `deck.json` + `custom/*.tsx` merged in `custom/index.tsx` (stubs first) + `images/`.
- **Source:** `Reference ppt's/14. IAM Roles Least Privilege.pdf` (18 pages), extracted to `tr.txt` beside this plan.
  TR slides 1-26, no gaps. TR N below is the TR's own number.
- **Screenshots: six in the TR** (practical, TR 22-25), extracted at their own size, originals kept in
  `Outputs/cloudcomputing/workflow/captures/iam_roles_and_least_privilege/` (rule 53):
  `tr22-managed-policy.png` 1493x821, `tr23-policy-editor.png` 1493x821, `tr24-role-permissions.png` 1441x569,
  `tr25-simulator-before.png` 1392x780, `tr25-policy-edited.png` 1392x780, `tr25-simulator-after.png` 1660x770 (the
  sixth has no caption in the TR, question 2). Shown whole, at their own aspect ratio, 2x Lanczos + light sharpen (R4).
  **Nothing to blur:** no account id, email, access key or resource id appears in any of them (the ARN on TR 22 is the
  AWS-managed policy's public ARN; `S14-EC2-Demo-Role` and `S14-EC2-ReadOnly-Demo` are the TR's own names).
- **Official marks (rule 54), each in the white tile.** In `slide-kit/assets/aws/` already: IAM, IAM Role, IAM
  Temporary Security Credential, IAM Long-Term Security Credential, IAM MFA Token, IAM Permissions, IAM Access Analyzer,
  CloudTrail, EC2 (and instance), Lambda (and function), S3, Users, Client, Bedrock not needed. **To add from the official
  AWS package (07312026, already downloaded):** AWS STS (`Res_..._AWS-STS`), IAM Roles Anywhere, IAM Identity Center,
  Elastic Container Service (and its Task resource), AWS Organizations if the governance figure needs it.

## The visual standard, built in from the first draft (your word on Sessions 13 and 16)

Generate-slides standing corrections 1-17 and cloud course R1-R14 all hold. The ones that came back as review
feedback on Sessions 13 and 16, and how this deck has them from the first draft:

| Earlier decks had | Built here from the first draft |
|---|---|
| Flat lucide icons in technical visuals (S13 first build) | **Glossy vector 3D icons** from the engine (`@/engine/icons3d`, `Ico3D` / `Tile3D`); every point and table icon an `i3d:` ref. Names this TR needs and the module lacks are added to the ENGINE module in the same drawing style (likely: `badge` visitor pass, `library` book, `funnel`, `ceiling`, `circles` overlap, `agent`, `metadata`, `refresh`, `elevator`) |
| Icons bare on the stage | Every icon on a **white plinth tile** (`Plinth`, `@/engine/figkit`); official AWS marks on the same white tile |
| Cards against their stage edge, text near borders (S13) | **At least 20 design px of equal padding** inside every stage and card; inner padding = parent's; no wrapper card round a card pair |
| Diagonal connectors, heads placed by eye (S13) | **Orthogonal elbow `Wire`s** computed from the box constants, tip on the target edge |
| Static plain boxes with a word in them (S13) | **The named thing drawn**: a padlock, a clock, a library card, a policy document, a funnel, a door, an instance, a token; micro-animation on every icon, a flow dot on every wire, a lit item walking first → last → first (`useHot`) |
| Overlong TR points past the player bar (S11, S16) | Planned up front: split at the TR's own bullet boundary into a second frame with the same kicker and title (T03-B); a point split at its own clause shares one `at` |
| Untagged icons (S9) | One single-word Title Case tag under each untagged icon (R13); no chips, badges or connector labels |
| Text on analogy cards, isometric clay, modelled people | Six **real-time 3D analogies** on `@/engine/three-stage`, Character Lab people via `castSprite` (never a copy), role clothing, expressions synced to the action, loops 3-9 s restarting within 0.3 s, no text on either card |
| Highlighted rows nobody asked for (rule 60) | Only where the TR asks: T12 (SAML and OIDC rows) and T17 (column tints, question 3) |
| Red in visuals | Template orange (rule 51), one meaning per slide; TR 8's "circled in red" asterisks are orange rings |
| Lag on classroom PCs | loops on the compositor only (`transform` / `opacity` on HTML or root svg), `perf` 0 FAIL, Firefox PASS |

## Text policy (binding, same as Sessions 13 and 16)

1. Kicker = the TR `Heading`, title = the TR `Subheading`, in the TR's own case (`Roles Vs Users`,
   `Update, Retest, Discuss` kept as written). The TR `Content` paragraph is the `lead`; bullets are points (or the
   text inside a one-row-per-bullet figure); tables are tables; a TR closing sentence under a table is the slide's
   `note`.
2. Allowed edits are punctuation, letter case and layout only: a spaced em dash becomes a colon (TR 8, 9, 11, 15, 17
   leak row, 19 analogies in notes; TR 17 table cells `High — may be ...` → `High: May be ...`); the full stops inside
   TR 17's leak-risk cells are dropped (rule 36); no mark ends a line; figure tags capitalise every word (rule 56);
   product names and code keep their form (`sts:AssumeRole`, `s3:*`, `aws:MultiFactorAuthPresent`, `ec2:*`,
   `arn:aws:s3:::finance-reports-2024/*`). Every word stays.
3. Too long → split at the TR's own boundary into a second frame with the same kicker and title.
4. Speaker Notes → `notes`, verbatim, on every frame of a split. Visual Guidance → the figure spec. Analogy → its own
   analogy slide, the TR sentence in `notes`.
5. Figure tags use only TR words and product names. No invented numbers, names or incidents. Policy snippets on
   T07, T08 and T13 use only the TR's own values (`s3:*`, `s3:GetObject`, `finance-reports-2024`, `*`,
   `aws:MultiFactorAuthPresent: true`, `TerminateInstances`), drawn in the engine code pane, ligatures off (rule 40).
6. Recap, agenda and takeaways carry the five titles only (R5); breakers the title only; sub-lines in `notes`.

## Deck (54 frames)

Opening
| id | layout | content |
|---|---|---|
| S-WELCOME | brand | |
| S-TITLE | title | IAM Roles & Least Privilege (R9) |
| S-RECAP | recap | previous: IAM Fundamentals; Identity in the Cloud · Authentication vs Authorization · Policy Structure · Policy Evaluation Logic · Reading a Denial; presenter illustration (R6) |
| S-AGENDA | agenda | Roles & Temporary Credentials · Principle of Least Privilege · Federation & Single Sign-On · Service & Machine Identity · Identity for AI Agents |

Section 1 · Roles & Temporary Credentials
| id | layout | TR | content and figure |
|---|---|---|---|
| D1 | breaker 1 | | |
| T01 | points | 1 | lead (two sentences); 4 points; figure (Visual Guidance): two plinth cards side by side, `IAM User` (person on a tile, padlock badge, a key pair that stays) and `Role` (role mark, clock badge, a key set that fades out); point 1 a caller tile steps onto the role card; point 2 the three credential pieces (access key, secret key, token) appear under the role; point 3 the clock ring runs down and the pieces fade; point 4 a trust policy document drops in front of the role as its gate; loop: the clock ring keeps running and the role's keys refill and fade, the user's padlock stays shut. If the two-sentence lead and four points pass the player bar, the bullets move inside the figure as one row each (Session 13 pattern) |
| T02 | points | 2 | lead (two sentences); 4 points; figure (Visual Guidance): a temporary visitor badge on a lanyard with the role name, contrasted with a permanent ID card labelled `IAM User`; point 1 a `Trust Policy` document clips to the badge; point 2 a `Permissions` document beside it; point 3 a person, an app and an AWS service tile each take the badge in turn; point 4 an employee tile leaves and the badge stays on its hook; loop: the badge swings gently, the walking highlight crosses the three borrowers |
| T02-AN | analogy | 2 | **library card**, 3D: a library counter, a librarian scans a member's card, the member walks off with a book under a wall clock, returns it through the return slot, loop ↔ concept, 3D: a caller (boy with a laptop) takes a role badge from a desk, a ring of light counts down, the badge returns to its stand |
| T03 | points | 3 | lead; bullets 1-3; figure (Visual Guidance): flow on orthogonal wires: `Caller` → `sts:AssumeRole` request card → `Trust Policy` check (STS mark) → `Temporary Credentials` → `Role Permissions`; point 1 the request card carries the role ARN to STS; point 2 the trust policy check ticks; point 3 the caller's own permission tile ticks beside it; loop: a dot rides the flow |
| T03-B | points | 3 | same kicker and title; bullets 4-5; the same flow, its later stages lit: point 4 the caller signs requests with the credentials and the role's permissions apply; point 5 STS hands the fresh credential set back with a clock; loop: credentials ride back to the caller |
| T04 | points | 4 | lead; 4 points; figure (Visual Guidance): three plinth tiles `Access Key`, `Secret Key`, `Session Token` feeding one `Signed API Request` arrow, a countdown clock beside the set; point 1 the two key tiles light; point 2 the token tile lights and rides with the request; point 3 a duration dial `1 h` to `12 h` on the role; point 4 the clock reaches zero, the set fades, a loop arrow returns to `AssumeRole`; loop: requests keep leaving, the clock keeps counting |
| T05 | table | 5 | lead; Aspect / Temporary (Role) / Long-Lived (User Keys), 4 rows, row icons (hourglass, refresh, alert, users); no highlight (the TR asks for none) |
| T05-B | lead | 5 | same kicker and title, no new text; figure (Visual Guidance): two timeline bars, the role credential bar ending at a few hours with a clock end cap, the user key bar running off the right edge with no end marked; loop: a leak marker slides along both bars, the role bar closes it off at its end |

Section 2 · Principle of Least Privilege
| id | layout | TR | content and figure |
|---|---|---|---|
| D2 | breaker 2 | | |
| T06 | points | 6 | lead; 4 points; figure (Visual Guidance): a funnel, a wide `Broad Access` disc at the top narrowing through four lever rings (`Scoping`, `Wildcards`, `Boundaries`, `Tightening`) into a small `Exact Need` disc; point N lights ring N and the stream through it narrows; loop: dots fall through the funnel |
| T07 | points | 7 | lead; 4 points; figure (Visual Guidance): two policy snippets side by side, left broad (`"Action": "s3:*"`, `"Resource": "*"`), right scoped (`"Action": "s3:GetObject"`, `"Resource": "arn:aws:s3:::finance-reports-2024/*"`), an arrow between them; point 1 the Action lines light; point 2 the Resource lines light; point 3 the right snippet shows two separate statement blocks; point 4 a blast-radius ring around each snippet, wide on the left, tight on the right; loop: the ring breathes |
| T08 | points | 8 | lead (two sentences); 4 points; figure (Visual Guidance): a policy snippet with `"Action": "*"` and `"Resource": "*"`, the asterisks ringed orange (red in the TR, rule 51), next to an unlocked padlock in front of a row of doors; point 1 the Action asterisk ring; point 2 the Resource asterisk ring; point 3 every door swings open; point 4 a leaked key reaches every open door; loop: doors open in a wave |
| T08-AN | analogy | 8 | **building-wide access card**, 3D: an office corridor of doors; an employee taps one card and every door swings open, though only one room was needed ↔ concept, 3D: a single badge with an asterisk touching a row of service blocks, all lighting |
| T09 | points | 9 | lead (two sentences); 4 points; figure (Visual Guidance): two overlapping circles `Identity Policy` and `Permission Boundary`, only the overlap shaded as `Effective`; point 1 the boundary circle alone stays empty; point 2 the identity circle's outer part greys out; point 3 a team lead tile tries to stretch their circle and the boundary holds; point 4 the boundary attaches to a user and a role tile; loop: the overlap glows |
| T09-AN | analogy | 9 | **floor access card**, 3D: a lift with a row of floor buttons; an employee taps the card; only the approved floors light, the others stay dark even as a department notice behind lists more ↔ concept, 3D: a tall stack of permission blocks, a glass ceiling slab stopping the stack at its level |
| T10 | table | 10 | lead; Pass / Policy Statement / Why This Pass, 4 rows, row icons (play, eye, filter, ceiling); code values in their own form |
| T10-B | lead | 10 | same kicker and title; figure (Visual Guidance): a four-row funnel shrinking `Start` → `Observe` → `Narrow` → `Cap`, an arrow from each row to the next, the IAM Access Analyzer and CloudTrail marks on the `Observe` row; note: the TR's closing sentence (`Each pass trades early convenience ...`); loop: the light walks Start → Cap |

Section 3 · Federation & Single Sign-On
| id | layout | TR | content and figure |
|---|---|---|---|
| D3 | breaker 3 | | |
| T11 | points | 11 | lead (two sentences); 4 points; figure (Visual Guidance): `Employee` → `Company IdP` (verifies) → `Signed Proof` → `AWS` accepts, an elbow back to the employee `Logged In`; point 1 the redirect from AWS to the IdP; point 2 the signed proof arrives, no password crosses; point 3 a trust link drawn between AWS and the IdP beforehand; point 4 the IdP fans to `Other Clouds` and `On-Premise` apps; loop: the proof rides the loop |
| T11-AN | analogy | 11 | **company ID card at branch offices**, 3D: the head office issues an employee a card; the employee walks into two branch offices and each guard waves the card through without a fresh check ↔ concept, 3D: an IdP tower issues a signed token that several cloud application tiles accept in turn |
| T12 | table | 12 | lead; Concept / Simple Explanation, 5 rows, row icons (idcard, doc, token, password, link); **SAML and OIDC rows highlighted, as the TR asks** ("the two carrier standards"; rule 60 allows a highlight the content asks for) |
| T13 | points | 13 | lead; 4 points; figure (Visual Guidance): a policy snippet with a Condition block `"aws:MultiFactorAuthPresent": "true"`, an arrow to a `TerminateInstances` action marked `Denied` without MFA; point 1 the condition line lights; point 2 the terminate action's deny card; point 3 the IAM Identity Center mark fans to several account tiles; point 4 an MFA token mark beside the IdP and Identity Center; loop: a request without the token hits the deny, one with it passes |

Section 4 · Service & Machine Identity
| id | layout | TR | content and figure |
|---|---|---|---|
| D4 | breaker 4 | | |
| T14 | points | 14 | lead; 4 points; figure (Visual Guidance): EC2, Lambda and ECS marks each on an elbow to a small role mark; a crossed-out key beside a code file tagged `Embedded Key`; point N lights instance / workload / anti-pattern / many services in turn (point 4 the three become a grid of many); loop: role marks pulse in turn |
| T15 | points | 15 | lead (two sentences); 3 points; figure (Visual Guidance): EC2, Lambda and ECS, each with an arrow to its own role box (`Instance Profile` wrapping EC2's role, `Execution Role`, `Task Role`); point 1 the EC2 role swaps without the code card moving; point 2 Lambda's execution role lights; point 3 ECS's task role per task definition; loop: the swap repeats |
| T15-AN | analogy | 15 | **hotel room's own housekeeping card**, 3D: a hotel corridor, a room door with its card in a holder; two different housekeepers with carts take turns using the room's card ↔ concept, 3D: an EC2 server rack with its own role badge, different workloads running on it calling AWS through that badge |
| T16 | points | 16 | lead; 4 points; figure (Visual Guidance): `Instance` → `Metadata Service` → `Temporary Credentials` → `AWS API Call`; point 1 the metadata service hands credentials locally; point 2 a refresh loop renews them before the clock ends; point 3 a Lambda box with credentials appearing inside its environment; point 4 a config file and a code file with an empty key slot; loop: credentials refresh and ride to the API |
| T17 | table | 17 | lead; Dimension / Embedded Access Key / Instance/Workload Role, 4 rows, row icons (pin, wrench, alert, ban); column tints as the TR asks (question 3) |
| T18 | points | 18 | lead; 4 points; figure (Visual Guidance): many small service boxes, each with a role icon, all feeding into one central `IAM` governance box; point 1 each service gets its own role; point 2 an on-premises server joins through the IAM Roles Anywhere mark; point 3 a cross-account elbow between two account frames; point 4 the central box tracks and revokes one role (it greys out); loop: dots ride from every service to the centre |

Section 5 · Identity for AI Agents
| id | layout | TR | content and figure |
|---|---|---|---|
| D5 | breaker 5 | | |
| T19 | points | 19 | lead; 3 points; figure (Visual Guidance): `AI Agent` (3D bot) → token → `Cloud API`, the token carrying three marks `Scoped`, `Short-Lived`, `Revocable` and a small expiry clock; point N lights its mark (scoped: the token reaches one API tile only; short-lived: the clock runs out; revocable: a cut in the wire); loop: the token rides, the clock counts |
| T19-AN | analogy | 19 | **delivery worker's shift card**, 3D: a delivery worker taps a temporary card at a gate that opens only the assigned area; at the end of the shift the card's light goes out and the gate stays shut ↔ concept, 3D: an AI agent robot with a glowing token reaching one API door; the token dims and the door closes |
| T20 | points | 20 | lead; 4 points; figure (Visual Guidance): two lanes side by side, a wide-permission agent whose path reaches a destructive `Delete` action on production data, and a scoped agent whose path is blocked at the same step; point N lights its line (1-2 the wide lane, 3 the scoped lane's three guards, 4 an IAM role mark under both); loop: both agents repeat their step |

Practical · Building and Testing a Least-Privilege IAM Role
| id | layout | TR | content and figure |
|---|---|---|---|
| DL | breaker (lab) | | Building and Testing a Least-Privilege IAM Role |
| P21 | steps | 21 | kicker `Practical Overview`, title `What Gets Built`; lead; the six numbered steps as a timeline (correction 8), a 3D icon per step |
| P22 | screenshot | 22 | lead; `tr22-managed-policy.png` whole; step caption: the TR caption; ring on the active `Permissions` tab (the TR caption names it) |
| P23 | screenshot | 23 | lead; `tr23-policy-editor.png` whole; caption; rings on the `JSON` toggle and the `ec2:DescribeInstances` line (both named by the caption) |
| P24 | screenshot | 24 | lead; `tr24-role-permissions.png` whole; caption; ring on the one attached policy row (`S14-EC2-ReadOnly-Demo`, `Customer managed`) |
| P25 | table | 25 | kicker `Update, Retest, Discuss`, title `Closing The Gap`; lead; Action / Before Update / After Update, 3 rows, `Allowed` / `Denied` cells with a check or cross icon |
| P25-B | screenshot | 25 | `tr25-simulator-before.png` whole; caption 1 (`Policy Simulator before the update: ...`); rings on the three Result cells the caption names |
| P25-C | screenshot | 25 | `tr25-policy-edited.png` whole; caption 2 (`Policy edited to add ec2:StartInstances; TerminateInstances stays absent`); ring on the `ec2:StartInstances` line |
| P25-D | screenshot | 25 | `tr25-simulator-after.png` whole (question 2) |
| P25-E | points | 25 | same kicker and title; the TR's two closing bullets; figure: an `ec2:*` policy card with a broken link to the role (never attached), and the role's trust relationship document naming the trusted account and `sts:AssumeRole`; point N lights its card |
| P26 | points | 26 | lead; 3 points; figure: the finished role card with three action rows (`DescribeInstances` tick, `StartInstances` tick, `TerminateInstances` cross); point 1 the role card lifts away first; point 2 the policy card follows once detached; point 3 federation and AI-agent tiles sit greyed as `Conceptual`; loop: the tick rows glint |

Closing
| id | layout | content |
|---|---|---|
| S-QUIZ | quiz | the closing quiz frame only (Sessions 13 and 16: no mid-deck quiz, no feedback card) |
| S-TAKEAWAYS | takeaways | the five agenda titles |
| S-NEXT | next | Encryption & Key Management |
| S-THANKS / S-BEST | thanks | Thank You · All the Best |

## Coverage check (every TR item → slide)

| TR | item | slide(s) |
|---|---|---|
| Recap / Agenda | 5 titles each (sub-lines in notes, R5) | S-RECAP, S-AGENDA, D1-D5 |
| 1 | Content; 4 bullets; guidance; notes | T01 |
| 2 | Content; 4 bullets; analogy; guidance; notes | T02 / T02-AN |
| 3 | Content; 5 bullets; guidance; notes | T03 / T03-B |
| 4 | Content; 4 bullets; guidance; notes | T04 |
| 5 | Content; table; guidance; notes | T05 / T05-B |
| 6 | Content; 4 bullets; guidance; notes | T06 |
| 7 | Content; 4 bullets; guidance; notes | T07 |
| 8 | Content; 4 bullets; analogy; guidance; notes | T08 / T08-AN |
| 9 | Content; 4 bullets; analogy; guidance; notes | T09 / T09-AN |
| 10 | Content; table; closing sentence; guidance; notes | T10 / T10-B |
| 11 | Content; 4 bullets; analogy; guidance; notes | T11 / T11-AN |
| 12 | Content; table; guidance (SAML / OIDC rows); notes | T12 |
| 13 | Content; 4 bullets; guidance; notes | T13 |
| 14 | Content; 4 bullets; guidance; notes | T14 |
| 15 | Content; 3 bullets; analogy; guidance; notes | T15 / T15-AN |
| 16 | Content; 4 bullets; guidance; notes | T16 |
| 17 | Content; table; guidance (column tints); notes | T17 |
| 18 | Content; 4 bullets; guidance; notes | T18 |
| 19 | Content; 3 bullets; analogy; guidance; notes | T19 / T19-AN |
| 20 | Content; 4 bullets; guidance; notes | T20 |
| 21 | Content; 6 steps | P21 |
| 22 | Content; screenshot + caption | P22 |
| 23 | Content; screenshot + caption | P23 |
| 24 | Content; screenshot + caption | P24 |
| 25 | Content; table; 2 captioned screenshots + 1 uncaptioned; 2 bullets | P25 / P25-B / P25-C / P25-D / P25-E |
| 26 | Content; 3 bullets | P26 |
| Key Takeaways / Upcoming | 5 titles / Encryption & Key Management | S-TAKEAWAYS / S-NEXT |

## Narrative and pedagogy

The TR's order is the deck's order, building on Session 13's identities and policies. Section 1 introduces the role as
a third identity type beside users and groups (permanent padlock against expiring clock), what a role is made of
(trust policy and permission policy, a library card), how it is assumed through STS, the three-part temporary
credential set, and why temporary beats long-lived (the exposure window). Section 2 turns to how much a role should
hold: the four levers on one funnel, then each lever (scoping, the wildcard and its master card, the boundary and its
floor card, iterative tightening traced pass by pass). Section 3 moves the sign-in out of AWS: federation and the
signed proof (the head-office card), the five terms side by side, then MFA as a policy condition and SSO through IAM
Identity Center. Section 4 gives machines the same treatment: the map, the role on the machine (the hotel room's card),
how credentials arrive with no key in code, the embedded-key comparison, and governance at scale. Section 5 applies it
all to AI agents (the delivery shift card) and names excessive agency as a permissions failure. The practical builds a
describe-only EC2 role, tests it in the Policy Simulator, closes the gap by one permission, and cleans up.

Every term arrives before it is used: STS and `sts:AssumeRole` (T03) before the trust relationship in the practical
(P25-E); the session token and expiry (T04) before automatic delivery (T16); scoping and wildcards (T07-T08) before
`ec2:*` and excessive agency (T20, P25-E); permission boundary (T09) before the `Cap` pass (T10); IAM Access Analyzer
(T10) named once; Condition keys (T13) using Session 13's policy structure.

Analogies (6), each two real-time 3D scenes with no text: library card (T02), building-wide access card (T08), floor
access card (T09), company ID card at branches (T11), hotel housekeeping card (T15), delivery shift card (T19).

## Build

All text into `deck.json` (generated once from `tr.txt` by a scratchpad script, then `deck.json` is the source) and a
`stubs.tsx` placeholder for every custom figure. Technical figures on `@/engine/icons3d` + `@/engine/figkit` (Session
16's reference: `Outputdecks/cloudcomputing/cloud_threats_and_attacks/custom/a.tsx`-`d.tsx`); new icon names added to
the engine module first. Forked builders on private copies (`deck.mjs dev` on their own ports, never `build`), each
owning one custom file: section 1, section 2, sections 3-4, section 5 + practical figures, and the six 3D analogies over
three files. Merge, `build`, `check` 0 FAIL 0 WARN, `perf` 0 FAIL, Firefox PASS, every slide screenshotted from the
built file at step 0, mid-build and held, and read for padding, overlaps, arrow ends and plain spots before reporting.

## Questions at sign-off

1. Sign off the plan as written?
2. `tr25-simulator-after.png` (the simulator after the update) has no caption in the TR. Show it on its own frame with
   rings on the three Result cells (they match the TR's After Update column), or leave it out (the table already says it)?
3. TR 17 asks for the left column "highlighted red for risk rows" and the right "green". Proposed: the Embedded Access
   Key column tinted template orange (rule 51), the Role column tinted the template's success green, no text colour.
4. The console's own red `Denied` badges inside TR 25's captures: keep them red (they carry the result, rule 51's
   exception for red that carries data), or shift them to orange like the TR author's red boxes in earlier decks?

## As built (2026-11-17)

54 frames, as planned. `/home/nxtwave/Desktop/webslides/Outputdecks/cloudcomputing/iam_roles_and_least_privilege/dist-single/iam-roles-and-least-privilege.html`
(10.94 MB, self-contained; ~4.4 MB of it is the six 2x console captures). `check` 0 FAIL 0 WARN; `perf` 0 FAIL, 1 WARN
(slide 23, the section 3 breaker, idles at 7% of a core against a 6% budget: the engine's breaker, not a figure); 3D
slides 118 of 150 frames at x4 CPU, worst 183 ms; pristine OK; Firefox 0 FAIL 0 WARN. 3D analogies measured at 60 fps
in GPU Chrome by their builders. Every slide screenshotted held from the built file and read.
- **Changes from the plan:** T04's third point split at the TR's own semicolon into two points sharing one step (R7,
  letter case only: `The requested session duration cannot exceed this limit`). P26's held frame keeps the role and
  policy cards at full strength with their trash badges (the lift-and-fade is live motion only). T13's Condition
  block carries the `Bool` operator (not a TR word) so the JSON is valid. T15's two app roles told apart by a small
  bucket / database badge. T20's lanes stacked, not side by side (width). T07's separate statements are TR 10's
  `s3:GetObject` and `s3:PutObject` (TR 7 names no second service).
- **Engine changes this build (uncommitted, shared):** table cell tones `risk` / `safe` (`types.ts`,
  `net/vtable.tsx`) for TR 17; the `screenshot` layout measures where its capture really starts and caps its height
  to end at 628 (`render.tsx`): the old estimate let three captures run under the player bar (43, 45, 47). Other
  engine decks change on rebuild only where a capture overflowed.
- **Icon names the builders wished the engine had:** badge, dial, metadata, refresh, idp, ceiling, funnel, scissors,
  key-crossed (closest existing names used; nothing drawn privately except T06's funnel and T04's dial as svg).
- **Custom files:** `a.tsx` (S1), `b.tsx` (S2), `c.tsx` (S3-4), `d.tsx` (S5 + practical), `h.tsx` (library card,
  building card), `i.tsx` (lift floors, branch offices), `j.tsx` (hotel housekeeping, delivery shift).

## Review round 1 (2026-11-18), on the user's list (original slide numbers)
- Slide 11 (T04) split into T04 + T04-B, same title, kicker and layout: T04 keeps the lead and the key / session-token
  points (figure A_T04 steps 1-2); T04-B carries the duration, limit and expiry points (A_T04 from step 2: dial and
  re-assume wire). A_T04 gained `from` / `steps` props so each half walks only its own parts. Deck now 55 slides.
- Slide 40 (P21) redesigned: `lead` layout with custom figure D_P21 (d.tsx, 1080 x 344, 6 steps): six step cards in
  two rows of three, 3D icon on a plinth (the role step its official mark) beside a narrow TR text column, orthogonal
  wires with flow dots, row 1 turning into row 2 through the row gap, the lit card walking 1 -> 6 -> 1.
- Slide 46 (P25-C) the ring crossed `"ec2:DescribeInstances",` above: the capture's line gap is 12 image px (~3 display
  px), narrower than a ring's stroke and padding, so no ring position can clear it. Engine: a ring with a fifth value
  `'band'` draws a soft orange band laid exactly on the rect, multiplied under the text; P25-C uses one on line 8 only.
- After: check 0 FAIL 0 WARN; perf 0 FAIL, idle WARNs at 7-8% on slides 11, 23, 29 (budget 6%; the idle measure
  wanders run to run on unchanged slides); pristine OK; Firefox 0 FAIL 0 WARN.
