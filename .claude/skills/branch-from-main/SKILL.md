---
name: branch-from-main
description: The branching and merging procedure for this repo. Use BEFORE the first edit of any piece of work — a deck, a session, a kit change, a lab, a rule — and whenever the user says commit, merge, push, "merge to main", "open a PR", or asks which branch to use. Also use when `git status` shows work on main itself, when a branch has drifted behind main, or when a merge or checkout is refused. Covers pulling main first, naming a branch, what may never be committed to main directly, and why a kit change needs a PR.
---
<!-- cSpell:ignore deployement nxtwave -->

# Branch from main, every time

**Several people work in this repo, and not everyone will think to pull main
first.** That is the whole reason this file exists. A branch cut from a stale
main looks fine for hours and then produces a merge nobody can review, because
half its diff is other people's work arriving late.

So: **pull main, branch from it, work there.** Three commands before the first
edit.

```bash
git switch main
git pull --ff-only origin main     # refuses rather than creating a merge you did not ask for
git switch -c <type>/<subject>
```

`--ff-only` is deliberate. If it refuses, local main has commits of its own and
that is a thing to look at, not to paper over with a merge commit.

---

## 1. Never edit on main

If `git status` says you are on `main` and files are modified, **stop and move
the work onto a branch before doing anything else.** Nothing is lost:

```bash
git switch -c fix/<subject>        # carries the uncommitted changes across
```

Committing to main directly is how a repo loses the ability to review anything.
It also breaks the one gate that matters here, in section 4.

## 2. Naming

`<type>/<subject>`, lowercase, hyphenated. The types this repo already uses:

| Type | For | Example |
|---|---|---|
| `deck/` | a new session deck | `deck/introduction-to-docker` |
| `session/` | changes to an existing session | `session/5-makefile-review` |
| `kit/` | anything under `slide-kit/slide-template` | `kit/lit-surfaces` |
| `lab/` | a figure lab under `slide-kit/*-lab` | `lab/flowchart-designs` |
| `docs/` | rules and guidelines only | `docs/four-beats-rule` |
| `fix/` | a defect with no other home | `fix/stale-slide-count` |

**One branch, one subject.** A branch called `kit/lit-surfaces` that also carries
four sessions' content is a branch nobody can review or revert cleanly. If the
work grows a second subject, cut a second branch.

## 3. Before you open a PR, catch up on main

```bash
git fetch origin
git merge origin/main              # or rebase, if the branch is not shared
```

Do this **before** asking for review, not after. A reviewer should be reading
your diff, not the difference between two stale trees.

## 4. A kit change is a PR, always. No exceptions

Anything under `slide-kit/slide-template/` reaches **every session** the next time
somebody runs `sync-kit.mjs --apply`, **including signed-off decks**. That is the
gate, and it is why `generate-slides/SKILL.md` section 6 requires a PR rather
than a merge.

The PR body names the sessions expected to sync. `KIT.md` has the file-by-file
table of what is kit and what a session owns.

**Never fast-forward a kit branch into main to skip the review.** If it is
urgent, say so in the PR and get one pair of eyes on it; the cost of a bad kit
change is every deck at once.

## 5. Merging to main

Fast-forward when you can, and check first:

```bash
git log --oneline HEAD..main       # empty means main is an ancestor: FF is safe
```

**A checkout will refuse to clobber uncommitted work, and that refusal is
correct.** If `git switch main` fails because files differ and are locally
modified, do not force it. Commit them, stash them, or ask whoever owns them.
This has already happened here: session 3 carried 34 uncommitted files, seven of
which also differed between main and the branch, so the switch was unsafe.

When main is a strict ancestor and the working tree must not be disturbed, the
pointer move does it without a checkout:

```bash
git branch -f main <branch>        # ONLY when HEAD..main is empty
```

That is a fast-forward with no file changes. It is not a substitute for the PR in
section 4.

## 6. What never goes in a commit

- `node_modules/` — ignored, and in a lab it is a **symlink** to
  `slide-kit/slide-template/node_modules`
- `dist/`, `*.zip`, `versions/`, `workflow/preview/`, `workflow/qa-shots/`
- a lab's `dist-single/` — no lab tracks one
- the generated `src/export/deckCss.ts` and `src/export/revealSteps.ts`

**A session's `dist-single/*.html` IS committed**, on purpose: it is the file an
instructor is handed. Rebuild it before committing, or the deliverable and the
source disagree.

## 7. Do not commit other people's uncommitted work

Check dates before staging broadly:

```bash
git status --porcelain | sed 's/^...//' | xargs -I{} sh -c 'printf "%s  %s\n" "$(date -r "{}" +%m-%d 2>/dev/null)" "{}"' | sort
```

Anything older than the work you just did belongs to somebody else. Leave it, and
say so in the report rather than sweeping it into your commit. If it cannot be
separated — a shared rules file where your edit and theirs sit in one diff — say
which part is not yours in the commit body.
