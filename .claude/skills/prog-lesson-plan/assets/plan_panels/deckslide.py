#!/usr/bin/env python3
"""panels.deckslide - a deck slide, redrawn under the deck's own chrome.

Every concept slide the deck carries is redrawn here and stepped, one point or
one stop per press, rather than shown as a picture. The slide keeps the deck's
chrome exactly - its left accent bar, its subtitle, its title face and colour,
its logo and its bottom gradient - and only the body under it is rebuilt.
A room that sees a redrawn slide should not be able to tell it was redrawn.

    from plan_panels.deckslide import DeckChrome, ic, points, lines, DECK_CSS

    D = DeckChrome('work/slides/sl3.html', sub='Introduction to Stacks')
    D.slide('ds-agenda', 'Agenda', points('ag', stops), anim=4,
            labels='Stop 1|Stop 2|Stop 3|Stop 4')

The chrome is lifted out of the session's own rendered slide 3, so every
session's redrawn slides carry that session's deck, not this one's. Render the
deck first (`scripts/render_slides.py`), then point `DeckChrome` at `sl3.html`.
Only decks of live shapes have a positioned render: `prog-lesson-plan` decks are
full-bleed images, carry no `ds-layout` shapes, and DeckChrome does not apply to
them — use `cards` for those slides instead.

**Two stylesheets, and both are needed.** `DECK_CSS` is this package's own and
`DeckChrome.base_css` is the renderer's, picked up from `slides.css` beside the
slide. Put both into `{{EXTRA_CSS}}`. With only the first, the chrome has no
sizes: the logo grows to fill the slide and the title does not appear at all.

**Sizes are `cqh`, not `px`.** A `.ds-slide` is a container, so the same markup
fits the document view and presenter view with no second stylesheet. A px size
inside a deck slide is a bug that only shows on the projector.

**Titles get PowerPoint's own text inset** (`.ds-slide .ds-tf{padding:0 1.78cqh}`),
or they sit on top of the accent bar. That one has been found by screenshot in
three separate rounds; it is in the CSS here so it cannot be forgotten again.

Two more things screenshots catch and scripts do not: a deck slide that carries
a caption band needs the band reserved with `padding-bottom` on the body, not by
writing a shorter body; and a figure sized to the full body will clip at the
slide edge once the caption is in.
"""
import re
from pathlib import Path


class DeckChrome:
    """The deck's own layout artwork, and the slides drawn under it.

    `slide_html` is the path to one rendered content slide of THIS session's
    deck - slide 3 in every deck seen so far. `sub` is the subtitle line the
    deck puts above every title, which is the session name.
    """

    def __init__(self, slide_html, sub):
        self.sub = sub
        path = Path(slide_html)
        # `render_slides.py` writes the positioning rules for .ds-slide,
        # .ds-shape and .ds-tf into slides.css beside the slides, not into each
        # slide. Without it the chrome has no sizes: the logo grows to fill the
        # slide and the title does not appear at all. Carrying it here means a
        # builder cannot ship a deck slide and forget the stylesheet that makes
        # it a slide.
        base = path.parent / "slides.css"
        if not base.exists():
            raise SystemExit(
                f"deckslide: {base} is missing. Run scripts/render_slides.py "
                "on the deck first; DeckChrome needs the renderer's own CSS. "
                "A full-bleed image deck (prog-lesson-plan) has no positioned "
                "render at all — use plan_panels.cards for those slides.")
        self.base_css = base.read_text(encoding="utf8")
        frag = path.read_text(encoding="utf8")
        i = frag.index('<div class="ds-shape" style=')
        head = frag[:i]
        self.chrome = head[head.index(">") + 1:]
        n = self.chrome.count("ds-layout")
        if n != 3:
            raise SystemExit(
                f"deckslide: {slide_html} gave {n} layout shapes, expected 3. "
                "Point DeckChrome at a plain content slide of the deck, not at "
                "the title slide or a picture slide.")

    def head(self, title, sub=None):
        """The subtitle and title, where the deck puts them.

        The 1.78cqh inset that keeps them off the accent bar is PowerPoint's
        own default, applied in CSS to every `.ds-tf`, so the deck slides that
        are kept as rendered get it too.
        """
        sub = self.sub if sub is None else sub
        return (f'<div class="ds-shape" style="left:1.747%;top:5.739%;width:70%;height:6.696%">'
                f'<div class="ds-tf" data-anchor="MIDDLE"><p style="text-align:left">'
                f'<span style="font-size:3.704cqh;color:#434343">{sub}</span></p></div></div>'
                f'<div class="ds-shape" style="left:1.664%;top:12.137%;width:80%;height:8.078%">'
                f'<div class="ds-tf" data-anchor="MIDDLE"><p style="text-align:left">'
                f'<span style="font-size:6.173cqh;color:#006DAF">{title}</span></p></div></div>')

    def slide(self, sid, title, body, anim=None, labels="", cls="",
              nxt="Next", extra="", sub=None):
        """A deck-styled stage. `anim` is how many presses it takes.

        Stepping is the template's own `data-anim` engine, so arrow keys, Next
        and Replay all work and no slide brings JavaScript of its own.
        """
        an = f' data-anim="{anim}" data-anim-labels="{labels}"' if anim else ""
        ctl = ""
        if anim:
            ctl = (f'<div class="stage-ctl ds-ctl"><button type="button" data-anim-next>{nxt}</button>'
                   '<button type="button" class="ghost" data-anim-replay>Replay</button>'
                   '<span class="ctl-count" data-anim-count></span></div>')
        return (f'<div class="stage ds-stage {cls}" id="{sid}"{an}{extra}>'
                f'<div class="ds-slide ds-auth" style="--ds-ar:16/9">'
                f'{self.chrome}{self.head(title, sub)}'
                f'<div class="ds-body">{body}</div>{ctl}</div></div>')


