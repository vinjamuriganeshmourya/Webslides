#!/usr/bin/env python3
"""Open the presenter in real Chromium and report anything that would only show
up on the wall: page errors, cards that overflow their own box, staged cards
whose controller never ran, and the three panels that are driven by JavaScript.

    python peek.py                 # errors + overflow, every card, closed and revealed
    python peek.py shots           # also write out/peek/<n>.png for eyeballing
"""
import os
import pathlib
import sys

from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).parent
PLAN = HERE / "out" / "15_string_methods_student_view.html"
CHROME = os.path.expanduser(
    "~/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe")

# An overflowing card paints over its own title and scrollHeight says it is fine,
# so the inner boxes are measured instead of the card.
MEASURE = """(reveal) => {
  const out = [];
  const cards = [...document.querySelectorAll('.wrap .slide, .wrap .pcard')];
  cards.forEach(c => c.classList.remove('active'));
  for (const c of cards) {
    cards.forEach(x => x.classList.remove('active'));
    c.classList.add('active');
    if (reveal) c.querySelectorAll('.ans').forEach(a => a.classList.add('shown'));
    const step = c.querySelector('.stage-step.on') || c.querySelector('.stage') || c;
    const kids = [...step.children].filter(k => getComputedStyle(k).display !== 'none');
    if (!kids.length) { out.push([c.dataset.label || '', 0]); continue; }
    const top = Math.min(...kids.map(k => k.getBoundingClientRect().top));
    const bot = Math.max(...kids.map(k => k.getBoundingClientRect().bottom));
    out.push([c.dataset.label || (c.querySelector('.slide-title') || {}).textContent || '',
              Math.round(bot - top - step.getBoundingClientRect().height)]);
  }
  cards.forEach(x => x.classList.remove('active'));
  return out;
}"""


def main():
    errs = []
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path=CHROME if os.path.exists(CHROME) else None)
        pg = b.new_page(viewport={"width": 1600, "height": 900})
        pg.on("pageerror", lambda e: errs.append("pageerror: " + str(e)))
        pg.on("console", lambda m: errs.append("console." + m.type + ": " + m.text)
              if m.type == "error" else None)
        pg.goto("file:///" + str(PLAN).replace("\\", "/"))
        pg.wait_for_timeout(700)

        n = pg.evaluate("()=>document.querySelectorAll('.slide, .pcard').length")
        print(f"cards: {n}")

        # the JS panels must have rendered something
        for sel, what in ((".rcp-chip", "recap chips"),
                          (".hkcell", "hook character boxes"),
                          (".hkcomb .hkarc", "hook jump arcs"),
                          ("#stage-pull .slcell", "pull-out boxes"),
                          ("#stage-pull .sllift", "pull-out travellers"),
                          ("#stage-jump .slcell", "jump boxes"),
                          ("#stage-jump .sllift", "jump travellers"),
                          ("#m-rail .mcell", "machine cells"),
                          ("#stage-isdigit .mthrow .ch", "isdigit characters"),
                          ("#stage-strip .mthrow .ch", "strip characters"),
                          ("#s-seq .bx", "explainer boxes"),
                          (".tw .seqbar .bx", "task 3 boxes"),
                          (".tkmap > g", "map nodes")):
            c = pg.eval_on_selector_all(sel, "els=>els.length")
            print(f"  {what:30s} {c}")

        print("\noverflow, closed  (anything above 0 paints over the card):")
        pg.keyboard.press("p")
        pg.wait_for_timeout(300)
        pg.keyboard.press("f")
        pg.wait_for_timeout(400)
        for who, rev in (("closed", False), ("revealed", True)):
            bad = [(lbl, px) for lbl, px in pg.evaluate(MEASURE, rev) if px > 0]
            print(f"  {who:9s} {'OK' if not bad else bad}")

        if "shots" in sys.argv:
            outdir = HERE / "out" / "peek"
            outdir.mkdir(parents=True, exist_ok=True)
            # the overflow pass above forced every answer open. Shooting without
            # undoing it produces a set of pictures in which the room can read
            # every answer before it was asked.
            pg.evaluate("()=>document.querySelectorAll('.ans.shown')"
                        ".forEach(a=>a.classList.remove('shown'))")
            total = pg.evaluate("()=>document.querySelectorAll('.slide, .pcard').length")
            for i in range(1, total + 1):
                pg.keyboard.press("a")
                pg.wait_for_timeout(150)
                pg.click(f"#p-grid-in .p-cell:nth-child({i})")
                pg.wait_for_timeout(420)
                pg.screenshot(path=str(outdir / f"{i:02d}.png"))
            print(f"\nwrote {total} shots to {outdir}")

        b.close()

    print("\npage errors:", errs or "none")
    return 1 if errs else 0


if __name__ == "__main__":
    sys.exit(main())
