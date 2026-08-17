# Slide plan — `deployement_session_1_v1`

**STATUS: SIGNED OFF 2026-08-11**

### Decisions recorded at sign-off

| # | Question | Decision |
|---|----------|----------|
| C1 | MG palette vs light theme | **Dark inset panel on light slides** — rounded `#0F172A` panel with soft shadow, slide chrome stays visible |
| C2 | Agenda arc holds 6, session has 8 | **Widen the arc** — `ARC_SPREAD` 34° for n ≤ 6, 44° for n > 6. Figma geometry untouched at n ≤ 6 |
| S7 / S10 | TR names Docker before the spoiler rule allows | **Mask as `?`, reveal at Concept 5.** TR doc left as-is — deck diverges deliberately, recorded here |
| mg-2 | 5 pin variants | **Build all 5**, parameterised by pin index — unblocks sessions 2–5 |
| S16 | 6 incompatibilities + a 34s animation on one slide | **Split** into S16 + S16b. Concept 3 runs 5 content slides, a deliberate exception to the 2–4 rule |
| — | Session name | **From Localhost to Anywhere** |

Deck total is therefore **46 slides**.

| Input | Value |
|---|---|
| `PROJECT` | `deployement_session_1_v1` — standalone copy of `template/` at `Web Slides/deployement_session_1_v1/` |
| `SESSION_NAME` | `From Localhost to Anywhere` — footer text on **every** slide |
| `COURSE` | `React + Django Integration — Deployment` |
| `TR_DOC` | `Integration project/deployment/session-1.md` (951 lines) |
| `THEME` | Figma `NxtWave-PPT-Template` › page "Final" (256:760) › section **`V2_Content PPT - New Theme 2027`**, already ported to `src/design/nw2027.ts` + `src/slides/nw2027/` |
| `NEXT_UP` | "Writing your first Dockerfile — packaging *your* Django project" |

---

## Binding constraints taken from the TR doc

These are not stylistic preferences. They are rules the doc states explicitly, and
every slide below was checked against them.

**R1 — Spoiler discipline.** The word *Docker*, Docker blue (`#2496ED`), the whale,
and the words *image* / *container* must **not** appear anywhere before Concept 5.
Concepts 1–4 end on open questions. This kills the obvious temptation to put a
Docker logo on the title or agenda slides. The agenda wording below is deliberately
tool-free for the first four items.

**R2 — Scope discipline.** This session is Problem 1 (*runs anywhere*) only. No slide
may show a server, a globe, a public URL, or inbound traffic — **except** the two
roadmap visuals (`mg-1`, `mg-2`), which show Problem 2 deliberately **unbuilt and
dimmed**.

**R3 — Windows-first.** Every command is PowerShell. macOS/Linux forms appear
alongside, never instead.

**R4 — Motion-graphic palette.** The appendix mandates a dark palette
(`bg #0F172A`, `surface #1E293B`, `ink #F1F5F9`, `docker-blue #2496ED`,
`image-grey #64748B`) with fixed object language (an IMAGE is always a flat grey
dashed slab, never glowing; a CONTAINER is always a blue rounded box with a pulsing
ring; layer stacks always build bottom-up).

---

## ⚠️ Three conflicts to resolve at sign-off

**C1 — Dark motion graphics on a light theme.**
The nw2027 content family is a near-white field (`surface #F7F7FA`) with brand blue.
The mandated MG palette is dark slate. **Proposal:** render every `mg-` component
inside a `GlassPanel`-style dark inset with a 24px radius and a soft shadow — read as
a *screen* embedded in the slide, the same way the existing `TerminalSlide2027` panel
already sits on a light slide. This makes the contrast deliberate rather than
accidental, and keeps the appendix palette byte-exact so assets stay reusable across
the whole deployment module. **Alternative:** put every MG on a `hero` (full-bleed
dark blue) slide instead — cleaner but loses the slide title/progress chrome.

**C2 — Agenda arc holds 6 items; this session has 8 concepts.**
`AgendaSlide2027` fans items along an arc with `ARC_SPREAD = 34°`, measured off the
Figma frame `Slide 16:9 - Agenda_V6`, which shows 6 items. Your standing preference
(one divider per concept, 2–4 content slides each) yields **8** concepts here — the
TR's section 3 alone is 240 lines and cannot honestly fit 4 slides.
**Proposal:** keep Figma geometry exact for n ≤ 6, and widen `ARC_SPREAD` to 44° when
n > 6. The progress bar already derives its divisions from `items.length`, so it
follows automatically. **Alternative:** merge concepts 3+4 and 6+7 down to 6, at the
cost of 6-slide sections.

