---
name: session-5-deck
description: Build rules, decisions and the running feedback log for Deployment Session 5, "Automating Deployment with Makefile" (project deployement_session_5). Use whenever writing, editing, reviewing or QA-ing that session's plan (session_plans/deployement_session_5/plan.md), its deck source (deployement_session_5/src/decks/makefileDeck.tsx), its two figures TargetAnatomy and AutomationLadder, or any slide, illustration or terminal transcript in it. Also use when the user gives feedback on session 5 slides, so the feedback is recorded here before it is applied.
---
<!-- cSpell:ignore nxttrendz deployement Makefile makefile PHONY winget choco GnuWin32 colour behaviour parameterised -->

# Session 5 deck rules

| | |
|---|---|
| Plan | `django_deployement_course/session_plans/deployement_session_5/plan.md` |
| Deck | `deployement_session_5/src/decks/makefileDeck.tsx` |
| TR doc | `/home/nxtwave/docker_jenkins_aws/05_automating_deployment_with_makefile.md` |
| Slides | 56 · devPort 5216 · `dist-single/deployment-session-5.html` |

Rules **R1 to R8** live in the deck file's header comment, next to the code they
govern. This file holds what does not belong in a source comment: why the deck is
shaped this way, and the feedback log.

---

## S1 The plan was audited before it was built, and the audit is the artefact

Section 9 of the plan is a nine-item review of the first draft against
`PEDAGOGY_GUIDELINES.md` and `TEXT_GUIDELINES.md`. **Read it before editing any
slide copy here**, because five of those nine are the kind of defect that comes
back on the next deck:

- titles drifting into seven-word editorial headlines against a corpus median of two
- the previous-session recap not ending on the gap today closes
- a slide titled as a comparison that contains no comparison and reaches no verdict
- no `Test it` slide, so a concept never lands in something runnable
- one quiz where the corpus has two, the second at the load-bearing boundary

Section 9 also records three deliberate deviations, so they are not re-litigated:
the whole-then-parts order in concept 3, concept sizes past the "2 to 4 content
slides" guideline, and concept 2 opening on mechanism.

## S2 The `.PHONY` surprise is a three-slide beat. Do not collapse it.

Slide 37 asks what `make build` does when a folder named `build` exists, and
resolves nothing. Slide 38 is the bare output, `make: 'build' is up to date.`
Slide 39 is the mechanism: Make's 1976 job was building files.

Any edit that explains the mechanism before 38 costs the session its one genuine
surprise, and `.PHONY` goes back to being an incantation people copy. Content
rule 16 governs slide 37: the question and nothing else, answered on the next
slide.

## S3 Level 3 of the ladder names no tool

`AutomationLadder` draws the top rung dashed, labelled `Later in this course`,
with no tool inside it. The TR itself writes "CI/CD" there. We do not, because
content rule 4 says a later problem is named and never opened, and a tool name
means nothing to a room that has not felt the problem it solves.

The figure is the one place that rule grants an exception for marking a level
visually unopened, because showing position is its whole job. That is why it is a
ladder and not four cards.

## S4 The tab is the session, so it is a figure and a real tab

Two things follow from that and neither is optional:

- `TargetAnatomy` exists because a `CodeBlock` cannot teach a character with no
  glyph. It renders the tab as a labelled block with an arrow in it.
- Every indented line in every code string in the deck uses `\t`, never spaces.
  A deck that teaches the tab rule with spaces in its own panels teaches the bug.

## S5 Both figures are built from DOM elements, not SVG text

This is the direct answer to session 4's S9, where two SVG figures shipped with
overlapping `<text>` labels while all three harnesses reported clean, because an
`<svg>` is one DOM rectangle to them.

`TargetAnatomy` and `AutomationLadder` are flex and grid layouts of real
elements. The browser's layout engine keeps the labels apart, and
`align-check.mjs` can actually see each one. **Any figure whose content is mostly
labels should be built this way.** Reach for SVG when the argument is geometry.

Content rule 17 still applies and was still done: both were screenshotted and
looked at, which is how the tab glyph was found rendering as a small dash at 15px
and the ladder was found reading as a list rather than a climb.

## S6 `CodeBuildSlide` cannot render a Makefile

It hardcodes `language="YAML"` on its inner `CodeBlock`. Slide 41, the finished
file, was planned as a `CodeBuildSlide` and is a `ContentSlide` plus a `CodeBlock`
instead.

