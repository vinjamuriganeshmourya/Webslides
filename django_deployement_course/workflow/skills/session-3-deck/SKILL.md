---
name: session-3-deck
description: Build rules, decisions and the running feedback log for Deployment Session 3, "Docker Compose for Multi-Container Apps" (project deployement_session_3). Use whenever writing, editing, reviewing or QA-ing that session's plan (session_plans/deployement_session_3/plan.md), its deck source (deployement_session_3/src/decks/dockerComposeDeck.tsx), or any slide, figure, illustration, asset or terminal transcript in it. Also use when the user gives feedback on session 3 slides, so the feedback is recorded here before it is applied.
---

# Session 3 deck: Docker Compose for Multi-Container Apps

The session-specific companion to `.claude/skills/slide-content-rules`
(workspace hard rules) and `workflow/PEDAGOGY_GUIDELINES.md` (sequencing).

**Precedence:** `slide-content-rules` > this file > `PEDAGOGY_GUIDELINES.md` >
`TEXT_GUIDELINES.md` > `STYLE_GUIDE.md`. Inside this file, §3 (the feedback log)
beats §2 (the build rules), because §3 is what the user actually said.

**The session name is `Docker Compose for Multi-Container Apps`.** Hyphenated,
"Apps" not "Applications". It appears in `deck.config.json` (`title`), the deck's
`SESSION` const and `DeckMeta`, and nowhere else needs to hardcode it: the browser
tab reads it from `deck.config.json` through the `deck-title` vite plugin. Do not
name a session in `index.html`, `baseDeck.tsx` or any other kit file.

| Thing | Where |
|---|---|
| TR doc | `/home/nxtwave/docker_jenkins_aws/03_docker_compose_multi_container.md` |
| Signed-off plan | `session_plans/deployement_session_3/plan.md` |
| Deck source | `deployement_session_3/src/decks/dockerComposeDeck.tsx` |
| Previous session | `deployement_session_2/src/decks/dockerFileCreationDeck.tsx` |
| Asset manifest | `workflow/assets-manifest.md` |

---

## 1. Who is in the room

They have shipped a React frontend and a Django backend, and they write Python
and JavaScript. They finished Session 2 last week, so they have written **one**
Dockerfile and built **one** image of their own.

Everything else in this session is new to them. Treat all of these as new
vocabulary that must be defined on its own slide **before** it is used anywhere
else in the deck:

`runtime` · `base image variant (-slim, -alpine)` · `service` ·
`YAML` · `declarative` · `environment variable` · `volume` ·
`host` · `container network` · `hostname` · `localhost` ·
`detached mode` · `project name` · `orchestration`

Anchor each one in something they already own: `package.json` from React,
`os.environ` from `settings.py`, a Django **model** for declarative-vs-imperative,
`npm start` and `manage.py runserver` for two runtimes.

## 2. Build rules for this deck

Numbered so a review can cite one.

**S1 SCOPE. Problem 1 still, and nothing on any slide opens problem 2.**
No published port, no `ports:` key, no browser reaching a container, no server, no
globe, no public URL. `docker compose up` runs two scripts that print and exit.
Where the TR says "the next session earns it", the slide says "later in this
course" and the tool name stays in `notes`.

**S2 TWO SCRIPTS, NOT THE REAL APP.** The exhibits are `app.py` and `server.js`,
three lines each. The moment `settings.py` or a React component is on screen the
room debugs Django instead of learning Compose. The real `nxttrendz` project
appears only as a file tree, never as code.

