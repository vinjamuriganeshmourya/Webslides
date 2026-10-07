<!-- cSpell:ignore NxtWave devPort strictPort Anu Nandu Zoya Arun isidentifier -->
# Comparing Strings & Naming Variables · session notes

Python course, Programming Foundations session 18. Built 2026-10-05 from the
pedagogy team's reference deck
`Reference ppt's/18_comparing_strings_naming_variables_student_view_new_design.html`
under the plan at `../session_plans/18_comparing_strings_naming_variables/plan.md`.
Course-wide rules and the feedback log are in
`../workflow/skills/python-course/SKILL.md`; read that and
`.claude/skills/pedagogy-to-components/SKILL.md` before editing.

28 slides. `devPort` 5247. Deck file `src/decks/comparingStringsDeck.tsx`.

## Decisions specific to this deck

1. **One slide per reference frame, all 28, in the reference's order**: the
   27 cards and the one `02 · Naming Variables` divider the presenter walks
   between them (`SectionBreakerSlide`). Nothing added, nothing dropped.
2. **Every code panel says `Python`** (content rule 31). The reference's
   invented file names are not carried.
3. **Content rule 36 everywhere**: no line of slide copy ends in a full stop;
   a two-sentence caption is two lines in one box (`Lines` in `common.tsx`).
   Code, output, error text and the drawn screens keep their own punctuation.
4. **Template colours only** (user, 2026-10-05, for every deck from now on).
   Every tile, bubble, card header and bar reads `src/design/tokens.ts`; the
   reference's palette is not copied. The recap header is the brand tone
   through `figures/RecapBrand.tsx` (the session-local override of the kit's
   `RecapSlide`, which paints it green). Anu's skin and hair and the device
   chrome are the drawn object's own colours, as session 15's chat palette.
5. **The reference's controls stay.** `Next` beats are build steps
   (`useBeats`); slide 14's is labelled `One step` and carries the reference's
   **slider** for the second word, which restarts the walk at beat 1 (it
   walks the deck back with `deck.prev()`). Timers on slides 12, 24 and 25
   are the kit's `Countdown`: nothing starts until the instructor presses play.
6. **Votes are clickable, `Next` is not gated** (session 16's decision 5).
   The reference's True / False chips (15), A to D names (23) and the four
   `name = …` options (25) are static text; here they are buttons so the pick
   is locked in and the confetti fires when the room was right.
7. **The laptop is a laptop** (`figures/Laptop.tsx`). The password hook is
   about Caps Lock, a key a phone keyboard does not have, and the caption
   says *laptop password*, so session 16's `Phone` would be the wrong object.
   The Instagram hook uses `Phone` (width 200, no header).
8. **Instagram is named in the captions only** (the reference's sentences,
   course rule R2). The phone screen carries no logo and no wordmark: course
   rule R5 forbids a hand-drawn mark, and the asset library has none.
9. **Session-local figures** in `src/decks/figures/`: `Characters` (Anu, the
   Computer, `Bubble`, `Speaker`), `tiles` (`Tile`, `FnBox`, `Banner`,
   `Verdict`), `compare` (`walk()` and `WordCompare`, the engine behind
   slides 13 to 15), `RecapCards`, `Laptop`, `PasswordHook`, `UnicodeIntro`,
   `OrdChr`, `Ranges`, `PrintLoop`, `Task1`, `CompareIntro`, `Pointer`,
   `CompareMachine`, `NamesHook`, `Rules`, `Keywords`, `ValidOrNot`,
   `CaseStyles`, `BestName`, `Task4`, `Closing`, over pieces carried from
   session 16 (`common.tsx`, `motion.tsx`, `controls.tsx`, `RecapBrand.tsx`,
   `Phone.tsx`, `BeatList.tsx`, `IoPanels.tsx`). None is in the kit;
   promoting one is a kit PR with the user's approval. `Phone` is now in
   three sessions and `controls.tsx` + `RecapBrand.tsx` in three: the first
   kit-PR candidates.
10. **Every output is a real run** on CPython 3.12.3; the plan lists them.
    The comparison sentences on slides 13 to 15 are derived by `walk()` from
    the two words and the operator, so they cannot disagree with Python.
11. **Motion** is session 15's register: `Press`, `Glow` when a value lands,
    slide-wide `Confetti` on a right pick, `BeatFade` on bubbles. Nothing
    self-advances.
12. **The takeaways title is shortened** (content rule 35): the reference's
    *Comparing strings and naming variables, in six examples* wraps at 34px
    Poppins; the slide reads *Strings and names, in six examples*. The six
    cards keep the reference's own content (course rule R2), not the agenda
    strings (content rule 20); flagged in the plan.
13. **Git is not touched** (plan decision 11): the tree is shared with the
    session building 17, so the folder stays untracked until the user says.

14. **The control bar on a phone, auto-hiding (user, 2026-10-05).** The
    same kit-branch files as session 17's decision 14 (**`kit/mobile-nav`**:
    44px targets, two rows under 560px, safe areas, 100dvh, re-laid on
    rotation; `sync-kit --apply` must wait for that branch). This session
    opts into **`overlay`** through `player.autoHideControls` in the deck's
    meta: on a phone the bar lies over the stage and is HIDDEN until a tap
    on the stage (not on a control), a pull up from the bottom edge, or
    keyboard focus; it goes 1.5s after a press on it and 3s after a summons
    with nothing pressed; it starts on screen so it can be found once. While
    shown in landscape it covers the bottom 60px of the slide (the footer
    and the Next / Replay line), briefly and by design: the alternative,
    docking, costs 14% of the slide's height for the whole session.
    `phone-nav-check.mjs` and `autohide-check.mjs` at the project root are
    the proofs. Desktop is unchanged from the previous build.
