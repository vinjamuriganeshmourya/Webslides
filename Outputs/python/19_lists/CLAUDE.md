<!-- cSpell:ignore NxtWave devPort Chuttamalle Hukum Kaavaalaa Kesariya Kissik Naatu Arjun Bhavya Charan Divya Maggi pushups -->
# Lists · session notes

Python course, Programming Foundations session 19. Built 2026-10-06 from the
pedagogy team's session spec, `Reference ppt's/19_lists_session_spec.json`
(the data) and `19_lists_session_spec.html` (the reading page), under the plan
at `../session_plans/19_lists/plan.md`. Course-wide rules and the feedback log
are in `../workflow/skills/python-course/SKILL.md`; read that and
`.claude/skills/pedagogy-to-components/SKILL.md` before editing.

29 slides, one per spec card. `devPort` 5248. Deck file `src/decks/listsDeck.tsx`.

## Decisions specific to this deck

1. **One slide per spec card, all 29, in the spec's order.** The spec is a
   contract, not a finished deck: beats, cards, presses, exact words, code with
   real outputs, traces. Each content slide's body carries `data-spec` and
   `data-presses` (the `Panel` props), for the team's review script.
2. **Exact words with content rule 36**: the spec's words unchanged, the
   trailing full stop dropped, a two-sentence line split onto two lines
   (`sentences()` in `figures/pieces.tsx` does it for data strings). Code,
   outputs, error text and quoted speech on the suspect cards keep their own
   punctuation.
3. **Every code panel says `Python`** (content rule 31). The spec's file names
   (`list.py`, `len.py`, `road_trip.py`, ...) are not carried.
4. **Template colours only** (content rule 37). The Spotify screen's dark
   shell and green (`figures/PlaylistHook.tsx`) are the drawn object's own
   colours and stay inside the monitor; the mark is the library's
   `public/assets/companies/spotify.png` (rules 12, 13). No `Playlist` label
   on it, and nothing before the title card says `list` (spec rule 4).
5. **Presses are the kit's build steps** (`useBeats`), with session 18's
   `Next` / `Replay` (`figures/controls.tsx`). Timers are the kit's
   `Countdown`: 4:00 on tasks 1 and 2, 5:00 on task 3 (its words say
   5 minutes; its data said 240 seconds; the words win), 2:30 on the exit.
   Nothing self-advances.
6. **Votes are clickable, `Next` is not gated** (session 16's decision 5):
   the game's A / B / C and the exit's three options are buttons; confetti
   fires when the room's pick was right.
7. **Derived, never typed**: the slice walker's events come from `walk()` in
   `figures/SliceWalker.tsx`, which slices the way Python does, so the sliders
   may be live for the instructor and every run still follows the data (the
   four spec runs were checked against CPython 3.12.3; plan, outputs table).
   Moving a slider restarts that run at its set press (`deck.prev()` back),
   as session 18's `Pointer` did.
8. **Shared-layout moves** (framer-motion `layoutId`): the recap chips fly
   from the tray into their bin, the hook's seven variable boxes slide into one
   row under `road_trip`, and `list_a` and `list_b` slide together into
   `list_c`. Under `useInstant()` the transitions are zero.
9. **The agenda stays the kit's** (content rule 39, `figures/Agenda.tsx` from
   session 18); the spec's "one stop lights per press" is not carried. **Arrow
   keys stay the kit's**; the spec's "right arrow is one press" is its own
   HTML builder's contract. Both recorded in the plan, decisions 4 and 5.
10. **Takeaways are the spec's six examples**, not the agenda strings
    (content rule 20), as session 18 kept its reference's cards. Flagged in
    the plan.
11. **Session-local figures** in `src/decks/figures/`: `pieces` (`ListBoxes`
    with positions, ghosts, a cursor and a frame; `OutPanel`; `BigLine`;
    `Option`; `TaskPill`; `Steps`; `Note`; `Ask`; `sentences`), `RecapSort`,
    `PlaylistHook` (`Monitor`, the Spotify screen), `ListRow`, `MakeList`,
    `NestedList`, `LenCount`, `IndexCursor`, `LoopItems`, `Task1`,
    `MaggiCase`, `JoinLists`, `GrowList`, `RepeatList`, `Task2`,
    `SliceIntro`, `SliceWalker`, `StepSlice`, `ListFrom`, `SpotError`,
    `CanteenWeek`, `ExitVote`, `Takeaways`, over pieces carried from session
    18 (`common`, `controls`, `motion`, `BeatList`, `IoPanels`, `Laptop`,
    `RecapBrand`, `tiles`, `Agenda`, `gestures`). None is in the kit;
    promoting one is a kit PR with the user's approval. `ListBoxes` is the
    first candidate: a list drawn with positions is what every list session
    needs.
12. **The player files** (`src/deck/*`, `App.tsx`, `index.css`, `index.html`)
    are session 18's copies of the kit branches `kit/mobile-nav`,
    `kit/code-ligatures`; `sync-kit --apply` must wait for those merges.
    `player.autoHideControls` is on, as in 18.
    **Player fix, 2026-10-06 (user: "slide" mode showed black screens and
    overlapping slides):** `src/motion/presets.ts` gives the cut a real exit
    (the empty `none` exit never finished, so departed slides were never
    unmounted) and each exit its own timing via `custom={ dir, cut }`;
    `src/deck/Deck.tsx` wraps each slide's inside in `PresenceContext` `null`,
    so a shared-layout element inside a slide can no longer hold the slide's
    exit open (one stuck exit kept EVERY later slide mounted). Kit-owned files,
    so `sync-kit --apply` would undo this until the same fix lands in the kit
    (every deck and the template carry the bug). `nav-stress-check.mjs`
    drives the built file in Chromium, Firefox and WebKit at phone, laptop,
    1080p and 4K sizes.
13. **Git is not touched**: the shared checkout carries another session's
    staged work on the current branch; this folder and its plan folder stay
    untracked until the user says.
14. **Arrows stay out of boxes, highlights stay on their element (user,
    2026-10-06; content rules 42 and 43).** `ListBoxes` reserves a 16px taller
    cursor lane whenever `cursorLabel` is passed, and the cursor lands 4px above
    the boxes (slide 12's `item` cursor had dropped 16px into them). `Glow`
    takes a `style`, and `OutPanel` puts its width on the glow wrapper, so the
    glow is the panel's own bounds (slides 11, 12, 16, 17, 18, 22, 23).
    `overlap-check.mjs` at the project root checks both on every step of the
    built file; sessions 17 and 18 passed it unchanged.
15. **The feedback slide is session 18's, copied exactly (user,
    2026-10-06; content rule 41).** Slide 28 was the kit's `FeedbackSlide`;
    it is now `FeedbackEmbedSlide` from session 18's `figures/FeedbackForm.tsx`
    with its `public/assets/feedback-qr.png`, both byte for byte. A pixel
    diff of the two built slides differs only in the slide counter and the
    progress line. `feedback-check.mjs` at the project root compares the
    rendered markup with session 18's built file. The form frame never lets
    the network go quiet, so the four layout harnesses were run from
    temporary copies with outside requests blocked: all clean.
