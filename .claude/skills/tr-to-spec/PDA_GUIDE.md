<!-- cSpell:ignore PDA PDAs -->
# Building a deck from a session spec

For PDAs. The session spec is the brief for one deck: what is on every slide,
in what order, what appears on each click, and what it should look like. You
build the slides; the spec has already decided the content.

```
Outputs/<course>/session_plans/session_<n>/
  spec.json      the brief. Build from this
  tr_images/     the TR's own pictures, named slide-NN-k.png
  tr.docx        the TR it came from, for reference only
```

## Reading spec.json

- **`beats`** is the deck in order. Each beat is one TR slide (or a spine
  frame such as Welcome or Quiz) and holds one or more **cards**.
- **One card is one slide.** `meta.deck_total` says how many.
- **`meta.design_notes`** first: the pictures that carry across several slides
  (one spectrum in section 1, one stack in section 3).
- **`meta.defects`**: what is wrong in the TR and what the spec did about it.

On a card:

| Field | Use it as |
|---|---|
| `kicker`, `heading` | the slide header: kicker above, heading below |
| `lead` | the first sentence under the header |
| `show`, `table`, `code`, `analogy.text` | the slide's words. **Copy them exactly** |
| `presses` | one entry per click. Press 1 is what shows when the slide opens |
| `kit` | the template component that fits. Start there |
| `visual_guidance` | what the TR author asked to see |
| `visual` | our direction, where it adapts or replaces the TR's guidance |
| `image` | a TR picture: `redraw` means draw it again in template colours; `not-used` means leave it out |
| `must`, `must_not` | the things that make the slide wrong if missed |
| `play` | your call: how it looks |
| `purpose` | what the room must take away. Not slide copy |

## Rules

- Never rewrite the words. If something does not fit, ask for a spec change.
- Never add a fact, example, number or question the spec does not have.
- There are no speaker notes and no instructor script, by design.
- One click, one change. Text and the part of the picture it describes appear
  on the same click.
- Template colours and components only. A logo comes from `slide-kit/assets/`
  first.
- Put `data-spec="<card id>"` and `data-presses="<press_count>"` on each
  slide's outer element, so the deck can be checked against the spec.

## Getting started

1. Start a session from the template (repo `CLAUDE.md`, "Starting a new
   course"). Name the session folder like the plan folder, `session_<n>`.
2. Set `slideCount` in `deck.config.json` to `meta.deck_total`.
3. Build the cards in order. Use `slide-kit/slide-types/README.md` to look up a
   `kit` name.
