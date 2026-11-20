# Cloud-Native Applications · slide-wise plan

STATUS: signed off by the user, 2026-11-20 ("Sign off, build it"); question 2: `Cloud-Native Applications`; question 3: school office, notes verbatim

- **Session:** cloud computing session 18. Deck project at
  `/home/nxtwave/Desktop/webslides/Outputdecks/cloudcomputing/cloud_native_applications/` (the whole project outside
  the repo, rule of 2026-11-13; this plan stays here). Built with `deck-engine/`
  (`node deck.mjs build|check|perf /home/nxtwave/Desktop/webslides/Outputdecks/cloudcomputing/cloud_native_applications`).
  Dev port 5288 (builder forks 5361-5369). The `Cloud-Native Applications` row of `Outputdecks/cloudcomputing/course.json`
  gets its folder when built; nothing committed or pushed there unless asked.
- **Series match:** Sessions 14, 15 and 16 as corrected in their review rounds (`iam_roles_and_least_privilege`,
  `encryption_and_key_management`, `cloud_threats_and_attacks`): `deck.json` + `custom/*.tsx` merged in
  `custom/index.tsx` (stubs first) + `images/`. Same opening and closing frames, same breaker, same points / table /
  analogy layouts, same glossy 3D icons on white plinth tiles (`@/engine/icons3d` + `@/engine/figkit`).
- **Source:** `Reference ppt's/18. Cloud-Native Applications.pdf` (16 pages), extracted to `tr.txt` beside this plan.
  **TR numbering as printed:** slides 1-8, 10-25. There is no Slide 9; nothing is missing, only the number.
  TR N below is the TR's own number. **No screenshots** in the TR (`pdfimages` lists none) and none asked for.
- **Official marks (rule 54), each in the white tile.** In `slide-kit/assets/aws/` already: EC2 Auto Scaling (service
  and resource), Elastic Load Balancing, CloudWatch (+ alarm, Logs resource), EC2 (instance, AMI), RDS, DynamoDB,
  S3, Lambda, API Gateway, SNS, ECS, Elastic Beanstalk, Systems Manager Parameter Store, Users, Client, Server.
  **To add from the official package (07312026, already downloaded):** Amazon SQS (service + queue resource),
  Amazon ElastiCache (service + ElastiCache for Redis resource), Amazon EKS, AWS Fault Injection Service, the Auto
  Scaling group frame. **Vendor marks to fetch** into `slide-kit/assets/tech/` from each project's own artwork:
  Kubernetes (CNCF artwork repo), Heroku, Redis, MySQL.

## Mistakes from Sessions 13-16, built out from the first draft

Generate-slides standing corrections 1-17 and cloud course R1-R14 all hold. What came back as review feedback on the
last four decks, and how this deck has it from the start:

