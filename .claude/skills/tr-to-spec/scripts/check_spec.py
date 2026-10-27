#!/usr/bin/env python3
"""Check a session spec against the TR doc it was written from.

    python3 -I check_spec.py <session_plans/<session>/>

Reads spec.json, spec.html and tr.docx from that folder. Prints one line per check and
exits 1 if any fails. A spec is not handed to a PDA until this prints CLEAN.

What it holds the spec to:
  shape     the keys the deck tools read (beats[].cards[], id, press_count)
  presses   press_count equals the presses listed; ids are unique
  no-voice  no say / room / notes / script field anywhere: speaker notes are
            never slide content, and an instructor script is not ours to write
  leak      no run of 8 words from any speaker note appears in the spec
  coverage  every TR line, table cell, analogy, visual guidance, recap,
            agenda and takeaway item appears in a card's copy fields (kicker,
            heading, lead, show, table, code, analogy, visual_guidance), after the edits
            the spec itself declares in meta.tr_edits
  slides    every TR slide, and every unnumbered block the TR heads like
            one (tr:extra <k>), is the source of at least one card
  images    every TR image is embedded in spec.json exactly as in the TR,
            and placed on a card or listed as not used; spec.html exists
  dashes    no em dash or spaced en dash anywhere
  spine     welcome, recap, agenda, quiz, takeaways, thank you, all the best
"""
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from extract_tr import read_tr  # noqa: E402

FORBIDDEN = {'say', 'room', 'notes', 'speaker_notes', 'speaker', 'script', 'talking_points'}
COPY = ('kicker', 'heading', 'lead', 'show', 'table', 'code', 'analogy', 'visual_guidance')
SPINE = ['spine:welcome', 'tr:recap', 'tr:agenda', 'spine:quiz', 'tr:takeaways',
         'spine:thank-you', 'spine:all-the-best']


def norm(s):
    s = s.lower().replace('’', "'").replace('&', ' and ')
    s = re.sub(r'[—–\-/]', ' ', s)
    s = re.sub(r"[^a-z0-9%~+$ ]", ' ', s)
    return re.sub(r'\s+', ' ', s).strip()


def strings(o, path=''):
    """Every string in the spec, with the key path it sits under."""
    if isinstance(o, str):
        if not o.startswith('data:'):    # an embedded image is not text
            yield path, o
    elif isinstance(o, dict):
        for k, v in o.items():
            yield from strings(v, f'{path}.{k}')
    elif isinstance(o, list):
        for i, v in enumerate(o):
            yield from strings(v, f'{path}[{i}]')


def keys(o, path=''):
    if isinstance(o, dict):
        for k, v in o.items():
            yield f'{path}.{k}', k
            yield from keys(v, f'{path}.{k}')
    elif isinstance(o, list):
        for i, v in enumerate(o):
            yield from keys(v, f'{path}[{i}]')


def tr_texts(tr):
    """(where, text) for every piece of TR content the spec must carry."""
    for i in tr['recap']['items']:
        yield 'recap', i
    for i in tr['agenda']['items']:
        yield 'agenda', i
    for i in tr['takeaways']['items']:
        yield 'takeaways', i
    if tr['next_session']:
        yield 'next session', tr['next_session']
    for sec in tr['sections']:
        yield f"section {sec['number']}", sec['title']
    for s in [s for sec in tr['sections'] for s in sec['slides']] + tr.get('extras', []):
        if True:
            w = f"slide {s['number']}" if s.get('number') else f"extra {s['extra']}"
            if not s.get('number'):
                yield w, s['tr_title']
            for f in ('heading', 'subheading', 'analogy', 'visual_guidance'):
                if s.get(f):
                    yield f'{w} {f}', s[f]
            for part in s['content']:
                (k, v), = part.items()
                if k == 'line':
                    yield w, v
                elif k == 'code':
                    yield f'{w} code', v
                elif k == 'table':
                    for cell in v['columns'] + [c for r in v['rows'] for c in r]:
                        if cell:
                            yield f'{w} table', cell


