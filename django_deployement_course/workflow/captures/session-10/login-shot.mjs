/* Log in through the real UI and capture what the browser sees.
 *
 * The login POST is the first request the frontend makes to the API, so it is
 * where both deployment bugs surface: VITE_API_BASE_URL pointing at localhost
 * (connection refused, because localhost is the VISITOR's machine), and the
 * backend's CORS allowlist not naming this origin (blocked by CORS policy).
 * Both are invisible on the page itself and loud in the console, which is why
 * the console log is saved beside the picture.
 *
 * Usage: node login-shot.mjs <site-url> <out-name> */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const [site, name] = process.argv.slice(2)
const here = path.dirname(fileURLToPath(import.meta.url))

const browser = await chromium.launch({
  headless: !process.env.HEADED,
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
})
const page = await browser.newPage({ viewport: { width: 1568, height: 741 } })

const lines = []
page.on('console', (m) => lines.push(`[${m.type()}] ${m.text()}`))
page.on('pageerror', (e) => lines.push(`[pageerror] ${e}`))
page.on('requestfailed', (r) =>
  lines.push(`[requestfailed] ${r.method()} ${r.url()} ${r.failure()?.errorText ?? ''}`),
)
page.on('response', (r) => {
  if (r.url().includes('/api/')) lines.push(`[response] ${r.status()} ${r.url()}`)
})

await page.goto(site, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(6000)

await page.fill('input[placeholder="Username"]', 'ravi')
await page.fill('input[placeholder="Password"]', 'nxtwave123')
await page.click('button:has-text("Login")')
await page.waitForTimeout(9000)

await page.screenshot({ path: path.join(here, `${name}.png`), timeout: 20000 })
fs.writeFileSync(path.join(here, `${name}.console.txt`), lines.join('\n') + '\n')
console.log(`saved ${name}.png at ${page.url()}`)
console.log(lines.join('\n'))
await browser.close()
