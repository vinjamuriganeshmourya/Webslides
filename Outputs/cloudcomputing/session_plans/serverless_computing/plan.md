# Serverless Computing · slide-wise plan

STATUS: signed off by the user, 2026-11-10 ("Signed off, build"; TR 14 duplicate bullet dropped; TR 19 guidance drawn as written)

- **Session:** cloud computing session 10, `Outputs/cloudcomputing/serverless_computing/`, built with `deck-engine/`
  (`node deck.mjs build|check ../Outputs/cloudcomputing/serverless_computing`). Dev port 5280.
- **Series match:** Session 9's as-built state after its round-3 review (`elastic_compute_instances`): `deck.json` +
  `custom/*.tsx` merged in `custom/index.tsx` (stubs first) + `images/` + `captures/`; lab frames `L_Shot` / `L_Steps`
  copied from Session 9's `e.tsx`; analogy scenes on the engine's `@/engine/three-stage`.
- **Source (content):** `Reference ppt's/10_Serverless_Computing.pdf` (19 pages), extracted to `tr.txt` beside this
  plan. TR slide N is "TR N". The TR numbering skips 23 (no text missing); TR 12 carries a second, unnumbered slide
  ("Warm Start Reuse"), built as its own frame T12-C.
- **Screenshots (6):** TR 25 function-created banner + code editor, TR 26 test event form + successful run, TR 27
  first and later invocation summaries. Extracted unchanged to `captures/`, served from a 2x Lanczos + light unsharp
  copy in `images/` (course R4), identifiers blurred in the PNG (rule 53: Function ARN, Request ID, Code SHA-256).
  Originals also in `Outputs/cloudcomputing/workflow/captures/session10-originals-2026-11-10/`.
- **Official marks (rule 54), from the AWS package (release 07312026) into `slide-kit/assets/aws/`:** Lambda (service +
  Lambda Function resource), API Gateway, DynamoDB, Aurora, Cognito, S3, IAM role, CloudWatch Logs, EC2 / EC2 Instance
  (already there). Python mark from Session 9's `images/python.svg`.

## Session 9 inputs built in from the first draft (standing corrections 1-14, course R1-R11)

Everything the user asked across Session 9's three review rounds, so none of it comes back:

| Session 9 review said | Built into Session 10 as |
|---|---|
| Visuals too wordy: chips, number badges, connector labels | Icon-first technical visuals; a 1-3 word label only where an icon alone is ambiguous; no chips, badges or line labels |
| Visuals too static | Every visual and every icon carries a quiet loop / micro-animation after its build (pulse, bob, flow dot, flip) |
| Analogies were isometric clay rooms with numbered tag pairs | Every analogy is a real-time 3D scene (`@/engine/three-stage`, one shared renderer), perspective camera, no text on either card, at most one small tag above a visual |
| Modelled primitive people | Character Lab characters via `castSprite`, each an individual, role clothing, facial expressions synced to the action, minimal joints for standing roles; the asset PNG where the rig has no pose (seated user with laptop) |
| Heads through the car roof, overlapping bakers, purposeless rods | Every enclosure checked against the people in it (taxi, stall, gaming booth, hotel room), one body-width between people, no prop without a job |
| 4 s rest between loops | Every analogy loop 3-9 s, restarts within 0.3 s, seamless, wall-clock, 60 fps in headed Chrome |
| Wrapper card round a card pair; text on borders | No wrapper card; equal padding on all four sides; inner padding matches the parent |
| Slider overshot into Max | The memory slider on T16-B: standard ease, clamped, dragged to both ends in Chrome |
| Rings off their line on a dense capture | Rings inside the capture, on their line only (`ringInset` where dense) |
| `Scene shift` pushed stages past their group; points over two lines | No shift on analogy stages; `pointsW` or a TR clause split for any point over two lines |
| Correction rounds checked by eye | `check` 0 FAIL, every slide screenshot from the built file and read; later rounds verified by pixel diff |

## Text policy (binding, same as Session 9)

1. Kicker = the TR `Heading`, title = the TR `Subheading`. The TR `Content` paragraph is the `lead` (one sentence per
   line); bullets are points / steps; tables are tables; captions are the screenshot explanation boxes.
2. Allowed edits are punctuation, letter case and layout only: ` — ` becomes `: ` (no em dash); no mark ends a line
   (rule 36); figure labels capitalise every word (rule 56); first letter of a line capitalised (R8.4) except
   identifiers kept in code form (`event`, `context`, `/tmp`, `statusCode`, `s10-serverless-demo`). Every word stays.
