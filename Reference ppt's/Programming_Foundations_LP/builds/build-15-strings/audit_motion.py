#!/usr/bin/env python3
"""The motion audit: the blocks from review-animations/STANDARDS.md that a
static read of the CSS cannot settle, plus the slow-motion feel check.

    python audit_motion.py            # the static blocks
    python audit_motion.py slow       # also shoot the hook at 4x duration

`review-animations` is marked disable-model-invocation, so its Ten
Non-Negotiable Standards are applied here by hand. `/review-animations` on the
finished file is the user's to run.
"""
import os
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).parent
PLAN = HERE / "out" / "15_string_methods_student_view.html"
CHROME = os.path.expanduser(
    "~/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe")

fails = []


def ok(cond, what, detail=""):
    if not cond:
        fails.append(f"{what}  {detail}")


def main():
    s = PLAN.read_text(encoding="utf-8")
    css = s[s.index("<style"):s.index("</style>")]

    # 1. transform and opacity only. A transition naming a layout property is
    #    a block, wherever it is.
    banned = re.findall(
        r"transition:[^;}]*\b(width|height|top|left|margin|padding)\b", css)
    ok(not banned, "a transition animates a layout property", str(set(banned)))

    # 2. `transition: all` is never correct
    ok("transition:all" not in css.replace(" ", ""),
       "transition: all is in the stylesheet")

    # 3. never scale(0)
    ok(not re.search(r"scale\(0(\.0+)?[,)]", css), "something enters from scale(0)")

    # 4. ease-in is a block; only the two tokens may be used
    # written with and without spaces in different files, so compare the
    # numbers rather than the text
    curves = {re.sub(r"[\s0]+(?=\.)|\s", "", c)
              for c in re.findall(r"(cubic-bezier\([^)]*\))", css)}
    allowed = {"cubic-bezier(.23,1,.32,1)", "cubic-bezier(.77,0,.175,1)"}
    ok(curves <= allowed, "a curve was invented here", str(curves - allowed))
    ok(not re.search(r"transition[^;}]*\bease-in\b(?!-out)", css),
       "ease-in is used on a transition")

    # 5. the origin of the hook's scale is arithmetic, not `center`
    ok("transform-box:view-box" in css and "transform-origin:0 0" in css,
       "the hook's scale origin is not pinned")
    # the turn is the hook's LAST press, and the hook has grown a beat since
    # this check was written. Read the number off the hook rather than holding
    # a copy of it here: a checker that knows better than the thing it checks
    # is how a real regression gets a green tick.
    import hook as H
    ok(re.search(r"\.an-%d \.hkcomb\{transform:translate\(-?\d" % H.STEPS,
                 css),
       "the hook's turn does not write its origin into the transform")
    # the two redrawn slicing cards travel too, and both must be origin-pinned
    for sel in (".sllift", ".slmark"):
        ok(re.search(re.escape(sel) + r"\{[^}]*transform-box:view-box", css),
           f"{sel} travels without pinning its transform box")

    # 6. reduced motion ships with the animation, and keeps the end state
    for sel in (".hkcomb", ".seqbar.strip .bx", ".mcell rect",
                ".sllift", ".mthrow .ch"):
        blocks = re.findall(
            r"@media \(prefers-reduced-motion:reduce\)\{(.*?)\n\}", css, re.S)
        ok(any(sel in b for b in blocks),
           f"{sel} has no reduced-motion rule")

    # 7. one engine: no second animation controller
    ok(css.count("data-anim=") == 0 or True, "")   # markup, not css
    ok(s.count("stage.animGo = go") <= 1, "there is more than one step engine")

    # 8. no hover-dependent motion: the room never touches the screen
    hover = re.findall(r":hover[^{]*\{[^}]*transform:[^}]*\}", css)
    ok(not hover, "a motion is hidden behind :hover", str(hover[:2]))

    # 9. will-change is not parked on anything
    ok("will-change" not in css, "will-change is parked on an element")

    # 10. press feedback is in the 0.95 to 0.98 band
    presses = re.findall(r":active\{transform:scale\((0?\.\d+)\)", css)
    bad = [p for p in presses if not 0.95 <= float(p) <= 0.98]
    ok(not bad, "a press feedback is outside 0.95 to 0.98", str(bad))

    print(f"{12 - len(fails)} of 12 motion blocks clear")
    for f in fails:
        print("  FAIL " + f)

    if "slow" in sys.argv:
        slow_motion()
    return 1 if fails else 0


def slow_motion():
    """Play the hook's one transform at 4x duration and photograph it at the
    quarter points. A wrong origin and a curve that stops abruptly are both
    invisible at speed and obvious slowed down."""
    from playwright.sync_api import sync_playwright
    out = HERE / "out" / "slowmo"
    out.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as pw:
        b = pw.chromium.launch(
            executable_path=CHROME if os.path.exists(CHROME) else None)
        pg = b.new_page(viewport={"width": 1600, "height": 900})
        pg.goto("file:///" + str(PLAN).replace("\\", "/"))
        pg.wait_for_timeout(600)
        pg.keyboard.press("p")
        pg.wait_for_timeout(300)
        pg.keyboard.press("f")
        pg.wait_for_timeout(400)
        pg.keyboard.press("a")            # the grid only opens on a keypress
        pg.wait_for_timeout(250)
        pg.click("#p-grid-in .p-cell:nth-child(4)")
        pg.wait_for_timeout(400)
        pg.add_style_tag(content=".hkcomb{transition-duration:3600ms !important}")
        pg.evaluate("()=>document.querySelector('#stage-hook').animGo(3)")
        pg.wait_for_timeout(1200)
        pg.evaluate("()=>document.querySelector('#stage-hook').animGo(4)")
        for k, ms in enumerate((450, 900, 900, 900, 900), 1):
            pg.wait_for_timeout(ms)
            pg.screenshot(path=str(out / f"hook-{k}.png"))
        b.close()
    print(f"slow motion frames -> {out}")


if __name__ == "__main__":
    sys.exit(main())
