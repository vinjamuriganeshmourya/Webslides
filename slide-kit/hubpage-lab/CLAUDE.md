# Registry page figure lab

**DECISION: OPEN.** Nothing here is approved. Four candidates are built and
rendered; a human picks, and the pick plus the reasons go in this file.

**Not a session.** A lab inside the kit whose only job is to choose a figure for
one slide: deployment session 6 slide 33, `c3-on-the-hub`.

```bash
npx vite --port 5231 --strictPort
npx tsc -b --noEmit
npm run build:html            # -> dist-single/hubpage-lab.html
export CHROME_PATH=/opt/google/chrome/chrome
node qa.mjs && node video-safe.mjs && node align-check.mjs
```

`node_modules` is a symlink to `../slide-template/node_modules`.

## The design question

Slide 33 has to show the room **what a pushed image looks like once it is public
on Docker Hub**. It is the payoff moment of the whole session: everything before
it is building, tagging, logging in and pushing, and this is the slide where the
thing exists somewhere other than the learner's laptop.

What it ships today is a single `CodeBlock` holding
`hub.docker.com/r/ravi123/nxttrendz-backend`, floating on an otherwise empty
frame. An address is not a page. The claim is that the image now has a public
page anyone can pull from, and a string of characters shows none of those three
things. `CodeBlock` is also a FILE view, so the address is set as though it were
something you type into a terminal.

## Why this is a drawing problem and not a screenshot problem

Session 6 build rule **R6**, recorded in `dockerHubDeck.tsx`: **nothing in this
session can be captured.** Docker Desktop will not run on the capture machine,
and this slide additionally needs a real Docker Hub account and a real push, so
the capture is impossible rather than merely inconvenient. Everything in that
deck is QUOTED or DRAWN.

That makes the figure a stand-in for a capture that cannot be taken, which puts
it under content rule 8 and the spirit of rule 11: it must not invent facts, and
it must read as a **diagram of a page**, never as a photograph of one. A figure
that reproduces a real product's exact chrome is a fabricated screenshot doing a
diagram's job. So every candidate is drawn in the deck's own palette from
`src/design/tokens.ts` — no Docker blue, no Hub navy, no whale.

## What the plan authorises the figure to show

The signed-off plan's **section 6.1** is a TR patch asking for exactly three
things to be added to the TR so this slide can be faithful:

- the repository name
- a **Tags** tab listing `v1` with its **size** and **push time**
- the `docker pull ravi123/nxttrendz-backend:v1` command Hub displays for copying

`visibility` is the fourth thing every candidate draws, and it is the word the
slide is actually about. Nothing else is allowed. `RegistryPageProps` in
`src/ui/registryPage.ts` therefore has **no field** for a star count, a pull
count, a description, an overview body, a signed-in user, a second navigation
tab or an "Updated by" line. The absence is deliberate and it is a test: **a
candidate that needs one of those to look convincing is a fabrication risk, and
the missing field is where that shows up** — the same way `AnalogyMap`'s props
were the tell in `comparison-lab`.

Note the state of play in the deck itself: `c3-on-the-hub`'s own source comment
says the tag listing and pull command "are not in the TR and are not invented
here", so **the 6.1 patch has not been applied to the TR yet**. Every candidate
in this lab assumes it will be. If it is not, the honest slide is the incumbent
or no slide at all, and no drawing here fixes that.

## The fixture

Rendered identically by all four candidates, and every value comes from session
6 rather than from this lab:

| Field | Value | Source |
|---|---|---|
| repository | `ravi123/nxttrendz-backend` | `DOCKER_ID` + `IMAGE` in `deckShared.tsx` |
| tag | `v1` | the `push` target the session builds |
| size | `156MB` | the `docker images` output the deck quotes |
| pushed | `2 hours ago` | same output |
| image ID | `3f2a8b91c04d` | same output. `SplitProof` only |
| pull command | `docker pull ravi123/nxttrendz-backend:v1` | section 6.1 |

A fixture invented for the lab would be judged on how well it suits the lab.

## The four candidates

All take the identical `RegistryPageProps`, so swapping one for another is a
rename at the call site. That is `comparison-lab`'s and `flow-lab`'s pattern and
it is what makes choosing cheap.