3. Too long → split at the TR's sentence or clause boundary; a slide with too much becomes two frames with the same
   kicker and title.
4. Speaker Notes → `notes`, verbatim. Visual Guidance → the figure spec. Analogy → its own analogy slide (R10: kicker,
   title, two 3D scenes, no text); the TR analogy sentence in `notes`.
5. Figure labels use only TR words. No invented numbers, prices or addresses (the analogy scenes show no digits).
6. Recap, agenda and takeaways carry the five titles only (R5); breakers the title only. Sub-lines in `notes`.

## Deck (59 frames)

Opening
| id | layout | content |
|---|---|---|
| S-WELCOME | brand | |
| S-TITLE | title | Serverless Computing (R9) |
| S-RECAP | recap | previous: Elastic Compute Instances; its five titles |
| S-AGENDA | agenda | the five titles |

Section 1 · Serverless Basics
| id | layout | TR | content and figure |
|---|---|---|---|
| D1 | breaker 1 | | |
| T01 | points | 1 | lead (Content); 4 points; figure: a `Serverless` umbrella over two boxes, FaaS (Lambda mark, lightning trigger) and BaaS (database, lock, folder icons), one shared crossed-server strip beneath both labelled `No Server To Manage`; the provider's patch / capacity icons lit for points 3-4, a code file for point 4 |
| T01-AN | analogy | 1 | **taxi**: a passenger at a kerb hails a taxi, rides, the dashboard meter runs only during the ride, pays and walks off; no car, garage or servicing of her own ↔ a request reaches a Lambda function that appears on the provider's racks, runs while a meter ticks, and is gone; the user (boy with laptop) owns no server |
| T02 | points | 2 | lead; 3 points; figure: a sketch of the Lambda console function page (Lambda mark, `s10-serverless-demo`), with the instance-type and OS-patch rows struck through (`No Instance Type`, `No OS To Patch`); patch gear turning on the provider side, capacity blocks appearing per invocation, idle meter at zero |
| T03 | points | 3 | lead; 4 points; figure: two lanes on one time axis: an always-on server as one flat continuous bar, a function as short isolated spikes at each event (event bolt drops in, spike, gone); the cost line tracks the spikes |
| T03-B | table | 3 | the TR 3 table: Invocation / Duration / Init Duration, 2 rows (no row highlight) |
| T04 | table | 4 | lead; Aspect / Elastic Compute Instance / FaaS Function, 3 rows |
| T04-B | lead | 4 | figure only: one continuously running EC2 instance (EC2 mark, steady pulse, meter always running) beside several small function boxes (Lambda function mark) flashing only when an event arrives, each meter ticking only during its flash |

Section 2 · The Execution Model
| id | layout | TR | content and figure |
|---|---|---|---|
| D2 | breaker 2 | | |
| T05 | lead | 5 | lead; figure: four cards in a row, Trigger/Event, Handler Contract, Stateless Execution, Concurrency, each an animated icon with the TR bullet inside the card (standing correction 14, one card per TR item) |
| T06 | points | 6 | lead; 4 points; figure: `event` (JSON document) and `context` (ID tag + timer) arrows into a `handler` box, one return-value arrow out to the response; `file.function` name plate on the handler for point 4 |
| T06-AN | analogy | 6 | **service counter**: a visitor hands a filled form to the clerk, a token slip with the token and a time-left dial reaches the clerk too, the clerk writes the reply and hands it back ↔ an event document and a context slip enter the handler, the return value travels back to the caller |
| T07 | points | 7 | lead; 4 points; figure: a caller (API Gateway mark) with two arrows into the handler: `Sync` (hourglass, the caller waits for the reply) and `Async` (S3 upload into a queue, an acknowledgement tick back at once); a batch of records gathered into one event for point 4 |
| T08 | points | 8 | lead; 4 points; figure: two environment boxes side by side, each with one invocation; a crossed-out arrow between them (`No Shared Memory`); a counter variable resetting to zero in the second; data written out to a database icon; a duplicate event absorbed once (idempotent) |
| T09 | points | 9 | lead; 4 points; figure: three parallel environment boxes stacked, each running one invocation; a limit line; a fourth attempt bounced as throttled (429 on the sync path, a retry arrow on the async path); a reserved slice of the pool for one function |

