/* Capture the deployed app in a real browser, at the same size as the AWS
 * console captures (1568x741), and record whatever the browser console says.
 *
 * The console errors matter as much as the picture: the CORS failure in
 * concept 6 is only visible there, and a slide that shows it has to show the
 * real text.
 *
 * Usage: node shoot.mjs <url> <out-name> [waitMs]
 * Writes <out-name>.png beside this file, and prints the console log. */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const [url, name, waitMs = '9000'] = process.argv.slice(2)
/* timeout 0 on goto lets Chrome render its OWN error page for a dead port,
 * which is the picture the slide needs. Playwright's own timeout would
 * abort first and leave a blank frame. */
if (!url || !name) {
  console.error('usage: node shoot.mjs <url> <out-name> [waitMs]')
  process.exit(1)
}

/* fileURLToPath, not URL.pathname: a repo path with a space in it
 * ('Web Slides') comes back percent-encoded otherwise, and the file lands
 * in a directory nobody asked for. */
const here = path.dirname(fileURLToPath(import.meta.url))
/* Headed, not headless: headless Chrome paints a blank frame for a network
 * error, so "This site can't be reached" never appears. The whole point of a
 * timeout capture is that page. */
const browser = await chromium.launch({
  headless: process.env.HEADED ? false : true,
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
})
const page = await browser.newPage({ viewport: { width: 1568, height: 741 } })

const lines = []
page.on('console', (m) => lines.push(`[${m.type()}] ${m.text()}`))
page.on('pageerror', (e) => lines.push(`[pageerror] ${e}`))
page.on('requestfailed', (r) =>
  lines.push(`[requestfailed] ${r.url()} ${r.failure()?.errorText ?? ''}`),
)

try {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 })
} catch (err) {
  lines.push(`[navigation] ${err.message.split('\n')[0]}`)
}
await page.waitForTimeout(Number(waitMs))

/* A page that never finishes loading (a dropped connection on a closed port)
 * keeps the screenshot call waiting forever, so stop it first. */
await page.evaluate(() => window.stop()).catch(() => {})

const png = path.join(here, `${name}.png`)
await page.screenshot({ path: png, timeout: 20000 })
fs.writeFileSync(path.join(here, `${name}.console.txt`), lines.join('\n') + '\n')

console.log(`saved ${png}`)
console.log(lines.length ? lines.join('\n') : '(browser console was silent)')
await browser.close()
