"""Run every program the plan makes a claim about, and print what it actually does."""
import io, contextlib

def run(src, inp, cap=12):
    """Execute src with input() fed from inp; stop after `cap` printed lines (infinite-loop guard)."""
    lines = []
    class Stop(Exception): pass
    def fake_print(*a, **k):
        lines.append(' '.join(str(x) for x in a))
        if len(lines) >= cap: raise Stop
    feed = iter(inp)
    try:
        exec(src, {'input': lambda *a: next(feed), 'print': fake_print})
        status = 'ended'
    except Stop:
        status = f'STILL RUNNING after {cap} prints'
    except Exception as e:
        status = f'{type(e).__name__}: {e}'
    return lines, status

P = 'a = int(input())\ncounter = 0\nwhile counter < 3:\n    a = a + 1\n    print(a)\n    counter = counter + 1\nprint("End")\n'
cases = {
 'poll Q1': ('marks = 85\nif marks >= 91:\n    print("A")\nelif marks >= 81:\n    print("B")\nelif marks >= 71:\n    print("C")\n', []),
 'poll Q2': ('a = 5\nif a > 3:\n    print("X")\nif a > 1:\n    print("Y")\n', []),
 'poll Q3': ('marks = 55\nif marks >= 61:\n    print("D")\nelse:\n    print("F")\nelif marks >= 51:\n    print("E")\n', []),
 'discover 3 lines, in 5': ('a = int(input())\na = a + 1\nprint(a)\na = a + 1\nprint(a)\na = a + 1\nprint(a)\n', ['5']),
 'main program, in 5': (P, ['5']),
 'main program, in 1': (P, ['1']),
 'vote opt2 <= 3': (P.replace('< 3', '<= 3'), ['5']),
 'vote opt3 == 3': (P.replace('< 3', '== 3'), ['5']),
 'vote opt4 < 4': (P.replace('< 4' if False else '< 3', '< 4'), ['5']),
 'break 1: no line 6, in 5': (P.replace('    counter = counter + 1\n', ''), ['5']),
 'break 2: counter = 1, in 1': (P.replace('counter = 0', 'counter = 1'), ['1']),
 'exit E3: counter < 0, in 5': (P.replace('< 3', '< 0'), ['5']),
 'square 4': ('n = int(input())\ncounter = 0\nwhile counter < n:\n    print("* " * n)\n    counter = counter + 1\n', ['4']),
 'square 5': ('n = int(input())\ncounter = 0\nwhile counter < n:\n    print("* " * n)\n    counter = counter + 1\n', ['5']),
 'square 1': ('n = int(input())\ncounter = 0\nwhile counter < n:\n    print("* " * n)\n    counter = counter + 1\n', ['1']),
 'square 0': ('n = int(input())\ncounter = 0\nwhile counter < n:\n    print("* " * n)\n    counter = counter + 1\n', ['0']),
 'square bug <= n, 4': ('n = int(input())\ncounter = 0\nwhile counter <= n:\n    print("* " * n)\n    counter = counter + 1\n', ['4']),
 'square bug no space, 4': ('n = int(input())\ncounter = 0\nwhile counter < n:\n    print("*" * n)\n    counter = counter + 1\n', ['4']),
}
for name, (src, inp) in cases.items():
    lines, status = run(src, inp)
    print(f'{name:28s} -> {lines!r}  [{status}]')

# trace row count and ask count for the main program with input 5
asks = 0; rows = 2; counter = 0; a = 5
while True:
    asks += 1; rows += 1
    if not counter < 3: break
    a += 1; rows += 3; counter += 1
rows += 1
print(f'\ntrace: rows={rows} asks={asks}')
