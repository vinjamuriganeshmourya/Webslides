<!-- cSpell:ignore NxtWave deployement colour behaviour -->
# RULES

Every standing rule in this repo, in one list. **This file is an index**: each
rule names the file that holds its full text, so there is exactly one copy of
each rule and no chance of the two drifting apart. Read the source file before
relying on a one-line summary.

Rules are added **only with the user's confirmation** — see
[How a rule gets added](#how-a-rule-gets-added) at the bottom.

---

## A new rule never re-opens a delivered deck

**Every session already delivered is frozen.** A rule added here applies to the
deck being planned and the deck being built. It is **not** a mandate to go back
and correct a session that has shipped.

This overrides content rule 9 ("when content changes, chase the dependents"),
which is about dependents *inside* the deck you are working on, not about
earlier sessions.

Several rules in this file quote a shipped deck as the evidence for why they
exist, and quoting a defect is the whole point of that citation. **Those quotes
are evidence, never a work list.** If a delivered deck breaks a rule written
after it shipped, that is expected and correct: the rule exists because the deck
taught us it was needed.

A frozen deck is re-opened only when the user asks for that deck by name.

---

## Hard content rules

Full text: [`.claude/skills/slide-content-rules/SKILL.md`](.claude/skills/slide-content-rules/SKILL.md).
Claude Code loads this skill automatically whenever slide copy is written or
reviewed. These are hard rules, not preferences; each exists because a deck
shipped with that exact mistake.

| # | Rule |
|---|---|
| 1 | Never use a spaced em dash |
| 2 | Never call the audience a stranger |
| 3 | One panel per terminal, with the folder path shown |
| 4 | Name a later problem, never open it |
| 5 | One idea per slide, one item per slide in a list of items |
| 6 | Text and its supporting visual reveal in parallel |
| 7 | Deck chrome is grey, and never doubles the session name |
| 8 | Illustrations depict the slide's own concept, not the topic |
| 9 | When content changes, chase the dependents |
| 10 | Verify by rendering, never by reading |
| 11 | Screenshots are cropped to the point, output highlighted |
| 12 | A technology named on a slide carries its logo (PNG) |
| 13 | Every asset lives in the central library first |
| 14 | An approved slide type or transition goes into the kit and the registry |
| 15 | A backslash in a JSX attribute is literal, so write one |
| 16 | A question slide carries the question and nothing else |
| 17 | Screenshot every custom figure and look at it |
| 18 | Every deck carries a quiz frame, and a lone one sits before the takeaways |
| 19 | The concept and its sub-concept are pinned to the top of every slide |
| 20 | Key Takeaways restates the agenda concepts, verbatim |
| 21 | The welcome line is written once |
| 22 | Rendered copy never names a slide's position |
| 23 | Every concept opens on a need and closes on proof, and the deck is one chain |
| 24 | Nothing appears before it is introduced, and an introduction says why here |
| 25 | Nothing arrives assembled: one new element per slide |
| 26 | Plain English: write literally, never figuratively |
| 27 | An illustration is researched before it is drawn, and the source says why that form |
| 28 | The quiz frame says "Quiz Time!" and nothing else, so it cannot preview the answers |

## Process rules

| Rule | Full text |
|---|---|
| Pull main, branch from it, work there. Never edit on main | [`.claude/skills/branch-from-main/SKILL.md`](.claude/skills/branch-from-main/SKILL.md) |
| A kit change reaches every session on the next sync, so it is always a PR | same, section 4, and [`generate-slides/SKILL.md`](.claude/skills/generate-slides/SKILL.md) section 6 |
| No deck generation before the slide-wise plan is signed off | [`slide-kit/workflow/SLIDE_WORKFLOW.md`](slide-kit/workflow/SLIDE_WORKFLOW.md) |
| A plan lives at `<course>/session_plans/<session_name>/plan.md`, and nowhere else | [`CLAUDE.md`](CLAUDE.md) |
| "Generate slides" runs the full procedure without the user restating it | [`.claude/skills/generate-slides/SKILL.md`](.claude/skills/generate-slides/SKILL.md) |
| The verification sweep is four harnesses, `align-check.mjs` included | same, section 7 |
| Re-run `video-safe` and `qa` as a pair: they pull in opposite directions | same, section 7 |
| Durable feedback is offered to a named file before it is applied | same, section 8 |
| Compose kit components; never hand-roll layout, spacing or colour | same, section 2 |
| Colours come from `src/design/tokens.ts`; no hex literals in a deck | same, section 2 |
| A new component is justified only by an argument no existing figure makes | same, section 6 |
| Anything reusable built for a session is copied back into the kit, not left in it | same, section 6 |
| A new slide type, figure or transition is committed to the kit and raised as a PR | same, section 6, and [`slide-kit/slide-types/README.md`](slide-kit/slide-types/README.md) |
| `sampleDeck.tsx` renders EVERY type exported from `src/slides/index.ts` | [`slide-kit/slide-types/README.md`](slide-kit/slide-types/README.md) |
| A session-owned figure is imported by path, never re-exported from the kit-owned `@/ui` barrel | [`slide-kit/slide-template/KIT.md`](slide-kit/slide-template/KIT.md) |
| Motion runs at the explanatory tier, roughly double the `animate` skill's UI numbers | [`.claude/skills/generate-slides/SKILL.md`](.claude/skills/generate-slides/SKILL.md), section 4b |
| Vendored skills live in `.agents/skills` and are never edited in place | same, section 4b |
| Kit changes propagate by running `sync-kit.mjs`, never automatically | [`slide-kit/slide-template/KIT.md`](slide-kit/slide-template/KIT.md) |
| `slideCount` in `deck.config.json` stays current, or sweeps skip the tail | same |

## Where things live

| Rule | Full text |
|---|---|
| Assets are fetched into `slide-kit/assets/` first, then copied into a session | [`slide-kit/assets/README.md`](slide-kit/assets/README.md) |
| Approved slide types, figures and transitions are registered | [`slide-kit/slide-types/README.md`](slide-kit/slide-types/README.md) |
| A course is a root-level folder; nothing in `slide-kit/` names a course | [`CLAUDE.md`](CLAUDE.md) |
| `.gitignore` patterns stay `**/`-prefixed or unanchored, never path-anchored | same |
| Generators are tracked, artefacts are not — except the built `dist-single/*.html` decks | same |
| The single-file build does not minify CSS: esbuild's minifier emits an invalid `@media(hover:hover)and(...)` | [`vite.singlefile.config.ts`](slide-kit/slide-template/vite.singlefile.config.ts) |

## Writing rules

Full text: [`slide-kit/workflow/TEXT_GUIDELINES.md`](slide-kit/workflow/TEXT_GUIDELINES.md),
[`PEDAGOGY_GUIDELINES.md`](slide-kit/workflow/PEDAGOGY_GUIDELINES.md),
[`STYLE_GUIDE.md`](slide-kit/workflow/STYLE_GUIDE.md).

These are guidelines rather than hard rules: they say how a line should read,
how a concept is taught across consecutive slides, and which slide type and
colour suit which content. Where a guideline and a hard rule disagree, the hard
rule wins.

Some of them are hard rules, not guidelines. The narrative-flow rule is the
largest of these, and it is duplicated as content rule 23 so it loads on every
turn that writes slide copy:

| Rule | Full text |
|---|---|
| Every concept opens on a felt need and closes on something observable. This never varies | [`PEDAGOGY_GUIDELINES.md`](slide-kit/workflow/PEDAGOGY_GUIDELINES.md) section 2, and [`slide-content-rules`](.claude/skills/slide-content-rules/SKILL.md) rule 23 |
| The middle varies: STAR for a mechanism (default), 4MAT for a definition, SCQA for a choice, Merrill for a skill | same, "Choosing the middle". One framework per concept, named in the plan |
| Two opening slides in every framework: the routine running, then the point it breaks | same. One means the cost beat is missing, which is this rule's known failure mode |
| A framework is never an escape hatch from the opening: 4MAT's Why is STAR's Situation | same |
| A fifth framework may be added, but it is registered before it is used and never picked mid-generation | same, "The set is open, and admission has a price". Five conditions, and the user's confirmation |
| A new framework replaces the middle only. It never touches the opening or the close | same |
| A STAR Task slide carries the capability in plain words and no syntax | same, "Task carries no syntax" |
| Concept N's close is concept N+1's opening, and the divider inherits it | same, "The deck is one chain" |
| Four or five content slides is the floor for a concept, not the target | same, and [`SLIDE_WORKFLOW.md`](slide-kit/workflow/SLIDE_WORKFLOW.md) stage 2 |
| Decks are written for absolute beginners: explained once, used often, never re-explained | [`PEDAGOGY_GUIDELINES.md`](slide-kit/workflow/PEDAGOGY_GUIDELINES.md) section 2b, and rule 24 |
| A concept's Situation must be writable from already-introduced terms only, which is what fixes its placement | same, "The placement test" |
| Every plan carries a term ledger, checked at the sign-off gate | same, "The term ledger", and `SLIDE_WORKFLOW.md` stage 2 |
| One new named term per slide, plain-words gloss before the formal name, no unexpanded acronym | same, "Register" |
| An artefact with parts is never shown assembled first: one element per slide, then whole | [`PEDAGOGY_GUIDELINES.md`](slide-kit/workflow/PEDAGOGY_GUIDELINES.md) section 3, and rule 25 |
| Every word on a slide means what it says: no idiom, no phrasal verb, no metaphor | [`TEXT_GUIDELINES.md`](slide-kit/workflow/TEXT_GUIDELINES.md) section 3d, and rule 26 |
| Literal outranks short: `under the hood` is Anglo-Saxon and still banned | same, "The axis that matters" |
| No Latin abbreviation on a slide: `e.g.`, `i.e.`, `etc.`, `via`, `vs.`, `per` | same |
| 20 words and two commas is the hard cap for a rendered string | same, "The measured ceiling" |
| Active voice, at most two stacked nouns, never a double negative | same, "The four remaining hazards" |
| Every surface in a figure is lit from the top-left: highlight, ramp, colour-tinted shadow, two hairlines | [`STYLE_GUIDE.md`](slide-kit/workflow/STYLE_GUIDE.md), section 9 |
| Agenda items are content words only: no articles, no helping verbs, and the dividers and recap read from the same array | [`TEXT_GUIDELINES.md`](slide-kit/workflow/TEXT_GUIDELINES.md), section 4a |
| No slide copy opens on `The`: leads, bullets, callouts, captions and titles all drop the leading article | [`TEXT_GUIDELINES.md`](slide-kit/workflow/TEXT_GUIDELINES.md), section 4a-bis |
| One line on a slide is one sentence: two clauses about the same thing are joined with a comma, never split with a full stop | [`TEXT_GUIDELINES.md`](slide-kit/workflow/TEXT_GUIDELINES.md), section 4b |
| The lead is drawn in the content well by `SlideLead`, never inside `SlideHeader` | [`slide-kit/slide-types/README.md`](slide-kit/slide-types/README.md) |

## Session-specific rules

A rule that applies to one deck only lives with that deck, not here:

- `<course>/workflow/skills/<session>/SKILL.md` — decisions and the running
  feedback log for that session
- `<session>/CLAUDE.md` — that deck's own working notes

---

## How a rule gets added

**Rules are written down with the user's confirmation, never silently.**

1. The user gives feedback, or states a rule outright.
2. Judge whether it is durable. The test: *would this have changed what I did,
   on a different deck, next month?* A typo, a wrong number or "move this box
   left" is not a rule.
3. **Ask, naming the destination file** — not "shall I save this?" but "shall I
   add this to `slide-content-rules/SKILL.md` as rule 15?"
4. On yes: write it in the source file, **with its reason**. Every hard rule
   here names the deck that shipped wrong because of it; a rule without its
   reason gets argued away by the next person.
5. Add a row to this index.
6. Then apply it to the work in hand.

When the same correction arrives twice, stop asking and propose the exact
wording instead.
