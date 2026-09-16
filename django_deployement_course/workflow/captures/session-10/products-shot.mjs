/* Log in, then open Products: the frame that proves the whole chain works.
 * Same shape as login-shot.mjs, one click further in. */
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
page.on('response', (r) => {
  if (r.url().includes('/api/')) lines.push(`[response] ${r.status()} ${r.url()}`)
})
page.on('console', (m) => m.type() === 'error' && lines.push(`[error] ${m.text()}`))

await page.goto(site, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(5000)
await page.fill('input[placeholder="Username"]', 'ravi')
await page.fill('input[placeholder="Password"]', 'nxtwave123')
await page.click('button:has-text("Login")')
await page.waitForTimeout(7000)
await page.click('text=Products')
await page.waitForTimeout(8000)

await page.screenshot({ path: path.join(here, `${name}.png`), timeout: 20000 })
fs.writeFileSync(path.join(here, `${name}.console.txt`), lines.join('\n') + '\n')
console.log(`saved ${name}.png at ${page.url()}`)
console.log(lines.join('\n'))
await browser.close()
