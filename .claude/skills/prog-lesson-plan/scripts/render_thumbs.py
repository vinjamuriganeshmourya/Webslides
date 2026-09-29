#!/usr/bin/env python3
"""
render_thumbs.py — screenshot every card of a presenter file, for the guide.

    python3 scripts/render_thumbs.py "out/12 - Loops_student_view.html" out/thumbs
    python3 scripts/render_thumbs.py "out/12 - Loops_student_view.html" out/thumbs --width 660

The instructor guide is its own document now, so it cannot clone the real cards
the way it used to. These images take that job. **Run this from build.py, on the
presenter file that same run just wrote** — a thumbnail is only as honest as the
build it came from, and rendering it separately is how a guide ends up showing a
slide that no longer exists.

Each card is photographed in presenter mode, at 1600x900, in the state the guide
used to clone:

  - staged cards (data-anim) at their LAST step, not their first, because a
    picture of step one is a picture of almost nothing;
  - timers and stage controls removed, so no thumbnail shows a live clock;
  - stepped cards (.stage-step) left on step one, answers still hidden — the
    guide must never leak an answer the room has not been given.

Writes cardNN.webp, numbered from 1 in presenter order, and prints a one-line
summary the builder can assert on.

Only the cards that changed are re-shot
---------------------------------------
Photographing 31 cards takes 52 seconds, and a build ran it in full to change one
sentence, which is most of why "change one thing" felt like rebuilding the plan.

Each card is fingerprinted from its own markup plus every `<style>` in the
document, and the picture is stored under that fingerprint in a cache beside the
output directory. A rebuild copies what it already has and photographs only what
is new. The cache is content-addressed, not indexed, so inserting a card at
position 3 still reuses the other thirty.

A CSS edit changes every fingerprint, because it can change every card. That is
the honest answer, and it is the case worth paying for.

    --no-cache      photograph everything, whatever the cache holds
    --cache DIR     where to keep the pictures (default: `.thumbcache` beside outdir)
"""
import argparse, io, os, shutil, sys

# Bump this when PREP_ONE or the shot geometry changes: the cache is keyed on it,
# so an old picture taken under different rules is never handed back.
CACHE_VERSION = 1

# SHA is not available on file:// in every build of Chrome, so this is a plain
# 64-bit FNV-1a over the card's markup and the document's styles. Two cards
# colliding would need the same 64 bits; a card changing without its markup
# changing is the failure that matters, and that cannot happen.
FINGERPRINTS = """() => {
  const h = (s) => {
    let a = 0x811c9dc5 >>> 0, b = 0x01000193 >>> 0;
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      a = Math.imul(a ^ c, 16777619) >>> 0;
      b = Math.imul((b + c) >>> 0, 2246822519) >>> 0;
    }
    return a.toString(16).padStart(8, '0') + b.toString(16).padStart(8, '0');
  };
  const css = h([...document.querySelectorAll('style')]
                .map(s => s.textContent).join(''));
  return [...document.querySelectorAll('.slide, .pcard')]
           .map(c => css + h(c.outerHTML));
}"""

