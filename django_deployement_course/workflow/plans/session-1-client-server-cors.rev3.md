# Slide plan — Session 1: Client–Server & CORS

> **SUPERSEDED — canonical plan is now `session-1-client-server-cors.plan.json` (Rev 4,
> re-checked against TR doc rev 2026-07-16 15:20).** This markdown narrative is kept as
> Rev 3 background reading; where they differ, the JSON wins.

**STATUS: AWAITING SIGN-OFF** — no generation until approved.
Rev 3 — re-planned against the **rewritten TR doc (2026-07-16 15:10, mission-narrative
version, 8 sections)**; integrates all three verification reports (rules 10/10 PASS;
house-style pacing/quiz fixes; doc-fidelity fixes: dropped the Django-internals
flowchart, corrected the restaurant rows, status codes, and same-origin table, added
the crack-in-the-wall teaser, Network-tab moment, localhost note, CORS definition).

| Common input | Value |
|---|---|
| SESSION_NAME (footer on every slide) | `Client–Server & CORS` |
| COURSE | `React + Django Integration` |
| TR_DOC | `Integration project/docs/session-1.md` (rev of 2026-07-16 15:10) |
| SESSION_CODE | `Integration project/session-1/{prefilled,final}` (built & verified; still matches the doc's §2/§6/§7 steps) |
| NEXT_UP | `Session 2 — the API contract & JWT login` |

## Concept map (doc's own agenda: 4 concepts, arriving when the mission needs them)

| # | Concept (analogy) | Taught in | Divider |
|---|---|---|---|
| 1 | Client–Server model (restaurant) | §3 | D2 |
| 2 | Origin (flats in one building) | §5 phrase 1 | D3 |
| 3 | CORS (security guard at the gate) | §4–§6 | D3 |
| 4 | Base URL & env variables (one saved contact) | §7–§8 | D4 |

D1 covers the mission + setup (§1–§2) before any concept. Dividers are the doc's
mission phases; the agenda lists the four concepts, exactly as the doc's own
agenda table does.

## Assets

| Asset | Type | Status | Slide(s) |
|---|---|---|---|
| NxtWave logo (`public/assets/logo-nxtwave.png`) | brand | exists | 1 |
| `TwoApps` — React `:3000` → apis.ccbp.in; Django card "runs, nothing calls it" (**tweak: drop the `:8000` port label** — pre-setup Django isn't on 8000 yet, doc §2) | custom animated visual | exists, small edit | 4, 5 |
| `concept-api` (browser ↔ server exchanging request/response) | in-repo illustration | exists — topical for Concept 1 | 10 |
| Network-tab capture (real DevTools row: GET …/products, 200, JSON) | real screenshot — **to attempt** | attempt; fallback = the doc's 4-row meaning table as styled rows | 11 |
| `AnalogyMap` | custom component | exists | 12, 22 |
| `RequestFlow` (GET → / 200 OK ← looping packets) | custom animation | exists, verified | 13 |
| `django-json-200.png` (DRF page: HTTP 200 + product JSON) | real screenshot | captured & verified | 15 |
| **`CorsGate`** (guard between arriving response and page; allow-list `:3000 ✓ / :5500 ✗`) | custom SVG — **to build** | build | 16 |
| CORS-error console capture (real, prefilled state) | real screenshot — **to attempt** | attempt; fallback = doc-verbatim styled error block | 18 |
| Annotated error graphic (3 phrases → 3 questions, styled code callouts) | in-house styled block | build (markup, not an image) | 19 |
| **`EnvConfig`** (one `.env` card feeding every request pill) | custom SVG — **to build** | build | 26 |
| `products-from-django.png` | real screenshot | captured & verified | 30 |
| Nova mascot poses (quiz / recap / practice / feedback) | same-type fixtures | allowed reuse (fixtures only) | 25, 31, 33–35 |

Freepik/external: none planned; any need goes through manifest + per-download approval.

## Checkpoint rhythm

Predict moments at **17** (what will the browser do?) and **21** (same-origin table)
≈ mid-deck; quiz at **25** (:5500, doc §6 predict 2); recall quiz at **31** (Postman,
doc §6 predict 1). Session-2 teaser = slide **32** (the doc's own "crack in the wall"),
before the user-mandated close frame (Takeaways → Practice → Feedback → Thank You);
Thank You carries a one-line `nextUp`.

---

## Slides (36)

### Open

**1 · brand** — NxtWave branding only. New `BrandSlide`: night/brand background, large logo, course name. Footer off (logo would repeat). Fade-in.

**2 · welcome** — kicker "WELCOME TO TODAY'S SESSION" + title **Client–Server & CORS**. Nothing else in the body (fixes the double logo: body logo/course/presenter/meta removed; footer alone carries it). Zoom.

**3 · agenda** — **"Today's Agenda"** — lead = the doc's mission line: *"by the end, the products page renders products served by our own Django backend."* Then the doc's 4 concepts (with analogies), numbered, click-revealed:
1. Client–Server model — *a restaurant*
2. Origin — *flats in one building*
3. CORS — *the security guard at the gate*
4. Base URL & environment variables — *one saved contact*

### D1 — The Mission (§1–§2)

**4 · divider** — "The Mission — Our Products, Not Theirs". Visual: **TwoApps** (tweaked) — precisely the state the doc opens on. Cover transition.

**5 · two-apps** — "Every product on screen comes from someone else's server" — animated TwoApps; connector lands last. Django "runs perfectly… and nothing calls it."

**6 · one-line-plan** — "The plan writes itself" — the hardcoded `apis.ccbp.in` line (code) + the doc's quote: *"Find that URL. Replace it. One line. Five minutes."* + lead-out: first, a boring obstacle.

**7 · port-rule** — "Both want port 3000" — the doc's rationale (manage.py defaults runserver to 3000 = Vite's port) → rule: **backend 8000, frontend 3000**, always `runserver 8000`.

**8 · rename** — "A real name first" — ProceduralSteps, the doc's 4 places (folder / manage.py / settings.py / wsgi+asgi), click-revealed.

**9 · prove-it** — "Two servers up" — terminal code (`runserver 8000` boots clean; `grep -rn "myproject" .` → nothing) + checkpoint. Lead-out: *"before redirecting a conversation, know what's being said in it."*

### D2 — Read the Conversation First (§3 · 📌 Concept 1)

**10 · divider** — "Read the Conversation First" + Concept-1 badge (restaurant). Visual: `concept-api` — browser↔server conversation, exactly this concept.

**11 · network-tab** — "Don't take it on faith — watch it" — DevTools → Network → reload; one row tells the story. Asset: attempt a **real Network-tab capture**; fallback: the doc's table as styled rows (Method GET = the order placed · URL = which kitchen, which dish · Status 200 = the waiter's verdict · Response JSON = the dish).

**12 · restaurant** — the restaurant analogy — **AnalogyMap, 4 rows** (order→request · kitchen→server · dish→response body · waiter's verdict→status code) with the doc's verdicts as sub-text: `200` "here's your order" · `404` "we don't serve that" · `401` "who's asking?" · `500` "fire in the kitchen". *(No "table" row; only the doc's four codes.)*

**13 · round-trip** — "The page asked. A server answered." — **RequestFlow** loop (GET /api/products/ → 200 OK · JSON). *(Replaces the old Django-internals flowchart — not in the doc.)*

**14 · verbs** — "Our routes will use all the verbs" — GET read · POST create (login, add to cart) · PUT/PATCH update · DELETE remove (doc's own examples).

**15 · django-serves** — "Django serves the same thing at :8000" — **real screenshot** `django-json-200.png`; caption: the endpoint answers 200 + product JSON. Lead-out: *"Time to swap."*

### D3 — The Wall (§4–§6 · 📌 Concepts 2 & 3)

**16 · divider** — "The One-Line Swap… and the Wall". Visual: **CorsGate (build)** — guard between the arriving response and the page, allow-list board. The section's core mechanic.

**17 · swap-test** — "Test the plan — no code edits" — console `fetch('http://localhost:8000/api/products/')` + the doc's setup: Postman returned products for this exact URL. **Predict what the browser does.** (Interactive pause.)

**18 · the-wall** — "Not products. Not a 404." — the verbatim CORS error + the twist: Django's terminal shows `"GET /api/products/ … 200`. Pull-quote: *"The only thing standing between them is the browser itself."* Asset: attempt the real console capture; fallback doc-verbatim block.

**19 · error-map** — "Read it like a detective" — the doc's annotated error: three phrases → three questions (origin? · what policy, who blocks? · what header, present where?). Styled annotation graphic; each phrase click-revealed.

**20 · origin-def** — Phrase 1 · 📌 Concept 2 — **Origin = scheme + host + port**; flats-in-one-building; note: `localhost` and `127.0.0.1` are **different hosts → different origins** ("if Vite prints one and you open the other, expect surprises").

**21 · same-origin** — "Same origin — or not?" — the doc's **3 predict rows, all No** (port differs — *our case* · scheme differs · host differs), revealed row-by-row after the class predicts.

**22 · guard** — Phrase 2 · 📌 Concept 3 — same-origin policy as the **AnalogyMap** (delivery arrives→Django's 200 · guard checks the name→browser checks the header · no name→page never sees data) + the two whys (doc): Postman/`curl` have **no guard** — why Postman always worked; the static API **always left the right name** — why this error never appeared before.

**23 · phrase-3** — "The error names the missing paperwork" — the header lives **on the response** → responses come from servers → **the fix belongs to the server**. CORS definition verbatim: *response headers by which a server declares "pages from this origin may read my responses."*

**24 · cors-fix** — "Teach Django to send the header" — `pip install django-cors-headers` + the 3 settings.py edits (height-capped code) + checkpoint: same fetch → products; response now carries `Access-Control-Allow-Origin: http://localhost:3000`.

**25 · quiz-1** — QuizSlide (fixture): can a page at `:5500` read the API now? Correct: **No — the guard holds a list of names, not an open gate** (doc §6 predict 2). Options visible first; answer on one click.

### D4 — Remove the Shortcut (§7–§8 · 📌 Concept 4)

**26 · divider** — "Remove the Shortcut". Visual: **EnvConfig (build)** — one `.env` card feeding every request: "save the number once."

**27 · contact** — "Save the number once" — the address will change (teammate's machine, deployment); phone-contact analogy; quote: **the API's address is configuration, not code.**

**28 · env-helper** — "`.env` + one helper" — code: `.env` (`VITE_API_BASE_URL`) + `src/api.js`; note = the doc's **two Vite rules**: only `VITE_`-prefixed vars reach the app; `.env` is read once at startup → **restart the dev server**.

**29 · convert** — "The swap from Section 1 — done right" — before/after code in `AllProductsSection` (hardcoded → `apiUrl('/api/products/')`).

**30 · result-live** — **real screenshot** `products-from-django.png` — "Products, served by your Django backend." Caption also carries §8's payoff: one line now re-points local ↔ production; *"the one-line swap turned out to be true after all — just not the line we thought."*

### Close

**31 · quiz-2** — QuizSlide (fixture), recall: "Does the request now work from **Postman**?" Correct: **Yes — it always did; no browser, no guard** (doc §6 predict 1).

**32 · crack** — "A crack in the wall" — the doc's Session-2 teaser, its concrete beats: broken images, blank fields, login dead — yet Network says `200 OK`. Who has the bug? **Neither side**: frontend reads `data.products`, Django sends `data.results`; frontend wants `image_url`, Django sends `imageUrl` — *two correct programs, two languages*. Next: the API contract + JWT. *(House-guide "Next" phase, placed before the mandated close frame.)*

**33 · takeaways** — "Key Takeaways" — lead = the doc's story-so-far through-line (tried the swap → the guard blocked → the error taught origin, policy, header → the server learned to send it → the address moved into configuration). Then the **same 4 agenda concepts**, outcome-phrased, tick-pill UI (different from the agenda's numbered list):
1. Client–Server — the page asks, the server answers; the status code is the verdict
2. Origin — scheme + host + port; any part differs → different origin
3. CORS — the browser guards cross-origin reads until the server allow-lists the origin
4. Base URL — one env var; the address is configuration, not code

**34 · practice** — PracticeSlide (fixture) — the doc's session checklist: backend 8000 / frontend 3000, rename + grep clean · cors-headers app + middleware + allow-list · console fetch returns JSON · `.env` + `api.js`, no hardcoded host · products page renders from Django.

**35 · feedback** — FeedbackSlide (fixture) — standard prompt + link.

**36 · thank-you** — ThankYouSlide — close + one-line `nextUp` (Session 2 — the API contract & JWT login).

---

## Build list (on sign-off)

1. `BrandSlide` (1) · bare-body welcome (2) · footer const → `Client–Server & CORS` · agenda retitled "Today's Agenda"
2. `TwoApps` tweak (drop `:8000` pre-setup) · **`CorsGate`** SVG (16) · **`EnvConfig`** SVG (26) · annotated error-map block (19); register new visuals in the Illustration registry
3. Capture attempts: Network-tab row (11) · CORS console error (18); both have approved doc-faithful fallbacks
4. Remove: Django-internals FlowChart slide (not in the doc)
5. Deck reassembled in this order; verification per workflow stage 6; snapshot after
