# -*- coding: utf-8 -*-
"""Every answer this plan states, recomputed from the program it came from, then
looked for in the guide. Re-reading an answer key only proves it agrees with
itself."""
import io, pathlib, sys

OUT = pathlib.Path(__file__).resolve().parent.parent.parent / 'Plans' / \
      'Programming Foundations' / '12 - Loops'
GUIDE = io.open(OUT / '12_loops_instructor_guide.html', encoding='utf-8').read()
SHEET = io.open(OUT / '12_loops_student_handout.html', encoding='utf-8').read()
VIEW = io.open(OUT / '12_loops_student_view.html', encoding='utf-8').read()

fails = []


def ck(ok, what, detail=''):
    print(('  ok   ' if ok else ' FAIL  ') + what + ('' if ok else '  ' + detail))
    if not ok:
        fails.append(what)


def run(src, inp):
    """Run a program with one line of input, return (printed lines, error text)."""
    out = []
    it = iter(inp)
    g = {'input': lambda *a: next(it), 'print': lambda *a: out.append(
        ' '.join(str(x) for x in a))}
    try:
        exec(src, g)
    except Exception as e:
        return out, type(e).__name__ + ': ' + str(e)
    return out, None


# ---- the recap, session 11 --------------------------------------------------
src = 'marks = 30\nif marks >= 35:\n    if marks >= 60:\n        print("First class")\nprint("Pass")'
out, err = run(src, [])
ck(out == ['Pass'] and err is None, 'recap: the program prints Pass', str(out))
ck('Pass' in GUIDE, 'recap: the guide names what it prints')
# and the version with line 5 indented prints nothing
src2 = src.replace('\nprint("Pass")', '\n    print("Pass")')
out2, _ = run(src2, [])
ck(out2 == [], 'recap: indented, it prints nothing', str(out2))

# ---- the build card ---------------------------------------------------------
asked = passes = 0
counter, a = 0, 5
while True:
    asked += 1
    if not counter < 3:
        break
    passes += 1
    a += 1
    counter += 1
ck(asked == 4, 'build card: the condition is asked four times', str(asked))
ck(passes == 3, 'build card: the body runs three times', str(passes))
out, err = run('a = int(input())\ncounter = 0\nwhile counter < 3:\n    a = a + 1\n'
               '    print(a)\n    counter = counter + 1\nprint("End")', ['5'])
ck(out == ['6', '7', '8', 'End'], 'build card: input 5 gives 6, 7, 8, End', str(out))
ck('6, 7, 8, End' in GUIDE, 'build card: the guide states that output')
ck('four' in GUIDE and 'asked' in GUIDE, 'build card: the guide states the four')

# ---- worksheet task 1 -------------------------------------------------------
ck(1 + 2 * 10 == 21, 'task 1: ten numbers is twenty-one lines')
ck('Twenty-one lines' in GUIDE, 'task 1: the guide states twenty-one lines')
ck('21' not in SHEET.split('<body')[1], 'task 1: the sheet does not give it away')

# ---- worksheet task 2, and the classify panel -------------------------------
A = ('marks = int(input())\ncounter = 1\nwhile counter <= 5:\n    print(marks)\n'
     '    marks = marks - 2\n    counter = counter + 1\nprint("Done")')
out, err = run(A, ['10'])
ck(len(out) == 6 and out[-1] == 'Done', 'task 2: program A prints five lines then Done', str(out))
ck(len(out) - 1 == 5, 'task 2: line 4 of program A runs five times', str(len(out) - 1))
ck('line 4 runs five times' in GUIDE or 'five times' in GUIDE,
   'task 2: the guide states the five')
B = ('name = input()\nseats = 3\nwhile seats > 0:\n    print(name)\n'
     '    seats = seats - 1\nprint("Full")')
