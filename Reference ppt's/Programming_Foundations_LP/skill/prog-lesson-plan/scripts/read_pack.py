#!/usr/bin/env python3
"""
read_pack.py - make images cheap to look at.

    python3 read_pack.py work/slides work/read              # downscale + contact sheets
    python3 read_pack.py out/peek out/read --per 6
    python3 read_pack.py work/slides work/read --only 4,7,12-15 --width 1200
    python3 read_pack.py out/shots/_full out/shots --numbers name --per 0

Why this exists
---------------
Reading a 1920x1080 slide costs about 1,840 tokens, and it stays in context for
the rest of the session. A 53-slide deck is ~98k tokens before a single line of
the plan is designed, and the previous session's deck is another ~105k. That is
half a build, spent on pixels most of which get cut.

Two sizes, two jobs:

  contact sheet   6 cards tiled into one 1536x864 image, each cell numbered.
                  ~205 tokens per card. Enough to see layout, overflow, a
                  clipped figure, a near-duplicate neighbour. NOT enough to
                  read code. This is the sweep.

  single          one card at --width (default 768). ~440 tokens. Enough to
                  read the slide. This is the confirm, and you only pay it for
                  the slides the sweep flagged.

So: look at the sheets, then name the slides you actually need, then re-run
with --only for those. Never read a directory of full-size shots one by one.

Writes:
    <out>/NN.webp          one per input, downscaled to --width
    <out>/sheet01.webp ...  the contact sheets
    <out>/INDEX.md         which numbers are on which sheet, and the sizes
"""
import argparse
import os
import re
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    raise SystemExit("read_pack needs pillow:  pip install pillow")

EXTS = {".png", ".webp", ".jpg", ".jpeg"}
# Read downscales anything wider than this anyway, so a "full size" read of a
# 1920px shot is really a 1568px read. Quoted costs assume that.
READ_CAP = 1568


def tokens(w, h):
    """What Read will charge for an image this size, after its own cap."""
    if w > READ_CAP:
        h = round(h * READ_CAP / w)
        w = READ_CAP
    return (w * h) / 750


def natural(p: Path):
    """sl2 before sl10, card07 before card10."""
    return [int(t) if t.isdigit() else t for t in re.split(r"(\d+)", p.name)]


def parse_only(spec):
    """'4,7,12-15' -> {4,7,12,13,14,15}"""
    want = set()
    for part in spec.split(","):
        part = part.strip()
        if not part:
            continue
        if "-" in part:
            a, b = part.split("-", 1)
            want.update(range(int(a), int(b) + 1))
        else:
            want.add(int(part))
    return want


def load_font(px):
    for cand in ("C:/Windows/Fonts/arialbd.ttf",
                 "C:/Windows/Fonts/segoeuib.ttf",
                 "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
                 "/System/Library/Fonts/Helvetica.ttc"):
        try:
            return ImageFont.truetype(cand, px)
        except Exception:
            continue
    return ImageFont.load_default()


