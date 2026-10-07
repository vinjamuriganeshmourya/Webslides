# -*- coding: utf-8 -*-
"""Review pass 1: the hook opened on its own answer.

`.hgroup` (the column of forty make-one-copy jobs) and `.houter` had no gating,
so press 1 printed the question "what is going on inside it, forty times over?"
directly above the column that answers it. The card now opens on the shop alone
and the column arrives on press 2, which is what the guide's thread already
assumed. Eight presses, not seven.
"""
import io, os

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# ----------------------------------------------------------------- the CSS
p = 'parts/extra.css'
s = io.open(p, encoding='utf-8').read()


def sub(old, new, f=p):
    global s
    assert old in s, 'anchor not found in %s: %r' % (f, old[:60])
    s = s.replace(old, new, 1)


sub(""".hmorph .hgroup{transform-box:view-box;transform-origin:0 0;
 transition:transform var(--dur-morph) var(--ease-out)}
.an-7 .hmorph .hgroup{transform:translate(0px,218.6px) scale(1,.0592)}

.hmorph .houter{opacity:1;filter:blur(0);
 transition:opacity var(--dur-base) var(--ease-out),filter var(--dur-base) var(--ease-out)}
.an-7 .hmorph .houter{opacity:0;filter:blur(4px)}

.hmorph .hcode,.hmorph .hcap{opacity:0;filter:blur(4px);
 transition:opacity var(--dur-base) var(--ease-out),filter var(--dur-base) var(--ease-out)}
.an-7 .hmorph .hcode,.an-7 .hmorph .hcap{opacity:1;filter:blur(0);transition-delay:480ms}

.hmorph .hnote{opacity:0;transition:opacity var(--dur-base) var(--ease-out)}
.an-2 .hmorph .hnote{opacity:1}""",
""".hmorph .hgroup{opacity:0;transform-box:view-box;transform-origin:0 0;
 transition:transform var(--dur-morph) var(--ease-out),
            opacity var(--dur-base) var(--ease-out)}
:is(.an-2,.an-3,.an-8) .hmorph .hgroup{opacity:1}
.an-8 .hmorph .hgroup{transform:translate(0px,218.6px) scale(1,.0592)}

.hmorph .houter{opacity:0;filter:blur(0);
 transition:opacity var(--dur-base) var(--ease-out),filter var(--dur-base) var(--ease-out)}
:is(.an-2,.an-3) .hmorph .houter{opacity:1}
.an-8 .hmorph .houter{filter:blur(4px)}

.hmorph .hcode,.hmorph .hcap{opacity:0;filter:blur(4px);
 transition:opacity var(--dur-base) var(--ease-out),filter var(--dur-base) var(--ease-out)}
.an-8 .hmorph .hcode,.an-8 .hmorph .hcap{opacity:1;filter:blur(0);transition-delay:480ms}

.hmorph .hnote{opacity:0;transition:opacity var(--dur-base) var(--ease-out)}
.an-3 .hmorph .hnote{opacity:1}""")

sub(""":is(.an-3,.an-4,.an-5,.an-6) .hkfig{display:none}
:is(.an-3,.an-4,.an-5,.an-6) .hkyt{display:block}""",
    """:is(.an-4,.an-5,.an-6,.an-7) .hkfig{display:none}
:is(.an-4,.an-5,.an-6,.an-7) .hkyt{display:block}""")

# the examples are ghosts from the moment the question arrives, so the room can
# see there are three of them before any lands
sub(""".exg2 .ex b{display:block;font-size:1.06em;color:var(--dk-blue);margin:0 0 6px}
.exg2 .ex span{display:block;color:var(--dk-text)}
.exg2 .ex em{font-style:normal;font-weight:650;color:var(--dk-red)}
.an-4 .exg2 .ex:nth-child(-n+1),.an-5 .exg2 .ex:nth-child(-n+2),
.an-6 .exg2 .ex:nth-child(-n+3){opacity:1;transform:none}""",
    """.exg2 .ex{opacity:.16;transform:none;border-style:dashed}
.exg2 .ex > *{opacity:0;transition:opacity var(--dur-base) var(--ease-out)}
.exg2 .ex b{display:block;font-size:1.06em;color:var(--dk-blue);margin:0 0 6px}
.exg2 .ex span{display:block;color:var(--dk-text)}
.exg2 .ex em{font-style:normal;font-weight:650;color:var(--dk-red)}
.an-5 .exg2 .ex:nth-child(-n+1),.an-6 .exg2 .ex:nth-child(-n+2),
.an-7 .exg2 .ex:nth-child(-n+3){opacity:1;border-style:solid}
.an-5 .exg2 .ex:nth-child(-n+1) > *,.an-6 .exg2 .ex:nth-child(-n+2) > *,
.an-7 .exg2 .ex:nth-child(-n+3) > *{opacity:1}""")

