# Rules register

Purpose: every standing review rule from the NxtWave slide repo, in one list, classified by where the shared deck engine (`deck-engine/`) should enforce it, so a past review point is fixed ONCE (a part or template does it by construction), caught by an automatic check (`check-deck.mjs`), or left as a human judgement item.

Adding a rule: add ONE row to the table of its area (next free ID, source with its rule number, scope), then implement it in the place named in the Enforced-by column (a part, a template/layout, a check in `check-deck.mjs`, or the human checklist at the bottom). If the same rule arrives again from another review, add the new source to the existing row instead of a new row.

Enforced-by classes: PART = an engine component does it by construction; TEMPLATE = a standard layout/frame does it; CHECK = an automatic check fails the deck; HUMAN = review checklist. Where a rule has two layers the primary class comes first and the backup in brackets. Checks marked "(new)" do not exist yet; the others are existing harnesses in `deck-engine/*.mjs` or the checks named in the engine brief.
Status: `done-in-S5-code` = already implemented in the Session 5 (Cloud Networking & VPC) deck or the kit it was copied from, so it must be PORTED into the engine; `todo` = not yet implemented anywhere reliable. Scope: `cloud` = Cloud Computing course, `python` = Python course, `all courses` = repo-wide.
Source key: `cloud R#` = `Outputs/cloudcomputing/workflow/skills/cloud-computing-course/SKILL.md`; `python R#` = `Outputs/python/workflow/skills/python-course/SKILL.md`; `content rule #` = `.claude/skills/slide-content-rules/SKILL.md` (indexed in `RULES.md`); `generate-slides #` = `.claude/skills/generate-slides/SKILL.md` section; `G#` = `~/Downloads/slides-5-56-corrections.md`; `FS Part 1.#` = `fs-team-ppt-session-5-review-prompt.md`; `5.md rule #` = `~/Downloads/5.md` (these two are R7 and R8 in the cloud skill); `S4/S5 decision #` = the session `CLAUDE.md` Decisions list; `memory X` = the user's memory file X.

## Counts

Total rules: **141**. PART **63**, TEMPLATE **20**, CHECK **27**, HUMAN **31**. Status: done-in-S5-code 74, todo 67.

## Chrome & frames

| ID | Rule | Source | Scope | Enforced by | Status |
|---|---|---|---|---|---|
| CHR-01 | Slide 2 of every deck is the session title frame, right after Welcome | cloud R9 | all courses | TEMPLATE (layout `title` (+ CHECK title-slide)) | done-in-S5-code |
| CHR-02 | Welcome is the brand frame and carries no topic; the welcome line is written once | S5 decision 5; content rule 21 | all courses | TEMPLATE (layout `brand`) | done-in-S5-code |
| CHR-03 | Recap frame shows the presenter illustration (2:3, same box as the Key Takeaways student) | cloud R6 | cloud | TEMPLATE (layout `recap`) | done-in-S5-code |
| CHR-04 | Recap, agenda, breakers and Key Takeaways carry the titles only, read from one `meta.agenda` array; sub lines stay in the source | cloud R5 and lesson 4; S5 decision 1; TEXT_GUIDELINES 4a; content rule 20 | all courses | TEMPLATE (`agenda`/`recap`/`takeaways`/`breaker` all read `meta.agenda`) | done-in-S5-code |
| CHR-05 | Key Takeaways = the agenda items word for word, check disc + bold head, student anchored to the slide foot, clear of video area and player bar | content rule 20; generate-slides 2c | all courses | TEMPLATE (layout `takeaways`) | done-in-S5-code |
| CHR-06 | Agenda mark says `Agenda` large over the session name small (shrinks, never clipped); points centred on y 366 with equal gaps, never under the speaker box | content rule 39 | python / kit decks | TEMPLATE (layout `agenda` (+ CHECK agenda-check)) | todo |
| CHR-07 | Agenda is static: no step-through, selected point, highlight or Next/Replay buttons | content rule 44 | all courses | TEMPLATE (layout `agenda`) | done-in-S5-code |
| CHR-08 | Quiz frame is the "Quiz Time!" replica (clock glyph + `Your turn`, no timer unless asked) and carries no question, options or answer | generate-slides 2c (+ addendum); content rules 16, 28 | all courses | TEMPLATE (layout `quiz`) | done-in-S5-code |
| CHR-09 | One or two quiz frames; the last sits immediately before Key Takeaways | content rule 18 | all courses | CHECK (quiz-position (new)) | todo |
| CHR-10 | Deck closes on Next Session, Thank You, All the Best; no feedback slide (version 0 retired) | content rule 41 (retired 2026-10-30) | all courses | TEMPLATE (no `feedback` layout exists) | done-in-S5-code |
| CHR-11 | Section breakers carry the title only; the practical's divider is a breaker so the bar keeps one segment per agenda point | cloud lesson 4; S5 decision 6 | all courses | TEMPLATE (layout `breaker` (`lab`)) | done-in-S5-code |
| CHR-12 | Section bar: one equal segment per agenda point, 4px, no fill, hover preview of the breaker, click jumps to it | generate-slides 2c; RULES.md process table | all courses | PART (SectionBar) | done-in-S5-code |
| CHR-13 | Header holds the kicker and title only (22px Title Case navy kicker, one gradient divider always, no tick, no edge bars); the lead goes to Space-1 | content rules 32.1, 33 | all courses | TEMPLATE (slide header) | done-in-S5-code |
| CHR-14 | The concept and sub-concept are pinned to the top of every slide (kicker = concept) | content rule 19 | all courses | TEMPLATE (slide header) | done-in-S5-code |
| CHR-15 | Deck chrome is grey and never doubles the session name | content rule 7 | all courses | PART (Footer / chrome) | done-in-S5-code |
| CHR-16 | Footer NxtWave mark is 18px tall, bottom-right, white on a dark ground, on every slide | content rule 50 | all courses | PART (Footer) | done-in-S5-code |
| CHR-17 | Every slide sits on one of three grounds (paper, closing gradient, welcome mesh); no slide paints its own wash, blur or orb | content rule 48 | all courses | TEMPLATE (ground per layout) | done-in-S5-code |
| CHR-18 | Template colours only, taken from design tokens; no hex literal in deck or custom code | content rule 37; generate-slides 2 | all courses | CHECK (no-hex lint on `custom/` (new)) | todo |
| CHR-19 | Typefaces: Sora SemiBold titles, DM Sans SemiBold headings, DM Sans Medium body, Fira Code code, Ubuntu Mono code title bars; two weights only | content rule 34 | all courses | PART (theme tokens) | done-in-S5-code |
| CHR-20 | One title size per slide type, from the template tokens, never a kit token beside a template number | memory same-size-per-slide-type (user 2026-10-12, not yet in a rule file) | all courses | PART (theme tokens per layout) | todo |
| CHR-21 | Speaker box (x 913..1280, y 0..220) stays empty on every slide | content rule 32 | all courses | CHECK (video-area) | todo |
| CHR-22 | On-slide controls never overlap the player bar, footer or mark; student art clear of both | python R5c.2; generate-slides 7 | all courses | CHECK (controls-clear) | done-in-S5-code |
| CHR-23 | Rendered copy never names a slide's position or another session, and prints no session number | content rules 22, 2b, 12b | all courses | CHECK (copy-lint (new)) | todo |
| CHR-24 | `slideCount` stays current so harnesses do not skip the tail | KIT.md; RULES.md | all courses | PART (engine counts slides from `deck.json`) | todo |

