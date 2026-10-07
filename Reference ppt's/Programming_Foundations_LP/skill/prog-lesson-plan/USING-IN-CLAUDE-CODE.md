# Using this in Claude Code

## One-time setup

```bash
# 1. Put the skill where Claude Code looks for it
mkdir -p ~/.claude/skills
cp -r prog-lesson-plan ~/.claude/skills/

# 2. Dependencies
pip install pillow fonttools
#   LibreOffice — only needed for decks whose slides are NOT flat images
#   macOS:  brew install --cask libreoffice
#   Ubuntu: sudo apt install libreoffice poppler-utils

# 3. Fonts. Fira Mono is the code face in these decks.
mkdir -p ~/.claude/skills/prog-lesson-plan/assets/fonts
curl -sL -o ~/.claude/skills/prog-lesson-plan/assets/fonts/FiraMono.ttf \
  https://cdn.jsdelivr.net/gh/mozilla/Fira@master/ttf/FiraMono-Regular.ttf

# 4. THE BRAND FONT. Get the .ttf/.otf from your design team and drop it in
#    the same folder. This is the one thing that cannot be worked around —
#    without it, new slide titles have to be lifted from existing artwork or
#    set in a near-miss face.
```

**Strongly recommended — a real browser for verification.** This is the single biggest
advantage over working in chat, where the only renderer is a 2014 WebKit that cannot evaluate
`min()`, `clamp()`, `inset`, `transform-box` or flex `gap`:

```bash
npm i -g playwright && npx playwright install chromium
```

Then Claude can screenshot presenter view and full screen and actually look at them.

## Per-session setup

```bash
mkdir sessions/12-loops && cd sessions/12-loops
git init                      # do this — see below
cp <deck>.pptx .
cp <transcript>.txt .          # if you have one
cp <previous-session-deck>.pptx prev.pptx   # for the recap
```

## What to feed it

| Give it | Why it matters |
|---|---|
| **The session deck** (.pptx) | Required. |
| **The previous session's deck** | The recap must come from the *previous* session's actual content. Without it the recap gets invented, and in one build the deck's own recap slides turned out to recap the session before last. |
| **The recording transcript** | Optional but valuable: shows what the instructor actually says, where the room got stuck, which slides got skipped. Evidence about the deck, not a script to reproduce. |
| **The brand font** | Unblocks new slide titles and section dividers. |
| **A previous finished plan** | The fastest way to convey the house style. Point at it and say "match this". |

Then:

> I've got the deck for session 12 on loops, the previous session's deck as prev.pptx, and the
> recording transcript. Build the lesson plan.

The skill should trigger on that. If it doesn't, say `use the prog-lesson-plan skill`.

## Why git, specifically

In the chat build of session 11 I introduced three regressions that a diff would have caught
instantly:

- a slide's instructor notes truncated to `[,` by a regex split
- **an entire activity panel silently deleted** by the same split, found only by a `NameError`
  at assembly time, and rewritten from memory
- the slide count reverting to a stale value, twice, when a saved template was re-spliced

Commit after each accepted change. `git diff` on the builder is the cheapest safety net available.

## The loop that works

1. **Extract and read.** Claude runs `extract_deck.py`, then reads every slide image. Make it
   post the inventory before it designs anything.
2. **Agree the cuts before it builds.** This is where your judgement is irreplaceable, and it is
   cheap to change now and expensive later. Expect 50–60% of the deck to go.
3. **Shape, build, verify, look.** `plan_shape.py` catches the structural faults before the
   build; `verify_plan.py` catches the mechanical ones after it; you catch the rest.
4. **Review by screenshot.** Open the plan, press `p` then `f`, and screenshot anything that
   looks off. Paste it back. This is the highest-bandwidth feedback there is — most of the real
   improvements in session 11 came from exactly this.

Expect three to five rounds. It was twenty-five in chat, and the difference is almost entirely
that the skill starts from the conventions instead of discovering them.

## What it still will not do for you

Being straight about this, because the gap is the part worth your attention:

- **It will not make the cut decisions.** "The previous session was conditional statements, not
  operators" and "students will just write the largest number and never trace" both came from
  the user, not the model.
- **It will not reliably notice a leaked answer** or a hook whose narration contradicts the code
  beside it. `session-design.md` tells it to look; that is not the same as it looking.
- **It cannot judge whether a beat will land with your room.** Nothing can.

The skill gets you a competent draft five and an executable checklist. The last stretch is
still a conversation.

## Files

```
prog-lesson-plan/
├── SKILL.md
├── references/
│   ├── activity-library.md    the pool — 20 numbered templates, do not invent one
│   ├── animated-explainer.md  the animation every plan carries, and its three tests
│   ├── session-design.md      the patterns that make a session work
│   ├── deck-surgery.md        fonts, palette, geometry, pixel techniques
│   ├── gotchas.md             bugs that bit more than once
│   └── evidence-base.md       the research behind the design rules
├── scripts/
│   ├── preflight.py           environment and inputs, before anything
│   ├── extract_deck.py        unpack, inventory, export slides losslessly
│   ├── revise_deck.py         keep-list, reorder, duplicate, clean, repack
│   ├── plan_shape.py          lint the beat table BEFORE the build
│   └── verify_plan.py         every check that needs the finished HTML
└── assets/
    ├── plan-template.html     the shell: full CSS + JS, six placeholders
    ├── build-template.py      the generator with all helpers
    ├── hook-svg-reference.txt a worked hook animation
    ├── execution-walker-reference.txt  a worked animated explainer
    ├── predict-machine-reference.py    a worked predict-then-run panel
    ├── panel-chrome-reference.txt      the card treatments that got past "dull"
    └── check-browser-reference.mjs     the browser harness for all three files
```
