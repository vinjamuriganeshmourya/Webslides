#!/usr/bin/env python3
"""Read a TR doc (.docx) into tr.json: the TR's own words, structured, with
every speaker note removed.

    python3 -I extract_tr.py <tr.docx> <session_plans/<session>/> <images dir>

Writes:
    <session>/tr.json      the TR, slide by slide, verbatim
    <images dir>/tr_images/  every image the TR embeds, named by the TR slide it
                           sits on, for reading while the spec is written. Put it
                           in the scratchpad: the images reach the PDA embedded in
                           spec.json and spec.html (render_spec.py), never as loose files

Standard library only, so it runs anywhere Python 3.9+ does.

Why a script and not a reading: speaker notes must never reach a slide. They
are cut HERE, before any model or person reads the TR for content, so there is
no later step that can let one through. tr.json keeps only a count of what was
cut, never the text; check_spec.py re-reads the .docx itself to test for leaks.
"""
import json
import re
import shutil
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
R = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
A = '{http://schemas.openxmlformats.org/drawingml/2006/main}'
V = '{urn:schemas-microsoft-com:vml}'

# A TR labels each part of a slide with "Label: text". Speaker notes go under
# any of these names; the list is wide on purpose, because a note that slips
# through is read aloud as slide copy.
SPEAKER = r'(?:speaker|presenter|instructor|trainer|facilitator|teacher)(?:\'s)?\s*notes?|notes?\s+(?:for|to)\s+(?:the\s+)?(?:speaker|presenter|instructor|trainer)|talking\s+points|script'
LABELS = {
    'heading': r'heading|title|slide\s*title',
    'subheading': r'sub\s*-?\s*heading|sub\s*-?\s*title',
    'content': r'content|body|points|key\s*points',
    'analogy': r'analogy|real[\s-]*(?:world|life)\s*(?:analogy|example)',
    'example': r'example|examples',
    'visual': r'visual\s*guidance|visuals?|visual\s*(?:idea|suggestion|direction|cue)s?|design\s*(?:note|guidance)s?|image\s*(?:guidance|suggestion)s?',
    'code': r'code|code\s*snippet|program',
    'output': r'output|expected\s*output',
    'note': r'note|callout|tip|important',
    'speaker': SPEAKER,
}
LABEL_RE = re.compile(r'^\s*(' + '|'.join(f'(?P<{k}>{v})' for k, v in LABELS.items()) + r')\s*:\s*', re.I)
SLIDE_RE = re.compile(r'^\s*slide\s*(\d+)\s*[:.\-]?\s*(.*)$', re.I)
SECTION_RE = re.compile(r'section\s*(\d+)\s*:\s*(.*)$', re.I)
MONO = re.compile(r'courier|consolas|mono|fira\s*code|menlo|source\s*code', re.I)


def text_of(p):
    out = []
    for el in p.iter():
        if el.tag == W + 't':
            out.append(el.text or '')
        elif el.tag == W + 'tab':
            out.append('\t')
        elif el.tag in (W + 'br', W + 'cr'):
            out.append('\n')
    return ''.join(out)


def style_of(p):
    s = p.find(f'{W}pPr/{W}pStyle')
    return s.get(W + 'val') if s is not None else ''


def is_mono(p):
    fonts = [f.get(W + 'ascii') or '' for f in p.iter(W + 'rFonts')]
    runs = [r for r in p.iter(W + 'r') if (r.findtext(W + 't') or '').strip()]
    return bool(runs) and bool(fonts) and all(MONO.search(f) for f in fonts if f)


def images_of(p):
    ids = [b.get(R + 'embed') for b in p.iter(A + 'blip')]
    ids += [i.get(R + 'id') for i in p.iter(V + 'imagedata')]
    return [i for i in ids if i]


def heading_level(style):
    m = re.match(r'heading\s*(\d)', style, re.I) or re.match(r'Heading(\d)', style)
    return int(m.group(1)) if m else (0 if style.lower() == 'title' else None)


def clean(s):
    s = s.replace(' ', ' ').replace('​', '')
    s = re.sub(r'[ \t]+', ' ', s)
    return s.strip()


