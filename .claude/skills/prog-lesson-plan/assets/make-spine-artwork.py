#!/usr/bin/env python3
"""Turn the user's `Fixed Slides/` screenshots into the spine artwork.

The six PNGs in `Fixed Slides/` are the slides as the room sees them. They are
screenshots, so two things have to be fixed before a builder can use them:

  * the title slide carries a few rows of black at the top and the bottom, left
    over from the capture, and
  * the title slide has one session's name burnt into it.

This script crops the black, clears the name out of the white pill row by row
(the pill is solid white, so the clear is exact and the rounded edge is never
touched), and writes six webp files at 1920x1080:

    welcome.webp  recap.webp  title-blank.webp  quiz.webp
    feedback.webp thankyou.webp

`standard_slides.Spine` draws the session's own name onto `title-blank.webp`.
Run this only when the user replaces a slide in `Fixed Slides/`:

    python3 assets/make-spine-artwork.py "C:/Lesson Plans New/Fixed Slides" assets/standard-slides
"""

import pathlib
import sys

from PIL import Image

W, H = 1920, 1080

# source file -> what the spine calls it
SOURCES = {
    'Welcome.png': 'welcome.webp',
    'Recap.png': 'recap.webp',
    'Session title slide.png': 'title-blank.webp',
    'Classroom Quiz.png': 'quiz.webp',
    'Feedback.png': 'feedback.webp',
    'Thank You.png': 'thankyou.webp',
}

# Measured on `Session title slide.png` once cropped. The white pill runs
# 259..1637 across and 367..705 down; the CCBP logo ends at x=755 and the
# session name starts at x=879. Everything right of the logo gets cleared.
TITLE_CLEAR_FROM_X = 800


def crop_capture_bars(im, margin=16):
    """Drop the rows and columns the screen recorder left on the edges.

    The capture leaves a few black rows top and bottom, and sometimes one pale
    grey row outside them, so the outermost row is not always the dark one.
    Look `margin` rows in from each edge, find the last dark one, and cut
    everything up to and including it.
    """
    px = im.load()
    w, h = im.size
    step_x = max(1, w // 160)
    step_y = max(1, h // 160)

    def dark_row(y):
        xs = range(0, w, step_x)
        return sum(1 for x in xs if sum(px[x, y]) < 30) / len(list(xs)) > 0.9

    def dark_col(x):
        ys = range(0, h, step_y)
        return sum(1 for y in ys if sum(px[x, y]) < 30) / len(list(ys)) > 0.9

    top = 0
    for y in range(min(margin, h // 4)):
        if dark_row(y):
            top = y + 1
    bot = h
    for y in range(h - 1, max(h - margin, h * 3 // 4) - 1, -1):
        if dark_row(y):
            bot = y
    left = 0
    for x in range(min(margin, w // 4)):
        if dark_col(x):
            left = x + 1
    right = w
    for x in range(w - 1, max(w - margin, w * 3 // 4) - 1, -1):
        if dark_col(x):
            right = x
    return im.crop((left, top, right, bot))


def clear_title_text(im):
    """White out the session name, leaving the pill and the logo alone.

    Row by row: find the leftmost and rightmost white pixel on the row, which
    are the pill's own edges, then paint white from `TITLE_CLEAR_FROM_X` to the
    right edge. The pill's anti-aliased rim is not pure white, so it is never
    inside the run and never gets painted over.
    """
    px = im.load()
    w, h = im.size
    white = (255, 255, 255)

    def is_white(p):
        return p[0] > 247 and p[1] > 247 and p[2] > 247

    touched = 0
    for y in range(h):
        row = [x for x in range(w) if is_white(px[x, y])]
        if len(row) < 200:
            continue                      # not a pill row
        left, right = row[0], row[-1]
        if left > TITLE_CLEAR_FROM_X:
            continue
        for x in range(TITLE_CLEAR_FROM_X, right + 1):
            px[x, y] = white
        touched += 1
    if touched < 100:
        raise SystemExit('make-spine-artwork: the white pill was not found; '
                         'the title slide is not the shape this script knows')
    return im


def main(src_dir, out_dir):
    src = pathlib.Path(src_dir)
    out = pathlib.Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    for fname, target in SOURCES.items():
        path = src / fname
        if not path.exists():
            raise SystemExit(f'make-spine-artwork: missing {path}')
        im = crop_capture_bars(Image.open(path).convert('RGB'))
        if target == 'title-blank.webp':
            im = clear_title_text(im)
        im = im.resize((W, H), Image.LANCZOS)
        im.save(out / target, 'WEBP', quality=92, method=6)
        print(f'{fname:26} -> {target:20} {(out / target).stat().st_size:>7} bytes')


if __name__ == '__main__':
    main(*(sys.argv[1:3] or ['Fixed Slides', 'assets/standard-slides']))
