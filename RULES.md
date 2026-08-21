<!-- cSpell:ignore NxtWave deployement colour behaviour -->
# RULES

Every standing rule in this repo, in one list. **This file is an index**: each
rule names the file that holds its full text, so there is exactly one copy of
each rule and no chance of the two drifting apart. Read the source file before
relying on a one-line summary.

Rules are added **only with the user's confirmation** — see
[How a rule gets added](#how-a-rule-gets-added) at the bottom.

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

## Process rules

| Rule | Full text |
|---|---|
| No deck generation before the slide-wise plan is signed off | [`slide-kit/workflow/SLIDE_WORKFLOW.md`](slide-kit/workflow/SLIDE_WORKFLOW.md) |
| A plan lives at `<course>/session_plans/<session_name>/plan.md`, and nowhere else | [`CLAUDE.md`](CLAUDE.md) |
| "Generate slides" runs the full procedure without the user restating it | [`.claude/skills/generate-slides/SKILL.md`](.claude/skills/generate-slides/SKILL.md) |
| The verification sweep is four harnesses, `align-check.mjs` included | same, section 7 |
| Re-run `video-safe` and `qa` as a pair: they pull in opposite directions | same, section 7 |
| Durable feedback is offered to a named file before it is applied | same, section 8 |
| Compose kit components; never hand-roll layout, spacing or colour | same, section 2 |
| Colours come from `src/design/tokens.ts`; no hex literals in a deck | same, section 2 |
| A new component is justified only by an argument no existing figure makes | same, section 6 |
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

## Writing rules

Full text: [`slide-kit/workflow/TEXT_GUIDELINES.md`](slide-kit/workflow/TEXT_GUIDELINES.md),
[`PEDAGOGY_GUIDELINES.md`](slide-kit/workflow/PEDAGOGY_GUIDELINES.md),
[`STYLE_GUIDE.md`](slide-kit/workflow/STYLE_GUIDE.md).

These are guidelines rather than hard rules: they say how a line should read,
how a concept is taught across consecutive slides, and which slide type and
colour suit which content. Where a guideline and a hard rule disagree, the hard
rule wins.

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