| Candidate | The bet | Worst at |
|---|---|---|
| **`RepoPage`** | The claim is that the image now has a PAGE, at an address, that anyone can open, and a page is the thing the room has to picture. So draw the page: a window with the address in it, the repository name with a PUBLIC badge, one **Tags** tab, the table, and the pull command in a copy row | HALF WIDTH, and it is the only candidate that loses information rather than density: at 460px both the address and the pull command truncate to an ellipsis, so the two strings that carry the whole claim become unreadable. It is also the most chrome per fact of the four — a window, a header, a tab and a table, to deliver one repository name, one tag row and one command |
| **`TagLedger`** | The window is 90px of vertical chrome carrying one fact, that this is reached through a browser, and the lead sentence carries that fact for free. Keep everything 6.1 authorises, throw the window away. Also the honest baseline: with no window there is nothing to mistake for a screenshot | The word PAGE. The claim is that the image now HAS a page, and a ledger draws the contents of a page without drawing that it is one. It is also the flattest reading of the payoff: the room has read several tabular figures by this point in the session, so the slide meant to feel like an arrival looks like another table. At half width the PUBLIC badge drops to a second header row, because it is pushed right by `ml-auto` and the repository name is 25 characters of monospace |
| **`PullCard`** | Refuse the page. What changed when the push finished is that ONE LINE now works on any machine, so the command is the hero on the deck's own navy code register and the repository, tag, size and push time drop to a supporting row. The only candidate with no table, so the only one that cannot be misread as a screenshot at all | The word VISIBLE. The slide sits under the middle box of the target picture, which the deck has drawn twice as a PLACE things live, and a command is not a place. Also more than one tag, which demotes the hero line to a heading over a list. And it is the candidate most likely to duplicate the NEXT slide, `c3-pull`, which runs this exact command in a terminal. At half width its supporting row wraps to two lines once the type is legible, so at that measure it carries the command plus a two-row block rather than the clean one-line footnote it is designed around |
| **`SplitProof`** | The only candidate where the DRAWING makes the claim rather than arranging one the lead already made: the thing on your laptop and the thing on Hub are the same image, and the twelve shared characters are the join between them | The word PUBLIC. Its subject is sameness, and sameness is true of a private repository too, so the badge carries the public claim alone against a drawing arguing something else. It also needs the `local` field no other candidate reads, the widest contract of the four and the easiest to feed a fixture it cannot honour. At half width it stacks and the spine stops being a join between two things and becomes a divider between two lists, so the figure loses the only argument it was making, and the stack fills the well to within 12px of the bottom of the well, the tightest frame in this gallery |

## Which read as a diagram rather than as a fabricated screenshot

Read off the rendered slides, which is the only way this question can be
answered:

- **`PullCard` and `SplitProof` cannot be misread at all.** Neither imitates a
  page's layout, so there is nothing to imitate wrongly. `PullCard` is the
  deck's existing dark code register; `SplitProof` is two labelled panels and a
  spine.
- **`TagLedger` reads as a diagram**, and the reason is that it half-draws
  nothing: it has no address and no window, and its title row says
  `REPOSITORY` in the deck's own kicker type, which is a label no product page
  carries.
- **`RepoPage` reads as a diagram too, but it is the only one where that had to
  be engineered.** Three decisions do it: the bar is labelled `BROWSER` rather
  than dressed as an omnibox; there are no traffic lights, no back arrow, no
  bookmark star and no avatar; and there is exactly ONE tab, because inventing
  the others is inventing chrome. It has the most to gain from the choice and
  the most to lose from a future edit — anything added to make it look "more
  real" moves it across the line, and the empty right side of the header is
  where that pressure will show up.

Two disciplines produced those cuts, and both are borrowed. `Terminal`'s two
chromes exist because "a slide saying Administrator PowerShell while drawing VS
Code's panel is telling the room two different things, and the one it draws is
the one that wins", so nothing is drawn in `RepoPage` that the room will not see
at that address. `Shot`'s rule 11 says a capture keeps the context that carries
meaning and nothing else, which is why the address bar keeps its padlock and
loses everything else.

## The judgement calls, so a human can overrule them

**`RepoPage` draws a COPY button.** A button on a static slide implies an
affordance nobody in the room can use. There is precedent both ways and the kit
records it: `Terminal` draws PowerShell's three window buttons deliberately,
noting "nothing on a slide can click them", because they are most of what makes
the window read as its own window. **This lab went the same way**: Hub really
does put the pull command behind a copy button, the button is a large part of
what makes the copy row read as a row you copy from rather than a caption, and
removing it leaves the command sitting in a field with no explanation of why it
is in a field. If the picker disagrees, deleting it is a five-line change and
the row still reads.

**Every candidate is vertically CENTRED in the content well, by one shared
mechanism.** The review's direction is *"in all labs the content is top aligned,
i want content to be center aligned"*, and it reverses a top-anchored datum this
lab briefly shipped.