| Earlier decks had | Built here from the first draft |
|---|---|
| Flat lucide icons in technical visuals (S13) | **Glossy vector 3D icons** (`Ico3D` / `Tile3D`); every point and table icon an `i3d:` ref. Names this TR needs and the module lacks go into the ENGINE module first, same drawing style: `queue`, `breaker`, `stopwatch`, `terminal`, `rocket`, `traffic`, `cart`, `api`, `cube`, `funnel`, `heartbeat`, `dice`, `power`, `layers` |
| Bullet icon different from the diagram's icon for the same thing (S14 r2, S16 r1) | **Each point's icon is the icon its figure draws for that thing**, same name, same colour |
| A visual and a table on one slide (S14 r2 slide 11, S15 r1 T18/T22) | A table slide carries the table only; a visual the TR asks for in place of a table is drawn as that visual (T18) |
| No quiz until the end (S14 r2, S15 r1, S16 r1 each added one) | **Mid quiz `S-QUIZ-1` before D4** from the first build, plus the closing quiz |
| Icons bare on the stage, cards against their stage edge (S13) | Every icon on a white plinth tile; **at least 20 design px of equal padding** inside every stage and card; no wrapper card round a card pair |
| Diagonal connectors, heads placed by eye, arrows starting on an icon (S13, S15 r1 T25) | **Orthogonal elbow `Wire`s** from the box constants, leaving a box EDGE and ending with the tip on the target edge |
| A blocked path drawn as a normal arrow (S15 r1 T12-B) | A path that never arrives is **dashed and faded with an orange cross** before the target |
| A badge that says the opposite of the slide (S15 r1 T14: open padlocks on encrypted stores) | Every badge read against the TR sentence it illustrates (failed = cross, healthy = tick, open breaker = open switch) |
| Wires with no clue what flows on them where the TR names it (S16 r1 T02) | A short TR-word tag on a wire only where the TR names what flows (`Request`, `Message`, `Session Key`); no other connector labels (R10/R13) |
| A crowded slide split only after review (S14 slide 11, S16 T21) | **Splits planned up front** at the TR's own bullet boundary wherever a long lead and four or more points would crowd the figure: T02, T03, T05, T06, T07, T08, T14, T15, T17, T19, T20, T21, T25 below; same kicker and title |
| Analogy glitches on slow PCs: bodies sliding, a flicker on re-size (S14 r2 T15-AN, S16 r2-3 T21-AN) | Every 3D analogy on the engine's `castSprite` with fixed `px: 256` and `breath: false` for still poses, the cards faded in only once every person has a first frame (Session 16's `custom/clock.tsx`, copied), one clock per analogy slide shared by both cards; loops 3-9 s restarting within 0.3 s |
| Highlighted rows nobody asked for (rule 60) | Only where the TR asks: T12's `Fault isolation` row ("highlight the Fault isolation row") |
| Red in visuals | Template orange (rule 51) for failure, one meaning per slide |
| Lag on classroom PCs | loops on the compositor only (`transform` / `opacity` on HTML or root svg), `perf` 0 FAIL, Firefox PASS |

## Text policy (binding, same as Sessions 14-16)

1. Kicker = the TR `Heading`, title = the TR `Subheading`, in the TR's own case. The TR `Content` paragraph is the
   `lead`; bullets are points; a TR line after the bullets is the `note`; tables are tables.
2. Allowed edits are punctuation, letter case and layout only: a spaced em dash becomes a colon (TR 6 bullet 3: `a
   network-consumed resource: database, queue, cache or SMTP server`; the em dashes in the TR 1 and TR 23 analogies and
   in the notes); the stray closing quote after `isolated from the rest` in the TR 12 table and the double space in
   `Elastic Beanstalk  or` are dropped; no mark ends a line (rule 36); figure tags capitalise every word (rule 56);
   product names, code and values keep their form (`REST`, `gRPC`, `SMTP`, `i-0a1b2c3d4e5f67890`, `10.0.1.15`,
   `8080`, `sess_7f3a2b`, `30-minute TTL`, `3-second`, `500ms`, `5`, `30 seconds`, `dev/prod parity`). Every word stays.
3. Too long → split at the TR's own bullet boundary into a second frame with the same kicker and title.
4. Speaker Notes → `notes`, verbatim, on every frame of a split. Visual Guidance → the figure spec. Analogy → its own
   analogy slide, the TR sentence in `notes`.
5. Figure tags use only TR words and product names. No invented numbers, names or values.
6. Recap, agenda and takeaways carry the five titles only (R5); breakers the title only; sub-lines in `notes`.

## Deck (58 frames)

Opening
| id | layout | content |
|---|---|---|
| S-WELCOME | brand | |
| S-TITLE | title | Cloud-Native Applications (R9; question 2) |
| S-RECAP | recap | previous: Security Practices & Compliance; Defense in Depth in Practice · Configuration Hygiene · Logging, Auditing & Detection · Secrets Management · Compliance Frameworks; presenter illustration (R6) |
| S-AGENDA | agenda | Cloud-Native Principles · The Twelve-Factor App · Monolith vs Microservices · Statelessness · Scalability & Resilience Patterns |

