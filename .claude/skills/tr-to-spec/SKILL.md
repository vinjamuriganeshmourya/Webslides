---
name: tr-to-spec
description: Turn a session's TR doc (.docx) into a session spec JSON, the hand-off a PDA builds the web slides from. Use whenever the user gives a TR doc and asks for the spec, the JSON, the session spec, the "intermediate" between TR and slides, or says "make the json for this session". Covers where the spec goes, extracting the TR with every speaker note cut, splitting each TR slide into cards, presses, using the TR's visual guidance and images, and the checker that must print CLEAN before the spec is handed over. Not for building the deck itself: that is generate-slides, and the PDA's job.
---
<!-- cSpell:ignore NxtWave PDAs PDA organisation -->

# TR doc to session spec

**The flow.** We hand over a TR doc. This skill turns it into one JSON file,
the **session spec**. A PDA builds the web slides from the spec, on their own,
with the slide template. Nobody on our side builds the first version of a deck
any more.

The spec exists because a PDA told us two things: they do not know what a
slide should look like, and they do not know the content well enough to decide
how to show it. So the spec answers exactly those two questions, card by card,
and leaves the craft to them. Its shape is the pedagogy team's own session spec
(`Outputs/python/session_plans/20_working_with_lists/` is a deck built from
one), adapted to a TR doc instead of an old pptx.

Three things this spec never does, all on the user's word (2026-10-27), and
recorded in `RULES.md`. The reason behind all three: the PDA builds the first
version of the deck from this file alone, so whatever is in it ends up on a
slide. Speaker notes are the instructor's talk, not slide copy, and the user
said to ignore them "at all the places".


1. **It never carries speaker notes.** Not quoted, not paraphrased, not used as
   a hint for what the slide should say. The extractor cuts them before anyone
   reads the TR, and the checker fails a spec that contains a run of eight
   words from one.
2. **It never carries a script.** The reference spec has `say` and `room` on
   every press. Ours has neither: no instructor lines, no room actions.
3. **It never goes beyond the TR.** Every word on a slide comes from the TR.
   What the spec adds is direction (purpose, what appears on each press, which
   kit component, what must not happen), never new content. A fact, example,
   question or number the TR does not have does not appear.

The spec is **JSON only**. No reading page, no HTML view.

---

## 1. Where it goes

```
Outputs/<course>/session_plans/session_<n>/
  tr.docx        the TR exactly as received (the checker reads it)
  tr.json        the TR extracted, speaker notes cut. Generated, re-runnable
  tr_images/     the TR's own images, named slide-NN-k.png
  spec.json      THE DELIVERABLE
```

A course folder name is lower case with underscores (`cloud_computing`); a
session folder is `session_<n>` with the TR's own session number.

**Every Cloud Computing session goes in `Outputs/cloud_computing/`** (user,
2026-10-27). The older `Outputs/cloudcomputing/` holds one earlier deck
(`cloud_computing_fundamentals`) and is left exactly as it is: nothing new goes
in it, and nothing is moved out of it. Two folders with near-identical names is
how a session gets planned in one and built in the other. Make the
course's `session_plans/` and `workflow/{reviews,captures}` if they are not
there yet (repo `CLAUDE.md`, "Starting a new course").

## 2. The procedure

```bash
S=Outputs/<course>/session_plans/session_<n>
mkdir -p $S && cp "<the TR>.docx" $S/tr.docx
python3 -I .claude/skills/tr-to-spec/scripts/extract_tr.py $S/tr.docx $S
# read $S/tr.json and every image in $S/tr_images, then write $S/spec.json
python3 -I .claude/skills/tr-to-spec/scripts/check_spec.py $S     # must print CLEAN
```

1. **Extract.** If the extractor reports items in `loose`, or the slide count
   does not match the TR's own "Slide N" headings, read the TR's text and fix
   the extractor before going on. Never hand-copy around it.
2. **Read every TR image.** Open each one. Decide `as-is`, `redraw` or
   `not-used` (section 6). A wrong label inside an image is a defect.
3. **Write the spec**, section 3 for the fields, section 4 for the cards.
   Write it with a short builder script in the scratchpad that pulls every
   TR string out of `tr.json` by slide and position, and authors only the
   direction fields. Retyping TR text by hand is how a word drifts.
4. **Check.** Fix the spec until `check_spec.py` prints CLEAN. A coverage
   failure means a TR line is missing: put it on a card, or, if the TR line is
   wrong, declare the change in `meta.tr_edits` and `meta.defects`. Never
   weaken the checker to pass.
5. **Report** to the user: cards per section, every defect found in the TR,
   and every `tr_edits` entry, so they can push the fix back to the TR author.

---

## 3. The fields

