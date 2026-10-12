import { chromium } from 'playwright'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
const [,, html, slidesArg, outDir, dprArg] = process.argv
const base = pathToFileURL(resolve(html)).href
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: Number(dprArg ?? 1.5) })
for (const n of slidesArg.split(',').map(Number)) {
  await page.goto(`${base}?nav=steps#/${n}`, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1500)
  const presses = await page.evaluate(() => Number(document.querySelector('[data-presses]')?.getAttribute('data-presses') ?? 0))
  for (let k = 0; k <= presses; k++) {
    if (k > 0) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(1400) }
    await page.screenshot({ path: resolve(outDir, `s${n}-p${k}.png`) })
  }
  console.log(`slide ${n}: ${presses} presses shot`)
}
await browser.close()
