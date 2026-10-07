# Deck surgery — editing these decks at pixel level

> Since 2026-09-29 a kept deck slide is **redrawn** in the new design
> (`ndt_theme.light()`, see SKILL.md 5a), so this page is only for the rare
> slide kept as the deck's picture: a photograph or an illustration that
> cannot be redrawn. A code or text slide is never edited here any more.

Everything here was verified against the CCBP 4.0 session decks. Re-verify on a new series.

---

## What you are working with

Every slide in these decks is **one flat full-bleed PNG at 1920×1080**. There is no text layer,
no embedded font, and the theme fonts are Office defaults. So:

- You **cannot** re-flow text, restyle a paragraph, or fix a typo through XML.
- You **can** delete, reorder and duplicate slides losslessly.
- You **can** edit slide artwork as image pixels — and because the palette and fonts are now
  known, new slides can be made indistinguishable from real ones.

Check first, though. If a new deck has a real text layer, edit the XML instead — it is far cheaper.

```bash
python3 -c "
import re
s=open('unp/ppt/slides/slide20.xml').read()
print('editable text runs:', len(re.findall(r'<a:t>',s)))"
```

---

## Fonts

| Role | Face | How it was identified |
|---|---|---|
| Code | **Fira Mono** | Round colon dots and a tailed lowercase `l`. DejaVu and Liberation both have square colons. |
| Titles / body | **not a free face** | Fifteen candidates scored against two real titles by pixel overlap; best was 40%. A true match scores 85%+. Almost certainly a licensed face (Gilroy class). |

**Consequence:** any new *code* can be typeset exactly. Any new *title* cannot, unless you have
the brand font. Get the font file from the design team — it unblocks retitling slides and building
section dividers.

Fira Mono, calibrated from the deck's own metrics:

```python
from PIL import ImageFont
f = ImageFont.truetype('fonts/FiraMono.ttf', 37)   # advance 22.2px
# The deck's own advance is 21.94px, measured as (x_right - x_left)/chars on a known line.
# Derive size from the deck rather than assuming: size = 37 * 21.94 / measured_advance
```

Download: `https://cdn.jsdelivr.net/gh/mozilla/Fira@master/ttf/FiraMono-Regular.ttf`
(GitHub `raw` URLs returned HTML, not font data. Use the CDN. `.woff` files need
`fontTools` to convert: `TTFont(f); t.flavor=None; t.save(out)`.)

---

## Palette (sampled, not guessed)

```
Code syntax          identifiers  #24292E      keywords/operators #D73A49
                     functions    #005CC5      brackets           #6F42C1
                     strings      #22863A      numbers            #005CC5

Slide chrome         brand blue   #006DAF      accent cyan        #3FB5E5
                     body grey    #434343      eyebrow grey       #6A6A6A
                     code card    #F2F2F0      fault band (pink)  #F4CCCC
                     badge fill   #085799      error red          #C7454E
```

That syntax set is GitHub-light, which is presumably what generated the originals.

---

## Slide geometry (CCBP code slides)

| Thing | Value |
|---|---|
| Slide | 1920 × 1080 |
| Code card | rows 270–1058, cols 108–1103 |
| First code line | baseline y = 298 |
| Line pitch | **62 px** |
| Indent unit | **90 px** (4 spaces) |
| Character advance | **22.5 px** |
| Column 0 ink starts | x ≈ 212 |
| Header eyebrow | y 83–121 |
| Header title | y 145–240 |
| `Code` badge | y 236–293, x 949–1065 |
| Bottom blue rule | y 1069–1079 |

Measure these on a new deck rather than trusting them. Find the card by masking for its grey,
find lines by profiling ink rows inside it.

---

## Techniques that work

### Delete, reorder and add slides

Order lives in `ppt/presentation.xml` → `<p:sldIdLst>`. Filter or reorder the `<p:sldId>`
elements, then run `clean.py` to drop orphaned parts.

