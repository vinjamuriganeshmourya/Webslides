#!/usr/bin/env python3
"""Pack the TR's images into spec.json and write spec.html beside it.

    python3 -I render_spec.py <session_plans/<session>/>

The two files a PDA gets, both self-contained:
  spec.json   every TR image embedded once, as a data URI in meta.tr_images[].data
  spec.html   the same spec as a page to read: overview, rules, then every card
              as a slide sketch beside its clicks, with the TR images in place.
              Opens offline by double-click; no fonts, scripts or images fetched.

The images are read from tr.docx itself, so they are always the TR's own.
Run it after every change to spec.json, then run check_spec.py.
"""
import base64
import html
import json
import re
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from extract_tr import read_tr  # noqa: E402

MIME = {'.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
        '.webp': 'image/webp', '.svg': 'image/svg+xml', '.bmp': 'image/bmp', '.emf': 'image/emf', '.wmf': 'image/wmf'}


def tr_images(docx):
    """{'tr_images/slide-03-1.png': data URI} for every image in the TR."""
    with tempfile.TemporaryDirectory() as tmp:
        read_tr(docx, tmp)
        out = {}
        for p in sorted((Path(tmp) / 'tr_images').glob('*')):
            mime = MIME.get(p.suffix.lower(), 'application/octet-stream')
            out[f'tr_images/{p.name}'] = f'data:{mime};base64,' + base64.b64encode(p.read_bytes()).decode()
        return out


def e(s):
    return html.escape(str(s), quote=True)


def screen(s):
    """A press's screen text: escaped, with its <q>exact words</q> kept as quotes."""
    s = e(s).replace('&lt;q&gt;', '<q>').replace('&lt;/q&gt;', '</q>')
    return s


def lst(items, cls=''):
    return f'<ul class="{cls}">' + ''.join(f'<li>{e(i)}</li>' for i in items) + '</ul>' if items else ''


def table_html(t):
    head = ''.join(f'<th>{e(c)}</th>' for c in t['columns'])
    rows = ''.join('<tr>' + ''.join(f'<td>{e(c)}</td>' for c in r) + '</tr>' for r in t['rows'])
    return f'<div class="tw"><table><thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table></div>'


USE = {'as-is': ('Use as-is', 'ok'), 'redraw': ('Redraw in template colours', 'warn'), 'not-used': ('Do not use', 'bad')}


def figure(file, use, data, caption='', crop=''):
    label, tone = USE.get(use, (use, 'warn'))
    # Each image is stored once in the page (IMAGES, at the end) and every
    # <img> points at it by name, so a picture shown twice costs once.
    img = f'<img data-ref="{e(file)}" alt="{e(caption or file)}">' if data else '<div class="noimg">image missing</div>'
    extra = f'<div class="crop">Crop: {e(crop)}</div>' if crop else ''
    return (f'<figure class="shot {tone}"><div class="imgbox">{img}</div><figcaption>'
            f'<span class="pill {tone}">{e(label)}</span> <code>{e(file.split("/")[-1])}</code>'
            f'{f"<div>{e(caption)}</div>" if caption else ""}{extra}</figcaption></figure>')


def sketch(c, images):
    """The card's words laid out roughly as a slide, so the PDA sees the copy in place."""
    parts = []
    if c.get('kicker'):
        parts.append(f'<div class="k">{e(c["kicker"])}</div><div class="rule"></div>')
    if c.get('heading'):
        parts.append(f'<div class="h">{e(c["heading"])}</div>')
    if c.get('lead'):
        parts.append(f'<div class="lead">{e(c["lead"])}</div>')
    if c.get('analogy'):
        a = c['analogy']
        parts.append(f'<div class="an"><div><b>Familiar</b>{e(a["familiar"])}</div><div class="arrow">&rarr;</div>'
                     f'<div><b>Maps to</b>{e(a["maps_to"])}</div></div><p class="antext">{e(a["text"])}</p>')
    if c.get('show'):
        parts.append(lst(c['show'], 'pts'))
    if c.get('table'):
        parts.append(table_html(c['table']))
    for cd in c.get('code', []):
        out = f'<pre class="out">{e(cd["output"])}</pre>' if cd.get('output') else ''
        parts.append(f'<div class="code"><div class="loc">{e(cd["location"])}</div><pre>{e(cd["src"])}</pre>{out}</div>')
    if not parts:
        parts.append(f'<div class="chrome">{e(c["title"])}</div>')
    return '<div class="slide">' + ''.join(parts) + '</div>'


