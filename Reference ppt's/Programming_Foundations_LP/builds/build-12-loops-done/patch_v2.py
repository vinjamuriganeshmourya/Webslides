"""One-shot patch: v1 -> v2 of the session 12 builder (restore slides 9,11,12,13; poll fit; hook order)."""
import re, shutil
from pathlib import Path

HERE = Path(__file__).parent
shutil.copy(HERE / 'build.py', HERE / 'build.v1.py')
shutil.copy(HERE / 'hook_svg.txt', HERE / 'hook_svg.v1.txt')

p = HERE / 'build.py'
s = p.read_text(encoding='utf8')
S = r'C:\Users\Nxtwave\AppData\Local\Temp\claude\C--Lesson-Plans-New\119caa67-cf0b-4591-9131-49d951381e46\scratchpad'
s = s.replace('SH = ROOT / "work" / "slides"', f'SH = Path(r"{S}") / "w12" / "slides"')
s = s.replace('HOOK_SVG = (ROOT / "work" / "hook_svg.txt")', 'HOOK_SVG = (ROOT / "Done" / "build-12-loops" / "hook_svg.txt")')

# renumber plan slides >= 4 by +4 (four slides come back after the agenda)
def bump(m):
    n = int(m.group(2))
    return f'{m.group(1)}{n + 4 if n >= 4 else n}'
s = re.sub(r'(\bslide\()(\d+)', bump, s)
s = re.sub(r'(\b[Ss]lides? )(\d+)', bump, s)
s = re.sub(r'(\b[Ss]lides? \d+ and )(\d+)', bump, s)

# discover block becomes panel-only; slide 14 gets its own block after the concept slides
old_head = ("discover = block('discover', '&#9889;', 'Discover it first &mdash; Slide 8 and your turn',\n"
            "    slide(8, 14, 'Example &mdash; the next 3 consecutive numbers', [\n"
            "        'Read the problem, nothing else. Do not say the word while; do not point at the eyebrow.',\n"
            "        '!Everything they need is already known: int(input()), a = a + 1, print. Say so, then go to the panel.']) +\n"
            "    pcard(")
assert s.count(old_head) == 1, s.count(old_head)
s = s.replace(old_head, "discover = block('discover', '&#9889;', 'Discover it first &mdash; your turn',\n    pcard(")
a = "'Do not show the loop yet. The next slide is their own code with the repeat marked.'"
assert s.count(a) == 1
s = s.replace(a, "'Do not show the loop yet. Four slides name the idea; then slide 8 is their own code.'")

new_blocks = """seq = block('seq', '&#128216;', 'Sequence of instructions &mdash; Slide 4',
    slide(4, 9, 'Sequence of Instructions', [
        'Every program so far, including the one they just wrote: top to bottom, each block once.',
        '!Ask: can we make a block run more than once? Take two answers, correct nobody.']))

loops = block('loops', '&#128216;', 'Loops &mdash; Slide 5',
    slide(5, 11, 'Loops', [
        'Name it. A loop runs one block several times; the orange arrow is the fold from the hook.',
        'Point at the register: the same two lines, sixty rows, one arrow.']))

twoways = block('twoways', '&#128216;', 'Two ways to loop &mdash; Slide 6',
    slide(6, 12, 'While Loop and For Loop', [
        'Two spellings, one idea. Today is while; for is next session.',
        'One line, then move on.']))

wintro = block('wintro', '&#128216;', 'While loop &mdash; the shape &mdash; Slide 7',
    slide(7, 13, 'While Loop', [
        '!Read it once as a sentence: while the condition is True, run the block. Then say the one idea: a question asked again.',
        'Same shape as if: keyword, condition, colon, indented block. The only new thing is the arrow back.',
        'Do not fill in a condition; the room will vote on one in a few minutes.']))

example = block('example', '&#128216;', 'The example &mdash; Slide 8',
    slide(8, 14, 'Example &mdash; the next 3 consecutive numbers', [
        'This is the problem they just did the long way. Input 5, output 6 7 8.',
        '!Ask: which two lines repeat? Point, do not read.']))

"""
anchor = "repeat = block('repeat',"
assert s.count(anchor) == 1
s = s.replace(anchor, new_blocks + anchor)
a = "blocks = ''.join([opening, poll, hook, agenda, discover, repeat,"
assert s.count(a) == 1
s = s.replace(a, "blocks = ''.join([opening, poll, hook, agenda, discover, seq, loops, twoways, wintro, example, repeat,")

