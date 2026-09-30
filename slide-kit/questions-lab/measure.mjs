/**
 * TYPE MEASUREMENT HARNESS — the one this lab could not have been built without.
 *
 * It is not a check and it never fails. It reports, for every frame in the deck,
 * what the browser actually did with the question: the type size, the measure,
 * how many lines it wrapped to, and the width of each line individually via
 * `Range.getClientRects()`.
 *
 *   node measure.mjs [url] [count]
 *
 * WHY IT EXISTS, WHICH IS THE ONLY INTERESTING THING ABOUT IT
 *
 * The four harnesses this deck inherits from the kit measure whether something is
 * WRONG: off the frame, inside the video rectangle, off the datum, missing its
 * mark. None of them can see the thing that goes wrong on a question frame, which
 * is a sentence set at a size that wraps to five lines. Five lines is not an
 * overflow, it is not a collision and it is not drift; it is a legal, tidy,
 * unreadable frame, and `qa.mjs` will report it CLEAN forever.
 *
 * Every type size in `askChrome.tsx` was guessed in the first pass from the kit's
 * own scale and the guess was wrong on all four frames. This is what caught it:
 *
 *   `SpotlightAsk`     44px / 840   4 lines, the last reading `changes?` at 211px
 *   `QuietField`       52px / 760   5 lines, the last reading `changes?` at 250px
 *   `MarkCut`          38px / 700   4 lines
 *   `AskWithSubject`   32px / 430   5 lines, in a 430px column
 *
 * The per-line widths are the part worth having, and they are why this reports
 * rects rather than just a count. `AskWithSubject` at 500px was still five lines
 * even though the arithmetic said four: the column was wide enough on average and
 * the actual word breaks landed at 410 to 464px inside it, so the slack went into
 * the ragged edge instead of into a line. A line count alone says "still wrong";
 * the rects say "the breaks are falling 40px short, widen it".
 *
 * IT ALSO REPORTS THE MONO ADVANCE, which is where the panel widths come from.
 * The face sets at exactly 8.0px per character at 14px, so the resolver's
 * 54-character ceiling is 432px of text, and `AskWithSubject`'s 466px cap is that
 * plus its padding. Nothing in this lab estimates a mono width any more.
 *
 * Kept in the lab rather than thrown away, because the next variant added here
 * will need it on its first render, and because it is the evidence behind every
 * number in `askChrome.tsx`. Run it against the dev server after any change to a
 * size, a measure or the fixture.
 */
import { chromium } from 'playwright'
import { SLIDE_COUNT, DEV_PORT } from './deck.config.mjs'

const URL = process.argv[2] ?? `http://localhost:${DEV_PORT}/?all`
const TOTAL = Number(process.argv[3] ?? SLIDE_COUNT)

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
)
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })

console.log('slide | size | measure | lines | line widths | stem box')

for (let i = 1; i <= TOTAL; i++) {
  await page.goto(`${URL}#/${i}`, { waitUntil: 'networkidle' })
  /* Same 2600ms the kit's harnesses settle for, and for the same reason: `?all`
     opens every click-gated step but does not fast-forward an entrance that plays
     on mount, and a measurement taken mid-entrance is a measurement of a
     transform. See the note in `qa.mjs`. */
  await page.waitForTimeout(2600)

  const info = await page.evaluate(() => {
    const out = {}
    /* The stem is the only `p.font-heading.font-bold` on any frame in this lab.
       `Stem` in `askChrome.tsx` is the single component that renders one, which
       is what makes this selector safe rather than lucky. */
    const stem = document.querySelector('p.font-heading.font-bold')
    if (stem) {
      const cs = getComputedStyle(stem)
      const r = stem.getBoundingClientRect()
      const range = document.createRange()
      range.selectNodeContents(stem)
      out.stem = {
        px: parseFloat(cs.fontSize),
        measure: Math.round(r.width),
        lines: Math.round(r.height / parseFloat(cs.lineHeight)),
        widths: [...range.getClientRects()].map((x) => Math.round(x.width)),
        box: [r.left, r.top, r.right, r.bottom].map(Math.round),
      }
    }
    /*
      THE MONO ADVANCE, VIA A RANGE AND NOT THE ELEMENT'S BOX.

      Every line in `SubjectPanel` is a `block` span, so its own rect is the full
      width of the panel and says nothing about the glyphs. A `Range` over its
      contents measures the text. The first version of this script read the
      element and reported 42.6px per character.
    */
    const mono = document.querySelector('.font-mono span.whitespace-pre')
    if (mono?.textContent) {
      const rg = document.createRange()
      rg.selectNodeContents(mono)
      const g = rg.getBoundingClientRect()
      out.mono = {
        px: parseFloat(getComputedStyle(mono).fontSize),
        perChar: +(g.width / mono.textContent.length).toFixed(2),
      }
    }
    const panel = document.querySelector('.overflow-hidden.rounded-card')
    if (panel) {
      const r = panel.getBoundingClientRect()
      out.panel = { w: Math.round(r.width), box: [r.left, r.top, r.right, r.bottom].map(Math.round) }
    }
    return out
  })

  const s = info.stem
  console.log(
    `${String(i).padStart(2)} | ${s ? `${s.px}px` : '  -  '} | ${
      s ? String(s.measure).padStart(4) : '  - '
    } | ${s ? s.lines : '-'} | ${s ? s.widths.join(' ') : '-'} | ${s ? s.box.join(',') : '-'}`,
  )
  if (info.mono) console.log(`   mono: ${info.mono.px}px, ${info.mono.perChar}px per character`)
  if (info.panel) console.log(`   panel: ${info.panel.w}px wide, box ${info.panel.box.join(',')}`)
}

await browser.close()
