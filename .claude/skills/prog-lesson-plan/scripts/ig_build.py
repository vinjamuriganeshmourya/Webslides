# -*- coding: utf-8 -*-
"""Build an instructor guide from the approved template.

A session supplies a title, a duration, a sidebar subtitle and a list of items.
Items are either a checkpoint band or a numbered section:

    {"cp": "Checkpoint 1 &middot; 21 min"}            a band in the sidebar
    {"cp": "Hard floor &middot; 65 min", "floor": 1}  the orange one

    {"kind": "hands",                 concept | hook | activity | hands | quiz | exit
     "title": "Hands on 1, trace it then run it",
     "nav": "Hands on 1, trace it",   short label for the sidebar (optional)
     "band": "14 to 21",              minute band, printed as "14 to 21 min"
     "html": "<p>...</p>"}            the body of the section

Numbering, the sidebar and the anchors are generated, so they cannot drift.

    python3 scripts/ig_build.py <path/to/session_guide.py>
"""
import io, os, re, sys, importlib.util

HERE = os.path.dirname(os.path.abspath(__file__))


def _template():
    """The approved shell. It sits beside this script in _shared, in the
    skill's assets/ once synced, and in tools/ inside a plans repo."""
    for p in (os.path.join(HERE, "ig_template.html"),
              os.path.join(HERE, os.pardir, "assets", "ig_template.html"),
              os.path.join(os.getcwd(), "assets", "ig_template.html"),
              os.path.join(os.getcwd(), "tools", "ig_template.html")):
        if os.path.exists(p):
            return os.path.abspath(p)
    raise SystemExit("ig_template.html not found beside the script or in assets/")


def render(meta, items):
    tpl = io.open(_template(), encoding="utf-8").read()

    nav, secs, n = [], [], 0
    for it in items:
        if "cp" in it:
            cls = ' class="cp floor"' if it.get("floor") else ' class="cp"'
            nav.append('<p%s><span>%s</span></p>' % (cls, it["cp"]))
            continue

        n += 1
        sid = "s%d" % n
        kind = "k-" + it.get("kind", "concept")
        band = it.get("band")
        label = it.get("nav", it["title"])
        time = '<span class="nav-t">%s</span>' % band if band else ""
        nav.append('<a class="nav-item %s" href="#%s"><span class="nav-n">%d</span>'
                   '<span class="nav-l">%s</span>%s</a>' % (kind, sid, n, label, time))

        clock = ' <span class="clock">%s min</span>' % band if band else ""
        secs.append(
            '<section%s id="%s">\n<h2><span class="num">%d.</span>%s%s</h2>\n%s\n</section>'
            % (' class="tight"' if n == 1 else "", sid, n, it["title"], clock,
               it["html"].strip()))

    out = (tpl.replace("{{TITLE}}", meta["title"])
              .replace("{{DURATION}}", meta.get("duration", "75 minutes"))
              .replace("{{SUBTITLE}}", meta["subtitle"])
              .replace("{{NAV}}", "\n".join(nav))
              .replace("{{SECTIONS}}", "\n\n".join(secs)))
    return out


def problems(html):
    """The house rules a finished guide has to keep. Returns a list of faults,
    empty when the guide is clean. verify_plan.py calls this, so the build and
    the checker cannot disagree about what the format is."""
    bad = []
    if "—" in html or "–" in html:
        bad.append("an em dash or en dash is in the text")
    body = html.split("</style>", 1)[-1].split("<script>")[0]
    text = re.sub(r"<[^>]+>", " ", body)
    low = text.lower()
    for phrase in ("paper worksheet", "worksheet on paper", "printed worksheet",
                   "print the worksheet", "printout", "photocopy",
                   "hand out the worksheet", "paper copy", "on the sheet"):
        if phrase in low:
            bad.append("%r is in the text, the worksheet is digital" % phrase)
    for want in ("Safe point 1", "How to run this session", "If you are running late"):
        if want not in text:
            bad.append("the guide has no %r section" % want)
    secs = re.findall(r'<section[^>]* id="s(\d+)"', html)
    navs = re.findall(r'<a class="nav-item[^"]*" href="#s(\d+)"', html)
    if not secs:
        bad.append("no numbered sections: this is not the phase-block format")
    if secs != navs:
        bad.append("the sidebar and the sections disagree: %s vs %s" % (navs, secs))
    if "Instructor Guide" not in html.split("</head>", 1)[0]:
        bad.append("the title does not say Instructor Guide")
    if len(text.split()) > 4200:
        bad.append("%d words: a guide over about 4,000 stops being read" % len(text.split()))
    return bad


def check(html, path):
    bad = problems(html)
    words = len(re.sub(r"<[^>]+>", " ",
                       html.split("</style>", 1)[-1].split("<script>")[0]).split())
    print("%-52s %5d words  %s" % (os.path.basename(path), words,
                                   "OK" if not bad else "FAIL"))
    for b in bad:
        print("    !", b)
    return not bad


def build(meta, items):
    html = render(meta, items)
    out = meta["out"]
    os.makedirs(os.path.dirname(out), exist_ok=True)
    io.open(out, "w", encoding="utf-8", newline="\n").write(html)
    check(html, out)
    return out


def main(argv):
    if len(argv) < 2:
        print(__doc__)
        return 1
    for path in argv[1:]:
        spec = importlib.util.spec_from_file_location("session_guide", path)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        print("wrote", build(mod.META, mod.ITEMS))
    return 0


if __name__ == "__main__":
    if {"-h", "--help"} & set(sys.argv): raise SystemExit(__doc__)
    sys.exit(main(sys.argv))