Fixing the component means adding a pass-through prop to `src/slides/`, which is
kit-owned: content rule 14 makes that the user's call, and `sync-kit.mjs` would
push it to every other session. **Left unfixed deliberately.** If it is ever
approved, slide 41 goes back to `CodeBuildSlide` and gains its annotation panel.

## S7 `CodeBlock`'s language prop defaults to `python`

Related to S6 and worth its own line, because it fails silently. `language`
doubles as the chip label, so a Makefile panel with the prop omitted ships with a
`python` chip. Eight slides render the Makefile and every one passes
`language="makefile"` explicitly.

Slide 50 is the one code panel with **no** `filename`: it is pseudocode for an
automation server, not a file in the project, and labelling it as one would send
the room looking for it.

## S8 The kit's `devPort` is not wired to Vite

`vite.config.ts` hardcodes `server.port: 5173`; the harnesses read `devPort` from
`deck.config.json`. Carried unchanged from session 4's S7. Start the server
explicitly before running any harness:

```bash
npx vite --port 5216 --strictPort
```

`workflow/export/build-reveal-steps.mjs` also ignores `CHROME_PATH` and launches
Playwright's own chromium, so it needs `npx playwright install chromium-headless-shell`
once on a fresh machine. The other four harnesses honour `CHROME_PATH`.

## S9 Asset paths are a static map

`TECH_SRC` in the deck file, for the reason session 4's S8 records:
`scripts/inline-assets.mjs` finds assets by scanning the built HTML for literal
`/assets/...` paths, and a template literal is invisible to it. It works in `dev`,
works in `build`, and breaks in `build:html`, the only build that ships.

The map is trimmed to the five logos the deck renders. Session 4 measured ten
unused logos at 290 KB in the single file.

## S10 Every transcript is quoted from the TR, with one flagged exception

Docker Desktop does not run on the capture machine, the same blocker that left
sessions 1 to 4 quoted. Versions, container ids and timings are the TR's.

