#!/usr/bin/env python3
"""The panel library: the visual components every plan is built out of.

These are the panels from `Plans/DSA/Module 3 - Stacks & Queues/01 - Introduction
to Stacks/`, which is the plan the user judges every other plan against. They
are here so that quality is **inherited rather than re-achieved**: a new session
imports the walker, the machine, the deck chrome and the map, and spends its
design time on the session's own content instead of rebuilding a stepper.

    import sys; sys.path.insert(0, 'assets')
    from plan_panels.cards import pcard, step, ctl, tmr, slhead, block
    from plan_panels.deckslide import DeckChrome, ic, points, lines, DECK_CSS
    from plan_panels.walker import walker, WALKER_CSS, WALKER_JS
    from plan_panels.machine import panel as machine_panel, sim, CSS as MACHINE_CSS
    from plan_panels.conceptmap import box, edge, label, MAP_CSS

**The hook is not in here, and never will be.** The hook is the one card that
has to be built new for every session, on an everyday object that fits *that*
session's idea: the phone's Back button for stacks, the canteen queue for
queues, the lab's undo for whatever undo teaches. Copying the Stacks phone into
a session about queues is the most visible sign a plan was assembled rather than
designed. What carries over from the Stacks hook is the **craft**, which
`references/visual-bar.md` sets out: a realistic mock UI, one continuous story,
stepped by the instructor, no questions inside it. Build it standalone, show the
user, and only then put it in the plan.

The package is `plan_panels`, not `panels`, on purpose: a session build keeps its own
`panels.py` for that session's one-off cards, and builders put this `assets/` directory
first on `sys.path`, so a package called `panels` here silently shadows theirs and the
build dies on an attribute that moved. Do not rename it back.

`smoke.py` renders one of each component into a single page. Run it and look at
the page after any edit here. A component that imports is not a component that
works: the machine's own header printed the word `undefined` through three
passes of reading the code, and one screenshot found it.
"""
