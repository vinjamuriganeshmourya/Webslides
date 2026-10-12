// screenshots mid-turn on slide 3 after one press
import { chromium } from 'playwright-core'
const [url, out] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
await p.goto(url, { waitUntil: 'load' })
await p.waitForTimeout(2200)
await p.keyboard.press('ArrowRight')
const t0 = Date.now()
for (const at of [180, 330, 480, 900]) {
  const wait = at - (Date.now() - t0); if (wait > 0) await p.waitForTimeout(wait)
  await p.screenshot({ path: `${out}/flip-${at}.png`, clip: { x: 60, y: 330, width: 1160, height: 130 }, timeout: 15000 })
}
await b.close()
