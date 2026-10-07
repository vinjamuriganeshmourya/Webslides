# Gotchas

Every one of these cost real time in the build of session 11. Most bit more than once.
Read this before debugging anything.

---

## CSS that silently does nothing

**A missing token kills the whole declaration.** `--sans` was never defined in `:root`, so every
`font: 600 22px var(--sans)` in every inline SVG was invalid and dropped. All the diagram
typography had been falling back to 16px default for several rounds without anyone noticing,
including me. If SVG text looks uniformly wrong, check the tokens first.

**Flex and grid `gap` are dropped by the print pipeline.** Badges collided with their headings,
minute labels ran into nav labels, header words ran together. Put spacing on the children:

```css
.slide-head { display:flex }              /* no gap */
.slide-head > *          { margin-right:9px }
.slide-head > *:last-child { margin-right:0 }
```

**`inset` needs its long-hand alongside it.** `position:fixed; inset:48px 0 0` collapsed the
presenter slide to nothing in the print renderer. Always write both:

```css
inset:48px 0 0; top:48px; right:0; bottom:0; left:0;
```

**`min()` / `clamp()` need an `@supports` fallback.** The 16:9 presenter box is sized with
`min()`. Without a fallback the panel had no width and content sized to itself. Put the modern
path behind `@supports (width:min(10px,20px))` and give the plain path a sane full-width default.

**`transform-origin` on an SVG group is not honoured everywhere.** The hook's collapse landed in
the wrong place. Write the transform origin-independently instead — scaling by `s` about `(a,b)`
is `translate(a(1-s), b(1-s)) scale(s)` — and pin `transform-box:view-box; transform-origin:0 0`
so both paths agree.

---

## Markup that renders wrong

**`.selfck b { display:block }` turns any inline `<b>` into its own line.** This bit three
separate times in worksheet self-checks. Text came out as:

```
Type it in. Run
1 2 9
and check it against your trace, then run
5 2 1
```

Never use inline `<b>` inside a self-check paragraph. Use `<i>`, `<em>`, or `&#160;`-joined
plain text.

**`<u>` carries a default underline that older engines will not drop**, even with
`text-decoration:none`. Use `<em>` for string colouring in code blocks and set
`font-style:normal`.

**`→` is not in the monospace face.** It falls back to a proportional font, which breaks column
alignment in every line after it. Use `->` inside `<pre>`.

**SVG `<text>` and HTML table cells both collapse leading spaces.** Use x-offsets or `&#160;`.

---

## Page breaks

**`break-after:page` on every sheet plus a `:last-child` exemption produced a stray blank page.**
Use `break-before` on subsequent sheets instead — one break between sheets, none after the last:

```css
.sheet + .sheet { break-before:page; page-break-before:always }
```

Also: a page that looks blank may hold three ink pixels. Measure rather than eyeball:

```python
a = np.asarray(Image.open('page2.png').convert('L'))
m = a < 200
print('ink rows', np.where(m.any(1))[0].min(), '…', 'total px', m.sum())
```

---

## Editing the build script

**Regex-splitting a Python source file will silently swallow code.** Splitting one content block
with a lazy `(slide\(5,.*?)\n\]\)\n` pattern:

- truncated a slide's notes to `[,` — caught by the syntax error
- **deleted an entire activity panel** (`trace_stage` and `paper`) — caught only by a
  `NameError` at assembly time, and it had to be rewritten from memory

If you must split, print what each fragment captured and assert the slide numbers before writing.
Better: keep one definition per named variable from the start so no splitting is ever needed.

**A replacement that fails silently leaves the old text in place.** Every string replacement in
a patch script should `assert a in b` before replacing, and print the ones that missed. Several
retimings appeared to succeed while leaving stale numbers behind.

**Restoring a saved template can revert unrelated fixes.** Re-splicing `tail.txt` put the slide
count back to a stale value twice.

---

## State that goes stale

After any renumbering or retiming, sweep the whole file for stale references. These were all
found only by grepping:

- slide numbers in slide notes (`"they watched that at slide 13"`)
- slide numbers in the guide's answer table
- minute references in worksheet pills and guide prose
- `"page 1 of 2"` left on a worksheet that no longer has pages at all
- `"15 slides"` after it became 16
- a worksheet header claiming `"Each task says where in the session it happens"` after the
  timing pills were removed
- an eyebrow reading `"Multiple Elif Statements"` after that section was deleted
- a title reading `"Input / Output Format"` on a slide containing only the output format

Automate the sweep:

```python
stale = [x for x in ['slide 13','15 slides','minute 20','of 2<'] if x in html]
```