# checkpoints and durations (+4 for the new slides, -4 from paper-marking, authoring and close)
pairs = [
    ("('Checkpoint 1 &middot; 14 min',", "('Checkpoint 1 &middot; 18 min',"),
    ("                                   ('discover','k-activity',5,'Discover &middot; N numbers')]),",
     "                                   ('discover','k-activity',4,'Discover &middot; N numbers'),\n"
     "                                   ('seq','k-concept',1,'Sequence &middot; runs once'),\n"
     "                                   ('loops','k-concept',1,'Loops &middot; runs again'),\n"
     "                                   ('twoways','k-concept',1,'Two ways to loop'),\n"
     "                                   ('wintro','k-concept',1,'While &middot; the shape'),\n"
     "                                   ('example','k-concept',1,'The example')]),"),
    ("Checkpoint 2 &middot; 30 min", "Checkpoint 2 &middot; 33 min"),
    ("Checkpoint 3 &middot; 41 min", "Checkpoint 3 &middot; 44 min"),
    ("Checkpoint 4 &middot; 51 min", "Checkpoint 4 &middot; 54 min"),
    ("Checkpoint 5 &middot; 64 min", "Checkpoint 5 &middot; 65 min"),
    ("Hard floor &middot; 66 min", "Hard floor &middot; 67 min"),
    ("('generic','k-activity',3,", "('generic','k-activity',2,"),
    ("('author','k-hands',9,", "('author','k-hands',7,"),
    ("('close','k-buffer',3,", "('close','k-buffer',2,"),
]
for a, b in pairs:
    assert s.count(a) == 1, a
    s = s.replace(a, b)

# poll / vote panels: tighter type in presenter view so seven-line code + four options + answer fit the 16:9 box
css_anchor = "body.present .stage-ctl{flex:none;margin-top:12px}"
css_add = css_anchor + """
body.present #stage-poll pre.slabcode,body.present #stage-vote pre.slabcode{font-size:clamp(14px,1.3vw,22px);line-height:1.5;padding:clamp(8px,1.2vh,16px) clamp(14px,1.6vw,26px)}
body.present #stage-poll .stage-q,body.present #stage-vote .stage-q{margin-bottom:8px}
body.present #stage-poll .vopts,body.present #stage-vote .vopts{font-size:clamp(15px,1.5vw,22px)}
body.present #stage-poll .vopts li,body.present #stage-vote .vopts li{margin-bottom:clamp(2px,.5vh,8px)}
body.present #stage-poll .ans,body.present #stage-vote .ans{font-size:clamp(14px,1.3vw,20px);padding:8px 14px;margin-top:8px}
body.present #stage-poll .stage-ctl,body.present #stage-vote .stage-ctl{margin-top:8px}"""
a = "tpl = swap(tpl, 'transform:translate(160px,117.5px)"
assert s.count(a) == 1
s = s.replace(a, "tpl = swap(tpl, " + repr(css_anchor) + ", " + repr(css_add) + ")\n" + a)
p.write_text(s, encoding='utf8')

# hook svg: Roll 60 row moves up, the "Roll 61? Nobody. Stop." pill goes below it
hp = HERE / 'hook_svg.txt'
h = hp.read_text(encoding='utf8')
for a, b in [
    ('<rect x="340" y="390" width="620" height="56" rx="10"/>', '<rect x="340" y="372" width="620" height="56" rx="10"/>'),
    ('<text x="650" y="374" text-anchor="middle" style="font:700 30px var(--sans)" fill="#B9BDC4">&#8942;</text>',
     '<text x="650" y="358" text-anchor="middle" style="font:700 30px var(--sans)" fill="#B9BDC4">&#8942;</text>'),
    ('<rect x="700" y="352" width="256" height="34" rx="8" fill="var(--dk-red)"/>', '<rect x="700" y="436" width="256" height="34" rx="8" fill="var(--dk-red)"/>'),
    ('<text x="828" y="376" text-anchor="middle"', '<text x="828" y="460" text-anchor="middle"'),
]:
    assert h.count(a) == 1, a
    h = h.replace(a, b)
assert h.count(' y="426"') == 4
h = h.replace(' y="426"', ' y="408"')
hp.write_text(h, encoding='utf8')
print('patched')