Section 1 · Cloud-Native Principles
| id | layout | TR | content and figure |
|---|---|---|---|
| D1 | breaker 1 | | |
| T01 | points | 1 | lead; 3 points (Elasticity, Failure tolerance, Ease of change); figure (Visual Guidance): three plinth cards on the left, `Elasticity` (server stack that grows and shrinks), `Failure Tolerance` (shield with a heartbeat), `Ease Of Change` (refresh), each on an elbow wire into one larger card `Cloud-Native Application` (a cloud holding an app window); point N lights card N and its wire; loop: a lit card walks 1 → 3 → 1, a flow dot on each wire |
| T01-AN | analogy | 1 | **automatic traffic signal**, 3D: a road junction; cars build up on one road and the signal holds green longer for it, the road goes quiet and the green shortens; one stalled car is passed by the rest ↔ concept, 3D: requests arrive in waves at an app; the instance blocks multiply on the busy wave and fall back on the quiet one, a failed block is swapped while traffic flows on |
| T02 | points | 2 | lead; bullets 1-3; figure (Visual Guidance): a traffic-spike timeline, a demand curve across the top over an Auto Scaling group (orange dashed frame, official mark) behind an Elastic Load Balancing tile; point 1 new instances attach to the target group; point 2 the curve crosses a threshold line, the CloudWatch alarm mark fires, an instance is added; point 3 a dashed forecast curve runs ahead of the real one and instances arrive before the rise; loop: the curve rises and falls, the fleet follows |
| T02-B | points | 2 | same kicker and title; bullets 4-5; note `For variable demand, right-sized elastic fleets usually cost less than one large fixed server, since idle capacity is released when demand drops`; figure: left a stateless instance copied freely (×3, each serving requests); right a stateful database whose added copy needs the shared state brought along (a sync link with an hourglass); loop: the stateless copies scale out and in, the stateful copy waits on sync |
| T03 | points | 3 | lead; bullets 1-2; figure (Visual Guidance): a Region with two Availability Zone frames side by side behind a load balancer; point 1 the server in zone A greys out with an orange cross and the traffic arrow re-routes entirely to zone B; point 2 inside zone B, services sit in bulkhead compartments and one compartment's failure stays inside its walls; loop: requests ride to the healthy zone |
| T03-B | points | 3 | same kicker and title; bullets 3-4; figure: a component map with a failure at one node and its **blast radius** ring reaching only its neighbour; then the Fault Injection Service mark sends a fault into one component, it recovers (tick); loop: fault, ring, recovery |
| T04 | points | 4 | lead; 3 points; note `Together, elasticity, failure tolerance and ease of change shape how configuration, processes and logging are structured next`; figure (Visual Guidance): a loop diagram, old instance image retired, new image (AMI mark) built, tested (tick) and launched, the load balancer shifting traffic across; tag `Replace, Not Patch`; point 2 an Infrastructure as Code template drawing two identical environments; point 3 one service deploying while the others keep running; loop: the replace cycle turns |