**C3 — 10 motion graphics is the bulk of the work.**
Built as animated React components (your call), `mg-3b` (34s, three machines, three
distinct failures) and `mg-3c` (36s, five attempts against a fixed problem column)
are each substantially more work than an entire content slide. Sequencing proposal is
in *Build order* at the bottom.

---

## Stage 1 — Concept map

Every TR section maps to exactly one concept. Nothing is orphaned.

| # | Concept (agenda wording) | TR sections absorbed | Content slides |
|---|--------------------------|----------------------|----------------|
| 1 | Where Your App Lives Today | Where You Are Right Now → Your Two Terminals · The Word "localhost" · Deployment Is Actually Two Separate Problems | 3 |
| 2 | The Shape of the Journey | What Actually Has to Change → Three Uncomfortable Truths · The Shape of the Journey | 3 |
| 3 | Why "It Works on My Machine" | The "It Works on My Machine" Problem → A Conversation That Happens Everywhere · Your Code Is Only Part of Your Application · System-to-System Incompatibility | 4 |
| 4 | What Would Actually Fix It | Restating the Real Question · What Would Actually Solve This? · What the Attempts Tell Us | 3 |
| 5 | Meet Docker | What Is Docker? → The Tool That Meets All Five Requirements · The Shipping Container Story · The Definition · Is This What the Industry Uses? | 4 |
| 6 | Images and Containers | Images and Containers → all four subsections | 3 |
| 7 | Containers vs Virtual Machines | Containers vs Virtual Machines → all three subsections | 3 |
| 8 | Getting Docker Running | Getting Docker onto Your Machine → What You Are Installing · Steps 1–4 | 4 |

Closing sections (*Recap and What Comes Next*, *Before the Next Session*) map to the
Key Takeaways / Practice / Thank You frame, not to a concept divider.

Note how concepts 1→4 name **no tool**. That is R1 working: the agenda itself must not
spoil the answer the student is about to derive.

---

## Stage 2 — Slide-wise plan

Legend — **L** = nw2027 layout · **V** = visual + why it fits · **A** = animation ·
**Asset** = exists / build / capture.

### Frame — opening

**S1 · Brand**
L `HeroWordmarkSlide` · Content: NxtWave wordmark + `React + Django Integration — Deployment`. No footer logo (would duplicate the hero mark).
V none — brand-only by workflow rule. A wordmark fade 400ms. Asset: exists.

**S2 · Welcome**
L `WelcomeSlide2027` · Kicker `WELCOME TO TODAY'S SESSION`, title *From Localhost to Anywhere*. Body empty.
A title rise 400ms ease-out. Asset: exists.

**S3 · Today's Agenda**
L `AgendaSlide2027` · 8 items = the 8 concept labels above. `progress={{total: 8, current: 1}}`.
V the Figma arc. A items fan in sequentially, 120ms stagger. Asset: exists (pending C2 spread fix).

---

### Concept 1 — Where Your App Lives Today

**S4 · Divider** — L `SectionBreakerSlide2027`, number `01`.
V a laptop outline with two lit terminal panes inside it, drawn in `ink-muted` 2px stroke per the appendix machine styling. **Build** (`illus-1-two-terminals.tsx`). Fits: the concept is literally "your two terminals".

**S5 · Your Two Terminals**
L `TerminalSlide2027`, two panels side by side. Content verbatim from TR: `venv\Scripts\activate` / `python manage.py runserver` → `Starting development server at http://127.0.0.1:8000/`; `npm run dev` → `VITE ready in 412 ms` / `Local: http://localhost:5173/`.
Footnote row = the R3 Windows/macOS command table (3 rows).
A commands type in at 25 chars/sec (appendix rule), output snaps after.
Asset: build (a typing variant of the existing terminal panel).

**S6 · The Word "localhost"**
L `ContentSlide2027` · The two addresses called out large; *"this machine, and only this machine"*; the friend-gets-a-connection-error beat; the one-sentence course goal as a pull quote.
V **`mg-1` beats 1–4 only** (laptop, internal request loop, the empty gap, the dissolving request). Fits: the slide's claim is exactly "the request never leaves the box".
A auto-play once on entry, replayable. Asset: **build** `mg-1`.

