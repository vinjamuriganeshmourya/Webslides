// print the ancestor chain (rects) of the element holding a text, on a slide at a press
import { chromium } from 'playwright-core'
const [port, slide, presses, text] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
await p.goto(`http://localhost:${port}/?nav=steps&noauto#/${slide}`, { waitUntil: 'load' })
await p.waitForTimeout(2200)
for (let k = 1; k < Number(presses); k++) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(1600) }
const rows = await p.evaluate((text) => {
  const all = document.evaluate(`//*[contains(text(),${JSON.stringify(text)})]`, document, null, 7, null); const r = all.snapshotLength ? all.snapshotItem(all.snapshotLength - 1) : null
  if (!r) return ['NOT FOUND']
  const out = []
  let el = r
  for (let i = 0; i < 9 && el && el !== document.body; i++) {
    const b = el.getBoundingClientRect(); const cs = getComputedStyle(el)
    out.push(`${el.tagName.toLowerCase()} cls="${(el.className||'').toString().slice(0,60)}" x=${b.left.toFixed(0)} y=${b.top.toFixed(0)} w=${b.width.toFixed(0)} h=${b.height.toFixed(0)} pad=${cs.paddingTop}/${cs.paddingBottom} ov=${cs.overflow} txt="${(el.textContent||'').trim().slice(0,30)}"`)
    el = el.parentElement
  }
  return out
}, text)
console.log(`slide ${slide} press ${presses} "${text}"`); for (const r of rows) console.log('  ' + r)
await b.close()
