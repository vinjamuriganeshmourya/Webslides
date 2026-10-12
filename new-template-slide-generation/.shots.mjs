import { chromium } from 'playwright'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
const [,, html, countArg, outDir] = process.argv
const count = Number(countArg)
const base = pathToFileURL(resolve(html)).href
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 })
page.on('pageerror', (e) => console.log('pageerror:', e.message))
for (let n = 1; n <= count; n++) {
  await page.goto(`${base}?nav=slide#/${n}`, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(n === 1 ? 2500 : 1800)
  await page.screenshot({ path: resolve(outDir, `slide-${String(n).padStart(2, '0')}.png`) })
  const hash = await page.evaluate(() => location.hash)
  console.log(n, hash)
}
await browser.close()