---

## A clean lint is necessary, not sufficient

Session 12's first build passed all twenty-five checks that existed at the time and was still
unusable: 29 blocks with a median duration of two minutes, 29 of 57 slides kept, five descending
slide ranges, a four-page worksheet, and the same beat five times over.

None of that is a coding error. It is all *judgement*, and the lint only measured mechanics. Nine
checks were added afterwards to catch the specific shapes — median duration, block count,
single-slide headings, card count, ascending ranges, repeated beats, worksheet pages, printed
self-checks, exit format. Expect the next bad build to fail in a way none of them catch either,
and add a check when it does.

**The two things no script can do, and they matter more than the script:** run every piece of
code in the plan, and open presenter view in a real browser and look at it.

## Verification that actually catches things

```python
# tag balance and unclosed elements
# every getElementById has matching markup
ids = re.findall(r"getElementById\('([^']+)'\)", html)
missing = [i for i in set(ids) if f'id="{i}"' not in html]

# slide numbers sequential from 1
nums = re.findall(r'slide-no">Slide (\d+)<', html)
assert nums == [str(i) for i in range(1, len(nums)+1)]

# durations sum to exactly 75
assert sum(int(x) for x in re.findall(r'sp-mins">(\d+) min<', html)) == 75

# note blocks never exceed five lines
for m in re.finditer(r'how to run this</summary>.*?<ul class="brief">(.*?)</ul>', html, re.S):
    assert m.group(1).count('<li') <= 5
```

Left unguarded, `getElementById` on missing markup silently no-ops if it is assigned to a
variable, and throws if chained — a half-finished feature sat in the file for three rounds
because it happened to be null-guarded.

---

## The renderer available in the Claude chat environment

`wkhtmltopdf` / `wkhtmltoimage`, which is **Qt WebKit from about 2014**. It cannot evaluate
`min()`, `clamp()`, `inset`, `transform-box`, flex `gap`, or modern `break-*`. So:

- everything above about fallbacks is unverifiable here — you can only check the fallback path
- say so plainly rather than implying the modern path was tested
- this is the single strongest argument for running this work in Claude Code with real Chromium

---

## Things that are cheap and always worth doing

- **Run the code.** Every output in the plan. Running the hook snippet across all four
  true/false combinations revealed it prints nothing on failure, which contradicted the
  narrative on the same panel.
- **Look at the render.** Every pixel edit had an artifact that code review would not have found:
  a clipped badge, a dragged bottom rule, a ghost of the old last line, a one-pixel seam.
- **Decode an image back out of the finished HTML** to check what actually shipped, rather than
  checking the file you encoded from.
- **A note that describes a slide's structure is checked against the slide, not the inventory.**
  Session 12's agenda note named "the mistakes" as the third stop; the slide says "Code
  Walkthrough". Count the stops on the picture.
- **Checkpoint and hard-floor labels must differ.** Two bands both reading "69 min" look like a
  typo on the sidebar. Write "Hard floor · exit at 69 min". Linted.
- **String-swapping the template is brittle.** One anchor matched twice and the build died. Use
  `{{EXTRA_CSS}}` / `{{EXTRA_JS}}` for the walker and overrides; keep swaps for the hook labels
  only, with an asserted count.

---

## CSS and layout traps that cost days on session 11

- **A stray selector before a comment kills the whole rule.** This shipped and stayed dead for
  weeks:

  ```css
  body.present /* height:auto keeps the drawing visible ... */
  body.present .stage svg.fig{ ... max-width:none ... }
  ```

  It parses as `body.present body.present .stage svg.fig`, which can never match, so **every SVG
  figure stayed capped at 820px and letterboxed** inside its slide. Comments go *above* the
  selector, never between a fragment of one and the rest. Fixed in the template.

- **Specificity, not source order, decides which clamp wins.** `body.present .stage pre.slabcode`
  (3 classes + 2 elements) beat `body.present .pollcols .slabcode` (3 classes + 1 element), so a
  "shrink the code in poll columns" rule silently did nothing for two rounds. When a size fix
  appears to have no effect, print `getComputedStyle(el).fontSize` before assuming the value is
  wrong.

- **Flex children shrink, including SVG icons.** A timer in a crowded control row kept its
  height and collapsed to 7px wide, because the icon was a shrinkable flex item. Anything inside
  a pill that must keep its size needs `flex:none` — the icon *and* the digits.

- **An SVG's viewBox aspect should match the box it lands in.** A 1000×520 map inside a 16:9
  slide is height-limited, so it renders ~200px narrower than the space available and the type
  looks small. Match the ratio (1000×450 for a 16:9-ish stage) before shrinking font sizes.