## Text & wording

| ID | Rule | Source | Scope | Enforced by | Status |
|---|---|---|---|---|---|
| TXT-01 | No spaced em dash anywhere (use colon or comma) | content rule 1 | all courses | CHECK (copy-lint (new)) | todo |
| TXT-02 | No full stop at the end of a line of slide copy; two sentences on one line become two lines | content rule 36 | all courses | CHECK (copy-lint (new)) | todo |
| TXT-03 | Every sentence, point, chip, label, subtext and split piece starts with a capital | cloud R8.4; 5.md rule 4; content rule 33 | all courses | CHECK (capitals) | todo |
| TXT-04 | Multiword chips, labels, row labels, kickers and titles are Title Case (articles and prepositions under four letters lowercase; after a colon capitalised) | cloud R8.4; 5.md rule 4; content rule 33 | all courses | CHECK (capitals) | todo |
| TXT-05 | Identifiers, code, CIDRs and resource names keep their own form, written inline with backticks and drawn in mono | cloud R8.4; S5 `Mono` | all courses | PART (inline-code renderer (`Mono`)) | done-in-S5-code |
| TXT-06 | No underlines anywhere: emphasis is colour and weight; only the header gradient divider remains | content rule 49 | all courses | PART (base CSS (no text-decoration)) | done-in-S5-code |
| TXT-07 | Code never shows a ligature (`==`, `>=`, `!=` stay separate characters) | content rule 40 | all courses | PART (base CSS (+ CHECK ligature-check)) | done-in-S5-code |
| TXT-08 | A heading never wraps: shorten the words, never the font or widen the box | content rule 35 | all courses | CHECK (title-wrap (new)) | todo |
| TXT-09 | Never call the audience a stranger | content rule 2 | all courses | CHECK (copy-lint (new)) | todo |
| TXT-10 | No Latin abbreviation (`e.g.`, `i.e.`, `etc.`, `via`, `vs.`, `per`), no copy opening on `The`, max 20 words and two commas per string | TEXT_GUIDELINES 3d, 4a-bis (RULES.md writing rules) | all courses | CHECK (copy-lint (new)) | todo |
| TXT-11 | Plain literal English: no idiom, phrasal verb, metaphor, casual aside or company-presentation voice; a title is the topic, a line is the fact | content rules 12b, 26, 29 | all courses | HUMAN | todo |
| TXT-12 | Never paraphrase the TR: strings are verbatim; a long point splits at the TR's own clause boundary, never reworded | cloud lesson 1; R7 note (user 2026-11-04) | cloud | HUMAN | todo |
| TXT-13 | Agenda items are content words only (no articles or helping verbs); a one-line sentence joins clauses with a comma | TEXT_GUIDELINES 4a, 4b | all courses | CHECK (copy-lint (new)) | todo |
| TXT-14 | Every code panel says where the code lives or runs (language, file path or UI location) | content rule 31 | all courses | PART (CodeBlock requires `where`) | todo |
| TXT-15 | One panel per terminal, with the folder path shown | content rule 3 | all courses | PART (Terminal) | todo |
| TXT-16 | A technology named on a slide carries its logo, a PNG from the central library, with its name beside it | content rules 12, 13 | all courses | CHECK (logo-present (new)) | todo |
| TXT-17 | Logos keep their aspect ratio: set one dimension, never both; shrink rather than squeeze | cloud R8.5; 5.md rule 5 | all courses | PART (Logo (+ CHECK logo-aspect)) | done-in-S5-code |
| TXT-18 | Labels are DOM text, never svg `<text>` (harnesses, text audit and edit mode read DOM) | cloud lesson 7 | all courses | PART (diagram renderer) | done-in-S5-code |
| TXT-19 | Name a later problem, never open it; one new named term per slide, glossed in plain words before the formal name | content rules 4, 24; PEDAGOGY 2b | all courses | HUMAN | todo |
| TXT-20 | One idea per slide, one item per slide in a list of items; nothing arrives assembled | content rules 5, 25 | all courses | HUMAN | todo |
| TXT-21 | Every concept opens on a felt need and closes on proof; the deck is one chain | content rule 23; PEDAGOGY 2 | all courses | HUMAN | todo |
| TXT-22 | Python outputs shown on slides are real runs (CPython), re-run after any change | python R3 | python | HUMAN | todo |