Section 3 · Cold Starts & Warm Starts
| id | layout | TR | content and figure |
|---|---|---|---|
| D3 | breaker 3 | | |
| T10 | points | 10 | lead; 4 points; figure: Cold path (New Environment → Init → Invoke → Response) above a Warm path (Reused Environment → Invoke → Response), same end point; a request dot rides each; an idle environment fading out for point 4 |
| T11 | points | 11 | lead; 4 points; figure: four icons (first call, traffic spike, idle clock, new deploy), each pointing into one `New Environment Built` box, lit per point |
| T11-AN | analogy | 11 | **food stall**: the stove is off with no customers; an order arrives, the cook lights it and heats the pan while the customer waits; the next customer's order goes straight onto the hot pan ↔ a request with no ready environment waits while one is built (init), then a request on the warm environment runs at once |
| T12 | table | 12 | lead; Phase / What Happens / Reported As, 2 rows |
| T12-B | points | 12 | 3 points; figure: one horizontal bar split Init \| Invoke, a dashed line where a warm call starts; the environment freezing (snowflake) after invoke, ready for reuse |
| T12-C | points | 12b | kicker Warm Start Reuse, title What Carries Over; lead; the 3 lines as points; figure: an environment's memory holding global variables, SDK client, DB connection and `/tmp` files, carried from one invocation into the next; the client built outside the handler |
| T13 | points | 13 | lead; 5 points; figure: five small icon boxes in a row (provisioned concurrency, smaller package, lighter dependencies, warm-up calls, faster runtime) under a `Lowers Init Time` arrow into a latency bar that shrinks as each lights |

Section 4 · Limits & Constraints
| id | layout | TR | content and figure |
|---|---|---|---|
| D4 | breaker 4 | | |
| T14 | points | 14 | lead; bullets 1-3 verbatim (the duplicate bullet 4 dropped, user 2026-11-10); figure: four boxes Timeout, Memory, Payload, Ephemeral Storage, each with a limit icon (stopwatch, RAM gauge, envelope with a size cap, disk filling to a line) |
| T15 | points | 15 | lead; 4 points; figure: a timeline bar: invocation start, running, a red cutoff line at timeout; default 3 s marker, the 15-minute maximum; a `Task Timed Out` stop |
| T15-AN | analogy | 15 | **gaming zone**: a player mid-level at a booked station, the booked-time ring running down, the screen switches off mid-level, the player's shocked face ↔ a function running its work, the timeout line arrives, the run is stopped unfinished |
| T16 | table | 16 | lead; Limit / Range / Value / Note, 4 rows |
| T16-B | lead | 16 | lead: the TR's closing sentence (higher memory raises per-millisecond cost...); figure: a memory slider 128 MB to 10,240 MB with a CPU bar rising beside it and a cost-rate meter (the TR guidance's "small bar beside Memory showing CPU rising with it"); slider clamped, no overshoot |
| T17 | points | 17 | lead; 4 points; figure: an execution environment box with a `/tmp` folder inside, scratch files landing in it, the environment torn down and the folder wiped; a database / S3 mark as the durable place |
| T17-AN | analogy | 17 | **hotel room**: a guest checks out, housekeeping clears the room, the next guest walks into an empty room ↔ an environment's `/tmp` with files, the environment recycled, a fresh environment with an empty `/tmp` |

Section 5 · BaaS & Anti-Patterns
| id | layout | TR | content and figure |
|---|---|---|---|
| D5 | breaker 5 | | |
| T18 | points | 18 | lead; 3 points; figure: left box `BaaS` with database, lock and disk icons; right box `Anti-Patterns` with three workload icons (hourglass long job, heavy-state stack, flat steady-load line) |
| T19 | points | 19 | lead; 3 points; figure as the TR's guidance is written (user 2026-11-10): a phone call going to a hotel reception desk, mirrored by an API call going to a cloud database icon |
| T19-AN | analogy | 19 | **power grid**: a house's appliances plugged into a wall socket, current flowing from pylons; an unused generator shed stays dark ↔ an application calling a managed database, a login check and a file store (DynamoDB, Cognito, S3) over the API, owning no backend server |
| T20 | table | 20 | lead; BaaS Category / AWS Service / What It Replaces, 3 rows, each row with its official mark |
| T20-B | lead | 20 | lead: the TR's "common thread" sentence; figure: an application icon with three arrows to DynamoDB, Cognito and S3, one `Direct API Call` label, request dots riding each |
| T21 | points | 21 | lead; 2 points; figure: a taxi meter ticking (`Per-Ride Cost`) beside a parked owned car (`Fixed Cost`) |
| T21-AN | analogy | 21 | **daily commuter**: the same fixed route every day, one commuter paying per taxi ride (coins stacking up ride after ride), one driving their own car (one flat cost) ↔ a constantly invoked function billed per run (coins stacking) beside an always-on server at a flat rate |
| T22 | table | 22 | lead; Anti-Pattern / Why Serverless Fails / Better Fit, 3 rows, the Better Fit column in three distinct colours (TR asks for it) |
| T22-B | lead | 22 | lead: the TR's closing sentence (reserved compute beats per-invocation pricing...); figure: cost against utilisation, a rising per-invocation line and a flat reserved line crossing; the crossing drawn as a band (break-even varies), `40%` marked as a rough guide |
| S-QUIZ1 | quiz | (23) | quiz frame, at the TR's numbering gap before the practical |

