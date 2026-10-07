"""One editor card, used everywhere code appears on a card.

Code on a slide is a white editor card with a file tab, line numbers and
coloured keywords. A black slab is not what any of them has written code in,
and dark grey on black is the one thing on a card that cannot be read from the
back row.

`paint` walks the line rather than running a regex over it, so a keyword that
happens to sit inside a string is never coloured as a keyword: `"and"` in
`replace("and", "or")` stays green.
"""
import html

KEYWORDS = ('for', 'in', 'if', 'elif', 'else', 'while', 'and', 'or', 'not',
            'True', 'False', 'break', 'continue', 'pass')
CALLS = ('print', 'input', 'len', 'int', 'str', 'range', 'upper', 'ord', 'chr', 'help')


def paint(line):
    """The keywords in red, the calls in blue, the strings in green."""
    out, i = "", 0
    while i < len(line):
        c = line[i]
        if c == '"':
            j = line.find('"', i + 1)
            j = len(line) if j < 0 else j + 1
            out += f'<em>{html.escape(line[i:j])}</em>'
            i = j
            continue
        if c.isalpha() or c == '_':
            j = i
            while j < len(line) and (line[j].isalnum() or line[j] == '_'):
                j += 1
            w = line[i:j]
            if w in KEYWORDS:
                out += f'<b>{w}</b>'
            elif w in CALLS:
                out += f'<i>{w}</i>'
            else:
                out += html.escape(w)
            i = j
            continue
        out += html.escape(c)
        i += 1
    return out


def card(src, tab, hi=(), dead=()):
    """The card itself. `hi` marks the lines to point at, `dead` the lines that
    never ran."""
    lines = src.rstrip("\n").split("\n")
    body = ""
    for i, ln in enumerate(lines, 1):
        cls = " hot" if i in hi else (" dead" if i in dead else "")
        body += (f'<span class="ln{cls}"><span class="no">{i}</span>'
                 f'{paint(ln)}</span>')
    return (f'<div class="edcard"><div class="edtab">'
            f'<span class="eddot" aria-hidden="true"></span>'
            f'{html.escape(tab)}</div>'
            f'<pre class="cx">{body}</pre></div>')