out, err = run(B, ['Asha'])
ck(out == ['Asha', 'Asha', 'Asha', 'Full'], 'task 2: program B prints three then Full', str(out))
# the panel's own key, read back out of the built file
for line, want in (('counter = 1', 'i'), ('while counter &lt;= 5:', 't'),
                   ('counter = counter + 1', 'u'), ('seats = 3', 'i'),
                   ('while seats &gt; 0:', 't'), ('seats = seats - 1', 'u')):
    tag = 'data-bin="%s"' % want
    i = VIEW.find('<code>%s</code>' % line)
    ck(i > 0 and tag in VIEW[max(0, i - 400):i], 'classify: %r is in bin %s' % (line, want))
ck('I, T or U' in SHEET, 'task 2: the sheet asks for one letter per line')
ck('data-bin' not in SHEET, 'task 2: the sheet carries no answers')

# ---- worksheet task 3, the four mistakes ------------------------------------
M1 = ('a = int(input())\nwhile counter < 3:\n    a = a + 1\n    print(a)\n'
      '    counter = counter + 1\nprint("End")')
out, err = run(M1, ['5'])
ck(err is not None and err.startswith('NameError'), 'task 3: programme 1 is a NameError', str(err))
ck("name 'counter' is not defined" in err, 'task 3: the exact error text', str(err))
ck('counter is not defined' in GUIDE, 'task 3: the guide states that error')

# programme 2 never ends; run it with a cap and prove the condition never changes
counter, cond, n = 0, (0 < 3), 0
while cond and n < 50:
    counter += 1
    n += 1
ck(n == 50 and cond is True, 'task 3: programme 2 never stops (the box stays True)')

M3 = ('a = int(input())\ncounter = 1\nwhile counter < 3:\n    a = a + 1\n    print(a)\n'
      '    counter = counter + 1\nprint("End")')
out, err = run(M3, ['1'])
ck(out == ['2', '3', 'End'], 'task 3: programme 3 prints two numbers, not three', str(out))
ck('two passes' in GUIDE or 'two came out' in GUIDE, 'task 3: the guide states the two')

# programme 4, the one they broke themselves: no updation, so it never stops
counter, n = 0, 0
while counter < 3 and n < 50:
    n += 1
ck(n == 50, 'the break-it beat: with no updation the loop never stops')

# ---- the explainer ----------------------------------------------------------
out, err = run('a = 5\ncounter = 0\nwhile counter < 2:\n    a = a + 1\n    print(a)\n'
               '    counter = counter + 1\nprint("End")', [])
ck(out == ['6', '7', 'End'], 'the dot at 2 prints 6, 7, End', str(out))
out, err = run('a = 5\ncounter = 0\nwhile counter < 0:\n    a = a + 1\n    print(a)\n'
               '    counter = counter + 1\nprint("End")', [])
ck(out == ['End'], 'the dot at 0 prints End and nothing else', str(out))

# ---- the square pattern -----------------------------------------------------
out, err = run('n = int(input())\ncounter = 0\nwhile counter < n:\n    print("* " * n)\n'
               '    counter = counter + 1', ['3'])
ck(out == ['* * * '] * 3, 'square pattern: n = 3 gives three rows of three', str(out))

# ---- the exit question ------------------------------------------------------
out, err = run('a = input()\ncounter = 0\nlength_of_a = len(a)\n'
               'while counter < (length_of_a - 1):\n    print(a[counter])\n'
               '    counter = counter + 1', ['R'])
ck(out == [] and err is None, 'exit: a single letter prints nothing at all', str(out) + str(err))
out, err = run('a = input()\ncounter = 0\nlength_of_a = len(a)\n'
               'while counter < (length_of_a - 1):\n    print(a[counter])\n'
               '    counter = counter + 1', ['Ravi'])
ck(out == ['R', 'a', 'v'], 'exit: a four letter name prints its first three', str(out))
ck('nothing at all' in GUIDE, 'exit: the guide states the answer')

# ---- no answer leaks onto the sheet -----------------------------------------
for leak in ('NameError', 'never stops', 'infinite', 'Initialization &mdash; line'):
    ck(leak not in SHEET, 'the worksheet does not leak %r' % leak)

print()
print('%d checks, %d failed' % (len(fails) + 0, len(fails)))
sys.exit(1 if fails else 0)