def card_html(c, images):
    kit = c.get('kit', {})
    chips = ''.join(f'<span class="chip">{e(v)}</span>' for v in (kit.get('slide'), kit.get('figure')) if v)
    img = ''
    if c.get('image'):
        i = c['image']
        img = figure(i['file'], i.get('use'), images.get(i['file'], {}).get('data'),
                     images.get(i['file'], {}).get('shows', ''), i.get('crop', ''))
    presses = ''.join(f'<li><span class="pn">{n}</span><div>{screen(p["screen"])}</div></li>'
                      for n, p in enumerate(c.get('presses', []), 1))
    side = [f'<p class="purpose">{e(c["purpose"])}</p>' if c.get('purpose') else '']
    if presses:
        side.append(f'<h4>Clicks <span class="muted">({c["press_count"]})</span></h4><ol class="presses">{presses}</ol>')
    if c.get('visual_guidance'):
        side.append(f'<h4>TR visual guidance</h4><blockquote>{e(c["visual_guidance"])}</blockquote>')
    if c.get('visual'):
        side.append(f'<h4>Draw</h4><p>{e(c["visual"])}</p>')
    if c.get('must'):
        side.append('<h4 class="okh">Must</h4>' + lst(c['must'], 'must'))
    if c.get('must_not'):
        side.append('<h4 class="badh">Must not</h4>' + lst(c['must_not'], 'mustnot'))
    if c.get('play'):
        side.append(f'<h4>Your call</h4><p>{e(c["play"])}</p>')
    return (f'<article class="card" id="{e(c["id"])}"><header><span class="id">{e(c["id"])}</span>'
            f'<h3>{e(c["title"])}</h3><span class="src">{e(c["source"])}</span>{chips}</header>'
            f'<div class="body"><div class="left">{sketch(c, images)}{img}</div><div class="right">{"".join(side)}</div></div></article>')


