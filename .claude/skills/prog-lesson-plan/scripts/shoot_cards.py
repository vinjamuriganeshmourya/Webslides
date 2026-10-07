#!/usr/bin/env python3
"""
shoot_cards.py - measure every card, then hand you a cheap way to look at it.

    python3 shoot_cards.py out/14_for_loop_student_view.html out/shots
    python3 shoot_cards.py out/14_for_loop_student_view.html out/shots --step both
    python3 shoot_cards.py work/slides/preview.html work/shots
    python3 shoot_cards.py out/..._student_view.html out/shots --only 7,19
    python3 shoot_cards.py out/..._student_view.html out/shots --recheck
    python3 shoot_cards.py out/..._student_view.html out/shots --cards 7,19

Machine first, eyes second
--------------------------
The old instruction was "photograph every card and look at the pictures". At
1600x900 that is ~1,840 tokens a card, so a 27-card presenter costs ~50k tokens
per verification pass, and a build has several. Worse, most of those cards are
fine, and the two defects that matter - a card that overflows its own box, and
a card whose staged controller never ran - are things a script can state exactly
and a screenshot only hints at.

So this does the measuring itself, and prints a FLAGGED list. Then:

  - read the contact sheets once, as a sweep (~200 tokens a card);
  - read the full-size single ONLY for a flagged card, or one the sweep made you
    suspicious of (`--only 7,19`).

It does not replace looking. It replaces looking at 27 things to find 2.

The sweep is paid for once, not once a round
--------------------------------------------
A build is one sweep and then three or four rounds of fix-and-check, and the
rounds used to cost the same as the sweep: every card shot, every card packed,
to look at the two that changed. They do not have to.

  - the first pass is the sweep, as before;
  - after a fix, `--recheck` shoots only the cards the last pass flagged. The
    numbers are read from `<outdir>/flags.json`, which every pass writes, so
    there is nothing to remember and nothing to type. Singles only, no sheets:
    you already swept.
  - `--cards 7,19` is the same thing when you want to name them yourself.

Two more cards never need a picture. The spine is seven cards that are identical
in every plan in every subject, so `--shots own` (the default) measures them and
keeps no image. A spine card that measures wrong is still shot - the saving is on
the ones that are fine, which is all of them, nearly always.

What it measures per card, in the state the room will see it:

    overflow      the card painting past its own box. An overflowing card paints
                  over its own title and scrollHeight says it is fine, so every
                  visible child is measured against the card rect, not the
                  scroll box.
    dead stage    data-anim present but no .an-N class ever applied: the
                  controller did not run and the card is frozen on nothing.
    page errors   anything thrown while stepping.

Modes, auto-detected:

    presenter     the file has #p-grid-in: enters presenter mode, full screen,
                  and jumps card by card through the grid.
    elements      otherwise: screenshots every .ds-slide / .slide / .pcard as
                  an element, which is what work/slides/preview.html needs.
"""
import argparse
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent


def parse_cards(spec):
    """'7,19,22-24' -> {7,19,22,23,24}"""
    want = set()
    for part in spec.split(","):
        part = part.strip()
        if not part:
            continue
        if "-" in part:
            lo, hi = part.split("-", 1)
            want.update(range(int(lo), int(hi) + 1))
        else:
            want.add(int(part))
    return want


def flagged_cards(flags):
    """The card numbers named in a list of flag lines."""
    out = set()
    for f in flags:
        bits = f.split()
        if len(bits) > 1 and bits[1].isdigit():
            out.add(int(bits[1]))
    return sorted(out)

# The presenter re-renders a staged card to step 1 every time it becomes active,
# so anything done at load is undone by the jump. Ask the card's own controller
# for the step rather than poking classes, or the reset wins.
GO_STEP = r"""(want) => {
  const c = document.querySelector('.slide.active, .pcard.active') || document.body;
  const st = c.querySelector('.stage[data-anim]');
  if (!st) return {staged:false};
  const max = parseInt(st.dataset.anim, 10) || 1;
  const n = want === 'last' ? max : 1;
  if (typeof st.animGo === 'function') st.animGo(n);
  else { for (let k = 1; k <= max; k++) st.classList.remove('an-' + k);
         st.classList.add('an-' + n); }
  const live = [...st.classList].some(x => /^an-\d+$/.test(x));
  return {staged:true, max:max, applied:live};
}"""

