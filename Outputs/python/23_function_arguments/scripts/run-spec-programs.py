"""Run every program in the session spec that carries an output, with its input,
and compare what CPython prints with the spec's output (course rule R3).
    python3 scripts/run-spec-programs.py "../../../Reference ppt's/23_function_arguments_session_spec.json"

The spec keeps Python 3.11's SyntaxError wording on purpose (its defect note on
slides 40, 41: the playground prints the old text). On 3.12 and newer the same
error reads `parameter without a default follows parameter with a default`, so
those two programs are compared on the error's NAME and reported as `old wording`.
"""
import json, subprocess, sys

spec = json.load(open(sys.argv[1]))
ok = bad = old = 0
OLD = 'SyntaxError: non-default argument follows default argument'

def run(src, inp):
    r = subprocess.run([sys.executable, '-c', src], input=inp, capture_output=True, text=True)
    out = r.stdout.rstrip('\n')
    if r.returncode:
        last = r.stderr.strip().splitlines()[-1]
        out = (out + '\n' + last).strip('\n')
    return out or '(nothing)'

def check(label, src, inp, want):
    global ok, bad, old
    got = run(src, (inp or '') + '\n')
    want = want.rstrip('\n')
    if got == want:
        ok += 1
    elif want == OLD and got.startswith('SyntaxError') and 'default' in got and '\n' not in got:
        old += 1
        print('old wording', label, repr(got))
    else:
        bad += 1
        print('MISMATCH', label, repr(got), '!=', repr(want))

for b in spec['beats']:
    for c in b['cards']:
        for k in c.get('code', []):
            if 'output' in k:
                check(f"{c['id']} {k['file']}", k['src'], k.get('input'), k['output'])
        if c['id'] == 'S-RECAP':
            for i, ch in enumerate(c['data']['chips']):
                check(f'S-RECAP chip {i+1}', ch['code'], '', ch['prints'])
        if c['id'] == 'H1':
            check('H1 guide', c['data']['code_for_guide'], '', '\n'.join(c['data']['code_output_for_guide']))
        if c['id'] == 'G1':
            for i, r in enumerate(c['data']['rounds']):
                last = r['steps'][-1]
                got = run(r['program'], '\n')
                want = last['caption'].split(': ', 1)[1].split(' The app')[0].split('. Python stops')[0] if 'Error' in last['caption'] else None
                print(f'G1 round {i+1}:', repr(got))
                fixed = '\n'.join(l if not (l.startswith(('directions(', 'def directions'))) or l.split('(')[0] != r['fix'].split('(')[0] else r['fix'] for l in r['program'].split('\n'))
                print(f'G1 round {i+1} fixed:', repr(run(fixed, '\n')))
        if c['id'] == 'X1':
            base = c['code'][0]['src']
            for o in c['data']['options']:
                check(f"X1 {o['call']}", base + o['call'], '', o['shows'])
print(ok, 'match,', old, 'old wording,', bad, 'mismatch')
