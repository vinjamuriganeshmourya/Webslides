# -*- coding: utf-8 -*-
"""Part 4: the worksheet name, the assemble step, and the session CSS."""
import io

p = 'build.py'
s = io.open(p, encoding='utf-8').read()


def sub(old, new, n=1):
    global s
    assert old in s, 'anchor not found: %r' % old[:70]
    s = s.replace(old, new, n)


# ------------------------------------------------------- the three file names
sub("WS_FILENAME = '12 - Loops_student_handout.html'",
    "FILES = file_names(SESSION)      # 12_loops_student_view.html and its two siblings\n"
    "WS_FILENAME = FILES['student_handout']")

# --------------------------------------------------------- the assemble step
start = s.index('import base64, pathlib, subprocess')
end = s.index("# ---- 2. the pictures, from the presenter this run just wrote")
sub(s[start:end], """import subprocess

OUTDIR = (pathlib.Path(sys.argv[sys.argv.index('-o') + 1]) if '-o' in sys.argv
          else pathlib.Path(HERE).parent.parent / 'Plans' / 'Programming Foundations' / SESSION)
OUTDIR.mkdir(parents=True, exist_ok=True)
PRESENTER = FILES['student_view']
GUIDE = FILES['instructor_guide']
WORKSHEET_FILE = FILES['student_handout']

# ---- 1. the presenter -----------------------------------------------------
tpl = R('plan-template.html')

# Every repair this builder used to apply at build time is now fixed in the
# skill's own assets/plan-template.html (see assets/repair_template_v3_2.py).
# These asserts are the receipt: if a template regresses the build stops here,
# rather than shipping a plan whose confetti never fires.
assert tpl.count('</style>') == 1, 'the stray </style> splice is back'
assert tpl.count('id="env-warn"') == 1, 'the duplicate sidebar is back'
assert 'var calm' in tpl, 'the reduced-motion flag is missing again'
assert '#confetti{position:fixed' in tpl, 'the #confetti rule is missing again'
assert 'hkGo' not in tpl, "session 11's hook controller is back"
assert 'willShow' in tpl, 'the reveal handler reads the pre-press state again'
assert '.partmap' in tpl and '.exgrid' in tpl and '.titlecard' in tpl, \\
    'the shared staged-card CSS is missing from the template'
assert '{{GUIDE}}' not in tpl and '{{HANDOUT}}' not in tpl, \\
    'this template still expects the guide and the worksheet inside it'

presenter = (tpl.replace('{{SESSION_TITLE}}', 'Loops &mdash; Session 12')
                .replace('{{EXTRA_CSS}}', EXTRA_CSS + SPINE_CSS)
                .replace('{{EXTRA_JS}}', EXTRA_JS + SPINE_JS)
                .replace('{{ONE_IDEA}}', ONE_IDEA)
                .replace('{{NAV}}', nav)
                .replace('{{BLOCKS}}', blocks))
assert '{{' not in presenter, 'unfilled placeholder in the presenter'
assert presenter.count('<div class="slide"') + presenter.count('<div class="pcard"') == NCARDS, \\
    'card count is not %d' % NCARDS
p_path = OUTDIR / PRESENTER
p_path.write_text(presenter, encoding='utf-8')

""")

sub("""SHOTS = sorted(THUMBS.glob('card*.webp'))""",
    """SHOTS = sorted(THUMBS.glob('card*.webp'))""")

io.open(p, 'w', encoding='utf-8').write(s)
print('part 4 applied')