Practical · Deploying a Lambda Function and Observing Cold and Warm Starts
| id | layout | TR | content and figure |
|---|---|---|---|
| D-LAB | breaker lab | | the practical title |
| P01 | custom `L_Steps` | 24 | lead; the 5 numbered steps as the zig-zag timeline |
| P02 | custom `L_Shot` | 25 | lead; function-created capture + caption `s10-serverless-demo created successfully`; rings on the success banner and the function box |
| P02-B | custom `L_Shot` | 25 | code editor capture + caption `lambda_function.py in the code editor`; rings on `lambda_handler(event, context)` and the Deploy button |
| P03 | custom `L_Shot` | 26 | lead; test-event capture + caption `Test event s10-test-event being created`; rings on Synchronous and the event name |
| P03-B | custom `L_Shot` | 26 | successful-run capture + caption `Successful run: statusCode 200 and the handler message`; rings on the succeeded line and `statusCode: 200` |
| P04 | custom `L_Compare` | 27 | lead; the two summary crops side by side with their captions (first: Duration 1.96 ms, Init duration 99.72 ms; later: Duration 40.98 ms, no Init duration line), rings on Init duration / its absence; the TR's closing sentence in a note under both |
| P05 | custom `L_Steps` | 28 | the expected result (2 sentences) and the clean-up sentence as a 3-step timeline |

Closing
| id | layout | content |
|---|---|---|
| S-QUIZ | quiz | the last quiz frame |
| S-TAKEAWAYS | takeaways | five titles |
| S-NEXT | next | Cloud Provider Comparison |
| S-THANKS / S-BEST | thanks | Thank You · All the Best |

## Questions for sign-off (answered 2026-11-10)

1. **TR 14 lists "Ephemeral storage" twice and has no Execution timeout bullet**, though the Visual Guidance and the
   section title both name Timeout. Bullet 1 reads "Ephemeral storage: temporary local disk (/tmp), lost when the
   environment is torn down", bullet 4 "Ephemeral storage: temporary local disk cleared after execution".
2. **TR 19's Visual Guidance draws a phone call to hotel reception, but its analogy is the power grid.** The analogy
   slide follows the analogy (power grid). The technical figure on T19 needs a choice. **Answer: draw it as written.**

## Coverage check (every TR item → slide)

| TR | item | slide(s) |
|---|---|---|
| Recap / Agenda | 5 titles (sub-lines in notes, R5) | S-RECAP, S-AGENDA, D1-D5 |
| 1 | Content; 4 bullets; guidance; notes / analogy | T01 / T01-AN |
| 2 | Content; 3 bullets; guidance; notes | T02 |
| 3 | Content; 4 bullets; guidance; notes / table | T03 / T03-B |
| 4 | Content; table; notes / guidance | T04 / T04-B |
| 5 | Content; 4 bullets; guidance; notes | T05 |
| 6 | Content; 4 bullets; guidance; notes / analogy | T06 / T06-AN |
| 7, 8, 9 | Content; 4 bullets; guidance; notes | T07, T08, T09 |
| 10 | Content; 4 bullets; guidance; notes | T10 |
| 11 | Content; 4 bullets; guidance; notes / analogy | T11 / T11-AN |
| 12 | Content; table; notes / 3 bullets; guidance / Warm Start Reuse | T12 / T12-B / T12-C |
| 13 | Content; 5 bullets; guidance; notes | T13 |
| 14 | Content; bullets; guidance; notes | T14 |
| 15 | Content; 4 bullets; guidance; notes / analogy | T15 / T15-AN |
| 16 | Content; table; notes / closing sentence; guidance | T16 / T16-B |
| 17 | Content; 4 bullets; guidance; notes / analogy | T17 / T17-AN |
| 18 | Content; 3 bullets; guidance; notes | T18 |
| 19 | Content; 3 bullets; guidance; notes / analogy | T19 / T19-AN |
| 20 | Content; table; notes / closing sentence; guidance | T20 / T20-B |
| 21 | Content; 2 bullets; guidance; notes / analogy | T21 / T21-AN |
| 22 | Content; table; notes / closing sentence | T22 / T22-B |
| 24 | Content; 5 steps | P01 |
| 25 | Content; 2 captures + captions | P02, P02-B |
| 26 | Content; 2 captures + captions | P03, P03-B |
| 27 | Content; 2 captures + captions; closing sentence | P04 |
| 28 | Expected result; clean up | P05 |
| Key Takeaways / Upcoming | 5 titles / Cloud Provider Comparison | S-TAKEAWAYS / S-NEXT |