# Prep runs per card, AFTER navigating to it: the presenter's render() resets a
# staged card to step 1 every time it becomes active, so anything done at load
# is undone the moment you jump. Ask the card's own controller for its last step
# rather than poking classes, or the reset wins.
PREP_ONE = """() => {
  const c = document.querySelector('.slide.active, .pcard.active');
  if (!c) return false;
  c.querySelectorAll('.tmr, .stage-ctl, details').forEach(n => n.remove());
  const st = c.querySelector('.stage[data-anim]');
  if (st) {
    const max = parseInt(st.dataset.anim, 10) || 1;
    if (typeof st.animGo === 'function') st.animGo(max);
    else { for (let k = 1; k <= max; k++) st.classList.remove('an-' + k);
           st.classList.add('an-' + max); }
  }
  return true;
}"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('plan')
    ap.add_argument('outdir')
    ap.add_argument('--width', type=int, default=660,
                    help='stored width in px; the guide shows them at 440')
    ap.add_argument('--quality', type=int, default=72)
    ap.add_argument('--cache', default=None,
                    help='picture cache (default: .thumbcache beside outdir)')
    ap.add_argument('--no-cache', action='store_true',
                    help='photograph every card, whatever the cache holds')
    ap.add_argument('--chrome', default=os.path.expanduser(
        '~/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'))
    a = ap.parse_args()

    try:
        from playwright.sync_api import sync_playwright
        from PIL import Image
    except ImportError as e:
        raise SystemExit(f'render_thumbs needs playwright and pillow: {e}')

    plan = os.path.abspath(a.plan)
    if not os.path.exists(plan):
        raise SystemExit(f'no such presenter file: {plan}')
    if os.path.isdir(a.outdir):
        shutil.rmtree(a.outdir)
    os.makedirs(a.outdir, exist_ok=True)

    # The cache lives BESIDE the output directory, because the line above wipes
    # the output directory on every run and always has: the guide asserts that
    # the number of pictures equals the number of cards, and a stale picture
    # left behind from a longer build would satisfy that assertion and be wrong.
    cache = os.path.abspath(a.cache) if a.cache else os.path.join(
        os.path.dirname(os.path.abspath(a.outdir)), '.thumbcache')
    os.makedirs(cache, exist_ok=True)

    def cache_path(fp):
        return os.path.join(
            cache, 'v%d-%d-%d-%s.webp' % (CACHE_VERSION, a.width, a.quality, fp))

    url = 'file:///' + plan.replace('\\', '/')
    exe = a.chrome if os.path.exists(a.chrome) else None
    errs = []
    n = 0

    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path=exe)
        pg = b.new_page(viewport={'width': 1600, 'height': 900},
                        device_scale_factor=2)
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(url)
        pg.wait_for_timeout(700)

        fps = pg.evaluate(FINGERPRINTS)
        total = len(fps)
        if a.no_cache:
            want = list(range(1, total + 1))
        else:
            want = [i for i in range(1, total + 1)
                    if not os.path.exists(cache_path(fps[i - 1]))]
        reused = total - len(want)

        if want:
            pg.keyboard.press('p')
            pg.wait_for_timeout(300)
            pg.keyboard.press('f')
            pg.wait_for_timeout(400)

        for i in want:
            pg.keyboard.press('a')
            pg.wait_for_timeout(200)
            pg.click(f'#p-grid-in .p-cell:nth-child({i})')
            pg.wait_for_timeout(380)
            if not pg.evaluate(PREP_ONE):
                errs.append(f'card {i}: nothing active after jumping to it')
                continue
            pg.wait_for_timeout(520)          # let the last step finish animating
            # the active card fills the viewport in presenter mode, so a viewport
            # shot IS the card -- an element shot would also capture anything
            # painted over its box
            png = pg.screenshot(type='png')
            im = Image.open(io.BytesIO(png)).convert('RGB')
            h = round(im.height * a.width / im.width)
            im = im.resize((a.width, h), Image.LANCZOS)
            im.save(cache_path(fps[i - 1]), 'WEBP',
                    quality=a.quality, method=6)
            n += 1
        b.close()

    # Every card's picture now exists in the cache, whether this run took it or
    # a run last week did. The output directory is the numbered copy of it.
    for i in range(1, total + 1):
        src = cache_path(fps[i - 1])
        if os.path.exists(src):
            shutil.copyfile(src, os.path.join(a.outdir, 'card%02d.webp' % i))

    if errs:
        for e in errs[:5]:
            print('  !', e, file=sys.stderr)
    wrote = len([f for f in os.listdir(a.outdir) if f.endswith('.webp')])
    total_kb = sum(os.path.getsize(os.path.join(a.outdir, f))
                   for f in os.listdir(a.outdir)) / 1024
    print(f'{wrote} thumbnails -> {a.outdir}  ({total_kb:.0f} KB total, '
          f'{total_kb / max(wrote, 1):.0f} KB each)')
    print(f'  {n} photographed, {reused} reused from {cache}')
    if errs or wrote != total:
        raise SystemExit(f'expected {total} thumbnails, wrote {wrote}')


if __name__ == '__main__':
    main()
