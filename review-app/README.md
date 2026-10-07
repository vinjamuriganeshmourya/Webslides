# The deck review app

Pick a course, a session and — where a session has more than one cut — a version,
then comment on a slide or on a named component inside that slide. Every comment is
written straight to a markdown file in the course, and that file is what Claude Code
is pointed at.

## Running it

```bash
node review-app/server.mjs            # default port 5199, opens a browser
node review-app/server.mjs --port 6000
node review-app/server.mjs --no-open
```

Node only, no install step and no dependencies of its own: one `node:http` server
and two HTML pages, serving every course and session in the repo. Its port is not
derived from any session's `devPort`, so it never collides with a deck running under
`npm run dev` beside it.

A session is anything with a `deck.config.json` in it, and its course is whatever
directory contains it. Nothing is listed by hand: a hardcoded list of courses would
be the first thing here to break the rule that a course is just a directory, and it
would break it silently. Versions are read off the folder name (`_v2`, `-v3`), and
the newest cut is listed first.

## The flow

1. Pick a session in the picker. It shows how much review each cut already carries,
   whether it has ever been built, and whether the build is older than `src/`.
2. The first time you open a session, the app builds that deck for review. A build
   is needed because the reviewable deck is not the deck you ship: it is compiled
   with a babel plugin that stamps the component name onto every DOM element, which
   is what lets a comment name `CodeBlock` rather than "the grey box". The app never
   builds a deck itself — it shells out to `npx vite build -c
   vite.review.config.ts` with the session as the working directory, so each deck is
   built by its own React, its own vite and its own `node_modules`. Rebuild from the
   review screen after you fix something.
3. Navigate with the arrows, the left and right keys, or the filmstrip. The deck is
   loaded with `?all`, the same flag `preview.mjs` uses, so every reveal step is
   already shown: half a slide reads as a slide with missing content.
4. Arm the picker (`p`, or the button). Hovering outlines the component under the
   cursor and names it.
5. Click the thing that is wrong. The composer fills in a breadcrumb of every
   component the click was inside — a line of code is inside `CodeBlock`, which is
   inside `ContentSlide` — and you pick how wide a target to comment on by clicking
   a chip. The innermost is selected by default, because someone who aimed at
   something meant the thing they aimed at. `Whole slide` files against the slide.
6. Write the note and press Ctrl+Enter. It is on disk before the toast fades.

A slide also takes a verdict: approve, changes requested, or clear.

## Where the comments go

```
<course>/workflow/reviews/<session>.review.md
```

Keyed on the session FOLDER name, not on `name` in `deck.config.json`: two cuts of
one session sometimes carry the same `name` — v2 and v3 of session 1 both say
`deployement-session-1` — and keying on that would have them writing into each
other's review, which is exactly the comparison the version picker exists for.

Markdown rather than JSON because of who the two readers are: Claude Code is asked
to act on the file, and a reviewer is asked to trust it.

```markdown
# Review · Docker File Creation

- session: `deployement_session_2_v2`
- deck: `docker-file-creation`
- slides: 52
- updated: 2026-09-01 10:16

Status: `[ ]` open · `[x]` done · `[~]` wont fix

**1 open comment.** 1 slide approved, 1 with changes requested, out of 52.

## Slide 7 · intro-why-docker
<!-- Why Docker -->

Verdict: changes requested

- [ ] **CodeBlock** · `src/ui/CodeBlock.tsx:84` · @612,338 <!--c:k3f9a1@2026-08-28-->
      This should be a terminal, not a code block. The reader is running the
      command, not reading a file.
      > "docker build -t app ."

## Slide 12 · build-first-image

Verdict: approved

- [x] **slide** <!--c:p2m7bb@2026-08-28-->
      Kicker repeats the title.
```

`src/ui/CodeBlock.tsx:84` is where the clicked element is authored, read off the DOM
rather than typed. `@612,338` is the pin, in 1280x720 slide coordinates.

Slides are keyed by `SlideDef.id`, never by number, because the number changes the
moment a slide is inserted above; the number in the heading is refreshed from the
live deck on every save, so a review written against a 45-slide cut still lands on
the right slides at 52. A slide that left the deck keeps its comments under a
trailing "Not in the deck any more" heading, because a comment is often why the
slide went. Slides nobody has said anything about are not written at all.

`<!--c:id@date-->` is invisible when the markdown is rendered, and is how the app
resolves or deletes the comment you clicked rather than the third one down. Rewording
a note by hand is safe, since note text is plain prose on indented lines, but leave
the markers alone: the file is rewritten whole on every change, and a line the parser
cannot read is dropped on the next save.

## How a review reaches Claude Code

Point Claude Code at that markdown path. There is no export step.

## The rendered report

The app also serves the review as one self-contained HTML file, to open or to
download: the thing you send to somebody who is not going to open a repo. It reuses
`workflow/preview/thumbs/NN.jpg`, which `preview.mjs` already writes on every
verification sweep, so each slide's comments sit beside the slide they are about;
where those are missing it renders without them rather than launching a browser,
because rendering a report must never be the thing that takes 90 seconds.

## What a session needs first

`vite.review.config.ts`, `review/markComponents.mjs`, and its own `node_modules`.
The first two are kit files, so a session that predates the review app just needs
the kit pushed into it:

```bash
cd slide-kit/slide-template
node sync-kit.mjs --apply ../../django_deployement_course/deployement_session_2
```

Then `npm install` in the session if it has none. The app checks all three up front
and names what is missing rather than letting a build fail.

## How it works

`review/markComponents.mjs` is a babel plugin, run only by the review build, that
stamps `data-ui="CodeBlock"` and `data-ui-loc="src/ui/CodeBlock.tsx:84"` onto every
DOM element. Marking every element rather than each component's root is what makes a
comment on the third row of a table land on the row: the picker walks up from what
you clicked, so the innermost mark wins. It is a build-time transform because the
hand-written alternative does not survive this kit — many components return another
component as their root, and `data-ui` on a component is a prop, not an attribute.

`Deck.tsx` publishes `window.__DECK__`, the slide ids in order plus the current one.
That is where slide identity comes from, and the rail follows the deck rather than
assuming it led, because the deck owns the arrow keys whenever it has focus. Pins are
measured off the `[data-slide-stage]` element and scaled to 1280x720, and the iframe
is itself sized 1280x720 and then scaled to fit the window: a 900px-wide stage
renders a correct but different deck, and a pin measured against it is measured
against geometry nobody is signing off.

The review build is separate from `build:html` and writes to `workflow/review/deck/`,
which git ignores, so nothing about reviewing ever ships in the deliverable: the
shipped deck never runs the babel plugin, and the picker is a string this app injects
into the iframe after load rather than anything in the bundle. It also skips `tsc -b`
and single-file inlining, because it is never handed to anyone and a type error
should not stop a reviewer from looking at the slides.

## What it is not

Not the sign-off record: `<course>/workflow/reviews/*.reviews.json` still holds
that. Not a QA harness either — `qa.mjs`, `align-check.mjs` and `video-safe.mjs`
find what is measurably wrong, and this records what a person thinks is wrong.
