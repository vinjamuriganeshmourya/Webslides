// scratch: measure each slide's build steps on the dev server (the player's own count), slug-tolerant hash test, MAX 50 for G2's 41
import { chromium } from 'playwright-core'
const URL = process.argv[2] ?? 'http://localhost:5259'
const TOTAL = Number(process.argv[3] ?? 36)
const MAX = 50
const b = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
const steps = []
for (let i = 1; i <= TOTAL; i++) {
  await p.goto(`${URL}/?nav=slide&x=${i}#/${i}`, { waitUntil: 'load' })
  await p.waitForTimeout(500)
  let presses = 0
  for (; presses < MAX; presses++) {
    await p.keyboard.press('Control+ArrowRight')
    await p.waitForTimeout(120)
    const hash = await p.evaluate(() => window.location.hash)
    if ((hash.match(/^#\/(\d+)/) ?? [])[1] !== String(i)) break
  }
  steps.push(i === TOTAL && presses === MAX ? 0 : presses)
  process.stdout.write(`${i}:${steps[i - 1]} `)
}
console.log('\n' + JSON.stringify(steps))
await b.close()