- **Measure every slide at once, in real full screen.** Slide-by-slide eyeballing missed
  overflow for days. Walk every slide and every step in one script, toggling `told`/`shown` so
  **revealed answers are measured too**, and compare against a slide known to be fine. Windowed
  presenter view is 48px shorter than full screen, so it over-reports.

- **Clones inherit state, and the presenter counts them.** The guide's thumbnails are live clones
  of each slide. Two consequences, both already handled in the template, both invisible until
  they bite: a `data-anim` card clones frozen on step 1 (set `an-<max>`, drop the attribute), and
  the presenter's slide list must exclude `.gthumb-in` or it reports 62 slides instead of 31.

- **A view fragment needs its own wrapper.** `{{GUIDE}}` is substituted raw, so the guide part
  must open with `<div id="guide-view">`. Dropping it makes the tab show nothing and leaks the
  guide into the main view — and no linter catches it, because the HTML is still valid.

- **Bash heredocs fail on large HTML/JS payloads.** `unexpected EOF while looking for matching
  quote`, repeatedly, on anything with nested quotes. Use the Write tool for any file of size;
  keep heredocs for short scripts.

- **Editing raster slide artwork is viable and often right.** Session 11's deck had the last four
  lines of a nested program at column zero — a real `NameError` for some inputs. Cropping the
  band and pasting it 89px right fixed it in the plan, measured against the code column. Keep the
  original in `originals/`, and report the defect so the source deck gets fixed too.

---

## SVG and staged cards (session 12)

**CSS beats a presentation attribute, always.** `fill="#fff"` on a `<text>` inside a coloured
band loses to `.tkmap text{fill:var(--dk-text)}`, and `stroke="orange"` on a path loses to
`.tkmap path{stroke:var(--dk-cyan)}`. Specificity does not enter into it — any rule beats any
attribute. Give the exceptions a class and style them in CSS; do not try to out-attribute a
stylesheet.

**A descendant selector needs an ancestor.** `.partmap .a1 .ring` does not match
`<rect class="ring a1">`, because an element is not its own ancestor. The ring came out with no
stroke at all and was simply invisible — nothing errors, nothing warns. Wrap it:
`<g class="a1"><rect class="ring" …></g>`.

**A staged `<g>` cannot edit what an earlier one drew.** The reveal mechanic only adds groups,
so a value that arrives on press 5 into a gap drawn on press 1 needs a white `.cover` rect in
the later group with the real text painted on top. For the same reason, a dashed question box
that a solid card replaces must be drawn a few px *inside* that card, or its stroke haloes out
around the answer.

**No `body.present` font override on SVG text.** A `px` clamp inside an SVG is read as user
units, not screen pixels, so `clamp(13px,1.35vw,20px)` silently becomes 20 user units and the
labels grow out of their boxes. The SVG already scales with the card; leave it alone.

**A marker that moves between nodes must travel the drawn edges.** Tweening `transform` from
node to node cuts a diagonal across the chart, which is exactly wrong when the whole point is
that control flows *back up the line it came down*. Give each edge its polyline and walk the
marker segment by segment, splitting a fixed time budget by segment length.

## Two that are not about CSS

**`class="pcard"` and nothing else.** Both linters count cards with `class="pcard"` — closing
quote included — so appending a second class makes every panel invisible to them. The card
count comes out short and "the guide covers every slide" fails on a guide that is correct.

**Never build a patch script in a bash heredoc if it contains escapes.** `\n`, `\b` and `\\`
are all eaten before Python sees them: `\b` arrives as a literal backspace (0x08) and the regex
silently matches nothing; `\n` becomes a real newline and the file no longer parses. This cost
four separate rounds in one session. Write the script with the Write tool, then run it.

---

## Splitting one file into three (session 12)

**Deleting a selector from a multi-selector rule takes the declaration with it.**
Removing `body.present #guide-view,body.present #handout-view{display:none}` as a
whole line left this:

```css
body.present .sidepanel,body.present .hero,body.present .note,
body.present .wrap{margin:0;max-width:none;padding:0}
```

`.sidepanel` no longer had a `display:none` — it joined the *next* rule instead. The
sidebar then painted over every slide in presenter mode, and nothing failed: the
linter passed, the page threw nothing, and it was only visible because a thumbnail
came out with the nav bar across it. When you cut one selector out of a list, check
what the remaining selectors are now declaring.

