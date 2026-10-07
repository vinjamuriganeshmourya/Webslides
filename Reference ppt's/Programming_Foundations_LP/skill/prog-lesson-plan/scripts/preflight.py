#!/usr/bin/env python3
"""
preflight.py — check the environment and the inputs before building anything.

    python3 ~/.claude/skills/prog-lesson-plan/scripts/preflight.py .

Pass the session working directory. It looks for a deck, a previous deck and a
transcript by common names, or takes them explicitly:

    python3 preflight.py . --deck deck.pptx --prev prev.pptx --transcript rec.txt

Reports every check with the exact command to fix it. Exits 1 if anything that
blocks a build is missing. Nothing is written and nothing is built.
"""
import argparse, glob, importlib.util, json, os, re, shutil, subprocess, sys, zipfile
from pathlib import Path

rows = []
def row(status, label, detail="", fix=""):
    rows.append((status, label, detail, fix))

def have(cmd): return shutil.which(cmd) is not None
def mod(name): return importlib.util.find_spec(name) is not None

# Compared lower-cased, so "No Use" and "no use" both match.
SKIP_DIRS = {".git", "node_modules", "__pycache__", "work", "out", "unpacked", ".venv",
             ".idea", ".vscode", "no use", "nouse", "unused", "archive", "old", "backup",
             "drafts", "scratch", "temp", "tmp", "done", "retired"}

def find(d: Path, pats):
    """First matching FILE for each pattern, shallow before deep.

    Files only: a pattern like *transcript* will otherwise match a Transcripts/
    directory and blow up on read. Shallow before deep so a deck sitting beside
    the transcript beats one buried in a subfolder.
    """
    for p in pats:
        for pattern in (p, f"**/{p}"):
            hits = [h for h in sorted(d.glob(pattern))
                    if h.is_file()
                    and not (SKIP_DIRS & {x.lower() for x in h.relative_to(d).parts})]
            if hits:
                return hits[0]
    return None

def words_in(p: Path):
    try:
        return len(p.read_text(errors="ignore").split())
    except OSError as e:
        return f"unreadable ({e.__class__.__name__})"

