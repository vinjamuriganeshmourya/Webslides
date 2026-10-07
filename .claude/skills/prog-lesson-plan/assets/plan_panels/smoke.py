#!/usr/bin/env python3
"""Render one of every component into a single page, so the library is looked
at rather than assumed to work.

    python3 assets/plan_panels/smoke.py <a rendered sl3.html> <out.html>

It is not a test of a session's content: it proves each component still renders,
steps and carries its CSS and JS after an edit to this package. Open the page,
press through each panel, and look at it. A component that only parses is not a
component that works.
"""
import pathlib
import sys

HERE = pathlib.Path(__file__).parent
sys.path.insert(0, str(HERE.parent))

from plan_panels import cards, conceptmap, deckslide, machine, walker  # noqa: E402
from standard_slides import SPINE_CSS, SPINE_JS, Spine            # noqa: E402

# `answer` is the index into `options`, and id, tag and title are not optional:
# without them the panel header prints "undefined" on the projector.
LEVELS = [
    {"id": 1, "tag": "pop", "title": "Pop one out",
     "start": [], "ops": ["push(4)", "push(7)", "pop()"],
     "q": "4 then 7 went in. We pop once. What comes out?",
     "options": ["7", "4", "nothing"], "answer": 0,
     "explain": "Pop takes the newest one, and 7 went in last. 4 is still inside."},
    {"id": 2, "tag": "pop twice", "title": "Pop until it is empty",
     "start": [2], "ops": ["push(9)", "pop()", "pop()"],
     "q": "2 is inside and we push 9. After two pops, what came out last?",
     "options": ["2", "9", "nothing"], "answer": 0,
     "explain": "9 leaves first because it is newest, so 2 is the one left to come out."},
]


def main(sl3, out):
    S = Spine(str(HERE.parent / "standard-slides"))
    D = deckslide.DeckChrome(sl3, sub="A smoke test")

    body = "".join([
        cards.pcard("Spine, welcome", S.welcome()),
        cards.pcard("Spine, recap", S.recap_title()),
        cards.pcard("Spine, title", S.title_card("Stack Implementation Using Array")),
        cards.pcard("Deck slide, stepped", D.slide(
            "ds-smoke", "Operations",
            deckslide.points("fx-pts", ["Put one on top", "Take the top one off",
                                        "Look at the top one"]),
            anim=3, labels="One|Two|Three"), animated="explainer"),
        cards.pcard("Walker, one operation per press", walker.walker(
            "w-smoke", [("smoke", ["push(5)", "push(8)", "pop()", "push(2)", "pop()"])],
            mode="reveal")),
        cards.pcard("Machine, predict then run", machine.panel(
            "stage-smoke", "Predict, then run", "What comes out?", LEVELS,
            "Pick your answer before we press Run.")),
        cards.pcard("Concept map", '<svg class="fig" viewBox="0 0 900 320">'
                    + conceptmap.box(330, 20, 240, 62, "How a stack works")
                    + conceptmap.edge(450, 82, 180, 150) + conceptmap.edge(450, 82, 720, 150)
                    + conceptmap.box(60, 150, 240, 62, "One end only")
                    + conceptmap.box(600, 150, 240, 62, "Newest one leaves first")
                    + conceptmap.label(450, 260, "plain words, every child under its own parent")
                    + '</svg>'),
    ])

    css = (D.base_css + SPINE_CSS + deckslide.DECK_CSS + walker.WALKER_CSS
           + machine.CSS + conceptmap.MAP_CSS)
    js = SPINE_JS + walker.WALKER_JS + machine.JS
    tpl = (HERE.parent / "plan-template.html").read_text(encoding="utf8")
    doc = (tpl.replace("{{EXTRA_CSS}}", css)
              .replace("{{EXTRA_JS}}", js)
              .replace("{{BLOCKS}}", cards.block(
                  "smoke", "", "Every component, once", "0 to 0", body))
              .replace("{{NAV}}", "")
              .replace("{{ONE_IDEA}}", " Each panel in this package still renders, "
                       "steps and carries its own CSS and JS.")
              .replace("{{GUIDE}}", "")
              .replace("{{HANDOUT}}", "")
              .replace("{{SESSION_TITLE}}", "Panel smoke test"))
    pathlib.Path(out).write_text(doc, encoding="utf8")
    print(f"{out}  {len(doc) // 1024} KB")


if __name__ == "__main__":
    main(*sys.argv[1:3])