**Slide 42 (`Test it`) is the exception and it is flagged rather than hidden.**
The TR never runs the finished Makefile, so its three expected results are
composed from outputs the TR shows elsewhere (`[+] Running 2/2` from §2.2, plus
Docker's standard `Removed` and `No migrations to apply` lines). It is the panel
most worth replacing with a real capture. Plan §5.4 says the same.

## S11 A chip is never followed directly by punctuation

`Code` carries `px-1.5`, so `<Code>.env</Code>{', read automatically'}` renders as
`.env , read automatically` with a visible gap before the comma. Seven bullets
shipped that way and were found by looking at screenshots, not by any harness.
Rephrase so the chip is followed by a word. Dropping the two question marks in the
process also satisfied `TEXT_GUIDELINES.md` §2, which wants no trailing
punctuation on a bullet.

---

## Feedback log

Per the repo's feedback rule, corrections that would apply to future decks are
recorded here before they are applied.

| Date | Feedback | Applied as |
|---|---|---|
| 2026-08-24 | Review the plan against the pedagogy and text guidelines | Nine findings, all fixed before sign-off. Recorded as plan §9 and summarised in S1 above |
| 2026-09-03 | Agenda named feelings, not concepts: *"Update Agenda with meaningful concept names"* | The four `C1..C4` constants are the user's own wording. They are longer than `TEXT_GUIDELINES.md` §4a's article-free form, and §4a yields to an explicit instruction |
| 2026-09-03 | *"sentence riddles need to removed and should be provided with clear understandable sentences"* | Sixteen leads and callout bodies rewritten. The pattern was a slide line carrying two clauses split by a full stop; `TEXT_GUIDELINES.md` §4b |
| 2026-09-03 | *"Remove The from all sentences... make similar changes in all"* | 41 lines in this deck, 104 across sessions 4, 6 and 7. Now `TEXT_GUIDELINES.md` §4a-bis. **It can go too far:** "Whole first target is two lines" was the result, and the next round rejected it, so eleven lines were rewritten rather than merely trimmed |
| 2026-09-03 | *"instead of calling keystrokes... not relevant to regular usage of phrase"* | `make up` is **two words**, never seven keystrokes. Five places. Now `TEXT_GUIDELINES.md` §3b: use the word the learner would use |
| 2026-09-03 | `make up` read as a capital U: *"make \"up\" like this"* | Bare-word prose quotes the target (`make "up"`); a `<Code>` chip needs no quotes, and a "You type" column gets the chip rather than quotes, because nobody types quotation marks |
| 2026-09-03 | Target anatomy: *"Connect explanation with respective command part"* | Numbered badges on both the chip and its card. Colour alone had been carrying the pairing, and the colon part is two characters wide, which is not enough coloured area to find. `PEDAGOGY_GUIDELINES.md` §5 |
| 2026-09-03 | *"CI/CD is new for students so we need to update flow and explanation"* | Six slides added. The section was named `Makefile in CI/CD` and the deck had never said what either letter stands for. R7 rewritten |
| 2026-09-03 | Speed dial, over three rounds: a named character, then iPhone UI, then the real dial pad | `src/ui/SpeedDial.tsx`. Each round made it more concrete, not more decorative. The payoff line moved from the figure's bottom margin to its own highlight panel on the right, after *"the right is full empty"* |
| 2026-09-03 | *"Remove Makefile in CI/CD Section in whole from the Session 5"*, then *"you can include the interface"* | All 14 of concept 4 deleted, three interface slides kept back as the close of concept 3. Deck 58 -> 47, three concepts not four. **R7 rewritten** to say nothing may reintroduce CI/CD here. Plan §11 |
| 2026-09-03 | *"Change the UI of this Slide ... Build a New Lab for Comparison"* | `slide-kit/comparison-lab`, four candidates on one fixture. **`SwapRows` won** and is in the kit, the gallery and the registry. Slides 12 and 43 render it |
| 2026-09-03 | *"dont highlight any of the part"* | The emphasis flag was removed from `compareFigure.ts` rather than kept and ignored, which is the same trap `SlideHeader` records: a prop still declared but no longer honoured is one the next author passes in good faith |
| 2026-09-03 | *"after slide 15 add one more slide"* for the `make is not recognized` PATH error, with two real screenshots and *"For sure everyone will get this"* | Two slides: `c1-make-not-recognized` quotes both transcripts (the `CommandNotFoundException` and the `GnuWin32\bin` find) in `Terminal` panels, `c1-make-path-fix` is the fix. **Two panels because two shells** -- the error is in the ordinary terminal, the search needs an Administrator PowerShell, and a learner who runs it in the wrong one gets nothing and concludes Make never installed |
| 2026-09-03 | *"add Proper screenshot or relavant Windows, instead of just sentence and steps"*, then *"start the Oracle VM and take screenshots"* | **First real capture in this session.** Booted the Windows 11 VirtualBox VM, drove it to `rundll32 sysdm.cpl,EditEnvironmentVariables`, typed the GnuWin32 folder into a new Path entry, captured, then cancelled so nothing was written to the VM. Cropped to the one window, highlight box on the new entry. `public/shots/windows-path-edit.png`, and `public/shots/` is new here |
| 2026-09-03 | *"remove the [numbering] and maintain Capitalization"* on the terminal captions | `1 ·` / `2 ·` dropped. The panels sit side by side, so left-to-right already carried the order and the numerals were counting something the layout had said |
| 2026-09-03 | *"at no point you should mention like next slide"* | **Content rule 22**, indexed in `RULES.md`. Three rendered strings in this deck had already gone stale within the hour when the success and error cases were split. Speaker notes are exempt and the rule says so |
| 2026-09-03 | *"1 slide must only have success case and follow should have if you encountered error"* | Split into `c1-make-check` (success alone) and `c1-make-error` (the branch). Two panels for one command's two outcomes was two ideas, and a room reading the failure panel has stopped looking at the target |
| 2026-09-03 | *"18th slide is no vs code terminal its windows shell change UI"* | **Kit change**: `Terminal` gained `chrome="powershell"`, a standalone window with a title bar on PowerShell's near-black ground. The slide says "Administrator PowerShell" and was drawing the editor's panel, which is a different application |
| 2026-09-03 | *"for error use red color as given in screenshot"* | **Kit change**: an `err` line kind, `#F14C4C` rather than pure red, which vibrates on a projector at near-black. Applied to the two error lines on `c1-make-error` |
| 2026-09-03 | Alignment on the check slides | Both terminals went full width. At 720px the panel ended at x=780 while the callout ran to x=1216, so each slide had two different right edges |
