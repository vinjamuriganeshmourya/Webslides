#!/usr/bin/env python3
"""Deck surgery: re-head slide 40.

The deck heads slide 40 "Iterate Over Numbers / Range". By that point in the
session the room has had range for ten minutes and a card headed Range reads as
a step backwards; the card is the answer to the pattern question the room has
just written, so it is headed **Solution**.

Every slide is a flat image, so there is no text layer to edit. The two words
are therefore not typed: they are **lifted out of the deck's own other slides**,
where the same face is set at the same size in the same colour on the same
baseline. Slide 9 says "Possible Solutions"; the word Solution is cut out of it
one pixel before the final s. Slide 46 says "For Loop" in the eyebrow. Both are
pasted at slide 40's own heading coordinates.

    python deck_surgery.py          # rewrites media/sl40.webp from work/slides

Run it again and it produces the same file: it always starts from the untouched
capture in work/slides, never from its own output.
"""
import pathlib

from PIL import Image

HERE = pathlib.Path(__file__).parent
SRC = HERE / "work" / "slides"
MEDIA = HERE / "media"

# Measured off the captures, not guessed. The accent bar ends at x=38, so
# everything from x=45 right is the heading and may be cleared.
BAR_END = 45
HEAD_BOX = (BAR_END, 55, 1400, 250)

# slide 9: "Possible Solutions". The word gap before Solutions is 338..361 and
# the gap before the final s is 634..641.
SOLUTION_CUT = (355, 150, 637, 245)
SOLUTION_AT = (62, 150)          # slide 40's own title starts at x=68

# slide 46: "For Loop" in the eyebrow, x 58..225.
EYEBROW_CUT = (52, 60, 232, 135)
EYEBROW_AT = (52, 60)


def main():
    base = Image.open(SRC / "sl40.webp").convert("RGB")
    nine = Image.open(SRC / "sl9.webp").convert("RGB")
    forty6 = Image.open(SRC / "sl46.webp").convert("RGB")

    base.paste((255, 255, 255), HEAD_BOX)
    base.paste(forty6.crop(EYEBROW_CUT), EYEBROW_AT)
    base.paste(nine.crop(SOLUTION_CUT), SOLUTION_AT)

    out = MEDIA / "sl40.webp"
    base.save(out, "WEBP", quality=90, method=6)
    print(f"wrote {out} ({out.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