**The presenter resets a staged card every time it becomes active.** `render()` calls
`animGo(1)`, so anything you set at load is undone the moment you navigate. A screen-
shotting pass has to prep each card *after* it is active, and should ask the card's
own controller for its last step rather than poking `.an-N` classes.

**A screenshot of an element is a screenshot of its box**, including whatever is
painted over it. In presenter mode the active card already fills the viewport, so a
viewport shot is the card — and it composites correctly.

**`loading="lazy"` on a `data:` URI buys nothing.** The bytes are already in the file;
all it does is leave the document blank as somebody scrolls it.


# Gotchas earned on the DSA plans

Everything above still applies. These bit on a sibling skill first and every one of them
applies here unchanged.

## A card that overflows paints over its own title

The one that wasted the most time, because **it does not show up in `scrollHeight`**.

`.stage-step` is `display:flex; flex-direction:column; justify-content:center`. When its
content is taller than the step, `justify-content:center` overflows it **at both ends** - the
question paints over the card's title above, and the controls over the rule below. `overflow`
on the stage is `hidden`, so `scrollHeight === clientHeight` and every automated check says
the card is fine.

Measure it like this, in the browser, in presenter view:

```js
const cards = [...document.querySelectorAll('.wrap .slide, .wrap .pcard')];
for (const c of cards) {
  cards.forEach(x => x.classList.remove('active'));
  c.classList.add('active');                       // only the active card has a box
  const step = c.querySelector('.stage-step.on');
  const kids = [...step.children].filter(k => getComputedStyle(k).display !== 'none');
  const top = Math.min(...kids.map(k => k.getBoundingClientRect().top));
  const bot = Math.max(...kids.map(k => k.getBoundingClientRect().bottom));
  console.log(c.dataset.label, Math.round(bot - top - step.getBoundingClientRect().height));
}
```

Anything above 0 overflows. Do not step through with the Next button and measure as you go:
the click does not settle before the next statement runs, and you measure the same card
three times.

**Measure it twice: once closed, once with every `.ans` given the `shown` class.** A revealed
answer plus its Reveal row is about 110px on a 447px card, so four cards that fitted perfectly
overflowed the moment the answer appeared. The fix is to make the answer *replace* rather than
stack; the rules are in `assets/panel-chrome-reference.txt` §7.

## A stepped card reveals everything at once when the figure is not in the stepper

The points step, the figure sits outside `.an-N` and is simply always there, so the card's
punchline is on screen before its setup. Every element of a stepped card belongs to a step.

## Arrow keys on a panel with its own controls also advance the deck

Both listen. Stop propagation on the panel node, or one press does two things and the
instructor loses their place in front of the room.

## Do not read opacity during a transition

Staged elements transition over about 180ms. `getComputedStyle(el).opacity` read immediately
after a class change returns the **animating** value, not the target, which makes a working
reveal look broken and sends the debugging down a false trail. Disable the transition first:

```js
document.head.appendChild(Object.assign(document.createElement('style'),
  {textContent:'.ans,.hint{transition:none !important}'}));
```

## `an-N` is the controller's namespace, and it is exclusive

The controller does `classList.toggle('an-'+k, k===at)`, so at step 3 the stage has `an-3`
and **no longer has** `an-2`. Two consequences, each of which broke a build:

- a rule written only as `.an-2 .hint` makes the hint disappear when the answer arrives.
  Every cumulative reveal must name each step it survives into;
- child markers must not be called `an-2` or `an-3`. Reusing the controller's class names on
  descendants collides, and the symptom only shows on the third keypress.

## The controls must be inside the stage but outside the slide box

The controller resolves its buttons with `stage.querySelector('[data-anim-next]')`, so they
must be inside the stage. The slide box is `overflow:hidden` with a locked aspect ratio, so
they cannot be inside *that*. Put them in the slide box and they are invisible; put them
outside the stage and they do nothing.

## The title tag carries an em-dash from the template

`<title>{{SESSION}} — lesson plan</title>` ships one straight out of the template, and the
em-dash rule covers the tab title too. Replace it in the builder, and check all three files.

## Doc-view screenshots come out blank

`html{scroll-behavior:smooth}` means `scrollIntoView` has not arrived when the screenshot is
taken. Inject `html{scroll-behavior:auto !important}`, or use an instant `window.scrollTo`
before the shot.

## Check the answers by deriving them, not by re-reading them

Re-reading an answer key proves the key is self-consistent. Import the builder, recompute
every printed answer from the code or the sequence it came from, then grep the guide for each
one and the worksheet against it. That is what catches an answer that was right when it was
written and wrong after the input changed.