def read_tr(docx, outdir=None):
    """Return (tr, notes). tr is what tr.json holds. notes is the speaker-note
    text that was cut, for check_spec.py's leak test only; it is never written.
    Images are written to <outdir>/tr_images only when outdir is given."""
    docx = Path(docx)
    notes = []
    z = zipfile.ZipFile(docx)
    rels = ET.fromstring(z.read('word/_rels/document.xml.rels'))
    target = {r.get('Id'): r.get('Target') for r in rels}
    body = ET.fromstring(z.read('word/document.xml')).find(W + 'body')

    tr = {'source': docx.name, 'title': '', 'recap': {'heading': '', 'items': []},
          'agenda': {'heading': '', 'items': []}, 'sections': [], 'takeaways': {'heading': '', 'items': []},
          'extras': [], 'next_session': '', 'closing': [], 'loose': [],
          'dropped': {'speaker_notes': 0}}
    slide = None
    section = None
    block = None        # 'recap' | 'agenda' | 'takeaways' | None
    field = None        # the label the current paragraph continues
    img_dir = Path(outdir) / 'tr_images' if outdir else None
    if img_dir and img_dir.exists():
        shutil.rmtree(img_dir)
    img_count = {}

    def new_section(num, title):
        nonlocal section
        section = {'number': num, 'title': title, 'slides': []}
        tr['sections'].append(section)

    def add_image(rid):
        src = target.get(rid, '')
        if not src or src.startswith('http'):
            return None
        name = src.split('/')[-1]
        where = (f"slide-{slide['number']:02d}" if slide.get('number') else f"extra-{slide['extra']}") if slide else 'loose'
        img_count[where] = img_count.get(where, 0) + 1
        ext = Path(name).suffix
        dest = f'{where}-{img_count[where]}{ext}'
        if img_dir:
            img_dir.mkdir(exist_ok=True)
            (img_dir / dest).write_bytes(z.read('word/' + src.lstrip('/').removeprefix('word/')))
        return f'tr_images/{dest}'

    def put(kind, value):
        """File one item under the current slide, field-aware."""
        if slide is None:
            tr['loose'].append({kind: value})
            return
        slide['parts'].append({kind: value})

    for el in body:
        if el.tag == W + 'tbl':
            if field == 'speaker':
                tr['dropped']['speaker_notes'] += 1
                notes.append(' '.join(text_of(p) for p in el.iter(W + 'p')))
                continue
            rows = []
            for r in el.iter(W + 'tr'):
                rows.append([clean('\n'.join(text_of(p) for p in c.iter(W + 'p'))) for c in r.iter(W + 'tc')])
            if rows:
                put('table', {'columns': rows[0], 'rows': rows[1:]})
            field = None
            continue
        if el.tag != W + 'p':
            continue

        raw = text_of(el)
        txt = clean(raw)
        style = style_of(el)
        level = heading_level(style)
        imgs = images_of(el)

        # Headings set the frame: section, slide, or a spine block.
        if level is not None and txt:
            field = None
            low = txt.lower()
            ms = SECTION_RE.search(txt)
            mslide = SLIDE_RE.match(txt)
            if ms:
                new_section(int(ms.group(1)), clean(ms.group(2).strip('- ')))
                slide, block = None, None
            elif mslide:
                if section is None:
                    new_section(0, '')
                slide = {'number': int(mslide.group(1)), 'tr_title': clean(mslide.group(2)), 'parts': []}
                section['slides'].append(slide)
                block = None
            elif 'recap' in low:
                block, slide = 'recap', None
                tr['recap']['heading'] = txt
            elif 'agenda' in low:
                block, slide = 'agenda', None
                tr['agenda']['heading'] = txt
            elif 'takeaway' in low or 'summary' in low:
                block, slide = 'takeaways', None
                tr['takeaways']['heading'] = txt
            elif not tr['title'] and level <= 1:
                tr['title'] = txt
            elif section is not None and level >= 3:
                # A block the TR heads like a slide but does not number
                # ("Heads-Up: Start Your AWS Account Setup Now"). Its own
                # block, so it never folds into the slide before it.
                slide = {'number': None, 'extra': len(tr['extras']) + 1, 'tr_title': txt,
                         'after_slide': section['slides'][-1]['number'] if section['slides'] else None,
                         'parts': []}
                tr['extras'].append(slide)
                block = None
            else:
                put('heading_line', txt)
            continue

        if not txt and not imgs:
            continue

        m = LABEL_RE.match(txt)
        if m:
            field = next(k for k in LABELS if m.group(k))
            rest = txt[m.end():].strip()
            if field == 'speaker':
                tr['dropped']['speaker_notes'] += 1
                notes.append(rest)
                continue
            if field in ('example', 'note'):
                # "Example: ..." inside Content is a line of slide copy, label
                # and all, in its place among the other lines.
                put('line', txt)
                field = 'content'
                continue
            if rest:
                if field in ('heading', 'subheading') and slide is not None:
                    slide[field] = rest
                else:
                    put(field, rest)
            elif field == 'content':
                pass
            continue

        if field == 'speaker':
            # A note runs on until the next label or heading.
            tr['dropped']['speaker_notes'] += 1
            notes.append(txt)
            continue

        for rid in imgs:
            path = add_image(rid)
            if path:
                put('image', path)
        if not txt:
            continue

        low = txt.lower()
        if block in ('recap', 'agenda', 'takeaways') and slide is None:
            if low.startswith('upcoming session') or low.startswith('next session'):
                tr['next_session'] = clean(txt.split(':', 1)[1]) if ':' in txt else txt
                block = 'closing'
            else:
                tr[block]['items'].append(txt)
            continue
        if block == 'closing' and slide is None:
            tr['closing'].append(txt)
            continue
        if low.startswith('upcoming session') or low.startswith('next session'):
            tr['next_session'] = clean(txt.split(':', 1)[1]) if ':' in txt else txt
            block = 'closing'
            continue

        if is_mono(el) or field == 'code':
            put('code', raw.rstrip())
        elif field in ('analogy', 'visual', 'output'):
            put(field, txt)       # a continuation of the labelled field
        else:
            put('line', txt)

    # Fold each slide's parts into named fields, keeping order where order
    # carries meaning (content lines, tables and images interleave in the TR).
    for s in [s for sec in tr['sections'] for s in sec['slides']] + tr['extras']:
        if True:
            body_parts, extra = [], {}
            for part in s.pop('parts'):
                (k, v), = part.items()
                if k in ('line', 'table', 'image', 'code', 'output', 'heading_line'):
                    body_parts.append({'line' if k == 'heading_line' else k: v})
                else:
                    extra.setdefault(k, []).append(v)
            s['content'] = body_parts
            for k in ('analogy', 'visual'):
                if k in extra:
                    s[k if k != 'visual' else 'visual_guidance'] = ' '.join(extra[k])
            s.setdefault('heading', '')
            s.setdefault('subheading', '')

    return tr, notes


def main(docx, outdir, imgroot):
    docx, outdir, imgroot = Path(docx), Path(outdir), Path(imgroot)
    outdir.mkdir(parents=True, exist_ok=True)
    imgroot.mkdir(parents=True, exist_ok=True)
    tr, _ = read_tr(docx, imgroot)
    img_dir = imgroot / 'tr_images'
    (outdir / 'tr.json').write_text(json.dumps(tr, indent=1, ensure_ascii=False) + '\n', encoding='utf-8')
    n = sum(len(s['slides']) for s in tr['sections'])
    imgs = len(list(img_dir.iterdir())) if img_dir.exists() else 0
    print(f"{docx.name}: {len(tr['sections'])} sections, {n} slides, {imgs} images, "
          f"{tr['dropped']['speaker_notes']} speaker-note paragraphs dropped -> {outdir / 'tr.json'}, images in {img_dir}")
    if tr['loose']:
        print(f"  {len(tr['loose'])} item(s) sat outside any slide; read tr.json 'loose' before planning")


if __name__ == '__main__':
    if len(sys.argv) != 4:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2], sys.argv[3])