**S3 WINDOWS-FIRST, VS CODE INTEGRATED TERMINAL.** Every command carries its
prompt path, and the path for this session is `C:\nxttrendz\docker-demo` (the
compose file's folder), not either app folder. macOS and Linux forms live in
`notes`.

**S4 ONE PANEL PER TERMINAL.** Two terminals means two `Terminal` components side
by side with two paths and two captions. Never stack two prompts in one panel.

**S5 THE YAML IS BUILT ONE KEY PER SLIDE, THEN SHOWN WHOLE.** `services:` →
`build:` → `depends_on:` → `environment:` → `volumes:` → the merged file. Earlier
lines stay visible, unchanged, in the same position. One new key, one annotation,
per slide. The sequence closes on the complete file plus its payoff line.

**S6 NO KEY, KEYWORD OR ADDRESS BEFORE ITS OWN SLIDE.** In particular
`http://backend:8000` is written on the `environment:` slide, and the slide says
only that it is deliberately not `localhost` and that we will find out why. The
`why` is concept 4. Do not explain hostnames early.

**S7 EXPLAIN THE COMMAND, THEN SHOW THE TRANSCRIPT.** Every `docker compose`
command gets two slides: what it does, then its output. Carried over from Session
2's R10, because it worked.

**S8 EVERY TRANSCRIPT IS QUOTED FROM THE TR, NOT CAPTURED.** Docker Desktop will
not run on the capture machine (Hyper-V/HCS unavailable inside VirtualBox), the
same blocker as Sessions 1 and 2. Image IDs, sizes and timings are therefore
illustrative and the speaker note says so on every slide that shows one. Captures
are tracked as outstanding in `workflow/assets-manifest.md`.

**S9 EVERY TECHNOLOGY RENDERS AS A PNG.** `public/assets/tech/*.png`, rasterised
at 512px from the vendor's own SVG. Never an SVG on a slide, never a recoloured
or redrawn vendor mark. Docker Compose has no separate official mark, so it uses
the Docker whale; YAML gets an in-house glyph from `src/ui/icons.tsx`, not an
invented logo.

**S10 VIDEO BOX.** Top-right `x 913..1280, y 0..220` stays clear. Assert with
`node video-safe.mjs`.

**S11 NO SPACED EM DASH, NO TRAILING FULL STOP** on any rendered string.

**S17 THE TEXT BUDGET IS A CEILING, NOT A TARGET.** `TEXT_GUIDELINES.md` §1,
measured over 1,274 corpus slides: a title is **2 words** (5 at p90), a bullet is
a **3 to 6 word fragment** (10 at p90), a sub is a short clause, and a slide is
about **40 body words** (117 at p90). A `lead` is the slide's one rationed
sentence, so keep it **under 20 words**; past that it is a paragraph and the room
reads instead of listening.

The trap this deck fell into: when a callout overflowed the frame, the cheap fix
was to move its sentence into the lead. That clears the overflow and breaks the
budget, and it happened on four slides. Cut the words instead. If a slide truly
carries two sentences' worth, it carries two ideas, and the fix is to split it.

**S15 NOTHING MAY SIT UNDER THE DECK CHROME.** The slide counter, the three nav
buttons (x 111..247, y 664..704) and the footer mark (x 1173..1248, y 668..704)
are painted OVER the stage. A callout whose last line reaches y=660 is inside the
frame, inside the video-safe area, and unreadable: three slides shipped reading
`the a__r_ss becomes` before this was caught. `ContentNoteSlide`'s callout is the
usual culprit, because it is the lowest thing on the slide. `align-check.mjs`
reports these as CHROME.

**S16 A PANEL MAY NOT CLIP ITS OWN CONTENT.** A `CodeBlock` whose `maxHeight` is
shorter than its file, or a `Terminal` narrower than its longest line, shears the
content with no scrollbar to warn anyone: it looks like a finished panel with a
line cut through the middle of a glyph. On one slide the clipped line was the one
the slide's own bullet pointed at. Fix it with `fontSize`, a bigger `maxHeight`,
or a wider column, never by shortening a transcript. `align-check.mjs` reports
these as CLIPPED.

**S14 EVERY BODY BLOCK IS EITHER LEFT-ALIGNED TO THE HEADER OR CENTRED ON THE
STAGE, NEVER BETWEEN THE TWO.** The header sits at x=145. A body block must
start at x=145 too, or be centred on the content area, and a figure with a fixed
pixel width inside a full-width block is neither: it sits hard left with a hole
beside it. `mx-auto` does not fix that (an auto-width block is already full
width, so the margins have nothing to distribute); the figure's own root needs
`justify-center`, or the wrapper needs to be a flex row. Run
`node align-check.mjs` and expect zero DRIFT rows.

**S13 CONCEPT 1 IS A READING SECTION, NOT A TYPING SECTION.** The room does not
create the Node files one per slide. Slide 15 shows `server.js` and
`package.json` together over the role mapping, slide 16 shows the finished Node
Dockerfile whole, and slide 17's line-by-line table against Python is the
section's payoff. Do not re-expand this into a file-per-slide build: it was
compressed deliberately at sign-off, because the lesson is that the pattern does
not change, not that Node needs typing practice.

**S12 TEXT AND ITS VISUAL REVEAL TOGETHER.** `BulletList immediate`,
`Callout asStep={false}`, `LayerStack stepped={false}`, figures in
`RevealGroup`+`Reveal`. `Step` is kept only for a genuine teaching pause: the
answer to a posed question, and the "why it fails" beat.

## 3. Feedback log

Every correction the user gives on this session is appended here **before** it is
applied, newest last, with the date and what changed. This is the record that
survives a context reset.

| # | Date | Feedback | What changed |
|---|---|---|---|
| 1 | 2026-08-20 | Students know React, Django, Python and JavaScript, and are new to everything else. Every new keyword must be explained before it is introduced, with illustrations, animation and analogies. | §1 written as the vocabulary contract; every term in it gets a definition slide before first use. Plan §4 lists them against slide numbers. |
| 2 | 2026-08-20 | The session must have a narrative flow the instructor can connect through. | Plan §2 is a narrative spine: each concept ends on the question the next concept answers, and every divider is written as that question. |
| 3 | 2026-08-20 | Use PNG for any technology used or explained. | Rule S9. `public/assets/tech/*.png` generated from the vendor SVGs at 512px. |
| 4 | 2026-08-20 | Build the required skill alongside, in the workflow folder, carrying the feedback given going forward. | This file, at `workflow/skills/session-3-deck/SKILL.md`, symlinked into `.claude/skills/` so it loads as a skill. |
| 5 | 2026-08-20 | Plan signed off at 73 slides, but concept 1 compressed to the comparison: the room reads the finished Node side and the line-by-line table instead of creating each file on its own slide. | Concept 1 is 15 slides, not 19. Slide 11's logo row folded into 10, the one-Dockerfile-per-folder warning into 14, and `server.js` + `package.json` + the role mapping into a single slide 15. Deck is 69 slides. New rule S13. |
| 6 | 2026-08-20 | Review all slide container alignments and content connection. | New harness `align-check.mjs` measures every slide's body blocks against the header's left edge and the stage centre, so drift is measured rather than eyeballed. New rule S14. A narrative read of all 69 kickers, titles and leads is part of the verification gate. |
| 7 | 2026-08-20 | Use workflows / agents to complete the review. | A 14-agent workflow reviewed all 69 slides (5 slide ranges, plus narrative flow and the vocabulary contract), then adversarially verified every finding. 27 findings refuted, 25 confirmed (17 distinct), all fixed. Two whole classes of defect it found were invisible to every existing harness, so `align-check.mjs` learned to catch both: rules S15 and S16. |
| 8 | 2026-08-20 | The next session is **Running Project on Docker**. Name it on the teaser slide. | Slide 68 names the session by title. This does not breach S1: S1 bars naming a later session's TOOLS, while `PEDAGOGY_GUIDELINES.md` §1 requires the deck to close by naming the next session by title. "Running Project on Docker" names no new tool. |
| 9 | 2026-08-20 | Remove the text under the Thank You slide. | `ThankYouSlide` renders with no `message`. The deck already ends on slide 68's teaser, and a second line here gave the deck two endings, which is the reason `ThankYouSlideProps` has no `nextUp` either. |
| 10 | 2026-08-20 | Apply the text guidelines and make the copy concise. | Rule S17. Measured every rendered string against `TEXT_GUIDELINES.md` §1 and cut everything over the ceiling. The overflow fixes earlier in the build had been pushing text INTO leads to save vertical space, which traded one defect for another. |
| 11 | 2026-08-20 | Set the session name to **Docker Compose for Multi-Container Apps** everywhere. | It was already that in all 11 deck-content places, but the PROJECT still identified itself as the template in five: the browser-tab title, `package.json`, `package-lock.json`, `CLAUDE.md` and `README.md`. All fixed. `index.html` is a kit file, so the tab title now comes from `deck.config.json` via a `deck-title` vite plugin rather than being hardcoded, which fixes it for every session at once. 18 occurrences of the name, zero variants. |

## 4. Verification gate

```bash
cd deployement_session_3
npx tsc -b --noEmit
export CHROME_PATH=/opt/google/chrome/chrome
node video-safe.mjs      # must print CLEAN
node qa.mjs              # only the Welcome and Thank you slides may be flagged
node align-check.mjs     # DRIFT, CHROME and CLIPPED must all be empty
npm run build:html
node preview.mjs && node scripts/build-preview-page.mjs
```

Then read the rendered shots. A deck is never signed off from the source.

**And the harnesses are not enough on their own.** Every automated check passed on
a deck that still had nine slides with clipped panels, text under the nav buttons,
a figure centred by a Tailwind class that framer-motion was overwriting, and a
five-versus-six instruction count that contradicted itself across four slides.
What found those was agents reading the rendered PNGs slide by slide, with a
second pass whose only job was to refute the first. Budget for that pass.
Keep `deck.config.json`'s `slideCount` current: every harness reads it.