def deck_facts(p: Path):
    """slide count, and whether slides carry a real text layer"""
    with zipfile.ZipFile(p) as z:
        names = z.namelist()
        pres = z.read("ppt/presentation.xml").decode("utf8", "ignore")
        rels = z.read("ppt/_rels/presentation.xml.rels").decode("utf8", "ignore")
        rid2 = {m.group(1): m.group(2) for m in
                re.finditer(r'Id="(rId\d+)"[^>]*Target="slides/(slide\d+)\.xml"', rels)}
        order = [rid2[r] for r in re.findall(r'<p:sldId id="\d+" r:id="(rId\d+)"\s*/>', pres)
                 if r in rid2]
        withtext = 0
        for n in order:
            key = f"ppt/slides/{n}.xml"
            if key in names:
                xml = z.read(key).decode("utf8", "ignore")
                if [t for t in re.findall(r"<a:t>([^<]*)</a:t>", xml) if t.strip()]:
                    withtext += 1
        media = len([n for n in names if n.startswith("ppt/media/")])
    return len(order), withtext, media

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("dir", nargs="?", default=".")
    ap.add_argument("--deck"); ap.add_argument("--prev"); ap.add_argument("--transcript")
    ap.add_argument("--minutes", type=int, default=75)
    a = ap.parse_args()
    d = Path(a.dir).resolve()

    # ---------- the skill itself ----------
    skill = Path.home() / ".claude/skills/prog-lesson-plan"
    if not skill.exists():
        alt = sorted(Path.home().glob(".claude/skills/*/SKILL.md"))
        row("FAIL", "skill installed", f"not at {skill}",
            "cp -r prog-lesson-plan ~/.claude/skills/"
            + (f"   (found instead: {[p.parent.name for p in alt]})" if alt else ""))
    else:
        want = ["SKILL.md", "scripts/extract_deck.py", "scripts/revise_deck.py",
                "scripts/verify_plan.py", "assets/plan-template.html",
                "assets/build-template.py", "references/session-design.md",
                "references/deck-surgery.md", "references/gotchas.md"]
        miss = [w for w in want if not (skill / w).exists()]
        row("FAIL" if miss else "OK", "skill files complete",
            f"missing: {miss}" if miss else f"{len(want)} files present",
            "re-extract lesson-plan-skill.tar.gz over ~/.claude/skills/")

    # ---------- python ----------
    row("OK" if sys.version_info >= (3, 9) else "FAIL", "python >= 3.9",
        sys.version.split()[0])
    for m, why, fix in [("PIL", "image export and pixel edits", "pip install pillow"),
                        ("fontTools", "converting .woff fonts to .ttf", "pip install fonttools")]:
        row("OK" if mod(m) else "FAIL", f"python: {m}", why, fix)

    # ---------- fonts ----------
    fdir = skill / "assets/fonts"
    fira = list(fdir.glob("*Fira*Mono*.ttf")) if fdir.exists() else []
    row("OK" if fira else "FAIL", "code font (Fira Mono)",
        fira[0].name if fira else "absent — new code slides will be set in the wrong face",
        f'mkdir -p "{fdir}" && curl -sL -o "{fdir}/FiraMono.ttf" '
        "https://cdn.jsdelivr.net/gh/mozilla/Fira@master/ttf/FiraMono-Regular.ttf")
    others = [p.name for p in fdir.glob("*.[ot]tf")] if fdir.exists() else []
    brand = [n for n in others if "Fira" not in n]
    row("OK" if brand else "WARN", "brand title font",
        ", ".join(brand) if brand else
        "absent — new slide titles must be lifted from existing artwork, or set in a near-miss face",
        f'get the .ttf/.otf from the design team and drop it in "{fdir}"')

    # ---------- verification tooling ----------
    pw = have("playwright") or (d / "node_modules/playwright").exists() or have("chromium") \
         or have("google-chrome") or have("chrome")
    row("OK" if pw else "WARN", "real browser for screenshots",
        "present" if pw else
        "absent — presenter view, full screen and page breaks cannot be verified, only guessed at",
        "npx playwright install chromium")
    row("OK" if have("soffice") else "WARN", "LibreOffice",
        "present" if have("soffice") else "only needed if slides are NOT flat images",
        "brew install --cask libreoffice   |   apt install libreoffice")
    row("OK" if have("pdftoppm") else "WARN", "poppler (pdftoppm)",
        "present" if have("pdftoppm") else "only needed alongside LibreOffice",
        "brew install poppler   |   apt install poppler-utils")

    # ---------- working directory ----------
    row("OK" if (d / ".git").exists() else "WARN", "git repo in the session folder",
        str(d), "git init && git add -A && git commit -m 'source deck and transcript'")

    # ---------- inputs ----------
    decks = [p for p in sorted(d.glob("*.pptx")) + sorted(d.glob("**/*.pptx"))
             if p.is_file()
             and not (SKIP_DIRS & {x.lower() for x in p.relative_to(d).parts})]
    decks = list(dict.fromkeys(decks))                       # de-dupe, keep order
    deck = Path(a.deck) if a.deck else None
    prev = Path(a.prev) if a.prev else find(d, ["prev*.pptx", "previous*.pptx", "*prev*.pptx"])

    if not deck:
        others = [p for p in decks if not prev or p.resolve() != prev.resolve()]
        if len(others) == 1:
            deck = others[0]
        elif len(others) > 1:
            # Decks in this series are named by session number, so nothing in the
            # filename says which is "this week" and which is "last week".
            # Guessing here silently builds a poll from the wrong session.
            row("FAIL", "which deck is which",
                f"{len(others)} decks found: {[p.name for p in others]}",
                "pass them explicitly:  --deck \"<this session>\" --prev \"<previous session>\"")
        elif decks:
            deck = decks[0]
    if a.transcript:
        tx = Path(a.transcript)
    else:
        # Named-like-a-transcript wins outright. A bare .txt has to earn it on
        # length — slide-links.txt and notes.txt are not transcripts.
        tx = find(d, ["*transcript*", "*.vtt", "*.srt"])
        if not tx:
            txts = [p for p in list(d.glob("*.txt")) + list(d.glob("**/*.txt"))
                    if p.is_file()
                    and not (SKIP_DIRS & {x.lower() for x in p.relative_to(d).parts})]
            scored = sorted(((words_in(p), p) for p in dict.fromkeys(txts)),
                            key=lambda t: t[0] if isinstance(t[0], int) else -1, reverse=True)
            tx = next((p for n, p in scored if isinstance(n, int) and n >= 500), None)

    if not deck or not deck.is_file():
        row("FAIL", "session deck (.pptx)", "not found",
            "put the deck in this folder, or pass --deck <path>")
    else:
      try:
        n, txt, media = deck_facts(deck)
        flat = n - txt
        row("OK", "session deck", f"{deck.name} — {n} slides, {media} media parts")
        row("OK", "deck slide type",
            f"{flat} flat image(s), {txt} with a text layer"
            + ("  -> read every slide visually; the inventory cannot read them for you"
               if flat else "  -> prefer XML edits over pixel edits"))
        if n and a.minutes:
            row("WARN" if n > a.minutes * 0.45 else "OK", "deck length vs session length",
                f"{n} slides for {a.minutes} min — expect to cut 50-60%"
                if n > a.minutes * 0.45 else f"{n} slides for {a.minutes} min")
      except (OSError, KeyError, zipfile.BadZipFile) as e:
        row("FAIL", "session deck readable", f"{deck.name}: {e.__class__.__name__}",
            "is this really a .pptx? pass --deck <path> explicitly")

    if not prev or not prev.is_file():
        row("FAIL", "previous session's deck", "not found",
            "the recap must come from the PREVIOUS session's real content; "
            "without it the poll gets invented. Copy it in as prev.pptx, or say "
            "explicitly that this is session 1 and the poll should be omitted")
    else:
        try:
            pn, _, _ = deck_facts(prev)
            row("OK", "previous session's deck", f"{prev.name} — {pn} slides")
        except (OSError, KeyError, zipfile.BadZipFile) as e:
            row("FAIL", "previous deck readable", f"{prev.name}: {e.__class__.__name__}",
                "pass --prev <path> explicitly")

    row("OK" if tx and tx.is_file() else "WARN", "recording transcript",
        f"{tx.name} — {words_in(tx)} words" if tx and tx.is_file()
        else "absent — optional, but it shows where the room got stuck and which slides got "
             "skipped. If you have one under 500 words, pass --transcript explicitly")

    # ---------- report ----------
    w = max(len(l) for _, l, _, _ in rows)
    fails = sum(1 for s, *_ in rows if s == "FAIL")
    warns = sum(1 for s, *_ in rows if s == "WARN")
    print()
    for status, label, detail, fix in rows:
        mark = {"OK": "  ok  ", "FAIL": " FAIL ", "WARN": " warn "}[status]
        print(f"[{mark}] {label.ljust(w)}  {detail}")
        if status != "OK" and fix:
            print(f"{' '*(w+11)}fix: {fix}")
    print(f"\n{len(rows)-fails-warns} ok, {warns} warnings, {fails} blocking")
    if fails:
        print("\nFix the blocking items before building. Nothing was written.")
    else:
        print("\nClear to start. Next: extract and read the deck, post the inventory")
        print("and the proposed cut list, and stop for approval before building.")
    sys.exit(1 if fails else 0)

if __name__ == "__main__":
    main()
