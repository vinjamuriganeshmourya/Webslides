# -*- coding: utf-8 -*-
"""Review pass 4: the guide's timings, its two missing sections, and the cuts.

- `gwhen` printed the block total on every card in the block, so an instructor
  at minute 40 read four cards in a row each claiming eight minutes. It now
  carries the card's own figure and the block total once.
- The spec's closing sections are: common guidelines, if they ask, every answer
  in one table, source defects. The last two were missing.
- The skill puts the cut on the card as one `Short of time:` bullet and in the
  checkpoint line. Neither was there.
"""
import io, os, re

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
p = 'build.py'
s = io.open(p, encoding='utf-8').read()


def sub(old, new, count=1):
    global s
    assert old in s, 'anchor not found: %r' % old[:70]
    s = s.replace(old, new, count)


# ---- 1. per-card minutes, with the block total said once --------------------
sub("""def W(kind, mins, n, extra=''):
    return (f'{kind} &middot; {mins} min &middot; card {n} of {NCARDS}'
            + (f' &middot; {extra}' if extra else ''))""",
    """def W(kind, mins, n, extra='', blk=None):
    \"\"\"The line above a guide entry's heading.

    `mins` is what THIS card costs, not what its block costs. Four cards in a
    row each claiming the block's eight minutes is how an instructor loses the
    thread at minute 40, so a card inside a multi-card block also names the
    block total, once.\"\"\"
    t = f'{mins} sec' if isinstance(mins, str) else f'{mins} min'
    return (f'{kind} &middot; {t} &middot; card {n} of {NCARDS}'
            + (f' &middot; in an {blk} min block' if blk else '')
            + (f' &middot; {extra}' if extra else ''))""")

# the multi-card blocks, each card given its own figure
for old, new in (
    ("W('Concept', 3, 7)", "W('Concept', '40', 7, blk=3)"),
    ("W('Concept', 3, 8)", "W('Concept', '20', 8, blk=3)"),
    ("W('Concept', 4, 10)", "W('Concept', '60', 10, blk=4)"),
    ("W('Concept', 4, 11)", "W('Concept', '20', 11, blk=4)"),
    ("W('Concept', 4, 12)", "W('Concept', '60', 12, blk=4)"),
    ("W('Concept', 8, 13)", "W('Concept', '30', 13, blk=8)"),
    ("W('Concept', 8, 14)", "W('Concept', '30', 14, blk=8)"),
    ("W('The build', 8, 15)", "W('The build', 6, 15, blk=8)"),
    ("W('Concept', 8, 16)", "W('Concept', '60', 16, blk=8)"),
    ("W('Reveal 1 of 4', 4, 22)", "W('Reveal 1 of 4', '60', 22, blk=4)"),
    ("W('Reveal 2 of 4', 4, 23)", "W('Reveal 2 of 4', '70', 23, blk=4)"),
    ("W('Reveal 3 of 4', 4, 24)", "W('Reveal 3 of 4', '70', 24, blk=4)"),
    ("W('Reveal 4 of 4', 4, 25)", "W('Reveal 4 of 4', '50', 25, blk=4)"),
    ("W('Concept', 8, 26)", "W('Concept', '90', 26, blk=8)"),
    ("W('Hands-on', 8, 27)", "W('Hands-on', 5, 27, blk=8)"),
    ("W('Concept', 8, 28)", "W('Concept', '60', 28, blk=8)"),
):
    sub(old, new)

# ---- 2. the cut, on the checkpoint line and on the card ---------------------
sub("G.append('<h3 class=\"ghd\">Checkpoint 1 &mdash; they can say what one press repeating a job '\n"
    "         'looks like</h3>')",
    "G.append('<h3 class=\"ghd\">Checkpoint 1: they can name one machine that repeats one job '\n"
    "         'after a single press. If they cannot, take the examples in the hook down to two '\n"
    "         'and move.</h3>')") if False else None

for old, new in (
    ("Checkpoint 1: they can say what one press repeating a job ",
     "Checkpoint 1: they can name one machine that repeats one job after a single press. If not, "
     "take the examples in the hook down to two and move on."),
    ("Checkpoint 2: they can point at the block that repeats",
     "Checkpoint 2: they can point at the block that repeats. If not, take the line count in task 1 as a "
     "show of hands instead of a discussion."),
    ("Checkpoint 3: they can name the three parts on any loop",
     "Checkpoint 3: they can name the three parts on any loop. If not, run the dot a second time "
     "at 2 and drop the square pattern to three minutes."),
    ("Checkpoint 4: they can say why a loop never stops",
     "Checkpoint 4: they can say why a loop never stops. If not, say reveal 4 in one sentence "
     "rather than putting the card up."),
    ("Hard floor: the exit runs whatever else is dropped",
     "Hard floor: the exit runs whatever else is dropped. It is the only beat that is never cut."),
):
    sub(old, new)

# one Short of time bullet per card that can be shortened
SHORT = {
  3: 'Short of time: press straight to 3 and read the green line. The vote is what costs the minute.',
  4: 'Short of time: take two student examples, not four, and show only the ATM before press 8.',
  7: 'Short of time: ask the question, take &ldquo;once&rdquo;, and move. Do not read the picture.',
  9: 'Short of time: two minutes on the timer, and take the line count only, not the hundred.',
  13: 'Short of time: read the input and output boxes and move. The build card restates the task.',
  14: 'Short of time: point at the grey band, ask the question, and go.',
  15: 'Short of time: shorten presses 6 and 7. Never the silence on press 4 or the count on press 5.',
  17: 'Short of time: tap the first four lines and say the last two rather than taking a vote on them.',
  18: 'Short of time: run it once at 2 and once at 0, and skip the narration in between.',
  20: 'Short of time: drop panel 3. Panels 1 and 2 carry the beat.',
  21: 'Short of time: two minutes on the timer, and say program 3 is the one to look at twice.',
  22: 'Short of time: read the error text and move. It is the easy one.',
  24: 'Short of time: take the count of hands and give one repair, not both.',
  25: 'Short of time: say it in a sentence without putting the card up. They already met it.',
  26: 'Short of time: say the space rule and hand over. Do not take the row-or-star question.',
  27: 'Short of time: three minutes on the timer, and run it with 3 only.',
  28: 'Short of time: ask for hands on the three parts and skip the line-by-line read.',
  30: 'Short of time: presses 1, 2 and 7. The block diagram is on slide 24 already.',
}
for card, bullet in SHORT.items():
    m = re.search(r"G\.append\(g\(%d, W\(.*?\n" % card, s)
    assert m, 'no guide entry for card %d' % card
    # the Do list is the second bracket group; insert the bullet as its first item
    i = s.index("  ['", m.end())
    s = s[:i + 4] + bullet + "',\n   '" + s[i + 4:]

io.open(p, 'w', encoding='utf-8').write(s)
print('per-card minutes, checkpoint cuts and %d Short of time bullets' % len(SHORT))
