# Illustrations

Third-party illustrations for section dividers. Fetched here first, then copied
into a session's `public/assets/illustrations/` (hard rule 13).

## Source and licence

All files are **unDraw** (https://undraw.co), by Katerina Limpitsouni, released
under the **unDraw open licence**: free for commercial and non-commercial use,
no attribution required, no permission needed. Fetched 2026-09-11 from
`https://cdn.undraw.co/illustration[s]/<slug>.svg`.

## The two files per illustration

| File | What it is |
|---|---|
| `undraw-<slug>.svg` | the original as fetched, untouched |
| `divider-<slug>.svg` | the deck's copy: on a light plate, accent recoloured |

`divider-*` is generated from `undraw-*` and is what a slide references. Two
changes, both made because the deck's section dividers stand on the **night
stage** (`#00254B`):

1. **A light plate** (`#F2F7FF`) is inserted as the first child, and the viewBox
   grows 7% on every side to hold it. unDraw draws dark line art assuming a light
   ground; straight onto navy the figure disappears. Recolouring the darks to
   light was the alternative and it inverts the skin tones and the shadow logic
   with them, so the plate is the honest fix: the illustration keeps the palette
   it was drawn in and gets the ground it assumes.
2. **The accent `#6c63ff` becomes `#2D63FB`**, which is `colors.brand` in
   `src/design/tokens.ts`. unDraw publishes its art recoloured this way; the
   picker on their own site does the same substitution.

`width` and `height` attributes are dropped so the slide's own box decides the
size. Regenerate with the script recorded in the session that made them.

## What each one is used for, and why it is honest

Hard rule 8: an illustration depicts the slide's **own** concept, and a
near-enough picture is worse than none. These five were chosen from eleven
candidates that were fetched, plated and looked at as a contact sheet.

| File | Divider | Why it depicts that concept |
|---|---|---|
| `divider-switches_atb7.svg` | State | Toggle switches showing their current positions. The fan analogy that opens the concept is a switch that is on and a speed that is 3 |
| `divider-tasks_l9ct.svg` | Behaviour | A list of things that can be done. A class's method list is exactly that |
| `divider-setup_fzje.svg` | Constructor | A setup completing. The constructor's whole job is setting up the starting state |
| `divider-my-location_dcug.svg` | this Keyword | A pin saying "you are here". `this` means "the object I belong to", the one being used right now |
| `divider-bookshelves_vhu6.svg` | Building a Library Project | A library |

Six were rejected and deleted rather than kept as spares, because a spare in
this folder is an invitation to fill space with it: `data_25jw` (people
presenting charts, which is data being analysed and not the values one object
holds), `books_wxzz`, `selection_7hy6`, `press-play_oqq2`,
`features-overview_uone` and `control-panel_s0j2`.
