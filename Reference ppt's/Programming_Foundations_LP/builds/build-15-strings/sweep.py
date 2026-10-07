#!/usr/bin/env python3
"""Measure every card at EVERY step, in real Chromium, in full screen.

peek.py measures each card on step one. That is where the previous two builds
looked fine and still overflowed: a staged card's tallest state is usually its
last one, and a revealed answer adds about a hundred pixels to a card that fit
perfectly closed.

    python sweep.py           # measure every card, every step
    python sweep.py shots     # also write out/sweep/*.png
"""
import os
import pathlib
import sys

from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).parent
PLAN = HERE / "out" / "15_string_methods_student_view.html"
CHROME = os.path.expanduser(
    "~/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe")

MEASURE_ACTIVE = """() => {
  const c = document.querySelector('.wrap .slide.active, .wrap .pcard.active');
  if (!c) return ['(none)', 0];
  const step = c.querySelector('.stage-step.on') || c.querySelector('.stage') || c;
  const kids = [...step.children].filter(k => getComputedStyle(k).display !== 'none');
  if (!kids.length) return [c.dataset.label || '', 0];
  const top = Math.min(...kids.map(k => k.getBoundingClientRect().top));
  const bot = Math.max(...kids.map(k => k.getBoundingClientRect().bottom));
  return [c.dataset.label || (c.querySelector('.slide-title') || {}).textContent || '',
          Math.round(bot - top - step.getBoundingClientRect().height)];
}"""

# card number (1 based) -> list of (name, script) states worth measuring beyond
# the default one. The scripts run with that card already active.
EXTRA = {
    3: [("chip %d" % k, "() => {const b=document.querySelector('.rcp [data-rcp-next]');"
         "for(let i=0;i<%d;i++) b.click();}" % k) for k in (5,)],
    11: [("machine level 1 run",
          "() => {document.querySelectorAll('.mopt')[0].click();"
          "document.getElementById('m-run').click();}"),
         ("machine level 5",
          "() => {for(let L=0;L<4;L++){document.querySelectorAll('.mopt')[0].click();"
          "document.getElementById('m-run').click();"
          "document.getElementById('m-next').disabled=false;"
          "document.getElementById('m-next').click();}"
          "document.querySelectorAll('.mopt')[1].click();"
          "document.getElementById('m-run').click();}")],
    20: [("walker default done",
          "() => {document.getElementById('s-reset').click();"
          "for(let i=0;i<20;i++) document.getElementById('s-step').click();}"),
         ("walker dash set done",
          "() => {document.querySelectorAll('#sw [data-w]')[1].click();"
          "for(let i=0;i<20;i++) document.getElementById('s-step').click();}"),
         ("walker no argument",
          "() => {document.querySelectorAll('#sw [data-w]')[0].click();"
          "for(let i=0;i<20;i++) document.getElementById('s-step').click();}")],
    28: [("exit revealed",
          "() => document.querySelector('[data-reveal]').click()")],
}


def main():
    errs, bad = [], []
    shots = "shots" in sys.argv
    outdir = HERE / "out" / "sweep"
    if shots:
        outdir.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as pw:
        b = pw.chromium.launch(
            executable_path=CHROME if os.path.exists(CHROME) else None)
        pg = b.new_page(viewport={"width": 1600, "height": 900})
        pg.on("pageerror", lambda e: errs.append("pageerror: " + str(e)))
        pg.on("console", lambda m: errs.append("console." + m.type + ": " + m.text)
              if m.type == "error" else None)
        pg.goto("file:///" + str(PLAN).replace("\\", "/"))
        pg.wait_for_timeout(700)
        pg.keyboard.press("p")
        pg.wait_for_timeout(300)
        pg.keyboard.press("f")
        pg.wait_for_timeout(500)

        total = pg.evaluate("()=>document.querySelectorAll('.wrap .slide, .wrap .pcard').length")
        for i in range(1, total + 1):
            pg.keyboard.press("a")
            pg.wait_for_timeout(120)
            pg.click(f"#p-grid-in .p-cell:nth-child({i})")
            pg.wait_for_timeout(420)
            steps = pg.evaluate(
                "()=>{const c=document.querySelector('.wrap .slide.active,"
                ".wrap .pcard.active');const s=c&&c.querySelector('.stage[data-anim]');"
                "return s?(parseInt(s.dataset.anim,10)||1):1;}")
            for k in range(1, steps + 1):
                if k > 1:
                    pg.evaluate("(k)=>{const c=document.querySelector("
                                "'.wrap .slide.active,.wrap .pcard.active');"
                                "const s=c.querySelector('.stage[data-anim]');"
                                "if(s&&s.animGo) s.animGo(k);}", k)
                    pg.wait_for_timeout(320)
                lbl, px = pg.evaluate(MEASURE_ACTIVE)
                if px > 0:
                    bad.append((i, f"step {k}", lbl, px))
                if shots and (k == steps or k == 1):
                    pg.screenshot(path=str(outdir / f"{i:02d}-s{k}.png"))
            for name, js in EXTRA.get(i, []):
                pg.evaluate(js)
                pg.wait_for_timeout(1400)
                lbl, px = pg.evaluate(MEASURE_ACTIVE)
                if px > 0:
                    bad.append((i, name, lbl, px))
                if shots:
                    safe = name.replace(" ", "-")
                    pg.screenshot(path=str(outdir / f"{i:02d}-{safe}.png"))
                # leave the card as we found it
                pg.keyboard.press("a")
                pg.wait_for_timeout(100)
                pg.click(f"#p-grid-in .p-cell:nth-child({i})")
                pg.wait_for_timeout(350)

        print(f"cards measured: {total}")
        print("overflow:", "none" if not bad else "")
        for row in bad:
            print("  ", row)
        b.close()

    print("page errors:", errs or "none")
    return 1 if (bad or errs) else 0


if __name__ == "__main__":
    sys.exit(main())