Section 2 · The Twelve-Factor App
| id | layout | TR | content and figure |
|---|---|---|---|
| D2 | breaker 2 | | |
| T05 | points | 5 | lead (two sentences); bullets 1-2; figure (Visual Guidance): the 12 factor names as a numbered vertical list in small text (two columns of six, TR order); point 1 the twelve rows build in; point 2 five rows highlighted in three boxes, `Config` + `Backing Services`, `Processes` + `Disposability`, `Logs` (the Visual Guidance's three boxes and bullet 2's five factors, matching section 2's three slides); loop: the three boxes light in turn |
| T05-B | points | 5 | same kicker and title; bullets 3-4; figure: point 3 a factor tile mends a cracked server tile (an operational failure fixed); point 4 one app box lands unchanged on the Heroku, Elastic Beanstalk and Kubernetes marks in turn; loop: the app hops platform to platform |
| T05-AN | analogy | 5 | **travel checklist**, 3D: a traveller at home with a clipboard checklist, ticking tickets, documents, a packed suitcase and a waiting cab, then the same routine for a second trip ↔ concept, 3D: one app package checked against a checklist panel and deployed to three different environments, running the same way in each |
| T06 | points | 6 | lead (two sentences); bullets 1-2; figure (Visual Guidance, left column): an `App Code` card kept separate from a `Config` card of environment-variable rows (`Database URLs`, `Feature Flags`) with a `Secret Store` vault feeding API keys and passwords; point 2 the same app box copied into `Dev`, `Staging`, `Production` frames, only the config card changing in each; loop: the config card swaps under an unchanged app |
| T06-B | points | 6 | same kicker and title; bullets 3-5; figure (Visual Guidance, right column): the app reaches RDS, SQS and ElastiCache marks (backing services) on wires that pass through the config card; point 4 a local MySQL mark swaps for the RDS mark by one config row, the code card untouched (tick); point 5 the config rows `RDS Endpoint` and `SQS Queue URL` light with their wires; loop: requests ride the wires |
| T07 | points | 7 | lead; bullets 1-2; figure (Visual Guidance): a row of identical process boxes tagged `Stateless`; point 2 session rows leave the processes for a shared cache below; loop: requests reach any process, which reads the session from the cache |
| T07-B | points | 7 | same kicker and title; bullets 3-5; figure (Visual Guidance): a start arrow (stopwatch, fast launch) and a stop arrow (signal), point 4 in-flight requests drain before the process exits; point 5 autoscaling adds processes quickly and an idle-cost coin stack stays low; loop: processes start, serve, drain, exit |
| T08 | points | 8 | lead (two sentences); bullets 1-3; figure (Visual Guidance): app `stdout` (terminal stream) → container runtime / host → log router → central log store; point 1 a local log file crossed out, lines stream to standard output; point 2 the runtime captures them; point 3 streams from several hosts merge at the router; loop: log lines ride the flow |
| T08-B | points | 8 | same kicker and title; bullets 4-5; figure: the process is destroyed (fades out) while its lines stay in the central store; point 5 the store becomes CloudWatch Logs log groups (official marks); loop: processes come and go, the log group keeps filling |
| T10 | points | 10 | lead; 3 points; figure (Visual Guidance): one funnel narrowing three factor tiles (`Config`, `Processes / Disposability`, `Logs`) into one box tagged `Disposable, Scalable Unit`; point 2 the unit is replaced by an identical one; point 3 the unit stands alone, then as many units; loop: units drop out of the funnel |

Section 3 · Monolith vs Microservices
| id | layout | TR | content and figure |
|---|---|---|---|
| D3 | breaker 3 | | |
| T11 | points | 11 | lead; 3 points; figure (Visual Guidance): a monolith box with all modules inside on one shared database; beside it separate microservice boxes (`Orders`, `Payments`, `Inventory`, TR 13's capabilities), each with its own datastore and API, linked by thin wires; point 3 only the busy service gets copies; loop: a request load lights the busy service |
| T11-AN | analogy | 11 | **school office**, 3D: one office counter where a single clerk serves admissions, fees and exam queues, the admissions rush holds everyone up; beside it three separate office counters, and the fees counter adds a second clerk in fee week ↔ concept, 3D: one monolith block slowing under one busy module; separate service blocks where only the busy one is copied |
| T12 | table | 12 | lead; Aspect / Monolith / Microservices, 4 rows (Deployment, Scaling, Fault isolation, Where it runs on AWS), row icons; AWS cells carry marks (Elastic Beanstalk, EC2 | ECS, EKS); **`Fault isolation` row highlighted** (the TR asks); note `Scaling only the busy service costs less than scaling an entire monolith to handle one bottleneck` |
| T13 | points | 13 | lead; 4 points; figure (Visual Guidance): a monolith box splits along dashed lines into `Orders`, `Payments`, `Inventory`, each with its own small database; point 2 another service reaches the data through the service's API (tick), a dashed faded path straight to its tables ends in an orange cross; point 3 tight links inside a service, one thin link across; point 4 a bounded-context outline round each; loop: requests ride the API wires |
| T14 | points | 14 | lead; bullets 1-2; figure (Visual Guidance, second half first): sync, service A calls service B (`REST` / `gRPC`) and waits (hourglass) for the reply; async, service A drops a message onto a queue and carries on, service B reads it later; loop: both lanes run at their own pace |
| T14-B | points | 14 | same kicker and title; bullets 3-4; note `These communication choices shape how a container-orchestration platform routes traffic between running service instances`; figure (Visual Guidance): client → API Gateway → fan-out to several service boxes; one service drops a message onto SQS (SNS beside it) for another to read later; loop: requests fan out, messages queue |
| S-QUIZ-1 | quiz | | mid-deck quiz (questions in notes, drawn from sections 1-3) |

Section 4 · Statelessness
| id | layout | TR | content and figure |
|---|---|---|---|
| D4 | breaker 4 | | |
| T15 | points | 15 | lead (three sentences); bullets 1-2; figure (Visual Guidance): left a stateless tier (web front end, API tier, Lambda) where any instance serves any request; right a stateful store box with a persistent identity badge (relational database, message queue, legacy session store); point N lights side N; loop: requests land on a different stateless instance each time |
| T15-B | points | 15 | same kicker and title; bullets 3-4; figure: a stateless instance is removed and another serves the same request; a stateful node restarts and its replica with the same identity badge takes over; loop: replace and fail over |
| T15-AN | analogy | 15 | **hotel receptionists**, 3D: hotel A, three receptionists share one central computer screen and a guest is helped by whoever is free; hotel B, a guest walks past free receptionists to wait for the one who knows her ↔ concept, 3D: requests go to any instance that reads one shared store; a sticky request waits for the one instance holding its state |
| T16 | points | 16 | lead; 4 points; figure (Visual Guidance): compute instances in the centre with elbow wires out to four backing services: cache (ElastiCache), database (DynamoDB, RDS), object storage (S3), config store; point N lights service N; loop: data rides out of the instances |
| T17 | points | 17 | lead; bullets 1-2; figure (Visual Guidance): a timeline, instance A (`i-0a1b2c3d4e5f67890`, `10.0.1.15`) fails its health check on `8080` (orange cross), Auto Scaling launches instance B (`i-0f9e8d7c6b5a43210`); both on wires to one shared Redis cache box (ElastiCache for Redis mark); loop: the health check pulses |
| T17-B | points | 17 | same kicker and title; bullets 3-5; the same figure with A's failure and B's launch already drawn: point 3 the session key `sess_7f3a2b` with its `30-minute TTL` in the cache; point 4 B reads it; point 5 the user's laptop stays logged in (tick); loop: requests reach B and read the key |
| T18 | lead | 18 | lead; figure (Visual Guidance: "comparison table rendered as a simple side-by-side card layout"): two cards, `Stateless Tier` left and `Stateful Component` right, the four dimensions (Scaling, Failure recovery, Typical services, Design cost) as matching rows with their icons, the TR cell text inside; rows build one per press; note `Removing state from compute lets every instance be treated as interchangeable, the assumption the scaling and resilience patterns build on directly` |

Section 5 · Scalability & Resilience Patterns
| id | layout | TR | content and figure |
|---|---|---|---|
| D5 | breaker 5 | | |
| T19 | points | 19 | lead; bullets 1-2; figure (Visual Guidance): client request → load balancer → cache → queue → service box, with `Retry`, `Circuit Breaker` and `Fallback` attached to the service; point 1 lights the load balancer and its instances; point 2 the cache and queue; loop: a request rides the path |
| T19-B | points | 19 | same kicker and title; bullets 3-5; the same figure with load balancer, cache and queue drawn: point N lights `Retry`, `Circuit Breaker`, `Fallback`; loop: the lit pattern walks 1 → 3 → 1 |
| T20 | points | 20 | lead; bullets 1-3; figure (Visual Guidance): three identical server tiles behind a load balancer tile; point 1 one large server gives way to the three; point 2 one tile greys out and a new one appears beside it; point 3 a shared state store under all three; loop: requests spread, one tile is swapped |
| T20-B | points | 20 | same kicker and title; bullets 4-5; figure: an Auto Scaling group behind Elastic Load Balancing adding an instance; point 5 an instance-hour coin stack rises beside a fault-isolation shield; loop: scale out and in |
| T21 | points | 21 | lead; bullets 1-2; figure (Visual Guidance): client → cache with a hit branch back and a miss branch to the database; a producer → queue → worker lane, each side moving at its own pace; loop: reads hit or miss, messages pile and drain |
| T21-B | points | 21 | same kicker and title; bullets 3-4; the same figure with the ElastiCache and SQS marks on the cache and queue; point 4 backend reads drop when the cache answers, and the producer keeps sending while the worker catches up; loop as T21 |
| T21-AN | analogy | 21 | **supermarket**, 3D: frequently bought items on a rack right at the checkout, a shopper picks one without walking the aisles; at busy hour shoppers stand in an orderly line at the cashier instead of crowding her ↔ concept, 3D: an app reads popular data from a cache beside it; requests wait in a queue and a worker takes them one at a time |
| T22 | points | 22 | lead; 4 points; figure (Visual Guidance): a timeline bar, a request, a timeout boundary, a failed attempt, then longer-spaced retries (exponential backoff) with a jitter marker; point 3 an idempotency key on a payment request, a repeat charged once (tick) beside a repeat without one charged twice (orange cross); point 4 an AWS SDK tile applying the backoff; loop: the attempts replay with growing gaps |
| T23 | points | 23 | lead; 4 points; figure (Visual Guidance): state diagram, `Closed` → `Open` once failures cross a threshold, `Open` → `Half-Open` after a wait, `Half-Open` → `Closed` or `Open`; point N lights state N (the breaker switch drawn in each state); point 4 a caller's thread and connection pool kept free; loop: the cycle walks |
| T23-AN | analogy | 23 | **household electrical breaker**, 3D: a home distribution board; a faulty appliance sparks, the breaker trips and the room's power cuts before the wiring burns ↔ concept, 3D: a caller service sends calls to a failing service; a breaker switch on the line trips open and calls stop at it |
| T24 | points | 24 | lead; 4 points; figure (Visual Guidance): side-by-side screens, a full product page against a degraded page missing the recommendations widget but keeping core content; point 1 a cached-data tile fills a failed call; point 2 the widget switches off under load; point 3 partial content beats an error page; point 4 a breaker tile triggers the fallback path; loop: the widget slot dims and the page stays |
| T25 | points | 25 | lead; bullets 1-3; figure (Visual Guidance): a horizontal timeline, `Call`, `Timeout`, `Retry`, `Breaker Open`, `Fallback`, each tagged with its time value (`3-second`, `500ms`, `5 Failures`, `30 Seconds`); point N lights step N |
| T25-B | points | 25 | same kicker and title; bullets 4-6; the same timeline with steps 1-3 drawn: point 4 the failure count rising, point 5 the breaker opening with its 30-second block, point 6 the fallback message with the cart kept; loop: a lit step walks the timeline |

Closing
| id | layout | content |
|---|---|---|
| S-QUIZ | quiz | the closing quiz frame (questions in notes, whole session) |
| S-TAKEAWAYS | takeaways | the five agenda titles |
| S-NEXT | next | Building with Containers (the TR's `Upcoming Session`) |
| S-THANKS / S-BEST | thanks | Thank You · All the Best |

## Coverage check (every TR item → slide)

| TR | item | slide(s) |
|---|---|---|
| Recap / Agenda | 5 titles each (sub-lines in notes, R5) | S-RECAP, S-AGENDA, D1-D5 |
| 1 | Content; 3 bullets; analogy; guidance; notes | T01 / T01-AN |
| 2 | Content; 5 bullets; closing line; guidance; notes | T02 / T02-B |
| 3 | Content; 4 bullets; guidance; notes | T03 / T03-B |
| 4 | Content; 3 bullets; closing line; guidance; notes | T04 |
| 5 | Content; 4 bullets; analogy; guidance; notes | T05 / T05-B / T05-AN |
| 6 | Content; 5 bullets; guidance; notes | T06 / T06-B |
| 7 | Content; 5 bullets; guidance; notes | T07 / T07-B |
| 8 | Content; 5 bullets; guidance; notes | T08 / T08-B |
| 10 | Content; 3 bullets; guidance; notes | T10 |
| 11 | Content; 3 bullets; analogy; guidance; notes | T11 / T11-AN |
| 12 | Content; table; closing line; guidance; notes | T12 |
| 13 | Content; 4 bullets; guidance; notes | T13 |
| 14 | Content; 4 bullets; closing line; guidance; notes | T14 / T14-B |
| 15 | Content; 4 bullets; analogy; guidance; notes | T15 / T15-B / T15-AN |
| 16 | Content; 4 bullets; guidance; notes | T16 |
| 17 | Content; 5 bullets; guidance; notes | T17 / T17-B |
| 18 | Content; table as cards; closing line; guidance; notes | T18 |
| 19 | Content; 5 bullets; guidance; notes | T19 / T19-B |
| 20 | Content; 5 bullets; guidance; notes | T20 / T20-B |
| 21 | Content; 4 bullets; analogy; guidance; notes | T21 / T21-B / T21-AN |
| 22 | Content; 4 bullets; guidance; notes | T22 |
| 23 | Content; 4 bullets; analogy; guidance; notes | T23 / T23-AN |
| 24 | Content; 4 bullets; guidance; notes | T24 |
| 25 | Content; 6 bullets; guidance; notes | T25 / T25-B |
| Key Takeaways / Upcoming | 5 titles / Building with Containers | S-TAKEAWAYS / S-NEXT |

## Narrative and pedagogy

The TR's order is the deck's order. Section 1 states the three principles (elasticity, failure, change) and gives
each its own slide, so the room has the *why* before any rule. Section 2 is the rulebook that makes those principles
hold in code: config and backing services (portability), processes and disposability (elasticity), logs as streams
(what survives a disposed process), closing on the disposable, scalable unit. Section 3 asks how many units make one
system: monolith against microservices, the cost table, where to cut, how the pieces talk. Section 4 isolates the one
property every later pattern depends on, statelessness, traced through a real instance swap. Section 5 is the
toolbox: the map of five patterns, each pattern on its own, and one checkout call traced through all of them.

Every term arrives before it is used: elasticity and Auto Scaling (T01-T02) before disposability (T07); stateless and
stateful named in T02-B before their full treatment (T15); backing services (T06) before externalizing state (T16);
the queue (T06-B, T14) before queues as a resilience tool (T21); the load balancer (T02) before horizontal scaling
(T20); retries and timeouts (T22) and the circuit breaker (T23) before the trace that combines them (T25).

Analogies (6), each two real-time 3D scenes with no text: traffic signal (T01), travel checklist (T05), school office
(T11), hotel receptionists (T15), supermarket (T21), household breaker (T23).

## Build

All text into `deck.json` (generated once from `tr.txt` by a scratchpad script, then `deck.json` is the source) and a
`stubs.tsx` placeholder for every custom figure. New icon names and the new official marks go into the engine module
and `slide-kit/assets/` FIRST, before any figure is drawn. Technical figures on `@/engine/icons3d` + `@/engine/figkit`
(references: Session 15 `custom/a.tsx`-`d.tsx`, Session 16 `custom/a.tsx`-`d.tsx`). Forked builders on private
copies (`deck.mjs dev` on their own ports, never `build`), each owning one custom file: section 1 (`a`), section 2
(`b`), section 3 (`c`), section 4 (`d`), section 5 T19-T21 (`e`), section 5 T22-T25 (`f`), and the six 3D analogies
over three files (`h` T01 + T05, `i` T11 + T15, `j` T21 + T23). Merge, `build`, `check` 0 FAIL 0 WARN, `perf` 0
FAIL, Firefox PASS, every slide screenshotted from the built file at step 0, mid-build and held, and read for
padding, overlaps, overflow, arrow ends, crowding and plain spots before reporting.

## Questions at sign-off

1. Sign off the plan as written?
2. Title slide: the TR's first line reads `Session 18 : Cloud-Native Application Design`, the PDF and the course list
   say `Cloud-Native Applications`. Proposed: `Cloud-Native Applications` (matches the course site), the TR's
   wording in the notes.
3. TR 11's speaker notes say "using the kitchen-versus-food-court picture", but the TR's analogy is the school office.
   Proposed: the analogy slide shows the school office (the TR's analogy text), and the notes stay verbatim.

## As built (2026-11-20)

58 frames, as planned. `/home/nxtwave/Desktop/webslides/Outputdecks/cloudcomputing/cloud_native_applications/dist-single/cloud-native-applications.html`
(6.87 MB, self-contained). `check` 0 FAIL, 2 WARN (`stdout` kept lower case as the stream's literal name; the TR's own
`Trade-offs` and the next session's `Building with Containers` casing). `perf` 0 FAIL, 1 WARN (slide 7's 3D scene held
one frame 367 ms on arrival at x4 CPU); pristine OK; Firefox 0 FAIL 0 WARN, all 12 3D canvases draw. Every slide
screenshotted held from the built file and read; builders shot step 0, every press and the loop of their own slides.
- **Changes from the plan:** 13 overlong TR bullets split at their own clause boundary into two points sharing one
  build step (letter case of the second half only; words checked unchanged by script): T03, T04, T05 (two), T05-B,
  T06, T06-B, T15-B, T17, T19-B, T21-B, T22, T25-B. T25-B's drawn fallback message is `Checkout Busy / Try Again
  Shortly` (capitals, no comma at the line break). T11-AN dropped the student and the visitors at the admissions and
  exams offices so people stay about 130 px tall. T12 table at size 17 with tuned column weights. Point icons swapped to
  the figure's own mark: T02 point 1 (Auto Scaling group mark), T15 point 2 (RDS).
- **Known and accepted:** in T21-AN a leaving shopper passes in front of the cashier for about 0.6 s per loop; T23
  point 2's `ban` icon is the engine's red in the points list while the figure tints it orange; the engine's `cross`
  icon was turned red by an uncommitted edit of unknown origin, so every builder drew its own orange failure cross.
- **Engine changes this build (uncommitted, shared):** 12 icons in `src/engine/icons3d.tsx` (queue breaker stopwatch
  terminal rocket cart api cube cubes dice power heartbeat) + an `IsoCube` primitive. Nothing else in the engine.
- **Custom files:** `a.tsx` (S1), `b.tsx` (S2), `c.tsx` (S3), `d.tsx` (S4), `e.tsx` + `f.tsx` (S5; f imports e),
  `h.tsx` (traffic signal, travel checklist), `i.tsx` (school office, hotel receptionists), `j.tsx` (supermarket,
  household breaker), `clock.tsx` (Session 16's shared analogy clock).

## Review round 1 (2026-11-20, user's five edits)

1. Slide 4 agenda: point 5 fits two lines at the same 22 px. Engine option `meta.agendaWeights` (opt-in, default equal;
   `types.ts`, `render.tsx`, `figures/variants.tsx`): columns 1, 1, 1, 0.865, 1.135, label `Scalability &\nResilience Patterns`.
2. Slide 7 everyday: the traffic model let a lane-changing car drive through the stalled car (warm-up bug). Fixed, and
   the main road's lanes widened (centres 0.42 to 1.0 apart) so no two cars overlap ON SCREEN either: 541 frames, 0
   projected overlaps, min gap 3 px at 1280x720. Side effects: stalled car drives on at 5.7 s (was 4.9), cross road two
   cars per loop (was three), signal and roadside trees set back; concept request lane widened to match.
3. Slide 16 everyday: cab at real size (roof a little above the traveller's shoulder) parked outside the door; map moved
   left clear of the doorway; concept shelf moved left by the same amount, its deploy arcs re-routed.
4. Slide 39: header icons on both cards (`cubes` stateless, `database` + `idcard` stateful); the note box blue
   (background, border, shadow) via NoteBox's blue variant.
5. Slide 50 everyday: the homeowner's beard removed (`beard: 'none'`), nothing else.
Verified: a held-frame diff against the previous build changed slides 4, 7, 16, 39, 50 only. check 0 FAIL 2 WARN;
perf 0 FAIL 2 WARN (slide 7 arrival 450 ms at x4, slide 37 idle 8%, an unchanged slide); Firefox PASS.
