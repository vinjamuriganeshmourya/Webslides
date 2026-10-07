#!/usr/bin/env python3
"""Shoot the stepped states the card list never reaches.

peek.py photographs every card at step one. The states that matter most are
somewhere in the middle: the hook mid travel, the string after it splits, the
task-1 answer after the sequence drains, the poll after Run, the exit with its
answer out. This walks each one and writes out/steps/<name>.png.
"""
import os
import pathlib

from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).parent
PLAN = HERE / "out" / "14_for_loop_student_view.html"
OUT = HERE / "out" / "steps"
CHROME = os.path.expanduser(
    "~/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe")


def go(sid, k):
    return f"() => document.querySelector('#{sid}').animGo({k})"


# card number (1 based, presenter order) -> list of (name, script to run first)
SHOTS = [
    # the recap is the skill's own `match` panel, with its own controls
    (3, "recap-pair1", "() => document.querySelector('#p-stage [data-rcp-next],"
        " .rcp [data-rcp-next]').click()"),
    (3, "recap-all", "() => {const b=document.querySelector('.rcp [data-rcp-next]');"
        "for(let i=0;i<3;i++) b.click();}"),
    (4, "hook-1", go("stage-hook", 1)),
    (4, "hook-3", go("stage-hook", 3)),
    (4, "hook-4", go("stage-hook", 4)),
    (4, "hook-6", go("stage-hook", 6)),
    (5, "ex-1-yours", go("stage-ex", 1)),
    (5, "ex-2-ours", go("stage-ex", 2)),
    (5, "ex-4-shape", go("stage-ex", 4)),
    (6, "title-card", "() => {}"),
    (7, "agenda-1", go("stage-agenda", 1)),
    (7, "agenda-4", go("stage-agenda", 4)),
    (14, "split-before", "() => {}"),
    (14, "split-after", "() => document.getElementById('x-split').click()"),
    (14, "walk-python-done", "() => {document.getElementById('x-reset').click();"
        "for(let i=0;i<15;i++) document.getElementById('x-step').click();}"),
    (14, "walk-empty-done", "() => {"
        "document.querySelector('[data-w=\"\"]').click();"
        "for(let i=0;i<4;i++) document.getElementById('x-step').click();}"),
    (15, "t1-ask", go("stage-t1", 1)),
    (15, "t1-mid", go("stage-t1", 6)),
    (15, "t1-done", go("stage-t1", 11)),
    (17, "quiz-card", "() => {}"),
    (22, "dial-default", "() => document.getElementById('rd-show').click()"),
    (22, "dial-empty", "() => {const up=[...document.querySelectorAll('[data-d]')];"
        "up.find(b=>b.dataset.d==='a1').click();"
        "up.find(b=>b.dataset.d==='a1').click();"
        "up.find(b=>b.dataset.d==='a1').click();"
        "document.getElementById('rd-show').click();}"),
    (25, "solution", "() => {}"),
    (26, "poll-before", "() => {}"),
    (26, "poll-run", "() => document.getElementById('mr-run').click()"),
    (29, "exit-told", "() => {const st=document.querySelector('#stage-exit .stage-step');"
        "st.classList.add('told'); st.querySelector('.ans').classList.add('shown');}"),
    (30, "takeaways-7", go("stage-tk", 7)),
]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    errs = []
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path=CHROME if os.path.exists(CHROME) else None)
        pg = b.new_page(viewport={"width": 1600, "height": 900})
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto("file:///" + str(PLAN).replace("\\", "/"))
        pg.wait_for_timeout(600)
        pg.keyboard.press("p")
        pg.wait_for_timeout(250)
        pg.keyboard.press("f")
        pg.wait_for_timeout(350)
        for card, name, script in SHOTS:
            pg.keyboard.press("a")
            pg.wait_for_timeout(150)
            pg.click(f"#p-grid-in .p-cell:nth-child({card})")
            pg.wait_for_timeout(350)
            pg.evaluate(script)
            pg.wait_for_timeout(2600)
            pg.screenshot(path=str(OUT / f"{name}.png"))
            print("  ", name)
        b.close()
    print("page errors:", errs or "none")


if __name__ == "__main__":
    main()
