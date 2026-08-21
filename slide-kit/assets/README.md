<!-- cSpell:ignore NxtWave deployement nodejs vitejs vscode -->
# The central asset library

**Every image any deck uses lives here first.** Fetch once, reuse everywhere.

Before this existed, each session kept its own `public/assets/`, and they
drifted: the kit held SVGs while its own components asked for PNGs that were
never there, session 3 had ten PNGs, session 2 had none. Four figures in the
base template rendered as broken images for anyone starting a new deck.

---

## What is here

```
tech/     technology logos — PNG, with the older SVGs kept alongside
quiz/     quiz-slide decorations (brain, bulb, bubble, mark)
brand/    logo-nxtwave.png
```

Current `tech/` set: `container-white` · `django` · `docker` · `docker-white` ·
`linux` · `macos` · `nodejs` · `npm` · `python` · `react` · `vitejs` ·
`vscode` · `windows`. PNG for all of them; `.svg` also present for the nine
that predate the PNG convention.

---

## How a deck uses it

A deck cannot read from here at runtime. Vite serves from the project's own
`public/`, and the single-file build inlines from there, so the deck needs its
own copy:

```bash
# from inside your session project
cp ../../slide-kit/assets/tech/django.png public/assets/tech/
```

Reference it as `/assets/tech/django.png`.

The library is the **source**; `public/assets/` is a working copy. They are
byte-identical, which is checkable:

```bash
md5sum slide-kit/assets/tech/django.png <session>/public/assets/tech/django.png
```

---

## Adding an asset

1. **Look here first.** If the logo is already in `tech/`, copy it. Do not
   fetch it again, and never fetch a second variant of a logo that is already
   here under a different crop or palette.
2. If it is genuinely new, fetch it **into this library**, not into a session.
   PNG, transparent background, and large enough for a 1280×720 frame.
3. Name it after the technology, lowercase, no version: `postgres.png`, not
   `PostgreSQL-16-logo.png`. A light-on-dark variant takes the `-white` suffix,
   matching `docker-white.png`.
4. Copy it into whichever session needs it.
5. If several decks will want it, that is the normal case and the reason this
   folder exists. Say so when you add it.

---

## Why the library is not synced automatically

`sync-kit.mjs` does not copy `public/assets`, and that is deliberate: a
signed-off deck's rendered output must not change because someone added a logo
to the kit. Copying is a decision you make per session, the same way kit code
updates are.

The cost is that a session can fall behind. If a figure renders as a broken
image, the fix is almost always a file that exists here and was never copied
across.