CSS = """
:root{--bg:#f6f7fb;--panel:#fff;--ink:#14213d;--muted:#5b6478;--line:#e2e6ef;--brand:#2846c8;--brandsoft:#e9edff;
--ok:#137a4b;--oksoft:#e3f5ec;--warn:#9a5b00;--warnsoft:#fff1dc;--bad:#b42318;--badsoft:#fde8e6;--code:#0f172a;--codeink:#e2e8f0;--slide:#fff}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0e1220;--panel:#161b2e;--ink:#e6e9f2;--muted:#9aa3b8;--line:#2a3150;
--brand:#8ea2ff;--brandsoft:#222b52;--ok:#5fd39b;--oksoft:#163527;--warn:#f0b35a;--warnsoft:#3a2a12;--bad:#ff8a80;--badsoft:#3d1a18;--code:#070a14;--slide:#1b2136}}
:root[data-theme="dark"]{--bg:#0e1220;--panel:#161b2e;--ink:#e6e9f2;--muted:#9aa3b8;--line:#2a3150;--brand:#8ea2ff;--brandsoft:#222b52;
--ok:#5fd39b;--oksoft:#163527;--warn:#f0b35a;--warnsoft:#3a2a12;--bad:#ff8a80;--badsoft:#3d1a18;--code:#070a14;--slide:#1b2136}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
a{color:var(--brand)}code,pre{font-family:ui-monospace,"Cascadia Code",Consolas,monospace}
.wrap{display:grid;grid-template-columns:270px 1fr;min-height:100vh}
nav{position:sticky;top:0;height:100vh;overflow:auto;background:var(--panel);border-right:1px solid var(--line);padding:20px 14px;font-size:13px}
nav .t{font-weight:700;font-size:15px;margin-bottom:2px}nav .s{color:var(--muted);margin-bottom:14px}
nav a{display:block;text-decoration:none;color:var(--ink);padding:3px 8px;border-radius:6px}nav a:hover{background:var(--brandsoft)}
nav .bt{margin:12px 0 2px;color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:.05em}
nav a{display:flex;gap:8px}nav .cid{flex:0 0 84px;color:var(--brand);font-weight:600}
main{padding:28px 32px 80px;max-width:1280px}
.hero{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:24px 28px;margin-bottom:22px}
.hero .kick{color:var(--brand);font-weight:600;font-size:13px;text-transform:uppercase;letter-spacing:.06em}
.hero h1{margin:4px 0 6px;font-size:30px;line-height:1.2}.stats{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.stat{background:var(--brandsoft);color:var(--brand);border-radius:999px;padding:3px 12px;font-size:13px;font-weight:600}
.idea{font-size:17px;border-left:4px solid var(--brand);padding:6px 14px;margin:16px 0 4px}
section.box{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:20px 24px;margin-bottom:22px}
section.box h2{margin:0 0 10px;font-size:19px}.two{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.howto ol{margin:0;padding-left:20px}.howto li{margin:3px 0}
.defects td:first-child{white-space:nowrap;font-weight:600}
.gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}
.beat{margin:34px 0 10px;display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;border-bottom:2px solid var(--line);padding-bottom:6px}
.beat h2{margin:0;font-size:20px}.beat .kind{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}
.card{background:var(--panel);border:1px solid var(--line);border-radius:14px;margin:14px 0;overflow:hidden;scroll-margin-top:12px}
.card header{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:12px 18px;border-bottom:1px solid var(--line)}
.card h3{margin:0;font-size:16px;flex:1 1 auto}
.id{background:var(--brand);color:#fff;border-radius:6px;padding:2px 8px;font-weight:700;font-size:12px;font-family:ui-monospace,Consolas,monospace}
:root[data-theme="dark"] .id{color:#0e1220}@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .id{color:#0e1220}}
.src{color:var(--muted);font-size:12px;font-family:ui-monospace,Consolas,monospace}
.chip{border:1px solid var(--line);border-radius:999px;padding:1px 9px;font-size:12px;color:var(--muted)}
.body{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:20px;padding:18px}
.slide{aspect-ratio:16/9;background:var(--slide);border:1px solid var(--line);border-radius:10px;padding:18px 22px;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.slide .k{color:var(--brand);font-weight:600;font-size:13px}.slide .rule{height:2px;width:64px;background:linear-gradient(90deg,var(--brand),transparent);margin:4px 0 6px}
.slide .h{font-size:20px;font-weight:650;line-height:1.25;margin-bottom:8px}.slide .lead{font-size:14px;margin-bottom:8px}
.slide .pts{margin:0;padding-left:18px;font-size:13.5px}.slide .pts li{margin:3px 0}
.slide .chrome{height:100%;display:grid;place-items:center;font-size:22px;font-weight:650;color:var(--muted)}
.an{display:flex;gap:10px;align-items:stretch;margin:6px 0}.an>div{flex:1;background:var(--brandsoft);border-radius:8px;padding:8px 10px;font-size:13px}
.an b{display:block;font-size:11px;text-transform:uppercase;color:var(--muted)}.an .arrow{flex:0 0 auto;background:none;align-self:center;font-size:20px;padding:0}
.antext{font-size:13px;margin:6px 0 0}
.tw{overflow:auto;margin:6px 0}table{border-collapse:collapse;width:100%;font-size:13px}
th,td{border:1px solid var(--line);padding:5px 8px;text-align:left;vertical-align:top}th{background:var(--brandsoft)}
.code{margin:8px 0;border-radius:8px;overflow:hidden;background:var(--code)}.code .loc{font:12px ui-monospace,Consolas,monospace;color:#94a3b8;padding:5px 10px;border-bottom:1px solid #1e293b}
.code pre{margin:0;padding:10px 12px;color:var(--codeink);font-size:12.5px;overflow:auto;white-space:pre}.code pre.out{border-top:1px dashed #334155;color:#86efac}
.shot{margin:12px 0 0;border:1px solid var(--line);border-radius:10px;overflow:hidden;background:var(--panel)}
.shot .imgbox{background:#fff;display:flex;justify-content:center}.shot img{max-width:100%;max-height:340px;display:block}
.shot.bad img{opacity:.45;filter:grayscale(1)}.shot figcaption{padding:8px 10px;font-size:12.5px;color:var(--muted)}
.crop{margin-top:3px}.noimg{padding:30px;color:var(--bad)}
.pill{display:inline-block;border-radius:999px;padding:1px 9px;font-size:11.5px;font-weight:700}
.pill.ok{background:var(--oksoft);color:var(--ok)}.pill.warn{background:var(--warnsoft);color:var(--warn)}.pill.bad{background:var(--badsoft);color:var(--bad)}
.right h4{margin:14px 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}
.right h4.okh{color:var(--ok)}.right h4.badh{color:var(--bad)}.right p{margin:0}.muted{color:var(--muted);font-weight:400}
.purpose{font-size:15px;font-weight:600;margin:0 0 4px!important}
.presses{list-style:none;margin:0;padding:0}.presses li{display:flex;gap:10px;padding:6px 0;border-bottom:1px dashed var(--line);font-size:13.5px}
.pn{flex:0 0 24px;height:24px;border-radius:50%;background:var(--brandsoft);color:var(--brand);font-weight:700;font-size:12px;display:grid;place-items:center}
q{background:var(--brandsoft);border-radius:4px;padding:0 3px;quotes:none;font-weight:500}
blockquote{margin:0;border-left:3px solid var(--warn);padding:4px 10px;background:var(--warnsoft);border-radius:0 6px 6px 0;font-size:13.5px}
ul.must,ul.mustnot{margin:0;padding-left:18px;font-size:13.5px}
.theme{position:fixed;right:16px;bottom:16px;border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:999px;padding:6px 12px;cursor:pointer;font:inherit;font-size:13px}
@media (max-width:900px){.wrap{display:block}nav{position:static;height:auto;max-height:45vh;border-right:0;border-bottom:1px solid var(--line)}
main{padding:16px}.body,.two{grid-template-columns:minmax(0,1fr)}.card header{padding:10px 12px}.body{padding:12px}.hero h1{font-size:24px}}
@media print{nav,.theme{display:none}.wrap{display:block}.card{break-inside:avoid}}
"""


