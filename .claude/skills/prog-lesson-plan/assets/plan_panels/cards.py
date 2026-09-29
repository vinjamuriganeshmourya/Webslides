#!/usr/bin/env python3
"""panels.cards - the card shell every plan is built out of.

Lifted unchanged from the Introduction to Stacks build, which is the plan the
user judges every other plan against. Nothing here is about stacks, or about
any subject: it is the box a card sits in, its head, its step wrapper, its
controls and its timer.

    from plan_panels.cards import pcard, step, ctl, tmr, slhead, block, RULE

`pcard(label, inner, animated=...)` is the wrapper the presenter file steps
through. `step()` wraps one press of a hand-driven stage. `ctl()` is the Back /
Next / count row a stage carries. Everything returns a string of HTML, so a
builder composes with `+` and f-strings and never templates.
"""
import html


def slhead(eyebrow, title):
    return ('<div class="sl-head"><span class="sl-bar" aria-hidden="true"></span><div>'
            f'<p class="sl-eyebrow">{eyebrow}</p><h3 class="sl-title">{title}</h3></div></div>')


RULE = '<div class="stage-rule" aria-hidden="true"></div>'


def ctl():
    return ('<div class="stage-ctl"><button type="button" data-stage-prev>Back</button>'
            '<button type="button" data-stage-next>Next</button>'
            '<span class="ctl-count"></span></div>')


def tmr(secs, auto=False):
    return f'<span class="tmr" data-secs="{secs}"{" data-auto" if auto else ""}></span>'


def pcard(lbl, inner, animated=None):
    an = f' data-animated="{animated}"' if animated else ""
    return (f'<div class="pcard{" anim" if animated else ""}" data-label="{html.escape(lbl)}"{an}>'
            f'<div class="slide-head"><span class="slide-title">{html.escape(lbl)}</span></div>'
            f'{inner}</div>')


def step(lbl, body, on=False):
    return f'<div class="stage-step{" on" if on else ""}" data-label="{lbl}">{body}</div>'


def ops_pre(ops, cls="slabcode"):
    return f'<pre class="{cls}">' + "\n".join(html.escape(o) for o in ops) + "</pre>"


def block(bid, icon, h2, rng, inner, cls=""):
    return (f'<section class="block {cls}" id="{bid}">'
            f'<div class="block-head"><span class="block-icon" aria-hidden="true">{icon}</span>'
            f'<h2>{h2}</h2><span class="block-mins">{rng} min</span></div>{inner}</section>')


# ----------------------------------------------------------------------------
# small static figures for the activity panels (px-based SVG: the panels are
# not size containers, so the cqh mini stacks of dslides.py cannot be used)
# ----------------------------------------------------------------------------
