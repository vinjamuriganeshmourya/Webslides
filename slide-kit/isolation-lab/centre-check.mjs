/**
 * CENTRE CHECK — is the figure centred in the column it occupies?
 *
 * The review's requirement: "the center is missing from many variants ensure the
 * component are center in the content slides". A 4px skew is not something an eye
 * judges reliably, so this measures it: for every slide that carries a
 * `[data-figure-col]`, it reads the column's rect and its figure child's rect and
 * prints the left and right gap between them. Over about 24px of skew is
 * off-centre.
 *
 * It also prints the gap between the figure and the SLIDE STAGE, because that is
 * the number session 6's one-column figure slides show as 0/0, and a reader of
 * this lab needs to know that a two-column slide cannot be 0/0 against the stage
 * and should not be expected to be.
 *
 *   export CHROME_PATH=/opt/google/chrome/chrome
 *   node centre-check.mjs
 */
import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'

const cfg = JSON.parse(readFileSync(new URL('./deck.config.json', import.meta.url)))
const BASE = process.argv[2] ?? `http://localhost:${cfg.devPort}`
const COUNT = Number(process.argv[3] ?? cfg.slideCount)
const TOL = 24

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })

console.log(`centre datum: figure vs its column   ·   tolerance ${TOL}px\n`)
let bad = 0

for (let n = 1; n <= COUNT; n++) {
  await page.goto(`${BASE}/?all#/${n}`, { waitUntil: 'load' })
  await page.waitForTimeout(2600)
  const m = await page.evaluate(() => {
    const col = document.querySelector('[data-figure-col]')
    if (!col) return null
    const fig = col.firstElementChild
    if (!fig) return null
    const stage = document.querySelector('.slide-canvas') ?? document.body
    const c = col.getBoundingClientRect()
    const f = fig.getBoundingClientRect()
    const s = stage.getBoundingClientRect()
    const title = document.querySelector('h1, h2')?.textContent ?? ''
    return {
      title,
      colLeft: Math.round(f.left - c.left),
      colRight: Math.round(c.right - f.right),
      stageLeft: Math.round(f.left - s.left),
      stageRight: Math.round(s.right - f.right),
      figW: Math.round(f.width),
      colW: Math.round(c.width),
      /* The whole two-column row against the stage. A two-column slide cannot be
         0/0 against the stage the way a one-column figure slide is, but the ROW
         it sits in must be, or the pair is off-centre even when each half is
         centred in its own half. */
      rowLeft: col.parentElement ? Math.round(col.parentElement.getBoundingClientRect().left - s.left) : -1,
      rowRight: col.parentElement ? Math.round(s.right - col.parentElement.getBoundingClientRect().right) : -1,
      ...(() => {
        /*
          VERTICAL. The block is the whole two-column unit plus the conclusion
          line; the WELL is `ContentSlide`'s `flex-1` container, which is what
          centres it. Found by walking up rather than by a selector, because the
          well is kit markup this lab must not edit and therefore cannot tag.
        */
        const block = document.querySelector('[data-block]')
        let well = block?.parentElement ?? null
        while (well && !String(well.className).includes('flex-1')) well = well.parentElement
        if (!block || !well) return {}
        const b = block.getBoundingClientRect()
        const w = well.getBoundingClientRect()
        /* THE DATUM: the figure's first row against the points' first row. */
        const bullet = col.parentElement?.querySelector('li')
        const figTop = Math.round(f.top - s.top)
        return {
          wellTop: Math.round(w.top - s.top),
          wellBottom: Math.round(w.bottom - s.top),
          blockTop: Math.round(b.top - w.top),
          blockBottom: Math.round(w.bottom - b.bottom),
          blockH: Math.round(b.height),
          wellH: Math.round(w.height),
          figTop,
          bulletTop: bullet ? Math.round(bullet.getBoundingClientRect().top - s.top) : -1,
        }
      })(),
    }
  })
  if (!m) continue
  const skew = Math.abs(m.colLeft - m.colRight)
  const flag = skew > TOL ? 'OFF-CENTRE' : 'ok'
  if (skew > TOL) bad++
  const vSkew = Math.abs(m.blockTop - m.blockBottom)
  const datum = Math.abs(m.figTop - m.bulletTop)
  const vFlag = vSkew > TOL ? 'V-OFF' : 'v-ok'
  const dFlag = datum > 12 ? 'DATUM-OFF' : 'datum-ok'
  if (vSkew > TOL) bad++
  if (datum > 12) bad++
  console.log(
    `slide ${String(n).padStart(2)}  ${flag.padEnd(10)} ` +
      `column gaps L${m.colLeft} R${m.colRight} (skew ${skew}px)  ` +
      `figure ${m.figW} in ${m.colW}  ·  row vs stage L${m.rowLeft} R${m.rowRight}`,
  )
  console.log(
    `          ${vFlag.padEnd(10)} ` +
      `well ${m.wellTop}..${m.wellBottom} (${m.wellH})  block ${m.blockH}  ` +
      `gaps T${m.blockTop} B${m.blockBottom} (skew ${vSkew}px)  ` +
      `${dFlag} figure@${m.figTop} bullet@${m.bulletTop}`,
  )
}

console.log(bad === 0 ? '\nCENTRED: every figure is centred in its column.' : `\n${bad} off-centre`)
await browser.close()
process.exit(bad === 0 ? 0 : 1)
