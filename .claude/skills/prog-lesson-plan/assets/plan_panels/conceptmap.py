#!/usr/bin/env python3
"""panels.conceptmap - key takeaways as a map, never as a list.

One map per parent idea, every child hanging under its own parent, revealed one
box per press. A plan whose takeaways are bullet points has thrown away the one
card where the room can see how the session's ideas sit against each other.

    from plan_panels.conceptmap import box, edge, label, MAP_CSS

Words on a map are plain and descriptive: "takes the newest one first", not
"LIFO semantics". If a child could hang under either parent, the map is wrong
and the session has two ideas where it thought it had one.
"""

def box(x, y, w, h, text, sub="", fill="#EAF6FC", stroke="var(--dk-blue)", bold=True):
    t1 = (f'<text x="{x + w / 2}" y="{y + h / 2 + (0 if not sub else -8)}" text-anchor="middle" '
          f'dominant-baseline="central" style="font:{"600" if bold else "400"} 19px var(--sans)" fill="#1A1A1A">{text}</text>')
    t2 = (f'<text x="{x + w / 2}" y="{y + h / 2 + 15}" text-anchor="middle" dominant-baseline="central" '
          f'style="font:15px var(--sans)" fill="#6A6A6A">{sub}</text>') if sub else ""
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{fill}" stroke="{stroke}" stroke-width="2.5"/>'
            + t1 + t2)


def edge(x1, y1, x2, y2):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#7C8A99" stroke-width="2.5" stroke-linecap="round"/>'


def label(x, y, text):
    return (f'<text x="{x}" y="{y}" text-anchor="middle" dominant-baseline="central" '
            f'style="font:600 13px var(--sans);letter-spacing:.08em" fill="#7C8A99">{text}</text>')


# Two maps, plain words (round 7). Left: the rule and what follows from it.

MAP_CSS = '''
.pcard .stage svg.tkmap{max-height:58vh}
.an-8 .tkmap > g:nth-child(-n+8),.an-9 .tkmap > g:nth-child(-n+9),.an-10 .tkmap > g:nth-child(-n+10){opacity:1;transform:none}
'''
