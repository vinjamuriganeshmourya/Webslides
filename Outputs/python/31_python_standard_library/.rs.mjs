// scratch: measure build steps per slide by driving the player (a copy of workflow/export/build-reveal-steps.mjs
// with a hash test that accepts `#/n-slug`, run against `?nav=slide&x=` so a plain arrow is a whole slide).
// node .rs.mjs "http://localhost:5260/?nav=slide&noauto&x=" 25   (noauto: eight slides open with Autoplay on)
import { chromium } from 'playwright-core'
import fs from 'node:fs'
const URL = process.argv[2]
const TOTAL = Number(process.argv[3])
const MAX_PRESSES = 40
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
const steps = []
for (let i = 1; i <= TOTAL; i++) {
  await page.goto(`${URL}#/${i}`, { waitUntil: 'load' })
  await page.waitForTimeout(1500)
  let presses = 0
  for (; presses < MAX_PRESSES; presses++) {
    await page.keyboard.press('Control+ArrowRight')
    await page.waitForTimeout(160)
    const hash = await page.evaluate(() => window.location.hash)
    const n = Number(/^#\/(\d+)/.exec(hash)?.[1])
    if (n !== i) break
  }
  steps.push(presses === MAX_PRESSES ? 0 : presses)
  process.stdout.write(`${i}:${steps[i - 1]} `)
}
process.stdout.write('\n')
await browser.close()
fs.writeFileSync('.revealSteps.measured.json', JSON.stringify(steps))
