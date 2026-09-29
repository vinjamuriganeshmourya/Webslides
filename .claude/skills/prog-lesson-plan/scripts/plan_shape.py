#!/usr/bin/env python3
"""
plan_shape.py — lint the SHAPE of a session before you build it.

    python3 scripts/plan_shape.py work/beats.json

Every structural defect that has ever got a plan rejected — too many blocks, one block
per slide, a four-page worksheet, the same beat five times, no cut deep enough — is
decidable from a beat table. Waiting for verify_plan.py means finding out after the
builder is written, when the fix is a rewrite and the temptation is to argue with the
linter instead. This runs in the seconds before any of that exists.

Write work/beats.json at Stop 2, get it approved, run this, then build.

Format — one object per beat, in session order:

  {
    "session": "12 — Loops",
    "deck_slides_total": 57,
    "beats": [
      {"name":"Welcome",               "mins":1, "kind":"concept",  "slides":[1],
       "spine":"welcome"},
      {"name":"Recap",                 "mins":1, "kind":"concept",  "slides":[],
       "spine":"recap-title"},
      {"name":"Recap of if and else",  "mins":4, "kind":"quiz",     "slides":[],
       "activity":1, "spine":"recap"},
      {"name":"Hook · the turnstile",   "mins":4, "kind":"hook",     "slides":[],
       "animated":"hook", "spine":"hook"},
      {"name":"Today",                 "mins":1, "kind":"concept",  "slides":[],
       "spine":"title"},
      {"name":"Agenda",                "mins":2, "kind":"concept",  "slides":[3],
       "spine":"agenda"},
      {"name":"While · the shape",      "mins":4, "kind":"concept",  "slides":[9,10,11]},
      {"name":"Paper · mark the parts", "mins":5, "kind":"activity", "slides":[],
       "activity":18, "worksheet_task":1},
      {"name":"Follow the dot",         "mins":3, "kind":"hook",     "slides":[],
       "animated":"explainer"},
      {"name":"Exit poll",              "mins":3, "kind":"exit",     "slides":[],
       "activity":1}
    ]
  }

  mins            int, all beats must total 75
  kind            concept | quiz | hook | activity | hands | exit | buffer
  slides          original deck slide numbers this beat carries, ascending, [] for a panel
  activity        template number from references/activity-library.md — required on
                  every quiz/activity/hands/exit beat. Do not invent templates.
  animated        "hook" or "explainer" — exactly one of each per session
  spine           the spine card this beat is, when it is one: welcome | recap-title |
                  recap | hook | title | agenda | quiz | feedback | thankyou.
                  The order of those is fixed; see references/standard-slides.md
  worksheet_task  the worksheet task this beat uses, numbered from 1.
                  (`worksheet_page` is still read, as the old name for it.)
                  The worksheet is a downloadable HTML document: no page count.

Exit code 1 on any FAIL.
"""
import json, statistics, sys, pathlib

# The spine (welcome, the two recap cards, the hook, the title card, the agenda,
# the classroom quiz in the middle, feedback, thank you) is the same in every
# subject, so the check for it lives with the cards themselves.
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent / "assets"))
from standard_slides import spine_check, SPINE_KEYS

# The spine's fixed cards (welcome, the Recap word card, the title card,
# feedback, thank you) are the same in every plan and are not designed here, so
# they are counted apart from the blocks and panels a session actually chose.
# The recap activity, the hook, the agenda and the quiz ARE design decisions and
# still count.
SPINE_FIXED = {"welcome", "recap-title", "title", "feedback", "thankyou"}


def designed(beats):
    return [b for b in beats if b.get("spine") not in SPINE_FIXED]


from collections import Counter

results = []
def check(ok, label, detail="", warn=False):
    results.append(("WARN" if warn else ("PASS" if ok else "FAIL"), label, detail))

KINDS = {"concept", "quiz", "hook", "activity", "hands", "exit", "buffer"}