Top level, same keys as the pedagogy team's spec, so the tools already in this
repo read it (`scripts/build-spec-data.mjs`, `spec-check.mjs`):

```jsonc
{
  "meta": {
    "session": "2 - Deployment & Service Models",   // TR title, "N - Name"
    "course": "Cloud Computing",
    "source_tr": "2. Deployment & Service Models.docx",
    "one_idea": "...",       // the session in one or two sentences, in the TR's own terms
    "outcomes": ["..."],     // one per agenda concept: what the learner can do after it
    "previous": "1 - Cloud Computing Fundamentals",   // from the TR's recap heading
    "next": "Virtualization & Hypervisors",           // from the TR's "Upcoming Session"
    "deck_total": 0,         // number of cards; the checker counts them
    "topics": ["..."],
    "tr_coverage": [{"tr_slide": 3, "cards": ["T03-1", "T03-2", "T03-AN"]}],
    "tr_images": [{"file": "tr_images/slide-03-1.png", "tr_slide": 3,
                   "shows": "...", "use": "redraw", "why": "..."}],
    "tr_edits": [{"tr": "exact TR text", "spec": "what the spec says instead", "why": "..."}],
    "dropped": [["what", "why"]],     // e.g. the speaker notes, by count, never by text
    "defects": [["where in the TR", "the problem", "what the spec does about it"]],
    "design_notes": ["..."]           // session-wide direction for the PDA
  },
  "build_contract": ["..."],   // copy section 7 verbatim
  "rules": ["..."],            // copy section 7 verbatim
  "beats": [
    { "name": "Private Cloud: On-Premise Vs Hosted",   // the TR slide title
      "kind": "concept",       // spine | recap | agenda | divider | concept | analogy | compare | quiz | close
      "source": "tr:slide 3",
      "cards": [ /* card */ ] }
  ]
}
```

A **card** is one screen:

| Field | What it holds | Rule |
|---|---|---|
| `id` | `S-WELCOME`, `S-RECAP`, `S-AGENDA`, `D1`..`Dn` (dividers), `T03-1`, `T03-2` (TR slide 3, frame 1, 2), `T03-AN` (its analogy), `S-QUIZ`, `S-TAKEAWAYS`, `S-NEXT`, `S-THANKS`, `S-BEST` | unique |
| `title` | a short name for the card, for the team | not slide copy |
| `source` | `tr:slide 3`, `tr:section 2`, `tr:recap`, `tr:agenda`, `tr:takeaways`, `tr:next`, or `spine:welcome` / `spine:quiz` / `spine:thank-you` / `spine:all-the-best` | the checker reads it |
| `kit` | `{"slide": "ContentSlide", "figure": "DataTable"}`: the kit component that fits. A suggestion | names from `slide-kit/slide-types/README.md` only |
| `purpose` | the one thing the room must take from this card | one sentence, plain |
| `kicker` | the TR slide's **Heading**, verbatim | |
| `heading` | the TR slide's **Subheading**, verbatim | |
| `lead` | the TR's opening sentence for this card | exact words |
| `show` | every other line that appears on screen, in reveal order | exact words |
| `table` | `{"columns": [...], "rows": [[...]]}` | exact words, every cell |
| `code` | `[{"location": "...", "src": "...", "output": "..."}]` | exact, from the TR only |
| `analogy` | `{"familiar": "...", "maps_to": "...", "text": "..."}`: `text` is the TR analogy; `familiar` and `maps_to` are short labels lifted from its words | |
| `image` | `{"file": "tr_images/slide-03-1.png", "use": "redraw"}` | section 6 |
| `visual_guidance` | the TR's own Visual Guidance, verbatim | only on the card it fits |
| `visual` | what to draw, in our words, where the TR's guidance needs adapting or is missing | direction, not copy |
| `presses` | `[{"screen": "..."}]`, press 1 is what shows when the card opens | `screen` only. Never `say`, never `room` |
| `must` / `must_not` | what the drawing or the reveal has to get right | |
| `play` | what is the PDA's to decide | |
| `press_count` | `len(presses)` | the checker compares |

**Exact words** means the TR's words. Only these mechanical changes are made,
each recorded in `meta.tr_edits` when it changes more than punctuation:

- an em dash or spaced en dash becomes two sentences (content rule 1)
- a trailing full stop on a line is dropped (content rule 36)
- a plain typo or two sentences run together (`layers.Deployment`) is fixed,
  and listed in `meta.defects`

Everything else the TR says is copied as it stands, including wording we would
not have chosen. A heading that breaks a rule (too long, wraps) goes in
`meta.defects` with a suggested fix for the TR author; the spec still carries
the TR's heading.

## 4. From TR slides to cards