sub("""  .hmorph .hgroup{transform:translate(0px,218.6px) scale(1,.0592) !important}""",
    """  .hmorph .hgroup{transform:translate(0px,218.6px) scale(1,.0592) !important;opacity:1}""")
sub("""  .exg2 .ex,.agroute > g{opacity:1;transform:none}""",
    """  .exg2 .ex,.agroute > g{opacity:1;transform:none}
  .exg2 .ex > *{opacity:1}""")

io.open(p, 'w', encoding='utf-8').write(s)

# --------------------------------------------------------------- the builder
p = 'build.py'
s = io.open(p, encoding='utf-8').read()

sub("""  '<div class="stage" id="stage-hook-turn" data-anim="7" '
  'data-anim-labels="inside the machine|one job, forty times|where else have you seen this?'
  '|the ATM|the attendance SMS|the lift|one line, forty copies">'""",
    """  '<div class="stage" id="stage-hook-turn" data-anim="8" '
  'data-anim-labels="the shop|inside the machine|one job, forty times'
  '|where else have you seen this?|the ATM|the attendance SMS|the lift'
  '|one line, forty copies">'""", 'build.py')

# the guide's thread, renumbered against the eight presses
sub("""  '<b>Press 1 and 2.</b> The column of forty jobs, then the note: &ldquo;one job, forty times '
  'over. That is all the machine is doing.&rdquo;',
  '<b>Press 3.</b> The machine goes and the question changes: where else have you seen this? Then '
  '<em>stop talking</em>. Nudge instead: &ldquo;anything on this campus with a button on it.&rdquo;',""",
    """'<b>Press 2.</b> Only now does the column of forty jobs appear inside the machine. Let them '
  'look at it: &ldquo;forty of them. One for every copy.&rdquo;',
  '<b>Press 3.</b> The note: &ldquo;one job, forty times over. That is all the machine is '
  'doing.&rdquo; Ask before you move on: &ldquo;and if he had typed four hundred?&rdquo; Wait for '
  'the groan.',
  '<b>Press 4.</b> The machine goes and the question changes: where else have you seen this? Then '
  '<em>stop talking</em>. Nudge instead: &ldquo;anything on this campus with a button on it.&rdquo;',""",
    'build.py')

sub("""  '<b>Presses 4, 5, 6.</b> One of ours per press, only after theirs. Tie each to whichever student '
  'answer it matches.',
  '<b>Press 7.</b> Back to the machine, and the column collapses onto one line. Say nothing at all '
  'while it moves. Then: &ldquo;one instruction, written once. Forty copies still come out.&rdquo;',""",
    """  '<b>Presses 5, 6, 7.</b> One of ours per press, only after theirs. The three empty boxes are '
  'up from press 4, so the room can see how many are coming. Tie each to whichever student answer '
  'it matches.',
  '<b>Press 8.</b> Back to the machine, and the column collapses onto one line. Say nothing at all '
  'while it moves. Then: &ldquo;one instruction, written once. Forty copies still come out.&rdquo;',""",
    'build.py')

sub("""  ['Seven presses. Arrow keys step it in presenter view; Replay puts it back to press 1.',""",
    """  ['Eight presses. Arrow keys step it in presenter view; Replay puts it back to press 1.',
   'Press 1 is the shop and the question, and nothing inside the machine. Do not press on until '
   'you have taken two or three answers: press 2 is the answer to what you just asked.',""",
    'build.py')

sub("""  'Start from something all of them have done: &ldquo;the xerox shop outside the gate. You hand '
  'over one form and say forty copies.&rdquo;',""",
    """  '<b>Press 1</b> is up: the shop, and nothing inside the machine yet. Start from something all '
  'of them have done: &ldquo;the xerox shop outside the gate. You hand over one form and say '
  'forty copies.&rdquo;',""", 'build.py')

io.open(p, 'w', encoding='utf-8').write(s)
print('review pass 1 applied: the hook opens on the question, not the answer')