What is shared is the **mechanism, not the position**: `Datum` in
`hubpageLabDeck.tsx` is the only thing that places any figure, so the four
candidates are centred identically and any difference in their top edge is a
consequence of the figure's own height and of nothing else. That difference is
real, and it is the cost of the direction: the gallery's top edge now moves from
slide to slide, which slightly undercuts the lab's premise that the only variable
between slides is the drawing. The spread is small because these are
single-figure slides with no points column to drift against — 53px between the
tallest and shortest candidate at full width.

`Datum` also carries the **instructor-video clamp**: 6px of padding on the top
and bottom edges, so centring stays exact inside the padded box while the box can
never begin above y=223. `x 913..1280, y 0..220` is absolute, centring frees a
tall figure to move UP, and under a ONE-LINE lead the well's own top is y=217,
three pixels above that floor. At the current heights the clamp does not bind —
the tallest block on a one-line-lead slide still lands at y=229 — so it is a
guard against a future taller figure rather than something that saved this
render. `node video-safe.mjs` reports CLEAN.

### The measured spread, read off the live page at 1280x720

Well geometry: top **y=250**, height **406px** under a two-line lead; top
**y=217**, height **439px** under a one-line lead.

| Slide | Figure | Height | Top gap | Bottom gap | Top edge |
|---|---|---|---|---|---|
| 3 | `RepoPage` | 362 | 22 | 22 | **272** |
| 4 | `TagLedger` | 267 | 70 | 70 | **320** |
| 5 | `PullCard` | 257 | 75 | 75 | **325** |
| 6 | `SplitProof` | 273 | 66 | 66 | **316** |
| 7 | `RepoPage` compact | 296 | 55 | 55 | **305** |
| 7 | `TagLedger` compact | 257 | 55 | 94 | **305** |
| 8 | `PullCard` compact | 169 | 12 | 258 | **229** |
| 8 | `SplitProof` compact | 415 | 12 | 12 | **229** |
| 9 | `PullCard` compact, beside points | 221 | 109 | 109 | **326** |

Top and bottom gaps are equal on every slide that carries one figure, which is
the check that centring is actually centring. On slides 7 and 8 the PAIR is
centred as a block and the two figures share a top edge, so the shorter of the
two has the larger bottom gap — the grid is `items-start` on purpose, because two
figures being compared have to start on the same line. Slide 9's figure is placed
by `ContentSlide`'s own points-and-visual grid rather than by `Datum`, and that
grid centres too.

Slide 8 is the tightest frame in the deck: `SplitProof` compact ends 12px above
the bottom of the well. It does not overflow (`qa.mjs` reports nothing) but it is
the measurement behind that candidate's half-width entry in the table above.

**Nothing meaningful is set below the kit's type scale.** The first pass had
`PullCard`'s metadata row at 9 and 13px, which is unreadable from the back of a
room and unreadable again from a recording. Every label is now the kit's
`text-kicker` (15px, the deck's own uppercase step) and every value is 16px or
larger. Two candidates got worse at half width as a direct result, and both
losses are recorded in the table above rather than rescued by shrinking type.

## Where the gallery is

`src/decks/hubpageLabDeck.tsx`, ten slides:

| # | Slide |
|---|---|
| 1 | brand frame |
| 2 | the incumbent, verbatim from `partC2C3.tsx` |
| 3 to 6 | one candidate each, full width |
| 7 | `RepoPage` and `TagLedger` narrowed to about 460px |
| 8 | `PullCard` and `SplitProof` narrowed to about 460px |
| 9 | the survivor beside a real points column, which is the actual half-width test |
| 10 | thank you |

Slides 7 and 8 are two per slide and not four, because the first version put all
four in a 2x2 and it both overflowed the well and reached into the
instructor-video rectangle — the kind of fault a triage slide is meant to reveal
rather than commit.

Harness state at the time of writing: `tsc -b --noEmit` clean,
`node video-safe.mjs` CLEAN, `node align-check.mjs` 0 of 10 slides need
attention, `node qa.mjs` flags only slides 1 and 10, which is the documented
baseline (both carry the mark on stage instead of in the footer).

## If a candidate wins

Promote it to `slide-kit/slide-template/src/ui/` with `registryPage.ts` as its
contract, add its row to the Figures table in `slide-kit/slide-types/README.md`
with what it is **worst at**, and raise it as a PR — `sync-kit.mjs --apply`
pushes it into every session including signed-off ones. Then point session 6's
`c3-on-the-hub` at it, and only after the plan's section 6.1 patch is actually in
the TR.

The runners-up stay here on purpose. They are the record of what was considered,
and the worst-at column is the part a future reader needs when they want to
change the winner.
