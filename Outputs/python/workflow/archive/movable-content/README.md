# User-movable content (archived 2026-10-08)

Built for PF 25 List Methods on 2026-10-08, removed the same day on the user's
word: *"remove the new feature that can move the elements … don't implement
[it unless] I say so in any session."*

Do not add this to any deck unless the user asks for it.

- `move.tsx`: `MoveScope` (one per card, mounted inside `Panel` around the
  `data-spec` div) and `Movable` (replaces a container div; grip handle, group
  handle `BOTH` top centre). Pointer events with capture, delta divided by the
  stage scale, clamped to the stage, z 60 while dragging, offsets per card id in
  sessionStorage, Reset layout left of Next, print and export use the default
  layout, and the slide section's scroll pinned at 0.
- `drag-check.mjs`: 40 assertions (code only, box only, code plus box, clamp,
  z-index, touch, text selection, persistence, reset, print) at 1280x720 and
  1920x1080; all passed before removal.

To restore: copy `move.tsx` to `src/decks/figures/`, wrap `Panel`'s data-spec
div in `<MoveScope id={spec}>`, and turn the container divs back into
`<Movable id="…">` (`group` on a code plus output wrapper).
