# Low-end pass, 2026-11-13: the files it replaced

User, 2026-11-13: the decks of sessions 9 to 12 "need to work on low end pc and browsers", with nothing dropped:
the same pictures, the same animations.

Each of these four decks drew its 3D people with its own copy of the sprite builder (Session 9 with its own copy of
the whole 3D stage). The copies built every Character Lab frame in one burst when the slide opened and went on after
it closed, and Session 9's stage copied every frame from WebGL onto a 2D canvas. The engine's stage and sprite
(`deck-engine/src/engine/three-stage.tsx`) no longer do either, so each copy now hands its work to the engine:

| deck | file | was | is |
|---|---|---|---|
| elastic_compute_instances | `custom/three-stage.tsx` | the whole stage and sprite, 430 lines | a wrapper: the engine's stage with `sizing="screen"`, the engine's sprite with `adaptive: true` |
| serverless_computing | `custom/h.tsx`, `custom/i.tsx` | `rigSprite` built its own frames | `castSprite({ ...o, px: o.px ?? 480 })` |
| cloud_provider_comparison | `custom/h.tsx`, `custom/j.tsx` | same | `px: o.px ?? 320` and `?? 400` |
| cloud_security_and_shared_responsibility | `custom/h.tsx`, `custom/i.tsx`, `custom/j.tsx` | same; `j` screen-sized | `px ?? 300`; `i` with `shadow: 0.2`; `j` with `adaptive` |

Nothing else in those files changed. What was proved, the old build (old engine, these files) against the build
that ships:

- in Chrome, the held final-state screenshot of every slide at 1280x720 and at 1920x1080, reached by a press, and
  at 1920x1080 by opening the page on the slide; and for every slide what it asks the browser to animate and every
  character frame picture, reached by pressing next (Session 9 at both sizes, since it sizes its people to the screen);
- in Firefox 158, the held screenshot of every slide at 1280x720.

Sessions 10, 11 and 12: every held screenshot identical, and every record identical but one: on slide 12 the old
Session 12 build made a set of 144 frames at a size measured too early and threw it away; the sets it showed are
the same. Session 9: 61 of 64 screenshots, and the other three (slides 7, 39, 47) differ by the same amount between
two captures of the OLD build; its records are identical at both sizes (on one slide the same calls in another
order, which two walks of the old build also do). Four one-off differences (a title caught mid-move in Firefox, one
colour level in one region of three slides) did not repeat on a second capture of either build.

Two things the Session 9 stage did by accident of timing are kept on purpose, so that nothing moves: a held frame's
people are measured a second time once the scene has placed them, and a stage is measured in the effect that mounts
it, before the deck's zoom, when the page is opened directly on that slide. Both are commented where they live
(`castSprite`'s `adapt`, `ThreeStage`'s `dens0`).

`custom/` here holds the files as they were. Each deck's HTML as it was before the rebuild is in
`Outputs/cloudcomputing/versions/low-end-pass-2026-11-13-before/` (git ignores `versions/`).
To go back: copy a file from here over its namesake in the session folder and build the deck again.