## Layout & spacing

| ID | Rule | Source | Scope | Enforced by | Status |
|---|---|---|---|---|---|
| LAY-01 | Content lives in zones: Space-1 first, Space-2 second, Space-3 last; nothing above y 162 or past x 880 there; left edge 64, right edge 1216 | content rule 32 | all courses | TEMPLATE (layout grid) | done-in-S5-code |
| LAY-02 | Content is centred in Space-1 (vertical centre y 434), not dumped top-left | content rule 32.6 | all courses | TEMPLATE (layout grid) | done-in-S5-code |
| LAY-03 | One alignment per slide: lead, text, code boxes and captions share it (left for text/lists/code, centred for a diagram or single statement) | content rule 38; RULES.md `mixed-align-check` | all courses | CHECK (mixed-align) | done-in-S5-code |
| LAY-04 | The lead and the body are one block; the points column sits directly under the lead | cloud lesson 5; `SlideLead` | all courses | TEMPLATE (`points`/`lead` layouts) | done-in-S5-code |
| LAY-05 | No text outside its box or truncated, at any step (no ellipsis, no clipping fix) | memory no-box-overflow-rule; generate-slides 7; FS Part 1.2; 5.md rule 7 | all courses | CHECK (overflow) | done-in-S5-code |
| LAY-06 | Nothing overlaps: icons, chips, labels, arrows, illustrations, borders and parent boxes keep padding; no label on a code box | FS Part 1.2; R7.2; 5.md rule 7; G slide 24; content rules 42, 47 | all courses | CHECK (overlap (overlap-check)) | done-in-S5-code |
| LAY-07 | A highlight (glow, ring, tint) matches the exact bounds of the element it highlights, not its parent | content rule 43 | all courses | PART (Lit / Ring component) | done-in-S5-code |
| LAY-08 | Every point fits in two lines at most (widen the points box or split) | FS review slides 8, 12 | all courses | CHECK (two-line-points) | todo |
| LAY-09 | Left points and right picture in proportion; no large empty area, no crowded stage | R7.6; G5; FS Part 1.6 | cloud | HUMAN | todo |
| LAY-10 | Split a slide or a point rather than crowd it (readability over density) | R7.5; FS Part 1.5; 5.md slide 8 | cloud | HUMAN | todo |
| LAY-11 | Bullets are semantic, not a plain blue dot: icon per point, ring/outlined, tick for done steps, varied styles | G7; S5 prompt 2; S5 decision 8 | cloud | PART (Points / Bullet (`kind`)) | done-in-S5-code |
| LAY-12 | Each bullet is vertically centred on the first line of text (cap-height and x-height centre) | G7 | cloud | PART (Bullet) | done-in-S5-code |
| LAY-13 | Option letter and text share one centre line with equal padding; options centred; `nowrap` keeps one line | generate-slides 2b.6 | python | PART (Option / Vote) | done-in-S5-code |
| LAY-14 | One size per role (code 15, output 16); never a per-call font size | generate-slides 2b.7 | python | PART (Code / theme tokens) | todo |
| LAY-15 | One cluster = one container (`Group`); the cluster being worked on lights (`Group active`, `Focus`) | generate-slides 2b.1-3 | python | PART (Group / Focus) | todo |
| LAY-16 | Dashed rims 1.5px, few thin dotted lines; prefer a thin solid line or tint | FS Part 1.4; R7.4; S5 decision 9 | cloud | PART (diagram box style) | done-in-S5-code |
| LAY-17 | Phones at 1 : 2.06 with a live status-bar clock; no truncated row | generate-slides 2b.13 | python | PART (Phone figure) | todo |
| LAY-18 | On-slide controls centred under the figure, named from the analogy | python R5c.2-3 | python | HUMAN | todo |
| LAY-19 | A numbered container keeps its number, arriving with the container | python R5c.1 | python | HUMAN | todo |
| LAY-20 | Content moves nowhere: no drag-to-move slide elements | memory movable-content-off | all courses | PART (absent from engine) | todo |