def page(spec, images):
    m = spec['meta']
    cards = [c for b in spec['beats'] for c in b['cards']]
    presses = sum(c.get('press_count', 0) for c in cards)
    title = m['session'].split(' - ', 1)[-1]
    num = m['session'].split(' - ', 1)[0]

    navs = [f'<div class="t">{e(title)}</div><div class="s">{e(m["course"])} &middot; Session {e(num)}</div>',
            '<a href="#start">How to use this</a><a href="#overview">Overview</a><a href="#rules">Rules</a>'
            '<a href="#defects">TR problems</a><a href="#images">TR images</a>']
    deck = []
    for b in spec['beats']:
        navs.append(f'<div class="bt">{e(b["name"])}</div>')
        navs += [f'<a href="#{e(c["id"])}"><span class="cid">{e(c["id"])}</span>{e(c["title"])}</a>' for c in b['cards']]
        deck.append(f'<div class="beat"><h2>{e(b["name"])}</h2><span class="kind">{e(b["kind"])} &middot; {e(b["source"])}</span></div>')
        deck += [card_html(c, images) for c in b['cards']]

    gallery = ''.join(
        '<div>' + figure(i['file'], i.get('use'), i.get('data'), f'TR slide {i.get("tr_slide")}: {i.get("shows", "")}')
        + (f'<p class="muted" style="font-size:12.5px;margin:4px 2px 0">{e(i["why"])}</p>' if i.get('why') else '') + '</div>'
        for i in m.get('tr_images', []))
    defects = ''.join(f'<tr><td>{e(d[0])}</td><td>{e(d[1])}</td><td>{e(d[2])}</td></tr>' for d in m.get('defects', []))

    body = f"""
<div class="wrap"><nav>{''.join(navs)}</nav><main>
<div class="hero" id="start"><div class="kick">{e(m['course'])} &middot; Session spec for the design team</div>
<h1>{e(title)}</h1><div class="muted">Session {e(num)} &middot; from <code>{e(m['source_tr'])}</code></div>
<div class="stats"><span class="stat">{len(cards)} slides</span><span class="stat">{presses} clicks</span>
<span class="stat">{len(spec['beats'])} beats</span><span class="stat">{len(m.get('tr_images', []))} TR images</span></div>
<div class="idea">{e(m['one_idea'])}</div></div>

<section class="box howto"><h2>How to use this page</h2><ol>
<li><b>One card below is one slide</b>, in order. The grey box is a sketch of the slide's words, not the design.</li>
<li><b>Words are exact.</b> Copy the kicker, heading, lead, points, tables and code as written. If something does not fit, ask; do not rewrite it.</li>
<li><b>Clicks</b> say what appears on each click. Click 1 is what shows when the slide opens.</li>
<li><b>Draw</b> and <b>TR visual guidance</b> say what the picture is. <b>Your call</b> is yours to design.</li>
<li><b>Images:</b> <span class="pill ok">Use as-is</span> real screenshots, crop as noted. <span class="pill warn">Redraw in template colours</span> a correct diagram to draw again. <span class="pill bad">Do not use</span> wrong or decorative.</li>
<li>The same spec, for tools, is <code>spec.json</code> in this folder. There are no speaker notes in either, by design.</li></ol></section>

<section class="box" id="overview"><h2>Overview</h2><div class="two"><div>
<h4>By the end, a student can</h4>{lst(m['outcomes'])}
<p><b>Comes after:</b> {e(m.get('previous', ''))}<br><b>Next:</b> {e(m.get('next', ''))}</p></div>
<div><h4>Notes for the whole deck</h4>{lst(m.get('design_notes', []))}</div></div></section>

<section class="box" id="rules"><h2>Rules for every slide</h2><div class="two"><div><h4>Content</h4>{lst(spec['rules'])}</div>
<div><h4>Build</h4>{lst(spec['build_contract'])}</div></div></section>

<section class="box" id="defects"><h2>Problems found in the TR</h2>
<p class="muted">What the TR gets wrong, and what this spec does about it. Send the first column to the TR author.</p>
<div class="tw defects"><table><thead><tr><th>Where</th><th>Problem</th><th>What the spec does</th></tr></thead><tbody>{defects}</tbody></table></div></section>

<section class="box" id="images"><h2>Images from the TR</h2><div class="gallery">{gallery}</div></section>

<h2 style="margin-top:34px">The deck, slide by slide</h2>
{''.join(deck)}
</main></div>
<script>var IMAGES={json.dumps({i['file']: i['data'] for i in m.get('tr_images', []) if i.get('data')})};
document.querySelectorAll('img[data-ref]').forEach(function(i){{i.src=IMAGES[i.dataset.ref]||''}});</script>
<button class="theme" onclick="var r=document.documentElement;r.dataset.theme=(r.dataset.theme==='dark'||(!r.dataset.theme&&matchMedia('(prefers-color-scheme: dark)').matches))?'light':'dark'">Light / dark</button>"""
    return (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            f'<title>{e(title)} Spec</title><style>{CSS}</style></head><body>{body}</body></html>\n')


def main(folder):
    folder = Path(folder)
    spec_path = folder / 'spec.json'
    spec = json.loads(spec_path.read_text(encoding='utf-8'))
    datas = tr_images(folder / 'tr.docx')
    for i in spec['meta'].get('tr_images', []):
        if i['file'] in datas:
            i['data'] = datas[i['file']]
    images = {i['file']: i for i in spec['meta'].get('tr_images', [])}
    spec_path.write_text(json.dumps(spec, indent=1, ensure_ascii=False) + '\n', encoding='utf-8')
    (folder / 'spec.html').write_text(page(spec, images), encoding='utf-8')
    kb = lambda p: (folder / p).stat().st_size // 1024
    print(f'{len(datas)} TR images embedded. spec.json {kb("spec.json")} KB, spec.html {kb("spec.html")} KB')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
