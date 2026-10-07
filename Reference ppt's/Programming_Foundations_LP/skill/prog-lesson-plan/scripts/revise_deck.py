#!/usr/bin/env python3
"""
revise_deck.py — apply a slide keep-list / order to an unpacked deck, repack, validate.

    # keep and reorder, by source slide name, in delivery order
    python3 revise_deck.py work/unpacked out/deck-revised.pptx \
        --order slide1,slide2,slide5,slide7,slide42

    # or duplicate a slide first, so you have somewhere to put new artwork
    python3 revise_deck.py work/unpacked --duplicate slide20 --after slide22
    #   -> creates slideNN with its OWN media part, prints the paths to write

Duplicating matters: a slide copied by the usual means shares the source's
image part, so editing that image would change both slides. This gives the new
slide its own copy and repoints its rels.

Nothing is deleted from disk. Slides simply stop being referenced, and the
clean step drops orphaned parts at repack time.
"""
import argparse, re, shutil, subprocess, sys, zipfile
from pathlib import Path

def read(p): return Path(p).read_text(encoding="utf8")
def write(p, s): Path(p).write_text(s, encoding="utf8")

def rels_map(pkg: Path):
    rels = read(pkg / "ppt/_rels/presentation.xml.rels")
    return {m.group(2): m.group(1) for m in
            re.finditer(r'Id="(rId\d+)"[^>]*Target="slides/(slide\d+)\.xml"', rels)}

def current_order(pkg: Path):
    pres = read(pkg / "ppt/presentation.xml")
    name_by_rid = {v: k for k, v in rels_map(pkg).items()}
    return [name_by_rid[r] for r in
            re.findall(r'<p:sldId id="\d+" r:id="(rId\d+)"\s*/>', pres)]

def set_order(pkg: Path, order):
    pres = read(pkg / "ppt/presentation.xml")
    entries = dict(re.findall(r'(<p:sldId id="\d+" r:id="(rId\d+)"\s*/>)', pres))
    by_rid = {rid: el for el, rid in entries.items()}
    rid_of = rels_map(pkg)
    unknown = [n for n in order if n not in rid_of]
    if unknown:
        raise SystemExit(f"not in this deck: {unknown}")
    lst = re.search(r"<p:sldIdLst>.*?</p:sldIdLst>", pres, re.S).group(0)
    new = "<p:sldIdLst>" + "".join(by_rid[rid_of[n]] for n in order) + "</p:sldIdLst>"
    write(pkg / "ppt/presentation.xml", pres.replace(lst, new))

def duplicate(pkg: Path, src: str, after: str):
    """Copy a slide, give it its own media part, and insert it after `after`."""
    nums = [int(re.sub(r"\D", "", p.stem)) for p in (pkg / "ppt/slides").glob("slide*.xml")]
    new = f"slide{max(nums)+1}"
    shutil.copy(pkg / f"ppt/slides/{src}.xml", pkg / f"ppt/slides/{new}.xml")
    srels = read(pkg / f"ppt/slides/_rels/{src}.xml.rels")
    img = re.search(r'\.\./media/([^"]+)', srels)
    newimg = None
    if img:
        ext = Path(img.group(1)).suffix
        newimg = f"image{max(nums)+1}{ext}"
        shutil.copy(pkg / "ppt/media" / img.group(1), pkg / "ppt/media" / newimg)
        srels = srels.replace(f"../media/{img.group(1)}", f"../media/{newimg}")
    write(pkg / f"ppt/slides/_rels/{new}.xml.rels", srels)

    # register the part and a presentation-level relationship
    ct = pkg / "[Content_Types].xml"
    s = read(ct)
    if f"/ppt/slides/{new}.xml" not in s:
        s = s.replace("</Types>",
            f'<Override PartName="/ppt/slides/{new}.xml" ContentType="application/vnd.'
            f'openxmlformats-officedocument.presentationml.slide+xml"/></Types>')
        write(ct, s)
    prels = pkg / "ppt/_rels/presentation.xml.rels"
    s = read(prels)
    nextrid = max(int(x) for x in re.findall(r'Id="rId(\d+)"', s)) + 1
    rid = f"rId{nextrid}"
    s = s.replace("</Relationships>",
        f'<Relationship Id="{rid}" Type="http://schemas.openxmlformats.org/officeDocument/'
        f'2006/relationships/slide" Target="slides/{new}.xml"/></Relationships>')
    write(prels, s)

    pres = pkg / "ppt/presentation.xml"
    s = read(pres)
    sid = max(int(x) for x in re.findall(r'<p:sldId id="(\d+)"', s)) + 1
    anchor_rid = rels_map(pkg)[after]
    anchor = re.search(r'<p:sldId id="\d+" r:id="' + anchor_rid + r'"\s*/>', s).group(0)
    s = s.replace(anchor, anchor + f'<p:sldId id="{sid}" r:id="{rid}"/>')
    write(pres, s)
    print(f"created {new}")
    if newimg:
        print(f"  write your artwork to: {pkg/'ppt/media'/newimg}")
    print(f"  order is now: {','.join(current_order(pkg))}")
    return new