## Figures & icons

| ID | Rule | Source | Scope | Enforced by | Status |
|---|---|---|---|---|---|
| FIG-01 | Human figures are realistic 3D library renders (`lib:` icons), one source per deck; no abstract or flat 2D people | R7.1; FS Part 1.1; G3 | cloud | PART (diagram `shape:'person'` from the library) | done-in-S5-code |
| FIG-02 | Python people are Character Lab characters (`Idling`, head-local props); phones and characters never idle-animate on harness URLs | generate-slides 2b.12; memory PF 29 | python | PART (Cast figure) | todo |
| FIG-03 | Section figures reuse ONE drawing (`VpcScene`, `ContainerHost`) so every slide of a section speaks the same picture | S5 CLAUDE figures; S4 CLAUDE figures | cloud | PART (kit figure `VpcScene`) | done-in-S5-code |
| FIG-04 | Arrows are routed from the rim of the source to the rim of the target from the boxes' own numbers, never placed by eye; a label's arrow uses a fixed label width | generate-slides 2c; content rule 42 | all courses | PART (diagram router) | done-in-S5-code |
| FIG-05 | Arrow heads are small (about 9px on a 2.5-3px line), absolute units; the line meets the head on its axis with no gap | content rules 45, 46 | all courses | PART (Arrow) | done-in-S5-code |
| FIG-06 | Every arrow head renders, faces the right way and lands on its target | R7.3; FS Part 1.3 | all courses | PART (Arrow (+ CHECK overlap)) | done-in-S5-code |
| FIG-07 | Arrow direction matches the concept: one-way, two-way, return traffic verified against the fact | R8.6; 5.md rule 6 | cloud | HUMAN | todo |
| FIG-08 | Arrow entry draws the line then the head; exit removes the head then the line; looping arrows keep that order every cycle | G8 | cloud | PART (Arrow) | done-in-S5-code |
| FIG-09 | Parallel paths use distinct colours; the highlighted path alone is lit, the rest fade out | G4 | cloud | PART (diagram `lit`/`dim` steps) | done-in-S5-code |
| FIG-10 | A dot or packet travels along its arrow's own path | G slide 54 | cloud | PART (diagram `packets`) | done-in-S5-code |
| FIG-11 | Gauges move the needle only (not the whole dial) | G slide 50 / slides 5, 47 | cloud | PART (kit figure `NeedleGauge`) | done-in-S5-code |
| FIG-12 | Orange means one thing on a slide (the highlight), never the dominant colour | R8.2; 5.md rule 2 | cloud | HUMAN | todo |
| FIG-13 | Surfaces are lit from the top-left (highlight, ramp, tinted shadow, two hairlines) | STYLE_GUIDE section 9 | all courses | PART (shading tokens) | todo |
| FIG-14 | Icons come from the library (lucide or `lib:` 3D renders) and every asset is fetched into the central library first | content rule 13; generate-slides 4 | all courses | PART (`IconRef` resolver) | done-in-S5-code |
| FIG-15 | A figure draws the slide's own concept and the TR's Visual Guidance elements; it must earn its place | content rule 8; cloud lesson 3; python R1 | all courses | HUMAN | todo |
| FIG-16 | Explain technical visuals with icons, elements and connections, not text; no empty or plain panel (fill with icons, never invented content) | R7.7; G3; G5; S5 prompt 2 | cloud | HUMAN | todo |
| FIG-17 | Illustrations are researched before drawn; the source says why that form | content rule 27 | all courses | HUMAN | todo |
| FIG-18 | Every custom figure is screenshotted and looked at, at step 0, mid-run and fully revealed | content rules 10, 17; generate-slides 6c | all courses | HUMAN | todo |
| FIG-19 | One visual language across the deck: spacing, illustration quality, technical representation | R7.10; FS Part 1.10 | cloud | HUMAN | todo |

## Analogies

| ID | Rule | Source | Scope | Enforced by | Status |
|---|---|---|---|---|---|
| ANA-01 | Analogy slide = kicker, title, two pictures and nothing else: no lead, no caption pills, no `Same idea` words (the arrow between stays) | cloud R3 | cloud | TEMPLATE (layout `analogy`) | done-in-S5-code |
| ANA-02 | Familiar scene left, concept right; every clause of the TR's analogy is a tag inside the picture it describes, TR's words, matched parts lined up | S5 decision 2; cloud lesson 2 | cloud | PART (analogy tag component (+ HUMAN)) | done-in-S5-code |
| ANA-03 | Analogy visuals are concrete real-world scenes, not labelled boxes; the object is drawn as the thing it is | G4; S5 prompt 1; python R5/R5b | all courses | HUMAN | todo |
| ANA-04 | One analogy pair lit per step, the rest faded | S5 decision 8; G4 | cloud | PART (analogy `lit` steps) | done-in-S5-code |
| ANA-05 | Analogy loops restart at once and keep quiet idle motion | R8.1; R8.8 | cloud | PART (loop hook) | done-in-S5-code |