def main():
    if len(sys.argv) < 2 or {"-h", "--help"} & set(sys.argv):
        raise SystemExit(__doc__)
    d = json.load(open(sys.argv[1], encoding="utf8"))
    beats = d.get("beats") or []
    if not beats:
        raise SystemExit("no beats in that file")

    names = [b.get("name", "?") for b in beats]
    mins = [int(b.get("mins", 0)) for b in beats]
    kinds = [b.get("kind", "") for b in beats]

    # ---- schema ---------------------------------------------------------
    bad_kind = sorted({k for k in kinds if k not in KINDS})
    check(not bad_kind, "every beat has a known kind", f"unknown: {bad_kind}")
    check(all(m > 0 for m in mins), "every beat has a duration",
          f"missing on: {[n for n, m in zip(names, mins) if m <= 0]}")

    # ---- time -----------------------------------------------------------
    check(sum(mins) == 75, "durations total exactly 75", f"total {sum(mins)}")

    # ---- is this a session, or a list of slides? ------------------------
    # Session 11 — the plan that works — has 21. Past 22 it is a list of slides.
    n = len(designed(beats))
    check(12 <= n <= 22, "block count is sane",
          f"{n} blocks; aim for 14-20 — group consecutive slides that teach the same thing")
    if 12 <= n <= 22:
        check(14 <= n <= 20, "block count is in the 14-20 band",
              f"{n} blocks", warn=not (14 <= n <= 20))

    med = statistics.median(mins)
    check(med >= 3, "median block is 3 min or more",
          f"median is {med} — a 2-min median means one block per slide")

    # A single-slide beat is fine on its own — the title and the takeaways are one slide each.
    # The defect is a RUN of them: consecutive concept beats each carrying one slide is
    # "one block per slide" wearing a disguise, and it is what made the loops sidebar a list.
    runs, cur = [], []
    for n, b in zip(names, beats):
        if b.get("kind") == "concept" and len(b.get("slides") or []) == 1:
            cur.append(n)
        else:
            if len(cur) > 1:
                runs.append(cur)
            cur = []
    if len(cur) > 1:
        runs.append(cur)
    check(not runs, "no two consecutive single-slide concept blocks",
          f"{len(runs)} run(s), longest {max((len(r) for r in runs), default=0)}: "
          f"{max(runs, key=len) if runs else ''} — these teach one thing; make them one block")

    # Ten 1-minute blocks pass a median test if enough long ones sit beside them,
    # and still read as a list. Two consecutive shorts is the ceiling.
    run = best = 0
    where = ""
    for n, m in zip(names, mins):
        run = run + 1 if m < 2 else 0
        if run > best:
            best, where = run, n
    check(best <= 2, "no more than two sub-2-minute blocks in a row",
          f"a run of {best} ending at {where!r} — merge them")
    tiny = sum(1 for m in mins if m < 2)
    check(tiny <= 6, "at most six blocks under 2 minutes", f"{tiny} of them")

    # ---- the cut --------------------------------------------------------
    kept = sorted({s for b in beats for s in (b.get("slides") or [])})
    check(14 <= len(kept) <= 18, "deck cut to 14-18 slides",
          f"{len(kept)} kept" + (f" of {d['deck_slides_total']}"
                                 if d.get("deck_slides_total") else ""))

    panels = sum(1 for b in designed(beats) if not (b.get("slides") or []))
    check(8 <= panels <= 12, "panel budget is 8 to 12",
          f"{panels} panels — {len(kept)} slides + {panels} panels = "
          f"{len(kept)+panels} cards")
    check(len(kept) + panels <= 32, "cards total 32 or fewer",
          f"{len(kept)+panels} cards; past about 32 the session cannot breathe")

    # ---- slide order ----------------------------------------------------
    unsorted_beats = [n for n, b in zip(names, beats)
                      if (b.get("slides") or []) != sorted(b.get("slides") or [])]
    check(not unsorted_beats, "slide lists ascend within a beat", f"{unsorted_beats}")
    check(kept == sorted(kept) and [s for b in beats for s in (b.get("slides") or [])] == kept,
          "surviving slides appear in deck order across the session",
          "a beat is carrying a slide out of sequence")

    # ---- activities come from the pool ----------------------------------
    needs = {"quiz", "activity", "hands", "exit"}
    unnamed = [n for n, b in zip(names, beats)
               if b.get("kind") in needs and not b.get("activity")]
    check(not unnamed, "every activity beat names a template number",
          f"unnamed: {unnamed} — pick from references/activity-library.md, do not invent one")

    used = Counter(b["activity"] for b in beats if b.get("activity"))
    over = {t: c for t, c in used.items() if c > 2}
    check(not over, "no activity template used more than twice",
          f"{over} — the same beat three times over is one beat with steps")

    # ---- the animations -------------------------------------------------
    anim = Counter(b.get("animated") for b in beats if b.get("animated"))
    check(anim.get("hook") == 1, "exactly one hook animation",
          f"{anim.get('hook', 0)} — one CSS transform on one SVG group, see "
          "assets/hook-svg-reference.txt")
    check(anim.get("explainer") == 1, "exactly one animated explainer",
          f"{anim.get('explainer', 0)} — the session's idea shown happening. "
          "See references/animated-explainer.md; it must pass all three tests there")

    for b in beats:
        if b.get("animated") == "explainer":
            m = int(b.get("mins", 0))
            check(2 <= m <= 4, "the explainer runs 2 to 4 minutes",
                  f"{m} min — it is a reveal, not a lesson", warn=not (2 <= m <= 4))
            i = beats.index(b)
            earlier = {k for k in kinds[:i]}
            check(bool(earlier & {"activity", "hands", "quiz"}),
                  "the explainer follows a beat where the room committed",
                  "shown before they have a stake in the answer, it is a cartoon")
            break

    # ---- the fixed spine ------------------------------------------------
    # references/standard-slides.md. Mark the spine beats in beats.json with
    # "spine": one of welcome, recap-title, recap, hook, title, agenda, quiz,
    # feedback, thankyou.
    if not any(b.get("spine") for b in beats):
        check(False, "the beat table marks its spine cards",
              'every plan carries them: {"spine": "welcome"} and the rest. '
              "See references/standard-slides.md")
    else:
        for ok, label, detail, warn in spine_check(beats):
            check(ok, label, detail, warn=warn)

    # The plan closes on the spine cards, so the exit MCQ is not last any more:
    # it runs before the takeaway map, and feedback and thank you follow it.
    fb = [i for i, b in enumerate(beats) if b.get("spine") == "feedback"]
    ex = [i for i, b in enumerate(beats) if b.get("kind") == "exit"]
    if fb and ex:
        check(ex[0] < fb[0], "the exit runs before the closing cards",
              "exit, then the takeaway map, then feedback, then thank you")
    exits = [b for b in beats if b.get("kind") == "exit"]
    check(len(exits) == 1, "exactly one exit beat", f"{len(exits)}")
    if exits:
        check(exits[0].get("activity") == 1, "the exit is a poll (template 1)",
              "default is three MCQs with Reveal answer — everyone can answer, a wrong "
              "answer stays anonymous, and the spread tells you what to open next session with",
              warn=exits[0].get("activity") != 1)
        check(not (exits[0].get("worksheet_task") or exits[0].get("worksheet_page")),
              "no exit task on the worksheet",
              "the exit must run even when the worksheet is abandoned")

    # ---- worksheet ------------------------------------------------------
    def wnum(b):
        return b.get("worksheet_task") or b.get("worksheet_page")
    tasks = sorted({wnum(b) for b in beats if wnum(b)})
    check(tasks == list(range(1, len(tasks) + 1)),
          "worksheet tasks are numbered from 1 with no gaps", f"{tasks}")
    check(bool(tasks), "the session has a worksheet",
          "students download one HTML file and type into it; a session with no task on it "
          "is a session they watched")

    # ---- how much of the time is theirs ---------------------------------
    theirs = sum(m for m, k in zip(mins, kinds) if k in {"activity", "hands", "quiz", "exit"})
    check(theirs >= 30, "the room is doing something for at least 30 of the 75 minutes",
          f"{theirs} min — aim for roughly half", warn=theirs < 30)

    # ---- report ---------------------------------------------------------
    w = max(len(l) for _, l, _ in results)
    fails = warns = 0
    print()
    for status, label, detail in results:
        mark = {"PASS": "  ok  ", "FAIL": " FAIL ", "WARN": " warn "}[status]
        print(f"[{mark}] {label.ljust(w)}  {detail if status != 'PASS' else ''}".rstrip())
        fails += status == "FAIL"
        warns += status == "WARN"
    print(f"\n{len(results)-fails-warns} passed, {warns} warnings, {fails} failed")
    if fails:
        print("\nFix the shape before you write a line of the builder. It is free now.")
    else:
        print("\nShape is sound. Build it, then run verify_plan.py on the output.")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
