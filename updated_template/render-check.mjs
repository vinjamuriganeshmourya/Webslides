// Renders every slide of the built single-file deck to workflow/qa-shots/ at
// 1920x1080, so the deliverable can be held against slidestraining/ frame for
// frame. Reads slideCount and the html name from deck.config.json.
//
//   npm run build:html && npm run render-check
//   node render-check.mjs http://localhost:5259      (or against the dev server)
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { SLIDE_COUNT, HTML_FILE } from './deck.config.mjs'

const base = process.argv[2] ?? pathToFileURL(resolve(HTML_FILE)).href
const outDir = resolve('workflow/qa-shots')
mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })
page.on('pageerror', (e) => console.log('pageerror:', e.message))

for (let n = 1; n <= SLIDE_COUNT; n++) {
  await page.goto(`${base}#/${n}`, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(300)
  const file = resolve(outDir, `slide-${String(n).padStart(2, '0')}.png`)
  await page.screenshot({ path: file })
  console.log(`slide ${n}/${SLIDE_COUNT} -> ${file}`)
}

await browser.close()