## Tables

| ID | Rule | Source | Scope | Enforced by | Status |
|---|---|---|---|---|---|
| TBL-01 | Highlight a table row only when the content gives it a meaning; never the last row by default; no orange bar or blue tint without a content purpose | R8.3; 5.md rule 3 and slides 17, 25, 57, 67 | all courses | CHECK (table-last-row) | done-in-S5-code |
| TBL-02 | An arriving row lights for about 1.1s, then clears | S5 decision 10 | cloud | PART (VisualTable) | done-in-S5-code |
| TBL-03 | Every table is the one table design: header, row styling, borders, spacing, icons in header, rows and cells | G6; S5 prompt 3 | cloud | PART (VisualTable (`table` figure)) | done-in-S5-code |
| TBL-04 | Table rows appear sooner and faster (560ms rows) | G6; S4 decision 8 | cloud | PART (VisualTable) | done-in-S5-code |
| TBL-05 | A cell highlight rings the cell's own words, not the whole row | content rule 43; S5 T18-1 | all courses | PART (`table` highlight on cell) | todo |
| TBL-06 | A highlighted row or cell is justified by what the content says (judge each) | R8.3 verify items | cloud | HUMAN | todo |

## Screenshots

| ID | Rule | Source | Scope | Enforced by | Status |
|---|---|---|---|---|---|
| SHT-01 | A configuration walkthrough slide shows ONE sharp enlarged capture with orange rings: no zoom copy, no number badges, no blur | R7.9; FS Part 1.9 | cloud | TEMPLATE (layout `screenshot`) | done-in-S5-code |
| SHT-02 | Screenshot layout: step label on top, divider, the capture, explanation box below; step/capture/box are one group centred, sized to y 221-648, box at least 960 wide, scale never above 1 | G9; S4 decision 12 | cloud | TEMPLATE (layout `screenshot`) | done-in-S5-code |
| SHT-03 | Highlights are orange (`colors.accent`), never red, including red frames baked into the capture (hue-shifted in the PNG, originals kept) | content rule 51; cloud R4 | all courses | PART (image pipeline + ring component) | todo |
| SHT-04 | Captures are served sharp (2x Lanczos + light unsharp), cropped in source pixels, frame square-cornered, nothing clipped | cloud R4; S4 decision 12 | cloud | PART (image pipeline) | todo |
| SHT-05 | A ring never crops or runs outside its capture | G slide 35 | cloud | CHECK (overflow) | done-in-S5-code |
| SHT-06 | Never redraw or retouch a capture; terminal captures keep the prompt and folder; every process is shown with a real screenshot | content rules 3, 11, 30; S5 `ShotCard` | all courses | HUMAN | todo |
| SHT-07 | The TR's Important Note renders as the standard note box on the screenshot frame | S5 `NoteBox` | cloud | TEMPLATE (`screenshot.note`) | done-in-S5-code |

## Motion & steps

