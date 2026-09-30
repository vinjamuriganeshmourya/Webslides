# Slide plan — Session 1: Client–Server & CORS

**STATUS: SIGNED OFF 2026-07-24** (decisions ①–② resolved at review; ③–⑤ approved with sign-off).

> **Rev 7 — full re-plan from scratch** against the **rewritten TR doc (2026-07-24, Parts
> A/B version, 10 sections + agenda + 5-concept table; §10 crack-in-the-wall body added
> 2026-07-24 during planning)**. Nothing carried over from Rev 3–5 except reusable assets.
> Supersedes `session-1-client-server-cors.plan.json` (Rev 4/5 — stale) and
> `session-1-client-server-cors.rev3.md` (kept as background).
> QA: 4-lens verification pass (TR fidelity · workflow rules · house style · asset audit,
> adversarially adjudicated); all confirmed findings folded in. Structure re-cut per the
> user's 2026-07-24 review decisions (see below).

**What changed in the TR (why the old plan can't be patched):**

- **Rename segment is gone** — the starter ships pre-configured as `nxttrendz_backend`
  (verified in `session-1/prefilled` on 2026-07-24).
- **Part A is new teaching content**: tools recap (VS Code + Python), **Node installation**
  (LTS, `node -v` / `npm -v`), the starter ZIP, and running both apps.
- **Ports is promoted to 📌 Concept 0** with its own URL-anatomy diagram and the
  port-collision error.
- The session opens with **setup**; the mission ("our products, not theirs") arrives at §5.
- §9 adds *"should that URL live in the code at all?"* — three reasons + `.gitignore`.
- §10 now carries the crack-in-the-wall teaser body (patched during planning, per
  decision ② below).

| Common input | Value |
|---|---|
| SESSION_NAME (footer on every slide) | `Client–Server & CORS` |
| COURSE | `React + Django Integration` |
| TR_DOC | `Integration project/docs/session-1.md` (rev of 2026-07-24, incl. §10 patch) |
| SESSION_CODE | `Integration project/session-1/{prefilled,final}` — prefilled re-verified 2026-07-24: already `nxttrendz_backend` ✓, Vite pinned to 3000 ✓, no `corsheaders` ✓ (that's the session's work). ⚠️ `manage.py` defaults bare `runserver` to `0.0.0.0:3000` — makes the §4 collision error **live-demonstrable** (trainer note on slide 12). `final/` to re-verify in Stage 3 (cors + `.env` + `api.js` + converted component). |
| NEXT_UP | `Session 2 — API Contract & JWT Auth` |

## Decisions

**Resolved at the 2026-07-24 review (user):**

1. ✅ **Six dividers, one per concept.** User chose the re-cut over the TR's 4-item
   agenda: every divider now carries exactly 4 content slides (quiz checkpoints sit
   outside the 2–4 content count — the frame lists them as checkpoints). Consciously
   waived: the workflow's "at most 4 key concepts" agenda rule and agenda-=-TR-agenda
   fidelity. Side effect: divider names are now 1–3-word concept names, which also
   satisfies the style corpus's divider pattern (the old naming conflict dissolves).
2. ✅ **Crack in the wall.** User chose "patch the TR first": TR §10's body now carries
   the teaser (broken images, blank fields, dead login, yet `200 OK`) — slide 36 is
   doc-faithful.

**Approved with sign-off (2026-07-24):**

3. **Fallback visuals re-approval (×4).** DevTools/terminal UI is not headless-capturable
   (Rev-3 precedent). Slides 10/13 (terminal cards), 17 (NetworkRows), 20 (console error
   block + real Django-terminal line), 28 (response-header line) use styled deck UI —
   never presented as screenshots.
4. **Predict deferral.** TR §8 asks predict 1 (Postman) then predict 2 (`:5500`), both
   before its "wall is down" paragraph. The plan runs: test-it (28) → quiz on predict 2
   (29) → **predict 1 deliberately deferred** to quiz 35 as D6's recall checkpoint.
5. **Overall plan approval** (this document).

**Post-sign-off amendments (2026-07-24, user-directed, Stage 3):**

6. **Real framework logos.** Official marks (VS Code, Python, Node.js, React, Django,
   Vite, npm — Devicon set, MIT) downloaded to `template/public/assets/tech/`, per-download
   approved by the user. Embedded in the `Toolchain` divider; content slides 5–7 use them
   in place of generic lucide tool icons at generation.
7. **Canva evaluation.** 12 AI candidates generated at user request (3 assets × 4);
   reviewed side-by-side against the in-house SVGs; **user chose in-house for all three
   dividers** (D1 with real logos). Candidates archived, not used — consistent with the
   Rev-3 cover precedent.
8. **Motion graphics.** All four session illustrations now self-animate (framer-motion,
   house `soft` ease): `Toolchain` — cards stagger in, ✓ badges spring, the ? breathes;
   `PortsDoors` — apps arrive at their doors, arrows appear, idle bob; `OriginFlats` —
   envelope arrives, delivery arrow, ✗ springs in; `TwoAppsScene` — dash-crawl on the
   broken wire, ✗ pulse. Divider anim entries amended accordingly (illustration
   self-animates within the cover transition). Motion verified via frame-diff QA.
9. **New real capture:** `nodejs-lts.png` (nodejs.org/en/download, v24.18.0 LTS badge +
   `node -v`/`npm -v` verification lines) → slide 7's visual, replacing icon-only steps.
10. **Remotion:** no Remotion skill exists in this environment; deck-native framer-motion
    chosen (crisp at any resolution, replays on slide entry). Optional MP4/GIF export of
    any sequence available on request via Remotion-as-library.

## Concept map

| Divider | Section name (agenda-identical) | TR sections | 📌 Concept (analogy) |
|---|---|---|---|
| D1 | Local Setup | §1–§3 | — (toolchain; no concept) |
| D2 | Ports | §4 | C0 Ports (numbered doors on one building) |
| D3 | Client–Server | §5–§6a | C1 Client–Server model (restaurant) |
| D4 | Origin | §6b–§7 phrase 1 | C2 Origin (flats in one building) |
| D5 | CORS | §7 phrases 2–3 + §8 | C3 CORS (security guard at the gate) |
| D6 | Base URL & .env | §9–§10 | C4 Base URL & env vars (one saved contact) |

Every TR section maps to exactly one divider; no section is unmapped. The §6 console-fetch
predict deliberately closes D3, so the reveal (the wall) opens D4 — failure before the
name, per the pedagogy playbook.

## Assets

| Asset | Type | Status | Slide(s) |
|---|---|---|---|
| NxtWave logo (`public/assets/logo-nxtwave.png`) | brand | exists | 1 |
| **`Toolchain`** — tool cards: VS Code ✓ · Python ✓ · Node slot highlighted/empty | custom SVG — **build** | build | 4 |
| **`PortsDoors`** — one building (the laptop), numbered doors `8000`/`3000`, an app at each | custom SVG — **build** | build | 9 |
| **`UrlAnatomy`** — the TR's address diagram: `http :// localhost : 8000 / api/products/` → scheme·host·PORT·path | inline styled block — **build** (markup, not image) | build | 11 |
| Port-collision terminal (`Error: That port is already in use.`) | inline styled terminal | build (markup) | 12 |
| Starter folder tree (Backend Project / Frontend Project) | inline styled tree | build (markup) | 8 |
| `concept-api` (browser ↔ server conversation) | in-repo illustration | exists — topical for the Client–Server divider | 14 |
| `TwoAppsScene` (React→ccbp, Django "runs · unused", broken connector) | in-repo SVG | exists — **needs tweak: re-add the `:8000` PortTag under the Django card** (the Rev-3 "drop it" tweak is already applied in code; in the new TR Django is on 8000 by §4) | 15 |
| Real Network-tab capture (row: GET …apis.ccbp.in… 200) | real screenshot — attempt | previously not capturable (DevTools UI); fallback = styled rows (decision ③) | 15, 17 |
| `django-json-200.png` (`GET /api/products/` → 200 + JSON) | real screenshot | exists, captured & verified 2026-07-16 | 16 |
| `NetworkRows` (the TR's §6 4-row table: network item → restaurant meaning) | deck inline | exists | 17 |
| **`OriginFlats`** — one building, flats `3000`/`8000`, mail at the gate | custom SVG — **build** | build | 19 |
| CORS-error console block (TR-verbatim) + Django-terminal `200` line | deck inline | exists (Rev 6 deck) | 20 |
| `ErrorMap` (3 phrases → 3 click-revealed questions) | deck inline | exists | 21 |
| `CorsGate` (guard + allow-list board `:3000 ✓ / :5500 ✗`) | in-repo SVG | exists | 24 |
| `AnalogyMap` | content-parameterized layout frame | exists | 25 |
| `EnvConfig` (one `.env` card → every request → one server) | in-repo SVG | exists | 30 |
| `products-from-django.png` | real screenshot | exists, captured & verified 2026-07-16 | 34 |
| `RequestFlow` | custom animation | exists — **unused in Rev 7** (its 200-OK loop would spoil the slide-18 predict) | — |
| lucide icon bridge (`icons.tsx`) | ISC | exists — tool cards, verbs row, origin parts, reasons rows | 5–7, 11, 17, 22, 31–32 |
| Nova mascot poses (quiz / recap / practice / feedback) | same-type fixtures | exists — fixtures only | 29, 35, 37–39 |

Freepik/external: none planned; any need goes through manifest + per-download approval.
Screenshots must be real captures of the running `session-1` code; every fallback goes
through decision ③, and styled blocks are deck UI elements, never presented as
screenshots. **On sign-off, refresh `assets-manifest.md`** (TwoApps tweak state + Rev 7
slide numbers — it still keys to Rev 3).

## Checkpoint rhythm

Predict moment at **18** (console fetch — what will the browser do?) — deliberately left
hanging across the D4 divider; the wall (20) is the reveal. Row-by-row reveal at **23**
(same-origin table — a plan-added interaction; the TR prints the answers). Quiz at **29**
(`:5500`, TR §8 predict 2) ≈ 72% mark; recall quiz at **35** (Postman, TR §8 predict 1 —
deferred, decision ④) closes D6. Question beats close D1 (*"why can't we start the
frontend the same way?"*) and D2 (*"whose products are those?"*). Session-2 teaser at
**36** (TR §10, patched), before the mandated close frame (Takeaways → Practice →
Feedback → Thank You).

Generation note (house style): at most **one em-dash reveal per slide**; remaining beats
become plain fragments or `→` cause/effect lines. Body stays fragment-first (~1 full
sentence per 5 lines, reserved for stakes/rules).

---

## Slides (40)

Format per slide: **id · title** — purpose/content · visual (why) · layout · anim.

### Open

**1 · brand** — NxtWave branding only: logo hero + course name. Footer: SESSION_NAME text
kept, footer **logo** suppressed (only the duplication is exempted; Stage 6 footer rule
holds). Layout: `BrandSlide` (exists). Anim: fade-in.

**2 · welcome** — kicker `WELCOME TO TODAY'S SESSION` + title **Client–Server & CORS**.
Nothing else in the body. Layout: `WelcomeSlide`. Anim: zoom.

**3 · agenda** — **"Today's Agenda"** — lead = the TR's mission line: *"By the end, the
products page renders products served by our own Django backend — not the external API."*
Then the six concepts, numbered, analogies as sub-text (from the TR's concept table):
1. Local Setup
2. Ports — *numbered doors on one building*
3. Client–Server — *a restaurant*
4. Origin — *flats in one building*
5. CORS — *the security guard at the gate*
6. Base URL & .env — *one saved contact*
Layout: `AgendaSlide`. Anim: click-reveal ×6.

### D1 — Local Setup (§1–§3)

**4 · divider** — "Local Setup". Visual: **Toolchain (build)** — VS Code ✓, Python ✓,
Node slot empty/highlighted — exactly this section's gap. Layout:
`SectionBreakerImageSlide`. Anim: cover.

**5 · have** — "What We Already Have" — the TR's two rows as tool cards: **VS Code** — the
editor we write and run everything in · **Python** — runs Django (`python manage.py
runserver`). One rationed sentence: *that was enough to run the backend — Postman proves
it today.* Question beat, click-revealed: *"So why can't we start the frontend the same
way?"* Visual: two icon cards (lucide, exists). Layout: `ContentSlide`. Anim: cards
stagger-in, question on click.

**6 · need-node** — "The Frontend Needs Node" — the TR's one-idea line as the single
rationed sentence: *Python runs our **backend**. Nothing on this machine can run our
**frontend** yet.* Then fragments: React code → written in JavaScript · the tools that
build & serve it — Vite, `npm`, the packages → all run on **Node.js** · *Node is to
JavaScript like the Python interpreter is to Django* · No Node → no `npm install`, no
`npm run dev`. Visual: runtime icon pair (python ↔ node, exists). Layout: `ContentSlide`.
Anim: fragments fade-up in sequence.

**7 · install-node** — "Installing Node" — 3 steps, each with the observable result:
nodejs.org → download **LTS** (the stable one, not "Current") → run installer, accept
defaults → fresh VS Code terminal: `node -v` · `npm -v` (npm ships with Node) → *two
version numbers print → toolchain ready.* Closing pill: **VS Code + Python + Node — the
full set.** Layout: `ProceduralStepsSlide` (exists). Anim: click-reveal ×3 + pill.

**8 · starter** — "The Starter Code" — styled folder tree (build, markup):
`Integration Project/ → Backend Project (Django — our API) · Frontend Project (React —
the NxtTrendz UI)` — *already configured, ready to run*. Then the two one-time installs
as code: `pip install -r requirements.txt` · `npm install`. Layout: `ContentNoteSlide` +
`CodeBlock`. Anim: tree fade-up, code on click.

### D2 — Ports (§4 · 📌 C0)

**9 · divider** — "Ports". Visual: **PortsDoors (build)** — one building, numbered doors,
an app at each — the section's concept. Layout: `SectionBreakerImageSlide`. Anim: cover.

**10 · run-both** — "Two Terminals" — imperatives with results: `python manage.py
runserver 8000` → Django up · second terminal (the `+` in VS Code's terminal panel) →
`npm run dev` → *Vite serves on 3000*. Question beat, click: *"Two servers, same laptop —
how do they not collide?"* Visual: two styled terminal cards (decision ③). Layout:
`ContentSlide`. Anim: terminals stagger-in, question on click.

**11 · doors** — 📌 **C0 — "Numbered Doors"** — **UrlAnatomy (build)**: the TR's address
diagram (`http :// localhost : 8000 / api/products/` → scheme · host · **PORT** · path).
Fragments: `localhost` = this machine · a port = a numbered door on it — one machine,
thousands of doors · a running program **binds one port** → *only one program per door.*
Layout: `ContentSlide` + `UrlAnatomy`. Anim: diagram segments highlight in sequence
(click ×4).

**12 · collision** — "One Door, One Program" — both on `3000` → the second to start
crashes: styled terminal `Error: That port is already in use.` → the track rule as a
pill: **backend 8000 · frontend 3000** — always `python manage.py runserver 8000`.
*(Trainer note, not on slide: the shipped `manage.py` defaults bare `runserver` to 3000 —
start Vite first and the collision is demonstrable live.)* Layout: `ContentNoteSlide` +
terminal block (build, markup). Anim: error types in, rule pill on click.

**13 · both-up** — "Both Servers Up" — React opens at `http://localhost:3000` and shows
products · Django answers at `http://localhost:8000` · no collision. Visual: two status
cards (decision ③). Layout: `ContentSlide`. Anim: cards fade; lead-out on click: *"…but
whose products are those?"*

### D3 — Client–Server (§5–§6a · 📌 C1)

**14 · divider** — "Client–Server". Visual: **concept-api (exists)** — browser ↔ server
conversation, exactly this concept. Layout: `SectionBreakerImageSlide`. Anim: cover.

**15 · whose-products** — "Whose Products?" *(the deck's one question title — the Part
A→B pivot)* — DevTools → **Network** → reload → one request tells the story:
**`https://apis.ccbp.in`** — *someone else's server, out on the internet.* Two problem
pills: **not our data** — can't change, extend, or secure it · **not real-time / not ours
to own** — a fixed practice dataset. Visual: **TwoAppsScene (exists, tweak: re-add
`:8000` tag)**. Layout: `ContentSlide` + `TwoAppsScene`. Anim: scene connector animates,
pills click ×2.

**16 · next-door** — "Their Cloud, Our Laptop" — `apis.ccbp.in` works from anywhere: a
server **in the cloud**, answering over the public internet. Meanwhile, right next door:
a **full-fledged Django backend** — products, auth, cart — doing the same job on this
laptop, at `http://localhost:8000/api/products/` — *Postman proves it* (real screenshot
`django-json-200.png`). The TR's quote, click-revealed: *"Replace the external API with
our own. Find that external URL, point it at our server. One line. Five minutes."*
Layout: `ContentImageSlide`. Anim: screenshot fade, quote on click.

**17 · restaurant** — 📌 **C1 — "The Restaurant"** — scene first: *Picture a restaurant —
you order, the kitchen cooks, the dish arrives… with a verdict.* The Network row is that
exchange — **NetworkRows (exists)**, the TR's own fused table: Method `GET` = "read
something" — the order placed · URL `.../products?...` = which kitchen, which dish ·
Status `200` = the waiter's verdict · Response JSON = the dish itself. Verdict quips on
click: `404` "we don't serve that" · `401` "who's asking?" · `500` "fire in the kitchen".
Closing icon row: our routes use all the verbs — `GET` read · `POST` create (login, add
to cart) · `PUT/PATCH` update · `DELETE` remove. Layout: `ContentSlide` + `NetworkRows`.
Anim: scene line, rows click ×4, verdicts, verbs row.

**18 · test-the-plan** — "Test the Plan" — no code edits: on the running frontend
(`:3000`), browser console: `fetch('http://localhost:8000/api/products/')`. Setup line:
*Postman returned products for this exact URL.* **Predict what the browser does.**
(Interactive pause — nothing revealed; the answer opens the next section.) Layout:
`ContentNoteSlide` + `CodeBlock`. Anim: code fade, predict prompt on click.

### D4 — Origin (§6b–§7 phrase 1 · 📌 C2)

**19 · divider** — "Origin". Visual: **OriginFlats (build)** — one building, flats
`3000`/`8000`, mail at the gate — the section's concept. Layout:
`SectionBreakerImageSlide`. Anim: cover.

**20 · the-wall** — "The Wall" — *Not products. Not a 404.* The TR-verbatim CORS error
block (exists) + the twist, click-revealed: the **Django terminal** shows
`"GET /api/products/ HTTP/1.1" 200` — *the server answered; the page got nothing.*
Pull-quote: *"The only thing standing between them is the browser itself."* Layout:
`ContentSlide` + error block (decision ③). Anim: error fade-in, twist on click, quote on
click.

**21 · word-by-word** — "Word by Word" — read the error like a detective — **ErrorMap
(exists)**: three phrases → three questions: *from origin 'http://localhost:3000'* → what
is an "origin"? · *blocked by CORS policy* → what policy? who blocks? · *No
'Access-Control-Allow-Origin' header is present* → what header? present where? Layout:
`ContentSlide` + `ErrorMap`. Anim: phrases click-reveal ×3.

**22 · origin** — 📌 **C2 — "Origin"** — Phrase 1. Definition pill: **Origin = scheme +
host + port** — `http` + `localhost` + `3000`. Flats in one building: mail for flat 3000
is not for flat 8000 · *"same machine" means nothing to the browser* (Concept 0, seen
from the browser's side). Visual: origin-parts icon trio (lucide, exists). Layout:
`ContentSlide`. Anim: pill fade, fragments stagger.

**23 · origin-rules** — "Origin Rules" — the TR's same-origin table, revealed row by row
(plan-added interaction; the TR prints the answers): port differs — **No, our case** ·
scheme differs — **No** · host differs (`nxttrendz.com` vs `api.nxttrendz.com`) — **No**.
Change **any** part → different origin. Note line: `localhost` and `127.0.0.1` are
**different hosts → different origins** — *if Vite prints one and you open the other,
expect surprises.* Layout: `ContentSlide` (table rows). Anim: rows click ×3, note on
click.

### D5 — CORS (§7 phrases 2–3 + §8 · 📌 C3)

**24 · divider** — "CORS". Visual: **CorsGate (exists)** — guard + allow-list board, the
section's core mechanic. Layout: `SectionBreakerImageSlide`. Anim: cover.

**25 · guard** — 📌 **C3 — "The Guard"** — Phrase 2. Browsers enforce the **same-origin
policy**: a page from one origin may not **read** a response from another. **AnalogyMap
(exists)**: the delivery *arrives* at the gate → Django's `200` · the guard checks — *is
the visitor's name left at the gate?* → the browser checks the header · no name → turned
away → the page never sees the data. One note line: the guard is **the browser, not the
server** — the external API always left the right name, which is why this never bit
before. *(The Postman "no guard" why is quiz 35's payoff — deliberately held back.)*
Layout: `ContentSlide` + `AnalogyMap`. Anim: rows stagger ×3, note on click.

**26 · paperwork** — "The Missing Paperwork" — Phrase 3 names it: a **header**, present
*on the requested resource* → on the **response** → responses come from servers → *the
resident leaves the name at the gate, not the visitor.* CORS definition verbatim:
**response headers by which a server declares "pages from this origin may read my
responses."** → **The fix belongs to the server.** Layout: `ContentSlide`. Anim: chain
fragments stepped, definition pill last.

**27 · the-fix** — "The Fix" — `pip install django-cors-headers` + the 3 edits in
`nxttrendz_backend/settings.py` (height-capped `CodeBlock`): 1) register `corsheaders`
in `INSTALLED_APPS` · 2) `CorsMiddleware` **as high as possible** · 3)
`CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]` — *the name left at the gate.*
Layout: `ContentNoteSlide` + `CodeBlock`. Anim: install line, then edits stepped ×3.

**28 · test-it** — "Test It" *(corpus fixture title)* — restart the backend → the same
console fetch → **products**. The response now carries the paperwork:
`Access-Control-Allow-Origin: http://localhost:3000` (styled header line, decision ③).
Lead-out, TR-verbatim: *"The wall is down. The frontend and backend can finally talk.
But we got through with a URL typed by hand into a console — the products page must do
this, permanently, and well."* Layout: `ContentSlide`. Anim: result fade, header
highlight, lead-out on click.

**29 · quiz-1** — `Quiz Time!` (fixture, D5 checkpoint) — *"Can a page at
`http://localhost:5500` read this API now?"* Options first; answer on one click: **No —
the guard holds a list of names, not an open gate.** (TR §8 predict 2.) Layout:
`QuizSlide` + Nova. Anim: fixture behavior.

### D6 — Base URL & .env (§9–§10 · 📌 C4)

**30 · divider** — "Base URL & .env". Visual: **EnvConfig (exists)** — one `.env` card
feeding every request. Layout: `SectionBreakerImageSlide`. Anim: cover.

**31 · config-not-code** — 📌 **C4 — "Configuration, Not Code"** — beat 1: we *could*
paste `http://localhost:8000/...` and be done today — but we call the API in **many**
components (products, login, cart) · the port changes, or the backend ships to
`https://api.nxttrendz.com` → every pasted copy hunted by hand · phone contact: save the
number once — every call dials whatever the contact holds. Beat 2, click — should it
live in the code *at all?* **No** — icon rows (lucide, exists): differs per environment
(your laptop · a teammate's port · production's domain) · code gets shared & committed
(git — addresses and, later, real secrets exposed) · hosted URLs change (redeploys,
rotations — config changes without re-shipping code). Rule pill: **the API's address is
configuration, not code.** Layout: `ContentSlide`. Anim: beat 1 fragments, beat 2 rows
click ×3, pill last.

**32 · env-file** — "The `.env` File" — code: `VITE_API_BASE_URL=http://localhost:8000`
(frontend root). Narration line: *one saved contact — every request will dial it.* The
rules as fragments: only `VITE_`-prefixed vars reach the app (`import.meta.env.VITE_...`)
· read **once at startup** → restart the dev server · add `.env` to `.gitignore` — never
committed. Layout: `ContentNoteSlide` + `CodeBlock`. Anim: code fade, rules stepped ×3.

**33 · the-swap** — "The Swap" — done right, through one helper. `src/api.js`:
`BASE_URL = import.meta.env.VITE_API_BASE_URL` + `apiUrl = (path) => …` — *every request
builds its URL from this one constant.* Then before/after in
`src/components/AllProductsSection/index.jsx`: hardcoded `https://apis.ccbp.in/products?...`
→ `import { apiUrl } from '../../api'` + `fetch(apiUrl('/api/products/'))` — *the
component now dials the contact, not the number.* Layout: `ContentNoteSlide` +
`CodeBlock` ×2 (height-capped). Anim: helper block, before/after on click.

**34 · served-by-django** — "Served by Django" — restart Vite → load the products page —
**real screenshot `products-from-django.png`**. Caption carries §10's payoff: one config
line re-points everything — `localhost:8000` → local Django · `api.nxttrendz.com` →
production — *"the one-line swap turned out to be true after all — just not the line we
thought."* Layout: `ContentImageSlide`. Anim: screenshot zoom, caption on click.

**35 · quiz-2** — `Quiz Time!` (fixture, D6 recall checkpoint) — *"Does the request now
work from **Postman**?"* Answer: **Yes — it always did. No browser, no guard.** (TR §8
predict 1 — deferred by decision ④.) Layout: `QuizSlide` + Nova. Anim: fixture behavior.

### Close

**36 · crack** — "A Crack in the Wall" — TR §10 (patched body), beats click-revealed:
look closely at that products page — some images broken, some fields blank · try logging
in — it fails completely · yet the Network tab swears everything is fine: `200 OK`.
Quote: *"The wire works. So why is the conversation failing?"* → Session 2: the API
contract + JWT auth. Layout: `ContentSlide`. Anim: beats click ×3, quote last.

**37 · takeaways** — "Key Takeaways" — lead strip (fragments): *setup → ports → the swap →
the guard → the fix → configuration.* Then the six concepts as 4–8-word tick pills
(different UI than the agenda):
1. Setup — VS Code + Python + Node
2. Ports — backend **8000** · frontend **3000**
3. Client–Server — request in, verdict + JSON back
4. Origin — scheme + host + port
5. CORS — the server allow-lists origins
6. Base URL — configuration, not code
Layout: `KeyTakeawaysSlide` + Nova. Anim: pills stagger ×6.

**38 · practice** — "Practice" — the TR's session checklist as fragments: Node installed —
`node -v` · `npm -v` print · `npm install` + `pip install -r requirements.txt` done ·
backend **8000**, frontend **3000**, both at once · `django-cors-headers` app +
middleware + `CORS_ALLOWED_ORIGINS` · console fetch `:3000 → :8000` returns JSON ·
`.env` + `src/api.js` — no hardcoded host left · products page renders from Django.
Layout: `PracticeSlide` + Nova (fixture). Anim: fixture behavior.

**39 · feedback** — FeedbackSlide + Nova (fixture) — standard prompt + link. Anim:
fixture behavior.

**40 · thank-you** — ThankYouSlide — close + one-line `nextUp`: *Session 2 — API Contract
& JWT Auth.* Anim: fade.

---

## Build list (on sign-off)

1. **New visuals:** `Toolchain` SVG (4) · `PortsDoors` SVG (9) · `OriginFlats` SVG (19) ·
   `UrlAnatomy` styled block (11) · collision terminal block (12) · starter folder-tree
   block (8); register in the Illustration registry.
2. **Tweaks:** `TwoAppsScene` — re-add the `:8000` PortTag under the Django ServerCard
   (15); slide 1 footer — keep SESSION_NAME text, suppress footer logo only.
3. **Removals vs Rev 6 deck:** rename slide + `grep myproject` prove-it slide (no TR
   source) · old "Mission" divider · standalone verbs slide (folded into 17) ·
   `RequestFlow` round-trip slide (unused — would spoil the slide-18 predict).
4. **Reuse unchanged:** concept-api (14) · CorsGate (24) · EnvConfig (30) · AnalogyMap
   (25) · NetworkRows (17) · ErrorMap (21) · both real screenshots (16, 34) · fixtures.
5. **Capture attempts (decision ③ fallbacks):** Network-tab row (15/17) · console CORS
   error (20) · response-header line (28) · terminal states (10/13).
6. **Manifest refresh:** mark the TwoApps ":8000 drop" tweak as applied (now reversed for
   Rev 7), re-key "Used by" slide numbers to this plan.
7. **Stage-3 verification:** `session-1/final` still matches TR §8–§9 steps; re-capture
   screenshots only if the final code changed.
8. Deck reassembled in this order; verification per workflow Stage 6 (incl. the em-dash
   cap and fragment-first budget from the Checkpoint-rhythm generation note); snapshot to
   `versions/` after.
