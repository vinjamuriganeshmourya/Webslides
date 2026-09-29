#!/usr/bin/env python3
"""
extract_deck.py — unpack a .pptx, inventory every slide, export slide images.

    python3 extract_deck.py deck.pptx work/

Writes:
    work/unpacked/          the opened package (edit here, then revise_deck.py)
    work/slides/sl1.webp …  one image per slide, in delivery order
    work/inventory.json     machine-readable inventory
    work/inventory.md       paste this into the plan as Step 0

Why images and not a PDF export: in these decks each slide is a single
full-bleed PNG, so the media part IS the slide. Going through PDF adds two
lossy steps and a resolution cut for nothing. Slides that are NOT a single
image fall back to a LibreOffice render, and are flagged.
"""
import json, os, re, shutil, subprocess, sys, zipfile
from pathlib import Path

def sh(cmd, **kw):
    """Never let a missing tool kill the extract.

    soffice and pdftoppm are only needed for slides that are not a single
    flat image, which is a minority even in the decks that have any. On a
    machine without LibreOffice this used to raise FileNotFoundError out of
    CreateProcess and take the whole run down, losing the flat slides that
    had already exported fine.
    """
    try:
        return subprocess.run(cmd, shell=isinstance(cmd, str),
                              capture_output=True, text=True, **kw)
    except (FileNotFoundError, OSError) as e:
        return subprocess.CompletedProcess(cmd, 127, "", str(e))

def slide_order(pkg: Path):
    """Delivery order from <p:sldIdLst>, resolved through the presentation rels."""
    pres = (pkg / "ppt/presentation.xml").read_text(encoding="utf8")
    rels = (pkg / "ppt/_rels/presentation.xml.rels").read_text(encoding="utf8")
    rid2name = {m.group(1): m.group(2) for m in
                re.finditer(r'Id="(rId\d+)"[^>]*Target="slides/(slide\d+)\.xml"', rels)}
    ids = re.findall(r'<p:sldId id="\d+" r:id="(rId\d+)"\s*/>', pres)
    missing = [r for r in ids if r not in rid2name]
    if missing:
        raise SystemExit(f"presentation.xml references unknown rels: {missing}")
    return [rid2name[r] for r in ids]

def slide_facts(pkg: Path, name: str):
    xml = (pkg / f"ppt/slides/{name}.xml").read_text(encoding="utf8")
    relp = pkg / f"ppt/slides/_rels/{name}.xml.rels"
    rels = relp.read_text(encoding="utf8") if relp.exists() else ""
    imgs = re.findall(r'Target="\.\./media/([^"]+)"', rels)
    texts = [t for t in re.findall(r"<a:t>([^<]*)</a:t>", xml) if t.strip()]
    return {"images": imgs, "text_runs": texts}

def main():
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    src, out = Path(sys.argv[1]), Path(sys.argv[2])
    if not src.exists():
        raise SystemExit(f"no such file: {src}")
    pkg = out / "unpacked"
    shots = out / "slides"
    if pkg.exists():
        shutil.rmtree(pkg)
    shots.mkdir(parents=True, exist_ok=True)
    pkg.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(src) as z:
        z.extractall(pkg)

    order = slide_order(pkg)
    facts = {n: slide_facts(pkg, n) for n in order}

    # Slides that are one image and no text can be exported losslessly.
    simple = [n for n in order if len(facts[n]["images"]) == 1 and not facts[n]["text_runs"]]
    complex_ = [n for n in order if n not in simple]

    rendered = {}
    if complex_:
        print(f"  {len(complex_)} slide(s) are not a single flat image — rendering via LibreOffice")
        r = sh(["soffice", "--headless", "--convert-to", "pdf", "--outdir", str(out), str(src)])
        pdf = out / (src.stem + ".pdf")
        if pdf.exists():
            sh(["pdftoppm", "-r", "150", "-png", str(pdf), str(out / "pg")])
            pages = sorted(out.glob("pg-*.png"))
            for i, n in enumerate(order):
                if i < len(pages):
                    rendered[n] = pages[i]
        else:
            print("  ! LibreOffice render failed; those slides will have no image")
            print("  ", (r.stderr or r.stdout)[:300])

    try:
        from PIL import Image
    except ImportError:
        raise SystemExit("Pillow is required:  pip install pillow")

    inv = []
    for i, name in enumerate(order, 1):
        f = facts[name]
        srcimg = None
        if name in simple:
            srcimg = pkg / "ppt/media" / f["images"][0]
        elif name in rendered:
            srcimg = rendered[name]
        target = shots / f"sl{i}.webp"
        size = None
        if srcimg and Path(srcimg).exists():
            im = Image.open(srcimg).convert("RGB")
            size = im.size
            im.save(target, "WEBP", quality=88, method=6)
        inv.append({
            "n": i,
            "source_slide": name,
            "source_number": int(re.sub(r"\D", "", name)),
            "media": f["images"][0] if f["images"] else None,
            "image": str(target.relative_to(out)) if size else None,
            "px": list(size) if size else None,
            "text_runs": f["text_runs"],
            "flat_image": name in simple,
        })

    (out / "inventory.json").write_text(json.dumps(inv, indent=2), encoding="utf8")

    lines = [f"# Slide inventory — {src.name}", "",
             f"{len(order)} slides. "
             + ("Every slide is a single flat image, so there is no text layer to edit — "
                "see references/deck-surgery.md." if not complex_ else
                f"{len(complex_)} slide(s) have a real text layer; prefer XML edits on those."),
             "",
             "| # | source | image | text found on the slide |",
             "|---|---|---|---|"]
    for r in inv:
        txt = " / ".join(r["text_runs"])[:90] or ("_flat image — read it visually_" if r["flat_image"] else "_none_")
        px = f'{r["px"][0]}×{r["px"][1]}' if r["px"] else "**MISSING**"
        lines.append(f'| {r["n"]} | {r["source_slide"]} | {px} | {txt} |')
    lines += ["", "## Read these visually before designing anything",
              "Slides with no text layer must be opened and looked at. A plan built on a deck "
              "you did not read is worthless and will look fine."]
    (out / "inventory.md").write_text("\n".join(lines), encoding="utf8")

    for p in out.glob("pg-*.png"):
        p.unlink()
    print(f"\n{len(order)} slides -> {shots}/sl1..sl{len(order)}.webp")
    print(f"inventory -> {out/'inventory.md'}")
    nomedia = [r["n"] for r in inv if not r["image"]]
    if nomedia:
        print(f"! no image exported for slide(s): {nomedia}")

    # The read pack, not the slides, is what you look at. A 1920x1080 slide
    # costs ~1,840 tokens to read and stays in context for the rest of the
    # session, so a 53-slide deck is ~98k tokens before anything is designed.
    # The contact sheets carry the same slides at ~200 tokens each, with the
    # code still legible. work/slides/ stays full size because that is what
    # the plan embeds; work/read/ is what you open.
    rp = Path(__file__).resolve().parent / "read_pack.py"
    if rp.exists() and any(shots.iterdir()):
        print()
        subprocess.run([sys.executable, str(rp), str(shots), str(out / "read")],
                       check=False)
        print()
        print("  Read work/read/sheet*.webp, NOT work/slides/. Then name the")
        print("  slides you still cannot resolve and pay for those alone:")
        print(f"    python3 {rp} {shots} {out / 'read'} --only 4,7,12-15")

if __name__ == "__main__":
    main()
