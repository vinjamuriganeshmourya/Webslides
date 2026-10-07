#!/usr/bin/env python3
"""Regenerate the session 11 lesson plan.

The finished plan is never hand-edited. Content lives in parts/ as HTML
fragments; slide artwork lives in media/ and is inlined here as base64 so the
output stays a single self-contained file.

    python build.py [-o OUT]
"""
import argparse, base64, pathlib, re, sys

ROOT = pathlib.Path(__file__).parent
PARTS = ROOT / 'parts'
MEDIA = ROOT / 'media'
DEFAULT_OUT = ROOT.parent / 'Plans' / 'Programming Foundations' / '11-nested-conditional-statements-plan.html'


def _b64(path):
    if not path.exists():
        sys.exit(f'missing image: {path}')
    return base64.b64encode(path.read_bytes()).decode()


def inline_slides(markup):
    """Inline the artwork. src="SLIDE:n" is media/sln.webp; SLIDE:name (or an
    SVG href="ASSET:name") is any other file in media/, so a logo or an icon
    can be reused without a second copy in the tree."""
    markup = re.sub(r'src="SLIDE:(\d+)"',
                    lambda m: f'src="data:image/webp;base64,{_b64(MEDIA / f"sl{m.group(1)}.webp")}"',
                    markup)
    markup = re.sub(r'(src|href|xlink:href)="ASSET:([A-Za-z0-9._-]+)"',
                    lambda m: f'{m.group(1)}="data:image/webp;base64,{_b64(MEDIA / m.group(2))}"',
                    markup)
    return markup


def read_blocks():
    order = (PARTS / 'blocks' / '_order.txt').read_text(encoding='utf-8').split()
    return ''.join((PARTS / 'blocks' / name).read_text(encoding='utf-8') for name in order)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('-o', '--out', default=str(DEFAULT_OUT))
    args = ap.parse_args()

    html = (ROOT / 'shell.html').read_text(encoding='utf-8')
    for key, markup in (
        ('{{NAV}}', (PARTS / 'nav.html').read_text(encoding='utf-8')),
        ('{{BLOCKS}}', read_blocks()),
        ('{{GUIDE}}', (PARTS / 'guide.html').read_text(encoding='utf-8')),
        ('{{HANDOUT}}', (PARTS / 'handout.html').read_text(encoding='utf-8')),
    ):
        if key not in html:
            sys.exit(f'shell.html is missing the {key} placeholder')
        html = html.replace(key, markup)

    # The interactive worksheet is its own deliverable AND is embedded in the
    # plan so a reviewer can download it from the Student worksheet tab. One
    # source file, so the two can never disagree.
    ws = (ROOT / 'student-worksheet.html').read_bytes()
    html = html.replace('{{WORKSHEET_B64}}', base64.b64encode(ws).decode())

    html = inline_slides(html)
    if 'SLIDE:' in html or 'ASSET:' in html or '{{' in html:
        sys.exit('unresolved marker left in output')

    out = pathlib.Path(args.out)
    out.write_text(html, encoding='utf-8')
    print(f'{out}  {len(html):,} bytes')

    side = out.with_name(out.stem.replace('-plan', '') + '-worksheet.html')
    side.write_bytes(ws)
    print(f'{side}  {len(ws):,} bytes')


if __name__ == '__main__':
    main()