def main(folder):
    folder = Path(folder)
    spec = json.loads((folder / 'spec.json').read_text(encoding='utf-8'))
    tr, notes = read_tr(folder / 'tr.docx')
    fails = []

    def check(name, problems):
        print(f"{'   ok' if not problems else ' FAIL'} {name}" + ('' if not problems else f' ({len(problems)})'))
        for p in problems[:12]:
            print(f'        {p}')
        if len(problems) > 12:
            print(f'        ... and {len(problems) - 12} more')
        fails.extend(problems)

    # shape
    probs = [f'missing top-level "{k}"' for k in ('meta', 'build_contract', 'rules', 'beats') if k not in spec]
    cards = [c for b in spec.get('beats', []) for c in b.get('cards', [])]
    for b in spec.get('beats', []):
        if not b.get('cards'):
            probs.append(f'beat "{b.get("name")}" has no cards')
    for c in cards:
        for k in ('id', 'title', 'source', 'press_count'):
            if k not in c:
                probs.append(f'card {c.get("id", "?")} has no "{k}"')
    if spec.get('meta', {}).get('deck_total') != len(cards):
        probs.append(f'meta.deck_total is {spec.get("meta", {}).get("deck_total")}, cards are {len(cards)}')
    check('shape', probs)

    # presses
    probs, seen = [], set()
    for c in cards:
        if c.get('id') in seen:
            probs.append(f'duplicate id {c["id"]}')
        seen.add(c.get('id'))
        n = len(c.get('presses', []))
        if c.get('press_count') != n:
            probs.append(f'{c.get("id")}: press_count {c.get("press_count")} but {n} presses listed')
        for i, p in enumerate(c.get('presses', [])):
            if not p.get('screen'):
                probs.append(f'{c.get("id")} press {i + 1} has no "screen"')
    check('presses', probs)

    # no-voice
    check('no-voice', [f'{p} is a voice field' for p, k in keys(spec) if k.lower() in FORBIDDEN])

    # leak: an 8-word run from a note that the TR's own content does not also contain
    content = ' '.join(norm(t) for _, t in tr_texts(tr))
    spec_text = ' '.join(norm(t) for _, t in strings(spec))
    probs = []
    for note in notes:
        words = norm(note).split()
        for i in range(len(words) - 7):
            run = ' '.join(words[i:i + 8])
            if run in spec_text and run not in content:
                probs.append(f'speaker note text in spec: "...{run}..."')
                break
    check('leak', probs)

    # coverage: only the fields that become slide copy count. A line quoted
    # in a press's screen text is direction, and is not on the slide.
    copy_text = ' '.join(norm(t) for c in cards for k in COPY if k in c for _, t in strings(c[k]))
    edits = spec.get('meta', {}).get('tr_edits', [])
    probs = []
    for where, text in tr_texts(tr):
        t = text
        for e in edits:
            t = t.replace(e.get('tr', '\0'), e.get('spec', ''))
        # Sentence by sentence, so a TR line the spec splits across two fields
        # (a lead and a callout) still counts as carried.
        for sentence in re.split(r'(?<=[.!?;])\s*(?=[A-Z])', t):
            n = norm(sentence)
            if n and n not in copy_text:
                probs.append(f'{where}: "{sentence[:90]}"')
    check('coverage', probs)

    # slides
    sourced = set()
    for b in spec.get('beats', []):
        for c in b.get('cards', []):
            for m in re.finditer(r'tr:(slide|extra) (\d+)', str(c.get('source', ''))):
                sourced.add((m.group(1), int(m.group(2))))
    want = {('slide', s['number']) for sec in tr['sections'] for s in sec['slides']}
    want |= {('extra', s['extra']) for s in tr.get('extras', [])}
    check('slides', [f'TR {k} {n} is the source of no card' for k, n in sorted(want - sourced)])

    # images: every TR image is in meta.tr_images, embedded byte for byte
    # (render_spec.py), and placed on a card unless marked not-used
    from render_spec import tr_images as docx_images
    want_imgs = docx_images(folder / 'tr.docx')
    entries = {i.get('file'): i for i in spec.get('meta', {}).get('tr_images', [])}
    probs = [f'{f} is not in meta.tr_images' for f in sorted(set(want_imgs) - set(entries))]
    for f, i in entries.items():
        if i.get('use') not in ('as-is', 'redraw', 'not-used'):
            probs.append(f'{f}: use must be as-is, redraw or not-used')
        if f in want_imgs and i.get('data') != want_imgs[f]:
            probs.append(f'{f} is not embedded, or differs from the TR: run render_spec.py')
        if i.get('use') != 'not-used' and not any(f in s for _, s in strings(spec.get('beats', []))):
            probs.append(f'{f} is marked {i.get("use")} but no card names it')
    if not (folder / 'spec.html').exists():
        probs.append('spec.html is missing: run render_spec.py')
    check('images', probs)

    # dashes
    check('dashes', [f'{p}: "{s[:70]}"' for p, s in strings(spec) if '—' in s or ' – ' in s])

    # spine
    sources = [str(c.get('source', '')) for c in cards]
    check('spine', [f'no card with source {s}' for s in SPINE if s not in sources])

    print('CLEAN' if not fails else f'{len(fails)} problem(s)')
    return 1 if fails else 0


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    sys.exit(main(sys.argv[1]))