| ID | Rule | Source | Scope | Enforced by | Status |
|---|---|---|---|---|---|
| MOT-01 | Loops restart immediately: no rest beat or repeat delay between cycles | R8.1; 5.md rule 1 and slide 7 | cloud | PART (`Traveller`/`useLoop` (`repeatDelay: 0`)) | done-in-S5-code |
| MOT-02 | Quiet continuous loops on relevant icons and technical parts, so a figure never looks frozen after its build; never distracting | R8.8; R7.8; FS Part 1.8; G2 | cloud | PART (node `loop`) | done-in-S5-code |
| MOT-03 | Motion carries meaning: its sequence explains the concept | G2; R7.8; S5 prompt 1 | cloud | HUMAN | todo |
| MOT-04 | Logos never move (the AWS mark's smile is static) | FS Part 1.8; S5 decision 9 | cloud | PART (Logo has no motion class) | done-in-S5-code |
| MOT-05 | Nothing pops: swaps ease in, anything leaving fades out | generate-slides 2b.9 | all courses | PART (entrance layer) | done-in-S5-code |
| MOT-06 | Entrances run in reading order (top to bottom, left to right); the stepped entrance holds a finished block | cloud session 1 `entrance.ts`; S5 decision 4, 8 | cloud | PART (entrance layer) | done-in-S5-code |
| MOT-07 | Entrance timing stays at the pre-2026-10-22 1.5s version unless a slide is named | memory cc-entrance-timing-keep | cloud | PART (entrance layer) | done-in-S5-code |
| MOT-08 | Motion runs at the explanatory tier (about double the UI skill's numbers) | generate-slides 4b | all courses | PART (motion tokens) | done-in-S5-code |
| MOT-09 | Auto-animation toggle (key `P`): ON in presenter view, OFF in student view, ON on phones; the toggle always overrides | G12; S4 decision 7 | cloud | PART (player autoAnim) | done-in-S5-code |
| MOT-10 | Each press plays one step (element or group, reading order); auto and manual keep the same step count and order; left arrow reverses with G8 order | G12 | cloud | PART (step registry (`steps`)) | done-in-S5-code |
| MOT-11 | Highlight-driven slides use one step per highlight; the rest fade | G12; G4 | cloud | PART (diagram `lit` steps) | done-in-S5-code |
| MOT-12 | A finished block is never replayed on a press (no auto-off flash) | S4 decision 9 | cloud | CHECK (auto-off-flash-check) | done-in-S5-code |
| MOT-13 | Every animation registers as a step; auto-play and arrow keys both drive it | G12 | cloud | CHECK (auto-anim-check) | done-in-S5-code |
| MOT-14 | Code walkthrough: highlight line 1 with its explanation, then line 2, and so on | G10; slides 20, 21 | cloud | PART (CodeBlock line steps) | todo |
| MOT-15 | Small interactive visual elements wherever scope allows (slides 20 and 21 are the reference) | G11 | cloud | HUMAN | todo |
| MOT-16 | Departed slides unmount; a crossfade never leaves two slides mounted or rewinds a finished one | memory slide-mode-stacking-bug | all courses | CHECK (nav-stress) | done-in-S5-code |
| MOT-17 | Autoplay waits for a press's movement to settle; movement inside a press runs through one phase hook | generate-slides 2b.11 | python | PART (step registry) | todo |
| MOT-18 | Nothing on a frame advances its own state on a timer; a press is the only change (idle loops allowed) | python R5c.4 | python | PART (python `steps` mode) | todo |

## Player & controls

| ID | Rule | Source | Scope | Enforced by | Status |
|---|---|---|---|---|---|
| PLY-01 | `hideModeSwitch: true`: the step/slide switch is hidden, never removed (button, `S` key, `?nav=steps` stay) | cloud R1 | cloud | PART (player option) | done-in-S5-code |
| PLY-02 | Presenter and student views, edit/skip/delete/download, comments | generate-slides 2d | all courses | PART (player) | done-in-S5-code |
| PLY-03 | The built HTML saves into itself (Chrome/Edge), edits keyed by original words, undo/redo; never claim every browser | generate-slides 2d (user 2026-10-27/28) | all courses | PART (fileSave (+ CHECK file-save-check)) | done-in-S5-code |
| PLY-04 | Three navigation routes: keyboard, two-finger trackpad swipe, touch swipe; one gesture one slide, never over an on-slide control | generate-slides 2, 7; RULES.md | all courses | PART (useGestureNav (+ CHECK gesture-check)) | done-in-S5-code |
| PLY-05 | Control bar works on phones in both orientations (44px targets, safe areas, never over slide controls) | python log 2026-10-05; memory mobile-nav | all courses | PART (player (+ CHECK phone-nav-check)) | todo |
| PLY-06 | Slide menu carries the Auto-play On/Off option, On at first load, kept per deck | RULES.md process table; SLIDE_WORKFLOW stage 5 | all courses | PART (player menu) | done-in-S5-code |
| PLY-07 | Controls are clear of the footer and mark (see CHR-22) | python R5c.2 | all courses | CHECK (controls-clear) | done-in-S5-code |

## Process

| ID | Rule | Source | Scope | Enforced by | Status |
|---|---|---|---|---|---|
| PRC-01 | Pull main, branch from it, work there; never edit on main; a kit/engine change is a PR | branch-from-main; RULES.md | all courses | HUMAN | todo |
| PRC-02 | No generation before the slide-wise plan is signed off; plan lives at `<course>/session_plans/<session>/plan.md` | SLIDE_WORKFLOW; CLAUDE.md | all courses | HUMAN | todo |
| PRC-03 | Durable feedback is offered to a named file and recorded with its reason before it is applied; a new rule is a row here | generate-slides 8; RULES.md how-to | all courses | HUMAN | todo |
| PRC-04 | A delivered deck is frozen; a new rule never re-opens it unless the user names the deck | RULES.md top | all courses | HUMAN | todo |
| PRC-05 | Content is never invented, changed or deleted; splitting a slide or point is allowed | G1; S5 prompt hard rules 1-4 | cloud | CHECK (text-diff against the TR dump (new)) | todo |
| PRC-06 | Render the reference first; strings are its verbatim; Visual Guidance is the figure spec; render every presenter card (`.slide, .pcard`) and match the counter | cloud R2; generate-slides 6b; python log 2026-10-05 | all courses | HUMAN | todo |
| PRC-07 | Verify by rendering, never by reading; one-slide screenshots while iterating, full sweep once; check step 0, mid and fully revealed | content rule 10; generate-slides 6c, 7 | all courses | HUMAN | todo |
| PRC-08 | A correction on one slide is a correction on every slide of that shape: fix the class (in the engine part), not the instance | generate-slides 6d; FS/5.md "check every slide" | all courses | HUMAN | todo |
| PRC-09 | When content changes, chase the dependents (agenda, takeaways, counts) | content rule 9 | all courses | CHECK (agenda-consistency via `meta.agenda` (new)) | todo |
| PRC-10 | A new session starts from the latest session; the dev port is checked before trusting a screenshot | cloud R2, lesson 8 | cloud | PART (engine scaffold `new-deck`) | todo |
| PRC-11 | The harness gate runs clean before a deck is reported done (typecheck, qa, video-safe, align, mixed-align, overlap, controls-clear, overflow, gesture, agenda, ligature, auto-anim) | generate-slides 2b gate, 7 | all courses | CHECK (check-deck (all)) | todo |
| PRC-12 | A new slide type, figure or transition is registered in the engine and its gallery | content rule 14; slide-types README | all courses | HUMAN | todo |
| PRC-13 | Captures keep the full uncropped original beside the cropped asset | content rule 11 | all courses | HUMAN | todo |

## Conflicts

Where two sources disagree, which one currently wins and why. Engine decisions needed are marked **engine**.

1. **Verbatim TR text vs capitals (R8.4) and punctuation rules.** The user's rule is "never paraphrase the TR" (cloud lesson 1, R7 note), but R8.4 (5.md, 2026-11-04) requires capitals and Title Case on chips/labels, and content rules 1 and 36 move dashes and final full stops. Winner: R8.4 for letter case only ("overrides verbatim for letter case only"), rules 1/36 for punctuation, wording otherwise stays verbatim. Exception on record: S4 decision 10 kept a user-supplied full stop on T10-1 "as written", and S5 T20-1b is the user's case reference and was not edited though it fails R8.4. **engine**: `check-deck` capitals needs a per-string override flag.
2. **Screenshots: G9 two pictures vs R7.9 one capture vs content rule 11 crop.** G9 (2026-11-03) asked for two screenshots side by side; S4 built them as capture plus zoom (ZoomBadge numbers), then rounds 3-5 (2026-11-04) removed zoom and numbers, restored whole-capture orange rings. R7.9 / FS Part 1.9 (2026-11-04) say ONE enlarged capture with rings, no zoom, no numbers, and says it replaces the G9 pattern. Winner: R7.9 (latest, from the FS team) in cloud decks. Content rule 11 ("crop to the point, at most one box") is overridden for cloud decks (S4 2026-10-30: every capture FULL, several rings allowed). Rule 11 still holds for python/other courses.
3. **Agenda content: titles only vs full TR lines.** Cloud R5, lesson 4, S5 decision 1 and VH decision 1 say titles only; S4 decision 2 built agenda/recap/takeaways with the TR's full lines ("do not shorten") and its Takeaways still use `full`. S4's later decision 1 kept the titles-only agenda1. Winner: titles only (R5 explicitly "holds even when a request says use the text verbatim"). Note S4's `Takeaways full` is a leftover to retire in the engine (**engine**: no `full` option).
4. **Agenda design: kit arc vs `AgendaColumns`.** Content rules 39/44 specify the arc agenda (static, centred on y 366); the cloud decks since 2026-10-30 use the version-1 `AgendaColumns` (user deleted agenda0). Winner: version 1 for cloud, rule 39/44 for python and kit decks. **engine**: agenda layout needs a `variant` per course.
5. **Quiz design: ClassroomQuiz replica vs `QuizCard`.** generate-slides 2c and content rule 28 name the `ClassroomQuiz` replica (slide 25 of the virtualization reference); VH decision 3 and S4 decision 1 use `QuizCard "Quiz Time!"` with `quiz-cube.png` (version 1, user 2026-10-30, version 0 deleted). Winner: the version 1 `QuizCard` in cloud; generate-slides 2c text is stale for cloud. **engine**: one `quiz` layout, variant per course.
6. **Feedback slide.** Content rule 41 is retired (2026-10-30: no feedback slide until the user specifies version 1), but S5 decision 7 still lists "the kit `FeedbackSlide`" among the standard closing frames and S4 keeps `feedback1` by the user's review-pair choice. Winner: rule 41 retired (newest, explicit); the engine has no feedback layout. Unverified: whether S5's built deck still carries one (its decision 7 text predates the retirement).
7. **Case style: Title Case vs sentence case.** Fundamentals (2026-10-16) set "sentence case on every label" and the text audit checks it; R8.4 (2026-11-04) and content rule 33 require Title Case on multiword chips, labels, kickers and titles. Winner: R8.4 (newest, from the review), sentences/points start with a capital only. **engine**: `capitals` check must distinguish label vs sentence.
8. **Animation amount.** G2 says "as many meaningful micro-animations as possible"; R7.8/R8.8 say purposeful, quiet, not distracting; the 2026-10-22 "purposeful motion only" pass and the "keep the 1.5s timing" memory limit it. Winner: purposeful and quiet (one loop per figure, logos static); G2 is read as "every element carries a meaningful animation", not volume.
9. **Table timing.** G6 wants tables to appear sooner and faster; cloud session 1 set a 2-4 s cadence (2026-10-22, later restored to 1.5 s). Winner: 1.5 s entrance timing (memory cc-entrance-timing-keep) with 560 ms table rows (S4 decision 8).
10. **TR visual guidance vs enhancing it.** Cloud lesson 3 says draw exactly the TR's Visual Guidance, not a nicer picture; G3 (2026-11-03) says the TR visual is not absolute, enhance it with icons and animation. Winner: G3 (later), keeping the TR's elements and labels in the drawing, adding icons and motion.
11. **No new content vs fill empty space.** G1 forbids invented content; G5 asks to fill empty panels. Winner: G1; fill with icons and illustration only, never new text.
12. **Highlight colour.** Content rule 51 makes screenshot highlights orange; R8.2 says orange must not dominate. Compatible: orange = the one highlight meaning on a slide; blue/neutral for everything else.
13. **Step/slide switch hidden vs step-by-step playback.** R1 hides the switch (decks have no builds, `revealEveryStep`), G12 requires arrow-key stepping. Compatible via the auto-animation toggle (P): press steps exist when auto is OFF; the mode switch stays hidden.
14. **Press-driven vs self-running motion.** Python R5c.4 (nothing advances on a timer) vs cloud decks that auto-play entrances and loops. Course-specific: python = press only; cloud = auto, with MOT-09 steps. **engine**: course flag.
15. **People: 3D library renders vs Character Lab vs no faces.** Cloud R7.1/FS Part 1.1 require the realistic 3D library renders; Python uses Character Lab characters (generate-slides 2b.12); cloud session 1 (2026-10-16) went "no people/no faces". Winner: per course, R7.1 for cloud sessions 4 onwards.
16. **Quiz count.** Content rule 18 requires one or two quiz frames; rule 28 and the cloud decks drop the second in some sessions (S3 deleted the quiz entirely on the user's word). Winner: the user's per-deck word over rule 18; the check `quiz-position` must allow a per-deck override.
17. **R7.3 arrow check vs rule 42 etc.** No conflict, but FS Part 1.4 says reduce dotted strokes "by 1 pt" on one slide while S5 decision 9 set dashed rims 1.5px deck-wide; deck-wide value wins.

## Added 2026-11-06 (Session 6 corrections)

| ID | Rule | Where |
|---|---|---|
| TXT-30 | Every word of a chip / tag / figure label capitalised (content rule 56) | CHECK: R8.4 title-case, strict on chips |
| LAY-30 | A chip stays inside its card (content rule 57) | CHECK: `chip inside its card` |
| FIG-30 | Official marks in the Slide 15 tile; LB / ALB / NLB / Route 53 Resolver / EC2 mapping (content rule 54) | HUMAN |
| FIG-31 | Blue-only text highlight (rule 55); no table highlight unless asked (rule 60) | HUMAN / CHECK R8.3 lists highlights |
| FIG-32 | People distinct, adult in adult roles, facing the visual (rule 58) | HUMAN |
| FIG-33 | No grid-line backgrounds, no spinning charts, physical motion (rule 59) | HUMAN |
| ENG-30 | Points-layout figures scale to fit (`Fit`), Tailwind scans `custom/`, bare imports dedupe to the engine | PART (engine) |

## Human review checklist

The 31 HUMAN rows grouped into 14 review questions (row IDs in brackets). Everything else is built in or checked automatically.

- [ ] Wording is plain, literal, professional, verbatim to the TR, splits only at TR clause boundaries (TXT-11, TXT-12)
- [ ] No later problem opened early; one new term per slide; one idea per slide; need-to-proof chain holds (TXT-19, TXT-20, TXT-21)
- [ ] Python outputs are real runs (TXT-22, python only)
- [ ] Left points and right picture balanced, no empty or crowded area; dense slides split (LAY-09, LAY-10)
- [ ] Python extras: controls named from the analogy, numbered containers keep their number (LAY-18, LAY-19, python only)
- [ ] Every arrow's direction matches the technical fact (FIG-07)
- [ ] Orange used for one meaning only, never dominant (FIG-12)
- [ ] Each figure draws the slide's own concept and the TR's Visual Guidance, explained by icons not text, one visual language, researched form (FIG-15, FIG-16, FIG-17, FIG-19)
- [ ] Every custom figure screenshotted and read at step 0, mid-run and fully revealed (FIG-18, PRC-07)
- [ ] Analogy visuals are concrete real scenes, not labelled boxes (ANA-03)
- [ ] Each highlighted table row or cell is justified by its content (TBL-06)
- [ ] Screenshots are real, unretouched, prompt and folder kept, originals stored (SHT-06, PRC-13)
- [ ] Motion explains the concept; interactive elements added where scope allows (MOT-03, MOT-15)
- [ ] Session 6 standing corrections (content rules 53-60): official marks in the Slide 15 tile, blue-only highlight, no table highlight unless asked, every chip word capitalised, chips inside their cards, distinct adult people facing the visual, clean figure plates with physical motion, screenshot boxes top-aligned (`generate-slides` "Standing corrections")
- [ ] Process: branch from main and PR for engine changes, plan signed off, feedback recorded with consent, delivered decks left frozen, reference rendered first, class-level fixes, new types registered (PRC-01 to PRC-04, PRC-06, PRC-08, PRC-12)