def labelled(cell, text, font, bar):
    """Number the cell on a strip ABOVE it, never on top of it.

    The number used to be drawn into the corner of the card, which sat exactly
    where these decks put their eyebrow line - slide 17's "...e Over Characters"
    was half hidden by its own label. A finding you cannot read is worse than no
    sheet at all, so the number gets its own band.
    """
    w, h = cell.size
    out = Image.new("RGB", (w, h + bar), (32, 38, 45))
    d = ImageDraw.Draw(out)
    d.text((max(4, w // 90), max(1, (bar - font.size) // 2) if hasattr(font, "size")
            else 2), text, fill=(255, 255, 255), font=font)
    out.paste(cell, (0, bar))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src", help="directory of images, or a single image")
    ap.add_argument("out", help="directory to write the read copies into")
    ap.add_argument("--width", type=int, default=768,
                    help="stored width of a single read copy (default 768)")
    ap.add_argument("--per", type=int, default=6,
                    help="cells per contact sheet, 0 to skip sheets (default 6)")
    ap.add_argument("--sheet-width", type=int, default=1536,
                    help="contact sheet width; keep it under Read's 1568 cap")
    ap.add_argument("--cols", type=int, default=3)
    ap.add_argument("--only", default=None,
                    help="slide numbers to emit singles for, e.g. 4,7,12-15")
    ap.add_argument("--numbers", default="index", choices=["index", "name"],
                    help="where a card's number comes from. index (default) "
                         "numbers the images 1..N in order. name reads it out "
                         "of the filename, which is what a partial shoot needs: "
                         "a directory holding only 007.png and 019.png is cards "
                         "7 and 19, not cards 1 and 2, and a sheet that says "
                         "otherwise sends you to fix the wrong card")
    ap.add_argument("--quality", type=int, default=74)
    a = ap.parse_args()

    src, out = Path(a.src), Path(a.out)
    if not src.exists():
        raise SystemExit(f"no such path: {src}")
    files = ([src] if src.is_file()
             else sorted((p for p in src.iterdir()
                          if p.suffix.lower() in EXTS), key=natural))
    if not files:
        raise SystemExit(f"no images in {src}")
    out.mkdir(parents=True, exist_ok=True)

    if a.numbers == "name":
        nums = []
        for k, f in enumerate(files, 1):
            digits = re.findall(r"\d+", f.stem)
            nums.append(int(digits[0]) if digits else k)
    else:
        nums = list(range(1, len(files) + 1))

    only = parse_only(a.only) if a.only else None
    before = 0.0
    singles = 0
    for i, f in zip(nums, files):
        im = Image.open(f)
        before += tokens(*im.size)
        if only is not None and i not in only:
            continue
        im = im.convert("RGB")
        h = max(1, round(im.height * a.width / im.width))
        im.resize((a.width, h), Image.LANCZOS).save(
            out / f"{i:02d}.webp", "WEBP", quality=a.quality, method=6)
        singles += 1

    sheets = []
    if a.per:
        cols = min(a.cols, a.per)
        rows = -(-a.per // cols)
        cw = a.sheet_width // cols
        probe = Image.open(files[0])
        ch = max(1, round(cw * probe.height / probe.width))
        font = load_font(max(13, cw // 26))
        bar = getattr(font, "size", 13) + 8
        for s, start in enumerate(range(0, len(files), a.per), 1):
            chunk = files[start:start + a.per]
            used_rows = -(-len(chunk) // cols)
            sheet = Image.new("RGB", (cw * cols, (ch + bar) * used_rows), (32, 38, 45))
            for k, f in enumerate(chunk):
                cell = Image.open(f).convert("RGB").resize((cw, ch), Image.LANCZOS)
                cell = labelled(cell, str(nums[start + k]), font, bar)
                sheet.paste(cell, ((k % cols) * cw, (k // cols) * (ch + bar)))
            p = out / f"sheet{s:02d}.webp"
            sheet.save(p, "WEBP", quality=a.quality, method=6)
            sheets.append((p, nums[start], nums[start + len(chunk) - 1],
                           sheet.size))

    after = sum(tokens(*Image.open(p).size) for p, *_ in sheets)
    lines = [f"# Read pack for `{src}`", "",
             f"{len(files)} images. Look at the **sheets** first; they carry the "
             f"card number in the corner. Then re-run with `--only <numbers>` "
             f"for the ones you actually need to read.", ""]
    if sheets:
        lines += ["| sheet | cards | px | est. tokens |", "|---|---|---|---|"]
        for p, lo, hi, (w, h) in sheets:
            lines.append(f"| `{p.name}` | {lo}-{hi} | {w}x{h} | {tokens(w, h):,.0f} |")
        lines.append("")
    lines += [f"- reading all {len(files)} at source size: **~{before:,.0f} tokens**",
              f"- reading the {len(sheets)} sheet(s) instead: **~{after:,.0f} tokens**"
              f" ({before / max(after, 1):.0f}x cheaper)",
              f"- one single at {a.width}px: ~{tokens(a.width, round(a.width * 9 / 16)):,.0f} tokens"]
    (out / "INDEX.md").write_text("\n".join(lines), encoding="utf8")

    print(f"{len(files)} images -> {out}")
    print(f"  singles       : {singles} at {a.width}px")
    print(f"  contact sheets: {len(sheets)}")
    print(f"  reading all at source size ~{before:,.0f} tokens; "
          f"sheets instead ~{after:,.0f} tokens ({before / max(after, 1):.0f}x cheaper)")
    print(f"  index -> {out / 'INDEX.md'}")


if __name__ == "__main__":
    main()