A TR doc is regular: sections, each with "Slide N", each slide with Heading,
Subheading, Content (lines, tables, images), Analogy, Visual Guidance, Speaker
Notes. The deck built from the Deployment TR by hand split it like this, and
that split is the rule:

| The TR slide has | Cards |
|---|---|
| a lead and points | one card. Press 1 the lead and the visual's base; one press per point after it |
| a lead, points and an image or diagram | one card, figure beside the points (`ContentRightImageSlide` or a figure inside `ContentSlide`) |
| a lead and a table, nothing else | one card, the table's rows staggering in (`DataTable`) |
| points AND a table | two cards: the points, then the table. One idea per slide (content rule 5) |
| an analogy | its own card, after the concept it explains, `-AN`. The concept first, then the familiar thing (content rule 23) |
| more than five points | two cards, split where the TR's own grouping splits |

Around those, the spine, in this order:

1. `S-WELCOME`, `spine:welcome`, no content. The kit's welcome line (rule 21)
2. `S-RECAP`, `tr:recap`, the TR's recap items verbatim, one per press
3. `S-AGENDA`, `tr:agenda`, the agenda items verbatim
4. per TR section: a divider `D<n>`, `tr:section <n>`, carrying the agenda line
   for that section, then the section's slides
5. `S-QUIZ`, `spine:quiz`. **"Quiz Time!" and nothing else** (rule 28). The TR
   has no quiz questions, so the spec writes none
6. `S-TAKEAWAYS`, `tr:takeaways`, the TR's takeaways verbatim (rule 20)
7. `S-NEXT`, `tr:next`, the next session's name
8. `S-THANKS` and `S-BEST`, the closing chrome

## 5. Presses

Every content card moves. A press is one change, written as what appears and
where, so a PDA who has never seen the topic can build it:

- **Press 1** is what the card shows when it opens: kicker, heading, lead, and
  the base of the figure.
- **One new element per press** (content rule 25): one point, one table row,
  one arrow. Text and the part of the figure it describes arrive on the SAME
  press (content rule 6).
- **A comparison reveals as pairs**, never one whole side then the other.
- `screen` describes the screen. It never says what the instructor says.

## 6. Visual guidance and TR images

The TR's Visual Guidance is the author's intent. Use it where it shows the
card's own idea, and say so in `visual_guidance` (verbatim) on that card.
Where it does not fit, write `visual` in our words and say why in `play` or
`meta.defects`:

- it draws the topic, not this slide's idea (content rule 8)
- it asks for something the kit already has a better figure for: name it in `kit`
- it describes one picture for a slide we split in two: give it to the card it
  belongs to

TR images are judged one by one:

| `use` | When |
|---|---|
| `as-is` | rare: a real screenshot of a process (content rule 30) |
| `redraw` | the diagram is right but in someone else's colours. The PDA redraws it in the template (rule 37) |
| `not-used` | decorative stock art, or anything wrong. Say what is wrong in `why` |

A wrong label inside an image (a logo captioned with the wrong name) is a
defect, listed in `meta.defects`, and the image is `not-used`.

A technology named on a slide carries its logo (content rule 12). Say which
logos a card needs in `visual`; the PDA fetches them from
`slide-kit/assets/` first.

## 7. Copy these into every spec

`build_contract`:

```json
[
  "One self-contained HTML file built with the slide template. It opens offline and makes no network request.",
  "Every card in this spec is one slide, in this order. Press 1 is what shows when the slide opens.",
  "Every slide's outer element carries data-spec=\"<card id>\" and data-presses=\"<press_count>\".",
  "Right arrow or the clicker is one press. Left arrow goes back one press.",
  "Slide components come from the kit (slide-kit/slide-template/src/slides and src/ui). A new component is a kit change and needs a PR.",
  "There are no speaker notes in this spec, and the deck carries none from the TR."
]
```

`rules`:

```json
[
  "Words are exact. kicker, heading, lead, show, table, code and analogy.text are final. If one does not fit, ask for a change to the spec; do not rewrite it.",
  "Nothing the TR does not say. No added facts, examples, numbers or questions.",
  "No autoplay. Nothing moves on a timer. One press, one change.",
  "Text and the part of the figure it describes appear on the same press.",
  "Simple English. No em dashes anywhere. No full stop at the end of a line.",
  "Template colours, type and chrome only (RULES.md 32 to 37). Never a colour taken from a TR image.",
  "A technology named on a slide carries its logo, from slide-kit/assets first.",
  "The quiz frame says Quiz Time! and nothing else."
]
```

## 8. Before you report

- `check_spec.py` prints CLEAN.
- Every TR image has been opened and judged.
- Every defect found in the TR is in `meta.defects`.
- No card has a field this file does not name.
