// scratch: node .shot.mjs <slide> <maxSteps> [settleMs] -> shots/s<slide>-<step>.png
import { chromium } from 'playwright-core'
const [slide, steps = '0', settle = '1600'] = process.argv.slice(2)
const out = process.env.OUT
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
const errs = []
p.on('pageerror', (e) => errs.push(String(e)))
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
await p.goto(`http://localhost:5257/?nav=steps&noauto&v=${slide}#/${slide}`, { waitUntil: 'load' })
await p.waitForTimeout(2200)
for (let s = 0; s <= +steps; s++) {
  if (s > 0) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(+settle) }
  await p.screenshot({ path: `${out}/s${slide}-${String(s).padStart(2, '0')}.png` })
}
if (errs.length) console.log('ERRORS', errs.slice(0, 5).join('\n'))
await b.close()