15. **Touch and trackpad navigation (user, 2026-10-05).** Session 17's
    `src/decks/figures/gestures.ts`, copied unchanged and installed from the
    deck file, so the two sessions move the same way: one swipe or one
    two-finger burst is one slide; a tap, a vertical swipe, two fingers and
    a swipe that starts on a button, a slider or a field move nothing; the
    module sets `touch-action: pan-y pinch-zoom` and switches the browser's
    history swipe off. The kit's `kit/deck-gestures` hook makes this copy
    stand down after a sync. `gesture-check.mjs` at the project root drives
    the built file (the shape generate-slides section 7 asks for).
16. **No sound (user, 2026-10-05).** A synthesised sound layer (slide, step,
    select, toggle, tap, hover) and a mute button in the control bar were
    built for this session and removed the same day on the user's word. The
    deck has no sound and no sound button; do not add them back. The kit's
    `deck:navigate` event, which the sound layer listened to, is kit and
    stays.
17. **The agenda mark** as session 17's decision 15: `src/decks/figures/
    Agenda.tsx` (override of the kit's `AgendaSlide`, kit branch
    `kit/agenda-session-name`), the deck passing `kicker={SESSION}
    title="Agenda"`. "Comparing Strings & Naming Variables" sits in two
    lines at 16px. `agenda-check.mjs` at the project root.
18. **The agenda points are centred on the mark (user, 2026-10-05, this
    session only).** The kit's agenda spreads the points from y 268 to 612
    whatever their number, so two points had their middle at y 440: one near
    the mark's top, one below the mark. Here `pointYs()` centres the group
    on the mark's centre line, y 366, with a gap of `338 / n` (the orbit
    ring's height over the count) and never under 96px; from five points the
    group extends past the ring equally above and below, and past the canvas
    margins the gaps shrink evenly. The badges still sit on the arc (x comes
    from y). A point within 100px below the speaker box has its text capped
    short of x 913, every point is capped at the frame's right edge, so a
    long title wraps and never runs under the box or off the slide. This is
    the one place this file differs from the kit branch; session 17 keeps the
    kit's spacing until the user says otherwise. `agenda-check.mjs` now
    asserts the centre line, the equal gaps, the badges on the arc, the box
    and the frame.

19. **Code shows two characters for `==` and `>=`, never a joined glyph
    (user, 2026-10-05; content rule 40, every deck).** JetBrains Mono's
    ligatures joined them on slides 3 and 15 (`==`) and 13, 14, 15 and 25 (`>=`). `src/index.css` (a kit file,
    carried directly like the player files; kit branch `kit/code-ligatures`)
    turns `liga` and `calt` off on `.font-mono, pre, code, kbd, samp`, so the
    fix is the template's and no slide was touched. Advance widths are
    unchanged, so nothing moved: a pixel diff of every slide before and after
    shows change only inside the operators. `ligature-check.mjs` at the
    project root walks the built file and lists the slides and operators.

20. **Slide 10 (user, 2026-10-05).** The last band's description,
    `signs, and other languages`, wrapped to two lines in the 196px column
    and stood 64px tall in a 60px band, over the band's edge; it is `signs &
    other languages`, one line. The speech bubbles' side tails were pinned
    at `top: 26`, right for a two-line bubble and 6px proud of a one-line
    one (steps 2 and 3), so the tail read as hanging off the box; the tail
    now sits at 26px or centred, whichever is higher (`Characters.tsx`,
    `Bubble`). That is the shared component, so the same tails on slides
    11, 19, 20, 22 and 23 are corrected with it.
21. **The Computer in depth, slide 10 onward (user, 2026-10-05).**
    `Computer` takes `look="3d"`: the same object, shapes, colours and
    footprint, with the body lit from the top left and shaded at the bottom
    right, a rim light on the bezel, a 6px slab of thickness under the body,
    the screen set into the bezel with a shadow under its top edge and one
    gleam across the glass, a cylindrical neck, a lit base and a soft ground
    shadow. All of it is white or black at low opacity over the token fills,
    so the colours stay the kit's. `Speaker who="computer" look="3d"` on
    slides 10, 11, 13, 19, 20, 22 and 23. **Slides 7, 8 and 9 keep the flat
    computer**, because the brief said slide 10 onward; one word in each of
    `UnicodeIntro.tsx` and `OrdChr.tsx` switches them. Positions and sizes
    are unchanged (same viewBox), checked by a pixel diff of every slide
    against the previous build: only the computer and the bubbles moved.

22. **Slides 7 to 9: the speakers stand still, and the Computer is 3D there
    too (user, 2026-10-05).** The `over` layout's bubble slot was a minimum
    of 86px, so a taller line pushed the figure down: the Computer stood at
    y 323, 335 or 360 depending on the press and the slide. `Speaker` now
    takes `slot`, a fixed height, and the three figures pass `OVER_SLOT`
    (128px: the tallest Computer line on these slides, 123px, plus slack) for
    BOTH speakers, so Anu and the Computer keep their heads level as before,
    at y 365 on every press of all three slides, and the tallest bubble fills
    the slot from y 221 down without touching the speaker box. Slide 7's Anu
    column is 220 wide like slides 8 and 9 (it was 210, which stood her 5px
    further left than on the next slide). The Computer takes `look="3d"` on
    all three, the same drawing as slides 10 onward. Checked on the built
    file at every press: the Computer at (1016, 365), Anu at (108, 365), on
    all three slides.

23. **The feedback slide (user, 2026-10-06).** Slide 27 is
    `src/decks/figures/FeedbackForm.tsx`, not the kit's `FeedbackSlide`: the
    night stage; the kicker, the title and one line at the header zone's
    origin; and ONE white box as the body block, x 64..1216, y 240..640,
    under the speaker box's floor and clear of the control bar and the footer
    mark. Inside it, side by side and centred as a group: the supplied QR code
    (`public/assets/feedback-qr.png`, the file as given, byte for byte; it
    encodes `https://forms.gle/5d1Ru8geTKdC4Bcr7`) with `Scan to open the
    feedback form` and the link (new tab, `noopener`), a hairline separator
    the height of the QR panel, and the Google Form in an iframe
    (`/viewform?embedded=true`, 640 wide, the form's own full width), framed
    like the QR panel. The form scrolls inside its frame and needs the
    network, the one thing the rest of the deck never does. The CSS is
    injected once from the figure, as `motion.tsx` does, because
    `src/index.css` is kit. On a phone held upright the box stacks
    (`@media (orientation: portrait)`): the line under the title goes, the box
    starts at y 192, QR row over a horizontal separator over the frame. Held
    sideways the box stops at y 576, so the summoned overlay bar covers
    nothing. **Later the same day (user):** the title sits on ONE line (the
    header block is 760 wide, x 64..824, still short of the speaker box);
    under the link a call-to-action line, `Scan the code, click the link, or
    fill out the form right here`, 16px in the body tone; and the box is
    decorated as the kit decorates a card: `Card`'s hairline `line` border,
    `Callout`'s accent bar in the brand tone on the left edge, clear of the
    corners, and a soft brand halo under the float shadow. Nothing moved:
    the border is inside the box and the bar is painted, not laid out; on a
    phone held sideways the QR is 160 so the taller block still fits the
    shorter box. **Two variations were built first**, this one and a native
    styled form (the form's fourteen questions as fields named
    `entry.<id>`, UI only, no submit, no validation); the user chose this one
    the same day and the other was removed with its slide, as the sound layer
    was (decision 16). Do not add it back unless asked. Harnesses: `video-safe`
    CLEAN, `qa` keeps its baseline (1 and 28), `align-check` 0 of 28.

## Kit PR notes (not opened; the user asked for the note, not the PR)

- `kit/mobile-nav` and `kit/agenda-session-name`: see session 17's notes;
  both branches are committed locally, not pushed.
- No sound layer goes to the kit from here; it was removed (decision 16).

## Running it

`vite.config.ts` is a kit file and hardcodes port 5173, so start on the port
the harnesses read:

```bash
npx vite --port 5247 --strictPort
export CHROME_PATH=/usr/bin/brave-browser   # /opt/google/chrome/chrome is not on this machine
node video-safe.mjs & node qa.mjs & node align-check.mjs & wait
npm run build:html && node preview.mjs && node scripts/build-preview-page.mjs
node phone-nav-check.mjs && node autohide-check.mjs && node gesture-check.mjs && node agenda-check.mjs
```

## Harness baseline, 2026-10-05 (re-run after the phone bar, gestures and agenda)

`video-safe` CLEAN, `align-check` 0 of 28, `qa` flags slides 1 and 28 (the
usual two); the four phone and agenda checks above all pass on the built file. `qa`'s type-floor warnings that stay: slide 4 (the laptop's login
screen and keyboard), slide 17 (the phone's sign-up form and keyboard), both
drawn product chrome, small by nature as session 16's phone screens were; and
slide 10, where the 26 capitals and 26 small letters carry their Unicode value
at 12px under a 26px cell, because 26 cells have to share Space-1 and Space-2
in one row, as the reference draws them.