**S7 · Deployment Is Two Separate Problems**
L `TableSlide2027` · the TR's 4-row comparison (Question / Enemy / Tools / Needs internet?). Below it the scope note: *today, Problem 1 only — we will not touch servers, hosting, addresses or ports, not once.*
V **`mg-1` beats 5–6** — the gap splitting into two labelled halves, half 1 pinned "YOU ARE HERE", half 2 dimmed to `ink-muted`. This is the sanctioned R2 exception.
A the split draws on click, so the presenter lands the point. Asset: build (same `mg-1` component, second act).
⚠️ The Tools row says "Docker, Dockerfile, Docker Compose" — this is the **one** pre-Concept-5 place the TR itself names the tool. Proposal: render that cell as `?` and reveal the real text on the Concept 5 divider, preserving R1. Flag if you'd rather keep the doc verbatim.

---

### Concept 2 — The Shape of the Journey

**S8 · Divider** — `SectionBreakerSlide2027`, `02`.
V a horizontal path with 5 unlit stations. **Build** — a still of `mg-2`'s pre-pin state.

**S9 · Three Uncomfortable Truths**
L `CardsSlide2027`, 3 cards: `runserver` is not a real server (with Django's own warning as a code line) · `npm run dev` never ships (build output is what deploys) · your laptop is not a server.
V per-card icon, Lucide 2px, one family only (appendix). Card 3 gets a "parked until Problem 2" tag — the TR flags it as Problem 2.
A cards reveal on click, one per beat. Asset: build (3 icons).

**S10 · The Shape of the Journey**
L `TableSlide2027` · the TR's 5-stage table (Problem / Stage / Question / Tool), with a rule drawn between *Combine* and *Host* where the two problems split.
⚠️ Same R1 issue — the Tool column names Docker. Same `?` proposal.
A the dividing rule draws last. Asset: exists.

**S11 · You Are Here**
L `ContentSlide2027` with a full-width visual · **`mg-2`** in its entirety, ending on the Package pin.
Fits: this is the session's orientation slide, and the appendix mandates this exact asset ship in 5 pin variants as the module's standard opener.
A auto-play. Asset: **build** `mg-2` (parameterised by pin index 1–5 so sessions 2–5 reuse it).

---

### Concept 3 — Why "It Works on My Machine"

**S12 · Divider** — `03`. V two machine outlines with a Git icon between them and only one block crossing. **Build** (still from `mg-3`).

**S13 · A Conversation That Happens Everywhere**
L `ContentSlide2027` as a two-line chat exchange, verbatim: *"The products API crashes the moment I hit it."* / *"That's strange — it works on my machine."* Closing line: **nobody is lying.**
V speech-bubble pair, brand blue vs neutral. A lines appear 800ms apart, held beat before the closing line. Asset: build (small).

**S14 · Git Shares Code, Not Environment**
L `TableSlide2027` · the TR's 7-row dependency table (runtime, framework, packages, Node, OS libraries, env settings, the database file). Kicker: *"Your running application depends on all of this."*
A rows reveal top-to-bottom; the `db.sqlite3` row lands last and flashes `error` — it is the row students never think about. Asset: exists.

**S15 · The Same Code, Different Ground**
L `ContentSlide2027` full-width visual · **`mg-3`**, which ends unlabelled on *"What if all four layers travelled together?"*
Fits: makes the invisible environment layers visible, and R1-compliant by design — the asset names no tool.
Asset: **build** `mg-3`.

**S16 · Six Things That Break Below Your Code**
L `CardsSlide2027` (2×3) — path separators · case-sensitive filesystems · line endings · packages that compile against the OS · processor architecture · commands and shells. Each card carries its one-line failure, in monospace: `Module not found`, `bad interpreter`, `gcc failed`, `exec format error`.
Then the closing line: **these live *below* your code.**
V **`mg-3b`** replaces the card grid on click (same slide, two states) — it runs one identical line through Windows / macOS / Linux and fails two of them at different points.
⚠️ Content risk: 6 cards + a 34s animation is dense for one slide. **Proposal:** split into S16 (the six, as cards) and S16b (`mg-3b` full-width). That makes Concept 3 five content slides, breaking the 2–4 rule by one. Your call at sign-off — I default to splitting, because the TR calls this "the graphic that makes it land".
Asset: **build** `mg-3b`.

**S17 · Quiz checkpoint**
L `QuizSlide2027` · *"Your React build passes on your Windows laptop and fails on the Linux server with `Module not found: ./components/productcard`. What changed?"* Options: the code · the Node version · the filesystem's case sensitivity ✓ · the network. Answer reveals only after all options are shown.
Placement rationale: right after the densest new material, before the elimination argument.

---

### Concept 4 — What Would Actually Fix It

**S18 · Divider** — `04`, subtitle carrying the TR's restated question as a pull quote: *"How do we share the code together with its entire environment … as one sealed unit?"*
V a sealed, unlabelled box outline with a question mark — R1-safe. **Build.**

**S19 · Attempts 1–2**
L `CardsSlide2027`, 2 cards, each split *what it is* / *why it fails*. README (executed by a human on an unknown machine) · pin every version (fixes the upper rows only; cannot pin the SQLite your Python was built against).
A card 2's "why it fails" reveals on click. Asset: build (2 icons).

**S20 · Attempts 3–5**
L `CardsSlide2027`, 3 cards. venv (isolates Python packages only; `venv\Scripts\` doesn't even exist on Linux) · identical machines (a technical problem swapped for a permanent administrative one) · full VM (**works** — 2 GB, 1:47 boot).
A card 5 is styled differently — it gets a green ✓ *and* a weight badge. It is the one that got the idea right.
Asset: build (3 icons).

**S21 · Five Attempts, Five Failures**
L `ContentSlide2027` full-width · **`mg-3c`** — the fixed five-bar problem column with coverage growing attempt by attempt, ending on the compressed unlabelled block and *"We need all five — at a fraction of the weight."*
Asset: **build** `mg-3c`.

**S22 · The Five Requirements**
L `TableSlide2027` · the TR's requirement table (# / Requirement / Which attempt proved it). Closing instruction verbatim: *"Keep this list. When the tool is introduced, check it against these five rows rather than taking anyone's word for it."*
A rows reveal one at a time. Asset: exists.
This is the last R1-constrained slide. Nothing here names a tool.

---

### Concept 5 — Meet Docker

**S23 · Divider** — `05`, title **Meet Docker**. This is where Docker blue, the whale, and the container object language are unlocked.
V the Docker wordmark/whale, first appearance. Asset: build (verify licensing before use — Docker's brand assets are permissive for editorial/educational use; will record in the manifest).

**S24 · It Meets All Five**
L `TableSlide2027` · the TR's requirement → how-Docker-meets-it table, **rendered as a direct overlay of S22** so the five rows the student derived are the same five rows, in the same order. This is the payoff of the whole first half.
A each "how" cell fills in on click, left column already present. Asset: exists.

**S25 · The Shipping Container Story**
L `ContentSlide2027` full-width · **`mg-4`** — loose cargo repacked 3× with a visible breakage, vs one sealed container repacked 0×, morphing into the software parallel.
Asset: **build** `mg-4`.

**S26 · Shipping World ↔ Docker World**
L `TableSlide2027` · the TR's 5-row mapping table. A rows pair-reveal left→right. Asset: exists.

**S27 · The Definition (+ industry proof)**
L `ContentSlide2027` · the definition as a large pull quote, then the re-read with the student's own stack named (*your Django code, Python 3.10, DRF, simplejwt, cors-headers*). Footer strip: Netflix / Spotify / PayPal; AWS / GCP / Azure; SO Survey 2024 most-used **and** most-admired, with the source line.
V logo strip. ⚠️ Third-party logos — I'll use text wordmarks rather than downloading brand marks unless you approve the assets. Asset: build.

---

### Concept 6 — Images and Containers

**S28 · Divider** — `06`. V the grey IMAGE slab with three containers fanning below (appendix object language, exact). **Build** (still of `mg-5`).

**S29 · The Two Words You Must Not Mix Up**
L `ContentSlide2027` split — left: the Python `class Product` / `p1 = Product()` snippet; right: the Class→Image, Object→Container table.
Fits: the TR anchors this entirely on OOP the student already knows.
A the two right-hand rows land as their left-hand code lines highlight. Asset: exists (`CodeBlock`).

**S30 · Image vs Container**
L `CardsSlide2027`, 2 cards drawn in the mandated object styling — IMAGE flat grey dashed, no glow, no animation; CONTAINER blue rounded, soft glow, pulsing ring. Bullets verbatim from the TR. The "an image does not run" line gets emphasis.
A the container card's ring pulses; the image card is deliberately motionless. That contrast *is* the teaching.
Asset: build (the two objects become shared primitives reused by `mg-5` and `mg-7`).

**S31 · One Image, Many Containers**
L `ContentSlide2027` full-width · **`mg-5`** — run ×3, edit container 2 (image unchanged), `docker rm` container 2, run once more. Then the two MultiLineNote rules as a caption strip, and *"Where do images come from?"* → Docker Hub / built by you with a Dockerfile (next session).
Asset: **build** `mg-5`.

---

### Concept 7 — Containers vs Virtual Machines

**S32 · Divider** — `07`. V the two stacks side by side, unlit. **Build** (still of `mg-6`).

**S33 · The Structural Difference**
L `HierarchySlide2027` · the TR's two ASCII stacks rendered as real layer stacks, built bottom-up (appendix rule: Hardware → Host OS → Hypervisor | Docker Engine → app layers, never reordered). One-line reading: **VMs duplicate the OS; containers share it.**
V **`mg-6`** on click — boot timers, size badges, the bracket height comparison, ending on containers-inside-an-EC2-VM.
⚠️ That final beat shows an EC2 instance. It is a *machine*, not a public address or traffic, so it stays within R2 — but flag if you want it cut.
Asset: **build** `mg-6`.

**S34 · Comparison**
L `TableSlide2027` · the TR's 5-row table (Contains / Size / Startup / Resources / Isolation). The size and startup rows are highlighted and back-linked to requirement 4 from S22.
A rows reveal; rows 2–3 flash on the callback. Asset: exists.

**S35 · Kernel vs Userland — and Windows**
L `ContentSlide2027` · resolves the apparent contradiction (*ships its own Linux* vs *shares the host kernel*): an OS is kernel + userland; a container brings userland, borrows the kernel. Then the WSL 2 layer: one thin Linux kernel, once, at install time.
V **`mg-6b`** — the Windows host stack with the WSL 2 slab shared by every container.
Asset: **build** `mg-6b` (a re-render of `mg-6`'s right half — cheap, shares components).

---

### Concept 8 — Getting Docker Running

**S36 · Divider** — `08`, kicker `HANDS-ON`. V an installer icon dropping onto a machine stack. **Build.**

**S37 · What You Are Installing**
L `TableSlide2027` · Docker Engine / the `docker` command / WSL 2 Linux kernel, each with *what it is* and *why you need it*. Footnote: macOS uses a built-in Linux VM; Linux installs the engine directly with `sudo apt install docker.io` — *which is exactly what you'll do on EC2 much later*.
Asset: exists.

**S38 · Steps 1–2 — Enable WSL 2, Install Docker Desktop**
L `TerminalSlide2027` · `wsl --install` (PowerShell **as Administrator** — called out as a chip), reboot, `wsl --update` if already present. Then the download step and the "Use WSL 2 instead of Hyper-V" checkbox.
Callout card: the BIOS virtualisation error and its fix (Intel VT-x / AMD-V), plus *you do not need a Linux distro or any Linux commands*.
Asset: build (a screenshot of the Docker Desktop installer checkbox would help — **capture**, needs a Windows machine; if unavailable I'll draw it).

**S39 · Steps 3–4 — Start It, Verify It**
L `TerminalSlide2027` · the Engine-running status point (*installed and running are not the same thing* — flagged as the step people skip), then `docker --version` and `docker run hello-world` with the full verbatim output including the pull lines.
A output streams line by line at terminal speed. Asset: exists.

**S40 · Read Your Own Output**
L `ContentSlide2027` full-width · **`mg-7`** — what Docker Desktop put on your machine, built bottom-up, ending on three containers pointing down into one WSL 2 slab.
Beside it, the TR's decoding of the `hello-world` output in the student's new vocabulary (looked for an **image**, didn't find it, pulled from **Docker Hub**, created a **container**, it printed and exited).
Callout: the `error during connect` fix (Docker Desktop isn't running → Step 3), and the payoff line — *every `docker` command is identical on every shell, unlike every row of that shell table earlier.*
Asset: **build** `mg-7`.

**S41 · Quiz checkpoint**
L `QuizSlide2027` · *"You run `docker rm` on a container built from the `python:3.10` image. What happens to the image?"* Options: it's deleted too · it's deleted if no containers remain · nothing — the image is untouched ✓ · it becomes read-write.

---

### Frame — closing

**S42 · Key Takeaways**
L `BulletsSlide2027` (deliberately a *different* UI from the arc agenda, per workflow rule). The 8 agenda concepts restated as outcomes — e.g. *"Where Your App Lives Today"* → *"You can name the two problems deployment actually is, and say which one today solved."*

**S43 · The Gap That Remains**
L `ContentSlide2027` · `hello-world` is somebody else's image; nothing of *your* Django project is packaged yet. Problem 1 is understood, not solved. Still no internet.

**S44 · Practice — Before the Next Session**
L `PracticeSlide2027` · the TR's 3 tasks: finish the install to *Engine running* · write image-vs-container in your own words · refresh `requirements.txt` with `python -m pip freeze | Out-File -Encoding utf8 requirements.txt`, including the UTF-16 explanation (a line-endings/encoding problem arriving before the server does).

**S45 · Feedback** — L `FeedbackSlide2027`. Asset: exists.

**S46 · Thank You** — L `ThankYouSlide2027`, next-up teaser: *"Next: the `docker` commands in full, then turning your own Django + DRF project into an image."* Asset: exists.

**Deck total: 46 slides** — 3 opening, 8 dividers, 27 content, 2 quiz, 5 closing (+1 if S16 splits).

---

## Stage 3 — Asset production

### Motion graphics (10) — animated React components under `src/motion/mg/`

Shared primitives extracted first, so the object language is literally one
implementation (the appendix's core demand — *"if they are styled differently, the
student reads them as different things and the teaching breaks"*):

`ImageSlab` · `ContainerBox` (running / stopped variants) · `StoppedTray` ·
`DockerHubCloud` · `MachineOutline` · `LayerStack` (bottom-up only) ·
`TerminalPanel` (25 chars/sec) · `RequestDot` · `Caption` (lower third, fixed y,
one at a time, ≥2.5s) · `mgPalette` + `mgMotion` tokens transcribed from the appendix.

| ID | Slide | Length | Cost | R1-safe? |
|----|-------|--------|------|----------|
| `mg-1` | S6 + S7 | 26s | M | yes — no tool named |
| `mg-2` | S11 | 22s | M — ships 5 pin variants | yes |
| `mg-3` | S15 | 28s | M | yes — ends unlabelled |
| `mg-3b` | S16b | 34s | **L** | yes |
| `mg-3c` | S21 | 36s | **L** | yes |
| `mg-4` | S25 | 30s | **L** | Docker unlocked |
| `mg-5` | S31 | 26s | M | Docker unlocked |
| `mg-6` | S33 | 30s | M | Docker unlocked |
| `mg-6b` | S35 | 8s | S — reuses `mg-6` | Docker unlocked |
| `mg-7` | S40 | 18s | M — reuses `mg-5`/`mg-6` parts | Docker unlocked |

### Other assets

8 divider illustrations (each a still of its concept's motion graphic where one
exists — free reuse, and it foreshadows correctly) · ~10 Lucide icons, one family ·
brand wordmark strip for S27 · optionally one Docker Desktop installer screenshot.

**No session code to run and capture this session** — unusually, this deck has zero
app screenshots. All commands are Docker/WSL setup, and the TR supplies their exact
output verbatim. `docker --version` and `docker run hello-world` output should still
be verified against a real run before sign-off on the deck.

### Build order

1. `mgPalette` / `mgMotion` tokens + the 10 shared primitives
2. Deck skeleton — all 46 slides with real copy, MGs as sized labelled placeholders
   → **you can review the full flow and wording here, before any animation cost**
3. `mg-1`, `mg-2` (open the session, and `mg-2` unblocks sessions 2–5)
4. `mg-3`, `mg-3b`, `mg-3c` (the argument)
5. `mg-4`, `mg-5`, `mg-6`, `mg-6b`, `mg-7`
6. Divider stills pulled from 3–5

---

## Stage 4 — Sign-off

Needed from you:

1. **C1** — dark MG inset on light slides, or MGs on full-bleed hero slides?
2. **C2** — widen the agenda arc to 8 items, or merge down to 6 concepts?
3. **S7 / S10** — mask "Docker" as `?` to protect R1, or keep the TR verbatim?
4. **S16** — split into two slides (5 content slides in Concept 3), or keep dense?
5. **S33** — is the EC2-instance final beat acceptable under R2?
6. Session name **From Localhost to Anywhere** — approve or replace.