# A card can report a clean scrollHeight and still paint over its own title, so
# every visible descendant is measured against the card's own rectangle.
MEASURE = r"""() => {
  const c = document.querySelector('.slide.active, .pcard.active');
  if (!c) return {missing:true};
  const box = c.getBoundingClientRect();
  let worst = null, over = 0;
  for (const el of c.querySelectorAll('*')) {
    const s = getComputedStyle(el);
    if (s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0) continue;
    // the theme's second arc on a panel is a 1052px circle clipped by the stage
    if (el.classList.contains('ndt-parc')) continue;
    let r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    // A slide drawn in the new design is a 1280 x 720 canvas inside a frame
    // that clips it; its arcs and glows run past the canvas on purpose. What
    // the frame clips is not on screen, so measure only what it lets through.
    const fr = el.closest('.ndt-frame');
    if (fr && fr !== el) {
      const q = fr.getBoundingClientRect();
      const L = Math.max(r.left, q.left), T = Math.max(r.top, q.top),
            R = Math.min(r.right, q.right), B = Math.min(r.bottom, q.bottom);
      if (R <= L || B <= T) continue;
      r = {left: L, top: T, right: R, bottom: B};
    }
    const d = Math.max(r.bottom - box.bottom, r.right - box.right,
                       box.top - r.top, box.left - r.left);
    if (d > over) {
      over = d;
      worst = el.tagName.toLowerCase() +
        (el.className && typeof el.className === 'string'
          ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
    }
  }
  // Underfill is the opposite sign of overflow and no checker had it. A card
  // whose whole job is one picture - the four spine pictures, the title card,
  // a kept deck slide - must take the stage. When the full-bleed CSS does not
  // reach it, it paints at its natural size in the middle of a black screen,
  // which is what "the fixed slides are not fullscreen" looks like from the
  // back of the room. Nothing throws, nothing overflows, and every structural
  // check passes.
  const pic = c.querySelector(':scope > .slide-img > img, :scope > .spine-pic > img,'
                            + ' :scope > .tc-wrap > .titlecard, :scope > .ndt-wrap > .ndt-frame,'
                            + ' :scope > .ndt-host > .ndt-frame');
  let fill = null;
  if (pic) {
    const r = pic.getBoundingClientRect();
    const area = box.width * box.height;
    if (area > 0) fill = (r.width * r.height) / area;
  }
  return {over: Math.round(over), worst: worst, fill: fill,
          spine: !!c.querySelector('[data-spine], .spine-title'),
          anim: !!c.querySelector('.stage[data-anim]'),
          scroll: c.scrollHeight - c.clientHeight};
}"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("page", help="presenter html, or work/slides/preview.html")
    ap.add_argument("outdir")
    ap.add_argument("--step", default="last", choices=["first", "last", "both"],
                    help="which step of a staged card to shoot (default last)")
    ap.add_argument("--only", default=None,
                    help="card numbers to keep full-size singles for, e.g. 7,19")
    ap.add_argument("--cards", default=None,
                    help="the only cards to shoot at all, e.g. 7,19 or 22-24. "
                         "The cheap re-check after a fix, not a second sweep")
    ap.add_argument("--recheck", action="store_true",
                    help="shoot only the cards the last pass flagged, read from "
                         "<outdir>/flags.json. Singles only, no sheets")
    ap.add_argument("--shots", default="own", choices=["own", "all"],
                    help="which cards to keep an image of. own (default) keeps "
                         "none for the spine, which is identical in every plan; "
                         "the spine is still measured and a flagged spine card "
                         "is still shot. all keeps every image")
    ap.add_argument("--width", type=int, default=768, help="single read width")
    ap.add_argument("--per", type=int, default=6, help="cells per contact sheet")
    ap.add_argument("--select", default=None,
                    help="CSS selector for one slide, when the page is not a "
                         "presenter file (default covers .ds-slide, .apt-slide, "
                         ".slide, .pcard)")
    ap.add_argument("--tolerance", type=int, default=2,
                    help="px a child may exceed the card box before it is flagged")
    ap.add_argument("--min-fill", type=float, default=0.92,
                    help="share of the stage a picture card must take in "
                         "presenter view (0 disables)")
    ap.add_argument("--min-anim", type=float, default=25.0,
                    help="percent of the session's own cards that must carry a "
                         "stepped stage; the spine does not count either way "
                         "(0 disables)")
    ap.add_argument("--chrome", default=os.path.expanduser(
        "~/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe"))
    a = ap.parse_args()

    try:
        from playwright.sync_api import sync_playwright
    except ImportError as e:
        raise SystemExit("shoot_cards needs playwright: %s" % e)

    page = Path(a.page).resolve()
    if not page.exists():
        raise SystemExit("no such page: %s" % page)

    flagfile = Path(a.outdir).resolve() / "flags.json"
    # What the last pass found, so a partial pass can hand back the whole
    # picture rather than only the corner of it it just looked at.
    try:
        prev = json.loads(flagfile.read_text(encoding="utf8"))
    except Exception:
        prev = {}
    want = parse_cards(a.cards) if a.cards else None
    if a.recheck:
        if want is not None:
            raise SystemExit("--recheck and --cards say the same thing. "
                             "Use one.")
        if not flagfile.exists():
            raise SystemExit(
                "no %s, so there is nothing to re-check. Run a full pass "
                "first; every pass writes it." % flagfile)
        want = set(prev.get("cards") or [])
        if not want:
            print("the last pass flagged nothing, so there is nothing to "
                  "re-check.")
            return 0
        print("re-checking %d card(s) the last pass flagged: %s"
              % (len(want), ",".join(str(x) for x in sorted(want))))
    partial = want is not None

    raw = Path(a.outdir).resolve() / "_full"
    if raw.exists():
        shutil.rmtree(raw)
    raw.mkdir(parents=True, exist_ok=True)

    url = "file:///" + str(page).replace("\\", "/")
    exe = a.chrome if os.path.exists(a.chrome) else None
    errs, flags, n = [], [], 0
    skipped_spine = 0
    own, animated = 0, 0        # cards this session wrote, and how many step

    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path=exe)
        pg = b.new_page(viewport={"width": 1600, "height": 900})
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(url)
        pg.wait_for_timeout(700)

        presenter = pg.evaluate("()=>!!document.querySelector('#p-grid-in')")
        steps = ["first", "last"] if a.step == "both" else [a.step]

        if presenter:
            total = pg.evaluate(
                "()=>document.querySelectorAll('.slide, .pcard').length")
            pg.keyboard.press("p")
            pg.wait_for_timeout(300)
            pg.keyboard.press("f")
            pg.wait_for_timeout(400)
            order = [i for i in range(1, total + 1)
                     if want is None or i in want]
            if partial:
                missed = sorted(x for x in want if x > total)
                if missed:
                    print("! cards %s are past the end of this file (%d cards)"
                          % (",".join(str(x) for x in missed), total))
            for i in order:
                for st in steps:
                    before_flags = len(flags)
                    pg.keyboard.press("a")
                    pg.wait_for_timeout(180)
                    pg.click("#p-grid-in .p-cell:nth-child(%d)" % i)
                    pg.wait_for_timeout(360)
                    stage = pg.evaluate(GO_STEP, st)
                    pg.wait_for_timeout(520)
                    if stage.get("staged") and not stage.get("applied"):
                        flags.append("card %d: staged card, no .an-N applied "
                                     "(controller never ran)" % i)
                    m = pg.evaluate(MEASURE)
                    if m.get("missing"):
                        flags.append("card %d: nothing active after jumping to it" % i)
                        continue
                    if m["over"] > a.tolerance:
                        flags.append("card %d (%s step): %s paints %dpx outside "
                                     "the card box" % (i, st, m["worst"], m["over"]))
                    if (a.min_fill and m.get("fill") is not None
                            and m["fill"] < a.min_fill and st == steps[0]):
                        flags.append(
                            "card %d: its picture takes %d%% of the stage, not "
                            "%d%%. The full-bleed rule is not reaching it - "
                            "check the build imports SPINE_CSS from the skill "
                            "rather than copying plan-template.html"
                            % (i, round(m["fill"] * 100), round(a.min_fill * 100)))
                    if st == steps[0] and not m.get("spine"):
                        own += 1
                        if m.get("anim"):
                            animated += 1
                    # The spine is the same seven cards in every plan, so an
                    # image of one that measures clean is a picture of a thing
                    # already known to be right. Measure it; do not pay to look.
                    if a.shots == "all" or not m.get("spine") \
                            or len(flags) > before_flags:
                        tag = "" if len(steps) == 1 else "-" + st
                        (raw / ("%03d%s.png" % (i, tag))).write_bytes(
                            pg.screenshot(type="png"))
                        n += 1
                    else:
                        skipped_spine += 1
        else:
            sel = a.select or ".ds-slide, .apt-slide, .slide, .pcard"
            els = pg.query_selector_all(sel)
            if not els:
                b.close()
                raise SystemExit(
                    "no elements matched %r in %s. Pass --select with the class "
                    "this renderer uses; the defaults cover .ds-slide (DSA), "
                    ".apt-slide (aptitude) and .slide/.pcard (a presenter file)."
                    % (sel, page.name))
            for i, el in enumerate(els, 1):
                if want is not None and i not in want:
                    continue
                el.scroll_into_view_if_needed()
                pg.wait_for_timeout(120)
                (raw / ("%03d.png" % i)).write_bytes(el.screenshot(type="png"))
                n += 1
        b.close()

    # The shots are named by card number, not by position, so a partial pass
    # has to be packed by name or card 19 comes back labelled card 2.
    cmd = [sys.executable, str(HERE / "read_pack.py"), str(raw), str(a.outdir),
           "--per", "0" if partial else str(a.per), "--width", str(a.width),
           "--numbers", "name"]
    if a.only:
        cmd += ["--only", a.only]
    elif flags:
        # Only the flagged cards get a full-size single by default; the rest are
        # on the sheets, which is what you were going to look at anyway.
        nums = sorted({int(f.split()[1]) for f in flags if f.split()[1].isdigit()})
        if nums:
            cmd += ["--only", ",".join(str(x) for x in nums)]
    print("%d shots at 1600x900 -> %s%s" % (
        n, raw, " (%d clean spine cards measured, not shot)" % skipped_spine
        if skipped_spine else ""))
    if not n:
        raise SystemExit("nothing was shot, so there is nothing to pack. "
                         "Check the page opened and the selector matched.")
    subprocess.run(cmd, check=True)

    # A partial pass writes back the whole picture: what it just found, plus
    # what the last pass found on the cards it did not re-shoot.
    still = flagged_cards(flags)
    if partial:
        carried = [c for c in (prev.get("cards") or []) if c not in want]
        flags_out = [f for f in (prev.get("flags") or [])
                     if not (f.split()[1:2] and f.split()[1].isdigit()
                             and int(f.split()[1]) in want)] + flags
        still = sorted(set(still) | set(carried))
    else:
        flags_out = list(flags)
    flagfile.parent.mkdir(parents=True, exist_ok=True)
    flagfile.write_text(json.dumps(
        {"page": str(page), "cards": still, "flags": flags_out}, indent=1),
        encoding="utf8")

    print()
    if partial:
        print("ANIMATION  not measured on a partial pass - the share only means "
              "anything over the whole file.")
    if own and not partial:
        share = 100.0 * animated / own
        print("ANIMATION  %d of %d own cards step (%.0f%%). The spine is not "
              "counted." % (animated, own, share))
        if a.min_anim and share < a.min_anim:
            flags.append(
                "the session steps %.0f%% of its own cards, under the %.0f%% "
                "floor. A card that introduces an idea and never moves is a "
                "picture of a lecture. Reach for a panel from the shared "
                "library before writing one." % (share, a.min_anim))
    if errs:
        print("PAGE ERRORS (%d):" % len(errs))
        for e in errs[:6]:
            print("  !", e)
    if flags:
        print("FLAGGED (%d) - read the single for each of these:" % len(flags))
        for f in flags:
            print("  !", f)
    elif partial:
        print("FLAGGED (0) on the cards re-checked. %s"
              % ("%d still open elsewhere: %s - re-check those too."
                 % (len(still), ",".join(str(x) for x in still)) if still
                 else "Nothing is open anywhere; run a full pass before you ship."))
    else:
        print("FLAGGED (0) - nothing measured wrong. Sweep the sheets, then move on.")
    if errs or flags:
        sys.exit(1)


if __name__ == "__main__":
    main()