```python
rid2name = {m.group(1): m.group(2) for m in
    re.finditer(r'Id="(rId\d+)"[^>]*Target="slides/(slide\d+)\.xml"', rels)}
# keep/reorder by name, rewrite <p:sldIdLst>, then clean.py, then rezip
```

To add a slide, duplicate one with the layout you want, then **give it its own image part** —
a duplicated slide shares the source's image, so editing it would change both:

```bash
python add_slide.py unp/ slide20.xml --after slide22.xml   # creates slide42.xml
# then copy your PNG to media/image42.png and repoint slide42.xml.rels
```

### Move an indent (make a correct version, or a faulty one)

Both directions are a pure block translation of 90 px. This is how the correct greatest-of-three
slide and its faulty twin were made from each other.

```python
for ya, yb in [(788,842),(848,901),(913,958),(972,1026)]:   # the lines to move
    strip = a[ya:yb, 150:1000].copy()
    a[ya:yb, 150:1000] = GREY
    a[ya:yb, 150+90:1000] = strip[:, :850-90]     # right; reverse the slice to go left
```

### Lift a highlight band off text (alpha unmix)

To move text that sits on a coloured fault band, you cannot just translate it — the band comes
too. Unmix it: the band is a flat colour and the ink palette is small, so solve for alpha against
each palette entry and keep the best fit.

```python
for k, I in enumerate(PALETTE):
    d  = BAND - I
    al = np.clip(((BAND - region) @ d) / (d @ d), 0, 1)
    err = np.linalg.norm(al[...,None]*I + (1-al[...,None])*BAND - region, axis=2)
    take = err < best_err          # keep the palette entry that explains the pixel
# then recomposite: out = al*I + (1-al)*CARD_GREY
```

Result on a 2-megapixel slide: ~390 stray pixels. Invisible.

**Set the background first.** Writing only the ink pixels leaves the original band showing —
this cost two rebuilds.

### Borrow real type instead of setting it

You cannot set a title without the brand font, but you can lift one. Both of these worked:

- an eyebrow copied from another slide in the same deck, same y-range, same x-offset
- the word "Example" lifted from **session 10's rendered PDF**, same template, same position

Check the target slide's margins first — they are not always identical (one slide had its
header at x=86 where others were at x=60).

### Shorten a code card to its content

Copy the card's real bottom edge and shadow upward, then white out below. Pick a donor strip
with **no glyph ink in it** — the first attempt dragged the tail of the old last line, and the
second dragged the blue bottom rule.

```python
edge = src[1025:1066, 20:1150]     # padding + edge + shadow, verified glyph-free
a[900:941, 20:1150] = edge
a[941:1068, 20:1150] = 255         # start exactly where the paste ended, or a 1px seam remains
```

### Delete a callout

White out the region, then repair whatever it overlapped by tiling one clean row or column
from elsewhere on the same slide. Arrows frequently overlap the card border, so check the
bounding box before you wipe.

---

## Rendering slides for embedding

**Use the media PNGs directly. Do not go through PDF.**

Each slide *is* one 1920×1080 PNG, so `ppt/media/imageN.png` is the lossless source. Exporting
to PDF and rasterising adds two lossy steps and a resolution cut for nothing.

```python
img = re.search(r'media/([^"]+)', open(f'slides/_rels/{name}.xml.rels').read()).group(1)
Image.open('ppt/media/'+img).convert('RGB').save(out, 'WEBP', quality=88, method=6)
```

Native 1920×1080 at quality 88 is about 54 KB a slide — 16 slides is 865 KB, ~1.2 MB base64.
Worth it: this is what the projector shows in full screen.

---

## Always validate

```bash
python validate.py revised.pptx --original deck.pptx
markitdown revised.pptx | grep -c "Slide number"     # confirm the count
```

Then render the changed slides and **look at them**. Every artifact in this playbook was found
by looking, not by reading code.