def clean(pkg: Path):
    """Drop slide parts and media no longer reachable from the presentation."""
    keep = set(current_order(pkg))
    for p in sorted((pkg / "ppt/slides").glob("slide*.xml")):
        if p.stem not in keep:
            p.unlink()
            r = pkg / f"ppt/slides/_rels/{p.stem}.xml.rels"
            if r.exists(): r.unlink()
    used = set()
    for r in (pkg / "ppt/slides/_rels").glob("*.rels"):
        used |= set(re.findall(r'\.\./media/([^"]+)', read(r)))
    for r in list((pkg / "ppt").rglob("_rels/*.rels")):
        if "slides" not in str(r):
            used |= set(re.findall(r'\.\./media/([^"]+)', read(r)))
    dropped = []
    for m in sorted((pkg / "ppt/media").glob("*")):
        if m.name not in used:
            m.unlink(); dropped.append(m.name)
    # forget the relationships and overrides for deleted slides
    prels = pkg / "ppt/_rels/presentation.xml.rels"
    s = read(prels)
    for m in re.finditer(r'<Relationship Id="(rId\d+)"[^>]*Target="slides/(slide\d+)\.xml"/>', s):
        if m.group(2) not in keep:
            s = s.replace(m.group(0), "")
    write(prels, s)
    ct = pkg / "[Content_Types].xml"
    s = read(ct)
    for m in re.finditer(r'<Override PartName="/ppt/slides/(slide\d+)\.xml"[^>]*/>', s):
        if m.group(1) not in keep:
            s = s.replace(m.group(0), "")
    write(ct, s)
    if dropped:
        print(f"  dropped {len(dropped)} orphaned media file(s)")

def repack(pkg: Path, out: Path):
    out = Path(out); out.parent.mkdir(parents=True, exist_ok=True)
    if out.exists(): out.unlink()
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        for p in sorted(pkg.rglob("*")):
            if p.is_file():
                z.write(p, p.relative_to(pkg).as_posix())
    print(f"wrote {out}")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("pkg")
    ap.add_argument("out", nargs="?")
    ap.add_argument("--order", help="comma-separated source slide names, in delivery order")
    ap.add_argument("--duplicate"); ap.add_argument("--after")
    a = ap.parse_args()
    pkg = Path(a.pkg)
    if a.duplicate:
        if not a.after: raise SystemExit("--duplicate needs --after")
        duplicate(pkg, a.duplicate, a.after)
        return
    if a.order:
        order = [s.strip() for s in a.order.split(",") if s.strip()]
        print(f"keeping {len(order)} of {len(current_order(pkg))} slides")
        set_order(pkg, order)
        clean(pkg)
    if not a.out:
        raise SystemExit("give an output path to repack")
    repack(pkg, Path(a.out))
    print("\nNow validate, and then LOOK at the slides you changed:")
    print(f"  markitdown {a.out} | grep -c 'Slide number'")

if __name__ == "__main__":
    main()