## Narrative and pedagogy

The TR's order is the deck's order. Section 1 sets serverless against the instance the room met in Session 9 (what
disappears, compute only on an event, the function as the billed unit). Section 2 opens the function: the map, the
handler contract, what triggers it and how, why it cannot remember, and how many run at once; concurrency's "new
environment per parallel call" is the hook for section 3. Section 3 names cold and warm, the causes, the two phases
(with the TR 3 table's Init column as the evidence) and the mitigations. Section 4 bounds the function (timeout,
memory/payload, `/tmp`), and section 5 steps outside it: BaaS as the code-free half, then the workloads where the
limits and billing from sections 2-4 stop fitting. The practical measures the cold/warm difference the theory
predicted, with the names it introduced (handler, test event, Duration, Init duration).

Analogies (7), each two real-time 3D scenes with no text: taxi (T01), service counter (T06), food stall (T11), gaming
zone (T15), hotel room (T17), power grid (T19), daily commuter (T21). The TR sentence in `notes`.

## Build

I write all text into `deck.json` and a `stubs.tsx` placeholder for every custom figure, then parallel fork builders on
private copies (`deck.mjs dev` on their own ports, never `build`), each owning one custom file: technical figures in
three files by section, the seven analogies over two files, the lab frames + captures in one. Merge, `build`, `check`
0 FAIL 0 WARN, every slide screenshot from the built file and read, 3D slides measured at 60 fps in headed Chrome.

## As built (2026-11-10)

59 frames as planned. `custom/a.tsx` (sections 1-2), `b.tsx` (sections 3-4), `c.tsx` (section 5 + `L_Compare` for P04),
`e.tsx` (L_Shot / L_Steps from Session 9), `h.tsx` (3D: counter T06, food stall T11, gaming zone T15), `i.tsx` (3D: taxi
T01, hotel T17, power grid T19, commuter T21, one shared taxi model), `stubs.tsx` (placeholders, all overridden).
Edits after the first build: T06 point 3 split at its `;` into two lines lit together (was 3 lines); P02-B, P03 and
P03-B served from crops of their captures so the text reads; P04's later capture is a real crop file; analogy slides
16 / 23 / 31 take 2 presses; slides 16 and 43 reframed after review. `node deck.mjs check` 0 FAIL, 0 WARN; every slide
screenshotted (held + live) and read; all seven 3D slides 60 fps on the Intel GPU (Chrome, ANGLE Vulkan).

## Correction round 1 (2026-11-10, user's pasted list)

Global rules recorded as generate-slides standing correction 15 / course R12 / FIG-35 (user's yes). Engine: table icons
animate (`cvx-ticon`), `ThreeStage` renders at real device pixels up to 4K, `castSprite` 480 px default. Slides changed:
6 (icons no longer overlap), 7 (passenger seated inside the taxi), 10/11/24/32/40/44 (table icons animate), 14 (orange
border cycles 1-4 forever, one icon effect for all four), 16 (new Character Lab customer, spring physics), 23 (stall
overlaps removed), 31 (boy seated at a cocktail arcade table; wider frame for the shrug), 39 (real house), 43 (one car
split Rented/Owned with coin piles, user-requested labels), 49-53 (whole TR captures, contain, rings re-measured; P03
lead in the side column; P03-B one ring on the Response box). check 0 FAIL 0 WARN.