def ic(path):
    return (f'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{path}</svg>')


IC_BOX = ic('<path d="M4 8h16v12H4z"/><path d="M4 8l2-4h12l2 4"/><path d="M10 12h4"/>')
IC_GEAR = ic('<path d="M12 5v3M12 16v3M5 12h3M16 12h3"/><circle cx="12" cy="12" r="3.2"/>'
             '<path d="M7 7l2 2M15 15l2 2M17 7l-2 2M9 15l-2 2"/>')
IC_TYPES = ic('<path d="M4 6h6v14H4zM14 10h6v10h-6z"/><path d="M17 4v3M15.5 5.5h3"/>')
IC_FLAG = ic('<path d="M5 21V4"/><path d="M5 4h11l-1.5 3L16 10H5"/>')


def points(cls, items):
    """Numbered point cards revealed one per press (an-1..an-N)."""
    return (f'<div class="{cls}">'
            + "".join(f'<div class="fx-pt" style="--i:{i}"><i>{i + 1}</i><p>{t}</p></div>' for i, t in enumerate(items))
            + '</div>')


def lines(cls, items):
    """One caption per step, shown by .an-N .lN."""
    return (f'<p class="{cls}">'
            + "".join(f'<span class="l{i + 1}">{t}</span>' for i, t in enumerate(items))
            + '</p>')


# ----------------------------------------------------------------------------
# 1. agenda (deck 3) - four stops, one per press
# ----------------------------------------------------------------------------

