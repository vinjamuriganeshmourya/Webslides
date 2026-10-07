"""Run every program in the session spec that carries an output, with its input,
and compare what CPython prints with the spec's output (course rule R3).
    python3 scripts/run-spec-programs.py "../../../Reference ppt's/22_functions_session_spec.json"
"""
import json, subprocess, sys

spec = json.load(open(sys.argv[1]))
ok = bad = 0

def run(src, inp):
    r = subprocess.run([sys.executable, '-c', src], input=inp, capture_output=True, text=True)
    out = r.stdout.rstrip('\n')
    if r.returncode:
        last = r.stderr.strip().splitlines()[-1]
        out = (out + '\n' + last).strip('\n')
    return out or '(nothing)'

def check(label, src, inp, want):
    global ok, bad
    got = run(src, (inp or '') + '\n')
    if got == want.rstrip('\n'):
        ok += 1
    else:
        bad += 1
        print('MISMATCH', label, repr(got), '!=', repr(want))

for b in spec['beats']:
    for c in b['cards']:
        for k in c.get('code', []):
            if 'output' in k:
                check(f"{c['id']} {k['file']}", k['src'], k.get('input'), k['output'])
        if c['id'] == 'G1':
            for i, r in enumerate(c['data']['rounds']):
                want = r['answer'].replace('NameError', "NameError: name 'cheer' is not defined")
                check(f'G1 round {i+1}', r['program'], '', want)
        if c['id'] == 'X1':
            base = c['code'][0]['src'].replace('# line 8 goes here', '')
            for o in c['data']['options']:
                check(f"X1 {o['line8']}", base + o['line8'], '', o['shows'])
        if c['id'] == 'T2':
            src = c['code'][1]['src'].replace('letters * 5', 'letters * 7')
            check('T2 at 7', src, c['code'][1]['input'], '\n'.join(c['data']['outputs_at_7']))
print(ok, 'match,', bad, 'mismatch')