DECK_CSS = r'''
/* ================= deck-styled authored slides ================= */
:root{--ease-in-out:cubic-bezier(.77,0,.175,1)}
/* PowerPoint's default text inset (0.1in on a 10in slide): keeps every title
   and subtitle off the accent bar, on the rendered deck slides too */
.ds-slide .ds-tf{padding:0 1.78cqh;box-sizing:border-box}
.stage.ds-stage{position:relative;aspect-ratio:16/9;padding:0 !important;overflow:hidden;background:#fff}
.ds-stage .sl-head{display:none}
.ds-stage>.ds-slide{position:absolute;inset:0;top:0;right:0;bottom:0;left:0;width:100%;height:100%;
 aspect-ratio:auto;border-radius:12px}
body.present .ds-stage>.ds-slide{border-radius:0}
.ds-body{position:absolute;left:0;right:0;top:23cqh;bottom:3.5cqh;color:#434343;
 font-family:'Poppins','Segoe UI',system-ui,sans-serif}
.ds-body em{font-style:normal;color:#006DAF;font-weight:600}
.ds-body code{font-family:var(--mono);font-weight:600;color:#006DAF}
.ds-ctl{position:absolute;right:3cqh;top:6.5cqh;z-index:5;gap:1cqh;margin:0}
.ds-ctl button{font-size:1.9cqh;padding:1cqh 1.9cqh;border-radius:1cqh}
.ds-ctl .ctl-count{font-size:1.7cqh;margin-left:.6cqh}
body.present .ds-ctl .ctl-count{display:none}
@keyframes dsin{from{opacity:0;transform:translateY(3cqh)}}
@keyframes dsin-x{from{opacity:0;transform:translateX(-3cqh)}}

/* mini stack, shared by the slides here */
.ms{position:relative;width:18cqh;height:var(--h,40cqh);border:.9cqh solid #F0A230;border-top:0;
 border-radius:0 0 1.8cqh 1.8cqh;background:#FBFCFD;flex:none}
.ms.lid{border-top:.9cqh solid #F0A230;border-radius:1.8cqh}
.ms-b{position:absolute;left:1.5cqh;right:1.5cqh;height:9.4cqh;border-radius:1.3cqh;background:#B85039;color:#fff;
 font-size:4.4cqh;font-weight:700;line-height:1;display:grid;place-items:center;
 transition:transform 340ms var(--ease-out),opacity 260ms var(--ease-out),box-shadow 220ms var(--ease-out)}
.ms-b.s0{bottom:1.2cqh}.ms-b.s1{bottom:11.6cqh}.ms-b.s2{bottom:22cqh}.ms-b.s3{bottom:32.4cqh}
.ms-slot{position:absolute;left:1.5cqh;right:1.5cqh;height:9.4cqh;border:.35cqh dashed #C7CED6;border-radius:1.3cqh}
.ms-slot.s0{bottom:1.2cqh}.ms-slot.s1{bottom:11.6cqh}.ms-slot.s2{bottom:22cqh}
.ms-cap{position:absolute;left:-2cqh;right:-2cqh;top:-4.8cqh;text-align:center;font-size:2.1cqh;font-weight:600;
 letter-spacing:.08em;text-transform:uppercase;color:#7C8A99;white-space:nowrap}
.ms.lid .ms-cap{top:-5.6cqh}
.ms:has(.ms-grow) .ms-cap{top:-17.6cqh}
.ms-ptr{position:absolute;right:calc(100% + 1.6cqh);bottom:1.2cqh;height:9.4cqh;display:flex;align-items:center;
 font-size:3cqh;font-weight:700;color:#006DAF;white-space:nowrap;transition:transform 340ms var(--ease-out),opacity 200ms var(--ease-out)}
.ms-ptr::after{content:"";display:inline-block;width:2.2cqh;height:2.2cqh;margin-left:.9cqh;
 border-top:.5cqh solid #006DAF;border-right:.5cqh solid #006DAF;transform:rotate(45deg)}
.ms-grow{position:absolute;left:-.9cqh;right:-.9cqh;bottom:100%;height:12cqh;border:.9cqh dashed #F0A230;border-bottom:0;
 border-radius:1.8cqh 1.8cqh 0 0;opacity:.75}
.ms-grow span{position:absolute;left:0;right:0;top:2.4cqh;text-align:center;font-size:2.2cqh;font-weight:600;color:#C77A12;letter-spacing:.06em}

/* numbered points, one per press, the current one lit */
.fx-txt,.tp-txt,.pl-txt{position:absolute;left:6cqh;top:2cqh;width:92cqh;display:flex;flex-direction:column;gap:2.2cqh}
.fx-pt{display:flex;gap:2.4cqh;align-items:flex-start;background:#fff;border:.3cqh solid #E3EBF0;border-radius:2cqh;padding:2.2cqh 2.6cqh;
 opacity:0;transform:translateX(-3cqh);
 transition:opacity 280ms var(--ease-out),transform 280ms var(--ease-out),background-color 260ms var(--ease-out),border-color 260ms var(--ease-out)}
.fx-pt i{flex:none;width:5cqh;height:5cqh;border-radius:50%;background:#006DAF;color:#fff;font-style:normal;font-weight:700;font-size:2.7cqh;display:grid;place-items:center}
.fx-pt p{margin:0;font-size:2.9cqh;line-height:1.45}
.an-1 .fx-pt:nth-child(1),.an-2 .fx-pt:nth-child(-n+2),.an-3 .fx-pt:nth-child(-n+3),.an-4 .fx-pt:nth-child(-n+4){opacity:1;transform:none}
.an-1 .fx-pt:nth-child(1),.an-2 .fx-pt:nth-child(2),.an-3 .fx-pt:nth-child(3),.an-4 .fx-pt:nth-child(4){background:#E6F2F9;border-color:#006DAF}
/* one caption per step */
.op-line,.tp-line,.pl-line{position:absolute;left:0;right:0;bottom:2cqh;margin:0;min-height:9cqh;padding:1.8cqh 2.4cqh;border-radius:1.6cqh;background:#F7FAFC;
 font-size:2.6cqh;line-height:1.4;font-weight:500;color:#14242E}
.op-line span,.tp-line span,.pl-line span{display:none;animation:dsin-x 240ms var(--ease-out) both}
.an-1 .l1,.an-2 .l2,.an-3 .l3,.an-4 .l4,.an-5 .l5,.an-6 .l6{display:block}

/* ---- agenda ---- */
.ag-row{position:absolute;left:6cqh;right:6cqh;top:20cqh;display:flex;gap:3.2cqh}
.ag-card{flex:1 1 0;min-width:0;position:relative;background:#fff;border:.3cqh solid #CFE3EF;border-radius:2.6cqh;
 padding:4.2cqh 2.8cqh 3cqh;box-shadow:0 1.8cqh 3.4cqh -2.4cqh rgba(0,60,100,.3);
 opacity:0;transform:translateY(3cqh);transition:opacity 320ms var(--ease-out),transform 320ms var(--ease-out),border-color 260ms var(--ease-out)}
.an-1 .ag-card:nth-child(1),.an-2 .ag-card:nth-child(-n+2),.an-3 .ag-card:nth-child(-n+3),.an-4 .ag-card:nth-child(-n+4){opacity:1;transform:none}
.an-1 .ag-card:nth-child(1),.an-2 .ag-card:nth-child(2),.an-3 .ag-card:nth-child(3),.an-4 .ag-card:nth-child(4){border-color:#006DAF}
.ag-n{position:absolute;top:-2.3cqh;left:2.8cqh;background:#006DAF;color:#fff;font-size:2.4cqh;font-weight:700;
 padding:.9cqh 1.7cqh;border-radius:999px;letter-spacing:.04em}
.ag-ic{display:grid;place-items:center;width:8.6cqh;height:8.6cqh;border-radius:2.2cqh;background:#E4F3FA;color:#006DAF;margin:0 0 2.2cqh}
.ag-ic svg{width:60%;height:60%}
.ag-card b{display:block;font-size:3.3cqh;font-weight:600;line-height:1.2;color:#14242E}
.ag-card small{display:block;font-size:2.3cqh;line-height:1.35;color:#6A6A6A;margin-top:.9cqh}

/* ---- push and pop ---- */
.pp{position:absolute;inset:0;top:0;right:0;bottom:0;left:0}
.pp-left{position:absolute;left:14cqh;top:9cqh;width:44cqh;display:flex;flex-direction:column;align-items:center}
.pp-out{margin-top:3cqh;display:flex;align-items:center;gap:1.6cqh;min-height:6cqh}
.pp-outlab{font-size:2.1cqh;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#7C8A99}
.pp-chip{min-width:6cqh;height:6cqh;padding:0 1.8cqh;border-radius:1.2cqh;background:#1B222B;color:#E8EDF3;font:700 3.2cqh/6cqh var(--mono);
 text-align:center;opacity:0;transform:translateX(-2cqh) scale(.9);transition:transform 260ms var(--ease-out) 120ms,opacity 240ms var(--ease-out) 120ms}
.an-3 .pp-chip,.an-4 .pp-chip{opacity:1;transform:none}
/* the carried box waits beside the stack, level with the top slot, never over the title */
.pp-one{opacity:1;transform:translate(-24cqh,-3cqh) scale(.94);transition:transform 480ms var(--ease-in-out),opacity 300ms var(--ease-out)}
.an-2 .pp-one{transform:none}
.an-3 .pp-one,.an-4 .pp-one{opacity:0;transform:translateY(-16cqh);transition-duration:260ms}
.pp-ptr{transform:translateY(-10.4cqh)}
.an-2 .pp-ptr{transform:translateY(-20.8cqh)}
.pp-right{position:absolute;left:66cqh;right:6cqh;top:4cqh;display:flex;flex-direction:column;gap:2.2cqh}
.pp-def{display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto;column-gap:2.4cqh;align-items:center;
 padding:2.2cqh 2.8cqh;border-radius:2cqh;border:.3cqh solid #CFE3EF;background:#fff;opacity:.5;transform:none;
 transition:opacity 260ms var(--ease-out),background-color 260ms var(--ease-out),border-color 260ms var(--ease-out),box-shadow 260ms var(--ease-out)}
.pp-def code{grid-row:1 / span 2;font-size:3.6cqh;padding:1.2cqh 1.8cqh;border-radius:1.2cqh;background:#F2F8FB;color:#006DAF}
.pp-def b{font-size:3.1cqh;font-weight:600;color:#14242E;line-height:1.2}
.pp-def span{font-size:2.4cqh;color:#6A6A6A;line-height:1.35;margin-top:.5cqh}
.an-2 .pp-push,.an-3 .pp-pop{opacity:1;background:#E6F2F9;border-color:#006DAF;box-shadow:0 1.6cqh 3cqh -2.2cqh rgba(0,109,175,.5)}
.an-4 .pp-def{opacity:1}
.pp-rule{margin:.6cqh 0 0;padding:2cqh 2.8cqh;border-left:.9cqh solid #F0A230;background:#FFF6E8;border-radius:0 1.6cqh 1.6cqh 0;
 font-size:3cqh;line-height:1.4;font-weight:500;opacity:0;transform:translateY(2cqh);transition:opacity 260ms var(--ease-out),transform 260ms var(--ease-out)}
.an-4 .pp-rule{opacity:1;transform:none}
.pp-capt{position:absolute;left:6cqh;right:6cqh;bottom:0;min-height:8cqh}
.pp-capt p{margin:0;display:none;font-size:3.1cqh;line-height:1.4;font-weight:500;color:#14242E;animation:dsin-x 260ms var(--ease-out) both}
.an-1 .pp-capt .c1,.an-2 .pp-capt .c2,.an-3 .pp-capt .c3,.an-4 .pp-capt .c4{display:block}

/* ---- top ---- */
.tp,.pl{position:absolute;inset:0;top:0;right:0;bottom:0;left:0}
.tp-fig,.pl-fig{position:absolute;left:106cqh;right:15cqh;top:0;bottom:0}
.tp-stage{position:absolute;left:0;right:0;top:9cqh;height:42cqh;display:flex;justify-content:center;align-items:flex-end}
.tp-seven{opacity:1;transform:translateY(-16cqh)}
.an-2 .tp-seven{transform:none}
.an-3 .tp-seven,.an-4 .tp-seven{opacity:0;transform:translateY(-16cqh);transition-duration:260ms}
.tp-ptr{transform:translateY(-10.4cqh)}
.an-2 .tp-ptr{transform:translateY(-20.8cqh)}
.an-4 .tp-two{box-shadow:0 0 0 .7cqh #3FB5E5}
.an-4 .tp-three{opacity:.45}
/* the red label sits under the box, so it never touches the points on the left */
.tp-no{position:absolute;left:50%;top:calc(100% + 1.6cqh);transform:translate(-50%,1.5cqh);padding:.9cqh 1.6cqh;border-radius:1cqh;border:.3cqh dashed #C7454E;color:#C7454E;
 font-size:2.3cqh;font-weight:600;white-space:nowrap;opacity:0;transition:opacity 260ms var(--ease-out),transform 260ms var(--ease-out)}
.an-4 .tp-no{opacity:1;transform:translate(-50%,0)}

/* ---- plates ---- */
.pl-pile{position:absolute;left:50%;top:10cqh;width:36cqh;height:40cqh;margin-left:-18cqh}
.pl-table{position:absolute;left:-5cqh;right:-5cqh;bottom:0;height:1.6cqh;border-radius:.8cqh;background:#C7CED6}
.pl-p{position:absolute;left:0;width:36cqh;height:7.4cqh;bottom:calc(var(--k) * 3.4cqh + 1.6cqh);border-radius:50%;background:var(--c);
 box-shadow:inset 0 -1.1cqh 0 rgba(0,0,0,.18),0 .5cqh .8cqh -.4cqh rgba(0,0,0,.4);
 transition:transform 460ms var(--ease-in-out),opacity 320ms var(--ease-out),box-shadow 260ms var(--ease-out)}
.pl-p::after{content:"";position:absolute;left:6cqh;right:6cqh;top:1.5cqh;bottom:2.4cqh;border-radius:50%;background:rgba(255,255,255,.32)}
.pl-new{opacity:0;transform:translateY(-20cqh)}
.an-2 .pl-new{opacity:1;transform:none}
.an-3 .pl-new,.an-4 .pl-new{opacity:0;transform:translate(24cqh,-16cqh) rotate(9deg)}
.pl-ptr{position:absolute;right:calc(100% + 2.4cqh);bottom:calc(3 * 3.4cqh + 1.6cqh);height:7.4cqh;display:flex;align-items:center;
 font-size:3cqh;font-weight:700;color:#006DAF;white-space:nowrap;transition:transform 460ms var(--ease-in-out)}
.pl-ptr::after{content:"";display:inline-block;width:2.2cqh;height:2.2cqh;margin-left:.9cqh;
 border-top:.5cqh solid #006DAF;border-right:.5cqh solid #006DAF;transform:rotate(45deg)}
.an-2 .pl-ptr{transform:translateY(-3.4cqh)}
.an-4 .pl-p.k0{box-shadow:0 0 0 .6cqh #C7454E,inset 0 -1.1cqh 0 rgba(0,0,0,.18)}
.an-4 .pl-p.k1,.an-4 .pl-p.k2,.an-4 .pl-p.k3{animation:plwig 1.4s var(--ease-in-out) 200ms 2}
@keyframes plwig{0%,100%{transform:none}25%{transform:translateX(-1cqh)}75%{transform:translateX(1cqh)}}
.pl-no{position:absolute;left:50%;top:calc(100% + 1.8cqh);transform:translate(-50%,1.5cqh);padding:.9cqh 1.6cqh;border-radius:1cqh;
 border:.3cqh dashed #C7454E;color:#C7454E;font-size:2.3cqh;font-weight:600;white-space:nowrap;
 opacity:0;transition:opacity 260ms var(--ease-out),transform 260ms var(--ease-out)}
.an-4 .pl-no{opacity:1;transform:translate(-50%,0)}

/* ---- operations ---- */
.op{position:absolute;inset:0;top:0;right:0;bottom:0;left:0}
.op-list{position:absolute;left:5cqh;top:1cqh;width:96cqh}
.op-h,.op-r{display:grid;grid-template-columns:19cqh 1fr 9cqh;align-items:center;column-gap:2cqh;padding:1.5cqh 2.2cqh}
.op-h{font-size:2cqh;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#7C8A99;padding-bottom:.8cqh}
.op-r{border:.3cqh solid #E3EBF0;border-radius:1.6cqh;margin:0 0 1.1cqh;background:#fff;opacity:0;transform:translateX(-2cqh);
 transition:opacity 260ms var(--ease-out),transform 260ms var(--ease-out),background-color 260ms var(--ease-out),border-color 260ms var(--ease-out)}
.op-r code{font-size:3cqh}
.op-r span{font-size:2.5cqh;line-height:1.3;color:#434343}
.op-r i{font-style:normal;font-family:var(--mono);font-size:2.3cqh;font-weight:700;color:#1A7F4B;background:#E6F6EC;border-radius:999px;padding:.6cqh 0;text-align:center}
.op-r.looks code{color:#0B5A8C}
.an-2 .op-r:nth-child(-n+2),.an-3 .op-r:nth-child(-n+3),.an-4 .op-r:nth-child(-n+4),
.an-5 .op-r:nth-child(-n+5),.an-6 .op-r:nth-child(-n+6){opacity:1;transform:none}
.an-2 .op-r:nth-child(2),.an-3 .op-r:nth-child(3),.an-4 .op-r:nth-child(4),
.an-5 .op-r:nth-child(5),.an-6 .op-r:nth-child(6){background:#E6F2F9;border-color:#006DAF}
.op-fig{position:absolute;left:106cqh;right:15cqh;top:0;bottom:0}
.op-stage{position:absolute;left:0;right:0;top:9cqh;height:40cqh;display:flex;justify-content:center;align-items:flex-end;gap:5cqh}
.op-in,.op-outcol{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:1cqh;min-width:12cqh;height:100%}
.op-lab{font-size:2cqh;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#7C8A99}
.op-tok{min-width:7cqh;height:6.6cqh;padding:0 1.6cqh;border-radius:1.2cqh;background:#F0A230;color:#fff;font-size:3.4cqh;font-weight:700;
 display:grid;place-items:center;opacity:0;transform:translateX(-2cqh);transition:transform 300ms var(--ease-out),opacity 240ms var(--ease-out)}
.an-1 .op-tok{opacity:1;transform:none}
.an-2 .op-tok{opacity:0;transform:translateX(9cqh) scale(.85)}
.op-seven{opacity:0;transform:translate(-22cqh,-12cqh) scale(.9)}
.an-2 .op-seven{opacity:1;transform:none}
.an-3 .op-seven,.an-4 .op-seven,.an-5 .op-seven,.an-6 .op-seven{opacity:0;transform:translateY(-14cqh);transition-duration:240ms}
.op-ptr{transform:translateY(-10.4cqh)}
.an-2 .op-ptr{transform:translateY(-20.8cqh)}
.an-4 .op-two{box-shadow:0 0 0 .7cqh #3FB5E5;transform:scale(1.04)}
.op-n{position:absolute;right:-5.2cqh;font-style:normal;font-size:2.4cqh;font-weight:700;color:#7C8A99;opacity:0;transition:opacity 240ms var(--ease-out)}
.an-6 .op-n{opacity:1}
.op-outcol{flex-direction:column-reverse;justify-content:flex-start;gap:1cqh}
.op-outcol .op-lab{order:-1}
.op-chip{min-width:6.4cqh;height:5.8cqh;padding:0 1.4cqh;border-radius:1.1cqh;background:#1B222B;color:#E8EDF3;font:700 2.9cqh/5.8cqh var(--mono);
 text-align:center;display:none;animation:dsin-x 260ms var(--ease-out) 120ms both}
.op-chip.copy{background:#E6F2F9;color:#006DAF;border:.3cqh dashed #006DAF;line-height:5.2cqh}
.an-3 .c-pop,.an-4 .c-pop,.an-5 .c-pop,.an-6 .c-pop{display:block}
.an-4 .c-top,.an-5 .c-top,.an-6 .c-top{display:block}
.an-5 .c-emp,.an-6 .c-emp{display:block}
.an-6 .c-size{display:block}

/* ---- types ---- */
.ty{position:absolute;left:8cqh;right:8cqh;top:3cqh;bottom:15cqh;display:flex;gap:6cqh}
.ty-card{flex:1 1 0;min-width:0;display:flex;gap:4cqh;align-items:center;justify-content:center;background:#F7FBFD;border:.3cqh solid #CFE3EF;border-radius:2.6cqh;
 padding:5cqh 3.4cqh 3cqh;animation:dsin 520ms var(--ease-out) both;animation-delay:calc(var(--i)*140ms)}
.ty-fig{flex:none;padding-left:2cqh;margin-top:6cqh}
.ty-txt b{display:block;font-size:3.6cqh;font-weight:600;color:#14242E;line-height:1.15;margin:0 0 1.6cqh}
.ty-txt p{margin:0;font-size:2.8cqh;line-height:1.45}
.ty-txt small{display:block;margin-top:2cqh;font-size:2.2cqh;line-height:1.4;color:#6A6A6A}
.ty-txt small b{color:#C7454E;font-weight:700}
.ty-foot{position:absolute;left:8cqh;right:18cqh;bottom:3cqh;margin:0;padding:2cqh 2.8cqh;border-left:.9cqh solid #C7454E;background:#FDF2F0;
 border-radius:0 1.6cqh 1.6cqh 0;font-size:2.8cqh;line-height:1.4;font-weight:500;color:#434343;animation:dsin 520ms 360ms var(--ease-out) both}
.ty-foot b{color:#C7454E;font-weight:700}

/* ---- fixed / dynamic ---- */
.fx-figs{position:absolute;left:106cqh;right:14cqh;top:0;bottom:8cqh;display:flex;justify-content:space-around;align-items:flex-end;gap:4cqh;
 opacity:0;transform:translateY(2cqh);transition:opacity 320ms var(--ease-out),transform 320ms var(--ease-out)}
.an-4 .fx-figs{opacity:1;transform:none}
.fx-fig{position:relative;display:flex;flex-direction:column;align-items:center;padding-top:13cqh}
.fx-lab{margin:2.2cqh 0 0;font-size:2.6cqh;line-height:1.3;color:#434343;white-space:nowrap}
.fx-lab b{color:#C7454E;font-weight:700}
.fx-tok{position:absolute;z-index:2;left:50%;top:0;margin-left:-3.6cqh;width:7.2cqh;height:6.6cqh;border-radius:1.2cqh;background:#F0A230;color:#fff;
 font-size:3.4cqh;font-weight:700;display:grid;place-items:center;transform:translate(-15cqh,-2cqh);opacity:1;
 animation:fxbounce 3s var(--ease-in-out) infinite;animation-play-state:paused}
.an-4 .fx-tok{animation-play-state:running}
@keyframes fxbounce{0%{transform:translate(-15cqh,-2cqh);opacity:0}14%{opacity:1}42%{transform:translate(0,7cqh)}
 56%{transform:translate(-3cqh,0)}78%{transform:translate(-15cqh,-2cqh);opacity:1}100%{transform:translate(-15cqh,-2cqh);opacity:0}}
.fx-figs.one{justify-content:center}
.dy-four{opacity:0;transform:translateY(-14cqh);animation:dyin 3.2s var(--ease-out) infinite;animation-play-state:paused}
@keyframes dyin{0%{opacity:0;transform:translateY(-14cqh)}22%,62%{opacity:1;transform:none}84%,100%{opacity:0;transform:translateY(-14cqh)}}
.dy-grow{opacity:.5;animation:dygrow 3.2s var(--ease-out) infinite;animation-play-state:paused}
.an-4 .dy-four,.an-4 .dy-grow{animation-play-state:running}
@keyframes dygrow{0%,10%{opacity:0}26%,66%{opacity:.85}86%,100%{opacity:0}}

/* ---- implementation ---- */
.im-lead{position:absolute;left:8cqh;right:8cqh;top:1cqh;margin:0;text-align:center;font-size:3cqh;line-height:1.4}
.im-row{position:absolute;left:8cqh;right:8cqh;top:12cqh;display:flex;gap:6cqh}
.im-card{flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:center;gap:3cqh;background:#F7FBFD;border:.3cqh solid #CFE3EF;
 border-radius:2.6cqh;padding:0 3cqh 3cqh;animation:dsin 520ms var(--ease-out) both;animation-delay:calc(var(--i)*140ms)}
.im-pill{margin-top:-2.6cqh;background:#0B5394;color:#fff;font-size:3cqh;font-weight:600;padding:1.4cqh 4cqh;border-radius:999px}
.im-card small{font-size:2.3cqh;color:#6A6A6A;line-height:1.4;text-align:center}
.im-arr{display:flex;flex-direction:column;align-items:flex-start}
.im-top{margin:0 0 .8cqh 25.4cqh;font-family:var(--mono);font-size:2.4cqh;font-weight:700;color:#006DAF;position:relative}
.im-top::after{content:"";position:absolute;left:3.6cqh;top:100%;border:.9cqh solid transparent;border-top:1.2cqh solid #006DAF}
.im-cells{display:flex;gap:.6cqh}
.im-cells span{width:9.4cqh;height:9.4cqh;border-radius:1.2cqh;background:#B85039;color:#fff;font-size:4cqh;font-weight:700;display:grid;place-items:center}
.im-cells span.e{background:#fff;border:.35cqh dashed #C7CED6}
.im-idx{display:flex;gap:.6cqh;margin-top:.8cqh}
.im-idx span{width:9.4cqh;text-align:center;font-family:var(--mono);font-size:2.2cqh;color:#7C8A99}
.im-ll{display:flex;align-items:center;gap:1.2cqh;padding-top:5cqh;position:relative}
.im-toplab{position:absolute;left:0;top:0;width:9.4cqh;text-align:center;font-family:var(--mono);font-size:2.4cqh;font-weight:700;color:#006DAF}
.im-toplab::after{content:"";position:absolute;left:50%;top:100%;margin-left:-.9cqh;border:.9cqh solid transparent;border-top:1.2cqh solid #006DAF}
.im-node{width:9.4cqh;height:9.4cqh;border-radius:50%;background:#B85039;color:#fff;font-size:4cqh;font-weight:700;display:grid;place-items:center}
.im-ll i{font-style:normal;font-size:3.6cqh;color:#F0A230;font-weight:700}
.im-null{font-family:var(--mono);font-size:2.6cqh;color:#7C8A99}
.im-foot{position:absolute;left:8cqh;right:8cqh;bottom:5cqh;margin:0;text-align:center;font-size:2.6cqh;color:#6A6A6A}

@media (prefers-reduced-motion:reduce){
  .ty-card,.ty-foot,.im-card,.pp-capt p,.op-line span,.tp-line span,.pl-line span,.op-chip{animation:none}
  .fx-tok{animation:none;opacity:1;transform:translate(-3cqh,0)}
  .dy-four{animation:none;opacity:1;transform:none}.dy-grow{animation:none;opacity:.85}
  .an-4 .pl-p.k1,.an-4 .pl-p.k2,.an-4 .pl-p.k3{animation:none}
  .ms-b,.ms-ptr,.pp-def,.pp-rule,.pp-chip,.op-r,.op-tok,.ag-card,.fx-pt,.fx-figs,.pl-p,.pl-ptr,.tp-no,.pl-no{transition:none}
}
@media print{.op-r,.pp-rule,.pp-def,.ag-card,.fx-pt,.fx-figs{opacity:1;transform:none}.op-chip,.op-line span,.tp-line span,.pl-line span,.pp-capt p{display:block}}
'''
